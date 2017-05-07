/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/

// jqxDraw
(function ($) {
    $.jqx.jqxWidget("jqxDraw", "", {});

    $.extend($.jqx._jqxDraw.prototype,
    {
        defineInstance: function () {
            var settings = {
                renderEngine: ''
            };

            $.extend(true, this, settings);

            var functions = [
                'clear',
                'on',
                'off',
                'removeElement',
                'attr',
                'getAttr',
                'line',
                'circle',
                'rect',
                'path',
                'pieslice',
                'text',
                'measureText'];

            for (var i in functions) {
                this._addFn($.jqx._jqxDraw.prototype, functions[i]);
            }
            return settings;
        },

        _addFn: function (target, name) {
            if (target[name])
                return;

            target[name] = function () {
                return this.renderer[name].apply(this.renderer, arguments);
            };
        },

        createInstance: function (args) {
        },

        /** @private */
        _initRenderer: function (host) {
            return $.jqx.createRenderer(this, host);
        },

        /** @private */
        _internalRefresh: function () {
            var self = this;

            // validate visiblity
            if ($.jqx.isHidden(self.host))
                return;

            if (!self.renderer) {
                self.host.empty();
                self._initRenderer(self.host);
            }

            var renderer = self.renderer;
            if (!renderer)
                return;

            var rect = renderer.getRect();

            self._render({ x: 1, y: 1, width: rect.width, height: rect.height });

            if (renderer instanceof $.jqx.HTML5Renderer)
                renderer.refresh();
        },


        /** @private */
        _saveAsImage: function (type, fileName, exportServer, isUploadOnly) {
            return $.jqx._widgetToImage(this, type, fileName, exportServer, isUploadOnly);
        },

        /** @private */
        _render: function (rect) {
            var self = this;
            var renderer = self.renderer;

            self._plotRect = rect;
        },

        // Public API
        refresh: function () {
            this._internalRefresh();
        },

        getSize: function () {
            var rect = this._plotRect;
            return { width: rect.width, height: rect.height };
        },

        saveAsPNG: function (filename, exportServer, isUploadOnly) {
            return this._saveAsImage('png', filename, exportServer, isUploadOnly);
        },

        saveAsJPEG: function (filename, exportServer, isUploadOnly) {
            return this._saveAsImage('jpeg', filename, exportServer, isUploadOnly);
        }
        // End of Public API

    });
})(jqxBaseFramework); // jqxDraw

//////////////////////////////////////////
// Rendering API & Helper functions
(function ($) {
    /** @private */
    $.jqx.toGreyScale = function (color) {
        if (color.indexOf('#') == -1)
            return color;

        var rgb = $.jqx.cssToRgb(color);
        rgb[0] = rgb[1] = rgb[2] = Math.round(0.3 * rgb[0] + 0.59 * rgb[1] + 0.11 * rgb[2]);
        var hex = $.jqx.rgbToHex(rgb[0], rgb[1], rgb[2]);
        return '#' + hex[0] + hex[1] + hex[2];
    },

    /** @private */
    $.jqx.adjustColor = function (color, adj) {
        if (typeof (color) != 'string')
            return '#000000';

        if (color.indexOf('#') == -1)
            return color;

        var rgb = $.jqx.cssToRgb(color);
        var hsl = $.jqx.rgbToHsl(rgb);
        hsl[2] = Math.min(1, hsl[2] * adj);
        hsl[1] = Math.min(1, hsl[1] * adj * 1.1);
        rgb = $.jqx.hslToRgb(hsl);

        var color = '#';
        for (var i = 0; i < 3; i++) {
            var c = Math.round(rgb[i]);
            c = $.jqx.decToHex(c);
            if (c.toString().length == 1)
                color += '0';

            color += c;
        }

        return color.toUpperCase();
    }

    /** @private */
    $.jqx.decToHex = function (dec) {
        return dec.toString(16);
    }

    /** @private */
    $.jqx.hexToDec = function (hex) {
        return parseInt(hex, 16);
    }

    /** @private */
    $.jqx.rgbToHex = function (r, g, b) {
        return [$.jqx.decToHex(r), $.jqx.decToHex(g), $.jqx.decToHex(b)];
    }

    /** @private */
    $.jqx.hexToRgb = function (h, e, x) {
        return [$.jqx.hexToDec(h), $.jqx.hexToDec(e), $.jqx.hexToDec(x)];
    }

    /** @private */
    $.jqx.cssToRgb = function (color) {
        if (color.indexOf('rgb') <= -1) {
            return $.jqx.hexToRgb(color.substring(1, 3), color.substring(3, 5), color.substring(5, 7));
        }
        return color.substring(4, color.length - 1).split(',');
    }

    /** @private */
    $.jqx.hslToRgb = function (hsl) {
        var h = parseFloat(hsl[0]);
        var s = parseFloat(hsl[1]);
        var l = parseFloat(hsl[2]);

        if (s == 0) {
            r = g = b = l;
        } else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = $.jqx.hueToRgb(p, q, h + 1 / 3);
            g = $.jqx.hueToRgb(p, q, h);
            b = $.jqx.hueToRgb(p, q, h - 1 / 3);
        }
        return [r * 255, g * 255, b * 255];
    };

    /** @private */
    $.jqx.hueToRgb = function (p, q, t) {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;

        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        else if (t < 1 / 2)
            return q;
        else if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;

        return p;

    };

    /** @private */
    $.jqx.rgbToHsl = function (rgb) {
        var r = parseFloat(rgb[0]) / 255;
        var g = parseFloat(rgb[1]) / 255;
        var b = parseFloat(rgb[2]) / 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0;
        } else {
            var diff = max - min;
            s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
            switch (max) {
                case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
                case g: h = (b - r) / diff + 2; break;
                case b: h = (r - g) / diff + 4; break;
            }
            h /= 6;
        }

        return [h, s, l];
    };

    $.jqx.swap = function (x, y) {
        var tmp = x;
        x = y;
        y = tmp;
    }

    $.jqx.getNum = function (arr) {
        if (!$.isArray(arr)) {
            if (isNaN(arr))
                return 0;
        }
        else {
            for (var i = 0; i < arr.length; i++)
                if (!isNaN(arr[i]))
                    return arr[i];
        }

        return 0;
    }

    $.jqx._ptdist = function (x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    $.jqx._ptrnd = function (val) {
        if (!document.createElementNS) {
            if (Math.round(val) == val)
                return val;
            return $.jqx._rnd(val, 1, false, true);
        }

        var rnd = $.jqx._rnd(val, 0.5, false, true);
        if (Math.abs(rnd - Math.round(rnd)) != 0.5) {
            return rnd > val ? rnd - 0.5 : rnd + 0.5;
        }
        return rnd;
    }

    $.jqx._ptRotate = function (x, y, cx, cy, angle) {
        var radius = Math.sqrt(Math.pow(Math.abs(x - cx), 2) + Math.pow(Math.abs(y - cy), 2));
        var currAngle = Math.asin((x - cx) / radius);
        var newAngle = currAngle + angle;

        x = cx + Math.cos(newAngle) * radius;
        y = cy + Math.sin(newAngle) * radius;

        return { x: x, y: y };
    };

    $.jqx._rup = function (n) {
        var nr = Math.round(n);
        if (n > nr)
            nr++;

        return nr;
    }

    $.jqx.log = function (val, base) {
        return Math.log(val) / (base ? Math.log(base) : 1);
    }

    $.jqx._mod = function (a, b) {
        var min = Math.abs(a > b ? b : a);
        var scale = 1;
        if (min != 0) {
            while (min * scale < 100)
                scale *= 10;
        }

        a = a * scale;
        b = b * scale;

        return (a % b) / scale;
    }

    $.jqx._rnd = function (num, unit, toGreater, fast) {
        if (isNaN(num))
            return num;

        if (undefined === fast)
            fast = true;

        var a = num - ((fast == true) ? num % unit : $.jqx._mod(num, unit));
        if (num == a)
            return a;

        if (toGreater) {
            if (num > a)
                a += unit;
        }
        else {
            if (a > num)
                a -= unit;
        }

        return (unit == 1) ? Math.round(a) : a;
    }

    $.jqx.commonRenderer = {
        pieSlicePath: function (x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset) {
            if (!outerRadius)
                outerRadius = 1;

            var diff = Math.abs(angleFrom - angleTo);
            var lFlag = diff > 180 ? 1 : 0;
            if (diff >= 360) {
                angleTo = angleFrom + 359.99;
            }
            var radFrom = angleFrom * Math.PI * 2 / 360;
            var radTo = angleTo * Math.PI * 2 / 360;

            var x1 = x, x2 = x, y1 = y, y2 = y;

            var isDonut = !isNaN(innerRadius) && innerRadius > 0;

            if (isDonut)
                centerOffset = 0;

            if (centerOffset + innerRadius > 0) {
                if (centerOffset > 0) {
                    var midAngle = diff / 2 + angleFrom;
                    var radMid = midAngle * Math.PI * 2 / 360;

                    x += centerOffset * Math.cos(radMid);
                    y -= centerOffset * Math.sin(radMid);
                }

                if (isDonut) {
                    var inR = innerRadius;
                    x1 = x + inR * Math.cos(radFrom);
                    y1 = y - inR * Math.sin(radFrom);
                    x2 = x + inR * Math.cos(radTo);
                    y2 = y - inR * Math.sin(radTo);
                }
            }

            var x3 = x + outerRadius * Math.cos(radFrom);
            var x4 = x + outerRadius * Math.cos(radTo);
            var y3 = y - outerRadius * Math.sin(radFrom);
            var y4 = y - outerRadius * Math.sin(radTo);

            var path = '';

            var isPartialCircle = (Math.abs(Math.abs(angleTo - angleFrom) - 360) > 0.02 );

            if (isDonut) {
                path = 'M ' + x2 + ',' + y2;
                path += ' a' + innerRadius + ',' + innerRadius;
                path += ' 0 ' + lFlag + ',1 ' + (x1 - x2) + ',' + (y1 - y2);
                if (isPartialCircle)
                    path += ' L' + x3 + ',' + y3;
                else
                    path += ' M' + x3 + ',' + y3;

                path += ' a' + outerRadius + ',' + outerRadius;
                path += ' 0 ' + lFlag + ',0 ' + (x4 - x3) + ',' + (y4 - y3);
                
                if (isPartialCircle)
                    path += ' Z';
            }
            else {
                path = 'M ' + x4 + ',' + y4;
                path += ' a' + outerRadius + ',' + outerRadius;
                path += ' 0 ' + lFlag + ',1 ' + (x3 - x4) + ',' + (y3 - y4);

                if (isPartialCircle)
                {
                    path += ' L' + x + ',' + y;
                    path += ' Z';
                }
            }

            return path;
        },

        measureText: function (text, angle, params, includeTextPartsInfo, renderer) {
            var textPartsInfo = renderer._getTextParts(text, angle, params);
            var tw = textPartsInfo.width;
            var th = textPartsInfo.height;

            if (false == includeTextPartsInfo)
                th /= 0.6;

            var retVal = {};

            if (isNaN(angle))
                angle = 0;

            if (angle == 0) {
                retVal = { width: $.jqx._rup(tw), height: $.jqx._rup(th) };
            }
            else {
                var rads = angle * Math.PI * 2 / 360;
                var sn = Math.abs(Math.sin(rads));
                var cs = Math.abs(Math.cos(rads));
                var bh = Math.abs(tw * sn + th * cs);
                var bw = Math.abs(tw * cs + th * sn);

                retVal = { width: $.jqx._rup(bw), height: $.jqx._rup(bh) };
            }

            if (includeTextPartsInfo)
                retVal.textPartsInfo = textPartsInfo;

            return retVal;
        },


        alignTextInRect: function (x, y, width, height, textWidth, textHeight, halign, valign, angle, rotateAround) {
            var rads = angle * Math.PI * 2 / 360;
            var sn = Math.sin(rads);
            var cs = Math.cos(rads);

            var h2 = textWidth * sn;
            var w2 = textWidth * cs;

            if (halign == 'center' || halign == '' || halign == 'undefined')
                x = x + width / 2;
            else if (halign == 'right')
                x = x + width;

            if (valign == 'center' || valign == 'middle' || valign == '' || valign == 'undefined')
                y = y + height / 2;
            else if (valign == 'bottom')
                y += height - textHeight / 2;
            else if (valign == 'top')
                y += textHeight / 2;

            rotateAround = rotateAround || '';

            var adjustY = 'middle';
            if (rotateAround.indexOf('top') != -1)
                adjustY = 'top';
            else if (rotateAround.indexOf('bottom') != -1)
                adjustY = 'bottom';

            var adjustX = 'center';
            if (rotateAround.indexOf('left') != -1)
                adjustX = 'left';
            else if (rotateAround.indexOf('right') != -1)
                adjustX = 'right';

            if (adjustX == 'center') {
                x -= w2 / 2;
                y -= h2 / 2;
            }
            else if (adjustX == 'right') {
                x -= w2;
                y -= h2;
            }

            if (adjustY == 'top') {
                x -= textHeight * sn;
                y += textHeight * cs;
            }
            else if (adjustY == 'middle') {
                x -= textHeight * sn / 2;
                y += textHeight * cs / 2;
            }

            x = $.jqx._rup(x);
            y = $.jqx._rup(y);

            return { x: x, y: y };
        }
    }

    $.jqx.svgRenderer = function () { }

    $.jqx.svgRenderer.prototype = {
        _svgns: "http://www.w3.org/2000/svg",

        init: function (host) {
            var s = "<table class=tblChart cellspacing='0' cellpadding='0' border='0' align='left' valign='top'><tr><td colspan=2 class=tdTop></td></tr><tr><td class=tdLeft></td><td><div class='chartContainer' style='position:relative' onselectstart='return false;'></div></td></tr></table>";
            host.append(s);
            this.host = host;

            var container = host.find(".chartContainer");
            container[0].style.width = host.width() + 'px';
            container[0].style.height = host.height() + 'px';

            var offset;
            try {
                var svg = document.createElementNS(this._svgns, 'svg');
                svg.setAttribute('id', 'svgChart');
                svg.setAttribute('version', '1.1');
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.setAttribute('overflow', 'hidden');
                container[0].appendChild(svg);
                this.canvas = svg;
            }
            catch (e) {
                return false;
            }

            this._id = new Date().getTime();
            this.clear();

            this._layout();
            this._runLayoutFix();

            return true;
        },

        getType: function () {
            return 'SVG';
        },

        refresh: function () {
        },

        /** @private */
        _runLayoutFix: function () {
            var self = this;
            this._fixLayout();
        },

        /** @private */
        _fixLayout: function () {
            var rect = this.canvas.getBoundingClientRect();

            var pxleft = (parseFloat(rect.left) == parseInt(rect.left));
            var pxtop = (parseFloat(rect.top) == parseInt(rect.top));

            if ($.jqx.browser.msie) {
                var pxleft = true, pxtop = true;
                var el = this.host;
                var xdiff = 0, ydiff = 0;
                while (el && el.position && el[0].parentNode) {
                    var pos = el.position();
                    xdiff += parseFloat(pos.left) - parseInt(pos.left);
                    ydiff += parseFloat(pos.top) - parseInt(pos.top);
                    el = el.parent();
                }
                pxleft = parseFloat(xdiff) == parseInt(xdiff);
                pxtop = parseFloat(ydiff) == parseInt(ydiff);
            }

            if (!pxleft)
                this.host.find(".tdLeft")[0].style.width = '0.5px';
            if (!pxtop)
                this.host.find(".tdTop")[0].style.height = '0.5px';

        },

        /** @private */
        _layout: function () {
            var container = this.host.find(".chartContainer");
            this._width = Math.max($.jqx._rup(this.host.width()) - 1, 0);
            this._height = Math.max($.jqx._rup(this.host.height()) - 1, 0);

            container[0].style.width = this._width;
            container[0].style.height = this._height;

            this._fixLayout();
        },

        getRect: function () {
            return { x: 0, y: 0, width: this._width, height: this._height };
        },

        getContainer: function () {
            var container = this.host.find(".chartContainer");
            return container;
        },

        clear: function () {
            while (this.canvas.childElementCount > 0) {
                this.removeElement(this.canvas.firstElementChild);
            }

            this._defaultParent = undefined;
            this._defs = document.createElementNS(this._svgns, 'defs');
            this._gradients = {};
            this.canvas.appendChild(this._defs);
        },

        removeElement: function (element) {
            if (undefined == element)
                return;

            this.removeHandler(element);

            try {
                while (element.firstChild) {
                    this.removeElement(element.firstChild);
                }

                if (element.parentNode)
                    element.parentNode.removeChild(element);
                else
                    this.canvas.removeChild(element);
            }
            catch (error) {
                var a = error;
            }
        },

        /** @private */
        _openGroups: [],

        beginGroup: function () {
            var parent = this._activeParent();
            var g = document.createElementNS(this._svgns, 'g');
            parent.appendChild(g);
            this._openGroups.push(g);

            return g;
        },

        endGroup: function () {
            if (this._openGroups.length == 0)
                return;

            this._openGroups.pop();
        },

        /** @private */
        _activeParent: function () {
            return this._openGroups.length == 0 ? this.canvas : this._openGroups[this._openGroups.length - 1];
        },

        createClipRect: function (rect) {
            var c = document.createElementNS(this._svgns, 'clipPath');
            var r = document.createElementNS(this._svgns, 'rect');
            this.attr(r, { x: rect.x, y: rect.y, width: rect.width, height: rect.height, fill: 'none' });

            this._clipId = this._clipId || 0;
            c.id = 'cl' + this._id + '_' + (++this._clipId).toString();
            c.appendChild(r);

            this._defs.appendChild(c);

            return c;
        },

        getWindowHref: function () {
            // Get modified href. This is needed to handle cases where the page uses <base> tags.

            var currentBrowser = $.jqx.browser;
            if (currentBrowser && currentBrowser.browser == 'msie' && currentBrowser.version < 10) {
                // return empty href for older IE versions
                return '';
            }

            var href = window.location.href;
            if (!href)
                return href;

            href = href.replace(/([\('\)])/g, '\\$1'); // escape brackets & quotes (Chrome)
            href = href.replace(/#.*$/, ''); // remove bookmark links

            return href;
        },

        setClip: function (elem, clip) {
            var url = 'url(' + this.getWindowHref() + '#' + clip.id + ')';
            return this.attr(elem, { 'clip-path': url });
        },

        /** @private */
        _clipId: 0,

        addHandler: function (element, event, fn) {
            if ($(element).on)
                $(element).on(event, fn);
            else
                $(element).bind(event, fn);
        },

        removeHandler: function (element, event, fn) {
            if ($(element).off)
                $(element).off(event, fn);
            else
                $(element).unbind(event, fn);
        },

        on: function (element, event, fn) {
            this.addHandler(element, event, fn);
        },

        off: function (element, event, fn) {
            this.removeHandler(element, event, fn);
        },

        shape: function (name, params) {
            var s = document.createElementNS(this._svgns, name);
            if (!s)
                return undefined;

            for (var param in params)
                s.setAttribute(param, params[param]);

            this._activeParent().appendChild(s);

            return s;
        },

        /** @private */
        _getTextParts: function (text, angle, params) {
            var textPartsInfo = { width: 0, height: 0, parts: [] };
            if (undefined === text)
                return textPartsInfo;

            var coeff = 0.6;
            var textParts = text.toString().split('<br>');

            var parent = this._activeParent();
            var txt = document.createElementNS(this._svgns, 'text');
            this.attr(txt, params);

            for (var i = 0; i < textParts.length; i++) {
                var textPart = textParts[i];

                var txtNode = txt.ownerDocument.createTextNode(textPart);
                txt.appendChild(txtNode);

                parent.appendChild(txt);
                var bbox;
                try {
                    bbox = txt.getBBox();
                }
                catch (e) {
                }

                var tw = $.jqx._rup(bbox.width);
                var th = $.jqx._rup(bbox.height * coeff);

                txt.removeChild(txtNode);

                textPartsInfo.width = Math.max(textPartsInfo.width, tw);
                textPartsInfo.height += th + (i > 0 ? 4 : 0);
                textPartsInfo.parts.push({ width: tw, height: th, text: textPart });
            }
            parent.removeChild(txt);

            return textPartsInfo;
        },

        /** @private */
        _measureText: function (text, angle, params, includeTextPartsInfo) {
            return $.jqx.commonRenderer.measureText(text, angle, params, includeTextPartsInfo, this);
        },

        measureText: function (text, angle, params) {
            return this._measureText(text, angle, params, false);
        },

        text: function (text, x, y, width, height, angle, params, clip, halign, valign, rotateAround) {
            var sz = this._measureText(text, angle, params, true);
            var textPartsInfo = sz.textPartsInfo;
            var textParts = textPartsInfo.parts;
            var gClip;
            if (!halign)
                halign = 'center';
            if (!valign)
                valign = 'center';

            if (textParts.length > 1 || clip)
                gClip = this.beginGroup();

            if (clip) {
                var crect = this.createClipRect({ x: $.jqx._rup(x) - 1, y: $.jqx._rup(y) - 1, width: $.jqx._rup(width) + 2, height: $.jqx._rup(height) + 2 });
                this.setClip(gClip, crect);
            }

            //this.rect(x, y, width, height, {fill: 'yellow', stroke: 'red'});

            var parent = this._activeParent();

            var tw = 0, th = 0;
            var coeff = 0.6;

            tw = textPartsInfo.width;
            th = textPartsInfo.height;

            if (isNaN(width) || width <= 0)
                width = tw;
            if (isNaN(height) || height <= 0)
                height = th;

            var w = width || 0;
            var h = height || 0;

            if (!angle || angle == 0) {
                y += th;

                if (valign == 'center' || valign == 'middle')
                    y += (h - th) / 2;
                else if (valign == 'bottom')
                    y += h - th;

                if (!width)
                    width = tw;

                if (!height)
                    height = th;

                var parent = this._activeParent();
                var yOffset = 0;
                for (var i = textParts.length - 1; i >= 0; i--) {
                    var txt = document.createElementNS(this._svgns, 'text');
                    this.attr(txt, params);
                    this.attr(txt, { cursor: 'default' });

                    var txtNode = txt.ownerDocument.createTextNode(textParts[i].text);
                    txt.appendChild(txtNode);

                    var xOffset = x;
                    var wPart = textParts[i].width;
                    var hPart = textParts[i].height;

                    if (halign == 'center')
                        xOffset += (w - wPart) / 2;
                    else if (halign == 'right')
                        xOffset += (w - wPart);

                    this.attr(txt, { x: $.jqx._rup(xOffset), y: $.jqx._rup(y + yOffset), width: $.jqx._rup(wPart), height: $.jqx._rup(hPart) });
                    parent.appendChild(txt);

                    yOffset -= textParts[i].height + 4;
                }

                if (gClip) {
                    this.endGroup();
                    return gClip;
                }

                return txt;
            }

            var point = $.jqx.commonRenderer.alignTextInRect(x, y, width, height, tw, th, halign, valign, angle, rotateAround);
            x = point.x;
            y = point.y;

            var gTranslate = this.shape('g', { transform: 'translate(' + x + ',' + y + ')' });
            var gRotate = this.shape('g', { transform: 'rotate(' + angle + ')' });

            gTranslate.appendChild(gRotate);

            // add the text blocks
            var yOffset = 0;

            for (var i = textParts.length - 1; i >= 0; i--) {
                var tx = document.createElementNS(this._svgns, 'text');
                this.attr(tx, params);
                this.attr(tx, { cursor: 'default' });

                var txtNode = tx.ownerDocument.createTextNode(textParts[i].text);
                tx.appendChild(txtNode);

                var xOffset = 0;
                var wPart = textParts[i].width;
                var hPart = textParts[i].height;

                if (halign == 'center')
                    xOffset += (textPartsInfo.width - wPart) / 2;
                else if (halign == 'right')
                    xOffset += (textPartsInfo.width - wPart);

                this.attr(tx, { x: $.jqx._rup(xOffset), y: $.jqx._rup(yOffset), width: $.jqx._rup(wPart), height: $.jqx._rup(hPart) });
                gRotate.appendChild(tx);

                yOffset -= hPart + 4;
            }

            parent.appendChild(gTranslate);

            if (gClip)
                this.endGroup();

            return gTranslate;
        },

        line: function (x1, y1, x2, y2, params) {
            var line = this.shape('line', { x1: x1, y1: y1, x2: x2, y2: y2 });
            this.attr(line, params);
            return line;
        },

        path: function (points, params) {
            var s = this.shape('path');
            s.setAttribute('d', points);
            if (params) {
                this.attr(s, params);
            }
            return s;
        },

        rect: function (x, y, w, h, params) {
            x = $.jqx._ptrnd(x);
            y = $.jqx._ptrnd(y);
            w = Math.max(1, $.jqx._rnd(w, 1, false));
            h = Math.max(1, $.jqx._rnd(h, 1, false));
            var s = this.shape('rect', { x: x, y: y, width: w, height: h });
            if (params)
                this.attr(s, params);
            return s;
        },

        circle: function (x, y, r, params) {
            var s = this.shape('circle', { cx: x, cy: y, r: r });
            if (params)
                this.attr(s, params);
            return s;
        },

        pieSlicePath: function (x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset) {
            return $.jqx.commonRenderer.pieSlicePath(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset);
        },


        pieslice: function (x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset, params) {
            var pathCmd = this.pieSlicePath(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset);

            var s = this.shape('path');
            s.setAttribute('d', pathCmd);

            if (params)
                this.attr(s, params);

            return s;
        },

        attr: function (element, params) {
            if (!element || !params)
                return;

            for (var param in params) {
                if (param == "textContent")
                    element.textContent = params[param];
                else {
                    element.setAttribute(param, params[param]);
                }
            }
        },

        removeAttr: function (element, params) {
            if (!element || !params)
                return;

            for (var param in params) {
                if (param == "textContent")
                    element.textContent = '';
                else {
                    element.removeAttribute(params[param]);
                }
            }
        },

        getAttr: function (element, key) {
            return element['getAttribute'](key);
        },

        /** @private */
        _gradients: {},

        /** @private */
        _toLinearGradient: function (color, isVertical, stops) {
            var id = 'grd' + this._id + color.replace('#', '') + (isVertical ? 'v' : 'h');
            var url = 'url(' + this.getWindowHref() + '#' + id + ')';
            if (this._gradients[url])
                return url;

            var gr = document.createElementNS(this._svgns, 'linearGradient');
            this.attr(gr, { x1: '0%', y1: '0%', x2: isVertical ? '0%' : '100%', y2: isVertical ? '100%' : '0%', id: id });

            for (var i = 0; i < stops.length; i++) {
                var stop = stops[i];
                var s = document.createElementNS(this._svgns, 'stop');
                var st = 'stop-color:' + $.jqx.adjustColor(color, stop[1]);
                this.attr(s, { offset: stop[0] + '%', style: st });
                gr.appendChild(s);
            }

            this._defs.appendChild(gr);
            this._gradients[url] = true;

            return url;
        },

        /** @private */
        _toRadialGradient: function (color, stops, coords) {
            var id = 'grd' + this._id + color.replace('#', '') + 'r' + (coords != undefined ? coords.key : '');

            var url = 'url(' + this.getWindowHref() + '#' + id + ')';
            if (this._gradients[url])
                return url;

            var gr = document.createElementNS(this._svgns, 'radialGradient');
            if (coords == undefined)
                this.attr(gr, { cx: '50%', cy: '50%', r: '100%', fx: '50%', fy: '50%', id: id });
            else
                this.attr(gr, { cx: coords.x, cy: coords.y, r: coords.outerRadius, id: id, gradientUnits: 'userSpaceOnUse' });

            for (var i = 0; i < stops.length; i++) {
                var stop = stops[i];
                var s = document.createElementNS(this._svgns, 'stop');
                var st = 'stop-color:' + $.jqx.adjustColor(color, stop[1]);
                this.attr(s, { offset: stop[0] + '%', style: st });
                gr.appendChild(s);
            }

            this._defs.appendChild(gr);
            this._gradients[url] = true;

            return url;
        }
    } // svgRenderer


    $.jqx.vmlRenderer = function () { };
    $.jqx.vmlRenderer.prototype = {
        init: function (host) {
            var s = "<div class='chartContainer' style=\"position:relative;overflow:hidden;\"><div>";
            host.append(s);
            this.host = host;
            var container = host.find(".chartContainer");
            container[0].style.width = host.width() + 'px';
            container[0].style.height = host.height() + 'px';

            var addNamespace = true;

            try {
                for (var i = 0; i < document.namespaces.length; i++) {
                    if (document.namespaces[i].name == 'v' && document.namespaces[i].urn == "urn:schemas-microsoft-com:vml") {
                        addNamespace = false;
                        break;
                    }
                }
            }
            catch (e) {
                return false;
            }

            if ($.jqx.browser.msie && parseInt($.jqx.browser.version) < 9 &&
                    (document.childNodes && document.childNodes.length > 0 && document.childNodes[0].data && document.childNodes[0].data.indexOf('DOCTYPE') != -1)
                    ) {
                if (addNamespace) {
                    document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
                }

                this._ie8mode = true;
            }
            else {
                if (addNamespace) {
                    document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
                    document.createStyleSheet().cssText = "v\\:* { behavior: url(#default#VML); display: inline-block; }";
                }
            }

            this.canvas = container[0];

            this._width = Math.max($.jqx._rup(container.width()), 0);
            this._height = Math.max($.jqx._rup(container.height()), 0);

            container[0].style.width = this._width + 2;
            container[0].style.height = this._height + 2;

            this._id = new Date().getTime();
            this.clear();
            return true;
        },

        getType: function () {
            return 'VML';
        },

        refresh: function () {
        },

        getRect: function () {
            return { x: 0, y: 0, width: this._width, height: this._height };
        },

        getContainer: function () {
            var container = this.host.find(".chartContainer");
            return container;
        },

        clear: function () {
            while (this.canvas.childElementCount > 0) {
                this.removeHandler(this.canvas.firstElementChild);
                this.canvas.removeChild(this.canvas.firstElementChild);
            }

            this._gradients = {};
            this._defaultParent = undefined;
        },

        removeElement: function (element) {
            if (element != null) {
                this.removeHandler(element);
                element.parentNode.removeChild(element);
            }
        },

        /** @private */
        _openGroups: [],

        beginGroup: function () {
            var parent = this._activeParent();
            var g = document.createElement('v:group');
            g.style.position = 'absolute';
            g.coordorigin = "0,0";
            g.coordsize = this._width + ',' + this._height;
            g.style.left = 0;
            g.style.top = 0;
            g.style.width = this._width;
            g.style.height = this._height;

            parent.appendChild(g);
            this._openGroups.push(g);
            return g;
        },

        endGroup: function () {
            if (this._openGroups.length == 0)
                return;

            this._openGroups.pop();
        },

        /** @private */
        _activeParent: function () {
            return this._openGroups.length == 0 ? this.canvas : this._openGroups[this._openGroups.length - 1];
        },

        createClipRect: function (rect) {
            var div = document.createElement("div");
            div.style.height = (rect.height + 1) + 'px';
            div.style.width = (rect.width + 1) + 'px';
            div.style.position = 'absolute';
            div.style.left = rect.x + 'px';
            div.style.top = rect.y + 'px';
            div.style.overflow = 'hidden';

            this._clipId = this._clipId || 0;
            div.id = 'cl' + this._id + '_' + (++this._clipId).toString();
            this._activeParent().appendChild(div);
            return div;
        },

        setClip: function (elem, clip) {
            //   clip.appendChild(elem);
        },

        /** @private */
        _clipId: 0,

        addHandler: function (element, event, fn) {
            if ($(element).on)
                $(element).on(event, fn);
            else
                $(element).bind(event, fn);
        },

        removeHandler: function (element, event, fn) {
            if ($(element).off)
                $(element).off(event, fn);
            else
                $(element).unbind(event, fn);
        },

        on: function (element, event, fn) {
            this.addHandler(element, event, fn);
        },

        off: function (element, event, fn) {
            this.removeHandler(element, event, fn);
        },

        /** @private */
        _getTextParts: function (text, angle, params) {
            var textPartsInfo = { width: 0, height: 0, parts: [] };

            var coeff = 0.6;
            var textParts = text.toString().split('<br>');

            var parent = this._activeParent();
            var txt = document.createElement('v:textbox');
            this.attr(txt, params);
            parent.appendChild(txt);

            for (var i = 0; i < textParts.length; i++) {
                var textPart = textParts[i];

                var txtNode = document.createElement('span');
                txtNode.appendChild(document.createTextNode(textPart));
                txt.appendChild(txtNode);
                if (params && params['class'])
                    txtNode.className = params['class'];

                var box = $(txt);
                var tw = $.jqx._rup(box.width());
                var th = $.jqx._rup(box.height() * coeff);
                if (th == 0 && $.jqx.browser.msie && parseInt($.jqx.browser.version) < 9) {
                    var fontSize = box.css('font-size');
                    if (fontSize) {
                        th = parseInt(fontSize);
                        if (isNaN(th)) th = 0;
                    }
                }

                txt.removeChild(txtNode);

                textPartsInfo.width = Math.max(textPartsInfo.width, tw);
                textPartsInfo.height += th + (i > 0 ? 2 : 0);
                textPartsInfo.parts.push({ width: tw, height: th, text: textPart });
            }

            parent.removeChild(txt);

            return textPartsInfo;
        },

        /** @private */
        _measureText: function (text, angle, params, includeTextPartsInfo) {
            if (Math.abs(angle) > 45)
                angle = 90;
            else
                angle = 0;

            return $.jqx.commonRenderer.measureText(text, angle, params, includeTextPartsInfo, this);
        },


        measureText: function (text, angle, params) {
            return this._measureText(text, angle, params, false);
        },

        text: function (text, x, y, width, height, angle, params, clip, halign, valign) {
            var color;
            if (params && params.stroke)
                color = params.stroke;

            if (color == undefined)
                color = 'black';

            var sz = this._measureText(text, angle, params, true);
            var textPartsInfo = sz.textPartsInfo;
            var textParts = textPartsInfo.parts;
            var tw = sz.width;
            var th = sz.height;

            if (isNaN(width) || width == 0)
                width = tw;
            if (isNaN(height) || height == 0)
                height = th;


            var gClip;

            if (!halign)
                halign = 'center';
            if (!valign)
                valign = 'center';

            if (textParts.length > 0 || clip) {
                gClip = this.beginGroup();
            }

            if (clip) {
                var crect = this.createClipRect({ x: $.jqx._rup(x), y: $.jqx._rup(y), width: $.jqx._rup(width), height: $.jqx._rup(height) });
                this.setClip(gClip, crect);
            }

            var parent = this._activeParent();

            var w = width || 0;
            var h = height || 0;

            if (Math.abs(angle) > 45) {
                angle = 90;
            }
            else
                angle = 0;

            var xAdj = 0, yAdj = 0;

            if (halign == 'center')
                xAdj += (w - tw) / 2;
            else if (halign == 'right')
                xAdj += (w - tw);

            if (valign == 'center')
                yAdj = (h - th) / 2;
            else if (valign == 'bottom')
                yAdj = h - th;

            if (angle == 0) {
                y += th + yAdj;
                x += xAdj;
            }
            else {
                x += tw + xAdj;
                y += yAdj;
            }
            ///////////////
            var yOffset = 0, xOffset = 0;

            var textPartBox;
            for (var i = textParts.length - 1; i >= 0; i--) {
                var textPart = textParts[i];

                var wAdj = (tw - textPart.width) / 2;
                if (angle == 0 && halign == 'left')
                    wAdj = 0;
                else if (angle == 0 && halign == 'right')
                    wAdj = tw - textPart.width;
                else if (angle == 90)
                    wAdj = (th - textPart.width) / 2;

                var hAdj = yOffset - textPart.height;

                yAdj = angle == 90 ? wAdj : hAdj;
                xAdj = angle == 90 ? hAdj : wAdj;

                textPartBox = document.createElement('v:textbox');
                textPartBox.style.position = 'absolute';
                textPartBox.style.left = $.jqx._rup(x + xAdj);
                textPartBox.style.top = $.jqx._rup(y + yAdj);
                textPartBox.style.width = $.jqx._rup(textPart.width);
                textPartBox.style.height = $.jqx._rup(textPart.height);
                if (angle == 90) {
                    textPartBox.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=3)';
                    textPartBox.style.height = $.jqx._rup(textPart.height) + 5;
                }

                var span = document.createElement('span');
                span.appendChild(document.createTextNode(textPart.text));
                if (params && params['class']) {
                    span.className = params['class'];
                }
                textPartBox.appendChild(span);
                parent.appendChild(textPartBox);

                yOffset -= textPart.height + (i > 0 ? 2 : 0);
            }

            if (gClip) {
                this.endGroup();
                return parent;
            }

            return textPartBox;
        },

        shape: function (name, params) {
            var s = document.createElement(this._createElementMarkup(name));
            if (!s)
                return undefined;

            for (var param in params)
                s.setAttribute(param, params[param]);

            this._activeParent().appendChild(s);

            return s;
        },

        line: function (x1, y1, x2, y2, params) {
            var linePath = 'M ' + x1 + ',' + y1 + ' L ' + x2 + ',' + y2 + ' X E';
            var line = this.path(linePath);
            this.attr(line, params);
            return line;
        },

        _createElementMarkup: function (shape) {
            var str = '<v:' + shape + ' style=\"\">' + '</v:' + shape + '>';
            if (this._ie8mode) {
                str = str.replace('style=\"\"', 'style=\"behavior: url(#default#VML);\"');
            }

            return str;
        },

        path: function (points, params) {
            var shape = document.createElement(this._createElementMarkup('shape'));
            shape.style.position = 'absolute';
            shape.coordsize = this._width + ' ' + this._height;
            shape.coordorigin = '0 0';
            shape.style.width = parseInt(this._width);
            shape.style.height = parseInt(this._height);
            shape.style.left = 0 + 'px';
            shape.style.top = 0 + 'px';
            shape.setAttribute("path", points);

            this._activeParent().appendChild(shape);
            if (params)
                this.attr(shape, params);

            return shape;
        },

        rect: function (x, y, w, h, params) {
            x = $.jqx._ptrnd(x);
            y = $.jqx._ptrnd(y);
            w = $.jqx._rup(w);
            h = $.jqx._rup(h);
            var vmlRect = this.shape('rect', params);
            vmlRect.style.position = 'absolute';
            vmlRect.style.left = x;
            vmlRect.style.top = y;
            vmlRect.style.width = w;
            vmlRect.style.height = h;
            vmlRect.strokeweight = 0;
            if (params)
                this.attr(vmlRect, params);

            return vmlRect;
        },

        circle: function (x, y, r, params) {
            var vmlCircle = this.shape('oval');
            x = $.jqx._ptrnd(x - r);
            y = $.jqx._ptrnd(y - r);
            r = $.jqx._rup(r);
            vmlCircle.style.position = 'absolute';
            vmlCircle.style.left = x;
            vmlCircle.style.top = y;
            vmlCircle.style.width = r * 2;
            vmlCircle.style.height = r * 2;
            if (params)
                this.attr(vmlCircle, params);

            return vmlCircle;
        },

        updateCircle: function (circle, x, y, r) {
            if (x == undefined)
                x = parseFloat(circle.style.left) + parseFloat(circle.style.width) / 2;
            if (y == undefined)
                y = parseFloat(circle.style.top) + parseFloat(circle.style.height) / 2;
            if (r == undefined)
                r = parseFloat(circle.width) / 2;

            x = $.jqx._ptrnd(x - r);
            y = $.jqx._ptrnd(y - r);
            r = $.jqx._rup(r);
            circle.style.left = x;
            circle.style.top = y;
            circle.style.width = r * 2;
            circle.style.height = r * 2;
        },

        pieSlicePath: function (x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset) {
            if (!outerRadius)
                outerRadius = 1;

            var diff = Math.abs(angleFrom - angleTo);
            var lFlag = diff > 180 ? 1 : 0;
            if (diff > 360) {
                angleFrom = 0;
                angleTo = 360;
            }
            var radFrom = angleFrom * Math.PI * 2 / 360;
            var radTo = angleTo * Math.PI * 2 / 360;

            var x1 = x, x2 = x, y1 = y, y2 = y;
            var isDonut = !isNaN(innerRadius) && innerRadius > 0;

            if (isDonut)
                centerOffset = 0;

            if (centerOffset > 0) {
                var midAngle = diff / 2 + angleFrom;
                var radMid = midAngle * Math.PI * 2 / 360;

                x += centerOffset * Math.cos(radMid);
                y -= centerOffset * Math.sin(radMid);
            }

            if (isDonut) {
                var inR = innerRadius;
                x1 = $.jqx._ptrnd(x + inR * Math.cos(radFrom));
                y1 = $.jqx._ptrnd(y - inR * Math.sin(radFrom));
                x2 = $.jqx._ptrnd(x + inR * Math.cos(radTo));
                y2 = $.jqx._ptrnd(y - inR * Math.sin(radTo));
            }

            var x3 = $.jqx._ptrnd(x + outerRadius * Math.cos(radFrom));
            var x4 = $.jqx._ptrnd(x + outerRadius * Math.cos(radTo));
            var y3 = $.jqx._ptrnd(y - outerRadius * Math.sin(radFrom));
            var y4 = $.jqx._ptrnd(y - outerRadius * Math.sin(radTo));

            outerRadius = $.jqx._ptrnd(outerRadius);
            innerRadius = $.jqx._ptrnd(innerRadius);

            x = $.jqx._ptrnd(x);
            y = $.jqx._ptrnd(y);

            var aStart = Math.round(angleFrom * 65535);
            var aEnd = Math.round((angleTo - angleFrom) * 65536);

            if (innerRadius < 0)
                innerRadius = 1;

            var path = '';
            if (isDonut) {
                path = 'M' + x1 + ' ' + y1;
                path += ' AE ' + x + ' ' + y + ' ' + innerRadius + ' ' + innerRadius + ' ' + aStart + ' ' + aEnd;
                path += ' L ' + x4 + ' ' + y4;

                aStart = Math.round((angleFrom - angleTo) * 65535);
                aEnd = Math.round(angleTo * 65536);

                path += ' AE ' + x + ' ' + y + ' ' + outerRadius + ' ' + outerRadius + ' ' + aEnd + ' ' + aStart;
                path += ' L ' + x1 + ' ' + y1;
            }
            else {
                path = 'M' + x + ' ' + y;
                path += ' AE ' + x + ' ' + y + ' ' + outerRadius + ' ' + outerRadius + ' ' + aStart + ' ' + aEnd;
            }

            path += ' X E';

            return path;
        },

        pieslice: function (x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset, params) {

            var pathCmd = this.pieSlicePath(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset);
            var el = this.path(pathCmd, params);

            if (params)
                this.attr(el, params);

            return el;
        },

        /** @private */
        _keymap: [
                    { svg: 'fill', vml: 'fillcolor' },
                    { svg: 'stroke', vml: 'strokecolor' },
                    { svg: 'stroke-width', vml: 'strokeweight' },
                    { svg: 'stroke-dasharray', vml: 'dashstyle' },
                    { svg: 'fill-opacity', vml: 'fillopacity' },
                    { svg: 'stroke-opacity', vml: 'strokeopacity' },
                    { svg: 'opacity', vml: 'opacity' },
                    { svg: 'cx', vml: 'style.left' },
                    { svg: 'cy', vml: 'style.top' },
                    { svg: 'height', vml: 'style.height' },
                    { svg: 'width', vml: 'style.width' },
                    { svg: 'x', vml: 'style.left' },
                    { svg: 'y', vml: 'style.top' },
                    { svg: 'd', vml: 'v' },
                    { svg: 'display', vml: 'style.display' }
                    ],

        /** @private */
        _translateParam: function (name) {
            for (var key in this._keymap) {
                if (this._keymap[key].svg == name)
                    return this._keymap[key].vml;
            }

            return name;
        },

        attr: function (element, params) {
            if (!element || !params)
                return;
            for (var param in params) {
                var vmlparam = this._translateParam(param);
                if (undefined == params[param])
                    continue;

                if (vmlparam == 'fillcolor' && params[param].indexOf('grd') != -1) {
                    element.type = params[param];
                }
                else if (vmlparam == 'fillcolor' && params[param] == 'transparent') {
                    element.style.filter = "alpha(opacity=0)";
                    element['-ms-filter'] = "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
                }
                else if (vmlparam == 'opacity' || vmlparam == 'fillopacity') {
                    if (element.fill) {
                        element.fill.opacity = params[param];
                    }
                }
                else if (vmlparam == 'textContent') {
                    element.children[0].innerText = params[param];
                }
                else if (vmlparam == 'dashstyle') {
                    element.dashstyle = params[param].replace(',', ' ');
                }
                else {
                    if (vmlparam.indexOf('style.') == -1)
                        element[vmlparam] = params[param];
                    else
                        element.style[vmlparam.replace('style.', '')] = params[param];
                }
            }
        },

        removeAttr: function (element, params) {
            if (!element || !params)
                return;

            for (var param in params)
                element.removeAttribute(params[param]);
        },

        getAttr: function (element, key) {
            var vmlparam = this._translateParam(key);
            if (vmlparam == 'opacity' || vmlparam == 'fillopacity')
                if (element.fill) {
                    return element.fill.opacity;
                }
                else {
                    return 1;
                }

            if (vmlparam.indexOf('style.') == -1)
                return element[vmlparam];

            return element.style[vmlparam.replace('style.', '')];
        },

        /** @private */
        _gradients: {},

        _toRadialGradient: function (color, isVertical, stops) {
            return color;
        },

        /** @private */
        _toLinearGradient: function (color, isVertical, stops) {
            if (this._ie8mode) {
                return color;
            }

            var id = 'grd' + color.replace('#', '') + (isVertical ? 'v' : 'h');
            var ref = '#' + id + '';
            if (this._gradients[ref])
                return ref;

            var gr = document.createElement(this._createElementMarkup('fill'));
            gr.type = 'gradient';
            gr.method = 'linear';
            gr.angle = isVertical ? 0 : 90;

            var colors = '';
            for (var i = 0; i < stops.length; i++) {
                var stop = stops[i];

                if (stop > 0)
                    colors += ', ';
                colors += stop[0] + '% ' + $.jqx.adjustColor(color, stop[1]);
            }

            gr.colors = colors;

            var shapetype = document.createElement(this._createElementMarkup('shapetype'));
            shapetype.appendChild(gr);
            shapetype.id = id;

            this.canvas.appendChild(shapetype);

            return ref;
        }
    } // vmlRenderer

    /************************************************
    * jQWidgets HTML5 Canvas Renderer               *
    ************************************************/
    $.jqx.HTML5Renderer = function () { }

    $.jqx.ptrnd = function (val) {
        if (Math.abs(Math.round(val) - val) == 0.5)
            return val;

        var rnd = Math.round(val);
        if (rnd < val)
            rnd = rnd - 1;

        return rnd + 0.5;
    }


    $.jqx.HTML5Renderer.prototype = {
        /** @private */
        init: function (host) {
            try {
                this.host = host;                
                this.host.append("<div class='chartContainer' style='position:relative' onselectstart='return false;'><canvas id='__jqxCanvasWrap' style='width:100%; height: 100%;'/></div>");
                this.canvas = host.find('#__jqxCanvasWrap');
                this.canvas[0].width = host.width();
                this.canvas[0].height = host.height();
                this.ctx = this.canvas[0].getContext('2d');

                this._elements = {};
                this._maxId = 0;
                this._gradientId = 0;
                this._gradients = {};
                this._currentPoint = { x: 0, y: 0 };
                this._lastCmd = '';
                this._pos = 0;
            }
            catch (e) {
                return false;
            }

            return true;
        },

        getType: function () {
            return 'HTML5';
        },

        getContainer: function () {
            var container = this.host.find(".chartContainer");
            return container;
        },

        getRect: function () {
            return { x: 0, y: 0, width: this.canvas[0].width - 1, height: this.canvas[0].height - 1 };
        },

        beginGroup: function () {
        },

        endGroup: function () {
        },

        setClip: function () {
        },

        createClipRect: function (rect) {
        },

        addHandler: function (element, event, fn) {
            // unsupported
        },

        removeHandler: function (element, event, fn) {
            // unsupported
        },

        on: function (element, event, fn) {
            this.addHandler(element, event, fn);
        },

        off: function (element, event, fn) {
            this.removeHandler(element, event, fn);
        },

        clear: function () {
            this._elements = {};
            this._maxId = 0;
            this._renderers._gradients = {};
            this._gradientId = 0;
        },

        removeElement: function (element) {
            if (undefined == element)
                return;
            if (this._elements[element.id])
                delete this._elements[element.id];
        },

        shape: function (name, params) {
            var s = { type: name, id: this._maxId++ };

            for (var param in params)
                s[param] = params[param];

            this._elements[s.id] = s;

            return s;
        },

        attr: function (element, params) {
            for (var param in params)
                element[param] = params[param];
        },

        removeAttr: function (element, params) {
            for (var param in params) {
                delete element[params[param]];
            }
        },


        rect: function (x, y, w, h, params) {
            if (isNaN(x))
                throw 'Invalid value for "x"';
            if (isNaN(y))
                throw 'Invalid value for "y"';
            if (isNaN(w))
                throw 'Invalid value for "width"';
            if (isNaN(h))
                throw 'Invalid value for "height"';

            var s = this.shape('rect', { x: x, y: y, width: w, height: h });
            if (params)
                this.attr(s, params);
            return s;
        },

        path: function (pathCmd, params) {
            var s = this.shape('path', params);
            this.attr(s, { d: pathCmd });
            return s;
        },

        line: function (x1, y1, x2, y2, params) {
            return this.path('M ' + x1 + ',' + y1 + ' L ' + x2 + ',' + y2, params);
        },

        circle: function (x, y, r, params) {
            var s = this.shape('circle', { x: x, y: y, r: r });
            if (params)
                this.attr(s, params);
            return s;
        },

        pieSlicePath: function (x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset) {
            return $.jqx.commonRenderer.pieSlicePath(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset);
        },

        pieslice: function (x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset, params) {
            var element = this.path(this.pieSlicePath(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset), params);
            this.attr(element, { x: x, y: y, innerRadius: innerRadius, outerRadius: outerRadius, angleFrom: angleFrom, angleTo: angleTo });
            return element;
        },

        /** @private */
        _getCSSStyle: function (name) {
            var sheets = document.styleSheets;
            try {
                for (var i = 0; i < sheets.length; i++) {
                    for (var j = 0; sheets[i].cssRules && j < sheets[i].cssRules.length; j++) {
                        if (sheets[i].cssRules[j].selectorText.indexOf(name) != -1)
                            return sheets[i].cssRules[j].style;
                    }
                }
            }
            catch (e) {
            }

            return {};
        },

        /** @private */
        _getTextParts: function (text, angle, params) {
            var fontFamily = 'Arial';
            var fontSize = '10pt';
            var fontWeight = '';
            if (params && params['class']) {
                var style = this._getCSSStyle(params['class']);
                if (style['fontSize'])
                    fontSize = style['fontSize'];
                if (style['fontFamily'])
                    fontFamily = style['fontFamily'];
                if (style['fontWeight'])
                    fontWeight = style['fontWeight'];
            }

            this.ctx.font = fontWeight + ' ' + fontSize + ' ' + fontFamily;

            var textPartsInfo = { width: 0, height: 0, parts: [] };

            var coeff = 0.6;
            var textParts = text.toString().split('<br>');
            for (var i = 0; i < textParts.length; i++) {
                var textPart = textParts[i];

                var tw = this.ctx.measureText(textPart).width;

                var span = document.createElement("span.jqxchart");
                span.font = this.ctx.font;
                span.textContent = textPart;
                document.body.appendChild(span);
                var th = span.offsetHeight * coeff;
                document.body.removeChild(span);

                textPartsInfo.width = Math.max(textPartsInfo.width, $.jqx._rup(tw));
                textPartsInfo.height += th + (i > 0 ? 4 : 0);
                textPartsInfo.parts.push({ width: tw, height: th, text: textPart });
            }

            return textPartsInfo;
        },

        /** @private */
        _measureText: function (text, angle, params, includeTextPartsInfo) {
            return $.jqx.commonRenderer.measureText(text, angle, params, includeTextPartsInfo, this);
        },

        measureText: function (text, angle, params) {
            return this._measureText(text, angle, params, false);
        },

        text: function (text, x, y, width, height, angle, params, clip, halign, valign, rotateAround) {
            var t = this.shape('text', { text: text, x: x, y: y, width: width, height: height, angle: angle, clip: clip, halign: halign, valign: valign, rotateAround: rotateAround });
            if (params)
                this.attr(t, params);

            t.fontFamily = 'Arial';
            t.fontSize = '10pt';
            t.fontWeight = '';
            t.color = '#000000';
            if (params && params['class']) {
                var style = this._getCSSStyle(params['class']);
                t.fontFamily = style.fontFamily || t.fontFamily;
                t.fontSize = style.fontSize || t.fontSize;
                t.fontWeight = style['fontWeight'] || t.fontWeight;
                t.color = style.color || t.color;
            }

            var sz = this._measureText(text, 0, params, true);
            this.attr(t, { textPartsInfo: sz.textPartsInfo, textWidth: sz.width, textHeight: sz.height });

            if (width <= 0 || isNaN(width))
                this.attr(t, { width: sz.width });

            if (height <= 0 || isNaN(height))
                this.attr(t, { height: sz.height });

            return t;
        },

        /** @private */
        _toLinearGradient: function (color, isVertical, stops) {
            if (this._renderers._gradients[color])
                return color;

            var colorStops = [];
            for (var i = 0; i < stops.length; i++)
                colorStops.push({ percent: stops[i][0] / 100, color: $.jqx.adjustColor(color, stops[i][1]) });

            var name = 'gr' + this._gradientId++;
            this.createGradient(name, isVertical ? 'vertical' : 'horizontal', colorStops);
            return name;
        },

        /** @private */
        _toRadialGradient: function (color, stops) {
            if (this._renderers._gradients[color])
                return color;

            var colorStops = [];
            for (var i = 0; i < stops.length; i++)
                colorStops.push({ percent: stops[i][0] / 100, color: $.jqx.adjustColor(color, stops[i][1]) });

            var name = 'gr' + this._gradientId++;
            this.createGradient(name, 'radial', colorStops);
            return name;
        },

        createGradient: function (name, orientation, colorStops) {
            this._renderers.createGradient(this, name, orientation, colorStops);
        },

        /** @private */
        _renderers: {
            createGradient: function (context, name, orientation, colorStops) {
                context._gradients[name] = { orientation: orientation, colorStops: colorStops };
            },

            setStroke: function (context, params) {
                var ctx = context.ctx;

                ctx.strokeStyle = params['stroke'] || 'transparent';
                ctx.lineWidth = params['stroke-width'] || 1;

                if (params['fill-opacity'] != undefined) {
                    ctx.globalAlpha = params['fill-opacity'];
                }
                else if (params['opacity'] != undefined) {
                    ctx.globalAlpha = params['opacity'];
                }
                else {
                    ctx.globalAlpha = 1;
                }

                if (ctx.setLineDash) {
                    if (params['stroke-dasharray'])
                        ctx.setLineDash(params['stroke-dasharray'].split(','));
                    else
                        ctx.setLineDash([]);
                }
            },

            setFillStyle: function (context, params) {
                var ctx = context.ctx;

                ctx.fillStyle = 'transparent';

                if (params['fill-opacity'] != undefined) {
                    ctx.globalAlpha = params['fill-opacity'];
                }
                else if (params['opacity'] != undefined) {
                    ctx.globalAlpha = params['opacity'];
                }
                else {
                    ctx.globalAlpha = 1;
                }

                if (params.fill && params.fill.indexOf('#') == -1 && context._gradients[params.fill]) {
                    var isVertical = context._gradients[params.fill].orientation != 'horizontal';
                    var isRadial = context._gradients[params.fill].orientation == 'radial';
                    var x1 = $.jqx.ptrnd(params.x);
                    var y1 = $.jqx.ptrnd(params.y);
                    var x2 = $.jqx.ptrnd(params.x + (isVertical ? 0 : params.width));
                    var y2 = $.jqx.ptrnd(params.y + (isVertical ? params.height : 0));

                    var gradient;

                    if ((params.type == 'circle' || params.type == 'path' || params.type == 'rect') && isRadial) {
                        x = $.jqx.ptrnd(params.x);
                        y = $.jqx.ptrnd(params.y);
                        r1 = params.innerRadius || 0;
                        r2 = params.outerRadius || params.r || 0;

                        if (params.type == 'rect')
                        {
                            x += params.width / 2;
                            y += params.height / 2;
                        }

                        gradient = ctx.createRadialGradient(x, y, r1, x, y, r2);
                    }

                    if (!isRadial) {
                        if (isNaN(x1) || isNaN(x2) || isNaN(y1) || isNaN(y2)) {
                            x1 = 0;
                            y1 = 0;
                            x2 = isVertical ? 0 : ctx.canvas.width;
                            y2 = isVertical ? ctx.canvas.height : 0;
                        }

                        gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                    }

                    var colorStops = context._gradients[params.fill].colorStops;
                    for (var i = 0; i < colorStops.length; i++)
                        gradient.addColorStop(colorStops[i].percent, colorStops[i].color);

                    ctx.fillStyle = gradient;
                }
                else if (params.fill) {
                    ctx.fillStyle = params.fill;
                }
            },

            rect: function (ctx, params) {
                if (params.width == 0 || params.height == 0)
                    return;
                ctx.fillRect($.jqx.ptrnd(params.x), $.jqx.ptrnd(params.y), params.width, params.height);
                ctx.strokeRect($.jqx.ptrnd(params.x), $.jqx.ptrnd(params.y), params.width, params.height);
            },

            circle: function (ctx, params) {
                if (params.r == 0)
                    return;
                ctx.beginPath();
                ctx.arc($.jqx.ptrnd(params.x), $.jqx.ptrnd(params.y), params.r, 0, Math.PI * 2, false);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            },

            _parsePoint: function (str) {
                var x = this._parseNumber(str);
                var y = this._parseNumber(str);
                return ({ x: x, y: y });
            },

            _parseNumber: function (str) {
                var numStarted = false;
                for (var i = this._pos; i < str.length; i++) {
                    if ((str[i] >= '0' && str[i] <= '9') || str[i] == '.' || str[i] == 'e' || (str[i] == '-' && !numStarted) || (str[i] == '-' && i >= 1 && str[i-1] == 'e')) {
                        numStarted = true;
                        continue;
                    }
                    if (!numStarted && (str[i] == ' ' || str[i] == ',')) {
                        this._pos++;
                        continue;
                    }

                    break;
                }

                var val = parseFloat(str.substring(this._pos, i));
                if (isNaN(val))
                    return undefined;

                this._pos = i;
                return val;
            },

            _cmds: "mlcazq",

            _isRelativeCmd: function (cmd) {
                return $.jqx.string.contains(this._cmds, cmd);
            },

            _parseCmd: function (string) {
                for (var i = this._pos; i < string.length; i++) {
                    if ($.jqx.string.containsIgnoreCase(this._cmds, string[i])) {
                        this._pos = i + 1;
                        this._lastCmd = string[i];
                        return this._lastCmd;
                    }
                    if (string[i] == ' ') {
                        this._pos++;
                        continue;
                    }
                    if (string[i] >= '0' && string[i] <= '9') {
                        this._pos = i;
                        if (this._lastCmd == '')
                            break;
                        else
                            return this._lastCmd;
                    }
                }

                return undefined;
            },

            _toAbsolutePoint: function (point) {
                return { x: this._currentPoint.x + point.x, y: this._currentPoint.y + point.y };
            },

            path: function (ctx, params) {
                var path = params.d;

                this._pos = 0;
                this._lastCmd = '';

                var firstPoint = undefined;
                this._currentPoint = { x: 0, y: 0 };

                ctx.beginPath();

                var i = 0;
                while (this._pos < path.length) {
                    var cmd = this._parseCmd(path);
                    if (cmd == undefined)
                        break;

                    if (cmd == 'M' || cmd == 'm') {
                        var point = this._parsePoint(path);
                        if (point == undefined)
                            break;
                        ctx.moveTo(point.x, point.y);
                        this._currentPoint = point;
                        if (firstPoint == undefined)
                            firstPoint = point;

                        continue;
                    }

                    if (cmd == 'L' || cmd == 'l') {
                        var point = this._parsePoint(path);
                        if (point == undefined)
                            break;

                        ctx.lineTo(point.x, point.y);
                        this._currentPoint = point;
                        continue;
                    }

                    if (cmd == 'A' || cmd == 'a') {
                        var rx = this._parseNumber(path);
                        var ry = this._parseNumber(path);
                        var angle = this._parseNumber(path) * (Math.PI / 180.0);
                        var largeFlag = this._parseNumber(path);
                        var sweepFlag = this._parseNumber(path);
                        var endPoint = this._parsePoint(path);

                        if (this._isRelativeCmd(cmd)) {
                            endPoint = this._toAbsolutePoint(endPoint);
                        }

                        if (rx == 0 || ry == 0)
                            continue;

                        var cp = this._currentPoint;

                        /// START
                        // x1', y1'
                        var cp2 = {
                            x: Math.cos(angle) * (cp.x - endPoint.x) / 2.0 + Math.sin(angle) * (cp.y - endPoint.y) / 2.0,
                            y: -Math.sin(angle) * (cp.x - endPoint.x) / 2.0 + Math.cos(angle) * (cp.y - endPoint.y) / 2.0
                        };

                        // adjust radii
                        var adj = Math.pow(cp2.x, 2) / Math.pow(rx, 2) + Math.pow(cp2.y, 2) / Math.pow(ry, 2);
                        if (adj > 1) {
                            rx *= Math.sqrt(adj);
                            ry *= Math.sqrt(adj);
                        }

                        // cx', cy'
                        var s = (largeFlag == sweepFlag ? -1 : 1) * Math.sqrt(
								    ((Math.pow(rx, 2) * Math.pow(ry, 2)) - (Math.pow(rx, 2) * Math.pow(cp2.y, 2)) - (Math.pow(ry, 2) * Math.pow(cp2.x, 2))) /
								    (Math.pow(rx, 2) * Math.pow(cp2.y, 2) + Math.pow(ry, 2) * Math.pow(cp2.x, 2))
							    );

                        if (isNaN(s))
                            s = 0;

                        var cp3 = { x: s * rx * cp2.y / ry, y: s * -ry * cp2.x / rx };

                        // cx, cy
                        var centerPoint = {
                            x: (cp.x + endPoint.x) / 2.0 + Math.cos(angle) * cp3.x - Math.sin(angle) * cp3.y,
                            y: (cp.y + endPoint.y) / 2.0 + Math.sin(angle) * cp3.x + Math.cos(angle) * cp3.y
                        };

                        // vector magnitude
                        var m = function (v) { return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2)); }

                        // ratio between two vectors
                        var r = function (u, v) { return (u[0] * v[0] + u[1] * v[1]) / (m(u) * m(v)) }

                        // angle between two vectors
                        var a = function (u, v) { return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(r(u, v)); }

                        // initial angle
                        var startAngle = a([1, 0], [(cp2.x - cp3.x) / rx, (cp2.y - cp3.y) / ry]);

                        // angle delta
                        var u = [(cp2.x - cp3.x) / rx, (cp2.y - cp3.y) / ry];
                        var v = [(-cp2.x - cp3.x) / rx, (-cp2.y - cp3.y) / ry];
                        var deltaAngle = a(u, v);
                        if (r(u, v) <= -1)
                            deltaAngle = Math.PI;

                        if (r(u, v) >= 1)
                            deltaAngle = 0;

                        if (sweepFlag == 0 && deltaAngle > 0)
                            deltaAngle = deltaAngle - 2 * Math.PI;

                        if (sweepFlag == 1 && deltaAngle < 0)
                            deltaAngle = deltaAngle + 2 * Math.PI;

                        var r = (rx > ry) ? rx : ry;
                        var sx = (rx > ry) ? 1 : rx / ry;
                        var sy = (rx > ry) ? ry / rx : 1;

                        ctx.translate(centerPoint.x, centerPoint.y);
                        ctx.rotate(angle);
                        ctx.scale(sx, sy);
                        ctx.arc(0, 0, r, startAngle, startAngle + deltaAngle, 1 - sweepFlag);
                        ctx.scale(1 / sx, 1 / sy);
                        ctx.rotate(-angle);

                        ctx.translate(-centerPoint.x, -centerPoint.y);

                        continue;
                    }

                    if ((cmd == 'Z' || cmd == 'z') && firstPoint != undefined) {
                        ctx.lineTo(firstPoint.x, firstPoint.y);
                        this._currentPoint = firstPoint;
                        continue;
                    }

                    if (cmd == 'C' || cmd == 'c') {
                        var p1 = this._parsePoint(path);
                        var p2 = this._parsePoint(path);
                        var p3 = this._parsePoint(path);

                        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
                        this._currentPoint = p3;
                        continue;
                    }

                    if (cmd == 'Q' || cmd == 'q') {
                        var p1 = this._parsePoint(path);
                        var p2 = this._parsePoint(path);

                        ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
                        this._currentPoint = p2;
                        continue;
                    }

                }

                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            },

            text: function (ctx, params) {
                var x = $.jqx.ptrnd(params.x);
                var y = $.jqx.ptrnd(params.y);
                var width = $.jqx.ptrnd(params.width);
                var height = $.jqx.ptrnd(params.height);
                var halign = params.halign;
                var valign = params.valign;
                var angle = params.angle;
                var rotateAround = params.rotateAround;
                var textPartsInfo = params.textPartsInfo;
                var textParts = textPartsInfo.parts;

                var clip = params.clip;
                if (clip == undefined)
                    clip = true;

                ctx.save();

                if (!halign)
                    halign = 'center';
                if (!valign)
                    valign = 'center';

                if (clip) {
                    ctx.rect(x, y, width, height);
                    ctx.clip();
                }

                var tw = params.textWidth;
                var th = params.textHeight;

                var w = width || 0;
                var h = height || 0;

                ctx.fillStyle = params.color;
                ctx.font = params.fontWeight + ' ' + params.fontSize + ' ' + params.fontFamily;

                if (!angle || angle == 0) {
                    y += th;

                    if (valign == 'center' || valign == 'middle')
                        y += (h - th) / 2;
                    else if (valign == 'bottom')
                        y += h - th;

                    if (!width)
                        width = tw;

                    if (!height)
                        height = th;

                    var yOffset = 0;

                    for (var i = textParts.length - 1; i >= 0; i--) {
                        var textPart = textParts[i];
                        var xOffset = x;
                        var wPart = textParts[i].width;
                        var hPart = textParts[i].height;

                        if (halign == 'center')
                            xOffset += (w - wPart) / 2;
                        else if (halign == 'right')
                            xOffset += (w - wPart);

                        ctx.fillText(textPart.text, xOffset, y + yOffset);
                        yOffset -= textPart.height + (i > 0 ? 4 : 0);
                    }
                    ctx.restore();
                    return;
                }

                var point = $.jqx.commonRenderer.alignTextInRect(x, y, width, height, tw, th, halign, valign, angle, rotateAround);
                x = point.x;
                y = point.y;

                var rads = angle * Math.PI * 2 / 360;
                ctx.translate(x, y);
                ctx.rotate(rads);

                var yOffset = 0;
                var maxW = textPartsInfo.width;

                for (var i = textParts.length - 1; i >= 0; i--) {
                    var xOffset = 0;

                    if (halign == 'center')
                        xOffset += (maxW - textParts[i].width) / 2;
                    else if (halign == 'right')
                        xOffset += (maxW - textParts[i].width);

                    ctx.fillText(textParts[i].text, xOffset, yOffset);

                    yOffset -= textParts[i].height + 4;
                }

                ctx.restore();
            }

        },

        refresh: function () {
            this.ctx.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height);
            for (var element in this._elements) {
                var params = this._elements[element];

                this._renderers.setFillStyle(this, params);
                this._renderers.setStroke(this, params);

                this._renderers[this._elements[element].type](this.ctx, params);
            }
        }
    } // End of jQWidgets HTML5 renderer

    $.jqx.createRenderer = function (widgetInstance, host) {
        var self = widgetInstance;

        var renderer = self.renderer = null;

        if (document.createElementNS && (self.renderEngine != 'HTML5' && self.renderEngine != 'VML')) {
            renderer = new $.jqx.svgRenderer();
            if (!renderer.init(host)) {
                if (self.renderEngine == 'SVG')
                    throw 'Your browser does not support SVG';

                return null;
            }
        }

        if (renderer == null && self.renderEngine != 'HTML5') {
            renderer = new $.jqx.vmlRenderer();
            if (!renderer.init(host)) {
                if (self.renderEngine == 'VML')
                    throw 'Your browser does not support VML';

                return null;
            }
            self._isVML = true;
        }

        if (renderer == null && (self.renderEngine == 'HTML5' || self.renderEngine == undefined)) {
            renderer = new $.jqx.HTML5Renderer();
            if (!renderer.init(host)) {
                throw 'Your browser does not support HTML5 Canvas';
            }
        }

        self.renderer = renderer;

        return renderer;
    },

    /** @private */
    $.jqx._widgetToImage = function (widgetInstance, type, fileName, exportServer, isUploadOnly, fnCallback) {
        var self = widgetInstance;

        if (!self)
            return false;

        if (fileName == undefined || fileName == '')
            fileName = 'image.' + type;

        var renderEngineSaved = self.renderEngine;
        var enableAnimationsSaved = self.enableAnimations;

        self.enableAnimations = false;

        // try switching to HTML5
        self.renderEngine = 'HTML5';

        if (self.renderEngine != renderEngineSaved) {
            try {
                self.refresh();
            }
            catch (e) {
                self.renderEngine = renderEngineSaved;
                self.refresh();
                self.enableAnimations = enableAnimationsSaved;

                return false;
            }
        }

        var canvas = self.renderer.getContainer().find('canvas')[0];
        var continueExport = true;
        if ($.isFunction(fnCallback))
        {
            continueExport = fnCallback(widgetInstance, canvas);
        }

        var result = true;
        if (continueExport)
            result = $.jqx.exportImage(canvas, type, fileName, exportServer, isUploadOnly);

        // switch back to existing engine
        if (self.renderEngine != renderEngineSaved) {
            self.renderEngine = renderEngineSaved;
            self.refresh();
            self.enableAnimations = enableAnimationsSaved;
        }

        return result;
    }

    $.jqx.getByPriority = function (arr) {
        var value = undefined;
        for (var i = 0; i < arr.length && value == undefined; i++) {
            if (value == undefined && arr[i] != undefined)
                value = arr[i];
        }

        return value;
    }

    /** @private */
    $.jqx.exportImage = function (canvas, type, fileName, exportServer, isUploadOnly) {
        if (!canvas)
            return false;

        var isPDF = type.toLowerCase() === "pdf";
        if (isPDF) type = "jpeg";
        if (fileName == undefined || fileName == '')
            fileName = 'image.' + type;

        if (exportServer == undefined || exportServer == '')
            throw 'Please specifiy export server';

        var result = true;

        try {
            if (canvas) {
                var data = canvas.toDataURL("image/" + type);


                if (isPDF) {
                    if (!$.jqx.pdfExport) {
                        $.jqx.pdfExport =
                        {
                            orientation: "portrait",
                            paperSize: "a4"
                        }
                    }
                    var totalWidth = 595;
                    switch ($.jqx.pdfExport.paperSize) {
                        case "legal":
                            var totalWidth = 612;
                            if ($.jqx.pdfExport.orientation !== "portrait") {
                                totalWidth = 1008;
                            }
                            break;
                        case "letter":
                            var totalWidth = 612;
                            if ($.jqx.pdfExport.orientation !== "portrait") {
                                totalWidth = 792;
                            }
                            break;
                        case "a3":
                            var totalWidth = 841;
                            if ($.jqx.pdfExport.orientation !== "portrait") {
                                totalWidth = 1190;
                            }
                            break;
                        case "a4":
                            var totalWidth = 595;
                            if ($.jqx.pdfExport.orientation !== "portrait") {
                                totalWidth = 842;
                            }
                            break;
                        case "a5":
                            var totalWidth = 420;
                            if ($.jqx.pdfExport.orientation !== "portrait") {
                                totalWidth = 595;
                            }
                            break
                    }
                    var chartWidth = $(canvas).width();
                    var widthPoints = chartWidth * 72 / 96;
                    if (widthPoints >= totalWidth - 20) {
                        widthPoints = totalWidth - 20;
                    }
                    var doc = new pdfDataExport($.jqx.pdfExport.orientation, 'pt', $.jqx.pdfExport.paperSize);
                    doc.addImage(data, 'JPEG', 10, 10, widthPoints, 0);
                    doc.save(fileName);
                    return;
                }
                data = data.replace("data:image/" + type + ";base64,", "");

                if (isUploadOnly) {
                    $.ajax({
                        dataType: 'string',
                        url: exportServer,
                        type: 'POST',
                        data: { content: data, fname: fileName },
                        async: false,
                        success: function (data, status, xhr) {
                            result = true;
                        },
                        error: function (data, status, xhr) {
                            result = false;
                        }
                    });
                }
                else {
                    var form = document.createElement('form');
                    form.method = 'POST';
                    form.action = exportServer;
                    form.style.display = 'none';
                    document.body.appendChild(form);

                    var inputFName = document.createElement('input');
                    inputFName.name = 'fname';
                    inputFName.value = fileName;
                    inputFName.style.display = 'none';

                    var inputContent = document.createElement('input');
                    inputContent.name = 'content';
                    inputContent.value = data;
                    inputContent.style.display = 'none';

                    form.appendChild(inputFName);
                    form.appendChild(inputContent);

                    form.submit();

                    document.body.removeChild(form);

                    result = true;
                }
            }
        }
        catch (e) {
            result = false;
        }

        return result;
    }

})(jqxBaseFramework);

// End of rendering API & helper functions
////////////////////////////////////////////////////

// jqxPlot
(function ($) {    
    jqxPlot = function () { };

    jqxPlot.prototype = {
        get: function(array, index, key)
        {
            return key !== undefined ? array[index][key] : array[index];
        },

        min: function(array, key)
        {
            var min = NaN;
            for (var i = 0; i < array.length; i++)
            {
                var val = this.get(array, i, key);

                if (isNaN(min) || val < min)
                    min = val;
            }

            return min;
        },

        max: function(array, key)
        {
            var max = NaN;
            for (var i = 0; i < array.length; i++)
            {
                var val = this.get(array, i, key);

                if (isNaN(max) || val > max)
                    max = val;
            }

            return max;
        },

        sum: function(array, key)
        {
            var sum = 0;
            for (var i = 0; i < array.length; i++)
            {
                var val = this.get(array, i, key);
                if (!isNaN(val))
                    sum += val;
            }

            return sum;
        },

        count: function(array, key)
        {
            var count = 0;
            for (var i = 0; i < array.length; i++)
            {
                var val = this.get(array, i, key);
                if (!isNaN(val))
                    count++;
            }

            return count;
        },

        avg: function(array, key)
        {
            return this.sum(array, key) / Math.max(1, count(array, key));
        },

        filter: function(array, fn)
        {
            if (!fn)
                return array;

            var out = [];
            for (var i = 0; i < array.length; i++)
                if (fn(array[i]))
                    out.push(array[i]);

            return out;
        },        
                             
        scale: function(val, range, scale_range, params)
        {
            if (isNaN(val))
                return NaN;

            if (val < Math.min(range.min, range.max) || val > Math.max(range.min, range.max))
            {
                if (!params || params['ignore_range'] !== true)
                    return NaN;
            }

            var outVal = NaN;

            var percent = 1;
            if (range.type === undefined || range.type != 'logarithmic')
            {
                var denom = Math.abs(range.max - range.min);
                if (!denom)
                    denom = 1;
                percent = Math.abs(val - Math.min(range.min, range.max)) / denom;
            }
            else if (range.type === 'logarithmic')
            {            
                var logBase = range.base;
                if (isNaN(logBase))
                    logBase = 10;

                var min = Math.min(range.min, range.max);
                if (min <= 0)
                    min = 1;

                var max = Math.max(range.min, range.max);
                if (max <= 0)
                    max = 1;

                var maxPow = $.jqx.log(max, logBase);
                max = Math.pow(logBase, maxPow);

                var minPow = $.jqx.log(min, logBase);
                min = Math.pow(logBase, minPow);
                
                var valPow = $.jqx.log(val, logBase);

                percent = Math.abs(valPow - minPow) / (maxPow - minPow);
            }

            if (scale_range.type === 'logarithmic')
            {            
                var logBase = scale_range.base;
                if (isNaN(logBase))
                    logBase = 10;

                var maxPow = $.jqx.log(scale_range.max, logBase);
                var minPow = $.jqx.log(scale_range.min, logBase);

                if (scale_range.flip)
                    percent = 1 - percent;

                var valPow = Math.min(minPow, maxPow) + percent * Math.abs(maxPow - minPow);
                outVal = Math.pow(logBase, valPow);
            }
            else
            {
                outVal = Math.min(scale_range.min, scale_range.max) + percent * Math.abs(scale_range.max - scale_range.min);

                if (scale_range.flip)
                    outVal = Math.max(scale_range.min, scale_range.max) - outVal + scale_range.min;
            }

            return outVal;
        },

        axis: function (min, max, preferedCount) {
            if (preferedCount <= 1)
                return [max, min];

            var minSave = min;
            var maxSave = max;

            if (isNaN(preferedCount) || preferedCount < 2)
                preferedCount = 2;

            var decimalPlaces = 0;
            while (Math.round(min) != min && Math.round(max) != max && decimalPlaces < 10)
            {
                min *= 10;
                max *= 10;
                decimalPlaces++;
            }

            var preferedIntSize = (max - min) / preferedCount;
            while (decimalPlaces < 10 && Math.round(preferedIntSize) != preferedIntSize)
            {
                min *= 10;
                max *= 10;
                preferedIntSize *= 10;
                decimalPlaces++;
            }

            var scale = [1, 2, 5];

            var itemsCount = 0;
            var i = 0;

            while (true) {
                var idx = i % scale.length;
                var pow = Math.floor(i / scale.length);
                var intSizeCurr = Math.pow(10, pow) * scale[idx];

                idx = (i + 1) % scale.length;
                pow = Math.floor((i + 1) / scale.length);
                var intSizeNext = Math.pow(10, pow) * scale[idx];
                
                if (preferedIntSize >= intSizeCurr && preferedIntSize < intSizeNext)
                    break;
                
                i++;
            }

            var intSizeSelected = intSizeNext;

            var out = [];
            var curr = $.jqx._rnd(min, intSizeSelected, false);
            var denominator = decimalPlaces <= 0 ? 1 : Math.pow(10, decimalPlaces);
            while (curr < max + intSizeSelected)
            {
                out.push(curr / denominator);
                curr += intSizeSelected;
            }
            
            return out;
        }
    };       
})(jqxBaseFramework); // end of jqxPlot

// PROD 3.9.2
(function ($) {
    $.jqx.jqxWidget("jqxChart", "", {});

    $.extend($.jqx._jqxChart.prototype,
    {
        defineInstance: function () {

            $.extend(true, this, this._defaultSettings);

            this._createColorsCache();
            return this._defaultSettings;
        },

        _defaultSettings: {
            title: 'Title',
            description: 'Description',
            source: [],
            seriesGroups: [],
            categoryAxis: null,
            xAxis: {},
            valueAxis: null,
            renderEngine: '',
            enableAnimations: true,
            enableAxisTextAnimation: false,
            backgroundImage: '',
            background: '#FFFFFF',
            padding: { left: 5, top: 5, right: 5, bottom: 5 },
            backgroundColor: '#FFFFFF',
            showBorderLine: true,
            borderLineWidth: 1,
            borderLineColor: null,
            borderColor: null,
            titlePadding: { left: 5, top: 5, right: 5, bottom: 10 },
            showLegend: true,
            legendLayout: null,
            enabled: true,
            colorScheme: 'scheme01',
            animationDuration: 500,
            showToolTips: true,
            toolTipShowDelay: 500,
            toolTipDelay: 500,
            toolTipHideDelay: 4000,
            toolTipMoveDuration: 300,
            toolTipFormatFunction: null,
            toolTipAlignment: 'dataPoint',
            localization: null,
            columnSeriesOverlap: false,
            rtl: false,
            legendPosition: null,
            greyScale: false,
            axisPadding: 5,
            enableCrosshairs: false,
            crosshairsColor: '#BCBCBC',
            crosshairsDashStyle: '2,2',
            crosshairsLineWidth: 1.0,
            enableEvents: true,
            _itemsToggleState: [],
            _isToggleRefresh: false,
            _isSelectorRefresh: false,
            _sliders: [],
            _selectorRange: [],
            _rangeSelectorInstances: {},
            _resizeState: {},
            renderer: null,
            _isRangeSelectorInstance: false,
            drawBefore: null,
            draw: null,
            _renderData: {},
            enableSampling: true
        },

        _defaultLineColor: '#BCBCBC',

        _touchEvents: {
            'mousedown': $.jqx.mobile.getTouchEventName('touchstart'),
            'click': $.jqx.mobile.getTouchEventName('touchstart'),
            'mouseup': $.jqx.mobile.getTouchEventName('touchend'),
            'mousemove': $.jqx.mobile.getTouchEventName('touchmove'),
            'mouseenter': 'mouseenter',
            'mouseleave': 'mouseleave'
        },

        _getEvent: function (event) {
            if (this._isTouchDevice) {
                return this._touchEvents[event];
            } else {
                return event;
            }
        },

        destroy: function () {
            this.host.remove();
        },

        _jqxPlot: null,

        createInstance: function (args) {
            if (!$.jqx.dataAdapter)
                throw 'jqxdata.js is not loaded';

            var self = this;
            self._refreshOnDownloadComlete();
            self._isTouchDevice = $.jqx.mobile.isTouchDevice();

            if (!self._jqxPlot)
                self._jqxPlot = new jqxPlot();

            self.addHandler(self.host, self._getEvent('mousemove'), function (event) {
                if (self.enabled == false)
                    return;

                if (!self._isRangeSelectorInstance)
                    self.host.css('cursor', 'default');

                //event.preventDefault();
                var x = event.pageX || event.clientX || event.screenX;
                var y = event.pageY || event.clientY || event.screenY;
                var pos = self.host.offset();

                if (self._isTouchDevice) {
                    var cursorPos = $.jqx.position(event);
                    x = cursorPos.left;
                    y = cursorPos.top;
                }

                x -= pos.left;
                y -= pos.top;

                self.onmousemove(x, y);
            });

            self.addHandler(self.host, self._getEvent('mouseleave'), function (event) {
                if (self.enabled == false)
                    return;

                var x = self._mouseX;
                var y = self._mouseY;

                var rect = self._plotRect;

                if (rect && x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height)
                    return;

                self._cancelTooltipTimer();
                self._hideToolTip(0);
                self._unselect();
            });

            self.addHandler(self.host, 'click', function (event) {
                if (self.enabled == false)
                    return;

                var x = event.pageX || event.clientX || event.screenX;
                var y = event.pageY || event.clientY || event.screenY;
                var pos = self.host.offset();

                if (self._isTouchDevice) {
                    var cursorPos = $.jqx.position(event);
                    x = cursorPos.left;
                    y = cursorPos.top;
                }

                x -= pos.left;
                y -= pos.top;

                self._mouseX = x;
                self._mouseY = y;


                if (!isNaN(self._lastClickTs)) {
                    if ((new Date()).valueOf() - self._lastClickTs < 100)
                        return;
                }

                this._hostClickTimer = setTimeout(function () {
                    if (!self._isTouchDevice) {
                        self._cancelTooltipTimer();
                        self._hideToolTip();
                        self._unselect();
                    }

                    if (self._pointMarker && self._pointMarker.element) {
                        var group = self.seriesGroups[self._pointMarker.gidx];
                        var serie = group.series[self._pointMarker.sidx];

                        event.stopImmediatePropagation();
                        self._raiseItemEvent('click', group, serie, self._pointMarker.iidx);
                    }
                },
                100);
            });

            var elementStyle = self.element.style;
            if (elementStyle) {
                var sizeInPercentage = false;
                if (elementStyle.width != null)
                    sizeInPercentage |= elementStyle.width.toString().indexOf('%') != -1;

                if (elementStyle.height != null)
                    sizeInPercentage |= elementStyle.height.toString().indexOf('%') != -1;

                if (sizeInPercentage) {
                    $.jqx.utilities.resize(this.host, function () {
                        if (self.timer)
                            clearTimeout(self.timer);

                        var delay = 1;
                        self.timer = setTimeout(function () {
                            var tmp = self.enableAnimations;
                            self.enableAnimations = false;
                            self.refresh();
                            self.enableAnimations = tmp;
                        }, delay);
                    }, false, true);
                }
            }
        }, // createInstance

        /** @private */
        _refreshOnDownloadComlete: function () {
            var self = this;
            var source = this.source;
            if (source instanceof $.jqx.dataAdapter) {
                var adapteroptions = source._options;
                if (adapteroptions == undefined || (adapteroptions != undefined && !adapteroptions.autoBind)) {
                    source.autoSync = false;
                    source.dataBind();
                }

                var elementId = this.element.id;
                if (source.records.length == 0) {
                    var updateFunc = function () {
                        // sends a callback function to the user. This allows him to add additional initialization logic before the chart is rendered.
                        if (self.ready)
                            self.ready();

                        self.refresh();
                    };

                    source.unbindDownloadComplete(elementId);
                    source.bindDownloadComplete(elementId, updateFunc);
                }
                else {
                    // sends a callback function to the user. This allows him to add additional initialization logic before the chart is rendered.
                    if (self.ready)
                        self.ready();
                }

                source.unbindBindingUpdate(elementId);
                source.bindBindingUpdate(elementId, function () {
                    if (self._supressBindingRefresh)
                        return;

                    self.refresh();
                });
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this.isInitialized == undefined || this.isInitialized == false)
                return;

            if (key == 'source')
                this._refreshOnDownloadComlete();

            this.refresh();
        },

        /** @private */
        _initRenderer: function (host) {
            if (!$.jqx.createRenderer)
                throw 'Please include jqxdraw.js';

            return $.jqx.createRenderer(this, host);
        },

        /** @private */
        _internalRefresh: function () {
            var self = this;

            // validate visiblity
            if ($.jqx.isHidden(self.host))
                return;

            self._stopAnimations();

            if (!self.renderer || (!self._isToggleRefresh && !self._isUpdate)) {
                self._hideToolTip(0);
                self._isVML = false;
                self.host.empty();
                self._measureDiv = undefined;
                self._initRenderer(self.host);
            }

            var renderer = self.renderer;
            if (!renderer)
                return;

            var rect = renderer.getRect();

            self._render({ x: 1, y: 1, width: rect.width, height: rect.height });

            this._raiseEvent('refreshBegin', { instance: this });

            if (renderer instanceof $.jqx.HTML5Renderer)
                renderer.refresh();

            self._isUpdate = false;

            this._raiseEvent('refreshEnd', { instance: this });
        },

        saveAsPNG: function (filename, exportServer, isUploadOnly) {
            return this._saveAsImage('png', filename, exportServer, isUploadOnly);
        },

        saveAsJPEG: function (filename, exportServer, isUploadOnly) {
            return this._saveAsImage('jpeg', filename, exportServer, isUploadOnly);
        },

        saveAsPDF: function (filename, exportServer, isUploadOnly) {
            return this._saveAsImage('pdf', filename, exportServer, isUploadOnly);
        },

        /** @private */
        _saveAsImage: function (type, fileName, exportServer, isUploadOnly) {
            var hasRangeSelector = false;
            for (var i = 0; i < this.seriesGroups.length && !hasRangeSelector; i++) {
                var xAxis = this._getXAxis(i);
                if (xAxis && xAxis.rangeSelector)
                    hasRangeSelector = true;
            }

            return $.jqx._widgetToImage(this, type, fileName, exportServer, isUploadOnly, hasRangeSelector ? this._selectorSaveAsImageCallback : undefined);
        },

        _selectorSaveAsImageCallback: function (instance, canvas) {
            var self = instance;

            for (var i = 0; i < self.seriesGroups.length; i++) {
                var xAxis = self._getXAxis(i);
                if (!xAxis || !xAxis.rangeSelector || xAxis.rangeSelector.renderTo)
                    continue;

                var selectorInstanceRef = self._rangeSelectorInstances[i];
                if (!selectorInstanceRef)
                    continue;

                var selectorInstance = selectorInstanceRef.jqxChart('getInstance');
                var renderEngineSave = selectorInstance.renderEngine;

                var rect = selectorInstance.renderer.getRect();
                var selectorCanvas = selectorInstance.renderer.getContainer().find('canvas')[0];

                var selectorContext = selectorCanvas.getContext('2d');

                var slider = self._sliders[i];
                var swapXY = self.seriesGroups[i].orientation == 'horizontal';
                var widthProp = !swapXY ? 'width' : 'height';
                var rwidthProp = swapXY ? 'width' : 'height';
                var posProp = !swapXY ? 'x' : 'y';
                var rposProp = swapXY ? 'x' : 'y';

                var selectedRect = {};
                selectedRect[posProp] = slider.startOffset + slider.rect[posProp];
                selectedRect[rposProp] = slider.rect[rposProp];
                selectedRect[widthProp] = slider.endOffset - slider.startOffset;
                selectedRect[rwidthProp] = slider.rect[rwidthProp];


                var colorSelectedRange = xAxis.rangeSelector.colorSelectedRange || 'blue';
                var colorUnselectedRange = xAxis.rangeSelector.colorUnselectedRange || 'white';
                var colorRangeLineColor = xAxis.rangeSelector.colorRangeLine || 'grey';


                var elements = [];
                elements.push(selectorInstance.renderer.rect(selectedRect.x, selectedRect.y, selectedRect.width, selectedRect.height, { fill: colorSelectedRange, opacity: 0.1 }));

                if (!swapXY) {
                    elements.push(selectorInstance.renderer.line($.jqx._ptrnd(slider.rect.x), $.jqx._ptrnd(slider.rect.y), $.jqx._ptrnd(selectedRect.x), $.jqx._ptrnd(slider.rect.y), { stroke: colorRangeLineColor, opacity: 0.5 }));
                    elements.push(selectorInstance.renderer.line($.jqx._ptrnd(selectedRect.x + selectedRect.width), $.jqx._ptrnd(slider.rect.y), $.jqx._ptrnd(slider.rect.x + slider.rect.width), $.jqx._ptrnd(slider.rect.y), { stroke: colorRangeLineColor, opacity: 0.5 }));

                    elements.push(selectorInstance.renderer.line($.jqx._ptrnd(selectedRect.x), $.jqx._ptrnd(slider.rect.y), $.jqx._ptrnd(selectedRect.x), $.jqx._ptrnd(slider.rect.y + slider.rect.height), { stroke: colorRangeLineColor, opacity: 0.5 }));
                    elements.push(selectorInstance.renderer.line($.jqx._ptrnd(selectedRect.x + selectedRect.width), $.jqx._ptrnd(slider.rect.y), $.jqx._ptrnd(selectedRect.x + selectedRect.width), $.jqx._ptrnd(slider.rect.y + slider.rect.height), { stroke: colorRangeLineColor, opacity: 0.5 }));
                }
                else {
                    elements.push(selectorInstance.renderer.line($.jqx._ptrnd(slider.rect.x + slider.rect.width), $.jqx._ptrnd(slider.rect.y), $.jqx._ptrnd(slider.rect.x + slider.rect.width), $.jqx._ptrnd(selectedRect.y), { stroke: colorRangeLineColor, opacity: 0.5 }));
                    elements.push(selectorInstance.renderer.line($.jqx._ptrnd(slider.rect.x + slider.rect.width), $.jqx._ptrnd(selectedRect.y + selectedRect.height), $.jqx._ptrnd(slider.rect.x + slider.rect.width), $.jqx._ptrnd(slider.rect.y + slider.rect.height), { stroke: colorRangeLineColor, opacity: 0.5 }));

                    elements.push(selectorInstance.renderer.line($.jqx._ptrnd(slider.rect.x), $.jqx._ptrnd(selectedRect.y), $.jqx._ptrnd(slider.rect.x + slider.rect.width), $.jqx._ptrnd(selectedRect.y), { stroke: colorRangeLineColor, opacity: 0.5 }));
                    elements.push(selectorInstance.renderer.line($.jqx._ptrnd(slider.rect.x), $.jqx._ptrnd(selectedRect.y + selectedRect.height), $.jqx._ptrnd(slider.rect.x + slider.rect.width), $.jqx._ptrnd(selectedRect.y + selectedRect.height), { stroke: colorRangeLineColor, opacity: 0.5 }));
                }

                selectorInstance.renderer.refresh();

                var imgdata = selectorContext.getImageData(rect.x, rect.y, rect.width, rect.height);

                var hostContext = canvas.getContext('2d');

                hostContext.putImageData(
                    imgdata,
                    parseInt(selectorInstanceRef.css('left')),
                    parseInt(selectorInstanceRef.css('top')),
                    1,
                    1,
                    rect.width,
                    rect.height);

                for (var j = 0; j < elements.length; j++)
                    selectorInstance.renderer.removeElement(elements[j]);

                selectorInstance.renderer.refresh();

            }

            return true;
        },

        refresh: function () {
            this._internalRefresh();
        },

        update: function () {
            this._isUpdate = true;
            this._internalRefresh();
        },

        /** @private */
        _seriesTypes: [
            'line', 'stackedline', 'stackedline100',
            'spline', 'stackedspline', 'stackedspline100',
            'stepline', 'stackedstepline', 'stackedstepline100',
            'area', 'stackedarea', 'stackedarea100',
            'splinearea', 'stackedsplinearea', 'stackedsplinearea100',
            'steparea', 'stackedsteparea', 'stackedsteparea100',
            'rangearea', 'splinerangearea', 'steprangearea',
            'column', 'stackedcolumn', 'stackedcolumn100', 'rangecolumn',
            'scatter', 'stackedscatter', 'stackedscatter100',
            'bubble', 'stackedbubble', 'stackedbubble100',
            'pie',
            'donut',
            'candlestick',
            'ohlc',
            'waterfall', 'stackedwaterfall'],

        clear: function () {
            var self = this;

            for (var setting in self._defaultSettings)
                self[setting] = self._defaultSettings[setting];

            self.title = '';
            self.description = '';

            self.refresh();
        },

        _validateSeriesGroups: function () {
            if (!$.isArray(this.seriesGroups))
                throw 'Invalid property: \'seriesGroups\' property is required and must be a valid array.';
            for (var i = 0; i < this.seriesGroups.length; i++) {
                var group = this.seriesGroups[i];
                if (!group.type)
                    throw 'Invalid property: Each series group must have a valid \'type\' property.'

                if (!$.isArray(group.series))
                    throw 'Invalid property: Each series group must have a \'series\' property which must be a valid array.'
            }
        },

        /** @private */
        _render: function (rect) {
            var self = this;
            var renderer = self.renderer;
            self._validateSeriesGroups();

            self._colorsCache.clear();

            if (!self._isToggleRefresh && self._isUpdate && self._renderData)
                self._renderDataClone();

            self._renderData = [];

            renderer.clear();
            self._unselect();
            self._hideToolTip(0);

            var bckgImg = self.backgroundImage;
            if (bckgImg == undefined || bckgImg == '')
                self.host.css({ 'background-image': '' });
            else
                self.host.css({ 'background-image': (bckgImg.indexOf('(') != -1 ? bckgImg : "url('" + bckgImg + "')") });

            self._rect = rect;

            var padding = self.padding || { left: 5, top: 5, right: 5, bottom: 5 };

            var clipAll = renderer.createClipRect(rect);
            var groupAll = renderer.beginGroup();
            renderer.setClip(groupAll, clipAll);

            var rFill = renderer.rect(rect.x, rect.y, rect.width - 2, rect.height - 2);

            if (bckgImg == undefined || bckgImg == '')
                renderer.attr(rFill, { fill: self.backgroundColor || self.background || 'white' });
            else
                renderer.attr(rFill, { fill: 'transparent' });

            if (self.showBorderLine != false) {
                var borderColor = self.borderLineColor == undefined ? self.borderColor : self.borderLineColor;
                if (borderColor == undefined)
                    borderColor = self._defaultLineColor;

                var borderLineWidth = this.borderLineWidth;
                if (isNaN(borderLineWidth) || borderLineWidth < 0 || borderLineWidth > 10)
                    borderLineWidth = 1;

                renderer.attr(rFill, { 'stroke-width': borderLineWidth, stroke: borderColor });
            }
            else {
                if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                    renderer.attr(rFill, { 'stroke-width': 1, stroke: self.backgroundColor || 'white' });
                }
            }

            // Invoke user-defined drawing
            if ($.isFunction(self.drawBefore)) {
                self.drawBefore(renderer, rect);
            }

            var paddedRect = { x: padding.left, y: padding.top, width: rect.width - padding.left - padding.right, height: rect.height - padding.top - padding.bottom };
            self._paddedRect = paddedRect;
            var titlePadding = self.titlePadding || { left: 2, top: 2, right: 2, bottom: 2 };

            var sz;
            if (self.title && self.title.length > 0) {
                var cssTitle = self.toThemeProperty('jqx-chart-title-text', null);
                sz = renderer.measureText(self.title, 0, { 'class': cssTitle });
                renderer.text(self.title, paddedRect.x + titlePadding.left, paddedRect.y + titlePadding.top, paddedRect.width - (titlePadding.left + titlePadding.right), sz.height, 0, { 'class': cssTitle }, true, 'center', 'center');
                paddedRect.y += sz.height;
                paddedRect.height -= sz.height;
            }
            if (self.description && self.description.length > 0) {
                var cssDesc = self.toThemeProperty('jqx-chart-title-description', null);
                sz = renderer.measureText(self.description, 0, { 'class': cssDesc });
                renderer.text(self.description, paddedRect.x + titlePadding.left, paddedRect.y + titlePadding.top, paddedRect.width - (titlePadding.left + titlePadding.right), sz.height, 0, { 'class': cssDesc }, true, 'center', 'center');

                paddedRect.y += sz.height;
                paddedRect.height -= sz.height;
            }

            if (self.title || self.description) {
                paddedRect.y += (titlePadding.bottom + titlePadding.top);
                paddedRect.height -= (titlePadding.bottom + titlePadding.top);
            }

            var plotRect = { x: paddedRect.x, y: paddedRect.y, width: paddedRect.width, height: paddedRect.height };
            self._plotRect = plotRect;

            // build stats
            self._buildStats(plotRect);

            var isPieOnly = self._isPieOnlySeries();

            var seriesGroups = self.seriesGroups;

            // axis validation
            var swap;
            var hashAxis = { xAxis: {}, valueAxis: {} };
            for (var i = 0; i < seriesGroups.length && !isPieOnly; i++) {
                if (seriesGroups[i].type == 'pie' || seriesGroups[i].type == 'donut')
                    continue;

                var xAxis = self._getXAxis(i);
                if (!xAxis)
                    throw 'seriesGroup[' + i + '] is missing xAxis definition';

                var xAxisId = xAxis == self._getXAxis() ? -1 : i;
                hashAxis.xAxis[xAxisId] = 0x00;
            }

            var axisPadding = self.axisPadding;
            if (isNaN(axisPadding))
                axisPadding = 5;

            // get vertical axis width
            var wYAxis = { left: 0, right: 0, leftCount: 0, rightCount: 0 };
            var wYAxisArr = [];

            for (i = 0; i < seriesGroups.length; i++) {
                var g = seriesGroups[i];
                if (g.type == 'pie' || g.type == 'donut' || g.spider == true || g.polar == true) {
                    wYAxisArr.push({ width: 0, position: 0, xRel: 0 });
                    continue;
                }

                swap = g.orientation == 'horizontal';

                var xAxis = self._getXAxis(i);
                var xAxisId = xAxis == self._getXAxis() ? -1 : i;

                var valueAxis = self._getValueAxis(i);
                var valueAxisId = valueAxis == self._getValueAxis() ? -1 : i;

                var w = !swap ? valueAxis.axisSize : xAxis.axisSize;
                var axisR = { x: 0, y: plotRect.y, width: plotRect.width, height: plotRect.height };
                var position = swap ? self._getXAxis(i).position : valueAxis.position;

                if (!w || w == 'auto') {
                    if (swap) {
                        w = this._renderXAxis(i, axisR, true, plotRect).width;
                        if ((hashAxis.xAxis[xAxisId] & 0x01) == 0x01)
                            w = 0;
                        else if (w > 0)
                            hashAxis.xAxis[xAxisId] |= 0x01;
                    }
                    else {
                        w = self._renderValueAxis(i, axisR, true, plotRect).width;
                        if ((hashAxis.valueAxis[valueAxisId] & 0x01) == 0x01)
                            w = 0;
                        else if (w > 0)
                            hashAxis.valueAxis[valueAxisId] |= 0x01;
                    }
                }

                if (position != 'left' && self.rtl == true)
                    position = 'right';
                if (position != 'right')
                    position = 'left';

                if (wYAxis[position + 'Count'] > 0 && wYAxis[position] > 0 && w > 0)
                    wYAxis[position] += axisPadding;

                wYAxisArr.push({ width: w, position: position, xRel: wYAxis[position] });
                wYAxis[position] += w;
                wYAxis[position + 'Count']++;
            }

            var measureSize = Math.max(1, Math.max(rect.width, rect.height));

            // get horizontal axis height
            var hXAxis = { top: 0, bottom: 0, topCount: 0, bottomCount: 0 };
            var hXAxisArr = [];

            for (i = 0; i < seriesGroups.length; i++) {
                var g = seriesGroups[i];
                if (g.type == 'pie' || g.type == 'donut' || g.spider == true || g.polar == true) {
                    hXAxisArr.push({ height: 0, position: 0, yRel: 0 });
                    continue;
                }

                swap = g.orientation == 'horizontal';

                var valueAxis = this._getValueAxis(i);
                var valueAxisId = valueAxis == self._getValueAxis() ? -1 : i;

                var xAxis = self._getXAxis(i);
                var xAxisId = xAxis == self._getXAxis() ? -1 : i;

                var h = !swap ? xAxis.axisSize : valueAxis.axisSize;
                var position = swap ? valueAxis.position : xAxis.position;

                if (!h || h == 'auto') {
                    if (swap) {
                        h = self._renderValueAxis(i, { x: 0, y: 0, width: measureSize, height: 0 }, true, plotRect).height;
                        if ((hashAxis.valueAxis[valueAxisId] & 0x02) == 0x02)
                            h = 0;
                        else if (h > 0)
                            hashAxis.valueAxis[valueAxisId] |= 0x02;
                    }
                    else {
                        h = self._renderXAxis(i, { x: 0, y: 0, width: measureSize, height: 0 }, true).height;
                        if ((hashAxis.xAxis[xAxisId] & 0x02) == 0x02)
                            h = 0;
                        else if (h > 0)
                            hashAxis.xAxis[xAxisId] |= 0x02;
                    }
                }

                if (position != 'top')
                    position = 'bottom';

                if (hXAxis[position + 'Count'] > 0 && hXAxis[position] > 0 && h > 0)
                    hXAxis[position] += axisPadding;

                hXAxisArr.push({ height: h, position: position, yRel: hXAxis[position] });

                hXAxis[position] += h;
                hXAxis[position + 'Count']++;
            }

            self._createAnimationGroup("series");

            var showLegend = (self.showLegend != false);
            var szLegend = !showLegend ? { width: 0, height: 0} : self._renderLegend(self.legendLayout ? self._rect : paddedRect, true);
            if (this.legendLayout && (!isNaN(this.legendLayout.left) || !isNaN(this.legendLayout.top)))
                szLegend = { width: 0, height: 0 };

            if (paddedRect.height < hXAxis.top + hXAxis.bottom + szLegend.height || paddedRect.width < wYAxis.left + wYAxis.right) {
                renderer.endGroup();
                return;
            }

            plotRect.height -= hXAxis.top + hXAxis.bottom + szLegend.height;

            plotRect.x += wYAxis.left;
            plotRect.width -= wYAxis.left + wYAxis.right;
            plotRect.y += hXAxis.top;

            var xAxisRect = [];

            if (!isPieOnly) {
                var lineColor = self._getXAxis().tickMarksColor || self._defaultLineColor;

                for (i = 0; i < seriesGroups.length; i++) {
                    var g = seriesGroups[i];
                    if (g.polar == true || g.spider == true || g.type == 'pie' || g.type == 'donut')
                        continue;

                    swap = g.orientation == 'horizontal';
                    var xAxisId = self._getXAxis(i) == self._getXAxis() ? -1 : i;
                    var valueAxisId = self._getValueAxis(i) == self._getValueAxis() ? -1 : i;

                    var axisR = { x: plotRect.x, y: 0, width: plotRect.width, height: hXAxisArr[i].height };
                    if (hXAxisArr[i].position != 'top')
                        axisR.y = plotRect.y + plotRect.height + hXAxisArr[i].yRel;
                    else
                        axisR.y = plotRect.y - hXAxisArr[i].yRel - hXAxisArr[i].height;

                    if (swap) {
                        if ((hashAxis.valueAxis[valueAxisId] & 0x04) == 0x04)
                            continue;

                        if (!self._isGroupVisible(i))
                            continue;

                        self._renderValueAxis(i, axisR, false, plotRect);

                        hashAxis.valueAxis[valueAxisId] |= 0x04;
                    }
                    else {
                        xAxisRect.push(axisR);

                        if ((hashAxis.xAxis[xAxisId] & 0x04) == 0x04)
                            continue;

                        if (!self._isGroupVisible(i))
                            continue;

                        self._renderXAxis(i, axisR, false, plotRect);
                        hashAxis.xAxis[xAxisId] |= 0x04;
                    }
                }
            }

            if (showLegend) {
                var containerRect = self.legendLayout ? self._rect : paddedRect;

                var x = paddedRect.x + $.jqx._ptrnd((paddedRect.width - szLegend.width) / 2);
                var y = plotRect.y + plotRect.height + hXAxis.bottom;
                var w = paddedRect.width;
                var h = szLegend.height;
                if (self.legendLayout) {
                    if (!isNaN(self.legendLayout.left))
                        x = self.legendLayout.left;

                    if (!isNaN(self.legendLayout.top))
                        y = self.legendLayout.top;

                    if (!isNaN(self.legendLayout.width))
                        w = self.legendLayout.width;

                    if (!isNaN(self.legendLayout.height))
                        h = self.legendLayout.height;
                }

                if (x + w > containerRect.x + containerRect.width)
                    w = containerRect.x + containerRect.width - x;
                if (y + h > containerRect.y + containerRect.height)
                    h = containerRect.y + containerRect.height - y;

                self._renderLegend({ x: x, y: y, width: w, height: h });
            }

            self._hasHorizontalLines = false;
            if (!isPieOnly) {
                for (i = 0; i < seriesGroups.length; i++) {
                    var g = seriesGroups[i];

                    if (g.polar == true || g.spider == true || g.type == 'pie' || g.type == 'donut')
                        continue;

                    swap = seriesGroups[i].orientation == 'horizontal';
                    var axisR = { x: plotRect.x - wYAxisArr[i].xRel - wYAxisArr[i].width, y: plotRect.y, width: wYAxisArr[i].width, height: plotRect.height };
                    if (wYAxisArr[i].position != 'left')
                        axisR.x = plotRect.x + plotRect.width + wYAxisArr[i].xRel;

                    var xAxisId = self._getXAxis(i) == self._getXAxis() ? -1 : i;
                    var valueAxisId = self._getValueAxis(i) == self._getValueAxis() ? -1 : i;

                    if (swap) {
                        xAxisRect.push(axisR);

                        if ((hashAxis.xAxis[xAxisId] & 0x08) == 0x08)
                            continue;

                        if (!self._isGroupVisible(i))
                            continue;

                        self._renderXAxis(i, axisR, false, plotRect);
                        hashAxis.xAxis[xAxisId] |= 0x08;
                    }
                    else {
                        if ((hashAxis.valueAxis[valueAxisId] & 0x08) == 0x08)
                            continue;

                        if (!self._isGroupVisible(i))
                            continue;

                        self._renderValueAxis(i, axisR, false, plotRect);
                        hashAxis.valueAxis[valueAxisId] |= 0x08;
                    }
                }
            }

            if (plotRect.width <= 0 || plotRect.height <= 0)
                return;

            self._plotRect = { x: plotRect.x, y: plotRect.y, width: plotRect.width, height: plotRect.height };

            for (i = 0; i < seriesGroups.length; i++) {
                this._drawPlotAreaLines(i, true, { gridLines: false, tickMarks: false, alternatingBackground: true });
                this._drawPlotAreaLines(i, false, { gridLines: false, tickMarks: false, alternatingBackground: true });
            }

            for (i = 0; i < seriesGroups.length; i++) {
                this._drawPlotAreaLines(i, true, { gridLines: true, tickMarks: true, alternatingBackground: false });
                this._drawPlotAreaLines(i, false, { gridLines: true, tickMarks: true, alternatingBackground: false });
            }

            var hasCustomDraw = false;
            for (i = 0; i < seriesGroups.length && !hasCustomDraw; i++) {
                var g = seriesGroups[i];
                if (g.annotations !== undefined ||
                    $.isFunction(g.draw) ||
                    $.isFunction(g.drawBefore)
                    ) {
                    hasCustomDraw = true;
                    break;
                }
            }

            var gPlot = renderer.beginGroup();

            if (!hasCustomDraw) {
                var clip = renderer.createClipRect({ x: plotRect.x - 2, y: plotRect.y, width: plotRect.width + 4, height: plotRect.height });
                renderer.setClip(gPlot, clip);
            }

            for (i = 0; i < seriesGroups.length; i++) {
                var g = seriesGroups[i];
                var isValid = false;
                for (var validtype in self._seriesTypes) {
                    if (self._seriesTypes[validtype] == g.type) {
                        isValid = true;
                        break;
                    }
                }
                if (!isValid)
                    throw 'Invalid serie type "' + g.type + '"';

                // custom drawing before the group
                if ($.isFunction(g.drawBefore))
                    g.drawBefore(renderer, rect, i, this);

                // polar series drawing
                if (g.polar == true || g.spider == true) {
                    if (g.type.indexOf('pie') == -1 && g.type.indexOf('donut') == -1)
                        self._renderSpiderAxis(i, plotRect);
                }

                self._renderAxisBands(i, plotRect, true);
                self._renderAxisBands(i, plotRect, false);
            }

            for (i = 0; i < seriesGroups.length; i++) {
                var g = seriesGroups[i];

                if (self._isColumnType(g.type))
                    self._renderColumnSeries(i, plotRect);
                else if (g.type.indexOf('pie') != -1 || g.type.indexOf('donut') != -1)
                    self._renderPieSeries(i, plotRect);
                else if (g.type.indexOf('line') != -1 || g.type.indexOf('area') != -1)
                    self._renderLineSeries(i, plotRect);
                else if (g.type.indexOf('scatter') != -1 || g.type.indexOf('bubble') != -1)
                    self._renderScatterSeries(i, plotRect);
                else if (g.type.indexOf('candlestick') != -1 || g.type.indexOf('ohlc') != -1)
                    self._renderCandleStickSeries(i, plotRect, g.type.indexOf('ohlc') != -1);

                if (g.annotations) {
                    if (!this._moduleAnnotations)
                        throw "Please include 'jqxchart.annotations.js'";

                    for (var j = 0; j < g.annotations.length; j++)
                        self._renderAnnotation(i, g.annotations[j], plotRect);
                }

                // custom drawing after the group
                if ($.isFunction(g.draw))
                    self.draw(renderer, rect, i, this);
            }

            renderer.endGroup();

            if (self.enabled == false) {
                var el = renderer.rect(rect.x, rect.y, rect.width, rect.height);
                renderer.attr(el, { fill: '#777777', opacity: 0.5, stroke: '#00FFFFFF' });
            }

            // Invoke user-defined drawing
            if ($.isFunction(self.draw)) {
                self.draw(renderer, rect);
            }

            renderer.endGroup();

            self._startAnimation("series");

         
            // render range selector
            var hasRangeSelector = false;
            for (var i = 0; i < self.seriesGroups.length && !hasRangeSelector; i++) {
                var xAxis = self._getXAxis(i);
                if (xAxis && xAxis.rangeSelector)
                    hasRangeSelector = true;
            }

            if (hasRangeSelector) {
                if (!this._moduleRangeSelector)
                    throw "Please include 'jqxchart.rangeselector.js'";

                var isRendered = [];

                if (!this._isSelectorRefresh) {
                    self.removeHandler($(document), self._getEvent('mousemove'), self._onSliderMouseMove);
                    self.removeHandler($(document), self._getEvent('mousedown'), self._onSliderMouseDown);
                    self.removeHandler($(document), self._getEvent('mouseup'), self._onSliderMouseUp);
                }

                if (!self._isSelectorRefresh)
                    self._rangeSelectorInstances = {};

                for (i = 0; i < self.seriesGroups.length; i++) {
                    var axis = this._getXAxis(i);

                    if (isRendered.indexOf(axis) == -1) {
                        if (this._renderXAxisRangeSelector(i, xAxisRect[i]))
                            isRendered.push(axis);
                    }
                }
            }
        },

        /** @private */
        _isPieOnlySeries: function () {
            var seriesGroups = this.seriesGroups;
            if (seriesGroups.length == 0)
                return false;

            for (var i = 0; i < seriesGroups.length; i++) {
                if (seriesGroups[i].type != 'pie' && seriesGroups[i].type != 'donut')
                    return false;
            }

            return true;
        },

        /** @private */
        _renderChartLegend: function (data, rect, isMeasure, isVerticalFlow) {
            var self = this;
            var renderer = self.renderer;

            var r = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
            var padding = 3;
            if (r.width >= 2 * padding) {
                r.x += padding;
                r.width -= 2 * padding;
            }
            if (r.height >= 2 * padding) {
                r.y += padding;
                r.height -= 2 * padding;
            }

            var szMeasure = { width: r.width, height: 0 };

            var x = 0, y = 0;
            var rowH = 20;
            var rowW = 0;
            var barSize = 10;
            var space = 10;
            var maxWidth = 0;
            for (var i = 0; i < data.length; i++) {
                var css = data[i].css;
                if (!css)
                    css = self.toThemeProperty('jqx-chart-legend-text', null);

                rowH = 20;
                var text = data[i].text;
                var sz = renderer.measureText(text, 0, { 'class': css });

                if (sz.height > rowH) {
                    rowH = sz.height;
                }

                if (sz.width > maxWidth)
                    maxWidth = sz.width;

                if (isVerticalFlow) {
                    if (i != 0)
                        y += rowH;

                    if (y > r.height) {
                        y = 0;
                        x += maxWidth + 2 * space + barSize;
                        maxWidth = sz.width;
                        szMeasure.width = x + maxWidth;
                    }
                }
                else {
                    if (x != 0)
                        x += space;

                    if (x + 2 * barSize + sz.width > r.width && sz.width < r.width) {
                        x = 0;
                        y += rowH;
                        rowH = 20;
                        rowW = r.width;
                        szMeasure.height = y + rowH;
                    }
                }

                var wrap = false;
                if (sz.width > r.width) {
                    wrap = true;
                    var wrapWidth = r.width;
                    var legendInfo = text;
                    var words = legendInfo.split(/\s+/);
                    var textInfo = [];
                    var currentLine = "";
                    for (var iWord = 0; iWord < words.length; iWord++) {
                        var txt = currentLine + ((currentLine.length > 0) ? " " : "") + words[iWord];
                        var textSize = self.renderer.measureText(txt, 0, { 'class': css });

                        if (textSize.width > wrapWidth && txt.length > 0 && currentLine.length > 0) {
                            textInfo.push({ text: currentLine });
                            currentLine = words[iWord];
                        }
                        else
                            currentLine = txt;

                        if (iWord + 1 == words.length)
                            textInfo.push({ text: currentLine });
                    }

                    sz.width = 0;
                    var height = 0;
                    for (var t = 0; t < textInfo.length; t++) {
                        var textItem = textInfo[t].text;
                        var textSize = self.renderer.measureText(textItem, 0, { 'class': css });
                        sz.width = Math.max(sz.width, textSize.width);
                        height += sz.height;
                    }
                    sz.height = height;
                }

                var renderInBounds = (x + sz.width < r.width) && (y + sz.height < rect.height);

                if (self.legendLayout) {
                    var renderInBounds = r.x + x + sz.width < self._rect.x + self._rect.width &&
                        r.y + y + sz.height < self._rect.y + self._rect.height;
                }

                if (!isMeasure && renderInBounds
                  ) {
                    var sidx = data[i].seriesIndex;
                    var gidx = data[i].groupIndex;
                    var iidx = data[i].itemIndex;
                    var fillColor = data[i].fillColor;
                    var lineColor = data[i].lineColor;

                    var isVisible = self._isSerieVisible(gidx, sidx, iidx);
                    var g = renderer.beginGroup();
                    var opacity = isVisible ? data[i].opacity : 0.1;
                    if (wrap) {
                        var legendInfo = text;
                        var wrapWidth = r.width;
                        var words = legendInfo.split(/\s+/);
                        var wrapText = "";
                        var dy = 0;
                        var textInfo = [];

                        var currentLine = "";
                        for (var iWord = 0; iWord < words.length; iWord++) {
                            var txt = currentLine + ((currentLine.length > 0) ? " " : "") + words[iWord];
                            var textSize = self.renderer.measureText(txt, 0, { 'class': css });

                            if (textSize.width > wrapWidth && txt.length > 0 && currentLine.length > 0) {
                                textInfo.push({ text: currentLine, dy: dy });
                                dy += textSize.height;

                                currentLine = words[iWord]
                            }
                            else
                                currentLine = txt;

                            if (iWord + 1 == words.length)
                                textInfo.push({ text: currentLine, dy: dy });
                        }


                        for (var t = 0; t < textInfo.length; t++) {
                            var textItem = textInfo[t].text;
                            dy = textInfo[t].dy;
                            var textSize = self.renderer.measureText(textItem, 0, { 'class': css });
                            if (isVerticalFlow) {
                                self.renderer.text(textItem, r.x + x + 1.5 * barSize, r.y + y + dy, sz.width, rowH, 0, { 'class': css }, false, 'left', 'center');
                            }
                            else {
                                self.renderer.text(textItem, r.x + x + 1.5 * barSize, r.y + y + dy, sz.width, rowH, 0, { 'class': css }, false, 'center', 'center');
                            }
                        }

                        var elem = renderer.rect(r.x + x, r.y + y + barSize / 2 + dy / 2, barSize, barSize);
                        if (isVerticalFlow)
                            y += dy;

                        self.renderer.attr(elem, { fill: fillColor, 'fill-opacity': opacity, stroke: lineColor, 'stroke-width': 1, 'stroke-opacity': data[i].opacity });
                    }
                    else {
                        var elem = renderer.rect(r.x + x, r.y + y + barSize / 2, barSize, barSize);
                        self.renderer.attr(elem, { fill: fillColor, 'fill-opacity': opacity, stroke: lineColor, 'stroke-width': 1, 'stroke-opacity': data[i].opacity });
                        if (isVerticalFlow) {
                            self.renderer.text(text, r.x + x + 1.5 * barSize, r.y + y, sz.width, sz.height + barSize / 2, 0, { 'class': css }, false, 'left', 'center');
                        }
                        else {
                            self.renderer.text(text, r.x + x + 1.5 * barSize, r.y + y, sz.width, rowH, 0, { 'class': css }, false, 'center', 'center');
                        }
                    }
                    self.renderer.endGroup();

                    self._setLegendToggleHandler(gidx, sidx, iidx, g);
                }

                if (isVerticalFlow) {
                }
                else {
                    x += sz.width + 2 * barSize;
                    if (rowW < x)
                        rowW = x;
                }
            }

            if (isMeasure) {
                szMeasure.height = $.jqx._ptrnd(y + rowH + 5);
                szMeasure.width = $.jqx._ptrnd(rowW);
                return szMeasure;
            }
        },

        isSerieVisible: function (groupIndex, serieIndex, itemIndex) {
            return this._isSerieVisible(groupIndex, serieIndex, itemIndex);
        },

        /** @private */
        _isSerieVisible: function (groupIndex, serieIndex, itemIndex) {
            while (this._itemsToggleState.length < groupIndex + 1)
                this._itemsToggleState.push([]);

            var g = this._itemsToggleState[groupIndex];
            while (g.length < serieIndex + 1)
                g.push(isNaN(itemIndex) ? true : []);

            var s = g[serieIndex];
            if (isNaN(itemIndex))
                return s;

            if (!$.isArray(s))
                g[serieIndex] = s = [];

            while (s.length < itemIndex + 1)
                s.push(true);

            return s[itemIndex];
        },

        isGroupVisible: function (groupIndex) {
            return this._isGroupVisible(groupIndex);
        },

        /** @private */
        _isGroupVisible: function (groupIndex) {
            var isGroupVisible = false;
            var series = this.seriesGroups[groupIndex].series;
            if (!series)
                return isGroupVisible;

            for (var i = 0; i < series.length; i++) {
                if (this._isSerieVisible(groupIndex, i)) {
                    isGroupVisible = true;
                    break;
                }
            }

            return isGroupVisible;
        },

        /** @private */
        _toggleSerie: function (groupIndex, serieIndex, itemIndex, enable) {
            var state = !this._isSerieVisible(groupIndex, serieIndex, itemIndex);
            if (enable != undefined)
                state = enable;

            var group = this.seriesGroups[groupIndex];
            var serie = group.series[serieIndex];

            this._raiseEvent('toggle', { state: state, seriesGroup: group, serie: serie, elementIndex: itemIndex });

            if (isNaN(itemIndex))
                this._itemsToggleState[groupIndex][serieIndex] = state;
            else {
                var s = this._itemsToggleState[groupIndex][serieIndex];

                if (!$.isArray(s))
                    s = [];

                while (s.length < itemIndex)
                    s.push(true);

                s[itemIndex] = state;
            }

            this._isToggleRefresh = true;
            this.update();
            this._isToggleRefresh = false;
        },

        showSerie: function (groupIndex, serieIndex, itemIndex) {
            this._toggleSerie(groupIndex, serieIndex, itemIndex, true);
        },

        hideSerie: function (groupIndex, serieIndex, itemIndex) {
            this._toggleSerie(groupIndex, serieIndex, itemIndex, false);
        },

        /** @private */
        _setLegendToggleHandler: function (groupIndex, serieIndex, itemIndex, element) {
            var g = this.seriesGroups[groupIndex];
            var s = g.series[serieIndex];

            var enableSeriesToggle = s.enableSeriesToggle;
            if (enableSeriesToggle == undefined)
                enableSeriesToggle = g.enableSeriesToggle != false;

            if (enableSeriesToggle) {
                var self = this;
                this.renderer.addHandler(element, 'click', function (e) {
                    //e.preventDefault();

                    self._toggleSerie(groupIndex, serieIndex, itemIndex);
                });
            }
        },

        /** @private */
        _renderLegend: function (rect, isMeasure) {
            var self = this;
            var legendData = [];

            for (var gidx = 0; gidx < self.seriesGroups.length; gidx++) {
                var g = self.seriesGroups[gidx];
                if (g.showLegend == false)
                    continue;

                for (var sidx = 0; sidx < g.series.length; sidx++) {
                    var s = g.series[sidx];
                    if (s.showLegend == false)
                        continue;

                    var settings = self._getSerieSettings(gidx, sidx);
                    var legendText;

                    if (g.type == 'pie' || g.type == 'donut') {
                        var xAxis = self._getXAxis(gidx);
                        var fs = s.legendFormatSettings || g.legendFormatSettings || xAxis.formatSettings || s.formatSettings || g.formatSettings;
                        var ff = s.legendFormatFunction || g.legendFormatFunction || xAxis.formatFunction || s.formatFunction || g.formatFunction;

                        var dataLength = self._getDataLen(gidx);
                        for (var i = 0; i < dataLength; i++) {
                            legendText = self._getDataValue(i, s.displayText, gidx);
                            legendText = self._formatValue(legendText, fs, ff, gidx, sidx, i);

                            var colors = self._getColors(gidx, sidx, i);

                            legendData.push({ groupIndex: gidx, seriesIndex: sidx, itemIndex: i, text: legendText, css: s.displayTextClass, fillColor: colors.fillColor, lineColor: colors.lineColor, opacity: settings.opacity });
                        }

                        continue;
                    }

                    var fs = s.legendFormatSettings || g.legendFormatSettings;
                    var ff = s.legendFormatFunction || g.legendFormatFunction;

                    legendText = self._formatValue(s.displayText || s.dataField || '', fs, ff, gidx, sidx, NaN);
                    var colors = self._getSeriesColors(gidx, sidx);
                    var fillColor = this._get([s.legendFillColor, s.legendColor, colors.fillColor]);
                    var lineColor = this._get([s.legendLineColor, s.legendColor, colors.lineColor]);

                    legendData.push({ groupIndex: gidx, seriesIndex: sidx, text: legendText, css: s.displayTextClass, fillColor: fillColor, lineColor: lineColor, opacity: settings.opacity });
                }
            }

            return self._renderChartLegend(legendData, rect, isMeasure, (self.legendLayout && self.legendLayout.flow == 'vertical'));
        },

        _getInterval: function (settings, baseUnitInterval) {
            if (!settings)
                return baseUnitInterval;

            var unitInterval = this._get([settings.unitInterval, baseUnitInterval]);
            if (!isNaN(settings.step))
                unitInterval = settings.step * baseUnitInterval;

            return unitInterval;
        },

        _getOffsets: function (key, axis, size, stats, settings, padding, valuesOnTicks, baseUnitInterval, useMidVal) {
            var interval = this._getInterval(settings[key], baseUnitInterval);

            var vals = [];
            if (key == '' || (settings[key].visible && settings[key].visible != 'custom'))
                vals = this._generateIntervalValues(stats, interval, baseUnitInterval, valuesOnTicks, useMidVal);

            var offs;
            if (key != 'labels') {
                var xOffsetAdj = valuesOnTicks ? padding.left : 0;
                if (!valuesOnTicks && baseUnitInterval > 1) {
                    xOffsetAdj = padding.left * (baseUnitInterval + 1);
                }

                // special case with a single value
                if (vals.length == 1)
                    xOffsetAdj *= 2;

                offs = this._valuesToOffsets(vals, axis, stats, size, padding, false, xOffsetAdj);
                if (!valuesOnTicks) {
                    var adjust = (padding.left + padding.right) * interval / baseUnitInterval;
                    if (axis.flip)
                        offs.unshift(offs[0] + adjust);
                    else
                        offs.push(offs[offs.length - 1] + adjust);
                }
            }
            else {
                var xOffsetAdj = padding.left;

                // special case with a single value
                if (vals.length == 1)
                    xOffsetAdj *= 2;

                offs = this._valuesToOffsets(vals, axis, stats, size, padding, valuesOnTicks, xOffsetAdj);
            }
            var out = this._arraysToObjectsArray([vals, offs], ['value', 'offset']);

            if (axis[key] && axis[key].custom) {
                var customVals = this._objectsArraysToArray(axis[key].custom, 'value');
                var customOffs = this._objectsArraysToArray(axis[key].custom, 'offset');
                var customValsOffs = this._valuesToOffsets(customVals, axis, stats, size, padding, valuesOnTicks, padding.left);
                for (var i = 0; i < axis[key].custom.length; i++) {
                    out.push({
                        value: customVals[i],
                        offset: isNaN(customOffs[i]) ? customValsOffs[i] : customOffs[i]
                    });
                }
            }

            return out;
        },

        /** @private */
        _renderXAxis: function (groupIndex, rect, isMeasure, chartRect) {
            var self = this;
            var axis = self._getXAxis(groupIndex);
            var g = self.seriesGroups[groupIndex];
            var swapXY = g.orientation == 'horizontal';
            var szMeasure = { width: 0, height: 0 };
            var settings = self._getAxisSettings(axis);

            if (!axis || !settings.visible || g.type == 'spider')
                return szMeasure;

            // check if the group has visible series
            if (!self._isGroupVisible(groupIndex) || this._isPieGroup(groupIndex))
                return szMeasure;

            var valuesOnTicks = self._alignValuesWithTicks(groupIndex);

            while (self._renderData.length < groupIndex + 1)
                self._renderData.push({});

            // TODO: Update RTL/FLIP flag
            if (self.rtl)
                axis.flip = true;

            var axisSize = swapXY ? rect.height : rect.width;

            var text = axis.text;

            var offsets = self._calculateXOffsets(groupIndex, axisSize);
            var axisStats = offsets.axisStats;

            var rangeSelector = axis.rangeSelector;
            var selectorSize = 0;
            if (rangeSelector) {
                if (!this._moduleRangeSelector)
                    throw "Please include 'jqxchart.rangeselector.js'";

                selectorSize = this._selectorGetSize(axis);
            }

            var isMirror = (swapXY && axis.position == 'right') || (!swapXY && axis.position == 'top');

            if (!isMeasure && rangeSelector) {
                if (swapXY) {
                    rect.width -= selectorSize;
                    if (axis.position != 'right')
                        rect.x += selectorSize;
                }
                else {
                    rect.height -= selectorSize;
                    if (axis.position == 'top')
                        rect.y += selectorSize;
                }
            }

            var renderData = {
                rangeLength: offsets.rangeLength,
                itemWidth: offsets.itemWidth,
                intervalWidth: offsets.intervalWidth,
                data: offsets,
                settings: settings,
                isMirror: isMirror,
                rect: rect
            };

            self._renderData[groupIndex].xAxis = renderData;

            var ui = axisStats.interval;
            if (isNaN(ui))
                return szMeasure;

            if (swapXY) {
                settings.title.angle -= 90;
                settings.labels.angle -= 90;
            }

            var gridLinesInterval = this._getInterval(settings.gridLines, ui);
            var tickMarksInterval = this._getInterval(settings.tickMarks, ui);
            var labelsInterval = this._getInterval(settings.labels, ui);

            var labelOffsets;

            var min = axisStats.min;
            var max = axisStats.max;

            var padding = offsets.padding;

            var flip = axis.flip == true || self.rtl;

            var range = { min: min, max: max };
            if (axisStats.logAxis.enabled) {
                range.min = axisStats.logAxis.minPow;
                range.max = axisStats.logAxis.maxPow;
            }

            if (axis.type == 'date') {
                settings.gridLines.offsets = this._generateDTOffsets(min, max, axisSize, padding, gridLinesInterval, ui, axisStats.dateTimeUnit, valuesOnTicks, NaN, false, flip);
                settings.tickMarks.offsets = this._generateDTOffsets(min, max, axisSize, padding, tickMarksInterval, ui, axisStats.dateTimeUnit, valuesOnTicks, NaN, false, flip);
                labelOffsets = this._generateDTOffsets(min, max, axisSize, padding, labelsInterval, ui, axisStats.dateTimeUnit, valuesOnTicks, NaN, true, flip);
            }
            else {
                settings.gridLines.offsets = this._getOffsets('gridLines', axis, axisSize, axisStats, settings, padding, valuesOnTicks, ui);
                settings.tickMarks.offsets = this._getOffsets('tickMarks', axis, axisSize, axisStats, settings, padding, valuesOnTicks, ui);
                labelOffsets = this._getOffsets('labels', axis, axisSize, axisStats, settings, padding, valuesOnTicks, ui);
            }

            var widgetRect = self.renderer.getRect();
            var paddingRight = widgetRect.width - rect.x - rect.width;
            var len = self._getDataLen(groupIndex);

            var oldPositions;
            if (self._elementRenderInfo && self._elementRenderInfo.length > groupIndex)
                oldPositions = self._elementRenderInfo[groupIndex].xAxis;

            var items = [];

            // prepare the axis labels
            var ffn;
            if (settings.labels.formatFunction)
                ffn = settings.labels.formatFunction;

            var fs;
            if (settings.labels.formatSettings)
                fs = $.extend({}, settings.labels.formatSettings);

            if (axis.type == 'date') {
                if (axis.dateFormat && !ffn) {
                    if (fs)
                        fs.dateFormat = fs.dateFormat || axis.dateFormat;
                    else
                        fs = { dateFormat: axis.dateFormat };
                }
                else if (!ffn && (!fs || (fs && !fs.dateFormat))) {
                    ffn = this._getDefaultDTFormatFn(axis.baseUnit || 'day');
                }
            }

            for (var i = 0; i < labelOffsets.length; i++) {
                var value = labelOffsets[i].value;
                var x = labelOffsets[i].offset;
                if (isNaN(x))
                    continue;

                var idx = undefined;

                if (axis.type != 'date' && axisStats.useIndeces && axis.dataField) {
                    idx = Math.round(value);
                    value = self._getDataValue(idx, axis.dataField);
                    if (value == undefined)
                        value = '';
                }

                var text = self._formatValue(value, fs, ffn, groupIndex, undefined, idx);

                if (text == undefined || text.toString() == '') {
                    if (isNaN(idx))
                        idx = i;

                    if (idx >= axisStats.filterRange.min && idx <= axisStats.filterRange.max)
                        text = axisStats.useIndeces ? (axisStats.min + idx).toString() : (value == undefined ? '' : value.toString());
                }

                var obj = { key: value, text: text, targetX: x, x: x };
                if (oldPositions && oldPositions.itemOffsets[value]) {
                    obj.x = oldPositions.itemOffsets[value].x;
                    obj.y = oldPositions.itemOffsets[value].y;
                }

                items.push(obj);
            }
            ///

            var anim = self._getAnimProps(groupIndex);
            var duration = anim.enabled && items.length < 500 ? anim.duration : 0;
            if (self.enableAxisTextAnimation == false)
                duration = 0;

            var itemsInfo = { items: items, renderData: renderData };

            var sz = self._renderAxis(swapXY, isMirror, settings, { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, chartRect, ui, false, true /*valuesOnTicks*/, itemsInfo, isMeasure, duration);

            if (swapXY)
                sz.width += selectorSize;
            else
                sz.height += selectorSize;

            return sz;
        },

        /** @private */
        _animateAxisText: function (context, percent) {
            var items = context.items;
            var textSettings = context.textSettings;

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (!item)
                    continue;

                if (!item.visible)
                    continue;

                var x = item.targetX;
                var y = item.targetY;
                if (!isNaN(item.x) && !isNaN(item.y)) {
                    x = item.x + (x - item.x) * percent;
                    y = item.y + (y - item.y) * percent;
                }

                // TODO: Optimize via text reponsitioning.
                // Requires SVG & VML text rendering changes
                if (item.element) {
                    this.renderer.removeElement(item.element);
                    item.element = undefined;
                }

                item.element = this.renderer.text(
                    item.text,
                    x,
                    y,
                    item.width,
                    item.height,
                    textSettings.angle,
                    { 'class': textSettings.style },
                    false,
                    textSettings.halign,
                    textSettings.valign,
                    textSettings.textRotationPoint);
            }
        },

        /** @private */
        _getPolarAxisCoords: function (groupIndex, rect) {
            var group = this.seriesGroups[groupIndex];

            var offsetX = rect.x + $.jqx.getNum([group.offsetX, rect.width / 2]);
            var offsetY = rect.y + $.jqx.getNum([group.offsetY, rect.height / 2]);

            var availableSize = Math.min(rect.width, rect.height);

            var radius = group.radius;

            if (this._isPercent(radius))
                radius = parseFloat(radius) / 100 * availableSize / 2;

            if (isNaN(radius))
                radius = availableSize / 2 * 0.6;

            var valuesOnTicks = this._alignValuesWithTicks(groupIndex);

            var startAngle = this._get([group.startAngle, group.minAngle, 0]) - 90;

            if (isNaN(startAngle))
                startAngle = 0;
            else {
                startAngle = 2 * Math.PI * startAngle / 360;
            }

            var endAngle = this._get([group.endAngle, group.maxAngle, 360]) - 90;

            if (isNaN(endAngle))
                endAngle = 2 * Math.PI;
            else {
                endAngle = 2 * Math.PI * endAngle / 360;
            }

            if (startAngle > endAngle) {
                var swap = startAngle;
                startAngle = endAngle;
                endAngle = swap;
            }

            var axisSizeRatio = $.jqx._rnd(Math.abs(startAngle - endAngle) / (Math.PI * 2), 0.001, true);
            var axisSize = Math.PI * 2 * radius * axisSizeRatio;

            var offsets = this._calcGroupOffsets(groupIndex, rect).xoffsets;
            if (!offsets)
                return;

            var isClosedCircle = !(Math.abs(Math.abs(endAngle - startAngle) - Math.PI * 2) > 0.00001);

            if (group.spider) {
                axisStats = this._getXAxisStats(groupIndex, this._getXAxis(groupIndex), axisSize);
                var interval = axisStats.interval;
                if (isNaN(interval) || interval == 0)
                    interval = 1;

                var slices = (axisStats.max - axisStats.min) / interval + (isClosedCircle ? 1 : 0);
                slices = Math.round(slices);

                if (slices > 2) {
                    var cos = Math.cos(Math.abs(endAngle - startAngle) / 2 / slices);
                    cos = $.jqx._rnd(cos, 0.01);

                    if (cos == 0)
                        cos = 1
                    var adjRadius = radius / cos;

                    if (adjRadius > radius && valuesOnTicks)
                        radius = adjRadius;
                }
            }

            radius = $.jqx._ptrnd(radius);
            //  axisSize = $.jqx._ptrnd(Math.PI * 2 * radius * axisSizeRatio);

            return {
                x: offsetX,
                y: offsetY,
                r: radius,
                adjR: this._get([adjRadius, radius]),
                itemWidth: offsets.itemWidth,
                rangeLength: offsets.rangeLength,
                valuesOnTicks: valuesOnTicks,
                startAngle: startAngle,
                endAngle: endAngle,
                isClosedCircle: isClosedCircle,
                axisSize: axisSize
            };
        },

        /** @private */
        _toPolarCoord: function (polarAxisCoords, rect, x, y) {
            var axisSizeRatio = Math.abs(polarAxisCoords.startAngle - polarAxisCoords.endAngle) / (Math.PI * 2);

            var angle = (x - rect.x) * 2 * Math.PI * axisSizeRatio / Math.max(1, rect.width) + polarAxisCoords.startAngle;

            var radius = ((rect.height + rect.y) - y) * polarAxisCoords.r / Math.max(1, rect.height);

            var px = polarAxisCoords.x + radius * Math.cos(angle);
            var py = polarAxisCoords.y + radius * Math.sin(angle);

            return { x: $.jqx._ptrnd(px), y: $.jqx._ptrnd(py) };
        },

        /** @private */
        _renderSpiderAxis: function (groupIndex, rect) {
            var self = this;
            var axis = self._getXAxis(groupIndex);
            var axisSettings = this._getAxisSettings(axis);

            if (!axis || !axisSettings.visible)
                return;

            var group = self.seriesGroups[groupIndex];

            var polarCoords = self._getPolarAxisCoords(groupIndex, rect);
            if (!polarCoords)
                return;

            var offsetX = $.jqx._ptrnd(polarCoords.x);
            var offsetY = $.jqx._ptrnd(polarCoords.y);
            var radius = polarCoords.adjR;
            var startAngle = polarCoords.startAngle;
            var endAngle = polarCoords.endAngle;

            if (radius < 1)
                return;

            var axisSizeRatio = $.jqx._rnd(Math.abs(startAngle - endAngle) / (Math.PI * 2), 0.001, true);

            var axisSize = Math.PI * 2 * radius * axisSizeRatio;

            var isClosedCircle = polarCoords.isClosedCircle;

            var offsets = this._renderData[groupIndex].xoffsets;
            if (!offsets.rangeLength)
                return;

            var ui = offsets.axisStats.interval;
            if (isNaN(ui) || ui < 1)
                ui = 1;

            var swapXY = group.orientation == 'horizontal';

            var isMirror = (swapXY && axis.position == 'right') || (!swapXY && axis.position == 'top');

            while (self._renderData.length < groupIndex + 1)
                self._renderData.push({});

            var renderData = {
                rangeLength: offsets.rangeLength,
                itemWidth: offsets.itemWidth,
                data: offsets,
                rect: rect,
                settings: axisSettings
            };

            self._renderData[groupIndex].xAxis = renderData;
            self._renderData[groupIndex].polarCoords = polarCoords;

            // dedup identical axis drawing
            var showXAxis = true;
            for (var i = 0; i < groupIndex; i++) {
                var renderDataCompare = self._renderData[i].xAxis;
                var polarCoordscompare = self._renderData[i].polarCoords;
                var xAxisCompare = self._getXAxis(i);

                var nomatch = false;
                for (var j in polarCoords)
                    if (polarCoords[j] != polarCoordscompare[j]) {
                        nomatch = true;
                        break;
                    }

                if (!nomatch || xAxisCompare != axis)
                    showXAxis = false;
            }

            var gridLinesSettings = axisSettings.gridLines;
            var tickMarksSettings = axisSettings.tickMarks;
            var labelsSettings = axisSettings.labels;

            var gridLinesInterval = this._getInterval(gridLinesSettings, ui);
            var tickMarksInterval = this._getInterval(tickMarksSettings, ui);
            var labelsInterval = this._getInterval(labelsSettings, ui);

            var valuesOnTicks = self._alignValuesWithTicks(groupIndex);

            var renderer = self.renderer;

            var labelOffsets;

            var axisStats = offsets.axisStats;

            var min = axisStats.min;
            var max = axisStats.max;

            var padding = this._getPaddingSize(offsets.axisStats, axis, valuesOnTicks, axisSize, true, isClosedCircle, false);

            var flip = axis.flip == true || self.rtl;

            if (axis.type == 'date') {
                gridLinesSettings.offsets = this._generateDTOffsets(min, max, axisSize, padding, gridLinesInterval, ui, axis.baseUnit, true, 0, false, flip);
                tickMarksSettings.offsets = this._generateDTOffsets(min, max, axisSize, padding, tickMarksInterval, ui, axis.baseUnit, true, 0, false, flip);
                labelOffsets = this._generateDTOffsets(min, max, axisSize, padding, labelsInterval, ui, axis.baseUnit, true, 0, true, flip);
            }
            else {
                axisSettings.gridLines.offsets = this._getOffsets('gridLines', axis, axisSize, axisStats, axisSettings, padding, true, ui);
                axisSettings.tickMarks.offsets = this._getOffsets('tickMarks', axis, axisSize, axisStats, axisSettings, padding, true, ui);
                labelOffsets = this._getOffsets('labels', axis, axisSize, axisStats, axisSettings, padding, true, ui);

            }

            var widgetRect = self.renderer.getRect();
            var paddingRight = widgetRect.width - rect.x - rect.width;
            var len = self._getDataLen(groupIndex);

            var oldPositions;
            if (self._elementRenderInfo && self._elementRenderInfo.length > groupIndex)
                oldPositions = self._elementRenderInfo[groupIndex].xAxis;

            var items = [];

            var dataLen = this._getDataLen(groupIndex);

            for (var i = 0; i < labelOffsets.length; i++) {
                var x = labelOffsets[i].offset;
                var value = labelOffsets[i].value;

                if (axis.type != 'date' && axisStats.useIndeces && axis.dataField) {
                    var idx = Math.round(value);
                    if (idx >= dataLen)
                        continue;

                    value = self._getDataValue(idx, axis.dataField);
                    if (value == undefined)
                        value = '';
                }
                var text = self._formatValue(value, labelsSettings.formatSettings, labelsSettings.formatFunction, groupIndex, undefined, idx);
                if (text == undefined || text.toString() == '')
                    text = axisStats.useIndeces ? (axisStats.min + i).toString() : (value == undefined ? '' : value.toString());

                var obj = { key: value, text: text, targetX: x, x: x };
                if (oldPositions && oldPositions.itemOffsets[value]) {
                    obj.x = oldPositions.itemOffsets[value].x;
                    obj.y = oldPositions.itemOffsets[value].y;
                }

                items.push(obj);
            }

            var itemsInfo = { items: items, renderData: renderData };

            // draw the spider
            var strokeAttributes = { stroke: gridLinesSettings.color, fill: 'none', 'stroke-width': gridLinesSettings.width, 'stroke-dasharray': gridLinesSettings.dashStyle || '' };

            if (!group.spider) {
                if (axisSizeRatio == 1)
                    renderer.circle(offsetX, offsetY, radius, strokeAttributes);
                else {
                    var aStart = -startAngle / Math.PI * 180;
                    var aEnd = -endAngle / Math.PI * 180;

                    this.renderer.pieslice(
                                            offsetX,
                                            offsetY,
                                            0, // innerRadius
                                            radius,
                                            Math.min(aStart, aEnd),
                                            Math.max(aStart, aEnd),
                                            undefined,
                                            strokeAttributes);
                }
            }

            var cnt = items.length;
            var aIncrement = 2 * Math.PI / (cnt);
            var aIncrementAdj = startAngle;

            // draw x-axis grid lines
            var ptPrev, ptPrevFirst;
            if (gridLinesSettings.visible && showXAxis) {
                if (!valuesOnTicks && !isClosedCircle) {
                    gridLinesSettings.offsets.unshift({ offset: -padding.right });
                }

                for (var i = 0; i < gridLinesSettings.offsets.length; i++) {
                    var offset = gridLinesSettings.offsets[i].offset;
                    if (!valuesOnTicks) {
                        if (isClosedCircle)
                            offset += padding.right / 2;
                        else
                            offset += padding.right;
                    }

                    var angle = aIncrementAdj + offset * 2 * Math.PI * axisSizeRatio / Math.max(1, axisSize);
                    if (angle - endAngle > 0.01)
                        continue;

                    var px = $.jqx._ptrnd(offsetX + radius * Math.cos(angle));
                    var py = $.jqx._ptrnd(offsetY + radius * Math.sin(angle));

                    renderer.line(offsetX, offsetY, px, py, strokeAttributes);
                }
            }

            // draw tick marks
            if (tickMarksSettings.visible && showXAxis) {
                var tickMarkSize = 5;

                var ticksStrokeAttributes = { stroke: tickMarksSettings.color, fill: 'none', 'stroke-width': tickMarksSettings.width, 'stroke-dasharray': tickMarksSettings.dashStyle || '' };
                if (!valuesOnTicks && !isClosedCircle) {
                    tickMarksSettings.offsets.unshift({ offset: -padding.right });
                }

                for (var i = 0; i < tickMarksSettings.offsets.length; i++) {
                    var offset = tickMarksSettings.offsets[i].offset;
                    if (!valuesOnTicks) {
                        if (isClosedCircle)
                            offset += padding.right / 2;
                        else
                            offset += padding.right;
                    }

                    var angle = aIncrementAdj + offset * 2 * Math.PI * axisSizeRatio / Math.max(1, axisSize);
                    if (angle - endAngle > 0.01)
                        continue;

                    var p1 = { x: offsetX + radius * Math.cos(angle), y: offsetY + radius * Math.sin(angle) };
                    var p2 = { x: offsetX + (radius + tickMarkSize) * Math.cos(angle), y: offsetY + (radius + tickMarkSize) * Math.sin(angle) };
                    renderer.line($.jqx._ptrnd(p1.x), $.jqx._ptrnd(p1.y), $.jqx._ptrnd(p2.x), $.jqx._ptrnd(p2.y), ticksStrokeAttributes);
                }
            }

            var offsetAngles = [];

            // get spider angles
            if (group.spider) {
                var spiderOffsets = [];
                if (axis.type == 'date')
                    spiderOffsets = this._generateDTOffsets(min, max, axisSize, padding, ui, ui, axis.baseUnit, true, 0, false, flip);
                else {
                    spiderOffsets = this._getOffsets('', axis, axisSize, axisStats, axisSettings, padding, true, ui);
                }

                if (!valuesOnTicks && !isClosedCircle)
                    spiderOffsets.unshift({ offset: -padding.right });

                for (var i = 0; i < spiderOffsets.length; i++) {
                    var offset = spiderOffsets[i].offset;
                    if (!valuesOnTicks) {
                        if (isClosedCircle)
                            offset += padding.right / 2;
                        else
                            offset += padding.right;
                    }

                    var angle = aIncrementAdj + offset * 2 * Math.PI * axisSizeRatio / Math.max(1, axisSize);
                    if (angle - endAngle > 0.01)
                        continue;

                    offsetAngles.push(angle);
                }

                renderData.offsetAngles = offsetAngles;
            }

            // draw value axis
            var arrRadius = self._renderSpiderValueAxis(groupIndex, rect, (valuesOnTicks ? polarCoords.adjR : polarCoords.r), offsetAngles);
            if (!arrRadius)
                arrRadius = [];

            // draw the spider lines
            if (group.spider) {
                if (!valuesOnTicks) {
                    for (var i = 0; i < arrRadius.length; i++)
                        arrRadius[i] = arrRadius[i] * polarCoords.adjR / polarCoords.r;
                }
                arrRadius.push(radius);

                this._renderSpiderLines(offsetX, offsetY, arrRadius, polarCoords, offsetAngles, strokeAttributes);
            }

            // draw text items
            if (showXAxis && labelsSettings.visible) {
                renderData.polarLabels = [];

                for (var i = 0; i < items.length; i++) {
                    var offset = items[i].x;
                    var angle = aIncrementAdj + offset * 2 * Math.PI * axisSizeRatio / Math.max(1, axisSize);

                    angle = (360 - angle / (2 * Math.PI) * 360) % 360;
                    if (angle < 0)
                        angle = 360 + angle;

                    var sz = renderer.measureText(items[i].text, 0, { 'class': axisSettings.labels.style });

                    var labelsRadius = (valuesOnTicks ? polarCoords.adjR : polarCoords.r) + (tickMarksSettings.visible ? 7 : 2);

                    var labels = axisSettings.labels;
                    var labelOffset;

                    if (labels.autoRotate) {
                        var pt1 = $.jqx._ptRotate(offsetX - sz.width / 2, offsetY - labelsRadius - sz.height, offsetX, offsetY, -angle / 180 * Math.PI);
                        var pt2 = $.jqx._ptRotate(offsetX + sz.width / 2, offsetY - labelsRadius, offsetX, offsetY, -angle / 180 * Math.PI);

                        sz.width = Math.abs(pt1.x - pt2.x);
                        sz.height = Math.abs(pt1.y - pt2.y);

                        labelOffset = { x: Math.min(pt1.x, pt2.x), y: Math.min(pt1.y, pt2.y) };
                    }
                    else {
                        labelOffset = this._adjustTextBoxPosition(
                            offsetX,
                            offsetY,
                            sz,
                            labelsRadius,
                            angle,
                            false,
                            false,
                            false
                            );
                    }

                    renderData.polarLabels.push({ x: labelOffset.x, y: labelOffset.y, value: items[i].text });

                    renderer.text(
                        items[i].text,
                        labelOffset.x,
                        labelOffset.y,
                        sz.width,
                        sz.height,
                        labels.autoRotate ? 90 - angle : labels.angle,
                        { 'class': labels.style },
                        false,
                        labels.halign,
                        labels.valign);
                }
            }
        },

        _renderSpiderLines: function (x, y, arrRadius, polarCoords, offsetAngles, strokeAttributes) {
            var renderer = this.renderer;

            var startAngle = polarCoords.startAngle;
            var endAngle = polarCoords.endAngle;
            var isClosedCircle = polarCoords.isClosedCircle;

            for (var j = 0; j < arrRadius.length; j++) {
                var radius = arrRadius[j];

                var ptPrev = undefined, ptFirst = undefined;
                for (var i = 0; i < offsetAngles.length; i++) {
                    var angle = offsetAngles[i];

                    var px = $.jqx._ptrnd(x + radius * Math.cos(angle));
                    var py = $.jqx._ptrnd(y + radius * Math.sin(angle));

                    if (ptPrev)
                        renderer.line(ptPrev.x, ptPrev.y, px, py, strokeAttributes);

                    ptPrev = { x: px, y: py };
                    if (!ptFirst)
                        ptFirst = { x: px, y: py };
                }

                if (ptFirst && isClosedCircle)
                    renderer.line(ptPrev.x, ptPrev.y, ptFirst.x, ptFirst.y, strokeAttributes);
            }
        },

        /** @private */
        _renderSpiderValueAxis: function (groupIndex, rect, radius, offsetAngles) {
            var self = this;
            var group = this.seriesGroups[groupIndex];

            var polarCoords = this._getPolarAxisCoords(groupIndex, rect);
            if (!polarCoords)
                return;

            var offsetX = $.jqx._ptrnd(polarCoords.x);
            var offsetY = $.jqx._ptrnd(polarCoords.y);
            radius = radius || polarCoords.r;
            var startAngle = polarCoords.startAngle;
            var endAngle = polarCoords.endAngle;

            var axisSizeRatio = $.jqx._rnd(Math.abs(startAngle - endAngle) / (Math.PI * 2), 0.001, true);

            if (radius < 1)
                return;

            radius = $.jqx._ptrnd(radius);

            var valueAxis = this._getValueAxis(groupIndex);
            settings = this._getAxisSettings(valueAxis);

            if (!valueAxis || false == settings.visible)
                return;

            var ui = this._stats.seriesGroups[groupIndex].mu;

            var labelsSettings = settings.labels;

            var valueAxisformatSettings = labelsSettings.formatSettings;
            var isStacked100 = group.type.indexOf("stacked") != -1 && group.type.indexOf("100") != -1;
            if (isStacked100 && !valueAxisformatSettings)
                valueAxisformatSettings = { sufix: '%' };

            var labelsFrequency = this._get([labelsSettings.step, labelsSettings.unitInterval / ui]);
            if (isNaN(labelsFrequency))
                labelsFrequency = 1;

            labelsFrequency = Math.max(1, Math.round(labelsFrequency));

            this._calcValueAxisItems(groupIndex, radius, labelsFrequency);

            var gridLines = settings.gridLines;
            var tickMarks = settings.tickMarks;

            var gridLinesInterval = this._getInterval(gridLines, ui);
            var tickMarksInterval = this._getInterval(tickMarks, ui);

            var labels = settings.labels;

            var strokeAttributes = { stroke: gridLines.color, fill: 'none', 'stroke-width': 1, 'stroke-dasharray': gridLines.dashStyle || '' };

            // draw value axis text
            var axisRenderData = this._renderData[groupIndex].valueAxis;
            var items = axisRenderData.items;
            var angle = startAngle;
            if (items.length && settings.line.visible) {
                if (!isNaN(settings.line.angle)) {
                    angle = 2 * Math.PI * settings.line.angle / 360;
                }

                var x2 = offsetX + Math.cos(angle) * radius;
                var y2 = offsetY + Math.sin(angle) * radius;

                if (offsetAngles.indexOf(angle) == -1) {
                    var lineAttributes = $.extend({}, strokeAttributes);
                    lineAttributes['stroke-width'] = settings.line.lineWidth;
                    lineAttributes['stroke'] = settings.line.color;
                    lineAttributes['stroke-dasharray'] = settings.line.dashStyle;
                    this.renderer.line(offsetX, offsetY, x2, y2, lineAttributes);
                }
            }

            items = items.reverse();

            var renderer = this.renderer;

            axisRenderData.polarLabels = [];

            for (var i = 0; i < items.length - 1; i++) {
                var value = items[i];
                if (isNaN(value))
                    continue;

                var text = (labels.formatFunction) ? labels.formatFunction(value) : this._formatNumber(value, valueAxisformatSettings);

                var sz = renderer.measureText(text, 0, { 'class': labels.style });

                var x = offsetX + (valueAxis.showTickMarks != false ? 3 : 2);
                var y = offsetY - axisRenderData.itemWidth * i - sz.height / 2;

                {
                    var pt1 = $.jqx._ptRotate(x, y, offsetX, offsetY, angle);
                    var pt2 = $.jqx._ptRotate(x + sz.width, y + sz.height, offsetX, offsetY, angle);

                    x = Math.min(pt1.x, pt2.x);
                    y = Math.min(pt1.y, pt2.y);

                    sz.width = Math.abs(pt1.x - pt2.x);
                    sz.height = Math.abs(pt1.y - pt2.y);
                }

                x += settings.labels.textOffset.x;
                y += settings.labels.textOffset.y;

                axisRenderData.polarLabels.push({ x: x, y: y, value: text });

                renderer.text(
                    text,
                    x,
                    y,
                    sz.width,
                    sz.height,
                    labels.autoRotate ? (90 + startAngle * 180 / Math.PI) : labels.angle,
                    { 'class': labels.style },
                    false,
                    labels.halign,
                    labels.valign
                //'top','left'
                    );
            }

            var isLogAxis = valueAxis.logarithmicScale == true;

            var len = isLogAxis ? items.length : axisRenderData.rangeLength;
            aIncrement = 2 * Math.PI / len;

            /////////////////
            var valuesOnTicks = valueAxis.valuesOnTicks != false;
            var gstat = this._stats.seriesGroups[groupIndex];
            var mu = gstat.mu;

            var logAxis = valueAxis.logarithmicScale == true;
            var logBase = valueAxis.logarithmicScaleBase || 10;
            if (logAxis)
                mu = 1;

            var axisStats = { min: gstat.min, max: gstat.max, logAxis: { enabled: logAxis == true, base: valueAxis.logarithmicScaleBase, minPow: gstat.minPow, maxPow: gstat.maxPow} };

            // draw value axis grid lines
            if (gridLines.visible || group.spider || valueAxis.alternatingBackgroundColor || valueAxis.alternatingBackgroundColor2) {
                gridLines.offsets = this._getOffsets('gridLines', valueAxis, radius, axisStats, settings, { left: 0, right: 0 }, valuesOnTicks, mu);
            }

            var arrRadius = [];
            if (gridLines.visible || group.spider) {
                var strokeAttributes = { stroke: gridLines.color, fill: 'none', 'stroke-width': 1, 'stroke-dasharray': gridLines.dashStyle || '' };
                for (var i = 0; i < gridLines.offsets.length; i++) {
                    var y = $.jqx._ptrnd(gridLines.offsets[i].offset);
                    if (y == radius)
                        continue;

                    if (group.spider) {
                        arrRadius.push(y);
                        continue;
                    }

                    if (axisSizeRatio != 1) {
                        var aStart = -startAngle / Math.PI * 180;
                        var aEnd = -endAngle / Math.PI * 180;

                        this.renderer.pieslice(
                                                offsetX,
                                                offsetY,
                                                0, // innerRadius
                                                y,
                                                Math.min(aStart, aEnd),
                                                Math.max(aStart, aEnd),
                                                undefined,
                                                strokeAttributes);
                    }
                    else {
                        renderer.circle(offsetX, offsetY, y, strokeAttributes);
                    }
                }
            }

            if (!valueAxis.tickMarks || (!valueAxis.tickMarks.visible && !valueAxis.showTickMarks))
                tickMarks.visible = false;

            // draw value axis tick marks
            if (tickMarks.visible) {
                tickMarks.offsets = this._getOffsets('tickMarks', valueAxis, radius, axisStats, settings, { left: 0, right: 0 }, valuesOnTicks, mu);

                tickMarkSize = tickMarks.size * 2;
                var strokeAttributes = { stroke: tickMarks.color, fill: 'none', 'stroke-width': 1, 'stroke-dasharray': tickMarks.dashStyle || '' };

                for (var i = 0; i < tickMarks.offsets.length; i++) {
                    var tickMarkRadius = tickMarks.offsets[i].offset;

                    var pt1 = {
                        x: offsetX + tickMarkRadius * Math.cos(angle) - tickMarkSize / 2 * Math.sin(angle + Math.PI / 2),
                        y: offsetY + tickMarkRadius * Math.sin(angle) - tickMarkSize / 2 * Math.cos(angle + Math.PI / 2)
                    };
                    var pt2 = {
                        x: offsetX + tickMarkRadius * Math.cos(angle) + tickMarkSize / 2 * Math.sin(angle + Math.PI / 2),
                        y: offsetY + tickMarkRadius * Math.sin(angle) + tickMarkSize / 2 * Math.cos(angle + Math.PI / 2)
                    };

                    renderer.line($.jqx._ptrnd(pt1.x), $.jqx._ptrnd(pt1.y), $.jqx._ptrnd(pt2.x), $.jqx._ptrnd(pt2.y), strokeAttributes);
                }
            }

            return arrRadius;
        },

        /** @private */
        _renderAxis: function (isVertical, isMirror, axisSettings, rect, chartRect, ui, isLogAxis, valuesOnTicks, itemsInfo, isMeasure, animationDuration) {
            if (axisSettings.customDraw && !isMeasure)
                return { width: NaN, height: NaN };

            var titleSettings = axisSettings.title,
                textSettings = axisSettings.labels,
                gridLinesSettings = axisSettings.gridLines,
                tickMarksSettings = axisSettings.tickMarks,
                axisPadding = axisSettings.padding;

            var tickMarkSize = tickMarksSettings.visible ? tickMarksSettings.size : 0;
            var padding = 2;

            var szMeasure = { width: 0, height: 0 };
            var szMeasureDesc = { width: 0, height: 0 };

            if (isVertical)
                szMeasure.height = szMeasureDesc.height = rect.height;
            else
                szMeasure.width = szMeasureDesc.width = rect.width;

            if (!isMeasure && isMirror) {
                if (isVertical)
                    rect.x -= rect.width;
            }

            var renderData = itemsInfo.renderData;

            var itemWidth = renderData.itemWidth;

            if (titleSettings.visible && titleSettings.text != undefined && titleSettings != '') {
                var angle = titleSettings.angle;
                var sz = this.renderer.measureText(titleSettings.text, angle, { 'class': titleSettings.style });
                szMeasureDesc.width = sz.width;
                szMeasureDesc.height = sz.height;

                if (!isMeasure) {
                    this.renderer.text(
                        titleSettings.text,
                        rect.x + titleSettings.offset.x + (isVertical ? (!isMirror ? padding + axisPadding.left : -axisPadding.right - padding + 2 * rect.width - szMeasureDesc.width) : 0),
                        rect.y + titleSettings.offset.y + (!isVertical ? (!isMirror ? rect.height - padding - szMeasureDesc.height - axisPadding.bottom : axisPadding.top + padding) : 0),
                        isVertical ? szMeasureDesc.width : rect.width,
                        !isVertical ? szMeasureDesc.height : rect.height,
                        angle,
                        { 'class': titleSettings.style },
                        true,
                        titleSettings.halign,
                        titleSettings.valign,
                        titleSettings.rotationPoint);
                }
            }

            var offset = 0;
            var textXAdjust = valuesOnTicks ? -itemWidth / 2 : 0;

            if (valuesOnTicks && !isVertical) {
                textSettings.halign = 'center';
            }

            var baseX = rect.x;
            var baseY = rect.y;

            var userOffset = textSettings.textOffset;
            if (userOffset) {
                if (!isNaN(userOffset.x))
                    baseX += userOffset.x;
                if (!isNaN(userOffset.y))
                    baseY += userOffset.y;
            }

            if (!isVertical) {
                baseX += textXAdjust;

                if (isMirror) {
                    baseY += szMeasureDesc.height > 0 ? szMeasureDesc.height + 3 * padding : 2 * padding;
                    baseY += tickMarkSize - (valuesOnTicks ? tickMarkSize : tickMarkSize / 4);
                }
                else {
                    baseY += valuesOnTicks ? tickMarkSize : tickMarkSize / 4;
                }

                baseY += axisPadding.top;
            }
            else {
                baseX += axisPadding.left + padding + (szMeasureDesc.width > 0 ? szMeasureDesc.width + padding : 0) + (isMirror ? rect.width - szMeasureDesc.width : 0);
                baseY += textXAdjust;
            }

            var h = 0;
            var w = 0;

            var items = itemsInfo.items;

            renderData.itemOffsets = {};

            if (this._isToggleRefresh || !this._isUpdate)
                animationDuration = 0;

            var canAnimate = false;

            var widthSum = 0;

            for (var i = 0; i < items.length && textSettings.visible; i++, offset += itemWidth) {
                if (!items[i] || isNaN(itemWidth))
                    continue;

                var text = items[i].text;
                if (!isNaN(items[i].targetX))
                    offset = items[i].targetX;

                var sz = this.renderer.measureText(text, textSettings.angle, { 'class': textSettings.style });
                if (sz.width > w)
                    w = sz.width;
                if (sz.height > h)
                    h = sz.height;

                widthSum += isVertical ? h : w;

                if (!isMeasure) {
                    if ((isVertical && offset > rect.height + 2) || (!isVertical && offset > rect.width + 2))
                        continue;

                    var x = isVertical ? baseX + (isMirror ? (szMeasureDesc.width == 0 ? tickMarkSize : tickMarkSize - padding) : 0) : baseX + offset;
                    var y = isVertical ? baseY + offset : baseY;

                    renderData.itemOffsets[items[i].key] = { x: x, y: y };

                    if (!canAnimate)
                        if (!isNaN(items[i].x) || !isNaN(items[i].y) && animationDuration)
                            canAnimate = true;

                    items[i].targetX = x;
                    items[i].targetY = y;
                    items[i].width = !isVertical ? itemWidth : rect.width - axisPadding.left - axisPadding.right - 2 * padding - tickMarkSize - ((szMeasureDesc.width > 0) ? szMeasureDesc.width + padding : 0);
                    items[i].height = isVertical ? itemWidth : rect.height - axisPadding.top - axisPadding.bottom - 2 * padding - tickMarkSize - ((szMeasureDesc.height > 0) ? szMeasureDesc.height + padding : 0);
                    items[i].visible = true;
                }
            }

            renderData.avgWidth = items.length == 0 ? 0 : widthSum / items.length;

            if (!isMeasure) {
                var ctx = { items: items, textSettings: textSettings };
                if (isNaN(animationDuration) || !canAnimate)
                    animationDuration = 0;

                this._animateAxisText(ctx, animationDuration == 0 ? 1 : 0);

                if (animationDuration != 0) {
                    var self = this;
                    this._enqueueAnimation(
                        "series",
                        undefined,
                        undefined,
                        animationDuration,
                        function (element, ctx, percent) {
                            self._animateAxisText(ctx, percent);
                        },
                        ctx);
                }
            }

            szMeasure.width += 2 * padding + tickMarkSize + szMeasureDesc.width + w + (isVertical && szMeasureDesc.width > 0 ? padding : 0);
            szMeasure.height += 2 * padding + tickMarkSize + szMeasureDesc.height + h + (!isVertical && szMeasureDesc.height > 0 ? padding : 0);

            if (!isVertical)
                szMeasure.height += axisPadding.top + axisPadding.bottom;
            else
                szMeasure.width += axisPadding.left + axisPadding.right;

            var gridLinePts = {};

            if (!isMeasure && axisSettings.line.visible) {
                var lineAttributes = { stroke: axisSettings.line.color, 'stroke-width': axisSettings.line.width, 'stroke-dasharray': axisSettings.line.dashStyle || '' };

                if (isVertical) {
                    var x = rect.x + rect.width + (isMirror ? axisPadding.left : -axisPadding.right);
                    x = $.jqx._ptrnd(x);
                    this.renderer.line(x, rect.y, x, rect.y + rect.height, lineAttributes);
                }
                else {
                    var y = $.jqx._ptrnd(rect.y + (isMirror ? rect.height - axisPadding.bottom : axisPadding.top));

                    this.renderer.line($.jqx._ptrnd(rect.x), y, $.jqx._ptrnd(rect.x + rect.width + 1), y, lineAttributes);
                }
            }

            szMeasure.width = $.jqx._rup(szMeasure.width);
            szMeasure.height = $.jqx._rup(szMeasure.height);

            return szMeasure;
        },

        _drawPlotAreaLines: function (groupIndex, isValueAxis, itemsToDraw) {
            var g = this.seriesGroups[groupIndex];
            var swapXY = g.orientation != 'horizontal';

            if (!this._renderData || this._renderData.length <= groupIndex)
                return;

            var key = isValueAxis ? 'valueAxis' : 'xAxis';

            var renderData = this._renderData[groupIndex][key];
            if (!renderData)
                return;

            var state = this._renderData.axisDrawState;
            if (!state)
                state = this._renderData.axisDrawState = {};

            var axisKey = '', axis;

            if (isValueAxis) {
                axisKey = 'valueAxis_' + ((g.valueAxis) ? groupIndex : '') + (swapXY ? 'swap' : '');
                axis = this._getValueAxis(groupIndex);
            }
            else {
                axisKey = 'xAxis_' + ((g.xAxis || g.categoryAxis) ? groupIndex : '') + (swapXY ? 'swap' : '');
                axis = this._getXAxis(groupIndex);
            }

            if (state[axisKey])
                state = state[axisKey];
            else
                state = state[axisKey] = {};

            if (!isValueAxis)
                swapXY = !swapXY;

            var settings = renderData.settings;
            if (!settings)
                return;

            if (settings.customDraw)
                return;

            var gridLinesSettings = settings.gridLines,
                tickMarksSettings = settings.tickMarks,
                padding = settings.padding;

            var rect = renderData.rect;
            var chartRect = this._plotRect;

            if (!gridLinesSettings || !tickMarksSettings)
                return;

            var rndErr = 0.5
            var gridLinePts = {};
            var strokeAttributes = { stroke: gridLinesSettings.color, 'stroke-width': gridLinesSettings.width, 'stroke-dasharray': gridLinesSettings.dashStyle || '' };

            // render grid lines & alternate background colors        
            var startOffset = isValueAxis ? rect.y + rect.height : rect.x;
            var offsets = gridLinesSettings.offsets;

            if (isValueAxis && !axis.flip) {
                offsets = $.extend([], offsets);
                offsets = offsets.reverse();
            }

            if (offsets && offsets.length > 0) {
                var prevOffset = NaN;
                var lenSave = offsets.length;
                for (var i = 0; i < offsets.length; i++) {
                    if (swapXY) {
                        lineOffset = $.jqx._ptrnd(rect.y + offsets[i].offset);
                        if (lineOffset < rect.y - rndErr)
                            lineOffset = $.jqx._ptrnd(rect.y);

                        if (lineOffset > rect.y + rect.height)
                            lineOffset = rect.y + rect.height;
                    }
                    else {
                        lineOffset = $.jqx._ptrnd(rect.x + offsets[i].offset);
                        if (lineOffset > rect.x + rect.width + rndErr)
                            lineOffset = $.jqx._ptrnd(rect.x + rect.width);
                    }

                    if (isNaN(lineOffset))
                        continue;

                    if (!isNaN(prevOffset) && Math.abs(lineOffset - prevOffset) < 2)
                        continue;

                    prevOffset = lineOffset;

                    if (itemsToDraw.gridLines && gridLinesSettings.visible != false && state.gridLines != true) {
                        if (swapXY)
                            this.renderer.line($.jqx._ptrnd(chartRect.x), lineOffset, $.jqx._ptrnd(chartRect.x + chartRect.width), lineOffset, strokeAttributes);
                        else
                            this.renderer.line(lineOffset, $.jqx._ptrnd(chartRect.y), lineOffset, $.jqx._ptrnd(chartRect.y + chartRect.height), strokeAttributes);
                    }

                    gridLinePts[lineOffset] = true;

                    if (itemsToDraw.alternatingBackground && (gridLinesSettings.alternatingBackgroundColor || gridLinesSettings.alternatingBackgroundColor2) && state.alternatingBackground != true) {
                        var fillColor = ((i % 2) == 0) ? gridLinesSettings.alternatingBackgroundColor2 : gridLinesSettings.alternatingBackgroundColor;
                        if (i > 0 && fillColor) {
                            var rectElement;
                            if (swapXY)
                                rectElement = this.renderer.rect($.jqx._ptrnd(chartRect.x), startOffset, $.jqx._ptrnd(chartRect.width - 1), lineOffset - startOffset, strokeAttributes);
                            else
                                rectElement = this.renderer.rect(startOffset, $.jqx._ptrnd(chartRect.y), lineOffset - startOffset, $.jqx._ptrnd(chartRect.height), strokeAttributes);

                            this.renderer.attr(rectElement, { 'stroke-width': 0, fill: fillColor, opacity: gridLinesSettings.alternatingBackgroundOpacity || 1 });
                        }
                    }

                    startOffset = lineOffset;
                } // for
            }

            // render axis tick marks
            var strokeAttributes = { stroke: tickMarksSettings.color, 'stroke-width': tickMarksSettings.width, 'stroke-dasharray': tickMarksSettings.dashStyle || '' };

            if (itemsToDraw.tickMarks && tickMarksSettings.visible && state.tickMarks != true) {
                var tickMarkSize = tickMarksSettings.size;
                var offsets = tickMarksSettings.offsets;
                var prevOffset = NaN;
                for (var i = 0; i < offsets.length; i++) {
                    if (swapXY) {
                        lineOffset = $.jqx._ptrnd(rect.y + offsets[i].offset);
                        if (lineOffset < rect.y - rndErr)
                            lineOffset = $.jqx._ptrnd(rect.y);

                        if (lineOffset > rect.y + rect.height)
                            lineOffset = rect.y + rect.height;
                    }
                    else {
                        lineOffset = $.jqx._ptrnd(rect.x + offsets[i].offset);
                        if (lineOffset > rect.x + rect.width + rndErr)
                            lineOffset = $.jqx._ptrnd(rect.x + rect.width);
                    }

                    if (isNaN(lineOffset))
                        continue;

                    if (!isNaN(prevOffset) && Math.abs(lineOffset - prevOffset) < 2)
                        continue;

                    if (gridLinePts[lineOffset - 1])
                        lineOffset--;
                    else if (gridLinePts[lineOffset + 1])
                        lineOffset++;

                    if (swapXY) {
                        if (lineOffset > rect.y + rect.height + rndErr)
                            break;
                    }
                    else {
                        if (lineOffset > rect.x + rect.width + rndErr)
                            break;
                    }

                    prevOffset = lineOffset;

                    var tickSize = !renderData.isMirror ? -tickMarkSize : tickMarkSize;
                    if (swapXY) {
                        var x = rect.x + rect.width + (axis.position == 'right' ? padding.left : -padding.right);
                        if (!isValueAxis)
                            x = rect.x + (renderData.isMirror ? padding.left : -padding.right + rect.width);

                        this.renderer.line(x, lineOffset, x + tickSize, lineOffset, strokeAttributes);
                    }
                    else {
                        var y = rect.y + (renderData.isMirror ? rect.height : 0);
                        y += renderData.isMirror ? -padding.bottom : padding.top;

                        y = $.jqx._ptrnd(y);
                        this.renderer.line(lineOffset, y, lineOffset, y - tickSize, strokeAttributes);
                    }
                }
            }

            state.tickMarks = state.tickMarks || itemsToDraw.tickMarks;
            state.gridLines = state.gridLines || itemsToDraw.gridLines;
            state.alternatingBackground = state.alternatingBackground || itemsToDraw.alternatingBackground;
        },

        /** @private */
        _calcValueAxisItems: function (groupIndex, axisLength, labelsFrequency) {
            var gstat = this._stats.seriesGroups[groupIndex];
            if (!gstat || !gstat.isValid) {
                return false;
            }

            var g = this.seriesGroups[groupIndex];
            var swapXY = g.orientation == 'horizontal';
            var axis = this._getValueAxis(groupIndex);

            var valuesOnTicks = axis.valuesOnTicks != false;
            var field = axis.dataField;
            var ints = gstat.intervals;
            var unitH = axisLength / ints;

            var min = gstat.min;
            var mu = gstat.mu;

            var logAxis = axis.logarithmicScale == true;
            var logBase = axis.logarithmicScaleBase || 10;
            var isStacked100 = g.type.indexOf("stacked") != -1 && g.type.indexOf("100") != -1;

            if (logAxis)
                mu = !isNaN(axis.unitInterval) ? axis.unitInterval : 1;

            if (!valuesOnTicks)
                ints = Math.max(ints - 1, 1);

            while (this._renderData.length < groupIndex + 1)
                this._renderData.push({});

            this._renderData[groupIndex].valueAxis = {};
            var renderData = this._renderData[groupIndex].valueAxis;

            renderData.itemWidth = renderData.intervalWidth = unitH;
            renderData.items = [];
            var items = renderData.items;

            for (var i = 0; i <= ints; i++) {
                var value = 0;
                if (logAxis) {
                    if (isStacked100)
                        value = gstat.max / Math.pow(logBase, ints - i);
                    else
                        value = min * Math.pow(logBase, i);
                }
                else {
                    value = valuesOnTicks ? min + i * mu : min + (i + 0.5) * mu;
                }

                if (i % labelsFrequency != 0) {
                    items.push(NaN);
                    continue;
                }

                items.push(value);
            }

            renderData.rangeLength = logAxis && !isStacked100 ? gstat.intervals : (gstat.intervals) * mu;

            if (axis.flip != true)
                items = items.reverse();

            return true;
        },

        _getDecimalPlaces: function (arr, key, limit) {
            var decimalPlaces = 0;
            if (isNaN(limit))
                limit = 10;

            for (var i = 0; i < arr.length; i++) {
                var value = key === undefined ? arr[i] : arr[i][key];
                if (isNaN(value))
                    continue;

                var valueTxt = value.toString();
                for (var j = 0; j < valueTxt.length; j++) {
                    if (valueTxt[j] < '0' || valueTxt[j] > '9') {
                        decimalPlaces = valueTxt.length - (j + 1);
                        if (decimalPlaces >= 0)
                            return Math.min(decimalPlaces, limit);
                    }
                }

                if (decimalPlaces > 0)
                    value *= Math.pow(10, decimalPlaces);

                while (Math.round(value) != value && decimalPlaces < limit) {
                    decimalPlaces++;
                    value *= 10;
                }
            }

            return decimalPlaces;
        },

        /** @private */
        _renderValueAxis: function (groupIndex, rect, isMeasure, chartRect) {
            var g = this.seriesGroups[groupIndex];
            var swapXY = g.orientation == 'horizontal';
            var axis = this._getValueAxis(groupIndex);
            if (!axis)
                throw 'SeriesGroup ' + groupIndex + ' is missing valueAxis definition';

            var szMeasure = { width: 0, height: 0 };

            if (!this._isGroupVisible(groupIndex) || this._isPieOnlySeries() || g.type == 'spider')
                return szMeasure;

            var valuesOnTicks = axis.valuesOnTicks != false;
            var gstat = this._stats.seriesGroups[groupIndex];
            var mu = gstat.mu;

            var logAxis = axis.logarithmicScale == true;
            var logBase = axis.logarithmicScaleBase || 10;

            if (logAxis)
                mu = !isNaN(axis.unitInterval) ? axis.unitInterval : 1;

            if (mu == 0)
                mu = 1;

            if (isNaN(mu))
                return szMeasure;

            var axisSettings = this._getAxisSettings(axis);
            var titleSettings = axisSettings.title,
                labelsSettings = axisSettings.labels;

            var labels = axis.labels || {};
            var halign = this._get([axis.horizontalTextAlignment, labels.horizontalAlignment]);
            if (!halign && labelsSettings.angle == 0)
                labelsSettings.halign = swapXY ? 'center' : (axis.position == 'right' ? 'left' : 'right');

            var labelsFrequency = this._get([labelsSettings.step, labelsSettings.unitInterval / mu]);
            if (isNaN(labelsFrequency))
                labelsFrequency = 1;

            labelsFrequency = Math.max(1, Math.round(labelsFrequency));

            if (!this._calcValueAxisItems(groupIndex, (swapXY ? rect.width : rect.height), labelsFrequency) || !axisSettings.visible)
                return szMeasure;

            if (!swapXY) {
                titleSettings.angle = (!this.rtl ? -90 : 90);
                if (titleSettings.rotationPoint == 'centercenter') {
                    if (titleSettings.valign == 'top')
                        titleSettings.rotationPoint = 'rightcenter';
                    else if (titleSettings.valign == 'bottom')
                        titleSettings.rotationPoint = 'leftcenter';
                }
            }

            var renderData = this._renderData[groupIndex].valueAxis;

            var formatSettings = labelsSettings.formatSettings;

            var isStacked100 = g.type.indexOf("stacked") != -1 && g.type.indexOf("100") != -1;
            if (isStacked100 && !formatSettings)
                formatSettings = { sufix: '%' };

            if (!labelsSettings.formatFunction && (!formatSettings || !formatSettings.decimalPlaces)) {
                formatSettings = formatSettings || {};
                formatSettings.decimalPlaces = this._getDecimalPlaces([gstat.min, gstat.max, mu], undefined, 3);
            }

            var gridLines = axisSettings.gridLines;
            var gridLinesInterval = logAxis ? mu : this._getInterval(gridLines, mu);

            var axisSize = swapXY ? rect.width : rect.height;

            var flip = (axis.flip == true);

            // force verse due to y-axis layout
            axis.flip = !flip;

            var axisStats = { min: gstat.min, max: gstat.max, logAxis: { enabled: logAxis == true, base: axis.logarithmicScaleBase, minPow: gstat.minPow, maxPow: gstat.maxPow} };

            if (gridLines.visible || axis.alternatingBackgroundColor || axis.alternatingBackgroundColor2) {
                gridLines.offsets = this._getOffsets('gridLines', axis, axisSize, axisStats, axisSettings, { left: 0, right: 0 }, valuesOnTicks, mu);
            }

            var tickMarks = axisSettings.tickMarks;
            if (tickMarks.visible) {
                tickMarks.offsets = this._getOffsets('tickMarks', axis, axisSize, axisStats, axisSettings, { left: 0, right: 0 }, valuesOnTicks, mu);
            }

            labelOffsets = this._getOffsets('labels', axis, axisSize, axisStats, axisSettings, { left: 0, right: 0 }, valuesOnTicks, mu, !valuesOnTicks);

            // restore original value
            axis.flip = flip;

            var items = [];

            var oldPositions;
            if (this._elementRenderInfo && this._elementRenderInfo.length > groupIndex)
                oldPositions = this._elementRenderInfo[groupIndex].valueAxis;

            for (var i = 0; i < labelOffsets.length; i++) {
                var value = labelOffsets[i].value;
                if (isNaN(labelOffsets[i].offset)) {
                    items.push(undefined);
                    continue;
                }

                var text = (labelsSettings.formatFunction) ? labelsSettings.formatFunction(value) : (!isNaN(value)) ? this._formatNumber(value, formatSettings) : value;

                var obj = { key: value, text: text };
                if (oldPositions && oldPositions.itemOffsets[value]) {
                    obj.x = oldPositions.itemOffsets[value].x;
                    obj.y = oldPositions.itemOffsets[value].y;
                }

                obj.targetX = labelOffsets[i].offset;

                if (!isNaN(obj.targetX))
                    items.push(obj);
            }

            var isMirror = (swapXY && axis.position == 'top') || (!swapXY && axis.position == 'right') || (!swapXY && this.rtl && axis.position != 'left');

            var itemsInfo = { items: items, renderData: renderData };

            var anim = this._getAnimProps(groupIndex);
            var duration = anim.enabled && items.length < 500 ? anim.duration : 0;
            if (this.enableAxisTextAnimation == false)
                duration = 0;

            renderData.settings = axisSettings;

            renderData.isMirror = isMirror;
            renderData.rect = rect;

            return this._renderAxis(!swapXY, isMirror, axisSettings, rect, chartRect, mu, logAxis, true, itemsInfo, isMeasure, duration);
        },

        _objectsArraysToArray: function (array, key) {
            var out = [];
            if (!$.isArray(array))
                return out;

            for (var i = 0; i < array.length; i++)
                out.push(array[i][key]);

            return out;
        },

        _arraysToObjectsArray: function (arrays, keys) {
            var out = [];
            if (arrays.length != keys.length)
                return out;

            for (var i = 0; i < arrays.length; i++) {
                for (var j = 0; j < arrays[i].length; j++) {
                    if (out.length <= j)
                        out.push({});

                    out[j][keys[i]] = arrays[i][j];
                }
            }

            return out;
        },

        _valuesToOffsets: function (values, axis, stats, size, padding, valuesOnTicks, offsetAdj) {
            var out = [];

            if (!axis || !$.isArray(values))
                return out;

            var logBase = stats.logAxis.base;
            var type = stats.logAxis.enabled ? 'logarithmic' : 'linear';
            var flip = axis.flip;

            var paddedSize = size;
            var leftPadding = 0, rightPadding = 0;
            if (padding && !isNaN(padding.left)) {
                leftPadding = padding.left;
            }
            if (padding && !isNaN(padding.right)) {
                rightPadding = padding.right;
            }

            paddedSize = size - leftPadding - rightPadding;
            size = paddedSize; // TODO: values on ticks is not needed as param

            for (var i = 0; i < values.length; i++) {
                x = this._jqxPlot.scale(
                    values[i],
                    {
                        min: stats.min.valueOf(),
                        max: stats.max.valueOf(),
                        type: type,
                        base: logBase
                    },
                    {
                        min: 0,
                        max: valuesOnTicks ? size : paddedSize,
                        flip: flip
                    },
                    {
                        //   'ignore_range': true
                    }
                );

                if (!isNaN(x)) {
                    if (!isNaN(offsetAdj))
                        x += offsetAdj;

                    if (x <= size + leftPadding + rightPadding + 1)
                        out.push($.jqx._ptrnd(x));
                    else
                        out.push(NaN);
                }
                else
                    out.push(NaN);
            }

            return out;
        },


        _generateIntervalValues: function (axisStats, interval, baseInterval, valuesOnTicks, useMidVal) {
            var intervals = [];

            var min = axisStats.min;
            var max = axisStats.max;

            if (axisStats.logAxis && axisStats.logAxis.enabled) {
                min = axisStats.logAxis.minPow;
                max = axisStats.logAxis.maxPow;
            }

            if (min == undefined || max == undefined)
                return intervals;

            if (min == max) {
                if (axisStats.logAxis && axisStats.logAxis.enabled)
                    return [Math.pow(axisStats.logAxis.base, min)];
                else
                    return [min];
            }

            var factor = 1;
            if (baseInterval < 1) {
                // adjust to bigger number to avoid js rounding issues
                factor = 1000000;
                min *= factor;
                max *= factor;
                baseInterval *= factor;
            }

            for (var i = min; i <= max; i += baseInterval)
                intervals.push(i / factor + (useMidVal ? baseInterval / 2 : 0));

            if (interval > baseInterval) {
                var out = [];
                var ratio = Math.round(interval / baseInterval);
                for (var i = 0; i < intervals.length; i++)
                    if ((i % ratio) == 0)
                        out.push(intervals[i]);

                intervals = out;
            }

            if (axisStats.logAxis && axisStats.logAxis.enabled) {
                for (var i = 0; i < intervals.length; i++)
                    intervals[i] = Math.pow(axisStats.logAxis.base, intervals[i]);
            }

            return intervals;
        },

        /** @private */
        _generateDTOffsets: function (min, max, axisSize, padding, interval, baseInterval, dateTimeUnit, isTicksMode, tickPadding, isValue, flip) {
            if (!dateTimeUnit)
                dateTimeUnit = 'day';

            var offsets = [];

            if (min > max)
                return offsets;

            if (min == max) {
                if (isValue)
                    offsets.push({ offset: isTicksMode ? axisSize / 2 : padding.left, value: min });
                else if (isTicksMode)
                    offsets.push({ offset: axisSize / 2, value: min });

                return offsets;
            }

            var paddedSize = axisSize - padding.left - padding.right;

            var curr = min;
            var initialOffset = padding.left;
            var offset = initialOffset;

            baseInterval = Math.max(baseInterval, 1);
            var realInterval = baseInterval;
            var frac = Math.min(1, baseInterval);

            if (baseInterval > 1 && dateTimeUnit != 'millisecond')
                baseInterval = 1;

            while ($.jqx._ptrnd(offset) <= $.jqx._ptrnd(padding.left + paddedSize + (isTicksMode ? 0 : padding.right))) {
                offsets.push({ offset: offset, value: curr });

                var date = new Date(curr.valueOf());

                if (dateTimeUnit == 'millisecond')
                    date.setMilliseconds(curr.getMilliseconds() + baseInterval);
                else if (dateTimeUnit == 'second')
                    date.setSeconds(curr.getSeconds() + baseInterval);
                else if (dateTimeUnit == 'minute')
                    date.setMinutes(curr.getMinutes() + baseInterval);
                else if (dateTimeUnit == 'hour') {
                    var before = date.valueOf();
                    date.setHours(curr.getHours() + baseInterval);

                    if (before == date.valueOf()) // DST FF bug
                        date.setHours(curr.getHours() + baseInterval + 1);
                }
                else if (dateTimeUnit == 'day')
                    date.setDate(curr.getDate() + baseInterval);
                else if (dateTimeUnit == 'month')
                    date.setMonth(curr.getMonth() + baseInterval);
                else if (dateTimeUnit == 'year')
                    date.setFullYear(curr.getFullYear() + baseInterval);

                curr = date;

                offset = initialOffset + (curr.valueOf() - min.valueOf()) * frac / (max.valueOf() - min.valueOf()) * paddedSize;
            }

            if (flip) {
                for (var i = 0; i < offsets.length; i++)
                    offsets[i].offset = axisSize - offsets[i].offset;
            }

            if (realInterval > 1 && dateTimeUnit != 'millisecond') {
                var out = [];
                for (var i = 0; i < offsets.length; i += realInterval)
                    out.push({ offset: offsets[i].offset, value: offsets[i].value });

                offsets = out;
            }

            if (!isTicksMode && !isValue && offsets.length > 1) {
                var out = [];
                out.push({ offset: 0, value: undefined });
                for (var i = 1; i < offsets.length; i++) {
                    out.push({ offset: offsets[i - 1].offset + (offsets[i].offset - offsets[i - 1].offset) / 2, value: undefined });
                }

                var len = out.length;
                if (len > 1)
                    out.push({ offset: out[len - 1].offset + (out[len - 1].offset - out[len - 2].offset) });
                else
                    out.push({ offset: axisSize, value: undefined });

                offsets = out;
            }

            if (interval > baseInterval) {
                var out = [];
                var ratio = Math.round(interval / realInterval);
                for (var i = 0; i < offsets.length; i++)
                    if ((i % ratio) == 0)
                        out.push({ offset: offsets[i].offset, value: offsets[i].value });

                offsets = out;
            }

            return offsets;
        },

        _hasStackValueReversal: function (groupIndex, gbase) {
            var group = this.seriesGroups[groupIndex];
            var isStacked = -1 != group.type.indexOf("stacked");
            if (!isStacked)
                return false;

            var isWaterfall = -1 != group.type.indexOf("waterfall");

            var len = this._getDataLen(groupIndex);

            var waterfallStackSum = 0;
            var stackIntialized = false;

            var seriesVisibility = [];

            for (var j = 0; j < group.series.length; j++)
                seriesVisibility[j] = this._isSerieVisible(groupIndex, j);

            for (var i = 0; i < len; i++) {
                var stackBase = (isWaterfall && i != 0) ? waterfallStackSum : gbase;

                var pSum = 0, nSum = 0;

                var isDirectionDown = undefined;
                if (!isWaterfall)
                    stackIntialized = false;

                for (var sidx = 0; sidx < group.series.length; sidx++) {
                    if (!seriesVisibility[sidx])
                        continue;

                    val = this._getDataValueAsNumber(i, group.series[sidx].dataField, groupIndex);
                    if (isNaN(val))
                        continue;

                    if (group.series[sidx].summary) {
                        var summary = this._getDataValue(i, group.series[sidx].summary, groupIndex);
                        if (undefined !== summary)
                            continue;
                    }

                    var currDirectionDown = !stackIntialized ? val < gbase : val < 0;
                    stackIntialized = true;

                    if (isDirectionDown == undefined)
                        isDirectionDown = currDirectionDown;

                    if (currDirectionDown != isDirectionDown)
                        return true;

                    isDirectionDown = currDirectionDown;

                    waterfallStackSum += val;
                }
            }

            return false;
        },

        _getValueAxis: function (groupIndex) {
            var valueAxis = groupIndex == undefined ? this.valueAxis : this.seriesGroups[groupIndex].valueAxis || this.valueAxis;

            if (!valueAxis)
                valueAxis = this.valueAxis = {};

            return valueAxis;
        },

        /** @private */
        _buildStats: function (rect) {
            var stat = { seriesGroups: [] };
            this._stats = stat;

            for (var gidx = 0; gidx < this.seriesGroups.length; gidx++) {
                var group = this.seriesGroups[gidx];
                stat.seriesGroups[gidx] = {};

                var xAxis = this._getXAxis(gidx);
                var valueAxis = this._getValueAxis(gidx);

                var xAxisStats = this._getXAxisStats(gidx, xAxis, (group.orientation != 'horizontal') ? rect.width : rect.height);

                var grst = stat.seriesGroups[gidx];
                grst.isValid = true;

                var valueAxisSize = (group.orientation == 'horizontal') ? rect.width : rect.height;

                var logAxis = valueAxis.logarithmicScale == true;
                var logBase = valueAxis.logarithmicScaleBase;
                if (isNaN(logBase))
                    logBase = 10;

                var isStacked = -1 != group.type.indexOf("stacked");
                var isStacked100 = isStacked && -1 != group.type.indexOf("100");
                var isRange = -1 != group.type.indexOf("range");
                var isWaterfall = group.type.indexOf('waterfall') != -1;

                if (isWaterfall && !this._moduleWaterfall)
                    throw "Please include 'jqxchart.waterfall.js'";

                if (isStacked100) {
                    grst.psums = [];
                    grst.nsums = [];
                }

                var gmin = NaN, gmax = NaN;
                var gsumP = NaN, gsumN = NaN;
                var gbase = valueAxis ? valueAxis.baselineValue : NaN;
                if (isNaN(gbase))
                    gbase = logAxis && !isStacked100 ? 1 : 0;

                var hasStackValueReversal = false;
                if (gbase != 0 && isStacked) {
                    hasStackValueReversal = this._hasStackValueReversal(gidx, gbase);
                    if (hasStackValueReversal)
                        gbase = 0;
                }

                if (isStacked && isWaterfall)
                    hasStackValueReversal = this._hasStackValueReversal(gidx, gbase);

                var len = this._getDataLen(gidx);
                var gMaxRange = 0;
                var minPercent = NaN;

                var seriesPrevValue = [];
                if (isWaterfall) {
                    // init series prev value array for waterfall series               
                    for (var sidx = 0; sidx < group.series.length; sidx++)
                        seriesPrevValue.push(NaN);
                }

                var prevValueWaterfall = NaN;

                for (var i = 0; i < len && grst.isValid; i++) {
                    if (xAxis.rangeSelector) {
                        var xAxisValue = xAxis.dataField ? this._getDataValue(i, xAxis.dataField, gidx) : i;
                        if (xAxisValue && xAxisStats.isDateTime)
                            xAxisValue = this._castAsDate(xAxisValue, xAxis.dateFormat);
                        if (xAxisStats.useIndeces)
                            xAxisValue = i;

                        // skip values outside of xAxis min/max
                        if (xAxisValue && (xAxisValue.valueOf() < xAxisStats.min.valueOf() || xAxisValue.valueOf() > xAxisStats.max.valueOf()))
                            continue;
                    }

                    var min = valueAxis.minValue;
                    var max = valueAxis.maxValue;


                    if (/*hasValueAxis && */valueAxis.baselineValue) {
                        if (isNaN(min))
                            min = gbase;
                        else
                            min = Math.min(gbase, min);

                        if (isNaN(max))
                            max = gbase;
                        else
                            max = Math.max(gbase, max);
                    }

                    var sumP = 0, sumN = 0;

                    for (var sidx = 0; group.series && sidx < group.series.length; sidx++) {
                        if (!this._isSerieVisible(gidx, sidx))
                            continue;

                        var val = NaN, valMax = NaN, valMin = NaN;
                        if (group.type.indexOf('candle') != -1 || group.type.indexOf('ohlc') != -1) {
                            var fields = ['Open', 'Low', 'Close', 'High'];
                            for (var j in fields) {
                                var valField = this._getDataValueAsNumber(i, group.series[sidx]['dataField' + fields[j]], gidx);
                                if (isNaN(valField))
                                    continue;

                                valMin = isNaN(valMax) ? valField : Math.min(valMin, valField);
                                valMax = isNaN(valMax) ? valField : Math.max(valMax, valField);
                            }
                        }
                        else {
                            if (isRange) {
                                var valFrom = this._getDataValueAsNumber(i, group.series[sidx].dataFieldFrom, gidx);
                                var valTo = this._getDataValueAsNumber(i, group.series[sidx].dataFieldTo, gidx);

                                valMax = Math.max(valFrom, valTo);
                                valMin = Math.min(valFrom, valTo);
                            }
                            else {
                                val = this._getDataValueAsNumber(i, group.series[sidx].dataField, gidx);

                                if (isWaterfall) {
                                    if (this._isSummary(gidx, i)) {
                                        var summary = this._getDataValue(i, group.series[sidx].summary, gidx);
                                        if (summary !== undefined)
                                            continue;
                                    }

                                    if (!isStacked) {
                                        if (isNaN(seriesPrevValue[sidx]))
                                            seriesPrevValue[sidx] = val;
                                        else
                                            val += seriesPrevValue[sidx];

                                        seriesPrevValue[sidx] = val;
                                    }
                                    else {
                                        if (!isNaN(prevValueWaterfall))
                                            val += prevValueWaterfall;

                                        prevValueWaterfall = val;
                                    }
                                }


                                if (isNaN(val) || (logAxis && val <= 0))
                                    continue;

                                valMin = valMax = val;
                            }
                        }


                        if ((isNaN(max) || valMax > max) && ((isNaN(valueAxis.maxValue)) ? true : valMax <= valueAxis.maxValue))
                            max = valMax;

                        if ((isNaN(min) || valMin < min) && ((isNaN(valueAxis.minValue)) ? true : valMin >= valueAxis.minValue))
                            min = valMin;

                        if (!isNaN(val) && isStacked && !isWaterfall) {
                            if (val > gbase)
                                sumP += val;
                            else if (val < gbase)
                                sumN += val;
                        }
                    } // for sidx

                    // stacked series fit within min-max settings
                    if (!isStacked100) {// && hasValueAxis) {
                        if (!isNaN(valueAxis.maxValue))
                            sumP = Math.min(valueAxis.maxValue, sumP);
                        if (!isNaN(valueAxis.minValue))
                            sumN = Math.max(valueAxis.minValue, sumN);
                    }

                    if (logAxis && isStacked100) {
                        for (var sidx = 0; sidx < group.series.length; sidx++) {
                            if (!this._isSerieVisible(gidx, sidx)) {
                                minPercent = 0.01;
                                continue;
                            }

                            var val = this._getDataValueAsNumber(i, group.series[sidx].dataField, gidx);
                            if (isNaN(val) || val <= 0) {
                                minPercent = 0.01;
                                continue;
                            }

                            var p = sumP == 0 ? 0 : val / sumP;
                            if (isNaN(minPercent) || p < minPercent)
                                minPercent = p;
                        }
                    }

                    var range = sumP - sumN;
                    if (gMaxRange < range)
                        gMaxRange = range;

                    if (isStacked100) {
                        grst.psums[i] = sumP;
                        grst.nsums[i] = sumN;
                    }

                    if (max > gmax || isNaN(gmax))
                        gmax = max;
                    if (min < gmin || isNaN(gmin))
                        gmin = min;

                    if (sumP > gsumP || isNaN(gsumP))
                        gsumP = sumP;
                    if (sumN < gsumN || isNaN(gsumN))
                        gsumN = sumN;
                } // for i

                if (isStacked100) {
                    gsumP = gsumP == 0 ? 0 : Math.max(gsumP, -gsumN);
                    gsumN = gsumN == 0 ? 0 : Math.min(gsumN, -gsumP);
                }

                if (gmin == gmax) {
                    if (gmin == 0) {
                        gmin = -1;
                        gmax = 1;
                    }
                    else if (gmin < 0)
                        gmax = 0;
                    else {
                        if (!logAxis)
                            gmin = 0;
                        else if (gmin == 1) {
                            gmin = gmin / logBase;
                            gmax = gmax * logBase;
                        }
                    }
                }

                var groupContext = { gmin: gmin, gmax: gmax, gsumP: gsumP, gsumN: gsumN, gbase: gbase, isLogAxis: logAxis, logBase: logBase,
                    minPercent: minPercent, gMaxRange: gMaxRange, isStacked: isStacked, isStacked100: isStacked100, isWaterfall: isWaterfall,
                    hasStackValueReversal: hasStackValueReversal, valueAxis: valueAxis, valueAxisSize: valueAxisSize
                };

                if (groupContext.isStacked) {
                    if (groupContext.gsumN < 0)
                        groupContext.gmin = Math.min(groupContext.gmin, groupContext.gbase + groupContext.gsumN);

                    if (groupContext.gsumP > 0)
                        groupContext.gmax = Math.max(groupContext.gmax, groupContext.gbase + groupContext.gsumP);
                }

                grst.context = groupContext;
            } // for gidx


            this._mergeCommonValueAxisStats();
            for (var i = 0; i < stat.seriesGroups.length; i++) {
                var grst = stat.seriesGroups[i];
                if (!grst.isValid)
                    continue;

                var out = this._calcOutputGroupStats(grst.context);
                for (var j in out)
                    grst[j] = out[j];

                delete grst.context;
            }
        },

        _mergeCommonValueAxisStats: function () {
            var common = {};
            for (var i = 0; i < this.seriesGroups.length; i++) {
                if (!this._isGroupVisible(i))
                    continue

                if (this.seriesGroups[i].valueAxis)
                    continue;

                var stats = this._stats.seriesGroups[i].context;
                common.gbase = stats.gbase;

                if (isNaN(common.gmin) || stats.gmin < common.gmin)
                    common.gmin = stats.gmin;

                if (isNaN(common.gmax) || stats.gmax > common.gmax)
                    common.gmax = stats.gmax;

                if (isNaN(common.gsumP) || stats.gsumP > common.gsumP)
                    common.gsumP = stats.gsumP;

                if (isNaN(common.gsumN) || stats.gsumN < common.gsumN)
                    common.gsumN = stats.gsumN;

                if (isNaN(common.logBase) || stats.logBase < common.logBase)
                    common.logBase = stats.logBase;

                if (isNaN(common.minPercent) || stats.minPercent < common.minPercent)
                    common.minPercent = stats.minPercent;

                if (common.gsumN > 0)
                    common.gmin = Math.min(common.gmin, common.gbase + common.gsumN);

                if (common.gsumP > 0)
                    common.gmax = Math.max(common.gmax, common.gbase + common.gsumP);
            }

            for (var i = 0; i < this.seriesGroups.length; i++) {
                if (this.seriesGroups[i].valueAxis)
                    continue;

                var ctx = this._stats.seriesGroups[i].context;
                for (var j in common)
                    ctx[j] = common[j];
            }

        },


        _calcOutputGroupStats: function (context) {
            var gmin = context.gmin,
                gmax = context.gmax,
                gsumP = context.gsumP,
                gsumN = context.gsumN,
                gbase = context.gbase,
                logAxis = context.isLogAxis,
                logBase = context.logBase,
                minPercent = context.minPercent,
                gMaxRange = context.gMaxRange,
                isStacked = context.isStacked,
                isStacked100 = context.isStacked100,
                isWaterfall = context.isWaterfall,
                hasStackValueReversal = context.hasStackValueReversal,
                valueAxis = context.valueAxis,
                valueAxisSize = context.valueAxisSize;

            /// interval calculation
            var mu = context.valueAxis.unitInterval;
            if (!mu) {
                mu = this._calcInterval(
                    gmin,
                    gmax,
                    Math.max(valueAxisSize / 80, 2));
            }

            if (gmin == gmax) {
                gmin = gbase;
                gmax = 2 * gmax;
            }

            var intervals = NaN;

            // log axis scale
            var minPow = 0;
            var maxPow = 0;
            if (logAxis) {
                if (isStacked100) {
                    intervals = 0;
                    var p = 1;
                    minPow = maxPow = $.jqx.log(100, logBase);

                    while (p > minPercent) {
                        p /= logBase;
                        minPow--;
                        intervals++;
                    }

                    gmin = Math.pow(logBase, minPow);

                }
                else {
                    if (isStacked && !isWaterfall)
                        gmax = Math.max(gmax, gsumP);

                    maxPow = $.jqx._rnd($.jqx.log(gmax, logBase), 1, true);
                    gmax = Math.pow(logBase, maxPow);

                    minPow = $.jqx._rnd($.jqx.log(gmin, logBase), 1, false);
                    gmin = Math.pow(logBase, minPow);
                }

                mu = logBase;
            } // if logAxis

            if (gmin < gsumN)
                gsumN = gmin;

            if (gmax > gsumP)
                gsumP = gmax;

            var mn = logAxis ? gmin : $.jqx._rnd(gmin, mu, false);
            var mx = logAxis ? gmax : $.jqx._rnd(gmax, mu, true);

            if (isStacked100 && mx > 100)
                mx = 100;

            if (isStacked100 && !logAxis) {
                mx = (mx > 0) ? 100 : 0;
                mn = (mn < 0) ? -100 : 0;
                mu = valueAxis.unitInterval;
                if (isNaN(mu) || mu <= 0 || mu >= 100)
                    mu = 10;

                if ((100 % mu) != 0) {
                    // ensure devision without reminder
                    for (; mu >= 1; mu--)
                        if ((100 % mu) == 0)
                            break;
                }
            }

            if (isNaN(mx) || isNaN(mn) || isNaN(mu))
                return {};

            if (isNaN(intervals)) {
                intervals = parseInt(((mx - mn) / (mu == 0 ? 1 : mu)).toFixed());
            }

            if (logAxis && !isStacked100) {
                intervals = maxPow - minPow;
                gMaxRange = Math.pow(logBase, intervals);
            }

            if (intervals < 1)
                return {};

            var result = {
                min: mn,
                max: mx,
                logarithmic: logAxis,
                logBase: logBase,
                base: logAxis ? mn : gbase,
                minPow: minPow,
                maxPow: maxPow,
                sumP: gsumP,
                sumN: gsumN,
                mu: mu,
                maxRange: gMaxRange,
                intervals: intervals,
                hasStackValueReversal: hasStackValueReversal
            };

            return result;
        },


        /** @private */
        _getDataLen: function (groupIndex) {
            var ds = this.source;
            if (groupIndex != undefined && groupIndex != -1 && this.seriesGroups[groupIndex].source)
                ds = this.seriesGroups[groupIndex].source;

            if (ds instanceof $.jqx.dataAdapter)
                ds = ds.records;

            if (ds)
                return ds.length;

            return 0;
        },

        /** @private */
        _getDataValue: function (index, dataField, groupIndex) {
            var ds = this.source;
            if (groupIndex != undefined && groupIndex != -1)
                ds = this.seriesGroups[groupIndex].source || ds;

            if (ds instanceof $.jqx.dataAdapter)
                ds = ds.records;

            if (!ds || index < 0 || index > ds.length - 1)
                return undefined;

            if ($.isFunction(dataField))
                return dataField(index, ds);

            return (dataField && dataField != '') ? ds[index][dataField] : ds[index];
        },

        /** @private */
        _getDataValueAsNumber: function (index, dataField, groupIndex) {
            var val = this._getDataValue(index, dataField, groupIndex);
            if (this._isDate(val))
                return val.valueOf();

            if (typeof (val) != 'number')
                val = parseFloat(val);
            if (typeof (val) != 'number')
                val = undefined;

            return val;
        },

        _isPieGroup: function (groupIndex) {
            var group = this.seriesGroups[groupIndex];
            if (!group || !group.type)
                return false;

            return group.type.indexOf('pie') != -1 || group.type.indexOf('donut') != -1;
        },

        /** @private */
        _renderPieSeries: function (groupIndex, rect) {
            var dataLength = this._getDataLen(groupIndex);
            var group = this.seriesGroups[groupIndex];

            var renderData = this._calcGroupOffsets(groupIndex, rect).offsets;

            for (var sidx = 0; sidx < group.series.length; sidx++) {
                var s = group.series[sidx];

                if (s.customDraw)
                    continue;

                var settings = this._getSerieSettings(groupIndex, sidx);

                var colorScheme = s.colorScheme || group.colorScheme || this.colorScheme;

                var anim = this._getAnimProps(groupIndex, sidx);
                var duration = anim.enabled && dataLength < 5000 && !this._isToggleRefresh && this._isVML != true ? anim.duration : 0;
                if ($.jqx.mobile.isMobileBrowser() && (this.renderer instanceof $.jqx.HTML5Renderer))
                    duration = 0;

                var minAngle = this._get([s.minAngle, s.startAngle]);
                if (isNaN(minAngle) || minAngle < 0 || minAngle > 360)
                    minAngle = 0;
                var maxAngle = this._get([s.maxAngle, s.endAngle]);
                if (isNaN(maxAngle) || maxAngle < 0 || maxAngle > 360)
                    maxAngle = 360;

                var ctx = { rect: rect, minAngle: minAngle, maxAngle: maxAngle, groupIndex: groupIndex, serieIndex: sidx, settings: settings, items: [] };

                // render
                for (var i = 0; i < dataLength; i++) {
                    var itemRenderData = renderData[sidx][i];
                    if (!itemRenderData.visible)
                        continue;

                    var from = itemRenderData.fromAngle;
                    var to = itemRenderData.toAngle;

                    var pieSliceElement = this.renderer.pieslice(
                        itemRenderData.x,
                        itemRenderData.y,
                        itemRenderData.innerRadius,
                        itemRenderData.outerRadius,
                        from,
                        duration == 0 ? to : from,
                        itemRenderData.centerOffset);

                    this._setRenderInfo(groupIndex, sidx, i, { element: pieSliceElement });

                    var ctxItem = {
                        displayValue: itemRenderData.displayValue,
                        itemIndex: i,
                        visible: itemRenderData.visible,
                        x: itemRenderData.x,
                        y: itemRenderData.y,
                        innerRadius: itemRenderData.innerRadius,
                        outerRadius: itemRenderData.outerRadius,
                        fromAngle: from,
                        toAngle: to,
                        centerOffset: itemRenderData.centerOffset
                    };

                    ctx.items.push(ctxItem);
                } // for i

                this._animatePieSlices(ctx, 0);
                var self = this;
                this._enqueueAnimation(
                        "series",
                        undefined,
                        undefined,
                        duration,
                        function (element, ctx, percent) {
                            self._animatePieSlices(ctx, percent);
                        },
                        ctx);
            }
        },

        /** @private */
        _sliceSortFunction: function (a, b) {
            return a.fromAngle - b.fromAngle;
        },

        /** @private */
        _animatePieSlices: function (ctx, percent) {
            var renderInfo;
            if (this._elementRenderInfo &&
                this._elementRenderInfo.length > ctx.groupIndex &&
                this._elementRenderInfo[ctx.groupIndex].series &&
                this._elementRenderInfo[ctx.groupIndex].series.length > ctx.serieIndex) {
                renderInfo = this._elementRenderInfo[ctx.groupIndex].series[ctx.serieIndex];
            }

            var animMaxAngle = 360 * percent;
            var g = this.seriesGroups[ctx.groupIndex];
            var labelsSettings = this._getLabelsSettings(ctx.groupIndex, ctx.serieIndex, NaN);
            var showLabels = labelsSettings.visible;

            var arr = [];
            for (var i = 0; i < ctx.items.length; i++) {
                var item = ctx.items[i];

                // render the slice
                if (!item.visible)
                    continue;

                var fromAngle = item.fromAngle;
                var toAngle = item.fromAngle + percent * (item.toAngle - item.fromAngle);

                if (renderInfo && renderInfo[item.displayValue]) {
                    var oldFromAngle = renderInfo[item.displayValue].fromAngle;
                    var oldToAngle = renderInfo[item.displayValue].toAngle;

                    fromAngle = oldFromAngle + (fromAngle - oldFromAngle) * percent;
                    toAngle = oldToAngle + (toAngle - oldToAngle) * percent;
                }

                arr.push({ index: i, from: fromAngle, to: toAngle });
            }

            if (renderInfo)
                arr.sort(this._sliceSortFunction);

            var prevToAngle = NaN;
            for (var i = 0; i < arr.length; i++) {
                var item = ctx.items[arr[i].index];

                var elementRenderInfo = this._getRenderInfo(ctx.groupIndex, ctx.serieIndex, item.itemIndex);

                var fromAngle = arr[i].from;
                var toAngle = arr[i].to;

                if (renderInfo) {
                    if (!isNaN(prevToAngle) && fromAngle > prevToAngle)
                        fromAngle = prevToAngle;

                    prevToAngle = toAngle;
                    if (i == arr.length - 1 && toAngle != arr[0].from)
                        toAngle = ctx.maxAngle + arr[0].from;
                }

                var cmd = this.renderer.pieSlicePath(item.x, item.y, item.innerRadius, item.outerRadius, fromAngle, toAngle, item.centerOffset);
                this.renderer.attr(elementRenderInfo.element, { 'd': cmd });

                var colors = this._getColors(ctx.groupIndex, ctx.serieIndex, item.itemIndex, 'radialGradient', item.outerRadius);
                var settings = ctx.settings;

                elementRenderInfo.colors = colors;
                elementRenderInfo.settings = settings;

                this.renderer.attr(
                    elementRenderInfo.element,
                    {
                        fill: colors.fillColor,
                        stroke: colors.lineColor,
                        'stroke-width': settings.stroke,
                        'fill-opacity': settings.opacity,
                        'stroke-opacity': settings.opacity,
                        'stroke-dasharray': 'none' || settings.dashStyle
                    });

                var s = g.series[ctx.serieIndex];

                // Label rendering                
                if (showLabels) {
                    this._showPieLabel(ctx.groupIndex, ctx.serieIndex, item.itemIndex, labelsSettings);
                }

                // Install mouse event handlers
                if (percent == 1.0) {
                    this._installHandlers(elementRenderInfo.element, 'pieslice', ctx.groupIndex, ctx.serieIndex, item.itemIndex);
                }
            }
        },

        _showPieLabel: function (groupIndex, serieIndex, itemIndex, labelsSettings, radiusAdjustment) {
            var renderInfo = this._renderData[groupIndex].offsets[serieIndex][itemIndex];

            // remove lablel element if exists
            if (renderInfo.elementInfo.labelElement)
                this.renderer.removeElement(renderInfo.elementInfo.labelElement);

            if (!labelsSettings)
                labelsSettings = this._getLabelsSettings(groupIndex, serieIndex, NaN);

            if (!labelsSettings.visible)
                return;

            var angleFrom = renderInfo.fromAngle, angleTo = renderInfo.toAngle;
            var diff = Math.abs(angleFrom - angleTo);
            var lFlag = diff > 180 ? 1 : 0;
            if (diff > 360) {
                angleFrom = 0;
                angleTo = 360;
            }

            var radFrom = angleFrom * Math.PI * 2 / 360;
            var radTo = angleTo * Math.PI * 2 / 360;
            var midAngle = diff / 2 + angleFrom;

            midAngle = midAngle % 360;
            var radMid = midAngle * Math.PI * 2 / 360;

            var labelAngleOverride;
            if (labelsSettings.autoRotate == true)
                labelAngleOverride = midAngle < 90 || midAngle > 270 ? 360 - midAngle : 180 - midAngle;

            var labelLinesEnabled = labelsSettings.linesEnabled;

            // measure
            var sz = this._showLabel(groupIndex, serieIndex, itemIndex, { x: 0, y: 0, width: 0, height: 0 }, 'center', 'center', true, false, false, labelAngleOverride);
            var labelRadius = labelsSettings.radius || renderInfo.outerRadius + Math.max(sz.width, sz.height);
            if (this._isPercent(labelRadius))
                labelRadius = parseFloat(labelRadius) / 100 * Math.min(this._plotRect.width, this._plotRect.height) / 2;

            labelRadius += renderInfo.centerOffset;

            if (isNaN(radiusAdjustment))
                radiusAdjustment = 0;

            labelRadius += radiusAdjustment;

            var g = this.seriesGroups[groupIndex];
            var s = g.series[serieIndex];

            var offsetX = $.jqx.getNum([s.offsetX, g.offsetX, this._plotRect.width / 2]);
            var offsetY = $.jqx.getNum([s.offsetY, g.offsetY, this._plotRect.height / 2]);

            var cx = this._plotRect.x + offsetX;
            var cy = this._plotRect.y + offsetY;

            var labelOffset = this._adjustTextBoxPosition(
                cx,
                cy,
                sz,
                labelRadius,
                midAngle,
                renderInfo.outerRadius > labelRadius,
                labelsSettings.linesAngles != false,
                labelsSettings.autoRotate == true);

            var renderedRect = {};

            renderInfo.elementInfo.labelElement = this._showLabel(
                groupIndex,
                serieIndex,
                itemIndex,
                { x: labelOffset.x, y: labelOffset.y, width: sz.width, height: sz.height },
                'left',
                'top',
                false,
                false,
                false,
                labelAngleOverride,
                renderedRect);

            if (labelRadius > renderInfo.outerRadius + 5 && labelLinesEnabled != false) {
                var lineSettings = {
                    lineColor: renderInfo.elementInfo.colors.lineColor,
                    stroke: renderInfo.elementInfo.settings.stroke,
                    opacity: renderInfo.elementInfo.settings.opacity,
                    dashStyle: renderInfo.elementInfo.settings.dashStyle
                };

                renderInfo.elementInfo.labelArrowPath = this._updateLebelArrowPath(
                    renderInfo.elementInfo.labelArrowPath,
                    cx,
                    cy,
                    labelRadius,
                    renderInfo.outerRadius + radiusAdjustment,
                    radMid,
                    labelsSettings.linesAngles != false,
                    lineSettings,
                    renderedRect);
            }
        },

        _updateLebelArrowPath: function (pathElement, cx, cy, labelRadius, outerRadius, angle, useLineAngles, lineSettings, renderedRect) {
            var x1 = $.jqx._ptrnd(cx + (labelRadius - 0) * Math.cos(angle));
            var y1 = $.jqx._ptrnd(cy - (labelRadius - 0) * Math.sin(angle));
            var x2 = $.jqx._ptrnd(cx + (outerRadius + 2) * Math.cos(angle));
            var y2 = $.jqx._ptrnd(cy - (outerRadius + 2) * Math.sin(angle));

            // sort the points of possible connections to the label rect by distance to center
            var points = [];
            points.push({ x: renderedRect.x + renderedRect.width / 2, y: renderedRect.y });
            points.push({ x: renderedRect.x + renderedRect.width / 2, y: renderedRect.y + renderedRect.height });
            points.push({ x: renderedRect.x, y: renderedRect.y + renderedRect.height / 2 });
            points.push({ x: renderedRect.x + renderedRect.width, y: renderedRect.y + renderedRect.height / 2 });

            if (!useLineAngles) {
                // include corner points
                points.push({ x: renderedRect.x, y: renderedRect.y });
                points.push({ x: renderedRect.x + renderedRect.width, y: renderedRect.y });
                points.push({ x: renderedRect.x + renderedRect.width, y: renderedRect.y + renderedRect.height });
                points.push({ x: renderedRect.x, y: renderedRect.y + renderedRect.height });
            }

            points = points.sort(function (a, b) { return $.jqx._ptdist(a.x, a.y, cx, cy) - $.jqx._ptdist(b.x, b.y, cx, cy); });
            points = points.sort(function (a, b) { return (Math.abs(a.x - cx) + Math.abs(a.y - cy)) - (Math.abs(b.x - cx) + Math.abs(b.y - cy)); });

            for (var i = 0; i < points.length; i++) {
                points[i].x = $.jqx._ptrnd(points[i].x);
                points[i].y = $.jqx._ptrnd(points[i].y);
            }

            // get the best point of the closest corners
            x1 = points[0].x;
            y1 = points[0].y;

            var path = 'M ' + x1 + ',' + y1 + ' L' + x2 + ',' + y2;
            if (useLineAngles) {
                path = 'M ' + x1 + ',' + y1 + ' L' + x2 + ',' + y1 + ' L' + x2 + ',' + y2;
            }

            if (pathElement)
                this.renderer.attr(pathElement, { 'd': path });
            else
                pathElement = this.renderer.path(path, {});

            this.renderer.attr(
                        pathElement,
                        {
                            fill: 'none',
                            stroke: lineSettings.lineColor,
                            'stroke-width': lineSettings.stroke,
                            'stroke-opacity': lineSettings.opacity,
                            'stroke-dasharray': 'none' || lineSettings.dashStyle
                        });

            return pathElement;
        },

        _adjustTextBoxPosition: function (cx, cy, sz, labelRadius, angle, adjustToCenter, labelLinesAngles, labelsAutoRotate) {
            var angleInRad = angle * Math.PI * 2 / 360;

            var x = $.jqx._ptrnd(cx + labelRadius * Math.cos(angleInRad));
            var y = $.jqx._ptrnd(cy - labelRadius * Math.sin(angleInRad));

            if (labelsAutoRotate) {
                var w = sz.width;
                var h = sz.height;

                var b = Math.atan(h / w) % (Math.PI * 2);
                var a = angleInRad % (Math.PI * 2);

                var cX = 0, cY = 0;

                var radiusCorrection = 0;
                if (a <= b) {
                    radiusCorrection = w / 2 * Math.cos(angleInRad);
                }
                else if (a >= b && a < Math.PI - b) {
                    radiusCorrection = (h / 2) * Math.sin(angleInRad);
                }
                else if (a >= Math.PI - b && a < Math.PI + b) {
                    radiusCorrection = w / 2 * Math.cos(angleInRad);
                }
                else if (a >= Math.PI + b && a < 2 * Math.PI - b) {
                    radiusCorrection = h / 2 * Math.sin(angleInRad);
                }
                else if (a >= 2 * Math.PI - b && a < 2 * Math.PI) {
                    radiusCorrection = w / 2 * Math.cos(angleInRad);
                }

                labelRadius += Math.abs(radiusCorrection) + 3;

                var x = $.jqx._ptrnd(cx + labelRadius * Math.cos(angleInRad));
                var y = $.jqx._ptrnd(cy - labelRadius * Math.sin(angleInRad));

                x -= sz.width / 2;
                y -= sz.height / 2;

                return { x: x, y: y };
            }

            if (!adjustToCenter) {
                if (!labelLinesAngles) {
                    //0 -  45 && 315-360: left, middle
                    //45 - 135: center, bottom
                    //135 - 225: right, middle
                    //225 - 315: center, top
                    if (angle >= 0 && angle < 45 || angle >= 315 && angle < 360)
                        y -= sz.height / 2;
                    else if (angle >= 45 && angle < 135) {
                        y -= sz.height;
                        x -= sz.width / 2;
                    }
                    else if (angle >= 135 && angle < 225) {
                        y -= sz.height / 2;
                        x -= sz.width;
                    }
                    else if (angle >= 225 && angle < 315) {
                        x -= sz.width / 2;
                    }
                }
                else {
                    //90 -  270: right, middle
                    //0 - 90, 270 - 360: left, middle
                    if (angle >= 90 && angle < 270) {
                        y -= sz.height / 2;
                        x -= sz.width;
                    }
                    else {
                        y -= sz.height / 2;
                    }

                }
            }
            else {
                x -= sz.width / 2;
                y -= sz.height / 2;
            }

            return { x: x, y: y };
        },

        _isColumnType: function (type) {
            return (type.indexOf('column') != -1 || type.indexOf('waterfall') != -1);
        },

        /** @private */
        _getColumnGroupsCount: function (orientation) {
            var cnt = 0;
            orientation = orientation || 'vertical';
            var sg = this.seriesGroups;
            for (var i = 0; i < sg.length; i++) {
                var groupOrientation = sg[i].orientation || 'vertical';
                if (this._isColumnType(sg[i].type) && groupOrientation == orientation)
                    cnt++;
            }

            if (this.columnSeriesOverlap)
                cnt = 1;

            return cnt;
        },

        /** @private */
        _getColumnGroupIndex: function (groupIndex) {
            var idx = 0;
            var orientation = this.seriesGroups[groupIndex].orientation || 'vertical';
            for (var i = 0; i < groupIndex; i++) {
                var sg = this.seriesGroups[i];
                var sgOrientation = sg.orientation || 'vertical';
                if (this._isColumnType(sg.type) && sgOrientation == orientation)
                    idx++;
            }

            return idx;
        },

        _renderAxisBands: function (groupIndex, rect, isXAxis) {
            var axis = isXAxis ? this._getXAxis(groupIndex) : this._getValueAxis(groupIndex);
            var group = this.seriesGroups[groupIndex];
            var bands = isXAxis ? undefined : group.bands;

            if (!bands) {
                for (var i = 0; i < groupIndex; i++) {
                    var compareAxis = isXAxis ? this._getXAxis(i) : this._getValueAxis(i)
                    if (compareAxis == axis)
                        return; // axis already rendered in earlier group
                }

                bands = axis.bands;
            }

            if (!$.isArray(bands))
                return;

            var gRect = rect;

            var swapXY = group.orientation == 'horizontal';
            if (swapXY)
                gRect = { x: rect.y, y: rect.x, width: rect.height, height: rect.width };

            this._calcGroupOffsets(groupIndex, gRect);

            for (var i = 0; i < bands.length; i++) {
                var band = bands[i];

                var valFrom = this._get([band.minValue, band.from]);
                var valTo = this._get([band.maxValue, band.to]);

                var from = isXAxis ? this.getXAxisDataPointOffset(valFrom, groupIndex) : this.getValueAxisDataPointOffset(valFrom, groupIndex);
                var to = isXAxis ? this.getXAxisDataPointOffset(valTo, groupIndex) : this.getValueAxisDataPointOffset(valTo, groupIndex);
                var diff = Math.abs(from - to);

                var bandElement;

                if (group.polar || group.spider) {
                    var renderData = this._renderData[groupIndex];
                    var polarAxisCoords = renderData.polarCoords;

                    if (!isXAxis) {
                        var pt0 = this._toPolarCoord(polarAxisCoords, rect, rect.x, renderData.baseOffset);
                        var pt1 = this._toPolarCoord(polarAxisCoords, rect, rect.x, from);
                        var pt2 = this._toPolarCoord(polarAxisCoords, rect, rect.x, to);

                        var r0 = $.jqx._ptdist(pt0.x, pt0.y, pt1.x, pt1.y);
                        var r1 = $.jqx._ptdist(pt0.x, pt0.y, pt2.x, pt2.y);

                        var startAngle = Math.round(-polarAxisCoords.startAngle * 360 / (2 * Math.PI));
                        var endAngle = Math.round(-polarAxisCoords.endAngle * 360 / (2 * Math.PI));

                        if (startAngle > endAngle) {
                            var tmp = startAngle;
                            startAngle = endAngle;
                            endAngle = tmp;
                        }

                        if (group.spider) {
                            var offsetAngles = renderData.xAxis.offsetAngles;
                            var path = '';
                            var rArr = [r1, r0];

                            var angles = offsetAngles;
                            if (polarAxisCoords.isClosedCircle) {
                                angles = $.extend([], offsetAngles);
                                angles.push(angles[0]);
                            }

                            for (var k in rArr) {
                                for (var j = 0; j < angles.length; j++) {
                                    var idx = k == 0 ? j : offsetAngles.length - j - 1;
                                    var px = polarAxisCoords.x + rArr[k] * Math.cos(angles[idx]);
                                    var py = polarAxisCoords.y + rArr[k] * Math.sin(angles[idx]);

                                    if (path == '')
                                        path += 'M ';
                                    else
                                        path += ' L';

                                    path += $.jqx._ptrnd(px) + ',' + $.jqx._ptrnd(py);
                                }

                                if (k == 0) {
                                    var px = polarAxisCoords.x + rArr[1] * Math.cos(angles[idx]);
                                    var py = polarAxisCoords.y + rArr[1] * Math.sin(angles[idx]);

                                    path += ' L' + $.jqx._ptrnd(px) + ',' + $.jqx._ptrnd(py);
                                }
                            }

                            path += ' Z';

                            bandElement = this.renderer.path(path);
                        }
                        else {
                            bandElement = this.renderer.pieslice(
                                                    polarAxisCoords.x,
                                                    polarAxisCoords.y,
                                                    r0, // innerRadius
                                                    r1, // outerRadius
                                                    startAngle,
                                                    endAngle);
                        }
                    }
                    else {
                        if (group.spider) {
                            p1 = this.getPolarDataPointOffset(valFrom, this._stats.seriesGroups[groupIndex].max, groupIndex);
                            p2 = this.getPolarDataPointOffset(valTo, this._stats.seriesGroups[groupIndex].max, groupIndex);

                            var path = 'M ' + polarAxisCoords.x + ',' + polarAxisCoords.y;
                            path += ' L ' + p1.x + ',' + p1.y;
                            path += ' L ' + p2.x + ',' + p2.y;

                            bandElement = this.renderer.path(path);
                        }
                        else {
                            var elementInfo = {};
                            var columnRect = { x: Math.min(from, to), y: rect.y, width: diff, height: rect.height };

                            this._columnAsPieSlice(elementInfo, rect, polarAxisCoords, columnRect);
                            bandElement = elementInfo.element;
                        }
                    }
                }
                else {
                    var elRect = { x: Math.min(from, to), y: gRect.y, width: diff, height: gRect.height };
                    if (!isXAxis)
                        elRect = { x: gRect.x, y: Math.min(from, to), width: gRect.width, height: diff };

                    if (swapXY) {
                        var tmp = elRect.x;
                        elRect.x = elRect.y;
                        elRect.y = tmp;

                        tmp = elRect.width;
                        elRect.width = elRect.height;
                        elRect.height = tmp;
                    }

                    if (diff == 0 || diff == 1) {
                        bandElement = this.renderer.line(
                            $.jqx._ptrnd(elRect.x),
                            $.jqx._ptrnd(elRect.y),
                            $.jqx._ptrnd(elRect.x + (swapXY ? 0 : elRect.width)),
                            $.jqx._ptrnd(elRect.y + (swapXY ? elRect.height : 0))
                            );
                    }
                    else
                        bandElement = this.renderer.rect(elRect.x, elRect.y, elRect.width, elRect.height);
                }

                var fillColor = band.fillColor || band.color || '#AAAAAA';
                var lineColor = band.lineColor || fillColor;
                var lineWidth = band.lineWidth;
                if (isNaN(lineWidth))
                    lineWidth = 1;

                var opacity = band.opacity;
                if (isNaN(opacity) || opacity < 0 || opacity > 1)
                    opacity = 1;

                this.renderer.attr(bandElement, { fill: fillColor, 'fill-opacity': opacity, stroke: lineColor, 'stroke-opacity': opacity, 'stroke-width': lineWidth, 'stroke-dasharray': band.dashStyle });
            } // for
        },

        _getColumnGroupWidth: function (groupIndex, xoffsets, size) {
            var g = this.seriesGroups[groupIndex];
            var isStacked = g.type.indexOf('stacked') != -1;
            var columnsInGroup = isStacked ? 1 : g.series.length;

            var columnGroupsCount = this._getColumnGroupsCount(g.orientation);
            if (isNaN(columnGroupsCount) || 0 == columnGroupsCount)
                columnGroupsCount = 1;

            var availableWidth = xoffsets.rangeLength >= 1 ? xoffsets.itemWidth : size * 0.9;

            var minWidth = g.columnsMinWidth;
            if (isNaN(minWidth))
                minWidth = 1;

            if (!isNaN(g.columnsMaxWidth))
                minWidth = Math.min(g.columnsMaxWidth, minWidth);

            // not all items will fit so try to maximize available width
            if (minWidth > availableWidth && xoffsets.length > 0)
                availableWidth = Math.max(availableWidth, size * 0.9 / xoffsets.length);

            // calculate required width for the group
            // for stacked seires it will be at least the minWidth
            var requiredWidth = minWidth;

            // calculate requiredWidth for non-stacked series
            if (!isStacked) {
                var seriesGap = g.seriesGapPercent;
                if (isNaN(seriesGap) || seriesGap < 0)
                    seriesGap = 10;

                seriesGap /= 100;

                var serieMinWidth = minWidth;
                serieMinWidth *= (1 + seriesGap);

                requiredWidth += g.series.length * serieMinWidth;
            }

            var targetWidth = Math.max(availableWidth / columnGroupsCount, requiredWidth);

            return { requiredWidth: requiredWidth, availableWidth: availableWidth, targetWidth: targetWidth };
        },

        _getColumnSerieWidthAndOffset: function (groupIndex, serieIndex) {
            var group = this.seriesGroups[groupIndex];
            var s = group.series[serieIndex];

            var inverse = group.orientation == 'horizontal';

            var rect = this._plotRect;
            if (inverse)
                rect = { x: rect.y, y: rect.x, width: rect.height, height: rect.width };

            var renderData = this._calcGroupOffsets(groupIndex, rect);
            if (!renderData || renderData.xoffsets.length == 0)
                return;

            var valuesOnTicks = true;

            var columnGroupsCount = this._getColumnGroupsCount(group.orientation);
            if (group.type == 'candlestick' || group.type == 'ohlc')
                columnGroupsCount = 1;

            var relativeGroupIndex = this._getColumnGroupIndex(groupIndex);

            var groupWidth = this._getColumnGroupWidth(groupIndex, renderData.xoffsets, inverse ? rect.height : rect.width);

            var intialOffset = 0;
            var itemWidth = groupWidth.targetWidth;

            if (this.columnSeriesOverlap == true || (Math.round(itemWidth) > Math.round(groupWidth.availableWidth / columnGroupsCount))) {
                columnGroupsCount = 1;
                relativeGroupIndex = 0;
            }

            if (valuesOnTicks)
                intialOffset -= (itemWidth * columnGroupsCount) / 2;

            intialOffset += itemWidth * relativeGroupIndex;

            // get columns gap
            var columnGap = group.columnsGapPercent;

            if (columnGap <= 0)
                columnGap = 0;

            if (isNaN(columnGap) || columnGap >= 100)
                columnGap = 25;

            columnGap /= 100;

            // get item gap size
            var itemGapWidth = itemWidth * columnGap;

            if (itemGapWidth + groupWidth.requiredWidth > groupWidth.targetWidth)
                itemGapWidth = Math.max(0, groupWidth.targetWidth - groupWidth.requiredWidth);

            if (Math.round(itemWidth) > Math.round(groupWidth.availableWidth))
                itemGapWidth = 0;

            itemWidth -= itemGapWidth;

            intialOffset += itemGapWidth / 2;

            // get serie gap
            var seriesGap = group.seriesGapPercent;
            if (isNaN(seriesGap) || seriesGap < 0)
                seriesGap = 10;

            var isStacked = group.type.indexOf('stacked') != -1;

            // get width per serie
            var serieWidth = itemWidth;
            if (!isStacked)
                serieWidth /= group.series.length;

            // calculate serie gap
            var serieSpace = this._get([group.seriesGap, (itemWidth * seriesGap / 100) / (group.series.length - 1)]);
            if (group.polar == true || group.spider == true || isStacked || group.series.length <= 1)
                serieSpace = 0;

            var spacesSum = serieSpace * (group.series.length - 1);
            if (group.series.length > 1 && spacesSum > itemWidth - group.series.length * 1) {
                spacesSum = itemWidth - group.series.length * 1;
                serieSpace = spacesSum / Math.max(1, (group.series.length - 1));
            }

            // get columnWidth
            var columnWidth = serieWidth - (spacesSum / group.series.length);

            // adjust for max width
            var columnMaxAdj = 0;

            var columnsMaxWidth = group.columnsMaxWidth;
            if (!isNaN(columnsMaxWidth)) {
                if (columnWidth > columnsMaxWidth) {
                    columnMaxAdj = columnWidth - columnsMaxWidth;
                    columnWidth = columnsMaxWidth;
                }
            }

            // final horizontal adjustment
            var columnAdj = columnMaxAdj / 2;

            // get relative serie position
            var seriePos = 0;

            if (!isStacked) {
                var firstPos = (itemWidth - (columnWidth * group.series.length) - spacesSum) / 2;
                var spacesBeforeSerie = Math.max(0, serieIndex);
                seriePos = firstPos + columnWidth * serieIndex + spacesBeforeSerie * serieSpace;
            }
            else {
                seriePos = columnMaxAdj / 2;
            }

            return { width: columnWidth, offset: intialOffset + seriePos };
        },

        /** @private */
        _renderColumnSeries: function (groupIndex, rect) {
            var group = this.seriesGroups[groupIndex];
            if (!group.series || group.series.length == 0)
                return;

            var dataLength = this._getDataLen(groupIndex);

            var inverse = group.orientation == 'horizontal';

            var gRect = rect;
            if (inverse)
                gRect = { x: rect.y, y: rect.x, width: rect.height, height: rect.width };

            var renderData = this._calcGroupOffsets(groupIndex, gRect);
            if (!renderData || renderData.xoffsets.length == 0)
                return;

            var polarAxisCoords;
            if (group.polar == true || group.spider == true) {
                polarAxisCoords = this._getPolarAxisCoords(groupIndex, gRect);
            }

            var ctx = { groupIndex: groupIndex, rect: rect, vertical: !inverse, seriesCtx: [], renderData: renderData, polarAxisCoords: polarAxisCoords };
            ctx.columnGroupWidth = this._getColumnGroupWidth(groupIndex, renderData.xoffsets, inverse ? gRect.height : gRect.width);

            var gradientType = this._getGroupGradientType(groupIndex);

            for (var sidx = 0; sidx < group.series.length; sidx++) {
                var s = group.series[sidx];
                if (s.customDraw)
                    continue;

                var dataField = s.dataField;

                var anim = this._getAnimProps(groupIndex, sidx);
                var duration = anim.enabled && !this._isToggleRefresh && renderData.xoffsets.length < 100 ? anim.duration : 0;

                // Calculate horizontal adjustment
                var columnWidthAndOffset = this._getColumnSerieWidthAndOffset(groupIndex, sidx);

                var isVisible = this._isSerieVisible(groupIndex, sidx);

                var serieSettings = this._getSerieSettings(groupIndex, sidx);
                var serieColors = this._getColors(groupIndex, sidx, NaN, this._getGroupGradientType(groupIndex), 4);

                var itemsColors = [];
                if ($.isFunction(s.colorFunction) && !polarAxisCoords) {
                    for (var i = renderData.xoffsets.first; i <= renderData.xoffsets.last; i++)
                        itemsColors.push(this._getColors(groupIndex, sidx, i, gradientType, 4));
                }

                var serieCtx = {
                    seriesIndex: sidx,
                    serieColors: serieColors,
                    itemsColors: itemsColors,
                    settings: serieSettings,
                    columnWidth: columnWidthAndOffset.width,
                    xAdjust: columnWidthAndOffset.offset,
                    isVisible: isVisible
                };

                ctx.seriesCtx.push(serieCtx);
            }

            this._animColumns(ctx, duration == 0 ? 1 : 0);

            var self = this;
            this._enqueueAnimation(
                        "series",
                        undefined,
                        undefined,
                        duration,
                        function (element, ctx, percent) {
                            self._animColumns(ctx, percent);
                        },
                        ctx);
        },

        _getPercent: function (value, defValue, minValue, maxValue) {
            if (isNaN(value))
                value = defValue;

            if (!isNaN(minValue) && !isNaN(value) && value < minValue)
                value = minValue;

            if (!isNaN(maxValue) && !isNaN(value) && value > maxValue)
                value = maxValue;

            if (isNaN(value))
                return NaN;

            return value;
        },

        /** @private */
        _getColumnVOffsets: function (renderData, groupIndex, seriesCtx, itemIndex, isStacked, percent) {
            var group = this.seriesGroups[groupIndex];

            var columnsTopWidthPercent = this._getPercent(group.columnsTopWidthPercent, 100, 0, 100);
            var columnsBottomWidthPercent = this._getPercent(group.columnsBottomWidthPercent, 100, 0, 100);

            if (columnsTopWidthPercent == 0 && columnsBottomWidthPercent == 0)
                columnsBottomWidthPercent = 100;

            var neckHeightPercent = this._getPercent(group.columnsNeckHeightPercent, NaN, 0, 100) / 100;
            var neckWidthPercent = this._getPercent(group.columnsNeckWidthPercent, 100, 0, 100) / 100;

            var offsets = [];

            var prevTo = NaN;
            for (var iSerie = 0; iSerie < seriesCtx.length; iSerie++) {
                var serieCtx = seriesCtx[iSerie];
                var sidx = serieCtx.seriesIndex;
                var s = group.series[sidx];

                var from = renderData.offsets[sidx][itemIndex].from;
                var to = renderData.offsets[sidx][itemIndex].to;
                var xOffset = renderData.xoffsets.data[itemIndex];

                var itemStartState;

                var isVisible = serieCtx.isVisible;
                if (!isVisible)
                    to = from;

                var elementRenderInfo = this._elementRenderInfo;
                if (isVisible &&
                    elementRenderInfo &&
                    elementRenderInfo.length > groupIndex &&
                    elementRenderInfo[groupIndex].series.length > sidx
                    ) {
                    var xvalue = renderData.xoffsets.xvalues[itemIndex];
                    itemStartState = elementRenderInfo[groupIndex].series[sidx][xvalue];
                    if (itemStartState && !isNaN(itemStartState.from) && !isNaN(itemStartState.to)) {
                        from = itemStartState.from + (from - itemStartState.from) * percent;
                        to = itemStartState.to + (to - itemStartState.to) * percent;
                        xOffset = itemStartState.xoffset + (xOffset - itemStartState.xoffset) * percent;
                    }
                }

                if (!itemStartState)
                    to = from + (to - from) * (isStacked ? 1 : percent);

                if (isNaN(from))
                    from = isNaN(prevTo) ? renderData.baseOffset : prevTo;

                if (!isNaN(to) && isStacked)
                    prevTo = to;
                else
                    prevTo = from;

                if (isNaN(to))
                    to = from;

                var item = { from: from, to: to, xOffset: xOffset };
                if (columnsTopWidthPercent != 100 || columnsBottomWidthPercent != 100) {
                    item.funnel = true;
                    item.toWidthPercent = columnsTopWidthPercent;
                    item.fromWidthPercent = columnsBottomWidthPercent;
                }

                offsets.push(item);
            }

            if (isStacked && offsets.length > 1 && !(this._elementRenderInfo && this._elementRenderInfo.length > groupIndex)) {
                var sumP = 0, sumN = 0, minP = -Infinity, maxP = Infinity, minN = Infinity, maxN = -Infinity;
                for (var i = 0; i < offsets.length; i++) {
                    var serieCtx = seriesCtx[i];
                    if (serieCtx.isVisible) {
                        if (offsets[i].to >= offsets[i].from) {
                            sumN += offsets[i].to - offsets[i].from;

                            minN = Math.min(minN, offsets[i].from);
                            maxN = Math.max(maxN, offsets[i].to);
                        }
                        else {
                            sumP += offsets[i].from - offsets[i].to;

                            minP = Math.max(minP, offsets[i].from);
                            maxP = Math.min(maxP, offsets[i].to);
                        }
                    }
                }

                var sumPSave = sumP;
                var sumNSave = sumN;

                sumP *= percent;
                sumN *= percent;

                var curP = 0, curN = 0;
                for (var i = 0; i < offsets.length; i++) {
                    if (offsets[i].to >= offsets[i].from) {
                        var diff = offsets[i].to - offsets[i].from;
                        if (diff + curN > sumN) {
                            diff = Math.max(0, sumN - curN);
                            offsets[i].to = offsets[i].from + diff;
                        }

                        if (columnsTopWidthPercent != 100 || columnsBottomWidthPercent != 100) {
                            offsets[i].funnel = true;

                            if (!isNaN(neckHeightPercent) && sumNSave * neckHeightPercent >= curN)
                                offsets[i].fromWidthPercent = neckWidthPercent * 100;
                            else
                                offsets[i].fromWidthPercent = (Math.abs(offsets[i].from - minN) / sumNSave) * (columnsTopWidthPercent - columnsBottomWidthPercent) + columnsBottomWidthPercent;

                            if (!isNaN(neckHeightPercent) && sumNSave * neckHeightPercent >= (0 + (curN + diff)))
                                offsets[i].toWidthPercent = neckWidthPercent * 100;
                            else
                                offsets[i].toWidthPercent = (Math.abs(offsets[i].to - minN) / sumNSave) * (columnsTopWidthPercent - columnsBottomWidthPercent) + columnsBottomWidthPercent;
                        }

                        curN += diff;
                    }
                    else {
                        var diff = offsets[i].from - offsets[i].to;
                        if (diff + curP > sumP) {
                            diff = Math.max(0, sumP - curP);
                            offsets[i].to = offsets[i].from - diff;
                        }

                        if (columnsTopWidthPercent != 100 || columnsBottomWidthPercent != 100) {
                            offsets[i].funnel = true;

                            if (!isNaN(neckHeightPercent) && sumPSave * neckHeightPercent >= curP)
                                offsets[i].fromWidthPercent = neckWidthPercent * 100;
                            else
                                offsets[i].fromWidthPercent = (Math.abs(offsets[i].from - minP) / sumPSave) * (columnsTopWidthPercent - columnsBottomWidthPercent) + columnsBottomWidthPercent;

                            if (!isNaN(neckHeightPercent) && sumPSave * neckHeightPercent >= (0 + (curP + diff)))
                                offsets[i].toWidthPercent = neckWidthPercent * 100;
                            else
                                offsets[i].toWidthPercent = (Math.abs(offsets[i].to - minP) / sumPSave) * (columnsTopWidthPercent - columnsBottomWidthPercent) + columnsBottomWidthPercent;
                        }

                        curP += diff;
                    }
                }
            }

            return offsets;
        },

        /** @private */
        _columnAsPieSlice: function (elementInfo, plotRect, polarAxisCoords, columnRect) {
            var pointOuter = this._toPolarCoord(polarAxisCoords, plotRect, columnRect.x, columnRect.y);
            var pointInner = this._toPolarCoord(polarAxisCoords, plotRect, columnRect.x, columnRect.y + columnRect.height);

            var innerRadius = $.jqx._ptdist(polarAxisCoords.x, polarAxisCoords.y, pointInner.x, pointInner.y);
            var outerRadius = $.jqx._ptdist(polarAxisCoords.x, polarAxisCoords.y, pointOuter.x, pointOuter.y);
            var width = plotRect.width;

            var angleRange = Math.abs(polarAxisCoords.startAngle - polarAxisCoords.endAngle) * 180 / Math.PI;

            var toAngle = -((columnRect.x - plotRect.x) * angleRange) / width;
            var fromAngle = -((columnRect.x + columnRect.width - plotRect.x) * angleRange) / width;

            var startAngle = polarAxisCoords.startAngle;
            startAngle = 360 * startAngle / (Math.PI * 2);

            toAngle -= startAngle;
            fromAngle -= startAngle;

            if (elementInfo) {
                if (elementInfo.element != undefined) {
                    var cmd = this.renderer.pieSlicePath(polarAxisCoords.x, polarAxisCoords.y, innerRadius, outerRadius, fromAngle, toAngle, 0);
                    cmd += ' Z';
                    this.renderer.attr(elementInfo.element, { 'd': cmd });
                }
                else {
                    elementInfo.element = this.renderer.pieslice(
                                        polarAxisCoords.x,
                                        polarAxisCoords.y,
                                        innerRadius,
                                        outerRadius,
                                        fromAngle,
                                        toAngle,
                                        0);
                }
            }

            return { fromAngle: fromAngle, toAngle: toAngle, innerRadius: innerRadius, outerRadius: outerRadius };
        },

        _setRenderInfo: function (groupIndex, serieIndex, itemIndex, elementInfo) {
            this._renderData[groupIndex].offsets[serieIndex][itemIndex].elementInfo = elementInfo;
        },

        _getRenderInfo: function (groupIndex, serieIndex, itemIndex) {
            return this._renderData[groupIndex].offsets[serieIndex][itemIndex].elementInfo || {};
        },

        /** @private */
        _animColumns: function (context, percent) {
            var self = this;

            var gidx = context.groupIndex;
            var group = this.seriesGroups[gidx];
            var renderData = context.renderData;
            var isWaterfall = group.type.indexOf('waterfall') != -1;
            var xAxis = this._getXAxis(gidx);

            var isStacked = group.type.indexOf('stacked') != -1;

            var polarAxisCoords = context.polarAxisCoords;

            var gradientType = this._getGroupGradientType(gidx);

            var columnWidth = context.columnGroupWidth.targetWidth;

            var firstVisibleSerie = -1;
            for (var j = 0; j < group.series.length; j++) {
                if (this._isSerieVisible(gidx, j)) {
                    firstVisibleSerie = j;
                    break;
                }
            }

            var minPos = NaN, maxPos = NaN;
            for (var j = 0; j < context.seriesCtx.length; j++) {
                var serieCtx = context.seriesCtx[j];
                if (isNaN(minPos) || minPos > serieCtx.xAdjust)
                    minPos = serieCtx.xAdjust;
                if (isNaN(maxPos) || maxPos < serieCtx.xAdjust + serieCtx.columnWidth)
                    maxPos = serieCtx.xAdjust + serieCtx.columnWidth;
            }

            var realGroupWidth = Math.abs(maxPos - minPos);
            var gapPercent = this._get([group.columnsGapPercent, 25]) / 100;
            if (isNaN(gapPercent) < 0 || gapPercent >= 1)
                gapPercent = 0.25;

            var realGroupGapWidth = gapPercent * realGroupWidth;

            var xoffsets = context.renderData.xoffsets;

            var xPrev = -1;

            var yWaterfallPrev = {};

            // skipOverlappingPoints is off by default in column series
            var skipOverlappingPoints = group.skipOverlappingPoints == true;

            for (var i = xoffsets.first; i <= xoffsets.last; i++) {
                var x = xoffsets.data[i];
                if (isNaN(x))
                    continue;

                if (xPrev != -1 && Math.abs(x - xPrev) < (realGroupWidth - 1 + realGroupGapWidth) && skipOverlappingPoints)
                    continue;
                else
                    xPrev = x;

                var offsets = this._getColumnVOffsets(renderData, gidx, context.seriesCtx, i, isStacked, percent);

                var isSummary = false;

                if (isWaterfall) {
                    for (var iSerie = 0; iSerie < group.series.length; iSerie++) {
                        if (group.series[iSerie].summary && xoffsets.xvalues[i][group.series[iSerie].summary])
                            isSummary = true;
                    }
                }

                for (var iSerie = 0; iSerie < context.seriesCtx.length; iSerie++) {
                    var serieCtx = context.seriesCtx[iSerie];
                    var sidx = serieCtx.seriesIndex;
                    var serie = group.series[sidx];

                    var from = offsets[iSerie].from;
                    var to = offsets[iSerie].to;
                    var xOffset = offsets[iSerie].xOffset;

                    var startOffset = (context.vertical ? context.rect.x : context.rect.y) + serieCtx.xAdjust;

                    var settings = serieCtx.settings;
                    var colors = serieCtx.itemsColors.length != 0 ? serieCtx.itemsColors[i - renderData.xoffsets.first] : serieCtx.serieColors;

                    var isVisible = this._isSerieVisible(gidx, sidx);

                    if (!isVisible /*&& !isStacked*/)
                        continue;

                    var x = $.jqx._ptrnd(startOffset + xOffset);

                    var rect = { x: x, width: serieCtx.columnWidth };

                    if (offsets[iSerie].funnel) {
                        rect.fromWidthPercent = offsets[iSerie].fromWidthPercent;
                        rect.toWidthPercent = offsets[iSerie].toWidthPercent;
                    }

                    var isInverseDirection = true;

                    if (context.vertical) {
                        rect.y = from;
                        rect.height = to - from;
                        if (rect.height < 0) {
                            rect.y += rect.height;
                            rect.height = -rect.height;
                            isInverseDirection = false;
                        }
                    }
                    else {
                        rect.x = from < to ? from : to;
                        rect.width = Math.abs(from - to);
                        isInverseDirection = from - to < 0;
                        rect.y = x;
                        rect.height = serieCtx.columnWidth;
                    }

                    var size = from - to;
                    if (isNaN(size))
                        continue;

                    size = Math.abs(size);

                    var pieSliceInfo = undefined;

                    var elementRenderInfo = self._getRenderInfo(gidx, sidx, i);
                    var element = elementRenderInfo.element;
                    var labelElement = elementRenderInfo.labelElement;
                    var isNewElement = element == undefined;

                    if (labelElement) {
                        self.renderer.removeElement(labelElement);
                        labelElement = undefined;
                    }

                    if (!polarAxisCoords) {
                        if (offsets[iSerie].funnel) // funnel or pyramid
                        {
                            var path = this._getTrapezoidPath($.extend({}, rect), context.vertical, isInverseDirection);
                            if (isNewElement)
                                element = this.renderer.path(path, {});
                            else
                                this.renderer.attr(element, { d: path });
                        }
                        else { // regular column
                            if (isNewElement) {
                                element = this.renderer.rect(rect.x, rect.y, context.vertical ? rect.width : 0, context.vertical ? 0 : rect.height);
                            }
                            else {
                                if (context.vertical == true)
                                    this.renderer.attr(element, { x: rect.x, y: rect.y, height: size });
                                else
                                    this.renderer.attr(element, { x: rect.x, y: rect.y, width: size });
                            }
                        }
                    }
                    else // column on polar axis
                    {
                        var elementInfo = { element: element };
                        pieSliceInfo = this._columnAsPieSlice(elementInfo, context.rect, polarAxisCoords, rect);
                        element = elementInfo.element;

                        var colors = this._getColors(gidx, sidx, undefined, 'radialGradient', pieSliceInfo.outerRadius);
                    }

                    if (size < 1 && (percent != 1 || polarAxisCoords))
                        this.renderer.attr(element, { display: 'none' });
                    else
                        this.renderer.attr(element, { display: 'block' });

                    if (isNewElement)
                        this.renderer.attr(element, { fill: colors.fillColor, 'fill-opacity': settings.opacity, 'stroke-opacity': settings.opacity, stroke: colors.lineColor, 'stroke-width': settings.stroke, 'stroke-dasharray': settings.dashStyle });

                    if (labelElement)
                        this.renderer.removeElement(labelElement);

                    if (!isVisible || (size == 0 && percent < 1)) {
                        elementRenderInfo = { element: element, labelElement: labelElement };
                        self._setRenderInfo(gidx, sidx, i, elementRenderInfo);
                        continue;
                    }

                    /// Waterfall start
                    if (isWaterfall && this._get([serie.showWaterfallLines, group.showWaterfallLines]) != false) {
                        if (!isStacked || (isStacked && iSerie == firstVisibleSerie)) {
                            var serieKey = isStacked ? -1 : iSerie;
                            if (percent == 1 && !isNaN(renderData.offsets[iSerie][i].from) && !isNaN(renderData.offsets[iSerie][i].to)) {
                                var prevWFInfo = yWaterfallPrev[serieKey];
                                if (prevWFInfo != undefined) {

                                    var p1 =
                                    {
                                        x: prevWFInfo.x,
                                        y: $.jqx._ptrnd(prevWFInfo.y)
                                    };

                                    var p2 = {
                                        x: x,
                                        y: p1.y
                                    };

                                    var topWP = group.columnsTopWidthPercent / 100;
                                    if (isNaN(topWP))
                                        topWP = 1;
                                    else if (topWP > 1 || topWP < 0)
                                        topWP = 1;

                                    var bottomWP = group.columnsBottomWidthPercent / 100;
                                    if (isNaN(bottomWP))
                                        bottomWP = 1;
                                    else if (bottomWP > 1 || bottomWP < 0)
                                        bottomWP = 1;

                                    var sz = context.vertical ? rect.width : rect.height;

                                    p1.x = p1.x - sz / 2 + sz / 2 * topWP;

                                    if (isSummary) {
                                        var adj = sz * topWP / 2;
                                        p2.x = p2.x + sz / 2 - (xAxis.flip ? -adj : adj);
                                    }
                                    else {
                                        var adj = sz * bottomWP / 2;
                                        p2.x = p2.x + sz / 2 - (xAxis.flip ? -adj : adj);
                                    }

                                    if (!context.vertical) {
                                        this._swapXY([p1]);
                                        this._swapXY([p2]);
                                    }

                                    this.renderer.line(
                                        p1.x,
                                        p1.y,
                                        p2.x,
                                        p2.y,
                                        {
                                            stroke: prevWFInfo.color,
                                            'stroke-width': settings.stroke,
                                            'stroke-opacity': settings.opacity,
                                            'fill-opacity': settings.opacity,
                                            'stroke-dasharray': settings.dashStyle
                                        }
                                    );
                                }
                            }
                        }

                        if (percent == 1 && size != 0) {
                            yWaterfallPrev[isStacked ? -1 : iSerie] = { y: to, x: (context.vertical ? rect.x + rect.width : rect.y + rect.height), color: colors.lineColor };
                        }
                    }
                    // Waterfall end

                    if (polarAxisCoords) {
                        var pointOuter = this._toPolarCoord(polarAxisCoords, context.rect, rect.x + rect.width / 2, rect.y);
                        var sz = this._showLabel(gidx, sidx, i, rect, undefined, undefined, true);
                        var labelRadius = pieSliceInfo.outerRadius + 10;

                        labelOffset = this._adjustTextBoxPosition(
                            polarAxisCoords.x,
                            polarAxisCoords.y,
                            sz,
                            labelRadius,
                            (pieSliceInfo.fromAngle + pieSliceInfo.toAngle) / 2,
                            true,
                            false,
                            false
                            );

                        labelElement = this._showLabel(gidx, sidx, i, { x: labelOffset.x, y: labelOffset.y }, undefined, undefined, false, false, false);
                    }
                    else {
                        labelElement = this._showLabel(gidx, sidx, i, rect, undefined, undefined, false, false, isInverseDirection);
                    }

                    elementRenderInfo = { element: element, labelElement: labelElement };
                    self._setRenderInfo(gidx, sidx, i, elementRenderInfo);

                    if (percent == 1.0) {
                        this._installHandlers(element, 'column', gidx, sidx, i);
                    }
                }
            }
        },

        _getTrapezoidPath: function (rect, isVertical, isInverseDirection) {
            var path = '';

            var fromP = rect.fromWidthPercent / 100;
            var toP = rect.toWidthPercent / 100;

            if (!isVertical) {
                var tmp = rect.width;
                rect.width = rect.height;
                rect.height = tmp;
                tmp = rect.x;
                rect.x = rect.y;
                rect.y = tmp;
            }

            var x = rect.x + rect.width / 2;

            var points = [
                { x: x - rect.width * (!isInverseDirection ? fromP : toP) / 2, y: rect.y + rect.height },
                { x: x - rect.width * (!isInverseDirection ? toP : fromP) / 2, y: rect.y },
                { x: x + rect.width * (!isInverseDirection ? toP : fromP) / 2, y: rect.y },
                { x: x + rect.width * (!isInverseDirection ? fromP : toP) / 2, y: rect.y + rect.height }
            ];

            if (!isVertical)
                this._swapXY(points);

            path += 'M ' + $.jqx._ptrnd(points[0].x) + "," + $.jqx._ptrnd(points[0].y);

            for (var i = 1; i < points.length; i++)
                path += ' L ' + $.jqx._ptrnd(points[i].x) + ',' + $.jqx._ptrnd(points[i].y);

            path += ' Z';

            return path;
        },

        _swapXY: function (points) {
            for (var i = 0; i < points.length; i++) {
                var tmp = points[i].x;
                points[i].x = points[i].y;
                points[i].y = tmp;
            }
        },

        /** @private */
        _renderCandleStickSeries: function (groupIndex, rect, isOHLC) {
            var self = this;
            var group = self.seriesGroups[groupIndex];
            if (!group.series || group.series.length == 0)
                return;

            var inverse = group.orientation == 'horizontal';

            var gRect = rect;
            if (inverse)
                gRect = { x: rect.y, y: rect.x, width: rect.height, height: rect.width };

            var renderData = self._calcGroupOffsets(groupIndex, gRect);

            if (!renderData || renderData.xoffsets.length == 0)
                return;

            var scaleWidth = gRect.width;

            var polarAxisCoords;
            if (group.polar || group.spider) {
                polarAxisCoords = self._getPolarAxisCoords(groupIndex, gRect);
                scaleWidth = 2 * polarAxisCoords.r;
            }

            var valuesOnTicks = self._alignValuesWithTicks(groupIndex);

            var gradientType = self._getGroupGradientType(groupIndex);

            var columnsInfo = [];
            for (var sidx = 0; sidx < group.series.length; sidx++)
                columnsInfo[sidx] = self._getColumnSerieWidthAndOffset(groupIndex, sidx);

            for (var sidx = 0; sidx < group.series.length; sidx++) {
                if (!this._isSerieVisible(groupIndex, sidx))
                    continue;

                var settings = self._getSerieSettings(groupIndex, sidx);

                var s = group.series[sidx];
                if (s.customDraw)
                    continue;

                var colors = $.isFunction(s.colorFunction) ? undefined : self._getColors(groupIndex, sidx, NaN, gradientType);

                var ctx = {
                    rect: rect,
                    inverse: inverse,
                    groupIndex: groupIndex,
                    seriesIndex: sidx,
                    symbolType: s.symbolType,
                    symbolSize: s.symbolSize,
                    'fill-opacity': settings.opacity,
                    'stroke-opacity': settings.opacity,
                    'stroke-width': settings.stroke,
                    'stroke-dasharray': settings.dashStyle,
                    gradientType: gradientType,
                    colors: colors,
                    renderData: renderData,
                    polarAxisCoords: polarAxisCoords,
                    columnsInfo: columnsInfo,
                    isOHLC: isOHLC,
                    items: [],
                    self: self
                };

                var anim = self._getAnimProps(groupIndex, sidx);
                var duration = anim.enabled && !self._isToggleRefresh && renderData.xoffsets.length < 5000 ? anim.duration : 0;

                self._animCandleStick(ctx, 0);

                var elem;
                self._enqueueAnimation("series", undefined, undefined, duration,
                        function (undefined, context, percent) {
                            self._animCandleStick(context, percent);
                        }, ctx);
            }
        },

        /** @private */
        _animCandleStick: function (ctx, percent) {
            var fields = ['Open', 'Low', 'Close', 'High'];

            var columnWidth = ctx.columnsInfo[ctx.seriesIndex].width;

            var group = ctx.self.seriesGroups[ctx.groupIndex];
            var xoffsets = ctx.renderData.xoffsets;

            var xPrev = -1;

            var xRange = Math.abs(xoffsets.data[xoffsets.last] - xoffsets.data[xoffsets.first]);
            xRange *= percent;

            var minPos = NaN, maxPos = NaN;
            for (var j = 0; j < ctx.columnsInfo.length; j++) {
                var serieCtx = ctx.columnsInfo[j];
                if (isNaN(minPos) || minPos > serieCtx.offset)
                    minPos = serieCtx.offset;
                if (isNaN(maxPos) || maxPos < serieCtx.offset + serieCtx.width)
                    maxPos = serieCtx.offset + serieCtx.width;
            }

            var realGroupWidth = Math.abs(maxPos - minPos);

            // skipOverlappingPoints is on by default in candlestick & OHLC series
            var skipOverlappingPoints = group.skipOverlappingPoints != false;

            for (var i = xoffsets.first; i <= xoffsets.last; i++) {
                var x = xoffsets.data[i];
                if (isNaN(x))
                    continue;

                if (xPrev != -1 && Math.abs(x - xPrev) < realGroupWidth && skipOverlappingPoints)
                    continue;

                // skip drawing elements outside the anim % range
                var xDiff = Math.abs(xoffsets.data[i] - xoffsets.data[xoffsets.first]);
                if (xDiff > xRange)
                    break;

                xPrev = x;

                var item = ctx.items[i] = ctx.items[i] || {};

                for (var j in fields) {
                    var val = ctx.self._getDataValueAsNumber(i, group.series[ctx.seriesIndex]['dataField' + fields[j]], ctx.groupIndex);
                    if (isNaN(val))
                        break;

                    var y = ctx.renderData.offsets[ctx.seriesIndex][i][fields[j]];
                    if (isNaN(y))
                        break;

                    item[fields[j]] = y;
                }

                x += ctx.inverse ? ctx.rect.y : ctx.rect.x;

                if (ctx.polarAxisCoords) {
                    var point = this._toPolarCoord(ctx.polarAxisCoords, this._plotRect, x, y);
                    x = point.x;
                    y = point.y;
                }

                x = $.jqx._ptrnd(x);

                for (var it in fields)
                    item[it] = $.jqx._ptrnd(item[it]);

                var colors = ctx.colors;
                if (!colors)
                    colors = ctx.self._getColors(ctx.groupIndex, ctx.seriesIndex, i, ctx.gradientType);

                if (!ctx.isOHLC) {
                    var lineElement = item.lineElement;

                    if (!lineElement) {
                        lineElement = ctx.inverse ? this.renderer.line(item.Low, x, item.High, x) : this.renderer.line(x, item.Low, x, item.High);
                        this.renderer.attr(lineElement, { fill: colors.fillColor, 'fill-opacity': ctx['fill-opacity'], 'stroke-opacity': ctx['fill-opacity'], stroke: colors.lineColor, 'stroke-width': ctx['stroke-width'], 'stroke-dasharray': ctx['stroke-dasharray'] });
                        item.lineElement = lineElement;
                    }

                    var stickElement = item.stickElement;
                    x -= columnWidth / 2;

                    if (!stickElement) {
                        var fillColor = colors.fillColor;
                        if (item.Close <= item.Open && colors.fillColorAlt)
                            fillColor = colors.fillColorAlt;

                        stickElement = ctx.inverse ?
                            this.renderer.rect(Math.min(item.Open, item.Close), x, Math.abs(item.Close - item.Open), columnWidth) :
                            this.renderer.rect(x, Math.min(item.Open, item.Close), columnWidth, Math.abs(item.Close - item.Open));

                        this.renderer.attr(stickElement, { fill: fillColor, 'fill-opacity': ctx['fill-opacity'], 'stroke-opacity': ctx['fill-opacity'], stroke: colors.lineColor, 'stroke-width': ctx['stroke-width'], 'stroke-dasharray': ctx['stroke-dasharray'] });
                        item.stickElement = stickElement;
                    }

                    if (percent == 1.0)
                        this._installHandlers(stickElement, 'column', ctx.groupIndex, ctx.seriesIndex, i);
                }
                else {
                    var path =
                        'M' + x + ',' + item.Low + ' L' + x + ',' + item.High + ' ' +
                        'M' + (x - columnWidth / 2) + ',' + item.Open + ' L' + x + ',' + item.Open + ' ' +
                        'M' + (x + columnWidth / 2) + ',' + item.Close + ' L' + x + ',' + item.Close;

                    if (ctx.inverse) {
                        path =
                        'M' + item.Low + ',' + x + ' L' + item.High + ',' + x + ' ' +
                        'M' + item.Open + ',' + (x - columnWidth / 2) + ' L' + item.Open + ',' + x + ' ' +
                        'M' + item.Close + ',' + x + ' L' + item.Close + ',' + (x + columnWidth / 2);
                    }

                    var lineElement = item.lineElement;

                    if (!lineElement) {
                        lineElement = this.renderer.path(path, {});
                        this.renderer.attr(lineElement, { fill: colors.fillColor, 'fill-opacity': ctx['fill-opacity'], 'stroke-opacity': ctx['fill-opacity'], stroke: colors.lineColor, 'stroke-width': ctx['stroke-width'], 'stroke-dasharray': ctx['stroke-dasharray'] });
                        item.lineElement = lineElement;
                    } /*
                    else {
                        this.renderer.attr(lineElement, { 'd': path });
                    }*/

                    if (percent == 1.0)
                        this._installHandlers(lineElement, 'column', ctx.groupIndex, ctx.seriesIndex, i);
                }

            } // for
        },


        /** @private */
        _renderScatterSeries: function (groupIndex, rect, valueField) {
            var group = this.seriesGroups[groupIndex];
            if (!group.series || group.series.length == 0)
                return;

            var isBubble = group.type.indexOf('bubble') != -1;

            var inverse = group.orientation == 'horizontal';

            var gRect = rect;
            if (inverse)
                gRect = { x: rect.y, y: rect.x, width: rect.height, height: rect.width };

            var renderData = this._calcGroupOffsets(groupIndex, gRect);

            if (!renderData || renderData.xoffsets.length == 0)
                return;

            var scaleWidth = gRect.width;

            var polarAxisCoords;
            if (group.polar || group.spider) {
                polarAxisCoords = this._getPolarAxisCoords(groupIndex, gRect);
                scaleWidth = 2 * polarAxisCoords.r;
            }

            var valuesOnTicks = this._alignValuesWithTicks(groupIndex);

            var gradientType = this._getGroupGradientType(groupIndex);

            if (!valueField)
                valueField = 'to';

            for (var sidx = 0; sidx < group.series.length; sidx++) {
                var settings = this._getSerieSettings(groupIndex, sidx);

                var s = group.series[sidx];
                if (s.customDraw)
                    continue;

                var dataField = s.dataField;

                var hasColorFunction = $.isFunction(s.colorFunction);

                var colors = this._getColors(groupIndex, sidx, NaN, gradientType);

                var min = NaN, max = NaN;
                if (isBubble) {
                    for (var i = renderData.xoffsets.first; i <= renderData.xoffsets.last; i++) {
                        var val = this._getDataValueAsNumber(i, (s.radiusDataField || s.sizeDataField), groupIndex);
                        if (typeof (val) != 'number')
                            throw 'Invalid radiusDataField value at [' + i + ']';

                        if (!isNaN(val)) {
                            if (isNaN(min) || val < min)
                                min = val;
                            if (isNaN(max) || val > max)
                                max = val;
                        }
                    }
                }

                var minRadius = s.minRadius || s.minSymbolSize;
                if (isNaN(minRadius))
                    minRadius = scaleWidth / 50;

                var maxRadius = s.maxRadius || s.maxSymbolSize;
                if (isNaN(maxRadius))
                    maxRadius = scaleWidth / 25;

                if (minRadius > maxRadius)
                    maxRadius = minRadius;

                var radius = s.radius;
                if (isNaN(radius) && !isNaN(s.symbolSize)) {
                    radius = (s.symbolType == 'circle') ? s.symbolSize / 2 : s.symbolSize;
                }
                else
                    radius = 5;

                var anim = this._getAnimProps(groupIndex, sidx);
                var duration = anim.enabled && !this._isToggleRefresh && renderData.xoffsets.length < 5000 ? anim.duration : 0;

                var ctx = {
                    groupIndex: groupIndex,
                    seriesIndex: sidx,
                    symbolType: s.symbolType,
                    symbolSize: s.symbolSize,
                    'fill-opacity': settings.opacity,
                    'stroke-opacity': settings.opacity,
                    'stroke-width': settings.stroke,
                    'stroke-width-symbol': settings.strokeSymbol,
                    'stroke-dasharray': settings.dashStyle,
                    items: [],
                    polarAxisCoords: polarAxisCoords
                };

                var ptSave = undefined;

                for (var i = renderData.xoffsets.first; i <= renderData.xoffsets.last; i++) {
                    var val = this._getDataValueAsNumber(i, dataField, groupIndex);
                    if (typeof (val) != 'number')
                        continue;

                    var x = renderData.xoffsets.data[i];
                    var xvalue = renderData.xoffsets.xvalues[i];
                    var y = renderData.offsets[sidx][i][valueField];

                    if (y < gRect.y || y > gRect.y + gRect.height)
                        continue;

                    if (isNaN(x) || isNaN(y))
                        continue;

                    if (inverse) {
                        var tmp = x;
                        x = y;
                        y = tmp + rect.y;
                    }
                    else {
                        x += rect.x;
                    }

                    if (!hasColorFunction && ptSave && this.enableSampling && $.jqx._ptdist(ptSave.x, ptSave.y, x, y) < 1)
                        continue;

                    ptSave = { x: x, y: y };

                    var r = radius;
                    if (isBubble) {
                        var rval = this._getDataValueAsNumber(i, (s.radiusDataField || s.sizeDataField), groupIndex);
                        if (typeof (rval) != 'number')
                            continue;
                        r = minRadius + (maxRadius - minRadius) * (rval - min) / Math.max(1, max - min);
                        if (isNaN(r))
                            r = minRadius;
                    }

                    renderData.offsets[sidx][i].radius = r;

                    var yOld = NaN, xOld = NaN;
                    var rOld = 0;
                    var elementRenderInfo = this._elementRenderInfo;
                    if (xvalue != undefined &&
                        elementRenderInfo &&
                        elementRenderInfo.length > groupIndex &&
                        elementRenderInfo[groupIndex].series.length > sidx
                        ) {
                        var itemStartState = elementRenderInfo[groupIndex].series[sidx][xvalue];
                        if (itemStartState && !isNaN(itemStartState.to)) {
                            yOld = itemStartState.to;
                            xOld = itemStartState.xoffset;
                            rOld = radius;

                            if (inverse) {
                                var tmp = xOld;
                                xOld = yOld;
                                yOld = tmp + rect.y;
                            }
                            else {
                                xOld += rect.x;
                            }

                            if (isBubble) {
                                rOld = minRadius + (maxRadius - minRadius) * (itemStartState.valueRadius - min) / Math.max(1, max - min);
                                if (isNaN(rOld))
                                    rOld = minRadius;
                            }
                        }
                    }


                    if (hasColorFunction)
                        colors = this._getColors(groupIndex, sidx, i, gradientType);

                    ctx.items.push({
                        from: rOld,
                        to: r,
                        itemIndex: i,
                        fill: colors.fillColor,
                        stroke: colors.lineColor,
                        x: x,
                        y: y,
                        xFrom: xOld,
                        yFrom: yOld
                    });
                } // i

                this._animR(ctx, 0);

                var self = this;
                var elem;
                this._enqueueAnimation("series", undefined, undefined, duration,
                        function (undefined, context, percent) {
                            self._animR(context, percent);
                        }, ctx);
            }
        },

        /** @private */
        _animR: function (ctx, percent) {
            var items = ctx.items;

            var symbolType = ctx.symbolType || 'circle';
            var symbolSize = ctx.symbolSize;

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var x = item.x;
                var y = item.y;

                var r = Math.round((item.to - item.from) * percent + item.from);
                if (!isNaN(item.yFrom))
                    y = item.yFrom + (y - item.yFrom) * percent;
                if (!isNaN(item.xFrom))
                    x = item.xFrom + (x - item.xFrom) * percent;

                if (ctx.polarAxisCoords) {
                    var point = this._toPolarCoord(ctx.polarAxisCoords, this._plotRect, x, y);
                    x = point.x;
                    y = point.y;
                }

                x = $.jqx._ptrnd(x);
                y = $.jqx._ptrnd(y);
                r = $.jqx._ptrnd(r);

                var elementRenderInfo = this._getRenderInfo(ctx.groupIndex, ctx.seriesIndex, items[i].itemIndex);
                var element = elementRenderInfo.element;
                var labelElement = elementRenderInfo.labelElement;

                if (symbolType == 'circle') {
                    if (!element) {
                        element = this.renderer.circle(x, y, r);
                        this.renderer.attr(element, { fill: item.fill, 'fill-opacity': ctx['fill-opacity'], 'stroke-opacity': ctx['fill-opacity'], stroke: item.stroke, 'stroke-width': ctx['stroke-width'], 'stroke-dasharray': ctx['stroke-dasharray'] });
                    }

                    if (this._isVML) {
                        this.renderer.updateCircle(element, undefined, undefined, r);
                    }
                    else {
                        this.renderer.attr(element, { r: r, cy: y, cx: x });
                    }
                }
                else {
                    if (element)
                        this.renderer.removeElement(element);

                    element = this._drawSymbol(
                        symbolType,
                        x,
                        y,
                        item.fill,
                        ctx['fill-opacity'],
                        item.stroke,
                        ctx['stroke-opacity'] || ctx['fill-opacity'],
                        ctx['stroke-width-symbol'],
                        ctx['stroke-dasharray'],
                        symbolSize || r);
                }

                if (labelElement)
                    this.renderer.removeElement(labelElement);

                labelElement = this._showLabel(ctx.groupIndex, ctx.seriesIndex, item.itemIndex, { x: x - r, y: y - r, width: 2 * r, height: 2 * r });

                if (percent >= 1)
                    this._installHandlers(element, 'circle', ctx.groupIndex, ctx.seriesIndex, item.itemIndex);

                this._setRenderInfo(ctx.groupIndex, ctx.seriesIndex, items[i].itemIndex, { element: element, labelElement: labelElement });
            }
        },

        /** @private */
        _showToolTip: function (x, y, gidx, sidx, iidx) {
            var self = this;
            var xAxis = self._getXAxis(gidx);
            var yAxis = self._getValueAxis(gidx);

            if (self._ttEl &&
                gidx == self._ttEl.gidx &&
                sidx == self._ttEl.sidx &&
                iidx == self._ttEl.iidx)
                return;

            var group = self.seriesGroups[gidx];
            var series = group.series[sidx];

            var enableCrosshairs = self.enableCrosshairs; // && !(group.polar || group.spider);

            if (self._pointMarker) {
                // make it relative to the marker instead of cursor
                x = parseInt(self._pointMarker.x + 5);
                y = parseInt(self._pointMarker.y - 5);
            }
            else {
                enableCrosshairs = false;
            }

            var isCrossHairsOnly = enableCrosshairs && self.showToolTips == false;


            x = $.jqx._ptrnd(x);
            y = $.jqx._ptrnd(y);

            var isNew = self._ttEl == undefined;

            if (group.showToolTips == false || series.showToolTips == false)
                return;

            var valfs = self._get([series.toolTipFormatSettings, group.toolTipFormatSettings, yAxis.toolTipFormatSettings, self.toolTipFormatSettings]);
            var valff = self._get([series.toolTipFormatFunction, group.toolTipFormatFunction, yAxis.toolTipFormatFunction, self.toolTipFormatFunction]);

            var colors = self._getColors(gidx, sidx, iidx);

            var xAxisValue = self._getDataValue(iidx, xAxis.dataField, gidx);
            if (xAxis.dataField == undefined || xAxis.dataField == '')
                xAxisValue = iidx;
            if (xAxis.type == 'date')
                xAxisValue = self._castAsDate(xAxisValue, (valfs ? valfs.dateFormat : undefined) || xAxis.dateFormat);

            var text = '';

            if ($.isFunction(valff)) {
                var value = {};
                var cnt = 0;
                for (var field in series)
                    if (field.indexOf('dataField') == 0) {
                        value[field.substring(9, field.length).toLowerCase()] = self._getDataValue(iidx, series[field], gidx);
                        cnt++;
                    }

                if (cnt == 0)
                    value = self._getDataValue(iidx, undefined, gidx);
                else if (cnt == 1)
                    value = value[''];

                text = valff(value, iidx, series, group, xAxisValue, xAxis);
            }
            else {
                text = self._getFormattedValue(gidx, sidx, iidx, valfs, valff);

                var xAxisSettings = this._getAxisSettings(xAxis);

                var catfs = xAxisSettings.toolTipFormatSettings;
                var catff = xAxisSettings.toolTipFormatFunction;

                if (!catff && !catfs && xAxis.type == 'date')
                    catff = this._getDefaultDTFormatFn(xAxis.baseUnit || 'day');

                var categoryText = self._formatValue(xAxisValue, catfs, catff, gidx, sidx, iidx);

                if (!self._isPieGroup(gidx)) {
                    var t = (xAxis.displayText || xAxis.dataField || '');
                    if (t.length > 0)
                        text = t + ': ' + categoryText + '<br>' + text;
                    else
                        text = categoryText + '<br>' + text;
                }
                else {
                    xAxisValue = self._getDataValue(iidx, series.displayText || series.dataField, gidx);
                    categoryText = self._formatValue(xAxisValue, catfs, catff, gidx, sidx, iidx);
                    text = categoryText + ': ' + text;
                }
            }

            if (!self._ttEl) {
                self._ttEl = {};
            }
            self._ttEl.sidx = sidx;
            self._ttEl.gidx = gidx;
            self._ttEl.iidx = iidx;

            rect = self.renderer.getRect();

            if (enableCrosshairs) {
                var _x = $.jqx._ptrnd(self._pointMarker.x);
                var _y = $.jqx._ptrnd(self._pointMarker.y);
                var color = self.crosshairsColor || self._defaultLineColor;

                if (group.polar || group.spider) {
                    var polarCoords = this._getPolarAxisCoords(gidx, this._plotRect);

                    var dist = $.jqx._ptdist(_x, _y, polarCoords.x, polarCoords.y);
                    if (dist > polarCoords.r)
                        return;

                    var posAngle = Math.atan2(_y - polarCoords.y, _x - polarCoords.x);
                    var x2 = Math.cos(posAngle) * polarCoords.r + polarCoords.x;
                    var y2 = Math.sin(posAngle) * polarCoords.r + polarCoords.y;

                    if (self._ttEl.vLine)
                        self.renderer.attr(self._ttEl.vLine, { x1: polarCoords.x, y1: polarCoords.y, x2: x2, y2: y2 });
                    else
                        self._ttEl.vLine = self.renderer.line(polarCoords.x, polarCoords.y, x2, y2, { stroke: color, 'stroke-width': self.crosshairsLineWidth || 1.0, 'stroke-dasharray': self.crosshairsDashStyle || '' });
                }
                else {
                    if (self._ttEl.vLine && self._ttEl.hLine) {
                        self.renderer.attr(self._ttEl.vLine, { x1: _x, x2: _x });
                        self.renderer.attr(self._ttEl.hLine, { y1: _y, y2: _y });
                    }
                    else {
                        self._ttEl.vLine = self.renderer.line(_x, self._plotRect.y, _x, self._plotRect.y + self._plotRect.height, { stroke: color, 'stroke-width': self.crosshairsLineWidth || 1.0, 'stroke-dasharray': self.crosshairsDashStyle || '' });
                        self._ttEl.hLine = self.renderer.line(self._plotRect.x, _y, self._plotRect.x + self._plotRect.width, _y, { stroke: color, 'stroke-width': self.crosshairsLineWidth || 1.0, 'stroke-dasharray': self.crosshairsDashStyle || '' });
                    }
                }
            }

            if (!isCrossHairsOnly && self.showToolTips != false) {
                var cssToolTip = series.toolTipClass || group.toolTipClass || this.toThemeProperty('jqx-chart-tooltip-text', null);
                var toolTipFill = series.toolTipBackground || group.toolTipBackground || '#FFFFFF';
                var toolTipStroke = series.toolTipLineColor || group.toolTipLineColor || colors.lineColor;
                var toolTipFillOpacity = this._get([series.toolTipOpacity, group.toolTipOpacity, 1]);

                var coord = this.getItemCoord(gidx, sidx, iidx);

                var symbolSize = 0;

                if (self._pointMarker && self._pointMarker.element) {
                    symbolSize = series.symbolSizeSelected;
                    if (isNaN(symbolSize))
                        symbolSize = series.symbolSize;
                    if (isNaN(symbolSize) || symbolSize > 50 || symbolSize < 0)
                        symbolSize = group.symbolSize;
                    if (isNaN(symbolSize) || symbolSize > 50 || symbolSize < 0)
                        symbolSize = 8;
                }

                self._createTooltip(coord, group, text, { css: cssToolTip, fill: toolTipFill, stroke: toolTipStroke, fillOpacity: toolTipFillOpacity, symbolSize: symbolSize });
            }
        },

        _fitTooltip: function (bounds, elementRect, rect, group, symbolSize) {
            var fitOptions = {};

            var space = 2 + symbolSize / 2;
            var arrowSize = 7;

            //try fit left
            if (elementRect.x - rect.width - arrowSize - space > bounds.x &&
                elementRect.y + elementRect.height / 2 - rect.height / 2 > bounds.y &&
                elementRect.y + elementRect.height / 2 + rect.height / 2 < bounds.y + bounds.height) {

                fitOptions.left = {
                    arrowLocation: 'right',
                    x: elementRect.x - rect.width - arrowSize - space,
                    y: elementRect.y + elementRect.height / 2 - rect.height / 2,
                    width: rect.width + arrowSize,
                    height: rect.height
                };
            }

            //try fit right
            if (elementRect.x + elementRect.width + rect.width + arrowSize + space < bounds.x + bounds.width &&
                elementRect.y + elementRect.height / 2 - rect.height / 2 > bounds.y &&
                elementRect.y + elementRect.height / 2 + rect.height / 2 < bounds.y + bounds.height) {

                fitOptions.right = {
                    arrowLocation: 'left',
                    x: elementRect.x + elementRect.width + space,
                    y: elementRect.y + elementRect.height / 2 - rect.height / 2,
                    width: rect.width + arrowSize,
                    height: rect.height
                };
            }

            //try fit top
            if (elementRect.y - rect.height - space - arrowSize > bounds.y &&
                elementRect.x + elementRect.width / 2 - rect.width / 2 > bounds.x &&
                elementRect.x + elementRect.width / 2 + rect.width / 2 < bounds.x + bounds.width) {

                fitOptions.top = {
                    arrowLocation: 'bottom',
                    x: elementRect.x + elementRect.width / 2 - rect.width / 2,
                    y: elementRect.y - rect.height - space - arrowSize,
                    width: rect.width,
                    height: rect.height + arrowSize
                };
            }

            //try fit bottom
            if (elementRect.y + elementRect.height + rect.height + arrowSize + space < bounds.y + bounds.height &&
                elementRect.x + elementRect.width / 2 - rect.width / 2 > bounds.x &&
                elementRect.x + elementRect.width / 2 + rect.width / 2 < bounds.x + bounds.width) {

                fitOptions.bottom = {
                    arrowLocation: 'top',
                    x: elementRect.x + elementRect.width / 2 - rect.width / 2,
                    y: elementRect.y + elementRect.height + space,
                    width: rect.width,
                    height: rect.height + arrowSize
                };
            }

            if (elementRect.width > elementRect.height ||
                ((group.type.indexOf('stackedcolumn') != -1 || group.type.indexOf('stackedwaterfall') != -1) && group.orientation != 'horizontal')

            ) {
                if (fitOptions.left)
                    return fitOptions.left;
                if (fitOptions.right)
                    return fitOptions.right;
            }
            else {
                if (fitOptions.top)
                    return fitOptions.top
                if (fitOptions.bottom)
                    return fitOptions.bottom
            }

            for (var i in fitOptions) {
                if (fitOptions[i])
                    return fitOptions[i];
            }

            return { arrowLocation: '' }
        },

        /** @private */
        _createTooltip: function (position, group, content, style) {
            var self = this;

            var groupType = group.type;

            // create tooltip elements
            var isNew = false;

            var divToolTip = self._ttEl.box;
            if (!divToolTip) {
                isNew = true;

                divToolTip = self._ttEl.box = document.createElement("div");

                var baseZIndex = 10000000;

                divToolTip.style.position = 'absolute';
                divToolTip.style.cursor = 'default';
                $(arrowOuterDiv).css({ 'z-index': baseZIndex, 'box-sizing': 'content-box' });
                $(document.body).append(divToolTip);

                var arrowOuterDiv = document.createElement("div");
                arrowOuterDiv.id = 'arrowOuterDiv';
                arrowOuterDiv.style.width = '0px';
                arrowOuterDiv.style.height = '0px';
                arrowOuterDiv.style.position = 'absolute';
                $(arrowOuterDiv).css({ 'z-index': baseZIndex + 1, 'box-sizing': 'content-box' });

                var arrowInnerDiv = document.createElement("div");
                arrowInnerDiv.id = 'arrowInnerDiv';
                arrowInnerDiv.style.width = '0px';
                arrowInnerDiv.style.height = '0px';
                arrowInnerDiv.style.position = 'absolute';

                var contentDiv = document.createElement("div");
                contentDiv.id = 'contentDiv';
                contentDiv.style.position = 'absolute';
                $(contentDiv).css({ 'box-sizing': 'content-box' });

                $(contentDiv).addClass('jqx-rc-all jqx-button');
                $(contentDiv).appendTo($(divToolTip));
                $(arrowOuterDiv).appendTo($(divToolTip));
                $(arrowInnerDiv).appendTo($(divToolTip));
                $(arrowInnerDiv).css({ 'z-index': baseZIndex + 2, 'box-sizing': 'content-box' });

            }

            if (!content || content.length == 0) {
                $(divToolTip).fadeTo(0, 0);
                return;
            }

            contentDiv = $(divToolTip).find('#contentDiv')[0];
            arrowOuterDiv = $(divToolTip).find('#arrowOuterDiv')[0];
            arrowInnerDiv = $(divToolTip).find('#arrowInnerDiv')[0];
            arrowInnerDiv.style.opacity = arrowOuterDiv.style.opacity = style.fillOpacity;


            // set styles and content
            contentDiv.style.backgroundColor = style.fill;
            contentDiv.style.borderColor = style.stroke;
            contentDiv.style.opacity = style.fillOpacity;

            var html = "<span class='" + style.css + "'>" + content + "</span>";
            $(contentDiv).html(html);

            var size = this._measureHtml(html, 'jqx-rc-all jqx-button');

            // calculate tooltip positioning and arrow location
            rect = self._plotRect;

            if (size.width > rect.width || size.height > rect.height)
                return;

            var totalSize = { width: size.width, height: size.height };

            arrowLocation = '';
            var space = 5;
            var arrowSize = 7;

            var isColumn = self._isColumnType(groupType);

            x = Math.max(position.x, rect.x);
            y = Math.max(position.y, rect.y);

            if (self.toolTipAlignment == 'dataPoint') {
                if (groupType.indexOf('pie') != -1 || groupType.indexOf('donut') != -1) {
                    var midAngle = (position.fromAngle + position.toAngle) / 2;
                    midAngle = midAngle * (Math.PI / 180);

                    var radius = (!isNaN(position.innerRadius) && position.innerRadius > 0) ? (position.innerRadius + position.outerRadius) / 2 : position.outerRadius * 0.75;

                    x = position.x = position.center.x + Math.cos(midAngle) * radius;
                    y = position.y = position.center.y - Math.sin(midAngle) * radius;
                    position.width = position.height = 1;
                }
                else if (isColumn && (group.polar || group.spider)) {
                    position.width = position.height = 1;
                }

                var ttFit = this._fitTooltip(this._plotRect, position, totalSize, group, style.symbolSize);
                if (ttFit.arrowLocation != '') {
                    arrowLocation = ttFit.arrowLocation;
                    x = ttFit.x;
                    y = ttFit.y;
                    totalSize.width = ttFit.width;
                    totalSize.height = ttFit.height;
                }
            }
            else {
                arrowLocation = '';
            }

            if (arrowLocation == 'top' || arrowLocation == 'bottom') {
                totalSize.height += arrowSize;
                x -= arrowSize / 2;
                if (arrowLocation == 'bottom')
                    y -= arrowSize;
            }
            else if (arrowLocation == 'left' || arrowLocation == 'right') {
                totalSize.width += arrowSize;
                y -= arrowSize / 2;
                if (arrowLocation == 'right')
                    x -= arrowSize;
            }

            if (x + totalSize.width > rect.x + rect.width) {
                arrowLocation = '';
                x = rect.x + rect.width - totalSize.width;
            }

            if (y + totalSize.height > rect.y + rect.height) {
                arrowLocation = '';
                y = rect.y + rect.height - totalSize.height;
            }

            // set arrow and content position
            var arrowPosition = { x: 0, y: 0 }, contentPosition = { x: 0, y: 0 };
            $(contentDiv).css({ width: size.width, height: size.height, left: 0, top: 0 });

            arrowOuterDiv.style['margin-top'] = arrowOuterDiv.style['margin-left'] = 0;
            arrowInnerDiv.style['margin-top'] = arrowInnerDiv.style['margin-left'] = 0;
            contentDiv.style['margin-top'] = contentDiv.style['margin-left'] = 0;

            var arrowSizeSolid = arrowSize + 'px solid';
            var arrowSizeSolidTransparent = arrowSize + 'px solid transparent';

            switch (arrowLocation) {
                case 'left':
                    arrowPosition = { x: 0, y: (size.height - arrowSize) / 2 };
                    contentPostion = { x: arrowSize, y: 0 };
                    contentDiv.style['margin-left'] = arrowSize + 'px';

                    arrowOuterDiv.style['margin-left'] = 0 + 'px';
                    arrowOuterDiv.style['margin-top'] = arrowPosition.y + 'px';

                    arrowOuterDiv.style['border-left'] = '';
                    arrowOuterDiv.style['border-right'] = arrowSizeSolid + ' ' + style.stroke;
                    arrowOuterDiv.style['border-top'] = arrowSizeSolidTransparent;
                    arrowOuterDiv.style['border-bottom'] = arrowSizeSolidTransparent;

                    arrowInnerDiv.style['margin-left'] = 1 + 'px';
                    arrowInnerDiv.style['margin-top'] = arrowPosition.y + 'px';
                    arrowInnerDiv.style['border-left'] = '';
                    arrowInnerDiv.style['border-right'] = arrowSizeSolid + ' ' + style.fill;
                    arrowInnerDiv.style['border-top'] = arrowSizeSolidTransparent;
                    arrowInnerDiv.style['border-bottom'] = arrowSizeSolidTransparent;
                    break;
                case 'right':
                    arrowPosition = { x: totalSize.width - arrowSize, y: (size.height - arrowSize) / 2 };
                    contentPostion = { x: 0, y: 0 };

                    arrowOuterDiv.style['margin-left'] = arrowPosition.x + 'px';
                    arrowOuterDiv.style['margin-top'] = arrowPosition.y + 'px';

                    arrowOuterDiv.style['border-left'] = arrowSizeSolid + ' ' + style.stroke;
                    arrowOuterDiv.style['border-right'] = '';
                    arrowOuterDiv.style['border-top'] = arrowSizeSolidTransparent;
                    arrowOuterDiv.style['border-bottom'] = arrowSizeSolidTransparent;

                    arrowInnerDiv.style['margin-left'] = arrowPosition.x - 1 + 'px';
                    arrowInnerDiv.style['margin-top'] = arrowPosition.y + 'px';

                    arrowInnerDiv.style['border-left'] = arrowSizeSolid + ' ' + style.fill;
                    arrowInnerDiv.style['border-right'] = '';
                    arrowInnerDiv.style['border-top'] = arrowSizeSolidTransparent;
                    arrowInnerDiv.style['border-bottom'] = arrowSizeSolidTransparent;

                    break;
                case 'top':
                    arrowPosition = { x: totalSize.width / 2 - arrowSize / 2, y: 0 };
                    contentPostion = { x: 0, y: arrowSize };

                    contentDiv.style['margin-top'] = contentPostion.y + 'px';
                    arrowOuterDiv.style['margin-left'] = arrowPosition.x + 'px';

                    arrowOuterDiv.style['border-top'] = '';
                    arrowOuterDiv.style['border-bottom'] = arrowSizeSolid + ' ' + style.stroke;
                    arrowOuterDiv.style['border-left'] = arrowSizeSolidTransparent;
                    arrowOuterDiv.style['border-right'] = arrowSizeSolidTransparent;

                    arrowInnerDiv.style['margin-left'] = arrowPosition.x + 'px';
                    arrowInnerDiv.style['margin-top'] = 1 + 'px';
                    arrowInnerDiv.style['border-top'] = '';
                    arrowInnerDiv.style['border-bottom'] = arrowSizeSolid + ' ' + style.fill;
                    arrowInnerDiv.style['border-left'] = arrowSizeSolidTransparent;
                    arrowInnerDiv.style['border-right'] = arrowSizeSolidTransparent;
                    break;
                case 'bottom':
                    arrowPosition = { x: totalSize.width / 2 - arrowSize / 2, y: totalSize.height - arrowSize };
                    contentPostion = { x: 0, y: 0 }

                    arrowOuterDiv.style['margin-left'] = arrowPosition.x + 'px';
                    arrowOuterDiv.style['margin-top'] = arrowPosition.y + 'px';

                    arrowOuterDiv.style['border-top'] = arrowSizeSolid + ' ' + style.stroke;
                    arrowOuterDiv.style['border-bottom'] = '';
                    arrowOuterDiv.style['border-left'] = arrowSizeSolidTransparent;
                    arrowOuterDiv.style['border-right'] = arrowSizeSolidTransparent;

                    arrowInnerDiv.style['margin-left'] = arrowPosition.x + 'px';
                    arrowInnerDiv.style['margin-top'] = arrowPosition.y - 1 + 'px';
                    arrowInnerDiv.style['border-top'] = arrowSizeSolid + ' ' + style.fill;
                    arrowInnerDiv.style['border-bottom'] = '';
                    arrowInnerDiv.style['border-left'] = arrowSizeSolidTransparent;
                    arrowInnerDiv.style['border-right'] = arrowSizeSolidTransparent;

                    break;
            }

            if (arrowLocation == '') {
                $(arrowOuterDiv).hide();
                $(arrowInnerDiv).hide();
            }
            else {
                $(arrowOuterDiv).show();
                $(arrowInnerDiv).show();
            }

            // update size
            $(divToolTip).css({ width: totalSize.width + 'px', height: totalSize.height + 'px' });

            var hostPosition = self.host.coord();
            if (isNew) {
                $(divToolTip).fadeOut(0, 0);
                divToolTip.style.left = x + hostPosition.left + 'px';
                divToolTip.style.top = y + hostPosition.top + 'px';
            }

            $(divToolTip).clearQueue();
            $(divToolTip).animate({ left: x + hostPosition.left, top: y + hostPosition.top, opacity: 1 }, self.toolTipMoveDuration, 'easeInOutCirc');
            $(divToolTip).fadeTo(400, 1);
        },

        /** @private */
        _measureHtml: function (html, cssClass) {
            var measureDiv = this._measureDiv;

            if (!measureDiv) {
                this._measureDiv = measureDiv = document.createElement("div");
                measureDiv.style.position = 'absolute';
                measureDiv.style.cursor = 'default';
                measureDiv.style.overflow = 'hidden';
                measureDiv.style.display = 'none';
                $(measureDiv).addClass(cssClass);
                this.host.append(measureDiv);
            }

            $(measureDiv).html(html);
            var sz = { width: $(measureDiv).width() + 2, height: $(measureDiv).height() + 2 };
            if ($.jqx.browser && $.jqx.browser.mozilla) {
                sz.height += 3;
            }

            return sz;
        },

        /** @private */
        _hideToolTip: function (delay) {
            if (!this._ttEl)
                return;

            if (this._ttEl.box) {
                if (delay == 0)
                    $(this._ttEl.box).hide();
                else
                    $(this._ttEl.box).fadeOut();
            }

            this._hideCrosshairs();

            this._ttEl.gidx = undefined;

        },

        /** @private */
        _hideCrosshairs: function () {
            if (!this._ttEl)
                return;

            if (this._ttEl.vLine) {
                this.renderer.removeElement(this._ttEl.vLine);
                this._ttEl.vLine = undefined;
            }

            if (this._ttEl.hLine) {
                this.renderer.removeElement(this._ttEl.hLine);
                this._ttEl.hLine = undefined;
            }
        },

        _get: function (arr) {
            return $.jqx.getByPriority(arr);
        },

        _getAxisSettings: function (axis) {
            if (!axis)
                return {};

            var self = this;

            // grid lines settings
            var gridLinesProperties = axis.gridLines || {};

            var gridLinesSettings = {
                visible: this._get([gridLinesProperties.visible, axis.showGridLines, true]),
                color: self._get([gridLinesProperties.color, axis.gridLinesColor, self._defaultLineColor]),
                unitInterval: self._get([gridLinesProperties.unitInterval, gridLinesProperties.interval, axis.gridLinesInterval]),
                step: self._get([gridLinesProperties.step, axis.gridLinesStep]),
                dashStyle: self._get([gridLinesProperties.dashStyle, axis.gridLinesDashStyle]),
                width: self._get([gridLinesProperties.lineWidth, 1]),
                offsets: [],
                alternatingBackgroundColor: axis.alternatingBackgroundColor,
                alternatingBackgroundColor2: axis.alternatingBackgroundColor2,
                alternatingBackgroundOpacity: axis.alternatingBackgroundOpacity
            };

            // tick marks settings
            var tickMarksProperties = axis.tickMarks || {};
            var tickMarksSettings =
            {
                visible: this._get([tickMarksProperties.visible, axis.showTickMarks, true]),
                color: self._get([tickMarksProperties.color, axis.tickMarksColor, self._defaultLineColor]),
                unitInterval: self._get([tickMarksProperties.unitInterval, tickMarksProperties.interval, axis.tickMarksInterval]),
                step: self._get([tickMarksProperties.step, axis.tickMarksStep]),
                dashStyle: self._get([tickMarksProperties.dashStyle, axis.tickMarksDashStyle]),
                width: self._get([tickMarksProperties.lineWidth, 1]),
                size: self._get([tickMarksProperties.size, 4]),
                offsets: []
            };

            // title settings
            var titleProperties = axis.title || {};

            var titleSettings =
            {
                visible: self._get([titleProperties.visible, true]),
                text: self._get([axis.description, titleProperties.text]),
                style: self._get([axis.descriptionClass, titleProperties['class'], self.toThemeProperty('jqx-chart-axis-description', null)]),
                halign: self._get([axis.horizontalDescriptionAlignment, titleProperties.horizontalAlignment, 'center']),
                valign: self._get([axis.verticalDescriptionAlignment, titleProperties.verticalAlignment, 'center']),
                angle: 0,
                rotationPoint: self._get([titleProperties.rotationPoint, 'centercenter']),
                offset: self._get([titleProperties.offset, { x: 0, y: 0}])
            };

            var lineProperties = axis.line || {};
            var lineSettings =
            {
                visible: self._get([lineProperties.visible, true]),
                color: self._get([lineProperties.color, gridLinesSettings.color, self._defaultLineColor]),
                dashStyle: self._get([lineProperties.dashStyle, gridLinesSettings.dashStyle, '']),
                width: self._get([lineProperties.lineWidth, 1]),
                angle: self._get([lineProperties.angle, NaN])
            };

            var padding = axis.padding || {};

            padding = {
                left: padding.left || 0,
                right: padding.right || 0,
                top: padding.top || 0,
                bottom: padding.bottom || 0
            };

            var labelsSettings = this._getAxisLabelsSettings(axis);

            var result =
            {
                visible: this._get([axis.visible, axis.showValueAxis, axis.showXAxis, axis.showCategoryAxis, true]),
                customDraw: this._get([axis.customDraw, false]),
                gridLines: gridLinesSettings,
                tickMarks: tickMarksSettings,
                line: lineSettings,
                title: titleSettings,
                labels: labelsSettings,
                padding: padding,
                toolTipFormatFunction: this._get([axis.toolTipFormatFunction, axis.formatFunction, labelsSettings.formatFunction]),
                toolTipFormatSettings: this._get([axis.toolTipFormatSettings, axis.formatSettings, labelsSettings.formatSettings])
            };

            return result;
        },

        _getAxisLabelsSettings: function (axis) {
            var self = this;

            var labels = axis.labels || {};

            var settings = {
                visible: self._get([axis.showLabels, labels.visible, true]),
                unitInterval: self._get([labels.unitInterval, labels.interval, axis.labelsInterval]),
                step: self._get([labels.step, axis.labelsStep]),
                angle: self._get([axis.textRotationAngle, labels.angle, 0]),
                style: self._get([axis['class'], labels['class'], self.toThemeProperty('jqx-chart-axis-text', null)]),
                halign: self._get([axis.horizontalTextAlignment, labels.horizontalAlignment, 'center']),
                valign: self._get([axis.verticalTextAlignment, labels.verticalAlignment, 'center']),
                textRotationPoint: self._get([axis.textRotationPoint, labels.rotationPoint, 'auto']),
                textOffset: self._get([axis.textOffset, labels.offset, { x: 0, y: 0}]),
                autoRotate: self._get([axis.labelsAutoRotate, labels.autoRotate, false]),
                formatSettings: self._get([axis.formatSettings, labels.formatSettings, undefined]),
                formatFunction: self._get([axis.formatFunction, labels.formatFunction, undefined])
            };

            return settings;
        },

        _getLabelsSettings: function (gidx, sidx, iidx, options) {
            var g = this.seriesGroups[gidx];
            var s = g.series[sidx];
            var value = isNaN(iidx) ? undefined : this._getDataValue(iidx, s.dataField, gidx);

            var properties = options || [
                'Visible',
                'Offset',
                'Angle',
                'HorizontalAlignment',
                'VerticalAlignment',
                'Class',
                'BackgroundColor',
                'BorderColor',
                'BorderOpacity',
                'Padding',
                'Opacity',
                'BackgroundOpacity',
                'LinesAngles',
                'LinesEnabled',
                'AutoRotate',
                'Radius'
                ];

            var result = {};
            for (var i = 0; i < properties.length; i++) {
                var key = properties[i];
                var name = 'labels' + key;
                var altName = 'label' + key;
                var altName2 = key.substring(0, 1).toLowerCase() + key.substring(1);

                var propValue = undefined;
                if (g.labels && typeof (g.labels) == 'object')
                    propValue = g.labels[altName2];

                if (s.labels && typeof (s.labels) == 'object' && undefined != s.labels[altName2])
                    propValue = s.labels[altName2];

                propValue = this._get([s[name], s[altName], propValue, g[name], g[altName]]);

                if ($.isFunction(propValue))
                    result[altName2] = propValue(value, iidx, s, g);
                else
                    result[altName2] = propValue;
            }

            result['class'] = result['class'] || this.toThemeProperty('jqx-chart-label-text', null);

            result['visible'] = this._get([result['visible'], s.showLabels, g.showLabels, s.labels != undefined ? true : undefined, g.labels != undefined ? true : undefined]);

            var paddingValue = result['padding'] || 1;

            result['padding'] = {
                left: this._get([paddingValue.left, isNaN(paddingValue) ? 1 : paddingValue]),
                right: this._get([paddingValue.right, isNaN(paddingValue) ? 1 : paddingValue]),
                top: this._get([paddingValue.top, isNaN(paddingValue) ? 1 : paddingValue]),
                bottom: this._get([paddingValue.bottom, isNaN(paddingValue) ? 1 : paddingValue])
            }

            return result;
        },

        /** @private */
        _showLabel: function (gidx, sidx, iidx, rect, halign, valign, isMeasure, inverseHAlign, inverseVAlign, labelAngleOverride, renderedRect) {
            var group = this.seriesGroups[gidx];
            var series = group.series[sidx];
            var sz = { width: 0, height: 0 }, szSave;

            if (isNaN(iidx))
                return;

            var settings = this._getLabelsSettings(gidx, sidx, iidx);

            if (!settings.visible)
                return isMeasure ? sz : undefined;

            if (rect.width < 0 || rect.height < 0)
                return isMeasure ? sz : undefined;

            var labelsAngle = settings.angle;
            if (!isNaN(labelAngleOverride))
                labelsAngle = labelAngleOverride;

            var offset = settings.offset || {};
            var labelOffset = { x: offset.x, y: offset.y };
            if (isNaN(labelOffset.x))
                labelOffset.x = 0;
            if (isNaN(labelOffset.y))
                labelOffset.y = 0;

            halign = halign || settings.horizontalAlignment || 'center';
            valign = valign || settings.verticalAlignment || 'center';

            var text = this._getFormattedValue(gidx, sidx, iidx, undefined, undefined, true);

            var w = rect.width;
            var h = rect.height;

            if (inverseHAlign == true && halign != 'center')
                halign = halign == 'right' ? 'left' : 'right';

            if (inverseVAlign == true && valign != 'center' && valign != 'middle') {
                valign = valign == 'top' ? 'bottom' : 'top';
                labelOffset.y *= -1;
            }

            sz = this.renderer.measureText(text, labelsAngle, { 'class': settings['class'] });

            if (isMeasure)
                return sz;

            var x = 0, y = 0;

            if (w > 0) {
                if (halign == '' || halign == 'center')
                    x += (w - sz.width) / 2;
                else if (halign == 'right')
                    x += (w - sz.width);
            }

            if (h > 0) {
                if (valign == '' || valign == 'center')
                    y += (h - sz.height) / 2;
                else if (valign == 'bottom')
                    y += (h - sz.height);
            }

            x += rect.x + labelOffset.x;
            y += rect.y + labelOffset.y;

            var plotRect = this._plotRect;

            if (x <= plotRect.x)
                x = plotRect.x + 2;

            if (y <= plotRect.y)
                y = plotRect.y + 2;

            var labelSize = { width: Math.max(sz.width, 1), height: Math.max(sz.height, 1) };

            if (y + labelSize.height >= plotRect.y + plotRect.height)
                y = plotRect.y + plotRect.height - (szSave ? (labelSize.height + szSave.height) / 2 : labelSize.height) - 2;

            if (x + labelSize.width >= plotRect.x + plotRect.width)
                x = plotRect.x + plotRect.width - labelSize.width - 2;

            var renderGroup;

            var labelsBackground = settings.backgroundColor;
            var labelsBorder = settings.borderColor;

            var padding = settings.padding;
            if (labelsBackground || labelsBorder) {
                renderGroup = this.renderer.beginGroup();

                var rect = this.renderer.rect(
                    x - padding.left,
                    y - padding.top,
                    sz.width + padding.left + padding.right,
                    sz.height + padding.bottom + padding.bottom,
                    {
                        fill: labelsBackground || 'transparent',
                        'fill-opacity': settings.backgroundOpacity || 1,
                        stroke: labelsBorder || 'transparent',
                        'stroke-opacity': settings.borderOpacity,
                        'stroke-width': 1
                    }
                );
            }

            var elemLabel = this.renderer.text(text, x, y, sz.width, sz.height, labelsAngle, { 'class': settings['class'], opacity: settings.opacity || 1 }, false, 'center', 'center');

            if (renderedRect) {
                // return the renderedRect
                renderedRect.x = x - padding.left;
                renderedRect.y = y - padding.top;
                renderedRect.width = sz.width + padding.left + padding.right;
                renderedRect.height = sz.height + padding.bottom + padding.bottom;
            }

            if (this._isVML) {
                this.renderer.removeElement(elemLabel);
                this.renderer.getContainer()[0].appendChild(elemLabel);
            }

            if (renderGroup)
                this.renderer.endGroup();

            return renderGroup || elemLabel;
        },

        /** @private */
        _getAnimProps: function (gidx, sidx) {
            var g = this.seriesGroups[gidx];
            var s = !isNaN(sidx) ? g.series[sidx] : undefined;

            var enabled = this.enableAnimations == true;

            if (g.enableAnimations)
                enabled = g.enableAnimations == true;

            if (s && s.enableAnimations)
                enabled = s.enableAnimations == true;

            var duration = this.animationDuration;
            if (isNaN(duration))
                duration = 1000;

            var gd = g.animationDuration;
            if (!isNaN(gd))
                duration = gd;

            if (s) {
                var sd = s.animationDuration;
                if (!isNaN(sd))
                    duration = sd;
            }

            if (duration > 5000)
                duration = 1000;

            return { enabled: enabled, duration: duration };
        },

        _isColorTransition: function (groupIndex, s, renderData, current) {
            if (current - 1 < renderData.xoffsets.first)
                return false;

            var currentColor = this._getColors(groupIndex, s, current, this._getGroupGradientType(groupIndex));
            var prevColor = this._getColors(groupIndex, s, current - 1, this._getGroupGradientType(groupIndex));

            return (currentColor.fillColor != prevColor.fillColor);
        },

        /** @private */
        _renderLineSeries: function (groupIndex, rect) {
            var group = this.seriesGroups[groupIndex];
            if (!group.series || group.series.length == 0)
                return;

            var isArea = group.type.indexOf('area') != -1;
            var isStacked = group.type.indexOf('stacked') != -1;
            var isStacked100 = isStacked && group.type.indexOf('100') != -1;
            var isSpline = group.type.indexOf('spline') != -1;
            var isStep = group.type.indexOf('step') != -1;
            var isRange = group.type.indexOf('range') != -1;
            var isPolar = group.polar == true || group.spider == true;
            if (isPolar)
                isStep = false;

            if (isStep && isSpline)
                return;

            var dataLength = this._getDataLen(groupIndex);
            var wPerItem = rect.width / dataLength;

            var swapXY = group.orientation == 'horizontal';
            var flipCategory = this._getXAxis(groupIndex).flip == true;

            var gRect = rect;
            if (swapXY)
                gRect = { x: rect.y, y: rect.x, width: rect.height, height: rect.width };

            var renderData = this._calcGroupOffsets(groupIndex, gRect);

            if (!renderData || renderData.xoffsets.length == 0)
                return;

            if (!this._linesRenderInfo)
                this._linesRenderInfo = {};

            this._linesRenderInfo[groupIndex] = {};

            for (var sidx = group.series.length - 1; sidx >= 0; sidx--) {
                var serieSettings = this._getSerieSettings(groupIndex, sidx);

                var serieCtx = {
                    groupIndex: groupIndex,
                    rect: gRect,
                    serieIndex: sidx,
                    swapXY: swapXY,
                    isArea: isArea,
                    isSpline: isSpline,
                    isRange: isRange,
                    isPolar: isPolar,
                    settings: serieSettings,
                    segments: [],
                    pointsLength: 0
                };

                var isVisible = this._isSerieVisible(groupIndex, sidx);
                if (!isVisible) {
                    this._linesRenderInfo[groupIndex][sidx] = serieCtx;
                    continue;
                }

                var serie = group.series[sidx];
                if (serie.customDraw)
                    continue;

                var hasColorFunction = $.isFunction(serie.colorFunction);

                var curr = renderData.xoffsets.first;
                var last = curr;

                var color = this._getColors(groupIndex, sidx, NaN, this._getGroupGradientType(groupIndex));

                var colorBreakPoint = false;

                var continueOnCurr;
                do {
                    var points = [];
                    var rangeBasePoints = [];
                    var pointsStart = [];

                    var prev = -1;
                    var px = 0, py = 0;
                    var xPrev = NaN;
                    var yPrev = NaN;
                    var pyStart = NaN;

                    if (renderData.xoffsets.length < 1)
                        continue;

                    var anim = this._getAnimProps(groupIndex, sidx);
                    var duration = anim.enabled && !this._isToggleRefresh && renderData.xoffsets.length < 10000 && this._isVML != true ? anim.duration : 0;
                    var first = curr;
                    continueOnCurr = false;

                    var currentColor = this._getColors(groupIndex, sidx, curr, this._getGroupGradientType(groupIndex));
                    var ptSave = undefined;
                    for (var i = curr; i <= renderData.xoffsets.last; i++) {
                        curr = i;

                        var x = renderData.xoffsets.data[i];
                        var xvalue = renderData.xoffsets.xvalues[i];

                        if (isNaN(x))
                            continue;

                        x = Math.max(x, 1);
                        px = x;

                        py = renderData.offsets[sidx][i].to;


                        if (!hasColorFunction && ptSave && this.enableSampling && $.jqx._ptdist(ptSave.x, ptSave.y, px, py) < 1)
                            continue;

                        ptSave = { x: px, y: py };


                        var pyFrom = renderData.offsets[sidx][i].from;
                        if (isNaN(py) || isNaN(pyFrom)) {
                            if (serie.emptyPointsDisplay == 'connect') {
                                continue;
                            }
                            else if (serie.emptyPointsDisplay == 'zero') {
                                if (isNaN(py))
                                    py = renderData.baseOffset;
                                if (isNaN(pyFrom))
                                    pyFrom = renderData.baseOffset;
                            }
                            else {
                                continueOnCurr = true;
                                break;
                            }
                        }

                        if (hasColorFunction && this._isColorTransition(groupIndex, sidx, renderData, curr)) {
                            if (points.length > 1) {
                                curr--;
                                break;
                            }
                        }

                        var elementRenderInfo = this._elementRenderInfo;
                        if (elementRenderInfo &&
                            elementRenderInfo.length > groupIndex &&
                            elementRenderInfo[groupIndex].series.length > sidx
                            ) {
                            var itemStartState = elementRenderInfo[groupIndex].series[sidx][xvalue];
                            var pyStart = $.jqx._ptrnd(itemStartState ? itemStartState.to : undefined);
                            var pxStart = $.jqx._ptrnd(gRect.x + (itemStartState ? itemStartState.xoffset : undefined));

                            pointsStart.push(swapXY ? { y: pxStart, x: pyStart, index: i} : { x: pxStart, y: pyStart, index: i });
                        }

                        last = i;

                        if (serieSettings.stroke < 2) {
                            if (py - gRect.y <= 1)
                                py = gRect.y + 1;
                            if (pyFrom - gRect.y <= 1)
                                pyFrom = gRect.y + 1;
                            if (gRect.y + gRect.height - py <= 1)
                                py = gRect.y + gRect.height - 1;
                            if (gRect.y + gRect.height - pyFrom <= 1)
                                pyFrom = gRect.y + gRect.height - 1;
                        }

                        if (!isArea && isStacked100) {
                            if (py <= gRect.y)
                                py = gRect.y + 1;
                            if (py >= gRect.y + gRect.height)
                                py = gRect.y + gRect.height - 1;

                            if (pyFrom <= gRect.y)
                                pyFrom = gRect.y + 1;
                            if (pyFrom >= gRect.y + gRect.height)
                                pyFrom = gRect.y + gRect.height - 1;
                        }

                        // TODO: validate condition
                        x = Math.max(x, 1);
                        px = x + gRect.x;

                        if (group.skipOverlappingPoints == true && !isNaN(xPrev) && Math.abs(xPrev - px) <= 1)
                            continue;

                        if (isStep && !isNaN(xPrev) && !isNaN(yPrev)) {
                            if (yPrev != py)
                                points.push(swapXY ? { y: px, x: $.jqx._ptrnd(yPrev)} : { x: px, y: $.jqx._ptrnd(yPrev) });
                        }

                        points.push(swapXY ? { y: px, x: $.jqx._ptrnd(py), index: i} : { x: px, y: $.jqx._ptrnd(py), index: i });
                        rangeBasePoints.push(swapXY ? { y: px, x: $.jqx._ptrnd(pyFrom), index: i} : { x: px, y: $.jqx._ptrnd(pyFrom), index: i });

                        xPrev = px;
                        yPrev = py;
                        if (isNaN(pyStart))
                            pyStart = py;
                    }

                    if (points.length == 0) {
                        curr++;
                        continue;
                    }

                    var lastItemIndex = points[points.length - 1].index;
                    if (hasColorFunction)
                        color = this._getColors(groupIndex, sidx, lastItemIndex, this._getGroupGradientType(groupIndex));

                    var left = gRect.x + renderData.xoffsets.data[first];
                    var right = gRect.x + renderData.xoffsets.data[last];

                    if (isArea && group.alignEndPointsWithIntervals == true) {
                        var sign = flipCategory ? -1 : 1;
                        if (left > gRect.x) {
                            left = gRect.x;
                        }
                        if (right < gRect.x + gRect.width)
                            right = gRect.x + gRect.width;

                        if (flipCategory) {
                            var tmp = left;
                            left = right;
                            right = tmp;
                        }
                    }
                    right = $.jqx._ptrnd(right);
                    left = $.jqx._ptrnd(left);

                    var yBase = renderData.baseOffset;
                    pyStart = $.jqx._ptrnd(pyStart);

                    var pyEnd = $.jqx._ptrnd(py) || yBase;

                    if (isRange) {
                        points = points.concat(rangeBasePoints.reverse());
                    }

                    serieCtx.pointsLength += points.length;

                    var segmentCtx = {
                        lastItemIndex: lastItemIndex,
                        colorSettings: color,
                        pointsArray: points,
                        pointsStart: pointsStart,
                        left: left,
                        right: right,
                        pyStart: pyStart,
                        pyEnd: pyEnd,
                        yBase: yBase,
                        labelElements: [],
                        symbolElements: []
                    };

                    serieCtx.segments.push(segmentCtx);
                }
                while (curr < renderData.xoffsets.length - 1 || continueOnCurr);

                this._linesRenderInfo[groupIndex][sidx] = serieCtx;
            } // for s

            var contexts = this._linesRenderInfo[groupIndex];
            var contextsArr = [];
            for (var i in contexts)
                contextsArr.push(contexts[i]);

            contextsArr = contextsArr.sort(function (a, b) { return a.serieIndex - b.serieIndex; });

            if (isArea && isStacked)
                contextsArr.reverse();

            for (var i = 0; i < contextsArr.length; i++) {
                var serieCtx = contextsArr[i];
                this._animateLine(serieCtx, duration == 0 ? 1 : 0);

                var self = this;
                this._enqueueAnimation(
                        "series",
                        undefined,
                        undefined,
                        duration,
                        function (element, context, percent) {
                            self._animateLine(context, percent);
                        },
                        serieCtx);
            }

        },

        /** @private */
        _animateLine: function (serieCtx, percent) {
            var settings = serieCtx.settings;
            var groupIndex = serieCtx.groupIndex;
            var serieIndex = serieCtx.serieIndex;
            var group = this.seriesGroups[groupIndex];
            var serie = group.series[serieIndex];

            var symbol = this._getSymbol(groupIndex, serieIndex);
            var showLabels = this._getLabelsSettings(groupIndex, serieIndex, NaN, ['Visible']).visible;

            var isClosedPolar = true;
            if (serieCtx.isPolar) {
                if (!isNaN(group.endAngle) && Math.round(Math.abs((isNaN(group.startAngle) ? 0 : group.startAngle) - group.endAngle)) != 360)
                    isClosedPolar = false;
            }

            var startPoint = 0;
            for (var iSegment = 0; iSegment < serieCtx.segments.length; iSegment++) {
                var ctx = serieCtx.segments[iSegment];
                var cmd = this._calculateLine(groupIndex, serieCtx.pointsLength, startPoint, ctx.pointsArray, ctx.pointsStart, ctx.yBase, percent, serieCtx.isArea, serieCtx.swapXY);
                startPoint += ctx.pointsArray.length;

                if (cmd == '')
                    continue;

                var split = cmd.split(' ');
                var cnt = split.length;

                var lineCmd = cmd;
                if (lineCmd != '')
                    lineCmd = this._buildLineCmd(
                        cmd,
                        serieCtx.isRange,
                        ctx.left,
                        ctx.right,
                        ctx.pyStart,
                        ctx.pyEnd,
                        ctx.yBase,
                        serieCtx.isArea,
                        serieCtx.isPolar,
                        isClosedPolar,
                        serieCtx.isSpline,
                        serieCtx.swapXY
                        );
                else
                    lineCmd = 'M 0 0';

                var colorSettings = ctx.colorSettings;

                if (!ctx.pathElement) {
                    ctx.pathElement = this.renderer.path(
                                    lineCmd,
                                    {
                                        'stroke-width': settings.stroke,
                                        'stroke': colorSettings.lineColor,
                                        'stroke-opacity': settings.opacity,
                                        'fill-opacity': settings.opacity,
                                        'stroke-dasharray': settings.dashStyle,
                                        fill: serieCtx.isArea ? colorSettings.fillColor : 'none'
                                    });

                    this._installHandlers(ctx.pathElement, 'path', groupIndex, serieIndex, ctx.lastItemIndex);
                }
                else {
                    this.renderer.attr(ctx.pathElement, { 'd': lineCmd });
                }

                if (ctx.labelElements) {
                    for (var i = 0; i < ctx.labelElements.length; i++)
                        this.renderer.removeElement(ctx.labelElements[i]);

                    ctx.labelElements = [];
                }

                if (ctx.symbolElements) {
                    for (var i = 0; i < ctx.symbolElements.length; i++)
                        this.renderer.removeElement(ctx.symbolElements[i]);

                    ctx.symbolElements = [];
                }


                if (ctx.pointsArray.length == split.length) {
                    if (symbol != 'none' || showLabels) {
                        var symbolSize = serie.symbolSize;

                        var gRect = this._plotRect;

                        for (var i = 0; i < split.length; i++) {
                            var point = split[i].split(',');
                            point = { x: parseFloat(point[0]), y: parseFloat(point[1]) };

                            if (point.x < gRect.x || point.x > gRect.x + gRect.width ||
                                point.y < gRect.y || point.y > gRect.y + gRect.height)
                                continue;

                            if (symbol != 'none') {
                                var itemColors = this._getColors(groupIndex, serieIndex, ctx.pointsArray[i].index, this._getGroupGradientType(groupIndex));
                                var symbolElement = this._drawSymbol(
                                    symbol,
                                    point.x,
                                    point.y,
                                    itemColors.fillColorSymbol,
                                    settings.opacity,
                                    itemColors.lineColorSymbol,
                                    settings.opacity,
                                    settings.strokeSymbol,
                                    undefined,
                                    symbolSize);

                                ctx.symbolElements.push(symbolElement);
                            }

                            if (showLabels) {
                                var pointPrev = (i > 0 ? split[i - 1] : split[i]).split(',');
                                pointPrev = { x: parseFloat(pointPrev[0]), y: parseFloat(pointPrev[1]) };

                                var pointNext = (i < split.length - 1 ? split[i + 1] : split[i]).split(',');
                                pointNext = { x: parseFloat(pointNext[0]), y: parseFloat(pointNext[1]) };

                                point = this._adjustLineLabelPosition(groupIndex, serieIndex, ctx.pointsArray[i].index, point, pointPrev, pointNext);

                                if (point) {
                                    var labelElement = this._showLabel(groupIndex, serieIndex, ctx.pointsArray[i].index, { x: point.x, y: point.y, width: 0, height: 0 });
                                    ctx.labelElements.push(labelElement);
                                }
                            }
                        }
                    }
                }


                if (percent == 1 && symbol != 'none') {
                    for (var i = 0; i < ctx.symbolElements.length; i++) {
                        if (isNaN(ctx.pointsArray[i].index))
                            continue;
                        this._installHandlers(ctx.symbolElements[i], 'symbol', groupIndex, serieIndex, ctx.pointsArray[i].index);
                    }
                }
            } // iSegment
        },

        /** @private */
        _adjustLineLabelPosition: function (gidx, sidx, iidx, pt, ptPrev, ptNext) {
            var labelSize = this._showLabel(gidx, sidx, iidx, { width: 0, height: 0 }, '', '', true);
            if (!labelSize)
                return;

            var ptAdj = { x: pt.x - labelSize.width / 2, y: 0 };

            ptAdj.y = pt.y - 1.5 * labelSize.height;

            return ptAdj;
        },

        /** @private */
        _calculateLine: function (groupIndex, seriePointsLength, startPoint, pointsArray, pointsStartArray, yBase, percent, isArea, swapXY) {
            var g = this.seriesGroups[groupIndex];

            var polarAxisCoords;
            if (g.polar == true || g.spider == true)
                polarAxisCoords = this._getPolarAxisCoords(groupIndex, this._plotRect);

            var cmd = '';

            var cnt = pointsArray.length;
            if (!isArea && pointsStartArray.length == 0) {
                var stop = seriePointsLength * percent;
                cnt = stop - startPoint;
            }

            var baseXSave = NaN;
            for (var i = 0; i < cnt + 1 && i < pointsArray.length; i++) {
                if (i > 0)
                    cmd += ' ';
                var y = pointsArray[i].y;
                var x = pointsArray[i].x;
                var baseY = !isArea ? y : yBase;
                var baseX = x;
                if (pointsStartArray && pointsStartArray.length > i) {
                    baseY = pointsStartArray[i].y;
                    baseX = pointsStartArray[i].x;
                    if (isNaN(baseY) || isNaN(baseX)) {
                        baseY = y;
                        baseX = x;
                    }
                }

                baseXSave = baseX;

                if (cnt <= pointsArray.length && i > 0 && i == cnt) {
                    baseX = pointsArray[i - 1].x;
                    baseY = pointsArray[i - 1].y;
                }

                if (swapXY) {
                    x = $.jqx._ptrnd((x - baseY) * (isArea ? percent : 1) + baseY);
                    y = $.jqx._ptrnd(y);
                }
                else {
                    x = $.jqx._ptrnd((x - baseX) * percent + baseX);
                    y = $.jqx._ptrnd((y - baseY) * percent + baseY);
                }

                if (polarAxisCoords) {
                    var point = this._toPolarCoord(polarAxisCoords, this._plotRect, x, y);
                    x = point.x;
                    y = point.y;
                }

                cmd += x + ',' + y;

                //if (pointsArray.length == 1 && !isArea)
                //    cmd += ' ' + (x + 2) + ',' + (y + 2);
            }

            return cmd;
        },

        /** @private */
        _buildLineCmd: function (pointsArray, isRange, left, right, pyStart, pyEnd, yBase, isArea, isPolar, isClosedPolar, isSpline, swapXY) {
            var cmd = pointsArray;

            var ptBottomLeft = swapXY ? yBase + ',' + left : left + ',' + yBase;
            var ptBottomRight = swapXY ? yBase + ',' + right : right + ',' + yBase;

            if (isArea && !isPolar && !isRange) {
                cmd = ptBottomLeft + ' ' + pointsArray + ' ' + ptBottomRight;
            }

            if (isSpline)
                cmd = this._getBezierPoints(cmd);

            var split = cmd.split(' ');
            if (split.length == 0)
                return '';

            // handle single point case
            if (split.length == 1) {
                var points = split[0].split(',');
                return 'M ' + split[0] + ' L' + (parseFloat(points[0]) + 1) + ',' + (parseFloat(points[1]) + 1);
            }

            var firstPoint = split[0].replace('M', '');

            if (isArea && !isPolar) {
                if (!isRange) {
                    cmd = 'M ' + ptBottomLeft + ' L ' + firstPoint + ' ' + cmd;
                }
                else {
                    cmd = 'M ' + firstPoint + ' L ' + firstPoint + (isSpline ? '' : (' L ' + firstPoint + ' ')) + cmd;
                }
            }
            else {
                if (!isSpline)
                    cmd = 'M ' + firstPoint + ' ' + 'L ' + firstPoint + ' ' + cmd;
            }

            if ((isPolar && isClosedPolar) || isRange)
                cmd += ' Z';

            return cmd;
        },

        /** @private */
        _getSerieSettings: function (groupIndex, seriesIndex) {
            var group = this.seriesGroups[groupIndex];
            var isArea = group.type.indexOf('area') != -1;
            var isLine = group.type.indexOf('line') != -1;

            var serie = group.series[seriesIndex];

            var dashStyle = serie.dashStyle || group.dashStyle || '';

            var opacity = serie.opacity || group.opacity;
            if (isNaN(opacity) || opacity < 0 || opacity > 1)
                opacity = 1;

            var stroke = serie.lineWidth;
            if (isNaN(stroke) && stroke != 'auto')
                stroke = group.lineWidth;

            if (stroke == 'auto' || isNaN(stroke) || stroke < 0 || stroke > 15) {
                if (isArea)
                    stroke = 2;
                else if (isLine)
                    stroke = 3;
                else
                    stroke = 1;
            }

            var strokeSymbol = serie.lineWidthSymbol;
            if (isNaN(strokeSymbol))
                strokeSymbol = 1;

            return { stroke: stroke, strokeSymbol: strokeSymbol, opacity: opacity, dashStyle: dashStyle };
        },

        /** @private */
        _getColors: function (gidx, sidx, iidx, gradientType, gradientStops) {
            var group = this.seriesGroups[gidx];
            var serie = group.series[sidx];

            var useGradient = this._get([serie.useGradientColors, group.useGradientColors, group.useGradient, true]);

            var colors = this._getSeriesColors(gidx, sidx, iidx);

            if (!colors.fillColor) {
                colors.fillColor = color;
                colors.fillColorSelected = $.jqx.adjustColor(color, 1.1);
                colors.fillColorAlt = $.jqx.adjustColor(color, 4.0);
                colors.fillColorAltSelected = $.jqx.adjustColor(color, 3.0);
                colors.lineColor = colors.symbolColor = $.jqx.adjustColor(color, 0.9);
                colors.lineColorSelected = colors.symbolColorSelected = $.jqx.adjustColor(color, 0.9);
            }

            var stops2 = [[0, 1.4], [100, 1]];
            var stops4 = [[0, 1], [25, 1.1], [50, 1.4], [100, 1]];
            var stopsR = [[0, 1.3], [90, 1.2], [100, 1.0]];

            var stops = NaN;
            if (!isNaN(gradientStops)) {
                stops = gradientStops == 2 ? stops2 : stops4;
            }

            if (useGradient) {
                var copy = {};
                for (var i in colors)
                    copy[i] = colors[i];

                colors = copy;

                if (gradientType == 'verticalLinearGradient' || gradientType == 'horizontalLinearGradient') {
                    var stopsParam = gradientType == 'verticalLinearGradient' ? stops || stops2 : stops || stops4;
                    var keys = ['fillColor', 'fillColorSelected', 'fillColorAlt', 'fillColorAltSelected'];
                    for (var key in keys) {
                        var color = colors[keys[key]];
                        if (color)
                            colors[keys[key]] = this.renderer._toLinearGradient(color, gradientType == 'verticalLinearGradient', stopsParam);
                    }
                }
                else if (gradientType == 'radialGradient') {
                    var params;
                    var stops = stops2;
                    if ((group.type == 'pie' || group.type == 'donut' || group.polar) && iidx != undefined && this._renderData[gidx] && this._renderData[gidx].offsets[sidx]) {
                        params = this._renderData[gidx].offsets[sidx][iidx];
                        stops = stopsR;
                    }

                    colors.fillColor = this.renderer._toRadialGradient(colors.fillColor, stops, params);
                    colors.fillColorSelected = this.renderer._toRadialGradient(colors.fillColorSelected, stops, params);
                }
            }

            return colors;
        },

        /** @private */
        _installHandlers: function (element, elementType, gidx, sidx, iidx) {
            if (!this.enableEvents)
                return false;

            var self = this;
            var g = this.seriesGroups[gidx];
            var s = this.seriesGroups[gidx].series[sidx];

            var isLineType = g.type.indexOf('line') != -1 || g.type.indexOf('area') != -1;

            if (!isLineType && !(g.enableSelection == false || s.enableSelection == false)) {
                this.renderer.addHandler(element, 'mousemove', function (e) {
                    var selected = self._selected;
                    if (selected && selected.isLineType && selected.linesUnselectMode == 'click' && !(selected.group == gidx && selected.series == sidx))
                        return;

                    //e.preventDefault();

                    var x = e.pageX || e.clientX || e.screenX;
                    var y = e.pageY || e.clientY || e.screenY;

                    var pos = self.host.offset();
                    x -= pos.left;
                    y -= pos.top;

                    if (self._mouseX == x && self._mouseY == y)
                        return;

                    if (self._ttEl) {
                        if (self._ttEl.gidx == gidx &&
                        self._ttEl.sidx == sidx &&
                        self._ttEl.iidx == iidx)
                            return;
                    }

                    self._startTooltipTimer(gidx, sidx, iidx);
                });

                this.renderer.addHandler(element, 'mouseout', function (e) {
                    return;
                    if (!isNaN(self._lastClickTs) && (new Date()).valueOf() - self._lastClickTs < 100)
                        return;

                    //e.preventDefault();

                    if (iidx != undefined)
                        self._cancelTooltipTimer();

                    if (isLineType)
                        return;

                    var selected = self._selected;
                    if (selected && selected.isLineType && selected.linesUnselectMode == 'click' && !(selected.group == gidx && selected.series == sidx))
                        return;

                    self._unselect();
                });
            }

            if (!(g.enableSelection == false || s.enableSelection == false)) {
                this.renderer.addHandler(element, 'mouseover', function (e) {
                    //e.preventDefault();

                    var selected = self._selected;
                    if (selected && selected.isLineType && selected.linesUnselectMode == 'click' && !(selected.group == gidx && selected.series == sidx))
                        return;

                    self._select(element, elementType, gidx, sidx, iidx, iidx);
                });
            }

            this.renderer.addHandler(element, 'click', function (e) {
                clearTimeout(self._hostClickTimer);

                self._lastClickTs = (new Date()).valueOf();

                if (isLineType && (elementType != 'symbol' && elementType != 'pointMarker'))
                    return;

                if (self._isColumnType(g.type))
                    self._unselect();

                if (isNaN(iidx))
                    return;

                e.stopImmediatePropagation();
                self._raiseItemEvent('click', g, s, iidx);
            });
        },

        /** @private */
        _getHorizontalOffset: function (gidx, sidx, x, y) {
            var rect = this._plotRect;
            var dataLength = this._getDataLen(gidx);
            if (dataLength == 0)
                return { index: undefined, value: x };

            var renderData = this._calcGroupOffsets(gidx, this._plotRect);
            if (renderData.xoffsets.length == 0)
                return { index: undefined, value: undefined };

            var px = x;
            var py = y;

            var g = this.seriesGroups[gidx];

            var polarAxisCoords;
            if (g.polar || g.spider)
                polarAxisCoords = this._getPolarAxisCoords(gidx, rect);

            var inverse = this._getXAxis(gidx).flip == true;

            var minDist, idx, x1Selected, y1Selected;

            for (var i = renderData.xoffsets.first; i <= renderData.xoffsets.last; i++) {
                var x1 = renderData.xoffsets.data[i];
                var y1 = renderData.offsets[sidx][i].to;

                var dist = 0;

                if (polarAxisCoords) {
                    var point = this._toPolarCoord(polarAxisCoords, rect, x1 + rect.x, y1);
                    x1 = point.x;
                    y1 = point.y;
                    dist = $.jqx._ptdist(px, py, x1, y1);
                }
                else {
                    if (g.orientation == 'horizontal') {
                        x1 += rect.y;
                        var tmp = y1;
                        y1 = x1;
                        x1 = tmp;
                        dist = $.jqx._ptdist(px, py, x1, y1);
                    }
                    else {
                        x1 += rect.x;
                        dist = Math.abs(px - x1);
                    }
                }

                if (isNaN(minDist) || minDist > dist) {
                    minDist = dist;
                    idx = i;
                    x1Selected = x1;
                    y1Selected = y1;

                }
            }

            return { index: idx, value: renderData.xoffsets.data[idx], polarAxisCoords: polarAxisCoords, x: x1Selected, y: y1Selected };
        },

        /** @private */
        onmousemove: function (x, y) {
            if (this._mouseX == x && this._mouseY == y)
                return;

            this._mouseX = x;
            this._mouseY = y;

            if (!this._selected)
                return;

            var gidx = this._selected.group;
            var sidx = this._selected.series;
            var g = this.seriesGroups[gidx];
            var s = g.series[sidx];

            var rect = this._plotRect;
            if (this.renderer) {
                rect = this.renderer.getRect();
                rect.x += 5;
                rect.y += 5;
                rect.width -= 10;
                rect.height -= 10;
            }

            if (x < rect.x || x > rect.x + rect.width ||
                y < rect.y || y > rect.y + rect.height) {
                this._hideToolTip();
                this._unselect();
                return;
            }

            var inverse = g.orientation == 'horizontal';

            var rect = this._plotRect;
            if (g.type.indexOf('line') != -1 || g.type.indexOf('area') != -1) {
                var offset = this._getHorizontalOffset(gidx, this._selected.series, x, y);
                var i = offset.index;
                if (i == undefined)
                    return;

                if (this._selected.item != i) {
                    var segs = this._linesRenderInfo[gidx][sidx].segments;
                    var segId = 0;

                    while (i > segs[segId].lastItemIndex) {
                        segId++;
                        if (segId >= segs.length)
                            return;
                    }


                    var element = segs[segId].pathElement;
                    var iidxBase = segs[segId].lastItemIndex;

                    this._unselect(false);

                    this._select(element, 'path', gidx, sidx, i, iidxBase);
                }
                //  else
                //      return;

                var symbolType = this._getSymbol(this._selected.group, this._selected.series);
                if (symbolType == 'none')
                    symbolType = 'circle';

                var renderData = this._calcGroupOffsets(gidx, rect);
                var to = renderData.offsets[this._selected.series][i].to;

                var from = to;
                if (g.type.indexOf('range') != -1) {
                    from = renderData.offsets[this._selected.series][i].from;
                }

                var cmp = inverse ? x : y;
                if (!isNaN(from) && Math.abs(cmp - from) < Math.abs(cmp - to))
                    y = from;
                else
                    y = to;

                if (isNaN(y))
                    return;

                x = offset.value;

                if (inverse) {
                    var tmp = x;
                    x = y;
                    y = tmp + rect.y;
                }
                else {
                    x += rect.x;
                }

                if (offset.polarAxisCoords) {
                    x = offset.x;
                    y = offset.y;
                }

                y = $.jqx._ptrnd(y);
                x = $.jqx._ptrnd(x);

                if (this._pointMarker && this._pointMarker.element) {
                    this.renderer.removeElement(this._pointMarker.element);
                    this._pointMarker.element = undefined;
                }

                if (isNaN(x) || isNaN(y)) {
                    return;
                }

                var colors = this._getSeriesColors(gidx, sidx, i);
                var settings = this._getSerieSettings(gidx, sidx);

                var symbolSize = s.symbolSizeSelected;
                if (isNaN(symbolSize))
                    symbolSize = s.symbolSize;
                if (isNaN(symbolSize) || symbolSize > 50 || symbolSize < 0)
                    symbolSize = g.symbolSize;
                if (isNaN(symbolSize) || symbolSize > 50 || symbolSize < 0)
                    symbolSize = 8;

                if (this.showToolTips || this.enableCrosshairs) {
                    this._pointMarker = { type: symbolType, x: x, y: y, gidx: gidx, sidx: sidx, iidx: i };
                    this._pointMarker.element = this._drawSymbol(
                        symbolType,
                        x,
                        y,
                        colors.fillColorSymbolSelected,
                        settings.opacity,
                        colors.lineColorSymbolSelected,
                        settings.opacity,
                        settings.strokeSymbol,
                        settings.dashStyle,
                        symbolSize);

                    this._installHandlers(this._pointMarker.element, 'pointMarker', gidx, sidx, i);
                }

                this._startTooltipTimer(gidx, this._selected.series, i);
            }
        },

        /** @private */
        _drawSymbol: function (type, x, y, fillColor, fillOpacity, lineColor, lineOpacity, lineWidth, lineDashArray, size) {
            var element;
            var sz = size || 6;
            var sz2 = sz / 2;
            switch (type) {
                case 'none':
                    return undefined;
                case 'circle':
                    element = this.renderer.circle(x, y, sz / 2);
                    break;
                case 'square':
                    sz = sz - 1; sz2 = sz / 2;
                    element = this.renderer.rect(x - sz2, y - sz2, sz, sz);
                    break;
                case 'diamond':
                    {
                        var path = 'M ' + (x - sz2) + ',' + (y) + ' L' + (x) + ',' + (y - sz2) + ' L' + (x + sz2) + ',' + (y) + ' L' + (x) + ',' + (y + sz2) + ' Z';
                        element = this.renderer.path(path);
                    } break;
                case 'triangle_up': case 'triangle':
                    {
                        var path = 'M ' + (x - sz2) + ',' + (y + sz2) + ' L ' + (x + sz2) + ',' + (y + sz2) + ' L ' + (x) + ',' + (y - sz2) + ' Z';
                        element = this.renderer.path(path);
                    } break;
                case 'triangle_down':
                    {
                        var path = 'M ' + (x - sz2) + ',' + (y - sz2) + ' L ' + (x) + ',' + (y + sz2) + ' L ' + (x + sz2) + ',' + (y - sz2) + ' Z';
                        element = this.renderer.path(path);
                    } break;
                case 'triangle_left':
                    {
                        var path = 'M ' + (x - sz2) + ',' + (y) + ' L ' + (x + sz2) + ',' + (y + sz2) + ' L ' + (x + sz2) + ',' + (y - sz2) + ' Z';
                        element = this.renderer.path(path);
                    } break;
                case 'triangle_right':
                    {
                        var path = 'M ' + (x - sz2) + ',' + (y - sz2) + ' L ' + (x - sz2) + ',' + (y + sz2) + ' L ' + (x + sz2) + ',' + (y) + ' Z';
                        element = this.renderer.path(path);
                    } break;
                default:
                    element = this.renderer.circle(x, y, sz);
            }

            this.renderer.attr(element, { fill: fillColor, 'fill-opacity': fillOpacity, stroke: lineColor, 'stroke-width': lineWidth, 'stroke-opacity': lineOpacity, 'stroke-dasharray': lineDashArray || '' });

            // pass extra parameters required for HTML5 rendering
            if (type != 'circle') {
                this.renderer.attr(element, { r: sz / 2 });
                if (type != 'square')
                    this.renderer.attr(element, { x: x, y: y });
            }

            return element;
        },

        /** @private */
        _getSymbol: function (groupIndex, seriesIndex) {
            var symbols = ['circle', 'square', 'diamond', 'triangle_up', 'triangle_down', 'triangle_left', 'triangle_right'];
            var g = this.seriesGroups[groupIndex];
            var s = g.series[seriesIndex];
            var symbolType;
            if (s.symbolType != undefined)
                symbolType = s.symbolType;
            if (symbolType == undefined)
                symbolType = g.symbolType;

            if (symbolType == 'default')
                return symbols[seriesIndex % symbols.length];
            else if (symbolType != undefined)
                return symbolType;

            return 'none';
        },

        /** @private */
        _startTooltipTimer: function (gidx, sidx, iidx, x, y, showDelay, hideDelay) {
            this._cancelTooltipTimer();
            var self = this;
            var g = self.seriesGroups[gidx];
            var delay = this.toolTipShowDelay || this.toolTipDelay;
            if (isNaN(delay) || delay > 10000 || delay < 0)
                delay = 500;

            if (this._ttEl || (true == this.enableCrosshairs && false == this.showToolTips))
                delay = 0;

            if (!isNaN(showDelay))
                delay = showDelay;

            clearTimeout(this._tttimerHide);

            if (isNaN(x))
                x = self._mouseX;

            if (isNaN(y))
                y = self._mouseY - 3;

            if (delay == 0)
                self._showToolTip(x, y, gidx, sidx, iidx);

            this._tttimer = setTimeout(function () {
                if (delay != 0)
                    self._showToolTip(x, y, gidx, sidx, iidx);

                var toolTipHideDelay = self.toolTipHideDelay;
                if (!isNaN(hideDelay))
                    toolTipHideDelay = hideDelay;

                if (isNaN(toolTipHideDelay))
                    toolTipHideDelay = 4000;

                self._tttimerHide = setTimeout(function () {
                    self._hideToolTip();
                    self._unselect();
                }, toolTipHideDelay);
            }, delay);
        },

        /** @private */
        _cancelTooltipTimer: function () {
            clearTimeout(this._tttimer);
        },

        /** @private */
        _getGroupGradientType: function (gidx) {
            var g = this.seriesGroups[gidx];

            if (g.type.indexOf('area') != -1)
                return g.orientation == 'horizontal' ? 'horizontalLinearGradient' : 'verticalLinearGradient';
            else if (this._isColumnType(g.type) || g.type.indexOf('candle') != -1) {
                if (g.polar)
                    return 'radialGradient';
                return g.orientation == 'horizontal' ? 'verticalLinearGradient' : 'horizontalLinearGradient';
            }
            else if (g.type.indexOf('scatter') != -1 || g.type.indexOf('bubble') != -1 || this._isPieGroup(gidx))
                return 'radialGradient';

            return undefined;
        },

        /** @private */
        _select: function (element, type, gidx, sidx, iidx, iidxBase) {
            if (this._selected) {
                if ((this._selected.item != iidx ||
                    this._selected.series != sidx ||
                    this._selected.group != gidx)
                    ) {
                    this._unselect();
                }
                else {
                    return;
                }
            }

            var g = this.seriesGroups[gidx];
            var s = g.series[sidx];

            if (g.enableSelection == false || s.enableSelection == false)
                return;

            var isLineType = g.type.indexOf('line') != -1 && g.type.indexOf('area') == -1;

            this._selected = { element: element, type: type, group: gidx, series: sidx, item: iidx, iidxBase: iidxBase, isLineType: isLineType, linesUnselectMode: s.linesUnselectMode || g.linesUnselectMode };

            var colors = this._getColors(gidx, sidx, iidxBase || iidx, this._getGroupGradientType(gidx));
            var fillColor = colors.fillColorSelected;
            if (isLineType)
                fillColor = 'none';

            var settings = this._getSerieSettings(gidx, sidx);

            var lineColorSelected = (type == 'symbol') ? colors.lineColorSymbolSelected : colors.lineColorSelected;
            fillColor = (type == 'symbol') ? colors.fillColorSymbolSelected : fillColor;

            var lineWidth = (type == 'symbol') ? 1 : settings.stroke;

            if (this.renderer.getAttr(element, 'fill') == colors.fillColorAlt)
                fillColor = colors.fillColorAltSelected;

            this.renderer.attr(element, { 'stroke': lineColorSelected, fill: fillColor, 'stroke-width': lineWidth });

            if (g.type.indexOf('pie') != -1 || g.type.indexOf('donut') != -1) {
                this._applyPieSelect();
            }

            // raise mouseover event
            this._raiseItemEvent('mouseover', g, s, iidx);
        },

        _applyPieSelect: function () {
            var self = this;

            self._createAnimationGroup("animPieSlice");

            var selected = this._selected;
            if (!selected)
                return;

            var coord = this.getItemCoord(selected.group, selected.series, selected.item);
            if (!coord)
                return;

            var element = this._getRenderInfo(selected.group, selected.series, selected.item);
            var ctx = { element: element, coord: coord };

            this._enqueueAnimation(
                        "animPieSlice",
                        undefined,
                        undefined,
                        300,
                        function (element, ctx, percent) {
                            var coord = ctx.coord;
                            var radiusAdj = coord.selectedRadiusChange * percent;
                            var cmd = self.renderer.pieSlicePath(coord.center.x, coord.center.y, coord.innerRadius == 0 ? 0 : (coord.innerRadius + radiusAdj), coord.outerRadius + radiusAdj, coord.fromAngle, coord.toAngle, coord.centerOffset);
                            self.renderer.attr(ctx.element.element, { 'd': cmd });

                            self._showPieLabel(selected.group, selected.series, selected.item, undefined, radiusAdj);
                        },
                        ctx);

            self._startAnimation("animPieSlice");
        },

        _applyPieUnselect: function () {
            this._stopAnimations();

            var selected = this._selected;
            if (!selected)
                return;

            var coord = this.getItemCoord(selected.group, selected.series, selected.item);
            if (!coord || !coord.center)
                return;

            var cmd = this.renderer.pieSlicePath(coord.center.x, coord.center.y, coord.innerRadius, coord.outerRadius, coord.fromAngle, coord.toAngle, coord.centerOffset);
            this.renderer.attr(selected.element, { 'd': cmd });

            this._showPieLabel(selected.group, selected.series, selected.item, undefined, 0);
        },

        /** @private */
        _unselect: function () {
            var self = this;

            if (self._selected) {
                var gidx = self._selected.group;
                var sidx = self._selected.series;
                var iidx = self._selected.item;
                var iidxBase = self._selected.iidxBase;
                var type = self._selected.type;
                var g = self.seriesGroups[gidx];
                var s = g.series[sidx];

                var isLineType = g.type.indexOf('line') != -1 && g.type.indexOf('area') == -1;

                var colors = self._getColors(gidx, sidx, iidxBase || iidx, self._getGroupGradientType(gidx));
                var fillColor = colors.fillColor;
                if (isLineType)
                    fillColor = 'none';

                var settings = self._getSerieSettings(gidx, sidx);

                var lineColor = (type == 'symbol') ? colors.lineColorSymbol : colors.lineColor;
                fillColor = (type == 'symbol') ? colors.fillColorSymbol : fillColor;

                if (this.renderer.getAttr(self._selected.element, 'fill') == colors.fillColorAltSelected)
                    fillColor = colors.fillColorAlt;

                var lineWidth = (type == 'symbol') ? 1 : settings.stroke;

                self.renderer.attr(self._selected.element, { 'stroke': lineColor, fill: fillColor, 'stroke-width': lineWidth });

                if (g.type.indexOf('pie') != -1 || g.type.indexOf('donut') != -1) {
                    this._applyPieUnselect();
                }

                self._selected = undefined;

                if (!isNaN(iidx))
                    self._raiseItemEvent('mouseout', g, s, iidx);
            }

            if (self._pointMarker) {
                if (self._pointMarker.element) {
                    self.renderer.removeElement(self._pointMarker.element);
                    self._pointMarker.element = undefined;
                }
                self._pointMarker = undefined;
                self._hideCrosshairs();
            }
        },

        /** @private */
        _raiseItemEvent: function (event, group, serie, index) {
            var fn = serie[event] || group[event];
            var gidx = 0;
            for (; gidx < this.seriesGroups.length; gidx++)
                if (this.seriesGroups[gidx] == group)
                    break;
            if (gidx == this.seriesGroups.length)
                return;

            var args = { event: event, seriesGroup: group, serie: serie, elementIndex: index, elementValue: this._getDataValue(index, serie.dataField, gidx) };
            if (fn && $.isFunction(fn))
                fn(args);

            this._raiseEvent(event, args);
        },

        _raiseEvent: function (name, args) {
            var event = new $.Event(name);
            event.owner = this;
            args.event = name;
            event.args = args;

            var result = this.host.trigger(event);

            return result;
        },

        /** @private */
        _calcInterval: function (min, max, countHint) {
            var diff = Math.abs(max - min);

            var approx = diff / countHint;

            var up = [1, 2, 3, 4, 5, 10, 15, 20, 25, 50, 100];
            var dw = [0.5, 0.25, 0.125, 0.1];

            var scale = 0.1;
            var arr = up;

            if (approx < 1) {
                arr = dw;
                scale = 10;
            }

            var idx = 0;

            do {
                idx = 0;
                if (approx >= 1)
                    scale *= 10;
                else
                    scale /= 10;

                for (var i = 1; i < arr.length; i++) {
                    if (Math.abs(arr[idx] * scale - approx) > Math.abs(arr[i] * scale - approx))
                        idx = i;
                    else
                        break;
                }
            }
            while (idx == arr.length - 1);

            return arr[idx] * scale;
        },

        //** @private */
        _renderDataClone: function () {
            if (!this._renderData || this._isToggleRefresh)
                return;

            var info = this._elementRenderInfo = [];

            if (this._isSelectorRefresh)
                return;

            for (var groupIndex = 0; groupIndex < this._renderData.length; groupIndex++) {
                var catField = this._getXAxis(groupIndex).dataField;

                while (info.length <= groupIndex)
                    info.push({});

                var groupInfo = info[groupIndex];
                var data = this._renderData[groupIndex];
                if (!data.offsets)
                    continue;

                if (data.valueAxis) {
                    groupInfo.valueAxis = { itemOffsets: {} };
                    for (var key in data.valueAxis.itemOffsets) {
                        groupInfo.valueAxis.itemOffsets[key] = data.valueAxis.itemOffsets[key];
                    }
                }

                if (data.xAxis) {
                    groupInfo.xAxis = { itemOffsets: {} };
                    for (var key in data.xAxis.itemOffsets) {
                        groupInfo.xAxis.itemOffsets[key] = data.xAxis.itemOffsets[key];
                    }
                }

                groupInfo.series = [];
                var series = groupInfo.series;

                var isPieSeries = this._isPieGroup(groupIndex);

                for (var s = 0; s < data.offsets.length; s++) {
                    series.push({});
                    for (var i = 0; i < data.offsets[s].length; i++)
                        if (!isPieSeries) {
                            series[s][data.xoffsets.xvalues[i]] = { value: data.offsets[s][i].value, /*valueFrom: data.offsets[s][i].valueFrom,*/valueRadius: data.offsets[s][i].valueRadius, xoffset: data.xoffsets.data[i], from: data.offsets[s][i].from, to: data.offsets[s][i].to };
                        }
                        else {
                            var item = data.offsets[s][i];
                            series[s][item.displayValue] = { value: item.value, x: item.x, y: item.y, fromAngle: item.fromAngle, toAngle: item.toAngle };
                        }
                }
            }
        },

        getPolarDataPointOffset: function (xValue, yValue, groupIndex) {
            var renderData = this._renderData[groupIndex];
            if (!renderData)
                return { x: NaN, y: NaN };

            var y = this.getValueAxisDataPointOffset(yValue, groupIndex);
            var x = this.getXAxisDataPointOffset(xValue, groupIndex);

            var pt = this._toPolarCoord(renderData.polarCoords, renderData.xAxis.rect, x, y);

            return { x: pt.x, y: pt.y };
        },

        /** @private */
        _getDataPointOffsetDiff: function (value1, value2, baseValue, logBase, scale, yzero, inverse) {
            var offset1 = this._getDataPointOffset(value1, baseValue, logBase, scale, yzero, inverse);
            var offset2 = this._getDataPointOffset(value2, baseValue, logBase, scale, yzero, inverse);

            return Math.abs(offset1 - offset2);
        },

        _getXAxisRenderData: function (groupIndex) {
            if (groupIndex >= this._renderData.length)
                return;

            var group = this.seriesGroups[groupIndex];

            var renderData = this._renderData[groupIndex].xAxis;
            if (!renderData)
                return;

            if (group.xAxis == undefined) {
                // get common xAxis render data (it will be attached to the 1st group)
                for (var i = 0; i <= groupIndex; i++)
                    if (this.seriesGroups[i].xAxis == undefined)
                        break;

                renderData = this._renderData[i].xAxis;
            }

            return renderData;
        },

        getXAxisDataPointOffset: function (value, groupIndex) {
            var group = this.seriesGroups[groupIndex]

            if (isNaN(value))
                return NaN;

            renderData = this._getXAxisRenderData(groupIndex);
            if (!renderData)
                return NaN;

            var stats = renderData.data.axisStats;

            var axisMin = stats.min.valueOf();
            var axisMax = stats.max.valueOf();

            var denom = axisMax - axisMin;
            if (denom == 0)
                denom = 1;

            if (value.valueOf() > axisMax || value.valueOf() < axisMin)
                return NaN;

            var axis = this._getXAxis(groupIndex);
            var sizeProp = group.orientation == 'horizontal' ? 'height' : 'width';
            var xProp = group.orientation == 'horizontal' ? 'y' : 'x';

            var percent = (value.valueOf() - axisMin) / denom;

            var size = renderData.rect[sizeProp] - renderData.data.padding.left - renderData.data.padding.right;

            if (group.polar || group.spider) {
                var polarCoords = this._renderData[groupIndex].polarCoords;

                if (polarCoords.isClosedCircle)
                    size = renderData.data.axisSize;
            }

            return this._plotRect[xProp] + renderData.data.padding.left + size * (axis.flip ? (1 - percent) : percent);
        },


        getValueAxisDataPointOffset: function (value, groupIndex) {
            var valueAxis = this._getValueAxis(groupIndex);
            if (!valueAxis)
                return NaN;

            var renderData = this._renderData[groupIndex];
            if (!renderData)
                return NaN;

            var flip = valueAxis.flip == true;
            var logBase = renderData.logBase;
            var scale = renderData.scale;
            var baseValue = renderData.gbase;
            var yzero = renderData.baseOffset;

            return this._getDataPointOffset(value, baseValue, logBase, scale, yzero, flip);
        },

        /** @private */
        _getDataPointOffset: function (value, baseValue, logBase, scale, yzero, inverse) {
            var offset;

            if (isNaN(value))
                value = baseValue;

            if (!isNaN(logBase)) {
                offset = ($.jqx.log(value, logBase) - $.jqx.log(baseValue, logBase)) * scale;
            }
            else {
                offset = (value - baseValue) * scale;
            }

            if (this._isVML) {
                offset = Math.round(offset);
            }

            if (inverse)
                offset = yzero + offset;
            else
                offset = yzero - offset;

            return offset;
        },

        /** @private */
        _calcGroupOffsets: function (groupIndex, rect) {
            var group = this.seriesGroups[groupIndex];

            while (this._renderData.length < groupIndex + 1)
                this._renderData.push({});

            if (this._renderData[groupIndex] != null && this._renderData[groupIndex].offsets != undefined)
                return this._renderData[groupIndex];

            if (this._isPieGroup(groupIndex)) {
                return this._calcPieSeriesGroupOffsets(groupIndex, rect);
            }

            var valueAxis = this._getValueAxis(groupIndex);

            if (!valueAxis || !group.series || group.series.length == 0)
                return this._renderData[groupIndex];

            var inverse = valueAxis.flip == true;
            var logAxis = valueAxis.logarithmicScale == true;
            var logBase = valueAxis.logarithmicScaleBase || 10;

            var out = [];

            var isStacked = group.type.indexOf("stacked") != -1;
            var isStacked100 = isStacked && group.type.indexOf("100") != -1;
            var isRange = group.type.indexOf("range") != -1;
            var isColumn = this._isColumnType(group.type);
            var isWaterfall = group.type.indexOf('waterfall') != -1;


            var dataLength = this._getDataLen(groupIndex);
            var gbase = group.baselineValue || valueAxis.baselineValue || 0;
            if (isStacked100)
                gbase = 0;

            var stat = this._stats.seriesGroups[groupIndex];
            if (!stat || !stat.isValid)
                return;

            var hasValuesOnBothSidesOfBase = stat.hasStackValueReversal;
            if (hasValuesOnBothSidesOfBase)
                gbase = 0;

            if (isWaterfall && isStacked)
                if (hasValuesOnBothSidesOfBase) // not supported
                    return;
                else
                    gbase = stat.base;

            if (gbase > stat.max)
                gbase = stat.max;
            if (gbase < stat.min)
                gbase = stat.min;

            var range = (isStacked100 || logAxis) ? stat.maxRange : stat.max - stat.min;

            var min = stat.min;
            var max = stat.max;

            var scale = rect.height / (logAxis ? stat.intervals : range);

            var yzero = 0;
            if (isStacked100) {
                if (min * max < 0) {
                    range /= 2;
                    yzero = -(range + gbase) * scale;
                }
                else {
                    yzero = -gbase * scale;
                }
            }
            else
                yzero = -(gbase - min) * scale;

            if (inverse)
                yzero = rect.y - yzero;
            else
                yzero += rect.y + rect.height;

            var yPOffset = [];
            var yNOffset = [];
            var yOffsetError = [];

            var pIntervals, nIntervals;
            if (logAxis) {
                pIntervals = $.jqx.log(max, logBase) - $.jqx.log(gbase, logBase);
                if (isStacked) // force base value @ min for stacked log series
                {
                    pIntervals = stat.intervals;
                    gbase = isStacked100 ? 0 : min;
                }

                nIntervals = stat.intervals - pIntervals;
                if (!inverse)
                    yzero = rect.y + pIntervals / stat.intervals * rect.height;
            }

            yzero = $.jqx._ptrnd(yzero);

            var th = (min * max < 0) ? rect.height / 2 : rect.height;

            var logSums = [];

            var stackSums = [];
            var useOffsetBasedStackCalculation = isStacked && (isColumn || logAxis);

            var firstItemRendered = [];

            out = new Array(group.series.length);
            for (var j = 0; j < group.series.length; j++)
                out[j] = new Array(dataLength);

            for (var i = 0; i < dataLength; i++) {
                if (!isWaterfall && isStacked)
                    stackSums = [];

                for (var j = 0; j < group.series.length; j++) {
                    if (!isStacked && logAxis)
                        logSums = [];

                    var serie = group.series[j];

                    var dataField = serie.dataField;
                    var dataFieldFrom = serie.dataFieldFrom;
                    var dataFieldTo = serie.dataFieldTo;
                    var dataFieldRadius = serie.radiusDataField || serie.sizeDataField;

                    out[j][i] = {};

                    var isVisible = this._isSerieVisible(groupIndex, j);

                    if (group.type.indexOf('candle') != -1 || group.type.indexOf('ohlc') != -1) {
                        // handle financial series
                        var fields = ['Open', 'Close', 'High', 'Low'];
                        for (var f in fields) {
                            var field = 'dataField' + fields[f];
                            if (serie[field]) {
                                out[j][i][fields[f]] = this._getDataPointOffset(
                                    this._getDataValueAsNumber(i, serie[field], groupIndex),
                                    gbase,
                                    logAxis ? logBase : NaN,
                                    scale,
                                    yzero,
                                    inverse);
                            }
                        }

                        continue;
                    }

                    if (isStacked) {
                        while (stackSums.length <= i)
                            stackSums.push(0);
                    }

                    var valFrom = NaN;
                    if (isRange) {
                        valFrom = this._getDataValueAsNumber(i, dataFieldFrom, groupIndex);
                        if (isNaN(valFrom))
                            valFrom = gbase;
                    }

                    var val = NaN;
                    if (isRange)
                        val = this._getDataValueAsNumber(i, dataFieldTo, groupIndex);
                    else
                        val = this._getDataValueAsNumber(i, dataField, groupIndex);

                    var valR = this._getDataValueAsNumber(i, dataFieldRadius, groupIndex);
                    if (isStacked)
                        stackSums[i] += isVisible ? val : 0;

                    if (!isVisible)
                        val = NaN;

                    if (isNaN(val) || (logAxis && val <= 0)) {
                        out[j][i] = { from: undefined, to: undefined };
                        continue;
                    }

                    var yOffset;

                    if (isStacked) {
                        if (useOffsetBasedStackCalculation) {
                            yOffset = (val >= gbase) ? yPOffset : yNOffset;
                        }
                        else
                            val = stackSums[i];
                    }

                    var h = scale * (val - gbase);

                    if (isRange)
                        h = scale * (val - valFrom);

                    if (isStacked && useOffsetBasedStackCalculation) {
                        if (!firstItemRendered[i]) {
                            firstItemRendered[i] = true;
                            h = scale * (val - gbase);
                        }
                        else {
                            h = scale * val;
                        }
                    }

                    if (logAxis) {
                        while (logSums.length <= i)
                            logSums.push({ p: { value: 0, height: 0 }, n: { value: 0, height: 0} });

                        var base = (isRange || isRange) ? valFrom : gbase;
                        var sums = val > base ? logSums[i].p : logSums[i].n;

                        sums.value += val;

                        if (isStacked100) {
                            val = sums.value / (stat.psums[i] + stat.nsums[i]) * 100;
                            h = ($.jqx.log(val, logBase) - stat.minPow) * scale;
                        }
                        else {
                            h = $.jqx.log(sums.value, logBase) - $.jqx.log(base, logBase);

                            h *= scale;
                        }

                        h -= sums.height;
                        sums.height += h;
                    }

                    var y = yzero;
                    if (isRange) {
                        var yDiff = 0;
                        if (logAxis)
                            yDiff = ($.jqx.log(valFrom, logBase) - $.jqx.log(gbase, logBase)) * scale;
                        else
                            yDiff = (valFrom - gbase) * scale;

                        y += inverse ? yDiff : -yDiff;
                    }

                    if (isStacked) {
                        if (isStacked100 && !logAxis) {
                            var irange = (stat.psums[i] - stat.nsums[i]);

                            if (val > gbase) {
                                h = (stat.psums[i] / irange) * th;
                                if (stat.psums[i] != 0)
                                    h *= val / stat.psums[i];
                            }
                            else {
                                h = (stat.nsums[i] / irange) * th;
                                if (stat.nsums[i] != 0)
                                    h *= val / stat.nsums[i];
                            }
                        }

                        if (useOffsetBasedStackCalculation) {
                            if (isNaN(yOffset[i]))
                                yOffset[i] = y;

                            y = yOffset[i];
                        }
                    }

                    if (isNaN(yOffsetError[i]))
                        yOffsetError[i] = 0;

                    var err = yOffsetError[i];

                    h = Math.abs(h);
                    var hSave = h;
                    if (h >= 1) {
                        h_new = this._isVML ? Math.round(h) : $.jqx._ptrnd(h) - 1;
                        if (Math.abs(h - h_new) > 0.5)
                            h = Math.round(h);
                        else
                            h = h_new;
                    }

                    err += h - hSave;

                    if (!isStacked)
                        err = 0;

                    if (Math.abs(err) > 0.5) {
                        if (err > 0) {
                            h -= 1;
                            err -= 1;
                        }
                        else {
                            h += 1;
                            err += 1;
                        }
                    }

                    yOffsetError[i] = err;

                    // adjust the height to make sure it span the entire height
                    // otherwise there will be a few pixels inaccuracy
                    if (j == group.series.length - 1 && isStacked100) {
                        var sumH = 0;
                        for (var k = 0; k < j; k++)
                            sumH += Math.abs(out[k][i].to - out[k][i].from);
                        sumH += h;
                        if (sumH < th) {
                            if (h > 0.5)
                                h = $.jqx._ptrnd(h + th - sumH);
                            else {
                                var k = j - 1;
                                while (k >= 0) {
                                    var diff = Math.abs(out[k][i].to - out[k][i].from);
                                    if (diff > 1) {
                                        if (out[k][i].from > out[k][i].to) {
                                            out[k][i].from += th - sumH;
                                        }
                                        break;
                                    }
                                    k--;
                                }
                            }
                        }
                    }

                    if (inverse)
                        h *= -1;

                    var drawOpositeDirection = val < gbase;
                    if (isRange)
                        drawOpositeDirection = valFrom > val;

                    var outVal = isNaN(valFrom) ? val : { from: valFrom, to: val };
                    if (drawOpositeDirection) {
                        if (useOffsetBasedStackCalculation)
                            yOffset[i] += h;
                        out[j][i] = { from: y, to: y + h, value: outVal, valueRadius: valR };
                    }
                    else {
                        if (useOffsetBasedStackCalculation)
                            yOffset[i] -= h;
                        out[j][i] = { from: y, to: y - h, value: outVal, valueRadius: valR };
                    }

                } // for j
            } // for i

            var renderData = this._renderData[groupIndex];
            renderData.baseOffset = yzero;
            renderData.gbase = gbase;
            renderData.logBase = logAxis ? logBase : NaN;
            renderData.scale = scale;
            renderData.offsets = !isWaterfall ? out : this._applyWaterfall(out, dataLength, groupIndex, yzero, gbase, logAxis ? logBase : NaN, scale, inverse, isStacked);

            renderData.xoffsets = this._calculateXOffsets(groupIndex, rect.width);

            return this._renderData[groupIndex];
        },

        _isPercent: function (value) {
            return (typeof (value) === 'string' && value.length > 0 && value.indexOf('%') == value.length - 1);
        },

        /** @private */
        _calcPieSeriesGroupOffsets: function (groupIndex, rect) {
            var self = this;
            var dataLength = this._getDataLen(groupIndex);
            var group = this.seriesGroups[groupIndex];

            var renderData = this._renderData[groupIndex] = {};
            var out = renderData.offsets = [];

            for (var sidx = 0; sidx < group.series.length; sidx++) {
                var s = group.series[sidx];
                var minAngle = this._get([s.minAngle, s.startAngle]);
                if (isNaN(minAngle) || minAngle < 0 || minAngle > 360)
                    minAngle = 0;
                var maxAngle = this._get([s.maxAngle, s.endAngle]);
                if (isNaN(maxAngle) || maxAngle < 0 || maxAngle > 360)
                    maxAngle = 360;

                var angleRange = maxAngle - minAngle;

                var initialAngle = s.initialAngle || 0;
                if (initialAngle < minAngle)
                    initialAngle = minAngle;
                if (initialAngle > maxAngle)
                    initialAngle = maxAngle;

                var centerOffset = s.centerOffset || 0;
                var offsetX = $.jqx.getNum([s.offsetX, group.offsetX, rect.width / 2]);
                var offsetY = $.jqx.getNum([s.offsetY, group.offsetY, rect.height / 2]);

                var availableSize = Math.min(rect.width, rect.height) / 2;

                var currentAngle = initialAngle;

                // outer radius
                var radius = s.radius;

                if (self._isPercent(radius))
                    radius = parseFloat(radius) / 100 * availableSize;

                if (isNaN(radius))
                    radius = availableSize * 0.4;

                // inner radius
                var innerRadius = s.innerRadius;
                if (self._isPercent(innerRadius))
                    innerRadius = parseFloat(innerRadius) / 100 * availableSize;

                if (isNaN(innerRadius) || innerRadius >= radius)
                    innerRadius = 0;

                // selected radius
                var selectedRadiusChange = s.selectedRadiusChange;
                if (self._isPercent(selectedRadiusChange))
                    selectedRadiusChange = parseFloat(selectedRadiusChange) / 100 * (radius - innerRadius);

                if (isNaN(selectedRadiusChange))
                    selectedRadiusChange = 0.1 * (radius - innerRadius);


                out.push([]);

                // compute the sum
                var sumP = 0;
                var sumN = 0;
                for (var i = 0; i < dataLength; i++) {
                    var val = this._getDataValueAsNumber(i, s.dataField, groupIndex);
                    if (isNaN(val))
                        continue;

                    if (!this._isSerieVisible(groupIndex, sidx, i) && s.hiddenPointsDisplay != true)
                        continue;

                    if (val > 0)
                        sumP += val;
                    else
                        sumN += val;
                }

                var range = sumP - sumN;
                if (range == 0)
                    range = 1;

                // render
                for (var i = 0; i < dataLength; i++) {
                    var val = this._getDataValueAsNumber(i, s.dataField, groupIndex);
                    if (isNaN(val)) {
                        out[sidx].push({});
                        continue;
                    }

                    var displayField = s.displayText || s.displayField;
                    var displayValue = this._getDataValue(i, displayField, groupIndex);
                    if (displayValue == undefined)
                        displayValue = i;

                    var angle = 0;

                    var isVisible = this._isSerieVisible(groupIndex, sidx, i);
                    if (isVisible || s.hiddenPointsDisplay == true) {
                        angle = Math.abs(val) / range * angleRange;
                    }

                    var x = rect.x + offsetX;
                    var y = rect.y + offsetY;

                    var centerOffsetValue = centerOffset;
                    if ($.isFunction(centerOffset)) {
                        centerOffsetValue = centerOffset({ seriesIndex: sidx, seriesGroupIndex: groupIndex, itemIndex: i });
                    }
                    if (isNaN(centerOffsetValue))
                        centerOffsetValue = 0;

                    var sliceRenderData = { key: groupIndex + '_' + sidx + '_' + i, value: val, displayValue: displayValue, x: x, y: y, fromAngle: currentAngle, toAngle: currentAngle + angle, centerOffset: centerOffsetValue, innerRadius: innerRadius, outerRadius: radius, selectedRadiusChange: selectedRadiusChange, visible: isVisible };
                    out[sidx].push(sliceRenderData);

                    currentAngle += angle;
                }
            }

            return renderData;
        },

        /** @private */
        _isPointSeriesOnly: function () {
            for (var i = 0; i < this.seriesGroups.length; i++) {
                var g = this.seriesGroups[i];
                if (g.type.indexOf('line') == -1 && g.type.indexOf('area') == -1 && g.type.indexOf('scatter') == -1 && g.type.indexOf('bubble') == -1)
                    return false;
            }

            return true;
        },

        /** @private */
        _hasColumnSeries: function () {
            var types = ['column', 'ohlc', 'candlestick', 'waterfall'];
            for (var i = 0; i < this.seriesGroups.length; i++) {
                var g = this.seriesGroups[i];
                for (var j in types)
                    if (g.type.indexOf(types[j]) != -1)
                        return true;
            }

            return false;
        },

        /** @private */
        _alignValuesWithTicks: function (groupIndex) {
            var psonly = this._isPointSeriesOnly();

            var g = this.seriesGroups[groupIndex];

            // if xAxis
            var xAxis = this._getXAxis(groupIndex);
            var xAxisValuesOnTicks = xAxis.valuesOnTicks == undefined ? psonly : xAxis.valuesOnTicks != false;
            if (xAxis.logarithmicScale)
                xAxisValuesOnTicks = true;

            if (groupIndex == undefined)
                return xAxisValuesOnTicks;

            if (g.valuesOnTicks == undefined)
                return xAxisValuesOnTicks;

            return g.valuesOnTicks;
        },

        _getYearsDiff: function (from, to) {
            return to.getFullYear() - from.getFullYear();
        },

        _getMonthsDiff: function (from, to) {
            return 12 * (to.getFullYear() - from.getFullYear()) + to.getMonth() - from.getMonth();
        },

        _getDateDiff: function (from, to, baseUnit, round) {
            var diff = 0;
            if (baseUnit != 'year' && baseUnit != 'month')
                diff = to.valueOf() - from.valueOf();

            switch (baseUnit) {
                case 'year':
                    diff = this._getYearsDiff(from, to);
                    break;
                case 'month':
                    diff = this._getMonthsDiff(from, to);
                    break;
                case 'day':
                    diff /= (24 * 3600 * 1000);
                    break;
                case 'hour':
                    diff /= (3600 * 1000);
                    break;
                case 'minute':
                    diff /= (60 * 1000);
                    break;
                case 'second':
                    diff /= (1000);
                    break;
                case 'millisecond':
                    break;
            }

            if (baseUnit != 'year' && baseUnit != 'month' && round != false)
                diff = $.jqx._rnd(diff, 1, true);

            return diff;
        },

        _getBestDTUnit: function (min, max, groupIndex, axisSize, targetItemWidth) {
            var dateTimeUnit = 'day';

            var range = max.valueOf() - min.valueOf();
            if (range < 1000)
                dateTimeUnit = 'second';
            else if (range < 3600000)
                dateTimeUnit = 'minute';
            else if (range < 86400000)
                dateTimeUnit = 'hour';
            else if (range < 2592000000)
                dateTimeUnit = 'day';
            else if (range < 31104000000)
                dateTimeUnit = 'month';
            else
                dateTimeUnit = 'year';

            var units = [
                    { key: 'year', cnt: range / (1000 * 60 * 60 * 24 * 365) },
                    { key: 'month', cnt: range / (1000 * 60 * 60 * 24 * 30) },
                    { key: 'day', cnt: range / (1000 * 60 * 60 * 24) },
                    { key: 'hour', cnt: range / (1000 * 60 * 60) },
                    { key: 'minute', cnt: range / (1000 * 60) },
                    { key: 'second', cnt: range / 1000 },
                    { key: 'millisecond', cnt: range }
                    ];

            var i = -1;
            for (var j = 0; j < units.length; j++)
                if (units[j].key == dateTimeUnit) {
                    i = j;
                    break;
                }

            var bestCnt = -1, bestIndex = -1;
            for (; i < units.length; i++) {
                if (units[i].cnt / 100 > axisSize)
                    break;
                var interval = this._estAxisInterval(min, max, groupIndex, axisSize, units[i].key, targetItemWidth);
                var cnt = this._getDTIntCnt(min, max, interval, units[i].key);
                if (bestCnt == -1 || bestCnt < cnt) {
                    bestCnt = cnt;
                    bestIndex = i;
                }
            }

            dateTimeUnit = units[bestIndex].key;

            return dateTimeUnit;
        },

        /** @private */
        _getXAxisStats: function (groupIndex, xAxis, axisSize) {
            var dataLength = this._getDataLen(groupIndex);
            var isDateTime = xAxis.type == 'date' || xAxis.type == 'time';

            if (isDateTime && !this._autoDateFormats) {
                if (!this._autoDateFormats)
                    this._autoDateFormats = [];

                var detectedFormat = this._testXAxisDateFormat();
                if (detectedFormat)
                    this._autoDateFormats.push(detectedFormat);
            }

            var axisMin = isDateTime ? this._castAsDate(xAxis.minValue, xAxis.dateFormat) : this._castAsNumber(xAxis.minValue);
            var axisMax = isDateTime ? this._castAsDate(xAxis.maxValue, xAxis.dateFormat) : this._castAsNumber(xAxis.maxValue);

            if (this._selectorRange && this._selectorRange[groupIndex]) {
                var rangeMin = this._selectorRange[groupIndex].min;
                if (!isNaN(rangeMin))
                    axisMin = isDateTime ? this._castAsDate(rangeMin, xAxis.dateFormat) : this._castAsNumber(rangeMin);

                var rangeMax = this._selectorRange[groupIndex].max;
                if (!isNaN(rangeMax))
                    axisMax = isDateTime ? this._castAsDate(rangeMax, xAxis.dateFormat) : this._castAsNumber(rangeMax);
            }

            var min = axisMin, max = axisMax;

            var minDS, maxDS;

            var autoDetect = xAxis.type == undefined || xAxis.type == 'auto';

            var useIndeces = (autoDetect || xAxis.type == 'basic');

            var cntDateTime = 0, cntNumber = 0;
            for (var i = 0; i < dataLength && xAxis.dataField; i++) {
                var value = this._getDataValue(i, xAxis.dataField, groupIndex);
                value = isDateTime ? this._castAsDate(value, xAxis.dateFormat) : this._castAsNumber(value);

                if (isNaN(value))
                    continue;

                if (isDateTime)
                    cntDateTime++;
                else
                    cntNumber++;

                if (isNaN(minDS) || value < minDS)
                    minDS = value;

                if (isNaN(maxDS) || value >= maxDS)
                    maxDS = value;
            }

            if (autoDetect &&
                ((!isDateTime && cntNumber == dataLength) || (isDateTime && cntDateTime == dataLength))
                ) {
                useIndeces = false;
            }

            if (useIndeces) {
                minDS = 0;
                maxDS = Math.max(0, dataLength - 1);
            }

            // use the data source min/max if not set
            if (isNaN(min))
                min = minDS;
            if (isNaN(max))
                max = maxDS;

            // convert to date
            if (isDateTime) {
                if (!this._isDate(min))
                    min = this._isDate(max) ? max : new Date();

                if (!this._isDate(max))
                    max = this._isDate(min) ? min : new Date();
            }
            else {
                if (isNaN(min))
                    min = 0;

                if (isNaN(max))
                    max = useIndeces ? Math.max(0, dataLength - 1) : min;
            }

            if (minDS == undefined)
                minDS = min;

            if (maxDS == undefined)
                maxDS = max;

            // ensure min/max ranges are within the selector ranges
            var rangeSelector = xAxis.rangeSelector;
            if (rangeSelector) {
                var selectorMin = rangeSelector.minValue || min;
                if (selectorMin && isDateTime)
                    selectorMin = this._castAsDate(selectorMin, rangeSelector.dateFormat || xAxis.dateFormat);

                var selectorMax = rangeSelector.maxValue || max;
                if (selectorMax && isDateTime)
                    selectorMax = this._castAsDate(selectorMax, rangeSelector.dateFormat || xAxis.rangeSelector);

                if (min < selectorMin)
                    min = selectorMin;

                if (max < selectorMin)
                    max = selectorMax;

                if (min > selectorMax)
                    min = selectorMin;

                if (max > selectorMax)
                    max = selectorMax;
            }

            var interval = xAxis.unitInterval;

            var dateTimeUnit, isTimeUnit;

            if (isDateTime) {
                dateTimeUnit = xAxis.baseUnit;
                if (!dateTimeUnit) {
                    dateTimeUnit = this._getBestDTUnit(min, max, groupIndex, axisSize);
                }

                isTimeUnit = dateTimeUnit == 'hour' || dateTimeUnit == 'minute' || dateTimeUnit == 'second' || dateTimeUnit == 'millisecond';
            }

            var isLogAxis = xAxis.logarithmicScale == true;
            var logBase = xAxis.logarithmicScaleBase;
            if (isNaN(logBase) || logBase <= 1)
                logBase = 10;

            var interval = xAxis.unitInterval;
            if (isLogAxis)
                interval = 1;
            else if (isNaN(interval) || interval <= 0)
                interval = this._estAxisInterval(min, max, groupIndex, axisSize, dateTimeUnit);

            var filterRange = { min: min, max: max };

            var group = this.seriesGroups[groupIndex];
            if (isLogAxis) {
                if (!min) {
                    min = 1;
                    if (max && min > max)
                        min = max;
                }
                if (!max) {
                    max = min;
                }

                filterRange = { min: min, max: max };

                var minPow = $.jqx._rnd($.jqx.log(min, logBase), 1, false);
                var maxPow = $.jqx._rnd($.jqx.log(max, logBase), 1, true);

                max = Math.pow(logBase, maxPow);
                min = Math.pow(logBase, minPow);
            }
            else if (!isDateTime && (group.polar || group.spider)) { // TODO: evaluate applying to all series
                min = $.jqx._rnd(min, interval, false);
                max = $.jqx._rnd(max, interval, true);
            }

            return { min: min, max: max, logAxis: { enabled: isLogAxis, base: logBase, minPow: minPow, maxPow: maxPow }, dsRange: { min: minDS, max: maxDS }, filterRange: filterRange, useIndeces: useIndeces, isDateTime: isDateTime, isTimeUnit: isTimeUnit, dateTimeUnit: dateTimeUnit, interval: interval };
        },

        /** @private */
        _getDefaultDTFormatFn: function (dateTimeUnit) {
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var fn;
            if (dateTimeUnit == 'year' || dateTimeUnit == 'month' || dateTimeUnit == 'day') {
                fn = function (value) {
                    return value.getDate() + "-" + months[value.getMonth()] + "-" + value.getFullYear();
                };
            }
            else {
                fn = function (value) {
                    return value.getDate() + "-" + months[value.getMonth()] + "-" + value.getFullYear() + '<br>' + value.getHours() + ':' + value.getMinutes() + ':' + value.getSeconds();
                };
            }

            return fn;
        },

        /** @private */
        _getDTIntCnt: function (min, max, interval, dateTimeUnit) {

            var cnt = 0;
            var curr = new Date(min);
            var maxDate = new Date(max);
            maxDate = maxDate.valueOf();

            if (interval <= 0)
                return 1;

            while (curr.valueOf() < maxDate) {
                if (dateTimeUnit == 'millisecond')
                    curr = new Date(curr.valueOf() + interval);
                else if (dateTimeUnit == 'second')
                    curr = new Date(curr.valueOf() + interval * 1000);
                else if (dateTimeUnit == 'minute')
                    curr = new Date(curr.valueOf() + interval * 60000);
                else if (dateTimeUnit == 'hour') {
                    curr = new Date(curr.valueOf() + interval * 60000 * 24);
                }
                else if (dateTimeUnit == 'day')
                    curr.setDate(curr.getDate() + interval);
                else if (dateTimeUnit == 'month')
                    curr.setMonth(curr.getMonth() + interval);
                else if (dateTimeUnit == 'year')
                    curr.setFullYear(curr.getFullYear() + interval);

                cnt++;
            }

            return cnt;
        },

        /** @private */
        _estAxisInterval: function (min, max, groupIndex, axisSize, baseUnit, avgItemWidth) {
            if (isNaN(min) || isNaN(max))
                return NaN;

            var scale = [1, 2, 5, 10, 15, 20, 50, 100, 200, 500];

            var i = 0;
            var prefCount = axisSize / ((!isNaN(avgItemWidth) && avgItemWidth > 0) ? avgItemWidth : 50);

            if (this._renderData &&
                this._renderData.length > groupIndex &&
                this._renderData[groupIndex].xAxis &&
                !isNaN(this._renderData[groupIndex].xAxis.avgWidth)) {
                var avgWidth = Math.max(1, this._renderData[groupIndex].xAxis.avgWidth);
                if (avgWidth != 0 && isNaN(avgItemWidth)) {
                    // use average text size and 90% axis size to account
                    // for padding between text items
                    prefCount = 0.9 * axisSize / avgWidth;
                }
            }

            if (prefCount <= 1)
                return Math.abs(max - min);

            var itemsCount = 0;
            while (true) {
                var intSize = i >= scale.length ? Math.pow(10, 3 + i - scale.length) : scale[i];

                if (this._isDate(min) && this._isDate(max))
                    itemsCount = this._getDTIntCnt(min, max, intSize, baseUnit);
                else
                    itemsCount = (max - min) / intSize;

                if (itemsCount <= prefCount)
                    break;

                i++;
            }

            var group = this.seriesGroups[groupIndex];
            if (group.spider || group.polar) {
                if (2 * intSize > max - min)
                    intSize = max - min;
            }

            return intSize;
        },

        /** @private */
        _getPaddingSize: function (axisStats, axis, valuesOnTicks, axisSize, isPolar, isClosedCircle, hasColumnSeries) {
            var min = axisStats.min;
            var max = axisStats.max;

            if (axisStats.logAxis.enabled) {
                min = axisStats.logAxis.minPow;
                max = axisStats.logAxis.maxPow;
            }

            var unitInterval = axisStats.interval;
            var dateTimeUnit = axisStats.dateTimeUnit;

            if (isPolar) {
                var padding = (axisSize / Math.max(1, max - min + unitInterval)) * unitInterval;

                if (isClosedCircle) {
                    return { left: 0, right: padding };
                }
                else {
                    if (valuesOnTicks)
                        return { left: 0, right: 0 };

                    return { left: padding / 2, right: padding / 2 };
                }
            }


            if (valuesOnTicks && !hasColumnSeries)
                return { left: 0, right: 0 };

            if (this._isDate(min) && this._isDate(max)) {
                var itemsCount = this._getDTIntCnt(min, max, Math.min(unitInterval, max - min), dateTimeUnit);
                var itemWidth = axisSize / Math.max(2, itemsCount);
                return { left: itemWidth / 2, right: itemWidth / 2 };
            }

            var itemsCount = Math.max(1, max - min);
            if (itemsCount == 1) {
                sz = axisSize / 4;
                return { left: sz, right: sz };
            }

            var itemWidth = axisSize / (itemsCount + 1);

            return { left: itemWidth / 2, right: itemWidth / 2 };
        },

        /** @private */
        _calculateXOffsets: function (groupIndex, axisSize) {
            var g = this.seriesGroups[groupIndex];

            var xAxis = this._getXAxis(groupIndex);
            var xoffsets = [];
            var xvalues = [];
            var dataLength = this._getDataLen(groupIndex);

            var axisStats = this._getXAxisStats(groupIndex, xAxis, axisSize);
            var min = axisStats.min;
            var max = axisStats.max;

            var isDateTime = axisStats.isDateTime;
            var isTimeUnit = axisStats.isTimeUnit;

            var hasColumnSeries = this._hasColumnSeries();

            var isPolar = g.polar || g.spider;
            var startAngle = this._get([g.startAngle, g.minAngle, 0]);
            var endAngle = this._get([g.endAngle, g.maxAngle, 360]);
            var isClosedCircle = isPolar && !(Math.abs(Math.abs(endAngle - startAngle) - 360) > 0.0001);

            var valuesOnTicks = this._alignValuesWithTicks(groupIndex);

            var padding = this._getPaddingSize(axisStats, xAxis, valuesOnTicks, axisSize, isPolar, isClosedCircle, hasColumnSeries);

            var rangeLength = max - min;
            var filterRange = axisStats.filterRange;

            if (rangeLength == 0)
                rangeLength = 1;

            var plotSize = axisSize - padding.left - padding.right;
            if (isPolar && valuesOnTicks && !isClosedCircle)
                padding.left = padding.right = 0;

            var first = -1, last = -1;
            for (var i = 0; i < dataLength; i++) {
                var value = (xAxis.dataField === undefined) ? i : this._getDataValue(i, xAxis.dataField, groupIndex);

                if (axisStats.useIndeces) {
                    if (i < filterRange.min || i > filterRange.max) {
                        xoffsets.push(NaN);
                        xvalues.push(undefined);
                        continue;
                    }

                    x = padding.left + (i - min) / rangeLength * plotSize;

                    if (axisStats.logAxis.enabled == true) {
                        var logBase = axisStats.logAxis.base;

                        x = this._jqxPlot.scale(
                            value,
                            {
                                min: min.valueOf(),
                                max: max.valueOf(),
                                type: 'logarithmic',
                                base: logBase
                            },
                            {
                                min: 0,
                                max: plotSize,
                                flip: false
                            }
                        );
                    }

                    xoffsets.push($.jqx._ptrnd(x));
                    xvalues.push(value);

                    if (first == -1)
                        first = i;
                    if (last == -1 || last < i)
                        last = i;
                    continue;
                }

                value = isDateTime ? this._castAsDate(value, xAxis.dateFormat) : this._castAsNumber(value);
                if (isNaN(value) || value < filterRange.min || value > filterRange.max) {
                    xoffsets.push(NaN);
                    xvalues.push(undefined);
                    continue;
                }

                var x = 0;
                if (axisStats.logAxis.enabled == true) {
                    var logBase = axisStats.logAxis.base;

                    x = this._jqxPlot.scale(
                        value,
                        {
                            min: min.valueOf(),
                            max: max.valueOf(),
                            type: 'logarithmic',
                            base: logBase
                        },
                        {
                            min: 0,
                            max: plotSize,
                            flip: false
                        }
                    );
                }
                else if (!isDateTime || (isDateTime && isTimeUnit)) {
                    diffFromMin = value - min;
                    x = (value - min) * plotSize / rangeLength;
                }
                else {
                    x = (value.valueOf() - min.valueOf()) / (max.valueOf() - min.valueOf()) * plotSize;
                }

                x = $.jqx._ptrnd(padding.left + x);

                xoffsets.push(x);
                xvalues.push(value);

                if (first == -1)
                    first = i;
                if (last == -1 || last < i)
                    last = i;
            }

            if (xAxis.flip == true) {
                for (var i = 0; i < xoffsets.length; i++)
                    if (!isNaN(xoffsets[i]))
                        xoffsets[i] = axisSize - xoffsets[i];
            }

            if (isTimeUnit || isDateTime) {
                rangeLength = this._getDateDiff(min, max, xAxis.baseUnit);
                rangeLength = $.jqx._rnd(rangeLength, 1, false);
            }

            var itemsCount = Math.max(1, rangeLength);
            var itemWidth = plotSize / itemsCount;

            if (first == last && itemsCount == 1)
                xoffsets[first] = padding.left + plotSize / 2;

            return {
                axisStats: axisStats,
                data: xoffsets,
                xvalues: xvalues,
                first: first,
                last: last,
                length: last == -1 ? 0 : last - first + 1,
                itemWidth: itemWidth,
                intervalWidth: itemWidth * axisStats.interval,
                rangeLength: rangeLength,
                useIndeces: axisStats.useIndeces,
                padding: padding,
                axisSize: plotSize
            };
        },

        /** @private */
        _getXAxis: function (gidx) {
            if (gidx == undefined || this.seriesGroups.length <= gidx)
                return this.categoryAxis || this.xAxis;

            return this.seriesGroups[gidx].categoryAxis || this.seriesGroups[gidx].xAxis || this.categoryAxis || this.xAxis;
        },

        /** @private */
        _isGreyScale: function (groupIndex, seriesIndex) {
            var g = this.seriesGroups[groupIndex];
            var s = g.series[seriesIndex];

            if (s.greyScale == true)
                return true;
            else if (s.greyScale == false)
                return false;

            if (g.greyScale == true)
                return true;
            else if (g.greyScale == false)
                return false;

            return this.greyScale == true;
        },

        /** @private */
        _getSeriesColors: function (groupIndex, seriesIndex, itemIndex) {
            var colors = this._getSeriesColorsInternal(groupIndex, seriesIndex, itemIndex);

            if (this._isGreyScale(groupIndex, seriesIndex)) {
                for (var i in colors)
                    colors[i] = $.jqx.toGreyScale(colors[i]);
            }

            return colors;
        },

        _getColorFromScheme: function (groupIndex, serieIndex, itemIndex) {
            var color = '#000000';
            var group = this.seriesGroups[groupIndex];
            var serie = group.series[serieIndex];

            if (this._isPieGroup(groupIndex)) {
                var dataLength = this._getDataLen(groupIndex);
                color = this._getItemColorFromScheme(serie.colorScheme || group.colorScheme || this.colorScheme, serieIndex * dataLength + itemIndex, groupIndex, serieIndex);
            }
            else {
                var sidx = 0;
                for (var i = 0; i <= groupIndex; i++) {
                    for (var j in this.seriesGroups[i].series) {
                        if (i == groupIndex && j == serieIndex)
                            break;
                        else
                            sidx++;
                    }
                }

                var colorScheme = this.colorScheme;
                if (group.colorScheme) {
                    colorScheme = group.colorScheme;
                    sidex = seriesIndex;
                }

                if (colorScheme == undefined || colorScheme == '')
                    colorScheme = this.colorSchemes[0].name;

                if (!colorScheme)
                    return color;

                for (var i = 0; i < this.colorSchemes.length; i++) {
                    var cs = this.colorSchemes[i];
                    if (cs.name == colorScheme) {
                        while (sidx > cs.colors.length) {
                            sidx -= cs.colors.length;
                            if (++i >= this.colorSchemes.length)
                                i = 0;
                            cs = this.colorSchemes[i];
                        }

                        color = cs.colors[sidx % cs.colors.length];
                    }
                }
            } // else

            return color;
        },

        /** @private */
        _createColorsCache: function () {
            this._colorsCache = {
                get: function (cacheKey) {
                    if (this._store[cacheKey])
                        return this._store[cacheKey];
                },
                set: function (cacheKey, color) {
                    if (this._size < 10000) {
                        this._store[cacheKey] = color;
                        this._size++;
                    }
                },

                clear: function () {
                    this._store = {};
                    this._size = 0;
                },

                _size: 0,
                _store: {}
            };
        },


        /** @private */
        _getSeriesColorsInternal: function (groupIndex, seriesIndex, itemIndex) {
            var g = this.seriesGroups[groupIndex];
            var s = g.series[seriesIndex];

            if (!$.isFunction(s.colorFunction) && g.type != 'pie' && g.type != 'donut')
                itemIndex = NaN;

            var cacheKey = groupIndex + "_" + seriesIndex + "_" + (isNaN(itemIndex) ? 'NaN' : itemIndex);

            if (this._colorsCache.get(cacheKey))
                return this._colorsCache.get(cacheKey);

            var colors =
            {
                lineColor: '#222222',
                lineColorSelected: '#151515',
                lineColorSymbol: '#222222',
                lineColorSymbolSelected: '#151515',
                fillColor: '#222222',
                fillColorSelected: '#333333',
                fillColorSymbol: '#222222',
                fillColorSymbolSelected: '#333333',
                fillColorAlt: '#222222',
                fillColorAltSelected: '#333333'
            };

            var customColors;
            if ($.isFunction(s.colorFunction)) {
                var value = !isNaN(itemIndex) ? this._getDataValue(itemIndex, s.dataField, groupIndex) : NaN;
                if (g.type.indexOf('range') != -1 && !isNaN(itemIndex)) {
                    var valueFrom = this._getDataValue(itemIndex, s.dataFieldFrom, groupIndex);
                    var valueTo = this._getDataValue(itemIndex, s.dataFieldTo, groupIndex);
                    value = { from: valueFrom, to: valueTo };
                }

                customColors = s.colorFunction(value, itemIndex, s, g);
                if (typeof (customColors) == 'object') {
                    for (var key in customColors)
                        colors[key] = customColors[key];
                }
                else {
                    colors.fillColor = customColors;
                }
            }
            else {
                for (var key in colors) {
                    if (s[key])
                        colors[key] = s[key];
                }

                if (!s.fillColor && !s.color) {
                    colors.fillColor = this._getColorFromScheme(groupIndex, seriesIndex, itemIndex);
                }
                else {
                    s.fillColor = s.fillColor || s.color;
                }
            }

            var colorDeriveMap =
            {
                fillColor: { baseColor: 'fillColor', adjust: 1.0 },
                fillColorSelected: { baseColor: 'fillColor', adjust: 1.1 },
                fillColorSymbol: { baseColor: 'fillColor', adjust: 1.0 },
                fillColorSymbolSelected: { baseColor: 'fillColorSymbol', adjust: 2.0 },
                fillColorAlt: { baseColor: 'fillColor', adjust: 4.0 },
                fillColorAltSelected: { baseColor: 'fillColor', adjust: 3.0 },
                lineColor: { baseColor: 'fillColor', adjust: 0.95 },
                lineColorSelected: { baseColor: 'lineColor', adjust: 0.95 },
                lineColorSymbol: { baseColor: 'lineColor', adjust: 1.0 },
                lineColorSymbolSelected: { baseColor: 'lineColorSelected', adjust: 1.0 }
            };

            // assign colors
            for (var key in colors) {
                if (typeof (customColors) != 'object' || !customColors[key]) {
                    if (s[key])
                        colors[key] = s[key];
                }
            }

            // derive colors
            for (var key in colors) {
                if (typeof (customColors) != 'object' || !customColors[key]) {
                    if (!s[key])
                        colors[key] = $.jqx.adjustColor(colors[colorDeriveMap[key].baseColor], colorDeriveMap[key].adjust);
                }
            }

            this._colorsCache.set(cacheKey, colors);

            return colors;
        },

        /** @private */
        _getItemColorFromScheme: function (scheme, index, gidx, sidx) {
            if (scheme == undefined || scheme == '')
                scheme = this.colorSchemes[0].name;

            for (var i = 0; i < this.colorSchemes.length; i++)
                if (scheme == this.colorSchemes[i].name)
                    break;

            var j = 0;
            while (j <= index) {
                if (i == this.colorSchemes.length)
                    i = 0;

                var schLen = this.colorSchemes[i].colors.length;
                if (j + schLen <= index) {
                    j += schLen;
                    i++;
                }
                else {
                    var color = this.colorSchemes[i].colors[index - j];

                    if (this._isGreyScale(gidx, sidx) && color.indexOf('#') == 0)
                        color = $.jqx.toGreyScale(color);

                    return color;
                }
            }
        },

        getColorScheme: function (scheme) {
            for (var i = 0; i < this.colorSchemes.length; i++) {
                if (this.colorSchemes[i].name == scheme)
                    return this.colorSchemes[i].colors;
            }

            return undefined;
        },

        addColorScheme: function (scheme, colors) {
            for (var i = 0; i < this.colorSchemes.length; i++) {
                if (this.colorSchemes[i].name == scheme) {
                    this.colorSchemes[i].colors = colors;
                    return;
                }
            }

            this.colorSchemes.push({ name: scheme, colors: colors });
        },

        removeColorScheme: function (scheme) {
            for (var i = 0; i < this.colorSchemes.length; i++) {
                if (this.colorSchemes[i].name == scheme) {
                    this.colorSchemes.splice(i, 1);
                    break;
                }
            }
        },

        /************* COLOR SCHEMES ************/
        colorSchemes: [
            { name: 'scheme01', colors: ['#307DD7', '#AA4643', '#89A54E', '#71588F', '#4198AF'] },
            { name: 'scheme02', colors: ['#7FD13B', '#EA157A', '#FEB80A', '#00ADDC', '#738AC8'] },
            { name: 'scheme03', colors: ['#E8601A', '#FF9639', '#F5BD6A', '#599994', '#115D6E'] },
            { name: 'scheme04', colors: ['#D02841', '#FF7C41', '#FFC051', '#5B5F4D', '#364651'] },
            { name: 'scheme05', colors: ['#25A0DA', '#309B46', '#8EBC00', '#FF7515', '#FFAE00'] },
            { name: 'scheme06', colors: ['#0A3A4A', '#196674', '#33A6B2', '#9AC836', '#D0E64B'] },
            { name: 'scheme07', colors: ['#CC6B32', '#FFAB48', '#FFE7AD', '#A7C9AE', '#888A63'] },
            { name: 'scheme08', colors: ['#3F3943', '#01A2A6', '#29D9C2', '#BDF271', '#FFFFA6'] },
            { name: 'scheme09', colors: ['#1B2B32', '#37646F', '#A3ABAF', '#E1E7E8', '#B22E2F'] },
            { name: 'scheme10', colors: ['#5A4B53', '#9C3C58', '#DE2B5B', '#D86A41', '#D2A825'] },
            { name: 'scheme11', colors: ['#993144', '#FFA257', '#CCA56A', '#ADA072', '#949681'] },
            { name: 'scheme12', colors: ['#105B63', '#EEEAC5', '#FFD34E', '#DB9E36', '#BD4932'] },
            { name: 'scheme13', colors: ['#BBEBBC', '#F0EE94', '#F5C465', '#FA7642', '#FF1E54'] },
            { name: 'scheme14', colors: ['#60573E', '#F2EEAC', '#BFA575', '#A63841', '#BFB8A3'] },
            { name: 'scheme15', colors: ['#444546', '#FFBB6E', '#F28D00', '#D94F00', '#7F203B'] },
            { name: 'scheme16', colors: ['#583C39', '#674E49', '#948658', '#F0E99A', '#564E49'] },
            { name: 'scheme17', colors: ['#142D58', '#447F6E', '#E1B65B', '#C8782A', '#9E3E17'] },
            { name: 'scheme18', colors: ['#4D2B1F', '#635D61', '#7992A2', '#97BFD5', '#BFDCF5'] },
            { name: 'scheme19', colors: ['#844341', '#D5CC92', '#BBA146', '#897B26', '#55591C'] },
            { name: 'scheme20', colors: ['#56626B', '#6C9380', '#C0CA55', '#F07C6C', '#AD5472'] },
            { name: 'scheme21', colors: ['#96003A', '#FF7347', '#FFBC7B', '#FF4154', '#642223'] },
            { name: 'scheme22', colors: ['#5D7359', '#E0D697', '#D6AA5C', '#8C5430', '#661C0E'] },
            { name: 'scheme23', colors: ['#16193B', '#35478C', '#4E7AC7', '#7FB2F0', '#ADD5F7'] },
            { name: 'scheme24', colors: ['#7B1A25', '#BF5322', '#9DA860', '#CEA457', '#B67818'] },
            { name: 'scheme25', colors: ['#0081DA', '#3AAFFF', '#99C900', '#FFEB3D', '#309B46'] },
            { name: 'scheme26', colors: ['#0069A5', '#0098EE', '#7BD2F6', '#FFB800', '#FF6800'] },
            { name: 'scheme27', colors: ['#FF6800', '#A0A700', '#FF8D00', '#678900', '#0069A5'] }
        ],

        /********** END OF COLOR SCHEMES ********/
        /** @private */
        _formatValue: function (value, formatSettings, formatFunction, groupIndex, serieIndex, itemIndex) {
            if (value == undefined)
                return '';

            if (this._isObject(value) && !this._isDate(value) && !formatFunction)
                return '';

            if (formatFunction) {
                if (!$.isFunction(formatFunction))
                    return value.toString();

                try {
                    return formatFunction(value, itemIndex, serieIndex, groupIndex);
                }
                catch (e) {
                    return e.message;
                }
            }

            if (this._isNumber(value))
                return this._formatNumber(value, formatSettings);

            if (this._isDate(value))
                return this._formatDate(value, formatSettings);

            if (formatSettings) {
                return (formatSettings.prefix || '') + value.toString() + (formatSettings.sufix || '');
            }

            return value.toString();
        },

        /** @private */
        _getFormattedValue: function (groupIndex, serieIndex, itemIndex, formatSettings, formatFunction, valuesOnly) {
            var g = this.seriesGroups[groupIndex];
            var s = g.series[serieIndex];
            var text = '';

            var fs = formatSettings, fn = formatFunction;
            if (!fn)
                fn = s.formatFunction || g.formatFunction;
            if (!fs)
                fs = s.formatSettings || g.formatSettings;

            // series format settings takes priority over group format function;
            if (!s.formatFunction && s.formatSettings)
                fn = undefined;

            var value = {}, cnt = 0;
            for (var field in s)
                if (field.indexOf('dataField') == 0) {
                    value[field.substring(9).toLowerCase()] = this._getDataValue(itemIndex, s[field], groupIndex);
                    cnt++;
                }

            if (cnt == 0)
                value = this._getDataValue(itemIndex, undefined, groupIndex);

            if (g.type.indexOf('waterfall') != -1 && this._isSummary(groupIndex, itemIndex)) {
                value = this._renderData[groupIndex].offsets[serieIndex][itemIndex].value;
                cnt = 0;
            }

            if (fn && $.isFunction(fn)) {
                try {
                    return fn(cnt == 1 ? value[''] : value, itemIndex, s, g);
                }
                catch (e) {
                    return e.message;
                }
            }

            if (cnt == 1 && this._isPieGroup(groupIndex)) {
                return this._formatValue(value[''], fs, fn, groupIndex, serieIndex, itemIndex); ;
            }

            if (cnt > 0) {
                var i = 0;
                for (var field in value) {
                    if (i > 0 && text != '')
                        text += '<br>';

                    var dataField = 'dataField' + (field.length > 0 ? field.substring(0, 1).toUpperCase() + field.substring(1) : '');
                    var displayField = 'displayText' + (field.length > 0 ? field.substring(0, 1).toUpperCase() + field.substring(1) : '');
                    var displayText = s[displayField] || s[dataField];

                    var currValue = value[field];
                    if (undefined != currValue) {
                        currValue = this._formatValue(currValue, fs, fn, groupIndex, serieIndex, itemIndex);
                    }
                    else
                        continue;

                    if (valuesOnly === true)
                        text += currValue;
                    else
                        text += displayText + ': ' + currValue;

                    i++;
                }
            }
            else {
                if (undefined != value)
                    text = this._formatValue(value, fs, fn, groupIndex, serieIndex, itemIndex);
            }

            return text || '';
        },

        /** @private */
        _isNumberAsString: function (text) {
            if (typeof (text) != 'string')
                return false;

            text = $.trim(text);
            for (var i = 0; i < text.length; i++) {
                var ch = text.charAt(i);
                if ((ch >= '0' && ch <= '9') || ch == ',' || ch == '.')
                    continue;

                if (ch == '-' && i == 0)
                    continue;

                if ((ch == '(' && i == 0) || (ch == ')' && i == text.length - 1))
                    continue;

                return false;
            }

            return true;
        },

        /** @private */
        _castAsDate: function (value, dateFormat) {
            if (value instanceof Date && !isNaN(value))
                return value;

            if (typeof (value) == 'string') {
                var result;

                if (dateFormat) {
                    result = $.jqx.dataFormat.parsedate(value, dateFormat);
                    if (this._isDate(result))
                        return result;
                }

                // try formats detected earlier
                if (this._autoDateFormats) {
                    for (var i = 0; i < this._autoDateFormats.length; i++) {
                        result = $.jqx.dataFormat.parsedate(value, this._autoDateFormats[i]);
                        if (this._isDate(result))
                            return result;
                    }
                }

                // try all formats
                var detectedFormat = this._detectDateFormat(value);
                if (detectedFormat) {
                    result = $.jqx.dataFormat.parsedate(value, detectedFormat);
                    if (this._isDate(result)) {
                        this._autoDateFormats.push(detectedFormat);
                        return result;
                    }
                }

                // try default conversion
                result = new Date(value);

                if (this._isDate(result)) {
                    if (value.indexOf(':') == -1)
                        result.setHours(0, 0, 0, 0);
                }

                return result;
            }

            return undefined;
        },

        /** @private */
        _castAsNumber: function (value) {
            if (value instanceof Date && !isNaN(value))
                return value.valueOf();

            if (typeof (value) == 'string') {
                if (this._isNumber(value)) {
                    value = parseFloat(value);
                }
                else {
                    if (!/[a-zA-Z]/.test(value)) {
                        var date = new Date(value);
                        if (date != undefined)
                            value = date.valueOf();
                    }
                }
            }

            return value;
        },

        /** @private */
        _isNumber: function (value) {
            if (typeof (value) == 'string') {
                if (this._isNumberAsString(value))
                    value = parseFloat(value);
            }
            return typeof value === 'number' && isFinite(value);
        },

        /** @private */
        _isDate: function (value) {
            return value instanceof Date && !isNaN(value.getDate());
        },

        /** @private */
        _isBoolean: function (value) {
            return typeof value === 'boolean';
        },

        /** @private */
        _isObject: function (value) {
            return (value && (typeof value === 'object' || $.isFunction(value))) || false;
        },

        /** @private */
        _formatDate: function (value, settings) {
            var result = value.toString();

            if (settings) {
                if (settings.dateFormat)
                    result = $.jqx.dataFormat.formatDate(value, settings.dateFormat);

                result = (settings.prefix || '') + result + (settings.sufix || '');
            }

            return result;
        },

        /** @private */
        _formatNumber: function (value, settings) {
            if (!this._isNumber(value))
                return value;

            settings = settings || {};

            var decimalSeparator = '.';
            var thousandsSeparator = '';

            var self = this;

            if (self.localization) {
                decimalSeparator = self.localization.decimalSeparator || self.localization.decimalseparator || decimalSeparator;
                thousandsSeparator = self.localization.thousandsSeparator || self.localization.thousandsseparator || thousandsSeparator;
            }

            if (settings.decimalSeparator)
                decimalSeparator = settings.decimalSeparator;

            if (settings.thousandsSeparator)
                thousandsSeparator = settings.thousandsSeparator;

            var prefix = settings.prefix || '';
            var sufix = settings.sufix || '';
            var decimalPlaces = settings.decimalPlaces;
            if (isNaN(decimalPlaces))
                decimalPlaces = this._getDecimalPlaces([value], undefined, 3);

            var negativeWithBrackets = settings.negativeWithBrackets || false;

            var negative = (value < 0);

            if (negative && negativeWithBrackets)
                value *= -1;

            var output = value.toString();
            var decimalindex;

            var decimal = Math.pow(10, decimalPlaces);
            output = (Math.round(value * decimal) / decimal).toString();
            if (isNaN(output)) {
                output = '';
            }

            decimalindex = output.lastIndexOf(".");
            if (decimalPlaces > 0) {
                if (decimalindex < 0) {
                    output += decimalSeparator;
                    decimalindex = output.length - 1;
                }
                else if (decimalSeparator !== ".") {
                    output = output.replace(".", decimalSeparator);
                }
                while ((output.length - 1 - decimalindex) < decimalPlaces) {
                    output += "0";
                }
            }

            decimalindex = output.lastIndexOf(decimalSeparator);
            decimalindex = (decimalindex > -1) ? decimalindex : output.length;
            var newoutput = output.substring(decimalindex);
            var cnt = 0;
            for (var i = decimalindex; i > 0; i--, cnt++) {
                if ((cnt % 3 === 0) && (i !== decimalindex) && (!negative || (i > 1) || (negative && negativeWithBrackets))) {
                    newoutput = thousandsSeparator + newoutput;
                }
                newoutput = output.charAt(i - 1) + newoutput;
            }
            output = newoutput;

            if (negative && negativeWithBrackets)
                output = '(' + output + ')';

            return prefix + output + sufix;
        },

        /** @private */
        _defaultNumberFormat: { prefix: '', sufix: '', decimalSeparator: '.', thousandsSeparator: ',', decimalPlaces: 2, negativeWithBrackets: false },

        /** @private */
        _calculateControlPoints: function (arr, offset) {
            var x0 = arr[offset],
                y0 = arr[offset + 1],
                x1 = arr[offset + 2],
                y1 = arr[offset + 3],
                x2 = arr[offset + 4],
                y2 = arr[offset + 5];

            var tension = 0.4;

            var distP0P1 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
            var distP1P2 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

            var denom = (distP0P1 + distP1P2);
            if (denom == 0)
                denom = 1;
            var factorA = tension * distP0P1 / denom;
            var factorB = tension - factorA;

            return [
                x1 + factorA * (x0 - x2) /* x1 */, y1 + factorA * (y0 - y2) /* y1 */,
                x1 - factorB * (x0 - x2) /* x2 */, y1 - factorB * (y0 - y2) /* y2 */
                ];
        },

        /** @private */
        _getBezierPoints: function (arr) {
            var result = '';
            var points = [], controlPoints = [];
            var split = arr.split(' ');
            for (var i = 0; i < split.length; i++) {
                var pt = split[i].split(',');
                points.push(parseFloat(pt[0]));
                points.push(parseFloat(pt[1]));
                if (isNaN(points[points.length - 1]) || isNaN(points[points.length - 2]))
                    continue;
            }

            var len = points.length;
            if (len <= 1)
                return '';
            else if (len == 2) {
                result = 'M' + $.jqx._ptrnd(points[0]) + ',' + $.jqx._ptrnd(points[1]) +
                        ' L' + $.jqx._ptrnd(points[0] + 1) + ',' + $.jqx._ptrnd(points[1] + 1) + ' '
                return result;
            }

            for (var i = 0; i < len - 4; i += 2)
                controlPoints = controlPoints.concat(this._calculateControlPoints(points, i));

            for (var i = 2; i < len - 5; i += 2) {
                result += ' C' +
                    $.jqx._ptrnd(controlPoints[2 * i - 2]) + ',' + $.jqx._ptrnd(controlPoints[2 * i - 1]) + ' ' +
                    $.jqx._ptrnd(controlPoints[2 * i]) + ',' + $.jqx._ptrnd(controlPoints[2 * i + 1]) + ' ' +
                    $.jqx._ptrnd(points[i + 2]) + ',' + $.jqx._ptrnd(points[i + 3]) + ' ';
            }

            // check the x & y diff between the 1st and 2nd point and connect with either a line or quadratic curve
            if (len <= 4 || (Math.abs(points[0] - points[2]) < 3 || Math.abs(points[1] - points[3]) < 3) || this._isVML) {
                result = 'M' + $.jqx._ptrnd(points[0]) + ',' + $.jqx._ptrnd(points[1]) +
                    ' L' + $.jqx._ptrnd(points[2]) + ',' + $.jqx._ptrnd(points[3]) + ' ' + result;
            }
            else {
                result = 'M' + $.jqx._ptrnd(points[0]) + ',' + $.jqx._ptrnd(points[1]) +
                    ' Q' +
                    $.jqx._ptrnd(controlPoints[0]) + ',' + $.jqx._ptrnd(controlPoints[1]) + ' ' +
                    $.jqx._ptrnd(points[2]) + ',' + $.jqx._ptrnd(points[3]) + ' ' + result;
            }

            // check the x & y diff between the last 2 points and connect with either a line or quadratic curve
            if (len >= 4 && (Math.abs(points[len - 2] - points[len - 4]) < 3 || Math.abs(points[len - 1] - points[len - 3]) < 3 || this._isVML)) {
                result += ' L' + $.jqx._ptrnd(points[len - 2]) + ',' + $.jqx._ptrnd(points[len - 1]) + ' ';
            }
            else if (len >= 5) {
                result += ' Q' +
                    $.jqx._ptrnd(controlPoints[len * 2 - 10]) + ',' + $.jqx._ptrnd(controlPoints[len * 2 - 9]) + ' ' +
                    $.jqx._ptrnd(points[len - 2]) + ',' + $.jqx._ptrnd(points[len - 1]) + ' ';
            }

            return result;
        },

        /** @private */
        _animTickInt: 50,

        /** @private */
        _createAnimationGroup: function (groupId) {
            if (!this._animGroups) {
                this._animGroups = {};
            }

            this._animGroups[groupId] = { animations: [], startTick: NaN };
        },

        /** @private */
        _startAnimation: function (groupId) {
            var d = new Date();
            var currentTick = d.getTime();
            this._animGroups[groupId].startTick = currentTick;
            this._runAnimation();
            this._enableAnimTimer();
        },

        /** @private */
        _enqueueAnimation: function (groupId, element, properties, duration, fn, context, easing) {
            if (duration < 0)
                duration = 0;

            if (easing == undefined)
                easing = 'easeInOutSine';

            this._animGroups[groupId].animations.push({ key: element, properties: properties, duration: duration, fn: fn, context: context, easing: easing });
        },

        /** @private */
        _stopAnimations: function () {
            clearTimeout(this._animtimer);
            this._animtimer = undefined;
            this._animGroups = undefined;
        },

        /** @private */
        _enableAnimTimer: function () {
            if (!this._animtimer) {
                var self = this;
                this._animtimer = setTimeout(function () { self._runAnimation(); }, this._animTickInt);
            }
        },

        /** @private */
        _runAnimation: function (animationCompleteCallback) {

            if (this._animGroups) {
                var d = new Date();
                var currentTick = d.getTime();

                var animGroupsNewList = {};
                for (var j in this._animGroups) {
                    var list = this._animGroups[j].animations;
                    var startTick = this._animGroups[j].startTick;

                    var maxDuration = 0;
                    for (var i = 0; i < list.length; i++) {
                        var item = list[i];

                        var tSince = (currentTick - startTick);
                        if (item.duration > maxDuration)
                            maxDuration = item.duration;

                        var percent = item.duration > 0 ? tSince / item.duration : 1;
                        var easePercent = percent;
                        if (item.easing && item.duration != 0)
                            easePercent = $.easing[item.easing](percent, tSince, 0, 1, item.duration);

                        if (percent > 1) {
                            percent = 1;
                            easePercent = 1;
                        }

                        if (item.fn) // custom function
                        {
                            item.fn(item.key, item.context, easePercent);
                            continue;
                        }

                        var params = {};
                        for (var j = 0; j < item.properties.length; j++) {
                            var p = item.properties[j];
                            var val = 0;

                            if (percent == 1) {
                                val = p.to;
                            }
                            else {
                                val = easeParecent * (p.to - p.from) + p.from;
                            }

                            params[p.key] = val;
                        }
                        this.renderer.attr(item.key, params);
                    } // for i

                    if (startTick + maxDuration > currentTick)
                        animGroupsNewList[j] = ({ startTick: startTick, animations: list });
                } // for j

                this._animGroups = animGroupsNewList;

                if (this.renderer instanceof $.jqx.HTML5Renderer)
                    this.renderer.refresh();
            }

            this._animtimer = null;

            for (var j in this._animGroups) {
                this._enableAnimTimer();
                break;
            }
        },

        _fixCoords: function (rect, groupIndex) {
            var swapXY = this.seriesGroups[groupIndex].orientation == 'horizontal';
            if (!swapXY)
                return rect;

            var tmp = rect.x;
            rect.x = rect.y;
            rect.y = tmp + this._plotRect.y - this._plotRect.x;

            var tmp = rect.width;
            rect.width = rect.height;
            rect.height = tmp;

            return rect;
        },

        getItemCoord: function (groupIndex, serieIndex, itemIndex) {
            var self = this;

            if (self._isPieGroup(groupIndex) &&
                (
                    !self._isSerieVisible(groupIndex, serieIndex, itemIndex) ||
                    !self._renderData ||
                    self._renderData.length <= groupIndex
                )
               ) {
                return { x: NaN, y: NaN };
            }

            if (!self._isSerieVisible(groupIndex, serieIndex) ||
                !self._renderData ||
                self._renderData.length <= groupIndex
            ) {
                return { x: NaN, y: NaN };
            }

            var g = self.seriesGroups[groupIndex]
            var s = g.series[serieIndex];

            var coord = self._getItemCoord(groupIndex, serieIndex, itemIndex);
            if (self._isPieGroup(groupIndex)) {
                if (isNaN(coord.x) || isNaN(coord.y) || isNaN(coord.fromAngle) || isNaN(coord.toAngle))
                    return { x: NaN, y: NaN };

                var plotRect = this._plotRect;

                var fromAngle = coord.fromAngle * (Math.PI / 180);
                var toAngle = coord.toAngle * (Math.PI / 180);

                x1 = plotRect.x + coord.center.x + Math.cos(fromAngle) * coord.outerRadius;
                x2 = plotRect.x + coord.center.x + Math.cos(toAngle) * coord.outerRadius;
                y1 = plotRect.y + coord.center.y - Math.sin(fromAngle) * coord.outerRadius;
                y2 = plotRect.y + coord.center.y - Math.sin(toAngle) * coord.outerRadius;

                var x = Math.min(x1, x2);
                var width = Math.abs(x2 - x1);
                var y = Math.min(y1, y2);
                var height = Math.abs(y2 - y1);

                coord =
                {
                    x: x,
                    y: y,
                    width: width,
                    height: height,
                    center: coord.center,
                    centerOffset: coord.centerOffset,
                    innerRadius: coord.innerRadius,
                    outerRadius: coord.outerRadius,
                    selectedRadiusChange: coord.selectedRadiusChange,
                    fromAngle: coord.fromAngle,
                    toAngle: coord.toAngle
                };

                return coord;
            }

            if (g.type.indexOf('column') != -1 || g.type.indexOf('waterfall') != -1) {
                var offsetAndWidth = this._getColumnSerieWidthAndOffset(groupIndex, serieIndex);
                coord.height = Math.abs(coord.y.to - coord.y.from);
                coord.y = Math.min(coord.y.to, coord.y.from);

                coord.x += offsetAndWidth.offset;
                coord.width = offsetAndWidth.width;
            }
            else if (g.type.indexOf('ohlc') != -1 || g.type.indexOf('candlestick') != -1) {
                var offsetAndWidth = this._getColumnSerieWidthAndOffset(groupIndex, serieIndex);
                var y = coord.y;
                var minY = Math.min(y.Open, y.Close, y.Low, y.High);
                var maxY = Math.max(y.Open, y.Close, y.Low, y.High);

                coord.height = Math.abs(maxY - minY);
                coord.y = minY

                coord.x += offsetAndWidth.offset;
                coord.width = offsetAndWidth.width;
            }
            else if (g.type.indexOf('line') != -1 || g.type.indexOf('area') != -1) {
                coord.width = coord.height = 0;
                coord.y = coord.y.to;
            }
            else if (g.type.indexOf('bubble') != -1 || g.type.indexOf('scatter') != -1) {
                coord.center = { x: coord.x, y: coord.y.to };
                var radius = coord.y.radius;
                if (s.symbolType != 'circle' && s.symbolType != undefined)
                    radius /= 2;

                coord.y = coord.y.to;
                coord.radius = radius;

                coord.width = 2 * radius;
                coord.height = 2 * radius;
            }

            coord = this._fixCoords(coord, groupIndex);

            if (g.polar || g.spider) {
                var point = this._toPolarCoord(this._renderData[groupIndex].polarCoords, this._plotRect, coord.x, coord.y);
                coord.x = point.x;
                coord.y = point.y;
                if (coord.center) {
                    coord.center = this._toPolarCoord(this._renderData[groupIndex].polarCoords, this._plotRect, coord.center.x, coord.center.y);
                }
            }

            if (g.type.indexOf('bubble') != -1 || g.type.indexOf('scatter') != -1) {
                coord.x -= radius;
                coord.y -= radius;
            }

            return coord;
        },

        _getItemCoord: function (groupIndex, serieIndex, itemIndex) {
            var g = this.seriesGroups[groupIndex],
                x,
                y;

            if (!g || !this._renderData)
                return { x: NaN, y: NaN };

            var serie = g.series[serieIndex];
            if (!serie)
                return { x: NaN, y: NaN };

            var plotRect = this._plotRect;

            if (this._isPieGroup(groupIndex)) {
                var slice = this._renderData[groupIndex].offsets[serieIndex][itemIndex];
                if (!slice)
                    return { x: NaN, y: NaN };

                var angle = (slice.fromAngle + slice.toAngle) / 2 * (Math.PI / 180);

                x = plotRect.x + slice.x + Math.cos(angle) * slice.outerRadius;
                y = plotRect.y + slice.y - Math.sin(angle) * slice.outerRadius;

                return {
                    x: x,
                    y: y,
                    center: { x: slice.x, y: slice.y },
                    centerOffset: slice.centerOffset,
                    innerRadius: slice.innerRadius,
                    outerRadius: slice.outerRadius,
                    selectedRadiusChange: slice.selectedRadiusChange,
                    fromAngle: slice.fromAngle,
                    toAngle: slice.toAngle
                };
            }
            else {
                x = plotRect.x + this._renderData[groupIndex].xoffsets.data[itemIndex];
                y = this._renderData[groupIndex].offsets[serieIndex][itemIndex];

                if (isNaN(x) || !y)
                    return { x: NaN, y: NaN };
            }

            var yOut = {};
            for (var i in y) {
                yOut[i] = y[i];
            }

            return { x: x, y: yOut };
        },

        getXAxisValue: function (offset, groupIndex) {
            var group = this.seriesGroups[groupIndex];
            if (!group)
                return undefined;

            var xAxis = this._getXAxis(groupIndex);

            var rect = this._plotRect;
            var axisSize = 0;

            var pos = NaN;

            var xAxisStats = this._renderData[0].xoffsets.axisStats;

            var min = 0, max = 0;
            if (group.polar || group.spider) {
                if (isNaN(offset.x) || isNaN(offset.y))
                    return NaN;

                var polarCoords = this._getPolarAxisCoords(groupIndex, rect);

                var dist = $.jqx._ptdist(offset.x, offset.y, polarCoords.x, polarCoords.y);
                if (dist > polarCoords.r)
                    return NaN;

                var posAngle = Math.atan2(polarCoords.y - offset.y, offset.x - polarCoords.x);

                posAngle = Math.PI / 2 - posAngle;
                if (posAngle < 0)
                    posAngle = 2 * Math.PI + posAngle;

                pos = posAngle * polarCoords.r;

                var startAngle = polarCoords.startAngle + Math.PI / 2;
                var endAngle = polarCoords.endAngle + Math.PI / 2;

                min = startAngle * polarCoords.r;
                max = endAngle * polarCoords.r;

                axisSize = (endAngle - startAngle) * polarCoords.r;

                var padding = this._getPaddingSize(xAxisStats, xAxis, xAxis.valuesOnTicks, axisSize, true, polarCoords.isClosedCircle, this._hasColumnSeries());

                if (polarCoords.isClosedCircle) {
                    axisSize -= (padding.left + padding.right);
                    max -= (padding.left + padding.right);
                }
                else {
                    if (!xAxis.valuesOnTicks) {
                        min += padding.left;
                        max -= padding.right;
                    }
                }

            }
            else {
                if (group.orientation != 'horizontal') {
                    if (offset < rect.x || offset > rect.x + rect.width)
                        return NaN;

                    pos = offset - rect.x;
                    axisSize = rect.width;
                }
                else {
                    if (offset < rect.y || offset > rect.y + rect.height)
                        return NaN;

                    pos = offset - rect.y;
                    axisSize = rect.height;
                }

                if (this._renderData[groupIndex] && this._renderData[groupIndex].xoffsets) {
                    var padding = this._renderData[groupIndex].xoffsets.padding;
                    axisSize -= (padding.left + padding.right);
                    pos -= padding.left;
                }

                max = axisSize;
            }

            var value = this._jqxPlot.scale(
                pos,
                {
                    min: min,
                    max: max
                },
                {
                    min: xAxisStats.min.valueOf(),
                    max: xAxisStats.max.valueOf(),
                    type: xAxisStats.logAxis.enabled ? 'logarithmic' : 'linear',
                    base: xAxisStats.logAxis.base,
                    flip: xAxis.flip
                }
            );

            return value;
        },

        getValueAxisValue: function (offset, groupIndex) {
            var group = this.seriesGroups[groupIndex];
            if (!group)
                return undefined;

            var valueAxis = this._getValueAxis(groupIndex);

            var rect = this._plotRect;
            var axisSize = 0;

            var pos = NaN;

            if (group.polar || group.spider) {
                if (isNaN(offset.x) || isNaN(offset.y))
                    return NaN;

                var polarCoords = this._getPolarAxisCoords(groupIndex, rect);
                pos = $.jqx._ptdist(offset.x, offset.y, polarCoords.x, polarCoords.y);
                axisSize = polarCoords.r;
                pos = axisSize - pos;
            }
            else {
                if (group.orientation == 'horizontal') {
                    if (offset < rect.x || offset > rect.x + rect.width)
                        return NaN;

                    pos = offset - rect.x;

                    axisSize = rect.width;
                }
                else {
                    if (offset < rect.y || offset > rect.y + rect.height)
                        return NaN;

                    pos = offset - rect.y;

                    axisSize = rect.height;
                }
            }

            var gstat = this._stats.seriesGroups[groupIndex];

            var value = this._jqxPlot.scale(
                pos,
                {
                    min: 0,
                    max: axisSize
                },
                {
                    min: gstat.min.valueOf(),
                    max: gstat.max.valueOf(),
                    type: gstat.logarithmic ? 'logarithmic' : 'linear',
                    base: gstat.logBase,
                    flip: !valueAxis.flip
                }
            );

            return value;
        },


        _detectDateFormat: function (samples, additionalFormats) {
            var formats = {
                // en-US
                // short date pattern
                en_US_d: "M/d/yyyy",
                // long date pattern
                en_US_D: "dddd, MMMM dd, yyyy",
                // short time pattern
                en_US_t: "h:mm tt",
                // long time pattern
                en_US_T: "h:mm:ss tt",
                // long date, short time pattern
                en_US_f: "dddd, MMMM dd, yyyy h:mm tt",
                // long date, long time pattern
                en_US_F: "dddd, MMMM dd, yyyy h:mm:ss tt",
                // month/day pattern
                en_US_M: "MMMM dd",
                // month/year pattern
                en_US_Y: "yyyy MMMM",
                // S is a sortable format that does not vary by culture
                en_US_S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss",

                // en-CA
                en_CA_d: "dd/MM/yyyy",
                en_CA_D: "MMMM-dd-yy",
                en_CA_f: "MMMM-dd-yy h:mm tt",
                en_CA_F: "MMMM-dd-yy h:mm:ss tt",

                // formatting of dates in MySQL Databases
                ISO: "yyyy-MM-dd hh:mm:ss",
                ISO2: "yyyy-MM-dd HH:mm:ss",
                d1: "dd.MM.yyyy",
                d2: "dd-MM-yyyy",
                zone1: "yyyy-MM-ddTHH:mm:ss-HH:mm",
                zone2: "yyyy-MM-ddTHH:mm:ss+HH:mm",
                custom: "yyyy-MM-ddTHH:mm:ss.fff",
                custom2: "yyyy-MM-dd HH:mm:ss.fff",

                // de-DE
                de_DE_d: "dd.MM.yyyy",
                de_DE_D: "dddd, d. MMMM yyyy",
                de_DE_t: "HH:mm",
                de_DE_T: "HH:mm:ss",
                de_DE_f: "dddd, d. MMMM yyyy HH:mm",
                de_DE_F: "dddd, d. MMMM yyyy HH:mm:ss",
                de_DE_M: "dd MMMM",
                de_DE_Y: "MMMM yyyy",

                // fr-FR
                fr_FR_d: "dd/MM/yyyy",
                fr_FR_D: "dddd d MMMM yyyy",
                fr_FR_t: "HH:mm",
                fr_FR_T: "HH:mm:ss",
                fr_FR_f: "dddd d MMMM yyyy HH:mm",
                fr_FR_F: "dddd d MMMM yyyy HH:mm:ss",
                fr_FR_M: "d MMMM",
                fr_FR_Y: "MMMM yyyy",

                // it-IT
                it_IT_d: "dd/MM/yyyy",
                it_IT_D: "dddd d MMMM yyyy",
                it_IT_t: "HH:mm",
                it_IT_T: "HH:mm:ss",
                it_IT_f: "dddd d MMMM yyyy HH:mm",
                it_IT_F: "dddd d MMMM yyyy HH:mm:ss",
                it_IT_M: "dd MMMM",
                it_IT_Y: "MMMM yyyy",

                // Ru
                ru_RU_d: "dd.MM.yyyy",
                ru_RU_D: "d MMMM yyyy '?.'",
                ru_RU_t: "H:mm",
                ru_RU_T: "H:mm:ss",
                ru_RU_f: "d MMMM yyyy '?.' H:mm",
                ru_RU_F: "d MMMM yyyy '?.' H:mm:ss",
                ru_RU_Y: "MMMM yyyy",

                // cs-CZ
                cs_CZ_d: "d.M.yyyy",
                cs_CZ_D: "d. MMMM yyyy",
                cs_CZ_t: "H:mm",
                cs_CZ_T: "H:mm:ss",
                cs_CZ_f: "d. MMMM yyyy H:mm",
                cs_CZ_F: "d. MMMM yyyy H:mm:ss",
                cs_CZ_M: "dd MMMM",
                cs_CZ_Y: "MMMM yyyy",

                // he-IL
                he_IL_d: "dd MMMM yyyy",
                he_IL_D: "dddd dd MMMM yyyy",
                he_IL_t: "HH:mm",
                he_IL_T: "HH:mm:ss",
                he_IL_f: "dddd dd MMMM yyyy HH:mm",
                he_IL_F: "dddd dd MMMM yyyy HH:mm:ss",
                he_IL_M: "dd MMMM",
                he_IL_Y: "MMMM yyyy",

                // hr-HR
                hr_HR_d: "d.M.yyyy.",
                hr_HR_D: "d. MMMM yyyy.",
                hr_HR_t: "H:mm",
                hr_HR_T: "H:mm:ss",
                hr_HR_f: "d. MMMM yyyy. H:mm",
                hr_HR_F: "d. MMMM yyyy. H:mm:ss",
                hr_HR_M: "d. MMMM",

                // hu-HU
                hu_HU_d: "yyyy.MM.dd.",
                hu_HU_D: "yyyy. MMMM d.",
                hu_HU_t: "H:mm",
                hu_HU_T: "H:mm:ss",
                hu_HU_f: "yyyy. MMMM d. H:mm",
                hu_HU_F: "yyyy. MMMM d. H:mm:ss",
                hu_HU_M: "MMMM d.",
                hu_HU_Y: "yyyy. MMMM",

                // jp-JP
                jp_JP_d: "gg y/M/d",
                jp_JP_D: "gg y'?'M'?'d'?'",
                jp_JP_t: "H:mm",
                jp_JP_T: "H:mm:ss",
                jp_JP_f: "gg y'?'M'?'d'?' H:mm",
                jp_JP_F: "gg y'?'M'?'d'?' H:mm:ss",
                jp_JP_M: "M'?'d'?'",
                jp_JP_Y: "gg y'?'M'?'",

                // LT
                lt_LT_d: "yyyy.MM.dd",
                lt_LT_D: "yyyy 'm.' MMMM d 'd.'",
                lt_LT_t: "HH:mm",
                lt_LT_T: "HH:mm:ss",
                lt_LT_f: "yyyy 'm.' MMMM d 'd.' HH:mm",
                lt_LT_F: "yyyy 'm.' MMMM d 'd.' HH:mm:ss",
                lt_LT_M: "MMMM d 'd.'",
                lt_LT_Y: "yyyy 'm.' MMMM",

                // sa-IN
                sa_IN_d: "dd-MM-yyyy",
                sa_IN_D: "dd MMMM yyyy dddd",
                sa_IN_t: "HH:mm",
                sa_IN_T: "HH:mm:ss",
                sa_IN_f: "dd MMMM yyyy dddd HH:mm",
                sa_IN_F: "dd MMMM yyyy dddd HH:mm:ss",
                sa_IN_M: "dd MMMM",

                // basic
                basic_y: "yyyy",
                basic_ym: "yyyy-MM",
                basic_d: "yyyy-MM-dd",
                basic_dhm: "yyyy-MM-dd hh:mm",
                basic_bhms: "yyyy-MM-dd hh:mm:ss",
                basic2_ym: "MM-yyyy",
                basic2_d: "MM-dd-yyyy",
                basic2_dhm: "MM-dd-yyyy hh:mm",
                basic2_dhms: "MM-dd-yyyy hh:mm:ss",

                basic3_ym: "yyyy/MM",
                basic3_d: "yyyy/MM/dd",
                basic3_dhm: "yyyy/MM/dd hh:mm",
                basic3_bhms: "yyyy/MM/dd hh:mm:ss",
                basic4_ym: "MM/yyyy",
                basic4_d: "MM/dd/yyyy",
                basic4_dhm: "MM/dd/yyyy hh:mm",
                basic4_dhms: "MM/dd/yyyy hh:mm:ss"
            };

            if (additionalFormats)
                formats = $.extend({}, formats, additionalFormats);

            var arr = [];
            if (!$.isArray(samples))
                arr.push(samples);
            else
                arr = samples;

            for (var j in formats)
                formats[j] = { format: formats[j], count: 0 };

            for (var i = 0; i < arr.length; i++) {
                value = arr[i];
                if (value == null || value == undefined)
                    continue;

                for (var j in formats) {
                    var result = $.jqx.dataFormat.parsedate(value, formats[j].format);
                    if (result != null)
                        formats[j].count++;
                }
            }

            var best = { key: undefined, count: 0 };
            for (var j in formats) {
                if (formats[j].count > best.count) {
                    best.key = j;
                    best.count = formats[j].count;
                }
            }

            return best.key ? formats[best.key].format : '';
        },

        _testXAxisDateFormat: function (groupIndex) {
            var self = this;

            var xAxis = self._getXAxis(groupIndex);
            var dataLength = self._getDataLen(groupIndex);

            var localizationFormats = {};
            if (self.localization && self.localization.patterns) {
                for (var key in self.localization.patterns)
                    localizationFormats['local_' + key] = self.localization.patterns[key];
            }

            var samples = [];
            for (var i = 0; i < dataLength && i < 10; i++) {
                value = self._getDataValue(i, xAxis.dataField, groupIndex);
                if (value == null || value == undefined)
                    continue;

                samples.push(value);
            }

            var dateFormat = self._detectDateFormat(samples, localizationFormats);
            return dateFormat;
        }
    });

})(jqxBaseFramework);
(function ($) {
    $.extend($.jqx._jqxChart.prototype,
    {
        _moduleApi: true,

        getItemsCount: function(groupIndex, serieIndex)
        {
            var g = this.seriesGroups[groupIndex];

            if (!this._isSerieVisible(groupIndex, serieIndex))
                return 0;

            var renderData = this._renderData;
            if (!g || !renderData || renderData.length <= groupIndex)
                return 0;
                
            var serie = g.series[serieIndex];
            if (!serie)
                return 0;

            return renderData[groupIndex].offsets[serieIndex].length;

        },

        getXAxisRect: function(groupIndex)
        {
            var renderData = this._renderData;
            if (!renderData || renderData.length <= groupIndex)
                return undefined;

            if (!renderData[groupIndex].xAxis)
                return undefined;

            return renderData[groupIndex].xAxis.rect;
        },

        getXAxisLabels: function(groupIndex)
        {
            var output = [];

            var renderData = this._renderData;
            if (!renderData || renderData.length <= groupIndex)
                return output;

            renderData = renderData[groupIndex].xAxis;
            if (!renderData)
                return output;

            var group = this.seriesGroups[groupIndex];

            if (group.polar || group.spider)
            {
                for (var i = 0; i < renderData.polarLabels.length; i++)
                {
                    var label = renderData.polarLabels[i];
                    output.push({offset: {x: label.x, y: label.y}, value: label.value});
                }

                return output;
            }

            var xAxis = this._getXAxis(groupIndex);
            var rect = this.getXAxisRect(groupIndex);            
            var swapPosition = xAxis.position == 'top' || xAxis.position == 'right';
            var swapXY = group.orientation == 'horizontal';

            for (var i = 0; i < renderData.data.length; i++)
            {
                if (swapXY)
                    output.push({offset: {x: rect.x + (swapPosition ? 0 : rect.width), y: rect.y + renderData.data.data[i]}, value: renderData.data.xvalues[i]});
                else
                    output.push({offset: {x: rect.x + renderData.data.data[i], y: rect.y + (swapPosition ? rect.height : 0)}, value: renderData.data.xvalues[i]});
            }

            return output;
        },

        getValueAxisRect: function(groupIndex)
        {
            var renderData = this._renderData;
            if (!renderData || renderData.length <= groupIndex)
                return undefined;

            if (!renderData[groupIndex].valueAxis)
                return undefined;

            return renderData[groupIndex].valueAxis.rect;
        },

        getValueAxisLabels: function(groupIndex)
        {
            var output = [];

            var renderData = this._renderData;
            if (!renderData || renderData.length <= groupIndex)
                return output;

            renderData = renderData[groupIndex].valueAxis;
            if (!renderData)
                return output;

            var valueAxis = this._getValueAxis(groupIndex);
            var swapPosition = valueAxis.position == 'top' || valueAxis.position == 'right';

            var group = this.seriesGroups[groupIndex];
            var swapXY = group.orientation == 'horizontal';

            if (group.polar || group.spider)
            {
                for (var i = 0; i < renderData.polarLabels.length; i++)
                {
                    var label = renderData.polarLabels[i];
                    output.push({offset: {x: label.x, y: label.y}, value: label.value});
                }

                return output;
            }

            for (var i = 0; i < renderData.items.length; i++)
            {
                if (swapXY)
                {
                    output.push(
                        {
                            offset: 
                            {
                                x: renderData.itemOffsets[renderData.items[i]].x + renderData.itemWidth/2,
                                y: renderData.rect.y + (swapPosition ? renderData.rect.height : 0)
                            }, 
                            value: renderData.items[i]
                        }
                    );
                }
                else
                {
                    output.push(
                        {
                            offset: 
                            {
                                x: renderData.rect.x + renderData.rect.width, 
                                y: renderData.itemOffsets[renderData.items[i]].y + renderData.itemWidth/2
                            }, 
                            value: renderData.items[i]
                        }
                    );

                }
            }

            return output;
        },


        getPlotAreaRect: function()
        {
            return this._plotRect;
        },

        getRect: function()
        {
            return this._rect;
        },

        showToolTip: function(groupIndex, serieIndex, itemIndex, showDelay, hideDelay)
        {
            var coord = this.getItemCoord(groupIndex, serieIndex, itemIndex);
            if (isNaN(coord.x) || isNaN(coord.y))
                return;

            this._startTooltipTimer(groupIndex, serieIndex, itemIndex, coord.x, coord.y, showDelay, hideDelay);
        },

        hideToolTip: function(hideDelay)
        {
            if (isNaN(hideDelay))
                hideDelay = 0;

            var self = this;
            self._cancelTooltipTimer();

            setTimeout(function() {
                    self._hideToolTip(0);
                }, 
                hideDelay
            );
        },

    });
})(jqxBaseFramework);


(function ($) {
    $.extend($.jqx._jqxChart.prototype,
    {
        _moduleRangeSelector: true,

        /**
        * Renders the xAxis range selector
        * @private 
        * @param {number} group index
        * @param {object} bounding rectangle of the xAxis in relative coords
        */
        _renderXAxisRangeSelector: function (groupIndex, rect) {
            var self = this;
            self._isTouchDevice = $.jqx.mobile.isTouchDevice();

            var g = self.seriesGroups[groupIndex];
            var axis = self._getXAxis(groupIndex);
            var rangeSelector = axis ? axis.rangeSelector : undefined;

            if (!self._isSelectorRefresh) {
                var elHost = (rangeSelector && rangeSelector.renderTo) ? rangeSelector.renderTo : self.host;
                elHost.find(".rangeSelector").remove();
            }

            if (!axis || axis.visible == false || g.type == 'spider')
                return false;

            if (!self._isGroupVisible(groupIndex))
                return false;

            if (!rangeSelector)
                return false;

            var swapXY = g.orientation == 'horizontal';
            if (rangeSelector.renderTo)
                swapXY = false;

            if (self.rtl)
                axis.flip = true;

            var axisSize = swapXY ? this.host.height() : this.host.width();
            axisSize -= 4;

            var axisStats = this._getXAxisStats(groupIndex, axis, axisSize);

            var axisPosition = axis.position;
            if (rangeSelector.renderTo && rangeSelector.position)
                axisPosition = rangeSelector.position;

            if (!this._isSelectorRefresh) {
                var renderTo = rangeSelector.renderTo;

                var div = "<div class='rangeSelector jqx-disableselect' style='position: absolute; background-color: transparent;' onselectstart='return false;'></div>";

                var element = $(div).appendTo(renderTo ? renderTo : this.renderer.getContainer());

                if (!renderTo) {
                    var coord = this.host.coord();
                    coord.top = 0;
                    coord.left = 0;
                    selectorSize = this._selectorGetSize(axis);
                    if (!swapXY) {
                        element.css('left', coord.left + 1);
                        element.css('top', coord.top + rect.y + (axisPosition != 'top' ? rect.height : -selectorSize));
                        element.css('height', selectorSize);
                        element.css('width', axisSize);

                        // rect.width = selectorSize;
                    }
                    else {
                        element.css('left', coord.left + 1 + rect.x + (axisPosition != 'right' ? -selectorSize : rect.width));
                        element.css('top', coord.top);
                        element.css('height', axisSize);
                        element.css('width', selectorSize);

                        rect.height = selectorSize;
                    }
                }
                else {
                    element.css({ width: renderTo.width(), height: renderTo.height() });
                    rect.width = renderTo.width();
                    rect.height = renderTo.height();
                }

                this._refreshSelector(groupIndex, axis, axisStats, element, rect, swapXY);
            }

            this._isSelectorRefresh = false;

            return true;
        },


        _refreshSelector: function (groupIndex, axis, axisStats, renderTo, rect, swapXY) {
            var xAxisSettings = {};
            var selector = axis.rangeSelector;
            var group = this.seriesGroups[groupIndex];

            for (var i in selector)
                xAxisSettings[i] = selector[i];

            delete xAxisSettings.padding;

            var min = xAxisSettings.minValue;
            var max = xAxisSettings.maxValue;

            if (undefined == min)
                min = Math.min(axisStats.min.valueOf(), axisStats.dsRange.min.valueOf());
            if (undefined == max)
                max = Math.max(axisStats.max.valueOf(), axisStats.dsRange.max.valueOf());

            if (this._isDate(axisStats.min))
                min = new Date(min);
            if (this._isDate(axisStats.max))
                max = new Date(max);

            var axisPosition = axis.position;
            if (selector.renderTo && selector.position)
                axisPosition = selector.position;

            xAxisSettings.dataField = axis.dataField;
            delete xAxisSettings.rangeSelector;
            xAxisSettings.type = axis.type;
            xAxisSettings.baseUnit = selector.baseUnit || axis.baseUnit;
            xAxisSettings.minValue = min;
            xAxisSettings.maxValue = max;
            xAxisSettings.flip = axis.flip;
            xAxisSettings.position = axisPosition;

            var defaultPadding = 5;

            var leftPadding = 2,
                rightPadding = 2,
                topPadding = 2,
                bottomPadding = 2;

            if (!selector.renderTo) {
                leftPadding = swapXY ? 0 : rect.x;
                rightPadding = swapXY ? 0 : this._rect.width - rect.x - rect.width;
                topPadding = swapXY ? rect.y : defaultPadding;
                bottomPadding = swapXY ? this._paddedRect.height - this._plotRect.height : defaultPadding;
            }

            var padding = selector.padding;
            if (padding == undefined && !selector.renderTo)
                padding = { left: leftPadding, top: topPadding, right: rightPadding, bottom: bottomPadding };
            else {
                padding = {
                    left: ((padding && padding.left) ? padding.left : leftPadding),
                    top: ((padding && padding.top) ? padding.top : topPadding),
                    right: ((padding && padding.right) ? padding.right : rightPadding),
                    bottom: ((padding && padding.bottom) ? padding.bottom : bottomPadding)
                };
            }

            var dataField = axis.rangeSelector.dataField;
            for (var i = 0; undefined == dataField && i < this.seriesGroups.length; i++) {
                for (var j = 0; undefined == dataField && j < this.seriesGroups[i].series.length; j++)
                    dataField = this.seriesGroups[i].series[j].dataField;
            }

            var rangeSelectorSettings =
            {
                padding: padding,
                _isRangeSelectorInstance: true,
                title: selector.title || '',
                description: selector.description || '',
                titlePadding: selector.titlePadding,
                colorScheme: selector.colorScheme || this.colorScheme,
                backgroundColor: selector.backgroundColor || this.backgroundColor || 'transparent',
                backgroundImage: selector.backgroundImage || '',
                showBorderLine: selector.showBorderLine || (selector.renderTo ? true : false),
                borderLineWidth: selector.borderLineWidth || this.borderLineWidth,
                borderLineColor: selector.borderLineColor || this.borderLineColor,
                rtl: selector.rtl || this.rtl,
                greyScale: selector.greyScale || this.greyScale,
                renderEngine: this.renderEngine,
                showLegend: false,
                enableAnimations: false,
                enableEvents: false,
                showToolTips: false,
                source: this.source,
                xAxis: xAxisSettings,
                seriesGroups:
                [
                    {
                        orientation: swapXY ? 'horizontal' : 'vertical',
                        valueAxis:
                        {
                            visible: false
                            //unitInterval: 10
                        },
                        type: axis.rangeSelector.serieType || 'area',
                        skipOverlappingPoints: $.jqx.getByPriority([axis.rangeSelector.skipOverlappingPoints, true]),
                        columnSeriesOverlap: $.jqx.getByPriority([axis.rangeSelector.columnSeriesOverlap, false]),
                        columnsGapPercent: $.jqx.getByPriority([axis.rangeSelector.columnsGapPercent, 25]),
                        seriesGapPercent: $.jqx.getByPriority([axis.rangeSelector.seriesGapPercent, 25]),
                        series:
                            [
                                { dataField: dataField, opacity: 0.8, lineWidth: 1 }
                            ]
                    }
                ]
            }

            if (!rangeSelectorSettings.showBorderLine) {
                rangeSelectorSettings.borderLineWidth = 1;
                rangeSelectorSettings.borderLineColor = $.jqx.getByPriority([this.backgroundColor, this.background, '#FFFFFF']);
                rangeSelectorSettings.showBorderLine = true;
            }



            var self = this;

            self._supressBindingRefresh = true;

            renderTo.empty();
            renderTo.jqxChart(rangeSelectorSettings);

            self._rangeSelectorInstances[groupIndex] = renderTo;

            self._supressBindingRefresh = false;

            // disable for main chart when movign over the selector
            renderTo.on(self._getEvent('mousemove'), function () { self._unselect(); self._hideToolTip(); });

            var instance = renderTo.jqxChart('getInstance');
            if (!instance._plotRect)
                return;

            var sliderRect = instance._paddedRect;
            sliderRect.height = instance._plotRect.height;
            if (!swapXY && axisPosition == 'top')
                sliderRect.y += instance._renderData[0].xAxis.rect.height;
            else if (swapXY) {
                var sliderXAxisWidth = instance._renderData[0].xAxis.rect.width;
                sliderRect.width -= sliderXAxisWidth;
                if (axisPosition != 'right')
                    sliderRect.x += sliderXAxisWidth;
            }

            self._createSliderElements(groupIndex, renderTo, sliderRect, selector);

            self.removeHandler($(document), self._getEvent('mousemove') + '.' + this.element.id, self._onSliderMouseMove)
            self.removeHandler($(document), self._getEvent('mousedown'), self._onSliderMouseDown)
            self.removeHandler($(document), self._getEvent('mouseup') + '.' + this.element.id, self._onSliderMouseUp)

            self.addHandler($(document), self._getEvent('mousemove') + '.' + this.element.id, self._onSliderMouseMove, { self: this, groupIndex: groupIndex, renderTo: renderTo, swapXY: swapXY });
            self.addHandler($(renderTo), self._getEvent('mousedown'), this._onSliderMouseDown, { self: this, groupIndex: groupIndex, renderTo: renderTo, swapXY: swapXY });
            self.addHandler($(document), self._getEvent('mouseup') + '.' + this.element.id, self._onSliderMouseUp, { element: this.element.id, self: this, groupIndex: groupIndex, renderTo: renderTo, swapXY: swapXY });
        },

        _createSliderElements: function (groupIndex, renderTo, rect, selectorSettings) {
            renderTo.find('.slider').remove();

            var colorSelectedRange = selectorSettings.selectedRangeColor || 'blue';
            var selectedRangeOpacity = $.jqx.getByPriority([selectorSettings.selectedRangeOpacity, 0.1]);
            var unselectedRangeOpacity = $.jqx.getByPriority([selectorSettings.unselectedRangeOpacity, 0.5]);
            var colorUnselectedRange = selectorSettings.unselectedRangeColor || 'white';
            var colorRangeLineColor = selectorSettings.rangeLineColor || 'grey';

            var div = $("<div class='slider' style='position: absolute;'></div>");
            div.css({ background: colorSelectedRange, opacity: selectedRangeOpacity, left: rect.x, top: rect.y, width: rect.width, height: rect.height });
            div.appendTo(renderTo);

            while (this._sliders.length < groupIndex + 1)
                this._sliders.push({});


            var divAreaDef = "<div class='slider' style='position: absolute;  background: " + colorUnselectedRange + "; opacity: " + unselectedRangeOpacity + ";'></div>";
            var divBorderDef = "<div class='slider' style='position: absolute; background:" + colorRangeLineColor + "; opacity: " + unselectedRangeOpacity + ";'></div>";
            var divBarDef = "<div class='slider jqx-rc-all' style='position: absolute; background: white; border-style: solid; border-width: 1px; border-color: " + colorRangeLineColor + ";'></div>";

            this._sliders[groupIndex] = {
                element: div,
                host: renderTo,
                _sliderInitialAbsoluteRect: { x: div.coord().left, y: div.coord().top, width: rect.width, height: rect.height },
                _hostInitialAbsolutePos: { x: renderTo.coord().left, y: renderTo.coord().top },
                getRect: function () {
                    return {
                        x: this.host.coord().left - this._hostInitialAbsolutePos.x + this._sliderInitialAbsoluteRect.x,
                        y: this.host.coord().top - this._hostInitialAbsolutePos.y + this._sliderInitialAbsoluteRect.y,
                        width: this._sliderInitialAbsoluteRect.width,
                        height: this._sliderInitialAbsoluteRect.height
                    };
                },
                rect: rect,
                left: $(divAreaDef),
                right: $(divAreaDef),
                leftTop: $(divBorderDef),
                rightTop: $(divBorderDef),
                leftBorder: $(divBorderDef),
                leftBar: $(divBarDef),
                rightBorder: $(divBorderDef),
                rightBar: $(divBarDef)
            };

            this._sliders[groupIndex].left.appendTo(renderTo);
            this._sliders[groupIndex].right.appendTo(renderTo);
            this._sliders[groupIndex].leftTop.appendTo(renderTo);
            this._sliders[groupIndex].rightTop.appendTo(renderTo);
            this._sliders[groupIndex].leftBorder.appendTo(renderTo);
            this._sliders[groupIndex].rightBorder.appendTo(renderTo);
            this._sliders[groupIndex].leftBar.appendTo(renderTo);
            this._sliders[groupIndex].rightBar.appendTo(renderTo);

            var renderData = this._renderData[groupIndex].xAxis;
            var stats = renderData.data.axisStats;

            var minValue = stats.min.valueOf();
            var maxValue = stats.max.valueOf();

            var startOffset = this._valueToOffset(groupIndex, minValue);
            var endOffset = this._valueToOffset(groupIndex, maxValue);

            if (startOffset > endOffset) {
                var tmp = endOffset;
                endOffset = startOffset;
                startOffset = tmp;
            }

            if (this.seriesGroups[groupIndex].orientation != 'horizontal')
                div.css({ left: Math.round(rect.x + startOffset), top: rect.y, width: Math.round(endOffset - startOffset), height: rect.height });
            else
                div.css({ top: Math.round(rect.y + startOffset), left: rect.x, height: Math.round(endOffset - startOffset), width: rect.width });

            this._setSliderPositions(groupIndex, startOffset, endOffset);
        },

        _setSliderPositions: function (groupIndex, startOffset, endOffset) {
            var g = this.seriesGroups[groupIndex];
            var axis = this._getXAxis(groupIndex);
            var selector = axis.rangeSelector;

            var swapXY = g.orientation == 'horizontal';
            if (axis.rangeSelector.renderTo)
                swapXY = false;

            var axisPosition = axis.position;
            if (selector.renderTo && selector.position)
                axisPosition = selector.position;

            var invertedAxisPos = (swapXY && axisPosition == 'right') || (!swapXY && axisPosition == 'top');

            var slider = this._sliders[groupIndex];

            var posProp = swapXY ? 'top' : 'left';
            var oPosProp = swapXY ? 'left' : 'top';
            var sizeProp = swapXY ? 'height' : 'width';
            var oSizeProp = swapXY ? 'width' : 'height';
            var rectPosProp = swapXY ? 'y' : 'x';
            var rectOPosProp = swapXY ? 'x' : 'y';

            var rect = slider.rect;

            slider.startOffset = startOffset;
            slider.endOffset = endOffset;

            slider.left.css(posProp, rect[rectPosProp]);
            slider.left.css(oPosProp, rect[rectOPosProp]);
            slider.left.css(sizeProp, startOffset);
            slider.left.css(oSizeProp, rect[oSizeProp]);

            slider.right.css(posProp, rect[rectPosProp] + endOffset);
            slider.right.css(oPosProp, rect[rectOPosProp]);
            slider.right.css(sizeProp, rect[sizeProp] - endOffset + 1);
            slider.right.css(oSizeProp, rect[oSizeProp]);

            slider.leftTop.css(posProp, rect[rectPosProp]);
            slider.leftTop.css(oPosProp, rect[rectOPosProp] + (((swapXY && axisPosition == 'right') || (!swapXY && axisPosition != 'top')) ? 0 : rect[oSizeProp]));
            slider.leftTop.css(sizeProp, startOffset);
            slider.leftTop.css(oSizeProp, 1);

            slider.rightTop.css(posProp, rect[rectPosProp] + endOffset);
            slider.rightTop.css(oPosProp, rect[rectOPosProp] + (((swapXY && axisPosition == 'right') || (!swapXY && axisPosition != 'top')) ? 0 : rect[oSizeProp]));
            slider.rightTop.css(sizeProp, rect[sizeProp] - endOffset + 1);
            slider.rightTop.css(oSizeProp, 1);

            slider.leftBorder.css(posProp, rect[rectPosProp] + startOffset);
            slider.leftBorder.css(oPosProp, rect[rectOPosProp]);
            slider.leftBorder.css(sizeProp, 1);
            slider.leftBorder.css(oSizeProp, rect[oSizeProp]);

            var handleBarSize = rect[oSizeProp] / 4;
            if (handleBarSize > 20)
                handleBarSize = 20;
            if (handleBarSize < 3)
                handleBarSize = 3;

            slider.leftBar.css(posProp, rect[rectPosProp] + startOffset - 3);
            slider.leftBar.css(oPosProp, rect[rectOPosProp] + rect[oSizeProp] / 2 - handleBarSize / 2);
            slider.leftBar.css(sizeProp, 5);
            slider.leftBar.css(oSizeProp, handleBarSize);

            slider.rightBorder.css(posProp, rect[rectPosProp] + endOffset);
            slider.rightBorder.css(oPosProp, rect[rectOPosProp]);
            slider.rightBorder.css(sizeProp, 1);
            slider.rightBorder.css(oSizeProp, rect[oSizeProp]);

            slider.rightBar.css(posProp, rect[rectPosProp] + endOffset - 3);
            slider.rightBar.css(oPosProp, rect[rectOPosProp] + rect[oSizeProp] / 2 - handleBarSize / 2);
            slider.rightBar.css(sizeProp, 5);
            slider.rightBar.css(oSizeProp, handleBarSize);

        },

        _resizeState: {},

        _onSliderMouseDown: function (event) {
            event.stopImmediatePropagation();
            event.stopPropagation();

            var self = event.data.self;
            var slider = self._sliders[event.data.groupIndex];
            if (!slider)
                return;

            if (self._resizeState.state == undefined)
                self._testAndSetReadyResize(event);

            if (self._resizeState.state != 'ready')
                return;

            $.jqx._rangeSelectorTarget = self;
            self._resizeState.state = 'resizing';
        },

        _valueToOffset: function (groupIndex, value) {
            var group = this.seriesGroups[groupIndex];
            var slider = this._sliders[groupIndex];

            var selectorChart = slider.host.jqxChart('getInstance');
            var renderData = selectorChart._renderData[0].xAxis;
            var stats = renderData.data.axisStats;

            var axisMin = stats.min.valueOf();
            var axisMax = stats.max.valueOf();

            var denom = axisMax - axisMin;
            if (denom == 0)
                denom = 1;

            var axis = this._getXAxis(groupIndex);
            var sizeProp = group.orientation == 'horizontal' ? 'height' : 'width';

            var percent = (value.valueOf() - axisMin) / denom;

            return slider.getRect()[sizeProp] * (axis.flip ? (1 - percent) : percent);
        },

        _offsetToValue: function (groupIndex, offset) {
            var slider = this._sliders[groupIndex];

            var group = this.seriesGroups[groupIndex];
            var axis = this._getXAxis(groupIndex);

            var sizeProp = group.orientation == 'horizontal' ? 'height' : 'width';

            var denom = slider.getRect()[sizeProp];
            if (denom == 0)
                denom = 1;
            var percent = offset / denom;

            var selectorChart = slider.host.jqxChart('getInstance');
            var renderData = selectorChart._renderData[0].xAxis;
            var stats = renderData.data.axisStats;

            var axisMin = stats.min.valueOf();
            var axisMax = stats.max.valueOf();

            var value = offset / denom * (axisMax - axisMin) + axisMin;

            if (axis.flip == true) {
                value = axisMax - offset / denom * (axisMax - axisMin);
            }

            if (this._isDate(stats.min) || this._isDate(stats.max)) {
                value = new Date(value);
            }
            else {
                if (axis.dataField == undefined || stats.useIndeces)
                    value = Math.round(value);

                if (value < stats.min)
                    value = stats.min;
                if (value > stats.max)
                    value = stats.max;
            }

            return value;
        },

        _onSliderMouseUp: function (event) {
            var self = $.jqx._rangeSelectorTarget;
            if (!self)
                return;

            var groupIndex = event.data.groupIndex;
            var swapXY = event.data.swapXY;

            var slider = self._sliders[groupIndex];
            if (!slider)
                return;

            if (self._resizeState.state != 'resizing')
                return;

            event.stopImmediatePropagation();
            event.stopPropagation();

            self._resizeState = {};

            // update
            self.host.css('cursor', 'default');

            var leftProp = !swapXY ? 'left' : 'top';
            var widthProp = !swapXY ? 'width' : 'height';
            var posProp = !swapXY ? 'x' : 'y';

            var from = slider.element.coord()[leftProp];
            var to = from + (!swapXY ? slider.element.width() : slider.element.height());

            var fullRect = slider.getRect();

            var minValue = self._offsetToValue(groupIndex, from - fullRect[posProp]);
            var maxValue = self._offsetToValue(groupIndex, to - fullRect[posProp]);

            var selectorChart = slider.host.jqxChart('getInstance');
            var renderData = selectorChart._renderData[0].xAxis;
            var stats = renderData.data.axisStats;

            if (!stats.isTimeUnit && (maxValue.valueOf() - minValue.valueOf()) > 86400000) {
                minValue.setHours(0, 0, 0, 0);
                maxValue.setDate(maxValue.getDate() + 1);
                maxValue.setHours(0, 0, 0, 0);
            }

            var axis = self._getXAxis(groupIndex);
            if (axis.flip) {
                var tmp = minValue;
                minValue = maxValue;
                maxValue = tmp;
            }

            // apply to all groups that share this range selector
            for (var i = 0; i < self.seriesGroups.length; i++) {
                var groupXAxis = self._getXAxis(i);
                if (groupXAxis == axis)
                    self._selectorRange[i] = { min: minValue, max: maxValue };
            }

            self._isSelectorRefresh = true;
            var animSave = self.enableAnimations;

            self._raiseEvent('rangeSelectionChanging', { instance: self, minValue: minValue, maxValue: maxValue });

            self.enableAnimations = false;
            self.update();
            self.enableAnimations = animSave;

            self._raiseEvent('rangeSelectionChanged', { instance: self, minValue: minValue, maxValue: maxValue });
        },

        _onSliderMouseMove: function (event) {
            var self = event.data.self;
            var renderTo = event.data.renderTo;
            var groupIndex = event.data.groupIndex;
            var slider = self._sliders[groupIndex];
            var swapXY = event.data.swapXY;

            if (!slider)
                return;

            var rect = slider.getRect();
            var element = slider.element;

            var position = $.jqx.position(event);
            var coord = element.coord();

            var topProp = swapXY ? 'left' : 'top';
            var leftProp = !swapXY ? 'left' : 'top';
            var heightProp = swapXY ? 'width' : 'height';
            var widthProp = !swapXY ? 'width' : 'height';

            var posProp = !swapXY ? 'x' : 'y';

            if (self._resizeState.state == 'resizing') {
                event.stopImmediatePropagation();
                event.stopPropagation();

                if (self._resizeState.side == 'left') {
                    var diff = Math.round(position[leftProp] - coord[leftProp]);
                    var pos = rect[posProp];
                    if (coord[leftProp] + diff >= pos && coord[leftProp] + diff <= pos + rect[widthProp]) {
                        var left = parseInt(element.css(leftProp));
                        var newSize = Math.max(2, (swapXY ? element.height() : element.width()) - diff);
                        element.css(widthProp, newSize);
                        element.css(leftProp, left + diff);
                    }
                }
                else if (self._resizeState.side == 'right') {
                    var elementSize = swapXY ? element.height() : element.width();
                    var diff = Math.round(position[leftProp] - coord[leftProp] - elementSize);
                    var pos = rect[posProp];
                    if (coord[leftProp] + elementSize + diff >= pos && coord[leftProp] + diff + elementSize <= pos + rect[widthProp]) {
                        var newSize = Math.max(2, elementSize + diff);
                        element.css(widthProp, newSize);
                    }
                }
                else if (self._resizeState.side == 'move') {
                    var elementSize = swapXY ? element.height() : element.width();
                    var left = parseInt(element.css(leftProp));
                    var diff = Math.round(position[leftProp] - self._resizeState.startPos);

                    if (coord[leftProp] + diff >= rect[posProp] &&
                        coord[leftProp] + diff + elementSize <= rect[posProp] + rect[widthProp]
                    ) {
                        self._resizeState.startPos = position[leftProp];
                        element.css(leftProp, left + diff);
                    }
                }

                var startOffset = parseInt(element.css(leftProp)) - slider.rect[posProp];
                var endOffset = startOffset + (swapXY ? element.height() : element.width());
                self._setSliderPositions(groupIndex, startOffset, endOffset);
            }
            else {
                self._testAndSetReadyResize(event);
            }
        },

        _testAndSetReadyResize: function (event) {
            var self = event.data.self;
            var renderTo = event.data.renderTo;
            var groupIndex = event.data.groupIndex;
            var slider = self._sliders[groupIndex];
            var swapXY = event.data.swapXY;

            var rect = slider.getRect();
            var element = slider.element;

            var position = $.jqx.position(event);
            var coord = element.coord();

            var topProp = swapXY ? 'left' : 'top';
            var leftProp = !swapXY ? 'left' : 'top';
            var heightProp = swapXY ? 'width' : 'height';
            var widthProp = !swapXY ? 'width' : 'height';

            var posProp = !swapXY ? 'x' : 'y';

            var diff = self._isTouchDevice ? 30 : 5;

            if (position[topProp] >= coord[topProp] && position[topProp] <= coord[topProp] + rect[heightProp]) {
                if (Math.abs(position[leftProp] - coord[leftProp]) <= diff) {
                    renderTo.css('cursor', swapXY ? 'row-resize' : 'col-resize');
                    self._resizeState = { state: 'ready', side: 'left' };
                }
                else if (Math.abs(position[leftProp] - coord[leftProp] - (!swapXY ? element.width() : element.height())) <= diff) {
                    renderTo.css('cursor', swapXY ? 'row-resize' : 'col-resize');
                    self._resizeState = { state: 'ready', side: 'right' };
                }
                else if (position[leftProp] + diff > coord[leftProp] && position[leftProp] - diff < coord[leftProp] + (!swapXY ? element.width() : element.height())) {
                    renderTo.css('cursor', 'pointer');
                    self._resizeState = { state: 'ready', side: 'move', startPos: position[leftProp] };
                }
                else {
                    renderTo.css('cursor', 'default');
                    self._resizeState = {};
                }
            }
            else {
                renderTo.css('cursor', 'default');
                self._resizeState = {};
            }
        },

        _selectorGetSize: function (axis) {
            if (axis.rangeSelector.renderTo)
                return 0;
            return axis.rangeSelector.size || this._paddedRect.height / 3;
        }

    });

})(jqxBaseFramework);


(function ($) {
    $.extend($.jqx._jqxChart.prototype,
    {
        _moduleAnnotations: true,

        _renderAnnotation: function (groupIndex, annotation, rect) {
            var group = this.seriesGroups[groupIndex];

            var renderer = this.renderer;

            if (isNaN(groupIndex))
                return;

            var x = this._get([this.getXAxisDataPointOffset(annotation.xValue, groupIndex), annotation.x]);
            var y = this._get([this.getValueAxisDataPointOffset(annotation.yValue, groupIndex), annotation.y]);
            var x2 = this._get([this.getXAxisDataPointOffset(annotation.xValue2, groupIndex), annotation.x2]);
            var y2 = this._get([this.getValueAxisDataPointOffset(annotation.yValue2, groupIndex), annotation.y2]);

            if (group.polar || group.spider)
            {
                var point = this.getPolarDataPointOffset(annotation.xValue, annotation.yValue, groupIndex);
                if (point && !isNaN(point.x) && !isNaN(point.y))
                {
                    x = point.x;
                    y = point.y;
                }
                else
                {
                    x = annotation.x;
                    y = annotation.y;
                }
            }
            
            if (isNaN(y) || isNaN(x))
                return false;

            if (group.orientation == 'horizontal')
            {
                var tmp = x;
                x = y;
                y = tmp;

                tmp = x2;
                x2 = y2;
                y2 = tmp;
            }

            if (annotation.offset)
            {
                if (!isNaN(annotation.offset.x))
                {
                    x += annotation.offset.x;
                    x2 += annotation.offset.x;
                }

                if (!isNaN(annotation.offset.y))
                {
                    y += annotation.offset.y;
                    y2 += annotation.offset.y;
                }
            }

            var width = this._get([annotation.width, x2 - x]);
            var height = this._get([annotation.height, y2 - y]);

            var shape;
            switch (annotation.type) {
                case 'rect':
                    shape = renderer.rect(x, y, width, height);
                    break;
                case 'circle':
                    shape = renderer.rect(x, y, annotation.radius);
                    break;
                case 'line':
                    shape = renderer.rect(x, y, x2, y2);
                    break;
                case 'path':
                    shape = renderer.path(annotation.path);
                    break;
            }

            renderer.attr(shape, 
            {
                fill: annotation.fillColor,
                stroke: annotation.lineColor,
                opacity: this._get([annotation.fillOpacity, annotation.opacity]),
                'stroke-opacity': this._get([annotation.lineOpacity, annotation.opacity]),
                'stroke-width': annotation.lineWidth,
                'stroke-dasharray': annotation.dashStyle || 'none',
            });

            var txtElement;
            if (annotation.text)
            {
                var txt = annotation.text;

                var xOffset = 0, 
                    yOffset = 0;

                if (txt.offset)
                {
                    if (!isNaN(txt.offset.x))
                        xOffset += txt.offset.x;

                    if (!isNaN(txt.offset.y))
                        yOffset += txt.offset.y;
                }

                txtElement = renderer.text(
                    txt.value, 
                    x + xOffset, 
                    y + yOffset,
                    NaN,
                    NaN,
                    txt.angle,
                    {},
                    txt.clip === true,
                    txt.horizontalAlignment || 'center',
                    txt.verticalAlignment || 'center',
                    txt.rotationPoint || 'centermiddle');

                renderer.attr(txtElement, 
                {
                    fill: txt.fillColor,
                    stroke: txt.lineColor,
                    'class': txt['class']
                });
            }
           
            var events = [
                'click',
                'mouseenter',
                'mouseleave'
                ];
           
            var self = this;         

            for (var i = 0; i < events.length; i++)
            {
                var event = this._getEvent(events[i]) || events[i];
                
                if (shape)
                    this.renderer.addHandler(shape, event, function() 
                        {
                            self._raiseAnnotationEvent(annotation, event);
                        }
                    );

                if (txtElement)
                    this.renderer.addHandler(txtElement, event, function() 
                        {
                            self._raiseAnnotationEvent(annotation, event);
                        }
                    );
            }
        },

        _raiseAnnotationEvent: function(annotation, event)
        {
            this._raiseEvent('annotation_' + event, {annotation: annotation});
        }


    });
})(jqxBaseFramework);


(function ($) {
    $.extend($.jqx._jqxChart.prototype,
    {
        _moduleWaterfall: true,

        _isSummary: function (groupIndex, itemIndex) {
            var group = this.seriesGroups[groupIndex];
            for (var sidx = 0; sidx < group.series.length; sidx++) {
                if (undefined === group.series[sidx].summary)
                    continue;

                summaryValue = this._getDataValue(itemIndex, group.series[sidx].summary, groupIndex)
                if (undefined !== summaryValue)
                    return true;
            }

            return false;
        },

        _applyWaterfall: function (out, len, groupIndex, yzero, gbase, logBase, scale, inverse, isStacked) {
            var group = this.seriesGroups[groupIndex];

            if (out.length == 0)
                return out;

            var lastTo = yzero;

            // waterfall sums by serie / stack
            var wfSum = {};

            var seriesPrevVisibleIndex = [];

            var isDirectionDown = undefined;

            var seriesVisibility = [];
            for (var j = 0; j < group.series.length; j++)
                seriesVisibility.push(this._isSerieVisible(groupIndex, j));

            // The direction of the first column is relative to the baseline. For all columns after
            // that the direction is based on whether the value is positive or negative
            // For stacked series the key is -1. For non-stacked the serie index
            var firstItemRendered = {};

            for (var i = 0; i < len; i++) {
                var summaryLastTo = yzero;
                var summarySum = 0;
                var isSummaryItem = this._isSummary(groupIndex, i);

                for (var j = 0; j < out.length; j++) {
                    if (!seriesVisibility[j])
                        continue;

                    var refBase = 0;

                    // handle summary items
                    if (isSummaryItem) {
                        refBase = summaryLastTo == yzero ? gbase : 0;

                        out[j][i].value = wfSum[j];
                        out[j][i].summary = true;

                        isDirectionDown = out[j][i].value < refBase;
                        if (inverse)
                            isDirectionDown = !isDirectionDown;

                        var size = 0;
                        if (!isNaN(logBase))
                            size = this._getDataPointOffsetDiff(out[j][i].value + summarySum, summarySum == 0 ? gbase : summarySum, refBase || gbase, logBase, scale, yzero, inverse);
                        else
                            size = this._getDataPointOffsetDiff(out[j][i].value, refBase, refBase, NaN, scale, yzero, inverse);

                        out[j][i].to = summaryLastTo + (isDirectionDown ? size : -size);
                        out[j][i].from = summaryLastTo;

                        if (isStacked) {
                            summarySum += out[j][i].value;
                            summaryLastTo = out[j][i].to;
                        }

                        continue;
                    }
                    // end of summary items

                    var k = isStacked ? -1 : j;

                    if (isNaN(out[j][i].value))
                        continue;

                    if (undefined === firstItemRendered[k]) {
                        refBase = gbase;
                        firstItemRendered[k] = true;
                    }

                    isDirectionDown = out[j][i].value < refBase;
                    if (inverse)
                        isDirectionDown = !isDirectionDown;

                    var y = NaN, size = NaN;

                    if (!isStacked) {
                        y = i == 0 ? yzero : out[j][seriesPrevVisibleIndex[j]].to;
                    }
                    else {
                        y = lastTo;
                    }

                    var size = 0;
                    if (!isNaN(logBase))
                        size = this._getDataPointOffsetDiff(out[j][i].value + (isNaN(wfSum[k]) ? 0 : wfSum[k]), isNaN(wfSum[k]) ? gbase : wfSum[k], refBase || gbase, logBase, scale, y, inverse);
                    else
                        size = this._getDataPointOffsetDiff(out[j][i].value, refBase, refBase, NaN, scale, yzero, inverse);

                    out[j][i].to = lastTo = y + (isDirectionDown ? size : -size);
                    out[j][i].from = y;

                    if (isNaN(wfSum[k]))
                        wfSum[k] = out[j][i].value;
                    else
                        wfSum[k] += out[j][i].value;

                    if (k == -1) {
                        if (isNaN(wfSum[j]))
                            wfSum[j] = out[j][i].value;
                        else
                            wfSum[j] += out[j][i].value;
                    }

                    if (!isStacked)
                        seriesPrevVisibleIndex[j] = i;
                }
            }

            return out;
        }

    });
})(jqxBaseFramework);



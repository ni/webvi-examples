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


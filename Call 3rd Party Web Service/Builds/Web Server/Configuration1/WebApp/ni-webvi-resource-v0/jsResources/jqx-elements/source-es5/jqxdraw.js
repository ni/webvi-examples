'use strict';

// Draw class
JQX.Utilities.Assign('Draw', function () {
    function Draw(host) {
        babelHelpers.classCallCheck(this, Draw);

        var that = this;

        that.host = host;
        that.renderEngine = '';

        that.refresh();

        var functions = ['clear', 'removeElement', 'attr', 'getAttr', 'line', 'circle', 'rect', 'path', 'pieslice', 'pieSlicePath', 'text', 'measureText'];

        for (var i in functions) {
            that._addFn(JQX.Utilities.Draw.prototype, functions[i]);
        }
    }

    babelHelpers.createClass(Draw, [{
        key: '_addFn',
        value: function _addFn(target, name) {
            if (target[name]) return;

            target[name] = function () {
                return this.renderer[name].apply(this.renderer, arguments);
            };
        }
    }, {
        key: '_initRenderer',
        value: function _initRenderer(host) {
            return this.createRenderer(this, host);
        }
    }, {
        key: '_internalRefresh',
        value: function _internalRefresh() {
            var self = this;

            // validate visiblity
            if (window.getComputedStyle(self.host).display === 'none') {
                return;
            }

            if (!self.renderer) {
                self.host.innerHTML = '';
                self._initRenderer(self.host);
            }

            var renderer = self.renderer;
            if (!renderer) return;

            var rect = renderer.getRect();

            self._render({ x: 1, y: 1, width: rect.width, height: rect.height });
        }
    }, {
        key: '_render',
        value: function _render(rect) {
            this._plotRect = rect;
        }

        // Public API

    }, {
        key: 'refresh',
        value: function refresh() {
            this._internalRefresh();
        }
    }, {
        key: 'getSize',
        value: function getSize() {
            var rect = this._plotRect;
            return { width: rect.width, height: rect.height };
        }
    }, {
        key: 'toGreyScale',
        value: function toGreyScale(color) {
            if (color.indexOf('#') === -1) return color;

            var rgb = this.cssToRgb(color);
            rgb[0] = rgb[1] = rgb[2] = Math.round(0.3 * rgb[0] + 0.59 * rgb[1] + 0.11 * rgb[2]);
            var hex = this.rgbToHex(rgb[0], rgb[1], rgb[2]);
            return '#' + hex[0] + hex[1] + hex[2];
        }
    }, {
        key: 'decToHex',
        value: function decToHex(dec) {
            return dec.toString(16);
        }
    }, {
        key: 'hexToDec',
        value: function hexToDec(hex) {
            return parseInt(hex, 16);
        }
    }, {
        key: 'rgbToHex',
        value: function rgbToHex(r, g, b) {
            return [this.decToHex(r), this.decToHex(g), this.decToHex(b)];
        }
    }, {
        key: 'hexToRgb',
        value: function hexToRgb(h, e, x) {
            return [this.hexToDec(h), this.hexToDec(e), this.hexToDec(x)];
        }
    }, {
        key: 'cssToRgb',
        value: function cssToRgb(color) {
            if (color.indexOf('rgb') <= -1) {
                return this.hexToRgb(color.substring(1, 3), color.substring(3, 5), color.substring(5, 7));
            }
            return color.substring(4, color.length - 1).split(',');
        }
    }, {
        key: 'hslToRgb',
        value: function hslToRgb(hsl) {
            var r = void 0,
                g = void 0,
                b = void 0;
            var h = parseFloat(hsl[0]);
            var s = parseFloat(hsl[1]);
            var l = parseFloat(hsl[2]);

            if (s === 0) {
                r = g = b = l;
            } else {
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = this.hueToRgb(p, q, h + 1 / 3);
                g = this.hueToRgb(p, q, h);
                b = this.hueToRgb(p, q, h - 1 / 3);
            }
            return [r * 255, g * 255, b * 255];
        }
    }, {
        key: 'hueToRgb',
        value: function hueToRgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;

            if (t < 1 / 6) return p + (q - p) * 6 * t;else if (t < 1 / 2) return q;else if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

            return p;
        }
    }, {
        key: 'rgbToHsl',
        value: function rgbToHsl(rgb) {
            var r = parseFloat(rgb[0]) / 255;
            var g = parseFloat(rgb[1]) / 255;
            var b = parseFloat(rgb[2]) / 255;

            var max = Math.max(r, g, b),
                min = Math.min(r, g, b);
            var h = void 0,
                s = void 0,
                l = (max + min) / 2;

            if (max === min) {
                h = s = 0;
            } else {
                var diff = max - min;
                s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / diff + (g < b ? 6 : 0);break;
                    case g:
                        h = (b - r) / diff + 2;break;
                    case b:
                        h = (r - g) / diff + 4;break;
                }
                h /= 6;
            }

            return [h, s, l];
        }
    }, {
        key: 'swap',
        value: function swap(x, y) {
            var tmp = x;
            x = y;
            y = tmp;
        }
    }, {
        key: 'getNum',
        value: function getNum(arr) {
            if (arr.constructor !== Array) {
                if (isNaN(arr)) return 0;
            } else {
                for (var i = 0; i < arr.length; i++) {
                    if (!isNaN(arr[i])) return arr[i];
                }
            }

            return 0;
        }
    }, {
        key: '_ptdist',
        value: function _ptdist(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        }
    }, {
        key: '_ptRotate',
        value: function _ptRotate(x, y, cx, cy, angle) {
            var radius = Math.sqrt(Math.pow(Math.abs(x - cx), 2) + Math.pow(Math.abs(y - cy), 2));
            var currAngle = Math.asin((x - cx) / radius);
            var newAngle = currAngle + angle;

            x = cx + Math.cos(newAngle) * radius;
            y = cy + Math.sin(newAngle) * radius;

            return { x: x, y: y };
        }
    }, {
        key: 'log',
        value: function log(val, base) {
            return Math.log(val) / (base ? Math.log(base) : 1);
        }
    }, {
        key: '_mod',
        value: function _mod(a, b) {
            var min = Math.abs(a > b ? b : a);
            var scale = 1;
            if (min !== 0) {
                while (min * scale < 100) {
                    scale *= 10;
                }
            }

            a = a * scale;
            b = b * scale;

            return a % b / scale;
        }
    }, {
        key: 'ptrnd',
        value: function ptrnd(val) {
            if (Math.abs(Math.round(val) - val) === 0.5) return val;

            var rnd = Math.round(val);
            if (rnd < val) rnd = rnd - 1;

            return rnd + 0.5;
        }
    }, {
        key: 'createRenderer',
        value: function createRenderer(widgetInstance, host) {
            var self = widgetInstance;

            var renderer = self.renderer = null;

            if (document.createElementNS) {
                renderer = new JQX.Utilities.SvgRenderer();
                renderer.init(host);
            }

            self.renderer = renderer;

            return renderer;
        }
    }, {
        key: 'getByPriority',
        value: function getByPriority(arr) {
            var value = undefined;
            for (var i = 0; i < arr.length && value === undefined; i++) {
                if (value === undefined && arr[i] !== undefined) value = arr[i];
            }

            return value;
        }
    }, {
        key: 'get',
        value: function get(array, index, key) {
            return key !== undefined ? array[index][key] : array[index];
        }
    }, {
        key: 'min',
        value: function min(array, key) {
            var min = NaN;
            for (var i = 0; i < array.length; i++) {
                var val = this.get(array, i, key);

                if (isNaN(min) || val < min) min = val;
            }

            return min;
        }
    }, {
        key: 'max',
        value: function max(array, key) {
            var max = NaN;
            for (var i = 0; i < array.length; i++) {
                var val = this.get(array, i, key);

                if (isNaN(max) || val > max) max = val;
            }

            return max;
        }
    }, {
        key: 'sum',
        value: function sum(array, key) {
            var sum = 0;
            for (var i = 0; i < array.length; i++) {
                var val = this.get(array, i, key);
                if (!isNaN(val)) sum += val;
            }

            return sum;
        }
    }, {
        key: 'count',
        value: function count(array, key) {
            var count = 0;
            for (var i = 0; i < array.length; i++) {
                var val = this.get(array, i, key);
                if (!isNaN(val)) count++;
            }

            return count;
        }
    }, {
        key: 'avg',
        value: function avg(array, key) {
            return this.sum(array, key) / Math.max(1, this.count(array, key));
        }
    }, {
        key: 'filter',
        value: function filter(array, fn) {
            if (!fn) return array;

            var out = [];
            for (var i = 0; i < array.length; i++) {
                if (fn(array[i])) out.push(array[i]);
            }return out;
        }
    }, {
        key: 'scale',
        value: function scale(val, range, scale_range, params) {
            if (isNaN(val)) return NaN;

            if (val < Math.min(range.min, range.max) || val > Math.max(range.min, range.max)) {
                if (!params || params['ignore_range'] !== true) return NaN;
            }

            var outVal = NaN;

            var percent = 1;
            if (range.type === undefined || range.type !== 'logarithmic') {
                var denom = Math.abs(range.max - range.min);
                if (!denom) denom = 1;
                percent = Math.abs(val - Math.min(range.min, range.max)) / denom;
            } else if (range.type === 'logarithmic') {
                var logBase = range.base;
                if (isNaN(logBase)) logBase = 10;

                var min = Math.min(range.min, range.max);
                if (min <= 0) min = 1;

                var max = Math.max(range.min, range.max);
                if (max <= 0) max = 1;

                var maxPow = this.log(max, logBase);
                max = Math.pow(logBase, maxPow);

                var minPow = this.log(min, logBase);
                min = Math.pow(logBase, minPow);

                var valPow = this.log(val, logBase);

                percent = Math.abs(valPow - minPow) / (maxPow - minPow);
            }

            if (scale_range.type === 'logarithmic') {
                var _logBase = scale_range.base;
                if (isNaN(_logBase)) _logBase = 10;

                var _maxPow = this.log(scale_range.max, _logBase),
                    _minPow = this.log(scale_range.min, _logBase);

                if (scale_range.flip) percent = 1 - percent;

                var _valPow = Math.min(_minPow, _maxPow) + percent * Math.abs(_maxPow - _minPow);
                outVal = Math.pow(_logBase, _valPow);
            } else {
                outVal = Math.min(scale_range.min, scale_range.max) + percent * Math.abs(scale_range.max - scale_range.min);

                if (scale_range.flip) outVal = Math.max(scale_range.min, scale_range.max) - outVal + scale_range.min;
            }

            return outVal;
        }
    }, {
        key: 'axis',
        value: function axis(min, max, preferedCount) {
            if (preferedCount <= 1) return [max, min];

            if (isNaN(preferedCount) || preferedCount < 2) preferedCount = 2;

            var decimalPlaces = 0;
            while (Math.round(min) !== min && Math.round(max) !== max && decimalPlaces < 10) {
                min *= 10;
                max *= 10;
                decimalPlaces++;
            }

            var preferedIntSize = (max - min) / preferedCount;
            while (decimalPlaces < 10 && Math.round(preferedIntSize) !== preferedIntSize) {
                min *= 10;
                max *= 10;
                preferedIntSize *= 10;
                decimalPlaces++;
            }

            var scale = [1, 2, 5];

            var i = 0,
                intSizeNext = void 0;

            // eslint-disable-next-line
            while (true) {
                var idx = i % scale.length;
                var pow = Math.floor(i / scale.length);
                var intSizeCurr = Math.pow(10, pow) * scale[idx];

                idx = (i + 1) % scale.length;
                pow = Math.floor((i + 1) / scale.length);
                intSizeNext = Math.pow(10, pow) * scale[idx];

                if (preferedIntSize >= intSizeCurr && preferedIntSize < intSizeNext) break;

                i++;
            }

            var intSizeSelected = intSizeNext;

            var out = [];
            var curr = this.renderer._rnd(min, intSizeSelected, false);
            var denominator = decimalPlaces <= 0 ? 1 : Math.pow(10, decimalPlaces);
            while (curr < max + intSizeSelected) {
                out.push(curr / denominator);
                curr += intSizeSelected;
            }

            return out;
        }
    }]);
    return Draw;
}());

// SvgRenderer class
JQX.Utilities.Assign('SvgRenderer', function () {
    function SvgRenderer() {
        babelHelpers.classCallCheck(this, SvgRenderer);

        var that = this;
        that._svgns = 'http://www.w3.org/2000/svg';
        that._openGroups = [];
        that._clipId = 0;
        that._gradients = {};

        that._toRadiansCoefficient = Math.PI * 2 / 360;
    }

    babelHelpers.createClass(SvgRenderer, [{
        key: 'init',
        value: function init(host) {
            var container = document.createElement('div');

            container.className = 'drawContainer';
            container.onselectstart = function () {
                return false;
            };

            host.appendChild(container);

            this.host = host;
            this.container = container;

            try {
                var svg = document.createElementNS(this._svgns, 'svg');
                svg.setAttribute('version', '1.1');
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.setAttribute('overflow', 'hidden');
                container.appendChild(svg);
                this.canvas = svg;
            } catch (e) {
                return false;
            }

            this._id = new Date().getTime();
            this.clear();

            return true;
        }
    }, {
        key: 'getType',
        value: function getType() {
            return 'SVG';
        }
    }, {
        key: 'refresh',
        value: function refresh() {}
    }, {
        key: '_rup',
        value: function _rup(n) {
            var nr = Math.round(n);
            if (n > nr) nr++;

            return nr;
        }
    }, {
        key: 'getRect',
        value: function getRect() {
            return { x: 0, y: 0, width: Math.max(this._rup(this.host.offsetWidth) - 1, 0), height: Math.max(this._rup(this.host.offsetHeight) - 1, 0) };
        }
    }, {
        key: 'getContainer',
        value: function getContainer() {
            return this.container;
        }
    }, {
        key: 'clear',
        value: function clear() {
            while (this.canvas.childElementCount > 0) {
                this.removeElement(this.canvas.firstElementChild);
            }

            this._defaultParent = undefined;
            this._defs = document.createElementNS(this._svgns, 'defs');
            this._gradients = {};
            this.canvas.appendChild(this._defs);
        }
    }, {
        key: 'removeElement',
        value: function removeElement(element) {
            if (undefined === element) return;

            try {
                while (element.firstChild) {
                    this.removeElement(element.firstChild);
                }

                if (element.parentNode) element.parentNode.removeChild(element);else this.canvas.removeChild(element);
            } catch (error) {
                //
            }
        }
    }, {
        key: 'beginGroup',
        value: function beginGroup() {
            var parent = this._activeParent();
            var g = document.createElementNS(this._svgns, 'g');
            parent.appendChild(g);
            this._openGroups.push(g);

            return g;
        }
    }, {
        key: 'endGroup',
        value: function endGroup() {
            if (this._openGroups.length === 0) return;

            this._openGroups.pop();
        }
    }, {
        key: '_activeParent',
        value: function _activeParent() {
            return this._openGroups.length === 0 ? this.canvas : this._openGroups[this._openGroups.length - 1];
        }
    }, {
        key: 'createClipRect',
        value: function createClipRect(rect) {
            var c = document.createElementNS(this._svgns, 'clipPath');
            var r = document.createElementNS(this._svgns, 'rect');
            this.attr(r, { x: rect.x, y: rect.y, width: rect.width, height: rect.height, fill: 'none' });

            this._clipId = this._clipId || 0;
            c.id = 'cl' + this._id + '_' + (++this._clipId).toString();
            c.appendChild(r);

            this._defs.appendChild(c);

            return c;
        }
    }, {
        key: 'getWindowHref',
        value: function getWindowHref() {
            // Get modified href. This is needed to handle cases where the page uses <base> tags.

            var href = window.location.href;
            if (!href) return href;

            href = href.replace(/([\('\)])/g, '\\$1'); // escape brackets & quotes (Chrome)
            href = href.replace(/#.*$/, ''); // remove bookmark links

            return href;
        }
    }, {
        key: 'setClip',
        value: function setClip(elem, clip) {
            var url = 'url(' + this.getWindowHref() + '#' + clip.id + ')';
            return this.attr(elem, { 'clip-path': url });
        }
    }, {
        key: 'shape',
        value: function shape(name, params) {
            var s = document.createElementNS(this._svgns, name);
            if (!s) return undefined;

            for (var param in params) {
                s.setAttribute(param, params[param]);
            }this._activeParent().appendChild(s);

            return s;
        }
    }, {
        key: '_getTextParts',
        value: function _getTextParts(text, angle, params) {
            var textPartsInfo = { width: 0, height: 0, parts: [] };
            if (undefined === text) return textPartsInfo;

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
                var bbox = void 0;
                try {
                    bbox = txt.getBBox();
                } catch (e) {
                    //
                }

                var tw = this._rup(bbox.width);
                var th = this._rup(bbox.height * coeff);

                txt.removeChild(txtNode);

                textPartsInfo.width = Math.max(textPartsInfo.width, tw);
                textPartsInfo.height += th + (i > 0 ? 4 : 0);
                textPartsInfo.parts.push({ width: tw, height: th, text: textPart });
            }
            parent.removeChild(txt);

            return textPartsInfo;
        }
    }, {
        key: 'measureText',
        value: function measureText(text, angle, params, includeTextPartsInfo) {
            var textPartsInfo = this._getTextParts(text, angle, params);
            var tw = textPartsInfo.width;
            var th = textPartsInfo.height;

            if (false === includeTextPartsInfo) th /= 0.6;

            var retVal = {};

            if (isNaN(angle)) angle = 0;

            if (angle === 0) {
                retVal = { width: this._rup(tw), height: this._rup(th) };
            } else {
                var rads = angle * Math.PI * 2 / 360;
                var sn = Math.abs(Math.sin(rads));
                var cs = Math.abs(Math.cos(rads));
                var bh = Math.abs(tw * sn + th * cs);
                var bw = Math.abs(tw * cs + th * sn);

                retVal = { width: this._rup(bw), height: this._rup(bh) };
            }

            if (includeTextPartsInfo) retVal.textPartsInfo = textPartsInfo;

            return retVal;
        }
    }, {
        key: 'alignTextInRect',
        value: function alignTextInRect(x, y, width, height, textWidth, textHeight, halign, valign, angle, rotateAround) {
            var rads = angle * Math.PI * 2 / 360;
            var sn = Math.sin(rads);
            var cs = Math.cos(rads);

            var h2 = textWidth * sn;
            var w2 = textWidth * cs;

            if (halign === 'center' || halign === '' || halign === 'undefined') x = x + width / 2;else if (halign === 'right') x = x + width;

            if (valign === 'center' || valign === 'middle' || valign === '' || valign === 'undefined') y = y + height / 2;else if (valign === 'bottom') y += height - textHeight / 2;else if (valign === 'top') y += textHeight / 2;

            rotateAround = rotateAround || '';

            var adjustY = 'middle';
            if (rotateAround.indexOf('top') !== -1) adjustY = 'top';else if (rotateAround.indexOf('bottom') !== -1) adjustY = 'bottom';

            var adjustX = 'center';
            if (rotateAround.indexOf('left') !== -1) adjustX = 'left';else if (rotateAround.indexOf('right') !== -1) adjustX = 'right';

            if (adjustX === 'center') {
                x -= w2 / 2;
                y -= h2 / 2;
            } else if (adjustX === 'right') {
                x -= w2;
                y -= h2;
            }

            if (adjustY === 'top') {
                x -= textHeight * sn;
                y += textHeight * cs;
            } else if (adjustY === 'middle') {
                x -= textHeight * sn / 2;
                y += textHeight * cs / 2;
            }

            x = this._rup(x);
            y = this._rup(y);

            return { x: x, y: y };
        }
    }, {
        key: 'text',
        value: function text(_text, x, y, width, height, angle, params, clip, halign, valign, rotateAround) {
            var sz = this.measureText(_text, angle, params, true, this);
            var textPartsInfo = sz.textPartsInfo;
            var textParts = textPartsInfo.parts;
            var gClip = void 0;
            if (!halign) halign = 'center';
            if (!valign) valign = 'center';

            if (textParts.length > 1 || clip) gClip = this.beginGroup();

            if (clip) {
                var crect = this.createClipRect({ x: this._rup(x) - 1, y: this._rup(y) - 1, width: this._rup(width) + 2, height: this._rup(height) + 2 });
                this.setClip(gClip, crect);
            }

            //this.rect(x, y, width, height, {fill: 'yellow', stroke: 'red'});

            var parent = this._activeParent();

            var tw = 0,
                th = 0;

            tw = textPartsInfo.width;
            th = textPartsInfo.height;

            if (isNaN(width) || width <= 0) width = tw;
            if (isNaN(height) || height <= 0) height = th;

            var w = width || 0;
            var h = height || 0;

            var yOffset = 0;

            if (!angle || angle === 0) {
                y += th;

                if (valign === 'center' || valign === 'middle') y += (h - th) / 2;else if (valign === 'bottom') y += h - th;

                if (!width) width = tw;

                if (!height) height = th;

                parent = this._activeParent();
                var txt = void 0;
                for (var i = textParts.length - 1; i >= 0; i--) {
                    txt = document.createElementNS(this._svgns, 'text');
                    this.attr(txt, params);
                    this.attr(txt, { cursor: 'default' });

                    var txtNode = txt.ownerDocument.createTextNode(textParts[i].text);
                    txt.appendChild(txtNode);

                    var xOffset = x;
                    var wPart = textParts[i].width;
                    var hPart = textParts[i].height;

                    if (halign === 'center') xOffset += (w - wPart) / 2;else if (halign === 'right') xOffset += w - wPart;

                    this.attr(txt, { x: this._rup(xOffset), y: this._rup(y + yOffset), width: this._rup(wPart), height: this._rup(hPart) });
                    parent.appendChild(txt);

                    yOffset -= textParts[i].height + 4;
                }

                if (gClip) {
                    this.endGroup();
                    return gClip;
                }

                return txt;
            }

            var point = this.alignTextInRect(x, y, width, height, tw, th, halign, valign, angle, rotateAround);
            x = point.x;
            y = point.y;

            var gTranslate = this.shape('g', { transform: 'translate(' + x + ',' + y + ')' });
            var gRotate = this.shape('g', { transform: 'rotate(' + angle + ')' });

            gTranslate.appendChild(gRotate);

            // add the text blocks
            yOffset = 0;

            for (var _i = textParts.length - 1; _i >= 0; _i--) {
                var tx = document.createElementNS(this._svgns, 'text');
                this.attr(tx, params);
                this.attr(tx, { cursor: 'default' });

                var _txtNode = tx.ownerDocument.createTextNode(textParts[_i].text);
                tx.appendChild(_txtNode);

                var _xOffset = 0;
                var _wPart = textParts[_i].width;
                var _hPart = textParts[_i].height;

                if (halign === 'center') _xOffset += (textPartsInfo.width - _wPart) / 2;else if (halign === 'right') _xOffset += textPartsInfo.width - _wPart;

                this.attr(tx, { x: this._rup(_xOffset), y: this._rup(yOffset), width: this._rup(_wPart), height: this._rup(_hPart) });
                gRotate.appendChild(tx);

                yOffset -= _hPart + 4;
            }

            parent.appendChild(gTranslate);

            if (gClip) this.endGroup();

            return gTranslate;
        }
    }, {
        key: 'line',
        value: function line(x1, y1, x2, y2, params) {
            var line = this.shape('line', { x1: x1, y1: y1, x2: x2, y2: y2 });
            this.attr(line, params);
            return line;
        }
    }, {
        key: 'path',
        value: function path(points, params) {
            var s = this.shape('path');
            s.setAttribute('d', points);
            if (params) {
                this.attr(s, params);
            }
            return s;
        }
    }, {
        key: '_rnd',
        value: function _rnd(num, unit, toGreater, fast) {
            if (isNaN(num)) return num;

            if (undefined === fast) fast = true;

            var a = num - (fast === true ? num % unit : this._mod(num, unit));
            if (num === a) return a;

            if (toGreater) {
                if (num > a) a += unit;
            } else {
                if (a > num) a -= unit;
            }

            return unit === 1 ? Math.round(a) : a;
        }
    }, {
        key: '_ptrnd',
        value: function _ptrnd(val) {
            if (!document.createElementNS) {
                if (Math.round(val) === val) return val;
                return this._rnd(val, 1, false, true);
            }

            var rnd = this._rnd(val, 0.5, false, true);
            if (Math.abs(rnd - Math.round(rnd)) !== 0.5) {
                return rnd > val ? rnd - 0.5 : rnd + 0.5;
            }
            return rnd;
        }
    }, {
        key: 'rect',
        value: function rect(x, y, w, h, params) {
            x = this._ptrnd(x);
            y = this._ptrnd(y);
            w = Math.max(1, this._rnd(w, 1, false));
            h = Math.max(1, this._rnd(h, 1, false));
            var s = this.shape('rect', { x: x, y: y, width: w, height: h });
            if (params) this.attr(s, params);
            return s;
        }
    }, {
        key: 'circle',
        value: function circle(x, y, r, params) {
            var s = this.shape('circle', { cx: x, cy: y, r: r });
            if (params) this.attr(s, params);
            return s;
        }
    }, {
        key: 'pieSlicePath',
        value: function pieSlicePath(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset) {
            if (!outerRadius) outerRadius = 1;

            var diff = Math.abs(angleFrom - angleTo);
            var lFlag = diff > 180 ? 1 : 0;
            if (diff >= 360) {
                angleTo = angleFrom + 359.99;
            }
            var radFrom = angleFrom * this._toRadiansCoefficient;
            var radTo = angleTo * this._toRadiansCoefficient;

            var x1 = x,
                x2 = x,
                y1 = y,
                y2 = y;

            var isDonut = !isNaN(innerRadius) && innerRadius > 0;

            if (isDonut) centerOffset = 0;

            var radFromCos = Math.cos(radFrom),
                radFromSin = Math.sin(radFrom),
                radToCos = Math.cos(radTo),
                radToSin = Math.sin(radTo);

            if (centerOffset + innerRadius > 0) {
                if (centerOffset > 0) {
                    var midAngle = diff / 2 + angleFrom;
                    var radMid = midAngle * this._toRadiansCoefficient;

                    x += centerOffset * Math.cos(radMid);
                    y -= centerOffset * Math.sin(radMid);
                }

                if (isDonut) {
                    x1 = x + innerRadius * radFromCos;
                    y1 = y - innerRadius * radFromSin;
                    x2 = x + innerRadius * radToCos;
                    y2 = y - innerRadius * radToSin;
                }
            }

            var x3 = x + outerRadius * radFromCos;
            var x4 = x + outerRadius * radToCos;
            var y3 = y - outerRadius * radFromSin;
            var y4 = y - outerRadius * radToSin;

            var path = '';

            var isPartialCircle = Math.abs(Math.abs(angleTo - angleFrom) - 360) > 0.02;

            if (isDonut) {
                path = 'M ' + x2 + ',' + y2;
                path += ' a' + innerRadius + ',' + innerRadius;
                path += ' 0 ' + lFlag + ',1 ' + (x1 - x2) + ',' + (y1 - y2);
                if (isPartialCircle) path += ' L' + x3 + ',' + y3;else path += ' M' + x3 + ',' + y3;

                path += ' a' + outerRadius + ',' + outerRadius;
                path += ' 0 ' + lFlag + ',0 ' + (x4 - x3) + ',' + (y4 - y3);

                if (isPartialCircle) path += ' Z';
            } else {
                path = 'M ' + x4 + ',' + y4;
                path += ' a' + outerRadius + ',' + outerRadius;
                path += ' 0 ' + lFlag + ',1 ' + (x3 - x4) + ',' + (y3 - y4);

                if (isPartialCircle) {
                    path += ' L' + x + ',' + y;
                    path += ' Z';
                }
            }

            return path;
        }
    }, {
        key: 'pieslice',
        value: function pieslice(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset, params) {
            var pathCmd = this.pieSlicePath(x, y, innerRadius, outerRadius, angleFrom, angleTo, centerOffset);

            var s = this.shape('path');
            s.setAttribute('d', pathCmd);

            if (params) this.attr(s, params);

            return s;
        }
    }, {
        key: 'attr',
        value: function attr(element, params) {
            if (!element || !params) return;

            for (var param in params) {
                if (param === 'textContent') element.textContent = params[param];else {
                    element.setAttribute(param, params[param]);
                }
            }
        }
    }, {
        key: 'removeAttr',
        value: function removeAttr(element, params) {
            if (!element || !params) return;

            for (var param in params) {
                if (param === 'textContent') element.textContent = '';else {
                    element.removeAttribute(params[param]);
                }
            }
        }
    }, {
        key: 'getAttr',
        value: function getAttr(element, key) {
            return element['getAttribute'](key);
        }
    }, {
        key: 'adjustColor',
        value: function adjustColor(color, adj) {
            if (typeof color !== 'string') return '#000000';

            if (color.indexOf('#') === -1) return color;

            var rgb = this.cssToRgb(color);
            var hsl = this.rgbToHsl(rgb);
            hsl[2] = Math.min(1, hsl[2] * adj);
            hsl[1] = Math.min(1, hsl[1] * adj * 1.1);
            rgb = this.hslToRgb(hsl);

            color = '#';
            for (var i = 0; i < 3; i++) {
                var c = Math.round(rgb[i]);
                c = this.decToHex(c);
                if (c.toString().length === 1) color += '0';

                color += c;
            }

            return color.toUpperCase();
        }
    }, {
        key: '_toLinearGradient',
        value: function _toLinearGradient(color, isVertical, stops) {
            var id = 'grd' + this._id + color.replace('#', '') + (isVertical ? 'v' : 'h');
            var url = 'url(' + this.getWindowHref() + '#' + id + ')';
            if (this._gradients[url]) return url;

            var gr = document.createElementNS(this._svgns, 'linearGradient');
            this.attr(gr, { x1: '0%', y1: '0%', x2: isVertical ? '0%' : '100%', y2: isVertical ? '100%' : '0%', id: id });

            for (var i = 0; i < stops.length; i++) {
                var stop = stops[i];
                var s = document.createElementNS(this._svgns, 'stop');
                var st = 'stop-color:' + this.adjustColor(color, stop[1]);
                this.attr(s, { offset: stop[0] + '%', style: st });
                gr.appendChild(s);
            }

            this._defs.appendChild(gr);
            this._gradients[url] = true;

            return url;
        }
    }, {
        key: '_toRadialGradient',
        value: function _toRadialGradient(color, stops, coords) {
            var id = 'grd' + this._id + color.replace('#', '') + 'r' + (coords !== undefined ? coords.key : '');

            var url = 'url(' + this.getWindowHref() + '#' + id + ')';
            if (this._gradients[url]) return url;

            var gr = document.createElementNS(this._svgns, 'radialGradient');
            if (coords === undefined) this.attr(gr, { cx: '50%', cy: '50%', r: '100%', fx: '50%', fy: '50%', id: id });else this.attr(gr, { cx: coords.x, cy: coords.y, r: coords.outerRadius, id: id, gradientUnits: 'userSpaceOnUse' });

            for (var i = 0; i < stops.length; i++) {
                var stop = stops[i];
                var s = document.createElementNS(this._svgns, 'stop');
                var st = 'stop-color:' + this.adjustColor(color, stop[1]);
                this.attr(s, { offset: stop[0] + '%', style: st });
                gr.appendChild(s);
            }

            this._defs.appendChild(gr);
            this._gradients[url] = true;

            return url;
        }
    }]);
    return SvgRenderer;
}());
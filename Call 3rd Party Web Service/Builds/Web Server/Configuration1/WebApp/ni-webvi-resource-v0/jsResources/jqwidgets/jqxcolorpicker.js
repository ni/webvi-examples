/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {

    $.jqx.jqxWidget("jqxColorPicker", "", {});

    $.extend($.jqx._jqxColorPicker.prototype, {
        defineInstance: function () {
            var settings = {
                // enables / disables the button
                disabled: false,
                // sets height to the button.
                height: null,
                // sets width to the button.
                width: null,
                // sets the color.
                color: new $.jqx.color({ hex: 'ff0000' }),
                redString: "R:",
                greenString: "G:",
                blueString: "B:",
                showTransparent: false,
                colorMode: "saturation",
                _delayLoading: false,
                events:
                [
                   'colorchange'
                ]
            };
            $.extend(true, this, settings);
            return settings;
        },

        _createFromInput: function (name)
        {
            var that = this;
            if (that.element.nodeName.toLowerCase() == "input")
            {
                that.field = that.element;
                if (that.field.className)
                {
                    that._className = that.field.className;
                }

                var properties = {
                    'title': that.field.title
                };

                if (that.field.getAttribute('value'))
                {
                    var value = that.field.getAttribute('value');
                    that.color = new $.jqx.color({ hex: value });
                }
                if (that.field.id.length)
                {
                    properties.id = that.field.id.replace(/[^\w]/g, '_') + "_" + name;
                }
                else
                {
                    properties.id = $.jqx.utilities.createId() + "_" + name;
                }


                var wrapper = $("<div></div>", properties);

                wrapper[0].style.cssText = that.field.style.cssText;
                if (!that.width)
                {
                    that.width = $(that.field).width();
                }
                if (!that.height)
                {
                    that.height = $(that.field).outerHeight();
                }
                $(that.field).hide().after(wrapper);
                var data = that.host.data();
                that.host = wrapper;
                that.host.data(data);
                that.element = wrapper[0];
                that.element.id = that.field.id;
                that.field.id = properties.id;
                if (that._className)
                {
                    that.host.addClass(that._className);
                    $(that.field).removeClass(that._className);
                }

                if (that.field.tabIndex)
                {
                    var tabIndex = that.field.tabIndex;
                    that.field.tabIndex = -1;
                    that.element.tabIndex = tabIndex;
                }
            }
        },

        createInstance: function (args) {
            this._createFromInput("jqxColorPicker");
            this.render();
            var self = this;
            $.jqx.utilities.resize(this.host, function () {
                self._setSize();
                self.refresh();
            }, false, !this._delayLoading);
        }, // createInstance

        render: function () {
            this.element.innerHTML = "";
            var self = this;
            this._isTouchDevice = $.jqx.mobile.isTouchDevice();

            if (typeof this.color == "string") {
                this.color = new $.jqx.color({ hex: this.color });
            }

            this._setSize();
            this.host.addClass(this.toThemeProperty('jqx-widget'));
            this.host.addClass(this.toThemeProperty('jqx-reset'));
            this.host.addClass(this.toThemeProperty('jqx-color-picker'));

            this.container = $("<div style='width: 100%; height: 100%; position: relative;'></div>");
            this.container.appendTo(this.host);

            this.colorMap = $("<div style='left: 0; top: 0; position: absolute;'></div>");
            this.colorMap.appendTo(this.container);

            this.colorBar = $("<div style='left: 0; top: 0; position: absolute;'></div>");
            this.colorBar.appendTo(this.container);

            this.colorPanel = $("<div style='left: 0; top: 0; position: absolute;'></div>");
            this.colorPanel.appendTo(this.container);

            this.hexPanel = $("<div style='float: left;'></div>");
            this.hexPanel.appendTo(this.colorPanel);
            this.hexPanel.append('<span style="text-align: left;" >#</span>');
            this.hex = $("<input maxlength='6' style='height: 18px;'/>");
            this.hex.addClass(this.toThemeProperty('jqx-input'));
            this.hex.addClass(this.toThemeProperty('jqx-widget-content'));

            this.hex.appendTo(this.hexPanel);
            this.colorPanel.append('<div style="font-size: 1px; clear: both;"></div>');
            this.rgb = $("<div style='margin-top: 2px;'></div>");
            this.rgb.appendTo(this.colorPanel);

            this.red = $("<input style='width: 25px; height: 18px;' maxlength='3'/>");
            this.red.addClass(this.toThemeProperty('jqx-input'));
            this.red.addClass(this.toThemeProperty('jqx-widget-content'));
            this.rgb.append('<span style="text-align: left;">' + this.redString + '</span>');
            this.red.appendTo(this.rgb);

            this.green = $("<input style='margin-right: 2px; height: 18px; width: 25px;' maxlength='3'/>");
            this.green.addClass(this.toThemeProperty('jqx-input'));
            this.green.addClass(this.toThemeProperty('jqx-widget-content'));
            this.rgb.append('<span style="text-align: left;">' + this.greenString + '</span>');
            this.green.appendTo(this.rgb);

            this.colorPanel.addClass(this.toThemeProperty('jqx-color-picker-map-overlay'));
            this._mapImageOverlayURL = this._getImageUrl(this.colorPanel);
            this.colorPanel.removeClass(this.toThemeProperty('jqx-color-picker-map-overlay'));

            this.blue = $("<input style='height: 18px; width: 25px;' maxlength='3'/>");
            this.blue.addClass(this.toThemeProperty('jqx-input'));
            this.blue.addClass(this.toThemeProperty('jqx-widget-content'));
            this.rgb.append('<span style="text-align: left;">' + this.blueString + '</span>');
            this.blue.appendTo(this.rgb);

            this.preview = $("<div style='background: red; position: absolute;'></div>");
            this.preview.addClass(this.toThemeProperty('jqx-widget-content'));
            this.preview.appendTo(this.colorPanel);

            this.colorBarPointer = $("<div style='top: 0; left: 0; position: absolute; width: 100%;'></div>");
            this.colorBarPointer.addClass(this.toThemeProperty('jqx-color-picker-bar-pointer'));

            this.colorMapPointer = $("<div style='top: 0; left: 0; position: absolute; width: 100%;'></div>");
            this.colorMapPointer.addClass(this.toThemeProperty('jqx-color-picker-pointer'));

            this.transparent = $("<div style='text-align: center; clear: both;'><a style='text-align: center;' href='#'>transparent</a></div>");

            if (this.disabled) {
                this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
                this.element.disabled = true;
            }
            this._addHandlers();
        },

        val: function (value) {
            if (arguments.length == 0) {
                return "#" + this.color.hex;
            }

            this.setColor(value);
            return this.color.hex;
        },

        _setPositionFromValue: function () {
            var self = this;
            var x = self.color.h;
            var y = 100 - self.color.v;

            var height = self.colorMap.height();
            var width = self.colorMap.width();

            var left = x * width / 360;
            var top = y * height / 100;

            if (this.colorMode == 'saturation') {
                var sliderValue = 100 - self.color.s;
                sliderValue = sliderValue * height / 100;

                self._saturation = 100 - self.color.s;
                self.colorMapPointer.css('margin-left', left - 8);
                self.colorMapPointer.css('margin-top', top - 8);
                self.colorBarPointer.css('margin-top', sliderValue - 8);
                self.colorMapImageOverlay.css('opacity', (100 - self.color.s) / 100);
            }
            else {
                var x = self.color.s;
                var left = x * width / 100;
                var top = y * height / 100;
                var sliderValue = 360 - self.color.h;
                sliderValue = sliderValue * height / 360;

                self._hue = self.color.h;
                self.colorMapPointer.css('margin-left', left - 8);
                self.colorMapPointer.css('margin-top', top - 8);
                self.colorBarPointer.css('margin-top', sliderValue - 8);
            }
        },

        updateRGB: function () {
            var self = this;
            self.color.setRgb(self.red.val(), self.green.val(), self.blue.val());
            self._updateUI();
            self._raiseEvent('0', { color: self.color });
            self.color.transparent = false;
        },

        _setPosition: function (event, element, pointer) {
            var pageX = parseInt(event.pageX);
            var offsetLeft = parseInt(element.offset().left);

            var pageY = parseInt(event.pageY);
            var offsetTop = parseInt(element.offset().top);

            if (this._isTouchDevice) {
                var pos = $.jqx.position(event);
                pageX = pos.left;
                pageY = pos.top;
            }

            if (pointer[0].className.indexOf('jqx-color-picker-bar') == -1) {
                pointer.css('margin-left', pageX - 8 - offsetLeft);
            }
            if (pageY >= offsetTop && pageY <= offsetTop + element.height()) {
                pointer.css('margin-top', pageY - 8 - offsetTop);
            }
        },

        _handleKeyInput: function (self, event, input) {
            if (self.disabled)
                return;

            if (!self._validateKey(event))
                return event;

            input.val(self._setValueInRange(input.val(), 0, 255));
            this.updateRGB();
            this._setPositionFromValue();
        },

        _addHandlers: function () {
            var self = this;

            this.addHandler(this.colorMapPointer, 'dragStart', function (event) {
                event.preventDefault();
                return false;
            });

            this.addHandler(this.colorBarPointer, 'dragStart', function (event) {
                event.preventDefault();
                return false;
            });

            this.addHandler(this.transparent, 'click', function (event) {
                self._raiseEvent('0', { color: 'transparent' });
                event.preventDefault();
                self.color.transparent = true;
            });

            this.addHandler(this.host, 'selectionstart', function (event) {
                event.preventDefault();
                return false;
            });

            this.addHandler(this.blue, 'keyup blur', function (event) {
                self._handleKeyInput(self, event, self.blue);
            });
            this.addHandler(this.green, 'keyup blur', function (event) {
                self._handleKeyInput(self, event, self.green);
            });
            this.addHandler(this.red, 'keyup blur', function (event) {
                self._handleKeyInput(self, event, self.red);
            });
            this.addHandler(this.hex, 'keyup blur', function (event) {
                if (self.disabled)
                    return;

                if (!self._validateKey(event))
                    return event;

                if (self.hex.val().toString().length == 6) {
                    self.hex.val(self.color.validateHex(self.hex.val()));
                    self.color.setHex(self.hex.val());

                    self._updateUI();
                    self._setPositionFromValue();
                    self._raiseEvent('0', { color: self.color });
                }
            });

            this.addHandler(this.colorMap, 'dragstart', function (event) {
                event.preventDefault();
                return false;
            });

            var _setPositionInColorMap = function (event) {
                self._setPosition(event, self.colorMap, self.colorMapPointer);

                if (self.colorMode == 'saturation') {
                    var point = self._valuesFromMouse(event, self.colorMap, 360, 100);
                    if (point.x > 360) point.x = 360;
                    self.color.setHsv(point.x, self._saturation != null ? 100 - self._saturation : 100, 100 - point.y);
                }
                else {
                    var point = self._valuesFromMouse(event, self.colorMap, 100, 100);
                    if (point.x > 100) point.x = 100;
                    self.color.setHsv(self._hue != null ? self._hue : 360, point.x, 100 - point.y);
                }

                self._updateUI();
                self._raiseEvent('0', { color: self.color });
                self.color.transparent = false;
            }

            var mouseDownEvent = "mousedown.picker" + this.element.id;
            if (this._isTouchDevice) {
                mouseDownEvent = $.jqx.mobile.getTouchEventName('touchstart') + ".picker" + this.element.id;
            }
            this.addHandler(this.colorMap, mouseDownEvent, function (event) {
                if (self.disabled)
                    return;

                self.beginDrag = true;
                _setPositionInColorMap(event);
            });

            var mouseMoveEvent = "mousemove.picker" + this.element.id;
            if (this._isTouchDevice) {
                mouseMoveEvent = $.jqx.mobile.getTouchEventName('touchmove') + ".picker" + this.element.id;
            }

            this.addHandler($(document), mouseMoveEvent, function (event) {
                if (self.disabled)
                    return;

                if (self.beginDrag == true) {
                    _setPositionInColorMap(event);
                    if (self._isTouchDevice) {
                        event.preventDefault();
                    }
                }
            });

            if (!this._isTouchDevice) {
                this.addHandler(this.colorBar, 'dragstart', function (event) {
                    event.preventDefault();
                    return false;
                });
            }

            var _setPositionInColorBar = function (event) {
                self._setPosition(event, self.colorBar, self.colorBarPointer);
                if (self.colorMode == 'saturation') {
                    var point = self._valuesFromMouse(event, self.colorBar, 100, 100);
                    self.color.s = point.y;
                    self._saturation = point.y;

                    self.colorMapImageOverlay.css('opacity', (self.color.s) / 100);
                    self.color.setHsv(self.color.h, 100 - self.color.s, self.color.v);
                }
                else {
                    var point = self._valuesFromMouse(event, self.colorBar, 100, 360);
                    self.color.h = 360 - point.y;
                    self._hue = self.color.h;
                    self.color.setHsv(self.color.h, self.color.s, self.color.v);
                }

                self._updateUI();
                self._raiseEvent('0', { color: self.color });
                self.color.transparent = false;
            }

            var colorBarMouseMoveEvent = "mousemove.colorBar" + this.element.id;
            var colorBarMouseDownEvent = "mousedown.colorBar" + this.element.id;
            var colorBarMouseUpEvent = "mouseup.colorBar" + this.element.id;
            if (this._isTouchDevice) {
                colorBarMouseMoveEvent = $.jqx.mobile.getTouchEventName('touchmove') + ".colorBar" + this.element.id;
                colorBarMouseDownEvent = $.jqx.mobile.getTouchEventName('touchstart') + ".colorBar" + this.element.id;
                colorBarMouseUpEvent = $.jqx.mobile.getTouchEventName('touchend') + ".colorBar" + this.element.id;
            }

            this.addHandler(this.colorBar, colorBarMouseDownEvent, function (event) {
                if (self.disabled)
                    return;

                self.beginDragBar = true;
                _setPositionInColorBar(event);
            });

            this.addHandler($(document), colorBarMouseMoveEvent, function (event) {
                if (self.disabled)
                    return;

                if (self.beginDragBar == true) {
                    _setPositionInColorBar(event);
                    if (self._isTouchDevice) {
                        event.preventDefault();
                    }
                }
            });

            this.addHandler($(document), colorBarMouseUpEvent, function (event) {
                if (self.disabled)
                    return;

                self.beginDrag = false;
                self.beginDragBar = false;
            });
        },

        _removeHandlers: function () {
            this.removeHandler(this.transparent, 'click');
            this.removeHandler(this.host, 'selectionstart');
            this.removeHandler(this.blue, 'keyup blur');
            this.removeHandler(this.green, 'keyup blur');
            this.removeHandler(this.red, 'keyup blur');
            this.removeHandler(this.hex, 'keyup blur');
            this.removeHandler(this.colorMap, 'dragstart');
            this.removeHandler(this.colorBar, 'dragstart');
            this.removeHandler(this.colorMapPointer, 'dragStart');
            this.removeHandler(this.colorBarPointer, 'dragStart');

            var id = this.element.id;
            var colorBarMouseMoveEvent = "mousemove.colorBar" + id;
            var colorBarMouseDownEvent = "mousedown.colorBar" + id;
            var colorBarMouseUpEvent = "mouseup.colorBar" + id;
            var mouseDownEvent = "mousedown.picker" + id;
            var mouseMoveEvent = "mousemove.picker" + id;
            if (this._isTouchDevice) {
                colorBarMouseMoveEvent = $.jqx.mobile.getTouchEventName('touchmove') + ".colorBar" + id;
                colorBarMouseDownEvent = $.jqx.mobile.getTouchEventName('touchstart') + ".colorBar" + id;
                colorBarMouseUpEvent = $.jqx.mobile.getTouchEventName('touchend') + ".colorBar" + id;
                mouseDownEvent = $.jqx.mobile.getTouchEventName('touchstart') + ".picker" + id;
                mouseMoveEvent = $.jqx.mobile.getTouchEventName('touchmove') + ".picker" + id;
            }

            this.removeHandler(this.colorMap, mouseDownEvent);
            this.removeHandler(this.colorMap, mouseMoveEvent);
            this.removeHandler(this.colorBar, colorBarMouseDownEvent);
            this.removeHandler(this.colorBar, colorBarMouseMoveEvent);
            this.removeHandler($(document), mouseMoveEvent);
            this.removeHandler($(document), colorBarMouseMoveEvent);
            this.removeHandler($(document), colorBarMouseUpEvent);
        },

        _raiseEvent: function (id, arg) {
            if (arg == undefined)
                arg = { owner: null };

            var evt = this.events[id];
            var args = arg ? arg : {};

            args.owner = this;
            var event = new $.Event(evt);
            event.owner = this;
            event.args = args;

            var result = this.host.trigger(event);

            return result;
        },

        setColor: function (color) {
            if (!color) return;

            if (color == 'transparent') {
                this.color.transparent = true;
                this.color.hex = "000";
                this.color.r = 0;
                this.color.g = 0;
                this.color.b = 0;
            }
            else {
                if (color.r) {
                    this.color = new $.jqx.color({ rgb: color });
                }
                else {
                    if (color.substring(0, 1) == '#') {
                        this.color = new $.jqx.color({ hex: color.substring(1) });
                    }
                    else {
                        this.color = new $.jqx.color({ hex: color });
                    }
                }
            }
            this._updateUI();
            this._setPositionFromValue();
            this._raiseEvent('0', { color: this.color });
        },

        getColor: function () {
            return this.color;
        },

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            this._setSize();
            this.refresh();
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (object.isInitialized == undefined || object.isInitialized == false)
                return;

            if (key == 'colorMode') {
                object.refresh();
            }

            if (key == 'color') {
                object._updateUI();
                object._setPositionFromValue();
                object._raiseEvent('0', { color: value });
            }

            if (key == 'width' || key == 'height') {
                object._setSize();
                object.refresh();
            }

            if (key == 'showTransparent') {
                object.refresh();
            }

            if (key == 'disabled') {
                this.element.disabled = value;
                if (value) {
                    object.host.addClass(object.toThemeProperty('jqx-fill-state-disabled'));
                }
                else {
                    object.host.removeClass(object.toThemeProperty('jqx-fill-state-disabled'));
                }
            }
        },

        _valuesFromMouse: function (e, element, maxX, maxY) {
            var relativeX = 0;
            var relativeY = 0;
            var offset = element.offset();
            var height = element.height();
            var width = element.width();
            var x = e.pageX;
            var y = e.pageY;
            if (this._isTouchDevice) {
                var pos = $.jqx.position(e);
                x = pos.left;
                y = pos.top;
            }
            // mouse relative to object's top left
            if (x < offset.left)
                relativeX = 0;
            else if (x > offset.left + width)
                relativeX = width;
            else
                relativeX = x - offset.left + 1;

            if (y < offset.top)
                relativeY = 0;
            else if (y > offset.top + height)
                relativeY = height;
            else
                relativeY = y - offset.top + 1;


            var newXValue = parseInt(relativeX / width * maxX);
            var newYValue = parseInt(relativeY / height * maxY);
            return { x: newXValue, y: newYValue };
        },

        _validateKey: function (e) {
            if (e.keyCode == 9 || // TAB
			    e.keyCode == 16 || // Shift
			    e.keyCode == 38 || // Up arrow
			    e.keyCode == 29 || // Right arrow
			    e.keyCode == 40 || // Down arrow
			    e.keyCode == 17 || // Down arrow
			    e.keyCode == 37    // Left arrow
			    ||
			    (e.ctrlKey && (e.keyCode == 'c'.charCodeAt() || e.keyCode == 'v'.charCodeAt()))
			    ||
			    (e.ctrlKey && (e.keyCode == 'C'.charCodeAt() || e.keyCode == 'V'.charCodeAt()))
		    ) {
                return false;
            }

            if (e.ctrlKey || e.shiftKey)
                return false;

            return true;
        },

        _setValueInRange: function (value, min, max) {
            if (value == '' || isNaN(value))
                return min;

            value = parseInt(value);
            if (value > max)
                return max;
            if (value < min)
                return min;

            return value;
        },

        destroy: function () {
            $.jqx.utilities.resize(this.host, null, true);
            this.host.removeClass();
            this._removeHandlers();
            this.host.remove();
        },

        setPointerStyle: function (color) {
            this.colorMapPointer.removeClass();
            if (color == 'transparent' || color.hex == "") {
                this.colorMapPointer.addClass(this.toThemeProperty('jqx-color-picker-pointer'));
            }

            var nThreshold = 105;
            var bgDelta = (color.r * 0.299) + (color.g * 0.587) + (color.b * 0.114);
            var foreColor = (255 - bgDelta < nThreshold) ? 'Black' : 'White';

            if (foreColor == 'Black') {
                this.colorMapPointer.addClass(this.toThemeProperty('jqx-color-picker-pointer'));
            }
            else this.colorMapPointer.addClass(this.toThemeProperty('jqx-color-picker-pointer-alt'));
        },

        _updateUI: function () {
            var self = this;
            self.red.val(self.color.r);
            self.green.val(self.color.g);
            self.blue.val(self.color.b);
            self.hex.val(self.color.hex);

            var color = new $.jqx.color({ hex: 'fff' });
            if (this.colorMode == 'saturation') {
                color.setHsv(this.color.h, 100, this.color.v);
                self.colorBar.css('background', '#' + color.hex);
            }
            else {
                color.setHsv(this.color.h, 100, 100);
                self.colorMap.css('background-color', '#' + color.hex);
            }
            self.preview.css('background', '#' + this.color.hex);
            self.setPointerStyle(this.color);
        },

        _setSize: function () {
            if (this.width != null && this.width.toString().indexOf("px") != -1) {
                this.host.width(this.width);
            }
            else
                if (this.width != undefined && !isNaN(this.width)) {
                    this.host.width(this.width);
                };

            if (this.height != null && this.height.toString().indexOf("px") != -1) {
                this.host.height(this.height);
            }
            else if (this.height != undefined && !isNaN(this.height)) {
                this.host.height(this.height);
            };

            if (this.host.width() < 130) {
                this.host.width(150);
            }
            if (this.host.height() < 70) {
                this.host.height(70);
            }

            if (this.width != null && this.width.toString().indexOf("%") != -1) {
                this.host.width(this.width);
            }

            if (this.height != null && this.height.toString().indexOf("%") != -1) {
                this.host.height(this.height);
            }
        },

        _arrange: function () {
            var hostHeight = this.host.height();
            var hostWidth = this.host.width();
            var height = hostHeight - 44;
            if (this.showTransparent) {
                height = hostHeight - 64;
            }

            if (height <= 0)
                return;

            this.colorMap.width(85 * hostWidth / 100);
            this.colorMap.height(height);
            this.colorBar.height(height);
            this.colorBar.css('left', this.colorMap.width() + 4);
            this.colorBar.width(8 * hostWidth / 100);
            this.colorBarPointer.width(this.colorBar.width());
            this.colorPanel.width(hostWidth);
            this.colorPanel.height(40);
            if (this.showTransparent) {
                this.colorPanel.height(60);
            }
            this.colorPanel.css('top', height + 4);
            this.colorPanel.css('text-align', 'left');
            this.hex.width(this.colorMap.width() - this.colorBar.width() - 4);
            var leftMargin = this.red.prev().outerWidth() - this.hex.prev().outerWidth();
            if (leftMargin < 4) leftMargin = 4;

            this.hex.css('margin-left', leftMargin + 'px');
            this.preview.width(this.colorBar.width() + 7);
            this.preview.height(25);
            this.preview.addClass(this.toThemeProperty('jqx-rc-all'));
            this.preview.addClass(this.toThemeProperty('jqx-color-picker-preview'));
            this.preview.css('left', this.colorMap.width() - 2);
            this.preview.css('top', '5px');
            var hexPosition = this.hex.width();

            var offset = hexPosition - this.blue.prev().outerWidth() - this.green.prev().outerWidth() - 6;
            if (offset > 0) {
                this.blue.width(offset / 3);
                this.green.width(offset / 3);
                this.red.width(offset / 3);
                return;
            }
        },

        _getColorPointer: function () {
            var element = $("<div></div>");
            element.addClass(this.toThemeProperty('jqx-color-picker-pointer'));
            return element;
        },

        _getImageUrl: function (element) {
            var imageUrl = element.css('backgroundImage');
            imageUrl = imageUrl.replace('url("', '');
            imageUrl = imageUrl.replace('")', '');
            imageUrl = imageUrl.replace('url(', '');
            imageUrl = imageUrl.replace(')', '');
            return imageUrl;
        },

        refresh: function () {
            if (this._delayLoading) return;

            this._saturation = null;
            this._hue = null;

            this.colorMap.removeClass();
            this.colorBar.removeClass();
            this.colorMap.addClass(this.toThemeProperty('jqx-disableselect'));
            this.colorBar.addClass(this.toThemeProperty('jqx-disableselect'));
            this.colorPanel.addClass(this.toThemeProperty('jqx-color-picker-panel'));
            this.colorBar.css('background-image', '');
            this.colorMap.css('background-image', '');

            if (this.colorMode == 'saturation') {
                this.colorMap.addClass(this.toThemeProperty('jqx-color-picker-map'));
                this.colorBar.addClass(this.toThemeProperty('jqx-color-picker-bar'));
            }
            else {
                this.colorMap.addClass(this.toThemeProperty('jqx-color-picker-map-hue'));
                this.colorBar.addClass(this.toThemeProperty('jqx-color-picker-bar-hue'));
            }

            this._barImageURL = this._getImageUrl(this.colorBar);
            this._mapImageURL = this._getImageUrl(this.colorMap);

            this._arrange();
            this.colorBar.children().remove();
            this.colorBarImageContainer = $("<div style='overflow: hidden;'></div>");
            this.colorBarImageContainer.width(this.colorBar.width());
            this.colorBarImageContainer.height(this.colorBar.height());
            this.colorBarImageContainer.appendTo(this.colorBar);
            this.colorBarImage = $("<img/>");
            this.colorBarImage.appendTo(this.colorBarImageContainer);
            this.colorBarImage.attr('src', this._barImageURL);
            this.colorBar.css('background-image', 'none');
            this.colorBarImage.attr('width', this.colorBar.width());
            this.colorBarImage.attr('height', this.colorBar.height());

            this.colorBarPointer.appendTo(this.colorBar);

            this.colorMap.children().remove();
            this.colorMapImage = $("<img/>");
            this.colorMapImage.appendTo(this.colorMap);
            this.colorMapImage.attr('src', this._mapImageURL);
            this.colorMap.css('background-image', 'none');
            this.colorMapImage.attr('width', this.colorMap.width());
            this.colorMapImage.attr('height', this.colorMap.height());
            this.colorMapImageOverlay = $("<img style='position: absolute; left: 0; top: 0;'/>");
            this.colorMapImageOverlay.prependTo(this.colorMap);
            this.colorMapImageOverlay.attr('src', this._mapImageOverlayURL);
            this.colorMapImageOverlay.attr('width', this.colorMap.width());
            this.colorMapImageOverlay.attr('height', this.colorMap.height());
            this.colorMapImageOverlay.css('opacity', 0);

            this.colorMapPointer.appendTo(this.colorMap);

            if (this.showTransparent) {
                this.transparent.appendTo(this.colorPanel);
            }
            this._updateUI();
            this._setPositionFromValue();
        }
    });

    $.jqx.color = function (init) {
        var color = {
            r: 0,
            g: 0,
            b: 0,

            h: 0,
            s: 0,
            v: 0,

            hex: '',

            hexToRgb: function (hex) {
                hex = this.validateHex(hex);

                var r = '00', g = '00', b = '00';

                if (hex.length == 6) {
                    r = hex.substring(0, 2);
                    g = hex.substring(2, 4);
                    b = hex.substring(4, 6);
                } else {
                    if (hex.length > 4) {
                        r = hex.substring(4, hex.length);
                        hex = hex.substring(0, 4);
                    }
                    if (hex.length > 2) {
                        g = hex.substring(2, hex.length);
                        hex = hex.substring(0, 2);
                    }
                    if (hex.length > 0) {
                        b = hex.substring(0, hex.length);
                    }
                }

                return { r: this.hexToInt(r), g: this.hexToInt(g), b: this.hexToInt(b) };
            },

            validateHex: function (hex) {
                hex = new String(hex).toUpperCase();
                hex = hex.replace(/[^A-F0-9]/g, '0');
                if (hex.length > 6) hex = hex.substring(0, 6);
                return hex;
            },

            webSafeDec: function (dec) {
                dec = Math.round(dec / 51);
                dec *= 51;
                return dec;
            },

            hexToWebSafe: function (hex) {
                var r, g, b;

                if (hex.length == 3) {
                    r = hex.substring(0, 1);
                    g = hex.substring(1, 1);
                    b = hex.substring(2, 1);
                } else {
                    r = hex.substring(0, 2);
                    g = hex.substring(2, 4);
                    b = hex.substring(4, 6);
                }
                return intToHex(this.webSafeDec(this.hexToInt(r))) + this.intToHex(this.webSafeDec(this.hexToInt(g))) + this.intToHex(this.webSafeDec(this.hexToInt(b)));
            },

            rgbToWebSafe: function (rgb) {
                return { r: this.webSafeDec(rgb.r), g: this.webSafeDec(rgb.g), b: this.webSafeDec(rgb.b) };
            },

            rgbToHex: function (rgb) {
                return this.intToHex(rgb.r) + this.intToHex(rgb.g) + this.intToHex(rgb.b);
            },

            intToHex: function (dec) {
                var result = (parseInt(dec).toString(16));
                if (result.length == 1)
                    result = ("0" + result);
                return result.toUpperCase();
            },

            hexToInt: function (hex) {
                return (parseInt(hex, 16));
            },

            hslToRgb: function (hsl) {
                var h = parseInt(hsl.h) / 360;
                var s = parseInt(hsl.s) / 100;
                var l = parseInt(hsl.l) / 100;

                if (l <= 0.5) var q = l * (1 + s);
                else var q = l + s - (l * s);

                var p = 2 * l - q;
                var tr = h + (1 / 3);
                var tg = h;
                var tb = h - (1 / 3);

                var r = Math.round(this.hueToRgb(p, q, tr) * 255);
                var g = Math.round(this.hueToRgb(p, q, tg) * 255);
                var b = Math.round(this.hueToRgb(p, q, tb) * 255);
                return { r: r, g: g, b: b };
            },

            hueToRgb: function (p, q, h) {
                if (h < 0) h += 1;
                else if (h > 1) h -= 1;

                if ((h * 6) < 1) return p + (q - p) * h * 6;
                else if ((h * 2) < 1) return q;
                else if ((h * 3) < 2) return p + (q - p) * ((2 / 3) - h) * 6;
                else return p;
            },

            rgbToHsv: function (rgb) {

                var r = rgb.r / 255;
                var g = rgb.g / 255;
                var b = rgb.b / 255;

                hsv = { h: 0, s: 0, v: 0 };

                var min = 0
                var max = 0;

                if (r >= g && r >= b) {
                    max = r;
                    min = (g > b) ? b : g;
                } else if (g >= b && g >= r) {
                    max = g;
                    min = (r > b) ? b : r;
                } else {
                    max = b;
                    min = (g > r) ? r : g;
                }

                hsv.v = max;
                hsv.s = (max) ? ((max - min) / max) : 0;

                if (!hsv.s) {
                    hsv.h = 0;
                } else {
                    delta = max - min;
                    if (r == max) {
                        hsv.h = (g - b) / delta;
                    } else if (g == max) {
                        hsv.h = 2 + (b - r) / delta;
                    } else {
                        hsv.h = 4 + (r - g) / delta;
                    }

                    hsv.h = parseInt(hsv.h * 60);
                    if (hsv.h < 0) {
                        hsv.h += 360;
                    }
                }

                hsv.s = parseInt(hsv.s * 100);
                hsv.v = parseInt(hsv.v * 100);

                return hsv;
            },

            hsvToRgb: function (hsv) {

                rgb = { r: 0, g: 0, b: 0 };

                var h = hsv.h;
                var s = hsv.s;
                var v = hsv.v;

                if (s == 0) {
                    if (v == 0) {
                        rgb.r = rgb.g = rgb.b = 0;
                    } else {
                        rgb.r = rgb.g = rgb.b = parseInt(v * 255 / 100);
                    }
                } else {
                    if (h == 360) {
                        h = 0;
                    }
                    h /= 60;

                    // 100 scale
                    s = s / 100;
                    v = v / 100;

                    var i = parseInt(h);
                    var f = h - i;
                    var p = v * (1 - s);
                    var q = v * (1 - (s * f));
                    var t = v * (1 - (s * (1 - f)));
                    switch (i) {
                        case 0:
                            rgb.r = v;
                            rgb.g = t;
                            rgb.b = p;
                            break;
                        case 1:
                            rgb.r = q;
                            rgb.g = v;
                            rgb.b = p;
                            break;
                        case 2:
                            rgb.r = p;
                            rgb.g = v;
                            rgb.b = t;
                            break;
                        case 3:
                            rgb.r = p;
                            rgb.g = q;
                            rgb.b = v;
                            break;
                        case 4:
                            rgb.r = t;
                            rgb.g = p;
                            rgb.b = v;
                            break;
                        case 5:
                            rgb.r = v;
                            rgb.g = p;
                            rgb.b = q;
                            break;
                    }

                    rgb.r = parseInt(rgb.r * 255);
                    rgb.g = parseInt(rgb.g * 255);
                    rgb.b = parseInt(rgb.b * 255);
                }

                return rgb;
            },

            setRgb: function (r, g, b) {
                var validate = function (input) {
                    if (input < 0 || input > 255)
                        return 0;
                    if (isNaN(parseInt(input)))
                        return 0;

                    return input;
                }

                this.r = validate(r);
                this.g = validate(g);
                this.b = validate(b);

                var newHsv = this.rgbToHsv(this);
                this.h = newHsv.h;
                this.s = newHsv.s;
                this.v = newHsv.v;

                this.hex = this.rgbToHex(this);
            },

            setHsl: function (h, s, l) {
                this.h = h;
                this.s = s;
                this.l = l;

                var newRgb = this.hslToRgb(this);
                this.r = newRgb.r;
                this.g = newRgb.g;
                this.b = newRgb.b;

                this.hex = this.rgbToHex(newRgb);
            },

            setHsv: function (h, s, v) {
                this.h = h;
                this.s = s;
                this.v = v;

                var newRgb = this.hsvToRgb(this);
                this.r = newRgb.r;
                this.g = newRgb.g;
                this.b = newRgb.b;

                this.hex = this.rgbToHex(newRgb);
            },

            setHex: function (hex) {
                this.hex = hex;

                var newRgb = this.hexToRgb(this.hex);
                this.r = newRgb.r;
                this.g = newRgb.g;
                this.b = newRgb.b;

                var newHsv = this.rgbToHsv(newRgb);
                this.h = newHsv.h;
                this.s = newHsv.s;
                this.v = newHsv.v;
            }
        };

        if (init) {
            if (init.hex) {
                var hex = color.validateHex(init.hex);
                color.setHex(hex);
            }
            else if (init.r)
                color.setRgb(init.r, init.g, init.b);
            else if (init.h)
                color.setHsv(init.h, init.s, init.v);
            else if (init.rgb) {
                color.setRgb(init.rgb.r, init.rgb.g, init.rgb.b);

            }
        }

        return color;
    };
})(jqxBaseFramework);

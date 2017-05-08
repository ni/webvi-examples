/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {

    $.jqx.jqxWidget("jqxNumberInput", "", {});

    $.extend($.jqx._jqxNumberInput.prototype, {

        defineInstance: function () {
            var settings = {
                // Type: Number
                // Default: 0
                // Gets or sets the input's value.
                value: null,
                // Type: Number
                // Default: 0
                // Gets or sets the input's number.
                decimal: 0,
                // Type: Number
                // Default= 0
                // Gets or sets the input's minimum value.
                min: -99999999,
                // Type: Number
                // Default: 0
                // Gets or sets the input's maximum value.
                max: 99999999,
                //Type: Number.
                //Default: 0.
                //Sets width of the input in pixels. Only positive values have effect.
                width: 200,
                //Type: String,
                //Default: Invalid value.
                validationMessage: "Invalid value",
                //Type: Number.
                //Default: 0.
                //Sets height of the input in pixels. 
                height: 25,
                // Sets the alignment.
                textAlign: "right",
                // Type: Bool
                // Default: false
                // Sets the readOnly state of the input.
                readOnly: false,
                // Type: Char
                // Default: "_"
                // Sets the prompt char displayed when an editable char is empty.
                // Possible Values: "_", "?", "#".
                promptChar: "_",
                // Type: Number
                // Default: 2
                // Indicates the number of decimal places to use in numeric values.
                decimalDigits: 2,
                // Type= Char
                // Default: '.'
                // Gets or sets the char to use as the decimal separator in numeric values.
                decimalSeparator: ".",
                // Type= Char
                // Default: ","
                // Gets or sets the string that separates groups of digits to the left of the
                // decimal in numeric values.
                groupSeparator: ",",
                // Type: Number
                // Default: '3'
                // Gets or sets the number of digits in each group to the left of the decimal in numeric values.
                groupSize: 3,
                // Type: String
                // Default: empty
                // Gets or sets the string to use as currency or percentage symbol.
                symbol: '',
                // Type: Bool
                // Default: "left"
                // Gets or sets the position of the symbol in the input.
                symbolPosition: "left",
                // Type: Number
                // Default: 8
                // Gets or sets the digits in the input
                digits: 8,
                // Type: Bool
                // Default: false
                // Gets or sets whether the decimal is negative.
                negative: false,
                // Type: Bool
                // Default: false
                // Gets or sets the string to use as negative symbol.
                negativeSymbol: '-',
                // Type: Bool
                // Default: false
                // Gets or sets whether the widget is disabled.
                disabled: false,
                // Type: String
                // Default: advanced
                // Gets or sets the input mode. When the mode is simple, the text is formatted after editing. When the mode is advanced, the text is formatted while the user is in edit mode.
                // Available values: [simple, advanced]
                inputMode: 'advanced',
                // Type: Boolean
                // Default: false
                // shows the spin buttons. 
                spinButtons: false,
                // Type: Number
                // Default: 18
                // Sets the spin buttons width
                spinButtonsWidth: 18,
                // Type: Number
                // Default: 1
                // sets the spin button step.
                spinButtonsStep: 1,
                // validates the value to be in the min-max range when the user leaves the input.
                autoValidate: true,
                // none, advanced or simple
                spinMode: 'advanced',
                enableMouseWheel: true,
                touchMode: "auto",
                allowNull: true,
                placeHolder: "",
                changeType: null,
                template: "",
                rtl: false,
                // NumberInput events.
                events:
                [
                   'valueChanged',
                   'textchanged',
                   'mousedown',
                   'mouseup',
                   'keydown',
                   'keyup',
                   'keypress',
                   'change'
                ],
                aria:
                {
                    "aria-valuenow": { name: "decimal", type: "number" },
                    "aria-valuemin": { name: "min", type: "number" },
                    "aria-valuemax": { name: "max", type: "number" },
                    "aria-disabled": { name: "disabled", type: "boolean" }
                },
                invalidArgumentExceptions:
                [
                    'invalid argument exception'
                ]
            };
            $.extend(true, this, settings);
            return settings;
        },

        // creates the number input's instance. 
        createInstance: function (args)
        {
            var _val = this.host.attr('value');
            if (_val != undefined)
            {
                this.decimal = _val;
            }
            if (this.value != null) this.decimal = this.value;

            var that = this;
            that._createFromInput("jqxNumberInput");

            this.render();
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

                if (that.field.value)
                {
                    that.decimal = parseFloat(that.field.value);
                }
                if (that.field.getAttribute('min'))
                {
                    var min = (that.field.getAttribute('min'));
                    that.min = parseFloat(min);
                }
                if (that.field.getAttribute('step'))
                {
                    var step = (that.field.getAttribute('step'));
                    that.spinButtonsStep = parseFloat(step);
                }
                if (that.field.getAttribute('max'))
                {
                    var max = (that.field.getAttribute('max'));
                    that.max = parseFloat(max);
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

        _doTouchHandling: function () {
            var me = this;
            var savedValue = me.savedValue;
            if (!me.parsing) me.parsing = true;
            if (me.parsing) {
                if (me.numberInput.val() && me.numberInput.val().indexOf('-') == 0) {
                    me.setvalue('negative', true);
                }
                else {
                    me.setvalue('negative', false);
                }
                var value = me.numberInput.val();
                for (var i = 0; i < value.length - 1; i++) {
                    var ch = value.substring(i, i + 1);
                    if (isNaN(parseFloat(ch)) && ch != me.symbol && ch != "%" && ch != "$" && ch != '.' && ch != ',' && ch != '-') {
                        me.numberInput[0].value = savedValue;
                        me.parsing = false;
                        return;
                    }
                }

                me.ValueString = me.GetValueString(me.numberInput.val(), me.decimalSeparator, me.decimalSeparator != '');
                me.ValueString = new Number(me.ValueString).toFixed(me.decimalDigits);
                me._parseDecimalInSimpleMode();
                me.decimal = me.ValueString;
                var isNegative = me.getvalue('negative');
                if (isNegative) {
                    me.decimal = "-" + me.ValueString;
                }

                me.parsing = false;
            }
        },

        render: function () {
            this.host
             .attr({
                 role: "spinbutton"
             });
            this.host.attr('data-role', 'input');
            $.jqx.aria(this);
            $.jqx.aria(this, "aria-multiline", false);

            var me = this;

            if (this.officeMode || (this.theme && this.theme.indexOf('office') != -1)) {
                if (this.spinButtonsWidth == 18) this.spinButtonsWidth = 15;
            }

            if ($.jqx.mobile.isTouchDevice() || this.touchMode === true) {
                this.inputMode = 'textbox';
                this.spinMode = 'simple';
            }

            if (this.decimalSeparator == '') this.decimalSeparator = ' ';
            this.host.addClass(this.toThemeProperty('jqx-input'));
            this.host.addClass(this.toThemeProperty('jqx-rc-all'));
            this.host.addClass(this.toThemeProperty('jqx-widget'));
            this.host.addClass(this.toThemeProperty('jqx-widget-content'));
            this.host.addClass(this.toThemeProperty('jqx-numberinput'));

            if (this.spinButtons) {
                this._spinButtons();
            }
            else {
                this.numberInput = $("<input style='border:none;' autocomplete='off' type='textarea'/>").appendTo(this.host);
                this.numberInput.addClass(this.toThemeProperty('jqx-input-content'));
                this.numberInput.addClass(this.toThemeProperty('jqx-widget-content'));
            }
            this.numberInput.attr('placeholder', this.placeHolder);

            var name = this.host.attr('name');
            if (name) {
                this.numberInput.attr('name', name);
            }
            if (this.host.attr('tabindex')) {
                this.numberInput.attr('tabindex', this.host.attr('tabindex'));
                this.host.removeAttr('tabindex');
            }

            if ($.jqx.mobile.isTouchDevice() || this.touchMode === true || this.inputMode == 'textbox') {
                var me = this;
                me.savedValue = "";
                this.addHandler(this.numberInput, 'focus', function () {
                    me.savedValue = me.numberInput[0].value;
                });

                this.addHandler(this.numberInput, 'change', function () {
                    me._doTouchHandling();
                });
            }

            var vars = $.data(this.host[0], 'jqxNumberInput');
            vars.jqxNumberInput = this;
            var me = this;

            if (this.host.parents('form').length > 0) {
                this.addHandler(this.host.parents('form'), 'reset', function () {
                    setTimeout(function () {
                        me.setDecimal(0);
                    }, 10);
                });
            }

            this.propertyChangeMap['disabled'] = function (instance, key, oldVal, value) {
                if (value) {
                    instance.numberInput.addClass(self.toThemeProperty('jqx-input-disabled'));
                    instance.numberInput.attr("disabled", true);
                }
                else {
                    instance.host.removeClass(self.toThemeProperty('jqx-input-disabled'));
                    instance.numberInput.attr("disabled", false);
                }

                if (instance.spinButtons && instance.host.jqxRepeatButton) {
                    instance.upbutton.jqxRepeatButton({ disabled: value });
                    instance.downbutton.jqxRepeatButton({ disabled: value });
                }
            }

            if (this.disabled) {
                this.numberInput.addClass(this.toThemeProperty('jqx-input-disabled'));
                this.numberInput.attr("disabled", true);
                this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
            }

            this.selectedText = "";
            this.decimalSeparatorPosition = -1;

            var id = this.element.id;
            var el = this.element;
            var self = this;

            this.oldValue = this._value();

            this.items = new Array();
            var value = this.value;
            var decimal = this.decimal;
            this._initializeLiterals();
            this._render();

            this.setDecimal(decimal);
            var me = this;
            setTimeout(function () {
     //           me._render(false);
            }
           , 100);

            this._addHandlers();
            $.jqx.utilities.resize(this.host, function () {
                me._render();
            });
        },

        refresh: function (initialRefresh) {
            if (!initialRefresh) {
                this._render();
            }
        },

        wheel: function (event, self) {
            if (!self.enableMouseWheel) {
                return;
            }
            self.changeType = "mouse";
            var delta = 0;
            if (!event) /* For IE. */
                event = window.event;

            if (event.originalEvent && event.originalEvent.wheelDelta) {
                event.wheelDelta = event.originalEvent.wheelDelta;
            }

            if (event.wheelDelta) { /* IE/Opera. */
                delta = event.wheelDelta / 120;
            } else if (event.detail) { /** Mozilla case. */
                delta = -event.detail / 3;
            }

            if (delta) {
                var result = self._handleDelta(delta);
                if (event.preventDefault)
                    event.preventDefault();

                if (event.originalEvent != null) {
                    event.originalEvent.mouseHandled = true;
                }

                if (event.stopPropagation != undefined) {
                    event.stopPropagation();
                }

                if (result) {
                    result = false;
                    event.returnValue = result;
                    return result;
                }
                else {
                    return false;
                }
            }

            if (event.preventDefault)
                event.preventDefault();
            event.returnValue = false;
        },

        _handleDelta: function (delta) {
            if (delta < 0) {
                this.spinDown();
            }
            else this.spinUp();
            return true;
        },

        _addHandlers: function () {
            var self = this;
            this.addHandler(this.numberInput, 'paste',
             function (e) {
                 var selection = self._selection();
                 e.preventDefault();
                 if (e.originalEvent.clipboardData) {
                     content = (e.originalEvent || e).clipboardData.getData('text/plain');
                 }
                 else if (window.clipboardData) {
                     content = window.clipboardData.getData('Text');
                 }
                 this.selectedText = content;
                 $.data(document.body, "jqxSelection", this.selectedText);
                 if (self.inputMode != "simple") {
                     self._pasteSelectedText();
                 }
                 else self.val(content);
                 setTimeout(function () {
                     self._setSelectionStart(selection.start);
                 });
            });
            this.addHandler(this.numberInput, 'mousedown',
            function (event) {
                return self._raiseEvent(2, event)
            });

            this._mousewheelfunc = this._mousewheelfunc || function (event) {
                if (!self.editcell) {
                    self.wheel(event, self);
                    return false;
                }
            };

            this.removeHandler(this.host, 'mousewheel', this._mousewheelfunc);
            this.addHandler(this.host, 'mousewheel', this._mousewheelfunc);
            var oldval = "";

            this.addHandler(this.numberInput, 'focus',
            function (event) {
                $.data(self.numberInput, "selectionstart", self._selection().start);
                self.host.addClass(self.toThemeProperty('jqx-fill-state-focus'));
                if (self.spincontainer) {
                    self.spincontainer.addClass(self.toThemeProperty('jqx-numberinput-focus'));
                }
                oldval = self.numberInput.val();
            });

            this.addHandler(this.numberInput, 'blur',
            function (event) {
                if (self.inputMode == 'simple') {
                    self._exitSimpleInputMode(event, self, false, oldval);
                }
                if (self.autoValidate) {
                    var val = parseFloat(self.decimal);
                    var isNegative = self.getvalue('negative');
                    if (isNegative && self.decimal > 0) {
                        val = -parseFloat(self.decimal);
                    }

                    if (val > self.max) {
                        self._disableSetSelection = true;
                        self.setDecimal(self.max);
                        self._disableSetSelection = false;
                    }
                    if (val < self.min) {
                        self._disableSetSelection = true;
                        self.setDecimal(self.min);
                        self._disableSetSelection = false;
                    }
                }

                self.host.removeClass(self.toThemeProperty('jqx-fill-state-focus'));
                if (self.spincontainer) {
                    self.spincontainer.removeClass(self.toThemeProperty('jqx-numberinput-focus'));
                }
                if (self.numberInput.val() != oldval) {
                    self._raiseEvent(7, event);
                    $.jqx.aria(self, "aria-valuenow", self.decimal);
                    self.element.value = self.decimal;
                }
                return true;
            });

            this.addHandler(this.numberInput, 'mouseup',
            function (event) {
                return self._raiseEvent(3, event)
            });

            this.addHandler(this.numberInput, 'keydown',
            function (event) {
                self.changeType = "keyboard";

                return self._raiseEvent(4, event)
            });

            this.addHandler(this.numberInput, 'keyup',
            function (event) {
                return self._raiseEvent(5, event)
            });

            this.addHandler(this.numberInput, 'keypress',
            function (event) {
                return self._raiseEvent(6, event)
            });
        },

        focus: function () {
            try {
                this.numberInput.focus();
            }
            catch (error) {
            }
        },

        _removeHandlers: function () {
            var self = this;
            this.removeHandler(this.numberInput, 'mousedown');
            var isOperaMini = $.jqx.mobile.isOperaMiniMobileBrowser();
            if (isOperaMini) {
                this.removeHandler($(document), 'click.' + this.element.id, self._exitSimpleInputMode, self);
            }

            this.removeHandler(this.numberInput, 'paste');
            this.removeHandler(this.numberInput, 'focus');
            this.removeHandler(this.numberInput, 'blur');
            this.removeHandler(this.numberInput, 'mouseup');
            this.removeHandler(this.numberInput, 'keydown');
            this.removeHandler(this.numberInput, 'keyup');
            this.removeHandler(this.numberInput, 'keypress');
        },

        //[optimize]
        _spinButtons: function () {
            if (this.host.jqxRepeatButton) {
                if (!this.numberInput) {
                    this.numberInput = $("<input autocomplete='off' style='border: none; position: relative; float: left;' type='textarea'/>");
                    this.numberInput.appendTo(this.host);
                    this.numberInput.addClass(this.toThemeProperty('jqx-input-content'));
                    this.numberInput.addClass(this.toThemeProperty('jqx-widget-content'));
                }
                else {
                    this.numberInput.css('float', 'left');
                }

                if (this.spincontainer) {
                    if (this.upbutton) {
                        this.upbutton.jqxRepeatButton('destroy');
                    }
                    if (this.downbutton) {
                        this.downbutton.jqxRepeatButton('destroy');
                    }

                    this.spincontainer.remove();
                }
          
                this.spincontainer = $('<div style="float: right; height: 100%; overflow: hidden; position: relative;"></div>');
                if (this.rtl) {
                    this.spincontainer.css('float', 'right');
                    this.numberInput.css('float', 'right');
                    this.spincontainer.css('left', '-1px');
                }
                this.host.append(this.spincontainer);
                this.upbutton = $('<div style="overflow: hidden; padding: 0px; margin-left: -1px; position: relative;"><div></div></div>');
                this.spincontainer.append(this.upbutton);
                this.upbutton.jqxRepeatButton({ overrideTheme: true, disabled: this.disabled, roundedCorners: 'top-right' });
                this.downbutton = $('<div style="overflow: hidden; padding: 0px; margin-left: -1px; position: relative;"><div></div></div>');
                this.spincontainer.append(this.downbutton);
                this.downbutton.jqxRepeatButton({ overrideTheme: true, disabled: this.disabled, roundedCorners: 'bottom-right' });

                if (this.template)
                {
                    this.upbutton.addClass(this.toThemeProperty("jqx-" + this.template))
                    this.downbutton.addClass(this.toThemeProperty("jqx-" + this.template))
                }

                var me = this;

                this.downbutton.addClass(this.toThemeProperty('jqx-fill-state-normal jqx-action-button'));
                this.upbutton.addClass(this.toThemeProperty('jqx-fill-state-normal jqx-action-button'));
                this.upbutton.addClass(this.toThemeProperty('jqx-rc-tr'));
                this.downbutton.addClass(this.toThemeProperty('jqx-rc-br'));

                this.addHandler(this.downbutton, 'mouseup', function (event) {
                    if (!me.disabled) {
                        me.downbutton.removeClass(me.toThemeProperty('jqx-fill-state-pressed'));
                        me._downArrow.removeClass(me.toThemeProperty('jqx-icon-arrow-down-selected'));
                    }
                });

                this.addHandler(this.upbutton, 'mouseup', function (event) {
                    if (!me.disabled) {
                        me.upbutton.removeClass(me.toThemeProperty('jqx-fill-state-pressed'));
                        me._upArrow.removeClass(me.toThemeProperty('jqx-icon-arrow-up-selected'));
                    }
                });

                this.removeHandler($(document), 'mouseup.' + this.element.id);
                this.addHandler($(document), 'mouseup.' + this.element.id, function (event) {
                    me.upbutton.removeClass(me.toThemeProperty('jqx-fill-state-pressed'));
                    me._upArrow.removeClass(me.toThemeProperty('jqx-icon-arrow-up-selected'));
                    me.downbutton.removeClass(me.toThemeProperty('jqx-fill-state-pressed'));
                    me._downArrow.removeClass(me.toThemeProperty('jqx-icon-arrow-down-selected'));
                });

                this.addHandler(this.downbutton, 'mousedown', function (event) {
                    if (!me.disabled) {
                        if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                            me._inputSelection = me._selection();
                        }

                        me.downbutton.addClass(me.toThemeProperty('jqx-fill-state-pressed'));
                        me._downArrow.addClass(me.toThemeProperty('jqx-icon-arrow-down-selected'));
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    }
                });

                this.addHandler(this.upbutton, 'mousedown', function (event) {
                    if (!me.disabled) {
                        if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                            me._inputSelection = me._selection();
                        }

                        me.upbutton.addClass(me.toThemeProperty('jqx-fill-state-pressed'));
                        me._upArrow.addClass(me.toThemeProperty('jqx-icon-arrow-up-selected'));
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    }
                });

                this.addHandler(this.upbutton, 'mouseenter', function (event) {
                    me.upbutton.addClass(me.toThemeProperty('jqx-fill-state-hover'));
                    me._upArrow.addClass(me.toThemeProperty('jqx-icon-arrow-up-hover'));
                });
                this.addHandler(this.upbutton, 'mouseleave', function (event) {
                    me.upbutton.removeClass(me.toThemeProperty('jqx-fill-state-hover'));
                    me._upArrow.removeClass(me.toThemeProperty('jqx-icon-arrow-up-hover'));
                });

                this.addHandler(this.downbutton, 'mouseenter', function (event) {
                    me.downbutton.addClass(me.toThemeProperty('jqx-fill-state-hover'));
                    me._downArrow.addClass(me.toThemeProperty('jqx-icon-arrow-down-hover'));
                });
                this.addHandler(this.downbutton, 'mouseleave', function (event) {
                    me.downbutton.removeClass(me.toThemeProperty('jqx-fill-state-hover'));
                    me._downArrow.removeClass(me.toThemeProperty('jqx-icon-arrow-down-hover'));
                });

                this.upbutton.css('border-width', '0px');
                this.downbutton.css('border-width', '0px');

                if (this.disabled) {
                    this.upbutton[0].disabled = true;
                    this.downbutton[0].disabled = true;
                }
                else {
                    this.upbutton[0].disabled = false;
                    this.downbutton[0].disabled = false;
                }

                this.spincontainer.addClass(this.toThemeProperty('jqx-input'));
                this.spincontainer.addClass(this.toThemeProperty('jqx-rc-r'));
                this.spincontainer.css('border-width', '0px');
                if (!this.rtl) {
                    this.spincontainer.css('border-left-width', '1px');
                }
                else {
                    this.spincontainer.css('border-right-width', '1px');
                }

                this._upArrow = this.upbutton.find('div');
                this._downArrow = this.downbutton.find('div');

                this._upArrow.addClass(this.toThemeProperty('jqx-icon-arrow-up'));
                this._downArrow.addClass(this.toThemeProperty('jqx-icon-arrow-down'));
                this._upArrow.addClass(this.toThemeProperty('jqx-input-icon'));
                this._downArrow.addClass(this.toThemeProperty('jqx-input-icon'));
                var me = this;
                this._upArrow.hover(function () {
                    if (!me.disabled) {
                        me._upArrow.addClass(me.toThemeProperty('jqx-icon-arrow-up-hover'));
                    }
                }, function () {
                    me._upArrow.removeClass(me.toThemeProperty('jqx-icon-arrow-up-hover'));
                });
                this._downArrow.hover(function () {
                    if (!me.disabled) {
                        me._downArrow.addClass(me.toThemeProperty('jqx-icon-arrow-down-hover'));
                    }
                }, function () {
                    me._downArrow.removeClass(me.toThemeProperty('jqx-icon-arrow-down-hover'));
                });


                var isTouchDevice = $.jqx.mobile.isTouchDevice();
                var eventname = 'click';
                if (isTouchDevice) {
                    eventname = $.jqx.mobile.getTouchEventName('touchstart');
                }

                if (isTouchDevice) {
                    this.addHandler(this.downbutton, 'click', function (event) {
                        me.spinDown();
                    });
                    this.addHandler(this.upbutton, 'click', function (event) {
                        me.spinUp();
                    });
                }

                this.addHandler(this.downbutton, eventname, function (event) {
                    if (!isTouchDevice) {
                        if (me._selection().start == 0) {
                            me._setSelectionStart(me.numberInput.val().length);
                        }

                        if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                            me._setSelectionStart(me._inputSelection.start);
                        }
                    }
                    else {
                        event.preventDefault();
                        event.stopPropagation();
                    }

                    me.spinDown();
                    return false;
                });
                this.addHandler(this.upbutton, eventname, function (event) {
                    if (!isTouchDevice) {
                        if (me._selection().start == 0) {
                            me._setSelectionStart(me.numberInput.val().length);
                        }
                        if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                            me._setSelectionStart(me._inputSelection.start);
                        }
                    }
                    else {
                        event.preventDefault();
                        event.stopPropagation();
                    }

                    me.spinUp();
                    return false;
                });
            } else {
                throw new Error("jqxNumberInput: Missing reference to jqxbuttons.js.");
            }
        },

        spinDown: function () {
            var me = this;

            var oldDecimal = this.decimal;

            if (me.spinMode == 'none')
                return;

            if (this.decimal == null) {
                this.setDecimal(0);
                return;
            }

            var isNegative = this.getvalue('negative');
            var negativeOffset = isNegative ? -1 : 0;

            if ($.jqx.mobile.isTouchDevice() || this.inputMode == 'textbox') {
                me._doTouchHandling();
            }

            if (!me.disabled) {
                var selection = this._selection();
                var olddecimal = this.decimal;

                var decimal = this.getDecimal();
                if (decimal < this.min) {
                    decimal = this.min;
                    this.setDecimal(this.min);
                    this._setSelectionStart(selection.start);
                    this.spinDown();
                    return;
                }
                else if (decimal > this.max) {
                    decimal = this.max;
                    this.setDecimal(this.max);
                    this._setSelectionStart(selection.start);
                    this.spinDown();
                    return;
                }

                if (me.spinButtonsStep < 0) me.spinButtonsStep = 1;

                var dec = parseInt(me.decimal) - me.spinButtonsStep;
                dec = dec.toString().length;
                var validvalue = negativeOffset + dec <= me.digits;

                if (me.spinMode != 'advanced') {
                    if (decimal - me.spinButtonsStep >= me.min && validvalue) {
                        var multiple = 1;
                        for (i = 0; i < me.decimalDigits; i++) {
                            multiple = multiple * 10;
                        }

                        var newvalue = (multiple * decimal) - (multiple * me.spinButtonsStep);
                        newvalue = newvalue / multiple;
                        newvalue = this._parseDecimalValueToEditorValue(newvalue);
                        me.setDecimal(newvalue);
                    }
                }
                else {
                    var values = this._getspindecimal();
                    var separator = this._getSeparatorPosition();

                    var decimal = parseFloat(values.decimal);
                    if (me.spinButtonsStep < 0) me.spinButtonsStep = 1;

                    var dec = parseInt(decimal) - me.spinButtonsStep;
                    dec = dec.toString().length;
                    var validvalue = negativeOffset + dec <= me.digits;
                    var multiple = 1;

                    var separatorindex = values.decimal.indexOf(".");
                    if (separatorindex != -1) {
                        var divide = values.decimal.length - separatorindex - 1;
                        var multiple = 1;
                        for (var i = 0; i < divide; i++) {
                            multiple = multiple * 10;
                        }
                        decimal -= new Number(me.spinButtonsStep / multiple);
                        decimal = decimal.toFixed(divide);
                        var separatorindex = decimal.toString().indexOf(".");
                        if (separatorindex == -1) {
                            decimal = decimal.toString() + '.';
                        }
                        var result = decimal.toString() + values.afterdecimal;
                        result = new Number(result);
                        result = result.toFixed(me.decimalDigits);
                        if (result >= me.min) {
                            result = this._parseDecimalValueToEditorValue(result);
                            me.setDecimal(result);
                        }
                    }
                    else {
                        if (decimal - me.spinButtonsStep >= me.min && validvalue) {
                            var newvalue = (multiple * decimal) - (multiple * me.spinButtonsStep);
                            newvalue = newvalue / multiple;
                            var result = newvalue.toString() + values.afterdecimal;
                            if (result >= me.min) {
                                result = this._parseDecimalValueToEditorValue(result);
                                me.setDecimal(result);
                            }
                        }
                    }
                }

                if (result == undefined || this.inputMode != 'simple') {
                    this._setSelectionStart(selection.start);
                    me.savedValue = me.numberInput[0].value;
                    if (oldDecimal != this.decimal) {
                        if ($.jqx.mobile.isTouchDevice()) {
                            this._raiseEvent(0, {});
                        }
                        this._raiseEvent(7, {});
                    }

                    $.jqx.aria(self, "aria-valuenow", this.decimal);
                    return;
                }

                result = this.decimal.toString();
                var isNegative = this.getvalue('negative');
                if (negativeOffset == 0 && isNegative) {
                    this._setSelectionStart(selection.start + 1);
                }
                else {
                    if ((result != undefined && (olddecimal == undefined || olddecimal.toString().length == result.length))) {
                        this._setSelectionStart(selection.start);
                    }
                    else {
                        if (isNegative) {
                            this._setSelectionStart(selection.start + 1);
                        }
                        else {
                            this._setSelectionStart(selection.start - 1);
                        }
                    }
                }
                if (oldDecimal != this.decimal) {
                    if ($.jqx.mobile.isTouchDevice()) {
                        this._raiseEvent(0, {});
                    }
                    this._raiseEvent(7, {});
                }
                $.jqx.aria(self, "aria-valuenow", this.decimal);
            }
        },

        _getspindecimal: function () {
            var selection = this._selection();
            var decimalString = "";
            var separatorPosition = this._getSeparatorPosition();
            var visibleItems = this._getVisibleItems();
            var prefix = this._getHiddenPrefixCount();
            var text = this.numberInput.val();

            if (this.numberInput.val().length == selection.start && selection.length == 0) {
                this._setSelection(selection.start, selection.start + 1);
                selection = this._selection();
            }

            var issimple = this.inputMode != 'advanced';

            for (var i = 0; i < selection.start; i++) {
                if (issimple) {
                    var literal = text.substring(i, i + 1);
                    var isDigit = (!isNaN(parseInt(literal)));
                    if (isDigit) {
                        decimalString += literal;
                    }
                    if (literal == this.decimalSeparator) {
                        decimalString += literal;
                    }
                    continue;
                }

                if (visibleItems[i].canEdit && visibleItems[i].character != this.promptChar) {
                    decimalString += visibleItems[i].character;
                }
                else if (!visibleItems[i].canEdit && this.decimalSeparatorPosition != -1 && visibleItems[i] == visibleItems[this.decimalSeparatorPosition - prefix]) {
                    if (decimalString.length == 0) {
                        decimalString = "0";
                    }

                    decimalString += visibleItems[i].character;
                }

            }

            var afterdecimal = "";
            for (var i = selection.start; i < visibleItems.length; i++) {
                if (issimple) {
                    var literal = text.substring(i, i + 1);
                    var isDigit = (!isNaN(parseInt(literal)));
                    if (isDigit) {
                        afterdecimal += literal;
                    }
                    if (literal == this.decimalSeparator) {
                        afterdecimal += literal;
                    }
                    continue;
                }

                if (visibleItems[i].canEdit && visibleItems[i].character != this.promptChar) {
                    afterdecimal += visibleItems[i].character;
                }
                else if (!visibleItems[i].canEdit && this.decimalSeparatorPosition != -1 && visibleItems[i] == visibleItems[this.decimalSeparatorPosition - prefix]) {
                    afterdecimal += visibleItems[i].character;
                }
            }
            var isNegative = this.getvalue('negative');
            var d = isNegative ? "-" + this._parseDecimalValue(decimalString).toString() : this._parseDecimalValue(decimalString).toString();
            return { decimal: d, afterdecimal: this._parseDecimalValue(afterdecimal) };
        },

        _parseDecimalValue: function (number) {
            if (this.decimalSeparator != '.') {
                var start = number.toString().indexOf(this.decimalSeparator);
                if (start >= 0) {
                    var result = number.toString().substring(0, start) + '.' + number.toString().substring(start + 1);
                    return result;
                }
            }
            return number;
        },

        _parseDecimalValueToEditorValue: function (number) {
            if (this.decimalSeparator != '.') {
                var start = number.toString().indexOf(".");
                if (start >= 0) {
                    var result = number.toString().substring(0, start) + this.decimalSeparator + number.toString().substring(start + 1);
                    return result;
                }
            }
            return number;
        },

        spinUp: function () {
            var me = this;
            var oldDecimal = this.decimal;
            if (me.spinMode == 'none')
                return;

            if (this.decimal == null) {
                this.setDecimal(0);
                return;
            }

            if ($.jqx.mobile.isTouchDevice() || this.inputMode == 'textbox') {
                me._doTouchHandling();
            }

            var isNegative = this.getvalue('negative');
            var negativeOffset = isNegative ? -1 : 0;

            if (!me.disabled) {
                var selection = this._selection();
                var olddecimal = me.decimal;
                var decimal = me.getDecimal();
                if (decimal < this.min) {
                    decimal = this.min;
                    this.setDecimal(this.min);
                    this._setSelectionStart(selection.start);
                    this.spinUp();
                    return;
                }
                else if (decimal > this.max) {
                    decimal = this.max;
                    this.setDecimal(this.max);
                    this._setSelectionStart(selection.start);
                    this.spinUp();
                    return;
                }
                if (me.spinButtonsStep < 0) me.spinButtonsStep = 1;

                var dec = parseInt(me.decimal) + me.spinButtonsStep;
                dec = dec.toString().length;
                var validvalue = negativeOffset + dec <= me.digits;

                if (me.spinMode != 'advanced') {
                    if (decimal + me.spinButtonsStep <= me.max && validvalue) {
                        var multiple = 1;
                        for (var i = 0; i < me.decimalDigits; i++) {
                            multiple = multiple * 10;
                        }

                        var newvalue = (multiple * decimal) + (multiple * me.spinButtonsStep);
                        newvalue = newvalue / multiple;
                        newvalue = this._parseDecimalValueToEditorValue(newvalue);
                        me.setDecimal(newvalue);
                    }
                }
                else {
                    var values = this._getspindecimal();
                    var separator = this._getSeparatorPosition();

                    var decimal = parseFloat(values.decimal);
                    if (me.spinButtonsStep < 0) me.spinButtonsStep = 1;

                    var dec = parseInt(decimal) + me.spinButtonsStep;
                    dec = dec.toString().length;
                    var validvalue = negativeOffset + dec <= me.digits;
                    var multiple = 1;

                    var separatorindex = values.decimal.indexOf(".");
                    if (separatorindex != -1) {
                        var divide = values.decimal.length - separatorindex - 1;
                        var multiple = 1;
                        for (var i = 0; i < divide; i++) {
                            multiple = multiple * 10;
                        }
                        decimal += new Number(me.spinButtonsStep / multiple);
                        decimal = decimal.toFixed(divide);
                        var separatorindex = decimal.toString().indexOf(".");
                        if (separatorindex == -1) {
                            decimal = decimal.toString() + '.';
                        }
                        var result = decimal.toString() + values.afterdecimal;
                        result = new Number(result);
                        result = result.toFixed(me.decimalDigits);
                        var number = new Number(result).toFixed(me.decimalDigits);

                        if (number <= me.max) {
                            result = this._parseDecimalValueToEditorValue(result);
                            me.setDecimal(result);
                        }
                        else result = undefined;
                    }
                    else {
                        if (decimal + me.spinButtonsStep <= me.max && validvalue) {
                            var newvalue = (multiple * decimal) + (multiple * me.spinButtonsStep);

                            newvalue = newvalue / multiple;
                            var result = newvalue.toString() + values.afterdecimal;
                            var number = new Number(result).toFixed(me.decimalDigits);
                            if (number <= me.max) {
                                result = this._parseDecimalValueToEditorValue(result);
                                if (isNegative && result.indexOf('-') == -1) {
                                    if (values.decimal != '-0') {
                                        result = '-' + result;
                                    }
                                }
                                me.setDecimal(result);
                            }
                            else {
                                result = undefined;
                            }
                        }
                    }
                }

                if (result == undefined || this.inputMode != 'simple') {
                    this._setSelectionStart(selection.start);
                    me.savedValue = me.numberInput[0].value;
                    if (oldDecimal != this.decimal) {
                        if ($.jqx.mobile.isTouchDevice()) {
                            this._raiseEvent(0, {});
                        }
                        this._raiseEvent(7, {});
                    }
                    $.jqx.aria(self, "aria-valuenow", this.decimal);
                    return;
                }

                result = this.decimal.toString();
                var isNegative = this.getvalue('negative');
                if (negativeOffset == -1 && !isNegative) {
                    this._setSelectionStart(-1 + selection.start);
                }
                else {
                    if ((result != undefined && (olddecimal == undefined || olddecimal.toString().length == result.length))) {
                        this._setSelectionStart(selection.start);
                    }
                    else {
                        if (isNegative) {
                            this._setSelectionStart(selection.start);
                        }
                        else {
                            this._setSelectionStart(1 + selection.start);
                        }
                    }
                }
                if (oldDecimal != this.decimal) {
                    if ($.jqx.mobile.isTouchDevice()) {
                        this._raiseEvent(0, {});
                    }
                    this._raiseEvent(7, {});
                }
                $.jqx.aria(self, "aria-valuenow", this.decimal);
            }
        },

        _exitSimpleInputMode: function (event, self, checkbounds, oldvalue) {
            if (self == undefined) {
                self = event.data;
            }

            if (self == null) return;

            if (checkbounds == undefined) {
                if (event.target != null && self.element != null) {
                    if ((event.target.id != undefined && event.target.id.toString().length > 0 && self.host.find('#' + event.target.id).length > 0) || event.target == self.element) {
                        return;
                    }
                }

                var offset = self.host.offset();
                var left = offset.left;
                var top = offset.top;
                var width = self.host.width();
                var height = self.host.height();

                var targetOffset = $(event.target).offset();
                if (targetOffset.left >= left && targetOffset.left <= left + width)
                    if (targetOffset.top >= top && targetOffset.top <= top + height) {
                        return;
                    }
            }

            if ($.jqx.mobile.isOperaMiniBrowser()) {
                self.numberInput.attr("readonly", true);
            }

            if (self.disabled || self.readOnly)
                return;

            var enteredMode = $.data(self.numberInput, "simpleInputMode");
            if (enteredMode == null) return;

            $.data(self.numberInput, "simpleInputMode", null);
            this._parseDecimalInSimpleMode();
            return false;
        },

        _getDecimalInSimpleMode: function () {
            var val = this.decimal;
            if (this.decimalSeparator != '.') {
                var indx = val.toString().indexOf(this.decimalSeparator);
                if (indx > 0) {
                    var prefix = val.toString().substring(0, indx);
                    var val = prefix + "." + val.toString().substring(indx + 1);
                }
            }
            return val;
        },

        _parseDecimalInSimpleMode: function (refreshValue) {
            var self = this;
            var isNegative = self.getvalue('negative');
            var decimal = this.ValueString;
            if (decimal == undefined) {
                decimal = this.GetValueString(this.numberInput.val(), this.decimalSeparator, this.decimalSeparator != "");
            }
            if (this.decimalSeparator != '.') {
                var indx = decimal.toString().indexOf(".");
                if (indx > 0) {
                    var prefix = decimal.toString().substring(0, indx);
                    var val = prefix + this.decimalSeparator + decimal.toString().substring(indx + 1);
                    decimal = val;
                }
            }

            var string = isNegative ? "-" : '';
            if (this.symbolPosition == 'left') {
                string += this.symbol;
            }
            var leadingDigitsCount = this.digits % this.groupSize;
            if (leadingDigitsCount == 0) {
                leadingDigitsCount = this.groupSize;
            }

            var decimalString = decimal.toString();
            if (decimalString.indexOf('-') >= 0) {
                decimalString = decimalString.substring(decimalString.indexOf('-') + 1);
            }

            string += decimalString;

            if (this.symbolPosition == 'right') {
                string += this.symbol;
            }

            if (refreshValue != false) {
                self.numberInput.val(string);
            }
        },

        //[optimize]
        _enterSimpleInputMode: function (event, self) {
            if (self == undefined) {
                self = event.data;
            }

            var selection = this._selection();

            if (self == null) return;
            var isNegative = self.getvalue('negative');

            var decimal = self.decimal;
            if (isNegative) {
                if (decimal > 0)
                    decimal = -decimal;
            }

            self.numberInput.val(decimal);
            $.data(self.numberInput, "simpleInputMode", true);

            if ($.jqx.mobile.isOperaMiniBrowser()) {
                self.numberInput.attr("readonly", false);
            }
            this._parseDecimalInSimpleMode();
            this._setSelectionStart(selection.start);
        },

        setvalue: function (name, value) {
            if (this[name] !== undefined) {
                if (name == 'decimal') {
                    this._setDecimal(value);
                }
                else {
                    this[name] = value;
                    this.propertyChangedHandler(this, name, value, value);
                }
            }
        },

        getvalue: function (name) {
            if (name == 'decimal') {
                if (this.negative != undefined && this.negative == true) {
                    return -Math.abs(this[name]);
                }
            }

            if (name in this) {
                return this[name]
            }

            return null;
        },

        // gets the intput's value.
        _getString: function () {
            var s = "";
            for (var i = 0; i < this.items.length; i++) {
                var character = this.items[i].character;
                s += character;
            }

            return s;
        },

        //[optimize]
        _literal: function (letter, regExpression, editable, separator) {
            return { character: letter, regex: regExpression, canEdit: editable, isSeparator: separator };
        },

        //[optimize]
        _initializeLiterals: function () {
            if (this.inputMode == 'textbox') return;
            // add the negative symbol.
            var index = 0;
            var negativeSymbolLength = this.negativeSymbol.length;
            for (var i = 0; i < negativeSymbolLength; i++) {
                var character = this.negativeSymbol.substring(i, i + 1);
                var regex = "";
                var canEdit = false;
                var literal = null;
                if (this.negative) {
                    literal = this._literal(character, regex, canEdit, false);
                }
                else {
                    literal = this._literal('', regex, canEdit, false);
                }

                this.items[index] = literal;
                index++;
            }

            // add the currency or percentage symbol.
            var symbolLength = this.symbol.length;
            if (this.symbolPosition == 'left') {
                for (i = 0; i < symbolLength; i++) {
                    var character = this.symbol.substring(i, i + 1);
                    var regex = "";
                    var canEdit = false;
                    var literal = this._literal(character, regex, canEdit, false);
                    this.items[index] = literal;
                    index++;
                }
            }

            var leadingDigitsCount = this.digits % this.groupSize;
            if (leadingDigitsCount == 0) {
                leadingDigitsCount = this.groupSize;
            }

            // add the digits and group separators.
            for (var i = 0; i < this.digits; i++) {
                var character = this.promptChar;
                var regex = "\\d";
                var canEdit = true;

                var literal = this._literal(character, regex, canEdit, false);
                this.items[index] = literal;
                index++;

                if (i < this.digits - 1 && this.groupSeparator != undefined && this.groupSeparator.length > 0) {
                    leadingDigitsCount--;
                    if (leadingDigitsCount == 0) {
                        leadingDigitsCount = this.groupSize;
                        var separatorLiteral = this._literal(this.groupSeparator, "", false, false);
                        this.items[index] = separatorLiteral;
                        index++;
                    }
                }
                else if (i == this.digits - 1) {
                    literal.character = 0;
                }
            }
            this.decimalSeparatorPosition = -1;

            // add the digits decimal separator and the decimal digits.
            if (this.decimalDigits != undefined && this.decimalDigits > 0) {
                var character = this.decimalSeparator;
                if (character.length == 0) {
                    character = ".";
                }

                var literal = this._literal(character, "", false, true);
                this.items[index] = literal;
                this.decimalSeparatorPosition = index;
                index++;

                for (var i = 0; i < this.decimalDigits; i++) {
                    var decimalCharacter = 0;
                    var regex = "\\d";
                    var decimalDigit = this._literal(decimalCharacter, regex, true, false);
                    this.items[index] = decimalDigit;
                    index++;
                }
            }

            // add the currency or percentage symbol.
            if (this.symbolPosition == 'right') {
                for (var i = 0; i < symbolLength; i++) {
                    var character = this.symbol.substring(i, i + 1);
                    var regex = "";
                    var canEdit = false;
                    var literal = this._literal(character, regex, canEdit);
                    this.items[index] = literal;
                    index++;
                }
            }
        },

        //[optimize]
        _match: function (character, regex) {
            var regExpr = new RegExp(regex, "i");
            return regExpr.test(character);
        },

        //[optimize]
        _raiseEvent: function (id, arg) {
            var evt = this.events[id];
            var args = {};
            args.owner = this;
            if (this.host.css('display') == 'none') {
                return true;
            }

            var key = arg.charCode ? arg.charCode : arg.keyCode ? arg.keyCode : 0;
            var result = true;
            var isreadOnly = this.readOnly;
            var me = this;

            if (id == 3 || id == 2) {
                if (!this.disabled) {
                    if (this.inputMode != 'simple' && this.inputMode != 'textbox') {
                        this._handleMouse(arg);
                    }
                    else {
                        //       this._enterSimpleInputMode(null, me);
                        return true;
                    }
                }
            }

            if (id == 0) {
                var decimalValue = this.getvalue('decimal');
                if ((this.max < decimalValue) || (this.min > decimalValue)) {
                    this.host.addClass(this.toThemeProperty("jqx-input-invalid"));
                }
                else {
                    this.host.removeClass(this.toThemeProperty("jqx-input-invalid"));
                    this.host.addClass(this.toThemeProperty("jqx-input"));
                    this.host.addClass(this.toThemeProperty("jqx-rc-all"));
                }
            }

            var event = new $.Event(evt);
            event.owner = this;
            args.value = this.getvalue('decimal');
            args.text = this.numberInput.val();

            event.args = args;
            if (id == 7) {
                args.type = this.changeType;
                this.changeType = null;
            }
            if (evt != undefined) {
                if (id != 4 && id != 5 && id != 6) {
                    result = this.host.trigger(event);
                }
            }
            var me = this;
            // key down
            if (this.inputMode == 'textbox')
                return result;

            if (this.inputMode != 'simple') {
                if (id == 4) {
                    if (isreadOnly || this.disabled) {
                        return false;
                    }

                    result = me._handleKeyDown(arg, key);
                }
                    // key up
                else if (id == 5) {
                    if (isreadOnly || this.disabled) {
                        result = false;
                    }
                }
                else if (id == 6) {
                    if (isreadOnly || this.disabled) {
                        return false;
                    }
                    result = me._handleKeyPress(arg, key);
                }
            }
            else {
                if (id == 4 || id == 5 || id == 6) {
                    if ($.jqx.mobile.isTouchDevice() || this.touchMode === true) {
                        return true;
                    }

                    if (isreadOnly || this.disabled) {
                        return false;
                    }

                    var letter = String.fromCharCode(key);
                    var digit = parseInt(letter);
                    var allowInput = true;
                    if (!arg.ctrlKey && !arg.shiftKey && !arg.metaKey) {
                        if (key >= 65 && key <= 90) {
                            allowInput = false;
                        }
                    }

                    if (id == 6 && $.jqx.browser.opera != undefined) {
                        if (key == 8)
                            return false;
                    }
                    if (allowInput) {
                        if (id == 4) {
                            allowInput = me._handleSimpleKeyDown(arg, key);
                        }
                        if (key == 189 || key == 45 || key == 109 || key == 173) {
                            var selection = me._selection();
                            if (id == 4) {
                                var isNegative = me.getvalue('negative');
                                if (isNegative == false) {
                                    me.setvalue('negative', true);
                                }
                                else {
                                    me.setvalue('negative', false);
                                }
                                me.decimal = me.ValueString;
                                me._parseDecimalInSimpleMode();
                                me._setSelectionStart(selection.start);
                                allowInput = false;
                                me._raiseEvent(0, me.value);
                                me._raiseEvent(1, me.numberInput.val());
                            }
                        }

                        var ctrlKey = args.ctrlKey || args.metaKey;
                        if (!$.jqx.browser.msie) {
                            var e = arg;
                            if ((ctrlKey && key == 99 /* firefox */) || (ctrlKey && key == 67) /* opera */ ||
                                  (ctrlKey && key == 122 /* firefox */) || (ctrlKey && key == 90) /* opera */ ||
                                  (ctrlKey && key == 118 /* firefox */) || (ctrlKey && key == 86) /* opera */ || (e.shiftKey && key == 45)) {
                                if ($.jqx.browser.webkit || $.jqx.browser.chrome) {
                                    me._handleSimpleKeyDown(arg, key);
                                }
                                if (key == 67)
                                    return true;
                                return false;
                            }
                        }

                        if ((ctrlKey && key == 97 /* firefox */) || (ctrlKey && key == 65) /* opera */) {
                            return true;
                        }

                        if (id == 6 && allowInput) {
                            var specialKey = this._isSpecialKey(key);
                            return specialKey;
                        }
                    }

                    return allowInput;
                }
            }

            return result;
        },

        GetSelectionInValue: function (selectionPosition, text, separator, hasSeparator) {
            var selectionInValue = 0;

            for (i = 0; i < text.length; i++) {
                if (i >= selectionPosition)
                    break;

                var literal = text.substring(i, i + 1);
                var isDigit = (!isNaN(parseInt(literal)));

                if (isDigit || (hasSeparator && text.substring(i, i + 1) == separator)) {
                    selectionInValue++;
                }
            }

            return selectionInValue;
        },

        GetSelectionLengthInValue: function (selectionPosition, selectionLength, text, separator) {
            var selectionInValue = 0;

            for (i = 0; i < text.length; i++) {
                if (i >= selectionPosition + selectionLength)
                    break;

                var literal = text.substring(i, i + 1);
                var isDigit = (!isNaN(parseInt(literal)));

                if (selectionLength > 0 && i >= selectionPosition && isDigit || (i >= selectionPosition && text[i].toString() == separator)) {
                    selectionInValue++;
                }
            }

            return selectionInValue;
        },

        GetInsertTypeByPositionInValue: function (positionInValue, separator, text, hasSeparator) {
            var insertType = "before";
            var valueString = this.GetValueString(text, separator, hasSeparator);
            var digitsToSeparator = this.GetDigitsToSeparator(0, valueString, separator);

            if (positionInValue > digitsToSeparator) {
                insertType = 'after';
            }

            return insertType;
        },

        RemoveRange: function (start, length, text, separatorChar, updateText, insert) {
            var decimalPossibleChars = this.digits;
            var selectionStart = start;
            var selectionLength = length;
            var removedDigits = 0;
            var value = this.decimal;
            var selection = this._selection();
         //   var text = this.numberInput.val();
            var separatorChar = this.decimalSeparator;
            var hasSeparator = separatorChar != '';

            if (selectionLength == 0 && this.ValueString.length < this.decimalPossibleChars - 1)
                return removedDigits;

            var separatorPosition = this.GetSeparatorPositionInText(separatorChar, text);

            if (!updateText) {
                separatorPosition = this.GetSeparatorPositionInText(separatorChar, text);
            }

            if (separatorPosition < 0 && !hasSeparator && text.length > 1) {
                separatorPosition = text.length;
            }

            if (separatorPosition == -1)
                separatorPosition = text.length;

            var separatorOffset = hasSeparator ? 1 : 0;

            if (length < 2 && insert == true) {
                var valueDigits = this.ValueString.length - this.decimalDigits - separatorOffset;
                if ((valueDigits) == decimalPossibleChars && start + length < separatorPosition) {
                    selectionLength++;
                }
            }


            var newTextString = "";
            for (var i = 0; i < text.length; i++) {
                if (i < selectionStart || i >= selectionStart + selectionLength) {
                    newTextString += text.substring(i, i + 1);
                    continue;
                }
                else {
                    var literal = text.substring(i, i + 1);
                    if (literal == separatorChar) {
                        newTextString += separatorChar;
                        continue;
                    }
                    else {
                        var literal = text.substring(i, i + 1);
                        if (this.symbol && this.symbol != "" && this.symbol.indexOf(literal) >= 0)
                            continue;

                        if (i > separatorPosition) {
                            newTextString += "0";
                            continue;
                        }
                    }
                }

                var literal = text.substring(i, i + 1);
                var isDigit = (!isNaN(parseInt(literal)));

                if (isDigit) {
                    removedDigits++;
                }
            }

            if (newTextString.length == 0) {
                newTextString = "0";
            }

            if (updateText) {
                this.numberInput.val(newTextString);
            }
            else {
                this.ValueString = newTextString;
            }

            var ch = newTextString.substring(0, 1);
            if (ch == separatorChar && isNaN(parseInt(ch))) {
                var res = '0' + newTextString;
                newTextString = res;
            }

            this.ValueString = this.GetValueString(newTextString, separatorChar, hasSeparator);

            this.decimal = this.ValueString;
            this._parseDecimalInSimpleMode();

            this._setSelectionStart(selectionStart);
            return removedDigits;
        },

        InsertDigit: function (digit, position) {
            if (typeof this.digits != 'number') {
                this.digits = parseInt(this.digits);
            }

            if (typeof this.decimalDigits != 'number') {
                this.decimalDigits = parseInt(this.decimalDigits);
            }

            var decimalPossibleChars = 1 + this.digits;

            var selection = this._selection();
            var isNegative = this.getvalue('negative');
            var increased = false;

            if (selection.start == 0 && this.symbol != '' && this.symbolPosition == 'left') {
                this._setSelectionStart(selection.start + 1);
                selection = this._selection();
                increased = true;
            }

            if ((isNegative && increased) || (isNegative && !increased && selection.start == 0)) {
                this._setSelectionStart(selection.start + 1);
                selection = this._selection();
            }

            var selectionChar = this.numberInput.val().substring(selection.start, selection.start + 1);
            var text = this.numberInput.val();
            var separatorChar = this.decimalSeparator;
            var hasSeparator = separatorChar != '' && this.decimalDigits > 0;

            if (selectionChar == this.symbol && this.symbolPosition == 'right') {
                if (this.decimalDigits == 0) {
                    this.ValueString = this.GetValueString(text, separatorChar, hasSeparator);
                    if (this.ValueString.length >= decimalPossibleChars)
                        return;
                }
                else {
                    return;
                }
            }

            this.ValueString = this.GetValueString(text, separatorChar, hasSeparator);
            if (this.ValueString == "") {
                this.ValueString = new Number(0).toFixed(this.decimalDigits);
            }

            var value = this.ValueString;

            if (this.decimalDigits > 0 && position >= value.length) {
                position = value.length - 1;
            }

            var valueChar = '';
            if (position < value.length) {
                valueChar = value.substring(position, position + 1);
            }

            var shouldReplace = false;
            var decrementedPosition = false;

            var type = this.GetInsertTypeByPositionInValue(position, separatorChar, text, hasSeparator);

            if (type == 'after') {
                shouldReplace = true;
            }

            var separatorOffset = hasSeparator ? 1 : 0;

            if (valueChar != separatorChar && (this.ValueString.length - this.decimalDigits - separatorOffset) >= decimalPossibleChars - 1) {
                shouldReplace = true;
            }
            if (valueChar === "0" && this.ValueString.length === 1 && this.decimalDigits === 0) {
                shouldReplace = true;
            }

            var isdecimal = false;

            var separatoroffset = hasSeparator ? 1 : 0;

            if (!shouldReplace && this.ValueString && this.ValueString.length >= this.digits + this.decimalDigits + separatoroffset) {
                return;
            }

            if (shouldReplace && valueChar != separatorChar) {
                if (isdecimal)
                    position++;

                var before = value.substring(0, position);
                if (before.length == value.length) {
                    if (this.ValueString.length >= this.digits + this.decimalDigits + separatoroffset)
                        return;
                }

                var current = digit;
                var after = "";

                if (position + 1 < value.length) {
                    after = value.substring(position + 1);
                }

                var result = before + current + after;
                this.ValueString = result;
            }
            else {
                var before = value.substring(0, position);
                var current = digit;
                var after = value.substring(position);
                var result = before + current + after;

                if (value.substring(0, 1) == '0' && value.substring(1, 2) == separatorChar) {
                    result = current + value.substring(1);
                    if (valueChar == separatorChar) {
                        this._setSelectionStart(selection.start - 1);
                        selection = this._selection();
                    }
                }
                this.ValueString = result;
            }

            if (isNegative) {
                this.decimal = -this.ValueString;
            }
            else this.decimal = this.ValueString;

            this._parseDecimalInSimpleMode();
            var start = selection.start;
            start += 1;

            this._setSelectionStart(start);

            this.value = this.decimal;

            this._raiseEvent(0, this.value);
            this._raiseEvent(1, this.numberInput.val());
        },

        GetStringToSeparator: function (text, separator, hasSeparator) {
            var res = "";
            var pointSeparator = separator;
            var separatorInText = this.GetSeparatorPositionInText(separator, text);
            var newString = text.subString(0, separatorInText);
            res = this.GetValueString(newString, separator, hasSeparator);

            return res;
        },

        GetSeparatorPositionInText: function (separator, text) {
            var decimalPointPos = -1;

            for (i = 0; i < text.length; i++) {
                if (text.substring(i, i + 1) == separator) {
                    decimalPointPos = i;
                    break;
                }
            }
            return decimalPointPos;
        },

        GetValueString: function (text, separator, hasSeparator) {
            var res = "";

            for (var i = 0; i < text.length; i++) {
                var literal = text.substring(i, i + 1);
                var isDigit = (!isNaN(parseInt(literal)));
                if (isDigit) {
                    res += literal;
                }
                if (literal == separator) {
                    res += separator;
                }
            }

            return res;
        },

        Backspace: function () {
            var selection = this._selection();
            var initialselection = this._selection();
            var text = this.numberInput.val();

            if (selection.start == 0 && selection.length == 0)
                return;

            this.isBackSpace = true;

            var literal = text.substring[selection.start, selection.start + 1];
            var isDigit = (!isNaN(parseInt(literal)));
            if (selection.start > 0 && selection.length == 0) {
                this._setSelectionStart(selection.start - 1);
                var selection = this._selection();
            }

            this.Delete();
            this._setSelectionStart(initialselection.start - 1);
            this.isBackSpace = false;
        },

        Delete: function (deleteWithoutSelection) {
            var selection = this._selection();
            var text = this.numberInput.val();
            if (selection.start === 0 && text.substring(0, 1) == "-") {
                this.setvalue('negative', false);
                var selection = this._selection();
                var text = this.numberInput.val();
            }

            var selectionStart = selection.start;
            var selectionLength = selection.length;
            selectionLength = Math.max(selectionLength, 1);

            this.ValueString = this.GetValueString(text, this.decimalSeparator, this.decimalSeparator != '');
            if (selectionStart > this.ValueString.indexOf(this.decimalSeparator) && this.decimalDigits > 0) {
                selectionStart++;
            }
            var offset = 0;
            if (this.symbol)
            {
                if (this.symbolPosition == "left")
                {
                    offset--;
                }
                if (this.negative)
                    offset--;
            }
            this.RemoveRange(selection.start + offset, selectionLength, this.ValueString, ".", false);
            var literal = this.ValueString.substring(0, 1);
            var isDigit = (!isNaN(parseInt(literal)));
            if (!isDigit) {
                this.ValueString = '0' + this.ValueString;
            }
            this.decimal = this.ValueString;
            this._parseDecimalInSimpleMode();
            this._setSelectionStart(selectionStart);
            this.value = this.decimal;
            this._raiseEvent(0, this.value);
            this._raiseEvent(1, this.numberInput.val());
        },

        insertsimple: function (insertion) {
            var selection = this._selection();
            var text = this.numberInput.val();
      
            if (selection.start == text.length && this.decimal != null && this.decimalDigits > 0)
                return;

            var oldValue = this.decimal;

            var separatorChar = this.decimalSeparator;
            this.ValueString = this.GetValueString(text, separatorChar, separatorChar != '');

            var positionInValue = this.GetSelectionInValue(selection.start, text, separatorChar, separatorChar != '');
            var lengthInValue = this.GetSelectionLengthInValue(selection.start, selection.length, text, separatorChar);

            var digitsToSeparator = this.GetDigitsToSeparator(0, this.ValueString, separatorChar);
            var decrementPositionInValue = false;

            if (this.decimalDigits > 0 && positionInValue >= this.ValueString.length) {
                positionInValue--;
            }

            if (this.ValueString == "") {
                this.ValueString = new Number(0).toFixed(this.decimalDigits);
                this.ValueString = this.ValueString.replace(".", separatorChar);
                this.RemoveRange(selection.start, lengthInValue, this.ValueString, separatorChar, false, true);
                this.InsertDigit(insertion, 0, selection);
                return;
            }

            this.RemoveRange(selection.start, lengthInValue, this.ValueString, separatorChar, false, true);
            this.InsertDigit(insertion, positionInValue, selection);
        },

        GetDigitsToSeparator: function (digitsToSeparator, valueString, separator) {
            if (separator == undefined) separator = '.';

            if (valueString.indexOf(separator) < 0) {
                return valueString.length;
            }

            for (i = 0; i < valueString.length; i++) {
                if (valueString.substring(i, i + 1) == separator) {
                    digitsToSeparator = i;
                    break;
                }
            }
            return digitsToSeparator;
        },

        _handleSimpleKeyDown: function (e, key) {
            var selection = this._selection();
            var ctrlKey = e.ctrlKey || e.metaKey;
        
            if ((key == 8 || key == 46) && ctrlKey) {
                this.setDecimal(null);
                return false;
            }

            if (selection.start >= 0 && selection.start < this.items.length) {
                var letter = String.fromCharCode(key);
            }

            if (this.rtl && key == 37) {
                var shift = e.shiftKey;
                var offset = shift ? 1 : 0;
                if (shift) {
                    this._setSelection(selection.start + 1 - offset, selection.start + selection.length + 1);
                }
                else {
                    this._setSelection(selection.start + 1 - offset, selection.start + 1);
                }

                return false;
            }
            else if (this.rtl && key == 39) {
                var shift = e.shiftKey;
                var offset = shift ? 1 : 0;
                if (shift) {
                    this._setSelection(selection.start - 1, selection.length + offset + selection.start - 1);
                }
                else {
                    this._setSelection(selection.start - 1, selection.start - 1);
                }
                return false;
            }

            // handle backspace.
            if (key == 8) {
                this.Backspace();
                return false;
            }

            if (key == 190 || key == 110) {
                var position = this.GetSeparatorPositionInText(this.decimalSeparator, this.numberInput.val());
                if (position != -1) {
                    this._setSelectionStart(position + 1);
                }
                return false;
            }

            if (key == 188) {
                var value = this.numberInput.val();
                for (i = selection.start; i < value.length; i++) {
                    if (value[i] == this.groupSeparator) {
                        this._setSelectionStart(1 + i);
                        break;
                    }
                }

                return false;
            }

            // allow Ctrl+C (copy)
            var ctrlKey = e.ctrlKey || e.metaKey;
            if ((ctrlKey && key == 99 /* firefox */) || (ctrlKey && key == 67) /* opera */) {
                var selection = this._selection();
                var text = "";
                var input = this.numberInput.val();
                if (selection.start > 0 || selection.length > 0) {
                    for (var i = selection.start; i < selection.end; i++) {
                        text += input.substring(i, i + 1);
                    }
                }
                $.data(document.body, "jqxSelection", text);
                if ($.jqx.browser.msie) {
                    window.clipboardData.setData("Text", text);
                }
                else {
                    var me = this;
                    var copyFrom = $('<textarea style="position: absolute; left: -1000px; top: -1000px;"/>');
                    copyFrom.val(text);
                    $('body').append(copyFrom);
                    copyFrom.select();
                    setTimeout(function () {
                        document.designMode = 'off';
                        copyFrom.select();
                        copyFrom.remove();
                        me.focus();
                    }, 100);
                }
                this.savedText = text;
                return true;
            }
            // allow Ctrl+Z (undo)
            if ((ctrlKey && key == 122 /* firefox */) || (ctrlKey && key == 90) /* opera */) return false;
            // allow or deny Ctrl+V (paste), Shift+Ins
            if ((ctrlKey && key == 118 /* firefox */) || (ctrlKey && key == 86) /* opera */
            || (e.shiftKey && key == 45)) {
                if ($.jqx.browser.msie && !this.savedText) {
                    this.savedText = window.clipboardData.getData("Text");
                }
                if (this.savedText != null && this.savedText.length > 0) {
                    this.val(this.savedText);
                    //for (var i = 0; i < this.savedText.length; i++) {
                    //    var digit = parseInt(this.savedText.substring(i, i + 1));
                    //    if (!isNaN(digit)) {
                    //        this.insertsimple(digit);
                    //    }
                    //}
                }
                else {
                    this.val($.data(document.body, "jqxSelection"));
                }
                return false;
            }

            var letter = String.fromCharCode(key);
            var digit = parseInt(letter);
            if (key >= 96 && key <= 105) {
                digit = key - 96;
                key = key - 48;
            }

            if (!isNaN(digit)) {
                var me = this;
                this.insertsimple(digit);

                return false;
            }


            // handle del.
            if (key == 46) {
                this.Delete();
                return false;
            }

            if (key == 38) {
                this.spinUp();
                return false;
            }
            else if (key == 40) {
                this.spinDown();
                return false;
            }

            var specialKey = this._isSpecialKey(key);

            if (!$.jqx.browser.mozilla)
                return true;

            return specialKey;
        },

        //[optimize]
        _getEditRange: function () {
            var start = 0;
            var end = 0;

            for (i = 0; i < this.items.length; i++) {
                if (this.items[i].canEdit) {
                    start = i;
                    break;
                }
            }

            for (i = this.items.length - 1; i >= 0; i--) {
                if (this.items[i].canEdit) {
                    end = i;
                    break;
                }
            }

            return { start: start, end: end }
        },

        //[optimize]
        _getVisibleItems: function () {
            var visibleItems = new Array();
            var k = 0;
            for (i = 0; i < this.items.length; i++) {
                if (this.items[i].character.toString().length > 0) {
                    visibleItems[k] = this.items[i];
                    k++;
                }
            }

            return visibleItems;
        },

        //[optimize]
        _hasEmptyVisibleItems: function () {
            var visibleItems = this._getVisibleItems();
            for (i = 0; i < visibleItems.length; i++) {
                if (visibleItems[i].canEdit && visibleItems[i].character == this.promptChar) {
                    return true;
                }
            }

            return false;
        },

        //[optimize]
        _getFirstVisibleNonEmptyIndex: function () {
            var visibleItems = this._getVisibleItems();
            for (i = 0; i < visibleItems.length; i++) {
                if (visibleItems[i].canEdit && visibleItems[i].character != this.promptChar) {
                    return i;
                }
            }
        },

        //[optimize]
        _handleMouse: function (e, args) {
            var selection = this._selection();
            if (selection.length <= 1) {
                var firstItemIndex = this._getFirstVisibleNonEmptyIndex();
                if (selection.start < firstItemIndex) {
                    this._setSelectionStart(firstItemIndex);
                }
            }
        },

        _insertKey: function (key) {
            this.numberInput[0].focus();
            var letter = String.fromCharCode(key);
            var charDigit = parseInt(letter);
            if (isNaN(charDigit))
                return;

            var emptyDigits = 0;
            for (i = 0; i < this.items.length; i++) {
                if (this.items[i].character.length == 0) {
                    emptyDigits++;
                }
            }

            var selection = this._selection();

            var rootElement = this;
            if (selection.start >= 0 && selection.start <= this.items.length) {
                var selectedTextDeleted = false
                var firstItemIndex = this._getFirstVisibleNonEmptyIndex();
                if (selection.start < firstItemIndex && selection.length == 0) {
                    if (!isNaN(letter) || letter == ' ') {
                        this._setSelectionStart(firstItemIndex);
                        selection = this._selection();
                    }
                }

                var firstEditableIndex = this._getFirstEditableItemIndex();
                var lastEditableIndex = this._getLastEditableItemIndex();
                var visibleItems = this._getVisibleItems();
                $.each(visibleItems, function (i, value) {
                    if (selection.start > i && i != visibleItems.length - 1)
                        return;

                    var item = visibleItems[i];
                    if (i > lastEditableIndex) {
                        item = visibleItems[lastEditableIndex];
                    }

                    if (isNaN(letter) || letter == ' ')
                        return;

                    if (!item.canEdit) {
                        return;
                    }
                    var separatorPosition = rootElement._getSeparatorPosition();

                    if (rootElement._match(letter, item.regex)) {
                        if (!selectedTextDeleted && selection.length > 0) {
                            for (j = selection.start + emptyDigits; j < selection.end + emptyDigits; j++) {
                                if (rootElement.items[j].canEdit) {
                                    if (j > separatorPosition) {
                                        rootElement.items[j].character = '0';
                                    }
                                    else {
                                        rootElement.items[j].character = rootElement.promptChar;
                                    }
                                }
                            }

                            var text = rootElement._getString();
                            //           rootElement.inputValue(text);
                            selectedTextDeleted = true;
                        }

                        var separatorPosition = rootElement._getSeparatorPosition();
                        var hasEmptyItems = rootElement._hasEmptyVisibleItems();
                        if (rootElement.decimal == null) {
                            selection.start = separatorPosition - 1;
                            if (selection.start < 0)
                                selection.start = 0;
                            selection.end = selection.start;
                        }

                        if (selection.start <= separatorPosition && hasEmptyItems) {
                            var limit = i;
                            if (rootElement.decimalSeparatorPosition == -1 && selection.start == separatorPosition) {
                                limit = i + 1;
                            }
                            if (rootElement.decimal == null) {
                                limit = selection.start;
                            }

                            var numberString = "";
                            for (p = 0; p < limit; p++) {
                                if (visibleItems[p].canEdit && visibleItems[p].character != rootElement.promptChar) {
                                    numberString += visibleItems[p].character;
                                }
                            }

                            numberString += letter;
                            var offset = rootElement.decimal < 1 ? 1 : 0;

                            if (selection.start == separatorPosition && rootElement.decimalSeparatorPosition != -1) {
                                numberString += rootElement.decimalSeparator;
                                offset = 0;
                            }


                            for (p = limit + offset; p < visibleItems.length; p++) {
                                if (visibleItems[p].character == rootElement.decimalSeparator && visibleItems[p].isSeparator) {
                                    numberString += visibleItems[p].character;
                                }
                                else if (visibleItems[p].canEdit && visibleItems[p].character != rootElement.promptChar) {
                                    numberString += visibleItems[p].character;
                                }
                            }

                            if (rootElement.decimalSeparator != '.') {
                                numberString = rootElement._parseDecimalValue(numberString);
                            }

                            numberString = parseFloat(numberString).toString();
                            numberString = new Number(numberString);
                            numberString = numberString.toFixed(rootElement.decimalDigits);
                            if (rootElement.decimalSeparator != '.') {
                                numberString = rootElement._parseDecimalValueToEditorValue(numberString);
                            }

                            rootElement.setvalue('decimal', numberString);

                            var text = rootElement._getString();

                            if (selection.end < separatorPosition) {
                                rootElement._setSelectionStart(selection.end + offset);
                            }
                            else {
                                rootElement._setSelectionStart(selection.end);
                            }

                            if (selection.length >= 1) {
                                rootElement._setSelectionStart(selection.end);
                            }

                            if (selection.length == rootElement.numberInput.val().length) {
                                var selectBeforeSeparator = rootElement._moveCaretToDecimalSeparator();
                                var separatorOffset = rootElement.decimalSeparatorPosition >= 0 ? 1 : 0;
                                rootElement._setSelectionStart(selectBeforeSeparator - separatorOffset);
                            }
                        }
                        else {
                            if (selection.start < separatorPosition || selection.start > separatorPosition) {
                                if (rootElement.numberInput.val().length == selection.start && rootElement.decimalSeparatorPosition != -1) {
                                    return false;
                                }
                                else if (rootElement.numberInput.val().length == selection.start && rootElement.decimalSeparatorPosition == -1 && !hasEmptyItems) {
                                    return false;
                                }

                                var numberString = "";
                                var addedSeparator = false;
                                for (p = 0; p < i; p++) {
                                    if (visibleItems[p].canEdit && visibleItems[p].character != rootElement.promptChar) {
                                        numberString += visibleItems[p].character;
                                    }
                                    if (visibleItems[p].character == rootElement.decimalSeparator && visibleItems[p].isSeparator) {
                                        numberString += visibleItems[p].character;
                                        addedSeparator = true;
                                    }
                                }

                                numberString += letter;
                                var offset = rootElement.decimal < 1 ? 1 : 0;

                                if (!addedSeparator && selection.start == separatorPosition - 1) {
                                    numberString += rootElement.decimalSeparator;
                                    addedSeparator = true;
                                }

                                for (p = i + 1; p < visibleItems.length; p++) {
                                    if (!addedSeparator && visibleItems[p].character == rootElement.decimalSeparator && visibleItems[p].isSeparator) {
                                        numberString += visibleItems[p].character;
                                    }
                                    else if (visibleItems[p].canEdit && visibleItems[p].character != rootElement.promptChar) {
                                        numberString += visibleItems[p].character;
                                    }
                                }

                                rootElement.setvalue('decimal', numberString);

                                var text = rootElement._getString();

                                if (rootElement.decimalSeparatorPosition < 0 && item == visibleItems[lastEditableIndex]) {
                                    rootElement._setSelectionStart(i);

                                    return false;
                                }

                                var symbolstartposition = text.indexOf(rootElement.symbol);
                                var sel = !rootElement.getvalue('negative') ? 0 : 1;
                                if (symbolstartposition <= sel) symbolstartposition = text.length;

                                // Do not move caret, if it's after the symbol.
                                if (selection.start < symbolstartposition) {
                                    rootElement._setSelectionStart(i + 1);
                                }
                                else rootElement._setSelectionStart(i);

                                if (selection.length >= 1) {
                                    //             rootElement._setSelectionStart(selection.end);
                                }

                                if (selection.length == rootElement.numberInput.val().length) {
                                    var selectBeforeSeparator = rootElement._moveCaretToDecimalSeparator();
                                    rootElement._setSelectionStart(selectBeforeSeparator - 1);
                                }
                            }
                        }
                        return false;
                    }
                });
            }
        },

        //[optimize]
        _handleKeyPress: function (e, key) {
            var selection = this._selection();
            var rootElement = this;
            var ctrlKey = e.ctrlKey || e.metaKey;
            if ((ctrlKey && key == 97 /* firefox */) || (ctrlKey && key == 65) /* opera */) {
                return true;
            }

            if (key == 8) {
                if (selection.start > 0) {
                    rootElement._setSelectionStart(selection.start);
                }
                return false;
            }

            if (key == 46) {
                if (selection.start < this.items.length) {
                    rootElement._setSelectionStart(selection.start);
                }

                return false;
            }

            if (!$.jqx.browser.mozilla) {
                if (key == 45 || key == 173 || key == 109 || key == 189) {
                    var isNegative = this.getvalue('negative');
                    if (isNegative == false) {
                        this.setvalue('negative', true);
                    }
                    else {
                        this.setvalue('negative', false);
                    }
                }
            }

            if ($.jqx.browser.msie) {
                this._insertKey(key);
            }

            var specialKey = this._isSpecialKey(key);
            return specialKey;
        },

        //[optimize]
        _deleteSelectedText: function () {
            var selection = this._selection();
            var decimalString = "";
            var separatorPosition = this._getSeparatorPosition();
            var visibleItems = this._getVisibleItems();
            var prefix = this._getHiddenPrefixCount();

            if (this.numberInput.val().length == selection.start && selection.length == 0) {
                this._setSelection(selection.start, selection.start + 1);
                selection = this._selection();
            }

            for (i = 0; i < selection.start; i++) {
                if (visibleItems[i].canEdit && visibleItems[i].character != this.promptChar) {
                    decimalString += visibleItems[i].character;
                }
                else if (!visibleItems[i].canEdit && this.decimalSeparatorPosition != -1 && visibleItems[i] == visibleItems[this.decimalSeparatorPosition - prefix]) {
                    if (decimalString.length == 0) {
                        decimalString = "0";
                    }

                    decimalString += visibleItems[i].character;
                }
            }

            for (i = selection.start; i < selection.end; i++) {
                if (i > separatorPosition && this.decimalSeparatorPosition != -1) {
                    if (visibleItems[i].canEdit && visibleItems[i].character != this.promptChar) {
                        decimalString += "0";
                    }
                }
                else if (!visibleItems[i].canEdit && this.decimalSeparatorPosition != -1 && visibleItems[i] == visibleItems[this.decimalSeparatorPosition - prefix]) {
                    if (decimalString.length == 0) {
                        decimalString = "0";
                    }

                    decimalString += visibleItems[i].character;
                }
            }

            for (i = selection.end; i < visibleItems.length; i++) {
                if (visibleItems[i].canEdit && visibleItems[i].character != this.promptChar) {
                    decimalString += visibleItems[i].character;
                }
                else if (!visibleItems[i].canEdit && this.decimalSeparatorPosition != -1 && visibleItems[i] == visibleItems[this.decimalSeparatorPosition - prefix]) {
                    if (decimalString.length == 0) {
                        decimalString = "0";
                    }

                    decimalString += visibleItems[i].character;
                }
            }

            this.setvalue('decimal', decimalString);
            return selection.length > 0;
        },

        _restoreInitialState: function () {
            var suffix = parseInt(this.decimalDigits);

            // add the first digit + the decimal separator.           
            if (suffix > 0) {
                suffix += 2;
            }

            for (k = this.items.length - 1; k > this.items.length - 1 - suffix; k--) {
                if (this.items[k].canEdit && this.items[k].character == this.promptChar) {
                    this.items[k].character = 0;
                }
            }
        },

        clear: function () {
            this.setDecimal(0);
        },

        // clears the decimal value.
        clearDecimal: function () {
            if (this.inputMode == 'textbox') {
                this.numberInput.val();
                return;
            }

            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].canEdit) {
                    this.items[i].character = this.promptChar;
                }
            }

            this._restoreInitialState();
        },

        //[optimize]
        _saveSelectedText: function () {
            var selection = this._selection();
            var text = "";
            var visibleItems = this._getVisibleItems();

            if (selection.start > 0 || selection.length > 0) {
                for (i = selection.start; i < selection.end; i++) {
                    if (visibleItems[i].canEdit && visibleItems[i].character != this.promptChar) {
                        text += visibleItems[i].character;
                    }
                    else if (visibleItems[i].isSeparator) {
                        text += visibleItems[i].character;
                    }
                }
            }
            if ($.jqx.browser.msie) {
                window.clipboardData.setData("Text", text);
            }

            return text;
        },

        _pasteSelectedText: function () {
            var selection = this._selection();
            var text = "";
            var k = 0;

            this.selectedText = $.data(document.body, "jqxSelection");
            if (window.clipboardData) {
                var clipboardText = window.clipboardData.getData("Text");
                if (clipboardText != this.selectedText && clipboardText.length > 0) {
                    this.selectedText = window.clipboardData.getData("Text");
                    if (this.selectedText == null || this.selectedText == undefined)
                        return;
                }
            }
            var newSelection = selection.start;
            var visibleItems = this._getVisibleItems();
            if (this.selectedText != null) {
                for (var t = 0; t < this.selectedText.length; t++) {
                    var number = parseInt(this.selectedText[t]);
                    if (!isNaN(number)) {
                        var numberCode = 48 + number;
                        this._insertKey(numberCode);
                    }
                }
            }
        },

        _getHiddenPrefixCount: function () {
            var length = 0;

            if (!this.negative) {
                length++;
            }

            if (this.symbolPosition == "left") {
                for (i = 0; i < this.symbol.length; i++) {
                    if (this.symbol.substring(i, i + 1) == '') {
                        length++;
                    }
                }
            }
            return length;
        },

        //[optimize]
        _getEditableItem: function () {
            var selection = this._selection();

            for (i = 0; i < this.items.length; i++) {
                if (i < selection.start) {
                    if (this.items[i].canEdit && this.items[i].character != this.promptChar) {
                        return this.items[i];
                    }
                }
            }

            return null;
        },

        //[optimize]
        _getEditableItems: function () {
            var editableItems = new Array();
            var k = 0;

            for (i = 0; i < this.items.length; i++) {
                if (this.items[i].canEdit) {
                    editableItems[k] = this.items[i];
                    k++;
                }
            }

            return editableItems;
        },

        //[optimize]
        _getValidSelectionStart: function (selectionStart) {
            for (i = this.items.length - 1; i >= 0; i--) {
                if (this.items[i].canEdit && this.items[i].character != this.promptChar) {
                    return i;
                }
            }

            return -1;
        },

        //[optimize]
        _getEditableItemIndex: function (afterCaret) {
            var selection = this._selection();
            var prefix = this._getHiddenPrefixCount();
            var visibleItems = this._getVisibleItems();

            var index = selection.start;
            var editableIndex = -1;
            for (i = 0; i < index; i++) {
                if (i < visibleItems.length && visibleItems[i].canEdit) {
                    editableIndex = i + prefix;
                }
            }

            if (editableIndex == -1 && selection.length > 0) {
                index = selection.end;
                for (i = 0; i < index; i++) {
                    if (i < visibleItems.length && visibleItems[i].canEdit) {
                        editableIndex = i + prefix;
                        break;
                    }
                }
            }

            return editableIndex;
        },

        //[optimize]
        _getEditableItemByIndex: function (index) {
            for (k = 0; k < this.items.length; k++) {
                if (k > index) {
                    if (this.items[k].canEdit && this.items[k].character != this.promptChar) {
                        return k;
                    }
                }
            }

            return -1;
        },

        //[optimize]
        _getFirstEditableItemIndex: function () {
            var visibleItems = this._getVisibleItems();
            for (m = 0; m < visibleItems.length; m++) {
                if (visibleItems[m].character != this.promptChar && visibleItems[m].canEdit && visibleItems[m].character != '0')
                    return m;
            }

            return -1;
        },

        //[optimize]
        _getLastEditableItemIndex: function () {
            var visibleItems = this._getVisibleItems();
            for (m = visibleItems.length - 1; m >= 0; m--) {
                if (visibleItems[m].character != this.promptChar && visibleItems[m].canEdit)
                    return m;
            }

            return -1;
        },

        //[optimize]
        _moveCaretToDecimalSeparator: function () {
            for (i = this.items.length - 1; i >= 0; i--) {
                if (this.items[i].character == this.decimalSeparator && this.items[i].isSeparator) {
                    if (!this.negative) {
                        this._setSelectionStart(i);
                        return i;
                    }
                    else {
                        this._setSelectionStart(i + 1);
                        return i;
                    }
                    break;
                }
            }

            return this.numberInput.val().length;
        },

        //[optimize]
        _handleBackspace: function () {
            var selection = this._selection();
            var prefix = this._getHiddenPrefixCount();
            var editableItemIndex = this._getEditableItemIndex() - prefix;
            var firstItemIndex = this._getFirstVisibleNonEmptyIndex();
            var negative = false;
            if (this.negative) {
                negative = true;
                if (firstItemIndex >= editableItemIndex + 1 || selection.start == 0) {
                    this.setvalue("negative", false);
                    if (selection.length == 0) {
                        this._setSelectionStart(selection.start - 1);
                        var selection = this._selection();
                    }
                }
            }

            if (editableItemIndex >= 0) {
                if (selection.length == 0 && editableItemIndex != -1) {
                    this._setSelection(editableItemIndex, editableItemIndex + 1);
                }

                var deleteAfterSeparator = selection.start > this._getSeparatorPosition() + 1 && this.decimalSeparatorPosition > 0;
                if (deleteAfterSeparator) {
                    selection = this._selection();
                }

                var deletedText = this._deleteSelectedText();
                if (selection.length < 1 || deleteAfterSeparator) {
                    this._setSelectionStart(selection.start);
                }
                else if (selection.length >= 1) {
                    this._setSelectionStart(selection.end);
                }

                if (selection.length == this.numberInput.val().length || negative) {
                    var selectBeforeSeparator = this._moveCaretToDecimalSeparator();
                    this._setSelectionStart(selectBeforeSeparator - 1);
                }
            }
            else {
                this._setSelectionStart(selection.start);
            }
        },

        //[optimize]
        _handleKeyDown: function (e, key) {
            var selection = this._selection();
            var ctrlKey = e.ctrlKey || e.metaKey;
       
            if ((key == 8 || key == 46) && ctrlKey) {
                this.setDecimal(null);
                return false;
            }

            if (this.rtl && key == 37) {
                var shift = e.shiftKey;
                var offset = shift ? 1 : 0;
                if (shift) {
                    this._setSelection(selection.start + 1 - offset, selection.start + selection.length + 1);
                }
                else {
                    this._setSelection(selection.start + 1 - offset, selection.start + 1);
                }

                return false;
            }
            else if (this.rtl && key == 39) {
                var shift = e.shiftKey;
                var offset = shift ? 1 : 0;
                if (shift) {
                    this._setSelection(selection.start - 1, selection.length + offset + selection.start - 1);
                }
                else {
                    this._setSelection(selection.start - 1, selection.start - 1);
                }
                return false;
            }

            if ((ctrlKey && key == 97 /* firefox */) || (ctrlKey && key == 65) /* opera */) {
                return true;
            } // allow Ctrl+X (cut)
            if ((ctrlKey && key == 120 /* firefox */) || (ctrlKey && key == 88) /* opera */) {
                this.selectedText = this._saveSelectedText(e);
                $.data(document.body, "jqxSelection", this.selectedText);
                this._handleBackspace();
                return false;
            }
            // allow Ctrl+C (copy)
            if ((ctrlKey && key == 99 /* firefox */) || (ctrlKey && key == 67) /* opera */) {
                this.selectedText = this._saveSelectedText(e);
                $.data(document.body, "jqxSelection", this.selectedText);
                return false;
            }
            // allow Ctrl+Z (undo)
            if ((ctrlKey && key == 122 /* firefox */) || (ctrlKey && key == 90) /* opera */) return false;
            // allow or deny Ctrl+V (paste), Shift+Ins
            if ((ctrlKey && key == 118 /* firefox */) || (ctrlKey && key == 86) /* opera */
            || (e.shiftKey && key == 45)) {
                this._pasteSelectedText();
                return false;
            }
            if (selection.start >= 0 && selection.start < this.items.length) {
                var letter = String.fromCharCode(key);
                var item = this.items[selection.start];
            }

            // handle backspace.
            if (key == 8) {
                this._handleBackspace();
                return false;
            }

            if (key == 190 || key == 110) {
                this._moveCaretToDecimalSeparator();
                return false;
            }

            if (key == 188) {
                var value = this.numberInput.val();
                for (i = selection.start; i < value.length; i++) {
                    if (value[i] == this.groupSeparator) {
                        this._setSelectionStart(1 + i);
                        break;
                    }
                }

                return false;
            }

            if ($.jqx.browser.msie == null) {
                var letter = String.fromCharCode(key);
                var digit = parseInt(letter);
                if (key >= 96 && key <= 105) {
                    digit = key - 96;
                    key = key - 48;
                }

                if (!isNaN(digit)) {
                    var me = this;
                    me._insertKey(key);
                    return false;
                }
            }

            // handle del.
            if (key == 46) {
                var visibleItems = this._getVisibleItems();
                if (selection.start < visibleItems.length) {
                    var offset = visibleItems[selection.start].canEdit == false ? 2 : 1;
                    if (selection.start == 0) {
                        if (this.negative) {
                            this.setvalue("negative", false);
                            if (selection.length == 0) {
                                this._setSelectionStart(0);
                            }
                            var selection = this._selection();
                            if (selection.length == 0) {
                                return false;
                            }
                        }
                    }

                    if (selection.length == 0) {
                        this._setSelection(selection.start + offset, selection.start + offset + selection.length);
                    }

                    this._handleBackspace();

                    if (new Number(this.decimal) < 1 || selection.start > this._getSeparatorPosition()) {
                        this._setSelectionStart(selection.end + offset);
                    }
                    else if (selection.start + 1 < this.decimalSeparatorPosition) {
                        this._setSelectionStart(selection.end + offset);
                    }
                }
                return false;
            }

            if (key == 38) {
                this.spinUp();
                return false;
            }
            else if (key == 40) {
                this.spinDown();
                return false;
            }

            var specialKey = this._isSpecialKey(key);

            if ($.jqx.browser.mozilla) {
                if (key == 45 || key == 173 || key == 109 || key == 189) {
                    var isNegative = this.getvalue('negative');
                    if (isNegative == false) {
                        this.setvalue('negative', true);
                    }
                    else {
                        this.setvalue('negative', false);
                    }
                }
            }

            if (!$.jqx.browser.mozilla)
                return true;

            return specialKey;
        },

        _isSpecialKey: function (key) {
            if (key != 8 /* backspace */ &&
			key != 9 /* tab */ &&
			key != 13 /* enter */ &&
			key != 35 /* end */ &&
			key != 36 /* home */ &&
			key != 37 /* left */ &&
			key != 39 /* right */ &&
			key != 27 /* right */ &&
		    key != 46 /* del */
		    ) {
                return false;
            }

            return true;
        },

        //[optimize]
        _selection: function () {
            try {
                if ('selectionStart' in this.numberInput[0]) {
                    var e = this.numberInput[0];
                    var selectionLength = e.selectionEnd - e.selectionStart;
                    return { start: e.selectionStart, end: e.selectionEnd, length: selectionLength, text: e.value };
                }
                else {
                    var r = document.selection.createRange();
                    if (r == null) {
                        return { start: 0, end: e.value.length, length: 0 }
                    }

                    var re = this.numberInput[0].createTextRange();
                    var rc = re.duplicate();
                    re.moveToBookmark(r.getBookmark());
                    rc.setEndPoint('EndToStart', re);
                    var selectionLength = r.text.length;

                    return { start: rc.text.length, end: rc.text.length + r.text.length, length: selectionLength, text: r.text };
                }
            }
            catch (error) {
                return { start: 0, end: 0, length: 0 };
            }
        },

        selectAll: function () {
            var textbox = this.numberInput;
            setTimeout(function () {
                if ('selectionStart' in textbox[0]) {
                    textbox[0].focus();
                    textbox[0].setSelectionRange(0, textbox[0].value.length);
                }
                else {
                    var range = textbox[0].createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', textbox[0].value.length);
                    range.moveStart('character', 0);
                    range.select();
                }
            }, 10);
        },

        _setSelection: function (start, end) {
            if (this._disableSetSelection == true) return;
            var isTouchDevice = $.jqx.mobile.isTouchDevice();
            if (isTouchDevice || this.touchMode == true)
                return;

            try {
                if ('selectionStart' in this.numberInput[0]) {
                    this.numberInput[0].focus();
                    this.numberInput[0].setSelectionRange(start, end);
                }
                else {
                    var range = this.numberInput[0].createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', start);
                    range.select();
                }
            }
            catch (error) {
            }
        },

        _setSelectionStart: function (start) {
            this._setSelection(start, start);
            $.data(this.numberInput, "selectionstart", start);
        },

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            this._render(false);
        },

        _render: function (refreshValue) {
            var leftBorder = parseInt(this.host.css("border-left-width"));
            var rightBorder = parseInt(this.host.css("border-left-width"));
            var topBorder = parseInt(this.host.css("border-left-width"));
            var bottomBorder = parseInt(this.host.css("border-left-width"));
            this.numberInput.css("padding-top", '0px');
            this.numberInput.css("padding-bottom", '0px');

            this.host.height(this.height);
            this.host.width(this.width);

            var width = this.host.width();
            var height = this.host.height();

            this.numberInput.css({
                "border-left-width": 0,
                "border-right-width": 0,
                "border-bottom-width": 0,
                "border-top-width": 0
            });
            if (isNaN(topBorder))
                topBorder = 1;
            if (isNaN(rightBorder))
                rightBorder = 1;
            if (isNaN(bottomBorder))
                bottomBorder = 1;
            if (isNaN(leftBorder))
                leftBorder = 1;

            this.numberInput.css("text-align", this.textAlign);
            var fontSize = this.numberInput.css("font-size");
            if ("" == fontSize) fontSize = 13;
            this.numberInput.css('height', parseInt(fontSize) + 4 + 'px');
            this.numberInput.css('width', width - 2);

            var top = height - 2 * topBorder - parseInt(fontSize) - 2;
            if (isNaN(top)) top = 0;
            if (top < 0) top = 0;
            if (this.spinButtons && this.spincontainer) {
                width -= parseInt(this.spinButtonsWidth - 2);
                var touchDevice = $.jqx.mobile.isTouchDevice();
                if (!touchDevice && this.touchMode !== true) {
                    this.spincontainer.width(this.spinButtonsWidth);
                    this.upbutton.width(this.spinButtonsWidth + 2);
                    this.downbutton.width(this.spinButtonsWidth + 2);
                    this.upbutton.height('50%');
                    this.downbutton.height('50%');
                    this.spincontainer.width(this.spinButtonsWidth);
                }
                else {
                    this.spincontainer.width(2 * (this.spinButtonsWidth));
                    width -= this.spinButtonsWidth;
                    this.upbutton.height('100%');
                    this.downbutton.height('100%');
                    this.downbutton.css('float', 'left');
                    this.upbutton.css('float', 'right');
                    this.upbutton.width(this.spinButtonsWidth);
                    this.downbutton.width(1 + this.spinButtonsWidth);
                }

                this._upArrow.height('100%');
                this._downArrow.height('100%');
                this.numberInput.css('width', width - 6);
                this.numberInput.css('margin-right', '2px');
            }

            var topPadding = top / 2;

            // fix for MSIE 6 and 7. These browsers double the top padding for some reason...
            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                topPadding = top / 4;
            }

            this.numberInput.css("padding-left", '0px');
            this.numberInput.css("padding-right", '0px');
            this.numberInput.css("padding-top", Math.round(topPadding) + 'px');
            this.numberInput.css("padding-bottom", Math.round(topPadding) + 'px');

            if (refreshValue == undefined || refreshValue == true) {
                this.numberInput.val(this._getString())
                if (this.inputMode != 'advanced') {
                    this._parseDecimalInSimpleMode();
                }
            }
        },

        destroy: function () {
            this._removeHandlers();
            this.host.remove();
        },

        // gets or sets the input's text value including the formatting characters.
        inputValue: function (newValue) {
            if (newValue === undefined) {
                return this._value();
            }

            this.propertyChangedHandler(this, "value", this._value, newValue);
            this._refreshValue();
            return this;
        },

        // gets the input's value.
        _value: function () {
            var value = this.numberInput.val();
            return value;
        },

        val: function (decimal) {
            if (decimal !== undefined && typeof decimal != 'object' || decimal === null) {
                if (decimal === null) {
                    this.setDecimal(null);
                    return;
                }
                else {
                    var value = decimal;
                    value = value.toString();
                    if (value.indexOf(this.symbol) > -1) {
                        // remove currency symbol
                        value = value.replace(this.symbol, "");
                    }

                    var replaceAll = function (text, stringToFind, stringToReplace) {
                        var temp = text;
                        if (stringToFind == stringToReplace) return text;

                        var index = temp.indexOf(stringToFind);
                        while (index != -1) {
                            temp = temp.replace(stringToFind, stringToReplace);
                            index = temp.indexOf(stringToFind)
                        }

                        return temp;
                    }

                    value = replaceAll(value, this.groupSeparator, "");
                    value = value.replace(this.decimalSeparator, ".");

                    var val = "";
                    for (var t = 0; t < value.length; t++) {
                        var ch = value.substring(t, t + 1);
                        if (ch === "-") val += "-";
                        if (ch === ".") val += ".";
                        if (ch.match(/^[0-9]+$/) != null) {
                            val += ch;
                        }
                    }

                    value = val;
                    value = value.replace(/ /g, "");
                    value = new Number(value);

                    this.setDecimal(value);
                }
            }
            else return this.getDecimal();
        },

        getDecimal: function () {
            if (this.decimal == null)
                return null;

            if (this.inputMode == 'simple') {
                this._parseDecimalInSimpleMode(false);
                this.decimal = this._getDecimalInSimpleMode(this.decimal);
            }

            if (this.decimal == "") return 0;

            var isNegative = this.getvalue('negative');
            if (isNegative && this.decimal > 0) {
                return -parseFloat(this.decimal);
            }

            return parseFloat(this.decimal);
        },

        setDecimal: function (value) {
            var currentValue = value;
            if (this.decimalSeparator != '.') {
                if (value === null) {
                    this._setDecimal(value);
                }
                else {
                    var decimalValue = value;
                    if (typeof (value) != "number") {
                        value = value.toString();
                        var separatorIndex = value.indexOf('.');
                        if (separatorIndex != -1) {
                            var prefix = value.substring(0, separatorIndex);
                            var suffix = value.substring(separatorIndex + 1);
                            decimalValue = prefix + "." + suffix;
                            if (prefix.indexOf('-') != -1)
                                prefix = prefix.substring(1);

                            if (this.inputMode != "advanced")
                                value = prefix + "." + suffix;
                            else
                                value = prefix + this.decimalSeparator + suffix;
                        }
                        else {
                            var separatorIndex = value.indexOf(this.decimalSeparator);
                            if (separatorIndex != -1) {
                                var prefix = value.substring(0, separatorIndex);
                                var suffix = value.substring(separatorIndex + 1);
                                decimalValue = prefix + "." + suffix;
                                if (prefix.indexOf('-') != -1)
                                    prefix = prefix.substring(1);
                                if (this.inputMode != "advanced")
                                    value = prefix + "." + suffix;
                                else
                                    value = prefix + this.decimalSeparator + suffix;
                            }
                        }
                    }

                    if (decimalValue < 0)
                        this.setvalue('negative', true);
                    else {
                        this.setvalue('negative', false);
                    }
                    this._setDecimal(value);
                }
            }
            else {
                if (value < 0)
                    this.setvalue('negative', true);
                else {
                    this.setvalue('negative', false);
                }
                if (value === null) {
                    this._setDecimal(value);
                }
                else {
                    this._setDecimal(Math.abs(value));
                }
            }

            if (currentValue == null) {
                this.numberInput.val("");
            }
        },

        // sets the input's decimal value.
        _setDecimal: function (value) {
            if (!this.allowNull && value == null) {
                this.decimal = 0;
                value = 0;
            }

            if (value == null) {
                this.decimal = null;
                this.value = null;
                this.clearDecimal();
                this._refreshValue();
                this.decimal = null;
                this.value = null;
                return;
            }

            if (value.toString().indexOf('e') != -1) {
                value = new Number(value).toFixed(this.decimalDigits).toString();
            }

            this.clearDecimal();
            var decimalString = value.toString();
            var numberPartString = "";
            var decimalPartString = "";
            var addToNumberPart = true;

            if (decimalString.length == 0) {
                decimalString = "0";
            }

            for (var i = 0; i < decimalString.length; i++) {
                if (typeof (value) == "number") {
                    if (decimalString.substring(i, i + 1) == ".") {
                        addToNumberPart = false;
                        continue;
                    }
                }
                else {
                    if (decimalString.substring(i, i + 1) == this.decimalSeparator) {
                        addToNumberPart = false;
                        continue;
                    }
                }
                if (addToNumberPart) {
                    numberPartString += decimalString.substring(i, i + 1);
                }
                else {
                    decimalPartString += decimalString.substring(i, i + 1);
                }
            }

            if (numberPartString.length > 0) {
                numberPartString = parseFloat(numberPartString).toString();
            }

            var digitsBeforeSeparator = this.digits;
            if (digitsBeforeSeparator < numberPartString.length) {
                numberPartString = numberPartString.substr(0, digitsBeforeSeparator);
            }

            var k = 0;
            var separatorPosition = this._getSeparatorPosition();
            var hiddenTextLength = this._getHiddenPrefixCount();
            separatorPosition = separatorPosition + hiddenTextLength;

            for (var i = separatorPosition; i >= 0; i--) {
                if (i < this.items.length && this.items[i].canEdit) {
                    if (k < numberPartString.length) {
                        this.items[i].character = numberPartString.substring(numberPartString.length - k - 1, numberPartString.length - k);
                        k++;
                    }
                }
            }

            k = 0;
            for (var i = separatorPosition; i < this.items.length; i++) {
                if (this.items[i].canEdit) {
                    if (k < decimalPartString.length) {
                        this.items[i].character = decimalPartString.substring(k, k + 1);
                        k++;
                    }
                }
            }

            this._refreshValue();

            if (this.decimalSeparator == '.') {
                this.ValueString = new Number(value).toFixed(this.decimalDigits);
            }
            else {
                var indx = value.toString().indexOf(this.decimalSeparator);
                if (indx > 0) {
                    var prefix = value.toString().substring(0, indx);
                    var val = prefix + "." + value.toString().substring(indx + 1);
                    this.ValueString = new Number(val).toFixed(this.decimalDigits);
                }
                else {
                    this.ValueString = new Number(value).toFixed(this.decimalDigits);
                }
            }

            if (this.inputMode != 'advanced') {
                this._parseDecimalInSimpleMode();
                this._raiseEvent(1, this.ValueString);
            }
            if (this.inputMode == 'textbox') {
                this.decimal = this.ValueString;
                var isNegative = this.getvalue('negative');
                if (isNegative) {
                    this.decimal = "-" + this.ValueString;
                }
            }

            var value = this.val();
            if (value < this.min || value > this.max) {
                this.host.addClass('jqx-input-invalid');
            }
            else {
                this.host.removeClass('jqx-input-invalid');
            }
        },

        //[optimize]
        _getSeparatorPosition: function () {
            var hiddenTextLength = this._getHiddenPrefixCount();
            if (this.decimalSeparatorPosition > 0)
                return this.decimalSeparatorPosition - hiddenTextLength;

            return this.items.length - hiddenTextLength;
        },

        _setTheme: function () {
            this.host.removeClass();
            this.host.addClass(this.toThemeProperty('jqx-input'));
            this.host.addClass(this.toThemeProperty('jqx-rc-all'));
            this.host.addClass(this.toThemeProperty('jqx-widget'));
            this.host.addClass(this.toThemeProperty('jqx-widget-content'));
            this.host.addClass(this.toThemeProperty('jqx-numberinput'));

            if (this.spinButtons) {
                this.downbutton.removeClass();
                this.upbutton.removeClass();
                this.downbutton.addClass(this.toThemeProperty('jqx-scrollbar-button-state-normal'));
                this.upbutton.addClass(this.toThemeProperty('jqx-scrollbar-button-state-normal'));
                this._upArrow.removeClass();
                this._downArrow.removeClass();
                this._upArrow.addClass(this.toThemeProperty('jqx-icon-arrow-up'));
                this._downArrow.addClass(this.toThemeProperty('jqx-icon-arrow-down'));

            }
            this.numberInput.removeClass();
            this.numberInput.addClass(this.toThemeProperty('jqx-input-content'));
        },

        propertiesChangedHandler: function (object, oldValues, newValues)
        {
            if (newValues && newValues.width && newValues.height && Object.keys(newValues).length == 2)
            {
                object._render();
            }
        },

        // sets a property.
        propertyChangedHandler: function (object, key, oldvalue, value) {

           
            if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length == 2)
            {
                return;
            }

            if (key == "template")
            {
                object.upbutton.removeClass(object.toThemeProperty("jqx-" + object.template))
                object.downbutton.removeClass(object.toThemeProperty("jqx-" + object.template))
                object.upbutton.addClass(object.toThemeProperty("jqx-" + object.template))
                object.downbutton.addClass(object.toThemeProperty("jqx-" + object.template))
            }

            if (key == 'digits' || key == 'groupSize' || key == 'decimalDigits')
            {
                if (value < 0) {
                    throw new Exception(this.invalidArgumentExceptions[0]);
                }
            }

            if (key == "placeHolder") {
                object.numberInput.attr('placeholder', object.placeHolder);
            }

            if (key === 'theme') {
                $.jqx.utilities.setTheme(oldvalue, value, object.host);
            }

            if (key == "digits") {
                if (value != oldvalue) {
                    object.digits = parseInt(value);
                }
            }

            if (key == "min" || key == "max") {
                $.jqx.aria(object, "aria-value" + key, value.toString());
                object._refreshValue();
            }

            if (key == "decimalDigits") {
                if (value != oldvalue) {
                    object.decimalDigits = parseInt(value);
                }
            }

            if (key == "decimalSeparator" || key == "digits" || key == "symbol" || key == "symbolPosition" || key == "groupSize" || key == "groupSeparator" || key == "decimalDigits" || key == "negativeSymbol") {
                var decimal = object.decimal;

                if (key == 'decimalSeparator' && value == '') {
                    value = ' ';
                }

                if (oldvalue != value) {
                    var selection = object._selection();
                    object.items = new Array();
                    object._initializeLiterals();
                    object.value = object._getString();
                    object._refreshValue();
                    object._setDecimal(decimal);
                }
            }
            if (key == "rtl") {
                if (object.rtl) {
                    if (object.spincontainer) {
                        object.spincontainer.css('float', 'right');
                        object.spincontainer.css('border-right-width', '1px');
                    }
                    object.numberInput.css('float', 'right');
                }
                else {
                    if (object.spincontainer) {
                        object.spincontainer.css('float', 'right');
                        object.spincontainer.css('border-right-width', '1px');
                    }
                    object.numberInput.css('float', 'left');
                }
            }
            if (key == "spinButtons") {
                if (object.spincontainer) {
                    if (!value) {
                        object.spincontainer.css('display', 'none');
                    }
                    else {
                        object.spincontainer.css('display', 'block');
                    }
                    object._render();
                }
                else {
                    object._spinButtons();
                }
            }
            if (key === "touchMode") {
                object.inputMode = 'textbox';
                object.spinMode = 'simple';

                object.render();
            }
            if (key == "negative" && object.inputMode == 'advanced') {
                var selection = object._selection();
                var offset = 0;

                if (value) {
                    object.items[0].character = object.negativeSymbol[0];
                    offset = 1;
                }
                else {
                    object.items[0].character = "";
                    offset = -1;
                }

                object._refreshValue();
                if (object.isInitialized) {
                    object._setSelection(selection.start + offset, selection.end + offset);
                }
            }

            if (key == "decimal") {
                object.value = value;
                object.setDecimal(value);
            }

            if (key === "value") {
                object.value = value;
                object.setDecimal(value);
                object._raiseEvent(1, value);
            }

            if (key == "textAlign") {
                object.textAlign = value;
                object._render();
            }

            if (key == "disabled") {
                object.numberInput.attr("disabled", value);
                if (object.disabled) {
                    object.host.addClass(object.toThemeProperty('jqx-fill-state-disabled'));
                }
                else {
                    object.host.removeClass(object.toThemeProperty('jqx-fill-state-disabled'));
                }
                $.jqx.aria(object, "aria-disabled", value.toString());
            }

            if (key == "readOnly") {
                object.readOnly = value;
            }

            if (key == "promptChar") {
                for (i = 0; i < object.items.length; i++) {
                    if (object.items[i].character == object.promptChar) {
                        object.items[i].character = value;
                    }
                }

                object.promptChar = value;
            }

            if (key == "width") {
                object.width = value;
                object._render();
            }
            else if (key == "height") {
                object.height = value;
                object._render();
            }
        },

        _value: function () {
            var val = this.value;
            return val;
        },

        _refreshValue: function () {
            var value = this.value;
            var k = 0;

            if (this.inputMode === 'textbox') {
                return;
            }

            this.value = this._getString();
            value = this.value;

            var decimalValue = "";
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];

                if (item.canEdit && item.character != this.promptChar) {
                    decimalValue += item.character;
                }

                if (i == this.decimalSeparatorPosition) {
                    decimalValue += ".";
                }
            }

            this.decimal = decimalValue;

            var hasChange = false;

            if (this.oldValue !== value) {
                this.oldValue = value;
                this._raiseEvent(0, value);
                hasChange = true;
            }

            if (this.inputMode != 'simple') {
                this.numberInput.val(value);
                if (hasChange) {
                    this._raiseEvent(1, value);
                }
            }

            if (value == null) {
                this.numberInput.val("");
            }
        }
    });
})(jqxBaseFramework);

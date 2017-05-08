(function ($) {
    'use strict';

    $.jqx.jqxWidget('jqxFormattedInput', '', {});

    $.extend($.jqx._jqxFormattedInput.prototype, {
        defineInstance: function () {
            var settings = {
                // public properties
                width: null,
                height: null,
                radix: 10, // possible values: 2, 8, 10, 16, "binary", "octal", "decimal", "hexadecimal"
                outputNotation: 'default', // possible values: "default", "exponential", "engineering"
                value: '0',
                min: '-9223372036854775808', // can be set in binary, octal, decimal or hexadecimal numeral system (has to correspond to the radix property)
                max: '9223372036854775807', // can be set in binary, octal, decimal or hexadecimal numeral system (has to correspond to the radix property)
                upperCase: false,
                spinButtons: true,
                spinButtonsStep: 1, // decimal value
                spinButtonsWidth: 18,
                dropDown: false,
                dropDownWidth: null,
                popupZIndex: 20000,
                placeHolder: '',
                roundedCorners: true,
                disabled: false,
                rtl: false,
                readOnly: false,
                textAlign: 'right', // possible values: 'right', 'left', 'center'
                int64: 's', // possible values: false, 's', 'u'
                digits: 8,
                decimalDigits: null,
                decimalSeparator: '.',
                spinMode: 'simple', // possible values: 'simple', 'advanced'

                // internal properties
                _opened: false,
                $popup: document.createElement('ul'),

                // events
                events: ['open', 'close', 'change', 'radixChange', 'valueChanged', 'textChanged']
            };
            $.extend(true, this, settings);
        },

        createInstance: function () {
            var that = this;

            that._IE8 = $.jqx.browser.msie && $.jqx.browser.version < 9;

            if (that.host.css('display') === 'none' || document.body.contains(that.element) === false) {
                that._initiallyHidden = true;
            }

            that._regex = {
                2: new RegExp(/([0-1])/), 8: new RegExp(/([0-7])/), 10: new RegExp(/([0-9\-\+e])/i), 16: new RegExp(/([0-9]|[a-f])/i)
            };

            if (that.int64 !== false) {
                try {
                    BigNumber; //ignore jslint
                } catch (err) {
                    throw new Error('jqxFormattedInput: Missing reference to jqxmath.js');
                }

                that._regex['10'] = new RegExp(/([0-9\-])/);

                if (that.int64 === 's') {
                    // enables signed 64-bit number support
                    that._Long();
                }
            }

            if (that.spinButtonsWidth < 16) {
                that.spinButtonsWidth = 16;
            }
            that._checkStructure();
            that.render();
        },

        render: function () {
            var that = this;

            // sets the internal numeric radix based on the radix property
            that._radixNumber = that._getRadix(that.radix);

            // validation of some properties when int64 is set to false
            if (that.int64 === false) {
                if (that._radixNumber !== 10) {
                    that.radix = 10;
                    that._radixNumber = 10;
                }
                if (that.dropDown === true) {
                    that.dropDown = false;
                }
                if (that.min === '-9223372036854775808') {
                    that.min = Number.NEGATIVE_INFINITY;
                }
                if (that.max === '9223372036854775807') {
                    that.max = Infinity;
                }
            } else {
                if (that.decimalDigits !== null) {
                    that.decimalDigits = null;
                }
                if (that.min === Number.NEGATIVE_INFINITY) {
                    if (that.int64 === 's') {
                        that.min = '-9223372036854775808';
                    } else {
                        that.min = '0';
                    }
                }
                if (that.max === Infinity) {
                    if (that.int64 === 's') {
                        that.max = '9223372036854775807';
                    } else {
                        that.max = '18446744073709551615';
                    }
                }
            }

            if (that.value !== '') {
                if (that.int64 === 's') {
                    // representation of the input value as a 64-bit number
                    that._number = new that.longObj.math.Long.fromString((that.value).toString(), that._radixNumber);
                } else if (that.int64 === 'u') {
                    that._number = that._toBigNumberDecimal(that.value);
                } else if (that.int64 === false) {
                    that._number = Number(that._discardDecimalSeparator(that.value));
                }
            }

            if (that.baseHost) {
                that.host = that.baseHost;
                that.element = that.host[0];
            }

            function appendSpinButtons(child) {
                that._spinButtonsContainerElement = child;
                child.className = that.toThemeProperty('jqx-formatted-input-spin-buttons-container');
                child.style.width = that.spinButtonsWidth + 'px';

                function initSpinButton(element) {
                    element.className = that.toThemeProperty('jqx-fill-state-normal jqx-formatted-input-spin-button');
                    element.style.width = (that.spinButtonsWidth - 1) + 'px';
                    child.appendChild(element);
                }
                that._upbutton = document.createElement('div');
                initSpinButton(that._upbutton);
                that._downbutton = document.createElement('div');
                initSpinButton(that._downbutton);

                // arrows
                function initArrow(element, parent, which) {
                    element.setAttribute('unselectable', 'on');
                    element.className = that.toThemeProperty('jqx-input-icon jqx-formatted-input-icon jqx-icon-arrow-' + which);
                    parent.appendChild(element);
                }
                that._upArrow = document.createElement('div');
                initArrow(that._upArrow, that._upbutton, 'up');
                that._downArrow = document.createElement('div');
                initArrow(that._downArrow, that._downbutton, 'down');

                if (that.int64 === 's') {
                    that._spinButtonsStepObject = new that.longObj.math.Long.fromNumber(that.spinButtonsStep);
                } else if (that.int64 === 'u') {
                    that._spinButtonsStepObject = new BigNumber(that.spinButtonsStep); //ignore jslint
                } else if (that.int64 === false) {
                    that._spinButtonsStepObject = Number(that.spinButtonsStep);
                }
            }

            function appendAddon(child) {
                that._addon = child;
                child.className = that.toThemeProperty('jqx-formatted-input-addon');
                if (!that._arrow) {
                    var arrow = document.createElement('div');
                    arrow.className = that.toThemeProperty('jqx-icon jqx-icon-arrow-down');
                    child.appendChild(arrow);
                    that._arrow = arrow;
                }
            }

            if (this.element.nodeName.toLowerCase() === 'div') {
                this.baseElement = this.element;
                var input = that.element.getElementsByTagName('input')[0];

                if (input) {
                    this.baseHost = $(this.baseElement);
                    var data = this.host.data();
                    this.host = $(input);
                    this.element = input;
                    this.host.data(data);
                    this.baseElement.className = that.toThemeProperty('jqx-widget jqx-input-group');
                    var children = that.baseHost.children();
                    for (var i = 0; i < children.length; i++) {
                        var thisChild = children[i],
                            className = 'jqx-input-group-addon';
                        if (thisChild !== that.element) {
                            className += ' jqx-fill-state-normal';
                        }
                        if (thisChild.nodeName.toLowerCase() === 'div') {
                            if (that.rtl === false) {
                                if (!that._spinButtonsContainerElement && that.spinButtons === true) { // spin buttons
                                    appendSpinButtons(thisChild);
                                } else if (!that._addon && that.dropDown === true && ((i === 2) || (i === 1 && that.spinButtons === false))) { // dropdown arrow
                                    appendAddon(thisChild);
                                }
                            } else {
                                if (!that._addon && that.dropDown === true) { // dropdown arrow
                                    appendAddon(thisChild);
                                    if (that.spinButtons === true) {
                                        className += ' jqx-formatted-input-addon-rtl';
                                    }
                                } else if (!that._spinButtonsContainerElement && that.spinButtons === true && ((i === 1) || (i === 0 && that.dropDown === false))) { // spin buttons
                                    appendSpinButtons(thisChild);
                                    className += ' jqx-formatted-input-spin-buttons-container-rtl';
                                    if (that.dropDown === true && that._addon.className.indexOf('jqx-formatted-input-addon-rtl') === -1) {
                                        that._addon.className += ' ' + that.toThemeProperty('jqx-formatted-input-addon-rtl');
                                    }
                                }
                            }
                        }
                        thisChild.className += ' ' + that.toThemeProperty(className);
                    }
                } else {
                    throw new Error('jqxFormattedInput: Missing <input type="text" /> in the widget\'s HTML structure.');
                }
            }

            if (that._initialized === true) {
                that.removeHandlers();
            }
            this.addHandlers();
            if (that.rtl) {
                that.element.className += ' ' + that.toThemeProperty('jqx-rtl');
            }
            if (that.readOnly === true) {
                that.element.readOnly = true;
            }

            if (that.int64 === 's') {
                if (that._radixNumber !== 10 && that.min.toString() === '-9223372036854775808') {
                    that._minObject = new that.longObj.math.Long.fromNumber(that.min);
                } else {
                    that._setMinMax('min');
                }
                if (that._radixNumber !== 10 && that.max.toString() === '9223372036854775807') {
                    that._maxObject = new that.longObj.math.Long.fromNumber(that.max);
                } else {
                    that._setMinMax('max');
                }
            } else if (that.int64 === 'u') {
                if (that.min === '-9223372036854775808') {
                    that.min = '0';
                }
                if (that.max === '9223372036854775807') {
                    that.max = '18446744073709551615';
                }

                if (that._radixNumber !== 10 && that.min.toString() === '0') {
                    that._minObject = new BigNumber(that.min); //ignore jslint
                } else {
                    that._setMinMax('min');
                }
                if (that._radixNumber !== 10 && that.max.toString() === '18446744073709551615') {
                    that._maxObject = new BigNumber(that.max); //ignore jslint
                } else {
                    that._setMinMax('max');
                }
            } else {
                that._minObject = Number(that._discardDecimalSeparator(that.min));
                that._maxObject = Number(that._discardDecimalSeparator(that.max));
            }

            var outputValue;

            if (that.value !== '' && that.value !== null) {
                if (that.upperCase === true) {
                    that.element.className += ' ' + that.toThemeProperty('jqx-formatted-input-upper-case');
                } else {
                    that.element.className += ' ' + that.toThemeProperty('jqx-formatted-input-lower-case');
                }

                outputValue = that._validateValue(that.value, true);
                that._checkNotation(that.value);
                if (that._radixNumber === 10 && (that.outputNotation === 'exponential' || that.outputNotation === 'engineering')) {
                    if (that._eNotation) {
                        that._number = that._largeExponentialToDecimal(that._number);
                    }
                    outputValue = that._getDecimalNotation(that.outputNotation);
                } else {
                    if (that._eNotation) {
                        that._number = that._largeExponentialToDecimal(that._number);
                        outputValue = that._number;
                    }
                }
                that.element.value = outputValue;
            } else {
                if (that._spinButtonsContainerElement) {
                    that._spinButtonsContainerElement.className += ' ' + that.toThemeProperty('jqx-fill-state-disabled');
                }
            }
            that._checkNotation();

            if (!that._eNotation) {
                that.element.value = that._validateDigits(that.element.value);
                that._handleOutputNotation();
            }
        },

        _addClasses: function () {
            var that = this,
                elementClass = '';

            if (that.dropDown) {
                that.$popup.className = that.toThemeProperty('jqx-popup jqx-input-popup jqx-menu jqx-menu-vertical jqx-menu-dropdown jqx-widget jqx-widget-content');
                if ($.jqx.browser.msie) {
                    that.$popup.className += ' ' + that.toThemeProperty('jqx-noshadow');
                }
            }
            if (that.roundedCorners) {
                if (that.baseHost) {
                    if (that.dropDown) {
                        that.$popup.className += ' ' + that.toThemeProperty('jqx-rc-all');
                    }
                    that.baseElement.className += ' ' + that.toThemeProperty('jqx-rc-all');
                    if (that.rtl === false) {
                        elementClass += ' jqx-rc-l';
                        if (that._addon) {
                            that._addon.className += ' ' + that.toThemeProperty('jqx-rc-r');
                        }
                    } else {
                        elementClass += ' jqx-rc-r';
                        if (that._addon) {
                            that._addon.className += ' ' + that.toThemeProperty('jqx-rc-l');
                        }
                    }
                } else {
                    elementClass += ' jqx-rc-all';
                }
            }

            if (this.disabled) {
                elementClass += ' jqx-fill-state-disabled';
                if (that.baseHost) {
                    if (that._spinButtonsContainerElement) {
                        that._spinButtonsContainerElement.className += ' ' + that.toThemeProperty('jqx-fill-state-disabled');
                    }
                    if (that._addon) {
                        that._addon.className += ' ' + that.toThemeProperty('jqx-fill-state-disabled');
                    }
                }
            }
            that.element.className += ' ' + that.toThemeProperty(elementClass);
        },

        selectAll: function () {
            var textbox = this.host;
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

        selectLast: function () {
            var textbox = this.host;
            this.selectStart(textbox[0].value.length);
        },

        selectFirst: function () {
            this.selectStart(0);
        },

        selectStart: function (index) {
            var textbox = this.host;
            setTimeout(function () {
                if ('selectionStart' in textbox[0]) {
                    textbox[0].focus();
                    textbox[0].setSelectionRange(index, index);
                }
                else {
                    var range = textbox[0].createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', index);
                    range.moveStart('character', index);
                    range.select();
                }
            }, 10);
        },

        focus: function () {
            try {
                var that = this;
                that.element.focus();
                setTimeout(function () {
                    that.element.focus();
                }, 25);

            }
            catch (error) {
            }
        },

        refresh: function (initialRefresh) {
            var that = this;

            that.element.className += ' ' + that.toThemeProperty('jqx-widget-content jqx-input jqx-formatted-input jqx-widget jqx-formatted-input-align-' + that.textAlign);

            if (initialRefresh) {
                this._addClasses();
            }

            if (!this.baseHost) {
                if (this.width) {
                    this.element.style.width = that._toPx(that.width);
                }
                if (this.height) {
                    this.element.style.height = that._toPx(that.height);
                }
            }
            else {
                if (this.width) {
                    this.baseElement.style.width = that._toPx(that.width);
                }
                if (this.height) {
                    this.baseElement.style.height = that._toPx(that.height);
                    var totalWidth = 0,
                        baseElementChildren = that.baseHost.children();

                    for (var i = 0; i < baseElementChildren.length; i++) {
                        var child = baseElementChildren[i];
                        child.style.height = '100%';
                        if (child !== that.element) {
                            totalWidth += child.offsetWidth;
                        }
                    }

                    var pixel = (typeof that.width === 'string' && that.width.indexOf('%') !== -1) ? 1 : 0;
                    if (that._IE8) { // Internet Explorer 8 support
                        var elementStyle = that.element.style;
                        elementStyle.width = (this.baseElement.offsetWidth - totalWidth - pixel) + 'px';
                        if (that._spinButtonsContainerElement) {
                            if (that.rtl === false || that.rtl === true && that._addon) {
                                that._spinButtonsContainerElement.style.borderLeftWidth = '0px';
                            }
                        }

                        if (that._addon) {
                            if (that.rtl === false) {
                                that._addon.style.borderLeftWidth = '0px';
                            } else {
                                if (!that._spinButtonsContainerElement) {
                                    that._addon.style.borderRightWidth = '0px';
                                }
                            }
                        }

                        var elementCurrentStyle = that.element.currentStyle,
                            returnNumericValue = function (value) {
                                if (typeof value === 'string') {
                                    if (value === 'medium') {
                                        return 1;
                                    } else {
                                        return parseInt(value, 10);
                                    }
                                } else {
                                    return value;
                                }
                            },
                            height = Math.max(0, (that.baseElement.offsetHeight - (returnNumericValue(elementCurrentStyle.borderTopWidth) + returnNumericValue(elementCurrentStyle.borderBottomWidth) + returnNumericValue(elementCurrentStyle.paddingTop) + returnNumericValue(elementCurrentStyle.paddingBottom)))) + 'px';

                        elementStyle.lineHeight = height;
                    } else {
                        that.element.style.width = 'calc(100% - ' + (totalWidth + pixel) + 'px)';
                    }
                }
            }

            that.element.disabled = that.disabled;

            if (!that.element.placeholder) {
                this._refreshPlaceHolder();
            }
            if (initialRefresh) {
                that._initialized = true;
            }
        },

        _toPx: function (value) {
            if (typeof value === 'number') {
                return value + 'px';
            } else {
                return value;
            }
        },

        _refreshPlaceHolder: function () {
            if ('placeholder' in this.element && !($.jqx.browser.msie && $.jqx.browser.version < 9)) {
                this.element.placeholder = this.placeHolder;
            } else {
                var that = this;
                if (that.element.value === '') {
                    that.element.value = that.placeHolder;
                }
            }
        },

        destroy: function () {
            this.removeHandlers();
            if (this.baseHost) {
                $.jqx.utilities.resize(this.baseHost, null, true);
                this.baseHost.remove();
            } else {
                this.host.remove();
            }
            if (this.$popup) {
                $(this.$popup).remove();
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            function showOrHideAddon(addon, value) {
                if (value === false) {
                    addon.style.display = 'none';
                    if (object.rtl === true) {
                        if (object.spinButtons === true) {
                            object._spinButtonsContainerElement.className += ' ' + object.toThemeProperty('jqx-formatted-input-spin-buttons-container-rtl-border');
                        }
                        if (object.dropDown === true) {
                            object._removeClass(object._addon, object.toThemeProperty('jqx-formatted-input-addon-rtl'));
                        }
                    }
                } else {
                    addon.style.display = 'block';
                    if (object.rtl === true && object.spinButtons === true && object.dropDown === true) {
                        object._removeClass(object._spinButtonsContainerElement, object.toThemeProperty('jqx-formatted-input-spin-buttons-container-rtl-border'));
                        object._addon.className += ' ' + object.toThemeProperty('jqx-formatted-input-addon-rtl');
                    }
                }

                var addonsWidth = 0;
                if (object.spinButtons) {
                    addonsWidth += object.spinButtonsWidth;
                }
                if (object.dropDown) {
                    addonsWidth += object._addon.offsetWidth;
                }
                if (object._IE8) { // Internet Explorer 8 support
                    object.element.style.width = (object.baseElement.offsetWidth - addonsWidth - (typeof object.width === 'string' && object.width.indexOf('%') !== -1 ? 1 : 0)) + 'px';
                } else {
                    object.element.style.width = 'calc(100% - ' + addonsWidth + 'px)';
                }
            }

            function appendAddon(addon) {
                var element = object.element,
                    newAddon = document.createElement('div');
                if (object.baseHost) { // the initialization element is a div
                    var baseHostChildren = object.baseHost.children(),
                        currentAddon;
                    if (baseHostChildren[1].nodeName.toLowerCase() === 'div' || object.rtl && addon === 'spinButtons') {
                        currentAddon = baseHostChildren[1];
                    } else {
                        currentAddon = baseHostChildren[0];
                    }
                    if ((object.rtl === false && addon === 'spinButtons') || (object.rtl === true && addon === 'dropDown')) {
                        object.baseElement.insertBefore(newAddon, currentAddon);
                    } else {
                        if (object.rtl) {
                            object.baseElement.insertBefore(newAddon, currentAddon);
                        } else {
                            object.baseElement.appendChild(newAddon);
                        }
                    }
                    object.render();
                    var fluidWidth = typeof object.width === 'string' && object.width.indexOf('%') !== -1;
                    if (object._IE8) { // Internet Explorer 8 support
                        object.element.style.width = (object.baseElement.offsetWidth - object.spinButtonsWidth - object._addon.offsetWidth - (fluidWidth ? 1 : 0)) + 'px';
                        if (fluidWidth) {
                            newAddon.style.borderLeftWidth = '0px';
                        }
                    } else {
                        object.element.style.width = object.element.style.width = 'calc(100% - ' + (object.spinButtonsWidth + object._addon.offsetWidth + (fluidWidth ? 1 : 0)) + 'px)';
                    }
                } else { // the initialization element is an input
                    var id = element.id,
                        parent = element.parentNode,
                        sibling = element.nextSibling,
                        wrapper = document.createElement('div');

                    object.element.removeAttribute('id');

                    wrapper.setAttribute('id', id);

                    wrapper.appendChild(element);
                    if (!object.rtl) {
                        wrapper.appendChild(newAddon);
                    } else {
                        wrapper.insertBefore(newAddon, element);
                    }
                    if (sibling) {
                        parent.insertBefore(wrapper, sibling);
                    } else {
                        parent.appendChild(wrapper);
                    }

                    object.baseElement = wrapper;
                    object.baseHost = $(wrapper);

                    var hostData = object.host.data();
                    hostData.jqxFormattedInput.host = object.baseHost;
                    hostData.jqxFormattedInput.element = wrapper;
                    object.baseHost.data(hostData);
                    object.element.style.height = '';

                    object.render();
                    object.refresh();
                }
                object._addClasses();
            }

            if (value !== oldvalue) {
                switch (key) {
                    case 'roundedCorners':
                        if (value) {
                            if (object.baseHost) {
                                if (object.dropDown) {
                                    object.$popup.className += ' ' + object.toThemeProperty('jqx-rc-all');
                                }
                                object.baseElement.className += ' ' + object.toThemeProperty('jqx-rc-all');
                                if (object.rtl === false) {
                                    object.element.className += ' ' + object.toThemeProperty('jqx-rc-l');
                                    if (object._addon) {
                                        object._addon.className += ' ' + object.toThemeProperty('jqx-rc-r');
                                    }
                                } else {
                                    object.element.className += ' ' + object.toThemeProperty('jqx-rc-r');
                                    if (object._addon) {
                                        object._addon.className += ' ' + object.toThemeProperty('jqx-rc-l');
                                    }
                                }
                            } else {
                                object.element.className += ' ' + object.toThemeProperty('jqx-rc-all');
                            }
                        } else {
                            if (object.baseHost) {
                                if (object.dropDown) {
                                    object._removeClass(object.$popup, object.toThemeProperty('jqx-rc-all'));
                                }
                                object._removeClass(object.baseElement, object.toThemeProperty('jqx-rc-all'));
                                if (object.rtl === false) {
                                    object._removeClass(object.element, object.toThemeProperty('jqx-rc-l'));
                                    if (object._addon) {
                                        object._removeClass(object._addon, object.toThemeProperty('jqx-rc-r'));
                                    }
                                } else {
                                    object._removeClass(object.element, object.toThemeProperty('jqx-rc-r'));
                                    if (object._addon) {
                                        object._removeClass(object._addon, object.toThemeProperty('jqx-rc-l'));
                                    }
                                }
                            } else {
                                object._removeClass(object.element, object.toThemeProperty('jqx-rc-all'));
                            }
                        }
                        break;
                    case 'placeHolder':
                        object._refreshPlaceHolder();
                        break;
                    case 'theme':
                        $.jqx.utilities.setTheme(oldvalue, value, object.host);
                        break;
                    case 'disabled':
                        if (value) {
                            object.element.className += ' ' + object.toThemeProperty('jqx-fill-state-disabled');
                            if (object.baseHost) {
                                if (object._spinButtonsContainerElement) {
                                    object._spinButtonsContainerElement.className += ' ' + object.toThemeProperty('jqx-fill-state-disabled');
                                }
                                if (object._addon) {
                                    object._addon.className += ' ' + object.toThemeProperty('jqx-fill-state-disabled');
                                }
                            }
                        } else {
                            object._removeClass(object.element, object.toThemeProperty('jqx-fill-state-disabled'));
                            if (object.baseHost && object.value !== '' && object.value !== null) {
                                if (object._spinButtonsContainerElement) {
                                    object._removeClass(object._spinButtonsContainerElement, object.toThemeProperty('jqx-fill-state-disabled'));
                                }
                                if (object._addon) {
                                    object._removeClass(object._addon, object.toThemeProperty('jqx-fill-state-disabled'));
                                }
                            }
                        }
                        object.refresh();
                        break;
                    case 'value':
                        if (oldvalue.toString().toUpperCase() !== value.toString().toUpperCase()) {
                            object.val(value);
                        }
                        break;
                    case 'radix':
                        if (object.int64 !== false) {
                            object._changeRadix(value);
                        } else {
                            object.radix = 10;
                            object._radixNumber = 10;
                        }
                        break;
                    case 'outputNotation':
                        if (object._radixNumber === 10) {
                            var newElementValue;
                            if (value === 'exponential') {
                                newElementValue = object._number.toExponential();
                            } else if (value === 'engineering') {
                                newElementValue = object._getDecimalNotation('engineering');
                            } else {
                                newElementValue = object._number.toString(10);
                            }
                            object.element.value = object._applyDecimalSeparator(newElementValue);
                            object.refresh();
                        }
                        break;
                    case 'min':
                    case 'max':
                        if (object.int64 !== false) {
                            if (key === 'min' && value === Number.NEGATIVE_INFINITY) {
                                if (object.int64 === 's') {
                                    object.min = '-9223372036854775808';
                                } else {
                                    object.min = '0';
                                }
                            } else if (key === 'max' && value === Infinity) {
                                if (object.int64 === 's') {
                                    object.max = '9223372036854775807';
                                } else {
                                    object.max = '18446744073709551615';
                                }
                            }
                        }
                        object._setMinMax(key);
                        object._validateValue(object.value, true);
                        object.value = object.element.value;
                        break;
                    case 'upperCase':
                        if (object.element.value !== '') {
                            if (value === true) {
                                object._removeClass(object.element, object.toThemeProperty('jqx-formatted-input-lower-case'));
                                object.element.className += ' ' + object.toThemeProperty('jqx-formatted-input-upper-case');
                            } else {
                                object._removeClass(object.element, object.toThemeProperty('jqx-formatted-input-upper-case'));
                                object.element.className += ' ' + object.toThemeProperty('jqx-formatted-input-lower-case');
                            }
                        }
                        break;
                    case 'spinButtons':
                        if (object._spinButtonsContainerElement) { // spin buttons are present in the DOM
                            showOrHideAddon(object._spinButtonsContainerElement, value);
                        } else { // spin buttons are not present in the DOM
                            appendAddon('spinButtons');
                        }
                        break;
                    case 'spinButtonsStep':
                        if (object.int64 === 's') {
                            object._spinButtonsStepObject = new object.longObj.math.Long.fromNumber(value);
                        } else if (object.int64 === 'u') {
                            object._spinButtonsStepObject = new BigNumber(value); //ignore jslint
                        } else if (object.int64 === false) {
                            object._spinButtonsStepObject = Number(value);
                        }
                        break;
                    case 'dropDown':
                        if (object.int64 === false) {
                            object.dropDown = false;
                            return;
                        }
                        if (object._addon) { // dropdown button is present in the DOM
                            showOrHideAddon(object._addon, value);
                        } else { // dropdown button is not present in the DOM
                            appendAddon('dropDown');
                        }
                        break;
                    case 'readOnly':
                        if (value === true) {
                            object.host.attr('readonly', true);
                        } else {
                            object.host.removeAttr('readonly');
                        }
                        break;
                    case 'textAlign':
                        object._removeClass(object.element, object.toThemeProperty('jqx-formatted-input-align-' + oldvalue));
                        object.element.className += ' ' + object.toThemeProperty('jqx-formatted-input-align-' + value);
                        break;
                    case 'spinButtonsWidth':
                        if (value < 16) {
                            object.spinButtonsWidth = 16;
                            value = 16;
                        }
                        object._spinButtonsContainerElement.style.width = value + 'px';
                        object._upbutton.style.width = (value - 1) + 'px';
                        object._downbutton.style.width = (value - 1) + 'px';
                        object.refresh();
                        break;
                    case 'digits':
                        object.element.value = object._validateDigits(object.element.value);
                        object.refresh();
                        break;
                    case 'decimalDigits':
                        if (object.int64 === false) {
                            object.element.value = object._validateDigits(object.element.value);
                        } else {
                            object.decimalDigits = null;
                        }
                        object.refresh();
                        break;
                    case 'decimalSeparator':
                        var number = object._discardDecimalSeparator(object.element.value, oldvalue);
                        object.element.value = object._applyDecimalSeparator(number);
                        object.refresh();
                        break;
                    default:
                        object.refresh();
                }
            }
        },

        select: function (event, ui, radix) {
            var that = this;

            if (!radix) {
                radix = that._find('jqx-fill-state-pressed', that.$popup).getAttribute('data-value');
            }

            that._changeRadix(parseInt(radix, 10));
            that._setMaxLength(true);
            that.close();
        },

        // sets a decimal numeric value to the widget
        setValue: function (value) {
            var that = this,
                oldValue = that.element.value;
            if (oldValue != value) { //ignore jslint
                that.element.value = value;
                that.value = value;
                that._raiseEvent('4', {
                    'value': value, 'oldValue': oldValue
                }); // valueChanged event
                that._raiseEvent('2', {
                    'value': value, 'oldValue': oldValue, 'radix': that._radixNumber
                }); // change event                
            }
        },

        val: function (value) {
            var that = this;

            if ((value !== undefined || value === '') && !(typeof value === 'object' && $.isEmptyObject(value) === true) && value !== 'binary' && value !== 'octal' && value !== 'decimal' && value !== 'exponential' && value !== 'scientific' && value !== 'engineering' && value !== 'hexadecimal') {
                value = value.toString();
                if (value.toUpperCase() !== that.element.value.toString().toUpperCase()) {
                    var oldValue = that.element.value;
                    if (that.upperCase === true) {
                        value = value.toUpperCase();
                    }
                    var arrayValue = value.split('');
                    for (var i = 0; i < arrayValue.length; i++) {
                        var currentArrayValue = arrayValue[i];
                        // validates the input value
                        if ((!that._regex['' + that._radixNumber + ''].test(currentArrayValue) && currentArrayValue !== that.decimalSeparator) || (that._radixNumber !== 10 && currentArrayValue === that.decimalSeparator)) {
                            return;
                        }
                    }
                    var newValue = that._validateValue(value, true);
                    if (that.int64 === false && (Number(oldValue) === Number(newValue))) {
                        that.element.value = oldValue;
                        return;
                    }
                    that._handleOutputNotation();
                    newValue = that.element.value;
                    that.value = newValue;
                    that._raiseEvent('4', {
                        'value': newValue, 'oldValue': oldValue
                    }); // valueChanged event
                    that._raiseEvent('2', {
                        'value': newValue, 'oldValue': oldValue, 'radix': that._radixNumber
                    }); // change event
                    return newValue;
                } else {
                    return value;
                }
            } else {
                if (value && !(typeof value === 'object' && $.isEmptyObject(value) === true)) {
                    if (that.int64 === false && (value === 'exponential' || value === 'scientific' || value === 'engineering')) {
                        return that._getDecimalNotation(value);
                    } else if (that.int64 !== false && (value === 'binary' || value === 'octal' || value === 'decimal' || value !== 'hexadecimal')) {
                        var radix = that._getRadix(value);
                        return that._number.toString(radix);
                    } else {
                        return that.element.value;
                    }
                } else {
                    return that.element.value;
                }
            }
        },

        // clears the input
        clear: function () {
            var that = this;
            that.val('');
            that._removeClass(that.element, that.toThemeProperty('jqx-formatted-input-upper-case jqx-formatted-input-lower-case'));
            if (that._spinButtonsContainerElement) {
                that._spinButtonsContainerElement.className += ' ' + that.toThemeProperty('jqx-fill-state-disabled');
            }
        },

        // changes the radix (numeral system)
        _changeRadix: function (radix) {
            var that = this;

            var newRadix = that._getRadix(radix);
            var newValue = that.value !== '' ? that._number.toString(newRadix) : '';
            var oldRadix = that.radix;
            var oldValue = that.value;

            that.radix = radix;
            that._radixNumber = newRadix;

            that.element.value = newValue;
            that.value = newValue;

            this._raiseEvent('3', {
                'radix': radix, 'oldRadix': oldRadix, 'value': newValue, 'oldValue': oldValue
            }); // radixChange event
        },

        _raiseEvent: function (id, arg) {
            if (arg === undefined) {
                arg = {
                    owner: null
                };
            }

            var evt = this.events[id];
            arg.owner = this;

            var event = new $.Event(evt);
            event.owner = this;
            event.args = arg;
            if (event.preventDefault) {
                event.preventDefault();
            }

            var result;
            if (this.baseHost) {
                result = this.baseHost.trigger(event);
            } else {
                result = this.host.trigger(event);
            }
            return result;
        },

        open: function () {
            var that = this,
                id = that.baseElement ? that.baseElement.id : that.element.id,
                oldChildren = $(that.$popup).children();

            function mouseenter(e) {
                var previouslyHovered = that._find('jqx-fill-state-pressed', that.$popup);
                if (previouslyHovered) {
                    that._removeClass(previouslyHovered, 'jqx-fill-state-pressed');
                }
                e.currentTarget.className += ' ' + that.toThemeProperty('jqx-fill-state-pressed');
            }

            for (var i = 0; i < oldChildren.length; i++) {
                var oldChild = oldChildren[i];
                that.removeHandler(oldChild, 'mouseenter.jqxFormattedInput' + id);
            }

            that._setPopupOptions();

            that._render(that._popupOptions);

            if ($.jqx.isHidden(this.host)) {
                return;
            }

            var position;
            if (that.baseHost) {
                position = $.extend({
                }, that.baseHost.coord(true), {
                    height: that.baseElement.offsetHeight
                });
            } else {
                position = $.extend({
                }, that.host.coord(true), {
                    height: that.host[0].offsetHeight
                });
            }

            if (!this.$popup.parentElement) {
                var popupId = id + '_popup';
                this.$popup.setAttribute('id', popupId);
                $.jqx.aria(this, 'aria-owns', popupId);
                document.body.appendChild(that.$popup);
            }

            that.$popup.style.position = 'absolute';
            that.$popup.style.zIndex = this.popupZIndex;
            that.$popup.style.top = (position.top + position.height) + 'px';
            that.$popup.style.left = position.left + 'px';
            that.$popup.style.display = 'block';

            var children = $(that.$popup).children(),
                height = 0;
            for (var j = 0; j < children.length; j++) {
                var child = children[j];
                that.addHandler(child, 'mouseenter.jqxFormattedInput' + id, mouseenter);
                height += child.offsetHeight + 1;
            }
            that.$popup.style.height = height + 'px';

            this._opened = true;
            if (that.baseHost) {
                that._addon.className += ' ' + that.toThemeProperty('jqx-fill-state-pressed jqx-combobox-arrow-selected');
                that._arrow.className += ' ' + that.toThemeProperty('jqx-icon-arrow-down-selected');
            }
            this._raiseEvent('0', {
                popup: this.$popup
            }); // open event
            $.jqx.aria(this, 'aria-expanded', true);
            return this;
        },

        close: function () {
            var that = this;

            this.$popup.style.display = 'none';
            this._opened = false;
            if (that.baseHost) {
                that._removeClass(that._addon, that.toThemeProperty('jqx-fill-state-pressed jqx-combobox-arrow-selected'));
                that._removeClass(that._arrow, that.toThemeProperty('jqx-icon-arrow-down-selected'));
            }
            this._raiseEvent('1', {
                popup: this.$popup
            }); // close event
            $.jqx.aria(this, 'aria-expanded', false);
            return this;
        },

        _render: function (items) {
            var that = this,
                $popupHTML = '';

            for (var i = 0; i < items.length; i++) {
                var currentItem = items[i],
                    className = 'jqx-item jqx-menu-item jqx-formatted-input-item',
                    currentRadix;

                switch (i) {
                    case 0:
                        currentRadix = 2;
                        break;
                    case 1:
                        currentRadix = 8;
                        break;
                    case 2:
                        currentRadix = 10;
                        break;
                    case 3:
                        currentRadix = 16;
                        break;
                }
                if (currentRadix === that._radixNumber) {
                    className += ' jqx-fill-state-pressed';
                }
                if (that.rtl) {
                    className += ' jqx-rtl jqx-formatted-input-item-rtl';
                }
                if (that.roundedCorners) {
                    className += ' jqx-rc-all';
                }
                $popupHTML += '<li class="' + that.toThemeProperty(className) + '" data-value="' + currentRadix + '"><a href="#">' + currentItem + '</a></li>';
            }

            that.$popup.innerHTML = $popupHTML;
            if (!this.dropDownWidth) {
                if (that.baseHost) {
                    var pixel = (typeof that.width === 'string' && that.width.indexOf('%') !== -1) ? 1 : 0;
                    this.$popup.style.width = (that.baseElement.offsetWidth - 6 - pixel) + 'px';
                } else {
                    this.$popup.style.width = (that.element.offsetWidth - 6) + 'px';
                }
            }
            else {
                this.$popup.style.width = that.dropDownWidth + 'px';
            }

            return this;
        },

        next: function () {
            var active = this._find('jqx-fill-state-pressed', this.$popup),
                next = active.nextSibling;
            this._removeClass(active, 'jqx-fill-state-pressed');

            if (!next) {
                next = this.$popup.firstChild;
            }

            next.className += ' ' + this.toThemeProperty('jqx-fill-state-pressed');
        },

        prev: function () {
            var active = this._find('jqx-fill-state-pressed', this.$popup),
                prev = active.previousSibling;
            this._removeClass(active, 'jqx-fill-state-pressed');

            if (!prev) {
                prev = this.$popup.lastChild;
            }

            prev.className += ' ' + this.toThemeProperty('jqx-fill-state-pressed');
        },

        addHandlers: function () {
            var that = this,
                id = that.baseElement ? that.baseElement.id : that.element.id;

            this.addHandler(this.host, 'focus.jqxFormattedInput' + id, function () { that.onFocus(); });
            this.addHandler(this.host, 'blur.jqxFormattedInput' + id, function () { that.onBlur(); });
            this.addHandler(this.host, 'keypress.jqxFormattedInput' + id, function (event) { that.keypress(event); });
            this.addHandler(this.host, 'keyup.jqxFormattedInput' + id, function (event) { that.keyup(event); });
            this.addHandler(this.host, 'keydown.jqxFormattedInput' + id, function (event) { that.keydown(event); });
            this.addHandler(this.$popup, 'mousedown.jqxFormattedInput' + id, function (event) { that.click(event); });
            this.addHandler(this.host, 'change.jqxFormattedInput' + id, function (e) {
                e.stopPropagation();
                e.preventDefault();
            });
            this.addHandler(this.host, 'mousewheel.jqxFormattedInput' + id, function (event) {
                if (that.element === document.activeElement) {
                    if (event.wheelDelta > 0) {
                        that._incrementOrDecrement('add');
                    } else {
                        that._incrementOrDecrement('subtract');
                    }
                }
            });

            if (that.baseHost) {
                // spin buttons handlers
                if (that._spinButtonsContainerElement) {
                    that.addHandler(that._upbutton, 'mousedown.jqxFormattedInputSpinButtonUp' + id, function () {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            that._upbutton.className += ' ' + that.toThemeProperty('jqx-fill-state-pressed');
                            that._incrementOrDecrement('add');
                        }
                    });

                    that.addHandler(that._upbutton, 'mouseup.jqxFormattedInputSpinButtonUp' + id, function () {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            that._removeClass(that._upbutton, that.toThemeProperty('jqx-fill-state-pressed'));
                        }
                    });

                    that.addHandler(that._downbutton, 'mousedown.jqxFormattedInputSpinButtonDown' + id, function () {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            that._downbutton.className += ' ' + that.toThemeProperty('jqx-fill-state-pressed');
                            that._incrementOrDecrement('subtract');
                        }
                    });

                    that.addHandler(that._downbutton, 'mouseup.jqxFormattedInputSpinButtonDown' + id, function () {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            that._removeClass(that._downbutton, that.toThemeProperty('jqx-fill-state-pressed'));
                        }
                    });

                    that.addHandler(that._upbutton, 'mouseenter.jqxFormattedInputSpinButtons' + id, function () {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            that._upbutton.className += ' ' + that.toThemeProperty('jqx-fill-state-hover');
                            that._upArrow.className += ' ' + that.toThemeProperty('jqx-icon-arrow-up-hover');
                        }
                    });

                    that.addHandler(that._downbutton, 'mouseenter.jqxFormattedInputSpinButtons' + id, function () {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            that._downbutton.className += ' ' + that.toThemeProperty('jqx-fill-state-hover');
                            that._downArrow.className += ' ' + that.toThemeProperty('jqx-icon-arrow-down-hover');
                        }
                    });

                    that.addHandler(that._upbutton, 'mouseleave.jqxFormattedInputSpinButtons' + id, function () {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            that._removeClass(that._upbutton, that.toThemeProperty('jqx-fill-state-hover'));
                            that._removeClass(that._upArrow, that.toThemeProperty('jqx-icon-arrow-up-hover'));
                        }
                    });

                    that.addHandler(that._downbutton, 'mouseleave.jqxFormattedInputSpinButtons' + id, function () {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            that._removeClass(that._downbutton, that.toThemeProperty('jqx-fill-state-hover'));
                            that._removeClass(that._downArrow, that.toThemeProperty('jqx-icon-arrow-down-hover'));
                        }
                    });

                    that.addHandler(document.body, 'mouseup.jqxFormattedInputSpinButtons' + id, function () {
                        that._removeClass(that._upbutton, that.toThemeProperty('jqx-fill-state-pressed'));
                        that._removeClass(that._downbutton, that.toThemeProperty('jqx-fill-state-pressed'));
                    });
                }

                // dropdown arrow handlers
                if (that._addon) {
                    that.addHandler(that._addon, 'click.jqxFormattedInputAddon' + id, function () {
                        if (!that.disabled) {
                            if (that._opened) {
                                that.close();
                            } else {
                                that.open();
                            }
                        }
                    });
                    that.addHandler(that._addon, 'mouseenter.jqxFormattedInputAddon' + id, function () {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            that._addon.className += ' ' + that.toThemeProperty('jqx-fill-state-hover jqx-combobox-arrow-hover');
                            that._arrow.className += ' ' + that.toThemeProperty('jqx-icon-arrow-down-hover');
                        }
                    });
                    that.addHandler(that._addon, 'mouseleave.jqxFormattedInputAddon' + id, function () {
                        if (!that.disabled && that.value !== '' && that.value !== null) {
                            that._removeClass(that._addon, that.toThemeProperty('jqx-fill-state-hover jqx-combobox-arrow-hover'));
                            that._removeClass(that._arrow, that.toThemeProperty('jqx-icon-arrow-down-hover'));
                        }
                    });
                    that.addHandler(that._addon, 'blur.jqxFormattedInputAddon' + id, function () {
                        if (that._opened && !that.disabled) {
                            that.close();
                        }
                    });
                    that.addHandler(that._arrow, 'blur.jqxFormattedInputAddon' + id, function () {
                        if (that._opened && !that.disabled) {
                            that.close();
                        }
                    });
                }

                // fluid size support for older browsers
                $.jqx.utilities.resize(that.baseHost, function () {
                    if (that._opened === true) {
                        that.close();
                    }

                    var addonsWidth;
                    if (that._IE8) {
                        addonsWidth = 0;
                        if (that.spinButtons) {
                            addonsWidth += that.spinButtonsWidth;
                        }
                        if (that._addon) {
                            addonsWidth += that._addon.offsetWidth;
                        }
                        that.element.style.width = (that.baseElement.offsetWidth - addonsWidth - 1) + 'px';
                        that.element.style.lineHeight = that.baseElement.offsetHeight + 'px';
                    } else {
                        if (that._initiallyHidden === true) {
                            addonsWidth = 0;
                            if (that.spinButtons) {
                                addonsWidth += that.spinButtonsWidth;
                            }
                            if (that.dropDown) {
                                addonsWidth += that._addon.offsetWidth;
                            }
                            that.element.style.width = 'calc(100% - ' + addonsWidth + 'px)';
                            that._initiallyHidden = false;
                        }
                    }
                });

            }
        },

        removeHandlers: function () {
            var that = this,
                id = that.baseElement ? that.baseElement.id : that.element.id;

            this.removeHandler(this.host, 'focus.jqxFormattedInput' + id);
            this.removeHandler(this.host, 'blur.jqxFormattedInput' + id);
            this.removeHandler(this.host, 'keypress.jqxFormattedInput' + id);
            this.removeHandler(this.host, 'keyup.jqxFormattedInput' + id);
            this.removeHandler(this.host, 'keydown.jqxFormattedInput' + id);
            this.removeHandler(this.$popup, 'mousedown.jqxFormattedInput' + id);
            this.removeHandler(this.host, 'mousewheel.jqxFormattedInput' + id);
            that.removeHandler(that.host, 'change.jqxFormattedInput' + id);
            that.removeHandler(that.host, 'mousewheel.jqxFormattedInput' + id);
            if (that.baseHost) {
                if (that._spinButtonsContainerElement) {
                    that.removeHandler(that._upbutton, 'mousedown.jqxFormattedInputSpinButtonUp' + id);
                    that.removeHandler(that._upbutton, 'mouseup.jqxFormattedInputSpinButtonUp' + id);
                    that.removeHandler(that._downbutton, 'mousedown.jqxFormattedInputSpinButtonDown' + id);
                    that.removeHandler(that._downbutton, 'mouseup.jqxFormattedInputSpinButtonDown' + id);
                    that.removeHandler(that._upbutton, 'mouseenter.jqxFormattedInputSpinButtonUp' + id);
                    that.removeHandler(that._downbutton, 'mouseenter.jqxFormattedInputSpinButtonDown' + id);
                    that.removeHandler(that._upbutton, 'mouseleave.jqxFormattedInputSpinButtonUp' + id);
                    that.removeHandler(that._downbutton, 'mouseleave.jqxFormattedInputSpinButtonDown' + id);
                    that.removeHandler(document.body, 'mouseup.jqxFormattedInputSpinButtons' + id);
                }

                if (that._addon) {
                    that.removeHandler(that._addon, 'click.jqxFormattedInputAddon' + id);
                    that.removeHandler(that._addon, 'mouseenter.jqxFormattedInputAddon' + id);
                    that.removeHandler(that._addon, 'mouseleave.jqxFormattedInputAddon' + id);
                    that.removeHandler(that._addon, 'blur.jqxFormattedInputAddon' + id);
                    that.removeHandler(that._arrow, 'blur.jqxFormattedInputAddon' + id);
                }
            }
        },

        move: function (e) {
            if (!this._opened) {
                return;
            }

            switch (e.keyCode) {
                case 9: // tab
                case 13: // enter
                case 27: // escape
                    e.preventDefault();
                    break;

                case 38: // up arrow
                    e.preventDefault();
                    this.prev();
                    break;

                case 40: // down arrow
                    e.preventDefault();
                    this.next();
                    break;
            }

            e.stopPropagation();
        },

        keydown: function (e) {
            var that = this,
        keyCode = !e.charCode ? e.which : e.charCode;

            if (that.readOnly) {
                return false;
            }
            var arr = [40, 38, 9, 13, 27];
            that.suppressKeyPressRepeat = arr.indexOf(e.keyCode) !== -1;
            that.move(e);

            if (keyCode === 40) {
                if (e.altKey === true) { // Alt + Down arrow
                    if (that._addon) {
                        that.onBlur();
                        this.open();
                    }
                } else {
                    that._incrementOrDecrement('subtract');
                }
                return;
            } else if (keyCode === 38) {
                if (e.altKey === true) { // Alt + Up arrow
                    if (that._addon) {
                        this.close();
                    }
                } else {
                    that._incrementOrDecrement('add');
                }
                return;
            }
        },

        keypress: function (event) {
            var that = this,
                key = event.key || String.fromCharCode(event.keyCode);
            that.valChanged = false;

            if ($.jqx.browser.mozilla && (key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown' || key === 'Backspace' || key === 'Delete' || key === 'Home' || key === 'End')) {
                return;
            }

            if (that.suppressKeyPressRepeat || that.readOnly) {
                return;
            }
            that.move(event);

            var enteredValue = that.element.value;

            if (key === that.decimalSeparator) {
                var numberOfDecSeparators = (enteredValue.match(new RegExp('\\' + that.decimalSeparator, 'g')) || []).length;
                if (numberOfDecSeparators > 0) { // no more than one decimal separator character is allowed
                    event.preventDefault();
                    return false;
                }
            } else if (key === 'Enter') {
                return;
            } else if (that._regex[that._radixNumber.toString()].test(key) === true) { // test for allowed characters (based on radix)
                if (key === '+' || key === '-') {
                    if (that.int64 !== false) {
                        if (enteredValue.charAt(0) === '-') {
                            that._minus = false;
                        } else {
                            that._minus = true;
                        }
                        event.preventDefault();
                    } else {
                        var numberOfSigns = (enteredValue.match(/-/g) || []).length + (enteredValue.match(/\+/g) || []).length;
                        if (numberOfSigns > 0 && enteredValue.toLowerCase().indexOf('e') === -1 || numberOfSigns > 1) {
                            event.preventDefault();
                            return false;
                        }
                    }
                } else if (key.toLowerCase() === 'e' && that._radixNumber === 10) { // no more than one e character is allowed
                    var numberOfE = (enteredValue.toLowerCase().match(/e/g) || []).length;
                    if (numberOfE > 0) { // no more than one e character is allowed
                        event.preventDefault();
                        return false;
                    }
                }
            } else {
                if (event.ctrlKey === false) {
                    event.preventDefault();
                    return false;
                } else {
                    return;
                }
            }

            var caretPosition = that._getCaretPosition(),
                oldValue = enteredValue,
                currentValue = oldValue.slice(0, caretPosition) + key + oldValue.slice(caretPosition);
            if (currentValue !== oldValue) {
                that.valChanged = true;
                that.valueChangedOld = oldValue;
                that.valueChangedNew = currentValue;
                //                that._raiseEvent('4', { 'value': currentValue, 'oldValue': oldValue }); // valueChanged event
                //                that._supressValueChangedEvent = true;
                that._raiseEvent('5', {
                    'value': currentValue, 'oldValue': oldValue
                }); // textChanged event
            }
        },

        keyup: function (e) {
            var that = this;
            if (that.valChanged) {
                that._raiseEvent('4', {
                    'value': that.valueChangedNew, 'oldValue': that.valueChangedOld
                }); // valueChanged event
                that._supressValueChangedEvent = true;
            }
            switch (e.keyCode) {
                case 40: // down arrow
                case 38: // up arrow
                case 16: // shift
                case 17: // ctrl
                case 18: // alt
                    break;

                case 9: // tab
                case 13: // enter
                    if (this._opened) {
                        this.select(e, this);
                    }
                    break;

                case 27: // escape
                    if (!this._opened) {
                        return;
                    }
                    this.close();
                    break;

                case 189: // minus
                    if (that.int64 === 's') {
                        if (that._radixNumber === 10) {
                            var newValue = that.element.value.replace(/-/g, '');
                            if (that._minus === true) {
                                that.element.value = '-' + newValue;
                            } else {
                                that.element.value = newValue;
                            }
                        }
                    } else {
                        return;
                    }
                    break;
            }

            e.stopPropagation();
            e.preventDefault();

            if (that.element.value !== '') {
                if (that._spinButtonsContainerElement) {
                    that._removeClass(that._spinButtonsContainerElement, that.toThemeProperty('jqx-fill-state-disabled'));
                }
            } else {
                that._removeClass(that.element, that.toThemeProperty('jqx-formatted-input-upper-case jqx-formatted-input-lower-case'));
                if (that._spinButtonsContainerElement) {
                    that._spinButtonsContainerElement.className += ' ' + that.toThemeProperty('jqx-fill-state-disabled');
                }
            }
        },

        _getCaretPosition: function () {
            var input = this.element,
                CaretPos = 0;
            if (document.selection) {
                input.focus();
                var Sel = document.selection.createRange();
                Sel.moveStart('character', -input.value.length);
                CaretPos = Sel.text.length;
            }
            else if (input.selectionStart || input.selectionStart === '0') {
                CaretPos = input.selectionStart;
            }
            return (CaretPos);
        },

        // sets the caret's position
        _setCaretPosition: function (pos) {
            var input = this.element;
            setTimeout(function () {
                if ('selectionStart' in input) {
                    input.focus();
                    input.setSelectionRange(pos, pos);
                } else {
                    var range = input.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', pos);
                    range.moveStart('character', pos);
                    range.select();
                }
            }, 10);
        },

        onBlur: function () {
            var that = this;
            if (that._opened) {
                that.close();
            }
            that._setMaxLength();

            that._removeClass(that.element, 'jqx-fill-state-focus');
            that._removeClass(that._spinButtonsContainerElement, 'jqx-fill-state-focus');
            that._removeClass(that._addon, 'jqx-fill-state-focus');
            that._change();
            if (that.int64 === false) {
                that.element.value = that._validateDigits(that.element.value);
            }
            that._handleOutputNotation();
            that._checkNotation();

            if (that.upperCase) {
                that.element.className += ' ' + that.toThemeProperty('jqx-formatted-input-upper-case');
            } else {
                that.element.className += ' ' + that.toThemeProperty('jqx-formatted-input-lower-case');
            }
            if ((!('placeholder' in that.element) || ($.jqx.browser.msie && $.jqx.browser.version < 9)) && (that.element.value === '' || that.element.value === that.placeHolder)) {
                that.element.value = that.placeHolder;
            }
        },

        _handleOutputNotation: function () {
            var that = this;
            that._checkNotation();
            if (that.int64 === false) {
                var currentNumber = Number(that._discardDecimalSeparator(that.element.value));
                that._number = currentNumber;
                switch (that.outputNotation) {
                    case 'default':
                        if (that._eNotation) {
                            var inENotation = currentNumber.toString().indexOf('e') !== -1;
                            if (inENotation) {
                                that.element.value = that._largeExponentialToDecimal(currentNumber);
                            } else {
                                that.element.value = that._validateDigits(currentNumber);
                            }
                        }
                        break;
                    case 'exponential':
                        var exponentialValue;
                        if (that._eNotation) {
                            exponentialValue = currentNumber.toExponential();
                        } else {
                            exponentialValue = that._getDecimalNotation('exponential');
                        }
                        that.element.value = that._applyDecimalSeparator(exponentialValue);
                        break;
                    case 'engineering':
                        that.element.value = that._applyDecimalSeparator(that._getDecimalNotation('engineering'));
                        break;
                }
            }
        },

        _largeExponentialToDecimal: function (exponential) {
            var stringExponential = exponential.toString(),
            indexOfE = stringExponential.indexOf('e'),
            mantissa = new BigNumber(stringExponential.slice(0, indexOfE)), //ignore jslint
            exponent = stringExponential.slice(indexOfE + 2),
            sign = stringExponential.slice(indexOfE + 1, indexOfE + 2),
            bigTen = new BigNumber(10), //ignore jslint
            multyplyBy = bigTen.pow(sign + exponent),
                        result;

            result = mantissa.multiply(multyplyBy);

            return result.toString();
        },

        onFocus: function () {
            var that = this;
            that._setMaxLength(true);

            that.element.className += ' ' + that.toThemeProperty('jqx-fill-state-focus');
            if (that._spinButtonsContainerElement) {
                that._spinButtonsContainerElement.className += ' ' + that.toThemeProperty('jqx-fill-state-focus');
            }
            if (that._addon) {
                that._addon.className += ' ' + that.toThemeProperty('jqx-fill-state-focus');
            }
            that._removeClass(that.element, that.toThemeProperty('jqx-formatted-input-upper-case jqx-formatted-input-lower-case'));
            if ((!('placeholder' in that.element) || ($.jqx.browser.msie && $.jqx.browser.version < 9)) && that.element.value === that.placeHolder) {
                that.element.value = '';
            }
        },

        click: function (e) {
            e.stopPropagation();
            e.preventDefault();
            var radix = e.target.getAttribute('data-value');
            this.select(e, this, radix);
        },

        // change event handler
        _change: function () {
            var that = this;

            var oldValue = that.value;
            var newValue = that._validateValue(that.element.value, true);
            that._removeClass(that.element, 'jqx-input-invalid');
            that._removeClass(that._spinButtonsContainerElement, 'jqx-input-invalid');
            that._removeClass(that._addon, 'jqx-input-invalid');
            if (that.int64 === false && (Number(oldValue) === Number(newValue))) {
                return;
            }
            if (newValue.toUpperCase() !== oldValue.toString().toUpperCase()) {
                that._checkNotation();
                if (that._supressValueChangedEvent !== true) {
                    that._raiseEvent('4', {
                        'value': newValue, 'oldValue': oldValue
                    }); // valueChanged event
                } else {
                    that._supressValueChangedEvent = false;
                }
                that._raiseEvent('2', {
                    'value': newValue, 'oldValue': oldValue, 'radix': that._radixNumber
                }); // change event
                that.value = newValue;
            }
        },

        // gets the internal numeric radix based on the radix property
        _getRadix: function (radix) {
            switch (radix) {
                case 10:
                case 'decimal':
                    return 10;
                case 2:
                case 'binary':
                    return 2;
                case 8:
                case 'octal':
                    return 8;
                case 16:
                case 'hexadecimal':
                    return 16;
            }
        },

        // sets the pop-up list radix options
        _setPopupOptions: function () {
            var that = this;

            that._popupOptions = [];

            if (that.value !== '') {
                that._popupOptions.push(that._number.toString(2) + ' <em>(BIN)</em>');
                that._popupOptions.push(that._number.toString(8) + ' <em>(OCT)</em>');
                that._popupOptions.push(that._number.toString(10) + ' <em>(DEC)</em>');
                that._popupOptions.push(that._number.toString(16) + ' <em>(HEX)</em>');
            } else {
                that._popupOptions.push('BIN');
                that._popupOptions.push('OCT');
                that._popupOptions.push('DEC');
                that._popupOptions.push('HEX');
            }
        },

        // validates the current value
        _validateValue: function (value, set) {
            var that = this;
            if (value !== '') {
                var numberToValidate;
                if (that.int64 === 's') {
                    numberToValidate = new that.longObj.math.Long.fromString((value).toString(), that._radixNumber);
                } else if (that.int64 === 'u') {
                    numberToValidate = that._toBigNumberDecimal(value.toString());
                } else if (that.int64 === false) {
                    numberToValidate = Number(that._discardDecimalSeparator(value.toString()));
                }

                if ((that.int64 === 's' && numberToValidate.lessThan(that._minObject)) || (that.int64 === 'u' && numberToValidate.compare(that._minObject) === -1)) {
                    if (set) {
                        that._number = that._minObject;
                        var min = that._minObject.toString(that._radixNumber);
                        if (that._radixNumber === 16 && that.upperCase === true) {
                            min = min.toUpperCase();
                        }
                        that.element.value = min;
                        return min;
                    } else {
                        return false;
                    }
                } else if ((that.int64 === 's' && numberToValidate.greaterThan(that._maxObject)) || (that.int64 === 'u' && numberToValidate.compare(that._maxObject) === 1)) {
                    if (set) {
                        that._number = that._maxObject;
                        var max = that._maxObject.toString(that._radixNumber);
                        if (that._radixNumber === 16 && that.upperCase === true) {
                            max = max.toUpperCase();
                        }
                        that.element.value = max;
                        return max;
                    } else {
                        return false;
                    }
                } else if (that.int64 === false && (numberToValidate < that._minObject || numberToValidate > that._maxObject)) {
                    if (set) {
                        if (numberToValidate < that._minObject) {
                            that._number = that._minObject;
                            that.element.value = that._validateDigits(that._minObject);
                        } else {
                            that._number = that._maxObject;
                            that.element.value = that._validateDigits(that._maxObject);
                        }
                        return that.element.value;
                    } else {
                        return false;
                    }
                } else {
                    if (set) {
                        that._number = numberToValidate;
                        that.element.value = value;
                        return value;
                    } else {
                        return true;
                    }
                }
            } else {
                if (set) {
                    that.element.value = '';
                    return value;
                } else {
                    return true;
                }
            }
        },

        _validateDigits: function (value) {
            var that = this,
                formattedValue;
            value = that._discardDecimalSeparator(value.toString());

            function toNumber(string) {
                if (typeof string === 'number') {
                    return string;
                } else {
                    return parseFloat(string.replace(that.decimalSeparator, '.'));
                }
            }

            if (that.decimalDigits !== null) {
                formattedValue = toNumber(value).toFixed(that.decimalDigits);
            } else {
                formattedValue = Number(toNumber(value).toPrecision(that.digits)).toString();
            }
            return formattedValue.replace('.', that.decimalSeparator);
        },

        // returns the decimal equivalent of a negative binary, octal or hexadecimal number
        _getNegativeDecimal: function (value, radix) {
            var negativeBinary = value;

            if (radix === 8) {
                var threeBits = [];
                for (var i = 0; i < 11; i++) {
                    var threeBit = parseInt(value.charAt(i), 8).toString(2);
                    while (threeBit.length !== 3) {
                        threeBit = '0' + threeBit;
                    }

                    threeBits.push(threeBit);
                }
                negativeBinary = threeBits.join('');
                if (negativeBinary.charAt(0) === '0') {
                    negativeBinary = negativeBinary.slice(1);
                }

            } else if (radix === 16) {
                var bytes = [];
                for (var j = 0; j < 8; j++) {
                    var currentByte = parseInt(value.charAt(j), 16).toString(2);
                    while (currentByte.length !== 4) {
                        currentByte = '0' + currentByte;
                    }

                    bytes.push(currentByte);
                }
                negativeBinary = bytes.join('');
            }

            var negativeDecimal = '';
            for (var k = 0; k < negativeBinary.length; k++) {
                var currentDigit = negativeBinary.charAt(k) === '1' ? '0' : '1';
                negativeDecimal += currentDigit;
            }
            negativeDecimal = (parseInt(negativeDecimal, 2) + 1) * -1;
            return negativeDecimal;
        },

        // sets the input's max length based on the radix
        _setMaxLength: function (focus) {
            var that = this;
            var max;

            if (focus === true && that.int64 !== false) {
                switch (that._radixNumber) {
                    case 2:
                        max = 64;
                        break;
                    case 8:
                        max = 22;
                        break;
                    case 10:
                        max = 20;
                        break;
                    case 16:
                        max = 16;
                        break;
                }
            } else {
                max = 524288; // default value
            }

            that.host.attr('maxlength', max);
        },

        // sets or updates the internal representations of the min and max properties
        _setMinMax: function (key) {
            var that = this;
            if (that.int64 === 's') {
                that['_' + key + 'Object'] = new that.longObj.math.Long.fromString((that[key]).toString(), that._radixNumber);
            } else if (that.int64 === 'u') {
                that['_' + key + 'Object'] = that._toBigNumberDecimal(that[key].toString());
            } else if (that.int64 === false) {
                that['_' + key + 'Object'] = Number(that._discardDecimalSeparator(that[key]));
            }
        },

        // returns a decimal value in a specific notation
        _getDecimalNotation: function (outputNotation) {
            var that = this;

            var value = that._number.toString(10);

            function exponentialToScientific(exponentialValue) {
                var indexOfE = exponentialValue.indexOf('e');
                var power = exponentialValue.slice(indexOfE + 1);
                var scientificValue = exponentialValue.slice(0, indexOfE + 1);
                scientificValue = scientificValue.replace('e', '×10');
                scientificValue += that._toSuperScript(power);
                scientificValue = scientificValue.replace('+', '');

                return scientificValue;
            }

            function exponentialToEngineering(exponentialValue) {
                var indexOfE = exponentialValue.indexOf('e');
                var power = exponentialValue.slice(indexOfE + 1);
                var coefficient = exponentialValue.slice(0, indexOfE);
                var remainderPower = parseInt(power, 10) % 3;

                if (remainderPower === 0) {
                    return exponentialValue;
                }

                coefficient = coefficient * Math.pow(10, remainderPower);
                if (power > 0) {
                    var floatFix = exponentialValue.slice(0, indexOfE).length - remainderPower - 2;
                    if (floatFix >= 0) {
                        coefficient = coefficient.toFixed(floatFix);
                    }
                }

                var finalPower = (parseInt(power, 10) - remainderPower);
                var sign;
                if (finalPower < 0) {
                    sign = '';
                } else {
                    sign = '+';
                }

                if (that.decimalDigits !== undefined) {
                    coefficient = Number(coefficient).toFixed(that.decimalDigits);
                } else if (that.digits !== undefined) {
                    coefficient = Number(Number(coefficient).toPrecision(that.digits)).toString();
                }

                var engineeringValue = coefficient + 'e' + sign + finalPower;

                return engineeringValue;
            }

            var exponentialValue = Number(value).toExponential();
            if (outputNotation === 'scientific') {
                return exponentialToScientific(exponentialValue);
            } else if (outputNotation === 'engineering') {
                return exponentialToEngineering(exponentialValue);
            } else {
                var fractionDigits;
                if (that.decimalDigits !== undefined) {
                    fractionDigits = that.decimalDigits;
                } else if (that.digits !== undefined) {
                    fractionDigits = that.digits - 1;
                }
                if (fractionDigits !== undefined) {
                    exponentialValue = Number(value).toExponential(fractionDigits);
                }
                return exponentialValue;
            }
        },

        // converts a number to superscript
        _toSuperScript: function (value, supToNormal) {
            var chars = '-0123456789';
            var sup = '⁻⁰¹²³⁴⁵⁶⁷⁸⁹';
            var result = '';

            for (var i = 0; i < value.length; i++) {
                if (supToNormal === true) {
                    var m = sup.indexOf(value.charAt(i));
                    result += (m !== -1 ? chars[m] : value[i]);
                } else {
                    var n = chars.indexOf(value.charAt(i));
                    result += (n !== -1 ? sup[n] : value[i]);
                }
            }
            return result;
        },

        // increments or decrements the number in the input
        _incrementOrDecrement: function (func) {
            var that = this,
                focused = that.element === document.activeElement,
                caretPosition,
                negativeInt64 = false;

            if (that.int64 === 'u' && that._number.toString() === '0' && func === 'subtract') {
                return;
            }

            if (focused) {
                caretPosition = that._getCaretPosition();
                that._setCaretPosition(caretPosition);
            }

            if (that.int64 === 's') {
                that._number = new that.longObj.math.Long.fromString(that.element.value, that._radixNumber);
                negativeInt64 = that._number.isNegative();
            } else if (that.int64 === 'u') {
                that._number = that._toBigNumberDecimal(that.element.value);
            } else if (that.int64 === false) {
                that._number = Number(that._discardDecimalSeparator(that.element.value));
            }

            if (that.spinMode === 'simple' || that.spinMode === 'advanced' && focused === false || negativeInt64 === true && that._radixNumber !== 10) { // spinMode: 'simple' behaviour
                if (that.int64 !== false) {
                    that._number = that._number[func](that._spinButtonsStepObject);
                } else {
                    if (func === 'add') {
                        that._number += that._spinButtonsStepObject;
                    } else {
                        that._number -= that._spinButtonsStepObject;
                    }
                }
            } else { // spinMode: 'advanced' behaviour
                if (caretPosition === 0 || isNaN(that.element.value.charAt(caretPosition - 1)) && that.element.value.charAt(caretPosition - 1) !== that.decimalSeparator) { // invalid caret position
                    return;
                }

                var currentValue = that.element.value,
                    power;

                if (that.int64 !== false) {
                    power = currentValue.length - caretPosition;
                    var factor = new BigNumber(that._radixNumber).pow(power); //ignore jslint
                    if (that.int64 === 's') {
                        factor = new that.longObj.math.Long.fromString(factor.toString(), 10);
                    }
                    that._number = that._number[func](that._spinButtonsStepObject.multiply(factor));
                } else {
                    var separatorIndex = currentValue.indexOf(that.decimalSeparator),
                        eFactor = 1,
                        ePower = 0,
                        eIndex;

                    if (that._eNotation === true) {
                        eIndex = currentValue.toLowerCase().indexOf('e');
                        ePower = Number(currentValue.slice(eIndex + 1));
                        eFactor = Math.pow(10, ePower);
                    }

                    if (separatorIndex === -1) {
                        if (!that._eNotation) {
                            power = currentValue.length - caretPosition;
                        } else {
                            power = currentValue.slice(0, eIndex).length - caretPosition;
                        }
                    } else {
                        if (caretPosition - 1 <= separatorIndex) { // caret is in the whole part
                            if (caretPosition >= separatorIndex) {
                                power = 0;
                            } else {
                                power = separatorIndex - caretPosition;
                            }
                        } else { // caret is in the decimal part
                            power = separatorIndex - caretPosition + 1;
                        }
                    }

                    if (func === 'add') {
                        if (!that._eNotation || that._eNotation && (caretPosition < eIndex + 3)) {
                            that._number += that._spinButtonsStepObject * Math.pow(10, power) * eFactor;
                        } else {
                            that._number *= 10;
                        }
                    } else {
                        if (!that._eNotation || that._eNotation && (caretPosition < eIndex + 3)) {
                            that._number -= that._spinButtonsStepObject * Math.pow(10, power) * eFactor;
                        } else {
                            that._number /= 10;
                        }
                    }
                }
            }

            if (that.int64 !== false) {
                that.element.value = that._number.toString(that._radixNumber);
            } else {
                switch (that.outputNotation) {
                    case 'default':
                        that._checkNotation(that._number.toString());
                        if (that._eNotation === true) {
                            that.element.value = that._largeExponentialToDecimal(that._number);
                        } else {
                            that.element.value = that._validateDigits(that._number);
                        }
                        break;
                    case 'exponential':
                        var exponentialValue = that._number.toExponential();
                        that.element.value = that._applyDecimalSeparator(exponentialValue);
                        break;
                    case 'engineering':
                        that.element.value = that._applyDecimalSeparator(that._getDecimalNotation('engineering'));
                        break;
                }
            }

            that._change();
            that._handleOutputNotation();
        },

        // converts a positive binary to a 64-bit negative binary, octal or hexadecimal using two's complement
        _negativeBinary: function (result, radix) {
            var reversedResult = '';
            while (result.length < 64) {
                result = '0' + result;
            }

            for (var i = 0; i < result.length; i++) {
                var reversedDigit = result.charAt(i) === '1' ? '0' : '1';
                reversedResult += reversedDigit;
            }

            var plusOne = true;
            var finalResult = '';

            for (var j = reversedResult.length - 1; j >= 0; j--) {
                var currentDigit = reversedResult.charAt(j);
                var newDigit;

                if (currentDigit === '0') {
                    if (plusOne === true) {
                        newDigit = '1';
                        plusOne = false;
                    } else {
                        newDigit = '0';
                    }
                } else {
                    if (plusOne === true) {
                        newDigit = '0';
                    } else {
                        newDigit = '1';
                    }
                }
                finalResult = newDigit + '' + finalResult;
            }

            switch (radix) {
                case 2:
                    return finalResult;
                case 8:
                    finalResult = '00' + finalResult;
                    var octResult = '';
                    for (var k = 22; k >= 1; k--) {
                        var currentOct = finalResult[k * 3 - 3] + '' + finalResult[k * 3 - 2] + '' + finalResult[k * 3 - 1];
                        octResult = parseInt(currentOct, 2).toString(8) + '' + octResult;
                    }
                    return octResult;
                case 16:
                    var hexResult = '';
                    for (var l = 16; l >= 1; l--) {
                        var currentHex = finalResult[l * 4 - 4] + '' + finalResult[l * 4 - 3] + '' + finalResult[l * 4 - 2] + '' + finalResult[l * 4 - 1];
                        hexResult = parseInt(currentHex, 2).toString(16) + '' + hexResult;
                    }
                    return hexResult;
            }
        },

        _toBigNumberDecimal: function (number) {
            var radix = this._radixNumber,
                            result;
            if (radix === 10) {
                result = new BigNumber(number); //ignore jslint
            } else {
                result = new BigNumber(0); //ignore jslint
                for (var i = number.length - 1; i >= 0; i--) {
                    var current = new BigNumber(parseInt(number.charAt(i), radix)); //ignore jslint
                    result = result.add((current.multiply(new BigNumber(radix).pow(number.length - 1 - i)))); //ignore jslint
                }
            }
            return result;
        },

        _checkNotation: function (value) {
            var that = this;
            if (value === undefined) {
                value = that.element.value;
            }

            if (value.toString().toLowerCase().indexOf('e') !== -1) {
                that._eNotation = true;
            } else {
                that._eNotation = false;
            }
        },

        _discardDecimalSeparator: function (value, separator) {
            var that = this;

            if (separator === undefined) {
                separator = that.decimalSeparator;
            }

            if (separator !== '.' && value !== Infinity && value !== Number.NEGATIVE_INFINITY) {
                var decimalSeparatorRegExp = new RegExp(separator, 'g');
                return value.replace(decimalSeparatorRegExp, '.');
            } else {
                return value;
            }
        },

        _applyDecimalSeparator: function (value) {
            var that = this;
            if (that.decimalSeparator !== '.') {
                value = value.replace(/\./g, that.decimalSeparator);
            }
            return value;
        },

        // a replacement of jQuery's .removeClass()
        _removeClass: function (element, classToRemove) {
            $(element).removeClass(classToRemove);
        },

        _find: function (className, parent) {
            var children = $(parent).children();
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.className.indexOf(className) !== -1) {
                    return child;
                }
            }
        },

        _checkStructure: function () {
            var that = this;
            if (that.element.nodeName.toLowerCase() === 'div') {
                var divChildren = that.element.getElementsByTagName('div');
                var featuresEnabled = 0;
                if (that.spinButtons) {
                    featuresEnabled += 1;
                }
                if (that.dropDown) {
                    featuresEnabled += 1;
                }

                if (featuresEnabled === 1 && divChildren.length === 2 || featuresEnabled === 0 && divChildren.length === 1) {
                    that.element.removeChild(divChildren[0]);
                } else if (featuresEnabled === 0 && divChildren.length === 2) {
                    that.element.removeChild(divChildren[1]);
                    that.element.removeChild(divChildren[0]);
                }
            }
        },

        // enables 64-bit number support
        _Long: function () {
            var that = this;

            that.longObj = {
            };
            var longObj = that.longObj;
            longObj.math = {
            };
            longObj.math.Long = {
            };

            longObj.math.Long = function (low, high) {
                this.lowBits = low | 0;
                this.highBits = high | 0;
            };

            longObj.math.Long.IntCache = {
            };

            longObj.math.Long.fromInt = function (value) {
                if (-128 <= value && value < 128) {
                    var cachedObj = longObj.math.Long.IntCache[value];
                    if (cachedObj) {
                        return cachedObj;
                    }
                }

                var obj = new longObj.math.Long(value | 0, value < 0 ? -1 : 0);
                if (-128 <= value && value < 128) {
                    longObj.math.Long.IntCache[value] = obj;
                }
                return obj;
            };

            longObj.math.Long.fromNumber = function (value) {
                if (isNaN(value) || !isFinite(value)) {
                    return longObj.math.Long.ZERO;
                } else if (value <= -longObj.math.Long.TWO_PWR_63_DBL_) {
                    return longObj.math.Long.MIN_VALUE;
                } else if (value + 1 >= longObj.math.Long.TWO_PWR_63_DBL_) {
                    return longObj.math.Long.MAX_VALUE;
                } else if (value < 0) {
                    return longObj.math.Long.fromNumber(-value).negate();
                } else {
                    return new longObj.math.Long(
        (value % longObj.math.Long.TWO_PWR_32_DBL_) | 0,
        (value / longObj.math.Long.TWO_PWR_32_DBL_) | 0);
                }
            };

            longObj.math.Long.fromBits = function (lowBits, highBits) {
                return new longObj.math.Long(lowBits, highBits);
            };

            longObj.math.Long.fromString = function (str, optRadix) {
                if (str.length === 0) {
                    throw new Error('number format error: empty string');
                }

                var radix = optRadix || 10;
                if (radix < 2 || 36 < radix) {
                    throw new Error('radix out of range: ' + radix);
                }

                if (str.charAt(0) === '-') {
                    return longObj.math.Long.fromString(str.substring(1), radix).negate();
                } else if (str.indexOf('-') >= 0) {
                    throw new Error('number format error: interior "-" character: ' + str);
                }

                var radixToPower = longObj.math.Long.fromNumber(Math.pow(radix, 8));

                var result = longObj.math.Long.ZERO;
                for (var i = 0; i < str.length; i += 8) {
                    var size = Math.min(8, str.length - i);
                    var value = parseInt(str.substring(i, i + size), radix);
                    if (size < 8) {
                        var power = longObj.math.Long.fromNumber(Math.pow(radix, size));
                        result = result.multiply(power).add(longObj.math.Long.fromNumber(value));
                    } else {
                        result = result.multiply(radixToPower);
                        result = result.add(longObj.math.Long.fromNumber(value));
                    }
                }
                return result;
            };

            longObj.math.Long.TWO_PWR_16_DBL_ = 1 << 16;
            longObj.math.Long.TWO_PWR_24_DBL_ = 1 << 24;
            longObj.math.Long.TWO_PWR_32_DBL_ =
        longObj.math.Long.TWO_PWR_16_DBL_ * longObj.math.Long.TWO_PWR_16_DBL_;
            longObj.math.Long.TWO_PWR_31_DBL_ =
        longObj.math.Long.TWO_PWR_32_DBL_ / 2;
            longObj.math.Long.TWO_PWR_48_DBL_ =
        longObj.math.Long.TWO_PWR_32_DBL_ * longObj.math.Long.TWO_PWR_16_DBL_;
            longObj.math.Long.TWO_PWR_64_DBL_ =
        longObj.math.Long.TWO_PWR_32_DBL_ * longObj.math.Long.TWO_PWR_32_DBL_;
            longObj.math.Long.TWO_PWR_63_DBL_ =
        longObj.math.Long.TWO_PWR_64_DBL_ / 2;
            longObj.math.Long.ZERO = longObj.math.Long.fromInt(0);
            longObj.math.Long.ONE = longObj.math.Long.fromInt(1);
            longObj.math.Long.NEG_ONE = longObj.math.Long.fromInt(-1);
            longObj.math.Long.MAX_VALUE =
        longObj.math.Long.fromBits(0xFFFFFFFF | 0, 0x7FFFFFFF | 0);
            longObj.math.Long.MIN_VALUE = longObj.math.Long.fromBits(0, 0x80000000 | 0);
            longObj.math.Long.TWO_PWR_24_ = longObj.math.Long.fromInt(1 << 24);

            longObj.math.Long.prototype.toInt = function () {
                return this.lowBits;
            };

            longObj.math.Long.prototype.toNumber = function () {
                return this.highBits * longObj.math.Long.TWO_PWR_32_DBL_ +
         this.getLowBitsUnsigned();
            };

            longObj.math.Long.prototype.toString = function (optRadix) {
                var radix = optRadix || 10;
                if (radix < 2 || 36 < radix) {
                    throw new Error('radix out of range: ' + radix);
                }

                if (this.isZero()) {
                    return '0';
                }

                var rem, result;

                if (this.isNegative()) {
                    if (this.equals(longObj.math.Long.MIN_VALUE)) {
                        var radixLong = longObj.math.Long.fromNumber(radix);
                        var div = this.div(radixLong);
                        rem = div.multiply(radixLong).subtract(this);
                        return div.toString(radix) + rem.toInt().toString(radix);
                    } else {
                        switch (radix) {
                            case 2:
                            case 8:
                            case 16:
                                result = this.negate().toString(2);
                                return that._negativeBinary(result, radix);
                            default:
                                result = '-' + this.negate().toString(radix);
                                return result;
                        }
                    }
                }

                var radixToPower = longObj.math.Long.fromNumber(Math.pow(radix, 6));

                rem = this;
                result = '';
                while (true) {
                    var remDiv = rem.div(radixToPower);
                    var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt();
                    var digits = intval.toString(radix);

                    rem = remDiv;
                    if (rem.isZero()) {
                        return digits + result;
                    } else {
                        while (digits.length < 6) {
                            digits = '0' + digits;
                        }
                        result = '' + digits + result;
                    }
                }
            };


            longObj.math.Long.prototype.getHighBits = function () {
                return this.highBits;
            };

            longObj.math.Long.prototype.getLowBits = function () {
                return this.lowBits;
            };

            longObj.math.Long.prototype.getLowBitsUnsigned = function () {
                return (this.lowBits >= 0) ?
        this.lowBits : longObj.math.Long.TWO_PWR_32_DBL_ + this.lowBits;
            };

            longObj.math.Long.prototype.getNumBitsAbs = function () {
                if (this.isNegative()) {
                    if (this.equals(longObj.math.Long.MIN_VALUE)) {
                        return 64;
                    } else {
                        return this.negate().getNumBitsAbs();
                    }
                } else {
                    var val = this.highBits !== 0 ? this.highBits : this.lowBits;
                    for (var bit = 31; bit > 0; bit--) {
                        if ((val & (1 << bit)) !== 0) {
                            break;
                        }
                    }
                    return this.highBits !== 0 ? bit + 33 : bit + 1;
                }
            };

            longObj.math.Long.prototype.isZero = function () {
                return this.highBits === 0 && this.lowBits === 0;
            };

            longObj.math.Long.prototype.isNegative = function () {
                return this.highBits < 0;
            };

            longObj.math.Long.prototype.isOdd = function () {
                return (this.lowBits & 1) === 1;
            };

            longObj.math.Long.prototype.equals = function (other) {
                return (this.highBits === other.highBits) && (this.lowBits === other.lowBits);
            };

            longObj.math.Long.prototype.notEquals = function (other) {
                return (this.highBits !== other.highBits) || (this.lowBits !== other.lowBits);
            };

            longObj.math.Long.prototype.lessThan = function (other) {
                return this.compare(other) < 0;
            };

            longObj.math.Long.prototype.lessThanOrEqual = function (other) {
                return this.compare(other) <= 0;
            };

            longObj.math.Long.prototype.greaterThan = function (other) {
                return this.compare(other) > 0;
            };

            longObj.math.Long.prototype.greaterThanOrEqual = function (other) {
                return this.compare(other) >= 0;
            };

            longObj.math.Long.prototype.compare = function (other) {
                if (this.equals(other)) {
                    return 0;
                }

                var thisNeg = this.isNegative();
                var otherNeg = other.isNegative();
                if (thisNeg && !otherNeg) {
                    return -1;
                }
                if (!thisNeg && otherNeg) {
                    return 1;
                }

                if (this.subtract(other).isNegative()) {
                    return -1;
                } else {
                    return 1;
                }
            };


            longObj.math.Long.prototype.negate = function () {
                if (this.equals(longObj.math.Long.MIN_VALUE)) {
                    return longObj.math.Long.MIN_VALUE;
                } else {
                    return this.not().add(longObj.math.Long.ONE);
                }
            };

            longObj.math.Long.prototype.add = function (other) {
                var a48 = this.highBits >>> 16;
                var a32 = this.highBits & 0xFFFF;
                var a16 = this.lowBits >>> 16;
                var a00 = this.lowBits & 0xFFFF;

                var b48 = other.highBits >>> 16;
                var b32 = other.highBits & 0xFFFF;
                var b16 = other.lowBits >>> 16;
                var b00 = other.lowBits & 0xFFFF;

                var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
                c00 += a00 + b00;
                c16 += c00 >>> 16;
                c00 &= 0xFFFF;
                c16 += a16 + b16;
                c32 += c16 >>> 16;
                c16 &= 0xFFFF;
                c32 += a32 + b32;
                c48 += c32 >>> 16;
                c32 &= 0xFFFF;
                c48 += a48 + b48;
                c48 &= 0xFFFF;
                return longObj.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
            };

            longObj.math.Long.prototype.subtract = function (other) {
                return this.add(other.negate());
            };

            longObj.math.Long.prototype.multiply = function (other) {
                if (this.isZero()) {
                    return longObj.math.Long.ZERO;
                } else if (other.isZero()) {
                    return longObj.math.Long.ZERO;
                }

                if (this.equals(longObj.math.Long.MIN_VALUE)) {
                    return other.isOdd() ? longObj.math.Long.MIN_VALUE : longObj.math.Long.ZERO;
                } else if (other.equals(longObj.math.Long.MIN_VALUE)) {
                    return this.isOdd() ? longObj.math.Long.MIN_VALUE : longObj.math.Long.ZERO;
                }

                if (this.isNegative()) {
                    if (other.isNegative()) {
                        return this.negate().multiply(other.negate());
                    } else {
                        return this.negate().multiply(other).negate();
                    }
                } else if (other.isNegative()) {
                    return this.multiply(other.negate()).negate();
                }

                if (this.lessThan(longObj.math.Long.TWO_PWR_24_) &&
        other.lessThan(longObj.math.Long.TWO_PWR_24_)) {
                    return longObj.math.Long.fromNumber(this.toNumber() * other.toNumber());
                }

                var a48 = this.highBits >>> 16;
                var a32 = this.highBits & 0xFFFF;
                var a16 = this.lowBits >>> 16;
                var a00 = this.lowBits & 0xFFFF;

                var b48 = other.highBits >>> 16;
                var b32 = other.highBits & 0xFFFF;
                var b16 = other.lowBits >>> 16;
                var b00 = other.lowBits & 0xFFFF;

                var c48 = 0, c32 = 0, c16 = 0, c00 = 0;
                c00 += a00 * b00;
                c16 += c00 >>> 16;
                c00 &= 0xFFFF;
                c16 += a16 * b00;
                c32 += c16 >>> 16;
                c16 &= 0xFFFF;
                c16 += a00 * b16;
                c32 += c16 >>> 16;
                c16 &= 0xFFFF;
                c32 += a32 * b00;
                c48 += c32 >>> 16;
                c32 &= 0xFFFF;
                c32 += a16 * b16;
                c48 += c32 >>> 16;
                c32 &= 0xFFFF;
                c32 += a00 * b32;
                c48 += c32 >>> 16;
                c32 &= 0xFFFF;
                c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
                c48 &= 0xFFFF;
                return longObj.math.Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32);
            };

            longObj.math.Long.prototype.div = function (other) {
                if (other.isZero()) {
                    throw new Error('division by zero');
                } else if (this.isZero()) {
                    return longObj.math.Long.ZERO;
                }

                var approx, rem;

                if (this.equals(longObj.math.Long.MIN_VALUE)) {
                    if (other.equals(longObj.math.Long.ONE) ||
        other.equals(longObj.math.Long.NEG_ONE)) {
                        return longObj.math.Long.MIN_VALUE;
                    } else if (other.equals(longObj.math.Long.MIN_VALUE)) {
                        return longObj.math.Long.ONE;
                    } else {
                        var halfThis = this.shiftRight(1);
                        approx = halfThis.div(other).shiftLeft(1);
                        if (approx.equals(longObj.math.Long.ZERO)) {
                            return other.isNegative() ? longObj.math.Long.ONE : longObj.math.Long.NEG_ONE;
                        } else {
                            rem = this.subtract(other.multiply(approx));
                            var result = approx.add(rem.div(other));
                            return result;
                        }
                    }
                } else if (other.equals(longObj.math.Long.MIN_VALUE)) {
                    return longObj.math.Long.ZERO;
                }

                if (this.isNegative()) {
                    if (other.isNegative()) {
                        return this.negate().div(other.negate());
                    } else {
                        return this.negate().div(other).negate();
                    }
                } else if (other.isNegative()) {
                    return this.div(other.negate()).negate();
                }

                var res = longObj.math.Long.ZERO;
                rem = this;
                while (rem.greaterThanOrEqual(other)) {
                    approx = Math.max(1, Math.floor(rem.toNumber() / other.toNumber()));

                    var log2 = Math.ceil(Math.log(approx) / Math.LN2);
                    var delta = (log2 <= 48) ? 1 : Math.pow(2, log2 - 48);

                    var approxRes = longObj.math.Long.fromNumber(approx);
                    var approxRem = approxRes.multiply(other);
                    while (approxRem.isNegative() || approxRem.greaterThan(rem)) {
                        approx -= delta;
                        approxRes = longObj.math.Long.fromNumber(approx);
                        approxRem = approxRes.multiply(other);
                    }

                    if (approxRes.isZero()) {
                        approxRes = longObj.math.Long.ONE;
                    }

                    res = res.add(approxRes);
                    rem = rem.subtract(approxRem);
                }
                return res;
            };

            longObj.math.Long.prototype.modulo = function (other) {
                return this.subtract(this.div(other).multiply(other));
            };

            longObj.math.Long.prototype.not = function () {
                return longObj.math.Long.fromBits(~this.lowBits, ~this.highBits);
            };

            longObj.math.Long.prototype.and = function (other) {
                return longObj.math.Long.fromBits(this.lowBits & other.lowBits,
                                 this.highBits & other.highBits);
            };

            longObj.math.Long.prototype.or = function (other) {
                return longObj.math.Long.fromBits(this.lowBits | other.lowBits,
                                 this.highBits | other.highBits);
            };

            longObj.math.Long.prototype.xor = function (other) {
                return longObj.math.Long.fromBits(this.lowBits ^ other.lowBits,
                                 this.highBits ^ other.highBits);
            };

            longObj.math.Long.prototype.shiftLeft = function (numBits) {
                numBits &= 63;
                if (numBits === 0) {
                    return this;
                } else {
                    var low = this.lowBits;
                    if (numBits < 32) {
                        var high = this.highBits;
                        return longObj.math.Long.fromBits(
          low << numBits,
          (high << numBits) | (low >>> (32 - numBits)));
                    } else {
                        return longObj.math.Long.fromBits(0, low << (numBits - 32));
                    }
                }
            };

            longObj.math.Long.prototype.shiftRight = function (numBits) {
                numBits &= 63;
                if (numBits === 0) {
                    return this;
                } else {
                    var high = this.highBits;
                    if (numBits < 32) {
                        var low = this.lowBits;
                        return longObj.math.Long.fromBits(
              (low >>> numBits) | (high << (32 - numBits)),
              high >> numBits);
                    } else {
                        return longObj.math.Long.fromBits(
          high >> (numBits - 32),
          high >= 0 ? 0 : -1);
                    }
                }
            };

            longObj.math.Long.prototype.shiftRightUnsigned = function (numBits) {
                numBits &= 63;
                if (numBits === 0) {
                    return this;
                } else {
                    var high = this.highBits;
                    if (numBits < 32) {
                        var low = this.lowBits;
                        return longObj.math.Long.fromBits(
          (low >>> numBits) | (high << (32 - numBits)),
          high >>> numBits);
                    } else if (numBits === 32) {
                        return longObj.math.Long.fromBits(high, 0);
                    } else {
                        return longObj.math.Long.fromBits(high >>> (numBits - 32), 0);
                    }
                }
            };
        }
    });
})(jqxBaseFramework); //ignore jslint

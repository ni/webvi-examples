'use strict';

/**
* Button custom element.
*/
JQX('jqx-button', function (_JQX$ContentElement) {
    babelHelpers.inherits(Button, _JQX$ContentElement);

    function Button() {
        babelHelpers.classCallCheck(this, Button);
        return babelHelpers.possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).apply(this, arguments));
    }

    babelHelpers.createClass(Button, [{
        key: 'scopedStyle',
        value: function scopedStyle() {
            var baseStyle = babelHelpers.get(Button.prototype.__proto__ || Object.getPrototypeOf(Button.prototype), 'scopedStyle', this).call(this);
            var elementStyle = '\n                :host {\n                    display: inline-block;\n                }\n                :host-context(.jqx-button-large) #button {\n                    padding: 10px 16px;\n                    font-size: 18px;\n                    line-height: 1.3333333;\n                }\n                :host-context(.jqx-button-small) #button {\n                    padding: 5px 10px;\n                    font-size: 12px;\n                    line-height: 1.5;\n                }\n                :host-context(.jqx-button-very-small) #button {\n                    padding: 1px 5px;\n                    font-size: 12px;\n                    line-height: 1.5;\n                }\n                :host-context(.jqx-button) #button {\n                    padding: 6px 12px;\n                    margin-bottom: 0;\n                    font-size: 14px;\n                    font-weight: 400;\n                    line-height: 1.42857143;\n                }\n                #button {\n                    padding: 1px 2px 1px 2px;\n                    text-align: center;\n                    vertical-align: central;\n                    color: var(--jqx-color);\n                    border: 1px solid var(--jqx-border-color);\n                    background: var(--jqx-background-color, blue);\n                    cursor: pointer;\n                }\n                #button:focus {\n                    color: var(--jqx-focus-color);\n                    border-color: var(--jqx-focus-border-color);\n                    background-color: var(--jqx-focus-background-color);\n                }\n                #button.hover {\n                  color: var(--jqx-hover-color);\n                  border-color: var(--jqx-hover-border-color);\n                  background-color: var(--jqx-hover-background-color);\n                  transition: background-color 100ms linear;\n                }\n                #button:active,\n                #button.active {\n                    color: var(--jqx-active-color);\n                    border-color: var(--jqx-active-border-color);\n                    background-color: var(--jqx-active-background-color);\n                    transition: background-color 100ms linear;\n                }\n                #button[disabled] {\n                    color: var(--jqx-disabled-color);\n                    border-color: var(--jqx-disabled-border-color);\n                    background-color: var(--jqx-disabled-background-color);\n                    cursor: default;\n                }\n            ';

            return baseStyle + elementStyle;
        }
        /** Button's template. */

    }, {
        key: 'template',
        value: function template() {
            return '<button class=\'jqx-button\' inner-h-t-m-l=\'[[innerHTML]]\' id=\'button\' type=\'[[type]]\' name=\'[[name]]\' value=\'[[value]]\' disabled=\'[[disabled]]\' role=\'button\'></button>';
        }
    }, {
        key: '_clickHandler',
        value: function _clickHandler(event) {
            var that = this;

            if (that.clickMode !== 'release' && that.clickMode !== 'pressAndRelease' || that.readonly) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }, {
        key: '_mouseDownHandler',
        value: function _mouseDownHandler(event) {
            var that = this;

            if ((that.clickMode === 'press' || that.clickMode === 'pressAndRelease') && !that.readonly) {
                var buttons = 'buttons' in event ? event.buttons : event.which;

                that.$.fireEvent('click', { buttons: buttons, clientX: event.clientX, clientY: event.clientY, pageX: event.pageX, pageY: event.pageY, screenX: event.screenX, screenY: event.screenY });
            }
        }
    }, {
        key: '_mouseEnterHandler',
        value: function _mouseEnterHandler(event) {
            var that = this;

            if (that.readonly) {
                return;
            }

            that.$button.addClass('hover');

            if (that.clickMode === 'hover') {
                var buttons = 'buttons' in event ? event.buttons : event.which;

                that.$.fireEvent('click', { buttons: buttons, clientX: event.clientX, clientY: event.clientY, pageX: event.pageX, pageY: event.pageY, screenX: event.screenX, screenY: event.screenY });
            }
        }
    }, {
        key: '_touchEndHandler',
        value: function _touchEndHandler() {
            var that = this;

            setTimeout(function () {
                that.$button.removeClass('hover');
            }, 300);
        }
    }, {
        key: '_mouseLeaveHandler',
        value: function _mouseLeaveHandler() {
            var that = this;

            that.$button.removeClass('hover');
        }
    }], [{
        key: 'properties',

        // Button's properties.
        get: function get() {
            return {
                'value': {
                    type: 'string'
                },
                'name': {
                    type: 'string'
                },
                'type': {
                    type: 'string'
                },
                'clickMode': {
                    allowedValues: ['hover', 'press', 'release', 'pressAndRelease'],
                    type: 'string',
                    value: 'release'
                },
                'readonly': {
                    type: 'boolean',
                    value: false
                }
            };
        }
    }, {
        key: 'listeners',
        get: function get() {
            return {
                'button.down': '_mouseDownHandler',
                'button.mouseenter': '_mouseEnterHandler',
                'button.mouseleave': '_mouseLeaveHandler',
                'button.touchend': '_touchEndHandler',
                'button.click': '_clickHandler'
            };
        }
    }]);
    return Button;
}(JQX.ContentElement));

/**
* Repeat Button.
*/
JQX('jqx-repeat-button', function (_JQX$Button) {
    babelHelpers.inherits(RepeatButton, _JQX$Button);

    function RepeatButton() {
        babelHelpers.classCallCheck(this, RepeatButton);
        return babelHelpers.possibleConstructorReturn(this, (RepeatButton.__proto__ || Object.getPrototypeOf(RepeatButton)).apply(this, arguments));
    }

    babelHelpers.createClass(RepeatButton, [{
        key: '_clickHandler',
        value: function _clickHandler(event) {
            var that = this;

            if (that.clickMode !== 'release' || that.preventDefaultClick || that.readonly) {
                event.preventDefault();
                event.stopPropagation();
                that.preventDefaultClick = false;
            }
        }
    }, {
        key: '_updateInBoundsFlag',
        value: function _updateInBoundsFlag(event) {
            var that = this;

            that._isPointerInBounds = true;

            if (event.type === 'mouseleave') {
                that._isPointerInBounds = false;
            }
            var buttons = 'buttons' in event ? event.buttons : event.which;
            if (buttons !== 1) {
                that._stopRepeat();
            }
        }
    }, {
        key: '_startRepeat',
        value: function _startRepeat(event) {
            var that = this;
            if (!that._initialTimer && !that.readonly) {
                that._initialTimer = setTimeout(function () {
                    that._repeatTimer = setInterval(function () {
                        if (that._isPointerInBounds) {
                            var buttons = 'buttons' in event ? event.buttons : event.which;

                            that.$.fireEvent('click', { buttons: buttons, clientX: event.clientX, clientY: event.clientY, pageX: event.pageX, pageY: event.pageY, screenX: event.screenX, screenY: event.screenY });
                            that.preventDefaultClick = true;
                        }
                    }, that.delay);
                }, that.initialDelay);
            }
        }
    }, {
        key: '_stopRepeat',
        value: function _stopRepeat() {
            var that = this;

            if (that.readonly) {
                return;
            }

            if (that._repeatTimer) {
                clearInterval(that._repeatTimer);
                that._repeatTimer = null;
            }

            if (that._initialTimer) {
                clearTimeout(that._initialTimer);
                that._initialTimer = null;
            }
        }
    }], [{
        key: 'properties',

        // button's properties.
        get: function get() {
            return {
                'delay': {
                    value: 50,
                    type: 'number'
                },
                'initialDelay': {
                    value: 150,
                    type: 'number'
                }
            };
        }
    }, {
        key: 'listeners',
        get: function get() {
            return {
                'button.mousedown': '_startRepeat',
                'button.mouseenter': '_updateInBoundsFlag',
                'button.mouseleave': '_updateInBoundsFlag',
                'document.mouseup': '_stopRepeat'
            };
        }
    }]);
    return RepeatButton;
}(JQX.Button));

/**
* Toggle Button.
*/
JQX('jqx-toggle-button', function (_JQX$Button2) {
    babelHelpers.inherits(ToggleButton, _JQX$Button2);

    function ToggleButton() {
        babelHelpers.classCallCheck(this, ToggleButton);
        return babelHelpers.possibleConstructorReturn(this, (ToggleButton.__proto__ || Object.getPrototypeOf(ToggleButton)).apply(this, arguments));
    }

    babelHelpers.createClass(ToggleButton, [{
        key: 'ready',


        /** Called when the element is ready. Used for one-time configuration of the ToggleButton. */
        value: function ready() {
            babelHelpers.get(ToggleButton.prototype.__proto__ || Object.getPrototypeOf(ToggleButton.prototype), 'ready', this).call(this);

            this._setTabIndex();
        }

        /**
         * Overrides the inherited "click" handler of the inner button element.
         */

    }, {
        key: '_buttonClickHandler',
        value: function _buttonClickHandler() {}

        /**
         * Changes the check state on hover.
         */

    }, {
        key: '_buttonMouseEnterHandler',
        value: function _buttonMouseEnterHandler() {
            var that = this;

            if (that.disabled || that.readonly || that.clickMode !== 'hover') {
                return;
            }

            that._changeCheckState('pointer');
            that.focus();
            that._updateHidenInputNameAndValue();
        }

        /** Changes the check state wneh widget container is clicked. */

    }, {
        key: '_documentUpHandler',
        value: function _documentUpHandler() {
            var that = this;

            if (!that._pressed) {
                return;
            }

            that._pressed = false;

            if (that.disabled || that.readonly || that.clickMode === 'press') {
                return;
            }

            that._changeCheckState('pointer');
            that.focus();
            that._updateHidenInputNameAndValue();
        }
    }, {
        key: '_mouseDownHandler',
        value: function _mouseDownHandler(event) {
            var that = this;

            if (that.disabled || that.readonly) {
                return;
            }

            that._pressed = true;

            if (that.clickMode === 'press' || that.clickMode === 'pressAndRelease') {
                that._changeCheckState('pointer');
                that.$.fireEvent('click');
                that._updateHidenInputNameAndValue();
            }

            if (that.clickMode === 'press') {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }, {
        key: '_dragStartHandler',
        value: function _dragStartHandler(event) {
            event.preventDefault();
        }

        /** Changes the check state when spacebar is pressed. */

    }, {
        key: '_keyUpHandler',
        value: function _keyUpHandler(event) {
            var that = this;

            if (that.disabled !== true && !that.readonly && event.keyCode === 32) {
                that._changeCheckState('keyboard');
                that._updateHidenInputNameAndValue();
            }
        }

        /** Changes the check state. */

    }, {
        key: '_changeCheckState',
        value: function _changeCheckState(changeType) {
            var that = this;

            var oldValue = null;

            if (that.checked === null) {
                that.checked = true;
            } else {
                oldValue = that.checked;
                that.checked = !that.checked;
            }

            that._handleTextSelection();

            that.$.fireEvent('change', { 'value': that.checked, 'oldValue': oldValue, changeType: changeType });
        }
    }, {
        key: '_handleTextSelection',
        value: function _handleTextSelection() {
            var that = this;

            that.$.addClass('jqx-unselectable');

            if (that.timer) {
                clearTimeout(that.timer);
            }

            that.timer = setTimeout(function () {
                return that.$.removeClass('jqx-unselectable');
            }, 500);
        }

        /**
        * Called when a property is changed.
        */

    }, {
        key: 'propertyChangedHandler',
        value: function propertyChangedHandler(propertyName, oldValue, newValue) {
            babelHelpers.get(ToggleButton.prototype.__proto__ || Object.getPrototypeOf(ToggleButton.prototype), 'propertyChangedHandler', this).call(this, propertyName, oldValue, newValue);
            var that = this;

            if (propertyName === 'checked') {
                that.$.fireEvent('change', { 'value': newValue, 'oldValue': oldValue, changeType: 'api' });
            }
        }
    }, {
        key: '_htmlBindOnInitialization',
        value: function _htmlBindOnInitialization() {
            var that = this;

            that._bindContentProperty('trueContent', 'jqx-true-content');
            that._bindContentProperty('falseContent', 'jqx-false-content');
            that._bindContentProperty('indeterminateContent', 'jqx-indeterminate-content');
        }
    }, {
        key: '_bindContentProperty',
        value: function _bindContentProperty(propertyName, className) {
            var that = this;

            if (!that.$[propertyName + 'Container']) {
                return;
            }

            var elements = that.$.container.getElementsByClassName(className),
                element = void 0;

            if (elements.length > 0) {
                for (var i = 0; i < elements.length; i++) {
                    var parentClassName = elements[i].parentElement.className;

                    if (parentClassName === 'jqx-container') {
                        element = elements[i];
                    }
                }
            }

            if (that[propertyName] === '') {
                that[propertyName] = element === undefined ? '' : element.outerHTML;
            }

            that.$[propertyName + 'Container'].innerHTML = that[propertyName];

            if (element !== undefined) {
                that.$.container.removeChild(element);
            }
        }
    }, {
        key: '_setTabIndex',
        value: function _setTabIndex() {
            var that = this,
                isIE = /*@cc_on!@*/false || !!document.documentMode,
                isEdge = !isIE && !!window.StyleMedia;
            var target = void 0;

            if (that.$.button) {
                target = that.$.button;
            } else {
                target = that;
            }

            if (!(isIE || isEdge) && that.tabIndex === -1) {
                target.tabIndex = 0;
            } else if ((isIE || isEdge) && that.tabIndex === 0) {
                target.tabIndex = 1;
            }
        }
    }, {
        key: '_updateContentProperties',
        value: function _updateContentProperties() {
            var that = this;

            update('trueContent');
            update('falseContent');
            update('indeterminateContent');

            function update(property) {
                if (that.$[property + 'Container']) {
                    that[property] = that.$[property + 'Container'].innerHTML;
                }
            }
        }
    }, {
        key: '_updateHidenInputValue',
        value: function _updateHidenInputValue() {
            var that = this;

            if (!that.$.hiddenInput) {
                return;
            }

            var inputValue = void 0;

            if (that.checked === null) {
                inputValue = 'null';
            } else if (that.checked === false) {
                inputValue = 'off';
            } else {
                inputValue = that.value || 'on';
            }

            that.$.hiddenInput.setAttribute('value', inputValue);
        }
    }, {
        key: '_updateHidenInputName',
        value: function _updateHidenInputName() {
            var that = this;

            if (!that.$.hiddenInput) {
                return;
            }

            var inputName = that.checked === false ? '' : that.name || '';

            that.$.hiddenInput.setAttribute('name', inputName);
        }
    }, {
        key: '_updateHidenInputNameAndValue',
        value: function _updateHidenInputNameAndValue() {
            var that = this;

            that._updateHidenInputName();
            that._updateHidenInputValue();
        }
    }], [{
        key: 'properties',

        // Toggle Button's properties.
        get: function get() {
            return {
                'checked': {
                    value: false,
                    type: 'boolean?'
                },
                'falseContent': {
                    value: '',
                    reflectToAttribute: false,
                    type: 'string'
                },
                'indeterminateContent': {
                    value: '',
                    reflectToAttribute: false,
                    type: 'string'
                },
                'indeterminate': {
                    value: false,
                    type: 'boolean'
                },
                'trueContent': {
                    value: '',
                    reflectToAttribute: false,
                    type: 'string'
                }
            };
        }

        /**
        * Toggle Button's event listeners.
        */

    }, {
        key: 'listeners',
        get: function get() {
            return {
                'keyup': '_keyUpHandler',
                'dragstart': '_dragStartHandler',
                'button.click': '_buttonClickHandler',
                'button.mouseenter': '_buttonMouseEnterHandler',
                'document.up': '_documentUpHandler'
            };
        }
    }]);
    return ToggleButton;
}(JQX.Button));
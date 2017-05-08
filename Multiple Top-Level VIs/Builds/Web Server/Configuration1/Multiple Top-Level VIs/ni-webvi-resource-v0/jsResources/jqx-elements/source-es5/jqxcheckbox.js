'use strict';

/**
* CheckBox custom element.
*/
JQX('jqx-checkbox', function (_JQX$ToggleButton) {
    babelHelpers.inherits(CheckBox, _JQX$ToggleButton);

    function CheckBox() {
        babelHelpers.classCallCheck(this, CheckBox);
        return babelHelpers.possibleConstructorReturn(this, (CheckBox.__proto__ || Object.getPrototypeOf(CheckBox)).apply(this, arguments));
    }

    babelHelpers.createClass(CheckBox, [{
        key: 'template',


        /** Checkbox's Html template. */
        value: function template() {
            return '<div id=\'container\' class=\'jqx-container\'>\n                 <div id=\'checkboxAnimation\' class =\'jqx-animation\'></div>\n                 <span id=\'checkboxInput\' class =\'jqx-input\'></span>\n                 <span id=\'checkboxLabel\' inner-h-t-m-l=\'[[innerHTML]]\' class =\'jqx-label\'><content></content></span>\n                 <input id=\'hiddenInput\' class =\'jqx-hidden-input\' type=\'hidden\'>\n               </div>';
        }
    }, {
        key: 'ready',


        /** Called when the element is ready. Used for one-time configuration of the Checkbox. */
        value: function ready() {
            var that = this;

            babelHelpers.get(CheckBox.prototype.__proto__ || Object.getPrototypeOf(CheckBox.prototype), 'ready', this).call(this);

            if (that.indeterminate) {
                that._valueCashe = that.checked;
                that.checked = null;
            }

            that._updateHidenInputNameAndValue();
        }

        /**
        * Updates checkbox when a property is changed.
        * @param {string} propertyName The name of the property.
        * @param {number/string} oldValue The previously entered value.
        * @param {number/string} newValue The new entered value.
        */

    }, {
        key: 'propertyChangedHandler',
        value: function propertyChangedHandler(propertyName, oldValue, newValue) {
            babelHelpers.get(CheckBox.prototype.__proto__ || Object.getPrototypeOf(CheckBox.prototype), 'propertyChangedHandler', this).call(this, propertyName, oldValue, newValue);

            var that = this;

            that._updateContentProperties();

            switch (propertyName) {
                case 'indeterminate':
                    if (newValue) {
                        that._valueCashe = that.checked;
                        that.checked = null;
                    } else {
                        that.checked = that._valueCashe;
                    }
                    that._updateHidenInputNameAndValue();
                    break;
                case 'value':
                    that._updateHidenInputNameAndValue();
                    break;
                case 'checked':
                    that._updateHidenInputNameAndValue();
                    break;
                case 'name':
                    that._updateHidenInputName();
                    break;
            }
        }

        /** Changes the check state on click. */

    }, {
        key: '_documentUpHandler',
        value: function _documentUpHandler(event) {
            var that = this;

            if (!that._pressed) {
                return;
            }

            that._pressed = false;

            if (that.disabled || that.readonly || event.target === that.$.checkboxLabel && !that.enableContainerClick) {
                return;
            }

            if (that.clickMode === 'press') {
                event.preventDefault();
                event.stopPropagation();
                return;
            }

            that._changeCheckState('pointer');
            that.focus();
            that._handleTextSelection();
            that._updateHidenInputNameAndValue();
        }

        /** Changes the check state on mouse down. */

    }, {
        key: '_mouseDownHandler',
        value: function _mouseDownHandler(event) {
            var that = this;

            if (that.disabled || that.readonly || event.target === that.$.checkboxLabel && !that.enableContainerClick) {
                return;
            }

            that._pressed = true;

            if (that.clickMode === 'press' || that.clickMode === 'pressAndRelease') {
                that._changeCheckState('pointer');
                that.$.fireEvent('click');
                that.focus();
                that._updateHidenInputNameAndValue();
            }
        }
    }], [{
        key: 'properties',

        // CheckBox's properties.
        get: function get() {
            return {
                'enableContainerClick': {
                    value: false,
                    type: 'boolean'
                }
            };
        }
    }, {
        key: 'listeners',
        get: function get() {
            return {
                'checkboxInput.down': '_mouseDownHandler',
                'checkboxLabel.down': '_mouseDownHandler',
                'document.up': '_documentUpHandler'
            };
        }
    }]);
    return CheckBox;
}(JQX.ToggleButton));
'use strict';

/**
* LED custom element.
*/
JQX('jqx-led', function (_JQX$ToggleButton) {
    babelHelpers.inherits(Led, _JQX$ToggleButton);

    function Led() {
        babelHelpers.classCallCheck(this, Led);
        return babelHelpers.possibleConstructorReturn(this, (Led.__proto__ || Object.getPrototypeOf(Led)).apply(this, arguments));
    }

    babelHelpers.createClass(Led, [{
        key: 'template',


        /** LED's Html template. */
        value: function template() {
            return '<div id=\'container\' class=\'jqx-container\'>\n                 <div id=\'ledAnimation\' class =\'jqx-animation\'></div>\n                 <div id=\'button\' class=\'jqx-input\'>\n                    <span id=\'falseContentContainer\' inner-h-t-m-l=\'[[falseContent]]\' class =\'jqx-false-content-container\'></span>\n                    <span id=\'indeterminateContentContainer\' inner-h-t-m-l=\'[[indeterminateContent]]\' class =\'jqx-indeterminate-content-container\'></span>\n                    <span id=\'trueContentContainer\' inner-h-t-m-l=\'[[trueContent]]\' class =\'jqx-true-content-container\'></span>\n                 </div>\n                 <input id=\'hiddenInput\' class =\'jqx-hidden-input\' type=\'hidden\'>\n               </div>';
        }

        /** Called when the element is ready. Used for one-time configuration of the Switch Button. */

    }, {
        key: 'ready',
        value: function ready() {
            var that = this;

            babelHelpers.get(Led.prototype.__proto__ || Object.getPrototypeOf(Led.prototype), 'ready', this).call(this);

            that._htmlBindOnInitialization();

            if (that.indeterminate) {
                that._valueCashe = that.checked;
                that.checked = null;
            }

            that._updateHidenInputNameAndValue();
        }

        /**
        * Updates the LED when a property is  changed.
        * @param {string} propertyName The name of the property.
        * @param {number/string} oldValue The previously entered value.
        * @param {number/string} newValue The new entered value.
        */

    }, {
        key: 'propertyChangedHandler',
        value: function propertyChangedHandler(propertyName, oldValue, newValue) {
            babelHelpers.get(Led.prototype.__proto__ || Object.getPrototypeOf(Led.prototype), 'propertyChangedHandler', this).call(this, propertyName, oldValue, newValue);

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
                case 'trueContent':
                    that.trueContent = newValue;
                    break;
                case 'falseContent':
                    that.falseContent = newValue;
                    break;
                case 'indeterminateContent':
                    that.indeterminateContent = newValue;
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

        /** Changes the state wneh widget is clicked. */

    }, {
        key: '_documentUpHandler',
        value: function _documentUpHandler(event) {
            var that = this;

            if (!that._pressed || that.readonly) {
                return;
            }

            if (that.clickMode === 'press') {
                event.preventDefault();
                event.stopPropagation();
                that._pressed = false;
                return;
            }

            babelHelpers.get(Led.prototype.__proto__ || Object.getPrototypeOf(Led.prototype), '_documentUpHandler', this).call(this, event);
            that.indeterminate = false;
            that._updateHidenInputNameAndValue();
            that._updateContentProperties();
            that._pressed = false;
        }
    }, {
        key: '_mouseDownHandler',
        value: function _mouseDownHandler() {
            var that = this;

            if (that.readonly || that.disabled) {
                return;
            }

            that._pressed = true;

            if (that.clickMode === 'press' || that.clickMode === 'pressAndRelease') {
                that._changeCheckState('pointer');
                that.$.fireEvent('click');
                that.indeterminate = false;
                that._updateHidenInputNameAndValue();
            }
        }
    }], [{
        key: 'properties',

        // LED's properties.
        get: function get() {
            return {
                'shape': {
                    value: 'round',
                    allowedValues: ['round', 'square'],
                    type: 'string'
                }
            };
        }
    }]);
    return Led;
}(JQX.ToggleButton));
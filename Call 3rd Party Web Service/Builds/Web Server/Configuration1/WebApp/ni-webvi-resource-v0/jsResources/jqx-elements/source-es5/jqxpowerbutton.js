'use strict';

/**
* Power Button custom element.
*/
JQX('jqx-power-button', function (_JQX$ToggleButton) {
    babelHelpers.inherits(PowerButton, _JQX$ToggleButton);

    function PowerButton() {
        babelHelpers.classCallCheck(this, PowerButton);
        return babelHelpers.possibleConstructorReturn(this, (PowerButton.__proto__ || Object.getPrototypeOf(PowerButton)).apply(this, arguments));
    }

    babelHelpers.createClass(PowerButton, [{
        key: 'template',


        /** PowerButton's Html template. */
        value: function template() {
            return '<div id=\'container\' class=\'jqx-container\'>\n                 <div id=\'powerButtonAnimation\' class =\'jqx-animation\'></div>\n                 <span id=\'button\' class =\'jqx-input\'></span>\n                 <input id=\'hiddenInput\' class =\'jqx-hidden-input\' type=\'hidden\'>\n               </div>';
        }

        /** Called when the element is ready. Used for one-time configuration of the PowerButton. */

    }, {
        key: 'ready',
        value: function ready() {
            var that = this;

            babelHelpers.get(PowerButton.prototype.__proto__ || Object.getPrototypeOf(PowerButton.prototype), 'ready', this).call(this);
            that._updateHidenInputNameAndValue();
        }
    }]);
    return PowerButton;
}(JQX.ToggleButton));
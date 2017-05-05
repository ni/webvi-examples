'use strict';

JQX('jqx-base-progress-bar', function (_JQX$BaseElement) {
    babelHelpers.inherits(BaseProgressBar, _JQX$BaseElement);

    function BaseProgressBar() {
        babelHelpers.classCallCheck(this, BaseProgressBar);
        return babelHelpers.possibleConstructorReturn(this, (BaseProgressBar.__proto__ || Object.getPrototypeOf(BaseProgressBar)).apply(this, arguments));
    }

    babelHelpers.createClass(BaseProgressBar, [{
        key: 'ready',
        value: function ready() {
            babelHelpers.get(BaseProgressBar.prototype.__proto__ || Object.getPrototypeOf(BaseProgressBar.prototype), 'ready', this).call(this);

            var that = this;

            that._updateProgress();
        }

        /**
        * Updates the progressbar when a property is changed.
        * @param {string} propertyName The name of the property.
        * @param {number/string} oldValue The previously entered value. Max, min and value are of type Number. The rest are of type String.
        * @param {number/string} newValue The new entered value. Max, min and value are of type Number. The rest are of type String.
        */

    }, {
        key: 'propertyChangedHandler',
        value: function propertyChangedHandler(propertyName, oldValue, newValue) {
            babelHelpers.get(BaseProgressBar.prototype.__proto__ || Object.getPrototypeOf(BaseProgressBar.prototype), 'propertyChangedHandler', this).call(this, propertyName, oldValue, newValue);

            var that = this;

            that._updateProgress();
            if (propertyName === 'value') {
                that.$.fireEvent('change', { 'value': newValue, 'oldValue': oldValue, changeType: 'api' });
            }
        }
    }, {
        key: '_updateProgress',
        value: function _updateProgress() {}
    }, {
        key: '_percentageValue',
        get: function get() {
            var that = this;

            var max = Math.max(that.min, that.max);
            var min = Math.min(that.min, that.max);

            var validValue = Math.min(max, Math.max(min, that.value));
            var percentageValue = (validValue - min) / (max - min);

            return percentageValue;
        }
    }], [{
        key: 'properties',


        /** Progressbar's properties */
        get: function get() {
            return {
                'indeterminate': {
                    value: false,
                    type: 'boolean'
                },
                'inverted': {
                    value: false,
                    type: 'boolean'
                },
                'formatFunction': {
                    value: null,
                    type: 'function'
                },
                'max': {
                    value: 100,
                    type: 'number'
                },
                'min': {
                    value: 0,
                    type: 'number'
                },
                'showProgressValue': {
                    value: false,
                    type: 'boolean'
                },
                'value': {
                    value: 0,
                    type: 'number?'
                }
            };
        }
    }]);
    return BaseProgressBar;
}(JQX.BaseElement));

JQX('jqx-circular-progress-bar', function (_JQX$BaseProgressBar) {
    babelHelpers.inherits(CircularProgressBar, _JQX$BaseProgressBar);

    function CircularProgressBar() {
        babelHelpers.classCallCheck(this, CircularProgressBar);
        return babelHelpers.possibleConstructorReturn(this, (CircularProgressBar.__proto__ || Object.getPrototypeOf(CircularProgressBar)).apply(this, arguments));
    }

    babelHelpers.createClass(CircularProgressBar, [{
        key: 'template',

        /** progressbar's HTML template */
        value: function template() {
            return '<div id="container">\n                    <svg width="100%" height="100%" viewPort="0 0 100 100" viewBox="0 0 100 100">\n                       <circle id="value" class ="jqx-value-path" r="50" cx="50" cy="50" transform="rotate(270 50 50)"></circle>\n                       <circle id="value" class ="jqx-value" r="50" cx="50" cy="50" transform="rotate(270 50 50)"></circle>\n                    </svg>\n                    <div class ="jqx-label-container">\n                        <content></content>\n                        <span id="label" class ="jqx-label"></span>\n                    </div>\n                </div>';
        }

        /**
        * Circular Progress bar's event listeners.
        */

    }, {
        key: 'ready',


        /**
        * Circular progress bar's ready method.
        **/
        value: function ready() {
            babelHelpers.get(CircularProgressBar.prototype.__proto__ || Object.getPrototypeOf(CircularProgressBar.prototype), 'ready', this).call(this);

            var that = this;

            that.$.container.style.width = that.$.container.style.height = Math.min(that.offsetWidth, that.offsetHeight) + 'px';
        }

        /**
        * Circular Progress Bar's resize handler. Ensures the Progress Bars always has the same proportions.
        **/

    }, {
        key: '_resizeHandler',
        value: function _resizeHandler() {
            var that = this;

            that.$.container.style.width = that.$.container.style.height = Math.min(that.offsetWidth, that.offsetHeight) + 'px';
        }

        /** Updates the progress element. */

    }, {
        key: '_updateProgress',
        value: function _updateProgress() {
            babelHelpers.get(CircularProgressBar.prototype.__proto__ || Object.getPrototypeOf(CircularProgressBar.prototype), '_updateProgress', this).call(this);

            var that = this,
                radius = that.indeterminate ? Math.PI * 100 : Math.PI * 100 - that._percentageValue * Math.PI * 100,
                isIE = /*@cc_on!@*/false || !!document.documentMode,
                isEdge = !isIE && !!window.StyleMedia;

            if (that.showProgressValue) {
                var percentage = parseInt(that._percentageValue * 100);

                that.$.label.innerHTML = that.formatFunction ? that.formatFunction(percentage) : percentage + '%';
            } else {
                that.$.label.innerHTML = '';
            }

            //Check if the browser is Edge to make the animation
            if (isIE || isEdge) {
                if (that.value === null || that.indeterminate) {
                    that.$.value.style.strokeDashoffset = '';
                    that.$.value.setAttribute('class', 'jqx-value jqx-value-animation-ms');
                    return;
                } else {
                    that.$.value.setAttribute('class', 'jqx-value');
                    that.$.value.style.strokeDashoffset = that.inverted ? -radius : radius;
                    return;
                }
            }

            that.$.value.style.strokeDashoffset = that.inverted ? -radius : radius;
            if (that.value === null || that.indeterminate) {
                that.$value.addClass('jqx-value-animation');
                return;
            }

            that.$value.removeClass('jqx-value-animation');
        }
    }], [{
        key: 'listeners',
        get: function get() {
            return {
                'resize': '_resizeHandler'
            };
        }
    }]);
    return CircularProgressBar;
}(JQX.BaseProgressBar));

JQX('jqx-progress-bar', function (_JQX$BaseProgressBar2) {
    babelHelpers.inherits(ProgressBar, _JQX$BaseProgressBar2);

    function ProgressBar() {
        babelHelpers.classCallCheck(this, ProgressBar);
        return babelHelpers.possibleConstructorReturn(this, (ProgressBar.__proto__ || Object.getPrototypeOf(ProgressBar)).apply(this, arguments));
    }

    babelHelpers.createClass(ProgressBar, [{
        key: 'template',


        /** progressbar's HTML template. */
        value: function template() {
            return '<div>\n                    <div id="value" class="jqx-value"></div>\n                    <div id="label" class ="jqx-label"></div>\n                </div>';
        }

        /** Updates the progress elements. */

    }, {
        key: '_updateProgress',
        value: function _updateProgress() {
            babelHelpers.get(ProgressBar.prototype.__proto__ || Object.getPrototypeOf(ProgressBar.prototype), '_updateProgress', this).call(this);

            var that = this;

            //Label for Percentages
            if (that.showProgressValue) {
                var percentage = parseInt(that._percentageValue * 100);

                that.$.label.innerHTML = that.formatFunction ? that.formatFunction(percentage) : percentage + '%';
            } else {
                that.$.label.innerHTML = '';
            }

            if (that.value === null || that.indeterminate) {
                that.$value.addClass('jqx-value-animation');
            } else {
                that.$value.removeClass('jqx-value-animation');
            }

            that.$.value.style.transform = that.orientation === 'horizontal' ? 'scaleX(' + that._percentageValue + ')' : 'scaleY(' + that._percentageValue + ')';
        }
    }], [{
        key: 'properties',


        /** Progressbar's properties */
        get: function get() {
            return {
                'orientation': {
                    value: 'horizontal',
                    allowedValues: ['horizontal', 'vertical'],
                    type: 'string'
                }
            };
        }
    }]);
    return ProgressBar;
}(JQX.BaseProgressBar));
'use strict';

/**
* Switch Button custom element.
*/
JQX('jqx-switch-button', function (_JQX$ToggleButton) {
    babelHelpers.inherits(SwitchButton, _JQX$ToggleButton);

    function SwitchButton() {
        babelHelpers.classCallCheck(this, SwitchButton);
        return babelHelpers.possibleConstructorReturn(this, (SwitchButton.__proto__ || Object.getPrototypeOf(SwitchButton)).apply(this, arguments));
    }

    babelHelpers.createClass(SwitchButton, [{
        key: 'template',


        /** Switch Button's Html template. */
        value: function template() {
            return '<div  id=\'container\' class=\'jqx-container\'>\n                    <div  id=\'innerContainer\' class =\'jqx-inner-container\'>\n                           <span id=\'falseContentContainer\' inner-h-t-m-l=\'[[falseContent]]\' class =\'jqx-false-content-container\'></span>\n                           <span id=\'switchThumb\' class =\'jqx-thumb\'></span>\n                           <span id=\'trueContentContainer\' inner-h-t-m-l=\'[[trueContent]]\' class =\'jqx-true-content-container\'></span>\n                    </div>\n                    <input id=\'hiddenInput\' class =\'jqx-hidden-input\' type=\'hidden\'>\n               </div>';
        }

        /** Called when the element is ready. Used for one-time configuration of the Switch Button. */

    }, {
        key: 'ready',
        value: function ready() {
            var that = this;

            that._supportCSSVariables = Boolean(window.getComputedStyle(that.$.container).getPropertyValue('--jqx-switch-button-width')) && window.CSS && window.CSS.supports && window.CSS.supports('--fake-var', 0);
            that._updateAnimationsCSSvariables('0', '0');
            babelHelpers.get(SwitchButton.prototype.__proto__ || Object.getPrototypeOf(SwitchButton.prototype), 'ready', this).call(this);
            that._htmlBindOnInitialization();
            that._resizeHandler();
            that._initializePrivateVariables();
            that._getContainersSizeAndBreakPoint();

            if (that.indeterminate) {
                that._valueCashe = that.checked;
                that.checked = null;
            }

            that._updateHidenInputNameAndValue();
        }

        /** Changes the check state wneh widget container is clicked. */

    }, {
        key: '_clickHandler',
        value: function _clickHandler() {
            var that = this;

            that._resizeHandler();

            if (that.disabled || that.readonly) {
                return;
            }

            if (that._isInactiveOn('click')) {
                return;
            }

            if (that.clickMode !== 'release' && that.clickMode !== 'pressAndRelease') {
                event.preventDefault();
                event.stopPropagation();
            } else {
                that._updateStateOnClick();
            }

            that.indeterminate = false;
            that._updateHidenInputNameAndValue();
        }

        /** Changes the check state and fires event on mouse up. */

    }, {
        key: '_mouseDownHandler',
        value: function _mouseDownHandler() {
            var that = this;

            that._updateContentProperties();

            if (that.disabled || that.readonly) {
                return;
            }

            if (that.clickMode !== 'release' && that.switchMode === 'click') {
                that._updateStateOnClick();
                that.$.fireEvent('click');
                that.indeterminate = false;
                that._updateHidenInputNameAndValue();
            }
        }

        /** Changes the check state and updates CSS variables */

    }, {
        key: '_updateStateOnClick',
        value: function _updateStateOnClick() {
            var that = this,
                trackLength = that.checked === null ? that._switchTrackLength / 2 : that._switchTrackLength;

            that._updateAnimationsCSSvariables(trackLength, -trackLength);
            that._changeCheckState();
            that.focus();
        }

        /** Changes the check state wneh widget's thumb is dragged. */

    }, {
        key: '_switchThumbDragStartHandler',
        value: function _switchThumbDragStartHandler(event) {
            var that = this;

            if (that.switchMode === 'click' && that.clickMode !== 'release') {
                event.preventDefault();
                event.stopPropagation();
            }

            if (that._isInactiveOn('drag')) {
                return;
            }

            that._mouseDown = true;
            that._getContainersSizeAndBreakPoint();
            that._dragStartOffset = that._pointerPosition = that.orientation === 'vertical' ? event.pageY : event.pageX;
            event.preventDefault();
        }
    }, {
        key: '_selectStartHandler',
        value: function _selectStartHandler(event) {
            var that = this;

            if (that._mouseDown) {
                event.preventDefault();
            }
        }

        /** Changes the check state wneh widget's thumb is dragged. */

    }, {
        key: '_switchThumbDragHandler',
        value: function _switchThumbDragHandler(event) {
            var that = this;

            if (that._isInactiveOn('drag')) {
                return;
            }

            if (that._mouseDown === false) {
                that._removeDragStyles();
                return;
            }

            var innerContainer = that.$.innerContainer,
                offset = that.$.container.getBoundingClientRect(),
                scrollDistance = that.orientation === 'vertical' ? document.body.scrollTop || document.documentElement.scrollTop : document.body.scrollLeft || document.documentElement.scrollLeft,
                containerOffset = that.orientation === 'vertical' ? offset.top + scrollDistance : offset.left + scrollDistance,
                diff = that.orientation === 'vertical' ? that._pointerPosition - innerContainer.offsetTop : that._pointerPosition - innerContainer.offsetLeft,
                pointerInRange = that._pointerPosition >= containerOffset && that._pointerPosition <= containerOffset + that._switchContainerSize;

            that.$switchThumb.addClass('dragged');
            that._pointerPosition = that.orientation === 'vertical' ? event.pageY : event.pageX;
            if (pointerInRange) {
                var currentPosition = that._pointerPosition - diff;

                if (currentPosition < -that._switchTrackLength) currentPosition = -that._switchTrackLength;
                if (currentPosition > 0) currentPosition = 0;
                that.orientation === 'vertical' ? that.$.innerContainer.style.top = currentPosition + 'px' : that.$.innerContainer.style.left = currentPosition + 'px';
            }
        }

        /** Changes the check state wneh widget's thumb is dropped. */

    }, {
        key: '_switchThumbDropHandler',
        value: function _switchThumbDropHandler(event) {
            var that = this;

            that.indeterminate = false;
            that._updateHidenInputNameAndValue();

            if (that._isInactiveOn('drag') || !that._mouseDown) {
                return;
            }

            if (event.originalEvent) {
                event.originalEvent.stopPropagation();
                event.originalEvent.preventDefault();
            }

            var switchOnPosition = that.orientation === 'vertical' ? that.$.innerContainer.offsetTop + that.$.switchThumb.offsetTop + that.$.switchThumb.clientHeight / 2 : that.$.innerContainer.offsetLeft + that.$.switchThumb.offsetLeft + that.$.switchThumb.clientWidth / 2,
                distance = that.orientation === 'vertical' ? that.$.innerContainer.offsetTop + that._switchTrackLength : that.$.innerContainer.offsetLeft + that._switchTrackLength,
                distanceInverse = that._switchTrackLength - distance;

            that.inverted ? that._updateAnimationsCSSvariables(distanceInverse, -distance) : that._updateAnimationsCSSvariables(distance, -distanceInverse);

            var switchAfterBreakPoint = switchOnPosition > that._switchBreakPoint;

            if (that.checked !== null) {
                if (!that.inverted === (switchAfterBreakPoint === that.checked)) {
                    that._changeCheckState(!that.checked);
                }
            } else {
                if (switchAfterBreakPoint) {
                    that.inverted ? that._changeCheckState(true) : that._changeCheckState(false);
                } else {
                    that.inverted ? that._changeCheckState(false) : that._changeCheckState(true);
                }
            }

            that._removeDragStyles();
        }

        /**
        * Switch button onMouseEnter event handler.
        **/

    }, {
        key: '_switchButtonOnMouseEnter',
        value: function _switchButtonOnMouseEnter() {
            var that = this;

            if (that.disabled || that.readonly) {
                return;
            }

            that.$.addClass('hovered');
        }

        /**
        * Switch button onMouseLeave event handler.
        **/

    }, {
        key: '_switchButtonOnMouseLeave',
        value: function _switchButtonOnMouseLeave() {
            var that = this;

            if (that.disabled || that.readonly) {
                return;
            }

            that.$.removeClass('hovered');
        }

        /** Checks is handler active in particular switch mode. */

    }, {
        key: '_isInactiveOn',
        value: function _isInactiveOn(switchMode) {
            var that = this,
                isInactive = that.disabled || that.readonly || that.switchMode !== switchMode;

            return isInactive;
        }

        /** Changes the check state wneh spacebar is pressed. */

    }, {
        key: '_keyUpHandler',
        value: function _keyUpHandler(event) {
            var that = this;

            if (that.disabled || that.readonly || event.keyCode !== 32) {
                return;
            }

            var trackLength = that.checked === null ? that._switchTrackLength / 2 : that._switchTrackLength;

            that._getContainersSizeAndBreakPoint();
            that._updateAnimationsCSSvariables(trackLength, -trackLength);
            that._changeCheckState();
        }

        /** Initializes private variables. */

    }, {
        key: '_initializePrivateVariables',
        value: function _initializePrivateVariables() {
            var that = this;

            that._dragStartOffset = that._switchContainerSize = that._switchTrackLength = that._switchBreakPoint = that._pointerPosition = 0;
            that._dragged = that._mouseDown = false;
        }

        /** Changes the check state. */

    }, {
        key: '_changeCheckState',
        value: function _changeCheckState(optionalValue) {
            var that = this;
            var oldValue = that.checked;

            if (oldValue === null && optionalValue !== undefined) {
                that.$.fireEvent('change', { 'value': optionalValue, 'oldValue': null });
                that.checked = optionalValue;
                return;
            }

            if (that.checked === null) {
                that.checked = true;
            } else {
                that.checked = !that.checked;
            }

            that.$.fireEvent('change', { 'value': that.checked, 'oldValue': oldValue });
            that._updateHidenInputNameAndValue();
        }

        /**
        * Get the actual width of the Switch Button and Switch Button's breakpoint.
        */

    }, {
        key: '_getContainersSizeAndBreakPoint',
        value: function _getContainersSizeAndBreakPoint() {
            var that = this;

            that._switchContainerSize = that.orientation === 'vertical' ? that.$.container.clientHeight : that.$.container.clientWidth;
            that._switchTrackLength = that.orientation === 'vertical' ? that._switchContainerSize - that.$.switchThumb.clientHeight : that._switchContainerSize - that.$.switchThumb.clientWidth;
            that._switchBreakPoint = that._switchContainerSize / 2;
        }

        /**
        * Update values of the CSS variables related to the position of the Switch Button's slider
        */

    }, {
        key: '_updateAnimationsCSSvariables',
        value: function _updateAnimationsCSSvariables(onNormalDirection, onInvertedDirection) {
            var that = this;

            if (!that._supportCSSVariables) {
                return;
            }

            that.$.container.style.setProperty('--jqx-switch-button-label-animation-offset-normal', onNormalDirection + 'px');
            that.$.container.style.setProperty('--jqx-switch-button-label-animation-offset-inverse', onInvertedDirection + 'px');
        }

        /**
        * Remove styles, related to absolute positioning of the thumb when it's dragged
        */

    }, {
        key: '_removeDragStyles',
        value: function _removeDragStyles() {
            var that = this;
            that.$switchThumb.removeClass('dragged');
            that.$.switchThumb.removeAttribute('style');
            that._supportCSSVariables ? that.$.innerContainer.removeAttribute('style') : that.$.innerContainer.style.left = '';
            that._supportCSSVariables ? that.$.innerContainer.removeAttribute('style') : that.$.innerContainer.style.top = '';
            that._mouseDown = false;
            that._dragStartOffset = 0;
        }

        /**
        * Called when a property is changed.
        */

    }, {
        key: 'propertyChangedHandler',
        value: function propertyChangedHandler(propertyName, oldValue, newValue) {
            var that = this;

            var halfTrackLength = that._switchTrackLength / 2;

            if (newValue === null) {
                if (oldValue === true) {
                    halfTrackLength = that.inverted === true ? halfTrackLength : -halfTrackLength;
                    that._updateAnimationsCSSvariables(halfTrackLength, 0);
                } else {
                    halfTrackLength = that.inverted === true ? -halfTrackLength : halfTrackLength;
                    that._updateAnimationsCSSvariables(halfTrackLength, 0);
                }
            } else if (oldValue === null) {
                that._updateAnimationsCSSvariables(halfTrackLength, -halfTrackLength);
            } else {
                that._updateAnimationsCSSvariables(that._switchTrackLength, -that._switchTrackLength);
            }

            babelHelpers.get(SwitchButton.prototype.__proto__ || Object.getPrototypeOf(SwitchButton.prototype), 'propertyChangedHandler', this).call(this, propertyName, oldValue, newValue);
            that._updateContentProperties();

            switch (propertyName) {
                case 'indeterminate':
                    if (newValue) {
                        that._valueCashe = that.checked;
                        that.checked = null;
                    } else {
                        that.checked = that._valueCashe;
                    }
                    break;
                case 'trueContent':
                    that.trueContent = newValue;
                    break;
                case 'falseContent':
                    that.falseContent = newValue;
                    break;
                case 'orientation':
                    that._resizeHandler();
                    break;
            }

            that._getContainersSizeAndBreakPoint();
            that._removeDragStyles();
            that._resizeHandler();
        }

        /** Resize handler **/

    }, {
        key: '_resizeHandler',
        value: function _resizeHandler() {
            var that = this,
                computedStyles = window.getComputedStyle(that, null),
                borderTopWidth = pxToInt('border-top-width'),
                borderRightWidth = pxToInt('border-right-width'),
                borderBottomWidth = pxToInt('border-bottom-width'),
                borderLeftWidth = pxToInt('border-left-width'),
                newWidth = that.orientation === 'vertical' ? that.offsetHeight - (borderTopWidth + borderBottomWidth) : that.offsetWidth - (borderLeftWidth + borderRightWidth);

            that._getContainersSizeAndBreakPoint();

            if (that._supportCSSVariables) {
                that.$.container.style.setProperty('--jqx-switch-button-width', newWidth + 'px');
            } else {
                if (that.orientation === 'horizontal') {
                    that.$.innerContainer.style.setProperty('width', 2 * newWidth - that.$.switchThumb.clientWidth + 'px');
                    that.$.trueContentContainer.style.setProperty('width', that._switchTrackLength + 'px');
                    that.$.falseContentContainer.style.setProperty('width', that._switchTrackLength + 'px');
                    that.$.innerContainer.style.setProperty('height', '100%');
                    that.$.trueContentContainer.style.setProperty('height', '100%');
                    that.$.falseContentContainer.style.setProperty('height', '100%');
                } else {
                    that.$.innerContainer.style.setProperty('height', 2 * newWidth - that.$.switchThumb.clientHeight + 'px');
                    that.$.trueContentContainer.style.setProperty('height', that._switchTrackLength + 'px');
                    that.$.falseContentContainer.style.setProperty('height', that._switchTrackLength + 'px');
                    that.$.innerContainer.style.setProperty('width', '100%');
                    that.$.trueContentContainer.style.setProperty('width', '100%');
                    that.$.falseContentContainer.style.setProperty('width', '100%');
                }
            }

            function pxToInt(CSSproperty) {
                return parseInt(computedStyles.getPropertyValue(CSSproperty).replace('px', ''));
            }
        }
    }], [{
        key: 'properties',

        // Switch Button's properties.
        get: function get() {
            return {
                'inverted': {
                    value: false,
                    type: 'boolean'
                },
                'orientation': {
                    value: 'horizontal',
                    allowedValues: ['horizontal', 'vertical'],
                    type: 'string'
                },
                'switchMode': {
                    value: 'drag',
                    allowedValues: ['click', 'drag'],
                    type: 'string'
                },
                'clickMode': {
                    value: 'release',
                    allowedValues: ['press', 'release', 'pressAndRelease'],
                    type: 'string'
                }
            };
        }

        /**
         * Switch Button's event listeners.
         */

    }, {
        key: 'listeners',
        get: function get() {
            return {
                'container.down': '_mouseDownHandler',
                'innerContainer.down': '_switchThumbDragStartHandler',
                'document.move': '_switchThumbDragHandler',
                'document.up': '_switchThumbDropHandler',
                'container.click': '_clickHandler',
                'mouseenter': '_switchButtonOnMouseEnter',
                'mouseleave': '_switchButtonOnMouseLeave',
                'resize': '_resizeHandler',
                'container.resize': '_resizeHandler',
                'document.selectstart': '_selectStartHandler'
            };
        }
    }]);
    return SwitchButton;
}(JQX.ToggleButton));
/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/



(function ($) {
    'use strict';
    $.jqx.jqxWidget('jqxTooltip', '', {});

    $.extend($.jqx._jqxTooltip.prototype, {
        defineInstance: function () {
            var settings = {
                //// properties
                width: 'auto',
                height: 'auto',
                position: 'default', // possible values: top, bottom, left, right, top-left, bottom-left, top-right, bottom-right, absolute, mouse, mouseenter, default
                enableBrowserBoundsDetection: true, // possible values: true, false
                content: '',
                left: 0,
                top: 0,
                absolutePositionX: 0,
                absolutePositionY: 0,
                trigger: 'hover', // possible values: hover, click, none
                showDelay: 100,
                autoHide: true, // possible values: true, false
                autoHideDelay: 3000,
                closeOnClick: true, // possible values: true, false
                disabled: false, // possible values: true, false
                animationShowDelay: 200,
                animationHideDelay: 'fast',
                showArrow: true, // possible values: true, false
                name: '',
                opacity: 0.9,
                rtl: false,
                _isOpen: false,
                opening: null,
                value: null,
                _eventsMap: {
                    'mousedown': $.jqx.mobile.getTouchEventName('touchstart'),
                    'mouseup': $.jqx.mobile.getTouchEventName('touchend')
                },

                //// events
                events: ['open', 'close', 'opening', 'closing']
            };
            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function () {
            this._isTouchDevice = $.jqx.mobile.isTouchDevice();

            // creates an array based on the name property for storing tooltip IDs
            var idArray = $.data(document.body, '_tooltipIDArray' + this.name);
            if (!idArray) {
                this.IDArray = [];
                $.data(document.body, '_tooltipIDArray' + this.name, this.IDArray);
            } else {
                this.IDArray = idArray;
            }

            // generates a new ID and adds it to an array, based on the name property
            var key = this._generatekey();
            var newID = 'jqxtooltip' + key;
            this.IDArray.push({ tooltipID: newID, tooltipHost: this.host });

            // appends the tooltip div to the body
            var tooltip = document.createElement('div');
            tooltip.setAttribute('id', newID);
            tooltip.innerHTML = '<div id="' + newID + 'Main"><div id="' + newID + 'Text"></div></div><div id="' + newID + 'Arrow"></div>';

            if ($.jqx.browser.msie) {
                tooltip.className = this.toThemeProperty('jqx-noshadow');
            }

            document.body.appendChild(tooltip);
            this._tooltip = tooltip;
            this._tooltipHelper = $(tooltip);
            if (this._tooltipHelper.initAnimate) {
                this._tooltipHelper.initAnimate();
            }

            // hides the tooltip divs
            tooltip.style.visibility = 'hidden';
            tooltip.style.display = 'none';
            tooltip.style.opacity = 0;
            tooltip.style.zIndex = 99999;

            // hides the tooltip's arrow
            var arrow = document.getElementById(newID + 'Arrow');
            this._arrow = arrow;
            if (this.showArrow === false) {
                arrow.style.visibility = 'hidden';
                arrow.style.display = 'none';
            }

            this._main = document.getElementById(newID + 'Main');
            this._text = document.getElementById(newID + 'Text');

            // sets the tooltips theme and classes
            this._setTheme();

            // sets the width and height of the tooltip
            this._setSize();

            // sets the content of the tooltip
            this._setContent();

            //sets the initial position of the tooltip
            //            this._initialPosition();

            // triggers the tooltip
            if (this.disabled === false) {
                this._trigger();
                if (this.closeOnClick === true) {
                    this._clickHide();
                }
            }
        },

        //// public methods

        // opens (shows) the tooltip
        open: function () {
            if (arguments) {
                if (arguments.length) {
                    if (arguments.length === 2) {
                        this.position = 'absolute';
                        this.left = arguments[0];
                        this.top = arguments[1];
                        this.absolutePositionX = arguments[0];
                        this.absolutePositionY = arguments[1];
                    }
                }
            }

            if (this.disabled === false && this._id() !== 'removed') {
                if (this.position === 'mouse' || this.position === 'mouseenter') {
                    var tempPosition = this.position;
                    this.position = 'default';
                    this._raiseEvent('2');
                    this._setPosition();
                    this._animateShow();
                    this.position = tempPosition;
                } else {
                    this._raiseEvent('2');
                    this._setPosition();
                    this._animateShow();
                }
            }
        },

        close: function (delay) {
            var me = this,
                oldIE = $.jqx.browser.msie && $.jqx.browser.version < 9;
            if (typeof (delay) === 'object' && $.isEmptyObject(delay)) {
                delay = this.animationHideDelay;
            }
            var opacityValue = parseFloat(me._tooltip.style.opacity);

            var hide = function () {
                clearTimeout(me.autoHideTimeout);
                me._raiseEvent('3');
                me._tooltipHelper.animate({
                    opacity: 0
                }, delay, function () {
                    me._tooltip.style.visibility = 'hidden';
                    me._tooltip.style.display = 'none';
                    me._raiseEvent('1');
                    me._isOpen = false;
                });
            };

            if (this._isOpen === false && opacityValue !== 0) {
                //me._tooltipHelper.stop();
                hide();
                return;
            }

            if (this._isOpen === true && (!oldIE && opacityValue === this.opacity || oldIE)) {
                hide();
            }
        },

        // removes the tooltip
        destroy: function () {
            var length = this.IDArray.length;
            this._removeHandlers();

            this._tooltipHelper.remove();
            for (var i = 0; i < length; i++) {
                if (this.IDArray[i].tooltipHost === this.host) {
                    this.IDArray.splice(i, 1);
                    break;
                }
            }
            this.host.removeData('jqxTooltip');
        },

        //// private methods

        // refreshes the tooltip
        refresh: function (initialRefresh) {
            if (initialRefresh === true) {
                return;
            }

            var me = this;

            if (this.rtl) {
                me._text.className += ' ' + me.toThemeProperty('jqx-rtl');
                me._text.style.direction = 'rtl';
            }

            var opacityValue = parseFloat(me._tooltip.style.opacity);
            if (this._id() !== 'removed') {
                if (this.disabled === true && this._isOpen === true && opacityValue === this.opacity) {
                    clearTimeout(this.autoHideTimeout);
                    //this._tooltipHelper.stop();
                    this._tooltipHelper.animate({
                        opacity: 0
                    }, this.animationHideDelay, function () {
                        me._tooltip.style.visibility = 'hidden';
                        me._tooltip.style.display = 'none';
                        me._isOpen = false;
                    });
                }
                this._setTheme();
                this._setContent();
                this._setSize();
                if (this.position !== 'mouse' && this.position !== 'mouseenter') {
                    this._setPosition();
                }
                this._removeHandlers();
                if (this.disabled === false) {
                    this._trigger();
                    if (this.closeOnClick === true) {
                        this._clickHide();
                    }
                }
            }
        },

        // executed when a property is changed
        propertyChangedHandler: function (object, key, oldvalue, value) { //ignore jslint
            if (key === 'content') {
                this.changeContentFlag = true;
            }
            object.refresh();
        },

        // raises an event
        _raiseEvent: function (id, args) {
            var evt = this.events[id];
            var event = new $.Event(evt);
            event.owner = this;
            event.args = args;

            var result;
            try {
                result = this.host.trigger(event);
            }
            catch (error) {
            }

            return result;
        },

        // generates a random number, used for unique id
        _generatekey: function () {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4());
        },

        // selects the id of the current tooltip
        _id: function () {
            var tempId, TrueID;
            var length = this.IDArray.length;
            for (var i = 0; i < length; i++) {
                if (this.IDArray[i].tooltipHost === this.host) {
                    tempId = this.IDArray[i].tooltipID;
                    TrueID = '#' + tempId;
                    break;
                }
            }
            if (TrueID === undefined) {
                TrueID = 'removed';
            }
            return TrueID;
        },

        // positions the tooltip
        _setPosition: function (event) {
            var me = this,
                tooltip = me._tooltip;
            if ((this._isOpen === false && parseFloat(tooltip.style.opacity) === 0) || this.changeContentFlag === true) {
                if (!event && (this.position === 'mouse' || this.position === 'mouseenter')) {
                    return;
                }
                tooltip.style.display = 'block';
                this.changeContentFlag = false;
                this.documentTop = document.documentElement.scrollTop;
                this.documentLeft = document.documentElement.scrollLeft;
                this.windowWidth = window.innerWidth;
                this.windowHeight = window.innerHeight;

                this.hostWidth = me.element.offsetWidth;
                this.hostHeight = me.element.offsetHeight;
                this.tooltipWidth = tooltip.offsetWidth;
                this.tooltipHeight = tooltip.offsetHeight;
                this.hostOffset = this.host.offset();
                this.tooltipOffset = me._tooltipHelper.offset();
                this.defaultOffset = 30;

                this.offsetHorizontal = parseInt(this.left, 10); // horizontal offset
                this.offsetVertical = parseInt(this.top, 10); // vertical offset

                var $arrow = me._arrow,
                    arrowHelper = $($arrow),
                    $main = me._main,
                    mainHelper = $($main),
                    mainWidth = $main.offsetWidth,
                    mainHeight = $main.offsetHeight,
                    style;

                this.arrowSize = 5; // defines the size of the tooltip arrow
                this.tooltipMainOffset = mainHelper.offset();
                this.tooltipArrowOffset = {};

                switch (this.position) {
                    case 'top':
                        this.tooltipOffset.left = this.hostOffset.left + this.hostWidth / 2 - this.tooltipWidth / 2 + this.offsetHorizontal;
                        this.tooltipOffset.top = this.hostOffset.top - this.tooltipHeight - this.arrowSize + this.offsetVertical;

                        this._detectBrowserBounds();

                        // arrow specifications
                        this.tooltipMainOffset = mainHelper.offset();
                        me._removeClass($arrow, me.toThemeProperty('jqx-tooltip-arrow-l-r'));
                        $arrow.className += ' ' + me.toThemeProperty('jqx-tooltip-arrow-t-b');
                        $arrow.style.borderWidth = this.arrowSize + 'px ' + this.arrowSize + 'px 0px';
                        this.tooltipArrowOffset.left = this.tooltipMainOffset.left + (mainWidth / 2 - this.arrowSize);
                        this.tooltipArrowOffset.top = this.tooltipMainOffset.top + mainHeight;
                        arrowHelper.offset({ top: this.tooltipArrowOffset.top, left: this.tooltipArrowOffset.left });
                        break;

                    case 'bottom':
                        this.tooltipOffset.left = this.hostOffset.left + this.hostWidth / 2 - this.tooltipWidth / 2 + this.offsetHorizontal;
                        this.tooltipOffset.top = this.hostOffset.top + this.hostHeight + this.arrowSize + this.offsetVertical;

                        this._detectBrowserBounds();

                        // arrow specifications
                        this.tooltipMainOffset = mainHelper.offset();
                        me._removeClass($arrow, me.toThemeProperty('jqx-tooltip-arrow-l-r'));
                        $arrow.className += ' ' + me.toThemeProperty('jqx-tooltip-arrow-t-b');
                        $arrow.style.borderWidth = '0 ' + this.arrowSize + 'px ' + this.arrowSize + 'px';
                        this.tooltipArrowOffset.left = this.tooltipMainOffset.left + (mainWidth / 2 - this.arrowSize);
                        this.tooltipArrowOffset.top = this.tooltipMainOffset.top - this.arrowSize;
                        arrowHelper.offset({ top: this.tooltipArrowOffset.top, left: this.tooltipArrowOffset.left });
                        break;

                    case 'left':
                        if (window.getComputedStyle) {
                            style = window.getComputedStyle($main);
                        } else {
                            style = $main.currentStyle;
                        }
                        this.tooltipOffset.left = this.hostOffset.left - this.tooltipWidth - this.arrowSize + this.offsetHorizontal - (parseInt(style.borderLeftWidth, 10) + parseInt(style.borderRightWidth, 10));
                        this.tooltipOffset.top = this.hostOffset.top + this.hostHeight / 2 - this.tooltipHeight / 2 + this.offsetVertical;

                        this._detectBrowserBounds();

                        // arrow specifications
                        me._removeClass($arrow, me.toThemeProperty('jqx-tooltip-arrow-t-b'));
                        $arrow.className += ' ' + me.toThemeProperty('jqx-tooltip-arrow-l-r');
                        $arrow.style.borderWidth = this.arrowSize + 'px 0px ' + this.arrowSize + 'px ' + this.arrowSize + 'px';
                        this.tooltipMainOffset = mainHelper.offset();
                        this.tooltipArrowOffset.left = this.tooltipMainOffset.left + mainWidth;
                        this.tooltipArrowOffset.top = this.tooltipMainOffset.top + (mainHeight) / 2 - this.arrowSize;
                        arrowHelper.offset({ top: this.tooltipArrowOffset.top, left: this.tooltipArrowOffset.left });
                        break;

                    case 'right':
                        this.tooltipOffset.left = this.hostOffset.left + this.hostWidth + this.arrowSize + this.offsetHorizontal;
                        this.tooltipOffset.top = this.hostOffset.top + this.hostHeight / 2 - this.tooltipHeight / 2 + this.offsetVertical;
                        this.tooltipOffset.top = parseInt(this.tooltipOffset.top, 10);
                        this._detectBrowserBounds();

                        // arrow specifications
                        this.tooltipMainOffset = mainHelper.offset();
                        me._removeClass($arrow, me.toThemeProperty('jqx-tooltip-arrow-t-b'));
                        $arrow.className += ' ' + me.toThemeProperty('jqx-tooltip-arrow-l-r');
                        $arrow.style.borderWidth = this.arrowSize + 'px ' + this.arrowSize + 'px ' + this.arrowSize + 'px 0px';
                        this.tooltipArrowOffset.left = (this.tooltipMainOffset.left - this.arrowSize);
                        this.tooltipArrowOffset.top = this.tooltipMainOffset.top + ($main.offsetHeight) / 2 - this.arrowSize;
                        arrowHelper.offset({ top: this.tooltipArrowOffset.top, left: this.tooltipArrowOffset.left });
                        break;

                    case 'top-left':
                        this.tooltipOffset.left = this.hostOffset.left + this.defaultOffset - this.tooltipWidth + this.offsetHorizontal;
                        this.tooltipOffset.top = this.hostOffset.top - this.tooltipHeight - this.arrowSize + this.offsetVertical;

                        this._detectBrowserBounds();

                        // arrow specifications
                        this.tooltipMainOffset = mainHelper.offset();
                        me._removeClass($arrow, me.toThemeProperty('jqx-tooltip-arrow-l-r'));
                        $arrow.className += ' ' + me.toThemeProperty('jqx-tooltip-arrow-t-b');
                        $arrow.style.borderWidth = this.arrowSize + 'px ' + this.arrowSize + 'px  0px';
                        this.tooltipArrowOffset.left = this.tooltipMainOffset.left + mainWidth - 6 * this.arrowSize;
                        this.tooltipArrowOffset.top = this.tooltipMainOffset.top + mainHeight;
                        arrowHelper.offset({ top: this.tooltipArrowOffset.top, left: this.tooltipArrowOffset.left });
                        break;

                    case 'bottom-left':
                        this.tooltipOffset.left = this.hostOffset.left + this.defaultOffset - this.tooltipWidth + this.offsetHorizontal;
                        this.tooltipOffset.top = this.hostOffset.top + this.hostHeight + this.arrowSize + this.offsetVertical;

                        this._detectBrowserBounds();

                        // arrow specifications
                        this.tooltipMainOffset = mainHelper.offset();
                        me._removeClass($arrow, me.toThemeProperty('jqx-tooltip-arrow-l-r'));
                        $arrow.className += ' ' + me.toThemeProperty('jqx-tooltip-arrow-t-b');
                        $arrow.style.borderWidth = '0 ' + this.arrowSize + 'px ' + this.arrowSize + 'px';
                        this.tooltipArrowOffset.left = this.tooltipMainOffset.left + mainWidth - 6 * this.arrowSize;
                        this.tooltipArrowOffset.top = this.tooltipMainOffset.top - this.arrowSize;
                        arrowHelper.offset({ top: this.tooltipArrowOffset.top, left: this.tooltipArrowOffset.left });
                        break;

                    case 'top-right':
                        this.tooltipOffset.left = this.hostOffset.left + this.hostWidth - this.defaultOffset + this.offsetHorizontal;
                        this.tooltipOffset.top = this.hostOffset.top - this.tooltipHeight - this.arrowSize + this.offsetVertical;

                        this._detectBrowserBounds();

                        // arrow specifications
                        this.tooltipMainOffset = mainHelper.offset();
                        me._removeClass($arrow, me.toThemeProperty('jqx-tooltip-arrow-l-r'));
                        $arrow.className += ' ' + me.toThemeProperty('jqx-tooltip-arrow-t-b');
                        $arrow.style.borderWidth = this.arrowSize + 'px ' + this.arrowSize + 'px  0px';
                        this.tooltipArrowOffset.left = this.tooltipMainOffset.left + 4 * this.arrowSize;
                        this.tooltipArrowOffset.top = this.tooltipMainOffset.top + mainHeight;
                        arrowHelper.offset({ top: this.tooltipArrowOffset.top, left: this.tooltipArrowOffset.left });
                        break;

                    case 'bottom-right':
                        this.tooltipOffset.left = this.hostOffset.left + this.hostWidth - this.defaultOffset + this.offsetHorizontal;
                        this.tooltipOffset.top = this.hostOffset.top + this.hostHeight + this.arrowSize + this.offsetVertical;

                        this._detectBrowserBounds();

                        // arrow specifications
                        this.tooltipMainOffset = mainHelper.offset();
                        me._removeClass($arrow, me.toThemeProperty('jqx-tooltip-arrow-l-r'));
                        $arrow.className += ' ' + me.toThemeProperty('jqx-tooltip-arrow-t-b');
                        $arrow.style.borderWidth = '0 ' + this.arrowSize + 'px ' + this.arrowSize + 'px';
                        this.tooltipArrowOffset.left = this.tooltipMainOffset.left + 4 * this.arrowSize;
                        this.tooltipArrowOffset.top = this.tooltipMainOffset.top - this.arrowSize;
                        arrowHelper.offset({ top: this.tooltipArrowOffset.top, left: this.tooltipArrowOffset.left });
                        break;

                    case 'absolute':
                        me._tooltipHelper.offset({ top: this.absolutePositionY, left: this.absolutePositionX });

                        // arrow specifications, NO arrow
                        $arrow.style.borderWidth = '0px';
                        break;

                    case 'mouse':
                        if (this._isTouchDevice === false) {
                            switch (this.trigger) {
                                case 'hover':
                                    if (this.mouseHoverTimeout) {
                                        clearTimeout(this.mouseHoverTimeout);
                                    }
                                    this.mouseHoverTimeout = setTimeout(function () {
                                        me.tooltipOffset.left = event.pageX + 10;
                                        me.tooltipOffset.top = event.pageY + 10;
                                        me._detectBrowserBounds();
                                    }, this.showDelay);
                                    break;
                                case 'click':
                                    this.tooltipOffset.left = event.pageX + 10;
                                    this.tooltipOffset.top = event.pageY + 10;
                                    this._detectBrowserBounds();
                                    break;
                            }
                        } else {
                            var x = event.pageX;
                            var y = event.pageY;
                            if (event.originalEvent) {
                                var touch;
                                if (event.originalEvent.touches && event.originalEvent.touches.length) {
                                    touch = event.originalEvent.touches[0];
                                } else if (event.originalEvent.changedTouches && event.originalEvent.changedTouches.length) {
                                    touch = event.originalEvent.changedTouches[0];
                                }
                                if (touch !== undefined) {
                                    x = touch.pageX;
                                    y = touch.pageY;
                                }
                            }

                            this.tooltipOffset.left = x + 10;
                            this.tooltipOffset.top = y + 10;
                            this._detectBrowserBounds();
                        }

                        // arrow specifications, NO arrow
                        $arrow.style.borderWidth = '0px';

                        break;

                    case 'mouseenter':
                        var mousecoordinates = { top: event.pageY, left: event.pageX };

                        // mouse from TOP
                        if ((mousecoordinates.top < (this.hostOffset.top + 10)) && (mousecoordinates.top > (this.hostOffset.top - 10))) {
                            this.tooltipOffset.left = mousecoordinates.left - this.tooltipWidth / 2;
                            this.tooltipOffset.top = this.hostOffset.top - this.tooltipHeight - this.arrowSize;

                            this._detectBrowserBounds();

                            // arrow specifications, the same as TOP arrow
                            this.tooltipMainOffset = mainHelper.offset();
                            me._removeClass($arrow, me.toThemeProperty('jqx-tooltip-arrow-l-r'));
                            $arrow.className += ' ' + me.toThemeProperty('jqx-tooltip-arrow-t-b');
                            $arrow.style.borderWidth = this.arrowSize + 'px ' + this.arrowSize + 'px  0px';
                            this.tooltipArrowOffset.left = this.tooltipMainOffset.left + (mainWidth / 2 - this.arrowSize);
                            this.tooltipArrowOffset.top = this.tooltipMainOffset.top + mainHeight;
                            arrowHelper.offset({ top: this.tooltipArrowOffset.top, left: this.tooltipArrowOffset.left });
                        }
                            // mouse from BOTTOM
                        else if ((mousecoordinates.top < ((this.hostOffset.top + this.hostHeight) + 10)) && (mousecoordinates.top > ((this.hostOffset.top + this.hostHeight) - 10))) {
                            this.tooltipOffset.left = mousecoordinates.left - this.tooltipWidth / 2;
                            this.tooltipOffset.top = this.hostOffset.top + this.hostHeight + this.arrowSize;

                            this._detectBrowserBounds();

                            // arrow specifications, the same as BOTTOM arrow
                            this.tooltipMainOffset = mainHelper.offset();
                            me._removeClass($arrow, me.toThemeProperty('jqx-tooltip-arrow-l-r'));
                            $arrow.className += ' ' + me.toThemeProperty('jqx-tooltip-arrow-t-b');
                            $arrow.style.borderWidth = '0 ' + this.arrowSize + 'px ' + this.arrowSize + 'px';
                            this.tooltipArrowOffset.left = this.tooltipMainOffset.left + (mainWidth / 2 - this.arrowSize);
                            this.tooltipArrowOffset.top = this.tooltipMainOffset.top - this.arrowSize;
                            arrowHelper.offset({ top: this.tooltipArrowOffset.top, left: this.tooltipArrowOffset.left });
                        }
                            // mouse from LEFT
                        else if ((mousecoordinates.left < (this.hostOffset.left + 10)) && (mousecoordinates.left > (this.hostOffset.left - 10))) {
                            if (window.getComputedStyle) {
                                style = window.getComputedStyle($main);
                            } else {
                                style = $main.currentStyle;
                            }
                            this.tooltipOffset.left = this.hostOffset.left - this.tooltipWidth - this.arrowSize - (parseInt(style.borderLeftWidth, 10) + parseInt(style.borderRightWidth, 10));
                            this.tooltipOffset.top = mousecoordinates.top - this.tooltipHeight / 2;

                            this._detectBrowserBounds();

                            // arrow specifications, the same as LEFT arrow
                            this.tooltipMainOffset = mainHelper.offset();
                            me._removeClass($arrow, me.toThemeProperty('jqx-tooltip-arrow-t-b'));
                            $arrow.className += ' ' + me.toThemeProperty('jqx-tooltip-arrow-l-r');
                            $arrow.style.borderWidth = this.arrowSize + 'px 0px ' + this.arrowSize + 'px ' + this.arrowSize + 'px';
                            this.tooltipMainOffset = mainHelper.offset();
                            this.tooltipArrowOffset.left = this.tooltipMainOffset.left + mainWidth;
                            this.tooltipArrowOffset.top = this.tooltipMainOffset.top + (mainHeight) / 2 - this.arrowSize;
                            arrowHelper.offset({ top: this.tooltipArrowOffset.top, left: this.tooltipArrowOffset.left });
                        }
                            // mouse from RIGHT
                        else if ((mousecoordinates.left < (this.hostOffset.left + this.hostWidth + 10)) && (mousecoordinates.left > (this.hostOffset.left + this.hostWidth - 10))) {
                            this.tooltipOffset.left = this.hostOffset.left + this.hostWidth + this.arrowSize;
                            this.tooltipOffset.top = mousecoordinates.top - this.tooltipHeight / 2;

                            this._detectBrowserBounds();

                            // arrow specifications, the same as RIGHT arrow
                            this.tooltipMainOffset = mainHelper.offset();
                            me._removeClass($arrow, me.toThemeProperty('jqx-tooltip-arrow-t-b'));
                            $arrow.className += ' ' + me.toThemeProperty('jqx-tooltip-arrow-l-r');
                            $arrow.style.borderWidth = this.arrowSize + 'px ' + this.arrowSize + 'px ' + this.arrowSize + 'px 0px';
                            this.tooltipMainOffset = mainHelper.offset();
                            this.tooltipArrowOffset.left = (this.tooltipMainOffset.left - this.arrowSize);
                            this.tooltipArrowOffset.top = this.tooltipMainOffset.top + (mainHeight) / 2 - this.arrowSize;
                            arrowHelper.offset({ top: this.tooltipArrowOffset.top, left: this.tooltipArrowOffset.left });
                        }
                        break;

                    case 'default':

                        // similar to 'bottom-right' but without this.offsetHorizontal and this.offsetVertical
                        this.tooltipOffset.left = this.hostOffset.left + this.hostWidth - this.defaultOffset;
                        this.tooltipOffset.top = this.hostOffset.top + this.hostHeight + this.arrowSize;

                        this._detectBrowserBounds();

                        // arrow specifications
                        this.tooltipMainOffset = mainHelper.offset();
                        me._removeClass($arrow, me.toThemeProperty('jqx-tooltip-arrow-l-r'));
                        $arrow.className += ' ' + me.toThemeProperty('jqx-tooltip-arrow-t-b');
                        $arrow.style.borderWidth = '0 ' + this.arrowSize + 'px ' + this.arrowSize + 'px';
                        this.tooltipArrowOffset.left = this.tooltipMainOffset.left + 4 * this.arrowSize;
                        this.tooltipArrowOffset.top = this.tooltipMainOffset.top - this.arrowSize;
                        arrowHelper.offset({ top: this.tooltipArrowOffset.top, left: this.tooltipArrowOffset.left });
                        break;
                }
            }
        },

        // sets the content of the tooltip
        _setContent: function () {
            this._text.innerHTML = this.content;
        },

        opened: function () {
            return this._isOpen && this.host.css('display') == 'block' && this.host.css('visibility') == 'visible';
        },

        // shows the tooltip with animation
        _animateShow: function () {
            this._closeAll();
            clearTimeout(this.autoHideTimeout);
            var opacityValue = parseFloat(this._tooltip.style.opacity);
            if (this._isOpen === false && opacityValue === 0) {
                var me = this;
                me._tooltip.style.visibility = 'visible';
                me._tooltip.style.display = 'block';
                //me._tooltipHelper.stop();
                me._tooltip.style.opacity = 0;
                if (this.opening) {
                    var canOpen = this.opening(this);
                    if (canOpen === false) {
                        return;
                    }
                }

                me._tooltipHelper.animate({
                    opacity: this.opacity
                }, this.animationShowDelay, function () {
                    me._raiseEvent('0');
                    me._isOpen = true;

                    // creates a variable, showing the instance of the opened tooltip
                    //var opened_tooltip = $.data(document.body, "_openedTooltip" + me.name);

                    me.openedTooltip = me;
                    $.data(document.body, '_openedTooltip' + me.name, me);
                    if (me.autoHideTimeout) { clearTimeout(me.autoHideTimeout); }
                    if (me.autoHideDelay > 0 && me.autoHide === true) {
                        me.autoHideTimeout = setTimeout(function () {
                            me._autoHide();
                        }, me.autoHideDelay);
                    }
                });
            }
        },

        // triggers the tooltip
        _trigger: function () {
            if (this._id() !== 'removed') {
                var me = this;
                if (this._isTouchDevice === false) {
                    switch (this.trigger) {
                        case 'hover':
                            if (this.position === 'mouse') {
                                this.addHandler(this.host, 'mousemove.tooltip', function (event) {
                                    if (me._enterFlag === 1) {
                                        me._raiseEvent('2');
                                        me._setPosition(event);
                                        clearTimeout(me.hoverShowTimeout);
                                        me.hoverShowTimeout = setTimeout(function () {
                                            me._animateShow();
                                            me._enterFlag = 0;
                                        }, me.showDelay);
                                    }
                                });
                                this.addHandler(this.host, 'mouseenter.tooltip', function () {
                                    if (me._leaveFlag !== 0) {
                                        me._enterFlag = 1;
                                    }
                                });
                                this.addHandler(this.host, 'mouseleave.tooltip', function (event) {
                                    me._leaveFlag = 1;
                                    clearTimeout(me.hoverShowTimeout);

                                    var tooltipbounds = me._tooltipHelper.offset();
                                    var width = me._tooltip.offsetWidth;
                                    var height = me._tooltip.offsetHeight;

                                    if (parseInt(event.pageX, 10) < parseInt(tooltipbounds.left, 10) || parseInt(event.pageX, 10) > parseInt(tooltipbounds.left, 10) + width) {
                                        me.close();
                                    }
                                    if (parseInt(event.pageY, 10) < parseInt(tooltipbounds.top, 10) || parseInt(event.pageY, 10) > parseInt(tooltipbounds.top, 10) + height) {
                                        me.close();
                                    }
                                });
                                this.addHandler(me._tooltipHelper, 'mouseleave.tooltip', function (event) {
                                    me._checkBoundariesAuto(event);
                                    if (me._clickFlag !== 0 && me._autoFlag !== 0) {
                                        me._leaveFlag = 0;
                                    } else {
                                        me._leaveFlag = 1;
                                        me.close();
                                    }
                                });
                            } else {
                                this.addHandler(this.host, 'mouseenter.tooltip', function (event) {
                                    clearTimeout(me.hoverShowTimeout);
                                    me.hoverShowTimeout = setTimeout(function () {
                                        me._raiseEvent('2');
                                        me._setPosition(event);
                                        me._animateShow();
                                    }, me.showDelay);
                                });
                                this.addHandler(this.host, 'mouseleave.tooltip', function (event) {
                                    me._leaveFlag = 1;
                                    clearTimeout(me.hoverShowTimeout);

                                    if (me.autoHide) {
                                        var x = event.pageX;
                                        var y = event.pageY;
                                        var tooltipbounds = me._tooltipHelper.offset();
                                        var left = tooltipbounds.left;
                                        var top = tooltipbounds.top;
                                        var width = me._tooltip.offsetWidth;
                                        var height = me._tooltip.offsetHeight;

                                        if (parseInt(x, 10) < parseInt(left, 10) || parseInt(x, 10) > parseInt(left, 10) + width || parseInt(y, 10) < parseInt(top, 10) || parseInt(y, 10) > parseInt(top, 10) + height) {
                                            me.close();
                                        }
                                    }
                                });
                                this.addHandler(me._tooltipHelper, 'mouseleave.tooltip', function (event) {
                                    me._checkBoundariesAuto(event);
                                    if (me._clickFlag !== 0 && me._autoFlag !== 0) {
                                        me._leaveFlag = 0;
                                    } else {
                                        me._leaveFlag = 1;
                                        if (me.autoHide) {
                                            me.close();
                                        }
                                    }
                                });
                            }
                            break;
                        case 'click':
                            this.addHandler(this.host, 'click.tooltip', function (event) {
                                if (me.position === 'mouseenter') {
                                    me.position = 'mouse';
                                }
                                me._raiseEvent('2');
                                me._setPosition(event);
                                me._animateShow();
                            });
                            break;
                        case 'none':
                            break;
                    }
                } else {
                    // if the device is touch
                    if (this.trigger !== 'none') {
                        this.addHandler(this.host, 'touchstart.tooltip', function (event) {
                            if (me.position === 'mouseenter') {
                                me.position = 'mouse';
                            }
                            me._raiseEvent('2');
                            me._setPosition(event);
                            me._animateShow();
                        });
                    }
                }
            }
        },

        // automatically hides the tooltip
        _autoHide: function () {
            var me = this;

            var opacityValue = parseFloat(me._tooltip.style.opacity);
            if (this.autoHide === true && this._isOpen === true && opacityValue >= this.opacity) {
                me._raiseEvent('3');
                me._tooltipHelper.animate({
                    opacity: 0
                }, me.animationHideDelay, function () {
                    me._tooltip.style.visibility = 'hidden';
                    me._tooltip.style.display = 'none';
                    me._raiseEvent('1');
                    me._isOpen = false;
                });
            }
        },

        // hides the tooltip when it is clicked
        _clickHide: function () {
            var me = this;
            this.addHandler(me._tooltipHelper, 'click.tooltip', function (event) {
                me._checkBoundariesClick(event);
                me.close();
            });
        },

        // sets the width and height of the tooltip
        _setSize: function () {
            var that = this;
            that._tooltip.style.width = that._toPx(that.width);
            that._tooltip.style.height = that._toPx(that.height);
        },

        resize: function () {
            this._setSize();
        },

        // sets the tooltips theme and classes
        _setTheme: function () {
            var that = this;
            that._tooltip.className += ' ' + that.toThemeProperty('jqx-tooltip jqx-popup');
            that._main.className += ' ' + that.toThemeProperty('jqx-widget jqx-fill-state-normal jqx-tooltip-main');
            that._text.className += ' ' + that.toThemeProperty('jqx-widget jqx-fill-state-normal jqx-tooltip-text');
            if (that._arrow) {
                that._arrow.className += ' ' + that.toThemeProperty('jqx-widget jqx-fill-state-normal jqx-tooltip-arrow');
            }
        },

        // sets the initial position of the tooltip as 'default'
        _initialPosition: function () {
            var tempPosition = this.position;
            this.position = 'default';
            this._setPosition();
            this.position = tempPosition;
        },

        // checks the tooltip for browser bounds conflicts and sets the tooltip's offset accordingly (if enableBrowserBoundsDetection == true), otherwise just sets the tooltip's offset
        _detectBrowserBounds: function () {
            var me = this,
                tooltip = me._tooltipHelper;
            if (this.enableBrowserBoundsDetection) {
                // top and left
                if (this.tooltipOffset.top < this.documentTop && this.tooltipOffset.left < 0) {
                    tooltip.offset({ top: this.documentTop, left: this.documentLeft });
                    // top and right
                } else if (this.tooltipOffset.top < this.documentTop && (this.tooltipOffset.left + this.tooltipWidth) > this.windowWidth + this.documentLeft) {
                    tooltip.offset({ top: this.documentTop, left: (this.windowWidth + this.documentLeft - this.tooltipWidth) });
                    // top
                } else if (this.tooltipOffset.top < this.documentTop) {
                    tooltip.offset({ top: this.documentTop, left: this.tooltipOffset.left });
                    // bottom and left
                } else if ((this.tooltipOffset.top + this.tooltipHeight) > (this.windowHeight + this.documentTop) && this.tooltipOffset.left < 0) {
                    tooltip.offset({ top: (this.windowHeight + this.documentTop - this.tooltipHeight), left: this.documentLeft });
                    // bottom and right
                } else if ((this.tooltipOffset.top + this.tooltipHeight) > (this.windowHeight + this.documentTop) && (this.tooltipOffset.left + this.tooltipWidth) > this.windowWidth + this.documentLeft) {
                    tooltip.offset({ top: (this.windowHeight + this.documentTop - this.tooltipHeight), left: (this.windowWidth + this.documentLeft - this.tooltipWidth) });
                    // bottom
                } else if ((this.tooltipOffset.top + this.tooltipHeight) > (this.windowHeight + this.documentTop)) {
                    tooltip.offset({ top: (this.windowHeight + this.documentTop - this.tooltipHeight), left: this.tooltipOffset.left });
                    // left
                } else if (this.tooltipOffset.left < 0) {
                    tooltip.offset({ top: this.tooltipOffset.top, left: this.documentLeft });
                    // right
                } else if ((this.tooltipOffset.left + this.tooltipWidth) > this.windowWidth + this.documentLeft) {
                    tooltip.offset({ top: this.tooltipOffset.top, left: (this.windowWidth + this.documentLeft - this.tooltipWidth) });
                    // no conflict
                } else {
                    tooltip.offset({ top: this.tooltipOffset.top, left: this.tooltipOffset.left });
                }
                // if enableBrowserBoundsDetection == false, the same as no conflict case
            } else {
                tooltip.offset({ top: this.tooltipOffset.top, left: this.tooltipOffset.left });
            }
        },

        // checks if a mouseevent was within the boundaries of the host
        _checkBoundaries: function (event) {
            if (event.pageX >= this.hostOffset.left && event.pageX <= (this.hostOffset.left + this.hostWidth) && event.pageY >= this.hostOffset.top && event.pageY <= (this.hostOffset.top + this.hostHeight)) {
                return true;
            } else {
                return false;
            }
        },

        // checks if a click was within the boundaries of the host
        _checkBoundariesClick: function (event) {
            if (this._checkBoundaries(event)) {
                this._clickFlag = 1;
            } else {
                this._clickFlag = 0;
            }
        },

        // checks if the mouse was was within the boundaries of the host when the tooltip was automatically closed
        _checkBoundariesAuto: function (event) {
            if (this._checkBoundaries(event)) {
                this._autoFlag = 1;
            } else {
                this._autoFlag = 0;
            }
        },

        // removes all event handlers
        _removeHandlers: function () {
            this.removeHandler(this.host, 'mouseenter.tooltip');
            this.removeHandler(this.host, 'mousemove.tooltip');
            this.removeHandler(this.host, 'mouseleave.tooltip');
            this.removeHandler(this.host, 'click.tooltip');
            this.removeHandler(this.host, 'touchstart.tooltip');
            this.removeHandler(this._tooltipHelper, 'click.tooltip');
            this.removeHandler(this._tooltipHelper, 'mouseleave.tooltip');
        },

        // closes all tooltips, created together
        _closeAll: function () {
            for (var i = 0; i < this.IDArray.length; i++) {
                var iterationID = this.IDArray[i].tooltipID,
                    element = document.getElementById(iterationID);
                if (element !== this._tooltip) {
                    element.style.opacity = 0;
                    element.style.visibility = 'hidden';
                    element.style.display = 'none';
                    this._isOpen = false;
                }
            }
        },

        _toPx: function (value) {
            if (typeof value === 'number') {
                return value + 'px';
            } else {
                return value;
            }
        },

        _removeClass: function (element, classToRemove) {
            $(element).removeClass(classToRemove);
        }
    });
})(jqxBaseFramework); //ignore jslint

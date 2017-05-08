/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {
    'use strict';

    $.jqx.jqxWidget('jqxPopover', '', {});

    $.extend($.jqx._jqxPopover.prototype, {
        defineInstance: function () {
            var settings = {
                arrowOffsetValue: null,
                animationType: 'fade', // possible values: 'fade', 'none'
                position: 'bottom', // only when 'animationType' is set to 'slide'; possible values: 'left', 'right', 'top', 'bottom'
                animationOpenDelay: 'fast', // possible values: 'fast', 'slow', number (in milliseconds)
                animationCloseDelay: 'fast', // possible values: 'fast', 'slow', number (in milliseconds)
                autoClose: true,
                isModal: false,
                height: null,
                initContent: null,
                offset: null,
                rtl: false,
                showArrow: true,
                showCloseButton: false,
                selector: null, // id of the toggler
                title: "",
                width: null,
                
                // internal flag variables
                _toggleElement: null,
                _popover: null,
                _popoverTop: 0,
                _popoverLeft: 0,
                _init: false,
                _ie8: ($.jqx.browser.msie && $.jqx.browser.version === 8),
                _ie7: ($.jqx.browser.msie && $.jqx.browser.version < 8),
                _left: 0,
                _top: 0,

                // events
                events: ['open', 'close']
            };
            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function () {
            var that = this;
            that._content = that.host.children();
        },

        render: function () {
            var that = this;
            var contentId = that.element.id;
            that._content.detach();
            that._toggleElement = $(that.selector);
            if (that._toggleElement.length === 0) {
                throw new Error('jqxPopover: Invalid Popover toggler: "' + that.selector + '".');
            } else if (that._toggleElement === null) {
                throw new Error('jqxPopover: Missing Popover toggler.');
            }
       
            var template = $('<div id="' + contentId + '" class="' + that.toThemeProperty("jqx-popover") + '"><div class="' + that.toThemeProperty("jqx-popover-arrow") + '"></div><div class="' + that.toThemeProperty("jqx-popover-title") + '"></div><div class="' + that.toThemeProperty("jqx-popover-content") + '"></div></div>');
            $("body").append(template);
             
            var data = that.host.data();
            that.host.detach();
            that.host = template;
            that.host.data(data);
            that.element = template[0];
            that.element.id = contentId;

            that._popover = $("#" + contentId);
            var title = that._popover.find(".jqx-popover-title");
            title.append(that.title);
            var content = that._popover.find(".jqx-popover-content");
            content.append(that._content);
            that._popover.hide();
            that._removeHandlers();
            that._addHandlers();
            that._popover.addClass(that.position);
            title.addClass(that.toThemeProperty("jqx-widget-header"));
            that._popover.addClass(that.toThemeProperty("jqx-widget jqx-widget-content jqx-rc-all"));
            if (that.showArrow) {
                that._popover.addClass(that.toThemeProperty("jqx-popover-arrow-" + that.position));
            }

            if (that.rtl) {
                title.addClass(that.toThemeProperty("jqx-rtl"));
                title.css('direction', 'rtl');
                content.css('direction', 'rtl');
            }

            if (that.showCloseButton) {
                var _closeButtonWrapper = $('<div class="' + this.toThemeProperty('jqx-window-close-button-background') + '"></div>');
                var _closeButton = $('<div style="width: 100%; height: 100%;" class="' + this.toThemeProperty('jqx-window-close-button') + ' ' + this.toThemeProperty('jqx-icon-close') + '"></div>');
                _closeButtonWrapper.append(_closeButton);
                title.append(_closeButtonWrapper);
                title.css('min-height', '16px');
                _closeButtonWrapper.addClass(that.toThemeProperty("jqx-popover-close-button"));
                that.closeButton = _closeButton;
                if (that.rtl) {
                    _closeButtonWrapper.addClass(that.toThemeProperty("jqx-popover-close-button-rtl"));
                }
            }
 
            if (that.arrowOffsetValue) {
                if (that.position == "bottom" || that.position == "top") {
                    var leftMargin = that._popover.find(".jqx-popover-arrow").css('margin-left');
                    that._popover.find(".jqx-popover-arrow").css('margin-left', parseInt(leftMargin) + that.arrowOffsetValue)
                }
                else {
                    var topMargin = that._popover.find(".jqx-popover-arrow").css('margin-top');
                    that._popover.find(".jqx-popover-arrow").css('margin-top', parseInt(topMargin) + that.arrowOffsetValue)
                }
            }

            if (that.width || that.height) {
                that._popover.css('width', that.width);
                that._popover.css('height', that.height);
            }
        },

        refresh: function (initialRefresh) {
            this.render();
        },

        destroy: function () {
            var that = this;

            if (that.length !== 0) {
                that._removeHandlers();
                that._popover.remove();
                that._removeModalBackground();
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            var that = this;
            that.render();
        },

        _stickToToggleElement: function () {
            var that = this;
            that._popover.css('left', '0px');
            that._popover.css('top', '0px');

            var popoverToggler = that._toggleElement;
            var elementPosition = popoverToggler.offset();
            var elementOuterHeight = popoverToggler.outerHeight();
            var elementOuterWidth = popoverToggler.outerWidth();
            var hostHeight = that._popover.height();
            var hostWidth = that._popover.width();

            switch (that.position) {
                case 'left':
                    that._popoverTop = elementPosition.top - hostHeight / 2 + elementOuterHeight / 2;
                    that._popoverLeft = elementPosition.left - that._popover.outerWidth();
                    break;
                case 'right':
                    that._popoverTop = elementPosition.top - hostHeight / 2 + elementOuterHeight / 2;
                    that._popoverLeft = elementPosition.left + elementOuterWidth;
                    break;
                case 'top':
                    that._popoverTop = elementPosition.top - that._popover.outerHeight();
                    that._popoverLeft = elementPosition.left - hostWidth / 2 + elementOuterWidth / 2;
                    break;
                case 'bottom':
                    that._popoverTop = elementPosition.top + elementOuterHeight;
                    that._popoverLeft = elementPosition.left - hostWidth / 2 + elementOuterWidth / 2;
                    break;
            }

            var leftOffset = that.offset ? that.offset.left : 0;
            var topOffset = that.offset ? that.offset.top : 0;

            that._popover.css('top', topOffset + that._popoverTop);
            that._popover.css('left', leftOffset + that._popoverLeft);
        },

        open: function () {
            var that = this;
            that._stickToToggleElement();
            function animationNoneOpen() {
                that._popover.show();
                that._raiseEvent('0'); // 'open' event
                that._isOpen = true;
            }
            function initContentCheck() {
                if (that.initContent && that._init === false) {
                    that.initContent();
                    that._init = true;
                    that._stickToToggleElement();
                }
            }

            if (that._ie7 === true) {
                animationNoneOpen();
                initContentCheck();
                return;
            }

            switch (that.animationType) {
                case 'fade':
                    that._popover.fadeIn(that.animationOpenDelay, function () {
                        that._raiseEvent('0'); // 'open' event
                        initContentCheck();
                        that._isOpen = true;
                    });
                    break;
                case 'none':
                    animationNoneOpen();
                    initContentCheck();
                    break;
            }

            that._makeModalBackground();
        },

        close: function () {
            var that = this;
            if (!that._isOpen)
                return;

            function animationNoneClose() {
                that._popover.hide();
                that._raiseEvent('1'); // 'close' event
                that._isOpen = false;
            }

            if (that._ie7 === true) {
                animationNoneClose();
                return;
            }

            switch (that.animationType) {
                case 'fade':
                    that._popover.fadeOut(that.animationCloseDelay, function () {
                        that._raiseEvent('1'); // 'close' event
                        that._isOpen = false;
                    });
                    break;
                case 'none':
                    animationNoneClose();
                    break;
            }

            that._removeModalBackground();
        },

        _raiseEvent: function (id, arg) {
            if (arg === undefined) {
                arg = { owner: null };
            }

            var evt = this.events[id];
            arg.owner = this;

            var event = new $.Event(evt);
            event.owner = this;
            event.args = arg;
            if (event.preventDefault) {
                event.preventDefault();
            }

            var result = this._popover.trigger(event);
            return result;
        },

        // add transparent background and make the popover modal
        _makeModalBackground: function () {
            var that = this;
            if (that.isModal === true) {
                that.modalBackground = $('<div></div>');
                that.modalBackground.addClass(this.toThemeProperty('jqx-popover-modal-background'));
                $(document.body).prepend(that.modalBackground);
                $(document.body).addClass(that.toThemeProperty('jqx-unselectable'));
                that.host.addClass(that.toThemeProperty('jqx-selectable'));
            }
        },

        // remove the background when the widget is closed
        _removeModalBackground: function () {
            var that = this;
            if ((that.isModal === true) && (that.modalBackground !== undefined)) {
                that.modalBackground.remove();
                $(document.body).removeClass(that.toThemeProperty('jqx-unselectable'));
                that.host.removeClass(that.toThemeProperty('jqx-selectable'));
            }
        },

        // add event handlers
        _addHandlers: function () {
            var that = this,
                id = that.element.id;
           
            that.addHandler($(document), 'keydown.jqxPopover' + id, function (event) {
                if (event.keyCode == 27) {
                    that.close();
                }
            });

            that.addHandler($(document), 'click.jqxPopover' + id, function (event) {
                if (that.closeButton && event.target == that.closeButton[0]) {
                    that.close();
                }

                if (that.autoClose === true) {           
                    if (event.target != that.element && !$(event.target).ischildof(that._popover)) {
                        if (!that.isModal) {
                            that.close();
                        }
                    }
                }
            });

            that.addHandler($(window), 'resize.jqxPopover' + id, function (event) {
                if (that.element.style.display != "none") {
                    that._stickToToggleElement();
                }
            });

            if (that.selector) {
                that.addHandler(that._toggleElement, 'click.jqxPopover' + id, function (event) {
                    event.stopPropagation();
                    if (that.host.css('display') != "none") {
                        that.close();
                    } else {
                        that.open();
                    }
                });
            }
        },

        // remove event handlers
        _removeHandlers: function () {
            var that = this,
                id = that.element.id;
            that.removeHandler($(document), 'click.jqxPopover' + id);

            if (that.selector) {
                that.removeHandler(that._toggleElement, 'click.jqxPopover' + id);
            }

            that.removeHandler($(document), 'keydown.jqxPopover' + id);
            that.removeHandler($(window), 'resize.jqxPopover' + id);
        }
    });
})(jqxBaseFramework);

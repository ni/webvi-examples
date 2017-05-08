/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {

    $.jqx.jqxWidget("jqxDropDownButton", "", {});

    $.extend($.jqx._jqxDropDownButton.prototype, {
        defineInstance: function () {
            var settings = {
                // enables/disables the dropdownlist.
                disabled: false,
                // gets or sets the popup width.
                width: null,
                // gets or sets the popup height.
                height: null,
                // gets or sets the scrollbars size.
                arrowSize: 19,
                // enables/disables the hover state.
                enableHover: true,
                // Type: Number
                // Default: 100
                // Showing Popup Animation's delay.
                openDelay: 250,
                // Type: Number
                // Default: 200
                // Hiding Popup Animation's delay.
                closeDelay: 300,
                // default, none
                // Type: String.
                // enables or disables the animation.
                animationType: 'default',
                // Type: Boolean
                // Default: false
                // Enables or disables the browser detection.
                enableBrowserBoundsDetection: false,
                dropDownHorizontalAlignment: 'left',
                dropDownVerticalAlignment: "bottom",
                popupZIndex: 20000,
                dropDownContainer: "default",
                autoOpen: false,
                rtl: false,
                initContent: null,
                dropDownWidth: null,
                dropDownHeight: null,
                focusable: true,
                template: "default",
                touchMode: false,
                aria:
                {
                    "aria-disabled": { name: "disabled", type: "boolean" }
                },
                events:
                [
                // occurs when the dropdownbutton is opened.
                  'open',
                // occurs when the dropdownbutton is closed.
                  'close',
                // occurs when the dropdownbutton is opening.
                  'opening',
                // occurs when the dropdownbutton is closing.
                  'closing'
                ]
            };
            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function (args) {
            var that = this;
            if (!that.width) that.width = 200;
            if (!that.height) that.height = 25;
            that.isanimating = false;
            that.setupInstance();
            var dropDownButtonStructure = $("<div style='background-color: transparent; -webkit-appearance: none; outline: none; width:100%; height: 100%; padding: 0px; margin: 0px; border: 0px; position: relative;'>" +
                "<div id='dropDownButtonWrapper' style='outline: none; background-color: transparent; border: none; float: left; width:100%; height: 100%; position: relative;'>" +
                "<div id='dropDownButtonContent' unselectable='on' style='outline: none; background-color: transparent; border: none; float: left; position: relative;'/>" +
                "<div id='dropDownButtonArrow' unselectable='on'  style='background-color: transparent; border: none; float: right; position: relative;'><div unselectable='on'></div></div>" +
                "</div>" +
                "</div>");

            if (that.host.attr('tabindex')) {
                dropDownButtonStructure.attr('tabindex', that.host.attr('tabindex'));
                that.host.removeAttr('tabindex');
            }
            else {
                dropDownButtonStructure.attr('tabindex', 0);
            }
            if (!that.focusable) {
                dropDownButtonStructure.removeAttr("tabIndex");
            }
            $.jqx.aria(this);
            that.popupContent = that.host.children();
            that.host.attr('role', 'button');
            if (that.popupContent.length == 0) {
                that.popupContent = $('<div>' + that.host.text() + '</div>');
                that.popupContent.css('display', 'block');
                that.element.innerHTML = "";
            }
            else {
                that.popupContent.detach();
            }

            var me = this;
            that.addHandler(that.host, 'loadContent', function (event) {
                me._arrange();
            });

            try {
                var popupID = 'dropDownButtonPopup' + that.element.id;
                var oldContainer = $($.find('#' + popupID));
                if (oldContainer.length > 0) {
                    oldContainer.remove();
                }
                $.jqx.aria(this, "aria-haspopup", true);
                $.jqx.aria(this, "aria-owns", popupID);

                var container = $("<div class='dropDownButton' style='overflow: hidden; left: -1000px; top: -1000px; position: absolute;' id='dropDownButtonPopup" + that.element.id + "'></div>");
                container.addClass(that.toThemeProperty('jqx-widget-content'));
                container.addClass(that.toThemeProperty('jqx-dropdownbutton-popup'));
                container.addClass(that.toThemeProperty('jqx-popup'));
                container.addClass(that.toThemeProperty('jqx-rc-all'));
                if (that.dropDownContainer != "element") {
                    container.css('z-index', that.popupZIndex);
                }
                if ($.jqx.browser.msie) {
                    container.addClass(that.toThemeProperty('jqx-noshadow'));
                }
                that.popupContent.appendTo(container);
                if (that.dropDownContainer == "element") {
                    container.appendTo(that.host);
                }
                else {
                    container.appendTo(document.body);
                }
                that.container = container;
                that.container.css('visibility', 'hidden');
            }
            catch (e) {

            }

            that.touch = $.jqx.mobile.isTouchDevice();
            that.dropDownButtonStructure = dropDownButtonStructure;
            that.host.append(dropDownButtonStructure);

            that.dropDownButtonWrapper = that.host.find('#dropDownButtonWrapper');
            that.firstDiv = that.dropDownButtonWrapper.parent();
            that.dropDownButtonArrow = that.host.find('#dropDownButtonArrow');
            that.arrow = $(that.dropDownButtonArrow.children()[0]);
            that.dropDownButtonContent = that.host.find('#dropDownButtonContent');
            that.dropDownButtonContent.addClass(that.toThemeProperty('jqx-dropdownlist-content'));
            that.dropDownButtonWrapper.addClass(that.toThemeProperty('jqx-disableselect'));
            if (that.rtl) {
                that.dropDownButtonContent.addClass(that.toThemeProperty('jqx-rtl'));
            }

            var self = this;
            if (that.host.parents()) {
                that.addHandler(that.host.parents(), 'scroll.dropdownbutton' + that.element.id, function (event) {
                    var opened = self.isOpened();
                    if (opened) {
                        self.close();
                    }
                });
            }
            that.addHandler(that.dropDownButtonWrapper, 'selectstart', function () { return false; });
            that.dropDownButtonWrapper[0].id = "dropDownButtonWrapper" + that.element.id;
            that.dropDownButtonArrow[0].id = "dropDownButtonArrow" + that.element.id;
            that.dropDownButtonContent[0].id = "dropDownButtonContent" + that.element.id;

            var self = this;
            that.propertyChangeMap['disabled'] = function (instance, key, oldVal, value) {
                if (value) {
                    instance.host.addClass(self.toThemeProperty('jqx-dropdownlist-state-disabled'));
                    instance.host.addClass(self.toThemeProperty('jqx-fill-state-disabled'));
                    instance.dropDownButtonContent.addClass(self.toThemeProperty('jqx-dropdownlist-content-disabled'));
                }
                else {
                    instance.host.removeClass(self.toThemeProperty('jqx-dropdownlist-state-disabled'));
                    instance.host.removeClass(self.toThemeProperty('jqx-fill-state-disabled'));
                    instance.dropDownButtonContent.removeClass(self.toThemeProperty('jqx-dropdownlist-content-disabled'));
                }
                $.jqx.aria(instance, 'aria-disabled', instance.disabled);
            }

            if (that.disabled) {
                that.host.addClass(that.toThemeProperty('jqx-dropdownlist-state-disabled'));
                that.host.addClass(that.toThemeProperty('jqx-fill-state-disabled'));
                that.dropDownButtonContent.addClass(that.toThemeProperty('jqx-dropdownlist-content-disabled'));
            }

            var className = that.toThemeProperty('jqx-rc-all') + " " + that.toThemeProperty('jqx-fill-state-normal') + " " + that.toThemeProperty('jqx-widget') + " " + that.toThemeProperty('jqx-widget-content') + " " + that.toThemeProperty('jqx-dropdownlist-state-normal');
            that.host.addClass(className);

            that.arrow.addClass(that.toThemeProperty('jqx-icon-arrow-down'));
            that.arrow.addClass(that.toThemeProperty('jqx-icon'));
            if (that.template)
            {
                that.host.addClass(that.toThemeProperty("jqx-" + that.template))
            }
            that._setSize();
            that.render();
            // fix for IE7
            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                that.container.css('display', 'none');
                if (that.host.parents('.jqx-window').length > 0) {
                    var zIndex = that.host.parents('.jqx-window').css('z-index');
                    container.css('z-index', zIndex + 10);
                    that.container.css('z-index', zIndex + 10);
                }
            }
        },

        setupInstance: function () {
            var that = this;
            var methods = {
                // sets the button's content.
                setContent: function (element) {
                    that.dropDownButtonContent.children().remove();
                    that.dropDownButtonContent[0].innerHTML = "";
                    that.dropDownButtonContent.append(element);
                },

                val: function (value) {
                    if (arguments.length == 0 || typeof (value) == "object") {
                        return that.dropDownButtonContent.text();
                    }
                    else {
                        that.dropDownButtonContent.html(value);
                    }
                },

                // get the button's content.
                getContent: function () {
                    if (that.dropDownButtonContent.children().length > 0) {
                        return that.dropDownButtonContent.children();
                    }

                    return that.dropDownButtonContent.text();
                },

                _setSize: function () {
                    if (that.width != null && that.width.toString().indexOf("px") != -1) {
                        that.host[0].style.width = that.width;
                    }
                    else
                        if (that.width != undefined && !isNaN(that.width)) {
                            that.host[0].style.width = parseInt(that.width) + 'px';
                        };

                    if (that.height != null && that.height.toString().indexOf("px") != -1) {
                        that.host[0].style.height = that.height;
                    }
                    else if (that.height != undefined && !isNaN(that.height)) {
                        that.host[0].style.height = parseInt(that.height) + 'px';
                    };

                    var isPercentage = false;
                    if (that.width != null && that.width.toString().indexOf("%") != -1) {
                        isPercentage = true;
                        that.host.width(that.width);
                    }

                    if (that.height != null && that.height.toString().indexOf("%") != -1) {
                        isPercentage = true;
                        that.host.height(that.height);
                    }

                    var me = this;
                    if (isPercentage) {
                        that.refresh(false);
                    }
                    $.jqx.utilities.resize(that.host, function () {
                        me._arrange();
                    });
                },

                // returns true when the popup is opened, otherwise returns false.
                isOpened: function () {
                    var me = this;
                    var openedpopup = $.data(document.body, "openedJQXButton" + me.element.id);
                    if (openedpopup != null && openedpopup == me.popupContent) {
                        return true;
                    }

                    return false;
                },

                focus: function () {
                    try {
                        that.host.focus();
                    }
                    catch (error) {
                    }
                },

                render: function () {
                    that.removeHandlers();
                    var self = this;
                    var hovered = false;

                    if (!that.touch) {
                        that.addHandler(that.host, 'mouseenter', function () {
                            if (!self.disabled && self.enableHover) {
                                hovered = true;
                                self.host.addClass(self.toThemeProperty('jqx-dropdownlist-state-hover'));
                                self.arrow.addClass(self.toThemeProperty('jqx-icon-arrow-down-hover'));
                                self.host.addClass(self.toThemeProperty('jqx-fill-state-hover'));
                            }
                        });
                        that.addHandler(that.host, 'mouseleave', function () {
                            if (!self.disabled && self.enableHover) {
                                self.host.removeClass(self.toThemeProperty('jqx-dropdownlist-state-hover'));
                                self.host.removeClass(self.toThemeProperty('jqx-fill-state-hover'));
                                self.arrow.removeClass(self.toThemeProperty('jqx-icon-arrow-down-hover'));
                                hovered = false;
                            }
                        });
                    }

                    if (self.autoOpen) {
                        that.addHandler(that.host, 'mouseenter', function () {
                            var isOpened = self.isOpened();
                            if (!isOpened && self.autoOpen) {
                                self.open();
                                self.host.focus();
                            }
                        });

                        that.addHandler($(document), 'mousemove.' + self.element.id, function (event) {
                            var isOpened = self.isOpened();
                            if (isOpened && self.autoOpen) {
                                var offset = self.host.coord();
                                var top = offset.top;
                                var left = offset.left;
                                var popupOffset = self.container.coord();
                                var popupLeft = popupOffset.left;
                                var popupTop = popupOffset.top;

                                canClose = true;

                                if (event.pageY >= top && event.pageY <= top + self.host.height()) {
                                    if (event.pageX >= left && event.pageX < left + self.host.width())
                                        canClose = false;
                                }
                                if (event.pageY >= popupTop && event.pageY <= popupTop + self.container.height()) {
                                    if (event.pageX >= popupLeft && event.pageX < popupLeft + self.container.width())
                                        canClose = false;
                                }

                                if (canClose) {
                                    self.close();
                                }
                            }
                        });
                    }

                    that.addHandler(that.dropDownButtonWrapper, 'mousedown',
                    function (event) {
                        if (!self.disabled) {
                            var isOpen = self.container.css('visibility') == 'visible';
                            if (!self.isanimating) {
                                if (isOpen) {
                                    self.close();
                                    return false;
                                }
                                else {
                                    self.open();
                                    if (!self.focusable) {
                                        if (event.preventDefault) {
                                            event.preventDefault();
                                        }
                                    }
                                }
                            }
                        }
                    });

                    if (that.touch) {
                        that.addHandler($(document), $.jqx.mobile.getTouchEventName('touchstart') + '.' + that.element.id, self.closeOpenedDropDown, { me: this, popup: that.container, id: that.element.id });
                    }

                    that.addHandler($(document), 'mousedown.' + that.element.id, self.closeOpenedDropDown, { me: this, popup: that.container, id: that.element.id });

                    that.addHandler(that.host, 'keydown', function (event) {
                        var isOpen = self.container.css('visibility') == 'visible';

                        if (self.host.css('display') == 'none') {
                            return true;
                        }

                        if (event.keyCode == '13') {
                            if (!self.isanimating) {
                                if (isOpen) {
                                    self.close();
                                }
                            }
                        }

                        if (event.keyCode == 115) {
                            if (!self.isanimating) {
                                if (!self.isOpened()) {
                                    self.open();
                                }
                                else if (self.isOpened()) {
                                    self.close();
                                }
                            }
                            return false;
                        }

                        if (event.altKey) {
                            if (self.host.css('display') == 'block') {
                                if (event.keyCode == 38) {
                                    if (self.isOpened()) {
                                        self.close();
                                    }
                                }
                                else if (event.keyCode == 40) {
                                    if (!self.isOpened()) {
                                        self.open();
                                    }
                                }
                            }
                        }

                        if (event.keyCode == '27') {
                            if (!self.ishiding) {
                                self.close();
                                if (self.tempSelectedIndex != undefined) {
                                    self.selectIndex(self.tempSelectedIndex);
                                }
                            }
                        }
                    });

                    that.addHandler(that.firstDiv, 'focus', function () {
                        self.host.addClass(self.toThemeProperty('jqx-dropdownlist-state-focus'));
                        self.host.addClass(self.toThemeProperty('jqx-fill-state-focus'));
                    });
                    that.addHandler(that.firstDiv, 'blur', function () {
                        self.host.removeClass(self.toThemeProperty('jqx-dropdownlist-state-focus'));
                        self.host.removeClass(self.toThemeProperty('jqx-fill-state-focus'));
                    });
                },

                removeHandlers: function () {
                    var self = this;
                    that.removeHandler(that.dropDownButtonWrapper, 'mousedown');
                    that.removeHandler(that.host, 'keydown');
                    that.removeHandler(that.firstDiv, 'focus');
                    that.removeHandler(that.firstDiv, 'blur');
                    that.removeHandler(that.host, 'mouseenter');
                    that.removeHandler(that.host, 'mouseleave');
                    if (that.autoOpen) {
                        that.removeHandler(that.host, 'mouseenter');
                        that.removeHandler(that.host, 'mouseleave');
                    }
                    that.removeHandler($(document), 'mousemove.' + self.element.id);
                },

                _findPos: function (obj) {
                    while (obj && (obj.type == 'hidden' || obj.nodeType != 1 || $.expr.filters.hidden(obj))) {
                        obj = obj['nextSibling'];
                    }
                    var position = $(obj).coord(true);
                    return [position.left, position.top];
                },

                testOffset: function (element, offset, inputHeight) {
                    var dpWidth = element.outerWidth();
                    var dpHeight = element.outerHeight();
                    var viewWidth = $(window).width() + $(window).scrollLeft();
                    var viewHeight = $(window).height() + $(window).scrollTop();

                    // now check if dropdownbutton is showing outside window viewport - move to a better place if so.
                    if (offset.left + dpWidth > viewWidth) {
                        if (dpWidth > that.host.width()) {
                            var hostLeft = that.host.coord().left;
                            var hOffset = dpWidth - that.host.width();
                            offset.left = hostLeft - hOffset + 2;
                        }
                    }
                    if (offset.left < 0) {
                        offset.left = parseInt(that.host.coord().left) + 'px'
                    }

           
                    offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
           Math.abs(dpHeight + inputHeight + 22) : 0);

                    return offset;
                },

                _getBodyOffset: function () {
                    var top = 0;
                    var left = 0;
                    if ($('body').css('border-top-width') != '0px') {
                        top = parseInt($('body').css('border-top-width'));
                        if (isNaN(top)) top = 0;
                    }
                    if ($('body').css('border-left-width') != '0px') {
                        left = parseInt($('body').css('border-left-width'));
                        if (isNaN(left)) left = 0;
                    }
                    return { left: left, top: top };
                },

                // shows the popup.
                open: function () {
                    $.jqx.aria(this, 'aria-expanded', true);
                    var that = this;
                    var self = this;
                    if ((that.dropDownWidth == null || that.dropDownWidth == 'auto') && that.width != null && that.width.indexOf && that.width.indexOf('%') != -1) {
                        var width = that.host.width();
                        that.container.width(parseInt(width));
                    }

                    self._raiseEvent('2');
                    var popup = that.popupContent;
                    var scrollPosition = $(window).scrollTop();
                    var scrollLeftPosition = $(window).scrollLeft();
                    var top = parseInt(that._findPos(that.host[0])[1]) + parseInt(that.host.outerHeight()) - 1 + 'px';
                    var left, leftPos = parseInt(Math.round(that.host.coord(true).left));
                    left = leftPos + 'px';

                    var isMobileBrowser = $.jqx.mobile.isSafariMobileBrowser() || $.jqx.mobile.isWindowsPhone();
               
                    that.ishiding = false;

                    that.tempSelectedIndex = that.selectedIndex;

                    if ((isMobileBrowser != null && isMobileBrowser)) {
                        left = $.jqx.mobile.getLeftPos(that.element);
                        top = $.jqx.mobile.getTopPos(that.element) + parseInt(that.host.outerHeight());
                        if ($('body').css('border-top-width') != '0px') {
                            top = parseInt(top) - that._getBodyOffset().top + 'px';
                        }
                        if ($('body').css('border-left-width') != '0px') {
                            left = parseInt(left) - that._getBodyOffset().left + 'px';
                        }
                    }

                    popup.stop();
                    that.host.addClass(that.toThemeProperty('jqx-dropdownlist-state-selected'));
                    that.host.addClass(that.toThemeProperty('jqx-fill-state-pressed'));
                    that.arrow.addClass(that.toThemeProperty('jqx-icon-arrow-down-selected'));

                    var ie7 = false;
                    if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                        ie7 = true;
                    }

                    if (ie7) {
                        that.container.css('display', 'block');
                    }

                    that.container.css('left', left);
                    that.container.css('top', top);

                    var closeAfterSelection = true;

                    var positionChanged = false;

                    var align = function () {
                        if (that.dropDownHorizontalAlignment == 'right' || that.rtl) {
                            var containerWidth = that.container.width();
                            var containerLeftOffset = Math.abs(containerWidth - that.host.width());

                            if (containerWidth > that.host.width()) {
                                that.container.css('left', parseInt(Math.round(leftPos)) - containerLeftOffset + "px");
                            }
                            else that.container.css('left', parseInt(Math.round(leftPos)) + containerLeftOffset + "px");
                        }
                    }

                    align.call(this);

                    if (that.dropDownVerticalAlignment == "top")
                    {
                        var dpHeight = popup.height();
                        positionChanged = true;
                        that.container.height(popup.outerHeight());

                        popup.addClass(this.toThemeProperty('jqx-popup-up'));
                        var inputHeight = parseInt(that.host.outerHeight());
                        var t = parseInt(top) - Math.abs(dpHeight + inputHeight);
                        if (that.interval)
                            clearInterval(that.interval);

                        that.interval = setInterval(function ()
                        {
                            if (popup.outerHeight() != that.container.height())
                            {
                                that.container.height(popup.outerHeight());
                                var t = parseInt(top) - Math.abs(popup.height() + inputHeight);
                                that.container.css('top', t);

                            }
                        }, 50);
                        popup.css('top', 23);
                        that.container.css('top', t);
                    }

                    if (that.enableBrowserBoundsDetection) {
                        var newOffset = that.testOffset(popup, { left: parseInt(that.container.css('left')), top: parseInt(top) }, parseInt(that.host.outerHeight()));
                        if (parseInt(that.container.css('top')) != newOffset.top) {
                            positionChanged = true;
                            that.container.height(popup.outerHeight());
                            popup.css('top', 23);

                            if (that.interval)
                                clearInterval(that.interval);

                            that.interval = setInterval(function () {
                                if (popup.outerHeight() != self.container.height()) {
                                    var newOffset = self.testOffset(popup, { left: parseInt(that.container.css('left')), top: parseInt(top) }, parseInt(that.host.outerHeight()));
                                    that.container.css('top', newOffset.top);
                                    that.container.height(popup.outerHeight());
                                }
                            }, 50);
                        }
                        else popup.css('top', 0);
                        that.container.css('top', newOffset.top);
                        if (parseInt(that.container.css('left')) != newOffset.left) {
                            that.container.css('left', newOffset.left);
                        }
                    }

                    if (that.animationType == 'none') {
                        that.container.css('visibility', 'visible');
                        $.data(document.body, "openedJQXButtonParent", self);
                        $.data(document.body, "openedJQXButton" + that.element.id, popup);
                        popup.css('margin-top', 0);
                        popup.css('opacity', 1);
                        that._raiseEvent('0');
                        align.call(self);
                    }
                    else {
                        that.container.css('visibility', 'visible');
                        var height = popup.outerHeight();
                        self.isanimating = true;
                        if (that.animationType == 'fade') {
                            popup.css('margin-top', 0);
                            popup.css('opacity', 0);
                            popup.animate({ 'opacity': 1 }, that.openDelay, function () {
                                $.data(document.body, "openedJQXButtonParent", self);
                                $.data(document.body, "openedJQXButton" + self.element.id, popup);
                                self.ishiding = false;
                                self.isanimating = false;
                                self._raiseEvent('0');
                            });
                            align.call(self);
                        }
                        else {
                            popup.css('opacity', 1);
                            if (positionChanged) {
                                popup.css('margin-top', height);
                            }
                            else {
                                popup.css('margin-top', -height);
                            }

                            align.call(self);
                            if (positionChanged)
                            {
                                popup.animate({ 'margin-top': 0 }, that.openDelay, function ()
                                {
                                    $.data(document.body, "openedJQXButtonParent", self);
                                    $.data(document.body, "openedJQXButton" + self.element.id, popup);
                                    self.ishiding = false;
                                    self.isanimating = false;
                                    self._raiseEvent('0');
                                });
                            }
                            else
                            {
                                popup.animate({ 'margin-top': 0 }, that.openDelay, function ()
                                {
                                    $.data(document.body, "openedJQXButtonParent", self);
                                    $.data(document.body, "openedJQXButton" + self.element.id, popup);
                                    self.ishiding = false;
                                    self.isanimating = false;
                                    self._raiseEvent('0');
                                });
                            }
                        }
                    }
                    if (!positionChanged) {
                        that.host.addClass(that.toThemeProperty('jqx-rc-b-expanded'));
                        that.container.addClass(that.toThemeProperty('jqx-rc-t-expanded'));
                    }
                    else {
                        that.host.addClass(that.toThemeProperty('jqx-rc-t-expanded'));
                        that.container.addClass(that.toThemeProperty('jqx-rc-b-expanded'));
                    }
                    if (that.focusable) {
                        that.firstDiv.focus();
                        setTimeout(function () {
                            self.firstDiv.focus();
                        }, 10);
                    }
                    that.container.addClass(that.toThemeProperty('jqx-fill-state-focus'));
                    that.host.addClass(self.toThemeProperty('jqx-dropdownlist-state-focus'));
                    that.host.addClass(self.toThemeProperty('jqx-fill-state-focus'));
                },

                // hides the popup.
                close: function () {
                    $.jqx.aria(this, 'aria-expanded', false);
                    var that = this;
                    var popup = that.popupContent;
                    var container = that.container;
                    var me = this;
                    me._raiseEvent('3');
                    var ie7 = false;
                    if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                        ie7 = true;
                    }

                    if (!that.isOpened()) {
                        return;
                    }

                    $.data(document.body, "openedJQXButton" + that.element.id, null);
                    if (that.animationType == 'none') {
                        that.container.css('visibility', 'hidden');
                        if (ie7) {
                            that.container.css('display', 'none');
                        }
                    }
                    else {
                        if (!me.ishiding) {
                            me.isanimating = true;
                            popup.stop();
                            var height = popup.outerHeight();
                            popup.css('margin-top', 0);
                            var animationValue = -height;
                            if (parseInt(that.container.coord().top) < parseInt(that.host.coord().top)) {
                                animationValue = height;
                            }
                            if (that.animationType == 'fade') {
                                popup.css({ 'opacity': 1 });
                                popup.animate({ 'opacity': 0 }, that.closeDelay, function () {
                                    container.css('visibility', 'hidden');
                                    me.isanimating = false;
                                    me.ishiding = false;
                                    if (ie7) {
                                        container.css('display', 'none');
                                    }
                                });
                            }
                            else {
                                popup.animate({ 'margin-top': animationValue }, that.closeDelay, function () {
                                    container.css('visibility', 'hidden');
                                    me.isanimating = false;
                                    me.ishiding = false;
                                    if (ie7) {
                                        container.css('display', 'none');
                                    }
                                });
                            }
                        }
                    }

                    that.ishiding = true;
                    that.host.removeClass(that.toThemeProperty('jqx-dropdownlist-state-selected'));
                    that.host.removeClass(that.toThemeProperty('jqx-fill-state-pressed'));
                    that.arrow.removeClass(that.toThemeProperty('jqx-icon-arrow-down-selected'));
                    that.host.removeClass(that.toThemeProperty('jqx-rc-b-expanded'));
                    that.container.removeClass(that.toThemeProperty('jqx-rc-t-expanded'));
                    that.host.removeClass(that.toThemeProperty('jqx-rc-t-expanded'));
                    that.container.removeClass(that.toThemeProperty('jqx-rc-b-expanded'));
                    that.container.removeClass(that.toThemeProperty('jqx-fill-state-focus'));
                    that.host.removeClass(that.toThemeProperty('jqx-dropdownlist-state-focus'));
                    that.host.removeClass(that.toThemeProperty('jqx-fill-state-focus'));

                    that._raiseEvent('1');
                },

                /* Close popup if clicked elsewhere. */
                closeOpenedDropDown: function (event) {
                    var self = event.data.me;
                    var $target = $(event.target);

                    if ($(event.target).ischildof(event.data.me.host)) {
                        return true;
                    }

                    if ($(event.target).ischildof(event.data.me.popupContent)) {
                        return true;
                    }

                    var dropdownlistInstance = self;

                    var isPopup = false;
                    $.each($target.parents(), function () {
                        if (this.className != 'undefined') {
                            if (this.className.indexOf && this.className.indexOf('dropDownButton') != -1) {
                                isPopup = true;
                                return false;
                            }
                            if (this.className.indexOf && this.className.indexOf('jqx-popup') != -1) {
                                isPopup = true;
                                return false;
                            }
                        }
                    });

                    if (!isPopup) {
                        self.close();
                    }

                    return true;
                },

                refresh: function () {
                    that._arrange();
                },

                _arrange: function () {
                    var that = this;
                    var width = parseInt(that.host.width());
                    var height = parseInt(that.host.height());
                    var arrowHeight = that.arrowSize;
                    var arrowWidth = that.arrowSize;
                    var rightOffset = 3;
                    var contentWidth = width - arrowWidth - 2 * rightOffset;
                    if (contentWidth > 0) {
                        that.dropDownButtonContent[0].style.width = contentWidth + 'px';
                    }

                    that.dropDownButtonContent[0].style.height = parseInt(height) + 'px';
                    that.dropDownButtonContent[0].style.left = '0px';
                    that.dropDownButtonContent[0].style.top = '0px';

                    that.dropDownButtonArrow[0].style.width = parseInt(arrowWidth) + 'px';
                    that.dropDownButtonArrow[0].style.height = parseInt(height) + 'px';
                    if (that.rtl) {
                        that.dropDownButtonArrow.css('float', 'left');
                        that.dropDownButtonContent.css('float', 'right');
                        that.dropDownButtonContent.css('left', -rightOffset);
                    }
                    if (that.dropDownWidth != null) {
                        if (that.dropDownWidth.toString().indexOf('%') >= 0) {
                            var width = (parseInt(that.dropDownWidth) * that.host.width()) / 100;
                            that.container.width(width);
                        }
                        else {
                            that.container.width(that.dropDownWidth);
                        }
                    }
                    if (that.dropDownHeight != null) {
                        that.container.height(that.dropDownHeight);
                    }
                },

                destroy: function () {
                    $.jqx.utilities.resize(this.host, null, true);
                    var that = this;
                    if (that.interval)
                    {
                        clearInterval(that.interval);
                    }
                    that.removeHandler(that.dropDownButtonWrapper, 'selectstart');
                    that.removeHandler(that.dropDownButtonWrapper, 'mousedown');
                    that.removeHandler(that.host, 'keydown');
                    that.host.removeClass();
                    that.removeHandler($(document), 'mousedown.' + that.element.id, self.closeOpenedDropDown);
                    that.host.remove();
                    that.container.remove();
                },

                _raiseEvent: function (id, arg) {
                    if (arg == undefined)
                        arg = { owner: null };

                    if (id == 2 && !that.contentInitialized) {
                        if (that.initContent) {
                            that.initContent();
                            that.contentInitialized = true;
                        }
                    }

                    var evt = that.events[id];
                    args = arg;
                    args.owner = this;

                    var event = new $.Event(evt);
                    event.owner = this;
                    if (id == 2 || id == 3 || id == 4) {
                        event.args = arg;
                    }

                    var result = that.host.trigger(event);
                    return result;
                },

                resize: function (width, height) {
                    that.width = width;
                    that.height = height;
                    that._setSize();
                    that._arrange();
                },

                propertiesChangedHandler: function (object, key, value)
                {
                    if (value.width && value.height && Object.keys(value).length == 2)
                    {
                        object._setSize();
                        object._arrange();
                        object.close();
                    }
                },

                propertyChangedHandler: function (object, key, oldvalue, value) {
                    if (that.isInitialized == undefined || that.isInitialized == false)
                        return;

                    if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length == 2)
                    {
                        return;
                    }

                    if (key == "template")
                    {
                        object.host.removeClass(object.toThemeProperty("jqx-" + oldvalue + ""));
                        object.host.addClass(object.toThemeProperty("jqx-" + object.template + ""));
                    }

                    if (key == "rtl") {
                        if (value) {
                            object.dropDownButtonArrow.css('float', 'left');
                            object.dropDownButtonContent.css('float', 'right');
                        }
                        else {
                            object.dropDownButtonArrow.css('float', 'right');
                            object.dropDownButtonContent.css('float', 'left');
                        }
                    }

                    if (key == 'autoOpen') {
                        object.render();
                    }

                    if (key == 'theme' && value != null) {
                        $.jqx.utilities.setTheme(oldvalue, value, object.host);
                    }

                    if (key == 'width' || key == 'height') {
                        object._setSize();
                        object._arrange();
                    }
                }
            }
            $.extend(true, this, methods);
        }
    });
})(jqxBaseFramework);

/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($) {

    $.jqx.jqxWidget("jqxMenu", "", {});

    $.extend($.jqx._jqxMenu.prototype, {
        defineInstance: function () {
            var settings = {
                //Type: Array
                //Gets the menu's items.
                items: new Array(),
                //Type: String.
                //Default: 'horizontal'.
                //Gets or sets the menu's display mode. 
                //Possible Values: 'horizontal', 'vertical', 'popup', 'simple'
                mode: 'horizontal',
                //Type: Number.
                //Default: null.
                //Sets the width.
                width: null,
                //Type: Number.
                //Default: null.
                //Sets the height.
                height: null,
                //Type: Number.
                //Default: 'auto'.
                //Sets the height.
                minimizeWidth: 'auto',
                //Type: String.
                //Default: easeInOutSine.
                //Gets or sets the animation's easing to one of the JQuery's supported easings.         
                easing: 'easeInOutSine',
                //Type: Number.
                //Default: 500.
                //Gets or sets the duration of the show animation.         
                animationShowDuration: 200,
                //Type: Number.
                //Default: 'fast'.
                //Gets or sets the duration of the hide animation.
                animationHideDuration: 200,
                // Type: Number
                // Default: 0
                // Gets or sets whether the menu is automatically closed after a period of time.
                autoCloseInterval: 0,
                //Type: Number.
                //Default: 500.
                //Gets or sets the delay before the start of the hide animation.
                animationHideDelay: 100,
                //Type: Number.
                //Default: 200.
                //Gets or sets the delay before the start of the show animation.            
                animationShowDelay: 100,
                //Type: Array.
                menuElements: new Array(),
                //Type: Boolean.
                //Default: true.
                //Auto-Sizes the Menu's main items when the menu's mode is 'horizontal'.
                autoSizeMainItems: false,
                //Type: Boolean.
                //Default: true.
                //Automatically closes the opened popups after a click.
                autoCloseOnClick: true,
                //Type: Boolean.
                //Default: true.
                //Automatically closes the opened popups after mouse leave.
                autoCloseOnMouseLeave: true,
                //Type: Boolean.
                //Default: true.
                //Enables or disables the rounded corners.
                enableRoundedCorners: true,
                //Type: Boolean.
                //Default: true.
                //Enables or disables the Menu.
                disabled: false,
                //Type: Boolean.
                //Default: true.
                //Opens the Context Menu when the right-mouse button is pressed.
                //When this property is set to false, the Open and Close functions can be used to open and close 
                //the Context Menu.
                autoOpenPopup: true,
                // Type: Boolean
                // Default: true
                // enables or disables the hover state.
                enableHover: true,
                // Type: Boolean
                // Default: true
                // opens the top level menu items when the user hovers them.
                autoOpen: true,
                // Type: Boolean
                // Default: false
                // When this property is true, the menu is auto generated using all of ul and li tags inside the host.
                autoGenerate: true,
                // Type: Boolean
                // Default: false
                // opens an item after a click by the user.
                clickToOpen: false,
                // Type: Boolean
                // Default: false
                // shows the top-level item arrows in the default horizontal menu mode.
                showTopLevelArrows: false,
                // Sets whether the menu is on touch device.
                touchMode: 'auto',
                // Sets menu's source.
                source: null,
                popupZIndex: 17000,
                rtl: false,
                keyboardNavigation: false,
                lockFocus: false,
                title: "",
                // Menu events.
                events:
                [
                    'shown', 'closed', 'itemclick', 'initialized', 'open', 'close'
                ]
            };
            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function (args) {
            var self = this;
            this.host.attr('role', 'menubar');
            $.jqx.utilities.resize(this.host, function () {
                self.refresh();
            }, false, this.mode != "popup");
            if (this.minimizeWidth != "auto" && this.minimizeWidth != null && this.width && this.width.toString().indexOf('%') == -1) {
                $(window).resize(function () {
                    self.refresh();
                });
            }

            this.host.css('outline', 'none');

            if (this.source) {
                if (this.source != null) {
                    var html = this.loadItems(this.source);
                    this.element.innerHTML = html;
                }
            }

            this._tmpHTML = this.element.innerHTML;
            if (this.element.innerHTML.indexOf('UL')) {
                var innerElement = this.host.find('ul:first');
                if (innerElement.length > 0) {
                    this._createMenu(innerElement[0]);
                }
            }

            this.host.data('autoclose', {});

            this._render();
            this._setSize();
            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                this.host.attr('hideFocus', true);
            }
        },

        focus: function () {
            try {
                if (this.mode === "popup" && this.keyboardNavigation)
                {
                    var $popupElementparent = this.host.closest('div.jqx-menu-wrapper');
                    $popupElementparent.focus();
                }
                if (this.keyboardNavigation) {
                    this.host.focus();
                    var that = this;
                    var setActiveItem = function () {
                        if (!$.jqx.isHidden($(that.items[0].element))) {
                            $(that.items[0].element).addClass(that.toThemeProperty('jqx-fill-state-focus'));
                            that.activeItem = that.items[0];
                        }
                        else {
                            var item = that._nextVisibleItem(that.items[0], 0);
                            if (item) {
                                $(item.element).addClass(that.toThemeProperty('jqx-fill-state-focus'));
                                that.activeItem = item;
                            }
                        }
                    }

                    if (!this.activeItem) {
                        setActiveItem();
                    }
                    else {
                        if (!$.jqx.isHidden($(this.activeItem.element))) {
                            $(this.activeItem.element).addClass(this.toThemeProperty('jqx-fill-state-focus'));
                        }
                        else {
                            $(this.activeItem.element).removeClass(this.toThemeProperty('jqx-fill-state-focus'));
                            setActiveItem();
                        }
                    }
                }
            }
            catch (error) {
            }
        },

        loadItems: function (items, subMenuWidth) {
            if (items == null) {
                return;
            }
            if (items.length == 0) return "";

            var self = this;
            this.items = new Array();
            var html = '<ul class="jqx-menu-ul">';
            if (subMenuWidth) {
                html = '<ul class="jqx-menu-ul" style="width:' + subMenuWidth + ';">';
            }

            $.map(items, function (item) {
                if (item == undefined)
                    return null;

                html += self._parseItem(item);
            });

            html += '</ul>';
            return html;
        },

        _parseItem: function (item) {
            var html = "";

            if (item == undefined)
                return null;

            var label = item.label;
            if (!item.label && item.html) {
                label = item.html;
            }
            if (!label) {
                label = "Item";
            }

            if (typeof item === 'string') {
                label = item;
            }

            var selected = false;
            if (item.selected != undefined && item.selected) {
                selected = true;
            }

            var disabled = false;
            if (item.disabled != undefined && item.disabled) {
                disabled = true;
            }

            html += '<li';

            if (disabled) {
                html += ' item-disabled="true" ';
            }

            if (item.label && !item.html) {
                html += ' item-label="' + label + '" ';
            }

            if (item.value != null) {
                html += ' item-value="' + item.value + '" ';
            }

            if (item.id != undefined) {
                html += ' id="' + item.id + '" ';
            }

            html += '>' + label;

            if (item.items) {
                if (item.subMenuWidth) {
                    html += this.loadItems(item.items, item.subMenuWidth);
                }
                else {
                    html += this.loadItems(item.items);
                }
            }

            html += '</li>';
            return html;
        },

        _setSize: function () {
            if (this.width != null && this.width.toString().indexOf("%") != -1) {
                this.host.width(this.width);
            }
            else if (this.width != null && this.width.toString().indexOf("px") != -1) {
                this.host.width(this.width);
            }
            else
                if (this.width != undefined && !isNaN(this.width)) {
                    this.host.width(this.width);
                };

            if (this.height != null && this.height.toString().indexOf("%") != -1) {
                this.host.height(this.height);
            }
            else if (this.height != null && this.height.toString().indexOf("px") != -1) {
                this.host.height(this.height);
            }
            else if (this.height != undefined && !isNaN(this.height)) {
                this.host.height(this.height);
            };
            if (this.height === null) {
                this.host.height('auto');
            }

            var me = this;
            if (this.minimizeWidth != null && this.mode != "popup") {
                var windowWidth = $(window).width();

                if (!$.jqx.response) {
                    var isDesktop = false;
                    if (navigator.userAgent.match(/Windows|Linux|MacOS/)) {
                        var isWP = navigator.userAgent.indexOf('Windows Phone') >= 0 || navigator.userAgent.indexOf('WPDesktop') >= 0 || navigator.userAgent.indexOf('IEMobile') >= 0 || navigator.userAgent.indexOf('ZuneWP7') >= 0;
                        if (!isWP) {
                            isDesktop = true;
                        }
                    }

                    var w = this.minimizeWidth;
                    if (isDesktop && this.minimizeWidth == 'auto') {
                        return;
                    }
                }

                if (this.minimizeWidth == 'auto' && $.jqx.response) {
                    var response = new $.jqx.response();
                    if (response.device.type == "Phone" || response.device.type == "Tablet") {
                        if (!this.minimized) {
                            this.minimize();
                        }
                    }
                }
                else {
                    if ((windowWidth < w) && !this.minimized) {
                        this.minimize();
                    }
                    else if (this.minimized && windowWidth >= w) {
                        this.restore()
                    }
                }
            }
        },

        minimize: function () {
            if (this.minimized) return;
            var me = this;
            this.host.addClass(this.toThemeProperty('jqx-menu-minimized'));
            this.minimized = true;
            this._tmpMode = this.mode;
            this.mode = "simple";
            var wrapper = this.host.closest('div.jqx-menu-wrapper');
            wrapper.remove();
            $("#menuWrapper" + this.element.id).remove();
            $.each(this.items, function () {
                var item = this;
                var $menuElement = $(item.element);
                var $submenu = $(item.subMenuElement);
                var $popupElement = $submenu.closest('div.jqx-menu-popup');
                $popupElement.remove();
            });

            if (this.source) {
                var html = this.loadItems(this.source);
                this.element.innerHTML = html;
                this._tmpHTML = this.element.innerHTML;
            }

            this.element.innerHTML = this._tmpHTML;
            if (this.element.innerHTML.indexOf('UL')) {
                var innerElement = this.host.find('ul:first');
                if (innerElement.length > 0) {
                    this._createMenu(innerElement[0]);
                }
            }


            this._render();
            var ul = this.host.find('ul:first');
            ul.wrap('<div class="jqx-menu-wrapper" style="z-index:' + this.popupZIndex + '; padding: 0px; display: none; margin: 0px; height: auto; width: auto; position: absolute; top: 0; left: 0; display: block; visibility: visible;"></div>')
            var wrapper = ul.closest('div.jqx-menu-wrapper');
            wrapper[0].id = "menuWrapper" + this.element.id;
            wrapper.detach();
            wrapper.appendTo($(document.body));
            wrapper.addClass(this.toThemeProperty('jqx-widget'));
            wrapper.addClass(this.toThemeProperty('jqx-menu'));
            wrapper.addClass(this.toThemeProperty('jqx-menu-minimized'));
            wrapper.addClass(this.toThemeProperty('jqx-widget-header'));

            ul.children().hide();
            wrapper.hide();
            wrapper.find('ul').addClass(this.toThemeProperty('jqx-menu-ul-minimized'));
            this.minimizedItem = $("<div></div>");
            this.minimizedItem.addClass(this.toThemeProperty('jqx-item'));
            this.minimizedItem.addClass(this.toThemeProperty('jqx-menu-item-top'));
           
            this.addHandler(wrapper, 'keydown', function (event) { 
                return me.handleKeyDown(event);
            });
            
            this.minimizedItem.addClass(this.toThemeProperty('jqx-menu-minimized-button'));
            this.minimizedItem.prependTo(this.host);

            this.titleElement = $("<div>" + this.title + "</div>");
            this.titleElement.addClass(this.toThemeProperty('jqx-item'));
            this.titleElement.addClass(this.toThemeProperty('jqx-menu-title'));
            this.titleElement.prependTo(this.host);
            $("<div style='clear:both;'></div>").insertAfter(this.minimizedItem);
            me.minimizedHidden = true;
            var hideMenu = function (e) {
                me.minimizedHidden = true;
                me.minimizedItem.show();
                var fromRight = false;
                if (me.minimizedItem.css('float') == 'right') {
                    fromRight = true;
                }

                wrapper.animate({
                    left: !fromRight ? -wrapper.outerWidth() : me.host.coord().left + me.host.width() + wrapper.width(),
                    opacity: 0
                }, me.animationHideDuration, function () {
                    wrapper.find('ul:first').children().hide();
                    wrapper.hide();
                });
            }

            var toggleMenu = function (e) {
                if (me.minimizedHidden) {
                    wrapper.find('ul:first').children().show();
                    me.minimizedHidden = false;
                    wrapper.show();
                    wrapper.css('opacity', 0);
                    wrapper.css('left', -wrapper.outerWidth());
                    var fromRight = false;
                    var wrapperWidth = wrapper.width();
                    if (me.minimizedItem.css('float') == 'right') {
                        wrapper.css('left', me.host.coord().left + me.host.width() + wrapperWidth);
                        fromRight = true;
                    }
                    wrapper.css('top', me.host.coord().top + me.host.height());
                    wrapper.animate({
                        left: !fromRight ? me.host.coord().left : me.host.coord().left + me.host.width() - wrapperWidth,
                        opacity: 0.95
                    }, me.animationShowDuration, function () {
                    });
                }
                else {
                    hideMenu(e);
                }
                me._raiseEvent('2', {type: "mouse", item: me.minimizedItem[0], event: e });
                me._setSize();
            }
            this.addHandler($(window), 'orientationchange.jqxmenu' + this.element.id, function (e) {
                setTimeout(function () {
                    if (!me.minimizedHidden) {
                        var wrapperWidth = wrapper.width();
                        var fromRight = false;
                        var wrapperWidth = wrapper.width();
                        if (me.minimizedItem.css('float') == 'right') {
                            fromRight = true;
                        }
                        wrapper.css('top', me.host.coord().top + me.host.height());
                        wrapper.css({
                            left: !fromRight ? me.host.coord().left : me.host.coord().left + me.host.width() - wrapperWidth
                        });
                    }
                }, 25);
            });

            this.addHandler(this.minimizedItem, 'click', function (e) {
                toggleMenu(e);
            });
        },

        restore: function () {
            if (!this.minimized) return;

            this.host.find('ul').removeClass(this.toThemeProperty('jqx-menu-ul-minimized'));
            this.host.removeClass(this.toThemeProperty('jqx-menu-minimized'));

            this.minimized = false;
            this.mode = this._tmpMode;
            if (this.minimizedItem)
                this.minimizedItem.remove();

            var wrapper = $("#menuWrapper" + this.element.id);
            wrapper.remove();

            if (this.source) {
                var html = this.loadItems(this.source);
                this.element.innerHTML = html;
                this._tmpHTML = html;
            }

            this.element.innerHTML = this._tmpHTML;
            if (this.element.innerHTML.indexOf('UL')) {
                var innerElement = this.host.find('ul:first');
                if (innerElement.length > 0) {
                    this._createMenu(innerElement[0]);
                }
            }

            this._setSize();
            this._render();
        },

        isTouchDevice: function () {
            if (this._isTouchDevice != undefined) return this._isTouchDevice;
            var isTouchDevice = $.jqx.mobile.isTouchDevice();
            if (this.touchMode == true) {
                isTouchDevice = true;
            }
            else if (this.touchMode == false) {
                isTouchDevice = false;
            }
            if (isTouchDevice) {
                this.host.addClass(this.toThemeProperty('jqx-touch'));
                $(".jqx-menu-item").addClass(this.toThemeProperty('jqx-touch'));
            }
            this._isTouchDevice = isTouchDevice;
            return isTouchDevice;
        },

        refresh: function (initialRefresh) {
            if (!initialRefresh) {
                this._setSize();
            }
        },

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            this.refresh();
        },

        _closeAll: function (e) {
            var me = e != null ? e.data : this;
            var items = me.items;
            $.each(items, function () {
                var item = this;
                if (item.hasItems == true) {
                    if (item.isOpen) {
                        me._closeItem(me, item);
                    }
                }
            });

            if (me.mode == 'popup') {
                if (e != null) {
                    var rightclick = me._isRightClick(e);
                    if (!rightclick) {
                        me.close();
                    }
                }
            }
        },

        // @param id
        // closes a menu item by id.
        closeItem: function (id) {
            if (id == null)
                return false;
            var theId = id;
            var element = document.getElementById(theId);
            var me = this;

            $.each(me.items, function () {
                var item = this;
                if (item.isOpen == true && item.element == element) {
                    me._closeItem(me, item);
                    if (item.parentId) {
                        me.closeItem(item.parentId);
                    }
                }
            });

            return true;
        },

        // @param id
        // opens a menu item by id.
        openItem: function (id) {
            if (id == null)
                return false;

            var theId = id;
            var element = document.getElementById(theId);
            var me = this;
            $.each(me.items, function () {
                var item = this;
                if (item.isOpen == false && item.element == element) {
                    me._openItem(me, item);
                    if (item.parentId) {
                        me.openItem(item.parentId);
                    }
                }
            });

            return true;
        },

        _getClosedSubMenuOffset: function (item) {
            var $submenu = $(item.subMenuElement);
            var top = -$submenu.outerHeight();
            var left = -$submenu.outerWidth();
            var isTopItem = item.level == 0 && this.mode == 'horizontal';
            if (isTopItem) {
                left = 0;
            }
            else {
                top = 0;
            }

            switch (item['openVerticalDirection']) {
                case 'up':
                case 'center':
                    top = $submenu.outerHeight();
                    break;
            }

            switch (item['openHorizontalDirection']) {
                case this._getDir('left'):
                    if (isTopItem) {
                        left = 0;
                    }
                    else {
                        left = $submenu.outerWidth();
                    }
                    break;
                case 'center':
                    if (isTopItem) {
                        left = 0;
                    }
                    else {
                        left = $submenu.outerWidth();
                    }
                    break;
            }
            return { left: left, top: top };
        },


        _closeItem: function (me, item, subs, force) {
            if (me == null || item == null)
                return false;

            var $submenu = $(item.subMenuElement);

            var isTopItem = item.level == 0 && this.mode == 'horizontal';
            var subMenuOffset = this._getClosedSubMenuOffset(item);
            var top = subMenuOffset.top;
            var left = subMenuOffset.left;

            var $menuElement = $(item.element);
            var $popupElement = $submenu.closest('div.jqx-menu-popup');
            if ($popupElement != null) {
                var delay = me.animationHideDelay;
                if (force == true) {
                    //     clearTimeout($submenu.data('timer').hide);
                    delay = 0;
                }

                if ($submenu.data('timer') && $submenu.data('timer').show != null) {
                    clearTimeout($submenu.data('timer').show);
                    $submenu.data('timer').show = null;
                }

                var hideFunc = function () {
                    item.isOpen = false;

                    if (isTopItem) {
                        $submenu.stop().animate({ top: top }, me.animationHideDuration, function () {
                            $(item.element).removeClass(me.toThemeProperty('jqx-fill-state-pressed'));
                            $(item.element).removeClass(me.toThemeProperty('jqx-menu-item-top-selected'));

                            $(item.element).removeClass(me.toThemeProperty('jqx-rc-b-expanded'));
                            $popupElement.removeClass(me.toThemeProperty('jqx-rc-t-expanded'));
                            var $arrowSpan = $(item.arrow);
                            if ($arrowSpan.length > 0 && me.showTopLevelArrows) {
                                $arrowSpan.removeClass();
                                if (item.openVerticalDirection == 'down') {
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-down'));
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-down'));
                                }
                                else {
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-up'));
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-up'));
                                }
                            }
                            $.jqx.aria($(item.element), 'aria-expanded', false);

                            $popupElement.css({ display: 'none' });
                            if (me.animationHideDuration == 0) {
                                $submenu.css({ top: top });
                            }
                            me._raiseEvent('1', item);
                        })
                    }
                    else {
                        if (!$.jqx.browser.msie) {
                            //       $popupElement.stop().animate({ opacity: 0 }, me.animationHideDuration, function () {
                            //         });
                        }

                        $submenu.stop().animate({ left: left }, me.animationHideDuration, function () {
                            if (me.animationHideDuration == 0) {
                                $submenu.css({ left: left });
                            }

                            if (item.level > 0) {
                                $(item.element).removeClass(me.toThemeProperty('jqx-fill-state-pressed'));
                                $(item.element).removeClass(me.toThemeProperty('jqx-menu-item-selected'));
                                var $arrowSpan = $(item.arrow);
                                if ($arrowSpan.length > 0) {
                                    $arrowSpan.removeClass();
                                    if (item.openHorizontalDirection != 'left') {
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('right')));
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('right')));
                                    }
                                    else {
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('left')));
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('left')));
                                    }
                                }
                            }
                            else {
                                $(item.element).removeClass(me.toThemeProperty('jqx-fill-state-pressed'));
                                $(item.element).removeClass(me.toThemeProperty('jqx-menu-item-top-selected'));
                                var $arrowSpan = $(item.arrow);
                                if ($arrowSpan.length > 0) {
                                    $arrowSpan.removeClass();
                                    if (item.openHorizontalDirection != 'left') {
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-top-' + me._getDir('right')));
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('right')));
                                    }
                                    else {
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-top-' + me._getDir('left')));
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('left')));
                                    }
                                }
                            }
                            $.jqx.aria($(item.element), 'aria-expanded', false);
                            $popupElement.css({ display: 'none' })
                            me._raiseEvent('1', item);
                        })
                    }
                }

                if (delay > 0) {
                    if ($submenu.data('timer')) {
                        $submenu.data('timer').hide = setTimeout(function () {
                            hideFunc();
                        }, delay);
                    }
                }
                else {
                    hideFunc();
                }

                if (subs != undefined && subs) {
                    var children = $submenu.children();// find('.' + me.toThemeProperty('jqx-menu-item'));
                    $.each(children, function () {
                        if (me.menuElements[this.id] && me.menuElements[this.id].isOpen) {
                            var $submenu = $(me.menuElements[this.id].subMenuElement);
                            me._closeItem(me, me.menuElements[this.id], true, true);
                        }
                    });
                }
            }
        },

        // @param id
        // @param array.
        // get menu item's sub items.
        getSubItems: function (id, array) {
            if (id == null)
                return false;

            var me = this;
            var subItems = new Array();
            if (array != null) {
                $.extend(subItems, array);
            }

            var theId = id;
            var item = this.menuElements[theId];
            var $submenu = $(item.subMenuElement);
            var children = $submenu.find('.jqx-menu-item');
            $.each(children, function () {
                subItems[this.id] = me.menuElements[this.id];
                var innerArray = me.getSubItems(this.id, subItems);
                $.extend(subItems, innerArray);
            });

            return subItems;
        },

        // disables a menu item.
        // @param id
        // @param Boolean
        disable: function (id, disable) {
            if (id == null)
                return;
            var theId = id;
            var me = this;
            if (this.menuElements[theId]) {
                var item = this.menuElements[theId];
                item.disabled = disable;
                var $element = $(item.element);
                item.element.disabled = disable;
                $.each($element.children(), function () {
                    this.disabled = disable;
                });

                if (disable) {
                    $element.addClass(me.toThemeProperty('jqx-menu-item-disabled'));
                    $element.addClass(me.toThemeProperty('jqx-fill-state-disabled'));
                }
                else {
                    $element.removeClass(me.toThemeProperty('jqx-menu-item-disabled'));
                    $element.removeClass(me.toThemeProperty('jqx-fill-state-disabled'));
                }
            }
        },

        getItem: function(id)
        {
            if (this.menuElements[id]) {
                var item = this.menuElements[id];
                return item;
            }
            return null;
        },

        disableItem: function(id)
        {
            this.disable(id, true);
        },

        hideItem: function(id)
        {
            if (this.menuElements[id]) {
                var item = this.menuElements[id];
                $(item.element).hide();
            }
        },

        showItem: function (id) {
            if (this.menuElements[id]) {
                var item = this.menuElements[id];
                $(item.element).show();
            }
        },


        enableItem: function (id) {
            this.disable(id, false);
        },

        _setItemProperty: function (id, propertyname, value) {
            if (id == null)
                return;

            var theId = id;
            var me = this;

            if (this.menuElements[theId]) {
                var item = this.menuElements[theId];
                if (item[propertyname]) {
                    item[propertyname] = value;
                }
            }
        },

        // sets the open direction of an item.
        // @param id
        // @param String
        // @param String
        setItemOpenDirection: function (id, horizontal, vertical) {
            if (id == null)
                return;
            var theId = id;
            var me = this;
            var ie7 = $.jqx.browser.msie && $.jqx.browser.version < 8;

            if (this.menuElements[theId]) {
                var item = this.menuElements[theId];
                if (horizontal != null) {
                    item['openHorizontalDirection'] = horizontal;
                    if (item.hasItems && item.level > 0) {
                        var $element = $(item.element);
                        if ($element != undefined) {
                            var $arrowSpan = $(item.arrow);
                            if (item.arrow == null) {
                                $arrowSpan = $('<span id="arrow' + $element[0].id + '"></span>');
                                if (!ie7) {
                                    $arrowSpan.prependTo($element);
                                }
                                else {
                                    $arrowSpan.appendTo($element);
                                }
                                item.arrow = $arrowSpan[0];
                            }
                            $arrowSpan.removeClass();
                            if (item.openHorizontalDirection == 'left') {
                                $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('left')));
                                $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('left')));
                            }
                            else {
                                $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('right')));
                                $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('right')));
                            }
                            $arrowSpan.css('visibility', 'inherit');

                            if (!ie7) {
                                $arrowSpan.css('display', 'block');
                                $arrowSpan.css('float', 'right');
                            }
                            else {
                                $arrowSpan.css('display', 'inline-block');
                                $arrowSpan.css('float', 'none');
                            }
                        }
                    }
                }
                if (vertical != null) {
                    item['openVerticalDirection'] = vertical;
                    var $arrowSpan = $(item.arrow);
                    var $element = $(item.element);
                    if (!me.showTopLevelArrows) {
                        return;
                    }

                    if ($element != undefined) {
                        if (item.arrow == null) {
                            $arrowSpan = $('<span id="arrow' + $element[0].id + '"></span>');
                            if (!ie7) {
                                $arrowSpan.prependTo($element);
                            }
                            else {
                                $arrowSpan.appendTo($element);
                            }
                            item.arrow = $arrowSpan[0];
                        }
                        $arrowSpan.removeClass();
                        if (item.openVerticalDirection == 'down') {
                            $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-down'));
                            $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-down'));
                        }
                        else {
                            $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-up'));
                            $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-up'));
                        }
                        $arrowSpan.css('visibility', 'inherit');
                        if (!ie7) {
                            $arrowSpan.css('display', 'block');
                            $arrowSpan.css('float', 'right');
                        }
                        else {
                            $arrowSpan.css('display', 'inline-block');
                            $arrowSpan.css('float', 'none');

                        }
                    }
                }
            }
        },


        _getSiblings: function (item) {
            var siblings = new Array();
            var index = 0;
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i] == item)
                    continue;

                if (this.items[i].parentId == item.parentId && this.items[i].hasItems) {
                    siblings[index++] = this.items[i];
                }
            }
            return siblings;
        },


        _openItem: function (me, item, zIndex) {
            if (me == null || item == null)
                return false;

            if (item.isOpen)
                return false;

            if (item.disabled)
                return false;

            if (me.disabled)
                return false;
            var zIndx = me.popupZIndex;
            if (zIndex != undefined) {
                zIndx = zIndex;
            }

            var hideDuration = me.animationHideDuration;
            me.animationHideDuration = 0;
            me._closeItem(me, item, true, true);
            me.animationHideDuration = hideDuration;

            $(item.element).focus();

          //  this.host.focus();

            var popupElementoffset = [5, 5];
            var $submenu = $(item.subMenuElement);
            if ($submenu != null) {
                $submenu.stop();
            }
            // stop hiding process.
            if ($submenu.data('timer') && $submenu.data('timer').hide != null) {
                clearTimeout($submenu.data('timer').hide);
                //      $submenu.data('timer').hide = null;
            }
            var $popupElement = $submenu.closest('div.jqx-menu-popup');
            var $menuElement = $(item.element);
            var offset = item.level == 0 ? this._getOffset(item.element) : $menuElement.position()

            if (item.level > 0 && this.hasTransform) {
                var topTransform = parseInt($menuElement.coord().top) - parseInt(this._getOffset(item.element).top);
                offset.top += topTransform;
            }

            if (item.level == 0 && this.mode == 'popup') {
                offset = $menuElement.coord();
            }

            var isTopItem = item.level == 0 && this.mode == 'horizontal';

            var menuItemLeftOffset = isTopItem ? offset.left : this.menuElements[item.parentId] != null && this.menuElements[item.parentId].subMenuElement != null ? parseInt($($(this.menuElements[item.parentId].subMenuElement).closest('div.jqx-menu-popup')).outerWidth()) - popupElementoffset[0]
            : parseInt($submenu.outerWidth());

            $popupElement.css({ visibility: 'visible', display: 'block', left: menuItemLeftOffset, top: isTopItem ? offset.top + $menuElement.outerHeight() : offset.top, zIndex: zIndx })
            $submenu.css('display', 'block');

            if (this.mode != 'horizontal' && item.level == 0) {
                var hostOffset = this._getOffset(this.element)
                $popupElement.css('left', -1 + hostOffset.left + this.host.outerWidth());

                //          $popupElement.css('left', -2 + offset.left + this.host.width() - popupElementoffset[0]);
                $submenu.css('left', -$submenu.outerWidth());
            }
            else {
                var subMenuOffset = this._getClosedSubMenuOffset(item);
                $submenu.css('left', subMenuOffset.left);
                $submenu.css('top', subMenuOffset.top);
            }

            $popupElement.css({ height: parseInt($submenu.outerHeight()) + parseInt(popupElementoffset[1]) + 'px' });

            var top = 0;
            var left = 0;

            switch (item['openVerticalDirection']) {
                case 'up':
                    if (isTopItem) {
                        $submenu.css('top', $submenu.outerHeight());
                        top = popupElementoffset[1];
                        var paddingBottom = parseInt($submenu.parent().css('padding-bottom'));
                        if (isNaN(paddingBottom)) paddingBottom = 0;
                        if (paddingBottom > 0) {
                            $popupElement.addClass(this.toThemeProperty('jqx-menu-popup-clear'));
                        }

                        $submenu.css('top', $submenu.outerHeight() - paddingBottom);
                        $popupElement.css({ display: 'block', top: offset.top - $popupElement.outerHeight(), zIndex: zIndx })
                    }
                    else {
                        top = popupElementoffset[1];
                        $submenu.css('top', $submenu.outerHeight());
                        $popupElement.css({ display: 'block', top: offset.top - $popupElement.outerHeight() + popupElementoffset[1] + $menuElement.outerHeight(), zIndex: zIndx })
                    }
                    break;
                case 'center':
                    if (isTopItem) {
                        $submenu.css('top', 0);
                        $popupElement.css({ display: 'block', top: offset.top - $popupElement.outerHeight() / 2 + popupElementoffset[1], zIndex: zIndx })
                    }
                    else {
                        $submenu.css('top', 0);
                        $popupElement.css({ display: 'block', top: offset.top + $menuElement.outerHeight() / 2 - $popupElement.outerHeight() / 2 + popupElementoffset[1], zIndex: zIndx })
                    }

                    break;
            }

            switch (item['openHorizontalDirection']) {
                case this._getDir('left'):
                    if (isTopItem) {
                        $popupElement.css({ left: offset.left - ($popupElement.outerWidth() - $menuElement.outerWidth() - popupElementoffset[0]) });
                    }
                    else {
                        left = 0;
                        $submenu.css('left', $popupElement.outerWidth());
                        $popupElement.css({ left: offset.left - ($popupElement.outerWidth()) + 2 * item.level });
                    }
                    break;
                case 'center':
                    if (isTopItem) {
                        $popupElement.css({ left: offset.left - ($popupElement.outerWidth() / 2 - $menuElement.outerWidth() / 2 - popupElementoffset[0] / 2) });
                    }
                    else {
                        $popupElement.css({ left: offset.left - ($popupElement.outerWidth() / 2 - $menuElement.outerWidth() / 2 - popupElementoffset[0] / 2) });
                        $submenu.css('left', $popupElement.outerWidth());
                    }
                    break;
            }

            if (isTopItem) {
                if (parseInt($submenu.css('top')) == top) {
                    item.isOpen = true;
                    return;
                }
            }
            else if (parseInt($submenu.css('left')) == left) {
                item.isOpen == true;
                return;
            }

            $.each(me._getSiblings(item), function () {
                me._closeItem(me, this, true, true);
            });
            var hideDelay = $.data(me.element, 'animationHideDelay');
            me.animationHideDelay = hideDelay;


            if (this.autoCloseInterval > 0) {
                if (this.host.data('autoclose') != null && this.host.data('autoclose').close != null) {
                    clearTimeout(this.host.data('autoclose').close);
                }

                if (this.host.data('autoclose') != null) {
                    this.host.data('autoclose').close = setTimeout(function () {
                        me._closeAll();
                    }, this.autoCloseInterval);
                }
            }
            if ($submenu.data('timer')) {
                $submenu.data('timer').show = setTimeout(function () {
                    if ($popupElement != null) {
                        if (isTopItem) {
                            $submenu.stop();
                            $submenu.css('left', left);
                            if (!$.jqx.browser.msie) {
                                //      $popupElement.css('opacity', 0.0);
                            }

                            $menuElement.addClass(me.toThemeProperty('jqx-fill-state-pressed'));
                            $menuElement.addClass(me.toThemeProperty('jqx-menu-item-top-selected'));
                            if (item.openVerticalDirection == "down") {
                                $(item.element).addClass(me.toThemeProperty('jqx-rc-b-expanded'));
                                $popupElement.addClass(me.toThemeProperty('jqx-rc-t-expanded'));
                            }
                            else {
                                $(item.element).addClass(me.toThemeProperty('jqx-rc-t-expanded'));
                                $popupElement.addClass(me.toThemeProperty('jqx-rc-b-expanded'));
                            }

                            var $arrowSpan = $(item.arrow);
                            if ($arrowSpan.length > 0 && me.showTopLevelArrows) {
                                $arrowSpan.removeClass();
                                if (item.openVerticalDirection == 'down') {
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-down-selected'));
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-down'));
                                }
                                else {
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-up-selected'));
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-up'));
                                }
                            }

                            if (me.animationShowDuration == 0) {
                                $submenu.css({ top: top });
                                item.isOpen = true;
                                me._raiseEvent('0', item);
                                $.jqx.aria($(item.element), 'aria-expanded', true);
                            }
                            else {
                                $submenu.animate({ top: top }, me.animationShowDuration, me.easing,
                                function () {
                                    item.isOpen = true;
                                    $.jqx.aria($(item.element), 'aria-expanded', true);
                                    me._raiseEvent('0', item);
                                }) //animate submenu into view
                            }
                        }
                        else {
                            $submenu.stop();
                            $submenu.css('top', top);
                            if (!$.jqx.browser.msie) {
                                //     $popupElement.css('opacity', 0.0);
                            }

                            if (item.level > 0) {
                                $menuElement.addClass(me.toThemeProperty('jqx-fill-state-pressed'));
                                $menuElement.addClass(me.toThemeProperty('jqx-menu-item-selected'));
                                var $arrowSpan = $(item.arrow);
                                if ($arrowSpan.length > 0) {
                                    $arrowSpan.removeClass();
                                    if (item.openHorizontalDirection != 'left') {
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('right') + '-selected'));
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('right')));
                                    }
                                    else {
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('left') + '-selected'));
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('left')));
                                    }
                                }
                            }
                            else {
                                $menuElement.addClass(me.toThemeProperty('jqx-fill-state-pressed'));
                                $menuElement.addClass(me.toThemeProperty('jqx-menu-item-top-selected'));
                                var $arrowSpan = $(item.arrow);
                                if ($arrowSpan.length > 0) {
                                    $arrowSpan.removeClass();
                                    if (item.openHorizontalDirection != 'left') {
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('right') + '-selected'));
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('right')));
                                    }
                                    else {
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('left') + '-selected'));
                                        $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('left')));
                                    }
                                }
                            }
                            if (!$.jqx.browser.msie) {
                                //      $popupElement.animate({ opacity: 1 }, 2 * me.animationShowDuration, me.easing,
                                //   function () {

                                // })
                            }
                            if (me.animationShowDuration == 0) {
                                $submenu.css({ left: left });
                                me._raiseEvent('0', item);
                                item.isOpen = true;
                                $.jqx.aria($(item.element), 'aria-expanded', true);
                            }
                            else {
                                $submenu.animate({ left: left }, me.animationShowDuration, me.easing, function () {
                                    me._raiseEvent('0', item);
                                    item.isOpen = true;
                                    $.jqx.aria($(item.element), 'aria-expanded', true);
                                }) //animate submenu into view
                            }
                        }
                    }
                }, this.animationShowDelay);
            }
        },

        _getDir: function (dir) {
            switch (dir) {
                case 'left':
                    return !this.rtl ? 'left' : 'right';
                case 'right':
                    return this.rtl ? 'left' : 'right';
            }
            return 'left';
        },


        _applyOrientation: function (mode, oldmode) {
            var me = this;
            var maxHeight = 0;
            me.host.removeClass(me.toThemeProperty('jqx-menu-horizontal'));
            me.host.removeClass(me.toThemeProperty('jqx-menu-vertical'));
            me.host.removeClass(me.toThemeProperty('jqx-menu'));
            me.host.removeClass(me.toThemeProperty('jqx-widget'));
            me.host.addClass(me.toThemeProperty('jqx-widget'));
            me.host.addClass(me.toThemeProperty('jqx-menu'));

            if (mode != undefined && oldmode != undefined && oldmode == 'popup') {
                if (me.host.parent().length > 0 && me.host.parent().parent().length > 0 && me.host.parent().parent()[0] == document.body) {
                    var oldHost = $.data(document.body, 'jqxMenuOldHost' + me.element.id);
                    if (oldHost != null) {
                        var $popupElementparent = me.host.closest('div.jqx-menu-wrapper')
                        $popupElementparent.remove();
                        $popupElementparent.appendTo(oldHost);
                        me.host.css('display', 'block');
                        me.host.css('visibility', 'visible');
                        $popupElementparent.css('display', 'block');
                        $popupElementparent.css('visibility', 'visible');
                    }
                }
            }
            else if (mode == undefined && oldmode == undefined) {
                $.data(document.body, 'jqxMenuOldHost' + me.element.id, me.host.parent()[0]);
            }

            if (me.autoOpenPopup) {
                if (me.mode == 'popup') {
                    me.addHandler($(document), 'contextmenu.' + me.element.id, function (e) {
                        return false;
                    });

                    me.addHandler($(document), 'mousedown.menu' + me.element.id, function (event) {
                        me._openContextMenu(event);
                    });
                }
                else {
                    me.removeHandler($(document), 'contextmenu.' + me.element.id);
                    me.removeHandler($(document), 'mousedown.menu' + me.element.id);
                }
            }
            else {
                me.removeHandler($(document), 'contextmenu.' + me.element.id);
                me.removeHandler($(document), 'mousedown.menu' + me.element.id);
                me.addHandler($(document), 'contextmenu.' + me.element.id, function (e) {
                    if (e.target && e.target.className.indexOf && e.target.className.indexOf('jqx-menu') >= 0) {
                        return false;
                    }
                });
            }

            if (me.rtl) {
                me.host.addClass(me.toThemeProperty('jqx-rtl'));
            }

            switch (me.mode) {
                case 'horizontal':
                    me.host.addClass(me.toThemeProperty('jqx-widget-header'));
                    me.host.addClass(me.toThemeProperty('jqx-menu-horizontal'));

                    $.each(me.items, function () {
                        var item = this;
                        $element = $(item.element);

                        var $arrowSpan = $(item.arrow);
                        $arrowSpan.removeClass();

                        if (item.hasItems && item.level > 0) {
                            var $arrowSpan = $('<span style="border: none; background-color: transparent;" id="arrow' + $element[0].id + '"></span>');
                            $arrowSpan.prependTo($element);
                            $arrowSpan.css('float', me._getDir('right'));
                            $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('right')));
                            $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('right')));
                            item.arrow = $arrowSpan[0];
                        }

                        if (item.level == 0) {
                            $(item.element).css('float', me._getDir('left'));
                            if (!item.ignoretheme && item.hasItems && me.showTopLevelArrows) {
                                var $arrowSpan = $('<span style="border: none; background-color: transparent;" id="arrow' + $element[0].id + '"></span>');
                                var ie7 = $.jqx.browser.msie && $.jqx.browser.version < 8;

                                if (item.arrow == null) {
                                    if (!ie7) {
                                        $arrowSpan.prependTo($element);
                                    }
                                    else {
                                        $arrowSpan.appendTo($element);
                                    }
                                } else {
                                    $arrowSpan = $(item.arrow);
                                }
                                if (item.openVerticalDirection == 'down') {
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-down'));
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-down'));
                                }
                                else {
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-up'));
                                    $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-up'));
                                }

                                $arrowSpan.css('visibility', 'inherit');

                                if (!ie7) {
                                    $arrowSpan.css('display', 'block');
                                    $arrowSpan.css('float', 'right');
                                }
                                else {
                                    $arrowSpan.css('display', 'inline-block');
                                }

                                item.arrow = $arrowSpan[0];
                            }
                            else if (!item.ignoretheme && item.hasItems && !me.showTopLevelArrows) {
                                if (item.arrow != null) {
                                    var $arrowSpan = $(item.arrow);
                                    $arrowSpan.remove();
                                    item.arrow = null;
                                }
                            }
                            maxHeight = Math.max(maxHeight, $element.height());
                        }
                    });
                    break;
                case 'vertical':
                case 'popup':
                case 'simple':
                    me.host.addClass(me.toThemeProperty('jqx-menu-vertical'));

                    $.each(me.items, function () {
                        var item = this;
                        $element = $(item.element);
                        if (item.hasItems && !item.ignoretheme) {
                            if (item.arrow) {
                                $(item.arrow).remove();
                            }
                            if (me.mode == 'simple') return true;

                            var $arrowSpan = $('<span style="border: none; background-color: transparent;" id="arrow' + $element[0].id + '"></span>');

                            $arrowSpan.prependTo($element);
                            $arrowSpan.css('float', 'right');

                            if (item.level == 0) {
                                $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-top-' + me._getDir('right')));
                                $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('right')));
                            }
                            else {
                                $arrowSpan.addClass(me.toThemeProperty('jqx-menu-item-arrow-' + me._getDir('right')));
                                $arrowSpan.addClass(me.toThemeProperty('jqx-icon-arrow-' + me._getDir('right')));
                            }
                            item.arrow = $arrowSpan[0];
                        }
                        $element.css('float', 'none');
                    });

                    if (me.mode == 'popup') {
                        me.host.addClass(me.toThemeProperty('jqx-widget-content'));
                        me.host.wrap('<div tabindex=0 class="jqx-menu-wrapper" style="z-index:' + me.popupZIndex + '; border: none; background-color: transparent; padding: 0px; margin: 0px; position: absolute; top: 0; left: 0; display: block; visibility: visible;"></div>')
                        var $popupElementparent = me.host.closest('div.jqx-menu-wrapper')
                        me.host.addClass(me.toThemeProperty('jqx-popup'));
                        $popupElementparent[0].id = "menuWrapper" + me.element.id;
                        $popupElementparent.appendTo($(document.body));
                        me.addHandler($popupElementparent, 'keydown', function (event) {
                            return me.handleKeyDown(event);
                        });
                    }
                    else {
                        me.host.addClass(me.toThemeProperty('jqx-widget-header'));
                    }

                    if (me.mode == 'popup') {
                        var height = me.host.height();
                        me.host.css('position', 'absolute');
                        me.host.css('top', '0');
                        me.host.css('left', '0');
                        if (me.mode != "simple") {
                            me.host.height(height);
                            me.host.css('display', 'none');
                        }
                    }
                    break;
            }
            var isTouchDevice = me.isTouchDevice();
            if (me.autoCloseOnClick) {
                me.removeHandler($(document), 'mousedown.menu' + me.element.id, me._closeAfterClick);
                me.addHandler($(document), 'mousedown.menu' + me.element.id, me._closeAfterClick, me);
                if (isTouchDevice) {
                    me.removeHandler($(document), $.jqx.mobile.getTouchEventName('touchstart') + '.menu' + me.element.id, me._closeAfterClick, me);
                    me.addHandler($(document), $.jqx.mobile.getTouchEventName('touchstart') + '.menu' + me.element.id, me._closeAfterClick, me);
                }
            }
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

        _getOffset: function (object) {
            //       var scrollTop = $(window).scrollTop();
            //       var scrollLeft = $(window).scrollLeft();
            var isSafari = $.jqx.mobile.isSafariMobileBrowser();

            var offset = $(object).coord(true);
            var top = offset.top;
            var left = offset.left;

            if ($('body').css('border-top-width') != '0px') {
                top = parseInt(top) + this._getBodyOffset().top;
            }
            if ($('body').css('border-left-width') != '0px') {
                left = parseInt(left) + this._getBodyOffset().left;
            }

            var windowsPhone = $.jqx.mobile.isWindowsPhone();
            var touchDevice = $.jqx.mobile.isTouchDevice();
        
            if (this.hasTransform || (isSafari != null && isSafari) || windowsPhone || touchDevice) {
                var point = { left: $.jqx.mobile.getLeftPos(object), top: $.jqx.mobile.getTopPos(object) };
                return point;
            }
            else return { left: left, top: top };
        },

        _isRightClick: function (e) {
            var rightclick;
            if (!e) var e = window.event;
            if (e.which) rightclick = (e.which == 3);
            else if (e.button) rightclick = (e.button == 2);
            return rightclick;
        },

        _openContextMenu: function (e) {
            var me = this;
            var rightclick = me._isRightClick(e);

            if (rightclick) {
                me.open(parseInt(e.clientX) + 5, parseInt(e.clientY) + 5);
            }
        },

        // closes a context menu.
        close: function () {
            var me = this;
            var opened = $.data(this.element, 'contextMenuOpened' + this.element.id);
            if (opened) {
                var host = this.host;
                $.each(me.items, function () {
                    var item = this;
                    if (item.hasItems) {
                        me._closeItem(me, item);
                    }
                });

                $.each(me.items, function () {
                    var item = this;
                    if (item.isOpen == true) {
                        $submenu = $(item.subMenuElement);
                        var $popupElement = $submenu.closest('div.jqx-menu-popup')
                        $popupElement.hide(this.animationHideDuration);

                    }
                });

                this.host.hide(this.animationHideDuration);
                $.data(me.element, 'contextMenuOpened' + this.element.id, false);
                me._raiseEvent('1', me);
                me._raiseEvent('5');
            }
        },

        // @param String. Horizontal offset
        // @param String. Vertical Offset
        // opens a context menu.
        open: function (left, top) {
            if (this.mode == 'popup') {
                var duration = 0;
                if (this.host.css('display') == 'block') {
                    this.close();
                    duration = this.animationHideDuration;
                }

                var me = this;

                if (left == undefined || left == null) left = 0;
                if (top == undefined || top == null) top = 0;

                setTimeout(function () {
                    me.host.show(me.animationShowDuration);
                    me.host.css('visibility', 'visible');
                    $.data(me.element, 'contextMenuOpened' + me.element.id, true);
                    me._raiseEvent('0', me);
                    me._raiseEvent('4', { left: left, top: top });
                    me.host.css('z-index', 9999);

                    if (left != undefined && top != undefined) {
                        me.host.css({ 'left': left, 'top': top });
                    }
                    me.focus();
                }, duration);
            }
        },

        _renderHover: function ($menuElement, item, isTouchDevice) {
            var me = this;
            if (!item.ignoretheme) {
                this.addHandler($menuElement, 'mouseenter', function () {
                    me.hoveredItem = item;
                    if (!item.disabled && !item.separator && me.enableHover && !me.disabled) {
                        if (item.level > 0) {
                            $menuElement.addClass(me.toThemeProperty('jqx-fill-state-hover'));
                            $menuElement.addClass(me.toThemeProperty('jqx-menu-item-hover'));
                        }
                        else {
                            $menuElement.addClass(me.toThemeProperty('jqx-fill-state-hover'));
                            $menuElement.addClass(me.toThemeProperty('jqx-menu-item-top-hover'));
                        }
                    }
                });
                this.addHandler($menuElement, 'mouseleave', function () {
                    if (!item.disabled && !item.separator && me.enableHover && !me.disabled) {
                        if (item.level > 0) {
                            $menuElement.removeClass(me.toThemeProperty('jqx-fill-state-hover'));
                            $menuElement.removeClass(me.toThemeProperty('jqx-menu-item-hover'));
                        }
                        else {
                            $menuElement.removeClass(me.toThemeProperty('jqx-fill-state-hover'));
                            $menuElement.removeClass(me.toThemeProperty('jqx-menu-item-top-hover'));
                        }
                    }
                });
            }
        },

        _closeAfterClick: function (event) {
            var me = event != null ? event.data : this;
            var matches = false;
            if (me.autoCloseOnClick) {
                $.each($(event.target).parents(), function () {
                    if (this.className.indexOf) {
                        if (this.className.indexOf('jqx-menu') != -1) {
                            matches = true;
                            return false;
                        }
                    }
                });

                if (!matches) {
                    event.data = me;
                    me._closeAll(event);
                }
            }
        },

        _autoSizeHorizontalMenuItems: function () {
            var me = this;
            if (me.autoSizeMainItems && this.mode == "horizontal") {
                var maxHeight = this.maxHeight;
                if (parseInt(maxHeight) > parseInt(this.host.height())) {
                    maxHeight = parseInt(this.host.height());
                }
                maxHeight = parseInt(this.host.height());

                // align vertically the items.
                $.each(this.items, function () {
                    var item = this;
                    $element = $(item.element);
                    if (item.level == 0 && maxHeight > 0) {
                        var childrenHeight = $element.children().length > 0 ? parseInt($element.children().height()) : $element.height();
                        // vertically align content.
                        var $ul = me.host.find('ul:first');
                        var paddingOffset = parseInt($ul.css('padding-top'));
                        var marginOffset = parseInt($ul.css('margin-top'));
                        //   var borderOffset = parseInt(me.host.css('border-top-width'));
                        var height = maxHeight - 2 * (marginOffset + paddingOffset);
                        var newPadding = parseInt(height) / 2 - childrenHeight / 2;
                        var topPadding = parseInt(newPadding);
                        var bottomPadding = parseInt(newPadding);
                        $element.css('padding-top', topPadding);
                        $element.css('padding-bottom', bottomPadding);

                        if (parseInt($element.outerHeight()) > height) {
                            var offset = 1;
                            $element.css('padding-top', topPadding - offset);
                            topPadding = topPadding - offset;
                        }
                    }
                });
            }
            $.each(this.items, function () {
                var item = this;
                $element = $(item.element);
                if (item.hasItems && item.level > 0) {
                    if (item.arrow) {
                        var $arrowSpan = $(item.arrow);
                        var height = $(item.element).height();
                        if (height > 15) {
                            $arrowSpan.css('margin-top', (height - 15) / 2);
                        }
                    }
                }
            });
        },

        _nextVisibleItem: function (item, level) {
            if (item == null || item == undefined)
                return null;

            var currentItem = item;
            while (currentItem != null) {
                currentItem = currentItem.nextItem;
                if (this._isVisible(currentItem) && !currentItem.disabled && currentItem.type !== "separator") {
                    if (this.minimized) {
                        return currentItem;
                    }

                    if (level != undefined) {
                        if (currentItem && currentItem.level != level)
                            continue;
                    }

                    return currentItem;
                }
            }

            return null;
        },

        _prevVisibleItem: function (item, level) {
            if (item == null || item == undefined)
                return null;

            var currentItem = item;
            while (currentItem != null) {
                currentItem = currentItem.prevItem;
                if (this._isVisible(currentItem) && !currentItem.disabled && currentItem.type !== "separator") {
                    if (this.minimized) {
                        return currentItem;
                    }

                    if (level != undefined) {
                        if (currentItem && currentItem.level != level)
                            continue;
                    }
                    return currentItem;
                }
            }

            return null;
        },

        _parentItem: function (item) {
            if (item == null || item == undefined)
                return null;

            var parent = item.parentElement;
            if (!parent) return null;
            var parentItem = null;

            $.each(this.items, function () {
                if (this.element == parent) {
                    parentItem = this;
                    return false;
                }
            });

            return parentItem;
        },

        _isElementVisible: function (element) {
            if (element == null)
                return false;

            if ($(element).css('display') != 'none' && $(element).css('visibility') != 'hidden') {
                return true;
            }

            return false;
        },

        _isVisible: function (item) {
            if (item == null || item == undefined)
                return false;

            if (!this._isElementVisible(item.element))
                return false;

            var currentItem = this._parentItem(item);

            if (currentItem == null)
                return true;

            if (this.minimized)
                return true;

            if (currentItem != null) {
                if (!this._isElementVisible(currentItem.element)) {
                    return false;
                }

                if (currentItem.isOpen || this.minimized) {
                    while (currentItem != null) {
                        currentItem = this._parentItem(currentItem);
                        if (currentItem != null && !this._isElementVisible(currentItem.element)) {
                            return false;
                        }

                        if (currentItem != null && !currentItem.isOpen)
                            return false;
                    }
                }
                else {
                    return false;
                }
            }

            return true;
        },

        _render: function (mode, oldMode) {
            if (this.disabled) {
                this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
                this.host.addClass(this.toThemeProperty('jqx-menu-disabled'));
            }
            if (this.host.attr('tabindex') == undefined) {
                this.host.attr('tabindex', 0);
            }
            var zIndex = this.popupZIndex;
            var popupElementoffset = [5, 5];
            var me = this;
            $.data(me.element, 'animationHideDelay', me.animationHideDelay);
            var isTouchDevice = this.isTouchDevice();

            var WP = isTouchDevice && ($.jqx.mobile.isWindowsPhone() || navigator.userAgent.indexOf('Touch') >= 0);
            var WPTablet = false;
            if (navigator.platform.toLowerCase().indexOf('win') != -1) {
                if (navigator.userAgent.indexOf('Windows Phone') >= 0 || navigator.userAgent.indexOf('WPDesktop') >= 0 || navigator.userAgent.indexOf('IEMobile') >= 0 || navigator.userAgent.indexOf('ZuneWP7') >= 0) {
                    this.touchDevice = true;
                }
                else {
                    if (navigator.userAgent.indexOf('Touch') >= 0) {
                        var supported = ('MSPointerDown' in window);
                        if (supported || $.jqx.mobile.isWindowsPhone() || navigator.userAgent.indexOf('ARM') >= 0) {
                            WPTablet = true;
                            WP = true;
                            me.clickToOpen = true;
                            me.autoCloseOnClick = false;
                            me.enableHover = false;
                        }
                    }
                }
            }
            $.data(document.body, 'menuel', this);

            this.hasTransform = $.jqx.utilities.hasTransform(this.host);

            this._applyOrientation(mode, oldMode);
            this.removeHandler(this.host, 'blur');
            this.removeHandler(this.host, 'focus');
            this.addHandler(this.host, 'blur', function (event) {
                if (me.keyboardNavigation) {
                    if (me.activeItem) {
                        if (me.mode === "popup") {
                            if (document.activeElement && document.activeElement.className.indexOf('jqx-menu-wrapper') >= 0) {
                                return;
                            }
                        }
                        $(me.activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                        me.activeItem = null;
                    }
                }
            });
            this.addHandler(this.host, 'focus', function (event) {
                if (me.keyboardNavigation) {
                    if (!me.activeItem) {
                        if (me.hoveredItem) {
                            $(me.hoveredItem.element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                            me.activeItem = me.hoveredItem;
                        }
                        else {
                            var setActiveItem = function () {
                                if (!$.jqx.isHidden($(me.items[0].element))) {
                                    $(me.items[0].element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                                    me.activeItem = me.items[0];
                                }
                                else {
                                    var item = me._nextVisibleItem(me.items[0], 0);
                                    if (item) {
                                        $(item.element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                                        me.activeItem = item;
                                    }
                                }
                            }

                            if (!me.activeItem) {
                                setActiveItem();
                            }
                            else {
                                if (!$.jqx.isHidden($(me.activeItem.element))) {
                                    $(me.activeItem.element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                                }
                                else {
                                    $(me.activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                                    setActiveItem();
                                }
                            }
                        }
                    }
                }
            });
            this.removeHandler(this.host, 'keydown');
            me.handleKeyDown = function (event) {
                if (me.keyboardNavigation) {
                    if (event.target.nodeName.toLowerCase() === "input") {
                        return true;
                    }

                    var activeItem = null;
                    var selectedItem = null;

                    $.each(me.items, function () {
                        var item = this;
                        if (this.disabled)
                            return true;

                        if (this.element.className.indexOf('pressed') >= 0) {
                            selectedItem = this;
                        }

                        if (this.element.className.indexOf('focus') >= 0) {
                            activeItem = this;
                            return false;
                        }
                    });


                    if (!activeItem && selectedItem)
                        activeItem = selectedItem;
                    if (!activeItem) {
                        $(me.items[0].element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                        me.activeItem = me.items[0];
                        activeItem = me.activeItem;
                    }

                    var handled = false;
                    if (event.keyCode == 27) {
                        event.data = me;
                        me._closeAll(event);
                        if (activeItem) {
                            var item = activeItem;
                            while (item != null) {
                                if (item.parentItem) {
                                    item = item.parentItem;
                                }
                                else {
                                    $(me.activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                                    me.activeItem = item;
                                    $(me.activeItem.element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                                    item = item.parentItem;
                                }
                            }
                        }
                        handled = true;
                    }

                    if (event.keyCode == 13) {
                        if (activeItem) {
                            handled = true;
                            me._raiseEvent('2', { item: activeItem.element, event: event, type: "keyboard" });

                            var anchor = activeItem.anchor != null ? $(activeItem.anchor) : null;

                            if (anchor != null && anchor.length > 0) {
                                var href = anchor.attr('href');
                                var target = anchor.attr('target');
                                if (href != null) {
                                    if (target != null) {
                                        window.open(href, target);
                                    }
                                    else {
                                        window.location = href;
                                    }
                                }

                            }
                            event.preventDefault();
                            event.stopPropagation();
                            $(activeItem.element).focus();
                        }
                    }

                    var getSiblings = function (activeItem) {
                        if (activeItem == null)
                            return new Array();

                        var siblings = new Array();
                        var index = 0;
                        for (var i = 0; i < me.items.length; i++) {
                            if (me.items[i].parentId == activeItem.parentId) {
                                siblings[index++] = me.items[i];
                            }
                        }
                        return siblings;
                    }

                    var arrowKey = "";
                    switch (event.keyCode) {
                        case 40:
                            arrowKey = "down";
                            break;
                        case 38:
                            arrowKey = "up";
                            break;
                        case 39:
                            arrowKey = "right";
                            break;
                        case 37:
                            arrowKey = "left";
                            break;
                    }

                    if (activeItem && activeItem.openHorizontalDirection === "left" && arrowKey === "left") {
                        arrowKey = "right";
                    }
                    if (activeItem && activeItem.openHorizontalDirection === "left" && arrowKey === "right") {
                        arrowKey = "left";
                    }
                    if (activeItem && activeItem.openVerticalDirection === "top" && arrowKey === "top") {
                        arrowKey = "bottom";
                    }
                    if (activeItem && activeItem.openVerticalDirection === "top" && arrowKey === "bottom") {
                        arrowKey = "top";
                    }

                    if (me.rtl) {
                        if (arrowKey === "right")
                            arrowKey = "left";
                        else if (arrowKey === "left")
                            arrowKey = "right";
                    }


                    if (arrowKey === "right" && !me.minimized) {
                        if (event.altKey && (activeItem.level != 0 && activeItem.hasItems || me.mode != "horizontal")) {
                            me._openItem(me, activeItem);
                        }
                        else {
                            var itemToFocus = me._nextVisibleItem(activeItem, 0);
                            var subItem = me._nextVisibleItem(activeItem);
                            var siblings = getSiblings(subItem);

                            if (!itemToFocus) {
                                itemToFocus = subItem;
                            }

                            if (itemToFocus && ((itemToFocus.parentId === activeItem.parentId && itemToFocus.level == 0 && me.mode == "horizontal") || (subItem.id == siblings[0].id && subItem.level != 0))) {
                                if (subItem.id == siblings[0].id && ((activeItem.level != 0) || (activeItem.level == 0 && me.mode != "horizontal"))) {
                                    itemToFocus = subItem;
                                }

                                $(itemToFocus.element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                                $(activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                                me.activeItem = itemToFocus;
                            }
                        }

                        event.preventDefault();
                        event.stopPropagation();
                    }

                    if (arrowKey === "left" && !me.minimized) {
                        if (event.altKey && ((activeItem.level != 0 && me.mode !== "horizontal") || (activeItem.level > 1 && me.mode === "horizontal") || (activeItem.level == 1 && activeItem.hasItems && me.mode === "horizontal"))) {
                            if (activeItem.hasItems) {
                                me._closeItem(me, activeItem);
                            }
                            else {
                                if (activeItem.parentItem) {
                                    me._closeItem(me, activeItem.parentItem);
                                    $(activeItem.parentItem.element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                                    $(activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                                    me.activeItem = activeItem.parentItem;
                                }
                            }
                        }
                        else {
                            var itemToFocus = me._prevVisibleItem(activeItem, 0);
                            var currentItemToFocus = activeItem.parentItem;

                            if (itemToFocus && (itemToFocus.parentId === activeItem.parentId && itemToFocus.level == 0 && me.mode == "horizontal")) {
                                $(itemToFocus.element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                                $(activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                                me.activeItem = itemToFocus;
                            }
                            else if (!(currentItemToFocus && currentItemToFocus.level == 0 && me.mode == "horizontal") && currentItemToFocus && currentItemToFocus.level == activeItem.level - 1) {
                                $(currentItemToFocus.element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                                $(activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                                me.activeItem = currentItemToFocus;
                            }

                        }
                        event.preventDefault();
                        event.stopPropagation();
                    }

                    if (arrowKey === "down") {
                        if (event.altKey) {
                            if (activeItem.level == 0 && activeItem.hasItems) {
                                me._openItem(me, activeItem);
                            }
                            if (me.minimized) {
                                if (me.minimizedHidden) {
                                    me.minimizedItem.trigger('click');
                                }
                            }
                        }
                        else {
                            var itemToFocus = me._nextVisibleItem(activeItem, activeItem.level);
                            var siblings = getSiblings(itemToFocus);
                            if (me.minimized && itemToFocus) {
                                $(itemToFocus.element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                                $(activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                                me.activeItem = itemToFocus;
                            }
                            else {
                                if (itemToFocus && (itemToFocus.parentId === activeItem.parentId || (itemToFocus.id == siblings[0].id && me.mode == "horizontal"))) {
                                    if (!(itemToFocus.level == 0 && me.mode == "horizontal")) {
                                        $(itemToFocus.element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                                        $(activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                                        me.activeItem = itemToFocus;
                                    }
                                }
                                if (me.mode === "horizontal" && activeItem.level === 0 && activeItem.isOpen && activeItem.hasItems) {
                                    var itemToFocus = me._nextVisibleItem(activeItem);
                                    $(itemToFocus.element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                                    $(activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                                    me.activeItem = itemToFocus;
                                }
                            }
                        }

                        event.preventDefault();
                        event.stopPropagation();
                    }
                    else if (arrowKey === "up") {
                        if (event.altKey) {
                            if (activeItem.parentItem && activeItem.parentItem.level == 0) {
                                me._closeItem(me, activeItem.parentItem);
                                $(activeItem.parentItem.element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                                $(activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                                me.activeItem = activeItem.parentItem;
                            }
                            else if (activeItem.parentItem === null && activeItem.level === 0 && me.mode === "horizontal") {
                                me._closeItem(me, activeItem);
                            }
                            if (me.minimized) {
                                if (!me.minimizedHidden) {
                                    me.minimizedItem.trigger('click');
                                }
                            }
                        }
                        else {
                            var itemToFocus = me._prevVisibleItem(activeItem, activeItem.level);
                            var siblings = getSiblings(activeItem);

                            if (me.minimized && itemToFocus) {
                                $(itemToFocus.element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                                $(activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                                me.activeItem = itemToFocus;
                            }
                            else {
                                if (itemToFocus && (itemToFocus.parentId === activeItem.parentId || (itemToFocus.id == activeItem.parentId && itemToFocus.level == 0 && me.mode == "horizontal"))) {
                                    if (!(itemToFocus.level == 0 && me.mode === "horizontal" && activeItem.level === 0)) {
                                        $(itemToFocus.element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                                        $(activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                                        me.activeItem = itemToFocus;
                                    }
                                }
                                else if (activeItem && activeItem.id == siblings[0].id && activeItem.parentItem && activeItem.parentItem.level === 0 && me.mode === "horizontal") {
                                    var itemToFocus = activeItem.parentItem;
                                    $(itemToFocus.element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                                    $(activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                                    me.activeItem = itemToFocus;
                                }
                            }
                        }
                        event.preventDefault();
                        event.stopPropagation();
                    }

                    if (event.keyCode == 9) {
                        var itemToFocus = event.shiftKey ? me._prevVisibleItem(activeItem) : me._nextVisibleItem(activeItem);

                        if (itemToFocus) {
                            $(itemToFocus.element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                            $(activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                            me.activeItem = itemToFocus;
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        else if (me.lockFocus) {
                            var siblings = new Array();
                            var index = 0;
                            for (var i = 0; i < me.items.length; i++) {
                                if (me.items[i] == activeItem)
                                    continue;

                                if (me.items[i].parentId == activeItem.parentId) {
                                    siblings[index++] = me.items[i];
                                }
                            }

                            if (siblings.length > 0) {
                                if (event.shiftKey) {
                                    $(siblings[siblings.length - 1].element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                                    me.activeItem = siblings[siblings.length - 1];
                                }
                                else {
                                    $(siblings[0].element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                                    me.activeItem = siblings[0];
                                }
                                $(activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                            }
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        else if (activeItem) {
                            $(activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                            me.activeItem = null;
                        }
                    }
                }
                else {
                    return true;
                }
            }
            this.addHandler(this.host, 'keydown', function (event) {
                me.handleKeyDown(event);
            });

            if (me.enableRoundedCorners) {
                this.host.addClass(me.toThemeProperty('jqx-rc-all'));
            }

            $.each(this.items, function () {
                var item = this;
                var $menuElement = $(item.element);
                $menuElement.attr('role', 'menuitem');
                if (me.enableRoundedCorners) {
                    $menuElement.addClass(me.toThemeProperty('jqx-rc-all'));
                }

                me.removeHandler($menuElement, 'click');
                me.addHandler($menuElement, 'click', function (e) {
                    if (item.disabled)
                        return;

                    if (me.disabled)
                        return;

                    if (me.keyboardNavigation) {
                        if (me.activeItem) {
                            $(me.activeItem.element).removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                        }
                        me.activeItem = item;
                        $(item.element).addClass(me.toThemeProperty('jqx-fill-state-focus'));
                        if (me.minimized) {
                            e.stopPropagation();
                        }
                    }

                    me._raiseEvent('2', {type: "mouse", item: item.element, event: e });

                    if (!me.autoOpen) {
                        if (item.level > 0) {
                            if (me.autoCloseOnClick && !isTouchDevice && !me.clickToOpen) {
                                e.data = me;
                                me._closeAll(e);
                            }
                        }
                    }
                    else if (me.autoCloseOnClick && !isTouchDevice && !me.clickToOpen) {
                        if (item.closeOnClick) {
                            e.data = me;
                            me._closeAll(e);
                        }
                    }
                    if (isTouchDevice && me.autoCloseOnClick) {
                        e.data = me;
                        if (!item.hasItems) {
                            me._closeAll(e);
                        }
                    }

                    if (e.target.tagName != 'A' && e.target.tagName != 'a') {
                        var anchor = item.anchor != null ? $(item.anchor) : null;

                        if (anchor != null && anchor.length > 0) {
                            var href = anchor.attr('href');
                            var target = anchor.attr('target');
                            if (href != null) {
                                if (target != null) {
                                    window.open(href, target);
                                }
                                else {
                                    window.location = href;
                                }
                            }
                        }
                    }
                });

                me.removeHandler($menuElement, 'mouseenter');
                me.removeHandler($menuElement, 'mouseleave');

                if (!WP && me.mode != 'simple') {
                    me._renderHover($menuElement, item, isTouchDevice);
                }
                if (item.subMenuElement != null) {
                    var $submenu = $(item.subMenuElement);
                    if (me.mode == 'simple') {
                        $submenu.show();
                        return true;
                    }
                    $submenu.wrap('<div class="jqx-menu-popup ' + me.toThemeProperty('jqx-menu-popup') + '" style="border: none; background-color: transparent; z-index:' + zIndex + '; padding: 0px; margin: 0px; position: absolute; top: 0; left: 0; display: block; visibility: hidden;"><div style="background-color: transparent; border: none; position:absolute; overflow:hidden; left: 0; top: 0; right: 0; width: 100%; height: 100%;"></div></div>')
                    $submenu.css({ overflow: 'hidden', position: 'absolute', left: 0, display: 'inherit', top: -$submenu.outerHeight() })
                    $submenu.data('timer', {});
                    if (item.level > 0) {
                        $submenu.css('left', -$submenu.outerWidth());
                    }
                    else if (me.mode == 'horizontal') {
                        $submenu.css('left', 0);
                    }

                    zIndex++;
                    var $popupElement = $(item.subMenuElement).closest('div.jqx-menu-popup').css({ width: parseInt($(item.subMenuElement).outerWidth()) + parseInt(popupElementoffset[0]) + 'px', height: parseInt($(item.subMenuElement).outerHeight()) + parseInt(popupElementoffset[1]) + 'px' })
                    var $popupElementparent = $menuElement.closest('div.jqx-menu-popup')

                    if ($popupElementparent.length > 0) {
                        var oldsubleftmargin = $submenu.css('margin-left');
                        var oldsubrightmargin = $submenu.css('margin-right');
                        var oldsubleftpadding = $submenu.css('padding-left');
                        var oldsubrightpadding = $submenu.css('padding-right');

                        $popupElement.appendTo($popupElementparent)

                        $submenu.css('margin-left', oldsubleftmargin);
                        $submenu.css('margin-right', oldsubrightmargin);
                        $submenu.css('padding-left', oldsubleftpadding);
                        $submenu.css('padding-right', oldsubrightpadding);
                    }
                    else {
                        var oldsubleftmargin = $submenu.css('margin-left');
                        var oldsubrightmargin = $submenu.css('margin-right');
                        var oldsubleftpadding = $submenu.css('padding-left');
                        var oldsubrightpadding = $submenu.css('padding-right');

                        $popupElement.appendTo($(document.body));
                        $submenu.css('margin-left', oldsubleftmargin);
                        $submenu.css('margin-right', oldsubrightmargin);
                        $submenu.css('padding-left', oldsubleftpadding);
                        $submenu.css('padding-right', oldsubrightpadding);
                    }

                    if (!me.clickToOpen) {
                        if (isTouchDevice || WP) {
                            me.removeHandler($menuElement, $.jqx.mobile.getTouchEventName('touchstart'));
                            me.addHandler($menuElement, $.jqx.mobile.getTouchEventName('touchstart'), function (event) {
                                clearTimeout($submenu.data('timer').hide)
                                if ($submenu != null) {
                                    $submenu.stop();
                                }

                                if (item.level == 0 && !item.isOpen && me.mode != "popup") {
                                    event.data = me;
                                    me._closeAll(event);
                                }

                                if (!item.isOpen) {
                                    me._openItem(me, item);
                                }
                                else {
                                    me._closeItem(me, item, true);
                                }
                                return false;
                            });
                        }

                        if (!WP) {
                            me.addHandler($menuElement, 'mouseenter', function () {
                                if (me.autoOpen || (item.level > 0 && !me.autoOpen)) {
                                    clearTimeout($submenu.data('timer').hide)
                                }

                                if (item.parentId && item.parentId != 0) {
                                    if (me.menuElements[item.parentId]) {
                                        var openedStateOfParent = me.menuElements[item.parentId].isOpen;
                                        if (!openedStateOfParent) {
                                            return;
                                        }
                                    }
                                }

                                if (me.autoOpen || (item.level > 0 && !me.autoOpen)) {
                                    me._openItem(me, item);
                                }
                                return false;
                            });

                            me.addHandler($menuElement, 'mousedown', function () {
                                if (!me.autoOpen && item.level == 0) {
                                    clearTimeout($submenu.data('timer').hide)
                                    if ($submenu != null) {
                                        $submenu.stop();
                                    }

                                    if (!item.isOpen) {
                                        me._openItem(me, item);
                                    }
                                    else {
                                        me._closeItem(me, item, true);
                                    }
                                }
                            });

                            me.addHandler($menuElement, 'mouseleave', function (event) {
                                if (me.autoCloseOnMouseLeave) {
                                    clearTimeout($submenu.data('timer').hide)
                                    var $subMenu = $(item.subMenuElement);
                                    var position = { left: parseInt(event.pageX), top: parseInt(event.pageY) };
                                    var subMenuBounds = {
                                        left: parseInt($subMenu.coord().left), top: parseInt($subMenu.coord().top),
                                        width: parseInt($subMenu.outerWidth()), height: parseInt($subMenu.outerHeight())
                                    };

                                    var closeItem = true;
                                    if (subMenuBounds.left - 5 <= position.left && position.left <= subMenuBounds.left + subMenuBounds.width + 5) {
                                        if (subMenuBounds.top <= position.top && position.top <= subMenuBounds.top + subMenuBounds.height) {
                                            closeItem = false;
                                        }
                                    }

                                    if (closeItem) {
                                        me._closeItem(me, item, true);
                                    }
                                }
                            });

                            me.removeHandler($popupElement, 'mouseenter');
                            me.addHandler($popupElement, 'mouseenter', function () {
                                clearTimeout($submenu.data('timer').hide)
                            });

                            me.removeHandler($popupElement, 'mouseleave');
                            me.addHandler($popupElement, 'mouseleave', function (e) {
                                if (me.autoCloseOnMouseLeave) {
                                    clearTimeout($submenu.data('timer').hide)
                                    clearTimeout($submenu.data('timer').show);
                                    if ($submenu != null) {
                                        $submenu.stop();
                                    }
                                    me._closeItem(me, item, true);
                                }
                            });
                        }
                    }
                    else {
                        me.removeHandler($menuElement, 'mousedown');
                        me.addHandler($menuElement, 'mousedown', function (event) {

                            clearTimeout($submenu.data('timer').hide)
                            if ($submenu != null) {
                                $submenu.stop();
                            }

                            if (item.level == 0 && !item.isOpen) {
                                event.data = me;
                                me._closeAll(event);
                            }

                            if (!item.isOpen) {
                                me._openItem(me, item);
                            }
                            else {
                                me._closeItem(me, item, true);
                            }
                        });
                    }
                }
            });

            if (this.mode == "simple") {
                this._renderSimpleMode()
            }

            this._autoSizeHorizontalMenuItems();
            this._raiseEvent('3', this);
        },

        _renderSimpleMode: function () {
            this.host.show();
        },

        createID: function () {
            var id = Math.random() + '';
            id = id.replace('.', '');
            id = '99' + id;
            id = id / 1;
            while (this.items[id]) {
                id = Math.random() + '';
                id = id.replace('.', '');
                id = id / 1;
            }
            return 'menuItem' + id;
        },

        _createMenu: function (uiObject, refresh) {
            if (uiObject == null)
                return;

            if (refresh == undefined) {
                refresh = true;
            }
            if (refresh == null) {
                refresh = true;
            }

            var self = this;
            var liTags = $(uiObject).find('li');
            var k = 0;
            this.itemMapping = new Array();

            for (var index = 0; index < liTags.length; index++) {
                var listItem = liTags[index];
                var $listItem = $(listItem);

                if (listItem.className.indexOf('jqx-menu') == -1 && this.autoGenerate == false)
                    continue;

                var id = listItem.id;
                if (!id) {
                    id = this.createID();
                }

                if (refresh) {
                    listItem.id = id;
                    this.items[k] = new $.jqx._jqxMenu.jqxMenuItem();
                    this.menuElements[id] = this.items[k];
                }

                k += 1;
                var parentId = 0;
                var me = this;
                var children = $listItem.children();
                children.each(function () {
                    if (!refresh) {
                        this.className = "";

                        if (me.autoGenerate) {
                            $(me.items[k - 1].subMenuElement)[0].className = "";
                            if (!me.minimized) {
                                $(me.items[k - 1].subMenuElement).addClass(me.toThemeProperty('jqx-widget-content'));
                            }
                            $(me.items[k - 1].subMenuElement).addClass(me.toThemeProperty('jqx-menu-dropdown'));
                            $(me.items[k - 1].subMenuElement).addClass(me.toThemeProperty('jqx-popup'));
                        }
                    }

                    if (this.className.indexOf('jqx-menu-dropdown') != -1) {
                        if (refresh) {
                            me.items[k - 1].subMenuElement = this;
                        }
                        return false;
                    }
                    else if (me.autoGenerate && (this.tagName == 'ul' || this.tagName == 'UL')) {
                        if (refresh) {
                            me.items[k - 1].subMenuElement = this;
                        }
                        this.className = "";
                        if (!me.minimized) {
                            $(this).addClass(me.toThemeProperty('jqx-widget-content'));
                        }
                        $(this).addClass(me.toThemeProperty('jqx-menu-dropdown'));
                        $(this).addClass(me.toThemeProperty('jqx-popup'));
                        $(this).attr('role', 'menu');
                        if (me.rtl) {
                            $(this).addClass(me.toThemeProperty('jqx-rc-l'));
                        }
                        else {
                            $(this).addClass(me.toThemeProperty('jqx-rc-r'));
                        }
                        $(this).addClass(me.toThemeProperty('jqx-rc-b'));

                        return false;
                    }
                });

                var parents = $listItem.parents();
                parents.each(function () {
                    if (this.className.indexOf('jqx-menu-item') != -1) {
                        parentId = this.id;
                        return false;
                    }
                    else if (me.autoGenerate && (this.tagName == 'li' || this.tagName == 'LI')) {
                        parentId = this.id;
                        return false;
                    }

                });

                var separator = false;
                var type = listItem.getAttribute('type');
                var ignoretheme = listItem.getAttribute('ignoretheme') || listItem.getAttribute('data-ignoretheme');

                if (ignoretheme) {
                    if (ignoretheme == 'true' || ignoretheme == true) {
                        ignoretheme = true;
                    }
                }
                else ignoretheme = false;

                if (!type) {
                    type = listItem.type;
                }
                else {
                    if (type == 'separator') {
                        var separator = true;
                    }
                }

                if (!separator) {
                    if (parentId) {
                        type = 'sub';
                    }
                    else type = 'top';
                }

                var menuItem = this.items[k - 1];
                if (refresh) {
                    menuItem.id = id;
                    menuItem.parentId = parentId;
                    menuItem.type = type;
                    menuItem.separator = separator;
                    menuItem.element = liTags[index];
                    var anchor = $listItem.children('a');
                    menuItem.disabled = listItem.getAttribute('item-disabled') == "true" ? true : false;

                    menuItem.level = $listItem.parents('li').length;
                    menuItem.anchor = anchor.length > 0 ? anchor : null;
                    if (menuItem.anchor) {
                        $(menuItem.anchor).attr('tabindex', -1);
                    }
                }
                menuItem.ignoretheme = ignoretheme;

                var parentItem = this.menuElements[parentId];
                if (parentItem != null) {
                    if (parentItem.ignoretheme) {
                        menuItem.ignoretheme = parentItem.ignoretheme;
                        ignoretheme = parentItem.ignoretheme;
                    }
                    menuItem.parentItem = parentItem;
                    menuItem.parentElement = parentItem.element;
                }

                if (this.autoGenerate) {
                    if (type == 'separator') {
                        $listItem.removeClass();
                        $listItem.addClass(this.toThemeProperty('jqx-menu-item-separator'));
                        $listItem.attr('role', 'separator');
                    }
                    else {
                        if (!ignoretheme)
                        {
                            if ($listItem[0].className.indexOf("jqx-grid-menu-item-touch") >= 0)
                            {
                                $listItem[0].className = this.toThemeProperty('jqx-grid-menu-item-touch');
                            }
                            else
                            {
                                $listItem[0].className = "";
                            }

                            if (this.rtl)
                            {
                                $listItem.addClass(this.toThemeProperty('jqx-rtl'));
                            }
                            if (menuItem.level > 0 && !me.minimized) {
                                $listItem.addClass(this.toThemeProperty('jqx-item'));
                                $listItem.addClass(this.toThemeProperty('jqx-menu-item'));
                            }
                            else {
                                $listItem.addClass(this.toThemeProperty('jqx-item'));
                                $listItem.addClass(this.toThemeProperty('jqx-menu-item-top'));
                            }
                        }
                    }
                }
                if (menuItem.disabled) {
                    $listItem.addClass(me.toThemeProperty('jqx-menu-item-disabled'));
                    $listItem.addClass(me.toThemeProperty('jqx-fill-state-disabled'));
                }

                this.itemMapping[index] = { element: liTags[index], item: menuItem };
                this.itemMapping["id" + liTags[index].id] = this.itemMapping[index];

                if (refresh && !ignoretheme) {
                    menuItem.hasItems = $listItem.find('li').length > 0;
                    if (menuItem.hasItems) {
                        if (menuItem.element) {
                            $.jqx.aria($(menuItem.element), "aria-haspopup", true);
                            if (!menuItem.subMenuElement.id) menuItem.subMenuElement.id = $.jqx.utilities.createId();
                            $.jqx.aria($(menuItem.element), "aria-owns", menuItem.subMenuElement.id);
                        }
                    }
                }
            }

            for (var i = 0; i < liTags.length; i++) {
                var listTag = liTags[i];
                if (this.itemMapping["id" + listTag.id]) {
                    var menuItem = this.itemMapping["id" + listTag.id].item;
                    if (!menuItem)
                        continue;

                    menuItem.prevItem = null;
                    menuItem.nextItem = null;
                    if (i > 0) {
                        if (this.itemMapping["id" + liTags[i - 1].id]) {
                            menuItem.prevItem = this.itemMapping["id" + liTags[i - 1].id].item;
                        }
                    }

                    if (i < liTags.length - 1) {
                        if (this.itemMapping["id" + liTags[i + 1].id]) {
                            menuItem.nextItem = this.itemMapping["id" + liTags[i + 1].id].item;
                        }
                    }
                }
            }
        },

        destroy: function () {
            var me = this;
            $.jqx.utilities.resize(me.host, null, true);
            var wrapper = me.host.closest('div.jqx-menu-wrapper');
            me.removeHandler(wrapper, 'keydown');
            wrapper.remove();
            me.removeHandler($("#menuWrapper" + me.element.id), 'keydown');
            $("#menuWrapper" + me.element.id).remove();
            me.removeHandler(me.host, 'keydown');
            me.removeHandler(me.host, 'focus');
            me.removeHandler(me.host, 'blur');
            me.removeHandler($(document), 'mousedown.menu' + me.element.id, me._closeAfterClick);
            me.removeHandler($(document), 'mouseup.menu' + me.element.id, me._closeAfterClick);
            me.removeHandler($(document), 'contextmenu.' + me.element.id);
            me.removeHandler(me.host, 'contextmenu.' + me.element.id);

            $.data(document.body, 'jqxMenuOldHost' + me.element.id, null);
            if (me.isTouchDevice()) {
                me.removeHandler($(document), $.jqx.mobile.getTouchEventName('touchstart') + '.menu' + me.element.id, me._closeAfterClick, this);
            }

            if ($(window).off) {
                $(window).off('resize.menu' + me.element.id);
            }
            $.each(me.items, function () {
                var item = this;
                var $menuElement = $(item.element);
                me.removeHandler($menuElement, 'click');
                me.removeHandler($menuElement, 'selectstart');
                me.removeHandler($menuElement, 'mouseenter');
                me.removeHandler($menuElement, 'mouseleave');
                me.removeHandler($menuElement, 'mousedown');
                me.removeHandler($menuElement, 'mouseleave');
                var $submenu = $(item.subMenuElement);
                var $popupElement = $submenu.closest('div.jqx-menu-popup');
                $popupElement.remove();
                delete this.subMenuElement;
                delete this.element;
            });
            $.data(document.body, 'menuel', null);
            delete me.menuElements;
            me.items = new Array();
            delete me.items;
            var vars = $.data(me.element, "jqxMenu");
            if (vars) {
                delete vars.instance;
            }

            me.host.removeClass();
            me.host.remove();
            delete me.host;
            delete me.element;
        },

        _raiseEvent: function (id, arg) {
            if (arg == undefined)
                arg = { owner: null };

            var evt = this.events[id];
            args = arg;
            args.owner = this;

            var event = new $.Event(evt);
            if (id == '2') {
                args = arg.item;
                args.owner = this;
                args.clickType = arg.type;
                $.extend(event, arg.event);
                event.type = 'itemclick';
            }

            event.owner = this;
            event.args = args;
            var result = this.host.trigger(event);
            return result;
        },

        propertiesChangedHandler: function (object, key, value)
        {
            if (value.width && value.height && Object.keys(value).length == 2)
            {
                object._setSize();
                if (object.mode === "popup")
                {
                    var $popupElementparent = this.host.closest('div.jqx-menu-wrapper');
                    $popupElementparent[key](value);
                    var id = this.host[0].id;
                    $("#" + id)[key](value);
                }
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this.isInitialized == undefined || this.isInitialized == false)
                return;

            if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length == 2)
            {
                return;
            }

            if (key == "disabled") {
                if (object.disabled) {
                    object.host.addClass(object.toThemeProperty('jqx-fill-state-disabled'));
                    object.host.addClass(object.toThemeProperty('jqx-menu-disabled'));
                }
                else {
                    object.host.removeClass(object.toThemeProperty('jqx-fill-state-disabled'));
                    object.host.removeClass(object.toThemeProperty('jqx-menu-disabled'));
                }
            }

            if (value == oldvalue)
                return;

            if (key == 'touchMode') {
                this._isTouchDevice = null;
                object._render(value, oldvalue);
            }

            if (key === "width" || key === "height") {
                object._setSize();
                if (object.mode === "popup") {
                    var $popupElementparent = this.host.closest('div.jqx-menu-wrapper');
                    $popupElementparent[key](value);
                    var id = this.host[0].id;
                    $("#" + id)[key](value);
                }
                return;
            }
            if (key == 'source') {
                if (object.source != null) {
                    var html = object.loadItems(object.source);
                    object.element.innerHTML = html;
                    var innerElement = object.host.find('ul:first');
                    if (innerElement.length > 0) {
                        object.refresh();
                        object._createMenu(innerElement[0]);
                        object._render();
                    }
                }
            }

            if (key == 'autoCloseOnClick') {
                if (value == false) {
                    object.removeHandler($(document), 'mousedown.menu' + this.element.id, object._closeAll);
                }
                else {
                    object.addHandler($(document), 'mousedown.menu' + this.element.id, object, object._closeAll);
                }
            }
            else if (key == 'mode' || key == 'width' || key == 'height' || key == 'showTopLevelArrows') {
                object.refresh();

                if (key == 'mode') {
                    object._render(value, oldvalue);
                }
                else object._applyOrientation();
            }
            else if (key == 'theme') {
                $.jqx.utilities.setTheme(oldvalue, value, object.host);
            }
        }
    });
})(jqxBaseFramework);

(function ($) {
    $.jqx._jqxMenu.jqxMenuItem = function (id, parentId, type) {
        var menuItem =
        {
            // gets the id.
            id: id,
            // gets the parent id.
            parentId: parentId,
            // gets the parent item instance.
            parentItem: null,
            // gets the anchor element.
            anchor: null,
            // gets the type
            type: type,
            // gets whether the item is disabled.
            disabled: false,
            // gets the item's level.
            level: 0,
            // gets a value whether the item is opened.
            isOpen: false,
            // has sub elements.
            hasItems: false,
            // li element
            element: null,
            subMenuElement: null,
            // arrow element.
            arrow: null,
            // left, right, center
            openHorizontalDirection: 'right',
            // up, down, center
            openVerticalDirection: 'down',
            closeOnClick: true
        }
        return menuItem;
    }; // 
})(jqxBaseFramework);

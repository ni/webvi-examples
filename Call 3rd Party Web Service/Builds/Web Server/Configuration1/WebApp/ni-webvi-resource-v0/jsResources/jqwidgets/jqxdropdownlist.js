/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {

    $.jqx.jqxWidget("jqxDropDownList", "", {});

    $.extend($.jqx._jqxDropDownList.prototype, {
        defineInstance: function () {
            var settings = {
                // enables/disables the dropdownlist.
                disabled:false,
                // gets or sets the listbox width.
                width:null,
                // gets or sets the listbox height.
                height:null,
                // Represents the collection of list items.
                items:new Array(),
                // Gets or sets the selected index.
                selectedIndex:-1,
                // data source.
                source:null,
                // gets or sets the scrollbars size.
                scrollBarSize:15,
                // gets or sets the scrollbars size.
                arrowSize:19,
                // enables/disables the hover state.
                enableHover:true,
                // enables/disables the selection.
                enableSelection: true,
                autoItemsHeight: false,
                // gets the visible items. // this property is internal for the dropdownlist.
                visualItems:new Array(),
                // gets the groups. // this property is internal for the dropdownlist.
                groups:new Array(),
                // gets or sets whether the items width should be equal to the dropdownlist's width.
                equalItemsWidth:true,
                // gets or sets the height of the ListBox Items. When the itemHeight == - 1, each item's height is equal to its desired height.
                itemHeight:-1,
                // represents the dropdownlist's events.
                visibleItems:new Array(),
                // emptry group's text.
                emptyGroupText:'Group',
                checkboxes:false,
                // Type: Number
                // Default: 100
                // Showing Popup Animation's delay.
                openDelay:250,
                // Type: Number
                // Default: 200
                // Hiding Popup Animation's delay.
                closeDelay: 300,
                dropDownContainer: "default",
                // default, none
                // Type: String.
                // enables or disables the animation.
                animationType:'default',
                autoOpen:false,
                // Type: String
                // Default: auto ( the drop down takes the dropdownlist's width.)
                // Sets the popup's width.
                dropDownWidth:'auto',
                // Type: String
                // Default: 200px ( the height is 200px )
                // Sets the popup's height.
                dropDownHeight:'200px',
                // Type: Boolean
                // Default: false
                // Sets the popup's height to be equal to the items summary height,            
                autoDropDownHeight:false,
                keyboardSelection: true,
                // Type: Boolean
                // Default: false
                // Enables or disables the browser detection.
                enableBrowserBoundsDetection:false,
                dropDownHorizontalAlignment:'left',
                dropDownVerticalAlignment: 'bottom',
                displayMember: "",
                valueMember:"",
                groupMember: "",
                searchMember: "",
                searchMode: 'startswithignorecase',
                incrementalSearch:true,
                incrementalSearchDelay:700,
                renderer:null,
                placeHolder:"Please Choose:",
                promptText:"Please Choose:",
                emptyString:"",
                rtl:false,
                selectionRenderer:null,
                listBox:null,
                popupZIndex:9999999999999,
                renderMode:"default",
                touchMode:"auto",
                _checkForHiddenParent:true,
                autoBind:true,
                ready: null,
                focusable: true,
                filterable: false,
                filterHeight: 27,
                filterPlaceHolder: "Looking for",
                filterDelay: 100,
                // "primary", "inverse", "danger", "info", "success", "warning", "link"
                template: "default",
                aria:
                {
                    "aria-disabled": { name: "disabled", type: "boolean" }
                },
                events:
                [
                // occurs when the dropdownlist is opened.
                  'open',
                // occurs when the dropdownlist is closed.
                  'close',
                // occurs when an item is selected.
                  'select',
                // occurs when an item is unselected.
                  'unselect',
                // occurs when the selection is changed.
                  'change',
                // triggered when the user checks or unchecks an item. 
                  'checkChange',
                // triggered when the binding operation is completed.
                  'bindingComplete',
                  // triggered when a new item is added.
                    'itemAdd',
                   // triggered when a new item is removed.
                   'itemRemove',
                   // triggered when a new item is updated.
                   'itemUpdate'
                ]
            }
            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function (args) {
            this.render();
        },

        render: function () {
            var self = this;
            if (!self.width) self.width = 200;
            if (!self.height) self.height = 25;

            var nodeName = self.element.nodeName.toLowerCase();
            if (nodeName == "select" || nodeName == "ul" || nodeName == "ol") {
                self.field = self.element;
                if (self.field.className) {
                    self._className = self.field.className;
                }

                var properties = {
                    'title': self.field.title
                };

                if (self.field.id.length) {
                    properties.id = self.field.id.replace(/[^\w]/g, '_') + "_jqxDropDownList";
                }
                else {
                    properties.id = $.jqx.utilities.createId() + "_jqxDropDownList";
                }

                var wrapper = $("<div></div>", properties);
                if (!self.width) {
                    self.width = $(self.field).width();
                }
                if (!self.height) {
                    self.height = $(self.field).outerHeight();
                }
                wrapper[0].style.cssText = self.field.style.cssText;
                $(self.field).hide().after(wrapper);
                var data = self.host.data();
                self.host = wrapper;
                self.host.data(data);
                self.element = wrapper[0];
                self.element.id = self.field.id;
                self.field.id = properties.id;
                if (self._className) {
                    self.host.addClass(self._className);
                    $(self.field).removeClass(self._className);
                }

                if (self.field.tabIndex) {
                    var tabIndex = self.field.tabIndex;
                    self.field.tabIndex = -1;
                    self.element.tabIndex = tabIndex;
                }
                var result = $.jqx.parseSourceTag(self.field);
                self.source = result.items;
                if (self.selectedIndex == -1)
                    self.selectedIndex = result.index;
            }
            self.element.innerHTML = "";
            self.isanimating = false;
            self.id = self.element.id || $.jqx.utilities.createId();
            self.host.attr('role', 'combobox');
            $.jqx.aria(self, "aria-autocomplete", "both");
            $.jqx.aria(self, "aria-readonly", false);

            var comboStructure = "<div style='background-color: transparent; -webkit-appearance: none; outline: none; width:100%; height: 100%; padding: 0px; margin: 0px; border: 0px; position: relative;'>" +
                "<div id='dropdownlistWrapper' style='overflow: hidden; outline: none; background-color: transparent; border: none; float: left; width:100%; height: 100%; position: relative;'>" +
                "<div id='dropdownlistContent' unselectable='on' style='outline: none; background-color: transparent; border: none; float: left; position: relative;'></div>" +
                "<div id='dropdownlistArrow' unselectable='on' style='background-color: transparent; border: none; float: right; position: relative;'><div unselectable='on'></div></div>" +
                "</div>" +
                "</div>";

            if ($.jqx._jqxListBox == null || $.jqx._jqxListBox == undefined) {
                throw new Error("jqxDropDownList: Missing reference to jqxlistbox.js.");
            }

            if (self.host.attr('tabindex')) {
            }
            else {
                self.host.attr('tabindex', 0);
            }

            var me = self;

            self.touch = $.jqx.mobile.isTouchDevice();
            self.comboStructure = comboStructure;
            self.element.innerHTML = comboStructure;

            self.dropdownlistWrapper = $(self.element.firstChild.firstChild);
            self.dropdownlistArrow = $(self.dropdownlistWrapper[0].firstChild.nextSibling);
            self.arrow = $(self.dropdownlistArrow[0].firstChild);
            self.dropdownlistContent = $(self.dropdownlistWrapper[0].firstChild);
            self.dropdownlistContent.addClass(self.toThemeProperty('jqx-dropdownlist-content jqx-disableselect'));
            if (self.rtl) {
                self.dropdownlistContent.addClass(self.toThemeProperty('jqx-rtl jqx-dropdownlist-content-rtl'));
            }
            self.addHandler(self.dropdownlistWrapper, 'selectstart', function () { return false; });
            self.dropdownlistWrapper[0].id = "dropdownlistWrapper" + self.element.id;
            self.dropdownlistArrow[0].id = "dropdownlistArrow" + self.element.id;
            self.dropdownlistContent[0].id = "dropdownlistContent" + self.element.id;
            self._addInput();

            if (self.promptText != "Please Choose:") self.placeHolder = self.promptText;
            var hostClassName = self.toThemeProperty('jqx-widget') + " " + self.toThemeProperty('jqx-dropdownlist-state-normal') + " " + self.toThemeProperty('jqx-rc-all') + " " + self.toThemeProperty('jqx-fill-state-normal');
            self.element.className += " " + hostClassName;
            self._firstDiv = $(self.element.firstChild);

            try {
                var listBoxID = 'listBox' + self.id;
                var oldContainer = $($.find('#' + listBoxID));
                if (oldContainer.length > 0) {
                    oldContainer.remove();
                }
                $.jqx.aria(self, "aria-owns", listBoxID);
                $.jqx.aria(self, "aria-haspopup", true);

                var container = $("<div style='overflow: hidden; background-color: transparent; border: none; position: absolute;' id='listBox" + self.id + "'><div id='innerListBox" + self.id + "'></div></div>");
                container.hide();

                if (self.dropDownContainer == "element") {
                    container.appendTo(self.host);
                }
                else {
                    container.appendTo(document.body);
                }
                self.container = container;
                self.listBoxContainer = $($.find('#innerListBox' + self.id));

                var width = self.width;
                if (self.dropDownWidth != 'auto') {
                    width = self.dropDownWidth;
                }
                if (width == null) {
                    width = self.host.width();
                    if (width == 0) width = self.dropDownWidth;
                }

                if (self.dropDownHeight == null) {
                    self.dropDownHeight = 200;
                }
                var me = self;
                self.container.width(parseInt(width) + 25);
                self.container.height(parseInt(self.dropDownHeight) + 25);
                self._ready = false;
                self.addHandler(self.listBoxContainer, 'bindingComplete', function (event) {
                    if (!self.listBox) {
                        self.listBox = $.data(self.listBoxContainer[0], "jqxListBox").instance;
                    }
                    if (self.selectedIndex != self.listBoxContainer.jqxListBox('selectedIndex')) {
                        self.listBox = $.data(self.listBoxContainer[0], "jqxListBox").instance;
                        self.listBoxContainer.jqxListBox({ selectedIndex: self.selectedIndex });
                        self.renderSelection('mouse');
                    } else {
                        self.renderSelection('mouse');
                    }
                    if (!self._ready)
                    {
                        if (self.ready)
                        {
                            self.ready();
                        }
                        self._ready = true;
                    }
                    self._raiseEvent('6');
                });
                self.addHandler(self.listBoxContainer, 'itemAdd', function (event) {
                    self._raiseEvent('7', event.args);
                });
                self.addHandler(self.listBoxContainer, 'itemRemove', function (event) {
                    self._raiseEvent('8', event.args);
                });
                self.addHandler(self.listBoxContainer, 'itemUpdate', function (event) {
                    self._raiseEvent('9', event.args);
                });

                self.listBoxContainer.jqxListBox({
                    filterHeight: self.filterHeight,
                    filterPlaceHolder: self.filterPlaceHolder,
                    filterDelay: self.filterDelay,
                    autoItemsHeight: self.autoItemsHeight,
                    filterable: self.filterable, allowDrop: false, allowDrag: false,
                    autoBind: self.autoBind, _checkForHiddenParent: false, focusable: self.focusable,
                    touchMode: self.touchMode, checkboxes: self.checkboxes, rtl: self.rtl, _renderOnDemand: true, emptyString: self.emptyString, itemHeight: self.itemHeight, width: width, searchMode: self.searchMode, incrementalSearch: self.incrementalSearch, incrementalSearchDelay: self.incrementalSearchDelay, groupMember: self.groupMember, searchMember: self.searchMember, displayMember: self.displayMember, valueMember: self.valueMember, height: self.dropDownHeight, autoHeight: self.autoDropDownHeight, scrollBarSize: self.scrollBarSize, selectedIndex: self.selectedIndex, source: self.source, theme: self.theme,
                    rendered: function () {
                        if (self.selectedIndex != self.listBoxContainer.jqxListBox('selectedIndex')) {
                            self.listBox = $.data(self.listBoxContainer[0], "jqxListBox").instance;
                            self.listBoxContainer.jqxListBox({ selectedIndex: self.selectedIndex });
                            self.renderSelection('mouse');
                        } else {
                            self.renderSelection('mouse');
                        }
                    }, renderer: self.renderer,
                    filterChange: function (value)
                    {
                        if (self.autoDropDownHeight)
                        {
                            self.container.height(self.listBoxContainer.height() + 25);
                        }
                    }
                });
                if (self.dropDownContainer === "element") {
                    self.listBoxContainer.css({ position: 'absolute', top: 0, left: 0 });
                }
                else {
                    self.listBoxContainer.css({ position: 'absolute', zIndex: self.popupZIndex, top: 0, left: 0 });
                }
                if (self.template)
                {
                    self.listBoxContainer.addClass(self.toThemeProperty("jqx-" + self.template + "-item"));
                }

                self.listBox = $.data(self.listBoxContainer[0], "jqxListBox").instance;
                self.listBox.enableSelection = self.enableSelection;
                self.listBox.enableHover = self.enableHover;
                self.listBox.equalItemsWidth = self.equalItemsWidth;
                self.listBox.selectIndex(self.selectedIndex);
                self.listBox._arrange();
                self.listBoxContainer.addClass(self.toThemeProperty('jqx-popup'));
                if ($.jqx.browser.msie) {
                    self.listBoxContainer.addClass(self.toThemeProperty('jqx-noshadow'));
                }

                self.addHandler(self.listBoxContainer, 'unselect', function (event) {
                    self._raiseEvent('3', { index: event.args.index, type: event.args.type, item: event.args.item });
                });

                self.addHandler(self.listBoxContainer, 'change', function (event) {
                    if (event.args) {
                        if (event.args.type != "keyboard") {
                            self._raiseEvent('4', { index: event.args.index, type: event.args.type, item: event.args.item });
                        }
                        else if (event.args.type == "keyboard") {
                            if (!self.isOpened()) {
                                self._raiseEvent('4', { index: self.selectedIndex, type: 'keyboard', item: self.getItem(self.selectedIndex) });
                            }
                        }
                    }
                });

                if (self.animationType == 'none') {
                    self.container.css('display', 'none');
                }
                else {
                    self.container.hide();
                }
            }
            catch (e) {
                if (console)
                    console.log(e);
            }

            var self = self;
            self.propertyChangeMap['disabled'] = function (instance, key, oldVal, value) {
                if (value) {
                    instance.host.addClass(self.toThemeProperty('jqx-dropdownlist-state-disabled'));
                    instance.host.addClass(self.toThemeProperty('jqx-fill-state-disabled'));
                    instance.dropdownlistContent.addClass(self.toThemeProperty('jqx-dropdownlist-content-disabled'));
                }
                else {
                    instance.host.removeClass(self.toThemeProperty('jqx-dropdownlist-state-disabled'));
                    instance.host.removeClass(self.toThemeProperty('jqx-fill-state-disabled'));
                    instance.dropdownlistContent.removeClass(self.toThemeProperty('jqx-dropdownlist-content-disabled'));
                }
                $.jqx.aria(instance, "aria-disabled", instance.disabled);
            }

            if (self.disabled) {
                self.host.addClass(self.toThemeProperty('jqx-dropdownlist-state-disabled'));
                self.host.addClass(self.toThemeProperty('jqx-fill-state-disabled'));
                self.dropdownlistContent.addClass(self.toThemeProperty('jqx-dropdownlist-content-disabled'));
            }

            if (self.dropDownVerticalAlignment == "top")
            {
                self.arrow.addClass(self.toThemeProperty('jqx-icon-arrow-up'));
            }
            else
            {
                self.arrow.addClass(self.toThemeProperty('jqx-icon-arrow-down'));
            }
            self.arrow.addClass(self.toThemeProperty('jqx-icon'));

            if (self.renderMode === "simple") {
                self.arrow.remove();
                self.host.removeClass(self.toThemeProperty('jqx-fill-state-normal'));
                self.host.removeClass(self.toThemeProperty('jqx-rc-all'));
            }
            if (self.template)
            {
                self.host.addClass(self.toThemeProperty("jqx-" + self.template))
            }

            self._updateHandlers();
            self._setSize();
            self._arrange();
            if (self.listBox) {
                self.renderSelection();
            }

            // fix for IE7
            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                if (self.host.parents('.jqx-window').length > 0) {
                    var zIndex = self.host.parents('.jqx-window').css('z-index');
                    container.css('z-index', zIndex + 10);
                    self.listBoxContainer.css('z-index', zIndex + 10);
                }
            }
        },

        resize: function(width, height)
        {
            this.width = width;
            this.height = height;
            this._setSize();
            this._arrange();
        },

        val: function (value) {
            if (!this.dropdownlistContent) return "";

            var isEmpty = function (obj) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key))
                        return false;
                }

                if (typeof value == "number")
                    return false;
                if (typeof value == "date")
                    return false;
                if (typeof value == "boolean")
                    return false;
                if (typeof value == "string")
                    return false;

                return true;
            }

            if (this.input && (isEmpty(value) || arguments.length == 0)) {
                return this.input.val();
            }

            var item = this.getItemByValue(value);
            if (item != null) {
                this.selectItem(item);
            }

            if (this.input) {
                return this.input.val();
            }
        },

        focus: function () {
            try
            {
                var me = this;
                var doFocus = function () {
                    me.host.focus();
                    if (me._firstDiv) {
                        me._firstDiv.focus();
                    }
                }
                doFocus();
                setTimeout(function () {
                    doFocus();
                }, 10);
            }
            catch (error) {
            }
        },

        _addInput: function () {
            var name = this.host.attr('name');
            this.input = $("<input type='hidden'/>");
            this.host.append(this.input);
            if (name) {
                this.input.attr('name', name);
            }
        },

        getItems: function () {
            if (!this.listBox) {
                return new Array();
            }

            return this.listBox.items;
        },

        getVisibleItems: function () {
            return this.listBox.getVisibleItems();
        },

        _setSize: function () {
            if (this.width != null && this.width.toString().indexOf("px") != -1) {
                this.host.width(this.width);
            }
            else
                if (this.width != undefined && !isNaN(this.width)) {
                    this.host.width(this.width);
                };

            if (this.height != null && this.height.toString().indexOf("px") != -1) {
                this.host.height(this.height);
            }
            else if (this.height != undefined && !isNaN(this.height)) {
                this.host.height(this.height);
            };

            var isPercentage = false;
            if (this.width != null && this.width.toString().indexOf("%") != -1) {
                isPercentage = true;
                this.element.style.width = this.width;
            }

            if (this.height != null && this.height.toString().indexOf("%") != -1) {
                isPercentage = true;
                this.element.style.height = this.height;
            }

            var me = this;
            var resizeFunc = function () {
                me._arrange();
                if (me.dropDownWidth == 'auto') {
                    var width = me.host.width();
                    me.listBoxContainer.jqxListBox({ width: width });
                    me.container.width(parseInt(width) + 25);
                }
            }

            if (isPercentage) {
                var width = this.host.width();
                if (this.dropDownWidth != 'auto') {
                    width = this.dropDownWidth;
                }
                this.listBoxContainer.jqxListBox({ width: width });
                this.container.width(parseInt(width) + 25);
            }
            $.jqx.utilities.resize(this.host, function () {
                resizeFunc();
            }, false, this._checkForHiddenParent);
        },

        // returns true when the listbox is opened, otherwise returns false.
        isOpened: function () {
            var me = this;
            var openedListBox = $.data(document.body, "openedJQXListBox" + this.id);
            if (openedListBox != null && openedListBox == me.listBoxContainer) {
                return true;
            }

            return false;
        },

        _updateHandlers: function () {
            var self = this;
            var hovered = false;
            this.removeHandlers();
            if (!this.touch) {
                this.addHandler(this.host, 'mouseenter', function () {
                    if (!self.disabled && self.enableHover && self.renderMode !== 'simple') {
                        hovered = true;
                        self.host.addClass(self.toThemeProperty('jqx-dropdownlist-state-hover'));
                        if (self.dropDownVerticalAlignment == "top")
                        {
                            self.arrow.addClass(self.toThemeProperty('jqx-icon-arrow-up-hover'));
                        }
                        else
                        {
                            self.arrow.addClass(self.toThemeProperty('jqx-icon-arrow-down-hover'));
                        }
                        self.host.addClass(self.toThemeProperty('jqx-fill-state-hover'));
                    }
                });

                this.addHandler(this.host, 'mouseleave', function () {
                    if (!self.disabled && self.enableHover && self.renderMode !== 'simple') {
                        self.host.removeClass(self.toThemeProperty('jqx-dropdownlist-state-hover'));
                        self.host.removeClass(self.toThemeProperty('jqx-fill-state-hover'));
                        self.arrow.removeClass(self.toThemeProperty('jqx-icon-arrow-down-hover'));
                        self.arrow.removeClass(self.toThemeProperty('jqx-icon-arrow-up-hover'));
                        hovered = false;
                    }
                });
            }

            if (this.host.parents()) {
                this.addHandler(this.host.parents(), 'scroll.dropdownlist' + this.element.id, function (event) {
                    var opened = self.isOpened();
                    if (opened) {
                        self.close();
                    }
                });
            }

            var eventName = 'mousedown';
            if (this.touch) eventName = $.jqx.mobile.getTouchEventName('touchstart');
            this.addHandler(this.dropdownlistWrapper, eventName,
            function (event) {
                if (!self.disabled) {
                    var isOpen = self.container.css('display') == 'block';
                    if (!self.isanimating) {
                        if (isOpen) {
                            self.hideListBox();
                            return false;
                        }
                        else {
                            self.showListBox();
                            if (!self.focusable) {
                                if (event.preventDefault) {
                                    event.preventDefault();
                                }
                            }
                            else self.focus();
                        }
                    }
                }
            });

            if (self.autoOpen) {
                this.addHandler(this.host, 'mouseenter', function () {
                    var isOpened = self.isOpened();
                    if (!isOpened && self.autoOpen) {
                        self.open();
                        self.host.focus();
                    }
                });

                $(document).on('mousemove.' + self.id, function (event) {
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

            if (this.touch) {
                this.addHandler($(document), $.jqx.mobile.getTouchEventName('touchstart') + '.' + this.id, self.closeOpenedListBox, { me: this, listbox: this.listBox, id: this.id });
            }
            else this.addHandler($(document), 'mousedown.' + this.id, self.closeOpenedListBox, { me: this, listbox: this.listBox, id: this.id });

            this.addHandler(this.host, 'keydown', function (event) {
                var isOpen = self.container.css('display') == 'block';

                if (self.host.css('display') == 'none') {
                    return true;
                }

                if (event.keyCode == '13' || event.keyCode == '9') {
                    if (!self.isanimating) {
                        if (isOpen) {
                            self.renderSelection();
                            if (event.keyCode == '13' && self.focusable) {
                                self._firstDiv.focus();
                            }
                            self.hideListBox();
                            if (!self.keyboardSelection) {
                                self._raiseEvent('2', { index: self.selectedIndex, type: 'keyboard', item: self.getItem(self.selectedIndex) });
                            }
                            if (event.keyCode == "13") {
                                self._raiseEvent('4', { index: self.selectedIndex, type: 'keyboard', item: self.getItem(self.selectedIndex) });
                            }
                        }
                        if (isOpen && event.keyCode != '9') {
                            return false;
                        }
                        return true;
                    }
                }

                if (event.keyCode == 115) {
                    if (!self.isanimating) {
                        if (!self.isOpened()) {
                            self.showListBox();
                        }
                        else if (self.isOpened()) {
                            self.hideListBox();
                        }
                    }
                    return false;
                }

                if (event.altKey) {
                    if (self.host.css('display') == 'block') {
                        if (event.keyCode == 38) {
                            if (self.isOpened()) {
                                self.hideListBox();
                                return true;
                            }
                        }
                        else if (event.keyCode == 40) {
                            if (!self.isOpened()) {
                                self.showListBox();
                                return true;
                            }
                        }
                    }
                }

                if (event.keyCode == '27') {
                    if (!self.ishiding) {
                        if (self.isOpened()) {
                            self.hideListBox();
                            if (self.tempSelectedIndex != undefined) {
                                self.selectIndex(self.tempSelectedIndex);
                            }
                        }

                        return true;
                    }
                }

                if (!self.disabled) {
                    self._kbnavigated = self.listBox._handleKeyDown(event);
                    return self._kbnavigated;
                }
            });
            this.addHandler(this.listBoxContainer, 'checkChange', function (event) {
                self.renderSelection();
                self._updateInputSelection();
                self._raiseEvent(5, { label: event.args.label, value: event.args.value, checked: event.args.checked, item: event.args.item });
            });

            this.addHandler(this.listBoxContainer, 'select', function (event) {
                if (!self.disabled) {
                    if (!event.args)
                        return;

                    if (event.args.type == 'keyboard' && !self.isOpened()) {
                        self.renderSelection();
                    }

                    if (event.args.type != 'keyboard' || self.keyboardSelection) {
                        self.renderSelection();
                        self._raiseEvent('2', { index: event.args.index, type: event.args.type, item: event.args.item, originalEvent: event.args.originalEvent });
                        if (event.args.type == 'mouse') {
                            if (!self.checkboxes) {
                                self.hideListBox();
                                if (self._firstDiv && self.focusable) {
                                    self._firstDiv.focus();
                                }
                            }
                        }
                    }
                }
            });
            if (this.listBox) {
                if (this.listBox.content) {
                    this.addHandler(this.listBox.content, 'click', function (event) {
                        if (!self.disabled) {
                            if (self.listBox.itemswrapper && event.target === self.listBox.itemswrapper[0])
                                return true;

                            self.renderSelection('mouse');
                            if (!self.touch) {
                                if (!self.ishiding) {
                                    if (!self.checkboxes) {
                                        self.hideListBox();
                                        if (self._firstDiv && self.focusable) {
                                            self._firstDiv.focus();
                                        }
                                    }
                                }
                            }

                            if (!self.keyboardSelection) {
                                if (self._kbnavigated === false) {
                                    if (self.tempSelectedIndex != self.selectedIndex) {
                                        self._raiseEvent('4', { index: self.selectedIndex, type: "mouse", item: self.getItem(self.selectedIndex) });
                                    }
                                    self._kbnavigated = true;
                                }

                                if (self._oldSelectedInd == undefined) self._oldSelectedIndx = self.selectedIndex;

                                if (self.selectedIndex != self._oldSelectedIndx) {
                                    self._raiseEvent('2', { index: self.selectedIndex, type: 'keyboard', item: self.getItem(self.selectedIndex) });
                                    self._oldSelectedIndx = self.selectedIndex;
                                }
                            }
                        }
                    });
                }
            }

            this.addHandler(this.host, 'focus', function (event) {
                if (self.renderMode !== 'simple') {
                    self.host.addClass(self.toThemeProperty('jqx-dropdownlist-state-focus'));
                    self.host.addClass(self.toThemeProperty('jqx-fill-state-focus'));
                }
            });
            this.addHandler(this.host, 'blur', function () {
                if (self.renderMode !== 'simple') {
                    self.host.removeClass(self.toThemeProperty('jqx-dropdownlist-state-focus'));
                    self.host.removeClass(self.toThemeProperty('jqx-fill-state-focus'));
                }
            });
            this.addHandler(this._firstDiv, 'focus', function (event) {
                if (self.renderMode !== 'simple') {
                    self.host.addClass(self.toThemeProperty('jqx-dropdownlist-state-focus'));
                    self.host.addClass(self.toThemeProperty('jqx-fill-state-focus'));
                }
            });
            this.addHandler(this._firstDiv, 'blur', function () {
                if (self.renderMode !== 'simple') {
                    self.host.removeClass(self.toThemeProperty('jqx-dropdownlist-state-focus'));
                    self.host.removeClass(self.toThemeProperty('jqx-fill-state-focus'));
                }
            });
        },

        removeHandlers: function () {
            var self = this;
            var eventName = 'mousedown';
            if (this.touch) eventName = $.jqx.mobile.getTouchEventName('touchstart');
            this.removeHandler(this.dropdownlistWrapper, eventName);
            if (this.listBox) {
                if (this.listBox.content) {
                    this.removeHandler(this.listBox.content, 'click');
                }
            }

            this.removeHandler(this.host, 'loadContent');
            this.removeHandler(this.listBoxContainer, 'checkChange');
            this.removeHandler(this.host, 'keydown');
            this.removeHandler(this.host, 'focus');
            this.removeHandler(this.host, 'blur');
            this.removeHandler(this._firstDiv, 'focus');
            this.removeHandler(this._firstDiv, 'blur');
            this.removeHandler(this.host, 'mouseenter');
            this.removeHandler(this.host, 'mouseleave');
            this.removeHandler($(document), 'mousemove.' + self.id);
        },

        // gets an item by index.
        getItem: function (index) {
            var item = this.listBox.getItem(index);
            return item;
        },

        getItemByValue: function (value) {
            var item = this.listBox.getItemByValue(value);
            return item;
        },

        selectItem: function (item) {
            if (this.listBox != undefined) {
                this.listBox.selectItem(item);
                this.selectedIndex = this.listBox.selectedIndex;
                this.renderSelection('mouse');
            }
        },

        unselectItem: function (item) {
            if (this.listBox != undefined) {
                this.listBox.unselectItem(item);
                this.renderSelection('mouse');
            }
        },

        checkItem: function (item) {
            if (this.listBox != undefined) {
                this.listBox.checkItem(item);
            }
        },

        uncheckItem: function (item) {
            if (this.listBox != undefined) {
                this.listBox.uncheckItem(item);
            }
        },

        indeterminateItem: function (item) {
            if (this.listBox != undefined) {
                this.listBox.indeterminateItem(item);
            }
        },


        // renders the selection.
        renderSelection: function () {
            if (this.listBox == null)
                return;

            if (this.height && this.height.toString().indexOf('%') != -1) {
                this._arrange();
            }

            var item = this.listBox.visibleItems[this.listBox.selectedIndex];
            if (this.filterable) {
                if (this.listBox.selectedIndex == -1) {
                    for (var selectedValue in this.listBox.selectedValues) {
                        var value = this.listBox.selectedValues[selectedValue];
                        var selectedItem = this.listBox.getItemByValue(value);
                        if (selectedItem) {
                            item = selectedItem;
                        }
                    }
                }
            }

            var me = this;
            if (this.checkboxes) {
                var checkedItems = this.getCheckedItems();
                if (checkedItems != null && checkedItems.length > 0) {
                    item = checkedItems[0];
                }
                else item = null;
            }

            if (item == null) {
                var spanElement = $('<span unselectable="on" style="color: inherit; border: none; background-color: transparent;"></span>');
                spanElement.appendTo($(document.body));
                spanElement.addClass(this.toThemeProperty('jqx-widget'));
                spanElement.addClass(this.toThemeProperty('jqx-listitem-state-normal'));
                spanElement.addClass(this.toThemeProperty('jqx-item'));

                $.jqx.utilities.html(spanElement, this.placeHolder);
                var topPadding = this.dropdownlistContent.css('padding-top');
                var bottomPadding = this.dropdownlistContent.css('padding-bottom');
                spanElement.css('padding-top', topPadding);
                spanElement.css('padding-bottom', bottomPadding);
                var spanHeight = spanElement.outerHeight();
                spanElement.remove();
                spanElement.removeClass();
                $.jqx.utilities.html(this.dropdownlistContent, spanElement);
                var height = this.host.height();
                if (this.height != null && this.height != undefined) {
                    if (this.height.toString().indexOf('%') === -1) {
                        height = parseInt(this.height);
                    }
                }

                var top = parseInt((parseInt(height) - parseInt(spanHeight)) / 2);

                if (top > 0) {
                    this.dropdownlistContent.css('margin-top', top + 'px');
                    this.dropdownlistContent.css('margin-bottom', top + 'px');
                }
                if (this.selectionRenderer) {
                    $.jqx.utilities.html(this.dropdownlistContent, this.selectionRenderer(spanElement, -1, "", ""));
                    this.dropdownlistContent.css('margin-top', '0px');
                    this.dropdownlistContent.css('margin-bottom', '0px');
                    this._updateInputSelection();
                }
                else this._updateInputSelection();
                this.selectedIndex = this.listBox.selectedIndex;
                if (this.width === "auto") {
                    this._arrange();
                }
                if (this.focusable && this.isOpened()) {
                    this.focus();
                }
                return;
            }

            this.selectedIndex = this.listBox.selectedIndex;
            var spanElement = $(document.createElement('span'));
            spanElement[0].setAttribute('unselectable', 'on');
            try
            {
                spanElement[0].style.color = "inherit";
            }
            catch (er) {
            }

            spanElement[0].style.borderWidth = '0px';
            spanElement[0].style.backgroundColor = "transparent";
            spanElement.appendTo($(document.body));
            spanElement.addClass(this.toThemeProperty('jqx-widget jqx-listitem-state-normal jqx-item'));
           
            var emptyItem = false;
            try {
                if (item.html != undefined && item.html != null && item.html.toString().length > 0) {
                    $.jqx.utilities.html(spanElement, item.html);
                }
                else if (item.label != undefined && item.label != null && item.label.toString().length > 0) {
                    $.jqx.utilities.html(spanElement, item.label);
                }
                else if (item.label === null || item.label === "") {
                    emptyItem = true;
                    $.jqx.utilities.html(spanElement, "");
                }
                else if (item.value != undefined && item.value != null && item.value.toString().length > 0) {
                    $.jqx.utilities.html(spanElement, item.value);

                }
                else if (item.title != undefined && item.title != null && item.title.toString().length > 0) {
                    $.jqx.utilities.html(spanElement, item.title);
                }
                else if (item.label == "" || item.label == null) {
                    emptyItem = true;
                    $.jqx.utilities.html(spanElement, "");
                }
            }
            catch (error) {
                var errorMessage = error;
            }

            var topPadding = this.dropdownlistContent[0].style.paddingTop;
            var bottomPadding = this.dropdownlistContent[0].style.paddingBottom;
            if (topPadding === "") topPadding = "0px";
            if (bottomPadding === "") bottomPadding = "0px";

            spanElement[0].style.paddingTop = topPadding;
            spanElement[0].style.paddingBottom = bottomPadding;

            var spanHeight = spanElement.outerHeight();
            if (spanHeight === 0) {
                spanHeight = 16;
            }

            if ((item.label == "" || item.label == null) && emptyItem) {
                $.jqx.utilities.html(spanElement, "");
            }
            var notPercentageWidth = this.width && this.width.toString().indexOf('%') <= 0;
              
            spanElement.remove();
            spanElement.removeClass();
            if (this.selectionRenderer) {
                $.jqx.utilities.html(this.dropdownlistContent, this.selectionRenderer(spanElement, item.index, item.label, item.value));
                if (this.focusable && this.isOpened()) {
                    this.focus();
                }
            }
            else {
                if (this.checkboxes) {
                    var items = this.getCheckedItems();
                    var str = "";
                    for (var i = 0; i < items.length; i++) {
                        if (i == items.length - 1) {
                            str += items[i].label;
                        }
                        else {
                            str += items[i].label + ",";
                        }
                    }
                    spanElement.text(str);
                    if (notPercentageWidth) {
                        spanElement.css('max-width', this.host.width() - 30);
                    }
                    spanElement.css('overflow', 'hidden');
                    spanElement.css('display', 'block');
                    if (!this.rtl) {
                        if (notPercentageWidth) {
                            spanElement.css('width', this.host.width() - 30);
                        }
                    }
                    spanElement.css('text-overflow', 'ellipsis');
                    spanElement.css('padding-bottom', 1+parseInt(bottomPadding));

                    this.dropdownlistContent.html(spanElement);
                    if (this.focusable && this.isOpened()) {
                        this.focus();
                    }
                }
                else {
                    var w = this.host.width() - this.arrowSize - 3;
                    if (this.width && this.width !== 'auto') {
                        if (notPercentageWidth) {
                            if (!this.rtl) {
                                spanElement.css('max-width', w + "px");
                            }
                        }

                        spanElement[0].style.overflow = "hidden";
                        spanElement[0].style.display = "block";
                        spanElement[0].style.paddingTop = (1 + parseInt(bottomPadding)) + "px";
                        if (!this.rtl) {
                            if (notPercentageWidth) {
                                if (w < 0) w = 0;
                                spanElement[0].style.width = w + "px";
                            }
                        }
                        spanElement[0].style.textOverflow = 'ellipsis';
                    }

                    this.dropdownlistContent[0].innerHTML = spanElement[0].innerHTML;
                    if (this.focusable && this.isOpened()) {
                        this.focus();
                    }
                }
            }

            var height = this.host.height();
            if (this.height != null && this.height != undefined) {
                if (this.height.toString().indexOf('%') === -1) {
                    height = parseInt(this.height);
                }
            }

            var top = parseInt((parseInt(height) - parseInt(spanHeight)) / 2);

            if (top >= 0) {
                this.dropdownlistContent[0].style.marginTop = top + 'px';
                this.dropdownlistContent[0].style.marginBottom = top + 'px';
            }
            if (this.selectionRenderer) {
                this.dropdownlistContent[0].style.marginTop = '0px';
                this.dropdownlistContent[0].style.marginBottom = '0px';
            }
            if (this.dropdownlistContent && this.input) {
                this._updateInputSelection();
            }
            if (this.listBox && this.listBox._activeElement) {
                $.jqx.aria(this, "aria-activedescendant", this.listBox._activeElement.id);
            }
            if (this.width === "auto") {
                this._arrange();
            }
        },

        _updateInputSelection: function () {
            if (this.input) {
                var selectedValues = new Array();
                if (this.selectedIndex == -1) {
                    this.input.val("");
                }
                else {
                    var selectedItem = this.getSelectedItem();
                    if (selectedItem != null) {
                        this.input.val(selectedItem.value);
                        selectedValues.push(selectedItem.value);
                    }
                    else {
                        this.input.val(this.dropdownlistContent.text());
                    }
                }
                if (this.checkboxes) {
                    var items = this.getCheckedItems();
                    var str = "";
                    if (items != null) {
                        for (var i = 0; i < items.length; i++) {
                            var value = items[i].value;
                            if (value == undefined) continue;
                            if (i == items.length - 1) {
                                str += value;
                            }
                            else {
                                str += value + ",";
                            }
                            selectedValues.push(value);
                        }
                    }
                    this.input.val(str);
                }
            }
            if (this.field && this.input) {
                if (this.field.nodeName.toLowerCase() == "select") {
                    $.each(this.field, function (index, value) {
                        $(this).removeAttr('selected');
                        this.selected = selectedValues.indexOf(this.value) >= 0;
                        if (this.selected) {
                            $(this).attr('selected', true);
                        }
                    });
                }
                else {
                    $.each(this.items, function (index, value) {
                        $(this.originalItem.originalItem).removeAttr('data-selected');
                        this.selected = selectedValues.indexOf(this.value) >= 0;
                        if (this.selected) {
                            $(this.originalItem.originalItem).attr('data-selected', true);
                        }
                    });
                }
            }
        },

        setContent: function (content) {
            $.jqx.utilities.html(this.dropdownlistContent, content);
            this._updateInputSelection();
        },

        dataBind: function () {
            this.listBoxContainer.jqxListBox({ source: this.source });
            this.renderSelection('mouse');
            if (this.source == null) {
                this.clearSelection();
            }
        },

        clear: function () {
            this.listBoxContainer.jqxListBox({ source: null });
            this.clearSelection();
        },

        // clears the selection.
        clearSelection: function (render) {
            this.selectedIndex = -1;
            this._updateInputSelection();
            this.listBox.clearSelection();
            this.renderSelection();
            if (!this.selectionRenderer) {
                $.jqx.utilities.html(this.dropdownlistContent, this.placeHolder);
            }
        },

        // unselects an item at specific index.
        // @param Number
        unselectIndex: function (index, render) {
            if (isNaN(index))
                return;

            this.listBox.unselectIndex(index, render);
            this.renderSelection();
        },

        // selects an item at specific index.
        // @param Number
        selectIndex: function (index, ensureVisible, render, forceSelect) {
            this.listBox.selectIndex(index, ensureVisible, render, forceSelect, 'api');
        },

        // gets the selected index.
        getSelectedIndex: function () {
            return this.selectedIndex;
        },

        // gets the selected item.
        getSelectedItem: function () {
            return this.listBox.getVisibleItem(this.selectedIndex);
        },

        getCheckedItems: function () {
            return this.listBox.getCheckedItems();
        },

        checkIndex: function (index) {
            this.listBox.checkIndex(index);
        },

        uncheckIndex: function (index) {
            this.listBox.uncheckIndex(index);
        },

        indeterminateIndex: function (index) {
            this.listBox.indeterminateIndex(index);
        },
        checkAll: function () {
            this.listBox.checkAll();
            this.renderSelection('mouse');
        },

        uncheckAll: function () {
            this.listBox.uncheckAll();
            this.renderSelection('mouse');
        },

        addItem: function (item) {
            return this.listBox.addItem(item);
        },
        
        insertAt: function (item, index) {
            if (item == null)
                return false;

            return this.listBox.insertAt(item, index);
        },

        removeAt: function (index) {
            var result = this.listBox.removeAt(index);
            this.renderSelection('mouse');
            return result;
        },

        removeItem: function (item) {
            var result = this.listBox.removeItem(item);
            this.renderSelection('mouse');
            return result;
        },

        updateItem: function (item, oldItem) {
            var result = this.listBox.updateItem(item, oldItem);
            this.renderSelection('mouse');
            return result;
        },

        updateAt: function (item, index) {
            var result = this.listBox.updateAt(item, index);
            this.renderSelection('mouse');
            return result;
        },

        ensureVisible: function (index) {
            return this.listBox.ensureVisible(index);
        },

        disableAt: function (index) {
            return this.listBox.disableAt(index);
        },

        enableAt: function (index) {
            return this.listBox.enableAt(index);
        },

        disableItem: function (item) {
            return this.listBox.disableItem(item);
        },

        enableItem: function (item) {
            return this.listBox.enableItem(item);
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

            if (offset.left + dpWidth > viewWidth) {
                if (dpWidth > this.host.width()) {
                    var hostLeft = this.host.coord().left;
                    var hOffset = dpWidth - this.host.width();
                    offset.left = hostLeft - hOffset + 2;
                }
            }
            if (offset.left < 0) {
                offset.left = parseInt(this.host.coord().left) + 'px'
            }

            offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ?
                Math.abs(dpHeight + inputHeight + 22) : 0);

            return offset;
        },

        open: function () {
            this.showListBox();
        },

        close: function () {
            this.hideListBox();
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

        // shows the listbox.
        showListBox: function () {
            $.jqx.aria(this, "aria-expanded", true);
            if (this.listBox._renderOnDemand) {
                this.listBoxContainer.jqxListBox({ _renderOnDemand: false });
            }

            if (this.dropDownWidth == 'auto' && this.width != null && this.width.indexOf && (this.width.indexOf('%') != -1 || this.width.indexOf('auto') != -1)) {
                if (this.listBox.host.width() != this.host.width()) {
                    var width = this.host.width();
                    this.listBoxContainer.jqxListBox({ width: width });
                    this.container.width(parseInt(width) + 25);
                }
            }

            var self = this;
            var listBox = this.listBoxContainer;
            var listBoxInstance = this.listBox;
            var scrollPosition = $(window).scrollTop();
            var scrollLeftPosition = $(window).scrollLeft();
            var top = parseInt(this._findPos(this.host[0])[1]) + parseInt(this.host.outerHeight()) - 1 + 'px';
            //var left = parseInt(Math.round(this.host.coord(true).left)) + 'px';
            var left, leftPos = parseInt(Math.round(this.host.coord(true).left));
            left = leftPos + 'px';

            var isMobileBrowser = $.jqx.mobile.isSafariMobileBrowser() || $.jqx.mobile.isWindowsPhone();

            if (this.listBox == null)
                return;
         
            this.ishiding = false;
            if (!this.keyboardSelection) {
                this.listBox.selectIndex(this.selectedIndex);
                this.listBox.ensureVisible(this.selectedIndex);
            }

            this.tempSelectedIndex = this.selectedIndex;

            if (this.autoDropDownHeight) {
                this.container.height(this.listBoxContainer.height() + 25);
            }

            if ((isMobileBrowser != null && isMobileBrowser)) {
                left = $.jqx.mobile.getLeftPos(this.element);
                top = $.jqx.mobile.getTopPos(this.element) + parseInt(this.host.outerHeight());
                if ($('body').css('border-top-width') != '0px') {
                    top = parseInt(top) - this._getBodyOffset().top + 'px';
                }
                if ($('body').css('border-left-width') != '0px') {
                    left = parseInt(left) - this._getBodyOffset().left + 'px';
                }
            }

            listBox.stop();
            if (this.renderMode !== 'simple')
            {
                this.host.addClass(this.toThemeProperty('jqx-dropdownlist-state-selected'));
                this.host.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
                if (this.dropDownVerticalAlignment == "top")
                {
                    this.arrow.addClass(this.toThemeProperty('jqx-icon-arrow-up-selected'));
                }
                else
                {
                    this.arrow.addClass(this.toThemeProperty('jqx-icon-arrow-down-selected'));
                }
            }

            this.container.css('left', left);
            this.container.css('top', top);
            listBoxInstance._arrange();

            var closeAfterSelection = true;
            var positionChanged = false;

            if (this.dropDownHorizontalAlignment == 'right' || this.rtl) {
                var containerWidth = this.container.outerWidth();
                var containerLeftOffset = Math.abs(containerWidth - this.host.width());

                if (containerWidth > this.host.width()) {
                    this.container.css('left', 25 + parseInt(Math.round(leftPos)) - containerLeftOffset + "px");
                }
                else this.container.css('left', 25 + parseInt(Math.round(leftPos)) + containerLeftOffset + "px");
            }

            if (this.dropDownVerticalAlignment == "top")
            {
                var dpHeight = listBox.height();
                positionChanged = true;

                listBox.css('top', 23);
                listBox.addClass(this.toThemeProperty('jqx-popup-up'));
                var inputHeight = parseInt(this.host.outerHeight());
                var t = parseInt(top) - Math.abs(dpHeight + inputHeight + 23);

                this.container.css('top', t);
            }

            if (this.enableBrowserBoundsDetection) {
                var newOffset = this.testOffset(listBox, { left: parseInt(this.container.css('left')), top: parseInt(top) }, parseInt(this.host.outerHeight()));
                if (parseInt(this.container.css('top')) != newOffset.top) {
                    positionChanged = true;
                    listBox.css('top', 23);
                    listBox.addClass(this.toThemeProperty('jqx-popup-up'));
                }
                else listBox.css('top', 0);

                this.container.css('top', newOffset.top);
                if (parseInt(this.container.css('left')) != newOffset.left) {
                    this.container.css('left', newOffset.left);
                }
            }

            if (this.animationType == 'none') {
                this.container.css('display', 'block');
                $.data(document.body, "openedJQXListBoxParent", self);
                $.data(document.body, "openedJQXListBox" + this.id, listBox);
                listBox.css('margin-top', 0);
                listBox.css('opacity', 1);
                listBoxInstance._renderItems();
                self._raiseEvent('0', listBoxInstance);
            }
            else {
                this.container.css('display', 'block');
                self.isanimating = true;
                if (this.animationType == 'fade') {
                    listBox.css('margin-top', 0);
                    listBox.css('opacity', 0);
                    listBox.animate({ 'opacity': 1 }, this.openDelay, function () {
                        $.data(document.body, "openedJQXListBoxParent", self);
                        $.data(document.body, "openedJQXListBox" + self.id, listBox);
                        self.ishiding = false;
                        self.isanimating = false;
                        listBoxInstance._renderItems();
                        self._raiseEvent('0', listBoxInstance);
                    });
                }
                else {
                    listBox.css('opacity', 1);
                    var height = listBox.outerHeight();
                    if (positionChanged) {
                        listBox.css('margin-top', height);
                    }
                    else {
                        listBox.css('margin-top', -height);
                    }

                    listBox.animate({ 'margin-top': 0 }, this.openDelay, function () {
                        $.data(document.body, "openedJQXListBoxParent", self);
                        $.data(document.body, "openedJQXListBox" + self.id, listBox);
                        self.ishiding = false;
                        self.isanimating = false;
                        listBoxInstance._renderItems();
                        self._raiseEvent('0', listBoxInstance);
                    });
                }
            }
            if (!positionChanged) {
                this.host.addClass(this.toThemeProperty('jqx-rc-b-expanded'));
                listBox.addClass(this.toThemeProperty('jqx-rc-t-expanded'));
            }
            else {
                this.host.addClass(this.toThemeProperty('jqx-rc-t-expanded'));
                listBox.addClass(this.toThemeProperty('jqx-rc-b-expanded'));
            }
            if (this.renderMode !== 'simple') {
                listBox.addClass(this.toThemeProperty('jqx-fill-state-focus'));
                this.host.addClass(this.toThemeProperty('jqx-dropdownlist-state-focus'));
                this.host.addClass(this.toThemeProperty('jqx-fill-state-focus'));
            }
        },

        // hides the listbox.
        hideListBox: function () {
            $.jqx.aria(this, "aria-expanded", false);

            var listBox = this.listBoxContainer;
            var listBoxInstance = this.listBox;
            var container = this.container;
            var me = this;
            $.data(document.body, "openedJQXListBox" + this.id, null);
            if (this.animationType == 'none') {
                this.container.css('display', 'none');
            }
            else {
                if (!me.ishiding) {
                    listBox.stop();
                    var height = listBox.outerHeight();
                    listBox.css('margin-top', 0);
                    me.isanimating = true;

                    var animationValue = -height;
                    if (parseInt(this.container.coord().top) < parseInt(this.host.coord().top)) {
                        animationValue = height;
                    }

                    if (this.animationType == 'fade') {
                        listBox.css({ 'opacity': 1 });
                        listBox.animate({ 'opacity': 0 }, this.closeDelay, function () {
                            container.css('display', 'none');
                            me.isanimating = false;
                            me.ishiding = false;
                        });
                    }
                    else {
                        listBox.animate({ 'margin-top': animationValue }, this.closeDelay, function () {
                            container.css('display', 'none');
                            me.isanimating = false;
                            me.ishiding = false;
                        });
                    }
                }
            }

            this.ishiding = true;
            this.host.removeClass(this.toThemeProperty('jqx-dropdownlist-state-selected'));
            this.host.removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
            this.arrow.removeClass(this.toThemeProperty('jqx-icon-arrow-down-selected'));
            this.arrow.removeClass(this.toThemeProperty('jqx-icon-arrow-up-selected'));
            this.host.removeClass(this.toThemeProperty('jqx-rc-b-expanded'));
            listBox.removeClass(this.toThemeProperty('jqx-rc-t-expanded'));
            this.host.removeClass(this.toThemeProperty('jqx-rc-t-expanded'));
            listBox.removeClass(this.toThemeProperty('jqx-rc-b-expanded'));
            listBox.removeClass(this.toThemeProperty('jqx-fill-state-focus'));
            this.host.removeClass(this.toThemeProperty('jqx-dropdownlist-state-focus'));
            this.host.removeClass(this.toThemeProperty('jqx-fill-state-focus'));
          
            this._raiseEvent('1', listBoxInstance);
        },

        /* Close popup if clicked elsewhere. */
        closeOpenedListBox: function (event) {
            var self = event.data.me;
            var $target = $(event.target);
            var openedListBox = event.data.listbox;
            if (openedListBox == null)
                return true;

            if ($(event.target).ischildof(event.data.me.host)) {
                return true;
            }

            if (!self.isOpened()) {
                return true;
            }

            if ($(event.target).ischildof(self.listBoxContainer)) {
                return true;
            }

            var dropdownlistInstance = self;

            var isListBox = false;
            $.each($target.parents(), function () {
                if (this.className != 'undefined') {
                    if (this.className.indexOf) {
                        if (this.className.indexOf('jqx-listbox') != -1) {
                            isListBox = true;
                            return false;
                        }
                        if (this.className.indexOf('jqx-dropdownlist') != -1) {
                            if (self.element.id == this.id) {
                                isListBox = true;
                            }
                            return false;
                        }
                    }
                }
            });

            if (openedListBox != null && !isListBox && self.isOpened()) {
                self.hideListBox();
            }

            return true;
        },

        clearFilter: function()
        {
            this.listBox.clearFilter();
        },

        loadFromSelect: function (id) {
            this.listBox.loadFromSelect(id);
        },

        refresh: function (initialRefresh) {
            if (initialRefresh !== true) {
                this._setSize();
                this._arrange();
                if (this.listBox) {
                    this.renderSelection();
                }
            }
        },

        _arrange: function () {
            var that = this;
            var width = parseInt(that.host.width());
            var height = parseInt(that.host.height());
            var arrowHeight = that.arrowSize;
            var arrowWidth = that.arrowSize;
            var rightOffset = 3;
            var contentWidth = width - arrowWidth - 2 * rightOffset;
            if (contentWidth > 0 && that.width !== "auto") {
                that.dropdownlistContent[0].style.width = contentWidth + "px";
            }
            else if (contentWidth <= 0) {
                that.dropdownlistContent[0].style.width = "0px";
            }

            if (that.width === "auto") {
                that.dropdownlistContent.css('width', 'auto');
                width = that.dropdownlistContent.width() + arrowWidth + 2 * rightOffset;
                that.host.width(width);
            }
            that.dropdownlistContent[0].style.height = height + "px";
            that.dropdownlistContent[0].style.left = "0px";
            that.dropdownlistContent[0].style.top = "0px";

            that.dropdownlistArrow[0].style.width = arrowWidth + "px";
            if (that.width && that.width.toString().indexOf('%') >= 0) {
                var arrowPercentage = (arrowWidth * 100) / width;
                var contentPercentage = (contentWidth * 100) / width;
                that.dropdownlistArrow[0].style.width = arrowPercentage + '%';
                that.dropdownlistContent[0].style.width = contentPercentage + '%';
            }
            that.dropdownlistArrow[0].style.height = height + "px";
           
            if (that.rtl) {
                that.dropdownlistArrow.css('float', 'left');
                that.dropdownlistContent.css('float', 'right');
            }
        },

        destroy: function () {
            $.jqx.utilities.resize(this.host, null, true);
            this.removeHandler(this.listBoxContainer, 'select');
            this.removeHandler(this.listBoxContainer, 'unselect');
            this.removeHandler(this.listBoxContainer, 'change');
            this.removeHandler(this.dropdownlistWrapper, 'selectstart');
            this.removeHandler(this.dropdownlistWrapper, 'mousedown');
            this.removeHandler(this.host, 'keydown');
            this.removeHandler(this.listBoxContainer, 'select');
            this.removeHandler(this.listBox.content, 'click');
            this.removeHandler(this.listBoxContainer, 'bindingComplete');
      
            if (this.host.parents()) {
                this.removeHandler(this.host.parents(), 'scroll.dropdownlist' + this.element.id);
            }

            this.removeHandlers();

            this.listBoxContainer.jqxListBox('destroy');
            this.listBoxContainer.remove();
            this.host.removeClass();
            this.removeHandler($(document), 'mousedown.' + this.id, this.closeOpenedListBox);
            if (this.touch) {
                this.removeHandler($(document), $.jqx.mobile.getTouchEventName('touchstart') + '.' + this.id);
            }

            this.dropdownlistArrow.remove();
            delete this.dropdownlistArrow;
            delete this.dropdownlistWrapper;
            delete this.listBoxContainer;
            delete this.input;
            delete this.arrow;
            delete this.dropdownlistContent;
            delete this.listBox;
            delete this._firstDiv;
            this.container.remove();
            delete this.container;
            var vars = $.data(this.element, "jqxDropDownList");
            if (vars) {
                delete vars.instance;
            }
            this.host.removeData();
            this.host.remove();
            delete this.comboStructure;
            delete this.host;
            delete this.element;
        },

        _raiseEvent: function (id, arg) {
            if (arg == undefined)
                arg = { owner: null };

            var evt = this.events[id];
            args = arg;
            args.owner = this;

            var event = new $.Event(evt);
            event.owner = this;
            if (id == 2 || id == 3 || id == 4 || id == 5 || id == 6 || id == 7 || id == 8 || id == 9) {
                event.args = arg;
            }

            var result = this.host.trigger(event);
            return result;
        },


        propertiesChangedHandler: function (object, key, value)
        {
            if (value.width && value.height && Object.keys(value).length == 2)
            {
                object._setSize();
                if (key == 'width')
                {
                    if (object.dropDownWidth == 'auto')
                    {
                        var width = object.host.width();
                        object.listBoxContainer.jqxListBox({ width: width });
                        object.container.width(parseInt(width) + 25);
                    }
                }
                object._arrange();
                object.close();
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (object.isInitialized == undefined || object.isInitialized == false)
                return;

            if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length == 2)
            {
                return;
            }

            if (key == "template")
            {
                    object.listBoxContainer.removeClass(object.toThemeProperty("jqx-" + oldvalue + "-item"));
                    object.listBoxContainer.addClass(object.toThemeProperty("jqx-" + object.template + "-item"));
                    object.host.removeClass(object.toThemeProperty("jqx-" + oldvalue + ""));
                    object.host.addClass(object.toThemeProperty("jqx-" + object.template + ""));
            }

            if (key == "dropDownVerticalAlignment")
            {
                object.arrow.removeClass(object.toThemeProperty('jqx-icon-arrow-up'));
                object.arrow.removeClass(object.toThemeProperty('jqx-icon-arrow-down'));
                if (object.dropDownVerticalAlignment == "top")
                {
                    object.arrow.addClass(object.toThemeProperty('jqx-icon-arrow-up'));
                }
                else
                {
                    object.arrow.addClass(object.toThemeProperty('jqx-icon-arrow-down'));
                }
                object.listBoxContainer.css('top', 0);
                object.listBoxContainer.removeClass(this.toThemeProperty('jqx-popup-up'));
            }

            if (key == "autoItemsHeight")
            {
                object.listBoxContainer.jqxListBox({ autoItemsHeight: value });
            }

            if (key == "filterable") {
                object.listBoxContainer.jqxListBox({ filterable: value });
            }
            if (key == "filterHeight") {
                object.listBoxContainer.jqxListBox({ filterHeight: value });
            }
            if (key == "filterPlaceHolder") {
                object.listBoxContainer.jqxListBox({ filterPlaceHolder: value });
            }
            if (key == "filterDelay") {
                object.listBoxContainer.jqxListBox({ filterDelay: value });
            }
          
            if (key == "enableSelection") {
                object.listBoxContainer.jqxListBox({ enableSelection: value });
            }
            if (key == "enableHover") {
                object.listBoxContainer.jqxListBox({ enableHover: value });
            }

            if (key == 'autoOpen') {
                object._updateHandlers();
            }
            if (key == 'emptyString') {
                object.listBox.emptyString = object.emptyString;
            }
            if (key == "itemHeight") {
                object.listBoxContainer.jqxListBox({ itemHeight: value });
            }

            if (key == "renderer") {
                object.listBoxContainer.jqxListBox({ renderer: value });
            }

            if (key == "rtl") {
                if (value) {
                    object.dropdownlistArrow.css('float', 'left');
                    object.dropdownlistContent.css('float', 'right');
                }
                else {
                    object.dropdownlistArrow.css('float', 'right');
                    object.dropdownlistContent.css('float', 'left');
                }
                object.listBoxContainer.jqxListBox({ rtl: object.rtl });
            }
            if (key == 'source') {
                object.listBoxContainer.jqxListBox({ source: object.source });
                object.listBox.selectedIndex = -1;
                object.listBox.selectIndex(this.selectedIndex);
                object.renderSelection();
                if (value == null) {
                    object.clear();
                }
            }

            if (key == "displayMember" || key == "valueMember") {
                object.listBoxContainer.jqxListBox({ displayMember: object.displayMember, valueMember: object.valueMember });
                object.renderSelection();
            }
            if (key == "placeHolder") {
                object.renderSelection();
            }

            if (key == 'theme' && value != null) {
                object.listBoxContainer.jqxListBox({ theme: value });
                object.listBoxContainer.addClass(object.toThemeProperty('jqx-popup'));
                $.jqx.utilities.setTheme(oldvalue, value, object.host);
            }

            if (key == "autoDropDownHeight") {
                object.listBoxContainer.jqxListBox({ autoHeight: object.autoDropDownHeight });
                if (object.autoDropDownHeight) {
                    object.container.height(object.listBoxContainer.height() + 25);
                }
                else {
                    object.listBoxContainer.jqxListBox({ height: object.dropDownHeight });
                    object.container.height(parseInt(object.dropDownHeight) + 25);
                }

                object.listBox._arrange();
                object.listBox._updatescrollbars();
            }

            if (key == "searchMode") {
                object.listBoxContainer.jqxListBox({ searchMode: object.searchMode });
            }

            if (key == "incrementalSearch") {
                object.listBoxContainer.jqxListBox({ incrementalSearch: object.incrementalSearch });
            }

            if (key == "incrementalSearchDelay") {
                object.listBoxContainer.jqxListBox({ incrementalSearchDelay: object.incrementalSearchDelay });
            }

            if (key == "dropDownHeight") {
                if (!object.autoDropDownHeight) {
                    object.listBoxContainer.jqxListBox({ height: object.dropDownHeight });
                    object.container.height(parseInt(object.dropDownHeight) + 25);
                }
            }

            if (key == "dropDownWidth" || key == "scrollBarSize") {
                var width = object.width;
                if (object.dropDownWidth != 'auto') {
                    width = object.dropDownWidth;
                }

                object.listBoxContainer.jqxListBox({ width: width, scrollBarSize: object.scrollBarSize });
                object.container.width(parseInt(width) + 25);
            }

            if (key == 'width' || key == 'height') {
                if (value != oldvalue) {
                    this.refresh();
                    if (key == 'width') {
                        if (object.dropDownWidth == 'auto') {
                            var width = object.host.width();
                            object.listBoxContainer.jqxListBox({ width: width });
                            object.container.width(parseInt(width) + 25);
                        }
                    }
                    object.close();
                }
            }

            if (key == "checkboxes") {
                object.listBoxContainer.jqxListBox({ checkboxes: object.checkboxes });
            }

            if (key == 'selectedIndex') {
                if (object.listBox != null) {
                    object.listBox.selectIndex(parseInt(value));
                    object.renderSelection();
                }
            }
        }
    });
})(jqxBaseFramework);

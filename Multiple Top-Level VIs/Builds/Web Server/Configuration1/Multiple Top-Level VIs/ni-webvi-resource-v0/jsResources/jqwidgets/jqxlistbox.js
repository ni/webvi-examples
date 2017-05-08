/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($) {

    $.jqx.jqxWidget("jqxListBox", "", {});

    $.extend($.jqx._jqxListBox.prototype, {
        defineInstance: function () {
            var settings = {
                // Type: Boolean
                // Default: true    
                // enables/disables the listbox.
                disabled: false,
                // gets or sets the listbox width.
                width: null,
                // gets or sets the listbox height.
                height: null,
                // Represents the collection of list items.
                items: new Array(),
                // Type: Boolean
                // Default: false
                // enables/disables the multiple selection.
                multiple: false,
                // Gets or sets the selected index.
                selectedIndex: -1,
                // Gets the selected item indexes.
                selectedIndexes: new Array(),
                // Type: Object
                // Default: null
                // data source.
                source: null,
                // Type: Number
                // Default: 15
                // gets or sets the scrollbars size.
                scrollBarSize: $.jqx.utilities.scrollBarSize,
                // Type: Boolean
                // Default: true
                // enables/disables the hover state.
                enableHover: true,
                // Type: Boolean
                // Default: true
                // enables/disables the selection.
                enableSelection: true,
                // gets the visible items. // this property is internal for the listbox.
                visualItems: new Array(),
                // gets the groups. // this property is internal for the listbox.
                groups: new Array(),
                // Type: Boolean
                // Default: true
                // gets or sets whether the items width should be equal to the listbox's width.
                equalItemsWidth: true,
                // gets or sets the height of the ListBox Items. When the itemHeight == - 1, each item's height is equal to its desired height.
                itemHeight: -1,
                // this property is internal for the listbox.
                visibleItems: new Array(),
                // Type: String
                // Default: Group
                // represents the text of the empty group. This is displayed only when the items are not loaded from html select element.
                emptyGroupText: 'Group',
                // Type: Boolean
                // Default: false
                // Gets or sets whether the listbox should display a checkbox next to each item.
                checkboxes: false,
                // Type: Boolean
                // Default: false
                // Gets or sets whether the listbox checkboxes have three states - checked, unchecked and indeterminate.           
                hasThreeStates: false,
                // Type: Boolean
                // Default: false
                // Gets or sets whether the listbox's height is equal to the sum of its items height          
                autoHeight: false,
                autoItemsHeight: false,
                // represents the listbox's events.    
                // Type: Boolean
                // Default: true
                // Gets or sets whether the listbox items are with rounded corners.         
                roundedcorners: true,
                touchMode: 'auto',
                displayMember: "",
                groupMember: "",
                valueMember: "",
                searchMember: "",
                // Type: String
                // Default: startswithignorecase
                // Possible Values: 'none, 'contains', 'containsignorecase', 'equals', 'equalsignorecase', 'startswithignorecase', 'startswith', 'endswithignorecase', 'endswith'
                searchMode: 'startswithignorecase',
                incrementalSearch: true,
                incrementalSearchDelay: 1000,
                incrementalSearchKeyDownDelay: 300,
                allowDrag: false,
                allowDrop: true,
                // Possible values: 'none, 'default', 'copy'
                dropAction: 'default',
                touchModeStyle: 'auto',
                keyboardNavigation: true,
                enableMouseWheel: true,
                multipleextended: false,
                selectedValues: new Array(),
                emptyString: "",
                rtl: false,
                rendered: null,
                renderer: null,
                dragStart: null,
                dragEnd: null,
                focusable: true,
                ready: null,
                _checkForHiddenParent: true,
                autoBind: true,
                _renderOnDemand: false,
                filterable: false,
                filterHeight: 27,
                filterPlaceHolder: "Looking for",
                filterDelay: 100,
                filterChange: null,
                aria:
                {
                    "aria-disabled": { name: "disabled", type: "boolean" }
                },
                events:
                [
                // triggered when the user selects an item.
                    'select',
                // triggered when the user unselects an item.
                    'unselect',
                // triggered when the selection is changed.
                    'change',
                // triggered when the user checks or unchecks an item. 
                    'checkChange',
                // triggered when the user drags an item. 
                   'dragStart',
                // triggered when the user drops an item. 
                   'dragEnd',
                // triggered when the binding is completed.
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
            var self = this;
            if ($.jqx.utilities.scrollBarSize != 15) {
                self.scrollBarSize = $.jqx.utilities.scrollBarSize;
            }
            if (self.width == null) self.width = 200;
            if (self.height == null) self.height = 200;
            self.renderListBox();
            var that = self;
            $.jqx.utilities.resize(self.host, function () {
                that._updateSize();
            }, false, self._checkForHiddenParent);
        },

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            this._updateSize();
        },

        render: function()
        {
            this.renderListBox();
            this.refresh();
        },

        renderListBox: function () {
            var self = this;
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
                    properties.id = self.field.id.replace(/[^\w]/g, '_') + "_jqxListBox";
                }
                else {
                    properties.id = $.jqx.utilities.createId() + "_jqxListBox";
                }

                var wrapper = $("<div></div>", properties);
                if (!self.width) {
                    self.width = $(self.field).width();
                }
                if (!self.height) {
                    self.height = $(self.field).outerHeight();
                }
                self.element.style.cssText = self.field.style.cssText;
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
            }

            self.element.innerHTML = "";
            var self = self;

            var className = self.element.className;

            className += " " + self.toThemeProperty("jqx-listbox");
            className += " " + self.toThemeProperty("jqx-reset");
            className += " " + self.toThemeProperty("jqx-rc-all");
            className += " " + self.toThemeProperty("jqx-widget");
            className += " " + self.toThemeProperty("jqx-widget-content");

            self.element.className = className;

            var isPercentage = false;

            if (self.width != null && self.width.toString().indexOf("%") != -1) {
                self.host.width(self.width);
                isPercentage = true;
            }
            if (self.height != null && self.height.toString().indexOf("%") != -1) {
                self.host.height(self.height);
                if (self.host.height() == 0) {
                    self.host.height(200);
                }
                isPercentage = true;
            }
            if (self.width != null && self.width.toString().indexOf("px") != -1) {
                self.host.width(self.width);
            }
            else
                if (self.width != undefined && !isNaN(self.width)) {
                    self.element.style.width = parseInt(self.width) + 'px';
                };

            if (self.height != null && self.height.toString().indexOf("px") != -1) {
                self.host.height(self.height);
            }
            else if (self.height != undefined && !isNaN(self.height)) {
                self.element.style.height = parseInt(self.height) + 'px';
            };

            if (self.multiple || self.multipleextended || self.checkboxes) {
                $.jqx.aria(self, "aria-multiselectable", true);
            }
            else {
                $.jqx.aria(self, "aria-multiselectable", false);
            }

            var listBoxStructure = "<div style='-webkit-appearance: none; background: transparent; outline: none; width:100%; height: 100%; align:left; border: 0px; padding: 0px; margin: 0px; left: 0px; top: 0px; valign:top; position: relative;'>" +
                "<div style='-webkit-appearance: none; border: none; background: transparent; outline: none; width:100%; height: 100%; padding: 0px; margin: 0px; align:left; left: 0px; top: 0px; valign:top; position: relative;'>" +
                "<div id='filter" + self.element.id + "' style='display: none; visibility: inherit; align:left; valign:top; left: 0px; top: 0px; position: absolute;'><input style='position: absolute;'/></div>" +
                "<div id='listBoxContent' style='-webkit-appearance: none; border: none; background: transparent; outline: none; border: none; padding: 0px; overflow: hidden; margin: 0px; align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>" +
                "<div id='verticalScrollBar" + self.element.id + "' style='visibility: inherit; align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>" +
                "<div id='horizontalScrollBar" + self.element.id + "' style='visibility: inherit; align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>" +
                "<div id='bottomRight' style='align:left; valign:top; left: 0px; top: 0px; border: none; position: absolute;'/>" +
                "</div>" +
                "</div>";
        
            self.host.attr('role', 'listbox');

            self.element.innerHTML = listBoxStructure;
            if (self._checkForHiddenParent) {
                self._addInput();
                if (!self.host.attr('tabIndex')) {
                    self.host.attr('tabIndex', 1);
                }
            }
            self.filter = $(self.element.firstChild.firstChild.firstChild);
            self.filterInput = $(self.filter[0].firstChild);
            self.filterInput.attr('placeholder', self.filterPlaceHolder);
            self.filterInput.addClass(self.toThemeProperty('jqx-widget jqx-listbox-filter-input jqx-input jqx-rc-all'));

            self.addHandler(self.filterInput, 'keyup.textchange', function (event) {                
                if (event.keyCode == 13) {
                    self._search(event);
                }
                else {
                    if (self.filterDelay > 0) {
                        if (self._filterTimer)
                            clearTimeout(self._filterTimer);

                        self._filterTimer = setTimeout(function () {
                            self._search(event);
                        }, self.filterDelay);
                    }
                }

                event.stopPropagation();
            });

            var verticalScrollBar = $(self.element.firstChild.firstChild.firstChild.nextSibling.nextSibling);
            if (!self.host.jqxButton) {
                throw new Error('jqxListBox: Missing reference to jqxbuttons.js.');
                return;
            }
            if (!verticalScrollBar.jqxScrollBar) {
                throw new Error('jqxListBox: Missing reference to jqxscrollbar.js.');
                return;
            }

            var largestep = parseInt(self.host.height()) / 2;
            if (largestep == 0) largestep = 10;

            self.vScrollBar = verticalScrollBar.jqxScrollBar({ _initialLayout: true, 'vertical': true, rtl: self.rtl, theme: self.theme, touchMode: self.touchMode, largestep: largestep });
            var horizontalScrollBar = $(self.element.firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling);
            self.hScrollBar = horizontalScrollBar.jqxScrollBar({ _initialLayout: true, 'vertical': false, rtl: self.rtl, touchMode: self.touchMode, theme: self.theme });

            self.content = $(self.element.firstChild.firstChild.firstChild.nextSibling);
            self.content[0].id = 'listBoxContent' + self.element.id;
            self.bottomRight = $(self.element.firstChild.firstChild.firstChild.nextSibling.nextSibling.nextSibling.nextSibling).addClass(self.toThemeProperty('jqx-listbox-bottomright')).addClass(self.toThemeProperty('jqx-scrollbar-state-normal'));
            self.bottomRight[0].id = "bottomRight" + self.element.id;
            self.vScrollInstance = $.data(self.vScrollBar[0], 'jqxScrollBar').instance;
            self.hScrollInstance = $.data(self.hScrollBar[0], 'jqxScrollBar').instance;
            if (self.isTouchDevice()) {
                if (!($.jqx.browser.msie && $.jqx.browser.version < 9)) {
                    var overlayContent = $("<div class='overlay' unselectable='on' style='z-index: 99; -webkit-appearance: none; border: none; background: black; opacity: 0.01; outline: none; border: none; padding: 0px; overflow: hidden; margin: 0px; align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>");
                    self.content.parent().append(overlayContent);
                    self.overlayContent = self.host.find('.overlay');
                    if (self.filterable) {
                        self.overlayContent.css('top', '30px');
                    }
                }
            }
            self._updateTouchScrolling();

            self.host.addClass('jqx-disableselect');
            if (self.host.jqxDragDrop) {
                jqxListBoxDragDrop();
            }
        },

        _highlight: function (label, searchstring) {
            var query = searchstring.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
            return label.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<b>' + match + '</b>'
            });
        },

        _addInput: function () {
            var name = this.host.attr('name');
            if (name) {
                this.host.attr('name', "");
            }

            this.input = $("<input type='hidden'/>");
            this.host.append(this.input);
            this.input.attr('name', name);
        },

        _updateTouchScrolling: function () {
            var self = this;
            if (this.isTouchDevice()) {
                self.enableHover = false;
                var element = this.overlayContent ? this.overlayContent : this.content;

                this.removeHandler($(element), $.jqx.mobile.getTouchEventName('touchstart') + '.touchScroll');
                this.removeHandler($(element), $.jqx.mobile.getTouchEventName('touchmove') + '.touchScroll');
                this.removeHandler($(element), $.jqx.mobile.getTouchEventName('touchend') + '.touchScroll');
                this.removeHandler($(element), 'touchcancel.touchScroll');

                $.jqx.mobile.touchScroll(element, self.vScrollInstance.max, function (left, top) {
                    if (top != null && self.vScrollBar.css('visibility') != 'hidden') {
                        var oldValue = self.vScrollInstance.value;
                        self.vScrollInstance.setPosition(top);
                        self._lastScroll = new Date();
                    }
                    if (left != null && self.hScrollBar.css('visibility') != 'hidden') {
                        var oldValue = self.hScrollInstance.value;
                        self.hScrollInstance.setPosition(left);
                        self._lastScroll = new Date();
                    }
                }, this.element.id, this.hScrollBar, this.vScrollBar);

                if (self.vScrollBar.css('visibility') != 'visible' && self.hScrollBar.css('visibility') != 'visible') {
                    $.jqx.mobile.setTouchScroll(false, this.element.id);
                }
                else {
                    $.jqx.mobile.setTouchScroll(true, this.element.id);
                }
                this._arrange();
            }
        },

        isTouchDevice: function () {
            var isTouchDevice = $.jqx.mobile.isTouchDevice();
            if (this.touchMode == true) {
                if (this.touchDevice)
                    return true;

                if ($.jqx.browser.msie && $.jqx.browser.version < 9)
                    return false;

                this.touchDevice = true;
                isTouchDevice = true;
                $.jqx.mobile.setMobileSimulator(this.element);
            }
            else if (this.touchMode == false) {
                isTouchDevice = false;
            }
            if (isTouchDevice && this.touchModeStyle != false) {
                this.scrollBarSize = $.jqx.utilities.touchScrollBarSize;
            }
            if (isTouchDevice) {
                this.host.addClass(this.toThemeProperty('jqx-touch'));
            }

            return isTouchDevice;
        },

        beginUpdate: function () {
            this.updatingListBox = true;
        },

        endUpdate: function () {
            this.updatingListBox = false;
            this._addItems();
            this._renderItems();
        },

        beginUpdateLayout: function () {
            this.updating = true;
        },

        resumeUpdateLayout: function () {
            this.updating = false;
            this.vScrollInstance.value = 0;
            this._render(false);
        },

        propertiesChangedHandler: function(object, key, value)
        {
            if (value.width && value.height && Object.keys(value).length == 2)
            {
                object._cachedItemHtml = new Array();
                object.refresh();
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this.isInitialized == undefined || this.isInitialized == false)
                return;

            if (oldvalue == value)
                return;

            if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length == 2)
            {
                return;
            }

            if (key == "_renderOnDemand") {
                object._render(false, true);
                if (object.selectedIndex != -1) {
                    var tmpIndex = object.selectedIndex;
                    object.selectedIndex = -1;
                    object._stopEvents = true;
                    object.selectIndex(tmpIndex, false, true);
                    if (object.selectedIndex == -1) {
                        object.selectedIndex = tmpIndex;
                    }
                    object._stopEvents = false;
                }
            }

            if (key == "filterable") {
                object.refresh();
            }

            if (key == "filterHeight") {
                object._arrange();
            }

            if (key == "filterPlaceHolder") {
                object.filterInput.attr('placeholder', value);
            }

            if (key == "renderer") {
                object._cachedItemHtml = new Array();
                object.refresh();
            }

            if (key == "itemHeight") {
                object.refresh();
            }

            if (key == 'source' || key == 'checkboxes') {
                if (value == null && oldvalue && oldvalue.unbindBindingUpdate) {
                    oldvalue.unbindBindingUpdate(object.element.id);
                    oldvalue.unbindDownloadComplete(object.element.id);
                }

                object.clearSelection();
                object.refresh();
            }

            if (key == 'scrollBarSize' || key == 'equalItemsWidth') {
                if (value != oldvalue) {
                    object._updatescrollbars();
                }
            }

            if (key == 'disabled') {
                object._renderItems();
                object.vScrollBar.jqxScrollBar({ disabled: value });
                object.hScrollBar.jqxScrollBar({ disabled: value });
            }

            if (key == "touchMode" || key == "rtl") {
                object._removeHandlers();
                object.vScrollBar.jqxScrollBar({ touchMode: value });
                object.hScrollBar.jqxScrollBar({ touchMode: value });
                if (key == "touchMode") {
                    if (!($.jqx.browser.msie && $.jqx.browser.version < 9)) {
                        var overlayContent = $("<div class='overlay' unselectable='on' style='z-index: 99; -webkit-appearance: none; border: none; background: black; opacity: 0.01; outline: none; border: none; padding: 0px; overflow: hidden; margin: 0px; align:left; valign:top; left: 0px; top: 0px; position: absolute;'></div>");
                        object.content.parent().append(overlayContent);
                        object.overlayContent = object.host.find('.overlay');
                    }
                }
                if (object.filterable && object.filterInput) {
                    if (key == "rtl" && value) {
                        object.filterInput.addClass(object.toThemeProperty('jqx-rtl'));
                    }
                    else if (key == "rtl" && !value) {
                        object.filterInput.removeClass(object.toThemeProperty('jqx-rtl'));
                    }
                    object._arrange();
                }

                object._updateTouchScrolling();
                object._addHandlers();
                object._render(false);
            }

            if (!this.updating) {
                if (key == "width" || key == "height") {
                    object._updateSize();
                }
            }

            if (key == 'theme') {
                if (oldvalue != value) {
                    object.hScrollBar.jqxScrollBar({ theme: object.theme });
                    object.vScrollBar.jqxScrollBar({ theme: object.theme });
                    object.host.removeClass();
                    object.host.addClass(object.toThemeProperty("jqx-listbox"));
                    object.host.addClass(object.toThemeProperty("jqx-widget"));
                    object.host.addClass(object.toThemeProperty("jqx-widget-content"));
                    object.host.addClass(object.toThemeProperty("jqx-reset"));
                    object.host.addClass(object.toThemeProperty("jqx-rc-all"));
                    object.refresh();
                }
            }

            if (key == 'selectedIndex') {
                object.clearSelection();
                object.selectIndex(value, true);
            }

            if (key == "displayMember" || key == "valueMember") {
                if (oldvalue != value) {
                    var oldSelectedIndex = object.selectedIndex;
                    object.refresh();
                    object.selectedIndex = oldSelectedIndex;
                    object.selectedIndexes[oldSelectedIndex] = oldSelectedIndex;
                }
                object._renderItems();
            }

            if (key == 'autoHeight') {
                if (oldvalue != value) {
                    object._render(false);
                }
                else {
                    object._updatescrollbars();
                    object._renderItems();
                }
            }
            if (object._checkForHiddenParent && $.jqx.isHidden(object.host)) {
                $.jqx.utilities.resize(this.host, function () {
                    object._updateSize();
                }, false, object._checkForHiddenParent);
            }
        },

        loadFromSelect: function (id) {
            if (id == null)
                return;

            var searchElementId = '#' + id;
            var selectElement = $(searchElementId);
            if (selectElement.length > 0) {              
                var result = $.jqx.parseSourceTag(selectElement[0]);
                var optionItems = result.items;
                var selectedOption = result.index;
                this.source = optionItems;
                this.fromSelect = true;
                this.clearSelection();
                this.selectedIndex = selectedOption;
                this.selectedIndexes[this.selectedIndex] = this.selectedIndex;
                this.refresh();
            }
        },

        invalidate: function () {
            this._cachedItemHtml = [];
            this._renderItems();
            this.virtualSize = null;
            this._updateSize();
        },

        refresh: function (initialRefresh) {
            var me = this;
            if (this.vScrollBar == undefined) {
                return;
            }
        
            this._cachedItemHtml = [];
            this.visibleItems = new Array();
            var selectInitialItem = function (initialRefresh) {
                if (initialRefresh == true) {
                    if (me.selectedIndex != -1) {
                        var tmpIndex = me.selectedIndex;
                        me.selectedIndex = -1;
                        me._stopEvents = true;
                        me.selectIndex(tmpIndex, false, true);
                        if (me.selectedIndex == -1) {
                            me.selectedIndex = tmpIndex;
                        }
                        me._stopEvents = false;
                    }
                }
            }
            if (this.itemswrapper != null) {
                this.itemswrapper.remove();
                this.itemswrapper = null;
            }
            if ($.jqx.dataAdapter && this.source != null && this.source._source) {

                this.databind(this.source, initialRefresh);
                selectInitialItem(initialRefresh);
                return;
            }
            if (this.autoBind || (!this.autoBind && !initialRefresh)) {
                if (this.field) {
                    this.loadSelectTag();
                }
                this.items = this.loadItems(this.source);
            }
        
            this._render(false, initialRefresh == true);
            selectInitialItem(initialRefresh);
            this._raiseEvent('6');
        },

        loadSelectTag: function () {
            var result = $.jqx.parseSourceTag(this.field);
            this.source = result.items;
            if (this.selectedIndex == -1)
                this.selectedIndex = result.index;
        },

        _render: function (ensurevisible, initialRefresh) {
            if (this._renderOnDemand) {
                this.visibleItems = new Array();
                this.renderedVisibleItems = new Array();
                this._renderItems();
                return;
            }

            this._addItems();
            this._renderItems();
            this.vScrollInstance.setPosition(0);
            this._cachedItemHtml = new Array();
            if (ensurevisible == undefined || ensurevisible) {
                if (this.items != undefined && this.items != null) {
                    if (this.selectedIndex >= 0 && this.selectedIndex < this.items.length) {
                        this.selectIndex(this.selectedIndex, true, true, true);
                    }
                }
            }

            if (this.allowDrag && this._enableDragDrop) {
                this._enableDragDrop();
                if (this.isTouchDevice()) {
                    this._removeHandlers();
                    if (this.overlayContent) {
                        this.overlayContent.remove();
                        this.overlayContent = null;
                    }
                    this._updateTouchScrolling();
                    this._addHandlers();
                    return;
                }
            }
            this._updateTouchScrolling();
            if (this.rendered) {
                this.rendered();
            }
            if (this.ready) {
                this.ready();
            }
        },

        _hitTest: function (hitLeft, hitTop) {
            if (this.filterable) {
                hitTop -= this.filterHeight;
                if (hitTop < 0) hitTop = 0;
            }

            var top = parseInt(this.vScrollInstance.value);
            var firstIndex = this._searchFirstVisibleIndex(hitTop + top, this.renderedVisibleItems)
            if (this.renderedVisibleItems[firstIndex] != undefined && this.renderedVisibleItems[firstIndex].isGroup)
                return null;

            if (this.renderedVisibleItems.length > 0) {
                var lastItem = this.renderedVisibleItems[this.renderedVisibleItems.length - 1];
                if (lastItem.height + lastItem.top < hitTop + top) {
                    return null;
                }
            }

            firstIndex = this._searchFirstVisibleIndex(hitTop + top)
            return this.visibleItems[firstIndex];

            return null;
        },

        _searchFirstVisibleIndex: function (value, collection) {
            if (value == undefined) {
                value = parseInt(this.vScrollInstance.value);
            }
            var min = 0;
            if (collection == undefined || collection == null) {
                collection = this.visibleItems;
            }

            var max = collection.length;
            while (min <= max) {
                mid = parseInt((min + max) / 2)
                var item = collection[mid];
                if (item == undefined)
                    break;

                if (item.initialTop > value && item.initialTop + item.height > value) {
                    max = mid - 1;
                } else if (item.initialTop < value && item.initialTop + item.height <= value) {
                    min = mid + 1;
                } else {
                    return mid;
                    break;
                }
            }

            return 0;
        },

        _renderItems: function () {
            if (this.items == undefined || this.items.length == 0) {
                this.visibleItems = new Array();
                return;
            }

            if (this.updatingListBox == true)
                return;

            var touchDevice = this.isTouchDevice();
            var vScrollInstance = this.vScrollInstance;
            var hScrollInstance = this.hScrollInstance;
            var top = parseInt(vScrollInstance.value);
            var left = parseInt(hScrollInstance.value);
            if (this.rtl) {
                if (this.hScrollBar[0].style.visibility != 'hidden') {
                    left = hScrollInstance.max - left;
                }
            }

            var itemsLength = this.items.length;
            var hostWidth = this.host.width();
            var contentWidth = parseInt(this.content[0].style.width);
            var width = contentWidth + parseInt(hScrollInstance.max);
            var vScrollBarWidth = parseInt(this.vScrollBar[0].style.width) + 2;
            if (this.vScrollBar[0].style.visibility == 'hidden') {
                vScrollBarWidth = 0;
            }

            if (this.hScrollBar[0].style.visibility != 'visible') {
                width = contentWidth;
            }
            var virtualItemsCount = this._getVirtualItemsCount();
            var renderCollection = new Array();
            var y = 0;
            var hostHeight = parseInt(this.element.style.height) + 2;
            if (this.element.style.height.indexOf('%') != -1) {
                hostHeight = this.host.outerHeight();
            }

            if (isNaN(hostHeight)) {
                hostHeight = 0;
            }
            var maxWidth = 0;
            var visibleIndex = 0;
            var renderIndex = 0;

            if (vScrollInstance.value == 0 || this.visibleItems.length == 0) {
                for (var indx = 0; indx < this.items.length; indx++) {
                    var item = this.items[indx];
                    if (item.visible) {
                        item.top = -top;
                        item.initialTop = -top;
                        if (!item.isGroup && item.visible) {
                            this.visibleItems[visibleIndex++] = item;
                            item.visibleIndex = visibleIndex - 1;
                        }

                        this.renderedVisibleItems[renderIndex++] = item;

                        item.left = -left;
                        var bottom = item.top + item.height;
                        if (bottom >= 0 && item.top - item.height <= hostHeight) {
                            renderCollection[y++] = { index: indx, item: item };
                        }

                        top -= item.height;
                        top--;
                    }
                }
            }
            var firstIndex = top > 0 ? this._searchFirstVisibleIndex(this.vScrollInstance.value, this.renderedVisibleItems) : 0;
            var initialHeight = 0;
            y = 0;
            var scrollValue = this.vScrollInstance.value;
            var iterations = 0;
            while (initialHeight < 100 + hostHeight) {
                var item = this.renderedVisibleItems[firstIndex];
                if (item == undefined)
                    break;
                if (item.visible) {
                    item.left = -left;
                    var bottom = item.top + item.height - scrollValue;
                    if (bottom >= 0 && item.initialTop - scrollValue - item.height <= 2 * hostHeight) {
                        renderCollection[y++] = { index: firstIndex, item: item };
                    }
                }

                firstIndex++;
                if (item.visible) {
                    initialHeight += item.initialTop - scrollValue + item.height - initialHeight;
                }
                iterations++;
                if (iterations > this.items.length - 1)
                    break;
            }
            if (this._renderOnDemand) {
                return;
            }

            var listItemNormalClass = this.toThemeProperty('jqx-listitem-state-normal') + ' ' + this.toThemeProperty('jqx-item');
            var listItemGroupClass = this.toThemeProperty('jqx-listitem-state-group');
            var listItemDisabledClass = this.toThemeProperty('jqx-listitem-state-disabled') + ' ' + this.toThemeProperty('jqx-fill-state-disabled');
            var middle = 0;
            var me = this;
            for (var indx = 0; indx < this.visualItems.length; indx++) {
                var itemElement = this.visualItems[indx];
                var hideItem = function () {
                    var spanElement = itemElement[0].firstChild; // itemElement.find('#spanElement');
                    if (me.checkboxes) {
                        spanElement = itemElement[0].lastChild;
                    }

                    if (spanElement != null) {
                        spanElement.style.visibility = 'hidden';
                        spanElement.className = "";
                    }

                    if (me.checkboxes) {
                        var checkbox = itemElement.find('.chkbox');
                        checkbox.css({ 'visibility': 'hidden' });
                    }
                }

                if (indx < renderCollection.length) {
                    var item = renderCollection[indx].item;
                    if (item.initialTop - scrollValue >= hostHeight) {
                        hideItem();
                        continue;
                    }

                    var spanElement = $(itemElement[0].firstChild); // itemElement.find('#spanElement');
                    if (this.checkboxes) {
                        spanElement = $(itemElement[0].lastChild);
                    }

                    if (spanElement.length == 0)
                        continue;

                    if (spanElement[0] == null) continue;
                    spanElement[0].className = "";
                    spanElement[0].style.display = "block";
                    spanElement[0].style.visibility = "inherit";
                    var classNameBuilder = "";
                    //                    spanElement.css({ 'display': 'block', 'visibility': 'inherit' });

                    if (!item.isGroup && !this.selectedIndexes[item.index] >= 0) {
                        classNameBuilder = listItemNormalClass;
                        //spanElement.addClass(listItemNormalClass);
                    }
                    else {
                        classNameBuilder = listItemGroupClass;
                        //spanElement.addClass(listItemGroupClass);
                    }

                    if (item.disabled || this.disabled) {
                        classNameBuilder += " " + listItemDisabledClass;
                        //spanElement.addClass(listItemDisabledClass);
                    }

                    if (this.roundedcorners) {
                        classNameBuilder += " " + this.toThemeProperty('jqx-rc-all');
                        //spanElement.addClass(this.toThemeProperty('jqx-rc-all'));
                    }
                    if (touchDevice) {
                        classNameBuilder += " " + this.toThemeProperty('jqx-listitem-state-normal-touch');
                    }

                    spanElement[0].className = classNameBuilder;

                    if (this.renderer) {
                        if (!item.key) item.key = this.generatekey();
                        if (!this._cachedItemHtml) this._cachedItemHtml = new Array();
                        if (this._cachedItemHtml[item.key]) {
                            if (spanElement[0].innerHTML != this._cachedItemHtml[item.key]) {
                                spanElement[0].innerHTML = this._cachedItemHtml[item.key];
                            }
                        }
                        else {
                            var html = this.renderer(item.index, item.label, item.value);
                            spanElement[0].innerHTML = html;
                            this._cachedItemHtml[item.key] = spanElement[0].innerHTML;
                        }

                    }
                    else {
                        if (this.itemHeight !== -1) {
                            var paddingAndBorder = 2 + 2 * parseInt(spanElement.css('padding-top'));
                            spanElement[0].style.lineHeight = (item.height - paddingAndBorder) + 'px';
                            spanElement.css('vertical-align', 'middle');
                        }

                        if (item.html != null && item.html.toString().length > 0) {
                            spanElement[0].innerHTML = item.html;
                        }
                        else if (item.label != null || item.value != null) {
                            if (item.label != null) {
                                if (spanElement[0].innerHTML !== item.label) {
                                    spanElement[0].innerHTML = item.label;
                                }
                                if ($.trim(item.label) == "") {
                                    spanElement[0].innerHTML = this.emptyString;
                                    if (this.emptyString == "") {
                                        spanElement[0].style.height = (item.height - 8) + 'px';
                                    }
                                }
                                if (!this.incrementalSearch && !item.disabled) {
                                    if (this.searchString != undefined && this.searchString != "") {
                                        spanElement[0].innerHTML = this._highlight(item.label.toString(), this.searchString);
                                    }
                                }
                            }
                            else if (item.label === null) {
                                spanElement[0].innerHTML = this.emptyString;
                                if (this.emptyString == "") {
                                    spanElement[0].style.height = (item.height - 8) + 'px';
                                }
                            }
                            else {
                                if (spanElement[0].innerHTML !== item.value) {
                                    spanElement[0].innerHTML = item.value;
                                }
                                else if (item.label == "") {
                                    spanElement[0].innerHTML = " ";
                                }
                            }
                        }
                        else if (item.label == "" || item.label == null) {
                            spanElement[0].innerHTML = "";
                            spanElement[0].style.height = (item.height - 8) + 'px';
                        }
                    }

                    itemElement[0].style.left = item.left + 'px';
                    itemElement[0].style.top = item.initialTop - scrollValue + 'px';

                    item.element = spanElement[0];
                    //  $.data(spanElement[0], 'item', item);
                    if (item.title) {
                        spanElement[0].title = item.title;
                    }

                    if (this.equalItemsWidth && !item.isGroup) {
                        if (maxWidth == 0) {
                            var itemWidth = parseInt(width);
                            var diff = parseInt(spanElement.outerWidth()) - parseInt(spanElement.width());
                            itemWidth -= diff;
                            var borderSize = 1;
                            if (borderSize != null) {
                                borderSize = parseInt(borderSize);
                            }
                            else borderSize = 0;
                            itemWidth -= 2 * borderSize;
                            maxWidth = itemWidth;
                            if (this.checkboxes && this.hScrollBar[0].style.visibility == 'hidden') {
                                maxWidth -= 18;
                            }
                        }
                        if (contentWidth > this.virtualSize.width) {
                            spanElement[0].style.width = maxWidth + 'px';
                            item.width = maxWidth;
                        }
                        else {
                            spanElement[0].style.width = -4 + this.virtualSize.width + 'px';
                            item.width = this.virtualSize.width - 4;
                        }
                    }
                    else {
                        if (spanElement.width() < this.host.width()) {
                            spanElement.width(this.host.width() - 2);
                        }
                    }

                    if (this.rtl) {
                        spanElement[0].style.textAlign = 'right';
                    }

                    if (this.autoItemsHeight) {
                        spanElement[0].style.whiteSpace = 'pre-line';
                        spanElement.width(maxWidth);
                        item.width = maxWidth;
                    }
                    middle = 0;
                    if (this.checkboxes && !item.isGroup) {
                        if (middle == 0) {
                            middle = (item.height - 16) / 2;
                            middle++;
                        }
                        var checkbox = $(itemElement.children()[0]);
                        checkbox[0].item = item;

                        if (!this.rtl) {
                            if (spanElement[0].style.left != '18px') {
                                spanElement[0].style.left = '18px';
                            }
                        }
                        else {
                            if (spanElement[0].style.left != '0px') {
                                spanElement[0].style.left = '0px';
                            }
                        }
                        if (this.rtl) {
                            checkbox.css('left', 8 + item.width + 'px');
                        }
                        checkbox[0].style.top = middle + 'px';
                        checkbox[0].style.display = 'block';
                        checkbox[0].style.visibility = 'inherit';
                        var checked = item.checked;
                        var checkClass = item.checked ? " " + this.toThemeProperty("jqx-checkbox-check-checked") : "";

                        if (checkbox[0].firstChild && checkbox[0].firstChild.firstChild && checkbox[0].firstChild.firstChild.firstChild) {
                            if (checkbox[0].firstChild.firstChild) {
                                if (checked) {
                                    checkbox[0].firstChild.firstChild.firstChild.className = checkClass;
                                }
                                else if (checked === false) {
                                    checkbox[0].firstChild.firstChild.firstChild.className = "";
                                }
                                else if (checked === null) {
                                    checkbox[0].firstChild.firstChild.firstChild.className = this.toThemeProperty("jqx-checkbox-check-indeterminate");
                                }
                            }
                        }

                        if ($.jqx.ariaEnabled) {
                            if (checked) {
                                itemElement[0].setAttribute('aria-selected', true);
                            }
                            else {
                                itemElement[0].removeAttribute('aria-selected');
                            }
                        }

                    }
                    else if (this.checkboxes) {
                        var checkbox = $(itemElement.children()[0]);
                        checkbox.css({ 'display': 'none', 'visibility': 'inherit' });
                    }

                    if (!item.disabled && ((!this.filterable && this.selectedIndexes[item.visibleIndex] >= 0) || (item.selected && this.filterable))) {
                        spanElement.addClass(this.toThemeProperty('jqx-listitem-state-selected'));
                        spanElement.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
                        if ($.jqx.ariaEnabled) {
                            itemElement[0].setAttribute('aria-selected', true);
                            this._activeElement = itemElement[0];
                        }
                    }
                    else if (!this.checkboxes) {
                        if ($.jqx.ariaEnabled) {
                            itemElement[0].removeAttribute('aria-selected');
                        }
                    }
                }
                else {
                    hideItem();
                }
            }
        },

        generatekey: function () {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },

        _calculateVirtualSize: function (ownerHeight) {
            if (this._renderOnDemand)
                return;

            var width = 0;
            var height = 2;
            var currentItem = 0;
            var spanElement = document.createElement('span');
            if (this.equalItemsWidth) {
                $(spanElement).css('float', 'left');
            }
            spanElement.style.whiteSpace = "pre";
            var itemsPerPage = 0;
            var hostHeight = undefined === ownerHeight ? this.host.outerHeight() : ownerHeight + 2;

            document.body.appendChild(spanElement);
            var length = this.items.length;
            var w = this.host.width();
            if (this.autoItemsHeight) {
                w -= 10;
                if (this.vScrollBar.css('visibility') != 'hidden') w -= 20;
            }

            if (this.autoItemsHeight || this.renderer || this.groups.length >= 1 || (length > 0 && this.items[0].html != null && this.items[0].html != "")) {
                for (var currentItem = 0; currentItem < length; currentItem++) {
                    var item = this.items[currentItem];

                    if (item.isGroup && (item.label == '' && item.html == '')) {
                        continue;
                    }

                    if (!item.visible)
                        continue;

                    var className = "";

                    if (!item.isGroup) {
                        className += this.toThemeProperty('jqx-widget jqx-listitem-state-normal jqx-rc-all');
                    }
                    else {
                        className += this.toThemeProperty('jqx-listitem-state-group jqx-rc-all');
                    }
                    className += " " + this.toThemeProperty('jqx-fill-state-normal');
                    if (this.isTouchDevice()) {
                        className += " " + this.toThemeProperty('jqx-touch');
                    }
                    spanElement.className = className;
                    if (this.autoItemsHeight) {
                        spanElement.style.whiteSpace = 'pre-line';
                        var checkWidth = this.checkboxes ? -20 : 0;
                        spanElement.style.width = (checkWidth + w) + 'px';
                    }

                    if (this.renderer) {
                        var html = this.renderer(item.index, item.label, item.value);
                        spanElement.innerHTML = html;
                    }
                    else {
                        if (item.html != null && item.html.toString().length > 0) {
                            spanElement.innerHTML = item.html;
                        }
                        else if (item.label != null || item.value != null) {
                            if (item.label != null) {
                                spanElement.innerHTML = item.label;
                                if (item.label == "") spanElement.innerHTML = "Empty";
                            }
                            else spanElement.innerHTML = item.value;
                        }
                    }

                    var spanHeight = spanElement.offsetHeight;
                    var spanWidth = spanElement.offsetWidth;

                    if (this.itemHeight > -1) {
                        spanHeight = this.itemHeight;
                    }

                    item.height = spanHeight;
                    item.width = spanWidth;
                    spanHeight++;
                    height += spanHeight;
                    width = Math.max(width, spanWidth);

                    if (height <= hostHeight) {
                        itemsPerPage++;
                    }
                }
            }
            else {
                var height = 0;
                var elementHeight = 0;
                var maxText = "";
                var maxTextLength = 0;
                var oldMaxTextLength = 0;
                var firstvisibleitem = -1;
                for (var currentItem = 0; currentItem < length; currentItem++) {
                    var item = this.items[currentItem];

                    if (item.isGroup && (item.label == '' && item.html == '')) {
                        continue;
                    }

                    if (!item.visible)
                        continue;
                    firstvisibleitem++;
                    var className = "";
                    if (firstvisibleitem == 0) {
                        className += this.toThemeProperty('jqx-listitem-state-normal jqx-rc-all');
                        className += " " + this.toThemeProperty('jqx-fill-state-normal');
                        className += " " + this.toThemeProperty('jqx-widget');
                        className += " " + this.toThemeProperty('jqx-listbox');
                        className += " " + this.toThemeProperty('jqx-widget-content');

                        if (this.isTouchDevice()) {
                            className += " " + this.toThemeProperty('jqx-touch');
                            className += " " + this.toThemeProperty('jqx-listitem-state-normal-touch');
                        }
                        spanElement.className = className;
                        if (this.autoItemsHeight) {
                            spanElement.style.whiteSpace = 'pre-line';
                            var checkWidth = this.checkboxes ? -20 : 0;
                            spanElement.style.width = (checkWidth + w) + 'px';
                        }

                        if (item.html == null || (item.label == "" || item.label == null)) {
                            spanElement.innerHTML = "Item";
                        }
                        else {
                            if (item.html != null && item.html.toString().length > 0) {
                                spanElement.innerHTML = item.html;
                            }
                            else if (item.label != null || item.value != null) {
                                if (item.label != null) {
                                    if (item.label.toString().match(new RegExp("\\w")) != null || item.label.toString().match(new RegExp("\\d")) != null) {
                                        spanElement.innerHTML = item.label;
                                    }
                                    else {
                                        spanElement.innerHTML = "Item";
                                    }
                                }
                                else spanElement.innerHTML = item.value;
                            }
                        }

                        var spanHeight = 1 + spanElement.offsetHeight;

                        if (this.itemHeight > -1) {
                            spanHeight = this.itemHeight;
                        }
                        elementHeight = spanHeight;
                    }

                    if (maxTextLength != undefined) {
                        oldMaxTextLength = maxTextLength;
                    }

                    if (item.html != null && item.html.toString().length > 0) {
                        maxTextLength = Math.max(maxTextLength, item.html.toString().length);
                        if (oldMaxTextLength != maxTextLength) {
                            maxText = item.html;
                        }
                    }
                    else if (item.label != null) {
                        maxTextLength = Math.max(maxTextLength, item.label.length);
                        if (oldMaxTextLength != maxTextLength) {
                            maxText = item.label;
                        }
                    }
                    else if (item.value != null) {
                        maxTextLength = Math.max(maxTextLength, item.value.length);
                        if (oldMaxTextLength != maxTextLength) {
                            maxText = item.value;
                        }
                    }

                    item.height = elementHeight;
                    height += elementHeight;
                    height++;
                    if (height <= hostHeight) {
                        itemsPerPage++;
                    }
                }
                spanElement.innerHTML = maxText;
                width = spanElement.offsetWidth;
            }

            height += 2;
            if (itemsPerPage < 10) itemsPerPage = 10;

            if (this.filterable) {
                height += this.filterHeight;
            }

            spanElement.parentNode.removeChild(spanElement);
            return { width: width, height: height, itemsPerPage: itemsPerPage };
        },

        _getVirtualItemsCount: function () {
            if (this.virtualItemsCount == 0) {
                var virtualItemsCount = parseInt(this.host.height()) / 5;
                if (virtualItemsCount > this.items.length) {
                    virtualItemsCount = this.items.length;
                }
                return virtualItemsCount;
            }
            else return this.virtualItemsCount;
        },

        _addItems: function (refreshUIItems) {
            if (this._renderOnDemand)
                return;

            var me = this;
            if (me.updatingListBox == true)
                return;

            if (me.items == undefined || me.items.length == 0) {
                me.virtualSize = { width: 0, height: 0, itemsPerPage: 0 };
                me._updatescrollbars();
                me.renderedVisibleItems = new Array();
                if (me.itemswrapper) {
                    me.itemswrapper.children().remove();
                }
                return;
            }
            var hostHeight = me.host.height();
            if (refreshUIItems == false) {
                var virtualSize = me._calculateVirtualSize(hostHeight);
                var virtualItemsCount = virtualSize.itemsPerPage * 2;
                if (me.autoHeight) {
                    virtualItemsCount = me.items.length;
                }

                me.virtualItemsCount = Math.min(virtualItemsCount, me.items.length);
                var virtualWidth = virtualSize.width;
                me.virtualSize = virtualSize;
                me._updatescrollbars();
                return;
            }
            var self = this;
            var top = 0;
            me.visibleItems = new Array();
            me.renderedVisibleItems = new Array();
            me._removeHandlers();
            if (me.allowDrag && me._enableDragDrop) {
                me.itemswrapper = null;
            }
            if (me.itemswrapper == null) {
                me.content[0].innerHTML = '';
                me.itemswrapper = $('<div style="outline: 0 none; overflow:hidden; width:100%; position: relative;"></div>');
                me.itemswrapper[0].style.height = (2 * hostHeight) + "px";
                me.content[0].appendChild(me.itemswrapper[0]);
            }

            var virtualSize = me._calculateVirtualSize(hostHeight);
            var virtualItemsCount = virtualSize.itemsPerPage * 2;
            if (me.autoHeight) {
                virtualItemsCount = me.items.length;
            }

            me.virtualItemsCount = Math.min(virtualItemsCount, me.items.length);
            var me = this;
            var virtualWidth = virtualSize.width;
            me.virtualSize = virtualSize;
            var wrapperWidth = Math.max(me.host.width(), 17 + virtualSize.width);
            me.itemswrapper[0].style.width = wrapperWidth + "px";
            var startIndex = 0;

            var html = "";
            var oldIE = $.jqx.browser.msie && $.jqx.browser.version < 9;
            var oldIEAttribute = oldIE ? ' unselectable="on"' : '';
            for (var virtualItemIndex = startIndex; virtualItemIndex < me.virtualItemsCount; virtualItemIndex++) {
                var item = me.items[virtualItemIndex];
                var id = 'listitem' + virtualItemIndex + me.element.id;
                html += "<div" + oldIEAttribute + " role='option' id='" + id + "' class='jqx-listitem-element'>";
                if (me.checkboxes) {
                    html += '<div style="background-color: transparent; padding: 0; margin: 0; position: absolute; float: left; width: 16px; height: 16px;" class="chkbox">';
                    var checkBoxContent = '<div class="' + me.toThemeProperty("jqx-checkbox-default") + ' ' + me.toThemeProperty("jqx-fill-state-normal") + ' ' + me.toThemeProperty("jqx-rc-all") + '"><div style="cursor: pointer; width: 13px; height: 13px;">';
                    var checkClass = item.checked ? " " + me.toThemeProperty("jqx-checkbox-check-checked") : "";
                    checkBoxContent += '<span style="width: 13px; height: 13px;" class="checkBoxCheck' + checkClass + '"></span>';
                    checkBoxContent += '</div></div>';
                    html += checkBoxContent;
                    html += '</div>';
                }
                html += "<span" + oldIEAttribute + " style='white-space: pre; -ms-touch-action: none;'></span></div>"
            }

            if (self.WinJS) {
                me.itemswrapper.html(html);
            }
            else {
                me.itemswrapper[0].innerHTML = html;
            }

            var children = me.itemswrapper.children();
            for (var virtualItemIndex = startIndex; virtualItemIndex < me.virtualItemsCount; virtualItemIndex++) {
                var item = me.items[virtualItemIndex];
                var itemElement = $(children[virtualItemIndex]);

                if (me.allowDrag && me._enableDragDrop) {
                    itemElement.addClass('draggable');
                }

                if (me.checkboxes) {
                    var checkbox = $(itemElement.children()[0]);
                    itemElement.css('float', 'left');
                    var spanElement = $(itemElement[0].firstChild);
                    spanElement.css('float', 'left');
                }

                itemElement[0].style.height = item.height + 'px';
                itemElement[0].style.top = top + 'px';

                top += item.height+1;
                me.visualItems[virtualItemIndex] = itemElement;
            };

            me._addHandlers();

            me._updatescrollbars();

            if (me.autoItemsHeight) {
                var virtualSize = me._calculateVirtualSize(hostHeight);
                var virtualItemsCount = virtualSize.itemsPerPage * 2;
                if (me.autoHeight) {
                    virtualItemsCount = me.items.length;
                }

                me.virtualItemsCount = Math.min(virtualItemsCount, me.items.length);
                var me = this;
                var virtualWidth = virtualSize.width;
                me.virtualSize = virtualSize;
                me._updatescrollbars();
            }

            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                me.host.attr('hideFocus', true);
                me.host.find('div').attr('hideFocus', true);
            }
        },

        _updatescrollbars: function () {
            var me = this;
            if (!me.virtualSize) {
                return;
            }
            var virtualHeight = me.virtualSize.height;
            var virtualWidth = me.virtualSize.width;
            var vScrollInstance = me.vScrollInstance;
            var hScrollInstance = me.hScrollInstance;
            me._arrange(false);
            var hasChange = false;
            var outerWidth = me.host.outerWidth();
            var outerHeight = me.host.outerHeight();
            var hScrollOffset = 0;
            if (virtualWidth > outerWidth) {
                hScrollOffset = me.hScrollBar.outerHeight() + 2;
            }
            if (virtualHeight + hScrollOffset > outerHeight) {
                var oldmax = vScrollInstance.max;
                vScrollInstance.max = 2 + parseInt(virtualHeight) + hScrollOffset - parseInt(outerHeight - 2);
                if (me.vScrollBar[0].style.visibility != 'inherit') {
                    me.vScrollBar[0].style.visibility = 'inherit';
                    hasChange = true;
                }
                if (oldmax != vScrollInstance.max) {
                    vScrollInstance._arrange();
                }
            }
            else {
                if (me.vScrollBar[0].style.visibility != 'hidden') {
                    me.vScrollBar[0].style.visibility = 'hidden';
                    hasChange = true;
                    vScrollInstance.setPosition(0);
                }
            }

            var scrollOffset = 0;
            if (me.vScrollBar[0].style.visibility != 'hidden') {
                scrollOffset = me.scrollBarSize + 6;
            }

            var checkboxes = me.checkboxes ? 20 : 0;

            if (me.autoItemsHeight) {
                me.hScrollBar[0].style.visibility = 'hidden';
            }
            else {
                if (virtualWidth >= outerWidth - scrollOffset - checkboxes) {
                    var changedMax = hScrollInstance.max;
                    if (me.vScrollBar[0].style.visibility == 'inherit') {
                        hScrollInstance.max = checkboxes + scrollOffset + parseInt(virtualWidth) - me.host.width() + 4;
                    }
                    else {
                        hScrollInstance.max = checkboxes + parseInt(virtualWidth) - me.host.width() + 6;
                    }

                    if (me.hScrollBar[0].style.visibility != 'inherit') {
                        me.hScrollBar[0].style.visibility = 'inherit';
                        hasChange = true;
                    }
                    if (changedMax != hScrollInstance.max) {
                        hScrollInstance._arrange();
                    }
                    if (me.vScrollBar[0].style.visibility == 'inherit') {
                        vScrollInstance.max = 2 + parseInt(virtualHeight) + me.hScrollBar.outerHeight() + 2 - parseInt(me.host.height());
                    }
                }
                else {
                    if (me.hScrollBar[0].style.visibility != 'hidden') {
                        me.hScrollBar[0].style.visibility = 'hidden';
                        hasChange = true;
                    }
                }
            }

            hScrollInstance.setPosition(0);

            if (hasChange) {
                me._arrange();
            }

            if (me.itemswrapper) {
                me.itemswrapper[0].style.width = Math.max(0, Math.max(outerWidth - 2, 17 + virtualWidth)) + 'px';
                me.itemswrapper[0].style.height = Math.max(0, 2 * outerHeight) + 'px';
            }

            var isTouchDevice = me.isTouchDevice();
            if (isTouchDevice) {
                if (me.vScrollBar.css('visibility') != 'visible' && me.hScrollBar.css('visibility') != 'visible') {
                    $.jqx.mobile.setTouchScroll(false, me.element.id);
                }
                else {
                    $.jqx.mobile.setTouchScroll(true, me.element.id);
                }
            }
        },

        clear: function () {
            this.source = null;
            this.clearSelection();
            this.refresh();
        },

        // clears the selection.
        clearSelection: function (render) {
            for (var indx = 0; indx < this.selectedIndexes.length; indx++) {
                if (this.selectedIndexes[indx] && this.selectedIndexes[indx] != -1) {
                    this._raiseEvent('1', { index: indx, type: 'api', item: this.getVisibleItem(indx), originalEvent: null });
                }

                this.selectedIndexes[indx] = -1;
            }
            this.selectedIndex = -1;
            this.selectedValue = null;
            this.selectedValues = new Array();

            if (render != false) {
                this._renderItems();
            }
        },

        // unselects item by index.
        unselectIndex: function (index, render) {
            if (isNaN(index))
                return;

            this.selectedIndexes[index] = -1;

            var hasIndexes = false;
            for (var indx = 0; indx < this.selectedIndexes.length; indx++) {
                var sindex = this.selectedIndexes[indx];
                if (sindex != -1 && sindex != undefined) {
                    hasIndexes = true;
                }
            }
            if (!hasIndexes) {
                this.selectedValue = null;
                this.selectedIndex = -1;
                var visibleItem = this.getVisibleItem(index);
                if (visibleItem) {
                    if (this.selectedValues[visibleItem.value]) {
                        this.selectedValues[visibleItem.value] = null;
                    }
                }
            }

            if (render == undefined || render == true) {
                this._renderItems();
                this._raiseEvent('1', { index: index, type: 'api', item: this.getVisibleItem(index), originalEvent: null });
            }
            this._updateInputSelection();

            this._raiseEvent('2', { index: index, type: 'api', item: this.getItem(index) });
        },

        getInfo: function()
        {
            var that = this;
            var items = this.getItems();
            var visibleItems = this.getVisibleItems();
            var renderedItems = function () {
                var scrollValue = that.vScrollInstance.value;
                if (that.filterable)
                    scrollValue -= that.filterHeight;
                var rendered = new Array();
                for (var i = 0; i < visibleItems.length; i++) {
                    var item = visibleItems[i];
                    if (item) {
                        var itemTop = item.initialTop;
                        var itemHeight = item.height;
                        var visible = true;
                        if (itemTop + itemHeight - scrollValue < 0 || itemTop - scrollValue >= that.host.height()) {
                            visible = false;
                        }
                        if (visible) {
                            rendered.push(item);
                        }
                    }
                }
                return rendered;
            }();

            return { items: items, visibleItems: visibleItems, viewItems: renderedItems };
        },

        // gets item's instance.
        getItem: function (index) {
            if (index == -1 || isNaN(index) || typeof (index) === "string") {
                if (index === -1) {
                    return null;
                }
                return this.getItemByValue(index);
            }

            var result = null;
            var item = $.each(this.items, function () {
                if (this.index == index) {
                    result = this;
                    return false;
                }
            });

            return result;
        },

        getVisibleItem: function (index) {
            if (index == -1 || isNaN(index) || typeof (index) === "string") {
                if (index === -1) {
                    return null;
                }
                return this.getItemByValue(index);
            }
            return this.visibleItems[index];
        },

        getVisibleItems: function () {
            return this.visibleItems;
        },

        // checks a specific item by its index.
        checkIndex: function (index, render, raiseEvent) {
            if (!this.checkboxes) {
                return;
            }

            if (isNaN(index))
                return;

            if (index < 0 || index >= this.visibleItems.length)
                return;

            if (this.visibleItems[index] != null && this.visibleItems[index].disabled) {
                return;
            }

            if (this.disabled)
                return;

            var item = this.getItem(index);
            if (this.groups.length > 0 || this.filterable) {
                var item = this.getVisibleItem(index);
            }
            if (item != null) {
                var checkbox = $(item.checkBoxElement);
                item.checked = true;
                if (render == undefined || render == true) {
                    this._updateCheckedItems();
                }
            }

            if (raiseEvent == undefined || raiseEvent == true) {
                this._raiseEvent(3, { label: item.label, value: item.value, checked: true, item: item });
            }
        },

        getCheckedItems: function () {
            if (!this.checkboxes) {
                return null;
            }

            var checkedItems = new Array();
            if (this.items == undefined) return;

            $.each(this.items, function () {
                if (this.checked) {
                    checkedItems[checkedItems.length] = this;
                }
            });
            return checkedItems;
        },

        checkAll: function (raiseEvents) {
            if (!this.checkboxes) {
                return;
            }

            if (this.disabled)
                return;

            var me = this;
            $.each(this.items, function () {
                var item = this;
                if (raiseEvents !== false && item.checked !== true) {
                    me._raiseEvent(3, { label: item.label, value: item.value, checked: true, item: item });
                }
                this.checked = true;
            });

            this._updateCheckedItems();
        },

        uncheckAll: function (raiseEvents) {
            if (!this.checkboxes) {
                return;
            }

            if (this.disabled)
                return;

            var me = this;
            $.each(this.items, function () {
                var item = this;
                if (raiseEvents !== false && item.checked !== false) {
                    this.checked = false;
                    me._raiseEvent(3, { label: item.label, value: item.value, checked: false, item: item });
                }
                this.checked = false;
            });

            this._updateCheckedItems();
        },

        // unchecks a specific item by its index.
        uncheckIndex: function (index, render, raiseEvent) {
            if (!this.checkboxes) {
                return;
            }

            if (isNaN(index))
                return;

            if (index < 0 || index >= this.visibleItems.length)
                return;

            if (this.visibleItems[index] != null && this.visibleItems[index].disabled) {
                return;
            }

            if (this.disabled)
                return;

            var item = this.getItem(index);
            if (this.groups.length > 0 || this.filterable) {
                var item = this.getVisibleItem(index);
            }
            if (item != null) {
                var checkbox = $(item.checkBoxElement);
                item.checked = false;
                if (render == undefined || render == true) {
                    this._updateCheckedItems();
                }
            }
            if (raiseEvent == undefined || raiseEvent == true) {
                this._raiseEvent(3, { label: item.label, value: item.value, checked: false, item: item });
            }
        },

        // sets a specific item's checked property to null.
        indeterminateIndex: function (index, render, raiseEvent) {
            if (!this.checkboxes) {
                return;
            }

            if (isNaN(index))
                return;

            if (index < 0 || index >= this.visibleItems.length)
                return;

            if (this.visibleItems[index] != null && this.visibleItems[index].disabled) {
                return;
            }

            if (this.disabled)
                return;

            var item = this.getItem(index);
            if (this.groups.length > 0 || this.filterable) {
                var item = this.getVisibleItem(index);
            }
            if (item != null) {
                var checkbox = $(item.checkBoxElement);
                item.checked = null;
                if (render == undefined || render == true) {
                    this._updateCheckedItems();
                }
            }
            if (raiseEvent == undefined || raiseEvent == true) {
                this._raiseEvent(3, { checked: null });
            }
        },

        // gets the selected index.
        getSelectedIndex: function () {
            return this.selectedIndex;
        },

        // gets all selected items.
        getSelectedItems: function () {
            var items = this.getVisibleItems();
            var selectedIndexes = this.selectedIndexes;
            var selectedItems = [];
            // get selected items.
            for (var index in selectedIndexes) {
                if (selectedIndexes[index] != -1) {
                    selectedItems[selectedItems.length] = items[index];
                }
            }

            return selectedItems;
        },

        // gets the selected item.
        getSelectedItem: function () {
            var items = this.getSelectedItems();
            if (items && items.length > 0) {
                return items[0];
            }
            return null;
        },

        _updateCheckedItems: function () {
            var selectedIndex = this.selectedIndex;
            this.clearSelection(false);
            var items = this.getCheckedItems();
            this.selectedIndex = selectedIndex;

            this._renderItems();
            var selectedElement = $.data(this.element, 'hoveredItem');
            if (selectedElement != null) {
                $(selectedElement).addClass(this.toThemeProperty('jqx-listitem-state-hover'));
                $(selectedElement).addClass(this.toThemeProperty('jqx-fill-state-hover'));
            }

            this._updateInputSelection();
        },

        getItemByValue: function (value) {
            if (this.visibleItems == null) {
                return;
            }

            if (value && value.value) {
                value = value.value;
            }

            if (this.itemsByValue) {
                return this.itemsByValue[$.trim(value).split(" ").join("?")];
            }
            var items = this.visibleItems;

            for (var i = 0; i < items.length; i++) {
                if (items[i].value == value) {
                    return items[i];
                    break;
                }
            }
        },

        checkItem: function (item) {
            if (item != null) {
                var newItem = this._getItemByParam(item);
                return this.checkIndex(newItem.visibleIndex, true);
            }
            return false;
        },

        uncheckItem: function (item) {
            if (item != null) {
                var newItem = this._getItemByParam(item);
                return this.uncheckIndex(newItem.visibleIndex, true);
            }
            return false;
        },

        indeterminateItem: function (item) {
            if (item != null) {
                var newItem = this._getItemByParam(item);
                return this.indeterminateIndex(newItem.visibleIndex, true);
            }
            return false;
        },

        val: function (value) {
            if (!this.input)
                return;

            var isEmpty = function(obj) {
                for(var key in obj) {
                    if(obj.hasOwnProperty(key))
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

            if (isEmpty(value) || arguments.length == 0) {
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

        selectItem: function (item) {
            if (item != null)
            {
                if (item.index == undefined)
                {
                    var newItem = this.getItemByValue(item);
                    if (newItem) item = newItem;
                }
                return this.selectIndex(item.visibleIndex, true);
            }
            else this.clearSelection();
            return false;
        },

        unselectItem: function (item) {
            if (item != null) {
                if (item.index == undefined) {
                    var newItem = this.getItemByValue(item);
                    if (newItem) item = newItem;
                }
                return this.unselectIndex(item.visibleIndex, true);
            }
            return false;
        },

        // selects an item.
        selectIndex: function (index, ensureVisible, render, forceSelect, type, originalEvent) {
            if (isNaN(index))
                return;

            var tempSelectedIndex = this.selectedIndex;
            if (this.filterable) {
                this.selectedIndex = -1;
            }

            if (index < -1 || index >= this.visibleItems.length)
                return;

            if (this.visibleItems[index] != null && this.visibleItems[index].disabled) {
                return;
            }

            if (this.disabled)
                return;

            if (!this.multiple && !this.multipleextended && this.selectedIndex == index && !forceSelect && !this.checkboxes) {
                if (this.visibleItems && this.items && this.visibleItems.length != this.items.length) {
                    newItem = this.getVisibleItem(index);
                    if (newItem) {
                        this.selectedValue = newItem.value;
                        this.selectedValues[newItem.value] = newItem.value;
                    }
                }
                return;
            }
            if (this.checkboxes) {
                this._updateCheckedItems();
                var oldIndex = tempSelectedIndex;
                if (this.selectedIndex == index && !this.multiple) {
                    oldIndex = -1;
                }

                if (type == undefined) {
                    type = 'none';
                }

                var newItem = this.getItem(index);
                var oldItem = this.getItem(oldIndex);
                if (this.visibleItems && this.items && this.visibleItems.length != this.items.length) {
                    newItem = this.getVisibleItem(index);
                    oldItem = this.getVisibleItem(oldIndex);
                }

                this._raiseEvent('1', { index: oldIndex, type: type, item: oldItem, originalEvent: originalEvent });
                this.selectedIndex = index;
                this.selectedIndexes[oldIndex] = -1;
                this.selectedIndexes[index] = index;
                if (newItem) {
                    this.selectedValue = newItem.value;
                    this.selectedValues[newItem.value] = newItem.value;
                }
                this._raiseEvent('0', { index: index, type: type, item: newItem, originalEvent: originalEvent });
                this._renderItems();
                return;
            }

            this.focused = true;
            var newSelection = false;
            if (this.selectedIndex != index) newSelection = true;
            var oldIndex = tempSelectedIndex;
            if (this.selectedIndex == index && !this.multiple) {
                oldIndex = -1;
            }

            if (type == undefined) {
                type = 'none';
            }

            var newItem = this.getItem(index);
            var oldItem = this.getItem(oldIndex);
            if (this.visibleItems && this.items && this.visibleItems.length != this.items.length) {
                newItem = this.getVisibleItem(index);
                oldItem = this.getVisibleItem(oldIndex);
            }

            if (forceSelect != undefined && forceSelect) {
                this._raiseEvent('1', { index: oldIndex, type: type, item: oldItem, originalEvent: originalEvent });
                this.selectedIndex = index;
                this.selectedIndexes[oldIndex] = -1;
                this.selectedIndexes[index] = index;
                if (newItem) {
                    this.selectedValue = newItem.value;
                    this.selectedValues[newItem.value] = newItem.value;
                }
                this._raiseEvent('0', { index: index, type: type, item: newItem, originalEvent: originalEvent });
            }
            else {
                var me = this;
                var singleSelect = function (index, oldIndex, type, oldItem, newItem, originalEvent) {
                    me._raiseEvent('1', { index: oldIndex, type: type, item: oldItem, originalEvent: originalEvent });
                    me.selectedIndex = index;
                    me.selectedIndexes = [];
                    oldIndex = index;
                    me.selectedIndexes[index] = index;
                    me.selectedValues = new Array();
                    if (newItem) {
                        me.selectedValues[newItem.value] = newItem.value;
                    }
       
                    me._raiseEvent('0', { index: index, type: type, item: newItem, originalEvent: originalEvent });
                }
                var multipleSelect = function (index, oldIndex, type, oldItem, newItem, originalEvent) {
                    if (me.selectedIndexes[index] == undefined || me.selectedIndexes[index] == -1) {
                        me.selectedIndexes[index] = index;
                        me.selectedIndex = index;
                        if (newItem) {
                            me.selectedValues[newItem.value] = newItem.value;
                            me._raiseEvent('0', { index: index, type: type, item: newItem, originalEvent: originalEvent });
                        }
                    }
                    else {
                        oldIndex = me.selectedIndexes[index];
                        oldItem = me.getVisibleItem(oldIndex);
                        if (oldItem) {
                            me.selectedValues[oldItem.value] = null;
                        }

                        me.selectedIndexes[index] = -1;
                        me.selectedIndex = -1;
                        me._raiseEvent('1', { index: oldIndex, type: type, item: oldItem, originalEvent: originalEvent });
                    }
                }

                if (this.multipleextended) {
                    if (!this._shiftKey && !this._ctrlKey) {
                        if (type != 'keyboard' && type != 'mouse') {
                            multipleSelect(index, oldIndex, type, oldItem, newItem, originalEvent);
                            me._clickedIndex = index;
                        }
                        else {
                            this.clearSelection(false);
                            me._clickedIndex = index;
                            singleSelect(index, oldIndex, type, oldItem, newItem, originalEvent);
                        }
                    }
                    else if (this._ctrlKey) {
                        if (type == 'keyboard') {
                            this.clearSelection(false);
                            me._clickedIndex = index;
                        }
                        multipleSelect(index, oldIndex, type, oldItem, newItem, originalEvent);
                    }
                    else if (this._shiftKey) {
                        if (me._clickedIndex == undefined) me._clickedIndex = oldIndex;
                        var min = Math.min(me._clickedIndex, index);
                        var max = Math.max(me._clickedIndex, index);
                        this.clearSelection(false);
                        for (var i = min; i <= max; i++) {
                            me.selectedIndexes[i] = i;
                            me.selectedValues[me.getVisibleItem(i).value] = me.getVisibleItem(i).value;

                            me._raiseEvent('0', { index: i, type: type, item: this.getVisibleItem(i), originalEvent: originalEvent });
                        }
                        if (type != 'keyboard') {
                            me.selectedIndex = me._clickedIndex;
                        }
                        else {
                            me.selectedIndex = index;
                        }
                    }
                }
                else if (this.multiple) {
                    multipleSelect(index, oldIndex, type, oldItem, newItem, originalEvent);
                }
                else {
                    if (newItem) {
                        this.selectedValue = newItem.value;
                    }
                    singleSelect(index, oldIndex, type, oldItem, newItem, originalEvent);
                }
            }

            if (render == undefined || render == true) {
                this._renderItems();
            }

            if (ensureVisible != undefined && ensureVisible != null && ensureVisible == true) {
                this.ensureVisible(index);
            }

            this._raiseEvent('2', { index: index, item: newItem, oldItem: oldItem, type: type, originalEvent: originalEvent });
            this._updateInputSelection();

            return newSelection;
        },

        _updateInputSelection: function() {
            this._syncSelection();
            var selectedValues = new Array();
            if (this.input) { 
                if (this.selectedIndex == -1) {
                    this.input.val("");
                }
                else {
                    if (this.items) {
                        if (this.items[this.selectedIndex] != undefined) {
                            this.input.val(this.items[this.selectedIndex].value);
                            selectedValues.push(this.items[this.selectedIndex].value);
                        }
                    }
                }
                if (this.multiple || this.multipleextended || this.checkboxes) {
                    var items = !this.checkboxes ? this.getSelectedItems() : this.getCheckedItems();
                    var str = "";
                    if (items) {
                        for (var i = 0; i < items.length; i++) {
                            if (undefined != items[i]) {
                                if (i == items.length - 1) {
                                    str += items[i].value;
                                }
                                else {
                                    str += items[i].value + ",";
                                }
                                selectedValues.push(items[i].value);
                            }
                        }
                        this.input.val(str);
                    }
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

        // checks whether an item is in the visible view.
        isIndexInView: function (index) {
            if (isNaN(index)) {
                return false;
            }

            if (!this.items)
                return false;

            if (index < 0 || index >= this.items.length) {
                return false;
            }

            var scrollValue = this.vScrollInstance.value;
            var filterHeight = 0;
            if (this.filterable)
                filterHeight = this.filterHeight;

            var item = this.visibleItems[index];
            if (item == undefined)
                return true;

            var itemTop = item.initialTop;
            var itemHeight = item.height;

            if (itemTop - scrollValue < filterHeight || itemTop - scrollValue + filterHeight + itemHeight >= this.host.outerHeight()) {
                return false;
            }

            return true;
        },

        //[optimize]
        _itemsInPage: function () {
            var itemsCount = 0;
            var me = this;

            if (this.items) {
                $.each(this.items, function () {
                    if ((this.initialTop + this.height) >= me.content.height()) {
                        return false;
                    }
                    itemsCount++;
                });
            }
            return itemsCount;
        },

        _firstItemIndex: function () {
            if (this.visibleItems != null) {
                if (this.visibleItems[0]) {
                    if (this.visibleItems[0].isGroup) {
                        return this._nextItemIndex(0);
                    }
                    else return 0;
                }
                else return 0;
            }

            return -1;
        },

        _lastItemIndex: function () {
            if (this.visibleItems != null) {
                if (this.visibleItems[this.visibleItems.length - 1]) {
                    if (this.visibleItems[this.visibleItems.length - 1].isGroup) {
                        return this._prevItemIndex(this.visibleItems.length - 1);
                    }
                    else return this.visibleItems.length - 1;
                }
                else return this.visibleItems.length - 1;
            }

            return -1;
        },

        _nextItemIndex: function (index) {
            for (indx = index + 1; indx < this.visibleItems.length; indx++) {
                if (this.visibleItems[indx]) {
                    if (!this.visibleItems[indx].disabled && !this.visibleItems[indx].isGroup) {
                        return indx;
                    }
                }
            }

            return -1;
        },

        _prevItemIndex: function (index) {
            for (indx = index - 1; indx >= 0; indx--) {
                if (this.visibleItems[indx]) {
                    if (!this.visibleItems[indx].disabled && !this.visibleItems[indx].isGroup) {
                        return indx;
                    }
                }
            }

            return -1;
        },

        clearFilter: function()
        {
            this.filterInput.val("");
            this._updateItemsVisibility("");
        },

        _search: function (event) {
            var that = this;
            var value = that.filterInput.val();

            if (event.keyCode == 9)
                return;

            if (that.searchMode == 'none' || that.searchMode == null || that.searchMode == 'undefined') {
                return;
            }

            if (event.keyCode == 16 || event.keyCode == 17 || event.keyCode == 20)
                return;

            if (event.keyCode == 37 || event.keyCode == 39)
                return false;

            if (event.altKey || event.keyCode == 18)
                return;

            if (event.keyCode >= 33 && event.keyCode <= 40) {
                return;
            }

            if (event.ctrlKey || event.metaKey || that.ctrlKey) {
                if (event.keyCode != 88 && event.keyCode != 86) {
                    return;
                }
            }

            if (value === that.searchString) {
                return;
            }

            that._updateItemsVisibility(value);   
        },

        _updateItemsVisibility: function (value) {
            var items = this.getItems();
            if (items == undefined) {
                return { index: -1, matchItem: new Array() }
            }
            
            var me = this;
            var index = -1;
            var matchItems = new Array();
            var newItemsIndex = 0;

            $.each(items, function (i) {
                var itemValue = '';
                if (!this.isGroup) {
                    if (this.searchLabel) {
                        itemValue = this.searchLabel;
                    }
                    else if (this.label) {
                        itemValue = this.label;
                    }
                    else if (this.value) {
                        itemValue = this.value;
                    }
                    else if (this.title) {
                        itemValue = this.title;
                    }
                    else itemValue = 'jqxItem';
                    itemValue = itemValue.toString();
                    var matches = false;
                    switch (me.searchMode) {
                        case 'containsignorecase':
                            matches = $.jqx.string.containsIgnoreCase(itemValue, value);
                            break;
                        case 'contains':
                            matches = $.jqx.string.contains(itemValue, value);
                            break;
                        case 'equals':
                            matches = $.jqx.string.equals(itemValue, value);
                            break;
                        case 'equalsignorecase':
                            matches = $.jqx.string.equalsIgnoreCase(itemValue, value);
                            break;
                        case 'startswith':
                            matches = $.jqx.string.startsWith(itemValue, value);
                            break;
                        case 'startswithignorecase':
                            matches = $.jqx.string.startsWithIgnoreCase(itemValue, value);
                            break;
                        case 'endswith':
                            matches = $.jqx.string.endsWith(itemValue, value);
                            break;
                        case 'endswithignorecase':
                            matches = $.jqx.string.endsWithIgnoreCase(itemValue, value);
                            break;
                    }

                    if (!matches) {
                        this.visible = false;
                    }

                    if (matches) {
                        matchItems[newItemsIndex++] = this;
                        this.visible = true;
                        index = this.visibleIndex;
                    }

                    if (value == '') {
                        this.visible = true;
                        matches = false;
                    }
                }
            });

            me.renderedVisibleItems = new Array();
            me.visibleItems = new Array();
            me.vScrollInstance.setPosition(0, true);
            me._addItems(false);
            me._renderItems();
            for (var indx = 0; indx < me.items.length; indx++) {
                me.selectedIndexes[indx] = -1;
            }
            me.selectedIndex = -1;
            for (var selectedValue in me.selectedValues) {
                var value = me.selectedValues[selectedValue];
                var item = me.getItemByValue(value);
                if (item) {
                    if (item.visible) {
                        me.selectedIndex = item.visibleIndex;
                        me.selectedIndexes[item.visibleIndex] = item.visibleIndex;
                    }
                }
            }
        
            me._syncSelection();
            if (me.filterChange)
            {
                me.filterChange(value);
            }
        },

        // get all matches of a searched value.
        _getMatches: function (value, startindex) {
            if (value == undefined || value.length == 0)
                return -1;

            if (startindex == undefined) startindex = 0;

            var items = this.getItems();
            var me = this;
            var index = -1;
            var newItemsIndex = 0;

            $.each(items, function (i) {
                var itemValue = '';
                if (!this.isGroup) {
                    if (this.searchLabel) {
                        itemValue = this.searchLabel.toString();
                    }
                    else if (this.label) {
                        itemValue = this.label.toString();
                    }
                    else if (this.value) {
                        itemValue = this.value.toString();
                    }
                    else if (this.title) {
                        itemValue = this.title.toString();
                    }
                    else itemValue = 'jqxItem';

                    var mathes = false;
                    switch (me.searchMode) {
                        case 'containsignorecase':
                            mathes = $.jqx.string.containsIgnoreCase(itemValue, value);
                            break;
                        case 'contains':
                            mathes = $.jqx.string.contains(itemValue, value);
                            break;
                        case 'equals':
                            mathes = $.jqx.string.equals(itemValue, value);
                            break;
                        case 'equalsignorecase':
                            mathes = $.jqx.string.equalsIgnoreCase(itemValue, value);
                            break;
                        case 'startswith':
                            mathes = $.jqx.string.startsWith(itemValue, value);
                            break;
                        case 'startswithignorecase':
                            mathes = $.jqx.string.startsWithIgnoreCase(itemValue, value);
                            break;
                        case 'endswith':
                            mathes = $.jqx.string.endsWith(itemValue, value);
                            break;
                        case 'endswithignorecase':
                            mathes = $.jqx.string.endsWithIgnoreCase(itemValue, value);
                            break;
                    }

                    if (mathes && this.visibleIndex >= startindex) {
                        index = this.visibleIndex;
                        return false;
                    }
                }
            });

            return index;
        },

        // gets all items that match to a search value.
        findItems: function (value) {
            var items = this.getItems();
            var me = this;
            var index = 0;
            var matchItems = new Array();

            $.each(items, function (i) {
                var itemValue = '';
                if (!this.isGroup) {
                    if (this.label) {
                        itemValue = this.label;
                    }
                    else if (this.value) {
                        itemValue = this.value;
                    }
                    else if (this.title) {
                        itemValue = this.title;
                    }
                    else itemValue = 'jqxItem';

                    var mathes = false;
                    switch (me.searchMode) {
                        case 'containsignorecase':
                            mathes = $.jqx.string.containsIgnoreCase(itemValue, value);
                            break;
                        case 'contains':
                            mathes = $.jqx.string.contains(itemValue, value);
                            break;
                        case 'equals':
                            mathes = $.jqx.string.equals(itemValue, value);
                            break;
                        case 'equalsignorecase':
                            mathes = $.jqx.string.equalsIgnoreCase(itemValue, value);
                            break;
                        case 'startswith':
                            mathes = $.jqx.string.startsWith(itemValue, value);
                            break;
                        case 'startswithignorecase':
                            mathes = $.jqx.string.startsWithIgnoreCase(itemValue, value);
                            break;
                        case 'endswith':
                            mathes = $.jqx.string.endsWith(itemValue, value);
                            break;
                        case 'endswithignorecase':
                            mathes = $.jqx.string.endsWithIgnoreCase(itemValue, value);
                            break;
                    }

                    if (mathes) {
                        matchItems[index++] = this;
                    }
                }
            });

            return matchItems;
        },

        _syncSelection: function () {
            var that = this;
            if (that.filterable) {
                if (that.items) {
                    for (var i = 0; i < that.items.length; i++) {
                        var item = that.items[i];
                        item.selected = false;
                    }
                }
                for (var i = 0; i < that.visibleItems.length; i++) {
                    var item = that.visibleItems[i];
                    if (that.selectedIndexes && that.selectedIndexes[i] == item.visibleIndex) {
                        item.selected = true;
                    }
                }

                if (that.itemswrapper) {
                    that._renderItems();
                }
            }
        },

        _handleKeyDown: function (event) {
            var key = event.keyCode;
            var self = this;
            var index = self.selectedIndex;
            var selectedIndex = self.selectedIndex;
            var newSelection = false;
      
            if (!this.keyboardNavigation || !this.enableSelection)
                return;

            if (this.filterInput && event.target == this.filterInput[0]) {
                return;
            }
            
            var doClear = function () {
                if (self.multiple || self.checkboxes) {
                    self.clearSelection(false);
                }
            }

            if (event.altKey) key = -1;

            if (key == 32 && this.checkboxes) {
                var checkItem = this.getItem(index);
                if (checkItem != null) {
                    self._updateItemCheck(checkItem, index);
                    event.preventDefault();
                }
                self._searchString = "";
                self.selectIndex(checkItem.visibleIndex, false, true, true, 'keyboard', event);
                self._renderItems();
                return;
            }

            if (self.incrementalSearch) {
                var matchindex = -1;
                if (!self._searchString) {
                    self._searchString = "";
                }

                if ((key == 8 || key == 46) && self._searchString.length >= 1) {
                    self._searchString = self._searchString.substr(0, self._searchString.length - 1);
                }

                var letter = String.fromCharCode(key);

                var isDigit = (!isNaN(parseInt(letter)));
                var toReturn = false;
                if ((key >= 65 && key <= 97) || isDigit || key == 8 || key == 32 || key == 46) {
                    if (!event.shiftKey) {
                        letter = letter.toLocaleLowerCase();
                    }

                    var startIndex = 1 + self.selectedIndex;
                    if (key != 8 && key != 32 && key != 46) {
                        if (self._searchString.length > 0 && self._searchString.substr(0, 1) == letter) {
                            startIndex = 1 + self.selectedIndex;
                            self._searchString += letter;
                        }
                        else {
                            self._searchString += letter;
                        }
                    }

                    if (key == 32) {
                        self._searchString += " ";
                    }

                    var matches = this._getMatches(self._searchString, startIndex);
                    matchindex = matches;
                    if (matchindex == self._lastMatchIndex || matchindex == -1) {
                        var matches = this._getMatches(self._searchString, 0);
                        matchindex = matches;
                    }
                    self._lastMatchIndex = matchindex;

                    if (matchindex >= 0) {
                        var toSelect = function () {
                            doClear();
                            self.selectIndex(matchindex, false, false, false, 'keyboard', event);
                            var isInView = self.isIndexInView(matchindex);
                            if (!isInView) {
                                self.ensureVisible(matchindex);
                            }
                            else {
                                self._renderItems();
                            }
                        }
                        if (self._toSelectTimer) clearTimeout(self._toSelectTimer);
                        self._toSelectTimer = setTimeout(function () {
                            toSelect();
                        }, self.incrementalSearchKeyDownDelay);
                    }
                    toReturn = true;
                }

                if (self._searchTimer != undefined) {
                    clearTimeout(self._searchTimer);
                }

                if (key == 27 || key == 13) {
                    self._searchString = "";
                }

                self._searchTimer = setTimeout(function () {
                    self._searchString = "";
                    self._renderItems();
                }, self.incrementalSearchDelay);
                if (matchindex >= 0) {
                    return;
                }
                if (toReturn)
                    return false;
            }

          
            if (key == 33) {
                var itemsInPage = self._itemsInPage();
                if (self.selectedIndex - itemsInPage >= 0) {
                    doClear();
                    self.selectIndex(selectedIndex - itemsInPage, false, false, false, 'keyboard', event);
                }
                else {
                    doClear();
                    self.selectIndex(self._firstItemIndex(), false, false, false, 'keyboard', event);
                }
                self._searchString = "";
            }

            if (key == 32 && this.checkboxes) {
                var checkItem = this.getItem(index);
                if (checkItem != null) {
                    self._updateItemCheck(checkItem, index);
                    event.preventDefault();
                }
                self._searchString = "";
            }

            if (key == 36) {
                doClear();
                self.selectIndex(self._firstItemIndex(), false, false, false, 'keyboard', event);
                self._searchString = "";
            }

            if (key == 35) {
                doClear();
                self.selectIndex(self._lastItemIndex(), false, false, false, 'keyboard', event);
                self._searchString = "";
            }

            if (key == 34) {
                var itemsInPage = self._itemsInPage();
                if (self.selectedIndex + itemsInPage < self.visibleItems.length) {
                    doClear();
                    self.selectIndex(selectedIndex + itemsInPage, false, false, false, 'keyboard', event);
                }
                else {
                    doClear();
                    self.selectIndex(self._lastItemIndex(), false, false, false, 'keyboard', event);
                }
                self._searchString = "";
            }

            if (key == 38) {
                self._searchString = "";
                if (self.selectedIndex > 0) {
                    var newIndex = self._prevItemIndex(self.selectedIndex);
                    if (newIndex != self.selectedIndex && newIndex != -1) {
                        doClear();
                        self.selectIndex(newIndex, false, false, false, 'keyboard', event);
                    }
                    else return true;
                }
                else return false;
            }
            else if (key == 40) {
                self._searchString = "";
                if (self.selectedIndex + 1 < self.visibleItems.length) {
                    var newIndex = self._nextItemIndex(self.selectedIndex);
                    if (newIndex != self.selectedIndex && newIndex != -1) {
                        doClear();
                        self.selectIndex(newIndex, false, false, false, 'keyboard', event);
                    }
                    else return true;
                }
                else return false;
            }

            if (key == 35 || key == 36 || key == 38 || key == 40 || key == 34 || key == 33) {
                var isInView = self.isIndexInView(self.selectedIndex);
                if (!isInView) {
                    self.ensureVisible(self.selectedIndex);
                }
                else {
                    self._renderItems();
                }

                return false;
            }

            return true;
        },

        _updateItemCheck: function (checkItem, index) {
            if (this.disabled) return;

            if (checkItem.checked == true) {
                checkItem.checked = (checkItem.hasThreeStates && this.hasThreeStates) ? null : false;
            }
            else {
                checkItem.checked = checkItem.checked != null;
            }

            switch (checkItem.checked) {
                case true:
                    this.checkIndex(index);
                    break;
                case false:
                    this.uncheckIndex(index);
                    break;
                default:
                    this.indeterminateIndex(index);
                    break;
            }
        },

        // performs mouse wheel.
        wheel: function (event, self) {
            if (self.autoHeight || !self.enableMouseWheel) {
                event.returnValue = true;
                return true;
            }

            if (self.disabled) return true;

            var delta = 0;
            if (!event) /* For IE. */
                event = window.event;

            if (event.originalEvent && event.originalEvent.wheelDelta) {
                event.wheelDelta = event.originalEvent.wheelDelta;
            }

            if (event.wheelDelta) { /* IE/Opera. */
                delta = event.wheelDelta / 120;
            } else if (event.detail) { /** Mozilla case. */
                delta = -event.detail / 3;
            }
            if (delta) {
                var result = self._handleDelta(delta);
                if (result) {
                    if (event.preventDefault)
                        event.preventDefault();

                    if (event.originalEvent != null) {
                        event.originalEvent.mouseHandled = true;
                    }

                    if (event.stopPropagation != undefined) {
                        event.stopPropagation();
                    }
                }

                if (result) {
                    result = false;
                    event.returnValue = result;
                    return result;
                }
                else {
                    return false;
                }
            }

            if (event.preventDefault)
                event.preventDefault();
            event.returnValue = false;
        },

        _handleDelta: function (delta) {
            var oldvalue = this.vScrollInstance.value;
            if (delta < 0) {
                this.scrollDown();
            }
            else this.scrollUp();
            var newvalue = this.vScrollInstance.value;
            if (oldvalue != newvalue) {
                return true;
            }

            return false;
        },

        focus: function () {
            try {
                this.focused = true;
                this.host.focus();
                var me = this;
                setTimeout(function () {
                    me.host.focus();
                }, 25);
            }
            catch (error) {
            }
        },

        _removeHandlers: function () {
            var self = this;
            this.removeHandler($(document), 'keydown.listbox' + this.element.id);
            this.removeHandler($(document), 'keyup.listbox' + this.element.id);
            this.removeHandler(this.vScrollBar, 'valueChanged');
            this.removeHandler(this.hScrollBar, 'valueChanged');
            if (this._mousewheelfunc) {
                this.removeHandler(this.host, 'mousewheel', this._mousewheelfunc);
            }
            else {
                this.removeHandler(this.host, 'mousewheel');
            }

            this.removeHandler(this.host, 'keydown');
            this.removeHandler(this.content, 'mouseleave');
            this.removeHandler(this.content, 'focus');
            this.removeHandler(this.content, 'blur');
            this.removeHandler(this.host, 'focus');
            this.removeHandler(this.host, 'blur');
            this.removeHandler(this.content, 'mouseenter');
            this.removeHandler(this.content, 'mouseup');
            this.removeHandler(this.content, 'mousedown');
            this.removeHandler(this.content, 'touchend');

            if (this._mousemovefunc) {
                this.removeHandler(this.content, 'mousemove', this._mousemovefunc);
            }
            else {
                this.removeHandler(this.content, 'mousemove');
            }
            this.removeHandler(this.content, 'selectstart');
            if (this.overlayContent) {
                this.removeHandler(this.overlayContent, $.jqx.mobile.getTouchEventName('touchend'));
            }
        },

        _updateSize: function () {
            if (!this.virtualSize) {
                this._oldheight = null;
                this.virtualSize = this._calculateVirtualSize();
            }

            var self = this;
            self._arrange();
            if (self.host.height() != self._oldheight || self.host.width() != self._oldwidth) {
                var changedWidth = self.host.width() != self._oldwidth;

                if (self.autoItemsHeight) {
                    self._render(false);
                }
                else {
                    if (self.items) {
                        if (self.items.length > 0 && self.virtualItemsCount * self.items[0].height < self._oldheight - 2) {
                            self._render(false);
                        }
                        else {
                            var _oldScrollValue = self.vScrollInstance.value;
                            self._updatescrollbars();
                            self._renderItems();
                            if (_oldScrollValue < self.vScrollInstance.max) {
                                self.vScrollInstance.setPosition(_oldScrollValue);
                            }
                            else {
                                self.vScrollInstance.setPosition(self.vScrollInstance.max);
                            }
                        }
                    }
                }
                self._oldwidth = self.host.width();
                self._oldheight = self.host.height();
            }
        },

        _addHandlers: function () {
            var self = this;
            this.focused = false;
            var animating = false;
            var prevValue = 0;
            var object = null;
            var prevValue = 0;
            var newValue = 0;
            var lastScroll = new Date();
            var isTouchDevice = this.isTouchDevice();

            this.addHandler(this.vScrollBar, 'valueChanged', function (event) {
                if ($.jqx.browser.msie && $.jqx.browser.version > 9) {
                    setTimeout(function () {
                        self._renderItems();
                    }, 1);
                }
                else self._renderItems();
            });

            this.addHandler(this.hScrollBar, 'valueChanged', function () {
                self._renderItems();
            });

            if (this._mousewheelfunc) {
                this.removeHandler(this.host, 'mousewheel', this._mousewheelfunc);
            }

            this._mousewheelfunc = function (event) {
                self.wheel(event, self);
            };
            this.addHandler(this.host, 'mousewheel', this._mousewheelfunc);

            this.addHandler($(document), 'keydown.listbox' + this.element.id, function (event) {
                self._ctrlKey = event.ctrlKey || event.metaKey;
                self._shiftKey = event.shiftKey;
            });
            this.addHandler($(document), 'keyup.listbox' + this.element.id, function (event) {
                self._ctrlKey = event.ctrlKey || event.metaKey;
                self._shiftKey = event.shiftKey;
            });

            this.addHandler(this.host, 'keydown', function (event) {
                return self._handleKeyDown(event);
            });

            this.addHandler(this.content, 'mouseleave', function (event) {
                self.focused = false;
                var hoveredItem = $.data(self.element, 'hoveredItem');
                if (hoveredItem != null) {
                    $(hoveredItem).removeClass(self.toThemeProperty('jqx-listitem-state-hover'));
                    $(hoveredItem).removeClass(self.toThemeProperty('jqx-fill-state-hover'));
                    $.data(self.element, 'hoveredItem', null);
                }
            });

            this.addHandler(this.content, 'focus', function (event) {
                if (!self.disabled) {
                    self.host.addClass(self.toThemeProperty('jqx-fill-state-focus'));
                    self.focused = true;
                }
            });

            this.addHandler(this.content, 'blur', function (event) {
                self.focused = false;
                self.host.removeClass(self.toThemeProperty('jqx-fill-state-focus'));
            });

            this.addHandler(this.host, 'focus', function (event) {
                if (!self.disabled) {
                    self.host.addClass(self.toThemeProperty('jqx-fill-state-focus'));
                    self.focused = true;
                }
            });

            this.addHandler(this.host, 'blur', function (event) {
                if ($.jqx.browser.msie && $.jqx.browser.version < 9 && self.focused) {
                    return;
                }

                self.host.removeClass(self.toThemeProperty('jqx-fill-state-focus'));
                self.focused = false;
            });

            this.addHandler(this.content, 'mouseenter', function (event) {
                self.focused = true;
            });
            var hasTransform = $.jqx.utilities.hasTransform(this.host);

            if (this.enableSelection) {
                var isTouch = self.isTouchDevice() && this.touchMode !== true;
                var eventName = !isTouch ? 'mousedown' : 'touchend';
                var upEventName = !isTouch ? 'mouseup' : 'touchend';

                if (this.overlayContent) {
                    this.addHandler(this.overlayContent, $.jqx.mobile.getTouchEventName('touchend'), function (event) {
                        if (!self.enableSelection) {
                            return true;
                        }

                        if (isTouch) {
                            self._newScroll = new Date();
                            if (self._newScroll - self._lastScroll < 500) {
                                return true;
                            }
                        }

                        var touches = $.jqx.mobile.getTouches(event);
                        var touch = touches[0];
                        if (touch != undefined) {
                            var selfOffset = self.host.offset();
                            var left = parseInt(touch.pageX);
                            var top = parseInt(touch.pageY);
                            if (self.touchMode == true) {
                                if (touch._pageX != undefined) {
                                    left = parseInt(touch._pageX);
                                    top = parseInt(touch._pageY);
                                }
                            }
                            left = left - selfOffset.left;
                            top = top - selfOffset.top;
                            var item = self._hitTest(left, top);
                            if (item != null && !item.isGroup) {
                                self._newScroll = new Date();
                                if (self._newScroll - self._lastScroll < 500) {
                                    return false;
                                }
                                if (self.checkboxes) {
                                    self._updateItemCheck(item, item.visibleIndex);
                                    return;
                                }


                                if (item.html.indexOf('href') != -1) {
                                    setTimeout(function () {
                                        self.selectIndex(item.visibleIndex, false, true, false, 'mouse', event);
                                        self.content.trigger('click');
                                        return false;
                                    }, 100);
                                }
                                else {
                                    self.selectIndex(item.visibleIndex, false, true, false, 'mouse', event);
                                    if (event.preventDefault) event.preventDefault();

                                    self.content.trigger('click');
                                    return false;
                                }
                            }
                        }
                    });
                }
                else {
                    var isMouseDown = false;

                    this.addHandler(this.content, eventName, function (event) {
                        if (!self.enableSelection) {
                            return true;
                        }

                        isMouseDown = true;

                        if (isTouch) {
                            self._newScroll = new Date();
                            if (self._newScroll - self._lastScroll < 500) {
                                return false;
                            }
                        }

                        self.focused = true;
                        if (!self.isTouchDevice() && self.focusable) {
                            self.host.focus();
                        }
                        if (event.target.id != ('listBoxContent' + self.element.id) && self.itemswrapper[0] != event.target) {
                            var target = event.target;
                            var targetOffset = $(target).offset();
                            var selfOffset = self.host.offset();
                            if (hasTransform) {
                                var left = $.jqx.mobile.getLeftPos(target);
                                var top = $.jqx.mobile.getTopPos(target);
                                targetOffset.left = left; targetOffset.top = top;

                                left = $.jqx.mobile.getLeftPos(self.element);
                                top = $.jqx.mobile.getTopPos(self.element);
                                selfOffset.left = left; selfOffset.top = top;
                            }

                            var y = parseInt(targetOffset.top) - parseInt(selfOffset.top);
                            var x = parseInt(targetOffset.left) - parseInt(selfOffset.left);
                            var item = self._hitTest(x, y);
                            if (item != null && !item.isGroup) {
                                var doSelection = function (item, event) {
                                    if (!self._shiftKey)
                                        self._clickedIndex = item.visibleIndex;
                                    if (!self.checkboxes) {
                                        self.selectIndex(item.visibleIndex, false, true, false, 'mouse', event);
                                    } else {
                                       x = 20 + event.pageX - targetOffset.left;
                                        if (self.rtl) {
                                            var hscroll = self.hScrollBar.css('visibility') != 'hidden' ? self.hScrollInstance.max : self.host.width();
                                            if (x <= self.host.width() - 20) {
                                                if (!self.allowDrag) {
                                                    self._updateItemCheck(item, item.visibleIndex);
                                                    self.selectIndex(item.visibleIndex, false, true, false, 'mouse', event);
                                                }
                                                else {
                                                    setTimeout(function () {
                                                        if (!self._dragItem) {
                                                            if (!isMouseDown) {
                                                                self._updateItemCheck(item, item.visibleIndex);
                                                                self.selectIndex(item.visibleIndex, false, true, false, 'mouse', event);
                                                            }
                                                        }
                                                    }, 200);
                                                }
                                            }
                                        }
                                        else {
                                            if (x + self.hScrollInstance.value >= 20) {
                                                if (!self.allowDrag) {
                                                    self._updateItemCheck(item, item.visibleIndex);
                                                    self.selectIndex(item.visibleIndex, false, true, false, 'mouse', event);
                                                }
                                                else {
                                                    setTimeout(function () {
                                                        if (!self._dragItem) {
                                                            if (!isMouseDown) {
                                                                self._updateItemCheck(item, item.visibleIndex);
                                                                self.selectIndex(item.visibleIndex, false, true, false, 'mouse', event);
                                                            }
                                                        }
                                                    }, 200);
                                                }
                                            }
                                        }
                                    }
                                }

                                if (!item.disabled) {
                                    if (item.html.indexOf('href') != -1) {
                                        setTimeout(function () {
                                            doSelection(item, event);
                                        }, 100);
                                    }
                                    else {
                                        doSelection(item, event);
                                    }
                                }
                            }
                            if (eventName == 'mousedown') {
                                var rightclick = false;
                                if (event.which) rightclick = (event.which == 3);
                                else if (event.button) rightclick = (event.button == 2);
                                if (rightclick) return true;
                                return false;
                            }
                        }

                        return true;
                    });
                }

                this.addHandler(this.content, 'mouseup', function (event) {
                    self.vScrollInstance.handlemouseup(self, event);
                    isMouseDown = false;
                });

                if ($.jqx.browser.msie) {
                    this.addHandler(this.content, 'selectstart', function (event) {
                        return false;
                    });
                }
            }
            // hover behavior.
            var isTouchDevice = this.isTouchDevice();
            if (this.enableHover && !isTouchDevice) {
                this._mousemovefunc = function (event) {
                    if (isTouchDevice)
                        return true;

                    if (!self.enableHover)
                        return true;

                    var which = $.jqx.browser.msie == true && $.jqx.browser.version < 9 ? 0 : 1;
                    if (event.target == null)
                        return true;

                    if (self.disabled)
                        return true;

                    self.focused = true;
                    var scrolling = self.vScrollInstance.isScrolling();
                    if (!scrolling && event.target.id != ('listBoxContent' + self.element.id)) {
                        if (self.itemswrapper[0] != event.target) {
                            var target = event.target;
                            var targetOffset = $(target).offset();
                            var selfOffset = self.host.offset();
                            if (hasTransform) {
                                var left = $.jqx.mobile.getLeftPos(target);
                                var top = $.jqx.mobile.getTopPos(target);
                                targetOffset.left = left; targetOffset.top = top;

                                left = $.jqx.mobile.getLeftPos(self.element);
                                top = $.jqx.mobile.getTopPos(self.element);
                                selfOffset.left = left; selfOffset.top = top;
                            }
                            var y = parseInt(targetOffset.top) - parseInt(selfOffset.top);                      
                            var x = parseInt(targetOffset.left) - parseInt(selfOffset.left);
                            var item = self._hitTest(x, y);
                            if (item != null && !item.isGroup && !item.disabled) {
                                var selectedElement = $.data(self.element, 'hoveredItem');
                                if (selectedElement != null) {
                                    $(selectedElement).removeClass(self.toThemeProperty('jqx-listitem-state-hover'));
                                    $(selectedElement).removeClass(self.toThemeProperty('jqx-fill-state-hover'));
                                }

                                $.data(self.element, 'hoveredItem', item.element);
                                var $element = $(item.element);
                                $element.addClass(self.toThemeProperty('jqx-listitem-state-hover'));
                                $element.addClass(self.toThemeProperty('jqx-fill-state-hover'));
                            }
                        }
                    }
                };

                this.addHandler(this.content, 'mousemove', this._mousemovefunc);
            }
        },

        _arrange: function (arrangeScrollbars) {
            if (arrangeScrollbars == undefined) arrangeScrollbars = true;

            var me = this;
            var width = null;
            var height = null;
            var filterHeight = me.filterable ? me.filterHeight : 0;
           
            var _setHostHeight = function (height) {
                height = me.host.height();
                if (height == 0) {
                    height = 200;
                    me.host.height(height);
                }
                return height;
            }

            if (me.width != null && me.width.toString().indexOf("px") != -1) {
                width = me.width;
            }
            else
                if (me.width != undefined && !isNaN(me.width)) {
                    width = me.width;
                };

            if (me.height != null && me.height.toString().indexOf("px") != -1) {
                height = me.height;
            }
            else if (me.height != undefined && !isNaN(me.height)) {
                height = me.height;
            };

            if (me.width != null && me.width.toString().indexOf("%") != -1) {
                me.host.css("width", me.width);
                width = me.host.width();
            }
            if (me.height != null && me.height.toString().indexOf("%") != -1) {
                me.host.css("height", me.height);
                height = _setHostHeight(height);
            }

            if (width != null) {
                width = parseInt(width);
                if (parseInt(me.element.style.width) != parseInt(me.width)) {
                    me.host.width(me.width);
                }
            }

            if (!me.autoHeight) {
                if (height != null) {
                    height = parseInt(height);
                    if (parseInt(me.element.style.height) != parseInt(me.height)) {
                        me.host.height(me.height);
                        _setHostHeight(height);
                    }
                }
            }
            else {
                if (me.virtualSize) {
                    if (me.hScrollBar.css('visibility') != 'hidden') {
                        me.host.height(me.virtualSize.height + parseInt(me.scrollBarSize) + 3);
                        me.height =  me.virtualSize.height + parseInt(me.scrollBarSize) + 3;
                        height = me.height;
                    }
                    else {
                        me.host.height(me.virtualSize.height);
                        me.height = me.virtualSize.height;
                        height = me.virtualSize.height;
                    }
                }
            }

            // scrollbar Size.
            var scrollSize = me.scrollBarSize;
            if (isNaN(scrollSize)) {
                scrollSize = parseInt(scrollSize);
                if (isNaN(scrollSize)) {
                    scrollSize = '17px';
                }
                else scrollSize = scrollSize + 'px';
            }

            scrollSize = parseInt(scrollSize);
            var scrollOffset = 4;
            var bottomSizeOffset = 2;
            var rightSizeOffset = 1;
            // right scroll offset. 
            if (me.vScrollBar) {
                if (me.vScrollBar[0].style.visibility != 'hidden') {
                    rightSizeOffset = scrollSize + scrollOffset;
                }
                else {
                    me.vScrollInstance.setPosition(0);
                }
            }
            else return;
            if (scrollSize == 0)
            {
                rightSizeOffset = 1;
                bottomSizeOffset = 1;
            }

            if (me.hScrollBar) {
                // bottom scroll offset.
                if (me.hScrollBar[0].style.visibility != 'hidden') {
                    bottomSizeOffset = scrollSize + scrollOffset;
                }
                else {
                    me.hScrollInstance.setPosition(0);
                }
            }
            else return;

            if (me.autoItemsHeight) {
                me.hScrollBar[0].style.visibility = 'hidden';
                bottomSizeOffset = 0;
            }

            if (height == null) height = 0;
            var hScrollTop = parseInt(height) - scrollOffset - scrollSize;
            if (hScrollTop < 0) hScrollTop = 0;

            if (parseInt(me.hScrollBar[0].style.height) != scrollSize) {
                if (parseInt(scrollSize) < 0) {
                    scrollSize = 0;
                }

                me.hScrollBar[0].style.height = parseInt(scrollSize) + 'px';
            }

            if (me.hScrollBar[0].style.top != hScrollTop + 'px') {
                me.hScrollBar[0].style.top = hScrollTop + 'px';
                me.hScrollBar[0].style.left = '0px';
            }

            var hscrollwidth = width - scrollSize - scrollOffset;
            if (hscrollwidth < 0) hscrollwidth = 0;
            var hScrollWidth = hscrollwidth + 'px';

            if (me.hScrollBar[0].style.width != hScrollWidth) {
                me.hScrollBar[0].style.width = hScrollWidth;
            }

            if (rightSizeOffset <= 1) {
                if (width >= 2) {
                    me.hScrollBar[0].style.width = parseInt(width - 2) + 'px';
                }
            }

            if (scrollSize != parseInt(me.vScrollBar[0].style.width)) {
                me.vScrollBar[0].style.width = parseInt(scrollSize) + 'px';
            }
            if ((parseInt(height) - bottomSizeOffset) != parseInt(me.vScrollBar[0].style.height)) {
                var scrollHeight = parseInt(height) - bottomSizeOffset;
                if (scrollHeight < 0) scrollHeight = 0;
                me.vScrollBar[0].style.height = scrollHeight + 'px';
            }

            if (width == null) width = 0;
            var vScrollLeft = parseInt(width) - parseInt(scrollSize) - scrollOffset + 'px';;
            if (vScrollLeft != me.vScrollBar[0].style.left) {
                if (parseInt(vScrollLeft) >= 0) {
                    me.vScrollBar[0].style.left = vScrollLeft;
                }
                me.vScrollBar[0].style.top = '0px';
            }

            var vScrollInstance = me.vScrollInstance;
            vScrollInstance.disabled = me.disabled;
            if (arrangeScrollbars) {
                vScrollInstance._arrange();
            }

            var hScrollInstance = me.hScrollInstance;
            hScrollInstance.disabled = me.disabled;
            if (arrangeScrollbars) {
                hScrollInstance._arrange();
            }

            if ((me.vScrollBar[0].style.visibility != 'hidden') && (me.hScrollBar[0].style.visibility != 'hidden')) {
                me.bottomRight[0].style.visibility = 'inherit';
                me.bottomRight[0].style.left = 1 + parseInt(me.vScrollBar[0].style.left) + 'px';
                me.bottomRight[0].style.top = 1 + parseInt(me.hScrollBar[0].style.top) + 'px';
                if (me.rtl) {
                    me.bottomRight.css({ left: 0 });
                }
                me.bottomRight[0].style.width = parseInt(scrollSize) + 3 + 'px';
                me.bottomRight[0].style.height = parseInt(scrollSize) + 3 + 'px';
            }
            else {
                me.bottomRight[0].style.visibility = 'hidden';
            }

            if (parseInt(me.content[0].style.width) != (parseInt(width) - rightSizeOffset)) {
                var w = parseInt(width) - rightSizeOffset;
                if (w < 0) w = 0;
                me.content[0].style.width = w + 'px';
            }

            if (me.rtl) {
                me.vScrollBar.css({ left: 0 + 'px', top: '0px' });
                me.hScrollBar.css({ left: me.vScrollBar.width() + 2 + 'px' });
                if (me.vScrollBar[0].style.visibility != 'hidden') {
                    me.content.css('margin-left', 4 + me.vScrollBar.width());
                }
                else {
                    me.content.css('margin-left', 0);
                    me.hScrollBar.css({ left: '0px' });
                }
                if (me.filterable && me.filterInput) {
                    me.filterInput.css({ left: me.vScrollBar.width() + 6 + 'px' });
                }
            }

            if (parseInt(me.content[0].style.height) != (parseInt(height) - bottomSizeOffset)) {
                var h = parseInt(height) - bottomSizeOffset;
                if (h < 0) h = 0;
                me.content[0].style.height = h + 'px';
                me.content[0].style.top =  '0px';
            }
            if (filterHeight > 0) {
                me.content[0].style.top = filterHeight + 'px';
                me.content[0].style.height = parseInt(me.content[0].style.height) - filterHeight + 'px';
            }

            if (me.filterable) {
                me.filterInput[0].style.height = (filterHeight - 6) + 'px';
                me.filterInput[0].style.top = '3px';
                if (!me.rtl) {
                    me.filterInput[0].style.left = parseInt(me.content.css('left')) + 3 + 'px';
                }
                me.filterInput[0].style.width = parseInt(me.content.css('width')) - 7 + 'px';
                me.filter[0].style.display = "block";
            }
            else {
                me.filter[0].style.display = "none";
            }

            if (me.overlayContent) {
                me.overlayContent.width(parseInt(width) - rightSizeOffset);
                me.overlayContent.height(parseInt(height) - bottomSizeOffset);
            }
        },

        // scrolls to a list box item.
        ensureVisible: function (index, topItem) {
            if (isNaN(index)) {
                var item = this.getItemByValue(index);
                if (item) {
                    index = item.index;
                }
            }

            var isInView = this.isIndexInView(index);
            if (!isInView) {
                if (index < 0)
                    return;
                if (this.autoHeight) {
                    var vScrollInstance = $.data(this.vScrollBar[0], 'jqxScrollBar').instance;
                    vScrollInstance.setPosition(0);
                }
                else {
                    for (indx = 0; indx < this.visibleItems.length; indx++) {
                        var item = this.visibleItems[indx];
                        if (item.visibleIndex == index && !item.isGroup) {
                            var vScrollInstance = $.data(this.vScrollBar[0], 'jqxScrollBar').instance;
                            var value = vScrollInstance.value;
                            var filterHeight = !this.filterable ? 0 : this.filterHeight + 2;

                            var hScrollVisible = this.hScrollBar.css('visibility') === 'hidden';
                            var hScrollOffset = hScrollVisible ? 0 : this.scrollBarSize + 4;
                            if (item.initialTop < value) {
                                vScrollInstance.setPosition(item.initialTop);
                                if (indx == 0) {
                                    vScrollInstance.setPosition(0);
                                }
                            }
                            else if (item.initialTop + item.height > value + this.host.height() - filterHeight) {
                                var hostHeight = this.host.height();

                                if (this.filterable) {
                                    vScrollInstance.setPosition(this.filterHeight + 2 + item.initialTop + item.height + 2 - hostHeight + hScrollOffset);
                                }
                                else {
                                    vScrollInstance.setPosition(item.initialTop + item.height + 2 - hostHeight + hScrollOffset);
                                    if (indx === this.visibleItems.length - 1) {
                                        vScrollInstance.setPosition(vScrollInstance.max);
                                    }
                                }
                                if (topItem) {
                                    var value = vScrollInstance.value;
                                    var desiredItemPosition = item.initialTop;
                                    if (this.filterable) {
                                        desiredItemPosition = this.filterHeight + 2 + item.initialTop;
                                    }
                                    if (value + hostHeight < vScrollInstance.max) {
                                        vScrollInstance.setPosition(desiredItemPosition);
                                    }
                                }
                            }

                            break;
                        }
                    }
                }
            }
            else {
                if (topItem) {
                    for (indx = 0; indx < this.visibleItems.length; indx++) {
                        var item = this.visibleItems[indx];
                        if (item.visibleIndex == index && !item.isGroup) {
                            var value = this.vScrollInstance.value;
                            var desiredItemPosition = item.initialTop;
                            if (this.filterable) {
                                desiredItemPosition = this.filterHeight + 2 + item.initialTop;
                            }
                            if (value + this.host.height() < this.vScrollInstance.max) {
                                this.vScrollInstance.setPosition(desiredItemPosition);
                            }
                        }
                    }
                }
            }

            this._renderItems();
        },

        scrollTo: function (left, top) {
            if (this.vScrollBar.css('visibility') != 'hidden') {
                this.vScrollInstance.setPosition(top);
            }
            if (this.hScrollBar.css('visibility') != 'hidden') {
                this.hScrollInstance.setPosition(left);
            }
        },

        // scrolls down.
        scrollDown: function () {
            if (this.vScrollBar.css('visibility') == 'hidden')
                return false;

            var vScrollInstance = this.vScrollInstance;
            if (vScrollInstance.value + vScrollInstance.largestep <= vScrollInstance.max) {
                vScrollInstance.setPosition(vScrollInstance.value + vScrollInstance.largestep);
                return true;
            }
            else {
                vScrollInstance.setPosition(vScrollInstance.max);
                return true;
            }

            return false;
        },

        // scrolls up.
        scrollUp: function () {
            if (this.vScrollBar.css('visibility') == 'hidden')
                return false;

            var vScrollInstance = this.vScrollInstance;
            if (vScrollInstance.value - vScrollInstance.largestep >= vScrollInstance.min) {
                vScrollInstance.setPosition(vScrollInstance.value - vScrollInstance.largestep);
                return true;
            }
            else {
                if (vScrollInstance.value != vScrollInstance.min) {
                    vScrollInstance.setPosition(vScrollInstance.min);
                    return true;
                }
            }
            return false;
        },

        databind: function (source, initialRefresh) {
            this.records = new Array();
            var isdataadapter = source._source ? true : false;
            var dataadapter = new $.jqx.dataAdapter(source,
                {
                    autoBind: false
                }
            );

            if (isdataadapter) {
                dataadapter = source;
                source = source._source;
            }

            var initadapter = function (me) {
                if (source.type != undefined) {
                    dataadapter._options.type = source.type;
                }
                if (source.formatdata != undefined) {
                    dataadapter._options.formatData = source.formatdata;
                }
                if (source.contenttype != undefined) {
                    dataadapter._options.contentType = source.contenttype;
                }
                if (source.async != undefined) {
                    dataadapter._options.async = source.async;
                }
            }

            var updatefromadapter = function (me, type) {
                var getItem = function (record) {
                    var search = null;

                    if (typeof record === 'string') {
                        var label = record;
                        var value = record;
                        var group = '';
                    }
                    else if (me.displayMember != undefined && me.displayMember != "") {
                        var value = record[me.valueMember];
                        var label = record[me.displayMember];
                    }
                    var group = '';
                    
                    if (me.groupMember) {
                        group = record[me.groupMember];
                    }
                    else if (record && record.group != undefined) {
                        group = record.group;
                    }
                    if (me.searchMember) {
                        search = record[me.searchMember];
                    }
                    else if (record && record.searchLabel != undefined) {
                        search = record.searchLabel;
                    }

                    if (!me.valueMember && !me.displayMember) {
                        if ($.type(record) == "string") {
                            label = value = record.toString();
                        }
                    }

                    if (record && record.label != undefined) {
                        var label = record.label;
                    }
                    if (record && record.value != undefined) {
                        var value = record.value;
                    }
                    var checked = false;
                    if (record && record.checked != undefined) {
                        checked = record.checked;
                    }
                    var html = '';
                    if (record && record.html != undefined) {
                        html = record.html;
                    }
                    var visible = true;
                    if (record && record.visible != undefined) {
                        visible = record.visible;
                    }
                    var disabled = false;
                    if (record && record.disabled != undefined) {
                        disabled = record.disabled;
                    }
                    var hasThreeStates = false;
                    if (record && record.hasThreeStates != undefined) {
                        hasThreeStates = record.hasThreeStates;
                    }

                    var listBoxItem = {};
                    listBoxItem.label = label;
                    listBoxItem.value = value;
                    listBoxItem.searchLabel = search;
                    listBoxItem.html = html;
                    listBoxItem.visible = visible;
                    listBoxItem.originalItem = record;
                    listBoxItem.group = group;
                    listBoxItem.groupHtml = '';
                    listBoxItem.disabled = disabled;
                    listBoxItem.checked = checked;
                    listBoxItem.hasThreeStates = hasThreeStates;
                
                    return listBoxItem;
                }

                if (type != undefined) {
                    var dataItem = dataadapter._changedrecords[0];
                    if (dataItem) {
                        $.each(dataadapter._changedrecords, function () {
                            var index = this.index;
                            var item = this.record;
                            if (type != 'remove') {
                                var mapItem = getItem(item);
                            }

                            switch (type) {
                                case "update":
                                    me.updateAt(mapItem, index);
                                    break;
                                case "add":
                                    me.insertAt(mapItem, index);
                                    break;
                                case "remove":
                                    me.removeAt(index);
                                    break;
                            }
                        });
                        return;
                    }
                }

                me.records = dataadapter.records;
                var recordslength = me.records.length;
                var items = new Array();
                for (var i = 0; i < recordslength; i++) {
                    var record = me.records[i];
                    var listBoxItem = getItem(record);
                    listBoxItem.index = i;
                    items[i] = listBoxItem;
                }
                me.items = me.loadItems(items, true);
                me._render();
                me._raiseEvent('6');
            }

            initadapter(this);

            var me = this;
            switch (source.datatype) {
                case "local":
                case "array":
                default:
                    if (source.localdata != null || $.isArray(source)) {
                        dataadapter.unbindBindingUpdate(this.element.id);
                        if (this.autoBind || (!this.autoBind && !initialRefresh)) {
                            dataadapter.dataBind();
                        }
                        updatefromadapter(this);
                        dataadapter.bindBindingUpdate(this.element.id, function (updatetype) {
                            updatefromadapter(me, updatetype);
                        });
                    }
                    break;
                case "json":
                case "jsonp":
                case "xml":
                case "xhtml":
                case "script":
                case "text":
                case "csv":
                case "tab":
                    {
                        if (source.localdata != null) {
                            dataadapter.unbindBindingUpdate(this.element.id);
                            if (this.autoBind || (!this.autoBind && !initialRefresh)) {
                                dataadapter.dataBind();
                            }
                            updatefromadapter(this);
                            dataadapter.bindBindingUpdate(this.element.id, function () {
                                updatefromadapter(me);
                            });
                            return;
                        }

                        var postdata = {};
                        if (dataadapter._options.data) {
                            $.extend(dataadapter._options.data, postdata);
                        }
                        else {
                            if (source.data) {
                                $.extend(postdata, source.data);
                            }
                            dataadapter._options.data = postdata;
                        }
                        var updateFunc = function () {
                            updatefromadapter(me);
                        }

                        dataadapter.unbindDownloadComplete(me.element.id);
                        dataadapter.bindDownloadComplete(me.element.id, updateFunc);


                        if (this.autoBind || (!this.autoBind && !initialRefresh)) {
                            dataadapter.dataBind();
                        }
                    }
            }
        },

        loadItems: function (items, adapter) {
            if (items == null) {
                this.groups = new Array();
                this.items = new Array();
                this.visualItems = new Array();
                return;
            }

            var self = this;
            var index = 0;
            var length = 0;
            var itemIndex = 0;
            this.groups = new Array();
            this.items = new Array();
            this.visualItems = new Array();
            var listItems = new Array();
            this.itemsByValue = new Array();

            $.map(items, function (item) {
                if (item == undefined)
                    return null;

                var listBoxItem = new $.jqx._jqxListBox.item();
                var group = item.group;
                var groupHtml = item.groupHtml;
                var title = item.title;
                var search = null;

                if (self.searchMember) {
                    search = item[self.searchMember];
                }
                else if (item && item.searchLabel != undefined) {
                    search = item.searchLabel;
                }


                if (title == null || title == undefined) {
                    title = '';
                }

                if (group == null || group == undefined) {
                    group = '';
                }
                if (self.groupMember) {
                    group = item[self.groupMember];
                }
                if (groupHtml == null || groupHtml == undefined) {
                    groupHtml = '';
                }

                if (!self.groups[group]) {
                    self.groups[group] = { items: new Array(), index: -1, caption: group, captionHtml: groupHtml };
                    index++;

                    var groupID = index + 'jqxGroup';
                    self.groups[groupID] = self.groups[group];
                    length++;
                    self.groups.length = length;
                }

                var uniqueGroup = self.groups[group];
                uniqueGroup.index++;
                uniqueGroup.items[uniqueGroup.index] = listBoxItem;

                if (typeof item === "string") {
                    listBoxItem.label = item;
                    listBoxItem.value = item;
                    if (arguments.length > 1 && arguments[1] && $.type(arguments[1]) == "string") {
                        listBoxItem.label = item;
                        listBoxItem.value = arguments[1];
                    }
                }
                else if (item.label == null && item.value == null && item.html == null && item.group == null && item.groupHtml == null) {
                    listBoxItem.label = item.toString();
                    listBoxItem.value = item.toString();
                }
                else {
                    listBoxItem.label = item.label;
                    listBoxItem.value = item.value;

                    if (listBoxItem.label === undefined)
                        listBoxItem.label = item.value;
                    if (listBoxItem.value === undefined)
                        listBoxItem.value = item.label;
                }

                if (typeof item != "string") {
                    if (item.label === undefined) {
                        if (self.displayMember != "") {
                            if (item[self.displayMember] != undefined) {
                                listBoxItem.label = item[self.displayMember];
                            }
                            else listBoxItem.label = "";
                        }
                    }

                    if (item.value === undefined) {
                        if (self.valueMember != "") {
                            listBoxItem.value = item[self.valueMember];
                        }
                    }
                }

                listBoxItem.hasThreeStates = item.hasThreeStates != undefined ? item.hasThreeStates : true;
                listBoxItem.originalItem = item;
                if (adapter) {
                    listBoxItem.originalItem = item.originalItem;
                }

                listBoxItem.title = title;
                if (title && listBoxItem.value === undefined && listBoxItem.label === undefined) {
                    listBoxItem.value = listBoxItem.label = title;
                }
                listBoxItem.html = item.html || '';
                if (item.html && item.html != '') {
                    //     listBoxItem.label = listBoxItem.value = item.html;
                    if (title && title != '') {
                        //           listBoxItem.label = listBoxItem.value = title;
                    }
                }

                listBoxItem.group = group;
                listBoxItem.checked = item.checked || false;
                listBoxItem.groupHtml = item.groupHtml || '';
                listBoxItem.disabled = item.disabled || false;
                listBoxItem.visible = item.visible != undefined ? item.visible : true;
                listBoxItem.searchLabel = search;
                listBoxItem.index = itemIndex;
                listItems[itemIndex] = listBoxItem;
                itemIndex++;
                return listBoxItem;
            });

            var itemsArray = new Array();
            var uniqueItemIndex = 0;

            if (this.fromSelect == undefined || this.fromSelect == false) {
                for (var indx = 0; indx < length; indx++) {
                    var index = indx + 1;
                    var groupID = index + 'jqxGroup';
                    var group = this.groups[groupID];
                    if (group == undefined || group == null)
                        break;

                    if (indx == 0 && group.caption == '' && group.captionHtml == '' && length <= 1) {
                        for (var i = 0; i < group.items.length; i++) {
                            var key = group.items[i].value;
                            if (group.items[i].value == undefined || group.items[i].value == null) key = i;
                            this.itemsByValue[$.trim(key).split(" ").join("?")] = group.items[i];
                        }
                        return group.items;
                    }
                    else {
                        var listBoxItem = new $.jqx._jqxListBox.item();
                        listBoxItem.isGroup = true;
                        listBoxItem.label = group.caption;
                        if (group.caption == '' && group.captionHtml == '') {
                            group.caption = this.emptyGroupText;
                            listBoxItem.label = group.caption;
                        }

                        listBoxItem.html = group.captionHtml;
                        itemsArray[uniqueItemIndex] = listBoxItem;

                        uniqueItemIndex++;
                    }

                    for (var j = 0; j < group.items.length; j++) {
                        itemsArray[uniqueItemIndex] = group.items[j];
                        var key = group.items[j].value;
                        if (group.items[j].value == "" || group.items[j].value == null) key = uniqueItemIndex;
                        self.itemsByValue[$.trim(key).split(" ").join("?")] = group.items[j];

                        uniqueItemIndex++;

                    }
                }
            }
            else {
                var uniqueItemIndex = 0;
                var checkedGroups = new Array();

                $.each(listItems, function () {
                    if (!checkedGroups[this.group]) {
                        if (this.group != '') {
                            var listBoxItem = new $.jqx._jqxListBox.item();
                            listBoxItem.isGroup = true;
                            listBoxItem.label = this.group;
                            itemsArray[uniqueItemIndex] = listBoxItem;
                            uniqueItemIndex++;
                            checkedGroups[this.group] = true;
                        }
                    }

                    itemsArray[uniqueItemIndex] = this;
                    var key = this.value;
                    if (this.value == "" || this.value == null) key = uniqueItemIndex - 1;
                    self.itemsByValue[$.trim(key).split(" ").join("?")] = this;

                    uniqueItemIndex++;
                });
            }

            return itemsArray;
        },

        _mapItem: function (item) {
            var listBoxItem = new $.jqx._jqxListBox.item();
            if (this.displayMember) {
                if (item.label == undefined) {
                    item.label = item[this.displayMember];
                }
                if (item.value == undefined) {
                    item.value = item[this.valueMember];
                }
            }

            if (typeof item === "string") {
                listBoxItem.label = item;
                listBoxItem.value = item;
            }
            else if (typeof item === 'number') {
                listBoxItem.label = item.toString();
                listBoxItem.value = item.toString();
            }
            else {
                listBoxItem.label = item.label !== undefined ? item.label : item.value;
                listBoxItem.value = item.value !== undefined ? item.value : item.label;
            }
            if (listBoxItem.label == undefined && listBoxItem.value == undefined && listBoxItem.html == undefined) {
                listBoxItem.label = listBoxItem.value = item;
            }

            listBoxItem.html = item.html || '';
            listBoxItem.group = item.group || '';
            listBoxItem.checked = item.checked || false;
            listBoxItem.title = item.title || '';
            listBoxItem.groupHtml = item.groupHtml || '';
            listBoxItem.disabled = item.disabled || false;
            listBoxItem.visible = item.visible || true;
            return listBoxItem;
        },

        // adds a new item.
        addItem: function (item) {
            return this.insertAt(item, this.items ? this.items.length : 0);
        },

        _getItemByParam: function (item) {
            if (item != null) {
                if (item.index == undefined) {
                    var newItem = this.getItemByValue(item);
                    if (newItem) item = newItem;
                }
            }
            return item;
        },

        insertItem: function (item, index) {
            var newItem = this._getItemByParam(item);
            return this.insertAt(newItem, index);
        },

        updateItem: function (item, oldItem) {
            var oldItemIndx = this._getItemByParam(oldItem);
            if (oldItemIndx && oldItemIndx.index != undefined) {
                return this.updateAt(item, oldItemIndx.index);
            }
            return false;
        },

        updateAt: function (item, index) {
            if (item != null) {
                var listBoxItem = this._mapItem(item);
                this.itemsByValue[$.trim(listBoxItem.value).split(" ").join("?")] = this.items[index];

                this.items[index].value = listBoxItem.value;
                this.items[index].label = listBoxItem.label;
                this.items[index].html = listBoxItem.html;
                this.items[index].disabled = listBoxItem.disabled;
                this._raiseEvent('9', { item: this.items[index] });

            }
            this._cachedItemHtml = [];
            this._renderItems();
            if (this.rendered) {
                this.rendered();
            }
        },

        // inserts an item at a specific position.
        insertAt: function (item, index) {
            if (item == null)
                return false;

            this._cachedItemHtml = [];
            if (this.items == undefined || this.items.length == 0) {
                this.source = new Array();
                this.refresh();
                var listBoxItem = this._mapItem(item);
                listBoxItem.index = 0;
                this.items[this.items.length] = listBoxItem;
                this._addItems(true);
                this._renderItems();
                if (this.rendered) {
                    this.rendered();
                }
                if (this.allowDrag && this._enableDragDrop) {
                    this._enableDragDrop();
                }
                var key = listBoxItem.value;
                if (listBoxItem.value == "" || listBoxItem.value == null) key = index;
                this.itemsByValue[$.trim(key).split(" ").join("?")] = listBoxItem;

                return false;
            }

            var listBoxItem = this._mapItem(item);
            if (index == -1 || index == undefined || index == null || index >= this.items.length) {
                listBoxItem.index = this.items.length;
                this.items[this.items.length] = listBoxItem;
            }
            else {
                var itemsArray = new Array();
                var currentItemIndex = 0;
                var inserted = false;
                var visualItemIndex = 0;
                for (var itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
                    if (this.items[itemIndex].isGroup == false) {
                        if (visualItemIndex >= index && !inserted) {
                            itemsArray[currentItemIndex++] = listBoxItem;
                            listBoxItem.index = index;
                            visualItemIndex++;
                            inserted = true;
                        }
                    }

                    itemsArray[currentItemIndex] = this.items[itemIndex];
                    if (!this.items[itemIndex].isGroup) {
                        itemsArray[currentItemIndex].index = visualItemIndex;
                        visualItemIndex++;
                    }
                    currentItemIndex++;
                }

                this.items = itemsArray;
            }

            var key = listBoxItem.value;
            if (listBoxItem.value == "" || listBoxItem.value == null) key = index;
            this.itemsByValue[$.trim(key).split(" ").join("?")] = listBoxItem;

            this.visibleItems = new Array();
            this.renderedVisibleItems = new Array();
            var vScrollInstance = $.data(this.vScrollBar[0], 'jqxScrollBar').instance;
            var value = vScrollInstance.value;
            vScrollInstance.setPosition(0);
            if ((this.allowDrag && this._enableDragDrop) || (this.virtualSize && this.virtualSize.height < 10 + this.host.height())) {
                this._addItems(true);
            }
            else {
                this._addItems(false);
            }

            if (this.groups.length > 1) {
            }

            this._renderItems();
            if (this.allowDrag && this._enableDragDrop) {
                this._enableDragDrop();
            }
            vScrollInstance.setPosition(value);

            this._raiseEvent('7', { item: listBoxItem });

            if (this.rendered) {
                this.rendered();
            }
            return true;
        },

        // removes an item from a specific position.
        removeAt: function (index) {
            if (index < 0 || index > this.items.length - 1)
                return false;
            if (index == undefined)
                return false;

            var itemHeight = this.items[index].height;
            var key = this.items[index].value;
            if (key == "" || key == null) key = index;
            this.itemsByValue[$.trim(key).split(" ").join("?")] = null;
            var listBoxItem = this.items[index];
            if (this.groups.length > 1) {
                var nonGroups = new Array();
                for (var itemIndex = 0; itemIndex < this.items.length; itemIndex++) { 
                    if (!this.items[itemIndex].isGroup) {
                        nonGroups.push({ item: this.items[itemIndex], key: itemIndex });
                    }
                }
                if (nonGroups[index]) {
                    this.items.splice(nonGroups[index].key, 1);
                }
                else return false;
            }
            else {
                this.items.splice(index, 1);
            }
            var itemsArray = new Array();
            var currentItemIndex = 0;
            var inserted = false;
            var visualItemIndex = 0;
            for (var itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
                itemsArray[currentItemIndex] = this.items[itemIndex];
                if (!this.items[itemIndex].isGroup) {
                    itemsArray[currentItemIndex].index = visualItemIndex;
                    visualItemIndex++;
                }
                currentItemIndex++;
            }

            this.items = itemsArray;

            var vScrollInstance = $.data(this.vScrollBar[0], 'jqxScrollBar').instance;
            var vScrollInstance = $.data(this.vScrollBar[0], 'jqxScrollBar').instance;
            var value = vScrollInstance.value;
            vScrollInstance.setPosition(0);

            this.visibleItems = new Array();
            this.renderedVisibleItems = new Array();
            if (this.items.length > 0) {
                if (this.virtualSize) {
                    this.virtualSize.height -= itemHeight;
                    var virtualItemsCount = this.virtualSize.itemsPerPage * 2;
                    if (this.autoHeight) {
                        virtualItemsCount = this.items.length;
                    }

                    this.virtualItemsCount = Math.min(virtualItemsCount, this.items.length);
                }

                this._updatescrollbars();
            }
            else {
                this._addItems();
            }
            this._renderItems();
            if (this.allowDrag && this._enableDragDrop) {
                this._enableDragDrop();
            }
            if (this.vScrollBar.css('visibility') != 'hidden') {
                vScrollInstance.setPosition(value);
            }
            else {
                vScrollInstance.setPosition(0);
            }
            this.itemsByValue = new Array();
            for (var i = 0; i < this.items.length; i++) {
                var key = this.items[i].value;
                if (this.items[i].value == "" || this.items[i].value == null) key = i;
                this.itemsByValue[$.trim(key).split(" ").join("?")] = this.items[i];
            }
            this._raiseEvent('8', { item: listBoxItem });

            if (this.rendered) {
                this.rendered();
            }

            return true;
        },

        removeItem: function (item, removed) {
            var newItem = this._getItemByParam(item);
            var index = -1;
            if (newItem && newItem.index != undefined && removed !== true) {
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].label == newItem.label && this.items[i].value == newItem.value) {
                        index = i;
                        break;
                    }
                }
                if (index != -1)
                    return this.removeAt(index);
            }
            if (index == -1) {
                return this.removeAt(newItem.index);
            }
        },

        // gets all items.
        getItems: function () {
            return this.items;
        },

        disableItem: function (item) {
            var newItem = this._getItemByParam(item);
            this.disableAt(newItem.index);
        },

        enableItem: function (item) {
            var newItem = this._getItemByParam(item);
            this.enableAt(newItem.index);
        },

        // disables an item at position.
        disableAt: function (index) {
            if (!this.items)
                return false;

            if (index < 0 || index > this.items.length - 1)
                return false;

            this.items[index].disabled = true;
            this._renderItems();
            return true;
        },

        // enables an item at position.
        enableAt: function (index) {
            if (!this.items)
                return false;

            if (index < 0 || index > this.items.length - 1)
                return false;

            this.items[index].disabled = false;
            this._renderItems();
            return true;
        },

        destroy: function () {
            if (this.source && this.source.unbindBindingUpdate) {
                this.source.unbindBindingUpdate(this.element.id);
            }

            this._removeHandlers();
            this.vScrollBar.jqxScrollBar('destroy');
            this.hScrollBar.jqxScrollBar('destroy');
            this.vScrollBar.remove();
            this.hScrollBar.remove();
            this.content.remove();
            $.jqx.utilities.resize(this.host, null, true);

            var vars = $.data(this.element, "jqxListBox");
            delete this.hScrollInstance;
            delete this.vScrollInstance;
            delete this.vScrollBar;
            delete this.hScrollBar;
            delete this.content;
            delete this.bottomRight;
            delete this.itemswrapper;
            delete this.visualItems;
            delete this.visibleItems;
            delete this.items;
            delete this.groups;
            delete this.renderedVisibleItems;
            delete this._mousewheelfunc;
            delete this._mousemovefunc;
            delete this._cachedItemHtml;
            delete this.itemsByValue;
            delete this._activeElement;
            delete this.source;
            delete this.events;

            if (this.input) {
                this.input.remove();
                delete this.input;
            }
            if (vars) {
                delete vars.instance;
            }
            this.host.removeData();
            this.host.removeClass();
            this.host.remove();
            this.element = null;
            delete this.element;
            this.host = null;
            delete this.set;
            delete this.get;
            delete this.call;
            delete this.host;
        },

        _raiseEvent: function (id, arg) {
            if (this._stopEvents == true)
                return true;

            if (arg == undefined)
                arg = { owner: null };

            var evt = this.events[id];
            args = arg;
            args.owner = this;
            this._updateInputSelection();
            var event = new $.Event(evt);
            event.owner = this;
            event.args = args;
            if (this.host != null) {
                var result = this.host.trigger(event);
            }
            return result;
        }
    })
})(jqxBaseFramework);

(function ($) {
    $.jqx.parseSourceTag = function (field) {
        var items = new Array();
        var options = $(field).find('option');
        var groups = $(field).find('optgroup');
        var ul = false;
        if (options.length === 0) {
            options = $(field).find('li');
            if (options.length > 0) {
                ul = true;
            }
        }

        var selectedOption = null;
        var index = 0;
        var selectedOption = -1;
        var that = this;
        var groupsArray = new Array();

        $.each(options, function (index) {
            var hasGroup = groups.find(this).length > 0;
            var group = null;

            if (this.text != null && (this.label == null || this.label == '')) {
                this.label = this.text;
            }
            if (ul === true) {
                this.label = $(this).text();
                this.selected = $(this).attr('data-selected');
                this.checked = this.selected;
                this.value = $(this).attr('data-value') || index;
                this.disabled = $(this).attr('disabled');
            }

            var item = { style: this.style.cssText, selected: this.selected, html: this.innerHTML, classes: this.className, disabled: this.disabled, value: this.value, label: this.label, title: this.title, originalItem: this };

            var ie7 = $.jqx.browser.msie && $.jqx.browser.version < 8;
            if (ie7 && !ul) {
                if (item.value == '' && this.text != null && this.text.length > 0) {
                    item.value = this.text;
                }
            }

            if (hasGroup) {
                group = groups.find(this).parent()[0].label;
                item.group = group;
                if (!groupsArray[group]) {
                    groupsArray[group] = new Array();
                    groupsArray.length++;
                }
                groupsArray[group].push(item);
            }

            if (this.selected) {
                selectedOption = index;
            }
            item.checked = this.selected;
            if (item.label !== undefined) {
                items.push(item);
            }
        });
        if (groupsArray.length > 0) {
            var groupItems = new Array();
            for (var obj in groupsArray) {
                if (obj === "indexOf") continue;

                var originalItem = null;
                for (var i = 0; i < groups.length; i++) {
                    if (obj === groups[i].label || groups[i].text) {
                        originalItem = groups[i];
                        break;
                    }
                }

                $.each(groupsArray[obj], function (index, value) {
                    if (this.label !== undefined) {
                        groupItems.push(this);
                    }
                });
            };
        }

        if (groupItems && groupItems.length > 0) {
            return { items: groupItems, index: selectedOption };
        }
        else {
            return { items: items, index: selectedOption };
        }
    }

    $.jqx._jqxListBox.item = function () {
        var result =
        {
            group: '',
            groupHtml: '',
            selected: false,
            isGroup: false,
            highlighted: false,
            value: null,
            label: '',
            html: null,
            visible: true,
            disabled: false,
            element: null,
            width: null,
            height: null,
            initialTop: null,
            top: null,
            left: null,
            title: '',
            index: -1,
            checkBoxElement: null,
            originalItem: null,
            checked: false,
            visibleIndex: -1
        }
        return result;
    }
})(jqxBaseFramework);

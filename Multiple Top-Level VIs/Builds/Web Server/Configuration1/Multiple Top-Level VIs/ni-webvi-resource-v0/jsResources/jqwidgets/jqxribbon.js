/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {
    'use strict';

    $.jqx.jqxWidget('jqxRibbon', '', {});

    $.extend($.jqx._jqxRibbon.prototype, {

        defineInstance: function () {
            var settings = {
                //// properties
                width: null,
                height: 'auto',
                mode: 'default', // possible values: 'default', 'popup'
                position: 'top', // possible values: 'top', 'bottom', 'left', 'right'
                selectedIndex: -1,
                selectionMode: 'click', // possible values: 'click', 'hover', 'none'
                popupCloseMode: 'click', // possible values: 'click', 'mouseLeave', 'none'
                animationType: 'fade', // possible values: 'fade', 'slide', 'none'
                animationDelay: 400,
                scrollPosition: 'both', // possible values: 'near', 'far', 'both'
                disabled: false,
                rtl: false,
                scrollStep: 10,
                scrollDelay: 30,
                reorder: false,
                initContent: null, // callback function
                _roundedCorners: true,
                _removeByDrag: false,
                _suppressReorder: true,

                //// events
                events: ['select', 'unselect', 'change', '_removeByDrag', 'reorder']
            };

            $.extend(true, this, settings);
        },

        createInstance: function () {
            var that = this;
            if (that.host.css('display') === 'none' || document.body.contains(that.element) === false) {
                that._initiallyHidden = true;
            }
            // browser-specific settings
            that._browser = $.jqx.browser;

            if (that.mode !== 'popup' && that.selectedIndex === -1) {
                that.selectedIndex = 0;
            }

            that._originalHTML = that.element.innerHTML;

            // renders the widget
            that._render(true);
        },

        //// methods

        // public methods

        // renders the widget
        render: function () {
            this._render();
        },

        // refreshes the widget
        refresh: function (initialRefresh) {
            if (initialRefresh !== true) {
                this._render();
            }
        },

        // destroys the widget
        destroy: function () {
            var that = this;

            that._removeHandlers();
            that.host.remove();
        },

        // selects an item
        selectAt: function (index) {
            this._selectAt(index);
        },

        // unselects the selected item and collapses its content
        clearSelection: function () {
            if (this.selectedIndex !== -1) {
                this._clearSelection();
            }
        },

        // disables an item
        disableAt: function (index) {
            var that = this;

            that._items[index]._disabled = true;
            $(that._items[index]).addClass(that.toThemeProperty('jqx-fill-state-disabled'));

            if (index === that.selectedIndex) {
                that._clearSelection();
            }
        },

        // enables an item
        enableAt: function (index) {
            var that = this;

            that._items[index]._disabled = false;
            $(that._items[index]).removeClass(that.toThemeProperty('jqx-fill-state-disabled'));
        },

        // hides an item
        hideAt: function (index) {
            var that = this;

            that._items[index].style.display = 'none';
            that._checkScrollButtons();

            if (index === that.selectedIndex) {
                that._clearSelection();
            } else {
                that._updatePositions();
            }
        },

        // shows an item
        showAt: function (index) {
            var that = this;

            if (that._orientation === 'horizontal') {
                that._items[index].style.display = 'inline-block';
            } else {
                that._items[index].style.display = 'inherit';
            }
            that._checkScrollButtons();
            that._updatePositions();
        },

        // sets or gets the selected index
        val: function (index) {
            var that = this;

            if (index) {
                that._selectAt(index);
            } else {
                return that.selectedIndex;
            }
        },

        // adds a new item
        addAt: function (index, data) {
            var that = this,
                titleClass = 'jqx-ribbon-item jqx-ribbon-item-' + that.position,
                contentClass = 'jqx-widget-content jqx-ribbon-content-section jqx-ribbon-content-section-' + that.position;

            that._removeHandlers();

            var newItemTitle = document.createElement('li');
            newItemTitle.innerHTML = data.title;
            var newItemContent = document.createElement('div');
            if (typeof data.content === 'string') {
                newItemContent.innerHTML = data.content;
            } else {
                if (data.content.length !== undefined) {
                    try {
                        if (jQuery !== undefined && data.content instanceof jQuery) {
                            $(newItemContent).append(data.content);
                        } else {
                            if ($.isArray(data.content)) {
                                for (var i = 0; i < data.content.length; i++) {
                                    data.content[i].appendTo(newItemContent);
                                }
                            } else {
                                while (data.content.length > 0) {
                                    newItemContent.appendChild(data.content[0]);
                                }
                            }
                        }
                    } catch (error) { }
                } else {
                    newItemContent.appendChild(data.content);
                }
            }
            switch (that.position) {
                case 'top':
                    titleClass += ' jqx-rc-t';
                    contentClass += ' jqx-rc-b';
                    break;
                case 'bottom':
                    titleClass += ' jqx-rc-b';
                    contentClass += ' jqx-rc-t';
                    break;
                case 'left':
                    titleClass += ' jqx-rc-l';
                    contentClass += ' jqx-rc-r';
                    break;
                case 'right':
                    titleClass += ' jqx-rc-r';
                    contentClass += ' jqx-rc-l';
                    break;
            }
            if (that.mode === 'popup') {
                contentClass += ' jqx-ribbon-content-section-popup jqx-ribbon-content-section-' + that._orientation + '-popup';
            }
            if (that.rtl === true) {
                titleClass += ' jqx-ribbon-item-rtl';
            }

            newItemTitle.className = that.toThemeProperty(titleClass);
            newItemContent.className = that.toThemeProperty(contentClass);

            if (that._items.length - 1 >= index) {
                that._headerElement.insertBefore(newItemTitle, that._items[index]);
                that._contentElement.insertBefore(newItemContent, that._contentSections[index]);
            } else {
                that._headerElement.appendChild(newItemTitle);
                that._contentElement.appendChild(newItemContent);
            }

            that._updateItems();
            that._addHandlers();
            that._checkScrollButtons();

            if (index <= that.selectedIndex && that.selectedIndex < that._items.length - 1) {
                that.selectedIndex++;
            }
            that._updatePositions();
            if (that.selectedIndex < 0) {
                return;
            }
            that._suppressSelectionEvents = true;
            that._selectAt(that.selectedIndex, that.selectedIndex, true);
        },

        // removes an item
        removeAt: function (index) {
            var that = this;
            if (index === that.selectedIndex) {
                that._clearSelection();
            }

            $(that._items[index]).remove();
            $(that._contentSections[index]).remove();
            that._updateItems(true);
            that._updatePositions();
            that._checkScrollButtons();
        },

        // updates an item
        updateAt: function (index, newData) {
            var that = this,
                item = that._items[index];

            item.innerHTML = newData.newTitle;
            that._contentSections[index].innerHTML = newData.newContent;
            item._isInitialized = false;
            if (that.initContent && index === that.selectedIndex) {
                that.initContent(index);
                item._isInitialized = true;
            }
            that._updatePositions();
        },

        // sets the layout of an item's content if mode is set to "popup"
        setPopupLayout: function (index, layout, width, height) {
            var that = this,
                currentContentSection = that._contentSections[index];

            if (that.mode === 'popup') {
                if (!currentContentSection.getAttribute('data-width')) {
                    if (currentContentSection.style.width) {
                        currentContentSection.setAttribute('data-width', currentContentSection.style.width);
                    }
                    if (currentContentSection.style.height) {
                        currentContentSection.setAttribute('data-height', currentContentSection.style.height);
                    }
                }

                if (width) {
                    currentContentSection.style.width = that._toPx(width);
                }
                if (height) {
                    currentContentSection.style.height = that._toPx(height);
                }
                currentContentSection._layout = layout;
                that._positionContent(index);
            }
        },

        propertiesChangedHandler: function (object, oldValues, newValues) {
            if (newValues && newValues.width && newValues.height && Object.keys(newValues).length === 2) {
                object.element.style.width = object._toPx(object.width);
                object.element.style.height = object._toPx(object.height);
                object._updateSize();
            }
        },

        // private methods

        // called when a property is changed
        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length === 2) {
                return;
            }

            if (value !== oldvalue) {
                switch (key) {
                    case 'width':
                    case 'height':
                        object.element.style[key] = object._toPx(value);
                        object._updateSize();
                        break;
                    case 'position':
                        object._render();
                        break;
                    case 'mode':
                        object._contentElement.style.width = 'auto';
                        object._removeHandlers(null, oldvalue);
                        object._render();
                        break;
                    case 'selectedIndex':
                        object._selectAt(value, oldvalue);
                        break;
                    case 'selectionMode':
                        object._removeHandlers(oldvalue);
                        object._addHandlers();
                        break;
                    case 'scrollPosition':
                        var scrollButtonNear = object._scrollButtonNear;
                        var scrollButtonFar = object._scrollButtonFar;
                        $(scrollButtonNear).removeClass(object.toThemeProperty('jqx-ribbon-scrollbutton-' + oldvalue + ' jqx-rc-tr jqx-rc-bl jqx-rc-tl'));
                        $(scrollButtonFar).removeClass(object.toThemeProperty('jqx-ribbon-scrollbutton-' + oldvalue + ' jqx-rc-tr jqx-rc-bl jqx-rc-br'));
                        scrollButtonNear.className += ' ' + object.toThemeProperty('jqx-ribbon-scrollbutton-' + value);
                        scrollButtonFar.className += ' ' + object.toThemeProperty('jqx-ribbon-scrollbutton-' + value);
                        object._scrollButtonRc(scrollButtonNear, scrollButtonFar);
                        object._checkScrollButtons();
                        object._updatePositions();
                        break;
                    case 'disabled':
                        if (value === true) {
                            object._removeHandlers();
                            object.element.className += ' ' + object.toThemeProperty('jqx-fill-state-disabled');
                        } else {
                            object.host.removeClass(object.toThemeProperty('jqx-fill-state-disabled'));
                            object._addHandlers();
                        }
                        break;
                    case 'theme':
                        $.jqx.utilities.setTheme(oldvalue, value, object.host);
                        break;
                    case 'rtl':
                        if (value === true) {
                            object._headerElement.className += ' ' + object.toThemeProperty('jqx-ribbon-header-rtl');
                            for (var i = 0; i < object._items.length; i++) {
                                object._items[i].className += ' ' + object.toThemeProperty('jqx-ribbon-item-rtl');
                            }
                        } else {
                            object._header.removeClass(object.toThemeProperty('jqx-ribbon-header-rtl'));
                            for (var j = 0; j < object._items.length; j++) {
                                $(object._items[j]).removeClass(object.toThemeProperty('jqx-ribbon-item-rtl'));
                            }
                        }
                        object._positionSelectionToken(object.selectedIndex);
                        break;
                }
            }
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

        // renders the widget
        _render: function (initialization) {
            var that = this;

            if (initialization !== true) {
                that._removeHandlers();
                //        that.host.html(that._originalHTML);
            }

            that._selectionTokenOffsetY = 0;
            switch (that._browser.browser) {
                case 'mozilla':
                    that._browserWidthRtlFlag = 0;
                    that._browserScrollRtlFlag = 1;
                    that._selectionTokenOffsetX = 1;
                    break;
                case 'msie':
                    that._browserWidthRtlFlag = 0;
                    that._browserScrollRtlFlag = -1;
                    if (that._browser.version === '8.0') {
                        that._selectionTokenOffsetX = 1;
                    } else if (that._browser.version === '7.0') {
                        that._selectionTokenOffsetX = 0;
                        if (that.mode === 'popup' && (that.position === 'bottom' || that.position === 'right')) {
                            that._selectionTokenOffsetY = 2;
                        }
                    } else {
                        that._selectionTokenOffsetX = 0;
                    }
                    break;
                default:
                    that._browserWidthRtlFlag = 1;
                    that._browserScrollRtlFlag = 1;
                    that._selectionTokenOffsetX = 0;
            }

            if (initialization === true) {
                var children = that.host.children();
                that._headerElement = children[0];
                that._header = $(children[0]);
                that._contentElement = children[1];
                that._content = $(children[1]);
                // checks if the widget's HTML structure is correct
                that._checkStructure(children);
            }

            that._headerElement.style['float'] = 'none';
            that._contentElement.style.padding = '0px';
            that.element.style.width = that._toPx(that.width);
            that.element.style.height = that._toPx(that.height);

            if (that.position === 'bottom' || that.position === 'right') {
                that.element.insertBefore(that._contentElement, that._headerElement); // changes the places of the header and content in the DOM
            }

            if (that.position === 'top' || that.position === 'bottom') {
                that._orientation = 'horizontal';
            } else {
                that._orientation = 'vertical';
            }
            if (that.position === 'right') {
                that._headerElement.style['float'] = 'right';
            }
            else if (that.position === 'left') {
                that._headerElement.style['float'] = 'left';
            }

            that._contentSections = that._content.children();

            $.each(that._contentSections, function () {
                if (this.getAttribute('data-width')) {
                    this.style.width = this.getAttribute('data-width');
                    this.style.height = this.getAttribute('data-height');
                    this.removeAttribute('data-width');
                    this.removeAttribute('data-height');
                }
            });

            if (initialization === true) {
                that._selectionToken = document.createElement('div');
                that._selectionToken.className = that.toThemeProperty('jqx-widget-content jqx-ribbon-selection-token jqx-ribbon-selection-token-' + that.position);
                that.element.appendChild(that._selectionToken);
            }
            // makes a jQuery selection of all items and their content and sets their indexes
            that._updateItems();

            if (that._initiallyHidden !== true) {
                // adds the required CSS classes to the widget's elements
                that._addClasses();
            }

            if (initialization === true) {
                // appends scroll buttons
                that._appendScrollButtons();
                that._checkScrollButtons();
            }
            that._allowSelection = true;

            // display initial item
            if (that.selectedIndex !== -1) {
                that._items[that.selectedIndex].className += ' ' + that.toThemeProperty('jqx-widget-content jqx-ribbon-item-selected');
                that._positionSelectionToken(that.selectedIndex);
                that._contentSections[that.selectedIndex].style.display = 'block';
                if (that.initContent) {
                    that.initContent(that.selectedIndex);
                    that._items[that.selectedIndex]._isInitialized = true;
                }
            }

            if (!that.disabled) {
                // adds event handlers
                that._addHandlers();
            } else {
                that.element.className += ' ' + that.toThemeProperty('jqx-fill-state-disabled');
            }

            $.jqx.utilities.resize(that.host, function () {
                if (that._initiallyHidden) {
                    that._initiallyHidden = false;
                    that._addClasses();
                    if (that.selectedIndex !== -1) {
                        that._items[that.selectedIndex].className += ' ' + that.toThemeProperty('jqx-widget-content jqx-ribbon-item-selected');
                    }
                }
                that._updateSize(true);
            });
        },

        _updateSize: function (resize) {
            var that = this;
            if (that._browser.version === '7.0' && that._browser.browser === 'msie') {
                if (that._orientation === 'horizontal') {
                    that._header.css('width', (that.host.width() - parseInt(that._header.css('padding-left'), 10) - parseInt(that._header.css('padding-right'), 10) - parseInt(that._header.css('border-left-width'), 10) - parseInt(that._header.css('border-right-width'), 10)));
                    that._contentSections.width(that._content.width() - parseInt(that._contentSections.css('border-left-width'), 10) - parseInt(that._contentSections.css('border-right-width'), 10) - parseInt(that._contentSections.css('padding-left'), 10) - parseInt(that._contentSections.css('padding-right'), 10));
                    if (that.mode === 'default' && typeof that.height === 'string' && that.height.indexOf('%') !== -1) {
                        that._contentSections.height(that._content.height() - that._header.height() - parseInt(that._contentSections.css('border-bottom-width'), 10) - parseInt(that._contentSections.css('border-top-width'), 10) - 1);
                    }
                } else {
                    that._header.css('height', (that.host.height() - parseInt(that._header.css('padding-top'), 10) - parseInt(that._header.css('padding-bottom'), 10) - parseInt(that._header.css('border-top-width'), 10) - parseInt(that._header.css('border-bottom-width'), 10)));
                    that._contentSections.height(that._content.height() - parseInt(that._contentSections.css('border-top-width'), 10) - parseInt(that._contentSections.css('border-bottom-width'), 10) - parseInt(that._contentSections.css('padding-top'), 10) - parseInt(that._contentSections.css('padding-bottom'), 10));
                    if (that.mode === 'default' && typeof that.width === 'string' && that.height.indexOf('%') !== -1) {
                        var borders = that.position === 'left' ? parseInt(that._contentSections.css('border-left-width'), 10) + parseInt(that._contentSections.css('border-right-width'), 10) + 1 : 0;
                        that._contentSections.width(that._content.width() - that._header.width() - borders);
                    }
                }
            }
            that._checkScrollButtons(true);
            that._updatePositions(undefined, resize);
            if (that.mode === 'popup') {
                that._positionPopup();
            }
        },

        _stopAnimation: function () {
            var that = this;

            if (!that._allowSelection) {
                that.selectedIndex = that._animatingIndex;
                var contentSectionHelper = $(that._contentSections[that._animatingIndex]);
                that._initAnimate(contentSectionHelper);
                contentSectionHelper.animate('finish');
                that._clearSelection(true, that._animatingIndex);
                that._allowSelection = true;
            }
        },

        // selects an item
        _selectAt: function (index, oldIndex, suppressCheck) {
            var that = this;

            if (oldIndex === undefined) {
                oldIndex = that.selectedIndex;
            }

            if (index !== oldIndex || suppressCheck === true) {
                that._stopAnimation();

                if (that._allowSelection) {
                    that._animatingIndex = index;
                    if (that.selectedIndex !== -1) {
                        that._clearSelection(true, oldIndex);
                    }
                    that._allowSelection = false;
                    that._selecting = index;

                    if (that.selectionMode === 'click') {
                        $(that._items[index]).removeClass(that.toThemeProperty('jqx-fill-state-hover jqx-ribbon-item-hover'));
                    }

                    if (that.mode === 'popup' && that._roundedCorners) {
                        that._header.removeClass(that.toThemeProperty('jqx-rc-all'));
                        var headerClass, contentSectionsClass;
                        switch (that.position) {
                            case 'top':
                                headerClass = 'jqx-rc-t';
                                contentSectionsClass = 'jqx-rc-b';
                                break;
                            case 'bottom':
                                headerClass = 'jqx-rc-b';
                                contentSectionsClass = 'jqx-rc-t';
                                break;
                            case 'left':
                                headerClass = 'jqx-rc-l';
                                contentSectionsClass = 'jqx-rc-r';
                                break;
                            case 'right':
                                headerClass = 'jqx-rc-r';
                                contentSectionsClass = 'jqx-rc-l';
                                break;
                        }
                        that._headerElement.className += ' ' + that.toThemeProperty(headerClass);
                        for (var i = 0; i < that._items.length; i++) {
                            that._items[i].className += ' ' + that.toThemeProperty(headerClass);
                            that._contentSections[i].className += ' ' + that.toThemeProperty(contentSectionsClass);
                        }
                    }

                    that._items[index].className += ' ' + that.toThemeProperty('jqx-widget-content jqx-ribbon-item-selected');
                    that._selectionToken.style.display = 'block';
                    that._updatePositions(index);

                    var contentSectionHelper;

                    switch (that.animationType) {
                        case 'fade':
                            contentSectionHelper = $(that._contentSections[index]);
                            that._initAnimate(contentSectionHelper);
                            if (contentSectionHelper.css('display') === 'none') {
                                contentSectionHelper.fadeIn({
                                    duration: that.animationDelay,
                                    complete: function () {
                                        that._animationComplete(index, oldIndex);
                                    }
                                });
                            } else {
                                contentSectionHelper.fadeOut({
                                    duration: that.animationDelay,
                                    complete: function () {
                                        that._animationComplete(index, oldIndex);
                                    }
                                });
                            }
                            break;
                        case 'slide':
                            var direction = that.position;
                            if (direction === 'top') {
                                direction = 'up';
                            } else if (direction === 'bottom') {
                                direction = 'down';
                            }
                            that.slideAnimation = that._slide(contentSectionHelper, { mode: 'show', direction: direction, duration: that.animationDelay }, index, oldIndex);
                            break;
                        case 'none':
                            that._contentSections[index].style.display = 'block';
                            that._animationComplete(index, oldIndex);
                            break;
                    }
                } else {
                    // TO DO - when a new item is selected before the animation of the previous one is completed
                    //                    $(that._contentSections[oldIndex]).stop().css('display', 'none');
                    //                    that._animationComplete(index, oldIndex);
                    //                    that._selectAt(index);
                }
            }
        },

        // unselects the selected item and collapses its content
        _clearSelection: function (fromSelection, oldIndex) {
            var that = this;
            if (that.mode === 'popup') {
                if (that._roundedCorners) {
                    that._headerElement.className += ' ' + that.toThemeProperty('jqx-rc-all');
                }
            }
            that._selecting = -1;

            if (oldIndex === undefined) {
                oldIndex = that.selectedIndex;
            }

            $(that._items[oldIndex]).removeClass(that.toThemeProperty('jqx-widget-content jqx-ribbon-item-selected'));
            that._selectionToken.style.display = 'none';

            if (fromSelection !== true && that.animationType !== 'none') {
                var contentSectionHelper = $(that._contentSections[oldIndex]);
                if (that.animationType === 'fade') {
                    that._initAnimate(contentSectionHelper);
                    contentSectionHelper.fadeOut({
                        duration: that.animationDelay,
                        complete: function () {
                            that._clearSelectionComplete(oldIndex);
                        }
                    });
                } else if (that.animationType === 'slide') {
                    var direction = that.position;
                    if (direction === 'top') {
                        direction = 'up';
                    } else if (direction === 'bottom') {
                        direction = 'down';
                    }
                    that._stopAnimation();
                    oldIndex = that.selectedIndex;
                    that.slideAnimation = that._slide(contentSectionHelper, { mode: 'hide', direction: direction, duration: that.animationDelay }, oldIndex);
                    that.selectedIndex = -1;
                }
            } else {
                if (oldIndex === -1) {
                    return;
                }
                that._contentSections[oldIndex].style.display = 'none';
                that._clearSelectionComplete(oldIndex, fromSelection);
            }
        },

        // adds event handlers
        _addHandlers: function () {
            var that = this,
                id = that.element.id,
                clickedToDrag = false,
                draggedIndex;

            function _itemsClick(event) {
                var target = that._closest(event.target, 'li'),
                          index = target._index;

                if (!that._items[index]._disabled) {
                    if (index !== that.selectedIndex) {
                        that._selectAt(index);
                    } else if (that.mode === 'popup') {
                        if (that.popupCloseMode !== 'none') {
                            target.className += ' ' + that.toThemeProperty('jqx-fill-state-hover jqx-ribbon-item-hover');
                            that._clearSelection();
                        }
                    }
                }
            }

            function _itemsMouseenter(event) {
                if (that.reorder === true && clickedToDrag === true) {
                    var draggedToIndex = that._closest(event.target, 'li')._index,
                        draggedTitle = that._items[draggedIndex].innerHTML,
                        draggedContent = that._contentSections[draggedIndex].childNodes;

                    that._suppressSelectionEvents = true;
                    that._oldReorderIndex = draggedIndex;
                    that.removeAt(draggedIndex);
                    that.clearSelection();
                    that.addAt(draggedToIndex, { title: draggedTitle, content: draggedContent });
                    that.selectAt(draggedToIndex);

                    setTimeout(function () {
                        $(that._items[draggedToIndex]).trigger('mousedown');
                    }, 0);
                } else {
                    var target = that._closest(event.target, 'li');
                    if (condition(target._index)) {
                        target.className += ' ' + that.toThemeProperty('jqx-fill-state-hover jqx-ribbon-item-hover');
                    }
                }
            }

            function _itemsMouseleave(event) {
                var target = that._closest(event.target, 'li');
                if (condition(target._index)) {
                    $(target).removeClass(that.toThemeProperty('jqx-fill-state-hover jqx-ribbon-item-hover'));
                }
            }

            function _itemsMousedown(event) {
                if (event.target.nodeName === '#document') {
                    return;
                }
                var target = that._closest(event.target, 'li');
                if ((that.reorder === true || that._removeByDrag === true) && target._index === that.selectedIndex) {
                    clickedToDrag = true;
                    draggedIndex = target._index;
                    target.style.cursor = 'move';
                }
            }

            function _contentSectionsMouseleave() {
                if (that.popupCloseMode === 'mouseLeave' && that.mode === 'popup') {
                    that._clearSelection();
                }
            }

            function _itemsMouseenterHover(event) {
                var index = that._closest(event.target, 'li')._index;
                if (!that._items[index]._disabled && index !== that.selectedIndex) {
                    that._selectAt(index);
                }
            }

            function _itemsClickHover(event) {
                var index = that._closest(event.target, 'li')._index;
                if (!that._items[index]._disabled) {
                    if (that.mode === 'popup') {
                        if (that.popupCloseMode !== 'none') {
                            that._clearSelection();
                        }
                    }
                }
            }

            function _contentSectionsMouseleaveHover() {
                if (that.popupCloseMode === 'mouseLeave' && that.mode === 'popup') {
                    that._clearSelection();
                }
            }

            var closeOnClick = function (event) {
                if (that.popupCloseMode === 'click' && that.mode === 'popup' && that.selectedIndex !== -1) {
                    if (event.target.tagName === 'svg') { // fix for when jqxChart inside jqxRibbon is clicked
                        return;
                    }

                    var closestRibbon = that._closest(event.target, undefined, 'jqx-ribbon');
                    if (closestRibbon !== undefined && closestRibbon.getAttribute('id') !== id) { // clicked in another jqxRibbon
                        that._clearSelection();
                        return;
                    }

                    if (event.target.className === undefined || event.target.className.indexOf('jqx-ribbon-content-popup') !== -1) {
                        that._clearSelection();
                        return;
                    }

                    if ($(event.target).ischildof(that.host)) {
                        return;
                    }
                    var isPopup = false;
                    var parents = [],
                        getParent = function (element) {
                            if (element.parentElement) {
                                parents.push(element.parentElement);
                                getParent(element.parentElement);
                            }
                        };
                    getParent(event.target);

                    $.each(parents, function () {
                        if (this.className !== undefined) {
                            if (this.className.indexOf) {
                                if (this.className.indexOf('jqx-ribbon') !== -1) {
                                    isPopup = true;
                                    return false;
                                }
                                if (this.className.indexOf('jqx-ribbon') !== -1) {
                                    if (id === this.id) {
                                        isPopup = true;
                                    }
                                    return false;
                                }
                            }
                        }
                    });
                    if (!isPopup) {
                        that._clearSelection();
                    }
                }
            };

            if (that.selectionMode === 'click') {
                var condition = function (index) {
                    return ((that._selecting !== index && that._allowSelection === false) || ((that._selecting === -1 || that.selectedIndex !== index) && that._allowSelection === true)) && !that._items[index]._disabled;
                };

                for (var j = 0; j < that._items.length; j++) {
                    var currentItem = that._items[j];
                    that.addHandler(currentItem, 'click.ribbon' + id, _itemsClick);
                    that.addHandler(currentItem, 'mouseenter.ribbon' + id, _itemsMouseenter);
                    that.addHandler(currentItem, 'mouseleave.ribbon' + id, _itemsMouseleave);

                    that.addHandler(currentItem, 'mousedown.ribbon' + id, _itemsMousedown);
                }

                if (that.mode === 'popup') {
                    that.addHandler(that.host, 'mouseleave.ribbon' + id, function () {
                        if (that.popupCloseMode === 'mouseLeave' && that.mode === 'popup') {
                            that._clearSelection();
                        }
                    });
                    for (var k = 0; k < that._contentSections.length; k++) {
                        that.addHandler(that._contentSections[k], 'mouseleave.ribbon' + id, _contentSectionsMouseleave);
                    }
                    that.addHandler($(document), 'mousedown.ribbon' + id, function (event) {
                        closeOnClick(event);
                    });
                }



                if (that._removeByDrag === true) {
                    for (var i = 0; i < that._items.length; i++) {
                        that._items[i].className += ' ' + that.toThemeProperty('jqx-ribbon-item-docking-layout');
                    }
                }

                that.addHandler(document, 'mouseup.ribbon' + id, function () {
                    clickedToDrag = false;
                    for (var i = 0; i < that._items.length; i++) {
                        that._items[i].style.cursor = '';
                    }
                });

                that.addHandler(that._header, 'mouseleave.ribbon' + id, function (event) {
                    if (that._removeByDrag === true && clickedToDrag === true) {
                        that._raiseEvent('3', { draggedIndex: draggedIndex, x: event.pageX, y: event.pageY }); // _removeByDrag event (not public; for use in jqxDockingLayout)
                        if (that._items.length > 1) {
                            that.removeAt(draggedIndex);
                        }
                        clickedToDrag = false;
                        event.target.style.cursor = '';
                    }
                });
            } else if (that.selectionMode === 'hover') {
                for (var l = 0; l < that._items.length; l++) {
                    var currentItemHover = that._items[l];
                    that.addHandler(currentItemHover, 'mouseenter.ribbon' + id, _itemsMouseenterHover);
                    if (that.mode === 'popup') {
                        that.addHandler(currentItemHover, 'click.ribbon' + id, _itemsClickHover);
                    }
                }

                if (that.mode === 'popup') {
                    that.addHandler(that.host, 'mouseleave.ribbon' + id, function () {
                        if (that.popupCloseMode === 'mouseLeave' && that.mode === 'popup') {
                            that._clearSelection();
                        }
                    });
                    for (var m = 0; m < that._contentSections.length; m++) {
                        that.addHandler(that._contentSections, 'mouseleave.ribbon' + id, _contentSectionsMouseleaveHover);
                    }
                    that.addHandler($(document), 'mousedown.ribbon' + id, function (event) {
                        closeOnClick(event);
                    });
                }
            }

            var touch = $.jqx.mobile.isTouchDevice(),
                startEvent, endEvent;

            if (touch) {
                startEvent = 'touchstart';
                endEvent = 'touchend';
            } else {
                startEvent = 'mousedown';
                endEvent = 'mouseup';
            }

            that.addHandler(that._scrollButtonNear, startEvent + '.ribbon' + id, function () {
                if (that._orientation === 'horizontal') {
                    that._timeoutNear = setInterval(function () {
                        var scrollLeft = that._headerElement.scrollLeft,
                            rtl = (that.rtl && that._browser.browser === 'msie') ? -1 : 1; // a fix for direction: rtl in Internet Explorer
                        that._headerElement.scrollLeft = scrollLeft - that.scrollStep * rtl;
                        that._updatePositions();
                    }, that.scrollDelay);
                } else {
                    that._timeoutNear = setInterval(function () {
                        var scrollTop = that._headerElement.scrollTop;
                        that._headerElement.scrollTop = scrollTop - that.scrollStep;
                        that._updatePositions();
                    }, that.scrollDelay);
                }
                return false;
            });

            that.addHandler(that._scrollButtonFar, startEvent + '.ribbon' + id, function () {
                if (that._orientation === 'horizontal') {
                    that._timeoutFar = setInterval(function () {
                        var scrollLeft = that._headerElement.scrollLeft,
                            rtl = (that.rtl && that._browser.browser === 'msie') ? -1 : 1; // a fix for direction: rtl in Internet Explorer
                        that._headerElement.scrollLeft = scrollLeft + that.scrollStep * rtl;
                        that._updatePositions();
                    }, that.scrollDelay);
                } else {
                    that._timeoutFar = setInterval(function () {
                        var scrollTop = that._headerElement.scrollTop;
                        that._headerElement.scrollTop = scrollTop + that.scrollStep;
                        that._updatePositions();
                    }, that.scrollDelay);
                }
                return false;
            });

            that.addHandler($(document), endEvent + '.ribbon' + id, function () {
                clearInterval(that._timeoutNear);
                clearInterval(that._timeoutFar);
            });
        },

        // removes event handlers
        _removeHandlers: function (selectionMode, mode) {
            var that = this,
                id = that.element.id;

            if (!selectionMode) {
                selectionMode = that.selectionMode;
            }

            if (!mode) {
                mode = that.mode;
            }

            for (var i = 0; i < that._items.length; i++) {
                var currentItem = that._items[i];
                that.removeHandler(currentItem, 'mouseenter.ribbon' + id);
                if (selectionMode === 'click') {
                    that.removeHandler(currentItem, 'click.ribbon' + id);
                    that.removeHandler(currentItem, 'mouseleave.ribbon' + id);
                    that.removeHandler(currentItem, 'mousedown.ribbon' + id);
                }
            }

            if (selectionMode === 'click') {
                that.removeHandler(document, 'mouseup.ribbon' + id);
                that.removeHandler(that._header, 'mouseleave.ribbon' + id);
            } else if (selectionMode === 'hover' && mode === 'popup') {
                that.removeHandler(that.host, 'mouseleave.ribbon' + id);
            }


            var touch = $.jqx.mobile.isTouchDevice(),
                startEvent, endEvent;

            if (touch) {
                startEvent = 'touchstart';
                endEvent = 'touchend';
            } else {
                startEvent = 'mousedown';
                endEvent = 'mouseup';
            }

            that.removeHandler(that._scrollButtonNear, startEvent + '.ribbon' + id);
            that.removeHandler(that._scrollButtonFar, startEvent + '.ribbon' + id);
            that.removeHandler($(document), endEvent + '.ribbon' + id);
        },

        // checks if the widget's HTML structure is correct
        _checkStructure: function (children) {
            var that = this;

            var childrenNumber = children.length;
            if (childrenNumber !== 2) {
                throw new Error('jqxRibbon: Invalid HTML structure. You need to add a ul and a div to the widget container.');
            }

            var itemsNumber = that._header.children().length;
            var contentSectionsNumber = that._content.children().length;
            if (itemsNumber !== contentSectionsNumber) {
                throw new Error('jqxRibbon: Invalid HTML structure. For each list item you must have a corresponding div element.');
            }
        },

        // adds the required CSS classes to the widget's elements
        _addClasses: function () {
            var that = this,
                contentSectionsClass = 'jqx-widget-content jqx-ribbon-content-section jqx-ribbon-content-section-' + that.position,
                contentClass = 'jqx-widget-content jqx-ribbon-content jqx-ribbon-content-' + that._orientation,
                headerClass = 'jqx-widget-header jqx-disableselect jqx-ribbon-header jqx-ribbon-header-' + that._orientation,
                itemsClass = 'jqx-ribbon-item jqx-ribbon-item-' + that.position,
                hostClass = 'jqx-widget jqx-ribbon';

            that._content.removeClass();
            that._header.removeClass(that.toThemeProperty('jqx-rc-all jqx-widget-header jqx-disableselect jqx-rc-t jqx-rc-b jqx-rc-l jqx-rc-r jqx-rc-all jqx-ribbon-header-' + that._orientation + '-popup jqx-ribbon-header-bottom jqx-ribbon-header-auto jqx-ribbon-header-right jqx-ribbon-header-rtl'));
            that.host.removeClass();

            if (that._roundedCorners) {
                switch (that.position) {
                    case 'top':
                        headerClass += ' jqx-rc-t';
                        itemsClass += ' jqx-rc-t';
                        contentSectionsClass += ' jqx-rc-b';
                        break;
                    case 'bottom':
                        headerClass += ' jqx-rc-b';
                        itemsClass += ' jqx-rc-b';
                        contentSectionsClass += ' jqx-rc-t';
                        break;
                    case 'left':
                        headerClass += ' jqx-rc-l';
                        itemsClass += ' jqx-rc-l';
                        contentSectionsClass += ' jqx-rc-r';
                        break;
                    case 'right':
                        headerClass += ' jqx-rc-r';
                        itemsClass += ' jqx-rc-r';
                        contentSectionsClass += ' jqx-rc-l';
                        break;
                }
            } else {
                switch (that.position) {
                    case 'top':
                        itemsClass += ' jqx-rc-t';
                        break;
                    case 'bottom':
                        itemsClass += ' jqx-rc-b';
                        break;
                    case 'left':
                        itemsClass += ' jqx-rc-l';
                        break;
                    case 'right':
                        itemsClass += ' jqx-rc-r';
                        break;
                }
            }

            if (that.rtl === true) {
                headerClass += ' jqx-ribbon-header-rtl';
                itemsClass += ' jqx-ribbon-item-rtl';
            }

            that.element.className += ' ' + that.toThemeProperty(hostClass);
            that._headerElement.className += ' ' + that.toThemeProperty(headerClass);
            that._contentElement.className += ' ' + that.toThemeProperty(contentClass);

            for (var i = 0; i < that._items.length; i++) {
                var contentSectionHelper = $(that._contentSections[i]),
                    itemHelper = $(that._items[i]);
                contentSectionHelper.removeClass();
                itemHelper.removeClass(that.toThemeProperty('jqx-fill-state-disabled jqx-ribbon-item-rtl jqx-widget-content jqx-ribbon-item-selected jqx-rc-t jqx-rc-b jqx-rc-l jqx-rc-r jqx-ribbon-item-docking-layout jqx-ribbon-item jqx-ribbon-item-' + that.position));
                if (that.mode === 'popup') {
                    contentSectionsClass += ' jqx-ribbon-content-section-popup jqx-ribbon-content-popup-' + that.position + ' jqx-ribbon-content-section-' + that._orientation + '-popup';
                }
                that._contentSections[i].className += ' ' + that.toThemeProperty(contentSectionsClass);
                that._items[i].className += ' ' + that.toThemeProperty(itemsClass);
            }

            var headerWidth, headerHeight;

            if (that.mode === 'popup') {
                if (that.selectedIndex === -1) {
                    if (that._roundedCorners) {
                        that.element.className += ' ' + that.toThemeProperty('jqx-rc-all');
                        that._headerElement.className += ' ' + that.toThemeProperty('jqx-rc-all');
                    }
                }
                that.element.className += ' ' + that.toThemeProperty('jqx-ribbon-popup');
                that._headerElement.className += ' ' + that.toThemeProperty('jqx-ribbon-header-' + that._orientation + '-popup');
                that._contentElement.className += ' ' + that.toThemeProperty('jqx-ribbon-content-popup');
                that._positionPopup();
            } else {
                if (that._orientation === 'horizontal') {
                    if (that.height !== 'auto') {
                        headerHeight = that._headerElement.offsetHeight;
                        if (that.position === 'top') {
                            that._contentElement.style.paddingTop = that._toPx(headerHeight);
                        } else {
                            that._headerElement.className += ' ' + that.toThemeProperty('jqx-ribbon-header-bottom');
                        }
                    } else {
                        that._headerElement.className += ' ' + that.toThemeProperty('jqx-ribbon-header-auto');
                    }
                } else if (that._orientation === 'vertical') {
                    if (that.width !== 'auto') {
                        headerWidth = that._headerElement.offsetWidth;
                        if (that.position === 'left') {
                            that._contentElement.style.paddingLeft = that._toPx(headerWidth);
                        } else {
                            that._headerElement.className += ' ' + that.toThemeProperty('jqx-ribbon-header-right');
                            that._contentElement.style.paddingRight = that._toPx(headerWidth);
                        }
                    } else {
                        that.element.className += ' ' + that.toThemeProperty('jqx-ribbon-auto');
                        that._headerElement.className += ' ' + that.toThemeProperty('jqx-ribbon-header-auto');
                        that._contentElement.className += ' ' + that.toThemeProperty('jqx-ribbon-content-auto-width');
                    }
                }
            }

            // Internet Explorer 7 fix
            if (that._browser.version === '7.0' && that._browser.browser === 'msie') {
                if (that._orientation === 'horizontal') {
                    that._header.css('width', (that.host.width() - parseInt(that._header.css('padding-left'), 10) - parseInt(that._header.css('padding-right'), 10) - parseInt(that._header.css('border-left-width'), 10) - parseInt(that._header.css('border-right-width'), 10)));
                    that._items.height(that._items.height() - parseInt(that._items.css('padding-top'), 10) - parseInt(that._items.css('padding-bottom'), 10) - parseInt(that._items.css('border-top-width'), 10) - parseInt(that._items.css('border-bottom-width'), 10));
                    that._contentSections.width(that._contentSections.width() - parseInt(that._contentSections.css('border-left-width'), 10) - parseInt(that._contentSections.css('border-right-width'), 10) - parseInt(that._contentSections.css('padding-left'), 10) - parseInt(that._contentSections.css('padding-right'), 10));
                    if (that.mode === 'default') {
                        if (that.height !== 'auto') {
                            if (that.position === 'top') {
                                that._contentSections.css('padding-top', headerHeight);
                            } else {
                                that._contentSections.css('padding-bottom', headerHeight);
                            }
                            that._content.css('height', that.host.height() + 2);
                            that._contentSections.css('height', that._content.height() - parseInt(that._contentSections.css('border-bottom-width'), 10) - parseInt(that._contentSections.css('border-top-width'), 10) - 1);
                        }
                    } else {

                    }
                } else {
                    var borders;
                    if (that.position === 'left') {
                        that._contentElement.className += ' ' + that.toThemeProperty('jqx-ribbon-content-left');
                        borders = parseInt(that._contentSections.css('border-left-width'), 10) + parseInt(that._contentSections.css('border-right-width'), 10) + 1;
                    } else {
                        that._contentElement.className += ' ' + that.toThemeProperty('jqx-ribbon-content-right');
                        borders = 0;
                    }
                    that._header.css('height', (that.host.height() - parseInt(that._header.css('padding-top'), 10) - parseInt(that._header.css('padding-bottom'), 10) - parseInt(that._header.css('border-top-width'), 10) - parseInt(that._header.css('border-bottom-width'), 10)));
                    that._items.width(that._items.width() - parseInt(that._items.css('padding-left'), 10) - parseInt(that._items.css('padding-right'), 10) - parseInt(that._items.css('border-left-width'), 10) - parseInt(that._items.css('border-right-width'), 10));
                    that._contentSections.height(that._contentSections.height() - parseInt(that._contentSections.css('border-top-width'), 10) - parseInt(that._contentSections.css('border-bottom-width'), 10) - parseInt(that._contentSections.css('padding-top'), 10) - parseInt(that._contentSections.css('padding-bottom'), 10));
                    if (that.mode === 'default') {
                        if (that.width !== 'auto') {
                            if (that.position === 'left') {
                                that._contentSections.css('padding-left', headerWidth);
                            } else {
                                that._contentSections.css('padding-right', headerWidth);
                            }
                            that._contentSections.width(that._content.width() - that._header.width() - borders);
                        }
                    } else {

                    }
                }
            }
        },

        // positions the content when mode is set to "popup"
        _positionPopup: function () {
            var that = this;

            var ie7 = (that._browser.version === '7.0' && that._browser.browser === 'msie');

            switch (that.position) {
                case 'top':
                    that._contentElement.style.top = that._toPx(that._headerElement.offsetHeight);
                    break;
                case 'bottom':
                    if (!ie7) {
                        that._contentElement.style.bottom = that._toPx(that._headerElement.offsetHeight);
                    } else {
                        that._contentElement.style.bottom = that._toPx(that._height(that._headerElement));
                    }
                    break;
                case 'left':
                    that._contentElement.style.left = that._toPx(that._headerElement.offsetWidth);
                    break;
                case 'right':
                    that._contentElement.style.right = that._header.outerWidth() + 'px';
                    break;
            }
        },

        // appends scroll buttons
        _appendScrollButtons: function () {
            var that = this,
                arrowDirection = (that._orientation === 'horizontal') ? ['left', 'right'] : ['up', 'down'];
            function initScrollButton(element, specificClass, innerClass) {
                element.className = that.toThemeProperty('jqx-ribbon-scrollbutton jqx-ribbon-scrollbutton-' + that.position + ' jqx-ribbon-scrollbutton-' + that.scrollPosition + ' jqx-widget-header ' + specificClass);
                element.innerHTML = '<div class="' + that.toThemeProperty('jqx-ribbon-scrollbutton-inner ' + innerClass) + '"></div>';

                if (that._orientation === 'horizontal') {
                    element.style.height = that._toPx(that._height(that._headerElement));
                } else {
                    element.style.width = that._toPx(that._width(that._headerElement));
                }

                that.element.appendChild(element);
            }
            var scrollButtonNear = document.createElement('div');
            initScrollButton(scrollButtonNear, 'jqx-ribbon-scrollbutton-lt', 'jqx-icon-arrow-' + arrowDirection[0]);
            var scrollButtonFar = document.createElement('div');
            initScrollButton(scrollButtonFar, 'jqx-ribbon-scrollbutton-rb', 'jqx-icon-arrow-' + arrowDirection[1]);

            that._scrollButtonRc(scrollButtonNear, scrollButtonFar);

            that._scrollButtonNear = scrollButtonNear;
            that._scrollButtonFar = scrollButtonFar;

            if (!that.roundedCorners) {
                return;
            }

            switch (that.position) {
                case 'top':
                case 'bottom':
                    scrollButtonNear.style.marginLeft = '-1px';
                    scrollButtonFar.style.marginRight = '-1px';
                    break;
                case 'right':
                case 'left':
                    scrollButtonNear.style.marginTop = '-1px';
                    scrollButtonFar.style.marginBottom = '-1px';
                    break;
            }
        },

        // applies rounded corners to scroll buttons
        _scrollButtonRc: function (scrollButtonNear, scrollButtonFar) {
            var that = this;
            if (!that.roundedCorners) {
                return;
            }

            switch (that.position) {
                case 'top':
                    if (that.scrollPosition !== 'far') {
                        scrollButtonNear.className += ' ' + that.toThemeProperty('jqx-rc-tl');
                    }
                    if (that.scrollPosition !== 'near') {
                        scrollButtonFar.className += ' ' + that.toThemeProperty('jqx-rc-tr');
                    }
                    break;
                case 'bottom':
                    if (that.scrollPosition !== 'far') {
                        scrollButtonNear.className += ' ' + that.toThemeProperty('jqx-rc-bl');
                    }
                    if (that.scrollPosition !== 'near') {
                        scrollButtonFar.className += ' ' + that.toThemeProperty('jqx-rc-br');
                    }
                    break;
                case 'left':
                    if (that.scrollPosition !== 'far') {
                        scrollButtonNear.className += ' ' + that.toThemeProperty('jqx-rc-tl');
                    }
                    if (that.scrollPosition !== 'near') {
                        scrollButtonFar.className += ' ' + that.toThemeProperty('jqx-rc-bl');
                    }
                    break;
                case 'right':
                    if (that.scrollPosition !== 'far') {
                        scrollButtonNear.className += ' ' + that.toThemeProperty('jqx-rc-tr');
                    }
                    if (that.scrollPosition !== 'near') {
                        scrollButtonFar.className += ' ' + that.toThemeProperty('jqx-rc-br');
                    }
                    break;
            }
        },

        // makes or updates a jQuery selection of all items and their content and sets their indexes
        _updateItems: function (removeAt) {
            function checkSelectedIndex() {
                if (that._items[i]._index === that.selectedIndex) {
                    that.selectedIndex = i;
                }
            }
            var that = this;

            that._items = that._header.children();
            that._contentSections = that._content.children();

            for (var i = 0; i < that._items.length; i++) {
                var currentItem = that._items[i];
                currentItem.setAttribute('unselectable', 'on');
                if (currentItem._index === undefined) {
                    currentItem._disabled = false;
                    currentItem._isInitialized = false;
                    that._contentSections[i]._layout = 'default';
                }
                if (removeAt === true) {
                    checkSelectedIndex();
                }
                currentItem._index = i;
                if (removeAt !== true) {
                    checkSelectedIndex();
                }

                if (that._contentSections[i]) {
                    that._contentSections[i]._index = i;
                }
            }
        },

        // positions an item's content depending on its layout
        _positionContent: function (index) {
            var that = this,
                contentSection = that._contentSections[index],
                widgetSize, widgetOffset, itemSize, itemOffset, contentSize, topLeft;

            if (that._orientation === 'horizontal') {
                widgetSize = that.element.offsetWidth;
                widgetOffset = that.host.offset().left;
                itemSize = that._items[index].offsetWidth;
                itemOffset = $(that._items[index]).offset().left;
                contentSize = contentSection.offsetWidth || parseInt(contentSection.style.width, 10);
                topLeft = 'left';
            } else {
                widgetSize = that.element.offsetHeight;
                widgetOffset = that.host.offset().top;
                itemSize = that._items[index].offsetHeight;
                itemOffset = $(that._items[index]).offset().top;
                contentSize = contentSection.offsetHeight || parseInt(contentSection.style.height, 10);
                topLeft = 'top';
            }

            var position = function (value) {
                if (value < 0) {
                    value = 0;
                } else if (value + contentSize > widgetSize) {
                    value = widgetSize - contentSize;
                }
                contentSection.style[topLeft] = that._toPx(value);
            };

            var value;
            switch (contentSection._layout) {
                case 'near':
                    value = itemOffset - widgetOffset;
                    position(value);
                    break;
                case 'far':
                    value = itemOffset - widgetOffset - (contentSize - itemSize);
                    position(value);
                    break;
                case 'center':
                    value = itemOffset - widgetOffset - (contentSize - itemSize) / 2;
                    position(value);
                    break;
                default:
                    if (that.position === 'right') {
                        for (var i = 0; i < that._contentSections.length; i++) {
                            that._contentSections[i].style.right = '1px';
                        }
                    } else {
                        contentSection.style[topLeft] = '';
                    }
            }
        },

        // checks whether the scroll buttons have to be shown
        _checkScrollButtons: function (fluidSize) {
            var that = this;

            var itemsSize = 0;
            $.each(that._items, function () {
                var currentItem = $(this);
                if (currentItem.css('display') !== 'none') {
                    itemsSize += (that._orientation === 'horizontal') ? currentItem.outerWidth(true) : currentItem.outerHeight(true);
                }
            });

            var margins = that._orientation === 'horizontal' ? ['margin-left', 'margin-right'] : ['margin-top', 'margin-bottom'];
            var headerSize = (that._orientation === 'horizontal') ? that._width(that._headerElement) : that._height(that._headerElement);
            if (!that._itemMargins) {
                that._itemMargins = [];
                that._itemMargins.push($(that._items[0]).css(margins[0]));
                that._itemMargins.push($(that._items[that._items.length - 1]).css(margins[1]));
            }

            if (itemsSize > headerSize) {
                that._scrollButtonNear.style.display = 'block';
                that._scrollButtonFar.style.display = 'block';
                var near = that.rtl ? that._itemMargins[0] : 17;
                var far = that.rtl ? that._itemMargins[0] : 17;
                switch (that.scrollPosition) {
                    case 'near':
                        far = 0;
                        near = 34;
                        break;
                    case 'far':
                        far = 34;
                        near = 17;
                        break;
                }

                if (that._items[0]) {
                    that._items[0].style[margins[0]] = that._toPx(near);
                }
                if (that._items[that._items.length - 1]) {
                    that._items[that._items.length - 1].style[margins[1]] = that._toPx(far);
                }
            } else {
                if (that._items[0]) {
                    that._items[0].style[margins[0]] = that._toPx(that._itemMargins[0]);
                }
                if (that._items[that._items.length - 1]) {
                    that._items[that._items.length - 1].style[margins[1]] = that._toPx(that._itemMargins[1]);
                }
                that._scrollButtonNear.style.display = 'none';
                that._scrollButtonFar.style.display = 'none';
            }

            if (fluidSize === true) {
                if (that._orientation === 'horizontal') {
                    var height = that._toPx(that._height(that._headerElement));
                    that._scrollButtonNear.style.height = height;
                    that._scrollButtonFar.style.height = height;
                } else {
                    var width = that._toPx(that._width(that._headerElement));
                    that._scrollButtonNear.style.width = width;
                    that._scrollButtonFar.style.width = width;
                }
            }
        },

        // updates the selection token's position
        _positionSelectionToken: function (index) {
            var that = this;

            if (index !== -1) {
                var selectedItem = $(that._items[index]);
                if (selectedItem.length === 0) {
                    return;
                }

                var top, bottom, left, right, offset;

                if (that._orientation === 'horizontal') {
                    var rtlWidth, rtlScroll;
                    if (that.rtl === true) {
                        if (that._browserWidthRtlFlag === 1) {
                            rtlWidth = that._headerElement.scrollWidth - that._headerElement.clientWidth;
                        } else {
                            rtlWidth = 0;
                        }
                        rtlScroll = that._browserScrollRtlFlag;
                    } else {
                        rtlWidth = 0;
                        rtlScroll = 1;
                    }

                    left = selectedItem[0].offsetLeft + rtlWidth - that._headerElement.scrollLeft * rtlScroll - that._selectionTokenOffsetX + 2;
                    offset = that._headerElement.offsetHeight - 1;
                    var width = that._width(selectedItem[0]) + parseInt(selectedItem.css('padding-left'), 10) + parseInt(selectedItem.css('padding-right'), 10);

                    if (that.position === 'top') {
                        top = offset - that._selectionTokenOffsetY;
                        bottom = '';
                    } else {
                        top = '';
                        bottom = offset - that._selectionTokenOffsetY;
                    }

                    that._selectionToken.style.top = that._toPx(top);
                    that._selectionToken.style.bottom = that._toPx(bottom);
                    that._selectionToken.style.left = that._toPx(left);
                    that._selectionToken.style.width = that._toPx(width);
                } else {
                    top = selectedItem[0].offsetTop - that._headerElement.scrollTop - that._selectionTokenOffsetX + 2;
                    offset = that._headerElement.offsetWidth - 1;
                    var height = that._height(selectedItem[0]) + parseInt(selectedItem.css('padding-top'), 10) + parseInt(selectedItem.css('padding-bottom'), 10);
                    if (that.position === 'left') {
                        left = offset - that._selectionTokenOffsetY;
                        right = '';
                    } else {
                        left = '';
                        right = offset - that._selectionTokenOffsetY;
                    }
                    that._selectionToken.style.top = that._toPx(top);
                    that._selectionToken.style.left = that._toPx(left);
                    that._selectionToken.style.right = that._toPx(right);
                    that._selectionToken.style.height = that._toPx(height);
                }
            }
        },

        // updates the positions of the selection token and popup content
        _updatePositions: function (index, resize) {
            var that = this;

            if (isNaN(index)) {
                if (resize === true && that._selecting !== null && that._selecting >= 0) {
                    index = that._selecting;
                } else {
                    index = that.selectedIndex;
                }
            }

            if (index !== -1) {
                that._positionSelectionToken(index);
                if (that.mode === 'popup' && that._contentSections[index]._layout !== 'default') {
                    that._positionContent(index);
                }
                if (that.mode === 'popup' && (that.position === 'left' || that.position === 'right')) {
                    that._contentElement.style.width = 'auto';
                    var isPercentage = that._contentSections[index].style.width && that._contentSections[index].style.width.indexOf('%') >= 0;
                    if (isPercentage) {
                        //that._content[0].style.width = that._contentSections[index].style.width;
                        that._contentElement.style.width = that._toPx(that._width(that._contentSections[index]) - that._width(that._headerElement));
                    }
                    else {
                        that._contentElement.style.width = that._toPx(that._width(that._contentSections[index]));
                    }
                }
            }
        },

        // a callback function called after the selection animation has completed
        _animationComplete: function (index, oldIndex) {
            var that = this,
                unselectedIndex = oldIndex !== -1 ? oldIndex : null;

            that._contentElement.style.pointerEvents = 'auto';

            if (that._suppressSelectionEvents !== true) {
                that._raiseEvent('0', { selectedIndex: index }); // select event
                that._raiseEvent('2', { unselectedIndex: unselectedIndex, selectedIndex: index }); // change event
            } else {
                if (that._suppressReorder !== true && that._oldReorderIndex !== undefined && index !== that._oldReorderIndex) {
                    that._raiseEvent('4', { newIndex: index, oldIndex: that._oldReorderIndex }); // reorder event
                }
                that._suppressSelectionEvents = false;
                that._suppressReorder = false;
            }
            that.selectedIndex = index;
            if (that.initContent && that._items[index]._isInitialized === false) {
                that.initContent(index);
                that._items[index]._isInitialized = true;
            }
            that._allowSelection = true;
            that._selecting = null;
        },

        // a callback function called after the selection has been cleared
        _clearSelectionComplete: function (oldIndex, fromSelection) {
            var that = this;

            that._selecting = null;

            if (oldIndex === undefined) {
                oldIndex = that.selectedIndex;
            }

            if (oldIndex !== -1) {
                that._contentElement.style.pointerEvents = 'none';
                if (that._suppressSelectionEvents !== true) {
                    that._raiseEvent('1', { unselectedIndex: oldIndex }); // unselect event
                }
            }

            if (fromSelection !== true) {
                that.selectedIndex = -1;
            }
        },

        // slides an item's content section
        _slide: function (el, o, index, oldIndex) {
            var that = this;
            if (!that.activeAnimations) {
                that.activeAnimations = [];
            }
            if (that.activeAnimations.length > 0) {
                for (var i = 0; i < that.activeAnimations.length; i++) {
                    that.activeAnimations[i].clearQueue();
                    that.activeAnimations[i].finish();
                }
            }
            else {
                el.clearQueue();
                el.finish();
            }

            var dataSpace = 'ui-effects-';

            // effects functions
            var effects = {
                save: function (element, set) {
                    for (var i = 0; i < set.length; i++) {
                        if (set[i] !== null && element.length > 0) {
                            element.data(dataSpace + set[i], element[0].style[set[i]]);
                        }
                    }
                },

                restore: function (element, set) {
                    var val, i;
                    for (i = 0; i < set.length; i++) {
                        if (set[i] !== null) {
                            val = element.data(dataSpace + set[i]);
                            if (val === undefined) {
                                val = '';
                            }
                            element.css(set[i], val);
                        }
                    }
                },

                createWrapper: function (element) {

                    if (element.parent().is('.ui-effects-wrapper')) {
                        return element.parent();
                    }

                    var props = {
                        width: element.outerWidth(true),
                        height: element.outerHeight(true),
                        'float': element.css('float')
                    },
                        wrapper = $('<div></div>')
                        .addClass('ui-effects-wrapper')
                        .css({
                            fontSize: '100%',
                            background: 'transparent',
                            border: 'none',
                            margin: 0,
                            padding: 0
                        }),
                        size = {
                            width: element.width(),
                            height: element.height()
                        },
                        active = document.activeElement;

                    try {
                        active.id; //ignore jslint
                    } catch (e) {
                        active = document.body;
                    }

                    element.wrap(wrapper);

                    if (element[0] === active || $.contains(element[0], active)) {
                        $(active).focus();
                    }

                    wrapper = element.parent();

                    if (element.css('position') === 'static') {
                        wrapper.css({
                            position: 'relative'
                        });
                        element.css({
                            position: 'relative'
                        });
                    } else {
                        $.extend(props, {
                            position: element.css('position'),
                            zIndex: element.css('z-index')
                        });
                        $.each(['top', 'left', 'bottom', 'right'], function (i, pos) {
                            props[pos] = element.css(pos);
                            if (isNaN(parseInt(props[pos], 10))) {
                                props[pos] = 'auto';
                            }
                        });
                        element.css({
                            //  queue: false,
                            position: 'relative',
                            top: 0,
                            left: 0,
                            right: 'auto',
                            bottom: 'auto'
                        });
                    }
                    element.css(size);

                    return wrapper.css(props).show();
                },

                removeWrapper: function (element) {
                    var active = document.activeElement;

                    if (element.parent().is('.ui-effects-wrapper')) {
                        element.parent().replaceWith(element);

                        if (element[0] === active || $.contains(element[0], active)) {
                            $(active).focus();
                        }
                    }

                    return element;
                }
            };

            var props = ['position', 'top', 'bottom', 'left', 'right', 'width', 'height'],
                mode = o.mode,
                show = mode === 'show',
                direction = o.direction || 'left',
                ref = (direction === 'up' || direction === 'down') ? 'top' : 'left',
                positiveMotion = (direction === 'up' || direction === 'left'),
                distance,
                animation = {};

            effects.save(el, props);
            el.show();
            distance = o.distance || el[ref === 'top' ? 'outerHeight' : 'outerWidth'](true);

            effects.createWrapper(el).css({
                overflow: 'hidden'
            });

            if (show) {
                el.css(ref, positiveMotion ? (isNaN(distance) ? '-' + distance : -distance) : distance);
            }

            animation[ref] = (show ?
                    (positiveMotion ? '+=' : '-=') :
                    (positiveMotion ? '-=' : '+=')) +
                distance;


            var restore = function () {
                el.clearQueue();
                el.stop(true, true);
            };

            that.activeAnimations.push(el);
            el.animate(animation, {
                //     queue: false,
                duration: o.duration,
                easing: o.easing,
                complete: function () {
                    that.activeAnimations.pop(el);
                    if (mode === 'show') {
                        that._animationComplete(index, oldIndex);
                    } else if (mode === 'hide') {
                        el.hide();
                        that._clearSelectionComplete(index);
                    }
                    effects.restore(el, props);
                    effects.removeWrapper(el);
                }
            });
            return restore;
        },

        _toPx: function (value) {
            if (typeof value === 'number') {
                return value + 'px';
            } else {
                return value;
            }
        },

        // a replacement of jQuery's .width()
        _width: function (element) {
            var elementHelper = $(element),
                borderLeft = elementHelper.css('border-left-width'),
                borderRight = elementHelper.css('border-right-width'),
                paddingLeft = parseInt(elementHelper.css('padding-left'), 10),
                paddingRight = parseInt(elementHelper.css('padding-right'), 10),
                displayFlag = elementHelper.css('display') === 'none' ? true : false;

            if (displayFlag) {
                element.style.display = 'block';
            }

            if (borderLeft.indexOf('px') === -1) {
                borderLeft = 1;
            } else {
                borderLeft = parseInt(borderLeft, 10);
            }
            if (borderRight.indexOf('px') === -1) {
                borderRight = 1;
            } else {
                borderRight = parseInt(borderRight, 10);
            }
            var width = element.offsetWidth - (borderLeft + borderRight + paddingLeft + paddingRight);

            if (displayFlag) {
                element.style.display = 'none';
            }

            return Math.max(0, width);
        },

        // a replacement of jQuery's .height()
        _height: function (element) {
            var elementHelper = $(element),
                borderTop = elementHelper.css('border-top-width'),
                borderBottom = elementHelper.css('border-bottom-width'),
                paddingTop = parseInt(elementHelper.css('padding-top'), 10),
                paddingBottom = parseInt(elementHelper.css('padding-bottom'), 10);

            if (borderTop.indexOf('px') === -1) {
                borderTop = 1;
            } else {
                borderTop = parseInt(borderTop, 10);
            }
            if (borderBottom.indexOf('px') === -1) {
                borderBottom = 1;
            } else {
                borderBottom = parseInt(borderBottom, 10);
            }
            var height = element.offsetHeight - (borderTop + borderBottom + paddingTop + paddingBottom);
            return Math.max(0, height);
        },

        // a replacement of jQuery's .closest()
        _closest: function (element, tagToMatch, classToMatch) {
            if (tagToMatch) {
                if (element.nodeName.toLowerCase() === tagToMatch) {
                    return element;
                }
                var parentNodeT = element.parentNode;
                while (parentNodeT !== null && parentNodeT.nodeName !== '#document') {
                    if (parentNodeT.nodeName.toLowerCase() === tagToMatch) {
                        return parentNodeT;
                    }
                    parentNodeT = parentNodeT.parentNode;
                }
            }
            if (classToMatch) {
                if ((' ' + element.className + ' ').replace(/[\n\t]/g, ' ').indexOf(' ' + classToMatch + ' ') > -1) {
                    return element;
                }
                var parentNodeC = element.parentNode;
                while (parentNodeC !== null && parentNodeC.nodeName !== '#document') {
                    if ((' ' + parentNodeC.className + ' ').replace(/[\n\t]/g, ' ').indexOf(' ' + classToMatch + ' ') > -1) {
                        return parentNodeC;
                    }
                    parentNodeC = parentNodeC.parentNode;
                }
            }
        },

        _initAnimate: function (elementHelper) {
            if (elementHelper.initAnimate) {
                if (elementHelper.animate) {
                    return;
                }
                elementHelper.initAnimate();
            }
        }
    });
})(jqxBaseFramework); //ignore jslint

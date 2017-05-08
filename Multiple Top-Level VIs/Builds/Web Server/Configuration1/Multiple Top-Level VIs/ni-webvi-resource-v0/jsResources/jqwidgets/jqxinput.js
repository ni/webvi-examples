/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($) {
    'use strict';
    $.jqx.jqxWidget('jqxInput', '', {});

    $.extend($.jqx._jqxInput.prototype, {
        defineInstance: function () {
            var that = this;
            var settings = {
                disabled: false,
                filter: that._filter,
                sort: that._sort,
                highlight: that._highlight,
                dropDownWidth: null,
                renderer: that._renderer,
                opened: false,
                $popup: document.createElement('ul'),
                source: [],
                roundedCorners: true,
                searchMode: 'default',
                placeHolder: '',
                width: null,
                height: null,
                value: '',
                rtl: false,
                displayMember: '',
                valueMember: '',
                events: ['select', 'open', 'close', 'change'],
                popupZIndex: 20000,
                items: 8,
                minLength: 1,
                maxLength: null
            };
            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function () {
            var that = this;
            if (that.host.css('display') === 'none' || document.body.contains(that.element) === false) {
                that._initiallyHidden = true;
            }
            that._popupHelper = $(that.$popup);
            that.render();
        },

        render: function () {
            var that = this;
            if (this.element.nodeName.toLowerCase() === 'textarea') {
                this.element.style.overflow = 'auto';
            } else
                if (this.element.nodeName.toLowerCase() === 'div') {
                    this.baseHost = this.element;
                    var input = that.element.getElementsByTagName('input');
                    var hasTextInput = false;

                    $.each(input, function () {
                        var type = this.type;
                        if (type == null || type === 'text' || type === 'textarea') {
                            input = $(this);
                            hasTextInput = true;
                            return false;
                        }
                    });
                    if (!hasTextInput) {
                        throw new Error('jqxInput: Missing Text Input in the Input Group');
                    }

                    if (input.length > 0) {
                        this.baseHost = $(this.element);
                        that.baseElement = that.element;
                        var data = this.host.data();
                        this.host = input;
                        this.element = input[0];
                        this.host.data(data);
                        that.baseElement.className += ' ' + that.toThemeProperty('jqx-widget jqx-rc-all jqx-input-group');
                        var children = this.baseHost.children();
                        $.each(children, function (index) {
                            var classToAdd = 'jqx-input-group-addon';
                            $(this).removeClass(that.toThemeProperty('jqx-rc-all'));
                            if (index === 0) {
                                classToAdd += ' jqx-rc-l';
                            }
                            if (index === children.length - 1) {
                                classToAdd += ' jqx-rc-r';
                            }
                            if (this !== that.element) {
                                classToAdd += ' jqx-fill-state-normal';
                            }
                            this.className += ' ' + that.toThemeProperty(classToAdd);
                        });
                    }
                }

            this.addHandlers();
            if (this.rtl) {
                that.element.className += ' ' + that.toThemeProperty('jqx-rtl');
            }
            that.element.setAttribute('role', 'textbox');
            $.jqx.aria(this, 'aria-autocomplete', 'both');
            $.jqx.aria(this, 'aria-disabled', this.disabled);
            $.jqx.aria(this, 'aria-readonly', false);
            $.jqx.aria(this, 'aria-multiline', false);
            if (this.source && this.source.length) {
                $.jqx.aria(this, 'aria-haspopup', true);
            }
            if (this.value !== '') {
                this.element.value = this.value;
            }

            this._oldsource = this.source;
            this._updateSource();
        },

        _updateSource: function () {
            var that = this;

            var mapItem = function (item) {
                if (item === undefined) {
                    return null;
                }

                if (typeof item === 'string' || item instanceof String) {
                    return { label: item, value: item };
                }

                if (typeof item !== 'string' && item instanceof String === false) {
                    var label = '';
                    var value = '';

                    if (that.displayMember !== '' && that.displayMember !== undefined) {
                        if (item[that.displayMember]) {
                            label = item[that.displayMember];
                        }
                    }

                    if (that.valueMember !== '' && that.valueMember !== undefined) {
                        value = item[that.valueMember];
                    }

                    if (label === '') {
                        label = item.label;
                    }
                    if (value === '') {
                        value = item.value;
                    }

                    return { label: label, value: value };
                }

                return item;
            };

            var mapItems = function (source) {
                var items = [];
                for (var i = 0; i < source.length; i++) {
                    items[i] = mapItem(source[i]);
                }
                return items;
            };

            if (this.source && this.source._source) {
                this.adapter = this.source;
                if (this.adapter._source.localdata != null) {
                    this.adapter.unbindBindingUpdate(this.element.id);
                    this.adapter.bindBindingUpdate(this.element.id, function () {
                        that.source = mapItems(that.adapter.records);
                    });
                }
                else {
                    var postdata = {};
                    if (this.adapter._options.data) {
                        $.extend(that.adapter._options.data, postdata);
                    }
                    else {
                        if (this.source._source.data) {
                            $.extend(postdata, this.source._source.data);
                        }
                        this.adapter._options.data = postdata;
                    }
                    this.adapter.unbindDownloadComplete(this.element.id);
                    this.adapter.bindDownloadComplete(this.element.id, function () {
                        that.source = mapItems(that.adapter.records);
                    });
                }
                this.source.dataBind();
                return;
            }

            if (!$.isFunction(this.source)) {
                this.source = mapItems(this.source);
            }
        },

        _refreshClasses: function (add) {
            var func = add ? 'addClass' : 'removeClass',
                hostClass = 'jqx-widget-content jqx-input jqx-widget',
                popupClass = 'jqx-popup jqx-input-popup jqx-menu jqx-menu-vertical jqx-menu-dropdown jqx-widget jqx-widget-content';

            if ($.jqx.browser.msie) {
                popupClass += ' jqx-noshadow';
            }
            if (this.roundedCorners) {
                hostClass += ' jqx-rc-all';
                popupClass += ' jqx-rc-all';
            }
            if (this.disabled) {
                hostClass += ' jqx-fill-state-disabled';
            } else {
                this.host.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
            }
            this.host[func](this.toThemeProperty(hostClass));
            this._popupHelper[func](this.toThemeProperty(popupClass));
        },

        selectAll: function () {
            var textbox = this.host;
            setTimeout(function () {
                if ('selectionStart' in textbox[0]) {
                    textbox[0].focus();
                    textbox[0].setSelectionRange(0, textbox[0].value.length);
                }
                else {
                    var range = textbox[0].createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', textbox[0].value.length);
                    range.moveStart('character', 0);
                    range.select();
                }
            }, 10);
        },

        selectLast: function () {
            var textbox = this.host;
            this.selectStart(textbox[0].value.length);
        },

        selectFirst: function () {
            //var textbox = this.host;
            this.selectStart(0);
        },

        selectStart: function (index) {
            var textbox = this.host;
            setTimeout(function () {
                if ('selectionStart' in textbox[0]) {
                    textbox[0].focus();
                    textbox[0].setSelectionRange(index, index);
                }
                else {
                    var range = textbox[0].createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', index);
                    range.moveStart('character', index);
                    range.select();
                }
            }, 10);
        },

        focus: function () {
            try {
                var that = this;
                that.element.focus();
                setTimeout(function () {
                    that.element.focus();
                }, 25);

            }
            catch (error) {
            }
        },

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            this.refresh();
        },

        refresh: function () {
            this._refreshClasses(false);
            this._refreshClasses(true);

            if (!this.baseHost) {
                if (this.width) {
                    this.element.style.width = this._toPx(this.width);
                }
                if (this.height) {
                    this.element.style.height = this._toPx(this.height);
                }
            } else {
                if (this.width) {
                    this.baseElement.style.width = this._toPx(this.width);
                }
                if (this.height) {
                    this.baseElement.style.height = this._toPx(this.height);
                }
                var that = this,
                    IE8 = $.jqx.browser.msie && $.jqx.browser.version < 9,
                    totalWidth = 0;
                $.each(this.baseHost.children(), function () {
                    this.style.height = '100%';
                    if (this !== that.element) {
                        totalWidth += $(this).outerWidth();
                    }
                });
                that._addonsWidth = totalWidth;
                if (IE8) {
                    var height = Math.max(0, that.baseElement.offsetHeight - 2);
                    that.element.style.width = Math.max(0, (that.baseElement.offsetWidth - totalWidth - 1)) + 'px';
                    that.element.style.minHeight = height + 'px';
                    that.element.style.lineHeight = height + 'px';
                } else {
                    that.element.style.width = 'calc(100% - ' + totalWidth + 'px)';
                }
                $.jqx.utilities.resize(that.baseHost, function () {
                    if (IE8 && typeof that.width === 'string' && that.width.indexOf('%') !== -1 && !that._initiallyHidden) {
                        that.element.style.width = (that.baseElement.offsetWidth - that._addonsWidth - 1) + 'px';
                    } else if (that._initiallyHidden) {
                        that._addonsWidth = that._getAddonsWidth();
                        if (!IE8) {
                            that.element.style.width = 'calc(100% - ' + that._addonsWidth + 'px)';
                        } else {
                            that.element.style.width = (that.baseElement.offsetWidth - that._addonsWidth - 1) + 'px';
                            var height = that.baseElement.offsetHeight - 2;
                            that.element.style.minHeight = height + 'px';
                            that.element.style.lineHeight = height + 'px';
                        }
                        that._initiallyHidden = false;
                    }
                });
            }

            if (this.disabled) {
                this.element.setAttribute('disabled', true);
            } else {
                this.element.removeAttribute('disabled');
            }
            if (this.maxLength) {
                this.element.setAttribute('maxlength', this.maxLength);
            }

            if (!this.element.getAttribute('placeholder')) {
                this._refreshPlaceHolder();
            }
        },

        _refreshPlaceHolder: function () {
            var that = this;
            if ('placeholder' in this.element && !($.jqx.browser.msie && $.jqx.browser.version < 9)) {
                that.element.setAttribute('placeHolder', that.placeHolder);
            } else {
                if (that.element.value === '') {
                    that.element.value = that.placeHolder;
                }
            }
        },

        destroy: function () {
            this.removeHandlers();
            if (this.baseHost) {
                this.baseHost.remove();
            } else {
                this.host.remove();
            }
            if (this.$popup) {
                this._popupHelper.remove();
            }
        },

        propertiesChangedHandler: function (object, key, value) {
            if (value.width && value.height && Object.keys(value).length === 2) {
                object.refresh();
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (key === 'width' && value !== oldvalue) {
                if (object.baseHost) {
                    object.baseElement.style.width = object._toPx(value);
                    if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                        object.element.style.width = (object.baseElement.offsetWidth - object._addonsWidth - 1) + 'px';
                    }
                } else {
                    object.element.style.width = object._toPx(value);
                }
                return;
            }

            if (key === 'placeHolder') {
                if ((!('placeholder' in object.element) || ($.jqx.browser.msie && $.jqx.browser.version < 9)) && object.element.value === oldvalue) {
                    object.element.value = '';
                }
                object._refreshPlaceHolder();
                return;
            }

            if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length === 2) {
                return;
            }

            if (key === 'theme') {
                $.jqx.utilities.setTheme(oldvalue, value, object.host);
            }

            if (key === 'opened') {
                if (value) {
                    object.open();
                } else {
                    object.close();
                }
                return;
            }
            if (key === 'source') {
                object._oldsource = value;
                object._updateSource();
            }
            if (key === 'displayMember' || key === 'valueMember') {
                object.source = object._oldsource;
                object._updateSource();
            }
            if (key === 'disabled') {
                $.jqx.aria(object, 'aria-disabled', object.disabled);
            }

            if (key === 'value') {
                object.element.value = value;
            }

            object.refresh();
        },

        select: function (event, ui, changeType) {
            var selectedItem = this._find('jqx-fill-state-pressed', this._popupHelper);
            var val = selectedItem.getAttribute('data-value');
            var label = selectedItem.getAttribute('data-name');
            this.element.value = this.renderer(label, this.element.value);
            this.selectedItem = { 'label': label, 'value': val };
            this.element.setAttribute('data-value', val);
            this.element.setAttribute('data-label', label);
            this._raiseEvent('0', { 'item': { 'label': label, 'value': val }, 'label': label, 'value': val });
            this._raiseEvent('3', { type: changeType, 'item': { 'label': label, 'value': val }, 'label': label, 'value': val });
            this.value = label;
            return this.close();
        },

        val: function (value) {
            if (arguments.length === 0 || (value != null && typeof (value) === 'object' && !value.label && !value.value)) {
                if (this.displayMember !== '' && this.valueMember !== '' && this.selectedItem) {
                    if (this.element.value === '') {
                        return '';
                    }
                    return this.selectedItem;
                }

                return this.element.value;
            }

            if (value && value.label) {
                this.selectedItem = { 'label': value.label, 'value': value.value };
                this.element.setAttribute('data-value', value.value);
                this.element.setAttribute('data-label', value.label);
                this.value = value;
                this.element.value = value.label;
                return this.element.value;
            }

            this.value = value;
            this.element.value = value;
            this.element.setAttribute('data-value', value);
            this.element.setAttribute('data-label', value);
            if (value && value.label) {
                this._raiseEvent('3', { type: null, 'item': { 'label': value.label, 'value': value.value }, 'label': value.label, 'value': value.value });
            }
            else {
                this._raiseEvent('3', { type: null, 'item': { 'label': value, 'value': value }, 'label': value, 'value': value });
            }
            return this.element.value;
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

            var result = this.host.trigger(event);
            return result;
        },

        _renderer: function (item) {
            return item;
        },

        open: function () {
            if ($.jqx.isHidden(this.host)) {
                return;
            }

            var position = $.extend({}, this.host.coord(true), {
                height: this.element.offsetHeight
            });

            if (this.$popup.parentNode !== document.body) {
                var popupId = this.element.id + '_popup';
                this.$popup.id = popupId;
                $.jqx.aria(this, 'aria-owns', popupId);
                document.body.appendChild(this.$popup);
            }

            this.$popup.style.position = 'absolute';
            this.$popup.style.zIndex = this.popupZIndex;
            this.$popup.style.top = this._toPx(position.top + position.height);
            this.$popup.style.left = this._toPx(position.left);
            this.$popup.style.display = 'block';

            var height = 0;
            var children = this._popupHelper.children();
            $.each(children, function () {
                height += $(this).outerHeight() + 1;
            });
            this.$popup.style.height = this._toPx(height);

            this.opened = true;
            this._raiseEvent('1', { popup: this.$popup });
            $.jqx.aria(this, 'aria-expanded', true);
            return this;
        },

        close: function () {
            this.$popup.style.display = 'none';
            this.opened = false;
            this._raiseEvent('2', { popup: this.$popup });
            $.jqx.aria(this, 'aria-expanded', false);
            return this;
        },

        suggest: function () {
            var items;
            this.query = this.element.value;

            if (!this.query || this.query.length < this.minLength) {
                return this.opened ? this.close() : this;
            }

            if ($.isFunction(this.source)) {
                items = this.source(this.query, $.proxy(this.load, this));
            }
            else {
                items = this.source;
            }

            if (items) {
                return this.load(items);
            }

            return this;
        },

        load: function (originalItems) {
            var that = this,
                items = [];

            for (var i = 0; i < originalItems.length; i++) {
                var item = originalItems[i];
                if (that.filter(item)) {
                    items.push(item);
                }
            }

            items = this.sort(items);

            if (!items.length) {
                if (this.opened) {
                    return this.close();
                }
                else {
                    return this;
                }
            }

            return this._render(items.slice(0, this.items)).open();
        },

        _filter: function (item) {
            var value = this.query;
            var itemValue = item;
            if (item.label != null) {
                itemValue = item.label;
            }
            else if (this.displayMember) {
                itemValue = item[this.displayMember];
            }

            switch (this.searchMode) {
                case 'none':
                    break;
                default: // ('containsignorecase')
                    return $.jqx.string.containsIgnoreCase(itemValue, value);
                case 'contains':
                    return $.jqx.string.contains(itemValue, value);
                case 'equals':
                    return $.jqx.string.equals(itemValue, value);
                case 'equalsignorecase':
                    return $.jqx.string.equalsIgnoreCase(itemValue, value);
                case 'startswith':
                    return $.jqx.string.startsWith(itemValue, value);
                case 'startswithignorecase':
                    return $.jqx.string.startsWithIgnoreCase(itemValue, value);
                case 'endswith':
                    return $.jqx.string.endsWith(itemValue, value);
                case 'endswithignorecase':
                    return $.jqx.string.endsWithIgnoreCase(itemValue, value);
            }
        },

        _sort: function (items) {
            var bw = [], cs = [], cis = [];

            for (var i = 0; i < items.length; i++) {
                var item = items[i];

                var itemValue = item;
                if (item.label) {
                    itemValue = item.label;
                }
                else if (this.displayMember) {
                    itemValue = item[this.displayMember];
                }

                if (itemValue.toString().toLowerCase().indexOf(this.query.toString().toLowerCase()) === 0) {
                    bw.push(item);
                }
                else if (itemValue.toString().indexOf(this.query) >= 0) {
                    cs.push(item);
                }
                else if (itemValue.toString().toLowerCase().indexOf(this.query.toString().toLowerCase()) >= 0) {
                    cis.push(item);
                }
            }

            return bw.concat(cs, cis);
        },

        _highlight: function (item) {
            var query = this.query;
            query = query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

            var regex = new RegExp('(' + query + ')', 'ig');
            return item.replace(regex, function ($1, match) {
                return '<b>' + match + '</b>';
            });
        },

        _render: function (originalItems) {
            var that = this,
                popupChildren = that._popupHelper.children();

            if (popupChildren.length > 0) {
                for (var j = 0; j < popupChildren.length; j++) {
                    $(popupChildren[j]).remove();
                }
            }

            var mapItem = function (item, index) {
                var itemValue = item,
                    i = document.createElement('li'),
                    a = document.createElement('a'),
                    dataName, dataValue;
                a.setAttribute('href', '#');
                i.appendChild(a);
                if (item.value !== undefined && item.value !== null) {
                    if (item.label !== undefined && item.label !== null) {
                        dataName = item.label;
                        dataValue = item.value;
                    } else {
                        dataName = item.value;
                        dataValue = item.value;
                    }
                } else if (item.label !== undefined && item.label !== null) {
                    dataName = item.label;
                    dataValue = item.label;
                } else if (that.displayMember !== undefined && that.displayMember !== '') {
                    dataName = item[that.displayMember];
                    dataValue = item[that.valueMember];
                } else {
                    dataName = item;
                    dataValue = item;
                }
                i.setAttribute('data-value', dataValue);
                i.setAttribute('data-name', dataName);

                if (item.label) {
                    itemValue = item.label;
                }
                else if (that.displayMember) {
                    itemValue = item[that.displayMember];
                }

                a.innerHTML = that.highlight(itemValue);
                var plusClass = '';
                if (that.rtl) {
                    plusClass = ' jqx-rtl';
                }
                if (index === 0) {
                    plusClass += ' jqx-fill-state-pressed';
                }
                i.className = that.toThemeProperty('jqx-item jqx-menu-item jqx-rc-all' + plusClass);
                that.$popup.appendChild(i);

                that.addHandler(i, 'mouseenter', function (event) { that.mouseenter(event); });
            };

            var mapItems = function (source) {
                for (var i = 0; i < source.length; i++) {
                    mapItem(source[i], i);
                }
            };

            mapItems(originalItems);

            if (!this.dropDownWidth) {
                this.$popup.style.width = that._toPx(that.element.offsetWidth - 6);
            } else {
                this.$popup.style.width = that._toPx(that.dropDownWidth);
            }

            return this;
        },

        next: function () {
            var active = this._find('jqx-fill-state-pressed', this._popupHelper),
                next = active.nextSibling;
            $(active).removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
            if (!next) {
                next = this.$popup.firstChild;
            }

            next.className += ' ' + this.toThemeProperty('jqx-fill-state-pressed');
        },

        prev: function () {
            var active = this._find('jqx-fill-state-pressed', this._popupHelper),
                prev = active.previousSibling;
            $(active).removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
            if (!prev) {
                prev = this.$popup.lastChild;
            }

            prev.className += ' ' + this.toThemeProperty('jqx-fill-state-pressed');
        },

        addHandlers: function () {
            var that = this,
                eventNamespace = '.jqxInput' + that.element.id;
            that.addHandler(that.host, 'focus' + eventNamespace, function () { that.onFocus(); });
            that.addHandler(that.host, 'blur' + eventNamespace, function () { that.onBlur(); });
            that.addHandler(that.host, 'change' + eventNamespace, function (event) {
                if (!event.args) {
                    event.stopPropagation();
                    event.preventDefault();
                    //event.stopImmediatePropagation();

                    var item = that.val(),
                        label, val;
                    if (item && item.label) {
                        label = item.label;
                        val = item.val;
                    }
                    else {
                        label = item;
                        val = item;
                    }
                    that._raiseEvent('3', { type: 'keyboard', 'item': { 'label': label, 'value': val }, 'label': label, 'value': val });
                    that.value = label;
                }
            });

            that.addHandler(that.host, 'keypress' + eventNamespace, function (event) { that.keypress(event); });
            that.addHandler(that.host, 'keyup' + eventNamespace, function (event) { that.keyup(event); });
            that.addHandler(that.host, 'keydown' + eventNamespace, function (event) { that.keydown(event); });
            that.addHandler(that.$popup, 'mousedown' + eventNamespace, function (event) { that.click(event); });
        },

        removeHandlers: function () {
            var that = this,
                eventNamespace = '.jqxInput' + that.element.id;
            that.removeHandler(that.host, 'change' + eventNamespace);
            that.removeHandler(that.host, 'focus' + eventNamespace);
            that.removeHandler(that.host, 'blur' + eventNamespace);
            that.removeHandler(that.host, 'keypress' + eventNamespace);
            that.removeHandler(that.host, 'keyup' + eventNamespace);
            that.removeHandler(that.host, 'keydown' + eventNamespace);
            that.removeHandler(that.$popup, 'mousedown' + eventNamespace);
        },

        move: function (e) {
            if (!this.opened) {
                return;
            }

            switch (e.keyCode) {
                case 9: // tab
                case 13: // enter
                case 27: // escape
                    e.preventDefault();
                    break;

                case 38: // up arrow
                    if (!e.shiftKey) {
                        e.preventDefault();
                        this.prev();
                    }
                    break;

                case 40: // down arrow
                    if (!e.shiftKey) {
                        e.preventDefault();
                        this.next();
                    }
                    break;
            }

            e.stopPropagation();
        },

        keydown: function (e) {
            var arr = [40, 38, 9, 13, 27];
            this.suppressKeyPressRepeat = arr.indexOf(e.keyCode) !== -1;
            this.move(e);
        },

        keypress: function (e) {
            if (this.suppressKeyPressRepeat) {
                return;
            }
            this.move(e);
        },

        keyup: function (e) {
            switch (e.keyCode) {
                case 40: // down arrow
                case 38: // up arrow
                case 16: // shift
                case 17: // ctrl
                case 18: // alt
                    break;

                case 9: // tab
                case 13: // enter
                    if (!this.opened) {
                        return;
                    }
                    this.select(e, this, 'keyboard');
                    break;

                case 27: // escape
                    if (!this.opened) {
                        return;
                    }
                    this.close();
                    break;

                default:
                    {
                        var me = this;
                        if (this.timer) {
                            clearTimeout(this.timer);
                        }
                        this.timer = setTimeout(function () {
                            me.suggest();
                        }, 300);
                    }
            }

            e.stopPropagation();
            e.preventDefault();
        },

        clear: function () {
            this.val('');
        },

        onBlur: function () {
            var that = this;
            setTimeout(function () { that.close(); }, 150);
            that.host.removeClass(that.toThemeProperty('jqx-fill-state-focus'));
            if ((!('placeholder' in that.element) || ($.jqx.browser.msie && $.jqx.browser.version < 9)) && (that.element.value === '' || that.element.value === that.placeHolder)) {
                that.element.value = that.placeHolder;
            }
        },

        onFocus: function () {
            var that = this;
            that.element.className += ' ' + that.toThemeProperty('jqx-fill-state-focus');
            if ((!('placeholder' in that.element) || ($.jqx.browser.msie && $.jqx.browser.version < 9)) && that.element.value === that.placeHolder) {
                that.element.value = '';
            }
        },

        click: function (e) {
            e.stopPropagation();
            e.preventDefault();
            this.select(e, this, 'mouse');
        },

        mouseenter: function (e) {
            $(this._find('jqx-fill-state-pressed', this._popupHelper)).removeClass(this.toThemeProperty('jqx-fill-state-pressed'));
            e.currentTarget.className += ' ' + this.toThemeProperty('jqx-fill-state-pressed');
        },

        _toPx: function (value) {
            if (typeof value === 'number') {
                return value + 'px';
            } else {
                return value;
            }
        },

        _find: function (className, parentElement) {
            var children = parentElement.children();
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.className.indexOf(className) !== -1) {
                    return child;
                }
            }
        },

        _getAddonsWidth: function () {
            var that = this,
                children = that.baseHost.children(),
                result = 0;

            for (var i = 0; i < children.length; i++) {
                if (children[i] !== that.element) {
                    result += $(children[i]).outerWidth();
                }
            }

            return result;
        }
    });
})(jqxBaseFramework); //ignore jslint

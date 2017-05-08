/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($) {

    $.jqx.jqxWidget("jqxRadioButton", "", {});

    $.extend($.jqx._jqxRadioButton.prototype, {
        defineInstance: function () {
            var settings = {
                // Type: Number
                // Default: 250
                // Gets or sets the delay of the fade animation when the RadioButton is going to be opened.
                animationShowDelay: 300,
                // Type: Number
                // Default: 300
                // Gets or sets the delay of the fade animation when the RadioButton is going to be closed. 
                animationHideDelay: 300,
                // Type: Number.
                // Default: null.
                // Sets the width.
                width: null,
                // Type: Number.
                // Default: null.
                // Sets the height.
                height: null,
                // Type: String
                // Default: '13px'
                // Gets or sets the radiobutton's size.
                boxSize: '13px',
                // Type: Bool and Null
                // Default: false
                // Gets or sets the ckeck state.
                // Possible Values: true, false and null.
                checked: false,
                // Type: Bool
                // Default: false
                // Gets or sets whether the radiobutton has 3 states - checked, unchecked and indeterminate.
                hasThreeStates: false,
                // Type: Bool
                // Default: false
                // Gets whether the CheckBox is disabled.
                disabled: false,
                // Type: Bool
                // Default: true
                // Gets or sets whether the clicks on the container are handled as clicks on the check box.
                enableContainerClick: true,
                // Type: Bool
                // Default: true
                // Gets or sets whether the checkbox is locked. In this mode the user is not allowed to check/uncheck the radio button.
                locked: false,
                // Type: String
                // Default: ''
                // Gets or sets the group name. When this property is set, the checkboxes in the same group behave as radio buttons.
                groupName: '',
                rtl: false,
                changeType: null,
                aria:
                {
                    "aria-checked": { name: "checked", type: "boolean" },
                    "aria-disabled": { name: "disabled", type: "boolean" }
                },
                // 'checked' is triggered when the radiobutton is checked.
                // 'unchecked' is triggered when the radiobutton is unchecked.
                // 'indeterminate' is triggered when the radiobutton's ckecked property is going to be null.
                // 'change' is triggered when the radiobutton's state is changed.
                events:
                 [
                    'checked', 'unchecked', 'indeterminate', 'change'
                 ]
            }
            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function (args)
        {
            var that = this;
            that._createFromInput("RadioButton");
            that.render();
        },

        _createFromInput: function (name)
        {
            var that = this;
            if (that.element.nodeName.toLowerCase() == "input")
            {
                that.field = that.element;
                if (that.field.className)
                {
                    that._className = that.field.className;
                }

                var properties = {
                    'title': that.field.title
                };

                if (that.field.value)
                {
                    properties.value = that.field.value;
                }
                if (that.field.checked)
                {
                    properties.checked = true;
                }
                if (that.field.id.length)
                {
                    properties.id = that.field.id.replace(/[^\w]/g, '_') + "_" + name;
                }
                else
                {
                    properties.id = $.jqx.utilities.createId() + "_" + name;
                }

                var textField = that.element.nextSibling;
                var hasTextField = false;
                if (textField && (textField.nodeName == "#text" || textField.nodeName == "span"))
                {
                    hasTextField = true;
                }
                var offsetWidth = 0;
                var wrapper = $("<div></div>", properties);
                if (hasTextField)
                {
                    wrapper.append(textField);
                    var f = $("<span>" + $(textField).text() + "</span>"); 
                    f.appendTo($(document.body))
                    offsetWidth +=  f.width();
                    f.remove();
                }
                wrapper[0].style.cssText = that.field.style.cssText;
                if (!that.width)
                {
                    that.width = $(that.field).width() + offsetWidth + 10;
                }
                if (!that.height)
                {
                    that.height = $(that.field).outerHeight() + 10;
                }
                $(that.field).hide().after(wrapper);
                var data = that.host.data();
                that.host = wrapper;
                that.host.data(data);
                that.element = wrapper[0];
                that.element.id = that.field.id;
                that.field.id = properties.id;
                if (that._className)
                {
                    that.host.addClass(that._className);
                    $(that.field).removeClass(that._className);
                }

                if (that.field.tabIndex)
                {
                    var tabIndex = that.field.tabIndex;
                    that.field.tabIndex = -1;
                    that.element.tabIndex = tabIndex;
                }
            }
        },

        render: function () {
            this.setSize();
            var me = this;
            this.propertyChangeMap['width'] = function (instance, key, oldVal, value) {
                me.setSize();
            };

            this.propertyChangeMap['height'] = function (instance, key, oldVal, value) {
                me.setSize();
            };
            if (this.radiobutton) {
                this.radiobutton.remove();
            }
            if (!this.width) this.host.css('overflow-x', 'visible');
            if (!this.height) this.host.css('overflow-y', 'visible');

            if (this.boxSize == null) this.boxSize = 13;
            var boxSize = parseInt(this.boxSize) + 'px';
            var checkSize = "13px";
            var ml = Math.floor((parseInt(this.boxSize) - 13) / 2);
            var mt = ml;
            ml += "px";
            mt += "px";
            var size = parseInt(this.boxSize) / 2 + "px";

            if (this.boxSize != "13px")
            {
                this.radiobutton = $('<div><div style="width: ' + boxSize + '; height: ' + boxSize + ';"><span style="position: relative; left: ' + ml + '; top: ' + mt + '; width: ' + checkSize + '; height: ' + checkSize + ';"></span></div></div>');
            }
            else
            {
                this.radiobutton = $('<div><div style="width: ' + boxSize + '; height: ' + boxSize + ';"><span style="width: ' + size + '; height: ' + size + ';"></span></div></div>');
            }

            this.host.attr('role', 'radio');
            this.host.prepend(this.radiobutton);
            if (!this.disabledContainer)
            {
                if (!this.host.attr('tabIndex'))
                {
                    this.host.attr('tabIndex', 0);
                }
                this.clear = $('<div style="clear: both;"></div>');
                this.host.append(this.clear);
            }

            this.checkMark = $(this.radiobutton[0].firstChild.firstChild);//$(this.checkbox).find('span');
            this.box = this.radiobutton;


            this._supportsRC = true;
            if ($.jqx.browser.msie && $.jqx.browser.version < 9) {
                this._supportsRC = false;
            }

            this.box.addClass(this.toThemeProperty('jqx-fill-state-normal'));
            this.box.addClass(this.toThemeProperty('jqx-radiobutton-default'));
            this.host.addClass(this.toThemeProperty('jqx-widget'));

            if (this.disabled) {
                this.disable();
            }

            this.host.addClass(this.toThemeProperty('jqx-radiobutton'));

            if (this.locked) {
                this.host.css('cursor', 'auto');
            }

            var checked = this.element.getAttribute('checked');
            if (checked == 'checked' || checked == 'true' || checked == true) {
                this.checked = true;
            }

            this._addInput();
            this._render();
            this._addHandlers();
            $.jqx.aria(this);

            this._centerBox();
        },

        _centerBox: function()
        {
            if (this.height && this.height.toString().indexOf("%") == -1 && this.box)
            {
                var hostHeight = parseInt(this.height);
                this.host.css('line-height', hostHeight + "px");
                var top = hostHeight - parseInt(this.boxSize) -1;
                top /= 2;
                this.box.css('margin-top', parseInt(top));
            }
        },

        _addInput: function () {
            var name = this.host.attr('name');
            this.input = $("<input type='hidden'/>");
            this.host.append(this.input);
            if (name)
                this.input.attr('name', name);
        },

        refresh: function (initialRefresh) {
            if (!initialRefresh) {
                this.setSize();
                this._render();
            }
        },

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            this.setSize();
        },

        setSize: function ()
        {
            if (this.width != null && this.width.toString().indexOf("px") != -1)
            {
                this.host.width(this.width);
            }
            else if (this.width != undefined && !isNaN(this.width))
            {
                this.host.width(this.width);
            }
            else if (this.width != null && this.width.toString().indexOf("%") != -1)
            {
                this.element.style.width = this.width;
            }

            if (this.height != null && this.height.toString().indexOf("px") != -1)
            {
                this.host.height(this.height);
            }
            else if (this.height != undefined && !isNaN(this.height))
            {
                this.host.height(this.height);
            }
            else if (this.height != null && this.height.toString().indexOf("%") != -1)
            {
                this.element.style.height = this.height;
            }
            this._centerBox();
        },

        _addHandlers: function () {
            var me = this;
            this.addHandler(this.box, 'click', function (event) {
                if (!me.disabled && !me.enableContainerClick) {
                    me.changeType = "mouse";
                    me.toggle('click');
                    event.preventDefault();
                    return false;
                }
            });

            this.addHandler(this.host, 'keydown', function (event) {
                if (!me.disabled && !me.locked) {
                    if (event.keyCode == 32) {
                        me.changeType = "keyboard";
                        me.toggle('click');
                        event.preventDefault();
                        return false;
                    }
                }
            });

            this.addHandler(this.host, 'click', function (event) {
                if (!me.disabled && me.enableContainerClick) {
                    me.changeType = "mouse";
                    me.toggle('click');
                    event.preventDefault();
                    return false;
                }
            });

            this.addHandler(this.host, 'selectstart', function (event) {
                if (!me.disabled && me.enableContainerClick) {
                    event.preventDefault();
                }
            });

            this.addHandler(this.host, 'mouseup', function (event) {
                if (!me.disabled && me.enableContainerClick) {
                    event.preventDefault();
                }
            });

            this.addHandler(this.host, 'focus', function (event) {
                if (!me.disabled && me.enableContainerClick && !me.locked) {
                    me.box.addClass(me.toThemeProperty('jqx-radiobutton-hover'));
                    me.box.addClass(me.toThemeProperty('jqx-fill-state-focus'));
                    event.preventDefault();
                    return false;
                }
            });

            this.addHandler(this.host, 'blur', function (event) {
                if (!me.disabled && me.enableContainerClick && !me.locked) {
                    me.box.removeClass(me.toThemeProperty('jqx-radiobutton-hover'));
                    me.box.removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                    event.preventDefault();
                    return false;
                }
            });

            this.addHandler(this.host, 'mouseenter', function (event) {
                if (!me.disabled && me.enableContainerClick && !me.locked) {
                    me.box.addClass(me.toThemeProperty('jqx-radiobutton-hover'));
                    me.box.addClass(me.toThemeProperty('jqx-fill-state-hover'));

                    event.preventDefault();
                    return false;
                }
            });

            this.addHandler(this.host, 'mouseleave', function (event) {
                if (!me.disabled && me.enableContainerClick && !me.locked) {
                    me.box.removeClass(me.toThemeProperty('jqx-radiobutton-hover'));
                    me.box.removeClass(me.toThemeProperty('jqx-fill-state-hover'));
                    event.preventDefault();
                    return false;
                }
            });

            this.addHandler(this.box, 'mouseenter', function () {
                if (!me.disabled && !me.enableContainerClick) {
                    me.box.addClass(me.toThemeProperty('jqx-radiobutton-hover'));
                    me.box.addClass(me.toThemeProperty('jqx-fill-state-hover'));
                }
            });

            this.addHandler(this.box, 'mouseleave', function () {
                if (!me.disabled && !me.enableContainerClick) {
                    me.box.removeClass(me.toThemeProperty('jqx-radiobutton-hover'));
                    me.box.removeClass(me.toThemeProperty('jqx-fill-state-hover'));
                }
            });
        },

        focus: function () {
            try {
                this.host.focus();
            }
            catch (error) {
            }
        },

        _removeHandlers: function () {
            this.removeHandler(this.box, 'click');
            this.removeHandler(this.box, 'mouseenter');
            this.removeHandler(this.box, 'mouseleave');
            this.removeHandler(this.host, 'click');
            this.removeHandler(this.host, 'mouseup');
            this.removeHandler(this.host, 'mousedown');
            this.removeHandler(this.host, 'selectstart');
            this.removeHandler(this.host, 'mouseenter');
            this.removeHandler(this.host, 'mouseleave');
            this.removeHandler(this.host, 'keydown');
            this.removeHandler(this.host, 'focus');
            this.removeHandler(this.host, 'blur');
        },

        _render: function () {
            if (this.boxSize == null) this.boxSize = 13;

            this.box.width(this.boxSize);
            this.box.height(this.boxSize);

            if (!this.disabled) {
                if (this.enableContainerClick) {
                    this.host.css('cursor', 'pointer');
                }
                else this.host.css('cursor', 'auto');
            }
            else {
                this.disable();
            }

            if (this.rtl) {
                this.box.addClass(this.toThemeProperty('jqx-radiobutton-rtl'));
                this.host.addClass(this.toThemeProperty('jqx-rtl'));
            }
            this.updateStates();
        },

        val: function (value) {
            if (arguments.length == 0 || typeof (value) == "object") {
                return this.checked;
            }

            if (typeof value == "string") {
                if (value == "true") this.check('api');
                if (value == "false") this.uncheck('api');
                if (value == "") this.indeterminate('api');
            }
            else {
                if (value == true) this.check('api');
                if (value == false) this.uncheck('api');
                if (value == null) this.indeterminate('api');
            }
            return this.checked;
        },

        // checks the ckeckbox.
        check: function (type) {
            this.checked = true;
            var me = this;
            this.checkMark.removeClass();

            this.checkMark.addClass(this.toThemeProperty('jqx-fill-state-pressed'));
            if ($.jqx.browser.msie) {
                if (!this.disabled) {
                    this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-checked'));
                }
                else {
                    this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-disabled'));
                    this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-checked'));
                }
            }
            else {
                if (!this.disabled) {
                    this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-checked'));
                }
                else {
                    this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-disabled'));
                    this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-checked'));
                }

                this.checkMark.css('opacity', 0);
                this.checkMark.stop().animate({ opacity: 1 }, this.animationShowDelay, function () {
                });
            }

            var checkboxes = $.find('.jqx-radiobutton');

            if (this.groupName == null) this.groupName = '';
            $.each(checkboxes, function () {
                var groupName = $(this).jqxRadioButton('groupName');
                if (groupName == me.groupName && this != me.element) {
                    $(this).jqxRadioButton('uncheck', 'api')
                }
            });

            this._raiseEvent('0');
            this._raiseEvent('3', { type: type, checked: true });

            if (this.checkMark.height() == 0) {
                var size = parseInt(this.boxSize) / 2;
                this.checkMark.height(size);
                this.checkMark.width(size);
            }
            else if (this.boxSize != '13px') {
                var size = parseInt(this.boxSize) / 2;
                this.checkMark.height(size);
                this.checkMark.width(size);
                this.checkMark.css('margin-left', 1 + (size / 4));
                this.checkMark.css('margin-top', 1 + (size / 4));
            }

            this.input.val(this.checked);
            $.jqx.aria(this, "aria-checked", this.checked);
        },

        // unchecks the radiobutton.
        uncheck: function (type) {
            var oldCheck = this.checked;
            this.checked = false;
            var me = this;

            if ($.jqx.browser.msie) {
                me.checkMark.removeClass();
            }
            else {
                this.checkMark.css('opacity', 1);
                this.checkMark.stop().animate({ opacity: 0 }, this.animationHideDelay, function () {
                    me.checkMark.removeClass();
                });
            }

            if (oldCheck) {
                this._raiseEvent('1');
                this._raiseEvent('3', { type: type, checked: false });
            }
            this.input.val(this.checked);
            $.jqx.aria(this, "aria-checked", this.checked);
        },

        // sets the indeterminate state.
        indeterminate: function (type) {
            var oldCheck = this.checked;
            this.checked = null;
            this.checkMark.removeClass();

            if ($.jqx.browser.msie) {
                this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-indeterminate'));
            }
            else {
                this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-indeterminate'));
                this.checkMark.css('opacity', 0);
                this.checkMark.stop().animate({ opacity: 1 }, this.animationShowDelay, function () {
                });
            }

            if (oldCheck != null) {
                this._raiseEvent('2');
                this._raiseEvent('3', {type: type, checked: null });
            }
            this.input.val(this.checked);
            $.jqx.aria(this, "aria-checked", "undefined");
        },

        // toggles the check state.
        toggle: function (type) {
            if (this.disabled)
                return;

            if (this.locked)
                return;

            var oldChecked = this.checked;

            if (this.checked == true) {
                this.checked = this.hasTreeStates ? null : true;
            }
            else {
                this.checked = true;
            }

            if (oldChecked != this.checked) {
                this.updateStates(type);
            }
            this.input.val(this.checked);
        },

        // updates check states depending on the value of the 'checked' property.
        updateStates: function (type) {
            if (this.checked) {
                this.check(type);
            }
            else if (this.checked == false) {
                this.uncheck(type);
            }
            else if (this.checked == null) {
                this.indeterminate(type);
            }
        },

        // disables the radiobutton.
        disable: function () {
            this.disabled = true;

            if (this.checked == true) {
                this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-disabled'));
            }
            else if (this.checked == null) {
                this.checkMark.addClass(this.toThemeProperty('jqx-radiobutton-check-indeterminate-disabled'));
            }
            this.box.addClass(this.toThemeProperty('jqx-radiobutton-disabled'));
            this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
            $.jqx.aria(this, "aria-disabled", this.disabled);
        },

        // enables the radiobutton.
        enable: function () {
            this.host.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
            if (this.checked == true) {
                this.checkMark.removeClass(this.toThemeProperty('jqx-radiobutton-check-disabled'));
            }
            else if (this.checked == null) {
                this.checkMark.removeClass(this.toThemeProperty('jqx-radiobutton-check-indeterminate-disabled'));
            }
            this.box.removeClass(this.toThemeProperty('jqx-radiobutton-disabled'));

            this.disabled = false;
            $.jqx.aria(this, "aria-disabled", this.disabled);
        },

        destroy: function () {
            this._removeHandlers();
            this.host.remove();
        },

        _raiseEvent: function (id, args) {
            var evt = this.events[id];
            var event = new $.Event(evt);
            event.owner = this;
            if (!args) args = {};
            args.type = this.changeType;
            this.changeType = null;
            event.args = args;

            try {
                var result = this.host.trigger(event);
            }
            catch (error) {
            }

            return result;
        },

        propertiesChangedHandler: function (object, key, value)
        {
            if (value.width && value.height && Object.keys(value).length == 2)
            {
                object.setSize();
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this.isInitialized == undefined || this.isInitialized == false)
                return;

            if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length == 2)
            {
                return;
            }

            if (key == this.enableContainerClick && !this.disabled && !this.locked) {
                if (value) {
                    this.host.css('cursor', 'pointer');
                }
                else this.host.css('cursor', 'auto');
            }

            if (key == "rtl") {
                if (value) {
                    object.box.addClass(object.toThemeProperty('jqx-radiobutton-rtl'));
                    object.host.addClass(object.toThemeProperty('jqx-rtl'));
                }
                else {
                    object.box.removeClass(object.toThemeProperty('jqx-radiobutton-rtl'));
                    object.host.removeClass(object.toThemeProperty('jqx-rtl'));
                }
            }

            if (key == "boxSize")
            {
                object.render();
            }

            if (key == 'checked') {
                switch (value) {
                    case true:
                        this.check('api');
                        break;
                    case false:
                        this.uncheck('api');
                        break;
                    case null:
                        this.indeterminate();
                        break;
                }
            }

            if (key == 'theme') {
                $.jqx.utilities.setTheme(oldvalue, value, this.host);
            }

            if (key == 'disabled') {
                if (value) {
                    this.disable();
                } else this.enable();
            }
        }
    });
})(jqxBaseFramework);

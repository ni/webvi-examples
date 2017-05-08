/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {

    $.jqx.jqxWidget("jqxCheckBox", "", {});

    $.extend($.jqx._jqxCheckBox.prototype, {
        defineInstance: function () {
            var settings = {
                // Type: Number
                // Default: 250
                // Gets or sets the delay of the fade animation when the CheckBox is going to be opened.
                animationShowDelay: 300,
                // Type: Number
                // Default: 300
                // Gets or sets the delay of the fade animation when the CheckBox is going to be closed. 
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
                // Gets or sets the checkbox's size.
                boxSize: '13px',
                // Type: Bool and Null
                // Default: false
                // Gets or sets the ckeck state.
                // Possible Values: true, false and null.
                checked: false,
                // Type: Bool
                // Default: false
                // Gets or sets whether the checkbox has 3 states - checked, unchecked and indeterminate.
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
                // Gets or sets whether the checkbox is locked. In this mode the user is not allowed to check/uncheck the checkbox.
                locked: false,
                // Type: String
                // Default: ''
                // Gets or sets the group name. When this property is set, the checkboxes in the same group behave as radio buttons.
                groupName: '',
                keyboardCheck: true,
                enableHover: true,
                hasInput: true,
                rtl: false,
                updated: null,
                disabledContainer: false,
                changeType: null,
                _canFocus: true,
                aria:
                {
                    "aria-checked": { name: "checked", type: "boolean" },
                    "aria-disabled": { name: "disabled", type: "boolean" }
                },
                // 'checked' is triggered when the checkbox is checked.
                // 'unchecked' is triggered when the checkbox is unchecked.
                // 'indeterminate' is triggered when the checkbox's ckecked property is going to be null.
                // 'change' is triggered when the checkbox's state is changed.
                events:
                 [
                    'checked', 'unchecked', 'indeterminate', 'change'
                 ]
            };
            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function (args)
        {
            var that = this;
            that._createFromInput("CheckBox");
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
                    offsetWidth += f.width();
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

        _addInput: function () {
            if (this.hasInput) {
                if (this.input) this.input.remove();
                var name = this.host.attr('name');
                this.input = $("<input type='hidden'/>");
                this.host.append(this.input);
                if (name) {
                    this.input.attr('name', name);
                }
                this.input.val(this.checked);

                this.host.attr('role', 'checkbox');
                $.jqx.aria(this);
            }
        },

        render: function () {
            this.init = true;
            var me = this;
            this.setSize();
            this.propertyChangeMap['width'] = function (instance, key, oldVal, value) {
                me.setSize();
            };

            this.propertyChangeMap['height'] = function (instance, key, oldVal, value) {
                me.setSize();
            };
            this._removeHandlers();

            if (!this.width) this.host.css('overflow-x', 'visible');
            if (!this.height) this.host.css('overflow-y', 'visible');

            if (this.checkbox) {
                this.checkbox.remove();
                this.checkbox = null;
            }
            if (this.checkMark) {
                this.checkMark.remove();
                this.checkMark = null;
            }
            if (this.box) {
                this.box.remove();
                this.box = null;
            }
            if (this.clear) {
                this.clear.remove();
                this.clear = null;
            }

            if (this.boxSize == null) this.boxSize = 13;
            var boxSize = parseInt(this.boxSize) + 'px';
            var checkSize = "13px";
            var ml = Math.floor((parseInt(this.boxSize) - 13) / 2);
            var mt = ml;
            ml += "px";
            mt += "px";
            if (this.boxSize != "13px") {
                this.checkbox = $('<div><div style="width: ' + boxSize + '; height: ' + boxSize + ';"><span style="position: relative; left: ' + ml + '; top: ' + mt + '; width: ' + checkSize + '; height: ' + checkSize + ';"></span></div></div>');
            }
            else {
                this.checkbox = $('<div><div style="width: ' + boxSize + '; height: ' + boxSize + ';"><span style="width: ' + boxSize + '; height: ' + boxSize + ';"></span></div></div>');
            }

            this.host.prepend(this.checkbox);
            if (!this.disabledContainer) {
                if (!this.host.attr('tabIndex')) {
                    this.host.attr('tabIndex', 0);
                }
                this.clear = $('<div style="clear: both;"></div>');
                this.host.append(this.clear);
            }

            this.checkMark = $(this.checkbox[0].firstChild.firstChild);//$(this.checkbox).find('span');
            this.box = this.checkbox;

            this.box.addClass(this.toThemeProperty('jqx-checkbox-default') + " " + this.toThemeProperty('jqx-fill-state-normal') + " " + this.toThemeProperty('jqx-rc-all'));

            if (this.disabled) {
                this.disable();
            }

            if (!this.disabledContainer) {
                this.host.addClass(this.toThemeProperty('jqx-widget'));
                this.host.addClass(this.toThemeProperty('jqx-checkbox'));
            }

            if (this.locked && !this.disabledContainer) {
                this.host.css('cursor', 'auto');
            }

            var checked = this.element.getAttribute('checked');
            if (checked == 'checked' || checked == 'true' || checked == true) {
                this.checked = true;
            }

            this._addInput();
            this._render();
            this._addHandlers();
            this.init = false;
            this._centerBox();
        },

        _centerBox: function ()
        {
            if (this.height && this.height.toString().indexOf("%") == -1 && this.box)
            {
                var hostHeight = parseInt(this.height);
                this.host.css('line-height', hostHeight + "px");
                var top = hostHeight - parseInt(this.boxSize) - 1;
                top /= 2;
                this.box.css('margin-top', parseInt(top));
            }
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
            this.refresh();
        },

        setSize: function () {
            if (this.width != null && this.width.toString().indexOf("px") != -1) {
                this.host.width(this.width);
            }
            else if (this.width != undefined && !isNaN(this.width)) {
                    this.host.width(this.width);
            }
            else if (this.width != null && this.width.toString().indexOf("%") != -1)
            {
                this.element.style.width = this.width;
            }

            if (this.height != null && this.height.toString().indexOf("px") != -1) {
                this.host.height(this.height);
            }
            else if (this.height != undefined && !isNaN(this.height)) {
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

            var isTouchDevice = $.jqx.mobile.isTouchDevice();
            var eventName = 'mousedown';
            if (isTouchDevice) eventName = $.jqx.mobile.getTouchEventName('touchend');

            this.addHandler(this.box, eventName, function (event) {
                if (!me.disabled && !me.enableContainerClick && !me.locked) {
                    me.changeType = "mouse";
                    me.toggle();
                    if (me.updated) {
                        event.owner = me;
                        me.updated(event, me.checked, me.oldChecked);
                    }
                    if (event.preventDefault) {
                        event.preventDefault();
                    }
                    return false;
                }
            });

            if (!this.disabledContainer) {
                this.addHandler(this.host, 'keydown', function (event) {
                    if (!me.disabled && !me.locked && me.keyboardCheck) {
                        if (event.keyCode == 32) {
                            if (!me._canFocus) {
                                return true;
                            }
                            me.changeType = "keyboard";
                            me.toggle();
                            if (me.updated) {
                                event.owner = me;
                                me.updated(event, me.checked, me.oldChecked);
                            }
                            if (event.preventDefault) {
                                event.preventDefault();
                            }
                            return false;
                        }
                    }
                });

                this.addHandler(this.host, eventName, function (event) {
                    if (!me.disabled && me.enableContainerClick && !me.locked) {
                        me.changeType = "mouse";
                        me.toggle();
                        if (event.preventDefault) {
                            event.preventDefault();
                        }
                        if (me._canFocus) {
                            me.focus();
                        }
                        return false;
                    }
                });

                this.addHandler(this.host, 'selectstart', function (event) {
                    if (!me.disabled && me.enableContainerClick) {
                        if (event.preventDefault) {
                            event.preventDefault();
                        }
                        return false;
                    }
                });

                this.addHandler(this.host, 'mouseup', function (event) {
                    if (!me.disabled && me.enableContainerClick) {
                        if (event.preventDefault) {
                            event.preventDefault();
                        }
                    }
                });

                this.addHandler(this.host, 'focus', function (event) {
                    if (!me.disabled && !me.locked) {
                        if (!me._canFocus) {
                            return true;
                        }

                        if (me.enableHover) {
                            me.box.addClass(me.toThemeProperty('jqx-checkbox-hover'));
                        }
                        me.box.addClass(me.toThemeProperty('jqx-fill-state-focus'));
                        if (event.preventDefault) {
                            event.preventDefault();
                        }
                        me.hovered = true;
                        return false;
                    }
                });

                this.addHandler(this.host, 'blur', function (event) {
                    if (!me.disabled && !me.locked) {
                        if (!me._canFocus) {
                            return true;
                        }
                        if (me.enableHover) {
                            me.box.removeClass(me.toThemeProperty('jqx-checkbox-hover'));
                        }
                        me.box.removeClass(me.toThemeProperty('jqx-fill-state-focus'));
                        if (event.preventDefault) {
                            event.preventDefault();
                        }
                        me.hovered = false;
                        return false;
                    }
                });

                this.addHandler(this.host, 'mouseenter', function (event) {
                    if (me.locked) {
                        me.host.css('cursor', 'arrow')
                    }
                    if (me.enableHover) {
                        if (!me.disabled && me.enableContainerClick && !me.locked) {
                            me.box.addClass(me.toThemeProperty('jqx-checkbox-hover'));
                            me.box.addClass(me.toThemeProperty('jqx-fill-state-hover'));
                            if (event.preventDefault) {
                                event.preventDefault();
                            }
                            me.hovered = true;
                            return false;
                        }
                    }
                });

                this.addHandler(this.host, 'mouseleave', function (event) {
                    if (me.enableHover) {
                        if (!me.disabled && me.enableContainerClick && !me.locked) {
                            me.box.removeClass(me.toThemeProperty('jqx-checkbox-hover'));
                            me.box.removeClass(me.toThemeProperty('jqx-fill-state-hover'));
                            if (event.preventDefault) {
                                event.preventDefault();
                            }
                            me.hovered = false;
                            return false;
                        }
                    }
                });

                this.addHandler(this.box, 'mouseenter', function () {
                    if (me.locked) {
                        return;
                    }

                    if (!me.disabled && !me.enableContainerClick) {
                        me.box.addClass(me.toThemeProperty('jqx-checkbox-hover'));
                        me.box.addClass(me.toThemeProperty('jqx-fill-state-hover'));
                    }
                });

                this.addHandler(this.box, 'mouseleave', function () {
                    if (!me.disabled && !me.enableContainerClick) {
                        me.box.removeClass(me.toThemeProperty('jqx-checkbox-hover'));
                        me.box.removeClass(me.toThemeProperty('jqx-fill-state-hover'));
                    }
                });
            }
        },

        focus: function () {
            try {
                this.host.focus();
            }
            catch (error) {
            }
        },

        _removeHandlers: function () {
            var isTouchDevice = $.jqx.mobile.isTouchDevice();
            var eventName = 'mousedown';
            if (isTouchDevice) eventName = 'touchend';

            if (this.box) {
                this.removeHandler(this.box, eventName);
                this.removeHandler(this.box, 'mouseenter');
                this.removeHandler(this.box, 'mouseleave');
            }
            this.removeHandler(this.host, eventName);
            this.removeHandler(this.host, 'mouseup');
            this.removeHandler(this.host, 'selectstart');
            this.removeHandler(this.host, 'mouseenter');
            this.removeHandler(this.host, 'mouseleave');
            this.removeHandler(this.host, 'keydown');
            this.removeHandler(this.host, 'blur');
            this.removeHandler(this.host, 'focus');
        },

        _render: function () {
            if (!this.disabled) {
                if (this.enableContainerClick) {
                    this.host.css('cursor', 'pointer');
                }
                else
                    if (!this.init) {
                        this.host.css('cursor', 'auto');
                    }
            }
            else {
                this.disable();
            }
            if (this.rtl) {
                this.box.addClass(this.toThemeProperty('jqx-checkbox-rtl'));
                this.host.addClass(this.toThemeProperty('jqx-rtl'));
            }

            this.updateStates();
        },

        _setState: function (checked, locked) {
            if (this.checked != checked) {
                this.checked = checked;
                if (this.checked) {
                    this.checkMark[0].className = this.toThemeProperty('jqx-checkbox-check-checked');
                }
                else if (this.checked == null) {
                    this.checkMark[0].className = this.toThemeProperty('jqx-checkbox-check-indeterminate');
                }
                else {
                    this.checkMark[0].className = "";
                }
            }
            if (locked === false || locked === true)
                this.locked = locked;
        },

        val: function (value) {
            if (arguments.length == 0 || (value != null && typeof (value) == "object")) {
                return this.checked;
            }

            if (typeof value == "string") {
                if (value == "true") this.check();
                if (value == "false") this.uncheck();
                if (value == "") this.indeterminate();
            }
            else {
                if (value == true) this.check();
                if (value == false) this.uncheck();
                if (value == null) this.indeterminate();
            }
            return this.checked;
        },

        // checks the ckeckbox.
        check: function () {
            this.checked = true;
            var me = this;
            this.checkMark.removeClass();

            if ($.jqx.browser.msie || this.animationShowDelay == 0) {
                this.checkMark.addClass(this.toThemeProperty('jqx-checkbox-check-checked'));
            }
            else {
                this.checkMark.addClass(this.toThemeProperty('jqx-checkbox-check-checked'));
                this.checkMark.css('opacity', 0);
                this.checkMark.stop().animate({ opacity: 1 }, this.animationShowDelay, function () {
                });
            }

            if (this.groupName != null && this.groupName.length > 0) {
                var checkboxes = $.find(this.toThemeProperty('.jqx-checkbox', true));
                $.each(checkboxes, function () {
                    var groupName = $(this).jqxCheckBox('groupName');
                    if (groupName == me.groupName && this != me.element) {
                        $(this).jqxCheckBox('uncheck')
                    }
                });
            }

            this._raiseEvent('0', true);
            this._raiseEvent('3', { checked: true });
            if (this.input != undefined) {
                this.input.val(this.checked);
                $.jqx.aria(this, "aria-checked", this.checked);
            }
        },

        // unchecks the checkbox.
        uncheck: function () {
            this.checked = false;
            var me = this;

            if ($.jqx.browser.msie || this.animationHideDelay == 0) {
                if (me.checkMark[0].className != "") {
                    me.checkMark[0].className = "";
                }
            }
            else {
                this.checkMark.css('opacity', 1);
                this.checkMark.stop().animate({ opacity: 0 }, this.animationHideDelay, function () {
                    if (me.checkMark[0].className != "") {
                        me.checkMark[0].className = "";
                    }
                });
            }

            this._raiseEvent('1');
            this._raiseEvent('3', { checked: false });
            if (this.input != undefined) {
                this.input.val(this.checked);
                $.jqx.aria(this, "aria-checked", this.checked);
            }
        },

        // sets the indeterminate state.
        indeterminate: function () {
            this.checked = null;
            this.checkMark.removeClass();

            if ($.jqx.browser.msie || this.animationShowDelay == 0) {
                this.checkMark.addClass(this.toThemeProperty('jqx-checkbox-check-indeterminate'));
            }
            else {
                this.checkMark.addClass(this.toThemeProperty('jqx-checkbox-check-indeterminate'));
                this.checkMark.css('opacity', 0);
                this.checkMark.stop().animate({ opacity: 1 }, this.animationShowDelay, function () {
                });
            }

            this._raiseEvent('2');
            this._raiseEvent('3', { checked: null });
            if (this.input != undefined) {
                this.input.val(this.checked);
                $.jqx.aria(this, "aria-checked", "undefined");
            }
        },

        // toggles the check state.
        toggle: function () {
            if (this.disabled)
                return;

            if (this.locked)
                return;

            if (this.groupName != null && this.groupName.length > 0) {
                if (this.checked != true) {
                    this.checked = true;
                    this.updateStates();
                }
                return;
            }

            this.oldChecked = this.checked;
            if (this.checked == true) {
                this.checked = this.hasThreeStates ? null : false;
            }
            else {
                this.checked = this.checked != null;
            }

            this.updateStates();
            if (this.input != undefined) {
                this.input.val(this.checked);
            }
        },

        // updates check states depending on the value of the 'checked' property.
        updateStates: function () {
            if (this.checked) {
                this.check();
            }
            else if (this.checked == false) {
                this.uncheck();
            }
            else if (this.checked == null) {
                this.indeterminate();
            }
        },

        // disables the checkbox.
        disable: function () {
            this.disabled = true;

            if (this.checked == true) {
                this.checkMark.addClass(this.toThemeProperty('jqx-checkbox-check-disabled'));
            }
            else if (this.checked == null) {
                this.checkMark.addClass(this.toThemeProperty('jqx-checkbox-check-indeterminate-disabled'));
            }
            this.box.addClass(this.toThemeProperty('jqx-checkbox-disabled-box'));
            this.host.addClass(this.toThemeProperty('jqx-checkbox-disabled'));
            this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
            this.box.addClass(this.toThemeProperty('jqx-checkbox-disabled'));
            $.jqx.aria(this, "aria-disabled", this.disabled);
        },

        // enables the checkbox.
        enable: function () {
            if (this.checked == true) {
                this.checkMark.removeClass(this.toThemeProperty('jqx-checkbox-check-disabled'));
            }
            else if (this.checked == null) {
                this.checkMark.removeClass(this.toThemeProperty('jqx-checkbox-check-indeterminate-disabled'));
            }
            this.box.removeClass(this.toThemeProperty('jqx-checkbox-disabled-box'));
            this.host.removeClass(this.toThemeProperty('jqx-checkbox-disabled'));
            this.host.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
            this.box.removeClass(this.toThemeProperty('jqx-checkbox-disabled'));
            this.disabled = false;
            $.jqx.aria(this, "aria-disabled", this.disabled);
        },

        destroy: function () {
            this.host.remove();
        },

        _raiseEvent: function (id, args) {
            if (this.init) return;
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

            if (key == "enableContainerClick" && !object.disabled && !object.locked) {
                if (value) {
                    object.host.css('cursor', 'pointer');
                }
                else object.host.css('cursor', 'auto');
            }

            if (key == "rtl") {
                if (value) {
                    object.box.addClass(object.toThemeProperty('jqx-checkbox-rtl'));
                    object.host.addClass(object.toThemeProperty('jqx-rtl'));
                }
                else {
                    object.box.removeClass(object.toThemeProperty('jqx-checkbox-rtl'));
                    object.host.removeClass(object.toThemeProperty('jqx-rtl'));
                }
            }

            if (key == "boxSize") {
                object.render();
            }

            if (key == 'theme') {
                $.jqx.utilities.setTheme(oldvalue, value, object.host);
            }

            if (key == 'checked') {
                if (value != oldvalue) {
                    switch (value) {
                        case true:
                            object.check();
                            break;
                        case false:
                            object.uncheck();
                            break;
                        case null:
                            object.indeterminate();
                            break;
                    }
                }
            }

            if (key == 'disabled') {
                if (value != oldvalue) {
                    if (value) {
                        object.disable();
                    } else object.enable();
                }
            }
        }
    });
})(jqxBaseFramework);

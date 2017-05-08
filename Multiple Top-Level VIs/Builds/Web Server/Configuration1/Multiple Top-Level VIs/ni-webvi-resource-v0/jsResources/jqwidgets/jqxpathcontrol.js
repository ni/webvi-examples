(function ($)
{
    'use strict';

    $.jqx.jqxWidget('jqxPathControl', '', {});

    $.extend($.jqx._jqxPathControl.prototype, {
        defineInstance: function ()
        {
            var settings = {
                // properties
                width: null,
                height: 'auto',
                path: '',
                pathFormat: 'windows', // possible values: 'windows', 'unix', 'custom'
                customDrive: false,
                customDirectorySeparator: null,
                fileDrop: true,
                accept: '.*', // possible values
                placeHolder: 'Not a Path.',
                readOnly: false,
                browseButtonText: '...',
                browseFunction: null, // callback function
                disabled: false,
                rtl: false,

                // events
                events: ['change', 'formatChange', 'fileDrop']
            };
            $.extend(true, this, settings);
        },

        createInstance: function ()
        {
            this._render(true);
        },

        // renders the widget
        _render: function (initial)
        {
            var that = this;

            // constructs the path based on the "path" and "pathFormat" properties
            that._constructPath(that.path);

            // sets the width and height of the widget
            that._setSize();

            if (initial === true)
            {
                // appends necessary visual elements
                that._appendElements();
            } else
            {
                // removes event handlers
                that._removeHandlers();
            }

            // adds event handlers
            that._addHandlers();

            // adds the necessary classes for the widget
            that._addClasses();

            // validates the file extension
            that._validateExtension();
        },

        // renders the widget (public method)
        render: function ()
        {
            this._render(false);
        },

        // refreshes the widget
        refresh: function (initialRefresh)
        {
            if (initialRefresh !== true)
            {
                this._render(false);
            }
        },

        // destroys the widget
        destroy: function ()
        {
            var that = this;
            that._removeHandlers();
            that.host.remove();
        },

        // sets or gets the (optionally formatted) value of the widget
        val: function (value)
        {
            var that = this;

            if (value === undefined || typeof value !== 'string' && $.isEmptyObject(value))
            {
                return that.path;
            } else if (value === 'windows' || value === 'unix' || value === 'custom')
            {
                return that._formatPath(value);
            } else
            {
                var oldPath = that._input.val();
                that._constructPath(value);
                if (that.path !== oldPath)
                {
                    that._input.val(that.path);
                    that._raiseEvent('0', { path: that.path, oldPath: oldPath }); // change event
                    that._validateExtension();
                }
            }
        },

        // clears the path
        _clear: function ()
        {
            var that = this;

            that._drive = undefined;
            that._pathArray = [];
            that.path = '';
            that._input.val('');
        },

        // clears the path (public method)
        clear: function ()
        {
            var that = this;

            if (that.path !== '')
            {
                var oldPath = that.path;
                that._clear();
                that._raiseEvent('0', { path: that.path, oldPath: oldPath }); // change event
            }
        },

        // invokes the browseFunction callback function
        browse: function ()
        {
            var that = this;

            if (that.browseFunction)
            {
                that.browseFunction(that.path);
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value)
        {
            if (value !== oldvalue)
            {
                switch (key)
                {
                    case 'width':
                        object.host.css('width', value);
                        break;
                    case 'height':
                        object.host.css('height', value);
                        break;
                    case 'path':
                        object.val(value);
                        break;
                    case 'pathFormat':
                        var oldPath = object.path;
                        object.path = object._formatPath(value, true);
                        object._input.val(object.path);
                        object._raiseEvent('1', { format: value, oldFormat: oldvalue, path: object.path, oldPath: oldPath }); // formatChange event
                        break;
                    case 'customDrive':
                    case 'customDirectorySeparator':
                        if (object.pathFormat === 'custom')
                        {
                            object.path = object._formatPath('custom', true);
                            object._input.val(object.path);
                        }
                        break;
                    case 'accept':
                        object._validateExtension();
                        break;
                    case 'placeHolder':
                        object._input.attr('placeholder', value);
                        break;
                    case 'readOnly':
                        if (value === true)
                        {
                            object._input.attr('readonly', '');
                        } else
                        {
                            object._input.removeAttr('readonly');
                        }
                        break;
                    case 'browseButtonText':
                        object._button.text(value);
                        var buttonWidth = object._button.outerWidth();
                        object._input[0].style.width = 'calc(100% - ' + (buttonWidth + 7) + 'px)';
                        break;
                    case 'disabled':
                        if (value === true)
                        {
                            object.host.addClass(object.toThemeProperty('jqx-fill-state-disabled'));
                            object._input.attr('disabled', 'disabled');
                            object._button.addClass(object.toThemeProperty('jqx-path-control-button-disabled'));
                            object._button.jqxButton({ disabled: true });
                        } else
                        {
                            object.host.removeClass(object.toThemeProperty('jqx-fill-state-disabled'));
                            object._input.removeAttr('disabled');
                            object._button.removeClass(object.toThemeProperty('jqx-path-control-button-disabled'));
                            object._button.jqxButton({ disabled: false });
                        }
                        break;
                    case 'rtl':
                        if (value === true)
                        {
                            object._input.addClass(object.toThemeProperty('jqx-path-control-input-rtl'));
                            object._button.removeClass(object.toThemeProperty('jqx-path-control-button-ltr'));
                            object._button.addClass(object.toThemeProperty('jqx-path-control-button-rtl'));
                        } else
                        {
                            object._input.removeClass(object.toThemeProperty('jqx-path-control-input-rtl'));
                            object._button.removeClass(object.toThemeProperty('jqx-path-control-button-rtl'));
                            object._button.addClass(object.toThemeProperty('jqx-path-control-button-ltr'));
                        }
                        object._button.jqxButton({ rtl: value });
                        break;
                }
            }
        },

        // raises an event
        _raiseEvent: function (id, arg)
        {
            if (arg === undefined)
            {
                arg = { owner: null };
            }

            var evt = this.events[id];
            arg.owner = this;

            var event = new $.Event(evt);
            event.owner = this;
            event.args = arg;
            if (event.preventDefault)
            {
                event.preventDefault();
            }

            var result = this.host.trigger(event);
            return result;
        },

        // constructs the path
        _constructPath: function (initialPath)
        {
            var that = this,
                tempPath = initialPath;
            that._pathArray = [];
            that._drive = undefined;

            tempPath = tempPath.replace(/\//g, '>');
            tempPath = tempPath.replace(/\\/g, '>');
            if (that.customDirectorySeparator)
            {
                var customDirectorySeparatorRegExp = new RegExp('\\' + that.customDirectorySeparator, 'g');
                tempPath = tempPath.replace(customDirectorySeparatorRegExp, '>');
            }

            var colonIndex = tempPath.indexOf(':');
            if (colonIndex !== -1)
            {
                that._drive = tempPath.slice(0, colonIndex);
                tempPath = tempPath.slice(colonIndex + 2);
            } else if (tempPath.charAt(0) === '>')
            {
                that._drive = tempPath.slice(1, (tempPath.slice(1).indexOf('>') + 1));
                tempPath = tempPath.slice(tempPath.indexOf(that._drive) + that._drive.length + 1);
            }
            that._pathArray = tempPath.split('>');

            that.path = that._formatPath(that.pathFormat, true);
        },

        // changes the path's format
        _formatPath: function (format, override)
        {
            var that = this;
            if (format !== that.pathFormat || override === true)
            {
                var formattedPath = '', separator;

                switch (format)
                {
                    case 'windows':
                        if (that._drive)
                        {
                            formattedPath += that._drive + ':\\';
                        }
                        separator = '\\';
                        break;
                    case 'unix':
                        if (that._drive)
                        {
                            formattedPath += '/' + that._drive + '/';
                        }
                        separator = '/';
                        break;
                    case 'custom':
                        if (that._drive)
                        {
                            if (that.customDrive === true)
                            {
                                formattedPath += that._drive + ':' + that.customDirectorySeparator;
                            } else
                            {
                                formattedPath += that.customDirectorySeparator;
                            }
                        }
                        separator = that.customDirectorySeparator;
                        break;
                }

                for (var i = 0; i < that._pathArray.length; i++)
                {
                    formattedPath += that._pathArray[i];
                    if (i !== that._pathArray.length - 1)
                    {
                        formattedPath += separator;
                    }
                }

                return formattedPath;
            } else
            {
                return that.path;
            }
        },

        // sets the width and height of the widget
        _setSize: function ()
        {
            var that = this;

            that.host.css('width', that.width);
            that.host.css('height', that.height);
        },

        // appends necessary visual elements
        _appendElements: function ()
        {
            var that = this;

            var readOnly = that.readOnly ? 'readonly' : '';
            var disabled = that.disabled ? 'disabled' : '';

            // path input
            that._input = $('<input type="text" placeholder="' + that.placeHolder + '" ' + readOnly + ' ' +
                disabled + ' class="' + that.toThemeProperty('jqx-path-control-input') + ' ' +
                that.toThemeProperty('jqx-input') + ' ' + that.toThemeProperty('jqx-widget-content') + ' ' +
                that.toThemeProperty('jqx-rc-all') + '" value="' + that.path + '" />');
            that.host.append(that._input);

            // "Browse" button
            that._button = $('<button class="' + that.toThemeProperty('jqx-path-control-button') + '">' + that.browseButtonText + '</button>');
            that.host.append(that._button);
            that._button.jqxButton({ theme: that.theme, height: '100%', disabled: that.disabled, rtl: that.rtl });

            var buttonWidth = that._button.outerWidth();
            that._input[0].style.width = 'calc(100% - ' + (buttonWidth + 7) + 'px)';

            if (that.rtl === true)
            {
                that._input.addClass(that.toThemeProperty('jqx-path-control-input-rtl'));
                that._button.addClass(that.toThemeProperty('jqx-path-control-button-rtl'));
            } else
            {
                that._button.addClass(that.toThemeProperty('jqx-path-control-button-ltr'));
            }
        },

        // adds the necessary classes for the widget
        _addClasses: function ()
        {
            var that = this;

            that.host.addClass(that.toThemeProperty('jqx-widget'));
            that.host.addClass(that.toThemeProperty('jqx-fill-state-normal'));
            that.host.addClass(that.toThemeProperty('jqx-rc-all'));
            that.host.addClass(that.toThemeProperty('jqx-path-control'));
            that.host.addClass(that.toThemeProperty('jqx-path-control-transparent-border'));

            if (that.disabled === true)
            {
                that.host.addClass(that.toThemeProperty('jqx-fill-state-disabled'));
                that._button.addClass(that.toThemeProperty('jqx-path-control-button-disabled'));
            }
        },

        // adds event handlers
        _addHandlers: function ()
        {
            var that = this;
            var id = that.element.id;

            that.addHandler(that._input, 'focus.jqxPathControl' + id, function ()
            {
                that._input.addClass(that.toThemeProperty('jqx-fill-state-focus'));
            });

            that.addHandler(that._input, 'blur.jqxPathControl' + id, function ()
            {
                that._input.removeClass(that.toThemeProperty('jqx-fill-state-focus'));
            });

            var restrictedKeyCodes = ['56', '188', '190', '191', '220', '222']; // restricted characters: * < > ? | "

            that.addHandler(that._input, 'keydown.jqxPathControl' + id, function (event)
            {
                // character validation
                var keyCode = !event.charCode ? event.which : event.charCode;

                var restricted = (event.shiftKey === true) && (restrictedKeyCodes.indexOf(keyCode.toString()) !== -1) || keyCode === 106;

                if (restricted === true)
                {
                    event.preventDefault();
                }
            });

            that.addHandler(that._input, 'change.jqxPathControl' + id, function (event)
            {
                event.stopPropagation();
                var newValue = event.target.value;
                var oldValue = that.path;
                if (newValue === '')
                {
                    that._clear();
                } else
                {
                    that._constructPath(newValue);
                    that._validateExtension();
                }
                that._input.val(that.path);
                that._raiseEvent('0', { path: that.path, oldPath: oldValue }); // change event
            });

            that.addHandler(that._button, 'click.jqxPathControl' + id, function ()
            {
                that.browse();
            });

            that.addHandler(that.host, 'dragenter.jqxPathControl' + id, function (event)
            {
                event.preventDefault();
                event.stopPropagation();
            });

            that.addHandler(that.host, 'dragleave.jqxPathControl' + id, function (event)
            {
                event.preventDefault();
                event.stopPropagation();
                if (that.fileDrop === true)
                {
                    that.host.addClass(that.toThemeProperty('jqx-path-control-transparent-border'));
                }
            });

            that.addHandler(that.host, 'dragover.jqxPathControl' + id, function (event)
            {
                event.preventDefault();
                event.stopPropagation();
                if (that.fileDrop === true)
                {
                    that.host.removeClass(that.toThemeProperty('jqx-path-control-transparent-border'));
                } else
                {
                    event.originalEvent.dataTransfer.dropEffect = 'none';
                }
            });

            that.addHandler(that.host, 'drop.jqxPathControl' + id, function (event)
            {
                event.preventDefault();
                event.stopPropagation();
                if (that.fileDrop === true)
                {
                    if (event.originalEvent.dataTransfer && event.originalEvent.dataTransfer.files && event.originalEvent.dataTransfer.files.length)
                    {
                        var fileName = event.originalEvent.dataTransfer.files[0].name;
                        that._raiseEvent('2', { fileName: fileName }); // fileDrop event
                        that.val(fileName);
                    }
                    that.host.addClass(that.toThemeProperty('jqx-path-control-transparent-border'));
                }
            });
        },

        // removes event handlers
        _removeHandlers: function ()
        {
            var that = this;
            var id = that.element.id;

            that.removeHandler(that._input, 'focus.jqxPathControl' + id);
            that.removeHandler(that._input, 'blur.jqxPathControl' + id);
            that.removeHandler(that._input, 'keydown.jqxPathControl' + id);
            that.removeHandler(that._input, 'change.jqxPathControl' + id);
            that.removeHandler(that._button, 'click.jqxPathControl' + id);
            that.removeHandler(that.host, 'dragenter.jqxPathControl' + id);
            that.removeHandler(that.host, 'dragleave.jqxPathControl' + id);
            that.removeHandler(that.host, 'dragover.jqxPathControl' + id);
            that.removeHandler(that.host, 'drop.jqxPathControl' + id);
        },

        // validates the file extension
        _validateExtension: function ()
        {
            var that = this;

            if (that.accept !== '.*' && that.path !== '')
            {
                var dotIndex = that.path.lastIndexOf('.');
                var nextCharacter = that.path.charAt(dotIndex + 1);
                if (dotIndex !== -1 && that.path.charAt(dotIndex - 1) !== '.' && nextCharacter !== '' && (that.pathFormat === 'windows' && nextCharacter !== '\\' || that.pathFormat === 'unix' && nextCharacter !== '/' || that.pathFormat === 'custom' && nextCharacter !== that.customDirectorySeparator))
                {
                    var fileExtension = that.path.slice(dotIndex);
                    if (fileExtension.toLowerCase() === that.accept.toLowerCase())
                    {
                        that._input.removeClass(that.toThemeProperty('jqx-path-control-input-invalid'));
                    } else
                    {
                        that._input.addClass(that.toThemeProperty('jqx-path-control-input-invalid'));
                    }
                } else
                {
                    that._input.removeClass(that.toThemeProperty('jqx-path-control-input-invalid'));
                }
            } else
            {
                that._input.removeClass(that.toThemeProperty('jqx-path-control-input-invalid'));
            }
        }
    });
})(jqxBaseFramework); //ignore jslint

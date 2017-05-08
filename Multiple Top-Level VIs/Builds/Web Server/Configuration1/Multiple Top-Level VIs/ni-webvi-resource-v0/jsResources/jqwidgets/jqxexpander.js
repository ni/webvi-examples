/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($) {
    'use strict';
    $.jqx.jqxWidget('jqxExpander', '', {});

    $.extend($.jqx._jqxExpander.prototype, {

        defineInstance: function () {
            var settings =
            {
                //// properties
                width: 'auto',
                height: 'auto',
                expanded: true, // possible values: true, false
                expandAnimationDuration: 259,
                collapseAnimationDuration: 250,
                animationType: 'slide', // possible values: 'slide', 'fade', 'none'
                toggleMode: 'click', //possible values: 'click', 'dblclick', 'none'
                showArrow: true, // possible values: true, false
                arrowPosition: 'right', // possible values: 'left', 'right'
                headerPosition: 'top', // possible values: 'top', 'bottom'
                disabled: false, // possible values: true, false
                initContent: null, // callback function
                rtl: false, // possible values: true, false
                easing: 'easeInOutSine', // possible values: easeOutBack, easeInQuad, easeInOutCirc, easeInOutSine, easeInCubic, easeOutCubic, easeInOutCubic, easeInSine, easeOutSine, easeInOutSine
                aria:
                 {
                     'aria-disabled': { name: 'disabled', type: 'boolean' }
                 },
                //// events
                events: ['expanding', 'expanded', 'collapsing', 'collapsed', 'resize']
            };
            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function () {
            this._isTouchDevice = $.jqx.mobile.isTouchDevice();
            $.jqx.aria(this);
            // saves the initial HTML structure in a variable
            this._cachedHTMLStructure = this.host.html();

            // renders the widget
            this._rendered = false;
            this.render();
            this._rendered = true;
        },

        //// methods

        //// public methods

        // expands the content
        expand: function () {
            if (this.disabled === false && this.expanded === false && this._expandChecker == 1) {
                var that = this;
                this._expandChecker = 0;
                this._raiseEvent('0');
                this._header.removeClass(this.toThemeProperty('jqx-fill-state-normal'));
                this._header.addClass(this.toThemeProperty('jqx-fill-state-pressed jqx-expander-header-expanded'));
                if (this.headerPosition == 'top') {
                    this._arrow.removeClass(this.toThemeProperty('jqx-icon-arrow-down jqx-icon-arrow-down-hover jqx-icon-arrow-up-hover jqx-icon-arrow-down-selected jqx-expander-arrow-top'));
                    this._arrow.addClass(this.toThemeProperty('jqx-icon-arrow-up jqx-icon-arrow-up-selected jqx-expander-arrow-bottom jqx-expander-arrow-expanded'));
                } else if (this.headerPosition == 'bottom') {
                    this._arrow.removeClass(this.toThemeProperty('jqx-icon-arrow-up jqx-icon-arrow-up-selected jqx-icon-arrow-down-hover jqx-icon-arrow-up-hover jqx-expander-arrow-bottom'));
                    this._arrow.addClass(this.toThemeProperty('jqx-icon-arrow-down jqx-expander-arrow-top jqx-expander-arrow-expanded-top'));
                }
                switch (this.animationType) {
                    case 'slide':
                        if (this.headerPosition == 'top') {
                            this._content.slideDown({
                                duration: this.expandAnimationDuration,
                                easing: this.easing,
                                complete: function () {
                                    that.expanded = true;
                                    $.jqx.aria(that._header, 'aria-expanded', true);
                                    $.jqx.aria(that._content, 'aria-hidden', false);

                                    that._raiseEvent('1');
                                    if (that.initContent && that._initialized === false) {
                                        that.initContent();
                                        that._initialized = true;
                                    }
                                }
                            });
                        } else if (this.headerPosition == 'bottom') {
                            this._contentElement.style.display = '';
                            this._contentElement.style.height = '0px';
                            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                                this._contentElement.style.display = 'block';
                            }

                            if (this._cntntEmpty === true) {
                                this._content.animate({
                                    height: 0
                                }, {
                                    duration: this.expandAnimationDuration,
                                    easing: this.easing,
                                    complete: function () {
                                        that.expanded = true;
                                        $.jqx.aria(that._header, 'aria-expanded', true);
                                        $.jqx.aria(that._content, 'aria-hidden', false);
                                        that._raiseEvent('1');
                                        if (that.initContent && that._initialized === false) {
                                            that.initContent();
                                            that._initialized = true;
                                        }
                                    }
                                });
                            } else {
                                this._content.animate({
                                    height: this._contentHeight
                                }, {
                                    duration: this.expandAnimationDuration,
                                    easing: this.easing,
                                    complete: function () {
                                        that.expanded = true;
                                        $.jqx.aria(that._header, 'aria-expanded', true);
                                        $.jqx.aria(that._content, 'aria-hidden', false);
                                        that._raiseEvent('1');
                                        if (that.initContent && that._initialized === false) {
                                            that.initContent();
                                            that._initialized = true;
                                        }
                                    }
                                });
                            }
                        }
                        break;
                    case 'fade':
                        this._content.fadeIn({
                            duration: this.expandAnimationDuration,
                            easing: this.easing,
                            complete: function () {
                                that.expanded = true;
                                $.jqx.aria(that._header, 'aria-expanded', true);
                                $.jqx.aria(that._content, 'aria-hidden', false);
                                that._raiseEvent('1');
                                if (that.initContent && that._initialized === false) {
                                    that.initContent();
                                    that._initialized = true;
                                }
                            }
                        });
                        break;
                    case 'none':
                        this._contentElement.style.display = '';
                        this.expanded = true;
                        $.jqx.aria(that._header, 'aria-expanded', true);
                        $.jqx.aria(that._content, 'aria-hidden', false);
                        this._raiseEvent('1');
                        if (this.initContent && this._initialized === false) {
                            this.initContent();
                            this._initialized = true;
                        }
                        break;
                }
            }
        },

        // collapses the content
        collapse: function () {
            if (this.disabled === false && this.expanded === true && this._expandChecker === 0) {
                var that = this;
                this._expandChecker = 1;
                this._raiseEvent('2');
                this._header.removeClass(this.toThemeProperty('jqx-fill-state-pressed jqx-expander-header-expanded'));
                this._header.addClass(this.toThemeProperty('jqx-fill-state-normal'));
                if (this.headerPosition == 'top') {
                    this._arrow.removeClass(this.toThemeProperty('jqx-icon-arrow-up jqx-icon-arrow-up-selected jqx-expander-arrow-bottom jqx-expander-arrow-expanded'));
                    this._arrow.addClass(this.toThemeProperty('jqx-icon-arrow-down jqx-expander-arrow-top'));
                    if (that._hovered) {
                        this._arrow.addClass(this.toThemeProperty('jqx-icon-arrow-down-hover'));
                    }
                } else if (this.headerPosition == 'bottom') {
                    this._arrow.removeClass(this.toThemeProperty('jqx-icon-arrow-down jqx-icon-arrow-down-selected jqx-expander-arrow-top jqx-expander-arrow-expanded-top'));
                    this._arrow.addClass(this.toThemeProperty('jqx-icon-arrow-up jqx-expander-arrow-bottom'));
                    if (that._hovered) {
                        this._arrow.addClass(this.toThemeProperty('jqx-icon-arrow-up-hover'));
                    }
                }
                switch (this.animationType) {
                    case 'slide':
                        if (this.headerPosition == 'top') {
                            this._content.slideUp({
                                duration: this.collapseAnimationDuration,
                                easing: this.easing,
                                complete: function () {
                                    that.expanded = false;
                                    $.jqx.aria(that._header, 'aria-expanded', false);
                                    $.jqx.aria(that._content, 'aria-hidden', true);
                                    that._raiseEvent('3');
                                }
                            });
                        } else if (this.headerPosition == 'bottom') {
                            this._content.animate({
                                height: 0
                            }, {
                                duration: this.expandAnimationDuration,
                                easing: this.easing,
                                complete: function () {
                                    that._contentElement.style.display = 'none';
                                    that.expanded = false;
                                    $.jqx.aria(that._header, 'aria-expanded', false);
                                    $.jqx.aria(that._content, 'aria-hidden', true);
                                    that._raiseEvent('3');
                                }
                            });
                        }
                        break;
                    case 'fade':
                        this._content.fadeOut({
                            duration: this.collapseAnimationDuration,
                            easing: this.easing,
                            complete: function () {
                                that.expanded = false;
                                $.jqx.aria(that._header, 'aria-expanded', false);
                                $.jqx.aria(that._content, 'aria-hidden', true);
                                that._raiseEvent('3');
                            }
                        });
                        break;
                    case 'none':
                        that._contentElement.style.display = 'none';
                        this.expanded = false;
                        $.jqx.aria(that._header, 'aria-expanded', false);
                        $.jqx.aria(that._content, 'aria-hidden', true);
                        this._raiseEvent('3');
                        break;
                }
            }
        },

        // sets the header's content
        setHeaderContent: function (headerContent) {
            this._headerText.innerHTML = headerContent;
            this.invalidate();
        },

        // gets the header's content
        getHeaderContent: function () {
            return this._headerText.innerHTML;
        },

        // sets the content
        setContent: function (content) {
            this._content.html(content);
            this._checkContent();
            this.invalidate();
        },

        // gets the content
        getContent: function () {
            return this._content.html();
        },

        // enables the widget
        enable: function () {
            this.disabled = false;
            this.refresh();
            $.jqx.aria(this, 'aria-disabled', false);
        },

        // disables the widget
        disable: function () {
            this.disabled = true;
            this.refresh();
            $.jqx.aria(this, 'aria-disabled', true);
        },

        // refreshes the widget
        invalidate: function () {
            if ($.jqx.isHidden(this.host)) {
                return;
            }

            this._setSize();
        },

        // refreshes the widget
        refresh: function (initialRefresh) {
            if (initialRefresh === true) {
                return;
            }

            this._removeHandlers();
            if (this.showArrow === true) {
                this._arrowElement.style.display = '';
            } else {
                this._arrowElement.style.display = 'none';
            }
            this._setTheme();
            this._setSize();
            if (this.disabled === false) {
                this._toggle();
            }
            this._keyBoard();
        },

        // renders the widget
        render: function () {
            var that = this;

            if (that._rendered) {
                that.refresh();
                return;
            }

            this.widgetID = this.element.id;

            var hostChildren = this.host.children();
            this._headerText = hostChildren[0];

            this._headerElement = document.createElement('div');
            this._header = $(this._headerElement);

            this._contentElement = hostChildren[1];
            this._content = $(this._contentElement);
            if (this._content.initAnimate) {
                this._content.initAnimate();
            }

            if (this.headerPosition === 'top') {
                that.element.insertBefore(that._headerElement, that._headerText);
            } else {
                that.element.appendChild(that._headerElement);
            }
            that._headerElement.appendChild(that._headerText);

            // defines the header text section
            var className = this._headerText.className;
            this._headerElement.className = className;
            this._headerText.className = '';
            if (!this.rtl) {
                this._headerText.className += ' ' + that.toThemeProperty('jqx-expander-header-content');
            }
            else {
                this._headerText.className += ' ' + that.toThemeProperty('jqx-expander-header-content-rtl');
            }

            // appends an arrow to the header
            that._arrowElement = document.createElement('div');
            that._headerElement.appendChild(that._arrowElement);
            this._arrow = $(that._arrowElement);
            if (this.showArrow === true) {
                that._arrowElement.style.display = '';
            } else {
                that._arrowElement.style.display = 'none';
            }

            // sets the tabindex attribute of the header and conten if it is not already set
            if (this._headerElement.getAttribute('tabindex') === null && this._contentElement.getAttribute('tabindex') === null) {
                if (that.headerPosition === 'top') {
                    this._headerElement.setAttribute('tabindex', 1);
                    this._contentElement.setAttribute('tabindex', 2);
                } else {
                    this._headerElement.setAttribute('tabindex', 2);
                    this._contentElement.setAttribute('tabindex', 1);
                }
            }

            // sets the expander's theme and classes
            this._setTheme();

            // checks whether the HTML structure of the widget is valid and alerts the user if not
            var exceptionMessage = 'Invalid jqxExpander structure. Please add only two child div elements to your jqxExpander div that will represent the expander\'s header and content.';
            try {
                if (this._header.length === 0 || this._content.length === 0 || hostChildren.length < 2 || hostChildren.length > 2) {
                    throw exceptionMessage;
                }
            } catch (exception) {
                throw new Error(exception);
            }

            // sets the width and height of the widget
            this._setSize();

            // checks if content is expanded initially
            if (this.expanded === true) {
                if (this.headerPosition == 'top') {
                    this._arrow.addClass(this.toThemeProperty('jqx-icon-arrow-up jqx-icon-arrow-up-selected jqx-expander-arrow-bottom jqx-expander-arrow-expanded'));
                } else if (this.headerPosition == 'bottom') {
                    this._arrow.addClass(this.toThemeProperty('jqx-icon-arrow-down jqx-icon-arrow-down-selected jqx-expander-arrow-top jqx-expander-arrow-expanded-top'));
                }
                if (this.initContent) {
                    //this._setSize();
                    this.initContent();
                }
                this._initialized = true;
                this._expandChecker = 0;
            } else if (this.expanded === false) {
                this._arrow.removeClass(this.toThemeProperty('jqx-icon-arrow-down-selected jqx-icon-arrow-up-selected'));
                if (this.headerPosition == 'top') {
                    this._arrow.addClass(this.toThemeProperty('jqx-icon-arrow-down jqx-expander-arrow-top'));
                } else if (this.headerPosition == 'bottom') {
                    this._arrow.addClass(this.toThemeProperty('jqx-icon-arrow-up jqx-expander-arrow-bottom'));
                }
                this._initialized = false;
                this._expandChecker = 1;
                this._contentElement.style.display = 'none';
            }

            // checks if the content is empty
            this._checkContent();

            // toggles the widget
            if (this.disabled === false) {
                this._toggle();
            }

            // adds keyboard interaction
            this._keyBoard();

            $.jqx.utilities.resize(this.host, function () {
                that.invalidate();
            });
        },

        // removes the widget
        destroy: function () {
            this.removeHandler($(window), 'resize.expander' + this.widgetID);
            this.host.remove();
            $(this.element).removeData('jqxExpander');
        },

        // focuses on the widget
        focus: function () {
            try {
                if (this.disabled === false) {
                    this._headerElement.focus();
                }
            }
            catch (error) {
            }
        },

        //// private methods
        propertiesChangedHandler: function (object, key, value) {
            if (value.width && value.height && Object.keys(value).length == 2) {
                object._setSize();
            }
        },

        // called when a property is changed
        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length == 2) {
                return;
            }

            if (key == 'width' || key == 'height') {
                object._setSize();
                return;
            }

            if (key == 'expanded') {
                if (value === true && oldvalue === false) {
                    this.expanded = false;
                    this.expand();
                } else if (value === false && oldvalue === true) {
                    this.expanded = true;
                    this.collapse();
                }
            } else {
                this.refresh();
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

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            this._setSize();
        },

        // sets the width and height of the widget
        _setSize: function () {
            this.element.style.width = this._toPx(this.width);
            this.element.style.height = this._toPx(this.height);

            this._headerElement.style.height = 'auto';
            this._headerElement.style.minHeight = this._arrowElement.offsetHeight;

            // sets the arrow position
            var arrowPosition = this.arrowPosition;
            if (this.rtl) {
                switch (arrowPosition) {
                    case 'left':
                        arrowPosition = 'right';
                        break;
                    case 'right':
                        arrowPosition = 'left';
                        break;
                }
            }
            if (arrowPosition == 'right') {
                this._headerText.style['float'] = 'left';
                this._headerText.style.marginLeft = '0px';
                this._arrowElement.style['float'] = 'right';
                this._arrowElement.style.position = 'relative';
            } else if (arrowPosition == 'left') {
                if (this.width == 'auto') {
                    this._headerText.style['float'] = 'left';
                    this._headerText.style.marginLeft = '17px';
                    this._arrowElement.style['float'] = 'left';
                    this._arrowElement.style.position = 'absolute';
                } else {
                    this._headerText.style['float'] = 'right';
                    this._headerText.style.marginLeft = '0px';
                    this._arrowElement.style['float'] = 'left';
                    this._arrowElement.style.position = 'relative';
                }
            }
            this._arrowElement.style.marginTop = (this._headerText.offsetHeight / 2 - this._arrowElement.offsetHeight / 2) + 'px';

            this._contentElement.style.height = 'auto';
            var actualContentHeight = Math.max(0, this._content.height());
            if (this.height == 'auto') {
                this._contentHeight = actualContentHeight;
            } else {
                var newHeight = Math.round(this.element.offsetHeight) - Math.round(this._header.outerHeight()) - 1;
                if (newHeight < 0) {
                    newHeight = 0;
                }
                if (!this._contentHeight) {
                    this._contentHeight = actualContentHeight;
                }
                if (newHeight != this._contentHeight) {
                    this._contentElement.style.height = this._toPx(newHeight);
                    this._contentHeight = Math.round(this._content.outerHeight());
                } else {
                    this._contentElement.style.height = this._toPx(this._contentHeight);
                }
            }
        },

        // toggles the expander
        _toggle: function () {
            var that = this;
            if (this._isTouchDevice === false) {
                this._header.removeClass(this.toThemeProperty('jqx-expander-header-disabled'));
                switch (this.toggleMode) {
                    case 'click':
                        this.addHandler(this._header, 'click.expander' + this.widgetID, function () {
                            that._animate();
                        });
                        break;
                    case 'dblclick':
                        this.addHandler(this._header, 'dblclick.expander' + this.widgetID, function () {
                            that._animate();
                        });
                        break;
                    case 'none':
                        this._header.addClass(this.toThemeProperty('jqx-expander-header-disabled'));
                        break;
                }
            } else {
                if (this.toggleMode != 'none') {
                    this.addHandler(this._header, $.jqx.mobile.getTouchEventName('touchstart') + '.' + this.widgetID, function () {
                        that._animate();
                    });
                } else {
                    return;
                }
            }
        },

        // calls for either expand() or collapse()
        _animate: function () {
            if (this.expanded === true) {
                this.collapse();
                this._header.addClass(this.toThemeProperty('jqx-fill-state-hover jqx-expander-header-hover'));
                if (this.headerPosition == 'top') {
                    this._arrow.addClass(this.toThemeProperty('jqx-expander-arrow-top-hover jqx-expander-arrow-down-hover'));
                } else if (this.headerPosition == 'bottom') {
                    this._arrow.addClass(this.toThemeProperty('jqx-expander-arrow-bottom-hover jqx-expander-arrow-up-hover'));
                }
            } else {
                this.expand();
                this._header.removeClass(this.toThemeProperty('jqx-fill-state-hover jqx-expander-header-hover'));
                if (this.headerPosition == 'top') {
                    this._arrow.removeClass(this.toThemeProperty('jqx-expander-arrow-top-hover jqx-expander-arrow-down-hover'));
                } else if (this.headerPosition == 'bottom') {
                    this._arrow.removeClass(this.toThemeProperty('jqx-expander-arrow-bottom-hover jqx-expander-arrow-up-hover'));
                }
            }
        },

        // removes event handlers
        _removeHandlers: function () {
            this.removeHandler(this._header, 'click.expander' + this.widgetID);
            this.removeHandler(this._header, 'dblclick.expander' + this.widgetID);
            this.removeHandler(this._header, 'mouseenter.expander' + this.widgetID);
            this.removeHandler(this._header, 'mouseleave.expander' + this.widgetID);
        },

        // sets the expander's theme and classes
        _setTheme: function () {
            var that = this,
                hostClass = 'jqx-widget jqx-expander',
                headerClass = 'jqx-widget-header jqx-expander-header',
                contentClass = 'jqx-widget-content jqx-expander-content';

            if (this.rtl === true) {
                hostClass += ' jqx-rtl';
            }

            if (this.disabled === false) {
                this._header.removeClass(this.toThemeProperty('jqx-expander-header-disabled'));
                this.host.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
                if (this.expanded === true) {
                    headerClass += ' jqx-fill-state-pressed jqx-expander-header-expanded';
                } else {
                    headerClass += ' jqx-fill-state-normal';
                    this._header.removeClass(this.toThemeProperty('jqx-expander-header-expanded'));
                }

                this._hovered = false;
                if (!that._isTouchDevice) {
                    // adds events on hover over header
                    this.addHandler(this._header, 'mouseenter.expander' + this.widgetID, function () {
                        that._hovered = true;
                        if (that._expandChecker == 1) {
                            that._header.removeClass(that.toThemeProperty('jqx-fill-state-normal jqx-fill-state-pressed'));
                            that._header.addClass(that.toThemeProperty('jqx-fill-state-hover jqx-expander-header-hover'));
                            if (that.headerPosition == 'top') {
                                if (that.expanded) {
                                    that._arrow.addClass(that.toThemeProperty('jqx-icon-arrow-up-hover'));
                                } else {
                                    that._arrow.addClass(that.toThemeProperty('jqx-icon-arrow-down-hover'));
                                }
                                that._arrow.addClass(that.toThemeProperty('jqx-expander-arrow-top-hover jqx-expander-arrow-down-hover'));
                            } else if (that.headerPosition == 'bottom') {
                                if (that.expanded) {
                                    that._arrow.addClass(that.toThemeProperty('jqx-icon-arrow-down-hover'));
                                }
                                that._arrow.addClass(that.toThemeProperty('jqx-expander-arrow-bottom-hover jqx-expander-arrow-up-hover'));
                            }
                        }
                    });
                    this.addHandler(this._header, 'mouseleave.expander' + this.widgetID, function () {
                        that._hovered = false;
                        that._header.removeClass(that.toThemeProperty('jqx-fill-state-hover jqx-expander-header-hover'));
                        that._arrow.removeClass(that.toThemeProperty('jqx-icon-arrow-up-hover jqx-icon-arrow-down-hover'));
                        if (that.headerPosition == 'top') {
                            that._arrow.removeClass(that.toThemeProperty('jqx-expander-arrow-top-hover jqx-expander-arrow-down-hover'));
                        } else if (that.headerPosition == 'bottom') {
                            that._arrow.removeClass(that.toThemeProperty('jqx-expander-arrow-bottom-hover jqx-expander-arrow-up-hover'));
                        }
                        if (that._expandChecker == 1) {
                            that._header.addClass(that.toThemeProperty('jqx-fill-state-normal'));
                        } else {
                            that._header.addClass(that.toThemeProperty('jqx-fill-state-pressed'));
                        }
                    });
                }
            } else {
                hostClass += ' jqx-fill-state-disabled';
                headerClass += ' jqx-expander-header-disabled';
            }

            if (this.headerPosition == 'top') {
                contentClass += ' jqx-expander-content-bottom';
            } else if (this.headerPosition == 'bottom') {
                contentClass += ' jqx-expander-content-top';
            }

            this.host.addClass(this.toThemeProperty(hostClass));
            this._header.addClass(this.toThemeProperty(headerClass));
            this._content.addClass(this.toThemeProperty(contentClass));
            this._arrow.addClass(this.toThemeProperty('jqx-expander-arrow'));
        },

        // checks if the content is empty
        _checkContent: function () {
            this._cntntEmpty = /^\s*$/.test(this._contentElement.innerHTML);
            if (this._cntntEmpty === true) {
                this._contentElement.style.height = '0px';
                this._content.addClass(this.toThemeProperty('jqx-expander-content-empty'));
            } else {
                if (this.height === 'auto') {
                    this._contentElement.style.height = 'auto';
                } else {
                    this._contentElement.style.height = this._contentHeight + 'px';
                }
                this._content.removeClass(this.toThemeProperty('jqx-expander-content-empty'));
            }
        },

        // adds keyboard interaction
        _keyBoard: function () {
            var that = this;
            this._focus();

            this.addHandler(this.host, 'keydown.expander' + this.widgetID, function (event) {
                var handled = false;
                if ((that.focusedH === true || that.focusedC === true) && that.disabled === false) {

                    // functionality for different keys
                    switch (event.keyCode) {
                        case 13:
                        case 32:
                            if (that.toggleMode != 'none') {
                                if (that.focusedH === true) {
                                    that._animate();
                                }
                                handled = true;
                            }
                            break;
                        case 38:
                            if (event.ctrlKey === true && that.focusedC === true) {
                                that._headerElement.focus();
                            }
                            handled = true;
                            break;
                        case 40:
                            if (event.ctrlKey === true && that.focusedH === true) {
                                that._contentElement.focus();
                            }
                            handled = true;
                            break;
                            //                        case 9:                         
                            //                            that._headerElement.focus();                         
                            //                            handled = true;                         
                            //                            break;                         
                    }
                    return true;
                }

                if (handled && event.preventDefault) {
                    event.preventDefault();
                }

                return !handled;
            });
        },

        // focuses/blurs the headers and contents
        _focus: function () {
            var that = this;
            this.addHandler(this._header, 'focus.expander' + this.widgetID, function () {
                that.focusedH = true;
                $.jqx.aria(that._header, 'aria-selected', true);
                that._header.addClass(that.toThemeProperty('jqx-fill-state-focus'));
            });
            this.addHandler(this._header, 'blur.expander' + this.widgetID, function () {
                that.focusedH = false;
                $.jqx.aria(that._header, 'aria-selected', false);
                that._header.removeClass(that.toThemeProperty('jqx-fill-state-focus'));
            });
            this.addHandler(this._headerText, 'focus.expander' + this.widgetID, function () {
                that._headerElement.focus();
            });
            this.addHandler(this._arrow, 'focus.expander' + this.widgetID, function () {
                that._headerElement.focus();
            });
            this.addHandler(this._content, 'focus.expander' + this.widgetID, function () {
                that.focusedC = true;
                that._content.addClass(that.toThemeProperty('jqx-fill-state-focus'));
            });
            this.addHandler(this._content, 'blur.expander' + this.widgetID, function () {
                that.focusedC = false;
                that._content.removeClass(that.toThemeProperty('jqx-fill-state-focus'));
            });
        },

        _toPx: function (value) {
            if (typeof value === 'number') {
                return value + 'px';
            } else {
                return value;
            }
        }
    });
})(jqxBaseFramework); //ignore jslint

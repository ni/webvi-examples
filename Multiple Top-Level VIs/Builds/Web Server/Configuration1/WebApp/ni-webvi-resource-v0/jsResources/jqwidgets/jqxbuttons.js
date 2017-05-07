/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($) {
    $.jqx.cssroundedcorners = function (value) {
        var cssMap = {
            'all': 'jqx-rc-all',
            'top': 'jqx-rc-t',
            'bottom': 'jqx-rc-b',
            'left': 'jqx-rc-l',
            'right': 'jqx-rc-r',
            'top-right': 'jqx-rc-tr',
            'top-left': 'jqx-rc-tl',
            'bottom-right': 'jqx-rc-br',
            'bottom-left': 'jqx-rc-bl'
        };

        for (prop in cssMap) {
            if (!cssMap.hasOwnProperty(prop))
                continue;

            if (value == prop)
                return cssMap[prop];
        }
    }

    $.jqx.jqxWidget("jqxButton", "", {});

    $.extend($.jqx._jqxButton.prototype, {
        defineInstance: function () {
            var settings = {
                cursor: 'arrow',
                // rounds the button corners.
                roundedCorners: 'all',
                // enables / disables the button
                disabled: false,
                // sets height to the button.
                height: null,
                // sets width to the button.
                width: null,
                overrideTheme: false,
                enableHover: true,
                enableDefault: true,
                enablePressed: true,
                imgPosition: "center",
                imgSrc: "",
                imgWidth: 16,
                imgHeight: 16,
                value: null,
                textPosition: "",
                textImageRelation: "overlay",
                rtl: false,
                _ariaDisabled: false,
                _scrollAreaButton: false,
                // "primary", "inverse", "danger", "info", "success", "warning", "link"
                template: "default",
                aria:
                {
                    "aria-disabled": { name: "disabled", type: "boolean" }
                }
           }
            $.extend(true, this, settings);
            return settings;
        },

        _addImage: function (name)
        {
            var that = this;
            if (that.element.nodeName.toLowerCase() == "input" || that.element.nodeName.toLowerCase() == "button" || that.element.nodeName.toLowerCase() == "div")
            {
                if (!that._img) {
                    that.field = that.element;
                    if (that.field.className) {
                        that._className = that.field.className;
                    }

                    var properties = {
                        'title': that.field.title
                    };

                    var value = null;
                    if (that.field.getAttribute('value')) {
                        var value = that.field.getAttribute('value');
                    }
                    else if (that.element.nodeName.toLowerCase() != "input")
                    {
                        var value = that.element.innerHTML;
                    }
                    if (that.value)
                    {
                        value = that.value;
                    }
                    if (that.field.id.length) {
                        properties.id = that.field.id.replace(/[^\w]/g, '_') + "_" + name;
                    }
                    else {
                        properties.id = $.jqx.utilities.createId() + "_" + name;
                    }


                    var wrapper = document.createElement('div');
                    wrapper.id = properties.id;
                    wrapper.title = properties.title;
                    wrapper.style.cssText = that.field.style.cssText;
                    wrapper.style.boxSizing = 'border-box';

                    var img = document.createElement("img");
                    img.setAttribute('src', that.imgSrc);
                    img.setAttribute('width', that.imgWidth);
                    img.setAttribute('height', that.imgHeight);
                    wrapper.appendChild(img);
                    that._img = img;

                    var text = document.createElement('span');
                    if (value) {
                        text.innerHTML = value;
                        that.value = value;
                    }
                    wrapper.appendChild(text);
                    that._text = text;

                    that.field.style.display = "none";
                    if (that.field.parentNode)
                    {
                        that.field.parentNode.insertBefore(wrapper, that.field.nextSibling);
                    }

                    var data = that.host.data();
                    that.host = $(wrapper);
                    that.host.data(data);
                    that.element = wrapper;
                    that.element.id = that.field.id;
                    that.field.id = properties.id;
                    var elementObj = new jqxHelper(that.element);
                    var fieldObj = new jqxHelper(that.field);
                    if (that._className)
                    {
                        elementObj.addClass(that._className);
                        fieldObj.removeClass(that._className);
                    }

                    if (that.field.tabIndex) {
                        var tabIndex = that.field.tabIndex;
                        that.field.tabIndex = -1;
                        that.element.tabIndex = tabIndex;
                    }
                }
                else {
                    that._img.setAttribute('src', that.imgSrc);
                    that._img.setAttribute('width', that.imgWidth);
                    that._img.setAttribute('height', that.imgHeight);
                    that._text.innerHTML = that.value;
                }
                if (!that.imgSrc)
                {
                    that._img.style.display = "none";
                }
                else
                {
                    that._img.style.display = "inline";
                }

                if (!that.value)
                {
                    that._text.style.display = "none";
                }
                else
                {
                    that._text.style.display = "inline";
                }

                that._positionTextAndImage();
            }
        },

        _positionTextAndImage: function()
        {
            var that = this;
            var width = that.element.offsetWidth;
            var height = that.element.offsetHeight;

            var imgWidth = that.imgWidth;
            var imgHeight = that.imgHeight;
            if (that.imgSrc == "") {
                imgWidth = 0;
                imgHeight = 0;
            }

            var textWidth = that._text.offsetWidth;
            var textHeight = that._text.offsetHeight;
            var offset = 4;
            var edgeOffset = 4;
            var factorIncrease = 4;
            var w = 0;
            var h = 0;
            switch (that.textImageRelation) {
                case "imageBeforeText":
                case "textBeforeImage":
                    w = imgWidth + textWidth + 2 * factorIncrease + offset + 2 * edgeOffset;
                    h = Math.max(imgHeight, textHeight) + 2 * factorIncrease + offset + 2 * edgeOffset;
                    break;
                case "imageAboveText":
                case "textAboveImage":
                    w = Math.max(imgWidth, textWidth) + 2 * factorIncrease;
                    h = imgHeight + textHeight + offset + 2 * factorIncrease + 2 * edgeOffset;
                    break;
                case "overlay":
                    w = Math.max(imgWidth, textWidth) + 2 * factorIncrease;
                    h = Math.max(imgHeight, textHeight) + 2 * factorIncrease;
                    break;
            }

            if (!that.width) {
                that.element.style.width = w + "px";
                width = w;
            }

            if (!that.height) {
                that.element.style.height = h + "px";
                height = h;
            }

            that._img.style.position = 'absolute';
            that._text.style.position = 'absolute';
            that.element.style.position = 'relative';
            that.element.style.overflow = 'hidden';

            var textRect = {};
            var imageRect = {};

            var drawElement = function (element, drawArea, pos, w, h) {
                if (drawArea.width < w) drawArea.width = w;
                if (drawArea.height < h) drawArea.height = h;

                switch (pos) {
                    case "left":
                        element.style.left = drawArea.left + "px";
                        element.style.top = drawArea.top + drawArea.height / 2 - h / 2 + "px";;
                        break;
                    case "topLeft":
                        element.style.left = drawArea.left + "px";
                        element.style.top = drawArea.top + "px";
                        break;
                    case "bottomLeft":
                        element.style.left = drawArea.left + "px";
                        element.style.top = drawArea.top + drawArea.height - h + "px";
                        break;
                    default:
                    case "center":
                        element.style.left = drawArea.left + drawArea.width / 2 - w / 2 + "px";
                        element.style.top = drawArea.top + drawArea.height / 2 - h / 2 + "px";
                        break;
                    case "top":
                        element.style.left = drawArea.left + drawArea.width / 2 - w / 2 + "px";
                        element.style.top = drawArea.top + "px";
                        break;
                    case "bottom":
                        element.style.left = drawArea.left + drawArea.width / 2 - w / 2 + "px";
                        element.style.top = drawArea.top + drawArea.height - h + "px";
                        break;
                    case "right":
                        element.style.left = drawArea.left + drawArea.width - w + "px";
                        element.style.top = drawArea.top + drawArea.height / 2 - h / 2 + "px";;
                        break;
                    case "topRight":
                        element.style.left = drawArea.left + drawArea.width - w + "px";
                        element.style.top = drawArea.top + "px";
                        break;
                    case "bottomRight":
                        element.style.left = drawArea.left + drawArea.width - w + "px";
                        element.style.top = drawArea.top + drawArea.height - h + "px";
                        break;
                }
            }

            var left = 0;
            var top = 0;
            var right = width;
            var bottom = height;
            var middle = (right - left) / 2;
            var center = (bottom - top) / 2;
            var img = that._img;
            var text = that._text;
            var rectHeight = bottom - top;
            var rectWidth = right - left;
            left += edgeOffset;
            top += edgeOffset;
            right = right - edgeOffset - 2;
            rectWidth = rectWidth - 2 * edgeOffset - 2;
            rectHeight = rectHeight - 2 * edgeOffset - 2;

            switch (that.textImageRelation) {
                case "imageBeforeText":

                    switch (that.imgPosition) {
                        case "left":
                        case "topLeft":
                        case "bottomLeft":
                            imageRect = { left: left, top: top, width: left + imgWidth, height: rectHeight };
                            textRect = { left: left + imgWidth + offset, top: top, width: rectWidth - imgWidth - offset, height: rectHeight };
                            break;
                        case "center":
                        case "top":
                        case "bottom":
                            imageRect = { left: middle - textWidth / 2 - imgWidth / 2 - offset / 2, top: top, width: imgWidth, height: rectHeight };
                            textRect = { left: imageRect.left + imgWidth + offset, top: top, width: right - imageRect.left - imgWidth - offset, height: rectHeight };
                            break;
                        case "right":
                        case "topRight":
                        case "bottomRight":
                            imageRect = { left: right - textWidth - imgWidth - offset, top: top, width: imgWidth, height: rectHeight };
                            textRect = { left: imageRect.left + imgWidth + offset, top: top, width: right - imageRect.left - imgWidth - offset, height: rectHeight };
                            break;

                    }
                    drawElement(img, imageRect, that.imgPosition, imgWidth, imgHeight);
                    drawElement(text, textRect, that.textPosition, textWidth, textHeight);
         
                    break;
                case "textBeforeImage":

                    switch (that.textPosition) {
                        case "left":
                        case "topLeft":
                        case "bottomLeft":
                            textRect = { left: left, top: top, width: left + textWidth, height: rectHeight };
                            imageRect = { left: left + textWidth + offset, top: top, width: rectWidth - textWidth - offset, height: rectHeight };
                            break;
                        case "center":
                        case "top":
                        case "bottom":
                            textRect = { left: middle - textWidth / 2 - imgWidth / 2 - offset / 2, top: top, width: textWidth, height: rectHeight };
                            imageRect = { left: textRect.left + textWidth + offset, top: top, width: right - textRect.left - textWidth - offset, height: rectHeight };
                            break;
                        case "right":
                        case "topRight":
                        case "bottomRight":
                            textRect = { left: right - textWidth - imgWidth - offset, top: top, width: textWidth, height: rectHeight };
                            imageRect = { left: textRect.left + textWidth + offset, top: top, width: right - textRect.left - textWidth - offset, height: rectHeight };
                            break;

                    }
                    drawElement(img, imageRect, that.imgPosition, imgWidth, imgHeight);
                    drawElement(text, textRect, that.textPosition, textWidth, textHeight);

                    break;
                case "imageAboveText":

                    switch (that.imgPosition) {
                        case "topRight":
                        case "top":
                        case "topLeft":
                            imageRect = { left: left, top: top, width: rectWidth, height: imgHeight };
                            textRect = { left: left, top: top + imgHeight + offset, width: rectWidth, height: rectHeight - imgHeight - offset };
                            break;
                        case "left":
                        case "center":
                        case "right":
                            imageRect = { left: left, top: center - imgHeight / 2 - textHeight / 2 - offset / 2, width: rectWidth, height: imgHeight };
                            textRect = { left: left, top: imageRect.top + offset + imgHeight, width: rectWidth, height: rectHeight - imageRect.top - offset - imgHeight };
                            break;
                        case "bottomLeft":
                        case "bottom":
                        case "bottomRight":
                            imageRect = { left: left, top: bottom - imgHeight - textHeight - offset, width: rectWidth, height: imgHeight };
                            textRect = { left: left, top: imageRect.top + offset + imgHeight, width: rectWidth, height: textHeight };
                            break;

                    }
                    drawElement(img, imageRect, that.imgPosition, imgWidth, imgHeight);
                    drawElement(text, textRect, that.textPosition, textWidth, textHeight);
                    break;
                case "textAboveImage":
                    switch (that.textPosition) {
                        case "topRight":
                        case "top":
                        case "topLeft":
                            textRect = { left: left, top: top, width: rectWidth, height: textHeight };
                            imageRect = { left: left, top: top + textHeight + offset, width: rectWidth, height: rectHeight - textHeight - offset };
                            break;
                        case "left":
                        case "center":
                        case "right":
                            textRect = { left: left, top: center - imgHeight / 2 - textHeight / 2 - offset / 2, width: rectWidth, height: textHeight };
                            imageRect = { left: left, top: textRect.top + offset + textHeight, width: rectWidth, height: rectHeight - textRect.top - offset - textHeight };
                            break;
                        case "bottomLeft":
                        case "bottom":
                        case "bottomRight":
                            textRect = { left: left, top: bottom - imgHeight - textHeight - offset, width: rectWidth, height: textHeight };
                            imageRect = { left: left, top: textRect.top + offset + textHeight, width: rectWidth, height: imgHeight };
                            break;

                    }
                    drawElement(img, imageRect, that.imgPosition, imgWidth, imgHeight);
                    drawElement(text, textRect, that.textPosition, textWidth, textHeight);
     
                    break;
                case "overlay":
                default:
                    textRect = { left: left, top: top, width: rectWidth, height: rectHeight };
                    imageRect = { left: left, top: top, width: rectWidth, height: rectHeight };

                    drawElement(img, imageRect, that.imgPosition, imgWidth, imgHeight);
                    drawElement(text, textRect, that.textPosition, textWidth, textHeight);

                    break;
            }
        },

        createInstance: function (args) {
            var that = this;
            that._setSize();
            that.buttonObj = new jqxHelper(that.element);

            if (that.imgSrc != "" || that.textPosition != "" || (that.element.value && that.element.value.indexOf("<") >= 0) || that.value != null)
            {
                that.refresh();
                that._addImage("jqxButton");
                that.buttonObj = new jqxHelper(that.element);
            }

            if (!that._ariaDisabled) {
                that.element.setAttribute('role', 'button');
            }
            if (!that.overrideTheme) {
                that.buttonObj.addClass(that.toThemeProperty($.jqx.cssroundedcorners(that.roundedCorners)));
                if (that.enableDefault)
                {
                    that.buttonObj.addClass(that.toThemeProperty('jqx-button'));
                }
                that.buttonObj.addClass(that.toThemeProperty('jqx-widget'));
            }

            that.isTouchDevice = $.jqx.mobile.isTouchDevice();
            if (!that._ariaDisabled) {
                $.jqx.aria(this);
            }

            if (that.cursor != 'arrow') {
                if (!that.disabled) {
                    that.element.style.cursor = that.cursor;
                }
                else {
                    that.element.style.cursor = "arrow";
                }
            }

            var eventNames = 'mouseenter mouseleave mousedown focus blur';
            if (that._scrollAreaButton) {
                var eventNames = 'mousedown';
            }

            if (that.isTouchDevice) {
                that.addHandler(that.host, $.jqx.mobile.getTouchEventName('touchstart'), function (event) {
                    that.isPressed = true;
                    that.refresh();
                });
                that.addHandler($(document), $.jqx.mobile.getTouchEventName('touchend') + "." + that.element.id, function (event) {
                    that.isPressed = false;
                    that.refresh();
                });
            }

            that.addHandler(that.host, eventNames, function (event) {
                switch (event.type) {
                    case 'mouseenter':
                        if (!that.isTouchDevice) {
                            if (!that.disabled && that.enableHover) {
                                that.isMouseOver = true;
                                that.refresh();
                            }
                        }
                        break;
                    case 'mouseleave':
                        if (!that.isTouchDevice) {
                            if (!that.disabled && that.enableHover) {
                                that.isMouseOver = false;
                                that.refresh();
                            }
                        }
                        break;
                    case 'mousedown':
                        if (!that.disabled) {
                            that.isPressed = true;
                            that.refresh();
                        }
                        break;
                    case 'focus':
                        if (!that.disabled) {
                            that.isFocused = true;
                            that.refresh();
                        }
                        break;
                    case 'blur':
                        if (!that.disabled) {
                            that.isFocused = false;
                            that.refresh();
                        }
                        break;
                }
            });

            that.mouseupfunc = function (event) {
                if (!that.disabled) {
                    if (that.isPressed || that.isMouseOver) {
                        that.isPressed = false;
                        that.refresh();
                    }
                }
            }

            that.addHandler(document, 'mouseup.button' + that.element.id, that.mouseupfunc);

            try {
                if (document.referrer != "" || window.frameElement) {
                    if (window.top != null && window.top != window.that) {
                        var parentLocation = '';
                        if (window.parent && document.referrer) {
                            parentLocation = document.referrer;
                        }

                        if (parentLocation.indexOf(document.location.host) != -1) {
                            var eventHandle = function (event) {
                                that.isPressed = false;
                                that.refresh();
                            };

                            if (window.top.document) {
                                that.addHandler($(window.top.document), 'mouseup', eventHandle);
                            }
                        }
                    }
                }
            }
            catch (error) {
            }
            
            that.propertyChangeMap['roundedCorners'] = function (instance, key, oldVal, value) {
                instance.buttonObj.removeClass(instance.toThemeProperty($.jqx.cssroundedcorners(oldVal)));
                instance.buttonObj.addClass(instance.toThemeProperty($.jqx.cssroundedcorners(value)));
            };
            that.propertyChangeMap['disabled'] = function (instance, key, oldVal, value) {
                if (oldVal != value) {
                    instance.refresh();
                    instance.element.setAttribute('disabled', value);
                    instance.element.disabled = value;
                    if (!value) {
                        instance.element.style.cursor = instance.cursor;
                    }
                    else {
                        instance.element.style.cursor = 'default';
                    }

                    $.jqx.aria(instance, "aria-disabled", instance.disabled);
                }
            };
            that.propertyChangeMap['rtl'] = function (instance, key, oldVal, value) {
                if (oldVal != value) {
                    instance.refresh();
                }
            };
            that.propertyChangeMap['template'] = function (instance, key, oldVal, value) {
                if (oldVal != value) {
                    instance.buttonObj.removeClass(instance.toThemeProperty("jqx-" + oldVal));
                    instance.refresh();
                }
            };
            that.propertyChangeMap['theme'] = function (instance, key, oldVal, value) {
                instance.buttonObj.removeClass(instance.element);

                if (instance.enableDefault) {
                    instance.buttonObj.addClass(instance.toThemeProperty('jqx-button'));
                }
                instance.buttonObj.addClass(instance.toThemeProperty('jqx-widget'));
                if (!instance.overrideTheme) {
                    instance.buttonObj.addClass(instance.toThemeProperty($.jqx.cssroundedcorners(instance.roundedCorners)));
                }
                instance._oldCSSCurrent = null;
                instance.refresh();
            };
            if (that.disabled) {
                that.element.disabled = true;
                that.element.setAttribute('disabled', 'true');
            }
        }, // createInstance

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            this._setSize();
        },

        val: function () {
            var that = this;
            var input = that.host.find('input');
            if (input.length > 0) {
                if (arguments.length == 0 || typeof (value) == "object") {
                    return input.val();
                }
                input.val(value);
                that.refresh();
                return input.val();
            }

            if (arguments.length == 0 || typeof (value) == "object") {
                if (that.element.nodeName.toLowerCase() == "button") {
                    return $(that.element).text();
                }
                return that.element.value;
            }
            that.element.value = arguments[0];
            if (that.element.nodeName.toLowerCase() == "button") {
                $(that.element).text(arguments[0]);
            }

            that.refresh();
        },

        _setSize: function () {
            var that = this;
            var height = that.height;
            var width = that.width;

            if (height)
            {
                if (!isNaN(height))
                {
                    height = height + "px";
                }
                that.element.style.height = height;
            }

            if (width)
            {
                if (!isNaN(width))
                {
                    width = width + "px";
                }
                that.element.style.width = width;
            }
        },

        _removeHandlers: function () {
            var that = this;
            that.removeHandler(that.host, 'selectstart');
            that.removeHandler(that.host, 'click');
            that.removeHandler(that.host, 'focus');
            that.removeHandler(that.host, 'blur');
            that.removeHandler(that.host, 'mouseenter');
            that.removeHandler(that.host, 'mouseleave');
            that.removeHandler(that.host, 'mousedown');
            that.removeHandler($(document), 'mouseup.button' + that.element.id, that.mouseupfunc);
            if (that.isTouchDevice) {
                that.removeHandler(that.host, $.jqx.mobile.getTouchEventName('touchstart'));
                that.removeHandler($(document), $.jqx.mobile.getTouchEventName('touchend') + "." + that.element.id);
            }
            that.mouseupfunc = null;
            delete that.mouseupfunc;
        },

        focus: function()
        {
            this.host.focus();
        },

        destroy: function () {
            var that = this;
            that._removeHandlers();
            var vars = $.data(that.element, "jqxButton");
            if (vars) {
                delete vars.instance;
            }
            that.host.removeClass();
            that.host.removeData();
            that.host.remove();
            delete that.set;
            delete that.get;
            delete that.call;
            delete that.element;
            delete that.host;
        },

        render: function()
        {
            this.refresh();
        },

        propertiesChangedHandler: function (object, oldValues, newValues)
        {
            if (newValues && newValues.width && newValues.height && Object.keys(newValues).length == 2)
            {
                object._setSize();
                object.refresh();
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this.isInitialized == undefined || this.isInitialized == false)
                return;

            if (value == oldvalue)
            {
                return;
            }

            if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length == 2)
            {
                return;
            }

            if (key == "textImageRelation" || key == "textPosition" || key == "imgPosition") {
                if (object._img) {
                    object._positionTextAndImage();
                }
                else object._addImage("jqxButton");
            }
            if (key == "imgSrc" || key == "imgWidth" || key == "imgHeight" || key == "value") {
                object._addImage("jqxButton");
            }

            if (key == "width" || key == "height")
            {
                object._setSize();
                object.refresh();
            }
        },

        refresh: function () {
            var that = this;
            if (that.overrideTheme)
                return;

            var cssFocused = that.toThemeProperty('jqx-fill-state-focus');
            var cssDisabled = that.toThemeProperty('jqx-fill-state-disabled');
            var cssNormal = that.toThemeProperty('jqx-fill-state-normal');

            if (!that.enableDefault) {
                cssNormal = "";
            }

            var cssHover = that.toThemeProperty('jqx-fill-state-hover');
            var cssPressed = that.toThemeProperty('jqx-fill-state-pressed');
            var cssPressedHover = that.toThemeProperty('jqx-fill-state-pressed');
            if (!that.enablePressed) {
                cssPressed = "";
            }
            var cssCurrent = '';

            if (!that.host) {
                return;
            }

            that.element.disabled = that.disabled;

            if (that.disabled) {
                if (that._oldCSSCurrent)
                {
                    that.buttonObj.removeClass(that._oldCSSCurrent);
                }
                cssCurrent = cssNormal + " " + cssDisabled;
                if (that.template !== "default" && that.template !== "") {
                    cssCurrent += " " + "jqx-" + that.template;
                    if (that.theme != "")
                    {
                        cssCurrent += " " + "jqx-" + that.template + "-" + that.theme;
                    }
                }
                that.buttonObj.addClass(cssCurrent);
                that._oldCSSCurrent = cssCurrent;
                return;
            }
            else {
                if (that.isMouseOver && !that.isTouchDevice) {
                    if (that.isPressed)
                        cssCurrent = cssPressedHover;
                    else
                        cssCurrent = cssHover;
                }
                else {
                    if (that.isPressed)
                        cssCurrent = cssPressed;
                    else
                        cssCurrent = cssNormal;
                }
            }

            if (that.isFocused) {
                cssCurrent += " " + cssFocused;
            }

            if (that.template !== "default" && that.template !== "") {
                cssCurrent += " " + "jqx-" + that.template;
                if (that.theme != "")
                {
                    cssCurrent += " " + "jqx-" + that.template + "-" + that.theme;
                }
            }

            if (cssCurrent != that._oldCSSCurrent) {
                if (that._oldCSSCurrent) {
                    that.buttonObj.removeClass(that._oldCSSCurrent);
                }
                that.buttonObj.addClass(cssCurrent);
                that._oldCSSCurrent = cssCurrent;
            }
            if (that.rtl) {
                that.buttonObj.addClass(that.toThemeProperty('jqx-rtl'));
                that.element.style.direction = 'rtl';
            }
        }
    });

    //// LinkButton
    $.jqx.jqxWidget("jqxLinkButton", "", {});

    $.extend($.jqx._jqxLinkButton.prototype, {
        defineInstance: function () {
            // enables / disables the button
            this.disabled = false;
            // sets height to the button.
            this.height = null;
            // sets width to the button.
            this.width = null;
            this.rtl = false;
            this.href = null;
        },

        createInstance: function (args) {
            var that = this;
            this.host.onselectstart = function () { return false; };
            this.host.attr('role', 'button');

            var height = this.height || this.element.offsetHeight;
            var width = this.width || this.element.offsetWidth;
            this.href = this.element.getAttribute('href');
            this.target = this.element.getAttribute('target');
            this.content = this.host.text();
            this.element.innerHTML = "";
            var wrapElement = document.createElement('input');
            wrapElement.type = "button";
            wrapElement.className = "jqx-wrapper " + this.toThemeProperty('jqx-reset');

            this._setSize(wrapElement, width, height);

            wrapElement.value = this.content;
            var helper = new jqxHelper(this.element);
            helper.addClass(this.toThemeProperty('jqx-link'));
            this.element.style.color = 'inherit';
            this.element.appendChild(wrapElement);
            this._setSize(wrapElement, width, height);

            var param = args == undefined ? {} : args[0] || {};
            $(wrapElement).jqxButton(param);
            this.wrapElement = wrapElement;
            if (this.disabled) {
                this.element.disabled = true;
            }

            this.propertyChangeMap['disabled'] = function (instance, key, oldVal, value) {
                instance.element.disabled = value;
                instance.wrapElement.jqxButton({ disabled: value });
            }

            this.addHandler($(wrapElement), 'click', function (event) {
                if (!this.disabled) {
                    that.onclick(event);
                }
                return false;
            });
        },

        _setSize: function (element, width, height)
        {
            var that = this;
        
            if (height)
            {
                if (!isNaN(height))
                {
                    height = height + "px";
                }
                element.style.height = height;
            }

            if (width)
            {
                if (!isNaN(width))
                {
                    width = width + "px";
                }
                element.style.width = width;
            }
        },


        onclick: function (event) {
            if (this.target != null) {
                window.open(this.href, this.target);
            }
            else {
                window.location = this.href;
            }
        }
    });
    //// End of LinkButton

    //// RepeatButton
    $.jqx.jqxWidget("jqxRepeatButton", "jqxButton", {});

    $.extend($.jqx._jqxRepeatButton.prototype, {
        defineInstance: function () {
            this.delay = 50;
        },

        createInstance: function (args) {
            var that = this;

            var isTouchDevice = $.jqx.mobile.isTouchDevice();

            var up = !isTouchDevice ? 'mouseup.' + this.base.element.id : 'touchend.' + this.base.element.id;
            var down = !isTouchDevice ? 'mousedown.' + this.base.element.id : 'touchstart.' + this.base.element.id;

            this.addHandler($(document), up, function (event) {
                if (that.timeout != null) {
                    clearTimeout(that.timeout);
                    that.timeout = null;
                    that.refresh();
                }
                if (that.timer != undefined) {
                    clearInterval(that.timer);
                    that.timer = null;
                    that.refresh();
                }
            });

            this.addHandler(this.base.host, down, function (event) {
                if (that.timer != null) {
                    clearInterval(that.timer);
                }
 
                that.timeout = setTimeout(function () {
                    clearInterval(that.timer);
                    that.timer = setInterval(function (event) { that.ontimer(event); }, that.delay);
                }, 150);
            });

            this.mousemovefunc = function (event) {
                if (!isTouchDevice) {
                    if (event.which == 0) {
                        if (that.timer != null) {
                            clearInterval(that.timer);
                            that.timer = null;
                        }
                    }
                }
            }

            this.addHandler(this.base.host, 'mousemove', this.mousemovefunc);
        },

        destroy: function()
        {
            var isTouchDevice = $.jqx.mobile.isTouchDevice();
            var up = !isTouchDevice ? 'mouseup.' + this.base.element.id : 'touchend.' + this.base.element.id;
            var down = !isTouchDevice ? 'mousedown.' + this.base.element.id : 'touchstart.' + this.base.element.id;
            this.removeHandler(this.base.host, 'mousemove', this.mousemovefunc);
            this.removeHandler(this.base.host, down);
            this.removeHandler($(document), up);
            this.timer = null;
            delete this.mousemovefunc;
            delete this.timer;
            var vars = $.data(this.base.element, "jqxRepeatButton");
            if (vars) {
                delete vars.instance;
            }
            $(this.base.element).removeData();
            this.base.destroy();
            delete this.base;

        },

        stop: function () {
            clearInterval(this.timer);
            this.timer = null;
        },

        ontimer: function (event) {
            var event = new $.Event('click');
            if (this.base != null && this.base.host != null) {
                this.base.host.trigger(event);
            }
        }
    });
    //// End of RepeatButton
    //// ToggleButton
    $.jqx.jqxWidget("jqxToggleButton", "jqxButton", {});

    $.extend($.jqx._jqxToggleButton.prototype, {
        defineInstance: function () {
            this.toggled = false;
            this.uiToggle = true;
            this.aria =
            {
                "aria-checked": { name: "toggled", type: "boolean" },
                "aria-disabled": { name: "disabled", type: "boolean" }
            };
        },

        createInstance: function (args) {
            var that = this;
            that.base.overrideTheme = true;
            that.isTouchDevice = $.jqx.mobile.isTouchDevice();
            $.jqx.aria(this);

            that.propertyChangeMap['roundedCorners'] = function (instance, key, oldVal, value) {
                instance.base.buttonObj.removeClass(instance.toThemeProperty($.jqx.cssroundedcorners(oldVal)));
                instance.base.buttonObj.addClass(instance.toThemeProperty($.jqx.cssroundedcorners(value)));
            };

            that.propertyChangeMap['toggled'] = function (instance, key, oldVal, value) {
                instance.refresh();
            };
            that.propertyChangeMap['disabled'] = function (instance, key, oldVal, value) {
                instance.base.disabled = value;
                instance.refresh();
            };

            that.addHandler(that.base.host, 'click', function (event) {
                if (!that.base.disabled && that.uiToggle) {
                    that.toggle();
                }
            });

            if (!that.isTouchDevice) {
                that.addHandler(that.base.host, 'mouseenter', function (event) {
                    if (!that.base.disabled) {
                        that.refresh();
                    }
                });

                that.addHandler(that.base.host, 'mouseleave', function (event) {
                    if (!that.base.disabled) {
                        that.refresh();
                    }
                });
            }

            that.addHandler(that.base.host, 'mousedown', function (event) {
                if (!that.base.disabled) {
                    that.refresh();
                }
            });

            that.addHandler($(document), 'mouseup.togglebutton' + that.base.element.id, function (event) {
                if (!that.base.disabled) {
                    that.refresh();
                }
            });
        },

        destroy: function()
        {
            this._removeHandlers();
            this.base.destroy();
        },

        _removeHandlers: function () {
            this.removeHandler(this.base.host, 'click');
            this.removeHandler(this.base.host, 'mouseenter');
            this.removeHandler(this.base.host, 'mouseleave');
            this.removeHandler(this.base.host, 'mousedown');
            this.removeHandler($(document), 'mouseup.togglebutton' + this.base.element.id);
        },

        toggle: function () {
            this.toggled = !this.toggled;
            this.refresh();
            $.jqx.aria(this, "aria-checked", this.toggled);
        },

        unCheck: function () {
            this.toggled = false;
            this.refresh();
        },

        check: function () {
            this.toggled = true;
            this.refresh();
        },

        refresh: function () {
            var that = this;
            var cssDisabled = that.base.toThemeProperty('jqx-fill-state-disabled');
            var cssNormal = that.base.toThemeProperty('jqx-fill-state-normal');
            if (!that.base.enableDefault) {
                cssNormal = "";
            }
            var cssHover = that.base.toThemeProperty('jqx-fill-state-hover');
            var cssPressed = that.base.toThemeProperty('jqx-fill-state-pressed');
            var cssPressedHover = that.base.toThemeProperty('jqx-fill-state-pressed');
            var cssCurrent = '';
            that.base.element.disabled = that.base.disabled;

            if (that.base.disabled) {
                cssCurrent = cssNormal + " " + cssDisabled;
                that.base.buttonObj.addClass(cssCurrent);
                return;
            }
            else {
                if (that.base.isMouseOver && !that.isTouchDevice) {
                    if (that.base.isPressed || that.toggled)
                        cssCurrent = cssPressedHover;
                    else
                        cssCurrent = cssHover;
                }
                else {
                    if (that.base.isPressed || that.toggled)
                        cssCurrent = cssPressed;
                    else
                        cssCurrent = cssNormal;
                }
            }

            if (that.base.template !== "default" && that.base.template !== "") {
                cssCurrent += " " + "jqx-" + that.base.template;
                if (that.base.theme != "")
                {
                    cssCurrent += " " + "jqx-" + that.template + "-" + that.base.theme;
                }
            }

            if (that.base.buttonObj.hasClass(cssDisabled) && cssDisabled != cssCurrent)
            {
                that.base.buttonObj.removeClass(cssDisabled);
            }

            if (that.base.buttonObj.hasClass(cssNormal) && cssNormal != cssCurrent)
            {
                that.base.buttonObj.removeClass(cssNormal);
            }

            if (that.base.buttonObj.hasClass(cssHover) && cssHover != cssCurrent)
            {
                that.base.buttonObj.removeClass(cssHover);
            }

            if (that.base.buttonObj.hasClass(cssPressed) && cssPressed != cssCurrent)
            {
                that.base.buttonObj.removeClass(cssPressed);
            }

            if (that.base.buttonObj.hasClass(cssPressedHover) && cssPressedHover != cssCurrent)
            {
                that.base.buttonObj.removeClass(cssPressedHover);
            }

            if (!that.base.buttonObj.hasClass(cssCurrent))
            {
                that.base.buttonObj.addClass(cssCurrent);
            }
        }
    });
    //// End of ToggleButton

})(jqxBaseFramework);

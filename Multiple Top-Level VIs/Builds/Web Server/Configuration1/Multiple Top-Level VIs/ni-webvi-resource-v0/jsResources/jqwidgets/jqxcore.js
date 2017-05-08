/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/

// jqxHelper
(function (window) {
    var class2type = {},
     hasOwn = class2type.hasOwnProperty,
     toString = class2type.toString;
    var types = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
    for (var i = 0; i < types.length; i++) {
        class2type["[object " + types[i] + "]"] = types[i].toLowerCase();
    }

    var jqxHelper = function (element) {
        if (element.expando !== undefined) {
            return element;
        }
        
        if (typeof element === 'string') {
            var selector = element;
            var nodeElement;
            if (element.indexOf("<") >= 0) {
                var fragment = document.createDocumentFragment();
                var div = document.createElement("div");
                fragment.appendChild(div);
                var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi;
                var rtagName = /<([\w:]+)/;
                element = element.replace(rxhtmlTag, "<$1></$2>");
                var tag = (rtagName.exec(element) || ["", ""])[1].toLowerCase();
                var wrap = [0, "", ""];
                depth = wrap[0];
                div.innerHTML = wrap[1] + element + wrap[2];
                while (depth--) {
                    div = div.lastChild;
                }

                element = div.childNodes;
                div.parentNode.removeChild(div);
                nodeElement = element[0];
            }
            else {
                nodeElement = document.querySelector(selector);
            }
            if (nodeElement) {
                element = nodeElement;
            }
            else {
                throw new Error("Invalid HTML Element Selector");
                return;
            }
            
        }
        if (this.init) {
            this.init(element);
            return this;
        }
        else {        
            return new jqxHelper(element);
        }
    };

    jqxHelper.isWindow = function (obj) {
        return obj != null && obj == obj.window;
    }

    jqxHelper.type = function (obj) {
        if (obj == null) {
            return obj + "";
        }

        return typeof obj === "object" || typeof obj === "function" ?
            class2type[toString.call(obj)] || "object" :
            typeof obj;
    }

    jqxHelper.isPlainObject = function (obj) {
        var that = this;
        var key;

        if (!obj || that.type(obj) !== "object" || obj.nodeType || that.isWindow(obj)) {
            return false;
        }

        try {
            if (obj.constructor &&
                !hasOwn.call(obj, "constructor") &&
                !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            return false;
        }

        for (key in obj) { }

        return key === undefined || hasOwn.call(obj, key);
    }

    jqxHelper.isArray = function (value) {
        if (Array && Array.isArray) {
            return Array.isArray(value);
        }

        var isArray = Object.prototype.toString.call(value) === '[object Array]';
        return isArray;
    }

    jqxHelper.extend = function () {
        var that = this;
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === "boolean") {
            deep = target;

            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== "object" && that.type(target) !== "function") {
            target = {};
        }

        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && (that.isPlainObject(copy) || (copyIsArray = that.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && that.isArray(src) ? src : [];

                        } else {
                            clone = src && that.isPlainObject(src) ? src : {};
                        }

                        target[name] = that.extend(deep, clone, copy);

                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    }
    jqxHelper.prototype = {
        constructor: jqxHelper,
        init: function (element) {
            this[0] = element;
            this.length = 1;
            this.element = element;
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            this.uuid = "jqx" + +(new Date().getTime()) + S4() + "-" + S4();
            jqxHelper.guid++;
            return this;
        }
    }
    jqxHelper.extend(
    {
        that: this,
        cache: {},
        event: {},
        expando: "jqx" + (new Date().getTime()),
        uuid: 0,
        guid: 0,
        ischildof: function (parent) {
            if (parent.contains(element)) {
                return true;
            }
            return false;
        },

        sibling: function (n) {
            var that = this;
            var elem = that.element;
            var r = [];

            for (; n; n = n.nextSibling) {
                if (n.nodeType === 1 && n !== elem) {
                    r.push(n);
                }
            }

            return r;
        },

        children: function () {
            var that = this;
            return that.sibling(that.element.firstChild);
        },

        makeArray: function (arr, results) {
            var that = this;
            var type,
                ret = results || [];

            var merge = function (first, second) {
                var l = second.length,
                    i = first.length,
                    j = 0;

                if (typeof l === "number") {
                    for (; j < l; j++) {
                        first[i++] = second[j];
                    }

                } else {
                    while (second[j] !== undefined) {
                        first[i++] = second[j++];
                    }
                }

                first.length = i;

                return first;
            }

            if (arr != null) {
                // The window, strings (and functions) also have 'length'
                // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
                type = that.type(arr);

                if (arr.length == null || type === "string" || type === "function" || type === "regexp" || that.isWindow(arr)) {
                    Array.prototype.push.call(ret, arr);
                } else {
                    merge(ret, arr);
                }
            }

            return ret;
        },

        Event: function (event, element) {
            var that = this;


            // Event object or event type
            var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
                type = event.type || event,
                namespaces = [];

            if (type.indexOf(".") >= 0) {
                // Namespaced trigger; create a regexp to match event type in handle()
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }

            if (typeof event === "string") {
                event = document.createEvent('Event');

                // Define that the event name is 'build'.
                event.initEvent(type, true, true);
            }
            event.target = element;
            event = eventHelper.createEvent(event);
      
            event.type = type;
            event.isTrigger = true;
            event.namespace = namespaces.join(".");
            event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
            ontype = type.indexOf(":") < 0 ? "on" + type : "";

            // Clean up the event in case it is being reused
            event.result = undefined;
            if (!event.target) {
                event.target = elem;
            }

            event.type = type;


            return event;
        },

        trigger: function (type, data) {
            var that = this;
            eventHelper.trigger(type, data, that.element);
        },

        addHandler: function (eventTypes, eventHandler, eventData) {
            var that = this;
            eventHandler.guid = eventHandler.guid || (eventHandler.guid = jqxHelper.guid++);

            eventHelper.add(that.element, eventTypes, eventHandler, eventData);
        },

        removeHandler: function (eventTypes, eventHandler) {
            var that = this;
            eventHelper.remove(that.element, eventTypes, eventHandler);
        },

        on: function (eventTypes, eventHandler, eventData) {
            if (eventData && jqxHelper.isFunction(eventData)) {
                this.addHandler(eventTypes, eventData, eventHandler);
            }
            else {
                this.addHandler(eventTypes, eventHandler, eventData);
            }
        },

        off: function (eventTypes, eventHandler) {
            this.removeHandler(eventTypes, eventHandler);
        },

        isRendered: function () {
            var that = this;
            if (that.element.parentNode == null || (that.element.offsetWidth === 0 || that.element.offsetHeight === 0)) {
                return false;
            }

            return true;
        },

        getSizeFromStyle: function()
        {
            var width = null;
            var height = null;
            var that = this;
            var computedStyle;

            if (that.element.style.width) {
                width = that.element.style.width;
            }
            if (that.element.style.height) {
                height = that.element.style.height;
            }
            
            if (window.getComputedStyle) {
                computedStyle = getComputedStyle(that.element, null);
            }
            else
            {
                computedStyle = that.element.currentStyle;
            }

            if (computedStyle) {
                if (computedStyle.width) {
                    width = computedStyle.width;
                }
                if (computedStyle.height) {
                    height = computedStyle.height;
                }
            }
            if (width === '0px') width = 0;
            if (height === '0px') height = 0;
            if (width === null) width = 0;
            if (height === null) height = 0;

            return { width: width, height: height };
        },

        sizeStyleChanged: function(resizeFn)
        {
            var that = this;

            var watchedElementData;

            var checkForChanges = function (mutations) {
                var data = watchedElementData;
                if (mutations && mutations[0] && mutations[0].attributeName === 'style' && mutations[0].type === 'attributes') {
                    if (data.element.offsetWidth !== data.offsetWidth ||
                        data.element.offsetHeight !== data.offsetHeight) {
                        data.offsetWidth = data.element.offsetWidth;
                        data.offsetHeight = data.element.offsetHeight;
                        if (that.isRendered()) {
                            data.callback();
                        }
                    }
                }
            }

            watchedElementData = {
                element: that.element,
                offsetWidth: that.element.offsetWidth,
                offsetHeight: that.element.offsetHeight,
                callback: resizeFn
            };

            if (!that.elementStyleObserver) {
                that.elementStyleObserver = new MutationObserver(checkForChanges);
                that.elementStyleObserver.observe(that.element, {
                    attributes: true,
                    childList: false,
                    characterData: false
                });

            }
        },

        cleanData: function () {
            var that = this;
            var id = that.element[that.expando];
            if (id !== undefined) {
                delete that.cache[id];
            }
        },

        append: function (element) {
            if (element.nodeType === 1 || element.nodeType === 11 || element.nodeType === 3) {
                this.element.appendChild(element);
            }
        },

        prepend: function (element) {
            if (element.nodeType === 1 || element.nodeType === 11) {
                this.element.insertBefore(elem, this.element.firstChild);
            }
        },

        appendTo: function(element)
        {
            var el = this.detach(); 
            $(element).append(el[0]);
        },

        prependTo: function(element)
        {
            var el = this.detach();
            $(element).prepend(el[0]);
        },

        detach: function()
        {
            var that = this;
            return that.remove(true);
        },

        remove: function (keepData) {
            var that = this;
            if (keepData !== true) {
                if (that.data()) {
                    var widget = that.data().jqxWidget;
                    if (widget && widget.destroy && !widget._destroying) {
                        widget._destroying = true;
                        widget.destroy();
                        widget._destroying = false;
                        return;
                    }
                }
                that.cleanData();

                if (that.element.querySelectorAll) {
                    var children = that.element.querySelectorAll("*")

                    if (children) {
                        for (var i = 0; i < children.length; i++) {
                            var child = jqxHelper(children[i]);
                            var id = child.element[child.expando];
                            if (id !== undefined) {
                                child.remove();
                            }
                        }
                    }
                }
            }
            if (that.elementStyleObserver) {
                that.elementStyleObserver.disconnect();
                that.elementStyleObserver = null;
            }
            if (that.element.parentNode) {
                that.element.parentNode.removeChild(that.element);
            }
            return this;
        },

        sizeChanged: function (resizeFn) {
            var that = this;

            var watchedElementData;

            var checkForChanges = function (mutations) {
                var data = watchedElementData;
                if (data.element.offsetWidth !== data.offsetWidth ||
                    data.element.offsetHeight !== data.offsetHeight) {
                    data.offsetWidth = data.element.offsetWidth;
                    data.offsetHeight = data.element.offsetHeight;
                    if (that.isRendered()) {
                        data.callback();
                        that.observer.disconnect();
                        that.elementObserver.disconnect();
                    }
                }
            }

            watchedElementData = {
                element: that.element,
                offsetWidth: that.element.offsetWidth,
                offsetHeight: that.element.offsetHeight,
                callback: resizeFn
            };

            if (!that.observer) {
                that.observer = new MutationObserver(checkForChanges);
                that.observer.observe(document.body, {
                    attributes: true,
                    childList: true,
                    characterData: true
                });
                that.elementObserver = new MutationObserver(checkForChanges);
                that.elementObserver.observe(that.element, {
                    attributes: true,
                    childList: true,
                    characterData: true
                });

            }
        },

        data: function (element, key, value) {
            var that = this;
            var node = element;
            if (!element) {
                node = this.element;
            }
            if (value === undefined) {
                var id = node[that.expando],
                    store = id && that.cache[id];

                if (key === undefined) {
                    return store;
                } else if (store) {
                    if (key in store) {
                        return store[key];
                    }
                }
            } else if (key !== undefined) {
                var id = node[that.expando];
                if (!id) {
                    node[that.expando] = ++jqxHelper.guid;
                    id = node[that.expando];
                }
                that.cache[id] = that.cache[id] || {};
                that.cache[id][key] = value;

                return value;
            }
        },

        removeData: function (element, keys) {
            var that = this;
            var node = element;
            if (!node) {
                node = that.element;
            }
            var id = node[that.expando],
                store = id && that.cache[id];

            if (store) {
                if (keys) {
                    $.each(keys, function (_, key) {
                        delete store[key];
                    });
                }
                else {
                    delete that.cache[id].data;
                }
            }
        },

        trim: function (text) {
            var whitespace = "[\\x20\\t\\r\\n\\f]";
            var rwhitespace = new RegExp(whitespace + "+", "g");
            rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
            return text == null ?
               "" :
               (text + "").replace(rtrim, "");
        },

        getClass: function () {
            var that = this;
            return that.element.getAttribute('class') || "";
        },

        hasClass: function (selector) {
            var that = this;
            var className = " " + selector + " ";
            var rclass = /[\t\r\n]/g;

            if (that.element.nodeType === 1 && (" " + that.element.className + " ").replace(rclass, " ").indexOf(className) >= 0) {
                return true;
            }

            return false;
        },

        addClass: function (value) {
            var that = this;
            var classes, elem, cur, curValue, clazz, j, finalValue,
            i = 0;
            var rnotwhite = (/\S+/g);
            var rclass = /[\t\r\n]/g;

            if (typeof value === "string" && value) {
                classes = value.match(rnotwhite) || [];

                var elem = that.element;
                curValue = that.getClass();
                cur = elem.nodeType === 1 &&
                    (" " + curValue + " ").replace(rclass, " ");

                if (cur) {
                    j = 0;
                    while ((clazz = classes[j++])) {
                        if (cur.indexOf(" " + clazz + " ") < 0) {
                            cur += clazz + " ";
                        }
                    }

                    // only assign if different to avoid unneeded rendering.
                    finalValue = that.trim(cur);
                    if (curValue !== finalValue) {
                        elem.setAttribute('class', finalValue);
                    }
                }
            }
        },

        removeClass: function (value) {
            var that = this;
            var classes, elem, cur, curValue, clazz, j, finalValue,
             i = 0;
            var rclass = /[\t\r\n]/g;
            var rnotwhite = (/\S+/g);

            if (0 == arguments.length) {
                return that.element.setAttribute('class', '');
            }

            if (typeof value === "string" && value) {
                classes = value.match(rnotwhite) || [];

                var elem = that.element;
                curValue = that.getClass();

                // This expression is here for better compressibility (see addClass)
                cur = elem.nodeType === 1 &&
                    (" " + curValue + " ").replace(rclass, " ");

                if (cur) {
                    j = 0;
                    while ((clazz = classes[j++])) {

                        // Remove *all* instances
                        while (cur.indexOf(" " + clazz + " ") > -1) {
                            cur = cur.replace(" " + clazz + " ", " ");
                        }
                    }

                    // Only assign if different to avoid unneeded rendering.
                    finalValue = that.trim(cur);
                    if (curValue !== finalValue) {
                        elem.setAttribute('class', finalValue);
                    }
                }
            }
        },

        html: function (value) {
            var that = this;
            try {
                var elem = that.element || {},
                    i = 0,
                    l = that.element.length;

                if (value === undefined) {
                    return elem.nodeType === 1 ?
                        elem.innerHTML.replace(rinlinejQuery, "") :
                        undefined;
                }

                var rnoInnerhtml = /<(?:script|style|link)/i,
                    nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
        "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
                    rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
                    rtagName = /<([\w:]+)/,
                    rnocache = /<(?:script|object|embed|option|style)/i,
                    rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
                    rleadingWhitespace = /^\s+/,
                    wrapMap = {
                        option: [1, "<select multiple='multiple'>", "</select>"],
                        legend: [1, "<fieldset>", "</fieldset>"],
                        thead: [1, "<table>", "</table>"],
                        tr: [2, "<table><tbody>", "</tbody></table>"],
                        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                        area: [1, "<map>", "</map>"],
                        _default: [0, "", ""]
                    };

                var div = document.createElement("div"),
                    fragment = document.createDocumentFragment(),
                    input = document.createElement("input");

                // Setup
                div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

                // IE strips leading whitespace when .innerHTML is used
                var leadingWhitespace = div.firstChild.nodeType === 3;
                var htmlSerialize = !!div.getElementsByTagName("link").length;

                if (typeof value === "string" && !rnoInnerhtml.test(value) &&
                    (htmlSerialize || !rnoshimcache.test(value)) &&
                    (leadingWhitespace || !rleadingWhitespace.test(value)) &&
                    !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

                    value = value.replace(rxhtmlTag, "<$1></$2>");

                    elem.innerHTML = value;
                }
                else {
                    that.element.innerHTML = "";
                    that.element.appendChild(value);
                }
            }
            catch (error) {
            }
        },

        isBoolean: function (value) {
            return typeof value === 'boolean';
        },

        isFunction: function (value) {
            return !!(value && value.constructor && value.call && value.apply);
        },

        isObject: function (value) {
            return (value && (typeof value === 'object' || that.isFunction(value))) || false;
        },

        isDate: function (value) {
            return value instanceof Date;
        },

        isString: function (value) {
            return typeof value === 'string';
        },

        isNumber: function (value) {
            return typeof value === 'number' && isFinite(value);
        },

        isNull: function (value) {
            return value === null;
        },

        isUndefined: function (value) {
            return typeof value === 'undefined';
        },

        isEmpty: function (value) {
            if (!this.isString(value) && this.isValue(value)) {
                return false;
            } else if (!this.isValue(value)) {
                return true;
            }
            value = that.trim(value).replace(/\&nbsp\;/ig, '').replace(/\&#160\;/ig, '');
            return value === "";
        },

        text: function () {
            var that = this;
            var node,
                ret = "",
                i = 0,
                nodeType = that.element.nodeType;
            var el = that.element;
            if (!nodeType) {
                while ((node = that.element[i++])) {
                    ret += getText(node);
                }
            } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                if (typeof that.element.textContent === "string") {
                    return that.element.textContent;
                } else {
                    // Traverse its children
                    for (var el = el.firstChild; el; el = el.nextSibling) {
                        ret += getText(el);
                    }
                }
            }
            else if (nodeType === 3 || nodeType === 4) {
                return that.element.nodeValue;
            }

            return ret;
        },

        val: function (value) {
            var hooks, ret, isFunction,
                elem = that.element;
            var rreturn = /\r/g;

            if (!arguments.length) {
                if (elem) {

                    ret = elem.value;

                    var returnValue = typeof ret === "string" ?
                        ret.replace(rreturn, "") :
                        ret == null ? "" : ret;

                    return returnValue;
                }

                return;
            }

            if (elem.nodeType !== 1) {
                return;
            }

            if (value === null) {
                value = "";
            }

            if (typeof value === "number") {
                value += "";
            }
            elem.value = value;
        },

        boxModel: function (name, extra, isBorderBox) {
            var cssExpand = ["Top", "Right", "Bottom", "Left"];
            var that = this;
            var i = extra === (isBorderBox ? "border" : "content") ?
                4 :
                name === "width" ? 1 : 0,

                val = 0;

            for (; i < 4; i += 2) {
                if (extra === "margin") {
                    val += that.css(extra + cssExpand[i], true);
                }

                if (isBorderBox) {
                    if (extra === "content") {
                        val -= parseFloat(that.css("padding" + cssExpand[i])) || 0;
                    }

                    if (extra !== "margin") {
                        val -= parseFloat(that.css("border" + cssExpand[i] + "Width")) || 0;
                    }
                } else {
                    val += parseFloat(that.css("padding" + cssExpand[i])) || 0;

                    if (extra !== "padding") {
                        val += parseFloat(that.css(this.element, "border" + cssExpand[i] + "Width")) || 0;
                    }
                }
            }

            return val;
        },

        width: function (width) {
            var that = this;
            if (that.element != null && that.element == that.element.window) {
                return that.element.document.documentElement["clientWidth"];
            }

            // Get document width or height
            if (that.element.nodeType === 9) {
                var doc = that.element.documentElement;
                return Math.max(
                   that.element.body["scrollWidth"], doc["scrollWidth"],
                   that.element.body["offsetWidth"], doc["offsetWidth"],
                   doc["clientWidth"]
               );
            }
            var isBorderBox = this.element.style.boxSizing == "border-box";
            if (width) {
                if (!isNaN(width)) {
                    width = width + "px";
                }
                that.element.style.width = width;
            }
            var value = that.element.offsetWidth;
            value += that.boxModel("width", "content" || (isBorderBox ? "border" : "content"), true);
            return value;
        },

        innerWidth: function () {
            var that = this;

            var paddingLeft = parseFloat(that.css('paddingLeft'));
            var paddingRight = parseFloat(that.css('paddingRight'));
            var borderLeftWidth = parseFloat(that.css('borderLeftWidth'));
            var borderRightWidth = parseFloat(that.css('borderRightWidth'));

            if (isNaN(paddingLeft)) {
                paddingLeft = 0;
            }

            if (isNaN(paddingRight)) {
                paddingRight = 0;
            }

            if (isNaN(borderLeftWidth)) {
                borderLeftWidth = 0;
            }

            if (isNaN(borderRightWidth)) {
                borderRightWidth = 0;
            }

            return that.width() + paddingLeft + paddingRight + borderLeftWidth + borderRightWidth;
        },

        innerHeight: function () {
            var that = this;

            var paddingTop = parseFloat(that.css('paddingTop'));
            var paddingBottom = parseFloat(that.css('paddingBottom'));
            var borderTopWidth = parseFloat(that.css('borderTopWidth'));
            var borderBottomWidth = parseFloat(that.css('borderBottomWidth'));

            if (isNaN(paddingTop)) {
                paddingTop = 0;
            }

            if (isNaN(paddingBottom)) {
                paddingBottom = 0;
            }

            if (isNaN(borderTopWidth)) {
                borderTopWidth = 0;
            }

            if (isNaN(borderBottomWidth)) {
                borderBottomWidth = 0;
            }

            return that.height() + paddingTop + paddingBottom + borderTopWidth + borderBottomWidth;
        },

        outerWidth: function () {
            var that = this;

            var marginLeft = parseFloat(that.element.style.marginLeft);
            var marginRight = parseFloat(that.element.style.marginRight);

            if (isNaN(marginLeft)) {
                marginLeft = 0;
            }

            if (isNaN(marginRight)) {
                marginRight = 0;
            }

            return that.element.offsetWidth + marginLeft + marginRight;
        },

        height: function (height) {
            var that = this;
            if (that.element != null && that.element == that.element.window) {
                return that.element.document.documentElement["clientHeight"];
            }

            // Get document height or height
            if (that.element.nodeType === 9) {
                var doc = that.element.documentElement;
                return Math.max(
                   that.element.body["scrollHeight"], doc["scrollHeight"],
                   that.element.body["offsetHeight"], doc["offsetHeight"],
                   doc["clientHeight"]
               );
            }
            var isBorderBox = this.element.style.boxSizing == "border-box";
            if (height) {
                if (!isNaN(height)) {
                    height = height + "px";
                }
                that.element.style.height = height;
            }
            var value = that.element.offsetHeight;
            value += that.boxModel("height", "content" || (isBorderBox ? "border" : "content"), true);

            return value;
        },

        outerHeight: function () {
            var that = this;
            var marginTop = parseFloat(that.element.style.marginTop);
            var marginBottom = parseFloat(that.element.style.marginBottom);

            if (isNaN(marginTop)) {
                marginTop = 0;
            }

            if (isNaN(marginBottom)) {
                marginBottom = 0;
            }

            return that.element.offsetHeight + marginTop + marginBottom;
        },

        css: function(name)
        {
            var that = this;
            var curCSS;
            var core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source;
            var rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i");
            var  rmargin = /^margin/;

            if (window.getComputedStyle) {
                curCSS = function (elem, name) {
                    var ret, width, minWidth, maxWidth,
                        computed = window.getComputedStyle(elem, null),
                        style = elem.style;

                    if (computed) {

                        // getPropertyValue is only needed for .css('filter') in IE9, see #12537
                        ret = computed.getPropertyValue(name) || computed[name];

                        if (ret === "" && !that.contains(elem.ownerDocument, elem)) {
                            ret = style[name];
                        }

                        if (rnumnonpx.test(ret) && rmargin.test(name)) {
                            width = style.width;
                            minWidth = style.minWidth;
                            maxWidth = style.maxWidth;

                            style.minWidth = style.maxWidth = style.width = ret;
                            ret = computed.width;

                            style.width = width;
                            style.minWidth = minWidth;
                            style.maxWidth = maxWidth;
                        }
                    }

                    return ret;
                };
            }
            else if (document.documentElement.currentStyle)
            {
                curCSS = function (elem, name) {
                    var left, rsLeft,
                        ret = elem.currentStyle && elem.currentStyle[name],
                        style = elem.style;

                    if (ret == null && style && style[name]) {
                        ret = style[name];
                    }

                    if (rnumnonpx.test(ret) && !rposition.test(name)) {

                        left = style.left;
                        rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

                        if (rsLeft) {
                            elem.runtimeStyle.left = elem.currentStyle.left;
                        }
                        style.left = name === "fontSize" ? "1em" : ret;
                        ret = style.pixelLeft + "px";

                        style.left = left;
                        if (rsLeft) {
                            elem.runtimeStyle.left = rsLeft;
                        }
                    }

                    return ret === "" ? "auto" : ret;
                };
            }
            return curCSS(that.element, name);
        },

        offset: function (options) {
            var that = this;
            var elem = that.element;
            if (options) {
                var position = that.css('position');

                // set position first, in-case top/left are set even on static elem
                if (position === "static") {
                    elem.style.position = "relative";
                }

                var curElem = elem,
                curOffset = that.offset(),
                curCSSTop = elem.style.top,
                curCSSLeft = elem.style.left,
                calculatePosition = ((position === "absolute" || position === "fixed") && (curCSSTop === "auto" || curCSSLeft === "auto")),
                props = {}, curPosition = {}, curTop, curLeft;

                // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
                if (calculatePosition) {
                    curPosition = that.position();
                    curTop = curPosition.top;
                    curLeft = curPosition.left;
                } else {
                    curTop = parseFloat(curCSSTop) || 0;
                    curLeft = parseFloat(curCSSLeft) || 0;
                }

                if (that.isFunction(options)) {
                    options = options.call(elem, i, curOffset);
                }

                if (options.top != null) {
                    props.top = (options.top - curOffset.top) + curTop;
                }
                if (options.left != null) {
                    props.left = (options.left - curOffset.left) + curLeft;
                }

                curElem.style.left = props.left + "px";
                curElem.style.top = props.top + "px";
                return;
            }

            var docElem, win,
                box = { top: 0, left: 0 },
                doc = elem && elem.ownerDocument;
            if (!doc) {
                return;
            }
            docElem = doc.documentElement;
            if (!that.contains(docElem, elem)) {
                return box;
            }
            if (typeof elem.getBoundingClientRect !== "undefined") {
                box = elem.getBoundingClientRect();
            }

            var isWindow = function (obj) {
                return obj != null && obj == obj.window;
            }

            var getWindow = function (elem) {
                return isWindow(elem) ?
                    elem :
                    elem.nodeType === 9 ?
                        elem.defaultView || elem.parentWindow :
                        false;
            };

            win = getWindow(doc);
            var additionalLeftOffset = 0;
            var additionalTopOffset = 0;
            var agent = navigator.userAgent.toLowerCase();
            var result = agent.indexOf('ipad') != -1 || agent.indexOf('iphone') != -1;
            if (result) {
                // fix for iphone/ipad left offsets.
                additionalLeftOffset = 2;
            }

            return {
                top: additionalTopOffset + box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
                left: additionalLeftOffset + box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
            };
        },

        position: function () {
            var that = this;
            var rroot = /^(?:body|html)$/i;
            var elem = that.element,

            // Get *real* offsetParent
            offsetParent = jqxHelper(function () {
                var offsetParent = elem.offsetParent || document.body;
                while (offsetParent && (!rroot.test(offsetParent.nodeName) && jqxHelper(offsetParent).css('position') === "static")) {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent || document.body;
            }());

            // Get correct offsets
            offset = that.offset(),
            parentOffset = rroot.test(offsetParent.nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

            // Subtract element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            offset.top -= parseFloat(jqxHelper(elem).css("marginTop")) || 0;
            offset.left -= parseFloat(jqxHelper(elem).css("marginLeft")) || 0;

            // Add offsetParent borders
            parentOffset.top += parseFloat(offsetParent.css("borderTopWidth")) || 0;
            parentOffset.left += parseFloat(offsetParent.css("borderLeftWidth")) || 0;

            // Subtract the two offsets
            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        },

        contains: function (a, b) {
            var adown = a.nodeType === 9 ? a.documentElement : a,
                bup = b && b.parentNode;
            return a === bup || !!(bup && bup.nodeType === 1 && adown.contains && adown.contains(bup));
        },

        camelCase: function (string) {
            var rdashAlpha = /-([\da-z])/gi;
            var fcamelCase = function (all, letter) {
                return letter.toUpperCase();
            };

            return string.replace(rdashAlpha, fcamelCase);
        },

        attr: function (name, value) {
            var element = this.element;

            var ret, hooks,
                nType = element.nodeType;

            // Don't get/set attributes on text, comment and attribute nodes
            if (nType === 3 || nType === 8 || nType === 2) {
                return undefined;
            }

            if (typeof element.getAttribute === "undefined") {
                return undefined;
            }

            if (value !== undefined) {
                if (value === null) {
                    removeAttr(element, name);
                    return;
                }


                element.setAttribute(name, value + "");
                return value;
            }
            else {
                return element.getAttribute(name);
            }

            return undefined;
        },

        removeAttr: function (value) {
            var that = this;
            var element = that.element;
            var rnotwhite = (/\S+/g);
            var name, propName,
                 i = 0,
                 attrNames = value && value.match(rnotwhite);

            if (attrNames && element.nodeType === 1) {
                while ((name = attrNames[i++])) {
                    propName = name;
                    if (propName == "class") {
                        propName = "className";
                    }

                    var booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped";
                    var boolExpr = new RegExp("^(?:" + booleans + ")$", "i");
                    var ruseDefault = /^(?:checked|selected)$/i;
                    if (boolExpr.test(name)) {
                        if (!ruseDefault.test(name)) {
                            element[propName] = false;

                        } else {
                            element[that.camelCase("default-" + name)] =
                                element[propName] = false;
                        }

                    } else {
                        that.attr(name, "");
                    }
                    element.removeAttribute(name);
                }
            }
        },

        showHide: function (show) {
            var that = this;
            var display, elem, hidden,
                olddisplay = undefined,
                index = 0,
                length = that.length;


            elem = that.element;
            if (!elem.style) {
                return;
            }

            var isHidden = function(elem, el) {
                elem = el || elem;
                return that.css(elem, "display") === "none" || !that.contains(elem.ownerDocument, elem);
            }

            olddisplay = that.data("olddisplay");
            display = elem.style.display;
            if (show) {
                if (!olddisplay && display === "none") {
                    elem.style.display = "";
                }

                if (elem.style.display === "" && isHidden(elem)) {
                    olddisplay =
                        that.data("olddisplay", elem.style.display);
                }
            } else {
                hidden = elem.style.display == "none";

                if (display && display !== "none" || !hidden) {
                    that.data(
                        "olddisplay",
                        hidden ? display : elem.style.display
                    );
                }
            }

            if (!show || elem.style.display === "none" || elem.style.display === "") {
                elem.style.display = show ? olddisplay || "" : "none";
            }
        },

        show: function () {
            var that = this;
            that.showHide(true);
        },

        hide: function () {
            var that = this;
            that.showHide(false);
        },

        isEmptyObject: function (variable) {
            for (var name in variable) {
                return false;
            }

            return true;
        },

        toArray: function () {
            return Array.prototype.slice.call(this);
        },

        isArraylike: function (obj) {
            var that = this;
            var length = obj.length,
                type = that.type(obj);

            if (type === "function" || that.isWindow(obj)) {
                return false;
            }

            if (obj.nodeType === 1 && length) {
                return true;
            }

            return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
        },

        each: function (obj, callback, args) {
            var that = this;
            if (this.isFunction(obj)) {
                args = callback;
                callback = obj;
                obj = this;

            }
            var value,
                i = 0,
                length = obj.length,
                isArray = that.isArraylike(obj);

            if (args) {
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.apply(obj[i], args);

                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.apply(obj[i], args);

                        if (value === false) {
                            break;
                        }
                    }
                }

            } else {
                if (isArray) {
                    for (; i < length; i++) {
                        value = callback.call(obj[i], i, obj[i]);

                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.call(obj[i], i, obj[i]);

                        if (value === false) {
                            break;
                        }
                    }
                }
            }

            return obj;
        },

        queue: function (elem, type, data) {
            var that = this;
            function $makeArray(arr, results) {
                var ret = results || [];

                if (arr != null) {
                    if (that.isArraylike(Object(arr))) {
                        /* $.merge */
                        (function (first, second) {
                            var len = +second.length,
                                j = 0,
                                i = first.length;

                            while (j < len) {
                                first[i++] = second[j++];
                            }

                            if (len !== len) {
                                while (second[j] !== undefined) {
                                    first[i++] = second[j++];
                                }
                            }

                            first.length = i;

                            return first;
                        })(ret, typeof arr === "string" ? [arr] : arr);
                    } else {
                        [].push.call(ret, arr);
                    }
                }

                return ret;
            }

            if (!elem) {
                return;
            }

            type = (type || "fx") + "queue";

            var q = that.data(elem, type);

            if (!data) {
                return q || [];
            }

            if (!q || that.isArray(data)) {
                q = that.data(elem, type, $makeArray(data));
            } else {
                q.push(data);
            }

            return q;
        },

        dequeue: function (elems, type) {
            var that = this;
            that.each(elems.nodeType ? [elems] : elems, function (i, elem) {
                type = type || "fx";

                var queue = that.queue(elem, type),
                    fn = queue.shift();

                if (fn === "inprogress") {
                    fn = queue.shift();
                }

                if (fn) {
                    if (type === "fx") {
                        queue.unshift("inprogress");
                    }

                    fn.call(elem, function () {
                        that.dequeue(elem, type);
                    });
                }
            });
        },

        initAnimate: function () {
            // animations
            var that = this;
            var element = that.element;
            var rAFShim = (function () {
                var timeLast = 0;

                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
                    var timeCurrent = (new Date()).getTime(),
                        timeDelta;

                    timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
                    timeLast = timeCurrent + timeDelta;

                    return setTimeout(function () { callback(timeCurrent + timeDelta); }, timeDelta);
                };
            })();

            var DURATION_DEFAULT = 400,
              EASING_DEFAULT = "easeInOutSine";

            var jqxAnimations = {
                /* Container for page-wide jqxAnimations state data. */
                State: {
                    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                    isAndroid: /Android/i.test(navigator.userAgent),
                    isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
                    isChrome: window.chrome,
                    isFirefox: /Firefox/i.test(navigator.userAgent),
                    prefixElement: document.createElement("div"),
                    prefixMatches: {},
                    scrollAnchor: null,
                    scrollPropertyLeft: null,
                    scrollPropertyTop: null,
                    isTicking: false,
                    calls: []
                },
                /* jqxAnimations's custom CSS stack. Made global for unit testing. */
                CSS: { /* Defined below. */ },
                /* A shim of the jQuery utility functions used by jqxAnimations -- provided by jqxAnimations's optional jQuery shim. */
                Utilities: $,
                /* Container for the user's custom animation redirects that are referenced by name in place of the properties map argument. */
                Redirects: { /* Manually registered by the user. */ },
                Easings: { /* Defined below. */ },
                /* Attempt to use ES6 Promises by default. Users can override this with a third-party promises library. */
                Promise: window.Promise,
                /* jqxAnimations option defaults, which can be overriden by the user. */
                defaults: {
                    queue: "",
                    duration: DURATION_DEFAULT,
                    easing: EASING_DEFAULT,
                    begin: undefined,
                    complete: undefined,
                    progress: undefined,
                    display: undefined,
                    visibility: undefined,
                    loop: false,
                    delay: false,
                    mobileHA: true,
                    /* Advanced: Set to false to prevent property values from being cached between consecutive jqxAnimations-initiated chain calls. */
                    _cacheValues: true
                },
                /* A design goal of jqxAnimations is to cache data wherever possible in order to avoid DOM requerying. Accordingly, each element has a data cache. */
                init: function (element) {
                    that.data(element, "jqxAnimations", {
                        isAnimating: false,
                        computedStyle: null,
                        tweensContainer: null,
                        rootPropertyValueCache: {},
                        transformCache: {}
                    });
                },
                /* A parallel to jQuery's that.css(), used for getting/setting jqxAnimations's hooked CSS properties. */
                hook: null, /* Defined below. */
                /* jqxAnimations-wide animation time remapping for testing purposes. */
                mock: false,
                version: { major: 1, minor: 2, patch: 2 },
                /* Set to 1 or 2 (most verbose) to output debug info to console. */
                debug: false
            };

            function Data(element) {
                var response = that.data(element, "jqxAnimations");
                return response === null ? undefined : response;
            };

            /**************
                Easing
            **************/

            function generateStep(steps) {
                return function (p) {
                    return Math.round(p * steps) * (1 / steps);
                };
            }

            function generateBezier(mX1, mY1, mX2, mY2) {
                var NEWTON_ITERATIONS = 4,
                    NEWTON_MIN_SLOPE = 0.001,
                    SUBDIVISION_PRECISION = 0.0000001,
                    SUBDIVISION_MAX_ITERATIONS = 10,
                    kSplineTableSize = 11,
                    kSampleStepSize = 1.0 / (kSplineTableSize - 1.0),
                    float32ArraySupported = "Float32Array" in window;

                /* Must contain four arguments. */
                if (arguments.length !== 4) {
                    return false;
                }

                /* Arguments must be numbers. */
                for (var i = 0; i < 4; ++i) {
                    if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
                        return false;
                    }
                }

                /* X values must be in the [0, 1] range. */
                mX1 = Math.min(mX1, 1);
                mX2 = Math.min(mX2, 1);
                mX1 = Math.max(mX1, 0);
                mX2 = Math.max(mX2, 0);

                var mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

                function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
                function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
                function C(aA1) { return 3.0 * aA1; }

                function calcBezier(aT, aA1, aA2) {
                    return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
                }

                function getSlope(aT, aA1, aA2) {
                    return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
                }

                function newtonRaphsonIterate(aX, aGuessT) {
                    for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
                        var currentSlope = getSlope(aGuessT, mX1, mX2);

                        if (currentSlope === 0.0) return aGuessT;

                        var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
                        aGuessT -= currentX / currentSlope;
                    }

                    return aGuessT;
                }

                function calcSampleValues() {
                    for (var i = 0; i < kSplineTableSize; ++i) {
                        mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
                    }
                }

                function binarySubdivide(aX, aA, aB) {
                    var currentX, currentT, i = 0;

                    do {
                        currentT = aA + (aB - aA) / 2.0;
                        currentX = calcBezier(currentT, mX1, mX2) - aX;
                        if (currentX > 0.0) {
                            aB = currentT;
                        } else {
                            aA = currentT;
                        }
                    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

                    return currentT;
                }

                function getTForX(aX) {
                    var intervalStart = 0.0,
                        currentSample = 1,
                        lastSample = kSplineTableSize - 1;

                    for (; currentSample != lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
                        intervalStart += kSampleStepSize;
                    }

                    --currentSample;

                    var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample + 1] - mSampleValues[currentSample]),
                        guessForT = intervalStart + dist * kSampleStepSize,
                        initialSlope = getSlope(guessForT, mX1, mX2);

                    if (initialSlope >= NEWTON_MIN_SLOPE) {
                        return newtonRaphsonIterate(aX, guessForT);
                    } else if (initialSlope == 0.0) {
                        return guessForT;
                    } else {
                        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
                    }
                }

                var _precomputed = false;

                function precompute() {
                    _precomputed = true;
                    if (mX1 != mY1 || mX2 != mY2) calcSampleValues();
                }

                var f = function (aX) {
                    if (!_precomputed) precompute();
                    if (mX1 === mY1 && mX2 === mY2) return aX;
                    if (aX === 0) return 0;
                    if (aX === 1) return 1;

                    return calcBezier(getTForX(aX), mY1, mY2);
                };

                f.getControlPoints = function () { return [{ x: mX1, y: mY1 }, { x: mX2, y: mY2 }]; };

                var str = "generateBezier(" + [mX1, mY1, mX2, mY2] + ")";
                f.toString = function () { return str; };

                return f;
            }

            var generateSpringRK4 = (function () {
                function springAccelerationForState(state) {
                    return (-state.tension * state.x) - (state.friction * state.v);
                }

                function springEvaluateStateWithDerivative(initialState, dt, derivative) {
                    var state = {
                        x: initialState.x + derivative.dx * dt,
                        v: initialState.v + derivative.dv * dt,
                        tension: initialState.tension,
                        friction: initialState.friction
                    };

                    return { dx: state.v, dv: springAccelerationForState(state) };
                }

                function springIntegrateState(state, dt) {
                    var a = {
                        dx: state.v,
                        dv: springAccelerationForState(state)
                    },
                        b = springEvaluateStateWithDerivative(state, dt * 0.5, a),
                        c = springEvaluateStateWithDerivative(state, dt * 0.5, b),
                        d = springEvaluateStateWithDerivative(state, dt, c),
                        dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx),
                        dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);

                    state.x = state.x + dxdt * dt;
                    state.v = state.v + dvdt * dt;

                    return state;
                }

                return function springRK4Factory(tension, friction, duration) {

                    var initState = {
                        x: -1,
                        v: 0,
                        tension: null,
                        friction: null
                    },
                        path = [0],
                        time_lapsed = 0,
                        tolerance = 1 / 10000,
                        DT = 16 / 1000,
                        have_duration, dt, last_state;

                    tension = parseFloat(tension) || 500;
                    friction = parseFloat(friction) || 20;
                    duration = duration || null;

                    initState.tension = tension;
                    initState.friction = friction;

                    have_duration = duration !== null;

                    /* Calculate the actual time it takes for this animation to complete with the provided conditions. */
                    if (have_duration) {
                        /* Run the simulation without a duration. */
                        time_lapsed = springRK4Factory(tension, friction);
                        /* Compute the adjusted time delta. */
                        dt = time_lapsed / duration * DT;
                    } else {
                        dt = DT;
                    }

                    while (true) {
                        /* Next/step function .*/
                        last_state = springIntegrateState(last_state || initState, dt);
                        /* Store the position. */
                        path.push(1 + last_state.x);
                        time_lapsed += 16;
                        /* If the change threshold is reached, break. */
                        if (!(Math.abs(last_state.x) > tolerance && Math.abs(last_state.v) > tolerance)) {
                            break;
                        }
                    }

                    return !have_duration ? time_lapsed : function (percentComplete) { return path[(percentComplete * (path.length - 1)) | 0]; };
                };
            }());

            jqxAnimations.Easings = {
                linear: function (p) { return p; },
                swing: function (p) { return 0.5 - Math.cos(p * Math.PI) / 2 },
                spring: function (p) { return 1 - (Math.cos(p * 4.5 * Math.PI) * Math.exp(-p * 6)); }
            };

            that.each(
                [
                    ["ease", [0.25, 0.1, 0.25, 1.0]],
                    ["ease-in", [0.42, 0.0, 1.00, 1.0]],
                    ["ease-out", [0.00, 0.0, 0.58, 1.0]],
                    ["ease-in-out", [0.42, 0.0, 0.58, 1.0]],
                    ["easeInSine", [0.47, 0, 0.745, 0.715]],
                    ["easeOutSine", [0.39, 0.575, 0.565, 1]],
                    ["easeInOutSine", [0.445, 0.05, 0.55, 0.95]],
                    ["easeInQuad", [0.55, 0.085, 0.68, 0.53]],
                    ["easeOutQuad", [0.25, 0.46, 0.45, 0.94]],
                    ["easeInOutQuad", [0.455, 0.03, 0.515, 0.955]],
                    ["easeInCubic", [0.55, 0.055, 0.675, 0.19]],
                    ["easeOutCubic", [0.215, 0.61, 0.355, 1]],
                    ["easeInOutCubic", [0.645, 0.045, 0.355, 1]],
                    ["easeInQuart", [0.895, 0.03, 0.685, 0.22]],
                    ["easeOutQuart", [0.165, 0.84, 0.44, 1]],
                    ["easeInOutQuart", [0.77, 0, 0.175, 1]],
                    ["easeInQuint", [0.755, 0.05, 0.855, 0.06]],
                    ["easeOutQuint", [0.23, 1, 0.32, 1]],
                    ["easeInOutQuint", [0.86, 0, 0.07, 1]],
                    ["easeInExpo", [0.95, 0.05, 0.795, 0.035]],
                    ["easeOutExpo", [0.19, 1, 0.22, 1]],
                    ["easeInOutExpo", [1, 0, 0, 1]],
                    ["easeInCirc", [0.6, 0.04, 0.98, 0.335]],
                    ["easeOutCirc", [0.075, 0.82, 0.165, 1]],
                    ["easeInOutCirc", [0.785, 0.135, 0.15, 0.86]]
                ], function (i, easingArray) {
                    jqxAnimations.Easings[easingArray[0]] = generateBezier.apply(null, easingArray[1]);
                });

            /* Determine the appropriate easing type given an easing input. */
            function getEasing(value, duration) {
                var easing = value;

                if (Type.isString(value)) {
                    if (!jqxAnimations.Easings[value]) {
                        easing = false;
                    }
                } else if (Type.isArray(value) && value.length === 1) {
                    easing = generateStep.apply(null, value);
                } else if (Type.isArray(value) && value.length === 2) {
                    easing = generateSpringRK4.apply(null, value.concat([duration]));
                } else if (Type.isArray(value) && value.length === 4) {
                    easing = generateBezier.apply(null, value);
                } else {
                    easing = false;
                }

                /* Revert to the jqxAnimations-wide default easing type, or fall back to "swing" (which is also jQuery's default)
                   if the jqxAnimations-wide default has been incorrectly modified. */
                if (easing === false) {
                    if (jqxAnimations.Easings[jqxAnimations.defaults.easing]) {
                        easing = jqxAnimations.defaults.easing;
                    } else {
                        easing = EASING_DEFAULT;
                    }
                }

                return easing;
            }

            var CSS = jqxAnimations.CSS = {


                RegEx: {
                    isHex: /^#([A-f\d]{3}){1,2}$/i,
                    /* Unwrap a property value's surrounding text, e.g. "rgba(4, 3, 2, 1)" ==> "4, 3, 2, 1" and "rect(4px 3px 2px 1px)" ==> "4px 3px 2px 1px". */
                    valueUnwrap: /^[A-z]+\((.*)\)$/i,
                    wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
                    /* Split a multi-value property into an array of subvalues, e.g. "rgba(4, 3, 2, 1) 4px 3px 2px 1px" ==> [ "rgba(4, 3, 2, 1)", "4px", "3px", "2px", "1px" ]. */
                    valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/ig
                },

                Hooks: {
                    /* Look up the root property associated with the hook (e.g. return "textShadow" for "textShadowBlur"). */
                    /* Since a hook cannot be set directly (the browser won't recognize it), style updating for hooks is routed through the hook's root property. */
                    getRoot: function (property) {
                        return property;
                    },
                    /* Convert any rootPropertyValue, null or otherwise, into a space-delimited list of hook values so that
                       the targeted hook can be injected or extracted at its standard position. */
                    cleanRootPropertyValue: function (rootProperty, rootPropertyValue) {
                        if (CSS.RegEx.valueUnwrap.test(rootPropertyValue)) {
                            rootPropertyValue = rootPropertyValue.match(CSS.RegEx.valueUnwrap)[1];
                        }

                        if (CSS.Values.isCSSNullValue(rootPropertyValue)) {
                            rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                        }

                        return rootPropertyValue;
                    },
                    /* Extracted the hook's value from its root property's value. This is used to get the starting value of an animating hook. */
                    extractValue: function (fullHookName, rootPropertyValue) {
                        var hookData = CSS.Hooks.registered[fullHookName];

                        if (hookData) {
                            var hookRoot = hookData[0],
                                hookPosition = hookData[1];

                            rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                            /* Split rootPropertyValue into its constituent hook values then grab the desired hook at its standard position. */
                            return rootPropertyValue.toString().match(CSS.RegEx.valueSplit)[hookPosition];
                        } else {
                            /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                            return rootPropertyValue;
                        }
                    },
                    injectValue: function (fullHookName, hookValue, rootPropertyValue) {
                        var hookData = CSS.Hooks.registered[fullHookName];

                        if (hookData) {
                            var hookRoot = hookData[0],
                                hookPosition = hookData[1],
                                rootPropertyValueParts,
                                rootPropertyValueUpdated;

                            rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                            /* Split rootPropertyValue into its individual hook values, replace the targeted value with hookValue,
                               then reconstruct the rootPropertyValue string. */
                            rootPropertyValueParts = rootPropertyValue.toString().match(CSS.RegEx.valueSplit);
                            rootPropertyValueParts[hookPosition] = hookValue;
                            rootPropertyValueUpdated = rootPropertyValueParts.join(" ");

                            return rootPropertyValueUpdated;
                        } else {
                            /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                            return rootPropertyValue;
                        }
                    }
                },

                Normalizations: {
                    registered: {
                        clip: function (type, element, propertyValue) {
                            switch (type) {
                                case "name":
                                    return "clip";
                                    /* Clip needs to be unwrapped and stripped of its commas during extraction. */
                                case "extract":
                                    var extracted;

                                    /* If jqxAnimations also extracted this value, skip extraction. */
                                    if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                                        extracted = propertyValue;
                                    } else {
                                        /* Remove the "rect()" wrapper. */
                                        extracted = propertyValue.toString().match(CSS.RegEx.valueUnwrap);

                                        /* Strip off commas. */
                                        extracted = extracted ? extracted[1].replace(/,(\s+)?/g, " ") : propertyValue;
                                    }

                                    return extracted;
                                    /* Clip needs to be re-wrapped during injection. */
                                case "inject":
                                    return "rect(" + propertyValue + ")";
                            }
                        },

                        blur: function (type, element, propertyValue) {
                            switch (type) {
                                case "name":
                                    return jqxAnimations.State.isFirefox ? "filter" : "-webkit-filter";
                                case "extract":
                                    var extracted = parseFloat(propertyValue);

                                    if (!(extracted || extracted === 0)) {
                                        var blurComponent = propertyValue.toString().match(/blur\(([0-9]+[A-z]+)\)/i);

                                        if (blurComponent) {
                                            extracted = blurComponent[1];
                                        } else {
                                            extracted = 0;
                                        }
                                    }

                                    return extracted;
                                case "inject":
                                    if (!parseFloat(propertyValue)) {
                                        return "none";
                                    } else {
                                        return "blur(" + propertyValue + ")";
                                    }
                            }
                        },

                        opacity: function (type, element, propertyValue) {
                            switch (type) {
                                case "name":
                                    return "opacity";
                                case "extract":
                                    return propertyValue;
                                case "inject":
                                    return propertyValue;
                            }
                        }
                    },

                    register: function () {





                    }
                },

                Names: {
                    prefixCheck: function (property) {
                        var vendors = ["", "Webkit", "Moz", "ms", "O"];

                        for (var i = 0, vendorsLength = vendors.length; i < vendorsLength; i++) {
                            var propertyPrefixed;

                            if (i === 0) {
                                propertyPrefixed = property;
                            } else {
                                propertyPrefixed = vendors[i] + property.replace(/^\w/, function (match) { return match.toUpperCase(); });
                            }

                            if (Type.isString(jqxAnimations.State.prefixElement.style[propertyPrefixed])) {
                                jqxAnimations.State.prefixMatches[property] = propertyPrefixed;
                                return [propertyPrefixed, true];
                            }
                        }

                        return [property, false];
                    }
                },

                Values: {
                    isCSSNullValue: function (value) {
                        return (value == 0 || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(value));
                    },

                    getUnitType: function (property) {
                        if (/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
                            return "";
                        } else {
                            return "px";
                        }
                    },

                    getDisplayType: function (element) {
                        var tagName = element && element.tagName.toString().toLowerCase();

                        if (/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(tagName)) {
                            return "inline";
                        } else if (/^(li)$/i.test(tagName)) {
                            return "list-item";
                        } else if (/^(tr)$/i.test(tagName)) {
                            return "table-row";
                        } else if (/^(table)$/i.test(tagName)) {
                            return "table";
                        } else if (/^(tbody)$/i.test(tagName)) {
                            return "table-row-group";
                            /* Default to "block" when no match is found. */
                        } else {
                            return "block";
                        }
                    }
                },

                getPropertyValue: function (element, property, rootPropertyValue, forceStyleLookup) {
                    function computePropertyValue(element, property) {
                        var computedValue = 0;
                        var toggleDisplay = false;

                        if (/^(width|height)$/.test(property) && CSS.getPropertyValue(element, "display") === 0) {
                            toggleDisplay = true;
                            CSS.setPropertyValue(element, "display", CSS.Values.getDisplayType(element));
                        }

                        function revertDisplay() {
                            if (toggleDisplay) {
                                CSS.setPropertyValue(element, "display", "none");
                            }
                        }

                        if (!forceStyleLookup) {
                            if (property === "height" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                                var contentBoxHeight = element.offsetHeight - (parseFloat(CSS.getPropertyValue(element, "borderTopWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderBottomWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingTop")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingBottom")) || 0);
                                revertDisplay();

                                return contentBoxHeight;
                            } else if (property === "width" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                                var contentBoxWidth = element.offsetWidth - (parseFloat(CSS.getPropertyValue(element, "borderLeftWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderRightWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingLeft")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingRight")) || 0);
                                revertDisplay();

                                return contentBoxWidth;
                            }
                        }

                        var computedStyle;

                        if (Data(element) === undefined) {
                            computedStyle = window.getComputedStyle(element, null); /* GET */
                        } else if (!Data(element).computedStyle) {
                            computedStyle = Data(element).computedStyle = window.getComputedStyle(element, null); /* GET */
                        } else {
                            computedStyle = Data(element).computedStyle;
                        }

                        computedValue = computedStyle[property];
                        if (computedValue === "" || computedValue === null) {
                            computedValue = element.style[property];
                        }

                        revertDisplay();

                        if (computedValue === "auto" && /^(top|right|bottom|left)$/i.test(property)) {
                            var position = computePropertyValue(element, "position"); /* GET */

                            if (position === "fixed" || (position === "absolute" && /top|left/i.test(property))) {
                                computedValue = $(element).position()[property] + "px"; /* GET */
                            }
                        }

                        return computedValue;
                    }

                    var propertyValue;

                    if (CSS.Normalizations.registered[property]) {
                        var normalizedPropertyName,
                            normalizedPropertyValue;

                        normalizedPropertyName = CSS.Normalizations.registered[property]("name", element);

                        normalizedPropertyValue = computePropertyValue(element, CSS.Names.prefixCheck(normalizedPropertyName)[0]); /* GET */

                        propertyValue = CSS.Normalizations.registered[property]("extract", element, normalizedPropertyValue);
                    }

                    if (!/^[\d-]/.test(propertyValue)) {
                        propertyValue = computePropertyValue(element, CSS.Names.prefixCheck(property)[0]);
                    }

                    if (CSS.Values.isCSSNullValue(propertyValue)) {
                        propertyValue = 0;
                    }

                    return propertyValue;
                },

                setPropertyValue: function (element, property, propertyValue, rootPropertyValue, scrollData) {
                    var propertyName = property;

                    if (CSS.Normalizations.registered[property]) {
                        propertyValue = CSS.Normalizations.registered[property]("inject", element, propertyValue);
                        property = CSS.Normalizations.registered[property]("name", element);
                    }

                    propertyName = CSS.Names.prefixCheck(property)[0];
                    element.style[propertyName] = propertyValue;
                    return [propertyName, propertyValue];
                }
            };

            CSS.Normalizations.register();

            jqxAnimations.hook = function (elements, arg2, arg3) {
                var value = undefined;

                elements = sanitizeElements(elements);

                that.each(elements, function (i, element) {
                    if (Data(element) === undefined) {
                        jqxAnimations.init(element);
                    }

                    if (arg3 === undefined) {
                        if (value === undefined) {
                            value = jqxAnimations.CSS.getPropertyValue(element, arg2);
                        }
                    } else {
                        var adjustedSet = jqxAnimations.CSS.setPropertyValue(element, arg2, arg3);
                        value = adjustedSet;
                    }
                });

                return value;
            };

            function sanitizeElements(elements) {
                if (Type.isWrapped(elements)) {
                    elements = [].slice.call(elements);
                } else if (Type.isNode(elements)) {
                    elements = [elements];
                }

                return elements;
            }


            var Type = {
                isString: function (variable) {
                    return (typeof variable === "string");
                },
                isArray: Array.isArray || function (variable) {
                    return Object.prototype.toString.call(variable) === "[object Array]";
                },
                isFunction: function (variable) {
                    return Object.prototype.toString.call(variable) === "[object Function]";
                },
                isNode: function (variable) {
                    return variable && variable.nodeType;
                },
                /* Copyright Martin Bohm. MIT License: https://gist.github.com/Tomalak/818a78a226a0738eaade */
                isNodeList: function (variable) {
                    return typeof variable === "object" &&
                        /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(variable)) &&
                        variable.length !== undefined &&
                        (variable.length === 0 || (typeof variable[0] === "object" && variable[0].nodeType > 0));
                },
                /* Determine if variable is a wrapped jQuery or Zepto element. */
                isWrapped: function (variable) {
                    return false;
                },
                isSVG: function (variable) {
                    return window.SVGElement && (variable instanceof window.SVGElement);
                },
                isEmptyObject: function (variable) {
                    for (var name in variable) {
                        return false;
                    }

                    return true;
                }
            }
            var animate = function () {

                function getChain() {
                    return null;
                }

                var syntacticSugar = (arguments[0] && (arguments[0].p || ((that.isPlainObject(arguments[0].properties) && !arguments[0].properties.names) || Type.isString(arguments[0].properties)))),
                    isUtility,
                    elementsWrapped,
                    argumentIndex;

                var elements,
                    propertiesMap,
                    options;


                isUtility = true;

                argumentIndex = 1;
                elements = syntacticSugar ? (arguments[0].elements || arguments[0].e) : arguments[0];

                elements = sanitizeElements(elements);

                if (!elements) {
                    return;
                }

                if (syntacticSugar) {
                    propertiesMap = arguments[0].properties || arguments[0].p;
                    options = arguments[0].options || arguments[0].o;
                } else {
                    propertiesMap = arguments[argumentIndex];
                    options = arguments[argumentIndex + 1];
                }


                var elementsLength = elements.length,
                    elementsIndex = 0;


                if (!/^(stop|finish|finishAll)$/i.test(propertiesMap) && !that.isPlainObject(options)) {
                    var startingArgumentPosition = argumentIndex + 1;

                    options = {};

                    for (var i = startingArgumentPosition; i < arguments.length; i++) {
                        if (!Type.isArray(arguments[i]) && (/^(fast|normal|slow)$/i.test(arguments[i]) || /^\d/.test(arguments[i]))) {
                            options.duration = arguments[i];
                        } else if (Type.isString(arguments[i]) || Type.isArray(arguments[i])) {
                            options.easing = arguments[i];
                        } else if (Type.isFunction(arguments[i])) {
                            options.complete = arguments[i];
                        }
                    }
                }

                var action;

                switch (propertiesMap) {
                    case "finish":
                    case "finishAll":
                    case "stop":
                   
                        that.each(elements, function (i, element) {
                            if (Data(element) && Data(element).delayTimer) {
                                clearTimeout(Data(element).delayTimer.setTimeout);

                                if (Data(element).delayTimer.next) {
                                    Data(element).delayTimer.next();
                                }

                                delete Data(element).delayTimer;
                            }

                            if (propertiesMap === "finishAll" && (options === true || Type.isString(options))) {
                                that.each(that.queue(element, Type.isString(options) ? options : ""), function (_, item) {
                                    if (Type.isFunction(item)) {
                                        item();
                                    }
                                });

                                that.queue(element, Type.isString(options) ? options : "", []);
                            }
                        });

                        var callsToStop = [];

                        that.each(jqxAnimations.State.calls, function (i, activeCall) {
                            if (activeCall) {
                                that.each(activeCall[1], function (k, activeElement) {
                                    var queueName = (options === undefined) ? "" : options;

                                    if (queueName !== true && (activeCall[2].queue !== queueName) && !(options === undefined && activeCall[2].queue === false)) {
                                        return true;
                                    }

                                    that.each(elements, function (l, element) {
                                        if (element === activeElement) {
                                            if (options === true || Type.isString(options)) {
                                                that.each(that.queue(element, Type.isString(options) ? options : ""), function (_, item) {
                                                    if (Type.isFunction(item)) {
                                                        item(null, true);
                                                    }
                                                });

                                                that.queue(element, Type.isString(options) ? options : "", []);
                                            }

                                            if (propertiesMap === "stop") {
                                                if (Data(element) && Data(element).tweensContainer && queueName !== false) {
                                                    that.each(Data(element).tweensContainer, function (m, activeTween) {
                                                        activeTween.endValue = activeTween.currentValue;
                                                    });
                                                }

                                                callsToStop.push(i);
                                            } else if (propertiesMap === "finish" || propertiesMap === "finishAll") {
                                                activeCall[2].duration = 1;
                                            }
                                        }
                                    });
                                });
                            }
                        });

                        if (propertiesMap === "stop") {
                            that.each(callsToStop, function (i, j) {
                                completeCall(j, true);
                            });
                        }

                        return getChain();

                    default:
                        if (that.isPlainObject(propertiesMap) && !Type.isEmptyObject(propertiesMap)) {
                            action = "start";

                        } else if (Type.isString(propertiesMap) && jqxAnimations.Redirects[propertiesMap]) {
                            var opts = that.extend({}, options),
                                durationOriginal = opts.duration,
                                delayOriginal = opts.delay || 0;

                            if (opts.backwards === true) {
                                elements = that.extend(true, [], elements).reverse();
                            }

                            that.each(elements, function (elementIndex, element) {
                                if (parseFloat(opts.stagger)) {
                                    opts.delay = delayOriginal + (parseFloat(opts.stagger) * elementIndex);
                                } else if (Type.isFunction(opts.stagger)) {
                                    opts.delay = delayOriginal + opts.stagger.call(element, elementIndex, elementsLength);
                                }

                                if (opts.drag) {
                                    opts.duration = parseFloat(durationOriginal) || (/^(callout|transition)/.test(propertiesMap) ? 1000 : DURATION_DEFAULT);

                                    opts.duration = Math.max(opts.duration * (opts.backwards ? 1 - elementIndex / elementsLength : (elementIndex + 1) / elementsLength), opts.duration * 0.75, 200);
                                }

                                jqxAnimations.Redirects[propertiesMap].call(element, element, opts || {}, elementIndex, elementsLength, elements, promiseData.promise ? promiseData : undefined);
                            });
                            return getChain();
                        } else {
                            var abortError = "jqxAnimations: First argument (" + propertiesMap + ") was not a property map, a known action, or a registered redirect. Aborting.";

                            console.log(abortError);
                   
                            return getChain();
                        }
                }


                var callUnitConversionData = {
                    lastParent: null,
                    lastPosition: null,
                    lastFontSize: null,
                    lastPercentToPxWidth: null,
                    lastPercentToPxHeight: null,
                    lastEmToPx: null,
                    remToPx: null,
                    vwToPx: null,
                    vhToPx: null
                };

                var call = [];


                function processElement() {

                    var element = this,
                        opts = that.extend({}, jqxAnimations.defaults, options),

                        tweensContainer = {},
                        elementUnitConversionData;

                    if (Data(element) === undefined) {
                        jqxAnimations.init(element);
                    }

                    opts.duration = parseFloat(opts.duration) || 1;
                    opts.easing = getEasing(opts.easing, opts.duration);

                    if (opts.begin && !Type.isFunction(opts.begin)) {
                        opts.begin = null;
                    }

                    if (opts.progress && !Type.isFunction(opts.progress)) {
                        opts.progress = null;
                    }

                    if (opts.complete && !Type.isFunction(opts.complete)) {
                        opts.complete = null;
                    }

                    if (opts.display !== undefined && opts.display !== null) {
                        opts.display = opts.display.toString().toLowerCase();

                        if (opts.display === "auto") {
                            opts.display = jqxAnimations.CSS.Values.getDisplayType(element);
                        }
                    }

                    if (opts.visibility !== undefined && opts.visibility !== null) {
                        opts.visibility = opts.visibility.toString().toLowerCase();
                    }

                    opts.mobileHA = (opts.mobileHA && jqxAnimations.State.isMobile && !jqxAnimations.State.isGingerbread);

                    function buildQueue(next) {

                        if (opts.begin && elementsIndex === 0) {
                            try {
                                opts.begin.call(elements, elements);
                            } catch (error) {
                                setTimeout(function () { throw error; }, 1);
                            }
                        }
                        if (action === "start") {

                             var lastTweensContainer;

                            if (Data(element).tweensContainer && Data(element).isAnimating === true) {
                                lastTweensContainer = Data(element).tweensContainer;
                            }

                            function parsePropertyValue(valueData, skipResolvingEasing) {
                                var endValue = undefined,
                                    easing = undefined,
                                    startValue = undefined;

                                if (Type.isArray(valueData)) {
                                    endValue = valueData[0];
                                    if ((!Type.isArray(valueData[1]) && /^[\d-]/.test(valueData[1])) || Type.isFunction(valueData[1]) || CSS.RegEx.isHex.test(valueData[1])) {
                                        startValue = valueData[1];
                                    } else if ((Type.isString(valueData[1]) && !CSS.RegEx.isHex.test(valueData[1])) || Type.isArray(valueData[1])) {
                                        easing = skipResolvingEasing ? valueData[1] : getEasing(valueData[1], opts.duration);

                                        if (valueData[2] !== undefined) {
                                            startValue = valueData[2];
                                        }
                                    }
                                } else {
                                    endValue = valueData;
                                }

                                if (!skipResolvingEasing) {
                                    easing = easing || opts.easing;
                                }

                                if (Type.isFunction(endValue)) {
                                    endValue = endValue.call(element, elementsIndex, elementsLength);
                                }

                                if (Type.isFunction(startValue)) {
                                    startValue = startValue.call(element, elementsIndex, elementsLength);
                                }

                                return [endValue || 0, easing, startValue];
                            }

                            for (var property in propertiesMap) {

                                var valueData = parsePropertyValue(propertiesMap[property]),
                                    endValue = valueData[0],
                                    easing = valueData[1],
                                    startValue = valueData[2];

                                property = jqxHelper.camelCase(property);

                                var rootProperty = CSS.Hooks.getRoot(property),
                                    rootPropertyValue = false;

                                if (!Data(element).isSVG && rootProperty !== "tween" && CSS.Names.prefixCheck(rootProperty)[1] === false && CSS.Normalizations.registered[rootProperty] === undefined) {
                                    if (jqxAnimations.debug) console.log("Skipping [" + rootProperty + "] due to a lack of browser support.");

                                    continue;
                                }

                                if (((opts.display !== undefined && opts.display !== null && opts.display !== "none") || (opts.visibility !== undefined && opts.visibility !== "hidden")) && /opacity|filter/.test(property) && !startValue && endValue !== 0) {
                                    startValue = 0;
                                }

                                if (opts._cacheValues && lastTweensContainer && lastTweensContainer[property]) {
                                    if (startValue === undefined) {
                                        startValue = lastTweensContainer[property].endValue + lastTweensContainer[property].unitType;
                                    }

                                    rootPropertyValue = Data(element).rootPropertyValueCache[rootProperty];
                                } else {
                                    if (startValue === undefined) {
                                        startValue = CSS.getPropertyValue(element, property); /* GET */
                                    }
                                }

                            
                                var separatedValue,
                                    endValueUnitType,
                                    startValueUnitType,
                                    operator = false;

                                function separateValue(property, value) {
                                    var unitType,
                                        numericValue;

                                    numericValue = (value || "0")
                                        .toString()
                                        .toLowerCase()
                                        /* Match the unit type at the end of the value. */
                                        .replace(/[%A-z]+$/, function (match) {
                                            unitType = match;
                                            return "";
                                        });

                                    if (!unitType) {
                                        unitType = CSS.Values.getUnitType(property);
                                    }

                                    return [numericValue, unitType];
                                }

                                separatedValue = separateValue(property, startValue);
                                startValue = separatedValue[0];
                                startValueUnitType = separatedValue[1];

                                separatedValue = separateValue(property, endValue);
                                endValue = separatedValue[0].replace(/^([+-\/*])=/, function (match, subMatch) {
                                    operator = subMatch;

                                    return "";
                                });
                                endValueUnitType = separatedValue[1];

                                startValue = parseFloat(startValue) || 0;
                                endValue = parseFloat(endValue) || 0;
                        
                                if (/[\/*]/.test(operator)) {
                                    endValueUnitType = startValueUnitType;
                                }

                                switch (operator) {
                                    case "+":
                                        endValue = startValue + endValue;
                                        break;

                                    case "-":
                                        endValue = startValue - endValue;
                                        break;

                                    case "*":
                                        endValue = startValue * endValue;
                                        break;

                                    case "/":
                                        endValue = startValue / endValue;
                                        break;
                                }

                                tweensContainer[property] = {
                                    rootPropertyValue: rootPropertyValue,
                                    startValue: startValue,
                                    currentValue: startValue,
                                    endValue: endValue,
                                    unitType: endValueUnitType,
                                    easing: easing
                                };

                                if (jqxAnimations.debug) console.log("tweensContainer (" + property + "): " + JSON.stringify(tweensContainer[property]), element);
                            }

                            /* Along with its property data, store a reference to the element itself onto tweensContainer. */
                            tweensContainer.element = element;
                        }

                        if (tweensContainer.element) {
                            jqxHelper(element).addClass("jqxAnimations-animating");
                            call.push(tweensContainer);

                            if (opts.queue === "") {
                                Data(element).tweensContainer = tweensContainer;
                                Data(element).opts = opts;
                            }

                            Data(element).isAnimating = true;

                            if (elementsIndex === elementsLength - 1) {
                                jqxAnimations.State.calls.push([call, elements, opts, null]);

                                if (jqxAnimations.State.isTicking === false) {
                                    jqxAnimations.State.isTicking = true;

                                    tick();
                                }
                            } else {
                                elementsIndex++;
                            }
                        }
                    }

                    that.queue(element, opts.queue, function (next, clearQueue) {
                        if (clearQueue === true) {
                            return true;
                        }

                        jqxAnimations.jqxAnimationsQueueEntryFlag = true;

                        buildQueue(next);
                    });

                    if ((opts.queue === "" || opts.queue === "fx") && that.queue(element)[0] !== "inprogress") {
                        that.dequeue(element);
                    }
                }

           
                that.each(elements, function (i, element) {
                    if (Type.isNode(element)) {
                        processElement.call(element);
                    }
                });


                var opts = that.extend({}, jqxAnimations.defaults, options);

                return getChain();
            };

            jqxAnimations = that.extend(animate, jqxAnimations);
            jqxAnimations.animate = animate;

            var ticker = window.requestAnimationFrame || rAFShim;

            if (!jqxAnimations.State.isMobile && document.hidden !== undefined) {
                document.addEventListener("visibilitychange", function () {
                    if (document.hidden) {
                        ticker = function (callback) {
                            return setTimeout(function () { callback(true) }, 16);
                        };

                        tick();
                    } else {
                        ticker = window.requestAnimationFrame || rAFShim;
                    }
                });
            }

            function tick(timestamp) {
                if (timestamp) {
                    var timeCurrent = (new Date).getTime();
                    var callsLength = jqxAnimations.State.calls.length;

                    for (var i = 0; i < callsLength; i++) {
                        if (!jqxAnimations.State.calls[i]) {
                            continue;
                        }

                        var callContainer = jqxAnimations.State.calls[i],
                            call = callContainer[0],
                            opts = callContainer[2],
                            timeStart = callContainer[3],
                            firstTick = !!timeStart,
                            tweenDummyValue = null;

                        if (!timeStart) {
                            timeStart = jqxAnimations.State.calls[i][3] = timeCurrent - 16;
                        }

                        var percentComplete = Math.min((timeCurrent - timeStart) / opts.duration, 1);

                        for (var j = 0, callLength = call.length; j < callLength; j++) {
                            var tweensContainer = call[j],
                                element = tweensContainer.element;

                            if (!Data(element)) {
                                continue;
                            }

                            var transformPropertyExists = false;

                            if (opts.display !== undefined && opts.display !== null && opts.display !== "none") {
                                if (opts.display === "flex") {
                                    var flexValues = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex"];

                                    that.each(flexValues, function (i, flexValue) {
                                        CSS.setPropertyValue(element, "display", flexValue);
                                    });
                                }

                                CSS.setPropertyValue(element, "display", opts.display);
                            }

                            if (opts.visibility !== undefined && opts.visibility !== "hidden") {
                                CSS.setPropertyValue(element, "visibility", opts.visibility);
                            }

                            for (var property in tweensContainer) {
                                if (property !== "element") {
                                    var tween = tweensContainer[property],
                                        currentValue,
                                        easing = Type.isString(tween.easing) ? jqxAnimations.Easings[tween.easing] : tween.easing;

                                    if (percentComplete === 1) {
                                        currentValue = tween.endValue;
                                    } else {
                                        var tweenDelta = tween.endValue - tween.startValue;
                                        currentValue = tween.startValue + (tweenDelta * easing(percentComplete, opts, tweenDelta));

                                        if (!firstTick && (currentValue === tween.currentValue)) {
                                            continue;
                                        }
                                    }

                                    tween.currentValue = currentValue;

                                    if (property === "tween") {
                                        tweenDummyValue = currentValue;
                                    } else {
                                        var adjustedSetData = CSS.setPropertyValue(element, /* SET */
                                                                                   property,
                                                                                   tween.currentValue + (parseFloat(currentValue) === 0 ? "" : tween.unitType),
                                                                                   tween.rootPropertyValue,
                                                                                   tween.scrollData);
                                    }
                                }
                            }
                        }

                        if (opts.display !== undefined && opts.display !== "none") {
                            jqxAnimations.State.calls[i][2].display = false;
                        }
                        if (opts.visibility !== undefined && opts.visibility !== "hidden") {
                            jqxAnimations.State.calls[i][2].visibility = false;
                        }

                        if (opts.progress) {
                            opts.progress.call(callContainer[1],
                                               callContainer[1],
                                               percentComplete,
                                               Math.max(0, (timeStart + opts.duration) - timeCurrent),
                                               timeStart,
                                               tweenDummyValue);
                        }

                        if (percentComplete === 1) {
                            completeCall(i);
                        }
                    }
                }

                if (jqxAnimations.State.isTicking) {
                    ticker(tick);
                }
            }

            function completeCall(callIndex, isStopped) {
                if (!jqxAnimations.State.calls[callIndex]) {
                    return false;
                }

                /* Pull the metadata from the call. */
                var call = jqxAnimations.State.calls[callIndex][0],
                    elements = jqxAnimations.State.calls[callIndex][1],
                    opts = jqxAnimations.State.calls[callIndex][2],
                    resolver = jqxAnimations.State.calls[callIndex][4];

                var remainingCallsExist = false;

                for (var i = 0, callLength = call.length; i < callLength; i++) {
                    var element = call[i].element;

                    if (!isStopped && !opts.loop) {
                        if (opts.display === "none") {
                            CSS.setPropertyValue(element, "display", opts.display);
                        }

                        if (opts.visibility === "hidden") {
                            CSS.setPropertyValue(element, "visibility", opts.visibility);
                        }
                    }

                    if (opts.loop !== true && (that.queue(element)[1] === undefined || !/\.jqxAnimationsQueueEntryFlag/i.test(that.queue(element)[1]))) {
                        if (Data(element)) {
                            Data(element).isAnimating = false;
                            /* Clear the element's rootPropertyValueCache, which will become stale. */
                            Data(element).rootPropertyValueCache = {};
                            jqxHelper(element).removeClass("jqxAnimations-animating");
                        }
                    }

                    if (!isStopped && opts.complete && (i === callLength - 1)) {
                        try {
                            opts.complete.call(elements, elements);
                        } catch (error) {
                            setTimeout(function () { throw error; }, 1);
                        }
                    }

                    if (resolver && opts.loop !== true) {
                        resolver(elements);
                    }

                    if (opts.queue !== false) {
                        that.dequeue(element, opts.queue);
                    }
                }

                jqxAnimations.State.calls[callIndex] = false;

                for (var j = 0, callsLength = jqxAnimations.State.calls.length; j < callsLength; j++) {
                    if (jqxAnimations.State.calls[j] !== false) {
                        remainingCallsExist = true;

                        break;
                    }
                }

                if (remainingCallsExist === false) {
                    jqxAnimations.State.isTicking = false;

                    /* Clear the calls array so that its length is reset. */
                    delete jqxAnimations.State.calls;
                    jqxAnimations.State.calls = [];
                }
            }

            that.animate = function () {
                var args = Array.prototype.slice.call(arguments);
                
               args.splice(0, 0, that.element);

               return jqxAnimations.apply(that, args);
            }
            /* slideUp, slideDown */
            for (var i = 0; i < 2; i++) {
                var direction = "Down";
                if (i === 1) direction = "Up";
                var createSlide = function (direction) {
                    that["slide" + direction] = function (options, elementsIndex, elementsSize, elements, promiseData) {
                        if (options === "fast") {
                            options = { duration: "200" };
                        }
                        if (options === "slow") {
                            options = { duration: "600" };
                        }

                        var opts = that.extend({}, options),
                            begin = opts.begin,
                            complete = opts.complete,
                            computedValues = { height: "", marginTop: "", marginBottom: "", paddingTop: "", paddingBottom: "" },
                            inlineValues = {};

                        if (opts.display === undefined) {
                            opts.display = (direction === "Down" ? (jqxAnimations.CSS.Values.getDisplayType(element) === "inline" ? "inline-block" : "block") : "none");
                        }

                        opts.begin = function () {
                            begin && begin.call(elements, elements);

                            for (var property in computedValues) {
                                inlineValues[property] = element.style[property];

                                var propertyValue = jqxAnimations.CSS.getPropertyValue(element, property);
                                computedValues[property] = (direction === "Down") ? [propertyValue, 0] : [0, propertyValue];
                            }

                            inlineValues.overflow = element.style.overflow;
                            element.style.overflow = "hidden";
                        }

                        opts.complete = function () {
                            for (var property in inlineValues) {
                                element.style[property] = inlineValues[property];
                            }

                            complete && complete.call(elements, elements);
                            promiseData && promiseData.resolver(elements);
                        };

                        jqxAnimations(element, computedValues, opts);
                    };
                }
                createSlide(direction);
            };

            /* fadeIn, fadeOut */
            for (var i = 0; i < 2; i++) {
                var direction = "In";
                if (i === 1) {
                    direction = "Out";
                }
                var createFade = function (direction) {
                    that["fade" + direction] = function (options, elementsIndex, elementsSize, elements, promiseData) {
                        if (options === "fast") {
                            options = { duration: "200" };
                        }
                        if (options === "slow") {
                            options = { duration: "600" };
                        }

                        var opts = that.extend({}, options),
                            begin = opts.begin,
                            computedValues = { opacity: "" },
                            propertiesMap = { opacity: (direction === "In") ? 1 : 0 },
                            inlineValues = {},
                            originalComplete = opts.complete;

                        if (elementsIndex !== elementsSize - 1) {
                            opts.complete = opts.begin = null;
                            opts.begin = function () {
                                begin && begin.call(elements, elements);

                                for (var property in computedValues) {
                                    inlineValues[property] = element.style[property];

                                    var propertyValue = jqxAnimations.CSS.getPropertyValue(element, property);
                                    computedValues[property] = (direction === "In") ? [propertyValue, 1] : [0, propertyValue];
                                }

                            }

                            opts.complete = function () {
                                for (var property in inlineValues) {
                                    element.style[property] = inlineValues[property];
                                }

                                if (originalComplete) {
                                    originalComplete.call(elements, elements);
                                }
                                promiseData && promiseData.resolver(elements);
                            };
                        } else {
                            opts.complete = function () {
                                if (originalComplete) {
                                    originalComplete.call(elements, elements);
                                }

                                promiseData && promiseData.resolver(elements);
                            }
                        }

                        if (opts.display === undefined) {
                            opts.display = (direction === "In" ? "auto" : "none");
                        }

                        jqxAnimations(that.element, propertiesMap, opts);
                    };
                }
                createFade(direction);
            };
        }
    }
    );
    jqxHelper.fn = jqxHelper.prototype;
    jqxHelper.extend(jqxHelper.fn, jqxHelper);

    jqxHelper.prototype.init.prototype = jqxHelper;
    window.jqxHelper = jqxHelper;

    var eventHelper = {};
    jqxHelper.extend(eventHelper,
        {
            createEvent: function (defaultEvent, target) {
                if (defaultEvent.originalEvent)
                    return defaultEvent;

                var event = jqxHelper.extend({}, defaultEvent);
                event.originalEvent = defaultEvent;
                if (!event.target) {
                    event.target = event.srcElement || document;
                    if (target) {
                        event.target = targett;
                    }
                }

                if (event.target.nodeType === 3) {
                    event.target = event.target.parentNode;
                }
                event._isPropagationStopped = false;
                event._isDefaultPrevented = false;
                if (event.stopPropagation) {
                    event.originalStopPropagation = event.stopPropagation;

                    event.stopPropagation = function () {
                        this._isPropagationStopped = true;
                        event.originalEvent.stopPropagation();
                        // otherwise set the cancelBubble property of the original event to true (IE)
                        event.cancelBubble = true;
                    }
                }
                if (event.preventDefault) {
                    event.preventDefault = function () {
                        this._isDefaultPrevented = true;
                        return event.originalEvent.preventDefault();
                    }
                }
                event.isDefaultPrevented = function () {
                    return event._isDefaultPrevented;
                }
                event.isPropagationStopped = function () {
                    return event._isPropagationStopped;
                }

                event.metaKey = !!event.metaKey;
                return event;
            },
            add: function (elem, types, handler, data) {
                var that = jqxHelper;
                var elemData, eventHandle, events,
                    t, tns, type, namespaces, handleObj,
                    handleObjIn, handlers, special;

                if (elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler) {
                    return;
                }

                elemData = jqxHelper(elem).data(elem[0]);
                if (!elemData) {
                    jqxHelper(elem).data(elem, "events", {});
                    elemData = jqxHelper(elem).data(elem);
                }

                events = elemData.events;
                if (!events) {
                    elemData.events = events = {};
                }
                eventHandle = elemData.handle;
                if (!eventHandle) {
                    elemData.handle = eventHandle = function (e) {
                        return eventHelper.dispatch.apply(eventHandle.elem, new Array(e, that));
                    };
                    eventHandle.elem = elem;
                }
                var rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/;
                types = that.trim(types).split(" ");
                for (t = 0; t < types.length; t++) {
                    tns = rtypenamespace.exec(types[t]) || [];
                    type = tns[1];
                    namespaces = (tns[2] || "").split(".").sort();

                    // handleObj is passed to all event handlers
                    handleObj = that.extend({
                        type: type,
                        origType: tns[1],
                        data: data,
                        handler: handler,
                        guid: handler.guid,
                        namespace: namespaces.join(".")
                    }, handleObjIn);

                    // Init the event handler queue if we're the first
                    handlers = events[type];
                    if (!handlers) {
                        handlers = events[type] = [];
                        handlers.delegateCount = 0;

                        // Bind the global event handler to the element
                        if (elem.addEventListener) {
                            elem.addEventListener(type, eventHandle, false);

                        } else if (elem.attachEvent) {
                            elem.attachEvent("on" + type, eventHandle);
                        }
                    }

                    handlers.push(handleObj);
                }

                elem = null;
            },

            global: {},

            // Detach an event or set of events from an element
            remove: function (elem, types, handler, selector, mappedTypes) {
                var that = jqxHelper;

                var t, tns, type, origType, namespaces, origCount,
                    j, events, special, eventType, handleObj;
                var elemData = that.data(elem);
                var rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/;
                if (!elemData || !(events = elemData.events)) {
                    return;
                }

                // Once for each type.namespace in types; type may be omitted
                types = that.trim(types).split(" ");
                for (t = 0; t < types.length; t++) {
                    tns = rtypenamespace.exec(types[t]) || [];
                    type = origType = tns[1];
                    namespaces = tns[2];

                    // Unbind all events (on this namespace, if provided) for the element
                    if (!type) {
                        for (type in events) {
                            this.remove(elem, type + types[t], handler, selector, true);
                        }
                        continue;
                    }

                    eventType = events[type] || [];
                    origCount = eventType.length;
                    namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

                    // Remove matching events
                    for (j = 0; j < eventType.length; j++) {
                        handleObj = eventType[j];

                        if ((origType === handleObj.origType) &&
                             (!handler || handler.guid === handleObj.guid) &&
                             (!namespaces || namespaces.test(handleObj.namespace)))
                        {
                            eventType.splice(j--, 1);

                            if (handleObj.selector) {
                                eventType.delegateCount--;
                            }
                       }
                    }

                    // Remove generic event handler if we removed something and no more handlers exist
                    // (avoids potential for endless recursion during removal of special event handlers)
                    if (eventType.length === 0 && origCount !== eventType.length) {
                        this.removeEvent(elem, type, elemData.handle);
                        delete events[type];
                    }
                }
            },

            trigger: function (event, data, elem, onlyHandlers) {
                var that = jqxHelper;
                // Don't do events on text and comment nodes
                if (elem && (elem.nodeType === 3 || elem.nodeType === 8)) {
                    return;
                }

                // Event object or event type
                var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
                    type = event.type || event,
                    namespaces = [];

                if (type.indexOf(".") >= 0) {
                    // Namespaced trigger; create a regexp to match event type in handle()
                    namespaces = type.split(".");
                    type = namespaces.shift();
                    namespaces.sort();
                }

                if (typeof event === "string") {
                    event = document.createEvent('Event');

                    // Define that the event name is 'build'.
                    event.initEvent(type, true, true);
                }
                event = eventHelper.createEvent(event);


                data = data != null ? that.makeArray(data) : [];
                data.unshift(event);

                event.type = type;
                event.isTrigger = true;
                event.namespace = namespaces.join(".");
                event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
                ontype = type.indexOf(":") < 0 ? "on" + type : "";


                // Clean up the event in case it is being reused
                event.result = undefined;
                if (!event.target) {
                    event.target = elem;
                }
                // Determine event propagation path in advance, per W3C events spec (#9951)
                // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
                eventPath = [[elem, type]];
                if (!onlyHandlers && !that.isWindow(elem)) {

                    bubbleType = type;
                    cur = elem.parentNode;
                    for (old = elem; cur; cur = cur.parentNode) {
                        eventPath.push([cur, bubbleType]);
                        old = cur;
                    }

                    // Only add window if we got to document (e.g., not plain obj or detached DOM)
                    if (old === (elem.ownerDocument || document)) {
                        eventPath.push([old.defaultView || old.parentWindow || window, bubbleType]);
                    }
                }

                // Fire handlers on the event path
                for (i = 0; i < eventPath.length && !event.isPropagationStopped() ; i++) {

                    cur = eventPath[i][0];
                    event.type = eventPath[i][1];

                    handle = (that.data(cur, "events") || {})[event.type] && that.data(cur, "handle");
                    if (handle) {
                        handle.apply(cur, data);
                    }
                    handle = ontype && cur[ontype];
                    if (handle && jQuery.acceptData(cur) && handle.apply && handle.apply(cur, data) === false) {
                        event.preventDefault();
                    }
                }
                event.type = type;

                // If nobody prevented the default action, do it now
                if (!onlyHandlers && !event.isDefaultPrevented()) {
                    if (ontype && elem[type] || event.target.offsetWidth !== 0) {

                        // Don't re-trigger an onFOO event when we call its FOO() method
                        old = elem[ontype];

                        if (old) {
                            elem[ontype] = null;
                        }

                        if (elem[type]) {
                            elem[type]();
                        }

                        if (old) {
                            elem[ontype] = old;
                        }

                    }
                }

                return event.result;
            },

            dispatch: function (event, owner) {
                var that = owner;
                var element = this;
                event = eventHelper.createEvent(event);

                var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related,
                    handlers = ((that.data(element, "events") || {})[event.type] || []),
                    delegateCount = handlers.delegateCount,
                    args = Array.prototype.slice.call(arguments),
                    run_all = !event.namespace,
                    handlerQueue = [];


                handlerQueue.push({ elem: this, matches: handlers.slice(delegateCount) });

                // Run delegates first; they may want to stop propagation beneath us
                for (i = 0; i < handlerQueue.length; i++) {
                    matched = handlerQueue[i];
                    event.currentTarget = matched.elem;

                    for (j = 0; j < matched.matches.length; j++) {
                        handleObj = matched.matches[j];

                        if (event.isPropagationStopped()) {
                            continue;
                        }

                        // Triggered event must either 1) be non-exclusive and have no namespace, or
                        // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
                        if (run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test(handleObj.namespace)) {

                            event.data = handleObj.data;
                            event.handleObj = handleObj;

                            ret = handleObj.handler.apply(matched.elem, args);

                            if (ret !== undefined) {
                                event.result = ret;
                                if (ret === false) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                }
                            }
                        }
                    }
                }

                return event.result;
            },

            removeEvent: document.removeEventListener ?
               function (elem, type, handle) {
                   if (elem.removeEventListener) {
                       elem.removeEventListener(type, handle, false);
                   }
               } :
               function (elem, type, handle) {
                   var name = "on" + type;

                   if (elem.detachEvent) {
                       if (typeof elem[name] === "undefined") {
                           elem[name] = null;
                       }

                       elem.detachEvent(name, handle);
                   }
               }
        });

    (function (funcName, baseObj) {
        funcName = funcName;
        baseObj = baseObj || window;
        var readyList = [];
        var readyFired = false;
        var readyEventHandlersInstalled = false;

        // call this when the document is ready
        // this function protects itself against being called more than once
        function ready() {
            if (!readyFired) {
                // this must be set to true before we start calling callbacks
                readyFired = true;
                for (var i = 0; i < readyList.length; i++) {
                    // if a callback here happens to add new ready handlers,
                    // the docReady() function will see that it already fired
                    // and will schedule the callback to run right after
                    // this event loop finishes so all handlers will still execute
                    // in order and no new ones will be added to the readyList
                    // while we are processing the list
                    readyList[i].fn.call(window, readyList[i].ctx);
                }
                // allow any closures held by these functions to free
                readyList = [];
            }
        }

        function readyStateChange() {
            if (document.readyState === "complete") {
                ready();
            }
        }

        // This is the one public interface
        // docReady(fn, context);
        // the context argument is optional - if present, it will be passed
        // as an argument to the callback
        baseObj[funcName] = function (callback, context) {
            // if ready has already fired, then just schedule the callback
            // to fire asynchronously, but right away
            if (readyFired) {
                setTimeout(function () { callback(context); }, 1);
                return;
            } else {
                // add the function and context to the list
                readyList.push({ fn: callback, ctx: context });
            }
            // if document already ready to go, schedule the ready function to run
            if (document.readyState === "complete") {
                setTimeout(ready, 1);
            } else if (!readyEventHandlersInstalled) {
                // otherwise if we don't have event handlers installed, install them
                if (document.addEventListener) {
                    // first choice is DOMContentLoaded event
                    document.addEventListener("DOMContentLoaded", ready, false);
                    // backup is window load event
                    window.addEventListener("load", ready, false);
                } else {
                    // must be IE
                    document.attachEvent("onreadystatechange", readyStateChange);
                    window.attachEvent("onload", ready);
                }
                readyEventHandlersInstalled = true;
            }
        }
    })("initializeWidgets", window);
    jqxHelper.prototype.ready = window.initializeWidgets;

    if (window.jQuery) {
        return;
    }

    if (!window.$) {
        window.$ = window.minQuery = window.jqxHelper;
    }
})(window);
// End of jqxHelper

var jqxBaseFramework = window.minQuery || window.jQuery;

(function ($) {

    $.jqx = $.jqx || {}

    jqwidgets = {
        createInstance: function (selector, widgetName, params) {
            if (widgetName == 'jqxDataAdapter') {
                var source = params[0];
                var settings = params[1] || {};
                return new $.jqx.dataAdapter(source, settings);
            }

            $(selector)[widgetName](params || {});
            return $(selector)[widgetName]('getInstance');
        }
    };
    $.jqx.define = function (namespace, classname, baseclass) {
        namespace[classname] = function () {
            if (this.baseType) {
                this.base = new namespace[this.baseType]();
                this.base.defineInstance();
            }
            this.defineInstance();
            this.metaInfo();
        }

        namespace[classname].prototype.defineInstance = function () { };
        namespace[classname].prototype.metaInfo = function () { };
        namespace[classname].prototype.base = null;
        namespace[classname].prototype.baseType = undefined;

        if (baseclass && namespace[baseclass])
            namespace[classname].prototype.baseType = baseclass;
    }

    // method call
    $.jqx.invoke = function (object, args) {
        if (args.length == 0)
            return;

        var method = typeof (args) == Array || args.length > 0 ? args[0] : args;
        var methodArg = typeof (args) == Array || args.length > 1 ? Array.prototype.slice.call(args, 1) : $({}).toArray();

        while (object[method] == undefined && object.base != null) {
            if (object[method] != undefined && $.isFunction(object[method]))
                return object[method].apply(object, methodArg);

            if (typeof method == 'string') {
                var methodLowerCase = method.toLowerCase();
                if (object[methodLowerCase] != undefined && $.isFunction(object[methodLowerCase])) {
                    return object[methodLowerCase].apply(object, methodArg);
                }
            }
            object = object.base;
        }

        if (object[method] != undefined && $.isFunction(object[method]))
            return object[method].apply(object, methodArg);

        if (typeof method == 'string') {
            var methodLowerCase = method.toLowerCase();
            if (object[methodLowerCase] != undefined && $.isFunction(object[methodLowerCase])) {
                return object[methodLowerCase].apply(object, methodArg);
            }
        }

        return;
    }
    $.jqx.hasProperty = function (obj, property) {
        if (typeof (property) == 'object') {
            for (var prop in property) {
                var o = obj;
                while (o) {
                    if (o.hasOwnProperty(prop))
                        return true;
                    if (o.hasOwnProperty(prop.toLowerCase()))
                        return true;
                    o = o.base;
                }
                return false;
            }
        }
        else {
            while (obj) {
                if (obj.hasOwnProperty(property))
                    return true;
                if (obj.hasOwnProperty(property.toLowerCase()))
                    return true;
                obj = obj.base;
            }
        }

        return false;
    }

    $.jqx.hasFunction = function (object, args) {
        if (args.length == 0)
            return false;

        if (object == undefined)
            return false;

        var method = typeof (args) == Array || args.length > 0 ? args[0] : args;
        var methodArg = typeof (args) == Array || args.length > 1 ? Array.prototype.slice.call(args, 1) : {};

        while (object[method] == undefined && object.base != null) {
            if (object[method] && $.isFunction(object[method]))
                return true;

            if (typeof method == 'string') {
                var methodLowerCase = method.toLowerCase();
                if (object[methodLowerCase] && $.isFunction(object[methodLowerCase]))
                    return true;
            }
            object = object.base;
        }

        if (object[method] && $.isFunction(object[method]))
            return true;

        if (typeof method == 'string') {
            var methodLowerCase = method.toLowerCase();
            if (object[methodLowerCase] && $.isFunction(object[methodLowerCase]))
                return true;
        }

        return false;
    }

    $.jqx.isPropertySetter = function (obj, args) {
        if (args.length == 1 && typeof (args[0]) == 'object')
            return true;

        if (args.length == 2 &&
            typeof (args[0]) == 'string' &&
            !$.jqx.hasFunction(obj, args)) {
            return true;
        }

        return false;
    }

    $.jqx.validatePropertySetter = function (obj, args, suppressException) {
        if (!$.jqx.propertySetterValidation)
            return true;

        if (args.length == 1 && typeof (args[0]) == 'object') {
            for (var i in args[0]) {
                var o = obj;
                while (!o.hasOwnProperty(i) && o.base)
                    o = o.base;

                if (!o || !o.hasOwnProperty(i)) {
                    if (!suppressException) {
                        var hasLowerCase = o.hasOwnProperty(i.toString().toLowerCase());
                        if (!hasLowerCase) {
                            throw 'Invalid property: ' + i;
                        }
                        else return true;
                    }
                    return false;
                }
            }

            return true;
        }

        if (args.length != 2) {
            if (!suppressException)
                throw 'Invalid property: ' + args.length >= 0 ? args[0] : '';

            return false;
        }

        while (!obj.hasOwnProperty(args[0]) && obj.base)
            obj = obj.base;

        if (!obj || !obj.hasOwnProperty(args[0])) {
            if (!suppressException)
                throw 'Invalid property: ' + args[0];

            return false;
        }

        return true;
    }

    if (!Object.keys)
    {
        Object.keys = (function ()
        {
            'use strict';
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
                dontEnums = [
                  'toString',
                  'toLocaleString',
                  'valueOf',
                  'hasOwnProperty',
                  'isPrototypeOf',
                  'propertyIsEnumerable',
                  'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function (obj)
            {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null))
                {
                    throw new TypeError('Object.keys called on non-object');
                }

                var result = [], prop, i;

                for (prop in obj)
                {
                    if (hasOwnProperty.call(obj, prop))
                    {
                        result.push(prop);
                    }
                }

                if (hasDontEnumBug)
                {
                    for (i = 0; i < dontEnumsLength; i++)
                    {
                        if (hasOwnProperty.call(obj, dontEnums[i]))
                        {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
    }

    $.jqx.set = function (object, args) {
        var newValuesLength = 0;
        if (args.length == 1 && typeof (args[0]) == 'object') {
            if (object.isInitialized && Object.keys && Object.keys(args[0]).length > 1) {
                var element = !object.base ? object.element : object.base.element;
                var initArgs = $.data(element, object.widgetName).initArgs;
                if (initArgs && JSON && JSON.stringify && args[0] && initArgs[0])
                {
                    try
                    {
                        if (JSON.stringify(args[0]) == JSON.stringify(initArgs[0]))
                        {
                            var toReturn = true;
                            $.each(args[0], function (key, value)
                            {
                                if (object[key] != value)
                                {
                                    toReturn = false;
                                    return false;
                                }
                            });
                            if (toReturn)
                            {
                                return;
                            }
                        }
                    }
                    catch(err)
                    {
                    }
                }
                object.batchUpdate = args[0];
                var oldValues = {};
                var newValues = {};
                $.each(args[0], function (key, value) {
                    var obj = object;
                    while (!obj.hasOwnProperty(key) && obj.base != null)
                        obj = obj.base;

                    if (obj.hasOwnProperty(key)) {
                        if (object[key] != value) {
                            oldValues[key] = object[key];
                            newValues[key] = value;
                            newValuesLength++;
                        }
                    }
                    else if (obj.hasOwnProperty(key.toLowerCase())) {
                        if (object[key.toLowerCase()] != value) {
                            oldValues[key.toLowerCase()] = object[key.toLowerCase()];
                            newValues[key.toLowerCase()] = value;
                            newValuesLength++;
                        }
                    }
                });
                if (newValuesLength < 2) {
                    object.batchUpdate = null;
                }
            }

            $.each(args[0], function (key, value) {
                var obj = object;
                while (!obj.hasOwnProperty(key) && obj.base != null)
                    obj = obj.base;

                if (obj.hasOwnProperty(key)) {
                    $.jqx.setvalueraiseevent(obj, key, value);
                }
                else if (obj.hasOwnProperty(key.toLowerCase())) {
                    $.jqx.setvalueraiseevent(obj, key.toLowerCase(), value);
                }
                else if ($.jqx.propertySetterValidation)
                    throw "jqxCore: invalid property '" + key + "'";
            });

            if (object.batchUpdate != null) {
                object.batchUpdate = null;
                if (object.propertiesChangedHandler && newValuesLength > 1) {
                    object.propertiesChangedHandler(object, oldValues, newValues);
                }
            }
        }
        else if (args.length == 2) {
            while (!object.hasOwnProperty(args[0]) && object.base)
                object = object.base;

            if (object.hasOwnProperty(args[0])) {
                $.jqx.setvalueraiseevent(object, args[0], args[1]);
            }
            else if (object.hasOwnProperty(args[0].toLowerCase())) {
                $.jqx.setvalueraiseevent(object, args[0].toLowerCase(), args[1]);
            }
            else if ($.jqx.propertySetterValidation)
                throw "jqxCore: invalid property '" + args[0] + "'";
        }
    }

    $.jqx.setvalueraiseevent = function (object, key, value) {
        var oldVal = object[key];

        object[key] = value;

        if (!object.isInitialized)
            return;

        if (object.propertyChangedHandler != undefined)
            object.propertyChangedHandler(object, key, oldVal, value);

        if (object.propertyChangeMap != undefined && object.propertyChangeMap[key] != undefined)
            object.propertyChangeMap[key](object, key, oldVal, value);
    };

    $.jqx.get = function (object, args) {
        if (args == undefined || args == null)
            return undefined;

        if (object.propertyMap) {
            var newVal = object.propertyMap(args);
            if (newVal != null)
                return newVal;
        }

        if (object.hasOwnProperty(args))
            return object[args];

        if (object.hasOwnProperty(args.toLowerCase()))
            return object[args.toLowerCase()];

        var arg = undefined;
        if (typeof (args) == Array) {
            if (args.length != 1)
                return undefined;
            arg = args[0];
        }
        else if (typeof (args) == 'string')
            arg = args;

        while (!object.hasOwnProperty(arg) && object.base)
            object = object.base;

        if (object)
            return object[arg];

        return undefined;
    }

    $.jqx.serialize = function (obj) {
        var txt = '';
        if ($.isArray(obj)) {
            txt = '['
            for (var i = 0; i < obj.length; i++) {
                if (i > 0)
                    txt += ', ';
                txt += $.jqx.serialize(obj[i]);
            }
            txt += ']';
        }
        else if (typeof (obj) == 'object') {
            txt = '{';
            var j = 0;
            for (var i in obj) {
                if (j++ > 0)
                    txt += ', ';
                txt += i + ': ' + $.jqx.serialize(obj[i]);
            }
            txt += '}';
        }
        else
            txt = obj.toString();

        return txt;
    }

    $.jqx.propertySetterValidation = true;

    $.jqx.jqxWidgetProxy = function (controlName, element, args) {
        var host = $(element);
        var vars = $.data(element, controlName);
        if (vars == undefined) {
            return undefined;
        }

        var obj = vars.instance;

        if ($.jqx.hasFunction(obj, args))
            return $.jqx.invoke(obj, args);

        if ($.jqx.isPropertySetter(obj, args)) {
            if ($.jqx.validatePropertySetter(obj, args)) {
                $.jqx.set(obj, args);
                return undefined;
            }
        } else {
            if (typeof (args) == 'object' && args.length == 0)
                return;
            else if (typeof (args) == 'object' && args.length == 1 && $.jqx.hasProperty(obj, args[0]))
                return $.jqx.get(obj, args[0]);
            else if (typeof (args) == 'string' && $.jqx.hasProperty(obj, args[0]))
                return $.jqx.get(obj, args);
        }

        throw "jqxCore: Invalid parameter '" + $.jqx.serialize(args) + "' does not exist.";
        return undefined;
    }

    $.jqx.applyWidget = function (element, controlName, args, instance) {
        var WinJS = false;
        try {
            WinJS = window.MSApp != undefined;
        }
        catch (e) {
        }

        var host = $(element);
        if (!instance) {
            instance = new $.jqx['_' + controlName]();
        }
        else {
            instance.host = host;
            instance.element = element;
        }
        if (element.id == "") {
            element.id = $.jqx.utilities.createId();
        }

        var vars = { host: host, element: element, instance: instance, initArgs: args };

        instance.widgetName = controlName;
        $.data(element, controlName, vars);
        $.data(element, 'jqxWidget', vars.instance);

        var inits = new Array();
        var instance = vars.instance;
        while (instance) {
            instance.isInitialized = false;
            inits.push(instance);
            instance = instance.base;
        }
        inits.reverse();
        inits[0].theme = $.jqx.theme || '';

        $.jqx.jqxWidgetProxy(controlName, element, args);

        for (var i in inits) {
            instance = inits[i];
            if (i == 0) {
                instance.host = host;
                instance.element = element;
                instance.WinJS = WinJS;
            }
            if (instance != undefined) {
                if (instance.definedInstance) {
                    instance.definedInstance();
                }
                if (instance.createInstance != null) {
                    if (WinJS) {
                        MSApp.execUnsafeLocalFunction(function () {
                            instance.createInstance(args);
                        });
                    }
                    else {
                        instance.createInstance(args);
                    }
                }
            }
        }

        for (var i in inits) {
            if (inits[i] != undefined) {
                inits[i].isInitialized = true;
            }
        }

        if (WinJS) {
            MSApp.execUnsafeLocalFunction(function () {
                vars.instance.refresh(true);
            });
        }
        else {
            vars.instance.refresh(true);
        }

    }

    $.jqx.jqxWidget = function (name, base, params) {
      
        var WinJS = false;
        try {
            jqxArgs = Array.prototype.slice.call(params, 0);
        }
        catch (e) {
            jqxArgs = '';
        }

        try {
            WinJS = window.MSApp != undefined;
        }
        catch (e) {
        }

        var controlName = name;

        var baseControl = '';
        if (base)
            baseControl = '_' + base;
        $.jqx.define($.jqx, '_' + controlName, baseControl);

        var widgets = new Array();
     
        if (!window[controlName]) {
            var serializeObject = function (data) {
                if (data == null) return "";
                var dataType = $.type(data);
                switch (dataType) {
                    case "string":
                    case "number":
                    case "date":
                    case "boolean":
                    case "bool":
                        if (data === null)
                            return "";
                        return data.toString()
                }

                var str = "";
                $.each(data, function (index, value) {
                    var val = value;
                    if (index > 0) str += ', ';
                    str += "[";
                    var m = 0;

                    if ($.type(val) == "object") {
                        for (var obj in val) {
                            if (m > 0) str += ', ';
                            str += '{' + obj + ":" + val[obj] + '}';
                            m++;
                        }
                    }
                    else {
                        if (m > 0) str += ', ';
                        str += '{' + index + ":" + val + '}';
                        m++;
                    }

                    str += "]";
                });
                return str;
            }
      
            jqwidgets[controlName] = window[controlName] = function (selector, params) {
                var args = [];
                if (!params) {
                    params = {};
                }
                args.push(params);

                var uid = selector;
                if ($.type(uid) === "object" && selector[0]) {
                    uid = selector[0].id;
                    if (uid === "") {
                        uid = selector[0].id = $.jqx.utilities.createId();
                    }
                } else if ($.type(selector) === "object" && selector && selector.nodeName) {
                    uid = selector.id;
                    if (uid === "") {
                        uid = selector.id = $.jqx.utilities.createId();
                    }
                }

                if (window.jqxWidgets && window.jqxWidgets[uid]) {
                    if (params) {
                        $.each(window.jqxWidgets[uid], function (index) {
                            var data = $(this.element).data();
                            if (data && data.jqxWidget) {
                                $(this.element)[controlName](params);
                            }
                        });
                    }
                    if (window.jqxWidgets[uid].length == 1) {
                        var data = $(window.jqxWidgets[uid][0].widgetInstance.element).data();
                        if (data && data.jqxWidget) {
                            return window.jqxWidgets[uid][0];
                        }
                    }

                    var data = $(window.jqxWidgets[uid][0].widgetInstance.element).data();
                    if (data && data.jqxWidget) {
                        return window.jqxWidgets[uid];
                    }
                }

                var elements = $(selector);
                if (elements.length === 0) {
                    elements = $("<div></div>");
                    if (controlName === "jqxInput" || controlName === "jqxPasswordInput" || controlName === "jqxMaskedInput") {
                        elements = $("<input/>");
                    }
                    if (controlName === "jqxTextArea") {
                        elements = $("<textarea></textarea>");
                    }
                    if (controlName === "jqxButton" || controlName === "jqxRepeatButton" || controlName === "jqxToggleButton") {
                        elements = $("<button/>");
                    }
                    if (controlName === "jqxSplitter") {
                        elements = $("<div><div>Panel 1</div><div>Panel 2</div></div>");
                    }
                    if (controlName === "jqxTabs") {
                        elements = $("<div><ul><li>Tab 1</li><li>Tab 2</li></ul><div>Content 1</div><div>Content 2</div></div>");
                    }
                    if (controlName === "jqxRibbon") {
                        elements = $("<div><ul><li>Tab 1</li><li>Tab 2</li></ul><div><div>Content 1</div><div>Content 2</div></div></div>");
                    }
                    if (controlName === "jqxDocking") {
                        elements = $("<div><div><div><div>Title 1</div><div>Content 1</div></div></div></div>");
                    }
                    if (controlName === "jqxWindow") {
                        elements = $("<div><div>Title 1</div><div>Content 1</div></div>");
                    }
                }
                var instances = [];


                $.each(elements, function (index) {
                    var element = elements[index];
                    $.jqx.applyWidget(element, controlName, args, undefined);
                    if (!widgets[controlName]) {
                        var instance = $.data(element, 'jqxWidget');
                        var properties = $.jqx["_" + controlName].prototype.defineInstance();
                        var metaInfo = {};

                        if ($.jqx["_" + controlName].prototype.metaInfo) {
                            metaInfo = $.jqx["_" + controlName].prototype.metaInfo();
                        }

                        if (controlName == "jqxDockingLayout") {
                            properties = $.extend(properties, $.jqx["_jqxLayout"].prototype.defineInstance());
                        }
                        if (controlName == "jqxToggleButton" || controlName == "jqxRepeatButton")
                        {
                            properties = $.extend(properties, $.jqx["_jqxButton"].prototype.defineInstance());
                        }
                        if (controlName == "jqxTreeGrid") {
                            properties = $.extend(properties, $.jqx["_jqxDataTable"].prototype.defineInstance());
                        }

                        var widgetConstructor = function (element) {
                            var instance = $.data(element, 'jqxWidget');
                            this.widgetInstance = instance;
                            var widget = $.extend(this, instance);
                          
                            widget.on = function (eventName, callback) {
                                widget.addHandler(widget.host, eventName, callback);
                            }
                            widget.off = function (eventName) {
                                widget.removeHandler(widget.host, eventName);
                            }
            
                            for (var obj in instance) {
                                if ($.type(instance[obj]) == "function") {
                                    widget[obj] = $.proxy(instance[obj], instance);
                                }
                            }
                            return widget;
                        }
                        widgets[controlName] = widgetConstructor;
                      
                        // widget properties
                        $.each(properties, function (property, currentValue) {
                            Object.defineProperty(widgetConstructor.prototype, property, {
                                get: function () {
                                    if (this.widgetInstance) {
                                        return this.widgetInstance[property];
                                    }
                                    return currentValue;
                                },
                                set: function (newValue) {
                                    if (this.widgetInstance && this.widgetInstance[property] != newValue) {
                                        var key1 = this.widgetInstance[property];
                                        var key2 = newValue;
                                        var dataType1 = $.type(key1);
                                        var dataType2 = $.type(key2);
                                        var differentTypes = false;
                                        if (dataType1 != dataType2 || property === "source") {
                                            differentTypes = true;
                                        }
                                        if (differentTypes || (serializeObject(key1) != serializeObject(key2))) {
                                            var settings = {};
                                            settings[property] = newValue;
                                            this.widgetInstance.host[controlName](settings);
                                            this.widgetInstance[property] = newValue;
                                            if (this.widgetInstance.propertyUpdated) {
                                                this.widgetInstance.propertyUpdated(property, key1, newValue);
                                            }
                                        }
                                    }
                                }
                            });
                        });
                    }
                    var instance = new widgets[controlName](element);
                 
                    instances.push(instance);
                    if (!window.jqxWidgets) {
                        window.jqxWidgets = new Array();
                    }
                    if (!window.jqxWidgets[uid]) {
                        window.jqxWidgets[uid] = new Array();
                    }
                    window.jqxWidgets[uid].push(instance);
                });

                if (instances.length === 1)
                    return instances[0];

                return instances;

            }     
        }

        $.fn[controlName] = function () {
            var args = Array.prototype.slice.call(arguments, 0);

            if (args.length == 0 || (args.length == 1 && typeof (args[0]) == 'object')) {
                if (this.length == 0) {
                    if (this.selector) {
                        throw new Error('Invalid Selector - ' + this.selector + '! Please, check whether the used ID or CSS Class name is correct.');
                    }
                    else {
                        throw new Error('Invalid Selector! Please, check whether the used ID or CSS Class name is correct.');
                    }
                }

                return this.each(function () {
                    var host = $(this);
                    var element = this; // element == this == host[0]
                    var vars = $.data(element, controlName);

                    if (vars == null) {
                        $.jqx.applyWidget(element, controlName, args, undefined);
                    }
                    else {
                        $.jqx.jqxWidgetProxy(controlName, this, args);
                    }
                }); // each
            }
            else {
                if (this.length == 0) {
                    if (this.selector) {
                        throw new Error('Invalid Selector - ' + this.selector + '! Please, check whether the used ID or CSS Class name is correct.');
                    }
                    else {
                        throw new Error('Invalid Selector! Please, check whether the used ID or CSS Class name is correct.');
                    }
                }

                var returnVal = null;

                var cnt = 0;
                this.each(function () {
                    var result = $.jqx.jqxWidgetProxy(controlName, this, args);

                    if (cnt == 0) {
                        returnVal = result;
                        cnt++;
                    }
                    else {
                        if (cnt == 1) {
                            var tmp = [];
                            tmp.push(returnVal);
                            returnVal = tmp;
                        }
                        returnVal.push(result);
                    }
                }); // each
            }

            return returnVal;
        }

        try {
            $.extend($.jqx['_' + controlName].prototype, Array.prototype.slice.call(params, 0)[0]);
        }
        catch (e) {
        }

        $.extend($.jqx['_' + controlName].prototype, {
            toThemeProperty: function (propertyName, override) {
                return $.jqx.toThemeProperty(this, propertyName, override);
            }
        });

        $.jqx['_' + controlName].prototype.refresh = function () {
            if (this.base)
                this.base.refresh(true);
        }
        $.jqx['_' + controlName].prototype.createInstance = function () {
        }

        $.jqx['_' + controlName].prototype.addEventHandler = function (event, fnHandler) {
            this.host.bind(event, fnHandler);
        }

        $.jqx['_' + controlName].prototype.removeEventHandler = function (event, fnHandler) {
            this.host.unbind(event);
        }

        $.jqx['_' + controlName].prototype.applyTo = function (element, args) {
            if (!(args instanceof Array)) {
                var a = [];
                a.push(args);
                args = a;
            }

            $.jqx.applyWidget(element, controlName, args, this);
        }

        $.jqx['_' + controlName].prototype.getInstance = function () {
            return this;
        }
        $.jqx['_' + controlName].prototype.propertyChangeMap = {};

        $.jqx['_' + controlName].prototype.addHandler = function (source, events, func, data) {
            $.jqx.addHandler($(source), events, func, data);
        };

        $.jqx['_' + controlName].prototype.removeHandler = function (source, events, func) {
            $.jqx.removeHandler($(source), events, func);
        };

        $.jqx['_' + controlName].prototype.setOptions = function () {
            if (!this.host || !this.host.length || this.host.length != 1)
                return;

            return $.jqx.jqxWidgetProxy(controlName, this.host[0], arguments);
        };
    } // jqxWidget

    $.jqx.toThemeProperty = function (instance, propertyName, override) {
        if (instance.theme == '')
            return propertyName;

        var split = propertyName.split(' ');
        var result = '';
        for (var i = 0; i < split.length; i++) {
            if (i > 0)
                result += ' ';

            var key = split[i];

            if (override != null && override)
                result += key + '-' + instance.theme;
            else
                result += key + ' ' + key + '-' + instance.theme;
        }

        return result;
    }

    $.jqx.addHandler = function (source, eventsList, func, data) {
        var events = eventsList.split(' ');

        for (var i = 0; i < events.length; i++) {
            var event = events[i];

            if (window.addEventListener) {
                switch (event) {
                    case 'mousewheel':
                        if ($.jqx.browser.mozilla) {
                            source[0].addEventListener('DOMMouseScroll', func, false);
                        }
                        else {
                            source[0].addEventListener('mousewheel', func, false);
                        }
                        continue;
                    case 'mousemove':
                        if (!data) {
                            source[0].addEventListener('mousemove', func, false);
                            continue;
                        }
                        break;
                }
            }

            if (data == undefined || data == null) {
                if (source.on)
                    source.on(event, func);
                else
                    source.bind(event, func);
            }
            else {
                if (source.on)
                    source.on(event, data, func);
                else
                    source.bind(event, data, func);
            }
        } // for
    };

    $.jqx.removeHandler = function (source, eventsList, func) {
        if (!eventsList) {
            if (source.off)
                source.off();
            else
                source.unbind();
            return;
        }
        var events = eventsList.split(' ');

        for (var i = 0; i < events.length; i++) {
            var event = events[i];

            if (window.removeEventListener) {
                switch (event) {
                    case 'mousewheel':
						if ($.jqx.browser.mozilla) {
                            source[0].removeEventListener('DOMMouseScroll', func, false);
                        }
                        else {
                            source[0].removeEventListener('mousewheel', func, false);
                        }
                        continue;
                    case 'mousemove':
                        if (func) {
                            source[0].removeEventListener('mousemove', func, false);
                            continue;
                        }
                        break;
                }
            }

            if (event == undefined) {
                if (source.off)
                    source.off();
                else
                    source.unbind();
                continue;
            }

            if (func == undefined) {
                if (source.off)
                    source.off(event);
                else
                    source.unbind(event);
            }
            else {
                if (source.off)
                    source.off(event, func);
                else
                    source.unbind(event, func);
            }
        }
    };

    $.jqx.theme = $.jqx.theme || "";
    $.jqx.scrollAnimation = $.jqx.scrollAnimation || false;
    $.jqx.resizeDelay = $.jqx.resizeDelay || 10;

    $.jqx.ready = function () {
        $(window).trigger('jqxReady');
    }
    $.jqx.init = function () {
        $.each(arguments[0], function (index, value) {
            if (index == "theme") {
                $.jqx.theme = value;
            }
            if (index == "scrollBarSize") {
                $.jqx.utilities.scrollBarSize = value;
            }
            if (index == "touchScrollBarSize") {
                $.jqx.utilities.touchScrollBarSize = value;
            }
            if (index == "scrollBarButtonsVisibility") {
                $.jqx.utilities.scrollBarButtonsVisibility = value;
            }
        });
    }

    // Utilities
    $.jqx.utilities = $.jqx.utilities || {};
    $.extend($.jqx.utilities,
    {
        scrollBarSize: 15,
        touchScrollBarSize: 0,
        scrollBarButtonsVisibility: "visible",
        createId: function () {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return "jqxWidget" + S4() + S4();
        },

        setTheme: function (oldTheme, theme, element) {
            if (typeof element === 'undefined') {
                return;
            }
            var classNames = element[0].className.split(' '),
                oldClasses = [], newClasses = [],
                children = element.children();
            for (var i = 0; i < classNames.length; i += 1) {
                if (classNames[i].indexOf(oldTheme) >= 0) {
                    if (oldTheme.length > 0) {
                        oldClasses.push(classNames[i]);
                        newClasses.push(classNames[i].replace(oldTheme, theme));
                    }
                    else {
                        newClasses.push(classNames[i].replace("-" + theme, "") + '-' + theme);
                    }
                }
            }
            this._removeOldClasses(oldClasses, element);
            this._addNewClasses(newClasses, element);
            for (var i = 0; i < children.length; i += 1) {
                this.setTheme(oldTheme, theme, $(children[i]));
            }
        },

        _removeOldClasses: function (classes, element) {
            for (var i = 0; i < classes.length; i += 1) {
                element.removeClass(classes[i]);
            }
        },

        _addNewClasses: function (classes, element) {
            for (var i = 0; i < classes.length; i += 1) {
                element.addClass(classes[i]);
            }
        },

        getOffset: function (el) {
            var left = $.jqx.mobile.getLeftPos(el[0]);
            var top = $.jqx.mobile.getTopPos(el[0]);
            return { top: top, left: left };
        },

        resize: function (element, callback, destroy, checkForHidden) {
            if (checkForHidden === undefined) {
                checkForHidden = true;
            }

            var index = -1;
            var that = this;
            var getHiddenIndex = function (element) {
                if (!that.hiddenWidgets) {
                    return -1;
                }

                var hiddenIndex = -1;
                for (var i = 0; i < that.hiddenWidgets.length; i++) {
                    if (element.id) {
                        if (that.hiddenWidgets[i].id == element.id) {
                            hiddenIndex = i;
                            break;
                        }
                    }
                    else {
                        if (that.hiddenWidgets[i].id == element[0].id) {
                            hiddenIndex = i;
                            break;
                        }
                    }
                }
                return hiddenIndex;
            }


            if (this.resizeHandlers) {
                for (var i = 0; i < this.resizeHandlers.length; i++) {
                    if (element.id) {
                        if (this.resizeHandlers[i].id == element.id) {
                            index = i;
                            break;
                        }
                    }
                    else {
                        if (this.resizeHandlers[i].id == element[0].id) {
                            index = i;
                            break;
                        }
                    }
                }

                if (destroy === true) {
                    if (index != -1) {
                        this.resizeHandlers.splice(index, 1);
                    }

                    if (this.resizeHandlers.length == 0) {
                        var w = $(window);
                        if (w.off) {
                            w.off('resize.jqx');
                            w.off('orientationchange.jqx');
                            w.off('orientationchanged.jqx');
                        }
                        else {
                            w.unbind('resize.jqx');
                            w.unbind('orientationchange.jqx');
                            w.unbind('orientationchanged.jqx');
                        }
                        this.resizeHandlers = null;
                    }
                    var hiddenIndex = getHiddenIndex(element);
                    if (hiddenIndex != -1 && this.hiddenWidgets) {
                        this.hiddenWidgets.splice(hiddenIndex, 1);
                    }
                    return;
                }
            }
            else if (destroy === true) {
                var hiddenIndex = getHiddenIndex(element);
                if (hiddenIndex != -1 && this.hiddenWidgets) {
                    this.hiddenWidgets.splice(hiddenIndex, 1);
                }
                return;
            }
            var that = this;
            var doResize = function (isHidden, type) {
                if (!that.resizeHandlers)
                    return;

                var getParentsCount = function (element) {
                    var index = -1;
                    var parent = element.parentNode;
                    while (parent) {
                        index++;
                        parent = parent.parentNode;
                    }
                    return index;
                }

                var compare = function (value1, value2) {
                    if (!value1.widget || !value2.widget)
                        return 0;

                    var parents1 = getParentsCount(value1.widget[0]);
                    var parents2 = getParentsCount(value2.widget[0]);

                    try {
                        if (parents1 < parents2) { return -1; }
                        if (parents1 > parents2) { return 1; }
                    }
                    catch (error) {
                        var er = error;
                    }

                    return 0;
                };
                var handleHiddenWidgets = function (delay) {
                    if (that.hiddenWidgets.length > 0) {
                        that.hiddenWidgets.sort(compare);
                        var updateHiddenWidgets = function () {
                            var hasHiddenWidget = false;
                            var currentHiddenWidgets = new Array();
                            for (var p = 0; p < that.hiddenWidgets.length; p++) {
                                var handler = that.hiddenWidgets[p];
                                if ($.jqx.isHidden(handler.widget)) {
                                    hasHiddenWidget = true;
                                    currentHiddenWidgets.push(handler);
                                }
                                else {
                                    if (handler.callback) {
                                        handler.callback(type);
                                    }
                                }
                            }
                            that.hiddenWidgets = currentHiddenWidgets;
                            if (!hasHiddenWidget) {
                                clearInterval(that.__resizeInterval);
                            }
                        }
                        if (delay == false) {
                            updateHiddenWidgets();
                            if (that.__resizeInterval) clearInterval(that.__resizeInterval);
                            return;
                        }
                        if (that.__resizeInterval) clearInterval(that.__resizeInterval);
                        that.__resizeInterval = setInterval(function () {
                            updateHiddenWidgets();
                        }, 100);
                    }
                }

                if (that.hiddenWidgets && that.hiddenWidgets.length > 0) {
                    handleHiddenWidgets(false);
                }
                that.hiddenWidgets = new Array();
                that.resizeHandlers.sort(compare);
                for (var i = 0; i < that.resizeHandlers.length; i++) {
                    var handler = that.resizeHandlers[i];
                    var widget = handler.widget;
                    var data = handler.data;
                    if (!data) continue;
                    if (!data.jqxWidget) continue;

                    var width = data.jqxWidget.width;
                    var height = data.jqxWidget.height;

                    if (data.jqxWidget.base) {
                        if (width == undefined) {
                            width = data.jqxWidget.base.width;
                        }
                        if (height == undefined) {
                            height = data.jqxWidget.base.height;
                        }
                    }

                    if (width === undefined && height === undefined) {
                        width = data.jqxWidget.element.style.width;
                        height = data.jqxWidget.element.style.height;
                    }

                    var percentageSize = false;
                    if (width != null && width.toString().indexOf("%") != -1) {
                        percentageSize = true;
                    }

                    if (height != null && height.toString().indexOf("%") != -1) {
                        percentageSize = true;
                    }

                    if ($.jqx.isHidden(widget)) {
                        if (getHiddenIndex(widget) === -1) {
                            if (percentageSize || isHidden === true) {
                                if (handler.data.nestedWidget !== true) {
                                    that.hiddenWidgets.push(handler);
                                }
                            }
                        }
                    }
                    else if (isHidden === undefined || isHidden !== true) {
                        if (percentageSize) {
                            handler.callback(type);
                            if (that.watchedElementData) {
                                for (var m = 0; m < that.watchedElementData.length; m++) {
                                    if (that.watchedElementData[m].element == data.jqxWidget.element) {
                                        that.watchedElementData[m].offsetWidth = data.jqxWidget.element.offsetWidth;
                                        that.watchedElementData[m].offsetHeight = data.jqxWidget.element.offsetHeight;
                                        break;
                                    }
                                }
                            }
                            if (that.hiddenWidgets.indexOf(handler) >= 0) {
                                that.hiddenWidgets.splice(that.hiddenWidgets.indexOf(handler), 1);
                            }
                        }
                        if (data.jqxWidget.element) {
                            var widgetClass = data.jqxWidget.element.className;
                            if (widgetClass.indexOf('dropdownlist') >= 0 || widgetClass.indexOf('datetimeinput') >= 0 || widgetClass.indexOf('combobox') >= 0 || widgetClass.indexOf('menu') >= 0) {
                                if (data.jqxWidget.isOpened) {
                                    var opened = data.jqxWidget.isOpened();
                                    if (opened) {
                                        if (type && type == "resize" && $.jqx.mobile.isTouchDevice())
                                            continue;

                                        data.jqxWidget.close();
                                    }
                                }
                            }
                        }
                    }
                };
             
                handleHiddenWidgets();
            }

            if (!this.resizeHandlers) {
                this.resizeHandlers = new Array();

                var w = $(window);
                if (w.on) {
                    this._resizeTimer = null;
                    this._initResize = null;
                    w.on('resize.jqx', function (event) {
                        if (that._resizeTimer != undefined) {
                            clearTimeout(that._resizeTimer);
                        }
                        if (!that._initResize) {
                            that._initResize = true;
                            doResize(null, 'resize');
                        }
                        else {
                            that._resizeTimer = setTimeout(function () {
                                doResize(null, 'resize');
                            }, $.jqx.resizeDelay);
                        }
                    });
                    w.on('orientationchange.jqx', function (event) {
                        doResize(null, 'orientationchange');
                    });
                    w.on('orientationchanged.jqx', function (event) {
                        doResize(null, 'orientationchange');
                    });
                }
                else {
                    w.bind('resize.jqx', function (event) {
                        doResize(null, 'orientationchange');
                    });
                    w.bind('orientationchange.jqx', function (event) {
                        doResize(null, 'orientationchange');
                    });
                    w.bind('orientationchanged.jqx', function (event) {
                        doResize(null, 'orientationchange');
                    });
                }
            }
            var elementData = element.data();
            if (checkForHidden) {
                if (index === -1) {
                    this.resizeHandlers.push({ id: element[0].id, widget: element, callback: callback, data: elementData });
                }
            }
            try
            {
                var width = elementData.jqxWidget.width;
                var height = elementData.jqxWidget.height;

                if (elementData.jqxWidget.base)
                {
                    if (width == undefined)
                    {
                        width = elementData.jqxWidget.base.width;
                    }
                    if (height == undefined)
                    {
                        height = elementData.jqxWidget.base.height;
                    }
                }

                if (width === undefined && height === undefined)
                {
                    width = elementData.jqxWidget.element.style.width;
                    height = elementData.jqxWidget.element.style.height;
                }

                var percentageSize = false;
                if (width != null && width.toString().indexOf("%") != -1)
                {
                    percentageSize = true;
                }

                if (height != null && height.toString().indexOf("%") != -1)
                {
                    percentageSize = true;
                }
                if (percentageSize)
                {
                    if (!this.watchedElementData)
                    {
                        this.watchedElementData = [];
                    }
                    var that = this;
                    var checkForChanges = function (mutations)
                    {
                        if (that.watchedElementData.forEach)
                        {
                            that.watchedElementData.forEach(function (data)
                            {
                                if (data.element.offsetWidth !== data.offsetWidth ||
                                    data.element.offsetHeight !== data.offsetHeight)
                                {
                                    data.offsetWidth = data.element.offsetWidth;
                                    data.offsetHeight = data.element.offsetHeight;
                                    if (data.timer)
                                    {
                                        clearTimeout(data.timer);
                                    }
                                    data.timer = setTimeout(function ()
                                    {
                                        if (!$.jqx.isHidden($(data.element))) {
                                            data.callback();
                                        }
                                        else {
                                            data.timer = setInterval(function () {
                                                if (!$.jqx.isHidden($(data.element))) {
                                                    clearInterval(data.timer);
                                                    data.callback();
                                                }
                                            }, 100);
                                        }
                                    });
                                }
                            });
                        }
                    };

                    that.watchedElementData.push({
                        element: element[0],
                        offsetWidth: element[0].offsetWidth,
                        offsetHeight: element[0].offsetHeight,
                        callback: callback
                    });
                    if (!that.observer)
                    {
                        that.observer = new MutationObserver(checkForChanges);
                        that.observer.observe(document.body, {
                            attributes: true,
                            childList: true,
                            characterData: true
                        });
                    }
                }
            }
            catch (er)
            {
            }
            if ($.jqx.isHidden(element) && checkForHidden === true) {
                doResize(true);
            }
            $.jqx.resize = function () {
                doResize(null, 'resize');
            }
        },

        parseJSON: function (data) {
            if (!data || typeof data !== "string") {
                return null;
            }
            var rvalidchars = /^[\],:{}\s]*$/,
        rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
        rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
        rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g;

            // Make sure leading/trailing whitespace is removed (IE can't handle it)
            data = $.trim(data);

            // Attempt to parse using the native JSON parser first
            if (window.JSON && window.JSON.parse) {
                return window.JSON.parse(data);
            }

            // Make sure the incoming data is actual JSON
            // Logic borrowed from http://json.org/json2.js
            if (rvalidchars.test(data.replace(rvalidescape, "@")
                .replace(rvalidtokens, "]")
                .replace(rvalidbraces, ""))) {

                return (new Function("return " + data))();

            }
            throw new Error("Invalid JSON: " + data);
        },

        html: function (element, value) {
            if (!$(element).on) {
                return $(element).html(value);
            }
            try {
                return $.access(element, function (value) {
                    var elem = element[0] || {},
                        i = 0,
                        l = element.length;

                    if (value === undefined) {
                        return elem.nodeType === 1 ?
                            elem.innerHTML.replace(rinlinejQuery, "") :
                            undefined;
                    }

                    var rnoInnerhtml = /<(?:script|style|link)/i,
                        nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
            "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
                        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
                        rtagName = /<([\w:]+)/,
                        rnocache = /<(?:script|object|embed|option|style)/i,
                        rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
                        rleadingWhitespace = /^\s+/,
                        wrapMap = {
                            option: [1, "<select multiple='multiple'>", "</select>"],
                            legend: [1, "<fieldset>", "</fieldset>"],
                            thead: [1, "<table>", "</table>"],
                            tr: [2, "<table><tbody>", "</tbody></table>"],
                            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                            area: [1, "<map>", "</map>"],
                            _default: [0, "", ""]
                        };

                    if (typeof value === "string" && !rnoInnerhtml.test(value) &&
                        ($.support.htmlSerialize || !rnoshimcache.test(value)) &&
                        ($.support.leadingWhitespace || !rleadingWhitespace.test(value)) &&
                        !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

                        value = value.replace(rxhtmlTag, "<$1></$2>");

                        try {
                            for (; i < l; i++) {
                                elem = this[i] || {};
                                if (elem.nodeType === 1) {
                                    $.cleanData(elem.getElementsByTagName("*"));
                                    elem.innerHTML = value;
                                }
                            }

                            elem = 0;
                        } catch (e) { }
                    }

                    if (elem) {
                        element.empty().append(value);
                    }
                }, null, value, arguments.length);
            }
            catch (error) {
                return $(element).html(value);
            }
        },

        hasTransform: function (el) {
            var transform = "";
            transform = el.css('transform');

            if (transform == "" || transform == 'none') {
                transform = el.parents().css('transform');
                if (transform == "" || transform == 'none') {
                    var browserInfo = $.jqx.utilities.getBrowser();
                    if (browserInfo.browser == 'msie') {
                        transform = el.css('-ms-transform');
                        if (transform == "" || transform == 'none') {
                            transform = el.parents().css('-ms-transform');
                        }
                    }
                    else if (browserInfo.browser == 'chrome') {
                        transform = el.css('-webkit-transform');
                        if (transform == "" || transform == 'none') {
                            transform = el.parents().css('-webkit-transform');
                        }
                    }
                    else if (browserInfo.browser == 'opera') {
                        transform = el.css('-o-transform');
                        if (transform == "" || transform == 'none') {
                            transform = el.parents().css('-o-transform');
                        }
                    }
                    else if (browserInfo.browser == 'mozilla') {
                        transform = el.css('-moz-transform');
                        if (transform == "" || transform == 'none') {
                            transform = el.parents().css('-moz-transform');
                        }
                    }
                } else {
                    return transform != "" && transform != 'none';
                }
            }
            if (transform == "" || transform == 'none') {
                transform = $(document.body).css('transform');
            }
            return transform != "" && transform != 'none' && transform != null;
        },

        getBrowser: function () {
            var ua = navigator.userAgent.toLowerCase();

            var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
		        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
		        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
		        /(msie) ([\w.]+)/.exec(ua) ||
		        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
		        [];

            var obj = {
                browser: match[1] || "",
                version: match[2] || "0"
            };
            if (ua.indexOf("rv:11.0") >= 0 && ua.indexOf(".net4.0c") >= 0) {
                obj.browser = "msie";
                obj.version = "11";
                match[1] = "msie";
            }
            if (ua.indexOf("edge") >= 0) {
                obj.browser = "msie";
                obj.version = "12";
                match[1] = "msie";
            }
            obj[match[1]] = match[1];
            return obj;
        }
    });
    $.jqx.browser = $.jqx.utilities.getBrowser();
    $.jqx.isHidden = function (element) {
        if (!element || !element[0])
            return false;

        var w = element[0].offsetWidth, h = element[0].offsetHeight;
        if (w === 0 || h === 0)
            return true;
        else {
            return false;
        }
    };

    $.jqx.ariaEnabled = true;
    $.jqx.aria = function (that, property, value) {
        if (!$.jqx.ariaEnabled)
            return;

        if (property == undefined) {
            $.each(that.aria, function (index, value) {
                var attrValue = !that.base ? that.host.attr(index) : that.base.host.attr(index);
                if (attrValue != undefined && !$.isFunction(attrValue)) {
                    var newValue = attrValue;
                    switch (value.type) {
                        case "number":
                            newValue = new Number(attrValue);
                            if (isNaN(newValue)) newValue = attrValue;
                            break;
                        case "boolean":
                            newValue = attrValue == "true" ? true : false;
                            break;
                        case "date":
                            newValue = new Date(attrValue);
                            if (newValue == "Invalid Date" || isNaN(newValue)) newValue = attrValue;
                            break;
                    }

                    that[value.name] = newValue;
                }
                else {
                    var attrValue = that[value.name];
                    if ($.isFunction(attrValue)) attrValue = that[value.name]();
                    if (attrValue == undefined) attrValue = "";
                    try {
                        !that.base ? that.host.attr(index, attrValue.toString()) : that.base.host.attr(index, attrValue.toString());
                    }
                    catch (error) {
                    }
                }
            });
        }
        else {
            try {
                if (that.host) {
                    if (!that.base) {
                        if (that.host) {
                            if (that.element.setAttribute) {
                                that.element.setAttribute(property, value.toString());
                            }
                            else {
                                that.host.attr(property, value.toString());
                            }
                        }
                        else {
                            that.attr(property, value.toString());
                        }
                    }
                    else {
                        if (that.base.host) {
                            that.base.host.attr(property, value.toString());
                        }
                        else {
                            that.attr(property, value.toString());
                        }
                    }
                }
                else if (that.setAttribute) {
                    that.setAttribute(property, value.toString());
                }
            }
            catch (error) {
            }
        }
    };

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt /*, from*/) {
            var len = this.length;

            var from = Number(arguments[1]) || 0;
            from = (from < 0)
                ? Math.ceil(from)
                : Math.floor(from);
            if (from < 0)
                from += len;

            for (; from < len; from++) {
                if (from in this &&
                this[from] === elt)
                    return from;
            }
            return -1;
        };
    }

    $.jqx.mobile = $.jqx.mobile || {};
    $.jqx.position = function (event) {
        var left = parseInt(event.pageX);
        var top = parseInt(event.pageY);

        if ($.jqx.mobile.isTouchDevice()) {
            var touches = $.jqx.mobile.getTouches(event);
            var touch = touches[0];
            left = parseInt(touch.pageX);
            top = parseInt(touch.pageY);
        }
        return { left: left, top: top }
    }

    $.extend($.jqx.mobile,
    {
        _touchListener: function (e, me) {
            var createTouchEvent = function (name, e) {
                var event = document.createEvent('MouseEvents');

                event.initMouseEvent(
                    name,
                    e.bubbles,
                    e.cancelable,
                    e.view,
                    e.detail,
                    e.screenX,
                    e.screenY,
                    e.clientX,
                    e.clientY,
                    e.ctrlKey,
                    e.altKey,
                    e.shiftKey,
                    e.metaKey,
                    e.button,
                    e.relatedTarget
                );
                event._pageX = e.pageX;
                event._pageY = e.pageY;

                return event;
            }

            var eventMap = { 'mousedown': 'touchstart', 'mouseup': 'touchend', 'mousemove': 'touchmove' };
            var event = createTouchEvent(eventMap[e.type], e);
            e.target.dispatchEvent(event);

            var fn = e.target['on' + eventMap[e.type]];
            if (typeof fn === 'function') fn(e);
        },

        setMobileSimulator: function (element, value) {
            if (this.isTouchDevice()) {
                return;
            }

            this.simulatetouches = true;
            if (value == false) {
                this.simulatetouches = false;
            }

            var eventMap = { 'mousedown': 'touchstart', 'mouseup': 'touchend', 'mousemove': 'touchmove' };

            var self = this;
            if (window.addEventListener) {
                var subscribeToEvents = function () {
                    for (var key in eventMap) {
                        if (element.addEventListener) {
                            element.removeEventListener(key, self._touchListener);
                            element.addEventListener(key, self._touchListener, false);
                        }

                        //  document.removeEventListener(key, self._touchListener);
                        //  document.addEventListener(key, self._touchListener, false);
                    }
                }

                if ($.jqx.browser.msie) {
                    subscribeToEvents();
                }
                else {
                    subscribeToEvents();
                }
            }
        },

        isTouchDevice: function () {
            if (this.touchDevice != undefined)
                return this.touchDevice;

            var txt = "Browser CodeName: " + navigator.appCodeName + "";
            txt += "Browser Name: " + navigator.appName + "";
            txt += "Browser Version: " + navigator.appVersion + "";
            txt += "Platform: " + navigator.platform + "";
            txt += "User-agent header: " + navigator.userAgent + "";

            if (txt.indexOf('Android') != -1)
                return true;

            if (txt.indexOf('IEMobile') != -1)
                return true;

            if (txt.indexOf('Windows Phone') != -1)
                return true;

            if (txt.indexOf('WPDesktop') != -1)
                return true;

            if (txt.indexOf('ZuneWP7') != -1)
                return true;

            if (txt.indexOf('BlackBerry') != -1 && txt.indexOf('Mobile Safari') != -1)
                return true;

            if (txt.indexOf('ipod') != -1)
                return true;

            if (txt.indexOf('nokia') != -1 || txt.indexOf('Nokia') != -1)
                return true;

            if (txt.indexOf('Chrome/17') != -1)
                return false;

            if (txt.indexOf('CrOS') != -1)
                return false;

            if (txt.indexOf('Opera') != -1 && txt.indexOf('Mobi') == -1 && txt.indexOf('Mini') == -1 && txt.indexOf('Platform: Win') != -1) {
                return false;
            }

            if (txt.indexOf('Opera') != -1 && txt.indexOf('Mobi') != -1 && txt.indexOf('Opera Mobi') != -1) {
                return true;
            }

            var deviceTypes = {
                ios: 'i(?:Pad|Phone|Pod)(?:.*)CPU(?: iPhone)? OS ',
                android: '(Android |HTC_|Silk/)',
                blackberry: 'BlackBerry(?:.*)Version\/',
                rimTablet: 'RIM Tablet OS ',
                webos: '(?:webOS|hpwOS)\/',
                bada: 'Bada\/'
            }

            // check for IPad, IPhone, IE and Chrome
            try {
                if (this.touchDevice != undefined)
                    return this.touchDevice;

                this.touchDevice = false;
                for (i in deviceTypes) {
                    if (deviceTypes.hasOwnProperty(i)) {
                        prefix = deviceTypes[i];
                        match = txt.match(new RegExp('(?:' + prefix + ')([^\\s;]+)'));
                        if (match) {
                            if (i.toString() == "blackberry") {
                                // handle touches through mouse pointer.
                                this.touchDevice = false;
                                return false;
                            }

                            this.touchDevice = true;
                            return true;
                        }
                    }
                }

                var userAgent = navigator.userAgent;
                if (navigator.platform.toLowerCase().indexOf('win') != -1) {
                    if (userAgent.indexOf('Windows Phone') >= 0 || userAgent.indexOf('WPDesktop') >= 0 || userAgent.indexOf('IEMobile') >= 0 || userAgent.indexOf('ZuneWP7') >= 0) {
                        this.touchDevice = true;
                        return true;
                    }
                    else {
                        if (userAgent.indexOf('Touch') >= 0) {
                            var supported = ('MSPointerDown' in window) || ('pointerdown' in window);
                            if (supported) {
                                this.touchDevice = true;
                                return true;
                            }
                            if (userAgent.indexOf('ARM') >= 0) {
                                this.touchDevice = true;
                                return true;
                            }

                            this.touchDevice = false;
                            return false;
                        }
                    }
                }

                if (navigator.platform.toLowerCase().indexOf('win') != -1) {
                    this.touchDevice = false;
                    return false;
                }
                if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
                    this.touchDevice = true;
                }
                return this.touchDevice;
            } catch (e) {
                this.touchDevice = false;
                return false;
            }
        },

        getLeftPos: function (inputObj) {
            var returnValue = inputObj.offsetLeft;
            while ((inputObj = inputObj.offsetParent) != null) {
                if (inputObj.tagName != 'HTML') {
                    returnValue += inputObj.offsetLeft;
                    if (document.all) returnValue += inputObj.clientLeft;
                }
            }
            return returnValue;
        },

        getTopPos: function (inputObj) {
            var returnValue = inputObj.offsetTop;
            var initialOffset = $(inputObj).coord();
            while ((inputObj = inputObj.offsetParent) != null) {
                if (inputObj.tagName != 'HTML') {
                    returnValue += (inputObj.offsetTop - inputObj.scrollTop);
                    if (document.all) returnValue += inputObj.clientTop;
                }
            }
            var agent = navigator.userAgent.toLowerCase();
            var wp8 = (agent.indexOf('windows phone') != -1 || agent.indexOf('WPDesktop') != -1 || agent.indexOf('ZuneWP7') != -1 || agent.indexOf('msie 9') != -1 || agent.indexOf('msie 11') != -1 || agent.indexOf('msie 10') != -1) && agent.indexOf('touch') != -1;
            if (wp8) {
                return initialOffset.top;
            }

            if (this.isSafariMobileBrowser()) {
                if (this.isSafari4MobileBrowser() && this.isIPadSafariMobileBrowser()) {
                    return returnValue;
                }
                if (agent.indexOf('version/7') != -1) {
                    return initialOffset.top;
                }
                if (agent.indexOf('version/6') != -1 || agent.indexOf('version/5') != -1) {
                    returnValue = returnValue + $(window).scrollTop();
                }
                if (/(Android.*Chrome\/[.0-9]* (!?Mobile))/.exec(navigator.userAgent))
                {
                    return returnValue + $(window).scrollTop();
                }
                if (/(Android.*Chrome\/[.0-9]* Mobile)/.exec(navigator.userAgent))
                {
                    return returnValue + $(window).scrollTop();
                }
 
                return initialOffset.top;
            }

            return returnValue;
        },

        isChromeMobileBrowser: function () {
            var agent = navigator.userAgent.toLowerCase();
            var result = agent.indexOf('android') != -1;
            return result;
        },

        isOperaMiniMobileBrowser: function () {
            var agent = navigator.userAgent.toLowerCase();
            var result = agent.indexOf('opera mini') != -1 || agent.indexOf('opera mobi') != -1;
            return result;
        },

        isOperaMiniBrowser: function () {
            var agent = navigator.userAgent.toLowerCase();
            var result = agent.indexOf('opera mini') != -1;
            return result;
        },

        isNewSafariMobileBrowser: function () {
            var agent = navigator.userAgent.toLowerCase();
            var result = agent.indexOf('ipad') != -1 || agent.indexOf('iphone') != -1 || agent.indexOf('ipod') != -1;
            result = result && (agent.indexOf('version/5') != -1);
            return result;
        },

        isSafari4MobileBrowser: function () {
            var agent = navigator.userAgent.toLowerCase();
            var result = agent.indexOf('ipad') != -1 || agent.indexOf('iphone') != -1 || agent.indexOf('ipod') != -1;
            result = result && (agent.indexOf('version/4') != -1);
            return result;
        },

        isWindowsPhone: function () {
            var agent = navigator.userAgent.toLowerCase();
            var result = (agent.indexOf('windows phone') != -1 || agent.indexOf('WPDesktop') != -1 || agent.indexOf('ZuneWP7') != -1 || agent.indexOf('msie 9') != -1 || agent.indexOf('msie 11') != -1 || agent.indexOf('msie 10') != -1 && agent.indexOf('touch') != -1);
            return result;
        },

        isSafariMobileBrowser: function () {
            var agent = navigator.userAgent.toLowerCase();
            if (/(Android.*Chrome\/[.0-9]* (!?Mobile))/.exec(navigator.userAgent))
            {
                return true;
            }
            if (/(Android.*Chrome\/[.0-9]* Mobile)/.exec(navigator.userAgent))
            {
                return true;
            }

            var result = agent.indexOf('ipad') != -1 || agent.indexOf('iphone') != -1 || agent.indexOf('ipod') != -1 || agent.indexOf('mobile safari') != -1;
            return result;
        },

        isIPadSafariMobileBrowser: function () {
            var agent = navigator.userAgent.toLowerCase();
            var result = agent.indexOf('ipad') != -1;
            return result;
        },

        isMobileBrowser: function () {
            var agent = navigator.userAgent.toLowerCase();
            var result = agent.indexOf('ipad') != -1 || agent.indexOf('iphone') != -1 || agent.indexOf('android') != -1;
            return result;
        },

        // Get the touch points from this event
        getTouches: function (e) {
            if (e.originalEvent) {
                if (e.originalEvent.touches && e.originalEvent.touches.length) {
                    return e.originalEvent.touches;
                } else if (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
                    return e.originalEvent.changedTouches;
                }
            }

            if (!e.touches) {
                e.touches = new Array();
                e.touches[0] = e.originalEvent != undefined ? e.originalEvent : e;

                if (e.originalEvent != undefined && e.pageX)
                    e.touches[0] = e;
                if (e.type == 'mousemove') e.touches[0] = e;
            }

            return e.touches;
        },

        getTouchEventName: function (name) {
            if (this.isWindowsPhone()) {

                var agent = navigator.userAgent.toLowerCase();
                if (agent.indexOf('windows phone 7') != -1) {
                    if (name.toLowerCase().indexOf('start') != -1) return 'MSPointerDown';
                    if (name.toLowerCase().indexOf('move') != -1) return 'MSPointerMove';
                    if (name.toLowerCase().indexOf('end') != -1) return 'MSPointerUp';
                }
                if (name.toLowerCase().indexOf('start') != -1) return 'pointerdown';
                if (name.toLowerCase().indexOf('move') != -1) return 'pointermove';
                if (name.toLowerCase().indexOf('end') != -1) return 'pointerup';
            }
            else {
                return name;
            }
        },

        // Dispatches a fake mouse event from a touch event
        dispatchMouseEvent: function (name, touch, target) {
            if (this.simulatetouches)
                return;

            var e = document.createEvent('MouseEvent');
            e.initMouseEvent(name, true, true, touch.view, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
            if (target != null) {
                target.dispatchEvent(e);
            }
        },

        // Find the root node of this target
        getRootNode: function (target) {
            while (target.nodeType !== 1) {
                target = target.parentNode;
            }
            return target;
        },

        setTouchScroll: function (enable, key) {
            if (!this.enableScrolling) this.enableScrolling = [];
            this.enableScrolling[key] = enable;
        },

        touchScroll: function (element, scrollHeight, callback, key, horizontalScroll, verticalScroll)
        {
            if (element == null)
                return;

            var me = this;
            var scrollY = 0;
            var touchY = 0;
            var movedY = 0;
            var scrollX = 0;
            var touchX = 0;
            var movedX = 0;
            if (!this.scrolling) this.scrolling = [];
            this.scrolling[key] = false;
            var moved = false;
            var $element = $(element);
            var touchTags = ['select', 'input', 'textarea'];
            var touchStart = 0;
            var touchEnd = 0;
            if (!this.enableScrolling) this.enableScrolling = [];
            this.enableScrolling[key] = true;
            var key = key;
            var touchStartName = this.getTouchEventName('touchstart') + ".touchScroll";
            var touchEndName = this.getTouchEventName('touchend') + ".touchScroll";
            var touchMoveName = this.getTouchEventName('touchmove') + ".touchScroll";

            //            horizontalScroll.fadeOut(0);
            //            verticalScroll.fadeOut(0);

            var view, indicator, relative,
               xmax, min, max, offset, reference, pressed, xform,
               jqxAnimations, frame, timestamp, ticker,
               amplitude, target, xtarget, xreference, timeConstant;
            max = scrollHeight;
            min = 0;
            offset = 0;
            xoffset = 0;
            initialOffset = 0;
            initialXOffset = 0;
            xmax = horizontalScroll.jqxScrollBar('max');
            timeConstant = 325; // ms

            function ypos(e)
            {
                // touch event
                if (e.targetTouches && (e.targetTouches.length >= 1))
                {
                    return e.targetTouches[0].clientY;
                }
                else if (e.originalEvent && e.originalEvent.clientY !== undefined)
                {
                    return e.originalEvent.clientY;
                }
                else
                {
                    var touches = me.getTouches(e);
                    return touches[0].clientY;
                }

                // mouse event
                return e.clientY;
            }

            function xpos(e)
            {
                // touch event
                if (e.targetTouches && (e.targetTouches.length >= 1))
                {
                    return e.targetTouches[0].clientX;
                }
                else if (e.originalEvent && e.originalEvent.clientX !== undefined)
                {
                    return e.originalEvent.clientX;
                }
                else
                {
                    var touches = me.getTouches(e);
                    return touches[0].clientX;
                }

                // mouse event
                return e.clientX;
            }

            var track = function ()
            {
                var now, elapsed, delta, v;

                now = Date.now();
                elapsed = now - timestamp;
                timestamp = now;
                delta = offset - frame;
                xdelta = xoffset - xframe;
                frame = offset;
                xframe = xoffset;
                pressed = true;
                v = 1000 * delta / (1 + elapsed);
                xv = 1000 * xdelta / (1 + elapsed);
                jqxAnimations = 0.8 * v + 0.2 * jqxAnimations;
                xjqxAnimations = 0.8 * xv + 0.2 * xjqxAnimations;
            }

            var tapped = false;

            var touchStart = function (event)
            {
                if (!me.enableScrolling[key])
                    return true;

                // Allow certain HTML tags to receive touch events
                if ($.inArray(event.target.tagName.toLowerCase(), touchTags) !== -1)
                {
                    return;
                }
                offset = verticalScroll.jqxScrollBar('value');
                xoffset = horizontalScroll.jqxScrollBar('value');

                var touches = me.getTouches(event);
                var touch = touches[0];
                if (touches.length == 1)
                {
                    me.dispatchMouseEvent('mousedown', touch, me.getRootNode(touch.target));
                }
                xmax = horizontalScroll.jqxScrollBar('max');
                max = verticalScroll.jqxScrollBar('max');
                function tap(e)
                {
                    tapped = false;
                    pressed = true;
                    reference = ypos(e);
                    xreference = xpos(e);
                    jqxAnimations = amplitude = xjqxAnimations = 0;
                    frame = offset;
                    xframe = xoffset;
                    timestamp = Date.now();
                    clearInterval(ticker);
                    ticker = setInterval(track, 100);
                    initialOffset = offset;
                    initialXOffset = xoffset;

                    if (offset > 0 && offset < max && verticalScroll[0].style.visibility != "hidden")
                    {
                        //      e.preventDefault();
                    }
                    //    if (xoffset > 0 && xoffset < xmax && horizontalScroll[0].style.visibility != "hidden") {
                    //        e.preventDefault();

                    //      e.stopPropagation();
                    //   e.stopPropagation();
                    // return false;
                }

                tap(event);
                moved = false;
                touchY = touch.pageY;
                touchX = touch.pageX;
                if (me.simulatetouches)
                {
                    if (touch._pageY != undefined)
                    {
                        touchY = touch._pageY;
                        touchX = touch._pageX;
                    }
                }
                me.scrolling[key] = true;
                scrollY = 0;
                scrollX = 0;
                return true;
            }

            if ($element.on)
            {
                $element.on(touchStartName, touchStart);
            }
            else
            {
                $element.bind(touchStartName, touchStart);
            }

            var scroll = function (top, event)
            {
                offset = (top > max) ? max : (top < min) ? min : top;
                callback(null, top, 0, 0, event);

                return (top > max) ? "max" : (top < min) ? "min" : "value";
            }

            var hscroll = function (left, event)
            {
                xoffset = (left > xmax) ? xmax : (left < min) ? min : left;
                callback(left, null, 0, 0, event);

                return (left > xmax) ? "max" : (left < min) ? "min" : "value";
            }

            function autoScroll()
            {
                var elapsed, delta;
                if (amplitude)
                {
                    elapsed = Date.now() - timestamp;
                    delta = -amplitude * Math.exp(-elapsed / timeConstant);
                    if (delta > 0.5 || delta < -0.5)
                    {
                        scroll(target + delta, event);
                        requestAnimationFrame(autoScroll);
                    } else
                    {
                        scroll(target);
                        verticalScroll.fadeOut('fast');
                    }
                }
            }
            function hAutoScroll()
            {
                var elapsed, delta;
                if (amplitude)
                {
                    elapsed = Date.now() - timestamp;
                    delta = -amplitude * Math.exp(-elapsed / timeConstant);
                    if (delta > 0.5 || delta < -0.5)
                    {
                        hscroll(xtarget + delta);
                        requestAnimationFrame(hAutoScroll);
                    } else
                    {
                        hscroll(xtarget);
                        horizontalScroll.fadeOut('fast');
                    }

                }
            }
            var touchMove = function (event)
            {
                if (!me.enableScrolling[key])
                    return true;

                if (!me.scrolling[key])
                {
                    return true;
                }

                if (tapped)
                {
                    event.preventDefault();
                    event.stopPropagation();
                }

                var touches = me.getTouches(event);
                if (touches.length > 1)
                {
                    return true;
                }

                var pageY = touches[0].pageY;
                var pageX = touches[0].pageX;

                if (me.simulatetouches)
                {
                    if (touches[0]._pageY != undefined)
                    {
                        pageY = touches[0]._pageY;
                        pageX = touches[0]._pageX;
                    }
                }


                var dy = pageY - touchY;
                var dx = pageX - touchX;
                touchEnd = pageY;
                touchHorizontalEnd = pageX;
                movedY = dy - scrollY;
                movedX = dx - scrollX;
                moved = true;
                scrollY = dy;
                scrollX = dx;

                var hScrollVisible = horizontalScroll != null ? horizontalScroll[0].style.visibility != 'hidden' : true;
                var vScrollVisible = verticalScroll != null ? verticalScroll[0].style.visibility != 'hidden' : true;


                function drag(e)
                {
                    var y, delta, x;
                    if (pressed)
                    {
                        y = ypos(e);
                        x = xpos(e);
                        delta = reference - y;
                        xdelta = xreference - x;
                        var dragged = "value";
                        if (delta > 2 || delta < -2)
                        {
                            reference = y;
                            dragged = scroll(offset + delta, e);
                            track();

                            if (dragged == "min" && initialOffset === 0)
                            {
                                return true;
                            }
                            if (dragged == "max" && initialOffset === max)
                            {
                                return true;
                            }

                            if (!vScrollVisible)
                            {
                                return true;
                            }
                            e.preventDefault();
                            e.stopPropagation();
                            tapped = true;

                            return false;
                        }
                        else
                        {
                            if (xdelta > 2 || xdelta < -2)
                            {
                                xreference = x;
                                dragged = hscroll(xoffset + xdelta, e);
                                track();

                                if (dragged == "min" && initialXOffset === 0)
                                {
                                    return true;
                                }
                                if (dragged == "max" && initialXOffset === xmax)
                                {
                                    return true;
                                }

                                if (!hScrollVisible)
                                {
                                    return true;
                                }
                                tapped = true;
                                e.preventDefault();
                                e.stopPropagation();
                                return false;
                            }
                        }
                        e.preventDefault();
                    }
                }

                if (hScrollVisible || vScrollVisible)
                {
                    if ((hScrollVisible) || (vScrollVisible))
                    {
                        drag(event);

                        //      callback(-movedX * 1, -movedY * 1, dx, dy, event);
                        //event.preventDefault();
                        //event.stopPropagation();
                        //if (event.preventManipulation) {
                        //    event.preventManipulation();
                        //}
                        //return false;
                    }
                }
            }

            if ($element.on)
            {
                $element.on(touchMoveName, touchMove);
            }
            else $element.bind(touchMoveName, touchMove);



            var touchCancel = function (event)
            {
                if (!me.enableScrolling[key])
                    return true;

                var touch = me.getTouches(event)[0];
                if (!me.scrolling[key])
                {
                    return true;
                }

                pressed = false;
                clearInterval(ticker);
                if (jqxAnimations > 10 || jqxAnimations < -10)
                {
                    amplitude = 0.8 * jqxAnimations;
                    target = Math.round(offset + amplitude);
                    timestamp = Date.now();
                    requestAnimationFrame(autoScroll);
                    verticalScroll.fadeIn(100);
                }
                else if (xjqxAnimations > 10 || xjqxAnimations < -10)
                {
                    amplitude = 0.8 * xjqxAnimations;
                    xtarget = Math.round(xoffset + amplitude);
                    timestamp = Date.now();
                    requestAnimationFrame(hAutoScroll);
                    horizontalScroll.fadeIn(100);
                }
                else
                {
                    horizontalScroll.fadeOut(100);
                    verticalScroll.fadeOut(100);
                }

                me.scrolling[key] = false;
                if (moved)
                {
                    me.dispatchMouseEvent('mouseup', touch, event.target);
                } else
                {
                    var touch = me.getTouches(event)[0],
						t = me.getRootNode(touch.target);

                    //        event.preventDefault();
                    //         event.stopPropagation();
                    // Dispatch fake mouse up and click events if this touch event did not move
                    me.dispatchMouseEvent('mouseup', touch, t);
                    me.dispatchMouseEvent('click', touch, t);
                    return true;
                }
            }

            if (this.simulatetouches)
            {
                var windowBindFunc = $(window).on != undefined || $(window).bind;
                var windowMouseUp = function (event)
                {
                    try
                    {
                        touchCancel(event);
                    }
                    catch (er)
                    {
                    }
                    me.scrolling[key] = false;
                };
                $(window).on != undefined ? $(document).on('mouseup.touchScroll', windowMouseUp) : $(document).bind('mouseup.touchScroll', windowMouseUp);

                if (window.frameElement)
                {
                    if (window.top != null)
                    {
                        var eventHandle = function (event)
                        {
                            try
                            {
                                touchCancel(event);
                            }
                            catch (er)
                            {
                            }
                            me.scrolling[key] = false;
                        };

                        if (window.top.document)
                        {
                            $(window.top.document).on ? $(window.top.document).on('mouseup', eventHandle) : $(window.top.document).bind('mouseup', eventHandle);
                        }
                    }
                }

                var docBindFunc = $(document).on != undefined || $(document).bind;
                var touchEndFunc = function (event)
                {
                    if (!me.scrolling[key])
                    {
                        return true;
                    }

                    me.scrolling[key] = false;
                    var touch = me.getTouches(event)[0],
						target = me.getRootNode(touch.target);

                    // Dispatch fake mouse up and click events if this touch event did not move
                    me.dispatchMouseEvent('mouseup', touch, target);
                    me.dispatchMouseEvent('click', touch, target);
                };

                $(document).on != undefined ? $(document).on('touchend', touchEndFunc) : $(document).bind('touchend', touchEndFunc);
            }

            if ($element.on)
            {
                $element.on('dragstart', function (event)
                {
                    event.preventDefault();
                });
                $element.on('selectstart', function (event)
                {
                    event.preventDefault();
                });
            }
            $element.on ? $element.on(touchEndName + ' touchcancel.touchScroll', touchCancel) : $element.bind(touchEndName + ' touchcancel.touchScroll', touchCancel);
        }

    });

    $.jqx.cookie = $.jqx.cookie || {};
    $.extend($.jqx.cookie,
    {
        cookie: function (key, value, options) {
            // set cookie.
            if (arguments.length > 1 && String(value) !== "[object Object]") {
                options = $.extend({}, options);

                if (value === null || value === undefined) {
                    options.expires = -1;
                }

                if (typeof options.expires === 'number') {
                    var days = options.expires, t = options.expires = new Date();
                    t.setDate(t.getDate() + days);
                }

                value = String(value);

                return (document.cookie = [
                encodeURIComponent(key), '=',
                options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
        ].join(''));
            }
            // get cookie...
            options = value || {};
            var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
            return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
        }
    });

    // stringutilities
    $.jqx.string = $.jqx.string || {};
    $.extend($.jqx.string,
    {
        replace: function (text, stringToFind, stringToReplace) {
            if (stringToFind === stringToReplace) return this;
            var temp = text;
            var index = temp.indexOf(stringToFind);
            while (index != -1) {
                temp = temp.replace(stringToFind, stringToReplace);
                index = temp.indexOf(stringToFind);
            }
            return temp;
        },

        contains: function (fullString, value) {
            if (fullString == null || value == null)
                return false;

            return fullString.indexOf(value) != -1;
        },

        containsIgnoreCase: function (fullString, value) {
            if (fullString == null || value == null)
                return false;

            return fullString.toString().toUpperCase().indexOf(value.toString().toUpperCase()) != -1;
        },

        equals: function (fullString, value) {
            if (fullString == null || value == null)
                return false;

            fullString = this.normalize(fullString);

            if (value.length == fullString.length) {
                return fullString.slice(0, value.length) == value;
            }

            return false;
        },

        equalsIgnoreCase: function (fullString, value) {
            if (fullString == null || value == null)
                return false;

            fullString = this.normalize(fullString);

            if (value.length == fullString.length) {
                return fullString.toUpperCase().slice(0, value.length) == value.toUpperCase();
            }

            return false;
        },

        startsWith: function (fullString, value) {
            if (fullString == null || value == null)
                return false;

            return fullString.slice(0, value.length) == value;
        },

        startsWithIgnoreCase: function (fullString, value) {
            if (fullString == null || value == null)
                return false;

            return fullString.toUpperCase().slice(0, value.length) == value.toUpperCase();
        },

        normalize: function (fullString) {
            if (fullString.charCodeAt(fullString.length - 1) == 65279) {
                fullString = fullString.substring(0, fullString.length - 1);
            }

            return fullString;
        },

        endsWith: function (fullString, value) {
            if (fullString == null || value == null)
                return false;

            fullString = this.normalize(fullString);
            return fullString.slice(-value.length) == value;
        },

        endsWithIgnoreCase: function (fullString, value) {
            if (fullString == null || value == null)
                return false;

            fullString = this.normalize(fullString);

            return fullString.toUpperCase().slice(-value.length) == value.toUpperCase();
        }
    });

    $.extend($.easing, {
        easeOutBack: function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        easeInQuad: function (x, t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        easeInOutCirc: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        },
        easeInOutSine: function (x, t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        },
        easeInCubic: function (x, t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        easeOutCubic: function (x, t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        },
        easeInOutCubic: function (x, t, b, c, d) {
            if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        easeInSine: function (x, t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        },
        easeOutSine: function (x, t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        },
        easeInOutSine: function (x, t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        }
    });
})(jqxBaseFramework);

(function ($) {
    if ($.event && $.event.special) {
        $.extend($.event.special,
        {
            "close": { noBubble: true },
            "open": { noBubble: true },
            "cellclick": { noBubble: true },
            "rowclick": { noBubble: true },
            "tabclick": { noBubble: true },
            "selected": { noBubble: true },
            "expanded": { noBubble: true },
            "collapsed": { noBubble: true },
            "valuechanged": { noBubble: true },
            "expandedItem": { noBubble: true },
            "collapsedItem": { noBubble: true },
            "expandingItem": { noBubble: true },
            "collapsingItem": { noBubble: true }
        });
    }
    if ($.fn.extend) {
        $.fn.extend({
            ischildof: function (filter_string) {
                if (!$(this).parents) {
                    var result = filter_string.element.contains(this.element)
                    return result;
                }

                var parents = $(this).parents().get();

                for (var j = 0; j < parents.length; j++) {
                    if (typeof filter_string != "string") {
                        var parent = parents[j];
                        if (filter_string !== undefined) {
                            if (parent == filter_string[0])
                                return true;
                        }
                    }
                    else {
                        if (filter_string !== undefined) {
                            if ($(parents[j]).is(filter_string)) {
                                return true;
                            }
                        }
                    }
                }

                return false;
            }
        });
    }

    $.fn.jqxProxy = function () {
        var widget = $(this).data().jqxWidget;
        var args = Array.prototype.slice.call(arguments, 0);
        var element = widget.element;
        if (!element) element = widget.base.element;
        return $.jqx.jqxWidgetProxy(widget.widgetName, element, args);
    }

    var originalVal = this.originalVal = $.fn.val;
    $.fn.val = function (value) {
        if (typeof value == 'undefined') {
            if ($(this).hasClass('jqx-widget')) {
                var widget = $(this).data().jqxWidget;
                if (widget && widget.val) {
                    return widget.val();
                }
            }
            return originalVal.call(this);
        }
        else {
            if ($(this).hasClass('jqx-widget')) {
                var widget = $(this).data().jqxWidget;
                if (widget && widget.val) {
                    if (arguments.length != 2) {
                        return widget.val(value);
                    }
                    else {
                        return widget.val(value, arguments[1]);
                    }
                }
            }

            return originalVal.call(this, value);
        }
    };

    if ($.fn.modal && $.fn.modal.Constructor) {
        $.fn.modal.Constructor.prototype.enforceFocus = function () {
            $(document)
              .off('focusin.bs.modal') // guard against infinite focus loop
              .on('focusin.bs.modal', $.proxy(function (e) {
                  if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                      if ($(e.target).parents().hasClass('jqx-popup'))
                          return true;
                      this.$element.trigger('focus')
                  }
              }, this));
        }
    }

    $.fn.coord = function (options) {
        var docElem, win,
            box = { top: 0, left: 0 },
            elem = this[0],
            doc = elem && elem.ownerDocument;
        if (!doc) {
            return;
        }
        docElem = doc.documentElement;
        if (!$.contains(docElem, elem)) {
            return box;
        }
        if (typeof elem.getBoundingClientRect !== undefined) {
            box = elem.getBoundingClientRect();
        }
        var getWindow = function(elem) {
            return $.isWindow(elem) ?
                elem :
                elem.nodeType === 9 ?
                    elem.defaultView || elem.parentWindow :
                    false;
        };

        win = getWindow(doc);
        var additionalLeftOffset = 0;
        var additionalTopOffset = 0;
        var agent = navigator.userAgent.toLowerCase();
        var result = agent.indexOf('ipad') != -1 || agent.indexOf('iphone') != -1;
        if (result) {
            // fix for iphone/ipad left offsets.
            additionalLeftOffset = 2;
        }
        if (true == options) {
            if (document.body.style.position != 'static' && document.body.style.position != '') {
                var coords = $(document.body).coord();
                additionalLeftOffset = -coords.left;
                additionalTopOffset = -coords.top;
            }
        }

        return {
            top: additionalTopOffset + box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
            left: additionalLeftOffset + box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
        };
    };
})(jqxBaseFramework);

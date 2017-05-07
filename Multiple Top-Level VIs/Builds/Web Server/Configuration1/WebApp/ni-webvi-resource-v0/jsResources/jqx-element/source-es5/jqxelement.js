"use strict";
! function() {
    var e = function() {
            function e() {
                babelHelpers.classCallCheck(this, e)
            }
            return babelHelpers.createClass(e, [{
                key: "addMessages",
                value: function(e, t) {
                    var n = this;
                    Object.assign(n.messages[e], t)
                }
            }, {
                key: "localize",
                value: function(e, t) {
                    var n = this;
                    if (n.messages && n.messages[n.language]) {
                        var i = n.messages[n.language][e];
                        if (i) {
                            var r = i;
                            for (var a in t) {
                                var o = t[a];
                                i = i.replace(new RegExp("{{" + a + "}}", "g"), o)
                            }
                            return n.localizeFormatFunction && n.localizeFormatFunction(r, i, t), i
                        }
                    }
                }
            }], [{
                key: "moduleName",
                get: function() {
                    return "LocalizationModule"
                }
            }, {
                key: "properties",
                get: function() {
                    return {
                        messages: {
                            value: {
                                en: {}
                            },
                            type: "object",
                            inherit: !0,
                            reflectToAttribute: !1
                        },
                        language: {
                            value: "en",
                            type: "string",
                            reflectToAttribute: !1
                        },
                        localizeFormatFunction: {
                            value: void 0,
                            type: "function",
                            reflectToAttribute: !1
                        }
                    }
                }
            }]), e
        }(),
        t = function() {
            function e() {
                babelHelpers.classCallCheck(this, e)
            }
            return babelHelpers.createClass(e, [{
                key: "log",
                value: function(e) {
                    this._logger("log", e)
                }
            }, {
                key: "warn",
                value: function(e) {
                    this._logger("warn", e)
                }
            }, {
                key: "error",
                value: function(e) {
                    this._logger("warn", e)
                }
            }, {
                key: "_logger",
                value: function(e, t) {
                    var n = this;
                    if (n.debugMode) {
                        var i = t instanceof Error ? t.message : t.toString();
                        console[e](i)
                    }
                    if (n.rethrowError) throw t
                }
            }], [{
                key: "moduleName",
                get: function() {
                    return "ErrorModule"
                }
            }, {
                key: "properties",
                get: function() {
                    return {
                        rethrowError: {
                            value: !0,
                            type: "boolean",
                            reflectToAttribute: !1
                        },
                        debugMode: {
                            value: !0,
                            type: "boolean",
                            reflectToAttribute: !1
                        }
                    }
                }
            }]), e
        }(),
        n = function() {
            function e() {
                babelHelpers.classCallCheck(this, e)
            }
            return babelHelpers.createClass(e, [{
                key: "getBindings",
                value: function(e) {
                    var t = this,
                        n = 0,
                        i = {},
                        r = function(e) {
                            if (e instanceof HTMLElement) return t.parseAttributes(e);
                            var n = t.parseProperty(e.data, "textContent", e);
                            return n ? (e.parentNode === t.ownerElement.$.content && (n.value = "" !== t.ownerElement.$.html ? t.ownerElement.$.html : void 0, t.ownerElement.innerHTML = ""), {
                                textContent: n
                            }) : void 0
                        }(e);
                    r && (i.data = r), i.node = e, e.firstChild && (i.children = {});
                    for (var a = e.firstChild; a; a = a.nextSibling) i.children[n++] = t.getBindings(a);
                    return i
                }
            }, {
                key: "parseAttributes",
                value: function(t) {
                    for (var n = this, i = void 0, r = 0; r < t.attributes.length; r++) {
                        var a = t.attributes[r],
                            o = a.name,
                            l = a.value;
                        e.cache["toCamelCase" + o] || (e.cache["toCamelCase" + o] = c.Core.toCamelCase(o));
                        var s = e.cache["toCamelCase" + o];
                        if (o.indexOf("(") >= 0) {
                            var u = o.substring(1, o.length - 1);
                            n.ownerElement.templateListeners[t.getAttribute("data-id") + "." + u] = l, t.removeAttribute(o)
                        } else {
                            var d = n.parseProperty(l, o, t);
                            d && (i || (i = {}), i[s] = d)
                        }
                    }
                    return i
                }
            }, {
                key: "parseProperty",
                value: function(t, n, i) {
                    if (t && t.length) {
                        for (var r = this, a = void 0, o = t.length, l = 0, s = 0, u = 0, d = !0; s < o;) {
                            l = t.indexOf("{{", s);
                            var p = t.indexOf("[[", s),
                                v = "}}";
                            if (p >= 0 && (l < 0 || p < l) && (l = p, d = !1, v = "]]"), (u = l < 0 ? -1 : t.indexOf(v, l + 2)) < 0) return;
                            a = a || {};
                            var f = t.slice(l + 2, u).trim(),
                                h = f;
                            d && function() {
                                var t = function(t) {
                                    if (a.value = t, i.$ && i.$.isNativeElement) {
                                        e.cache["toDash" + n] || (e.cache["toDash" + n] = c.Core.toDash(n));
                                        var r = e.cache["toDash" + n];
                                        i.$.getAttributeValue(r, a.type) !== a.value && i.$.setAttributeValue(r, a.value, a.type)
                                    }
                                };
                                if (f.indexOf("::") >= 0) {
                                    var o = f.indexOf("::"),
                                        l = f.substring(o + 2);
                                    r.ownerElement["$" + i.getAttribute("data-id")].listen(l, function() {
                                        t(i[n]);
                                        var e = a.name.substring(0, a.name.indexOf("::"));
                                        r.updateBoundProperty(e, a)
                                    })
                                }
                                if (i instanceof window.JQX.BaseElement) {
                                    e.cache["toDash" + n] || (e.cache["toDash" + n] = c.Core.toDash(n));
                                    var s = e.cache["toDash" + n];
                                    r.ownerElement["$" + i.getAttribute("data-id")].listen(s + "-changed", function() {
                                        var e = event.detail;
                                        t(e.newValue), r.updateBoundProperty(n, a)
                                    })
                                }
                            }(), a.name = h, s = u + 2
                        }
                        var y = a.name,
                            m = r.ownerElement._properties[y];
                        return a.twoWay = d, a.ready = !1, r.ownerElement.boundProperties[y] = !0, m ? (a.type = m.type, a.reflectToAttribute = m.reflectToAttribute) : (a.type = "string", a.reflectToAttribute = !0), a
                    }
                }
            }, {
                key: "updateTextNodes",
                value: function() {
                    var e = this;
                    e.updateTextNode(e.ownerElement.shadowRoot || e.ownerElement, e.ownerElement.bindings, e.ownerElement)
                }
            }, {
                key: "updateTextNode",
                value: function(e, t, n) {
                    var i = this;
                    if (t) {
                        for (var r = 0, a = e.firstChild; a && t.children; a = a.nextSibling) i.updateTextNode(a, t.children[r++], n);
                        if (t && t.data)
                            for (var o in t.data) {
                                var l = t.data[o],
                                    s = l.name;
                                "textContent" === o && l.twoWay && !l.updating && void 0 !== l.value && (n[s] = l.value)
                            }
                    }
                }
            }, {
                key: "updateBoundProperty",
                value: function(e, t) {
                    if (!t.updating) {
                        var n = this,
                            i = n.ownerElement;
                        t.updating = !0, i[e] = t.value, t.updating = !1
                    }
                }
            }, {
                key: "updateBoundNodes",
                value: function(e) {
                    var t = this;
                    t.updateBoundNode(t.ownerElement.shadowRoot || t.ownerElement, t.ownerElement.bindings, t.ownerElement, e)
                }
            }, {
                key: "updateBoundNode",
                value: function(t, n, i, r) {
                    var a = this;
                    if (n) {
                        for (var o = 0, l = t.firstChild; l && n.children; l = l.nextSibling) a.updateBoundNode(l, n.children[o++], i, r);
                        if (n && n.data) {
                            for (var s in n.data) {
                                (function(o) {
                                    var l = n.data[o],
                                        s = l.name;
                                    if (l.updating) return "continue";
                                    if (void 0 !== r && r !== s) return "continue";
                                    if (l.value = i[s], "innerHTML" === s ? t[o].toString().trim() !== i[s].toString().trim() && (t[o] = l.value.toString().trim()) : t[o] = l.value, t.$ && t.$.isNativeElement) {
                                        e.cache["toDash" + o] || (e.cache["toDash" + o] = c.Core.toDash(o));
                                        var u = e.cache["toDash" + o],
                                            d = t.$.getAttributeValue(u, l.type);
                                        !l.reflectToAttribute || d === l.value && l.ready || t.$.setAttributeValue(u, l.value, l.type), l.reflectToAttribute || t.$.setAttributeValue(u, null, l.type)
                                    }
                                    if (!l.ready) {
                                        if (t instanceof window.JQX.BaseElement) {
                                            var p = t._properties[o];
                                            p.isUpdating = !0, l.reflectToAttribute && t.$.setAttributeValue(p.attributeName, l.value, l.type), l.reflectToAttribute || t.$.setAttributeValue(p.attributeName, null, l.type), p.isUpdating = !1
                                        }
                                        if (l.twoWay) {
                                            var v = function(n) {
                                                if (l.value = n, t.$ && t.$.isNativeElement) {
                                                    e.cache["toDash" + o] || (e.cache["toDash" + o] = c.Core.toDash(o));
                                                    var i = e.cache["toDash" + o],
                                                        r = t.$.getAttributeValue(i, l.type);
                                                    l.reflectToAttribute && r !== l.value && t.$.setAttributeValue(i, l.value, l.type), l.reflectToAttribute || t.$.setAttributeValue(i, null, l.type)
                                                }
                                            };
                                            if (l.name.indexOf("::") >= 0) {
                                                var f = l.name.indexOf("::"),
                                                    h = l.name.substring(f + 2);
                                                a.ownerElement["$" + t.getAttribute("data-id")].listen(h, function() {
                                                    v(t[o]), a.updateBoundProperty(o, l)
                                                })
                                            }
                                            if (t instanceof window.JQX.BaseElement) {
                                                e.cache["toDash" + o] || (e.cache["toDash" + o] = c.Core.toDash(o));
                                                var y = e.cache["toDash" + o];
                                                a.ownerElement["$" + t.getAttribute("data-id")].listen(y + "-changed", function() {
                                                    var e = event.detail;
                                                    v(e.newValue), a.updateBoundProperty(o, l)
                                                })
                                            }
                                        }
                                    }
                                    l.ready = !0
                                })(s)
                            }
                        }
                    }
                }
            }], [{
                key: "clearCache",
                value: function() {
                    this.cache = {}
                }
            }, {
                key: "moduleName",
                get: function() {
                    return "BindingModule"
                }
            }]), e
        }(),
        i = function() {
            function e() {
                babelHelpers.classCallCheck(this, e)
            }
            return babelHelpers.createClass(e, null, [{
                key: "isBoolean",
                value: function(e) {
                    return "boolean" == typeof e
                }
            }, {
                key: "isFunction",
                value: function(e) {
                    return !!(e && e.constructor && e.call && e.apply)
                }
            }, {
                key: "isArray",
                value: function(e) {
                    return Array.isArray(e)
                }
            }, {
                key: "isObject",
                value: function(e) {
                    var t = this;
                    return e && ("object" === (void 0 === e ? "undefined" : babelHelpers.typeof(e)) || t.isFunction(e)) || !1
                }
            }, {
                key: "isDate",
                value: function(e) {
                    return e instanceof Date
                }
            }, {
                key: "isString",
                value: function(e) {
                    return "string" == typeof e
                }
            }, {
                key: "isNumber",
                value: function(e) {
                    return "number" == typeof e
                }
            }, {
                key: "getType",
                value: function(e) {
                    var t = this,
                        n = ["Boolean", "Number", "String", "Function", "Array", "Date", "Object"],
                        i = n.find(function(n) {
                            if (t["is" + n](e)) return n
                        });
                    return i ? i.toLowerCase() : void 0
                }
            }, {
                key: "toArray",
                value: function(e) {
                    var t = this,
                        n = [];
                    if (null === e || void 0 === e || !t.isString(e)) return [];
                    if (e.indexOf("{") >= 0) try {
                        return JSON.parse(e)
                    } catch (e) {
                        return void console.log(e)
                    }
                    var i = e.substring(1, e.length - 1);
                    return function(e, t) {
                        t = t.split(",");
                        for (var n = 0; n < t.length; n += 1) e[n] = t[n].trim();
                        e
                    }(n, i), n
                }
            }]), e
        }(),
        r = function() {
            function e() {
                babelHelpers.classCallCheck(this, e)
            }
            return babelHelpers.createClass(e, null, [{
                key: "toCamelCase",
                value: function(e) {
                    return e.replace(/-([a-z])/g, function(e) {
                        return e[1].toUpperCase()
                    })
                }
            }, {
                key: "toDash",
                value: function(e) {
                    return e.split(/(?=[A-Z])/).join("-").toLowerCase()
                }
            }, {
                key: "escapeHTML",
                value: function(e) {
                    var t = {
                        "&": "&amp;",
                        "<": "&lt;",
                        ">": "&gt;",
                        '"': "&quot;",
                        "'": "&#39;",
                        "/": "&#x2F;",
                        "`": "&#x60;",
                        "=": "&#x3D;"
                    };
                    return String(e).replace(/[&<>"'`=\/]/g, function(e) {
                        return t[e]
                    })
                }
            }, {
                key: "CSSVariablesSupport",
                value: function() {
                    return window.CSS && window.CSS.supports && window.CSS.supports("--fake-var", 0)
                }
            }, {
                key: "assign",
                value: function(e, t) {
                    var n = this,
                        i = function(e) {
                            return e && "object" === (void 0 === e ? "undefined" : babelHelpers.typeof(e)) && !Array.isArray(e) && null !== e
                        },
                        r = Object.assign({}, e);
                    return i(e) && i(t) && Object.keys(t).forEach(function(a) {
                        i(t[a]) && a in e ? r[a] = n.assign(e[a], t[a]) : Object.assign(r, babelHelpers.defineProperty({}, a, t[a]))
                    }), r
                }
            }, {
                key: "html",
                value: function(e, t) {
                    var n = this,
                        i = "",
                        r = e.childNodes;
                    if (t) {
                        return void(e.innerHTML = t.replace(/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, "<$1></$2>"))
                    }
                    for (var a, o = 0, l = r.length; o < l && (a = r[o]); o++) {
                        var s = ["strong"];
                        if (a instanceof HTMLElement || a.tagName && s.indexOf(a.tagName.toLowerCase()) >= 0) {
                            for (var u, d = a.tagName.toLowerCase(), p = a.attributes, v = "<" + d, f = 0; u = p[f]; f++) v += " " + u.name + '="' + u.value.replace(/[&\u00A0"]/g, c.Core.escapeHTML) + '"';
                            v += ">";
                            ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"][d] && (i += v), i = i + v + n.html(a) + "</" + d + ">"
                        } else i += a.data.replace(/[&\u00A0<>]/g, c.Core.escapeHTML)
                    }
                    return i
                }
            }]), e
        }(),
        a = [],
        o = function() {
            function e() {
                babelHelpers.classCallCheck(this, e)
            }
            return babelHelpers.createClass(e, null, [{
                key: "observe",
                value: function(t) {
                    a.push(t), e.interval && clearInterval(e.interval), e.interval = setInterval(function() {
                        e.styleHandler()
                    }, 100)
                }
            }, {
                key: "styleHandler",
                value: function() {
                    for (var e = 0; e < a.length; e++) {
                        var t = a[e],
                            n = document.defaultView.getComputedStyle(t, null),
                            i = ["display", "visibility", "font-size", "font-family", "font-style", "font-weight"];
                        if (!t._styleInfo) {
                            t._styleInfo = [];
                            for (var r = 0; r < i.length; r++) {
                                var o = i[r];
                                t._styleInfo[o] = n[o]
                            }
                            return
                        }
                        for (var l = [], s = 0; s < i.length; s++) {
                            var u = i[s];
                            t._styleInfo[u] !== n[u] && (l[u] = {
                                oldValue: t._styleInfo[u],
                                value: n[u]
                            }, l.length++), t._styleInfo[u] = n[u]
                        }
                        l.length > 0 && (t.$.fireEvent("styleChanged", {
                            styleProperties: l
                        }), l.display && t.$.fireEvent("resize", {
                            bubbles: !1,
                            cancelable: !0
                        }))
                    }
                }
            }, {
                key: "disconnect",
                value: function(t) {
                    e.interval && clearInterval(e.interval), a = a.splice(a.indexOf(t), 1), a.length > 0 && (e.interval = setInterval(function() {
                        e.styleHandler()
                    }, 100))
                }
            }]), e
        }(),
        l = ["resize", "down", "up", "move", "tap", "taphold", "swipeleft", "swiperight", "swipetop", "swipebottom"],
        s = function() {
            function e(t) {
                babelHelpers.classCallCheck(this, e);
                var n = this;
                n.target = t, n.$target = new d(t), n.$document = new d(document), n.id = n.target === document ? "" : n.target.id || n.target.getAttribute("data-id");
                var i = {
                    handlers: {},
                    boundEventTypes: [],
                    listen: n.listen.bind(n),
                    unlisten: n.unlisten.bind(n)
                };
                return n.tapHoldDelay = 750, n.swipeMin = 10, n.swipeMax = 5e3, n.swipeDelay = 1e3, n.tapHoldDelay = 750, n.inputEventProperties = ["clientX", "clientY", "pageX", "pageY", "screenX", "screenY"], l.forEach(function(e) {
                    i[e] = function(t) {
                        i.handlers[e] = t
                    }, n[e] = function(e) {
                        if (!i.handlers[e.type]) {
                            if (("mousemove" === e.type || "pointermove" === e.type || "touchmove" === e.type) && i.handlers.move) {
                                var t = n.createEvent(e, "move");
                                i.handlers.move(t)
                            }
                            return !0
                        }
                        return i.handlers[e.type](e)
                    }
                }), n.listen(), n.handlers = i.handlers, i
            }
            return babelHelpers.createClass(e, [{
                key: "listen",
                value: function(e) {
                    var t = this;
                    if ("resize" === e && !t.target.resizeTrigger && t.target !== document && t.target !== window) {
                        var n = document.createElement("div");
                        n.className = "jqx-resize-trigger-container", n.innerHTML = '<div class="jqx-resize-trigger-container"><div class="jqx-resize-trigger"></div></div><div class="jqx-resize-trigger-container"><div class="jqx-resize-trigger-shrink"></div></div>', t.target.appendChild(n), t.target.resizeTrigger = n;
                        var i = n.childNodes[0],
                            r = i.childNodes[0],
                            a = n.childNodes[1],
                            o = function() {
                                r.style.width = "100000px", r.style.height = "100000px", i.scrollLeft = 1e5, i.scrollTop = 1e5, a.scrollLeft = 1e5, a.scrollTop = 1e5
                            },
                            l = void 0,
                            s = void 0,
                            u = void 0,
                            d = void 0,
                            c = t.target.offsetWidth,
                            p = t.target.offsetHeight;
                        o(), t.target.resizeHandler = function() {
                            s || (s = requestAnimationFrame(function() {
                                if (s = 0, u = t.target.offsetWidth, d = t.target.offsetHeight, l = u !== c || d !== p, t.target.requiresLayout && (l = !0), l) {
                                    c = u, p = d;
                                    var e = new CustomEvent("resize", {
                                        bubbles: !1,
                                        cancelable: !0
                                    });
                                    t.resize(e), t.target.requiresLayout = !1
                                }
                            })), o()
                        }, i.addEventListener("scroll", t.target.resizeHandler), a.addEventListener("scroll", t.target.resizeHandler)
                    }
                    if (!t.isListening) {
                        if (t.isListening = !0, t.isPressed = !1, t.isReleased = !1, t.isInBounds = !1, window.PointerEvent) t.$target.listen("pointerdown.inputEvents" + t.id, t.pointerDown.bind(t)), t.$target.listen("pointerup.inputEvents" + t.id, t.pointerUp.bind(t)), t.$target.listen("pointermove.inputEvents" + t.id, t.pointerMove.bind(t));
                        else {
                            "ontouchstart" in window && (t.$target.listen("touchmove.inputEvents" + t.id, t.touchMove.bind(t)), t.$target.listen("touchstart.inputEvents" + t.id, t.touchStart.bind(t)), t.$target.listen("touchend.inputEvents" + t.id, t.touchEnd.bind(t)), t.$target.listen("touchcancel.inputEvents" + t.id, t.touchCancel.bind(t))), t.$target.listen("mousedown.inputEvents" + t.id, t.mouseDown.bind(t)), t.$target.listen("mouseup.inputEvents" + t.id, t.mouseUp.bind(t)), t.$target.listen("mousemove.inputEvents" + t.id, t.mouseMove.bind(t)), t.$target.listen("mouseleave.inputEvents" + t.id, t.mouseLeave.bind(t))
                        }
                        t.$document.listen("mouseup.inputEvents" + t.id, t.handleDocumentUp.bind(t))
                    }
                }
            }, {
                key: "unlisten",
                value: function(e) {
                    var t = this;
                    if (t.isListening = !1, window.PointerEvent) t.$target.unlisten("pointerdown.inputEvents" + t.id), t.$target.unlisten("pointerup.inputEvents" + t.id), t.$target.unlisten("pointermove.inputEvents" + t.id);
                    else {
                        "ontouchstart" in window && (t.$target.unlisten("touchstart.inputEvents" + t.id), t.$target.unlisten("touchmove.inputEvents" + t.id), t.$target.unlisten("touchend.inputEvents" + t.id), t.$target.unlisten("touchcancel.inputEvents" + t.id)), t.$target.unlisten("mousedown.inputEvents" + t.id), t.$target.unlisten("mouseup.inputEvents" + t.id), t.$target.unlisten("mousemove.inputEvents" + t.id), t.$target.unlisten("mouseleave.inputEvents" + t.id)
                    }
                    if (t.$document.unlisten("mouseup.inputEvents" + t.id, t.handleDocumentUp), "resize" === e && t.target.resizeTrigger) {
                        var n = t.target.resizeTrigger,
                            i = n.childNodes[0],
                            r = n.childNodes[1];
                        i.removeEventListener("scroll", t.target.resizeHandler), r.removeEventListener("scroll", t.target.resizeHandler), t.target.resizeHandler = null, t.target.removeChild(n), delete t.target.resizeTrigger
                    }
                }
            }, {
                key: "handleDocumentUp",
                value: function(e) {
                    var t = this;
                    t.isPressed = !1, t.isReleased = !1, t.resetSwipe(e)
                }
            }, {
                key: "createEvent",
                value: function(e, t) {
                    var n = this,
                        i = e.touches,
                        r = e.changedTouches,
                        a = i && i.length ? i[0] : r && r.length ? r[0] : void 0,
                        o = new CustomEvent(t, {
                            bubbles: !0,
                            cancelable: !0
                        });
                    if (o.originalEvent = e, a) {
                        for (var l = 0; l < n.inputEventProperties.length; l++) {
                            var s = n.inputEventProperties[l];
                            o[s] = a[s]
                        }
                        return o
                    }
                    for (var u in e) u in o || (o[u] = e[u]);
                    return o
                }
            }, {
                key: "fireTap",
                value: function(e) {
                    var t = this;
                    if (clearTimeout(this.tapHoldTimeout), !this.tapHoldFired && this.isInBounds) {
                        var n = t.createEvent(e, "tap");
                        t.tap(n)
                    }
                }
            }, {
                key: "initTap",
                value: function(e) {
                    var t = this;
                    t.isInBounds = !0, t.tapHoldFired = !1, t.tapHoldTimeout = setTimeout(function() {
                        if (t.isInBounds) {
                            t.tapHoldFired = !0;
                            var n = t.createEvent(e, "taphold");
                            t.taphold(n)
                        }
                    }, t.tapHoldDelay)
                }
            }, {
                key: "pointerDown",
                value: function(e) {
                    return this.handleDown(e)
                }
            }, {
                key: "mouseDown",
                value: function(e) {
                    var t = this;
                    if (!(t.isPressed || t.touchStartTime && new Date - t.touchStartTime < 500)) return t.handleDown(e)
                }
            }, {
                key: "touchStart",
                value: function(e) {
                    var t = this;
                    return t.touchStartTime = new Date, t.isTouchMoved = !0, t.handleDown(e)
                }
            }, {
                key: "mouseUp",
                value: function(e) {
                    var t = this;
                    if (!(t.isReleased || t.touchEndTime && new Date - t.touchEndTime < 500)) return t.handleUp(e)
                }
            }, {
                key: "handleDown",
                value: function(e) {
                    var t = this;
                    t.isReleased = !1, t.isPressed = !0;
                    var n = t.createEvent(e, "down");
                    return (t.handlers.tap || t.handlers.taphold) && t.initTap(n), (t.handlers.swipeleft || t.handlers.swiperight || t.handlers.swipetop || t.handlers.swipebottom) && t.initSwipe(n), t.down(n)
                }
            }, {
                key: "handleUp",
                value: function(e) {
                    var t = this;
                    t.isReleased = !0, t.isPressed = !1;
                    var n = t.createEvent(e, "up"),
                        i = t.up(n);
                    return (t.handlers.tap || t.handlers.taphold) && t.fireTap(n), t.resetSwipe(n), i
                }
            }, {
                key: "handleMove",
                value: function(e) {
                    var t = this,
                        n = t.move(e);
                    return t.isPressed && (t._maxSwipeVerticalDistance = Math.max(t._maxSwipeVerticalDistance, Math.abs(t._startY - e.pageY)), t._maxSwipeHorizontalDistance = Math.max(t._maxSwipeHorizontalDistance, Math.abs(t._startX - e.pageX)), n = t.handleSwipeEvents(e)), n
                }
            }, {
                key: "touchEnd",
                value: function(e) {
                    var t = this;
                    return t.touchEndTime = new Date, t.handleUp(e)
                }
            }, {
                key: "pointerUp",
                value: function(e) {
                    return this.handleUp(e)
                }
            }, {
                key: "touchCancel",
                value: function(e) {
                    this.touchEnd(e)
                }
            }, {
                key: "mouseLeave",
                value: function() {
                    this.isInBounds = !1
                }
            }, {
                key: "mouseMove",
                value: function(e) {
                    var t = this;
                    if (!t.isTouchMoved) return t.handleMove(e)
                }
            }, {
                key: "pointerMove",
                value: function(e) {
                    return this.handleMove(e)
                }
            }, {
                key: "touchMove",
                value: function(e) {
                    for (var t = this, n = e.touches, i = e.changedTouches, r = n && n.length ? n[0] : i && i.length ? i[0] : void 0, a = 0; a < t.inputEventProperties.length; a++) {
                        var o = t.inputEventProperties[a];
                        e[o] = r[o]
                    }
                    return t.isTouchMoved = !0, t.handleMove(e)
                }
            }, {
                key: "handleSwipeEvents",
                value: function(e) {
                    var t = this,
                        n = !0;
                    return (t.handlers.swipetop || t.handlers.swipebottom) && (n = this.handleVerticalSwipeEvents(e)), n === !1 ? n : ((t.handlers.swipeleft || t.handlers.swiperight) && (n = this.handleHorizontalSwipeEvents(e)), n)
                }
            }, {
                key: "handleVerticalSwipeEvents",
                value: function(e) {
                    var t = void 0,
                        n = void 0;
                    return t = e.pageY, n = t - this._startY, this.swiped(e, n, "vertical")
                }
            }, {
                key: "handleHorizontalSwipeEvents",
                value: function(e) {
                    var t = void 0,
                        n = void 0;
                    return t = e.pageX, n = t - this._startX, this.swiped(e, n, "horizontal")
                }
            }, {
                key: "swiped",
                value: function(e, t, n) {
                    var i = this;
                    if (n = n || 0, Math.abs(t) >= i.swipeMin && !i._swipeEvent && !i._swipeLocked) {
                        var r = t < 0 ? "swipeleft" : "swiperight";
                        if ("horizontal" === n ? i._swipeEvent = i.createEvent(e, r) : (r = t < 0 ? "swipetop" : "swipebottom", i._swipeEvent = i.createEvent(e, t < 0 ? "swipetop" : "swipebottom")), i[r] && (i[r](this._swipeEvent), Math.abs(t) <= this.swipeMax)) return e.stopImmediatePropagation(), !1
                    }
                    return !0
                }
            }, {
                key: "resetSwipe",
                value: function() {
                    this._swipeEvent = null, clearTimeout(this._swipeTimeout)
                }
            }, {
                key: "initSwipe",
                value: function(e) {
                    var t = this;
                    t._maxSwipeVerticalDistance = 0, t._maxSwipeHorizontalDistance = 0, t._startX = e.pageX, t._startY = e.pageY, t._swipeLocked = !1, t._swipeEvent = null, t._swipeTimeout = setTimeout(function() {
                        t._swipeLocked = !0
                    }, t.swipeDelay)
                }
            }]), e
        }(),
        u = function() {
            function e(t, n, i) {
                function r() {
                    var e, t;
                    h.amplitude && (e = Date.now() - d, t = -h.amplitude * Math.exp(-e / f), t > .5 || t < -.5 ? (w(h.targetValue + t), requestAnimationFrame(r)) : w(h.targetValue))
                }
                babelHelpers.classCallCheck(this, e);
                var a = this,
                    o = /(iphone|ipod|ipad|android|iemobile|blackberry|bada)/.test(window.navigator.userAgent.toLowerCase());
                a.inputEvents = new s(t), a.horizontalScrollBar = n, a.verticalScrollBar = i;
                var l = void 0,
                    u = void 0,
                    d = void 0,
                    c = void 0,
                    p = void 0,
                    v = void 0,
                    f = 325,
                    h = void 0,
                    y = function(e) {
                        return {
                            amplitude: 0,
                            delta: 0,
                            initialValue: 0,
                            min: 0,
                            max: e.max,
                            previousValue: 0,
                            pointerPosition: 0,
                            targetValue: 0,
                            scrollBar: e,
                            value: 0,
                            velocity: 0
                        }
                    },
                    m = y(n),
                    g = y(i),
                    b = function() {
                        p = Date.now(), v = p - d, d = p;
                        var e = function(e) {
                            e.delta = e.value - e.previousValue, e.previousValue = e.value, e.velocity = 1e3 * e.delta / (1 + v), e.amplitude = .8 * e.velocity + .2 * e.amplitude
                        };
                        e(g), e(m)
                    },
                    w = function(e) {
                        return h.value = e > h.max ? h.max : e < h.min ? h.min : e, h.scrollBar.value = h.value, e > h.max ? "max" : e < h.min ? "min" : "value"
                    };
                a.inputEvents.down(function(e) {
                    if (o) {
                        u = !0, l = !1;
                        var t = function(e, t) {
                            e.amplitude = 0, e.pointerPosition = t, e.previousValue = e.value, e.value = e.scrollBar.value, e.initialValue = e.value, e.max = e.scrollBar.max
                        };
                        t(g, e.clientY), t(m, e.clientX), d = Date.now(), clearInterval(c), c = setInterval(b, 100)
                    }
                }), a.inputEvents.up(function() {
                    if (!u) return !0;
                    clearInterval(c);
                    var e = function(e) {
                        h = e, e.targetValue = Math.round(e.value + e.amplitude), d = Date.now(), requestAnimationFrame(r)
                    };
                    g.amplitude > 10 || g.amplitude < -10 ? e(g) : (m.amplitude > 10 || m.amplitude < -10) && e(m), u = !1
                }), a.inputEvents.move(function(e) {
                    if (!u) return !0;
                    if (l && (e.originalEvent.preventDefault(), e.originalEvent.stopPropagation()), m.visible = n.offsetHeight > 0, g.visible = i.offsetWidth > 0, u && (m.visible || g.visible)) {
                        g.delta = g.pointerPosition - e.clientY, m.delta = m.pointerPosition - e.clientX;
                        var t = "value",
                            r = function(e, n, i) {
                                return e.delta > 2 || e.delta < -2 ? (h = e, t = w(e.value + e.delta), e.pointerPosition = n, b(), "min" === t && 0 === e.initialValue || ("max" === t && e.initialValue === e.max || (!e.visible || (i.originalEvent.preventDefault(), i.originalEvent.stopPropagation(), l = !0, !1)))) : null
                            },
                            a = r(g, e.clientY, e);
                        if (null !== a) return a;
                        var o = r(m, e.clientX, e);
                        if (null !== o) return o;
                        e.originalEvent.preventDefault()
                    }
                }), a.inputEvents.listen()
            }
            return babelHelpers.createClass(e, [{
                key: "scrollWidth",
                get: function() {
                    var e = this;
                    return e.horizontalScrollBar ? e.horizontalScrollBar.max : -1
                },
                set: function(e) {
                    var t = this;
                    t.horizontalScrollBar && (t.horizontalScrollBar.max = e)
                }
            }, {
                key: "scrollHeight",
                get: function() {
                    var e = this;
                    return e.verticalScrollBar ? e.verticalScrollBar.max : -1
                },
                set: function(e) {
                    var t = this;
                    t.verticalScrollBar && (t.verticalScrollBar.max = e)
                }
            }, {
                key: "scrollLeft",
                get: function() {
                    var e = this;
                    return e.horizontalScrollBar ? e.horizontalScrollBar.value : -1
                },
                set: function(e) {
                    var t = this;
                    t.horizontalScrollBar && (t.horizontalScrollBar.value = e)
                }
            }, {
                key: "scrollTop",
                get: function() {
                    var e = this;
                    return e.verticalScrollBar ? e.verticalScrollBar.value : -1
                },
                set: function(e) {
                    var t = this;
                    t.verticalScrollBar && (t.verticalScrollBar.value = e)
                }
            }, {
                key: "vScrollBar",
                get: function() {
                    return this.verticalScrollBar
                }
            }, {
                key: "hScrollBar",
                get: function() {
                    return this.horizontalScrollBar
                }
            }]), babelHelpers.createClass(e, [{
                key: "unlisten",
                value: function() {
                    var e = this;
                    e.inputEvents && e.inputEvents.unlisten(), delete e.inputEvents
                }
            }]), e
        }(),
        d = function() {
            function e(t) {
                babelHelpers.classCallCheck(this, e), this.events = {}, this.handlers = {}, this.element = t
            }
            return babelHelpers.createClass(e, [{
                key: "hasClass",
                value: function(e) {
                    return this.element.className.indexOf(e) >= 0
                }
            }, {
                key: "addClass",
                value: function(e) {
                    var t;
                    (t = this.element.classList).add.apply(t, babelHelpers.toConsumableArray(e.split(" ")))
                }
            }, {
                key: "removeClass",
                value: function(e) {
                    var t, n = this;
                    (t = n.element.classList).remove.apply(t, babelHelpers.toConsumableArray(e.split(" "))), "" === n.element.className && n.element.removeAttribute("class")
                }
            }, {
                key: "dispatch",
                value: function(e) {
                    for (var t = this, n = t.events[e.type], i = 0; i < n.length; i++) {
                        var r = n[i];
                        if (e.namespace = r.namespace, e.context = r.context, e.defaultPrevented) break;
                        var a = r.handler.apply(t.element, [e]);
                        if (void 0 !== a && (e.result = a, a === !1)) {
                            e.preventDefault(), e.stopPropagation();
                            break
                        }
                    }
                    return e.result
                }
            }, {
                key: "fireEvent",
                value: function(e, t, n) {
                    var i = this;
                    n || (n = {
                        bubbles: !0,
                        cancelable: !0
                    }), n.detail = t || {};
                    var r = new CustomEvent(e, n);
                    r.originalStopPropagation = r.stopPropagation, r.stopPropagation = function() {
                        return r.isPropagationStopped = !0, r.originalStopPropagation()
                    }, i.dispatchEvent(r)
                }
            }, {
                key: "dispatchEvent",
                value: function(e) {
                    var t = this,
                        n = e.type,
                        i = t.element.context;
                    t.element.context = document, t.element["on" + n] ? t.element["on" + n](e) : t.element.dispatchEvent(e), t.element.context = i
                }
            }, {
                key: "listen",
                value: function(e, t) {
                    var n = this,
                        i = e.split("."),
                        r = i.slice(1).join("."),
                        a = i[0];
                    n.events[a] || (n.events[a] = []);
                    var o = {
                        type: a,
                        handler: t,
                        context: n.element,
                        namespace: r
                    };
                    l.indexOf(a) >= 0 && (n.inputEvents || (n.inputEvents = new s(n.element)), n.inputEvents[a](function(e) {
                        n.dispatchEvent(e)
                    }), n.inputEvents.boundEventTypes.push(a), n.inputEvents.listen(a)), 0 === n.events[a].length && (n.handlers[a] = n.dispatch.bind(n), n.element.addEventListener(a, n.handlers[a], !1)), n.events[a].push(o)
                }
            }, {
                key: "unlisten",
                value: function(e) {
                    var t = this,
                        n = e.split("."),
                        i = n.slice(1).join("."),
                        r = n[0],
                        a = t.events[r];
                    if (t.inputEvents && t.inputEvents.boundEventTypes.indexOf(r) >= 0 && (t.inputEvents.boundEventTypes.splice(t.inputEvents.boundEventTypes.indexOf(r), 1), 0 === t.inputEvents.boundEventTypes.length && t.inputEvents.unlisten(r)), a) {
                        for (var o = 0; o < a.length; o++)
                            if ("" !== i) {
                                var l = a.findIndex(function(e) {
                                    return e.namespace === i
                                });
                                a.splice(l, 1)
                            } else a = [];
                        0 === a.length && (t.element.removeEventListener(r, t.handlers[r]), t.events[r] = [], delete t.handlers[r])
                    }
                }
            }, {
                key: "getAttributeValue",
                value: function(e, t) {
                    var n = this,
                        i = n.element.getAttribute(e);
                    if (n.isNativeElement) return n.deserialize(i, t);
                    var r = n.element.propertyByAttributeName[e];
                    return void 0 === r.deserialize ? n.deserialize(i, t, r.nullable) : n.element[r.deserialize](i)
                }
            }, {
                key: "setAttributeValue",
                value: function(e, t, n) {
                    var i = this,
                        r = void 0,
                        a = !1;
                    if (i.isNativeElement) {
                        if (r = i.serialize(t, n), "boolean" === n) {
                            var o = ["checked", "selected", "async", "autofocus", "autoplay", "controls", "defer", "disabled", "hidden", "ismap", "loop", "multiple", "open", "readonly", "required", "scoped"];
                            if (o.indexOf(e) >= 0) return void(t ? i.element.setAttribute(e, "") : i.element.removeAttribute(e))
                        }
                    } else {
                        var l = i.element.propertyByAttributeName[e];
                        a = l.nullable, r = l.serialize ? i.element[l.serialize](t) : i.serialize(t, n, a)
                    }
                    void 0 === r ? i.element.removeAttribute(e) : i.element.setAttribute(e, r)
                }
            }, {
                key: "serialize",
                value: function(e, t, n) {
                    if (void 0 === t && (t = c.Types.getType(e)), void 0 !== e && (n || null !== e)) {
                        if (n && null === e) return "null";
                        if ("string" === t) return c.Core.escapeHTML(e);
                        if ("boolean" === t || "bool" === t) {
                            if (e === !0 || "true" === e || 1 === e || "1" === e) return "";
                            if (e === !1 || "false" === e || 0 === e || "0" === e) return
                        }
                        if ("array" === t) return JSON.stringify(e);
                        return ["string", "number", "int", "integer", "float", "date", "any", "function"].indexOf(t) >= 0 ? e.toString() : "object" === t ? JSON.stringify(e) : void 0
                    }
                }
            }, {
                key: "deserialize",
                value: function(e, t, n) {
                    var i = "null" === e;
                    if (void 0 !== e && (!i || n)) {
                        if (i && n) return null;
                        if ("boolean" === t || "bool" === t) return null !== e;
                        if ("number" === t || "float" === t) return "NaN" === e ? NaN : "Infinity" === e ? 1 / 0 : parseFloat(e);
                        if ("int" === t || "integer" === t) return "NaN" === e ? NaN : "Infinity" === e ? 1 / 0 : parseInt(e);
                        if ("string" === t || "any" === t) return e;
                        if ("date" === t) return new Date(e);
                        if ("array" === t) return c.Types.toArray(e);
                        if ("function" === t) {
                            if ("function" == typeof window[e]) return window[e]
                        } else if ("object" === t) {
                            var r = JSON.parse(e);
                            if (r) return r
                        }
                    }
                }
            }, {
                key: "isNativeElement",
                get: function() {
                    return this.element instanceof window.JQX.BaseElement == 0
                }
            }]), e
        }(),
        c = function() {
            function e() {
                babelHelpers.classCallCheck(this, e)
            }
            return babelHelpers.createClass(e, null, [{
                key: "Extend",
                value: function(e) {
                    return new d(e)
                }
            }, {
                key: "Assign",
                value: function(t, n) {
                    e[t] = n
                }
            }, {
                key: "Types",
                get: function() {
                    return i
                }
            }, {
                key: "Core",
                get: function() {
                    return r
                }
            }, {
                key: "Scroll",
                get: function() {
                    return u
                }
            }, {
                key: "InputEvents",
                get: function() {
                    return s
                }
            }]), e
        }(),
        p = c.Extend(document);
    n.cache = {};
    var v = function(e) {
            function t() {
                return babelHelpers.classCallCheck(this, t), babelHelpers.possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
            }
            return babelHelpers.inherits(t, e), babelHelpers.createClass(t, [{
                key: "template",
                value: function() {
                    return "<div></div>"
                }
            }, {
                key: "registered",
                value: function() {
                    var e = this;
                    e.onRegistered && e.onRegistered()
                }
            }, {
                key: "created",
                value: function() {
                    var e = this;
                    e.isReady = !1, e._initElement(e), e._setModuleState("created"), e.onCreated && e.onCreated()
                }
            }, {
                key: "ready",
                value: function() {
                    var e = this;
                    e.onReady && e.onReady()
                }
            }, {
                key: "setup",
                value: function() {
                    var e = this;
                    if (e.context = this, e.isReady) return e._setModuleState("attached"), e.isAttached = !0, e.attached(), e._handleListeners("listen"), void(e.context = document);
                    e.isReady = !0;
                    for (var t = 0; t < e.attributes.length; t += 1) {
                        var n = e.propertyByAttributeName[e.attributes[t].name];
                        if (n) {
                            var i = e.$.getAttributeValue(n.attributeName, n.type),
                                r = i ? i.toString() : "";
                            if (!(r.indexOf("{{") >= 0 || r.indexOf("[[") >= 0) && void 0 !== i && n.value !== i) {
                                if ("number" === c.Types.getType(i) && isNaN(i)) {
                                    var a = e.localize("propertyInvalidValueType", {
                                        name: n.name,
                                        actualType: "string",
                                        type: n.type
                                    });
                                    e.log(a)
                                }
                                n.isUpdatingFromAttribute = !0, e[n.name] = i, n.isUpdatingFromAttribute = !1
                            }
                        }
                    }
                    for (var o in e._properties) {
                        var l = e._properties[o];
                        "innerHTML" === o && l.value === l.defaultValue && (l.value = l.defaultValue = c.Core.html(e)), "boolean" !== l.type && "bool" !== l.type || "false" === e.getAttribute(l.attributeName) && (l.isUpdating = !0, e.setAttribute(l.attributeName, ""), l.isUpdating = !1), l.defaultReflectToAttribute && l.reflectToAttribute && e.$.setAttributeValue(l.attributeName, l.value, l.type)
                    }
                    e.applyTemplate(), e.complete = function() {
                        e._setModuleState("ready"), e.ready(), e.isAttached = !0, e._setModuleState("attached"), e.attached(), e._handleListeners("listen"), 0 !== e.offsetWidth && 0 !== e.offsetHeight || (e.isHidden = !0), e.context = document, e.onCompleted && e.onCompleted(), e.isCompleted = !0
                    };
                    var s = e.querySelectorAll("[data-id]");
                    if (0 === s.length) e.complete();
                    else {
                        e._readyListeners = 0;
                        for (var u = 0; u < s.length; u++) {
                            var d = s[u];
                            if (d instanceof window.JQX.BaseElement) {
                                var p = function() {
                                    0 === --e._readyListeners && (e.complete(), delete e._readyListeners)
                                }.bind(e);
                                d.isCompleted || (e._readyListeners++, d.onCompleted = p)
                            }
                        }
                        0 === e._readyListeners && e.complete()
                    }
                }
            }, {
                key: "visibilityChangedHandler",
                value: function() {
                    var e = this;
                    e.isReady && (0 === e.offsetWidth || 0 === e.offsetHeight ? e.isHidden = !0 : e.isHidden && (e.$.fireEvent("resize", {
                        bubbles: !1,
                        cancelable: !0
                    }), e.isHidden = !1))
                }
            }, {
                key: "checkLayoutChange",
                value: function() {
                    var e = this;
                    e.isReady && (e._offsetWidth === e.offsetWidth && e._offsetHeight === e.offsetHeight || (e.requiresLayout = !0), e._offsetWidth = e.offsetWidth, e._offsetHeight = e.offsetHeight)
                }
            }, {
                key: "attributeChangedCallback",
                value: function(e, t, n) {
                    var i = this,
                        r = i.propertyByAttributeName[e];
                    if (i.checkLayoutChange(), i.visibilityChangedHandler(), r || i.attributeChanged(e, t, n), !(!r || r && r.isUpdating)) {
                        var a = i.$.getAttributeValue(r.attributeName, r.type);
                        void 0 !== n && i[r.name] !== a && (r.isUpdatingFromAttribute = !0, i[r.name] = void 0 !== a ? a : i._properties[r.name].defaultValue, r.isUpdatingFromAttribute = !1)
                    }
                }
            }, {
                key: "attributeChanged",
                value: function(e, t, n) {}
            }, {
                key: "attached",
                value: function() {
                    var e = this;
                    o.observe(e), e.onAttached && e.onAttached()
                }
            }, {
                key: "detached",
                value: function() {
                    var e = this;
                    o.disconnect(e), e._setModuleState("detached"), e.isAttached = !1, e._handleListeners("unlisten"), e.onDetached && e.onDetached()
                }
            }, {
                key: "propertyChangedHandler",
                value: function(e, t, n) {
                    var i = this;
                    t !== n && i.propertyChanged && i.propertyChanged(e, t, n)
                }
            }, {
                key: "_handleListeners",
                value: function(e) {
                    var t = this,
                        n = t.tagName.toLowerCase(),
                        i = t.getStaticMember("listeners"),
                        r = function(i) {
                            for (var r in i) {
                                (function(r) {
                                    var a = r.split("."),
                                        o = a[0],
                                        l = t.$;
                                    if (a[1] && (o = a[1], l = t["$" + a[0]], "document" === a[0])) {
                                        var s = t.id;
                                        "" === s && (s = c.Core.toCamelCase(n)), o = o + "." + s
                                    }
                                    var u = i[r],
                                        d = function(e) {
                                            var n = t.context;
                                            t.context = t, t[u].apply(t, [e]), t.context = n
                                        };
                                    if (!l) return "continue";
                                    l[e](o, d)
                                })(r)
                            }
                        };
                    r(i), r(t.templateListeners)
                }
            }, {
                key: "parseTemplate",
                value: function() {
                    var e = this,
                        t = e.template(),
                        n = document.createDocumentFragment();
                    if ("" === t) return null;
                    var i = document.createElement("div");
                    n.appendChild(i), i.innerHTML = t;
                    var r = i.childNodes;
                    i.parentNode.removeChild(i);
                    for (var a = 0; a < r.length; a++) n.appendChild(r[a]);
                    return n
                }
            }, {
                key: "applyTemplate",
                value: function() {
                    var e = this,
                        t = e.parseTemplate();
                    if (t) {
                        var n = document.importNode(t, !0);
                        if (n.hasChildNodes) {
                            var i = n.childNodes[0],
                                r = function(t, n) {
                                    e["$" + t] = n.$ = c.Extend(n), e.$[t] = n, n.ownerElement = e
                                },
                                a = i;
                            if (i.getElementsByTagName("content").length > 0) {
                                var o = i.getElementsByTagName("content")[0];
                                a = o.parentNode, a.removeChild(o)
                            }
                            var l = n.querySelectorAll("[id]");
                            0 === l.length && (l = n.querySelectorAll("*")), r("root", i), r("content", a), e.$.html = e.innerHTML.toString().trim();
                            for (var s = 0; s < l.length; s += 1) {
                                var u = l[s];
                                "" === u.id && (u.id = "child" + s), r(u.id, u), u.setAttribute("data-id", u.id), e.shadowRoot || u.removeAttribute("id")
                            }
                            for (e.bindings = e.getBindings(n), e.$root.addClass("jqx-container"); e.childNodes.length;) a.appendChild(e.firstChild);
                            e.appendTemplate(n), e.updateTextNodes(), e.updateBoundNodes()
                        }
                    }
                }
            }, {
                key: "appendTemplate",
                value: function(e) {
                    this.appendChild(e)
                }
            }, {
                key: "defineElementModules",
                value: function() {
                    var e = this,
                        t = e.constructor.prototype;
                    t.modules = e.constructor.modules;
                    for (var n = t.modules, i = 0; i < n.length; i += 1) e.addModule(n[i])
                }
            }, {
                key: "watch",
                value: function(e, t) {
                    var n = this;
                    if (null === e || null === t) return void(n._watch = null);
                    n._watch = {
                        properties: e,
                        propertyChangedCallback: t
                    }
                }
            }, {
                key: "unwatch",
                value: function() {
                    this._watch = null
                }
            }, {
                key: "_setModuleState",
                value: function(e, t) {
                    for (var n = this, i = "is" + e.substring(0, 1).toUpperCase() + e.substring(1), r = "on" + e.substring(0, 1).toUpperCase() + e.substring(1), a = 0; a < n.modulesList.length; a++) {
                        var o = n.modulesList[a];
                        o[i] = !0, o[e] && o[e](t), o[r] && o[r](t)
                    }
                }
            }, {
                key: "addModule",
                value: function(e) {
                    var t = this;
                    if (e) {
                        var n = t.modules,
                            i = e.prototype;
                        !e.moduleName && e.name && (e.moduleName = e.name), n.findIndex(function(t) {
                            return e.moduleName === t.moduleName
                        }) === -1 && n.push(e), t.defineModule(e), t.defineElementMethods(i.methodNames, i), t.defineElementProperties(e.properties)
                    }
                }
            }, {
                key: "defineModule",
                value: function(e) {
                    if (!e.isDefined) {
                        e.prototype._initModule = function(e) {
                            this.ownerElement = e
                        };
                        var t = e.properties || {},
                            n = Object.keys(t),
                            i = Object.getOwnPropertyNames(e.prototype);
                        e.prototype.methodNames = i;
                        for (var r = 0; r < n.length; r += 1) ! function(i) {
                            var r = n[i],
                                a = t[r];
                            Object.defineProperty(e.prototype, r, {
                                configurable: !1,
                                enumerable: !0,
                                get: function() {
                                    var e = this;
                                    return e.ownerElement ? e.ownerElement[r] : a.value
                                },
                                set: function(e) {
                                    this.ownerElement[r] = e
                                }
                            })
                        }(r);
                        e.isDefined = !0
                    }
                }
            }, {
                key: "getStaticMember",
                value: function(e) {
                    for (var t = this, n = window.JQX[t.elementName], i = n[e], r = {}, a = Object.getPrototypeOf(n); a[e];) r = c.Core.assign(r, a[e]), a = Object.getPrototypeOf(a);
                    return c.Core.assign(r, i)
                }
            }, {
                key: "defineElement",
                value: function() {
                    var e = this,
                        t = e.constructor.prototype,
                        n = e.getStaticMember("properties"),
                        i = Object.getOwnPropertyNames(t);
                    t.extendedProperties = {}, t.boundProperties = {}, t.templateListeners = {}, e.defineElementModules(), e.defineElementMethods(i, t), e.defineElementProperties(n), t._initElement = function() {
                        var e = this,
                            n = t.extendedProperties,
                            i = Object.keys(n),
                            r = e.modules;
                        e.$ = c.Extend(e), e.$document = p, e.modulesList = [], e._properties = [], e.propertyByAttributeName = [];
                        for (var a = 0; a < r.length; a += 1) {
                            var o = r[a],
                                l = new o;
                            l._initModule(e), e.modulesList.push(l)
                        }
                        for (var s = 0; s < i.length; s += 1) {
                            (function(t) {
                                var r = i[t],
                                    a = n[r],
                                    o = a.value;
                                if (m && "innerHTML" === r && delete e[r], e._properties[r] = {
                                        name: r,
                                        notify: a.notify,
                                        allowedValues: a.allowedValues,
                                        type: a.type,
                                        nullable: a.nullable,
                                        reflectToAttribute: a.reflectToAttribute,
                                        defaultReflectToAttribute: a.defaultReflectToAttribute,
                                        value: o,
                                        readOnly: a.readOnly,
                                        defaultValue: o,
                                        attributeName: a.attributeName,
                                        observer: a.observer,
                                        inherit: a.inherit,
                                        extend: a.extend,
                                        validator: a.validator
                                    }, e.propertyByAttributeName[a.attributeName] = e._properties[r], !a.hasOwnProperty("type")) {
                                    var l = e.localize("propertyUnknownType", {
                                        name: r
                                    });
                                    e.log(l)
                                }
                                if ("any" === a.type) return "continue";
                                var s = c.Types.getType(o);
                                if (void 0 !== o && null !== o && a.type !== s && !a.validator) {
                                    if ("number" === s) {
                                        if (["integer", "int", "float"].findIndex(function(e) {
                                                return e === a.type
                                            }) >= 0) return "continue"
                                    }
                                    var u = e.localize("propertyInvalidValueType", {
                                        name: r,
                                        actualType: s,
                                        type: a.type
                                    });
                                    e.log(u)
                                }
                            })(s)
                        }
                    }, t.registered()
                }
            }, {
                key: "defineElementMethods",
                value: function(e, t) {
                    var n = this,
                        i = n.constructor.prototype,
                        r = function(e, t) {
                            var n = Array.prototype.slice.call(arguments, 2);
                            return function() {
                                if (!this.isReady && "localize" !== t && "log" !== t) {
                                    var i = this.localize("elementNotInDOM");
                                    this.log(i)
                                }
                                for (var r = this, a = 0; a < this.modulesList.length; a++) {
                                    var o = this.modulesList[a];
                                    if (t in o) {
                                        r = o;
                                        break
                                    }
                                }
                                var l = this.context;
                                this.context = this;
                                var s = e.apply(r, n.concat(Array.prototype.slice.call(arguments)));
                                return this.context = l, s
                            }
                        },
                        a = ["constructor", "ready", "created", "attached", "detached", "propertyChangedHandler"];
                    for (var o in e) {
                        (function(n) {
                            var o = e[n];
                            o.startsWith("_") || void 0 !== a.find(function(e) {
                                return e === o
                            }) ? "continue" : i.extendedProperties[o] ? "continue" : c.Types.isFunction(t[o]) ? void(i[o] = r(t[o], o)) : "continue"
                        })(o)
                    }
                }
            }, {
                key: "defineElementProperties",
                value: function(e) {
                    if (e) {
                        var t = this,
                            n = t.constructor.prototype,
                            i = Object.keys(e),
                            r = t.getStaticMember("properties");
                        Object.assign(n.extendedProperties, e);
                        for (var a = function(e, t, n) {
                                var i = e;
                                if (!t.readOnly) {
                                    if (t.allowedValues) {
                                        for (var r = !1, a = 0; a < t.allowedValues.length; a++)
                                            if (t.allowedValues[a] === n) {
                                                r = !0;
                                                break
                                            }
                                        if (!r) {
                                            var o = JSON.stringify(t.allowedValues).replace(/\[|\]/gi, "").replace(",", ", ").replace(/"/gi, "'"),
                                                l = "'" + n + "'",
                                                s = i.localize("propertyInvalidValue", {
                                                    name: t.name,
                                                    actualValue: l,
                                                    value: o
                                                });
                                            return void i.log(s)
                                        }
                                    }
                                    var u = t.name,
                                        d = i._properties[u].value;
                                    if (t.validator && i[t.validator]) {
                                        i.context = i;
                                        var p = i[t.validator](d, n);
                                        void 0 !== p && (n = p), i.context = document
                                    }
                                    if (d !== n) {
                                        if (!t.hasOwnProperty("type")) {
                                            var v = i.localize("propertyUnknownType", {
                                                name: u
                                            });
                                            i.log(v)
                                        }
                                        if (void 0 !== n && null !== n && "any" !== t.type && t.type !== c.Types.getType(n) && !t.validator || null === n && !t.nullable) {
                                            var f = !0;
                                            if ("number" === c.Types.getType(n)) {
                                                ["integer", "int", "float"].findIndex(function(e) {
                                                    return e === t.type
                                                }) >= 0 && (f = !1)
                                            }
                                            if (f) {
                                                var h = i.localize("propertyInvalidValueType", {
                                                    name: u,
                                                    actualType: c.Types.getType(n),
                                                    type: t.type
                                                });
                                                return void i.log(h)
                                            }
                                        }
                                        if (t.isUpdating = !0, i._properties[u].value = n, !t.isUpdatingFromAttribute && t.reflectToAttribute && i.$.setAttributeValue(t.attributeName, n, t.type), i.isReady && i.context !== i) {
                                            i.context = i, i.propertyChangedHandler(u, d, n), i.context = document, i.checkLayoutChange(), t.observer && i[t.observer] && (i.context = i, i[t.observer](d, n), i.context = document), i._watch && i._watch.properties.indexOf(u) >= 0 && i._watch.propertyChangedCallback(u, d, n);
                                            (t.notify || i.boundProperties[u]) && (i.$.fireEvent(t.attributeName + "-changed", {
                                                oldValue: d,
                                                value: n
                                            }), i.boundProperties[u] && i.updateBoundNodes(u))
                                        }
                                        t.isUpdating = !1
                                    }
                                }
                            }, o = 0; o < i.length; o += 1) {
                            (function(t) {
                                var o = i[t],
                                    l = e[o],
                                    s = c.Core.toDash(o),
                                    u = l.type || "any",
                                    d = u.indexOf("?") >= 0 || "any" === u;
                                if (d && "any" !== u && (l.type = u.substring(0, u.length - 1)), l.nullable = d, l.attributeName = s.toLowerCase(), l.name = o, l.reflectToAttribute = void 0 === l.reflectToAttribute || l.reflectToAttribute, l.inherit && r[o] && (l.value = r[o].value), l.extend && r[o] && c.Core.assign(l.value, r[o].value), n.hasOwnProperty(o)) return "continue";
                                Object.defineProperty(n, o, {
                                    configurable: !1,
                                    enumerable: !0,
                                    get: function() {
                                        return this._properties[o].value
                                    },
                                    set: function(e) {
                                        var t = this;
                                        a(t, t._properties[o], e)
                                    }
                                })
                            })(o)
                        }
                    }
                }
            }, {
                key: "properties",
                get: function() {
                    var e = this;
                    return e._properties || (e._properties = []), e._properties
                }
            }, {
                key: "parents",
                get: function() {
                    for (var e = this, t = [], n = e.parentNode; n && 9 !== n.nodeType;) n instanceof HTMLElement == !0 && t.push(n), n = n.parentNode;
                    return t
                }
            }], [{
                key: "properties",
                get: function() {
                    return {
                        disabled: {
                            value: !1,
                            type: "boolean"
                        },
                        rightToLeft: {
                            value: !1,
                            type: "boolean"
                        },
                        messages: {
                            value: {
                                en: {
                                    propertyUnknownType: "'{{name}}' property is with undefined 'type' member!",
                                    propertyInvalidValue: "Invalid '{{name}}' property value! Actual value: {{actualValue}}, Expected value: {{value}}!",
                                    propertyInvalidValueType: "Invalid '{{name}}' property value type! Actual type: {{actualType}}, Expected type: {{type}}!",
                                    elementNotInDOM: "Element does not exist in DOM! Please, add the element to the DOM, before invoking a method.",
                                    moduleUndefined: "Module is undefined."
                                }
                            },
                            reflectToAttribute: !1,
                            type: "object"
                        }
                    }
                }
            }, {
                key: "listeners",
                get: function() {
                    return {}
                }
            }, {
                key: "modules",
                get: function() {
                    return window.JQX.Modules
                }
            }]), t
        }(HTMLElement),
        f = [],
        h = [],
        y = [],
        m = !1,
        g = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    if (g) {
        parseInt(g[2], 10) <= 50 && (m = !0)
    }
    var b = function e() {
        for (var t = 0; t < y.length; t++) y[t]();
        y = [], document.removeEventListener("DOMContentLoaded", e)
    };
    document.addEventListener("DOMContentLoaded", b);
    var w = function(e) {
            function t() {
                return babelHelpers.classCallCheck(this, t), babelHelpers.possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
            }
            return babelHelpers.inherits(t, e), babelHelpers.createClass(t, [{
                key: "createdCallback",
                value: function() {
                    this.created()
                }
            }, {
                key: "attachedCallback",
                value: function() {
                    var e = this;
                    "loading" !== document.readyState ? e.setup() : y.push(function() {
                        this.isReady || this.setup()
                    }.bind(e))
                }
            }, {
                key: "detachedCallback",
                value: function() {
                    this.detached()
                }
            }]), t
        }(v),
        k = (function(e) {
            function t() {
                babelHelpers.classCallCheck(this, t);
                var e = babelHelpers.possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this)),
                    n = e;
                return n._externalStylePath = "", n.created(), e
            }
            babelHelpers.inherits(t, e), babelHelpers.createClass(t, [{
                key: "scopedStyle",
                value: function() {
                    return "\n                :host {\n                    display: block;\n                    overflow: hidden;\n                }\n                :host, :host > *:first-child, :host > * {\n                    box-sizing: border-box;\n                }\n                :host[disabled] {\n                    opacity: 0.55;\n                    cursor: default;\n                }\n                .jqx-container {\n                    box-sizing: border-box;\n                    font-family: Arial, sans-serif;\n                    font-size: inherit;\n                    display: block;\n                    width: 100%;\n                    height: 100%;\n                    outline: none;\n                    margin: 0;\n                    padding: 0;\n                }\n            "
                }
            }, {
                key: "addExternalStylesheet",
                value: function(e) {
                    var t = this;
                    if (t.shadowRoot && e) {
                        var n = document.createElement("link");
                        n.rel = "stylesheet", n.type = "text/css", n.href = e, t.shadowRoot.insertBefore(n, t.shadowRoot.firstChild)
                    }
                }
            }, {
                key: "attributeChanged",
                value: function(e, t, n) {
                    "external-style" === e && (this.externalStyle = n)
                }
            }, {
                key: "attributeChangedCallback",
                value: function(e, n, i) {
                    this.isReady && babelHelpers.get(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "attributeChangedCallback", this).call(this, e, n, i)
                }
            }, {
                key: "externalStyle",
                get: function() {
                    return this._externalStylePath
                },
                set: function(e) {
                    this._externalStylePath = e
                }
            }], [{
                key: "observedAttributes",
                get: function() {
                    var e = this,
                        t = ["external-style"];
                    for (var n in e.prototype.extendedProperties) {
                        var i = e.prototype.extendedProperties[n];
                        t.push(i.attributeName)
                    }
                    return t
                }
            }]), babelHelpers.createClass(t, [{
                key: "connect",
                value: function() {
                    var e = this,
                        t = e.isReady,
                        n = void 0;
                    if (t || e.children.length > 0 && e.children[0] instanceof HTMLStyleElement && (n = e.children[0], e.removeChild(n)), e.setup(), !t && e.shadowRoot) {
                        n && e.shadowRoot.insertBefore(n, e.shadowRoot.firstChild), e.addExternalStylesheet(e._externalStylePath);
                        var i = document.createElement("style");
                        i.innerHTML = e.scopedStyle(), e.shadowRoot.insertBefore(i, e.shadowRoot.firstChild)
                    }
                }
            }, {
                key: "connectedCallback",
                value: function() {
                    var e = this;
                    "loading" !== document.readyState ? e.connect() : y.push(function() {
                        this.isReady || this.connect()
                    }.bind(e))
                }
            }, {
                key: "adoptedCallback",
                value: function() {
                    this.setup()
                }
            }, {
                key: "appendTemplate",
                value: function(e) {
                    var t = this;
                    t.shadowRoot ? t.shadowRoot.appendChild(e) : t.appendChild(e)
                }
            }]), t
        }(v), function() {
            function e() {
                babelHelpers.classCallCheck(this, e)
            }
            return babelHelpers.createClass(e, null, [{
                key: "register",
                value: function(e, t) {
                    var n = t.prototype,
                        i = r.toCamelCase(e).substring(3);
                    f[e] || (f[e] = window.JQX[i] = t, n.elementName = i, n.defineElement(), h[e] && h[e](n), document.registerElement(e, t))
                }
            }, {
                key: "registerElements",
                value: function() {
                    var e = this;
                    if (e.toRegister)
                        for (var t = 0; t < e.toRegister.length; t++) {
                            var n = e.toRegister[t];
                            e.register(n.tagName, n.element)
                        }
                }
            }, {
                key: "get",
                value: function(e) {
                    if (f[e]) return f[e]
                }
            }, {
                key: "whenRegistered",
                value: function(e, t) {
                    var n = this;
                    if (h[e] ? h[e](n.get(e).prototype) : (h[e] = function(e) {
                            t(e)
                        }, n.get(e) && h[e](n.get(e).prototype)), !e) throw new Error("Syntax Error: Invalid tag name")
                }
            }]), e
        }());
    k.lazyRegister = !1, window.JQX = function(e, t) {
        if (k.lazyRegister) {
            k.toRegister || (k.toRegister = []);
            var n = r.toCamelCase(e).substring(3);
            return window.JQX[n] = t, void k.toRegister.push({
                tagName: e,
                element: t
            })
        }
        k.register(e, t)
    }, Object.assign(window.JQX, {
        Elements: k,
        Modules: [t, e, n],
        BaseElement: w,
        Utilities: c,
        Version: "1.3.9"
    }), window.JQX("jqx-content-element", function(e) {
        function t() {
            return babelHelpers.classCallCheck(this, t), babelHelpers.possibleConstructorReturn(this, (t.__proto__ || Object.getPrototypeOf(t)).apply(this, arguments))
        }
        return babelHelpers.inherits(t, e), babelHelpers.createClass(t, [{
            key: "template",
            value: function() {
                return "<div inner-h-t-m-l='[[innerHTML]]'></div>"
            }
        }, {
            key: "ready",
            value: function() {
                babelHelpers.get(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "ready", this).call(this), this.applyContent()
            }
        }, {
            key: "clearContent",
            value: function() {
                for (var e = this; e.$.content.firstChild;) e.$.content.removeChild(e.$.content.firstChild)
            }
        }, {
            key: "applyContent",
            value: function() {
                var e = this;
                if (void 0 === e.content) return void(e.content = e.$.content);
                if ("" === e.content || null === e.content) return void e.clearContent();
                if (e.content instanceof HTMLElement) return e.clearContent(), void e.$.content.appendChild(e.content);
                var t = document.createDocumentFragment(),
                    n = document.createElement("div");
                t.appendChild(n), e.content instanceof HTMLElement ? n.appendChild(e.content) : n.innerHTML = e.content;
                var i = n.childNodes;
                for (n.parentNode.removeChild(n); i.length;) t.appendChild(i[0]);
                e.clearContent(), e.$.content.appendChild(t)
            }
        }, {
            key: "propertyChangedHandler",
            value: function(e, n, i) {
                babelHelpers.get(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "propertyChangedHandler", this).call(this, e, n, i);
                var r = this;
                n !== i && ("innerHTML" === e && (r.content = i, r.applyContent()), "content" === e && r.applyContent())
            }
        }], [{
            key: "properties",
            get: function() {
                return {
                    content: {
                        type: "any",
                        reflectToAttribute: !1
                    },
                    innerHTML: {
                        type: "string",
                        reflectToAttribute: !1
                    }
                }
            }
        }]), t
    }(window.JQX.BaseElement))
}();
//# sourceMappingURL=jqxelement.js.map
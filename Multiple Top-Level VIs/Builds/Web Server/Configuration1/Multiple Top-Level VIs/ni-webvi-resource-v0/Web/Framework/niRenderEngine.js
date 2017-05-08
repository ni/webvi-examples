//*****************************************************
// Rendering Engine
// National Instruments Copyright 2014
//*****************************************************

(function () {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Static Private Variables
    var _updateQueue = []; // List of elements to update.
    var _updateMap = {}; // {niElementId: niRenderBuffer}
    var _updatePending = {}; // {niElementId: true}
    var _frameRequested = false;

    // Static Private Functions
    var addCSSClasses = function (element, classListToAdd) {
        var i;
        for (i = 0; i < classListToAdd.length; i++) {
            if (typeof classListToAdd[i] !== 'string') {
                throw new Error(NI_SUPPORT.i18n('msg_RENDERBUFFER_EXPECTS_STRING', 'css classes to add', typeof classListToAdd[i]));
            } else {
                element.classList.add(classListToAdd[i]);
            }
        }
    };

    var removeCSSClasses = function (element, classListToRemove) {
        var i;
        for (i = 0; i < classListToRemove.length; i++) {
            if (typeof classListToRemove[i] !== 'string') {
                throw new Error(NI_SUPPORT.i18n('msg_RENDERBUFFER_EXPECTS_STRING', 'css classes to remove', typeof classListToRemove[i]));
            } else {
                element.classList.remove(classListToRemove[i]);
            }
        }
    };

    var setInlineStyle = function (element, cssStyles) {
        var newStyle;
        for (newStyle in cssStyles) {
            if (cssStyles.hasOwnProperty(newStyle)) {
                if (element.style[newStyle] === undefined) {
                    // Let's just log that, we don't want to interrupt execution just because
                    // a CSS property is not declared.
                    NI_SUPPORT.error(NI_SUPPORT.i18n('msg_PROPERTY_DOES_NOT_EXIST', newStyle, 'element style'));
                } else {
                    element.style[newStyle] = cssStyles[newStyle];
                }
            }
        }
    };

    var setAttributes = function (element, attributesToSet) {
        var newAttr;
        for (newAttr in attributesToSet) {
            if (attributesToSet.hasOwnProperty(newAttr)) {
                if (typeof attributesToSet[newAttr] !== 'string') {
                    throw new Error(NI_SUPPORT.i18n('msg_RENDERBUFFER_EXPECTS_STRING', 'element attributes', typeof attributesToSet[newAttr]));
                } else {
                    element.setAttribute(newAttr, attributesToSet[newAttr]);
                }
            }
        }
    };

    var setProperties = function (element, propertiesToSet) {
        var newProp;
        for (newProp in propertiesToSet) {
            if (propertiesToSet.hasOwnProperty(newProp)) {
                if (propertiesToSet[newProp] === undefined) {
                    throw new Error('Property cannot be undefined ' + newProp);
                } else {
                    element[newProp] = propertiesToSet[newProp];
                }
            }
        }
    };

    var dispatchResizeEventWhenSizeChanges = function (element, cssStyles) {
        if (Object.keys(cssStyles).length > 0) {
            var actSize = { width: cssStyles.width, height: cssStyles.height };
            if (actSize.width !== undefined || actSize.height !== undefined) {
                element.dispatchEvent(new CustomEvent('resizeEventHack', { detail: actSize }));
            }
        }
    };

    var applyDomUpdates = function (element, renderBuffer) {
        addCSSClasses(element, renderBuffer.cssClasses.toAdd);
        removeCSSClasses(element, renderBuffer.cssClasses.toRemove);
        setInlineStyle(element, renderBuffer.cssStyles);
        setAttributes(element, renderBuffer.attributes);
        setProperties(element, renderBuffer.properties);
        dispatchResizeEventWhenSizeChanges(element, renderBuffer.cssStyles);
    };

    var runFrameUpdate = function () {
        var element, renderBuffer, niElementId;
        try {
            // We try to do all the work at once.
            while (_updateQueue.length > 0) {
                element = _updateQueue.shift();
                niElementId = element.niElementInstanceId;
                renderBuffer = _updateMap[niElementId];
                _updatePending[niElementId] = false;

                applyDomUpdates(element, renderBuffer);
                if (renderBuffer.postRender) {
                    renderBuffer.postRender();
                }

                renderBuffer.reset();
            }
        } finally {
            _frameRequested = false;
        }
    };

    // Constructor Function
    NationalInstruments.HtmlVI.RenderEngine = function () {
        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Functions
    NationalInstruments.HtmlVI.RenderEngine.getOrAddRenderBuffer = function (element) {
        if (!NI_SUPPORT.isElement(element)) {
            throw new Error('Element should be an instance of Html Custom Element.');
        }

        var niElementId = element.niElementInstanceId,
            renderBuffer = _updateMap[niElementId];
        if (renderBuffer === undefined) {
            renderBuffer = new NationalInstruments.HtmlVI.RenderBuffer();
            _updateMap[niElementId] = renderBuffer;
        }

        return renderBuffer;
    };

    NationalInstruments.HtmlVI.RenderEngine.removeRenderBuffer = function (element) {
        if (!NI_SUPPORT.isElement(element)) {
            throw new Error('Element should be an instance of Html Custom Element.');
        }

        var niElementId = element.niElementInstanceId,
            renderBuffer = _updateMap[niElementId];
        if (renderBuffer !== undefined) {
            _updateMap[niElementId] = undefined;
            _updatePending[niElementId] = undefined;
            _updateQueue = _updateQueue.filter(function (e) {
                return e.niElementInstanceId !== niElementId;
            });
        }

        return renderBuffer;
    };

    NationalInstruments.HtmlVI.RenderEngine.enqueueDomUpdate = function (element) {
        if (!NI_SUPPORT.isElement(element)) {
            throw new Error('Element should be an instance of HtmlElement.');
        }

        var niElementId = element.niElementInstanceId;
        var renderBuffer = _updateMap[niElementId];

        if (renderBuffer === undefined) {
            throw Error('Did you forget to getOrAddRenderBuffer?');
        }

        if (renderBuffer.isEmpty() === false &&
        (_updatePending[niElementId] === false || _updatePending[niElementId] === undefined)) {
            _updatePending[niElementId] = true;
            _updateQueue.push(element);
        }

        if (_frameRequested === false && _updateQueue.length > 0) {
            _frameRequested = true;
            window.requestAnimationFrame(runFrameUpdate);
        }
    };

    NationalInstruments.HtmlVI.RenderEngine.isFrameRequested = function () {
        return _frameRequested;
    };

} ());

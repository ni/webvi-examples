//****************************************
// NIResizeStrategy
// National Instruments Copyright 2016
//****************************************
// Resize Strategy is a base prototype to declare what to do when the bounds
// of a view model changes.
// This interface, enables rapid prototyping of new ways to resize
// an element on screen.
// Is important to consider that onBoundsChangeStarted and onBoundsChangeEnd
// are usually called only when the user is directly interacting with a control.
// That means that the function that is guaranteed to be called is onBoundsChanging
// even when setting the bounds programmatically.
// Objects extending this object must not call this object methods.
(function () {
    'use strict';

    // Constructor function
    NationalInstruments.HtmlVI.ResizeStrategy = function () {

        // Private Instance Variables
        this.boundsChangeStarted = false;
    };

    // Static public variables
    // TODO gleon:
    // 1) Coherent UI is based on chrome 28. 'transform' is considered experimental in that version.
    // hence the -webkit- prefix. http://devdocs.io/css/transform#Browser_compatibility
    // 2) Once we have Coherent40, switch to 'will-change'.
    NationalInstruments.HtmlVI.ResizeStrategy.ResizeCSS = Object.freeze({
        TRANSFORM_CSS : '-webkit-transform',
        TRANSFORM_ORIGIN_CSS : '-webkit-transform-origin'
    });

    // Protoype creation
    var proto = NationalInstruments.HtmlVI.ResizeStrategy.prototype;

    // Private static methods
    var validBounds = function (bounds) {
        if (typeof bounds !== 'object') {
            return false;
        }

        if (typeof bounds.left !== 'number' ||
            typeof bounds.top !== 'number' ||
            typeof bounds.width !== 'number' ||
            typeof bounds.height !== 'number') {
            return false;
        }

        return true;
    };

    var validRenderBuffer = function (renderBuffer) {
        return renderBuffer instanceof NationalInstruments.HtmlVI.RenderBuffer;
    };

    var validateParams = function (bounds, renderBuffer) {
        if (!validBounds(bounds)) {
            throw new Error('bounds format is not valid.');
        }

        if (!validRenderBuffer(renderBuffer)) {
            throw new Error('renderBuffer is not valid.');
        }
    };

    // Public Prototype Methods
    proto.onBoundsChangeStarted = function (bounds, renderBuffer) {
        validateParams(bounds, renderBuffer);
        this.boundsChangeStarted = true;
    };

    proto.onBoundsChanging = function (bounds, renderBuffer) {
        validateParams(bounds, renderBuffer);
    };

    proto.onBoundsChangeEnd = function (bounds, renderBuffer) {
        validateParams(bounds, renderBuffer);
        this.boundsChangeStarted = false;
    };

    proto.setBoundsToRenderBuffer = function (bounds, renderBuffer) {
        renderBuffer.cssStyles.top = bounds.top + 'px';
        renderBuffer.cssStyles.left = bounds.left + 'px';
        renderBuffer.cssStyles.width = bounds.width + 'px';
        renderBuffer.cssStyles.height = bounds.height + 'px';
    };

}());

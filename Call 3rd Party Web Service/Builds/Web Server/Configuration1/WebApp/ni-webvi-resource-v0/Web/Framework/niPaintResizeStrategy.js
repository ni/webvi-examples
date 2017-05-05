//****************************************
// NIPaintResizeStrategy
// National Instruments Copyright 2016
//****************************************
// This strategy is used to immediately set the bounds
// of an element directly into the RenderBuffer when onBoundsChanging
// is called. onBoundsChangeStarted and onBoundsChangeEnd do nothing.
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor function
    NationalInstruments.HtmlVI.PaintResizeStrategy = function () {
        parent.call(this);

        // Private Instance Variables
        // None
    };

    // Protoype creation
    var child = NationalInstruments.HtmlVI.PaintResizeStrategy;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Public Prototype Methods
    proto.onBoundsChangeStarted = function (bounds, renderBuffer) {
        // jshint unused: vars
    };

    proto.onBoundsChanging = function (bounds, renderBuffer) {
        parent.prototype.onBoundsChanging.call(this, bounds, renderBuffer);
        this.setBoundsToRenderBuffer(bounds, renderBuffer);
    };

    proto.onBoundsChangeEnd = function (bounds, renderBuffer) {
        // jshint unused: vars
    };

}(NationalInstruments.HtmlVI.ResizeStrategy));

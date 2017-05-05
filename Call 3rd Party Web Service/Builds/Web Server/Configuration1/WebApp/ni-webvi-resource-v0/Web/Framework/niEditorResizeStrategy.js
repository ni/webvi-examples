//****************************************
// NIEditorResizeStrategy data type
// National Instruments Copyright 2016
//****************************************
// Transforms to drag (Taking advantage of GPU)
// Paint to resize. (Guarantees components will be drawn no matter how expensive)
// Recommended to use in the Editor, because it provides an excellent performance,
// while dragging, and repaints on every frame while resizing, useful for lightweight controls.
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var TRANSFORM_CSS = NationalInstruments.HtmlVI.ResizeStrategy.ResizeCSS.TRANSFORM_CSS;
    var TRANSFORM_ORIGIN_CSS = NationalInstruments.HtmlVI.ResizeStrategy.ResizeCSS.TRANSFORM_ORIGIN_CSS;

    // Constructor function
    NationalInstruments.HtmlVI.EditorResizeStrategy = function () {
        parent.call(this);

        // Private Instance Variables
        this._oldBounds = undefined;
    };

    // Protoype creation
    var child = NationalInstruments.HtmlVI.EditorResizeStrategy;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Public Prototype Methods
    proto.onBoundsChangeStarted = function (bounds, renderBuffer) {
        parent.prototype.onBoundsChangeStarted.call(this, bounds, renderBuffer);
        this._oldBounds = bounds;
        renderBuffer.cssStyles[TRANSFORM_CSS] = 'translate3d(0, 0, 0)';
    };

    proto.onBoundsChanging = function (bounds, renderBuffer) {
        parent.prototype.onBoundsChanging.call(this, bounds, renderBuffer);
        var oldBounds = this._oldBounds;
        if (this.boundsChangeStarted) {
            var deltaLeft = (bounds.left - oldBounds.left),
                deltaTop = (bounds.top - oldBounds.top);
            renderBuffer.cssStyles[TRANSFORM_ORIGIN_CSS] = '0px 0px';
            renderBuffer.cssStyles[TRANSFORM_CSS] = 'translate3d(' + deltaLeft + 'px, ' + deltaTop + 'px, 0)';
            renderBuffer.cssStyles.width = bounds.width + 'px';
            renderBuffer.cssStyles.height = bounds.height + 'px';
        } else {
            this.setBoundsToRenderBuffer(bounds, renderBuffer);
        }
    };

    proto.onBoundsChangeEnd = function (bounds, renderBuffer) {
        parent.prototype.onBoundsChangeEnd.call(this, bounds, renderBuffer);
        this.setBoundsToRenderBuffer(bounds, renderBuffer);
        renderBuffer.cssStyles[TRANSFORM_CSS] = 'none';
        this._oldBounds = undefined;
    };

}(NationalInstruments.HtmlVI.ResizeStrategy));

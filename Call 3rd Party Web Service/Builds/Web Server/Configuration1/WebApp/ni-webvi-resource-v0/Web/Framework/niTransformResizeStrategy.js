//**************************************
// NiTransformResizeStrategy
// National Instruments Copyright 2016
//**************************************
// ResizeStrategy designed to apply CSS transforms when
// onBoundsChanging is called. onBoundsChangeStarted helps
// determine which is going to be the scale ratio based on initial bounds.
// Notice how onBoundsChanging also handles the case when onBoundsChangeStarted is not
// called before it. This happens because the only call guaranteed to execute
// is onBoundsChanging, according to niResizeStrategy.css
// onBoundsChangeEnd just commits all changes done during transformation
// setting the {top, left, width, right} properties on the renderBuffer.
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var TRANSFORM_CSS = NationalInstruments.HtmlVI.ResizeStrategy.ResizeCSS.TRANSFORM_CSS;
    var TRANSFORM_ORIGIN_CSS = NationalInstruments.HtmlVI.ResizeStrategy.ResizeCSS.TRANSFORM_ORIGIN_CSS;

    // Constructor function
    NationalInstruments.HtmlVI.TransformResizeStrategy = function () {
        parent.call(this);

        // Private Instance Variables
        this.oldBounds = {};
    };

    // Private static methods
    // None

    // Protoype creation
    var child = NationalInstruments.HtmlVI.TransformResizeStrategy;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Public Prototype Methods
    proto.onBoundsChangeStarted = function (bounds, renderBuffer) {
        parent.prototype.onBoundsChangeStarted.call(this, bounds, renderBuffer);

        this.oldBounds = bounds;
        renderBuffer.cssStyles[TRANSFORM_CSS] = 'translateZ(0)';
    };

    proto.onBoundsChanging = function (bounds, renderBuffer) {
        parent.prototype.onBoundsChanging.call(this, bounds, renderBuffer);

        if (this.boundsChangeStarted) {
            var scalex = bounds.width / this.oldBounds.width,
                scaley = bounds.height / this.oldBounds.height,
                left = (bounds.left - this.oldBounds.left) + 'px',
                top = (bounds.top - this.oldBounds.top) + 'px';

            renderBuffer.cssStyles[TRANSFORM_ORIGIN_CSS] = '0px 0px';
            renderBuffer.cssStyles[TRANSFORM_CSS] = 'translate3d(' + left + ', ' + top + ', 0) scale(' + scalex + ', ' + scaley + ')';
        } else {
            this.setBoundsToRenderBuffer(bounds, renderBuffer);
        }

    };

    proto.onBoundsChangeEnd = function (bounds, renderBuffer) {
        parent.prototype.onBoundsChangeEnd.call(this, bounds, renderBuffer);

        renderBuffer.cssStyles[TRANSFORM_CSS] = 'none';
        this.setBoundsToRenderBuffer(bounds, renderBuffer);
    };

}(NationalInstruments.HtmlVI.ResizeStrategy));

//************************************************
// NIRepaintResizeStrategy
// National Instruments Copyright 2016
//************************************************
// This strategy is purposed for controls that have
// a really expensive painting process. It sets bounds
// directly to a renderBuffer if onBoundsChangeStarted
// is not called first. Otherwise it scales the control
// using CSS transforms until it reaches the repaintAt
// threshold. At that point it repaints the control and
// reset the current transformation. It sets the bounds
// directly also at onBoundsChangeEnd and clears transforms.
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var TRANSFORM_CSS = NationalInstruments.HtmlVI.ResizeStrategy.ResizeCSS.TRANSFORM_CSS;
    var TRANSFORM_ORIGIN_CSS = NationalInstruments.HtmlVI.ResizeStrategy.ResizeCSS.TRANSFORM_ORIGIN_CSS;

    // Private static methods

    // Constructor function
    NationalInstruments.HtmlVI.RepaintResizeStrategy = function () {
        parent.call(this);

        // Private Instance Variables
        this.scalingBounds = undefined;
        this.repaintAt = 0.25;
    };

    // Prototype creation
    var child = NationalInstruments.HtmlVI.RepaintResizeStrategy;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Public protoype methods
    proto.onBoundsChangeStarted = function (bounds, renderBuffer) {
        parent.prototype.onBoundsChangeStarted.call(this, bounds, renderBuffer);

        this.scalingBounds = bounds;
        renderBuffer.cssStyles[TRANSFORM_CSS] = 'translateZ(0)';
    };

    proto.onBoundsChanging = function (bounds, renderBuffer) {
        parent.prototype.onBoundsChanging.call(this, bounds, renderBuffer);

        if (this.boundsChangeStarted) {
            var scalex = bounds.width / this.scalingBounds.width,
                scaley = bounds.height / this.scalingBounds.height,
                left = (bounds.left - this.scalingBounds.left) + 'px',
                top = (bounds.top - this.scalingBounds.top) + 'px';

            if (Math.abs(1 - scalex) > this.repaintAt || Math.abs(1 - scaley) > this.repaintAt) {
                renderBuffer.cssStyles[TRANSFORM_CSS] = 'none';
                this.setBoundsToRenderBuffer(bounds, renderBuffer);
                this.scalingBounds = bounds;
            } else {
                renderBuffer.cssStyles[TRANSFORM_ORIGIN_CSS] = '0px 0px';
                renderBuffer.cssStyles[TRANSFORM_CSS] = 'translate3d(' + left + ', ' + top + ', 0) scale(' + scalex + ', ' + scaley + ')';
            }
        } else {
            this.setBoundsToRenderBuffer(bounds, renderBuffer);
        }

    };

    proto.onBoundsChangeEnd = function (bounds, renderBuffer) {
        parent.prototype.onBoundsChangeEnd.call(this, bounds, renderBuffer);

        renderBuffer.cssStyles[TRANSFORM_CSS] = 'none';
        this.setBoundsToRenderBuffer(bounds, renderBuffer);
        this.scalingBounds = undefined;
    };

}(NationalInstruments.HtmlVI.ResizeStrategy));

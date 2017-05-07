//****************************************
// NILargeResizeStrategy
// National Instruments Copyright 2016
//****************************************
// Strategy renders a control at twice its current size,
// after that it uses transform to manipulate size and position.
// When the interaction is over, it paints the contorl at a normal
// scale and removes any transforms.
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var TRANSFORM_CSS = NationalInstruments.HtmlVI.ResizeStrategy.ResizeCSS.TRANSFORM_CSS;
    var TRANSFORM_ORIGIN_CSS = NationalInstruments.HtmlVI.ResizeStrategy.ResizeCSS.TRANSFORM_ORIGIN_CSS;

    // Constructor function
    NationalInstruments.HtmlVI.LargeResizeStrategy = function () {
        parent.call(this);

        // Private Instance Variables
        this.paintAtScale = 2;
        this.boundsPainted = undefined;
    };

    // Protoype creation
    var child = NationalInstruments.HtmlVI.LargeResizeStrategy;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Private static methods
    // None

    // Public Prototype Methods
    proto.onBoundsChangeStarted = function (bounds, renderBuffer) {
        parent.prototype.onBoundsChangeStarted.call(this, bounds, renderBuffer);

        this.boundsPainted = {
            left: bounds.left,
            top: bounds.top,
            width: bounds.width * this.paintAtScale,
            height: bounds.height * this.paintAtScale
        };

        var scaleX = bounds.width / this.boundsPainted.width,
            scaleY = bounds.height / this.boundsPainted.height;

        this.setBoundsToRenderBuffer(this.boundsPainted, renderBuffer);

        renderBuffer.cssStyles[TRANSFORM_ORIGIN_CSS] = '0px 0px';
        renderBuffer.cssStyles[TRANSFORM_CSS] = 'translateZ(0) scale(' + scaleX + ', ' + scaleY + ')';
    };

    proto.onBoundsChanging = function (bounds, renderBuffer) {
        parent.prototype.onBoundsChanging.call(this, bounds, renderBuffer);

        if (this.boundsChangeStarted) {
            var left = (bounds.left - this.boundsPainted.left) + 'px',
                top = (bounds.top - this.boundsPainted.top) + 'px',
                scaleX = bounds.width / this.boundsPainted.width,
                scaleY = bounds.height / this.boundsPainted.height;

            renderBuffer.cssStyles[TRANSFORM_ORIGIN_CSS] = '0px 0px';
            renderBuffer.cssStyles[TRANSFORM_CSS] = 'translate3d(' + left + ',' + top + ',0) scale(' + scaleX + ', ' + scaleY + ')';
        } else {
            this.setBoundsToRenderBuffer(bounds, renderBuffer);
        }
    };

    proto.onBoundsChangeEnd = function (bounds, renderBuffer) {
        parent.prototype.onBoundsChangeEnd.call(this, bounds, renderBuffer);

        this.boundsPainted = undefined;
        this.setBoundsToRenderBuffer(bounds, renderBuffer);
        renderBuffer.cssStyles[TRANSFORM_CSS] = 'none';
    };

}(NationalInstruments.HtmlVI.ResizeStrategy));

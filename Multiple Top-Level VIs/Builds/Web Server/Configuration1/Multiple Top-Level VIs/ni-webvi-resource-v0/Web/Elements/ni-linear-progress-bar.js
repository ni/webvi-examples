//****************************************
// Linear Progress Bar Prototype
// DOM Registration: HTMLLinearProgressBar
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.LinearProgressBar = function () {
    'use strict';
};

// Static Public Variables
// None

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var $ = NationalInstruments.Globals.jQuery;
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this),
            widgetSettings,
            childElement,
            jqref;

        if (firstCall === true) {
            widgetSettings = {};
            widgetSettings.animationDuration = 0;
            widgetSettings.max = this.maximum;
            widgetSettings.min = this.minimum;
            widgetSettings.orientation = this.orientation;
            if (this.orientation === 'vertical') {
                widgetSettings.layout = 'reverse';
            }

            widgetSettings.value = this.value;

            childElement = document.createElement('div');
            childElement.style.width = '100%';
            childElement.style.height = '100%';

            this.appendChild(childElement);

            jqref = $(childElement);
            jqref.jqxProgressBar(widgetSettings);

            // Adding CSS class names
            jqref.addClass('ni-track');
            jqref.find(' .jqx-progressbar-value').addClass('ni-range-bar');
        }

        return firstCall;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        var childElement = this.firstElementChild,
            jqref = $(childElement);

        switch (propertyName) {
        case 'maximum':
            jqref.jqxProgressBar({ max: this.maximum });
            break;
        case 'minimum':
            jqref.jqxProgressBar({ min: this.minimum });
            break;
        case 'orientation':
            if (this.orientation === 'vertical') {
                jqref.jqxProgressBar({ orientation: this.orientation, layout: 'reverse' });
            } else {
                jqref.jqxProgressBar({ orientation: this.orientation });
            }

            break;
        case 'value':
            jqref.jqxProgressBar({ value: this.value });
            break;
        default:
            break;
        }
    };

    proto.forceResize = function (size) {
        var childElement = this.firstElementChild,
            jqref = $(childElement);

        parent.prototype.forceResize.call(this, size);

        jqref.jqxProgressBar(size);
    };

    proto.defineElementInfo(proto, 'ni-linear-progress-bar', 'HTMLNILinearProgressBar');
}(NationalInstruments.HtmlVI.Elements.LinearProgressBar, NationalInstruments.HtmlVI.Elements.ProgressBar));

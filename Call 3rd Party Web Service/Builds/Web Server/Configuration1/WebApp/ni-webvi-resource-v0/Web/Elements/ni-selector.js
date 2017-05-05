//****************************************
// Selector
// DOM Registration: No
// National Instruments Copyright 2015
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.Selector = function () {
    'use strict';
};

// Static Public Variables
// None

// Static Public Functions
(function () {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    NationalInstruments.HtmlVI.Elements.Selector.parseAndEscapeSource = function (sourceJSON) {
        return JSON.parse(sourceJSON).map(NI_SUPPORT.escapeHtml);
    };
}());

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.addAllProperties = function (targetPrototype) {
        parent.prototype.addAllProperties.call(this, targetPrototype);

        proto.addProperty(targetPrototype, {
            propertyName: 'source',
            defaultValue: '[]'
        });
    };

}(NationalInstruments.HtmlVI.Elements.Selector, NationalInstruments.HtmlVI.Elements.Visual));

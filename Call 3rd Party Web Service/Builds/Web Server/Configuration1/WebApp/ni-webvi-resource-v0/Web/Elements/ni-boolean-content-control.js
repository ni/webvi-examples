/*jslint nomen: true, devel:true*/
/*global NationalInstruments*/
//****************************************
// Boolean Content Control Prototype
// DOM Registration: No
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.BooleanContentControl = function () {
    'use strict';
};

// Static Public Variables
// None

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
            propertyName: 'trueContent',
            defaultValue: 'on'
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'falseContent',
            defaultValue: 'off'
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'falseContentVisibility',
            defaultValue: false
        });
    };

}(NationalInstruments.HtmlVI.Elements.BooleanContentControl, NationalInstruments.HtmlVI.Elements.BooleanControl));

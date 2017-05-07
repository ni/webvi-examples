//****************************************
// Boolean Control Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NITypes = window.NITypes;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.BooleanControlModel = function (id) {
        parent.call(this, id);

        this.niType = NITypes.BOOLEAN;
        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.BooleanControlModel.ClickModeEnum = Object.freeze({
        PRESS: 'press',
        RELEASE: 'release'
    });

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.BooleanControlModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'value', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'contentVisible', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'content', defaultValue: 'Button' });
        proto.addModelProperty(targetPrototype, { propertyName: 'clickMode', defaultValue: NationalInstruments.HtmlVI.Models.BooleanControlModel.ClickModeEnum.RELEASE });
        proto.addModelProperty(targetPrototype, { propertyName: 'momentary', defaultValue: false });
    });

    proto.propertyUsesNITypeProperty = function (propertyName) {
        return propertyName === 'value';
    };

    proto.controlChanged = function () {
        parent.prototype.controlChanged.call(this, 'value', this.value);
    };

}(NationalInstruments.HtmlVI.Models.VisualModel));

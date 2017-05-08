//****************************************
// Time Stamp Text Box Model
// Note that all values are expeced in LV time units
// (currently a number storing seconds since 1904, eventually also a number storing fractional seconds)
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NITypes = window.NITypes;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.TimeStampTextBoxModel = function (id) {
        parent.call(this, id);

        this.niType = NITypes.TIMESTAMP;
        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.TimeStampTextBoxModel.MODEL_KIND = 'niTimeStampTextBox';

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.TimeStampTextBoxModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    var MIN_TIME = '-9223372036854775808:0'; // -9223372036854775808 is the smallest value that can be represented on int64
    var MAX_TIME = '9223372036854775807:0'; // -9223372036854775808 is the biggest value that can be represented on int64

    var NI_TYPE_PROPERTIES = {
        'value': true,
        'minimum': true,
        'maximum': true
    };

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'minimum', defaultValue: MIN_TIME });
        proto.addModelProperty(targetPrototype, { propertyName: 'maximum', defaultValue: MAX_TIME });
        proto.addModelProperty(targetPrototype, { propertyName: 'value', defaultValue: '0:0' });
        proto.addModelProperty(targetPrototype, { propertyName: 'showCalendarButtonOnControl', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'popupEnabled', defaultValue: false });
    });

    proto.propertyUsesNITypeProperty = function (propertyName) {
        return NI_TYPE_PROPERTIES[propertyName] === true;
    };

    proto.controlChanged = function () {
        parent.prototype.controlChanged.call(this, 'value', this.value);
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
    // Inheritance is different from C# model (where time stamp is a numeric) so that min/max/value properties can have a different datatype
}(NationalInstruments.HtmlVI.Models.VisualModel));

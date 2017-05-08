//****************************************
// Boolean Control Prototype
// DOM Registration: No
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.NumericControl = function () {
    'use strict';
};

// Static Public Variables
// None

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NIType = window.NIType;
    var NITypeNames = window.NITypeNames;

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
            propertyName: 'value',
            defaultValue: { stringValue: '0', numberValue: 0 },
            fireEvent: true,
            addNonSignalingProperty: true
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'niType',
            defaultValue: NITypeNames.DOUBLE
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'minimum',
            defaultValue: { stringValue: '0', numberValue: 0 }
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'maximum',
            defaultValue: { stringValue: '10', numberValue: 10 }
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'interval',
            defaultValue: { stringValue: '1', numberValue: 1 }
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'significantDigits',
            defaultValue: 6
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'precisionDigits',
            defaultValue: -1
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'format',
            defaultValue: 'floating point'
        });

        NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'value', 'value', 'valueNonSignaling', 'value-changed');
    };

    proto.getRange = function () {
        var niValueType = new NIType(this.niType);
        if (niValueType.is64BitInteger() === false) {
            return this.maximum.numberValue - this.minimum.numberValue;
        } else {
            var max = new BigNumber(this.maximum.stringValue);
            return max.subtract(new BigNumber(this.minimum.stringValue)).toString();
        }
    };

}(NationalInstruments.HtmlVI.Elements.NumericControl, NationalInstruments.HtmlVI.Elements.Visual));

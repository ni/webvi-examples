//****************************************
// Cursor Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.CursorModel = function (id) {
        parent.call(this, id);

        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.CursorModel.MODEL_KIND = 'niCursor';

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.CursorModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'show', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'showLabel', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'showValue', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'cursorColor', defaultValue: 'black' });
        proto.addModelProperty(targetPrototype, { propertyName: 'targetShape', defaultValue: 'ellipse' });
        proto.addModelProperty(targetPrototype, { propertyName: 'label', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'snapToData', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'crosshairStyle', defaultValue: 'both' });
        proto.addModelProperty(targetPrototype, { propertyName: 'x', defaultValue: 0.5 });
        proto.addModelProperty(targetPrototype, { propertyName: 'y', defaultValue: 0.5 });
    });

    proto.getPosition = function () {
        return {
            x: this.x,
            y: this.y
        };
    };

    proto.setPosition = function (pos) {
        this.x = pos.x;
        this.y = pos.y;
    };

    proto.controlChanged = function () {
        parent.prototype.controlChanged.call(this, 'x', this.x);
        parent.prototype.controlChanged.call(this, 'y', this.y);
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));

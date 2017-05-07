//****************************************
// Graph Tools Model
// National Instruments Copyright 2015
//****************************************

(function (parent) {
    'use strict';

    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    NationalInstruments.HtmlVI.Models.GraphToolsModel = function (id) {
        parent.call(this, id);
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.GraphToolsModel.MODEL_KIND = 'niGraphTools';

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.GraphToolsModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'graphName', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'isInEditMode', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'mode', defaultValue: 'pan' });
    });

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.VisualModel));

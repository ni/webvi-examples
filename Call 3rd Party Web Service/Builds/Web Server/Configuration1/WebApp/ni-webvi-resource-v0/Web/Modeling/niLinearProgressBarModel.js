//****************************************
// Linear Progress Bar Model
// National Instruments Copyright 2014
//****************************************
// NOTE:
// The C# Model exposes an IsSegmented property here which is non-configurable.
// In addition, jqxWidgets does not support something like that property at the present time.
// We may also want to expose the animationDuration property in here an in the associated C# ViewModel
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.LinearProgressBarModel = function (id) {
        parent.call(this, id);

        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.LinearProgressBarModel.MODEL_KIND = 'niLinearProgressBar';
    NationalInstruments.HtmlVI.Models.LinearProgressBarModel.OrientationEnum = Object.freeze({
        VERTICAL: 'vertical',
        HORIZONTAL: 'horizontal'
    });

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.LinearProgressBarModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'orientation', defaultValue: NationalInstruments.HtmlVI.Models.LinearProgressBarModel.OrientationEnum.HORIZONTAL });
    });

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.ProgressBarModel));

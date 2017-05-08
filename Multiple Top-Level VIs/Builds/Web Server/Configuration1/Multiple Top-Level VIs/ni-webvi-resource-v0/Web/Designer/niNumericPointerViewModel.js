//****************************************
// Visual View Model
// National Instruments Copyright 2014
//****************************************

(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.NumericPointerViewModel = function (element, model) {
        parent.call(this, element, model);

        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    // None

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.ViewModels.NumericPointerViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'scaleVisible' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'majorTicksVisible' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'minorTicksVisible' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'labelsVisible' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'coercionMode' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'rangeDivisionsMode' });
    });

}(NationalInstruments.HtmlVI.ViewModels.NumericControlViewModel));

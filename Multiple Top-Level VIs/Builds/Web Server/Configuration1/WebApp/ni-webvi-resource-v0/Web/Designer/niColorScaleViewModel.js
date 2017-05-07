//****************************************
// ColorScale View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.ColorScaleViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.ColorScaleViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'axisPosition' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'autoScale' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'label' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'show' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'showLabel' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'highColor' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'lowColor' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'markers' });
    });

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.ColorScale, NationalInstruments.HtmlVI.Models.ColorScaleModel);
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));

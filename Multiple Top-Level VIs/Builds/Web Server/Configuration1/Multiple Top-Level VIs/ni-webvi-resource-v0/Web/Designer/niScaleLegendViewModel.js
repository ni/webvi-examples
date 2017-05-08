//****************************************
// ScaleLegend View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.ScaleLegendViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.ScaleLegendViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'graphName' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'isInEditMode' });
    });

    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);

        this.enableResizeHack();
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.ScaleLegend, NationalInstruments.HtmlVI.Models.ScaleLegendModel);
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));

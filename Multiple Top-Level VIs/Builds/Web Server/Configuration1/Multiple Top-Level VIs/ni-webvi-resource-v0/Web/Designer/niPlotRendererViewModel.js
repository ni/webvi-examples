//****************************************
// PlotRenderer View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.PlotRendererViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.PlotRendererViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'lineWidth' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'lineStyle' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'pointShape' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'pointSize' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'pointColor' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'lineStroke' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'areaFill' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'barFill' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'areaBaseLine' });
    });

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.CartesianPlotRenderer, NationalInstruments.HtmlVI.Models.PlotRendererModel);
}(NationalInstruments.HtmlVI.ViewModels.VisualComponentViewModel));

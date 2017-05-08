//****************************************
// CartesianAxis View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.CartesianAxisViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.CartesianAxisViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'label' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'show' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'showLabel' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'axisPosition' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'autoScale' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'logScale' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'minimum' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'maximum' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'format' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'showTickLabels' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'gridLines' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'showTicks'});
        proto.addViewModelProperty(targetPrototype, { propertyName: 'showMinorTicks'});
    });

    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        return renderBuffer;
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);

    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.CartesianAxis, NationalInstruments.HtmlVI.Models.CartesianAxisModel);
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));

//****************************************
// IntensityGraph View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.IntensityGraphViewModel = function (element, model) {
        parent.call(this, element, model);
    };

    // Static Public Variables
    // None

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.ViewModels.IntensityGraphViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        this.enableResizeHack();
    };

    proto.setRenderHints = function (hints) {
        parent.prototype.setRenderHints.call(this, hints);

        if (hints.preferTransforms === true) {
            this.resizeStrategy = new NationalInstruments.HtmlVI.RepaintResizeStrategy();
        }
    };

    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        switch (propertyName) {
            case 'value':
                renderBuffer.properties.value = JSON.stringify(this.model.value);
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        var element = this.element,
            model = this.model;
        model.value = JSON.parse(element.value);
        model.defaultValue = JSON.parse(element.value);
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        var element = this.element,
            model = this.model;
        element.value = JSON.stringify(model.value);
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.IntensityGraph, NationalInstruments.HtmlVI.Models.IntensityGraphModel);
}(NationalInstruments.HtmlVI.ViewModels.GraphBaseViewModel));

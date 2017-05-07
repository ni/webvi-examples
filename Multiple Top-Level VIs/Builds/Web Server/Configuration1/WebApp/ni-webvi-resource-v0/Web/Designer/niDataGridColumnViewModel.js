//****************************************
// Data Grid Column View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.DataGridColumnViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.DataGridColumnViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'index' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'header' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'width' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'fieldName' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'pinned' });
    });

    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        switch (propertyName) {
            case 'aggregates':
                renderBuffer.properties.aggregates = JSON.stringify(this.model.aggregates);
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);

        this.model.aggregates = JSON.parse(this.element.aggregates);
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);

        this.element.aggregates = JSON.stringify(this.model.aggregates);
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.DataGridColumn, NationalInstruments.HtmlVI.Models.DataGridColumnModel);
}(NationalInstruments.HtmlVI.ViewModels.VisualComponentViewModel));

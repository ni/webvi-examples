//****************************************
// Progress Bar View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.ProgressBarViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.ProgressBarViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'maximum' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'minimum' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'value' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'indeterminate' });
    });

    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'minimum':
                renderBuffer.properties.min = this.model.minimum;
                break;
            case 'maximum':
                renderBuffer.properties.max = this.model.maximum;
                break;
            case 'value':
                renderBuffer.properties.value = this.model.value;
                break;
            case 'indeterminate':
                renderBuffer.properties.indeterminate = this.model.indeterminate;
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        this.model.value = this.element.value;
        this.model.maximum = this.element.max;
        this.model.minimum = this.element.min;
        this.model.indeterminate = this.element.indeterminate;
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.max = this.model.maximum;
        this.element.min = this.model.minimum;
        this.element.value = this.model.value;
        this.element.indeterminate = this.model.indeterminate;
    };

}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));

//****************************************
// Gauge View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NUM_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.JQXNumericValueConverter;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.GaugeViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.GaugeViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;

        that.element.addEventListener('change', function (event) {
            that.model.value = NUM_VAL_CONVERTER.convertBack(event.detail.value, that.model.niType);

            that.model.controlChanged();
        });
    };

    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        switch (propertyName) {
            case 'analogDisplayType':
                renderBuffer.properties.analogDisplayType = this.model.analogDisplayType;
                break;
            case 'digitalDisplayVisible':
                renderBuffer.properties.digitalDisplay = this.model.digitalDisplayVisible;
                break;
            case 'digitalDisplayPosition':
                renderBuffer.properties.digitalDisplayPosition = this.model.digitalDisplayPosition;
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);

        this.model.analogDisplayType = this.element.analogDisplayType;
        this.model.digitalDisplayVisible = this.element.digitalDisplay;
        this.model.digitalDisplayPosition = this.element.digitalPosition;
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.analogDisplayType = this.model.analogDisplayType;
        this.element.digitalDisplay = this.model.digitalDisplayVisible;
        this.element.digitalPosition = this.model.digitalDisplayPosition;
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.GaugeModel, 'jqx-gauge');
}(NationalInstruments.HtmlVI.ViewModels.RadialNumericPointerViewModel));

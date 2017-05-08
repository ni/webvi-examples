//****************************************
// NumericValueSelector View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NUM_VALUE_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.NumericValueConverter;
    var NIType = window.NIType;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.NumericValueSelectorViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.NumericValueSelectorViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'popupEnabled' });
    });

    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'niType':
                renderBuffer.properties.niType = this.model.niType.toShortJSON();
                break;

            case 'value':
                if (this.model.value !== null) {
                    renderBuffer.properties.valueNonSignaling = NUM_VALUE_CONVERTER.convert(this.model.value, this.model.niType);
                }

                break;
            case 'items':
                renderBuffer.properties.items = JSON.stringify(this.model.items);
                break;
            case 'popupEnabled':
                renderBuffer.properties.popupEnabled = this.model.popupEnabled;
                break;
            default:
                break;
        }
        return renderBuffer;
    };

    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;

        this.enableResizeHack();

        this.element.addEventListener('value-changed', function (evt) {
            that.model.value = NUM_VALUE_CONVERTER.convertBack(evt.detail.value, that.model.niType);
            that.model.controlChanged();
        });
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        var element = this.element,
            model = this.model,
            nitype = new NIType(element.niType);

        model.niType = nitype;
        model.value = NUM_VALUE_CONVERTER.convertBack(element.value, nitype);
        model.items = JSON.parse(element.items);
        model.popupEnabled = element.popupEnabled;
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        var element = this.element,
            model = this.model;
        element.niType = model.niType.toShortJSON();
        element.items = JSON.stringify(model.items);
        element.value = NUM_VALUE_CONVERTER.convert(model.value, model.niType);
        element.popupEnabled = model.popupEnabled;
    };
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));

//****************************************
// Time Stamp Text Box View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.TimeStampTextBoxViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.TimeStampTextBoxViewModel;
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
        proto.addViewModelProperty(targetPrototype, { propertyName: 'showCalendarButtonOnControl' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'popupEnabled' });
    });

    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;

        that.enableResizeHack();
        that.bindTextFocusEventListener();
        that.element.addEventListener('value-changed', function (event) {
            var value = event.detail.value;
            that.model.value = value;
            that.model.controlChanged();
        });
    };

    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        switch (propertyName) {
            case 'value':
                renderBuffer.properties.valueNonSignaling = this.model.value;
                break;
            case 'minimum':
                renderBuffer.properties.minimum = this.model.minimum;
                break;
            case 'maximum':
                renderBuffer.properties.maximum = this.model.maximum;
                break;
            case 'popupEnabled':
                renderBuffer.properties.popupEnabled = this.model.popupEnabled;
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);

        this.model.value = this.element.value;
        this.model.minimum = this.element.minimum;
        this.model.maximum = this.element.maximum;
        this.model.popupEnabled = this.element.popupEnabled;
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);

        this.element.valueNonSignaling = this.model.value;
        this.element.minimum = this.model.minimum;
        this.element.maximum = this.model.maximum;
        this.element.popupEnabled = this.model.popupEnabled;
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.TimeStampTextBox, NationalInstruments.HtmlVI.Models.TimeStampTextBoxModel);
    // Inheritance is different from C# view model (where time stamp is a numeric) so that min/max/value properties can have a different datatype
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));

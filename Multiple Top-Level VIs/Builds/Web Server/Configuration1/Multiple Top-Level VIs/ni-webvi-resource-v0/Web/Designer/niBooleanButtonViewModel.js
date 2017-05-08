//****************************************
// Boolean Button View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.BooleanButtonViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.BooleanButtonViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);
    });

    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;

        that.element.addEventListener('change', function (e) {
            if (that.model.readOnly === true || e.detail.changeType === 'api') {
                return;
            }

            that.model.value = !that.model.value;
            that.model.controlChanged();
            var eventType = NationalInstruments.HtmlVI.EventsEnum.BUTTON_CLICK;
            var eventData = {};
            eventData.value = that.model.value;
            that.model.controlEventOccurred(eventType, eventData);
        });
    };

    proto.modelPropertyChanged = function (propertyName) {
        var that = this;
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        switch (propertyName) {
            case 'content':
                renderBuffer.properties.content = that.model.content;
                break;
            case 'value':
                renderBuffer.properties.value = this.model.value.toString();
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        var childElement = this.element.firstElementChild;
        var contentSpan = childElement.querySelector('.ni-text');
        if (contentSpan !== null) {
            this.model.contentVisible = contentSpan.classList.contains('ni-hidden') !== true;
        }

        this.model.value = this.element.value === 'true';
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.content = this.model.content;
        this.element.value = this.model.value.toString();
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.BooleanButtonModel, 'jqx-toggle-button');
}(NationalInstruments.HtmlVI.ViewModels.BooleanControlViewModel));

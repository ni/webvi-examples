//****************************************
// CheckBox View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.CheckBoxViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.CheckBoxViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;

        that.element.addEventListener('click', function () {
            if (that.model.readOnly === true) {
                return;
            }

            that.model.value = !that.model.value;
            that.model.controlChanged();
        });
    };

    proto.modelPropertyChanged = function (propertyName) {
        var that = this;
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        switch (propertyName) {
            case 'content':
                that.element.content = that.model.content;
                break;
            case 'value':
                renderBuffer.properties.checked = this.model.value;
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        var contentSpan = this.element.querySelector('.ni-text');
        if (contentSpan !== null) {
            this.model.contentVisible = contentSpan.classList.contains('ni-hidden') !== true;
        }

        this.model.value = this.element.checked;
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.content = this.model.content;
        this.element.checked = this.model.value;
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.CheckBoxModel, 'jqx-checkbox');
}(NationalInstruments.HtmlVI.ViewModels.BooleanControlViewModel));

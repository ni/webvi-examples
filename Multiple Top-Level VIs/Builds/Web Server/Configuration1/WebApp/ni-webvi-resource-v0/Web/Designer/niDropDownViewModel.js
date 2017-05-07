//****************************************
// DropDown View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.DropDownViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.DropDownViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;

        that.enableResizeHack();

        that.element.addEventListener('selected-index-changed', function (evt) {
            that.model.selectedIndex = evt.detail.selectedIndex;
            that.model.controlChanged();
        });
    };

    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        switch (propertyName) {
            case 'selectedIndex':
                renderBuffer.properties.selectedIndexNonSignaling = this.model.selectedIndex;
                break;
            case 'popupEnabled':
                renderBuffer.properties.popupEnabled = this.model.popupEnabled;
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);

        this.model.selectedIndex = this.element.selectedIndex;
        this.model.defaultValue = this.element.selectedIndex;
        this.model.popupEnabled = this.element.popupEnabled;
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);

        this.element.selectedIndex = this.model.selectedIndex;
        this.element.popupEnabled = this.model.popupEnabled;
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.DropDown, NationalInstruments.HtmlVI.Models.DropDownModel);
}(NationalInstruments.HtmlVI.ViewModels.SelectorViewModel));

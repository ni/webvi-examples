//****************************************
// ListBox View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var LISTBOX_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.ListBoxValueConverter;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.ListBoxViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.ListBoxViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'selectionMode' });
    });

    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;

        that.enableResizeHack();

        that.element.addEventListener('selected-index-changed', function (evt) {
            that.model.selectedIndex = LISTBOX_VAL_CONVERTER.convertBack(evt.detail.selectedIndex, that.element.selectionMode);
            that.model.controlChanged();
        });
    };

    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        switch (propertyName) {
            case 'selectedIndex':
                renderBuffer.properties.selectedIndexNonSignaling = LISTBOX_VAL_CONVERTER.convert(this.model.selectedIndex, this.element.selectionMode);
                break;
            case 'niType':
                renderBuffer.properties.niType = this.model.niType.toShortJSON();
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);

        var selectedIndex = LISTBOX_VAL_CONVERTER.convertBack(this.element.selectedIndex, this.element.selectionMode);

        this.model.niType = new window.NIType(this.element.niType);
        this.model.selectedIndex = selectedIndex;
        this.model.defaultValue = selectedIndex;
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);

        this.element.selectedIndex = LISTBOX_VAL_CONVERTER.convert(this.model.selectedIndex);
        this.element.niType = this.model.niType.toShortJSON();
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.ListBox, NationalInstruments.HtmlVI.Models.ListBoxModel);
}(NationalInstruments.HtmlVI.ViewModels.SelectorViewModel));

//****************************************
// IONameControl View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.IONameControlViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.IONameControlViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'allowMultipleSelection' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'allowUndefinedValues' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'showUserCreateResource' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'showUserRefresh' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'showUserBrowse' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'caseSensitive' });
    });

    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;

        that.enableResizeHack();

        that.element.addEventListener('selected-value-changed', function (event) {
            that.model.selectedValue = event.detail.selectedValue;
            that.model.controlChanged();
        });
    };

    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        switch (propertyName) {
            case 'source':
                renderBuffer.properties.source = JSON.stringify(this.model.source);
                break;
            case 'selectedValue':
                renderBuffer.properties.selectedValueNonSignaling = this.model.selectedValue;
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);

        this.model.source = JSON.parse(this.element.source);
        this.model.selectedValue = this.element.selectedValue;
        this.model.defaultValue = this.element.selectedValue;
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);

        this.element.selectedValueNonSignaling = this.model.selectedValue;
        this.element.sourceNonSignaling = JSON.stringify(this.model.source);
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.IONameControl, NationalInstruments.HtmlVI.Models.IONameControlModel);
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));

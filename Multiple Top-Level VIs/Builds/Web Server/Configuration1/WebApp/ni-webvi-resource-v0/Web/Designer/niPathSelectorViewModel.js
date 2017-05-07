//****************************************
// Path Selector Control View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.PathSelectorViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.PathSelectorViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'format' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'popupEnabled' });
    });

    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;

        that.enableResizeHack();
        that.bindTextFocusEventListener();
        that.element.addEventListener('path-changed', function (evt) {
            var pathValue = evt.detail.path;
            that.model.path = JSON.parse(pathValue);
            that.model.controlChanged();
        });
    };

    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        var modelPath;

        switch (propertyName) {
            case 'path':
                modelPath = this.model.path;
                renderBuffer.properties.pathNonSignaling = JSON.stringify(modelPath);
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);

        this.model.path = JSON.parse(this.element.path);
        this.model.defaultValue = JSON.parse(this.element.path);
        this.model.popupEnabled = this.element.popupEnabled;
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);

        var modelPath = this.model.path;

        this.element.pathNonSignaling = JSON.stringify(modelPath);
        this.element.popupEnabled = this.model.popupEnabled;
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.PathSelector, NationalInstruments.HtmlVI.Models.PathSelectorModel);
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));

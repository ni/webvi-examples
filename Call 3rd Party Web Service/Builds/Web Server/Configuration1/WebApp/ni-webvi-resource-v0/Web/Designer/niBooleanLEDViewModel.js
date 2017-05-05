//****************************************
// Boolean Button View Model
// National Instruments Copyright 2014
//****************************************

(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.BooleanLEDViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.BooleanLEDViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'shape', autoElementSync: false });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'highlight', autoElementSync: false });
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
        });
    };

    proto.modelPropertyChanged = function (propertyName) {
        var container;
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        switch (propertyName) {
            case 'shape':
                renderBuffer.properties.shape = this.model.shape;
                break;
            case 'highlight':
                container = document.querySelector('[ni-control-id=\'' + this.model.niControlId + '\'] .jqx-true-content-container');
                container.style.background = this.model.highlight;
                break;
            case 'value':
                renderBuffer.properties.checked = this.model.value;
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        this.model.shape = this.element.shape;
        var container = document.querySelector('[ni-control-id=\'' + this.model.niControlId + '\'] .jqx-true-content-container');
        this.model.highlight = container.style.background;
        this.model.trueContent = this.element.trueContent;
        this.model.falseContent = this.element.falseContent;
        this.model.value = this.element.checked;
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.shape = this.model.shape;
        var container = document.querySelector('[ni-control-id=\'' + this.model.niControlId + '\'] .jqx-true-content-container');
        container.style.background = this.model.highlight;
        this.element.trueContent = this.model.trueContent;
        this.element.falseContent = this.model.falseContent;
        this.element.checked = this.model.value;
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.BooleanLEDModel, 'jqx-led');
}(NationalInstruments.HtmlVI.ViewModels.BooleanContentControlViewModel));

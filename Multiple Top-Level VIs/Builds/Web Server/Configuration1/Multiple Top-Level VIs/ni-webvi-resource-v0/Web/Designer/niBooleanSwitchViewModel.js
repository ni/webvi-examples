//****************************************
// Boolean Switch View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.BooleanSwitchViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.BooleanSwitchViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'shape' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'orientation' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'falseContentVisibility', autoElementSync: false });
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
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        switch (propertyName) {
            case 'shape':
                break;
            case 'orientation':
                renderBuffer.properties.orientation = this.model.orientation;
                break;
            case 'value':
                renderBuffer.properties.checked = this.model.value;
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        this.model.orientation = this.element.orientation;
        this.model.trueContent = this.element.trueContent;
        this.model.falseContent = this.element.falseContent;
        this.model.value = this.element.checked;
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.orientation = this.model.orientation;
        this.element.trueContent = this.model.trueContent;
        this.element.falseContent = this.model.falseContent;
        this.element.checked = this.model.value;
        this.element.switchMode = 'click';
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.BooleanSwitchModel, 'jqx-switch-button');
}(NationalInstruments.HtmlVI.ViewModels.BooleanContentControlViewModel));

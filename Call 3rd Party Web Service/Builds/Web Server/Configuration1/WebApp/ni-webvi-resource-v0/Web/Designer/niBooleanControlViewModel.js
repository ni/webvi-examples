//****************************************
// Boolean Control View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.BooleanControlViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.BooleanControlViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'content', autoElementSync: false });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'contentVisible', autoElementSync: false });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'clickMode', autoElementSync: false });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'momentary', autoElementSync: false });
    });

    proto.convertToJQXClickMode = function () {
        if (this.model.momentary === false && this.model.clickMode !== 'press') { //When Released
            return 'release';
        } else if (this.model.momentary === false && this.model.clickMode === 'press') { //When Pressed
            return 'press';
        } else if (this.model.momentary === true && this.model.clickMode !== 'press') { //Until Released
            return 'pressAndRelease';
        }

        // instead of throwing an exception for invalid combinations we ignore them
        // this is because properties come from the editor one at a time and so can produce
        // temporary invalid combos
        return '';
    };

    proto.convertFromJQXClickMode = function (element, model) {
        if (element.clickMode === 'release') {
            model.momentary = false;
            model.clickMode = 'release';
        } else if (element.clickMode === 'press') {
            model.momentary = false;
            model.clickMode = 'press';
        } else if (element.clickMode === 'pressAndRelease') {
            model.momentary = true;
            model.clickMode = 'release';
        }
    };

    proto.modelPropertyChanged = function (propertyName) {
        var clickMode;
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        switch (propertyName) {
            case 'readOnly':
                renderBuffer.properties.disabled = this.model.readOnly;
                break;
            case 'momentary':
            case 'clickMode':
                clickMode = this.convertToJQXClickMode();
                if (clickMode !== '') {
                    renderBuffer.properties.clickMode = clickMode;
                }

                break;
            case 'content':
                // do not set content here
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);

        this.model.readOnly = this.element.disabled;
        this.convertFromJQXClickMode(this.element, this.model);
        // do not set content
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        // do not update content here - some derived elements will stomp parts if content is set
        this.element.disabled = this.model.readOnly;
        this.element.clickMode = this.convertToJQXClickMode();
        // do not set content
    };

}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));

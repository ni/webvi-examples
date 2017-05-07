//****************************************
// Boolean Control View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.BooleanContentControlViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.BooleanContentControlViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'trueContent', autoElementSync: false });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'falseContent', autoElementSync: false });
    });

    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        delete renderBuffer.properties.content;

        switch (propertyName) {
            case 'trueContent':
                renderBuffer.properties.trueContent = this.model.trueContent;
                break;
            case 'falseContent':
                renderBuffer.properties.falseContent = this.model.falseContent;
                break;
        }

        return renderBuffer;
    };

}(NationalInstruments.HtmlVI.ViewModels.BooleanControlViewModel));

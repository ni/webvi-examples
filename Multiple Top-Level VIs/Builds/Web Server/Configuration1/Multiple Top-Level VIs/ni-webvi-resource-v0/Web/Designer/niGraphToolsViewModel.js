//****************************************
// Graph Tools View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    NationalInstruments.HtmlVI.ViewModels.GraphToolsViewModel = function (element, model) {
        parent.call(this, element, model);
    };

    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Private Static Properties
    var child = NationalInstruments.HtmlVI.ViewModels.GraphToolsViewModel;
    NI_SUPPORT.inheritFromParent(child, parent);

    var proto = child.prototype;

    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        this.enableResizeHack();
    };

    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'graphName' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'isInEditMode' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'mode' });
    });

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.GraphTools, NationalInstruments.HtmlVI.Models.GraphToolsModel);
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));

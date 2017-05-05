//****************************************
// Cursor View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var $ = NationalInstruments.Globals.jQuery;
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.CursorViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.CursorViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'label' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'targetShape' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'show' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'cursorColor' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'crosshairStyle' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'showLabel' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'showValue' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'snapToData' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'x' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'y' });
    });

    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;

        $(this.element).on('cursorUpdated', function () {
            that.model.x = that.element.x;
            that.model.y = that.element.y;
            that.model.controlChanged();
        });
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.Cursor, NationalInstruments.HtmlVI.Models.CursorModel);
    // Other graph parts inherit from VisualComponentViewModel but cursor wants to support font so it inherits from VisualViewModel
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));

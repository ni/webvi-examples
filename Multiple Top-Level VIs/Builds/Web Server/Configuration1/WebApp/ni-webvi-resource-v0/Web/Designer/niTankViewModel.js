//****************************************
// Tank View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.TankViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.TankViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.setRenderHints = function (hints) {
        parent.prototype.setRenderHints.call(this, hints);

        if (hints.preferTransforms === true) {
            this.resizeStrategy = new NationalInstruments.HtmlVI.RepaintResizeStrategy();
        }
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, null, NationalInstruments.HtmlVI.Models.TankModel, 'jqx-tank');
}(NationalInstruments.HtmlVI.ViewModels.LinearNumericPointerViewModel));

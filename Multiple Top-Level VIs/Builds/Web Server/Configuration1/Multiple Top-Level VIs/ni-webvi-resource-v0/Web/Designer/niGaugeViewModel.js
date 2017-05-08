//****************************************
// Gauge View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NUM_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.NumericValueConverter;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.GaugeViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.GaugeViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;

        that.enableResizeHack();

        that.element.addEventListener('value-changed', function (event) {
            that.model.value = NUM_VAL_CONVERTER.convertBack(event.detail.value, that.model.niType);

            that.model.controlChanged();
        });
    };

    proto.setRenderHints = function (hints) {
        parent.prototype.setRenderHints.call(this, hints);

        if (hints.preferTransforms === true) {
            this.resizeStrategy = new NationalInstruments.HtmlVI.RepaintResizeStrategy();
        }
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.Gauge, NationalInstruments.HtmlVI.Models.GaugeModel);
}(NationalInstruments.HtmlVI.ViewModels.RadialNumericPointerViewModel));

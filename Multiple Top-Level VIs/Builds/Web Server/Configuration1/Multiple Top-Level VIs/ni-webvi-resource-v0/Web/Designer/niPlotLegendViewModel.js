//****************************************
// PlotLegend View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.PlotLegendViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.PlotLegendViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'graphName' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'isInEditMode' });
    });

    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);

        this.enableResizeHack();
    };

    proto.userInteractionChanged = function (newState) {
        if (newState === 'start') {
            // Brace yourself. The user is coming
            this.element.throttlePlotUpdates(true);
        }

        if (newState === 'end') {
            // End of the user interaction
            this.element.throttlePlotUpdates(false);
        }

        if (newState === 'atomicactioncomplete') {
            // the plots and renderers are in a consistent state, take the opportunity and display them.
            this.element.syncPlotLegendWithGraph();
        }

        parent.prototype.userInteractionChanged.call(this, newState);
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);

        // TODO mraj what is this about?
        this.model.height = 'auto';
        this.element.style.height = 'auto';
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.PlotLegend, NationalInstruments.HtmlVI.Models.PlotLegendModel);
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));

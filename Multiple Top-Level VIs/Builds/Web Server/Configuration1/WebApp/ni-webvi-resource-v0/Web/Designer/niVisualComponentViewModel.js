//****************************************
// Visual Component View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.VisualComponentViewModel = function (element, model) {
        parent.call(this, element, model);

        if (this.model instanceof NationalInstruments.HtmlVI.Models.VisualComponentModel === false) {
            throw new Error(NI_SUPPORT.i18n('msg_INVALID_VI_MODEL'));
        }

        if (!NI_SUPPORT.isElement(this.element)) {
            throw new Error(NI_SUPPORT.i18n('msg_INVALID_ELEMENT'));
        }

        // Public Instance Properties
        // None

        // Private Instance Properties
        this._needsResizeHack = false;
    };

    // Static Public Variables
    // None

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.ViewModels.VisualComponentViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.enableResizeHack = function () {
        this._needsResizeHack = true;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);

        if (this.model.niControlId !== this.element.niControlId) {
            throw new Error('The element and model association is incorrect; element and model ids do not match');
        }
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);

        if (this.model.niControlId !== this.element.niControlId) {
            throw new Error('The element and model association is incorrect; element and model ids do not match');
        }
    };

    proto.onChildViewModelAdded = function (childViewModel) {
        // jshint unused: vars
    };

    proto.onChildViewModelRemoved = function (childViewModel) {
        // jshint unused: vars
    };

}(NationalInstruments.HtmlVI.ViewModels.NIViewModel));

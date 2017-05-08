//****************************************
// Virtual Instrument View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.VirtualInstrumentViewModel = function (element, model) {
        parent.call(this, element, model);

        if (this.model instanceof NationalInstruments.HtmlVI.Models.VirtualInstrumentModel === false) {
            throw new Error(NI_SUPPORT.i18n('msg_INVALID_VI_MODEL'));
        }

        if (this.element instanceof NationalInstruments.HtmlVI.Elements.VirtualInstrument === false) {
            throw new Error(NI_SUPPORT.i18n('msg_INVALID_ELEMENT'));
        }

        // Public Instance Properties
        // None

        // Private Instance Properties
        this._userInteracting = {};
    };

    // Static Public Variables
    // None

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.ViewModels.VirtualInstrumentViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods

    // NOTE: SHOULD NOT BE CALLED DIRECTLY, USED BY niElementExtensions
    // This is called after niVirtualInstrumentModel.addFrontPanelControlModel, so the Model and ViewModel are already created
    proto.addFrontPanelControlViewModel = function (controlViewModel) {
        var webAppModel, parentModel;

        if (controlViewModel instanceof NationalInstruments.HtmlVI.ViewModels.VisualComponentViewModel === false) {
            throw new Error('Only Visual Component ViewModels can be registered to a Virtual Instrument View Model');
        }

        webAppModel = this.model.getOwningWebApplication();
        webAppModel.updateService.setRenderHintsOnViewModel(controlViewModel);

        parentModel = controlViewModel.model.getOwner();
        if (parentModel instanceof NationalInstruments.HtmlVI.Models.VisualComponentModel) {
            this.model.getControlViewModel(parentModel.niControlId).onChildViewModelAdded(controlViewModel);
        }
    };

    // NOTE: SHOULD NOT BE CALLED DIRECTLY, USED BY niElementExtensions
    proto.removeFrontPanelControlViewModel = function (controlViewModel) {
        var parentModel, parentViewModel;

        if (controlViewModel instanceof NationalInstruments.HtmlVI.ViewModels.VisualComponentViewModel === false) {
            throw new Error('Only Visual Component ViewModels can be registered to a Virtual Instrument View Model');
        }

        parentModel = controlViewModel.model.getOwner();
        if (parentModel instanceof NationalInstruments.HtmlVI.Models.VisualComponentModel) {
            parentViewModel = this.model.getControlViewModel(parentModel.niControlId);
            if (parentViewModel instanceof NationalInstruments.HtmlVI.ViewModels.VisualComponentViewModel) {
                this.model.getControlViewModel(parentModel.niControlId).onChildViewModelRemoved(controlViewModel);
            }
        }
    };

    proto.attachElementToModelAndViewModel = function (element) {
        var controlModelViewModel = this.model.addFrontPanelControlModel(element);
        this.addFrontPanelControlViewModel(controlModelViewModel.controlViewModel);
        return controlModelViewModel;
    };

    proto.detachElementFromModelAndViewModel = function (element) {
        var elementViewModel = this.model.getControlViewModel(element.niControlId);
        this.removeFrontPanelControlViewModel(elementViewModel);
        this.model.removeFrontPanelControl(element);
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);

        this.model.viName = this.element.viName;
        this.model.viRef = this.element.viRef;
    };

    // Called from userInteractionChanged in niEditorUpdateService.
    // We're keeping this state here instead of in the control view models, because
    // 'user interacting' operations (drag, etc.) can last longer than the control
    // view model does, in the reparenting case.
    // We're assuming that control IDs don't change during a user interaction /
    // transacted event on a control.
    proto.setUserInteracting = function (niControlId) {
        this._userInteracting[niControlId] = true;
    };

    // Called from userInteractionChanged in niEditorUpdateService
    proto.clearUserInteracting = function (niControlId) {
        this._userInteracting[niControlId] = undefined;
    };

    proto.isUserInteracting = function (niControlId) {
        return this._userInteracting[niControlId] === true;
    };

    // Unused becasue ni-virtual-instrument is not created from model settings
    //
    // proto.applyModelToElement = function () {
    //     parent.prototype.applyModelToElement.call(this);
    // };

}(NationalInstruments.HtmlVI.ViewModels.NIViewModel));

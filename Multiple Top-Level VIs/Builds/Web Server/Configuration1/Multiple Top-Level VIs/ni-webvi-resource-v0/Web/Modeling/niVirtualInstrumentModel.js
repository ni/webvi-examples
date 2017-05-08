//****************************************
// VI Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NI_EGGSHELL = NationalInstruments.HtmlVI.EggShell;
    var EDITOR_ADAPTERS = NationalInstruments.HtmlVI.NIEditorDataAdapters;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.VirtualInstrumentModel = function () {
        parent.call(this);

        // Public Instance Properties
        this.controlModels = {};
        this.controlViewModels = {};

        // Private Instance Properties
        // None
    };

    var child = NationalInstruments.HtmlVI.Models.VirtualInstrumentModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        // Make viName and viRef readonly
        proto.addModelProperty(targetPrototype, {
            propertyName: 'viName',
            defaultValue: undefined,
            customSetter: function (oldValue, newValue) {
                if ((oldValue === undefined || oldValue === newValue) && newValue !== undefined) {
                    return newValue;
                } else {
                    throw new Error('Cannot change viName after it has been assigned a valid value');
                }
            }
        });

        proto.addModelProperty(targetPrototype, {
            propertyName: 'viRef',
            defaultValue: undefined,
            customSetter: function (oldValue, newValue) {
                if ((oldValue === undefined || oldValue === newValue) && newValue !== undefined) {
                    return newValue;
                } else {
                    throw new Error('Cannot change viRef after it has been assigned a valid value');
                }
            }
        });
    });

    // The Owner of a VI is not the web application, to get the web application call getOwningWebApplication
    proto.getOwner = function () {
        return undefined;
    };

    proto.getOwningWebApplication = function () {
        var model = NationalInstruments.HtmlVI.viReferenceService.getWebAppModelByVIRef(this.viRef);
        return model;
    };

    // NOTE: SHOULD NOT BE CALLED DIRECTLY, USED BY niElementExtensions
    // Creates the Model and ViewModel for the provided element
    // Assumes the element is already inserted in the DOM, the element location in the DOM reflects parenting, and the parent Model and ViewModel are already created
    proto.addFrontPanelControlModel = function (element) {
        if (!NI_SUPPORT.isElement(element)) {
            throw new Error('Only Html Custom Elements can be registered to a Virtual Instrument');
        }

        var niControlId = element.niControlId;
        var selector = '[vi-ref="' + this.viRef + '"][ni-control-id="' + element.niControlId + '"]';
        if (niControlId === '' || document.querySelectorAll(selector).length !== 1) {
            throw new Error('Element with niControlId=' +  niControlId + ' must have a unique niControlId to be registered to this VI');
        }

        // Verify a Model or ViewModel with this id does not already exists
        if (this.controlModels[niControlId] !== undefined || this.controlViewModels[niControlId] !== undefined) {
            throw new Error('The model or viewmodel for this control already exists (' + niControlId + ')');
        }

        // Find parent (either another visualComponent or if none are found then this Model)
        var currParent,
            parentModel = this;

        for (currParent = element.parentElement; currParent !== null; currParent = currParent.parentElement) {
            if (NI_SUPPORT.isElement(currParent)) {
                parentModel = this.controlViewModels[currParent.niControlId].model;
                break;
            }
        }

        // Create the Model
        // TODO mraj in the future the _temporaryModelSettingsHolder should include the model name and the ViewModel can be looked up from model and element tagName
        var modelKind = NationalInstruments.HtmlVI.NIModelProvider.tagNameToModelKind(element.elementInfo.tagName);
        var controlModel = NationalInstruments.HtmlVI.NIModelProvider.makeModel(modelKind, niControlId);
        controlModel.setOwner(parentModel);

        if (parentModel instanceof NationalInstruments.HtmlVI.Models.VisualModel) {
            parentModel.addChildModel(controlModel);
        }

        if (element._temporaryModelSettingsHolder !== undefined) {
            controlModel.setMultipleProperties(element._temporaryModelSettingsHolder, EDITOR_ADAPTERS.editorToJsModel);
        }

        // Create the ViewModel
        var controlViewModel = NationalInstruments.HtmlVI.NIModelProvider.makeViewModel(element, controlModel);
        if (element._temporaryModelSettingsHolder !== undefined) {
            controlViewModel.applyModelToElement();
            element._temporaryModelSettingsHolder = undefined;
        } else {
            controlViewModel.updateModelFromElement();
        }

        // Complete Model - ViewModel binding
        controlModel.registerListener(controlViewModel);

        // Save the model and viewmodel
        this.controlModels[niControlId] = controlModel;
        this.controlViewModels[niControlId] = controlViewModel;

        NI_SUPPORT.infoVerbose('add Model', niControlId);

        return {
            controlModel: controlModel,
            controlViewModel: controlViewModel
        };
    };

    // NOTE: SHOULD NOT BE CALLED DIRECTLY, USED BY niElementExtensions
    // Remove the Model and ViewModel for the provided element
    proto.removeFrontPanelControl = function (element) {
        if (!NI_SUPPORT.isElement(element)) {
            throw new Error('Only Visual Component Elements can be unregistered from a Virtual Instrument');
        }

        var niControlId = element.niControlId;
        var controlModel = this.controlModels[niControlId];
        var controlViewModel = this.controlViewModels[niControlId];

        if (controlModel instanceof NationalInstruments.HtmlVI.Models.VisualComponentModel === false ||
            controlViewModel instanceof NationalInstruments.HtmlVI.ViewModels.VisualComponentViewModel === false) {

            throw new Error('This VIModel does not contain a control with niControlId: ' + niControlId);
        }

        NI_SUPPORT.infoVerbose('remove Model', niControlId);

        if (controlModel.getOwner() instanceof NationalInstruments.HtmlVI.Models.VisualModel) {
            controlModel.getOwner().removeChildModel(controlModel);
        }

        controlModel.unregisterListener(controlViewModel);

        delete this.controlModels[niControlId];
        delete this.controlViewModels[niControlId];

        return {
            controlModel: controlModel,
            controlViewModel: controlViewModel
        };
    };

    proto.getControlViewModel = function (id) {
        return this.controlViewModels[id];
    };

    proto.getControlModel = function (id) {
        return this.controlModels[id];
    };

    proto.getAllControlModels = function () {
        return this.controlModels;
    };

    proto.processControlUpdate = function (niControlId, properties, typedValueAdapter) {
        var controlModel = this.controlModels[niControlId];

        if (controlModel !== undefined) {
            controlModel.setMultipleProperties(properties, typedValueAdapter);
        } else {
            NI_SUPPORT.infoVerbose('Cannot find the control model with id (' + niControlId + ') to update the properties(' + Object.keys(properties).join(',') + ')');
        }
    };

    proto.controlChanged = function (controlModel, propertyName, newValue) {
        var webAppModel = this.getOwningWebApplication();
        webAppModel.controlChanged(this, controlModel, propertyName, newValue);
    };

    proto.internalControlEventOccurred = function (controlModel, eventName, data) {
        var webAppModel = this.getOwningWebApplication();
        webAppModel.internalControlEventOccurred(this, controlModel, eventName, data);
    };

    proto.controlEventOccurred = function (controlModel, eventType, eventData) {
        var webAppModel = this.getOwningWebApplication();
        webAppModel.controlEventOccurred(this, controlModel, eventType, eventData);
    };

    proto.getNameVireoEncoded = function () {
        return NI_EGGSHELL.encodeVireoIdentifier(this.viName);
    };

}(NationalInstruments.HtmlVI.Models.NIModel));

//**********************************************************
// Service that handles interaction with the LabVIEW Editor
// National Instruments Copyright 2014
//**********************************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var EDITOR_ADAPTERS = NationalInstruments.HtmlVI.NIEditorDataAdapters;

    // Constructor Function
    NationalInstruments.HtmlVI.EditorUpdateService = function () {
        parent.call(this);

        // Public Instance Properties
        // References to callbacks registered to coherent so they can be unregistered later
        this.windowEngineCallbacks = {
            propertyChange: undefined,
            propertyChangeMultiple: undefined,
            addElement: undefined,
            removeElement: undefined,
            userInteractionChanged: undefined
        };

        this.keyEventHandler = {
            undoRedo: undefined
        };

        // Private Instance Properties
        this._elementReparentingCache = new NationalInstruments.HtmlVI.ElementReparentingCache();
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.EditorUpdateService.StateEnum = Object.freeze(Object.assign({
        INITIALIZING: 'INITIALIZING',
        LISTENING: 'LISTENING'
    }, NationalInstruments.HtmlVI.Elements.WebApplication.ServiceStateEnum));

    NationalInstruments.HtmlVI.EditorUpdateService.CoherentMessagesEnum = Object.freeze({
        PROPERTY_CHANGE: 'PropertyChange',
        PROPERTY_CHANGE_MULTIPLE: 'PropertyChangeMultiple',
        ADD_ELEMENT: 'AddElement',
        REMOVE_ELEMENT: 'RemoveElement',
        PROCESS_MODEL_UPDATE: 'ProcessModelUpdate',
        PROCESS_INTERNAL_EVENT: 'ProcessInternalEvent',
        DOCUMENT_READY: 'DocumentReady',
        UPDATE_SERVICE_STARTED: 'UpdateServiceStarted',
        USERINTERACTION_CHANGED: 'UserInteractionChanged'
    });

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.EditorUpdateService;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    var SERVICE_STATE_ENUM = NationalInstruments.HtmlVI.EditorUpdateService.StateEnum;
    var COHERENT_MESSAGE_ENUM = NationalInstruments.HtmlVI.EditorUpdateService.CoherentMessagesEnum;

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.isValidServiceState = function (state) {
        // Child states merged with parent states so only need to check child

        var isValidState = SERVICE_STATE_ENUM[state] !== undefined;
        return isValidState;
    };

    proto.isInIdeMode = function () {
        return true;
    };

    proto.initialize = function () {
        parent.prototype.initialize.call(this, SERVICE_STATE_ENUM.UNINITIALIZED, undefined);

        this.setServiceState(SERVICE_STATE_ENUM.INITIALIZING);
    };

    proto.finishInitializing = function () {
        parent.prototype.finishInitializing.call(this, SERVICE_STATE_ENUM.INITIALIZING);

        this.setServiceState(SERVICE_STATE_ENUM.READY);
    };

    proto.start = function () {
        parent.prototype.start.call(this, SERVICE_STATE_ENUM.READY);
        var that = this;

        that.windowEngineCallbacks.propertyChange = function (argsArr) {
            var viName = argsArr[0],
                controlId = argsArr[1],
                dataJSON = argsArr[2],
                data;

            data = JSON.parse(dataJSON);
            that.dispatchMessageToHTMLPanel(viName, controlId, data, EDITOR_ADAPTERS.editorToJsModel);
        };

        that.windowEngineCallbacks.propertyChangeMultiple = function (argsArr) {
            var viName = argsArr[0],
                controlIdsJSON = argsArr[1],
                dataValuesJSON = argsArr[2],
                controlIds = JSON.parse(controlIdsJSON),
                dataValues = JSON.parse(dataValuesJSON),
                i;

            for (i = 0; i < controlIds.length; i++) {
                that.dispatchMessageToHTMLPanel(viName, controlIds[i], dataValues[i], EDITOR_ADAPTERS.editorToJsModel);
            }
        };

        // NOTE: If changes are made to this function, make sure to run the Reparenting Regression Test prior to submission: https://nitalk.jiveon.com/docs/DOC-358124
        that.windowEngineCallbacks.addElement = function (argsArr) {
            var modelSettingsJSON = argsArr[0],
                modelSettings = JSON.parse(modelSettingsJSON),
                modelMetadata = {};
            // TODO mraj the C# code should be modified to emit the correct viRef
            modelSettings.viRef = '';

            // TODO mraj refactoring so modelSettings is strictly properties used by the JavaScript models and modelMetadata is everything else
            // ideally the C# side would be modified to reflect these assumptions
            modelMetadata = {
                parentId: argsArr[1],
                nextModelId: argsArr[2],
                initialLoad: argsArr[3],
                modelAttached: true, // We only call AddElement from C# once we already have a C# model and viewmodel
                extras: undefined,
                kind: undefined
            };

            modelMetadata.extras = modelSettings.extras;
            modelMetadata.kind = modelSettings.kind;
            delete modelSettings.extras;
            delete modelSettings.kind;

            NI_SUPPORT.infoVerbose('add Element (editor)', modelMetadata.kind + '(' + modelSettings.niControlId + ')', modelSettings, modelMetadata);

            // Numeric controls appear to be added twice, if a numeric control already exists then pretend this never happened
            // TODO we should remove this and fix it on the C# side - TA235540
            var existingNumeric = document.querySelector('[vi-ref="' + modelSettings.viRef + '"][ni-control-id="' + modelSettings.niControlId + '"]');
            if (existingNumeric !== null &&
                (existingNumeric instanceof NationalInstruments.HtmlVI.Elements.NumericControl ||
                existingNumeric instanceof window.JQX.Elements.get('jqx-numeric-text-box') ||
                existingNumeric instanceof window.JQX.Elements.get('jqx-slider') ||
                existingNumeric instanceof window.JQX.Elements.get('jqx-tank'))) {
                NI_SUPPORT.errorVerbose('A numeric element with id (' + modelSettings.niControlId + ') has already been created so ignoring add element request');
                return;
            }

            // TODO mraj modelKindToTagName only works when a model has a 1 to 1 mapping to an element. In the future seetings needs to explicitly include a tagName
            var tagName = NationalInstruments.HtmlVI.NIModelProvider.modelKindToTagName(modelMetadata.kind);
            var resultElements = NationalInstruments.HtmlVI.UpdateService.createNIControlToAddToDOM(modelSettings,
                                                                                                    tagName,
                                                                                                    modelSettings.niControlId,
                                                                                                    modelSettings.viRef,
                                                                                                    modelMetadata.parentId);

            resultElements.controlElement._modelMetadata = modelMetadata;

            var key;
            for (key in modelMetadata.extras) {
                if (modelMetadata.extras.hasOwnProperty(key)) {
                    resultElements.controlElement.setAttribute(key, modelMetadata.extras[key]);
                }
            }

            var insertBeforeNode;
            if (modelMetadata.nextModelId !== '') {
                insertBeforeNode = document.querySelector('[vi-ref="' + modelSettings.viRef + '"][ni-control-id="' + modelMetadata.nextModelId + '"]');

                if (insertBeforeNode === null) {
                    NI_SUPPORT.errorVerbose('Attempting to insert new element id (' + modelSettings.niControlId + ') next to existing element id (' + modelMetadata.nextModelId + ') but the existing element cannot be found. Ignoring nextModelId and adding as child of parent.');
                    insertBeforeNode = undefined;
                }
            }

            if (resultElements.parentElement === undefined) {
                that._elementReparentingCache.addToElementCache(modelMetadata.parentId, resultElements.controlElement);
            } else {
                if (insertBeforeNode !== undefined) {
                    resultElements.parentElement.insertBefore(resultElements.controlElement, insertBeforeNode);
                } else {
                    resultElements.parentElement.appendChild(resultElements.controlElement);
                }

                that._elementReparentingCache.flushElementCache(resultElements.controlElement.niControlId, resultElements.controlElement);
                that._elementReparentingCache.removeElementFromCache(resultElements.controlElement);
            }
        };

        // NOTE: If changes are made to this function, make sure to run the Reparenting Regression Test prior to submission: https://nitalk.jiveon.com/docs/DOC-358124
        that.windowEngineCallbacks.removeElement = function (argsArr) {
            var controlId = argsArr[0],
                modelAttached = argsArr[1],
                viRef = '',
                resultElements;

            NI_SUPPORT.infoVerbose('remove Element (editor)', controlId, argsArr);

            var precheckElement = document.querySelector('[vi-ref="' + viRef + '"][ni-control-id="' + controlId + '"]');
            if (precheckElement === null) {
                NI_SUPPORT.errorVerbose('Attempted to remove an element with niControlId(' + controlId + ') but it could not be found. It is known that numerics are incorrectly removed multiple times, but if it was a different control this needs to be debugged further.');
                return;
            }

            resultElements = NationalInstruments.HtmlVI.UpdateService.findNIControlToRemoveFromDOM(controlId, viRef);
            resultElements.controlElement._modelMetadata.modelAttached = modelAttached;

            resultElements.controlElement.parentNode.removeChild(resultElements.controlElement);

            if (NI_SUPPORT.isElement(resultElements.parentElement) && modelAttached) {
                that._elementReparentingCache.addToElementCache(resultElements.parentElement.niControlId, resultElements.controlElement);
            } else {
                that._elementReparentingCache.removeElementFromCache(resultElements.controlElement);
            }
        };

        that.windowEngineCallbacks.userInteractionChanged = function (argsArr) {
            var viName = argsArr[0],
                controlId = argsArr[1],
                dataJSON = argsArr[2],
                state, viModel, controlViewModel;

            state = JSON.parse(dataJSON);
            viModel = that.getVIModels()[viName];
            controlViewModel = viModel.getControlViewModel(controlId);

            var viViewModel = NationalInstruments.HtmlVI.viReferenceService.getVIViewModelByVIRef(viModel.viRef);
            if (state === 'start') {
                viViewModel.setUserInteracting(controlId);
            } else if (state === 'end') {
                viViewModel.clearUserInteracting(controlId);
            }

            // Is possible that a VisualComponentViewModel receives this event.
            // But it cannot handle it. Shall we move userInteractionChanged to VisualComponent?
            if (controlViewModel instanceof NationalInstruments.HtmlVI.ViewModels.VisualViewModel) {
                controlViewModel.userInteractionChanged(state);
            }
        };

        // All the key events reach both C# and js.
        // For things like backspace/delete/Ctrl+A/Ctrl+V/Ctrl+X/Ctrl+C, the Html controls need these events.
        // So we block these events in C# side let the browser consume these events when an editable control is focused.
        // But for Ctrl+z/Ctrl+y/Ctrl+Shift+Z events, we never want html to handle them.
        // The C# side transaction manager will handle the undo/redo when we are not editing controls.
        // So we capture and discard the defaut undo/redo event in browser side.
        that.keyEventHandler.undoRedo = function (event) {
            // The keycode property has been deprecated and we should use key property instead.
            // but the Coherent doesn't support key property.
            // default undo key combination
            if ((event.ctrlKey && (event.keyCode === 90 || event.key === 'z')) ||
                // default redo key combination
                (event.ctrlKey && (event.keyCode === 89 || event.key === 'y')) ||
                // default redo key combination
                (event.ctrlKey && event.shiftKey && (event.keyCode === 90 || event.key === 'z'))) {
                event.preventDefault();
                event.stopPropagation();
            }
        };

        window.engine.on(COHERENT_MESSAGE_ENUM.PROPERTY_CHANGE, that.windowEngineCallbacks.propertyChange);
        window.engine.on(COHERENT_MESSAGE_ENUM.PROPERTY_CHANGE_MULTIPLE, that.windowEngineCallbacks.propertyChangeMultiple);
        window.engine.on(COHERENT_MESSAGE_ENUM.ADD_ELEMENT, that.windowEngineCallbacks.addElement);
        window.engine.on(COHERENT_MESSAGE_ENUM.REMOVE_ELEMENT, that.windowEngineCallbacks.removeElement);
        window.engine.on(COHERENT_MESSAGE_ENUM.USERINTERACTION_CHANGED, that.windowEngineCallbacks.userInteractionChanged);

        document.addEventListener('keydown', that.keyEventHandler.undoRedo, true);
        window.engine.call(COHERENT_MESSAGE_ENUM.DOCUMENT_READY);
        window.engine.call(COHERENT_MESSAGE_ENUM.UPDATE_SERVICE_STARTED);
        that.setServiceState(SERVICE_STATE_ENUM.LISTENING);
    };

    proto.stop = function () {
        parent.prototype.stop.call(this, SERVICE_STATE_ENUM.LISTENING);

        window.engine.off(COHERENT_MESSAGE_ENUM.PROPERTY_CHANGE, this.windowEngineCallbacks.propertyChange);
        window.engine.off(COHERENT_MESSAGE_ENUM.PROPERTY_CHANGE_MULTIPLE, this.windowEngineCallbacks.propertyChangeMultiple);
        window.engine.off(COHERENT_MESSAGE_ENUM.ADD_ELEMENT, this.windowEngineCallbacks.addElement);
        window.engine.off(COHERENT_MESSAGE_ENUM.REMOVE_ELEMENT, this.windowEngineCallbacks.removeElement);
        window.engine.off(COHERENT_MESSAGE_ENUM.USERINTERACTION_CHANGED, this.windowEngineCallbacks.userInteractionChanged);
        document.removeEventListener('keydown', this.keyEventHandler.undoRedo, true);
        this.windowEngineCallbacks.propertyChange = undefined;
        this.windowEngineCallbacks.propertyChangeMultiple = undefined;
        this.windowEngineCallbacks.addElement = undefined;
        this.windowEngineCallbacks.removeElement = undefined;
        this.windowEngineCallbacks.userInteractionChanged = undefined;
        this.keyEventHandler.undoRedo = undefined;
        this.setServiceState(SERVICE_STATE_ENUM.READY);
    };

    // Called by the WebAppModel
    proto.internalControlEventOccurred = function (viModel, controlModel, eventName, eventData) {
        var data = {};
        data[eventName] = eventData;

        // TODO mraj should check update service state before triggering event
        window.engine.trigger(COHERENT_MESSAGE_ENUM.PROCESS_INTERNAL_EVENT, viModel.viName, controlModel.niControlId, JSON.stringify(data));
    };

    // Called by the WebAppModel
    proto.controlChanged = function (viModel, controlModel, propertyName, newValue) {
        // jshint unused:vars

        var topLevelControl,
            topLevelControlValue,
            topLevelControlValueJSON;

        if (controlModel.bindingInfo.prop === propertyName) {
            topLevelControl = controlModel.findTopLevelControl();
            topLevelControlValue = topLevelControl[topLevelControl.bindingInfo.prop];
            if (topLevelControl.propertyUsesNITypeProperty(topLevelControl.bindingInfo.prop)) {
                topLevelControlValue = EDITOR_ADAPTERS.jsModelToEditor(topLevelControlValue, topLevelControl.niType);
            }

            topLevelControlValueJSON = JSON.stringify(topLevelControlValue);

            // TODO mraj should check update service state before triggering event
            window.engine.trigger(COHERENT_MESSAGE_ENUM.PROCESS_MODEL_UPDATE, viModel.viName, topLevelControl.niControlId, topLevelControlValueJSON);
        }
    };

    proto.setRenderHintsOnViewModel = function (viewModel) {
        if (viewModel instanceof NationalInstruments.HtmlVI.ViewModels.VisualViewModel) {
            viewModel.setRenderHints({ preferTransforms: true });
        }
    };

    proto.maybeAddToElementCache = function (element) {
        if (this._elementReparentingCache !== undefined) {
            var currParent;
            var parentElement = document.body;
            var rootParentElement;

            for (currParent = element.parentElement; currParent !== null; currParent = currParent.parentElement) {
                if (NI_SUPPORT.isElement(currParent)) {
                    rootParentElement = currParent;
                    if (parentElement === document.body) {
                        parentElement = currParent;
                    }
                }
            }

            if (NI_SUPPORT.isElement(parentElement) && rootParentElement !== parentElement) {
                NI_SUPPORT.infoVerbose('remove Element (parent detached)', element.niControlId);
                element.parentNode.removeChild(element);
                this._elementReparentingCache.addToElementCache(parentElement.niControlId, element);
            }
        }
    };
}(NationalInstruments.HtmlVI.UpdateService));

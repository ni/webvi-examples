//**********************************************************
// Service that handles interaction with Vireo
// National Instruments Copyright 2014
//**********************************************************

(function () {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.UpdateService = function () {
        // Public Instance Properties
        this.setServiceState = undefined;
        this.verifyServiceStateIs = undefined;
        this.checkServiceStateIs = undefined;
        this.getVIModels = undefined;

        // References to callbacks registered to coherent so they can be unregistered later
        this.windowEngineCallbacks = {
            getPropertyValue: undefined,
            controlExists: undefined,
            indexOfControl: undefined
        };

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.UpdateService.InitTasksEnum = Object.freeze({
        ELEMENTSREADY: 'ELEMENTSREADY'
    });

    NationalInstruments.HtmlVI.UpdateService.CoherentMessagesEnum = Object.freeze({
        GET_PROPERTY_VALUE: 'GetPropertyValue',
        CONTROL_EXISTS: 'ControlExists',
        INDEX_OF_CONTROL: 'IndexOfControl'
    });

    // Static Public Functions
    // Uses the current DOM to create an ni-element that can be added to the DOM (but is not added yet). The created element and the parent element are returned for use.
    // modelSettings: an object that will be attached to the instance of the DOM element as the property name _temporaryModelSettingsHolder
    // controlTagName: the tagName of the element to be created, ie 'ni-boolean-control'
    // niControlId: the id to assign to the control as a string
    // viRef: the viRef associated with the ni-virtual-instrument that owns the control to be created
    // parentControlId: The id of the parent control
    //     if the parentControlId is empty string then the returned parent element is document.body
    //     if the parentControlId is a string that corresponds to an niControlId in the dom then the returned parent element is the corresponding element
    //     if the parentControlId is a string that is not empty and does not correspond to an niControlId in the dom then the returned parent element is the value undefined
    // NOTE: This function should only perform DOM manipulation and should not require model / viewmodel state information
    // NOTE: This function should not be used directly (via eval, etc), instead update services should invoke as needed
    // NOTE: This function relies on rigorous assumptions about the state of the DOM. If the DOM is in an invalid state, handle those cases and make sure the DOM is valid before calling this function
    NationalInstruments.HtmlVI.UpdateService.createNIControlToAddToDOM = function (modelSettings, controlTagName, niControlId, viRef, parentControlId) {
        if (typeof modelSettings !== 'object' || modelSettings === null) {
            throw new Error('Model settings that are provided should be a JS object with properties');
        }

        if (typeof controlTagName !== 'string' || controlTagName === '') {
            throw new Error('An element needs a valid controlTagName string to be created');
        }

        if (typeof niControlId !== 'string' || niControlId === '') {
            throw new Error('An element needs a valid niControlId string to be created');
        }

        if (typeof viRef !== 'string') {
            throw new Error('An element needs a valid target viRef string to be created');
        }

        if (typeof parentControlId !== 'string') {
            throw new Error('An element needs to have a valid parentControlId string to be created');
        }

        var viSelector = 'ni-virtual-instrument[vi-ref="' + viRef + '"]';
        var viElements = document.querySelectorAll(viSelector);

        if (viElements.length !== 1) {
            throw new Error('The DOM should only contain one ni-virtual-instrument with vi-ref: ' + viRef);
        }

        var controlSelector = '[vi-ref="' + viRef + '"][ni-control-id="' + niControlId + '"]';
        var controlElements = document.querySelectorAll(controlSelector);

        if (controlElements.length !== 0) {
            throw new Error('The DOM already contains an element with vi-ref (' + viRef + ') and ni-control-id (' + niControlId + '), but currently has (' + controlElements.length + ') elements');
        }

        var controlElement = document.createElement(controlTagName);

        if (!NI_SUPPORT.isElement(controlElement)) {
            throw new Error('Only Html Custom Elements can be created with createNIControlToAddToDOM');
        }

        controlElement.niControlId = niControlId;
        controlElement._temporaryModelSettingsHolder = modelSettings;

        var parentSelector, parentElements, parentElement;

        if (parentControlId === '') {
            parentElement = document.body;
        } else {
            parentSelector = '[vi-ref="' + viRef + '"][ni-control-id="' + parentControlId + '"]';
            parentElements = document.querySelectorAll(parentSelector);

            if (parentElements.length > 1) {
                throw new Error('The DOM has too many elements with vi-ref (' + viRef + ') and ni-control-id (' + parentControlId + ')');
            } else if (parentElements.length === 1) {
                parentElement = parentElements[0];
            } else {
                parentElement = undefined;
            }
        }

        return {
            controlElement: controlElement,
            parentElement: parentElement
        };
    };

    // Finds an element that can be removed from the dom and returns a reference to the element and it's associated parent
    // NOTE: This function should only perform DOM manipulation and should not require model / viewmodel state information
    // NOTE: This function should not be used directly (via eval, etc), instead update services should invoke as needed
    // NOTE: This function relies on rigorous assumptions about the state of the DOM. If the DOM is in an invalid state, handle those cases and make sure the DOM is valid before calling this function
    NationalInstruments.HtmlVI.UpdateService.findNIControlToRemoveFromDOM = function (niControlId, viRef) {
        if (typeof niControlId !== 'string' || niControlId === '') {
            throw new Error('An element needs a valid niControlId string to be created');
        }

        if (typeof viRef !== 'string') {
            throw new Error('An element needs a valid target viRef string to be created');
        }

        var controlSelector = '[vi-ref="' + viRef + '"][ni-control-id="' + niControlId + '"]';
        var controlElements = document.querySelectorAll(controlSelector);

        if (controlElements.length !== 1) {
            throw new Error('The DOM should contain exactly one element with vi-ref (' + viRef + ') and ni-control-id (' + niControlId + '), but currently has (' + controlElements.length + ') elements');
        }

        var controlElement = controlElements[0];

        if (!NI_SUPPORT.isElement(controlElement)) {
            throw new Error('Only Html Custom elements can be removed with findNIControlToRemoveFromDOM');
        }

        var currParent,
            parentElement = document.body;

        for (currParent = controlElement.parentElement; currParent !== null; currParent = currParent.parentElement) {
            if (NI_SUPPORT.isElement(controlElement)) {
                parentElement = currParent;
                break;
            }
        }

        return {
            controlElement: controlElement,
            parentElement: parentElement
        };
    };

    // Prototype creation
    var child = NationalInstruments.HtmlVI.UpdateService;
    var proto = child.prototype;

    // Static Private Variables
    var SERVICE_STATE_ENUM = NationalInstruments.HtmlVI.Elements.WebApplication.ServiceStateEnum;
    var INIT_TASKS_ENUM = NationalInstruments.HtmlVI.UpdateService.InitTasksEnum;
    var COHERENT_MESSAGE_ENUM = NationalInstruments.HtmlVI.UpdateService.CoherentMessagesEnum;

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.applyWebAppServiceStateProvider = function (webAppServiceStateProvider) {
        this.setServiceState = webAppServiceStateProvider.setServiceState;
        this.verifyServiceStateIs = webAppServiceStateProvider.verifyServiceStateIs;
        this.checkServiceStateIs = webAppServiceStateProvider.checkServiceStateIs;
    };

    proto.applyVirtualInstrumentModelsProvider = function (virtualInstrumentModelsProvider) {
        this.getVIModels = virtualInstrumentModelsProvider.getVIModels;
    };

    // typedValueAdapter, if specified, will be used to transform property values before setting on the control model.
    // For example, what we get from the editor (or Vireo) may not exactly match what the control model wants for a property.
    // It will be called for any property that uses the model's niType property (e.g. model.propertyUsesNITypeProperty()
    // returns true for that property).
    proto.dispatchMessageToHTMLPanel = function (viName, controlId, properties, typedValueAdapter) {
        var viModels = this.getVIModels();
        var viModel = viModels[viName];
        if (viModel !== undefined) {
            viModel.processControlUpdate(controlId, properties, typedValueAdapter);
        } else {
            throw new Error('No VI found with name: ' + viName + ' to send control property update');
        }
    };

    proto.isInIdeMode = function () {
        return false;
    };

    // Called by the WebAppModel
    proto.internalControlEventOccurred = function (viModel, controlModel, eventName, eventData) {
        // jshint unused: vars
    };

    // Called by the WebAppModel
    proto.controlChanged = function (viModel, controlModel, propertyName, newValue) {
        // jshint unused: vars
    };

    // Called by the WebAppModel
    proto.controlEventOccurred = function (viModel, controlModel, eventType, eventData) {
        // jshint unused: vars
    };

    // Children should extend to verify their states as needed
    proto.isValidServiceState = function (state) {
        var isValidState = SERVICE_STATE_ENUM[state] !== undefined;
        return isValidState;
    };

    // State Lifecycle functions
    // Actions performed during initializing occur prior to the initializing of all the pages initial models and viewModels
    //   so only perform actions that behave independently of models and viewmodels
    proto.initialize = function (expectedState, tasksEnum) {
        var that = this,
            initTaskTracker;

        if (expectedState !== SERVICE_STATE_ENUM.UNINITIALIZED) {
            throw new Error('Service must be UNINITIALIZED to run initialize');
        }

        that.verifyServiceStateIs(SERVICE_STATE_ENUM.UNINITIALIZED);

        if (tasksEnum === undefined) {
            tasksEnum = INIT_TASKS_ENUM;
        }

        initTaskTracker = new NationalInstruments.HtmlVI.TaskTracker(tasksEnum, function initComplete() {
            // Have to complete asynchronously so state transition can propagate
            setTimeout(function () {
                that.finishInitializing();
            }, 0);
        });

        NationalInstruments.HtmlVI.Elements.NIElement.addNIEventListener('attached', function () {
            initTaskTracker.complete(INIT_TASKS_ENUM.ELEMENTSREADY);
        });

        return initTaskTracker;
    };

    // Finish initializing is called when the page initial models, view models, and elements have been created (the attached callback for all initial elements has been called)
    proto.finishInitializing = function (expectedState) {
        this.verifyServiceStateIs(expectedState);
    };

    // The framework requires the update service to be in the READY state before allowing start to be called (and assumes start can be called as long as in the ready state)
    proto.start = function (expectedState) {
        var that = this;
        if (expectedState !== SERVICE_STATE_ENUM.READY) {
            throw new Error('Service must be READY to run start');
        }

        that.verifyServiceStateIs(SERVICE_STATE_ENUM.READY);

        // Used for tests. See IHtmlUpdateService.cs and HtmlVIFrontPanelShellTest (C#)
        that.windowEngineCallbacks.getPropertyValue = function (argsArr) {
            var requestId = argsArr[0],
                id = argsArr[1],
                querySelector = argsArr[2],
                property = argsArr[3];
            var selector = '[ni-control-id=\'' + id + '\']';
            if (querySelector !== null) {
                selector = selector + querySelector;
            }

            var nodes = document.querySelectorAll(selector);
            var result = '';
            if (nodes !== null && nodes.length !== 0) {
                var node = nodes[0];

                if (property === 'style') {
                    var style = window.getComputedStyle(node);
                    result = JSON.stringify(style);
                } else if (property === 'content') {
                    var childHTML = node.firstChild.innerHTML;
                    result = JSON.stringify(childHTML);
                } else if (node[property] !== undefined) {
                    // Note: This won't work for a property value of Infinity/-Infinity/NaN.
                    // Currently that's fine, since the new JQX numerics represent min/max/value as strings.
                    result = JSON.stringify(node[property]);
                }
            }

            window.engine.trigger('GetPropertyValueComplete', requestId, result);
        };

        // Used for tests. See IHtmlUpdateService.cs and HtmlVIFrontPanelShellTest (C#)
        that.windowEngineCallbacks.controlExists = function (argsArr) {
            var requestId = argsArr[0],
                id = argsArr[1];
            var selector = '[ni-control-id=\'' + id + '\']';
            var nodes = document.querySelectorAll(selector);
            var exists = nodes.length > 0;

            window.engine.trigger('ControlExistsComplete', requestId, exists);
        };

        // Used for tests. See IHtmlUpdateService.cs and HtmlVIFrontPanelShellTest (C#)
        that.windowEngineCallbacks.indexOfControl = function (argsArr) {
            var requestId = argsArr[0],
                id = argsArr[1];
            var selector = '[ni-control-id=\'' + id + '\']';
            var node = document.querySelectorAll(selector);
            var index = -1, i;
            if (node.length !== 0) {
                for (i = 0; i < node[0].parentElement.childNodes.length; i++) {
                    if (node[0].parentElement.childNodes[i] === node[0]) {
                        index = i;
                        break;
                    }
                }
            }

            window.engine.trigger('IndexOfControlComplete', requestId, index);
        };

        if (window.engine !== undefined) {
            window.engine.on(COHERENT_MESSAGE_ENUM.GET_PROPERTY_VALUE, that.windowEngineCallbacks.getPropertyValue);
            window.engine.on(COHERENT_MESSAGE_ENUM.CONTROL_EXISTS, that.windowEngineCallbacks.controlExists);
            window.engine.on(COHERENT_MESSAGE_ENUM.INDEX_OF_CONTROL, that.windowEngineCallbacks.indexOfControl);
        }
    };

    proto.stop = function (expectedState) {
        this.verifyServiceStateIs(expectedState);
        if (window.engine !== undefined) {
            window.engine.off(COHERENT_MESSAGE_ENUM.GET_PROPERTY_VALUE, this.windowEngineCallbacks.getPropertyValue);
            window.engine.off(COHERENT_MESSAGE_ENUM.CONTROL_EXISTS, this.windowEngineCallbacks.controlExists);
            window.engine.off(COHERENT_MESSAGE_ENUM.INDEX_OF_CONTROL, this.windowEngineCallbacks.indexOfControl);
        }

        this.windowEngineCallbacks.getPropertyValue = undefined;
        this.windowEngineCallbacks.controlExists = undefined;
        this.windowEngineCallbacks.indexOfControl = undefined;
    };

    // Called by niElementExtensions to make the view model
    // aware of the environment that is running on.
    proto.setRenderHintsOnViewModel = function (viewModel) {
        // jshint unused: vars
    };

    proto.maybeAddToElementCache = function (element) {
        // jshint unused: vars
    };
}());

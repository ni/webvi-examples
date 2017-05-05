//****************************************
// Web Application Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var SERVICE_STATE_ENUM = NationalInstruments.HtmlVI.Elements.WebApplication.ServiceStateEnum;
    var PANEL_ENGINE_ENUM = NationalInstruments.HtmlVI.Elements.WebApplication.PanelEngineEnum;
    var PANEL_LOCATION_ENUM = NationalInstruments.HtmlVI.Elements.WebApplication.PanelLocationEnum;

    // Static private Variables used by constructor
    var currWebAppInstanceId = 0;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.WebApplicationModel = function () {
        parent.call(this);

        // Public Instance Properties
        this.updateService = undefined;
        this.initTasks = undefined;

        // Private Instance Properties
        NI_SUPPORT.defineConstReference(this, 'webAppInstanceId', currWebAppInstanceId++);
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.Models.WebApplicationModel.TasksEnum = Object.freeze({
        SERVICE: 'SERVICE',
        ELEMENTS: 'ELEMENTS'
    });

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.WebApplicationModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'engine', defaultValue: PANEL_ENGINE_ENUM.VIREO });
        proto.addModelProperty(targetPrototype, { propertyName: 'location', defaultValue: PANEL_LOCATION_ENUM.BROWSER });
        proto.addModelProperty(targetPrototype, { propertyName: 'vireoSource', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'remoteAddress', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'testMode', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'disableAutoStart', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'serviceState', defaultValue: SERVICE_STATE_ENUM.UNINITIALIZED });
    });

    proto.setServiceState = function (state) {
        if (this.updateService.isValidServiceState(state) === false) {
            throw new Error('the provided state (' + state + ') is not a valid service state');
        }

        this.serviceState = state;
    };

    proto.verifyServiceStateIs = function (verifyState) {
        var i, currState;

        if (Array.isArray(verifyState) === false) {
            verifyState = [verifyState];
        }

        for (i = 0; i < verifyState.length; i = i + 1) {
            currState = verifyState[i];

            if (this.updateService.isValidServiceState(currState) === false) {
                throw new Error('the provided state (' + currState + ') is not a valid service state');
            }

            if (this.serviceState === currState) {
                return;
            }
        }

        throw new Error('ni-web-application update service in state(' + this.serviceState + ') must be in one of the possible states (' + verifyState.join() + ') to continue');
    };

    proto.checkServiceStateIs = function (checkState) {
        var i, currState;

        if (Array.isArray(checkState) === false) {
            checkState = [checkState];
        }

        for (i = 0; i < checkState.length; i = i + 1) {
            currState = checkState[i];

            if (this.updateService.isValidServiceState(currState) === false) {
                throw new Error('the provided state (' + currState + ') is not a valid service state');
            }

            if (this.serviceState === currState) {
                return true;
            }
        }

        return false;
    };

    proto.getWebAppServiceStateProvider = function () {
        var that = this;

        return {
            setServiceState : function (state) {
                that.setServiceState(state);
            },
            verifyServiceStateIs: function (state) {
                that.verifyServiceStateIs(state);
            },
            checkServiceStateIs: function (state) {
                return that.checkServiceStateIs(state);
            }
        };
    };

    proto.getVirtualInstrumentModelsProvider = function () {
        var that = this;

        return {
            getVIModels: function () {
                return NationalInstruments.HtmlVI.viReferenceService.getAllVIModelsForWebAppModel(that);
            }
        };
    };

    proto.initializeService = function () {
        var that  = this;

        var config = {
            remoteAddress: that.remoteAddress,
            vireoSource: that.vireoSource,
            runningInIDE: that.location === PANEL_LOCATION_ENUM.IDE_RUN
        };

        var updateServiceTable = {};
        updateServiceTable[PANEL_LOCATION_ENUM.IDE_EDIT] = {};
        updateServiceTable[PANEL_LOCATION_ENUM.IDE_RUN] = {};
        updateServiceTable[PANEL_LOCATION_ENUM.BROWSER] = {};

        updateServiceTable[PANEL_LOCATION_ENUM.IDE_EDIT][PANEL_ENGINE_ENUM.NATIVE] = NationalInstruments.HtmlVI.EditorUpdateService;
        updateServiceTable[PANEL_LOCATION_ENUM.IDE_RUN][PANEL_ENGINE_ENUM.NATIVE] = NationalInstruments.HtmlVI.EditorRuntimeUpdateService;
        updateServiceTable[PANEL_LOCATION_ENUM.BROWSER][PANEL_ENGINE_ENUM.NATIVE] = NationalInstruments.HtmlVI.RemoteUpdateService;

        updateServiceTable[PANEL_LOCATION_ENUM.IDE_EDIT][PANEL_ENGINE_ENUM.VIREO] = NationalInstruments.HtmlVI.EditorUpdateService;
        updateServiceTable[PANEL_LOCATION_ENUM.IDE_RUN][PANEL_ENGINE_ENUM.VIREO] = NationalInstruments.HtmlVI.LocalUpdateService;
        updateServiceTable[PANEL_LOCATION_ENUM.BROWSER][PANEL_ENGINE_ENUM.VIREO] = NationalInstruments.HtmlVI.LocalUpdateService;

        // Create the update service we need, not the one we deserve
        if (updateServiceTable[that.location] !== undefined && updateServiceTable[that.location][that.engine] !== undefined) {
            that.updateService = new updateServiceTable[that.location][that.engine](config);
        } else if (that.testMode === true) {
            that.updateService = new NationalInstruments.HtmlVI.TestUpdateService(config);
        } else {
            throw new Error('Invalid web app configuration, cannot start a service!');
        }

        that.verifyServiceStateIs(SERVICE_STATE_ENUM.UNINITIALIZED);
        that.updateService.applyWebAppServiceStateProvider(that.getWebAppServiceStateProvider());
        that.updateService.applyVirtualInstrumentModelsProvider(that.getVirtualInstrumentModelsProvider());

        // TODO mraj without the timeout the attachedCallback will synchronously try and update the service state as the
        // update service transitions from Uninitialized to Downloading / Initializing / etc. Doing this synchronously seems to trigger
        // the error before mentioned in ni-element.js in attributeChangedCallback for the case currVal !== newVal.
        // It seems like needing the setTimeout to move to a separate call stack from attachedCallback should be a bug in Chrome...
        setTimeout(function () {
            that.updateService.initialize();
        }, 0);
    };

    proto.start = function () {
        this.updateService.start();
    };

    proto.stop = function () {
        this.updateService.stop();
    };

    proto.controlChanged = function (viModel, controlModel, propertyName, newValue) {
        if (this.updateService !== undefined) {
            this.updateService.controlChanged(viModel, controlModel, propertyName, newValue);
        }
    };

    proto.internalControlEventOccurred = function (viModel, controlModel, eventName, eventData) {
        if (this.updateService !== undefined) {
            this.updateService.internalControlEventOccurred(viModel, controlModel, eventName, eventData);
        }
    };

    proto.controlEventOccurred = function (viModel, controlModel, eventType, eventData) {
        if (this.updateService !== undefined) {
            this.updateService.controlEventOccurred(viModel, controlModel, eventType, eventData);
        }
    };

}(NationalInstruments.HtmlVI.Models.NIModel));

//**********************************************************
// Service that handles interaction with Test Framework
// National Instruments Copyright 2014
//**********************************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.TestUpdateService = function () {
        parent.call(this);

        // Public Instance Properties
        this.windowCallbacks = {
            propertyChange: undefined,
            addElement: undefined,
            removeElement: undefined
        };

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NationalInstruments.HtmlVI.TestUpdateService.StateEnum = Object.freeze(Object.assign({
        INITIALIZING: 'INITIALIZING',
        RUNNING: 'RUNNING'
    }, NationalInstruments.HtmlVI.Elements.WebApplication.ServiceStateEnum));

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.TestUpdateService;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    var SERVICE_STATE_ENUM = NationalInstruments.HtmlVI.TestUpdateService.StateEnum;

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.isValidServiceState = function (state) {
        // Child states merged with parent states so only need to check child
        var isValidState = SERVICE_STATE_ENUM[state] !== undefined;
        return isValidState;
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

        // Events fired by the test async helpers
        // Switched from using event listeners to invoking directly. Reason is that events don't propagate exceptions on the
        // call stack which makes testing in jasmine very difficult: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
        that.windowCallbacks.propertyChange = function (viName, niControlId, data) {
            that.dispatchMessageToHTMLPanel(viName, niControlId, data);
        };

        that.windowCallbacks.addElement = function (modelSettings, tagName, niControlId, viRef, parentId) {

            // TODO mraj the tests should be updated to not include kind or extras in modelsettings
            var filteredModelSettings = {},
                key;
            for (key in modelSettings) {
                if (modelSettings.hasOwnProperty(key) && key !== 'kind') {
                    filteredModelSettings[key] = modelSettings[key];
                }
            }

            var resultElements = NationalInstruments.HtmlVI.UpdateService.createNIControlToAddToDOM(filteredModelSettings, tagName, niControlId, viRef, parentId);
            if (resultElements.parentElement === undefined) {
                throw new Error('Parent element must be defined for the test update service');
            } else {
                resultElements.parentElement.appendChild(resultElements.controlElement);
            }
        };

        that.windowCallbacks.removeElement = function (niControlId, viRef) {
            var resultElements = NationalInstruments.HtmlVI.UpdateService.findNIControlToRemoveFromDOM(niControlId, viRef);
            resultElements.controlElement.parentNode.removeChild(resultElements.controlElement);
        };

        that.setServiceState(SERVICE_STATE_ENUM.RUNNING);
    };

    proto.stop = function () {
        parent.prototype.stop.call(this, SERVICE_STATE_ENUM.RUNNING);

        this.windowCallbacks.propertyChange = undefined;
        this.windowCallbacks.addElement = undefined;
        this.windowCallbacks.removeElement = undefined;

        this.setServiceState(SERVICE_STATE_ENUM.READY);
    };

}(NationalInstruments.HtmlVI.UpdateService));

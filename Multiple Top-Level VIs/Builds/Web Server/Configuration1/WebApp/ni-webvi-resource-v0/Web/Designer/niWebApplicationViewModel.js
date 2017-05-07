//****************************************
// Web Application View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var SERVICE_STATE_ENUM = NationalInstruments.HtmlVI.Elements.WebApplication.ServiceStateEnum;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.WebApplicationViewModel = function (element, model) {
        parent.call(this, element, model);

        if (this.model instanceof NationalInstruments.HtmlVI.Models.WebApplicationModel === false) {
            throw new Error(NI_SUPPORT.i18n('msg_INVALID_VI_MODEL'));
        }

        if (this.element instanceof NationalInstruments.HtmlVI.Elements.WebApplication === false) {
            throw new Error(NI_SUPPORT.i18n('msg_INVALID_ELEMENT'));
        }

        // Public Instance Properties
        // None

        // Private Instance Properties
        this._autoStartOccurred = false;
    };

    // Static Public Variables
    // None

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.ViewModels.WebApplicationViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // TODO mraj niskipsync used for development only until we have improved deployment testing
    var isBrowserPreventEditorModeEnabled = function () {
        var preventEditorMode = (window.location.hash.indexOf('niskipsync') !== -1);
        return preventEditorMode;
    };

    // Public Prototype Methods
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;

        that.element.addEventListener('requested-start', function (evt) {
            if (that.element === evt.detail.element) {
                that.model.start();
            }
        });

        that.element.addEventListener('requested-stop', function (evt) {
            if (that.element === evt.detail.element) {
                that.model.stop();
            }
        });

        that.model.initializeService();
    };

    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        var that = this;

        switch (propertyName) {
            case 'serviceState':
                // Assign to the element directly as renderBuffer is buffered and debounced so may lose samples
                that.element.serviceState = that.model.serviceState;

                if (that.model.checkServiceStateIs(SERVICE_STATE_ENUM.READY) && that.model.disableAutoStart === false && that._autoStartOccurred === false) {

                    that._autoStartOccurred = true;
                    that.model.start();
                }

                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);

        var model = this.model,
            element = this.element;

        model.engine = element.engine;
        model.location = element.location;
        model.vireoSource = element.vireoSource;
        model.remoteAddress = element.remoteAddress;
        model.testMode = element.testMode;
        model.disableAutoStart = element.disableAutoStart;
        model.serviceState = element.serviceState;

        // Gets this parameter from the view, but not the element. Until we support deployment from the IDE,
        // the only way to set the page to "deployed"/"browser" mode is via the custom #niskipsync url
        if (isBrowserPreventEditorModeEnabled()) {
            model.location = '';
            model.engine = '';
            model.testMode = true;
        }
    };

    // Unused becasue ni-web-application is not created from model settings
    //
    // proto.applyModelToElement = function () {
    //     parent.prototype.applyModelToElement.call(this);
    // };

}(NationalInstruments.HtmlVI.ViewModels.NIViewModel));

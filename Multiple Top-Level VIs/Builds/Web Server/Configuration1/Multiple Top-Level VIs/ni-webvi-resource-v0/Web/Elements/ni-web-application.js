//****************************************
// Web Application Prototype
// DOM Registration: HTMLNIWebApplication
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.WebApplication = function () {
    'use strict';
};

// Static Public Variables
NationalInstruments.HtmlVI.Elements.WebApplication.ServiceStateEnum = Object.freeze({
    UNINITIALIZED: 'UNINITIALIZED',
    READY: 'READY',
    ERROR: 'ERROR'
});

// Keep in sync with serializer in DOMModel.cs
NationalInstruments.HtmlVI.Elements.WebApplication.PanelEngineEnum = Object.freeze({
    NATIVE: 'NATIVE',
    VIREO: 'VIREO'
});

// Keep in sync with serializer in DOMModel.cs
NationalInstruments.HtmlVI.Elements.WebApplication.PanelLocationEnum = Object.freeze({
    IDE_EDIT: 'IDE_EDIT',
    IDE_RUN: 'IDE_RUN',
    BROWSER: 'BROWSER'
});

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var $ = NationalInstruments.Globals.jQuery;
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    var SERVICE_STATE_ENUM = NationalInstruments.HtmlVI.Elements.WebApplication.ServiceStateEnum;

    // Static Private Functions
    var createWebAppFrontend = function () {
        //<div class="ni-execution-buttons-box disabled">
        //    <button class="ni-execution-button ni-start-button disabled hidden" type="button">Start</button>
        //    <button class="ni-execution-button ni-abort-button disabled hidden" type="button">Abort</button>
        //</div>
        var uiControls = document.createElement('div');
        uiControls.classList.add('ni-execution-buttons-box');

        var startButton = document.createElement('button');
        startButton.textContent = 'Start';
        startButton.type = 'button';
        startButton.classList.add('ni-execution-button', 'ni-start-button', 'disabled');

        var abortButton = document.createElement('button');
        abortButton.textContent = 'Abort';
        abortButton.type = 'button';
        abortButton.classList.add('ni-execution-button', 'ni-abort-button', 'disabled');

        uiControls.appendChild(startButton);
        uiControls.appendChild(abortButton);

        var enableButtons = function (enableStart, enableAbort) {
            if (enableStart) {
                startButton.classList.remove('disabled');
            } else {
                startButton.classList.add('disabled');
            }

            if (enableAbort) {
                abortButton.classList.remove('disabled');
            } else {
                abortButton.classList.add('disabled');
            }
        };

        return {
            uiControls: uiControls,
            startButton: startButton,
            abortButton: abortButton,
            enableButtons: enableButtons
        };
    };

    var updateUIButtons = function (frontEndElements, serviceState) {
        if (serviceState === 'READY') {
            frontEndElements.enableButtons(true, false);
        } else if (serviceState === 'RUNNING' || serviceState === 'CONNECTING' || serviceState === 'CONNECTED' || serviceState === 'LISTENING') {
            frontEndElements.enableButtons(false, true);
        } else {
            frontEndElements.enableButtons(false, false);
        }
    };

    var updateConnectingDialog = function (serviceState) {
        if (serviceState === 'CONNECTED') {
            $.unblockUI();
        } else {
            $.blockUI({
                message: 'CONNECTING',
                ignoreIfBlocked: true,
                css: {
                    border: 'none',
                    padding: '15px',
                    backgroundColor: '#000',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    opacity: 0.5,
                    color: '#fff',
                    cursor: 'wait'
                }
            });
        }
    };

    // Public Prototype Methods
    proto.addAllProperties = function (targetPrototype) {
        parent.prototype.addAllProperties.call(this, targetPrototype);

        proto.addProperty(targetPrototype, {
            propertyName: 'engine',
            defaultValue: ''
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'location',
            defaultValue: ''
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'vireoSource',
            defaultValue: ''
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'remoteAddress',
            defaultValue: ''
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'testMode',
            defaultValue: false
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'disableAutoStart',
            defaultValue: false
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'serviceState',
            defaultValue: SERVICE_STATE_ENUM.UNINITIALIZED,
            fireEvent: true
        });
    };

    proto.createdCallback = function () {
        parent.prototype.createdCallback.call(this);

        // Public Instance Properties
        // None

        // Private Instance Properties
        this._enableConnectionDialog = false;
        this._frontEndElements = undefined;

        // If the DOM had a different value, override it
        this.serviceState = SERVICE_STATE_ENUM.UNINITIALIZED;
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this);
        var frontEndElements,
            that = this;

        NationalInstruments.HtmlVI.webApplicationModelsService.register(that);

        if (firstCall === true) {

            if (that.disableAutoStart === false && that.engine === 'NATIVE' && that.location === 'BROWSER') {
                that._enableConnectionDialog = true;
                updateConnectingDialog(that.serviceState);
            }

            if (that.disableAutoStart === true) {
                frontEndElements = createWebAppFrontend();

                frontEndElements.startButton.addEventListener('click', function () {
                    if (frontEndElements.startButton.classList.contains('disabled') === false) {
                        that.start();
                    }
                });

                frontEndElements.abortButton.addEventListener('click', function () {
                    if (frontEndElements.abortButton.classList.contains('disabled') === false) {
                        that.stop();
                    }
                });

                that._frontEndElements = frontEndElements;
                updateUIButtons(that._frontEndElements, that.serviceState);
                that.appendChild(frontEndElements.uiControls);
            }
        }

        return firstCall;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        switch (propertyName) {
            case 'serviceState':
                if (this._enableConnectionDialog === true) {
                    updateConnectingDialog(this.serviceState);
                }

                if (this.disableAutoStart === true) {
                    updateUIButtons(this._frontEndElements, this.serviceState);
                }

                break;
        }
    };

    proto.detachedCallback = function () {
        NationalInstruments.HtmlVI.webApplicationModelsService.unregister(this);
    };

    proto.start = function () {
        this.dispatchEvent(new CustomEvent('requested-start', {
            bubbles: true,
            cancelable: true,
            detail: {
                element: this
            }
        }));
    };

    proto.stop = function () {
        this.dispatchEvent(new CustomEvent('requested-stop', {
            bubbles: true,
            cancelable: true,
            detail: {
                element: this
            }
        }));
    };

    proto.defineElementInfo(proto, 'ni-web-application', 'HTMLNIWebApplication');
}(NationalInstruments.HtmlVI.Elements.WebApplication, NationalInstruments.HtmlVI.Elements.NIElement));

//****************************************
// Boolean Control Prototype
// DOM Registration: No
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.BooleanControl = function () {
    'use strict';
};

// Static Public Variables
// None

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var UI_ACTIVITY_SERVICE = NationalInstruments.HtmlVI.UIActivityService;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    var unbindMechanicalAction = function (target) {
        var id = target.niElementInstanceId.toString();
        if (UI_ACTIVITY_SERVICE.isRegistered(id) === true) {
            UI_ACTIVITY_SERVICE.unregister(id);
        }
    };

    var tryBindMechanicalAction = function (target) {
        var onPress = target.clickMode === 'press',
            isMomentary = target.momentary,
            id = target.niElementInstanceId.toString(),
            element = target,
            that = target;

        if (target.readOnly === true) {
            return;
        }

        if (isMomentary === true && onPress === true) {
            NI_SUPPORT.errorVerbose('Invalid configuration, cannot have momentary true and click mode "press", instead using when released configuration');
            isMomentary = false;
            onPress = false;
        }

        if (isMomentary === false && onPress === false) { //When Released
            UI_ACTIVITY_SERVICE.register({
                element: element,
                id: id,
                up: function (evt) {
                    // When only an up action is registered should only receive MouseEvents
                    // If an event is cancelled (window focus lost, etc), then evt may be undefined
                    if (evt !== undefined && element.contains(evt.target)) {
                        that.value = !that.value;
                    }
                }
            });
        } else if (isMomentary === false && onPress === true) { //When Pressed
            UI_ACTIVITY_SERVICE.register({
                element: element,
                id: id,
                down: function () {
                    that.value = !that.value;
                }
            });
        } else if (isMomentary === true && onPress === false) { //Until Released
            UI_ACTIVITY_SERVICE.register({
                element: element,
                id: id,
                up: function () {
                    that.value = !that.value;
                },
                down: function () {
                    that.value = !that.value;
                }
            });
        }
    };

    // Public Prototype Methods
    proto.addAllProperties = function (targetPrototype) {
        parent.prototype.addAllProperties.call(this, targetPrototype);

        proto.addProperty(targetPrototype, {
            propertyName: 'value',
            defaultValue: false,
            fireEvent: true,
            addNonSignalingProperty: true,
            isElementValueProperty: true
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'contentVisible',
            defaultValue: false
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'content',
            defaultValue: 'Button'
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'clickMode',
            defaultValue: 'release'
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'momentary',
            defaultValue: false
        });
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this);

        tryBindMechanicalAction(this);

        return firstCall;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        switch (propertyName) {
            case 'readOnly':
                if (this.readOnly === true) {
                    unbindMechanicalAction(this);
                } else {
                    tryBindMechanicalAction(this);
                }

                break;
            case 'clickMode':
                tryBindMechanicalAction(this);
                break;
            case 'momentary':
                tryBindMechanicalAction(this);
                break;
            default:
                break;
        }
    };

    proto.detachedCallback = function () {
        parent.prototype.detachedCallback.call(this);

        unbindMechanicalAction(this);
    };

}(NationalInstruments.HtmlVI.Elements.BooleanControl, NationalInstruments.HtmlVI.Elements.Visual));

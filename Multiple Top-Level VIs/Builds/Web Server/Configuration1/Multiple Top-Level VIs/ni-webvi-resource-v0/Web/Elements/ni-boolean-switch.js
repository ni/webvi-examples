//****************************************
// Boolean Switch Prototype
// DOM Registration: HTMLNIBooleanSwitch
// National Instruments Copyright 2015
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.BooleanSwitch = function () {
    'use strict';
};

// Static Public Variables
NationalInstruments.HtmlVI.Elements.BooleanSwitch.OrientationEnum = Object.freeze({
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal'
});

NationalInstruments.HtmlVI.Elements.BooleanSwitch.ShapeEnum = Object.freeze({
    SLIDER: 'slider',
    POWER: 'power'
});

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var $ = NationalInstruments.Globals.jQuery;
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var ORIENTATION_ENUM = NationalInstruments.HtmlVI.Elements.BooleanSwitch.OrientationEnum;
    var SHAPE_ENUM = NationalInstruments.HtmlVI.Elements.BooleanSwitch.ShapeEnum;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    var computeAndTriggerResize = function (target) {
        var currentStyle = window.getComputedStyle(target);
        target.forceResize({
            width: currentStyle.width,
            height: currentStyle.height
        });
    };

    var attachPowerButton = function (target) {
        // Cannot use button because it ignores lineHeight
        var childElement = document.createElement('div');
        childElement.classList.add('ni-boolean-box');
        // Symbol for power button in font awesome v4.5.0
        childElement.textContent = '\uF011';

        target.innerHTML = '';
        target.appendChild(childElement);

        // Need to trigger resize manually for standalone case where element extensions does not cause a resize
        computeAndTriggerResize(target);
    };

    var forceResizePowerButton = function (target, size) {
        var childElement = target.firstElementChild,
            height = parseFloat(size.height),
            fontSize = height * 0.67;

        childElement.style.lineHeight = height + 'px';
        childElement.style.fontSize = fontSize + 'px';
    };

    var attachSliderButton = function (target) {
        var widgetSettings = {};
        widgetSettings.checked = target.value;
        widgetSettings.onLabel = NI_SUPPORT.escapeHtml(target.trueContent);
        widgetSettings.offLabel = NI_SUPPORT.escapeHtml(target.falseContent);
        widgetSettings.orientation = target.orientation;
        widgetSettings.disabled = target.readOnly;
        widgetSettings.animationDuration = 25;

        var childElement = document.createElement('div');
        childElement.classList.add('ni-boolean-box');
        target.innerHTML = '';
        target.appendChild(childElement);
        var jqRef = $(childElement);
        jqRef.jqxSwitchButton(widgetSettings);

        // TODO use an undocumented funtion mraj
        jqRef.jqxSwitchButton('_removeEventHandlers');

        // Need to trigger resize manually for standalone case where element extensions does not cause a resize
        computeAndTriggerResize(target);
    };

    var propertyUpdatedSliderButton = function (target, propertyName) {
        var childElement = target.firstElementChild,
            jqref = $(childElement);

        switch (propertyName) {
        case 'readOnly':
            jqref.jqxSwitchButton({
                disabled: target.readOnly
            });
            break;
        case 'orientation':
            // Orientation changes mess with the switch DOM so must reattach
            attachSliderButton(target);
            break;
        case 'trueContent':
            jqref.jqxSwitchButton({
                onLabel: NI_SUPPORT.escapeHtml(target.trueContent)
            });
            break;
        case 'falseContent':
            jqref.jqxSwitchButton({
                offLabel: NI_SUPPORT.escapeHtml(target.falseContent)
            });
            break;
        case 'value':
            jqref.jqxSwitchButton({
                checked: target.value
            });
            break;
        }
    };

    var setFontSliderButton = function (target) {
        // The slider layout breaks with font changes and jqx does calculated layout so trigger a resize so jqx can recalc
        // Have to use resize because the jqx refresh function does not seem to respond to the font change
        computeAndTriggerResize(target);
    };

    var forceResizeSliderButton = function (target, size) {
        var childElement = target.firstElementChild,
            jqRef = $(childElement);

        jqRef.jqxSwitchButton(size);
    };

    // Public Prototype Methods
    proto.addAllProperties = function (targetPrototype) {
        parent.prototype.addAllProperties.call(this, targetPrototype);

        proto.addProperty(targetPrototype, {
            propertyName: 'shape',
            defaultValue: SHAPE_ENUM.SLIDER
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'orientation',
            defaultValue: ORIENTATION_ENUM.HORIZONTAL
        });
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this);

        if (firstCall === true) {
            switch (this.shape) {
            case SHAPE_ENUM.SLIDER:
                attachSliderButton(this);
                break;
            case SHAPE_ENUM.POWER:
                attachPowerButton(this);
                break;
            }
        }

        return firstCall;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        if (propertyName === 'shape') {
            switch (this.shape) {
            case SHAPE_ENUM.SLIDER:
                attachSliderButton(this);
                break;
            case SHAPE_ENUM.POWER:
                attachPowerButton(this);
                break;
            }
        } else {
            switch (this.shape) {
            case SHAPE_ENUM.SLIDER:
                propertyUpdatedSliderButton(this, propertyName);
                break;
            }
        }
    };

    proto.setFont = function (fontSize, fontFamily, fontWeight, fontStyle, textDecoration) {
        parent.prototype.setFont.call(this, fontSize, fontFamily, fontWeight, fontStyle, textDecoration);

        switch (this.shape) {
        case SHAPE_ENUM.SLIDER:
            setFontSliderButton(this);
            break;
        }
    };

    proto.forceResize = function (size) {
        parent.prototype.forceResize.call(this, size);

        switch (this.shape) {
        case SHAPE_ENUM.SLIDER:
            forceResizeSliderButton(this, size);
            break;
        case SHAPE_ENUM.POWER:
            forceResizePowerButton(this, size);
            break;
        }
    };

    proto.defineElementInfo(proto, 'ni-boolean-switch', 'HTMLNIBooleanSwitch');
})(NationalInstruments.HtmlVI.Elements.BooleanSwitch, NationalInstruments.HtmlVI.Elements.BooleanContentControl);

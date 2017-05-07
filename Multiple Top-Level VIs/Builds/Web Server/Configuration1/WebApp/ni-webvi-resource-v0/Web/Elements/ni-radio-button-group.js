//****************************************
// Radio Button Group Prototype
// DOM Registration: HTMLNIRadioButtonGroup
// National Instruments Copyright 2014
//****************************************

NationalInstruments.HtmlVI.Elements.RadioButtonGroup = function () {
    'use strict';
};

// Static Public Variables
NationalInstruments.HtmlVI.Elements.RadioButtonGroup.OrientationEnum = {
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical'
};

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var $ = NationalInstruments.Globals.jQuery;
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var ORIENTATION_ENUM = NationalInstruments.HtmlVI.Elements.RadioButtonGroup.OrientationEnum;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    var attachSingleRadioButton = function (target, groupName, displayValue, checked) {
        var radioButtonElement = document.createElement('div');
        radioButtonElement.classList.add('ni-radio-item');

        var textElement = document.createElement('span');
        textElement.classList.add('ni-text');
        textElement.innerHTML = displayValue;

        radioButtonElement.appendChild(textElement);
        target.appendChild(radioButtonElement);

        var widgetSettings = {
            animationShowDelay: 0,
            animationHideDelay: 0,
            groupName: groupName,
            disabled: target.readOnly,
            checked: checked
        };

        var jqref = $(radioButtonElement).jqxRadioButton(widgetSettings);

        /* TODO mraj we could probably just have a single event listener on the parent element instead of one per child */
        jqref.on('checked', function () {
            target.selectChangedHandler(displayValue);
        });

        return jqref;
    };

    var attachChildrenRadioButton = function (target) {
        // Remove all child controls
        target.innerHTML = '';
        target._jqrefChildrenRadioButton = [];

        var data = target.getSourceAndSelectedIndexFromSource();
        var groupName = NI_SUPPORT.uniqueId();
        var i, jqrefCurr, checked;

        for (i = 0; i < data.source.length; i++) {
            checked = data.selectedIndex === i;
            jqrefCurr = attachSingleRadioButton(target, groupName, data.source[i], checked);
            target._jqrefChildrenRadioButton.push(jqrefCurr);
        }
    };

    // Public Prototype Methods
    proto.addAllProperties = function (targetPrototype) {
        parent.prototype.addAllProperties.call(this, targetPrototype);

        proto.addProperty(targetPrototype, {
            propertyName: 'orientation',
            defaultValue: ORIENTATION_ENUM.VERTICAL
        });
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this);

        if (firstCall === true) {
            attachChildrenRadioButton(this);
        }

        return firstCall;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);
        var that = this,
            data;

        switch (propertyName) {
        case 'items':
            this.itemsCache().cacheDirty();
            attachChildrenRadioButton(this);
            break;
        case 'value':
            data = this.getSourceAndSelectedIndexFromSource(true);
            this._jqrefChildrenRadioButton[data.selectedIndex].jqxRadioButton({
                checked: true
            });
            break;
        case 'readOnly':
            this._jqrefChildrenRadioButton.forEach(function (jqref) {
                jqref.jqxRadioButton({
                    disabled: that.readOnly
                });
            });
            break;
        }
    };

    proto.defineElementInfo(proto, 'ni-radio-button-group', 'HTMLNIRadioButtonGroup');
}(NationalInstruments.HtmlVI.Elements.RadioButtonGroup, NationalInstruments.HtmlVI.Elements.NumericValueSelector));

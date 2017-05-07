//**************************************
//IOName Control Prototype
//DOM Registration: No
//National Instruments Copyright 2014
//**************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.IONameControl = function () {
    'use strict';
};

// Static Public Variables
// None

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var $ = NationalInstruments.Globals.jQuery;
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.addAllProperties = function (targetPrototype) {
        parent.prototype.addAllProperties.call(this, targetPrototype);

        proto.addProperty(targetPrototype, {
            propertyName: 'source',
            defaultValue: '[]',
            fireEvent: true,
            addNonSignalingProperty: true
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'selectedValue',
            defaultValue: '',
            fireEvent: true,
            addNonSignalingProperty: true
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'allowMultipleSelection',
            defaultValue: false
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'allowUndefinedValues',
            defaultValue: false
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'showUserCreateResource',
            defaultValue: false
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'showUserRefresh',
            defaultValue: false
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'showUserBrowse',
            defaultValue: false
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'caseSensitive',
            defaultValue: false
        });

        NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'selectedValue', 'selectedValue', 'selectedValueNonSignaling', 'selected-value-changed');
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this);
        var widgetSettings, jqref, that = this;
        if (firstCall === true) {
            widgetSettings = {};

            var childElement = document.createElement('div');
            childElement.value = this.value;
            childElement.style.width = '100%';
            childElement.style.height = '100%';

            this.appendChild(childElement);
            jqref = $(childElement);

            widgetSettings.selectedIndex = -1;
            widgetSettings.disabled = false;
            widgetSettings.autoDropDownHeight = true;
            var sourceArray = JSON.parse(this.source);
            widgetSettings.selectedIndex = sourceArray.indexOf(this.selectedValue);

            jqref.jqxDropDownList({ source: sourceArray });
            jqref.jqxDropDownList(widgetSettings);

            jqref.on('select', function (event) {
                var args = event.args;
                if (args) {
                    var item = args.item;
                    if (item === null) {
                        that.selectedValue = '';
                    } else {
                        that.selectedValue = item.value;
                    }
                }
            });
        }

        return firstCall;
    };

    proto.forceResize = function (size) {
        parent.prototype.forceResize.call(this, size);
        $(this.firstElementChild).jqxDropDownList(size);
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);
        var childElement = this.firstElementChild;
        switch (propertyName) {
            case 'selectedValue':
                var source = $(childElement).jqxDropDownList('source');
                var index = source.indexOf(this.selectedValue);

                $(childElement).jqxDropDownList({ selectedIndex: index });
                break;
            case 'source':
                var newSource = JSON.parse(this.source);
                $(childElement).jqxDropDownList({ source: newSource });
                break;
            default:
                break;
        }
    };

    proto.defineElementInfo(proto, 'ni-io-name-control', 'HTMLNIIONameControl');
}(NationalInstruments.HtmlVI.Elements.IONameControl, NationalInstruments.HtmlVI.Elements.Visual));

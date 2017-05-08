//**************************************
//Cluster Control Prototype
// DOM Registration: No
//National Instruments Copyright 2014
//**************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.Cluster = function () {
    'use strict';
};

// Static Public Variables
// None

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NI_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.ElementValueConverter;
    var NIType = window.NIType;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    var getElementValue = function (element, propertyName) {
        var value = element[propertyName],
            convertedValue = NI_VAL_CONVERTER.ConvertBack(element, value);
        return convertedValue;
    };

    var setElementValue = function (element, propertyName, value) {
        var convertedValue = NI_VAL_CONVERTER.Convert(element, value);
        element[propertyName] = convertedValue;
    };

    var parseInitialValue = function (attributeValue) {
        var result = {}, parsedVal;
        if (attributeValue !== null) {
            try {
                parsedVal = JSON.parse(attributeValue);
                if (typeof parsedVal === 'object' && parsedVal !== null) {
                    result = parsedVal;
                }
            } catch (e) {
                // If the attribute valid is invalid, we don't want to throw, just fallback to a default
            }
        }

        return result;
    };

    // Public Prototype Methods
    proto.addAllProperties = function (targetPrototype) {
        parent.prototype.addAllProperties.call(this, targetPrototype);

        Object.defineProperty(proto, 'value', {
            get: function () {
                return this._clusterValue;
            },
            set: function (val) {
                this._clusterValue = val;
                this.dispatchEvent(new CustomEvent('value-changed', {
                    bubbles: true,
                    cancelable: false,
                    detail: { value: val }
                }));
                if (this._childValueChanging === false) {
                    this.updateChildValues();
                }
            },
            configurable: false,
            enumerable: true
        });

        Object.defineProperty(proto, 'valueNonSignaling', {
            get: function () {
                return this._clusterValue;
            },
            set: function (val) {
                this._clusterValue = val;
                if (this._childValueChanging === false) {
                    this.updateChildValues();
                }
            },
            configurable: false,
            enumerable: false
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'niType',
            defaultValue: '{"name":"Cluster","fields":[],"subtype":[]}'
        });

        NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'value', 'value', 'valueNonSignaling', 'value-changed');
    };

    proto.makeValueObj = function () {
        var name, i, propertyName,
            valueObj = {},
            niType = new NIType(this.niType),
            clusterFields = niType.getFields();

        for (i = 0; i < clusterFields.length; i++) {
            name = clusterFields[i];
            propertyName = this._childElementsByName[name].valuePropertyDescriptor.propertyName;
            valueObj[name] = getElementValue(this._childElementsByName[name], propertyName);
        }

        return valueObj;
    };

    proto.childChanged = function (evt) {
        if (evt.srcElement === evt.target && this._childValueChanging === false) {
            var valueObj = this.makeValueObj();
            this._childValueChanging = true;
            this.value = valueObj;
            this._childValueChanging = false;
        }
    };

    proto.setChangedListener = function (element, eventName, add) {
        var that = this;
        var callChildChanged = function (evt) {
            that.childChanged(evt);
        };

        if (add) {
            element.addEventListener(eventName, callChildChanged);
        } else {
            element.removeEventListener(eventName, callChildChanged);
        }
    };

    proto.getName = function (childElement) {
        for (var name in this._childElementsByName) {
            if (this._childElementsByName.hasOwnProperty(name)) {
                if (this._childElementsByName[name] === childElement) {
                    return name;
                }
            }
        }

        return '';
    };

    proto.getLabel = function (childElement) {
        var i, label;
        var labelId = childElement.labelId;

        if (labelId !== undefined && labelId !== '') {
            for (i = 0; i < this.childNodes.length; i++) {
                if (this.childNodes[i].niControlId === labelId) {
                    label = this.childNodes[i].text;
                    break;
                }
            }
        }

        return label;
    };

    proto.updateChildElements = function () {
        var name, i, eventName;
        for (name in this._childElementsByName) {
            if (this._childElementsByName.hasOwnProperty(name)) {
                var child = this._childElementsByName[name];
                if (child.valuePropertyDescriptor !== undefined) {
                    eventName = child.valuePropertyDescriptor.eventName;
                    this.setChangedListener(child, eventName, false);
                }
            }
        }

        this._childElementsByName = {};
        for (i = 0; i < this.childNodes.length; i++) {
            var childNode = this.childNodes[i], label = this.getLabel(childNode);
            if (label !== undefined) {
                this._childElementsByName[label] = childNode;
                if (childNode.valuePropertyDescriptor !== undefined) {
                    eventName = childNode.valuePropertyDescriptor.eventName;
                    this.setChangedListener(childNode, eventName, true);
                }
            }
        }

        this.updateChildValues();
    };

    proto.createdCallback = function () {
        parent.prototype.createdCallback.call(this);

        // Private Instance Properties
        this._childValueChanging = false;
        this._childElementsByName = {};
        this._clusterValue = parseInitialValue(this.getAttribute('value'));
    };

    proto.attachedCallback = function () {
        var that = this;
        var firstCall = parent.prototype.attachedCallback.call(this);

        if (firstCall) {
            NationalInstruments.HtmlVI.Elements.NIElement.addNIEventListener('attached', function () {
                that.updateChildElements();
            });
        }

        return firstCall;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        switch (propertyName) {
            case 'niType':
                this.updateChildElements();
                break;
            default:
                break;
        }
    };

    proto.updateChildValues = function () {
        var i = 0;
        var valueObj = this._clusterValue;
        for (i = 0; i < this.childNodes.length; i++) {
            var child = this.childNodes[i];
            if (NI_SUPPORT.isElement(child) && child.tagName !== 'NI-LABEL' && child.valuePropertyDescriptor !== undefined) {
                var propName = child.valuePropertyDescriptor.propertyNameNonSignaling;
                var name = this.getName(child);
                if (valueObj[name] !== undefined) {
                    this._childValueChanging = true;
                    setElementValue(child, propName, valueObj[name]);
                    this._childValueChanging = false;
                } else {
                    NI_SUPPORT.infoVerbose('Invalid cluster type' + this.value + ' name: ' + name);
                }
            }
        }
    };

    proto.defineElementInfo(proto, 'ni-cluster', 'HTMLNICluster');
}(NationalInstruments.HtmlVI.Elements.Cluster, NationalInstruments.HtmlVI.Elements.Visual));

/*global NationalInstruments*/
//****************************************
// Numeric Value Selector Prototype
// DOM Registration: No
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.NumericValueSelector = function () {
    'use strict';
};

// Static Public Variables
// None

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NUM_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.NumericValueConverter;
    var NIType = window.NIType;
    var NITypeNames = window.NITypeNames;

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
            propertyName: 'value',
            defaultValue: { stringValue: '0', numberValue: 0 },
            fireEvent: true,
            addNonSignalingProperty: true
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'niType',
            defaultValue: NITypeNames.INT32
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'items',
            defaultValue: '[]'
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'popupEnabled',
            defaultValue: false
        });

        NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'value', 'value', 'valueNonSignaling', 'value-changed');
    };

    proto.compareIndexValue = function (value1, value2) {
        if (typeof value1 === typeof value2) {
            return value1 === value2;
        } else {
            // todo
            return parseFloat(value1) === parseFloat(value2);
        }
    };

    proto.itemsCache = function () {
        var that = this;
        if (!that.itemsArray) {
            that.itemsArray = JSON.parse(that.items);
        }

        function updateItemsArray() {
            that.itemsArray = JSON.parse(that.items);
        }

        function pushItem(newItem) {
            that.itemsArray.push(newItem);
            that.items = JSON.stringify(that.itemsArray);
        }

        function popItem() {
            that.itemsArray.pop();
            that.items = JSON.stringify(that.itemsArray);
        }

        return {
            itemsArray: that.itemsArray,
            cacheDirty: updateItemsArray,
            writeThrough: pushItem,
            pop: popItem
        };
    };

    // create the source array from the items which contain both ringvalue and ringindex. we may need to insert new dropdown item when necessary
    // and then calculate the selectedIndex based on the ringIndex which coud be very different from the index of the dropdown item.
    // the format of the ring source is [{value:3, displayvalue:'first'}, {value:7, displayvalue:'second'},..]
    // Note: The displayvalue is a non html escaped string so this function escapes it when used for display as most of the jqwidgets insert as html directly
    proto.getSourceAndSelectedIndexFromSource = function (allowCreateNewSelectedItem) {

        var result = {};
        var source = [];
        var selectedIndex = -1;
        var niValueType = new NIType(this.niType);
        var numericIndex = NUM_VAL_CONVERTER.convertBack(this.value, niValueType);
        var itemsArray = this.itemsCache().itemsArray;
        for (var i = 0; i < itemsArray.length; i++) {
            var item = itemsArray[i];
            var escapedDisplayValue = NI_SUPPORT.escapeHtml(item.displayValue);
            source.push(escapedDisplayValue);
            if (this.compareIndexValue(item.value, numericIndex)) {
                selectedIndex = i;
            }
        }

        if (allowCreateNewSelectedItem) {
            if (selectedIndex < 0) {
                source.push('<' + numericIndex + '>');
                selectedIndex = source.length - 1;
            }
        }

        result.source = source;
        result.selectedIndex = selectedIndex;
        return result;
    };

    // handler to update the property when the dropdown selection changed
    proto.selectChangedHandler = function (selectValue) {
        var itemsArray = this.itemsCache().itemsArray,
            numericIndex = -1,
            niValueType = new NIType(this.niType);
        for (var i = 0; i < itemsArray.length; i++) {
            var item = itemsArray[i];
            var escapedDisplayValue = NI_SUPPORT.escapeHtml(item.displayValue);
            if (item.displayValue === selectValue || escapedDisplayValue === selectValue) {
                numericIndex = item.value;
                this.value = NUM_VAL_CONVERTER.convert(numericIndex, niValueType, true);
                break;
            }
        }

        return numericIndex;
    };

    proto.propertyUpdatedHelper = function (propertyName, jqref, allowCreateNewSelectedItem) {
        switch (propertyName) {
            case 'items':
                this.itemsCache().cacheDirty();
                var data = this.getSourceAndSelectedIndexFromSource(allowCreateNewSelectedItem);
                var selectedIndex = data.selectedIndex;
                var source = data.source;
                jqref.jqxDropDownList({ source: source, selectedIndex: selectedIndex });
                break;
            case 'value':
                data = this.getSourceAndSelectedIndexFromSource(true);
                source = data.source;
                selectedIndex = data.selectedIndex;
                if (source.length === jqref.jqxDropDownList('source').length || allowCreateNewSelectedItem === false) {
                    jqref.jqxDropDownList({ selectedIndex: selectedIndex });
                } else {
                    var niValueType = new NIType(this.niType);
                    var newItem = { value: NUM_VAL_CONVERTER.convertBack(this.value, niValueType), displayValue: source[source.length - 1] };
                    this.itemsCache().writeThrough(newItem);
                    jqref.jqxDropDownList({ source: source, selectedIndex: selectedIndex });
                }

                break;
            case 'readOnly':
                jqref.jqxDropDownList({ disabled: this.readOnly });
                break;
            default:
                break;
        }
    };

}(NationalInstruments.HtmlVI.Elements.NumericValueSelector, NationalInstruments.HtmlVI.Elements.Visual));

//****************************************
// ListBox
// DOM Registration: No
// National Instruments Copyright 2015
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.ListBox = function () {
    'use strict';
};

// Static Public Variables
// None

// Static Public Functions
// None

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var SELECTION_MODE_ENUM = NationalInstruments.HtmlVI.NIListBox.SelectionModeEnum;
    var $ = NationalInstruments.Globals.jQuery;
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var SELECTOR = NationalInstruments.HtmlVI.Elements.Selector;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    var getJqxListBoxSelectedIndices = function (jqref) {
        var items = jqref.jqxListBox('getSelectedItems');
        if (items.length === 0 || (items.length === 1 && items[0] === undefined)) {
            return [];
        }

        return items.map(function (obj) {
            return obj.index;
        });
    };

    var setJqxListBoxSelectedIndices = function (target, indices, updateModel) {
        var i;
        target._isSelecting = true;
        target._jqref.jqxListBox('clearSelection');
        for (i = 0; i < indices.length; i++) {
            target._jqref.jqxListBox('selectIndex', indices[i]);
        }

        target._isSelecting = false;

        if (updateModel === true) {
            target.selectedIndex = JSON.stringify(indices);
        }
    };

    var selectedIndicesMatch = function (jqref, elementSelectedIndices) {
        var i,
            jqxIndices = getJqxListBoxSelectedIndices(jqref).sort(),
            parsedIndices = JSON.parse(elementSelectedIndices).sort();

        if (jqxIndices.length !== parsedIndices.length) {
            return false;
        }

        for (i = 0; i < jqxIndices.length; i++) {
            if (jqxIndices[i] !== parsedIndices[i]) {
                return false;
            }
        }

        return true;
    };

    // Public Prototype Methods
    proto.addAllProperties = function (targetPrototype) {
        parent.prototype.addAllProperties.call(this, targetPrototype);

        proto.addProperty(targetPrototype, {
            propertyName: 'selectedIndex',
            defaultValue: '[]',
            fireEvent: true,
            addNonSignalingProperty: true
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'niType',
            defaultValue: '{"name":"Array","rank":1,"subtype":"Int32"}'
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'selectionMode',
            defaultValue: SELECTION_MODE_ENUM.ONE
        });

        NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'selectedIndex', 'selectedIndex', 'selectedIndexNonSignaling', 'selected-index-changed');
    };

    proto.updateSelectionMode = function (jqref) {
        var settings = {
            multiple: this.selectionMode !== SELECTION_MODE_ENUM.ONE
        };

        jqref.jqxListBox(settings);
    };

    proto.coerceSelection = function (jqref) {
        var selectedIndex = JSON.parse(this.selectedIndex);
        var items = getJqxListBoxSelectedIndices(jqref);
        var newSelection = items.filter(function (a) {
            return selectedIndex.indexOf(a) === -1;
        });
        var revertSelection = (items.length > 1 && (this.selectionMode === SELECTION_MODE_ENUM.ONE || this.selectionMode === SELECTION_MODE_ENUM.ZERO_OR_ONE)) ||
                              (items.length === 0 && (this.selectionMode === SELECTION_MODE_ENUM.ONE || this.selectionMode === SELECTION_MODE_ENUM.ONE_OR_MORE));
        var firstSelectedIndex, coercedSelectedIndices, src, firstValidIndexArray;
        if (revertSelection) {
            src = SELECTOR.parseAndEscapeSource(this.source);
            firstValidIndexArray = Array.isArray(src) && src.length > 0 ? [0] : [];
            if (newSelection.length > 0) {
                firstSelectedIndex = [newSelection[0]];
            } else {
                firstSelectedIndex = selectedIndex.length > 0 ? [selectedIndex[0]] : [];
            }

            switch (this.selectionMode) {
                case SELECTION_MODE_ENUM.ZERO_OR_ONE:
                    coercedSelectedIndices = firstSelectedIndex;
                    break;
                case SELECTION_MODE_ENUM.ONE:
                    coercedSelectedIndices = firstSelectedIndex.length === 1 ? firstSelectedIndex : firstValidIndexArray;
                    break;
                case SELECTION_MODE_ENUM.ONE_OR_MORE:
                    coercedSelectedIndices = selectedIndex.length > 0 ? selectedIndex : firstValidIndexArray;
                    break;
            }

            setJqxListBoxSelectedIndices(this, coercedSelectedIndices, true);
        } else {
            this.selectedIndex = JSON.stringify(items);
        }
    };

    proto.createdCallback = function () {
        parent.prototype.createdCallback.call(this);

        this._jqref = undefined;
        this._isSelecting = false;
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this),
            widgetSettings,
            childElement,
            currStyle,
            that = this;

        if (firstCall === true) {
            currStyle = window.getComputedStyle(this);
            widgetSettings = {};

            childElement = document.createElement('div');
            childElement.classList.add('ni-list-box-container');
            this.appendChild(childElement);

            this._jqref = $(childElement);
            widgetSettings.source = SELECTOR.parseAndEscapeSource(this.source);
            widgetSettings.itemHeight = parseFloat(currStyle.fontSize);
            this._jqref.jqxListBox(widgetSettings);
            setJqxListBoxSelectedIndices(this, this.selectedIndex);
            this.updateSelectionMode(this._jqref);
            this._jqref.on('change', function () {
                if (!selectedIndicesMatch(that._jqref, that.selectedIndex) && that._isSelecting !== true) {
                    that.coerceSelection(that._jqref);
                }
            });
        }

        return firstCall;
    };

    proto.setFont = function (fontSize, fontFamily, fontWeight, fontStyle, textDecoration) {
        parent.prototype.setFont.call(this, fontSize, fontFamily, fontWeight, fontStyle, textDecoration);

        this._jqref.jqxListBox({
            itemHeight: parseFloat(fontSize)
        });
    };

    proto.forceResize = function (size) {
        parent.prototype.forceResize.call(this, size);
        this._jqref.jqxListBox(size);
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        switch (propertyName) {
            case 'source':
                this._jqref.jqxListBox({ source: SELECTOR.parseAndEscapeSource(this.source) });
                break;
            case 'selectedIndex':
                if (!selectedIndicesMatch(this._jqref, this.selectedIndex)) {
                    setJqxListBoxSelectedIndices(this, JSON.parse(this.selectedIndex));
                }

                break;
            case 'selectionMode':
                this.updateSelectionMode(this._jqref);
                break;
        }
    };

    proto.defineElementInfo(proto, 'ni-list-box', 'HTMLNIListBox');
}(NationalInstruments.HtmlVI.Elements.ListBox, NationalInstruments.HtmlVI.Elements.Selector));

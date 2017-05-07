(function () {
    'use strict';

    // Static private reference aliases
    var SELECTION_MODE_ENUM = NationalInstruments.HtmlVI.NIListBox.SelectionModeEnum;

    NationalInstruments.HtmlVI.ValueConverters.ListBoxValueConverter = function () {
        // Private variables
    };

    var listBoxValueConverter = NationalInstruments.HtmlVI.ValueConverters.ListBoxValueConverter;

    // Public methods
    // Model -> Element
    listBoxValueConverter.convert = function (selectedIndex, params) {
        // jshint unused: vars
        var result = selectedIndex;
        if (!Array.isArray(selectedIndex)) {
            result = selectedIndex === -1 ? [] : [selectedIndex];
        }

        return JSON.stringify(result);
    };

    // Element -> Model
    listBoxValueConverter.convertBack = function (selectedIndex, selectionMode) {
        var result = JSON.parse(selectedIndex);
        if (selectionMode === SELECTION_MODE_ENUM.ZERO_OR_ONE || selectionMode === SELECTION_MODE_ENUM.ONE) {
            return result.length > 0 ? result[0] : -1;
        } else {
            return result;
        }
    };

}());

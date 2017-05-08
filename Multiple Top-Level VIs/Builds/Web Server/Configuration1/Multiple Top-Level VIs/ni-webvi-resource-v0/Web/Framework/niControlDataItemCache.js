//****************************************
// NI Control Data Item Cache
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    //var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ControlDataItemCache = function (viModels) {

        // Public Instance Properties
        // None

        // Private Instance Properties
        this._dataItemToControlMap = undefined;
        this.viModels = viModels;
    };

    // Static Public Variables
    // None

    // Static Public Functions
    var createDataItemMaps = function (viModels) {
        var dataItemMap = {};

        for (var viModelName in viModels) {
            if (viModels.hasOwnProperty(viModelName)) {

                var viModel = viModels[viModelName],
                    controlModels = viModel.getAllControlModels();

                if (dataItemMap[viModelName] === undefined) {
                    dataItemMap[viModelName] = {};
                }

                for (var controlId in controlModels) {
                    if (controlModels.hasOwnProperty(controlId)) {

                        var controlModel = controlModels[controlId],
                            editorRuntimeBindingInfo = controlModel.getEditorRuntimeBindingInfo();

                        if (editorRuntimeBindingInfo !== undefined) {
                            dataItemMap[viModelName][editorRuntimeBindingInfo.dataItem] = editorRuntimeBindingInfo;
                        }
                    }
                }
            }
        }

        return dataItemMap;
    };

    // Prototype creation
    var child = NationalInstruments.HtmlVI.ControlDataItemCache;
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.getEditorRuntimeBindingInfo = function (viModelName, dataItem) {
        var info;
        if (this._dataItemToControlMap === undefined || this._dataItemToControlMap[viModelName] === undefined) {
            this._dataItemToControlMap = createDataItemMaps(this.viModels);
        }

        info = this._dataItemToControlMap[viModelName][dataItem];
        if (info === undefined) {
            throw new Error('Missing editorRuntimeBindingInfo - are you sure the model was created?');
        }

        return info;
    };

}());

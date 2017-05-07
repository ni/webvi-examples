//****************************************
// NI Control DCO Index Cache
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    //var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ControlDCOIndexCache = function (viModels) {

        // Public Instance Properties
        // None

        // Private Instance Properties
        this._dcoIndexToControlMap = undefined;
        this.viModels = viModels;
    };

    // Static Public Variables
    // None

    // Static Public Functions
    var createDCOIndexMaps = function (viModels) {
        var dcoIndexMap = {};

        for (var viModelName in viModels) {
            if (viModels.hasOwnProperty(viModelName)) {

                var viModel = viModels[viModelName],
                    controlModels = viModel.getAllControlModels();

                if (dcoIndexMap[viModelName] === undefined) {
                    dcoIndexMap[viModelName] = {};
                }

                for (var controlId in controlModels) {
                    if (controlModels.hasOwnProperty(controlId)) {
                        var controlModel = controlModels[controlId],
                            remoteBindingInfo = controlModel.getRemoteBindingInfo();

                        if (remoteBindingInfo !== undefined) {
                            dcoIndexMap[viModelName][remoteBindingInfo.dco] = remoteBindingInfo;
                        }
                    }
                }
            }
        }

        return dcoIndexMap;
    };

    // Prototype creation
    var child = NationalInstruments.HtmlVI.ControlDCOIndexCache;
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.getRemoteBindingInfo = function (viModelName, dcoIndex) {
        if (this._dcoIndexToControlMap === undefined || this._dcoIndexToControlMap[viModelName] === undefined) {
            this._dcoIndexToControlMap = createDCOIndexMaps(this.viModels);
        }

        return this._dcoIndexToControlMap[viModelName][dcoIndex];
    };

}());

//****************************************
// NI LabVIEW VI Ref Service Singleton
// National Instruments Copyright 2014
// Service that manages vis and controls that register using a vi-ref identifier
//****************************************

NationalInstruments.HtmlVI.viReferenceService = (function () {
    'use strict';

    // The viRefs should be globally unique
    var viRefToVIModel = {};
    var viRefToVIViewModel = {};
    var viRefToWebAppModel = {};
    var webAppInstanceIdToVIModels = {}; // { webAppInstanceId1: {'viname1': vivm1, 'viname2': vivm2} }

    var registerVIElement = function (viElement) {
        var viViewModel, viModel, webAppElement, webAppModel;

        if (viElement instanceof NationalInstruments.HtmlVI.Elements.VirtualInstrument === false) {
            throw new Error('The viReferenceService only registers ni-virtual-instrument elements');
        }

        if (viRefToVIModel[viElement.viRef] !== undefined) {
            throw new Error('A virtual instrument with the following vi-ref has already been defined: ' + viElement.viRef);
        }

        if (viRefToWebAppModel[viElement.viRef] !== undefined) {
            throw new Error('A web application containing the following vi-ref has already been defined: ' + viElement.viRef);
        }

        webAppElement = viElement.parentElement;

        if (webAppElement instanceof NationalInstruments.HtmlVI.Elements.WebApplication === false) {
            throw new Error('Virtual Instrument Elements must be direct children of Web Application Elements for registration to complete');
        }

        webAppModel = NationalInstruments.HtmlVI.webApplicationModelsService.getModel(webAppElement);

        if (webAppModel === undefined) {
            throw new Error('Web Application View Model has not been created yet');
        }

        // Create the Model
        viModel = new NationalInstruments.HtmlVI.Models.VirtualInstrumentModel();

        // Create the ViewModel
        viViewModel = new NationalInstruments.HtmlVI.ViewModels.VirtualInstrumentViewModel(viElement, viModel);
        viViewModel.updateModelFromElement();

        // Complete Model - ViewModel binding
        viModel.registerListener(viViewModel);

        if (webAppInstanceIdToVIModels[webAppModel.webAppInstanceId] === undefined) {
            webAppInstanceIdToVIModels[webAppModel.webAppInstanceId] = {};
        }

        if (webAppInstanceIdToVIModels[webAppModel.webAppInstanceId][viModel.viName] !== undefined) {
            throw new Error('Web applications cannot have multiple VIs with the same name');
        }

        webAppInstanceIdToVIModels[webAppModel.webAppInstanceId][viModel.viName] = viModel;
        viRefToVIModel[viModel.viRef] = viModel;
        viRefToVIViewModel[viModel.viRef] = viViewModel;
        viRefToWebAppModel[viModel.viRef] = webAppModel;
    };

    var unregisterVIElement = function (viElement) {
        var viModel = viRefToVIModel[viElement.viRef];
        var viViewModel = viRefToVIViewModel[viElement.viRef];
        var owningWebAppModel = viRefToWebAppModel[viElement.viRef];

        if (viModel instanceof NationalInstruments.HtmlVI.Models.VirtualInstrumentModel === false ||
           viViewModel instanceof NationalInstruments.HtmlVI.ViewModels.VirtualInstrumentViewModel === false ||
           owningWebAppModel instanceof NationalInstruments.HtmlVI.Models.WebApplicationModel === false) {

            throw new Error('ni-virtual-instrument with vi-ref (' + viElement.viRef + ') and vi-name (' + viElement.viName + ') was not properly registered and cannot be unregistered');
        }

        var viModelsMap = webAppInstanceIdToVIModels[owningWebAppModel.webAppInstanceId];

        if (viModelsMap === undefined || viModelsMap[viModel.viName] instanceof NationalInstruments.HtmlVI.Models.VirtualInstrumentModel === false) {
            throw new Error('ni-virtual-instrument with vi-ref (' + viElement.viRef + ') and vi-name (' + viElement.viName + ') was not properly registered and cannot be unregistered');
        }

        viModel.unregisterListener(viViewModel);
        viRefToVIModel[viElement.viRef] = undefined;
        viRefToVIViewModel[viElement.viRef] = undefined;
        viRefToWebAppModel[viElement.viRef] = undefined;

        delete webAppInstanceIdToVIModels[owningWebAppModel.webAppInstanceId][viModel.viName];
    };

    var getVIModelByVIRef = function (viRefString) {
        if (viRefToVIModel[viRefString] === undefined) {
            throw new Error('Cannot find the VI');
        }

        return viRefToVIModel[viRefString];
    };

    var getVIViewModelByVIRef = function (viRefString) {
        if (viRefToVIViewModel[viRefString] === undefined) {
            throw new Error('Cannot find the VI');
        }

        return viRefToVIViewModel[viRefString];
    };

    var getAllVIModelsForWebAppModel = function (webAppModel) {
        if (webAppModel instanceof NationalInstruments.HtmlVI.Models.WebApplicationModel === false || webAppInstanceIdToVIModels[webAppModel.webAppInstanceId] === undefined) {
            throw new Error('Cannot find VIs for the Web Application Model');
        }

        return webAppInstanceIdToVIModels[webAppModel.webAppInstanceId];
    };

    var getWebAppModelByVIRef = function (viRefString) {
        if (viRefToWebAppModel[viRefString] === undefined) {
            throw new Error('Cannot find the web app');
        }

        return viRefToWebAppModel[viRefString];
    };

    // Methods exported by the service
    return {
        registerVIElement: registerVIElement,
        unregisterVIElement: unregisterVIElement,
        getVIModelByVIRef: getVIModelByVIRef,
        getVIViewModelByVIRef: getVIViewModelByVIRef,
        getAllVIModelsForWebAppModel: getAllVIModelsForWebAppModel,
        getWebAppModelByVIRef: getWebAppModelByVIRef
    };
}());

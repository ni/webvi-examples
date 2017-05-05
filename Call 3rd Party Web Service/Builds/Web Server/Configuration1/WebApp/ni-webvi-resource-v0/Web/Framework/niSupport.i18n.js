//****************************************
// Support functions
// National Instruments Copyright 2014
//****************************************
(function ($) {
    'use strict';
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // TODO mraj these globals need to be refactored, they show up in elements as well
    // this is a workaround for the fact that coherent does not set the navigator.language property
    // it is a place to hang the language
    window.NIEmbeddedBrowser = {};
    window.NIEmbeddedBrowser.language = 'en-US';
    window.NIEmbeddedBrowser.formatLanguage = 'en-US';

    // The i18n function will only be defined when language loading is resolved below
    NI_SUPPORT.i18n = undefined;

    NI_SUPPORT.InternationalizationInitializer = {};
    NI_SUPPORT.InternationalizationInitializer.TaskTrackerEnum = Object.freeze({
        LANGUAGES_LOADED: 'LANGUAGES_LOADED',
        ELEMENT_PROTOTYPES_READY: 'ELEMENT_PROTOTYPES_READY'
    });

    NI_SUPPORT.InternationalizationInitializer.TaskTracker = new NationalInstruments.HtmlVI.TaskTracker(NI_SUPPORT.InternationalizationInitializer.TaskTrackerEnum, function () {
        NationalInstruments.HtmlVI.Elements.NIElement._registerElements();
        NationalInstruments.JQXElement._registerElements();
    });

    var I18N_INIT_ENUM = NI_SUPPORT.InternationalizationInitializer.TaskTrackerEnum;
    var I18N_INIT_TASK_TRACKER = NI_SUPPORT.InternationalizationInitializer.TaskTracker;

    var getLanguage = function () {
        // TODO mraj Previously this function would attempt to detect if running in the editor and use a hardcoded language and return undefined in the browser
        // It was expected that the localization library will correctly determine the language when passed undefined, however the library fails on Android preventing page load
        return window.NIEmbeddedBrowser.language;
    };

    var getLocalizationResourcePath = function () {
        // This function assumes that this script is in Web/Framework/, and we want to return a valid path to the Web/Localization/ folder.
        // We look this up dynamically because the Web VI HTML page can be deployed in a folder hierarchy, and our static resource
        // root folder path is some number of directories up above that, but it changes based on how the user configures their project.
        var currentScript = window.document.currentScript;
        if (currentScript !== null && currentScript !== undefined) {
            var scriptSrc = currentScript.src;
            var frameworkPath = scriptSrc.substring(0, scriptSrc.lastIndexOf('/'));
            return frameworkPath + '/../Localization/'; // TODO mraj this should be user configurable, probably via an element or something
        }

        return '';
    };

    $.i18n.properties({
        name: 'Messages',
        language: getLanguage(),
        path: getLocalizationResourcePath(),
        mode: 'map',
        cache: true,
        async: true,
        callback: function () {
            // TODO mraj I don't trust the library, so verify it is not called twice
            if (NI_SUPPORT.i18n !== undefined) {
                NI_SUPPORT.error('The i18n completion callback is being called multiple times');
                return;
            }

            NI_SUPPORT.i18n = function () {
                return $.i18n.prop.apply($.i18n, arguments);
            };

            // Complete task after updating the i18n function so it can be used on completion
            I18N_INIT_TASK_TRACKER.complete(I18N_INIT_ENUM.LANGUAGES_LOADED);
        }
    });

}(window.jQuery));

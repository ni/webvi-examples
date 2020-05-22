//**********************************************************
// Detect if the main bundle failed to load
// National Instruments Copyright 2020
//**********************************************************
(function () {
    'use strict';
    if (window.NationalInstrumentsMainModuleLoaded !== true) {
        const resourceLoadBanner = document.getElementById('ni-failed-to-load-vireo-source');
        if (resourceLoadBanner !== null) {
            resourceLoadBanner.style.display = 'block';
        }
    }
}());

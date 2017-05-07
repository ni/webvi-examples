//****************************************
// Custom Element Registration
// National Instruments Copyright 2014
//****************************************

(function () {
    'use strict';
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var I18N_INIT_ENUM = NI_SUPPORT.InternationalizationInitializer.TaskTrackerEnum;
    var I18N_INIT_TASK_TRACKER = NI_SUPPORT.InternationalizationInitializer.TaskTracker;

    I18N_INIT_TASK_TRACKER.complete(I18N_INIT_ENUM.ELEMENT_PROTOTYPES_READY);
}());

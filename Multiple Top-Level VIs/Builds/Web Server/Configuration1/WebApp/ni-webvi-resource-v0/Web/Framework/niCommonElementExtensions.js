//****************************************
// Common Custom Element Extensions
// National Instruments Copyright 2014
//****************************************
// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.CommonElementExtensions = {};
(function () {
    'use strict';
    // attached property names and variants
    var NI_COMMON = NationalInstruments.HtmlVI.CommonElementExtensions;
    NI_COMMON.LABELID = 'labelId';
    NI_COMMON._LABELID = '_labelId';
    NI_COMMON.LABEL_ID = 'label-id';
    NI_COMMON.NICONTROLID = 'niControlId';
    NI_COMMON._NICONTROLID = '_niControlId';
    NI_COMMON.NI_CONTROL_ID = 'ni-control-id';
    NI_COMMON.VIREF = 'viRef';
    NI_COMMON._VIREF = '_viRef';
    NI_COMMON.VI_REF = 'vi-ref';
    NI_COMMON.BINDINGINFO = 'bindingInfo';
    NI_COMMON._BINDINGINFO = '_bindingInfo';
    NI_COMMON.BINDING_INFO = 'binding-info';

    NationalInstruments.HtmlVI.CommonElementExtensions.generateClearExtensionProperties = function () {
        return function clearExtensionProperties() {
            if (this.niControlId !== undefined) {
                this.niControlId = '';
                this.viRef = '';
                this.bindingInfo = {
                    prop: '',
                    field: '',
                    order: -1,
                    sync: false,
                    dco: -1,
                    dataItem: '',
                    vireoType: '',
                    unplacedOrDisabled: false
                };
                this.labelId = '';
            }
        };
    };
}());


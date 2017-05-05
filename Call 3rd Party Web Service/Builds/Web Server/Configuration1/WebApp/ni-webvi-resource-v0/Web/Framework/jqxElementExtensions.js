//****************************************
// Custom Element Extensions
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var COMMON_EXTENSIONS = NationalInstruments.HtmlVI.CommonElementExtensions;

    // The list of jqx elements that we support along with their element info
    var _elements = [];
    _elements.push({ tagName: 'jqx-numeric-text-box', propertyName: 'value', attributeName: 'value', eventName: 'change', isTextEditFocusable: true });
    _elements.push({ tagName: 'jqx-progress-bar', propertyName: 'value', attributeName: 'value', eventName: '', isTextEditFocusable: false });
    _elements.push({ tagName: 'jqx-circular-progress-bar', propertyName: 'value', attributeName: 'value', eventName: '', isTextEditFocusable: false });
    _elements.push({ tagName: 'jqx-tank', propertyName: 'value', attributeName: 'value', eventName: 'change', isTextEditFocusable: false });
    _elements.push({ tagName: 'jqx-slider', propertyName: 'value', attributeName: 'value', eventName: 'change', isTextEditFocusable: false });
    _elements.push({ tagName: 'jqx-gauge', propertyName: 'value', attributeName: 'value', eventName: 'change', isTextEditFocusable: false });
    _elements.push({ tagName: 'jqx-toggle-button', propertyName: 'value', attributeName: 'value', eventName: 'change', isTextEditFocusable: false });
    _elements.push({ tagName: 'jqx-switch-button', propertyName: 'checked', attributeName: 'checked', eventName: 'change', isTextEditFocusable: false });
    _elements.push({ tagName: 'jqx-power-button', propertyName: 'checked', attributeName: 'checked', eventName: 'change', isTextEditFocusable: false });
    _elements.push({ tagName: 'jqx-led', propertyName: 'checked', attributeName: 'checked', eventName: 'change', isTextEditFocusable: false });
    _elements.push({ tagName: 'jqx-checkbox', propertyName: 'checked', attributeName: 'checked', eventName: 'change', isTextEditFocusable: false });

    var create = function (element, elementInfo) {
        var bindingInfo;

        Object.defineProperty(element, 'niElementInstanceId', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: NI_SUPPORT.uniqueId()
        });

        // update internal properties from attribute values
        element.niControlId = element.getAttribute(COMMON_EXTENSIONS.NI_CONTROL_ID);
        element.labelId = element.getAttribute(COMMON_EXTENSIONS.LABEL_ID);
        bindingInfo = element.getAttribute(COMMON_EXTENSIONS.BINDING_INFO);
        if (bindingInfo !== null && typeof bindingInfo === 'string') {
            bindingInfo = JSON.parse(bindingInfo);
            element.bindingInfo = bindingInfo;
        }

        element.viRef = element.getAttribute(COMMON_EXTENSIONS.VI_REF);
        element._temporarySettingsHolder = {};
        Object.defineProperty(element, 'isTextEditFocusable', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: function () {
                return elementInfo.isTextEditFocusable;
            }
        });
        Object.defineProperty(element, 'setFont', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: function (fontSize, fontFamily, fontWeight, fontStyle, textDecoration) {
                this.style.fontSize = fontSize;
                this.style.fontFamily = fontFamily;
                this.style.fontWeight = fontWeight;
                this.style.fontStyle = fontStyle;
                this.style.textDecoration = textDecoration;
            }
        });
    };

    var attach = function (element) {
        if (!element.firstAttach) {
            element.firstAttach = true;
            return;
        }

        // this is for reparenting. Properties set in attach will not be applied to the elements appearance
        // (but during reparenting they are not changing anyway)
        setup(element);
    };

    var ready = function (element) {
        element.firstAttach = false;
        // this is for first time setup - the properties set here will be applied to the elements appearance
        setup(element);
    };

    var setup = function (element) {
        var viViewModel, controlModelViewModel;
        element.viRef = '';
        element.removeAttribute('data-ni-base-style');
        if (element._preventModelCreation !== true && element.niControlId !== 'null' && element.niControlId !== null) {
            viViewModel = NationalInstruments.HtmlVI.viReferenceService.getVIViewModelByVIRef(element.viRef);
            controlModelViewModel = viViewModel.attachElementToModelAndViewModel(element);
            controlModelViewModel.controlViewModel.bindToView();
        }
    };

    var detach = function (element) {
        var viViewModel,
            webAppModel;

        if (element._preventModelCreation !== true && element.niControlId !== 'null' && element.niControlId !== null) {
            viViewModel = NationalInstruments.HtmlVI.viReferenceService.getVIViewModelByVIRef(element.viRef);
            viViewModel.detachElementFromModelAndViewModel(element);
            webAppModel = NationalInstruments.HtmlVI.viReferenceService.getWebAppModelByVIRef(element.viRef);
            if (webAppModel.updateService !== undefined) {
                webAppModel.updateService.maybeAddToElementCache(element);
            }
        }
    };

    var addProperties = function (proto, elementInfo) {
        proto.clearExtensionProperties = NationalInstruments.HtmlVI.CommonElementExtensions.generateClearExtensionProperties();

        Object.defineProperty(proto, 'elementInfo', {
            configurable: false,
            enumerable: true,
            value: { tagName: elementInfo.tagName },
            writable: true
        });

        NI_SUPPORT.setValuePropertyDescriptor(proto, elementInfo.attributeName, elementInfo.propertyName, elementInfo.propertyName, elementInfo.eventName);

        Object.defineProperty(proto, COMMON_EXTENSIONS.NICONTROLID, {
            configurable: false,
            enumerable: true,
            get: function () {
                if (this[COMMON_EXTENSIONS._NICONTROLID] !== undefined) {
                    return this[COMMON_EXTENSIONS._NICONTROLID];
                } else {
                    this[COMMON_EXTENSIONS._NICONTROLID] = this.getAttribute(COMMON_EXTENSIONS.NI_CONTROL_ID);
                    return this[COMMON_EXTENSIONS._NICONTROLID];
                }
            },
            set: function (value) {
                this._niControlId = value;
                this.setAttribute(COMMON_EXTENSIONS.NI_CONTROL_ID, value);
            }
        });

        Object.defineProperty(proto, COMMON_EXTENSIONS.VIREF, {
            configurable: false,
            enumerable: true,
            get: function () {
                if (this[COMMON_EXTENSIONS._VIREF] !== undefined) {
                    return this[COMMON_EXTENSIONS._VIREF];
                } else {
                    this[COMMON_EXTENSIONS._VIREF] = this.getAttribute(COMMON_EXTENSIONS.VI_REF);
                    return this[COMMON_EXTENSIONS._VIREF];
                }
            },
            set: function (value) {
                this._viRef = value;
                this.setAttribute(COMMON_EXTENSIONS.VI_REF, value);
            }
        });

        Object.defineProperty(proto, COMMON_EXTENSIONS.BINDINGINFO, {
            configurable: false,
            enumerable: true,
            get: function () {
                if (this[COMMON_EXTENSIONS._BINDINGINFO] !== undefined) {
                    return this[COMMON_EXTENSIONS._BINDINGINFO];
                } else {
                    return {
                        prop: '',                   // The model property that is associated with a data item in via code
                        field: '',                  // Name of element if inside cluster
                        sync: false,                // Whether the update performs synchronously
                        dco: -1,                    // Index of the control as used by RT
                        dataItem: '',               // The name of the associated data item in the via code
                        vireoType: '',              // The vireo type string of the data item
                        unplacedOrDisabled: false   // Indicates if the control is unplaced or disabled on the block diagram
                    };
                }
            },
            set: function (value) {
                this[COMMON_EXTENSIONS._BINDINGINFO] = value;
                this.setAttribute(COMMON_EXTENSIONS.BINDING_INFO, JSON.stringify(value));
            }
        });

        Object.defineProperty(proto, COMMON_EXTENSIONS.LABELID, {
            configurable: false,
            enumerable: true,
            get: function () {
                if (this[COMMON_EXTENSIONS._LABELID] !== undefined) {
                    return this[COMMON_EXTENSIONS._LABELID];
                } else {
                    this[COMMON_EXTENSIONS._LABELID] = this.getAttribute(COMMON_EXTENSIONS.LABEL_ID);
                    return this[COMMON_EXTENSIONS._LABELID];
                }
            },
            set: function (value) {
                this[COMMON_EXTENSIONS._LABELID] = value;
                this.setAttribute(COMMON_EXTENSIONS.LABEL_ID, value);
            }
        });
    };

    // Extensions to multiple prototypes
    var toReg;

    var handleRegistered = function (proto, elementInfo) {
        addProperties(proto, elementInfo);
        proto.onCreated = function () {
            if (this.tagName === elementInfo.tagName.toUpperCase()) {
                create(this, elementInfo);
            }
        };

        proto.onReady = function () {
            if (this.tagName === elementInfo.tagName.toUpperCase()) {
                ready(this);
            }
        };

        proto.onAttached = function () {
            if (this.tagName === elementInfo.tagName.toUpperCase()) {
                attach(this);
            }
        };

        proto.onDetached = function () {
            if (this.tagName === elementInfo.tagName.toUpperCase()) {
                detach(this);
            }
        };
    };

    var whenRegistered = function (elementInfo) {
        window.JQX.Elements.whenRegistered(elementInfo.tagName, function (proto) {
            handleRegistered(proto, elementInfo);
        });
    };

    for (toReg in _elements) {
        if (_elements.hasOwnProperty(toReg)) {
            whenRegistered(_elements[toReg]);
        }
    }

    NationalInstruments.JQXElement._registerElements = function () {
        window.JQX.Elements.registerElements();
    };

}());

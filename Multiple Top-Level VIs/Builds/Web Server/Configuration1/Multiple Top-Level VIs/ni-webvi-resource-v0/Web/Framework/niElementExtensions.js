//****************************************
// Custom Element Extensions
// National Instruments Copyright 2014
//****************************************

(function () {
    'use strict';
    // Static Private Reference Aliases
    var COMMON_EXTENSIONS = NationalInstruments.HtmlVI.CommonElementExtensions;

    var generateAttachedCallback = function (orig) {
        return function attachedCallback_VisualComponentViewModel() {
            var firstCall, viViewModel, controlModelViewModel,
                that = this; // this should be bound to the custom element that was attached

            // Create Model and ViewModel (this will synchronize element attributes <-> model properties)
            // Assumptions:
            // Element is in the DOM
            // Element internal DOM not created yet

            // _preventModelCreation can be undefined or true, so must check if !true
            if (that._preventModelCreation !== true) {
                viViewModel = NationalInstruments.HtmlVI.viReferenceService.getVIViewModelByVIRef(that.viRef);
                controlModelViewModel = viViewModel.attachElementToModelAndViewModel(that);
            }

            // Attach and populate internal DOM (as needed)
            firstCall = orig.apply(that, arguments);

            if (typeof firstCall !== 'boolean') {
                throw new Error('Make sure attachedCallback is returning the firstCall value');
            }

            // Complete ViewModel - View binding
            // Assumptions:
            // Element is in the DOM
            // Element internal DOM created
            // _preventModelCreation can be undefined or true, so must check if !true
            if (that._preventModelCreation !== true) {
                controlModelViewModel.controlViewModel.bindToView();

                if (controlModelViewModel.controlViewModel._needsResizeHack === true) {
                    that.dispatchEvent(new CustomEvent('resizeEventHack', {
                        detail: {
                            width: controlModelViewModel.controlModel.width,
                            height: controlModelViewModel.controlModel.height
                        }
                    }));
                }
            }

            return firstCall;
        };
    };

    var generateDetachedCallback = function (orig) {
        return function detachedCallback_VisualComponentViewModel() {
            orig.apply(this, arguments);

            var viViewModel,
                webAppModel,
                that = this; // this should be bound to the custom element that was attached

            // _preventModelCreation can be undefined or true, so must check if !true
            if (that._preventModelCreation !== true) {
                viViewModel = NationalInstruments.HtmlVI.viReferenceService.getVIViewModelByVIRef(that.viRef);
                viViewModel.detachElementFromModelAndViewModel(that);

                // If this element is the child of a parent element that was detached, then detach the element from the parent and add to element buffer
                webAppModel = NationalInstruments.HtmlVI.viReferenceService.getWebAppModelByVIRef(that.viRef);
                if (webAppModel.updateService !== undefined) {
                    webAppModel.updateService.maybeAddToElementCache(that);
                }
            }
        };
    };

    // Extensions to multiple prototypes
    var toReg, proto, targetPrototype;

    for (toReg in NationalInstruments.HtmlVI.Elements) {
        if (NationalInstruments.HtmlVI.Elements.hasOwnProperty(toReg)) {
            proto = targetPrototype = NationalInstruments.HtmlVI.Elements[toReg].prototype;

            // Only add extensions to leaf prototypes
            if (proto.elementInfo !== undefined) {
                proto.clearExtensionProperties = COMMON_EXTENSIONS.generateClearExtensionProperties();

                if (proto instanceof NationalInstruments.HtmlVI.Elements.VisualComponent) {
                    proto.addProperty(targetPrototype, {
                        propertyName: COMMON_EXTENSIONS.NICONTROLID,
                        defaultValue: ''
                    });

                    proto.addProperty(targetPrototype, {
                        propertyName: COMMON_EXTENSIONS.VIREF,
                        defaultValue: ''
                    });

                    proto.attachedCallback = generateAttachedCallback(proto.attachedCallback);
                    proto.detachedCallback = generateDetachedCallback(proto.detachedCallback);
                }

                // TODO: gleon once webcharts adds a ni-type property to the element we can get rid of this.
                // see -> https://github.com/ni-kismet/webcharts/issues/58
                if (proto instanceof NationalInstruments.HtmlVI.Elements.CartesianGraphBase) {
                    proto.addProperty(targetPrototype, {
                        propertyName: 'niType',
                        defaultValue: '{"name":"Array","rank":1,"subtype":"Double"}'
                    });
                }

                if (proto instanceof NationalInstruments.HtmlVI.Elements.Visual) {
                    /// Creates a JavaScript bindingInfo property. This is a JsonObject containing:
                    ///     prop (string) -the JavaScript model property that corresponds to the controls value (ie value, text, selectedIndex)
                    ///     field (string) - for cluster sub-elements, the name of that element
                    ///     order (number) - for cluster sub elements, the order of that element within its container
                    ///     sync (boolean) - for charts (and some day boolean latch), whether or not updates are only performed synchronously
                    ///     dco (number) - dco index of the top level control used by RT protocol
                    ///     dataItem (string) - the name for VIREO binding - same as DataItem.CompiledName
                    ///     vireoType (string) - VIREO data type
                    ///     unplacedOrDisabled (bool) - indicates whether the control is unplaced/disabled on the block diagram
                    /// Keep documentation in-sync between niElementExtensions.js and BindingInfoGenerator.cs
                    proto.addProperty(targetPrototype, {
                        propertyName: COMMON_EXTENSIONS.BINDINGINFO,
                        defaultValue: {
                            prop: '',
                            field: '',
                            order: -1,
                            sync: false,
                            dco: -1,
                            dataItem: '',
                            vireoType: '',
                            unplacedOrDisabled: false
                        }
                    });

                    proto.addProperty(targetPrototype, {
                        propertyName: COMMON_EXTENSIONS.LABELID,
                        defaultValue: ''
                    });
                }
            }
        }
    }
}());


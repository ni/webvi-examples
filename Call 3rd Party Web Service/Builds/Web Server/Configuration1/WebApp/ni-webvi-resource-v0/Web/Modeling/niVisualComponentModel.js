//****************************************
// Visual Component Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.VisualComponentModel = function (niControlId) {
        //NIModel does not use the id so do not pass it
        parent.call(this);

        // Public Instance Properties
        this.niControlId = niControlId;
        this.owner = undefined;
        this.rootOwner = undefined;
        this.childModels = [];

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    // None

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.VisualComponentModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, {
            propertyName: 'niControlId',
            defaultValue: undefined,
            customSetter: function (oldValue, newValue) {
                if ((oldValue === undefined || oldValue === newValue) && newValue !== undefined) {
                    return newValue;
                } else {
                    throw new Error('Cannot change niControlId after it has been assigned a valid value');
                }
            }
        });

        proto.addModelProperty(targetPrototype, {
            propertyName: 'viRef',
            defaultValue: undefined,
            customSetter: function (oldValue, newValue) {
                if ((oldValue === undefined || oldValue === newValue) && newValue !== undefined) {
                    return newValue;
                } else {
                    throw new Error('Cannot change viRef after it has been assigned a valid value');
                }
            }
        });
    });

    proto.getRemoteBindingInfo = function () {
        return undefined;
    };

    proto.getLocalBindingInfo = function () {
        return undefined;
    };

    proto.getEditorRuntimeBindingInfo = function () {
        return undefined;
    };

    // Model Ownership Hierarchy Information
    proto.setOwner = function (fp) {
        this.owner = fp;
        this.rootOwner = this.findRoot();
    };

    proto.getOwner = function () {
        return this.owner;
    };

    proto.addChildModel = function (child) {
        for (var i = 0; i < this.childModels.length; i++) {
            if (this.childModels[i].niControlId === child.niControlId) {
                return false;
            }
        }

        this.childModels.push(child);
    };

    proto.removeChildModel = function (child) {
        for (var i = 0; i < this.childModels.length; i++) {
            if (this.childModels[i].niControlId === child.niControlId) {
                this.childModels.splice(i, 1);
                break;
            }
        }
    };

    // Both Clusters and Arrays act as top-level containers. The Tab control is not a top-level container (children of Tab control are top-level).
    proto.insideTopLevelContainer = function () {
        return (this.getOwner() !== this.getRoot()) && (this.getOwner() instanceof NationalInstruments.HtmlVI.Models.ClusterModel || this.getOwner() instanceof NationalInstruments.HtmlVI.Models.ArrayViewerModel);
    };

    proto.findTopLevelControl = function () {
        var currControlModel = this;

        while (currControlModel.insideTopLevelContainer()) {
            currControlModel = currControlModel.getOwner();
        }

        return currControlModel;
    };

    proto.getRoot = function () {
        if (this.rootOwner === undefined) {
            this.rootOwner = this.findRoot();
        }

        return this.rootOwner;
    };

    // SHOULD NOT USE DIRECTLY: Call getRoot instead for cached value
    proto.findRoot = function () {
        var currOwner = this.getOwner();
        while (currOwner instanceof NationalInstruments.HtmlVI.Models.VirtualInstrumentModel === false) {
            currOwner = currOwner.getOwner();
        }

        return currOwner;
    };

    proto.internalControlEventOccurred = function (eventName, eventData) {
        var viModel = this.getRoot();
        viModel.internalControlEventOccurred(this, eventName, eventData);
    };

    proto.isTopLevelAndPlacedAndEnabled = function () {
        return this.getLocalBindingInfo() !== undefined &&
            this.insideTopLevelContainer() === false &&
            this.bindingInfo.unplacedOrDisabled === false;
    };
}(NationalInstruments.HtmlVI.Models.NIModel));

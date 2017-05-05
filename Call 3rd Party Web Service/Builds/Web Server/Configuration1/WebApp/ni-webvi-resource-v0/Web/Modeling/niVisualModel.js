//****************************************
// Visual Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static private reference aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NI_EGGSHELL = NationalInstruments.HtmlVI.EggShell;
    var NIType = window.NIType;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.VisualModel = function (id) {
        parent.call(this, id);

        // Public Instance Properties
        this.localBindingInfo = null;
        this.defaultValue = undefined;
        // TODO mraj I will buy the team a keg if we agree to stop introducing supression flags
        this.suppressControlChanged = false;
        // Private Instance Properties
        // None
    };

    // Static Public Variables
    // None

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.VisualModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, { propertyName: 'top', defaultValue: '0px' });
        proto.addModelProperty(targetPrototype, { propertyName: 'left', defaultValue: '0px' });
        proto.addModelProperty(targetPrototype, { propertyName: 'width', defaultValue: '100px' });
        proto.addModelProperty(targetPrototype, { propertyName: 'height', defaultValue: '100px' });
        proto.addModelProperty(targetPrototype, { propertyName: 'foreground', defaultValue: 'rgb(0, 0, 0)' });
        proto.addModelProperty(targetPrototype, { propertyName: 'fontSize', defaultValue: '12px' });
        proto.addModelProperty(targetPrototype, { propertyName: 'fontFamily', defaultValue: 'sans-serif' });
        proto.addModelProperty(targetPrototype, { propertyName: 'fontWeight', defaultValue: 'normal' });
        proto.addModelProperty(targetPrototype, { propertyName: 'fontStyle', defaultValue: 'normal' });
        proto.addModelProperty(targetPrototype, { propertyName: 'textDecoration', defaultValue: 'none' });
        proto.addModelProperty(targetPrototype, { propertyName: 'visible', defaultValue: true });
        proto.addModelProperty(targetPrototype, { propertyName: 'readOnly', defaultValue: false });
        proto.addModelProperty(targetPrototype, { propertyName: 'labelId', defaultValue: '' });
        proto.addModelProperty(targetPrototype, { propertyName: 'bindingInfo', defaultValue: {} });
        proto.addModelProperty(targetPrototype, { propertyName: 'niType', defaultValue: undefined, customSetter: function (oldVal, newVal)  {
            if (newVal instanceof NIType) {
                return newVal;
            }

            return new NIType(newVal);
        }});
    });

    // This method is meant to be overriden by all of our JS control models that set their niType property.
    // The common case is a control with a 'value' property: it should override this, and return true if propertyName === 'value'.
    // For controls that have multiple typed properties (e.g. numerics; value=ComplexDouble implies min/max/interval are also ComplexDouble),
    // this method should return true for all of those property names.
    proto.propertyUsesNITypeProperty = function (propertyName) {
        // jshint unused: vars
        if (this.niType !== undefined) {
            throw new Error('Any control model that sets niType must override propertyUsesNITypeProperty()');
        }

        return false;
    };

    proto.setMultipleProperties = function (settings, typedValueAdapter) {
        if (settings.hasOwnProperty('niType')) {
            // We need to apply the NIType before other properties. It's also used for our editor->model
            // data conversion below so we need the latest NIType for that too.
            this.niType = settings.niType;
            delete settings.niType; // We've already handled niType, so setMultipleProperties doesn't need to, below
        }

        if (typedValueAdapter !== undefined) {
            for (var propertyName in settings) {
                if (settings.hasOwnProperty(propertyName) && this.propertyUsesNITypeProperty(propertyName)) {
                    settings[propertyName] = typedValueAdapter(settings[propertyName], this.niType);
                }
            }
        }

        parent.prototype.setMultipleProperties.call(this, settings);
    };

    proto.setBindingInfo = function (bindingInfo) {
        this.bindingInfo = bindingInfo;
    };

    proto.getBindingInfo = function () {
        return this.bindingInfo;
    };

    proto.getRemoteBindingInfo = function () {
        return {
            prop: this.bindingInfo.prop,
            dco: this.bindingInfo.dco,
            controlId: this.niControlId
        };
    };

    proto.getEditorRuntimeBindingInfo = function () {
        return {
            prop: this.bindingInfo.prop,
            dataItem: this.bindingInfo.dataItem,
            controlId: this.niControlId
        };
    };

    proto.getLocalBindingInfo = function () {
        if (this.localBindingInfo === null) {
            this.localBindingInfo = this.generateLocalBindingInfo();
        }

        return this.localBindingInfo;
    };

    proto.getDefaultValue = function () {
        return this.defaultValue;
    };

    proto.setDefaultValue = function (defaultValue) {
        this.defaultValue = defaultValue;
    };

    proto.generateVireoPath = function () {
        var pathParts = [], path, currBindingInfo, encodedCurrFieldName,
            currControlModel = this;

        while (currControlModel.insideTopLevelContainer()) {
            currBindingInfo = currControlModel.getBindingInfo();
            encodedCurrFieldName = NI_EGGSHELL.encodeVireoIdentifier(currBindingInfo.field);

            pathParts.push(encodedCurrFieldName);

            currControlModel = currControlModel.getOwner();
        }

        currBindingInfo = currControlModel.getBindingInfo();

        // Assuming currBindingInfo.dataItem is created with the algorithm described here: http://ngsourcebrowser:4110/#NationalInstruments.Compiler/CompileHelper.cs,30
        // Then currBindingInfo.dataItem should be a valid symbol that can be used in Vireo. TODO mraj Vireo's symbol name rules?
        // Noticed that Astral plane characters that are unicode category letter are still escaped like U+1D538
        // Probably because C# unicode support is platform specific and very confusing http://stackoverflow.com/a/9162833/338923
        if (typeof currBindingInfo.dataItem === 'string' && currBindingInfo.dataItem !== '') {
            pathParts.push(currBindingInfo.dataItem);
        }

        path = pathParts.reverse().join('.');
        return path;
    };

    // DO NOT USE DIRECTLY: Use getLocalBindingInfo instead for cached value
    proto.generateLocalBindingInfo = function () {
        var bindingInfo = this.getBindingInfo();
        var localBindingInfo = {
            runtimePath: '',   // full vireo encoded path from this control to the top-level control
            encodedVIName: '', // the vireo encoded VI name
            prop: '',          // same as bindingInfo.prop
            sync: false,       // same as bindingInfo.sync
            dataItem: ''       // same as bindingInfo.dataItem
        };

        localBindingInfo.runtimePath = this.generateVireoPath();
        localBindingInfo.encodedVIName = this.getRoot().getNameVireoEncoded();
        localBindingInfo.prop = (typeof bindingInfo.prop === 'string') ? bindingInfo.prop : '';
        localBindingInfo.sync = (typeof bindingInfo.sync === 'boolean') ? bindingInfo.sync : false;
        localBindingInfo.dataItem = (typeof bindingInfo.dataItem === 'string') ? bindingInfo.dataItem : '';

        if (localBindingInfo.runtimePath === '') {
            return undefined;
        }

        return Object.freeze(localBindingInfo);
    };

    // Control changed is only used for controls that have binding info (ie VisualModels)
    proto.controlChanged = function (propertyName, newValue) {
        var viModel = this.getRoot();
        if (this.suppressControlChanged === false) {
            viModel.controlChanged(this, propertyName, newValue);
        }
    };

    // Event occured is only used for controls that have binding info (ie VisualModels)
    proto.controlEventOccurred = function (eventType, eventData) {
        var viModel = this.getRoot();
        viModel.controlEventOccurred(this, eventType, eventData);
    };

}(NationalInstruments.HtmlVI.Models.VisualComponentModel));

//****************************************
// NI View Model
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var RENDER_ENGINE = NationalInstruments.HtmlVI.RenderEngine;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.NIViewModel = function (element, model) {
        if (!NI_SUPPORT.isElement(element)) {
            throw new Error(NI_SUPPORT.i18n('msg_INVALID_ELEMENT'));
        }

        if (model instanceof NationalInstruments.HtmlVI.Models.NIModel === false) {
            throw new Error(NI_SUPPORT.i18n('msg_INVALID_VI_MODEL'));
        }

        // Public Instance Properties
        NI_SUPPORT.defineConstReference(this, 'element', element);
        NI_SUPPORT.defineConstReference(this, 'model', model);

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    // None

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.ViewModels.NIViewModel;
    var proto = child.prototype;

    // Static Private Variables
    var ADD_ALL_PROPS_FUNC_NAME = '_addAllProperties';

    // Static Private Functions
    var validateAddViewModelPropertyArgs = function (targetPrototype, config) {
        var propertyName = config.propertyName;

        if (typeof propertyName !== 'string' || propertyName.length < 1) {
            throw new Error('A property name must be a string greater than or equal to one character long');
        }

        if (targetPrototype.hasOwnProperty('_propertyTable') === false) {
            throw new Error('The ' + ADD_ALL_PROPS_FUNC_NAME + ' function has not been invoked yet; the property table has not been created');
        }

        if (targetPrototype._propertyTable[propertyName] !== undefined) {
            throw new Error('The ViewModel property ' + propertyName + ' has already been defined');
        }

        return {
            propertyName: propertyName
        };
    };

    // Public Prototype Methods
    proto.registerViewModelProperties = function (targetPrototype, addAllViewModelProperties) {
        if (typeof addAllViewModelProperties === 'function') {

            targetPrototype[ADD_ALL_PROPS_FUNC_NAME] = function (targetPrototype, parentMethodName) {
                addAllViewModelProperties.call(targetPrototype, targetPrototype, parentMethodName);
            };
        }

        targetPrototype[ADD_ALL_PROPS_FUNC_NAME](targetPrototype, ADD_ALL_PROPS_FUNC_NAME);
    };

    proto[ADD_ALL_PROPS_FUNC_NAME] = function (targetPrototype) {
        if (targetPrototype.hasOwnProperty('_propertyTable') === true) {
            throw new Error('The ' + ADD_ALL_PROPS_FUNC_NAME + ' function has already been invoked; the property table is already created');
        }

        NI_SUPPORT.defineConstReference(targetPrototype, '_propertyTable', {});
    };

    proto.addViewModelProperty = function (targetPrototype, config) {
        var validConfig = validateAddViewModelPropertyArgs(targetPrototype, config);
        var propertyName = validConfig.propertyName;
        var autoElementSync = config.autoElementSync === undefined ? true : config.autoElementSync;

        Object.defineProperty(targetPrototype._propertyTable, propertyName, {
            configurable: false,
            enumerable: true, // need to be enumerable, cannot use NI_SUPPORT.defineConstReference
            writable: false,
            value: Object.freeze({
                autoElementSync: autoElementSync
            })
        });
    };

    proto.bindToView = function () {
    };

    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = RENDER_ENGINE.getOrAddRenderBuffer(this.element);
        var _propertyTable = this._propertyTable;

        if (_propertyTable !== undefined) {
            if (_propertyTable[propertyName] !== undefined && _propertyTable[propertyName].autoElementSync === true) {
                renderBuffer.properties[propertyName] = this.model[propertyName];
            }
        }

        return renderBuffer;
    };

    // Applies changes to the DOM Element
    proto.applyElementChanges = function () {
        RENDER_ENGINE.enqueueDomUpdate(this.element);
    };

    proto.updateModelFromElement = function () {
        var _propertyTable = this._propertyTable,
            currProp;

        if (_propertyTable !== undefined) {
            for (currProp in _propertyTable) {
                if (_propertyTable.hasOwnProperty(currProp) && _propertyTable[currProp].autoElementSync === true) {
                    this.model[currProp] = this.element[currProp];
                }
            }
        }

    };

    proto.applyModelToElement = function () {
        var _propertyTable = this._propertyTable,
            currProp;

        if (_propertyTable !== undefined) {
            for (currProp in _propertyTable) {
                if (_propertyTable.hasOwnProperty(currProp) && _propertyTable[currProp].autoElementSync === true) {
                    this.element[currProp] = this.model[currProp];
                }
            }
        }
    };

}());

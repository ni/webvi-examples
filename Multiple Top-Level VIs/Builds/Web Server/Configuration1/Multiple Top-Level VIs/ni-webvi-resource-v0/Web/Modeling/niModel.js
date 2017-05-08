//****************************************
// NIModel Base Class
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static private reference aliases
    var $ = NationalInstruments.Globals.jQuery;
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.NIModel = function () {
        var currProp;
        var instanceProto = Object.getPrototypeOf(this);
        var _propertyTable = instanceProto._propertyTable;

        if (instanceProto.hasOwnProperty('_propertyTable') === false) {
            throw new Error('The registerModelProperties function has not been invoked, a property table has not been created');
        }

        for (currProp in _propertyTable) {
            if (_propertyTable.hasOwnProperty(currProp) && _propertyTable[currProp].computedProp === false) {
                this[_propertyTable[currProp].privatePropName] = copyValue(_propertyTable[currProp].defaultValue);
            }
        }

        // Public Instance Properties
        // None

        // Private Instance Properties
        this._listeners = [];
    };

    // Static Public Variables
    // None

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.NIModel;
    var proto = child.prototype;

    // Static Private Variables
    var ADD_ALL_PROPS_FUNC_NAME = '_addAllProperties';

    // Static Private Functions
    var copyValue = function (value) {
        var i;
        if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
            return value;
        } else if (value === null || value === undefined) {
            return value;
        } else if (Array.isArray(value)) {
            var newValue1 = [];
            for (i = 0; i < value.length; i++) {
                newValue1[i] = copyValue(value[i]);
            }

            return newValue1;
        } else if ($.isPlainObject(value)) {
            var newValue2 = {}, x;
            for (x in value) {
                if (value.hasOwnProperty(x)) {
                    newValue2[x] = copyValue(value[x]);
                }
            }

            return newValue2;
        } else {
            throw new Error('Unsupported type');
        }

    };

    var validateAddModelPropertyArgs = function (targetPrototype, config) {
        var propertyName = config.propertyName;
        var defaultValue = copyValue(config.defaultValue);
        var privatePropertyName = '_' + propertyName;
        var customSetter = config.customSetter;
        var customGetter = config.customGetter;
        var computedProp = config.computedProp || false;

        if (typeof propertyName !== 'string' || propertyName.length < 1) {
            throw new Error('A property name must be a string greater than or equal to one character long');
        }

        if (targetPrototype.hasOwnProperty('_propertyTable') === false) {
            throw new Error('The addAllProperties function has not been invoked yet; the property table has not been created');
        }

        if (targetPrototype[propertyName] !== undefined) {
            throw new Error(NI_SUPPORT.i18n('msg_ALREADY_DEFINED', targetPrototype[propertyName], propertyName));
        }

        if (targetPrototype[privatePropertyName] !== undefined) {
            throw new Error(NI_SUPPORT.i18n('msg_ALREADY_DEFINED', targetPrototype[privatePropertyName], propertyName));
        }

        if (customSetter !== undefined && typeof customSetter !== 'function') {
            throw new Error('If a custom setter is provided, it must be a function to invoke');
        }

        if (customGetter !== undefined && typeof customGetter !== 'function') {
            throw new Error('If a custom getter is provided, it must be a function to invoke');
        }

        if (typeof computedProp !== 'boolean') {
            throw new Error('If specifying that a property is computed, please use a boolean value');
        }

        if (computedProp === true && config.hasOwnProperty('defaultValue') === true) {
            throw new Error('Computed properties are not backed by a value, do not provided a default value for a computedProperty');
        }

        if (computedProp === true && (typeof customGetter !== 'function' || typeof customSetter !== 'function')) {
            throw new Error('Computed properties require getter and setter functions');
        }

        return {
            privatePropertyName: privatePropertyName,
            defaultValue: defaultValue,
            propertyName: propertyName,
            customSetter: customSetter,
            customGetter: customGetter,
            computedProp: computedProp
        };
    };

    // Public Prototype Methods
    // The registerModelProperties function generates a function called ADD_ALL_PROPS_FUNC_NAME on the prototype chain. The value of ADD_ALL_PROPS_FUNC_NAME
    // is passed to the registered function so it can invoke the parent as needed
    proto.registerModelProperties = function (targetPrototype, addAllModelProperties) {
        if (typeof addAllModelProperties === 'function') {

            targetPrototype[ADD_ALL_PROPS_FUNC_NAME] = function (targetPrototype, parentMethodName) {
                addAllModelProperties.call(targetPrototype, targetPrototype, parentMethodName);
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

    // Model <-> ViewModel Observable Properties Support
    proto.addModelProperty = function (targetPrototype, config) {
        var validConfig = validateAddModelPropertyArgs(targetPrototype, config);
        var privatePropertyName = validConfig.privatePropertyName,
            defaultValue = validConfig.defaultValue,
            propertyName = validConfig.propertyName,
            customSetter = validConfig.customSetter,
            customGetter = validConfig.customGetter,
            computedProp = validConfig.computedProp;

        // If the property is already defined in the property table then delete it
        if (targetPrototype._propertyTable.hasOwnProperty(propertyName) === true) {
            delete targetPrototype._propertyTable.propertyName;
        }

        // Add the property to
        Object.defineProperty(targetPrototype._propertyTable, propertyName, {
            configurable: true, // need to delete if overridden by children
            enumerable: true, // need to be able to enumerate, so canot use NI_SUPPORT.defineConstReference
            writable: false,
            value: Object.freeze({
                privatePropName: privatePropertyName,
                defaultValue: defaultValue,
                computedProp: computedProp
            })
        });

        // If the property is already defined in the property table then delete it
        if (targetPrototype.hasOwnProperty(propertyName) === true) {
            delete targetPrototype.propertyName;
        }

        Object.defineProperty(targetPrototype, propertyName, {
            configurable: true, // need to delete if overridden by children
            enumerable: true,
            get: function () {
                if (customGetter === undefined) {
                    return this[privatePropertyName];
                } else if (computedProp === false) {
                    return customGetter.call(this, this[privatePropertyName]);
                } else {
                    return customGetter.call(this);
                }
            },
            set: function (value) {
                var i, listener, renderBuffer;

                if (customSetter === undefined) {
                    this[privatePropertyName] = value;
                } else if (computedProp === false) {
                    this[privatePropertyName] = customSetter.call(this, this[privatePropertyName], value);
                } else {
                    customSetter.call(this, undefined, value);
                }

                for (i = 0; i < this._listeners.length; i++) {
                    listener = this._listeners[i];
                    renderBuffer = listener.modelPropertyChanged(propertyName);
                    listener.applyElementChanges(renderBuffer);
                }
            }
        });
    };

    proto.registerListener = function (listener) {
        if (listener instanceof NationalInstruments.HtmlVI.ViewModels.NIViewModel === false) {
            throw new Error('Listeners must be NIViewModels');
        }

        this._listeners.push(listener);
    };

    proto.unregisterListener = function (listener) {
        var i, index = -1;
        for (i = 0; i < this._listeners.length; i++) {
            if (this._listeners[i] === listener) {
                index = i;
                break;
            }
        }

        if (index >= 0) {
            this._listeners.slice(index, 1);
        }
    };

    // A helper function used to set multiple properties on a model
    proto.setMultipleProperties = function (settings) {
        var name;

        for (name in settings) {
            if (settings.hasOwnProperty(name)) {
                if (this._propertyTable[name] === undefined) {
                    throw new Error('Unknown property assigned (' + name + ') for model kind (' + this.constructor.MODEL_KIND + ')');
                }

                this[name] = settings[name];
            }
        }
    };

}());

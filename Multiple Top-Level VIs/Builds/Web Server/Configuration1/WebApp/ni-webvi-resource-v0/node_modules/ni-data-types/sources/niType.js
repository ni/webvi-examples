
(function () {

    var TypeNames = Object.freeze({
        VOID: 'Void',
        BOOLEAN: 'Boolean',
        UINT8: 'UInt8',
        UINT16: 'UInt16',
        UINT32: 'UInt32',
        UINT64: 'UInt64',
        INT8: 'Int8',
        INT16: 'Int16',
        INT32: 'Int32',
        INT64: 'Int64',
        SINGLE: 'Single',
        DOUBLE: 'Double',
        COMPLEXSINGLE: 'ComplexSingle',
        COMPLEXDOUBLE: 'ComplexDouble',
        STRING: 'String',
        PATH: 'Path',
        TIMESTAMP: 'Timestamp',
        ENUM: 'Enum',
        CLUSTER: 'Cluster',
        ARRAY: 'Array',
        ANALOGWAVEFORM: 'AnalogWaveform',
        DIGITALWAVEFORM: 'DigitalWaveform'
    });

    // Numeric helper functions
    var isFloat = function (typeName) {
        return typeName === TypeNames.SINGLE || typeName === TypeNames.DOUBLE;
    };

    var isSignedInteger = function (typeName) {
        switch (typeName) {
            case TypeNames.INT8:
            case TypeNames.INT16:
            case TypeNames.INT32:
            case TypeNames.INT64:
                return true;
            default:
                return false;
        }
    };

    var isUnsignedInteger = function (typeName) {
        switch (typeName) {
            case TypeNames.UINT8:
            case TypeNames.UINT16:
            case TypeNames.UINT32:
            case TypeNames.UINT64:
                return true;
            default:
                return false;
        }
    };

    var is64BitInteger = function (typeName) {
        return typeName === TypeNames.INT64 || typeName === TypeNames.UINT64;
    };

    var isInteger = function (typeName) {
        return isSignedInteger(typeName) || isUnsignedInteger(typeName);
    };

    var isComplex = function (typeName) {
        return typeName === TypeNames.COMPLEXSINGLE || typeName === TypeNames.COMPLEXDOUBLE;
    };

    var isNumeric = function (typeName) {
        return isInteger(typeName) || isComplex(typeName) || isFloat(typeName);
    };

    var isSimpleType = function (typeName) {
        if (isNumeric(typeName)) {
            return true;
        }

        switch (typeName) {
            case TypeNames.VOID:
            case TypeNames.BOOLEAN:
            case TypeNames.STRING:
            case TypeNames.PATH:
            case TypeNames.TIMESTAMP:
            case TypeNames.DIGITALWAVEFORM:
                return true;
        }

        return false;
    };

    // Validation methods
    var throwIfInvalidProperties = function (descriptor, propertyCount, errorMessage) {
        var descriptorKeys = Object.keys(descriptor);

        if(descriptorKeys.length !== propertyCount) {
            throw new Error(errorMessage);
        }
    };

    var validProperties = function (descriptor, propertyCount) {
        var descriptorKeys = Object.keys(descriptor);
        return descriptorKeys.length !== propertyCount;
    };

    var validatePrimitives = function (descriptor) {
        if (validProperties(descriptor, 1)) {
            throw new Error(descriptor.name + ' must only have the property "name".');
        }
    };

    var isValidArraySubtype = function (descriptor) {
        return descriptor.name !== TypeNames.ARRAY;
    };

    var validateEnum = function (descriptor) {
        var subtype = descriptor.subtype;

        if(subtype === null || typeof subtype !== 'object') {
            throw new Error('Enum subtype must be a valid descriptor.');
        }

        if(isUnsignedInteger(subtype.name) === false || is64BitInteger(subtype.name) === true) {
            throw new Error('Enum unsupported subtype: ' + subtype.name);
        }
    };

    var validateArray = function (descriptor) {

        var subtype = descriptor.subtype;

        if (isValidArraySubtype(subtype) === false) {
            throw new Error('Invalid Array subtype: ' + subtype.name);
        }

        validateType(subtype);

        var rank = descriptor.rank;

        if (typeof rank !== 'number' || isNaN(rank) || rank <= 0) {
            throw new Error('Array type property "rank" must be an integer greater than 0.');
        }

        var arrayFixedSize = descriptor.size;

        if (arrayFixedSize !== undefined) {
            if (Array.isArray(arrayFixedSize) === false) {
                throw new Error('Array type property "size" must be an array of integers.');
            }

            var allElementsAreNumbersGreaterThanZero = arrayFixedSize.reduce(function (prev, curr){
                return prev && typeof curr == 'number' && curr >= 0;
            }, true);

            if (allElementsAreNumbersGreaterThanZero === false) {
                throw new Error('Array type property "size" must contain only natural numbers.');
            }
        }
    };

    var validateCluster = function (descriptor) {
        var fields = descriptor.fields;
        var fieldTypes = descriptor.subtype;

        if (Array.isArray(fields) === false) {
            throw new Error('Cluster type must have a "fields" property of type array.');
        }

        var allFieldsAreStrings = fields.reduce(function(prev, curr) {
            return prev && typeof curr === 'string';
        }, true);

        if(allFieldsAreStrings === false) {
            throw new Error('Cluster type property "fields", must be an array of strings.');
        }

        if (fieldTypes !== undefined) {
            if (Array.isArray(fieldTypes) === false) {
                throw new Error('Cluster type property "subtype" must be an array of types.');
            }            

            if (fields.length !== fieldTypes.length) {
                throw new Error('Cluster properties "fields" and "subtype", must be arrays with the same length.');
            }
            
            var i = 0;
            try {
                for (; i < fieldTypes.length; i++) {
                    var fieldType = fieldTypes[i];
                    validateType(fieldType);
                }
            } catch (e) {
                throw new Error('Cluster property "subtype" contains an invalid type descriptor.\n' + e.message);
            }
        }
    };

    var validateAnalogWaveform = function (descriptor) {
        var subtype = descriptor.subtype;

        if (subtype === undefined) {
            throw new Error(TypeNames.ANALOGWAVEFORM + ' must have a property called "subtype".');
        }

        if (isNumeric(subtype.name) === false) {
            throw new Error(TypeNames.ANALOGWAVEFORM + ' subtype only accepts numerics. ' + subtype.name + ' was found instead.');
        }
    };

    var validateType = function (descriptor) {

        if (descriptor !== null && typeof descriptor === 'object') {
            var type = descriptor.name;

            if (isSimpleType(type)) {
                validatePrimitives(descriptor);
            } else {
                switch (type) {
                    case TypeNames.ENUM:
                        validateEnum(descriptor);
                        break;
                    case TypeNames.ARRAY:
                        validateArray(descriptor);
                        break;
                    case TypeNames.CLUSTER:
                        validateCluster(descriptor);
                        break;
                    case TypeNames.ANALOGWAVEFORM:
                        validateAnalogWaveform(descriptor);
                        break;
                    default:
                        throw new Error('Unknown type: ' + type);
                }
            }

        } else {
            throw new Error('Descriptor should be a JSON encoded string or a valid format Object. Value found: ' + descriptor);
        }
        
    };

    // Short-type notation handling
    var wrapShortTypes = function (descriptor) {
        if (typeof descriptor === 'string') {
            return {name: descriptor};
        }

        for(var key in descriptor) {
            if (descriptor.hasOwnProperty(key)) {
                var value = descriptor[key];
                if (key === 'subtype') {
                    if (Array.isArray(value)) {
                        descriptor[key] = value.map(wrapShortTypes);
                    } else {
                        descriptor[key] = wrapShortTypes(value);
                    }
                }
            }
        }

        return descriptor;
    };

    var unwrapShortType = function (value) {
        if (value !== null && typeof value === 'object' && isSimpleType(value.name)) {
            return value.name;
        }

        return value;
    };

    var encodeShortType = function (key, value) {
        if (key === 'subtype' || key === '') { // Outermost key is always '' (empty string)
            if (Array.isArray(value)) {
                return value.map(unwrapShortType);
            }

            return unwrapShortType(value);
        }
        return value;
    };

    // Equals helper methods
    var fieldsEqual = function (fields1, fields2) {
        if (Array.isArray(fields1) && Array.isArray(fields2)) {

            if (fields1.length !== fields2.length) {
                return false;
            }

            return fields1.reduce(function (pv, cv, i) {
                return pv && cv === fields2[i];
            }, true);
        }

        return fields1 === fields2;
    };

    var subtypesEqual = function (subtype1, subtype2) {
        if (subtype1 === undefined && subtype1 === subtype2) {
            return true;
        }

        if (subtype1 instanceof NIType && subtype2 instanceof NIType) {
            return subtype1.equals(subtype2);
        }

        if (Array.isArray(subtype1) && Array.isArray(subtype2)) {
            var areEqual = subtype1.reduce(function (pv, cv, i) {
                return pv && cv.equals(subtype2[i]);
            }, true);

            return areEqual;
        }

        return false;
    };

    var ranksEqual = function (rank1, rank2) {
        if (rank1 === undefined && rank1 === rank2) {
            return true;
        }

        return rank1 === rank2;
    };

    var sizesEqual = function (sizes1, sizes2) {
        if (sizes1 === undefined && sizes1 === sizes2) {
            return true;
        }

        if (sizes1.length !== sizes2.length) {
            return false;
        }

        var areAllSizesEqual = sizes1.reduce(function (pv, cv, i) {
            return pv && cv === sizes2[i];
        }, true);

        return areAllSizesEqual;
    };

    var parseDescriptor = function (descriptorValue) {
        var descriptor;
        if (typeof descriptorValue === 'string') {
            if (isSimpleType(descriptorValue)) {
                descriptor = descriptorValue;
            } else {
                descriptor = JSON.parse(descriptorValue);
            }
        }

        if (descriptorValue !== null && typeof descriptorValue === 'object') {
            descriptor = descriptorValue;
        }

        descriptor = wrapShortTypes(descriptor);

        return descriptor;
    };

    // Constructor
    var NIType = function (descriptorValue) {
        var descriptor = parseDescriptor(descriptorValue);
        validateType(descriptor);
        this._descriptor = descriptor;
    };

    var generateTypeCheker = function (typeName) {
        var typeChecker = function () {
            return this._descriptor.name === typeName;
        };

        try {
            Object.defineProperty(typeChecker, 'name', {
                value : 'is' + typeName
            });
        } catch (e) {
            // Browser might not support this.
        }

        return typeChecker;
    };

    var addQueries = function (typeDescriptorObject) {
        var proto = typeDescriptorObject.prototype;
        for(var key in TypeNames) {
            if (TypeNames.hasOwnProperty(key)) {
                var typeName = TypeNames[key];
                var isQuery = 'is' + typeName;

                proto[isQuery] = generateTypeCheker(typeName);
            }
        }
    };

    // Public instance methods
    var proto = NIType.prototype;

    addQueries(NIType);

    proto.toJSON = function () {
        return JSON.stringify(this._descriptor);
    };

    proto.toShortJSON = function () {
        return JSON.stringify(this._descriptor, encodeShortType);
    };

    proto.isNumeric = function () {
        return isNumeric(this._descriptor.name);
    };

    proto.isFloat = function () {
        return isFloat(this._descriptor.name);
    };

    proto.isSignedInteger = function () {
        return isSignedInteger(this._descriptor.name);
    };

    proto.isUnsignedInteger = function () {
        return isUnsignedInteger(this._descriptor.name);
    };

    proto.is64BitInteger = function () {
        return is64BitInteger(this._descriptor.name);
    };

    proto.isInteger = function () {
        return isInteger(this._descriptor.name);
    };

    proto.isComplex = function () {
        return isComplex(this._descriptor.name);
    };

    proto.getName = function () {
        return this._descriptor.name;
    };

    proto.getSubtype = function () {
        var subtype = this._descriptor.subtype;
        
        if (Array.isArray(subtype)) {
            return subtype.map(function (v) {
                return new NIType(v);
            });
        }

        if (typeof subtype === 'object' && subtype !== null) {
            return new NIType(subtype);
        }

        return undefined;
    };

    proto.getRank = function () {
        return this._descriptor.rank;
    };

    proto.getSize = function () {
        return this._descriptor.size;
    };

    proto.getFields = function () {
        return this._descriptor.fields;
    };

    proto.equals = function (typeDescriptor) {
        if (typeDescriptor instanceof NIType) {
            if (typeDescriptor.getName() !== this.getName()) {
                return false;
            }

            if (!fieldsEqual(typeDescriptor.getFields(), this.getFields())) {
                return false;
            }

            if (!subtypesEqual(typeDescriptor.getSubtype(), this.getSubtype())) {
                return false;
            }

            if (!ranksEqual(typeDescriptor.getRank(), this.getRank())) {
                return false;
            }

            if (!sizesEqual(typeDescriptor.getSize(), this.getSize())) {
                return false;
            }

            return true;
        }

        return false;
    };

    // Exports
    window.NITypes = Object.freeze({
        VOID: new NIType('"Void"'),
        BOOLEAN: new NIType('"Boolean"'),
        UINT8: new NIType('"UInt8"'),
        UINT16: new NIType('"UInt16"'),
        UINT32: new NIType('"UInt32"'),
        UINT64: new NIType('"UInt64"'),
        INT8: new NIType('"Int8"'),
        INT16: new NIType('"Int16"'),
        INT32: new NIType('"Int32"'),
        INT64: new NIType('"Int64"'),
        SINGLE: new NIType('"Single"'),
        DOUBLE: new NIType('"Double"'),
        COMPLEXSINGLE: new NIType('"ComplexSingle"'),
        COMPLEXDOUBLE: new NIType('"ComplexDouble"'),
        STRING: new NIType('"String"'),
        PATH: new NIType('"Path"'),
        TIMESTAMP: new NIType('"Timestamp"'),
        DIGITALWAVEFORM: new NIType('"DigitalWaveform"')
    });

    window.NIType = NIType;
    window.NITypeNames = TypeNames;
}());

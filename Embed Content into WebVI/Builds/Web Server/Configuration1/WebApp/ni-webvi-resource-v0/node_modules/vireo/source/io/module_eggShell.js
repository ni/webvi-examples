// Using a modified UMD module format. Specifically a modified returnExports (no dependencies) version
(function (root, globalName, factory) {
    'use strict';
    var buildGlobalNamespace = function () {
        var buildArgs = Array.prototype.slice.call(arguments);
        return globalName.split('.').reduce(function (currObj, subNamespace, currentIndex, globalNameParts) {
            var nextValue = currentIndex === globalNameParts.length - 1 ? factory.apply(undefined, buildArgs) : {};
            return currObj[subNamespace] === undefined ? (currObj[subNamespace] = nextValue) : currObj[subNamespace];
        }, root);
    };

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as a named module.
        define(globalName, [], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. "CommonJS-like" for environments like Node but not strict CommonJS
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        buildGlobalNamespace();
    }
}(this, 'NationalInstruments.Vireo.ModuleBuilders.assignEggShell', function () {
    'use strict';
    // Static Private Variables (all vireo instances)
    // None

    // Vireo Core Mixin Function
    var assignEggShell = function (Module, publicAPI) {
        // Disable new-cap for the cwrap functions so the names can be the same in C and JS
        /* eslint 'new-cap': ['error', {'capIsNewExceptions': [
            'Vireo_Version',
            'EggShell_Create',
            'EggShell_Delete',
            'EggShell_ReadDouble',
            'EggShell_WriteDouble',
            'EggShell_ReadValueString',
            'EggShell_WriteValueString',
            'EggShell_GetArrayMetadata',
            'EggShell_GetArrayDimLength',
            'EggShell_ResizeArray',
            'Data_GetStringBegin',
            'Data_GetStringLength',
            'Data_ReadBoolean',
            'Data_WriteBoolean',
            'Data_WriteString',
            'Data_WriteInt32',
            'Data_WriteUInt32',
            'EggShell_REPL',
            'EggShell_ExecuteSlices',
            'Occurrence_Set',
            'Pointer_stringify'
        ]}], */

        Module.eggShell = {};
        publicAPI.eggShell = {};

        // Private Instance Variables (per vireo instance)
        var NULL = 0;
        var Vireo_Version = Module.cwrap('Vireo_Version', 'number', []);
        var EggShell_Create = Module.cwrap('EggShell_Create', 'number', ['number']);
        var EggShell_Delete = Module.cwrap('EggShell_Delete', 'number', ['number']);
        var EggShell_ReadDouble = Module.cwrap('EggShell_ReadDouble', 'number', ['number', 'string', 'string']);
        var EggShell_WriteDouble = Module.cwrap('EggShell_WriteDouble', 'void', ['number', 'string', 'string', 'number']);
        var EggShell_ReadValueString = Module.cwrap('EggShell_ReadValueString', 'string', ['number', 'string', 'string', 'string']);
        var EggShell_WriteValueString = Module.cwrap('EggShell_WriteValueString', 'void', ['number', 'string', 'string', 'string', 'string']);
        var EggShell_GetArrayMetadata = Module.cwrap('EggShell_GetArrayMetadata', 'number', ['number', 'string', 'string', 'number', 'number', 'number', 'number']);
        var EggShell_GetArrayDimLength = Module.cwrap('EggShell_GetArrayDimLength', 'number', ['number', 'string', 'string', 'number']);
        var EggShell_ResizeArray = Module.cwrap('EggShell_ResizeArray', 'number', ['number', 'string', 'string', 'number', 'number']);
        var Data_GetStringBegin = Module.cwrap('Data_GetStringBegin', 'number', []);
        var Data_GetStringLength = Module.cwrap('Data_GetStringLength', 'number', []);
        var Data_WriteString = Module.cwrap('Data_WriteString', 'void', ['number', 'number', 'string', 'number']);
        var Data_ReadBoolean = Module.cwrap('Data_ReadBoolean', 'number', ['number']);
        var Data_WriteBoolean = Module.cwrap('Data_WriteBoolean', 'void', ['number', 'number']);
        var Data_WriteInt32 = Module.cwrap('Data_WriteInt32', 'void', ['number', 'number']);
        var Data_WriteUInt32 = Module.cwrap('Data_WriteUInt32', 'void', ['number', 'number']);
        var EggShell_REPL = Module.cwrap('EggShell_REPL', 'number', ['number', 'string', 'number']);
        var EggShell_ExecuteSlices = Module.cwrap('EggShell_ExecuteSlices', 'number', ['number', 'number']);
        var Occurrence_Set = Module.cwrap('Occurrence_Set', 'void', ['number']);

        // Create shell for vireo instance
        var v_root = EggShell_Create(0);
        var v_userShell = EggShell_Create(v_root);
        var userPrintFunction;

        // Exported functions
        publicAPI.eggShell.setPrintFunction = function (fn) {
            if (typeof fn !== 'function') {
                throw new Error('Print must be a callable function');
            }

            userPrintFunction = fn;
            Module.print = fn;
        };

        publicAPI.eggShell.setPrintErrorFunction = function (fn) {
            if (typeof fn !== 'function') {
                throw new Error('PrintError must be a callable function');
            }

            Module.printErr = fn;
        };

        publicAPI.eggShell.internal_module_do_not_use_or_you_will_be_fired = Module;

        // Exporting functions to both Module.eggShell and publicAPI.eggShell is not normal
        // This is unique to the eggShell API as it is consumed by other modules as well as users
        Module.eggShell.version = publicAPI.eggShell.version = Vireo_Version;

        Module.eggShell.reboot = publicAPI.eggShell.reboot = function () {
            EggShell_Delete(v_userShell);
            EggShell_Delete(v_root);
            v_root = EggShell_Create(0);
            v_userShell = EggShell_Create(v_root);
        };

        Module.eggShell.readDouble = publicAPI.eggShell.readDouble = function (vi, path) {
            return EggShell_ReadDouble(v_userShell, vi, path);
        };

        Module.eggShell.writeDouble = publicAPI.eggShell.writeDouble = function (vi, path, value) {
            EggShell_WriteDouble(v_userShell, vi, path, value);
        };

        Module.eggShell.readJSON = publicAPI.eggShell.readJSON = function (vi, path) {
            return EggShell_ReadValueString(v_userShell, vi, path, 'JSON');
        };

        Module.eggShell.writeJSON = publicAPI.eggShell.writeJSON = function (vi, path, value) {
            EggShell_WriteValueString(v_userShell, vi, path, 'JSON', value);
        };

        var supportedArrayTypeConfig = {
            Int8: Module.HEAP8,
            Int16: Module.HEAP16,
            Int32: Module.HEAP32,
            UInt8: Module.HEAPU8,
            UInt16: Module.HEAPU16,
            UInt32: Module.HEAPU32,
            Single: Module.HEAPF32,
            Double: Module.HEAPF64
        };

        // Keep in sync with CEntryPoints.cpp
        var eggShellResultEnum = {
            0: 'Success',
            1: 'ObjectNotFoundAtPath',
            2: 'UnexpectedObjectType',
            3: 'InvalidResultPointer',
            4: 'UnableToCreateReturnBuffer'
        };

        var groupByDimensionLength = function (arr, startIndex, arrLength, dimensionLength) {
            var i, retArr, currArr, currArrIndex;

            if (arrLength % dimensionLength !== 0) {
                throw new Error('Cannot evenly split array into groups');
            }

            retArr = [];
            currArr = [];
            currArrIndex = 0;
            // TODO mraj should benchmark and see if difference between slice and iteration
            for (i = 0; i < arrLength; i += 1) {
                currArr[currArrIndex] = arr[startIndex + i];
                currArrIndex += 1;

                // After an increment currArrIndex is equivalent to the currArray length
                if (currArrIndex === dimensionLength) {
                    retArr.push(currArr);
                    currArr = [];
                    currArrIndex = 0;
                }
            }

            return retArr;
        };

        var convertFlatArraytoNArray = function (arr, startIndex, dimensionLengths) {
            var i;
            var rank = dimensionLengths.length;
            var arrLength = 1;

            for (i = 0; i < rank; i += 1) {
                arrLength *= dimensionLengths[i];
            }

            // Perform a copy of array rank 1
            var currArr;
            if (rank === 1) {
                currArr = [];
                for (i = 0; i < arrLength; i += 1) {
                    currArr[i] = arr[startIndex + i];
                }
                return currArr;
            }

            // Perform nd array creation for rank > 1
            // TODO mraj this is O((m-1)n) for rank m. So rank 2 is O(n) and can be improved for rank > 2
            currArr = arr;
            var currStartIndex = startIndex;
            var currArrLength = arrLength;
            var currDimensionLength;

            for (i = 0; i < rank - 1; i += 1) {
                currDimensionLength = dimensionLengths[i];
                currArr = groupByDimensionLength(currArr, currStartIndex, currArrLength, currDimensionLength);

                currStartIndex = 0;
                currArrLength = currArr.length;
            }

            return currArr;
        };

        var arrayTypeNameDoublePointer = Module._malloc(4);
        var arrayBeginPointer = Module._malloc(4);
        var arrayRankPointer = Module._malloc(4);

        Module.eggShell.getNumericArray = publicAPI.eggShell.getNumericArray = function (vi, path) {
            var eggShellResult = EggShell_GetArrayMetadata(v_userShell, vi, path, arrayTypeNameDoublePointer, arrayRankPointer, arrayBeginPointer);

            if (eggShellResult !== 0) {
                throw new Error('Querying Array Metadata failed for the following reason: ' + eggShellResultEnum[eggShellResult] +
                    ' (error code: ' + eggShellResult + ')' +
                    ' (vi name: ' + vi + ')' +
                    ' (path: ' + path + ')');
            }

            var arrayTypeNamePointer = Module.getValue(arrayTypeNameDoublePointer, 'i32');
            var arrayTypeName = Module.Pointer_stringify(arrayTypeNamePointer);
            var arrayRank = Module.getValue(arrayRankPointer, 'i32');
            var arrayBegin = Module.getValue(arrayBeginPointer, 'i32');

            var arrayTypeConfig = supportedArrayTypeConfig[arrayTypeName];
            if (arrayTypeConfig === undefined) {
                throw new Error('Unsupported type: ' + arrayTypeName + ', the following types are supported: ' + Object.keys(supportedArrayTypeConfig).join(','));
            }

            var i, returnArray;

            // Handle empty arrays
            if (arrayBegin === NULL) {
                returnArray = [];
                for (i = 0; i < arrayRank - 1; i += 1) {
                    returnArray = [returnArray];
                }

                return returnArray;
            }

            var arrayStartIndex = arrayBegin / arrayTypeConfig.BYTES_PER_ELEMENT;
            var dimensionLengths = [];
            for (i = 0; i < arrayRank; i += 1) {
                dimensionLengths[i] = Module.eggShell.getArrayDimLength(vi, path, i);
            }

            returnArray = convertFlatArraytoNArray(arrayTypeConfig, arrayStartIndex, dimensionLengths);
            return returnArray;
        };

        Module.eggShell.getArrayDimLength = publicAPI.eggShell.getArrayDimLength = function (vi, path, dim) {
            return EggShell_GetArrayDimLength(v_userShell, vi, path, dim);
        };

        Module.eggShell.resizeArray = publicAPI.eggShell.resizeArray = function (vi, path, newDimensionSizes) {
            var int32Byte = 4;
            var rank = newDimensionSizes.length;
            var newLengths = Module._malloc(rank * int32Byte);

            for (var i = 0; i < rank; i += 1) {
                Module.setValue(newLengths + (i * int32Byte), newDimensionSizes[i], 'i32');
            }

            var success = EggShell_ResizeArray(v_userShell, vi, path, rank, newLengths);

            Module._free(newLengths);

            return success;
        };

        Module.eggShell.dataReadString = function (stringPointer) {
            var begin = Data_GetStringBegin(stringPointer);
            var length = Data_GetStringLength(stringPointer);
            var str = Module.Pointer_stringify(begin, length);
            return str;
        };

        Module.eggShell.dataWriteString = function (destination, source) {
            var sourceLength = Module.lengthBytesUTF8(source);
            Data_WriteString(v_userShell, destination, source, sourceLength);
        };

        Module.eggShell.dataReadBoolean = function (booleanPointer) {
            var numericValue = Data_ReadBoolean(booleanPointer);
            return numericValue !== 0;
        };

        Module.eggShell.dataWriteBoolean = function (booleanPointer, booleanValue) {
            var numericValue = booleanValue ? 1 : 0;
            Data_WriteBoolean(booleanPointer, numericValue);
        };

        Module.eggShell.dataReadInt32 = function (intPointer) {
            return Module.getValue(intPointer, 'i32');
        };

        Module.eggShell.dataWriteInt32 = function (destination, value) {
            Data_WriteInt32(destination, value);
        };

        // TODO mraj we need to validate both of these unsigned functions are working correctly
        Module.eggShell.dataReadUInt32 = function (intPointer) {
            return Module.getValue(intPointer, 'i32');
        };

        Module.eggShell.dataWriteUInt32 = function (destination, value) {
            Data_WriteUInt32(destination, value);
        };

        Module.eggShell.loadVia = publicAPI.eggShell.loadVia = function (viaText) {
            if (typeof viaText !== 'string') {
                throw new Error('Expected viaText to be a string');
            }

            if (viaText.length === 0) {
                throw new Error('Empty viaText provided, nothing to run');
            }

            if (userPrintFunction === undefined) {
                console.warn('Failing to call eggShell.setPrintFunction prior to eggShell.loadVia may result in missed messages');
            }

            var viaTextLength = Module.lengthBytesUTF8(viaText);
            return EggShell_REPL(v_userShell, viaText, viaTextLength);
        };

        Module.eggShell.executeSlices = publicAPI.eggShell.executeSlices = function (slices) {
            return EggShell_ExecuteSlices(v_userShell, slices);
        };

        Module.eggShell.setOccurrenceAsync = function (occurrence) {
            // TODO mraj currently setOccurrenceAsync is only called
            // by relatively slow operation, may need to change from setTimeout
            // to improve performance in the future
            setTimeout(function () {
                Occurrence_Set(occurrence);
            }, 0);
        };
    };

    return assignEggShell;
}));

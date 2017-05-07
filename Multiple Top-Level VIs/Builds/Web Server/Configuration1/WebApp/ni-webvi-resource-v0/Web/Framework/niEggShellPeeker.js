//***************************************
// Vireo EggShell Peeker
// National Instruments Copyright 2017
//***************************************
// Summary:
// Finds an algorithm to extract and parse data from vireo eggshell.
// NationalInstruments.HtmlVI.EggShellPeeker.GetPeeker(nitype) returns a function that
// reads data from vireo depending on the nitype passed as parameter.
// Throws if parameter is not an instance of NIType.
(function () {
    'use strict';

    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NIType = window.NIType;
    var NITypeNames = window.NITypeNames;

    var stringPeeker, complexPeeker, numericPeeker, int64bitPeeker,
        enumPeeker, booleanPeeker, pathPeeker, analogPeeker,
        arrayPeeker, timestampPeeker, clusterPeeker;

    var getPeeker = function (type) {

        if (type instanceof NIType === false) {
            throw new Error('Peek type must be an instance of NIType. Found: ' + type);
        }

        if (type.isString()) {
            return stringPeeker;
        }

        if (type.isComplex()) {
            return complexPeeker;
        }

        if (type.is64BitInteger()) {
            return int64bitPeeker;
        }

        if (type.isNumeric()) {
            return numericPeeker;
        }

        if (type.isEnum()) {
            return enumPeeker;
        }

        if (type.isTimestamp()) {
            return timestampPeeker;
        }

        if (type.isBoolean()) {
            return booleanPeeker;
        }

        if (type.isPath()) {
            return pathPeeker;
        }

        if (type.isArray()) {
            return arrayPeeker;
        }

        if (type.isCluster()) {
            return clusterPeeker;
        }

        if (type.isAnalogWaveform()) {
            return analogPeeker;
        }

        throw new Error(NI_SUPPORT.i18n('msg_UNKNOWN_TYPE', type));
    };

    // Builds an indexed path to be used for reading a N-dimensional array in vireo's memory
    // @param path: variable name in vireo.
    // @param sizes: the length of each dimension of the array. e.g. [2, 3] <- A 2 by 3 2D-Array.
    // @param cellIndex: considering a flatten N-dimensional array, the cell index to find.
    //  e.g. path = 'myArray', sizes = [3, 4], cellIndex = 7
    //  this means that myArray is a 3 by 4 array which could be flatten to a 12 cells array.
    //  asking the 7th cell would return 'myArray.1.3' <- 2nd row, 4th column.
    var buildArrayIndexedPath = function (path, sizes, cellIndex) {
        var ndimIndex = [];
        for (var i = sizes.length - 1; i >= 0; i--) {
            var index = cellIndex % sizes[i];
            cellIndex = Math.floor(cellIndex / sizes[i]);

            ndimIndex.unshift(index);
        }

        return path + '.' + ndimIndex.join(',');
    };

    // transforms a 1 dimensional array to N dimension with lengths specified in sizes parameter.
    // returns the original array if tries to reshape to a 1D array. (sizes.lenth === 1)
    // e.g. array = [1, 2, 3, 4, 5, 6], sizes = [2, 3] returns: [[1, 2, 3], [4, 5, 6]]
    var reshapeArray = function (array, sizes) {
        if (sizes.length === 1) {
            return array;
        }

        var size = sizes[0];
        var subarraySize = array.length / size;
        var reshapedArray = [];

        for (var i = 0; i < size; i++) {
            var slicedArray = array.slice(i * subarraySize, (i + 1) * subarraySize);
            reshapedArray[i] = reshapeArray(slicedArray, sizes.slice(1));
        }

        return reshapedArray;
    };

    var getArrayDimensions = function (eggShell, viName, path, rank) {
        var i, dimensions = [];
        for (i = 0; i < rank; i++) {
            dimensions[i] = eggShell.getArrayDimLength(viName, path, i);
        }

        return dimensions;
    };

    var optimizedArraySubtypes = {};
    optimizedArraySubtypes[NITypeNames.UINT8] = true;
    optimizedArraySubtypes[NITypeNames.UINT16] = true;
    optimizedArraySubtypes[NITypeNames.UINT32] = true;
    optimizedArraySubtypes[NITypeNames.INT8] = true;
    optimizedArraySubtypes[NITypeNames.INT16] = true;
    optimizedArraySubtypes[NITypeNames.INT32] = true;
    optimizedArraySubtypes[NITypeNames.SINGLE] = true;
    optimizedArraySubtypes[NITypeNames.DOUBLE] = true;

    var isOptimizedArraySubtype = function (type) {
        return optimizedArraySubtypes[type.getName()] === true;
    };

    arrayPeeker = function (eggShell, viName, path, type) {
        var i, cellValue, indexedPath;

        var subtype = type.getSubtype();

        if (isOptimizedArraySubtype(subtype)) {
            return eggShell.getNumericArray(viName, path);
        }

        var subpeeker = getPeeker(subtype),
            rank = type.getRank(),
            resultArray = [],
            sizes = getArrayDimensions(eggShell, viName, path, rank).reverse(),
            total_cells = sizes.reduce(Math.imul);

        for (i = 0; i < total_cells; i++) {
            indexedPath  = buildArrayIndexedPath(path, sizes, i);
            cellValue = subpeeker(eggShell, viName, indexedPath, subtype);
            resultArray.push(cellValue);
        }

        return reshapeArray(resultArray, sizes);
    };

    analogPeeker = function (eggShell, viName, path, type) {
        var tstamp = timestampPeeker(eggShell, viName, path + '.t0');
        var tinterval = numericPeeker(eggShell, viName, path + '.dt');
        var arrayType = new NIType({name: NITypeNames.ARRAY, rank: 1, subtype: type.getSubtype().getName()});
        var y = arrayPeeker(eggShell, viName, path + '.Y', arrayType);
        return {t0: tstamp, dt: tinterval, Y: y};
    };

    clusterPeeker = function (eggShell, viName, path, type) {
        var subValue, encodedField, subPath, subpeeker,
            value = {},
            fields = type.getFields(),
            subtypes = type.getSubtype();

        for (var i = 0; i < fields.length; i = i + 1) {
            encodedField = NationalInstruments.HtmlVI.EggShell.encodeVireoIdentifier(fields[i]);
            subPath = path + '.' + encodedField;
            subpeeker = getPeeker(subtypes[i]);
            subValue = subpeeker(eggShell, viName, subPath, subtypes[i]);
            value[fields[i]] = subValue;
        }

        return value;
    };

    stringPeeker = function (eggShell, viName, path) {
        return JSON.parse(eggShell.readJSON(viName, path));
    };

    complexPeeker = function (eggShell, viName, path) {
        var complex = JSON.parse(eggShell.readJSON(viName, path));
        var niComplex = new window.NIComplex(complex.real, complex.imaginary);
        return niComplex.toString();
    };

    numericPeeker = function (eggShell, viName, path) {
        return eggShell.readDouble(viName, path);
    };

    int64bitPeeker = function (eggshell, viName, path) {
        return eggshell.readJSON(viName, path);
    };

    timestampPeeker = function (eggShell, viName, path) {
        // TODO mraj reading a timestamp as a double may result in loss of precision, see https://nitalk.jiveon.com/thread/74202
        var value = eggShell.readDouble(viName, path);
        return new window.NITimestamp(value).toString();
    };

    enumPeeker = function (eggShell, viName, path) {
        return eggShell.readDouble(viName, path);
    };

    booleanPeeker = function (eggShell, viName, path) {
        var value = eggShell.readDouble(viName, path);
        return (value === 0) ? false : true;
    };

    pathPeeker = function (eggShell, viName, path) {
        return JSON.parse(eggShell.readJSON(viName, path));
    };

    NationalInstruments.HtmlVI.EggShellPeeker = Object.freeze({
        GetPeeker : getPeeker
    });
}());

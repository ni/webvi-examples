//***************************************
// Vireo EggShell Peeker
// National Instruments Copyright 2017
//***************************************
// Summary:
// Finds an algorithm to serialize and write data to vireo eggshell.
// NationalInstruments.HtmlVI.EggShellPeeker.GetPeeker(nitype) returns a function that
// writes data to vireo depending on the nitype passed as parameter.
// Throws if parameter is not an instance of NIType.
(function () {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NIType = window.NIType;
    var NITypeNames = window.NITypeNames;

    var stringPoker, complexPoker, numericPoker, int64bitPoker,
        enumPoker, booleanPoker, pathPoker, analogPoker,
        arrayPoker, timestampPoker, clusterPoker;

    var getPoker = function (type) {

        if (type instanceof NIType === false) {
            throw new Error('Poke type must be an instance of NIType. Found: ' + type);
        }

        if (type.isString()) {
            return stringPoker;
        }

        if (type.isComplex()) {
            return complexPoker;
        }

        if (type.is64BitInteger()) {
            return int64bitPoker;
        }

        if (type.isNumeric()) {
            return numericPoker;
        }

        if (type.isEnum()) {
            return enumPoker;
        }

        if (type.isBoolean()) {
            return booleanPoker;
        }

        if (type.isPath()) {
            return pathPoker;
        }

        if (type.isArray()) {
            return arrayPoker;
        }

        if (type.isTimestamp()) {
            return timestampPoker;
        }

        if (type.isCluster()) {
            return clusterPoker;
        }

        if (type.isAnalogWaveform()) {
            return analogPoker;
        }

        throw new Error(NI_SUPPORT.i18n('msg_UNKNOWN_TYPE', type));
    };

    stringPoker = function (eggShell, viName, path, type, data) {
        var stringData = JSON.stringify(data);
        eggShell.writeJSON(viName, path, stringData);
    };

    complexPoker = function (eggShell, viName, path, type, data) {
        var niComplex = new window.NIComplex(data);
        var complex = JSON.stringify({real: niComplex.realPart, imaginary: niComplex.imaginaryPart});
        eggShell.writeJSON(viName, path, complex);

    };

    numericPoker = function (eggShell, viName, path, type, data) {
        eggShell.writeDouble(viName, path, data);
    };

    int64bitPoker = function (eggShell, viName, path, type, data) {
        eggShell.writeJSON(viName, path, data);
    };

    enumPoker = function (eggShell, viName, path, type, data) {
        eggShell.writeDouble(viName, path, data);
    };

    booleanPoker = function (eggShell, viName, path, type, data) {
        var bool = data === true ? 1 : 0;
        eggShell.writeDouble(viName, path, bool);
    };

    pathPoker = function (eggShell, viName, path, type, data) {
        var stringData = JSON.stringify(data);
        eggShell.writeJSON(viName, path, stringData);
    };

    timestampPoker = function (eggShell, viName, path, type, data) {
        // TODO mraj writing a timestamp as a double may result in loss of precision, see https://nitalk.jiveon.com/thread/74202
        eggShell.writeDouble(viName, path, new window.NITimestamp(data).valueOf());
    };

    var pokeArray = function (eggShell, viName, path, poker, type, data, level) {
        var i, separator;
        if (Array.isArray(data)) {
            for (i = 0; i < data.length; i++) {
                separator = level !== 0 ? ',' : '.';
                pokeArray(eggShell, viName, path + separator + i, poker, type, data[i], level + 1);
            }
        } else {
            poker(eggShell, viName, path, type, data);
        }
    };

    var getDataLengths = function (data) {
        var lengths = [];
        var arr = data;

        while (Array.isArray(arr)) {
            lengths.push(arr.length);
            arr = arr[0];
        }

        return lengths;
    };

    var resizeArray = function (eggShell, viName, path, newDimensions) {
        eggShell.resizeArray(viName, path, newDimensions);
    };

    arrayPoker = function (eggShell, viName, path, type, data) {
        var subtype = type.getSubtype(),
            subpoker = getPoker(subtype),
            dataLengths = getDataLengths(data).reverse();

        resizeArray(eggShell, viName, path, dataLengths);
        pokeArray(eggShell, viName, path, subpoker, subtype, data, 0);
    };

    analogPoker = function (eggShell, viName, path, type, data) {
        var arrayType = new NIType({ name: NITypeNames.ARRAY, rank: 1, subtype: type.getSubtype().getName() });
        timestampPoker(eggShell, viName, path + '.t0', type, data.t0);
        numericPoker(eggShell, viName, path + '.dt', type, data.dt);
        arrayPoker(eggShell, viName, path + '.Y', arrayType, data.Y);
    };

    clusterPoker = function (eggShell, viName, path, type, data) {
        var encodedField, subPath, subpoker,
            fields = type.getFields(),
            subtypes = type.getSubtype();

        for (var i = 0; i < fields.length; i = i + 1) {
            encodedField = NationalInstruments.HtmlVI.EggShell.encodeVireoIdentifier(fields[i]);
            subPath = path + '.' + encodedField;
            subpoker = getPoker(subtypes[i]);
            subpoker(eggShell, viName, subPath, subtypes[i], data[fields[i]]);
        }

    };

    NationalInstruments.HtmlVI.EggShellPoker = Object.freeze({
        GetPoker : getPoker
    });
}());

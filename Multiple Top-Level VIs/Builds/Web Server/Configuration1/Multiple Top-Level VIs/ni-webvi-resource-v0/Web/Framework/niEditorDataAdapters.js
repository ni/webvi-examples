//***************************************************************************************
// NI Editor Data Adapters
// (Conversion between JS control model formats, and what we need to send to the editor)
// Currently this just handles changing Infinity / -Infinity / NaN to a string before we
// JSON stringify it (and vice versa).
// TODO DE12297 - We should also extend this code to cover analog waveforms, for the
// graph.
//***************************************************************************************

NationalInstruments.HtmlVI.NIEditorDataAdapters =
    (function () {
        'use strict';

        // Input: A JavaScript number (can be Infinity/-Infinity/NaN)
        // Output: A JS number, or a string representing Infinity/-Infinity/NaN
        var convertJsNaNInf = function (val) {
            if (typeof val !== 'number') {
                throw new Error('Expected value to be number type');
            }

            if (Object.is(window.NaN, val)) {
                return 'NaN';
            } else if (val === Number.POSITIVE_INFINITY) {
                return 'Infinity';
            } else if (val === Number.NEGATIVE_INFINITY) {
                return '-Infinity';
            }

            return val;
        };

        // Input: A JS number or a string ('Infinity', '-Infinity', or 'NaN')
        // Output: A JavaScript number (can be Infinity/-Infinity/NaN)
        var convertNaNInfString = function (val) {
            if (typeof val === 'number') {
                return val;
            } else {
                switch (val) {
                    case 'NaN':
                        return window.NaN;
                    case 'Infinity':
                        return Number.POSITIVE_INFINITY;
                    case '-Infinity':
                        return Number.NEGATIVE_INFINITY;
                    default:
                        throw new Error('Unexpected value. Expected a JS number; or \'NaN\', \'Infinity\', or \'-Infinity\'' + '. Value: ' + val + ', type ' + (typeof val));
                }
            }
        };

        var convertJsFloatArray = function (jsValue, curRank, valueAdapter, copyData) {
            var i, result = copyData ? [] : jsValue;
            if (curRank === 1) {
                for (i = 0; i < jsValue.length; i++) {
                    result[i] = valueAdapter(jsValue[i]);
                }
            } else {
                for (i = 0; i < jsValue.length; i++) {
                    result[i] = convertJsFloatArray(jsValue[i], curRank - 1, valueAdapter, copyData);
                }
            }

            return result;
        };

        var convertJsArray = function (jsValue, elementType, curRank, valueAdapter, copyData) {
            var i, result = copyData ? [] : jsValue;
            if (curRank === 1) {
                for (i = 0; i < jsValue.length; i++) {
                    result[i] = convert(jsValue[i], elementType, valueAdapter, copyData);
                }
            } else {
                for (i = 0; i < jsValue.length; i++) {
                    result[i] = convertJsArray(jsValue[i], elementType, curRank - 1, valueAdapter, copyData);
                }
            }

            return result;
        };

        var needsConversion = function (niType) {
            var subtype, i, result = false;

            if (niType !== undefined) {
                if (niType.isFloat()) {
                    result = true;
                } else if (niType.isArray()) {
                    result = needsConversion(niType.getSubtype());
                } else if (niType.isCluster()) {
                    subtype = niType.getSubtype();
                    if (subtype !== undefined) {
                        for (i = 0; i < subtype.length; i++) {
                            result = result || needsConversion(subtype[i]);
                        }
                    }
                }
            }

            return result;
        };

        var convert = function (val, niType, valueAdapter, copyData) {
            var subtype, fields, field, i, result = val;
            if (niType !== undefined) {
                if (niType.isFloat()) {
                    result = valueAdapter(val);
                } else if (niType.isArray()) {
                    subtype = niType.getSubtype();
                    if (Array.isArray(val)) {
                        if (subtype.isFloat()) {
                            result = convertJsFloatArray(val, niType.getRank(), valueAdapter, copyData);
                        } else if (subtype.isCluster()) {
                            result = convertJsArray(val, subtype, niType.getRank(), valueAdapter, copyData);
                        }
                    }
                } else if (niType.isCluster()) {
                    subtype = niType.getSubtype();
                    if (subtype !== undefined) {
                        result = copyData ? {} : val;
                        fields = niType.getFields();
                        for (i = 0; i < fields.length; i++) {
                            field = fields[i];
                            if (val.hasOwnProperty(field)) {
                                result[field] = convert(val[field], subtype[i], valueAdapter, copyData);
                            }
                        }
                    } else {
                        result = val;
                    }
                }
            }

            return result;
        };

        var jsModelToEditor = function (jsValue, niType) {
            if (!needsConversion(niType)) {
                return jsValue;
            }

            // copyData = true here because if we're going to switch out NaN/Inf/-Inf to 'Infinity'/'-Infinity'/'NaN'
            // we can't do that in-place (on an array or cluster), since we'd be affecting the model (and element's) value,
            // which should use the real NaN/Inf/-Inf.
            return convert(jsValue, niType, convertJsNaNInf, true);
        };

        var editorToJsModel = function (editorValue, niType) {
            if (!needsConversion(niType)) {
                return editorValue;
            }

            // copyData = false here because we're assuming that editorToJsModel is always called with a value object that was just created from a JSON.parse,
            // since this is an update message coming from the editor. So, creating another copy of the data is unnecessary.
            return convert(editorValue, niType, convertNaNInfString, false);
        };

        return Object.freeze({
            jsModelToEditor: jsModelToEditor,
            editorToJsModel: editorToJsModel
        });
    }());

//****************************************
// Chart Graph Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var HistoryBuffer = window.HistoryBuffer;

    // Constructor Function
    NationalInstruments.HtmlVI.Models.ChartModel = function (id) {
        parent.call(this, id);

        // Public Instance Properties
        this.historyBuffer = new HistoryBuffer(1024, 1);

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    NI_SUPPORT.defineConstReference(NationalInstruments.HtmlVI.Models.ChartModel, 'MODEL_KIND', 'niChart');

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.Models.ChartModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    var ensureHistoryBufferWidth = function (buffer, width) {
        buffer.setWidth(width);
    };

    var arrayColumn = function (array2d, index) {
        var column = [];
        for (var j = 0; j < array2d.length; j++) {
            column.push(array2d[j][index]);
        }

        return column;
    };

    var isHistoryBuffer = function (value) {
        return typeof value === 'object' && value.valueType === 'HistoryBuffer';
    };

    var copyArrayToHistoryBuffer = function (historyBuffer, array, transpose) {
        var arrWidth = array.length,
            arrHeight = Array.isArray(array[0]) ? array[0].length : 0,
            width = transpose ? arrWidth : arrHeight,
            height = transpose ? arrHeight : arrWidth;

        ensureHistoryBufferWidth(historyBuffer, height);
        for (var i = 0; i < width; i++) {
            historyBuffer.push(transpose ? array[i] : arrayColumn(array, i));
        }
    };

    var appendDataToHistoryBuffer = function (historyBuffer, arrValue, transpose) {
        if (arrValue.length > 0) {
            if (typeof arrValue[0] === 'number') {
                ensureHistoryBufferWidth(historyBuffer, 1);
                historyBuffer.appendArray(arrValue);
            } else if (arrValue[0] instanceof Array) {
                copyArrayToHistoryBuffer(historyBuffer, arrValue, transpose);
            }
        }
    };

    var loadHistoryBufferfromJSON = function (historyBuffer, value) {
        historyBuffer.clear();

        var arrValue = value.data;
        /*extend history buffer size to the received size*/
        historyBuffer.setCapacity(value.size || historyBuffer.capacity);
        if (value.timingIndexes) {
            historyBuffer.indexMap =
                value.timingIndexes.map(function (time) {
                    return (new window.NITimestamp(time).toAbsoluteTime());
                });
        } else {
            historyBuffer.offset = undefined;
        }

        if (value.startIndex !== undefined) {
            historyBuffer.count = value.startIndex;
        }

        appendDataToHistoryBuffer(historyBuffer, arrValue, false);
    };

    // Public Prototype Methods
    proto.registerModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addModelProperty(targetPrototype, {
            propertyName: 'historySize',
            defaultValue: 1024,
            customSetter: function (oldValue, newValue) {
                this.historyBuffer.setCapacity(newValue);
                return newValue;
            }
        });

        // TODO mraj is the bufferSize computed property really needed?
        proto.addModelProperty(targetPrototype, {
            propertyName: 'bufferSize',
            computedProp: true,
            customGetter: function () {
                return this.historySize;
            },
            customSetter: function (oldValue, newValue) {
                this.historySize = newValue;
            }
        });

        proto.addModelProperty(targetPrototype, {
            propertyName: 'value',
            computedProp: true,
            customGetter: function () {
                return [];
            },
            customSetter: function (oldValue, newValue) {
                if (typeof newValue === 'number') {
                    ensureHistoryBufferWidth(this.historyBuffer, 1);
                    this.historyBuffer.push(newValue);
                } else {
                    try {
                        var arrValue = [];

                        if (Array.isArray(newValue)) {
                            arrValue = newValue;
                            appendDataToHistoryBuffer(this.historyBuffer, arrValue, true);
                        } else if (isHistoryBuffer(newValue)) {
                            loadHistoryBufferfromJSON(this.historyBuffer, newValue);
                        } else if (typeof newValue === 'object') {
                            // Vireo clusters
                            arrValue = Object.keys(newValue).map(function (key) {
                                return newValue[key];
                            });

                            copyArrayToHistoryBuffer(this.historyBuffer, [arrValue], true);
                        } else if (typeof newValue === 'string') {
                            arrValue = JSON.parse(newValue);
                            appendDataToHistoryBuffer(this.historyBuffer, arrValue, true);
                        }

                    } catch (e) {
                        // invalid JSON ... do nothing // TODO mraj should we instead throw an error?
                    }
                }
            }
        });
    });

    proto.propertyUsesNITypeProperty = function (propertyName) {
        // jshint unused: vars
        // TODO DE12297 - Currently the chart (probably) won't handle NaN/Inf correctly if those values are in a history buffer
        // sent from the editor. We can't use the existing code paths with niEditorDataAdapters because the chart's niType
        // is Double, so we assume that we're given a single number value to convert, when in reality we get a history
        // buffer.
        return false;
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerModel(child);
}(NationalInstruments.HtmlVI.Models.CartesianGraphModel));

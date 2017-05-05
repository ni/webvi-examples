/* Flot plugin that makes charting easier and more efficient.

Copyright (c) 2007-2015 National Instruments
Licensed under the MIT license.
*/
/*global jQuery, requestAnimationFrame*/

(function ($) {
    'use strict';

    // flot hook which decimates the data from the historyBuffer and converts it into a format that flot understands
    function processRawData(plot, dataSeries, x, datapoints) {
        var indexMap; // this a "dictionary" from 0 based indexes in the history buffer to target values
        if (dataSeries.historyBuffer) {
            var historyBuffer = dataSeries.historyBuffer;
            var size = historyBuffer.buffer.size;
            indexMap = historyBuffer.indexMap;
            var width = plot.width();
            var step;

            if (width > 0) {
                step = Math.floor(size / plot.width());
            } else {
                step = Math.floor(size / 500);
            }

            var index = plot.getData().indexOf(dataSeries);
            var data = dataSeries.historyBuffer.query(historyBuffer.startIndex(), historyBuffer.lastIndex(), step, index);

            var points = datapoints.points;
            for (var i = 0, j=0; i < data.length; i++, j+=2) {
                points[j] = indexMap ? indexMap[data[i][0]] : data[i][0];
                points[j+1] = data[i][1];
            }

            points.length = data.length * 2;
            datapoints.pointsize = 2;
        }
    }

    // remove old data series and trigger the computation of a new one from the history buffer
    function updateSeries(plot, historyBuffer) {
        var dataSeries = plot.getData();
        for (var i = 0; i < historyBuffer.width; i++) {
            if (typeof dataSeries[i] === 'object') {
                dataSeries[i].data = [];
                // although it would be nice to reuse data points, flot does nasty
                // things with the dataSeries (deep copy, showing with ~50% percent
                // on the timeline)
                delete dataSeries[i].datapoints;
            } else {
                dataSeries[i] = [];
            }
        }

        if (dataSeries.length > historyBuffer.width) {
            dataSeries.length = historyBuffer.width;
        }

        plot.setData(dataSeries);
    }

    // draw the chart
    function drawChart(plot) {
        plot.setupGrid();
        plot.draw();
    }

    // plugin entry point
    function init(plot) {

        var isShutdown = false;

        // called on every history buffer change.
        function triggerDataUpdate(plot, historyBuffer) {
            if (!plot.dataUpdateTriggered) {
                plot.dataUpdateTriggered = requestAnimationFrame(function () { // throttle charting computation/drawing to the browser frame rate
                    if (!isShutdown) {
                        updateSeries(plot, historyBuffer);
                        drawChart(plot);
                    }
                    plot.dataUpdateTriggered = null;
                });
            }
        }

        plot.hooks.processOptions.push(function (plot) {
            var historyBuffer = plot.getOptions().series.historyBuffer; // looks for the historyBuffer option
            if (historyBuffer) {
                plot.hooks.processRawData.push(processRawData); // enable charting plugin for this flot chart
                historyBuffer.onChange(function () {
                    triggerDataUpdate(plot, historyBuffer); // call triggerDataUpdate on every historyBuffer modification
                });
                updateSeries(plot, historyBuffer);
            }
        });

        plot.hooks.shutdown.push(function() {
            isShutdown = true;
        });
    }

    $.plot.plugins.push({
        init: init,
        name: 'charting',
        version: '0.3'
    });
})(jQuery);

/* * The MIT License
Copyright (c) 2010, 2011, 2012, 2013 by Juergen Marsch
Copyright (c) 2015 by Andrew Dove & Ciprian Ceteras
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function (global, $) {

function IntensityGraph() {

    this.pluginName = 'intensitygraph',
    this.pluginVersion = '0.2';
    this.defaultOptions = {
        series: {
            intensitygraph: {
                data: [],
                show: false,
                lowColor: 'rgba(0,0,0,1)',
                highColor: 'rgba(255,255,255,1)',
                min: 0,
                max: 1
            }
        }
    };

    var defaultGradient = [
        { value: 0, color: 'rgba(0,0,0,1)' },
        { value: 0.50, color: 'rgba(0,0,255,1)' },
        { value: 1.0, color: 'rgba(255,255,255,1)' }
    ];

    function extendEmpty(org, ext) {
        for (var i in ext) {
            if (!org[i]) {
                org[i] = ext[i];
            } else {
                if (typeof ext[i] === 'object') {
                    extendEmpty(org[i], ext[i]);
                }
            }
        }
    };

    function createArray(length) {
        length = Math.ceil(length) || 0;
        var arr = new Array(length),
            i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while (i--) arr[length - 1 - i] = createArray.apply(this, args);
        }

        return arr;
    };

    function processRawData(plot, s, sData, sDatapoints) {
        var opts = plot.getOptions();
        if (opts.series.intensitygraph.show === true && sData[0].length > 0) {
            sDatapoints.pointsize = 2;

            // push two data points, one with xmin, ymin, the other one with xmax, ymax
            // so the autoscale algorithms can determine the draw size.
            sDatapoints.points.length = 0;
            sDatapoints.points.push(0, 0);
            sDatapoints.points.push(sData.length || 0, sData[0] ? sData[0].length : 0);
        }

        // TODO reserve enough space so the map is not drawn outside of the chart.
    }

	var drawLegend = function(ctx, x, y, w, h, gradient, lowColor, highColor) {
		var highLowColorBoxHeight = 7,
		  grad = ctx.createLinearGradient(0, y + h, 0, y),
		  first = gradient[0].value, last = gradient[gradient.length - 1].value, offset, i;
		for (i = 0; i < gradient.length; i++) {
			offset = (gradient[i].value - first) / (last - first);
			if (offset >= 0 && offset <= 1.0) {
				grad.addColorStop(offset, gradient[i].color);
			}
		}

		ctx.fillStyle = grad;
		ctx.fillRect(x, y, w, h);
		ctx.fillStyle = lowColor;
		ctx.fillRect(x, y + h, w, highLowColorBoxHeight);
		ctx.strokeStyle = '#000000';
		ctx.lineWidth = 1;
		ctx.strokeRect(x - 0.5, y + h + 0.5, w + 1, highLowColorBoxHeight);
		ctx.fillStyle = highColor;
		ctx.fillRect(x, y - highLowColorBoxHeight, w, highLowColorBoxHeight);
		ctx.strokeStyle = '#000000';
		ctx.lineWidth = 1;
		ctx.strokeRect(x - 0.5, y - highLowColorBoxHeight + 0.5, w + 1, highLowColorBoxHeight);
	};
	this.drawLegend = drawLegend;

    this.init = function(plot) {
        var opt = null,
            offset = '7',
            acanvas = null,
            series = null;
        plot.hooks.processOptions.push(processOptions);

        function processOptions(plot, options) {
            if (options.series.intensitygraph.show) {
                extendEmpty(options, this.defaultOptions);
                if (!options.series.intensitygraph.gradient) {
                    options.series.intensitygraph.gradient = defaultGradient;
                }

                opt = options;
                plot.hooks.drawSeries.push(drawSeries);
                plot.hooks.processRawData.push(processRawData);
                initColorPalette();
            }
        };

        function initColorPalette() {
            var i, x;
            var canvas = document.createElement('canvas');
            canvas.width = '1';
            canvas.height = '256';
            var ctx = canvas.getContext('2d'),
              grad = ctx.createLinearGradient(0, 0, 0, 256),
              gradient = opt.series.intensitygraph.gradient,
                  first = gradient[0].value, last = gradient[gradient.length - 1].value, offset;

            if (last === first) {
                grad.addColorStop(0, gradient[0].color);
                grad.addColorStop(1, gradient[0].color);
            } else {
                for (i = 0; i < gradient.length; i++) {
                    x = gradient[i].value;
                    offset = (x - first) / (last - first);
                    if (offset >= 0 && offset <= 1) {
                        grad.addColorStop(offset, gradient[i].color);
                    }
                }
            }

            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 1, 256);
            opt.series.intensitygraph.palette = [];
            var imgDataPalette = ctx.getImageData(0, 0, 1, 256).data;
            for (var i = 0; i < imgDataPalette.length; i += 4) {
                opt.series.intensitygraph.palette[i / 4] = "rgba(" +
                    imgDataPalette[i] +
                    "," +
                    imgDataPalette[i + 1] +
                    "," +
                    imgDataPalette[i + 2] +
                    "," +
                    imgDataPalette[i + 3] / 255 +
                    ")";
            }
        };

        function drawSeries(plot, ctx, serie) {
            var id = ctx.createImageData(1, 1);
            var halfScaleX, halfScaleY, left, top;
            var i, j, value, x, y;
            var range = serie.intensitygraph.max - serie.intensitygraph.min;

            var colorLow = serie.intensitygraph.lowColor;
            var colorHigh = serie.intensitygraph.highColor;

            var palette = opt.series.intensitygraph.palette;
            var scaleX = Math.abs(plot.width() / (serie.xaxis.max - serie.xaxis.min));
            var scaleY = Math.abs(plot.height() / (serie.yaxis.max - serie.yaxis.min));
            var offset = plot.getPlotOffset();
            ctx.save();
            ctx.beginPath();
            ctx.rect(offset.left,offset.top, plot.width(),plot.height());
            ctx.clip();
            if (scaleX > 1 || scaleY > 1) {
                scaleX = Math.ceil(scaleX);
                scaleY = Math.ceil(scaleY);
                halfScaleX = scaleX / 2;
                halfScaleY = scaleY / 2;
                left = offset.left + halfScaleX;
                top = offset.top - halfScaleY;
                for (i = Math.max(serie.xaxis.min, 0) | 0; i < Math.min(serie.data.length, serie.xaxis.max); i++) {
                    for (j = Math.max(serie.yaxis.min, 0) | 0; j < Math.min(serie.data[0].length, serie.yaxis.max); j++) {
                        if (0 <= i && i < serie.data.length &&
                            0 <= j && j < serie.data[i].length) {
                            value = serie.data[i][j];
                            drawRectangle(ctx, serie.xaxis.p2c(i) + left, serie.yaxis.p2c(j) + top, value);
                        }
                    }
                }
            } else {
                var cache = createArray(plot.width() + 1, plot.height() + 1);
                for (i = Math.max(serie.xaxis.min, 0) | 0; i < Math.min(serie.data.length, serie.xaxis.max); i++) {
                    for (j = Math.max(serie.yaxis.min, 0) | 0; j < Math.min(serie.data[0].length, serie.yaxis.max); j++) {
                        value = serie.data[i][j];
                        x = Math.round(serie.xaxis.p2c(i));
                        y = Math.round(serie.yaxis.p2c(j));
                        var current = cache[x][y];
                        if (current === undefined || value > current) {
                            cache[x][y] = value;
                            drawPixel(ctx, x + offset.left, y + offset.top, value);
                        }
                    }
                }
            }

            ctx.restore();

            if (opt.series.intensitygraph.legend === true) {
                var colorLegendAxis = opt.yaxes.filter(function (axis) { return axis.position === 'right' && axis.reserveSpace && axis.labelWidth; })[0],
                    colorLegendWidth = colorLegendAxis ? (colorLegendAxis.labelWidth - 10) : 20,
					yaxisLabelWidth = !isNaN(opt.yaxes[0].labelWidth) ? opt.yaxes[0].labelWidth : 0,
					x = (opt.yaxes[0].position === 'right' && opt.yaxes[0].type !== 'colorScaleGradient') ? offset.left + plot.width() + yaxisLabelWidth + 30: offset.left + plot.width() + 20,
				    gradient = opt.series.intensitygraph.gradient,
                    lowColor = opt.series.intensitygraph.lowColor,
                    highColor = opt.series.intensitygraph.highColor;
                drawLegend(ctx, x, offset.top, colorLegendWidth, plot.height(), gradient, lowColor, highColor);
            }

            function getColor(value) {
                if (range === 0) {
                    index = 127; // 0.5 * 255
                    return palette[index];
                } else if (value < serie.intensitygraph.min) {
                    return colorLow
                } else if (value > serie.intensitygraph.max) {
                    return colorHigh
                } else {
                    index = Math.round((value - serie.intensitygraph.min) * 255 / range);
                    return palette[index];
                }
            };

            function drawPixel(ctx, x, y, value) {
                var colorRGBA = getColor(value);

                var colorStr = colorRGBA.slice(colorRGBA.indexOf('(') + 1, colorRGBA.indexOf(')'));
                var colorArr = colorStr.split(',');

                id.data[0] = parseInt(colorArr[0], 10);
                id.data[1] = parseInt(colorArr[1], 10);
                id.data[2] = parseInt(colorArr[2], 10);
                id.data[3] = parseFloat(colorArr[3])*255;

                ctx.putImageData(id, x, y);
            };

            function drawRectangle(ctx, x, y, value) {
                // storing the variables because they will be often used
                var xb = Math.floor(x - halfScaleX),
                  yb = Math.floor(y - halfScaleY);

                ctx.fillStyle = getColor(value);
                ctx.fillRect(xb, yb, scaleX, scaleY);
            };
        };
    };
};

var intensityGraph = new IntensityGraph();

$.plot.plugins.push({
	init: intensityGraph.init,
	options: intensityGraph.defaultOptions,
	name: intensityGraph.pluginName,
	version: intensityGraph.pluginVersion
});

if (typeof module === 'object' && module.exports) {
	module.exports = IntensityGraph;
} else {
	global.IntensityGraph = IntensityGraph;
}

})(this, jQuery);

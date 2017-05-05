/*
Axis label plugin for engineering-flot

Derived from:
Axis Labels Plugin for flot.
http://github.com/markrcote/flot-axislabels

Original code is Copyright (c) 2010 Xuan Luo.
Original code was released under the GPLv3 license by Xuan Luo, September 2010.
Original code was rereleased under the MIT license by Xuan Luo, April 2012.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function($) {
    "use strict";

    var options = {
        axisLabels: {
            show: true
        }
    };

    function AxisLabel(axisName, position, padding, placeholder, axisLabel) {
        this.axisName = axisName;
        this.position = position;
        this.padding = padding;
        this.placeholder = placeholder;
        this.axisLabel = axisLabel;
        this.width = 0;
        this.height = 0;
        this.elem = null;
    }

    AxisLabel.prototype.calculateSize = function() {
        var div = document.createElement('div'),
            classNameId = this.axisName + 'Label';
        div.className = classNameId + ' axisLabels';
        div.style.position = 'absolute';
        div.textContent = this.axisLabel;
        this.placeholder.appendChild(div);

        var box = div.getBoundingClientRect();
        this.labelWidth = box.width;
        this.labelHeight = box.height;
        this.placeholder.removeChild(div);

        this.width = this.height = 0;
        this.width = this.labelWidth + this.padding;
        this.height = this.labelHeight + this.padding;

        this.width = this.height = 0;
        if (this.position === 'left' || this.position === 'right') {
            this.width = this.labelHeight + this.padding;
        } else {
            this.height = this.labelHeight + this.padding;
        }
    };

    AxisLabel.prototype.transforms = function(degrees, x, y) {
        var stransforms = {
            'top': 0,
            'left': 0,
            '-moz-transform': '',
            '-webkit-transform': '',
            '-o-transform': '',
            '-ms-transform': ''
        };
        if (x !== 0 || y !== 0) {
            var stdTranslate = ' translate(' + x + 'px, ' + y + 'px)';
            stransforms['-moz-transform'] += stdTranslate;
            stransforms['-webkit-transform'] += stdTranslate;
            stransforms['-o-transform'] += stdTranslate;
            stransforms['-ms-transform'] += stdTranslate;
        }
        if (degrees !== 0) {
            var stdRotate = ' rotate(' + degrees + 'deg)';
            stransforms['-moz-transform'] += stdRotate;
            stransforms['-webkit-transform'] += stdRotate;
            stransforms['-o-transform'] += stdRotate;
            stransforms['-ms-transform'] += stdRotate;
        }

        return stransforms;
    };

    AxisLabel.prototype.transformOrigin = function() {
        return {
            'transform-origin': Math.round(this.labelWidth / 2) + 'px ' + Math.round(this.labelHeight / 2) + 'px'
        };
    };

    AxisLabel.prototype.calculateOffsets = function(box) {
        var offsets = {
            x: 0,
            y: 0,
            degrees: 0
        };
        if (this.position === 'bottom') {
            offsets.x = box.left + box.width / 2 - this.labelWidth / 2;
            offsets.y = box.top + box.height - this.labelHeight;
        } else if (this.position === 'top') {
            offsets.x = box.left + box.width / 2 - this.labelWidth / 2;
            offsets.y = box.top;
        } else if (this.position === 'left') {
            offsets.degrees = -90;
            offsets.x = box.left - this.labelWidth / 2 + this.labelHeight / 2;
            offsets.y = box.height / 2 + box.top;
        } else if (this.position === 'right') {
            offsets.degrees = 90;
            offsets.x = box.left + box.width - this.labelWidth / 2 - this.labelHeight / 2;
            offsets.y = box.height / 2 + box.top;
        }
        offsets.x = Math.round(offsets.x);
        offsets.y = Math.round(offsets.y);

        return offsets;
    };

    AxisLabel.prototype.cleanup = function() {
        if (this.elem) {
            this.elem.remove();
            this.elem = null;
        }
    };

    AxisLabel.prototype.draw = function(box) {
        var classNameId = this.axisName + 'Label',
            div = document.createElement('div'),
            offsets = this.calculateOffsets(box),
            style = $.extend(
                { position: 'absolute' },
                this.transforms(offsets.degrees, offsets.x, offsets.y),
                this.transformOrigin());
        div.className = 'axisLabels ' + classNameId;
        Object.keys(style).forEach(function(key) {
            div.style[key] = style[key];
        });
        div.textContent = this.axisLabel;
        this.placeholder.appendChild(div);
        this.elem = div;
    };

    function init(plot) {
        plot.hooks.processOptions.push(function(plot, options) {
            if (!options.axisLabels.show) {
                return;
            }

            var axisLabels = {};
            var defaultPadding = 2; // padding between axis and tick labels

            plot.hooks.axisReserveSpace.push(function(plot, axis) {
                var opts = axis.options;
                var axisName = axis.direction + axis.n;

                if (!opts || !opts.axisLabel || !axis.show) {
                    return;
                }

                var padding = opts.axisLabelPadding === undefined
                    ? defaultPadding
                    : opts.axisLabelPadding;

                var axisLabel = axisLabels[axisName];
                if (axisLabel) {
                    axisLabel.cleanup();
                }
                axisLabel = new AxisLabel(axisName,
                    opts.position, padding,
                    plot.getPlaceholder()[0], opts.axisLabel);
                axisLabels[axisName] = axisLabel;

                axisLabel.calculateSize();

                // Incrementing the sizes of the tick labels.
                axis.labelHeight += axisLabel.height;
                axis.labelWidth += axisLabel.width;
            });

            // TODO - use the drawAxis hook
            plot.hooks.draw.push(function(plot, ctx) {
                $.each(plot.getAxes(), function(flotAxisName, axis) {
                    var opts = axis.options;
                    if (!opts || !opts.axisLabel || !axis.show) {
                        return;
                    }

                    var axisName = axis.direction + axis.n;
                    axisLabels[axisName].draw(axis.box);
                });
            });

            plot.hooks.shutdown.push(function(plot, eventHolder) {
                for (var axisName in axisLabels) {
                    axisLabels[axisName].cleanup();
                }
            });
        });
    };

    $.plot.plugins.push({
        init: init,
        options: options,
        name: 'axisLabels',
        version: '3.0'
    });
})(jQuery);

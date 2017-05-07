/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($)
{

    /*
    *   RadialGauge's functionality
    */
    var radialGauge = {

        defineInstance: function ()
        {
            var settings = {
                width: 350,
                height: 350,
                radius: '50%',
                endAngle: 270,
                startAngle: 30,
                int64: false,
                editableLabels: false,
                value: 0,
                min: 0,
                max: 220,
                disabled: false,
                ticksDistance: '20%',
                colorScheme: 'scheme01',
                animationDuration: 400,
                showRanges: true,
                easing: 'easeOutCubic',
                labels: null,
                pointer: null,
                cap: null,
                caption: null,
                border: null,
                ticksMinor: null,
                ticksMajor: null,
                tickMode: 'default', // possible values: 'default', 'tickNumber'
                niceInterval: false,
                style: null,
                ranges: [],
                _radius: 100,
                _border: null,
                _radiusDifference: 2,
                _pointer: null,
                _labels: [],
                _cap: null,
                _ticks: [],
                _ranges: [],
                _gauge: null,
                _caption: null,
                _animationTimeout: 10,
                renderer: null,
                _animations: [],
                aria:
                {
                    "aria-valuenow": { name: "value", type: "number" },
                    "aria-valuemin": { name: "min", type: "number" },
                    "aria-valuemax": { name: "max", type: "number" },
                    "aria-disabled": { name: "disabled", type: "boolean" }
                }
            };

            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function (args)
        {
            var self = this;
            self.that = this;
            $.jqx.aria(self);
            self._radius = self.radius;
            self.endAngle = self.endAngle * Math.PI / 180 + Math.PI / 2;
            self.startAngle = self.startAngle * Math.PI / 180 + Math.PI / 2;

            if (self.int64 === 's')
            {
                if (!$.jqx.longInt)
                {
                    throw new Error('jqxGauge: Missing reference to jqxmath.js');
                }

                // enables 64-bit number support
                $.jqx.longInt(self);

                self._value64 = new $.jqx.math().fromString(self.value.toString(), 10);
                self._min64 = new $.jqx.math().fromString(self.min.toString(), 10);
                self._max64 = new $.jqx.math().fromString(self.max.toString(), 10);
            } else if (self.int64 === 'u')
            {
                try
                {
                    BigNumber;
                }
                catch (err)
                {
                    throw new Error('jqxGauge: Missing reference to jqxmath.js');
                }

                self._value64 = new BigNumber(self.value);
                self._min64 = new BigNumber(self.min);
                self._max64 = new BigNumber(self.max);
            } else
            {
                self.value = new Number(self.value);
            }

            self._refresh();
            self.renderer.getContainer().css('overflow', 'hidden');

            if (self.int64 !== false)
            {
                self.setValue(self._value64, 0);
            } else
            {
                self.setValue(self.value, 0);
            }

            $.jqx.utilities.resize(self.host, function ()
            {
                self._refresh(true);
            });

            self.host.addClass(self.toThemeProperty('jqx-widget'));
        },

        _validateEasing: function ()
        {
            return !!$.easing[this.easing];
        },

        _validateProperties: function ()
        {
            if (this.startAngle === this.endAngle)
            {
                throw new Error('The end angle can not be equal to the start angle!');
            }
            if (!this._validateEasing())
            {
                this.easing = 'linear';
            }
            this.ticksDistance = this._validatePercentage(this.ticksDistance, '20%');
            this.border = this._borderConstructor(this.border, this);
            this.style = this.style || { fill: '#ffffff', stroke: '#E0E0E0' };
            this.ticksMinor = new this._tickConstructor(this.ticksMinor, this);
            this.ticksMajor = new this._tickConstructor(this.ticksMajor, this);
            this.cap = new this._capConstructor(this.cap, this);
            this.pointer = new this._pointerConstructor(this.pointer, this);
            this.labels = new this._labelsConstructor(this.labels, this);
            this.caption = new this._captionConstructor(this.caption, this);
            for (var i = 0; i < this.ranges.length; i += 1)
            {
                this.ranges[i] = new this._rangeConstructor(this.ranges[i], this);
            }
        },

        _hostInit: function (sizeChange)
        {
            var width = this._getScale(this.width, 'width', this.host.parent()),
                height = this._getScale(this.height, 'height', this.host.parent()),
                border = this._outerBorderOffset(),
                host = this.host,
                childSize;
            host.width(width);
            host.height(height);
            this.radius = childSize = 0;
            var s1 = (this._getScale(this._radius, 'width', this.host) || width / 2) - border;
            var s2 = (this._getScale(this._radius, 'height', this.host) || height / 2) - border;
            this.radius = childSize = Math.min(s1, s2);

            this._originalRadius = parseInt(this.radius, 10) - this._radiusDifference;
            this._innerRadius = this._originalRadius;
            if (this.border)
            {
                this._innerRadius -= this._getSize(this.border.size);
            }
            if (!sizeChange)
            {
                host[0].innerHTML = '<div />';
            }
            this._gaugeParent = host.children();
            this._gaugeParent.width(width);
            this._gaugeParent.height(height);
            if (!sizeChange)
            {
                this.renderer.init(this._gaugeParent);
            }
            else
            {
                var chartContainer = this.renderer.getContainer();
                chartContainer[0].style.width = width + 'px';
                chartContainer[0].style.height = height + 'px';
            }
        },

        _initRenderer: function (host)
        {
            if (!$.jqx.createRenderer)
                throw 'Please include a reference to jqxdraw.js';

            return $.jqx.createRenderer(this, host);
        },

        _refresh: function (sizeChange)
        {
            //    sizeChange = false;

            var self = this;
            if (sizeChange)
            {
                self._ticksIterator = 0;
                self._labelsIterator = 0;
                if (self._ranges)
                    $(self._ranges).remove();
                if (self._pointer)
                    $(self._pointer).remove();
                self._pointer = null;

                self._ranges = [];

                if (self.niceInterval)
                {
                    if (self._labels)
                        $(self._labels).remove();
                    self._labels = [];
                    if (self._ticks)
                    {
                        $(self._ticks).remove();
                        self._ticks = [];
                    }
                }

                self._hostInit(sizeChange);
                self._render(sizeChange);
                return;
            }

            if (!self.renderer)
            {
                self._isVML = false;
                self.host.empty();
                self._initRenderer(self.host);
            }

            var renderer = self.renderer;
            if (!renderer)
                return;

            if (self._ranges)
                $(self._ranges).remove();
            if (self._pointer)
                $(self._pointer).remove();
            if (self._labels)
                $(self._labels).remove();
            if (self._cap)
                $(self._cap).remove();
            if (self._ticks)
                $(self._ticks).remove();
            if (self._border)
                $(self._border).remove();
            if (self._caption)
                $(self._caption).remove();

            self._caption = null;
            self._labels = [];
            self._cap = null;
            self._ticks = [];
            self._ranges = [];
            self._border = null;
            self._pointer = null;
            self._validateProperties();
            self._removeElements();
            self._hostInit();
            self._render();
            self.setValue(this.value, 0);

            self._editableLabels();
        },

        val: function (value)
        {
            if (arguments.length == 0 || typeof (value) == "object")
            {
                return this.value;
            }
            this.setValue(value, 0);
        },

        refresh: function (initialRefresh)
        {
            if (initialRefresh === true)
                return;

            this._refresh.apply(this, Array.prototype.slice(arguments));
        },

        _outerBorderOffset: function ()
        {
            var borderStroke = parseInt(this.border.style['stroke-width'], 10) || 1;
            return borderStroke / 2;
        },

        _removeCollection: function (collection)
        {
            for (var i = 0; i < collection.length; i += 1)
            {
                $(collection[i]).remove();
            }
            collection = [];
        },

        _render: function (sizeChange)
        {
            this._addBorder(sizeChange);
            this._addGauge(sizeChange);
            this._addRanges(sizeChange);
            if (!this.niceInterval)
            {
                this._addTicks(sizeChange);
                this._addLabels(sizeChange);
            }
            else
            {
                this._addTicks();
            }

            this._styleLabels();
            this._addCaption(sizeChange);
            this._addPointer(sizeChange);
            this._addCap(sizeChange);
        },

        _addBorder: function (sizeChange)
        {
            if (!this.border.visible)
            {
                return;
            }

            if (sizeChange)
            {
                var borderSize = this._outerBorderOffset();
                this._border.setAttribute('cx', this._originalRadius + borderSize);
                this._border.setAttribute('cy', this._originalRadius + borderSize);
                this._border.setAttribute('r', this._originalRadius);

                return;
            }

            var color = this.border.style.fill,
                borderSize = this._outerBorderOffset();
            if (!color)
            {
                color = '#BABABA';
            }
            if (this.border.showGradient)
            {
                if (color.indexOf('url') < 0 && color.indexOf('#grd') < 0)
                {
                    this._originalColor = color;
                } else
                {
                    color = this._originalColor;
                }
                color = this.renderer._toLinearGradient(color, true, [[0, 1], [25, 1.1], [50, 1.5], [100, 1]]);
            }
            this._border = this.renderer.circle(this._originalRadius + borderSize, this._originalRadius + borderSize, this._originalRadius);
            this.border.style.fill = color;
            this.renderer.attr(this._border, this.border.style);
        },

        _addGauge: function (sizeChange)
        {
            var r = this._originalRadius,
                url = this.renderer._toLinearGradient('#ffffff', [[3, 2], [100, 1]], true),
                borderSize = this._outerBorderOffset();
            if (sizeChange)
            {
                this._gauge.setAttribute('cx', r + borderSize);
                this._gauge.setAttribute('cy', r + borderSize);
                this._gauge.setAttribute('r', this._innerRadius);
            }
            else
            {
                this._gauge = this.renderer.circle(r + borderSize, r + borderSize, this._innerRadius);
                this.renderer.attr(this._gauge, this.style);
            }
        },

        _addCap: function (sizeChange)
        {
            var visibility = 'visible',
                borderSize = this._outerBorderOffset();
            if (!this.cap.visible)
            {
                visibility = 'hidden';
            }
            var r = this._originalRadius,
                size = this._getSize(this.cap.size),
                circle;
            if (sizeChange)
            {
                this._cap.setAttribute("cx", r + borderSize);
                this._cap.setAttribute("cy", r + borderSize);
                this._cap.setAttribute("r", size);
                this._capCenter = [r, r];
            }
            else
            {
                circle = this.renderer.circle(r + borderSize, r + borderSize, size);
                this._capCenter = [r, r];
                this.renderer.attr(circle, this.cap.style);
                $(circle).css('visibility', visibility);
                this._cap = circle;
            }
        },

        _addTicks: function (sizeChange)
        {
            var self = this;

            var ticksMinor = this.ticksMinor,
                ticksMajor = this.ticksMajor,
                minorStep,
                majorStep,
                oldVals = {};

            if (ticksMajor.visible === false && ticksMinor.visible === false && this.labels.visible === false)
            {
                return;
            }

            function drawMajor(j)
            {
                if (ticksMajor.visible)
                {
                    self._drawTick({
                        angle: self._getAngleByValue(j),
                        distance: self._getDistance(self.ticksDistance),
                        style: ticksMajor.style,
                        size: self._getSize(ticksMajor.size),
                        type: 'major'
                    }, sizeChange);
                }
            }

            function drawMinor(i)
            {
                if (ticksMinor.visible)
                {
                    self._drawTick({
                        angle: self._getAngleByValue(i),
                        distance: self._getDistance(self.ticksDistance),
                        style: ticksMinor.style,
                        size: self._getSize(ticksMinor.size),
                        type: 'minor'
                    }, sizeChange);
                }
            }

            function addLabel(currentLabel)
            {
                if (self.labels.visible)
                {
                    self._addLabel({
                        angle: self._getAngleByValue(currentLabel),
                        value: majorStep >= 1 ? currentLabel : new Number(currentLabel).toFixed(2),
                        distance: self._getDistance(self._getLabelsDistance()),
                        style: self.labels.className
                    }, sizeChange);
                }
            }

            var numberOfIterations = 0;

            if (self.int64 === 's')
            {
                if (this.tickMode === 'default')
                {
                    if (this.niceInterval)
                    {
                        majorStep = this._getNiceInterval('radial');
                        minorStep = this._getNiceInterval('radial', true);
                    } else
                    {
                        majorStep = new $.jqx.math().fromString((ticksMajor.interval).toString(), 10);
                        minorStep = new $.jqx.math().fromString((ticksMinor.interval).toString(), 10);
                    }
                } else
                {
                    startToEnd = this._max64.subtract(this._min64);
                    minorStep = startToEnd.div(new $.jqx.math().fromString((ticksMinor.number).toString(), 10));
                    majorStep = startToEnd.div(new $.jqx.math().fromString((ticksMajor.number).toString(), 10));
                }

                if (this.niceInterval)
                {
                    drawMajor(this._min64);
                    addLabel(this._min64);
                    var second = this._min64.subtract(this._min64.modulo(majorStep)).add(majorStep),
                        firstMinTick;
                    for (var a = second; a.greaterThanOrEqual(this._min64) ; a = a.subtract(minorStep))
                    {
                        firstMinTick = a;
                    }
                    for (var i = firstMinTick, j = second; i.lessThan(this._max64) || j.lessThan(this._max64) ; i = i.add(minorStep), j = j.add(majorStep))
                    {
                        numberOfIterations += 1;
                        if (numberOfIterations > 250)
                        {
                            break;
                        }
                        if (j.lessThanOrEqual(this._max64))
                        {
                            drawMajor(j);
                            oldVals[j.toString()] = true;
                            if (i.equals(second))
                            {
                                // second tick
                                if (Math.abs(this._getAngleByValue(j) - this._getAngleByValue(this.min)) * this._innerRadius > this._getMaxLabelSize()['height'])
                                {
                                    addLabel(j);
                                }
                            } else if ((j.add(majorStep)).lessThan(this._max64))
                            {
                                addLabel(j);
                            } else
                            {
                                // second-to-last tick
                                if (Math.abs(this._getAngleByValue(j) - this._getAngleByValue(this.max)) * this._innerRadius > this._getMaxLabelSize()['height'])
                                {
                                    addLabel(j);
                                }
                            }
                        }
                        if (!oldVals[i.toString()] && i.lessThanOrEqual(self._max64))
                        {
                            drawMinor(i);
                        }
                        if (self._checkForOverflow(i, minorStep) || self._checkForOverflow(j, majorStep))
                        {
                            break;
                        }
                    }
                    drawMajor(this._max64);
                    addLabel(this._max64);
                } else
                {
                    for (var i = new $.jqx.math().fromString((self.min).toString(), 10), j = new $.jqx.math().fromString((self.min).toString(), 10) ; i.lessThanOrEqual(self._max64) || j.lessThanOrEqual(self._max64) ; i = i.add(minorStep), j = j.add(majorStep))
                    {
                        numberOfIterations += 1;
                        if (numberOfIterations > 250)
                        {
                            break;
                        }
                        if (j.lessThanOrEqual(self._max64) && ticksMajor.visible)
                        {
                            drawMajor(j);
                            oldVals[j.toString()] = true;
                        }
                        if (!oldVals[i.toString()] && ticksMinor.visible && i.lessThanOrEqual(self._max64))
                        {
                            drawMinor(i);
                        }
                    }
                }
            } else if (self.int64 === 'u')
            {
                if (this.tickMode === 'default')
                {
                    if (this.niceInterval)
                    {
                        majorStep = this._getNiceInterval('radial');
                        minorStep = this._getNiceInterval('radial', true);
                    } else
                    {
                        majorStep = new BigNumber(ticksMajor.interval);
                        minorStep = new BigNumber(ticksMinor.interval);
                    }
                } else
                {
                    startToEnd = this._max64.subtract(this._min64);
                    minorStep = startToEnd.divide(new BigNumber(ticksMinor.number));
                    majorStep = startToEnd.divide(new BigNumber(ticksMajor.number));
                }

                if (this.niceInterval)
                {
                    drawMajor(this._min64);
                    addLabel(this._min64);
                    var second = this._min64.subtract(this._min64.mod(majorStep)).add(majorStep),
                        firstMinTick;
                    for (var a = second; a.compare(this._min64) !== -1; a = a.subtract(minorStep))
                    {
                        firstMinTick = a;
                    }
                    for (var i = firstMinTick, j = second; i.compare(this._max64) === -1 || j.compare(this._max64) === -1; i = i.add(minorStep), j = j.add(majorStep))
                    {
                        numberOfIterations += 1;
                        if (numberOfIterations > 250)
                        {
                            break;
                        }
                        if (j.compare(this._max64) !== 1)
                        {
                            drawMajor(j);
                            oldVals[j.toString()] = true;
                            if (i.compare(second) === 0)
                            {
                                // second tick
                                if (Math.abs(this._getAngleByValue(j) - this._getAngleByValue(this.min)) * this._innerRadius > this._getMaxLabelSize()['height'])
                                {
                                    addLabel(j);
                                }
                            } else if ((j.add(majorStep)).compare(this._max64) === -1)
                            {
                                addLabel(j);
                            } else
                            {
                                // second-to-last tick
                                if (Math.abs(this._getAngleByValue(j) - this._getAngleByValue(this.max)) * this._innerRadius > this._getMaxLabelSize()['height'])
                                {
                                    addLabel(j);
                                }
                            }
                        }
                        if (!oldVals[i.toString()] && (i.compare(self._max64) !== 1))
                        {
                            drawMinor(i);
                        }
                    }
                    drawMajor(this._max64);
                    addLabel(this._max64);
                } else
                {
                    for (var i = new BigNumber(self.min), j = new BigNumber(self.min) ; (i.compare(self._max64) !== 1) || (j.compare(self._max64) !== 1) ; i = i.add(minorStep), j = j.add(majorStep))
                    {
                        numberOfIterations += 1;
                        if (numberOfIterations > 250)
                        {
                            break;
                        }
                        if ((j.compare(self._max64) !== 1) && ticksMajor.visible)
                        {
                            drawMajor(j);
                            oldVals[j.toString()] = true;
                        }
                        if (!oldVals[i.toString()] && ticksMinor.visible && (i.compare(self._max64) !== 1))
                        {
                            drawMinor(i);
                        }
                    }
                }
            } else
            {
                if (this.tickMode === 'default')
                {
                    if (this.niceInterval)
                    {
                        majorStep = this._getNiceInterval('radial');
                        minorStep = this._getNiceInterval('radial', true);
                    } else
                    {
                        majorStep = ticksMajor.interval;
                        minorStep = ticksMinor.interval;
                    }
                } else
                {
                    startToEnd = this.max - this.min;
                    minorStep = startToEnd / ticksMinor.number;
                    majorStep = startToEnd / ticksMajor.number
                }

                if (this.niceInterval)
                {
                    drawMajor(this.min);
                    addLabel(this.min);
                    var second = this.min - (this.min % majorStep) + majorStep,
                        firstMinTick;
                    for (var a = second; a >= this.min; a = a - minorStep)
                    {
                        firstMinTick = a;
                    }
                    for (var i = firstMinTick, j = second; i < this.max || j < this.max; i += minorStep, j += majorStep)
                    {
                        numberOfIterations += 1;
                        if (numberOfIterations > 250)
                        {
                            break;
                        }
                        if (j <= this.max)
                        {
                            drawMajor(j);
                            oldVals[j.toFixed(5)] = true;
                            if (i === second)
                            {
                                // second tick
                                if (Math.abs(this._getAngleByValue(j) - this._getAngleByValue(this.min)) * this._innerRadius > this._getMaxLabelSize()['height'])
                                {
                                    addLabel(j);
                                }
                            } else if (j + majorStep < this.max)
                            {
                                addLabel(j);
                            } else
                            {
                                // second-to-last tick
                                if (Math.abs(this._getAngleByValue(j) - this._getAngleByValue(this.max)) * this._innerRadius > this._getMaxLabelSize()['height'])
                                {
                                    addLabel(j);
                                }
                            }
                        }
                        if (!oldVals[i.toFixed(5)] && i <= this.max)
                        {
                            drawMinor(i);
                        }
                    }
                    drawMajor(this.max);
                    addLabel(this.max);
                } else
                {
                    for (var i = this.min, j = this.min; i <= this.max || j <= this.max; i += minorStep, j += majorStep)
                    {
                        numberOfIterations += 1;
                        if (numberOfIterations > 250)
                        {
                            break;
                        }
                        if (j <= this.max && ticksMajor.visible)
                        {
                            drawMajor(j);
                            oldVals[j.toFixed(5)] = true;
                        }
                        if (!oldVals[i.toFixed(5)] && ticksMinor.visible && i <= this.max)
                        {
                            drawMinor(i);
                        }
                    }
                }
            }
            this._handleTicksVisibility();
        },

        _handleTicksVisibility: function ()
        {
            if (!this.ticksMinor.visible)
            {
                this.host.children('.jqx-gauge-tick-minor').css('visibility', 'hidden');
            } else
            {
                this.host.children('.jqx-gauge-tick-minor').css('visibility', 'visible');
            }
            if (!this.ticksMajor.visible)
            {
                this.host.children('.jqx-gauge-tick-major').css('visibility', 'hidden');
            } else
            {
                this.host.children('.jqx-gauge-tick-major').css('visibility', 'visible');
            }
        },

        /*
        *   Calculates the size relatively to the inner gauge.
        *   _innerRadius is equal to the inner part of the gauge (without border).
        *   _originalRadius is the gauge + it's border.
        */
        _getSize: function (size)
        {
            if (size.toString().indexOf('%') >= 0)
            {
                size = (parseInt(size, 10) / 100) * this._innerRadius;
            }
            size = parseInt(size, 10);
            return size;
        },

        _getDistance: function (size)
        {
            return this._getSize(size) + (this._originalRadius - this._innerRadius);
        },

        _drawTick: function (options, sizeChange)
        {
            var that = this.that;
            var angle = options.angle,
                distance = options.distance,
                size = options.size,
                borderSize = that._outerBorderOffset(),
                r = that._originalRadius,
                width = r - distance,
                innerWidth = width - size,
                x1 = r + borderSize + width * Math.sin(angle),
                y1 = r + borderSize + width * Math.cos(angle),
                x2 = r + borderSize + innerWidth * Math.sin(angle),
                y2 = r + borderSize + innerWidth * Math.cos(angle),
                line;
            options.style['class'] = that.toThemeProperty('jqx-gauge-tick-' + options.type);
            if (that._isVML)
            {
                x1 = Math.round(x1);
                x2 = Math.round(x2);
                y1 = Math.round(y1);
                y2 = Math.round(y2);
            }
            if (sizeChange && !that.niceInterval)
            {
                var line = that._ticks[that._ticksIterator];
                line.setAttribute('x1', x1);
                line.setAttribute('x2', x2);
                line.setAttribute('y1', y1);
                line.setAttribute('y2', y2);
                that._ticksIterator++;
            }
            else
            {
                line = that.renderer.line(x1, y1, x2, y2, options.style);
                that._ticks.push(line);
            }
        },

        _addRanges: function (sizeChange)
        {
            var visibility = 'visible';
            if (!this.showRanges)
            {
                visibility = 'hidden';
            } else
            {
                var ranges = this.ranges;
                for (var i = 0; i < ranges.length; i += 1)
                {
                    this._addRange(ranges[i], visibility, sizeChange);
                }
            }
        },

        _getMaxRangeSize: function ()
        {
            var range, size = -1, start, end;
            for (var i = 0; i < this.ranges.length; i += 1)
            {
                start = this.ranges[i].startWidth;
                end = this.ranges[i].endWidth;
                if (start > size)
                {
                    size = start;
                }
                if (end > size)
                {
                    size = end;
                }
            }
            return size;
        },

        _getRangeDistance: function (distance, width)
        {
            var labelsPosition = this._getLabelsDistance(),
                rangeDistance = this._getDistance(distance),
                maxRangeSize = this._getMaxRangeSize();
            if (this.labels.position === 'outside')
            {
                if (labelsPosition < rangeDistance + this._getMaxTickSize())
                {
                    return this._getDistance(this.ticksDistance) + maxRangeSize / 2 + this._getSize(this.ticksMajor.size);
                }
            } else if (this.labels.position === 'inside')
            {
                if (labelsPosition + this._getMaxTickSize() < rangeDistance)
                {
                    return this._getSize(this.border.size) + this._originalRadius / 20;
                }
            }
            return rangeDistance;
        },

        _addRange: function (range, visibility, sizeChange)
        {
            var that = this.that;

            if ((that.int64 === 's' && (range._startValue64.lessThan(that._min64) || range._endValue64.greaterThan(that._max64))) ||
                   (that.int64 === 'u' && ((range._startValue64.compare(that._min64) === -1) || (range._endValue64.compare(that._max64) === 1))) ||
                   (that.int64 === false && (range.startValue < that.min || range.endValue > that.max)))
            {
                return;
            }
            var startAngle = that.int64 ? that._getAngleByValue(range._startValue64) : that._getAngleByValue(range.startValue),
                endAngle = that.int64 ? that._getAngleByValue(range._endValue64) : that._getAngleByValue(range.endValue);

            var radius = that._originalRadius,
                startDistance = radius - that._getRangeDistance(range.startDistance, range.startWidth),
                endDistance = radius - that._getRangeDistance(range.endDistance, range.endWidth),
                startWidth = range.startWidth,
                endWidth = range.endWidth,
                borderSize = that._outerBorderOffset(),
                startPoint = {
                    x: radius + borderSize + startDistance * Math.sin(startAngle),
                    y: radius + borderSize + startDistance * Math.cos(startAngle)
                },
                endPoint = {
                    x: radius + borderSize + endDistance * Math.sin(endAngle),
                    y: radius + borderSize + endDistance * Math.cos(endAngle)
                },
                startProjectionPoint = that._getProjectionPoint(startAngle, radius + borderSize, startDistance, startWidth),
                endProjectionPoint = that._getProjectionPoint(endAngle, radius + borderSize, endDistance, endWidth),
                orientation = 'default',
                path, range;
            if (Math.abs(endAngle - startAngle) > Math.PI)
            {
                orientation = 'opposite';
            }
            if (that._isVML)
            {
                path = that._rangeVMLRender(startPoint, endPoint, radius, startProjectionPoint, endProjectionPoint, endWidth, startWidth, startDistance, endDistance, orientation);
            } else
            {
                path = that._rangeSVGRender(startPoint, endPoint, radius, startProjectionPoint, endProjectionPoint, endWidth, startWidth, startDistance, endDistance, orientation);
            }
            range.style.visibility = visibility;
            range.style['class'] = that.toThemeProperty('jqx-gauge-range');
            range = that.renderer.path(path, range.style);
            that._ranges.push(range);
        },

        _rangeSVGRender: function (startPoint, endPoint, radius, startProjectionPoint, endProjectionPoint, endWidth, startWidth, startDistance, endDistance, orientation)
        {
            var path = '',
                startDistance = radius - startDistance,
                endDistance = radius - endDistance,
                circle = ['0,1', '0,0'];
            if (orientation === 'opposite')
            {
                circle = ['1,1', '1,0'];
            }
            path = 'M' + startPoint.x + ',' + startPoint.y + ' ';
            path += 'A' + (radius - startDistance) + ',' + (radius - startDistance) + ' 100 ' + circle[0] + ' ' + endPoint.x + ',' + endPoint.y + ' ';
            path += 'L ' + (endProjectionPoint.x) + ',' + (endProjectionPoint.y) + ' ';
            path += 'A' + (radius - endWidth - startDistance) + ',' + (radius - endWidth - startDistance) + ' 100 ' + circle[1] + ' ' + (startProjectionPoint.x) + ',' + (startProjectionPoint.y) + ' ';
            path += 'L ' + (startPoint.x) + ',' + (startPoint.y) + ' ';
            path += 'z';
            return path;
        },

        _rangeVMLRender: function (startPoint, endPoint, radius, startProjectionPoint, endProjectionPoint, endWidth, startWidth, startDistance, endDistance, orientation)
        {
            radius -= radius - startDistance + 10;
            var path = '',
                outerRadius = Math.floor(radius + (startWidth + endWidth) / 2),
                startDistance = Math.floor(radius - startDistance),
                endDistance = Math.floor(endDistance),
                middleProjection = {
                    x: (startProjectionPoint.x + endProjectionPoint.x) / 2,
                    y: (startProjectionPoint.y + endProjectionPoint.y) / 2
                },
                projDistance = Math.sqrt((endProjectionPoint.x - startProjectionPoint.x) * (endProjectionPoint.x - startProjectionPoint.x) + (endProjectionPoint.y - startProjectionPoint.y) * (endProjectionPoint.y - startProjectionPoint.y)),
                projCenterX = Math.floor(middleProjection.x + Math.sqrt(radius * radius - (projDistance / 2) * (projDistance / 2)) * (startProjectionPoint.y - endProjectionPoint.y) / projDistance),
                projCenterY = Math.floor(middleProjection.y + Math.sqrt(radius * radius - (projDistance / 2) * (projDistance / 2)) * (endProjectionPoint.x - startProjectionPoint.x) / projDistance),
                middle = {
                    x: (startPoint.x + endPoint.x) / 2,
                    y: (startPoint.y + endPoint.y) / 2
                },
                distance = Math.sqrt((endPoint.x - startPoint.x) * (endPoint.x - startPoint.x) + (endPoint.y - startPoint.y) * (endPoint.y - startPoint.y)),
                centerX = Math.floor(middle.x + Math.sqrt(Math.abs(outerRadius * outerRadius - (distance / 2) * (distance / 2))) * (startPoint.y - endPoint.y) / distance),
                centerY = Math.floor(middle.y + Math.sqrt(Math.abs(outerRadius * outerRadius - (distance / 2) * (distance / 2))) * (endPoint.x - startPoint.x) / distance);

            if (orientation === 'opposite')
            {
                projCenterX = Math.floor(middleProjection.x - Math.sqrt(radius * radius - (projDistance / 2) * (projDistance / 2)) * (startProjectionPoint.y - endProjectionPoint.y) / projDistance);
                projCenterY = Math.floor(middleProjection.y - Math.sqrt(radius * radius - (projDistance / 2) * (projDistance / 2)) * (endProjectionPoint.x - startProjectionPoint.x) / projDistance);

                centerX = Math.floor(middle.x - Math.sqrt(Math.abs(outerRadius * outerRadius - (distance / 2) * (distance / 2))) * (startPoint.y - endPoint.y) / distance);
                centerY = Math.floor(middle.y - Math.sqrt(Math.abs(outerRadius * outerRadius - (distance / 2) * (distance / 2))) * (endPoint.x - startPoint.x) / distance);
            }
            radius = Math.floor(radius);
            endPoint = { x: Math.floor(endPoint.x), y: Math.floor(endPoint.y) };
            startPoint = { x: Math.floor(startPoint.x), y: Math.floor(startPoint.y) };
            startProjectionPoint = { x: Math.floor(startProjectionPoint.x), y: Math.floor(startProjectionPoint.y) };
            endProjectionPoint = { x: Math.floor(endProjectionPoint.x), y: Math.floor(endProjectionPoint.y) };

            path = 'm ' + endPoint.x + ',' + endPoint.y;
            path += 'at ' + (centerX - outerRadius) + ' ' + (centerY - outerRadius) + ' ' + (outerRadius + centerX) + ' ' + (outerRadius + centerY) + ' ' + endPoint.x + ',' + endPoint.y + ' ' + startPoint.x + ',' + startPoint.y;
            path += 'l ' + startProjectionPoint.x + ',' + startProjectionPoint.y;
            path += 'm ' + endPoint.x + ',' + endPoint.y;
            path += 'l ' + endProjectionPoint.x + ',' + endProjectionPoint.y;
            path += 'at ' + (projCenterX - radius) + ' ' + (projCenterY - radius) + ' ' + (radius + projCenterX) + ' ' + (radius + projCenterY) + ' ' + endProjectionPoint.x + ',' + endProjectionPoint.y + ' ' + startProjectionPoint.x + ',' + startProjectionPoint.y;
            path += 'qx ' + startProjectionPoint.x + ' ' + startProjectionPoint.y;
            return path;
        },

        _getProjectionPoint: function (angle, radius, ratio, displacement)
        {
            var point = { x: radius + (ratio - displacement) * Math.sin(angle), y: radius + (ratio - displacement) * Math.cos(angle) };
            return point;
        },

        _addLabels: function (sizeChange)
        {
            var self = this,
              interval = self._getLabelInterval();

            if (self.labels.visible && self.labels.interval.toString() !== '0')
            {
                var distance = this._getDistance(this._getLabelsDistance()),
                    value;
                var numberOfIterations = 0;

                if (self.int64 === 's')
                {
                    for (var currentLabel = new $.jqx.math().fromNumber(self.min.toString(), 10) ; currentLabel.lessThanOrEqual(self._max64) ; currentLabel = currentLabel.add(interval))
                    {
                        numberOfIterations += 1;
                        if (numberOfIterations > 250)
                        {
                            break;
                        }
                        if (currentLabel.lessThan(self._min64) || currentLabel.greaterThan(self._max64))
                        {
                            break;
                        }
                        this._addLabel({
                            angle: this._getAngleByValue(currentLabel),
                            value: currentLabel.toString(),
                            distance: distance,
                            style: this.labels.className
                        });
                    }
                } else if (self.int64 === 'u')
                {
                    for (var currentLabel = new BigNumber(self.min) ; currentLabel.compare(self._max64) !== 1; currentLabel = currentLabel.add(interval))
                    {
                        numberOfIterations += 1;
                        if (numberOfIterations > 250)
                        {
                            break;
                        }
                        if ((currentLabel.compare(self._min64) === -1) || (currentLabel.compare(self._max64) === 1))
                        {
                            break;
                        }
                        this._addLabel({
                            angle: this._getAngleByValue(currentLabel),
                            value: currentLabel.toString(),
                            distance: distance,
                            style: this.labels.className
                        });
                    }
                } else
                {
                    for (var currentLabel = this.min; currentLabel <= this.max; currentLabel += interval)
                    {
                        numberOfIterations += 1;
                        if (numberOfIterations > 250)
                        {
                            break;
                        }
                        this._addLabel({
                            angle: this._getAngleByValue(currentLabel),
                            value: interval >= 1 ? currentLabel : new Number(currentLabel).toFixed(2),
                            distance: distance,
                            style: this.labels.className
                        }, sizeChange);
                    }
                }
            }
        },

        _getLabelsDistance: function ()
        {
            var maxSize = this._getMaxLabelSize(),
                labelsDistance = this._getDistance(this.labels.distance),
                ticksDistance = this._getDistance(this.ticksDistance);
            maxSize = maxSize.width;
            if (this.labels.position === 'inside')
            {
                return ticksDistance + maxSize - 5;
            } else if (this.labels.position === 'outside')
            {
                if (labelsDistance < (ticksDistance - maxSize * 1.5))
                {
                    return labelsDistance;
                }
                return Math.max(ticksDistance - maxSize * 1.5, 0.6 * maxSize);
            }
            return this.labels.distance;
        },

        _addLabel: function (options, sizeChange)
        {
            var that = this.that;
            var angle = options.angle,
                r = that._originalRadius,
                w = r - options.distance,
                offset = that.labels.offset,
                borderSize = that._outerBorderOffset(),
                x = r + borderSize + w * Math.sin(angle) + offset[0],
                y = r + borderSize + w * Math.cos(angle) + offset[1],
                value = options.value,
                className = options.style || '',
                textSize,
                label,
                fontSize = that.labels.fontSize;

            value = that._formatLabel(value.toString());
            var stylingObj = { 'class': className };
            if (fontSize)
            {
                stylingObj['font-size'] = fontSize;
            }
            if (that.labels.fontFamily)
            {
                stylingObj['font-family'] = that.labels.fontFamily;
            }
            if (that.labels.fontWeight)
            {
                stylingObj['font-weight'] = that.labels.fontWeight;
            }
            if (that.labels.fontStyle)
            {
                stylingObj['font-style'] = that.labels.fontStyle;
            }
            if (sizeChange && !that.niceInterval)
            {
                var label = that._labels[that._labelsIterator];
                var sz = that.renderer._measureText(value, 0, stylingObj, true);
                var textPartsInfo = sz.textPartsInfo;
                var textParts = textPartsInfo.parts;
                var tw = textPartsInfo.width;
                var th = textPartsInfo.height;

                label.setAttribute("x", Math.round(x) - sz.width / 2 + (sz.width - textPartsInfo.width) / 2);
                label.setAttribute("y", Math.round(y) + th + (sz.height - th) / 2);
                that._labelsIterator++;
            }
            else
            {
                var textSize = that.renderer.measureText(value, 0, stylingObj);

                var xCorrection = 0;
                if (fontSize !== undefined && Math.PI > angle)
                {
                    xCorrection = (-textSize.width / 2) * (parseInt(fontSize) / 25);
                    if (parseInt(fontSize) <= 10)
                    {
                        xCorrection *= -1;
                    }
                }

                //            textSize = that.renderer.measureText(value, 0, { 'class': className });
                label = that.renderer.text(value, Math.round(x) - textSize.width / 2 + xCorrection, Math.round(y), textSize.width, textSize.height, 0, stylingObj);
                that._labels.push(label);
            }
        },

        _addCaption: function (sizeChange)
        {
            if (this.caption.visible !== false)
            {
                var that = this.that;
                var text = that.caption.value,
                className = that.toThemeProperty('jqx-gauge-caption'),
                offset = that.caption.offset,
                size = that.renderer.measureText(text, 0, { 'class': className }),
                position = that._getPosition(this.caption.position, size, offset),
                style = that.caption.style,
                border = that._outerBorderOffset();
                if (!sizeChange)
                {
                    var t = that.renderer.text(text, position.left + border, position.top + border, size.width, size.height, 0, { 'class': className });
                    this._caption = t;
                }
                else
                {
                    this._caption.setAttribute("x", position.left + border);
                    this._caption.setAttribute("y", position.top + border);
                }
            }
        },

        _getPosition: function (position, size, offset)
        {
            var left = 0,
                top = 0,
                r = this._originalRadius;
            switch (position)
            {
                case 'left':
                    left = (r - size.width) / 2;
                    top = r - size.height / 2;
                    break;
                case 'right':
                    left = r + (r - size.width) / 2;
                    top = r - size.height / 2;
                    break;
                case 'bottom':
                    left = (2 * r - size.width) / 2;
                    top = (r + 2 * r - size.height) / 2;
                    break;
                default:
                    left = (2 * r - size.width) / 2;
                    top = (r + size.height) / 2;
                    break;
            }
            return { left: left + offset[0], top: top + offset[1] };
        },

        _addPointer: function (sizeChange)
        {
            var visibility = 'visible';
            if (!this.pointer.visible)
            {
                visibility = 'hidden';
            }
            var radius = this._originalRadius,
                length = this._getSize(this.pointer.length),
                innerW = length * 0.9,
                angle = this._getAngleByValue(this.value),
                pointerType = this.pointer.pointerType,
                points;
            points = this._computePointerPoints(this._getSize(this.pointer.width), angle, length, pointerType !== 'default');
            this._pointer = this.renderer.path(points, this.pointer.style);
            $(this._pointer).css('visibility', visibility);
        },

        _computePointerPoints: function (pointerWidth, angle, pointerLength, rect)
        {
            if (!rect)
            {
                return this._computeArrowPoints(pointerWidth, angle, pointerLength);
            } else
            {
                return this._computeRectPoints(pointerWidth, angle, pointerLength);
            }
        },

        _computeArrowPoints: function (pointerWidth, angle, pointerLength)
        {
            var r = this._originalRadius - 0.5,
                sin = Math.sin(angle),
                cos = Math.cos(angle),
                borderSize = this._outerBorderOffset(),
                x = r + borderSize + pointerLength * sin,
                y = r + borderSize + pointerLength * cos,
                startX1 = r + borderSize + pointerWidth * cos,
                startY1 = r + borderSize - pointerWidth * sin,
                startX2 = r + borderSize - pointerWidth * cos,
                startY2 = r + borderSize + pointerWidth * sin,
                points;
            if (this._isVML)
            {
                startX1 = Math.round(startX1);
                startX2 = Math.round(startX2);
                startY1 = Math.round(startY1);
                startY2 = Math.round(startY2);
                x = Math.round(x);
                y = Math.round(y);
            }
            points = 'M ' + startX1 + ',' + startY1 + ' L ' + startX2 + ',' + startY2 + ' L ' + x + ',' + y + '';
            return points;
        },

        _computeRectPoints: function (pointerWidth, angle, pointerLength)
        {
            var r = this._originalRadius,
                sin = Math.sin(angle),
                cos = Math.cos(angle),
                arrowDistance = pointerLength,
                borderSize = this._outerBorderOffset(),
                endX1 = r + borderSize - pointerWidth * cos + pointerLength * sin,
                endY1 = r + borderSize + pointerWidth * sin + pointerLength * cos,
                endX2 = r + borderSize + pointerWidth * cos + pointerLength * sin,
                endY2 = r + borderSize - pointerWidth * sin + pointerLength * cos,
                startX1 = r + borderSize + pointerWidth * cos,
                startY1 = r + borderSize - pointerWidth * sin,
                startX2 = r + borderSize - pointerWidth * cos,
                startY2 = r + borderSize + pointerWidth * sin,
                points;
            if (this._isVML)
            {
                startX1 = Math.round(startX1);
                startX2 = Math.round(startX2);
                startY1 = Math.round(startY1);
                startY2 = Math.round(startY2);
                endX1 = Math.round(endX1);
                endY1 = Math.round(endY1);
                endX2 = Math.round(endX2);
                endY2 = Math.round(endY2);
            }
            points = 'M ' + startX1 + ',' + startY1 + ' L ' + startX2 + ',' + startY2 + ' L ' + endX1 + ',' + endY1 + ' ' + endX2 + ',' + endY2;
            return points;
        },

        _getAngleByValue: function (value)
        {
            var self = this,
                startAngle = self.startAngle,
                angleDifference = startAngle - self.endAngle,
                start,
                end,
                endStartDifference,
                valueStartDifference,
                angle;

            if (self.int64 !== false)
            {
                if (self.int64 === 's')
                {
                    value = new $.jqx.math().fromString(value.toString(), 10);
                } else
                {
                    value = new BigNumber(value);
                }

                start = self._min64;
                end = self._max64;
                endStartDifference = end.subtract(start);
                valueStartDifference = value.subtract(start);
                if (self.int64 === 'u')
                {
                    valueStartDifference = valueStartDifference.intPart();
                }

                var endStartString = endStartDifference.toString(),
                    endStartFloat,
                    valueStartString = valueStartDifference.toString(),
                    valueStartFloat;

                if (endStartString.length > 15)
                {
                    var floatOffset = endStartString.length - 15;
                    endStartString = endStartString.slice(0, 15) + '.' + endStartString.slice(15);
                    endStartFloat = parseFloat(endStartString);

                    if (valueStartString.length > floatOffset)
                    {
                        var valueStartOffset = valueStartString.length - floatOffset;
                        valueStartString = valueStartString.slice(0, valueStartOffset) + '.' + valueStartString.slice(valueStartOffset);
                    } else if (valueStartString.length === floatOffset)
                    {
                        valueStartString = '0.' + valueStartString;
                    } else
                    {
                        var prefix = '0.';
                        for (var i = 0; i < floatOffset - valueStartString.length; i++)
                        {
                            prefix += '0';
                        }
                        valueStartString = prefix + '' + valueStartString;
                    }
                    valueStartFloat = parseFloat(valueStartString);
                } else
                {
                    endStartFloat = parseFloat(endStartDifference.toString());
                    valueStartFloat = parseFloat(valueStartDifference.toString());
                }

                angle = angleDifference * valueStartFloat / endStartFloat + startAngle + Math.PI;
            } else
            {
                start = self.min;
                end = self.max;
                endStartDifference = end - start;
                valueStartDifference = value - start;
                angle = angleDifference * valueStartDifference / endStartDifference + startAngle + Math.PI;
            }

            return angle;
        },

        _setValue: function (value)
        {
            var self = this;

            if ((self.int64 === 's' && value.lessThanOrEqual(self._max64) && value.greaterThanOrEqual(self._min64)) ||
                (self.int64 === 'u' && value.compare(self._max64) !== 1 && value.compare(self._min64) !== -1) ||
                (self.int64 === false && value <= self.max && value >= self.min))
            {
                var angle = self._getAngleByValue(value),
                    pointerType = self.pointer.pointerType,
                    points = self._computePointerPoints(self._getSize(self.pointer.width), angle, self._getSize(self.pointer.length), pointerType !== 'default');
                if (self._isVML)
                {
                    if (self._pointer) $(self._pointer).remove();
                    self._pointer = self.renderer.path(points, self.pointer.style);
                } else
                {
                    self.renderer.attr(self._pointer, { d: points });
                }

                if (self.int64 !== false)
                {
                    self.value = value.toString();
                    if (self.int64 === 's')
                    {
                        self._value64 = new $.jqx.math().fromString(self.value, 10);
                    } else
                    {
                        self._value64 = new BigNumber(self.value);
                    }
                } else
                {
                    self.value = value;
                }
                $.jqx.aria(self, 'aria-valuenow', value.toString());
            }
        },


        resize: function (width, height)
        {
            this.width = width;
            this.height = height;
            this.refresh();
        },

        propertiesChangedHandler: function (object, key, value)
        {
            if (value.width && value.height && Object.keys(value).length == 2)
            {
                object._refresh(true);
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value)
        {
            if (value == oldvalue)
                return;


            if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length == 2)
            {
                return;
            }

            if (key == 'min')
            {
                if (object.int64 === true)
                {
                    object._min64 = new $.jqx.math().fromString(value.toString(), 10);
                } else
                {
                    this.min = parseInt(value);
                }
                $.jqx.aria(object, 'aria-valuemin', value);
            }
            if (key == 'max')
            {
                if (object.int64 === true)
                {
                    object._max64 = new $.jqx.math().fromString(value.toString(), 10);
                } else
                {
                    this.max = parseInt(value);
                }
                $.jqx.aria(object, 'aria-valuemax', value);
            }

            if (key === 'disabled')
            {
                if (value)
                {
                    this.disable();
                } else
                {
                    this.enable();
                }
                $.jqx.aria(this, 'aria-disabled', value);
            } else if (key === 'value')
            {
                this.value = oldvalue;
                this.setValue(value);
            } else
            {
                if (key === 'startAngle')
                {
                    this.startAngle = this.startAngle * Math.PI / 180 + Math.PI / 2;
                } else if (key === 'endAngle')
                {
                    this.endAngle = this.endAngle * Math.PI / 180 + Math.PI / 2;
                } else if (key === 'colorScheme')
                {
                    this.pointer.style = null;
                    this.cap.style = null;
                } else if (key === 'radius')
                {
                    this._radius = value;
                }
                if (key !== 'animationDuration' && key !== 'easing')
                {
                    this._refresh();
                }
            }
            if (this.renderer instanceof $.jqx.HTML5Renderer)
                this.renderer.refresh();
        },

        _tickConstructor: function (data, jqx)
        {
            if (this.host)
            {
                return new this._tickConstructor(data, jqx);
            }
            data = data || {};
            this.size = jqx._validatePercentage(data.size, '10%');

            function intervalOrNumber(that, property)
            {
                if (jqx.int64 === false)
                {
                    that[property] = parseFloat(data[property]);
                } else
                {
                    that[property] = data[property];
                }
                if (!that[property])
                {
                    that[property] = 5;
                }
            }

            intervalOrNumber(this, 'interval');
            intervalOrNumber(this, 'number');

            this.style = data.style || { stroke: '#898989', 'stroke-width': 1 };
            if (typeof data.visible === 'undefined')
            {
                this.visible = true;
            } else
            {
                this.visible = data.visible;
            }
        },

        _capConstructor: function (data, jqx)
        {
            var color = jqx._getColorScheme(jqx.colorScheme)[0];
            if (this.host)
            {
                return new this._capConstructor(data, jqx);
            }
            data = data || {};
            if (typeof data.visible === 'undefined')
            {
                this.visible = true;
            } else
            {
                this.visible = data.visible;
            }
            this.size = jqx._validatePercentage(data.size, '4%');
            this.style = data.style || { fill: color, 'stroke-width': '1px', stroke: color, 'z-index': 30 };
        },

        _pointerConstructor: function (data, jqx)
        {
            var color = jqx._getColorScheme(jqx.colorScheme)[0];
            if (this.host)
            {
                return new this._pointerConstructor(data, jqx);
            }
            data = data || {};
            if (typeof data.visible === 'undefined')
            {
                this.visible = true;
            } else
            {
                this.visible = data.visible;
            }
            this.pointerType = data.pointerType;
            if (this.pointerType !== 'default' && this.pointerType !== 'rectangle')
            {
                this.pointerType = 'default';
            }
            this.style = data.style || { 'z-index': 0, stroke: color, fill: color, 'stroke-width': 1 };
            this.length = jqx._validatePercentage(data.length, '70%');
            this.width = jqx._validatePercentage(data.width, '2%');
        },

        _labelsConstructor: function (data, jqx)
        {
            if (this.host)
            {
                return new this._labelsConstructor(data, jqx);
            }
            data = data || {};
            if (typeof data.visible === 'undefined')
            {
                this.visible = true;
            } else
            {
                this.visible = data.visible;
            }
            this.offset = data.offset;
            if (!(this.offset instanceof Array))
            {
                this.offset = [0, -10];
            }

            if (!data.interval)
            {
                data.interval = 20;
            }

            if (jqx.int64 !== false)
            {
                this.interval = data.interval;
                if (jqx.int64 === 's')
                {
                    this._interval64 = new $.jqx.math().fromString(data.interval.toString(), 10);
                } else
                {
                    this._interval64 = new BigNumber(data.interval);
                }
            } else
            {
                this.interval = parseFloat(data.interval);
            }
            if (!data.number)
            {
                data.number = 5;
            }
            this.number = data.number;

            this.distance = jqx._validatePercentage(data.distance, '38%');
            this.position = data.position;
            if (this.position !== 'inside' && this.position !== 'outside')
            {
                this.position = 'none';
            }
            this.formatValue = data.formatValue;
            this.formatSettings = data.formatSettings;
            this.fontSize = data.fontSize;
            this.fontFamily = data.fontFamily;
            this.fontWeight = data.fontWeight;
            this.fontStyle = data.fontStyle;
        },

        _captionConstructor: function (data, jqx)
        {
            if (this.host)
            {
                return new this._captionConstructor(data, jqx);
            }
            data = data || {};
            if (typeof data.visible === 'undefined')
            {
                this.visible = true;
            } else
            {
                this.visible = data.visible;
            }
            this.value = data.value || '';
            this.position = data.position;
            if (this.position !== 'bottom' && this.position !== 'top' &&
                this.position !== 'left' && this.position !== 'right')
            {
                this.position = 'bottom';
            }
            this.offset = data.offset;
            if (!(this.offset instanceof Array))
            {
                this.offset = [0, 0];
            }
        },

        _rangeConstructor: function (data, jqx)
        {
            if (this.host)
            {
                return new this._rangeConstructor(data, jqx);
            }
            data = data || {};
            this.startDistance = jqx._validatePercentage(data.startDistance, '5%');
            this.endDistance = jqx._validatePercentage(data.endDistance, '5%');
            this.style = data.style || { fill: '#000000', stroke: '#111111' };
            this.startWidth = parseFloat(data.startWidth, 10);
            if (!this.startWidth)
            {
                this.startWidth = 10;
            }
            this.startWidth = Math.max(this.startWidth, 2);
            this.endWidth = parseFloat(data.endWidth, 10);
            if (!this.endWidth)
            {
                this.endWidth = 10;
            }
            this.endWidth = Math.max(this.endWidth, 2);

            if (data.startValue === undefined)
            {
                data.startValue = 0;
            }

            if (data.endValue === undefined)
            {
                data.endValue = 100;
            }

            if (jqx.int64 !== false)
            {
                this.startValue = data.startValue;
                this.endValue = data.endValue;
                if (jqx.int64 === 's')
                {
                    this._startValue64 = new $.jqx.math().fromString(data.startValue.toString(), 10);
                    this._endValue64 = new $.jqx.math().fromString(data.endValue.toString(), 10);
                } else
                {
                    this._startValue64 = new BigNumber(data.startValue);
                    this._endValue64 = new BigNumber(data.endValue);
                }
            } else
            {
                this.startValue = parseFloat(data.startValue, 10);
                this.endValue = parseFloat(data.endValue, 10);
            }
        },

        _borderConstructor: function (data, jqx)
        {
            if (this.host)
            {
                return new this._borderConstructor(data, jqx);
            }
            data = data || {};
            this.size = jqx._validatePercentage(data.size, '10%');
            this.style = data.style || { stroke: '#cccccc' };
            if (typeof data.showGradient === 'undefined')
            {
                this.showGradient = true;
            } else
            {
                this.showGradient = data.showGradient;
            }
            if (typeof data.visible === 'undefined')
            {
                this.visible = true;
            } else
            {
                this.visible = data.visible;
            }
        }
    };

    // Common functions for linear and radial gauge
    var common = {

        _events: ['valueChanging', 'valueChanged'],
        _animationTimeout: 10,
        _schemes: [
            { name: 'scheme01', colors: ['#307DD7', '#AA4643', '#89A54E', '#71588F', '#4198AF'] },
            { name: 'scheme02', colors: ['#7FD13B', '#EA157A', '#FEB80A', '#00ADDC', '#738AC8'] },
            { name: 'scheme03', colors: ['#E8601A', '#FF9639', '#F5BD6A', '#599994', '#115D6E'] },
            { name: 'scheme04', colors: ['#D02841', '#FF7C41', '#FFC051', '#5B5F4D', '#364651'] },
            { name: 'scheme05', colors: ['#25A0DA', '#309B46', '#8EBC00', '#FF7515', '#FFAE00'] },
            { name: 'scheme06', colors: ['#0A3A4A', '#196674', '#33A6B2', '#9AC836', '#D0E64B'] },
            { name: 'scheme07', colors: ['#CC6B32', '#FFAB48', '#FFE7AD', '#A7C9AE', '#888A63'] },
            { name: 'scheme08', colors: ['#3F3943', '#01A2A6', '#29D9C2', '#BDF271', '#FFFFA6'] },
            { name: 'scheme09', colors: ['#1B2B32', '#37646F', '#A3ABAF', '#E1E7E8', '#B22E2F'] },
            { name: 'scheme10', colors: ['#5A4B53', '#9C3C58', '#DE2B5B', '#D86A41', '#D2A825'] },
            { name: 'scheme11', colors: ['#993144', '#FFA257', '#CCA56A', '#ADA072', '#949681'] },
            { name: 'scheme12', colors: ['#105B63', '#EEEAC5', '#FFD34E', '#DB9E36', '#BD4932'] },
            { name: 'scheme13', colors: ['#BBEBBC', '#F0EE94', '#F5C465', '#FA7642', '#FF1E54'] },
            { name: 'scheme14', colors: ['#60573E', '#F2EEAC', '#BFA575', '#A63841', '#BFB8A3'] },
            { name: 'scheme15', colors: ['#444546', '#FFBB6E', '#F28D00', '#D94F00', '#7F203B'] },
            { name: 'scheme16', colors: ['#583C39', '#674E49', '#948658', '#F0E99A', '#564E49'] },
            { name: 'scheme17', colors: ['#142D58', '#447F6E', '#E1B65B', '#C8782A', '#9E3E17'] },
            { name: 'scheme18', colors: ['#4D2B1F', '#635D61', '#7992A2', '#97BFD5', '#BFDCF5'] },
            { name: 'scheme19', colors: ['#844341', '#D5CC92', '#BBA146', '#897B26', '#55591C'] },
            { name: 'scheme20', colors: ['#56626B', '#6C9380', '#C0CA55', '#F07C6C', '#AD5472'] },
            { name: 'scheme21', colors: ['#96003A', '#FF7347', '#FFBC7B', '#FF4154', '#642223'] },
            { name: 'scheme22', colors: ['#5D7359', '#E0D697', '#D6AA5C', '#8C5430', '#661C0E'] },
            { name: 'scheme23', colors: ['#16193B', '#35478C', '#4E7AC7', '#7FB2F0', '#ADD5F7'] },
            { name: 'scheme24', colors: ['#7B1A25', '#BF5322', '#9DA860', '#CEA457', '#B67818'] },
            { name: 'scheme25', colors: ['#0081DA', '#3AAFFF', '#99C900', '#FFEB3D', '#309B46'] },
            { name: 'scheme26', colors: ['#0069A5', '#0098EE', '#7BD2F6', '#FFB800', '#FF6800'] },
            { name: 'scheme27', colors: ['#FF6800', '#A0A700', '#FF8D00', '#678900', '#0069A5'] }
        ],

        _getScale: function (size, dim, parent)
        {
            if (size && size.toString().indexOf('%') >= 0)
            {
                size = parseInt(size, 10) / 100;
                return parent[dim]() * size;
            }
            return parseInt(size, 10);
        },

        _removeElements: function ()
        {
            this.host.children('.chartContainer').remove();
            this.host.children('#tblChart').remove();
        },

        _getLabelInterval: function ()
        {
            var that = this,
                labels = that.labels,
                interval;

            if (that.tickMode === 'default')
            {
                if (that.niceInterval)
                {
                    interval = that._getNiceInterval(that.widgetName === 'jqxGauge' ? 'radial' : 'linear');
                } else
                {
                    if (that.int64 === false)
                    {
                        interval = labels.interval;
                    } else
                    {
                        if (!labels._interval64)
                        {
                            labels._interval64 = that.int64 === 's' ? new $.jqx.math().fromNumber(labels.interval) : new BigNumber(labels.interval);
                        }
                        interval = labels._interval64;
                    }
                }
            } else
            {
                if (that.int64 === false)
                {
                    var startToEnd = that.max - that.min;
                    interval = startToEnd / labels.number;
                } else
                {
                    var startToEnd = that._max64.subtract(that._min64);
                    if (that.int64 === 's')
                    {
                        interval = startToEnd.div(new $.jqx.math().fromNumber(labels.number));
                    } else
                    {
                        interval = startToEnd.divide(new BigNumber(labels.number));
                    }
                }
            }
            return interval;
        },

        _getMaxLabelSize: function ()
        {
            var that = this,
                maxVal = this.max,
                minVal = this.min;

            minVal = that._formatLabel(minVal);
            maxVal = that._formatLabel(maxVal);

            var dummy = $('<div style="position: absolute; visibility: hidden;" class="' + that.toThemeProperty('jqx-gauge-label') + '"></div>');
            dummy.css({ 'font-size': that.labels.fontSize, 'font-family': that.labels.fontFamily, 'font-weight': that.labels.fontWeight, 'font-style': that.labels.fontStyle });
            $('body').append(dummy);
            dummy.html(minVal);
            var minSize = { width: dummy.width(), height: dummy.height() };
            dummy.html(maxVal);
            var maxSize = { width: dummy.width(), height: dummy.height() };
            dummy.remove();

            //            var maxSize = this.renderer.measureText(maxVal, 0, { 'class': this.toThemeProperty('jqx-gauge-label') }),
            //                minSize = this.renderer.measureText(minVal, 0, { 'class': this.toThemeProperty('jqx-gauge-label') });
            if (minSize.width > maxSize.width)
            {
                return minSize;
            }
            return maxSize;
        },

        disable: function ()
        {
            this.disabled = true;
            this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
        },

        enable: function ()
        {
            this.disabled = false;
            this.host.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
        },

        destroy: function ()
        {
            var self = this;
            if (self._timeout)
                clearTimeout(this._timeout);

            self._timeout = null;
            $.jqx.utilities.resize(self.host, null, true);
            self._removeElements();
            self.renderer.clear();
            self.renderer = null;
            var vars = $.data(self.element, "jqxGauge");
            if (vars)
                delete vars.instance;

            self.host.children().remove();
            self._caption = null;
            self._caption = null;
            self._pointer = null;
            self._labels = [];
            self._cap = null;
            self._ticks = [];
            self._ranges = [];
            self._border = null;
            self._gauge = null;
            self._caption = null;
            self.renderer = null;
            self._animations = [];
            self.host.removeData();
            self.host.removeClass();
            self.host.remove();
            self.that = null;
            self.element = null;
            self._gaugeParent = null;
            delete self._gaugeParent;
            delete self.element;
            delete self.host;
        },

        _validatePercentage: function (data, def)
        {
            if (parseFloat(data) !== 0 && (!data || !parseInt(data, 10)))
            {
                data = def;
            }
            return data;
        },

        _getColorScheme: function (name)
        {
            var scheme;
            for (var i = 0; i < this._schemes.length; i += 1)
            {
                scheme = this._schemes[i];
                if (scheme.name === name)
                {
                    return scheme.colors;
                }
            }
            return null;
        },

        setValue: function (value, duration)
        {
            var self = this;

            if (!self.disabled)
            {
                duration = duration || self.animationDuration || 0;

                if (self.int64 === 's')
                {
                    if (typeof value === 'number')
                    {
                        value = new $.jqx.math().fromNumber(value, 10);
                    } else if (typeof value === 'string')
                    {
                        value = new $.jqx.math().fromString(value, 10);
                    }

                    if (value.greaterThan(self._max64))
                    {
                        value = new $.jqx.math().fromString(self._max64.toString(), 10);
                    }
                    if (value.lessThan(self._min64))
                    {
                        value = new $.jqx.math().fromString(self._min64.toString(), 10);
                    }

                    self._animate(self._value64, value, duration);
                } else if (self.int64 === 'u')
                {
                    value = new BigNumber(value);

                    if (value.compare(self._max64) === 1)
                    {
                        value = new BigNumber(self._max64);
                    }
                    if (value.compare(self._min64) === -1)
                    {
                        value = new BigNumber(self._min64);
                    }

                    self._animate(self._value64, value, duration);
                } else
                {
                    if (value > self.max)
                    {
                        value = self.max;
                    }
                    if (value < self.min)
                    {
                        value = self.min;
                    }

                    self._animate(self.value, value, duration);
                }

                $.jqx.aria(self, 'aria-valuenow', value.toString());
            }
        },

        _animate: function (start, end, duration)
        {
            var self = this;

            if (self._timeout)
            {
                self._endAnimation(self.int64 ? self._value64 : self.value, false);
            }
            if (!duration)
            {
                self._endAnimation(end, true);
                return;
            }
            self._animateHandler(start, end, 0, duration);
        },

        _animateHandler: function (start, end, current, duration)
        {
            var self = this;
            if (current <= duration)
            {
                this._timeout = setTimeout(function ()
                {
                    if (self.int64 !== false)
                    {
                        var difference = end.subtract(start);
                        if (self.int64 === 's')
                        {
                            var easing = new $.jqx.math().fromNumber(($.easing[self.easing](current / duration, current, 0, 1, duration)) * 100, 10);
                            self._value64 = start.add(difference.multiply(easing).div(new $.jqx.math().fromNumber(100, 10)));
                        } else
                        {
                            var easing = new BigNumber(($.easing[self.easing](current / duration, current, 0, 1, duration)) * 100);
                            self._value64 = start.add(difference.multiply(easing).divide(100));
                        }
                        self.value = self._value64.toString();
                        self._setValue(self._value64);
                    } else
                    {
                        self.value = start + (end - start) * $.easing[self.easing](current / duration, current, 0, 1, duration);
                        self._setValue(self.value);
                    }
                    self._raiseEvent(0, {
                        value: self.value.toString()
                    });
                    self._animateHandler(start, end, current + self._animationTimeout, duration);
                }, this._animationTimeout);
            } else
            {
                this._endAnimation(end, true);
            }
        },

        _endAnimation: function (end, toRaiseEvent)
        {
            clearTimeout(this._timeout);
            this._timeout = null;
            this._setValue(end);
            if (toRaiseEvent)
            {
                this._raiseEvent(1, {
                    value: end.toString()
                });
            }
        },

        _getMaxTickSize: function ()
        {
            return Math.max(this._getSize(this.ticksMajor.size), this._getSize(this.ticksMinor.size));
        },

        _raiseEvent: function (eventId, args)
        {
            var event = $.Event(this._events[eventId]),
                result;
            event.args = args || {};
            result = this.host.trigger(event);
            return result;
        },

        _getNiceInterval: function (type, minorTicks)
        {
            function log10(val)
            {
                return Math.log(parseFloat(val)) / Math.LN10;
            }

            function getSectorArcLength()
            {
                var arcLength = Math.abs(that.startAngle - that.endAngle) * that._innerRadius;
                return Math.round(arcLength);
            }

            var that = this,
                dimension = 'width';
            if (type === 'linear' && that.orientation === 'vertical')
            {
                dimension = 'height';
            }

            var browserRoundingFix = $.jqx.browser.msie ? 0 : 1; // algorithm adjustment (for browsers other than Internet Explorer)

            var largestLabelSize;

            var labelDummy = $('<span class="' + that.toThemeProperty('jqx-gauge-label') + '" style="position: absolute; visibility: hidden;"></span>'),
                min = that._formatLabel(that.min),
                max = that._formatLabel(that.max);

            labelDummy.css({ 'font-size': that.labels.fontSize, 'font-family': that.labels.fontFamily, 'font-weight': that.labels.fontWeight, 'font-style': that.labels.fontStyle });
            $('body').append(labelDummy);
            labelDummy.text(min);
            var minLabelDimension = labelDummy[dimension]() + browserRoundingFix;
            labelDummy.text(max);
            var maxLabelDimension = labelDummy[dimension]() + browserRoundingFix;
            labelDummy.remove();
            var largestLabelSize = Math.max(maxLabelDimension, minLabelDimension);
            var multiplier = 1;

            if (type === 'radial')
            {
                var adjustment;
                if (that._innerRadius < 50)
                {
                    adjustment = 0.3;
                } else if (that._innerRadius < 150)
                {
                    adjustment = 0.6;
                } else if (that._innerRadius < 250)
                {
                    adjustment = 0.7;
                } else
                {
                    adjustment = 1;
                }

                multiplier = 8 / Math.max(1, log10(that._innerRadius)) * adjustment;
            } else
            {
                var largeLabelsAdjustment = 0;
                if (largestLabelSize > 105)
                {
                    largeLabelsAdjustment = (largestLabelSize - 105) / 100;
                }
                multiplier = 1.5 + largeLabelsAdjustment;
            }
            largestLabelSize *= multiplier;
            var trackDimension;
            if (type === 'radial')
            {
                trackDimension = getSectorArcLength();
            } else
            {
                trackDimension = that._getScaleLength();
            }
            var divisionCountEstimate = Math.ceil(trackDimension / largestLabelSize),
                rangeDelta, exponent, nearestPowerOfTen, factor, niceFactor, niceInterval;

            if (minorTicks === true)
            {
                if (type === 'radial')
                {
                    divisionCountEstimate *= 4;
                } else
                {
                    divisionCountEstimate *= 3;
                }
            }

            if (that.int64 === false)
            {
                rangeDelta = that.max - that.min;
                exponent = Math.floor(log10(rangeDelta) - log10(divisionCountEstimate));
                nearestPowerOfTen = Math.pow(10, exponent);
                factor = divisionCountEstimate * nearestPowerOfTen;
                niceFactor;
                if (rangeDelta < 2 * factor)
                {
                    niceFactor = 1;
                } else if (rangeDelta < 3 * factor)
                {
                    niceFactor = 2;
                } else if (rangeDelta < 7 * factor)
                {
                    niceFactor = 5;
                } else
                {
                    niceFactor = 10;
                }
                niceInterval = niceFactor * nearestPowerOfTen;
                //                if (that.labels.formatSettings) {
                //                    var radix = that.labels.formatSettings.radix;
                //                    if (radix !== undefined && radix !== 10 && minorTicks === undefined && niceInterval < 1) {
                //                        niceInterval = 1;
                //                    }
                //                }
            } else
            {
                rangeDelta = new BigNumber(that.max).subtract(new BigNumber(that.min));
                exponent = Math.floor(log10(rangeDelta.toString()) - log10(divisionCountEstimate));
                nearestPowerOfTen = new BigNumber(10).pow(new BigNumber(exponent));
                factor = new BigNumber(divisionCountEstimate).multiply(nearestPowerOfTen);
                niceFactor;
                if (rangeDelta.compare(new BigNumber(2 * factor)) === -1)
                {
                    niceFactor = 1;
                } else if (rangeDelta.compare(new BigNumber(3 * factor)) === -1)
                {
                    niceFactor = 2;
                } else if (rangeDelta.compare(new BigNumber(7 * factor)) === -1)
                {
                    niceFactor = 5;
                } else
                {
                    niceFactor = 10;
                }
                niceInterval = new BigNumber(niceFactor).multiply(nearestPowerOfTen);

                if (niceInterval.compare(1) === -1)
                {
                    niceInterval = new BigNumber(1);
                }

                if (that.int64 === 's')
                {
                    niceInterval = new $.jqx.math().fromString(niceInterval.toString());
                }
            }

            return niceInterval;
        },

        _styleLabels: function ()
        {
            return;
            var that = this,
                options = that.labels,
                labels = that.host.find('.jqx-gauge-label');
            labels.css({ 'font-size': options.fontSize, 'font-family': options.fontFamily, 'font-weight': options.fontWeight, 'font-style': options.fontStyle });
        },

        _checkForOverflow: function (first, second)
        {
            var maxInt64 = new BigNumber('9223372036854775807'),
                bigFirst = new BigNumber(first.toString()),
                bigSecond = new BigNumber(second.toString());

            if (bigFirst.add(bigSecond).compare(maxInt64) === 1)
            {
                return true;
            } else
            {
                return false;
            }
        },

        _formatLabel: function (value, position)
        {
            var that = this,
                formatFunction = that.labels.formatValue,
                formatSettings = that.labels.formatSettings,
                formattedValue;

            if (formatFunction)
            {
                formattedValue = formatFunction(value, position);
            } else if (formatSettings)
            {
                if (formatSettings.radix !== undefined)
                {
                    formattedValue = new $.jqx.math().getRadixValue(value, that.int64, formatSettings.radix);
                } else
                {
                    if (formatSettings.outputNotation !== undefined && formatSettings.outputNotation !== 'default' && formatSettings.outputNotation !== 'decimal')
                    {
                        formattedValue = new $.jqx.math().getDecimalNotation(value, formatSettings.outputNotation, formatSettings.decimalDigits, formatSettings.digits);
                    } else
                    {
                        if (formatSettings.decimalDigits !== undefined)
                        {
                            formattedValue = Number(value).toFixed(formatSettings.decimalDigits);
                        } else if (formatSettings.digits !== undefined)
                        {
                            formattedValue = Number(value).toPrecision(formatSettings.digits);
                        }
                    }
                }
            } else
            {
                formattedValue = value;
            }

            return formattedValue;
        },

        _editableLabels: function (skipInputCreation)
        {
            var that = this;
            function handleDblclick(label, value)
            {
                var labelDimensions = that.renderer.measureText(that._formatLabel(value), 0, { 'class': that.toThemeProperty('jqx-gauge-label') });

                inputObject.offset($(label).offset());
                input.style.width = (labelDimensions.width + 10) + 'px';
                input.style.height = labelDimensions.height + 'px';
                input.style.visibility = 'visible';
                input.value = value;
                inputObject.select();
            }

            if (that.editableLabels)
            {
                var labels = that._labels;
                if (labels.length === 0)
                {
                    return;
                }

                var firstLabel = labels[0],
                    lastLabel = labels[labels.length - 1],
                    input, inputObject;

                if (skipInputCreation !== true)
                {
                    input = document.createElement('input');
                    inputObject = $(input);

                    input.className = 'jqx-gauge-label-input';
                    that.element.appendChild(input);
                } else
                {
                    inputObject = that.host.children('input');
                    input = inputObject[0];
                }

                firstLabel.style.cursor = 'text';
                lastLabel.style.cursor = 'text';
                that.addHandler($(firstLabel), 'dblclick.jqxGauge' + that.element.id, function (event)
                {
                    handleDblclick(this, that.min);
                    that._editedProperty = 'min';
                });

                that.addHandler($(lastLabel), 'dblclick.jqxGauge' + that.element.id, function (event)
                {
                    handleDblclick(this, that.max);
                    that._editedProperty = 'max';
                });

                var numericRegExp = /^-?\d+\.?\d*$/;

                function updateExtreme(value, name, nameInt64, otherName)
                {
                    if (value === that[name].toString())
                    {
                        return false;
                    }
                    if (that.int64 === 's')
                    {
                        var valueInt64S = new $.jqx.math().fromString(value, 10);
                        if ((name === 'min' && valueInt64S.compare(that['_' + otherName + '64']) !== -1) || (name === 'max' && valueInt64S.compare(that['_' + otherName + '64']) !== 1))
                        {
                            return false;
                        }
                        that[nameInt64] = valueInt64S;
                        that[name] = value;
                    } else if (that.int64 === 'u')
                    {
                        var valueInt64U = new BigNumber(value);
                        if (valueInt64U.compare(0) === -1 || (name === 'min' && valueInt64U.compare(that['_' + otherName + '64']) !== -1) || (name === 'max' && valueInt64U.compare(that['_' + otherName + '64']) !== 1))
                        {
                            return false;
                        }
                        that[nameInt64] = valueInt64U;
                        that[name] = value;
                    } else
                    {
                        if ((name === 'min' && value >= that[otherName]) || (name === 'max' && value <= that[otherName]))
                        {
                            return false;
                        }
                        that[name] = parseFloat(value);
                    }
                }

                if (skipInputCreation !== true)
                {
                    that.addHandler(inputObject, 'blur.jqxGauge' + that.element.id, function (event)
                    {
                        var value = this.value,
                            valid;
                        input.style.visibility = 'hidden';
                        if (!numericRegExp.test(value))
                        {
                            return;
                        }
                        if (that._editedProperty === 'min')
                        {
                            valid = updateExtreme(value, 'min', '_min64', 'max');
                            if (valid === false)
                            {
                                return;
                            }
                            $.jqx.aria(that, 'aria-valuemin', value);
                        } else
                        {
                            valid = updateExtreme(value, 'max', '_max64', 'min');
                            if (valid === false)
                            {
                                return;
                            }
                            $.jqx.aria(that, 'aria-valuemax', value);
                        }
                        that.refresh();
                        if (that.renderer instanceof $.jqx.HTML5Renderer)
                        {
                            that.renderer.refresh();
                        }
                    });
                }
            }
        }
    },

    // LinearGauge's functionality
    linearGauge = {
        defineInstance: function ()
        {
            var settings =
            {
                int64: false,
                editableLabels: false,
                value: -50,
                max: 40,
                min: -60,
                width: 100,
                height: 300,
                pointer: {},
                labels: {},
                animationDuration: 1000,
                showRanges: {},
                ticksMajor: { size: '15%', interval: 5 },
                ticksMinor: { size: '10%', interval: 2.5 },
                tickMode: 'default', // possible values: 'default', 'tickNumber'
                niceInterval: false,
                ranges: [],
                easing: 'easeOutCubic',
                colorScheme: 'scheme01',
                disabled: false,
                rangesOffset: 0,
                background: {},
                ticksPosition: 'both',
                rangeSize: '5%',
                scaleStyle: null,
                ticksOffset: null,
                scaleLength: '90%',
                orientation: 'vertical',
                aria:
                {
                    "aria-valuenow": { name: "value", type: "number" },
                    "aria-valuemin": { name: "min", type: "number" },
                    "aria-valuemax": { name: "max", type: "number" },
                    "aria-disabled": { name: "disabled", type: "boolean" }
                },
                displayTank: false,
                tankStyle: null,

                //Used for saving the solid background color when a gradient is used
                _originalColor: '',
                _width: null,
                _height: null,
                renderer: null
            };

            $.extend(true, this, settings);
            return settings;
        },

        createInstance: function ()
        {
            $.jqx.aria(this);
            this.host.css('overflow', 'hidden');
            this.host.addClass(this.toThemeProperty('jqx-widget'));
            this.host.append('<input class="jqx-gauge-label-input"/>');
            var self = this;

            if (self.int64 === 's')
            {
                if (!$.jqx.longInt)
                {
                    throw new Error('jqxLinearGauge: Missing reference to jqxmath.js');
                }

                // enables 64-bit number support
                $.jqx.longInt(self);

                self._value64 = new $.jqx.math().fromString(self.value.toString(), 10);
                self._min64 = new $.jqx.math().fromString(self.min.toString(), 10);
                self._max64 = new $.jqx.math().fromString(self.max.toString(), 10);
            } else if (self.int64 === 'u')
            {
                try
                {
                    BigNumber;
                }
                catch (err)
                {
                    throw new Error('jqxLinearGauge: Missing reference to jqxmath.js');
                }

                self._value64 = new BigNumber(self.value);
                self._min64 = new BigNumber(self.min);
                self._max64 = new BigNumber(self.max);
            }

            $.jqx.utilities.resize(this.host, function ()
            {
                self.refresh(false, false);
            });
        },

        val: function (value)
        {
            if (arguments.length == 0 || typeof (value) == "object")
            {
                return this.value;
            }
            this.setValue(value, 0);
        },

        _initRenderer: function (host)
        {
            if (!$.jqx.createRenderer)
                throw 'Please include a reference to jqxdraw.js';

            return $.jqx.createRenderer(this, host);
        },

        refresh: function (init, applyValue)
        {
            var self = this;

            self._nearLabels = [];
            self._farLabels = [];

            if (!self.renderer)
            {
                self._isVML = false;
                self.host.empty();
                self._initRenderer(self.host);
            }

            var renderer = self.renderer;
            if (!renderer)
                return;

            self._validateProperties();
            self._reset();
            self._init();
            self._performLayout();
            self._render();
            if (applyValue !== false)
            {
                self.setValue(self.value, 1);
            }
            if (!init)
            {
                var position = self.labels.position;
                if (position === 'both' || position === 'near')
                {
                    self._labels = self._nearLabels;
                    self._editableLabels();
                }
                if (position === 'both' || position === 'far')
                {
                    self._labels = self._farLabels;
                    self._editableLabels(position === 'both' ? true : undefined);
                }
            }
        },

        _getBorderSize: function ()
        {
            var def = 1,
                size;
            if (this._isVML)
            {
                def = 0;
            }
            if (this.background)
            {
                size = (parseInt(this.background.style['stroke-width'], 10) || def) / 2;
                if (this._isVML)
                {
                    return Math.round(size);
                }
                return size;
            }
            return def;
        },

        _validateProperties: function ()
        {
            this.background = this._backgroundConstructor(this.background, this);
            this.ticksOffset = this.ticksOffset || this._getDefaultTicksOffset();
            this.rangesOffset = this.rangesOffset || 0;
            this.rangeSize = this._validatePercentage(this.rangeSize, 5);
            this.ticksOffset[0] = this._validatePercentage(this.ticksOffset[0], '5%');
            this.ticksOffset[1] = this._validatePercentage(this.ticksOffset[1], '5%');
            this.ticksMinor = this._tickConstructor(this.ticksMinor, this);
            this.ticksMajor = this._tickConstructor(this.ticksMajor, this);
            this.scaleStyle = this.scaleStyle || this.ticksMajor.style;
            this.labels = this._labelsConstructor(this.labels, this);
            this.pointer = this._pointerConstructor(this.pointer, this);
            for (var i = 0; i < this.ranges.length; i += 1)
            {
                this.ranges[i] = this._rangeConstructor(this.ranges[i], this);
            }
        },

        _getDefaultTicksOffset: function ()
        {
            if (this.orientation === 'horizontal')
            {
                return ['5%', '36%'];
            }
            return ['36%', '5%'];
        },

        _handleOrientation: function ()
        {
            if (this.orientation === 'vertical')
            {
                $.extend(this, linearVerticalGauge);
            } else
            {
                $.extend(this, linearHorizontalGauge);
            }
        },

        _reset: function ()
        {
            this.host.empty();
        },

        _performLayout: function ()
        {
            var borderStroke = parseInt(this.background.style['stroke-width'], 10) || 1;
            this._width -= borderStroke;
            this._height -= borderStroke;
            this.host.css('padding', borderStroke / 2);
        },

        _init: function ()
        {
            var border = this._getBorderSize(),
                chartContainer;
            this._width = this._getScale(this.width, 'width', this.host.parent()) - 3;
            this._height = this._getScale(this.height, 'height', this.host.parent()) - 3;
            this.element.innerHTML = '<div/>';
            this.host.width(this._width);
            this.host.height(this._height);
            this.host.children().width(this._width);
            this.host.children().height(this._height);
            this.renderer.init(this.host.children());
            chartContainer = this.renderer.getContainer();
            chartContainer.width(this._width);
            chartContainer.height(this._height);
        },

        _render: function ()
        {
            this._renderBackground();
            this._renderTicks();
            if (!this.niceInterval)
            {
                this._renderLabels();
            }
            this._styleLabels();
            this._renderRanges();
            this._renderPointer();
        },

        _renderBackground: function ()
        {
            if (!this.background.visible)
            {
                return;
            }
            var options = this.background.style,
                border = $.jqx._rup(this._getBorderSize()),
                shape = 'rect',
                rect;
            options = this._handleShapeOptions(options);
            if (this.background.backgroundType === 'roundedRectangle' && this._isVML)
            {
                shape = 'roundrect';
            }
            if (!this._Vml)
            {
                options.x = border;
                options.y = border;
            }
            rect = this.renderer.shape(shape, options);
            if (this._isVML)
            {
                this._fixVmlRoundrect(rect, options);
            }
        },

        _handleShapeOptions: function (options)
        {
            var color = this.background.style.fill,
                border = this._getBorderSize();
            if (!color)
            {
                color = '#cccccc';
            }
            if (this.background.showGradient)
            {
                if (color.indexOf('url') < 0 && color.indexOf('#grd') < 0)
                {
                    this._originalColor = color;
                } else
                {
                    color = this._originalColor;
                }
                color = this.renderer._toLinearGradient(color, this.orientation === 'horizontal', [[1, 1.1], [90, 1.5]]);
            }
            this.background.style.fill = color;
            if (this.background.backgroundType === 'roundedRectangle')
            {
                if (this._isVML)
                {
                    options.arcsize = this.background.borderRadius + '%';
                } else
                {
                    options.rx = this.background.borderRadius;
                    options.ry = this.background.borderRadius;
                }
            }
            options.width = this._width - 1;
            options.height = this._height - 1;
            return options;
        },

        _fixVmlRoundrect: function (rect, options)
        {
            var border = this._getBorderSize();
            rect.style.position = 'absolute';
            rect.style.left = border;
            rect.style.top = border;
            rect.style.width = this._width - 1;
            rect.style.height = this._height - 1;
            rect.strokeweight = 0;
            delete options.width;
            delete options.height;
            delete options.arcsize;
            this.renderer.attr(rect, options);
        },

        _renderTicks: function ()
        {
            var minor = this.ticksMinor,
                major = this.ticksMajor,
                distance, majorInterval, minorInterval, majorCount, minorCount, majorOptions, minorOptions;

            if (this.int64 === 's')
            {
                distance = this._max64.subtract(this._min64);
                if (distance.isNegative())
                {
                    distance = distance.negate();
                }
                if (this.tickMode === 'default')
                {
                    if (this.niceInterval)
                    {
                        majorInterval = this._getNiceInterval('linear');
                        minorInterval = this._getNiceInterval('linear', true);
                    } else
                    {
                        majorInterval = major._interval64;
                        minorInterval = minor._interval64;
                    }
                } else
                {
                    majorInterval = distance.div(new $.jqx.math().fromNumber(major.number));
                    minorInterval = distance.div(new $.jqx.math().fromNumber(minor.number));
                }
            } else if (this.int64 === 'u')
            {
                distance = this._max64.subtract(this._min64).abs();
                if (this.tickMode === 'default')
                {
                    if (this.niceInterval)
                    {
                        majorInterval = this._getNiceInterval('linear');
                        minorInterval = this._getNiceInterval('linear', true);
                    } else
                    {
                        majorInterval = major._interval64;
                        minorInterval = minor._interval64;
                    }
                } else
                {
                    majorInterval = distance.divide(new BigNumber(major.number));
                    minorInterval = distance.divide(new BigNumber(minor.number));
                }
            } else
            {
                distance = Math.abs(this.max - this.min);
                if (this.tickMode === 'default')
                {
                    if (this.niceInterval)
                    {
                        majorInterval = this._getNiceInterval('linear');
                        minorInterval = this._getNiceInterval('linear', true);
                    } else
                    {
                        majorInterval = major.interval;
                        minorInterval = minor.interval;
                    }
                } else
                {
                    majorInterval = distance / major.number;
                    minorInterval = distance / minor.number;
                }
            }

            majorOptions = { size: this._getSize(major.size), style: major.style, visible: major.visible, interval: majorInterval, type: 'major' };
            minorOptions = { size: this._getSize(minor.size), style: minor.style, visible: minor.visible, interval: minorInterval, checkOverlap: true, type: 'minor' };
            if (this.ticksPosition === 'near' || this.ticksPosition === 'both')
            {
                this._ticksRenderHandler(majorOptions);
                this._ticksRenderHandler(minorOptions);
            }
            if (this.ticksPosition === 'far' || this.ticksPosition === 'both')
            {
                majorOptions.isFar = true;
                minorOptions.isFar = true;
                this._ticksRenderHandler(majorOptions);
                this._ticksRenderHandler(minorOptions);
            }
            this._renderConnectionLine();
        },

        _ticksRenderHandler: function (options)
        {
            if (!options.visible && options.type === 'minor')
            {
                return;
            }
            var offsetLeft = this._getSize(this.ticksOffset[0], 'width'),
                offsetTop = this._getSize(this.ticksOffset[1], 'height'),
                border = this._getBorderSize(),
                inactiveOffset = this._calculateTickOffset() + this._getMaxTickSize();
            if (options.isFar)
            {
                inactiveOffset += options.size;
            }
            this._drawTicks(options, border, inactiveOffset + border);
        },

        _drawTicks: function (options, border, inactiveOffset)
        {
            var self = this,
                interval = options.interval,
                position,
                dimension = self.orientation === 'vertical' ? 'width' : 'height',
                counterDimension = self.orientation === 'vertical' ? 'height' : 'width',
                maxLabelSize = self._getMaxLabelSize()[dimension],
                maxLabelCounterDimension = self._getMaxLabelSize()[counterDimension],
                majorInterval = self._getInterval('ticksMajor'),
                minorInterval = self._getInterval('ticksMinor');

            function loop(i)
            {
                position = self._valueToCoordinates(i);
                if (!options.checkOverlap || !self._overlapTick(i, majorInterval, minorInterval))
                {
                    if (options.visible)
                    {
                        self._renderTick(options.size, position, options.style, inactiveOffset);
                    }

                    if (self.niceInterval && self.labels.visible)
                    {
                        var dimension, counterDimension, distance;
                        if (self.orientation === 'vertical')
                        {
                            distance = self._getSize(self.ticksOffset[1], 'height');
                        } else
                        {
                            distance = self._getSize(self.ticksOffset[0], 'width');
                        }
                        distance += border;
                        var side = options.isFar ? 'far' : 'near',
                            offset;

                        if (side === 'near')
                        {
                            offset = self._calculateTickOffset() - maxLabelSize + border + self._getSize(self.labels.offset);
                        } else
                        {
                            offset = self._calculateTickOffset() + 2 * self._getMaxTickSize() + maxLabelSize + border + self._getSize(self.labels.offset);
                        }

                        if (self.int64 === false)
                        {
                            if (i !== self.min && Math.abs(self._valueToCoordinates(self.min) - position) < maxLabelCounterDimension)
                            {
                                return;
                            }
                            if (i !== self.max && Math.abs(self._valueToCoordinates(self.max) - position) < maxLabelCounterDimension)
                            {
                                return;
                            }
                        } else if (self.int64 === 's')
                        {
                            if (i.equals(self._min64) === false && Math.abs(self._valueToCoordinates(self._min64) - position) < maxLabelCounterDimension)
                            {
                                return false;
                            }
                            if (i.equals(self._max64) === false && Math.abs(self._valueToCoordinates(self._max64) - position) < maxLabelCounterDimension)
                            {
                                return;
                            }
                        } else if (self.int64 === 'u')
                        {
                            if (i.compare(self._min64) !== 0 && Math.abs(self._valueToCoordinates(self._min64) - position) < maxLabelCounterDimension)
                            {
                                return false;
                            }
                            if (i.compare(self._max64) !== 0 && Math.abs(self._valueToCoordinates(self._max64) - position) < maxLabelCounterDimension)
                            {
                                return;
                            }
                        }

                        var labelsPosition = self.labels.position;
                        if (options.type === 'major' && (labelsPosition === 'both' || labelsPosition === 'near' && options.isFar !== true || labelsPosition === 'far' && options.isFar))
                        {
                            self._renderLabel(position, side, offset, maxLabelSize, i);
                        }
                    }
                }
            }

            if (self.niceInterval)
            {
                var second;
                if (self.int64 === 's')
                {
                    loop(self._min64);
                    second = self._min64.subtract(self._min64.modulo(interval)).add(interval);
                    if (options.type === 'minor')
                    {
                        for (var a = second; a.greaterThanOrEqual(self._min64) ; a = a.subtract(interval))
                        {
                            second = a;
                        }
                    }
                    for (var i = second; i.lessThan(self._max64) ; i = i.add(interval))
                    {
                        if (self._checkForOverflow(i, interval))
                        {
                            break;
                        }
                        loop(i);
                    }
                    loop(self._max64);
                } else if (self.int64 === 'u')
                {
                    loop(self._min64);
                    second = self._min64.subtract(self._min64.mod(interval)).add(interval);
                    if (options.type === 'minor')
                    {
                        for (var a = second; a.compare(self._min64) !== -1; a = a.subtract(interval))
                        {
                            second = a;
                        }
                    }
                    for (var i = second; i.compare(self._max64) === -1; i = i.add(interval))
                    {
                        loop(i);
                    }
                    loop(self._max64);
                } else
                {
                    loop(self.min);
                    second = self.min - (self.min % interval) + interval;
                    if (options.type === 'minor')
                    {
                        for (var a = second; a >= self.min; a = a - interval)
                        {
                            second = a;
                        }
                    }
                    for (var i = second; i <= self.max; i += interval)
                    {
                        loop(i);
                    }
                    loop(self.max);
                }
            } else
            {
                if (self.int64 === 's')
                {
                    for (var i = new $.jqx.math().fromString(self._min64.toString(), 10) ; i.lessThanOrEqual(self._max64) ; i = i.add(interval))
                    {
                        loop(i);
                    }
                } else if (self.int64 === 'u')
                {
                    for (var i = new BigNumber(self._min64) ; i.compare(self._max64) !== 1; i = i.add(interval))
                    {
                        loop(i);
                    }
                } else
                {
                    for (var i = self.min; i <= self.max; i += interval)
                    {
                        loop(i);
                    }
                }
            }
        },

        _calculateTickOffset: function ()
        {
            var offsetLeft = this._getSize(this.ticksOffset[0], 'width'),
                offsetTop = this._getSize(this.ticksOffset[1], 'height'),
                offset = offsetTop;
            if (this.orientation === 'vertical')
            {
                offset = offsetLeft;
            }
            return offset;
        },

        _getInterval: function (object)
        {
            var that = this,
                interval;

            if (that.tickMode === 'default')
            {
                if (that.niceInterval === true)
                {
                    interval = that._getNiceInterval('linear', object === 'ticksMinor');
                } else
                {
                    if (that.int64 !== false)
                    {
                        interval = that[object]._interval64;
                    } else
                    {
                        interval = that[object].interval;
                    }
                }
            } else
            {
                var count = that[object].number,
                    range;

                if (that.int64 !== false)
                {
                    range = that._max64.subtract(that._min64);
                    if (that.int64 === 's')
                    {
                        interval = range.div(new $.jqx.math().fromNumber(count));
                    } else
                    {
                        interval = range.divide(new BigNumber(count));
                    }
                } else
                {
                    range = that.max - that.min;
                    interval = range / that[object].number;
                }
            }

            return interval;
        },

        _overlapTick: function (value, majorInterval, minorInterval)
        {
            if (this.int64 === 's')
            {
                value = value.add(this._min64);
                if ((value.modulo(minorInterval)).equals(value.modulo(majorInterval)))
                {
                    return true;
                } else
                {
                    return false;
                }
            } else if (this.int64 === 'u')
            {
                value = value.add(this._min64);
                if ((value.mod(minorInterval)).compare(value.mod(majorInterval)) === 0)
                {
                    return true;
                } else
                {
                    return false;
                }
            } else
            {
                value += this.min;
                if (value % minorInterval === value % majorInterval)
                {
                    return true;
                }
                return false;
            }
        },

        _renderConnectionLine: function ()
        {
            if (!this.ticksMajor.visible && !this.ticksMinor.visible)
            {
                return;
            }
            var scaleLength = this._getScaleLength(),
                border = this._getBorderSize(),
                maxPosition,
                minPosition,
                maxSize = this._getMaxTickSize(),
                offset = maxSize + border;

            if (this.int64 !== false)
            {
                maxPosition = this._valueToCoordinates(this._max64)
                minPosition = this._valueToCoordinates(this._min64);
            } else
            {
                maxPosition = this._valueToCoordinates(this.max);
                minPosition = this._valueToCoordinates(this.min);
            }

            if (this.orientation === 'vertical')
            {
                offset += this._getSize(this.ticksOffset[0], 'width');
                this.renderer.line(offset, maxPosition, offset, minPosition, this.scaleStyle);
            } else
            {
                offset += this._getSize(this.ticksOffset[1], 'height');
                var end = this._getSize(this.ticksOffset[0], 'width');
                this.renderer.line(end + maxPosition - minPosition, offset, end, offset, this.scaleStyle);
            }
        },

        _getScaleLength: function ()
        {
            return this._getSize(this.scaleLength, (this.orientation === 'vertical' ? 'height' : 'width'));
        },

        _renderTick: function (size, distance, style, offset)
        {
            var coordinates = this._handleTickCoordinates(size, distance, offset);
            this.renderer.line(Math.round(coordinates.x1), Math.round(coordinates.y1), Math.round(coordinates.x2), Math.round(coordinates.y2), style);
        },

        _handleTickCoordinates: function (size, distance, offset)
        {
            if (this.orientation === 'vertical')
            {
                return {
                    x1: offset - size,
                    x2: offset,
                    y1: distance,
                    y2: distance
                };
            }
            return {
                x1: distance,
                x2: distance,
                y1: offset - size,
                y2: offset
            };
        },

        _getTickCoordinates: function (tickSize, offset)
        {
            var ticksCoordinates = this._handleTickCoordinates(tickSize, 0, this._calculateTickOffset());
            if (this.orientation === 'vertical')
            {
                ticksCoordinates = ticksCoordinates.x1;
            } else
            {
                ticksCoordinates = ticksCoordinates.y1;
            }
            ticksCoordinates += tickSize;
            return ticksCoordinates;

        },

        _renderLabels: function ()
        {
            if (!this.labels.visible)
            {
                return;
            }
            var startPosition = this._getSize(this.ticksOffset[0], 'width'),
                tickSize = this._getMaxTickSize(),
                labelsPosition = this.labels.position,
                dimension = 'height',
                border = this._getBorderSize(),
                ticksCoordinates = this._calculateTickOffset() + tickSize,
                maxLabelSize;
            if (this.orientation === 'vertical')
            {
                startPosition = this._getSize(this.ticksOffset[1], 'height');
                dimension = 'width';
            }
            maxLabelSize = this._getMaxLabelSize()[dimension];
            if (labelsPosition === 'near' || labelsPosition === 'both')
            {
                this._labelListRender(ticksCoordinates - tickSize - maxLabelSize + border, startPosition + border, maxLabelSize, 'near');
            }
            if (labelsPosition === 'far' || labelsPosition === 'both')
            {
                this._labelListRender(ticksCoordinates + tickSize + maxLabelSize + border, startPosition + border, maxLabelSize, 'far');
            }
        },

        _labelListRender: function (offset, distance, maxLabelSize, position)
        {
            var interval, count, step, currentValue, range, number,
                length = this._getScaleLength();

            offset += this._getSize(this.labels.offset);

            if (this.int64 !== false)
            {
                range = this._max64.subtract(this._min64)
                if (this.tickMode === 'default')
                {
                    interval = this.labels._interval64;
                    if (this.int64 === 's')
                    {
                        count = range.div(interval).toNumber();
                    } else
                    {
                        count = parseFloat((range).divide(interval).toString());
                    }
                } else
                {
                    count = this.labels.number;
                    if (this.int64 === 's')
                    {
                        interval = range.div(new $.jqx.math().fromNumber(count));
                    } else
                    {
                        interval = range.divide(count);
                    }
                }
                currentValue = (this.orientation === 'vertical') ? this._max64 : this._min64;
            } else
            {
                range = Math.abs(this.max - this.min);
                if (this.tickMode === 'default')
                {
                    interval = this.labels.interval;
                    count = range / interval;
                } else
                {
                    count = this.labels.number;
                    interval = range / count;
                }
                currentValue = (this.orientation === 'vertical') ? this.max : this.min;
            }
            step = length / count;

            for (var i = 0; i <= count; i += 1)
            {
                this._renderLabel(distance, position, offset, maxLabelSize, currentValue);

                if (this.int64 !== false)
                {
                    currentValue = (this.orientation === 'vertical') ? currentValue.subtract(interval) : currentValue.add(interval);
                } else
                {
                    currentValue += (this.orientation === 'vertical') ? -interval : interval;
                }
                distance += step;
            }
        },

        _renderLabel: function (distance, position, offset, maxLabelSize, currentValue)
        {
            var that = this,
                labelSettings = that.labels,
                param = { 'class': this.toThemeProperty('jqx-gauge-label') },
                interval = this.labels.interval,
                widthDiff, textSize, formatedValue, currentLabel;

            var style = '';
            if (labelSettings.fontSize)
            {
                style += 'font-size: ' + labelSettings.fontSize + ';';
            }
            if (labelSettings.fontFamily)
            {
                style += 'font-family: ' + labelSettings.fontFamily;
            }
            if (labelSettings.fontWeight)
            {
                style += 'font-weight: ' + labelSettings.fontWeight;
            }
            if (labelSettings.fontStyle)
            {
                style += 'font-style: ' + labelSettings.fontStyle;
            }
            if (style !== '')
            {
                param.style = style;
            }

            formatedValue = this._formatLabel(currentValue.toString(), position);
            textSize = this.renderer.measureText(formatedValue, 0, param);
            if (this.orientation === 'vertical')
            {
                widthDiff = (position === 'near') ? maxLabelSize - textSize.width : 0;
                currentLabel = this.renderer.text(formatedValue, Math.round(offset) + widthDiff - maxLabelSize / 2,
                    Math.round(distance - textSize.height / 2), textSize.width, textSize.height, 0, param);
            } else
            {
                widthDiff = (position === 'near') ? maxLabelSize - textSize.height : 0;
                currentLabel = this.renderer.text(formatedValue, Math.round(distance - textSize.width / 2),
                    Math.round(offset) + widthDiff - maxLabelSize / 2, textSize.width, textSize.height, 0, param);
            }
            if (position === 'near')
            {
                if (this.niceInterval || this.orientation === 'horizontal')
                {
                    this._nearLabels.push(currentLabel);
                } else
                {
                    this._nearLabels.unshift(currentLabel);
                }
            } else
            {
                if (this.niceInterval || this.orientation === 'horizontal')
                {
                    this._farLabels.push(currentLabel);
                } else
                {
                    this._farLabels.unshift(currentLabel);
                }
            }
        },

        _renderRanges: function ()
        {
            if (!this.showRanges)
            {
                return;
            }
            var dim = (this.orientation === 'vertical') ? 'width' : 'height',
                offset = this._getSize(this.rangesOffset, dim),
                size = this._getSize(this.rangeSize, dim),
                options;
            for (var i = 0; i < this.ranges.length; i += 1)
            {
                options = this.ranges[i];
                options.size = size;
                this._renderRange(options, offset);
            }
        },

        _renderRange: function (options, offset)
        {
            var scaleLength = this._getScaleLength(),
                border = this._getBorderSize(),
                offsetLeft = this._getSize(this.ticksOffset[0], 'width'),
                offsetTop = this._getSize(this.ticksOffset[1], 'height'),
                maxSize = this._getMaxTickSize(),
                size = this._getSize(options.size),
                top, startValue;

            if (this.int64 !== false)
            {
                top = this._valueToCoordinates(options._endValue64);
                startValue = options._startValue64;
                if (this.int64 === 's' && startValue.lessThan(this._min64))
                {
                    startValue = new $.jqx.math().fromString(this._min64.toString(), 10);
                } else if (this.int64 === 'u' && startValue.compare(this._min64) === -1)
                {
                    startValue = new BigNumber(this._min64);
                }
            } else
            {
                top = this._valueToCoordinates(options.endValue);
                startValue = options.startValue;
                if (startValue < this.min) startValue = this.min;
            }


            var height = Math.abs(this._valueToCoordinates(startValue) - top),
                rect, width;
            if (this.orientation === 'vertical')
            {
                rect = this.renderer.rect(offsetLeft + maxSize + offset - size + border, top, options.size, height, options.style);
            } else
            {
                width = height;
                rect = this.renderer.rect(this._valueToCoordinates(startValue), offsetTop + maxSize + border, width, options.size, options.style);
            }
            this.renderer.attr(rect, options.style);
        },

        _renderPointer: function ()
        {
            if (!this.pointer.visible)
            {
                return;
            }
            if (this.pointer.pointerType === 'default')
            {
                this._renderColumnPointer();
            } else
            {
                this._renderArrowPointer();
            }
        },

        _renderColumnPointer: function ()
        {
            if (this.displayTank)
            {
                var tankStyle = { fill: '#FFFFFF' };
                tankStyle['fill-opacity'] = 0;
                if (this.tankStyle)
                {
                    tankStyle.stroke = this.tankStyle.stroke;
                    tankStyle['stroke-width'] = this.tankStyle.strokeWidth;
                } else
                {
                    tankStyle.stroke = '#A1A1A1';
                    tankStyle['stroke-width'] = '1px';
                }

                this._tank = this.renderer.rect(0, 0, 0, 0, tankStyle);
                this._performTankLayout();
            }
            this._pointer = this.renderer.rect(0, 0, 0, 0, this.pointer.style);

            this.renderer.attr(this._pointer, this.pointer.style);

            if (this.int64 !== false)
            {
                this._setValue(this._value64);
            } else
            {
                this._setValue(this.value);
            }
        },

        _performTankLayout: function ()
        {
            var bottom, left, height,
                top = this._valueToCoordinates(),
                border = this._getBorderSize(),
                offsetLeft = this._getSize(this.ticksOffset[0], 'width'),
                offsetTop = this._getSize(this.ticksOffset[1], 'height'),
                maxSize = this._getMaxTickSize(),
                width = this._getSize(this.pointer.size),
                offset = this._getSize(this.pointer.offset),
                attrs = {};

            if (this.int64 !== false)
            {
                top = this._valueToCoordinates(this._max64);
                bottom = this._valueToCoordinates(this._min64);
            } else
            {
                top = this._valueToCoordinates(this.max);
                bottom = this._valueToCoordinates(this.min);
            }
            height = Math.abs(bottom - top);

            if (this.orientation === 'vertical')
            {
                left = offsetLeft + maxSize;
                attrs = { left: left + offset + 1 + border, top: top, height: height, width: width };
            } else
            {
                left = offsetTop + maxSize;
                attrs = { left: bottom, top: left + offset - width - 1 + border, height: width, width: height };
            }

            if (!this._isVML)
            {
                this.renderer.attr(this._tank, { x: attrs.left });
                this.renderer.attr(this._tank, { y: attrs.top });
                this.renderer.attr(this._tank, { width: attrs.width });
                this.renderer.attr(this._tank, { height: attrs.height });
            } else
            {
                this._tank.style.top = attrs.top;
                this._tank.style.left = attrs.left;
                this._tank.style.width = attrs.width;
                this._tank.style.height = attrs.height;
            }
        },

        _renderArrowPointer: function ()
        {
            var path = this._getArrowPathByValue(0);
            this._pointer = this.renderer.path(path, this.pointer.style);
        },

        _renderArrowPointerByValue: function (value)
        {
            var path = this._getArrowPathByValue(value);
            this._pointer = this.renderer.path(path, this.pointer.style);
        },

        _getArrowPathByValue: function (value)
        {
            var border = this._getBorderSize(),
                top = Math.ceil(this._valueToCoordinates(value)) + border,
                left = border,
                offsetLeft = Math.ceil(this._getSize(this.ticksOffset[0], 'width')),
                offsetTop = Math.ceil(this._getSize(this.ticksOffset[1], 'height')),
                offset = Math.ceil(this._getSize(this.pointer.offset)),
                maxSize = Math.ceil(this._getMaxTickSize()),
                size = Math.ceil(this._getSize(this.pointer.size)),
                side = Math.ceil(Math.sqrt((size * size) / 3)),
                path, topProjection, temp;
            if (this.orientation === 'vertical')
            {
                left += offsetLeft + maxSize + offset;
                topProjection = (offset >= 0) ? left + size : left - size;
                path = 'M ' + left + ' ' + top + ' L ' + topProjection + ' ' + (top - side) + ' L ' + topProjection + ' ' + (top + side);
            } else
            {
                var maxLabelSize = this._getMaxLabelSize()["height"];
                left += offsetLeft + maxSize + offset + maxLabelSize;
                if (this._isVML)
                {
                    left -= 2;
                }
                temp = top;
                top = left;
                left = temp;
                topProjection = top - size;

                path = 'M ' + left + ' ' + top + ' L ' + (left - side) + ' ' + topProjection + ' L ' + (left + side) + ' ' + topProjection;
            }
            return path;
        },

        _setValue: function (val)
        {
            if (this.pointer.pointerType === 'default')
            {
                this._performColumnPointerLayout(val);
            } else
            {
                this._performArrowPointerLayout(val);
            }
            this.value = val;
        },

        _performColumnPointerLayout: function (val)
        {
            var bottom, left, height,
                top = this._valueToCoordinates(val),
                border = this._getBorderSize(),
                offsetLeft = this._getSize(this.ticksOffset[0], 'width'),
                offsetTop = this._getSize(this.ticksOffset[1], 'height'),
                maxSize = this._getMaxTickSize(),
                width = this._getSize(this.pointer.size),
                offset = this._getSize(this.pointer.offset),
                attrs = {};

            if (this.int64 !== false)
            {
                bottom = this._valueToCoordinates(this._min64);
            } else
            {
                bottom = this._valueToCoordinates(this.min);
            }
            height = Math.abs(bottom - top);

            if (this.orientation === 'vertical')
            {
                left = offsetLeft + maxSize;
                attrs = { left: left + offset + 1 + border, top: top, height: height, width: width };
            } else
            {
                left = offsetTop + maxSize;
                attrs = { left: bottom, top: left + offset - width - 1 + border, height: width, width: height };
            }
            this._setRectAttrs(attrs);
        },

        _performArrowPointerLayout: function (val)
        {
            var attr = this._getArrowPathByValue(val);
            if (this._isVML)
            {
                if (this._pointer)
                {
                    $(this._pointer).remove();
                }
                this._renderArrowPointerByValue(val);
            } else
            {
                this.renderer.attr(this._pointer, { d: attr });
            }
        },

        _setRectAttrs: function (attrs)
        {
            if (!this._isVML)
            {
                this.renderer.attr(this._pointer, { x: attrs.left });
                this.renderer.attr(this._pointer, { y: attrs.top });
                this.renderer.attr(this._pointer, { width: attrs.width });
                this.renderer.attr(this._pointer, { height: attrs.height });
            } else
            {
                this._pointer.style.top = attrs.top;
                this._pointer.style.left = attrs.left;
                this._pointer.style.width = attrs.width;
                this._pointer.style.height = attrs.height;
            }
        },

        _valueToCoordinates: function (value)
        {
            var border = this._getBorderSize(),
                scaleLength = this._getScaleLength(),
                offsetLeft = this._getSize(this.ticksOffset[0], 'width'),
                offsetTop = this._getSize(this.ticksOffset[1], 'height'),
                current,
                distance,
                length;

            if (this.int64 !== false)
            {
                current = value.subtract(this._min64);
                distance = this._max64.subtract(this._min64);

                if (this.int64 === 's')
                {
                    if (current.isNegative())
                    {
                        current.negate();
                    }
                    if (distance.isNegative())
                    {
                        distance.negate();
                    }
                } else
                {
                    current = current.intPart().abs();
                    distance = distance.abs();
                }

                var currentString = current.toString(),
                    distanceString = distance.toString(),
                    currentFloat, distanceFloat;

                if (distanceString.length > 15)
                {
                    var floatOffset = distanceString.length - 15;
                    distanceString = distanceString.slice(0, 15) + '.' + distanceString.slice(15);
                    distanceFloat = parseFloat(distanceString);

                    if (currentString.length > floatOffset)
                    {
                        var currentOffset = currentString.length - floatOffset;
                        currentString = currentString.slice(0, currentOffset) + '.' + currentString.slice(currentOffset);
                    } else if (currentString.length === floatOffset)
                    {
                        currentString = '0.' + currentString;
                    } else
                    {
                        var prefix = '0.';
                        for (var i = 0; i < floatOffset - currentString.length; i++)
                        {
                            prefix += '0';
                        }
                        currentString = prefix + '' + currentString;
                    }
                    currentFloat = parseFloat(currentString);
                } else
                {
                    if (this.int64 === 's')
                    {
                        currentFloat = current.toNumber();
                        distanceFloat = distance.toNumber();
                    } else
                    {
                        currentFloat = parseFloat(current.toString());
                        distanceFloat = parseFloat(distance.toString());
                    }
                }

                length = (currentFloat / distanceFloat) * scaleLength;
            } else
            {
                current = Math.abs(this.min - value);
                distance = Math.abs(this.max - this.min);
                length = (current / distance) * scaleLength;
            }

            if (this.orientation === 'vertical')
            {
                return this._height - length - (this._height - offsetTop - scaleLength) + border;
            }
            return length + offsetLeft;
        },

        _getSize: function (size, dim)
        {
            dim = dim || (this.orientation === 'vertical' ? 'width' : 'height');
            if (size.toString().indexOf('%') >= 0)
            {
                size = (parseInt(size, 10) / 100) * this['_' + dim];
            }
            size = parseInt(size, 10);
            return size;
        },

        propertiesChangedHandler: function (object, key, value)
        {
            if (value.width && value.height && Object.keys(value).length == 2)
            {
                object.refresh();
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value)
        {
            if (value == oldvalue)
                return;

            if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length == 2)
            {
                return;
            }

            if (key === 'tankStyle' && object.pointer.pointerType === 'arrow')
            {
                return;
            }
            if (key == 'min')
            {
                if (object.int64 === 's')
                {
                    object._min64 = new $.jqx.math().fromString(value.toString(), 10);
                } else if (object.int64 === 'u')
                {
                    object._min64 = new BigNumber(value);
                } else
                {
                    this.min = parseFloat(value);
                }
                $.jqx.aria(this, 'aria-valuemin', value);
            }
            if (key == 'max')
            {
                if (object.int64 === 's')
                {
                    object._max64 = new $.jqx.math().fromString(value.toString(), 10);
                } else if (object.int64 === 'u')
                {
                    object._max64 = new BigNumber(value);
                } else
                {
                    this.max = parseFloat(value);
                }
                $.jqx.aria(this, 'aria-valuemax', value);
            }

            if (key === 'disabled')
            {
                if (value)
                {
                    this.disable();
                } else
                {
                    this.enable();
                }
                $.jqx.aria(this, 'aria-disabled', value);
            } else if (key === 'value')
            {
                if (this._timeout != undefined)
                {
                    clearTimeout(this._timeout);
                    this._timeout = null;
                }
                this.value = oldvalue;
                this.setValue(value);
            } else
            {
                if (key === 'colorScheme')
                {
                    this.pointer.style = null;
                } else if (key === 'orientation' && oldvalue !== value)
                {
                    var temp = this.ticksOffset[0];
                    this.ticksOffset[0] = this.ticksOffset[1];
                    this.ticksOffset[1] = temp;
                }
                if (key !== 'animationDuration' && key !== 'easing')
                {
                    this.refresh();
                }
            }

            if (this.renderer instanceof $.jqx.HTML5Renderer)
                this.renderer.refresh();
        },

        //Constructor functions for property validation
        _backgroundConstructor: function (background, jqx)
        {
            if (this.host)
            {
                return new this._backgroundConstructor(background, jqx);
            }
            var validBackgroundTypes = { rectangle: true, roundedRectangle: true };
            background = background || {};
            this.style = background.style || { stroke: '#cccccc', fill: null };
            if (background.visible || typeof background.visible === 'undefined')
            {
                this.visible = true;
            } else
            {
                this.visible = false;
            }
            if (validBackgroundTypes[background.backgroundType])
            {
                this.backgroundType = background.backgroundType;
            } else
            {
                this.backgroundType = 'roundedRectangle';
            }
            if (this.backgroundType === 'roundedRectangle')
            {
                if (typeof background.borderRadius === 'number')
                {
                    this.borderRadius = background.borderRadius;
                } else
                {
                    this.borderRadius = 15;
                }
            }
            if (typeof background.showGradient === 'undefined')
            {
                this.showGradient = true;
            } else
            {
                this.showGradient = background.showGradient;
            }
        },

        resize: function (width, height)
        {
            this.width = width;
            this.height = height;
            this.refresh();
        },

        _tickConstructor: function (tick, jqx)
        {
            if (this.host)
            {
                return new this._tickConstructor(tick, jqx);
            }
            this.size = jqx._validatePercentage(tick.size, '10%');

            if (tick.interval)
            {
                this.interval = tick.interval;
            } else
            {
                this.interval = 5;
            }

            if (jqx.int64 === 's')
            {
                this._interval64 = new $.jqx.math().fromString(this.interval.toString(), 10);
            } else if (jqx.int64 === 'u')
            {
                this._interval64 = new BigNumber(this.interval);
            } else
            {
                this.interval = parseFloat(this.interval);
            }

            if (tick.number)
            {
                this.number = tick.number;
            } else
            {
                this.number = 5;
            }

            this.style = tick.style || { stroke: '#A1A1A1', 'stroke-width': '1px' };
            if (typeof tick.visible === 'undefined')
            {
                this.visible = true;
            } else
            {
                this.visible = tick.visible;
            }
        },

        _labelsConstructor: function (label, jqx)
        {
            if (this.host)
            {
                return new this._labelsConstructor(label, jqx);
            }
            this.position = label.position;
            if (this.position !== 'far' && this.position !== 'near' && this.position !== 'both')
            {
                this.position = 'both';
            }
            this.formatValue = label.formatValue;
            this.formatSettings = label.formatSettings;
            this.visible = label.visible;
            if (this.visible !== false && this.visible !== true)
            {
                this.visible = true;
            }

            if (label.interval)
            {
                this.interval = label.interval;
            } else
            {
                this.interval = 10;
            }

            if (jqx.int64 === 's')
            {
                this._interval64 = new $.jqx.math().fromString(this.interval.toString(), 10);
            } else if (jqx.int64 === 'u')
            {
                this._interval64 = new BigNumber(this.interval);
            } else
            {
                this.interval = parseFloat(this.interval);
            }

            if (label.number)
            {
                this.number = label.number;
            } else
            {
                this.number = 10;
            }
            this.fontSize = label.fontSize;
            this.fontFamily = label.fontFamily;
            this.fontWeight = label.fontWeight;
            this.fontStyle = label.fontStyle;

            this.offset = jqx._validatePercentage(label.offset, 0);
        },

        _rangeConstructor: function (range, jqx)
        {
            if (this.host)
            {
                return new this._rangeConstructor(range, jqx);
            }

            if (range.startValue)
            {
                this.startValue = range.startValue;
            } else
            {
                this.startValue = jqx.min;
            }
            if (range.endValue)
            {
                this.endValue = range.endValue;
            } else
            {
                this.endValue = jqx.max;
            }

            if (jqx.int64 === 's')
            {
                this._startValue64 = new $.jqx.math().fromString(this.startValue.toString(), 10);
                this._endValue64 = new $.jqx.math().fromString(this.endValue.toString(), 10);

                if (this._endValue64.lessThanOrEqual(this._startValue64))
                {
                    this._endValue64 = this._startValue64.add(new $.jqx.math().fromNumber(1, 10));
                    this.endValue = this._endValue64.toString();
                }
            } else if (jqx.int64 === 'u')
            {
                this._startValue64 = new BigNumber(this.startValue);
                this._endValue64 = new BigNumber(this.endValue);

                if (this._endValue64.compare(this._startValue64) !== 1)
                {
                    this._endValue64 = this._startValue64.add(1);
                    this.endValue = this._endValue64.toString();
                }
            } else
            {
                this.startValue = parseFloat(this.startValue);
                this.endValue = parseFloat(this.endValue);

                if (this.endValue <= this.startValue)
                {
                    this.endValue = this.startValue + 1;
                }
            }

            this.style = range.style || { fill: '#dddddd', stroke: '#dddddd' };
        },

        _pointerConstructor: function (pointer, jqx)
        {
            if (this.host)
            {
                return new this._pointerConstructor(pointer, jqx);
            }
            var color = jqx._getColorScheme(jqx.colorScheme)[0];
            this.pointerType = pointer.pointerType;
            if (this.pointerType !== 'default' && this.pointerType !== 'arrow')
            {
                this.pointerType = 'default';
            }
            this.style = pointer.style || { fill: color, stroke: color, 'stroke-width': 1 };
            this.size = jqx._validatePercentage(pointer.size, '7%');
            this.visible = pointer.visible;
            if (this.visible !== true && this.visible !== false)
            {
                this.visible = true;
            }
            this.offset = jqx._validatePercentage(pointer.offset, 0);
        }

    };

    //Extending with the common functionality
    $.extend(radialGauge, common);
    $.extend(linearGauge, common);

    //Initializing jqxWidgets
    $.jqx.jqxWidget("jqxLinearGauge", "", {});
    $.jqx.jqxWidget("jqxGauge", "", {});

    //Extending the widgets' prototypes
    $.extend($.jqx._jqxGauge.prototype, radialGauge);
    $.extend($.jqx._jqxLinearGauge.prototype, linearGauge);

})(jqxBaseFramework);
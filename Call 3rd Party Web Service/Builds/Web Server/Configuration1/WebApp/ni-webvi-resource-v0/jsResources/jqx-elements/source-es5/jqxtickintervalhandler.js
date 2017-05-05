'use strict';

JQX.Utilities.Assign('TickIntervalHandler', function () {
    function TickIntervalHandler(context, minLabel, maxLabel, labelClass, dimension, integer, logarithmic) {
        babelHelpers.classCallCheck(this, TickIntervalHandler);

        var that = this;

        that.context = context;
        that.minLabel = minLabel;
        that.maxLabel = maxLabel;
        that.labelClass = labelClass;
        that.dimension = dimension;
        that.logarithmic = logarithmic;

        that.labelsSize = that.getMinAndMaxLabelSize();

        if (!integer) {
            that.getNiceInterval = that.getNiceIntervalFloatingPoint;
            that.getPossibleBiggerLabel = that.getPossibleBiggerLabelFloatingPoint;
        } else {
            that.getNiceInterval = that.getNiceIntervalInteger;
            that.getPossibleBiggerLabel = that.getPossibleBiggerLabelInteger;
        }
    }

    babelHelpers.createClass(TickIntervalHandler, [{
        key: 'getInterval',
        value: function getInterval(type, min, max, track) {
            function getSectorArcLength() {
                var arcLength = 2 * Math.PI * radius * (Math.abs(context.startAngle - context.endAngle) / 360); // for angles in degrees
                //let arcLength = Math.abs(context.startAngle - context.endAngle) * radius; // for angles in radians
                return Math.round(arcLength);
            }

            var context = this.context,
                radius = context._measurements.innerRadius;
            var largestLabelSize = void 0,
                multiplier = 1;

            if (type === 'radial') {
                largestLabelSize = Math.max(this.labelsSize.minLabelSize, this.labelsSize.minLabelOtherSize, this.labelsSize.maxLabelSize, this.labelsSize.maxLabelOtherSize);
                multiplier = 1.35;
                if (largestLabelSize === 0) {
                    largestLabelSize = 50; // patch for bug when largestLabelSize = 0
                }
                //multiplier = 5.25 / Math.max(1, Math.log10(radius * 2)); // original formula: 5.25 / Math.Max(1.0, Math.Log10(panelLogicalSize.Height))
            } else {
                largestLabelSize = Math.max(this.labelsSize.minLabelSize, this.labelsSize.maxLabelSize);
                multiplier = 1.45;
            }

            largestLabelSize *= multiplier;
            var trackDimension = void 0;
            if (type === 'radial') {
                trackDimension = getSectorArcLength();
            } else {
                trackDimension = context[this.dimension] - this.labelsSize.minLabelSize / 2 - this.labelsSize.maxLabelSize / 2; // track[this.dimension];
            }
            var divisionCountEstimate = Math.ceil(trackDimension / largestLabelSize),
                minorDivisionCountEstimate = type === 'radial' ? divisionCountEstimate * 4 : divisionCountEstimate * 3;
            var majorInterval = this.getNiceInterval(min, max, divisionCountEstimate, true),
                minorInterval = this.getNiceInterval(min, max, minorDivisionCountEstimate);

            context._cachedLabelsSize = this.labelsSize;

            if (divisionCountEstimate > 2) {
                var possibleSecondLabel = this.getPossibleBiggerLabel(divisionCountEstimate, majorInterval);

                if (possibleSecondLabel.length > Math.max(this.minLabel.length, this.maxLabel.length)) {
                    var oldMinLabel = this.minLabel;
                    this.minLabel = possibleSecondLabel;
                    this.labelsSize = this.getMinAndMaxLabelSize();
                    context._cachedLabelsSize = this.labelsSize;
                    var adjustedResult = this.getInterval(type, min, max, track);
                    this.minLabel = oldMinLabel;
                    this.labelsSize = this.getMinAndMaxLabelSize();
                    return adjustedResult;
                }
            }

            return { major: majorInterval, minor: minorInterval };
        }
    }, {
        key: 'getNiceIntervalFloatingPoint',
        value: function getNiceIntervalFloatingPoint(min, max, divisionCountEstimate, majorInterval) {
            var rangeDelta = max - min,
                exponent = Math.floor(Math.log10(rangeDelta) - Math.log10(divisionCountEstimate));
            var nearestPowerOfTen = Math.pow(10, exponent),
                factor = divisionCountEstimate * nearestPowerOfTen;
            var niceFactor = void 0;
            if (rangeDelta < 2 * factor) {
                niceFactor = 1;
            } else if (rangeDelta < 3 * factor) {
                niceFactor = 2;
            } else if (rangeDelta < 7 * factor) {
                niceFactor = 5;
            } else {
                niceFactor = 10;
            }
            var niceInterval = niceFactor * nearestPowerOfTen;

            if (majorInterval && this.context._range / niceInterval > divisionCountEstimate) {
                switch (niceFactor) {
                    case 5:
                        niceFactor = 10;
                        break;
                    case 2:
                        niceFactor = 5;
                        break;
                    case 1:
                        niceFactor = 2;
                        break;
                }
                niceInterval = niceFactor * nearestPowerOfTen;
            }
            this.nearestPowerOfTen = nearestPowerOfTen;

            if (this.logarithmic && majorInterval) {
                return Math.max(1, niceInterval);
            }
            return niceInterval;
        }
    }, {
        key: 'getPossibleBiggerLabelFloatingPoint',
        value: function getPossibleBiggerLabelFloatingPoint(divisionCountEstimate, majorInterval) {
            var context = this.context;
            var secondValue = parseFloat(context.min - context._numericProcessor.getPreciseModulo(parseFloat(context.min), majorInterval) + parseFloat(majorInterval)),
                currentDrawValue = secondValue,
                largestLabel = void 0,
                currentLabel = void 0;

            if (this.logarithmic) {
                secondValue = Math.pow(10, secondValue);
            }
            largestLabel = context._formatLabel(secondValue);

            for (var i = 1; i < divisionCountEstimate; i++) {
                currentDrawValue = currentDrawValue + majorInterval;
                if (!this.logarithmic) {
                    currentLabel = currentDrawValue;
                } else {
                    currentLabel = Math.pow(10, currentDrawValue);
                }
                currentLabel = context._formatLabel(currentLabel);
                if (currentLabel.length > largestLabel.length) {
                    largestLabel = currentLabel;
                }
            }

            return largestLabel;
        }
    }, {
        key: 'getNiceIntervalInteger',
        value: function getNiceIntervalInteger(min, max, divisionCountEstimate, majorInterval) {
            var rangeDelta = new BigNumber(max).subtract(new BigNumber(min)),
                exponent = Math.floor(Math.log10(rangeDelta.toString()) - Math.log10(divisionCountEstimate)),
                nearestPowerOfTen = new BigNumber(10).pow(new BigNumber(exponent)),
                factor = new BigNumber(divisionCountEstimate).multiply(nearestPowerOfTen);
            var niceFactor = void 0;
            if (rangeDelta.compare(new BigNumber(2 * factor)) === -1) {
                niceFactor = 1;
            } else if (rangeDelta.compare(new BigNumber(3 * factor)) === -1) {
                niceFactor = 2;
            } else if (rangeDelta.compare(new BigNumber(7 * factor)) === -1) {
                niceFactor = 5;
            } else {
                niceFactor = 10;
            }
            var niceInterval = new BigNumber(niceFactor).multiply(nearestPowerOfTen);

            if (majorInterval && new BigNumber(this.context._range).divide(niceInterval).compare(divisionCountEstimate) === 1) {
                switch (niceFactor) {
                    case 5:
                        niceFactor = 10;
                        break;
                    case 2:
                        niceFactor = 5;
                        break;
                    case 1:
                        niceFactor = 2;
                        break;
                }
                niceInterval = new BigNumber(niceFactor).multiply(nearestPowerOfTen);
            }

            if (niceInterval.compare(1) === -1) {
                niceInterval = new BigNumber(1);
            }

            this.nearestPowerOfTen = nearestPowerOfTen;

            return niceInterval;
        }
    }, {
        key: 'getPossibleBiggerLabelInteger',
        value: function getPossibleBiggerLabelInteger(divisionCountEstimate, majorInterval) {
            var context = this.context,
                bigTen = new BigNumber(10);
            var secondValue = new BigNumber(context.min).subtract(new BigNumber(context.min).mod(majorInterval)).add(majorInterval),
                currentDrawValue = secondValue,
                largestLabel = void 0,
                currentLabel = void 0;

            if (this.logarithmic) {
                secondValue = bigTen.pow(secondValue);
            }
            largestLabel = context._formatLabel(secondValue);

            for (var i = 1; i < divisionCountEstimate; i++) {
                currentDrawValue = currentDrawValue.add(majorInterval);
                if (!this.logarithmic) {
                    currentLabel = currentDrawValue;
                } else {
                    currentLabel = bigTen.pow(currentDrawValue);
                }
                currentLabel = context._formatLabel(currentLabel);
                if (currentLabel.length > largestLabel.length) {
                    largestLabel = currentLabel;
                }
            }

            return largestLabel;
        }
    }, {
        key: 'getMinAndMaxLabelSize',
        value: function getMinAndMaxLabelSize() {
            var that = this,
                context = that.context,
                container = context.$.container,
                measureLabel = document.createElement('span');

            measureLabel.className = that.labelClass;
            measureLabel.style.position = 'absolute';
            measureLabel.style.visibility = 'hidden';

            container.appendChild(measureLabel);

            measureLabel.innerHTML = that.minLabel;
            var minLabelSize = measureLabel[that.dimension],
                minLabelOtherSize = measureLabel[context._settings.otherSize];

            measureLabel.innerHTML = that.maxLabel;
            var maxLabelSize = measureLabel[that.dimension],
                maxLabelOtherSize = measureLabel[context._settings.otherSize];

            container.removeChild(measureLabel);

            return { minLabelSize: minLabelSize, minLabelOtherSize: minLabelOtherSize, maxLabelSize: maxLabelSize, maxLabelOtherSize: maxLabelOtherSize };
        }
    }]);
    return TickIntervalHandler;
}());
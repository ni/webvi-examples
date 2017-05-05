/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($)
{
    'use strict';
    $.jqx.jqxWidget('jqxSlider', '', {});

    $.extend($.jqx._jqxSlider.prototype, {
        defineInstance: function ()
        {
            var settings = {
                // Type: Bool
                // Default: false
                // Sets or gets whether the slider is disabled.
                disabled: false,
                // Type: Number/String
                // Default: 300
                // Sets or gets slider's width.
                width: 300,
                // Type: Number/String
                // Default: 30
                // Sets or gets slider's height.
                height: 30,
                // Type: Number
                // Default: 2
                // Sets or gets slide step when the user is using the arrows or the mouse wheel for changing slider's value.
                step: 1,
                // Type: Number
                // Default: 10
                // Sets or gets slider's maximum value.
                max: 10,
                // Type: Number
                // Default: 0
                // Sets or gets slider's minimum value.
                min: 0,
                int64: false, // possible values: false, 'u', 's'
                // Type: String
                // Default: horizontal
                // Sets or gets slider's orientation.
                orientation: 'horizontal',
                // Type: Bool
                // Default: true
                // Sets or gets whether ticks will be shown.
                showTicks: true,
                tickMode: 'default', // possible values: 'default', 'tickNumber'
                tickNumber: 10,
                minorTickNumber: 20,
                niceInterval: false,
                // Type: Number
                // Default: both
                // Sets or gets slider's ticks position. Possible values - 'top', 'bottom', 'both'.
                ticksPosition: 'both',
                // Type: Number
                // Default: 2
                // Sets or gets slider's ticks frequency.
                ticksFrequency: 2,
                minorTicksFrequency: 1,
                showMinorTicks: false,
                // Type: Bool
                // Default: true
                // Sets or gets whether the scroll buttons will be shown.
                showButtons: true,
                // Type: String
                // Default: both
                // Sets or gets scroll buttons position. Possible values 'both', 'left', 'right'.
                buttonsPosition: 'both',
                // Type: String
                // Default: default
                // Sets or gets slider's mode. If the mode is default then the user can use floating values.
                mode: 'default',
                // Type: Bool
                // Default: true
                // Sets or gets whether the slide range is going to be shown.
                showRange: true,
                // Type: Bool
                // Default: false
                // Sets or gets whether the slider is a range slider.
                rangeSlider: false,
                // Type: Number
                // Default: 0
                // Sets or gets slider's value. This poperty will be an object with the following structure { rangeStart: range_start, rangeEnd: range_end } if the
                // slider is range slider otherwise it's going to be a number.
                value: 0,
                // Type: Array
                // Default: [0, 10]
                // Sets or gets range slider's values.
                values: [0, 10],
                // Type: Bool
                // Default: true
                // Sets or gets whether the slider title will be shown.
                tooltip: false,
                tooltipFormatFunction: null,
                tooltipFormatSettings: null,
                // determines the tooltip's position.
                tooltipPosition: 'near',
                tooltipHideDelay: 500,
                // Type: Number/String
                // Default: 11
                // Sets or gets whether the slider buttons size.
                sliderButtonSize: 14,
                // Type: Number/String
                // Default: 5
                // Sets or gets the tick size.
                tickSize: 7,
                minorTickSize: 4,
                showTickLabels: false,
                tickLabelStyleSettings: null,
                tickLabelFormatSettings: null,
                tickLabelFormatFunction: null,
                template: '',
                // mirror
                layout: 'normal',
                rtl: false,
                changeType: null,
                editableLabels: false,
                padding: {},
                // Private properties
                _settings: {
                    'vertical': {
                        'size': 'height',
                        'oSize': 'width',
                        'outerOSize': 'outerWidth',
                        'outerSize': 'outerHeight',
                        'left': 'top',
                        'top': 'left',
                        'start': '_startY',
                        'mouse': '_mouseStartY',
                        'page': 'pageY',
                        'opposite': 'horizontal'
                    },
                    'horizontal': {
                        'size': 'width',
                        'oSize': 'height',
                        'outerOSize': 'outerHeight',
                        'outerSize': 'outerWidth',
                        'left': 'left',
                        'top': 'top',
                        'start': '_startX',
                        'mouse': '_mouseStartX',
                        'page': 'pageX',
                        'opposite': 'vertical'
                    }
                },
                _touchEvents: {
                    'mousedown': $.jqx.mobile.getTouchEventName('touchstart'),
                    'click': $.jqx.mobile.getTouchEventName('touchstart'),
                    'mouseup': $.jqx.mobile.getTouchEventName('touchend'),
                    'mousemove': $.jqx.mobile.getTouchEventName('touchmove'),
                    'mouseenter': 'mouseenter',
                    'mouseleave': 'mouseleave'
                },
                _events: ['change', 'slide', 'slideEnd', 'slideStart', 'created'],
                _invalidArgumentExceptions: {
                    'invalidWidth': 'Invalid width.',
                    'invalidHeight': 'Invalid height.',
                    'invalidStep': 'Invalid step.',
                    'invalidMaxValue': 'Invalid maximum value.',
                    'invalidMinValue': 'Invalid minimum value.',
                    'invalidTickFrequency': 'Invalid tick frequency.',
                    'invalidValue': 'Invalid value.',
                    'invalidValues': 'Invalid values.',
                    'invalidTicksPosition': 'Invalid ticksPosition',
                    'invalidButtonsPosition': 'Invalid buttonsPosition'
                },
                //Containing the last value. This varialbe is used in the _raiseEvent method and it's our criteria for checking
                //whether we need to trigger event.
                _lastValue: [],
                _track: null,
                _leftButton: null,
                _rightButton: null,
                _slider: null,
                _rangeBar: null,
                _slideEvent: null,
                _capturedElement: null,
                _slideStarted: false,
                _helpers: [],
                aria:
                {
                    'aria-valuenow': { name: 'value', type: 'number' },
                    'aria-valuemin': { name: 'min', type: 'number' },
                    'aria-valuemax': { name: 'max', type: 'number' },
                    'aria-disabled': { name: 'disabled', type: 'boolean' }
                }
            };
            $.extend(true, this, settings);
            return settings;
        },

        _createFromInput: function (name)
        {
            var that = this, properties, min, step, max, wrapper, data;
            if (that.element.nodeName.toLowerCase() === 'input')
            {
                that.field = that.element;
                if (that.field.className)
                {
                    that._className = that.field.className;
                }

                properties = {
                    'title': that.field.title
                };

                if (that.field.value)
                {
                    properties.value = that.field.value;
                }
                if (that.field.id.length)
                {
                    properties.id = that.field.id.replace(/[^\w]/g, '_') + '_' + name;
                }
                else
                {
                    properties.id = $.jqx.utilities.createId() + '_' + name;
                }
                if (that.field.getAttribute('min'))
                {
                    min = (that.field.getAttribute('min'));
                    that.min = parseFloat(min);
                }
                if (that.field.getAttribute('step'))
                {
                    step = (that.field.getAttribute('step'));
                    that.step = parseFloat(step);
                }
                if (that.field.getAttribute('max'))
                {
                    max = (that.field.getAttribute('max'));
                    that.max = parseFloat(max);
                }

                wrapper = document.createElement('div');
                if (undefined !== properties.id)
                {
                    wrapper.setAttribute('id', properties.id);
                }
                if (undefined !== properties.value)
                {
                    wrapper.setAttribute('value', properties.value);
                }
                wrapper.style.cssText = that.field.style.cssText;
                if (!that.width)
                {
                    that.width = that.field.offsetWidth;
                }
                if (!that.height)
                {
                    that.height = that.field.offsetHeight;
                }
                that.field.style.display = 'none';
                if (that.field.parentNode)
                {
                    that.field.parentNode.insertBefore(wrapper, that.field.nextSibling);
                }

                data = that.host.data();
                that.host = $(wrapper);
                that.host.data(data);
                that.element = wrapper;
                that.element.id = that.field.id;
                that.field.id = properties.id;
                that._helpers['element'] = new jqxHelper(that.element);
                that._helpers['field'] = new jqxHelper(that.field);
                if (that._className)
                {
                    that._helpers['element'].addClass(that._className);
                    that._helpers['field'].removeClass(that._className);
                }

                if (that.field.tabIndex)
                {
                    var tabIndex = that.field.tabIndex;
                    that.field.tabIndex = -1;
                    that.element.tabIndex = tabIndex;
                }
            }
        },

        createInstance: function (args)
        {
            var that = this;
            that._createFromInput('jqxSlider');
            that._isTouchDevice = $.jqx.mobile.isTouchDevice();

            var sliderStructure = '<div role=\'slider\'><div style=\'width:100%; height: 100%;\'></div></div><div><div></div><div></div><div></div></div><div><div style=\'width:100%; height: 100%;\'></div></div>';
            that.element.innerHTML = sliderStructure;
            that._leftButton = that.element.firstChild;
            that._contentWrapper = that._leftButton.nextSibling;
            that._rightButton = that._contentWrapper.nextSibling;
            that.element.className = that.toThemeProperty('jqx-slider jqx-widget');
            that._topTicks = that._contentWrapper.firstChild;
            that._track = that._topTicks.nextSibling;
            that._bottomTicks = that._track.nextSibling;

            that._leftButton.className = that.toThemeProperty('jqx-slider-left');
            that._rightButton.className = that.toThemeProperty('jqx-slider-left');

            that._helpers['leftButton'] = new jqxHelper(that._leftButton);
            that._helpers['rightButton'] = new jqxHelper(that._rightButton);
            that._helpers['element'] = new jqxHelper(that.element);
            that._helpers['track'] = new jqxHelper(that._track);

            if (!that.host.jqxRepeatButton)
            {
                throw new Error('jqxSlider: Missing reference to jqxbuttons.js.');
            }

            $.jqx.aria(this);

            if (that.int64 === 's')
            {
                if (!$.jqx.longInt)
                {
                    throw new Error('jqxSlider: Missing reference to jqxmath.js');
                }

                // enables signed 64-bit number support
                $.jqx.longInt(that);

                that._value64 = new $.jqx.math().fromString(that.value.toString(), 10);
                that._values64 = [new $.jqx.math().fromString(that.values[0].toString(), 10), new $.jqx.math().fromString(that.values[1].toString(), 10)];
                that._min64 = new $.jqx.math().fromString(that.min.toString(), 10);
                that._max64 = new $.jqx.math().fromString(that.max.toString(), 10);
                that._step64 = new $.jqx.math().fromString(that.step.toString(), 10);
                that._ticksFrequency64 = new $.jqx.math().fromString(that.ticksFrequency.toString(), 10);
                that._minorTicksFrequency64 = new $.jqx.math().fromString(that.minorTicksFrequency.toString(), 10);
            } else if (that.int64 === 'u')
            {
                try
                {
                    new BigNumber(that.value);
                }
                catch (err)
                {
                    throw new Error('jqxSlider: Missing reference to jqxmath.js');
                }

                that._value64 = new BigNumber(that.value);
                that._values64 = [new BigNumber(that.values[0]), new BigNumber(that.values[1])];
                that._min64 = new BigNumber(that.min);
                that._max64 = new BigNumber(that.max);
                that._step64 = new BigNumber(that.step);
                that._ticksFrequency64 = new BigNumber(that.ticksFrequency);
                that._minorTicksFrequency64 = new BigNumber(that.minorTicksFrequency);
            }
            that._helpers['element'].width(that.width);
            that._helpers['element'].height(that.height);
            if (true) // (that._helpers['element'].isRendered())
            {
                $(that._leftButton).jqxRepeatButton({ template: that.template, theme: that.theme, delay: 50, width: that.sliderButtonSize, height: that.sliderButtonSize });
                $(that._rightButton).jqxRepeatButton({ template: that.template, theme: that.theme, delay: 50, width: that.sliderButtonSize, height: that.sliderButtonSize });
                that.render();
            }
            else
            {
                that._helpers['element'].sizeChanged(function ()
                {
                    $(that._leftButton).jqxRepeatButton({ template: that.template, theme: that.theme, delay: 50, width: that.sliderButtonSize, height: that.sliderButtonSize });
                    $(that._rightButton).jqxRepeatButton({ template: that.template, theme: that.theme, delay: 50, width: that.sliderButtonSize, height: that.sliderButtonSize });
                    that.render();
                });
            }
            that._helpers['element'].sizeStyleChanged(function ()
            {
                var size = that._helpers['element'].getSizeFromStyle();
                if (size.width)
                {
                    that.width = size.width;
                }
                if (size.height)
                {
                    that.height = size.height;
                }

                that.__trackSize = null;
                that.__thumbSize = null;
                that._performLayout();
                that._initialSettings();
            });
        },

        render: function ()
        {
            var that = this;
            that._setPaddingValues();
            that._rendering = true;
            that._refresh();
            that._raiseEvent(4, { value: that.getValue() });
            that._addInput();
            var autoTabIndex = that.element.getAttribute('tabindex') == null;
            if (autoTabIndex)
            {
                that.element.setAttribute('tabindex', 0);
            }

            $.jqx.utilities.resize(that.host, function ()
            {
                that.__trackSize = null;
                that.__thumbSize = null;
                that._performLayout();
                that._initialSettings();
            });
            if (that.orientation === 'vertical')
            {
                that.element.style.minWidth = 96 + 'px';
            }
            that._rendering = false;
        },

        focus: function ()
        {
            try
            {
                this.host.focus();
            }
            catch (error)
            {
            }
        },

        destroy: function ()
        {
            var that = this;
            that.removeHandler($(document), 'mouseup.arrow' + that.element.id);
            that.removeHandler($(document), that._getEvent('mouseup') + '.' + that.element.id);
            that.removeHandler($(document), that._getEvent('mousemove') + '.' + that.element.id);

            $.jqx.utilities.resize(this.host, null, true);
            that.host.remove();
            that._helpers = [];
        },

        _addInput: function ()
        {
            var that = this;
            var name = that.element.getAttribute('name');
            var input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            that.element.appendChild(input);

            if (name)
            {
                input.setAttribute('name', name);
            }
            if (!that.rangeSlider)
            {
                input.value = that.value.toString();
            }
            else
            {
                if (that.values)
                {
                    input.value = that.value.rangeStart.toString() + '-' + that.value.rangeEnd.toString();
                }
            }
            that.input = input;
        },

        _getSetting: function (setting)
        {
            return this._settings[this.orientation][setting];
        },

        _getEvent: function (event)
        {
            if (this._isTouchDevice)
            {
                return this._touchEvents[event];
            }
            else
            {
                return event;
            }
        },

        refresh: function (initialRefresh)
        {
            if (!initialRefresh)
            {
                this._refresh();
            }
        },

        _refresh: function ()
        {
            var that = this;
            that._render();
            that._performLayout();
            that._removeEventHandlers();
            that._addEventHandlers();
            that._initialSettings();
        },

        _render: function ()
        {
            var that = this;
            that._addTrack();
            that._addSliders();
            that._addTickContainers();
            that._updateButtonsVisibility();
            that._addRangeBar();
        },

        _addTrack: function ()
        {
            var that = this;
            var trackElement = that._track;

            that._helpers["track"].addClass(that.toThemeProperty('jqx-slider-track'));
            trackElement.setAttribute('style', '');
            that._helpers["track"].removeClass(that.toThemeProperty('jqx-slider-track-' + that._getSetting('opposite')));
            that._helpers["track"].addClass(that.toThemeProperty('jqx-slider-track-' + that.orientation));
            that._helpers["track"].addClass(that.toThemeProperty('jqx-fill-state-normal jqx-rc-all'));
        },

        _addSliders: function ()
        {
            var that = this;
            if (that._slider === null || that._slider.length < 1)
            {
                that._slider = {};
                var leftSlider = document.createElement('div');
                var rightSlider = document.createElement('div');
                leftSlider.className = that.toThemeProperty('jqx-slider-slider');
                rightSlider.className = that.toThemeProperty('jqx-slider-slider');
                that._slider.left = leftSlider;
                that._track.appendChild(leftSlider);
                that._slider.right = rightSlider;
                that._track.appendChild(rightSlider);

                that._helpers['track'] = new jqxHelper(that._track);
                that._helpers['left'] = new jqxHelper(that._slider.left);
                that._helpers['right'] = new jqxHelper(that._slider.right);

                if (that.template)
                {
                    that._helpers['left'].addClass(that.toThemeProperty('jqx-' + that.template));
                    that._helpers['right'].addClass(that.toThemeProperty('jqx-' + that.template));
                }
            }
            that._helpers['left'].removeClass(that.toThemeProperty('jqx-slider-slider-' + that._getSetting('opposite')));
            that._helpers['left'].addClass(that.toThemeProperty('jqx-slider-slider-' + that.orientation));
            that._helpers['right'].removeClass(that.toThemeProperty('jqx-slider-slider-' + that._getSetting('opposite')));
            that._helpers['right'].addClass(that.toThemeProperty('jqx-slider-slider-' + that.orientation));
            that._helpers['right'].addClass(that.toThemeProperty('jqx-fill-state-normal'));
            that._helpers['left'].addClass(that.toThemeProperty('jqx-fill-state-normal'));
        },

        _addTickContainers: function ()
        {
            var that = this;
            that._bottomTicks.className = that.toThemeProperty('jqx-slider-tickscontainer');
            that._topTicks.className = that.toThemeProperty('jqx-slider-tickscontainer');

            var type = 'visible';
            if (!that.showTicks)
            {
                type = 'hidden';
            }
            that._bottomTicks.style.visibility = type;
            that._topTicks.style.visibility = type;
        },

        _updateButtonsVisibility: function ()
        {
            var that = this;
            var type = 'block';
            if (!that.showButtons || that.rangeSlider)
            {
                type = 'none';
            }
            that._rightButton.style.display = type;
            that._leftButton.style.display = type;
        },

        // gets the 'nice interval'
        _getNiceInterval: function (minorTicks)
        {
            function log10(val)
            {
                return Math.log(parseFloat(val)) / Math.LN10;
            }

            var that = this, niceFactor,
                dimension = 'Width';
            if (that.orientation === 'vertical')
            {
                dimension = 'Height';
            }

            var labelDummy = document.createElement('span');
            labelDummy.className = that.toThemeProperty('jqx-widget jqx-slider-label');
            labelDummy.style.position = 'absolute';
            labelDummy.style.visibility = 'hidden';
            if (that.tickLabelStyleSettings)
            {
                var tickLabelStyleSettings = that.tickLabelStyleSettings;
                labelDummy.style.fontSize = tickLabelStyleSettings.fontSize;
                labelDummy.style.fontFamily = tickLabelStyleSettings.fontFamily;
                labelDummy.style.fontWeight = tickLabelStyleSettings.fontWeight;
                labelDummy.style.fontStyle = tickLabelStyleSettings.fontStyle;
            }

            var min, max;

            min = that._formatLabel(that.min);
            max = that._formatLabel(that.max);

            var browserRoundingFix = $.jqx.browser.msie ? 0 : 1; // algorithm adjustment (for browsers other than Internet Explorer)
            document.body.appendChild(labelDummy);
            labelDummy.innerHTML = min;
            var minLabelDimension = labelDummy['scroll' + dimension] + browserRoundingFix;
            labelDummy.innerHTML = max;
            var maxLabelDimension = labelDummy['scroll' + dimension] + browserRoundingFix;
            labelDummy.parentNode.removeChild(labelDummy);
            var largestLabelSize = Math.max(maxLabelDimension, minLabelDimension),
                largeLabelsAdjustment = 0;
            if (largestLabelSize > 105)
            {
                largeLabelsAdjustment = (largestLabelSize - 105) / 100;
            }
            largestLabelSize *= 1.5 + largeLabelsAdjustment; // algorithm adjustment
            var trackDimension = that._getTrackSize();
            if (trackDimension > 64 && that.showButtons === false)
            {
                trackDimension -= 64;
            }
            var divisionCountEstimate = Math.round(trackDimension / largestLabelSize),
                rangeDelta, exponent, nearestPowerOfTen, factor, niceInterval;

            if (divisionCountEstimate === 0)
            {
                divisionCountEstimate = 1;
            }

            if (minorTicks === true)
            {
                divisionCountEstimate *= 4;
            }

            if (that.int64 === false)
            {
                rangeDelta = that.max - that.min;
                exponent = Math.floor(log10(rangeDelta) - log10(divisionCountEstimate));
                nearestPowerOfTen = Math.pow(10, exponent);
                factor = divisionCountEstimate * nearestPowerOfTen;
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
            }
            else
            {
                rangeDelta = new BigNumber(that.max).subtract(new BigNumber(that.min));
                exponent = Math.floor(log10(rangeDelta.toString()) - log10(divisionCountEstimate));
                nearestPowerOfTen = new BigNumber(10).pow(new BigNumber(exponent));
                factor = new BigNumber(divisionCountEstimate).multiply(nearestPowerOfTen);
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

        _formatLabel: function (value, tooltip)
        {
            var that = this,
                formatFunction = tooltip !== true ? that['tickLabelFormatFunction'] : that['tooltipFormatFunction'],
                formatSettings = tooltip !== true ? that['tickLabelFormatSettings'] : that['tooltipFormatSettings'],
                formattedValue;

            if (formatFunction)
            {
                formattedValue = formatFunction(value);
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
                            formattedValue = Number(Number(value).toPrecision(formatSettings.digits)).toString();
                        }
                    }
                }
            } else
            {
                formattedValue = value;
            }

            return formattedValue;
        },

        _addTicks: function (container, side)
        {
            var that = this;

            if (!that.showTicks)
            {
                return;
            }

            var width = parseInt(container.style[that._getSetting('size')], 10), number,
                normalLayout = (that.layout === 'normal' && that.orientation === 'horizontal' && that.rtl === false) || (that.layout === 'reverse' && that.orientation === 'vertical'),
                htmlValue, ticksFrequency, minorTicksFrequency, count, tickscount, minorTicksCount, minorTicksDistance, min, max, dimensionValue, i, plot;
            var ticks = '';

            if (that.int64 === false)
            {
                count = that.max - that.min;
                if (that.tickMode === 'default')
                {
                    if (that.niceInterval)
                    {
                        ticksFrequency = that._getNiceInterval();
                        minorTicksFrequency = that._getNiceInterval(true);
                    } else
                    {
                        ticksFrequency = that.ticksFrequency;
                        minorTicksFrequency = that.minorTicksFrequency;
                    }
                    tickscount = Math.round(count / ticksFrequency);
                    minorTicksCount = Math.round(count / minorTicksFrequency);
                } else if (that.tickMode === 'tickNumber')
                {
                    tickscount = that.tickNumber;
                    minorTicksCount = that.minorTickNumber;
                    ticksFrequency = Math.round(count / tickscount);
                }
                min = that.min;
                max = that.max;
            } else if (that.int64 === 's')
            {
                count = that._max64.subtract(that._min64);
                if (that.tickMode === 'default')
                {
                    if (that.niceInterval)
                    {
                        ticksFrequency = that._getNiceInterval();
                        minorTicksFrequency = that._getNiceInterval(true);
                    } else
                    {
                        ticksFrequency = that._ticksFrequency64;
                        minorTicksFrequency = that._minorTicksFrequency64;
                    }
                    tickscount = count.div(ticksFrequency).toNumber();
                    minorTicksCount = count.div(minorTicksFrequency).toNumber();
                } else if (that.tickMode === 'tickNumber')
                {
                    tickscount = that.tickNumber;
                    minorTicksCount = that.minorTickNumber;
                    ticksFrequency = count.div(new $.jqx.math().fromNumber(tickscount));
                }
                min = that._min64.toString();
                max = that._max64.toString();
            } else if (that.int64 === 'u')
            {
                count = that._max64.subtract(that._min64);
                if (that.tickMode === 'default')
                {
                    if (that.niceInterval)
                    {
                        ticksFrequency = that._getNiceInterval();
                        minorTicksFrequency = that._getNiceInterval(true);
                    } else
                    {
                        ticksFrequency = that._ticksFrequency64;
                        minorTicksFrequency = that._minorTicksFrequency64;
                    }
                    tickscount = parseInt(count.divide(ticksFrequency).toString(), 10);
                    minorTicksCount = parseInt(count.divide(minorTicksFrequency).toString(), 10);
                } else if (that.tickMode === 'tickNumber')
                {
                    tickscount = that.tickNumber;
                    minorTicksCount = that.minorTickNumber;
                    ticksFrequency = count.divide(new BigNumber(tickscount)).intPart();
                }
                min = that._min64.toString();
                max = that._max64.toString();
            }

            var distance = width / tickscount;

            minorTicksDistance = width / minorTicksCount;

            container.innerHTML = '';

            if (normalLayout)
            {
                htmlValue = that._formatLabel(min);
            }
            else
            {
                htmlValue = that._formatLabel(max);
            }

            var span = document.createElement('span');
            span.style.visibility = 'hidden';
            span.className = that.toThemeProperty('jqx-widget jqx-widget-content jqx-slider');
            if (that.tickLabelStyleSettings)
            {
                var tickLabelStyleSettings = that.tickLabelStyleSettings;
                span.style.fontSize = tickLabelStyleSettings.fontSize;
                span.style.fontFamily = tickLabelStyleSettings.fontFamily;
                span.style.fontWeight = tickLabelStyleSettings.fontWeight;
                span.style.fontStyle = tickLabelStyleSettings.fontStyle;
            }
            document.body.appendChild(span);
            span.innerHTML = '0';
            var spanSize = { width: span.offsetWidth, height: span.offsetHeight };
            span.parentNode.removeChild(span);

            var size = parseInt(container.style[that._getSetting('oSize')], 10);
            var leftPadding = that.orientation === 'horizontal' ? that.padding.left : 0;
            ticks += that._addTick(container, leftPadding, that.min, size, htmlValue, spanSize, false, side);


            var labelDummy = document.createElement('span');
            labelDummy.className = that.toThemeProperty('jqx-widget');
            labelDummy.style.position = 'absolute';
            labelDummy.style.visibility = 'hidden';


            document.body.appendChild(labelDummy);
            labelDummy.innerHTML = that.min.toString();
            dimensionValue = that.orientation === 'horizontal' ? labelDummy.offsetWidth : labelDummy.offsetHeight;

            var distanceModifier = 0,
                distanceFromFirstToSecond = 0;

            if (that.tickMode === 'default' && that.niceInterval === true)
            { // special case for second tick (and label) when niceInterval is enabled
                var first, second;

                if (that.int64 === false)
                {
                    if (normalLayout)
                    {
                        first = that.min;
                        second = first - (first % ticksFrequency) + ticksFrequency;
                        distanceModifier = second - first;
                    } else
                    {
                        first = that.max;
                        second = first - (first % ticksFrequency);
                        distanceModifier = first - second;
                    }
                    distanceFromFirstToSecond = distanceModifier / ticksFrequency * distance;
                } else
                {
                    var ticksFrequencyBigNumber = new BigNumber(ticksFrequency.toString());
                    if (normalLayout)
                    {
                        first = new BigNumber(that.min);
                        second = first.subtract(first.mod(ticksFrequencyBigNumber)).add(ticksFrequencyBigNumber);
                        distanceModifier = second.subtract(first);
                    } else
                    {
                        first = new BigNumber(that.max);
                        second = first.subtract(first.mod(ticksFrequencyBigNumber));
                        distanceModifier = first.subtract(second);
                    }
                    distanceFromFirstToSecond = parseFloat(distanceModifier.divide(ticksFrequencyBigNumber).multiply(distance).toString());
                }
                var plotSecond = true;
                if (dimensionValue >= distanceFromFirstToSecond)
                {
                    plotSecond = false;
                }

                if (second.toString() !== that.max.toString() && distanceFromFirstToSecond < width)
                {
                    // second item rendering
                    var secondItemHtmlValue = that._formatLabel(second.toString());
                    ticks += that._addTick(container, distanceFromFirstToSecond + leftPadding, second, size, secondItemHtmlValue, spanSize, false, side, plotSecond);
                }
            }

            for (i = 1; i < tickscount; i++)
            {
                number = i * distance + distanceFromFirstToSecond;
                number = Math.floor(number);
                var value;
                if (that.int64 === false)
                {
                    if (normalLayout)
                    {
                        value = that.min + ticksFrequency * i + distanceModifier;
                    } else
                    {
                        value = that.max - ticksFrequency * i - distanceModifier;
                    }
                } else if (that.int64 === 's')
                {
                    if (normalLayout)
                    {
                        value = that._min64.add(ticksFrequency.multiply(new $.jqx.math().fromString(i.toString(), 10))).add(new $.jqx.math().fromString(distanceModifier.toString(), 10)).toString();
                    } else
                    {
                        value = that._max64.subtract(ticksFrequency.multiply(new $.jqx.math().fromString(i.toString(), 10))).subtract(new $.jqx.math().fromString(distanceModifier.toString(), 10)).toString();
                    }
                } else if (that.int64 === 'u')
                {
                    if (normalLayout)
                    {
                        value = that._min64.add(ticksFrequency.multiply(i)).add(distanceModifier).toString();
                    } else
                    {
                        value = that._max64.subtract(ticksFrequency.multiply(i)).subtract(distanceModifier).toString();
                    }
                }
                if (value.toString() !== that.max.toString())
                {
                    htmlValue = that._formatLabel(value.toString()),
                        plot = true;

                    if (that.tickMode === 'default' && that.niceInterval === true)
                    {
                        labelDummy.innerHTML = htmlValue;
                        dimensionValue = that.orientation === 'horizontal' ? labelDummy.offsetWidth : labelDummy.offsetHeight;

                        if (number + dimensionValue >= tickscount * distance)
                        {
                            plot = false; // does not plot the second to last label if it intersects with the last one
                        }
                    }

                    ticks += that._addTick(container, number + leftPadding, i, size, htmlValue, spanSize, false, side, plot);
                }
            }
            if (that.showMinorTicks)
            {
                for (i = 1; i < minorTicksCount; i++)
                {
                    number = i * minorTicksDistance;
                    number = Math.floor(number);
                    //                    var value = that.min + that.minorTicksFrequency * i;
                    htmlValue = '';
                    ticks += that._addTick(container, number + leftPadding, i, size, htmlValue, spanSize, true, side);
                }
            }

            if (normalLayout)
            {
                htmlValue = that._formatLabel(max);
            }
            else
            {
                htmlValue = that._formatLabel(min);
            }
            ticks += that._addTick(container, tickscount * distance + leftPadding, that.max, size, htmlValue, spanSize, false, side);
            container.innerHTML = ticks;
            labelDummy.parentNode.removeChild(labelDummy);
        },

        _addTick: function (container, position, value, size, htmlValue, spanSize, minorTick, side, plot)
        {
            var that = this;
            var cssClass = '', pos;
            cssClass = that.toThemeProperty('jqx-slider-tick');
            cssClass += ' ' + that.toThemeProperty('jqx-fill-state-pressed');
            if (that.template)
            {
                cssClass += ' ' + that.toThemeProperty('jqx-' + that.template);
            }
            var currentTick;
            var top = that._getSetting('top');
            var topValue = '2px';
            var tickSize = that.tickSize;
            if (minorTick)
            {
                tickSize = that.minorTickSize;
            }
            if (container !== that._bottomTicks)
            {
                topValue = size - tickSize - 2 + 'px';
            }

            if (that.orientation === 'horizontal')
            {
                currentTick = '<div style="' + top + ': ' + topValue + '; ' + that._getSetting('oSize') + ':  ' + tickSize + 'px; float: left; position:absolute; left:' + position +
                                'px;" class="' + that.toThemeProperty('jqx-slider-tick-horizontal') + ' ' + cssClass + '"></div>';
                if (that.showTickLabels)
                {
                    if (container !== that._bottomTicks)
                    {
                        topValue = size - tickSize - spanSize.height - 2 + 'px';
                    }
                    else
                    {
                        topValue = 2 + tickSize + 'px';
                    }

                    var w = spanSize.width * htmlValue.toString().length;
                    w = w / 2;
                    pos = position - w;
                    if (plot !== false)
                    {
                        var fontSize = '',
                            fontFamily = '',
                            fontWeight = '',
                            fontStyle = '';
                        if (that.tickLabelStyleSettings)
                        {
                            var tickLabelStyleSettings = that.tickLabelStyleSettings;
                            if (tickLabelStyleSettings.fontSize)
                            {
                                fontSize = tickLabelStyleSettings.fontSize;
                            }
                            if (tickLabelStyleSettings.fontFamily)
                            {
                                fontFamily = tickLabelStyleSettings.fontFamily;
                            }
                            if (tickLabelStyleSettings.fontWeight)
                            {
                                fontWeight = tickLabelStyleSettings.fontWeight;
                            }
                            if (tickLabelStyleSettings.fontStyle)
                            {
                                fontStyle = tickLabelStyleSettings.fontStyle;
                            }
                        }
                        currentTick += '<div class="' + that.toThemeProperty('jqx-slider-label jqx-slider-label-' + side) +
                            '" style="' + top + ': ' + topValue + '; float: left; position:absolute; left:' + pos + 'px; white-space: nowrap; ' +
                            'font-size: ' + fontSize + '; font-family: ' + fontFamily + '; font-weight: ' + fontWeight + '; font-style: ' + fontStyle + '">' +
                            htmlValue + '</div>';
                    }
                }
            } else
            {
                currentTick = '<div style="' + top + ': ' + topValue + '; ' + that._getSetting('oSize') + ':  ' + tickSize + 'px; float: none; position:absolute; top:' + position +
                                'px;" class="' + that.toThemeProperty('jqx-slider-tick-vertical') + ' ' + cssClass + '"></div>';
                if (that.showTickLabels)
                {
                    if (container !== that._bottomTicks)
                    {
                        topValue = size - tickSize - htmlValue.toString().length * spanSize.width - 6 + 'px';
                    }
                    else
                    {
                        topValue = 6 + tickSize + 'px';
                    }
                    var h = spanSize.height;
                    h = h / 2;
                    pos = position - h;
                    if (plot !== false)
                    {
                        currentTick += '<div class="' + that.toThemeProperty('jqx-slider-label jqx-slider-label-' + side) + '" style="' + top + ': ' + topValue + '; float: none; position:absolute; top:' + pos + 'px;">' + htmlValue + '</div>';
                    }
                }
            }
            return currentTick;
        },

        _addRangeBar: function ()
        {
            var that = this;
            if (that._rangeBar === null || that._rangeBar.length < 1)
            {
                that._rangeBar = document.createElement('div');
                that._rangeBar.className = that.toThemeProperty('jqx-slider-rangebar jqx-fill-state-pressed jqx-rc-all');
                if (that.template)
                {
                    that._rangeBar.className += ' ' + that.toThemeProperty('jqx-' + that.template);
                }

                that._helpers['rangeBar'] = new jqxHelper(that._rangeBar);
                that._track.appendChild(that._rangeBar);
            }
            if (!that.showRange)
            {
                that._rangeBar.style.display = 'none';
            } else
            {
                that._rangeBar.style.display = 'block';
            }

            that._thumbSize = that._slider.left.offsetWidth;
        },

        _getLeftDisplacement: function ()
        {
            if (!this.showButtons)
            {
                return 0;
            }
            if (this.rangeSlider)
            {
                return 0;
            }
            switch (this.buttonsPosition)
            {
                case 'left':
                    return this._leftButton[this._getSetting('outerSize')](true) + this._rightButton[this._getSetting('outerSize')](true);
                case 'right':
                    return 0;
                default:
                    return this._leftButton[this._getSetting('outerSize')](true);
            }
            return 0;
        },

        _performLayout: function ()
        {
            var that = this;
            if (that.width !== null && that.width.toString().indexOf('px') !== -1)
            {
                that.element.style.width = parseInt(that.width, 10) + 'px';
            }
            else
                if (that.width !== undefined && !isNaN(that.width))
                {
                    that.element.style.width = parseInt(that.width, 10) + 'px';
                }

            if (that.height !== null && that.height.toString().indexOf('px') !== -1)
            {
                that.element.style.height = parseInt(that.height, 10) + 'px';
            }
            else if (that.height !== undefined && !isNaN(that.height))
            {
                that.element.style.height = parseInt(that.height, 10) + 'px';
            }

            var isPercentage = false;
            if (that.width !== null && that.width.toString().indexOf('%') !== -1)
            {
                isPercentage = true;
                that._helpers['element'].width(that.width);
            }

            if (that.height !== null && that.height.toString().indexOf('%') !== -1)
            {
                isPercentage = true;
                that._helpers['element'].height(that.height);
            }
            var size = that._helpers['element'].innerHeight();
            if (that._getSetting('size') === 'width')
            {
                size = that._helpers['element'].innerWidth();
            }

            that._performButtonsLayout();
            that._performTrackLayout(size - 4);
            that._contentWrapper.style[that._getSetting('size')] = that._track.style[that._getSetting('size')];
            that._contentWrapper.style[that._getSetting('oSize')] = that.element.style[that._getSetting('oSize')];
            that._performTicksLayout();
            that._performRangeBarLayout();
            var padding = that.padding;
            if (that.orientation === 'horizontal')
            {
                that._contentWrapper.style.position = 'absolute';
                that._contentWrapper.style.left = '0px';
                that._contentWrapper.style.top = '0px';

                if (that.showButtons && !that.rangeSlider)
                {
                    that._contentWrapper.style.left = 1 + that._helpers['leftButton'].outerWidth() + 'px';
                    that._leftButton.style.left = padding.left + 'px';
                    that._rightButton.style.right = padding.right + 'px';
                    if (that.buttonsPosition === 'left')
                    {
                        that._contentWrapper.style.left = 2 + 2 * that._helpers['leftButton'].innerWidth() + that._helpers['left'].innerWidth() / 2 + 'px';
                        that._rightButton.style.left = 1 + that._helpers['leftButton'].innerWidth() + 'px';
                    }
                    else if (that.buttonsPosition === 'right')
                    {
                        that._contentWrapper.style.left = that._helpers['left'].innerWidth() / 2 + 'px';
                        that._leftButton.style.left = '';
                        that._leftButton.style.right = 1 + padding.right + that._helpers['leftButton'].innerWidth() + 'px';
                        that._rightButton.style.right = that._leftButton.style.right - that._helpers['leftButton'].innerWidth() + 'px';
                    }
                }
                if (!that.showButtons || that.rangeSlider)
                {
                    var offset = (2 + Math.ceil(that.sliderButtonSize / 2));
                    that._contentWrapper.style.left = offset + 'px';
                }
            }
            else
            {
                that._contentWrapper.style.position = 'absolute';
                that._contentWrapper.style.left = '0px';
                that._contentWrapper.style.top = '0px';

                if (that.showButtons && !that.rangeSlider)
                {
                    that._contentWrapper.style.top = 1 + that._helpers['leftButton'].outerHeight() + 'px';
                    that._leftButton.style.top = '0px';
                    that._rightButton.style.bottom = '0px';
                    that._leftButton.style.left = '';
                    that._leftButton.style.right = '';
                    that._rightButton.style.left = '';
                    that._rightButton.style.right = '';

                    if (that.buttonsPosition === 'left')
                    {
                        that._contentWrapper.style.top = 2 + 2 * that._helpers['leftButton'].innerHeight() + that._helpers['left'].innerHeight() / 2 + 'px';
                        that._rightButton.style.top = 1 + that._helpers['leftButton'].innerHeight() + 'px';
                    }
                    else if (that.buttonsPosition === 'right')
                    {
                        that._contentWrapper.style.top = that._helpers['left'].innerHeight() / 2 + 'px';
                        that._leftButton.style.top = '';
                        that._leftButton.style.bottom = 1 + that._helpers['leftButton'].innerHeight() + 'px';
                        that._rightButton.style.bottom = that._leftButton.style.bottom - that._helpers['leftButton'].innerHeight() + 'px';
                    }
                }
                if (!that.showButtons || that.rangeSlider)
                {
                    var offset = (2 + Math.ceil(that.sliderButtonSize / 2));
                    that._contentWrapper.style.top = offset + 'px';
                }
            }

            if (that.rangeSlider)
            {
                that._slider.left.style.visibility = 'visible';
            } else
            {
                that._slider.left.style.visibility = 'hidden';
            }
            that._refreshRangeBar();
            if (that.orientation === 'vertical')
            {
                if (that.showButtons)
                {
                    var centerLeft = (that._leftButton.offsetWidth - that._track.offsetWidth) / 2;
                    that._track.style.marginLeft = 1 + 'px';
                }
            }
            that._editableLabels();
        },

        _performTrackLayout: function (size)
        {
            var that = this;
            var trackSize = size;
            if (that.showButtons && !that.rangeSlider)
            {
                if (that.orientation === 'horizontal')
                {
                    trackSize -= (that._helpers['leftButton'].innerWidth() + that._helpers['rightButton'].innerWidth());
                }
                else
                {
                    trackSize -= (that._helpers['leftButton'].innerHeight() + that._helpers['rightButton'].innerHeight());
                }
            }

            if (that.rangeSlider || !that.showButtons)
            {
                var offset = (2 + Math.ceil(that.sliderButtonSize / 2));
                trackSize = size - 2 * offset;
            }

            if (that.orientation === 'horizontal')
            {
                trackSize = trackSize - (that.padding.left + that.padding.right);
                trackSize -= that._helpers['left'].outerWidth() - 2;
            }
            else
            {
                trackSize -= that._helpers['left'].outerHeight() - 2;
            }

            that._track.style[that._getSetting('size')] = trackSize + 'px';
            that._track.style.left = that.padding.left + 'px';
            that._slider.left.style.left = '0px';
            that._slider.left.style.top = '0px';
            that._slider.right.style.left = '0px';
            that._slider.right.style.top = '0px';
        },

        _performTicksLayout: function ()
        {
            var that = this;
            that._performTicksContainerLayout();
            that._addTicks(this._topTicks, 'top');
            that._addTicks(this._bottomTicks, 'bottom');
            that._topTicks.style.visibility = 'hidden';
            that._bottomTicks.style.visibility = 'hidden';
            if ((that.ticksPosition === 'top' || that.ticksPosition === 'both') && that.showTicks)
            {
                that._topTicks.style.visibility = 'visible';
            }
            if ((that.ticksPosition === 'bottom' || that.ticksPosition === 'both') && that.showTicks)
            {
                that._bottomTicks.style.visibility = 'visible';
            }
        },

        _performTicksContainerLayout: function ()
        {
            var that = this;
            var tickSize;

            if (that.orientation === 'horizontal')
            {
                that._topTicks.style.width = that._track.style.width;
                that._bottomTicks.style.width = that._track.style.width;

                tickSize = -2 + (parseInt(that.element.style.height, 10) - that._helpers['track'].outerHeight()) / 2;
                that._topTicks.style.height = tickSize + 'px';
                that._bottomTicks.style.height = tickSize + 'px';

                that._topTicks.style['float'] = 'none';
                that._track.style['float'] = 'none';
                that._bottomTicks.style['float'] = 'none';
            }
            else
            {
                that._topTicks.style.height = that._track.style.height;
                that._bottomTicks.style.height = that._track.style.height;

                tickSize = -2 + (parseInt(that.element.style.width, 10) - that._helpers['track'].outerWidth()) / 2;
                that._topTicks.style.width = tickSize + 'px';
                that._bottomTicks.style.width = tickSize + 'px';

                that._topTicks.style['float'] = 'left';
                that._track.style['float'] = 'left';
                that._bottomTicks.style['float'] = 'left';
            }
        },

        _performButtonsLayout: function ()
        {
            this._updateButtonsVisibilityStyles();
            this._updateButtonsVisibilityClasses();
            this._updateButtonsVisibilityHover();
            this._centerElement(this._rightButton);
            this._centerElement(this._leftButton);

            this._layoutButtons();
        },

        _centerElement: function (element)
        {
            var obj = new jqxHelper(element);
            element.style.marginLeft = '0px';
            element.style.marginTop = '0px';
            element.style.marginRight = '0px';
            element.style.marginBottom = '0px';

            var displacement = (parseFloat(this.element.style[this._getSetting('oSize')]) - parseFloat(obj[this._getSetting('outerOSize')]())) / 2;

            if (this.orientation === 'horizontal')
            {
                element.style.marginLeft = '0px';
                element.style.marginTop = displacement + 'px';
            }
            else
            {
                element.style.marginTop = '0px;';
                element.style.marginLeft = displacement + 'px';
            }
            return element;
        },

        _updateButtonsVisibilityStyles: function ()
        {
            var that = this;
            that._leftButton.style.backgroundPosition = 'center';
            that._rightButton.style.backgroundPosition = 'center';
            if (that.orientation === 'vertical')
            {
                that._leftButton.style['float'] = 'none';
                that._rightButton.style['float'] = 'none';
            }
            that._leftButton.style['position'] = 'absolute';
            that._rightButton.style['position'] = 'absolute';
        },

        _updateButtonsVisibilityClasses: function ()
        {
            var that = this;
            var icons = { prev: 'left', next: 'right' };
            if (that.orientation === 'vertical')
            {
                icons = { prev: 'up', next: 'down' };
            }
            that._helpers['leftButton'].addClass(that.toThemeProperty('jqx-rc-all jqx-slider-button'));
            that._helpers['rightButton'].addClass(that.toThemeProperty('jqx-rc-all jqx-slider-button'));

            that._leftArrow = that._leftButton.firstChild;
            that._rightArrow = that._rightButton.firstChild;

            that._helpers['leftArrow'] = new jqxHelper(that._leftArrow);
            that._helpers['rightArrow'] = new jqxHelper(that._rightArrow);

            that._helpers['leftArrow'].removeClass(that.toThemeProperty('jqx-icon-arrow-left'));
            that._helpers['rightArrow'].removeClass(that.toThemeProperty('jqx-icon-arrow-right'));
            that._helpers['leftArrow'].removeClass(that.toThemeProperty('jqx-icon-arrow-up'));
            that._helpers['rightArrow'].removeClass(that.toThemeProperty('jqx-icon-arrow-down'));

            that._helpers['leftArrow'].addClass(that.toThemeProperty('jqx-icon-arrow-' + icons.prev));
            that._helpers['rightArrow'].addClass(that.toThemeProperty('jqx-icon-arrow-' + icons.next));
        },

        _updateButtonsVisibilityHover: function ()
        {
            var that = this, icons = { prev: 'left', next: 'right' };
            if (that.orientation === 'vertical')
            {
                icons = { prev: 'up', next: 'down' };
            }

            that.removeHandler($(document), 'mouseup.arrow' + that.element.id);
            that.addHandler($(document), 'mouseup.arrow' + that.element.id, function ()
            {
                that._helpers['leftArrow'].removeClass(that.toThemeProperty('jqx-icon-arrow-' + icons.prev + '-selected'));
                that._helpers['rightArrow'].removeClass(that.toThemeProperty('jqx-icon-arrow-' + icons.next + '-selected'));
                if (that.sliderTooltip)
                {
                    if (that.sliderTooltipTimer)
                    {
                        clearTimeout(that.sliderTooltipTimer);
                    }

                    that.sliderTooltipTimer = setTimeout(function ()
                    {
                        that.sliderTooltipObj.fadeOut('fast');
                        that._mouseDown = false;
                    }, that.tooltipHideDelay);
                }
                else
                {
                    that._mouseDown = false;
                }
            });

            that.removeHandler(that._leftButton, 'mousedown.' + that.element.id);
            that.removeHandler(that._leftButton, 'mouseup.' + that.element.id);
            that.removeHandler(that._leftButton, 'mouseenter.' + that.element.id);
            that.removeHandler(that._leftButton, 'mouseleave.' + that.element.id);

            that.removeHandler(that._rightButton, 'mousedown.' + that.element.id);
            that.removeHandler(that._rightButton, 'mouseup.' + that.element.id);
            that.removeHandler(that._rightButton, 'mouseenter.' + that.element.id);
            that.removeHandler(that._rightButton, 'mouseleave.' + that.element.id);

            that.addHandler(that._leftButton, 'mousedown.' + that.element.id, function ()
            {
                if (!that.disabled)
                {
                    that._helpers['leftArrow'].addClass(that.toThemeProperty('jqx-icon-arrow-' + icons.prev + '-selected'));
                    that._mouseDown = true;
                }
            });
            that.addHandler(that._leftButton, 'mouseup.' + that.element.id, function ()
            {
                if (!that.disabled)
                {
                    that._helpers['leftArrow'].removeClass(that.toThemeProperty('jqx-icon-arrow-' + icons.prev + '-selected'));
                }
            });

            that.addHandler(that._leftButton, 'mouseenter.' + that.element.id, function ()
            {
                if (!that.disabled)
                {
                    that._helpers['leftArrow'].addClass(that.toThemeProperty('jqx-icon-arrow-' + icons.prev + '-hover'));
                }
            });

            that.addHandler(that._leftButton, 'mouseleave.' + that.element.id, function ()
            {
                if (!that.disabled)
                {
                    that._helpers['leftArrow'].removeClass(that.toThemeProperty('jqx-icon-arrow-' + icons.prev + '-hover'));
                }
            });

            that.addHandler(that._rightButton, 'mousedown.' + that.element.id, function ()
            {
                if (!that.disabled)
                {
                    that._helpers['rightArrow'].addClass(that.toThemeProperty('jqx-icon-arrow-' + icons.next + '-selected'));
                    that._mouseDown = true;
                }
            });
            that.addHandler(that._rightButton, 'mouseup.' + that.element.id, function ()
            {
                if (!that.disabled)
                {
                    that._helpers['rightArrow'].removeClass(that.toThemeProperty('jqx-icon-arrow-' + icons.next + '-selected'));
                }
            });

            that.addHandler(that._rightButton, 'mouseenter.' + that.element.id, function ()
            {
                if (!that.disabled)
                {
                    that._helpers['rightArrow'].addClass(that.toThemeProperty('jqx-icon-arrow-' + icons.next + '-hover'));
                }
            });
            that.addHandler(that._rightButton, 'mouseleave.' + that.element.id, function ()
            {
                if (!that.disabled)
                {
                    that._helpers['rightArrow'].removeClass(that.toThemeProperty('jqx-icon-arrow-' + icons.next + '-hover'));
                }
            });
        },

        _layoutButtons: function ()
        {
            var that = this;
            if (that.orientation === 'horizontal')
            {
                that._horizontalButtonsLayout();
            } else
            {
                that._verticalButtonsLayout();
            }
        },

        _horizontalButtonsLayout: function ()
        {
            var that = this;
            var offset = (2 + Math.ceil(that.sliderButtonSize / 2));
            if (that.buttonsPosition === 'left')
            {
                that._leftButton.style.marginRight = '0px';
                that._rightButton.style.marginRight = offset + 'px';
            } else if (that.buttonsPosition === 'right')
            {
                that._leftButton.style.marginLeft = 2 + offset + 'px';
                that._rightButton.style.marginRight = '0px';
            } else
            {
                that._leftButton.style.marginRight = offset + 'px';
                that._rightButton.style.marginLeft = offset + 'px';
            }
        },

        _verticalButtonsLayout: function ()
        {
            var that = this;

            var offset = (2 + Math.ceil(that.sliderButtonSize / 2));
            if (that.buttonsPosition === 'left')
            {
                that._leftButton.style.marginBottom = '0px';
                that._rightButton.style.marginBottom = offset + 'px';
            } else if (that.buttonsPosition === 'right')
            {
                that._leftButton.style.marginTop = 2 + offset + 'px';
                that._rightButton.style.marginBottom = '0px';
            } else
            {
                that._leftButton.style.marginBottom = offset + 'px';
                that._rightButton.style.marginTop = 2 + offset + 'px';
            }
            var leftMargin = parseInt(that._leftButton.style.marginLeft, 10);
            that._leftButton.style.marginLeft = (leftMargin - 1) + 'px';
            that._rightButton.style.marginLeft = (leftMargin - 1) + 'px';
        },


        _performRangeBarLayout: function ()
        {
            var that = this;
            that._rangeBar.style[that._getSetting('oSize')] = that._helpers['track'][that._getSetting('oSize')]() + 'px';
            that._rangeBar.style[that._getSetting('size')] = that._helpers['track'][that._getSetting('size')]() + 'px';
            that._rangeBar.style.position = 'absolute';
            that._rangeBar.style.left = '0px';
            that._rangeBar.style.top = '0px';
        },

        _raiseEvent: function (id, arg)
        {
            var that = this;
            var evt = that._events[id];
            var event = new $.Event(evt, this.element);

            if (that._triggerEvents === false)
            {
                return true;
            }
            if (that._rendering)
            {
                return true;
            }

            event.args = arg;
            if (id === 0)
            {
                event.args.type = that.changeType;
                that.changeType = null;
            }
            if (id === 1)
            {
                event.args.cancel = false;
                that._slideEvent = event;
            }
            that._lastValue[id] = arg.value;
            event.owner = this;
            var result = that.host.trigger(event);
            return result;
        },

        //Initializing the slider - setting it's values, disabling it if
        //disabled is true and setting tab-indexes for the keyboard navigation
        _initialSettings: function ()
        {
            var that = this;
            if (that.int64 === false)
            {
                if (that.rangeSlider)
                {
                    if (typeof that.value !== 'number')
                    {
                        that.setValue(that.value);
                    } else
                    {
                        that.setValue(that.values);
                    }
                } else
                {
                    if (that.value === undefined)
                    {
                        that.value = 0;
                    }
                    that.setValue(that.value);
                }
            } else
            {
                if (that.rangeSlider === false || Array.isArray(that._value64) === true)
                {
                    that.setValue(that._value64);
                }
                else
                {
                    that.setValue(that._values64);
                }
            }

            if (that.disabled)
            {
                that.disable();
            }
        },

        _addEventHandlers: function ()
        {
            var that = this;
            that.addHandler(that._slider.right, that._getEvent('mousedown'), that._startDrag, { that: this });
            that.addHandler(that._slider.left, that._getEvent('mousedown'), that._startDrag, { that: this });
            that.addHandler($(document), that._getEvent('mouseup') + '.' + that.element.id, function ()
            {
                that._stopDrag();
            });

            try
            {
                if (document.referrer !== '' || window.frameElement)
                {
                    if (window.top !== null && window.top !== window.self)
                    {
                        var eventHandle = function ()
                        {
                            that._stopDrag();
                        };
                        var parentLocation = null;
                        if (window.parent && document.referrer)
                        {
                            parentLocation = document.referrer;
                        }

                        if (parentLocation && parentLocation.indexOf(document.location.host) !== -1)
                        {
                            if (window.top.document)
                            {
                                if (window.top.document.addEventListener)
                                {
                                    window.top.document.addEventListener('mouseup', eventHandle, false);

                                } else if (window.top.document.attachEvent)
                                {
                                    window.top.document.attachEvent('on' + 'mouseup', eventHandle);
                                }
                            }
                        }
                    }
                }
            }
            catch (error)
            {
            }

            that.addHandler($(document), that._getEvent('mousemove') + '.' + that.element.id, that._performDrag, { that: this });
            that.addHandler(that._slider.left, 'mouseenter', function ()
            {
                if (!that.disabled)
                {
                    that._helpers['left'].addClass(that.toThemeProperty('jqx-fill-state-hover'));
                }
            });

            that.addHandler(that._slider.right, 'mouseenter', function ()
            {
                if (!that.disabled)
                {
                    that._helpers['right'].addClass(that.toThemeProperty('jqx-fill-state-hover'));
                }
            });

            that.addHandler(that._slider.left, 'mouseleave', function ()
            {
                if (!that.disabled)
                {
                    that._helpers['left'].removeClass(that.toThemeProperty('jqx-fill-state-hover'));
                }
            });

            that.addHandler(that._slider.right, 'mouseleave', function ()
            {
                if (!that.disabled)
                {
                    that._helpers['right'].removeClass(that.toThemeProperty('jqx-fill-state-hover'));
                }
            });

            that.addHandler(that._slider.left, 'mousedown', function ()
            {
                if (!that.disabled)
                {
                    that._helpers['left'].addClass(that.toThemeProperty('jqx-fill-state-pressed'));
                }
            });

            that.addHandler(that._slider.right, 'mousedown', function ()
            {
                if (!that.disabled)
                {
                    that._helpers['right'].addClass(that.toThemeProperty('jqx-fill-state-pressed'));
                }
            });

            that.addHandler(that._slider.left, 'mouseup', function ()
            {
                if (!that.disabled)
                {
                    that._helpers['left'].removeClass(that.toThemeProperty('jqx-fill-state-pressed'));
                }
            });

            that.addHandler(that._slider.right, 'mouseup', function ()
            {
                if (!that.disabled)
                {
                    that._helpers['right'].removeClass(that.toThemeProperty('jqx-fill-state-pressed'));
                }
            });

            that.addHandler(that._leftButton, that._getEvent('click'), that._leftButtonHandler, { that: this });
            that.addHandler(that._rightButton, that._getEvent('click'), that._rightButtonHandler, { that: this });
            that.addHandler(that._track, that._getEvent('mousedown'), that._trackMouseDownHandler, { that: this });
            that.addHandler(that.host, 'focus', function ()
            {
                that._helpers['track'].addClass(that.toThemeProperty('jqx-fill-state-focus'));
                that._helpers['leftButton'].addClass(that.toThemeProperty('jqx-fill-state-focus'));
                that._helpers['rightButton'].addClass(that.toThemeProperty('jqx-fill-state-focus'));
                that._helpers['right'].addClass(that.toThemeProperty('jqx-fill-state-focus'));
                that._helpers['left'].addClass(that.toThemeProperty('jqx-fill-state-focus'));
            });
            that.addHandler(that.host, 'blur', function ()
            {
                that._helpers['track'].removeClass(that.toThemeProperty('jqx-fill-state-focus'));
                that._helpers['leftButton'].removeClass(that.toThemeProperty('jqx-fill-state-focus'));
                that._helpers['rightButton'].removeClass(that.toThemeProperty('jqx-fill-state-focus'));
                that._helpers['right'].removeClass(that.toThemeProperty('jqx-fill-state-focus'));
                that._helpers['left'].removeClass(that.toThemeProperty('jqx-fill-state-focus'));
            });

            that.element.onselectstart = function () { return false; };
            that._addMouseWheelListeners();
            that._addKeyboardListeners();
        },

        _addMouseWheelListeners: function ()
        {
            var that = this;
            that.addHandler(that.host, 'mousewheel', function (event)
            {
                if (that.disabled)
                {
                    return true;
                }
                that.changeType = 'mouse';

                if (document.activeElement && !$(document.activeElement).ischildof(that.host))
                {
                    return true;
                }

                var scroll = event.wheelDelta;
                if (event.originalEvent && event.originalEvent.wheelDelta)
                {
                    event.wheelDelta = event.originalEvent.wheelDelta;
                }

                if (!('wheelDelta' in event))
                {
                    scroll = event.detail * -40;
                }
                if (scroll > 0)
                {
                    that.incrementValue();
                } else
                {
                    that.decrementValue();
                }
                event.preventDefault();
            });
        },

        _addKeyboardListeners: function ()
        {
            var that = this;
            that.addHandler(that.host, 'keydown', function (event)
            {
                if (that._editingLabels === true)
                {
                    return;
                }
                that.changeType = 'keyboard';
                switch (event.keyCode)
                {
                    case 40:
                    case 37:    //left arrow
                        if (that.layout === 'normal' && !that.rtl)
                        {
                            that.decrementValue();
                        }
                        else
                        {
                            that.incrementValue();
                        }

                        return false;
                    case 38:
                    case 39:    //right arrow
                        if (that.layout === 'normal' && !that.rtl)
                        {
                            that.incrementValue();
                        }
                        else
                        {
                            that.decrementValue();
                        }
                        return false;
                    case 36:    //home
                        if (that.rangeSlider)
                        {
                            that.setValue([that.values[0], that.max]);
                        }
                        else
                        {
                            that.setValue(that.min);
                        }
                        return false;
                    case 35:    //end
                        if (that.rangeSlider)
                        {
                            that.setValue([that.min, that.values[1]]);
                        } else
                        {
                            that.setValue(that.max);
                        }
                        return false;
                }
            });
        },

        _trackMouseDownHandler: function (event)
        {
            var that = event.data.that;
            var touches = $.jqx.mobile.getTouches(event);
            var touch = touches[0];
            var leftButtonSize = parseInt(that._slider.left.style[that._getSetting('size')], 10);
            if (isNaN(leftButtonSize))
            {
                leftButtonSize = 0;
            }

            var ev = (that._isTouchDevice) ? touch : event,
                pagePos = ev[that._getSetting('page')] - leftButtonSize / 2,
                slider = that._getClosest(pagePos);

            var value = that._getValueByPosition(pagePos);
            that._mouseDown = true;
            that.changeType = 'mouse';
            that._setValue(value, slider);
            if (that.input)
            {
                $.jqx.aria(that, 'aria-valuenow', that.input.value);
            }
        },

        _getClosest: function (position)
        {
            var that = this;
            if (!that.rangeSlider)
            {
                return that._slider.right;
            } else
            {
                position = position - that._helpers['track'].offset()[that._getSetting('left')] - that._helpers['left'][that._getSetting('size')]() / 2;
                if (Math.abs(parseInt(that._slider.left.style[that._getSetting('left')], 10) - position) <
                Math.abs(parseInt(that._slider.right.style[that._getSetting('left')], 10) - position))
                {
                    return that._slider.left;
                } else
                {
                    return that._slider.right;
                }
            }
        },

        _removeEventHandlers: function ()
        {
            var that = this;
            that.removeHandler(that._slider.right, that._getEvent('mousedown'), that._startDrag);
            that.removeHandler(that._slider.left, that._getEvent('mousedown'), that._startDrag);
            that.removeHandler($(document), that._getEvent('mouseup') + '.' + that.host.attr('id'), that._stopDrag);
            that.removeHandler($(document), that._getEvent('mousemove') + '.' + that.host.attr('id'), that._performDrag);
            that.removeHandler(that._leftButton, that._getEvent('click'), that._leftButtonHandler);
            that.removeHandler(that._rightButton, that._getEvent('click'), that._rightButtonHandler);
            that.removeHandler(that._track, that._getEvent('mousedown'), that._trackMouseDownHandler);
            that.element.onselectstart = null;
            that.removeHandler(that.host, that._getEvent('mousewheel'));
            that.removeHandler(that.host, that._getEvent('keydown'));
        },

        _rightButtonClick: function ()
        {
            var that = this;
            that.changeType = 'mouse';

            if (that.orientation === 'horizontal' && !that.rtl)
            {
                that.incrementValue();
            }
            else
            {
                that.decrementValue();
            }
        },

        _leftButtonClick: function ()
        {
            var that = this;
            that.changeType = 'mouse';

            if (that.orientation === 'horizontal' && !that.rtl)
            {
                that.decrementValue();
            }
            else
            {
                that.incrementValue();
            }
        },

        _rightButtonHandler: function (event)
        {
            var that = event.data.that;
            if (that.layout === 'normal')
            {
                that._rightButtonClick();
            }
            else
            {
                that._leftButtonClick();
            }
            return false;
        },

        _leftButtonHandler: function (event)
        {
            var that = event.data.that;
            if (that.layout === 'normal')
            {
                that._leftButtonClick();
            }
            else
            {
                that._rightButtonClick();
            }
            return false;
        },

        _startDrag: function (event)
        {
            var that = event.data.that;
            that.changeType = 'mouse';

            that._capturedElement = event.target;
            var obj = new jqxHelper(event.target);
            var offset = obj.offset();
            that._startX = offset.left;
            that._startY = offset.top;

            var position = $.jqx.position(event);
            that._mouseStartX = position.left;
            that._mouseStartY = position.top;
            that._mouseDown = true;
            event.stopPropagation();
            if (that.tooltip)
            {
                that._showTooltip(that._capturedElement, that.value);
            }

            if (that._isTouchDevice)
            {
                return false;
            }
        },

        _stopDrag: function ()
        {
            var that = this;
            if (that._slideStarted)
            {
                that._raiseEvent(2, { value: that.getValue() });
            }
            if (!that._slideStarted || that._capturedElement === null)
            {
                that._capturedElement = null;
                return;
            }

            if (that.input)
            {
                $.jqx.aria(this, 'aria-valuenow', that.input.value);
            }
            that._helpers['left'].removeClass(that.toThemeProperty('jqx-fill-state-pressed'));
            that._helpers['right'].removeClass(that.toThemeProperty('jqx-fill-state-pressed'));

            that._slideStarted = false;
            that._capturedElement = null;
            if (that.sliderTooltip)
            {
                that.sliderTooltipObj.fadeOut('fast');
            }
        },

        _performDrag: function (event)
        {
            var that = event.data.that;
            if (that._capturedElement !== null)
            {
                if (event.which === 0 && $.jqx.browser.msie && $.jqx.browser.version < 9)
                {
                    that._stopDrag();
                    return false;
                }
                var position = $.jqx.position(event);
                var p = that.orientation === 'horizontal' ? position.left : position.top;
                that._isDragged(p);
                if (that._slideStarted || that._isTouchDevice)
                {
                    return that._dragHandler(p);
                }
            }
        },

        _isDragged: function (position)
        {
            var that = this;
            if (Math.abs(position - this[that._getSetting('mouse')]) > 2 && !that._slideStarted)
            {
                that._slideStarted = true;
                if (that._valueChanged(3))
                {
                    that._raiseEvent(3, { value: that.getValue() });
                }
            } else
            {
                if (that._capturedElement == null)
                {
                    that._slideStarted = false;
                }
            }
        },

        _dragHandler: function (position)
        {
            position = (position - this[this._getSetting('mouse')]) + this[this._getSetting('start')];
            var newvalue = this._getValueByPosition(position);
            if (this.rangeSlider)
            {
                var second = this._helpers['right'],
                     first = this._helpers['left'];

                var dimension = this._getSetting('left');

                if (this._capturedElement === first)
                {
                    if (parseFloat(position) > second.offset()[dimension])
                    {
                        position = second.offset()[dimension];
                    }
                } else
                {
                    if (parseFloat(position) < first.offset()[dimension])
                    {
                        position = first.offset()[dimension];
                    }
                }
            }
            this._setValue(newvalue, this._capturedElement, position);
            return false;
        },

        _getValueByPosition: function (position)
        {
            if (this.mode === 'default')
            {
                return this._getFloatingValueByPosition(position);
            }
            else
            {
                return this._getFixedValueByPosition(position);
            }
        },

        _getFloatingValueByPosition: function (position)
        {
            var that = this;
            var relativePosition = position - that._helpers['track'].offset()[that._getSetting('left')] + that._slider.left.offsetWidth / 2,
                ratio = relativePosition / that._helpers['track'][that._getSetting('size')](),
                value, minMaxRange, coefficient, size;

            if (relativePosition < 0)
            {
                relativePosition = 0;
            }

            if (that.int64 === false)
            {
                value = (that.max - that.min) * ratio + that.min;
            }
            else if (that.int64 === 's')
            {
                size = new $.jqx.math().fromNumber(that._helpers['track'][that._getSetting('size')](), 10);
                minMaxRange = that._max64.subtract(that._min64);
                coefficient = that._divide64(minMaxRange, size) * relativePosition;
                value = new $.jqx.math().fromNumber(coefficient, 10).add(that._min64);
            }
            else if (that.int64 === 'u')
            {
                size = new BigNumber(that._helpers['track'][that._getSetting('size')]());
                minMaxRange = that._max64.subtract(that._min64);
                coefficient = that._divide64(minMaxRange, size) * relativePosition;
                value = new BigNumber(coefficient).add(that._min64);
            }

            if (that.layout === 'normal')
            {
                if (that.orientation === 'horizontal' && !that.rtl)
                {
                    return value;
                }
                else
                {
                    if (that.int64 === false)
                    {
                        return (that.max + that.min) - value;
                    } else
                    {
                        return (that._max64.add(that._min64)).subtract(value);
                    }
                }
            }
            else
            {
                if (that.orientation === 'horizontal')
                {
                    if (that.int64 === false)
                    {
                        return (that.max + that.min) - value;
                    }
                    else
                    {
                        return (that._max64.add(that._min64)).subtract(value);
                    }
                } else
                {
                    return value;
                }
            }
        },

        _getThumbSize: function ()
        {
            if (this.__thumbSize)
            {
                return this.__thumbSize;
            }
            var __thumbSize = this._helpers['left'][this._getSetting('size')]();
            this.__thumbSize = __thumbSize;
            return __thumbSize;
        },


        _getTrackSize: function ()
        {
            var that = this;
            if (that.__trackSize)
            {
                return that.__trackSize;
            }
            var __trackSize = parseInt(that._helpers['track'][that._getSetting('size')](), 10);
            that.__trackSize = __trackSize;
            return __trackSize;
        },

        _getFixedValueByPosition: function (position)
        {
            var that = this;
            var trackSize = that._getTrackSize(),
                thumbSize = that._getThumbSize(),
                sector64, max, sector,
                closestSector = { number: -1, distance: Number.MAX_VALUE },
                step, sectorSize, count, currentSectorPosition;

            if (that.int64 === false)
            {
                step = that.step;
                count = (that.max - that.min) / step;
                sectorSize = (trackSize) / count;
                currentSectorPosition = that._helpers['track'].offset()[that._getSetting('left')] - thumbSize / 2;
                max = that.max + that.step;
                if (that.mode === 'fixedRange')
                {
                    max = that.max;
                }
                for (sector = that.min; sector <= max; sector += that.step)
                {
                    if (Math.abs(closestSector.distance - position) > Math.abs(currentSectorPosition - position))
                    {
                        closestSector.distance = currentSectorPosition;
                        closestSector.number = sector;
                    }
                    currentSectorPosition += sectorSize;
                }
            } else if (that.int64 === 's')
            {
                step = that._step64;
                count = (that._max64.subtract(that._min64)).div(that._step64);
                sectorSize = that._divide64(new $.jqx.math().fromNumber(trackSize, 10), count);
                currentSectorPosition = that._helpers['track'].offset()[that._getSetting('left')] - thumbSize / 2;
                closestSector = { number: new $.jqx.math().fromString(that._min64.toString(), 10), distance: currentSectorPosition };

                for (sector64 = new $.jqx.math().fromString(that._min64.toString(), 10) ; that.mode !== 'fixedRange' ? sector64.lessThanOrEqual(that._max64.add(that._step64)) : sector64.lessThanOrEqual(that._max64) ; sector64 = sector64.add(that._step64))
                {
                    if (Math.abs(closestSector.distance - position) > Math.abs(currentSectorPosition - position))
                    {
                        closestSector.distance = currentSectorPosition;
                        closestSector.number = new $.jqx.math().fromString(sector64.toString(), 10);
                    }
                    currentSectorPosition += sectorSize;
                }
            } else if (that.int64 === 'u')
            {
                step = that._step64;
                count = (that._max64.subtract(that._min64)).divide(that._step64);
                sectorSize = parseFloat(new BigNumber(trackSize).divide(count).toString());
                currentSectorPosition = that._helpers['track'].offset()[that._getSetting('left')] - thumbSize / 2;
                closestSector = { number: new BigNumber(that._min64.toString()), distance: currentSectorPosition };

                var maxUInt64 = that.mode !== 'fixedRange' ? that._max64.add(that._step64) : that._max64;
                for (sector64 = new BigNumber(that._min64.toString()) ; sector64.compare(maxUInt64) !== 1; sector64 = sector64.add(that._step64))
                {
                    if (Math.abs(closestSector.distance - position) > Math.abs(currentSectorPosition - position))
                    {
                        closestSector.distance = currentSectorPosition;
                        closestSector.number = new BigNumber(sector64.toString());
                    }
                    currentSectorPosition += sectorSize;
                }
            }

            if (that.layout === 'normal')
            {
                if (that.orientation === 'horizontal' && !that.rtl)
                {
                    return closestSector.number;
                } else
                {
                    if (that.int64 === false)
                    {
                        return (that.max + that.min) - closestSector.number;
                    } else
                    {
                        return that._max64.add(that._min64).subtract(closestSector.number);
                    }
                }
            }
            else
            {
                if (that.orientation === 'horizontal')
                {
                    if (that.int64 === false)
                    {
                        return (that.max + that.min) - closestSector.number;
                    } else
                    {
                        return that._max64.add(that._min64).subtract(closestSector.number);
                    }
                } else
                {
                    return closestSector.number;
                }
            }
        },

        _setValue: function (value, slider, position)
        {
            var that = this;
            if (!that._slideEvent || !that._slideEvent.args.cancel)
            {
                value = that._handleValue(value, slider);
                that._setSliderPosition(value, slider, position);
                that._fixZIndexes();
                if (that._valueChanged(1))
                {
                    that._raiseEvent(1, { value: that.getValue() });
                }
                if (that._valueChanged(0))
                {
                    that._raiseEvent(0, { value: that.getValue() });
                }
                if (!that.input)
                {
                    return;
                }
                if (!that.rangeSlider)
                {
                    that.input.value = that.value.toString();
                }
                else
                {
                    if (that.values && (that.value.rangeEnd !== undefined && that.value.rangeStart !== undefined))
                    {
                        that.input.value = (that.value.rangeStart.toString() + '-' + that.value.rangeEnd.toString());

                    }
                }
            }
        },

        _valueChanged: function (id)
        {
            var value = this.getValue();
            return (!this.rangeSlider && this._lastValue[id] !== value) ||
                    (this.rangeSlider && (typeof this._lastValue[id] !== 'object' ||
                     parseFloat(this._lastValue[id].rangeEnd) !== parseFloat(value.rangeEnd) || parseFloat(this._lastValue[id].rangeStart) !== parseFloat(value.rangeStart)));
        },

        _handleValue: function (value, slider)
        {
            var that = this;
            value = that._validateValue(value, slider);
            if (slider === that._slider.left)
            {
                if (that.int64 === false)
                {
                    that.values[0] = value;
                } else
                {
                    that.values[0] = value.toString();
                    that._value64[0] = value;
                }
            }
            if (slider === that._slider.right)
            {
                if (that.int64 === false)
                {
                    that.values[1] = value;
                } else
                {
                    that.values[1] = value.toString();
                    that._values64[1] = value;
                }
            }
            if (that.rangeSlider)
            {
                that.value = { rangeStart: that.values[0], rangeEnd: that.values[1] };
                if (that.int64 !== false)
                {
                    that._value64 = { rangeStart: that._values64[0], rangeEnd: that._values64[1] };
                }
            } else
            {
                if (that.int64 === false)
                {
                    that.value = value;
                } else
                {
                    that.value = value.toString();
                    that._value64 = value;
                }
            }
            return value;
        },

        _fixZIndexes: function ()
        {
            if (this.values[1] - this.values[0] < 0.5 && this.max - this.values[0] < 0.5)
            {
                this._slider.left.style.zIndex = 20;
                this._slider.right.style.zIndex = 15;
            } else
            {
                this._slider.left.style.zIndex = 15;
                this._slider.right.style.zIndex = 20;
            }
        },

        _refreshRangeBar: function ()
        {
            var leftSlider = this._helpers['left'];
            var rightSlider = this._helpers['right'];
            var track = this._helpers['track'];
            var position;
            var _left = this._getSetting('left');
            var _size = this._getSetting('size');

            var isRTL = this.rtl && this.orientation === 'horizontal';

            if (this.layout === 'normal')
            {
                position = leftSlider.position()[_left];
                var jqpos = $(leftSlider[0]).position()[_left];
                if (this.orientation === 'vertical' || isRTL)
                {
                    position = rightSlider.position()[_left];
                }
            }
            else
            {
                position = rightSlider.position()[_left];
                if (this.orientation === 'vertical')
                {
                    position = leftSlider.position()[_left];
                }
            }

            if (this.rangeSlider)
            {
                this._rangeBar.style[_left] = position + 'px';
            }
            else
            {
                if (this.orientation === 'horizontal' && (isRTL || this.layout !== 'normal'))
                {
                    this._rangeBar.style[_left] = position - track.position().left + leftSlider.innerWidth() / 2 + 'px';
                }
                else if (this.orientation === 'vertical')
                {
                    this._rangeBar.style[_left] = position - track.position().top + leftSlider.innerHeight() / 2 + 'px';
                }
            }
            this._rangeBar.style[_size] = Math.abs(rightSlider.position()[_left] - leftSlider.position()[_left]) + 'px';
        },

        _validateValue: function (value, slider)
        {

            if (this.int64 === false)
            {
                if (value > this.max)
                {
                    value = this.max;
                }
                if (value < this.min)
                {
                    value = this.min;
                }

                if (this.rangeSlider)
                {
                    if (slider === this._slider.left)
                    {
                        if (value >= this.values[1])
                        {
                            value = this.values[1];
                        }
                    } else
                    {
                        if (value <= this.values[0])
                        {
                            value = this.values[0];
                        }
                    }
                }
            } else if (this.int64 === 's')
            {
                if (value.greaterThan(this._max64))
                {
                    value = this._max64;
                }
                if (value.lessThan(this._min64))
                {
                    value = this._min64;
                }
            } else if (this.int64 === 'u')
            {
                if (value.compare(this._max64) === 1)
                {
                    value = this._max64;
                }
                if (value.compare(this._min64) === -1)
                {
                    value = this._min64;
                }
            }

            return value;
        },

        _setSliderPosition: function (value, thumb, position)
        {
            var trackSize = parseInt(this._helpers['track'][this._getSetting('size')](), 10);
            var ratio, distance, ratio1, ratio2;
            if (position)
            {
                position -= this._helpers['track'].offset()[this._getSetting('left')];
            }
            var thumbSize = parseInt(this._helpers['left'][this._getSetting('size')](), 10);
            if (isNaN(thumbSize))
            {
                thumbSize = 0;
            }

            if (this.int64 === 's')
            {
                if (typeof value === 'number')
                {
                    value = new $.jqx.math().fromNumber(value, 10);
                } else if (typeof value === 'string')
                {
                    value = new $.jqx.math().fromString(value, 10);
                }

                if (value.greaterThan(this._max64))
                {
                    value = new $.jqx.math().fromString(this._max64.toString(), 10);
                }
                if (value.lessThan(this._min64))
                {
                    value = new $.jqx.math().fromString(this._min64.toString(), 10);
                }

                ratio1 = this._divide64(value.subtract(this._min64), this._max64.subtract(this._min64));
                ratio2 = 1 - ratio1;
                if (this.layout === 'normal')
                {
                    ratio = ratio1;

                    if (this.orientation !== 'horizontal' || (this.orientation === 'horizontal' && this.rtl))
                    {
                        ratio = ratio2;
                    }
                }
                else
                {
                    ratio = ratio2;
                    if (this.orientation !== 'horizontal')
                    {
                        ratio = ratio1;
                    }
                }

                distance = trackSize * ratio - thumbSize / 2;
                thumb.style[this._getSetting('left')] = distance + 'px';
            } else if (this.int64 === 'u')
            {
                if (typeof value === 'number' || typeof value === 'string')
                {
                    value = new BigNumber(value);
                }

                if (value.compare(this._max64) === 1)
                {
                    value = new BigNumber(this._max64);
                }
                if (value.compare(this._min64) === -1)
                {
                    value = new BigNumber(this._min64);
                }

                ratio1 = this._divide64(value.subtract(this._min64), this._max64.subtract(this._min64));
                ratio2 = 1 - ratio1;
                if (this.layout === 'normal')
                {
                    ratio = ratio1;

                    if (this.orientation !== 'horizontal' || (this.orientation === 'horizontal' && this.rtl))
                    {
                        ratio = ratio2;
                    }
                }
                else
                {
                    ratio = ratio2;
                    if (this.orientation !== 'horizontal')
                    {
                        ratio = ratio1;
                    }
                }

                distance = trackSize * ratio - thumbSize / 2;
                thumb.style[this._getSetting('left')] = distance + 'px';
            } else if (this.int64 === false)
            {
                if (this.layout === 'normal')
                {
                    ratio = (value - this.min) / (this.max - this.min);

                    if (this.orientation !== 'horizontal' || (this.orientation === 'horizontal' && this.rtl))
                    {
                        ratio = 1 - ((value - this.min) / (this.max - this.min));
                    }
                }
                else
                {
                    ratio = 1 - ((value - this.min) / (this.max - this.min));
                    if (this.orientation !== 'horizontal')
                    {
                        ratio = (value - this.min) / (this.max - this.min);
                    }
                }

                distance = trackSize * ratio - thumbSize / 2;
                thumb.style[this._getSetting('left')] = distance + 'px';
            }

            if (this.tooltip)
            {
                this._showTooltip(thumb, this.value);
            }

            this._refreshRangeBar();
        },

        // divides two long numbers and returns a float result
        _divide64: function (first, second)
        {
            var firstString,
                firstFloat,
                secondString,
                secondFloat,
                result;

            firstString = first.toString();
            secondString = second.toString();

            if (secondString.length > 15)
            {
                var floatOffset = secondString.length - 15;
                secondString = secondString.slice(0, 15) + '.' + secondString.slice(15);
                secondFloat = parseFloat(secondString);

                if (firstString.length > floatOffset)
                {
                    var firstOffset = firstString.length - floatOffset;
                    firstString = firstString.slice(0, firstOffset) + '.' + firstString.slice(firstOffset);
                } else if (firstString.length === floatOffset)
                {
                    firstString = '0.' + firstString;
                } else
                {
                    var prefix = '0.';
                    for (var i = 0; i < floatOffset - firstString.length; i++)
                    {
                        prefix += '0';
                    }
                    firstString = prefix + '' + firstString;
                }
                firstFloat = parseFloat(firstString);
            } else
            {
                if (this.int64 === 's')
                {
                    firstFloat = first.toNumber();
                    secondFloat = second.toNumber();
                } else
                { // 'u'
                    firstFloat = parseFloat(first.toString());
                    secondFloat = parseFloat(second.toString());
                }
            }

            result = firstFloat / secondFloat;

            return result;
        },

        _showTooltip: function (thumb, value)
        {
            var that = this;
            if (that._slideStarted || that._capturedElement != null || that._mouseDown)
            {

                value = that._formatLabel(value, true);

                if (!that.toolTipCreated)
                {
                    var newID = 'tooltip' + that.element.id;
                    // appends the tooltip div to the body
                    var sliderTooltip = document.createElement('div');
                    sliderTooltip.style.display = 'none';
                    sliderTooltip.style.position = 'absolute';
                    sliderTooltip.style.visibility = 'hidden';
                    sliderTooltip.style.boxShadow = 'none';
                    sliderTooltip.style.top = '0px';
                    sliderTooltip.style.left = '0px';

                    sliderTooltip.style.zIndex = 99999;
                    sliderTooltip.setAttribute('id', newID);
                    document.body.appendChild(sliderTooltip);
                    var $main = document.createElement('div');
                    $main.setAttribute('id', newID + 'Main');
                    sliderTooltip.appendChild($main);

                    var $text = document.createElement('div');
                    $text.setAttribute('id', newID + 'Text');
                    $main.appendChild($text);

                    var $arrow = document.createElement('div');
                    $arrow.setAttribute('id', newID + 'Arrow');
                    $arrow.style.top = '0px';
                    $arrow.style.left = '0px';

                    sliderTooltip.appendChild($arrow);

                    that.sliderTooltip = sliderTooltip;
                    that.sliderTooltipObj = new jqxHelper(that.sliderTooltip);
                    that.sliderTooltipObj.initAnimate();

                    $text.innerHTML = value;

                    that.sliderTooltip.className = that.toThemeProperty('jqx-tooltip jqx-popup');
                    $main.className = that.toThemeProperty('jqx-widget jqx-fill-state-normal jqx-tooltip-main');
                    $text.className = that.toThemeProperty('jqx-widget jqx-fill-state-normal jqx-tooltip-text');
                    $arrow.className = that.toThemeProperty('jqx-widget jqx-fill-state-normal jqx-tooltip-arrow');

                    that.sliderTooltipContent = $text;
                    that.sliderTooltipArrow = $arrow;
                    that.sliderTooltipMain = $main;
                    that.sliderTooltipArrowObj = new jqxHelper(that.sliderTooltipArrow);
                    that.arrowSize = 5;
                    that.toolTipCreated = true;
                    if (that.rangeSlider)
                    {
                        that.sliderTooltipArrow.style.visibility = 'hidden';
                    }
                }

                var thumbPosition = new jqxHelper(thumb).offset();
                that.sliderTooltip.style.display = 'block';
                that.sliderTooltip.style.visibility = 'visible';


                var size = that.sliderButtonSize + that.tickSize;

                if (!that.rangeSlider)
                {
                    that.sliderTooltipContent.innerHTML = value.toString();
                }
                else
                {
                    var from = that.value ? that.value.rangeStart : '';
                    var to = that.value ? that.value.rangeEnd : '';
                    if (from !== '')
                    {
                        that.sliderTooltipContent.innerHTML = from + ' - ' + to;
                    }
                    else
                    {
                        that.sliderTooltip.style.display = 'none';
                        that.sliderTooltip.style.visibility = 'hidden';
                    }
                }

                var tooltipWidth = that.sliderTooltip.offsetWidth;
                var top, left, distance;
                if (that.orientation === 'horizontal')
                {
                    left = thumbPosition.left + that.sliderButtonSize / 2 - tooltipWidth / 2;
                    if (that.rangeSlider)
                    {
                        distance = (that._helpers['right'].offset().left - that._helpers['left'].offset().left - that._thumbSize) / 2;
                        left = that._helpers['left'].offset().left - tooltipWidth / 2 + distance + that._thumbSize;
                    }

                    switch (that.tooltipPosition)
                    {
                        case 'far':
                            top = thumbPosition.top + size + that.arrowSize;
                            that.sliderTooltipObj.offset({ top: top, left: left });
                            that.sliderTooltipArrowObj.addClass(that.toThemeProperty('jqx-tooltip-arrow-t-b'));
                            that.sliderTooltipArrow.style.borderTopWidth = '0px';
                            that.sliderTooltipArrow.style.borderRightWidth = that.arrowSize + 'px';
                            that.sliderTooltipArrow.style.borderBottomWidth = that.arrowSize + 'px';
                            that.sliderTooltipArrow.style.borderLeftWidth = that.arrowSize + 'px';
                            that.sliderTooltipArrowObj.offset({ top: top - that.arrowSize, left: left - that.arrowSize / 2 - 1 + tooltipWidth / 2 });
                            break;
                        case 'near':
                            top = thumbPosition.top - that.arrowSize - that.sliderTooltipObj.innerHeight() - 1;
                            that.sliderTooltipObj.offset({ top: top, left: left });
                            that.sliderTooltipArrowObj.addClass(that.toThemeProperty('jqx-tooltip-arrow-t-b'));
                            that.sliderTooltipArrow.style.borderTopWidth = that.arrowSize + 'px';
                            that.sliderTooltipArrow.style.borderRightWidth = that.arrowSize + 'px';
                            that.sliderTooltipArrow.style.borderBottomWidth = '0px';
                            that.sliderTooltipArrow.style.borderLeftWidth = that.arrowSize + 'px';
                            that.sliderTooltipArrowObj.offset({ top: top + that.sliderTooltipObj.innerHeight(), left: left - that.arrowSize / 2 - 1 + tooltipWidth / 2 });
                            break;
                    }
                }
                else
                {
                    var tooltipHeight = that.sliderTooltipObj.innerHeight();
                    left = thumbPosition.left - tooltipWidth - that.arrowSize - that.tickSize;
                    top = thumbPosition.top + that._thumbSize / 2 - tooltipHeight / 2 - 1;
                    if (that.rangeSlider)
                    {
                        distance = (that.sliderRightObj.offset().top - that._helpers['left'].offset().top - that._thumbSize) / 2;
                        top = that._helpers['left'].offset().top - tooltipHeight / 2 + distance + that._thumbSize;
                    }

                    switch (that.tooltipPosition)
                    {
                        case 'far':
                            left = thumbPosition.left + that._thumbSize + that.arrowSize + that.tickSize;
                            that.sliderTooltipObj.offset({ top: top, left: left });
                            that.sliderTooltipArrowObj.addClass(that.toThemeProperty('jqx-tooltip-arrow-l-r'));
                            that.sliderTooltipArrow.style.borderTopWidth = that.arrowSize + 'px';
                            that.sliderTooltipArrow.style.borderRightWidth = that.arrowSize + 'px';
                            that.sliderTooltipArrow.style.borderBottomWidth = that.arrowSize + 'px';
                            that.sliderTooltipArrow.style.borderLeftWidth = '0px';
                            that.sliderTooltipArrowObj.offset({ top: top + that.sliderTooltipObj.innerHeight() / 2 - that.arrowSize / 2 - 2, left: left - that.arrowSize });
                            break;
                        case 'near':
                            that.sliderTooltipObj.offset({ top: top, left: left });
                            that.sliderTooltipArrowObj.addClass(that.toThemeProperty('jqx-tooltip-arrow-l-r'));
                            that.sliderTooltipArrow.style.borderTopWidth = that.arrowSize + 'px';
                            that.sliderTooltipArrow.style.borderRightWidth = '0px';
                            that.sliderTooltipArrow.style.borderBottomWidth = that.arrowSize + 'px';
                            that.sliderTooltipArrow.style.borderLeftWidth = that.arrowSize + 'px';
                            that.sliderTooltipArrowObj.offset({ top: top + that.sliderTooltipObj.innerHeight() / 2 - that.arrowSize / 2 - 2, left: left + tooltipWidth + 2 });
                            break;
                    }
                }
            }
        },

        propertiesChangedHandler: function (object, oldValues, newValues)
        {
            if (newValues && newValues.width && newValues.height && Object.keys(newValues).length === 2)
            {
                object.__trackSize = null;
                object.__thumbSize = null;
                object._performLayout();
                object._initialSettings();
            }
        },

        propertyChangedHandler: function (that, key, oldvalue, value)
        {
            that.__trackSize = null;
            that.__thumbSize = null;

            if (that.batchUpdate && that.batchUpdate.width && that.batchUpdate.height && Object.keys(that.batchUpdate).length === 2)
            {
                return;
            }

            switch (key)
            {
                case 'template':
                    if (that.template)
                    {
                        that._helpers['left'].removeClass(that.toThemeProperty('jqx-' + oldvalue));
                        that._helpers['right'].removeClass(that.toThemeProperty('jqx-' + oldvalue));
                        that._helpers['rangeBar'].removeClass(that.toThemeProperty('jqx-' + oldvalue));
                        that._helpers['left'].addClass(that.toThemeProperty('jqx-' + that.template));
                        that._helpers['right'].addClass(that.toThemeProperty('jqx-' + that.template));
                        $(that._leftButton).jqxRepeatButton({ template: value });
                        $(that._rightButton).jqxRepeatButton({ template: value });
                        that._helpers['rangeBar'].addClass(that.toThemeProperty('jqx-' + that.template));
                    }

                    break;
                case 'theme':
                    $.jqx.utilities.setTheme(oldvalue, value, that.host);
                    $(that._leftButton).jqxRepeatButton({ theme: value });
                    $(that._rightButton).jqxRepeatButton({ theme: value });
                    break;
                case 'disabled':
                    if (value)
                    {
                        that.disabled = true;
                        that.disable();
                    } else
                    {
                        that.disabled = false;
                        that.enable();
                    }
                    break;
                case 'width':
                case 'height':
                    that.__trackSize = null;
                    that.__thumbSize = null;
                    that._performLayout();
                    that._initialSettings();
                    break;
                case 'min':
                case 'max':
                    if (that.int64 === 's')
                    {
                        that['_' + key + '64'] = new $.jqx.math().fromString(value.toString(), 10);
                    } else if (that.int64 === 'u')
                    {
                        that['_' + key + '64'] = new BigNumber(value);
                    }
                    that._performLayout();
                    that.__trackSize = null;
                    that.__thumbSize = null;
                    that._initialSettings();
                    break;
                case 'showTicks':
                case 'ticksPosition':
                case 'tickSize':
                case 'tickMode':
                case 'tickNumber':
                case 'minorTickNumber':
                    that._performLayout();
                    that._initialSettings();
                    break;
                case 'ticksFrequency':
                case 'minorTicksFrequency':
                    if (that.int64 === 's')
                    {
                        that['_' + key + '64'] = new $.jqx.math().fromString(value.toString(), 10);
                    } else if (that.int64 === 'u')
                    {
                        that['_' + key + '64'] = new BigNumber(value);
                    }

                    that._performLayout();
                    that._initialSettings();
                    break;
                case 'showRange':
                case 'showButtons':
                case 'orientation':
                case 'rtl':
                    that._render();
                    that._performLayout();
                    that._initialSettings();
                    if (key === 'orientation')
                    {
                        if (value === 'vertical')
                        {
                            that.element.style.minWidth = '96px';
                        } else
                        {
                            that.element.style.minWidth = '';
                        }
                    }
                    break;
                case 'buttonsPosition':
                    that._refresh();
                    break;
                case 'rangeSlider':
                    if (!value)
                    {
                        that.value = that.value.rangeEnd;
                    }
                    else
                    {
                        that.value = { rangeEnd: that.value, rangeStart: that.value };
                    }
                    that._render();
                    that._performLayout();
                    that._initialSettings();
                    break;
                case 'value':
                    var val = value;

                    if (that.int64 === 's')
                    {
                        val = new $.jqx.math().fromString(value.toString(), 10);
                        that._value64 = val;
                    }
                    else if (that.int64 === 'u')
                    {
                        val = new BigNumber(value);
                        that._value64 = val;
                    }
                    else if (that.int64 === false)
                    {
                        if (!that.rangeSlider)
                        {
                            that.value = parseFloat(value);
                        }
                    }

                    that.setValue(val);
                    break;
                case 'values':
                    var vals = value;
                    if (that.int64 === 's')
                    {
                        vals = [new $.jqx.math().fromString(value[0].toString(), 10), new $.jqx.math().fromString(value[1].toString(), 10)];
                        that._values64 = vals;
                    }
                    else if (that.int64 === 'u')
                    {
                        vals = [new BigNumber(value[0]), new BigNumber(value[1])];
                        that._values64 = vals;
                    }
                    that.setValue(vals);
                    break;
                case 'tooltip':
                    break;
                case 'step':
                    if (that.int64 === 's')
                    {
                        that._step64 = new $.jqx.math().fromString(value.toString(), 10);
                    }
                    else if (that.int64 === 'u')
                    {
                        that._step64 = new BigNumber(value);
                    }
                    break;
                case 'editableLabels':
                    that._performLayout();
                    that._initialSettings();
                    break;
                case 'tickLabelStyleSettings':
                    that._setPaddingValues(true);
                    that._performLayout();
                    that._initialSettings();
                    break;
                default: that._refresh();
            }
        },

        //Increment slider's value. If it's a range slider it's increment it's end range.
        incrementValue: function (step)
        {
            var that = this;
            var newValue;

            if (that.int64 === false)
            {
                if (step === undefined || isNaN(parseFloat(step)))
                {
                    step = that.step;
                }
                if (that.rangeSlider)
                {
                    if (that.values[1] < that.max)
                    {
                        that._setValue(that.values[1] + step, that._slider.right);
                    }
                } else
                {
                    if (that.values[1] >= that.min && that.values[1] < that.max)
                    {
                        that._setValue(that.values[1] + step, that._slider.right);
                    }
                }
            } else if (that.int64 === 's')
            {
                if (step === undefined || isNaN(parseFloat(step)))
                {
                    step = that._step64;
                } else
                {
                    step = new $.jqx.math().fromString(step.toString(), 10);
                }

                newValue = that._values64[1].add(step);
                if (newValue.lessThan(that._values64[1]))
                {
                    newValue = that._max64;
                }
                if (that.rangeSlider)
                {
                    if (that._values64[1].lessThan(that._max64))
                    {
                        that._setValue(newValue, that._slider.right);
                    }
                } else
                {
                    if (that._values64[1].greaterThanOrEqual(that._min64) && that._values64[1].lessThan(that._max64))
                    {
                        that._setValue(newValue, that._slider.right);
                    }
                }
            } else if (that.int64 === 'u')
            {
                if (step === undefined || isNaN(parseFloat(step)))
                {
                    step = that._step64;
                } else
                {
                    step = new BigNumber(step);
                }

                newValue = that._values64[1].add(step);
                if (newValue.compare(that._values64[1]) === -1)
                {
                    newValue = that._max64;
                }
                if (that.rangeSlider)
                {
                    if (that._values64[1].compare(that._max64) === -1)
                    {
                        that._setValue(newValue, that._slider.right);
                    }
                } else
                {
                    if (that._values64[1].compare(that._min64) !== -1 && that._values64[1].compare(that._max64) === -1)
                    {
                        that._setValue(newValue, that._slider.right);
                    }
                }
            }

            if (that.input)
            {
                $.jqx.aria(this, 'aria-valuenow', that.input.value);
            }
        },

        //Decrementing slider's value. If it's range slider it's decrement it's start range.
        decrementValue: function (step)
        {
            var that = this;
            var newValue;

            if (that.int64 === false)
            {
                if (step === undefined || isNaN(parseFloat(step)))
                {
                    step = that.step;
                }
                if (that.rangeSlider)
                {
                    if (that.values[0] > that.min)
                    {
                        that._setValue(that.values[0] - step, that._slider.left);
                    }
                } else
                {
                    if (that.values[1] <= that.max && that.values[1] > that.min)
                    {
                        that._setValue(that.values[1] - step, that._slider.right);
                    }
                }
            } else if (that.int64 === 's')
            {
                if (step === undefined || isNaN(parseFloat(step)))
                {
                    step = that._step64;
                } else
                {
                    step = new $.jqx.math().fromString(step.toString(), 10);
                }

                if (that.rangeSlider)
                {
                    newValue = that._values64[0].subtract(step);
                    if (newValue.greaterThan(that._values64[0]))
                    {
                        newValue = that._min64;
                    }
                    if (that._values64[0].greaterThan(that._min64))
                    {
                        that._setValue(newValue, that._slider.left);
                    }
                } else
                {
                    newValue = that._values64[1].subtract(step);
                    if (newValue.greaterThan(that._values64[1]))
                    {
                        newValue = that._min64;
                    }
                    if (that._values64[1].lessThanOrEqual(that._max64) && that._values64[1].greaterThan(that._min64))
                    {
                        that._setValue(newValue, that._slider.right);
                    }
                }
            } else if (that.int64 === 'u')
            {
                if (step === undefined || isNaN(parseFloat(step)))
                {
                    step = that._step64;
                } else
                {
                    step = new BigNumber(step);
                }

                if (that.rangeSlider)
                {
                    newValue = that._values64[0].subtract(step);
                    if (newValue.compare(that._values64[0]) === 1)
                    {
                        newValue = that._min64;
                    }
                    if (that._values64[0].compare(that._min64) === 1)
                    {
                        that._setValue(newValue, that._slider.left);
                    }
                } else
                {
                    newValue = that._values64[1].subtract(step);
                    if (newValue.compare(that._values64[1]) === 1)
                    {
                        newValue = that._min64;
                    }
                    if (that._values64[1].compare(that._max64) !== 1 && that._values64[1].compare(that._min64) === 1)
                    {
                        that._setValue(newValue, that._slider.right);
                    }
                }
            }

            if (that.input)
            {
                $.jqx.aria(this, 'aria-valuenow', that.input.value);
            }
        },

        val: function (value)
        {
            var that = this;
            var value64;

            if (arguments.length === 0 || (!$.isArray(value) && typeof (value) === 'object'))
            {
                return that.getValue();
            }
            if (that.int64 === false)
            {
                that.setValue(value);
            } else if (that.int64 === 's')
            {
                value64 = new $.jqx.math().fromString(value.toString(), 10);
                that.setValue(value64);
            } else if (that.int64 === 'u')
            {
                value64 = new BigNumber(value);
                that.setValue(value64);
            }
        },

        //Setting slider's value. Possible value types - array, one or two numbers.
        setValue: function (value)
        {
            var that = this;

            if (that.int64 !== false && (typeof value === 'string' || typeof value === 'number'))
            {
                if (that.int64 === 's')
                {
                    if (typeof value === 'string')
                    {
                        value = new $.jqx.math().fromString(value, 10);
                    } else if (typeof value === 'number')
                    {
                        value = new $.jqx.math().fromNumber(value, 10);
                    }
                } else if (that.int64 === 'u')
                {
                    value = new BigNumber(value);
                }
            }

            if (that.rangeSlider)
            {
                var rangeLeft, rangeRight;
                if (arguments.length < 2)
                {
                    if (value instanceof Array)
                    {
                        rangeLeft = value[0];
                        rangeRight = value[1];
                    } else if (typeof value === 'object' && typeof value.rangeStart !== 'undefined' && typeof value.rangeEnd !== 'undefined')
                    {
                        rangeLeft = value.rangeStart;
                        rangeRight = value.rangeEnd;
                    }
                } else
                {
                    rangeLeft = arguments[0];
                    rangeRight = arguments[1];
                }
                that._triggerEvents = false;
                that._setValue(rangeRight, that._slider.right);
                that._triggerEvents = true;
                that._setValue(rangeLeft, that._slider.left);
            } else
            {
                that._triggerEvents = false;
                var min;
                if (that.int64 === false)
                {
                    min = that.min;
                } else
                {
                    min = that._min64;
                }

                that._setValue(min, that._slider.left);
                that._triggerEvents = true;
                that._setValue(value, that._slider.right);
            }
            if (that.input)
            {
                $.jqx.aria(this, 'aria-valuenow', that.input.value);
            }
        },

        getValue: function ()
        {
            var value = this.value;

            if (this.int64 !== false)
            {
                value = this._value64.toString();
            }

            return value;
        },

        _enable: function (state)
        {
            var that = this;
            if (state)
            {
                that._addEventHandlers();
                that.disabled = false;
                that._helpers['element'].removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
            }
            else
            {
                that._removeEventHandlers();
                that.disabled = true;
                that._helpers['element'].addClass(this.toThemeProperty('jqx-fill-state-disabled'));
            }
            $(that._leftButton).jqxRepeatButton({ disabled: this.disabled });
            $(that._rightButton).jqxRepeatButton({ disabled: this.disabled });
        },

        disable: function ()
        {
            this._enable(false);
            $.jqx.aria(this, 'aria-disabled', true);
        },

        enable: function ()
        {
            this._enable(true);
            $.jqx.aria(this, 'aria-disabled', false);
        },

        _setPaddingValues: function (propertyChangedHandler)
        {
            var that = this,
                left, right;

            var labelDummy = document.createElement('span');
            labelDummy.className = that.toThemeProperty('jqx-widget jqx-slider-label');
            labelDummy.style.position = 'absolute';
            labelDummy.visibility = 'hidden';
            if (that.tickLabelStyleSettings)
            {
                var tickLabelStyleSettings = that.tickLabelStyleSettings;
                labelDummy.style.fontSize = tickLabelStyleSettings.fontSize;
                labelDummy.style.fontFamily = tickLabelStyleSettings.fontFamily;
                labelDummy.style.fontWeight = tickLabelStyleSettings.fontWeight;
                labelDummy.style.fontStyle = tickLabelStyleSettings.fontStyle;
            }

            if (that.layout === 'normal')
            {
                left = that._formatLabel(that.min);
                right = that._formatLabel(that.max);
            } else
            {
                left = that._formatLabel(that.max);
                right = that._formatLabel(that.min);
            }

            document.body.appendChild(labelDummy);
            labelDummy.innerHTML = left;
            var leftLabelDimension = that.orientation === 'horizontal' ? labelDummy.offsetWidth : labelDummy.offsetHeight;
            labelDummy.innerHTML = right;
            var rightLabelDimension = that.orientation === 'horizontal' ? labelDummy.offsetWidth : labelDummy.offsetHeight;
            labelDummy.parentNode.removeChild(labelDummy);

            function getPaddingFromLabelWidth(labelWidth)
            {
                var modifier, min, result;

                if (that.showButtons === true)
                {
                    modifier = 27;
                    min = 0;
                } else
                {
                    modifier = 0;
                    min = 8;
                }

                result = Math.ceil(labelWidth / 2) + 1 - modifier;
                result = Math.max(result, min);
                return result;
            }

            if (propertyChangedHandler === true || (propertyChangedHandler !== true && (that.padding === undefined || $.isEmptyObject(that.padding))))
            {
                if (that.orientation === 'horizontal')
                {
                    that.padding = { left: getPaddingFromLabelWidth(leftLabelDimension), right: getPaddingFromLabelWidth(rightLabelDimension) };
                } else
                {
                    that.padding = { bottom: getPaddingFromLabelWidth(leftLabelDimension), top: getPaddingFromLabelWidth(rightLabelDimension) };
                }
            }
        },

        _editableLabels: function ()
        {
            var that = this;

            function measureLabel(value)
            {
                var labelDummy = document.createElement('span');
                labelDummy.className = that.toThemeProperty('jqx-widget jqx-slider-label');
                labelDummy.style.position = 'absolute';
                labelDummy.style.visibility = 'hidden';

                document.body.appendChild(labelDummy);
                labelDummy.innerHTML = value;
                var dimensions = { width: labelDummy.scrollWidth, height: labelDummy.scrollHeight };
                labelDummy.parentNode.removeChild(labelDummy);
                return dimensions;
            }

            function handleDblclick(label, value)
            {
                if (that.disabled)
                {
                    return;
                }
                var labelDimensions = measureLabel(that._formatLabel(value));

                inputObject.offset($(label).offset());
                input.style.width = (labelDimensions.width + 10) + 'px';
                input.style.height = labelDimensions.height + 'px';
                input.style.visibility = 'visible';
                input.value = value;
                input.select();
                that._editingLabels = true;
            }

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

            if (that.showTickLabels && that.editableLabels)
            {
                var id = that.element.id,
                    topLabels = that.element.getElementsByClassName('jqx-slider-label-top'),
                    bottomLabels = that.element.getElementsByClassName('jqx-slider-label-bottom'),
                    position = that.ticksPosition,
                    numericRegExp = /^-?\d+\.?\d*$/,
                    input, inputObject;

                if (position === 'both' || position === 'top')
                {
                    var firstT = topLabels[0],
                        lastT = topLabels[topLabels.length - 1],
                        firstTopLabel, lastTopLabel;

                    if ((that.orientation === 'horizontal' && that.layout === 'normal' && that.rtl === false) || (that.orientation === 'vertical' && that.layout === 'reverse'))
                    {
                        firstTopLabel = firstT;
                        lastTopLabel = lastT;
                    } else
                    {
                        firstTopLabel = lastT;
                        lastTopLabel = firstT;
                    }

                    that.addHandler($(firstTopLabel), 'dblclick.jqxSlider' + id, function ()
                    {
                        handleDblclick(this, that.min);
                        that._editedProperty = 'min';
                    });

                    that.addHandler($(lastTopLabel), 'dblclick.jqxSlider' + id, function ()
                    {
                        handleDblclick(this, that.max);
                        that._editedProperty = 'max';
                    });
                }

                if (position === 'both' || position === 'bottom')
                {
                    var firstB = bottomLabels[0],
                        lastB = bottomLabels[bottomLabels.length - 1],
                        firstBottomLabel, lastBottomLabel;

                    if ((that.orientation === 'horizontal' && that.layout === 'normal' && that.rtl === false) || (that.orientation === 'vertical' && that.layout === 'reverse'))
                    {
                        firstBottomLabel = firstB;
                        lastBottomLabel = lastB;
                    } else
                    {
                        firstBottomLabel = lastB;
                        lastBottomLabel = firstB;
                    }

                    that.addHandler($(firstBottomLabel), 'dblclick.jqxSlider' + id, function ()
                    {
                        handleDblclick(this, that.min);
                        that._editedProperty = 'min';
                    });

                    that.addHandler($(lastBottomLabel), 'dblclick.jqxSlider' + id, function ()
                    {
                        handleDblclick(this, that.max);
                        that._editedProperty = 'max';
                    });
                }

                if (that._labelInputCreated !== true)
                {
                    input = document.createElement('input');
                    input.className = 'jqx-slider-label-input';
                    that.element.appendChild(input);
                } else
                {
                    input = that.element.querySelector('.jqx-slider-label-input');
                }
                inputObject = $(input);

                if (that._labelInputCreated !== true)
                {
                    that.addHandler(inputObject, 'blur.jqxGauge' + that.element.id, function ()
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
                        } else
                        {
                            valid = updateExtreme(value, 'max', '_max64', 'min');
                            if (valid === false)
                            {
                                return;
                            }
                        }
                        that._refresh();
                        that._editingLabels = false;
                    });
                    that._labelInputCreated = true;
                }
            }
        }
    });
})(jqxBaseFramework);

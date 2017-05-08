//****************************************
// Visual View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NUM_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.JQXNumericValueConverter;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.LinearNumericPointerViewModel = function (element, model) {
        parent.call(this, element, model);

        // Public Instance Properties
        // None

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    // None

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.ViewModels.LinearNumericPointerViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;

        var handleChange = function (event) {
            that.model.value = NUM_VAL_CONVERTER.convertBack(event.detail.value, that.model.niType);
            that.model.controlChanged();
        };

        that.element.addEventListener('value-changed', function (event) {
            handleChange(event);
        });

        that.element.addEventListener('change', function (event) {
            handleChange(event);
        });
    };

    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'orientation' });
    });

    proto.convertToScalePosition = function (scaleVisible, orientation) {
        var scalePosition = '';
        if (scaleVisible === true) {
            if (orientation === 'vertical') {
                scalePosition = 'near';
            } else {
                scalePosition = 'far';
            }
        } else {
            scalePosition = 'none';
        }

        return scalePosition;
    };

    proto.convertToTicksVisibility = function (majorTicksVisible, minorTicksVisible) {
        var ticksVisibility = '';
        if (majorTicksVisible && minorTicksVisible) {
            ticksVisibility = 'minor';
        } else if (majorTicksVisible && !minorTicksVisible) {
            ticksVisibility = 'major';
        } else {
            ticksVisibility = 'none';
        }

        return ticksVisibility;
    };

    proto.convertToLabelsVisibility = function (labelsVisible, rangeDivisionsMode) {
        var labelsVisibility = '';
        if (labelsVisible === true && rangeDivisionsMode === 'auto') {
            labelsVisibility = 'all';
        } else if (labelsVisible === true && rangeDivisionsMode === 'count(2)') {
            labelsVisibility = 'endPoints';
        } else {
            labelsVisibility = 'none';
        }

        return labelsVisibility;
    };

    proto.modelPropertyChanged = function (propertyName) {
        var that = this;
        var affectsRender = false;
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'significantDigits':
                if (this.element.scaleType === 'integer') {
                    renderBuffer.properties.significantDigits = 21;
                } else if (this.model.significantDigits === -1) {
                    renderBuffer.properties.significantDigits = null;
                }

                break;
            case 'precisionDigits':
                if (this.element.scaleType === 'integer') {
                    renderBuffer.properties.precisionDigits = null;
                } else if (this.model.precisionDigits === -1) {
                    renderBuffer.properties.precisionDigits = null;
                }

                break;
            case 'minimum':
                affectsRender = true;
                renderBuffer.properties.min = this.model.minimum;
                break;
            case 'maximum':
                affectsRender = true;
                renderBuffer.properties.max = this.model.maximum;
                break;
            case 'interval':
                renderBuffer.properties.interval = this.model.interval;
                break;
            case 'fontSize':
            case 'fontWeight':
            case 'fontStyle':
            case 'fontFamily':
            case 'textDecoration':
                affectsRender = true;
                // renderBuffer set in base class
                break;
            case 'orientation':
                affectsRender = true;
                renderBuffer.properties.orientation = this.model.orientation;
                break;
            case 'value':
                renderBuffer.properties.value = this.model.value;
                break;
            case 'niType':
                if (renderBuffer.properties.scaleType === 'integer') {
                    renderBuffer.properties.precisionDigits = null;
                    renderBuffer.properties.significantDigits = 21;
                }

                renderBuffer.properties.scaleType = NUM_VAL_CONVERTER.convertNITypeToJQX(this.model.niType);
                if (renderBuffer.properties.scaleType === 'integer') {
                    renderBuffer.properties.wordLength = this.model.niType.getName().toLowerCase();
                }

                break;
            case 'majorTicksVisible':
            case 'minorTicksVisible':
                affectsRender = true;
                renderBuffer.properties.ticksVisibility = this.convertToTicksVisibility(this.model.majorTicksVisible, this.model.minorTicksVisible);
                break;
            case 'scaleVisible':
                // scalePosition near or none
                affectsRender = true;
                renderBuffer.properties.scalePosition = this.convertToScalePosition(this.model.scaleVisible, this.model.orientation);
                break;
            case 'labelsVisible':
            case 'rangeDivisionsMode':
                affectsRender = true;
                renderBuffer.properties.labelsVisibility = this.convertToLabelsVisibility(this.model.labelsVisible, this.model.rangeDivisionsMode);
                break;
            case 'format':
                affectsRender = true;
                if (this.model.format === 'scientific') {
                    renderBuffer.properties.scientificNotation = true;
                } else {
                    renderBuffer.properties.scientificNotation = false;
                }

                break;
            case 'coercionMode':
                renderBuffer.properties.coerce = this.model.coercionMode;
                break;
            case 'mechanicalAction':
                renderBuffer.properties.mechanicalAction = this.model.mechanicalAction;
                break;
            case 'readOnly':
                renderBuffer.properties.readonly = this.model.readOnly;
                break;
        }

        if (affectsRender === true) {
            renderBuffer.postRender = function () {
                var size = that.element.getOptimalSize();
                if (that.model.orientation === 'vertical') {
                    that.model.sizeChanged('width', size);
                } else {
                    that.model.sizeChanged('height', size);
                }
            };
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);
        this.model.value = this.element.value;
        this.model.niType = NUM_VAL_CONVERTER.convertJQXTypeToNI(this.element);
        this.model.maximum = this.element.maximum;
        this.model.minimum = this.element.minimum;
        this.model.interval = this.element.interval;
        this.model.orientation = this.element.orientation;
        if (this.element.significantDigits !== null) {
            this.model.significantDigits = this.element.significantDigits;
            this.model.precisionDigits = -1;
        } else if (this.element.precisionDigits !== null) {
            this.model.precisionDigits = this.element.precisionDigits;
            this.model.significantDigits = -1;
        }

        this.model.coercionMode = this.element.coerce;
        if (this.element.ticksVisibility === 'minor') {
            this.model.majorTicksVisible = true;
            this.model.minorTicksVisible = true;
        } else if (this.element.ticksVisibility === 'major') {
            this.model.majorTicksVisible = true;
            this.model.minorTicksVisible = false;
        } else {
            this.model.majorTicksVisible = false;
            this.model.minorTicksVisible = false;
        }

        if (this.element.scalePosition === 'none') {
            this.model.scaleVisible = false;
        } else {
            this.model.scaleVisible = true;
        }

        if (this.element.labelsVisibility === 'none') {
            this.model.labelsVisible = false;
        } else {
            this.model.labelsVisible = true;
            if (this.element.labelsVisibility === 'all') {
                this.model.rangeDivisionsMode = 'auto';
            } else {
                this.model.rangeDivisionsMode = 'count(2)';
            }
        }

        if (this.element.scientificNotation === true) {
            this.model.format = 'scientific';
        }

        this.model.mechanicalAction = this.element.mechanicalAction;
        this.model.readOnly = this.element.readonly;
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.max = this.model.maximum;
        this.element.min = this.model.minimum;
        this.element.interval = this.model.interval;
        this.element.value = this.model.value;
        this.element.orientation = this.model.orientation;
        this.element.scaleType = NUM_VAL_CONVERTER.convertNITypeToJQX(this.model.niType);
        if (this.element.scaleType === 'integer') {
            this.element.wordLength = this.model.niType.getName().toLowerCase();
            this.element.significantDigits = 21;
            this.element.precisionDigits = null;
        } else {
            if (this.model.significantDigits >= 0) {
                this.element.significantDigits = this.model.significantDigits;
                this.element.precisionDigits = null;
            } else if (this.model.precisionDigits >= 0) {
                this.element.precisionDigits = this.model.precisionDigits;
                this.element.significantDigits = null;
            }
        }

        this.element.coerce = this.model.coercionMode;
        this.element.ticksVisibility = this.convertToTicksVisibility(this.model.majorTicksVisible, this.model.minorTicksVisible);
        this.element.scalePosition = this.convertToScalePosition(this.model.scaleVisible, this.model.orientation);
        this.element.labelsVisibility = this.convertToLabelsVisibility(this.model.labelsVisible, this.model.rangeDivisionsMode);

        if (this.model.format === 'scientific') {
            this.element.scientificNotation = true;
        }

        this.element.mechanicalAction = this.model.mechanicalAction;
        this.element.readonly = this.model.readOnly;
    };

}(NationalInstruments.HtmlVI.ViewModels.NumericPointerViewModel));

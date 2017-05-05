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

    proto.modelPropertyChanged = function (propertyName) {
        var that = this;
        var affectsRender = false;
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);
        switch (propertyName) {
            case 'orientation':
                affectsRender = true;
                renderBuffer.properties.orientation = this.model.orientation;
                break;
            case 'scaleVisible':
                // scalePosition near or none
                affectsRender = true;
                renderBuffer.properties.scalePosition = this.convertToScalePosition(this.model.scaleVisible, this.model.orientation);
                break;
            case 'minimum':
            case 'maximum':
            case 'fontSize':
            case 'fontWeight':
            case 'fontStyle':
            case 'fontFamily':
            case 'textDecoration':
            case 'majorTicksVisible':
            case 'minorTicksVisible':
            case 'labelsVisible':
            case 'rangeDivisionsMode':
            case 'format':
                // properties are set in a base class
                affectsRender = true;
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
        this.model.orientation = this.element.orientation;
        if (this.element.scalePosition === 'none') {
            this.model.scaleVisible = false;
        } else {
            this.model.scaleVisible = true;
        }

    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);
        this.element.orientation = this.model.orientation;
        this.element.scalePosition = this.convertToScalePosition(this.model.scaleVisible, this.model.orientation);
    };

}(NationalInstruments.HtmlVI.ViewModels.NumericPointerViewModel));

//****************************************
// Visual View Model
// National Instruments Copyright 2014
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.RadialNumericPointerViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.RadialNumericPointerViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    var endAngleFromScaleArc = function (scaleArc) {
        return scaleArc.startAngle + scaleArc.sweepAngle;
    };

    var startAngleFromScaleArc = function (scaleArc) {
        return scaleArc.startAngle;
    };

    var scaleArcFromStartAndEndAngle = function (startAngle, endAngle) {
        var scaleArc = {
            startAngle: endAngle,
            sweepAngle: startAngle - endAngle
        };

        return scaleArc;
    };

    var convertToScalePosition = function (scaleVisible) {
        var scalePosition = '';
        if (scaleVisible === true) {
            scalePosition = 'inside';
        } else {
            scalePosition = 'none';
        }

        return scalePosition;
    };

    // Public Prototype Methods
    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        switch (propertyName) {
            case 'scaleArc':
                renderBuffer.properties.startAngle = startAngleFromScaleArc(this.model.scaleArc);
                renderBuffer.properties.endAngle = endAngleFromScaleArc(this.model.scaleArc);
                break;
            case 'scaleVisible':
                renderBuffer.properties.scalePosition = convertToScalePosition(this.model.scaleVisible);
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);

        var scaleArc = scaleArcFromStartAndEndAngle(this.element.startAngle, this.element.endAngle);

        this.model.scaleArc = scaleArc;
        this.model.scaleVisible = this.element.scalePosition === 'inside' ? true : false;
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);

        this.element.startAngle = startAngleFromScaleArc(this.model.scaleArc);
        this.element.endAngle = endAngleFromScaleArc(this.model.scaleArc);
        this.element.scalePosition = convertToScalePosition(this.model.scaleVisible);
    };

}(NationalInstruments.HtmlVI.ViewModels.NumericPointerViewModel));

//****************************************
// GraphBase View Model
// National Instruments Copyright 2016
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.GraphBaseViewModel = function (element, model) {
        parent.call(this, element, model);
    };

    // Static Public Variables
    // None

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.ViewModels.GraphBaseViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None
    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        switch (propertyName) {
            case 'plotAreaMargin':
                renderBuffer.properties.plotAreaMargin = this.model.plotAreaMargin;
                break;
            case 'niType':
                renderBuffer.properties.niType = this.model.niType.toShortJSON();
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);

        this.model.niType = new window.NIType(this.element.niType);
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);

        this.element.niType = this.model.niType.toShortJSON();
    };

    // Public Prototype Methods
    proto.bindToView = function () {
        var that = this;
        var insideGraphBaseEventName = 'InsideGraphBase';

        that.element.addEventListener('mouseenter', function () {
            that.model.internalControlEventOccurred(insideGraphBaseEventName, true);
        });

        that.element.addEventListener('mouseleave', function () {
            that.model.internalControlEventOccurred(insideGraphBaseEventName, false);
        });
    };

}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));

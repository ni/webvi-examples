//****************************************
// Data Grid View Model
// National Instruments Copyright 2015
//****************************************
(function (parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NIType = window.NIType;

    // Constructor Function
    NationalInstruments.HtmlVI.ViewModels.DataGridViewModel = function (element, model) {
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
    var child = NationalInstruments.HtmlVI.ViewModels.DataGridViewModel;
    var proto = NI_SUPPORT.inheritFromParent(child, parent);

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerViewModelProperties(proto, function (targetPrototype, parentMethodName) {
        parent.prototype[parentMethodName].call(this, targetPrototype, parentMethodName);

        proto.addViewModelProperty(targetPrototype, { propertyName: 'rowHeaderVisible' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'columnHeaderVisible' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'showAddRowsToolBar' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'allowSorting' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'allowPaging' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'allowFiltering' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'allowGrouping' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'rowHeight' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'altRowColors' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'altRowStart' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'altRowStep' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'isInEditMode' });
        proto.addViewModelProperty(targetPrototype, { propertyName: 'selectedColumn' });
    });

    proto.bindToView = function () {
        parent.prototype.bindToView.call(this);
        var that = this;

        that.enableResizeHack();
        that.bindTextFocusEventListener();
        that.element.addEventListener('value-changed', function (event) {
            if (event.currentTarget === event.target) { // our value changed event bubbles - here we only care about the data grid, not the template controls
                that.model.value = event.detail.value;
                that.model.controlChanged();
            }
        });

        that.element.addEventListener('selected-column-changed', function (event) {
            that.model.internalControlEventOccurred('DataGridSelectedIndexChanged', event.detail.selectedColumn);
        });
    };

    proto.modelPropertyChanged = function (propertyName) {
        var renderBuffer = parent.prototype.modelPropertyChanged.call(this, propertyName);

        switch (propertyName) {
            case 'value':
                renderBuffer.properties.valueNonSignaling = this.model.value;
                break;
            case 'niType':
                renderBuffer.properties.niType = this.model.niType.toShortJSON();
                break;
        }

        return renderBuffer;
    };

    proto.updateModelFromElement = function () {
        parent.prototype.updateModelFromElement.call(this);

        this.model.niType = new NIType(this.element.niType);
        this.model.value = this.element.value;
    };

    proto.applyModelToElement = function () {
        parent.prototype.applyModelToElement.call(this);

        this.element.niType = this.model.niType.toShortJSON();
        this.element.valueNonSignaling = this.model.value;
    };

    NationalInstruments.HtmlVI.NIModelProvider.registerViewModel(child, NationalInstruments.HtmlVI.Elements.DataGrid, NationalInstruments.HtmlVI.Models.DataGridModel);
}(NationalInstruments.HtmlVI.ViewModels.VisualViewModel));

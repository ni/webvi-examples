/*jslint nomen: true, devel:true*/
/*global NationalInstruments*/
//****************************************
// Data Grid Column
// DOM Registration: No
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.DataGridColumn = function () {
    'use strict';
};

// Static Public Variables
// None

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.addAllProperties = function (targetPrototype) {
        parent.prototype.addAllProperties.call(this, targetPrototype);

        proto.addProperty(targetPrototype, {
            propertyName: 'index',
            defaultValue: -1
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'header',
            defaultValue: ''
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'fieldName',
            defaultValue: ''
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'width',
            defaultValue: 50
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'pinned',
            defaultValue: false
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'aggregates',
            defaultValue: '{}'
        });
    };

    proto.createdCallback = function () {
        parent.prototype.createdCallback.call(this);

        // Public Instance Properties
        // None

        // Private Instance Properties
        this._parentDataGrid = undefined;
    };

    proto.sendEventToParentDataGrid = function (name, propertyName) {
        var eventConfig;

        if (this._parentDataGrid !== undefined) {
            eventConfig = {
                cancelable: true,
                detail: {
                    element: this,
                    propertyName: propertyName
                }
            };

            this._parentDataGrid.dispatchEvent(new CustomEvent(name, eventConfig));
        }
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this);

        if (this.parentElement instanceof NationalInstruments.HtmlVI.Elements.DataGrid) {
            this._parentDataGrid = this.parentElement;
            this.sendEventToParentDataGrid('ni-data-grid-column-attached');
        } else {
            NI_SUPPORT.error('Data Grid Column does not have a parent data grid', this);
            this._parentDataGrid = undefined;
        }

        return firstCall;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        this.sendEventToParentDataGrid('ni-data-grid-column-changed', propertyName);
    };

    proto.detachedCallback = function () {
        parent.prototype.detachedCallback.call(this);

        this.sendEventToParentDataGrid('ni-data-grid-column-detached');
        this._parentDataGrid = undefined;
    };

    proto.defineElementInfo(proto, 'ni-data-grid-column', 'HTMLNIDataGridColumn');
}(NationalInstruments.HtmlVI.Elements.DataGridColumn, NationalInstruments.HtmlVI.Elements.Visual));

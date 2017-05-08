//****************************************
// Tab Item Prototype
// DOM Registration: HTMLNITabItem
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.TabItem = function () {
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
            propertyName: 'tabPosition',
            defaultValue: -1
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'header',
            defaultValue: 'TabItem'
        });

    };

    proto.createdCallback = function () {
        parent.prototype.createdCallback.call(this);

        // Public Instance Properties
        // None

        // Private Instance Properties
        this._parentTabControl = undefined;
    };

    proto.sendEventToParentTabControl = function (name) {
        var eventConfig;

        if (this._parentTabControl !== undefined) {
            eventConfig = {
                bubbles: true,
                cancelable: true,
                detail: {
                    element: this
                }
            };

            this._parentTabControl.dispatchEvent(new CustomEvent(name, eventConfig));
        }
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this);

        if (this.parentElement instanceof NationalInstruments.HtmlVI.Elements.TabControl) {
            this._parentTabControl = this.parentElement;
            this.sendEventToParentTabControl('ni-tab-item-attached');
        } else {
            NI_SUPPORT.error('Tab Item does not have a parent Tab Control', this);
            this._parentTabControl = undefined;
        }

        return firstCall;
    };

    proto.forceResizeChildren = function () {
        var children = this.children;

        if (!children) {
            return;
        }

        for (var i = 0; i < children.length; i++) {
            if (NI_SUPPORT.isElement(children[i])) {
                if (typeof children[i].forceResizeChildren === 'function') {
                    children[i].forceResizeChildren();
                }
            }
        }
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        switch (propertyName) {
        case 'header':
            this.sendEventToParentTabControl('ni-tab-item-header-updated');
            break;
        case 'tabPosition':
            this.sendEventToParentTabControl('ni-tab-item-position-updated');
            break;
        default:
            break;
        }
    };

    proto.detachedCallback = function () {
        parent.prototype.detachedCallback.call(this);

        this.sendEventToParentTabControl('ni-tab-item-detached');
        this._parentTabControl = undefined;
    };

    proto.defineElementInfo(proto, 'ni-tab-item', 'HTMLNITabItem');
}(NationalInstruments.HtmlVI.Elements.TabItem, NationalInstruments.HtmlVI.Elements.VisualComponent));

//****************************************
// Layout Panel Prototype
// DOM Registration: HTMLNILayoutPanel
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.LayoutPanel = function () {
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
    proto.forceResizeChildren = function () {
        var children = this.children;
        for (var i = 0; i < children.length; i++) {
            if (NI_SUPPORT.isElement(children[i])) {
                if (typeof children[i].forceResize === 'function') {
                    if (children[i]._latestSize) {
                        children[i].forceResize(children[i]._latestSize);
                    }
                }
            }
        }
    };

    proto.defineElementInfo(proto, 'ni-layout-panel', 'HTMLNILayoutPanel');
}(NationalInstruments.HtmlVI.Elements.LayoutPanel, NationalInstruments.HtmlVI.Elements.Visual));

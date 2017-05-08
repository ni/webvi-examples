//****************************************
// Tab Control Prototype
// DOM Registration: HTMLNITabControl
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.TabControl = function () {
    'use strict';
};

// Static Public Variables
// None

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var $ = NationalInstruments.Globals.jQuery;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    var getHeaderContainers = function (target) {
        var i, headerContainers = [];

        // IE11 does not support scoped direct child querySelector so just iterate manually
        for (i = 0; i < target.children.length; i++) {
            if (target.children[i].classList.contains('jqx-ribbon')) {
                headerContainers.push(target.children[i]);
            }
        }

        // TODO mraj found that in some cases using send to back from the editor on a deeply nested tab creates
        // conditions resulting in multiple header containers being made, but not sure of the root cause
        if (headerContainers.length > 1) {
            NI_SUPPORT.infoVerbose('TabControl should always either have zero or one headerContainers but currently has (' + headerContainers.length + ')');
        }

        return headerContainers;
    };

    var applySelectedIndex = function (target) {
        var jqref, i, selectedTabItem;

        var currentHeaderContainers = getHeaderContainers(target);

        var hasValidTabs = target._validTabHeadersLength > 0;
        var selectedIndexInValidTabsRange = target.selectedIndex >= 0 && target.selectedIndex < target._validTabHeadersLength;
        var hasValidHeaderContainer = currentHeaderContainers.length === 1;

        if (hasValidTabs && selectedIndexInValidTabsRange && hasValidHeaderContainer) {
            jqref = $(currentHeaderContainers[0]);
            jqref.jqxRibbon({
                selectedIndex: target.selectedIndex
            });

            for (i = 0; i < target.children.length; i++) {
                if (target.children[i] instanceof NationalInstruments.HtmlVI.Elements.TabItem) {
                    if (target.children[i].tabPosition === target.selectedIndex) {
                        target.children[i].classList.add('ni-selected');
                        selectedTabItem = target.children[i];
                    } else {
                        target.children[i].classList.remove('ni-selected');
                    }
                }
            }

            selectedTabItem.forceResizeChildren(true);

        } else {
            NI_SUPPORT.infoVerbose('TabControl was provided invalid selectedIndex (' + target.selectedIndex + ') when the number of valid tab items is (' + target._validTabHeadersLength + ')');
        }
    };

    var createHeaderContainer = function (target) {
        // Generated DOM:
        //<div class="jqx-ribbon">
        //    <ul class="jqx-ribbon-header">
        //        <li class="jqx-ribbon-item">Tab Header 1</li>
        //        ...
        //    </ul>
        //    <div class="jqx-ribbon-content">
        //        <div class="jqx-ribbon-content-section"><!-- Empty Tab 1 --></div>
        //        ...
        //    </div>
        //</div>

        var container = document.createElement('div');
        var tabHeaders, tabFrames;
        var i, currHeader, validTabHeadersLength;
        var headers = [];

        for (i = 0; i < target.children.length; i++) {
            if (target.children[i] instanceof NationalInstruments.HtmlVI.Elements.TabItem) {
                if (headers[target.children[i].tabPosition] === undefined) {
                    headers[target.children[i].tabPosition] = target.children[i].header;
                } else {
                    // If error, reset header and stop iteration
                    NI_SUPPORT.infoVerbose('TabControl has multiple TabItems with tabPosition (' + target.children[i].tabPosition + ')');
                    headers = [];
                    break;
                }
            }
        }

        tabHeaders = document.createElement('ul');
        tabFrames = document.createElement('div');
        if (headers.length > 0) {
            for (i = 0; i < headers.length; i++) {
                if (typeof headers[i] === 'string') {
                    currHeader = document.createElement('li');
                    currHeader.textContent = headers[i];
                    tabHeaders.appendChild(currHeader);
                    tabFrames.appendChild(document.createElement('div'));
                } else {
                    // If error, reset headers + frames and stop iteration
                    NI_SUPPORT.infoVerbose('TabControl is missing TabItem at tabPosition (' + i + ')');
                    tabHeaders = document.createElement('ul');
                    tabFrames = document.createElement('div');
                    break;
                }
            }
        }

        // jqx fails to render without at least one tab
        if (tabHeaders.children.length === 0) {
            currHeader = document.createElement('li');
            currHeader.innerHTML = '&nbsp;';
            tabHeaders.appendChild(currHeader);
            tabFrames.appendChild(document.createElement('div'));
            NI_SUPPORT.infoVerbose('TabControl has no valid TabItems to render, creating dummy so jqxRibbon does not error');
            validTabHeadersLength = 0;
        } else {
            validTabHeadersLength = tabHeaders.children.length;
        }

        // tabHeaders and tabFrames should be the same length
        if (tabHeaders.children.length !== tabFrames.children.length) {
            throw new Error('The generated number of tab headers and tab frames should be the same');
        }

        container.appendChild(tabHeaders);
        container.appendChild(tabFrames);

        return {
            container: container,
            validTabHeadersLength: validTabHeadersLength
        };
    };

    var attachHeaderContainer = function (target) {
        var widgetSettings = {},
            childElement,
            jqref;

        var existingHeadersToRemove = getHeaderContainers(target),
            i;

        for (i = 0; i < existingHeadersToRemove.length; i = i + 1) {
            target.removeChild(existingHeadersToRemove[i]);
        }

        var createHeaderContainerResult = createHeaderContainer(target);
        childElement = createHeaderContainerResult.container;
        target._validTabHeadersLength = createHeaderContainerResult.validTabHeadersLength;

        // If firstElementChild is null then insertBefore will append correctly
        target.insertBefore(childElement, target.firstElementChild);

        widgetSettings.animationType = 'none';
        widgetSettings.position = target.tabStripPlacement.toLowerCase();

        jqref = $(childElement);
        jqref.jqxRibbon(widgetSettings);
        jqref.on('select', function (evt) {
            target.selectedIndex = evt.args.selectedIndex;
        });

        applySelectedIndex(target);
    };

    var queueAttachHeaderContainer = function (target) {
        if (target._attachHeaderContainerQueued === false) {
            target._attachHeaderContainerQueued = true;

            window.requestAnimationFrame(function () {
                target._attachHeaderContainerQueued = false;
                attachHeaderContainer(target);
            });
        }
    };

    // Public Prototype Methods
    proto.addAllProperties = function (targetPrototype) {
        parent.prototype.addAllProperties.call(this, targetPrototype);

        proto.addProperty(targetPrototype, {
            propertyName: 'selectedIndex',
            defaultValue: 0,
            fireEvent: true,
            addNonSignalingProperty: true
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'tabStripPlacement',
            defaultValue: 'top'
        });

        NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'selectedIndex', 'selectedIndex', 'selectedIndexNonSignaling', 'selected-index-changed');
    };

    proto.createdCallback = function () {
        parent.prototype.createdCallback.call(this);

        // Public Instance Properties
        // None

        // Private Instance Properties
        this._validTabHeadersLength = 0;
        this._attachHeaderContainerQueued = false;
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this),
            that = this;

        if (firstCall === true) {
            that.addEventListener('ni-tab-item-attached', function (evt) {
                if (evt.target === that) {
                    queueAttachHeaderContainer(that);
                }
            });

            that.addEventListener('ni-tab-item-detached', function (evt) {
                if (evt.target === that) {
                    queueAttachHeaderContainer(that);
                }
            });

            that.addEventListener('ni-tab-item-header-updated', function (evt) {
                if (evt.target === that) {
                    queueAttachHeaderContainer(that);
                }
            });

            that.addEventListener('ni-tab-item-position-updated', function (evt) {
                if (evt.target === that) {
                    queueAttachHeaderContainer(that);
                }
            });

            queueAttachHeaderContainer(that);
        }

        return firstCall;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        switch (propertyName) {
        case 'selectedIndex':
            applySelectedIndex(this);
            break;
        case 'tabStripPlacement':
            // Changing the position of the jqxRibbon header causes render problems in jqx, so instead recreate the whole header.
            queueAttachHeaderContainer(this);
            break;
        }
    };

    proto.setFont = function (fontSize, fontFamily, fontWeight, fontStyle, textDecoration) {
        parent.prototype.setFont.call(this, fontSize, fontFamily, fontWeight, fontStyle, textDecoration);

        // Completely re-create the header just so jqx can figure out the scoll buttons in the header
        queueAttachHeaderContainer(this);
    };

    proto.forceResize = function (size) {
        parent.prototype.forceResize.call(this, size);

        // Completely re-create the header just so jqx can figure out the scoll buttons in the header
        queueAttachHeaderContainer(this);
    };

    proto.defineElementInfo(proto, 'ni-tab-control', 'HTMLNITabControl');
}(NationalInstruments.HtmlVI.Elements.TabControl, NationalInstruments.HtmlVI.Elements.Visual));

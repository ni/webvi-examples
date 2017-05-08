//****************************************
// String Control Prototype
// DOM Registration: No
// National Instruments Copyright 2015
//****************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.StringControl = function () {
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

    // Public Prototype Methods
    proto.addAllProperties = function (targetPrototype) {
        parent.prototype.addAllProperties.call(this, targetPrototype);

        proto.addProperty(targetPrototype, {
            propertyName: 'text',
            defaultValue: '',
            fireEvent: true,
            addNonSignalingProperty: true
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'acceptsReturn',
            defaultValue: false
        });
        proto.addProperty(targetPrototype, {
            propertyName: 'typeToReplace',
            defaultValue: false
        });

        NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'text', 'text', 'textNonSignaling', 'text-changed');
    };

    proto.isTextEditFocusable = function () {
        return true;
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this);

        var childElement,
            that = this;

        /* TODO mraj should this state be cleared on each attach as is now? */
        var editingContent = false;

        if (firstCall === true) {
            childElement = document.createElement('textarea');
            childElement.classList.add('ni-text-field');
            childElement.value = this.text;
            childElement.disabled = this.readOnly;
            childElement.wrap = 'off';

            childElement.addEventListener('change', function () {
                var newVal = childElement.value;
                if (that.text !== newVal) {
                    that.text = newVal;
                }
            });

            childElement.addEventListener('click', function () {
                if (that.typeToReplace && !editingContent) {
                    editingContent = true;
                    childElement.focus();
                    childElement.select();
                }
            });

            childElement.addEventListener('blur', function () {
                var newVal = childElement.value;
                editingContent = false;
                if (that.text !== newVal) {
                    that.text = newVal;
                }
            });

            childElement.addEventListener('keydown', function (evt) {
                if ((that.acceptsReturn === false || evt.ctrlKey === true) && evt.keyCode === 13) {
                    childElement.blur();

                    // TODO mraj is this trying to stop propagation? we should use stopPropagation or preventDefault instead
                    return false;
                }
            });

            this.innerHTML = '';
            this.appendChild(childElement);
        }

        return firstCall;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        var childElement = this.firstElementChild;

        switch (propertyName) {
            case 'readOnly':
                childElement.disabled = this.readOnly;
                break;
            case 'text':
                childElement.value = this.text;
                break;
        }
    };

    proto.defineElementInfo(proto, 'ni-string-control', 'HTMLNIStringControl');
}(NationalInstruments.HtmlVI.Elements.StringControl, NationalInstruments.HtmlVI.Elements.Visual));

//****************************************
// Visual Component Prototype
// DOM Registration: No
// National Instruments Copyright 2014
//****************************************

// Constructor Function: Empty (Not Invoked)
// For custom elements the constructor function is never invoked but is instead used for the prototype chain. See the createdCallback for perfoming actions on a new instance.
NationalInstruments.HtmlVI.Elements.VisualComponent = function () {
    'use strict';
};

// Static Public Variables
// Common use case is publically shared constant enums, ex:
// NationalInstruments.HtmlVI.Elements.VisualComponent.MyValueEnum = Object.freeze({
//     VALUE_1: 'VALUE_1',
//     VALUE_2: 'VALUE_2',
//     VALUE_3: 'VALUE_3',
// });

// Static Public Functions
// Use case can be publically shared helper functions, ex:
// NationalInstruments.HtmlVI.Elements.VisualComponent.MY_PUBLIC_HELPER_FUNCTION = function () {
//     'use strict';
//     return 42;
// }

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    // Common use case is aliases or enums that are shared across all instances, ex:
    // var MY_VALUE_ENUM = NationalInstruments.HtmlVI.NISupport.MyValueEnum;
    // NOTE: SHOULD NOT REFERENCE THE 'this' VARIABLE
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    // Common use case is constants or caches that are shared across all instances, ex:
    // var MY_CONSTANT = 3.14;
    // NOTE: SHOULD NOT REFERENCE THE 'this' VARIABLE

    // Static Private Functions
    // Common use case is helper functions used privately in the class and cannot be overridden by child classes, ex:
    // var myHelperFunction = function () {
    //     return 42;
    // }
    // NOTE: SHOULD NOT REFERENCE THE 'this' VARIABLE

    // Public Prototype Methods
    // Common use case is defining methods that are available to instances via the prototype chain and can be overriden by child classes, ex see the following prototype methods:
    // NOTE: MAY REFERENCE THE 'this' VARIABLE
    // addAllProperties is invoked during registration of the element to add all the properties managed by the ni-element framework. To add properties not managed by the framework see the createdCallback.
    // proto.addAllProperties = function (targetPrototype) {
    //     parent.prototype.addAllProperties.call(this, targetPrototype);
    //
    //     proto.addProperty(targetPrototype, {
    //         propertyName: 'myAwesomeProp',
    //         defaultValue: 'Awesome Default Value',
    //         fireEvent: true,
    //         addNonSignalingProperty: true
    //     });
    // };

    // createdCallback is called once during the creation of an element. This is a good time to add additional properties to the instance but as the element may or may not be added to the DOM yet, it is probably not a good time to build internal DOM structure. To build internal DOM structure see the attachedCallback.
    proto.createdCallback = function () {
        parent.prototype.createdCallback.call(this);

        // Public Instance Properties
        // Common use case is adding properties to the custom element js object that are not managed by the framework (no DOM attribute synchronization, no events on change, etc), ex:
        // this.myMagicalValue = MY_VALUE_ENUM.VALUE_1;

        // Private Instance Properties
        // Common use case is having private per instance data. Unfortunately JavaScript cannot actually represent this type of data; the best we can do is use a convention on a public instance property, like this._myPrivateData, or instead make a static private variable table that can be indexed by a unique value given to each instance (WeakMaps would be very helpful for this in modern browsers). Ex:
        // this._myNotRuntimeEnforcedSecretMagicalValue = MY_VALUE_ENUM.VALUE_1;

        // Latest recorded size from resizeEventHack.
        this._latestSize = { width: undefined, height: undefined };

        // Used by VIModel to temporarily save settings used to initialize element in a private instance property
        this._temporaryModelSettingsHolder = undefined;

        // The data-ni-base-style attribute is used as a target for applying styles to all ni-visual-component elements. Currently the attribute has two values that are used:
        // [data-ni-base-style] used to style all ni-visual-component elements regardless of initialization status.
        // [data-ni-base-style="uninitialized"] used to style ni-visual-component elements prior to the attached callback firing. This is for creating temporary styles that are on controls for first paint prior to initialization.
        // NOTE: data-ni-base-style should only be used to target either all ni-visual-components or ni-visual-components that are uninitialized. It is not useful for targetting only initialized ni-visual-components, etc.
        // For best user page start-up experience, elements in html should already have the data-ni-base-style attribute set to "uninitialized" so styles can be applied before this function runs

        // Create the data-ni-base-style attribute if it does not exist
        if (this.getAttribute('data-ni-base-style') === null) {
            this.setAttribute('data-ni-base-style', 'uninitialized');
        }
    };

    // attachedCallback is called every time the element instance has been inserted into the DOM. A good time to create the element's internal DOM is when the firstCall value is true
    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this),
            that = this;

        if (firstCall) {
            // Reset the data-ni-base-style value to empty string so it can be targetted by [data-ni-base-style]
            that.setAttribute('data-ni-base-style', '');

            that.addEventListener('resizeEventHack', function (e) {
                var width = parseInt(e.detail.width), height = parseInt(e.detail.height);

                if (that._latestSize.width !== width || that._latestSize.height !== height) {
                    that._latestSize.height = height;
                    that._latestSize.width = width;
                    that.forceResize(that._latestSize);
                }
            });
        }

        return firstCall;
    };

    // forceResize is called every time the resizeEventHack fires and width and height are different from the previous values.
    proto.forceResize = function (size) {
        //jshint unused:vars
        // Do nothing.
    };

    // propertyUpdated is called whenever a property managed by the ni-element framework has been updated, ex:
    // proto.propertyUpdated = function (propertyName) {
    //     parent.prototype.propertyUpdated.call(this, propertyName);
    //
    //     switch (propertyName) {
    //         case 'myAwesomeProp':
    //             NI_SUPPORT.log('Value Changed': + this.myAwesomeProp);
    //             break;
    //         default:
    //             break;
    //     }
    // };

    // attributeChangedCallback is called when a DOM attribute for the element has changed. Properties managed by the ni-element framework already have automatic attribute synchronization so attributeChangedCallback is very infrequently used, ex:
    // proto.attributeChangedCallback = function (attrName, oldVal, newVal) {
    //     parent.prototype.attributeChangedCallback.call(this, attrName, oldVal, newVal);
    // };

    // detachedCallback is called AFTER an element has been removed from the DOM (every time the element is removed). It is not frequently used, ex:
    // proto.detachedCallback = function () {
    //     parent.prototype.detachedCallback.call(this);
    // };
    //

}(NationalInstruments.HtmlVI.Elements.VisualComponent, NationalInstruments.HtmlVI.Elements.NIElement));

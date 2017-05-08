//****************************************
// Support functions
// National Instruments Copyright 2014
//****************************************

(function () {
    'use strict';
    // National Instruments global namespace
    var NationalInstruments = {};
    window.NationalInstruments = NationalInstruments;

    // Namespace for HtmlVI feature
    NationalInstruments.HtmlVI = {};

    // Namespace for HtmlVI Models
    NationalInstruments.HtmlVI.Models = {};

    // Namespace for HtmlVI View Models
    NationalInstruments.HtmlVI.ViewModels = {};

    // Namespace for Support Functions
    NationalInstruments.HtmlVI.NISupport = {};
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Namespace for JQXElements
    NationalInstruments.JQXElement = {};

    NationalInstruments.HtmlVI.NISupport.isJQXElement = function (element) {
        return element.niControlId !== undefined &&
            !(element instanceof NationalInstruments.HtmlVI.Elements.NIElement);
    };

    NationalInstruments.HtmlVI.NISupport.isElement = function (element) {
        return element.niControlId !== undefined ||
            element instanceof NationalInstruments.HtmlVI.Elements.NIElement;
    };

    NI_SUPPORT.defineConstReference = function (objTarget, propName, value) {
        Object.defineProperty(objTarget, propName, {
            configurable: false,    // Property may not be deleted
            enumerable: false,      // Property does not show up in for..in loops
            writable: false,        // Assignment operator has no effect
            value: value
        });
    };

    NI_SUPPORT.setValuePropertyDescriptor = function (objTarget, attributeName, propertyName, propertyNameNonSignaling, eventName) {
        if (objTarget.hasOwnProperty('valuePropertyDescriptor')) {
            throw new Error('valuePropertyDescriptor has already been set');
        }

        NI_SUPPORT.defineConstReference(objTarget, 'valuePropertyDescriptor', Object.freeze({
            attributeName: attributeName,
            propertyName: propertyName,
            propertyNameNonSignaling: propertyNameNonSignaling,
            eventName: eventName
        }));
    };

    // Wrappers for console functions
    var noop = function () {};

    NI_SUPPORT.log = console.log.bind(console);
    NI_SUPPORT.error = console.error.bind(console);
    NI_SUPPORT.debug = console.debug.bind(console);
    NI_SUPPORT.info = console.info.bind(console);
    NI_SUPPORT.group = console.group.bind(console);
    NI_SUPPORT.groupEnd = console.groupEnd.bind(console);

    // Change VERBOSE to true to enable additional logging. Used for REPARENTING, etc.
    NI_SUPPORT.defineConstReference(NI_SUPPORT, 'VERBOSE', false);
    NI_SUPPORT.defineConstReference(NI_SUPPORT, 'VERBOSE_INFO', false);

    NI_SUPPORT.logVerbose = NI_SUPPORT.VERBOSE ? console.log.bind(console) : noop;
    NI_SUPPORT.errorVerbose = NI_SUPPORT.VERBOSE ? console.error.bind(console) : noop;
    NI_SUPPORT.debugVerbose = NI_SUPPORT.VERBOSE ? console.debug.bind(console) : noop;
    NI_SUPPORT.infoVerbose = NI_SUPPORT.VERBOSE && NI_SUPPORT.VERBOSE_INFO ? console.info.bind(console) : noop;
    NI_SUPPORT.groupVerbose = NI_SUPPORT.VERBOSE ? console.group.bind(console) : noop;
    NI_SUPPORT.groupEndVerbose = NI_SUPPORT.VERBOSE ? console.groupEnd.bind(console) : noop;

    NI_SUPPORT.uniqueId = function () {
        // Math.random should be unique because of its seeding algorithm. // TODO mraj this statement is not true, and looks like it was copied from here: https://gist.github.com/gordonbrander/2230317
        // Convert it to base 36 (numbers + letters), and grab the first 9 characters
        // after the decimal.
        return '_' + Math.random().toString(36).substr(2, 9);
    };

    // Escape a string so that it can be safely used in HTML. ie NI_SUPPORT.escapeHTML('<hi>') // &lt;hi&gt;
    (function () {
        var div = document.createElement('div');

        NI_SUPPORT.escapeHtml = function (text) {
            div.textContent = text;
            return div.innerHTML;
        };
    }());

    // TODO mraj this needs to be moved to a location more relevant to its usage
    // Defines Events enum for Event Structure support
    // We need to keep this values in synchrony with the ones defined in CommonEventIndex.cs
    NationalInstruments.HtmlVI.EventsEnum = Object.freeze({
        NONE: 0,
        CLICK: 1,
        VALUE_CHANGE: 2,
        RIGHT_CLICK: 3,
        BUTTON_CLICK: 4
    });
}());

// inheritFromParent must be created outside the 'use strict' block
NationalInstruments.HtmlVI.NISupport.inheritFromParent = function (childType, parentType) {
    /* jshint strict:false */
    // TODO mraj Safari 8 will throw an Exception trying to modify the constructor property in strict mode
    // Possibly related to (https://bugs.webkit.org/show_bug.cgi?id=74193) Custom elements extend from HTMLElement and in Safari HTMLElement is not a constructor function

    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    if (Object.keys(childType.prototype).length > 0) {
        throw new Error('Properties added to the constructor function prototype object are lost during function invocation. Add after function invocation');
    }

    try {
        // The default constructor function prototype object inherts from window.Object. Create a new constructor function prototype object that inherits from parent.
        // Note: This will discard the existing childType.prototype so make sure to invoke inheritFromParent before adding to the childType.prototype
        childType.prototype = Object.create(parentType.prototype);

        // The default constructor reference points to the window.Object function constructor. Change the constructor reference to now point to the child.
        childType.prototype.constructor = childType;

    } catch (e) {
        NI_SUPPORT.log(e.message);
    }

    return childType.prototype;
};

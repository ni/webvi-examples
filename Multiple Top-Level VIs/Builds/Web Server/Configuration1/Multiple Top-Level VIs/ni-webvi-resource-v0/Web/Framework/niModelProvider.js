//****************************************
// Custom Element Extensions
// National Instruments Copyright 2014
//****************************************
(function () {
    'use strict';
    // Static Private Reference Aliases
    // var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ModelProvider = function () {
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
    var child = NationalInstruments.HtmlVI.ModelProvider;
    var proto = child.prototype;

    // Static Private Variables
    var TagMap = [];
    var ModelKindMap = [];
    var ModelFactory = [];
    var ViewModelFactory = [];

    // Static Private Functions
    // None

    // Public Prototype Methods
    proto.registerModel = function (modelConstructor) {
        ModelFactory[modelConstructor.MODEL_KIND] = function () {
            var obj = Object.create(modelConstructor.prototype);
            var constructorReturnValue = modelConstructor.apply(obj, arguments);
            return (constructorReturnValue === undefined) ? obj : constructorReturnValue;
        };

    };

    proto.makeModel = function (kind, id) {
        if (ModelFactory[kind] !== undefined) {
            return ModelFactory[kind](id);
        }

        throw new Error('Cannot find model constructor with kind: ' + kind);
    };

    proto.registerViewModel = function (viewModelConstructor, elementConstructor, modelConstructor, elementTagName) {
        var tagName;
        if (elementTagName !== undefined) {
            tagName = elementTagName;
        } else {
            tagName = elementConstructor.prototype.elementInfo.tagName;
        }

        TagMap[tagName] = modelConstructor.MODEL_KIND;
        ModelKindMap[modelConstructor.MODEL_KIND] = tagName;

        ViewModelFactory[modelConstructor.MODEL_KIND] = function () {
            var obj = Object.create(viewModelConstructor.prototype);
            var constructorReturnValue = viewModelConstructor.apply(obj, arguments);
            return (constructorReturnValue === undefined) ? obj : constructorReturnValue;
        };
    };

    proto.makeViewModel = function (element, model) {
        var kind = TagMap[element.elementInfo.tagName];

        if (kind === undefined) {
            throw new Error('Cannot find model kind associated with tag: ' + element.elementInfo.tagName);
        }

        if (typeof ViewModelFactory[kind] !== 'function') {
            throw new Error('Cannot find viewmodel constructor function for model kind: ' + kind);
        }

        return ViewModelFactory[kind](element, model);
    };

    proto.tagNameToModelKind = function (elementTag) {
        if (typeof TagMap[elementTag] !== 'string') {
            throw new Error('Cannot find model kind for tag: ' + elementTag);
        }

        return TagMap[elementTag];
    };

    proto.modelKindToTagName = function (modelKind) {
        if (typeof ModelKindMap[modelKind] !== 'string') {
            throw new Error('Cannot find tag for model kind: ' + modelKind);
        }

        return ModelKindMap[modelKind];
    };
}());

// Create Global Singleton
NationalInstruments.HtmlVI.NIModelProvider = new NationalInstruments.HtmlVI.ModelProvider();

//****************************************
// NI Control Reparenting Cache
// National Instruments Copyright 2014
//****************************************

// *****************
// NOTE: If changes are made to this file, make sure to run the Reparenting Regression Test prior to submission: https://nitalk.jiveon.com/docs/DOC-358124
// *****************

(function () {
    'use strict';
    // Static Private Reference Aliases
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;

    // Constructor Function
    NationalInstruments.HtmlVI.ElementReparentingCache = function () {

        // Public Instance Properties
        // keys are parentIds and values are arrays of elements, ie buffer = {'Function3': [childElem1, childElem2]}
        this.buffer = {};

        // Private Instance Properties
        // None
    };

    // Static Public Variables
    // None

    // Static Public Functions
    // None

    // Prototype creation
    var child = NationalInstruments.HtmlVI.ElementReparentingCache;
    var proto = child.prototype;

    // Static Private Variables
    // None

    // Static Private Functions
    var flushRecur = function (parentId, parentElement, buffer) {
        var i;
        if (buffer[parentId] !== undefined) {
            for (i = 0; i < buffer[parentId].length; i++) {
                parentElement.appendChild(buffer[parentId][i]);
            }

            for (var j = 0; j < buffer[parentId].length; j++) {
                flushRecur(buffer[parentId][j].niControlId, buffer[parentId][j], buffer);
            }

            buffer[parentId] = undefined;
        }

    };

    // Public Prototype Methods
    proto.addToElementCache = function (parentId, element) {
        this.printBuffer('Element Reparenting Cache (Before Add)');
        if (this.buffer[parentId] === undefined) {
            this.buffer[parentId] = [];
        }

        var parentBuffer = this.buffer[parentId];
        var parentBufferElementIndex = -1;

        for (var i = 0; i < parentBuffer.length; i++) {
            if (parentBuffer[i].niControlId === element.niControlId) {

                parentBufferElementIndex = i;
                break;
            }
        }

        if (parentBufferElementIndex === -1) {
            parentBuffer.push(element);
        } else {
            parentBuffer[i] = element;
            NI_SUPPORT.errorVerbose('Element replaced for parent id', parentId, 'because buffer already has element for id', element.niControlId);
        }

        this.printBuffer('Element Reparenting Cache (After Add)');
    };

    proto.removeElementFromCache = function (element) {
        this.printBuffer('Element Reparenting Cache (Before Remove)');
        var id;
        for (id in this.buffer) {
            if (this.buffer.hasOwnProperty(id)) {
                var parentBuffer = this.buffer[id];
                if (parentBuffer === undefined) {
                    continue;
                }

                var parentBufferElementIndex = -1;

                for (var i = 0; i < parentBuffer.length; i++) {
                    if (parentBuffer[i].niControlId === element.niControlId) {
                        parentBufferElementIndex = i;
                        break;
                    }
                }

                if (parentBufferElementIndex !== -1) {
                    parentBuffer.splice(parentBufferElementIndex, 1);
                }
            }
        }

        this.printBuffer('Element Reparenting Cache (After Remove)');
    };

    proto.flushElementCache = function (parentId, parentElement) {
        this.printBuffer('Element Reparenting Cache (Before Flush)');

        if (typeof parentId === 'string' && this.buffer[parentId] !== undefined && NI_SUPPORT.isElement(parentElement)) {
            flushRecur(parentId, parentElement, this.buffer);
            delete this.buffer[parentId];
        }

        this.printBuffer('Element Reparenting Cache (After Flush)');
    };

    proto.printBuffer = function (groupName) {
        var that = this;

        if (NI_SUPPORT.VERBOSE_INFO) {
            if (Object.keys(that.buffer).length === 0) {
                NI_SUPPORT.infoVerbose(groupName + ': empty');
            } else {
                NI_SUPPORT.groupVerbose(groupName);
                Object.keys(that.buffer).forEach(function (val) {
                    var childrenIds;
                    if (that.buffer[val] !== undefined) {
                        childrenIds = that.buffer[val].map(function (el) {
                            return el.niControlId;
                        }).join(',');
                    }

                    NI_SUPPORT.infoVerbose('parentId:', val, 'childrenId(s):', childrenIds);
                });
                NI_SUPPORT.groupEndVerbose();
            }
        }
    };

}());

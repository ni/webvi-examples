//**************************************
// ArrayViewer Control Prototype
// DOM Registration: No
// National Instruments Copyright 2014
//**************************************

// Constructor Function: Empty (Not Invoked)
NationalInstruments.HtmlVI.Elements.ArrayViewer = function () {
    'use strict';
};

// Static Public Variables
// None

(function (child, parent) {
    'use strict';
    // Static Private Reference Aliases
    var $ = NationalInstruments.Globals.jQuery;
    var NI_SUPPORT = NationalInstruments.HtmlVI.NISupport;
    var NI_VAL_CONVERTER = NationalInstruments.HtmlVI.ValueConverters.ElementValueConverter;

    NI_SUPPORT.inheritFromParent(child, parent);
    var proto = child.prototype;

    // Static Private Variables
    var CSS_PROPERTIES = ['fontSize', 'fontFamily', 'fontWeight', 'fontStyle', 'width', 'height', 'left', 'top'];

    // Static Private Functions

    // Gets a CSS selector for an NI visual. Note: The selector will only represent this element, it won't
    // walk up the DOM hierarchy. To get a complete selector (that can represent a control in an array in a cluster
    // in an array, for example), use getFullCssSelectorForNIVisual.
    var getCssSelectorForNIVisual = function (element, isInArrayTemplate, isLastElement) {
        var selector = element.tagName, parent = element.parentElement, i, n, curNode;
        if (parent instanceof NationalInstruments.HtmlVI.Elements.Cluster) {
            n = 1;
            for (i = 0; i < parent.childNodes.length; i++) {
                curNode = parent.childNodes[i];
                if (curNode === element) {
                    break;
                } else if (curNode.tagName === element.tagName) {
                    n++;
                }
            }

            selector = selector + ':nth-of-type(' + n + ')';
        }

        if (!isInArrayTemplate && element.niControlId !== undefined) {
            selector = selector + '[ni-control-id=\'' + element.niControlId + '\']';
        }

        if (element instanceof NationalInstruments.HtmlVI.Elements.ArrayViewer && isLastElement !== true) {
            if (isInArrayTemplate) {
                selector = selector + ' > div > div > div > div > table > tbody > tr > td > div.jqx-array-element';
            } else {
                selector = selector + ' div.jqx-array-element-' + element.childElement.id;
            }
        }

        return selector;
    };

    // Gets a full CSS selector for an NI Visual inside an array.
    // Note: The input arrayViewer should be the outermost / root one, for array-in-array
    // scenarios.
    var getFullCssSelectorForNIVisual = function (arrayViewer, targetElement) {
        var targetAndDescendants = [], curNode = targetElement;
        var selector;

        while (curNode !== arrayViewer && curNode !== null) {
            targetAndDescendants.push(curNode);
            curNode = curNode.parentElement;
        }

        if (curNode === null) {
            return null;
        }

        selector = getCssSelectorForNIVisual(arrayViewer, false, targetAndDescendants.length === 0);

        while (targetAndDescendants.length > 0) {
            curNode = targetAndDescendants.pop();
            selector = selector.concat(' > ', getCssSelectorForNIVisual(curNode, true, targetAndDescendants.length === 0));
        }

        return selector;
    };

    var setArrayValue = function (arrayViewer, val, userUpdate) {
        if (arrayViewer._settingArrayValue === true || arrayViewer._clearingArrayValue === true || arrayViewer._creatingArrayValue === true) {
            return;
        }

        arrayViewer._settingArrayValue = true;
        // When array becomes type=none, code gets triggered to set the value to null. But ni-array-viewer defaults to [] instead,
        // so we use that. The jqxArray has some issues if it has a type set but a value of null (possible because when we reinitialize
        // it, if _arrayValue=null then, we'd change the jqxArray value to null too)
        arrayViewer._arrayValue = val !== null ? val : [];

        if (userUpdate) {
            arrayViewer.dispatchEvent(new CustomEvent('value-changed', {
                bubbles: true,
                cancelable: false,
                detail: { value: val }
            }));
        } else if (arrayViewer.childElement !== null) {
            $(arrayViewer.childElement).jqxArray({ value: arrayViewer._arrayValue });
        }

        arrayViewer._settingArrayValue = false;
    };

    var parseInitialValue = function (attributeValue) {
        var result = [], parsedVal;
        if (attributeValue !== null) {
            try {
                parsedVal = JSON.parse(attributeValue);
                if (Array.isArray(parsedVal)) {
                    result = parsedVal;
                }
            } catch (e) {
                // If the attribute valid is invalid, we don't want to throw, just fallback to a default
            }
        }

        return result;
    };

    // Public Prototype Methods
    proto.addAllProperties = function (targetPrototype) {
        parent.prototype.addAllProperties.call(this, targetPrototype);

        Object.defineProperty(proto, 'value', {
            get: function () {
                return this._arrayValue;
            },
            set: function (val) {
                setArrayValue(this, val, true);
            },
            configurable: false,
            enumerable: true
        });

        Object.defineProperty(proto, 'valueNonSignaling', {
            get: function () {
                return this._arrayValue;
            },
            set: function (val) {
                setArrayValue(this, val, false);
            },
            configurable: false,
            enumerable: false
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'niType',
            defaultValue: '{"name":"Array","rank":1,"subtype":"Void"}'
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'dimensions',
            defaultValue: 1
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'orientation',
            defaultValue: 'horizontal'
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'indexEditorWidth',
            defaultValue: 46
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'indexVisibility',
            defaultValue: false
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'verticalScrollbarVisibility',
            defaultValue: false
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'horizontalScrollbarVisibility',
            defaultValue: false
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'focusedCell',
            defaultValue: ''
        });

        proto.addProperty(targetPrototype, {
            propertyName: 'rowsAndColumns',
            defaultValue: '1,1'
        });

        NI_SUPPORT.setValuePropertyDescriptor(targetPrototype, 'value', 'value', 'valueNonSignaling', 'value-changed');
    };

    proto.getFullCssSelectorForNIVisual = function (targetElement) {
        return getFullCssSelectorForNIVisual(this, targetElement);
    };

    proto.arrayElementSizeChanged = function (elementSize) {
        var controls, i, niControl, cssWidth, cssHeight;
        var width = elementSize.width;
        var height = elementSize.height;

        if (width === this._elementWidth && height === this._elementHeight) {
            return;
        }

        this._elementWidth = width;
        this._elementHeight = height;

        cssWidth = width + 'px';
        cssHeight = height + 'px';

        this.nodeCss[this.templateControl.niControlId].width = cssWidth;
        this.nodeCss[this.templateControl.niControlId].height = cssHeight;

        $(this.childElement).jqxArray('resizeElement', width, height);

        controls = document.querySelectorAll(getCssSelectorForNIVisual(this, false));
        for (i = 0; i < controls.length; i++) {
            niControl = controls[i].firstElementChild;
            niControl.style.width = cssWidth;
            niControl.style.height = cssHeight;
        }
    };

    proto.createdCallback = function () {
        var that = this;
        parent.prototype.createdCallback.call(this);

        // Public Instance Properties
        this.childElement = null;
        this.nodeCss = {};
        this.templateControl = null;
        this.mutationObserver = null;
        this.attributeMutationObserver = null;
        Object.defineProperty(this, 'elementSize', {
            configurable: false,
            enumerable: true,
            get: function () {
                return { width: this._elementWidth, height: this._elementHeight };
            },
            set: function (value) {
                that.arrayElementSizeChanged(value);
            }
        });
        this.rows = 1;
        this.columns = 1;
        // Private Instance Properties
        this._userUpdate = false;
        this._settingArrayValue = false;
        this._useAttributeMutationObserver = true;
        this._elementWidth = 0;
        this._elementHeight = 0;
        this._nodeLabelMap = [];
        this._emptyWidth = '10px';
        this._emptyHeight = '10px';
        this._clearingArrayValue = false;
        this._creatingArrayValue = false;
        this._arrayValue = parseInitialValue(this.getAttribute('value'));
    };

    proto.clearArrayType = function (wasInitialized) {
        this._clearingArrayValue = true;
        if (wasInitialized) {
            // We'll set size separately (the editor computes it, and it'll come here via forceResize)
            $(this.childElement).jqxArray({
                type: 'none',
                dimensions: this.dimensions,
                indexerWidth: this.indexEditorWidth,
                showIndexDisplay: this.indexVisibility
            });
            this.resetArrayContainer();
        } else {
            $(this.childElement).jqxArray({
                width : this.style.width,
                height : this.style.height,
                type: 'none',
                dimensions: this.dimensions,
                indexerWidth: this.indexEditorWidth,
                showIndexDisplay: this.indexVisibility
            });
            var id = this.childElement.id;
            this._emptyWidth = $('#' + id + 'BigContainer').width();
            this._emptyHeight = $('#' + id + 'BigContainer').height();
        }

        this._clearingArrayValue = false;
    };

    proto.forceResize = function (size) {
        parent.prototype.forceResize.call(this, size);
        if (this.templateControl === null) {
            $(this.childElement).jqxArray({
                width: size.width + 'px',
                height: size.height + 'px'
            });
        }
    };

    proto.attachedCallback = function () {
        var firstCall = parent.prototype.attachedCallback.call(this);

        if (firstCall) {
            var node = null, i;
            var that = this;

            this.parseRowsAndColumns();

            for (i = 0; i < this.childNodes.length; i++) {
                if (this.childNodes[i].tagName !== 'NI-LABEL') {
                    node = this.childNodes[i];
                    break;
                }
            }

            this.childElement = document.createElement('div');
            this.appendChild(this.childElement);
            if (node !== null) {
                // Delay initialization until all elements are registered and attached. Even if the template
                // element is ready, a descendant might not be (e.g. if the template is a cluster and it contains
                // another control).
                NationalInstruments.HtmlVI.Elements.NIElement.addNIEventListener('attached', function () {
                    that.createArray(node);
                });
            } else {
                this.clearArrayType(false);
            }

            var mutationObserver = new window.MutationObserver(function (mutations) {
                mutations.forEach(function (m) {
                    if (m.type === 'childList') {
                        if (m.target === that) {
                            mutationObserver.disconnect();
                            if (m.addedNodes.length === 1 && NI_SUPPORT.isElement(m.addedNodes[0]) && m.addedNodes[0].tagName !== 'NI-LABEL') { // can only accept one child
                                node = m.addedNodes[0];
                                $(node).addClass('array-template');
                                that.createArray(node);
                            } else if (m.removedNodes.length > 0 && NI_SUPPORT.isElement(m.removedNodes[0])) {
                                that.templateControl = null;
                                that.clearArrayType(true);
                            }

                            if (mutationObserver.observe !== undefined) {
                                mutationObserver.observe(that, { childList: true, attributes: false, subtree: false });
                            }
                        }
                    }
                });
            });

            if (mutationObserver.observe !== undefined) {
                mutationObserver.observe(this, { childList: true, attributes: false, subtree: false });
            }

            this.mutationObserver = mutationObserver;

            $(this.childElement).on('change', function () {
                that.value = $(that.childElement).val();
            });
            $(this.childElement).on('scroll', function () {
                var indices = $(that.childElement).jqxArray('getIndexerValue');
                var eventConfig = {
                    bubbles: true,
                    cancelable: true,
                    detail: {
                        indices: indices,
                        originalSource: this.childElement
                    }
                };
                that.dispatchEvent(new CustomEvent('scroll-changed', eventConfig));
            });
        }

        return firstCall;
    };

    proto.detachedCallback = function () {
        parent.prototype.detachedCallback.call(this);

        if (this.mutationObserver !== null) {
            if (typeof this.mutationObserver.disconnect === 'function') {
                this.mutationObserver.disconnect();
            }

            this.mutationObserver = null;
        }

        this.templateControl = null;
    };

    proto.updateFromTemplate = function (control, node, updatePosition) {
        var i, j, nodeCss;
        control.niControlId = NI_SUPPORT.uniqueId();
        control._preventModelCreation = true;
        control.visible = true;
        nodeCss = this.nodeCss[node.niControlId];
        if (nodeCss === undefined) {
            nodeCss = $(node).css(CSS_PROPERTIES);
            this.nodeCss[node.niControlId] = nodeCss;
        }

        control.style.width = nodeCss.width;
        control.style.height = nodeCss.height;
        control.style.display = '';
        if (updatePosition) {
            control.style.left = nodeCss.left;
            control.style.top = nodeCss.top;
        } else {
            control.style.left = '';
            control.style.top = '';
        }

        control.style.fontSize = nodeCss.fontSize;
        control.style.fontFamily = nodeCss.fontFamily;
        control.style.fontWeight = nodeCss.fontWeight;
        control.style.fontStyle = nodeCss.fontStyle;
        j = 0;
        for (i = 0; i < node.childNodes.length; i++) {
            if (NI_SUPPORT.isElement(node.childNodes[i]) && control.childNodes[j] !== undefined) {
                this.updateFromTemplate(control.childNodes[j], node.childNodes[i], true);

                if (node.childNodes[i].tagName === 'NI-LABEL') {
                    this._nodeLabelMap[node.childNodes[i].niControlId] = control.childNodes[j].niControlId;
                }

                j++;
            }
        }
    };

    proto.updateLabelIds = function (node) {
        var i, label;
        if (!NI_SUPPORT.isElement(node)) {
            return null;
        }

        for (i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes[i].tagName !== 'NI-LABEL') {
                label = this._nodeLabelMap[node.childNodes[i].labelId];
                if (label === undefined) { // This can be unset when we recurse into an array viewer - its template element doesn't have a label
                    label = '';
                }

                node.childNodes[i].labelId = label;
                this.updateLabelIds(node.childNodes[i]);
            }
        }
    };

    proto.copyNIElement = function (node) {
        if (!NI_SUPPORT.isElement(node)) {
            return null;
        }

        var newNode = node.cloneNode(false);
        // niTemplate should always be a 'real' / original niControlId (a number). This allows us to look up
        // the real / original template control from all of our copies (for array elements and nested arrays).
        newNode._niTemplateId = node._niTemplateId !== undefined ? node._niTemplateId : node.niControlId;
        if (node.childNodes.length > 0) {
            for (var i = 0; i < node.childNodes.length; i++) {
                var childNode = this.copyNIElement(node.childNodes[i]);
                if (childNode !== null) {
                    newNode.appendChild(childNode);
                }
            }
        }

        return newNode;
    };

    proto.updateTemplateCss = function (templateDescendant) {
        var curNodeCss = $(templateDescendant).css(CSS_PROPERTIES);
        this.nodeCss[templateDescendant.niControlId] = curNodeCss;
    };

    proto.recreateCells = function (fullRefresh) {
        var r, c, cell, that = this;

        var recreateCell = function (r, c) {
            var val, cellSelector;
            cell = $(that.childElement).jqxArray('getElement', r, c);
            if (cell !== null && cell !== undefined) {
                cellSelector = $(cell);
                val = $(that.childElement).jqxArray('getElementValue', cellSelector, { x: c, y: r });
                while (cell.hasChildNodes()) {
                    cell.removeChild(cell.lastChild);
                }

                $(that.childElement).jqxArray('elementTemplate', cellSelector);
                $(that.childElement).jqxArray('setElementValue', val, cellSelector, { x: c, y: r });
            }
        };

        if (fullRefresh) {
            for (r = 0; r < this.rows; r++) {
                for (c = 0; c < this.columns; c++) {
                    recreateCell(r, c);
                }
            }
        } else if (this._focusedColumn !== undefined && this._focusedRow !== undefined) {
            recreateCell(this._focusedRow, this._focusedColumn);
        }

        window.requestAnimationFrame(function () {
            that.updateFocusedCell();
        });
    };

    proto.setDefaultValue = function (modelValue) {
        $(this.childElement).jqxArray('setDefaultValue', modelValue);
    };

    proto.createArray = function (node) {
        var that = this;
        this._creatingArrayValue = true;
        var propertyName = node.valuePropertyDescriptor.propertyName;
        var eventName = node.valuePropertyDescriptor.eventName;
        var nonSignalingPropertyName = node.valuePropertyDescriptor.propertyNameNonSignaling;
        var defaultValue = node[propertyName];
        var curNodeCss;
        node.style.left = '0px';
        node.style.top = '0px';
        node.style.display = 'none';

        node.labelId = '';
        this.templateControl = node;

        if (defaultValue !== undefined) {
            defaultValue = NI_VAL_CONVERTER.ConvertBack(node, defaultValue);
        }

        this.nodeCss = {};
        curNodeCss = $(node).css(CSS_PROPERTIES);
        this.nodeCss[node.niControlId] = curNodeCss;

        this._elementWidth = parseInt(curNodeCss.width);
        this._elementHeight = parseInt(curNodeCss.height);

        $(this.childElement).jqxArray({
            elementWidth: this._elementWidth,
            elementHeight: this._elementHeight,
            elementTemplate: function (div) {
                that._nodeLabelMap = [];
                var control = that.copyNIElement(node);
                $(control).removeClass('array-template');
                var divElement = div[0];
                var curNodeCss = that.nodeCss[node.niControlId];
                that.updateFromTemplate(control, node, false);
                that.updateLabelIds(control);
                divElement.style.width = curNodeCss.width;
                divElement.style.height = curNodeCss.height;
                divElement.appendChild(control);
                $(control).on(eventName, function (event) {
                    if (event.originalEvent.srcElement === control && event.originalEvent.srcElement === event.originalEvent.target) {
                        if (!div.supressChange) {
                            div.trigger('change');
                        }
                    }
                });
            },
            changeProperty: function (property, value, widgets) {
                if (property === 'width') {
                    widgets.css({ width: value });
                } else if (property === 'height') {
                    widgets.css({ height: value });
                } else if (property === 'disabled') {
                    widgets.css({ disabled: value });
                }
            },
            getElementValue: function (div, dimensions) {
                // jshint unused:vars
                var element = div[0].firstElementChild;
                var val = element[propertyName];
                if (val !== undefined) {
                    return NI_VAL_CONVERTER.ConvertBack(element, val);
                }

                return val;
            },
            setElementValue: function (value, div, dimensions) {
                // jshint unused:vars
                if (value !== undefined) {
                    var element = div[0].firstElementChild;
                    element[nonSignalingPropertyName] = NI_VAL_CONVERTER.Convert(element, value);
                }
            },
            type: 'custom',
            dimensions: this.dimensions,
            indexerWidth: this.indexEditorWidth,
            showIndexDisplay: this.indexVisibility,
            customWidgetDefaultValue: defaultValue,
            value: that._arrayValue
        });
        // TODO : We'd like to be able to send rows and columns in the same
        // jqxArray statement as above. However, this causes issues when you have
        // an initialized array (with > 1 rows or columns), delete the array element,
        // then undo (there's extra cells rendered that shouldn't be there).
        $(this.childElement).jqxArray({
            rows: this.rows,
            columns: this.columns
        });
        $(this.childElement).jqxArray({
            showHorizontalScrollbar: this.horizontalScrollbarVisibility,
            showVerticalScrollbar: this.verticalScrollbarVisibility
        });

        // Adding CSS class names
        var jqref = $(this.childElement);
        jqref.addClass('ni-array-viewer-box');
        jqref.find(' .jqx-array-indexer').addClass('ni-indexer-box');
        jqref.find(' .jqx-input-content').addClass('ni-text-field');
        jqref.find(' .jqx-input.jqx-rc-r').addClass('ni-spins-box');
        jqref.find(' .jqx-action-button').addClass('ni-spin-button');
        jqref.find(' .jqx-icon-arrow-up').addClass('ni-increment-icon');
        jqref.find(' .jqx-icon-arrow-down').addClass('ni-decrement-icon');

        this.updateFocusedCell();
        this._creatingArrayValue = false;
    };

    proto.propertyUpdated = function (propertyName) {
        parent.prototype.propertyUpdated.call(this, propertyName);

        switch (propertyName) {
            case 'dimensions':
                $(this.childElement).jqxArray({ dimensions: this.dimensions, rows: this.rows, columns: this.columns });
                this.updateIndexerFont();
                break;
            case 'indexEditorWidth':
                $(this.childElement).jqxArray({ indexerWidth: this.indexEditorWidth });
                break;
            case 'indexVisibility':
                $(this.childElement).jqxArray({ showIndexDisplay: this.indexVisibility });
                break;
            case 'verticalScrollbarVisibility':
                $(this.childElement).jqxArray({ showVerticalScrollbar: this.verticalScrollbarVisibility });
                break;
            case 'horizontalScrollbarVisibility':
                $(this.childElement).jqxArray({ showHorizontalScrollbar: this.horizontalScrollbarVisibility });
                break;
            case 'orientation':
                break;
            case 'focusedCell':
                this.updateFocusedCell();
                break;
            case 'rowsAndColumns':
                this.updateRowsAndColumns();
                break;
            default:
                break;
        }
    };

    proto.updateFocusedCell = function () {
        var indices, i, curCell, matches, templateMatch, r, c;

        if (this.templateControl === null) {
            return;
        }

        if (typeof this.focusedCell === 'string' && this.focusedCell.length > 0) {
            indices = this.focusedCell.split(',');
            if (indices.length === 2) {
                r = parseInt(indices[0]);
                c = parseInt(indices[1]);
                this._focusedRow = r;
                this._focusedColumn = c;

                curCell = $(this.childElement).jqxArray('getElement', r, c);
                if (curCell === undefined || curCell === null) {
                    // We can get a focused cell index from C# that hasn't yet been created. In this case, we'll do the code below later
                    // (updateRowsAndColumns also triggers this)
                    return;
                }

                matches = curCell.querySelectorAll('[ni-control-id]');
                for (i = 0; i < matches.length; i++) {
                    if (matches[i]._niTemplateId !== undefined) {
                        templateMatch = document.querySelector('[ni-control-id=\'' + matches[i]._niTemplateId + '\']');
                        if (templateMatch !== null) {
                            templateMatch._niFocusedCloneId = matches[i].niControlId;
                        }
                    }
                }

                return;
            }
        }

        this._focusedRow = undefined;
        this._focusedColumn = undefined;
        matches = Array.prototype.slice.call(this.templateControl.querySelectorAll('[ni-control-id]'));
        matches.push(this.templateControl);
        for (i = 0; i < matches.length; i++) {
            matches[i]._niFocusedCloneId = undefined;
        }
    };

    proto.parseRowsAndColumns = function () {
        var indices;
        if (typeof this.rowsAndColumns === 'string' && this.rowsAndColumns.length > 0) {
            indices = this.rowsAndColumns.split(',');
            if (indices.length === 2) {
                this.rows = parseInt(indices[0]);
                this.columns = parseInt(indices[1]);
            }
        }
    };

    proto.updateRowsAndColumns = function () {
        var oldRows, oldColumns;

        this.parseRowsAndColumns();

        // We can get a rows and columns update when we don't have an array element (if you undo the delete of an array element, there'll be separate
        // messages: first to put back the old rows and columns value, then to put back the array element. So don't update the jqxArray if we don't
        // have an array element (createArray will also set rows and columns).
        if (this.templateControl === null) {
            return;
        }

        oldRows = $(this.childElement).jqxArray('rows');
        oldColumns = $(this.childElement).jqxArray('columns');

        if (this.rows !== oldRows || this.columns !== oldColumns) {
            if ($(this.childElement).val() === null) {
                // Nested arrays can end up with a null value, triggering an error in the jqxArray when you resize that nested array.
                // TODO : Track down why this happens
                $(this.childElement).jqxArray({ value: [] });
            }

            $(this.childElement).jqxArray({ rows: this.rows, columns: this.columns });
        }

        this.updateFocusedCell();
    };

    proto.setFont = function (fontSize, fontFamily, fontWeight, fontStyle, textDecoration) {
        parent.prototype.setFont.call(this, fontSize, fontFamily, fontWeight, fontStyle, textDecoration);

        var childElement = this.firstElementChild,
            jqrefIndexer,
            fontProperties = {
                'font-size': fontSize,
                'font-family': fontFamily,
                'font-weight': fontWeight,
                'font-style': fontStyle
            };

        jqrefIndexer = $(childElement).find(' .jqx-array-indexer');
        $(jqrefIndexer).css(fontProperties);
        $(childElement).trigger('refresh');
    };

    proto.updateIndexerFont = function () {
        var jqrefIndexer = $(this.childElement).find(' .jqx-array-indexer').last();
        var fontSize = $(jqrefIndexer).css('font-size');
        var fontFamily = $(jqrefIndexer).css('font-family');
        var fontWeight = $(jqrefIndexer).css('font-weight');
        var fontStyle = $(jqrefIndexer).css('font-style');
        var fontProperties = {
            'font-size': fontSize,
            'font-family': fontFamily,
            'font-weight': fontWeight,
            'font-style': fontStyle
        };
        jqrefIndexer = $(this.childElement).find(' .jqx-array-indexer');
        $(jqrefIndexer).css(fontProperties);
    };

    proto.resetArrayContainer = function () {
        var id = this.childElement.id;
        var height = $('#' + id).height();
        var newHeight = Math.max(parseFloat(this._emptyHeight), parseFloat(height)); // to account for indexers
        $('#' + id).height(newHeight + 'px');
        $('#' + id).width(parseFloat(this._emptyWidth) + parseFloat(this.indexEditorWidth) + 'px');
        $('#' + id + 'BigContainer').width(this._emptyWidth);
        $('#' + id + 'BigContainer').height(this._emptyHeight);
        $('#' + id + 'CentralContainer').width(this._emptyWidth);
        $('#' + id + 'MainContainer').height(this._emptyHeight);
    };

    proto.defineElementInfo(proto, 'ni-array-viewer', 'HTMLNIArrayViewer');
}(NationalInstruments.HtmlVI.Elements.ArrayViewer, NationalInstruments.HtmlVI.Elements.Visual));

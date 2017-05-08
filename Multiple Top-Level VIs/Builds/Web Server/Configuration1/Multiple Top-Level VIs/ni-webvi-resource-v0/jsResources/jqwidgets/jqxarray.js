(function ($)
{
    'use strict';

    $.jqx.jqxWidget('jqxArray', '', {});

    $.extend($.jqx._jqxArray.prototype, {
        defineInstance: function ()
        {
            var settings = {
                // properties
                width: null,
                height: null,
                type: 'none', // possible values: 'none', 'numeric', 'boolean', 'string', 'path', 'custom'
                value: null,
                dimensions: 1,
                rows: 1,
                columns: 1,
                elementWidth: 75,
                elementHeight: 25,
                showIndexDisplay: true,
                indexerWidth: 50,
                indexerHeight: 25,
                showVerticalScrollbar: false,
                showHorizontalScrollbar: false,
                showSelection: true,
                disabled: false,
                customWidgetDefaultValue: null,
                elementTemplate: null, // callback function
                changeProperty: null, // callback function
                getElementValue: null, // callback function
                setElementValue: null, // callback function
                arrayIndexingMode: 'LabVIEW', // possible values: 'LabVIEW', 'JavaScript'

                // events
                events: ['change', 'elementClick', 'sizeChange', 'dimensionChange', 'arraySizeChange', 'scroll']
            };
            $.extend(true, this, settings);
        },

        createInstance: function ()
        {
            this._render();
        },

        // renders the widget
        _render: function ()
        {
            var that = this;

            that._coordinates = [];
            that._getDefaultCellValue();
            that._validateProperties();
            that._addClasses();
            that._addInnerElements();
            that._addInitialDimensions();
            if (that.type !== 'none')
            {
                that._addElementStructure();
                that._structureAdded = true;
                that._initializeElements(false);
            }
            that._getInitialFill();
            that._updateWidgetWidth();
            that._updateWidgetHeight();
        },

        render: function ()
        {
            this.refresh();
        },

        // refreshes the widget
        refresh: function (initialRefresh)
        {
            if (initialRefresh !== true)
            {
                var that = this;
                that._updateWidgetWidth();
                that._updateWidgetHeight();
                that._scroll();
            }
        },

        // destroys the widget
        destroy: function ()
        {
            var that = this;
            for (var i = 0; i < that._indexers.length; i++)
            {
                that._indexers[i].jqxNumberInput('destroy');
            }
            if (that._hScrollBarInitialized)
            {
                that._horizontalScrollBar.jqxScrollBar('destroy');
            }
            if (that._vScrollBarInitialized)
            {
                that._verticalScrollBar.jqxScrollBar('destroy');
            }
            if (that._widget)
            {
                $('.jqx-array-element-' + that.element.id)[that._widget]('destroy');
            }
            that.host.remove();
        },

        val: function (newValue, elementIndexes)
        {
            var that = this,
                oldValue;
            if (arguments.length === 2)
            {
                if (that.type === 'none')
                {
                    return;
                }
                oldValue = JSON.stringify(that.value);
                var tempArray = that.value;
                for (var i = 0; i < that.dimensions - 1; i++)
                {
                    var index = elementIndexes[i];
                    if (index === undefined)
                    {
                        index = 0;
                        elementIndexes[i] = 0;
                    }
                    if (tempArray[index] === undefined)
                    {
                        tempArray[index] = [];
                    }
                    tempArray = tempArray[index];
                }
                var lastIndex = elementIndexes[i];
                if (lastIndex === undefined)
                {
                    lastIndex = 0;
                    elementIndexes[i] = 0;
                }
                if (that._areDifferent(tempArray[lastIndex], newValue))
                {
                    tempArray[lastIndex] = newValue;
                    that._fillValueArray(elementIndexes.slice(0));
                    that._raiseEvent('0', { value: that.value, oldValue: JSON.parse(oldValue), dimensionIndexes: elementIndexes }); // change event
                }
            } else
            {
                if (newValue !== undefined && !$.isEmptyObject(newValue))
                {
                    if (that.type === 'none')
                    {
                        return;
                    }
                    var oldValueStringified = JSON.stringify(that.value);
                    if (oldValueStringified !== JSON.stringify(newValue))
                    {
                        oldValue = that.value;
                        that.value = newValue;
                        that._validateValue();
                        if (oldValueStringified !== JSON.stringify(that.value))
                        {
                            that._scroll();
                            that._getInitialFill();
                            that._raiseEvent('0', { value: that.value, oldValue: oldValue }); // change event
                        }
                    }
                } else
                {
                    return that.value;
                }
            }
        },

        addDimension: function (changeValueDimensions)
        {
            var that = this;

            if (that._suppressDimensionChange !== true && that.dimensions === 32)
            {
                return;
            }

            var indexer = $('<div class="jqx-array-indexer"></div>');
            that._indexerContainer.prepend(indexer);
            indexer.jqxNumberInput({ theme: that.theme, width: that.indexerWidth - 2, height: that.indexerHeight, inputMode: 'simple', decimalDigits: 0, spinButtons: true, min: 0, max: 4294967295, disabled: that.disabled });
            indexer.find('.jqx-icon-arrow-up').parent()[0].classList.add('jqx-array-indexer-increment');
            indexer.find('.jqx-icon-arrow-down').parent()[0].classList.add('jqx-array-indexer-decrement');
            that.addHandler(indexer, 'change.jqxArray' + that.element.id, function (event)
            {
                var dimension = $(this).data('dimension'),
                    actualDimension = that.arrayIndexingMode === 'LabVIEW' ? that.dimensions - dimension - 1 : dimension,
                    value = parseFloat(event.args.value);

                that._coordinates[actualDimension] = value;
                that._scroll();

                if (that.type !== 'none' && (dimension === 0 || dimension === 1))
                {
                    that._syncScrollbar(dimension, value);
                }
                event.stopPropagation();
            });
            that._dimensions.push({ index: that._dimensions.length, indexer: indexer });
            if (that.arrayIndexingMode === 'LabVIEW')
            {
                that._indexers.unshift(indexer);
                that._coordinates.unshift(0);
            } else
            {
                that._indexers.push(indexer);
                that._coordinates.push(0);
            }
            indexer.data({ 'dimension': that._indexers.length - 1 });
            if (that._suppressDimensionChange !== true)
            {
                that.dimensions += 1;
                that._raiseEvent('3', { type: 'add' }); // dimensionChange event               
            }
            if (that._initialDimensions !== true && changeValueDimensions !== false)
            {
                that._addDimensionToJSArray();
                if (that.arrayIndexingMode === 'LabVIEW')
                {
                    that._filledUpTo.unshift(0);
                } else
                {
                    that._filledUpTo.push(0);
                }
                if (that._oneDimensionSpecialCase === true)
                {
                    that._oneDimensionSpecialCase = false;
                    that._verticalScrollBar.val(0);
                    that._scroll();
                }
            }
            if (that._absoluteSelectionStart !== undefined)
            {
                that._absoluteSelectionStart.push(0);
            }
            if (that._absoluteSelectionEnd !== undefined)
            {
                that._absoluteSelectionEnd.push(0);
            }

            if (that._suppressDimensionChange === false && that.showIndexDisplay === true && (that.dimensions * (that.indexerHeight + 4) - 2 > that.height))
            {
                that._updateWidgetHeight('dimensions');
            }
        },

        removeDimension: function (propertyChangedHandler, changeValueDimensions)
        {
            var that = this,
                index = that._dimensions.length - 1;

            if (that._dimensions.length > 1)
            {
                if (that.dimensions === 2)
                {
                    var oldRowsCount = that.rows;
                    that.rows = 1;
                    that._changeRowsColumns('rows', oldRowsCount, 1, undefined, true);
                }
                that._dimensions[index].indexer.jqxNumberInput('destroy');
                that._dimensions.pop();
                var indexerValue;
                if (that.arrayIndexingMode === 'LabVIEW')
                {
                    indexerValue = that._coordinates[0];
                    that._indexers.splice(0, 1);
                    that._coordinates.splice(0, 1);
                } else
                {
                    indexerValue = that._coordinates[index];
                    that._indexers.pop();
                    that._coordinates.pop();
                }
                if (that._suppressDimensionChange !== true)
                {
                    that.dimensions -= 1;
                    that._raiseEvent('3', { type: 'remove' }); // dimensionChange event
                }
                if (changeValueDimensions !== false)
                {
                    that._removeDimensionFromJSArray();
                    if (that.arrayIndexingMode === 'LabVIEW')
                    {
                        that._filledUpTo.splice(0, 1);
                    } else
                    {
                        that._filledUpTo.pop();
                    }
                }
                if (that._absoluteSelectionStart !== undefined)
                {
                    that._absoluteSelectionStart.pop();
                }
                if (that._absoluteSelectionEnd !== undefined)
                {
                    that._absoluteSelectionEnd.pop();
                }
                if (indexerValue > 0)
                {
                    that._scroll();
                }

                if ((that.dimensions > 1 && that._suppressDimensionChange === false && that.showIndexDisplay === true && ((that.dimensions + 1) * (that.indexerHeight + 4) - 2 >= that.height)) || that.dimensions === 1 && propertyChangedHandler !== true)
                {
                    that._updateWidgetHeight('dimensions');
                    if (that.dimensions === 1 && that.showVerticalScrollbar)
                    {
                        that._showVerticalScrollbar(false);
                    }
                }
            }
        },

        setIndexerValue: function (settings)
        {
            var that = this,
                changed = false;
            for (var i = 0; i < settings.length; i++)
            {
                var index = settings[i].index,
                    absoluteIndex = that.arrayIndexingMode === 'LabVIEW' ? that.dimensions - index - 1 : index,
                    value = settings[i].value,
                    indexer = that._indexers[index];
                if (indexer !== undefined && value !== that._coordinates[index])
                {
                    changed = true;
                    indexer.val(value);
                    that._coordinates[index] = value;
                    if (that.type !== 'none' && (absoluteIndex === 0 || absoluteIndex === 1))
                    {
                        that._syncScrollbar(absoluteIndex, value);
                    }
                }
            }
            if (changed === true)
            {
                that._scroll();
            }
        },

        getIndexerValue: function ()
        {
            var indexers = this._indexers,
                result = [];

            for (var i = 0; i < indexers.length; i++)
            {
                result.push(indexers[i].val());
            }
            return result;
        },

        showLastElement: function ()
        {
            var that = this,
                settings = [],
                xDimension, yDimension;

            if (that.arrayIndexingMode === 'LabVIEW')
            {
                xDimension = that.dimensions - 1;
                yDimension = that.dimensions - 2;
            } else
            {
                xDimension = 0;
                yDimension = 1;
            }

            for (var i = 0; i < that.dimensions; i++)
            {
                var currentValue = that._filledUpTo[i];
                if (i === xDimension)
                {
                    if (currentValue <= that.columns - 1)
                    {
                        currentValue = 0;
                    } else
                    {
                        currentValue = currentValue - that.columns + 1;
                    }
                } else if (i === yDimension)
                {
                    if (currentValue <= that.rows - 1)
                    {
                        currentValue = 0;
                    } else
                    {
                        currentValue = currentValue - that.rows + 1;
                    }
                }
                settings.push({ index: i, value: currentValue });
            }

            that.setIndexerValue(settings);
        },

        insertRowBefore: function (index, redirect)
        {
            var that = this,
                oldValue = JSON.stringify(that.value),
                lV = that.arrayIndexingMode === 'LabVIEW';

            if (lV && redirect !== true)
            {
                that.insertColumnBefore(index, true);
                return;
            }

            if (that.dimensions === 1)
            {
                if (lV && !that._oneDimensionSpecialCase || !lV && that._oneDimensionSpecialCase)
                {
                    that.value.splice(index + that._coordinates[0], 0, that._getDefaultValue());
                    that._scroll();
                    that._filledUpTo[0]++;
                } else
                {
                    return;
                }
            } else
            {
                var boundRowIndex,
                    fillUpTo = that._filledUpTo.slice(0);
                if (lV) // inserts a column
                {
                    var targetLevel = that.dimensions - 1;
                    boundRowIndex = index + that._coordinates[targetLevel];
                    var recursion = function (arr, level)
                    {
                        if (targetLevel !== level)
                        {
                            for (var i = 0; i < arr.length; i++)
                            {
                                recursion(arr[i], level + 1);
                            }
                        } else
                        {
                            arr.splice(boundRowIndex, 0, that._getDefaultValue());
                        }
                    };
                    recursion(that.value, 0);
                    fillUpTo[targetLevel]++;
                } else // inserts a row
                {
                    boundRowIndex = index + that._coordinates[1];
                    for (var i = 0; i < that.value.length; i++)
                    {
                        var currentArray = that.value[i];
                        currentArray.splice(boundRowIndex, 0, undefined);
                    }
                    fillUpTo[1]++;
                }
                that._fillValueArray(fillUpTo, true);
            }
            that._raiseEvent('0', { value: that.value, oldValue: JSON.parse(oldValue) }); // change event
            that._setMaxValuesOfScrollBars();
        },

        insertColumnBefore: function (index, redirect)
        {
            var that = this,
                boundColumnIndex,
                oldValue = JSON.stringify(that.value),
                lV = that.arrayIndexingMode === 'LabVIEW';

            if (lV && redirect !== true)
            {
                that.insertRowBefore(index, true);
                return;
            }

            if (that.dimensions === 1)
            {
                if (lV && that._oneDimensionSpecialCase || !lV && !that._oneDimensionSpecialCase)
                {
                    that.value.splice(index + that._coordinates[0], 0, that._getDefaultValue());
                    that._scroll();
                    that._filledUpTo[0]++;
                } else
                {
                    return;
                }
            } else
            {
                var fillUpTo = that._filledUpTo.slice(0);
                if (lV) // inserts a row
                {
                    boundColumnIndex = index + that._coordinates[that.dimensions - 2];
                    var targetLevel = that.dimensions - 2;
                    var recursion = function (arr, level)
                    {
                        if (targetLevel !== level)
                        {
                            for (var i = 0; i < arr.length; i++)
                            {
                                recursion(arr[i], level + 1);
                            }
                        } else
                        {
                            arr.splice(boundColumnIndex, 0, []);
                        }
                    };
                    recursion(that.value, 0);
                    fillUpTo[targetLevel]++;
                } else // inserts a column
                {
                    boundColumnIndex = index + that._coordinates[0];
                    that.value.splice(boundColumnIndex, 0, that._returnEmptyArray()[0]);
                    fillUpTo[0]++;
                }
                that._fillValueArray(fillUpTo, true);
            }
            that._raiseEvent('0', { value: that.value, oldValue: JSON.parse(oldValue) }); // change event
            that._setMaxValuesOfScrollBars();
        },

        deleteRow: function (index)
        {
            var that = this,
                lV = that.arrayIndexingMode === 'LabVIEW',
                oldValue = JSON.stringify(that.value),
                dimension, boundRowIndex;

            if (that.dimensions === 1)
            {
                if (!that._oneDimensionSpecialCase)
                {
                    if (index === 0)
                    {
                        that.emptyArray();
                    }
                    return;
                } else
                {
                    that.value.splice(index + that._coordinates[0], 1);
                    that._filledUpTo[0]--;
                }
            } else
            {
                if (lV)
                {
                    dimension = that.dimensions - 2;
                    boundRowIndex = index + that._coordinates[dimension];
                    var recursion = function (arr, level)
                    {
                        if (dimension !== level)
                        {
                            for (var i = 0; i < arr.length; i++)
                            {
                                recursion(arr[i], level + 1);
                            }
                        } else
                        {
                            arr.splice(boundRowIndex, 1);
                        }
                    };
                    recursion(that.value, 0);
                } else
                {
                    dimension = 1;
                    boundRowIndex = index + that._coordinates[1];
                    for (var i = 0; i < that.value.length; i++)
                    {
                        var currentArray = that.value[i];
                        currentArray.splice(boundRowIndex, 1);
                    }
                }
                that._filledUpTo[dimension]--;
            }

            if (oldValue !== JSON.stringify(that.value))
            {
                that._scroll();
                that._raiseEvent('0', { value: that.value, oldValue: JSON.parse(oldValue) }); // change event
                that._setMaxValuesOfScrollBars();
            }
        },

        deleteColumn: function (index)
        {
            var that = this,
                lV = that.arrayIndexingMode === 'LabVIEW';

            if (that._oneDimensionSpecialCase)
            {
                if (index === 0)
                {
                    that.emptyArray();
                }
                return;
            }

            var oldValue = JSON.stringify(that.value),
                targetLevel, boundColumnIndex;

            if (lV)
            {
                targetLevel = that.dimensions - 1;
                boundColumnIndex = index + that._coordinates[targetLevel];
                var recursion = function (arr, level)
                {
                    if (targetLevel !== level)
                    {
                        for (var i = 0; i < arr.length; i++)
                        {
                            recursion(arr[i], level + 1);
                        }
                    } else
                    {
                        arr.splice(boundColumnIndex, 1);
                    }
                };
                recursion(that.value, 0);
            } else
            {
                targetLevel = 0;
                boundColumnIndex = index + that._coordinates[0];
                that.value.splice(boundColumnIndex, 1);
            }
            if (JSON.stringify(that.value) !== oldValue)
            {
                that._filledUpTo[targetLevel]--;
                that._scroll();
                that._raiseEvent('0', { value: that.value, oldValue: JSON.parse(oldValue) }); // change event
                that._setMaxValuesOfScrollBars();
            }
        },

        selectElement: function (rowBoundIndex, columnBoundIndex)
        {
            var that = this;
            that.startSelection(rowBoundIndex, columnBoundIndex);
            that.endSelection(rowBoundIndex, columnBoundIndex);
        },

        startSelection: function (rowBoundIndex, columnBoundIndex)
        {
            var that = this;
            that._absoluteSelectionStart = that._coordinates.slice(0);
            if (that.arrayIndexingMode === 'LabVIEW')
            {
                that._absoluteSelectionStart[that.dimensions - 1] = columnBoundIndex;
                that._absoluteSelectionStart[that.dimensions - 2] = rowBoundIndex;
            } else
            {
                that._absoluteSelectionStart[0] = columnBoundIndex;
                that._absoluteSelectionStart[1] = rowBoundIndex;
            }
            that._absoluteSelectionEnd = undefined;
        },

        endSelection: function (rowBoundIndex, columnBoundIndex)
        {
            var that = this;
            if (that._absoluteSelectionStart !== undefined)
            {
                that._absoluteSelectionEnd = that._coordinates.slice(0);
                if (that.arrayIndexingMode === 'LabVIEW')
                {
                    that._absoluteSelectionEnd[that.dimensions - 1] = columnBoundIndex;
                    that._absoluteSelectionEnd[that.dimensions - 2] = rowBoundIndex;
                } else
                {
                    that._absoluteSelectionEnd[0] = columnBoundIndex;
                    that._absoluteSelectionEnd[1] = rowBoundIndex;
                }

                var validation = true;
                for (var i = 0; i < that.dimensions; i++)
                {
                    validation = validation && (that._absoluteSelectionStart[i] <= that._absoluteSelectionEnd[i]);
                }

                if (validation)
                {
                    that._refreshSelection();
                } else
                {
                    that._absoluteSelectionEnd = undefined;
                }
            }
        },

        selectAll: function ()
        {
            var that = this;
            if ((that.arrayIndexingMode === 'LabVIEW' && that._filledUpTo[0] === -1) || (that.arrayIndexingMode === 'JavaScript' && that._filledUpTo[that._filledUpTo.length - 1] === -1))
            {
                return;
            }
            var start = new Array(that.dimensions);
            if (Array.prototype.fill)
            {
                start.fill(0);
            } else
            {
                that._fillArray(start, 0);
            }

            that._absoluteSelectionStart = start;
            that._absoluteSelectionEnd = that._filledUpTo.slice(0);
            that._refreshSelection();
        },

        clearSelection: function ()
        {
            var that = this;
            that._absoluteSelectionStart = undefined;
            that._absoluteSelectionEnd = undefined;
            if (that.showSelection)
            {
                that._clearSelection();
            }
        },

        reinitializeArray: function ()
        {
            var that = this,
                dimensions = that.dimensions,
                oldValue = JSON.stringify(that.value);

            if (that.dimensions === 1)
            {
                if (Array.prototype.fill)
                {
                    that.value.fill(that._getDefaultValue());
                } else
                {
                    that._fillArray(that.value, that._getDefaultValue());
                }
            } else
            {
                var recursion = function (arr, level)
                {
                    for (var i = 0; i < arr.length; i++)
                    {
                        if (level === dimensions)
                        {
                            arr[i] = that._getDefaultValue();
                        } else
                        {
                            recursion(arr[i], level + 1);
                        }
                    }
                };

                recursion(that.value, 1);
            }
            if (oldValue !== JSON.stringify(that.value))
            {
                that._scroll();
                that._raiseEvent('0', { value: that.value, oldValue: JSON.parse(oldValue) }); // change event
            }
        },

        emptyArray: function ()
        {
            var that = this;

            if (that.type !== 'none')
            {
                var cells = that._cells,
                    oldValue = that.value;
                that.value = that._returnEmptyArray();
                if (JSON.stringify(oldValue) === JSON.stringify(that.value))
                {
                    return;
                }
                for (var i = 0; i < cells.length; i++)
                {
                    for (var j = 0; j < cells[i].length; j++)
                    {
                        var cellWidget = cells[i][j].widget,
                            cellWidgetDimensions = { x: j, y: i };
                        cellWidget[0].classList.add('jqx-fill-state-disabled');
                        cellWidget[0].classList.add('jqx-array-element-empty');
                        if (that._areDifferent(that._getElementValue(cellWidget, cellWidgetDimensions), that._getDefaultValue()))
                        {
                            cellWidget.supressChange = true;
                            that._setElementValue(that._getDefaultValue(), cellWidget, cellWidgetDimensions);
                        }
                    }
                }

                if (Array.prototype.fill)
                {
                    that._filledUpTo.fill(0);
                } else
                {
                    that._fillArray(that._filledUpTo, 0);
                }
                that.clearSelection();
                that._raiseEvent('0', { value: that.value, oldValue: oldValue }); // change event
            }
        },

        reset: function (propertyChangedHandler)
        {
            var that = this;

            if (that.type === 'none' && propertyChangedHandler !== true)
            {
                return;
            } else
            {
                that.type = 'none';
            }

            var oldValue = that.rows;
            that.rows = 1;
            that._changeRowsColumns('rows', oldValue, 1, true);
            oldValue = that.columns;
            that.columns = 1;
            that._changeRowsColumns('columns', oldValue, 1);

            var remainingCell = that._cells[0][0];
            if (that._widget)
            {
                remainingCell.widget[that._widget]('destroy');
            }
            $(remainingCell.td).empty();

            that._table.style.display = 'none';

            that._widget = undefined;
            that._defaultValue = undefined;

            var oldValueArray = that.value;
            that.value = null;
            that._raiseEvent('0', { value: that.value, oldValue: oldValueArray }); // change event

            if (that._hScrollBarInitialized)
            {
                that._horizontalScrollBar.jqxScrollBar({ max: 0, value: 0 });
            }
            if (that._vScrollBarInitialized)
            {
                that._verticalScrollBar.jqxScrollBar({ max: 0, value: 0 });
            }
        },

        hitTest: function (x, y)
        {
            var that = this,
                id = that.element.id,
                topMostElement = $(document.elementFromPoint(x, y)),
                closestArrayElement = topMostElement.closest('.jqx-array-element-' + id),
                closestIndexer = topMostElement.closest('.jqx-array-indexer'),
                closestArray = topMostElement.closest('#' + id);

            if (closestArrayElement.length > 0)
            {
                return { type: 'element', htmlElement: closestArrayElement[0], row: closestArrayElement.data('row'), column: closestArrayElement.data('col') };
            } else if (closestIndexer.length > 0)
            {
                var dimension = closestIndexer.data('dimension');
                if (that.arrayIndexingMode === 'LabVIEW')
                {
                    dimension = that.dimensions - dimension - 1;
                }
                return { type: 'indexer', htmlElement: closestIndexer[0], dimension: dimension };
            } else if (closestArray.length > 0)
            {
                return { type: 'array', htmlElement: closestArray[0] };
            } else
            {
                return undefined;
            }
        },

        getElement: function (rowVisibleIndex, columnVisibleIndex)
        {
            var cells = this._cells;

            if (cells[rowVisibleIndex] === undefined)
            {
                return undefined;
            }
            if (cells[rowVisibleIndex][columnVisibleIndex] === undefined)
            {
                return undefined;
            }
            return cells[rowVisibleIndex][columnVisibleIndex].widget[0];
        },

        getElementSize: function ()
        {
            var that = this;
            return { width: that.elementWidth, height: that.elementHeight };
        },

        setColumnWidth: function (width, propertyChangedHandler)
        {
            var that = this;
            width = parseInt(width, 10);

            if (width === that.elementWidth && propertyChangedHandler !== true)
            {
                return;
            }

            var cellWidgets = $('.jqx-array-element-' + that.element.id);

            that.elementWidth = width;

            if (that.type !== 'none')
            {
                that._updateWidgetWidth();
                if (that.type !== 'custom')
                {
                    cellWidgets[that._widget]({ width: width });
                } else
                {
                    if (that.changeProperty)
                    {
                        that.changeProperty('width', width, cellWidgets);
                    } else
                    {
                        try
                        {
                            console.warn('jqxArray: When "type" is \'custom\' and the column width is changed, the "changeProperty" callback function should be implemented.');
                        } catch (err) { }
                    }
                }
                that._raiseEvent('2', { width: width, height: that.elementHeight }); // sizeChange event
            }
        },

        setRowHeight: function (height, propertyChangedHandler)
        {
            var that = this;
            height = parseInt(height, 10);

            if (height === that.elementHeight && propertyChangedHandler !== true)
            {
                return;
            }

            var cellWidgets = $('.jqx-array-element-' + that.element.id);

            that.elementHeight = height;

            if (that.type !== 'none')
            {
                that._updateWidgetHeight();

                if (that.type !== 'custom')
                {
                    cellWidgets[that._widget]({ height: height });
                } else
                {
                    if (that.changeProperty)
                    {
                        that.changeProperty('height', height, cellWidgets);
                    } else
                    {
                        try
                        {
                            console.warn('jqxArray: When "type" is \'custom\' and the row height is changed, the "changeProperty" callback function should be implemented.');
                        } catch (err) { }
                    }
                }
                that._raiseEvent('2', { width: that.elementWidth, height: height }); // sizeChange event
            }
        },

        resizeElement: function (width, height)
        {
            var that = this;
            width = parseInt(width, 10);
            height = parseInt(height, 10);

            if (width === that.elementWidth && height === that.elementHeight)
            {
                return;
            }
            if (width === that.elementWidth)
            {
                that.setRowHeight(height);
                return;
            }
            if (height === that.elementHeight)
            {
                that.setColumnWidth(width);
                return;
            }

            var cellWidgets = $('.jqx-array-element-' + that.element.id);

            that.elementWidth = width;
            that.elementHeight = height;

            if (that.type !== 'none')
            {
                that._updateWidgetWidth();
                that._updateWidgetHeight();

                if (that.type !== 'custom')
                {
                    cellWidgets[that._widget]({ width: width, height: height });
                } else
                {
                    if (that.changeProperty)
                    {
                        that.changeProperty('width', width, cellWidgets);
                        that.changeProperty('height', height, cellWidgets);
                    } else
                    {
                        try
                        {
                            console.warn('jqxArray: When "type" is \'custom\' and the column width and row height are changed, the "changeProperty" callback function should be implemented.');
                        } catch (err) { }
                    }
                }
                that._raiseEvent('2', { width: width, height: height }); // sizeChange event
            }
        },

        setDefaultValue: function (newDefaultValue)
        {
            var that = this;
            if (that._areDifferent(newDefaultValue, that._defaultValue))
            {
                that._defaultValue = newDefaultValue;
                that._scroll();
            }
        },

        toggleElementGap: function ()
        {
            var that = this,
                tdElements = that.host.find('.jqx-array-table-data');

            if (that._elementGap === undefined)
            {
                that._elementGap = false;
            }

            if (that._elementGap)
            {
                that._tdBorder -= 6;
                tdElements.removeClass('jqx-array-table-data-gap');
                that._elementGap = false;
            } else
            {
                that._tdBorder += 6;
                tdElements.addClass('jqx-array-table-data-gap');
                that._elementGap = true;
            }
            that._updateWidgetWidth();
            that._updateWidgetHeight();
        },

        transposeArray: function ()
        {
            var that = this;
            if (that.dimensions === 2)
            {
                var transposedValue = that.value[0].map(function (col, i)
                {
                    return that.value.map(function (row)
                    {
                        return row[i];
                    });
                });
                var oldValue = JSON.stringify(that.value);
                that.value = transposedValue;
                that._scroll();
                that._raiseEvent('0', { value: transposedValue, oldValue: JSON.parse(oldValue) }); // change event
                that._filledUpTo.reverse();
            }
        },

        copyElementValueToClipboard: function (rowVisibleIndex, columnVisibleIndex)
        {
            var that = this,
                valueInCell = that._getValueInCell(rowVisibleIndex, columnVisibleIndex);
            if (valueInCell !== undefined)
            {
                try
                {
                    var dummyInput = $('<input type="text" style="position: absolute;" value="' + valueInCell + '" />');
                    dummyInput.appendTo(that.host);
                    dummyInput.select();
                    document.execCommand('copy');
                    dummyInput.remove();
                } catch (err) { }
            }
        },

        propertiesChangedHandler: function (object, oldvalue, value)
        {
            if (value.type && value.type !== 'none' && value.elementTemplate)
            {
                object._fullRefresh(oldvalue, value);
            } else if (value.rows && value.columns)
            {
                if (value.rows === oldvalue.rows)
                {
                    if (value.columns === oldvalue.columns)
                    {
                        return;
                    } else
                    {
                        object._changeRowsColumns('columns', oldvalue.columns, value.columns);
                        return;
                    }
                }
                if (value.columns === oldvalue.columns)
                {
                    object._changeRowsColumns('rows', oldvalue.rows, value.rows);
                    return;
                }
                // both are changed
                if (object.dimensions === 1 && value.columns === 1 && value.rows > 1)
                {
                    object._changeRowsColumns('columns', oldvalue.columns, value.columns);
                    object._changeRowsColumns('rows', oldvalue.rows, value.rows);
                    return;
                }
                object.columns = oldvalue.columns;
                object._changeRowsColumns('rows', oldvalue.rows, value.rows);
                object.columns = value.columns;
                object._changeRowsColumns('columns', oldvalue.columns, value.columns);
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value)
        {
            if (object.batchUpdate)
            {
                if (object.batchUpdate.type && object.batchUpdate.type !== 'none' && object.batchUpdate.elementTemplate)
                {
                    return;
                }
                if (object.batchUpdate.rows && object.batchUpdate.columns && (key === 'rows' || key === 'columns'))
                {
                    return;
                }
            }

            if (value !== oldvalue)
            {
                var cellWidgets;

                switch (key)
                {
                    case 'width':
                        value = object._validateSizeProperty('width');
                        if (object.type !== 'none')
                        {
                            var valueDifference = value - oldvalue,
                                elementDimension = object.elementWidth + object._tdBorder;

                            if (Math.abs(valueDifference) < elementDimension)
                            {
                                object.width = oldvalue;
                                return;
                            }
                            var rowsColumnsDifference = Math.floor(valueDifference / elementDimension),
                            oldValue = object.columns,
                            newValue = oldValue + rowsColumnsDifference;
                            object.columns = newValue;

                            object._changeRowsColumns('columns', oldValue, newValue);
                        } else
                        {
                            object._updateWidgetWidth();
                        }
                        break;
                    case 'height':
                        if (object.type === 'none')
                        {
                            object._validateSizeProperty('height');
                            object._updateWidgetHeight();
                        } else
                        {
                            object.height = oldvalue;
                        }
                        break;
                    case 'type':
                        object._getDefaultCellValue();
                        if (oldvalue !== 'none' && value !== 'none')
                        {
                            object._initializeElements(true);
                            object._updateWidgetWidth();
                            object._updateWidgetHeight();
                        } else if (oldvalue === 'none')
                        {
                            object.value = object._returnEmptyArray();
                            if (object._structureAdded === true)
                            {
                                object._initializeElements(false);
                                object._table.style.display = 'table';
                            } else
                            {
                                object._addElementStructure();
                                object._structureAdded = true;
                                object._initializeElements(false);
                            }
                            object._updateWidgetWidth();
                            object._updateWidgetHeight();
                            object._getInitialFill();
                        } else if (value === 'none')
                        {
                            object.reset(true);
                        }
                        break;
                    case 'value':
                        if (JSON.stringify(oldvalue) !== JSON.stringify(value))
                        {
                            object._validateValue();
                            if (JSON.stringify(oldvalue) !== JSON.stringify(object.value))
                            {
                                object._scroll();
                                object._getInitialFill();
                                object._raiseEvent('0', { value: object.value, oldValue: oldvalue }); // change event
                            }
                        }
                        break;
                    case 'dimensions':
                        object._addRemoveMultipleDimensions(oldvalue, value);
                        break;
                    case 'rows':
                    case 'columns':
                        object._changeRowsColumns(key, oldvalue, value);
                        break;
                    case 'elementWidth':
                        value = object._validateSizeProperty('elementWidth');
                        object.setColumnWidth(value, true);
                        break;
                    case 'elementHeight':
                        value = object._validateSizeProperty('elementHeight');
                        object.setRowHeight(value, true);
                        break;
                    case 'showIndexDisplay':
                        object._indexerContainer[0].style.display = value ? 'block' : 'none';
                        object._updateWidgetWidth();
                        object._updateWidgetHeight('showIndexDisplay');
                        break;
                    case 'indexerWidth':
                        value = object._validateSizeProperty('indexerWidth');
                        object._indexerContainer[0].style.width = value + 'px';
                        for (var i = 0; i < object._indexers.length; i++)
                        {
                            object._indexers[i].jqxNumberInput({ width: value - 2 });
                        }
                        object._updateWidgetWidth();
                        break;
                    case 'indexerHeight':
                        value = object._validateSizeProperty('indexerHeight');
                        for (var o = 0; o < object._indexers.length; o++)
                        {
                            object._indexers[o].jqxNumberInput({ height: value });
                        }
                        object._updateWidgetHeight();
                        break;
                    case 'showVerticalScrollbar':
                        if (object.dimensions === 1 && object._oneDimensionSpecialCase === false)
                        {
                            object.showVerticalScrollbar = false;
                            return;
                        }
                        if (object._vScrollBarInitialized !== true)
                        {

                            object._updateWidgetWidth(true);
                            object._initializeVScrollBar();
                            if (object.dimensions > 1)
                            {
                                var yDimension = object.arrayIndexingMode === 'LabVIEW' ? object.dimensions - 2 : 1;
                                object._syncScrollbar(1, object._coordinates[yDimension]);
                            } else
                            {
                                object._syncScrollbar(1, object._coordinates[0]);
                            }
                        } else
                        {
                            object._showVerticalScrollbar(value);
                        }
                        break;
                    case 'showHorizontalScrollbar':
                        if (object._oneDimensionSpecialCase === true)
                        {
                            object.showHorizontalScrollbar = false;
                            return;
                        }
                        if (object._hScrollBarInitialized !== true)
                        {
                            object._updateWidgetHeight('showHorizontalScrollbar');
                            object._initializeHScrollBar();
                            var xDimension;
                            if (object.arrayIndexingMode === 'LabVIEW')
                            {
                                xDimension = object.dimensions - 1;
                            } else
                            {
                                xDimension = 0;
                            }
                            object._syncScrollbar(0, object._coordinates[xDimension]);
                        } else
                        {
                            object._showHorizontalScrollbar(value);
                        }
                        break;
                    case 'showSelection':
                        if (value)
                        {
                            object._refreshSelection();
                        } else
                        {
                            object._clearSelection();
                        }
                        break;
                    case 'disabled':
                        if (value)
                        {
                            object.element.classList.add('jqx-fill-state-disabled');
                        } else
                        {
                            object.host.removeClass('jqx-fill-state-disabled');
                        }
                        for (var j = 0; j < object._indexers.length; j++)
                        {
                            object._indexers[j].jqxNumberInput({ disabled: value });
                        }
                        if (object.type !== 'none')
                        {
                            cellWidgets = $('.jqx-array-element-' + object.element.id);
                            if (object.type !== 'custom')
                            {
                                cellWidgets[object._widget]({ disabled: value });
                            } else
                            {
                                if (object.changeProperty)
                                {
                                    object.changeProperty('disabled', value, cellWidgets);
                                } else
                                {
                                    try
                                    {
                                        console.warn('jqxArray: When "type" is \'custom\' and the "disabled" property is changed, the "changeProperty" callback function should be implemented.');
                                    } catch (err) { }
                                }
                            }
                            object._scroll();
                        }
                        break;
                    case 'customWidgetDefaultValue':
                        if (object.type === 'custom')
                        {
                            object._defaultValue = value;
                            object._scroll();
                        }
                        break;
                    case 'elementTemplate':
                        if (object.type !== 'none')
                        {
                            cellWidgets = $('.jqx-array-element-' + object.element.id);
                            for (var k = 0; k < cellWidgets.length; k++)
                            {
                                var currentWidget = $(cellWidgets[k]);
                                object.elementTemplate(currentWidget, { x: currentWidget.data('col'), y: currentWidget.data('row') });
                            }
                        }
                        break;
                    case 'theme':
                        for (var l = 0; l < object._indexers.length; l++)
                        {
                            object._indexers[l].jqxNumberInput({ theme: value });
                        }

                        $(object._bigContainer).removeClass('jqx-fill-state-pressed-' + oldvalue);
                        object._bigContainer.classList.add('jqx-fill-state-pressed-' + value);

                        for (var m = 0; m < object.rows; m++)
                        {
                            for (var n = 0; n < object.columns; n++)
                            {
                                var td = $(object._cells[m][n].td);
                                td.removeClass('jqx-fill-state-pressed-' + oldvalue);
                                td[0].classList.add('jqx-fill-state-pressed-' + value);
                            }
                        }

                        if (object.type !== 'none')
                        {
                            cellWidgets = $('.jqx-array-element-' + object.element.id);
                            if (object.type !== 'custom')
                            {
                                cellWidgets[object._widget]({ theme: value });
                            } else if (object.changeProperty)
                            {
                                object.changeProperty('theme', value, cellWidgets);
                            }
                        }
                        if (object._hScrollBarInitialized)
                        {
                            object._horizontalScrollBar.jqxScrollBar({ theme: value });
                        }
                        if (object._vScrollBarInitialized)
                        {
                            object._verticalScrollBar.jqxScrollBar({ theme: value });
                        }
                        object._scroll();
                        break;
                    case 'arrayIndexingMode':
                        object.arrayIndexingMode = oldvalue; // arrayIndexingMode cannot be changed programmatically
                        break;
                }
            }
        },

        // raises an event
        _raiseEvent: function (id, arg)
        {
            if (arg === undefined)
            {
                arg = { owner: null };
            }

            var evt = this.events[id];
            arg.owner = this;

            var event = new $.Event(evt);
            event.owner = this;
            event.args = arg;
            if (event.preventDefault)
            {
                event.preventDefault();
            }

            var result = this.host.trigger(event);
            return result;
        },

        _fullRefresh: function (oldvalue, value)
        {
            var that = this;

            that._getDefaultCellValue();
            that._validateProperties();
            var changeValueDimensions = false;
            if (!value.value)
            {
                changeValueDimensions = true;
            }
            if (value.dimensions && value.dimensions !== oldvalue.dimensions)
            {
                that._addRemoveMultipleDimensions(oldvalue.dimensions, value.dimensions, changeValueDimensions);
            }

            if (that._structureAdded === true)
            {
                that._initializeElements(false);
                that._table.style.display = 'table';
            } else
            {
                that._addElementStructure();
                that._structureAdded = true;
                that._initializeElements(false);
            }
            that._getInitialFill();
            that._updateWidgetWidth();
            that._updateWidgetHeight();
            that._scroll();
        },

        _validateProperties: function ()
        {
            var that = this;

            that._validateSizeProperty('width');
            that._validateSizeProperty('height');
            that._validateSizeProperty('elementWidth');
            that._validateSizeProperty('elementHeight');
            that._validateSizeProperty('indexerWidth');
            that._validateSizeProperty('indexerHeight');

            that._oneDimensionSpecialCase = false;

            if (that.type === 'none')
            {
                that.rows = 1;
                that.columns = 1;
            } else
            {
                if (that.rows < 1)
                {
                    that.rows = 1;
                }
                if (that.columns < 1)
                {
                    that.columns = 1;
                }
            }
            if (that.dimensions < 1 || that.dimensions > 32)
            {
                that.dimensions = 1;
            }
            if (that.dimensions === 1)
            {
                if (that.columns > 1)
                {
                    that.rows = 1;
                    if (that.showVerticalScrollbar === true)
                    {
                        that.showVerticalScrollbar = false;
                    }
                } else if (that.rows !== 1)
                {
                    that._oneDimensionSpecialCase = true;
                    if (that.showHorizontalScrollbar === true)
                    {
                        that.showHorizontalScrollbar = false;
                    }
                } else if (that.columns === 1 && that.rows === 1)
                {
                    if (that.showVerticalScrollbar === true)
                    {
                        that.showVerticalScrollbar = false;
                    }
                }
            }
            if (that.type === 'none')
            {
                if (that.width === null)
                {
                    that.width = that.indexerWidth + 80 + (that.showVerticalScrollbar ? 20 : 0);
                }
                if (that.height === null)
                {
                    that.height = 80 + (that.showHorizontalScrollbar ? 20 : 0);
                }
            }
            that._validateValue();
        },

        _validateSizeProperty: function (property)
        {
            var that = this;
            if (typeof that[property] === 'string')
            {
                var numericValue = parseInt(that[property], 10);
                that[property] = numericValue;
                return numericValue;
            } else
            {
                return that[property];
            }
        },

        _validateValue: function ()
        {
            var that = this;
            if (/*that.type === 'none' ||*/that.value === null || that.value === undefined)
            {
                that.value = that._returnEmptyArray();
            } else
            {
                that._validateValueArrayDimensions();
            }
        },

        _validateValueArrayDimensions: function ()
        {
            var that = this,
                dimensions = 0,
                tempArray = that.value,
                emptyArray = false;

            if (tempArray.constructor !== Array)
            {
                that.value = [tempArray];
                tempArray = that.value;
                dimensions = 1;
            } else
            {
                while (tempArray.constructor === Array)
                {
                    dimensions++;
                    tempArray = tempArray[0];
                    if (tempArray === undefined)
                    {
                        emptyArray = true;
                        break;
                    }
                }
            }

            if (that.dimensions > dimensions)
            {
                if (emptyArray)
                {
                    that.value = that._returnEmptyArray();
                    return;
                }

                while (that.dimensions > dimensions)
                {
                    that._addDimensionToJSArray(dimensions);
                    dimensions++;
                }
            }
        },

        _addInnerElements: function ()
        {
            var that = this,
                id = that.element.id,
                indexerContainerVisibility = that.showIndexDisplay ? 'block' : 'none',
                HTMLString = '<div id="' + id + 'IndexerContainer" class="jqx-array-indexer-container" style="width: ' + that.indexerWidth + 'px; display: ' + indexerContainerVisibility + ';"></div><div id="' + id + 'BigContainer" class="jqx-array-big-container jqx-array-background ' + that.toThemeProperty('jqx-fill-state-pressed') + '"><div id="' + id + 'CentralContainer" class="jqx-array-central-container"><div id="' + id + 'MainContainer"></div><div id="' + id + 'HorizontalScrollbarContainer" class="jqx-array-scrollbar-container-horizontal" style="display: none;"><div id="' + id + 'HorizontalScrollbar" class="jqx-array-scrollbar-horizontal"></div></div></div><div id="' + id + 'VerticalScrollbarContainer" class="jqx-array-scrollbar-container-vertical" style="display: none;"><div id="' + id + 'VerticalScrollbar" class="jqx-array-scrollbar-vertical"></div></div></div><div style="clear: both;"></div>'; //ignore jslint

            that.element.innerHTML = HTMLString;

            that._indexerContainer = $('#' + id + 'IndexerContainer');
            that._bigContainer = document.getElementById(id + 'BigContainer');
            that._mainContainer = document.getElementById(id + 'MainContainer');
            that._horizontalScrollBarContainer = document.getElementById(id + 'HorizontalScrollbarContainer');
            that._horizontalScrollBar = $('#' + id + 'HorizontalScrollbar');
            that._verticalScrollBarContainer = document.getElementById(id + 'VerticalScrollbarContainer');
            that._verticalScrollBar = $('#' + id + 'VerticalScrollbar');

            that._tableBorder = 2;

            if (that.showVerticalScrollbar)
            {
                that._initializeVScrollBar();
            }
            if (that.showHorizontalScrollbar)
            {
                that._initializeHScrollBar();
            }
        },

        _addClasses: function ()
        {
            var that = this;
            that.element.className = 'jqx-array jqx-widget';
            if (that.disabled)
            {
                that.element.classList.add('jqx-fill-state-disabled');
            }
        },

        _addInitialDimensions: function ()
        {
            var that = this,
                numberOfInitialDimensions = that.dimensions;
            that._dimensions = [];
            that._indexers = [];
            that._suppressDimensionChange = true;
            that._initialDimensions = true;
            for (var i = 0; i < numberOfInitialDimensions; i++)
            {
                that.addDimension();
            }
            that._suppressDimensionChange = false;
            that._initialDimensions = false;
        },

        _addRemoveMultipleDimensions: function (oldvalue, value, changeValueDimensions)
        {
            var object = this;
            if (value < 1 || value > 32)
            {
                object.dimensions = 1;
                if (object.dimensions === oldvalue)
                {
                    return;
                }
            }
            var difference = object.dimensions - oldvalue;
            object._suppressDimensionChange = true;
            if (difference > 0)
            {
                do
                {
                    object.addDimension(changeValueDimensions);
                    difference -= 1;
                } while (difference > 0);
                object._raiseEvent('3', { type: 'add' }); // dimensionChange event
            } else if (difference < 0)
            {
                if (value === 1)
                {
                    var oldRowsCount = object.rows;
                    object.rows = 1;
                    object.dimensions = oldvalue;
                    object._changeRowsColumns('rows', oldRowsCount, 1, undefined, true);
                    object.dimensions = value;
                }
                do
                {
                    object.removeDimension(true, changeValueDimensions);
                    difference += 1;
                } while (difference < 0);
                object._raiseEvent('3', { type: 'remove' }); // dimensionChange event
                if (value === 1 && object.showVerticalScrollbar)
                {
                    object._showVerticalScrollbar(false);
                }
            }
            object._suppressDimensionChange = false;
            if (object.showIndexDisplay === true)
            {
                if (value !== 1)
                {
                    if (value - oldvalue > 0 && value * (object.indexerHeight + 4) - 2 < object.height)
                    {
                        return;
                    } else if (value - oldvalue < 0 && oldvalue * (object.indexerHeight + 4) - 2 < object.height)
                    {
                        return;
                    }
                }
                object._updateWidgetHeight('dimensions');
            }
        },

        _addElementStructure: function ()
        {
            var that = this;
            that._cells = [];
            that._table = document.createElement('table');
            that._table.className = 'jqx-array-element-gap';
            var tableBody = document.createElement('tbody');
            that._table.appendChild(tableBody);
            that._tableBody = $(tableBody);
            var masterFragment = document.createDocumentFragment();
            for (var i = 0; i < that.rows; i++)
            {
                var currentRow = document.createElement('tr'),
                    childFragment = document.createDocumentFragment();
                currentRow.classList.add('jqx-array-table-row');
                that._cells.push([]);
                for (var j = 0; j < that.columns; j++)
                {
                    var currentCell = document.createElement('td');
                    currentCell.classList.add('jqx-fill-state-pressed');
                    currentCell.classList.add('jqx-array-table-data');
                    if (that.theme !== '')
                    {
                        currentCell.classList.add('jqx-fill-state-pressed-' + that.theme);
                    }
                    if (that._elementGap)
                    {
                        currentCell.classList.add('jqx-array-table-data-gap');
                    }
                    that._cells[i].push({ td: currentCell });
                    childFragment.appendChild(currentCell);
                }
                currentRow.appendChild(childFragment);
                masterFragment.appendChild(currentRow);
            }
            tableBody.appendChild(masterFragment);
            that._mainContainer.appendChild(that._table);
        },

        _initializeElements: function (removeOldWidgets)
        {
            var that = this,
                cells = that._cells;
            that._initializeElement = function () { };

            function setElementTemplate(widget)
            {
                if (that.elementTemplate) { that.elementTemplate(widget, { x: j, y: i }); }
            }

            if (that.type !== 'custom')
            {
                switch (that.type) // new types definition
                {
                    case 'numeric':
                        that._initializeElement = function (widget, value)
                        {
                            widget.jqxNumberInput({ theme: that.theme, width: that.elementWidth, height: that.elementHeight, inputMode: 'simple', spinButtons: true, decimal: value, disabled: that.disabled });
                            setElementTemplate(widget);
                        };
                        break;
                    case 'boolean':
                        that._initializeElement = function (widget, value)
                        {
                            widget.jqxSwitchButton({ theme: that.theme, width: that.elementWidth, height: that.elementHeight, checked: value, disabled: that.disabled });
                            setElementTemplate(widget);
                        };
                        break;
                    case 'string':
                        that._initializeElement = function (widget, value)
                        {
                            widget.jqxInput({ theme: that.theme, width: that.elementWidth, height: that.elementHeight, value: value, disabled: that.disabled });
                            setElementTemplate(widget);
                        };
                        break;
                    case 'path':
                        that._initializeElement = function (widget, value)
                        {
                            widget.jqxPathControl({ theme: that.theme, width: that.elementWidth, height: that.elementHeight, path: value.toString(), disabled: that.disabled });
                            setElementTemplate(widget);
                        };
                }
            } else
            {
                that._initializeElement = function (widget, value)
                {
                    if (that.elementTemplate)
                    {
                        var widgetDimensions = { x: j, y: i };
                        that.elementTemplate(widget, widgetDimensions);
                        if (value !== undefined)
                        {
                            that._setElementValue(value, widget, widgetDimensions);
                        }
                    } else
                    {
                        throw new Error('jqxArray: When "type" is \'custom\', the "elementTemplate" callback function has to be implemented.');
                    }
                };
            }

            for (var i = 0; i < cells.length; i++) // rows
            {
                for (var j = 0; j < cells[i].length; j++) // columns
                {
                    if (removeOldWidgets === true)
                    {
                        if (that._widget)
                        {
                            cells[i][j].widget[that._widget]('destroy');
                        }
                        $(cells[i][j].td).empty();
                    }
                    that._initializeWidget(i, j);
                }
            }

            var firstWidgetInstance = cells[0][0].widget;
            that._tdBorder = parseInt(firstWidgetInstance.css('border-left-width'), 10) + parseInt(firstWidgetInstance.css('border-right-width'), 10);
            that._paddingH = 0;
            that._paddingV = 0;
            if (firstWidgetInstance.css('box-sizing') === 'content-box')
            {
                that._tdBorder += 2;
                that._paddingH = parseInt(firstWidgetInstance.css('padding-left'), 10) + parseInt(firstWidgetInstance.css('padding-right'), 10);
                that._paddingV = parseInt(firstWidgetInstance.css('padding-top'), 10) + parseInt(firstWidgetInstance.css('padding-bottom'), 10);
            }
            if (that._elementGap)
            {
                that._tdBorder += 6;
            }
        },

        _addElementHandlers: function (element)
        {
            var that = this,
                id = that.element.id;
            that.addHandler(element, 'change.jqxArray' + id, function (event)
            {
                if (element.supressChange !== true || that._widget === 'jqxNumberInput')
                {
                    element.removeClass('jqx-fill-state-disabled jqx-array-element-empty');
                    var x = element.data('col'),
                        y = element.data('row');
                    that._updateValue(y, x, that._getElementValue(element, { x: x, y: y }, true));
                } else
                {
                    element.supressChange = false;
                }
                event.stopPropagation();
            });
            that.addHandler(element, 'click.jqxArray' + id, function ()
            {
                that._raiseEvent('1', { element: element[0] }); // elementClick event
            });
        },

        _getDefaultCellValue: function ()
        {
            var that = this;

            switch (that.type) // new types definition
            {
                case 'custom':
                    that._widget = undefined;
                    that._defaultValue = that.customWidgetDefaultValue !== null ? that.customWidgetDefaultValue : undefined;
                    break;
                case 'numeric':
                    if (!that.host.jqxNumberInput)
                    {
                        throw new Error('jqxArray: Missing reference to jqxnumberinput.js.');
                    }
                    that._widget = 'jqxNumberInput';
                    that._defaultValue = 0;
                    break;
                case 'boolean':
                    if (!that.host.jqxSwitchButton)
                    {
                        throw new Error('jqxArray: Missing reference to jqxswitchbutton.js.');
                    }
                    that._widget = 'jqxSwitchButton';
                    that._defaultValue = false;
                    break;
                case 'string':
                    if (!that.host.jqxInput)
                    {
                        throw new Error('jqxArray: Missing reference to jqxinput.js.');
                    }
                    that._widget = 'jqxInput';
                    that._defaultValue = '';
                    break;
                case 'path':
                    if (!that.host.jqxPathControl)
                    {
                        throw new Error('jqxArray: Missing reference to jqxpathcontrol.js.');
                    }
                    that._widget = 'jqxPathControl';
                    that._defaultValue = '';
                    break;
            }
        },

        _updateValue: function (row, column, newValue)
        {
            var that = this,
                oldValue = that._getValueInCell(row, column);

            if (!that._areDifferent(newValue, oldValue))
            {
                return;
            }

            var dimensionValues = that._coordinates,
                actualIndexes = dimensionValues.slice(0),
                changedValueDimensions = [];

            if (that.arrayIndexingMode === 'LabVIEW')
            {
                actualIndexes[actualIndexes.length - 1] += column;
                actualIndexes[actualIndexes.length - 2] += row;
            } else
            {
                actualIndexes[0] += column;
                actualIndexes[1] += row;
            }

            for (var i = 0; i < that.dimensions; i++)
            {
                if (i === 0)
                { // x
                    if (that._oneDimensionSpecialCase === false)
                    {
                        changedValueDimensions.push(actualIndexes[0]);
                    } else
                    {
                        changedValueDimensions.push(row + dimensionValues[0]);
                    }
                } else if (i === 1)
                { // y
                    changedValueDimensions.push(actualIndexes[1]);
                } else
                { // other dimensions
                    changedValueDimensions.push(actualIndexes[i]);
                }
            }

            var tempArr = that.value;

            for (var j = 0; j < changedValueDimensions.length; j++)
            {
                if (tempArr[changedValueDimensions[j]] === undefined || tempArr[changedValueDimensions[j]] === oldValue)
                {
                    if (j !== changedValueDimensions.length - 1)
                    {
                        tempArr[changedValueDimensions[j]] = [];
                    } else
                    {
                        tempArr[changedValueDimensions[j]] = newValue;
                    }
                }
                tempArr = tempArr[changedValueDimensions[j]];
            }

            that._fillValueArray(changedValueDimensions.slice(0));

            that._raiseEvent('0', { value: newValue, oldValue: oldValue, dimensionIndexes: changedValueDimensions }); // change event
        },

        _getValueInCell: function (row, column)
        {
            var that = this,
                array = that.value,
                dimensionValues = that._coordinates,
                length = dimensionValues.length,
                value;

            if (length === 1)
            {
                if (that._oneDimensionSpecialCase === false)
                {
                    value = array[column + dimensionValues[0]];
                } else
                {
                    value = array[row + dimensionValues[0]];
                }
            } else
            {
                var actualIndexes = dimensionValues.slice(0);
                if (that.arrayIndexingMode === 'LabVIEW')
                {
                    actualIndexes[length - 1] += column;
                    actualIndexes[length - 2] += row;
                } else
                {
                    actualIndexes[0] += column;
                    actualIndexes[1] += row;
                }

                var oneDimensionalArrayValue = array[actualIndexes[0]];
                if (oneDimensionalArrayValue !== undefined)
                {
                    var twoDimensionalArrayValue = oneDimensionalArrayValue[actualIndexes[1]];
                    if (twoDimensionalArrayValue !== undefined)
                    {
                        value = twoDimensionalArrayValue;
                        if (length > 2)
                        {
                            for (var i = 2; i < length; i++)
                            {
                                if (value === undefined)
                                {
                                    break;
                                }
                                value = value[actualIndexes[i]];
                            }
                        }
                    }
                }
            }
            return value;
        },

        _scroll: function ()
        {
            var that = this,
                emptyClass = ['jqx-fill-state-disabled', 'jqx-array-element-empty'];
            if (that.type !== 'none')
            {
                for (var i = 0; i < that._cells.length; i++)
                {
                    for (var j = 0; j < that._cells[i].length; j++)
                    {
                        var value = that._getValueInCell(i, j),
                            widget = that._cells[i][j].widget,
                            widgetDimensions = { x: j, y: i },
                            widgetValue = that._getElementValue(widget, widgetDimensions),
                            skipSelectionCheck;
                        if (value !== undefined)
                        {
                            widget[0].classList.remove(emptyClass[0]);
                            widget[0].classList.remove(emptyClass[1]);
                            widget.removeClass(emptyClass);
                            if (that._areDifferent(widgetValue, value))
                            {
                                widget.supressChange = true;
                                that._setElementValue(value, widget, widgetDimensions);
                            } else
                            {
                                widget.supressChange = false;
                            }
                            skipSelectionCheck = false;
                        } else
                        {
                            widget[0].classList.add(emptyClass[0]);
                            widget[0].classList.add(emptyClass[1]);
                            if (that._areDifferent(widgetValue, that._defaultValue))
                            {
                                widget.supressChange = true;
                                that._setElementValue(that._getDefaultValue(), widget, widgetDimensions);
                            } else
                            {
                                widget.supressChange = false;
                            }
                            skipSelectionCheck = true;
                        }
                        that._addSelectionClass(j, i, that._cells[i][j].td, skipSelectionCheck);
                    }
                }
            }
        },

        _areDifferent: function (a, b)
        {
            if (a instanceof Date)
            {
                if (b instanceof Date)
                {
                    return a.getTime() !== b.getTime();
                } else if (typeof b === 'string')
                {
                    try
                    {
                        return a.getTime() !== new Date(b).getTime();
                    } catch (err) { }
                }
                return true;
            }
            if (b instanceof Date)
            {
                if (a instanceof Date)
                {
                    return b.getTime() !== a.getTime();
                } else if (typeof a === 'string')
                {
                    try
                    {
                        return b.getTime() !== new Date(a).getTime();
                    } catch (err) { }
                }
                return true;
            }

            if (typeof a !== 'object' || typeof a !== typeof b)
            {
                if (a !== b)
                {
                    return true;
                } else
                {
                    return false;
                }
            } else
            {
                if (JSON.stringify(a) !== JSON.stringify(b))
                {
                    return true;
                } else
                {
                    return false;
                }
            }
        },

        _returnEmptyArray: function ()
        {
            var that = this,
                emptyArray = [],
                current = emptyArray;

            if (that.dimensions > 1)
            {
                for (var i = 1; i < that.dimensions; i++)
                {
                    current[0] = [];
                    current = current[0];
                }
            }
            return emptyArray;
        },

        _addDimensionToJSArray: function (dimensions)
        {
            var that = this;

            if (that.arrayIndexingMode === 'LabVIEW')
            {
                that.value = [that.value];
            } else
            {
                if (dimensions === undefined)
                {
                    dimensions = that.dimensions - 1;
                }

                var recursion = function (arr, level)
                {
                    for (var i = 0; i < arr.length; i++)
                    {
                        if (level !== dimensions)
                        {
                            recursion(arr[i], level + 1);
                        } else
                        {
                            arr[i] = [arr[i]];
                        }
                    }
                };

                recursion(that.value, 1);
            }
        },

        _removeDimensionFromJSArray: function ()
        {
            var that = this;

            if (that.arrayIndexingMode === 'LabVIEW')
            {
                that.value = that.value[0];
            } else
            {
                var dimensions = that.dimensions + 1,
                    recursion = function (arr, level, parent, index)
                    {
                        for (var i = 0; i < arr.length; i++)
                        {
                            if (level !== dimensions && arr[i].length > 0)
                            {
                                recursion(arr[i], level + 1, arr, i);
                            } else
                            {
                                if (parent !== undefined)
                                {
                                    parent[index] = arr[0];
                                } else
                                {
                                    that.value = that.value[0];
                                }
                            }
                        }
                    };

                recursion(that.value, 1);
            }
        },

        _initializeWidget: function (i, j)
        {
            var that = this,
                cell = that._cells[i][j],
                widget,
                initialValue = that._getValueInCell(i, j);

            if (that.type !== 'string')
            {
                widget = $('<div></div>');
            } else
            {
                widget = $('<input />');
            }

            cell.widget = widget;
            cell.td.appendChild(widget[0]);
            that._initializeElement(widget, initialValue === undefined ? that._getDefaultValue() : initialValue, cell);
            widget[0].classList.add('jqx-array-element');
            widget[0].classList.add('jqx-array-element-' + that.element.id);
            if (initialValue === undefined)
            {
                widget[0].classList.add('jqx-fill-state-disabled');
                widget[0].classList.add('jqx-array-element-empty');
            }
            widget.data({ 'row': i, 'col': j });
            that._addElementHandlers(widget);
        },

        _addRemoveColumn: function (action)
        {
            var that = this;

            if (action === 'add')
            {
                var rows = that._tableBody.children();
                for (var i = 0; i < that._cells.length; i++)
                {
                    var addToRow = that._cells[i],
                        newCell = document.createElement('td');
                    newCell.classList.add('jqx-fill-state-pressed');
                    newCell.classList.add('jqx-array-table-data');
                    if (that.theme !== '')
                    {
                        newCell.classList.add('jqx-fill-state-pressed-' + that.theme);
                    }
                    if (that._elementGap)
                    {
                        newCell.classList.add('jqx-array-table-data-gap');
                    }
                    addToRow.push({ td: newCell });
                    rows[i].appendChild(newCell);
                    that._initializeWidget(i, addToRow.length - 1);
                }
                that.columns++;
                if (that._suppressScroll !== true)
                {
                    that._scroll();
                }
            } else if (action === 'remove' && that.columns > 1)
            {
                for (var j = 0; j < that._cells.length; j++)
                {
                    var removeFromRow = that._cells[j],
                        cellToRemove = removeFromRow[removeFromRow.length - 1];
                    if (that._widget)
                    {
                        cellToRemove.widget[that._widget]('destroy');
                    }
                    $(cellToRemove.td).remove();
                    removeFromRow.pop();
                }
                that.columns--;
            }
        },

        _addRemoveRow: function (action)
        {
            var that = this;

            if (action === 'add' && (that.dimensions > 1 || (that.dimensions === 1 && that.columns === 1)))
            {
                that._cells.push([]);
                var newRow = document.createElement('tr'),
                    fragment = document.createDocumentFragment(),
                    newRowIndex = that._cells.length - 1,
                    newCells = [];
                newRow.classList.add('jqx-array-table-row');
                for (var j = 0; j < that.columns; j++)
                {
                    var currentNewCell = document.createElement('td');
                    currentNewCell.classList.add('jqx-fill-state-pressed');
                    currentNewCell.classList.add('jqx-array-table-data');
                    if (that.theme !== '')
                    {
                        newCell.classList.add('jqx-fill-state-pressed-' + that.theme);
                    }
                    if (that._elementGap)
                    {
                        newCell.classList.add('jqx-array-table-data-gap');
                    }
                    that._cells[newRowIndex].push({ td: currentNewCell });
                    newCells.push(currentNewCell);
                    fragment.appendChild(currentNewCell);
                }
                newRow.appendChild(fragment);
                that._tableBody[0].appendChild(newRow);
                for (var i = 0; i < newCells.length; i++)
                {
                    that._initializeWidget(newRowIndex, i);
                }
                that.rows++;
                if (that._suppressScroll !== true)
                {
                    that._scroll();
                }
            } else if (action === 'remove' && that.rows > 1)
            {
                var rowToRemove = that._tableBody.children().last(),
                    cellsToRemove = that._cells[that._cells.length - 1];

                if (that._widget)
                {
                    for (var k = 0; k < cellsToRemove.length; k++)
                    {
                        cellsToRemove[k].widget[that._widget]('destroy');
                    }
                }
                rowToRemove.remove();
                that._cells.pop();
                that.rows--;
            }
        },

        _getInitialFill: function ()
        {
            var that = this;
            that._filledUpTo = [];

            if (that.type !== 'none')
            {
                var tempArray = that.value;
                for (var i = 0; i < that.dimensions; i++)
                {
                    var lastIndex = tempArray.length - 1;
                    that._filledUpTo[i] = lastIndex;
                    tempArray = tempArray[lastIndex];
                }
                that._setMaxValuesOfScrollBars();
            }
        },

        _fillValueArray: function (changedValueDimensions, skipOverride)
        {
            var that = this,
                dimensions = that.dimensions;

            if (that._filledUpTo !== undefined && skipOverride !== true)
            {
                var skipFill = true;

                for (var a = 0; a < changedValueDimensions.length; a++)
                {
                    skipFill = skipFill && (that._filledUpTo[a] >= changedValueDimensions[a]);
                    changedValueDimensions[a] = Math.max(changedValueDimensions[a], that._filledUpTo[a]);
                }
                if (skipFill === true)
                {
                    that._scroll();
                    return;
                }
            }
            that._filledUpTo = changedValueDimensions.slice(0);

            function recursion(arr, level)
            {
                for (var i = 0; i <= changedValueDimensions[level]; i++)
                {
                    if (level !== dimensions - 1)
                    {
                        if (arr[i] === undefined)
                        {
                            arr[i] = [];
                        }
                        recursion(arr[i], level + 1);
                    } else if (arr[i] === undefined)
                    {
                        arr[i] = that._getDefaultValue();
                    }
                }
            }

            recursion(that.value, 0);

            that._scroll();
            that._setMaxValuesOfScrollBars();
        },

        _changeRowsColumns: function (key, oldvalue, value, reset, suppressHeightUpdate)
        {
            var that = this,
                functionName = '_addRemove' + key.charAt(0).toUpperCase() + key.slice(1, key.length - 1);

            if (value < 1)
            {
                that[key] = 1;
                if (that[key] === oldvalue)
                {
                    return;
                }
            }

            if (that.dimensions === 1)
            {
                if (that._oneDimensionSpecialCase === true)
                {
                    if (key === 'columns' && that[key] > 1)
                    {
                        that._oneDimensionSpecialCase = false;
                        if (that.showVerticalScrollbar)
                        {
                            that._showVerticalScrollbar(false);
                            that._showHorizontalScrollbar(true);
                        }
                    }
                } else
                {
                    if (key === 'rows')
                    {
                        if (that.columns > 1)
                        {
                            that.rows = 1;
                            return;
                        } else if (that.rows > 1)
                        {
                            that._oneDimensionSpecialCase = true;
                            if (that.showHorizontalScrollbar === true)
                            {
                                that._showHorizontalScrollbar(false);
                                that._showVerticalScrollbar(true);
                            }
                        }
                    }
                }
            }

            var difference = that[key] - oldvalue;
            that[key] = oldvalue;
            if (difference > 0)
            {
                that._suppressScroll = true;
                do
                {
                    that[functionName]('add');
                    difference -= 1;
                } while (difference > 0);
                that._suppressScroll = false;
                that._scroll();
            } else if (difference < 0)
            {
                do
                {
                    that[functionName]('remove');
                    difference += 1;
                } while (difference < 0);
            }
            that._raiseEvent('4', { type: key, number: that[key], oldNumber: oldvalue }); // arraySizeChange event
            if (key === 'columns')
            {
                that._updateWidgetWidth();
                that._setMaxValuesOfScrollBars('horizontal');
            } else if (key === 'rows' && suppressHeightUpdate !== true)
            {
                that._updateWidgetHeight(reset === true ? 'dimensions' : undefined);
                that._setMaxValuesOfScrollBars('vertical');
            }
        },

        _updateWidgetWidth: function (propertyChangedHandler)
        {
            var that = this;

            if (that.element.parentNode === null)
            {
                return;
            }

            var vScrollbarContainerSize = that.showVerticalScrollbar ? 20 : 0,
                indexerWidth = that.showIndexDisplay ? that.indexerWidth : 0,
                gapModifier = that._elementGap ? -1 * (2 * that.columns - 4) : 0,
                centralContainerWidth, bigContainerWidth;

            if (that.type !== 'none')
            {
                centralContainerWidth = that.columns * (that.elementWidth + that._tdBorder + that._paddingH) + that._tableBorder + gapModifier;
                bigContainerWidth = centralContainerWidth + vScrollbarContainerSize;
                that.width = bigContainerWidth + indexerWidth;
            } else
            {
                if (propertyChangedHandler === true)
                {
                    if (that.showVerticalScrollbar === true)
                    {
                        that.width += 20;
                    } else
                    {
                        that.width -= 20;
                    }
                }
                var minWidth = indexerWidth + 18 + vScrollbarContainerSize;
                if (that.width < minWidth)
                {
                    that.width = minWidth;
                }
                bigContainerWidth = that.width - indexerWidth;
                centralContainerWidth = bigContainerWidth - vScrollbarContainerSize;
            }

            var centralContainer = document.getElementById(that.element.id + 'CentralContainer');
            if (centralContainer !== null) {
                centralContainer.style.width = centralContainerWidth + 'px';
            }
            that._bigContainer.style.width = bigContainerWidth + 'px';
            that._horizontalScrollBarContainer.style.width = (centralContainerWidth - 2) + 'px';
            that._horizontalScrollBar.trigger('resize');
            that.element.style.width = that.width + 'px';
        },

        _updateWidgetHeight: function (propertyChangedHandler)
        {
            var that = this,
                hScrollbarContainerSize = that.showHorizontalScrollbar ? 20 : 0,
                indexerContaineHeight = that.showIndexDisplay ? that.dimensions * (that.indexerHeight + 4) - 2 : 0,
                gapModifier = that._elementGap ? -1 * (2 * that.rows - 4) : 0,
                mainHeight;

            if (that.type !== 'none')
            {
                mainHeight = that.rows * (that.elementHeight + that._tdBorder + that._paddingV) + that._tableBorder + hScrollbarContainerSize + gapModifier;
            } else
            {
                if (propertyChangedHandler === 'showHorizontalScrollbar')
                {
                    var currentBigContainerHeight = parseInt(that._bigContainer.style.height, 10);
                    if (that.showHorizontalScrollbar === true)
                    {
                        mainHeight = currentBigContainerHeight + 20;
                    } else
                    {
                        mainHeight = currentBigContainerHeight - 20;
                    }
                } else if (propertyChangedHandler === 'showIndexDisplay' && that.showIndexDisplay === false || propertyChangedHandler === 'dimensions')
                {
                    mainHeight = parseInt(that._bigContainer.style.height, 10);
                } else
                {
                    mainHeight = that.height;
                }
                var minHeight = 18 + hScrollbarContainerSize;
                if (mainHeight < minHeight)
                {
                    mainHeight = minHeight;
                }
            }
            that._mainContainer.style.height = (mainHeight - hScrollbarContainerSize) + 'px';
            that.height = Math.max(indexerContaineHeight, mainHeight);

            that._verticalScrollBarContainer.style.height = (mainHeight - hScrollbarContainerSize - that._tableBorder) + 'px';
            that._verticalScrollBar.trigger('resize');
            that._bigContainer.style.height = mainHeight + 'px';
            that.element.style.height = that.height + 'px';
        },

        _inSelection: function (x, y)
        {
            var that = this,
                dimensionValues = that._coordinates,
                validation = true,
                xDimension, yDimension, boundX, boundY;

            if (that.arrayIndexingMode === 'LabVIEW')
            {
                xDimension = that.dimensions - 1;
                yDimension = that.dimensions - 2;
            } else
            {
                xDimension = 0;
                yDimension = 1;
            }

            boundX = x + dimensionValues[xDimension];
            boundY = y + dimensionValues[yDimension];

            if (that.dimensions === 1)
            {
                if (boundX >= that._absoluteSelectionStart[xDimension] && boundX <= that._absoluteSelectionEnd[xDimension])
                {
                    return true;
                } else
                {
                    return false;
                }
            }

            if (boundX >= that._absoluteSelectionStart[xDimension] &&
                boundX <= that._absoluteSelectionEnd[xDimension] &&
                boundY >= that._absoluteSelectionStart[yDimension] &&
                boundY <= that._absoluteSelectionEnd[yDimension])
            {
                validation = true;
            } else
            {
                validation = false;
            }

            if (that.arrayIndexingMode === 'LabVIEW')
            {
                for (var i = 0; i < yDimension; i++)
                {
                    validation = validation && (dimensionValues[i] >= that._absoluteSelectionStart[i] && dimensionValues[i] <= that._absoluteSelectionEnd[i]);
                }
            } else
            {
                for (var j = 2; j < that.dimensions; j++)
                {
                    validation = validation && (dimensionValues[j] >= that._absoluteSelectionStart[j] && dimensionValues[j] <= that._absoluteSelectionEnd[j]);
                }
            }
            return validation;
        },

        _refreshSelection: function ()
        {
            var that = this;
            if (that.showSelection)
            {
                for (var i = 0; i < that.rows; i++)
                {
                    for (var j = 0; j < that.columns; j++)
                    {
                        var value = that._getValueInCell(i, j),
                            skipSelectionCheck = value === undefined ? true : false;
                        that._addSelectionClass(j, i, that._cells[i][j].td, skipSelectionCheck);
                    }
                }
            }
        },

        _addSelectionClass: function (x, y, td, skipSelectionCheck)
        {
            var that = this;
            if (that.showSelection && that._absoluteSelectionStart !== undefined && that._absoluteSelectionEnd !== undefined)
            {
                if (skipSelectionCheck === false && that._inSelection(x, y))
                {
                    td.classList.add('jqx-array-element-selected');
                } else
                {
                    $(td).removeClass('jqx-array-element-selected');
                }
            }
        },

        _clearSelection: function ()
        {
            var that = this;
            for (var i = 0; i < that.rows; i++)
            {
                for (var j = 0; j < that.columns; j++)
                {
                    var td = that._cells[i][j].td;
                    $(td).removeClass('jqx-array-element-selected');
                }
            }
        },

        _initializeVScrollBar: function ()
        {
            var that = this;
            if (!that.host.jqxScrollBar)
            {
                throw new Error('jqxArray: Missing reference to jqxscrollbar.js.');
            }

            that._verticalScrollBarContainer.style.display = 'block';
            that._verticalScrollBar.jqxScrollBar({ theme: that.theme, height: '100%', width: 16, min: 0, max: 0, value: 0, vertical: true });
            that._addVScrollBarHandlers();
            that._vScrollBarInitialized = true;
        },

        _addVScrollBarHandlers: function ()
        {
            var that = this,
                id = that.element.id,
                vScrollbar = that._verticalScrollBar,
                vScrollbarId = vScrollbar[0].id,
                vScrollbarUpButton = $('#jqxScrollBtnUp' + vScrollbarId),
                vScrollbarDownButton = $('#jqxScrollBtnDown' + vScrollbarId);

            that.addHandler(vScrollbar.add(vScrollbarUpButton).add(vScrollbarDownButton), 'mousedown.jqxArray' + id, function ()
            {
                that.host.find(':focus').blur();
            });

            that.addHandler(vScrollbar, 'valueChanged.jqxArray' + id, function (event)
            {
                if (that.type !== 'none')
                {
                    if (that._suppressScrollbarEvent !== true)
                    {
                        var index = that._oneDimensionSpecialCase ? 0 : 1;
                        that._moveScrollbar(vScrollbar, 'vertical', index, Math.round(event.currentValue));
                    } else
                    {
                        that._suppressScrollbarEvent = false;
                    }
                }
            });

            that.addHandler(vScrollbarDownButton, 'mousedown.jqxArray' + id, function ()
            {
                if (that.type !== 'none')
                {
                    that._pressScrollbarDownButton(vScrollbar);
                }
            });
        },

        _initializeHScrollBar: function ()
        {
            var that = this;
            if (!that.host.jqxScrollBar)
            {
                throw new Error('jqxArray: Missing reference to jqxscrollbar.js.');
            }

            that._horizontalScrollBarContainer.style.display = 'block';
            that._horizontalScrollBar.jqxScrollBar({ theme: that.theme, width: '100%', height: 16, min: 0, max: 0, value: 0 });
            that._addHScrollBarHandlers();
            that._hScrollBarInitialized = true;
        },

        _addHScrollBarHandlers: function ()
        {
            var that = this,
                id = that.element.id,
                hScrollbar = that._horizontalScrollBar,
                hScrollbarId = hScrollbar[0].id,
                hScrollbarLeftButton = $('#jqxScrollBtnUp' + hScrollbarId),
                hScrollbarRightButton = $('#jqxScrollBtnDown' + hScrollbarId);

            that.addHandler(hScrollbar.add(hScrollbarLeftButton).add(hScrollbarRightButton), 'mousedown.jqxArray' + id, function ()
            {
                that.host.find(':focus').blur();
            });

            that.addHandler(hScrollbar, 'valueChanged.jqxArray' + id, function (event)
            {
                if (that.type !== 'none')
                {
                    if (that._suppressScrollbarEvent !== true)
                    {
                        that._moveScrollbar(hScrollbar, 'horizontal', 0, Math.round(event.currentValue));
                    } else
                    {
                        that._suppressScrollbarEvent = false;
                    }
                }
            });

            that.addHandler(hScrollbarRightButton, 'mousedown.jqxArray' + id, function ()
            {
                if (that.type !== 'none')
                {
                    that._pressScrollbarDownButton(hScrollbar);
                }
            });
        },

        _moveScrollbar: function (scrollbar, type, index, value)
        {
            if (isNaN(value))
            {
                return;
            }

            var that = this,
                actualIndex,
                max = that._getMaxValuesOfScrollBars(type),
                currentMax = scrollbar.jqxScrollBar('max');

            if (that.arrayIndexingMode === 'LabVIEW')
            {
                actualIndex = that.dimensions - index - 1;
            } else
            {
                actualIndex = index;
            }
            that._indexers[actualIndex].val(value);
            that._coordinates[actualIndex] = value;
            if (value <= max)
            {
                scrollbar.jqxScrollBar({ max: max });
            } else if (value <= currentMax)
            {
                scrollbar.jqxScrollBar({ max: value });
            }
            that._scroll();
            that._raiseEvent('5', { direction: type }); // scroll event
        },

        _pressScrollbarDownButton: function (scrollbar)
        {
            var max = scrollbar.jqxScrollBar('max'),
                value = scrollbar.val();
            if (isNaN(value) === true)
            {
                value = 0;
            }
            if (max === value)
            {
                scrollbar.jqxScrollBar({ max: max + 1, value: max + 1 });
            }
        },

        _getMaxValuesOfScrollBars: function (scrollbar)
        {
            var that = this,
                filledUpTo, visibleCells,
                max = 0,
                length = that._filledUpTo.length,
                value;

            if (scrollbar === 'horizontal')
            {
                value = that._horizontalScrollBar.val();
                if (that.arrayIndexingMode === 'LabVIEW')
                {
                    filledUpTo = that._filledUpTo[length - 1];
                } else
                {
                    filledUpTo = that._filledUpTo[0];
                }
                visibleCells = that.columns;
            } else
            {
                value = that._verticalScrollBar.val();
                if (!that._oneDimensionSpecialCase)
                {
                    if (that.arrayIndexingMode === 'LabVIEW')
                    {
                        filledUpTo = that._filledUpTo[length - 2];
                    } else
                    {
                        filledUpTo = that._filledUpTo[1];
                    }
                } else
                {
                    if (that.arrayIndexingMode === 'LabVIEW')
                    {
                        filledUpTo = that._filledUpTo[length - 1];
                    } else
                    {
                        filledUpTo = that._filledUpTo[0];
                    }
                }
                visibleCells = that.rows;
            }

            if (filledUpTo === undefined)
            {
                return 0;
            }

            if (filledUpTo + 1 === visibleCells)
            {
                max = 1;
            } else if (filledUpTo === visibleCells)
            {
                max = 2;
            } else if (filledUpTo > visibleCells)
            {
                max = filledUpTo - visibleCells + 2;
            }

            return Math.max(max, value);
        },

        _setMaxValuesOfScrollBars: function (which)
        {
            var that = this;
            if (that.showHorizontalScrollbar && (which === undefined || which === 'horizontal'))
            {
                that._horizontalScrollBar.jqxScrollBar({ max: that._getMaxValuesOfScrollBars('horizontal') });
            }
            if (that.showVerticalScrollbar && (which === undefined || which === 'vertical'))
            {
                that._verticalScrollBar.jqxScrollBar({ max: that._getMaxValuesOfScrollBars('vertical') });
            }
        },

        _syncScrollbar: function (dimension, value)
        {
            var that = this,
                max, scrollbar;

            if (dimension === 0 && that._oneDimensionSpecialCase === false)
            {
                if (!that.showHorizontalScrollbar)
                {
                    return;
                }
                max = that._getMaxValuesOfScrollBars('horizontal');
                scrollbar = that._horizontalScrollBar;
            } else
            {
                if (!that.showVerticalScrollbar)
                {
                    return;
                }
                max = that._getMaxValuesOfScrollBars('vertical');
                scrollbar = that._verticalScrollBar;
            }


            if (value > max)
            {
                max = value;
            }
            var currentMax = scrollbar.jqxScrollBar('max');
            if (currentMax !== max)
            {
                if (currentMax > max)
                {
                    that._suppressScrollbarEvent = true;
                }
                scrollbar.jqxScrollBar({ max: max });
            }
            if (scrollbar.val() !== value)
            {
                that._suppressScrollbarEvent = true;
                scrollbar.val(value);
            }
        },

        _showVerticalScrollbar: function (show)
        {
            var that = this;
            that.showVerticalScrollbar = show;
            that._updateWidgetWidth(true);
            if (show === true)
            {
                that._verticalScrollBarContainer.style.display = 'block';
                if (that._vScrollBarInitialized !== true)
                {
                    that._initializeVScrollBar();
                }
                if (that.type !== 'none')
                {
                    var yDimension;
                    if (that._oneDimensionSpecialCase)
                    {
                        yDimension = 0;
                    } else if (that.arrayIndexingMode === 'LabVIEW')
                    {
                        yDimension = that.dimensions - 2;
                    } else
                    {
                        yDimension = 1;
                    }
                    that._syncScrollbar(1, that._coordinates[yDimension]);
                }
            } else
            {
                that._verticalScrollBarContainer.style.display = 'none';
            }
        },

        _getDefaultValue: function ()
        {
            var that = this;
            return that._cloneValue(that._defaultValue);
        },

        _cloneValue: function (value)
        {
            if (typeof value !== 'object')
            {
                return value;
            } else
            {
                if (value instanceof Array)
                {
                    return $.extend(true, [], value);
                } else if (value instanceof Date)
                {
                    return new Date(value.getTime());
                } else if (value instanceof Object)
                {
                    return $.extend(true, {}, value);
                }
            }
        },

        _showHorizontalScrollbar: function (show)
        {
            var that = this;
            that.showHorizontalScrollbar = show;
            that._updateWidgetHeight('showHorizontalScrollbar');
            if (show === true)
            {
                that._horizontalScrollBarContainer.style.display = 'block';
                if (that._hScrollBarInitialized !== true)
                {
                    that._initializeHScrollBar();
                }
                if (that.type !== 'none')
                {
                    var xDimension;
                    if (that.arrayIndexingMode === 'LabVIEW')
                    {
                        xDimension = that.dimensions - 1;
                    } else
                    {
                        xDimension = 0;
                    }
                    that._syncScrollbar(0, that._coordinates[xDimension]);
                }
            } else
            {
                that._horizontalScrollBarContainer.style.display = 'none';
            }
        },

        _fillArray: function (O, value)
        {
            var len = O.length >>> 0;

            var start = arguments[1];
            var relativeStart = start >> 0;

            var k = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);

            var end = arguments[2];
            var relativeEnd = end === undefined ? len : end >> 0;

            var last = relativeEnd < 0 ? Math.max(len + relativeEnd, 0) : Math.min(relativeEnd, len);

            while (k < last)
            {
                O[k] = value;
                k++;
            }

            return O;
        },

        _getElementValue: function (div, dimensions, clone)
        {
            var that = this,
                value;
            if (that.getElementValue)
            {
                value = that.getElementValue(div, dimensions);
                if (clone !== true)
                {
                    return value;
                } else
                {
                    return that._cloneValue(value);
                }
            } else
            {
                value = div.val();
                if (clone !== true)
                {
                    return value;
                } else
                {
                    return that._cloneValue(value);
                }
            }
        },

        _setElementValue: function (value, div, dimensions)
        {
            var that = this;
            value = that._cloneValue(value);
            if (that.setElementValue)
            {
                that.setElementValue(value, div, dimensions);
                if (div.supressChange === true)
                {
                    div.supressChange = false;
                }
            } else
            {
                div.val(value);
            }
        }
    });
})(jqxBaseFramework); //ignore jslint

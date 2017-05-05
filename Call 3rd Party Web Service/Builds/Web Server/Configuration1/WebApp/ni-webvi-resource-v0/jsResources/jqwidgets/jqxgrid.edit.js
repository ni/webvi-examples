/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($) {

    $.extend($.jqx._jqxGrid.prototype, {
        _handledblclick: function (event, self) {
            if (event.target == null) {
                return;
            }

            if (self.disabled) {
                return;
            }

            if ($(event.target).ischildof(this.columnsheader)) {
                return;
            }

            var rightclick;
            if (event.which) rightclick = (event.which == 3);
            else if (event.button) rightclick = (event.button == 2);

            if (rightclick) {
                return;
            }

            var middleclick;
            if (event.which) middleclick = (event.which == 2);
            else if (event.button) middleclick = (event.button == 1);

            if (middleclick) {
                return;
            }

            var columnheaderheight = this.showheader ? this.columnsheader.height() + 2 : 0;
            var groupsheaderheight = this._groupsheader() ? this.groupsheader.height() : 0;
            var toolbarheight = this.showtoolbar ? this.toolbarheight : 0;
            groupsheaderheight += toolbarheight;

            var hostoffset = this.host.offset();
            var x = event.pageX - hostoffset.left;
            var y = event.pageY - columnheaderheight - hostoffset.top - groupsheaderheight;
            var rowinfo = this._hittestrow(x, y);
            if (!rowinfo)
                return;
            var row = rowinfo.row;
            var index = rowinfo.index;
            var targetclassname = event.target.className;
            var tablerow = this.table[0].rows[index];
            if (tablerow == null)
                return;

            self.mousecaptured = true;
            self.mousecaptureposition = { left: event.pageX, top: event.pageY - groupsheaderheight };

            var hScrollInstance = this.hScrollInstance;
            var horizontalscrollvalue = hScrollInstance.value;
            var cellindex = 0;
            var groupslength = this.groupable ? this.groups.length : 0;

            for (var i = 0; i < tablerow.cells.length; i++) {
                var columnleft = parseInt($(this.columnsrow[0].cells[i]).css('left'));
                var left = columnleft - horizontalscrollvalue;
                if (self.columns.records[i].pinned) {
                    left = columnleft;
                }

                var column = this._getcolumnat(i);
                if (column != null && column.hidden) {
                    continue;
                }

                var right = left + $(this.columnsrow[0].cells[i]).width();
                if (right >= x && x >= left) {
                    cellindex = i;
                    break;
                }
            }

            if (row != null) {
                var column = this._getcolumnat(cellindex);
                if (!(targetclassname.indexOf('jqx-grid-group-expand') != -1 || targetclassname.indexOf('jqx-grid-group-collapse') != -1)) {
                    if (row.boundindex != -1) {
                        self.begincelledit(self.getboundindex(row), column.datafield, column.defaulteditorvalue);
                    }
                }
            }
        },

        _getpreveditablecolumn: function (index) {
            var self = this;
            while (index > 0) {
                index--;
                var column = self.getcolumnat(index);
                if (!column)
                    return null;

                if (!column.editable)
                    continue;

                if (!column.hidden)
                    return column;
            }
            return null;
        },

        _getnexteditablecolumn: function (index) {
            var self = this;
            while (index < this.columns.records.length) {
                index++;
                var column = self.getcolumnat(index);

                if (!column)
                    return null;

                if (!column.editable)
                    continue;

                if (!column.hidden)
                    return column;
            }
            return null;
        },

        _handleeditkeydown: function (event, self) {
            if (self.handlekeyboardnavigation) {
                var handled = self.handlekeyboardnavigation(event);
                if (handled == true) {
                    return true;
                }
            }

            var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;

            if (self.showfilterrow && self.filterable) {
                if (this.filterrow) {
                    if ($(event.target).ischildof(this.filterrow))
                        return true;
                }
            }
            if (event.target.className && event.target.className.indexOf('jqx-grid-widget') >= 0) {
                return true;
            }
            if (self.pageable) {
                if ($(event.target).ischildof(this.pager)) {
                    return true;
                }
            }

            if (this.showtoolbar) {
                if ($(event.target).ischildof(this.toolbar)) {
                    return true;
                }
            }
            if (this.showeverpresentrow) {
                if (this.addnewrowtop) {
                    if ($(event.target).ischildof(this.addnewrowtop)) {
                        return true;
                    }
                }
                if (this.addnewrowbottom) {
                    if ($(event.target).ischildof(this.addnewrowbottom)) {
                        return true;
                    }
                }
            }
            if (this.showstatusbar) {
                if ($(event.target).ischildof(this.statusbar)) {
                    return true;
                }
            }

            if (this.rowdetails) {
                if ($(event.target).ischildof(this.content.find("[role='rowgroup']"))) {
                    return true;
                }
            }

            if (this.editcell) {
                if (this.editmode === "selectedrow") {
                    if (key === 13) {
                        this.endrowedit(this.editcell.row, false);
                        return false;
                    }
                    else if (key === 27) {
                        this.endrowedit(this.editcell.row, true);
                        return false;
                    }
                    if (key == 32)
                    {
                        if (this._currentColumn && this.getcolumn(this._currentColumn).columntype == 'checkbox')
                        {
                            var column = this.getcolumn(this._currentColumn);
                            if (column.editable)
                            {
                                var checked = !this.getcellvalue(this.editcell.row, column.datafield);
                                
                                var datarow = this.getrowdata(this.editcell.row);
                                var row = this.editcell.row;
                                var datarow = self.getrowdata(self.editcell.row);

                                this.setcellvalue(this.editcell.row, column.datafield, checked, false);
                                var focusedColumn = this._focusedColumn;
                                var currentColumn = this._currentColumn;
                                var _currentEditableColumn = this._currentEditableColumn;
                                this.endrowedit(this.editcell.row, false);
                                this.beginrowedit(row, false);
                                this._currentColumn = currentColumn;
                                this._focusedColumn = focusedColumn;
                                this._currentEditableColumn = _currentEditableColumn;
                                this._renderrows();
                                this.selectcell(row, column.datafield);
                                this._oldselectedcell = this.selectedcell;
                                if (focusedColumn)
                                {
                                    var that = this;
                                    setTimeout(function ()
                                    {
                                        that.selectcell(row, column.datafield);
                                        that._oldselectedcell = that.selectedcell;
                                        $(that._checkboxCells[column.datafield].checkbox).jqxCheckBox('focus');

                                    }, 25);
                                }
                                return false;
                            }
                        }
                    }
                    if (key === 9)
                    {
                            var datafield = this.editcell.datafield;
                        var columnindex = this._getcolumnindex(datafield);
                        if (this._currentEditableColumn)
                        {
                            columnindex = this._currentEditableColumn;
                        }
                        else
                        {
                            this._currentEditableColumn = columnindex;
                        }

                        var column = this._getnexteditablecolumn(columnindex);
                        if (event.shiftKey)
                        {
                            column = this._getpreveditablecolumn(columnindex);
                        }
                        if (column)
                        {
                            var columnindex = this._getcolumnindex(column.datafield);
                            if (this.editcell[column.datafield])
                            {
                                this._currentEditableColumn = columnindex;
                                var editor = this.editcell[column.datafield].editor;
                                if (editor)
                                {
                                    if (editor.data().jqxWidget && editor.data().jqxWidget.focus)
                                    {
                                        editor.data().jqxWidget.focus();
                                    }
                                    else
                                    {
                                        editor.focus();
                                    }
                                }
                                this._focusedColumn = column.datafield;
                                this._currentColumn = column.datafield;
                            }
                            else if (column.columntype == "checkbox")
                            {
                                this._currentColumn = column.datafield;
                                this._currentEditableColumn = columnindex;
                                this.selectcell(this.editcell.row, column.datafield);
                                this._oldselectedcell = this.selectedcell;
                                if (this._checkboxCells[column.datafield])
                                {
                                    $(this._checkboxCells[column.datafield].checkbox).jqxCheckBox('focus');
                                }
                                return false;
                            }
                        }
                        return false;
                    }

                    return true;
                }

                if (this.editcell.columntype == null || this.editcell.columntype == 'textbox' || this.editcell.columntype == 'numberinput' || this.editcell.columntype == 'combobox' || this.editcell.columntype == 'datetimeinput') {
                    if (key >= 33 && key <= 40 && self.selectionmode == 'multiplecellsadvanced') {
                        var editor = this.editcell.columntype == 'textbox' || this.editcell.columntype == null ? this.editcell.editor : this.editcell.editor.find('input');
                        var selection = self._selection(editor);
                        var strlength = editor.val().length;
                        if (selection.length > 0 && this.editcell.columntype != 'datetimeinput') {
                            self._cancelkeydown = true;
                        }

                        if (selection.start > 0 && key == 37) {
                            self._cancelkeydown = true;
                        }
                        if (selection.start < strlength && key == 39 && this.editcell.columntype != 'datetimeinput') {
                            self._cancelkeydown = true;
                        }
                        if (this.editcell.columntype == 'datetimeinput' && key == 39) {
                            if (selection.start + selection.length < strlength) {
                                self._cancelkeydown = true;
                            }
                        }
                    }
                }
                else if (this.editcell.columntype == 'dropdownlist') {
                    if (key == 37 || key == 39 && self.selectionmode == 'multiplecellsadvanced') {
                        self._cancelkeydown = false;
                    }
                }
                else if (this.selectionmode == 'multiplecellsadvanced' && this.editcell.columntype != 'textbox' && this.editcell.columntype != 'numberinput') {
                    self._cancelkeydown = true;
                }

                if (key == 32) {
                    if (self.editcell.columntype == 'checkbox') {
                        var column = self.getcolumn(self.editcell.datafield);
                        if (column.editable) {
                            var checked = !self.getcellvalue(self.editcell.row, self.editcell.column);
                            if (column.cellbeginedit) {
                                var beginEdit = column.cellbeginedit(self.editcell.row, column.datafield, column.columntype, !checked);
                                if (beginEdit == false) {
                                    return false;
                                }
                            }
                            var datarow = self.getrowdata(self.editcell.row);

                            self.setcellvalue(self.editcell.row, self.editcell.column, checked, true);

                            self._raiseEvent(18, { rowindex: self.editcell.row, row: datarow, datafield: self.editcell.column, oldvalue: !checked, value: checked, columntype: 'checkbox' });
                            return false;
                        }
                    }
                }
                if (key == 9) {
                    var rowindex = this.editcell.row;
                    var datafield = this.editcell.column;
                    var initialdatafield = datafield;
                    var columnindex = self._getcolumnindex(datafield);
                    var canedit = false;
                    var visibleindex = self.getrowvisibleindex(rowindex);
                    this.editchar = "";
                    var validated = this.editcell.validated;
                    if (!this.editcell.validated) {
                        var validated = this.endcelledit(this.editcell.row, this.editcell.column, false, true, false);
                    }

                    if (validated != false) {
                        if (event.shiftKey) {
                            var column = self._getpreveditablecolumn(columnindex);
                            if (column) {
                                datafield = column.datafield;
                                canedit = true;
                                if (self.selectionmode.indexOf('cell') != -1) {
                                    self.selectprevcell(rowindex, initialdatafield);
                                    self._oldselectedcell = self.selectedcell;
                                    setTimeout(function () {
                                        self.ensurecellvisible(visibleindex, datafield);
                                    }, 10);
                                }
                            }
                            else {
                                var lastColumn = self._getlastvisiblecolumn();
                                canedit = true;
                                datafield = lastColumn.displayfield;
                                rowindex--;
                                if (self.selectionmode.indexOf('cell') != -1) {
                                    self.clearselection();
                                    self.selectcell(rowindex, datafield);
                                    self._oldselectedcell = self.selectedcell;
                                    setTimeout(function () {
                                        self.ensurecellvisible(visibleindex, datafield);
                                    }, 10);
                                }
                            }
                        }
                        else {
                            var column = self._getnexteditablecolumn(columnindex);
                            if (column) {
                                datafield = column.datafield;
                                canedit = true;
                                if (self.selectionmode.indexOf('cell') != -1) {
                                    self.selectnextcell(rowindex, initialdatafield);
                                    self._oldselectedcell = self.selectedcell;
                                    setTimeout(function () {
                                        self.ensurecellvisible(visibleindex, datafield);
                                    }, 10);
                                }
                            }
                            else {
                                var firstColumn = self._getfirstvisiblecolumn();
                                canedit = true;
                                datafield = firstColumn.displayfield;
                                rowindex++;
                                if (self.selectionmode.indexOf('cell') != -1) {
                                    self.clearselection();
                                    self.selectcell(rowindex, datafield);
                                    self._oldselectedcell = self.selectedcell;
                                    setTimeout(function () {
                                        self.ensurecellvisible(visibleindex, datafield);
                                    }, 10);
                                }
                            }
                        }

                        if (canedit) {
                            self.begincelledit(rowindex, datafield);
                            if (this.editcell != null && this.editcell.columntype == 'checkbox') {
                                this._renderrows(this.virtualsizeinfo);
                            }
                        }
                        else {
                            if (this.editcell != null) {
                                self.endcelledit(rowindex, datafield, false);
                                this._renderrows(this.virtualsizeinfo);
                            }
                            return true;
                        }
                    }
                    return false;
                }
                else if (key == 13) {
                    var oldselectedcell = this.selectedcell;
                    if (oldselectedcell) {
                        var oldvisibleindex = this.getrowvisibleindex(oldselectedcell.rowindex);
                    }
                    this.endcelledit(this.editcell.row, this.editcell.column, false, true);
                    if (this.selectionmode == 'multiplecellsadvanced') {
                        var cell = self.getselectedcell();
                        if (cell != null) {
                            if (self.selectcell) {
                                if (this.editcell == null) {
                                    if (cell.rowindex + 1 < this.dataview.totalrecords) {
                                        if (this.sortcolumn != cell.datafield) {
                                            var visibleindex = this.getrowvisibleindex(cell.rowindex);
                                            var visiblerow = this.dataview.loadedrecords[visibleindex + 1];
                                            if (visiblerow) {
                                                if (!this.pageable || (this.pageable && visibleindex + 1 < (this.dataview.pagenum + 1 ) * this.pagesize)) {
                                                    this.clearselection(false);
                                                    this.selectcell(this.getboundindex(visiblerow), cell.datafield);
                                                    var cell = this.getselectedcell();
                                                    this.ensurecellvisible(visiblerow.visibleindex, cell.datafield);
                                                }
                                            }
                                        }
                                        else {
                                            if (oldselectedcell != null) {
                                                var oldvisiblerow = this.dataview.loadedrecords[oldvisibleindex + 1];
                                                if (oldvisiblerow) {
                                                    if (!this.pageable || (this.pageable && oldvisibleindex + 1 < this.pagesize)) {
                                                        this.clearselection(false);
                                                        this.selectcell(this.getboundindex(oldvisiblerow), cell.datafield);
                                                    }
                                                    else if (this.pageable && oldvisibleindex + 1 >= this.pagesize) {
                                                        this.clearselection(false);
                                                        var oldvisiblerow = this.dataview.loadedrecords[oldvisibleindex];
                                                        this.selectcell(this.getboundindex(oldvisiblerow), cell.datafield);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return false;
                }
                else if (key == 27) {
                    this.endcelledit(this.editcell.row, this.editcell.column, true, true);
                    return false;
                }
            }
            else {
                var startedit = false;
                if (key == 113) {
                    startedit = true;
                }
                if (!event.ctrlKey && !event.altKey && !event.metaKey) {
                    if (key >= 48 && key <= 57) {
                        this.editchar = String.fromCharCode(key);
                        startedit = true;
                    }
                    if (key === 189) {
                        startedit = true;
                    }

                    if (key >= 65 && key <= 90) {
                        this.editchar = String.fromCharCode(key);
                        var shifton = false;
                        if (event.shiftKey) {
                            shifton = event.shiftKey;
                        } else if (event.modifiers) {
                            shifton = !!(event.modifiers & 4);
                        }
                        if (!shifton) {
                            this.editchar = this.editchar.toLowerCase();
                        }
                        startedit = true;
                    }
                    else if (key >= 96 && key <= 105) {
                        this.editchar = key - 96;
                        this.editchar = this.editchar.toString();
                        startedit = true;
                    }
                    var gridscount = $('.jqx-grid').length;
                    startedit = startedit && (gridscount == 1 || (gridscount > 1 && self.focused));
                    var editID = $.data(document.body, 'jqxgrid.edit');
                    if (editID !== undefined && editID !== "") {
                        if (key === 13 || startedit) {
                            if (editID != self.element.id) {
                                return true;
                            }
                        }
                    }
                }

                if (key == 13 || startedit) {
                    if (self.getselectedrowindex) {
                        var rowindex = self.getselectedrowindex();
                        if (self.editmode === 'selectedrow') {
                            self.beginrowedit(rowindex);
                            return false;
                        }

                        switch (self.selectionmode) {
                            case 'singlerow':
                            case 'multiplerows':
                            case 'multiplerowsextended':
                                {
                                    if (rowindex >= 0) {
                                        var datafield = "";
                                        for (var m = 0; m < self.columns.records.length; m++) {
                                            var column = self.getcolumnat(m);
                                            if (column.editable) {
                                                datafield = column.datafield;
                                                break;
                                            }
                                        }
                                        if (self.editmode === 'selectedrow') {
                                            self.beginrowedit(rowindex);
                                        }
                                        else {
                                            self.begincelledit(rowindex, datafield);
                                        }
                                    }
                                    break;
                                }
                            case 'singlecell':
                            case 'multiplecells':
                            case 'multiplecellsextended':
                                var cell = self.getselectedcell();
                                if (cell != null) {
                                    var column = self._getcolumnbydatafield(cell.datafield);
                                    if (column.columntype != 'checkbox') {
                                        self.begincelledit(cell.rowindex, cell.datafield);
                                    }
                                }
                                break;
                            case "multiplecellsadvanced":
                                var cell = self.getselectedcell();
                                if (cell != null) {
                                    if (key == 13) {
                                        if (self.selectcell) {
                                            var visibleindex = this.getrowvisibleindex(cell.rowindex);
                                            if (visibleindex + 1 < self.dataview.totalrecords) {
                                                var visiblerow = this.dataview.loadedrecords[visibleindex + 1];
                                                if (visiblerow) {
                                                    this.clearselection(false);
                                                    this.selectcell(this.getboundindex(visiblerow), cell.datafield);
                                                    var cell = this.getselectedcell();
                                                    this.ensurecellvisible(visiblerow.visibleindex, cell.datafield);
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        if (self.editmode !== "selectedrow") {
                                            self.begincelledit(cell.rowindex, cell.datafield);
                                        }
                                    }
                                }

                                break;
                        }
                        return false;
                    }
                }
                if (key == 46) {
                    var cells = self.getselectedcells();
                    if (self.selectionmode.indexOf('cell') == -1) {
                        if (self._getcellsforcopypaste) {
                            cells = self._getcellsforcopypaste();
                        }
                    }
                    if (cells != null && cells.length > 0) {
                        for (var cellIndex = 0; cellIndex < cells.length; cellIndex++) {
                            var cell = cells[cellIndex];
                            if (!cell.datafield) continue;
                            var column = self.getcolumn(cell.datafield);
                            var cellValue = self.getcellvalue(cell.rowindex, cell.datafield);
                            if (cellValue !== "" && column.editable && self.enablekeyboarddelete) {
                                var newvalue = null;
                                if (column.columntype == "checkbox") {
                                    if (!column.threestatecheckbox) {
                                        newvalue = false;
                                    }
                                }
                                if (column.cellbeginedit) {
                                    var beginEdit = column.cellbeginedit(cell.rowindex, column.datafield, column.columntype, newvalue);
                                    if (beginEdit == false) {
                                        return false;
                                    }
                                }
                                var datarow = self.getrowdata(cell.rowindex);
                                self._raiseEvent(17, { rowindex: cell.rowindex, row: datarow, datafield: cell.datafield, value: cellValue });
                                if (cellIndex == cells.length - 1) {
                                    self.setcellvalue(cell.rowindex, cell.datafield, newvalue, true);
                                    if (column.displayfield != column.datafield) {
                                        self.setcellvalue(cell.rowindex, column.displayfield, newvalue, true);
                                    }
                                }
                                else {
                                    self.setcellvalue(cell.rowindex, cell.datafield, newvalue, false);
                                    if (column.displayfield != column.datafield) {
                                        self.setcellvalue(cell.rowindex, column.displayfield, newvalue, true);
                                    }
                                }
                                if (column.cellendedit) {
                                    var cellendeditresult = column.cellendedit(cell.rowindex, column.datafield, column.columntype, newvalue);
                                }
                                self._raiseEvent(18, { rowindex: cell.rowindex, row: datarow, datafield: cell.datafield, oldvalue: cellValue, value: newvalue });
                            }
                        }
                        this.dataview.updateview();
                        this._renderrows(this.virtualsizeinfo);
                        return false;
                    }
                }
                if (key == 32) {
                    var cell = self.getselectedcell();
                    if (cell != null) {
                        var column = self.getcolumn(cell.datafield);
                        if (column.columntype == 'checkbox' && column.editable) {
                            var checked = !self.getcellvalue(cell.rowindex, cell.datafield);
                            if (column.cellbeginedit) {
                                var beginEdit = column.cellbeginedit(cell.rowindex, column.datafield, column.columntype, !checked);
                                if (beginEdit == false) {
                                    return false;
                                }
                            }

                            var datarow = self.getrowdata(cell.rowindex);
                            self._raiseEvent(17, { rowindex: cell.rowindex, row: datarow, datafield: cell.datafield, value: !checked, columntype: 'checkbox' });
                            self.setcellvalue(cell.rowindex, cell.datafield, checked, true);
                            self._raiseEvent(18, { rowindex: cell.rowindex, row: datarow, datafield: cell.datafield, oldvalue: !checked, value: checked, columntype: 'checkbox' });
                            return false;
                        }
                    }
                }
            }

            return true;
        },

        // begins cell editing.
        begincelledit: function (row, datafield, defaultvalue, ensurevisible, render) {
            var column = this.getcolumn(datafield);
            this._cellscache = new Array();

            if (datafield == null)
                return;

            if (column.columntype == "number" || column.columntype == "button" || column.createwidget) {
                return;
            }

            if (this.groupable) {
                if (this.groups.indexOf(datafield) >= 0) {
                    return;
                }
                if (this.groups.indexOf(column.displayfield) >= 0) {
                    return;
                }
            }

            if (this.editrow != undefined) return;

            if (this.editcell) {
                if (this.editcell.row == row && this.editcell.column == datafield) {
                    return true;
                }
                if (this.editmode === "selectedrow") {
                    if (this.editcell.row == row) {
                        return;
                    }
                }

                var validated = this.endcelledit(this.editcell.row, this.editcell.column, false, true, false);
                if (false == validated)
                    return;
            }

            var isembeddededitor = column.columntype == 'checkbox' || column.columntype == 'button' || column.createwidget;
            this.host.removeClass('jqx-disableselect');
            this.content.removeClass('jqx-disableselect');

            if (column.editable) {
                if (column.cellbeginedit) {
                    var cell = this.getcell(row, datafield);
                    var beginEdit = column.cellbeginedit(row, datafield, column.columntype, cell != null ? cell.value : null);
                    if (beginEdit == false)
                        return;
                }

                var visiblerowindex = this.getrowvisibleindex(row);
                this.editcell = this.getcell(row, datafield);
                if (this.editcell) {
                    this.editcell.visiblerowindex = visiblerowindex;
                    if (!this.editcell.editing) {
                        if (!isembeddededitor) {
                            this.editcell.editing = true;
                        }
                        this.editcell.columntype = column.columntype;
                        this.editcell.defaultvalue = defaultvalue;
                        if (column.defaultvalue != undefined) {
                            this.editcell.defaultvalue = column.defaultvalue;
                        }
                        this.editcell.init = true;
                        // raise begin cell edit event.
                        if (column.columntype != "checkbox" && this.editmode != "selectedrow") {
                            var datarow = this.getrowdata(row);
                            this._raiseEvent(17, { rowindex: row, row: datarow, datafield: column.datafield, value: this.editcell.value, columntype: column.columntype });
                        }
                        $.data(document.body, 'jqxgrid.edit', this.element.id);

                        if (!isembeddededitor) {
                            var visibleindex = this.getrowvisibleindex(row);
                            if (ensurevisible !== false)
                            {
                                if (!this.autorowheight)
                                {
                                    this.ensurecellvisible(visibleindex, column.datafield);
                                }
                            }
                            if (render !== false) {
                                this._renderrows(this.virtualsizeinfo);
                            }
                        }
                        if (this.editcell) {
                            this.editcell.init = false;
                            return true;
                        }
                    }
                }
            }
            else {
                if (!this.editcell) {
                    return;
                }
                this.editcell.editor = null;
                this.editcell.editing = false;
                if (render !== false) {
                    this._renderrows(this.virtualsizeinfo);
                }
                this.editcell = null;
            }
        },

        getScrollTop: function () {
            if (this._py) {
                return pageYOffset;
            }

            this._py = typeof pageYOffset != 'undefined';
            if (this._py) {
                //most browsers
                return pageYOffset;
            }
            else{
                    var B= document.body; //IE 'quirks'
                var D= document.documentElement; //IE with doctype
                D= (D.clientHeight)? D: B;
                return D.scrollTop;
            }
        },

        getScrollLeft: function () {
            if (typeof pageXOffset != 'undefined') {
                //most browsers
                return pageXOffset;
            }
            else {
                var B = document.body; //IE 'quirks'
                var D = document.documentElement; //IE with doctype
                D = (D.clientHeight) ? D : B;
                return D.scrollLeft;
            }
        },

        endcelledit: function (row, datafield, cancelchanges, refresh, focus) {
            if (row == undefined || datafield == undefined) {
                if (this.editcell) {
                    row = this.editcell.row;
                    datafield = this.editcell.column;
                }
                if (cancelchanges == undefined) {
                    cancelchanges = true;
                }
            }

            if (!this.editcell) {
                return;
            }

            var column = this.getcolumn(datafield);
            var me = this;

            if (me.editmode === "selectedrow") {
                this.endrowedit(row, cancelchanges);
                return;
            }

            var setfocus = function () {
                if (focus != false) {
                    if (me.isTouchDevice()) {
                        return;
                    }

                    if (!me.isNestedGrid) {
                        var topPos = me.getScrollTop();
                        var leftPos = me.getScrollLeft();

                        try
                        {
                            me.element.focus();
                            me.content.focus();
                            if (topPos != me.getScrollTop()) {
                                window.scrollTo(leftPos, topPos);
                            }

                            setTimeout(function () {
                                me.element.focus();
                                me.content.focus();
                                if (topPos != me.getScrollTop()) {
                                    window.scrollTo(leftPos, topPos);
                                }
                            }, 10);
                        }
                        catch (error) {
                        }
                    }
                }
            }

            if (column.columntype == 'checkbox' || column.columntype == 'button' || column.createwidget) {
                if (this.editcell) {
                    this.editcell.editor = null;
                    this.editcell.editing = false;
                    this.editcell = null;
                }
                return true;
            }

            var editorvalue = this._geteditorvalue(column);

            var cancelchangesfunc = function (me) {
                me._hidecelleditor();
                if (column.cellendedit) {
                    column.cellendedit(row, datafield, column.columntype, me.editcell.value, editorvalue);           
                }
                me.editchar = null;
                if (column.displayfield != column.datafield) {
                    var label = me.getcellvalue(me.editcell.row, column.displayfield);
                    var value = me.editcell.value;
                    oldvalue = { value: value, label: label };
                }
                else oldvalue = me.editcell.value;
                var rowdata = me.getrowdata(row);
                me._raiseEvent(18, { rowindex: row, row: rowdata, datafield: datafield, displayfield: column.displayfield, oldvalue: editorvalue, value: editorvalue, columntype: column.columntype });

                me.editcell.editor = null;
                me.editcell.editing = false;
                me.editcell = null;
                if (refresh || refresh == undefined) {
                    me._renderrows(me.virtualsizeinfo);
                }
                setfocus();
                if (!me.enablebrowserselection) {
                    me.host.addClass('jqx-disableselect');
                    me.content.addClass('jqx-disableselect');
                }
            }

            if (cancelchanges) {
                cancelchangesfunc(this);
                return false;
            }

            if (this.validationpopup) {
                this.validationpopup.hide();
                this.validationpopuparrow.hide();
            }

            if (column.cellvaluechanging) {
                var newcellvalue = column.cellvaluechanging(row, datafield, column.columntype, this.editcell.value, editorvalue);
                if (newcellvalue != undefined) {
                    editorvalue = newcellvalue;
                }
            }

            if (column.validation) {
                var cell = this.getcell(row, datafield);
                try {
                    var validationobj = column.validation(cell, editorvalue);
                    var validationmessage = this.gridlocalization.validationstring;
                    if (validationobj.message != undefined) {
                        validationmessage = validationobj.message;
                    }
                    var result = typeof validationobj == "boolean" ? validationobj : validationobj.result;

                    if (!result) {
                        if (validationobj.showmessage == undefined || validationobj.showmessage == true) {
                            this._showvalidationpopup(row, datafield, validationmessage);
                        }
                        this.editcell.validated = false;
                        return false;
                    }
                }
                catch (error) {
                    this._showvalidationpopup(row, datafield, this.gridlocalization.validationstring);
                    this.editcell.validated = false;
                    return false;
                }
            }

            if (column.displayfield != column.datafield) {
                var label = this.getcellvalue(this.editcell.row, column.displayfield);
                var value = this.editcell.value;
                oldvalue = { value: value, label: label };
            }
            else oldvalue = this.editcell.value;

            var datarow = this.getrowdata(row);
            if (column.cellendedit) {
                var cellendeditresult = column.cellendedit(row, datafield, column.columntype, this.editcell.value, editorvalue);
                if (cellendeditresult == false) {
                    this._raiseEvent(18, { rowindex: row, row: datarow, datafield: datafield, displayfield: column.displayfield, oldvalue: oldvalue, value: oldvalue, columntype: column.columntype });
                    cancelchangesfunc(this);
                    return false;
                }
            }

            this._raiseEvent(18, { rowindex: row, row: datarow, datafield: datafield, displayfield: column.displayfield, oldvalue: oldvalue, value: editorvalue, columntype: column.columntype });

            this._hidecelleditor(false);
            if (this.editcell != undefined) {
                this.editcell.editor = null;
                this.editcell.editing = false;
            }
            this.editcell = null;
            this.editchar = null;
            this.setcellvalue(row, datafield, editorvalue, refresh);
            if (!this.enablebrowserselection) {
                this.host.addClass('jqx-disableselect');
                this.content.addClass('jqx-disableselect');
            }
            if (!$.jqx.browser.msie) {
                setfocus();
            }
            $.data(document.body, 'jqxgrid.edit', "");

            // raise end cell edit event.
            return true;
        },

        beginrowedit: function (row) {
            var me = this;
            var lastIndex = -1;
            me._oldselectedrow = row;
            this._cellscache = new Array();
            var programmaticMode = false;
            if (this.editmode != "selectedrow") {
                programmaticMode = true;
            }

            if (programmaticMode) {
                var tmpmode = this.editmode;
                this.editmode = "selectedrow";
            }
            var firstEditableColumn = null;
            $.each(this.columns.records, function (index, value) {
                if (me.editable && this.editable)
                {
                    if (this.columntype === "checkbox" || this.columntype === "custom" || this.columntype === "widget" || this.columntype === "template" || this.columntype === "button") {
                        return true;
                    }

                    if (!firstEditableColumn)
                    {
                        firstEditableColumn = this.datafield;
                    }
             
                    var cell = me.getcell(row, this.datafield);
                    me.begincelledit(row, this.datafield, null, false, false);
                    var datarow = me.getrowdata(row);
                    me._raiseEvent(17, { rowindex: row, row: datarow, datafield: this.datafield, value: cell.value, columntype: this.columntype });
                }
            });
            if (me.editcell) {
                me.editcell.init = true;
            }
            this._renderrows(this.virtualsizeinfo);
            if (programmaticMode) {
                this.editmode = tmpmode;
            }
            if (firstEditableColumn && me.editcell)
            {
                setTimeout(function ()
                {
                    if (me.editcell) {
                        var editor = me.editcell[firstEditableColumn].editor;
                        if (editor) {
                            if (editor.data().jqxWidget && editor.data().jqxWidget.focus) {
                                editor.data().jqxWidget.focus();
                            }
                            else {
                                editor.focus();
                            }
                        }
                    }
                }, 25);
            }
        },

        endrowedit: function (row, cancelchanges) {
            var me = this;
            this._currentEditableColumn = 0;
            this._focusedColumn = null;
            this._currentColumn = null;
            this._checkboxCells = [];

            if (!this.editcell)
            {
                return false;
            }

            if (this.editcell.editor == undefined && this.editcell.columntype !== "checkbox") {
                return false;
            }

            var setfocus = function () {
                if (focus != false) {
                    if (me.isTouchDevice()) {
                        return;
                    }

                    if (!me.isNestedGrid) {
                        var topPos = me.getScrollTop();
                        var leftPos = me.getScrollLeft();

                        try {
                            me.element.focus();
                            me.content.focus();
                            if (topPos != me.getScrollTop()) {
                                window.scrollTo(leftPos, topPos);
                            }

                            setTimeout(function () {
                                me.element.focus();
                                me.content.focus();
                                if (topPos != me.getScrollTop()) {
                                    window.scrollTo(leftPos, topPos);
                                }
                            }, 10);
                        }
                        catch (error) {
                        }
                    }
                }
            }

            var programmaticMode = false;
            if (this.editmode != "selectedrow") {
                programmaticMode = true;
            }

            if (programmaticMode) {
                var tmpmode = this.editmode;
                this.editmode = "selectedrow";
            }

            var hasInvalidColumns = false;
            var values = {};
            if (this.validationpopup) {
                this.validationpopup.hide();
                this.validationpopuparrow.hide();
            }

            for (var i = 0; i < this.columns.records.length; i++) {
                var column = this.columns.records[i];
                if (!column.editable) {
                    continue;
                }

                if (column.hidden) {
                    continue;
                }

                if (column.columntype == "checkbox") {
                    continue;
                }
                if (column.createwidget) {
                    continue;
                }

                var editorvalue = this._geteditorvalue(column);

                var cancelchangesfunc = function (me) {
                    me._hidecelleditor();
                    var oldval = me.getcellvalue(me.editcell.row, column.displayfield);
                    if (column.cellendedit) {
                        column.cellendedit(row, datafield, column.columntype, oldval, editorvalue);
                    }
                    me.editchar = null;
                    if (column.displayfield != column.datafield) {
                        var label = me.getcellvalue(me.editcell.row, column.displayfield);
                        var value = oldval;
                        oldvalue = { value: value, label: label };
                    }
                    else oldvalue = oldval;

                    var datarow = me.getrowdata(row);
                    me._raiseEvent(18, { rowindex: row, row: datarow, datafield: datafield, displayfield: column.displayfield, oldvalue: oldval, value: oldval, columntype: column.columntype });

                    me.editcell.editing = false;
                }

                if (cancelchanges) {
                    cancelchangesfunc(this);
                    continue;
                }

                if (column.cellvaluechanging) {
                    var oldvalue = this.getcellvalue(this.editcell.row, column.displayfield);
                    var newcellvalue = column.cellvaluechanging(row, datafield, column.columntype, oldvalue, editorvalue);
                    if (newcellvalue != undefined) {
                        editorvalue = newcellvalue;
                    }
                }

                var datafield = column.datafield;
                if (column.validation) {
                    var cell = this.getcell(row, column.datafield);
                    try {
                        var validationobj = column.validation(cell, editorvalue);
                        var validationmessage = this.gridlocalization.validationstring;
                        if (validationobj.message != undefined) {
                            validationmessage = validationobj.message;
                        }
                        var result = typeof validationobj == "boolean" ? validationobj : validationobj.result;

                        if (!result) {
                            if (validationobj.showmessage == undefined || validationobj.showmessage == true) {
                                this._showvalidationpopup(row, datafield, validationmessage);
                            }
                            hasInvalidColumns = true;
                            this.editcell[column.datafield].validated = false;
                            continue;
                        }
                    }
                    catch (error) {
                        this._showvalidationpopup(row, datafield, this.gridlocalization.validationstring);
                        this.editcell[column.datafield].validated = false;
                        hasInvalidColumns = true;
                        continue;
                    }
                }

                if (column.displayfield != column.datafield) {
                    var label = this.getcellvalue(this.editcell.row, column.displayfield);
                    var value = this.editcell.value;
                    oldvalue = { value: value, label: label };
                }
                else oldvalue = this.getcellvalue(this.editcell.row, column.displayfield);
                values[column.datafield] = { newvalue: editorvalue, oldvalue: oldvalue };
               // raise end cell edit event.
            }

            var rowvalues = {};
            var oldvalues = {};
            if (!hasInvalidColumns) {
                this._hidecelleditor(false);
             
                for (var i = 0; i < this.columns.records.length; i++) {
                    var column = this.columns.records[i];
                    var datafield = column.datafield;

                    if (column.hidden) {
                        continue;
                    }

                    if (!column.editable) {
                        continue;
                    }

                    var datarow = this.getrowdata(row);
                    if (column.createwidget) {
                        continue;
                    }

                    if (column.columntype == "checkbox") {
                        var editorvalue = this.getcellvalue(row, column.displayfield);
                        this._raiseEvent(18, { rowindex: row, row: datarow, datafield: column.datafield, displayfield: column.displayfield, oldvalue: editorvalue, value: editorvalue, columntype: column.columntype });
                        continue;
                    }

                    if (!values[column.datafield]) {
                        continue;
                    }

                    var editorvalue = values[column.datafield].newvalue;
                    var oldvalue = values[column.datafield].oldvalue;
              
                    if (column.cellendedit) {
                        var cellendeditresult = column.cellendedit(row, datafield, column.columntype, oldvalue, editorvalue);
                        if (cellendeditresult == false) {
                            this._raiseEvent(18, { rowindex: row, row: datarow, datafield: datafield, displayfield: column.displayfield, oldvalue: oldvalue, value: oldvalue, columntype: column.columntype });
                            cancelchangesfunc(this);
                            continue;
                        }
                    }

                    if (!this.source.updaterow) {
                        this._raiseEvent(18, { rowindex: row, row: datarow, datafield: column.datafield, displayfield: column.displayfield, oldvalue: oldvalue, value: editorvalue, columntype: column.columntype });
                    }

                    rowvalues[column.datafield] = editorvalue;
                    oldvalues[column.datafield] = oldvalue;
                }
                var rowid = this.getrowid(row);
                var datarow = this.getrowdata(row);
                $.each(rowvalues, function (index, value) {
                    if (value && value.label != undefined) {
                        var column = me.getcolumn(index);
                        datarow[column.displayfield] = value.label;
                        datarow[column.datafield] = value.value;
                    }
                    else {
                        datarow[index] = value;
                    }
                });

         
                if (!this.enablebrowserselection) {
                    this.host.addClass('jqx-disableselect');
                    this.content.addClass('jqx-disableselect');
                }
                $.data(document.body, 'jqxgrid.edit', "");
                this.editcell = null;
                this.editchar = null;

                if (this.source.updaterow) {
                    var success = false;
                    var me = this;
                    var result = function (param) {
                        var tmp = me.source.updaterow;
                        me.source.updaterow = null;
                        if (false == param) {
                            $.each(oldvalues, function (index, value) {
                                if (value && value.label != undefined) {
                                    var column = me.getcolumn(index);
                                    datarow[column.displayfield] = value.label;
                                    datarow[column.datafield] = value.value;
                                }
                                else {
                                    datarow[index] = value;
                                }
                            });
                            me.updaterow(rowid, datarow);
                        }
                        else {
                            me.updaterow(rowid, datarow);
                        }

                        for (var i = 0; i < me.columns.records.length; i++) {
                            var column = me.columns.records[i];
                            var datafield = column.datafield;
                            me._raiseEvent(18, { rowindex: row, datafield: column.datafield, row: datarow, displayfield: column.displayfield, oldvalue: oldvalues[column.datafield], value: datarow[column.displayfield], columntype: column.columntype });
                        }
                        me.source.updaterow = tmp;
                    }
                    try {
                        success = this.source.updaterow(rowid, datarow, result);
                        if (success == undefined) success = true;
                    }
                    catch (error) {
                        success = false;
                        return;
                    }
                }
                else {
                    this.updaterow(rowid, datarow);
                    this._renderrows(this.virtualsizeinfo);
                }
            }

            if (programmaticMode) {
                this.editmode = tmpmode;
            }

            return hasInvalidColumns;
        },

        _selection: function (textbox) {
            if ('selectionStart' in textbox[0]) {
                var e = textbox[0];
                var selectionLength = e.selectionEnd - e.selectionStart;
                return { start: e.selectionStart, end: e.selectionEnd, length: selectionLength, text: e.value };
            }
            else {
                var r = document.selection.createRange();
                if (r == null) {
                    return { start: 0, end: e.value.length, length: 0 }
                }

                var re = textbox[0].createTextRange();
                var rc = re.duplicate();
                re.moveToBookmark(r.getBookmark());
                rc.setEndPoint('EndToStart', re);
                var selectionLength = r.text.length;

                return { start: rc.text.length, end: rc.text.length + r.text.length, length: selectionLength, text: r.text };
            }
        },

        _setSelection: function (start, end, textbox) {
            if ('selectionStart' in textbox[0]) {
                textbox[0].focus();
                textbox[0].setSelectionRange(start, end);
            }
            else {
                var range = textbox[0].createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        },

        // finds the index to select in the jqxDropDownList editor.
        findRecordIndex: function (value, datafield, records) {
            var records = records;

            if (datafield) {
                var length = records.length;

                // loop through all records.
                for (var urec = 0; urec < length; urec++) {
                    var datarow = records[urec];
                    var currentValue = datarow['label'];
                    if (value == currentValue)
                        return urec;
                }
            }

            return -1;
        },

        _destroyeditors: function () {
            var me = this;
            if (!this.columns.records) return;
            $.each(this.columns.records, function (i, value) {
                var datafieldname = $.trim(this.datafield).split(" ").join("");

                switch (this.columntype) {
                    case "dropdownlist":
                        var dropdownlist = me.editors["dropdownlist" + "_" + datafieldname];
                        if (dropdownlist) {
                            dropdownlist.jqxDropDownList('destroy');
                            me.editors["dropdownlist" + "_" + datafieldname] = null;
                        }
                        break;
                    case "combobox":
                        var combobox = me.editors["combobox" + "_" + datafieldname];
                        if (combobox) {
                            combobox.jqxComboBox('destroy');
                            me.editors["combobox" + "_" + datafieldname] = null;
                        }
                        break;
                    case "datetimeinput":
                        var datetimeinput = me.editors["datetimeinput" + "_" + this.datafield];
                        if (datetimeinput) {
                            datetimeinput.jqxDateTimeInput('destroy');
                            me.editors["datetimeinput" + "_" + datafieldname] = null;
                        }
                        break;
                    case "numberinput":
                        var numberinput = me.editors["numberinput" + "_" + datafieldname];
                        if (numberinput) {
                            numberinput.jqxNumberInput('destroy');
                            me.editors["numberinput" + "_" + datafieldname] = null;
                        }
                        break;
                    case "custom":
                    case "template":
                        if (me.destroyeditor) {
                            if (me.editors["templateeditor" + "_" + datafieldname]) {
                                me.destroyeditor(me.editors["templateeditor" + "_" + datafieldname]);
                                me.editors["templateeditor" + "_" + datafieldname] = null;
                            }
                        }
                        if (me.destroyeditor) {
                            var rows = me.getrows.length();
                            for (var t = 0; t < rows; t++) {
                                if (me.editors["customeditor" + "_" + datafieldname + "_" + t]) {
                                    me.destroyeditor(me.editors["customeditor" + "_" + datafieldname + "_" + t], t);
                                    me.editors["customeditor" + "_" + datafieldname + "_" + t] = null;
                                }
                            }
                        }
                        break;
                    case "textbox":
                    default:
                        var textbox = me.editors["textboxeditor" + "_" + datafieldname];
                        if (textbox) {
                            me.removeHandler(textbox, 'keydown');
                            me.editors["textbox" + "_" + datafieldname] = null;
                        }
                        break;
                }
            });
            me.editors = new Array();
        },

        _showcelleditor: function (row, column, element, init, focusable) {
            if (element == undefined)
                return;

            if (this.editcell == null)
                return;

            if (column.columntype == 'checkbox' && column.editable)
            {
                if (this.editmode == "selectedrow")
                {
                    if (!this._checkboxCells)
                    {
                        this._checkboxCells = [];
                    }
                    this._checkboxCells[column.datafield] = element;
                }
                return;
            }

            if (focusable == undefined) focusable = true;
            if (this.editmode == "selectedrow") {
                this.editchar = "";
                focusable = false;
            }

            var datafield = column.datafield;
            var $element = $(element);
            var me = this;
            var editor = this.editcell.editor;
            var cellvalue = this.getcellvalue(row, datafield);
            var celltext = this.getcelltext(row, datafield);
            var hScrollInstance = this.hScrollInstance;
            var horizontalscrollvalue = hScrollInstance.value;
            var left = parseInt(horizontalscrollvalue);
            var columnIndex = this.columns.records.indexOf(column);
            this.editcell.element = element;

            if (this.editcell.validated == false) {
                var validationmessage = "";
                if (this.validationpopup) {
                    validationmessage = this.validationpopup.text();
                }

                this._showvalidationpopup(row, datafield, validationmessage);
            }

            var focuseditor = function (editor) {
                if (me.hScrollInstance.isScrolling() || me.vScrollInstance.isScrolling())
                    return;

                if (!focusable)
                    return;

                if (me.isTouchDevice()) {
                    return;
                }

                //         if (!me.isNestedGrid) {
                if (editor) {
                    editor.focus();
                }
                //       }

                if (me.gridcontent[0].scrollTop != 0) {
                    me.scrolltop(Math.abs(me.gridcontent[0].scrollTop));
                    me.gridcontent[0].scrollTop = 0;
                }

                if (me.gridcontent[0].scrollLeft != 0) {
                    me.gridcontent[0].scrollLeft = 0;
                }
            }

            switch (column.columntype) {
                case "dropdownlist":
                    if (this.host.jqxDropDownList) {
                        element.innerHTML = "";
                        var datafieldname = $.trim(column.datafield).split(" ").join("");
                        var displayfield = $.trim(column.displayfield).split(" ").join("");

                        if (datafieldname.indexOf('.') != -1) {
                            datafieldname = datafieldname.replace('.', "");
                        }
                        if (displayfield.indexOf('.') != -1) {
                            displayfield = displayfield.replace('.', "");
                        }

                        var dropdownlisteditor = this.editors["dropdownlist" + "_" + datafieldname];
                        editor = dropdownlisteditor == undefined ? $("<div style='border-radius: 0px; -moz-border-radius: 0px; -webkit-border-radius: 0px; z-index: 99999; top: 0px; left: 0px; position: absolute;' id='dropdownlisteditor'></div>") : dropdownlisteditor;
                        editor.css('top', $(element).parent().position().top);
                        if (this.oldhscroll) {
                            editor.css('left', -left + parseInt($(element).position().left));
                        }
                        else {
                            editor.css('left', parseInt($(element).position().left));
                        }
                   
                        if (column.pinned) {
                            editor.css('left', left + parseInt($(element).position().left));
                        }


                        if (dropdownlisteditor == undefined) {
                            editor.prependTo(this.table);
                            editor[0].id = "dropdownlisteditor" + this.element.id + datafieldname;
                            var isdataadapter = this.source._source ? true : false;
                            var dataadapter = null;

                            if (!isdataadapter) {
                                dataadapter = new $.jqx.dataAdapter(this.source,
                                {
                                    autoBind: false,
                                    uniqueDataFields: [displayfield],
                                    async: false,
                                    autoSort: true,
                                    autoSortField: displayfield
                                });
                            }
                            else {
                                var dataSource =
                                {
                                    localdata: this.source.records,
                                    datatype: this.source.datatype,
                                    async: false
                                }

                                dataadapter = new $.jqx.dataAdapter(dataSource,
                                {
                                    autoBind: false,
                                    async: false,
                                    uniqueDataFields: [displayfield],
                                    autoSort: true,
                                    autoSortField: displayfield
                                });
                            }

                            var autoheight = !column.createeditor ? true : false;
                            editor.jqxDropDownList({ enableBrowserBoundsDetection: true, keyboardSelection: false, source: dataadapter, rtl: this.rtl, autoDropDownHeight: autoheight, theme: this.theme, width: $element.width() - 2, height: $element.height() - 2, displayMember: displayfield, valueMember: datafield });
                            this.editors["dropdownlist" + "_" + datafieldname] = editor;
                            if (column.createeditor) {
                                column.createeditor(row, cellvalue, editor);
                            }
                        }
                        if (column._requirewidthupdate) {
                            editor.jqxDropDownList({ width: $element.width() - 2 });
                        }

                        var dropdownitems = editor.jqxDropDownList('listBox').visibleItems;
                        if (!column.createeditor) {
                            if (dropdownitems.length < 8) {
                                editor.jqxDropDownList('autoDropDownHeight', true);
                            }
                            else {
                                editor.jqxDropDownList('autoDropDownHeight', false);
                            }
                        }
                        var cellvalue = this.getcellvalue(row, displayfield);
                        var selectedIndex = this.findRecordIndex(cellvalue, displayfield, dropdownitems);
                        if (init) {
                            if (cellvalue != "") {
                                editor.jqxDropDownList('selectIndex', selectedIndex, true);
                            }
                            else {
                                editor.jqxDropDownList('selectIndex', -1);
                            }
                        }
                        if (!this.editcell) {
                            return;
                        }

                        if (this.editcell.defaultvalue != undefined) {
                            editor.jqxDropDownList('selectIndex', this.editcell.defaultvalue, true);
                        }
                  
                        if (focusable) {
                            editor.jqxDropDownList('focus');
                        }
                    }
                    break;
                case "combobox":
                    if (this.host.jqxComboBox) {
                        element.innerHTML = "";
                        var datafieldname = $.trim(column.datafield).split(" ").join("");
                        var displayfield = $.trim(column.displayfield).split(" ").join("");
                        if (datafieldname.indexOf('.') != -1) {
                            datafieldname = datafieldname.replace('.', "");
                        }
                        if (displayfield.indexOf('.') != -1) {
                            displayfield = displayfield.replace('.', "");
                        }

                        var comboboxeditor = this.editors["combobox" + "_" + datafieldname];
                        editor = comboboxeditor == undefined ? $("<div style='border-radius: 0px; -moz-border-radius: 0px; -webkit-border-radius: 0px; z-index: 99999; top: 0px; left: 0px; position: absolute;' id='comboboxeditor'></div>") : comboboxeditor;
                        editor.css('top', $(element).parent().position().top);
                        if (this.oldhscroll) {
                            editor.css('left', -left + parseInt($(element).position().left));
                        }
                        else {
                            editor.css('left', parseInt($(element).position().left));
                        }
                        if (column.pinned) {
                            editor.css('left', left + parseInt($(element).position().left));
                        }

                        if (comboboxeditor == undefined) {
                            editor.prependTo(this.table);
                            editor[0].id = "comboboxeditor" + this.element.id + datafieldname;
                            var isdataadapter = this.source._source ? true : false;
                            var dataadapter = null;
                            if (!isdataadapter) {
                                dataadapter = new $.jqx.dataAdapter(this.source,
                                {
                                    autoBind: false,
                                    uniqueDataFields: [displayfield],
                                    async: false,
                                    autoSort: true,
                                    autoSortField: displayfield
                                });
                            }
                            else {
                                var dataSource =
                                {
                                    localdata: this.source.records,
                                    datatype: this.source.datatype,
                                    async: false
                                }

                                dataadapter = new $.jqx.dataAdapter(dataSource,
                                {
                                    autoBind: false,
                                    async: false,
                                    uniqueDataFields: [displayfield],
                                    autoSort: true,
                                    autoSortField: displayfield
                                });
                            }
                     
                            var autoheight = !column.createeditor ? true: false;
                            editor.jqxComboBox({ enableBrowserBoundsDetection: true, keyboardSelection: false, source: dataadapter, rtl: this.rtl, autoDropDownHeight: autoheight, theme: this.theme, width: $element.width() - 2, height: $element.height() - 2, displayMember: displayfield, valueMember: datafield });
                            editor.removeAttr('tabindex');
                            editor.find('div').removeAttr('tabindex');
                            this.editors["combobox" + "_" + datafieldname] = editor;
                            if (column.createeditor) {
                                column.createeditor(row, cellvalue, editor);
                            }
                        }
                        if (column._requirewidthupdate) {
                            editor.jqxComboBox({ width: $element.width() - 2 });
                        }

                        var dropdownitems = editor.jqxComboBox('listBox').visibleItems;
                        if (!column.createeditor) {
                            if (dropdownitems.length < 8) {
                                editor.jqxComboBox('autoDropDownHeight', true);
                            }
                            else {
                                editor.jqxComboBox('autoDropDownHeight', false);
                            }
                        }

                        var cellvalue = this.getcellvalue(row, displayfield);
                        var selectedIndex = this.findRecordIndex(cellvalue, displayfield, dropdownitems);
                        if (init) {
                            if (cellvalue != "") {
                                editor.jqxComboBox('selectIndex', selectedIndex, true);
                                editor.jqxComboBox('val', cellvalue);
                            }
                            else {
                                editor.jqxComboBox('selectIndex', -1);
                                editor.jqxComboBox('val', cellvalue);
                            }
                        }
                        if (!this.editcell) {
                            return;
                        }

                        if (this.editcell.defaultvalue != undefined) {
                            editor.jqxComboBox('selectIndex', this.editcell.defaultvalue, true);
                        }

                        if (this.editchar && this.editchar.length > 0) {
                            editor.jqxComboBox('input').val(this.editchar);
                        }

                        if (focusable) {
                            setTimeout(function () {
                                focuseditor(editor.jqxComboBox('input'));
                                if (editor) {
                                    editor.jqxComboBox('_setSelection', 0, 0);
                                    if (me.editchar) {
                                        editor.jqxComboBox('_setSelection', 1, 1);
                                        me.editchar = null;
                                    }
                                    else {
                                        if (editor.jqxComboBox('input')) {
                                            var val = editor.jqxComboBox('input').val();
                                            editor.jqxComboBox('_setSelection', 0, val.length);
                                        }
                                    }
                                }
                            }, 10);
                        }
                    }
                    break;
                case "datetimeinput":
                    if (this.host.jqxDateTimeInput) {
                        element.innerHTML = "";
                        var datafieldname = $.trim(column.datafield).split(" ").join("");
                        if (datafieldname.indexOf('.') != -1) {
                            datafieldname = datafieldname.replace('.', "");
                        }

                        var dateeditor = this.editors["datetimeinput" + "_" + datafieldname];
                        editor = dateeditor == undefined ? $("<div style='border-radius: 0px; -moz-border-radius: 0px; -webkit-border-radius: 0px; z-index: 99999; top: 0px; left: 0px; position: absolute;' id='datetimeeditor'></div>") : dateeditor;
                        editor.show();
                        editor.css('top', $(element).parent().position().top);
                        if (this.oldhscroll) {
                            editor.css('left', -left + parseInt($(element).position().left));
                        }
                        else {
                            editor.css('left', parseInt($(element).position().left));
                        }
                        if (column.pinned) {
                            editor.css('left', left + parseInt($(element).position().left));
                        }

                        if (dateeditor == undefined) {
                            editor.prependTo(this.table);
                            editor[0].id = "datetimeeditor" + this.element.id + datafieldname;
                            var localization = { calendar: this.gridlocalization };
                            editor.jqxDateTimeInput({ firstDayOfWeek: this.gridlocalization.firstDay, enableBrowserBoundsDetection: true, localization: localization, _editor: true, theme: this.theme, rtl: this.rtl, width: $element.width(), height: $element.height(), formatString: column.cellsformat });
                            this.editors["datetimeinput" + "_" + datafieldname] = editor;
                            if (column.createeditor) {
                                column.createeditor(row, cellvalue, editor);
                            }
                        }
                        if (column._requirewidthupdate) {
                            editor.jqxDateTimeInput({ width: $element.width() - 2 });
                        }
                        if (init) {
                            if (cellvalue != "" && cellvalue != null) {
                                var date = new Date(cellvalue);
                                if (date == "Invalid Date") {
                                    if (this.source.getvaluebytype) {
                                        date = this.source.getvaluebytype(cellvalue, { name: column.datafield, type: 'date' });
                                    }
                                }

                                editor.jqxDateTimeInput('setDate', date);
                            }
                            else {
                                editor.jqxDateTimeInput('setDate', null);
                            }

                            if (this.editcell.defaultvalue != undefined) {
                                editor.jqxDateTimeInput('setDate', this.editcell.defaultvalue);
                            }
                        }
                    
                        if (focusable) {
                            var e = event;
                            setTimeout(function () {
                                focuseditor(editor.jqxDateTimeInput('dateTimeInput'));
                                setTimeout(function () {
                                    editor.jqxDateTimeInput('_selectGroup', 0);
                                    if (me.editchar && me.editchar.length > 0) {
                                        var digit = parseInt(me.editchar);
                                        if (!isNaN(digit)) {
                                            if (e) {
                                                var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
                                                editor.jqxDateTimeInput('_handleKeyPress', e, key);
                                            }
                                        }
                                    }
                                }, 25);
                            }, 10);
                        }
                    }
                    break;
                case "numberinput":
                    if (this.host.jqxNumberInput) {
                        element.innerHTML = "";
                        var datafieldname = $.trim(column.datafield).split(" ").join("");
                        if (datafieldname.indexOf('.') != -1) {
                            datafieldname = datafieldname.replace('.', "");
                        }
                        var numbereditor = this.editors["numberinput" + "_" + datafieldname];
                        editor = numbereditor == undefined ? $("<div style='border-radius: 0px; -moz-border-radius: 0px; -webkit-border-radius: 0px; z-index: 99999; top: 0px; left: 0px; position: absolute;' id='numbereditor'></div>") : numbereditor;
                        editor.show();
                        editor.css('top', $(element).parent().position().top);
                        if (this.oldhscroll) {
                            editor.css('left', -left + parseInt($(element).position().left));
                        }
                        else {
                            editor.css('left', parseInt($(element).position().left));
                        }
                        if (column.pinned) {
                            editor.css('left', left + parseInt($(element).position().left));
                        }

                        if (numbereditor == undefined) {
                            editor.prependTo(this.table);
                            editor[0].id = "numbereditor" + this.element.id + datafieldname;
                            var symbol = '';
                            var symbolPosition = 'left';
                            var digits = 2;
                            if (column.cellsformat) {
                                if (column.cellsformat.indexOf('c') != -1) {
                                    symbol = this.gridlocalization.currencysymbol;
                                    symbolPosition = this.gridlocalization.currencysymbolposition;
                                    if (symbolPosition == 'before') symbolPosition = 'left';
                                    else symbolPosition = 'right';
                                    if (column.cellsformat.length > 1)
                                    {
                                        digits = parseInt(column.cellsformat.substring(1), 10);
                                    }
                                }
                                else if (column.cellsformat.indexOf('p') != -1) {
                                    symbol = this.gridlocalization.percentsymbol;
                                    symbolPosition = 'right';
                                    if (column.cellsformat.length > 1) {
                                        digits = parseInt(column.cellsformat.substring(1), 10);
                                    }
                                }
                            }
                            else digits = 0;

                            editor.jqxNumberInput({decimalSeparator: this.gridlocalization.decimalseparator, decimalDigits: digits, inputMode: 'simple', theme: this.theme, rtl: this.rtl, width: $element.width() - 1, height: $element.height() - 1, spinButtons: true, symbol: symbol, symbolPosition: symbolPosition });
                            this.editors["numberinput" + "_" + datafieldname] = editor;
                            if (column.createeditor) {
                                column.createeditor(row, cellvalue, editor);
                            }
                        }
                        if (column._requirewidthupdate) {
                            editor.jqxNumberInput({ width: $element.width() - 2 });
                        }
                        if (init) {
                            if (cellvalue != "" && cellvalue != null) {
                                var decimal = cellvalue;
                                editor.jqxNumberInput('setDecimal', decimal);
                            }
                            else {
                                editor.jqxNumberInput('setDecimal', 0);
                            }

                            if (this.editcell.defaultvalue != undefined) {
                                editor.jqxNumberInput('setDecimal', this.editcell.defaultvalue);
                            }

                            if (this.editchar && this.editchar.length > 0) {
                                var digit = parseInt(this.editchar);
                                if (!isNaN(digit)) {
                                    editor.jqxNumberInput('setDecimal', digit);
                                }
                            }

                            if (focusable) {
                                setTimeout(function () {
                                    focuseditor(editor.jqxNumberInput('numberInput'));
                                    editor.jqxNumberInput('_setSelectionStart', 0);
                                    if (me.editchar) {
                                        if (column.cellsformat.length > 0) {
                                            editor.jqxNumberInput('_setSelectionStart', 2);
                                        }
                                        else {
                                            editor.jqxNumberInput('_setSelectionStart', 1);
                                        }
                                        me.editchar = null;
                                    }
                                    else {
                                        var spinbuttons = editor.jqxNumberInput('spinButtons');
                                        if (spinbuttons) {
                                            var val = editor.jqxNumberInput('numberInput').val();
                                            me._setSelection(editor.jqxNumberInput('numberInput')[0], val.length, val.length);
                                        }
                                        else {
                                            var val = editor.jqxNumberInput('numberInput').val();
                                            me._setSelection(editor.jqxNumberInput('numberInput')[0], 0, val.length);
                                        }
                                        editor.jqxNumberInput('selectAll');
                                    }
                                }, 10);
                            }
                        }
                    }
                    break;
                case "custom":
                    element.innerHTML = "";
                    var datafieldname = $.trim(column.datafield).split(" ").join("");
                    if (datafieldname.indexOf('.') != -1) {
                        datafieldname = datafieldname.replace('.', "");
                    }
                    var customeditor = this.editors["customeditor" + "_" + datafieldname + "_" + row];
                    editor = customeditor == undefined ? $("<div style='overflow: hidden; border-radius: 0px; -moz-border-radius: 0px; -webkit-border-radius: 0px; z-index: 99999; top: 0px; left: 0px; position: absolute;' id='customeditor'></div>") : customeditor;
                    editor.show();
                    editor.css('top', $(element).parent().position().top);
                    if (this.oldhscroll) {
                        editor.css('left', -left + parseInt($(element).position().left));
                    }
                    else {
                        editor.css('left', parseInt($(element).position().left));
                    }
                    if (column.pinned) {
                        editor.css('left', left + parseInt($(element).position().left));
                    }

                    if (customeditor == undefined) {
                        editor.prependTo(this.table);
                        editor[0].id = "customeditor" + this.element.id + datafieldname + "_" + row;
                        this.editors["customeditor" + "_" + datafieldname + "_" + row] = editor;
                        var width = $element.width() - 1;
                        var height = $element.height() - 1;
                        editor.width(width);
                        editor.height(height);

                        if (column.createeditor) {
                            column.createeditor(row, cellvalue, editor, celltext, width, height, this.editchar);
                        }
                    }
                    if (column._requirewidthupdate) {
                        editor.width($element.width() - 2);
                    }
                    break;
                case "template":
                    element.innerHTML = "";
                    var datafieldname = $.trim(column.datafield).split(" ").join("");
                    if (datafieldname.indexOf('.') != -1) {
                        datafieldname = datafieldname.replace('.', "");
                    }
                    var templateeditor = this.editors["templateeditor" + "_" + datafieldname];
                    editor = templateeditor == undefined ? $("<div style='overflow: hidden; border-radius: 0px; -moz-border-radius: 0px; -webkit-border-radius: 0px; z-index: 99999; top: 0px; left: 0px; position: absolute;' id='templateeditor'></div>") : templateeditor;
                    editor.show();
                    editor.css('top', $(element).parent().position().top);
                    if (this.oldhscroll) {
                        editor.css('left', -left + parseInt($(element).position().left));
                    }
                    else {
                        editor.css('left', parseInt($(element).position().left));
                    }
                    if (column.pinned) {
                        editor.css('left', left + parseInt($(element).position().left));
                    }

                    if (templateeditor == undefined) {
                        editor.prependTo(this.table);
                        editor[0].id = "templateeditor" + this.element.id + datafieldname;
                        this.editors["templateeditor" + "_" + datafieldname] = editor;
                        var width = $element.width() - 1;
                        var height = $element.height() - 1;
                        editor.width(width);
                        editor.height(height);
                  
                        if (column.createeditor) {
                            column.createeditor(row, cellvalue, editor, celltext, width, height, this.editchar);
                        }
                    }
                    if (column._requirewidthupdate) {
                        editor.width($element.width() - 2);
                    }
                    break;
                case "textbox":
                default:
                    element.innerHTML = "";
                    editor = this.editors["textboxeditor" + "_" + column.datafield] || $("<input autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' type='textbox' id='textboxeditor'/>");
                    editor[0].id = "textboxeditor" + this.element.id + column.datafield;
                    editor.appendTo($element);

                    if (this.rtl) {
                        editor.css('direction', 'rtl');
                    }

                    if (init || editor[0].className == "") {
                        editor.addClass(this.toThemeProperty('jqx-input'));
                        editor.addClass(this.toThemeProperty('jqx-widget-content'));
                        if (this.editchar && this.editchar.length > 0) {
                            editor.val(this.editchar);
                        }
                        else {
                            if (column.cellsformat != "") {
                                cellvalue = this.getcelltext(row, datafield);
                            }
                            if (cellvalue == undefined) {
                                cellvalue = "";
                            }
                            editor.val(cellvalue);
                        }

                        if (this.editcell.defaultvalue != undefined) {
                            editor.val(this.editcell.defaultvalue);
                        }
                        editor.width($element.width()+1);
                        editor.height($element.height()+1);

                        if (column.createeditor) {
                            column.createeditor(row, cellvalue, editor);
                        }

                        if (column.cellsformat != "") {
                            if (column.cellsformat.indexOf('p') != -1 || column.cellsformat.indexOf('c') != -1 || column.cellsformat.indexOf('n') != -1 || column.cellsformat.indexOf('f') != -1) {
                                if (!this.editors["textboxeditor" + "_" + column.datafield]) {
                                    editor.keydown(function (event) {
                                        var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
                                        var letter = String.fromCharCode(key);
                                        var charDigit = parseInt(letter);
                                        if (isNaN(charDigit))
                                            return true;
                                        if (me._selection(editor).length > 0)
                                            return true;
                                       
                                        var val = "";
                                        var cellvalue = editor.val();
                                        if (column.cellsformat.length > 1) {
                                            var decimalOffset = parseInt(column.cellsformat.substring(1));
                                            if (isNaN(decimalOffset)) decimalOffset = 0;
                                        }
                                        else {
                                            var decimalOffset = 0;
                                        }

                                        if (decimalOffset > 0) {
                                            if (cellvalue.indexOf(me.gridlocalization.decimalseparator) != -1) {
                                                if (me._selection(editor).start > cellvalue.indexOf(me.gridlocalization.decimalseparator)) {
                                                    return true;
                                                }
                                            }
                                        }

                                        for (var t = 0; t < cellvalue.length - decimalOffset; t++) {
                                            var ch = cellvalue.substring(t, t + 1);
                                            if (ch.match(/^[0-9]+$/) != null) {
                                                val += ch;
                                            }
                                        }
                                        if (val.length >= 11) {
                                            return false;
                                        }
                                    });
                                }
                            }
                        }
                    }

                    this.editors["textboxeditor" + "_" + column.datafield] = editor;

                    if (init) {
                        if (focusable) {
                            setTimeout(function () {
                                focuseditor(editor);
                                if (me.editchar) {
                                    me._setSelection(editor[0], 1, 1);
                                    me.editchar = null;
                                }
                                else {
                                    me._setSelection(editor[0], 0, editor.val().length);
                                }
                            }, 25);
                        }
                    }
                    break;
            }

            if (editor) {
                editor[0].style.zIndex = 1 + element.style.zIndex;
                if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                    editor[0].style.zIndex = 1+this.columns.records.length + element.style.zIndex;
                }
                editor.css('display', 'block');
                this.editcell.editor = editor;
                if (!this.editcell[datafield]) {
                    this.editcell[datafield] = {};
                    this.editcell[datafield].editor = editor;
                }
                else {
                    this.editcell[datafield].editor = editor;
                }
            }

            if (init) {
                if (column.initeditor) {
                    column.initeditor(row, cellvalue, editor, celltext, this.editchar);
                }
            }

            if (me.isTouchDevice()) {
                return;
            }

            setTimeout(function () {
                if (me.content) {
                    me.content[0].scrollTop = 0;
                    me.content[0].scrollLeft = 0;
                }
                if (me.gridcontent) {
                    me.gridcontent[0].scrollLeft = 0;
                    me.gridcontent[0].scrollTop = 0;
                }
            }, 10);
        },

        _setSelection: function (textbox, start, end) {
            try {
                if ('selectionStart' in textbox) {
                    textbox.setSelectionRange(start, end);
                }
                else {
                    var range = textbox.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', start);
                    range.select();
                }
            }
            catch (error) {
                var err = error;
            }
        },

        _hideeditors: function () {
            if (this.editcells != null) {
                var me = this;
                for (var obj in this.editcells) {
                    me.editcell = me.editcells[obj];
                    me._hidecelleditor();
                }
            }
        },

        _hidecelleditor: function (focus) {
            if (!this.editcell) {
                return;
            }
      
            if (this.editmode === "selectedrow") {
                for (var i = 0; i < this.columns.records.length; i++) {
                    var column = this.columns.records[i];
                    if (this.editcell[column.datafield] && this.editcell[column.datafield].editor) {
                        this.editcell[column.datafield].editor.hide();
                        var editor = this.editcell[column.datafield].editor;
                        switch (column.columntype) {
                            case "dropdownlist":
                                editor.jqxDropDownList({ closeDelay: 0 });
                                editor.jqxDropDownList('hideListBox');
                                editor.jqxDropDownList({ closeDelay: 300 });
                                break;
                            case "combobox":
                                editor.jqxComboBox({ closeDelay: 0 });
                                editor.jqxComboBox('hideListBox');
                                editor.jqxComboBox({ closeDelay: 300 });
                                break;
                            case "datetimeinput":
                                if (editor.jqxDateTimeInput('isOpened')) {
                                    editor.jqxDateTimeInput({ closeDelay: 0 });
                                    editor.jqxDateTimeInput('hideCalendar');
                                    editor.jqxDateTimeInput({ closeDelay: 300 });
                                }
                                break;
                        }
                    }
                }
                if (this.validationpopup) {
                    this.validationpopup.hide();
                    this.validationpopuparrow.hide();
                }
                return;
            }

            if (this.editcell.columntype == 'checkbox') {
                return;
            }

            if (this.editcell.editor) {
                this.editcell.editor.hide();
                switch (this.editcell.columntype) {
                    case "dropdownlist":
                        this.editcell.editor.jqxDropDownList({ closeDelay: 0 });
                        this.editcell.editor.jqxDropDownList('hideListBox');
                        this.editcell.editor.jqxDropDownList({ closeDelay: 300 });
                        break;
                    case "combobox":
                        this.editcell.editor.jqxComboBox({ closeDelay: 0 });
                        this.editcell.editor.jqxComboBox('hideListBox');
                        this.editcell.editor.jqxComboBox({ closeDelay: 300 });
                        break;
                    case "datetimeinput":
                        var datetimeeiditor = this.editcell.editor;
                        if (datetimeeiditor.jqxDateTimeInput('isOpened')) {
                            datetimeeiditor.jqxDateTimeInput({ closeDelay: 0 });
                            datetimeeiditor.jqxDateTimeInput('hideCalendar');
                            datetimeeiditor.jqxDateTimeInput({ closeDelay: 300 });
                        }
                        break;
                }
            }

            if (this.validationpopup) {
                this.validationpopup.hide();
                this.validationpopuparrow.hide();
            }
            if (!this.isNestedGrid) {
                if (focus != false) {
                    this.element.focus();
                }
            }
        },

        _geteditorvalue: function (column) {
            var value = new String();
            if (!this.editcell) {
                return null;
            }

            var editor = this.editcell.editor;
            if (this.editmode == "selectedrow") {
                if (this.editcell[column.datafield]) {
                    var editor = this.editcell[column.datafield].editor;
                }
            }

            if (editor) {
                switch (column.columntype) {
                    case "textbox":
                    default:
                        value = editor.val();
                        if (column.cellsformat != "") {
                            var type = 'string';
                            var datafields = this.source.datafields || ((this.source._source) ? this.source._source.datafields : null);

                            if (datafields) {
                                var foundType = "";
                                $.each(datafields, function () {
                                    if (this.name == column.displayfield) {
                                        if (this.type) {
                                            foundType = this.type;
                                        }
                                        return false;
                                    }
                                });
                                if (foundType)
                                    type = foundType;
                            }

                            var number = type === "number" || type === "float" || type === "int" || type === "integer";
                            var date = type === "date" || type === "time";
                            if (number || (type === "string" && (column.cellsformat.indexOf('p') != -1 || column.cellsformat.indexOf('c') != -1 || column.cellsformat.indexOf('n') != -1 || column.cellsformat.indexOf('f') != -1))) {
                                if (value === "" && column.nullable)
                                    return "";

                                if (value.indexOf(this.gridlocalization.currencysymbol) > -1) {
                                    // remove currency symbol
                                    value = value.replace(this.gridlocalization.currencysymbol, "");
                                }
                               
                                var replaceAll = function(text, stringToFind, stringToReplace) {
                                    var temp = text;
                                    if (stringToFind == stringToReplace) return text;

                                    var index = temp.indexOf(stringToFind);
                                    while (index != -1) {
                                        temp = temp.replace(stringToFind, stringToReplace);
                                        index = temp.indexOf(stringToFind)
                                    }
                              
                                    return temp;
                                }

                                var tmp = value;
                                tmp = new Number(tmp);
                                if (!isNaN(tmp)) {
                                    return tmp;
                                }

                                value = replaceAll(value, this.gridlocalization.thousandsseparator, "");
                                value = value.replace(this.gridlocalization.decimalseparator, ".");

                                if (value.indexOf(this.gridlocalization.percentsymbol) > -1) {
                                    value = value.replace(this.gridlocalization.percentsymbol, "");
                                }

                                var val = "";
                                for (var t = 0; t < value.length; t++) {
                                    var ch = value.substring(t, t + 1);
                                    if (ch === "-") val += "-";
                                    if (ch === ".") val += ".";
                                    if (ch.match(/^[0-9]+$/) != null) {
                                        val += ch;
                                    }
                                }

                                value = val;
                                value = value.replace(/ /g, "");

                                value = new Number(value);
                                if (isNaN(value))
                                    value = "";
                            }
                            if (date || (type === "string" && (column.cellsformat.indexOf('H') != -1 || column.cellsformat.indexOf('m') != -1 || column.cellsformat.indexOf('M') != -1 || column.cellsformat.indexOf('y') != -1
                                || column.cellsformat.indexOf('h') != -1 || column.cellsformat.indexOf('d') != -1))) {
                                if (value === "" && column.nullable)
                                    return "";

                                var tmpValue = value;
                                if ($.jqx.dataFormat) {
                                    value = $.jqx.dataFormat.tryparsedate(tmpValue, this.gridlocalization);
                                }
                                if (value == "Invalid Date" || value == null) {
                                    value = "";
                                }
                            }

                        }
                        if (column.displayfield != column.datafield) {
                            value = { label: value, value: value };
                        }
                        break;
                    case "checkbox":
                        if (editor.jqxCheckBox) {
                            value = editor.jqxCheckBox('checked');
                        }
                        break;
                    case "datetimeinput":
                        if (editor.jqxDateTimeInput) {
                            editor.jqxDateTimeInput({ isEditing: false });
                            editor.jqxDateTimeInput('_validateValue');
                            value = editor.jqxDateTimeInput('getDate');
                            if (value == null) return null;
                            value = new Date(value.toString());
                            if (column.displayfield != column.datafield) {
                                value = { label: value, value: value };
                            }
                        }
                        break;
                    case "dropdownlist":
                        if (editor.jqxDropDownList) {
                            var selectedIndex = editor.jqxDropDownList('selectedIndex');
                            var item = editor.jqxDropDownList('listBox').getVisibleItem(selectedIndex);
                            if (column.displayfield != column.datafield) {
                                if (item) {
                                    value = { label: item.label, value: item.value };
                                }
                                else value = "";
                            }
                            else {
                                if (item) value = item.label;
                                else value = "";
                            }

                            if (value == null) {
                                value = "";
                            }
                        }
                        break;
                    case "combobox":
                        if (editor.jqxComboBox) {
                            value = editor.jqxComboBox('val');
                            if (column.displayfield != column.datafield) {
                                var item = editor.jqxComboBox('getSelectedItem');
                                if (item != null) {
                                    value = { label: item.label, value: item.value };
                                }
                            }

                            if (value == null) {
                                value = "";
                            }
                        }
                        break;
                    case "numberinput":
                        if (editor.jqxNumberInput) {
                            if (this.touchdevice) {
                                editor.jqxNumberInput('_doTouchHandling');
                            }
                            var decimal = editor.jqxNumberInput('getDecimal');
                            value = new Number(decimal);
                            value = parseFloat(value);
                            if (isNaN(value)) {
                                value = 0;
                            }
                            if (decimal === null)
                            {
                                value = null;
                            }

                            if (column.displayfield != column.datafield) {
                                value = { label: value, value: value };
                            }
                        }
                        break;
                }
                if (column.geteditorvalue) {
                    if (this.editmode == "selectedrow") {
                        value = column.geteditorvalue(this.editcell.row, this.getcellvalue(this.editcell.row, column.datafield), editor);
                    }
                    else {
                        value = column.geteditorvalue(this.editcell.row, this.editcell.value, editor);
                    }
                }
            }
            return value;
        },

        hidevalidationpopups: function () {
            if (this.popups) {
                $.each(this.popups, function () {
                    this.validation.remove();
                    this.validationrow.remove();
                });
                this.popups = new Array();
            }
            if (this.validationpopup) {
                this.validationpopuparrow.hide();
                this.validationpopup.hide();
            }
        },


        showvalidationpopup: function (row, datafield, message) {
            if (message == undefined) {
                var message = this.gridlocalization.validationstring;
            }

            var validationpopup = $("<div style='z-index: 99999; top: 0px; left: 0px; position: absolute;'></div>");
            var validationpopuparrow = $("<div style='width: 20px; height: 20px; z-index: 999999; top: 0px; left: 0px; position: absolute;'></div>");
            validationpopup.html(message);
            validationpopuparrow.addClass(this.toThemeProperty('jqx-grid-validation-arrow-up'));
            validationpopup.addClass(this.toThemeProperty('jqx-grid-validation'));
            validationpopup.addClass(this.toThemeProperty('jqx-rc-all'));
            validationpopup.prependTo(this.table);
            validationpopuparrow.prependTo(this.table);

            var hScrollInstance = this.hScrollInstance;
            var horizontalscrollvalue = hScrollInstance.value;
            var left = parseInt(horizontalscrollvalue);
            var element = this.getcolumn(datafield).uielement;
            var info = null;
            for (var i = 0; i < this.hittestinfo.length; i++) {
                if (row === this.hittestinfo[i].row.visibleindex) {
                    info = this.hittestinfo[i];
                }
            }
            if (!info) {
                this.ensurerowvisible(row);
                var me = this;
                validationpopup.remove();
                validationpopuparrow.remove();
                setTimeout(function () {
                    var info = null;
                    for (var i = 0; i < me.hittestinfo.length; i++) {
                        if (row === me.hittestinfo[i].row.visibleindex) {
                            info = me.hittestinfo[i];
                        }
                    }
                    if (info) {
                        me.showvalidationpopup(row, datafield, message);
                    }
                }, 25);
                return;
            }
            var rowElement = $(info.visualrow);
            validationpopup.css('top', parseInt(rowElement.position().top) + 30 + 'px');

            var topposition = parseInt(validationpopup.css('top'));

            validationpopuparrow.css('top', topposition - 12);
            validationpopuparrow.removeClass();
            validationpopuparrow.addClass(this.toThemeProperty('jqx-grid-validation-arrow-up'));

            var negativePosition = false;
            if (topposition >= this._gettableheight()) {
                validationpopuparrow.removeClass(this.toThemeProperty('jqx-grid-validation-arrow-up'));
                validationpopuparrow.addClass(this.toThemeProperty('jqx-grid-validation-arrow-down'));
                topposition = parseInt(rowElement.position().top) - this.rowsheight - 5;
                if (topposition < 0) {
                    topposition = 0;
                    this.validationpopuparrow.removeClass(this.toThemeProperty('jqx-grid-validation-arrow-down'));
                    negativePosition = true;
                }
                validationpopup.css('top', topposition + 'px');
                validationpopuparrow.css('top', topposition + validationpopup.outerHeight() - 9);
            }
            var leftposition = -left + parseInt($(element).position().left);

            validationpopuparrow.css('left', left + leftposition + 30);

            var width = validationpopup.width();
            if (width + leftposition > this.host.width() - 20) {
                var offset = width + leftposition - this.host.width() + 40;
                leftposition -= offset;
            }

            if (!negativePosition) {
                validationpopup.css('left', left + leftposition);
            } else {
                validationpopup.css('left', left + parseInt($(element).position().left) - validationpopup.outerWidth());
            }

            validationpopup.show();
            validationpopuparrow.show();
            if (!this.popups) {
                this.popups = new Array();
            }
            this.popups[this.popups.length] = { validation: validationpopup, validationrow: validationpopuparrow };
        },

        _showvalidationpopup: function (row, datafield, message) {
            var editcell = this.editcell;
            var editor = this.editcell.editor;
            if (this.editmode == "selectedrow") {
                var editcell = this.editcell[datafield];
                if (editcell && editcell.editor) {
                    editor = editcell.editor;
                    editcell.element = editor;
                }
            }

            if (!editor)
                return;

            if (this.validationpopup && $.jqx.isHidden(this.validationpopup)) {
                if (this.validationpopup.remove) {
                    this.validationpopup.remove();
                    this.validationpopuparrow.remove();
                }
                this.validationpopup = null;
                this.validationpopuparrow = null;
                if (datafield === undefined && message === undefined && this.editors && this.editors.length === 0) {
                    return;
                }
            }

            if (!this.validationpopup) {
                var validationpopup = $("<div style='z-index: 99999; top: 0px; left: 0px; position: absolute;'></div>");
                var validationpopuparrow = $("<div style='width: 20px; height: 20px; z-index: 999999; top: 0px; left: 0px; position: absolute;'></div>");
                validationpopup.html(message);
                validationpopuparrow.addClass(this.toThemeProperty('jqx-grid-validation-arrow-up'));
                validationpopup.addClass(this.toThemeProperty('jqx-grid-validation'));
                validationpopup.addClass(this.toThemeProperty('jqx-rc-all'));
                validationpopup.prependTo(this.table);
                validationpopuparrow.prependTo(this.table);
                this.validationpopup = validationpopup;
                this.validationpopuparrow = validationpopuparrow;
            }
            else {
                this.validationpopup.html(message);
            }

            var hScrollInstance = this.hScrollInstance;
            var horizontalscrollvalue = hScrollInstance.value;
            var left = parseInt(horizontalscrollvalue);

            if (this.editmode == "selectedrow") {
                if (this.visiblerows && this.visiblerows[this.editcell.visiblerowindex]) {
                    this.validationpopup.css('top', this.visiblerows[this.editcell.visiblerowindex].top + (this.rowsheight + 5) + 'px');
                }
                else {
                    this.validationpopup.css('top', parseInt($(editcell.editor).position().top) + (this.rowsheight + 5) + 'px');
                }
            }
            else {
                this.validationpopup.css('top', parseInt($(editcell.element).parent().position().top) + (this.rowsheight + 5) + 'px');
            }

            var topposition = parseInt(this.validationpopup.css('top'));

            this.validationpopuparrow.css('top', topposition - 11);
            this.validationpopuparrow.removeClass();
            this.validationpopuparrow.addClass(this.toThemeProperty('jqx-grid-validation-arrow-up'));
            var height = this._gettableheight();

            var negativePosition = false;
            if (topposition >= height) {
                this.validationpopuparrow.removeClass(this.toThemeProperty('jqx-grid-validation-arrow-up'));
                this.validationpopuparrow.addClass(this.toThemeProperty('jqx-grid-validation-arrow-down'));
                topposition = parseInt($(editcell.element).parent().position().top) - this.rowsheight - 5;
                if (this.editmode == "selectedrow") {
                    if (this.visiblerows && this.visiblerows[this.editcell.visiblerowindex]) {
                        topposition = this.visiblerows[this.editcell.visiblerowindex].top - this.rowsheight - 5;
                    }
                    else {
                        topposition = parseInt($(editcell.editor).position().top) - this.rowsheight - 5;
                    }
                }
                if (topposition < 0) {
                    topposition = 0;
                    this.validationpopuparrow.removeClass(this.toThemeProperty('jqx-grid-validation-arrow-down'));
                    negativePosition = true;
                }

                this.validationpopup.css('top', topposition + 'px');
                this.validationpopuparrow.css('top', topposition + this.validationpopup.outerHeight() - 9);
            }
            var leftposition = -left + parseInt($(editcell.element).position().left);

            this.validationpopuparrow.css('left', left + leftposition + 30);

            var width = this.validationpopup.width();
            if (width + leftposition > this.host.width() - 20) {
                var offset = width + leftposition - this.host.width() + 40;
                leftposition -= offset;
            }

            if (!negativePosition) {
                this.validationpopup.css('left', left + leftposition);
            }
            else {
                this.validationpopup.css('left', left + parseInt($(editcell.element).position().left) - this.validationpopup.outerWidth());
            }

            if (this.editcell.editor.css('display') == "none") {
                this.validationpopup.hide();
                this.validationpopuparrow.hide();
            }
            else {
                this.validationpopup.show();
                this.validationpopuparrow.show();
            }
        }
    });
})(jqxBaseFramework);



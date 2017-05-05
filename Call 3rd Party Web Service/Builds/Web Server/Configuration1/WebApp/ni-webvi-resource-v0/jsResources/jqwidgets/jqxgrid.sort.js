/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($) {
    $.jqx.dataview.sort = function () {
        this.sortby = function (field, ascending, comparer) {
            var tmpToString = Object.prototype.toString;
            if (ascending == null) {
                this.sortdata = null;
                this.sortcache = {};
                this.grid._pagescache = new Array();
                this.grid._cellscache = new Array();
                this.refresh();
                return;
            }

            if (ascending == undefined) {
                ascending = true;
            }

            if (ascending == 'a' || ascending == 'asc' || ascending == 'ascending' || ascending == true) {
                ascending = true;
            }
            else {
                ascending = false;
            }

            var lookupkey = field;
            this.sortfield = field;
            this.sortfielddirection = ascending ? "asc" : "desc";

            if (this.sortcache == undefined) {
                this.sortcache = {};
            }

            this.sortdata = [];
            var _sortdata = [];
            var sorted = false;
            if (lookupkey == 'constructor') lookupkey = "";

            if (!this.virtualmode && this.sortcache[lookupkey] != null) {
                var cache = this.sortcache[lookupkey];
                _sortdata = cache._sortdata;

                if (cache.direction == ascending) {
                    _sortdata.reverse();
                }
                else {
                    if (!cache.direction && ascending) {
                        _sortdata.reverse();
                    }

                    sorted = true;
                }

                if (_sortdata.length < this.totalrecords) {
                    this.sortcache = {};
                    sorted = false;
                    _sortdata = [];
                }
            }

            Object.prototype.toString = (typeof field == "function") ? field : function () { return this[field] };
            var records = this.records;

            var me = this.that;

            var datatype = '';

            if (this.source.datafields) {
                $.each(this.source.datafields, function () {
                    if (this.name == field) {
                        if (this.type) {
                            datatype = this.type;
                        }
                        return false;
                    }
                });
            }

            if (_sortdata.length == 0) {
                if (records.length) {
                    var length = records.length;
                    // tries to loop through the records with for loop for better performance.
                    for (var i = 0; i < length; i++) {
                        var record = records[i];
                        if (record != null) {
                            var recordvalue = record;
                            var sortkey = recordvalue.toString();
                            _sortdata.push({ sortkey: sortkey, value: recordvalue, index: i });
                        }
                    }
                }
                else {
                    var caniterate = false;
                    // tries to loop through the records with for..in for better performance.
                    for (obj in records) {
                        var record = records[obj];
                        if (record == undefined) {
                            caniterate = true;
                            break;
                        }

                        var recordvalue = record;
                        _sortdata.push({ sortkey: recordvalue.toString(), value: recordvalue, index: obj });
                    }

                    if (caniterate) {
                        $.each(records, function (i, value) {
                            _sortdata.push({ sortkey: value.toString(), value: value, index: i });
                        });
                    }
                }
            }

            if (!sorted) {
                if (comparer == null) {
                    this._sortcolumntype = datatype;
                    var that = this;
                    _sortdata.sort(function (value1, value2) {
                        return that._compare(value1, value2, datatype);
                    });
                }
                else {
                    _sortdata.sort(comparer);
                }
            }

            if (!ascending) {
                _sortdata.reverse();
            }

            Object.prototype.toString = tmpToString;
            this.sortdata = _sortdata;

            this.sortcache[lookupkey] = { _sortdata: _sortdata, direction: ascending };
            this.reload(this.records, this.rows, this.filters, this.updated, true);
        },

        this.clearsortdata = function () {
            this.sortcache = {};
            this.sortdata = null;
        }

        this._compare = function (value1, value2, type) {
            var value1 = value1.sortkey;
            var value2 = value2.sortkey;
            if (value1 === undefined) { value1 = null; }
            if (value2 === undefined) { value2 = null; }
            if (value1 === null && value2 === null) {
                return 0;
            }
            if (value1 === null && value2 !== null) {
                return -1;
            }
            if (value1 !== null && value2 === null) {
                return 1;
            }

            if ($.jqx.dataFormat) {
                if (type && type != "") {
                    switch (type) {
                        case "number":
                        case "int":
                        case "float":
                            if (value1 < value2) { return -1; }
                            if (value1 > value2) { return 1; }
                            return 0;
                        case "date":
                        case "time":
                            if (value1 < value2) { return -1; }
                            if (value1 > value2) { return 1; }
                            return 0;
                        case "string":
                        case "text":
                            value1 = String(value1).toLowerCase();
                            value2 = String(value2).toLowerCase();
                            break;
                    }
                }
                else {
                    if ($.jqx.dataFormat.isNumber(value1) && $.jqx.dataFormat.isNumber(value2)) {
                        if (value1 < value2) { return -1; }
                        if (value1 > value2) { return 1; }
                        return 0;
                    }
                    else if ($.jqx.dataFormat.isDate(value1) && $.jqx.dataFormat.isDate(value2)) {
                        if (value1 < value2) { return -1; }
                        if (value1 > value2) { return 1; }
                        return 0;
                    }
                    else if (!$.jqx.dataFormat.isNumber(value1) && !$.jqx.dataFormat.isNumber(value2)) {
                        value1 = String(value1).toLowerCase();
                        value2 = String(value2).toLowerCase();
                    }
                }
            }
            try {
                if (value1 < value2) { return -1; }
                if (value1 > value2) { return 1; }
            }
            catch (error) {
                var er = error;
            }

            return 0;
        };

        this._equals = function (value1, value2) {
            return (this._compare(value1, value2) === 0);
        };
    }

    $.extend($.jqx._jqxGrid.prototype, {
        //[optimize]
        _rendersortcolumn: function () {
            var self = this.that;
            var sortcolumn = this.getsortcolumn();

            if (this.sortdirection) {
                var ariaFunc = function (column, direction) {
                    var sortc = self.getcolumn(column);
                    if (sortc) {
                        if (direction.ascending) {
                            $.jqx.aria(sortc.element, "aria-sort", "ascending");
                        }
                        else if (direction.descending) {
                            $.jqx.aria(sortc.element, "aria-sort", "descending");
                        } else {
                            $.jqx.aria(sortc.element, "aria-sort", "none");
                        }
                    }
                }
                if (this._oldsortinfo) {
                    if (this._oldsortinfo.column) {
                        ariaFunc(this._oldsortinfo.column, { ascending: false, descending: false });
                    }
                }
                ariaFunc(sortcolumn, this.sortdirection);

            }
            this._oldsortinfo = { column: sortcolumn, direction: this.sortdirection };

            if (this.sortdirection) {
                $.each(this.columns.records, function (i, value) {
                    var groupingsortelements = $.data(document.body, "groupsortelements" + this.displayfield);

                    if (sortcolumn == null || this.displayfield != sortcolumn) {
                        $(this.sortasc).hide();
                        $(this.sortdesc).hide();

                        if (groupingsortelements != null) {
                            groupingsortelements.sortasc.hide();
                            groupingsortelements.sortdesc.hide();
                        }
                    }
                    else {
                        if (self.sortdirection.ascending) {
                            $(this.sortasc).show();
                            $(this.sortdesc).hide();
                            if (groupingsortelements != null) {
                                groupingsortelements.sortasc.show();
                                groupingsortelements.sortdesc.hide();
                            }
                        }
                        else {
                            $(this.sortasc).hide();
                            $(this.sortdesc).show();
                            if (groupingsortelements != null) {
                                groupingsortelements.sortasc.hide();
                                groupingsortelements.sortdesc.show();
                            }
                        }
                    }
                });
            }
        },

        // gets the sort column.
        getsortcolumn: function () {
            if (this.sortcolumn != undefined) {
                return this.sortcolumn;
            }

            return null;
        },
        // removes the sorting.
        removesort: function () {
            this.sortby(null);
        },

        // sorts by a column.
        sortby: function (datafield, sortdirection, comparer, refresh, checkloading) {
            if (this._loading && checkloading !== false) {
                throw new Error('jqxGrid: ' + this.loadingerrormessage);
                return false;
            }

            // clear the sorting.
            if (datafield == null) {
                sortdirection = null;
                datafield = this.sortcolumn;
            }

            if (datafield != undefined) {
                var self = this.that;
                if (comparer == undefined && self.source.sortcomparer != null) {
                    comparer = self.source.sortcomparer;
                }

                if (sortdirection == 'a' || sortdirection == 'asc' || sortdirection == 'ascending' || sortdirection == true) {
                    ascending = true;
                }
                else {
                    ascending = false;
                }

                //var columnbydatafield = self.getcolumn(datafield);
                //if (columnbydatafield == undefined || columnbydatafield == null)
                //    return;

                if (sortdirection != null) {
                    self.sortdirection = { 'ascending': ascending, 'descending': !ascending };
                }
                else {
                    self.sortdirection = { 'ascending': false, 'descending': false };
                }

                if (sortdirection != null) {
                    self.sortcolumn = datafield;
                }
                else {
                    self.sortcolumn = null;
                }

                if (self.source.sort || self.virtualmode) {
                    self.dataview.sortfield = datafield;
                    if (sortdirection == null) {
                        self.dataview.sortfielddirection = "";
                    }
                    else {
                        self.dataview.sortfielddirection = ascending ? "asc" : "desc";
                    }
                    if (self.source.sort && !this._loading) {
                        self.source.sort(datafield, sortdirection);
                        self._raiseEvent(6, { sortinformation: self.getsortinformation() });
                        return;
                    }
                }
                else {
                    self.dataview.sortby(datafield, sortdirection, comparer);
                }

                if (refresh === false) {
                    return;
                }

                // if grouping is enabled, we need to refresh the groups too.
                if (self.groupable && self.groups.length > 0) {
                    self._render(true, false, false);
                    if (self._updategroupheadersbounds && self.showgroupsheader) {
                        self._updategroupheadersbounds();
                    }
                    self._postrender("sort");
                }
                else {
                    if (self.pageable) {
                        self.dataview.updateview();
                    }
                    self._updaterowsproperties();
                    self.rendergridcontent(true);
                    self._postrender("sort");
                }
                self._raiseEvent(6, { sortinformation: self.getsortinformation() });
            }
        },

        _togglesort: function (column) {
            var self = this.that;
            if (this.disabled) {
                return;
            }

            if (column.sortable && self.sortable) {
                var sortinformation = self.getsortinformation();
                var checked = null;
                if (sortinformation.sortcolumn != null && sortinformation.sortcolumn == column.displayfield) {
                    checked = sortinformation.sortdirection.ascending;
                    if (self.sorttogglestates > 1) {
                        if (checked == true) {
                            checked = false;
                        }
                        else {
                            checked = null;
                        }
                    }
                    else {
                        checked = !checked;
                    }
                }
                else {
                    checked = true;
                }

                self.sortby(column.displayfield, checked, null);
            }
        }
    });
})(jqxBaseFramework);



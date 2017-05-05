/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($) {
    $.jqx.dataview.grouping = function () {
        this.loadgrouprecords = function (startvisibleindex, startindex, endindex, filter, currentPageIndex, updated, rows, rl, diff) {
            var visualRows = startvisibleindex;
            var self = this;
            var groupHashCodes = new Array();
            for (var iGroupColumn = 0; iGroupColumn < self.groups.length; iGroupColumn++) {
                groupHashCodes[iGroupColumn] = self.generatekey();
            }
            var grouprecords = new Array();
            var grouprecordsindex = 0;
            var groupHashCodes = groupHashCodes;
            var hashRowGroups = new Array();

            var i = startindex;
            var currentRowIndex = startindex;
            var groupslength = self.groups.length;
            this.loadedrecords = new Array();

            this.bounditems = new Array();
            this.loadedrecords = new Array(); // all data records ready for rendering.
            this.loadedrootgroups = new Array(); // all groups ready for rendering
            this.loadedgroups = new Array(); // all groups ready for rendering
            this.loadedgroupsByKey = new Array(); // all groups ready for rendering
            this.sortedgroups = new Array();

            var hassortdata = this.sortdata != null;
            var data = hassortdata ? this.sortdata : this.records;
            if (this.pageable)
            {
                var items = new Array();
                var index = 0;
                if (!data[startindex])
                {
                    $.each(data, function (index, value)
                    {
                        items[startindex + index++] = this;
                    });
                    data = items;
                }
            }

            if (this.virtualmode) {
                var items = new Array();
                var index = 0;
                for (var i = 0; i < endindex - startindex; i++) {
                    if (data[i]) {
                        items[startindex + index++] = data[i];
                    }
                    else if (data[startindex + index]) {
                        items[startindex + index] = data[startindex + index];
                        index++;
                    }
                }
                i = 0;
                data = items;
            }

            for (var obj = startindex; obj < endindex; obj++) {
                var item = {};

                if (!hassortdata) {
                    item = $.extend({}, data[obj]);
                }
                else {
                    item = $.extend({}, data[obj].value);
                }

                id = item[self.uniqueId];


                if (currentPageIndex >= rl || id != rows[currentPageIndex][self.uniqueId] || (updated && updated[id]))
                    diff[diff.length] = currentPageIndex;

                var itemKeysHierarchy = new Array();
                var keys = 0;
                for (var iGroupColumn = 0; iGroupColumn < groupslength; iGroupColumn++) {
                    var group = self.groups[iGroupColumn];
                    var value = item[group];
                    if (value == null) value = "";
                    itemKeysHierarchy[keys++] = { value: value, hash: groupHashCodes[iGroupColumn] };
                }

                if (itemKeysHierarchy.length != groupslength)
                    break;

                var parentItem = null;

                var lookupKey = "";
                var iLevel = -1;

                for (var q = 0; q < itemKeysHierarchy.length; q++) {
                    iLevel++;
                    var itemKey = itemKeysHierarchy[q].value;
                    var columnHash = itemKeysHierarchy[q].hash;
                    lookupKey = lookupKey + "_" + columnHash + "_" + itemKey;

                    if (hashRowGroups[lookupKey] != undefined && hashRowGroups[lookupKey] != null) {
                        parentItem = hashRowGroups[lookupKey];
                        continue;
                    }

                    if (parentItem == null) {
                        parentItem = { group: itemKey, subItems: new Array(), subGroups: new Array(), level: 0 };
                        grouprecords[grouprecordsindex++] = parentItem;
                        parentItem.uniqueid = self.generatekey();
                        self.loadedgroupsByKey[itemKey] = parentItem;
                    }
                    else {
                        var subItem = { group: itemKey, subItems: new Array(), subGroups: new Array(), parentItem: parentItem, level: parentItem.level + 1 };
                        self.loadedgroupsByKey[parentItem.uniqueid + '_' + itemKey] = subItem;
                        subItem.uniqueid = self.generatekey();
                        parentItem.subGroups[parentItem.subGroups.length++] = subItem;
                        parentItem = subItem;
                    }

                    hashRowGroups[lookupKey] = parentItem;
                }

                if (parentItem != null) {
                    if (undefined == item.uid) {
                        item.uid = this.getid(this.source.id, item, i);
                    }

                    if (!hassortdata) {
                        item.boundindex = i;
                        this.recordsbyid["id" + item.uid] = data[obj];
                    }
                    else {
                        item.boundindex = data[obj].index;
                        this.recordsbyid["id" + item.uid] = data[obj].value;
                    }

                    this.bounditems[item.boundindex] = item;
                    this.sortedgroups[i] = item;
                    item.uniqueid = self.generatekey();
                    item.parentItem = parentItem;
                    item.level = parentItem.level + 1;

                    parentItem.subItems[parentItem.subItems.length++] = item;
                }
                else {
                    if (undefined == item.uid) {
                        item.uid = this.getid(this.source.id, item, i);
                    }

                    if (!hassortdata) {
                        item.boundindex = i;
                        this.recordsbyid["id" + item.uid] = data[obj];
                    }
                    else {
                        item.boundindex = data[obj].index;
                        this.recordsbyid["id" + item.uid] = data[obj].value;
                    }

                    this.sortedgroups[i] = item;
                    this.bounditems[item.boundindex] = item;
                    item.uniqueid = self.generatekey();
                }

                currentPageIndex++;

                i++;
                currentRowIndex++;
            };

            var loopitems = function (self, group, visualRows) {
                for (var m = 0; m < group.subItems.length; m++) {
                    group.subItems[m].visibleindex = startvisibleindex + visualRows;
                    self.rows[visualRows] = group.subItems[m];
                    self.loadedrecords[visualRows] = group.subItems[m];
                    visualRows++;
                }
                return visualRows
            }

            var loopGroups = function (self, group, visualRows) {
                var totalRows = 1;
                var columns = self.grid.columns.records ? self.grid.columns.records : self.grid.columns;
                if (self.aggregates == true) {
                    for (var i = 0; i < columns.length; i++) {
                        if (columns[i].aggregates) {
                            totalRows = Math.max(totalRows, columns[i].aggregates.length);
                        }
                    }
                }

                var totals = function (group) {
                    if (self.aggregates == true) {
                        var addTotalRows = function (j) {
                            var olditem = group;

                            var item = {};
                            var addTotalValue = function (subItems) {
                                for (var m = 0; m < columns.length; m++) {
                                    if (columns[m].aggregates) {

                                        var obj = self.grid.getcolumnaggregateddata(columns[m].datafield, columns[m].aggregates, true, subItems);

                                        for (var i = 0; i < columns[m].aggregates.length; i++) {
                                            if (columns[m].aggregates[j]) {
                                                var column = columns[m];
                                                var aggregate = columns[m].aggregates[j];
                                                var name = aggregate;
                                                name = self.grid._getaggregatename(name);
                                                var field = name + ':' + obj[aggregate];

                                                item[column.datafield] = field;
                                            }
                                        }
                                    }
                                }
                            }

                            if (olditem != null) {
                                item.level = olditem.level;
                                item.visibleindex = startvisibleindex + visualRows;
                                item.uniqueid = self.generatekey();
                                self.rows[visualRows] = item;
                                self.loadedrecords[visualRows++] = item;
                                item.totalsrow = true;

                                if (group.subItems.length > 0) {
                                    olditem = group.subItems[group.subItems.length - 1];
                                    item.parentItem = olditem.parentItem;
                                    if (item.parentItem.subItems) {
                                        item.parentItem.subItems[item.parentItem.subItems.length] = item;
                                    }

                                    var subItems = [];
                                    var getSubItems = function () {
                                        for (var q = 0; q < group.subItems.length; q++) {
                                            if (group.subItems[q].totalsrow) {
                                                continue;
                                            }
                                            subItems[subItems.length] = group.subItems[q];
                                        }
                                    }
                                    getSubItems(group);
                                    addTotalValue(subItems);   
                                }
                                else if (group.subGroups.length > 0) {
                                    olditem = group.subGroups[group.subGroups.length - 1];
                                    item.level = olditem.level;
                                    item.parentItem = group;
                                    group.subGroups[group.subGroups.length] = item;
                                    var subItems = [];
                                    var getSubItems = function (group) {
                                        if (group.totalsrow)
                                            return;

                                        for (var q = 0; q < group.subItems.length; q++) {
                                            if (group.subItems[q].totalsrow) {
                                                continue;
                                            }
                                            subItems[subItems.length] = group.subItems[q];
                                        }
                                        for (var q = 0; q < group.subGroups.length; q++) {
                                            getSubItems(group.subGroups[q]);
                                        }
                                    }
                                    getSubItems(group);
                                    addTotalValue(subItems);
                                }
                            }
                        }
                        for (var j = 0; j < totalRows; j++) {
                            addTotalRows(j);
                        }
                    }
                }
                for (subGroup in group.subGroups) {
                    var currentGroup = group.subGroups[subGroup];
                    if (currentGroup.subGroups) {
                        self.loadedgroups[self.loadedgroups.length] = currentGroup;
                        currentGroup.visibleindex = startvisibleindex + visualRows;
                        self.rows[visualRows] = currentGroup;
                        self.loadedrecords[visualRows] = currentGroup;
                        visualRows++;
                        if (currentGroup.subGroups.length > 0) {
                            visualRows = loopGroups(self, currentGroup, visualRows);
                        }
                        else if (currentGroup.subItems.length > 0) {
                            visualRows = loopitems(self, currentGroup, visualRows);
                        }
                        totals(currentGroup);
                    }
                }
                if (group.subItems.length > 0) {
                    visualRows = loopitems(self, group, visualRows);
                }
                totals(group);
                return visualRows;
            }

            var grouprecordslength = grouprecords.length;
            this.loadedgroups = new Array();
            this.rows = new Array();
            var visualRows = 0;

            for (var i = 0; i < grouprecordslength; i++) {
                var group = grouprecords[i];
                this.loadedrootgroups[i] = group;
                this.loadedgroups[this.loadedgroups.length] = group;
                group.visibleindex = startvisibleindex + visualRows;
                this.rows[visualRows] = group;
                this.loadedrecords[visualRows] = group;
                visualRows++;
                visualRows = loopGroups(this, group, visualRows);
            }


            return visualRows;
        }


        this._updategroupsinpage = function (self, filter, currentRowIndex, currentPageIndex, rl, start, end) {
            // create rows.
            var rows = new Array();

            var diff = [];
            if (this.groupable && this.groups.length > 0) {
                var visualrows = 0;
                var hashRowGroups = new Array();
                var groupHashCodes = new Array();
                for (var iGroupColumn = 0; iGroupColumn < self.groups.length; iGroupColumn++) {
                    groupHashCodes[iGroupColumn] = self.generatekey();
                }
                var i = 0;
                var grouprecords = new Array();
                var grouprecordsindex = 0;
                if (end > this.totalrecords) {
                    end = this.totalrecords;
                }
           
                for (var obj = start; obj < end; obj++) {
                    var item = $.extend({}, self.sortedgroups[obj]);
                    id = item[self.uniqueId];

                    if (!self.pagesize || (currentRowIndex >= self.pagesize * self.pagenum && currentRowIndex < self.pagesize * (self.pagenum + 1))) {
                        if (currentPageIndex >= rl || id != rows[currentPageIndex][self.uniqueId] || (updated && updated[id]))
                            diff[diff.length] = currentPageIndex;

                        var itemKeysHierarchy = new Array();
                        var keys = 0;
                        for (var iGroupColumn = 0; iGroupColumn < self.groups.length; iGroupColumn++) {
                            var group = self.groups[iGroupColumn];
                            var value = item[group];

                            if (null == value)
                                value = "";

                            itemKeysHierarchy[keys++] = { value: value, hash: groupHashCodes[iGroupColumn] };
                        }

                        if (itemKeysHierarchy.length != self.groups.length)
                            break;

                        var parentItem = null;

                        var lookupKey = "";
                        var iLevel = -1;

                        for (var q = 0; q < itemKeysHierarchy.length; q++) {
                            iLevel++;
                            var itemKey = itemKeysHierarchy[q].value;
                            var columnHash = itemKeysHierarchy[q].hash;
                            lookupKey = lookupKey + "_" + columnHash + "_" + itemKey;

                            if (hashRowGroups[lookupKey] != undefined && hashRowGroups[lookupKey] != null) {
                                parentItem = hashRowGroups[lookupKey];
                                continue;
                            }

                            if (parentItem == null) {
                                parentItem = { group: itemKey, subItems: new Array(), subGroups: new Array(), level: 0 };
                                grouprecords[grouprecordsindex++] = parentItem;
                                var initialgroup = self.loadedgroupsByKey[itemKey];
                                if (initialgroup != undefined) {
                                    parentItem.visibleindex = initialgroup.visibleindex;
                                    parentItem.uniqueid = initialgroup.uniqueid;
                                }
                            }
                            else {
                                var subItem = { group: itemKey, subItems: new Array(), subGroups: new Array(), parentItem: parentItem, level: parentItem.level + 1 };
                                var initialgroup = self.loadedgroupsByKey[parentItem.uniqueid + '_' + itemKey];
                                subItem.visibleindex = initialgroup.visibleindex;
                                subItem.uniqueid = initialgroup.uniqueid;
                                parentItem.subGroups[parentItem.subGroups.length++] = subItem;
                                parentItem = subItem;
                            }

                            hashRowGroups[lookupKey] = parentItem;
                        }

                        if (parentItem != null) {
                            item.parentItem = parentItem;
                            item.level = parentItem.level + 1;
                            parentItem.subItems[parentItem.subItems.length++] = item;
                        }

                        currentPageIndex++;
                    }
                    i++;
                    currentRowIndex++;
                };

                var loopitems = function (self, group, visualrows) {
                    for (var m = 0; m < group.subItems.length; m++) {
                        rows[visualrows] = $.extend({}, group.subItems[m]);
                        visualrows++;
                    }
                    return visualrows;
                }

                var anysubitems = function (group) {
                    var hasitems = false;

                    for (subGroup in group.subGroups) {
                        var currentGroup = group.subGroups[subGroup];
                        if (currentGroup.subGroups) {
                            if (currentGroup.subGroups.length > 0) {
                                var result = anysubitems(currentGroup);
                                if (result) {
                                    hasitems = true;
                                    return true;
                                }
                            }
                            if (currentGroup.subItems.length > 0) {
                                hasitems = true;
                                return true;
                            }
                        }
                    }
                    if (group.subItems.length > 0) {
                        hasitems = true;
                        return true;
                    }
                    return hasitems;
                }

                var loopGroups = function (self, group, visualrows) {
                    var totalRows = 1;
                    var columns = self.grid.columns.records ? self.grid.columns.records : self.grid.columns;
                    if (self.aggregates == true) {
                        for (var i = 0; i < columns.length; i++) {
                            if (columns[i].aggregates) {
                                totalRows = Math.max(totalRows, columns[i].aggregates.length);
                            }
                        }
                    }
                    var totals = function (group) {
                        if (self.aggregates == true) {
                            var addTotalRows = function (j) {
                                var olditem = group;
                                var item = {};
                                var addTotalValue = function (subItems) {
                                  for (var m = 0; m < columns.length; m++) {
                                        if (columns[m].aggregates) {

                                            var obj = self.grid.getcolumnaggregateddata(columns[m].datafield, columns[m].aggregates, true, subItems);

                                            for (var i = 0; i < columns[m].aggregates.length; i++) {
                                                if (columns[m].aggregates[j]) {
                                                    var column = columns[m];
                                                    var aggregate = columns[m].aggregates[j];
                                                    var name = aggregate;
                                                    name = self.grid._getaggregatename(name);
                                                    var field = name + ':' + obj[aggregate];

                                                    item[column.datafield] = field;
                                                }
                                            }
                                        }
                                    }
                                }

                                if (olditem != null) {
                                    item.level = olditem.level;
                                    item.visibleindex = visualrows;
                                    item.uniqueid = self.generatekey();
                                    rows[visualrows] = item;
                                    self.loadedrecords[visualrows++] = item;
                                    item.totalsrow = true;

                                    if (group.subItems.length > 0) {
                                        olditem = group.subItems[group.subItems.length - 1];
                                        item.parentItem = olditem.parentItem;
                                        if (item.parentItem.subItems) {
                                            item.parentItem.subItems[item.parentItem.subItems.length] = item;
                                        }

                                        var subItems = [];
                                        var getSubItems = function () {
                                            for (var q = 0; q < group.subItems.length; q++) {
                                                if (group.subItems[q].totalsrow) {
                                                    continue;
                                                }
                                                subItems[subItems.length] = group.subItems[q];
                                            }
                                        }
                                        getSubItems(group);
                                        addTotalValue(subItems);
                                    }
                                    else if (group.subGroups.length > 0) {
                                        olditem = group.subGroups[group.subGroups.length - 1];
                                        item.level = olditem.level;
                                        item.parentItem = group;
                                        group.subGroups[group.subGroups.length] = item;
                                        var subItems = [];
                                        var getSubItems = function (group) {
                                            if (group.totalsrow)
                                                return;

                                            for (var q = 0; q < group.subItems.length; q++) {
                                                if (group.subItems[q].totalsrow) {
                                                    continue;
                                                }
                                                subItems[subItems.length] = group.subItems[q];
                                            }
                                            for (var q = 0; q < group.subGroups.length; q++) {
                                                getSubItems(group.subGroups[q]);
                                            }
                                        }
                                        getSubItems(group);
                                        addTotalValue(subItems);
                                    }
                                }
                            }
                            for (var j = 0; j < totalRows; j++) {
                                addTotalRows(j);
                            }
                        }
                    }

                    for (subGroup in group.subGroups) {
                        var currentGroup = group.subGroups[subGroup];

                        if (currentGroup.subGroups) {
                            if (anysubitems(currentGroup)) {
                                rows[visualrows] = currentGroup;
                                visualrows++;
                                if (currentGroup.subGroups.length > 0) {
                                    visualrows = loopGroups(self, currentGroup, visualrows);
                                }
                                else if (currentGroup.subItems.length > 0) {
                                    visualrows = loopitems(self, currentGroup, visualrows);
                                }
                                totals(currentGroup);
                            }
                        }
                    }
                    if (group.subItems.length > 0) {
                        visualrows = loopitems(self, group, visualrows);
                    }
                    totals(group);
                    return visualrows;
                }

                var parentgroup = 0;
                for (var i = 0; i < grouprecords.length; i++) {
                    var group = grouprecords[i];

                    if (anysubitems(group)) {
                        rows[visualrows] = group;
                        visualrows++;
                        visualrows = loopGroups(this, group, visualrows);
                    }
                }
            }

            return rows;
        }
    }

    $.extend($.jqx._jqxGrid.prototype, {
        _initgroupsheader: function () {
            this.groupsheader.css('visibility', 'hidden');
            if (this._groupsheader()) {
                this.groupsheader.css('visibility', 'inherit');
                var me = this;
                var groupsheaderstring = this.gridlocalization.groupsheaderstring;
                this.groupsheaderdiv = this.groupsheaderdiv || $('<div style="width: 100%; position: relative;"></div>');
                this.groupsheaderdiv.height(this.groupsheaderheight);
                this.groupsheaderdiv.css('top', 0);
                this.groupsheader.append(this.groupsheaderdiv);
                this.groupheadersbounds = new Array();

                var groupslength = this.groups.length;

                // remove handlers and children.
                this.groupsheaderdiv.children().remove();
                this.groupsheaderdiv[0].innerHTML = '';

                var groups = new Array();
                if (groupslength > 0) {
                    $.each(this.groups, function (index) {
                        var groupcolumn = this;
                        var groupcolumninfo = me._getColumnText(this);
                        var text = groupcolumninfo.label;
                        var group = me._rendergroupcolumn(text, groupcolumn);
                        group.addClass(me.toThemeProperty('jqx-grid-group-column'));
                        me.groupsheaderdiv.append(group);
                        if (me.closeablegroups) {
                            var closebutton = $(group.find('.jqx-icon-close'));
                            if (me.isTouchDevice() && me.touchmode !== true) {
                                me.addHandler(closebutton, 'touchstart', function () {
                                    me.removegroupat(index);
                                    return false;
                                });
                            }
                            else {
                                me.addHandler(closebutton, 'click', function () {
                                    me.removegroupat(index);
                                    return false;
                                });
                            } 
                        }
                        if (me.sortable) {
                            me.addHandler(group, 'click', function () {
                                var columnitem = me.getcolumn(groupcolumn);
                                if (columnitem != null) {
                                    me._togglesort(columnitem);
                                }
                                return false;
                            });
                        }
                        groups[groups.length] = group;
                        me._handlegroupstocolumnsdragdrop(this, group);
                        if (index < groupslength - 1) {
                            var height = group.height();
                            var line = $('<div style="float: left; position: relative;"></div>');
                            if (me.rtl) {
                                line.css('float', 'right');
                            }

                            line.width(me.groupindentwidth / 3);
                            line.height(1);
                            line.css('top', height / 2);
                            line.addClass(me.toThemeProperty('jqx-grid-group-column-line'));
                            me.groupsheaderdiv.append(line);
                        }
                    });
                }
                else {
                    var emptygroupselement = $('<div style="position: relative;">' + groupsheaderstring + '</div>');
                    this.groupsheaderdiv.append(emptygroupselement);
                    if (this.rtl) {
                        emptygroupselement.addClass(this.toThemeProperty('jqx-rtl'));
                    }
                }

                this._groupheaders = groups;
                this._updategroupheadersbounds();
            }
        },

        _updategroupheadersbounds: function () {
            var me = this;
            var headerdivheight = this.groupsheaderdiv.children().outerHeight();
            var top = (this.groupsheader.height() - headerdivheight) / 2;
            this.groupsheaderdiv.css('top', top);
            if (!this.rtl) {
                this.groupsheaderdiv.css('left', top);
                this.groupsheaderdiv.css('right', '');
            }
            else {
                this.groupsheaderdiv.css('left', '');
                this.groupsheaderdiv.css('right', top);
            }

            if (this.rtl) this._groupheaders.reverse();
            $.each(this._groupheaders, function (index) {
                var groupoffset = this.coord();
                me.groupheadersbounds[index] = { left: groupoffset.left, top: groupoffset.top, width: this.outerWidth(), height: this.outerHeight(), index: index };
            });

        },

        // adds a group.
        addgroup: function (datafield) {
            if (datafield) {
                var self = this;
                if (self.groups !== self.dataview.groups) {
                    self.dataview.groups = self.groups;
                }
                self.groups[self.groups.length] = datafield;
                self.refreshgroups();
                this._raiseEvent(12, { type: "Add", index: self.groups[self.groups.length], groups: self.groups });
            }
        },

        // inserts a new group.
        insertgroup: function (index, datafield) {
            if (index != undefined && index != null && index >= 0 && index <= this.groups.length) {
                if (datafield) {
                    var self = this;
                    if (self.groups !== self.dataview.groups) {
                        self.dataview.groups = self.groups;
                    }
                    self.groups.splice(index, 0, datafield.toString());
                    self.refreshgroups();
                    this._raiseEvent(12, { type: "Insert", index: index, groups: self.groups });
                }
            }
        },

        refreshgroups: function () {
            this._refreshdataview();
            this._render(true, true, true, false);
            this._postrender('group');
        },

        _insertaftergroup: function (groupfield, datafield) {
            var index = this._getGroupIndexByDataField(groupfield);
            this.insertgroup(index + 1, datafield);
        },

        _insertbeforegroup: function (groupfield, datafield) {
            var index = this._getGroupIndexByDataField(groupfield);
            this.insertgroup(index, datafield);
        },

        // removes a group by index.
        removegroupat: function (index) {
            if (index >= 0 && index != null && index != undefined) {
                var self = this;
                if (self.groups !== self.dataview.groups) {
                    self.dataview.groups = self.groups;
                }
                self.groups.splice(index, 1);
                self.refreshgroups();
                if (self.virtualmode) {
                    self.updatebounddata();
                }
                this._raiseEvent(12, { type: "Remove", index: index, groups: self.groups });
                return true;
            }
            return false;
        },

        cleargroups: function () {
            var self = this;
            self.groups = [];
            self.dataview.groups = self.groups;
            self.refreshgroups();
            this._raiseEvent(12, { type: "Clear", index: -1, groups: self.groups });
            return true;
        },

        // removes a group by datafield
        removegroup: function (datafield) {
            if (datafield == null)
                return false;

            var index = this.groups.indexOf(datafield.toString());
            return this.removegroupat(index);
        },


        // gets the number of root groups.
        getrootgroupscount: function () {
            var count = this.dataview.loadedrootgroups.length;
            return count;
        },

        // collapses a group.
        collapsegroup: function (index) {
            if (index >= 0 && index.toString().indexOf(".") === -1) {
                return this._setrootgroupstate(index, false);
            }
            var groupsToExpand = index.toString().split('.');
            var group = null;
            if (!this.groupsVisibility) {
                this.groupsVisibility = new Array();
            }
            for (var i = 0; i < groupsToExpand.length; i++) {
                var index = parseInt(groupsToExpand[i]);
                if (i == 0) {
                    var group = this.dataview.loadedrootgroups[index];
                    this.groupsVisibility[group.group] = null;
                }
                else {
                    var subGroup = group.subGroups[index];
                    if (subGroup) {
                        group = subGroup;
                        if (i == groupsToExpand.length - 1) {
                            this._setgroupstate(group, false, true);
                            this.groupsVisibility[group.group] = null;
                        }
                    }
                }
            }
        },

        // expands a group.
        expandgroup: function (index) {
            if (index >= 0 && index.toString().indexOf(".") === -1) {
                return this._setrootgroupstate(index, true);
            }

            var groupsToExpand = index.toString().split('.');
            var group = null;
            for (var i = 0; i < groupsToExpand.length; i++) {
                var index = parseInt(groupsToExpand[i]);
                if (i == 0) {
                    var group = this.dataview.loadedrootgroups[index];
                    this._setrootgroupstate(index, true);
                    if (!this.groupsVisibility) {
                        this.groupsVisibility = new Array();
                    }
                    this.groupsVisibility[group.group] = group;
                }
                else {
                    var subGroup = group.subGroups[index];
                    if (subGroup) {
                        group = subGroup;
                        this._setgroupstate(group, true, true);
                        if (!this.groupsVisibility) {
                            this.groupsVisibility = new Array();
                        }
                        this.groupsVisibility[group.group] = group;
                    }
                }
            }
        },

        // collapses all groups.
        collapseallgroups: function (refresh) {
            this._setbatchgroupstate(false, refresh);
        },

        // expands all groups.
        expandallgroups: function (refresh) {
            this._setbatchgroupstate(true, refresh);
        },

        isgroupexpanded: function(index)
        {
            var group = this.dataview.loadedrootgroups[index];
            if (group == null)
                return null;

            var expanded = this.expandedgroups[group.uniqueid].expanded;
            return expanded;
        },

        // gets a group by index.
        getgroup: function (index) {
            var group = this.dataview.loadedrootgroups[index];
            if (group == null)
                return null;

            var expanded = this.expandedgroups[group.uniqueid].expanded;
            var groupname = group.group;
            var level = group.level;

            var subgroups = new Array();
            this._getsubgroups(subgroups, group);
            var me = this;
            var obj = { group: groupname, level: level, expanded: expanded, subgroups: subgroups };
            if (group.subItems) {
                var items = new Array();
                $.each(group.subItems, function () {
                    var index = this.boundindex;
                    items[items.length] = me.getrowdata(index);
                });
                if (items.length > 0) {
                    obj.subrows = items;
                }
            }

            return obj;
        },

        getrootgroups: function () {
            var count = this.dataview.loadedrootgroups.length;
            var groups = new Array();
            for (var m = 0; m < count; m++) {
                groups[m] = this.getgroup(m);
            }
            return groups;
        },
    
        _getsubgroups: function (subgroups, group) {
            var me = this;
            for (obj in group.subGroups) {
                var subGroup = group.subGroups[obj];
                var expanded = me.expandedgroups[subGroup.uniqueid].expanded;
                var groupname = subGroup.group;
                var level = subGroup.level;
                subgroups[subgroups.length] = { group: groupname, level: level, expanded: expanded };
                if (subGroup.subItems) {
                    var items = new Array();
                    $.each(subGroup.subItems, function () {
                        var index = this.boundindex;
                        items[items.length] = me.getrowdata(index);
                    });
                    subgroups[subgroups.length - 1].subrows = items;
                }
                if (subGroup.subGroups) {
                    var childsubgroups = new Array();
                    me._getsubgroups(childsubgroups, subGroup);
                }
            }

            return subgroups;
        },

        _setbatchgroupstate: function (expanded, update) {
            var me = this;
            for (obj in this.dataview.loadedrootgroups) {
                me._setrootgroupstate(obj, expanded, false, true);
            }

            if (update == false) {
                me._requiresupdate = true;
                me._renderrows(me.virtualsizeinfo);
                return true;
            }

            var scrollBarVisibility = this.vScrollBar[0].style.visibility;
            this.rendergridcontent(true, false);
            if (scrollBarVisibility != this.vScrollBar[0].style.visibility || this._hiddencolumns) {
                this._updatecolumnwidths();
                this._updatecellwidths();
                this._renderrows(this.virtualsizeinfo);
            }

            return true;
        },

        _setrootgroupstate: function (index, expanded, refresh, applytosubgroups) {
            if (index == undefined || index == null || index < 0)
                return false;

            if (!this.groupable || this.groups.length == 0)
                return false;

            var update = refresh != undefined ? refresh : true;

            if (index >= 0 && index < this.dataview.loadedrootgroups.length) {
                var group = this.dataview.loadedrootgroups[index];
                if (this.pageable) {
                    var rootgroups = new Array();
                    for (var i = 0; i < this.dataview.rows.length; i++) {
                        if (this.dataview.rows[i].group != null && this.dataview.rows[i].level === 0) {
                            rootgroups.push(this.dataview.rows[i]);
                        }
                    }

                    group = rootgroups[index];
                    if (!group) {
                        return;
                    }
                }

                return this._setgroupstate(group, expanded, update, applytosubgroups);
            }

            return false;
        },

        _togglegroupstate: function (group, update) {
            if (group == null || group == undefined)
                return false;

            var scrollPosition = this.vScrollInstance.value;
            var groupstate = this.expandedgroups[group.uniqueid];
            if (groupstate == undefined) {
                groupstate = false;
            }
            else {
                groupstate = groupstate.expanded;
            }
            groupstate = !groupstate;
            if (!this.groupsVisibility) {
                this.groupsVisibility = new Array();
            }
            if (groupstate) {
                this.groupsVisibility[group.group] = group;
            }
            else {
                this.groupsVisibility[group.group] = null;
            }
            var result = this._setgroupstate(group, groupstate, update);
            this._newmax = null;
            if (scrollPosition !== 0 && this.vScrollBar.css('visibility') !== 'hidden') {
                if (scrollPosition <= this.vScrollInstance.max) {
                    this.vScrollInstance.setPosition(scrollPosition);
                }
                else {
                    this.vScrollInstance.setPosition(this.vScrollInstance.max);
                }
            } return result;
        },

        _setgroupstate: function (group, expanded, update, applytosubgroups) {
            if (group == null || group == undefined)
                return false;

            var isDirty = false;
                
            if (this.editable && this.editcell) {
                this.endcelledit(this.editcell.row, this.editcell.column, false, false);
            }

            var groupstate = this.expandedgroups[group.uniqueid];
            if (groupstate == undefined) {
                groupstate = { expanded: false };
                isDirty = true;
            }

            if (groupstate.expanded != expanded) {
                isDirty = true;
            }

            if (isDirty) {
                this.expandedgroups[group.uniqueid] = { expanded: expanded, group: group };

                this._setsubgroupsvisibility(this, group, !expanded, applytosubgroups);
                if (update) {
                    var scrollBarVisibility = this.vScrollBar[0].style.visibility;
                    this.rendergridcontent(true, false);
                    if (scrollBarVisibility != this.vScrollBar[0].style.visibility || this._hiddencolumns) {
                        this._updatecolumnwidths();
                        this._updatecellwidths();
                        this._renderrows(this.virtualsizeinfo);
                    }
                }

                if (undefined == this.suspendgroupevents || this.suspendgroupevents == false) {
                    if (expanded) {
                        this._raiseEvent(4, { group: group.group, parentgroup: group.parentItem ? group.parentItem.group : null, level: group.level, visibleindex: group.visibleindex });
                    }
                    else {
                        this._raiseEvent(5, { group: group.group, parentgroup: group.parentItem ? group.parentItem.group : null, level: group.level, visibleindex: group.visibleindex });
                    }
                }

                return true;
            }

            return false;
        },

        _setgroupitemsvisibility: function (self, group, hidden) {
            for (var m = 0; m < group.subItems.length; m++) {
                self._setrowvisibility(group.subItems[m].visibleindex, hidden, false);
            }
        }, 
        
        _setsubgroupsvisibility: function (self, group, hidden, applytosubgroups) {
            if (group.parentItem != null) {
                if (this.hiddens[group.parentItem.visibleindex])
                    return;
            }
            else if (group.parentItem == null) {
                if (this.hiddens[group.visibleindex])
                    return;
            }

            for (subGroup in group.subGroups) {
                var currentGroup = group.subGroups[subGroup];

                if (!hidden) {
                    self._setrowvisibility(currentGroup.visibleindex, hidden, false);
                }

                var expanded = !hidden;

                if (!applytosubgroups) {
                    if (self.expandedgroups[currentGroup.uniqueid] == undefined) {
                        expanded = false;
                    }
                    else {
                        expanded = self.expandedgroups[currentGroup.uniqueid].expanded;
                    }
                }
                else {
                    this.expandedgroups[currentGroup.uniqueid] = { expanded: expanded, group: currentGroup };
                }

                if (currentGroup.subGroups) {
                    if (currentGroup.subGroups.length > 0) {
                        self._setsubgroupsvisibility(self, currentGroup, !expanded || hidden, applytosubgroups);
                    }
                    else if (currentGroup.subItems.length > 0) {
                        self._setgroupitemsvisibility(self, currentGroup, !expanded || hidden);
                    }
                }

                if (hidden) {
                    self._setrowvisibility(currentGroup.visibleindex, hidden, false);
                }
            }
            if (group.subItems && group.subItems.length > 0) {
                self._setgroupitemsvisibility(self, group, hidden);
            }
        },


        
        _handlecolumnsdragdrop: function () {
            var self = this;
            var dropindex = -1;
            var candrop = false;

            if (!self.groupable)
                return;

            var mousemove = 'mousemove.grouping' + this.element.id;
            var mousedown = 'mousedown.grouping' + this.element.id;
            var mouseup = 'mouseup.grouping' + this.element.id;

            var touchdevice = false;
            if (this.isTouchDevice() && this.touchmode !== true) {
                touchdevice = true;
                mousemove = $.jqx.mobile.getTouchEventName('touchmove') + '.grouping' + this.element.id;
                mousedown = $.jqx.mobile.getTouchEventName('touchstart') + '.grouping' + this.element.id;
                mouseup = $.jqx.mobile.getTouchEventName('touchend') + '.grouping' + this.element.id;
            }

            this.removeHandler($(document), mousemove);
            this.addHandler($(document), mousemove, function (event) {
                if (!self.showgroupsheader)
                    return true;

                if (self.dragcolumn != null) {
                    var left = parseInt(event.pageX);
                    var top = parseInt(event.pageY);
                    if (touchdevice) {
                        var touches = self.getTouches(event);
                        var touch = touches[0];
                        left = parseInt(touch.pageX);
                        top = parseInt(touch.pageY);
                    }
                    var hostoffset = self.host.coord();
                    var hostleft = parseInt(hostoffset.left);
                    var hosttop = parseInt(hostoffset.top);
                    if (self.dragmousedownoffset == undefined || self.dragmousedownoffset == null) {
                        self.dragmousedownoffset = { left: 0, top: 0 };
                    }

                    var leftposition = parseInt(left) - parseInt(self.dragmousedownoffset.left);
                    var topposition = parseInt(top) - parseInt(self.dragmousedownoffset.top);

                    self.dragcolumn.css({ left: leftposition + 'px', top: topposition + 'px' });
                    candrop = false;
                    if (left >= hostleft && left <= hostleft + self.host.width()) {
                        if (top >= hosttop && top <= hosttop + self.host.height()) {
                            candrop = true;
                        }
                    }
                    dropindex = -1;
                    if (candrop) {
                        self.dragcolumnicon.removeClass(self.toThemeProperty('jqx-grid-dragcancel-icon'));
                        self.dragcolumnicon.addClass(self.toThemeProperty('jqx-grid-drag-icon'));
                        var groupsheaderoffset = self.groupsheader.coord();
                        var groupsheaderbottom = groupsheaderoffset.top + self.groupsheader.height();
                        var datarecord = $.data(self.dragcolumn[0], 'datarecord');
                        if (datarecord) {
                            var indexingroups = self.groups.indexOf(datarecord.toString());
                        }
                        else {
                            var indexingroups = -1;
                        }

                        var candrag = (indexingroups == -1) || (self.groups.length > 1 && indexingroups > -1);

                        if (self.dropline != null) {
                            if (top >= groupsheaderoffset.top && top <= groupsheaderbottom) {
                                if (candrag) {
                                    dropindex = self._handlegroupdroplines(left);
                                }
                            }
                            else {
                                self.dropline.fadeOut('slow');
                            }
                        }
                    }
                    else {
                        if (self.dropline != null) {
                            self.dropline.fadeOut('slow');
                        }

                        self.dragcolumnicon.removeClass(self.toThemeProperty('jqx-grid-drag-icon'));
                        self.dragcolumnicon.addClass(self.toThemeProperty('jqx-grid-dragcancel-icon'));
                    }
                    if (touchdevice) {
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    }
                    //   return false;
                }
            });

            this.removeHandler($(document), mouseup);
            this.addHandler($(document), mouseup, function (event) {
                if (!self.showgroupsheader)
                    return true;

                self.__drag = false;

                $(document.body).removeClass('jqx-disableselect');
                var left = parseInt(event.pageX);
                var top = parseInt(event.pageY);
                if (touchdevice) {
                    var touches = self.getTouches(event);
                    var touch = touches[0];
                    left = parseInt(touch.pageX);
                    top = parseInt(touch.pageY);
                }
                var hostoffset = self.host.coord();
                var hostleft = parseInt(hostoffset.left);
                var hosttop = parseInt(hostoffset.top);
                var groupsheaderheight = self.groupsheader.height();
                if (self.showtoolbar) {
                    hosttop += self.toolbarheight;
                }

                self.dragstarted = false;
                self.dragmousedown = null;
                if (self.dragcolumn != null) {
                    var datafield = $.data(self.dragcolumn[0], 'datarecord');
                    self.dragcolumn.remove();
                    self.dragcolumn = null;

                    if (datafield != null) {
                        if (!self.getcolumn(datafield).groupable) {
                            if (self.dropline != null) {
                                self.dropline.remove();
                                self.dropline = null;
                            }
                            return;
                        }

                        if (candrop) {
                            if (dropindex != -1) {
                                var index = dropindex.index;
                                var targetgroup = self.groups[index];
                            
                                var indexInGroups = self._getGroupIndexByDataField(datafield);
                                if (indexInGroups != index) {
                                    if (indexInGroups != undefined && indexInGroups >= 0) {
                                        self.groups.splice(indexInGroups, 1);
                                    }

                                    if (dropindex.position == 'before') {
                                        if (!self.rtl) {
                                            self._insertbeforegroup(targetgroup, datafield);
                                        }
                                        else {
                                            self._insertaftergroup(targetgroup, datafield);
                                        }
                                    }
                                    else {
                                        if (!self.rtl) {
                                            self._insertaftergroup(targetgroup, datafield);
                                        }
                                        else {
                                            self._insertbeforegroup(targetgroup, datafield);
                                        }
                                    }
                                }
                            }
                            else if (self.groups.length == 0) {
                                if (top > hosttop && top <= hosttop + groupsheaderheight) {
                                    self.addgroup(datafield);
                                }
                            }
                            else if (top > hosttop + groupsheaderheight) {
                                var indexInGroups = self._getGroupIndexByDataField(datafield);
                                self.removegroupat(indexInGroups);
                            }
                        }

                        if (self.dropline != null) {
                            self.dropline.remove();
                            self.dropline = null;
                        }
                    }
                    //  return false;
                }
            });
        },

        _getGroupIndexByDataField: function (datafield) {
            for (var i = 0; i < this.groups.length; i++) {
                if (this.groups[i] == datafield)
                    return i;
            }
            return -1;
        },

        _isColumnInGroups: function (column) {
            for (var i = 0; i < this.groups.length; i++) {
                if (this.groups[i] == column)
                    return true;
            }
            return false;
        },

        
        _handlegroupdroplines: function (left) {
            var self = this;
            var dropindex = -1;

            $.each(self.groupheadersbounds, function (index) {
                if (left <= this.left + this.width / 2) {
                    var groupleft = this.left - 3;
                    if (index > 0) {
                        groupleft = this.left - 1 - self.groupindentwidth / 6;
                    }

                    self.dropline.css('left', groupleft);
                    self.dropline.css('top', this.top);
                    self.dropline.height(this.height);
                    self.dropline.fadeIn('slow');
                    
                    dropindex = { index: index, position: 'before' };
                    if (self.rtl) {
                        dropindex = { index: self.groupheadersbounds.length - 1 - index, position: 'before' };                      
                    }

                    return false;
                }
                else if (left >= this.left + this.width / 2) {
                    self.dropline.css('left', 1 + this.left + this.width);
                    self.dropline.css('top', this.top);
                    self.dropline.height(this.height);
                    self.dropline.fadeIn('slow');
                    dropindex = { index: index, position: 'after' };
                    if (self.rtl) {
                        dropindex = { index: self.groupheadersbounds.length - 1 - index, position: 'after' };
                    }
                }
            });

            return dropindex;
        },

        
        _handlegroupstocolumnsdragdrop: function (datafield, column) {
            this.dragmousedown = null;
            this.dragmousedownoffset = null;
            this.dragstarted = false;
            this.dragcolumn = null;
            var me = this;
            var mousemove;

            var mousedownevent = 'mousedown';
            var mousemoveevent = 'mousemove';

            var touchdevice = false;
            if (this.isTouchDevice() && this.touchmode !== true) {
                touchdevice = true;
                mousedownevent = $.jqx.mobile.getTouchEventName('touchstart');
                mousemoveevent = $.jqx.mobile.getTouchEventName('touchmove');
            }
            this.addHandler(column, 'dragstart', function (event) {
                return false;
            });

            this.addHandler(column, mousedownevent, function (event) {
                if (!me.showgroupsheader)
                    return true;

                var left = event.pageX;
                var top = event.pageY;

                me.__drag = true;
                me.dragmousedown = { left: left, top: top };
                if (touchdevice) {
                    var touches = me.getTouches(event);
                    var touch = touches[0];
                    left = touch.pageX;
                    top = touch.pageY;
                    me.dragmousedown = { left: left, top: top };
                    if (event.preventDefault) {
                        event.preventDefault();
                    }
                }

                var offsetposition = $(event.target).coord();
                me.dragmousedownoffset = { left: parseInt(left) - parseInt(offsetposition.left), top: parseInt(top - offsetposition.top) };
            });

            this.addHandler(column, mousemoveevent, function (event) {
                if (!me.showgroupsheader)
                    return true;

                if (me.dragmousedown) {
                    mousemove = { left: event.pageX, top: event.pageY };
                    if (touchdevice) {
                        var touches = me.getTouches(event);
                        var touch = touches[0];
                        mousemove = { left: touch.pageX, top: touch.pageY };
                    }
                    if (!me.dragstarted && me.dragcolumn == null) {
                        var xoffset = Math.abs(mousemove.left - me.dragmousedown.left);
                        var yoffset = Math.abs(mousemove.top - me.dragmousedown.top);
                        if (xoffset > 3 || yoffset > 3) {
                            me._createdragcolumn(column, mousemove, true);
                            $(document.body).addClass('jqx-disableselect');
                            $.data(me.dragcolumn[0], 'datarecord', datafield);
                            if (event.preventDefault) {
                                event.preventDefault();
                            }
                        }
                    }
                }
            });
        },

        
        _createdragcolumn: function (column, position, hasdropline) {
            var me = this;
            var mousemove = position;

            me.dragcolumn = $('<div></div>');
            var columnclone = column.clone();
            me.dragcolumn.css('z-index', 999999);
            columnclone.css('border-width', '1px');
            columnclone.css('opacity', '0.4');
            var menubutton = $(columnclone.find('.' + me.toThemeProperty('jqx-grid-column-menubutton')));
            if (menubutton.length > 0) {
                menubutton.css('display', 'none');
            }
            var closebutton = $(columnclone.find('.jqx-icon-close'));
            if (closebutton.length > 0) {
                closebutton.css('display', 'none');
            }

            me.dragcolumnicon = $('<div style="z-index: 9999; position: absolute; left: 100%; top: 50%; margin-left: -18px; margin-top: -7px;"></div>');
            me.dragcolumnicon.addClass(me.toThemeProperty('jqx-grid-drag-icon'));
            me.dragcolumn.css('float', 'left');

            me.dragcolumn.css('position', 'absolute');
            var hostoffset = me.host.coord();
            columnclone.width(column.width() + 16);
            me.dragcolumn.append(columnclone);
            me.dragcolumn.height(column.height());
            me.dragcolumn.width(columnclone.width());
            me.dragcolumn.append(me.dragcolumnicon);
            $(document.body).append(me.dragcolumn);

            columnclone.css('margin-left', 0);
            columnclone.css('left', 0);
            columnclone.css('top', 0);
            me.dragcolumn.css('left', mousemove.left + me.dragmousedown.left);
            me.dragcolumn.css('top', mousemove.top + me.dragmousedown.top);

            if (hasdropline != undefined && hasdropline) {
                me.dropline = $('<div style="display: none; position: absolute;"></div>');

                me.dropline.width(2);
                me.dropline.addClass(me.toThemeProperty('jqx-grid-group-drag-line'));
                $(document.body).append(me.dropline);
            }
        },

        // gets column's groupable.
        iscolumngroupable: function (datafield) {
            return this._getcolumnproperty(datafield, 'groupable');
        },

        
        _handlecolumnstogroupsdragdrop: function (record, column) {
            this.dragmousedown = null;
            this.dragmousedownoffset = null;
            this.dragstarted = false;
            this.dragcolumn = null;

            var me = this;
            var mousemove;
            var touchdevice = false;
            if (this.isTouchDevice() && this.touchmode !== true) {
                touchdevice = true;
            }

            var mousedown = 'mousedown.drag';
            var mousemove = 'mousemove.drag';
            if (touchdevice) {
                mousedown = $.jqx.mobile.getTouchEventName('touchstart') + '.drag';
                mousemove = $.jqx.mobile.getTouchEventName('touchmove') + '.drag';
            }
            else {
                this.addHandler(column, 'dragstart', function (event) {
                    return false;
                });
            }

            this.addHandler(column, mousedown, function (event) {
                if (!me.showgroupsheader)
                    return true;

                me.__drag = true;

                if (me._isColumnInGroups(record.displayfield)) {
                    if (column.css('cursor') != 'col-resize') {
                        return true;
                    }
                    else return true;
                }
                if (false == record.groupable) {
                    return true;
                }

                var pagex = event.pageX;
                var pagey = event.pageY;
                if (touchdevice) {
                    var touches = me.getTouches(event);
                    var touch = touches[0];
                    pagex = touch.pageX;
                    pagey = touch.pageY;
                }

                me.dragmousedown = { left: pagex, top: pagey };
                if (touchdevice) {
                    if (event.preventDefault) event.preventDefault();
                }

                var offsetposition = $(event.target).coord();
                me.dragmousedownoffset = { left: parseInt(pagex) - parseInt(offsetposition.left), top: parseInt(pagey - offsetposition.top) };
            });

            this.addHandler(column, mousemove, function (event) {
                if (!me.showgroupsheader)
                    return true;

                if (me._isColumnInGroups(record.displayfield))
                    if (column.css('cursor') != 'col-resize') {
                        return true;
                    }
                    else {
                        return true;
                    }

                if (me.dragmousedown) {
                    var pagex = event.pageX;
                    var pagey = event.pageY;
                    if (touchdevice) {
                        var touches = me.getTouches(event);
                        var touch = touches[0];
                        pagex = touch.pageX;
                        pagey = touch.pageY;
                    }
                    mousemove = { left: pagex, top: pagey };
                    if (!me.dragstarted && me.dragcolumn == null) {
                        var xoffset = Math.abs(mousemove.left - me.dragmousedown.left);
                        var yoffset = Math.abs(mousemove.top - me.dragmousedown.top);
                        if (xoffset > 3 || yoffset > 3) {
                            me._createdragcolumn(column, mousemove, true);
                            $.data(me.dragcolumn[0], 'datarecord', record.displayfield);
                            if (event.preventDefault) {
                                event.preventDefault();
                            }
                        }
                    }
                }
            });
        },

        
        _rendergroupcolumn: function (text, groupcolumn) {
            var group = $('<div style="float: left; position: relative;"></div>');
            if (this.rtl) {
                group.css('float', 'right');
            }

            if (this.groupcolumnrenderer != null) {
                group[0].innerHTML = this.groupcolumnrenderer(text);
                group.addClass(this.toThemeProperty('jqx-grid-group-column'));
                group.addClass(this.toThemeProperty('jqx-fill-state-normal'));
            }

            if (this.closeablegroups) {
                if (group[0].innerHTML == '') {
                    group[0].innerHTML = '<a style="float: left;" href="#">' + text + '</a>';
                }
                if (this.rtl) {
                    group[0].innerHTML = '<a style="float: right;" href="#">' + text + '</a>';
                }
                var fl = !this.rtl ? 'right' : 'left';

                var closebutton = '<div style="float: ' + fl + '; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 100%; top: 50%; margin-left: -18px; margin-top: -8px; float: none; width: 16px; height: 16px;" class="' + this.toThemeProperty('jqx-icon-close') + '"></div></div>';
                if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                    closebutton = '<div style="float: left; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 100%; top: 50%; margin-left: -18px; margin-top: -8px; float: none; width: 16px; height: 16px;" class="' + this.toThemeProperty('jqx-icon-close') + '"></div></div>';
                }
                if (this.rtl) {
                    var closebutton = '<div style="float: ' + fl + '; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 0px; top: 50%; margin-top: -8px; float: none; width: 16px; height: 16px;" class="' + this.toThemeProperty('jqx-icon-close') + '"></div></div>';
                    if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                        closebutton = '<div style="float: left; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 0px; top: 50%; margin-top: -8px; float: none; width: 16px; height: 16px;" class="' + this.toThemeProperty('jqx-icon-close') + '"></div></div>';
                    }
                }

                group[0].innerHTML += closebutton;
            }
            else {
                if (group[0].innerHTML == '') {
                    group[0].innerHTML = '<a href="#">' + text + '</a>';
                }
            }

            if (this.sortable) {
                var sortasc = $('<div style="float: right; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 100%; top: 50%; margin-left: -16px; margin-top: -8px; float: none; width: 16px; height: 16px;" class="' + this.toThemeProperty('jqx-grid-column-sortascbutton') + '"></div></div>');
                var sortdesc = $('<div style="float: right; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 100%; top: 50%; margin-left: -16px; margin-top: -8px; float: none; width: 16px; height: 16px;" class="' + this.toThemeProperty('jqx-grid-column-sortdescbutton') + '"></div></div>');
                if (this.closeablegroups) {
                    var sortasc = $('<div style="float: right; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 100%; top: 50%; margin-left: -32px; margin-top: -8px; float: none; width: 16px; height: 16px;" class="' + this.toThemeProperty('jqx-grid-column-sortascbutton') + '"></div></div>');
                    var sortdesc = $('<div style="float: right; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 100%; top: 50%; margin-left: -32px; margin-top: -8px; float: none; width: 16px; height: 16px;" class="' + this.toThemeProperty('jqx-grid-column-sortdescbutton') + '"></div></div>');
                }
                if (this.rtl) {
                    var sortasc = $('<div style="float: right; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 0px; top: 50%; margin-left: 0px; margin-top: -8px; float: none; width: 16px; height: 16px;" class="' + this.toThemeProperty('jqx-grid-column-sortascbutton') + '"></div></div>');
                    var sortdesc = $('<div style="float: right; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 0px; top: 50%; margin-left: 0px; margin-top: -8px; float: none; width: 16px; height: 16px;" class="' + this.toThemeProperty('jqx-grid-column-sortdescbutton') + '"></div></div>');
                    if (this.closeablegroups) {
                        var sortasc = $('<div style="float: right; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 0px; top: 50%; margin-left: 16px; margin-top: -8px; float: none; width: 16px; height: 16px;" class="' + this.toThemeProperty('jqx-grid-column-sortascbutton') + '"></div></div>');
                        var sortdesc = $('<div style="float: right; min-height: 16px; min-width: 18px;"><div style="position: absolute; left: 0px; top: 50%; margin-left: 16px; margin-top: -8px; float: none; width: 16px; height: 16px;" class="' + this.toThemeProperty('jqx-grid-column-sortdescbutton') + '"></div></div>');
                    }
                }
                sortasc.css('display', 'none');
                sortdesc.css('display', 'none');
                if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                    sortasc.css('float', 'left');
                    sortdesc.css('float', 'left');
                }
                group.append(sortasc);
                group.append(sortdesc);
                $.data(document.body, "groupsortelements" + groupcolumn, { sortasc: sortasc, sortdesc: sortdesc });
            }

            group.addClass(this.toThemeProperty('jqx-fill-state-normal'));
            group.addClass(this.toThemeProperty('jqx-grid-group-column'));
            return group;
        },

        _rendergroup: function (groupslength, tablerow, renderrow, columnstart, columnend, renderedrows, tablewidth) {
            var visualrow = tablerow;
            var tablecell = tablerow.cells[renderrow.level];
            if (this.rtl) {
                tablecell = tablerow.cells[tablerow.cells.length - 1 - renderrow.level];
            }

            var expanded = this._findgroupstate(renderrow.uniqueid);
            if (renderrow.bounddata.subGroups.length > 0 || renderrow.bounddata.subItems.length > 0) {
                var rtl = this.rtl ? "-rtl" : "";
                var iconClassName = this.toThemeProperty('jqx-icon-arrow-right');
                if (rtl) iconClassName = this.toThemeProperty('jqx-icon-arrow-left');

                if (expanded) {
                    tablecell.className += " " + this.toThemeProperty('jqx-grid-group-expand' + rtl) + " " + this.toThemeProperty('jqx-icon-arrow-down');
                }
                else {
                    tablecell.className += " " + this.toThemeProperty('jqx-grid-group-collapse' + rtl) + " " + iconClassName;
                }
            }

            var text = this._getColumnText(this.groups[renderrow.level]).label;
            var indentwidth = this.groupindentwidth;
            var indent = this.rowdetails && this.showrowdetailscolumn ? (1 + groupslength) * indentwidth : (groupslength) * indentwidth;
            var width = tablewidth - indent;

            var start = renderrow.level + 1;
            if (this.rtl) {
                start = 0;
            }

            var cellToRender = visualrow.cells[start];
            var m = 2;
            while (cellToRender != undefined && cellToRender.style.display == 'none' && m < visualrow.cells.length-1) {
                cellToRender = visualrow.cells[start + m - 1];
                m++;
            }
         
            var $cellToRender = $(cellToRender);
            if (!cellToRender) {
                return;
            }
            cellToRender.style.width = parseInt(width) + 'px';
            if (cellToRender.className.indexOf('jqx-grid-cell-filter') != -1) {
                $cellToRender.removeClass(this.toThemeProperty('jqx-grid-cell-filter'));
            }
            if (cellToRender.className.indexOf('jqx-grid-cell-sort') != -1) {
                $cellToRender.removeClass(this.toThemeProperty('jqx-grid-cell-sort'));
            }
            if (cellToRender.className.indexOf('jqx-grid-cell-pinned') != -1) {
                $cellToRender.removeClass(this.toThemeProperty('jqx-grid-cell-pinned'));
            }

            if (this.groupsrenderer != null) {
                var groupdata = { group: renderrow.group, level: renderrow.level, parent: renderrow.bounddata.parentItem, subGroups: renderrow.bounddata.subGroups, subItems: renderrow.bounddata.subItems, groupcolumn: this._getColumnText(this.groups[renderrow.level]).column };
                var html = this.groupsrenderer(text + ': ' + renderrow.group, renderrow.group, expanded, groupdata);
                if (html) {
                    cellToRender.innerHTML = html;
                }
                else {
                    var count = renderrow.bounddata.subItems.length > 0 ? renderrow.bounddata.subItems.length : renderrow.bounddata.subGroups.length;
                    if (this.showgroupaggregates) {
                        var data = renderrow.bounddata.subItems.length > 0 ? renderrow.bounddata.subItems : renderrow.bounddata.subGroups;
                        count = 0;
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].totalsrow)
                                continue;
                            count++;
                        }
                    }
                    cellToRender.innerHTML = '<div class="' + this.toThemeProperty('jqx-grid-groups-row') + '" style="position: absolute;"><span>' + text + ': </span>' + '<span class="' + this.toThemeProperty('jqx-grid-groups-row-details') + '">' + renderrow.group + ' (' + count + ')' + '</span></div>';
                }
            }
            else {
                var column = this._getcolumnbydatafield(this.groups[renderrow.level]);
                var value = renderrow.group;
                if (column != null) {
                    if (column.cellsformat) {
                        if ($.jqx.dataFormat) {
                            if ($.jqx.dataFormat.isDate(value)) {
                                value = $.jqx.dataFormat.formatdate(value, column.cellsformat, this.gridlocalization);
                            }
                            else if ($.jqx.dataFormat.isNumber(value)) {
                                value = $.jqx.dataFormat.formatnumber(value, column.cellsformat, this.gridlocalization);
                            }
                        }
                    }
                    var count = renderrow.bounddata.subItems.length > 0 ? renderrow.bounddata.subItems.length : renderrow.bounddata.subGroups.length;
                    if (this.showgroupaggregates) {
                        var data = renderrow.bounddata.subItems.length > 0 ? renderrow.bounddata.subItems : renderrow.bounddata.subGroups;
                        count = 0;
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].totalsrow)
                                continue;
                            count++;
                        }
                    }
                    cellToRender.innerHTML = '<div class="' + this.toThemeProperty('jqx-grid-groups-row') + '" style="position: absolute;"><span>' + text + ': </span>' + '<span class="' + this.toThemeProperty('jqx-grid-groups-row-details') + '">' + value + ' (' + count + ')' + '</span></div>';
                }
                else throw new Error("jqxGrid: Unable to find '" + this.groups[renderrow.level] + "' group in the Grid's columns collection.");
            }
            if (this.rtl) {
                if (!column) {
                    column = this._getcolumnbydatafield(this.groups[renderrow.level])
                }
                var scrollValue = this.hScrollBar.css('visibility') == 'hidden' ? 0 : this.hScrollInstance.max - this.hScrollInstance.value;
                var scrollIndent = this.vScrollBar.css('visibility') == 'hidden' ? 0 : this.scrollbarsize + 6;
                var indent = this.rowdetails && this.showrowdetailscolumn ? (2 + renderrow.level) * indentwidth : (1 + renderrow.level) * indentwidth;
                cellToRender.style.width = tablewidth + parseInt(scrollValue) - indent - scrollIndent + 'px';
                $cellToRender.addClass(this.toThemeProperty('jqx-rtl'));
                //var zIndex = $cellToRender.css('z-index');
                var zIndex = $(tablerow.cells[tablerow.cells.length - 1]).css('z-index');
                $cellToRender.css('z-index', zIndex);
                var content = $cellToRender.find('div');
                var width = content.width();
                content.css('left', '100%');
                var pinnedColumn = this.columns.records[tablerow.cells.length - 2 - renderrow.level] != null ? this.columns.records[tablerow.cells.length - 2 - renderrow.level].pinned : false;
                if (this.table.width() < tablewidth) {
                    tablewidth = this.table.width();
                    if (this.vScrollBar.css('visibility') != 'hidden') {
                        tablewidth += this.vScrollBar.outerWidth();
                    }
                }
                if (column.pinned || pinnedColumn) {
                    if (this.rowdetails && this.showrowdetailscolumn) {
                        tablewidth += 30;
                    }
                    content.css('margin-left', -width);
                    cellToRender.style.width = tablewidth + scrollValue - indent - scrollIndent + 'px';
                }
                else {               
                    var scrollValue = this.hScrollBar.css('visibility') == 'hidden' ? 0 : this.hScrollInstance.max;
                    cellToRender.style.width = tablewidth + scrollValue - indent - scrollIndent + 'px';
                    var width = content.width();
                    content.css('margin-left', -width);
                }
            }
        }
    });
})(jqxBaseFramework);

/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($) {

    $.extend($.jqx._jqxGrid.prototype, {
        autoresizecolumns: function (resizetype, additionalwidth) {
            if (resizetype != 'cells' && resizetype != 'all' && resizetype != 'column') resizetype = 'all';
            var me = this.that;
            var rows = this.getrows();
            if (this.pageable) {
                rows = this.dataview.rows;
                if (this.groupable) {
                    rows = this.dataview.records;
                }
            }
            if (additionalwidth == undefined) additionalwidth = 0;
            else additionalwidth = parseInt(additionalwidth);

            var length = rows.length;
            if (length == undefined && rows != undefined) {
                var rowsArr = new Array();
                $.each(rows, function (index) {
                    rowsArr.push(this);
                });
                rows = rowsArr;
                length = rows.length;
            }

            var span = $("<span></span>");
            span.addClass(this.toThemeProperty('jqx-widget'));
            span.addClass(this.toThemeProperty('jqx-grid-cell'));
            $(document.body).append(span);
            var textlength = [];
            var maxLength = [];
            var maxText = [];
            var maxUppers = [];
            var hostwidth = me.host.width();
            if (me.vScrollBar[0].style.visibility != 'hidden') {
                hostwidth -= this.scrollbarsize + 5;
            }
            if (hostwidth < 0) hostwidth = 0;

            for (var i = 0; i < length; i++) {
                var row = rows[i];

                for (var j = 0; j < this.columns.records.length; j++) {
                    var column = this.columns.records[j];
                    if (column.hidden) continue;
                    if (this.groups.length > 0 && j <= this.groups.length - 1) {
                        continue;
                    }

                    if (maxLength[column.displayfield] == undefined) {
                        maxLength[column.displayfield] = 0;
                    }

                    if (maxText[column.displayfield] == undefined) {
                        maxText[column.displayfield] = "";
                    }

                    var text = row[column.displayfield];
                    if (column.cellsformat != '') {
                        if ($.jqx.dataFormat) {
                            if ($.jqx.dataFormat.isDate(text)) {
                                text = $.jqx.dataFormat.formatdate(text, column.cellsformat, this.gridlocalization);
                            }
                            else if ($.jqx.dataFormat.isNumber(text)) {
                                text = $.jqx.dataFormat.formatnumber(text, column.cellsformat, this.gridlocalization);
                            }
                        }
                    }
                    else if (column.cellsrenderer) {
                        var defaultcellsrenderer = me._defaultcellsrenderer(text, column);

                        var result = column.cellsrenderer(i, column.datafield, text, defaultcellsrenderer, column.getcolumnproperties(), row);
                        if (result != undefined) {
                            text = $(result).text();
                        }
                    }

                    if (resizetype == undefined || resizetype == 'cells' || resizetype == 'all') {
                        if (text != null) {
                            var textlength = text.toString().length;
                            var str = text.toString();
                            var charslength = str.replace(/[^A-Z]/g, "").length;
                        
                            if (textlength > maxLength[column.displayfield]) {
                                maxLength[column.displayfield] = textlength;
                                maxText[column.displayfield] = text;
                                maxUppers[column.displayfield] = charslength;
                            }

                            if (textlength > 0 && textlength >= charslength) {
                                var k1 = charslength * 20 + (textlength - charslength) * 15
                                var k2 = maxUppers[column.displayfield] * 20 + (maxLength[column.displayfield] - maxUppers[column.displayfield]) * 15;
                                if (k1 > k2 && k1 > 0 && k2 > 0) {
                                    maxLength[column.displayfield] = textlength;
                                    maxText[column.displayfield] = text;
                                    maxUppers[column.displayfield] = charslength;
                                }
                            }
                        }
                    }

                    if (resizetype == 'column' || resizetype == 'all') {
                        if (column.text.toString().length > maxLength[column.displayfield]) {
                            maxText[column.displayfield] = column.text;
                            maxLength[column.displayfield] = column.text.length;
                            var str = column.text.toString();
                            var charslength = str.replace(/[^A-Z]/g, "").length;
                            maxUppers[column.displayfield] = charslength;
                        }
                        var text = column.text;
                        var textlength = text.toString().length;
                        var str = text.toString();
                        var charslength = str.replace(/[^A-Z]/g, "").length;

                        if (textlength > 0 && textlength >= charslength) {
                            var k1 = charslength * 20 + (textlength - charslength) * 15
                            var k2 = maxUppers[column.displayfield] * 20 + (maxLength[column.displayfield] - maxUppers[column.displayfield]) * 15;
                            if (k1 > k2 && k1 > 0 && k2 > 0) {
                                maxLength[column.displayfield] = textlength;
                                maxText[column.displayfield] = text;
                                maxUppers[column.displayfield] = charslength;
                            }
                        }
                    }
                }
            }
            if (!this.columns.records) {
                return;
            }

            for (var j = 0; j < this.columns.records.length; j++) {
                var column = this.columns.records[j];
                if (!column.displayfield)
                    continue;

                if (maxText[column.displayfield] == undefined) {
                    maxText[column.displayfield] = column.text;
                }
                if (span[0].className.indexOf('jqx-grid-column-header') >= 0) {
                    span.removeClass(this.toThemeProperty('jqx-grid-column-header'));
                }
                if (maxText[column.displayfield] == column.text) {
                    span.addClass(this.toThemeProperty('jqx-grid-column-header'));
                }

                span[0].innerHTML = maxText[column.displayfield].toString();
                var maxWidth = span.outerWidth() + 10;
                if (span.children().length > 0) {
                    maxWidth = span.children().outerWidth() + 10;
                }
                if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                    maxWidth += 10;
                }
                if (this.filterable && this.showfilterrow) {
                    maxWidth += 5;
                }
                maxWidth += additionalwidth;

                if (maxWidth > column.maxwidth) maxWidth = column.maxwidth;

                if (column._width != undefined) column.__width = column._width;
                column._width = null;
                if (column.maxwidth == 'auto' || maxWidth <= column.maxwidth) {
                    var oldwidth = column.width;
                    if (maxWidth < column.minwidth) {
                        maxWidth = column.minwidth;
                    }

                    column.width = maxWidth;
                    if (column._percentagewidth != undefined) {
                        column._percentagewidth = null;
                    }
                    this._raiseEvent(14, { columntext: column.text, column: column.getcolumnproperties(), datafield: column.datafield, displayfield: column.displayfield, oldwidth: oldwidth, newwidth: maxWidth });
                }
            }

            span.remove();
            this._updatecolumnwidths();
            this._updatecellwidths();
            this._renderrows(this.virtualsizeinfo);
            for (var j = 0; j < this.columns.records.length; j++) {
                var column = this.columns.records[j];
                if (column.__width != undefined) {
                    column._width = column.__width;
                }
            }
        },

        autoresizecolumn: function (datafield, resizetype, additionalwidth) {
            if (resizetype != 'cells' && resizetype != 'all' && resizetype != 'column') resizetype = 'all';
            if (datafield == undefined) {
                return false;
            }

            var rows = this.getrows();
            if (this.pageable) {
                rows = this.dataview.rows;
                if (this.groupable) {
                    rows = this.dataview.records;
                }
            }

            var column = this.getcolumn(datafield);
            if (column == undefined) {
                return false;
            }

            if (additionalwidth == undefined) additionalwidth = 0;
            else additionalwidth = parseInt(additionalwidth);

            var length = rows.length;
            var span = $("<span></span>");
            span.addClass(this.toThemeProperty('jqx-widget'));
            span.addClass(this.toThemeProperty('jqx-grid-cell'));
            $(document.body).append(span);
            var maxLength = 0;
            var maxText = "";
            var maxUppers = 0;

            var me = this.that;
            var hostwidth = me.host.width();
            if (me.vScrollBar[0].style.visibility != 'hidden') {
                hostwidth -= this.scrollbarsize + 5;
            }
            if (hostwidth < 0) hostwidth = 0;

            if (resizetype == undefined || resizetype == 'cells' || resizetype == 'all') {
                for (var i = 0; i < length; i++) {
                    var text = rows[i][column.displayfield];
                    if (column.cellsformat != '') {
                        if ($.jqx.dataFormat) {
                            if ($.jqx.dataFormat.isDate(text)) {
                                text = $.jqx.dataFormat.formatdate(text, column.cellsformat, this.gridlocalization);
                            }
                            else if ($.jqx.dataFormat.isNumber(text)) {
                                text = $.jqx.dataFormat.formatnumber(text, column.cellsformat, this.gridlocalization);
                            }
                        }
                    } else if (column.cellsrenderer) {
                        var result = column.cellsrenderer(i, column, text);
                        if (result != undefined) {
                            text = $(result).text();
                        }
                    }

                    if (text != null) {
                        var textlength = text.toString().length;
                        var str = text.toString();
                        var charslength = str.replace(/[^A-Z]/g, "").length;
                        if (textlength > maxLength) {
                            maxLength = textlength;
                            maxText = text;
                            maxUppers = charslength;
                        }
                        if (textlength > 0 && textlength >= charslength) {
                            var k1 = charslength * 20 + (textlength - charslength) * 15
                            var k2 = maxUppers * 20 + (maxLength - maxUppers) * 15;
                            if (k1 > k2 && k1 > 0 && k2 > 0) {
                                maxLength= textlength;
                                maxText = text;
                                maxUppers = charslength;
                            }
                        }
                    }
                }
            }

            if (resizetype == 'column' || resizetype == 'all') {
                if (column.text.toString().length > maxLength) {
                    maxText = column.text;
                }

                var text = column.text.toString();
                var textlength = text.toString().length;
                var str = text.toString();
                var charslength = str.replace(/[^A-Z]/g, "").length;

                if (textlength > 0 && textlength >= charslength) {
                    var k1 = charslength * 20 + (textlength - charslength) * 15
                    var k2 = maxUppers * 20 + (maxLength - maxUppers) * 15;
                    if (k1 > k2 && k1 > 0 && k2 > 0) {
                        maxLength = textlength;
                        maxText = text;
                        maxUppers = charslength;
                    }
                }
            }
            if (maxText == undefined) {
                maxText = column.text;
            }

            span[0].innerHTML = maxText;
            if (maxText == column.text) {
                span.addClass(this.toThemeProperty('jqx-grid-column-header'));
            }
            var maxWidth = span.outerWidth() + 10;
            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                maxWidth += 5;
            }
            if (this.filterable && this.showfilterrow) {
                maxWidth += 5;
            }
            maxWidth += additionalwidth;

            span.remove();
            if (maxWidth > column.maxwidth) maxWidth = column.maxwidth;

            if (column.maxwidth == 'auto' || maxWidth <= column.maxwidth) {
                var oldwidth = column.width;
                if (maxWidth < column.minwidth) maxWidth = column.minwidth;
                column.width = maxWidth;
                if (column._width != undefined) column.__width = column._width;
                column._width = null;
                if (column._percentagewidth != undefined) {
                    column._percentagewidth = null;
                }
                this._updatecolumnwidths();
                this._updatecellwidths();
                this._raiseEvent(14, { columntext: column.text, column: column.getcolumnproperties(), datafield: datafield, displayfield: column.displayfield, oldwidth: oldwidth, newwidth: maxWidth });
                this._renderrows(this.virtualsizeinfo);
                if (column._width != undefined)
                    column._width = column.__width;
            }
        },

        _handlecolumnsresize: function () {
            var self = this.that;
            if (this.columnsresize) {
                var touchdevice = false;
                if (self.isTouchDevice() && self.touchmode !== true) {
                    touchdevice = true;
                }
                var mousemove = 'mousemove.resize' + this.element.id;
                var mousedown = 'mousedown.resize' + this.element.id;
                var mouseup = 'mouseup.resize' + this.element.id;
                if (touchdevice) {
                    var mousemove = $.jqx.mobile.getTouchEventName('touchmove') + '.resize' + this.element.id;
                    var mousedown = $.jqx.mobile.getTouchEventName('touchstart') + '.resize' + this.element.id;
                    var mouseup = $.jqx.mobile.getTouchEventName('touchend') + '.resize' + this.element.id;
                }

                this.removeHandler($(document), mousemove);
                this.addHandler($(document), mousemove, function (event) {
                    var openedmenu = $.data(document.body, "contextmenu" + self.element.id);
                    if (openedmenu != null && self.autoshowcolumnsmenubutton)
                        return true;

                    if (self.resizablecolumn != null && !self.disabled && self.resizing) {
                        if (self.resizeline != null) {
                            var resizeElement = self.resizablecolumn.columnelement;

                            var hostoffset = self.host.coord();
                            var startleft = parseInt(self.resizestartline.coord().left);

                            var minleft = startleft - self._startcolumnwidth
                            var mincolumnwidth = self.resizablecolumn.column.minwidth;
                            if (mincolumnwidth == 'auto') mincolumnwidth = 0;
                            else mincolumnwidth = parseInt(mincolumnwidth);
                            var maxcolumnwidth = self.resizablecolumn.column.maxwidth;
                            if (maxcolumnwidth == 'auto') maxcolumnwidth = 0;
                            else maxcolumnwidth = parseInt(maxcolumnwidth);
                            var pageX = event.pageX;
                            if (touchdevice) {
                                var touches = self.getTouches(event);
                                var touch = touches[0];
                                pageX = touch.pageX;
                            }

                            minleft += mincolumnwidth;

                            var maxleft = maxcolumnwidth > 0 ? startleft + maxcolumnwidth : 0;
                            var canresize = maxcolumnwidth == 0 ? true : self._startcolumnwidth + pageX - startleft < maxcolumnwidth ? true : false;
                            if (self.rtl) {
                                var canresize = true;
                            }

                            if (canresize) {
                                if (!self.rtl) {
                                    if (pageX >= hostoffset.left && pageX >= minleft) {
                                        if (maxleft != 0 && event.pageX < maxleft) {
                                            self.resizeline.css('left', pageX);
                                        }
                                        else if (maxleft == 0) {
                                            self.resizeline.css('left', pageX);
                                        }

                                        if (touchdevice)
                                            return false;
                                    }
                                }
                                else {
                                    if (pageX >= hostoffset.left && pageX <= hostoffset.left + self.host.width()) {
                                        self.resizeline.css('left', pageX);

                                        if (touchdevice)
                                            return false;
                                    }
                                }
                            }
                        }
                    }

                    if (!touchdevice && self.resizablecolumn != null)
                        return false;
                });

                this.removeHandler($(document), mousedown);
                this.addHandler($(document), mousedown, function (event) {
                    var openedmenu = $.data(document.body, "contextmenu" + self.element.id);
                    if (openedmenu != null && self.autoshowcolumnsmenubutton)
                        return true;

                    if (self.resizablecolumn != null && !self.disabled) {
                        var resizeElement = self.resizablecolumn.columnelement;
                        if (resizeElement.coord().top + resizeElement.height() + 5 < event.pageY) {
                            self.resizablecolumn = null;
                            return;
                        }

                        if (resizeElement.coord().top - 5 > event.pageY) {
                            self.resizablecolumn = null;
                            return;
                        }

                        self._startcolumnwidth = self.resizablecolumn.column.width;
                        self.resizablecolumn.column._width = null;
                        $(document.body).addClass('jqx-disableselect');
                        $(document.body).addClass('jqx-position-reset');
                        self.host.addClass('jqx-disableselect');
                        self.content.addClass('jqx-disableselect');

                        
                        self._mouseDownResize = new Date();
                        self.resizing = true;

                        if (self._lastmouseDownResize && self.columnsautoresize) {
                            if (self._lastmouseDownResize - self._mouseDownResize < 300 && self._lastmouseDownResize - self._mouseDownResize > -500) {
                                var column = self.resizablecolumn.column;
                                if (column.resizable) {
                                    var width = self.resizablecolumn.column.width;
                                    var scrollVisibility = self.hScrollBar[0].style.visibility;


                                    self._resizecolumn = null;

                                    self.resizeline.hide();
                                    self.resizestartline.hide();
                                    self.resizebackground.remove();
                                    self.resizablecolumn = null;
                                    self.columndragstarted = false;
                                    self.dragmousedown = null;
                                    self.__drag = false;

                                    self.autoresizecolumn(column.displayfield, "all");
                                    if (scrollVisibility != self.hScrollBar[0].style.visibility) {
                                        self.hScrollInstance.setPosition(0);
                                    }
                                    if (self.rtl) {
                                        self._arrange();
                                    }
                                    if (self.autosavestate) {
                                        if (self.savestate) self.savestate();
                                    }
                                    event.stopPropagation();
                                    self.suspendClick = true;
                                    setTimeout(function () {
                                        self.suspendClick = false;
                                    }, 100);
                                    return false;
                                }
                            }
                        }

                        self._lastmouseDownResize = new Date();

                        self._resizecolumn = self.resizablecolumn.column;
                        self.resizeline = self.resizeline || $('<div style="position: absolute;"></div>');
                        self.resizestartline = self.resizestartline || $('<div style="position: absolute;"></div>');

                        self.resizebackground = self.resizebackground || $('<div style="position: absolute; left: 0; top: 0; background: #000;"></div>');
                        self.resizebackground.css('opacity', 0.01);
                        self.resizebackground.css('cursor', "col-resize");
                        self.resizeline.css('cursor', 'col-resize');
                        self.resizestartline.css('cursor', 'col-resize');

                        self.resizeline.addClass(self.toThemeProperty('jqx-grid-column-resizeline'));
                        self.resizestartline.addClass(self.toThemeProperty('jqx-grid-column-resizestartline'));

                        $(document.body).append(self.resizeline);
                        $(document.body).append(self.resizestartline);
                        $(document.body).append(self.resizebackground);
                        var resizelineoffset = self.resizablecolumn.columnelement.coord();
                        self.resizebackground.css('left', self.host.coord().left);
                        self.resizebackground.css('top', self.host.coord().top);
                        self.resizebackground.width(self.host.width());
                        self.resizebackground.height(self.host.height());
                        self.resizebackground.css('z-index', 9999);

                        var positionline = function (resizeline) {
                            if (!self.rtl) {
                                resizeline.css('left', parseInt(resizelineoffset.left) + self._startcolumnwidth);
                            }
                            else {
                                resizeline.css('left', parseInt(resizelineoffset.left));
                            }

                            var hasgroups = self._groupsheader();
                            var groupsheaderheight = hasgroups ? self.groupsheader.height() : 0;
                            var toolbarheight = self.showtoolbar ? self.toolbarheight : 0;
                            groupsheaderheight += toolbarheight;
                            var statusbarheight = self.showstatusbar ? self.statusbarheight : 0;
                            groupsheaderheight += statusbarheight;

                            var pagerheight = 0;
                            if (self.pageable) {
                                pagerheight = self.pagerheight;
                            }
                            var scrollbaroffset = self.hScrollBar.css('visibility') == 'visible' ? 17 : 0;

                            resizeline.css('top', parseInt(resizelineoffset.top));
                            resizeline.css('z-index', 99999);
                            if (self.columngroups) {
                                resizeline.height(self.host.height() +self.resizablecolumn.columnelement.height()  - pagerheight - groupsheaderheight - scrollbaroffset - self.columngroupslevel * self.columnsheight);
                            }
                            else {
                                resizeline.height(self.host.height() - pagerheight - groupsheaderheight - scrollbaroffset);
                            }
                            if (self.enableanimations) {
                                resizeline.show('fast');
                            }
                            else {
                                resizeline.show();
                            }
                        }
                        positionline(self.resizeline);
                        positionline(self.resizestartline);

                        self.dragmousedown = null;
                    }
                });

                var doresize = function () {
                    $(document.body).removeClass('jqx-disableselect');
                    $(document.body).removeClass('jqx-position-reset');

                    if (self.showfilterrow || self.showstatusbar || self.showtoolbar || self.enablebrowserselection) {
                        self.host.removeClass('jqx-disableselect');
                        self.content.removeClass('jqx-disableselect');
                    }

                    if (!self.resizing)
                        return;

                    self._mouseUpResize = new Date();
                    var timeout = self._mouseUpResize - self._mouseDownResize;
                    if (timeout < 200) {
                        self.resizing = false;
                        if (self._resizecolumn != null && self.resizeline != null && self.resizeline.css('display') == 'block') {
                            self._resizecolumn = null;
                            self.resizeline.hide();
                            self.resizestartline.hide();
                            self.resizebackground.remove();
                        }
                        return;
                    }

                    self.resizing = false;

                    if (self.disabled)
                        return;

                    var hostwidth = self.host.width();
                    if (self.vScrollBar[0].style.visibility != 'hidden') hostwidth -= 20;
                    if (hostwidth < 0) hostwidth = 0;

                    if (self._resizecolumn != null && self.resizeline != null && self.resizeline.css('display') == 'block') {
                        var resizelineleft = parseInt(self.resizeline.css('left'));
                        var resizestartlineleft = parseInt(self.resizestartline.css('left'));

                        var newwidth = self._startcolumnwidth + resizelineleft - resizestartlineleft;
                        if (self.rtl) {
                            var newwidth = self._startcolumnwidth - resizelineleft + resizestartlineleft;
                        }

                        var oldwidth = self._resizecolumn.width;
                        self._closemenu();
                        if (newwidth < self._resizecolumn.minwidth)
                            newwidth = self._resizecolumn.minwidth;

                        self._resizecolumn.width = newwidth;
                        if (self._resizecolumn._percentagewidth != undefined) {
                            self._resizecolumn._percentagewidth = (newwidth / hostwidth) * 100;
                        }

                        for (var m = 0; m < self._columns.length; m++) {
                            if (self._columns[m].datafield === self._resizecolumn.datafield) {
                                self._columns[m].width = self._resizecolumn.width;
                                if (self._columns[m].width < self._resizecolumn.minwidth)
                                    self._columns[m].width = self._resizecolumn.minwidth;
                                break;
                            }
                        }

                        var scrollVisibility = self.hScrollBar[0].style.visibility;

                        self._updatecolumnwidths();
                        self._updatecellwidths();
                        self._raiseEvent(14, { columntext: self._resizecolumn.text, column: self._resizecolumn.getcolumnproperties(), datafield: self._resizecolumn.datafield, oldwidth: oldwidth, newwidth: newwidth });
                        self._renderrows(self.virtualsizeinfo);
                        if (self.autosavestate) {
                            if (self.savestate) self.savestate();
                        }
                        if (scrollVisibility != self.hScrollBar[0].style.visibility) {
                            self.hScrollInstance.setPosition(0);
                        }
                        if (self.rtl) {
                            self._arrange();
                        }

                        self._resizecolumn = null;

                        self.resizeline.hide();
                        self.resizestartline.hide();
                        self.resizebackground.remove();
                        self.resizablecolumn = null;
                    }
                    else {
                        self.resizablecolumn = null;
                    }
                }

                try {
                    if (document.referrer != "" || window.frameElement) {
                        var parentLocation = null;
                        if (window.top != null && window.top != window.self) {
                            if (window.parent && document.referrer) {
                                parentLocation = document.referrer;
                            }
                        }

                        if (parentLocation && parentLocation.indexOf(document.location.host) != -1) {
                            var eventHandle = function (event) {
                                doresize();
                            };

                            if (window.top.document.addEventListener) {
                                window.top.document.addEventListener('mouseup', eventHandle, false);

                            } else if (window.top.document.attachEvent) {
                                window.top.document.attachEvent("on" + 'mouseup', eventHandle);
                            }
                        }
                    }
                }
                catch (error) {
                }

                this.removeHandler($(document), mouseup);
                this.addHandler($(document), mouseup, function (event) {
                    var openedmenu = $.data(document.body, "contextmenu" + self.element.id);
                    if (openedmenu != null && self.autoshowcolumnsmenubutton)
                        return true;

                    doresize();
                });
            }
        }
    });
})(jqxBaseFramework);



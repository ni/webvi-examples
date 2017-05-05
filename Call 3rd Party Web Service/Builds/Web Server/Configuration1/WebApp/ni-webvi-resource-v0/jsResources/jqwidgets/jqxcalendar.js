/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/


(function ($) {

    $.jqx.jqxWidget("jqxCalendar", "", {});

    $.extend($.jqx._jqxCalendar.prototype, {
        defineInstance: function () {
            var settings = {
                // enables or disables the Calendar control.
                disabled: false,

				// restricted dates
                restrictedDates: new Array(),

                // not available in this version.
                multipleMonthRows: 1,

                // not available in this version.
                multipleMonthColumns: 1,

                // Specifies the Calendar's minimum navigation date.
                minDate: $.jqx._jqxDateTimeInput.getDateTime(new Date()),

                // Specifies the Calendar's maximum navigation date.
                maxDate: $.jqx._jqxDateTimeInput.getDateTime(new Date()),

                min: new Date(1900, 0, 1),
                max: new Date(2100, 0, 1),

                navigationDelay: 400,
                // Type: Number
                // Default: 1
                // Gets or sets the navigation step.
                stepMonths: 1, // Number of months to step back/forward

                // Type: Number
                // Default: null
                // Gets or sets the Calendar's width.
                width: null,

                // Type: height
                // Default: null
                // Gets or sets the Calendar's height.
                height: null,

                // Type: $.jqx._jqxDateTimeInput.getDateTime
                // Default:  $.jqx._jqxDateTimeInput.getDateTime(new Date()), (Today)
                // Gets or sets the Calendar's value.
                value: $.jqx._jqxDateTimeInput.getDateTime(new Date()),

                // Type: Number.
                // Default: 0
                // Gets or sets the first day of the week - Sunday : 0, Monday : 1, Tuesday : 2, Wednesday : 3, Thursday : 4, Friday : 5, Saturday : 6.
                firstDayOfWeek: 0,

                // Type: Boolean.
                // Default: false.
                // Shows or hides the week numbers.
                showWeekNumbers: false,

                // Type: Boolean.
                // Default: true.
                // Shows or hides the Day Names.
                showDayNames: true,

                // Type: Boolean
                // Default: false
                // Enables or disables the weekend highlight option.
                enableWeekend: false,

                // Type: Boolean
                // Default: true
                // Enables or disables the other month highlight.
                enableOtherMonthDays: true,

                // Type: Boolean
                // Default: true
                // Shows or hides the other month days.
                showOtherMonthDays: true,

                // Gets or sets the row header's width.
                // Type: Number.
                rowHeaderWidth: 25,

                // Default: 20
                // Gets or sets the column header's height.
                // Type: Number.
                columnHeaderHeight: 20,

                // Default: 28
                // Gets or sets the title's height.
                // Type: Number.
                titleHeight: 30,

                // Type: String.
                // Gets or sets the string format of the day names.
                // Possible values: default, shortest, firstTwoLetters, firstLetter, full
                dayNameFormat: 'firstTwoLetters',

                monthNameFormat: 'default',

                // Type: string.
                // Represents the title format displayed between the navigation arrow.
                titleFormat: ["MMMM yyyy", "yyyy", "yyyy", "yyyy"],
                enableViews: true,
                // Type: Boolean.
                // Default: false
                // Gets or sets the readonly state. In this state the user can navigate through the months, but is not allowed to select.
                readOnly: false,

                //Type: string
                //Default: 'default'
                //Gets or sets the calendar's culture.
                culture: "default",

                // Type: Boolean
                // Default: true.
                // Enables or disables the fast navigation when the user holds the mouse pressed over a navigation arrow.
                enableFastNavigation: true,

                // Type: Boolean
                // Default: true
                // Enables or disables the hover state.
                enableHover: true,

                // Type: Boolean
                // Default: true
                // When this property is true, click on other month date will automatically navigate to the previous or next month.
                enableAutoNavigation: true,

                // Type: Boolean
                // Default: false
                // enables or disabled the calendar tooltips.
                enableTooltips: false,

                // Type: String
                // Back Button Text.
                backText: "Back",
                // Type: String
                // Forward Button Text.
                forwardText: "Forward",

                // Type: Array
                // Represents a collection of special calendar days.
                specialDates: new Array(),
                keyboardNavigation: true,
                // Selects a range of dates.
                selectionMode: 'default',
                selectableDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                todayString: 'Today',
                clearString: 'Clear',
                showFooter: false,
                selection: { from: null, to: null },
                canRender: true,
                _checkForHiddenParent: true,
                //Type: Number.
                //Default: 0.
                //Sets height of the calendar in pixels. 
                height: null,
                rtl: false,
                // month, year, decade
                view: 'month',
                views: ['month', 'year', 'decade'],
                changing: null,
                change: null,
                localization: {
                    backString: "Back",
                    forwardString: "Forward",
                    todayString: "Today",
                    clearString: "Clear",
                    calendar: {
                        name: "Gregorian_USEnglish",
                        "/": "/",
                        // separator of parts of a time (e.g. ":" in 05:44 PM)
                        ":": ":",
                        // the first day of the week (0 : Sunday, 1 : Monday, etc)
                        firstDay: 0,
                        days: {
                            // full day names
                            names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                            // abbreviated day names
                            namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                            // shortest day names
                            namesShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
                        },
                        months: {
                            // full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
                            names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
                            // abbreviated month names
                            namesAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""]
                        },
                        // AM and PM designators in one of these forms:
                        // The usual view, and the upper and lower case versions
                        //      [standard,lowercase,uppercase]
                        // The culture does not use AM or PM (likely all standard date formats use 24 hour time)
                        //      null
                        AM: ["AM", "am", "AM"],
                        PM: ["PM", "pm", "PM"],
                        eras: [
                        // eras in reverse chronological order.
                        // name: the name of the era in this culture (e.g. A.D., C.E.)
                        // start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
                        // offset: offset in years from gregorian calendar
                            { "name": "A.D.", "start": null, "offset": 0 }
                        ],
                        twoDigitYearMax: 2029,
                        patterns: {
                            // short date pattern
                            d: "M/d/yyyy",
                            // long date pattern
                            D: "dddd, MMMM dd, yyyy",
                            // short time pattern
                            t: "h:mm tt",
                            // long time pattern
                            T: "h:mm:ss tt",
                            // long date, short time pattern
                            f: "dddd, MMMM dd, yyyy h:mm tt",
                            // long date, long time pattern
                            F: "dddd, MMMM dd, yyyy h:mm:ss tt",
                            // month/day pattern
                            M: "MMMM dd",
                            // month/year pattern
                            Y: "yyyy MMMM",
                            // S is a sortable format that does not vary by culture
                            S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss",
                            // formatting of dates in MySQL DataBases
                            ISO: "yyyy-MM-dd hh:mm:ss"
                        }
                    }
                },
                // Calendar events.
                events:
                [
                // occurs when the back button is clicked.
                   'backButtonClick',
                // occurs when the forward button is clicked.
                   'nextButtonClick',
                // occurs when the value is changed.
                   'valuechanged',
                // occurs when the user clicks a cell.
                   'cellMouseDown',
                // occurs when the user clicks a cell but is still holding the mouse key pressed.
                   'cellMouseUp',
                // occurs when the user selects a cell.
                   'cellSelected',
                // occurs when a cell is unselected. For example: user selects a cell and then selects another cell. The first selected cell is unselected.
                   'cellUnselected',
                // occurs when the date is changed.
                   'change',
                // occurs when the view is changed.
                   'viewChange'
                ]
            };

            $.extend(true, this, settings);

            this.minDate._setYear(1900);
            this.minDate._setMonth(1);
            this.minDate._setDay(1);
            this.minDate._setHours(0);
            this.minDate._setMinutes(0);
            this.minDate._setSeconds(0);
            this.minDate._setMilliseconds(0);
            this.maxDate._setYear(2100);
            this.maxDate._setMonth(1);
            this.maxDate._setDay(1);
            this.maxDate._setHours(0);
            this.maxDate._setMinutes(0);
            this.maxDate._setSeconds(0);
            this.maxDate._setMilliseconds(0);

            this.value._setHours(0);
            this.value._setMinutes(0);
            this.value._setSeconds(0);
            this.value._setMilliseconds(0);
            return settings;
        },

        _createFromInput: function (name)
        {
            var that = this;
            if (that.element.nodeName.toLowerCase() == "input")
            {
                that.field = that.element;
                if (that.field.className)
                {
                    that._className = that.field.className;
                }

                var properties = {
                    'title': that.field.title
                };

                if (that.field.value)
                {
                    properties.value = that.field.value;
                }
                if (that.field.checked)
                {
                    properties.checked = true;
                }
                if (that.field.id.length)
                {
                    properties.id = that.field.id.replace(/[^\w]/g, '_') + "_" + name;
                }
                else
                {
                    properties.id = $.jqx.utilities.createId() + "_" + name;
                }
                if (that.field.getAttribute('min'))
                {
                    var min = new Date(that.field.getAttribute('min'));
                    if (min != "Invalid Date") that.min = min;
                }
                if (that.field.getAttribute('max'))
                {
                    var max = new Date(that.field.getAttribute('max'));
                    if (max != "Invalid Date") that.max = max;
                }
                var wrapper = $("<div></div>", properties);
                wrapper[0].style.cssText = that.field.style.cssText;
                if (!that.width)
                {
                    that.width = $(that.field).width();
                }
                if (!that.height)
                {
                    that.height = $(that.field).outerHeight();
                }
                $(that.field).hide().after(wrapper);
                var data = that.host.data();
                that.host = wrapper;
                that.host.data(data);
                that.element = wrapper[0];
                that.element.id = that.field.id;
                that.field.id = properties.id;
                if (that._className)
                {
                    that.host.addClass(that._className);
                    $(that.field).removeClass(that._className);
                }

                if (that.field.tabIndex)
                {
                    var tabIndex = that.field.tabIndex;
                    that.field.tabIndex = -1;
                    that.element.tabIndex = tabIndex;
                }
            }
        },

        createInstance: function (args)
        {
            var that = this;
            that._createFromInput("jqxCalendar");

            this.setCalendarSize();
            if (this.element.id === "") {
                this.element.id = $.jqx.utilities.createId();
            }
            if ($.type(this.value) == "date") {
                this.value = $.jqx._jqxDateTimeInput.getDateTime(this.value);
            }

            this.element.innerHTML = "";
            this.host.attr('data-role', 'calendar');
            var id = this.element.id;
            var me = this;
            this.propertyChangeMap['width'] = function (instance, key, oldVal, value) {
                me.setCalendarSize();
            };

            this.propertyChangeMap['height'] = function (instance, key, oldVal, value) {
                me.setCalendarSize();
            };

            if ($.global) {
                $.global.preferCulture(this.culture);
            }

            if (this.culture != 'default') {
                if ($.global) {
                    $.global.preferCulture(this.culture);
                    this.localization.calendar = $.global.culture.calendar;
                }
                else if (Globalize) {
                    var culture = Globalize.culture(this.culture);
                    this.localization.calendar = culture.calendar;
                }
                this.firstDayOfWeek = this.localization.calendar.firstDay;
            }
            if (this.localization.backString != "Back") {
                this.backText = this.localization.backString;
            }
            if (this.localization.forwardString != "Forward") {
                this.forwardText = this.localization.forwardString;
            }
            if (this.localization.todayString != "Today" && this.localization.todayString) {
                this.todayString = this.localization.todayString;
            }
            if (this.localization.clearString != "Clear" && this.localization.clearString) {
                this.clearString = this.localization.clearString;
            }
            if (this.localization.calendar && this.localization.calendar.firstDay != undefined && this.culture != "default") {
                this.firstDayOfWeek = this.localization.calendar.firstDay;
            }

            this.setMaxDate(this.max, false);
            this.setMinDate(this.min, false);

            if (!this.host.attr('tabIndex')) {
                this.host.attr('tabIndex', 0);
            }

            this.host.css('outline', 'none');
            this.host.addClass(this.toThemeProperty("jqx-calendar"));
            this.host.addClass(this.toThemeProperty("jqx-widget"));
            this.host.addClass(this.toThemeProperty("jqx-widget-content"));
            this.host.addClass(this.toThemeProperty("jqx-rc-all"));
            this._addInput();

            if (this.views.indexOf('month') == -1) this.view = "year";
            if (this.views.indexOf('year') == -1 && this.views.indexOf('month') == -1) this.view = "decade";

            this.addHandler(this.host, 'keydown',
            function (event) {
                var result = true;
                if (me.keyboardNavigation) {
                    if (me._handleKey != undefined) {
                        result = me._handleKey(event);
                        if (!result) {
                            if (event.stopPropagation) event.stopPropagation();
                            if (event.preventDefault) event.preventDefault();
                        }
                    }
                }
                return result;
            });

            var loaded = false;
            var myCalendar = this;

            var percentageSize = false;

            if (me.width != null && me.width.toString().indexOf("%") != -1) {
                percentageSize = true;
            }

            if (me.height != null && me.height.toString().indexOf("%") != -1) {
                percentageSize = true;
            }

            $.jqx.utilities.resize(this.host, function () {
                var month = myCalendar.host.find("#View" + me.element.id);
                if (!loaded) {
                    loaded = true;
                    myCalendar.render();
                }
                else myCalendar.refreshTitle(month);

                if (percentageSize) {
                    if (me.refreshTimer) {
                        clearTimeout(me.refreshTimer);
                    }

                    me.refreshTimer = setTimeout(function () {
                        me.refreshControl();
                    }, 1);
                }
            }, false, this._checkForHiddenParent);

            var calendarID = 'View';
            this.propertyChangeMap['disabled'] = function (instance, key, oldVal, value) {
                if (value) {
                    instance.host.addClass(me.toThemeProperty('jqx-fill-state-disabled'));
                }
                else {
                    instance.host.removeClass(me.toThemeProperty('jqx-fill-state-disabled'));
                }
                me.refreshControl();
            }
        },

        _addInput: function () {
            var name = this.host.attr('name');
            this.input = $("<input type='hidden'/>");
            this.host.append(this.input);
            if (name) {
                this.input.attr('name', name);
            }
            this.input.val(this.getDate().toString());
        },

        setCalendarSize: function () {
            if (this.width != null && this.width.toString().indexOf("px") != -1) {
                this.host.width(this.width);
            }
            else
                if (this.width != undefined && !isNaN(this.width)) {
                    this.host.width(this.width);
                }

            if (this.width != null && this.width.toString().indexOf("%") != -1) {
                this.host.css('width', this.width);
            }

            if (this.height != null && this.height.toString().indexOf("px") != -1) {
                this.host.height(this.height);
            }
            else if (this.height != undefined && !isNaN(this.height)) {
                this.host.height(this.height);
            };

            if (this.height != null && this.height.toString().indexOf("%") != -1) {
                this.host.css('height', this.height);
            }
        },

        _getYearAndMonthPart: function (date) {
            if (!date) {
                return new Date(1900, 0, 1);
            }
            var newDate = new Date(date.getFullYear(), date.getMonth(), 1);
            return newDate;
        },

        _handleKey: function (event) {
            if (this.readOnly)
                return true;

            var key = event.keyCode;
            var me = this;
            var selectedDate = this._getSelectedDate();
            if (selectedDate == undefined) {
                if (this.view == "month" && (key == 37 || key == 38 || key == 39 || key == 40)) {
                    this.selectedDate = new Date(this.value.year, this.value.month - 1, 1);
                    this._selectDate(this.selectedDate, 'key');
                    selectedDate = this.selectedDate;
                }
                else {
                    return true;
                }
            }

            if (event.altKey) {
                return true;
            }

            if (this._animating)
                return false;

            if (this.view != "month" && key == 13) {
                var cell = this._getSelectedCell();
                this._setDateAndSwitchViews(cell, event, "keyboard");
            }

            if (this.view == "year") {
                var month = selectedDate.getMonth();
                var minDate = this._getYearAndMonthPart(this.getMinDate());
                var maxDate = this._getYearAndMonthPart(this.getMaxDate());

                switch (key) {
                    case 37:
                        // previous
                        if (month == 0) {
                            var newDate = new Date(selectedDate.getFullYear() - 1, 11, 1);
                            if (newDate >= minDate) {
                                this.selectedDate = newDate;
                                this.navigateBackward();
                            }
                            else if (this.selectedDate != minDate) {
                                this.selectedDate = minDate;
                                this.navigateBackward();
                            }
                        }
                        else {
                            var newDate = new Date(selectedDate.getFullYear(), month - 1, 1)
                            if (newDate >= minDate) {
                                this._selectDate(newDate, 'key');
                            }
                        }
                        return false;
                    case 38:
                        var newDate = new Date(selectedDate.getFullYear(), month - 4, 1);
                        if (newDate < minDate) {
                            newDate = minDate;
                        }

                        if (month - 4 < 0) {
                            this.selectedDate = newDate;
                            this.navigateBackward();
                        }
                        else {
                            this._selectDate(newDate, 'key');
                        }
                        return false;
                    case 40:
                        // down
                        var newDate = new Date(selectedDate.getFullYear(), month + 4, 1);
                        if (newDate > maxDate) {
                            newDate = maxDate;
                        }

                        if (month + 4 > 11) {
                            this.selectedDate = newDate;
                            this.navigateForward();
                        }
                        else {
                            this._selectDate(newDate, 'key');
                        }

                        return false;
                    case 39:
                        if (month == 11) {
                            var newDate = new Date(selectedDate.getFullYear() + 1, 0, 1);
                            if (newDate <= maxDate) {
                                this.selectedDate = newDate;
                                this.navigateForward();
                            }
                            else {
                                if (this.selectedDate != maxDate) {
                                    this.selectedDate = maxDate;
                                    this.navigateForward();
                                }
                            }
                        }
                        else {
                            var newDate = new Date(selectedDate.getFullYear(), month + 1, 1);
                            if (newDate <= maxDate) {
                                this._selectDate(newDate, 'key');
                            }
                        }
                        // next
                        return false;
                }
                return true;
            }

            if (this.view == "decade") {
                var startYear = this._renderStartDate.getFullYear();
                var endYear = this._renderEndDate.getFullYear();
                var fullYear = selectedDate.getFullYear();
                var minYear = this.getMinDate().getFullYear();
                var maxYear = this.getMaxDate().getFullYear();

                switch (key) {
                    case 37:
                        // previous
                        if (fullYear - 1 >= minYear) {
                            if (fullYear <= startYear) {
                                this.selectedDate = new Date(fullYear - 1, selectedDate.getMonth(), 1);
                                this.navigateBackward();
                            }
                            else {
                                this._selectDate(new Date(fullYear - 1, selectedDate.getMonth(), 1), 'key');
                            }
                        }
                        return false;
                    case 38:
                        // up
                        var newYear = fullYear - 4;
                        if (fullYear - 4 < minYear) newYear = minYear;

                        if (newYear < startYear) {
                            this.selectedDate = new Date(newYear, selectedDate.getMonth(), 1);
                            this.navigateBackward();
                        }
                        else {
                            this._selectDate(new Date(newYear, selectedDate.getMonth(), 1), 'key');
                        }
                        return false;
                    case 40:
                        // down
                        var newYear = fullYear + 4;
                        if (newYear > maxYear) newYear = maxYear;

                        if (newYear > endYear) {
                            this.selectedDate = new Date(newYear, selectedDate.getMonth(), 1);
                            this.navigateForward();
                        }
                        else {
                            this._selectDate(new Date(newYear, selectedDate.getMonth(), 1), 'key');
                        }

                        return false;
                    case 39:
                        // next
                        if (fullYear + 1 <= maxYear) {
                            if (fullYear == endYear) {
                                this.selectedDate = new Date(fullYear + 1, selectedDate.getMonth(), 1);
                                this.navigateForward();
                            }
                            else {
                                this._selectDate(new Date(fullYear + 1, selectedDate.getMonth(), 1), 'key');
                            }
                        }
                        return false;
                }

                return true;
            }

            var date = new $.jqx._jqxDateTimeInput.getDateTime(selectedDate);
            var start = this.getViewStart();
            var end = this.getViewEnd();
            var oldDate = date;
            var monthInstance = $.data(this.element, "View" + this.element.id);
            if (monthInstance == undefined || monthInstance == null)
                return true;

            if (key == 36) {
                date._setDay(1);
                if (this._isDisabled(date.dateTime)) {
                    return false;
                }

                this._selectDate(date.dateTime, 'key');
                return false;
            }

            if (key == 35) {
                var maxDays = this.value._daysInMonth(this.value.year, this.value.month);
                date._setDay(maxDays);
                if (this._isDisabled(date.dateTime)) {
                    return false;
                }

                this._selectDate(date.dateTime, 'key');
                return false;
            }

            var step = 1;
            if (event.ctrlKey) step = 12;
            if (key == 34) {
                var res = this.navigateForward(step);
                if (res) {
                    date._addMonths(step);
                    if (this._isDisabled(date.dateTime)) {
                        return false;
                    }

                    this._selectDate(date.dateTime, 'key');
                }
                return false;
            }

            if (key == 33) {
                var res = this.navigateBackward(step);
                if (res) {
                    date._addMonths(-step);
                    if (this._isDisabled(date.dateTime)) {
                        return false;
                    }

                    this._selectDate(date.dateTime, 'key');
                }
                return false;
            }

            if (key == 38) {
                date._addDays(-7);
                if (date.dateTime < this.getMinDate())
                    return false;

                if (date.dateTime < start) {
                    var res = this.navigateBackward();
                    if (!res)
                        return false;
                }
                if (this._isDisabled(date.dateTime)) {
                    return false;
                }

                this._selectDate(date.dateTime, 'key');
                for (var i = 0; i < monthInstance.cells.length; i++) {
                    var cell = monthInstance.cells[i];
                    var cellDate = cell.getDate();
                    if (cell.isOtherMonth && cell.isSelected && cellDate <= date.dateTime) {
                        this.value.day = cellDate.getDate();
                        this.navigateBackward();
                        this._selectDate(date.dateTime, 'key');
                        break;
                    }
                }
                return false;
            }
            else if (key == 40) {
                date._addDays(7);
                if (date.dateTime > this.getMaxDate())
                    return false;

                if (date.dateTime > end) {
                    var res = this.navigateForward();
                    if (!res)
                        return false;
                }
                if (this._isDisabled(date.dateTime)) {
                    return false;
                }

                this._selectDate(date.dateTime, 'key');
                for (var i = 0; i < monthInstance.cells.length; i++) {
                    var cell = monthInstance.cells[i];
                    var cellDate = cell.getDate();
                    if (cell.isOtherMonth && cell.isSelected && cellDate >= date.dateTime) {
                        this.value.day = cellDate.getDate();
                        this.navigateForward();
                        this._selectDate(date.dateTime, 'key');
                        break;
                    }
                }

                return false;
            }

            if (key == 37) {
                date._addDays(-1);
                if (date.dateTime < this.getMinDate()) {
                    return false;
                }

                if (date.dateTime < start) {
                    var res = this.navigateBackward();
                    if (!res)
                        return false;
                }
                if (this._isDisabled(date.dateTime)) {
                    return false;
                }

                this._selectDate(date.dateTime, 'key');
                for (var i = 0; i < monthInstance.cells.length; i++) {
                    var cell = monthInstance.cells[i];
                    var cellDate = cell.getDate();
                    if (cell.isOtherMonth && cell.isSelected && cellDate <= date.dateTime) {
                        if (date.dateTime < this.getMinDate() || date.dateTime > this.getMaxDate()) {
                            return false;
                        }
                        if (this._isDisabled(date.dateTime)) {
                            return false;
                        }

                        this.navigateBackward();
                        this._selectDate(date.dateTime, 'key');
                        break;
                    }
                }

                return false;
            }
            else if (key == 39) {
                date._addDays(1);
                if (date.dateTime > this.getMaxDate()) {
                    return false;
                }

                if (date.dateTime > end) {
                    var res = this.navigateForward();
                    if (!res)
                        return false;
                }
                if (this._isDisabled(date.dateTime)) {
                    return false;
                }

                this._selectDate(date.dateTime, 'key');
                for (var i = 0; i < monthInstance.cells.length; i++) {
                    var cell = monthInstance.cells[i];
                    var cellDate = cell.getDate();
                    if (cell.isOtherMonth && cell.isSelected && cellDate >= date.dateTime) {
                        if (date.dateTime < this.getMinDate() || date.dateTime > this.getMaxDate()) {
                            return false;
                        }

                        this.navigateForward();
                        this._selectDate(date.dateTime, 'key');
                        break;
                    }
                }
                return false;
            }

            return true;
        },

        render: function () {
            if (!this.canRender) return;

            this.host.children().remove();
            var month = this._renderSingleCalendar("View" + this.element.id);
            var me = this;
            this.host.append(month);
        },

        // adds a special date to the calendar.
        // @param - Date.
        // @param - css class name(optional).
        // @param - string for the special date's tooltip(optional).
        addSpecialDate: function (date, className, tooltipContent) {
            if (this.multipleMonthRows == 1 && this.multipleMonthColumns == 1) {
                var specialDatesLength = this.specialDates.length;
                this.specialDates[specialDatesLength] = { Date: date, Class: className, Tooltip: tooltipContent };

                this.refreshControl();
            }
        },

        refresh: function (initialRefresh) {
            this.render();
        },

        invalidate: function () {
            this.refreshControl();
        },

        refreshControl: function () {
            if (this.multipleMonthRows == 1 && this.multipleMonthColumns == 1) {
                this.refreshSingleCalendar("View" + this.element.id, null);
            }
        },

        // gets the view's start date.
        getViewStart: function () {
            var visibleDate = this.getVisibleDate();
            var firstDay = this.getFirstDayOfWeek(visibleDate);
            return firstDay.dateTime;
        },

        // gets the view's end date.
        getViewEnd: function () {
            var start = this.getViewStart();
            var end = new $.jqx._jqxDateTimeInput.getDateTime(start);
            end._addDays(41);
            return end.dateTime;
        },

        refreshSingleCalendar: function (calendarID, parent) {
            if (!this.canRender) return;
            var month = this.host.find("#" + calendarID);
            var visibleDate = this.getVisibleDate();
            var firstDay = this.getFirstDayOfWeek(visibleDate);

            this.refreshCalendarCells(month, firstDay, calendarID);
            this.refreshTitle(month);
            this.refreshRowHeader(month, calendarID);
            if (this.selectedDate != undefined) {
                this._selectDate(this.selectedDate);
            }
            var contentHeight = this.host.height() - this.titleHeight - this.columnHeaderHeight;
            if (!this.showDayNames) {
                contentHeight = this.host.height() - this.titleHeight;
            }
            if (this.showFooter) {
                contentHeight -= 20;
            }

            var cellsTableElement = month.find("#cellsTable" + calendarID);
            var rowHeaderElement = month.find("#calendarRowHeader" + calendarID);
            cellsTableElement.height(contentHeight);
            rowHeaderElement.height(contentHeight);
        },

        refreshRowHeader: function (month, calendarID) {
            if (!this.showWeekNumbers)
                return;

            var visibleDate = this.getVisibleDate();
            var firstDay = this.getFirstDayOfWeek(visibleDate);
            var dayOfWeek = firstDay.dayOfWeek;
            var weekOfYear = this.getWeekOfYear(firstDay);
            var newDate = new $.jqx._jqxDateTimeInput.getDateTime(new Date(firstDay.dateTime));
            newDate._addDays(5);
            newDate.dayOfWeek = newDate.dateTime.getDay();
            var newWeekOfYear = this.getWeekOfYear(newDate);

            var rowHeader = this.rowHeader.find('table');

            rowHeader.width(this.rowHeaderWidth);
            //   month.find("#calendarRowHeader" + month[0].id).append(rowHeader);
            var currentDate = firstDay;
            var rowHeaderCells = new Array();

            for (var i = 0; i < 6; i++) {
                var weekString = weekOfYear.toString();
                var cell = new $.jqx._jqxCalendar.cell(currentDate.dateTime);
                var cellID = i + 1 + this.element.id;
                var cellElement = $(rowHeader[0].rows[i].cells[0]);
                cell.element = cellElement;
                cell.row = i;
                cell.column = 0;
                var cellContent = cellElement.find("#headerCellContent" + cellID);
                cellContent.addClass(this.toThemeProperty('jqx-calendar-row-cell'));
                cellContent[0].innerHTML = weekOfYear;
                rowHeaderCells[i] = cell;
                currentDate = new $.jqx._jqxDateTimeInput.getDateTime(new Date(currentDate._addWeeks(1)));
                weekOfYear = this.getWeekOfYear(currentDate);
            }

            var monthInstance = $.data(this.element, month[0].id);
            monthInstance.rowCells = rowHeaderCells;
            this._refreshOtherMonthRows(monthInstance, calendarID);
        },

        _refreshOtherMonthRows: function (month, calendarID) {
            if (this.showOtherMonthDays)
                return;

            this._displayLastRow(true, calendarID);
            this._displayFirstRow(true, calendarID);

            var canDisplayFirstRow = false;
            var canDisplayLastRow = false;

            for (var i = 0; i < month.cells.length; i++) {
                var cell = month.cells[i];
                if (cell.isVisible && i < 7) {
                    canDisplayFirstRow = true;
                }
                else if (cell.isVisible && i >= month.cells.length - 7) {
                    canDisplayLastRow = true;
                }
            }

            if (!canDisplayFirstRow) {
                this._displayFirstRow(false, calendarID);
            }

            if (!canDisplayLastRow) {
                this._displayLastRow(false, calendarID);
            }
        },

        _displayLastRow: function (show, calendarID) {
            var month = this.host.find("#" + calendarID);
            var calendarRowHeader = month.find("#calendarRowHeader" + month[0].id).find('table');
            var lastRow = null;
            if (this.showWeekNumbers) {
                if (calendarRowHeader[0].cells) {
                    var lastRow = $(calendarRowHeader[0].rows[5]);
                }
            }
            var lastMonthRow = $(month.find("#cellTable" + month[0].id)[0].rows[5]);
            if (show) {
                if (this.showWeekNumbers && lastRow) {
                    lastRow.css('display', 'table-row');
                }
                lastMonthRow.css('display', 'table-row');
            }
            else {
                if (this.showWeekNumbers && lastRow) {
                    lastRow.css('display', 'none');
                }
                lastMonthRow.css('display', 'none');
            }
        },

        _displayFirstRow: function (show, calendarID) {
            var month = this.host.find("#" + calendarID);
            var calendarRowHeader = month.find("#calendarRowHeader" + month[0].id).find('table');
            var firstRow = null;
            if (this.showWeekNumbers) {
                if (calendarRowHeader[0].cells) {
                    var firstRow = $(calendarRowHeader[0].rows[0]);
                }
            }
            var firstMonthRow = $(month.find("#cellTable" + month[0].id)[0].rows[0]);

            if (show) {
                if (this.showWeekNumbers && firstRow) {
                    firstRow.css('display', 'table-row');
                }
                firstMonthRow.css('display', 'table-row');
            }
            else {
                if (this.showWeekNumbers && firstRow) {
                    firstRow.css('display', 'none');
                }
                firstMonthRow.css('display', 'none');
            }
        },

        _renderSingleCalendar: function (calendarID, parent) {
            if (!this.canRender) return;

            var oldMonthElement = this.host.find("#" + calendarID.toString());
            if (oldMonthElement != null) {
                oldMonthElement.remove();
            }

            var month = $("<div id='" + calendarID.toString() + "'></div>");

            var visibleDate = this.getVisibleDate();
            var firstDay = this.getFirstDayOfWeek(visibleDate);
            var endDay = new $.jqx._jqxDateTimeInput.getDateTime(firstDay.dateTime);
            endDay._addMonths(1);

            var monthInstance = $.jqx._jqxCalendar.monthView(firstDay, endDay, null, null, null, month);

            if (parent == undefined || parent == null) {
                this.host.append(month);

                if (this.height != undefined && !isNaN(this.height)) {
                    month.height(this.height);
                }
                else if (this.height != null && this.height.toString().indexOf("px") != -1) {
                    month.height(this.height);
                }

                if (this.width != undefined && !isNaN(this.width)) {
                    month.width(this.width);
                }
                else if (this.width != null && this.width.toString().indexOf("px") != -1) {
                    month.width(this.width);
                }

                if (this.width != null && this.width.toString().indexOf("%") != -1) {
                    month.width('100%');
                }
                if (this.height != null && this.height.toString().indexOf("%") != -1) {
                    month.height('100%');
                }
            }
            else parent.append(month);

            $.data(this.element, calendarID, monthInstance);

            var contentHeight = this.host.height() - this.titleHeight - this.columnHeaderHeight;
            if (!this.showDayNames) {
                contentHeight = this.host.height() - this.titleHeight;
            }
            if (this.showFooter) {
                contentHeight -= 20;
            }

            if (this.rowHeaderWidth < 0) this.rowHeaderWidth = 0;
            if (this.columnHeaderHeight < 0) this.columnHeaderHeight = 0;
            if (this.titleHeight < 0) this.titleHeight = 0;

            var rowHeaderWidth = this.rowHeaderWidth;
            var columnHeaderHeight = this.columnHeaderHeight;

            if (!this.showWeekNumbers) {
                rowHeaderWidth = 0;
            }

            if (!this.showDayNames) {
                columnHeaderHeight = 0;
            }


            var title = "<div style='height:" + this.titleHeight + "px;'><table role='grid' style='margin: 0px; width: 100%; height: 100%; border-spacing: 0px;' cellspacing='0' cellpadding='0'><tr role='row' id='calendarTitle' width='100%'>" +
               "<td role='gridcell' NOWRAP id='leftNavigationArrow'></td>" + "<td aria-live='assertive' aria-atomic='true' role='gridcell' align='center' NOWRAP id='calendarTitleHeader'></td>" + "<td role='gridcell' NOWRAP id='rightNavigationArrow'></td>" +
               "</tr></table></div>";

            var monthStructure = "<table role='grid' class='" + this.toThemeProperty('jqx-calendar-month') + "' style='margin: 0px; border-spacing: 0px;' cellspacing='0' cellpadding='0'>" +
               "<tr role='row' id='calendarHeader' height='" + columnHeaderHeight + "'>" +
               "<td role='gridcell' id='selectCell' width='" + rowHeaderWidth + "'></td>" + "<td role='gridcell' colspan='2' style='border: none; padding-left: 2px; padding-right: 2px' id='calendarColumnHeader'></td>" +
               "</tr>" +
               "<tr role='row' id='calendarContent'>" +
               "<td role='gridcell' id='calendarRowHeader' valign='top' height='" + contentHeight + "' width='" + rowHeaderWidth + "'></td>" + "<td role='gridcell' valign='top' colspan='2' style='padding-left: 2px; padding-right: 2px' id='cellsTable' height='" + contentHeight + "'></td>" +
               "</tr>" +
               "</table>"

            var footer = "<div id='footer' style='margin: 0px; display: none; height:" + footerHeight + "px;'><table style='width: 100%; height: 100%; border-spacing: 0px;' cellspacing='0' cellpadding='0'>" +
            "<tr id='calendarFooter'>" +
            "<td align='right' id='todayButton'></td>" + "<td align='left' colspan='2' id=doneButton></td>" +
            "</tr>" + "</table></div>";


            month[0].innerHTML = title + monthStructure + footer;
            this.header = month.find('#calendarHeader');
            this.header[0].id = 'calendarHeader' + calendarID;
            this.header.addClass(this.toThemeProperty('calendar-header'));
            this.columnHeader = month.find('#calendarColumnHeader');
            this.columnHeader[0].id = 'calendarColumnHeader' + calendarID;
            this.table = month.find('#cellsTable');
            this.table[0].id = 'cellsTable' + calendarID;
            this.rowHeader = month.find('#calendarRowHeader');
            this.rowHeader[0].id = 'calendarRowHeader' + calendarID;
            this.selectCell = month.find('#selectCell');
            this.selectCell[0].id = 'selectCell' + calendarID;
            this.title = month.find('#calendarTitle');
            this.title[0].id = 'calendarTitle' + calendarID;
            this.leftButton = month.find('#leftNavigationArrow');
            this.leftButton[0].id = 'leftNavigationArrow' + calendarID;
            this.titleHeader = month.find('#calendarTitleHeader');
            this.titleHeader[0].id = 'calendarTitleHeader' + calendarID;
            this.rightButton = month.find('#rightNavigationArrow');
            this.rightButton[0].id = 'rightNavigationArrow' + calendarID;
            this.footer = month.find('#calendarFooter');
            this._footer = month.find('#footer');
            this._footer[0].id = 'footer' + calendarID
            this.footer[0].id = 'calendarFooter' + calendarID;
            this.todayButton = month.find('#todayButton');
            this.todayButton[0].id = 'todayButton' + calendarID;
            this.doneButton = month.find('#doneButton');
            this.doneButton[0].id = 'doneButton' + calendarID;

            this.title.addClass(this.toThemeProperty('jqx-calendar-title-container'));
            var footerHeight = 20;

            if (this.showFooter) {
                this._footer.css('display', 'block');
            }

            //  month.find('td').css({ padding: 0, margin: 0, border: 'none' });
            month.find('tr').addClass(this.toThemeProperty('jqx-reset'));
            month.addClass(this.toThemeProperty("jqx-widget-content"));
            month.addClass(this.toThemeProperty("jqx-calendar-month-container"));
            this.month = month;
            this.selectCell.addClass(this.toThemeProperty('jqx-reset'));
            this.selectCell.addClass(this.toThemeProperty('jqx-calendar-top-left-header'));

            if (this.showWeekNumbers) {
                this._renderRowHeader(month);
            }
            else {
                this.table[0].colSpan = 3;
                this.columnHeader[0].colSpan = 3;
                this.rowHeader.css('display', 'none');
                this.selectCell.css('display', 'none');
            }

            if (this.showFooter) {
                this.footer.height(20);
                var todayLink = $("<a href='javascript:;'>" + this.todayString + "</a>");
                todayLink.appendTo(this.todayButton);
                var clearLink = $("<a href='javascript:;'>" + this.clearString + "</a>");
                clearLink.appendTo(this.doneButton);
                clearLink.addClass(this.toThemeProperty('jqx-calendar-footer'));
                todayLink.addClass(this.toThemeProperty('jqx-calendar-footer'));
                var self = this;

                var eventName = "mousedown";
                if ($.jqx.mobile.isTouchDevice()) {
                    eventName = $.jqx.mobile.getTouchEventName('touchstart');
                }

                this.addHandler(todayLink, eventName, function () {
                    if (self.today) {
                        self.today();
                    }
                    else {
                        self.setDate(new Date(), 'mouse');
                    }
                    return false;
                });
                this.addHandler(clearLink, eventName, function () {
                    if (self.clear) {
                        self.clear();
                    }
                    else {
                        self.setDate(null, 'mouse');
                    }
                    return false;
                });
            }

            if (this.view != "month") {
                this.header.hide();
            }

            if (this.showDayNames && this.view == "month") {
                this.renderColumnHeader(month);
            }

            this.oldView = this.view;
            this.renderCalendarCells(month, firstDay, calendarID)
            if (parent == undefined || parent == null) {
                this.renderTitle(month);
            }
            this._refreshOtherMonthRows(monthInstance, calendarID);
            month.find('tbody').css({ border: 'none', background: 'transparent' });
            if (this.selectedDate != undefined) {
                this._selectDate(this.selectedDate);
            }

            var me = this;
            this.addHandler(this.host, 'focus', function () {
                me.focus();
            });

            return month;
        },

        _getTitleFormat: function () {
            switch (this.view) {
                case 'month':
                    return this.titleFormat[0];
                case 'year':
                    return this.titleFormat[1];
                case 'decade':
                    return this.titleFormat[2];
                case 'centuries':
                    return this.titleFormat[3];
            }
        },

        renderTitle: function (month) {
            var leftArrow = $("<div role='button' style='float: left;'></div>");
            var rightArrow = $("<div role='button' style='float: right;'></div>");
            var titleElement = this.title;
            titleElement.addClass(this.toThemeProperty("jqx-reset"));
            titleElement.addClass(this.toThemeProperty("jqx-widget-header"));
            titleElement.addClass(this.toThemeProperty("jqx-calendar-title-header"));
            var titleCells = titleElement.find('td');

            if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                if (titleCells.css('background-color') != 'transparent') {
                    var bgColor = titleElement.css('background-color');
                    titleCells.css('background-color', bgColor);
                }
                if (titleCells.css('background-image') != 'transparent') {
                    var bgImage = titleElement.css('background-image');
                    var bgRepeat = titleElement.css('background-repeat');
                    var bgPosition = titleElement.css('background-position');

                    titleCells.css('background-image', bgImage);
                    titleCells.css('background-repeat', bgRepeat);
                    titleCells.css('background-position', 'left center scroll');
                }
            }
            else {
                titleCells.css('background-color', 'transparent');
            }

            if (this.disabled) {
                titleElement.addClass(this.toThemeProperty("jqx-calendar-title-header-disabled"));
            }

            leftArrow.addClass(this.toThemeProperty("jqx-calendar-title-navigation"));
            leftArrow.addClass(this.toThemeProperty("jqx-icon-arrow-left"));
            leftArrow.appendTo(this.leftButton);
            var leftArrowElement = this.leftButton;

            rightArrow.addClass(this.toThemeProperty("jqx-calendar-title-navigation"));
            rightArrow.addClass(this.toThemeProperty("jqx-icon-arrow-right"));
            rightArrow.appendTo(this.rightButton);
            var rightArrowElement = this.rightButton;

            if (this.enableTooltips) {
                if ($(leftArrowElement).jqxTooltip) {
                    $(leftArrowElement).jqxTooltip({ name: this.element.id, position: 'mouse', theme: this.theme, content: this.backText });
                    $(rightArrowElement).jqxTooltip({ name: this.element.id, position: 'mouse', theme: this.theme, content: this.forwardText });
                }
            }

            var titleHeader = this.titleHeader;
            var title = this._format(this.value.dateTime, this._getTitleFormat(), this.culture);
            if (this.view == "decade") {
                var startText = this._format(this._renderStartDate, this._getTitleFormat(), this.culture);
                var endText = this._format(this._renderEndDate, this._getTitleFormat(), this.culture);
                title = startText + " - " + endText;
            }
            else if (this.view == "centuries") {
                var startText = this._format(this._renderCenturyStartDate, this._getTitleFormat(), this.culture);
                var endText = this._format(this._renderCenturyEndDate, this._getTitleFormat(), this.culture);
                title = startText + " - " + endText;
            }

            var titleContent = $("<div style='background: transparent; margin: 0; padding: 0; border: none;'>" + title + "</div>");
            titleHeader.append(titleContent);
            titleContent.addClass(this.toThemeProperty('jqx-calendar-title-content'));

            var arrowWidth = parseInt(leftArrow.width());
            var headerWidth = month.width() - 2 * arrowWidth;
            var newContent = titleHeader.find(".jqx-calendar-title-content").width(headerWidth);

            $.data(leftArrow, 'navigateLeft', this);
            $.data(rightArrow, 'navigateRight', this);
            var isTouchDevice = $.jqx.mobile.isTouchDevice();

            if (!this.disabled) {
                var me = this;
                this.addHandler(titleHeader, 'mousedown',
                function (event) {
                    if (me.enableViews) {
                        if (!me._viewAnimating && !me._animating) {
                            var oldView = me.view;
                            me.oldView = oldView;
                            switch (me.view) {
                                case 'month':
                                    me.view = "year";
                                    break;
                                case 'year':
                                    me.view = "decade";
                                    break;
                            }
                            if (me.views.indexOf("year") == -1 && me.view == "year") {
                                me.view = "decade";
                            }
                            if (me.views.indexOf("decade") == -1 && me.view == "decade") {
                                me.view = oldView;
                            }

                            if (oldView != me.view) {
                                var calendarID = "View" + me.element.id;
                                var month = me.host.find("#" + calendarID);
                                var visibleDate = me.getVisibleDate();
                                var firstDay = me.getFirstDayOfWeek(visibleDate);
                                me.renderCalendarCells(month, firstDay, calendarID, true);
                                me.refreshTitle(month);
                                me._raiseEvent('8');
                            }
                        }
                        return false;
                    }
                });

                this.addHandler(leftArrow, 'mousedown',
                function (event) {
                    if (!me._animating) {
                        $.data(leftArrow, 'navigateLeftRepeat', true);
                        var element = $.data(leftArrow, 'navigateLeft');
                        if (element.enableFastNavigation && !isTouchDevice) {
                            element.startRepeat(element, leftArrow, true, me.navigationDelay + 200);
                        }
                        element.navigateBackward(me.stepMonths, 'arrow');
                        event.stopPropagation();
                        event.preventDefault();
                        return element._raiseEvent(0, event)
                    }
                    else return false;
                });

                this.addHandler(leftArrow, 'mouseup',
                function (event) {
                    $.data(leftArrow, 'navigateLeftRepeat', false);
                });

                this.addHandler(leftArrow, 'mouseleave',
                function (event) {
                    $.data(leftArrow, 'navigateLeftRepeat', false);
                });

                this.addHandler(rightArrow, 'mousedown',
                function (event) {
                    if (!me._animating) {
                        $.data(rightArrow, 'navigateRightRepeat', true);
                        var element = $.data(rightArrow, 'navigateRight')

                        if (element.enableFastNavigation && !isTouchDevice) {
                            element.startRepeat(element, rightArrow, false, me.navigationDelay + 200);
                        }
                        element.navigateForward(me.stepMonths, 'arrow');
                        event.stopPropagation();
                        event.preventDefault();
                        return element._raiseEvent(1, event)
                    }
                    else return false;
                });

                this.addHandler(rightArrow, 'mouseup',
                function (event) {
                    $.data(rightArrow, 'navigateRightRepeat', false);
                });

                this.addHandler(rightArrow, 'mouseleave',
                function (event) {
                    $.data(rightArrow, 'navigateRightRepeat', false);
                });
            }
        },

        refreshTitle: function (month) {
            var title = this._format(this.value.dateTime, this._getTitleFormat(), this.culture);
            if (this.view == "decade") {
                var startText = this._format(this._renderStartDate, this._getTitleFormat(), this.culture);
                var endText = this._format(this._renderEndDate, this._getTitleFormat(), this.culture);
                title = startText + " - " + endText;
            }
            else if (this.view == "centuries") {
                var startText = this._format(this._renderCenturyStartDate, this._getTitleFormat(), this.culture);
                var endText = this._format(this._renderCenturyEndDate, this._getTitleFormat(), this.culture);
                title = startText + " - " + endText;
            }
            var titleHeader = this.titleHeader;
            if (this.titleHeader) {
                var oldContent = titleHeader.find(".jqx-calendar-title-content");

                var titleContent = $("<div style='background: transparent; margin: 0; padding: 0; border: none;'>" + title + "</div>");
                titleHeader.append(titleContent);
                titleContent.addClass(this.toThemeProperty('jqx-calendar-title-content'));

                if (oldContent != null) {
                    oldContent.remove();
                }
            }
        },

        startRepeat: function (element, navigationElement, isLeft, timeout) {
            var timeoutobj = window.setTimeout(function () {
                var value = $.data(navigationElement, 'navigateLeftRepeat');
                if (!isLeft) {
                    value = $.data(navigationElement, 'navigateRightRepeat');
                }

                if (value) {
                    if (timeout < 25) timeout = 25;

                    if (isLeft) {
                        element.navigateBackward(1, 'arrow');
                        element.startRepeat(element, navigationElement, true, timeout);
                    }
                    else {
                        element.navigateForward(1, 'arrow');
                        timeoutobj = element.startRepeat(element, navigationElement, false, timeout);
                    }
                }
                else {
                    window.clearTimeout(timeoutobj);
                    return;
                }
            }, timeout);
        },

        // navigates (n) month(s) forward.
        // @param - Date
        navigateForward: function (step, type) {
            if (step == undefined || step == null) {
                step = this.stepMonths;
            }
            var year = this.value.year;
            if (this.view == 'decade') {
                year = this._renderStartDate.getFullYear() + 12;
                if (this._renderEndDate.getFullYear() >= this.getMaxDate().getFullYear())
                    return;

            }
            else if (this.view == "year") {
                year = this.value.year + 1;
            }
            else if (this.view == "centuries") {
                year = this.value.year + 100;
            }

            if (this.view != "month") {
                var maxYear = this.getMaxDate().getFullYear();
                if (maxYear < year || year > maxYear) {
                    year = maxYear;
                }
                if (this.value.year == year) {
                    if (this.view === "decade") {
                        if (this.value.year > this._renderEndDate.getFullYear()) {
                            this.value.year = year;
                            this.value.month = 1;
                            this.value.day = 1;
                        }
                        else {
                            return;
                        }
                    }
                    else {
                        return;
                    }
                }

                this.value.year = year;
                this.value.month = 1;
                this.value.day = 1;
            }

            var day = this.value.day;
            var month = this.value.month;
            if (month + step <= 12) {
                var maxDays = this.value._daysInMonth(this.value.year, this.value.month + step);
                if (day > maxDays)
                    day = maxDays;
            }

            if (this.view == "month") {
                var date = new Date(this.value.year, this.value.month - 1 + step, day);
                if (type == 'arrow' && this.selectableDays.length == 7 && this.selectionMode != "range") {
                    this.selectedDate = new Date(this.value.year, this.value.month - 1 + step, 1);
                }
            }
            else {
                var date = new Date(this.value.year, this.value.month - 1, day)
            }

            return this.navigateTo(date);
        },

        // navigates (n) month(s) back.
        // @param - Number  
        navigateBackward: function (step, type) {
            if (step == undefined || step == null) {
                step = this.stepMonths;
            }

            var year = this.value.year;
            if (this.view == 'decade') {
                year = this._renderStartDate.getFullYear() - 12;
            }
            else if (this.view == "year") {
                year = this.value.year - 1;
            }
            else if (this.view == "centuries") {
                year = this.value.year - 100;
            }

            if (this.view != "month") {
                var minYear = this.getMinDate().getFullYear();
                if (year < minYear) year = minYear;
                if (this.view == "decade") {
                    if (this._renderStartDate) {
                        if (this._renderStartDate.getFullYear() == year) {
                            return;
                        }
                    }
                }

                // if (this.value.year == year) return;
                this.value.year = year;
                this.value.month = 1;
                this.value.day = 1;
            }

            var day = this.value.day;
            var month = this.value.month;
            if (month - step >= 1) {
                var maxDays = this.value._daysInMonth(this.value.year, this.value.month - step);
                if (day > maxDays)
                    day = maxDays;
            }

            if (this.view == 'month') {
                var date = new Date(this.value.year, this.value.month - 1 - step, day);
                if (type == 'arrow' && this.selectableDays.length == 7 && this.selectionMode != "range") {
                    this.selectedDate = new Date(this.value.year, this.value.month - 1 - step, 1);
                }
            }
            else {
                var date = new Date(this.value.year, this.value.month - 1, day);
            }

            return this.navigateTo(date);
        },

        _isRestrictedRange: function (from, to) {
            if (from > to)
                return true;

            var curr = from;
            while (curr.valueOf() <= to.valueOf()) {
                if (this._isRestrictedDate(curr))
                    return true;

                curr.setDate(curr.getDate() + 1);
            }

            return false;
        },

        _hasUnrestrictedRanges: function (from, to) {
            if (from > to)
                return false;

            var curr = from;
            while (curr.valueOf() <= to.valueOf()) {
                if (!this._isRestrictedDate(curr))
                    return true;

                curr.setDate(curr.getDate() + 1);
            }

            return false;
        },

        _getNextUnrestrictedDay: function (from, to) {
            if (from > to)
                return null;

            var curr = from;
            while (curr.valueOf() <= to.valueOf()) {
                if (!this._isRestrictedDate(curr))
                    return curr;

                curr.setDate(curr.getDate() + 1);
            }

            return null;
        },

        _isRestrictedDate: function (date) {
            var self = this;
            if (!$.isArray(self.restrictedDates))
                return false;

            for (var i = 0; i < self.restrictedDates.length; i++) {
                var dateCompare = self.restrictedDates[i];

                if (typeof (dateCompare) == 'object' && dateCompare.from != undefined && dateCompare.to != undefined) {
                    var dateCompareFrom = dateCompare.from;
                    var dateCompareTo = dateCompare.to;

                    if (date.valueOf() >= dateCompareFrom.valueOf() && date.valueOf() <= dateCompareTo.valueOf()) {
                        return true;
                    }
                }
                else {
                    if (dateCompare.getMonth() == date.getMonth() &&
                        dateCompare.getDate() == date.getDate() &&
                        dateCompare.getFullYear() == date.getFullYear()
                    ) {
                        return true;
                    }
                }
            }

            return false;
        },

        _isDisabled: function (date) {
            var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var day = date.getDay();
            var name = dayNames[day];
            if (this.selectableDays.indexOf(name) == -1)
                return true;

            if (this._isRestrictedDate(date))
                return true;

            return false;
        },

        refreshCalendarCells: function (month, firstDay, calendarID) {
            if (this.view == "year" || this.view == "decade" || this.view == 'centuries') {
                this.refreshViews(month, firstDay, calendarID);
                return;
            }
            var tableElement = this.table;
            var cellsTable = tableElement.find("#" + 'cellTable' + calendarID.toString());
            var currentDate = firstDay;
            var cells = new Array();
            var k = 0;
            var today = new $.jqx._jqxDateTimeInput.getDateTime(new Date());

            for (var i = 0; i < 6; i++) {
                for (var j = 0; j < 7; j++) {
                    var cellRowID = i + 1;
                    var r = j;
                    if (this.rtl) r = 6 - r;
                    var cellColumnID = r + 1;
                    var cellID = "#cell" + cellRowID + cellColumnID + this.element.id;
                    var date = new Date(currentDate.dateTime.getFullYear(), currentDate.dateTime.getMonth(), currentDate.dateTime.getDate());
                    var cell = new $.jqx._jqxCalendar.cell(date);
                    var cellElement = $(cellsTable[0].rows[i].cells[cellColumnID - 1]);
                    cellElement[0].id = cellID.substring(1);

                    cell.element = cellElement;
                    cell.row = i;
                    cell.column = j;

                    cell.isVisible = true;
                    cell.isOtherMonth = false;
                    cell.isToday = false;
                    cell.isWeekend = false;
                    cell.isHighlighted = false;
                    cell.isSelected = false;

                    if (currentDate.month != this.value.month) {
                        cell.isOtherMonth = true;
                        cell.isVisible = this.showOtherMonthDays;
                    }

                    if (this._isRestrictedDate(date)) {
                        cell.isRestricted = true;
                        cell.isDisabled = true;
                    }

                    if (!cell.isDisabled) {
                        if (date < this.getMinDate() || date > this.getMaxDate() || this._isDisabled(date)) {
                            cell.isDisabled = true;
                        }
                    }

                    if (currentDate.month == today.month && currentDate.day == today.day && currentDate.year == today.year) {
                        cell.isToday = true;
                    }

                    if (currentDate.isWeekend()) {
                        cell.isWeekend = true;
                    }

                    $.data(this.element, "cellContent" + cellID.substring(1), cell);
                    $.data(this.element, cellID.substring(1), cell);
                    cells[k] = cell;
                    k++;
                    $.jqx.utilities.html(cellElement, currentDate.day);

                    this._applyCellStyle(cell, cellElement, cellElement);

                    currentDate = new $.jqx._jqxDateTimeInput.getDateTime(new Date(currentDate._addDays(1)));
                }
            }

            var monthInstance = $.data(this.element, month[0].id);
            if (monthInstance != undefined && monthInstance != null) {
                monthInstance.cells = cells;
            }
            this.renderedCells = cells;
            this._refreshOtherMonthRows(monthInstance, calendarID);
        },

        _getDecadeAndCenturiesData: function () {
            var renderYears = new Array();
            var renderDates = new Array();
            var length = this.getMaxDate().getFullYear() - this.getMinDate().getFullYear();
            if (length < 12) length = 12;
            var minDate = this.getMinDate();
            var maxDate = this.getMaxDate();
            var currentYear = this.value.dateTime.getFullYear();

            if (this.view == "decade") {
                if (currentYear + 12 > maxDate.getFullYear()) {
                    currentYear = maxDate.getFullYear() - 11;
                }
                if (currentYear < minDate.getFullYear()) {
                    currentYear = minDate.getFullYear();
                }
                for (var i = 0; i < length; i++) {
                    var date = new Date(minDate.getFullYear() + i, 0, 1);
                    if (minDate.getFullYear() <= currentYear && currentYear <= date.getFullYear()) {
                        var renderStartDate = new Date(date.getFullYear(), date.getMonth(), 1);

                        for (var j = 0; j < 12; j++) {
                            var newDate = new Date(renderStartDate.getFullYear() + j, this.value.dateTime.getMonth(), this.value.dateTime.getDate());
                            var year = newDate.getFullYear();

                            if (minDate.getFullYear() <= year && year <= maxDate.getFullYear()) {
                                renderYears.push(year);
                                renderDates.push(newDate);
                                if (j == 0) {
                                    this._renderStartDate = newDate;
                                }
                                this._renderEndDate = newDate;
                            }
                            else {
                                renderYears.push(year);
                                renderDates.push(newDate);
                            }

                        }

                        break;
                    }
                }
            }
            else if (this.view == "centuries") {
                for (var i = 0; i < length; i += 120) {
                    var date = new Date(minDate.getFullYear() + i + 120, 0, 1);

                    if (minDate.getFullYear() <= currentYear && currentYear <= date.getFullYear()) {
                        var renderStartDate = new Date(date.getFullYear() - 130, date.getMonth(), 1);

                        if (renderStartDate < minDate) {
                            renderStartDate = minDate;
                        }

                        for (var j = 0; j < 12; j++) {
                            var centuriesDate = new Date(renderStartDate.getFullYear() + j * 10, renderStartDate.getMonth(), 1);
                            if (renderStartDate.getFullYear() >= minDate.getFullYear() && centuriesDate.getFullYear() <= maxDate.getFullYear()) {
                                renderYears.push("<span style='visibility: hidden;'>-</span>" + centuriesDate.getFullYear() + "-" + (centuriesDate.getFullYear() + 9));
                                renderDates.push(centuriesDate);
                                if (j == 0) {
                                    this._renderCenturyStartDate = centuriesDate;
                                }
                                this._renderCenturyEndDate = new Date(centuriesDate.getFullYear() + 9, 0, 1);
                            }
                        }
                        break;
                    }
                }
            }
            return { years: renderYears, dates: renderDates };
        },

        refreshViews: function (month, firstDay, calendarID) {
            var me = this;
            var cells = new Array();
            var cellsTable = month.find('#cellTable' + calendarID.toString());

            var data = this._getDecadeAndCenturiesData();
            var renderYears = data.years;
            var renderDates = data.dates;

            var k = 0;
            var minDate = this.getMinDate();
            var maxDate = this.getMaxDate();

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 4; j++) {
                    var cellRowID = i + 1;
                    var r = j;
                    if (this.rtl) r = 3 - r;
                    var cellColumnID = r + 1;
                    var date = new Date(this.value.dateTime);
                    date.setDate(1);
                    date.setMonth(i * 4 + r);
                    var cell = new $.jqx._jqxCalendar.cell(date);
                    var row = cellsTable[0].rows["row" + (1 + i) + this.element.id];
                    var cellElement = $(row.cells[j]);

                    cell.isSelected = false;
                    cell.isVisible = true;
                    cell.element = cellElement;
                    cell.row = i;
                    cell.column = j;
                    cell.index = cells.length;
                    var text = "";
                    if (this.view == "year") {
                        var monthNames = this.localization.calendar.months.names;
                        var monthString = monthNames[i * 4 + r];

                        // Possible values: default, shortest, firstTwoLetters, firstLetter, full
                        switch (this.monthNameFormat) {
                            case 'default':
                                monthString = this.localization.calendar.months.namesAbbr[i * 4 + r];
                                break;
                            case 'shortest':
                                monthString = this.localization.calendar.months.namesShort[i * 4 + r];
                                break;
                            case 'firstTwoLetters':
                                monthString = monthString.substring(0, 2);
                                break;
                            case 'firstLetter':
                                monthString = monthString.substring(0, 1);
                                break;
                        }
                        text = monthString;
                    }
                    else if (this.view == "decade" || this.view == "centuries") {
                        text = renderYears[i * 4 + r];
                        if (undefined == text) {
                            text = "<span style='cursor: default; visibility: hidden;'>2013</span>";
                        }
                        cell.setDate(renderDates[i * 4 + r]);
                    }
                    var date = cell.getDate();
                    if (this.view == "year") {
                        if (date.getMonth() == this.getDate().getMonth() && date.getFullYear() == this.getDate().getFullYear()) {
                            cell.isSelected = true;
                        }
                    }
                    else {
                        if (date.getFullYear() == this.getDate().getFullYear()) {
                            cell.isSelected = true;
                        }
                    }

                    if (this.view == "year") {
                        if (this._getYearAndMonthPart(date) < this._getYearAndMonthPart(minDate))
                            cell.isDisabled = true;
                        if (this._getYearAndMonthPart(date) > this._getYearAndMonthPart(maxDate))
                            cell.isDisabled = true;
                    }
                    else {
                        if (date.getFullYear() < minDate.getFullYear())
                            cell.isDisabled = true;
                        if (date.getFullYear() > maxDate.getFullYear())
                            cell.isDisabled = true;
                    }

                    $.jqx.utilities.html(cellElement, text);
                    cells[k] = cell;
                    k++;
                }
            }
            var monthInstance = $.data(this.element, month[0].id);
            if (monthInstance != undefined && monthInstance != null) {
                monthInstance.cells = cells;
            }
            this.renderedCells = cells;
            this._applyCellStyles();
        },

        _createViewClone: function () {
            var table = this.host.find('.jqx-calendar-month');
            var viewClone = table.clone();
            viewClone.css('position', 'absolute');
            viewClone.css('top', table.position().top);
            return viewClone;
        },

        _addCellsTable: function (tableElement, cellsTable) {
            var me = this;
            //            cellsTable.find('table').css({ background: 'none', padding: 0, margin: 0, border: 0 });
            //            cellsTable.find('td').css({ padding: 1, margin: 0 });
            //            cellsTable.find('tr').css({ background: 'none', padding: 0, margin: 0, border: 0 });

            var footerHeight = this.showFooter ? 20 : 0;
            if (this.view != "month") {
                cellsTable.height(this.host.height() - this.titleHeight);
            }
            else {
                cellsTable.height(this.host.height() - this.titleHeight - this.columnHeaderHeight - footerHeight);
            }

            this._viewAnimating = true;
            var container = this.host.find('.jqx-calendar-month-container');
            container.css('position', 'relative');
            var table = this.host.find('.jqx-calendar-month');
            var viewClone = this._createViewClone();
            container.append(viewClone);
            if (this.view != "month") {
                this.header.fadeOut(0);
                if (this.showWeekNumbers) {
                    this.rowHeader.fadeOut(0);
                }
                if (this.showFooter) {
                    this._footer.fadeOut(0);
                }
            }
            else {
                this.header.fadeIn(this.navigationDelay + 200);
                if (this.showWeekNumbers) {
                    this.rowHeader.fadeIn(this.navigationDelay + 200);
                }
                if (this.showFooter) {
                    this._footer.fadeIn(this.navigationDelay + 200);
                }
            }

            tableElement.children().remove();
            tableElement.append(cellsTable);

            this._animateViews(viewClone, cellsTable, function () {
                if (!me.selectedDate && me.selectionMode != "range") {
                    me.selectedDate = me.renderedCells[0].getDate();
                }
                try {
                    me.renderedCells[0].element.focus();
                    setTimeout(function () {
                        me.renderedCells[0].element.focus();
                    }, 10);
                }
                catch (error) {
                }

                me._viewAnimating = false;
            });

            cellsTable.addClass(this.toThemeProperty("jqx-calendar-view"));
        },

        _animateViews: function (view1, view2, callback) {
            var me = this;
            me._viewAnimating = true;

            if (me.oldView == me.view) {
                view1.remove();
                view2.fadeOut(0);
                view2.fadeIn(0);
                callback();
                return;
            }

            view1.fadeOut(this.navigationDelay + 100, function () {
                view1.remove();
            });
            view2.fadeOut(0);
            view2.fadeIn(this.navigationDelay + 200, function () {
                callback();
            });
        },

        focus: function () {
            if (this.disabled)
                return;

            try
            {
                if (this.renderedCells && this.renderedCells.length > 0) {
                    var me = this;
                    var focusChanged = false;
                    if (!me.selectedDate && me.selectionMode != 'range') {
                        this.setDate(new Date(), 'mouse');
                    }

                    this.element.focus();
                }
            }
            catch (error) {
            }
        },

        renderViews: function (month, firstDay, calendarID) {
            var me = this;
            var cells = new Array();
            var cellsTable = $("<table role='grid' style='border-color: transparent; width: 100%; height: 100%;' cellspacing='2' cellpadding='0' id=" + 'cellTable' + calendarID.toString() + ">" +
                 "<tr role='row' id='row1" + this.element.id + "'>" +
                 "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" +
                 "</tr>" +
                 "<tr role='row' id='row2" + this.element.id + "'>" +
                 "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" +
                 "</tr>" +
                 "<tr role='row' id='row3" + this.element.id + "'>" +
                 "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" +
                 "</tr>" +
                 "</table>"
             );

            var container = this.host.find('.jqx-calendar-month-container');
            container.css('position', 'relative');
            var tableElement = month.find("#cellsTable" + month[0].id);
            tableElement[0].style.borderColor = "transparent";

            var data = this._getDecadeAndCenturiesData();
            var renderYears = data.years;
            var renderDates = data.dates;
            var k = 0;
            var minDate = this.getMinDate();
            var maxDate = this.getMaxDate();
            var valueDate = new Date(this.value.dateTime);
            valueDate.setDate(1);

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 4; j++) {
                    var cellRowID = i + 1;
                    var r = j;
                    if (this.rtl) r = 3 - r;
                    var cellColumnID = r + 1;
                    var row = cellsTable[0].rows["row" + (1 + i) + this.element.id];
                    var date = new Date(valueDate);
                    date.setMonth(i * 4 + r);
                    var cell = new $.jqx._jqxCalendar.cell(date);
                    var cellElement = $(row.cells[j]);
                    cell.isVisible = true;
                    cell.element = cellElement;
                    cell.row = i;
                    cell.column = j;
                    cell.index = cells.length;
                    cell.isSelected = false;

                    var text = "";
                    if (this.view == "year") {
                        if (date.getMonth() == this.getDate().getMonth() && date.getFullYear() == this.getDate().getFullYear()) {
                            cell.isSelected = true;
                        }
                        var monthNames = this.localization.calendar.months.names;
                        var monthString = monthNames[i * 4 + r];

                        // Possible values: default, shortest, firstTwoLetters, firstLetter, full
                        switch (this.monthNameFormat) {
                            case 'default':
                                monthString = this.localization.calendar.months.namesAbbr[i * 4 + r];
                                break;
                            case 'shortest':
                                monthString = this.localization.calendar.months.namesShort[i * 4 + r];
                                break;
                            case 'firstTwoLetters':
                                monthString = monthString.substring(0, 2);
                                break;
                            case 'firstLetter':
                                monthString = monthString.substring(0, 1);
                                break;
                        }
                        text = monthString;
                    }
                    else if (this.view == "decade" || this.view == "centuries") {
                        text = renderYears[i * 4 + r];
                        cell.setDate(renderDates[i * 4 + r]);
                        if (cell.getDate().getFullYear() == this.getDate().getFullYear()) {
                            cell.isSelected = true;
                        }
                        if (undefined == text) {
                            text = "<span style='cursor: default; visibility: hidden;'>2013</span>";
                        }
                    }

                    var date = cell.getDate();
                    if (this.view == "year") {
                        var nextMonth = new Date(date);
                        nextMonth.setDate(1);
                        nextMonth.setHours(0, 0, 0, 0);
                        nextMonth.setMonth(date.getMonth() + 1);
                        nextMonth = new Date(nextMonth.valueOf() - 1);

                        if (this._getYearAndMonthPart(date) < this._getYearAndMonthPart(minDate) ||
                            this._getYearAndMonthPart(date) > this._getYearAndMonthPart(maxDate) ||
                            !this._hasUnrestrictedRanges(date, nextMonth)) {
                            cell.isDisabled = true;
                        }
                    }
                    else {
                        var nextYear = new Date(date);
                        nextYear.setMonth(0);
                        nextYear.setDate(1);
                        nextYear.setHours(0, 0, 0, 0);

                        nextYear.setFullYear(date.getFullYear() + 1);
                        nextYear = new Date(nextYear.valueOf() - 1);

                        if (date.getFullYear() < minDate.getFullYear() ||
                            date.getFullYear() > maxDate.getFullYear() ||
                            !this._hasUnrestrictedRanges(date, nextYear)) {
                            cell.isDisabled = true;
                        }
                    }

                    $.jqx.utilities.html(cellElement, text);
                    cells[k] = cell;
                    k++;
                }
            }
            $.each(cells, function () {
                var element = this.element;
                var cell = this;
                if (!me.disabled) {
                    me.addHandler(element, 'mousedown',
                    function (event) {
                        me._setDateAndSwitchViews(cell, event, 'mouse');
                    });

                    me.addHandler(element, 'mouseover',
                    function (event) {
                        var renderCell = me.renderedCells[cell.index];
                        if (me.view != 'centuries' && renderCell.element.html().toLowerCase().indexOf('span') != -1) return;

                        renderCell.isHighlighted = true;
                        me._applyCellStyle(renderCell, renderCell.element, renderCell.element);
                    });

                    me.addHandler(element, 'mouseout',
                    function (event) {
                        var renderCell = me.renderedCells[cell.index];
                        if (me.view != 'centuries' && renderCell.element.html().toLowerCase().indexOf('span') != -1) return;

                        renderCell.isHighlighted = false;
                        me._applyCellStyle(renderCell, renderCell.element, renderCell.element);
                    });
                }
            });

            var monthInstance = $.data(this.element, month[0].id);
            if (monthInstance != undefined && monthInstance != null) {
                monthInstance.cells = cells;
            }
            this.renderedCells = cells;
            this._addCellsTable(tableElement, cellsTable);
            this._applyCellStyles();
        },

        _setDateAndSwitchViews: function (cell, event, type) {
            if (!this._viewAnimating && !this._animating) {
                var oldDate = this.getDate();
                var date = this.renderedCells[cell.index].getDate();
                var day = this.value.dateTime.getDate();
                var newDate = new Date(date);
                if (this.views.indexOf('month') != -1) {
                    newDate.setDate(day);
                }
                else {
                    newDate.setDate(1);
                    date.setDate(1);
                }

                if (newDate.getMonth() == date.getMonth()) {
                    date = newDate;
                }

                var minDate = this.getMinDate();
                var maxDate = this.getMaxDate();

                if (this.view == "year") {
                    if (this._getYearAndMonthPart(date) < this._getYearAndMonthPart(minDate))
                        return;
                    if (this._getYearAndMonthPart(date) > this._getYearAndMonthPart(maxDate))
                        return;
                }
                else {
                    if (date.getFullYear() < minDate.getFullYear())
                        return;
                    if (date.getFullYear() > maxDate.getFullYear())
                        return;
                }

                if (this.selectionMode != "range") {
                    this._selectDate(date, type);
                }
                this.oldView = this.view;
                switch (this.view) {
                    case "year":
                        this.view = 'month';
                        break;
                    case "decade":
                        this.view = 'year';
                        break;
                }
                if (this.views.indexOf('month') == -1) this.view = 'year';
                if (this.views.indexOf('year') == -1) this.view = 'decade';

                if (this.view == "year") {
                    if (this._getYearAndMonthPart(date) < this._getYearAndMonthPart(minDate))
                        date = minDate;

                    if (this._getYearAndMonthPart(date) > this._getYearAndMonthPart(maxDate))
                        date = maxDate;
                }
                else {
                    if (date.getFullYear() < minDate.getFullYear())
                        date = minDate;

                    if (date.getFullYear() > maxDate.getFullYear())
                        date = maxDate;
                }

                if (this.changing && (this.selectedDate && (this.selectedDate.getFullYear() != date.getFullYear() || this.selectedDate.getMonth() != date.getMonth() ||
                     this.selectedDate.getDate() != date.getDate()))) {
                    date = this.selectedDate;
                }

                this.value._setYear(date.getFullYear());
                this.value._setDay(date.getDate());
                this.value._setMonth(date.getMonth() + 1);
                this.value._setDay(date.getDate());
                var visibleDate = this.getVisibleDate();
                var firstDay = this.getFirstDayOfWeek(visibleDate);
                var calendarID = "View" + this.element.id;
                this.renderCalendarCells(this.month, firstDay, calendarID, true);
                this.refreshTitle(this.month);
                if (this.showWeekNumbers) {
                    this.refreshRowHeader(this.month, calendarID);
                }
                if (this.views.length == 3) {
                    if (this.view == "month") {
                        if (this.selectionMode != "range") {
                            this._selectDate(this.selectedDate, 'view');
                        }
                        else {
                            var self = this;
                            $.each(this.renderedCells, function (index) {
                                var cell = this;
                                var cellDate = cell.getDate();
                                var cellElement = $(cell.element);
                                var cellContent = cellElement;
                                if (cellElement.length == 0)
                                    return false;
                                var getDatePart = function (date) {
                                    if (date == null) {
                                        return new Date();
                                    }

                                    var newDate = new Date();
                                    newDate.setHours(0, 0, 0, 0);
                                    newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                                    return newDate;
                                }

                                if (!cell.isOtherMonth && getDatePart(cellDate).toString() == getDatePart(date).toString()) {
                                    self.value._setMonth(date.getMonth() + 1);
                                    self.value._setDay(date.getDate());
                                    self.value._setYear(date.getFullYear());
                                }
                                cell.isSelected = false;
                                cell.isDisabled = false;

                                if (getDatePart(cellDate) < getDatePart(self.selection.from) && self._clicks == 1) {
                                    cell.isDisabled = true;
                                }
                                if (self.getMaxDate() < cellDate) {
                                    cell.isDisabled = true;
                                }
                                if (self.getMinDate() > cellDate) {
                                    cell.isDisabled = true;
                                }
                                if (self._isDisabled(cellDate)) {
                                    cell.isDisabled = true;
                                }

                                if (!cell.isDisabled) {
                                    if (getDatePart(cellDate) >= getDatePart(self.selection.from) && getDatePart(cellDate) <= getDatePart(self.selection.to)) {
                                        cell.isSelected = true;
                                    }
                                }
                            });
                            this._applyCellStyles();
                        }
                    }
                }
                if (this.view != "month") {
                    if (this.oldView == "year" || (this.views.indexOf("year") == -1 && this.view == "decade")) {
                        if (type != 'keyboard') {
                            this._raiseEvent('3');
                        }
                        this._raiseEvent('5', { selectionType: 'mouse' });
                    }
                }
                this._raiseEvent('8');
            }
        },

        renderCalendarCells: function (month, firstDay, calendarID, switchViews) {
            if (this.view == "year" || this.view == "decade" || this.view == 'centuries') {
                this.renderViews(month, firstDay, calendarID);
                return;
            }
            var cellsTable = $("<table role='grid' style='width: 100%; height: 100%; border-color: transparent;' cellspacing='2' cellpadding='1' id=" + 'cellTable' + calendarID.toString() + ">" +
               "<tr role='row'>" +
               "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" +
               "</tr>" +
               "<tr role='row'>" +
               "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" +
               "</tr>" +
               "<tr role='row'>" +
               "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" +
               "</tr>" +
               "<tr role='row'>" +
               "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" +
               "</tr>" +
               "<tr role='row'>" +
               "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" +
               "</tr>" +
               "<tr role='row'>" +
               "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" +
               "</tr>" +
               "</table>"
           );

            var tableElement = this.table;
            tableElement[0].style.borderColor = "transparent";

            if (switchViews == undefined) {
                var oldCellsTable = tableElement.find("#" + 'cellTable' + calendarID.toString());
                if (oldCellsTable != null) {
                    oldCellsTable.remove();
                }

                tableElement.append(cellsTable);
            }

            var currentDate = firstDay;

            var startRow = this.showDayNames ? 1 : 0;
            var startColumn = this.showWeekNumbers ? 1 : 0;
            var cells = new Array();
            var k = 0;

            var cellWidth = (month.width() - this.rowHeaderWidth - 2) / 7;
            if (!this.showWeekNumbers) {
                cellWidth = (month.width() - 2) / 7;
            }
            cellWidth = parseInt(cellWidth);
            var today = new $.jqx._jqxDateTimeInput.getDateTime(new Date());

            for (var i = 0; i < 6; i++) {
                for (var j = 0; j < 7; j++) {
                    var cellRowID = i + 1;
                    var r = j;
                    if (this.rtl) r = 6 - r;
                    var cellColumnID = r + 1;
                    var cellID = "#cell" + cellRowID + cellColumnID + this.element.id;
                    var date = new Date(currentDate.dateTime.getFullYear(), currentDate.dateTime.getMonth(), currentDate.dateTime.getDate());
                    var cell = new $.jqx._jqxCalendar.cell(date);
                    var cellElement = $(cellsTable[0].rows[i].cells[cellColumnID - 1]);
                    cellElement[0].id = cellID.substring(1);

                    cell.isVisible = true;
                    cell.isDisabled = false;
                    if (currentDate.month != this.value.month) {
                        cell.isOtherMonth = true;
                        cell.isVisible = this.showOtherMonthDays;
                    }

                    if (this._isRestrictedDate(date)) {
                        cell.isRestricted = true;
                        cell.isDisabled = true;
                    }

                    if (!cell.isDisabled) {
                        if (date < this.getMinDate() || date > this.getMaxDate() || this._isDisabled(date)) {
                            cell.isDisabled = true;
                        }
                    }

                    if (currentDate.month == today.month && currentDate.day == today.day && currentDate.year == today.year) {
                        cell.isToday = true;
                    }

                    if (currentDate.isWeekend()) {
                        cell.isWeekend = true;
                    }

                    cell.element = cellElement;
                    cell.row = startRow;
                    cell.column = startColumn;
                    $.jqx.utilities.html(cellElement, currentDate.day);

                    currentDate = new $.jqx._jqxDateTimeInput.getDateTime(new Date(currentDate._addDays(1)));

                    $.data(this.element, "cellContent" + cellID.substring(1), cell);
                    $.data(this.element, "" + cellID.substring(1), cell);
                    var me = this;
                    this.addHandler(cellElement, 'mousedown',
                    function (event) {
                        if (!me.readOnly && !me.disabled) {
                            var content = $(event.target);
                            var cell = $.data(me.element, content[0].id);
                            var result = me._raiseEvent(3, event);
                            if (cell != null && cell != undefined) {
                                var date = cell.getDate();
                                if (me.getMinDate() <= date && date <= me.getMaxDate()) {
                                    if (!cell.isDisabled) {
                                        if (cell.isOtherMonth && me.enableAutoNavigation) {
                                            if (cell.row < 2)
                                                me.navigateBackward();
                                            else
                                                me.navigateForward();
                                            me._selectDate(cell.getDate(), 'mouse', event.shiftKey);
                                        }
                                        else {
                                            var oldDate = new Date(me.getDate());
                                            me._selectDate(cell.getDate(), 'mouse', event.shiftKey);
                                            me.value._setYear(date.getFullYear());
                                            me.value._setDay(1);
                                            me.value._setMonth(date.getMonth() + 1);
                                            me.value._setDay(date.getDate());
                                            var table = me.host.find('.jqx-calendar-month');
                                            table.stop();
                                            table.css('margin-left', '0px');
                                            var currentDate = me.getDate();
                                            me._raiseEvent('2');
                                            if (cell.isOtherMonth) {
                                                me._raiseEvent('5', { selectionType: 'mouse' });
                                            }
                                        }
                                    }
                                }
                            }
                            return false;
                        }
                    });

                    if (!me.disabled) {
                        var highlight = function (event, highlight) {
                            if (!me.readOnly) {
                                var content = $(event.target);
                                var cell = $.data(me.element, content[0].id);

                                if (cell != null && cell != undefined) {
                                    var date = cell.getDate();
                                    if (me.getMinDate() <= date && date <= me.getMaxDate()) {
                                        cell.isHighlighted = highlight;
                                        me._applyCellStyle(cell, cell.element, content);
                                    }
                                }
                            }
                        }

                        this.addHandler(cellElement, 'mouseenter',
                              function (event) {
                                  highlight(event, true);
                                  return false;
                              });

                        this.addHandler(cellElement, 'mouseleave',
                              function (event) {
                                  highlight(event, false);
                                  return false;
                              });
                    }

                    startColumn++;
                    cells[k] = cell;
                    k++;
                }
                startColumn = 0;
                startRow++;
            }

            var monthInstance = $.data(this.element, month[0].id);
            if (monthInstance != undefined && monthInstance != null) {
                monthInstance.cells = cells;
            }
            this.renderedCells = cells;
            if (switchViews != undefined) {
                this._addCellsTable(tableElement, cellsTable);
            }
            this._applyCellStyles();
            this._refreshOtherMonthRows(monthInstance, calendarID);
        },

        // sets the maximum navigation date. 
        // @param - Date
        setMaxDate: function (date, refresh) {
            if (date != null && typeof (date) == "string") {
                date = new Date(date);
                if (date == "Invalid Date")
                    return;
            }

            this.maxDate = $.jqx._jqxDateTimeInput.getDateTime(date);
            if (refresh !== false)
                this.render();
        },

        // gets the maximum navigation date.
        getMaxDate: function () {
            if (this.maxDate != null && this.maxDate != undefined) {
                return this.maxDate.dateTime;
            }

            return null;
        },

        // sets the minimum date. 
        // @param - Date
        setMinDate: function (date, refresh) {
            if (date != null && typeof (date) == "string") {
                date = new Date(date);
                if (date == "Invalid Date")
                    return;
            }

            this.minDate = $.jqx._jqxDateTimeInput.getDateTime(date);
            if (refresh !== false)
                this.render();
        },

        // gets the minimum date.
        getMinDate: function () {
            if (this.minDate != null && this.minDate != undefined) {
                return this.minDate.dateTime;
            }

            return null;
        },


        // sets the calendar's date. 
        // @param - Date
        navigateTo: function (date, reason) {
            if (this.view == 'month') {
                var minDate = this.getMinDate();
                var maxDate = new Date(this.getMaxDate().getFullYear(), this.getMaxDate().getMonth() + 1, this.getMaxDate().getDate());
                if ((date < this._getYearAndMonthPart(minDate)) || (date > this._getYearAndMonthPart(maxDate))) {
                    return false;
                }
            }
            else if (date && (date.getFullYear() < this.getMinDate().getFullYear() || date.getFullYear() > this.getMaxDate().getFullYear())) {
                return false;
            }

            if (date == null) {
                return false;
            }

            if (reason == undefined) {
                var me = this;
                if (this._animating) {
                    return;
                }

                this._animating = true;
                var container = this.host.find('.jqx-calendar-month-container');
                if (this._viewClone) {
                    this._viewClone.stop();
                    this._viewClone.remove();
                }
                if (this._newViewClone) {
                    this._newViewClone.stop();
                    this._newViewClone.remove();
                }

                var table = this.host.find('.jqx-calendar-month');
                table.stop();
                table.css('margin-left', '0px');

                var viewClone = table.clone();
                this._viewClone = viewClone;
                var value = new Date(this.value.dateTime);
                this.value._setYear(date.getFullYear());
                this.value._setDay(date.getDate());
                this.value._setMonth(date.getMonth() + 1);

                me.refreshControl();
                container.css('position', 'relative');
                viewClone.css('position', 'absolute');
                viewClone.css('top', table.position().top);
                container.append(viewClone);
                if ($.jqx.browser.msie && $.jqx.browser.version < 8) {
                    this.month.css('position', 'relative');
                    this.month.css('overflow', 'hidden');
                    this.table.css('position', 'relative');
                    this.table.css('overflow', 'hidden');
                }

                var width = -this.host.width();
                if (date < value) {
                    if (this.view == "month" && date.getMonth() != value.getMonth()) {
                        width = this.host.width();
                    }
                    else if (date.getFullYear() != value.getFullYear()) {
                        width = this.host.width();
                    }
                }

                viewClone.animate({
                    marginLeft: parseInt(width) + 'px'
                }, this.navigationDelay, function () {
                    viewClone.remove();
                });
                var newViewClone = table.clone();
                this._newViewClone = newViewClone;
                newViewClone.css('position', 'absolute');
                newViewClone.css('top', table.position().top);
                container.append(newViewClone);
                newViewClone.css('margin-left', -width);
                table.css('visibility', 'hidden');
                newViewClone.animate({
                    marginLeft: '0px'
                }, this.navigationDelay, function () {
                    newViewClone.remove();
                    table.css('visibility', 'inherit');
                    me._animating = false;
                });
            }
            else {
                this.value._setYear(date.getFullYear());
                this.value._setDay(date.getDate());
                this.value._setMonth(date.getMonth() + 1);
                var table = this.host.find('.jqx-calendar-month');
                table.stop();
                table.css('margin-left', '0px');

                this.refreshControl();
            }


            this._raiseEvent('2');
            this._raiseEvent('8');
            return true;
        },

        // sets the calendar's date. 
        // @param - Date
        setDate: function (date) {
            if (date != null && typeof (date) == "string") {
                date = new Date(date);
            }

            if (this.canRender == false) {
                this.canRender = true;
                this.render();
            }
            this.navigateTo(date, 'api');
            this._selectDate(date);
            if (this.selectionMode == 'range') {
                this._selectDate(date, 'mouse');
            }

            return true;
        },

        val: function (value) {
            if (arguments.length != 0) {
                if (value == null)
                    this.setDate(null);

                if (value instanceof Date)
                    this.setDate(value);

                if (typeof (value) == "string") {
                    this.setDate(value);
                }
            }
            return this.getDate();
        },

        // gets the calendar's date.
        getDate: function () {
            if (this.selectedDate == undefined)
                return new Date();

            return this.selectedDate;
        },

        getValue: function () {
            if (this.value == undefined)
                return new Date();

            return this.value.dateTime;
        },

        setRange: function (from, to) {
            if (this.canRender == false) {
                this.canRender = true;
                this.render();
            }

            this.navigateTo(from, 'api');
            this._selectDate(from, 'mouse');
            this._selectDate(to, 'mouse');
        },

        getRange: function () {
            return this.selection;
        },

        // selects a date.
        // @param - Date
        _selectDate: function (date, type, shift) {
            if (this.selectionMode == 'none')
                return;

            if (type == null || type == undefined) type = 'none';
            if (shift == null || shift == undefined) shift = false;

            var monthInstance = $.data(this.element, "View" + this.element.id);
            if (monthInstance == undefined || monthInstance == null)
                return;

            if (this.changing) {
                if (date && this.selectedDate) {
                    if (this.selectedDate.getFullYear() != date.getFullYear() || this.selectedDate.getDate() != date.getDate() || this.selectedDate.getMonth() != date.getMonth())
                        var newDate = this.changing(this.selectedDate, date);
                    if (newDate) {
                        date = newDate;
                    }
                }
            }

            var self = this;
            if (this.input) {
                if (date != null) {
                    this.input.val(date.toString());
                }
                else this.input.val("");
            }
            var oldDate = this.selectedDate;
            this.selectedDate = date;

            if (this.view != "month") {
                if (oldDate != date) {
                    this._raiseEvent(7, { selectionType: type });
                }

                $.each(this.renderedCells, function (index) {
                    var cell = this;
                    var cellDate = cell.getDate();
                    var cellElement = $(cell.element);
                    var cellContent = cellElement.find("#cellContent" + cellElement[0].id);
                    if (date == null) {
                        cell.isSelected = false;
                        cell.isDisabled = false;
                    }
                    else {
                        cell.isSelected = false;
                        if (cellDate) {
                            if ((cellDate.getMonth() == date.getMonth() && self.view == "year" && cellDate.getFullYear() == date.getFullYear()) || (self.view == "decade" && cellDate.getFullYear() == date.getFullYear())) {
                                cell.isSelected = true;
                                try {
                                    if (type != "none") {
                                        cell.element.focus();
                                    }
                                }
                                catch (error) {
                                }
                            }
                        }
                    }
                    self._applyCellStyle(cell, cellElement, cellElement);
                });
                if (this.change) {
                    this.change(date);
                }
                return;
            }

            if (this.view == "month") {
                if (this.selectionMode == "range" && type == "key") {
                    var visibleDate = this.getVisibleDate();
                    var firstDay = this.getFirstDayOfWeek(visibleDate);
                    this.refreshCalendarCells(this.month, firstDay, "View" + this.element.id);
                }
            }

            var cellDisabledDefault = false;

            $.each(this.renderedCells, function (index) {
                var cell = this;
                var cellDate = cell.getDate();
                var cellElement = $(cell.element);
                var cellContent = cellElement;
                if (cellElement.length == 0)
                    return false;


                if (date == null) {
                    cell.isSelected = false;
                    cell.isDisabled = false;
                    if (index == 0) {
                        self.selection = { from: null, to: null };
                        self._raiseEvent('2');
                        self._raiseEvent('5', { selectionType: type });
                    }
                }
                else {
                    if (self.selectionMode != 'range' || type == 'key') {
                        if (cellDate.getDate() == date.getDate() && cellDate.getMonth() == date.getMonth() && cellDate.getFullYear() == date.getFullYear() && cell.isSelected) {
                            self._applyCellStyle(cell, cellElement, cellContent);
                            self._raiseEvent('5', { selectionType: type });
                            return;
                        }

                        if (cell.isSelected) {
                            self._raiseEvent('6', { selectionType: type });
                        }

                        cell.isSelected = false;
                        if (cellDate.getDate() == date.getDate() && cellDate.getMonth() == date.getMonth() && cellDate.getFullYear() == date.getFullYear()) {
                            cell.isSelected = true;
                            if (index == 0) {
                                self.selection = { date: date };
                            }
                            try {
                                if (type != "none") {
                                    cell.element.focus();
                                    self.host.focus();
                                }
                            }
                            catch (error) {
                            }

                            if (!cell.isOtherMonth) {
                                self.value._setMonth(date.getMonth() + 1);
                                self.value._setDay(date.getDate());
                                self.value._setYear(date.getFullYear());
                                self._raiseEvent('2');
                                self._raiseEvent('5', { selectionType: type });
                            }
                        }
                        if (self.selectionMode == 'range') {
                            self._clicks = 0;
                            self.selection = { from: date, to: date };
                        }
                    }
                    else if (self.selectionMode == 'range') {
                        if (type == "view") {
                            cell.isSelected = false;
                            cell.isDisabled = false;
                            if (self.getMaxDate() < cellDate) {
                                cell.isDisabled = true;
                            }
                            if (self.getMinDate() > cellDate) {
                                cell.isDisabled = true;
                            }

                            if (self._isRestrictedDate(cellDate)) {
                                cell.isDisabled = true;
                                cell.isRestricted = true;
                            }

                            if (!cell.isDisabled && self._isDisabled(cellDate)) {
                                cell.isDisabled = true;
                            }

                            self._applyCellStyle(cell, cellElement, cellContent);
                            return true;
                        }

                        if (index == 0) {
                            if (type != 'none') {
                                if (self._clicks == undefined) self._clicks = 0;
                                self._clicks++;
                                if (shift) {
                                    self._clicks++;
                                }

                                if (self._clicks == 1) {
                                    self.selection = { from: date, to: date };
                                }
                                else {
                                    var from = self.selection.from;
                                    var min = from <= date ? from : date;
                                    var max = from <= date ? date : from;
                                    if (min) {
                                        var start = new Date(min.getFullYear(), min.getMonth(), min.getDate());
                                    }
                                    if (max) {
                                        var end = new Date(max.getFullYear(), max.getMonth(), max.getDate(), 23, 59, 59);
                                    }
                                    self.selection = { from: start, to: end };
                                    self._clicks = 0;
                                }
                            }
                            else {
                                if (self.selection == null || self.selection.from == null) {
                                    self.selection = { from: date, to: date };
                                    if (self._clicks == undefined) self._clicks = 0;
                                    self._clicks++;
                                    if (self._clicks == 2) self._clicks = 0;
                                }
                            }
                        }

                        var getDatePart = function (date) {
                            if (date == null) {
                                return new Date();
                            }

                            var newDate = new Date();
                            newDate.setHours(0, 0, 0, 0);
                            newDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                            return newDate;
                        }

                        if (!cell.isOtherMonth && getDatePart(cellDate).toString() == getDatePart(date).toString()) {
                            self.value._setMonth(date.getMonth() + 1);
                            self.value._setDay(date.getDate());
                            self.value._setYear(date.getFullYear());
                            self._raiseEvent('2');
                            self._raiseEvent('5', { selectionType: type });
                        }
                        cell.isSelected = false;
                        cell.isDisabled = cellDisabledDefault;

                        if (getDatePart(cellDate) < getDatePart(self.selection.from) && self._clicks == 1) {
                            cell.isDisabled = true;
                        }
                        if (self.getMaxDate() < cellDate) {
                            cell.isDisabled = true;
                        }
                        if (self.getMinDate() > cellDate) {
                            cell.isDisabled = true;
                        }

                        if (self._isRestrictedDate(cellDate)) {
                            cell.isRestricted = true;
                            cell.isDisabled = true;
                        }

                        if (!cell.isDisabled && self._isDisabled(cellDate)) {
                            cell.isDisabled = true;
                        }

                        if (!cell.isDisabled) {
                            if (getDatePart(cellDate) >= getDatePart(self.selection.from) && getDatePart(cellDate) <= getDatePart(self.selection.to)) {
                                cell.isSelected = true;
                            }
                        }
                        else if (!self.allowRestrictedDaysInRange && getDatePart(cellDate) >= getDatePart(self.selection.from) && self.selection.to == self.selection.from) {
                            // disable all cells after the first non-selectable cell in the sequence
                            cellDisabledDefault = true;
                        }
                    }
                }

                self._applyCellStyle(cell, cellElement, cellContent);
            });

            if (self.selectionMode == "range" && self._clicks == 0) {
                self._raiseEvent(7, { selectionType: type });
                return;
            }
            else if (self.selectionMode == "range")
                return;

            if (oldDate != date) {
                self._raiseEvent(7, { selectionType: type });
                if (this.change) {
                    this.change(date);
                }
            }
        },

        // gets the selected date.
        _getSelectedDate: function () {
            var monthInstance = $.data(this.element, "View" + this.element.id);
            if (monthInstance == undefined || monthInstance == null)
                return;

            if (this.view != "month")
                return this.selectedDate;

            for (var i = 0; i < monthInstance.cells.length; i++) {
                var cell = monthInstance.cells[i];
                var cellDate = cell.getDate();
                if (cell.isSelected) {
                    return cellDate;
                }
            }
            if (this.selectedDate) {
                return this.selectedDate;
            }
        },

        // gets the selected cell.
        _getSelectedCell: function () {
            var monthInstance = $.data(this.element, "View" + this.element.id);
            if (monthInstance == undefined || monthInstance == null)
                return;

            for (var i = 0; i < monthInstance.cells.length; i++) {
                var cell = monthInstance.cells[i];
                var cellDate = cell.getDate();
                if (cell.isSelected) {
                    return cell;
                }
            }
        },

        _applyCellStyle: function (cell, cellElement, cellContent) {
            var self = this;
            if (cellContent == null || (cellContent != null && cellContent.length == 0)) {
                cellContent = cellElement;
            }

            var cssClassName = "";
            cssClassName = this.toThemeProperty("jqx-rc-all");
            cssClassName += " " + this.toThemeProperty("jqx-item");
            if (this.disabled || (cell.isDisabled && !cell.isRestricted)) {
                cssClassName += " " + this.toThemeProperty("jqx-calendar-cell-disabled");
                cssClassName += " " + this.toThemeProperty("jqx-fill-state-disabled");
            }

            if (!this.disabled && cell.isRestricted) {
                cssClassName += " " + this.toThemeProperty("jqx-calendar-cell-restrictedDate");
            }

            if (cell.isOtherMonth && this.enableOtherMonthDays && cell.isVisible) {
                cssClassName += " " + this.toThemeProperty("jqx-calendar-cell-othermonth");
            }

            if (cell.isWeekend && this.enableWeekend && cell.isVisible && cell.isVisible) {
                cssClassName += " " + this.toThemeProperty("jqx-calendar-cell-weekend");
            }

            if (!cell.isVisible) {
                cssClassName += " " + this.toThemeProperty("jqx-calendar-cell-hidden");
            }
            else {
                cssClassName += " " + this.toThemeProperty("jqx-calendar-cell");
                if (this.view != "month") {
                    if (cellContent.length > 0 && cellContent.html().toLowerCase().indexOf('span') != -1) {
                        cellContent.css('cursor', 'default');
                    }
                }
            }

            cellContent.removeAttr('aria-selected');
            if (cell.isSelected && cell.isVisible) {
                cssClassName += " " + this.toThemeProperty("jqx-calendar-cell-selected");
                cssClassName += " " + this.toThemeProperty("jqx-fill-state-pressed");
                cellContent.attr('aria-selected', true);
                this.host.removeAttr("aria-activedescendant").attr("aria-activedescendant", cellContent[0].id);
                var date = cell.getDate();
                if (this._isDisabled(date)) {
                    cssClassName += " " + this.toThemeProperty("jqx-calendar-cell-selected-invalid");
                }
            }

            if (cell.isHighlighted && cell.isVisible && this.enableHover) {
                if (!cell.isDisabled) {
                    cssClassName += " " + this.toThemeProperty("jqx-calendar-cell-hover");
                    cssClassName += " " + this.toThemeProperty("jqx-fill-state-hover");
                }
            }

            cssClassName += " " + this.toThemeProperty("jqx-calendar-cell-" + this.view);

            if (cell.isToday && cell.isVisible) {
                cssClassName += " " + this.toThemeProperty("jqx-calendar-cell-today");
            }
            cellContent[0].className = cssClassName;

            if (this.specialDates.length > 0) {
                var me = this;
                $.each(this.specialDates, function () {
                    if (this.Class != undefined && this.Class != null && this.Class != '') {
                        cellContent.removeClass(this.Class);
                    }
                    else {
                        cellContent.removeClass(self.toThemeProperty("jqx-calendar-cell-specialDate"));
                    }

                    var date = cell.getDate();

                    if (date.getFullYear() == this.Date.getFullYear() && date.getMonth() == this.Date.getMonth() && date.getDate() == this.Date.getDate()) {
                        if (cell.tooltip == null && this.Tooltip != null) {
                            cell.tooltip = this.Tooltip;
                            if ($(cellContent).jqxTooltip) {
                                var className = this.Class;
                                $(cellContent).jqxTooltip({
                                    value: { cell: cell, specialDate: this.Date },
                                    name: me.element.id, content: this.Tooltip, position: 'mouse', theme: me.theme,
                                    opening: function (tooltip) {
                                        if (cellContent.hasClass(self.toThemeProperty("jqx-calendar-cell-specialDate"))) {
                                            return true;
                                        }
                                        if (cellContent.hasClass(className)) {
                                            return true;
                                        }
                                        return false;
                                    }
                                });
                            }
                        }

                        cellContent.removeClass(self.toThemeProperty("jqx-calendar-cell-othermonth"));
                        cellContent.removeClass(self.toThemeProperty("jqx-calendar-cell-weekend"));

                        if (this.Class == undefined || this.Class == '') {
                            cellContent.addClass(self.toThemeProperty("jqx-calendar-cell-specialDate"));
                            return false;
                        }
                        else {
                            cellContent.addClass(this.Class);
                            return false;
                        }
                    }
                }
                );
            }
        },

        _applyCellStyles: function () {
            var monthInstance = $.data(this.element, "View" + this.element.id);
            if (monthInstance == undefined || monthInstance == null)
                return;

            for (var i = 0; i < monthInstance.cells.length; i++) {
                var cell = monthInstance.cells[i];
                var cellElement = $(cell.element);
                var cellContent = cellElement.find("#cellContent" + cellElement[0].id);
                if (cellContent.length == 0) cellContent = cellElement;
                this._applyCellStyle(cell, cellElement, cellContent);
            }
        },

        // gets the week of year by Date.
        getWeekOfYear: function (date) {
            var dateObj = new Date(date.dateTime);
            dowOffset = this.firstDayOfWeek; //default dowOffset to zero
            var newYear = new Date(dateObj.getFullYear(), 0, 1);
            var day = newYear.getDay() - dowOffset; //the day of week the year begins on
            day = (day >= 0 ? day : day + 7);
            var daynum = Math.floor((dateObj.getTime() - newYear.getTime() -
            (dateObj.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) / 86400000) + 1;
            var weeknum;
            //if the year starts before the middle of a week
            if (day < 4) {
                weeknum = Math.floor((daynum + day - 1) / 7) + 1;
                if (weeknum > 52) {
                    nYear = new Date(dateObj.getFullYear() + 1, 0, 1);
                    nday = nYear.getDay() - dowOffset;
                    nday = nday >= 0 ? nday : nday + 7;
                    /*if the next year starts before the middle of
                      the week, it is week #1 of that year*/
                    weeknum = nday < 4 ? 1 : 53;
                }
            }
            else {
                weeknum = Math.floor((daynum + day - 1) / 7);
            }
            return weeknum;

            //var dayOfYear = date.dayOfYear(date.dateTime) - 1;
            //var week = date.dayOfWeek - (dayOfYear % 7);
            //var offset = ((week - this.firstDayOfWeek) + 14) % 7;
            //return Math.ceil((((dayOfYear + offset) / 7) + 1));
        },

        renderColumnHeader: function (month) {
            if (!this.showDayNames)
                return;

            var columnHeader = $("<table role='grid' style='border-spacing: 0px; border-collapse: collapse; width: 100%; height: 100%;' cellspacing='0' cellpadding='1'>" +
               "<tr role='row'>" +
               "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" + "<td role='gridcell'></td>" +
               "</tr>" +
               "</table>"
            );
            columnHeader.find('table').addClass(this.toThemeProperty('jqx-reset'));
            columnHeader.find('tr').addClass(this.toThemeProperty('jqx-reset'));
            columnHeader.find('td').css({ background: 'transparent', padding: 1, margin: 0, border: 'none' });
            columnHeader.addClass(this.toThemeProperty("jqx-reset"));
            columnHeader.addClass(this.toThemeProperty("jqx-widget-content"));
            columnHeader.addClass(this.toThemeProperty("jqx-calendar-column-header"));
            this.columnHeader.append(columnHeader);

            var visibleDate = this.getVisibleDate();
            var firstDay = this.getFirstDayOfWeek(visibleDate);
            var dayOfWeek = firstDay.dayOfWeek;
            var weekOfYear = this.getWeekOfYear(firstDay);

            var day = this.firstDayOfWeek;
            var dayNames = this.localization.calendar.days.names;

            var columnHeaderCells = new Array();
            var currentDate = firstDay;
            var cellWidth = (month.width() - this.rowHeaderWidth - 2) / 7;
            if (!this.showWeekNumbers) {
                cellWidth = (month.width() - 2) / 7;
            }

            for (var i = 0; i < 7; i++) {
                var dayString = dayNames[day];
                if (this.rtl) {
                    dayString = dayNames[6 - day];
                }

                // Possible values: default, shortest, firstTwoLetters, firstLetter, full
                switch (this.dayNameFormat) {
                    case 'default':
                        dayString = this.localization.calendar.days.namesAbbr[day];
                        if (this.rtl) {
                            dayString = this.localization.calendar.days.namesAbbr[6 - day];
                        }
                        break;
                    case 'shortest':
                        dayString = this.localization.calendar.days.namesShort[day];
                        if (this.rtl) {
                            dayString = this.localization.calendar.days.namesShort[6 - day];
                        }
                        break;
                    case 'firstTwoLetters':
                        dayString = dayString.substring(0, 2);
                        break;
                    case 'firstLetter':
                        dayString = dayString.substring(0, 1);
                        break;
                }

                var cell = new $.jqx._jqxCalendar.cell(currentDate.dateTime);
                var r = i + 1;

                var cellID = r + this.element.id;
                var cellElement = $(columnHeader[0].rows[0].cells[i]);

                var oldI = i;

                if (this.enableTooltips) {
                    if ($(cellElement).jqxTooltip) {
                        $(cellElement).jqxTooltip({
                            name: this.element.id, content: dayNames[day], theme: this.theme, position: 'mouse'
                        });
                    }
                }

                if (day >= 6) {
                    day = 0;
                }
                else {
                    day++;
                }

                i = oldI;
                cell.element = cellElement;
                cell.row = 0;
                cell.column = i + 1;
                var textWidth = this._textwidth(dayString);
                var cellContent = "<div style='padding: 0; margin: 0; border: none; background: transparent;' id='columnCell" + cellID + "'>" + dayString + "</div>";
                cellElement.append(cellContent);
                cellElement.find("#columnCell" + cellID).addClass(this.toThemeProperty('jqx-calendar-column-cell'));
                cellElement.width(cellWidth);
                if (this.disabled) {
                    cellElement.find("#columnCell" + cellID).addClass(this.toThemeProperty('jqx-calendar-column-cell-disabled'));
                }

                if (textWidth > 0 && cellWidth > 0) {
                    while (textWidth > cellElement.width()) {
                        if (dayString.length == 0)
                            break;

                        dayString = dayString.substring(0, dayString.length - 1);
                        $.jqx.utilities.html(cellElement.find("#columnCell" + cellID), dayString);
                        textWidth = this._textwidth(dayString);
                    }
                }

                columnHeaderCells[i] = cell;
                currentDate = new $.jqx._jqxDateTimeInput.getDateTime(new Date(currentDate._addDays(1)));
            }

            if (parseInt(this.columnHeader.width()) > parseInt(this.host.width())) {
                this.columnHeader.width(this.host.width())
            }

            var monthInstance = $.data(this.element, month[0].id);
            monthInstance.columnCells = columnHeaderCells;
        },

        _format: function (date, format, culture) {
            var globalize = false;
            try {
                if (Globalize != undefined) {
                    globalize = true;
                }
            }
            catch (error) {
            }

            if ($.global) {
                $.global.culture.calendar = this.localization.calendar;
                return $.global.format(date, format, this.culture);
            }
            else if (globalize) {
                try {
                    if (Globalize.cultures[this.culture]) {
                        Globalize.cultures[this.culture].calendar = this.localization.calendar;
                        return Globalize.format(date, format, this.culture);
                    }
                    else {
                        return Globalize.format(date, format, this.culture);
                    }
                }
                catch (error) {
                    return Globalize.format(date, format);
                }
            }
            else if ($.jqx.dataFormat) {
                return $.jqx.dataFormat.formatdate(date, format, this.localization.calendar);
            }
        },

        _textwidth: function (text) {
            var measureElement = $('<span>' + text + '</span>');
            measureElement.addClass(this.toThemeProperty('jqx-calendar-column-cell'));
            $(this.host).append(measureElement);
            var width = measureElement.width();
            measureElement.remove();
            return width;
        },

        _textheight: function (text) {
            var measureElement = $('<span>' + text + '</span>');
            $(this.host).append(measureElement);
            var height = measureElement.height();
            measureElement.remove();
            return height;
        },

        _renderRowHeader: function (month) {
            var visibleDate = this.getVisibleDate();
            var firstDay = this.getFirstDayOfWeek(visibleDate);
            var dayOfWeek = firstDay.dayOfWeek;
            var weekOfYear = this.getWeekOfYear(firstDay);
            var newDate = new $.jqx._jqxDateTimeInput.getDateTime(new Date(firstDay.dateTime));
            newDate._addDays(5);
            newDate.dayOfWeek = newDate.dateTime.getDay();
            var newWeekOfYear = this.getWeekOfYear(newDate);
            if (53 == weekOfYear && newDate.dateTime.getMonth() == 0)
                weekOfYear = 1;

            var rowHeader = $("<table style='overflow: hidden; width: 100%; height: 100%;' cellspacing='0' cellpadding='1'>" +
               "<tr>" +
               "<td></td>" +
               "</tr>" +
               "<tr>" +
               "<td/>" +
               "</tr>" +
               "<tr>" +
               "<td/>" +
               "</tr>" +
               "<tr>" +
               "<td/>" +
               "</tr>" +
               "<tr>" +
               "<td/>" +
               "</tr>" +
               "<tr>" +
               "<td/>" +
               "</tr>" +
               "</table>"
           );

            rowHeader.find('table').addClass(this.toThemeProperty('jqx-reset'));
            rowHeader.find('td').addClass(this.toThemeProperty('jqx-reset'));
            rowHeader.find('tr').addClass(this.toThemeProperty('jqx-reset'));
            rowHeader.addClass(this.toThemeProperty("jqx-calendar-row-header"));
            rowHeader.width(this.rowHeaderWidth);
            this.rowHeader.append(rowHeader);

            var currentDate = firstDay;
            var rowHeaderCells = new Array();

            for (var i = 0; i < 6; i++) {
                var weekString = weekOfYear.toString();
                var cell = new $.jqx._jqxCalendar.cell(currentDate.dateTime);
                var cellID = i + 1 + this.element.id;
                var cellElement = $(rowHeader[0].rows[i].cells[0]);
                cell.element = cellElement;
                cell.row = i;
                cell.column = 0;
                var cellContent = "<div style='background: transparent; border: none; padding: 0; margin: 0;' id ='headerCellContent" + cellID + "'>" + weekString + "</div>";
                cellElement.append(cellContent);
                cellElement.find("#headerCellContent" + cellID).addClass(this.toThemeProperty('jqx-calendar-row-cell'));
                rowHeaderCells[i] = cell;
                currentDate = new $.jqx._jqxDateTimeInput.getDateTime(new Date(currentDate._addWeeks(1)));
                weekOfYear = this.getWeekOfYear(currentDate);
            }

            var monthInstance = $.data(this.element, month[0].id);
            monthInstance.rowCells = rowHeaderCells;
        },

        // gets the first week day.
        // @param - Date
        getFirstDayOfWeek: function (visibleDate) {
            var date = visibleDate;

            if (this.firstDayOfWeek < 0 || this.firstDayOfWeek > 6)
                this.firstDayOfWeek = 6;

            var num = date.dayOfWeek - this.firstDayOfWeek;
            if (num <= 0) {
                num += 7;
            }

            var newDate = $.jqx._jqxDateTimeInput.getDateTime(date._addDays(-num));
            return newDate;
        },

        // gets the visible date in the current month.
        getVisibleDate: function () {
            var visibleDate = new $.jqx._jqxDateTimeInput.getDateTime(new Date(this.value.dateTime));
            if (visibleDate < this.minDate) {
                visibleDate = this.minDate;
            }

            if (visibleDate > this.maxDate) {
                this.visibleDate = this.maxDate;
            }

            visibleDate.dateTime.setHours(0);
            var dayInMonth = visibleDate.day;
            var newVisibleDate = $.jqx._jqxDateTimeInput.getDateTime(visibleDate._addDays(-dayInMonth + 1));
            visibleDate = newVisibleDate;
            return visibleDate;
        },

        destroy: function (removeFromDom) {
            this.host
			.removeClass();

            if (removeFromDom != false) {
                this.host.remove();
            }
        },

        _raiseEvent: function (id, arg) {
            if (arg == undefined)
                arg = { owner: null };

            var evt = this.events[id];
            var args = arg ? arg : {};

            args.owner = this;
            var event = new $.Event(evt);
            event.owner = this;
            event.args = args;
            if (id == 0 || id == 1 || id == 2 || id == 3 || id == 4 || id == 5 || id == 6 || id == 7 || id == 8) {
                event.args.date = event.args.selectedDate = this.getDate();
                event.args.range = this.getRange();
                var start = this.getViewStart();
                var end = this.getViewEnd();
                event.args.view = { from: start, to: end };
            }

            if (id == 7) {
                var selectionType = args.selectionType;
                if (!selectionType) selectionType = null;
                if (selectionType == "key") {
                    selectionType = "keyboard";
                }
                if (selectionType == "none") {
                    selectionType = null;
                }
                args.type = selectionType;
            }
            var result = this.host.trigger(event);
            if (id == 0 || id == 1) {
                result = false;
            }

            return result;
        },

        propertyMap: function (key) {
            if (key == "value") {
                if (this.selectionMode != 'range') {
                    return this.getDate();
                }
                else return this.getRange();
            }
            return null;
        },

        _setSize: function () {
            var month = this.host.find("#View" + this.element.id);
            if (month.length > 0) {

                this.setCalendarSize();
                if (this.height != undefined && !isNaN(this.height)) {
                    month.height(this.height);
                }
                else if (this.height != null && this.height.toString().indexOf("px") != -1) {
                    month.height(this.height);
                }

                if (this.width != undefined && !isNaN(this.width)) {
                    month.width(this.width);
                }
                else if (this.width != null && this.width.toString().indexOf("px") != -1) {
                    month.width(this.width);
                }

                var contentHeight = this.host.height() - this.titleHeight - this.columnHeaderHeight;
                var calendarID = "View" + this.element.id;
                month.find('#cellsTable' + calendarID).height(contentHeight);
                month.find('#calendarRowHeader' + calendarID).height(contentHeight);
                this.refreshControl();
            }
        },

        resize: function () {
            this._setSize();
        },

        clear: function () {
            if (this.selectionMode == "range") {
                this._clicks = 1;
                this.setRange(null, null);
                this._raiseEvent(7);
            }
            else {
                this.setDate(null, 'mouse');
            }
            this._clicks = 0;
            this.selection = { from: null, to: null };
        },

        today: function () {
            if (this.selectionMode == 'range') {
                this.setRange(new Date(), new Date());
            }
            else {
                this.setDate(new Date(), 'mouse');
            }
        },

        propertiesChangedHandler: function (object, key, value)
        {
            if (value.width && value.height && Object.keys(value).length == 2)
            {
                object._setSize();
            }
        },

        propertyChangedHandler: function (object, key, oldvalue, value) {
            if (this.isInitialized == undefined || this.isInitialized == false)
                return;

            if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length == 2)
            {
                return;
            }

            if (key == "enableHover")
                return;
            if (key == "keyboardNavigation")
                return;

            if (key == 'localization') {
                if (this.localization) {
                    if (this.localization.backString) {
                        this.backText = this.localization.backString;
                    }
                    if (this.localization.forwardString) {
                        this.forwardText = this.localization.forwardString;
                    }
                    if (this.localization.todayString) {
                        this.todayString = this.localization.todayString;
                    }
                    if (this.localization.clearString) {
                        this.clearString = this.localization.clearString;
                    }
                    this.firstDayOfWeek = this.localization.calendar.firstDay;
                }
            }

            if (key == 'culture') {
                try {
                    if ($.global) {
                        $.global.preferCulture(object.culture);
                        object.localization.calendar = $.global.culture.calendar;
                    }
                    else if (Globalize) {
                        var culture = Globalize.culture(object.culture);
                        object.localization.calendar = culture.calendar;
                    }
                    if (object.localization.calendar && object.localization.calendar.firstDay != undefined && object.culture != "default") {
                        object.firstDayOfWeek = object.localization.calendar.firstDay;
                    }
                }
                catch (error) {
                }
            }
            if (key == "views") {
                if (object.views.indexOf('month') == -1) object.view = "year";
                if (object.views.indexOf('year') == -1 && object.views.indexOf('month') == -1) object.view = "decade";
                object.render();
                return;
            }
            if (key == "showFooter") {
                object.render();
            }
            if (key == 'width' || key == 'height') {
                object._setSize();
                return;
            }
            else if (key == 'theme') {
                $.jqx.utilities.setTheme(oldvalue, value, object.host);
            }
            else if (key == "rowHeaderWidth" || key == "showWeekNumbers") {
                object.render();
            }
            else {
                object.view = "month";
                object.render();
            }
        }
    });
})(jqxBaseFramework);

(function ($) {
    $.jqx._jqxCalendar.cell = function (date) {
        var cell =
        {
            dateTime: new $.jqx._jqxDateTimeInput.getDateTime(date),
            _date: date,
            getDate: function () {
                return this._date;
            },
            setDate: function (date) {
                this.dateTime = new $.jqx._jqxDateTimeInput.getDateTime(date);
                this._date = date;
            },
            isToday: false,
            isWeekend: false,
            isOtherMonth: false,
            isVisible: true,
            isSelected: false,
            isHighlighted: false,
            element: null,
            row: -1,
            column: -1,
            tooltip: null
        };

        return cell;
    } // calendar cell

    $.jqx._jqxCalendar.monthView = function (startDate, endDate, cells, rowHeaderCells, columnHeaderCells, element) {
        var month =
        {
            start: startDate,
            end: endDate,
            cells: cells,
            rowCells: rowHeaderCells,
            columnCells: columnHeaderCells,
            element: element
        };

        return month;
    } // calendar month

})(jqxBaseFramework);
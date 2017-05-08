/*
jQWidgets v4.3.0 (2016-Oct)
Copyright (c) 2011-2016 jQWidgets.
License: http://jqwidgets.com/license/
*/

(function ($) {

    $.jqx.jqxWidget("jqxProgressBar", "", {});

    $.extend($.jqx._jqxProgressBar.prototype, {

        defineInstance: function () {
            var settings = {
                //TODO: docum.
                colorRanges: [],
                //Type: Number.
                //Default: 0.
                //Sets the progress value.
                value: 0,
                //Type: Number.
                //Default: null.
                //Sets the progress value.            
                oldValue: null,
                //Type: Number.
                //Default: 100.
                //Sets the progress max value.
                max: 100,
                //Type: Number.
                //Default: 0.
                //Sets the progress min value.
                min: 0,
                //Type: String.
                //Default: 'horizontal'.
                //Sets the orientation.
                orientation: 'horizontal',
                //Type: String.
                //Default: 'normal'. Values: 'normal' or 'reverse'
                //Sets the layout.
                layout: 'normal',
                //Type: String.
                //Default: null.
                //Sets the progress bar width.
                width: null,
                //Type: String.
                //Default: null.
                //Sets the progress height width.
                height: null,
                //Type: Boolean.
                //Default: false.
                //Sets the visibility of the progress bar's text.
                showText: false,
                //Type: Number.
                //Default: 300
                //Sets the duration of the progress bar's animation.
                animationDuration: 300,
                // gets or sets whether the progress bar is disabled.
                disabled: false,
                rtl: false,
                renderText: null,
                template: "",
                aria:
                {
                    "aria-valuenow": { name: "value", type: "number" },
                    "aria-disabled": { name: "disabled", type: "boolean" }
                },
                // Progress Bar events.
                events:
                [
                // occurs when the value is changed.
                   'valueChanged',
                // occurs when the value is invalid.
                   'invalidValue',
                // occurs when the value becomes equal to the maximum value.
                   'complete',
                // occurs when the value is changed.
                   'change'
                ]
            }
            $.extend(true, this, settings);
            return settings;
        },

        // creates a new jqxProgressBar instance.
        createInstance: function (args) {

            var self = this;

            this.host.addClass(this.toThemeProperty("jqx-progressbar"));
            this.host.addClass(this.toThemeProperty("jqx-widget"));
            this.host.addClass(this.toThemeProperty("jqx-widget-content"));
            this.host.addClass(this.toThemeProperty("jqx-rc-all"));
            $.jqx.aria(this);
            //console.log(this.host);
            if (this.width != null && this.width.toString().indexOf("px") != -1) {
                this.host.width(this.width);
            }
            else if (this.width != undefined && !isNaN(this.width)) {
                this.host.width(this.width);
            }
            else this.host.width(this.width);

            if (this.height != null && this.height.toString().indexOf("px") != -1) {
                this.host.height(this.height);
            }
            else if (this.height != undefined && !isNaN(this.height)) {
                this.host.height(this.height);
            }
            else this.host.height(this.height);
            this.valueDiv = $("<div></div>").appendTo(this.element);

            this._addRanges();

            this.valueDiv.addClass(this.toThemeProperty("jqx-fill-state-pressed"));
            if (this.template)
            {
                this.valueDiv.addClass(this.toThemeProperty("jqx-" + this.template));
            }

            this.feedbackElementHost = $("<div style='left: 0px; top: 0px; width: 100%; height: 100%; position: absolute;'></div>").appendTo(this.host);

            this.feedbackElement = $("<span class='text'></span>").appendTo(this.feedbackElementHost);
            this.feedbackElement.addClass(this.toThemeProperty('jqx-progressbar-text'));
            this.oldValue = this._value();
            this.refresh();


            $.jqx.utilities.resize(this.host, function () {
                self.refresh();
            });
        },

        _addRanges: function()
        {
            if (this.colorRanges.length != 0)
            {
                var orientation = this.orientation == 'vertical';
                var colors = this.colorRanges;
                var length = colors.length;
                for (var i = 0; i < length; i++)
                {
                    var stop = colors[i].stop;
                    var color = colors[i].color;

                    // stop, color, false, for serial use -> 'length - i' to set z-index
                    this._createColorElements(stop, color, orientation, length - i, i);
                }
            }
        },

        _refreshColorElements: function()
        {
            var hostWidth = this.host.outerWidth();
            var hostHeight = this.host.outerHeight();
            var isVertical = this.orientation == 'vertical';
            for (var i = 0; i < this.colorRanges.length; i++)
            {
                var currentContent = this.colorRanges[i].element;
                if (!currentContent)
                {
                    this.host.find(".jqx-progressbar-range").remove();
                    this._addRanges();
                    return;
                }

                var stop = this.colorRanges[i].stop;
                if (stop > Math.min(this.max, this.value))
                {
                    stop = Math.min(this.max, this.value);
                }

                var percentage = 100 * (stop - this.min) / (this.max - this.min);
                if (!isVertical)
                {
                    size = hostWidth * percentage / 100;
                }
                else
                {
                    size = hostHeight * percentage / 100;
                }

                size += "px";
                if (isVertical)
                {
                    currentContent.css('height', size);
                    if (this.layout == 'reverse')
                    {
                        currentContent.css('bottom', 0);
                    } else
                    {
                        currentContent.css('top', 0);
                    }

                } else
                {
                    currentContent.css('width', size);
                    if (this.rtl || this.layout == "reverse")
                    {
                        currentContent.css('right', '0px');
                    }

                }
            }
        },

        _createColorElements: function (stop, color, isVertical, serial, index) {            
            var size;
            if (stop > Math.min(this.max, this.value))
            {
                stop = Math.min(this.max, this.value);
            }

            var percentage = 100 * stop / this.max;
            var hostWidth = this.host.width();
            var hostHeight = this.host.height();
            if (!isVertical)
            {
                size = this.host.outerWidth() * percentage / 100;
            }
            else
            {
                size = this.host.outerHeight() * percentage / 100;
            }

            size += "px";
            var parentValueDiv = $(this.valueDiv).parent()[0];
            parentValueDiv.style.position = 'relative';

            isVertical = isVertical || false;
            
            if (isVertical) {
                // - Vertical -
                var currentContent = $('<div/>');
                currentContent.attr('class', 'jqx-progressbar-range');
                currentContent.css('width', '100%');
                currentContent.css('height', size);
                currentContent.css('background-color', color);
                currentContent.css('position', 'absolute'); /// 'relative'; 'absolute'
                currentContent.css('z-index', serial);
                if (this.layout == 'reverse') {
                    currentContent.css('bottom', 0);
                } else {
                    currentContent.css('top', 0);
                }
                               
                //currentContent.css('margin-top', '' + (-this.width) + 'px');
                //currentContent.appendTo(this.valueDiv);
                currentContent.appendTo(parentValueDiv);
            } else {
                // - Horizontal -
                var currentContent = $('<div/>');
                currentContent.attr('class', 'jqx-progressbar-range');
                currentContent.css('width', size);
                currentContent.css('height', '100%');
                currentContent.css('background-color', color);
                currentContent.css('position', 'absolute'); /// 'relative'; 'absolute'
                currentContent.css('z-index', serial);
                currentContent.css('top', '0px');

                //console.log(this.rtl);
                if (this.rtl) {
                    currentContent.css('right', '0px');
                }

                //currentContent.appendTo(this.valueDiv);
                currentContent.appendTo(parentValueDiv);
            }
            this.colorRanges[index].element = currentContent;
            //return content;
        },

        resize: function (width, height) {
            this.width = width;
            this.height = height;
            this.refresh();
        },

        destroy: function () {
            this.host.removeClass();
            this.valueDiv.removeClass();
            this.valueDiv.remove();
            this.feedbackElement.remove();
        },

        _raiseevent: function (id, oldValue, newValue) {
            if (this.isInitialized != undefined && this.isInitialized == true) {
                var evt = this.events[id];
                var event = new $.Event(evt);
                event.previousValue = oldValue;
                event.currentValue = newValue;
                event.owner = this;
                var result = this.host.trigger(event);
                return result;
            }
        },

        // gets or sets the progress bar value.
        // @param Number. Represents the new value
        actualValue: function (newValue) {
            if (newValue === undefined) {
                return this._value();
            }

            $.jqx.aria(this, "aria-valuenow", newValue);
            $.jqx.setvalueraiseevent(this, 'value', newValue);

            return this._value();
        },

        val: function (value) {
            if (arguments.length == 0 || typeof (value) == "object") {
                return this.actualValue();
            }

            return this.actualValue(value);
        },

        propertiesChangedHandler: function (object, oldValues, newValues)
        {
            if (newValues && newValues.width && newValues.height && Object.keys(newValues).length == 2)
            {
                object.host.width(newValues.width);
                object.host.height(newValues.height);
                object.refresh();
            }
        },

        propertyChangedHandler: function (object, key, oldValue, value) {
            if (!this.isInitialized)
                return;

            if (oldValue == value)
                return;

            if (object.batchUpdate && object.batchUpdate.width && object.batchUpdate.height && Object.keys(object.batchUpdate).length == 2)
            {
                return;
            }

            var widget = this;

            if (key == "colorRanges")
            {
                object.host.find('.jqx-progressbar-range').remove();
                object._addRanges();
            }
            if (key == "min" && object.value < value) {
                object.value = value;
            }
            else if (key == "max" && object.value > value) {
                object.value = value;
            }

            if (key === "value" && widget.value != undefined) {
                widget.value = value;
                widget.oldValue = oldValue;
                $.jqx.aria(object, "aria-valuenow", value);

                if (value < widget.min || value > widget.max) {
                    widget._raiseevent(1, oldValue, value);
                }

                widget.refresh();
            }
            if (key == 'theme') {
                $.jqx.utilities.setTheme(oldValue, value, object.host);
            }
            if (key == "renderText" || key == "orientation" || key == 'layout' || key == "showText" || key == "min" || key == "max") {
                widget.refresh();
            }
            else if (key == "width" && widget.width != undefined) {
                if (widget.width != undefined && !isNaN(widget.width)) {
                    widget.host.width(widget.width);
                    widget.refresh();
                }
            }
            else if (key == "height" && widget.height != undefined) {
                if (widget.height != undefined && !isNaN(widget.height)) {
                    widget.host.height(widget.height);
                    widget.refresh();
                }
            }
            if (key == "disabled")
                widget.refresh();
        },

        _value: function () {
            var val = this.value;
            // normalize invalid value
            if (typeof val !== "number") {
                var result = parseInt(val);
                if (isNaN(result)) {
                    val = 0;
                }
                else val = result;
            }
            return Math.min(this.max, Math.max(this.min, val));
        },

        _percentage: function () {
            return 100 * (this._value() - this.min) / (this.max - this.min);
        },

        _textwidth: function (text) {
            var measureElement = $('<span>' + text + '</span>');
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

        _initialRender: true,

        refresh: function (initialRefresh)
        {
            if (initialRefresh === true)
                return;

            var value = this.actualValue();
            var percentage = this._percentage();

            if (this.disabled) {
                this.host.addClass(this.toThemeProperty('jqx-progressbar-disabled'));
                this.host.addClass(this.toThemeProperty('jqx-fill-state-disabled'));
                return;
            }
            else {
                this.host.removeClass(this.toThemeProperty('jqx-progressbar-disabled'));
                this.host.removeClass(this.toThemeProperty('jqx-fill-state-disabled'));
                $(this.element.children[0]).show();
            }

            if (isNaN(value)) {
                return;
            }

            if (isNaN(percentage)) {
                return;
            }

            if (this.oldValue !== value) {
                this._raiseevent(0, this.oldValue, value);
                this._raiseevent(3, this.oldValue, value);
                this.oldValue = value;
            }
            var oldValue = this.oldValue;
            var height = this.host.outerHeight();
            var width = this.host.outerWidth();

            if (this.width != null) {
                width = parseInt(this.width);
            }
            if (this.height != null) {
                height = parseInt(this.height);
            }

            this._refreshColorElements();

            var halfWidth = parseInt(this.host.outerWidth()) / 2;
            var halfHeight = parseInt(this.host.outerHeight()) / 2;

            if (isNaN(percentage))
                percentage = 0;

            this.valueDiv.removeClass(this.toThemeProperty("jqx-progressbar-value-vertical jqx-progressbar-value"));
            if (this.orientation == 'horizontal') {
                this.valueDiv.width(0);
                this.valueDiv[0].style.height = "100%";
                this.valueDiv.addClass(this.toThemeProperty("jqx-progressbar-value"));
            }
            else {
                this.valueDiv[0].style.width = "100%";
                this.valueDiv.height(0);
                this.valueDiv.addClass(this.toThemeProperty("jqx-progressbar-value-vertical"));
            }

            var me = this;
            try {
                var valueElement = this.element.children[0];
                $(valueElement)[0].style.position = 'relative'; // |not changed| 'absolute'; //'relative';

                if (this.orientation == "horizontal") {
                    $(valueElement).toggle(value >= this.min)

                    var width = this.host.outerWidth() * percentage / 100;
                    var offsetLeft = 0;
                    if (this.layout == 'reverse' || this.rtl) {
                        if (this._initialRender) {
                            $(valueElement)[0].style.left = this.host.width() + 'px';
                            $(valueElement)[0].style.width = 0;
                        }
                        offsetLeft = this.host.outerWidth() - width;
                    }
                    $(valueElement).stop();
                    $(valueElement).animate({ width: width, left: offsetLeft + 'px' }, this.animationDuration, function () {
                        if (me._value() === me.max) {
                            me._raiseevent(2, oldValue, me.max);
                        }
                    }
                    );

             //       this.feedbackElementHost.css('margin-top', -this.host.height());
                }
                else {
                    $(valueElement).toggle(value >= this.min)
                    var height = this.host.height() * percentage / 100;
                    var offsetTop = 0;
                    if (this.layout == 'reverse') {
                        if (this._initialRender) {
                            $(valueElement)[0].style.top = this.host.height() + 'px';
                            $(valueElement)[0].style.height = 0;
                        }
                        offsetTop = this.host.height() - height;
                    }

            //        this.feedbackElementHost.css('margin-top', -this.host.height());

                 //   this.feedbackElementHost.animate({ 'margin-top': -(percentage.toFixed(0) * me.host.height()) / 100 }, this.animationDuration, function () { });

                    $(valueElement).stop();
                    $(valueElement).animate({ height: height, top: offsetTop + 'px' }, this.animationDuration, function () {
                        var percentage = me._percentage();
                        if (isNaN(percentage))
                            percentage = 0;

                        if (percentage.toFixed(0) == me.min) {
                            $(valueElement).hide();
                            if (me._value() === me.max) {
                                me._raiseevent(2, oldValue, me.max);
                            }
                        }
                    });

                }
            }
            catch (ex) {
            }

            this._initialRender = false;

            this.feedbackElement
			    .html(percentage.toFixed(0) + "%")
                .toggle(this.showText == true);

            if (this.renderText)
                this.feedbackElement.html(this.renderText(percentage.toFixed(0) + "%", percentage));

            // Change position from absolute [original] to relative
            this.feedbackElement.css('position', 'absolute');
            this.feedbackElement.css('top', '50%');
            this.feedbackElement.css('left', '0');
            if (this.colorRanges.length > 0)
            {
                this.feedbackElement.css('z-index', this.colorRanges.length + 1)
            }
            var textHeight = this.feedbackElement.height();
            var textWidth = this.feedbackElement.width();
            var centerWidth = Math.floor(halfWidth - (parseInt(textWidth) / 2));

            this.feedbackElement.css({ "left": (centerWidth), "margin-top": -parseInt(textHeight) / 2 + 'px' });
        }
    });
})(jqxBaseFramework);
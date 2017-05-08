//****************************************
// Analog Waveform data type
// National Instruments Copyright 2016
//****************************************

(function () {
    'use strict';
    var NITimestamp = window.NITimestamp;

    var NIAnalogWaveform = function (value) {
        if (typeof value === 'string') {
            try {
                value = JSON.parse(value);
            } catch (e) {
                throw 'Can\'t create an analog waveform from this value';
            }
            // falltrough, value is now an object parsed from the string,
        }

        if (value instanceof NIAnalogWaveform) {
            this.t0 = new NITimestamp(value.t0 || '0.0');
            this.channelName = value.channelName;
            this.dt = value.dt;
            this.Y = value.Y;
        } else if (typeof value === 'object') {
            this.t0 = new NITimestamp(value.t0 || '0.0');
            this.channelName = value.channelName;
            this.dt = value.dt || 0;
            this.Y = value.Y;
        } else if (value === undefined) {
            this.dt = 0;
            this.Y = [];
            this.t0 = new NITimestamp();
        } else {
            throw 'Can\'t create an analog aveform from this value';
        }
    };

    var proto = NIAnalogWaveform.prototype;

    proto.sampleCount = function () {
        return this.Y.length;
    };

    // convert the waveform to an array of [timestamp, value] pairs
    proto.toTimeAndValueArray = function () {
        var res = [];
        for (var i = 0, ts = this.t0; i < this.Y.length; i++, ts = ts.add(this.dt)) {
            res.push([ts.toAbsoluteTime(), this.Y[i]]);
        }

        return res;
    };

    proto.appendArray = function (arr) {
        if (Array.isArray(arr)) {
            for (var i = 0; i < arr.length; i++) {
                this.Y.push(arr[i]);
            }
        }
    };

    // append a waveform
    proto.appendWaveform = function (waveform) {
        if (waveform instanceof NIAnalogWaveform) {
            if (waveform.dt !== this.dt) {
                // we cannot merge two waveforms with different sampling rates. Discard the old one and use the new one.
                this.t0 = waveform.t0;
                this.dt = waveform.dt;
                this.Y = waveform.Y.slice(0);
            } else {
                var expectedT0 = new window.NITimestamp(this.t0).add(this.dt * this.sampleCount());
                if (waveform.t0.compare(expectedT0) === 0) {
                    // append waveform data
                    this.appendArray(waveform.Y);
                } else {
                    // we don't support gaps in waveforms yet
                    this.t0 = waveform.t0;
                    this.dt = waveform.dt;
                    this.Y = waveform.Y.slice(0);
                }
            }
        }
    };

    window.NIAnalogWaveform = NIAnalogWaveform;
}());

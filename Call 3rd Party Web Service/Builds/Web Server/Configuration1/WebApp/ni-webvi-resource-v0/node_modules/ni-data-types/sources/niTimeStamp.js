//****************************************
// NITimestamp data type
// National Instruments Copyright 2016
//****************************************

(function () {
    'use strict';

    var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
    var epochDiffInSeconds = 2082844800; //the difference between JS epoch (1970) and LV Epoch (1904) in seconds.
    var JSEpochInSeconds = 62135596800;

    /* A NITimestamp can be created with no param, and with different types of parameters:
         1. a string in the format '123:567890' where
             the first part is an INT64 serialized to a decimal string, representing the nr. of seconds realtive to LV Epoch
             the second part is a INT 64 reprezenting the fractional part
         2. a javascript Date
         3. a double number
         4. a NITimestamp
    */
    var NITimestamp = function (value) {
        var timeInMilliSeconds, timeInSeconds, remainder;
        this.epochDiffInSeconds = epochDiffInSeconds; // TODO verify it and make it private

        if (typeof value === 'string') {
            var parts = value.split(':');
            this.seconds = Math.floor(parseFloat(parts[0]));
            var fractionalPart = parseFloat(parts[1]);

            if (fractionalPart > 18446744073709550000) {
                fractionalPart = 18446744073709550000;
            }

            this.fractions = Math.ceil(fractionalPart / 2048) / (MAX_SAFE_INTEGER + 1);
        } else if (value instanceof Date) {
            timeInMilliSeconds = value.getTime();
            timeInSeconds = Math.floor(timeInMilliSeconds / 1000);
            this.seconds = timeInSeconds + this.epochDiffInSeconds;
            // JS % operator returns negative result if divisor is negative. This makes it positive.
            remainder = ((timeInMilliSeconds % 1000) + 1000) % 1000;
            this.fractions = remainder / 1000;
        } else if (typeof value === 'number') {
            timeInSeconds = Math.floor(value);
            this.seconds = timeInSeconds;
            this.fractions = value - timeInSeconds;
        } else if (value instanceof NITimestamp) {
            /*copy the timestamp*/
            this.seconds = value.seconds;
            this.fractions = value.fractions;
        } else {
            this.seconds = 0.0;
            this.fractions = 0.0;
        }
    };

    var proto = NITimestamp.prototype;

    proto.toString = function () {
        return '' + Math.floor(this.seconds) + ':' + Math.round(this.fractions * (MAX_SAFE_INTEGER + 1) * 2048);
    };

    proto.toJSON = function () {
        return this.toString();
    };

    proto.toDate = function () {
        return new Date((this.seconds - this.epochDiffInSeconds + this.fractions) * 1000);
    };

    proto.valueOf = function () {
        return this.seconds + this.fractions;
    };

    /*calculates the seconds passed since the Gregorian epoch for this timestamp*/
    proto.toAbsoluteTime = function () {
        return this.seconds + this.fractions + JSEpochInSeconds - epochDiffInSeconds;
    };

    proto.compare = function (timestamp) {
        if (this.seconds < timestamp.seconds) {
            return -1;
        } else if (this.seconds > timestamp.seconds) {
            return 1;
        } else {
            if (this.fractions < timestamp.fractions) {
                return -1;
            } else if (this.fractions > timestamp.fractions) {
                return 1;
            } else {
                return 0;
            }
        }
    };

    proto.add = function (dt) {
        this.seconds += Math.floor(dt);
        var fraction = dt - Math.floor(dt);
        fraction += this.fractions;
        if (fraction >= 1) {
            fraction -= 1;
            this.seconds += 1;
        }

        this.fractions = fraction;

        return this; //enable chaining
    };

    window.NITimestamp = NITimestamp;
}());

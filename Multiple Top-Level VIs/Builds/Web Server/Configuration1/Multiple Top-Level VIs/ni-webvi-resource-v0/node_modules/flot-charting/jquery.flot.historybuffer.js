/* history buffer data structure for charting.

Copyright (c) 2007-2015 National Instruments
Licensed under the MIT license.
*/
/*globals CBuffer, SegmentTree, module*/

/**
# HistoryBuffer

> A historyBuffer is a data structure that enables efficient charting operations
on a sliding window of data points.

In the case of large data buffers it is inefficient to draw every point of the
chart. Doing this results in many almost vertical lines drawn over the same
stripe of pixels over and over again. Drawing a line on a canvas is an expensive
operation that must be avoided if possible.

One method of avoiding the repeated drawing is to reduce the amount of data points
we draw on the chart by sub-sampling the data, also called decimation.

There are many ways to decimate the data; the one this history buffer implements
is to divide data into "1 pixel wide buckets" and then for each bucket select the
maximum and minimum as subsamples. This method results in a drawing that looks
visually similar with the one in which all samples are drawn.

The history buffer is a circular buffer holding the chart data accompanied by an
acceleration structure - a segment tree of min/max values.

The segment tree is only enabled for big history buffers.

The history buffer is able to store multiple "parallel" data sets

Example:
```javascript
var hb1 = new HistoryBuffer(1024);

// in a history buffer with width 1 we can push scalars
hb1.push(1);
hb1.push(2);

console.log(hb1.toArray()); //[1, 2]

// as well as 1 elements arrays
hb1.push([3]);
hb1.push([4]);

console.log(hb1.toArray()); //[1, 2, 3, 4]

var hb1 = new HistoryBuffer(1024, 2);

// in a history buffer with width > 1 we can only push arrays
hb1.push([1, 5]);
hb1.push([2, 6]);

console.log(hb2.toArray()); //[[1, 5], [2, 6]]
```

*/

/** ## HistoryBuffer methods*/
(function (global) {
    'use strict';

    /* The branching factor determines how many samples are decimated in a tree node.
     * It affects the performance and the overhead of the tree.
     */
    var defaultBranchFactor = 32; // 32 for now. TODO tune the branching factor.

    /** **HistoryBuffer(capacity, width)** - the History buffer constructor creates
    a new history buffer with the specified capacity (default: 1024) and width (default: 1)*/
    var HistoryBuffer = function (capacity, width) {
        this.capacity = capacity || 1024;
        this.width = width || 1;
        this.lastUpdatedIndex = 0;
        this.firstUpdatedIndex = 0;
        this.branchFactor = defaultBranchFactor;

        this.buffers = []; // circular buffers for data
        this.trees = []; // segment trees

        for (var i = 0; i < this.width; i++) {
            this.buffers.push(new CBuffer(capacity));
            this.trees.push(new SegmentTree(this, this.buffers[i]));
        }

        this.buffer = this.buffers[0];
        this.tree = this.trees[0];

        this.count = 0;
        this.callOnChange = undefined;
        this.changed = false;
    };

    HistoryBuffer.prototype.setBranchingFactor = function (b) {
        this.branchFactor = b;

        this.rebuildSegmentTrees();
    };

    HistoryBuffer.prototype.getDefaultBranchingFactor = function () {
        return defaultBranchFactor;
    };

    HistoryBuffer.prototype.rebuildSegmentTrees = function () {
        this.trees = []; // new segment trees

        for (var i = 0; i < this.width; i++) {
            this.trees.push(new SegmentTree(this, this.buffers[i]));
        }

        this.tree = this.trees[0];

        this.firstUpdatedIndex = this.startIndex();
        this.lastUpdatedIndex = this.firstUpdatedIndex;

        this.updateSegmentTrees();
    };

    /** **clear()** - clears the history buffer */
    HistoryBuffer.prototype.clear = function () {
        for (var i = 0; i < this.width; i++) {
            this.buffers[i].empty();
        }

        this.count = 0; // todo fire changes and upate lastindex, startindex
        this.rebuildSegmentTrees();
        this.changed = true;
        if (this.callOnChange) {
            this.callOnChange();
        }
    };

    /** **setCapacity(newCapacity)** changes the capacity of the History Buffer and clears all the data inside it */
    HistoryBuffer.prototype.setCapacity = function (newCapacity) {
        if (newCapacity !== this.capacity) {
            this.capacity = newCapacity;
            this.buffers = []; // circular buffers for data

            for (var i = 0; i < this.width; i++) {
                this.buffers.push(new CBuffer(newCapacity));
            }

            this.buffer = this.buffers[0];
            this.count = 0; // todo fire changes and upate lastindex, startindex
            this.rebuildSegmentTrees();
            this.changed = true;
            if (this.callOnChange) {
                this.callOnChange();
            }
        }
    };

    /** **setWidth(newWidth)** - changes the width of the History Buffer and clears
    all the data inside it */
    HistoryBuffer.prototype.setWidth = function (newWidth) {
        if (newWidth !== this.width) {
            this.width = newWidth;
            this.buffers = []; // clear the circular buffers for data. TODO reuse the buffers

            for (var i = 0; i < this.width; i++) {
                this.buffers.push(new CBuffer(this.capacity));
            }

            this.buffer = this.buffers[0];
            this.count = 0; // todo fire changes and upate lastindex, startindex
            this.rebuildSegmentTrees();
            this.changed = true;
            if (this.callOnChange) {
                this.callOnChange();
            }
        }
    };

    /* store an element in the history buffer, don't update stats */
    HistoryBuffer.prototype.pushNoStatsUpdate = function (item) {
        if (typeof item === 'number' && this.width === 1) {
            this.buffer.push(item);
        } else {
            if (Array.isArray(item) && item.length === this.width) {
                for (var i = 0; i < this.width; i++) {
                    this.buffers[i].push(item[i]);
                }
            }
        }
    };

    /** **push(item)** - adds an element to the history buffer */
    HistoryBuffer.prototype.push = function (item) {
        this.pushNoStatsUpdate(item);
        this.count++;

        this.changed = true;
        if (this.callOnChange) {
            this.callOnChange();
        }

    };

    /** **startIndex()** - returns the index of the oldest element in the buffer*/
    HistoryBuffer.prototype.startIndex = function () {
        return Math.max(0, this.count - this.capacity);
    };

    /** **lastIndex()** - returns the index of the newest element in the buffer*/
    HistoryBuffer.prototype.lastIndex = function () {
        return this.startIndex() + this.buffer.size;
    };

    /** **get(n)** - returns the nth element in the buffer*/
    HistoryBuffer.prototype.get = function (index) {
        index -= this.startIndex();
        if (this.width === 1) {
            return this.buffer.get(index);
        } else {
            var res = [];

            for (var i = 0; i < this.width; i++) {
                res.push(this.buffers[i].get(index));
            }

            return res;
        }
    };

    /** **appendArray(arr)** - appends an array of elements to the buffer*/
    HistoryBuffer.prototype.appendArray = function (arr) {
        for (var i = 0; i < arr.length; i++) {
            this.pushNoStatsUpdate(arr[i]);
        }

        this.count += arr.length;

        this.changed = true;
        if (this.callOnChange) {
            this.callOnChange();
        }
    };

    /* get the tree nodes at the specified level that keeps the information for the specified interval*/
    HistoryBuffer.prototype.getTreeNodes = function (level, start, end) {
        var nodes = [];
        var treeLevel = this.tree.levels[level];
        var levelStep = treeLevel.step;

        var levelIndex = Math.floor((start - treeLevel.startIndex) / levelStep);

        if ((levelIndex < 0) || (levelIndex >= treeLevel.capacity) || levelIndex > end) {
            return nodes;
        }

        while (levelIndex < end) {
            if (levelIndex >= start) {
                nodes.push(treeLevel.nodes.get(levelIndex));
            }

            levelIndex += treeLevel.step;
        }

        return nodes;
    };

    /** **toArray()** - returns the content of the history buffer as an array */
    HistoryBuffer.prototype.toArray = function () {
        if (this.width === 1) {
            return this.buffer.toArray();
        } else {
            var start = this.startIndex(),
                last = this.lastIndex(),
                res = [];
            for (var i = start; i < last; i++) {
                res.push(this.get(i));
            }

            return res;
        }
    };

    /* update the segment tree with the newly added values*/
    HistoryBuffer.prototype.updateSegmentTrees = function () {
        var buffer = this.buffer;

        this.trees.forEach(function (tree) {
            tree.updateSegmentTree();
        });

        this.firstUpdatedIndex = this.startIndex();
        this.lastUpdatedIndex = this.firstUpdatedIndex + buffer.size;
    };

    /** **toDataSeries()** - returns the content of the history buffer into a
    flot data series*/
    HistoryBuffer.prototype.toDataSeries = function (index) {
        var buffer = this.buffer;

        var data = [];

        var start = this.startIndex();

        for (var i = 0; i < buffer.size; i++) {
            data.push([i + start, this.buffers[index || 0].get(i)]);
        }

        return data;
    };

    HistoryBuffer.prototype.onChange = function (f) {
        this.callOnChange = f;
    };

    /** **query(start, end, step, index)** - decimates the data set at the
    provided *index*, starting at the start sample, ending at the end sample
    with the provided step */
    HistoryBuffer.prototype.query = function (start, end, step, index) {
        if (index === undefined) {
            index = 0;
        }

        if (this.changed) {
            this.updateSegmentTrees();
            this.changed = false;
        }

        return this.trees[index].query(start, end, step);
    };

    if (typeof module === 'object' && module.exports) {
        module.exports = HistoryBuffer;
    } else {
        global.HistoryBuffer = HistoryBuffer;
    }
})(this);

/* Segment tree data structure for fast min/max queries

Copyright (c) 2007-2015 National Instruments
Licensed under the MIT license.
*/
/*globals CBuffer, module*/

(function (global) {
    'use strict';

    /* a TreeNode object keeps information about min and max values in the subtree below it*/
    var SegmentTreeNode = function () {
        this.init();
    };

    /* a SegmentTree holds the data used for accelerated query of the history buffer*/
    var SegmentTree = function (hb, cbuffer) {
        this.historyBuffer = hb;
        this.cbuffer = cbuffer;
        this.tree = this.buildEmptySegmentTree();
    };

    SegmentTreeNode.prototype.init = function () {
        this.maxIndex = 0;
        this.minIndex = 0;
        this.max = Math.Nan;
        this.min = Math.Nan;
    };

    /* a tree level is a heap of tree nodes at a certain depth in the tree*/
    var SegmentTreeLevel = function (historyBuffer, level) {
        this.level = level;
        this.step = Math.pow(historyBuffer.branchFactor, level);
        this.capacity = Math.ceil(historyBuffer.capacity / (Math.pow(historyBuffer.branchFactor, level))) + 1;
        this.startIndex = 0;
        this.nodes = new CBuffer(this.capacity);
    };

    /* rotate the nodes in the TreeLevel to the left.*/
    SegmentTreeLevel.prototype.rotate = function () {
        this.startIndex += this.step;

        var oldestNode = this.nodes.shift(); //reuse the tree nodes to reduce GC
        oldestNode.init();
        this.nodes.push(oldestNode);
    };

    /* reinitialize the nodes in the TreeLevel.*/
    SegmentTreeLevel.prototype.init = function (startIndex) {
        this.startIndex = startIndex;

        this.nodes.forEach(function (node) {
            node.init();
        });
    };

    /*get the nth element in the buffer*/
    SegmentTree.prototype.get = function (index) {
        index -= this.historyBuffer.startIndex();
        return this.cbuffer.get(index);
    };

    /* get the tree node at the specified level that keeps the information for the specified index*/
    SegmentTree.prototype.getTreeNode = function (level, index) {
        var treeLevel = this.tree.levels[level];
        var levelStep = treeLevel.step;
        var levelIndex = Math.floor((index - treeLevel.startIndex) / levelStep);

        if ((levelIndex < 0) || (levelIndex >= treeLevel.capacity)) {
            return null;
        }

        var node = treeLevel.nodes.get(levelIndex);

        return node;
    };

    /* builds an empty acceleration tree*/
    SegmentTree.prototype.buildEmptySegmentTree = function () {
        var hb = this.historyBuffer;
        var depth = Math.ceil(Math.log(hb.capacity) / Math.log(hb.branchFactor)) - 1;
        if (depth < 1) {
            depth = 1;
        }

        var tree = {
            depth: depth,
            levels: []
        };

        for (var i = 0; i < depth; i++) {
            var tLevel = new SegmentTreeLevel(hb, i + 1);
            tree.levels.push(tLevel);
            for (var j = 0; j < tLevel.capacity; j++) {
                var node = new SegmentTreeNode();
                tLevel.nodes.push(node);
            }
        }

        return tree;
    };

    /*
     * Populate the upper levels of the tree, starting at the startingFromIndex.
     * All the tree levels should be already shifted as necessary before calling this function.
     */
    SegmentTree.prototype.populateTreeLevel = function (startingFrom, level) {
        var hb = this.historyBuffer;
        var cbuffer = this.cbuffer;
        var startIndex = hb.startIndex(); // cache it
        var lastIndex = hb.lastIndex(); // cache it
        var currentCount = 0;
        var i = 0;
        var firstSample = true;
        var node, max, maxIndex, min, minIndex;

        var minusOneLevel = {
            step: 1,
            startIndex: startIndex
        };

        var baseLevel = (level === 0) ? minusOneLevel : this.tree.levels[level - 1];
        var currentLevel = this.tree.levels[level];

        /* align starting from to a node in the base level boundary*/
        startingFrom = floorInBase(startingFrom, currentLevel.step);

        if (baseLevel.startIndex > startingFrom) {
            startingFrom = baseLevel.startIndex;
            currentCount = (startingFrom / baseLevel.step) % hb.branchFactor;
        }

        for (i = startingFrom; i < lastIndex; i += baseLevel.step) {
            if (level === 0) {
                var val = cbuffer.get(i - startIndex);

                if (firstSample) {
                    max = val;
                    maxIndex = i;
                    min = val;
                    minIndex = i;

                    firstSample = false;
                } else {
                    if (val > max) {
                        max = val;
                        maxIndex = i;
                    }

                    if (val < min) {
                        min = val;
                        minIndex = i;
                    }
                }
            } else {
                var cNode = this.getTreeNode(level - 1, i);

                if (firstSample) {
                    max = cNode.max;
                    maxIndex = cNode.maxIndex;
                    min = cNode.min;
                    minIndex = cNode.minIndex;
                    firstSample = false;
                } else {
                    if (cNode.max > max) {
                        max = cNode.max;
                        maxIndex = cNode.maxIndex;
                    }

                    if (cNode.min < min) {
                        min = cNode.min;
                        minIndex = cNode.minIndex;
                    }
                }
            }

            currentCount++;

            if (currentCount === hb.branchFactor) {
                currentCount = 0;
                firstSample = true;
                node = this.getTreeNode(level, i);

                node.max = max;
                node.maxIndex = maxIndex;
                node.min = min;
                node.minIndex = minIndex;
            }
        }

        if (currentCount !== 0) {
            node = this.getTreeNode(level, i);

            node.max = max;
            node.maxIndex = maxIndex;
            node.min = min;
            node.minIndex = minIndex;
        }
    };

    /* Rotate the history buffer to the left, updating the leftmost nodes in the tree with the new mins and maxes*/
    SegmentTree.prototype.rotateTreeLevel = function (level) {
        var hb = this.historyBuffer;

        var startingIndex = hb.startIndex();
        var treeLevel = this.tree.levels[level];

        var alignedStartIndex = floorInBase(startingIndex, treeLevel.step);

        if (alignedStartIndex - treeLevel.startIndex > hb.capacity) {
            treeLevel.init(alignedStartIndex);
        } else {
            while (treeLevel.startIndex < alignedStartIndex) {
                treeLevel.rotate();
            }
        }

        /* update the first node in the level */
        if (startingIndex !== alignedStartIndex) {
            var minmax = {
                minIndex: startingIndex,
                min: this.get(startingIndex),
                maxIndex: startingIndex,
                max: this.get(startingIndex)
            };

            var i;
            var firstNode = treeLevel.nodes.get(0);

            if (level === 0) {
                for (i = startingIndex; i < (alignedStartIndex + hb.branchFactor); i++) {
                    updateMinMaxFromValue(i, this.get(i), minmax);
                }
            } else {
                for (i = startingIndex; i < (alignedStartIndex + treeLevel.step); i += treeLevel.step / hb.branchFactor) {
                    updateMinMaxFromNode(this.getTreeNode(level - 1, i), minmax);
                }
            }

            firstNode.minIndex = minmax.minIndex;
            firstNode.min = minmax.min;
            firstNode.maxIndex = minmax.maxIndex;
            firstNode.max = minmax.max;
        }
    };

    SegmentTree.prototype.updateSegmentTree = function () {
        var level;

        for (level = 0; level < this.tree.depth; level++) {
            this.rotateTreeLevel(level);
        }

        for (level = 0; level < this.tree.depth; level++) {
            this.populateTreeLevel(this.historyBuffer.lastUpdatedIndex, level);
        }

    };

    SegmentTree.prototype.readMinMax = function (start, end, minmax) {
        var intervalSize = end - start;
        var hb = this.historyBuffer;
        var startIndex = hb.startIndex();
        var cbuffer = this.cbuffer;

        var i;

        var level = Math.floor(Math.log(intervalSize) / Math.log(hb.branchFactor));

        if (level === 0) {
            for (i = start; i < end; i++) {
                updateMinMaxFromValue(i, cbuffer.get(i - startIndex), minmax);
            }

            return minmax;
        }

        var step = Math.pow(hb.branchFactor, level);
        var truncatedStart = Math.ceil(start / step) * step;
        var truncatedEnd = floorInBase(end, step);

        if (start !== truncatedStart) {
            this.readMinMax(start, truncatedStart, minmax);
        }

        var truncatedBufferStart = floorInBase(startIndex, step);
        var begin = (truncatedStart - truncatedBufferStart) / step;
        var finish = (truncatedEnd - truncatedBufferStart) / step;

        for (i = begin; i < finish; i++) {
            updateMinMaxFromNode(this.tree.levels[level - 1].nodes.get(i), minmax);
        }

        if (end !== truncatedEnd) {
            this.readMinMax(truncatedEnd, end, minmax);
        }

        return minmax;
    };

    /* get a decimated series, starting at the start sample, ending at the end sample with a provided step */
    SegmentTree.prototype.query = function (start, end, step) {
        var i;
        var hb = this.historyBuffer;

        var data = [];

        var firstIndex = hb.startIndex();
        var lastIndex = hb.lastIndex();

        if (start < firstIndex) {
            start = firstIndex;
        }

        if (start > lastIndex) {
            start = lastIndex;
        }

        if (end < firstIndex) {
            end = firstIndex;
        }

        if (end > lastIndex) {
            end = lastIndex;
        }

        if (step < 4) { // for small steps it is more efficient to bypass the segment tree. TODO: benchmark this
            for (i = start; i < end; i++) {
                data.push([i, this.get(i)]);
            }
        } else {
            var minmax = new SegmentTreeNode();

            var maxIndex, minIndex;
            for (i = start; i < end; i += step) {
                var partialQueryEnd = Math.min(end, i + step);
                minmax.max = Number.NEGATIVE_INFINITY;
                minmax.min = Number.POSITIVE_INFINITY;
                minmax.minIndex = 0;
                minmax.maxIndex = 0;

                minmax = this.readMinMax(i, partialQueryEnd, minmax);
                maxIndex = minmax.maxIndex;
                minIndex = minmax.minIndex;
                if (minIndex === maxIndex) {
                    data.push([minIndex, minmax.min]);
                } else if (minIndex < maxIndex) {
                    data.push([minIndex, minmax.min]);
                    data.push([maxIndex, minmax.max]);
                } else {
                    data.push([maxIndex, minmax.max]);
                    data.push([minIndex, minmax.min]);
                }
            }
        }

        return data;
    };

    function updateMinMaxFromValue(index, value, minmax) {
        if (value < minmax.min) {
            minmax.min = value;
            minmax.minIndex = index;
        }

        if (value > minmax.max) {
            minmax.max = value;
            minmax.maxIndex = index;
        }
    }

    function updateMinMaxFromNode(node, minmax) {
        if (node.min < minmax.min) {
            minmax.min = node.min;
            minmax.minIndex = node.minIndex;
        }

        if (node.max > minmax.max) {
            minmax.max = node.max;
            minmax.maxIndex = node.maxIndex;
        }
    }

    // round to nearby lower multiple of base
    function floorInBase(n, base) {
        return base * Math.floor(n / base);
    }

    if (typeof module === 'object' && module.exports) {
        module.exports = SegmentTree;
    } else {
        global.SegmentTree = SegmentTree;
    }
})(this);

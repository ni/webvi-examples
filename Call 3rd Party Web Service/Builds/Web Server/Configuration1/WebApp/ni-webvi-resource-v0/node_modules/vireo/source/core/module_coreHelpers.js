// Using a modified UMD module format. Specifically a modified returnExports (no dependencies) version
(function (root, globalName, factory) {
    'use strict';
    var buildGlobalNamespace = function () {
        var buildArgs = Array.prototype.slice.call(arguments);
        return globalName.split('.').reduce(function (currObj, subNamespace, currentIndex, globalNameParts) {
            var nextValue = currentIndex === globalNameParts.length - 1 ? factory.apply(undefined, buildArgs) : {};
            return currObj[subNamespace] === undefined ? (currObj[subNamespace] = nextValue) : currObj[subNamespace];
        }, root);
    };

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as a named module.
        define(globalName, [], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. "CommonJS-like" for environments like Node but not strict CommonJS
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        buildGlobalNamespace();
    }
}(this, 'NationalInstruments.Vireo.Core.assignCoreHelpers', function () {
    'use strict';
    // Static Private Variables (all vireo instances)
    // None

    // Vireo Core Mixin Function
    var assignCoreHelpers = function (Module, publicAPI) {
        Module.coreHelpers = {};
        publicAPI.coreHelpers = {};

        // Private Instance Variables (per vireo instance)
        var fpSync = function (/* fpIdStr*/) {
            // Dummy noop function user can replace by using eggShell.setFPSyncFunction
        };

        var bufferPtr, bufferSize;

        var trackingFPS = false;
        var lastTime = 0;
        var currentFPS = 0;

        // Exported functions
        Module.coreHelpers.jsExecutionContextFPSync = function (fpStringPointer) {
            var fpString = Module.eggShell.dataReadString(fpStringPointer);
            fpSync(fpString);
        };

        publicAPI.coreHelpers.setFPSyncFunction = function (fn) {
            if (typeof fn !== 'function') {
                throw new Error('FPSync must be a callable function');
            }

            fpSync = fn;
        };

        Module.coreHelpers.utf8ArrayToStringWithNull = function (u8Array, idxIn) {
            /* eslint-disable no-continue, no-plusplus, no-bitwise */
            var u0, u1, u2, u3, u4, u5;
            var idx = idxIn;
            var str = '';
            while (true) {
                // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
                u0 = u8Array[idx++];
                if (idx > u8Array.length) {
                    return str;
                }
                if (!(u0 & 0x80)) {
                    str += String.fromCharCode(u0);
                    continue;
                }
                u1 = u8Array[idx++] & 63;
                if ((u0 & 0xE0) === 0xC0) {
                    str += String.fromCharCode(((u0 & 31) << 6) | u1);
                    continue;
                }
                u2 = u8Array[idx++] & 63;
                if ((u0 & 0xF0) === 0xE0) {
                    u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
                } else {
                    u3 = u8Array[idx++] & 63;
                    if ((u0 & 0xF8) === 0xF0) {
                        u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | u3;
                    } else {
                        u4 = u8Array[idx++] & 63;
                        if ((u0 & 0xFC) === 0xF8) {
                            u0 = ((u0 & 3) << 24) | (u1 << 18) | (u2 << 12) | (u3 << 6) | u4;
                        } else {
                            u5 = u8Array[idx++] & 63;
                            u0 = ((u0 & 1) << 30) | (u1 << 24) | (u2 << 18) | (u3 << 12) | (u4 << 6) | u5;
                        }
                    }
                }
                if (u0 < 0x10000) {
                    str += String.fromCharCode(u0);
                } else {
                    var ch = u0 - 0x10000;
                    str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
                }
            }
        };

        // Creating a shared string buffer in memory for passing strings into Vireo
        // WARNING: Functions in Vireo should not expect memory to live beyond stack frame
        // Based on emscripten_run_script_string: https://github.com/kripken/emscripten/blob/fdc57b6f7c76b7e8589a41ad2db867e6878f0f3a/src/library.js#L3831
        Module.coreHelpers.writeJSStringToSharedBuffer = function (str) {
            if (typeof str !== 'string') {
                throw new Error('writeJSStringToSharedBuffer() expects a string input');
            }
            var len = Module.lengthBytesUTF8(str);
            if (!bufferSize || bufferSize < len + 1) {
                if (bufferSize) {
                    Module._free(bufferPtr);
                }
                bufferSize = len + 1;
                bufferPtr = Module._malloc(bufferSize);
            }
            Module.writeStringToMemory(str, bufferPtr);
            return bufferPtr;
        };

        Module.coreHelpers.jsCurrentBrowserFPS = function () {
            if (trackingFPS === false) {
                trackingFPS = true;
                lastTime = performance.now();

                requestAnimationFrame(function vireoFPSTracker (currentTime) {
                    var timeBetweenFrames = currentTime - lastTime;
                    currentFPS = 1000 / timeBetweenFrames;
                    lastTime = currentTime;
                    requestAnimationFrame(vireoFPSTracker);
                });
            }

            return currentFPS;
        };
    };

    return assignCoreHelpers;
}));

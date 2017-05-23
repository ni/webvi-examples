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
}(this, 'NationalInstruments.Vireo.ModuleBuilders.assignHttpClient', function () {
    'use strict';

    /* global Map */

    // Static Private Variables (all vireo instances)
    var TRUE = 1;
    var FALSE = 0;

    var NULL = 0;

    var CODES = {
        // Shared
        NO_ERROR: 0,
        NETWORK_ERROR: -1967370240, // Internal Networking Error, the HTTP Client network errors are too specific
        CLOSE_INVALID_HANDLE: -1967362020, // The provided refnum is invalid
        RECEIVE_INVALID_HANDLE: 1, // An input parameter is invalid
        TIMEOUT: 56, // The network operation exceeded the user-specified or system time limit.
        INVALID_URL: 363500,
        ABORT: 363508,
        HEADER_DOES_NOT_EXIST: 363528,
        HTTP_CLIENT_UNKNOWN_ERROR: 363798,

        // WebVI Specific
        WEBVI_UNSUPPORTED_INPUT: 363798,
        INVALID_HEADER: 363798
    };

    var DEFAULT_TIMEOUT_MS = 10000;
    var TIMEOUT_IMMEDIATELY_MS = 1;

    var HttpClient;
    (function () {
        // Static private reference aliases
        // None

        // Constructor Function
        HttpClient = function (username, password) {
            // Public Instance Properties
            // None

            // Private Instance Properties
            this._username = username;
            this._password = password;
            this._headers = new Map();
        };

        // Static Public Variables
        // None

        // Static Public Functions
        // None

        // Prototype creation
        var child = HttpClient;
        var proto = child.prototype;

        // Static Private Variables
        // None

        // Static Private Functions
        // None

        // Public Prototype Methods
        proto.addHeader = function (header, value) {
            this._headers.set(header, value);
        };

        proto.removeHeader = function (header) {
            this._headers.delete(header);
        };

        // Returns the header with whitespace trimmed if found or undefined if not found
        proto.getHeaderValue = function (header) {
            var ret;

            if (this._headers.has(header)) {
                ret = this._headers.get(header).trim();
            }

            return ret;
        };

        proto.listHeaders = function () {
            var outputHeaders = [];

            this._headers.forEach(function (value, header) {
                outputHeaders.push(header.trim() + ': ' + value.trim());
            });

            // Avoid a trailing \r\n append
            return outputHeaders.join('\r\n');
        };

        proto.createRequest = function (requestData, cb) {
            var request = new XMLHttpRequest();

            // Create event listeners
            var eventListeners = {};

            var completeRequest = function (responseData) {
                // Unregister event listeners
                Object.keys(eventListeners).forEach(function (eventName) {
                    request.removeEventListener(eventName, eventListeners[eventName]);
                });

                cb(responseData);
            };

            // load, error, timeout, and abort are mutually exclusive and one will fire after send
            // See https://xhr.spec.whatwg.org/#suggested-names-for-events-using-the-progressevent-interface
            eventListeners.load = function () {
                // TODO mraj is there a way to get the HTTP version from the request?
                var httpVersion = 'HTTP/1.1';
                var statusLine = httpVersion + ' ' + request.status + ' ' + request.statusText + '\r\n';
                var allResponseHeaders = request.getAllResponseHeaders();

                var header = statusLine + allResponseHeaders;
                completeRequest({
                    header: header,
                    text: request.response,
                    status: request.status,
                    labviewCode: CODES.NO_ERROR,
                    errorMessage: ''
                });
            };

            eventListeners.error = function () {
                completeRequest({
                    header: '',
                    text: '',
                    status: 0,
                    labviewCode: CODES.NETWORK_ERROR,
                    errorMessage: 'Network Error'
                });
            };

            // Desktop does not try and return partial response data in timeout scenarios so do not attempt to here
            eventListeners.timeout = function () {
                completeRequest({
                    header: '',
                    text: '',
                    status: 0,
                    labviewCode: CODES.TIMEOUT,
                    errorMessage: 'Timeout'
                });
            };

            eventListeners.abort = function () {
                completeRequest({
                    header: '',
                    text: '',
                    status: 0,
                    labviewCode: CODES.ABORT,
                    errorMessage: 'Request Aborted'
                });
            };

            // Register event listeners
            Object.keys(eventListeners).forEach(function (eventName) {
                request.addEventListener(eventName, eventListeners[eventName]);
            });

            // Open request to set properties
            try {
                request.open(requestData.method, requestData.url, true, this._username, this._password);
            } catch (ex) {
                // Spec says open should throw SyntaxError but some browsers seem to throw DOMException.
                // Instead of trying to detect, always say invalid url and add message to source
                completeRequest({
                    header: '',
                    text: '',
                    status: 0,
                    labviewCode: CODES.INVALID_URL,
                    errorMessage: ex.message ? ex.message : 'Invalid URL'
                });
                return;
            }

            // Add request headers
            try {
                this._headers.forEach(function (value, header) {
                    request.setRequestHeader(header, value);
                });
            } catch (ex) {
                completeRequest({
                    header: '',
                    text: '',
                    status: 0,
                    labviewCode: CODES.INVALID_HEADER,
                    errorMessage: ex.message ? ex.message : 'Invalid Header'
                });
            }

            // withCredentials allows cookies (to be sent / set), HTTP Auth, and TLS Client certs when sending requests Cross Origin
            // Setting to false so communication to servers with Access-Control-Allow-Origin: *
            // See https://w3c.github.io/webappsec-cors-for-developers/#anonymous-requests-or-access-control-allow-origin
            // TODO mraj: We need a way to expose this configuration to users
            request.withCredentials = false;

            // TODO mraj attempt to use 'ArrayBuffer' for the transfer type to get binary data
            request.responseType = 'text';

            // In IE 11 the timeout property may only be set after calling open and before calling send
            request.timeout = requestData.xhrTimeout;

            // Send request
            if (requestData.buffer === undefined) {
                request.send();
            } else {
                request.send(requestData.buffer);
            }
        };
    }());

    var HttpClientManager;
    (function () {
        // Static private reference aliases
        var noop = function () {
            // Intentionally left blank
        };

        // Constructor Function
        HttpClientManager = function () {
            // Public Instance Properties
            // None

            // Private Instance Properties
            this._httpClients = new Map();
            this._log = noop;
        };

        // Static Public Variables
        // None

        // Static Public Functions
        // None

        // Prototype creation
        var child = HttpClientManager;
        var proto = child.prototype;

        // Static Private Variables
        // None

        // Static Private Functions
        var createHandle = (function () {
            // A handle of zero implies an invalid handle
            var currentHandle = 1;

            return function () {
                var handle = currentHandle;
                currentHandle += 1;
                return handle;
            };
        }());

        // Public Prototype Methods
        proto.enableHttpDebugging = function (enable) {
            this._log = enable ? console.info.bind(console) : noop;
        };

        proto.create = function (username, password) {
            var httpClient = new HttpClient(username, password);
            var handle = createHandle();

            this._httpClients.set(handle, httpClient);
            this._log('[HTTPClient] Created handle:', handle);
            return handle;
        };

        proto.handleExists = function (handle) {
            return this._httpClients.has(handle);
        };

        proto.destroy = function (handle) {
            var httpClient = this._httpClients.get(handle);
            if (httpClient === undefined) {
                return;
            }

            // We do not abort any existing requests with this handle

            this._httpClients.delete(handle);
            this._log('[HTTPClient] Deleted handle:', handle);
        };

        proto.get = function (handle) {
            return this._httpClients.get(handle);
        };
    }());

    // Vireo Core Mixin Function
    var assignHttpClient = function (Module, publicAPI) {
        Module.httpClient = {};
        publicAPI.httpClient = {};

        // Private Instance Variables (per vireo instance)
        var httpClientManager = new HttpClientManager();

        var METHOD_NAMES = ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'];

        var findhttpClientOrWriteError = function (handle, errorSourceIfError, errorStatusPointer, errorCodePointer, errorSourcePointer) {
            var httpClient = httpClientManager.get(handle);

            if (httpClient === undefined) {
                Module.httpClient.mergeErrors(true, CODES.RECEIVE_INVALID_HANDLE, errorSourceIfError + ', Handle Not Found', errorStatusPointer, errorCodePointer, errorSourcePointer);
            }

            return httpClient;
        };

        // Exported functions
        publicAPI.httpClient.enableHttpDebugging = function (enable) {
            if (typeof enable !== 'boolean') {
                throw new Error('Must set HTTP debugging flag to either true or false');
            }

            httpClientManager.enableHttpDebugging(enable);
        };

        Module.httpClient.mergeErrors = function (newErrorStatus, newErrorCode, newErrorSource, existingErrorStatusPointer, existingErrorCodePointer, exisitingErrorSourcePointer) {
            // Follows behavior of merge errors function: https://zone.ni.com/reference/en-XX/help/371361N-01/glang/merge_errors_function/

            var existingErrorStatus = Module.eggShell.dataReadBoolean(existingErrorStatusPointer);
            var existingErrorCode = Module.eggShell.dataReadInt32(existingErrorCodePointer);

            var existingError = existingErrorStatus;
            var newError = newErrorStatus;
            var existingWarning = existingErrorCode !== CODES.NO_ERROR;
            var newWarning = newErrorCode !== CODES.NO_ERROR;

            if (existingError) {
                return;
            }

            if (newError) {
                Module.eggShell.dataWriteBoolean(existingErrorStatusPointer, newErrorStatus);
                Module.eggShell.dataWriteInt32(existingErrorCodePointer, newErrorCode);
                Module.eggShell.dataWriteString(exisitingErrorSourcePointer, newErrorSource);
                return;
            }

            if (existingWarning) {
                return;
            }

            if (newWarning) {
                Module.eggShell.dataWriteBoolean(existingErrorStatusPointer, newErrorStatus);
                Module.eggShell.dataWriteInt32(existingErrorCodePointer, newErrorCode);
                Module.eggShell.dataWriteString(exisitingErrorSourcePointer, newErrorSource);
                return;
            }

            // If no error or warning then pass through
            // Note: merge errors function ignores newErrorSource if no newError or newWarning so replicated here
            return;
        };

        Module.httpClient.jsHttpClientOpen = function (cookieFilePointer, usernamePointer, passwordPointer, verifyServerInt32, handlePointer, errorStatusPointer, errorCodePointer, errorSourcePointer) {
            var errorStatus = Module.eggShell.dataReadBoolean(errorStatusPointer);
            if (errorStatus) {
                return;
            }

            var newErrorSource;
            var cookieFile = Module.eggShell.dataReadString(cookieFilePointer);
            if (cookieFile !== '') {
                newErrorSource = 'LabVIEWHTTPClient:OpenHandle, Cookie File unsupported in WebVIs (please leave as default of empty string)';
                Module.httpClient.mergeErrors(true, CODES.WEBVI_UNSUPPORTED_INPUT, newErrorSource, errorStatusPointer, errorCodePointer, errorSourcePointer);
                return;
            }

            var verifyServer = verifyServerInt32 !== FALSE;
            if (verifyServer !== true) {
                newErrorSource = 'LabVIEWHTTPClient:OpenHandle, Verify Server unsupported in WebVIs (please leave as default of true)';
                Module.httpClient.mergeErrors(true, CODES.WEBVI_UNSUPPORTED_INPUT, newErrorSource, errorStatusPointer, errorCodePointer, errorSourcePointer);
                return;
            }

            var username = Module.eggShell.dataReadString(usernamePointer);
            var password = Module.eggShell.dataReadString(passwordPointer);
            var newHandle = httpClientManager.create(username, password);
            Module.eggShell.dataWriteUInt32(handlePointer, newHandle);
        };

        Module.httpClient.jsHttpClientClose = function (handle, errorStatusPointer, errorCodePointer, errorSourcePointer) {
            var newErrorSource;
            var handleExists = httpClientManager.get(handle) !== undefined;
            var errorStatus = Module.eggShell.dataReadBoolean(errorStatusPointer);

            if (handleExists === false && errorStatus === false) {
                newErrorSource = 'LabVIEWHTTPClient:CloseHandle, Attempted to close an invalid or non-existant handle';
                Module.httpClient.mergeErrors(true, CODES.CLOSE_INVALID_HANDLE, newErrorSource, errorStatusPointer, errorCodePointer, errorSourcePointer);
            }

            // Always destroy the handle
            httpClientManager.destroy(handle);
        };

        Module.httpClient.jsHttpClientAddHeader = function (handle, headerPointer, valuePointer, errorStatusPointer, errorCodePointer, errorSourcePointer) {
            var errorStatus = Module.eggShell.dataReadBoolean(errorStatusPointer);
            if (errorStatus) {
                return;
            }

            var httpClient = findhttpClientOrWriteError(handle, 'LabVIEWHTTPClient:AddHeader', errorStatusPointer, errorCodePointer, errorSourcePointer);
            if (httpClient === undefined) {
                return;
            }

            var header = Module.eggShell.dataReadString(headerPointer);
            var value = Module.eggShell.dataReadString(valuePointer);
            httpClient.addHeader(header, value);
        };

        Module.httpClient.jsHttpClientRemoveHeader = function (handle, headerPointer, errorStatusPointer, errorCodePointer, errorSourcePointer) {
            var errorStatus = Module.eggShell.dataReadBoolean(errorStatusPointer);
            if (errorStatus) {
                return;
            }

            var httpClient = findhttpClientOrWriteError(handle, 'LabVIEWHTTPClient:RemoveHeader', errorStatusPointer, errorCodePointer, errorSourcePointer);
            if (httpClient === undefined) {
                return;
            }

            var header = Module.eggShell.dataReadString(headerPointer);
            httpClient.removeHeader(header);
        };

        Module.httpClient.jsHttpClientGetHeader = function (handle, headerPointer, valuePointer, errorStatusPointer, errorCodePointer, errorSourcePointer) {
            var errorStatus = Module.eggShell.dataReadBoolean(errorStatusPointer);
            if (errorStatus) {
                return;
            }

            var httpClient = findhttpClientOrWriteError(handle, 'LabVIEWHTTPClient:GetHeader', errorStatusPointer, errorCodePointer, errorSourcePointer);
            if (httpClient === undefined) {
                return;
            }

            var newErrorSource;
            var header = Module.eggShell.dataReadString(headerPointer);
            var value = httpClient.getHeaderValue(header);
            if (value === undefined) {
                newErrorSource = 'LabVIEWHTTPClient:GetHeader, The header ' + header + ' does not exist';
                Module.httpClient.mergeErrors(true, CODES.HEADER_DOES_NOT_EXIST, newErrorSource, errorStatusPointer, errorCodePointer, errorSourcePointer);
                return;
            }

            Module.eggShell.dataWriteString(valuePointer, value);
        };

        Module.httpClient.jsHttpClientHeaderExists = function (handle, headerPointer, headerExistsPointer, valuePointer, errorStatusPointer, errorCodePointer, errorSourcePointer) {
            var errorStatus = Module.eggShell.dataReadBoolean(errorStatusPointer);
            if (errorStatus) {
                return;
            }

            var httpClient = findhttpClientOrWriteError(handle, 'LabVIEWHTTPClient:HeaderExists', errorStatusPointer, errorCodePointer, errorSourcePointer);
            if (httpClient === undefined) {
                return;
            }

            var header = Module.eggShell.dataReadString(headerPointer);
            var valueOrUndefined = httpClient.getHeaderValue(header);
            var headerExists = valueOrUndefined !== undefined;
            Module.eggShell.dataWriteUInt32(headerExistsPointer, headerExists ? TRUE : FALSE);

            if (headerExists) {
                Module.eggShell.dataWriteString(valuePointer, valueOrUndefined);
            }
        };

        Module.httpClient.jsHttpClientListHeaders = function (handle, listPointer, errorStatusPointer, errorCodePointer, errorSourcePointer) {
            var errorStatus = Module.eggShell.dataReadBoolean(errorStatusPointer);
            if (errorStatus) {
                return;
            }

            var httpClient = findhttpClientOrWriteError(handle, 'LabVIEWHTTPClient:ListHeaders', errorStatusPointer, errorCodePointer, errorSourcePointer);
            if (httpClient === undefined) {
                return;
            }

            var list = httpClient.listHeaders();
            Module.eggShell.dataWriteString(listPointer, list);
        };

        Module.httpClient.jsHttpClientMethod = function (methodId, handle, urlPointer, outputFilePointer, bufferPointer, timeoutPointer, headersPointer, bodyPointer, statusCodePointer, errorStatusPointer, errorCodePointer, errorSourcePointer, occurrencePointer) {
            var errorStatus = Module.eggShell.dataReadBoolean(errorStatusPointer);
            if (errorStatus) {
                Module.eggShell.setOccurrenceAsync(occurrencePointer);
                return;
            }

            var newErrorSource;
            var method = METHOD_NAMES[methodId];

            // Nullable input parameters: handle, outputFile, buffer
            // Nullable output parameter: body

            var outputFile;
            if (outputFilePointer !== NULL) {
                outputFile = Module.eggShell.dataReadString(outputFilePointer);

                if (outputFile !== '') {
                    newErrorSource = 'LabVIEWHTTPClient:' + method + ', Output File unsupported in WebVIs (please leave as default of empty string)';
                    Module.httpClient.mergeErrors(true, CODES.WEBVI_UNSUPPORTED_INPUT, newErrorSource, errorStatusPointer, errorCodePointer, errorSourcePointer);
                    Module.eggShell.setOccurrenceAsync(occurrencePointer);
                    return;
                }
            }

            var buffer;
            if (bufferPointer !== NULL) {
                buffer = Module.eggShell.dataReadString(bufferPointer);
            }

            var httpClient;
            if (handle === NULL) {
                httpClient = new HttpClient('', '');
            } else {
                httpClient = findhttpClientOrWriteError(handle, 'LabVIEWHTTPClient:' + method, errorStatusPointer, errorCodePointer, errorSourcePointer);
                if (httpClient === undefined) {
                    Module.eggShell.setOccurrenceAsync(occurrencePointer);
                    return;
                }
            }

            var xhrTimeout;
            var timeout;

            if (timeoutPointer === NULL) {
                xhrTimeout = DEFAULT_TIMEOUT_MS;
            } else {
                timeout = Module.eggShell.dataReadInt32(timeoutPointer);

                // In LabVIEW timeout -1 means wait forever, in xhr timeout 0 means wait forever
                if (timeout < 0) {
                    xhrTimeout = 0;
                } else if (timeout === 0) {
                    xhrTimeout = TIMEOUT_IMMEDIATELY_MS;
                } else {
                    xhrTimeout = timeout;
                }
            }

            var url = Module.eggShell.dataReadString(urlPointer);
            var requestData = {
                method: method,
                url: url,
                xhrTimeout: xhrTimeout,
                buffer: buffer
            };

            httpClient.createRequest(requestData, function (responseData) {
                Module.eggShell.dataWriteString(headersPointer, responseData.header);
                Module.eggShell.dataWriteUInt32(statusCodePointer, responseData.status);

                if (bodyPointer !== NULL) {
                    Module.eggShell.dataWriteString(bodyPointer, responseData.text);
                }

                var newErrorStatus = responseData.labviewCode !== CODES.NO_ERROR;
                var newErrorCode = responseData.labviewCode;
                var newErrorSource = 'LabVIEWHTTPClient:' + method + ', ' + responseData.errorMessage;
                Module.httpClient.mergeErrors(newErrorStatus, newErrorCode, newErrorSource, errorStatusPointer, errorCodePointer, errorSourcePointer);
                Module.eggShell.setOccurrenceAsync(occurrencePointer);
            });
        };
    };

    return assignHttpClient;
}));

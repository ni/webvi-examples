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

    var DEFAULT_INVALID_HANDLE = 0;

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
        WEBVI_UNSUPPORTED_INPUT: 363650,
        INVALID_HEADER: 363651
    };

    var DEFAULT_TIMEOUT_MS = 10000;
    var TIMEOUT_IMMEDIATELY_MS = 1;

    var createSourceFromMessage = function (additionalInformation) {
        if (typeof additionalInformation === 'string' && additionalInformation.length !== 0) {
            return '<APPEND>\n' + additionalInformation;
        }

        return '';
    };

    var formatMessageWithException = function (messageText, exception) {
        if (typeof exception.message === 'string' && exception.message.length !== 0) {
            return messageText + ', Additional information: ' + exception.message;
        }

        return messageText;
    };

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
            this._includeCredentialsDuringCORS = false;
        };

        // Static Public Variables
        // None

        // Static Public Functions
        var runningRequests = [];

        HttpClient.abortAllRunningRequests = function () {
            // Abort event handlers seem to run synchronously
            // So run on a copy to prevent mutating while aborting
            var runningRequestsCopy = runningRequests.slice();
            runningRequestsCopy.forEach(function (request) {
                request.abort();
            });
        };

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
            var errorMessage;
            var request = new XMLHttpRequest();

            // Save a reference to the request
            runningRequests.push(request);

            // Create event listeners
            var eventListeners = {};

            // Even though we are rigorous with removing event listeners there is at least one case where completeRequest will be run twice
            // In PhantomJS 2.0.1 if a bad url is provided the send() function will throw an error triggering a catch statement in addition to the error event handler
            // However, only in PhantomJS will the error event handler run before the catch statement
            // So while most browsers will completeRequest in the catch statement and remove the event handlers to prevent further triggers,
            // PhantomJS will run the error event handler first to completeRequest and then attempt to completeRequest again in the catch statement
            // So begrudgingly a requestCompleted flag is added to prevent multiple calls of completeRequest.
            var requestCompleted = false;

            var completeRequest = function (responseData) {
                // Make sure completeRequest is not called twice
                if (requestCompleted === true) {
                    return;
                }
                requestCompleted = true;

                // Unregister event listeners
                Object.keys(eventListeners).forEach(function (eventName) {
                    request.removeEventListener(eventName, eventListeners[eventName]);
                });

                // Remove reference to complete request
                var index = runningRequests.indexOf(request);
                if (index > -1) {
                    runningRequests.splice(index, 1);
                }

                cb(responseData);
            };

            // load, error, timeout, and abort are mutually exclusive and one will fire after send
            // See https://xhr.spec.whatwg.org/#suggested-names-for-events-using-the-progressevent-interface
            eventListeners.load = function () {
                // A status code of 0 is an invalid status code and indicative of a failure
                // So far the only browser returning status codes of 0 is PhantomJS
                if (request.status === 0) {
                    completeRequest({
                        header: '',
                        text: '',
                        status: 0,
                        labviewCode: CODES.NETWORK_ERROR,
                        errorMessage: 'Network Error: Check Output or Console for more information'
                    });
                    return;
                }

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
                    errorMessage: 'Network Error: Check Output or Console for more information'
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
                errorMessage = formatMessageWithException('Invalid URL', ex);
                completeRequest({
                    header: '',
                    text: '',
                    status: 0,
                    labviewCode: CODES.INVALID_URL,
                    errorMessage: errorMessage
                });
                return;
            }

            // Add request headers
            var currentHeaderName, currentHeaderValue;
            try {
                this._headers.forEach(function (value, header) {
                    currentHeaderName = header;
                    currentHeaderValue = value;
                    request.setRequestHeader(header, value);
                });
            } catch (ex) {
                errorMessage = formatMessageWithException('Invalid Header: The provided header "' + currentHeaderName + '" with value "' + currentHeaderValue + '" is invalid', ex);
                completeRequest({
                    header: '',
                    text: '',
                    status: 0,
                    labviewCode: CODES.INVALID_HEADER,
                    errorMessage: errorMessage
                });
                return;
            }

            // withCredentials allows cookies (to be sent / set), HTTP Auth, and TLS Client certs when sending requests Cross Origin
            // Setting to false so communication to servers with Access-Control-Allow-Origin: *
            // See https://w3c.github.io/webappsec-cors-for-developers/#anonymous-requests-or-access-control-allow-origin
            request.withCredentials = this._includeCredentialsDuringCORS;

            // TODO mraj attempt to use 'ArrayBuffer' for the transfer type to get binary data
            request.responseType = 'text';

            // In IE 11 the timeout property may only be set after calling open and before calling send
            request.timeout = requestData.xhrTimeout;

            // Send request
            // IE11 and PhatomJS will both throw on send() if an invalid url is provided. Spec compliant browsers throw on open() for invalid urls.
            // Not sure if this is the only reason for send to throw in IE11, so using more generic network error
            try {
                if (requestData.buffer === undefined) {
                    request.send();
                } else {
                    request.send(requestData.buffer);
                }
            } catch (ex) {
                errorMessage = formatMessageWithException('Network Error: Check Output or Console for more information', ex);
                completeRequest({
                    header: '',
                    text: '',
                    status: 0,
                    labviewCode: CODES.NETWORK_ERROR,
                    errorMessage: errorMessage
                });
                return;
            }
        };

        proto.setIncludeCredentialsDuringCORS = function (includeCredentialsDuringCORS) {
            this._includeCredentialsDuringCORS = includeCredentialsDuringCORS;
        };
    }());

    var HttpClientManager;
    (function () {
        // Static private reference aliases
        // None

        // Constructor Function
        HttpClientManager = function () {
            // Public Instance Properties
            // None

            // Private Instance Properties
            this._httpClients = new Map();
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
        proto.create = function (username, password) {
            var httpClient = new HttpClient(username, password);
            var handle = createHandle();

            this._httpClients.set(handle, httpClient);
            return handle;
        };

        proto.destroy = function (handle) {
            var httpClient = this._httpClients.get(handle);
            if (httpClient === undefined) {
                return;
            }

            // We do not abort any existing requests with this handle

            this._httpClients.delete(handle);
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

        var findhttpClientOrWriteError = function (handle, errorStatusPointer, errorCodePointer, errorSourcePointer) {
            var httpClient = httpClientManager.get(handle);
            var newErrorSource;

            if (httpClient === undefined) {
                newErrorSource = createSourceFromMessage('Handle Not Found, Make sure to use HttpClientOpen to create a handle first');
                Module.coreHelpers.mergeErrors(true, CODES.RECEIVE_INVALID_HANDLE, newErrorSource, errorStatusPointer, errorCodePointer, errorSourcePointer);
            }

            return httpClient;
        };

        // Exported functions
        publicAPI.httpClient.abortAllRunningRequests = function () {
            HttpClient.abortAllRunningRequests();
        };

        // NOTE: All of the Module.js* functions  in this file should be called from Vireo only if there is not an existing error
        // unless otherwise stated in the function below
        Module.httpClient.jsHttpClientOpen = function (cookieFilePointer, usernamePointer, passwordPointer, verifyServerInt32, handlePointer, errorStatusPointer, errorCodePointer, errorSourcePointer) {
            var setDefaultOutputs = function () {
                Module.eggShell.dataWriteUInt32(handlePointer, DEFAULT_INVALID_HANDLE);
            };

            var newErrorSource;
            var cookieFile = Module.eggShell.dataReadString(cookieFilePointer);
            if (cookieFile !== '') {
                newErrorSource = createSourceFromMessage('Cookie File unsupported in WebVIs (please leave as default of empty string)');
                Module.coreHelpers.mergeErrors(true, CODES.WEBVI_UNSUPPORTED_INPUT, newErrorSource, errorStatusPointer, errorCodePointer, errorSourcePointer);
                setDefaultOutputs();
                return;
            }

            var verifyServer = verifyServerInt32 !== FALSE;
            if (verifyServer !== true) {
                newErrorSource = createSourceFromMessage('Verify Server unsupported in WebVIs (please leave as default of true)');
                Module.coreHelpers.mergeErrors(true, CODES.WEBVI_UNSUPPORTED_INPUT, newErrorSource, errorStatusPointer, errorCodePointer, errorSourcePointer);
                setDefaultOutputs();
                return;
            }

            var username = Module.eggShell.dataReadString(usernamePointer);
            var password = Module.eggShell.dataReadString(passwordPointer);
            var newHandle = httpClientManager.create(username, password);
            Module.eggShell.dataWriteUInt32(handlePointer, newHandle);
        };

        Module.httpClient.jsHttpClientClose = function (handle, errorStatusPointer, errorCodePointer, errorSourcePointer) {
            // This function should be called irregardless of an existing error to clean-up resources
            var newErrorSource;
            var handleExists = httpClientManager.get(handle) !== undefined;

            if (handleExists === false) {
                newErrorSource = createSourceFromMessage('Attempted to close an invalid or non-existant handle');
                Module.coreHelpers.mergeErrors(true, CODES.CLOSE_INVALID_HANDLE, newErrorSource, errorStatusPointer, errorCodePointer, errorSourcePointer);
                // Do not return if an error is written, need to still destroy any existing handles
            }

            // Always destroy the handle
            httpClientManager.destroy(handle);
        };

        Module.httpClient.jsHttpClientAddHeader = function (handle, headerPointer, valuePointer, errorStatusPointer, errorCodePointer, errorSourcePointer) {
            var httpClient = findhttpClientOrWriteError(handle, errorStatusPointer, errorCodePointer, errorSourcePointer);
            if (httpClient === undefined) {
                return;
            }

            var header = Module.eggShell.dataReadString(headerPointer);
            var value = Module.eggShell.dataReadString(valuePointer);
            httpClient.addHeader(header, value);
        };

        Module.httpClient.jsHttpClientRemoveHeader = function (handle, headerPointer, errorStatusPointer, errorCodePointer, errorSourcePointer) {
            var httpClient = findhttpClientOrWriteError(handle, errorStatusPointer, errorCodePointer, errorSourcePointer);
            if (httpClient === undefined) {
                return;
            }

            var header = Module.eggShell.dataReadString(headerPointer);
            httpClient.removeHeader(header);
        };

        Module.httpClient.jsHttpClientGetHeader = function (handle, headerPointer, valuePointer, errorStatusPointer, errorCodePointer, errorSourcePointer) {
            var setDefaultOutputs = function () {
                Module.eggShell.dataWriteString(valuePointer, '');
            };

            var httpClient = findhttpClientOrWriteError(handle, errorStatusPointer, errorCodePointer, errorSourcePointer);
            if (httpClient === undefined) {
                setDefaultOutputs();
                return;
            }

            var newErrorSource;
            var header = Module.eggShell.dataReadString(headerPointer);
            var value = httpClient.getHeaderValue(header);
            if (value === undefined) {
                newErrorSource = createSourceFromMessage('The header ' + header + ' does not exist');
                Module.coreHelpers.mergeErrors(true, CODES.HEADER_DOES_NOT_EXIST, newErrorSource, errorStatusPointer, errorCodePointer, errorSourcePointer);
                setDefaultOutputs();
                return;
            }

            Module.eggShell.dataWriteString(valuePointer, value);
        };

        Module.httpClient.jsHttpClientHeaderExists = function (handle, headerPointer, headerExistsPointer, valuePointer, errorStatusPointer, errorCodePointer, errorSourcePointer) {
            var setDefaultOutputs = function () {
                Module.eggShell.dataWriteUInt32(headerExistsPointer, FALSE);
                Module.eggShell.dataWriteString(valuePointer, '');
            };

            var httpClient = findhttpClientOrWriteError(handle, errorStatusPointer, errorCodePointer, errorSourcePointer);
            if (httpClient === undefined) {
                setDefaultOutputs();
                return;
            }

            var header = Module.eggShell.dataReadString(headerPointer);
            var valueOrUndefined = httpClient.getHeaderValue(header);
            var headerExists = valueOrUndefined !== undefined;
            if (headerExists === false) {
                setDefaultOutputs();
                return;
            }

            Module.eggShell.dataWriteUInt32(headerExistsPointer, TRUE);
            Module.eggShell.dataWriteString(valuePointer, valueOrUndefined);
        };

        Module.httpClient.jsHttpClientListHeaders = function (handle, listPointer, errorStatusPointer, errorCodePointer, errorSourcePointer) {
            var setDefaultOutputs = function () {
                Module.eggShell.dataWriteString(listPointer, '');
            };

            var httpClient = findhttpClientOrWriteError(handle, errorStatusPointer, errorCodePointer, errorSourcePointer);
            if (httpClient === undefined) {
                setDefaultOutputs();
                return;
            }

            var list = httpClient.listHeaders();
            Module.eggShell.dataWriteString(listPointer, list);
        };

        Module.httpClient.jsHttpClientMethod = function (methodId, handle, urlPointer, outputFilePointer, bufferPointer, timeoutPointer, headersPointer, bodyPointer, statusCodePointer, errorStatusPointer, errorCodePointer, errorSourcePointer, occurrencePointer) {
            var setDefaultOutputs = function () {
                Module.eggShell.dataWriteString(headersPointer, '');
                Module.eggShell.dataWriteUInt32(statusCodePointer, 0);

                if (bodyPointer !== NULL) {
                    Module.eggShell.dataWriteString(bodyPointer, '');
                }

                Module.eggShell.setOccurrenceAsync(occurrencePointer);
            };

            var newErrorSource;
            var method = METHOD_NAMES[methodId];

            // Nullable input parameters: handle, outputFile, buffer
            // Nullable output parameter: body

            var outputFile;
            if (outputFilePointer !== NULL) {
                outputFile = Module.eggShell.dataReadString(outputFilePointer);

                if (outputFile !== '') {
                    newErrorSource = createSourceFromMessage('Output File unsupported in WebVIs (please leave as default of empty string)');
                    Module.coreHelpers.mergeErrors(true, CODES.WEBVI_UNSUPPORTED_INPUT, newErrorSource, errorStatusPointer, errorCodePointer, errorSourcePointer);
                    setDefaultOutputs();
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
                httpClient = findhttpClientOrWriteError(handle, errorStatusPointer, errorCodePointer, errorSourcePointer);
                if (httpClient === undefined) {
                    setDefaultOutputs();
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
                var newErrorSource = createSourceFromMessage(responseData.errorMessage);
                Module.coreHelpers.mergeErrors(newErrorStatus, newErrorCode, newErrorSource, errorStatusPointer, errorCodePointer, errorSourcePointer);
                Module.eggShell.setOccurrenceAsync(occurrencePointer);
            });
        };

        Module.httpClient.jsHttpClientConfigCORS = function (handle, includeCredentialsDuringCORS, errorStatusPointer, errorCodePointer, errorSourcePointer) {
            var httpClient = findhttpClientOrWriteError(handle, 'LabVIEWHTTPClient:Credentials', errorStatusPointer, errorCodePointer, errorSourcePointer);
            if (httpClient === undefined) {
                return;
            }
            httpClient.setIncludeCredentialsDuringCORS(includeCredentialsDuringCORS !== FALSE);
        };
    };

    return assignHttpClient;
}));

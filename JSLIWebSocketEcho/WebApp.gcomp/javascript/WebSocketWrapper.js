// Example JavaScript for JSLI WebSocket Echo WebVI
// This file defines the functions used by the WebSocket JSLI nodes.
//
// This example creates several WebSocket function literals, and adds
// the functions as properties of the Window object.
// The functions are defined within an anonymous function ( (function(){}()); )
// as a closure to prevent polluting the global namespace with our variables.
// For example, if 'window.' is removed from 'window.OpenWebSocket' then the function
// is no longer accessible from the WebVI. This is because it is only in the scope of
// this anonymous function, and not the global scope of the browser.
//
// From more information see:
// https://github.com/ni/webvi-examples
// https://developer.mozilla.org/en-US/docs/Web/API/Window
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
// https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
(function () {
    // Use strict prevents silent and common JavaScript errors.
    'use strict';
    var webSocket = undefined;
    var receivedMessage = '';
    var newMessage = false;

    // Set the receivedMessage to empty string.
    // These EventListener functions are not accessible from the JSLI because they are not
    // added to the window object and they are not in the global namespace.
    var onOpen = function () {
        receivedMessage = '';
    };

    // When a new message is received, the message is stored in memory and set newMessage to true.
    // LabVIEW polls for new messages with the CheckMessage function.
    // Note that only the last message is stored and message can be missed if polling too slowly.
    var onMessage = function (evt) {
        newMessage = true;
        receivedMessage = evt.data;
        return evt.data;
    };

    // Open connection to the Echo server. This example only allows one connection to the Echo server.
    // Create a new WebSocket object  with a connection to the echo server and add EventListener functions.
    window.OpenWebSocket = function (URI) {
        if (webSocket === undefined) {
            webSocket = new WebSocket(URI);
            webSocket.onopen = function () { onOpen() };
            webSocket.onmessage = function (evt) { onMessage(evt) };
        }
        return webSocket.readyState;
    };

    // Send a message from LabVIEW. If the connection is opened, send a message to the Echo Server.
    window.SendMessage = function (messageWS) {
        if (webSocket !== undefined) {
            webSocket.send(messageWS);
        }
    };

    // Check for new messages from LabVIEW. If the message is new, return the message.
    window.CheckMessage = function () {
        if (webSocket !== undefined) {
            if (newMessage) {
                newMessage = false;
                return receivedMessage;
            }
        }
        return '';
    };

    // Close the WebSocket connection if the connection is open.
    window.CloseWebSocket = function () {
        if (webSocket !== undefined) {
            webSocket.close();
            webSocket = undefined;
        }
    };

    window.CheckState = function () {
        return webSocket.readyState;
    };
}());
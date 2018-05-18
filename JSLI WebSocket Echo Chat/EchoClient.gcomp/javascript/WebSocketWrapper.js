// Example JavaScript for JSLI WebSocket Echo WebVI
// This file wraps functions used by WebSocket JSLI nodes.
// The example allows only one connection to the server.
//
// This example creates several WebSocket function objects and adds 
// the functions as a property to the Window object. 
// The functions are defined within an anonymous function ( (function(){}()); ) 
// to prevent polluting the global namespace, and are explicitly addded as properties.   
// For example, if 'window.' is removed from 'window.OpenWebSocket' then the function 
// is no longer accessible from the WebVI. This is because it is only in the scope of 
// this anonymous function, and not the global scope of the browser. 
//
// From more information see:
// https://github.com/ni/webvi-examples
// https://developer.mozilla.org/en-US/docs/Web/API/Window
// https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications

(function (){
	//Use strict prevents silent and common JavaScript errors.
	'use strict';
	var webSocket = undefined;
	var receivedMessage ="";
	var newMessage = false;

	// Open connection to the Echo server. This example only allows one connection to the Echo server.
	// Create a new WebSocket object  with a connection to the echo server and add EventListener functions.
	window.OpenWebSocket = function(URI){
		// Open Echo Server if no URL is given
		if (URI ===""){
			URI = "ws://echo.websocket.org/";
		} 
		
		if (webSocket === undefined){
			webSocket = new WebSocket(URI);
			webSocket.onopen = function(evt) { onOpen(evt) };
			webSocket.onmessage = function(evt) { onMessage(evt) };
			return  webSocket.readyState;
		} 

	};

	//Close the WebSocket connection if the connection is open. 
	window.CloseWebSocket = function(){
		if (webSocket !== undefined){
			webSocket.close();
			webSocket = undefined;
			return webSocket.readyState;
		}
		return 3;
	};

	// Send a message from LabVIEW. If the connection is opened, send a message to the Echo Server.
	window.SendMessage = function(messageWS){
		if (webSocket !== undefined){
			webSocket.send(messageWS);
		}
	};
	
	//Check for new messages from LabVIEW. If the message is new, return the message. 
	window.CheckMessage = function(){
		if (webSocket !== undefined){
			if (newMessage){
				newMessage = false;
				return receivedMessage;
			} else {
				return "";
			}
		}
	};
	
	window.CheckState = function(){
		return webSocket.readyState;
	};

	// Set the receivedMessage to empty string.
	// These EventListener functions are not accessible from the JSLI because they are not added to the window object and they are not in the global namespace.
	function onOpen(evt){
			receivedMessage ="";
	}

	// When a new message is received, store the message in memory and set newMessage to true. LabVIEW will poll for new messages with the CheckMessage function. 
	function onMessage(evt){
			newMessage = true; 
			receivedMessage = evt.data;
			return evt.data;
	}	

} ());

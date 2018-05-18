// Example JavaScript for JSLI WebSocket Echo Chat WebVI
// This file defines functions used by WebSocket JSLI nodes.
// The example allows only one connection to the server.

(function (){
	'use strict';

	var webSocket = undefined;
	var receivedMessage ="";
	var URI = "";
	var newMessage = false;
	var messageWS = "";

	// This creates a function object, OpenWebSocket, and assigns the function object to 
	// the window object. If 'window.' is removed from 'window.OpenWebSocket' then the function 
	// is no longer accessible from the WebVI. This is because it is only in the scope of 
	// this anonymous function, and not the global scope of the browser. 
	// See https://developer.mozilla.org/en-US/docs/Web/API/Window
	
	// For more info on writing WebSocket application, see:
	// https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_client_applications
	window.OpenWebSocket = function(URI){
		//Open Connection
		console.log("Opening WebSocket...");
		if (URI ===""){
			// Open Echo Server if no URL is given
			URI = "ws://echo.websocket.org/";
		} 
		
		//This example only allows one connection to the Echo server
		if (webSocket === undefined){
			webSocket = new WebSocket(URI);
			webSocket.onopen = function(evt) { onOpen(evt) };
			webSocket.onmessage = function(evt) { onMessage(evt) };
			
			//These EventListener functions are not implemented but could be if desired.
			//webSocket.onclose = function(evt) { onClose(evt) };
			//webSocket.onerror = function(evt) { onError(evt) };
			
			return  webSocket.readyState;
		} 

	};

	window.CloseWebSocket = function(){
		webSocket.close();
		console.log("Closing WebSocket...");
		return webSocket.readyState;
	};

	window.SendMessage = function(messageWS){
		webSocket.send(messageWS);
		console.log("Sending WebSocket message: " + messageWS);
		return 1;
	};
	
	//If the message is new, return the message. 
	window.CheckMessage = function(){
		if (newMessage){
			newMessage = false;
			return receivedMessage;
		} else
			return "";
	};
	
	window.CheckState = function(){
		return webSocket.readyState;
	};

	//	EventListener Functions
	function onOpen(evt){
			console.log("Entered onOpen");
			console.log("Connected!");
			receivedMessage ="";
	}

	function onMessage(evt){
			console.log("Entered onMessage");
			console.log("Received message: " + evt.data);
			newMessage = true; 
			receivedMessage = evt.data;
			return evt.data;
	}	

} ());

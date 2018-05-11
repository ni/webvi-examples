(function (){
	//'use strict';

	//var echoURI = "ws://echo.websocket.org/";
	var receivedMessage ="";
	var URI = "";
	var newMessage = false;

	window.OpenWebSocket = function(wsURI){
		
		//Open Connection
		console.log("Opening WebSocket...");
		if (wsURI ===""){
			URI = "ws://echo.websocket.org/";
		} 
		
		webSocket = new WebSocket(wsURI);
		webSocket.onopen = function(evt) { onOpen(evt) };
		webSocket.onmessage = function(evt) { onMessage(evt) };
		//webSocket.onclose = function(evt) { onClose(evt) };
		//webSocket.onerror = function(evt) { onError(evt) };
		
		return  webSocket.readyState;
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

	function onOpen(evt){
			console.log("Entered onOpen");
			console.log("connected to " + URI);
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

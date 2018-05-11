// Example JavaScript for JSLI Calculator Example WebVI
// Add with JSLI node using a more complex, external JavaScript function.

(function() {
	'use strict';
	// Uncomment the below line to log info to the browser console
	//console.log("Entered Add with JSLI function...");
	
	// Create variables with default values. 
	var num1=1;
	var num2=1;

	// This creates a function object, AddWithJSLI, and assigns the function object to 
	// the window object. If 'window.' is removed from 'window.AddWithJSLI' then the function 
	// is no longer accessible from the WebVI. This is because it is only in the scope of 
	// this anonymous function, and not the global scope of the browser. 
	// See https://developer.mozilla.org/en-US/docs/Web/API/Window
	window.AddWithJSLI = function(num1, num2)
	{
		// Uncomment the below line to log info to the browser console everytime the JSLI node is called.		
		//console.log("In AddWithJSLI JS function... X=" + num1 + "Y = " + num2);
		
		var sum = num1 + num2;

		return sum;
	};
	
}());
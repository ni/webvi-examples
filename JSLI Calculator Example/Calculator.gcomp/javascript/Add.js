// Example JavaScript for JSLI Calculator Example WebVI
// Add with the JSLI node using a more complex JavaScript function.
//
// This example creates a function object, named AddWithJSLI, and adds 
// the function as a property to the Window object. 
// The function is defined within an anonymous function ( (function() {}()); ) 
// to prevent polluting the global namespace, and explicitly added as a property.   
// If 'window.' is removed from 'window.AddWithJSLI' then the function 
// is no longer accessible from the WebVI. This is because it is only in the scope of 
// this anonymous function, and not the global scope of the browser. 
//
// From more information see:
// https://github.com/ni/webvi-examples
// https://developer.mozilla.org/en-US/docs/Web/API/Window
	
(function() {
	//Use strict prevents silent and common JavaScript errors.
	'use strict';

	window.AddWithJSLI = function(num1, num2)
	{	
		var sum = num1 + num2;
		return sum;
	};
	
}());
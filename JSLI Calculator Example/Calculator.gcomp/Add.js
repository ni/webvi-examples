// Example JavaScript for JSLI Calculator Example WebVI
// Add with JSLI node using a more complex, external JavaScript function.
// This creates a function object, AddWithJSLI, and adds it as a property to the Window object. 
// The AddWithJSLI is a function expression that will add the two numbers. 
// If 'window.' is removed from 'window.AddWithJSLI' then the function 
// is no longer accessible from the WebVI. This is because it is only in the scope of 
// this anonymous function, and not the global scope of the browser. 
// See https://developer.mozilla.org/en-US/docs/Web/API/Window
// The anonymous function pattern ( (function() {}()); ) is used to prevent conflicts with other functions
// that's why we are explicitly adding a property to window)
	
(function() {
	//Use Strict prevents silent and common JavaScript errors
	'use strict';

	window.AddWithJSLI = function(num1, num2)
	{	
		var sum = num1 + num2;
		return sum;
	};
	
}());
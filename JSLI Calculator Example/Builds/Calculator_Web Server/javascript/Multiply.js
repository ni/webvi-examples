// Example JavaScript for JSLI Calculator Example WebVI
// Multiply with the JSLI using a simple JavaScript function.
//
// This example creates a named function declaration, MultiplyWithJSLI.
// The function is accessible from the global scope, and is therefore accessible to the JSLI. 
// Global scope allows the function to add accessed by an function on the web page.
// You should minimize the usage of global variables and functions to avoid namescape conflicts and minimize memory usage.
//
// From more information see:
// https://github.com/ni/webvi-examples
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function

function MultiplyWithJSLI(x, y) {  
    return x * y;
}
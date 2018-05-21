// Example JavaScript for JSLI Calculator Example WebVI
// Multiply with the JSLI using a simple JavaScript function.
//
// This example creates a function declaration.
// The function is accessible from the global scope and is therefore accessible to the JSLI. 
// Global scope allows the function to add accessed by any other function running in the browser window.
// You should minimize the use of global scope to avoid naming conflicts and other global-related issues.
//
// From more information see:
// https://github.com/ni/webvi-examples
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function

function MultiplyWithJSLI(x, y) {  
    return x * y;
}
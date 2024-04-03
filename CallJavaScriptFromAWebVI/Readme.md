# Call JavaScript From a WebVI

[![Call JavaScript From a WebVI Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/CallJavaScriptFromAWebVI/Builds/WebApp_Default%20Web%20Server/)
[![Call JavaScript From a WebVI README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)]()

This example is a simple 4-bit calculator using the JavaScript Library Interface (JSLI). The math functions and Log to Console button illustrate different methods of using the JSLI. Add (JSLI) and Multiply (JSLI) use external JavaScript files to implement their functions. The Log to Console button logs text to the browser debug console using the browser-supported `console.log` function. After building and deploying the WebVI to a browser, open the browser developer tools (Press F12 in most browsers) and select the Console tab to view the console log.

On the panel, this WebVI has X and Y binary inputs. The user clicks these to change the numerical values of the inputs. The Outputs of X+Y and X*Y are updated with binary and numerical indicators.

![Screenshot of Demo](readme_files/Screenshot.gif)

## Dependencies

- G Web Development Software

## Setup

1. Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repository to your machine.
2. Open `CallJavaScriptFromAWebVI\CallJavaScriptFromAWebVI.gwebproject`
3. Open `index.gviweb` and click the **Run** button.
4. Build the web application.  
  a. Open `WebApp.gcomp`.  
  b. On the **Document** tab, click **Build**.
    - To view the build output on your machine, click **Output Directory** on the **Document** tab once your application finishes building.
    - To launch and view the Web Application locally you can use the **Run** button on the **Document** tab.

## Hosting

You can manually move the build output found at `\Call3rdPartyWebService\Builds` to any web server.

This project also includes a Distribution (`WebApp.lvdist`) that can be used to build a package (`.nipkg`). Packages utilize NI Package Manager to automated the process of installing, upgrading, or removing the web app. A package is also a requirement for [hosting a Web application with the Web Applications service](https://www.ni.com/docs/en-US/bundle/g-web-development/page/hosting-a-web-vi.html).

Leveraging the [Web Applications service](https://www.ni.com/docs/en-US/bundle/g-web-development/page/hosting-a-web-vi.html) is the recommended way to host a WebVI as it enables permissioned access and configurable security settings. Other options for hosting a WebVI can be found in the [Hosting a Web Application on a Server](https://www.ni.com/docs/en-US/bundle/g-web-development/page/hosting-web-application-on-server.html) topic. 

## Details

This WebVI uses the JSLI to interface with simple functions defined in `Add.js` and `Multiply.js`, and compares the results with the G Web Development Software built-in functions.
A single JSLI wraps JavaScript functions in the two external JavaScript files.
The external functions are referenced by using the Function prototype symbol, or name, used in the JavaScript file.
For example, `AddWithJSLI` is a function defined in `Add.js`.
The corresponding JSLI function references the Symbol `AddWithJSLI` to link the JavaScript function to the JSLI function.

![JSLI Node Functions](readme_files/JSLI.png)

The Add and Multiply nodes output the JSLI and built-in function results to the index WebVI.
The `Multiply.js` file demonstrates a simple, external JavaScript function, and the `Add.js` file demonstrates a more complex JavaScript function.
See these files for comments about the functions themselves.

![Add and Multiply Nodes](readme_files/nodes.png)

The Log to Console button logs text to the browser debug console using the browser-supported `console.log` function.
After building and deploying the WebVI to a browser, open the browser developer tools (Press F12 in most browsers) and select the Console tab to view the console log.
The log allows the user to see messages that can potentially help debug their application.

![Log to Console](readme_files/log.png)

# Access the LabVIEW NXG Beta 2 Examples
** If you need access to the LabVIEW NXG Beta 2 examples, Please clone or download the version available at the [labview-nxg-beta2 branch](https://github.com/ni/webvi-examples/tree/labview-nxg-beta2)**

# webvi-examples
The following examples demonstrate different ways of using WebVIs. Each directory contains example code and a readme explaining the example. If you have any questions or problems related to these examples, post on this GitHub repository's issues page.

# Call 3rd Party Web Service
[![Call 3rd Party Web Service Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/Call3rdPartyWebService/Builds/WebApp_Web%20Server/Main.html)
[![Call 3rd Party Web Service README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/Call3rdPartyWebService)

This example demonstrates how to use a WebVI to call the [Earthquake API](https://earthquake.usgs.gov/) from the [US Geological Survey](https://www.usgs.gov/) and display recent earthquakes on a web page.

On the diagram, this WebVI uses [HTTP GET](http://zone.ni.com/reference/en-XX/help/371361N-01/lvcomm/http_client_get/) to query the Earthquake API for earthquakes from the last 30 days. The WebVI also uses [Unflatten from JSON](http://zone.ni.com/reference/en-XX/help/371361N-01/glang/unflatten_from_json/) to convert the results from JSON to LabVIEW data.

On the panel, this WebVI displays a summary of the results in a data grid and a map of the selected earthquake region in a URL Image indicator.

![Screenshot of Demo](https://ni.github.io/webvi-examples/Call3rdPartyWebService/Screenshot.gif)

# Call LabVIEW Web Service
[![Call LabVIEW Web Service Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/CallLabVIEWWebService/WebVI/Builds/WebApp_Web%20Server/Main.html)
[![Call LabVIEW Web Service README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/CallLabVIEWWebService)

__Note: The Call LabVIEW Web Service demo requires the included LabVIEW Web Service to be running locally on your machine__

This example demonstrates how to create a WebVI that makes requests to a LabVIEW web service, and how to create a LabVIEW 2016 web service that can respond to requests from a WebVI.

![Screenshot of Demo](https://ni.github.io/webvi-examples/CallLabVIEWWebService/Screenshot.gif)

# Customize WebVI with CSS
[![Customize WebVI with CSS Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/CustomizeWithCss/Builds/WebApp_Web%20Server/Main.html)
[![Customize WebVI with CSS README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/CustomizeWithCss)

This example demonstrates how to customize the HTML output of a WebVI using CSS.

One of the main parts of a WebVI is an HTML output that displays HTML5 Custom Elements. One of the advantages of using CSS in a web application is to the separate content from style. For example, you could create a custom CSS file that is shared across the organization or even among other users to build more and more styles and layouts.

![Screenshot of Demo](https://ni.github.io/webvi-examples/CustomizeWithCss/Screenshot.gif)

# Embed Content into a WebVI
[![Embed Content into a WebVI Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/EmbedContentIntoWebVI/Builds/WebApp_Web%20Server/Main.html)
[![Embed Content into a WebVI README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/EmbedContentIntoWebVI)

This example demonstrates how to embed custom web content into the WebVI panel using LabVIEW NXG 2.0. WebVIs use HTML to define and describe the content of the panel that is loaded in a web page. This means that you can add custom HTML content to appear alongside the LabVIEW-generated HTML.

![Screenshot of Demo](https://ni.github.io/webvi-examples/EmbedContentIntoWebVI/Screenshot.gif)

# Embed a WebVI into Web Content
[![Embed a WebVI into Web Content Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/EmbedWebVIIntoContent/)
[![Embed a WebVI into Web Content README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/EEmbedWebVIIntoContent)

This example demonstrates how to embed the output of a WebVI built using LabVIEW NXG 2.0 into an static web page.

The build output of a WebVI includes three basic parts:
- HTML5 custom elements
- Compiled WebVI diagram (`.via.txt`)
- JavaScript and CSS files used in the web application

Because WebVIs share the same basic building blocks as other web pages, you can embed WebVI output into any web content.

![Screenshot of Demo](https://ni.github.io/webvi-examples/EmbedWebVIIntoContent/Screenshot.gif)

# Incorporate User Resource into WebVI
[![Incorporate User Resource into WebVI Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/IncorporateUserResources/Builds/WebApp_Web%20Server/Main.html)
[![Incorporate User Resource into WebVI README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/IncorporateUserResources)

This example demonstrates how to add resource files such as images, CSS files, JavaScript files, and HTML files to your web application component and reference them in a WebVI without needing to upload these files to a web server.

You can also use resource files to augment the WebVI's capabilities. For example, you can add other HTML widgets or scripts and reference them in the HTML view of the WebVI.

![Screenshot of Demo](https://ni.github.io/webvi-examples/IncorporateUserResources/Screenshot.gif)

# JSLI Calculator
[![JSLI Calculator into WebVI Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/JSLICalculator/Builds/WebApp_Web%20Server/Main.html)
[![JSLI Calculator into WebVI README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/JSLICalculator)

This example is a simple 4-bit calculator using the JavaScript Library Interface (JSLI). The math functions and Log to Console button illustrate different methods of using the JSLI. Add (JSLI) and Multiply (JSLI) use external JavaScript files to implement their functions. The Log to Console button logs text to the browser debug console using the browser-supported console.log function. After building and deploying the WebVI to a browser, open the browser developer tools (Press F12 in most browsers) and select the Console tab to view the console log.

On the panel, this WebVI has X and Y binary inputs. The user clicks these to change the numerical values of the inputs. The Outputs of X+Y and X*Y are updated with binary and numerical indicators. 

![Screenshot of Demo](https://ni.github.io/webvi-examples/JSLICalculator/Screenshot.gif)

# JSLI WebSocket Echo
[![JSLI WebSocket Echo into WebVI Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/JSLIWebSocketEcho/Builds/WebApp_Web%20Server/Main.html)
[![JSLI WebSocket Echo into WebVI README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/JSLIWebSocketEcho)

This example uses the JavaScript Library Interface (JSLI) to connect to the WebSocket Echo Server hosted by websocket.org. The WebVI connects to the server, sends a message, and receives the same message from the server. The WebSocket functions use an external JavaScript file to implement their functionality. 

On the diagram, this WebVI uses JSLI VIs to open a connection to the echo server, send messages, read received messages, close the connection and log debug information to the browser console. The WebVI also formats sent and received strings to display on the Messages indicator.

![Screenshot of Demo](https://ni.github.io/webvi-examples/JSLIWebSocketEcho/Screenshot.gif)

<!-- The following should be equivalent to the section in webvi-examples/Readme.md -->
# Multiple Top-Level WebVIs
[![Multiple Top-Level WebVIs Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/MultipleTopLevelWebVIs/Builds/MultipleTopLevelWebVIs_Web%20Server/)
[![Multiple Top-Level WebVIs README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/MultipleTopLevelWebVIs)

This example demonstrates how to create a web application with multiple pages by using multiple top-level WebVIs and Hyperlink controls to link between them. When you build the web application, each top-level WebVI generates a separate HTML file with links to the other HTML files that are generated.

[![Multiple Top-Level WebVIs Demo Link](https://ni.github.io/webvi-examples/MultipleTopLevelWebVIs/Screenshot.gif)](https://ni.github.io/webvi-examples/MultipleTopLevelWebVIs/Builds/Web%20Server/Configuration1/MultipleTopLevelWebVIs/)

# Utilize Skyline Data Services
[![Utilize Skyline Data Services](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/Builds/WebApp_Web%20Server/Main.html)
[![Utilize Skyline Data Services README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/UtilizeSkylineDataServices)

This example demonstrates how to use a WebVI to communicate over networks with Skyline Tags. The example also shows how code can be shared between WebVIs and GVIs using a library.  On the diagram, this WebVI utilizes a state machine to determine when to read/write tags and when to connect to a server. On the panel, this example has fields to enter the server, username, and password. It also has a tab control that determines the visible view as well as the state in the state machine.

![Screenshot of Demo](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/Screenshot.gif)

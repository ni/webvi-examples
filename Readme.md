# webvi-examples
The following examples demonstrate different ways of using WebVIs. Each directory contains example code and a readme explaining the example. If you have any questions or problems related to these examples, post on this GitHub repository's issues page.

# Call 3rd Party Web Service
[![Call 3rd Party Web Service Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/Call%203rd%20Party%20Web%20Service/Builds/Web%20Server/Configuration1/WebApp/Main.html)
[![Call 3rd Party Web Service README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/Call%203rd%20Party%20Web%20Service)

This example demonstrates how to use a WebVI to call the [Earthquake API](https://earthquake.usgs.gov/) from the [US Geological Survey](https://www.usgs.gov/) and display recent earthquakes on a web page.

On the diagram, this WebVI uses [HTTP GET](http://zone.ni.com/reference/en-XX/help/371361N-01/lvcomm/http_client_get/) to query the Earthquake API for earthquakes from the last 30 days. The WebVI also uses [Unflatten from JSON](http://zone.ni.com/reference/en-XX/help/371361N-01/glang/unflatten_from_json/) to convert the results from JSON to LabVIEW data.

On the panel, this WebVI displays a summary of the results in a data grid and a map of the selected earthquake region in a URL Image indicator.

![Screenshot of Demo](https://ni.github.io/webvi-examples/Call%203rd%20Party%20Web%20Service/Screenshot.png)

# Call LabVIEW Web Service
[![Call LabVIEW Web Service Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/Call%20LabVIEW%20Web%20Service/WebVI/Builds/Web%20Server/Configuration1/WebApp/Main.html)
[![Call LabVIEW Web Service README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/Call%20LabVIEW%20Web%20Service)

This example demonstrates how to create a WebVI that makes requests to a LabVIEW web service, and how to create a LabVIEW 2016 web service that can respond to requests from a WebVI.

# Customize WebVI with CSS
[![Customize WebVI with CSS Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/Customize%20with%20CSS/Builds/Web%20Server/Configuration1/WebApp/Main.html)
[![Customize WebVI with CSS README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/Customize%20with%20CSS)

This example demonstrates how to customize the HTML output of a WebVI using CSS. 

One of the main parts of a WebVI is an HTML output that displays HTML5 Custom Elements. One of the advantages of using CSS in a web application is to the separate content from style. For example, you could create a custom CSS file that is shared across the organization or even among other users to build more and more styles and layouts.

# Embed Content into a WebVI
[![Embed Content into a WebVI Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/Embed%20Content%20into%20Webvi/Builds/Web%20Server/Configuration1/WebApp/Main.html)
[![Embed Content into a WebVI README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/Embed%20Content%20into%20Webvi)

This example demonstrates how to embed custom web content into the WebVI panel using LabVIEW NXG 2.0 Beta. WebVIs use HTML to define and describe the content of the panel that is loaded in a web page. This means that you can add custom HTML content to appear alongside the LabVIEW-generated HTML.

# Embed a WebVI into Web Content
[![Embed a WebVI into Web Content Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/Embed%20WebVI%20into%20Content/)
[![Embed a WebVI into Web Content README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/Embed%20WebVI%20into%20Content)

This example demonstrates how to embed the output of a WebVI built using LabVIEW NXG 2.0 Beta into an static web page. 

The build output of a WebVI includes three basic parts: 
- HTML5 custom elements
- Compiled WebVI diagram (`.via.txt`)
- JavaScript and CSS files used in the web application 

Because WebVIs share the same basic building blocks as other web pages, you can embed WebVI output into any web content.

# Incorporate User Resource into WebVI
[![Incorporate User Resource into WebVI Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/Incorporate%20User%20Resources/Builds/Web%20Server/Configuration1/WebApp/Main.html)
[![Incorporate User Resource into WebVI README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/Incorporate%20User%20Resources)

This example demonstrates how to add resource files such as images, CSS files, JavaScript files, and HTML files to your web application component and reference them in a WebVI without needing to upload these files to a web server.

You can also use resource files to augment the WebVI's capabilities. For example, you can add other HTML widgets or scripts and reference them in the HTML view of the WebVI.

<!-- The following should be equivalent to the section in webvi-examples/Readme.md -->
# Multiple Top-Level WebVIs
[![Multiple Top-Level WebVIs Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/MultipleTopLevelWebVIs/Builds/Web%20Server/Configuration1/MultipleTopLevelWebVIs/)
[![Multiple Top-Level WebVIs README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/MultipleTopLevelWebVIs)

This example demonstrates how to create a web application with multiple pages by using multiple top-level WebVIs and Hyperlink controls to link between them. When you build the web application, each top-level WebVI generates a separate HTML file with links to the other HTML files that are generated.

[![Multiple Top-Level WebVIs Demo Link](https://ni.github.io/webvi-examples/MultipleTopLevelWebVIs/Screenshot.gif)](https://ni.github.io/webvi-examples/MultipleTopLevelWebVIs/Builds/Web%20Server/Configuration1/MultipleTopLevelWebVIs/)

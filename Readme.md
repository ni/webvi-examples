# webvi-examples
- Please use all of the default namespaces and directory names when building the web application in each example.
- Fork or branch this repository and work on a single example in a single branch at a time.
- Draft the readme for each example as you go. The readme doesn't need to be perfect, but there must be something before we can pull it in.

# Call LabVIEW Web Service
This example demonstrates how to create a WebVI that makes requests to a LabVIEW web service, and how to create a LabVIEW 2016 web service that can respond to requests from a WebVI.

# Call 3rd Party Web Service
This example demonstrates how to use a WebVI to call the [Earthquake API](https://earthquake.usgs.gov/) from the [US Geological Survey](https://www.usgs.gov/) and display recent earthquakes on a web page.

On the diagram, this WebVI uses [HTTP GET](http://zone.ni.com/reference/en-XX/help/371361N-01/lvcomm/http_client_get/) to query the Earthquake API for earthquakes from the last 30 days. The WebVI also uses [Unflatten from JSON](http://zone.ni.com/reference/en-XX/help/371361N-01/glang/unflatten_from_json/) to convert the results from JSON to LabVIEW data.

On the panel, this WebVI displays a summary of the results in a data grid and a map of the selected earthquake region in a URL Image indicator.

# Customize WebVI with CSS
This example demonstrates how to customize the HTML output of a WebVI using CSS. 

One of the main parts of a WebVI is an HTML output that displays HTML5 Custom Elements. One of the advantages of using CSS in a web application is to the separate content from style. For example, you could create a custom CSS file that is shared across the organization or even among other users to build more and more styles and layouts.

# Embed Content into a WebVI
This example demonstrates how to embed custom web content into the WebVI panel using LabVIEW NXG 2.0 Beta. WebVIs use HTML to define and describe the content of the panel that is loaded in a web page. This means that you can add custom HTML content to appear alongside the LabVIEW-generated HTML.

# Embed a WebVI into Web Content
This example demonstrates how to embed a WebVI built using LabVIEW NXG 2.0 Beta into an static web page. 

WebVIs are composed of three basic parts: 
- HTML5 Custom Elements
- WebVI diagram (`.via.txt`)
- JavaScript and CSS files. 

Because these are the same basic building blocks of all other web pages, you can pull the WebVI apart and embed it in any web content.

# Incorporate User Resource into WebVI
This example demonstrates how to add resource files such as images, CSS files, JavaScript files, and HTML files to your web application component and reference them in a WebVI without needing to upload these files to a web server.

You can also use resource files to augment the WebVI's capabilities. For example, you can add other HTML widgets or scripts and reference them in the HTML view of the WebVI.

<!-- The following should be equivalent to the section in webvi-examples/MultipleTopLevelVIs/Readme.md -->
# Multiple Top-Level VIs
[![Multiple Top-Level WebVIs Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/MultipleTopLevelVIs/Builds/Web%20Server/Configuration1/MultipleTopLevelVIs/)
[![Multiple Top-Level WebVIs Readme Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://ni.github.io/webvi-examples/MultipleTopLevelVIs/)

This example demonstrates how to create a web application with multiple pages by using multiple top-level WebVIs and Hyperlink controls to link between them. When you build the web application, each top-level WebVI generates a separate HTML file with links to the other HTML files that are generated.

[![Multiple Top-Level WebVIs Demo Link](https://ni.github.io/webvi-examples/MultipleTopLevelWebVIs/MultipleTopLevelWebVIs.gif)](https://ni.github.io/webvi-examples/MultipleTopLevelWebVIs/Builds/Web%20Server/Configuration1/MultipleTopLevelWebVIs/)

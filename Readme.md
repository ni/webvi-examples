# webvi-examples
- Please use all of the default namespaces and directory names when building the Web Application in each example
- Fork or branch this repo and work on a single example in a single branch at a time
- Draft the readme for each example as you go. The Readme doesn't need to be perfect, but there must be something before we can pull it in.


# Call LabVIEW Web Service

# Call 3rd Party Web Service

# Customize WebVI with CSS

# Embed Content into a WebVI

# Embed a WebVI into Web Content
This example demonstrates embedding a WebVI built using LabVIEW NXG 2.0 Beta into an entirely different static Web page. WebVIs are composed of three basic parts: HTML5 Custom Elements which compose the view of the page, the WebVI block diagram (.via.txt) which provides the client side logic, and the JavaScript and CSS files that make the Web application run. Because these are the same basic building blocks (san via.txt) of all other Web pages you can pull the WebVI apart and embed it with any Web content.

# Incorporate User Resource into WebVI

<!-- The following should be equivalent to the section in webvi-examples/MultipleTopLevelWebVIs/Readme.md -->
# Multiple Top-Level WebVIs
[![Multiple Top-Level WebVIs Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/MultipleTopLevelWebVIs/Builds/Web%20Server/Configuration1/MultipleTopLevelWebVIs/)
[![Multiple Top-Level WebVIs README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/MultipleTopLevelWebVIs)

This example demonstrates usage of multiple Top-Level WebVIs in a NXG Web Application.
Each Top-Level WebVI is built into a separate HTML file and the Hyperlink control is used to create clickable links between the different Top-Level WebVIs.
The example determines the correct URL to use for a Hyperlink control by examining the Relative URL property available for each item in the Component.

[![Multiple Top-Level WebVIs Demo Link](https://ni.github.io/webvi-examples/MultipleTopLevelWebVIs/MultipleTopLevelWebVIs.gif)](https://ni.github.io/webvi-examples/MultipleTopLevelWebVIs/Builds/Web%20Server/Configuration1/MultipleTopLevelWebVIs/)

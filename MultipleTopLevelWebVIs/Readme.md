<!-- The following should be equivalent to the section in webvi-examples/Readme.md -->
# Multiple Top-Level WebVIs
[![Multiple Top-Level WebVIs Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/MultipleTopLevelWebVIs/Builds/Web%20Server/Configuration1/MultipleTopLevelWebVIs/)
[![Multiple Top-Level WebVIs README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/MultipleTopLevelWebVIs)

This example demonstrates how to create a web application with multiple pages by using multiple top-level WebVIs and Hyperlink controls to link between them. When you build the web application, each top-level WebVI generates a separate HTML file with links to the other HTML files that are generated.

[![Multiple Top-Level WebVIs Demo Link](https://ni.github.io/webvi-examples/MultipleTopLevelWebVIs/MultipleTopLevelWebVIs.gif)](https://ni.github.io/webvi-examples/MultipleTopLevelWebVIs/Builds/Web%20Server/Configuration1/MultipleTopLevelWebVIs/)

# Dependencies
- LabVIEW NXG 2.0 Beta
- LabVIEW 2009-2017 (Required for hosting only)
- NI SystemLink Server (Required for hosting only)

# Setup
1. Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repository to your machine.
2. Open `Multiple Top-Level VIs\Multiple Top-Level VIs.lvproject`.
3. Open `Main.gviweb` and click the **Run** button.  
**Note:** Clicking a link to another top-level WebVI within LabVIEW opens a web browser, but the WebVI does not run in the web browser. <!-- TODO DE12694: Pressing run and clicking link to other top-level panel opens a link to broken WebVI stuck in synchronization mode -->
4. Test the top-level WebVIs.  
  a. On the **Project Files** tab, double-click **System Designer** to open it.  
  b. On the **Web Server** target, right-click `MultipleTopLevelVIs.gcomp` and select **Run Web Component**.  
  **Note:** Clicking **Run Web Component** opens all the top-level WebVIs in your default browser at once.
  <!-- TODO DE12779: Performing Run Web Component opens all Top-Level Vis at the same time -->
5. Build the web application.  
  a. Open `WebApp.gcomp`.  
  b. On the **Document** tab, click **Build**.

# Hosting a Web Application on a Server
Copy and paste the entire `MultipleTopLevelVIs` directory built under `<Project Directory>/Builds/Web Server/Configuration1/` to any web server of your choosing.

## Hosting on the LabVIEW 2009-2017 Web Server
1. Navigate to `<National Instruments>\Shared\NI WebServer\www`.
2. Copy the `MultipleTopLevelVIs` directory into the `www` directory.
3. Open a web browser and navigate to `http://localhost:8080/MultipleTopLevelVIs/index.html`.

## Hosting on the NI SystemLink Server
1. Navigate to `<National Instruments>\Shared\Web Server\htdocs`.
2. Copy the `MultipleTopLevelVIs` directory into the `htdocs` directory.
3. Open a web browser and navigate to `http://localhost/MultipleTopLevelVIs/index.html`.

# Details

## File Name and Relative URL
Each of the top-level WebVIs generates a corresponding HTML file. The organization of the generated HTML files is determined by the hierarchy of the top-level WebVIs in the `WebApp.gcomp` file.

On the **Item** tab, you can change the file name for each WebVI and view the relative URL used for linking.  

Example:  

![Main.gviweb Item tab in .gcomp file showing File name and Relative URL fields](ComponentRightRail.png)

## Top-level WebVIs can be in any part of the namespace
Top-level WebVIs do not need to be at the root of the namespace. For example, `SubVIs/Attribution.gviweb` is marked as top-level and has a relative URL of `SubVIs/Attribution.html`.

## Change the File name to index.html for simpler URLs
The file name of the HTML output of a top-level WebVI does not need to match the name of the WebVI itself. For example, the file name of `Main.gviweb` is set to `index.html` rather than `Main.html`. Many static web servers automatically serve a file named `index.html` when a directory is requested, which makes for cleaner URLs. For example, on a compatible web server, a user can enter `www.example.com/MultipleTopLevelVIs/` or `www.example.com/MultipleTopLevelVIs/index.html` to view the same page.

## Centering a page in a web browser
The HTML view of each of the WebVIs in this example was modified to include a CSS file called `WebVICenter.css` and a JavaScript file called `WebVICenter.js`.
These files were added to center the WebVI content when you view the WebVI build output in a web browser.  
**Note:** `WebVICenter.css` contains hard-coded panel dimensions. Please refer to the documentation in both `WebVICenter.css` and `WebVICenter.js` if you would like to change the panel dimensions of the WebVI.

The following section contains an example of the content of the `WebVICenter.css` and `WebVICenter.js` files with reduced documentation. For more documentation, refer to the [WebVICenter.css](https://github.com/ni/webvi-examples/blob/master/MultipleTopLevelWebVIs/MultipleTopLevelWebVIs.gcomp/Resources/WebVICenter.css) and [WebVICenter.js](https://github.com/ni/webvi-examples/blob/master/MultipleTopLevelWebVIs/MultipleTopLevelWebVIs.gcomp/Resources/WebVICenter.js) files.

### WebVICenter.css
This file defines the CSS rules of the `webvi-center` class. When the `<body>` tag contains the `webvi-center` class, the layout of the HTML changes to a single column with centered elements.

```css
body.webvi-center {
    display: flex;
    flex-direction: column;
    align-items: center;
}
body.webvi-center #FrontPanelCanvas {
    position: relative;
    width: 320px; /* Make sure this matches the panel dimensions */
    height: 480px; /* Make sure this matches the panel dimensions */
    display: block;
}
```

### WebVICenter.js
This script determines whether the page is running in a web browser. If so, this script dynamically adds the `webvi-center` class to the `<body>` tag of the WebVI's HTML output.

```javascript
(function () {
    'use strict';

    var niWebAppElement = document.querySelector('ni-web-application');
    if (niWebAppElement === null) {
        return;
    }

    if (niWebAppElement.getAttribute('location').toLowerCase() !== 'browser') {
        return;
    }

    document.body.classList.add('webvi-center');
}());
```

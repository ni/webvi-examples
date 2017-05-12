<!-- The following should be equivalent to the section in webvi-examples/Readme.md -->
# Multiple Top-Level WebVIs
[![Multiple Top-Level WebVIs Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/MultipleTopLevelWebVIs/Builds/Web%20Server/Configuration1/MultipleTopLevelWebVIs/)
[![Multiple Top-Level WebVIs README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/MultipleTopLevelWebVIs)

This example demonstrates usage of multiple Top-Level WebVIs in a NXG Web Application.
Each Top-Level WebVI is built into a separate HTML file and the Hyperlink control is used to create clickable links between the different Top-Level WebVIs.
The example determines the correct URL to use for a Hyperlink control by examining the Relative URL property available for each item in the Component.

[![Multiple Top-Level WebVIs Demo Link](https://ni.github.io/webvi-examples/MultipleTopLevelWebVIs/MultipleTopLevelWebVIs.gif)](https://ni.github.io/webvi-examples/MultipleTopLevelWebVIs/Builds/Web%20Server/Configuration1/MultipleTopLevelWebVIs/)

# Dependencies
- LabVIEW NXG 2.0 Beta
- LabVIEW 2009-2017 (Required for hosting only)
- Skyline (Required for hosting only)

# Setup
- Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repo to your machine.
- Open MultipleTopLevelWebVIs\MultipleTopLevelWebVIs.lvproject
- Run the Main.gviweb WebVI
  - In the **Project Files** tab expand **MultipleTopLevelWebVIs.gcomp**
  - Open **Main.gviweb** and click the **Run** button
    <br> _Note: In the LabVIEW NXG Beta 2.0 Release clicking links to another Top-Level WebVI in a component will cause the WebVI to open in an external browser but the WebVI will not run_ <!-- TODO DE12694: Pressing run and clicking link to other top-level panel opens a link to broken web vi stuck in synchronization mode -->
- Test the Top-Level WebVIs
  - In the **Project Files** tab double-click the **System Designer**
  - In the **Web Server** target right click the **MultipleTopLevelVIs.gcomp** item and click **Run Web Component**
    <br> _Note: In the LabVIEW NXG Beta 2.0 Release clicking **Run Web Component** will open all the Top-Level WebVIs in your default browser at once_
    <!-- TODO DE12779: Performing Run Web Component opens all Top-Level Vis at the same time -->
- Build Web application
  - Open **MultipleTopLevelWebVIs.gcomp**
  - Switch to the **Document** tab
  - Click Build

# Hosting
Copy the entire `MultipleTopLevelWebVIs` directory built under `Builds/Web Server/Configuration1/` to any Web Server of your choosing.
## Hosting with LabVIEW 2009-2017 Web Server
1. Open `C:\Program Files (x86)\National Instruments\Shared\NI WebServer\www`
2. Copy the `MultipleTopLevelWebVIs` directory into the `www` directory
3. Open a Web Browser and navigate to `http://localhost:8080/MultipleTopLevelWebVIs/index.html`

## Hosting with Skyline Web Server
1. Open `C:\Program Files\National Instruments\Shared\Web Server\htdocs`
2. Copy the `MultipleTopLevelWebVIs` directory into the `htdocs` directory
3. Open a Web Browser and navigate to `http://localhost/MultipleTopLevelWebVIs/index.html`

# Details

## File Name and Relative URL
Each Top-Level WebVIs will create a corresponding HTML page where the organization of those pages is determined by position in the Component.
As can be seen in the following screenshot you have the ability to change the generated File Name for each WebVI as well as a seeing the Relative URL used for linking.

![Main.gviweb Right Rail View in Component showing File Name and Relative URL properties](ComponentRightRail.png)

## Top-Level WebVIs in Any Part of the Namespace
It is not required for Top-Level WebVIs to be at the root of the namespace.
For example, the `Resources/Attribution.gviweb` file is marked as Top-Level and has a Relative URL of `Resources/Attribution.html`.

## Using index.html for Simpler URLs
The Main.gviweb file has the File Name set to `index.html` rather than `Main.html`.
This was done as many static Web Servers will automatically serve files named `index.html` when a directory is requested which makes for cleaner URLs.
For example, on a compatible web server a user can visit `www.example.com/MultipleTopLevelWebVIs/` or `www.example.com/MultipleTopLevelWebVIs/index.html` to see the same page.

## Centering the page in Web Browsers
The Source Panel of each of the WebVIs in this example was modified to include a CSS file called `WebVICenter.css` and a JS file called `WebVICenter.js`.
These files were added to center the content of the WebVI in a deployed page.

Note: The `WebVICenter.css` contains hard coded panel dimensions.
Please see the documentation in both `WebVICenter.css` and `WebVICenter.js` if you would like to change the panel dimensions of the WebVI.

The following is the contents of the files with reduced documentation as an example. For more documentation see the [WebVICenter.css](https://github.com/ni/webvi-examples/blob/master/MultipleTopLevelWebVIs/MultipleTopLevelWebVIs.gcomp/Resources/WebVICenter.css) and [WebVICenter.js](https://github.com/ni/webvi-examples/blob/master/MultipleTopLevelWebVIs/MultipleTopLevelWebVIs.gcomp/Resources/WebVICenter.js) files.

### WebVICenter.css
When the webvi-center class is present on the body the layout of the page changes to a single column with centered elements.

```css
body.webvi-center {
    display: flex;
    flex-direction: column;
    align-items: center;
}
body.webvi-center #FrontPanelCanvas {
    position: relative;
    width: 320px; /* Must be updated if panel dimensions are changed */
    height: 480px; /* Must be updated if panel dimensions are changed */
    display: block;
}
```

### WebVICenter.js
Determines if the page is running in the browser and adds the webvi-center class to the body element of the WebVI

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

<!-- The following should be equivalent to the section in webvi-examples/Readme.md -->
# Multiple Top-Level VIs
[![Multiple Top-Level VIs Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)][MultipleTopLevelVIsDemoLink]
[![Multiple Top-Level VIs README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://ni.github.io/webvi-examples/MultipleTopLevelVIs/)

This example demonstrates usage of multiple Top-Level VIs in a NXG Component. Each Top-Level VI is built into a separate HTML file and using the hyperlink control one can create links pointing between different Top-Level VIs. The example uses the Component name and the VI name to create relative urls that point between the corresponding built HTML pages.

[![Multiple Top-Level VIs Demo Link](https://ni.github.io/webvi-examples/MultipleTopLevelVIs/MultipleTopLevelVIs.gif)][MultipleTopLevelVIsDemoLink]

[MultipleTopLevelVIsDemoLink]: (https://ni.github.io/webvi-examples/MultipleTopLevelVIs/Builds/Web%20Server/Configuration1/MultipleTopLevelVIs/)

# Dependencies
- LabVIEW NXG 2.0 Beta
- LabVIEW 2009-2017 (Required for hosting only)
- Skyline (Required for hosting only)

# Setup
- Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repo to your machine.
- Open Multiple Top-Level VIs\Multiple Top-Level VIs.lvproject
- Run the Web VI
  - In the **Project Files** tab expand **WebApp.gcomp**
  - Open **Main.gviweb** and click the **Run** button
    <br> _Note: In the LabVIEW NXG Beta 2.0 Release clicking links to another Top-Level VI in a component will cause the WebVI to open in an external browser but the WebVI will not run_ <!-- TODO DE12694: Pressing run and clicking link to other top-level panel opens a link to broken web vi stuck in synchronization mode -->
- Build Web application
  - Open **WebApp.gcomp**
  - Switch to the **Document** tab
  - Click Build

# Hosting
Place the entire `MultipleTopLevelVIs` directory built under `Builds/Web Server/Configuration1/` to any Web server of your choosing.
## Hosting with LabVIEW 2009-2017 Web Server
1. Open `C:\Program Files (x86)\National Instruments\Shared\NI WebServer\www`
2. Copy the `MultipleTopLevelVIs` directory into the `www` directory
3. Open a Web Browser and navigate to `http://localhost:8080/MultipleTopLevelVIs/index.html`

## Hosting with Skyline Web Server
1. Open `C:\Program Files\National Instruments\Shared\Web Server\htdocs`
2. Copy the `MultipleTopLevelVIs` directory into the `htdocs` directory
3. Open a Web Browser and navigate to `http://localhost/MultipleTopLevelVIs/index.html`

# Details
The following describes how the static Web page was built including including how parts of the WebVI are pulled into the page.

## Important Directories
- **`WebVI`**: Everything within this directory is either the source code of the WebVI of the build output from LabVIEW. Most of the path and filenames are defaults obtained by using the **Web Application** template in LabVIEW NXG 2.0.
 - **`WebVI/Builds/Web Server/Configuration1/WebApp`**: This is the important bits of the emitted by LabVIEW when the Web Application is built.
- **`StaticPageResources`**: This directory contains all the hand maintained HTML and CSS files of the static page. This example requires no additional JavaScript.

# Usage
This technique might be used when there is an existing Web page that can be enhanced with the addition of inline WebVIs. An example may be educational course material with a WebVI inline that visualizes data acquired in a lab setting.

[MultipleTopLevelVIsDemoLink]: (https://ni.github.io/webvi-examples/MultipleTopLevelVIs/Builds/Web%20Server/Configuration1/MultipleTopLevelVIs/Main.html)

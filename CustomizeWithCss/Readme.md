# Customize WebVI with CSS
[![Customize WebVI with CSS Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/CustomizeWithss/Builds/WebApp_Web ServerMain.html)
[![Customize WebVI with CSS README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/CustomizeWithCss)

This example demonstrates how to customize the HTML of a WebVI using CSS.

One of the main parts of a WebVI is an HTML output that displays HTML5 Custom Elements. One of the advantages of using CSS in a web application is to the separate content from style. For example, you could create a custom CSS file that is shared across the organization or even among other users to build more and more styles and layouts.

![Screenshot of Demo](https://ni.github.io/webvi-examples/CustomizeWithCss/Screenshot.gif)

# Usage
You can use this approach in your own projects if you are familiar with CSS and how it interacts with HTML. For example, you can customize controls and indicators to match a corporate color scheme or make them accessible for color-blind users or in low contrast situations.

# Dependencies
- LabVIEW NXG 2.0 Web Module
- LabVIEW 2009-2017 (Required for hosting only)

# Setup
1. Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repository to your machine.
2. Open `CustomizeWithCss/CustomizeWithCss.lvproject`.
3. On the **Project Files** tab, expand `WebApp.gcomp` and open `Main.gviweb`.
4. Click the **Run** button.
5. Build the web application.  
  a. On the **Project Files** tab, double-click `WebApp.gcomp` to open the web application component.  
  b. On the **Document** tab, click **Build**.  
**Note:** To view the build output on your machine, click **Locate Directory in Windows Explorer** on the **Document** tab once your application finishes building.

# Hosting
Copy and paste the entire `CustomizeWithCss/Builds/WebApp_Web Server` directory to any web server you want.

## Hosting with LabVIEW 2009-2017 Web Server
1. Open `C:\Program Files (x86)\National Instruments\Shared\NI WebServer\www`.
2. Copy `Customize with CSS/Builds/Web Server/Configuration1/WebApp` directory into the `www` directory.
3. Open a web browser and navigate to `http://localhost:8080/WebApp/index.html`.  
**Note:** NI recommends using Mozilla Firefox to view HTML files generated from a web application project.

# Details

## Adding custom CSS rules to a WebVI
1. Switch to the HTML editor of a WebVI.
2. Enter the following lines between the `<head></head>` tags.  
    ```css
        <style>
            selector {
                property: value;
            }
        </style>
    ```

3. Click the **Apply** button on the top right corner of the document toolbar and build the web application again. Refer to the [setup section](# Setup) for instructions on building a web application.

## CSS rule behavior
The following section describes the behavior of  different CSS rules you can add to the **HTML** editor of the WebVI.

Change the background color of the whole document. Change the background color of the front panel and add a drop shadow.
```css
    body {
        background-color: #FFFFFF;
    }

    .ni-front-panel {
        background-color: #00ADEF;
        box-shadow: 0px 0px 18px 3px rgba(0, 0, 0, 0.75);
    }
```

Change the color of graphs scales. Replace the white background for charts and graphs with a transparent background and change the padding around the charts and graphs.
```css
    ni-cartesian-graph {
        background: transparent;
        border: none;
    }

    ni-cartesian-graph .flot-x-axis,
    ni-cartesian-graph .flot-y-axis {
        color: #FFFFFF;
    }

    ni-cartesian-graph ni-grid-div {
        background-color: transparent;
    }

    ni-cartesian-axis {
        color: #FFFFFF;
    }
```

Change the color for slider label, track, fill, tick marks, and scales.
```css
    jqx-slider .jqx-scale .jqx-tick {
        background: #FFFFFF;
    }

    jqx-slider .jqx-label {
        color: #FFFFFF;
    }

    jqx-slider .jqx-track .jqx-value {
        background-color: #ffff00;
    }

    jqx-slider .jqx-container .jqx-track {
        background-color: transparent;
        border-color: #d3d3d3;
    }
```
Change the color for tank and circular progress bar fill.

```css
    jqx-tank .jqx-track .jqx-value {
        background-color: #ffff00;
    }

    jqx-circular-progress-bar .jqx-value {
        stroke: #ffff00
    }

```

Remove all boarder from  numeric indicators
```css
    jqx-numeric-text-box {
          color: #ffff00;
    }

    jqx-numeric-text-box[readonly="true"] .jqx-numeric-text-box-component {
        background-color: transparent;
        border: none;
    }

    jqx-numeric-text-box input.jqx-numeric-text-box-component {
        background-color: transparent;
        border: none;
    }

    jqx-numeric-text-box input.jqx-numeric-text-box-component:hover {
        border: none;
    }
```

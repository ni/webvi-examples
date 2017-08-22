# Customize WebVI with CSS
[![Customize WebVI with CSS Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/Customize%20with%20CSS/Builds/Web%20Server/Configuration1/WebApp/Main.html)
[![Customize WebVI with CSS README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/Customize%20with%20CSS)

This example demonstrates how to customize the HTML output of a WebVI using CSS.

One of the main parts of a WebVI is an HTML output that displays HTML5 Custom Elements. One of the advantages of using CSS in a web application is to the separate content from style. For example, you could create a custom CSS file that is shared across the organization or even among other users to build more and more styles and layouts.

![Screenshot of Demo](https://ni.github.io/webvi-examples/Customize%20with%20CSS/Screenshot.gif)

# Usage

You can use this approach in your own projects if you are familiar with CSS and how it interacts with HTML. For example, you can customize controls and indicators to match a corporate color scheme or make them accessible for color-blind users or in low contrast situations.

# Dependencies
- LabVIEW NXG 2.0 Beta
- LabVIEW 2009-2017 (Required for hosting only)

# Setup
1. Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repository to your machine.
2. Open `Customize with CSS/Customize with CSS.lvproject`.
3. On the **Project Files** tab, expand `WebApp.gcomp` and open `Main.gviweb`.
4. Click the **Run** button.
5. Build the web application.  
  a. On the **Project Files** tab, double-click `WebApp.gcomp` to open the web application component.  
  b. On the **Document** tab, click **Build**.  
**Note:** To view the build output on your machine, click **Locate Directory in Windows Explorer** on the **Document** tab once your application finishes building.

# Hosting

Copy and paste the entire `Customize with CSS/Builds/Web Server/Configuration1/WebApp` directory to any web server you want.

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
            [selector] {
                [property]: [value];
            }
        </style>
    ```
3. Click the **Apply** button on the top right corner of the document toolbar and build the web application again. Refer to the [setup section](# Setup) for instructions on building a web application.

## CSS rule behavior
The following section describes the behavior of  different CSS rules you can add to the **HTML** editor of the WebVI.

Change the background color of the whole document. Change the background color of the front panel and add a drop shaddow.
```css
    body {
        background-color: #ffff00;
    }

    .ni-front-panel {
        background-color: #777777;
        box-shadow: 0px 0px 18px 3px rgba(0, 0, 0, 0.75);
    }
```

Change the weight and color of the label text. Note the extra `label` selector to override another rule with less [specificity](https://www.w3.org/TR/css3-selectors/#specificity).
```css
    ni-label label {
        color: #ffff00;
        font-weight: 700
    }

    /* The next two rules change the color of label text and free text. */
    jqx-tank .jqx-label,
    jqx-slider .jqx-label {
        color: #ffff00;
    }

    ni-text div {
        color: #ffff00;
    }

```

Change the color of all text in scales, such as in charts and graphs. Replace the white background for charts and graphs with a transparent background and change the padding around the charts and graphs.
```css

    ni-cartesian-graph .webchart-drawing-layer {
        color: #ffff00;
    }

    ni-cartesian-graph {
        background: transparent;
        border: none;
    }

    ni-cartesian-graph ni-grid-div {
        background-color: transparent;
    }
```

Change the color for all tick marks in scales.
```css
    .jqx-scale .jqx-tick {
        background: #ffff00;
    }
```


Change the accent color of controls.
```css

    jqx-slider .jqx-track .jqx-value {
        background-color: #ffff00;
    }

    jqx-slider .jqx-container .jqx-track {
        background-color: transparent;
        border-color: #d3d3d3;
    }

    jqx-tank .jqx-track .jqx-value {
        background-color: #ffff00;
    }

    jqx-circular-progress-bar .jqx-value {
        stroke: #ffff00
    }

    jqx-switch-button[checked] span.jqx-thumb {
        background-color: #ffff00;
    }

    jqx-switch-button .jqx-true-content-container {
        background: #484746;
    }

    jqx-power-button[checked] .jqx-input:after {
        background-color: #ffff00;
    }

    jqx-progress-bar .jqx-container .jqx-value {
        background-color: #ffff00;
    }

    jqx-progress-bar .jqx-container .jqx-value {
        background-color: #ffff00;
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

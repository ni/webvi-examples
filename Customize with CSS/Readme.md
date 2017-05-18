# Customize WebVI with CSS
This example demonstrates how to customize the HTML output of a WebVI using CSS. 

One of the main parts of a WebVI is an HTML output that displays HTML5 Custom Elements. One of the advantages of using CSS in a web application is to the separate content from style. For example, you could create a custom CSS file that is shared across the organization or even among other users to build more and more styles and layouts.

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

Change the background color of the whole document.
```css
    body {
        background-color: #777777;
    }
```

Change the weight and color of the label text. Note the extra `label` selector to override another rule with less [specificity](https://www.w3.org/TR/css3-selectors/#specificity).
```css
    ni-label label {
        color: #FF9800;
        font-weight: 700
    }
    
    /* The next two rules change the color of label text and free text. */
    .jqx-label {
        color: #FF9800 !important; /* Override all other rules. */
    }

    ni-text div {
        color: #FF9800;
    }
```

Change the color of all text in scales, such as in charts and graphs.
```css
    ni-intensity-graph .flot-text {
        color: #FF9800;
    }
    
    ni-intensity-graph .webchart-drawing-layer {
        color: #FF9800;
    }

    ni-chart ni-cartesian-plot .webchart-drawing-layer {
        color: #FF9800;
    }

    ni-cartesian-graph .webchart-drawing-layer {
        color: #FF9800;
    }
```

Change the color for all tick marks in scales.
```css
    .jqx-scale .jqx-tick {
        background: #FF9800;
    }
```

Replace the white background for charts and graphs with a transparent background and change the padding around the charts and graphs.
```css
    /* Make the white background for charts and graphs transparent. */
    ni-intensity-graph {
        background-color: transparent;
        border-color: transparent;
    }

    ni-cartesian-graph {
        background: transparent;
        border: 0;
    }
    
    ni-chart {
        background-color: transparent;
        border-color: transparent;
        padding: 0;
        color: #FF9800 !important;
    }
    
    ni-data-grid jqx-checkbox .jqx-container {
        height: inherit;
        position: inherit;
    }
    
    ni-data-grid jqx-checkbox .jqx-input {
        margin: auto;
    }
```

Change the accent color of controls.
```css
    
    jqx-slider .jqx-track .jqx-value {
        background-color: #FF9800;
    }
    
    jqx-tank .jqx-track .jqx-value {
        background-color: #FF9800;
    }
    
    circle.jqx-value {
        stroke: #FF9800;
    }
    
    jqx-switch-button[checked] span.jqx-thumb {
        background-color: #FF9800;
    }
    
    jqx-slider .jqx-container .jqx-track {
        background-color: transparent;
        border-color: #d3d3d3;
    }
    
    jqx-power-button[checked] span.jqx-input {
        background-color: #FF9800;
    }
    
    jqx-led .jqx-container .jqx-true-content-container {
        background-color: #FF9800;
    }
    
    jqx-progress-bar .jqx-container .jqx-value {
        background-color: #FF9800;
    }
```

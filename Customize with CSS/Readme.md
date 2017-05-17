# Customize WebVI with CSS

One of the main components of WebVIs is a html panel that is used to display HTML5 custom elements, that can be connected to the block diagram. One of the main advantages of leveraging the styling to the web is the separation of concerns. Meaning, a customer can create a custom CSS file that can be shared across the organization or even among other users to build more and more styles and layouts.

# Dependencies
- LabVIEW NXG 2.0 Beta
- LabVIEW 2009-2017 (Required for hosting only)

# Setup
- Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repo to your machine.
- Open `Customize with CSS/Customize with CSS.lvproject`
    - Run the Web VI
        - Open Main.gviweb and click the Run button
    - Build Web application
        - Open WebApp.gcomp
        - Switch to the Document tab
        - Click Build

# Hosting

Place the entire contents of the `Customize with CSS/Builds/Web Server/Configuration1/WebApp` directory within any Web server of your choosing.

## Hosting with LabVIEW 2009-2017 Web Server

1. Open `C:\Program Files (x86)\National Instruments\Shared\NI WebServer\www`
2. Copy `Customize with CSS/Builds/Web Server/Configuration1/WebApp` directory into the `www` directory
3. Open a Web Browser and navigate to `http://localhost:8080/WebApp/index.html`

# Details

The next section describes the CSS added to the **Html** panel as a `<style>` tag. Except here is commented to better explain it.

Change the background color of the whole document.
```css
    body {
        background-color: #777777;
    }
```

Let's give the labels a little bit more weight and change the color. Notice the extra `label` selector to override another rule with less [specificity](https://www.w3.org/TR/css3-selectors/#specificity).
```css
    ni-label label {
        color: #FF9800;
        font-weight: 700
    }
    
    /* Next two rules, change color of labels and free text */
    .jqx-label {
        color: #FF9800 !important; /* override all other rules */
    }

    ni-text div {
        color: #FF9800;
    }
```


Now change the color of all text in scales, like charts, graphs, 
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

Set the color for all tick marks that are in scales
```css
    .jqx-scale .jqx-tick {
        background: #FF9800;
    }
```

Some special treatment for the charts and graphs that are contained in a white rectangle, for these we'll make them transparent and adjust the padding to use the space better.
```css
    /* Get rid of the white background for charts and graphs */
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
Change the accent color of the controls. 
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

Finally put all of these CSS rules in the HTML panel, press the `Apply` button on the upper right corner and build the component again, following instructions from the [setup section](#Setup). 

# Usage

This approach can be replicated by any LabVIEW NXG developer that is already familiar with CSS and how they interact with HTML. For example changing the controls to match corporate colors or special considerations like color-blindness or low contrast situations.
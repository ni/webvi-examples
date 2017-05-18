# Embed a WebVI into Web Content
This example demonstrates how to embed a WebVI built using LabVIEW NXG 2.0 Beta into an static web page. 

WebVIs are composed of three basic parts: 
- HTML5 Custom Elements
- WebVI diagram (.via.txt)
- JavaScript and CSS files. 

Because these are the same basic building blocks of all other web pages, you can pull the WebVI apart and embed it in any web content.

# Dependencies
- LabVIEW NXG 2.0 Beta
- LabVIEW 2009-2017 (Required for hosting only)
- NI SystemLink Server (Required for hosting only)

# Setup
1. Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repository to your machine.
2. Open `Embed WebVI into Content/WebVI/Embed WebVI into Content.lvproject`.
3. On the **Project Files** tab, expand `WebApp.gcomp` and open `Main.gviweb`.
4. Click the **Run** button.
5. Build the web application.
  a. On the **Project Files** tab, double-click `WebApp.gcomp` to open the web application component.
  b. On the **Document** tab, click **Build**.
**Note:** To view the build output on your machine, click **Locate Directory in Windows Explorer** on the **Document** tab once your application finishes building.

# Hosting
Copy and paste the entire `Embed WebVI into Content` directory to any web server you want.

## Hosting on the LabVIEW 2009-2017 Web Server
1. Open `C:\Program Files (x86)\National Instruments\Shared\NI WebServer\www`.
2. Copy the `Embed WebVI into Content` directory into the `www` directory.
3. Open a web browser and navigate to `http://localhost:8080/Embed%20WebVI%20into%20Content/index.html`.
**Note:** NI recommends using Mozilla Firefox to view HTML files generated from a web application project. 

## Hosting on the NI SystemLink Server
1. Open `C:\Program Files\National Instruments\Shared\Web Server\htdocs`.
2. Copy the `Embed WebVI into Content` directory into the `htdocs` directory.
3. Open a web browser and navigate to `http://localhost/Embed%20WebVI%20into%20Content/index.html`.
**Note:** NI recommends using Mozilla Firefox to view HTML files generated from a web application project. 

## Published Example
You can find the fully assembled and hosted web application on [Github Pages]({{site.github.url}}/Embed%20WebVI%20into%20Content/index.html) TODO: Double check link once Github pages is up and running. 

# Details
The following sections describe how the static web page was built including including how parts of the WebVI are pulled into the page.

## The Basic Structure of the Static Page
This page is structured like many common marketing pages.
### Hero and Sections
```html
<div class="section" id="hero">
  <div class="container">
    <h1>WebVI</h1>
  </div>
  <div class="right-content container">
    <div>LabVIEW on the Web</div>
    <div>HTML5 Engineering Custom Elements</div>
    <div>Portable, Embeddable, Web Standards</div>
  </div>
</div>
```
The hero section (above) is structured much like the other sections of the page. The `section` class defines the behavior of the overall row and within the section is one or more containers (usually two or three). Each container is a column of content like text, images, HTML elements and custom elements.

### Flexbox
This page reflows content as the viewport changes size. This technique, known as responsive, is a common pattern available in many other frameworks such as Bootstrap. Flexbox is used here to achieve this same affect.

```css
.section {
  display: flex;
  justify-content: space-around;
  padding-bottom: 5px;
}
```
This CSS for the .section class defines one of the flexbox containers used throughout the page. The `justify-content` property is used to allow the content within the flexbox container to move apart as the page grows and together as the page shrinks until the content wraps. In this page the content is always within a `.container` class.

The content within a `.container` does not reflow as the page resizes, but it does use flexbox to align and stack its content. Together with the `content-item` or `content-text` classes, each container is a constant 375px width. This width was chosen because its the portrait width of the iPhone 5.

```css
.container {
  display: flex;
  text-align: center;
  flex-direction: column;
  justify-content: center;
}
...
.content-item{
  width: 375px;
  height: 667px;
  margin-top: 5px;
  margin-left: auto;
  margin-right: auto;
}
```

## Authoring the WebVI
This example leverages LabVIEW's absolute layout system for the layout of the controls and indicators and places these within a `.container` that is laid out relative to the rest of the page content. This is not strictly necessary since the WebVI custom elements can be incorporated into a page without any absolute layout.

### Approximating Relative Layout
To provide feedback to the 375px bounds of `.content-item`, CSS has been added to the WebVI using the **HTML** aspect of the WebVI.
```html
<style>
  .front-panel {
    display: inline-block;
    width: 375px;
    height: 667px;
    position: relative;
    overflow: show;
    border-style: solid;
  }
</style>
...
<section id="FrontPanelCanvas" class="front-panel">

```
Once the content is placed within this box and the WebVI is built we have the correct CSS needed to achieve the same layout within a `.container`.

<img src="box-in-lv.PNG" alt="Render black box in LabVIEW text" width="50%">

### Build Process
Open `WebApp.gcomp` go to the **Document** tab and click **Build**. This produces the HTML (`Main.html`)of the front panel, the CSS defining the controls' absolute layout, and the compiled WebVI block diagram (`Main.via.txt`).

## Coping HTML Custom Elements, Styles, and References
This is the most brittle part of the process. If a controls is removed, added, or replaced this copy/paste process must occur again to incorporate them into the final page. Changes to the block diagram are less brittle since we can refer to the .via.txt using a relative path that does not change when the Web application is rebuilt.

### Control Custom Elements
```html
<jqx-slider data-ni-base-style="uninitialized" ni-control-id='28' binding-info='{"prop":"value","dco":0,"dataItem":"dataItem_Slider","unplacedOrDisabled":false,"sync":false}' label-id='29' value='0' min='0' max='9' interval='1' scale-position='far' ticks-visibility='minor' labels-visibility='all' format='decimal' significant-digits='6' scale-type='floatingPoint' orientation='horizontal'></jqx-slider>
```
Above is one of the sliders found in the page. It has a lot of properties which are usually set in LabVIEW and left alone afterwords. Each of these are copied from `Main.html` (built by LabVIEW) and pasted into `index.html` (written by hand).

```css
jqx-slider[ni-control-id='28'] {
  left: 20px;
  top: 450px;
  width: 250px;
  height: 62px;
  font-size: 12px;
  font-family: Roboto Condensed, sans-serif;
  font-style: normal;
  font-weight: normal;
  text-decoration: none;
}
```

Additionally the CSS emitted at the top of `Main.html` is copied into `main.css`. This CSS defines the absolute position, width, and height of each custom element. Small changes have been made to this CSS as the page was hand-tuned to look 'just right'.

### `web-application` and `ni-virtual-instrument` Custom Elements
In order for the WebVI to continue to run in the new page these two custom elements must also be copied into the HTML of the new page. They have no visual presence but the define the location of the `.via.txt` and configuration of Vireo.

The `ni-virtual-instrument` custom element needs no modification after it has been emitted into `Main.html` from LabVIEW. The `vireo-source` property `web-application` must be updated to reflect the relative path between `index.html` and `Main.via.txt`.

```html
<ni-web-application engine="VIREO" location="BROWSER" vireo-source="WebVI/Builds/Web%20Server/Configuration1/WebApp/Main.via.txt"><ni-virtual-instrument vi-name="Main.gviweb"></ni-virtual-instrument></ni-web-application>

```

## Important Directories
- **`WebVI`**: Everything within this directory is either the source code of the WebVI of the build output from LabVIEW. Most of the path and filenames are defaults obtained by using the **Web Application** template in LabVIEW NXG 2.0.
 - **`WebVI/Builds/Web Server/Configuration1/WebApp`**: This is the important bits of the emitted by LabVIEW when the Web Application is built.
- **`StaticPageResources`**: This directory contains all the hand maintained HTML and CSS files of the static page. This example requires no additional JavaScript.

# Usage
This technique might be used when there is an existing Web page that can be enhanced with the addition of inline WebVIs. An example may be educational course material with a WebVI inline that visualizes data acquired in a lab setting.

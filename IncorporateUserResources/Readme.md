# Incorporate User Resource into WebVI
[![Incorporate User Resource into WebVI Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/IncorporateUserResources/Builds/WebApp_Web%20Server/Main.html)
[![Incorporate User Resource into WebVI README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/IncorporateUserResources)

This example demonstrates how to add resource files such as images, CSS files, JavaScript files, and HTML files to your web application component and reference them in a WebVI without needing to upload these files to a web server.

You can also use resource files to augment the WebVI's capabilities. For example, you can add other HTML widgets or scripts and reference them in the HTML view of the WebVI.

![Screenshot of Demo](https://ni.github.io/webvi-examples/IncorporateUserResources/Screenshot.gif)

# Dependencies
- LabVIEW NXG 2.0 Web Module

# Setup
1. Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repository to your machine.
2. Open `Incorporate User Resources/IncorporateUserResources.lvproject`.
3. On the **Project Files** tab, expand `WebApp.gcomp`.
4. Double-click `Main.gviweb` to open it.

# Details
This example uses two types of resources: images and CSS files.

Two images are included in a child namespace within the `WebApp.gcomp` file called `images`: the National Instruments logo (`.svg`), and a screenshot of the diagram code (`.png`).

A CSS file is included in a child namespace called `styles`. The file `main.css` styles the WebVI header at the top of the panel.

Refer to the following sections to learn how to add resource files to a web application component and reference them in a WebVI.

### Adding resource files to a web application component
1. Open or create a web application project.
2. On the **Project Files** tab, double-click `WebApp.gcomp` to open the web application component.
3. Decide on a folder structure for your files. You can add all files to the same folder, or you can organize files in subfolders, such as a `styles` folder for CSS files or an `images` folder for image files.
4. _(Optional)_ Create namespaces that correspond to each folder in your folder structure.  
a. In the component document, right-click an existing namespace and select **Add Namespace**.  
b. Repeat the previous step for every namespace you want to create.
5. In the component document, right-click the namespace you want to add resource files to and select **Import File(s)**.  
**Note:** You must save your component document before you can import files.

### Referencing resource files in a WebVI
You can reference a resource file using its relative URL. The relative URL is determined by the namespace of the WebVI and the namespace of the resource file.  

Examples:
- **WebVI:** `Application/Main.gviweb`  
  **Resource file:** `Application/myImage.jpg`  
  **Relative URL:** `myImage.jpg`  
- **WebVI:** `Application/ChildNamespace1/Main.gviweb`  
  **Resource:** `Application/ChildNamespace2/myImage.jpg`  
  **Relative URL:** `../ChildNamespace2/myImage.jpg`  

#### Referencing images (*.png, *.bmp, *.jpg, *.jpeg, *.gif, *.svg, *.webp, *.ico)
1. On the panel of a WebVI, add a **URL Image** control.
2. Select the URL image control. On the **Item** tab, set **Source URL** to the relative URL of the image you you want to reference.  
**Note:** The source URL needs to be URL-encoded. For example, `my image.jpg` should be `my%20image.jpg`.

#### Referencing CSS files (*.css)
1. In a WebVI, switch to the HTML editor.  
**Note:** You can select the active editor from the document toolbar.
2. Add the following line in between the `<head></head>` tags:  
`<link rel="stylesheet" type="text/css" href="[your-stylesheet].css">`  
Example:
    ```
    <head>
        ...
        <link rel="stylesheet" type="text/css" href="main.css">
    </head>
    ```

#### Referencing JavaScript files (*.js)
1. In a WebVI, switch to the HTML editor.  
**Note:** You can select the active editor from the document toolbar.
2. Add the following line in between the `<head></head>` tags:  
`<script src="[your-script].js" type="text/javascript"></script>`  
Example:
    ```
    <head>
        ...
        <script src="myscript.js" type="text/javascript"></script>
    </head>
    ```

#### Referencing HTML files (*.html, *.htm)
1. On the panel of a WebVI, add a **Hyperlink Control**.
2. Select the hyperlink control. On the **Item** tab, set **URL** to the relative URL of the HTML file you you want to reference.

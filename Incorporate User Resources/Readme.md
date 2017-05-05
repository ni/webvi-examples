# Incorporate User Resource into WebVI
This example demonstates how to include user resource files such as images, CSS files, JavaScript files, and HTML files into your Web Application Component, for use with Web VIs.

# Dependencies
- LabVIEW NXG 2.0 Beta

# Setup
- Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repo to your machine.
- Open Incorporate User Resources/Incorporate User Resources.lvproject
- Open WebApp.gcomp, and then Main.gviweb in that component.

# Details
## Example Information
The included example uses two types of resources: images, and CSS files (stylesheets).

2 images are included in a child namespace called 'images': the National Instruments logo (.svg), and a screenshot of the block diagram code (.png). A CSS file is also included (styles/main.css), which styles the Web VI header at the top of the panel. See the next section for information on how these resources are referenced from the panel.

## Using User Resources in LabVIEW NXG
The Web VI has several ways to reference existing content (resource files). These resources can be added from the LabVIEW NXG, viewed from the editor at edit-time and run-time, and will also be included in a built Web Application Component.

To add resource files:
- Open the Web Application Component (.gcomp) document
- Decide on a namespace / folder hierarchy for your files. Files can be added to the root namespace, but you may want to create child namespaces / folders to put them in, such as a "styles" folder for CSS files, an "images" for image files, etc.
- Select the destination namespace in the component document, and choose "Import File(s)". Note that you must have already saved your Web Application Component to disk for the import option to be enabled.

User resources are referenced via a relative URL. This URL depends on what namespace the Web VI is in, and the namespace of the user resource.  
Examples:
| *Web VI location*                       | *Resource location*                     | *Relative URL*                 |
| --------------------------------------- |:---------------------------------------:| ------------------------------:|
| Application:Main.gviweb                 | Application:myImage.jpg                 | myImage.jpg                    |
| Application:ChildNamespace1:Main.gviweb | Application:ChildNamespace2:myImage.jpg | ../ChildNamespace2/myImage.jpg |

Images (*.png, *.bmp, *.jpg, *.jpeg, *.gif, *.svg, *.webp, *.ico):
- From the front panel palette, expand the Drawings category, then drop a URL Image
- Select the image control. In the right rail, set the Source URL property to the relative URL to the image you included.  
Also, note that the URL should be URL-encoded. For example, to include "my image.jpg", the Source URL should be "my%20image.jpg".

CSS stylesheets (*.css):
- Go to the "HTML" editor of your Web VI. The active editor picker is directly below the document tab, near the top.
- Find the `<head>` section.
- Before the `</head>` line, add a reference to your CSS file, using its relative URL. For example:  
`<link rel="stylesheet" type="text/css" href="main.css">`

JavaScript files (*.js):
- Go to the "HTML" editor of your Web VI. The active editor picker is directly below the document tab, near the top.
- Find the `<head>` section.
- Before the `</head>` line, add a reference to your JS file, using its relative URL. For example:  
`<script src="myscript.js" type="text/javascript"></script>`

HTML files (*.html, *.htm):
- From the front panel palette, expand the Text category, then drop a Hyperlink Control.
- Select the hyperlink. In the right rail, set the URL to the relative URL of the HTML file you included.

# Usage
This approach can be used to include existing resource files (such as images) and use them with a Web VI, without needing to upload those files to a web server ahead of time.

The resource files can also be used to augment the Web VI's capabilities. Users can add other HTML widgets or scripts, and use them from the HTML editor view of the Web VI.

# Call LabVIEW Web Service
[![Call LabVIEW Web Service Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/CallLabVIEWWebService/WebVI/Builds/WebApp_Web%20Server/Main.html)
[![Call LabVIEW Web Service README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/CallLabVIEWWebService)

This example demonstrates how to create a WebVI that makes requests to a LabVIEW web service, and how to create a LabVIEW 2016 web service that can respond to requests from a WebVI.

![Screenshot of Demo](https://ni.github.io/webvi-examples/CallLabVIEWWebService/Screenshot.gif)

# Usage
Use LabVIEW 2016 to create web services that do what WebVIs can't do, such as:
  - Complex data analysis
  - Signal processing
  - Interacting with hardware
  - Reading and writing data to and from file systems and databases

# Dependencies
- LabVIEW NXG 2.0 Web Module
- LabVIEW 2016

# Setup
1. Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repository to your machine.
2. Open `CallLabVIEWWebService\WebService\WebService.lvproj` in LabVIEW 2016.
3. In the **Project Explorer**, right-click **Web Server** and select **Start**.
4. Open `Call LabVIEW Web Service\WebVI\CallLabVIEWWebService.lvproject` in LabVIEW NXG 2.0.
5. Open `Main.gviweb` and click the **Run** button.
6. Build the web application.  
  a. Open `WebApp.gcomp`.  
  b. On the **Document** tab, click **Build**.

**Note:** To view the build output on your machine, click **Locate Directory in Windows Explorer** on the **Document** tab once your application finishes building. You can automatically launch and view the Web application locally by going to **System Designer** >> **Web Sever** >> right-click **WebApp.gcomp** >> **Run**

# Hosting
Copy and paste the build output at `\CallLabVIEWWebService\Builds` directory to any web server you want.

## Hosting on the LabVIEW 2009-2017 Web Server
1. Open `C:\Program Files (x86)\National Instruments\Shared\NI WebServer\www`.
2. Copy the `WebApp+Web Server` directory into the `www` directory.
3. Open a web browser and navigate to `http://localhost:8080/WebApp_Web%20Server/Main.html`


## Hosting on the NI Web Server
1. Open `C:\Program Files\National Instruments\Shared\Web Server\htdocs`.
2. Copy the `WebApp_Web Server` directory into the `htdocs` directory.
3. Open a web browser and navigate to `http://localhost:9090/WebApp_Web%20Server/Main.html`.

# Details

## Important Directories
- **`Web Service`** &mdash; Contains the LabVIEW 2016 web service project.
- **`WebVI`** &mdash; Contains the LabVIEW NXG 2.0 web application project, which includes the WebVI.
- **`WebVI/Builds/WebApp_Web Server`** &mdash; Contains the built web application, which consists of HTML, JavaScript, the compiled diagram, and other web content.

## The Web Service
The web service is created in LabVIEW 2016 and consists of two HTTP endpoint methods (one `GET` and one `POST`) and a few subVIs.

### Output Type
You must configure the Output Type correctly in order for a LabVIEW web service to send data to a WebVI.
1. In the **Project Explorer**, right-click **Web Server** and select **Properties**.
**Note:** The Web Server must be stopped before you can edit its properties.
2. On the left navigation menu, select **HTTP Method VI Settings**.
3. Select a Web Service VI from the table and click the **Output Type** tab under **Web Service VI Properties**.
4. Choose one of the following options.  
  a. Option 1 (recommended): Select **Stream** and enable the **Use headers** and **Buffered** checkboxes.  
**Note:** This option requires the web service VI to flatten return data to JSON and return it through `Write Response.vi`.  
  b. Option 2: Select **Terminal** and select **JSON** as the output format.  
**Note:** This option returns data through VI output terminals and serializes LabVIEW data into JSON automatically.

### CORS
Cross-Origin Resource Sharing (CORS) allows a Web Service VI to respond to HTTP requests from a different server than where it is hosted. `AddCORSHeaders.vi` adds HTTP headers to allow requests from any origin. This configuration is necessary if your WebVI is not hosted on the LabVIEW 2016 web server.

## The WebVI
The WebVI makes requests to both of the HTTP endpoint methods in the LabVIEW 2016 web service and displays the returned data. For the POST method, it collects some parameter information from the panel controls and serializes it into the POST buffer.

## Bundling with LabVIEW Web Services
This example show how to include your WebVI as part of your LabVIEW Web service and deploy them together. This is advantageous if you want to avoid CORS between your WebVI and Web service in production. This also allows the use of relative URLs on the WebVI block diagram.

### Project Setup
The `WebApp_Web Server` directory has been included as **Public Content** within the LabVIEW 2016 project. This was done by right-clicking the Web service in the project and selecting Add **Public Content Folder**. In the **Open** dialog the `WebApp_Web Server` directory was selected. This is an *auto populating* folder so changes made by modifying the WebVI and rebuilding the application in LabVIEW NXG are automatically up taken by LabVIEW 2016 project.

### URL Configuration Enum
In the WebVI there is a drop down for selecting the URL configuration.
- **Use Absolute URLs and Local Debugging**: This uses fully qualitied URLs; e.g. `http://127.0.0.1:8001/Web_Server/ParametricCurve` in each HTTP request. Fully qualified URLs must be used if the Web service access by the WebVI is on a different host than the WebVI itself; eg. CORS. The port here is the **Local Debugging** port used by LabVIEW 2016 when the Web service is hosted by LabVIEW. This is enabled by right-clicking the Web Service in the LabVIEW 2016 project and selecting **Start**.
- **Use Relative URLs and Application Web Server**: This uses a relative URLs; e.g. `ParametricCurve` in each HTTP request. The rest of the URL is filled in automatically by the browser. This technique is useful because URLs in code don't need to be changed as the hostname, protocol, or port or the Web service is changed. The Web service and WebVI are deployed to the **Application Web Server** by right-clicking the Web service in the LabVIEW 2016 project and selecting **Publish**.

# Call LabVIEW Web Service
[![Call LabVIEW Web Service Demo Link](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/Call%20LabVIEW%20Web%20Service/WebVI/Builds/Web%20Server/Configuration1/WebApp/Main.html)
[![Call LabVIEW Web Service README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/blob/master/Call%20LabVIEW%20Web%20Service/)

This example demonstrates how to create a WebVI that makes requests to a LabVIEW web service, and how to create a LabVIEW 2016 web service that can respond to requests from a WebVI.

# Usage
Use LabVIEW 2016 to create web services that do what WebVIs can't do, such as:
  - Complex data analysis
  - Signal processing
  - Interacting with hardware
  - Reading and writing data to and from file systems and databases

# Dependencies
- LabVIEW NXG 2.0 Beta
- LabVIEW 2016

# Setup
1. Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repository to your machine.
2. Open `Call LabVIEW Web Service\Web Service\Web Service.lvproj` in LabVIEW 2016.
3. In the **Project Explorer**, right-click **Web Server** and select **Start**.
4. Open `Call LabVIEW Web Service\WebVI\Call LabVIEW Web Service.lvproject` in LabVIEW NXG 2.0 Beta.
5. Open `Main.gviweb` and click the **Run** button.
6. Build the web application.  
  a. Open `WebApp.gcomp`.  
  b. On the **Document** tab, click **Build**.

# Details

## Important Directories
- **`Web Service`** &mdash; Contains the LabVIEW 2016 web service project.
- **`WebVI`** &mdash; Contains the LabVIEW NXG 2.0 Beta web application project, which includes the WebVI.
- **`WebVI/Builds/Web Server/Configuration1/WebApp`** &mdash; Contains the built web application, which consists of HTML, JavaScript, the compiled diagram, and other web content.

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

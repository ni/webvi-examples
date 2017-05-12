# Call LabVIEW Web Service
This example demonstrates how to create a WebVI which can make requests to a LabVIEW web service, and how to create a LabVIEW 2016 web service which can respond to requests from a WebVI.

# Dependencies
- LabVIEW NXG 2.0 Beta
- LabVIEW 2016

# Setup
- Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repo to your machine.
- Open "Call LabVIEW Web Service\Web Service\Web Service.lvproj" in LabVIEW 2016.
- In the Project Explorer, right-click **Web Server** and click **Start**
- Open "Call LabVIEW Web Service\WebVI\Call LabVIEW Web Service.lvproject" in LabVIEW NXG.
- Run the WebVI
  - Open **Main.gviweb** and click the **Run** button
- Build Web application
  - Open WebApp.gcomp
  - Switch to the **Document** tab
  - Click Build

# Details
## The Web Service
The web service is built in LabVIEW 2016, and consists of two HTTP endpoint methods (one GET and one POST), as well as a few sub VIs. 

### Output Type
The Output Type must be configured correctly in order for a LabVIEW web service to send data back to a WebVI.
- In the Project Explorer, right-click on **Web Server** and click **Properties**
  - Web Server must be stopped before editing properties
- Navigate to **HTTP Method VI Settings** in the left menu
- Click on one of the Web Service VIs, and open the **Output Type** tab
- Choose from one of the following options:
  - Option 1 (recommended): Select **Stream**, and check the options for **Use headers** and **Buffered**
    - This option requires the web service VI to flatten return data to JSON and return it through **Write Response.vi**
  - Option 2: Select **Terminal**, and select **JSON** for the output format
    - This option returns data through VI output terminals and performs serialization automatically

### CORS
Cross-Origin Resource Sharing (CORS) allows a Web Service VI to respond to HTTP requests from a different origin than where it is hosted. This configuration is necessary when your WebVI is not being hosted by the LabVIEW 2016 web server. AddCORSHeaders.vi adds HTTP headers to allow requests from any origin. 

## The WebVI
The WebVI makes requests to both of the VI endpoints, and displays the returned data. For the POST method, it collects some parameter information from the front panel controls and serializes it into the POST buffer. 

## Important Directories
- **`Web Service`**: Contains LabVIEW 2016 web service project.
- **`WebVI`**: Contains LabVIEW NXG WebVI project
- **`WebVI/Builds/Web Server/Configuration1/WebApp`**: This is the built WebVI, containing HTML, Javascript, the compiled block diagram, and other web content.

# Usage
- Leverage LabVIEW 2016 to perform operations that a WebVI can't do alone, like:
  - Complex data analysis, signal processing
  - Interact with hardware
  - Read/write data to/from filesystems, databases

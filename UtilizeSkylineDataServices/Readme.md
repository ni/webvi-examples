# Utilize Skyline Data Services
[![Utilize Skyline Data Services](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/ZZZZZZZZZZZZZ)
[![Utilize Skyline Data Services README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/XXXXXXXXXX)

This example demonstrates how to use a WebVI to communicate over networks with Skyline Tags. The example also shows how code can be shared between WebVIs and GVIs using a library.  On the diagram, this WebVI utilizes a state machine to determine when to read, write, and connect to a server. On the panel, this example has fields to enter the server, username, and password. It also has a tab control that determines the visible view as well as the state in the state machine.

![Screenshot of Demo](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/Screenshot.gif)

# Dependencies
- LabVIEW NXG 2.0 Web Module

# Setup
1. After installing the Web Module the NI Web Server must be configured. Note this configuration enabled development in LabVIEW while also being as secure as possible.
  a. Open  the NI Web Server configuration utility in `C:\Program Files\National Instruments\Shared\Web Server Config`
  b. Use the guided setup to set the following options
    i. Simple Local Access
    ii. Ensure **Add the local Windows Administrators group to the admin role** is checked
    iii. Optionally add other local Windows user to the admins role. This makes the user an admin from the perspective of Skyline services. It does make the user an administrator for Windows.
    iv.  Set the HTTP port.
    v. Click finish and go to the **Remote** tab after the Web server has restarted
    vi. Enable the radio button for **Enable CORS for other web servers on this machine**
    vii. Click **Apply and Restart**
1. Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repository to your machine.
2. Open `UtilizeSkylineDataServices\UtilizeSkylineDataServices.lvproject`
3. Open `Main.gviweb` and click the **Run** button.
4. Build the web application.  
  a. Open `WebApp.gcomp`.  
  b. On the **Document** tab, click **Build**.
  **Note:** NI recommends using Mozilla Firefox to view HTML files generated from a web application project.

# Details
Skyline tags are a highly scalable, lossy network commutation method that utilizes a central node to broker communication between distributed embedded, desktop, and Web applications. Tags have limited data types (integer, double, and string), but these datatypes can be utilized to provide sufficient flexibility for most applications. String tags can be used to transmit JSON or other string based interchange formats. It is also common practice to utilize an integer tag to transmit data that will be represented to the user as a Boolean.

![Screenshot of Int to Bool](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/int-to-bool.png)

Here the bool to converted to an integer using the **Boolean to Integer** primitive before writing the tag. The Read Example Tags a **Not Equal to 0?** to convert the integer to a Boolean.

The example demonstrates the best practice of using the **Multi Read** and **Multi Write** tags nodes to read and write all tags in a single call. While this requires slightly more complex block diagram code the whole application runs more efficiently by using a single HTTP GET/POST to read/write all five tags rather than 5 HTTP GET/POST calls. This advantage scales well in real applications with 10s or 100s of tags visualized in a single application.

![Screenshot of MultiRead](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/multi-read.png)

The state machine has logic such that by default the state machine state and the visible tab match. This is useful because tags are only read or written when the those controls and indicators are visible. In the **Read Tags** state the controls are updated as well as the indicators. This is possible in LabVIEW NXG because a control or indicator can have multiple terminals for the same control or indicator and these terminals can be both read and write. The rational for this feature is to prevent stale values from being written to tags when the user switches tabs.

If an error has occurred or if the user clicks **Clear Faults and Reconnect** the state machine will enter states not determined by the tab control. This logic is contained in the **Determine Next State** function. The logic in this function will use the state determined by the tab control if there is no error or if the user has not clicked **Clear Faults and Reconnect**. Regardless if there is an error or not clicking the **Clear Faults and Reconnect** button will cause the state machine to enter the **initialize** state. If only an error has occurred the state machine will enter the error-no-skyline state.

# Security
For the sake of approachability and learnability this example includes username and password fields on its panel. We discourage this practice for all applications used in production. Authentication credentials should also not be stored in constants on the block diagram. Doing this could lead to credentials stored in version control, which is an anti-pattern. We encourage credentials to be stored securely on disk but accessible via HTTPS. For example credentials could be stored in a JSON file within the Web server that is also hosting your Web application.

If storing credentials in a file is not an option for your application you may choose to host your Web application in the NI Web Server and requiring the user to login to the Skyline Web  UI. Logging into this Web UI stores an authentication cookie in your browser that is automatically sent with calls to Skyline data services. To do this put the built output of your Web application into `C:\Program Files\National Instruments\Shared\Web Server\htdocs`. This is the director for all files hosted by the NI Web Server.

# Hosting
Copy and paste the entire `\UtilizeSkylineDataServices\Builds\WebApp_Web Server` directory to any web server you want.

## Hosting on the LabVIEW 2009-2017 Web Server
1. Open `C:\Program Files (x86)\National Instruments\Shared\NI WebServer\www`.
2. Copy the `\UtilizeSkylineDataServices\Builds\WebApp_Web Server` directory into the `www` directory.
3. Open a web browser and navigate to `http://localhost:8080/Main.html`.  


## Hosting on the NI Web Server
1. Open `C:\Program Files\National Instruments\Shared\Web Server\htdocs`.
2. Copy the `\UtilizeSkylineDataServices\Builds\WebApp_Web Server` directory into the `htdocs` directory.
3. Open a web browser and navigate to `http://localhost:[serverport]/UtilizeSkylineDataServices/main.html`.  

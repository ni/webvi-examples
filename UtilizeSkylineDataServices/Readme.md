# Utilize Skyline Data Services
[![Utilize Skyline Data Services](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/Builds/WebApp_Web%20Server/Main.html)
[![Utilize Skyline Data Services README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/UtilizeSkylineDataServices)

This example demonstrates how to use a WebVI to communicate over networks with Skyline Tags with the YTBNCS cloud or with an on premises server.  

The panel has a tab control to determine whether to connect to an on premises server (user supplies hostname, username, and password) or with CLOUD hosting (user supplies API Key). LEARN MORE ABOUT OBTAINING API KEYS HERE.

The center tab control determines the visible view as well as the state in the state machine. A common library is used to show how code can be shared between WebVIs and GVIs.

Setup for building web applications and NI Packages is also demonstrated. Quickly launch and view the web application in your default browser by going to System Designer, right-clicking `WebApp.gcomp` and selecting **Run**.

![Screenshot of Demo](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/Screenshot.gif)

# Dependencies
- LabVIEW NXG 2.0 Web Module
- YET TO BE NAMED CLOUD SERVICES
  - API UPDATE FOR YTBNCS


# Setup for YTBNCS for data communication
TODO: IMAGE OF CONFIGURE VI
**Server URL:**https://YTBNCS.com

**API Key Authentication** An API key is needed to authenticate the communication between the WebVI running on your local machine and the YTBNCS in the cloud. An API key is not needed if the web application is hosted by YTBNCS because your ni.com user name and password can be used for authentication.

## Obtaining an API Key
1. Go to YTBNCS.com and click on **Security**
2. Click **+ New API key**
3. Copy the API key to your clip board
**Note** You only get to see the API key once so write it down somewhere safe. If you delete the API key all applications using it will not longer be able to connect to YTBNCS

# Set up for On Premises Hosting
**Server URL:**http://localhost:9090

**User Name + Password Authentication**
TODO link to ni.com help for setting up users on NI Web Server.

## On Premises Server Setup
1. After installing the Web Module the NI Web Server must be configured. Please note this configuration enabled development in LabVIEW using Skyline data services hosted on the same machine
    1. Open  the NI Web Server configuration utility in `C:\Program Files\National Instruments\Shared\Web Server Config`
    2. Use the guided setup to set the following options
        1. Select **Simple Local Access** and click **Next**
        2. Ensure **Add the local Windows Administrators group to the admin role** is checked
        3. Optionally add other local Windows user to the admins role. This makes the user an admin for Skyline services. It does make the user an administrator for Windows. Click **Next**
        4. Set the HTTP port (this example assumes port 9090 is chosen) and click **Next**
        5. Click **Finish** and go to the **Remote** tab after the Web server has restarted
        6. Enable the radio button for **Enable CORS for other web servers on this machine**
        7. Click **Apply and Restart**

# Run and Build
1. Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repository to your machine.
2. Open `UtilizeSkylineDataServices\UtilizeSkylineDataServices.lvproject`
3. Open `Main.gviweb` and click the **Run** button.
4. To build the web application.  
  a. Open `WebApp.gcomp`.  
  b. On the **Document** tab, click **Build**.

  **Note:** You can automatically launch and view the Web application locally by going to **System Designer** >> **Web Sever** >> right-click **WebApp.gcomp** >> **Run**

# Hosting
You can manually the move the build output found at `\UtilizeSkylineDataServices\Builds` to any web server. This project also includes a Distribution (WebApp.lvdist) that can be used to build a package (.nipkg). Packages utilize NI Package Manager to automated the process of installing, upgrading, or removing the web app. A package is also a requirement for hosting a Web application on NI'S YET TO BE NAMED CLOUD SERVICES.

## TO BE NAMED Cloud Hosting
The following steps can be used to host the web app on NI'S YET TO BE NAMED CLOUD SERVICES
1. Open `UtilizeSkylineDataServices.lvproject`.
2. Open `WebApp.lvdist`.
3. Click the build icon in the top command bar of this distribution document
4. Open a Web browser and navigate to https://YETTOBEDEFINEDHOST/webapps
5. Click the **Choose nipkg** button and select the nipkg built in step 3.
6. When the upload is complete, click on your newly uploaded Web app from your list of Web apps

## Local Hosting
The following steps can be used to host the web app on a local web server
### Hosting on the NI Web Server with a nipkg
1. Open `UtilizeSkylineDataServices.lvproject`
2. Open `WebApp.lvdist`.
3. Click the build icon in the top command bar of this distribution document
4. Double-click the nipkg and follow the on screen instructions
5. Open a web browser and navigate to `http://localhost:9090/utilizeskylinedataservices/Main.html`

### Hosting on the LabVIEW 2009-2017 Web Server
1. Open `C:\Program Files (x86)\National Instruments\Shared\NI WebServer\www`.
2. Copy the `WebApp+Web Server` directory into the `www` directory.
3. Open a web browser and navigate to `http://localhost:8080/WebApp_Web%20Server/Main.html`

### Hosting on the NI Web Server
1. Open `C:\Program Files\National Instruments\Shared\Web Server\htdocs`.
2. Copy the `WebApp_Web Server` directory into the `htdocs` directory.
3. Open a web browser and navigate to `http://localhost:9090/WebApp_Web%20Server/Main.html`.

# Details
## Interacting with Tags
Skyline tags are a highly scalable, lossy network commutation method that utilizes a central node to broker communication between distributed embedded, desktop, and Web applications. Tags have limited data types (integer, double, and string), but these datatypes can be utilized to provide sufficient flexibility for most applications. String tags can be used to transmit JSON or other string based interchange formats. It is also common practice to use integer tags to transmit Boolean data.

![Screenshot of Int to Bool](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/int-to-bool.png)

Here the Boolean to converted to an integer using the **Boolean to Integer** primitive before writing the tag. In **Read Example Tags** a **Not Equal to 0?** primitive is used to convert the integer to a Boolean.

The example demonstrates the best practice of using the **Multi Read** and **Multi Write** tags functions to read and write all tags in a single call. The single read and write versions are implemented but disabled for sake of example. While **Multi Read** and **Multi Write** requires slightly more complex block diagram code the whole application runs more efficiently by using a single HTTP GET or POST to read or write all five tags rather than 5 HTTP GET/POST calls. This advantage scales well in real applications with 10s or 100s of tags visualized in a single application.

![Screenshot of MultiRead](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/multi-read.png)

## The State Machine
The state machine has logic such that the state machine state is determined the visible tab on the panel. This is useful because tags are only read or written when the those controls and indicators are visible. In the **Read Tags** state the controls are updated as well as the indicators. This is possible in LabVIEW NXG because a control or indicator can have multiple terminals for the same control or indicator and these terminals can be both read and write. This pattern is used to prevent stale values from being written to tags when the user switches tabs.

![Screenshot of State Machine](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/state-machine.png)

If an error has occurred or if the user clicks **Clear Faults and Reconnect** the state machine will enter states not determined by the tab control. This logic is contained in the **Determine Next State** function. The logic in this function will use the state determined by the tab control if there is no error or if the user has not clicked **Clear Faults and Reconnect**. Regardless if there is an error or not, clicking the **Clear Faults and Reconnect** button will cause the state machine to enter the `initialize` state. If only an error has occurred the state machine will enter the `error-no-skyline` state.

![Screenshot of Determine Next State](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/next-state.png)

# Security
For the sake of approachability and learnability this example includes username and password fields on its panel. **We discourage this practice for all applications used in production**. Authentication credentials should also not be stored in constants on the block diagram. Doing this could lead to credentials stored in version control, which is an anti-pattern. We encourage credentials to be stored securely on disk but accessible via HTTPS. For example, credentials could be stored in a JSON file within the Web server that is also hosting your Web application.

If storing credentials in a file is not an option you may choose to host your Web application in the NI Web Server. This requires the user to login to the Skyline Web UI for authentication. Logging into this Web UI stores an authentication cookie in your browser that is automatically sent with calls to Skyline data services. This eliminates the need to enter a username or password directly to the WebVI either on its panel or its diagram. To do this put the built output of your Web application into `C:\Program Files\National Instruments\Shared\Web Server\htdocs`. This is the directory for all files hosted by the NI Web Server. Please not a user can access the URL of the Web application without logging in, but to read/write tags in this scenario they will have to login to the Skyline Web UI at http://localhost:9090.

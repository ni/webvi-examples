# Utilize Skyline Data Services
[![Utilize Skyline Data Services](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/Builds/WebApp_Web%20Server/Main.html)
[![Utilize Skyline Data Services README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/UtilizeSkylineDataServices)

This example demonstrates how to use a WebVI to communicate over networks with Skyline Tags after connecting to SystemLink Cloud or SystemLink Server, an on-premises web server.  

Once you complete the necessary steps, you will know:

- How to set up, build, and host web applications.
- How to set up and connect to SystemLink Cloud or SystemLink Server, an on-premises web server.

![Data Services](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/data-service-cloud.png)

# Interacting with the Web Application
From the panel of the web app, you will be able to:

-	Connect to an on-premises web server or to SystemLink Cloud by supplying the required credentials.
-	Choose what information is visible by toggling between the Read Tags and Write Tags tabs.
-	Determine which state to execute with Skyline Tags.

![Screenshot of Demo](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/Screenshot.gif)

_Figure: When hosting a WebVI on the NI Web Server, you do not need to supply credentials again once you logged into the Skyline web interface._

# Dependencies
-	[LabVIEW NXG 2.1 Web Module](http://www.ni.com/labview/webmodule/)
-	[Skyline API Key Support](http://www.systemlinkcloud.com/api-download) for SystemLink Cloud

If you do not install LabVIEW NXG 2.1 Web Module, NI Package Manager will not install the Skyline API Key Support package on to your machine. You will receive an installation dependency error as a result. The Skyline API Key Support package enables you to establish a connection to the SystemLink Cloud server. Please refer to [Skyline API Support](https://www.systemlinkcloud.com/api-download) for installation instructions and the [FAQ](https://www.systemlinkcloud.com/faq) for help navigating installation errors.

# Choosing Your Goal
Do you want to learn about connecting your web application to SystemLink Cloud or SystemLink Server, an on-premises server? Click one of the following links to jump to your workflow:

-	[I want to install the Skyline API Key Support package](https://github.com/ni/webvi-examples/blob/master/UtilizeSkylineDataServices/Readme.md#skyline-api-key-support-package).
- [I want to connect to SystemLink Cloud](https://github.com/ni/webvi-examples/blob/master/UtilizeSkylineDataServices/Readme.md#systemlink-cloud).
- [I want to connect to an on-premises web server](https://github.com/ni/webvi-examples/blob/master/UtilizeSkylineDataServices/Readme.md#on-premises-web-server).
-	[I want to learn about the details involved in creating the WebVI](https://github.com/ni/webvi-examples/blob/master/UtilizeSkylineDataServices/Readme.md#webvi-details).
-	[I want to learn about security](https://github.com/ni/webvi-examples/blob/master/UtilizeSkylineDataServices/Readme.md#security).

# Skyline API Key Support Package

Prior to writing code, [download](https://www.systemlinkcloud.com/api-download) the Skyline API Key Support package to enable you to establish a connection with SystemLink Cloud from your WebVI. Depending on your version of LabVIEW or LabVIEW NXG 2.1 Web Module, follow the instructions below.

## LabVIEW NXG 2.1 Web Module:

1.	Go to [API Key Support](https://www.systemlinkcloud.com/api-download).
2.	Install LabVIEW NXG 2.1 Web Module.
>**Note:** You must install LabVIEW NXG 2.1 Web Module for the Skyline API Support Key package to install on your machine.

3.	Click **Download Skyline API Key Support**.
4.	Double-click the package file to launch NI Package Manager.
5.	Follow instructions in the installation prompt to complete installation.

Once you successfully install the Skyline API Key Support package, you can connect your WebVIs to SystemLink Cloud from LabVIEW NXG 2.1 Web Module.

## LabVIEW 2015-2017:

1.	[Install](https://www.systemlinkcloud.com/api-download) LabVIEW NXG 2.1 Web Module.
2.	Follow instructions in the installation prompt to complete installation.
3.	Launch LabVIEW.
4.	Open Windows Explorer and go to `C:\Program Files (x86)\National Instruments\LabVIEW [Version]\vi.lib\Skyline\Configuration\Configuration HTTP_class`.
5.	Drag the `Open Configuration API Key.vi` to the block diagram.

You can now connect your WebVIs to SystemLink Cloud from LabVIEW.

# SystemLink Cloud
In this section, you’ll learn how to set up, build, and connect your web application to SystemLink Cloud from LabVIEW NXG 2.1 Web Module.

## What You Need to Connect to SystemLink Cloud from LabVIEW 2.1 NXG Web Module

To connect your web application to SystemLink Cloud from LabVIEW NXG 2.1 Web Module, you need a server URL and an API key. The API key authenticates the web application running on your local machine for SystemLink Cloud – much like your ni.com credentials authenticate your identity.

[Learn](https://github.com/ni/webvi-examples/blob/master/UtilizeSkylineDataServices/Readme.md#connecting-to-systemlink-cloud-from-labview-nxg-2.1-web-module) how to establish a connection to the SystemLink Cloud server from LabVIEW NXG 2.1 Web Module.

![Configure GVI in LabVIEW vs Hosting in SystemLink Cloud](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/cloud-config.PNG)

_Figure: Note the input differentiation between connecting to the SystemLink Cloud server from LabVIEW or LabVIEW NXG 2.1 Web Module vs. hosting your web application on SystemLink Cloud._

## What is an API Key?
An API key authenticates an application trying to access SystemLink Cloud. It helps to think of an API key like login credentials. When you log in somewhere, your username and password authenticate who you are and, if they’re correct, grant you access. An API key functions similarly for your application connecting to the SystemLink Cloud server.

## Obtaining an API Key
1.	Go to [Security](https://www.systemlinkcloud.com/security).
2.	Click **+ NEW API KEY** to create an API key.
3.	Click **Copy key** to save the API key.
>**Note:** You only get to see an API key once, so keep it somewhere safe and only provide it to those you trust. If you delete an API key, all applications using that API key will no longer be able to connect to SystemLink Cloud.

## Connecting to SystemLink Cloud from LabVIEW NXG 2.1 Web Module

To connect to SystemLink Cloud from LabVIEW NXG 2.1 Web Module, you need a server URL and an API key.

1.	Go to [Security](https://www.systemlinkcloud.com/security).
2.	Click **+ NEW API KEY** button to create an API key.
3.	Click **Copy key** to save the API key.
>**Note:** You will only see the API key once, so keep it somewhere safe.

4.	Open LabVIEW NXG 2.1 Web Module and create a WebVI.
>**Tip:** Use the Web Application Project template to easily create a WebVI. Navigate to the **Projects** tab and click **Web Application Project** to launch it.

5.	Go to the diagram and navigate to **Data Communications»Skyline»Configuration**.
6.	Select the **Open Configuration** node and drag it to the diagram.
7.	In the **Function configuration** dialog box of the Open Configuration node, select **API Key**. Changing the configuration of this node enables you to establish a connection with SystemLink Cloud.
>**Note:** You can also change the Function configuration in the **Item** tab of the Configuration pane.

8.	Provide the copied API key as the **api key** and enter `https://api.systemlinkcloud.com` as the **server url**.

## Building and Running the Example Web application

1. Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repository to your machine. [Go here](https://help.github.com/articles/cloning-a-repository/) if you’re new to cloning repositories on GitHub.
2. Open the **Utilize Skyline Data Services** example in LabVIEW NXG 2.1 Web Module.
> **Note**: You can search for it by name in the search bar or navigate to **Learning»Examples»Programming WebVIs»Utilize Skyline Data Services** to launch it.

3. Open `Main.gviweb` and click **Run**.
4. On the **Projects Files** tab, double-click the `WebApp.gcomp` to open it.
5. On the **Document** tab, click **Build** to build your web application.

> **Note**: You can automatically launch and view the web application locally by right-clicking the web application in SystemDesigner and then clicking **Run**.

## Cloud Hosting Overview
After you create a web application and build the package in LabVIEW NXG 2.1 Web Module, you need to move it to a web server. This enables administrators to access it from a web browser. Copy your entire web application output directory to any web server you choose.
>**Note**: To navigate to your web application output on your machine, click **Locate directory in Windows Explorer** on the **Document** tab of your web application component document. You can also access the build output by navigating to your web application’s project folder manually (`\UtilizeSkylineDataServices\Builds`).

Furthermore, this project includes a distribution document (`WebApp.lvdist`), which can be used to build a package (`.nipkg`). A package is also required to host a web application on SystemLink Cloud. [Go here](http://www.ni.com/documentation/en/labview/2.1/application-builder/distributing-app-lib/) if you’re interested in learning more about distributing applications.

## Hosting a Web Application on SystemLink Cloud

For SystemLink Cloud to host your web application, use your **ni.com credentials** for authentication.
>**Note:** Leave the **api key** and **server url** inputs empty to minimize security vulnerabilities.

1.	Click **File»New»Distribution**. The Distribution document opens and appears in the project.
2.	On the **Document** tab, select **Web Server** as the Build target.
3.	For the **Output** type, select **Package**.
4.	In the **Distribution** document, click the **Add Application/Library** button.
5.	In the **Add Application/Library** dialog box, place a checkmark next to the application or library you want to distribute and click **OK**.
6.	On the **Document** tab, enter values in **Company** and **Product**.
7.	In **Output** path, set the location to save the distribution output.
8.	In the **NI Package** section, enter information about the distribution output.
9.	Click **File»Save** all to save all files.
10.	Click **Build distribution**. The Build Queue tab shows the status of the build process.
11.	Open a web browser and go to [Web apps](https://www.systemlinkcloud.com/web-apps).
12.	To upload your web application, click **Choose .NIPKG** and select the package you just built.
13.	Once the upload is complete, click on your web app to interact with it.

# On-Premises Web Server
In this section, you’ll learn how to set up, build, and connect your web application to the SystemLink Server, which is an on-premises web server.

## What You Need to Connect to the SystemLink Server from LabVIEW NXG 2.1 Web Module
![Configure GVI in LabVIEW vs Hosting on premises](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/on-premises-config.PNG)

_Figure: Note the input differentiation between connecting to an  on-premises server from LabVIEW or LabVIEW NXG 2.1 Web Module vs. hosting your web application on the NI Web Server._

To connect to the [SystemLink Server](http://www.ni.com/documentation/en/systemlink/latest/manual/manual-overview/) from LabVIEW NXG 2.1 Web Module, you must include a **server url** (i.e. https://systemlinkcloud.com), a **username**, and a **password**. The username and password can be managed with the NI Web Server Configuration utility. This utility can be used to create new users and groups as well as leverage existing LDAP or Windows user accounts.  

When a web application is hosted on the SystemLink Server, leave the **server url**, **username**, and **password** inputs empty to minimize security vulnerabilities.
>**Note:** If you use your own web server, you will need to include your credentials for SystemLink Cloud or SystemLink Server to authenticate the data services in the web application.  

## Setting up an On-Premises Web Server
After installing LabVIEW NXG 2.1 Web Module, you need to install and configure a SystemLink Server. SystemLink Server includes NI SystemLink Web Application.

1. Launch NI Package Manager.
2. Search for and install SystemLink Server.
3. Launch NI SystemLink Web Application. NI Web Server Configuration launches automatically.
>**Note:** If the NI Web Server Configuration doesn't launch automatically, follow this path: `C:\Program Files\National Instruments\Shared\Web Server Config`.

4.	Follow the prompts in the NI Web Server Configuration to choose the following configuration options:
   1.	On the **Select Preset** tab, select **Simple Local Access** configuration preset.
   2. On the **Authentication** tab, check **Login using Windows accounts**.
> **Note**: This makes the user an admin for Skyline data services. It also makes the user an admin for Windows.

   3. On the **Administrators** tab, ensure **Add the local Windows Administrators group to the admins role** is selected.
   4. On the **HTTP Port** tab, set the **Server HTTP Port**.
>  **Note**: This example assumes port 9090 is chosen.

   5. On the **CORS** tab, ensure **Enable CORS for web servers running on the same machine as clients** is selected.
   6. On the **Summary** tab, review your selections and then click **Finish**.

## Building and Running the Example Web application
1. Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repository to your machine. [Go here](https://help.github.com/articles/cloning-a-repository/) if you’re new to cloning repositories on GitHub.
2. Open the **Utilize Skyline Data Services** example in LabVIEW NXG 2.1 Web Module.
>**Note**: You can either search for the example by name in the search bar or select **Learning»Examples»Programming WebVIs»Utilize Skyline Data Services** to launch it.

3. Open `Main.gviweb` and click **Run**.
4. On the **Projects Files** tab, double-click the `WebApp.gcomp` to open it.
5. On the **Document tab**, click **Build** to build your web application.

> **Note**: You can automatically launch and view the web application locally by right-clicking the web application in SystemDesigner and then clicking **Run**.

## Hosting Overview
After you create a web application and build the package in LabVIEW NXG 2.1 Web Module, you need to move it to a web server. This enables administrators to access it from a web browser. Copy your entire web application output directory to any web server you choose.
> **Note:** To navigate to your web application output on your machine, click **Locate directory in Windows Explorer** on the **Document** tab of your web application component document. You can also access the build output by navigating to your web application’s project folder manually (`\UtilizeSkylineDataServices\Builds`).

Furthermore, this project includes a distribution document (`WebApp.lvdist`), which can be used to build a package (`.nipkg`). A package is also required for hosting a web application on SystemLink Cloud. [Go here](http://www.ni.com/documentation/en/labview/2.1/application-builder/distributing-app-lib/) to learn more about distributing applications.

## Local Hosting
Follow the instructions below to host the web app on a web server.

### Hosting a Package File (.nipkg) on the NI Web Server
1. Open `UtilizeSkylineDataServices.lvproject`
2. Open `WebApp.lvdist`.
3. Click the **Build distribution**.
> **Note**: The button looks like a hammer.

4. Click **Locate item in Windows Explorer** to find the build output.
5. Double-click the package (`.nipkg`) and follow the on-screen instructions.
6. Open a web browser and navigate to `http://localhost:9090/utilizeskylinedataservices/Main.html`.

### Hosting on the LabVIEW 2009-2017 Web Server
1. Go to the LabVIEW Web Server directory using the following path: `C:\Program Files (x86)\National Instruments\Shared\NI WebServer\www`.
2. Copy the entire `WebApp+Web Server` directory into the `www` directory of the LabVIEW web server.
3. Open a web browser and navigate to `http://localhost:8080/WebApp_Web%20Server/Main.html`.

### Hosting on the NI Web Server
1.	Go to the NI Web Server using the following path: `C:\Program Files\National Instruments\Shared\Web Server\htdocs`.
2. Copy the `WebApp_Web Server` directory into the `htdocs` directory of the NI Web Server.
3. Open a web browser and navigate to `http://localhost:9090/WebApp_Web%20Server/Main.html`.

# WebVI Details

The Utilize Skyline Data Services example uses Tags nodes, which are a part of the Skyline data services API. The Tags API is a highly scalable, lossy network commutation method that utilizes a central node to broker communication between distributed embedded, desktop, and web applications. Use Tags nodes to send and receive measurement data from one system to other systems. Refer to the [Skyline API Docs](https://www.systemlinkcloud.com/skyline-api-docs) to find out more about the Skyline data services API.

## Tags and Data Types
While tags have limited data types (integer, double, and string), these data types can be utilized to provide flexibility for most applications. For example, string tags can be used to transmit JSON or other string-based interchange formats.

It is also common practice to use integer tags to transmit Boolean data. For an example of this, see the image below.

![Screenshot of Int to Bool](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/int-to-bool.PNG)

Here, the Boolean to converted to an integer using the **Boolean to Integer** node before writing the tag. Then, in **Read Example Tags** VI, a **Not Equal to 0?** node is used to convert the integer to a Boolean.

## Multi Read and Multi Write Tags

The example demonstrates the best practice of using the **Multi Read** and **Multi Write** tags nodes to read and write all tags in a single call. The single read and write versions are implemented but disabled for sake of example. While **Multi Read** and **Multi Write** requires slightly more complex diagram code,  the whole application runs more efficiently by using one **GET** node or **POST** node to read or write all five tags rather than five **GET**/**POST** calls. This advantage scales well in real applications with many tags visualized in a single application.

![Screenshot of MultiRead](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/multi-read.png)

## State Machine
State machines implement decision-making algorithms where a set of distinguishable states exists.

These states, or subdiagrams of code, carry out specific operations within a program.

In this example, a state is determined by the visible tab (**Read Tags** and **Write Tags**) on the panel. This means tags are only read or written when those controls and indicators are visible. In the **Read Tags** state, the controls and indicators are updated. This occurs because a control or indicator can have multiple terminals for the same control or indicator, and these terminals can be both read and write. This prevents stale values from being written to tags when the user switches tabs.

![Screenshot of State Machine](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/state-machine.png)

If an error occurs or if the user clicks **Clear Faults and Reconnect**, the state machine will enter states not determined by the tab control. This logic is contained in the **Determine Next State** node.  If there is no error or if the user has not clicked **Clear Faults and Reconnect**, the **Determine Next State** node will use the state determined by the tab control. Regardless if there is an error or not, clicking the **Clear Faults and Reconnect** button will cause the state machine to enter the `initialize` state. If only an error has occurred, the state machine will enter the `error-no-skyline state`.

Go here to find out more about [state machines](http://www.ni.com/documentation/en/labview/2.0/g-prog/state-machine-design-pattern/).

![Screenshot of Determine Next State](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/next-state.png)

# Security
For the sake of approachability and learnability this example includes username and password fields on its panel. **We discourage this practice for all applications used in production**.

Additionally, authentication credentials should not be stored in constants on the web application's diagram.  Storing credentials, such as usernames, passwords, or API keys, on the diagram could allow a malicious attacker to retrieve them by accessing the code running in the browser. We encourage you to store your credentials securely on disk but accessible via HTTPS. For example, credentials could be stored in a JSON file within the web server that is also hosting your web application.

If storing credentials in a file is not an option and you need to host your web application on-premises, you may choose to host your web application in the NI Web Server. This requires users to login to the Skyline Web UI for authentication. Logging into this Web UI stores an authentication cookie in your browser that is automatically sent with calls to Skyline data services. This eliminates the need to enter a username or password directly to the WebVI, either on its panel or its diagram. To do this, put the built output of your web application into the directory found at `C:\Program Files\National Instruments\Shared\Web Server\htdocs`. This is the directory for all files hosted by the NI Web Server. Please note a user can access the URL of the web application without logging in, but in order to read/write tags, they will have to login to the Skyline Web UI at http://localhost:9090.

If storing credentials in a file is not an option and you can host your web application in the cloud, you may choose to host your web application on SystemLink Cloud. This requires you to have an active SSP for the LabVIEW NXG 2.1 Web Module and an ni.com account. Doing so allows an authentication cookie in your browser to be automatically sent with calls to SystemLink Cloud. This eliminates the need to enter an API key or server URL either in the web application.

# Utilize Skyline Data Services
[![Utilize Skyline Data Services](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/Builds/WebApp_Web%20Server/Main.html)
[![Utilize Skyline Data Services README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/UtilizeSkylineDataServices)

This example demonstrates how to use a WebVI to communicate over networks with Skyline Tags after connecting to YTBNCS or an on-premises web server.  

Once you complete the necessary steps, you will know:

- How to setup, build, and host web applications.
- How to setup and connect to YTBNCS or an on-premises web server.

![Data Services](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/Sdata-service-cloud.png)

# Interacting with the Web Application
From the panel of the web app, you will be able to:

-	Connect to an on-premises web server or to YTBNCS by supplying the required credentials.
-	Choose what information is visible by toggling between the Read Tags and Write Tags tabs.
-	Determine which state to execute with Skyline Tags.

![Screenshot of Demo](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/Screenshot.gif)

_Figure: When hosting a WebVI on the NI Web Server, you do not need to supply credentials again once you logged into the Skyline web interface._

# Dependencies
-	[LabVIEW NXG Web Module](http://www.ni.com/labview/webmodule/)
-	[YTBNCS](https://YTBNCS/)
-	Skyline API Key Support for YTBNCS

# Choosing Your Goal
Do you want to learn about connecting your web application to YTBNCS or an on-premises server? Click one of the following links to jump to your workflow:

-	[I want to connect to the YTBNCS](https://github.com/ni/webvi-examples/blob/master/UtilizeSkylineDataServices/Readme.md#YTBNCS).
- [I want to connect to an on-premises web server](https://github.com/ni/webvi-examples/blob/master/UtilizeSkylineDataServices/Readme.md#on-premises-web-server).
-	[I want to learn about the details involved in creating the WebVI](https://github.com/ni/webvi-examples/blob/master/UtilizeSkylineDataServices/Readme.md#webvi-details).
-	[I want to learn about security](https://github.com/ni/webvi-examples/blob/master/UtilizeSkylineDataServices/Readme.md#security).

# YTBNCS
In this section, you’ll learn how to setup, build, and connect your web application to YTBNCS.

## What You Need to Connect to YTNBCS from LabVIEW NXG
![Configure GVI in LabVIEW vs Hosting in YTBNCS](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/ytbncs-config.png)

_Figure: Note the input differentiation between using YTBNCS data services from within LabVIEW vs. hosting within YTBNCS._

When communicating with YTBNCS data services from LabVIEW NXG, you must include a **server url** (i.e. https://YTBNCS.com) and an **API key**. An API key is needed to authenticate the communication between the WebVI running on your local machine and the YTBNCS in the cloud.

However, when the web application is hosted by YTBNCS, you don’t need an API key or a server URL because your **ni.com credentials** are used instead. This deliberately minimizes security vulnerabilities that can arise when using an API key on your hosted web application.

## What is an API Key?

An API key authenticates an application, device, or system – much like your ni.com credentials authenticate who you are. Assigning an API key to an application allows it to connect to the YTBNCS.

## Obtaining an API Key
1.	Go to YTBNCS.com and login with your **ni.com credentials**.
2.	Click the **Security** button.
3.	Click **+ New API key** to create an API key.
4.	Click **Copy to clipboard** to save the API key.
> **Note**:  You only get to see an API key once, so retain it somewhere safe and only provide it to those you trust. If you delete an API key, all applications using that API key will no longer be able to connect to YTBNCS.

5. Click **Create** at the bottom of the dialog box to activate the API key.
> **Note**: If you do not click **Create**, you will not create the API key. Therefore, the API key you copied will be invalid.

## Updating Your Skyline API Keys
In order to connect your systems to Helium, you need to update or install the Skyline API keys. Depending on your version of LabVIEW, follow the instructions below.

### LabVIEW NXG:
1.	Go to the YTBNCS.com and click the **Data Services APIs** button.
2.	Click the **Download Skyline API Key Support** button.
3.	Double click the package file to open **NI Package Manager**.
4.	Follow instructions in the installation prompt to complete installation.

### LabVIEW 2015, 2016, 2017:
1.	Open **Package Manager** and click the **Select** tab.
2.	Select the **NI Skyline Message Support** and **NI Skyline Tag Support** packages you need for the version of LabVIEW you are using and click **Next**.
3.	Follow the instructions to complete installation.
4.	Once installation is complete, copy the `Open Configuration API Key.vi` file from `C:\Program Files (x86)\National Instruments\LabVIEW 2017\vi.lib\Skyline\Configuration\Configuration HTTP_class` onto your VI's block diagram.

## Building and Running the Example Web application

1. Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repository to your machine. [Go here](https://help.github.com/articles/cloning-a-repository/) if you’re new to cloning repositories on GitHub.
2. Open the **Utilize Skyline Data Services** example in LabVIEW NXG.
> **Note**: You can either search for it by name in the search bar or select **Learning>>Examples>>Programming WebVIs>>Utilize Skyline Data Services** to launch it.

3. Open `Main.gviweb` and click **Run**.
4. On the **Projects Files** tab, double-click the `WebApp.gcomp` to open it.
5. On the **Document tab**, click **Build** to build your web application.

> **Note**: You can automatically launch and view the web application locally by right-clicking the web application in SystemDesigner and then clicking **Run**.

## Hosting Overview
After you create and build your web application in LabVIEW NXG, you need to move it to a web server. This enables its administrators to access it from a web browser. Copy your entire web application output directory to any web server you choose.
> **Note**: To navigate to your web application output on your machine, click **Locate directory in Windows Explorer** on the **Document** tab of your web application component document. You can also access the build output by navigating to your web application’s project folder manually (`\UtilizeSkylineDataServices\Builds`).

Furthermore, this project includes a distribution document (`WebApp.lvdist`), which can be used to build a package (`.nipkg`). Packages utilize NI Package Manager to automate the process of installing, upgrading, or removing the web application. A package is also required for hosting a web application on YTBNCS. [Go here](http://www-preview.ni.com/documentation/en/labview/2.1/application-builder/distributing-app-lib/) if you’re interested in learning more about distributing applications.

## YTBNCS Cloud Hosting
Use the following steps to host the web app on YTBNCS.
1.	Open `UtilizeSkylineDataServices.lvproject`.
2.	Open `WebApp.lvdist`.
3.	Click the **Build distribution**.
> **Note**: The button looks like a hammer.

4.	Open a web browser and go to https://YTBNCS/webapps.
5.	To upload your web application, click Choose `.nipkg` and select the package file (`.nipkg`) you just built.
6.	Once the upload is complete, click on your uploaded web app.

You can now interact with your web application from anywhere in the world using a web browser.

# On-Premises Web Server
In this section, you’ll learn how to setup, build, and connect your web application to an on-premises web server.

## What You Need To Connect To an On-Premises Web Server from LabVIEW NXG
![Configure GVI in LabVIEW vs Hosting on premises](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/on-premises-config.png)

_Figure: Note the input differentiation between using on-premises data services from within LabVIEW vs hosting within the NI Web Server._

When communicating with on-premises data services from LabVIEW NXG, you must include a **server url** (i.e. https://YTBNCS.com), a **username**, and a **password**. The username and password can be managed with the NI Web Server Configuration utility. This utility can be used to create new users and groups as well as leverage existing LDAP or Windows user accounts.  

When the web application is hosted on the NI Web Server, the server url, username, and password are not needed and should not be used. This deliberately minimizes security vulnerabilities.

## Setting Up an On-Premises Web Server
After installing the Web Module, you need to configure the NI Web Server.

1.	Launch the NI Web Server Configuration. For quick access, follow this path: `C:\Program Files\National Instruments\Shared\Web Server Config`.
2.	Follow the prompts in the NI Web Server Configuration to choose the following configuration options:
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
2. Open the **Utilize Skyline Data Services** example in LabVIEW NXG.
> **Note**: You can either search for it by name in the search bar or select **Learning>>Examples>>Programming WebVIs>>Utilize Skyline Data Services** to launch it.

3. Open `Main.gviweb` and click **Run**.
4. On the **Projects Files** tab, double-click the `WebApp.gcomp` to open it.
5. On the **Document tab**, click **Build** to build your web application.

> **Note**: You can automatically launch and view the web application locally by right-clicking the web application in SystemDesigner and then clicking **Run**.

## Hosting Overview
After you create and build your web application in LabVIEW NXG, you need to move it to a web server. This enables its administrators to access it from a web browser. Copy your entire web application output directory to any web server you choose.
> **Note**: To navigate to your web application output on your machine, click **Locate directory in Windows Explorer** on the **Document** tab of your web application component document. You can also access the build output by navigating to your web application’s project folder manually (`\UtilizeSkylineDataServices\Builds`).

Furthermore, this project includes a distribution document (`WebApp.lvdist`), which can be used to build a package (`.nipkg`). Packages utilize NI Package Manager to automate the process of installing, upgrading, or removing the web application. A package is also required for hosting a web application on YTBNCS. [Go here](http://www-preview.ni.com/documentation/en/labview/2.1/application-builder/distributing-app-lib/) if you’re interested in learning more about distributing applications.

## Local Hosting
The following steps can be used to host the web app on a local web server.

### Hosting a Package File (.nipkg) on the NI Web Server
1. Open `UtilizeSkylineDataServices.lvproject`
2. Open `WebApp.lvdist`.
3. Click the **Build distribution**.
> **Note**: The button looks like a hammer.

4. Click **Locate item in Windows Explorer** to find the build output.
5. Double-click the package file (`.nipkg`) and follow the on-screen instructions.
6. Open a web browser and navigate to `http://localhost:9090/utilizeskylinedataservices/Main.html`.

### Hosting on the LabVIEW 2009-2017 Web Server
1. Go to the LabVIEW Web Server directory using the following path: `C:\Program Files (x86)\National Instruments\Shared\NI WebServer\www`.
2. Copy the entire `WebApp+Web Server` directory into the `www` directory of the LabVIEW web server.
3. Open a web browser and navigate to `http://localhost:8080/WebApp_Web%20Server/Main.html`.

### Hosting on the NI Web Server
1. 1.	Go to the NI Web Server using the following path: `C:\Program Files\National Instruments\Shared\Web Server\htdocs`.
2. Copy the `WebApp_Web Server` directory into the `htdocs` directory of the NI Web Server.
3. Open a web browser and navigate to `http://localhost:9090/WebApp_Web%20Server/Main.html`.

# WebVI Details
Skyline tags are a highly scalable, lossy network commutation method that utilizes a central node (on-premises or cloud) to broker communication between distributed embedded, desktop, and web applications.

## Tags and Data Types
While tags have limited data types (integer, double, and string), these data types can be utilized to provide flexibility for most applications. For example, string tags can be used to transmit JSON or other string-based interchange formats.

It is also common practice to use integer tags to transmit Boolean data. For an example of this, check out the example below.

![Screenshot of Int to Bool](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/int-to-bool.png)

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

Additionally, authentication credentials should not be stored in constants on the block diagram. This is true for both username, password, and API keys. Doing this could lead to credentials stored being in version control or allow a malicious attacker to retrieve your credentials by accessing the code running the browser. We encourage you to store your credentials securely on disk but accessible via HTTPS. For example, credentials could be stored in a JSON file within the web server that’s also hosting your web application.

If storing credentials in a file is not an option and you need to host your web application on-premises, you may choose to host your web application in the NI Web Server. This requires users to login to the Skyline Web UI for authentication. Logging into this Web UI stores an authentication cookie in your browser that is automatically sent with calls to Skyline data services. This eliminates the need to enter a username or password directly to the WebVI, either on its panel or its diagram. To do this, put the built output of your web application into the directory found at `C:\Program Files\National Instruments\Shared\Web Server\htdocs`. This is the directory for all files hosted by the NI Web Server. Please note a user can access the URL of the web application without logging in, but in order to read/write tags, they will have to login to the Skyline Web UI at http://localhost:9090.

If storing credentials in a file is not an option and you can host your web application in the cloud, you may choose to host your web application on YTBNCS. This requires you to have an active SSP for the LabVIEW NXG Web Module and an ni.com account. Doing so allows an authentication cookie in your browser to be automatically sent with calls to YTBNCS. This eliminates the need to enter an API key or server url either in the web application.

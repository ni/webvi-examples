# Call SystemLink Data Services
[![Call SystemLink Data Services](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/CallSystemLinkDataServices/Builds/WebApp_Web%20Server/Main.html)
[![Call SystemLink Data Services README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/CallSystemLinkDataServices)

This example demonstrates how to use a WebVI to communicate over networks with SystemLink Tags after connecting to SystemLink Cloud or SystemLink Server, an on-premises web server.  

Once you complete the necessary steps, you will know:

- How to set up, build, and host web applications.
- How to set up and connect to SystemLink Cloud or SystemLink Server, an on-premises web server.

![Data Services](https://ni.github.io/webvi-examples/CallSystemLinkDataServices/data-service-cloud.png)

# Interacting with the Web Application
From the panel of the web app, you will be able to:

-	Connect to an on-premises web server or SystemLink Cloud by supplying the required credentials.
-	Choose what information is visible by toggling between the Read Tags and Write Tags tabs.
-	Determine which state to execute with SystemLink Tags.

![Screenshot of Demo](https://ni.github.io/webvi-examples/CallSystemLinkDataServices/Screenshot.gif)

_Figure: When hosting a WebVI on the NI Web Server, you do not need to supply credentials again once you logged into the SystemLink web interface._

# Software Requirements
To use SystemLink data services, you need one of the following product combinations:

-	LabVIEW NXG with [LabVIEW NXG Web Module](http://www.ni.com/labview/webmodule/)
-	LabVIEW 2015-2018 with SystemLink Client 18.0

Use NI Package Manager to install the products you need. If you do not have NI Package Manager, [download](http://search.ni.com/nisearch/app/main/p/bot/no/ap/tech/lang/en/pg/1/sn/ssnav:dwl/q/ni%20package%20manager/) and install the latest version now.

# Choosing Your Goal
Do you want to learn about connecting your web application to SystemLink Cloud or SystemLink Server? Click one of the following links to jump to your workflow:

- [I want to connect to SystemLink Cloud](https://github.com/ni/webvi-examples/blob/master/CallSystemLinkDataServices/Readme.md#systemlink-cloud).
- [I want to connect to SystemLink Server](https://github.com/ni/webvi-examples/blob/master/CallSystemLinkDataServices/Readme.md#systemlink-server).
-	[I want to learn about the details involved in creating the WebVI](https://github.com/ni/webvi-examples/blob/master/CallSystemLinkDataServices/Readme.md#webvi-details).
-	[I want to learn about security](https://github.com/ni/webvi-examples/blob/master/CallSystemLinkDataServices/Readme.md#security).

# SystemLink Cloud
In this section, you’ll learn how to set up, build, and connect your web application to SystemLink Cloud from LabVIEW NXG Web Module.

## What You Need to Connect to SystemLink Cloud from LabVIEW 3.0 NXG Web Module

To connect your web application to SystemLink Cloud from LabVIEW NXG Web Module, you need a server URL and an API key. The API key authenticates the web application running on your local machine for SystemLink Cloud – much like your ni.com credentials authenticate your identity.

[Learn](https://github.com/ni/webvi-examples/blob/master/CallSystemLinkDataServices/Readme.md#connecting-to-systemlink-cloud-from-labview-nxg-3.0-web-module) how to establish a connection to the SystemLink Cloud server from LabVIEW NXG Web Module.

![Configure GVI in LabVIEW vs Hosting in SystemLink Cloud](https://ni.github.io/webvi-examples/CallSystemLinkDataServices/cloud-config.PNG)

_Figure: Note the input differentiation between connecting to the SystemLink Cloud server from LabVIEW or LabVIEW NXG Web Module vs. hosting your web application on SystemLink Cloud._

## What is an API Key?
An API key authenticates an application trying to access SystemLink Cloud. It helps to think of an API key like login credentials. When you log in somewhere, your username and password authenticate who you are and, if they’re correct, grant you access. An API key functions similarly for your application connecting to the SystemLink Cloud server.

## Obtaining an API Key
1.	Go to [Security](https://www.systemlinkcloud.com/security).
2.	Click **+ NEW API KEY** to create an API key.
3.	Click **Copy key** to save the API key.
>**Note:** You only get to see an API key once, so keep it somewhere safe and only provide it to those you trust. If you delete an API key, all applications using that API key will no longer be able to connect to SystemLink Cloud.

## Connecting to SystemLink Cloud from LabVIEW NXG Web Module

To connect to SystemLink Cloud from LabVIEW NXG Web Module, you need a server URL and an API key.

1.	Go to [Security](https://www.systemlinkcloud.com/security).
2.	Click **+ NEW API KEY** button to create an API key.
3.	Click **Copy key** to save the API key.
>**Note:** You will only see the API key once, so keep it somewhere safe.

4.	Open LabVIEW NXG Web Module and create a WebVI.
>**Tip:** Use the Web Application Project template to easily create a WebVI. Navigate to the **Projects** tab and click **Web Application Project** to launch it.

5.	Go to the diagram and navigate to **Data Communications»SystemLink»Configuration**.
6.	Select the **Open Configuration** node and drag it to the diagram.
7.	In the **Function configuration** dialog box of the Open Configuration node, select **API Key**. Changing the configuration of this node enables you to establish a connection with SystemLink Cloud.
>**Note:** You can also change the Function configuration in the **Item** tab of the Configuration pane.

8.	Provide the copied API key as the **api key** and enter `https://api.systemlinkcloud.com` as the **server url**.

## Building and Running the Example Web application

1. Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repository to your machine. [Go here](https://help.github.com/articles/cloning-a-repository/) if you’re new to cloning repositories on GitHub.
2. Open the **Call SystemLink Data Services** example in LabVIEW NXG Web Module.
> **Note**: You can search for it by name in the search bar or navigate to **Learning»Examples»Programming WebVIs»Call SystemLink Data Services** to launch it.

3. Open `Main.gviweb` and click **Run**.
4. On the **Projects Files** tab, double-click the `WebApp.gcomp` to open it.
5. On the **Document** tab, click **Build** to build your web application.

> **Note**: You can automatically launch and view the web application locally by right-clicking the web application in SystemDesigner and then clicking **Run**.

## Cloud Hosting Overview
After you create a web application and build the package in LabVIEW NXG Web Module, you need to move it to a web server. This enables administrators to access it from a web browser. Copy your entire web application output directory to any web server you choose.
>**Note**: To navigate to your web application output on your machine, click **Locate directory in Windows Explorer** on the **Document** tab of your web application component document. You can also access the build output by navigating to your web application’s project folder manually (`\CallSystemLinkDataServices\Builds`).

Furthermore, this project includes a distribution document (`WebApp.lvdist`), which can be used to build a package (`.nipkg`). A package is also required to host a web application on SystemLink Cloud. [Go here](http://www.ni.com/documentation/en/labview/3.0/application-builder/distributing-app-lib/) if you’re interested in learning more about distributing applications.

## Hosting a Web Application on SystemLink Cloud

For SystemLink Cloud to host your web application, use your ni.com credentials for authentication.
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
11.	Open a web browser and go to [Web apps](https://www.systemlinkcloud.com/webapphosting).
12.	To upload your web application, click **Choose .NIPKG** and select the package you just built.
13.	Once the upload is complete, click on your web app to interact with it.

# SystemLink Server
In this section, you’ll learn how to set up, build, and connect your web application to the SystemLink Server, an on-premises web server.

## What You Need to Connect to the SystemLink Server from LabVIEW NXG Web Module
![Configure GVI in LabVIEW vs Hosting on premises](https://ni.github.io/webvi-examples/CallSystemLinkDataServices/on-premises-config.PNG)

_Figure: Note the input differentiation between connecting to an  on-premises server from LabVIEW or LabVIEW NXG Web Module vs. hosting your web application on the NI Web Server._

To connect to the [SystemLink Server](http://www.ni.com/documentation/en/systemlink/latest/manual/manual-overview/) from LabVIEW NXG Web Module, you must include a **server url** (i.e. `https://systemlinkcloud.com`), a **username**, and a **password**. The username and password can be managed with the NI Web Server Configuration utility. This utility can be used to create new users and groups as well as leverage existing LDAP or Windows user accounts.  

When a web application is hosted on the SystemLink Server, leave the **server url**, **username**, and **password** inputs empty to minimize security vulnerabilities.
>**Note:** If you use your own web server, you will need to include your credentials for SystemLink Cloud or SystemLink Server to authenticate the data services in the web application.  

## Setting up an On-Premises Web Server
After installing LabVIEW NXG Web Module, you need to install and configure a SystemLink Server. SystemLink Server includes NI SystemLink Web Application.

1. Launch NI Package Manager.
2. Search for and install SystemLink Server.
3. Launch NI SystemLink Web Application. NI Web Server Configuration launches automatically.
>**Note:** If the NI Web Server Configuration doesn't launch automatically, follow this path: `C:\Program Files\National Instruments\Shared\Web Server Config`.

4.	Follow the prompts in the NI Web Server Configuration to choose the following configuration options:
   1.	On the **Select Preset** tab, select **Simple Local Access** configuration preset.
   2. On the **Authentication** tab, check **Login using Windows accounts**.
> **Note**: This makes the user an admin for SystemLink data services. It also makes the user an admin for Windows.

   3. On the **Administrators** tab, ensure **Add the local Windows Administrators group to the admins role** is selected.
   4. On the **HTTP Port** tab, set the **Server HTTP Port**.
>  **Note**: This example assumes port 9090 is chosen.

   5. On the **CORS** tab, ensure **Enable CORS for web servers running on the same machine as clients** is selected.
   6. On the **Summary** tab, review your selections and then click **Finish**.

## Building and Running the Example Web application
1. Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repository to your machine. [Go here](https://help.github.com/articles/cloning-a-repository/) if you’re new to cloning repositories on GitHub.
2. Open the **Call SystemLink Data Services** example in LabVIEW NXG Web Module.
>**Note**: You can either search for the example by name in the search bar or select **Learning»Examples»Programming WebVIs»Call SystemLink Data Services** to launch it.

3. Open `Main.gviweb` and click **Run**.
4. On the **Projects Files** tab, double-click the `WebApp.gcomp` to open it.
5. On the **Document tab**, click **Build** to build your web application.

> **Note**: You can automatically launch and view the web application locally by right-clicking the web application in SystemDesigner and then clicking **Run**.

## Hosting Overview
After you create a web application and build the package in LabVIEW NXG Web Module, you need to move it to a web server. This enables administrators to access it from a web browser. Copy your entire web application output directory to any web server you choose.
> **Note:** To navigate to your web application output on your machine, click **Locate directory in Windows Explorer** on the **Document** tab of your web application component document. You can also access the build output by navigating to your web application’s project folder manually (`\CallSystemLinkDataServices\Builds`).

Furthermore, this project includes a distribution document (`WebApp.lvdist`), which you can use to build a package (`.nipkg`). A package is also required for hosting a web application on SystemLink Cloud. [Go here](http://www.ni.com/documentation/en/labview/3.0/application-builder/distributing-app-lib/) to learn more about distributing applications.

## Local Hosting
Follow the instructions below to host the web app on a web server.

### Hosting a Package File (.nipkg) on the NI Web Server
1. Open `CallSystemLinkDataServices.lvproject`
2. Open `WebApp.lvdist`.
3. Click the **Build distribution**.
> **Note**: The button looks like a hammer.

4. Click **Locate item in Windows Explorer** to find the build output.
5. Double-click the package (`.nipkg`) and follow the on-screen instructions.
6. Open a web browser and navigate to `http://localhost:9090/CallSystemLinkdataservices/Main.html`.

### Hosting on the LabVIEW 2009-2018 Web Server
1. Go to the LabVIEW Web Server directory using the following path: `C:\Program Files (x86)\National Instruments\Shared\NI WebServer\www`.
2. Copy the entire `WebApp+Web Server` directory into the `www` directory of the LabVIEW web server.
3. Open a web browser and navigate to `http://localhost:8080/WebApp_Web%20Server/Main.html`.

### Hosting on the NI Web Server
1.	Go to the NI Web Server using the following path: `C:\Program Files\National Instruments\Shared\Web Server\htdocs`.
2. Copy the `WebApp_Web Server` directory into the `htdocs` directory of the NI Web Server.
3. Open a web browser and navigate to `http://localhost:9090/WebApp_Web%20Server/Main.html`.

# WebVI Details

The Call SystemLink Data Services examples uses tags and messages, which are a part of the SystemLink data services API. The Tag API is a highly scalable, lossy network commutation method that utilizes a central node to broker communication between distributed embedded, desktop, and web applications. Use Tags nodes to send and receive measurement data from one system to other systems.

The Message API communicates between systems with strings by publishing messages to topics and allowing subscribers of those topics to receive the messages. The Message API works like a queue. Therefore, if a publisher writes three messages, the subscribers dequeue and read those messages one at a time. Use Messages nodes when you need to send warning messages, status updates, or trigger events from one system to other systems.

Refer to the [SystemLink API Docs](https://www.systemlinkcloud.com/skyline-api-documentation) to find out more about the SystemLink data services API.

Use the example **Main.gviweb** to learn how these APIs can be assembled into an interactive application. Use the examples in **BasicDataServiceExamples.gcomp** for a simple overview of how these APIs are used. Use the LabVIEW examples in **LabVIEWExamples.lvproj** to see how you can interact with SystemLink Cloud from LabVIEW and LabVIEW Real-Time.

## The Main.gviweb and Main.gvi State Machine
State machines implement decision-making algorithms where a set of distinguishable states exists.

These states, or subdiagrams of code, carry out specific operations within a program.

In this example, a state is determined by the visible tab (**Read Tags** and **Write Tags**) on the panel. This means tags are only read or written when those controls and indicators are visible. In the **Read Tags** state, the controls and indicators are updated. This occurs because a control or indicator can have multiple terminals for the same control or indicator, and these terminals can be both read and write. This prevents stale values from being written to tags when the user switches tabs.

![Screenshot of State Machine](https://ni.github.io/webvi-examples/CallSystemLinkDataServices/state-machine.png)

If an error occurs or if the user clicks **Clear Faults and Reconnect**, the state machine will enter states not determined by the tab control. This logic is contained in the **Determine Next State** node.  If there is no error or if the user has not clicked **Clear Faults and Reconnect**, the **Determine Next State** node will use the state determined by the tab control. Regardless if there is an error or not, clicking the **Clear Faults and Reconnect** button will cause the state machine to enter the `initialize` state. If only an error has occurred, the state machine will enter the `error-no-systemlink state`.

Go here to find out more about [state machines](http://www.ni.com/documentation/en/labview/2.0/g-prog/state-machine-design-pattern/).

![Screenshot of Determine Next State](https://ni.github.io/webvi-examples/CallSystemLinkDataServices/next-state.png)

# Security
For the sake of approachability and learnability this example includes username and password fields on its panel. **We discourage this practice for all applications used in production**.

Additionally, authentication credentials should not be stored in constants on the web application's diagram.  Storing credentials, such as usernames, passwords, or API keys, on the diagram could allow a malicious attacker to retrieve them by accessing the code running in the browser. We encourage you to store your credentials securely on disk but accessible via HTTPS. For example, credentials could be stored in a JSON file within the web server that is also hosting your web application.

If storing credentials in a file is not an option and you need to host your web application on-premises, you may choose to host your web application in the NI Web Server. This requires users to login to the SystemLink Web UI for authentication. Logging into this Web UI stores an authentication cookie in your browser that is automatically sent with calls to SystemLink data services. This eliminates the need to enter a username or password directly to the WebVI, either on its panel or its diagram. To do this, put the built output of your web application into the directory found at `C:\Program Files\National Instruments\Shared\Web Server\htdocs`. This is the directory for all files hosted by the NI Web Server. Please note a user can access the URL of the web application without logging in, but in order to read/write tags, they will have to login to the SystemLink Web UI at `http://localhost:9090`.

If storing credentials in a file is not an option and you can host your web application in the cloud, you may choose to host your web application on SystemLink Cloud. This requires you to have an active SSP for the LabVIEW NXG Web Module and an ni.com account. Doing so allows an authentication cookie in your browser to be automatically sent with calls to SystemLink Cloud. This eliminates the need to enter an API key or server URL either in the web application.

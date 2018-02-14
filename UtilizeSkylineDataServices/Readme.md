# Utilize Skyline Data Services
[![Utilize Skyline Data Services](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/Builds/WebApp_Web%20Server/Main.html)
[![Utilize Skyline Data Services README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/UtilizeSkylineDataServices)

This example demonstrates how to use a WebVI to communicate over networks with Skyline Tags after connecting to YTBNCS or an on-premises web server.

Once you complete this example, you’ll know how to setup, build, and host web applications as well as how to setup and connect to YTBNCS or an on-premises web server.

## What You'll Be Able to Do

![Data Services](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/Sdata-service-cloud.png)

When you're ready to test out your web application, you will be able to do the following in the **Panel**:

- Connect to an on-premises web server or to YTBNCS by supplying the required credentials.
- Choose what information is visible by toggling between the Read Tags and Write Tags.
- Determine which state to execute with the Skyline Tags.

## Dependencies

- LabVIEW NXG Web Module 
- Web Server
- YTBNCS
- Skyline API Key Support for YTBNCS

## Choose Your Goal

What are you  trying to accomplish? Click on your goal below and we'll take you there!

- [I want to connect to an on-premises web server](https://github.com/ni/webvi-examples/blob/apikeys-and-distributions/UtilizeSkylineDataServices/Readme.md#on-premises-web-server). 
- [I want to connect to the YTBNCS](https://github.com/ni/webvi-examples/blob/apikeys-and-distributions/UtilizeSkylineDataServices/Readme.md#ytbncs). 
- [I want to learn about the details involved in creating the WebVI](https://github.com/ni/webvi-examples/blob/apikeys-and-distributions/UtilizeSkylineDataServices/Readme.md#webvi-details). 
- [I want to learn about security](https://github.com/ni/webvi-examples/blob/apikeys-and-distributions/UtilizeSkylineDataServices/Readme.md#security). 

## On-Premises Web Server

In this section, you’ll learn how to setup, build, and connect your web application to an on-premises web server. 

### What You Need To Connect To an On-Premises Web Server in LabVIEW NXG

![Configure GVI in LabVIEW vs Hosting on premises](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/on-premises-config.png)

_Figure: Note differences in inputs between using on premises data services from within LabVIEW vs hosting within the NI Web Server_

When communicating with on-premises data services from LabVIEW NXG, you must include a **server url** (i.e. https://YTBNCS.com), a **username**, and a **password**. The username and password can be managed with the NI Web Server Configuration utility. This utility can be used to create new users and groups as well as leverage existing LDAP or Windows user accounts.  

When the web application is hosted on the NI Web Server, the server url, username, and password are not needed and should not be used. This deliberately minimizes security vulnerabilities.

![Screenshot of Demo](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/Screenshot.gif)

_Figure: When hosting a WebVI in the NI Web Server, credentials do not need to be entered if the user has logged into Skyline web interface_

### Setting up an On-Premises Server

After installing the Web Module, you need to configure the NI Web Server. 
> **Note** – This configuration enabled development in LabVIEW using Skyline data services is hosted on the same machine.

1.	Launch the NI Web Server Configuration. For quick access, follow this path: `C:\Program Files\National Instruments\Shared\Web Server Config`.
2.	Follow the prompts in the NI Web Server Configuration to choose the following configuration options:
    1. On the **Select Preset** tab, select **Simple Local Access** configuration preset.
    2. On the **Authentication** tab, check **Login using Windows accounts**. 
    > **Note** – This makes the user an admin for Skyline data services. It also makes the user an admin for Windows. 
    3. On the **Administrators** tab, ensure **Add the local Windows Administrators group to the admins role** is selected.
    4. On the **HTTP Port** tab, set the **Server HTTP Port**.
    > **Note** – This example assumes port 9090 is chosen.
    5. On the **CORS** tab, ensure **Enable CORS for web servers running on the same machine as clients** is selected.
    6. On the **Summary** tab, review your selections and then click **Finish**.

### Build and Run a Web Application

1.	Clone the `ni/webvi-examples` repository to your machine. [Go here](https://help.github.com/articles/cloning-a-repository/) if you’re new to cloning repositories on GitHub.
2.	Open the **Utilize Skyline Data Services** example in LabVIEW NXG. 
3.	Open `Main.gviweb` and click **Run**.
4.	On the **Projects Files** tab, double-click the `WebApp.gcomp` to open it.
5.	On the **Document** tab, click **Build** to build your web application. 
    > **Note** - You can automatically launch and view the web application locally by right-clicking the web application in SystemDesigner and then clicking **Run**. 

### Hosting Overview

After you create and build your web application in LabVIEW NXG, you need to move it to a web server to access. This enables its administrators to access it from a web browser. Copy your entire web application output directory to any web server you choose. 
> **Note** – To navigate to your web application output on your machine, click **Locate directory in Windows Explorer** on the **Document** tab of your web application component document. You can also access the build output by navigating to your web application’s project folder manually (`\UtilizeSkylineDataServices\Builds`). 

Furthermore, this project includes a distribution document (`WebApp.lvdist`), which can be used to build a package (`.nipkg`). Packages utilize NI Package Manager to automate the process of installing, upgrading, or removing the web application. A package is also required for hosting a web application on YTBNCS. [Go here](http://www.ni.com/documentation/en/labview/2.0/application-builder/distributing-app-lib/) if you’re interested in learning more about distributing applications.

### Local Hosting
The following steps can be used to host the web app on a local web server. 

#### Hosting a Package File (.nipkg) on the NI Web Server
1.	Open `UtilizeSkylineDataServices.lvproject`.
2.	Open `WebApp.lvdist`.
3.	Click the **Build distribution** icon on the command bar -- it looks like a hammer. 
4.	Click **Locate item in Windows Explorer** to find the build output.
5.	Double-click the **package file** (`.nipkg`) and follow the on-screen instructions.
6.	Open a web browser and navigate to `http://localhost:9090/utilizeskylinedataservices/Main.html`.

#### Hosting on the LabVIEW 2009-2017 Web Server
1.	Go to the LabVIEW Web Server directory using the following path: `C:\Program Files (x86)\National Instruments\Shared\NI WebServer\www`.
2.	Copy the entire **WebApp+Web Server** directory into the LabVIEW web server directory.
3.	Open a web browser and navigate to `http://localhost:8080/WebApp_Web%20Server/Main.html`. 

#### Hosting on the NI Web Server
1.	Go to the NI Web Server using the following path: `C:\Program Files\National Instruments\Shared\Web Server\htdocs`.
2.	Copy the **WebApp_Web Server** directory into the `htdocs` directory.
3.	Open a web browser and navigate to `http://localhost:9090/WebApp_Web%20Server/Main.html`.

## YTBNCS

In this section, you’ll learn how to setup, build, and connect your web application to YTBNCS.

### What You Need To Connect with YTBNCS from LabVIEW NXG

![Configure GVI in LabVIEW vs Hosting in YTBNCS](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/ytbncs-config.png)

_Figure: Note differences in inputs between using YTBNCS data services from within LabVIEW vs hosting within YTBNCS_

When communicating with YTBNCS data services from LabVIEW NXG, you must include a **server url** (i.e. https://YTBNCS.com) and an **API key**. An API key is needed to authenticate the communication between the WebVI running on your local machine and the YTBNCS in the cloud. 

However, when the web application is hosted by YTBNCS, you don’t need an API key or a server URL because your **ni.com credentials** are used instead. This deliberately minimizes security vulnerabilities that can arise when using an API key on your hosted web application.

### What is an API Key?

An API key authenticates applications, devices, or systems – much like your ni.com credentials authenticate who you are and your access privileges. (This can totally change -- just wanted a placemarker for what an API key is.)

### Obtaining an API Key

1. Go to [YTBNCS.com](https://ytbncs.com), enter your **ni.com credentials** to login. 
2. Click on **Security**.
3. Click **+ New API key**.
4. Click **Copy to clipboard** to save the API key.
> **Note** - You only get to see an API key once, so retain it somewhere safe and provide it to those you trust. If you delete an API key, all applications using that API key will no longer be able to connect to YTBNCS.

### Build and Run a Web Application

1.	Clone the `ni/webvi-examples` repository to your machine. [Go here](https://help.github.com/articles/cloning-a-repository/) if you’re new to cloning repositories on GitHub.
2.	Open the **Utilize Skyline Data Services** example in LabVIEW NXG. 
3.	Open `Main.gviweb` and click **Run**.
4.	On the **Projects Files** tab, double-click the `WebApp.gcomp` to open it.
5.	On the **Document** tab, click **Build** to build your web application. 
    > **Note** - You can automatically launch and view the web application locally by right-clicking the web application in SystemDesigner and then clicking **Run**. 

### Hosting Overview

After you create and build your web application in LabVIEW NXG, you need to move it to a web server to access. This enables its administrators to access it from a web browser. Copy your entire web application output directory to any web server you choose. 
> **Note** – To navigate to your web application output on your machine, click **Locate directory in Windows Explorer** on the **Document** tab of your web application component document. You can also access the build output by navigating to your web application’s project folder manually (`\UtilizeSkylineDataServices\Builds`). 

Furthermore, this project includes a distribution document (`WebApp.lvdist`), which can be used to build a package (`.nipkg`). Packages utilize NI Package Manager to automate the process of installing, upgrading, or removing the web application. A package is also required for hosting a web application on YTBNCS. [Go here](http://www.ni.com/documentation/en/labview/2.0/application-builder/distributing-app-lib/) if you’re interested in learning more about distributing applications.

#### YTBNCS Cloud Hosting

The following steps can be used to host the web app on YTBNCS. 

1. Open `UtilizeSkylineDataServices.lvproject`.
2. Open `WebApp.lvdist`.
3. Click the **Build distribution** icon on the command bar -- it looks like a hammer. 
4. Open a web browser and navigate to https://YTBNCS/webapps. 
5. To upload your web application, click the **Choose nipkg** button and select the package file (`.nipkg`) built in Step 3.
6. When the upload is complete, click on your newly uploaded Web app from your list of Web apps

## WebVI Details

In this section, find out about the WebVI's Skyline tags and State Machine.

### Skyline Tags and Data Types

While tags have limited data types (integer, double, and string), these data types can be utilized to provide sufficient flexibility for most applications. For example, string tags can be used to transmit JSON or other string-based interchange formats. 

It is also common practice to use integer tags to transmit Boolean data. For an example of this practice, check out the examples below.

![Screenshot of Int to Bool](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/int-to-bool.png)

Here, the Boolean to converted to an integer using the **Boolean to Integer** node before writing the tag. Then, in **Read Example Tags** VI, a **Not Equal to 0?** node is used to convert the integer to a Boolean.

### Multi Read and Multi Write Tags

This example demonstrates the best practice for using the **Multi Read** and **Multi Write** tags nodes to read and write all tags in a single call. The single read and write versions are implemented but disabled for sake of this example. While **Multi Read** and **Multi Write** requires slightly more complex block diagram code, the whole application runs more efficiently by using one **GET** node or **POST** node to read or write all five tags rather than five **GET** or **POST** calls. This advantage scales well in real applications with many tags are visualized in a single application.

![Screenshot of MultiRead](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/multi-read.png)

### State Machine

State machines implement decision-making algorithms where a set of distinguishable states exists. 

These states, or subdiagrams of code, carry out specific operations within a program.

In this example, a state is determined by the visible tab (**Read Tags** and **Write Tags**) on the Panel. This means tags are only read or written when those controls and indicators are visible. In the **Read Tags** state, the controls and indicators are updated. This occurs because a control or indicator can have multiple terminals for the same control or indicator, and these terminals can be both read and write. This prevents stale values from being written to tags when the user switches tabs.

![Screenshot of State Machine](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/state-machine.png)

If an error occurs or if the user clicks **Clear Faults and Reconnect**, the state machine will enter states not determined by the tab control. This logic is contained in the **Determine Next State** node. If there is no error or if the user has not clicked **Clear Faults and Reconnect**, the **Determine Next State** node will use the state determined by the tab control. Regardless if there is an error or not, clicking the **Clear Faults and Reconnect** button causes the state machine to enter the initialize state. The state machine will only enter the error-no-skyline state if an error has occurred.

![Screenshot of Determine Next State](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/next-state.png)

[Go here](http://www.ni.com/documentation/en/labview/2.0/g-prog/state-machine-design-pattern/) to find out more about state machines.

## Security

For the sake of approachability and learnability, this example includes username and password fields on its panel. **We discourage this practice for all applications used in production.** 

Additionally, authentication credentials should not be stored in constants on the diagram. This is true for both username, password, and API keys. Doing this could lead to credentials stored being in version control or allow a malicious attacker to retrieve your credentials by accessing the code running the browser. We encourage you to store your credentials securely on disk but accessible via HTTPS. For example, credentials could be stored in a JSON file within the web server that’s also hosting your web application.

If storing credentials in a file is not an option and you need to host your web application on-premises, you may choose to host your web application in the NI Web Server. This requires users to login to the Skyline Web UI for authentication. Logging into this Web UI stores an authentication cookie in your browser that is automatically sent with calls to Skyline data services. This eliminates the need to enter a username or password directly to the WebVI either on its panel or its diagram. To do this, put the built output of your web application into `C:\Program Files\National Instruments\Shared\Web Server\htdocs`. This is the directory for all files hosted by the NI Web Server. Please note a user can access the URL of the web application without logging in, but in order to read/write tags, they will have to login to the Skyline Web UI at http://localhost:9090.

If storing credentials in a file is not an option and you can to host your web application in the cloud, you may choose to host your web application in YTBNCS. This requires you to have active SSP for the LabVIEW NXG Web Module as well as login into your ni.com account. Doing so allows an authentication cookie in your browser to be automatically sent with calls to YTBNCS. This eliminates the need to enter an API key or server url either on the web application’s panel or diagram.


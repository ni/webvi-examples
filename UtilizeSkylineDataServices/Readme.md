# Utilize Skyline Data Services
[![Utilize Skyline Data Services](https://img.shields.io/badge/Details-Demo_Link-green.svg)](https://ni.github.io/ZZZZZZZZZZZZZ)
[![Utilize Skyline Data Services README Link](https://img.shields.io/badge/Details-README_Link-orange.svg)](https://github.com/ni/webvi-examples/tree/master/XXXXXXXXXX)

This example demonstrates how to use a WebVI to communicate over networks with Skyline Tags. The example also shows how code can be shared between WebVIs and GVIs using a library.  On the diagram, this WebVI utilizes a state machine to determine when to read, write, and connect to a server. On the panel, this example has fields to enter the server, username, and password. It also has a tab control that determines the visible view as well as the state in the state machine.

![Screenshot of Demo](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/Screenshot.gif)

# Dependencies
- LabVIEW NXG 2.0 Web Module

# Setup
1. Clone the [ni/webvi-examples](https://github.com/ni/webvi-examples) repository to your machine.
2. Open `UtilizeSkylineDataServices\UtilizeSkylineDataServices.lvproject`
3. Open `Main.gviweb` and click the **Run** button.
4. Build the web application.  
  a. Open `WebApp.gcomp`.  
  b. On the **Document** tab, click **Build**.

# Details
Skyline tags are a highly scalable, lossy network commutation method that utilizes a central node to broker communication between distributed embedded, desktop, and Web applications. Tags have limited data types (integer, double, and string), but these datatypes can be utilized to provide sufficient flexibility for most applications. String tags can be used to transmit JSON or other string based interchange formats. It is also common practice to utilize an integer tag to transmit data that will be represented to the user as a Boolean.

![Screenshot of Int to Bool](https://ni.github.io/webvi-examples/UtilizeSkylineDataServices/int-to-bool.png)

Here the bool to converted to an integer using the **Boolean to Integer** primitive before writing the tag. The Read Example Tags a **Not Equaly to 0?** to convert the integer to a Boolean.




A web service is a collection of functions that can be called through the web to trigger behavior or return data. Many websites offer these APIs as a way for third-party developers to build new applications using the website's underlying data or functionality.

Many web services are open and public like the Earthquake API. Others require registration and API keys that restrict access to specific users and limit the load on the service.

To call a web service in a WebVI, this example uses the `HTTP Get` node to pass in the URL of the service and return a string with the result of the call. There are examples of this in several WebVIs, including `GetRecentEarthquakes.gviweb`.

![Calling Web Service using HTTP Get](img/HTTPGet.png)

Web services return data in a variety of formats, such as JSON, XML, CSV, and YML. The USGS Earthquake service returns JSON, which LabVIEW can parse using the `Unflatten from JSON` node. To use `Unflatten from JSON`, you must specify the structure the data is expected to take and can provide a path to limit the search to a specific part of the data. There are examples of this in several WebVIs, including `Get Earthquake Count.gviweb`.

![Parsing JSON using Unflatten from JSON](img/UnflattenJSON.PNG)

If the web service returns data in a format other than JSON, you can still parse it in the WebVI using String nodes. There is an example of this in `Get Map URL.gviweb`.

Once the data has been retrieved and converted into LabVIEW data types, this example displays the data in indicators on the panel of the top-level WebVI, `Main.gviweb`. This example uses a data grid to show all earthquakes and a URL Image indicator to display a map of the surrounding area.

![Wiring to indicators](img/Indicators.PNG)

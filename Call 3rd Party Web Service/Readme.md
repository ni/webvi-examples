# Call 3rd Party Web Service
This example calls the [Earthquake API](https://earthquake.usgs.gov/) from the [US Geological Survey](https://www.usgs.gov/).

It uses [HTTP GET](http://zone.ni.com/reference/en-XX/help/371361N-01/lvcomm/http_client_get/) to query for earthquakes in the last 30 days and [Unflatten from JSON](http://zone.ni.com/reference/en-XX/help/371361N-01/glang/unflatten_from_json/) to convert the results to LabVIEW data.

It displays a summary of the results in a data grid indicator and shows a map of the selected earthquake region in a URL Image indicator.

![alt text](Screenshot.PNG "Screenshot")
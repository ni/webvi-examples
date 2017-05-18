/* WebVICenter.js is used to conditionally center elements in the body element
   of the page based on where the page is running.
   
   Note: This script should be inserted at the end of the body of the page and
   configured to load synchronously (without the defer or async attributes).
   
   It is not normal to load scripts synchronously in this way as it can
   drastically reduce page load performance. It is neccessary in this case as
   this script will cause large changes to layout of the entire page and
   loading synchronously will prevent page jumps after load.
*/

(function () {
    'use strict';

    // Find the ni-web-application element if it exists in the page
    var niWebAppElement = document.querySelector('ni-web-application');
    if (niWebAppElement === null) {
        return;
    }

    // Examine the location attribute of the ni-web-application element as
    // available in the DOM of the page.

    // In most scripts that run after DOMContentLoaded it is possible to access
    // properties of the element directly, ie. niWebAppElement.location, however
    // as this script loads before DOMContentLoaded the element will not be
    // instantiated and the property is not directly available.
    if (niWebAppElement.getAttribute('location').toLowerCase() !== 'browser') {
        return;
    }

    // Apply the webvi-center class to the body element. This activates the CSS
    // found in the WebVICenter.css file.
    document.body.classList.add('webvi-center');
}());

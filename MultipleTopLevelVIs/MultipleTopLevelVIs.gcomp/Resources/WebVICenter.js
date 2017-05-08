// Place script at end of body and load synchronously to prevent page jumping on load
(function () {
    'use strict';

    // Use the ni-web-application element to determine if the page is configured to run in the browser
    var webAppElement = document.querySelector('ni-web-application');
    if (webAppElement === null) {
        return;
    }

    // ni-web-application element not initialized so read HTML attribute directly
    if (webAppElement.getAttribute('location').toLowerCase() !== 'browser') {
        return;
    }

    document.body.classList.add('webvi-center');
}());

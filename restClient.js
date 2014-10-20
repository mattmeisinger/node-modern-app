(function() {
  'use strict';

  // TODO - Move AWS functionality and REST functionality into separate modules
  // TODO - Add support for pagination
  // TODO - Create either a single config file, provide commandline argument support, or allow setting through object returned by require.

  var awsInterface = require('./awsInterface'),
      restInterface = require('./restInterface'),
      Q = require('q');

  function processMessage() {

    var message;

    awsInterface.getMessage()

    // Make REST call if there is a pending message
    .then(function(data) {
      if (data.messageReceived) {
        message = data.message;
        return restInterface.makeRestCall(data.body, data.messageId, data.message);
      } else {
        // Skip all others
      }
    })

    // Potentially delete message based on REST response
    .then(function(data) {
      if (message) {
        return awsInterface.deleteMessage(message);
      }
    })

    // Handle any errors that may have occurred
    .then(null, function(error) {

    })

    // Once finished, start the next loop.  I include a delay so it's easier for the user to watch results.
    .done(function() {
      setTimeout(processMessage, 1000);
    });

  }

  processMessage();

})();

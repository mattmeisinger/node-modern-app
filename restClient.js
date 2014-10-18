(function() {
  'use strict';

  // TODO - Move AWS functionality and REST functionality into separate modules
  // TODO - Add support for pagination
  // TODO - Create either a single config file, provide commandline argument support, or allow setting through object returned by require.

  var sqs,
      Q = require('q'),
      AWS = require('aws-sdk'),
      awsCredentialsPath = './aws.credentials.json',
      sqsQueueUrl = 'https://sqs.us-west-2.amazonaws.com/044986513270/Modern-Internet-Applications';


  // TODO - Put baseUrl somewhere more appropriate
  var baseUrl = 'http://localhost:1337/api',
      Client = require('node-rest-client').Client,
      client = new Client();

  // Load credentials from local json file
  AWS.config.loadFromPath(awsCredentialsPath);

  // Instantiate SQS client
  sqs = new AWS.SQS();


  function processMessage() {
    console.log('\n\n===========================================');

    var deferred = Q.defer();

    sqs.receiveMessage({
      QueueUrl: sqsQueueUrl,
      MaxNumberOfMessages: 1,
      VisibilityTimeout: 60,  // seconds - how long we want a lock on this job
      WaitTimeSeconds: 3      // seconds - how long should we wait for a message?
     }, function(err, data) {

      var body,
          message;

      if (err) {
        console.log('The SQS Message returned this error: ' + err.message);
        deferred.reject(err);
        return;
      }


      if (data.Messages) {
        message = data.Messages[0];

        console.log('Processing message with ID ' + message.MessageId);

        try {
          body = JSON.parse(message.Body);
        } catch (err) {
          console.log('Received the following error while trying to parse the message from AWS: [' + err.message + ']');
          deferred.reject(err);
          return;
        }

        // TODO - Currently using the message's MessageId as the nonce.  Make sure this is always a valid approach.
        makeRestCall(body, message.MessageId, message, deferred);
      } else {
        deferred.resolve('No messages to process');
        console.log('No messages to process');
      }
     });

    return deferred.promise;
  }

  function deleteMessage(message, deferred) {
    sqs.deleteMessage({
      QueueUrl: sqsQueueUrl,
        ReceiptHandle: message.ReceiptHandle
      }, function(err, data) {
        if (err) {
          deferred.reject(err);
          console.log('The following error occurred while trying to delete a message: ' + err.message);
        } else {
          deferred.resolve('Successfully processed message');
        }
      }
    );
  }

  var CLIENT_METHODS = {
    'get': client.get,
    'post': client.post,
    'put': client.put,
    'delete': client.delete
  };

  function makeRestCall(params, nonce, message, deferred) {
    var id,
        url,
        clientMethod,
        args = {
          data: params.data,
          headers: {
            'Content-Type': 'application/json',
            nonce: nonce
          }
        };

    if (!params.model) {
      console.log('A model parameter is required to make a rest call');
      deferred.reject(new Error('A model parameter is required to make a rest call'));
      return;
    } else if (typeof params.method !== 'string') {
      console.log('The method parameter must be a string');
      deferred.reject(new Error('The method parameter must be a string'));
      return;
    }

    clientMethod = CLIENT_METHODS[params.method.toLowerCase()];

    if (!clientMethod) {
      console.log('The client method ' + params.method + ' is not valid');
      deferred.reject(new Error('The client method ' + params.method + ' is not valid'));
      return;
    }

    id = params.data ? params.data.id : undefined;
    url = id ? [baseUrl, params.model, id].join('/') : [baseUrl, params.model].join('/');

    console.log('Making request to [' + url + '] with the following data:');
    console.log(args);

    clientMethod(url, args, function(data, response) {

      if (response.statusCode === 200) {
        console.log('REST call successful.  Deleting message.');
        deleteMessage(message, deferred);
      } else if (response.statusCode === 400 && data === 'Duplicate nonce received.') {
        console.log('Duplicate REST call.  Deleting message.');
        deleteMessage(message, deferred);
      } else {
        console.log('Unrecognized response from REST call. NOT deleting message.  Message details below.');
        console.log('data returned:');
        console.log(data);
        console.log('response returned:');
        console.log(response);
        deferred.reject('Unrecognized response from REST call');
      }
    });
  }

  function loopProcessMessage() {
    processMessage()
    .done(function() {
      setTimeout(loopProcessMessage, 1000);
    });
  }

  loopProcessMessage();

  /*
  function processMessage() {

    awsInterface.getMessage()

    // Make REST call if there is a pending message
    .then(function() {
      if (msgExists) {
        return restInterface.makeRestCall(msgArgs);
      } else {
        // Skip all others
      }
    }, function() {
      // TODO - Log error regarding AWS
    })

    // Potentially delete message based on REST response
    .then(function() {

    }, function() {

    })

    // Once finished, start the next loop
    .done(function() {
      processMessage();
    });
  }
  */

})();

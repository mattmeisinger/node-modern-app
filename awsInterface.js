module.exports = (function() {
  'use strict';

  var sqs,
      Q = require('q'),
      AWS = require('aws-sdk'),
      awsCredentialsPath = './aws.credentials.json',
      sqsQueueUrl = 'https://sqs.us-west-2.amazonaws.com/044986513270/Modern-Internet-Applications';

  // Load credentials from local json file
  AWS.config.loadFromPath(awsCredentialsPath);

  // Instantiate SQS client
  sqs = new AWS.SQS();

  function getMessage() {
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
        deferred.resolve({
          messageReceived: true,
          body: body,
          messageId: message.MessageId,
          message: message
        });
      } else {
        deferred.resolve({ messageReceived: false });
        console.log('No messages to process');
      }
     });

    return deferred.promise;
  }

  function deleteMessage(message) {

    var deferred = Q.defer();

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

    return deferred.promise;
  }

  return {
    getMessage: getMessage,
    deleteMessage: deleteMessage
  };

})();


var aws = require('aws-sdk');


module.exports = {
  get: function(req, res) {
    var params = {
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/876997605544/TestQueue', /* required */
      AttributeNames: [
        'Policy | VisibilityTimeout | MaximumMessageSize | MessageRetentionPeriod | ApproximateNumberOfMessages | ApproximateNumberOfMessagesNotVisible | CreatedTimestamp | LastModifiedTimestamp | QueueArn | ApproximateNumberOfMessagesDelayed | DelaySeconds | ReceiveMessageWaitTimeSeconds | RedrivePolicy',
        /* more items */
      ],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: [
        'STRING_VALUE',
        /* more items */
      ],
      VisibilityTimeout: 0,
      WaitTimeSeconds: 0
    };

    // This requires that your credentials be saved in
    // ~/.aws/credentials
    var sqs = new aws.SQS({
      region: "us-east-1"
    });
    sqs.receiveMessage(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        console.log('Received message from sms');
        console.log(data);           // successful response
        return res.json({
          messageCount: data.Messages.length,
          messages: data.Messages
        });
      }
    });
  }
}
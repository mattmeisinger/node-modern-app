# CRM

A simple [Sails](http://sailsjs.org) CRM application built using modern internet application development practices.

# Rest Client
## Getting started

You'll need to create a file named 'aws.credentials.json' in the same directory as where you're executing the restClient.js script.

The format of the file should be the following:

{
 "accessKeyId": "YOUR AWS PUBLIC KEY",
 "secretAccessKey": "YOUR AWS SECRET KEY",
 "region": "us-east-1"
}

## Adding to SQS

You can add messages through Amazon's SQS service by selecting 'Send a Message' in the 'Queue Actions' dropdown.  Messages will follow formats like those seen in the ExampleRestObjects.txt file.

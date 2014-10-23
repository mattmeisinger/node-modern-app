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


# REST API
## Example REST API Requests

**Note**: The nonces in the requests below must be changed if the commands are to be executed multiple times.

Create a new agent:

	curl -i -H "Accept: application/json" -H "Nonce: 1248fdjs9421" -H "Content-Type: application/json" -X POST -d '{"firstName": "Test From", "lastName": "CURL", "email": "test@test.com", "phone": "test"}' http://localhost:1337/api/agent

Get list of agents:
	
	curl -i -H "Accept: application/json" -H "Nonce: 1248djs94121" -H "Content-Type: application/json" -X GET http://localhost:1337/api/agent

Get single agent:

	curl -i -H "Accept: application/json" -H "Nonce: 1248fdjs941221" -H "Content-Type: application/json" -X GET http://localhost:1337/api/agent/1

Get second page of agents:

	curl -i -H "Accept: application/json" -H "Nonce: 1248djdd941121" -H "Content-Type: application/json" -X GET http://localhost:1337/api/agent?page=2
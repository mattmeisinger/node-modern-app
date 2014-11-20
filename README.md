# CRM

A simple [Sails](http://sailsjs.org) CRM application built using modern internet application development practices.

## Rest Client
### Getting started

You'll need to create a file named 'aws.credentials.json' in the same directory as where you're executing the restClient.js script.

The format of the file should be the following:

{
 "accessKeyId": "YOUR AWS PUBLIC KEY",
 "secretAccessKey": "YOUR AWS SECRET KEY",
 "region": "us-east-1"
}

### Adding to SQS

You can add messages through Amazon's SQS service by selecting 'Send a Message' in the 'Queue Actions' dropdown.  Messages will follow formats like those seen in the ExampleRestObjects.txt file.


## REST API
### Example REST API Requests

**Note**: The nonces in the requests below must be changed if the commands are to be executed multiple times.

Create a new agent:

	curl -i -H "Accept: application/json" -H "Nonce: 1248fdjs9421" -H "Content-Type: application/json" -X POST -d '{"firstName": "Test From", "lastName": "CURL", "email": "test@test.com", "phone": "test"}' http://localhost:1337/api/agent

Get list of agents:
	
	curl -i -H "Accept: application/json" -H "Nonce: 1248djs94121" -H "Content-Type: application/json" -X GET http://localhost:1337/api/agent

Get single agent:

	curl -i -H "Accept: application/json" -H "Nonce: 1248fdjs941221" -H "Content-Type: application/json" -X GET http://localhost:1337/api/agent/1

Get second page of agents:

	curl -i -H "Accept: application/json" -H "Nonce: 1248djdd941121" -H "Content-Type: application/json" -X GET http://localhost:1337/api/agent?page=2

## Subscriptions

For this part of the assignment we're using RabbitMQ's Topics model. It works
like this:

    Producer --------> Exchange -------> Consumer

A Producer produces messages of a certain topic. These are sent to an
Exchange—which figures out where the message needs to go—and are
delivered to Consumers based on their topic interest.

For us this means:

    CRM app  --------> Exchange --------> Notifications App

Our setup has a single exchange (there could be many) that receives messages of
various topics from our CRM app and routes them to our notifications app to be
processed. The notifications app figures out which agent it needs to notify
based on the topic of the message.

Our topic hierarchy for customers will be as follows:

                            CRM
                             |
                    --------------------
                   |                    |
                Customer              Agent
                   |                    |
                 Fields               Fields


At every level of the topic tree, we have CUD operations—not for Retrieves,
because it's not really useful in this context to get notifications when a
customer or agent is retrieved.

We'll be focusing on Customers for now but everything can be easily applied to
Agents.

### Producer side
On every CUD operation on Customer, the resulting object, serialized as JSON, is
sent to Rabbit. All messages are tagged with the following topic schema:

    <entity>.<id>.<operation>

These can be:

topic      | description
-----------|----------------------------
 entity    | customer or agent
 id        | id of the entity
 operation | create, update, delete

#### Examples
##### Example 1: A Customer (with Id 10) in Zip 10027 is created

Send message:

    { id: 10, name: "John", zip: "10027", state: "NY", agent: "3" }

With topic:

    customer.10.create

##### Example 2: Customer 5 Updates their Agent to 123

Send message:

    { agent: "123" }

With topic:

    customer.5.update

Notice that in this case we only send the parameter(s) that was updated.

##### Example 3: Customer 5 is deleted from the system

Send message:

    { id: 5, name: "Olive", zip: "53371", state: "CA", agent: "123" }

With topic:

    customer.5.delete

### Consumer side
To simplify the consumer process, we'll listen for all messages that get posted
to the "customer.#" queue (i.e., all operations on customers).

When a new message is received from rabbit, we'll perform a search for a
subscription that matches the criteria.

#### Example #1:

A new subscription that contains the following parameters is created by Agent 1.

    Agent: 1
    Customer:
    Parameter: State
    Value: NY
    Operation: Create
    Notification: Push

This represents a push subscription for Agent Id 1 that will trigger when a
customer is created in NY.

For example, let's assume Example 1 from the producer section is sent.

    Send message:

        { id: 10, name: "John", zip: "10027", state: "NY", agent: "3" }

    With topic:

        customer.10.create

We'll simply call our Subscription API filter on these parameters. If there's a
match, we'll send the notification. In this case, there is a match because of
the state.

#### Example #2:

    Agent: 1
    Customer:
    Parameter: Zip code
    Value: 11027
    Operation: Create, Update
    Notification: Email

This represents an Email subscription for Agent Id 1 that will trigger when any
Customer's zip code is Created or Updated to Value 11027.


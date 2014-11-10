# Subscriptions

For this part of the assignment we're using RabbitMQ's Topics model. It works
like this:

    Producer --------> Exchange -------> Consumer

A Producer produces messages of a certain topic. These are sent to an
Exchange—which figures out where the message needs to go—and are
delivered to Consumers based on their topic interest.

For us this means:

    CRM app  -> Exchange -> Notifications App

Our setup has a single exchange (there could be many) that receives messages of
various topics from our CRM app and routes them to our notifications app to be
processed. The notifications app figures out which agent it needs to notify
based on the topic of the message.

Our topic hierarchy for customers will be as follows:

                                  Customer
                                     |
         -----------------------------------------------------------
        |        |         |         |         |         |         |
    FirstName LastName   Email     Phone      Zip      Agent  ContactHistory


At every level of the topic tree, we have CUD operations—not for Retrieves,
because it's not really useful in this context to get notifications when a
customer is retrieved.

Producer side
=============
On every CUD operation on Customer, a message is sent to Rabbit. Our messages
have the following schema:

    <entity>.<id>.<operation>.<parameter>.<value>

These can be:

topic      | description
-----------|----------------------------
 entity    | a customer or agent
 id        | id of the entity
 operation | create, update, delete
 parameter | Any parameter for the entity
 value     | The new value of the parameter

### Examples
A Customer (with Id 10) in Zip 10027 is created:

    customer.10.create.zip.10027

Customer 5 Updates their Agent to 123:

    customer.5.update.agent.123

Sometimes it doesn't make sense to specify \<parameter> or \<value>. For example,
when a customer is deleted:

    customer.2.delete

Consumer side
=============
The Notifications app will register to receive messages that it's interested in.
This happens when a new subscription is created.

Here's a couple of examples of new Subscriptions:

### Example #1:

    Agent: 1
    Customer: 9
    Parameter: Zip code
    Value:
    Operation: Update
    Notification: Push

This represents SMS subscription for Agent Id 1 that will trigger when the
zip code Parameter of Customer Id 9 gets Updated to any Value.

We'll tell Rabbit to subscribe us to messages of the following topic:

    customer.9.update.zip.*

And from then on, Rabbit sends a message to the Notifications app when a message
of that topic arrives.

### Example #2:

    Agent: 1
    Customer:
    Parameter: Zip code
    Value: 11027
    Operation: Create, Update
    Notification: Email

This represents an Email subscription for Agent Id 1 that will trigger when any
Customer's zip code is Created or Updated to Value 11027.

    customer.*.create.zip.10027
    customer.*.update.zip.10027

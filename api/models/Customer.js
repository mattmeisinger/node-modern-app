/**
* Customer.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var Person = require('./Person'),
    util   = require('util'),
    amqp   = require('amqplib'),
    when   = require('when');

function Customer() {
  Person.apply(this, arguments);
}

util.inherits(Customer, Person);

module.exports = {

  attributes: {
    updatedContactInfoAt: {
      type: 'date'
    },
    agent: {
      model: 'agent'
    },
    contactHistory: {
      collection: 'contactHistory',
      via       : 'customer'
    }
  },

  afterCreate: function(insertedRecord, next) {
    this.rabbitSend('customer.create', insertedRecord);
    next();
  },

  afterUpdate: function(updatedRecord, next) {
    this.rabbitSend('customer.update', updatedRecord);
    next();
  },

  afterDestroy: function(destroyedRecord, next) {
    this.rabbitSend('customer.destroy', destroyedRecord);
    next();
  },

  rabbitSend: function(topic, record) {
    // Serializes the object
    var message = JSON.stringify(record);

    // Connects to local instance of RabbitMQ
    amqp.connect('amqp://localhost').then(function(conn) {
      return when(conn.createChannel().then(function(ch) {
        var exchangeName = 'operations';
        var exchangeType = 'topic';
        // Asserts that the exchange exists
        var ok = ch.assertExchange(exchangeName, exchangeType, {durable: false});
        return ok.then(function() {
          // Publishes 'message' of 'topic' to 'exchangeName'
          ch.publish(exchangeName, topic, new Buffer(message));
          console.log(" [x] Sent to %s:'%s'", topic, message);
          return ch.close();
        });
      })).ensure(function() { conn.close(); })
    }).then(null, console.log);
  }

};


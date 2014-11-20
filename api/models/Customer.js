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

function rabbitSend(topic, record) {
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
    },
    state: {
      type: 'string'
    },
    zip: {
      type: 'integer'
    }
  },

  afterCreate: function(customer, next) {
    var topic = ['customer', customer.id, 'create'].join('.');
    rabbitSend(topic, customer);
    next();
  },

  afterUpdate: function(customer, next) {
    var topic = ['customer', customer.id, 'update'].join('.');
    rabbitSend(topic, customer);
    next();
  },

  afterDestroy: function(customer, next) {
    var topic = ['customer', customer.id, 'destroy'].join('.');
    rabbitSend(topic, customer);
    next();
  },

  rabbitSend: rabbitSend

};


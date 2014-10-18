/**
* Customer.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var Person = require('./Person'),
    util   = require('util');

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
  }

};


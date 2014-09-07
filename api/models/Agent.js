/**
* Agent.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var Person = require('./Person'),
    util   = require('util');

function Agent() {
  Person.apply(this, arguments);
}

util.inherits(Agent, Person);

module.exports = {

  attributes: {
    customers : {
      collection: 'customer',
      via: 'agent'
    }
  }

};


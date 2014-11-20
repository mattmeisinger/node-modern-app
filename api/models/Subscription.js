/**
* Subscription.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    agent       : { model: 'agent' },
    customerId  : { type: 'integer' },
    parameter   : { type: 'string' },
    value       : { type: 'string' },
    operation   : {
      type: 'string',
      enum: ['all', 'create', 'update', 'destroy']
    },
    notification : {
      type: 'string',
      enum: ['email', 'push']
    }
  }

};


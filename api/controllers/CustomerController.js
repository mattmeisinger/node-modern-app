/**
 * CustomerController
 *
 * @description :: Server-side logic for managing Customers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Q = require('q');
var CustomerFacade = require('../BusinessService/CustomerFacade');

module.exports = {

  get: function(req, res) {
    var id = req.param('id');
    if (id > 0) {
      CustomerFacade.get(id)
        .then(function (item) {
          if (!item) res.send(400, { error: 'Bad request' });

          // Need to pass an agentId property to the browser so the agent
          // assignment can be changed.
          item.agentId = item.agent ? item.agent.id : null;

          res.json(item);
        })
        .fail(function (err) {
          res.send(500, {error: 'An unexpected error occurred.'});
        });
    }
    else {
      CustomerFacade.getAll()
        .then(function(agents) {
          res.json(agents);
        })
        .fail(function(err) {
          res.send(500, {error: 'An unexpected error occurred.'});
        });
    }
  },

  post: function(req, res) {
    var item = {
      firstName: req.param('firstName'),
      lastName:  req.param('lastName'),
      email:     req.param('email'),
      phone:     req.param('phone'),
      agent:     req.param('agentId')
    };

    CustomerFacade.save(item)
      .then(function (item) {
        res.send(200, item);
      })
      .fail(function(err) {
        res.send(500, { error: 'An unexpected error occurred.' });
      });
  },

  put: function(req, res) {
    var item = {
      id:        req.param('id'),
      firstName: req.param('firstName'),
      lastName:  req.param('lastName'),
      email:     req.param('email'),
      phone:     req.param('phone'),
      agent:     req.param('agentId')
    };

    CustomerFacade.save(item)
      .then(function (item) {
        res.send(200, item);
      })
      .fail(function(err) {
        res.send(500, { error: 'An unexpected error occurred.' });
      });
  },

  delete: function(req, res) {
    var id = req.param('id');
    CustomerFacade.delete(id)
      .then(function () {
        res.send(200);
      })
      .fail(function(err) {
        res.send(500, { error: 'An unexpected error occurred.' });
      });
  }

};


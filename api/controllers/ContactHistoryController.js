/**
 * ContactHistoryController
 *
 * @description :: Server-side logic for managing Contacthistories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Q = require('q');
var ContactHistoryFacade = require('../BusinessService/ContactHistoryFacade');

module.exports = {

  get: function(req, res) {
    var id = req.param('id');
    if (id > 0) {
      ContactHistoryFacade.get(id)
        .then(function (item) {
          if (!item) res.send(400, { error: 'Bad request' });

          // Need to pass an agentId property to the browser so the agent
          // assignment can be changed.
          item.agentId = item.agent ? item.agent.id : null;
          item.customerId = item.customer ? item.customer.id : null;

          res.json(item);
        })
        .fail(function (err) {
          res.send(500, {error: 'An unexpected error occurred.'});
        });
    }
    else {
      ContactHistoryFacade.getAll()
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
      data:      req.param('data'),
      model:     req.param('model'),
      summary:   req.param('summary'),
      agent:     req.param('agentId'),
      customer:  req.param('customerId')
    };

    ContactHistoryFacade.save(item)
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
      data:      req.param('data'),
      model:     req.param('model'),
      summary:   req.param('summary'),
      agent:     req.param('agentId'),
      customer:  req.param('customerId')
    };

    ContactHistoryFacade.save(item)
      .then(function (item) {
        res.send(200, item);
      })
      .fail(function(err) {
        res.send(500, { error: 'An unexpected error occurred.' });
      });
  },

  delete: function(req, res) {
    var id = req.param('id');
    ContactHistoryFacade.delete(id)
      .then(function () {
        res.send(200);
      })
      .fail(function(err) {
        res.send(500, { error: 'An unexpected error occurred.' });
      });
  }

};


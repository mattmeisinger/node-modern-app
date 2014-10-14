/**
 * AgentController
 *
 * @description :: Server-side logic for managing Agents
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var AgentFacade = require('../BusinessService/AgentFacade');

module.exports = {

  get: function(req, res) {
    var id = req.param('id');
    if (id > 0) {
      AgentFacade.get(id)
        .then(function (item) {
          if (!item) res.send(400, { error: 'Bad request' });
          res.json(item);
        })
        .fail(function (err) {
          res.send(500, {error: 'An unexpected error occurred.'});
        });
    }
    else {
      AgentFacade.getAll()
        .then(function(items) {
          res.json(items);
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
      phone:     req.param('phone')
    };

    AgentFacade.save(item)
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
      phone:     req.param('phone')
    };

    AgentFacade.save(item)
      .then(function (items) {
        if (items.length === 1) {
          res.send(200, items[0]);         
        }
        else {
          res.send(500, { error: 'An unexpected error occurred.' });
        }
      })
      .fail(function(err) {
        res.send(500, { error: 'An unexpected error occurred.' });
      });
  },

  delete: function(req, res) {
    var id = req.param('id');
    AgentFacade.delete(id)
      .then(function () {
        res.send(200);
      })
      .fail(function(err) {
        res.send(500, { error: 'An unexpected error occurred.' });
      });
  }
};


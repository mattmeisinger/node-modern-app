/**
 * ContactHistoryController
 *
 * @description :: Server-side logic for managing Contacthistories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Q = require('q');
var ContactHistoryFacade = require('../BusinessService/ContactHistoryFacade');
var PAGE_LENGTH = 2;

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
          req._sails.log.error(err);
          res.send(500, {error: 'An unexpected error occurred.'});
        });
    }
    else {
      var page = parseInt(req.param('page') || 1);
      ContactHistoryFacade.getAll()
        .then(function(items) {
          var nextUri = null;
          var prevUri = null;
          var nextPage = page+1;
          var prevPage = page-1;
          if (items.length > page * PAGE_LENGTH) {
            nextUri = '/api/agent?page=' + nextPage;
          }
          if (page > 1) {
            prevUri = '/api/agent?page=' + prevPage;
          }
          res.json({
            items: items.slice(prevPage*PAGE_LENGTH, page*PAGE_LENGTH),
            meta: {
              page: page,
              nextUri: nextUri,
              prevUri: prevUri
            }
          });
        })
        .fail(function(err) {
          req._sails.log.error(err);
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
        req._sails.log.error(err);
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
      .then(function (items) {
        if (items.length === 1) {
          res.send(200, items[0]);         
        }
        else {
          req._sails.log.error(err);
          res.send(500, { error: 'An unexpected error occurred.' });
        }
      })
      .fail(function(err) {
        req._sails.log.error(err);
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
        req._sails.log.error(err);
        res.send(500, { error: 'An unexpected error occurred.' });
      });
  }

};


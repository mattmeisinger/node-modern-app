/**
 * SubscriptionController
 *
 * @description :: Server-side logic for managing subscriptions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Q = require('q');
var SubscriptionFacade = require('../BusinessService/SubscriptionFacade');
var PAGE_LENGTH = 2;

module.exports = {

  get: function(req, res) {
    var id = req.param('id');
    if (id > 0) {
      SubscriptionFacade.get(id)
        .then(function (item) {
          if (!item) res.send(400, { error: 'Bad request' });

          // Need to pass an agentId property to the browser so the agent
          // assignment can be changed.
          item.agentId = item.agent ? item.agent.id : null;

          res.json(item);
        })
        .fail(function (err) {
          req._sails.log.error(err);
          res.send(500, {error: 'An unexpected error occurred.'});
        });
    }
    else {
      var page = parseInt(req.param('page') || 1);
      SubscriptionFacade.getAll()
        .then(function(items) {
          // If no page is specified, return entire list of items
          if (!req.param('page')) {
            res.json({items: items});
            return;
          }
          var nextUri = null;
          var prevUri = null;
          var nextPage = page+1;
          var prevPage = page-1;
          if (items.length > page * PAGE_LENGTH) {
            nextUri = '/api/subscription?page=' + nextPage;
          }
          if (page > 1) {
            prevUri = '/api/subscription?page=' + prevPage;
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
      agent:         req.param('agentId'),
      customerId:    req.param('customerId'),
      parameter:     req.param('parameter'),
      value:         req.param('value'),
      operation:     req.param('operation'),
      notification:  req.param('notification')
    };

    SubscriptionFacade.save(item)
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
      id:            req.param('id'),
      agent:         req.param('agentId'),
      customerId:    req.param('customerId'),
      parameter:     req.param('parameter'),
      value:         req.param('value'),
      operation:     req.param('operation'),
      notification:  req.param('notification')
    };

    SubscriptionFacade.save(item)
      .then(function (items) {
        if (items.length === 1) {
          var item = items[0];

          // Need to pass an agentId property to the browser so the agent
          // assignment can be changed.
          item.agentId = item.agent;

          res.send(200, item);
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
    SubscriptionFacade.delete(id)
      .then(function () {
        res.send(200);
      })
      .fail(function(err) {
        req._sails.log.error(err);
        res.send(500, { error: 'An unexpected error occurred.' });
      });
  }

};


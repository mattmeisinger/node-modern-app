/**
 * ContactHistoryController
 *
 * @description :: Server-side logic for managing Contacthistories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Q = require('q');

module.exports = {

  'new': function(req, res) {
    Q.all([Customer.find(), Agent.find()])
      .spread(function(customers, agents) {
        res.view({
          agents: agents,
          customers: customers
        });
      })
      .catch(function(err) {
        return next(err);
      });
  },

  create: function(req, res) {
    var obj = {
      data:     req.param('data'),
      model:    req.param('model'),
      summary:  req.param('summary'),
      customer: req.param('customer'),
      agent:    req.param('agent')
    }

    ContactHistory
      .create(obj)
      .then(function(contactHistory) {
        res.redirect('/contactHistory/show/' + contactHistory.id);
      })
      .catch(function(err) {
        req.session.flash = {
          err: err
        }
        return res.redirect('/contactHistory/new');
      });
  },

  show: function(req, res, next) {
    ContactHistory
      .findOne(req.param('id'))
      .populate('customer')
      .populate('agent')
      .then(function(contactHistory) {
          res.view({ contactHistory: contactHistory });
      })
      .catch(function(err) {
        return next(err);
      });
  },

  index: function(req, res, next) {
    ContactHistory
      .find()
      .populate('customer')
      .populate('agent')
      .then(function(contactHistorys) {
          res.view({ contactHistorys: contactHistorys });
      })
      .catch(function(err) {
        return next(err);
      });
  },

  edit: function(req, res, next) {
    Q.all([
        ContactHistory
          .findOne(req.param('id'))
          .populate('customer')
          .populate('agent'),
        Customer.find(),
        Agent.find()
        ])
      .spread(function(contactHistory, customers, agents) {
        res.view({
          contactHistory: contactHistory,
          customers: customers,
          agents: agents,
        });
      })
      .catch(function(err) {
        return next(err);
      });
  },

  update: function(req, res, next) {
    var paramObj = {
      data: req.param('data'),
      model: req.param('model'),
      summary: req.param('summary'),
      customer: req.param('customer'),
      agent: req.param('agent')
    };

    ContactHistory
      .update(req.param('id'), paramObj)
      .then(function (contactHistory) {
      })
      .catch(function (err) {
        req.session.flash = {
          err: err
        };
      })
      .done(function() {
        return res.redirect('/contactHistory/edit/' + req.param('id'));
      });
  },

  destroy: function(req, res, next) {

    ContactHistory.findOne(req.param('id'), function foundContactHistory(err, contactHistory) {
      if (err) return next(err);

      if (!contactHistory) return next('ContactHistory doesn\'t exist.');

      ContactHistory.destroy(req.param('id'), function contactHistoryDestroyed(err) {
        if (err) return next(err);
      });

      res.redirect('/contactHistory');

    });
  }

};


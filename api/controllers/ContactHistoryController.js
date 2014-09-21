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
      })
      .done();
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
        res.redirect('/contactHistory/new');
      })
      .done();
  },

  show: function(req, res, next) {
    ContactHistory
      .findOne(req.param('id'))
      .populate('customer')
      .populate('agent')
      .then(function(contactHistory) {
        if (!contactHistory) throw new Error('ContactHistory doesn\'t exist.');
        res.view({ contactHistory: contactHistory });
      })
      .fail(function(err) {
        return next(err);
      })
      .done();
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
      })
      .done();
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
        if (!contactHistory) throw new Error('ContactHistory doesn\'t exist.');
        res.view({
          contactHistory: contactHistory,
          customers: customers,
          agents: agents,
        });
      })
      .fail(function(err) {
        return next(err);
      })
      .done();
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
      .fail(function(err) {
        req.session.flash = {
          err: err
        };
      })
      .done(function() {
        res.redirect('/contactHistory/edit/' + req.param('id'));
      });
  },

  destroy: function(req, res, next) {
    ContactHistory
      .findOne(req.param('id'))
      .then(function(contactHistory) {
        if (!contactHistory) throw new Error('ContactHistory doesn\'t exist.');
        return ContactHistory.destroy(req.param('id'));
      })
      .fail(function(err) {
        return next(err);
      })
      .done(function() {
        res.redirect('/contactHistory');
      });
  }

};


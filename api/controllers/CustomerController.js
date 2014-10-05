/**
 * CustomerController
 *
 * @description :: Server-side logic for managing Customers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Q = require('q');

module.exports = {

  'new': function(req, res) {
    Agent
      .find()
      .then(function(agents) {
        res.view({
          agents: agents
        });
      })
      .catch(function(err) {
        return next(err);
      })
      .done();
  },

  create: function(req, res) {
    var item = {
      firstName: req.param('firstName'),
      lastName:  req.param('lastName'),
      email:     req.param('email'),
      phone:     req.param('phone'),
      agent:     req.param('agent')
    }

    CustomerFacade.add(item, function success(item) {
      res.redirect('/customer/show/' + item.id);
    }, function error(err) {
      req.session.flash = { err: err };
      res.redirect('/customer/new');
    });
  },

  show: function(req, res, next) {
    Customer
      .findOne(req.param('id'))
      .populate('agent')
      .then(function(customer) {
        if (!customer) throw new Error('Customer doesn\'t exist.');
        res.view({
          customer: customer
        });
      })
      .fail(function(err) {
        return next(err);
      })
      .done();
  },

  index: function(req, res, next) {
    Customer.find()
      .populate('agent')
      .then(function(customers) {
        res.view({ customers: customers });
      })
      .catch(function(err) {
        return next(err);
      })
      .done();
  },

  edit: function(req, res, next) {
    Q.all([
        Customer
          .findOne(req.param('id'))
          .populate('agent'),
        Agent.find()
      ])
      .spread(function(customer, agents) {
        res.view({
          customer: customer,
          agents: agents,
        });
      })
      .catch(function(err) {
        return next(err);
      })
      .done();
  },

  update: function(req, res, next) {
    var paramObj = {
      firstName: req.param('firstName'),
      lastName:  req.param('lastName'),
      email:     req.param('email'),
      phone:     req.param('phone'),
      agent:     req.param('agent')
    }

    Customer
      .update(req.param('id'), paramObj)
      .fail(function(err) {
        console.log(err);
        req.session.flash = {
          err: err
        };
        res.redirect('/customer/edit/' + req.param('id'));
      })
      .done(function() {
        res.redirect('/customer/show/' + req.param('id'));
      });
  },

  destroy: function(req, res, next) {
    Customer
      .findOne(req.param('id'))
      .then(function(customer) {
        if (!customer) throw new Error('Customer doesn\'t exist.');
        return Customer.destroy(req.param('id'));
      })
      .fail(function(err) {
        return next(err);
      })
      .done(function() {
        res.redirect('/customer');
      });
  }

};


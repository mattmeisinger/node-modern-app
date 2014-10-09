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




  // 'new': function(req, res) {
  //   Agent
  //     .find()
  //     .then(function(agents) {
  //       res.view({
  //         agents: agents
  //       });
  //     })
  //     .catch(function(err) {
  //       return next(err);
  //     })
  //     .done();
  // },

  // create: function(req, res) {
  //   var item = {
  //     firstName: req.param('firstName'),
  //     lastName:  req.param('lastName'),
  //     email:     req.param('email'),
  //     phone:     req.param('phone'),
  //     agent:     req.param('agent')
  //   }

  //   CustomerFacade.add(item, function success(item) {
  //     res.redirect('/customer/show/' + item.id);
  //   }, function error(err) {
  //     req.session.flash = { err: err };
  //     res.redirect('/customer/new');
  //   });
  // },

  // show: function(req, res, next) {
  //   Customer
  //     .findOne(req.param('id'))
  //     .populate('agent')
  //     .then(function(customer) {
  //       if (!customer) throw new Error('Customer doesn\'t exist.');
  //       res.view({
  //         customer: customer
  //       });
  //     })
  //     .fail(function(err) {
  //       return next(err);
  //     })
  //     .done();
  // },

  // index: function(req, res, next) {
  //   Customer.find()
  //     .populate('agent')
  //     .then(function(customers) {
  //       res.view({ customers: customers });
  //     })
  //     .catch(function(err) {
  //       return next(err);
  //     })
  //     .done();
  // },

  // edit: function(req, res, next) {
  //   Q.all([
  //       Customer
  //         .findOne(req.param('id'))
  //         .populate('agent'),
  //       Agent.find()
  //     ])
  //     .spread(function(customer, agents) {
  //       res.view({
  //         customer: customer,
  //         agents: agents,
  //       });
  //     })
  //     .catch(function(err) {
  //       return next(err);
  //     })
  //     .done();
  // },

  // update: function(req, res, next) {
  //   var paramObj = {
  //     firstName: req.param('firstName'),
  //     lastName:  req.param('lastName'),
  //     email:     req.param('email'),
  //     phone:     req.param('phone'),
  //     agent:     req.param('agent')
  //   }

  //   Customer
  //     .update(req.param('id'), paramObj)
  //     .fail(function(err) {
  //       console.log(err);
  //       req.session.flash = {
  //         err: err
  //       };
  //       res.redirect('/customer/edit/' + req.param('id'));
  //     })
  //     .done(function() {
  //       res.redirect('/customer/show/' + req.param('id'));
  //     });
  // },

  // destroy: function(req, res, next) {
  //   Customer
  //     .findOne(req.param('id'))
  //     .then(function(customer) {
  //       if (!customer) throw new Error('Customer doesn\'t exist.');
  //       return Customer.destroy(req.param('id'));
  //     })
  //     .fail(function(err) {
  //       return next(err);
  //     })
  //     .done(function() {
  //       res.redirect('/customer');
  //     });
  // }

};


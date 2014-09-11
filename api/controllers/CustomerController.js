/**
 * CustomerController
 *
 * @description :: Server-side logic for managing Customers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  'new': function(req, res) {
    Agent.find().exec(function(err, agents) {
      if (err) return next(err);

      res.view({
        agents: agents
      });
    });
  },

  create: function(req, res) {

    var paramObj = {
      firstName: req.param('firstName'),
      lastName:  req.param('lastName'),
      email:     req.param('email'),
      phone:     req.param('phone'),
      agent:     req.param('agent')
    }

    // Create a User with the params sent from 
    // the sign-up form --> new.ejs
    Customer.create(paramObj, function customerCreated(err, customer) {

      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        }
        return res.redirect('/customer/new');
      }

      // res.json(customer);
      res.redirect('/customer/show/' + customer.id);

    });
  },

  show: function(req, res, next) {

    // TODO - These functions (find, findOne, etc.) return promises.  We should chain them instead of nesting them.
    Customer.findOne(req.param('id'), function foundCustomer(err, customer) {
      if (err) return next(err);
      if (!customer) return next();

      Agent.findOne(customer.agent, function foundAgent(err, agent) {

        if (err) return next(err);

        // res.json(customer);
        res.view({
          agent: agent,
          customer: customer
        });
      });
    });
  },

  index: function(req, res, next) {
    Customer.find(function foundCustomers(err, customers) {
      if (err) return next(err);

      Agent.find().exec(function(err, agents) {

        if (err) return next(err);

        customers.forEach(function(customer) {
          var agent,
              agentIndex;

          for (agentIndex = 0; agentIndex < agents.length; agentIndex++) {
            agent = agents[agentIndex];
            if (customer.agent === agent.id) {
              customer.agentName = agent.firstName + ' ' + agent.lastName;
            }
          }

        });
        
        res.view({
          customers: customers
        });
      });
    });
  },

  edit: function(req, res, next) {

    Customer.findOne(req.param('id'), function foundCustomer(err, customer) {
      if (err) return next(err);
      if (!customer) return next('customer doesn\'t exist.');

      Agent.find().exec(function(err, agents) {

        if (err) return next(err);

        res.view({
          agents: agents,
          customer: customer
        });
      });
    });
  },

  update: function(req, res, next) {

    var paramObj = {
      firstName: req.param('firstName'),
      lastName:  req.param('lastName'),
      email:     req.param('email'),
      phone:     req.param('phone'),
      agent:     req.param('agent')
    }

    Customer.update(req.param('id'), paramObj, function customerUpdated(err) {
      if (err) {
        console.log(err);

        req.session.flash = {
          err: err
        }

        return res.redirect('/customer/edit/' + req.param('id'));
      }

      res.redirect('/customer/show/' + req.param('id'));
    });
  },

  destroy: function(req, res, next) {

    Customer.findOne(req.param('id'), function foundCustomer(err, customer) {
      if (err) return next(err);

      if (!customer) return next('Customer doesn\'t exist.');

      Customer.destroy(req.param('id'), function customerDestroyed(err) {
        if (err) return next(err);
    });        

      res.redirect('/customer');

    });
  }
 

};


/**
 * ContactHistoryController
 *
 * @description :: Server-side logic for managing Contacthistories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  'new': function(req, res) {
    Customer.find().exec(function(err, customers) {
      if (err) return next(err);

      Agent.find().exec(function(err, agents) {
        if (err) return next(err);

        res.view({
          agents: agents,
          customers: customers
        });
      });
    });
  },

  create: function(req, res) {

    var paramObj = {
      data:     req.param('data'),
      model:    req.param('model'),
      summary:  req.param('summary'),
      customer: req.param('customer'),
      agent:    req.param('agent')
    }

    // Create a User with the params sent from
    // the sign-up form --> new.ejs
    ContactHistory.create(paramObj, function contactHistoryCreated(err, contactHistory) {

      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        }
        return res.redirect('/contactHistory/new');
      }

      // res.json(contactHistory);
      res.redirect('/contactHistory/show/' + contactHistory.id);

    });
  },

  show: function(req, res, next) {
    ContactHistory.findOne(req.param('id'), function foundContactHistory(err, contactHistory) {
      if (err) return next(err);
      if (!contactHistory) return next();

      Agent.findOne(contactHistory.agent, function foundAgent(err, agent) {
        if (err) return next(err);
        if (!agent) return next();

        Customer.findOne(contactHistory.customer, function foundCustomer(err, customer) {
          if (err) return next(err);
          if (!customer) return next();

          // res.json(contactHistory);
          res.view({
            contactHistory: contactHistory,
            agent: agent,
            customer: customer
          });
        });

      });
    });
  },

  index: function(req, res, next) {
    ContactHistory.find(function foundContactHistorys(err, contactHistorys) {
      if (err) return next(err);

      Agent.find().exec(function(err, agents) {
        if (err) return next(err);

        Customer.find().exec(function(err, customers) {
          if (err) return next(err);

          contactHistorys.forEach(function(contactHistory) {
            var agent,
                customer,
                agentIndex,
                customerIndex;

            // TODO - At the very least these should be maps
            for (agentIndex = 0; agentIndex < agents.length; agentIndex++) {
              agent = agents[agentIndex];
              if (parseInt(contactHistory.agent, 10) === parseInt(agent.id, 10)) {
                contactHistory.agentName = agent.firstName + ' ' + agent.lastName;
              }
            }

            for (customerIndex = 0; customerIndex < customers.length; customerIndex++) {
              customer = customers[customerIndex];
              if (parseInt(contactHistory.customer, 10) === parseInt(customer.id, 10)) {
                contactHistory.customerName = customer.firstName + ' ' + customer.lastName;
              }
            }

          });
          
          res.view({
            contactHistorys: contactHistorys
          });
        });
      });
    });
  },

  edit: function(req, res, next) {

    ContactHistory.findOne(req.param('id'), function foundContactHistory(err, contactHistory) {
      if (err) return next(err);
      if (!contactHistory) return next('contactHistory doesn\'t exist.');

      Agent.find().exec(function(err, agents) {
        if (err) return next(err);

        Customer.find().exec(function(err, customers) {
          if (err) return next(err);

          res.view({
            agents: agents,
            contactHistory: contactHistory,
            customers: customers
          });
        });
      });
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

    ContactHistory.update(req.param('id'), paramObj, function contactHistoryUpdated(err) {
      if (err) {
        console.log(err);

        req.session.flash = {
          err: err
        };

        return res.redirect('/contactHistory/edit/' + req.param('id'));
      }

      res.redirect('/contactHistory/show/' + req.param('id'));
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


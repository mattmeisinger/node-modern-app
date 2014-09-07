/**
 * CustomerController
 *
 * @description :: Server-side logic for managing Customers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  'new': function(req,res){
    res.view();    
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
    Customer.findOne(req.param('id'), function foundCustomer(err, customer) {
      if (err) return next(err);
      if (!customer) return next();

      // res.json(customer);
      res.view({
        customer: customer
      });
    });
  },

  index: function(req, res, next) {
    Customer.find(function foundCustomers(err, customers) {
      if (err) return next(err);
      
      res.view({
        customers: customers
      });
    });
  },

  edit: function(req, res, next) {

    Customer.findOne(req.param('id'), function foundCustomer(err, customer) {
      if (err) return next(err);
      if (!customer) return next('customer doesn\'t exist.');

      res.view({
        customer: customer
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


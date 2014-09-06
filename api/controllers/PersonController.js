/**
 * PersonController
 *
 * @description :: Server-side logic for managing People
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	
  'new': function(req,res){
    res.view();    
  },

  create: function(req, res) {

    var paramObj = {

      name: req.param('name'),

      email: req.param('email'),

      phone: req.param('phone'),

    }

    // Create a User with the params sent from 
    // the sign-up form --> new.ejs
    Person.create(paramObj, function personCreated(err, person) {

      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        }
        return res.redirect('/person/new');
      }

      // res.json(person);
      res.redirect('/person/show/' + person.id);

    });
  },

  show: function(req, res, next) {
    Person.findOne(req.param('id'), function foundPerson(err, person) {
      if (err) return next(err);
      if (!person) return next();

      // res.json(person);
      res.view({
        person: person
      });
    });
  },

  index: function(req, res, next) {
    Person.find(function foundPersons(err, persons) {
      if (err) return next(err);
      
      res.view({
        persons: persons
      });
    });
  },

  edit: function(req, res, next) {

    Person.findOne(req.param('id'), function foundPerson(err, person) {
      if (err) return next(err);
      if (!person) return next('person doesn\'t exist.');

      res.view({
        person: person
      });
    });
  },

  update: function(req, res, next) {

    var paramObj = {

      name: req.param('name'),

      email: req.param('email'),

      phone: req.param('phone'),

    }

    Person.update(req.param('id'), paramObj, function personUpdated(err) {
      if (err) {
        console.log(err);

        req.session.flash = {
          err: err
        }

        return res.redirect('/person/edit/' + req.param('id'));
      }

      res.redirect('/person/show/' + req.param('id'));
    });
  },

  destroy: function(req, res, next) {

    Person.findOne(req.param('id'), function foundPerson(err, person) {
      if (err) return next(err);

      if (!person) return next('Person doesn\'t exist.');

      Person.destroy(req.param('id'), function personDestroyed(err) {
        if (err) return next(err);
    });        

      res.redirect('/person');

    });
  }
 

};


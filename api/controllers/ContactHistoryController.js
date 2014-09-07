/**
 * ContactHistoryController
 *
 * @description :: Server-side logic for managing Contacthistories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  'new': function(req,res){
    res.view();
  },

  create: function(req, res) {

    var paramObj = {
      data:     req.param('data'),
      model:    req.param('model'),
      summary:  req.param('summary'),
      customer: req.param('customer')
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

      // res.json(contactHistory);
      res.view({
        contactHistory: contactHistory
      });
    });
  },

  index: function(req, res, next) {
    ContactHistory.find(function foundContactHistorys(err, contactHistorys) {
      if (err) return next(err);

      res.view({
        contactHistorys: contactHistorys
      });
    });
  },

  edit: function(req, res, next) {

    ContactHistory.findOne(req.param('id'), function foundContactHistory(err, contactHistory) {
      if (err) return next(err);
      if (!contactHistory) return next('contactHistory doesn\'t exist.');

      res.view({
        contactHistory: contactHistory
      });
    });
  },

  update: function(req, res, next) {

    var paramObj = {
      data: req.param('data'),
      model: req.param('model'),
      summary: req.param('summary'),
      customer: req.param('customer')
    }

    ContactHistory.update(req.param('id'), paramObj, function contactHistoryUpdated(err) {
      if (err) {
        console.log(err);

        req.session.flash = {
          err: err
        }

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


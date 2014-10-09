/**
 * ContactHistoryController
 *
 * @description :: Server-side logic for managing Contacthistories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var Q = require('q');
var ContactHistoryFacade = require('../BusinessService/ContactHistoryFacade');

module.exports = {

  get: function(req, res) {
    var id = req.param('id');
    if (id > 0) {
      ContactHistoryFacade.get(id)
        .then(function (item) {
          if (!item) res.send(400, { error: 'Bad request' });

          // Need to pass an agentId property to the browser so the agent
          // assignment can be changed.
          item.agentId = item.agent ? item.agent.id : null;
          item.customerId = item.customer ? item.customer.id : null;

          res.json(item);
        })
        .fail(function (err) {
          res.send(500, {error: 'An unexpected error occurred.'});
        });
    }
    else {
      ContactHistoryFacade.getAll()
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
      data:      req.param('data'),
      model:     req.param('model'),
      summary:   req.param('summary'),
      agent:     req.param('agentId'),
      customer:  req.param('customerId')
    };

    ContactHistoryFacade.save(item)
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
      data:      req.param('data'),
      model:     req.param('model'),
      summary:   req.param('summary'),
      agent:     req.param('agentId'),
      customer:  req.param('customerId')
    };

    ContactHistoryFacade.save(item)
      .then(function (item) {
        res.send(200, item);
      })
      .fail(function(err) {
        res.send(500, { error: 'An unexpected error occurred.' });
      });
  },

  delete: function(req, res) {
    var id = req.param('id');
    ContactHistoryFacade.delete(id)
      .then(function () {
        res.send(200);
      })
      .fail(function(err) {
        res.send(500, { error: 'An unexpected error occurred.' });
      });
  }

  // 'new': function(req, res) {
  //   Q.all([Customer.find(), Agent.find()])
  //     .spread(function(customers, agents) {
  //       res.view({
  //         agents: agents,
  //         customers: customers
  //       });
  //     })
  //     .catch(function(err) {
  //       return next(err);
  //     })
  //     .done();
  // },

  // create: function(req, res) {
  //   var item = {
  //     data:     req.param('data'),
  //     model:    req.param('model'),
  //     summary:  req.param('summary'),
  //     customer: req.param('customer'),
  //     agent:    req.param('agent')
  //   }

  //   ContactHistoryFacade.add(item, function success(item) {
  //     res.redirect('/contactHistory/show/' + item.id);
  //   }, function error(err) {
  //     req.session.flash = {
  //       err: err
  //     };
  //     res.redirect('/contactHistory/new');
  //   });
  // },

  // show: function(req, res, next) {
  //   ContactHistory
  //     .findOne(req.param('id'))
  //     .populate('customer')
  //     .populate('agent')
  //     .then(function(contactHistory) {
  //       if (!contactHistory) throw new Error('ContactHistory doesn\'t exist.');
  //       res.view({ contactHistory: contactHistory });
  //     })
  //     .fail(function(err) {
  //       return next(err);
  //     })
  //     .done();
  // },

  // index: function(req, res, next) {
  //   ContactHistory
  //     .find()
  //     .populate('customer')
  //     .populate('agent')
  //     .then(function(contactHistorys) {
  //         res.view({ contactHistorys: contactHistorys });
  //     })
  //     .catch(function(err) {
  //       return next(err);
  //     })
  //     .done();
  // },

  // edit: function(req, res, next) {
  //   Q.all([
  //       ContactHistory
  //         .findOne(req.param('id'))
  //         .populate('customer')
  //         .populate('agent'),
  //       Customer.find(),
  //       Agent.find()
  //       ])
  //     .spread(function(contactHistory, customers, agents) {
  //       if (!contactHistory) throw new Error('ContactHistory doesn\'t exist.');
  //       res.view({
  //         contactHistory: contactHistory,
  //         customers: customers,
  //         agents: agents,
  //       });
  //     })
  //     .fail(function(err) {
  //       return next(err);
  //     })
  //     .done();
  // },

  // update: function(req, res, next) {
  //   var paramObj = {
  //     data: req.param('data'),
  //     model: req.param('model'),
  //     summary: req.param('summary'),
  //     customer: req.param('customer'),
  //     agent: req.param('agent')
  //   };

  //   ContactHistory
  //     .update(req.param('id'), paramObj)
  //     .fail(function(err) {
  //       req.session.flash = {
  //         err: err
  //       };
  //     })
  //     .done(function() {
  //       res.redirect('/contactHistory/edit/' + req.param('id'));
  //     });
  // },

  // destroy: function(req, res, next) {
  //   ContactHistory
  //     .findOne(req.param('id'))
  //     .then(function(contactHistory) {
  //       if (!contactHistory) throw new Error('ContactHistory doesn\'t exist.');
  //       return ContactHistory.destroy(req.param('id'));
  //     })
  //     .fail(function(err) {
  //       return next(err);
  //     })
  //     .done(function() {
  //       res.redirect('/contactHistory');
  //     });
  // }

};


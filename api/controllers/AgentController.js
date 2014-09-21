/**
 * AgentController
 *
 * @description :: Server-side logic for managing Agents
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
      phone:     req.param('phone')
    }

    Agent
      .create(paramObj)
      .then(function(agent) {
        res.redirect('/agent/show/' + agent.id);
      })
      .catch(function(err) {
        req.session.flash = {
          err: err
        }
        res.redirect('/agent/new');
      })
      .done();
  },

  show: function(req, res, next) {
    Agent
      .findOne(req.param('id'))
      .populate('customers')
      .then(function(agent) {
        if (!agent) throw new Error('Agent doesn\'t exist.');
        res.view({ agent: agent });
      })
      .fail(function(err) {
        return next(err);
      })
      .done();
  },

  index: function(req, res, next) {
    Agent
      .find()
      .populate('customers')
      .then(function(agents) {
        res.view({ agents: agents });
      })
      .catch(function(err) {
        return next(err);
      })
      .done();
  },

  edit: function(req, res, next) {
    Agent
      .findOne(req.param('id'))
      .populate('customers')
      .then(function(agent) {
        if (!agent) throw new Error('Agent doesn\'t exist.');
        res.view({ agent: agent });
      })
      .fail(function(err) {
        return next(err);
      })
      .done();
  },

  update: function(req, res, next) {
    var paramObj = {
      firstName: req.param('firstName'),
      lastName:  req.param('lastName'),
      email:     req.param('email'),
      phone:     req.param('phone')
    }

    Agent
      .update(req.param('id'), paramObj)
      .fail(function(err) {
        req.session.flash = {
          err: err
        };
        res.redirect('/agent/edit/' + req.param('id'));
      })
      .done(function() {
        res.redirect('/agent/show/' + req.param('id'));
      });
  },

  destroy: function(req, res, next) {
    Agent.findOne(req.param('id'))
      .then(function (agent) {
        if (!agent) throw new Error('Agent doesn\'t exist.');
        return Agent.destroy(req.param('id'));
      })
      .fail(function(err) {
        return next(err);
      })
      .done(function() {
        res.redirect('/agent');
      });
  }
};


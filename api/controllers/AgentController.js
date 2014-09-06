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

      lastName: req.param('lastName'),

      email: req.param('email'),

      phone: req.param('phone'),

    }

    // Create a User with the params sent from 
    // the sign-up form --> new.ejs
    Agent.create(paramObj, function agentCreated(err, agent) {

      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
        }
        return res.redirect('/agent/new');
      }

      // res.json(agent);
      res.redirect('/agent/show/' + agent.id);

    });
  },

  show: function(req, res, next) {
    Agent.findOne(req.param('id'), function foundAgent(err, agent) {
      if (err) return next(err);
      if (!agent) return next();

      // res.json(agent);
      res.view({
        agent: agent
      });
    });
  },

  index: function(req, res, next) {
    Agent.find(function foundAgents(err, agents) {
      if (err) return next(err);
      
      res.view({
        agents: agents
      });
    });
  },

  edit: function(req, res, next) {

    Agent.findOne(req.param('id'), function foundAgent(err, agent) {
      if (err) return next(err);
      if (!agent) return next('agent doesn\'t exist.');

      res.view({
        agent: agent
      });
    });
  },

  update: function(req, res, next) {

    var paramObj = {

      firstName: req.param('firstName'),

      lastName: req.param('lastName'),

      email: req.param('email'),

      phone: req.param('phone'),

    }

    Agent.update(req.param('id'), paramObj, function agentUpdated(err) {
      if (err) {
        console.log(err);

        req.session.flash = {
          err: err
        }

        return res.redirect('/agent/edit/' + req.param('id'));
      }

      res.redirect('/agent/show/' + req.param('id'));
    });
  },

  destroy: function(req, res, next) {

    Agent.findOne(req.param('id'), function foundAgent(err, agent) {
      if (err) return next(err);

      if (!agent) return next('Agent doesn\'t exist.');

      Agent.destroy(req.param('id'), function agentDestroyed(err) {
        if (err) return next(err);
    });        

      res.redirect('/agent');

    });
  }
 

};



var AgentDS = require('../DataService/AgentDS'),
	CustomerDS = require('../DataService/CustomerDS'),
	ContactHistoryDS = require('../DataService/ContactHistoryDS'),
	Q = require('q');

module.exports = {
	agent: {
		getAll: function() {
			return AgentDS.getAll();
		},
		get: function(id) {
			return AgentDS.get(id);
		},
		save: function(item) {
			return AgentDS.save(item);
		},
		delete: function(id) {
			return AgentDS.delete(id);
		}
	},
	customer: {
		getAll: function() {
			return CustomerDS.getAll();
		},
		get: function(id) {
			return CustomerDS.get(id);
		},
		save: function(item) {

			// Put all validation check promises into an array. Then we can wait on all of these 
			// validation checks and catch an error if any one of the checks fails.
			var validationChecks = [];

			// Business rule: 
			// Agents in the USA, except those in TX and NY can have at most 5 customers.
			// If attempting to assign this customer to an agent who has 5 other customers already, throw error.
			if (item.agent) {
				console.log("Agent found.");
				var checkAgentCustomerLimit = AgentDS.get(item.agent)
					.then(function (agent) {
						console.log("Retrieved customer's agent, checking agent's customer limit.");
						if (agent.state !== 'TX' && agent.state !== 'NY') {
							var otherCustomers = 0;
							agent.customers.forEach(function () {
								if (this.id !== item.id) {
									otherCustomers++;
								}
							});
							if (otherCustomers >= 5) {
								console.log("Agent has " + otherCustomers + " other customers assigned to them (more than the limit of 5). Save cancelled.");
								throw 'Agent already has 5 other customers. Each agent can have at most 5 customers.';
							}
							else {
								console.log("Agent has " + otherCustomers + " other customers assigned to them (less than the limit of 5).");
							}
						}
					});
				validationChecks.push(checkAgentCustomerLimit);
			}

			// Business rule: 
			// A customer can only update their contact information once/week, unless their agent is in MN or CT.
			//var prevRecord = CustomerDS.get(id);

			// Business rule: 
			// Assigning a new agent to a customer is only allowed if there are no "contact records" less than 72 hours old.

			// Make sure all checks pass, then if they do, save the customer record.
			console.log('Checking all ' + validationChecks.length + ' validation checks relevant to this customer.');
			return Q.all(validationChecks) // TODO: This doesn't seem to be waiting until all the validation checks pass before it continues on
				.then(function () {
					console.log('All customer validation checks passed.');
					return CustomerDS.save(item);
				});
		},
		delete: function(id) {
			return CustomerDS.delete(id);
		}
	},
	contactHistory: {
		getAll: function() {
			return ContactHistoryDS.getAll();
		},
		get: function(id) {
			return ContactHistoryDS.get(id);
		},
		save: function(item) {
			return ContactHistoryDS.save(item);
		},
		delete: function(id) {
			return ContactHistoryDS.delete(id);
		}
	}
};
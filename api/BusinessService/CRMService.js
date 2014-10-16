
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
			// Their 'Contact Information' consists of their first name, last name, email, and phone, and does not
			// include their agent.
			if (item.id) {
				var checkUpdateContactInfoOnceAWeek = CustomerDS.get(item.id)
					.then(function(customer) {
						var contactChanged = false;
						if (item.firstName != customer.firstName ||
							item.lastName != customer.lastName ||
							item.email != customer.email ||
							item.phone != customer.phone) {
							contactChanged = true;
						}
						console.log("Contact info changed? : " + contactChanged.toString());

						if (contactChanged) {
							// If the contact info changed, set updatedContactInfoAt field to the current date 
							item.updatedContactInfoAt = new Date();

							// If customer updated less than 7 days ago, throw an error
							console.log("Checking if customer is updating their address more than once a week. Last updated their contact info at: " + customer.updatedContactInfoAt);
							var sevenDaysAgo = new Date(new Date().setDate((new Date().getDate())-7));
							console.log("Last updated: " + new Date(customer.updatedContactInfoAt));
							console.log("Seven days ago: " + sevenDaysAgo);
							if (new Date(customer.updatedContactInfoAt) > sevenDaysAgo) {
								console.log("Customer updated less than 7 days ago. Save cancelled.");
								throw "Customer cannot update their contact information more than once a week. Last updated: " + customer.updatedContactInfoAt;
							}
							else {
								console.log("Customer updated more than 7 days ago.");
							}
						}
					});
				validationChecks.push(checkUpdateContactInfoOnceAWeek);
			}


			// Business rule: 
			// Assigning a new agent to a customer is only allowed if there are no "contact records" less than 72 hours old.


			// Make sure all checks pass, then if they do, save the customer record.
			console.log('Checking all ' + validationChecks.length + ' validation checks relevant to this customer.');
			return Q.all(validationChecks)
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
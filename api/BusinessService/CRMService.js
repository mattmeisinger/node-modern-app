
var AgentDS = require('../DataService/AgentDS');
var CustomerDS = require('../DataService/CustomerDS');
var ContactHistoryDS = require('../DataService/ContactHistoryDS');

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
			return CustomerDS.save(item);
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
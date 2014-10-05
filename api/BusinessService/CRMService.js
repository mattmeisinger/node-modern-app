
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
		getAll: function(success, err) {
			CustomerDS.getAll(success, err);
		},
		get: function(id, success, err) {
			CustomerDS.get(id, success, err);
		},
		add: function(item, success, err) {
			CustomerDS.add(item, success, err);
		},
		update: function(item, success, err) {
			CustomerDS.update(item, success, err);
		},
		remove: function(id, success, err) {
			CustomerDS.remove(id, success, err);
		}
	},
	contactHistory: {
		getAll: function(success, err) {
			ContactHistoryDS.getAll(success, err);
		},
		get: function(id, success, err) {
			ContactHistoryDS.get(id, success, err);
		},
		add: function(item, success, err) {
			ContactHistoryDS.add(item, success, err);
		},
		update: function(item, success, err) {
			ContactHistoryDS.update(item, success, err);
		},
		remove: function(id, success, err) {
			ContactHistoryDS.remove(id, success, err);
		}
	}
};
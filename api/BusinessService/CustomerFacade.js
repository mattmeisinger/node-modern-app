
var CRMService = require('./CRMService');

module.exports = {
	getAll: function(success, err) {
		CRMService.customer.getAll(success, err);
	},
	get: function(id, success, err) {
		CRMService.customer.get(id, success, err);
	},
	add: function(item, success, err) {
		CRMService.customer.add(item, success, err);
	},
	update: function(item, success, err) {
		CRMService.customer.update(item, success, err);
	},
	remove: function(id, success, err) {
		CRMService.customer.remove(id, success, err);
	}
};

var CRMService = require('./CRMService');

module.exports = {
	getAll: function() {
		return CRMService.customer.getAll();
	},
	get: function(id) {
		return CRMService.customer.get(id);
	},
	save: function(item) {
		return CRMService.customer.save(item);
	},
	delete: function(id) {
		return CRMService.customer.delete(id);
	}
};
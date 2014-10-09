
var CRMService = require('./CRMService');

module.exports = {
	getAll: function() {
		return CRMService.contactHistory.getAll();
	},
	get: function(id) {
		return CRMService.contactHistory.get(id);
	},
	save: function(item) {
		return CRMService.contactHistory.save(item);
	},
	delete: function(id) {
		return CRMService.contactHistory.delete(id);
	}
};
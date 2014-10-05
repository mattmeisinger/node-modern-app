
var CRMService = require('./CRMService');

module.exports = {
	getAll: function(success, err) {
		CRMService.contactHistory.getAll(success, err);
	},
	get: function(id, success, err) {
		CRMService.contactHistory.get(id, success, err);
	},
	add: function(item, success, err) {
		CRMService.contactHistory.add(item, success, err);
	},
	update: function(item, success, err) {
		CRMService.contactHistory.update(item, success, err);
	},
	remove: function(id, success, err) {
		CRMService.contactHistory.remove(id, success, err);
	}
};
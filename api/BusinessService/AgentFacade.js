
var CRMService = require('./CRMService');

module.exports = {
	getAll: function() {
		return CRMService.agent.getAll();
	},
	get: function(id) {
		return CRMService.agent.get(id);
	},
	save: function(item) {
		return CRMService.agent.save(item);
	},
	delete: function(id) {
		return CRMService.agent.delete(id);
	}
};
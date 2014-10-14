
module.exports = {
	getAll: function() {
		return ContactHistory.find().populate('agent').populate('customer');
	},
	get: function(id) {
		return ContactHistory.findOne(id).populate('agent').populate('customer');
	},
	save: function(item) {
		if (item.id > 0) {
			return ContactHistory.update(item.id, item);
		}
		else {
			return ContactHistory.create(item);
		}
	},
	delete: function(id) {
		return ContactHistory.destroy(id);
	}
};
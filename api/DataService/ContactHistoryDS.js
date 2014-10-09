
module.exports = {
	getAll: function() {
    return CustomerHistory.find().populate('agent').populate('customer');
	},
	get: function(id) {
		return CustomerHistory.findOne(id).populate('agent').populate('customer');
	},
	save: function(item) {
		if (item.id > 0) {
			return CustomerHistory.update(item.id, item);
		}
		else {
			return CustomerHistory.create(item);
		}
	},
	delete: function(id) {
		return CustomerHistory.destroy(id);
	}
};
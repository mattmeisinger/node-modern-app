
module.exports = {
	getAll: function() {
		return Customer.find().populate('agent');
	},
	get: function(id) {
		return Customer.findOne(id).populate('agent');
	},
	save: function(item) {
		if (item.id > 0) {
			return Customer.update(item.id, item);
		}
		else {
			return Customer.create(item);
		}
	},
	delete: function(id) {
		return Customer.destroy(id);
	}
};
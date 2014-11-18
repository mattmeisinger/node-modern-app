module.exports = {
  getAll: function() {
    return Agent.find().populate('customers').populate('subscriptions');
  },
  get: function(id) {
    return Agent.findOne(id).populate('customers').populate('subscriptions');
  },
  save: function(item) {
    if (item.id > 0) {
      return Agent.update(item.id, item);
    }
    else {
      return Agent.create(item);
    }
  },
  delete: function(id) {
    return Agent.destroy(id);
  }
};

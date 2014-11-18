module.exports = {

  getAll: function() {
    return Subscription.find().populate('agent');
  },
  get: function(id) {
    return Subscription.findOne(id).populate('agent');
  },
  save: function(item) {
    if (item.id > 0) {
      return Subscription.update(item.id, item);
    }
    else {
      return Subscription.create(item);
    }
  },
  delete: function(id) {
    return Subscription.destroy(id);
  }

};

var CRMService = require('./CRMService');

module.exports = {

  getAll: function() {
    return CRMService.subscription.getAll();
  },
  get: function(id) {
    return CRMService.subscription.get(id);
  },
  save: function(item) {
    return CRMService.subscription.save(item);
  },
  delete: function(id) {
    return CRMService.subscription.delete(id);
  }

};

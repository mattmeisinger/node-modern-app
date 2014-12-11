module.exports = (function() {

  var comparators,
      permittedAgentProperties,
      permittedContactHistoryProperties,
      permittedCustomerProperties;

  comparators = {
    eq: function(first, second) {
      return first == second;
    },
    ne: function(first, second) {
      return first != second;
    },
    gt: function(first, second) {
      return first > second;
    },
    lt: function(first, second) {
      return first < second;
    },
    ge: function(first, second) {
      return first >= second;
    },
    le: function(first, second) {
      return first <= second;
    }
  };

  permittedAgentProperties = {
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    state: true
  };

  permittedContactHistoryProperties = {
    data: true,
    model: true,
    summary: true
  };

  permittedCustomerProperties = {
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    state: true,
    zip: true
  };

  function filterBase(items, filter, permittedProperties) {

    var comparator,
        filterParams,
        operand,
        propertyName;

    if (!filter) {
      return items;
    }

    filterParams = filter.match(/\S+/g);

    if (!filterParams || filterParams.length !== 3) {
      return items;
    }

    propertyName = filterParams[0];
    comparator = comparators[filterParams[1].toLowerCase()];
    operand = filterParams[2];

    if (!propertyName || !comparator || !operand || !permittedProperties[propertyName]) {
      return items;
    }

    return items.filter(function(item) {
      return comparator(item[propertyName], operand);
    });
  }

  function filterAgent(items, filter) {
    return filterBase(items, filter, permittedAgentProperties);
  }

  function filterContactHistory(items, filter) {
    return filterBase(items, filter, permittedContactHistoryProperties);
  }

  function filterCustomer(items, filter) {
    return filterBase(items, filter, permittedCustomerProperties);
  }

  return {
    filterAgent: filterAgent,
    filterContactHistory: filterContactHistory,
    filterCustomer: filterCustomer
  };

})();

var crmControllers = angular.module('crmControllers', []);


crmControllers.run(['$rootScope', function($rootScope) {
    $rootScope.formatName = function (person) {
      // This function takes an object that has firstName and lastName 
      // properties, and formats a string using them.
      return person.lastName + ', ' + person.firstName;
    };
  }]);

crmControllers.controller('AgentListCtrl', ['$scope', '$routeParams', '$http', 'Agent',
  function ($scope, $routeParams, $http, Agent) {
    $scope.page = 1;
    $scope.results = Agent.getAll({ page: $scope.page, $filter: $routeParams.$filter });
    $scope.delete = function (item) {
      var index = $scope.results.items.indexOf(item)
      Agent.delete({id: item.id}, function(success) {
        $scope.results.items.splice(index, 1);
      });
    };
    $scope.setPage = function (page) {
      $scope.page = page;
      $scope.results = Agent.getAll({page:$scope.page});
    };
  }]);

crmControllers.controller('AgentDetailCtrl', ['$scope', '$routeParams', '$location', '$http', 'Agent',
  function ($scope, $routeParams, $location, $http, Agent) {
    if ($routeParams.id > 0) {
      // Gets existing item
      $scope.item = Agent.get({id: $routeParams.id});
    }
    else {
      // New item
      $scope.item = {};
    }
    $scope.save = function (item) {
      if (item.id) {
        item.$save(
          function success() {
            $scope.messages = ['Record saved.'];
          }, 
          function error(e) {
            $scope.messages = ['Error saving: ' + e.data.error];
          }
        );
      }
      else {
        var a = Agent.saveNew(item,
          function success(item) {
            $location.path("/Agent/" + item.id);
          },
          function error(e) {
            $scope.messages = ['Error saving: ' + e.data.error];
          }
        );
      }
    };
  }]);

crmControllers.controller('SubscriptionListCtrl', ['$scope', '$http', 'Subscription',
  function ($scope, $http, Subscription) {
    $scope.page = 1;
    $scope.results = Subscription.getAll({page:$scope.page});
    $scope.delete = function (item) {
      var index = $scope.results.items.indexOf(item)
      Subscription.delete({id: item.id}, function(success) {
        $scope.results.items.splice(index, 1);
      });
    };
    $scope.setPage = function (page) {
      $scope.page = page;
      $scope.results = Subscription.getAll({page:$scope.page});
    };
  }]);

crmControllers.controller('SubscriptionDetailCtrl', ['$scope', '$routeParams', '$location', '$http', 'Subscription', 'Agent',
  function ($scope, $routeParams, $location, $http, Subscription, Agent) {
    $scope.agents        = Agent.getAll();
    $scope.parameters    = ['all', 'firstName', 'lastName', 'email', 'phone', 'state', 'zip'];
    $scope.operations    = ['all', 'create', 'update', 'destroy'];
    $scope.notifications = ['email', 'push'];

    if ($routeParams.id > 0) {
      // Gets existing item
      $scope.item = Subscription.get({id: $routeParams.id});
    }
    else {
      // New item
      $scope.item = {};
    }
    $scope.save = function (item) {
      if (item.id) {
        item.$save(
          function success() {
            $scope.messages = ['Record saved.'];
          },
          function error(e) {
            $scope.messages = ['Error saving: ' + e.data.error];
          }
        );
      }
      else {
        var a = Subscription.saveNew(item,
          function success(item) {
            $location.path("/Subscription/" + item.id);
          },
          function error(e) {
            $scope.messages = ['Error saving: ' + e.data.error];
          }
        );
      }
    };
  }]);

crmControllers.controller('CustomerListCtrl', ['$scope', '$routeParams', '$http', 'Customer',
  function ($scope, $routeParams, $http, Customer) {
    $scope.page = 1;
    $scope.results = Customer.getAll({ page: $scope.page, $filter: $routeParams.$filter });
    $scope.delete = function (item) {
      var index = $scope.results.items.indexOf(item)
      Customer.delete({id: item.id}, function(success) {
        $scope.results.items.splice(index, 1);
      });
    };
    $scope.setPage = function (page) {
      $scope.page = page;
      $scope.results = Customer.getAll({page:$scope.page});
    };
  }]);

crmControllers.controller('CustomerDetailCtrl', ['$scope', '$routeParams', '$location', 'Customer', 'Agent',
  function ($scope, $routeParams, $location, Customer, Agent) {
    $scope.agents = Agent.getAll();
    if ($routeParams.id > 0) {
      // Gets existing item
      $scope.item = Customer.get({id: $routeParams.id});
    }
    else {
      // New item
      $scope.item = {};
    }
    $scope.save = function (item) {
      if (item.id) {
        item.$save(
          function success(item) {
            $scope.messages = ['Record saved.'];
            // $scope.item.agentId = item.agent;
            // console.log(typeof item.agent);
            // console.log($scope.item.agentId);
          }, 
          function error(e) {
            $scope.messages = ['Error saving: ' + e.data.error];
          }
        );
      }
      else {
        var a = Customer.saveNew(item,
          function success(item) {
            $location.path("/Customer/" + item.id);
          },
          function error(e) {
            $scope.messages = ['Error saving: ' + e.data.error];
          }
        );
      }
    };
  }]);

crmControllers.controller('ContactHistoryListCtrl', ['$scope', '$routeParams', '$http', 'ContactHistory',
  function ($scope, $routeParams, $http, ContactHistory) {
    $scope.page = 1;
    $scope.results = ContactHistory.getAll({ page: $scope.page, $filter: $routeParams.$filter });
    $scope.delete = function (item) {
      var index = $scope.results.items.indexOf(item)
      ContactHistory.delete({id: item.id}, function(success) {
        $scope.results.items.splice(index, 1);
      });
    };
    $scope.setPage = function (page) {
      $scope.page = page;
      $scope.results = ContactHistory.getAll({page:$scope.page});
    };
  }]);

crmControllers.controller('ContactHistoryDetailCtrl', ['$scope', '$routeParams', '$location', 'ContactHistory', 'Agent', 'Customer',
  function ($scope, $routeParams, $location, ContactHistory, Agent, Customer) {
    $scope.agents = Agent.getAll();
    $scope.customers = Customer.getAll();
    console.log($scope.agents);
    console.log($scope.customers);
    if ($routeParams.id > 0) {
      // Gets existing item
      $scope.item = ContactHistory.get({id: $routeParams.id});
    }
    else {
      // New item
      $scope.item = {};
    }
    $scope.save = function (item) {
      if (item.id) {
        item.$save(
          function success() {
            $scope.messages = ['Record saved.'];
          }, 
          function error(e) {
            $scope.messages = ['Error saving: ' + e.data.error];
          }
        );
      }
      else {
        var a = ContactHistory.saveNew(item,
          function success(item) {
            $location.path("/ContactHistory/" + item.id);          
          },
          function error(e) {
            $scope.messages = ['Error saving: ' + e.data.error];
          }
        );
      }
    };
  }]);

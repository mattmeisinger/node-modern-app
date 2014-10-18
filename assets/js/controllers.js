var crmControllers = angular.module('crmControllers', []);

crmControllers.controller('AgentListCtrl', ['$scope', '$http', 'Agent',
  function ($scope, $http, Agent) {
    $scope.page = 1;
    $scope.results = Agent.getAll({page:$scope.page});
    $scope.delete = function (item) {
      item.$delete(function () {
        $scope.results = Agent.getAll({page:$scope.page});
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

crmControllers.controller('CustomerListCtrl', ['$scope', '$http', 'Customer',
  function ($scope, $http, Customer) {
    $scope.page = 1;
    $scope.results = Customer.getAll({page:$scope.page});
    $scope.delete = function (item) {
      item.$delete(function () {
        $scope.results = Customer.getAll({page:$scope.page});
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

crmControllers.controller('ContactHistoryListCtrl', ['$scope', '$http', 'ContactHistory',
  function ($scope, $http, ContactHistory) {
    $scope.page = 1;
    $scope.results = ContactHistory.getAll({page:$scope.page});
    $scope.delete = function (item) {
      item.$delete(function () {
        $scope.results = ContactHistory.getAll({page:$scope.page});
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
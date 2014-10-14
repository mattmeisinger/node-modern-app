var crmControllers = angular.module('crmControllers', []);

crmControllers.controller('AgentListCtrl', ['$scope', '$http', 'Agent',
  function ($scope, $http, Agent) {
  	$scope.items = Agent.getAll();
  	$scope.delete = function (item) {
  		item.$delete(function () {
        $scope.items = Agent.getAll();
      });
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
				item.$save();
			}
			else {
				var a = Agent.saveNew(item, function (item) {
					$location.path("/Agent/" + item.id);					
				});
			}
		};
  }]);

crmControllers.controller('CustomerListCtrl', ['$scope', '$http', 'Customer',
  function ($scope, $http, Customer) {
    $scope.items = Customer.getAll();
    $scope.delete = function (item) {
      item.$delete(function () {
        $scope.items = Customer.getAll();
      });
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
        item.$save();
      }
      else {
        var a = Customer.saveNew(item, function (item) {
          $location.path("/Customer/" + item.id);          
        });
      }
    };
  }]);

crmControllers.controller('ContactHistoryListCtrl', ['$scope', '$http', 'ContactHistory',
  function ($scope, $http, ContactHistory) {
    $scope.items = ContactHistory.getAll();
    $scope.delete = function (item) {
      item.$delete(function () {
        $scope.items = ContactHistory.getAll();
      });
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
        item.$save();
      }
      else {
        var a = ContactHistory.saveNew(item, function (item) {
          $location.path("/ContactHistory/" + item.id);          
        });
      }
    };
  }]);
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

crmControllers.controller('AgentDetailCtrl', ['$scope', '$routeParams', '$location', 'Agent',
  function ($scope, $routeParams, $location, Agent) {
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
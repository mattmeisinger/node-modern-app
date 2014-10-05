var crmApp = angular.module('crmApp', [
	'ngRoute',
	'crmControllers',
	'crmServices'
]);

crmApp.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/', {
				templateUrl: 'partials/index.html'
			}).
			when('/Agent', {
				templateUrl: 'partials/agent-list.html',
				controller: 'AgentListCtrl'
			}).
			when('/Agent/:id', {
				templateUrl: 'partials/agent-detail.html',
				controller: 'AgentDetailCtrl'
			}).
			otherwise({
				redirectTo: '/'
			});
	}]);
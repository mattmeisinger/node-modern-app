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
			when('/Customer', {
				templateUrl: 'partials/customer-list.html',
				controller: 'CustomerListCtrl'
			}).
			when('/Customer/:id', {
				templateUrl: 'partials/customer-detail.html',
				controller: 'CustomerDetailCtrl'
			}).
			when('/ContactHistory', {
				templateUrl: 'partials/contact-history-list.html',
				controller: 'ContactHistoryListCtrl'
			}).
			when('/ContactHistory/:id', {
				templateUrl: 'partials/cotact-history-detail.html',
				controller: 'ContactHistoryDetailCtrl'
			}).
			otherwise({
				redirectTo: '/'
			});
	}]);
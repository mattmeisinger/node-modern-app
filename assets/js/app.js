var crmApp = angular.module('crmApp', [
	'ngRoute',
	'crmControllers',
	'crmServices'
]);

crmApp.config(['$routeProvider', '$httpProvider',
	function($routeProvider, $httpProvider) {

		// Set up Angular client-side routes
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
				templateUrl: 'partials/contact-history-detail.html',
				controller: 'ContactHistoryDetailCtrl'
			}).
			otherwise({
				redirectTo: '/'
			});

		// Set up HTTP interceptor that will put a Nonce into all requests. This nonce
		// will be used by the server to only allow each nonce to be accepted and processed
		// once. This protects against replay attacks.
		//
		// See interceptor documentation on this page: 
		//		https://docs.angularjs.org/api/ng/service/$http
		//
		$httpProvider.interceptors.push(function() {
			return {
				'request': function(config) {
					// Add 'Nonce' to headers of this particular request
					config.headers['Nonce'] = helpers.GetNonce();
					return config;
				}
			};
		});
	}]);


// Helper functions
window.helpers = {

	GetNonce: function () {
		// Generate pseudo-GUID. This will work as a Nonce for the purposes of this application.
		// From SO answer: http://stackoverflow.com/a/2117523
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		});
	}

}
var crmServices = angular.module('crmServices', ['ngResource']);

crmServices.factory('Agent', ['$resource', 
	function ($resource) {
    return $resource('/agent/:id', {id:''}, {
    	'get':    {method:'GET'},
      'getAll': {method:'GET', isArray:true},
  		'save':   {method:'PUT', params:{id:'@id'}},
  		'saveNew':{method:'POST'},
      'get':    {method:'GET', params:{id:'@id'}},
      'delete': {method:'DELETE', params:{id:'@id'}}
    });
  }]);
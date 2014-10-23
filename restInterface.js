module.exports = (function() {
  'use strict';

  // TODO - Add support for pagination
  // TODO - Create either a single config file, provide commandline argument support, or allow setting through object returned by require.

  // TODO - Put baseUrl somewhere more appropriate
  var CLIENT_METHODS,
      baseUrl = 'http://localhost:1337/api',
      Client = require('node-rest-client').Client,
      client = new Client(),
      Q = require('q');

  CLIENT_METHODS = {
    'get': client.get,
    'post': client.post,
    'put': client.put,
    'delete': client.delete
  };

  function makeRestCall(params, nonce, message) {

    var args,
        clientMethod,
        id,
        url,
        deferred = Q.defer();

    args = {
      data: params.data,
      headers: {
        'Content-Type': 'application/json',
        nonce: nonce
      }
    };

    if (!params.model) {
      console.log('A model parameter is required to make a rest call');
      deferred.reject(new Error('A model parameter is required to make a rest call'));
      return deferred.promise;
    } else if (typeof params.method !== 'string') {
      console.log('The method parameter must be a string');
      deferred.reject(new Error('The method parameter must be a string'));
      return deferred.promise;
    }

    clientMethod = CLIENT_METHODS[params.method.toLowerCase()];

    if (!clientMethod) {
      console.log('The client method ' + params.method + ' is not valid');
      deferred.reject(new Error('The client method ' + params.method + ' is not valid'));
      return deferred.promise;
    }

    id = params.data ? params.data.id : undefined;
    url = id ? [baseUrl, params.model, id].join('/') : [baseUrl, params.model].join('/');

    console.log('Making request to [' + url + '] with the following data:');
    console.log(args);

    clientMethod(url, args, function(data, response) {

      if (response.statusCode === 200) {
        console.log(data);
        console.log('REST call successful.  Deleting message.');
        deferred.resolve(response);
      } else if (response.statusCode === 400 && data === 'Duplicate nonce received.') {
        console.log('Duplicate REST call.  Deleting message.');
        deferred.resolve(response);
      } else {
        console.log('Unrecognized response from REST call. NOT deleting message.  Message details below.');
        console.log('data returned:');
        console.log(data);
        console.log('response returned:');
        console.log(response);
        deferred.reject('Unrecognized response from REST call');
      }
    });

    return deferred.promise;
  }

  return {
    makeRestCall: makeRestCall
  };

})();

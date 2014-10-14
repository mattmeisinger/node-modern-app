/**
 * validateNonce
 *
 * @module      :: Policy
 * @description :: Checks the nonce on the current request to make sure it has never been used before
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  	var sails = req._sails;

	// Initialize empty list of used nonces if the list doesn't exist 
	// yet (i.e. this is the first request). This list is kept in-memory in
	// a global static variable.
	global.UsedNonces = global.UsedNonces || {};

	var nonce = req.headers['nonce'];
	if (nonce && global.UsedNonces[nonce] === undefined) {
		global.UsedNonces[nonce] = true;
		sails.log.debug('Received valid nonce: ' + nonce);
		sails.log.debug('nonces: ');
		sails.log.debug(global.UsedNonces);
		return next();
	}
	else if (!nonce) {
		sails.log.warn('No nonce header received. Request rejected.');
		return res.badRequest('Nonce required.');
	}
	else {
		sails.log.warn('Invalid nonce recived: ' + nonce + '. Request rejected.');
		return res.badRequest('Duplicate nonce received.');
	}

};

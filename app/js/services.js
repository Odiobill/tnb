(function() {
	'use strict';

	/* Services */

	angular.module('myApp.services', [])

	// put your services here!
	// .service('serviceName', ['dependency', function(dependency) {}]);
	.factory('Data', function(fbutil) {
		return { view: 0 };
	});
})();


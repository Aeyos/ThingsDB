/* -- Module declaration -- */
angular.module('core', ['localstorage','localdb']);
angular.module('index', []);
angular.module('tags', []);
angular.module('admin', []);

/* -- Module assembly -- */
angular.module('main', [
	'ngRoute',
	'core',
	'index',
	'tags',
	'admin'
]);
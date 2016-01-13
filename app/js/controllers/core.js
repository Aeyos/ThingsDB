angular.module('core').
controller('coreController', ['$scope', '$rootScope', '$location', 'localstorage', function ($scope, $rootScope, $location, localstorage) {
	/* -- Controller variables -- */
	/* -- Scope variables -- */
	$scope.appName = 'The Stuff Vault';
	/* -- Controller functions -- */
	/* -- Controller RUN -- */
	localstorage.initMain();
	/* -- Controller Events -- */
	$rootScope.$on('$routeChangeSuccess', function (args) {
		$scope.path = $location.path().split('/')[1];
		$scope.breadCrumb = [{name:'Home',url:'#'}];
		var pathFragments = $location.path().match(/(\w+)/g),
			paths = '#/';
		for(var i in pathFragments) {
			paths += pathFragments[i] + '/';
			$scope.breadCrumb.push({name:pathFragments[i].capitalize(),url:paths});
		}
	});
}]);
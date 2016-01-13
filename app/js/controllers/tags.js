angular.module('tags').
config(function($routeProvider) {
	$routeProvider
		.when('/tags', {
			templateUrl : 'app/html/tags.html',
			controller  : 'tagsController',
			resolve : {
				asyncData : ['localdb', function (localdb) {
					//return localdb.getAll('tags');
				}],
			}
		})
}).
controller('tagsController', ['$scope', 'asyncData', function ($scope, asyncData) {
	/* -- Controller variables -- */
	/* -- Scope variables -- */
	$scope.title = 'Tags';
	$scope.core = $scope.$parent;
	$scope.tags = asyncData;
	/* -- Controller functions -- */
	/* -- Controller -- */
	//$scope.core.database.getAll('tags', function (result) {$scope.tagData = result;});
}]);
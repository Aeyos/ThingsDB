angular.module('admin').
config(function($routeProvider) {
	$routeProvider
		.when('/admin', {
			templateUrl : 'app/html/admin.html',
			controller  : 'adminController',
			resolve : {
				asyncData : ['localdb', function (localdb) {
					//return localdb.getAll('admin');
				}],
			}
		})
}).
controller('adminController', ['$scope', 'asyncData', 'localstorage', function ($scope, asyncData, localstorage) {
	/* -- Controller variables -- */
	/* -- Scope variables -- */
	$scope.title = 'Admin';
	$scope.core = $scope.$parent;
	$scope.admin = asyncData;
	$scope.formValues = [];
	/* -- Controller functions -- */
	function refreshTables () {
		localstorage.getTableList(function (result) {
			$scope.tables = result;
		});
	}
	/* -- Scope functions -- */
	$scope.createTable = function (name, fields) {
		localstorage.createTable(name, fields);
		$scope.Name = $scope.Fields = '';
		refreshTables();
	}
	$scope.dropTable = function (name) {
		localstorage.dropTable(name);
		refreshTables();
	}
	$scope.masterReset = function () {
		if(confirm('Are you sure?')) {
			localstorage.hardReset();
			refreshTables();
		}
	},
	$scope.getAll = function (table) {
		localstorage.getAll(table, function (result) {
			console.log('got : ',result);
			$scope.selectedTableData = result;
		})
	}
	$scope.insertValue = function (table, data, fieldNames) {
		var obj = {};
		for(var i in fieldNames) {
			obj[fieldNames[i]] = data[i];
		}
		localstorage.insert(table, obj);
		$scope.formValues = {};
	},
	$scope.delete = function (table, id) {
		localstorage.remove(table, id, function (result) {
			refreshTables();
		});
	}
	/* -- Scope run -- */
	refreshTables();
}]);

// name, [fields]
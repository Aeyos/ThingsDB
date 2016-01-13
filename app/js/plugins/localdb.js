angular.module('localdb', []).
	factory('localdb', ['$q', function ($q) {
		// CROSS-BROWSER COMPATIBILITY
		window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
		window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
		if(!window.indexedDB) alert('Your browser is older than my gramps, go download a new one, scrub!');
		// LOCAL VARS
		var ready = false,
			db = null,
			tables = {},
			action_queue = [];
		setInterval(function(){
			while(action_queue.length > 0) {
				var action = action_queue.splice(0,1)[0];
				action.fn(action.data);
			}
		},500);
		// EXPOSED METHODS
		expose = {
			init : function (name, version, tables) {
				databases[name] = {
					ready : false,
					version : version,
					name : name,
					db : null,
					tables : {}
				}
				var request = window.indexedDB.open(name, version);
				request.onerror = function(event) {
					console.log("error: ");
				};
				request.onsuccess = function (event) {
					databases[name].db = request.result;
					databases[name].ready = true;
					console.log('onsuccess: '+ name);
				};
				request.onupgradeneeded = function(event) {
					var db = databases[name].db = event.target.result;
					/*for(var i in tables) {
						databases[name].tables[tables[i]] = db.createObjectStore("employee", {keyPath: "id"});
					}
					/*for (var i in employeeData) {
						objectStore.add(employeeData[i]);
					}*/
					/*databases[name].ready = true;*/
				}
			},
			initMain : function () {
				var request = window.indexedDB.open('TheStuffVault', 7);
				request.onerror = function(event) {
					console.error('initMainDB','onerror');
				};

				request.onsuccess = function(event) {
					window.adb = db = request.result;
					console.log('initMainDB','onsuccess');
				};

				request.onupgradeneeded = function(event) {
					window.adb = db = event.target.result;
					var handler;
					if(db.objectStoreNames.contains('admin_table')) { // admin_table exists
						handler = event.currentTarget.transaction.objectStore('admin_table');
					} else {
						handler = db.createObjectStore('admin_table', {keyPath: 'id', autoIncrement : true});
						handler.createIndex('name', 'name', {unique:true});
						handler.createIndex('fields', 'fields', {unique:true});
					}
				}
			},
			getTableList : function (callback) {
				if(db == null) {
					action_queue.push({
						fn : expose.getTableList,
						data : callback
					});
				} else {
					var handler = db.transaction('admin_table').objectStore('admin_table');
					var data = [];
					handler.openCursor().onsuccess = function(event) {
						var cursor = event.target.result;
						if (cursor) {
							data.push(cursor.value);
							cursor.continue();
						} else {
							callback(data);
						}
					};
				}
			},
			createTable : function (table, callback) {
				debugger;
				var request = window.indexedDB.open('TheStuffVault', 984986465465);
				request.onerror = function(event) {
					console.error('upgradeMainDB','onerror');
				};

				request.onsuccess = function(event) {
					window.adb = db = request.result;
					console.log('upgradeMainDB','onsuccess');
				};

				request.onupgradeneeded = function(event) {
					alert('xxxxxxxx');
					window.adb = db = event.target.result;
					alert('xxxxxxxx');
					var handler = db.createObjectStore(table.name, {keyPath: 'id'}),
						fields = table.fields.split(',');
					alert('xxxxxxxx');
					for(f in fields) {
						f = fields[f].split(':');
						handler.createIndex(f[0],f[0], {unique:f[1]=='true'?true:false});
					}
					alert('xxxxxxxx');
					callback('success');
				}
			}
		};
		return expose;
	}]);
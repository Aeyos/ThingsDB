angular.module('localstorage', []).
	factory('localstorage', function () {
		var storages = {},
			expose;
		window.storages = storages;
		function consolidate (obj, data) {
			if(!obj || !data) return;
			console.log('consolidating', obj, data);
			localStorage.setItem(obj, JSON.stringify(data));
		};
		expose = {
			initMain : function () {
				console.log('initMain');
				if(!window.localStorage) {
					alert('Your shit browser does not have localStorage')
				}
				try {
					storages.admin_table = JSON.parse(localStorage.getItem('admin_table'));
					if(!storages.admin_table) throw '';
				} catch (e) {
					storages.admin_table = {
						name:'admin',
						tableList: {}
					};
					localStorage.setItem('admin_table', JSON.stringify(storages.admin_table));
				}
				for(var i in storages.admin_table.tableList) {
					var tableName = storages.admin_table.tableList[i];
					storages[tableName.name] = JSON.parse(localStorage.getItem(tableName.name));
				}
			},
			getTableList : function (callback) {
				console.log('getTableList',storages.admin_table);
				var reval = [],
					tables = storages.admin_table.tableList;
				for(var i in tables) {
					reval.push({
						id: i,
						name: tables[i].name,
						count: 0,
						fields: tables[i].fields
					})
				}
				callback(reval);
			},
			createTable : function (name, fields) {
				console.log('createTable');
				if(localStorage.getItem(name)) {
					console.error('Table already exists');
					return;
				}
				if(!name || name.length <= 0) {
					console.error('Invalid name');
					return;
				}
				storages[name] = [];
				storages.admin_table.tableList[name] = {
					name:name,
					fields:fields.split(','),
					id_count : 0
				};
				consolidate('admin_table', storages.admin_table);
				consolidate(name, []);
			},
			dropTable : function (name) {
				console.log('dropTable : ',name);
				var tables = storages.admin_table.tableList,
					index = -1;
				for(var i in tables) {
					if(tables[i].name == name) {
						index = i;
					}
				}
				if(index == -1) {
					console.error('No table found with that name');
					return;
				}
				storages.admin_table.tableList.splice(index, 1);
				consolidate('admin_table', storages.admin_table);
				localStorage.removeItem(name);
			},
			hardReset : function () {
				storages = {};
				for(var i in localStorage) {
					try {
						localStorage.removeItem(i);
					} catch (e) {}
				}
				expose.initMain();
			},
			getAll : function (table, callback) {
				if(!storages[table]) {
					console.error('table not found : ', table);
				}
				callback(storages[table]);
			},
			insert : function (table, data) {
				if(!storages[table] || !data) {
					console.error('Error adding data',table, data);
				}
				data.id = storages.admin_table.tableList[table].id_count++;
				storages[table].push(data);
				consolidate('admin_table', storages.admin_table);
				consolidate(table, storages[table]);
			},
			remove : function (table, id, callback) {
				if(!storages[table]) {
					console.error('table not found : ', table);
				}
				for(var i in storages[table]) {
					if(storages[table][i].id == id) {
						storages[table].splice(i, 1);
					}
				}
				consolidate(table, storages[table]);
			}
		};
		return expose;
	});
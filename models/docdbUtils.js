var DocumentDBClient = require('documentdb').DocumentClient;

var DocDBUtils = {
	getOrCreateDatabase: function(client, databaseId, callback) {
		var querySpec = {
			query: 'SELECT * FROM root r WHERE r.id=@id',
			parameters: [{
				name: '@id',
				value: databaseId
			}]
		};

		client.queryDatabases(querySpec).toArray(function(err, results) {
			if (err) {
				callback(err);
			}

			if (!err && results.length === 0) {
				client.createDatabase({
						id: databaseId
					}, function(err, created) {
						callback(null, created);
					});
			} else {
				callback(null, results[0]);
			}
			});		
	},

	getOrCreateCollection: function(client, databaseLink, collectionId, collectionIndexingPolicy, callback) {
		var querySpec = {
			query: 'SELECT * FROM root r WHERE r.id=@id',
			parameters: [{
				name: '@id',
				value: collectionId
			}]
		};

		client.queryCollections(databaseLink, querySpec).toArray(function(err, results) {
			if (err) {
				callback(err);
			}

			if (!err && results.length === 0) {
				client.createCollection(databaseLink, {
						id: collectionId,
						indexingPolicy: collectionIndexingPolicy
					}, function(err, created) {
						if (err) {
							callback(err);
						}
						else
							callback(null, created);
					});
			} else {
				callback(null, results[0]);
			}
		});
	},

	/*
	Returns 
	-1 if permanent failure 
	0 if request was successful (Eg document already exists);
	timeout in ms if error was retry-able.*/
	checkHttpError: function(error, responseHeaders) {
		var waitTimeForErrors = 10;//in ms
		
		if(error.code == 429) {//we hit our throughput cap to the collection
			//console.log('Throttled - wait for ' + responseHeaders['x-ms-retry-after-ms'] + ' ms');
			if(responseHeaders['x-ms-retry-after-ms'] == undefined)
				return 1;
			else
				return responseHeaders['x-ms-retry-after-ms'];
		}	
		else if (error.code == 409) {
			//console.log('Document already exists');
			return 0;
		}
		else if (error.code == 'ECONNRESET'){
			console.log('ECONNRESET');
			return waitTimeForErrors;
		}
		else if (error.code == 'EADDRINUSE'){
			console.log('EADDRINUSE');
			return waitTimeForErrors;
		}
		else if (error.code == 'ETIMEDOUT'){
			console.log('ETIMEDOUT');
			return waitTimeForErrors;
		}
		else if (error.code == 'ESOCKETTIMEDOUT'){
			console.log('ESOCKETTIMEDOUT');
			return waitTimeForErrors;
		}
		else {
			return -1;
		}
	}
};

module.exports = DocDBUtils;

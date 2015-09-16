var async = require('async');
var fs = require('fs');

var docdbUtils = require('../docdbUtils');

function DataLoader(documentDBClient, databaseId, collectionId) {
	this.client = documentDBClient;
	this.databaseId = databaseId;
	this.collectionId = collectionId;
	
	this.database = null;
	this.collection = null;
}

DataLoader.prototype = {
	init: function(callback) {
		var self = this;
		docdbUtils.getOrCreateDatabase(self.client, self.databaseId, function(err, db) {
			if (err) {
				console.log("Error!");
				console.log(err);
				callback(err);//something went really wrong!
			} 
			else {
				self.database = db;
				docdbUtils.getOrCreateCollection(self.client, self.database._self, self.collectionId, null, function(err, coll) {
					if (err) {
						console.log("Error!");
						console.log(err);
						callback(err);//something went really wrong!
					} else {
						self.collection = coll;
						callback();
					}
				});
			}
		});
	},
	
	checkIfDataExists: function(callback) {
		var self = this;
		
		var querySpec = {
			query: 'SELECT * FROM root r',
			parameters: undefined
		};
		
		self.client.queryDocuments(self.collection._self, querySpec).toArray(function(err, results) {
			if (err) {
				console.log("Error!");
				callback(err);//something went really wrong!!
			} else {
				callback(null, (results.length > 0));
			}
		});
	},
	
	loadSampleData : function (callback) {
		var self = this;
		
    	var data = fs.readFileSync('./models/data/sampleData.json');   
    	var jsonDataArray = JSON.parse(data);
		
		self.checkIfDataExists(function(err, dataExists) {
			if(err || dataExists){
				callback(err);
				return;
			}
			//loading data
			console.log('loading data...');
			async.eachSeries(jsonDataArray, 
				self.addDataObj.bind(self), 
				function(err){
					if(err)
						throw(err);
					callback();
				});
		})
	},
	
	addDataObj: function(dataObj, callback) {
		var self = this;
	
		self.client.createDocument(self.collection._self, dataObj, function(err, doc, responseHeaders) {
			if (err) {
				var status = docdbUtils.checkHttpError(err, responseHeaders);
				if(status == 0) {
					callback();
				}
				else if(status == -1) {
					console.log("Error!");
					console.log(err);
					console.log('Response headers:');
					console.log(responseHeaders);
					callback(err);
				} 
				else if(status > 0) {
					var t = setTimeout(self.addNewevent.bind(self), status, event, callback);
				}
				else {
					console.log('Error! Unexpected status = ' + status);
					console.log(err);
					console.log('Response headers:');
					console.log(responseHeaders);
					callback(err); //something went really wrong!
				}
			} else {
				callback();
			}
		});
	},
};

module.exports = DataLoader;

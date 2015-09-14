var docdbUtils = require('./docdbUtils');

function EventsDbDao(documentDBClient, databaseId, collectionId) {
	this.client = documentDBClient;
	this.databaseId = databaseId;
	this.collectionId = collectionId;
	
	this.database = null;
	this.collection = null;
}

EventsDbDao.prototype = {
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
	
	query: function(querySpec, callback) {
		var self = this;
		self.client.queryDocuments(self.collection._self, querySpec).toArray(function(err, results) {
			if (err) {
				console.log("Error!");
				callback(err);//something went really wrong!!
			} else {
				callback(null, results);
			}
		});
	},
	
	addEvent: function(event, callback) {
		var self = this;
	
		self.client.createDocument(self.collection._self, event, function(err, doc, responseHeaders) {
			if (err) {
				var status = docdbUtils.checkHttpError(err, responseHeaders);
				if(status == 0) {
					callback(event);
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
				callback(doc);
			}
		});
	},
	
	updateEvent: function(newEvent, callback) {
		var self = this;

		self.getDevice(newEvent.id, function(err, device) {
			if (err) {
				console.log("Error!");
				console.log(err);
				callback(err);//something went really wrong!
			} else {
				self.client.replaceDocument(device._self, newEvent, function(err, replaced, responseHeaders) {
					if (err) {
						var status = docdbUtils.checkHttpError(err, responseHeaders);
						if(status == 0) {
							callback(null);
						}
						else if(status == -1) {
							console.log("Error!");
							console.log(err);
							console.log('Response headers:');
							console.log(responseHeaders);
							callback(err);
						} 
						else if(status > 0) {
							var t = setTimeout(self.updateDeviceDoc.bind(self), status, newEvent, callback);
						}
						else {
							console.log('Error! Unexpected status = ' + status);
							console.log(err);
							console.log('Response headers:');
							console.log(responseHeaders);
							callback(err); //something went really wrong!
						}
					} else {
						callback(null);
					}
				});
			}
		});
	},
	
	getEvent: function(eventId, callback) {
		var self = this;
	
		var querySpec = {
			query: 'SELECT * FROM root r WHERE r.id=@id',
			parameters: [{
						 name: '@id',
						 value: eventId
					 }]
		};
	
		self.query(querySpec, function(err, results) {
			if (err) {
				callback(err);
			} else {
				callback(null, results[0]);
			}
		});
	},
	
	getAllEvents: function(callback) {
		var self = this;
      	// 'SELECT * FROM events e  WHERE ST_DISTANCE(e.Location, { "type": "Point", "coordinates": [-122.19, 47.36] }) < 100000 AND e.date BETWEEN 1442545200 AND 1446346800'
		  
		var querySpec = {
			query: 'SELECT * FROM root r',
			parameters: undefined
		};
	
		self.query(querySpec, function(err, results) {
			if (err) {
				callback(err);
			} else {
				callback(null, results[0]);
			}
		});
	}
};

module.exports = EventsDbDao;

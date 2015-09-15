var docdbUtils = require('./docdbUtils');

function CommentsDbDao(documentDBClient, databaseId, collectionId) {
	this.client = documentDBClient;
	this.databaseId = databaseId;
	this.collectionId = collectionId;
	
	this.database = null;
	this.collection = null;
}

CommentsDbDao.prototype = {
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
	
	getComment: function(commentId, callback) {
		var self = this;
	
		var querySpec = {
			query: 'SELECT * FROM root r WHERE r.commentId=@commentId AND r.type="comment"',
			parameters: [{
						 name: '@commentId',
						 value: commentId
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
	
	addComment: function(comment, callback) {
		var self = this;
	
		self.client.createDocument(self.collection._self, comment, function(err, doc, responseHeaders) {
			if (err) {
				var status = docdbUtils.checkHttpError(err, responseHeaders);
				if(status == 0) {
					callback(comment);
				}
				else if(status == -1) {
					console.log("Error!");
					console.log(err);
					console.log('Response headers:');
					console.log(responseHeaders);
					callback(err);
				} 
				else if(status > 0) {
					var t = setTimeout(self.addNewcomment.bind(self), status, comment, callback);
				}
				else {
					console.log('Error! Unexpected status = ' + status);
					console.log(err);
					console.log('Response headers:');
					console.log(responseHeaders);
					callback(err); //something went really wrong!
				}
			} else {
				callback(comment);
			}
		});
	},
	
	updateComment: function(newComment, callback) {
		var self = this;

		self.getComment(newComment.id, function(err, comment) {
			if (err) {
				console.log("Error!");
				console.log(err);
				callback(err);//something went really wrong!
			} else {
				self.client.replaceDocument(comment._self, newComment, function(err, replaced, responseHeaders) {
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
							var t = setTimeout(self.updateDeviceDoc.bind(self), status, newComment, callback);
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
	
	getCommentsByEventId: function(eventId, callback) {
		var self = this;
	
		var querySpec = {
			query: 'SELECT * FROM root r WHERE r.eventid=@eventId AND r.type="comment"',
			parameters: [{
						 name: '@eventId',
						 value: eventId
					 }]
		};
	
		self.query(querySpec, function(err, results) {
			if (err) {
				callback(err);
			} else {
				callback(null, results);
			}
		});
	}
};

module.exports = CommentsDbDao;

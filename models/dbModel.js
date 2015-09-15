/* global DocumentDBConnPolicy */
/* global DocumentDBClient */

var config = require('./dbConfig');

var DocumentDBClient = require('documentdb').DocumentClient;

/* All data access objects (DAOs) for this model go below.
Paths are defined from the roo (app.js)  directory)*/

var CommentsDbDao = require('./CommentsDbDao');
var EventsDbDao = require('./EventsDbDao');

function DbModel() {
}

DbModel.prototype = {
	init : function(callback) {
		console.log("DB host = " + config.host);
		
		var completionCount = 0;
		var completeCount = 2;
		
		this.dbClient = new DocumentDBClient(config.host, {
			masterKey: config.authKey
		});
		
		this.eventsDbDao = new EventsDbDao(this.dbClient, config.databaseId, config.eventCollection);
		this.eventsDbDao.init(function(err) {
			if(err)
				throw(err);
			console.log("EventDbDao initialized");
			completionCount++;
			if(completionCount == completeCount)
				callback();
		});
		
		this.commentsDbDao = new CommentsDbDao(this.dbClient, config.databaseId, config.commentCollection);
		this.commentsDbDao.init(function(err) {
			if(err)
				throw(err);
			console.log("CommentDbDao initialized");
			completionCount++;
			if(completionCount == completeCount)
				callback();
		});
	}
};

module.exports = DbModel;

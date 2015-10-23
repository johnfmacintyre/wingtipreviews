/* global DocumentDBConnPolicy */
/* global DocumentDBClient */
var DocumentDBClient = require('documentdb').DocumentClient;

var config = require('./dbConfig');

/* All data access objects (DAOs) for self model go below.
Paths are defined from the roo (app.js)  directory)*/

var CommentsDbDao = require('./CommentsDbDao');
var EventsDbDao = require('./EventsDbDao');
var DataLoader = require('./data/dataLoader')

function DbModel() {
}

DbModel.prototype = {
	init: function (callback) {
		var self = this;

		console.log("DB host = " + config.host);

		var completionCount = 0;
		var completeCount = 2;

		self.dbClient = new DocumentDBClient(config.host, {
			masterKey: config.authKey
		});

		self.eventsDbDao = new EventsDbDao(self.dbClient, config.databaseId, config.eventCollection);
		self.eventsDbDao.init(function (err) {
			if (err)
				throw (err);
			console.log("EventDbDao initialized");
			completionCount++;
			//BUGBUG - prevents race if events and comments point to the same collection
			//if(completionCount == completeCount)
			//	callDataLoader();
			loadOtherCollections();
		});
		
		//BUGBUG - prevents race if events and comments point to the same collection
		function loadOtherCollections() {
			self.commentsDbDao = new CommentsDbDao(self.dbClient, config.databaseId, config.commentCollection);
			self.commentsDbDao.init(function (err) {
				if (err)
					throw (err);
				console.log("CommentDbDao initialized");
				completionCount++;
				if (completionCount == completeCount)
					callDataLoader();
			});
		}

		function callDataLoader() {
			//BUGBUG - using event collection to laod data - abstraction leak
			self.dataLoader = new DataLoader(self.dbClient, config.databaseId, config.eventCollection);
			self.dataLoader.init(function (err) {
				if (err)
					throw (err);

				self.dataLoader.loadSampleData(function (err) {
					if (err)
						throw (err);
					callback();
				});
			});
		}
	}
};

module.exports = DbModel;

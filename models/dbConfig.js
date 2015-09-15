/* global process */
var config = {};

config.host = process.env.DOCDB_HOST;
config.authKey = process.env.DOCDB_AUTH_KEY;
config.databaseId = process.env.DOCDB_DATABASE;

config.eventCollection = process.env.DOCDB_COLLECTION;
config.commentCollection = process.env.DOCDB_COLLECTION;

module.exports = config;

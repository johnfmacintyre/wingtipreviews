/* global process */
var config = {};

config.host = process.env.DOCDB_HOST;
config.authKey = process.env.DOCDB_AUTH_KEY;
config.databaseId = process.env.DOCDB_DATABASE;

config.eventCollection = process.env.DOCDB_COLLECTION;
config.commentCollection = process.env.DOCDB_COLLECTION;

config.eventHubNamespace = process.env.EVENT_HUB_NAMESPACE;
config.eventHubEntityPath = process.env.EVENT_HUB_ENTITY_PATH;
config.eventHubSharedAccessKeyName = process.env.EVENT_HUB_SHARED_ACCESS_KEY_NAME;
config.eventHubSharedAccessKey = process.env.EVENT_HUB_SHARED_ACCESS_KEY;

module.exports = config;

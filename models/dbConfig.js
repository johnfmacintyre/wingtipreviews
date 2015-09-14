/* global process */
var config = {};

//config.host = process.env.AZURE_DOCUMENTDB_ACCOUNT || "https://obiwan-test.documents.azure.com:443/";
//config.authKey = process.env.AZURE_DOCUMENTDB_ACCOUNT_ACCESS_KEY|| "RzYGHgH/jlxrqKJ6UC+ZbGeV3VetdLFdURiga+uMGUMXoRo8B36LeQHmvFHlyoC2RM5DD7g+05qMZcbt5QPQsw==";

config.host = process.env.DOCDB_HOST;
config.authKey = process.env.DOCDB_AUTH_KEY;
config.databaseId = process.env.DOCDB_DATABASE;

config.eventCollection = process.env.DOCDB_COLLECTION;
config.commentCollection = process.env.DOCDB_COLLECTION;

module.exports = config;

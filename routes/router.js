/* global dbModel */
/*jshint node:true */
"use strict";

var express = require('express');
//var router = express.Router();
var app = express();

var EventsRoute = require('./eventsRoute');
var CommentsRoute = require('./commentsRoute');

var events = new EventsRoute(dbModel.eventsDbDao);
var comments = new CommentsRoute(dbModel.commentsDbDao);

// //Get list of events
// app.get('/events/', function() {
//   console.log(events);
// });

//Get list of events
app.get('/events/', events.getList.bind(events));

// Get reviews for a specific event.
app.get('/events/:id/comments', comments.getCommentsByEventId.bind(comments));

// Write a review for a specific event.
app.post('/events/:id/comments', comments.writeCommentsByEventId.bind(comments));


module.exports = app;

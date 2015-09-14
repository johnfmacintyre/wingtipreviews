/*jshint node:true */
"use strict";

var db = require('../models/db');
var express = require('express');
//var router = express.Router();
var app = express();

// Get a list by events by location and time.
app.get('/events/', function (req, res) {
  // TODO: Populate data from database.
  /*
    // Example Query
    SELECT *
    FROM events e
    WHERE ST_DISTANCE(e.Location, { "type": "Point", "coordinates": [-122.19, 47.36] }) < 100000
      AND e.date BETWEEN 1442545200 AND 1446346800
   */
  res.json([
    {
      "id": "e33514c6-13b6-497a-9bc9-2cd2e053f5b5",
      "date": 1442545200,
      "artist": {
        "id": "3cec0a0b-6efa-4c7e-a82c-301aec68e3a5",
        "name": "Ratatat"
      },
      "venue": {
        "id": "a1a069c2-b5bf-422b-8524-7ec41ab41c70",
        "name": "The Showbox",
        "Location": {
          "type": "Point",
          "coordinates": [
            47.608414,
            -122.339704
          ]
        }
      },
      "rating": 5
    },
    {
      "id": "e593646e-2cee-4d8c-a595-824dc0785176",
      "date": 1446346800,
      "artist": {
        "id": "c8ad4281-bd17-4b2a-8a99-515f83bb1fcd",
        "name": "Beats Antique"
      },
      "venue": {
        "id": "87f51842-8306-4caa-bbf2-e244e2df14e5",
        "name": "Showbox SODO",
        "Location": {
          "type": "Point",
          "coordinates": [
            47.587925,
            -122.334207
          ]
        }
      },
      "rating": 5
    }
  ]);
});

// Get reviews for a specific event.
app.get('/events/:id', function (req, res) {
  // TODO: Get review data to database.
  res.json({ "hello": "world" });
});

// Write a review for a specific event.
app.post('/events/:id', function (req, res) {
  // TODO: Store review data to database.
  res.json({ "hello": "world" });
});

module.exports = app;

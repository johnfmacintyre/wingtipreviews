/*jshint node:true */
"use strict";

function CommentsRoute(commentsDbDao) {
  this.commentsDbDao = commentsDbDao;
}

CommentsRoute.prototype = {
  writeCommentsByEventId: function (req, res, next) {
    var self = this;
    var eventId = req.params.id;
    var venueId = req.body.venueId;
    var artistId = req.body.artistId;
    var user = self.getCurrentUser();
    var comment = req.body.comment;
    
    // DEMO: Retrieve the rating passed in by the POST request.
    var rating = parseInt(req.body.rating);
    // DEMO: Retrieve the user location
    var location = self.getCurrentLocation();

    var commentDoc = {
      "eventId": eventId,
      "type": "comment",
      "venueId": venueId,
      "artistId": artistId,
      "feedback": comment,
      "user": user
      // DEMO: Place the rating in to the DocumentDB document.
      , "rating": rating
      // DEMO: Add location to comment document
      , "location": location
    }

    self.commentsDbDao.addComment(commentDoc, function (err, commentDoc) {
      if (err) {
        next(err);
      }
      else
        res.send(commentDoc);
    });
  },
  
  getCommentsByEventId: function (req, res, next) {
    var self = this;
    var eventId = req.params.id;

    self.commentsDbDao.getCommentsByEventId(eventId, function (err, commentsList) {
      if (err) {
        next(err);
      }
      else
        res.send(commentsList);
    });
  },
  
  getCurrentUser: function() {
    return "John Macintyre";
  },
    
  getCurrentLocation: function() {
    return {
	  "type":"Point",
	  "coordinates":[-122.3491,47.6204]
	  }
  }
};

module.exports = CommentsRoute;


/*jshint node:true */
"use strict";

function CommentsRoute(commentsDbDao) {
  this.commentsDbDao = commentsDbDao;
}

CommentsRoute.prototype = {
  writeCommentsByEventId: function (req, res, next) {
    var self = this;
    var eventId = req.params.id;
    var user = self.getCurrentUser();
    var comment = req.body.comment;
    var rating = parseInt(req.body.rating);

    var commentDoc = {
      "type": "comment",
      "eventid": eventId,
      "commentText": comment,
      "user": user,
      "rating": rating
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
    return {
		"id": "561f8d0e-bbae-47a5-b84e-37a1c183b8f6",
		"firstname": "John",
		"lastname": "Macintyre"
    }
  }
};

module.exports = CommentsRoute;


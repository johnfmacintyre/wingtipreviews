/*jshint node:true */
"use strict";

function CommentsRoute(commentsDbDao) {
  this.commentsDbDao = commentsDbDao;
}

CommentsRoute.prototype = {
  getCommentsByEventId: function(req, res, next) {
    var self = this;
    var eventId = req.params.id;
    
    self.commentsDbDao.getCommentsByEventId(eventId, function(err, commentsList) {
      if(err) {
        next(err);
      }
      else
        res.send(commentsList);
      });
  },
    
  writeCommentsByEventId: function(req, res, next) {
    var self = this;
    var eventId = req.params.id;
    var comment = req.body;
    
    self.commentsDbDao.writeCommentsByEventId(eventId, comment, function(err, eventsList) {
      if(err) {
        next(err);
      }
      else
        res.end();
      });
  }  
};

module.exports = CommentsRoute;


/*jshint node:true */
"use strict";

function EventsRoute(eventsDbDao) {
  this.eventsDbDao = eventsDbDao;
}

EventsRoute.prototype = {
  getList: function(req, res, next) {
      var self = this;
      
      self.eventsDbDao.getAllEvents(function(err, eventsList) {
        if(err) {
          next(err);
        }
        else
          res.send(eventsList);
      });
  }
};

module.exports = EventsRoute;

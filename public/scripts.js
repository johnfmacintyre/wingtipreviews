/* global $ */
"use strict";

// On Page Load
$(document).ready(function () {
	// Install Raty on Review Modal.
	$('#ratingRaty').raty({ starType: 'i' });
	
	// Get and render events
	WingTipReviews.getEvents(WingTipReviews.renderEvents);
});

// App Logic
function WingTipReviews() { }

WingTipReviews.getEvents = function (callback) {
	console.log("test");
	$.get('/api/events/', callback);
}

WingTipReviews.renderEvents = function (events) {
	var i = 0;
	var eventContainer = $('#eventContainer');

	// Empty the parent event div (remove loading spinner).
	eventContainer.empty();
	
	// Append each event
	for (i = 0; i < events.length; i++) {
		eventContainer.append(WingTipReviews.renderEvent(events[i]));
	}
}

WingTipReviews.renderEvent = function (event) {
	var eventDate = new Date(event.date);

	var eventHtml = [
		'<div class="cons-info">',
		'  <div class="cons-date">',
		'    <span class="cons-mon">' + WingTipReviews.monthNames[eventDate.getMonth()] + '</span>',
		'    <span class="date-num">' + eventDate.getDate() + '</span>',
		'    <span class="cons-day for-desktop">' + WingTipReviews.dayNames[eventDate.getDay()] + '</span>',
		'    <span class="cons-fullday for-mobile">' + WingTipReviews.dayNames[eventDate.getDay()] + '</span>',
		'  </div>',
		'  <div class="cons-text">',
		'    <h3>' + event.artist.name + '</h3>',
		'    <p>' + event.venue.name + '</p>',
		'  </div>',
		'  <div class="find-seat">',
		'    <a href="#" class="find-seats-link" data-toggle="modal" data-target="#reviewModal" data-backdrop="static" data-keyboard="false"><i class="fa fa-pencil"></i> Review</a>',
		'  </div>',
		'</div>'
	].join('\n');

	return eventHtml;
}

// CONSTANTS
WingTipReviews.monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
WingTipReviews.dayNames = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

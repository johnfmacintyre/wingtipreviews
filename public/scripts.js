/* global $ */
/* global document */
"use strict";

// On Page Load
$(document).ready(function () {
	// Install Raty on Review Modal.
	$('#review-rating').raty({ starType: 'img' });
	
	// Register the Add Review - Submit button.
	$('#newReview').on('click', WingTipReviews.submitReviewButtonHandler);
	
	// Get and render events
	WingTipReviews.getEvents(WingTipReviews.renderEvents);
});

// App Logic
function WingTipReviews() { };

WingTipReviews.reviewButtonHandler = function () {
	$('#review-eventId').val(this.id);
	$('#review-venueName').text($('#' + this.id).attr('venue'));
	$('#review-artistName').text($('#' + this.id).attr('artist'));
};

WingTipReviews.submitReviewButtonHandler = function (e) {
	var btn = $(this);
	var eventId = $('#review-eventId').val();
	var comment = $('#review-comment').val();
	var rating = $('#review-rating').raty('score');

	// Block the form submit, and disable the form button.
	e.preventDefault();
	btn.button('loading');

	// Post the comment.
	$.post('/api/events/' + eventId + '/comments',
		{
			"comment": comment,
			"rating": rating
		},
		function (data) {
			// Reset the form fields and hide the modal.
			btn.button('reset');
			$('#reviewModal').modal('hide');
			$('#review-comment').val('');
			$('#review-rating').raty({ starType: 'img' });
		})
};

WingTipReviews.getEvents = function (callback) {
	$.get('/api/events/', callback);
};

WingTipReviews.renderEvents = function (events) {
	var i = 0;
	var eventContainer = $('#eventContainer');

	// Empty the parent event div (remove loading spinner).
	eventContainer.empty();

	for (i = 0; i < events.length; i++) {
		// Render the event.
		eventContainer.append(WingTipReviews.renderEvent(events[i]));
		
		// Register the review button to open the modal.
		eventContainer.on('click', "#" + events[i].id, WingTipReviews.reviewButtonHandler);
	}
};

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
		'    <a href="#" class="find-seats-link" id="' + event.id + '" artist="' + event.artist.name + '" venue="' + event.venue.name + '" data-toggle="modal" data-target="#reviewModal" data-backdrop="static" data-keyboard="false">',
		'      <i class="fa fa-pencil"></i> Review',
		'    </a>',
		'  </div>',
		'</div>'
	].join('\n');

	return eventHtml;
};

// CONSTANTS
WingTipReviews.monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
WingTipReviews.dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

WITH VenueLocation AS
(
	SELECT 1 AS VenueId, 34.052234 AS Latitude, -118.243685 AS Longitude, 'Los Angeles' AS City
	UNION ALL
	SELECT 2 AS VenueId, 39.739236 AS Latitude, -104.990251 AS Longitude, 'Denver' AS City
	UNION ALL
	SELECT 3 AS VenueId, 30.332184 AS Latitude, -81.655651 AS Longitude, 'Jacksonville' AS City
	UNION ALL
	SELECT 4 AS VenueId, 42.360082 AS Latitude, -71.058880 AS Longitude, 'Boston' AS City
	UNION ALL
	SELECT 5 AS VenueId, 42.331427 AS Latitude, -83.045754 AS Longitude, 'Detroit' AS City
	UNION ALL
	SELECT 6 AS VenueId, 43.048122 AS Latitude, -76.147424 AS Longitude, 'Syracuse' AS City
	UNION ALL
	SELECT 7 AS VenueId, 45.523062 AS Latitude, -122.676482 AS Longitude, 'Portland' AS City
	UNION ALL
	SELECT 8 AS VenueId, 30.267153 AS Latitude, -97.743061 AS Longitude, 'Austin' AS City
	UNION ALL
	SELECT 9 AS VenueId, 40.760779 AS Latitude, -111.891047 AS Longitude, 'Salt Lake City' AS City
	UNION ALL
	SELECT 10 AS VenueId, 47.606209 AS Latitude, -122.332071 AS Longitude, 'Seattle' AS City
	UNION ALL
	SELECT 11 AS VenueId, 47.658780 AS Latitude, -117.426047 AS Longitude, 'Spokane' AS City
	UNION ALL
	SELECT 12 AS VenueId, 47.673988 AS Latitude, -122.121512 AS Longitude, 'Redmond' AS City
)

SELECT c.ConcertId id, 'event' type, DATEDIFF(s, '1970-01-01 00:00:00', c.ConcertDate) date
	, c.PerformerId [artist.id], p.ShortName [artist.name]
	, c.VenueId [venue.id], v.VenueName [venue.name]
	, 'Point' [venue.location.type], vl.longitude [venue.location.coordinates.longitude], vl.latitude [venue.location.coordinates.latitude]
FROM Concerts c
INNER JOIN Venues v ON c.VenueId = v.VenueId
INNER JOIN VenueLocation vl ON c.VenueId = vl.VenueId
INNER JOIN Performers p ON c.PerformerId = p.PerformerId
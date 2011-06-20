// @file 	findSpanTags.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Functions to retrieve span tags

// @brief Retrieve like/dislike counters
// @param article: body of article
// @param value: 'Like' or 'Dislike'
// @return Counter value
function findCounters (article, value) {
	var spanCountStart = article.indexOf ('<span property="tweb:count'+ value +'"');
	// Check if like/dislike span exists
	if (spanCountStart != -1) {
		var spanCountEnd = article.indexOf ('>', spanCountStart);
		// Get like or dislike counter span tag
		var spanCount = article.slice (spanCountStart, spanCountEnd+1);
	
		// Get the counter value index
		var spanCountValStart = spanCount.indexOf ('content="');
		var spanCountValEnd = spanCount.indexOf ('"', spanCountValStart+9);
	
		// Return the counter value
		return spanCount.slice (spanCountValStart+9, spanCountValEnd);
	}
	else return -1;
}

// @brief Retrieve geolocation coords
// @param article: body of article
// @return Coords
function findGeoLocation (article) {
	var spanGeoLocStart = article.indexOf ('<span id="geolocationspan"');
	// Check if geolocation span exists
	if (spanGeoLocStart != -1) {
		// Container for coords
		var geoLocCoords = {
			'lng' : 0.0 ,
			'lat' : 0.0
		}
		
		var spanGeoLocEnd = article.indexOf ('>', spanGeoLocStart);
		// Get geolocation span
		var spanGeoLoc = article.slice (spanGeoLocStart, spanGeoLocEnd+1);
		
		// Get long
		var spanGeoLocLongStart = spanGeoLoc.indexOf ('long="');
		var spanGeoLocLongEnd = spanGeoLoc.indexOf ('"', spanGeoLocLongStart+6);
		
		// Set long
		geoLocCoords.lng = spanGeoLoc.slice (spanGeoLocLongStart+6, spanGeoLocLongEnd);
		
		// Get lat
		var spanGeoLocLatStart = spanGeoLoc.indexOf ('lat="');
		var spanGeoLocLatEnd = spanGeoLoc.indexOf ('"', spanGeoLocLatStart+5);
		
		// Set lat
		geoLocCoords.lat = spanGeoLoc.slice (spanGeoLocLatStart+5, spanGeoLocLatEnd);
		
		return geoLocCoords;
	}
	else return null;
}

// @brief Retrieve like/dislike set value
// @param article: body of article
// @return Set value
function findSetLike (article) {
	var spanSetLikeStart = article.indexOf ('<span rev="tweb:like"');
	
	// Check if set like span exists
	if (spanSetLikeStart != -1) {
		// Return 1 for like
		return 1;
	}
	
	spanSetLikeStart = article.indexOf ('<span rev="tweb:dislike"');
	
	// Check if set dislike span exists
	if (spanSetLikeStart != -1) {
		// Return -1 for dislike
		return -1;
	}
	
	// Return 0 for neutral
	return 0;
}

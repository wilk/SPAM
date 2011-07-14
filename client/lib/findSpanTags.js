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

// @brief Transforms naked link in resource (<span resource ...>) or in a link element (<a ...>)
// @param article: body of article
// @param startPoint: start point to read (for recursive issue)
// @param artLen: default article length
// @return The article modified
// TODO: problem with clones (http://www.img.com/img , http://www.img.com/img)
function transformNakedUrl (article, startPoint, artLen) {
	var urlArt;
	var urlArtStart = article.indexOf ('http://' , startPoint);
	
	// If an url was found
	if (urlArtStart != -1) {
		var urlArtEnd = article.indexOf (' ', urlArtStart + 7);
	
		// Check if article is finished
		if (urlArtEnd != -1) {
			urlArt = article.slice (urlArtStart , urlArtEnd);
		}
		// If it is, use article.length instead of urlArtEnd to avoid space problems
		else {
			urlArtEnd = artLen;
			urlArt = article.slice (urlArtStart , article.length);
		}
		
		// JQuery to make sync request
		$.ajax ({
			type: 'POST' ,
			url: 'proxy' ,
			data: {url:urlArt} ,
			// Synchronous request
			async: false ,
			success: function (data, status, xhr) {
				// Theme for audio/video/image link
				var urlVideoToReplace = article.replace (urlArt , '<span resource="video" src="'+ urlArt +'" />');
				var urlAudioToReplace = article.replace (urlArt , '<span resource="audio" src="'+ urlArt +'" />');
				var urlImageToReplace = article.replace (urlArt , '<span resource="image" src="'+ urlArt +'" />');
				
				switch (data) {
					// Video
					case 'video/ogg':
						article = urlVideoToReplace;
						break;
					case 'video/mpeg':
						article = urlVideoToReplace;
						break;
					case 'video/mp4':
						article = urlVideoToReplace;
						break;
					case 'video/quicktime':
						article = urlVideoToReplace;
						break;
					case 'video/webm':
						article = urlVideoToReplace;
						break;
					case 'video/x-ms-wmv':
						article = urlVideoToReplace;
						break;
					// Audio
					case 'audio/ogg':
						article = urlAudioToReplace;
						break;
					case 'audio/mpeg':
						article = urlAudioToReplace;
						break;
					case 'audio/mp4':
						article = urlAudioToReplace;
						break;
					case 'audio/vorbis':
						article = urlAudioToReplace;
						break;
					case 'audio/x-ms-wma':
						article = urlAudioToReplace;
						break;
					case 'audio/webm':
						article = urlAudioToReplace;
						break;
					// Image
					case 'image/gif':
						article = urlImageToReplace;
						break;
					case 'image/jpeg':
						article = urlImageToReplace;
						break;
					case 'image/png':
						article = urlImageToReplace;
						break;
					case 'image/svg':
						article = urlImageToReplace;
						break;
					case 'image/tiff':
						article = urlImageToReplace;
						break;
					// Text
					default:
						article = article.replace (urlArt , '<a href="'+ urlArt +'">' + urlArt + '</a>');
						break;
				}
				
				// Check if there are other links
				if (urlArtEnd < artLen) {
					article = transformNakedUrl (article , urlArtEnd, artLen);
				}
				else {
					return article;
				}
			} ,
			// If there are some problems (like method not implemented, treat it as a naked link)
			error: function (xhr, errorType, text) {
				article = article.replace (urlArt , '<a href="'+ urlArt +'">' + urlArt + '</a>');
				
				// Check if there are other links
				if (urlArtEnd < artLen) {
					article = transformNakedUrl (article , urlArtEnd, artLen);
				}
				else {
					return article;
				}
			}
		});
	}
	else {
		return article;
	}
	
	return article;
}

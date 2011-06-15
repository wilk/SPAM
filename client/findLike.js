// @file 	findLike.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Functions to retrieve like/dislike data

// @brief Retrieve like/dislike counters
// @param article: body of article
// @param value: 'Like' or 'Dislike'
// @return Counter value
function findCounters (article, value) {
	var spanCountStart = article.indexOf ('<span property="tweb:count'+ value +'"');
	var spanCountEnd = article.indexOf ('>', spanCountStart);
	// Get like or dislike counter span tag
	var spanCount = article.slice (spanCountStart, spanCountEnd+1);
	
	// Get the counter value index
	var spanCountValStart = spanCount.indexOf ('content="');
	var spanCountValEnd = spanCount.indexOf ('"', spanCountValStart+9);
	
	// Return the counter value
	return spanCount.slice (spanCountValStart+9, spanCountValEnd);
}

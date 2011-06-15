// @file 	parserToRead.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Functions to parsing body article to display

// @brief Transform any span resource (video/audio/image) in its html code counterpart
// @param article: body of article to display
// @return article transformed
function parseToRead (article) {
	var i;
	
	// Array of resources
	var resType = new Array ();

	resType[0] = "video";
	resType[1] = "audio";
	resType[2] = "image";

	var spanTagEnd = 0;
	var spanTagStart = 0;
	
	// Read the whole article body, searching <span> tag, starting at the end of the last <span> read
	while ((spanTagStart = article.indexOf ('<span', spanTagEnd)) != -1) {
		spanTagEnd = article.indexOf ('>', spanTagStart);
		// Now we got the entire span tag (<span ... >)
		var spanTag = article.slice (spanTagStart, spanTagEnd+1);
	
		var spanResIndex;
		
		// Check if it's a resource span tag (<span resource="image/audio/video" src="http://..." />)
		for (i=0; i<3; i++)
			if ((spanResIndex = spanTag.indexOf ('resource="' + resType[i] + '"')) != -1) break;
	
		if (spanResIndex != -1) {
			var spanResSrcStart = spanTag.indexOf ('src="');
			var spanResSrcEnd = spanTag.indexOf ('"', spanResSrcStart+5);
			// Now we got the url of resource
			var spanResSrc = spanTag.slice (spanResSrcStart+5, spanResSrcEnd);
			
			// Change <span> in the proper slice of code (<iframe>, <img>, etc)
			article = article.replace (spanTag, embedResource (spanResSrc, i));
		}
	}
	
	return article;
}

// @brief Select proper code for the resource passed
// @param src: url of resource
// @param res: index of type of resource (audio/video/image)
// @return Appropriate slice of code
function embedResource (src, res) {
	var retRes;
	switch (res) {
		// video
		case 0:
			retRes = '<iframe width="425" height="349" src="'+ src +'" frameborder="0" allowfullscreen></iframe>';
			break;
		// audio
		case 1:
			retRes = '<iframe width="200" height="100" src="'+ src +'" frameborder="0" allowfullscreen></iframe>';
			break;
		// image
		case 2:
			retRes = '<img src="'+ src +'" />';
			break;
	}
	
	return retRes;
}

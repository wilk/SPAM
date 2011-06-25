// @file 	hashtagInjection.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Functions for hashtag XML injection

// @brief Split whole text into an array, then check if there are any hashtag and if there are replace it with the right XML
// TODO: check if there are more istances of the same hashtag
// TODO: check hashtag of shared thesaurus or extended thesaurus
function htInjection (text) {
	var	htSharp = '<span rel="sioc:topic">' ,
		htClose = '</span>';
	var words = text.split (/\s/g);
	for (var i in words) {
		// If the first char of the word is '#', then it's an hashtag
		// TOFIX: words[i] do not return only words!!!
		//if (i.search (/^#/) != -1) {
		if (words[i][0] == "#") {
//			 Replace it with XML and the hashtag without punctuation
			//text = text.replace (words[i] , htSharp + i.replace (/[\.,-\/!?$%\^&\*;:{}=\-_`~()]/g , '') + htClose);
			text = text.replace (words[i] , htSharp + words[i] + htClose);
		}
	}
	
	return text;
}

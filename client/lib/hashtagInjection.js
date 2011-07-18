// @file 	hashtagInjection.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Functions for hashtag XML injection

// @brief Split whole text into an array, then check if there are any hashtag and if there are replace it with the right XML
// @param text: article to parse
// @param store: store of thesaurus
// @return Article with RDF
function htInjection (text, store) {
	var	spanHTBase = '<span rel="sioc:topic">' ,
		spanHTExternal = '<span typeof="ctag:Tag" property="ctag:label">' ,
		spanClose = '</span>';
		
	var extendedNS = optionSin.getPureUrlServerLtw () + 'thesaurus';
	var sharedNS = 'http://vitali.web.cs.unibo.it/TechWeb11/thesaurus';
	
	// All words without spaces
	var words = text.split (/\s/g);
	for (var i in words) {
		// If the first char of the word is '#', then it's an hashtag
		if (words[i][0] == "#") {
			// To avid punctuation during RDF injection
			var wordPunctuation = '';
			var wordToReplace = spanHTBase + '#';
			
			var wordToSearch = words[i].slice (1, words[i].length);
			
			// Search punctuation into the hashtag
			var indexPunctuation = wordToSearch.search (/[\.,-\/!?$%\^&\*;:{}=\-`~()]/g);
			
			if (indexPunctuation != -1) {
				// Punctuation of the word
				wordPunctuation = wordToSearch.slice (indexPunctuation, wordToSearch.length);
				
				// Word without punctuation
				wordToSearch = wordToSearch.slice (0, indexPunctuation);
			}
			
			// Model associated to the hashtag
			var recordOfTerm = store.findRecord ('term' , wordToSearch);
			
			if (recordOfTerm != null) {
				// Handle the appropriate namespace
				switch (recordOfTerm.get ('ns')) {
					// If hashtag belongs to the extended thesaurus, set as extended
					case extendedNS:
						wordToReplace += '<span typeof="skos:Concept" about="' + recordOfTerm.get ('path') + '" rel="skos:inScheme" resource="' + extendedNS + '">';
						break;
					// If hashtag belongs to the shared thesaurus, set as shared
					case sharedNS:
						wordToReplace += '<span typeof="skos:Concept" about="' + recordOfTerm.get ('path') + '" rel="skos:inScheme" resource="' + sharedNS + '">';
						break;
				}
			}
			else {
				// CTag term
				wordToReplace += spanHTExternal;
			}
			
			// Build hashtag with RDF and punctuation
			wordToReplace += wordToSearch + spanClose + spanClose + wordPunctuation;
			
			// Replace it with XML and the hashtag without punctuation
			text = text.replace (words[i] , wordToReplace);
		}
	}
	
	return text;
}

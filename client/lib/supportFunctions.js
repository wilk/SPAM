// @file 	supportFunctions.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Support functions

// @brief Retrieve the articles searched
// @param store: articles store
// @param focus: model of focus article
// @param focusIndex: index focus article model
function requestSearchArticles (store, focus, focusIndex) {
	// Clean the store
	store.removeAll ();

	// Make an AJAX request with JQuery to read XML structure (ExtJS can't read XML with mixed content model)
	$.ajax({
		type: 'GET',
		// Uses url of the store
		url: store.getProxy().url,
		dataType: "xml",
		success: function (xml) {
			// Check every posts
			$(xml).find('post').each (function () {
				var numLike, numDislike;
				var ifLikeDislike = 0;
				
				// Find like and dislike counter plus setlike of the user
				$(this).find('article').find('span').each (function () {
					// Find like counter
					if ($(this).attr ('property') == 'tweb:countLike') {
						numLike = parseInt ($(this).attr ('content'));
					}
					
					// Find dislike counter
					if ($(this).attr ('property') == 'tweb:countDislike') {
						numDislike = parseInt ($(this).attr ('content'));
					}
					
					// Find setlike/setdislike of the user
					if ($(this).attr ('rev') == 'tweb:like') {
						ifLikeDislike = 1;
					}
					else if ($(this).attr ('rev') == 'tweb:dislike') {
						ifLikeDislike = -1;
					}
				});
				
				// Add article to the store
				store.add ({
					affinity: parseInt ($(this).find('affinity').text ()) ,
					article: $(this).find('article').text () ,
					resource: $(this).find('article').attr ('resource') ,
					about: $(this).find('article').attr ('about') ,
					like: numLike ,
					dislike: numDislike ,
					setlike: ifLikeDislike ,
					user: $(this).find('article').attr('resource').split("/")[2]
				});
			});
			
			// Before dispose the retrieved articles, kill the old windows
			var winFocus = Ext.getCmp ('winFocusArticle');
	
			// Kills focus window
			if (winFocus != null)
				winFocus.destroy ();
	
			var win;
			var j = 0;
	
			// And then kills the other windows
			while ((win = Ext.getCmp ('articles'+j)) != null) {
				win.destroy ();
				j++;
			}
			
			// Dispose retrieved articles
			disposeArticles (store, focus, focusIndex);
		} ,
		error: function (xhr, type, text) {
			Ext.Msg.show ({
				title: type,
				msg: text ,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.ERROR
			});
		}
	});
}

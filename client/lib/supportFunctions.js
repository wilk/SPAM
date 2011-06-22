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
	// TODO: make case for every errors (401, 404, ...)
	// Load data with store request
	store.load (function (records, operation, success) {
		// On failure, display error box
		if (! success) {
			var err = operation.getError ();
			Ext.Msg.show ({
				title: 'Error ' + err.status ,
				msg: 'Something bad happened!' ,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.ERROR
			});
		}
		// On success, dispose articles retrieved
		else {
			// Check if there are articles to display
			if (store.count () == 0) {
				Ext.Msg.show ({
					title: 'Error',
					msg: 'No articles found!' ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
			else {
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
			}
		}
	});
}



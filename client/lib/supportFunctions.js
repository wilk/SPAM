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
			var msg = displayError (err.status);
			Ext.Msg.show ({
				title: 'Error ' + err.status ,
				msg: msg ,
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

// @brief Set the appropriate error message.
// @param status: http error status.
// @return Error message to display.
function displayError (status) {
	var msg;
	switch (status) {
		case 400:
			msg = 'Sorry! Bad request!';
			break;
		case 401:
			msg = 'Sorry! You are unauthorized to get this resource!';
			break;
		case 404:
			msg = 'Sorry! Resource not found!';
			break;
		case 405:
			msg = 'Sorry! Method not allowed!';
			break;
		case 406:
			msg = 'Sorry! The requested resource is only capable of generating content not acceptable according to the Accept headers sent in the request.';
		case 500: 
			msg = 'Sorry! Internal server error!';
			break;
		case 501:
			msg = 'Sorry! The service is not implemented!';
			break;
		default:
			msg = 'Sorry! Something bad happened!';
			break;
	}
	
	return msg;
}

// @file 	disposeArticles.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Create one window for any articles retrieved and dispose in radial form

// @brief Dispose articles into windows
// @param store: store where articles are stored
// @param focus: model of focus article
// @param focusIndex: index focus article model
function disposeArticles (store, focus, focusIndex) {
	var ARTICLE_WINDOW_WIDTH = 150;
	var ARTICLE_WINDOW_HEIGHT = 100;
	var ARTICLE_FOCUS_WINDOW_WIDTH = 225;
	var ARTICLE_FOCUS_WINDOW_HEIGHT = 175;

	// Degree of every articles
	var degree = 0;

	// Number of articles to set on the circle
	var radCounter = 0;
	
	// Getting articles store
	var cntRegion = Ext.getCmp ('centReg');
	
	// Center point of center region
	var oX = (cntRegion.getWidth () / 2) - ARTICLE_WINDOW_WIDTH;
	var oY = (cntRegion.getHeight () / 2) - ARTICLE_WINDOW_HEIGHT;
	var focusX = (cntRegion.getWidth () / 2) - ARTICLE_FOCUS_WINDOW_WIDTH;
	var focusY = (cntRegion.getHeight () / 2) - ARTICLE_FOCUS_WINDOW_HEIGHT;
		
	// Retrieve all records
	var allRecord = store.getRange ();
	
	// Check if there are two articles at least
	if (store.count () > 1) {
		// If focus wasn't passed by argument, find it!
		if (focus == null) {
			var artBestAffinity = allRecord[0].get ('affinity');
			
			// Check the article with best affinity
			for (var i=1; i < store.count (); i++) {
				artBestAffinity = Math.max (allRecord[i].get ('affinity') , artBestAffinity);
			}
		
			// Retrieve index of the article with the best affinity
			for (var i=0; i < store.count (); i++)
				if (artBestAffinity == allRecord[i].get ('affinity')) 
					focusIndex = i;
				
			focus = allRecord[focusIndex];
		}
		// Add the focus to the store
		else {
			store.add (focus);
		}
		
		// The post with greater z-index is the more recent
		store.sort ('affinity' , 'ASC');
		
		radCounter = 360 / store.count ();
		
		// Counter for generate random id of articles
		var j=0;
	
		// Create a window for any articles
		store.each (function (record) {
			var winAff = record.get ('affinity');
			var strWinAff = winAff.toString ();
			// TODO: fix this stuff because 1198 is greater then 1099
			// Check if affinity value is greater then 99. If is it, keep the last two figures (1099 -> 99)
			if (strWinAff.length > 2) {
				winAff = parseInt (strWinAff.slice (strWinAff.length - 2, strWinAff.length));
			}
			var x, y;
			
			// Don't manage the focus article
			if (record != focus) {
			
				var cosX = Math.cos (degree * (Math.PI/180));
				var sinY = Math.sin (degree * (Math.PI/180));
			
				x = oX + (((cntRegion.getWidth () / 2) - ARTICLE_WINDOW_WIDTH) * cosX) + winAff;
				y = oY - (((cntRegion.getHeight () / 2) - ARTICLE_WINDOW_HEIGHT) * sinY) + winAff;
			
				// No negative values
				if (x < 0) x = Math.abs (x);
				if (y < 0) y = Math.abs (y);
			
				degree += radCounter;
				
				// Instances of articles view
				var win = Ext.widget ('articles' , {
					title: '<span style="color: green; font-style: italic">' + record.get ('user') + '</span> on <span style="color: red; font-style: italic">' + record.get ('server') + '</span> said:' ,
					html: parseToRead (record.get ('article')) ,
					id: 'articles' + j ,
					x: x ,
					y: y ,
					
					// Other useful configurations
					aboutModel: record.get ('about') ,
					isFollowed: false
				});
				
				// Saves information in the articles singleton
				articleSin.addArticle (win);
		
				// Add win to center region
				cntRegion.add (win);
				win.show ();
				
				j++;
			}
		} , this);
	}
	// Check if there's only an article
	else if (store.count () == 1) {
		if (focus == null) {
			// Set the first of store
			focusIndex = 0;
			focus = allRecord[focusIndex];
		}
	}
	
	// Add focus window at last
	var win = Ext.widget ('focusarticle' , {
		// Author is /serverID/userID, so split and take only userID
		title: '<span style="color: green; font-style: italic">' + focus.get ('user') + '</span> on <span style="color: red; font-style: italic">' + focus.get ('server') + '</span> said:' ,
		html: parseToRead (focus.get ('article')) ,
		x: focusX ,
		y: focusY ,
		id: 'winFocusArticle' ,
		
		// Other useful configurations
		aboutModel: focus.get ('about') ,
		isFollowed: false
	});
	
	// Saves infos of focus article in article singleton
	articleSin.setFocus (win);
	
	// Add win to center region
	cntRegion.add (win);
	win.show ();
	
	// Unset loading mask to the center region
	Ext.getCmp('centReg').setLoading (false);
}

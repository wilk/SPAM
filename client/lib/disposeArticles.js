// @file 	disposeArticles.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Create one window for any articles retrieved and dispose in radial form

function disposeArticles (store) {
	var ARTICLE_WINDOW_WIDTH = 150;
	var ARTICLE_WINDOW_HEIGHT = 100;
	var ARTICLE_FOCUS_WINDOW_WIDTH = 200;
	var ARTICLE_FOCUS_WINDOW_HEIGHT = 150;

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
	
	var artBestAffinity = allRecord[0].get ('affinity');
	var artBestAffinityIndex = 0;
	
	// Check if there are two articles at least
	if (store.count () > 1) {
		// Check the article with best affinity
		for (var i=1; i < store.count (); i++) {
			artBestAffinity = Math.max (allRecord[i].get ('affinity') , artBestAffinity);
		}
		
		// Retrieve index of the article with the best affinity
		for (var i=0; i < store.count (); i++)
			if (artBestAffinity == allRecord[i].get ('affinity')) 
				artBestAffinityIndex = i;
		
		radCounter = 360 / store.count ();
	
		// Create a window for any articles
		store.each (function (record) {
			var winAff = record.get ('affinity');
			var x, y;
			
			// Don't manage the focus article
			if (record != allRecord[artBestAffinityIndex]) {
			
				// Searching model ID of this article
				for (var i = 0; i < store.count (); i++) {
					if (allRecord[i] == record) break;
				}
		
				var cosX = Math.cos (degree * (Math.PI/180));
				var sinY = Math.sin (degree * (Math.PI/180));
			
				x = oX + (((cntRegion.getWidth () / 2) - ARTICLE_WINDOW_WIDTH) * cosX);
				y = oY - (((cntRegion.getHeight () / 2) - ARTICLE_WINDOW_HEIGHT) * sinY);
			
				// No negative values
				if (x < 0) x = Math.abs (x);
				if (y < 0) y = Math.abs (y);
			
				degree += radCounter;
				
				var win = Ext.create ('SC.view.regions.center.Articles' , {
					title: record.get('resource').split("/")[2] + ' said:' ,
					html: parseToRead (record.get ('article')) ,
					x: x ,
					y: y ,
					items: [{
						// Saves model ID of this article
						xtype: 'button' ,
						text: i ,
						tooltip: 'index' ,
						hidden: true
					}] ,
					// TODO: insert buttons in the articles view
					dockedItems: [{
						xtype: 'toolbar' ,
						dock: 'bottom' ,
						ui: 'footer' ,
						// Only focus button
						items: ['->' , {
							// Button focus
							cls: 'x-btn-icon' ,
							icon: 'ext/resources/images/btn-icons/focus.png' ,
							tooltip: 'Focus'
						} , '->']
					}]
				});
		
				// Add win to center region
				cntRegion.add (win);
				win.show ();
			}
		} , this);
	}
	
	// Like and Dislike counters
	var counterLike = parseInt (findCounters (allRecord[artBestAffinityIndex].get ('article'), 'Like'));
	var counterDislike = parseInt (findCounters (allRecord[artBestAffinityIndex].get ('article'), 'Dislike'));
	
	// Percent of progress bar
	var pBarValue = counterLike / (counterLike + counterDislike);
	
	// Add focus window at last
	var win = Ext.create ('SC.view.regions.center.FocusArticle' , {
		// Author is /serverID/userID, so split and take only userID
		title: allRecord[artBestAffinityIndex].get('resource').split("/")[2] + ' said:' ,
		html: parseToRead (allRecord[artBestAffinityIndex].get ('article')) ,
		x: focusX ,
		y: focusY
	});
	
	// TODO: setup dinamically like and follow buttons
	// Update dinamically invisible button that contains focusModelIndex and the like/dislike progressbar
	win.down('button[tooltip="focusModelIndex"]').setText (artBestAffinityIndex);
	win.down('progressbar').updateProgress (pBarValue, counterLike + ' like - ' + counterDislike + ' dislike');
	
	// Add win to center region
	cntRegion.add (win);
	win.show ();
}

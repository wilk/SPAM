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
	var mod = store.getRange ();
	
	var artBestAffinity = mod[0].get ('affinity');
	var artBestAffinityIndex = 0;
	
	// Check if there are two articles at least
	if (store.count () > 1) {	
		// Check the article with best affinity
		for (var i=1; i < store.count (); i++) {
			artBestAffinity = Math.max (mod[i].get ('affinity') , artBestAffinity);
			artBestAffinityIndex = i;
		}
	
		radCounter = 360 / store.count ();
	
		// Create a window for any articles
		store.each (function (record) {
			var winAff = record.get ('affinity');
			var x, y;
			
			// Don't manage the focus article
			if (winAff != artBestAffinity) {
		
				var cosX = Math.cos (degree * (Math.PI/180));
				var sinY = Math.sin (degree * (Math.PI/180));
			
				x = oX + (((cntRegion.getWidth () / 2) - ARTICLE_WINDOW_WIDTH) * cosX);
				y = oY - (((cntRegion.getHeight () / 2) - ARTICLE_WINDOW_HEIGHT) * sinY);
			
				// No negative values
				if (x < 0) x = Math.abs (x);
				if (y < 0) y = Math.abs (y);
			
				degree += radCounter;
		
				var win = Ext.create ('SC.view.regions.center.Articles' , {
					title: record.get ('about') + ' said:' ,
					html: record.get ('article') ,
					x: x ,
					y: y ,
					// TODO: insert buttons in the articles view
					dockedItems: [{
						xtype: 'toolbar' ,
						dock: 'bottom' ,
						ui: 'footer' ,
						// Items right-justified
						items: [{
							// Button I Like
							cls: 'x-btn-icon' ,
							icon: 'ext/resources/images/btn-icons/like.png' ,
							tooltip: 'I Like'
						} , {
							// Button I Dislike
							cls: 'x-btn-icon' ,
							icon: 'ext/resources/images/btn-icons/dislike.png' ,
							tooltip: 'I Dislike'
						} , {
							// Button follow
							cls: 'x-btn-icon' ,
							icon: 'ext/resources/images/btn-icons/follow.gif' ,
							tooltip: 'Follow'
						} , '->' , {
							// Button focus
							cls: 'x-btn-icon' ,
							icon: 'ext/resources/images/btn-icons/focus.png' ,
							tooltip: 'Focus'
						} , '->' , {
							// Button reply
							cls: 'x-btn-icon' ,
							icon: 'ext/resources/images/btn-icons/reply.png' ,
							tooltip: 'Reply'
						} , {
							// Button respam
							cls: 'x-btn-icon' ,
							icon: 'ext/resources/images/btn-icons/respam.png' ,
							tooltip: 'Respam'
						}]
					}]
				});
		
				// Add win to center region
				cntRegion.add (win);
				win.show ();
			}
		} , this);
	}
	
	// Add focus window at last
	var win = Ext.create ('SC.view.regions.center.Articles' , {
			title: (mod[artBestAffinityIndex].get ('about')) + ' said:' ,
			html: (mod[artBestAffinityIndex].get ('article')) ,
			x: focusX ,
			y: focusY ,
			width: ARTICLE_FOCUS_WINDOW_WIDTH * 2 ,
			height: ARTICLE_FOCUS_WINDOW_HEIGHT * 2 ,
			// TODO: insert buttons in the articles view
			dockedItems: [{
				xtype: 'toolbar' ,
				dock: 'bottom' ,
				ui: 'footer' ,
				// Items right-justified
				items: [{
					// Button I Like
					cls: 'x-btn-icon' ,
					icon: 'ext/resources/images/btn-icons/like.png' ,
					tooltip: 'I Like'
				} , {
					// Button I Dislike
					cls: 'x-btn-icon' ,
					icon: 'ext/resources/images/btn-icons/dislike.png' ,
					tooltip: 'I Dislike'
				} , {
					// Button follow
					cls: 'x-btn-icon' ,
					icon: 'ext/resources/images/btn-icons/follow.gif' ,
					tooltip: 'Follow'
				} , '->' , '->' , {
					// Button reply
					cls: 'x-btn-icon' ,
					icon: 'ext/resources/images/btn-icons/reply.png' ,
					tooltip: 'Reply'
				} , {
					// Button respam
					cls: 'x-btn-icon' ,
					icon: 'ext/resources/images/btn-icons/respam.png' ,
					tooltip: 'Respam'
				}]
			}]
		});
		
		// Add win to center region
		cntRegion.add (win);
		win.show ();
	
}

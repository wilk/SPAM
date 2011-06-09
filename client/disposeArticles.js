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

	var firstArticle = true;

	// Degree of every articles
	var degree = 0;

	// Number of articles to set on the circle
	var radCounter = 0;
	
	// Getting articles store
	var cntRegion = Ext.getCmp ('centReg');
	
	radCounter = 360 / store.count ();
	
	// Create a window for any articles
	store.each (function (record) {
		var winAff = record.get ('affinity');
		var x, y;
		
		// Center point of center region
		var oX = (cntRegion.getWidth () / 2) - ARTICLE_WINDOW_WIDTH;
		var oY = (cntRegion.getHeight () / 2) - ARTICLE_WINDOW_HEIGHT;
		
		// The first article is the focus
		if (firstArticle) {
			x = oX;
			y = oY;
		}
		else {
			var cosX = Math.cos (degree * (Math.PI/180));
			var sinY = Math.sin (degree * (Math.PI/180));
			
			x = oX + (((cntRegion.getWidth () / 2) - ARTICLE_WINDOW_WIDTH) * cosX);
			y = oY - (((cntRegion.getHeight () / 2) - ARTICLE_WINDOW_HEIGHT) * sinY);
			
			// No negative values
			if (x < 0) x = Math.abs (x);
			if (y < 0) y = Math.abs (y);
			
			degree += radCounter;
		}
		
		firstArticle = false;
		
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
					icon: 'ext/resources/images/btn-icons/like.png'
				} , {
					// Button I Dislike
					cls: 'x-btn-icon' ,
					icon: 'ext/resources/images/btn-icons/dislike.png'
				} , '->' , {
					// Button focus
					text: 'Focus'
				} , '->' , {
					// Button reply
					text: 'Reply'
				} , {
					// Button retweet
					text: 'Respam'
				}]
			}]
		});
		
		// Add win to center region
		cntRegion.add (win);
		win.show ();
	} , this);
}

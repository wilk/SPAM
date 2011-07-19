// @file 	RecentPost.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	View controller of recent post of east region

Ext.define ('SC.controller.regions.east.RecentPost' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.east.RecentPost'] ,
	
	// Models
	models: ['regions.east.RecentPost'] ,
	
	// Stores
	stores: ['regions.east.RecentPost'] ,
	
	// Configuration
	init: function () {
		var storeRecentPost;
		this.control ({
			'recentpost' : {
				afterrender : this.initRecentPostPanel ,
				itemdblclick: this.displayArticle
			}
		});
	} ,
	
	// Retrieve every 5 seconds the 10 more recent posts
	initRecentPostPanel: function (panel) {
		storeRecentPost = this.getRegionsEastRecentPostStore ();
		
		retrieveRecentArticles (storeRecentPost);
		
		// Every 5 secs refresh the recent articles list
		setInterval ('retrieveRecentArticles (storeRecentPost)', 30000);
	} ,
	
	// Display articles when someone dclick on this article
	displayArticle: function (view, record, item, index, event) {
		// Set appropriate URL
		store.getProxy().url = optionSin.getUrlServerLtw () + 'search/5/affinity' + record.get ('about');
	
		// Retrieve articles
		requestSearchArticles (store, record, index);
	}
});

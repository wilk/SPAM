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
		console.log ('Controller RecentPost started.');
	} ,
	
	initRecentPostPanel: function (panel) {
		storeRecentPost = this.getRegionsEastRecentPostStore ();
		
		// Every 5 secs refresh the recent articles list
		setInterval ('storeRecentPost.load ()', 5000);
	} ,
	
	displayArticle: function (view, record, item, index, event) {
		// Set appropriate URL
		store.getProxy().url = 'search/5/affinity' + record.get ('about');
	
		// Retrieve articles
		requestSearchArticles (store, record, index);
	}
});

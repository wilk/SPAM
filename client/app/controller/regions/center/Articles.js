// @file 	Articles.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of articles view

Ext.define ('SC.controller.regions.center.Articles' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.center.Articles'] ,
	
	stores: ['regions.center.Articles'] ,
	models: ['regions.center.Articles'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// Focus button
			'articles button[tooltip="Focus"]' : {
				click : this.setFocus
			} 
		});
	
		console.log ('Controller Articles started.');
	} ,
	
	// @brief Set focus on this article
	setFocus: function (button, event) {
		// TODO: Ajax request to retrieve the most related articles
		// Get model, store and index of this article
		var index = button.up('window').down('button[tooltip="index"]').getText ();
		var store = this.getRegionsCenterArticlesStore();
		var model = store.getRange()[index];
		
		// Set appropriate URL
		store.getProxy().url = 'search/5/affinity' + model.get ('about');
	
		// Retrieve articles
		requestSearchArticles (store, model, index);
		
//		var winFocus = Ext.getCmp ('winFocusArticle');
//		
//		// Kills focus window
//		if (winFocus != null)
//			winFocus.destroy ();
//		
//		var w;
//		var j = 0;
//		
//		// And then kills the other windows
//		while ((w = Ext.getCmp ('articles'+j)) != null) {
//			w.destroy ();
//			j++;
//		}
		
		// Redispose windows with new focus
		disposeArticles (store, model, index);
	} 
});

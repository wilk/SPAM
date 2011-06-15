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
		// TODO: after render of this window, check like/dislike and follow/unfollow value of this article
		this.control ({
			// Focus button
			'articles button[tooltip="Focus"]' : {
				click : this.focus
			} 
		});
	
		console.log ('Controller Articles started.');
	} ,
	
	// @brief Focus
	focus: function (button, event) {
		var index = button.up('window').down('button[tooltip="index"]').getText ();
		var model = this.getRegionsCenterArticlesStore().getRange()[index];
		
		// TODO: Ajax request to retrieve the most related articles
		// TODO: set 2 parameters to disposeArticles function: 1° the focus article; 2° the store
	} 
});

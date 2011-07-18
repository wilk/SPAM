// @file 	Center.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of view of center region of Viewport

Ext.define ('SC.controller.regions.Center' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.Center'] ,
	stores: ['regions.center.Articles'] ,
	models: ['regions.center.Articles'] ,
	
	// Configuration
	init: function () {
		this.control ({
			'centerregion' : {
				afterrender : this.setArtDisp
			}
		});
		console.log ('Controller Center started.');
	} ,

	// Display 10 recent posts
	setArtDisp : function (region) {
		var store = this.getRegionsCenterArticlesStore ();

		store.getProxy().url = optionSin.getUrlServerLtw () + 'search/10/recent/';
		
		requestSearchArticles (store, null, 0);
	}
});

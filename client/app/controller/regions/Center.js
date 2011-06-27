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
//				afterrender : this.setArtDisp
//				enable : this.setArtDisp
			}
		});
		console.log ('Controller Center started.');
	} ,
	
	setArtDisp : function (region) {
		store = this.getRegionsCenterArticlesStore();

		store.getProxy().url = 'app/data/art4.xml';
		
		// TODO: make case for every errors (401, 404, ...)
		store.load (function (records, operation, success) {
			if (! success) {
				var err = operation.getError ();
				Ext.Msg.show ({
					title: 'Error ' + err.status ,
					msg: 'Something bad happened!' ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
			else {
				// Check if there are articles to display
				if (store.count () == 0)
					Ext.Msg.show ({
						title: 'Error',
						msg: 'No articles found!' ,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				else
					disposeArticles (store, null, 0);
			}
		});
	}
});

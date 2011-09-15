// @file 	MarkerWindow.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of MarkerWindow view

Ext.define ('SC.controller.MarkerWindow' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['MarkerWindow'] ,
	
	// Models
	models: ['regions.center.Articles'] ,
	
	// Stores
	stores: ['regions.center.Articles'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// Init vars
			'markerwindow' : {
				afterrender : this.initVar
			} ,
			'#btnMarkerSearch' : {
				click : this.startGeolocSearch
			}
		});
	} ,
	
	// @brief Initialize variables
	initVar: function (win) {
		this.win = win;
		this.storeArticles = this.getRegionsCenterArticlesStore ();
		this.localStore = Ext.create ('Ext.data.Store' , {
			model: 'SC.model.regions.center.Articles'
		});
	} ,
	
	startGeolocSearch: function (button) {
		var counter = 0;
		var focus = null;
		
		// Fill local store
		this.storeArticles.each (function (record) {
			if (!((record.get ('glLat') == 0) && (record.get ('glLong') == 0))) {
				this.localStore.insert (counter, record);
				counter++;
			}
		}, this);
		
		// Find focus article (this.win.about)
		this.storeArticles.each (function (record) {
			if (record.get ('about') == this.win.about) focus = record;
		}, this);
		
		// Before dispose the retrieved articles, kill the old windows
		articleSin.destroyAll ();
		
		// Display articles
		if (focus != null) disposeArticles (this.localStore, focus, 0);
		else disposeArticles (this.localStore, null, 0);
		
		// Close marker window
		this.win.close ();
	}
});

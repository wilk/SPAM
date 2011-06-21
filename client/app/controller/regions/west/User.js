// @file 	User.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of User view

Ext.define ('SC.controller.regions.west.User' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.west.User'] ,
	
	// Models
	models: ['regions.west.Followers'] ,
	
	// Stores
	stores: ['regions.west.Followers'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// Init user with his followers list
			'user' : {
				show : this.initUserPanel
			} ,
		});
		
		console.log ('Controller user started');
	} ,
	
	// Load the followers store
	// TODO: problem with load when user is already logged in
	initUserPanel: function (panel) {
		var store = this.getRegionsWestFollowersStore ();
		
		store.load ();
	}
});

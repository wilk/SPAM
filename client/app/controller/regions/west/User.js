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
				render : this.initUserPanel ,
				show : this.initUserPanel
			} ,
		});
		
		console.log ('Controller user started');
	} ,
	
	// Load the followers store
	initUserPanel: function (panel) {
		var store = this.getRegionsWestFollowersStore ();
		var winFocus = Ext.getCmp ('winFocusArticle');
		
		// When panel is showed or rendered, load followers store
		store.load (function (records, option, success) {
			if (! success) {
				var err = option.getError ();
				// If 404 is returned, ignore it because or user isn't logged in or hasn't followers
				if (err.status != 404) {
					Ext.Msg.show ({
						title: 'Error ' + err.status,
						msg: 'Something bad happened during retrieve the followers list!' ,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				}
				else {
					// Refresh focus window
					if (winFocus != undefined) {
						winFocus.setVisible (false);
						winFocus.setVisible (true);
					}
				}
			}
			else {
				// Refresh focus window
				if (winFocus != undefined) {
					winFocus.setVisible (false);
					winFocus.setVisible (true);
				}
			}
		});
	}
});

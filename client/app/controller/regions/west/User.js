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
	models: ['regions.west.Followers' , 'regions.west.user.Server'] ,
	
	// Stores
	stores: ['regions.west.Followers' , 'regions.west.user.Server'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// Init user with his followers list
			'user' : {
				render : this.initUserPanel ,
				show : this.initUserPanel
			} ,
		});
		
		console.log ('Controller User started');
	} ,
	
	// Load the followers store
	initUserPanel: function (panel) {
		var storeFollowers = this.getRegionsWestFollowersStore ();
		var storeServer = this.getRegionsWestUserServerStore ();
		var winFocus = Ext.getCmp ('winFocusArticle');
		
		// It doesn't retrieve follower list if the user is logged off
		if (checkIfUserLogged ()) {
			// Clear store of the last user
			storeFollowers.removeAll ();
			
			// When panel is showed or rendered, load followers store
			storeFollowers.load (function (records, option, success) {
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
			
			// Clear store of the last user
			storeServer.removeAll ();
			
			// Retrieve federated servers list of the current user
			storeServer.load (function (records, option, success) {
				// Shows an error if something goes wrong
				if (! success) {
					var err = option.getError ();
					
					Ext.Msg.show ({
						title: 'Error ' + err.status,
						msg: 'Something bad happened during retrieve the federated servers list!' ,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				}
				else {
					// Sort the federated servers list
					storeServer.sort ('serverID' , 'ASC');
				}
			});
		}
	}
});

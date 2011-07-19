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
	models: ['regions.west.Followers' , 'regions.west.user.Server' , 'regions.center.Articles'] ,
	
	// Stores
	stores: ['regions.west.Followers' , 'regions.west.user.Server' , 'regions.center.Articles'] ,
	
	// Configuration
	init: function () {
		var storeArticles;
		
		this.control ({
			// Init user with his followers list
			'user' : {
				render : this.initUserPanel ,
				show : this.initUserPanel
			} ,
			// Followers grid
			'#userFollowersGrid' : {
				itemdblclick : this.showProfileWindow
			}
		});
	} ,
	
	// Load the followers store
	initUserPanel: function (panel) {
		var storeFollowers = this.getRegionsWestFollowersStore ();
		var storeServer = this.getRegionsWestUserServerStore ();
		var winFocus = Ext.getCmp ('winFocusArticle');
		
		storeArticles = this.getRegionsCenterArticlesStore ();
		
		// It doesn't retrieve follower list if the user is logged off
		if (checkIfUserLogged ()) {
			// Clear store of the last user
			storeFollowers.removeAll ();
			
			storeFollowers.getProxy().url = optionSin.getUrlServerLtw () + 'followers';
			
			// When panel is showed or rendered, load followers store
			storeFollowers.load (function (records, option, success) {
				if (! success) {
					var err = option.getError ();
					// If 404 is returned, ignore it because or user isn't logged in or hasn't followers
					if (err.status != 404) {
						Ext.Msg.show ({
							title: err.status + ' ' + errorSin.getErrorTitle (err.status) ,
							msg: errorSin.getErrorText (err.status) ,
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
					
					// Ascendent sort for followers
					storeFollowers.sort ('follower' , 'ASC');
				}
			});
			
			// Clear store of the last user
			storeServer.removeAll ();
			
			storeServer.getProxy().url = optionSin.getUrlServerLtw () + 'servers';
			
			// Retrieve federated servers list of the current user
			storeServer.load (function (records, option, success) {
				// Shows an error if something goes wrong
				if (! success) {
					var err = option.getError ();
					
					Ext.Msg.show ({
						title: err.status + ' ' + errorSin.getErrorTitle (err.status) ,
						msg: errorSin.getErrorText (err.status) ,
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
	} ,
	
	// @brief Shows window of the user profile
	showProfileWindow: function (view, record, item, index, event) {
		// Retrieve userID and serverID
		var followerServer = record.get('follower').split('/')[0];
		var followerName = record.get('follower').split('/')[1];
		
		// Shows the profile window
		var win = Ext.getCmp ('windowFollower');
		win.setTitle ('Profile of ' + followerName);
		win.show ();
		
		// Change userID and serverID
		var nameToChange = document.getElementById ('followerUserName');
		var serverToChange = document.getElementById ('followerUserServer');
		
		nameToChange.innerHTML = followerName;
		serverToChange.innerHTML = followerServer;
	}
});

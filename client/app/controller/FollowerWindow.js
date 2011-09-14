// @file 	FollowerWindow.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of FollowerWindow view

Ext.define ('SC.controller.FollowerWindow' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['FollowerWindow'] ,
	
	// Models
	models: ['regions.west.Followers' , 'regions.center.Articles'] ,
	
	// Stores
	stores: ['regions.west.Followers' , 'regions.center.Articles'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// Init vars
			'followerwindow' : {
				afterrender : this.initVar
			} ,
			'#btnProfileUnfollow' : {
				click : this.setUnfollow
			} ,
			'#btnProfileSearch' : {
				click : this.startAuthorSearch
			}
		});
	} ,
	
	// @brief Initialize variables
	initVar: function (win) {
		this.win = win;
		this.storeArticles = this.getRegionsCenterArticlesStore ();
		this.storeFollowers = this.getRegionsWestFollowersStore ();
	} ,
	
	// @brief Unfollow the user
	setUnfollow: function (button) {
		this.win.hide ();
		
		// Ajax request
		Ext.Ajax.request ({
			url: optionSin.getUrlServerLtw () + 'setfollow' ,
			scope: this ,
			// Sending server and user ID of this article
			params: {
				serverID: Ext.fly('followerUserServer').dom.innerHTML ,
				userID: Ext.fly('followerUserName').dom.innerHTML ,
				value: 0
			} ,
			success: function (response) {
				// Reset the store
				this.storeFollowers.removeAll ();
				
				// Update URL
				this.storeFollowers.getProxy().url = optionSin.getUrlServerLtw () + 'followers';
				
				// Reload followers store to refresh user panel
//				storeFollowers.load (function (record, option, success) {
				this.storeFollowers.load ({
					scope: this ,
					callback: function (record, option, success) {
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
						
								// If there aren't followers, remove all previous (old) followers from the store
								this.storeFollowers.removeAll ();
							}
						}
						else {
							// Ascendent sort for followers
							this.storeFollowers.sort ('follower' , 'ASC');
						}
						
						var owner = '/' + Ext.fly('followerUserServer').dom.innerHTML + '/' + Ext.fly('followerUserName').dom.innerHTML;
						// Refresh articles windows
						articleSin.setFollowButton (owner, false);
					}
				});
			} ,
			failure: function (error) {
				Ext.Msg.show ({
					title: error.status + ' ' + errorSin.getErrorTitle (error.status) ,
					msg: errorSin.getErrorText (error.status) ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
		});
	} ,
	
	// @brief Starts an author search (the author of the profile)
	startAuthorSearch: function (button) {
		// Hide the profile window
		this.win.hide ();
		
		// Set appropriate URL
		this.storeArticles.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + optionSin.getSearchNumber () + '/author/' + Ext.fly('followerUserServer').dom.innerHTML + '/' + Ext.fly('followerUserName').dom.innerHTML;
		
		// Retrieve articles
		requestSearchArticles (this.storeArticles, null, 0);
	}
});

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
		var storeArticles;
		var storeFollowers;
		var winFollower;
		
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
		winFollower = win;
		storeArticles = this.getRegionsCenterArticlesStore ();
		storeFollowers = this.getRegionsWestFollowersStore ();
	} ,
	
	// @brief Unfollow the user
	setUnfollow: function (button) {
		winFollower.hide ();
		
		// Ajax request
		Ext.Ajax.request ({
			url: optionSin.getUrlServerLtw () + 'setfollow' ,
			// Sending server and user ID of this article
			params: { 
				serverID: document.getElementById('followerUserServer').innerHTML ,
				userID: document.getElementById('followerUserName').innerHTML ,
				value: 0
			} ,
			success: function (response) {
				// Reset the store
				storeFollowers.removeAll ();
				
				// Update URL
				storeFollowers.getProxy().url = optionSin.getUrlServerLtw () + 'followers';
				
				// Reload followers store to refresh user panel
				storeFollowers.load (function (record, option, success) {
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
							storeFollowers.removeAll ();
						}
					}
					else {
						// Ascendent sort for followers
						storeFollowers.sort ('follower' , 'ASC');
					}
					
					var owner = '/' + document.getElementById('followerUserServer').innerHTML + '/' + document.getElementById('followerUserName').innerHTML;
					// Refresh articles windows
					articleSin.setFollowButton (owner, false);
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
		winFollower.hide ();
		
		// Set appropriate URL
		storeArticles.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + optionSin.getSearchNumber () + '/author/' + document.getElementById('followerUserServer').innerHTML + '/' + document.getElementById('followerUserName').innerHTML;
		
		// Retrieve articles
		requestSearchArticles (storeArticles, null, 0);
	} ,
});

// @file 	FocusArticle.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of focus article view

Ext.define ('SC.controller.regions.center.FocusArticle' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.center.FocusArticle'] ,
	
	stores: ['regions.center.Articles' , 'regions.west.Followers'] ,
	models: ['regions.center.Articles' , 'regions.west.Followers'] ,
	
	// Configuration
	init: function () {
		var indexModel;
		var focusModel;
		var likeOrDislike;
		var counterLike, counterDislike, pBarValue;
//		var followersStore;
//		var isFollowed;
		
		// TODO: after render of this window, check like/dislike and follow/unfollow value of this article
		this.control ({
			// Window render
			'focusarticle' : {
				show : this.initFocusWindow ,
				destroy : this.setupDefaults
			} ,
			// I Like button
			'focusarticle button[tooltip="I Like"]' : {
				click : function (button, event) {
					this.setLike (button, event, 1);
				}
			} ,
			// I Dislike button
			'focusarticle button[tooltip="I Dislike"]' : {
				click : function (button, event) {
					this.setLike (button, event, -1);
				}
			} ,
			// Follow button
			'focusarticle button[tooltip="Follow"]' : {
				click : function (button, event) {
					this.setFollow (button, event, 1);
				}
			} ,
			// Unfollow button
			'focusarticle button[tooltip="Unfollow"]' : {
				click : function (button, event) {
					this.setFollow (button, event, 0);
				}
			} ,
			// Reply button
			'focusarticle button[tooltip="Reply"]' : {
				click : this.reply
			} ,
			// Respam button
			'focusarticle button[tooltip="Respam"]' : {
				click : this.respam
			}
		});
	
		console.log ('Controller Focus Article started.');
	} ,
	
	// @brief Set Like
	setLike: function (button, event, val) {
		var postData = focusModel.get ('about');
		
		// If setlike or setdislike is already set, convert val to 1/-1 in 0
		if (((val == 1) && (likeOrDislike == 1)) || ((val == -1) && (likeOrDislike == -1))) {
			val = 0;
		}
		
		// Ajax request
		Ext.Ajax.request ({
			url: 'setlike' ,
			// Sending server, user and post ID of this article
			params: { 
				serverID: postData.split("/")[1] ,
				userID: postData.split("/")[2] ,
				postID: postData.split("/")[3] ,
				value: val
			} ,
			success: function (response) {
				switch (val) {
					// Set like
					case 1:
						button.setIcon ('ext/resources/images/btn-icons/already-like.png');
						counterLike++;
						// If this post was set dislike, change icon of the dislike button and update the dislike counter
						if (likeOrDislike == -1) {
							button.up('window').down('button[tooltip="I Dislike"]').setIcon ('ext/resources/images/btn-icons/dislike.png');
							counterDislike--;
						}
						break;
					// Set dislike
					case -1:
						button.setIcon ('ext/resources/images/btn-icons/already-dislike.png');
						counterDislike++;
						// If this post was set like, change icon of the like button and update the like counter
						if (likeOrDislike == 1) {
							button.up('window').down('button[tooltip="I Like"]').setIcon ('ext/resources/images/btn-icons/like.png');
							counterLike--;
						}
						break;
					// Set neutral
					case 0:
						button.up('window').down('button[tooltip="I Like"]').setIcon ('ext/resources/images/btn-icons/like.png');
						button.up('window').down('button[tooltip="I Dislike"]').setIcon ('ext/resources/images/btn-icons/dislike.png');
						// If this post was set like/dislike, update the appropriate counter
						if (likeOrDislike == 1) counterLike--;
						else if (likeOrDislike == -1) counterDislike--;
						break;
				}
				
				// Percent of progress bar
				pBarValue = counterLike / (counterLike + counterDislike);
			
				// Update like/dislike progress bar
				button.up('window').down('progressbar').updateProgress (pBarValue, counterLike + ' like - ' + counterDislike + ' dislike');
				
				// Update likeOrDislike with new value to avoid another GET of article
				likeOrDislike = val;
			} ,
			failure: function (error) {
				Ext.Msg.show ({
					title: 'Error ' + error.status ,
					msg: error.responseText ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
		});
	} ,
	
	// @brief Set Follow
	setFollow: function (button, event, val) {
		var postData = focusModel.get ('resource');
		
		// Ajax request
		Ext.Ajax.request ({
			url: 'setfollow' ,
			// Sending server and user ID of this article
			params: { 
				serverID: postData.split("/")[1] ,
				userID: postData.split("/")[2] ,
				value: val
			} ,
			success: function (response) {
				// TODO: update user list and refresh user panel
				// On follow: hides follow button and shows the unfollow
				// On unfollow: hides unfollow button and shows the follow
				if (val) {
					button.setVisible (false);
					button.up('window').down('button[tooltip="Unfollow"]').setVisible (true);
				}
				else {
					button.setVisible (false);
					button.up('window').down('button[tooltip="Follow"]').setVisible (true);
				}
			} ,
			failure: function (error) {
				Ext.Msg.show ({
					title: 'Error ' + error.status ,
					msg: error.responseText ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
		});
	} ,
	
	// @brief Reply
	// TODO: all
	reply: function (button, event) {
		var win = button.up('window');
	} ,
	
	// @brief Respam
	respam: function (button, event) {
		var postData = focusModel.get ('about');
		
		// Ajax request
		Ext.Ajax.request ({
			url: 'respam' ,
			// Sending server and user ID of this article
			params: { 
				serverID: postData.split("/")[1] ,
				userID: postData.split("/")[2] ,
				postID: postData.split("/")[3]
			} ,
			success: function (response) {
				Ext.Msg.show ({
					title: 'Success!' ,
					msg: "Respam was successful!" ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.OK
				});
			} ,
			failure: function (error) {
				Ext.Msg.show ({
					title: 'Error ' + error.status ,
					msg: error.responseText ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
		});
	} ,
	
	// @brief Initialize vars and window layout, even geolocation
	initFocusWindow: function (win) {
		// Getting model associated with
		indexModel = win.down('button[tooltip="focusModelIndex"]').getText ();
		focusModel = this.getRegionsCenterArticlesStore().getRange()[indexModel];
		
		// Retrieve user setlike value
		likeOrDislike = findSetLike (focusModel.get ('article'));
		
		// Like and Dislike counters
		counterLike = parseInt (findCounters (focusModel.get ('article'), 'Like'));
		counterDislike = parseInt (findCounters (focusModel.get ('article'), 'Dislike'));
		
		// Check if counter like/dislike span tag exists
		if ((counterLike != -1) && (counterDislike != -1)) {
			// Percent of progress bar
			pBarValue = counterLike / (counterLike + counterDislike);
			
			// Update like/dislike progress bar
			win.down('progressbar').updateProgress (pBarValue, counterLike + ' like - ' + counterDislike + ' dislike');
		}
		
		// Check if browser can support geolocation to prevent useless operations
		if (browserGeoSupportFlag) {
			// Set new coords
			var coords = findGeoLocation (focusModel.get ('article'));
			
			// Check if geolocation span tag exists
			if (coords != null) {
				var latlng = new google.maps.LatLng (coords.lat, coords.lng);
				googleMap.setCenter (latlng);
				googleMap.setZoom (5);
			}
		}
		
		// If user set like, change the icon of 'I like' button
		if (likeOrDislike == 1) {
			win.down('button[tooltip="I Like"]').setIcon ('ext/resources/images/btn-icons/already-like.png');
		}
		// If user set dislike, change the icon of 'I Dislike' button
		else if (likeOrDislike == -1) {
			win.down('button[tooltip="I Dislike"]').setIcon ('ext/resources/images/btn-icons/already-dislike.png');
		}
		
//		followersStore = this.getRegionsWestFollowersStore ();
//		
//		for (var m in followersStore.getRange ()) {
//			if (m.get ('follower') == focusModel.get ('resource')) {
//				isFollowed = true;
//				break;
//			}
//		}
		
		// Followers
		// TODO: activate it
//		if (isFollowed) {
//			win.down('button[tooltip="Follow"]').setVisible (false);
//			win.down('button[tooltip="Unfollow"]').setVisible (true)
//		}
	} ,
	
	// @brief Setup default values
	setupDefaults: function (win) {
		// Check if browser can support geolocation to prevent useless operations
		if (browserGeoSupportFlag) {
			// Set default coords and zoom
			var latlng = new google.maps.LatLng (0, 0);
			googleMap.setCenter (latlng);
			googleMap.setZoom (0);
		}
	}
});

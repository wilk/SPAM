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
		var followersStore;
		var isFollowed;
		var focusUser;
		var focusWindow;
		
		this.control ({
			// Window render
			'focusarticle' : {
				show : this.initFocusWindow ,
				destroy : this.setupDefaults
			} ,
			// I Like button
			'focusarticle button[tooltip="I Like"]' : {
				click : function (button, event) {
					this.setLike (button, event, '+1');
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
		if (((val == '+1') && (likeOrDislike == 1)) || ((val == -1) && (likeOrDislike == -1))) {
			val = 0;
		}
		
		// Setup loading mask
		focusWindow.setLoading (true);
		
		// Ajax request
		Ext.Ajax.request ({
			url: optionSin.getUrlServerLtw () + 'setlike' ,
			// Sending server, user and post ID of this article
			params: {
				serverID: focusModel.get ('server') ,
				userID: focusModel.get ('user') ,
				postID: focusModel.get ('post') ,
				value: encodeURIComponent (val)
			} ,
			success: function (response) {
				switch (val) {
					// Set like
					case '+1':
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
				likeOrDislike = parseInt (val);
				
				// Unset loading mask
				focusWindow.setLoading (false);
			} ,
			failure: function (error) {
				Ext.Msg.show ({
					title: error.status + ' ' + errorSin.getErrorTitle (error.status) ,
					msg: errorSin.getErrorText (error.status) ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
				
				// Unset loading mask
				focusWindow.setLoading (false);
			}
		});
	} ,
	
	// @brief Set Follow
	setFollow: function (button, event, val) {
		var postData = focusModel.get ('resource');
		
		// Setup loading mask
		focusWindow.setLoading (true);
		
		// Ajax request
		Ext.Ajax.request ({
			url: optionSin.getUrlServerLtw () + 'setfollow' ,
			// Sending server and user ID of this article
			params: { 
				serverID: focusModel.get ('server') ,
				userID: focusModel.get ('user') ,
				value: val
			} ,
			success: function (response) {
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
				
				// Clean the store
				followersStore.removeAll ();
				
				// Update proxy url
				followersStore.getProxy().url = optionSin.getUrlServerLtw () + 'followers';
				
				// Reload followers store to refresh user panel
				followersStore.load (function (record, option, success) {
					if (! success) {
						var err = option.getError ();
						// If 404 is returned, ignore it because or user isn't logged in or hasn't followers
						if (err.status != 404) {
							Ext.Msg.show ({
								title: error.status + ' ' + errorSin.getErrorTitle (error.status) ,
								msg: errorSin.getErrorText (error.status) ,
								buttons: Ext.Msg.OK,
								icon: Ext.Msg.ERROR
							});
						
							// If there aren't followers, remove all previous (old) followers from the store
							followersStore.removeAll ();
						}
					}
					else {
						// Ascendent sort for followers
						followersStore.sort ('follower' , 'ASC');
					}
				});
				
				// Unset loading mask
				focusWindow.setLoading (false);
			} ,
			failure: function (error) {
				Ext.Msg.show ({
					title: error.status + ' ' + errorSin.getErrorTitle (error.status) ,
					msg: errorSin.getErrorText (error.status) ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
				
				// Unset loading mask
				focusWindow.setLoading (false);
			}
		});
	} ,
	
	// @brief Reply to a post
	reply: function (button, event) {
		// Setup reply singleton
		replySin.setToReply (true);
		replySin.setServerID (focusModel.get ('server'));
		replySin.setUserID (focusModel.get ('user'));
		replySin.setPostID (focusModel.get ('post'));
		
		// Show select window
		Ext.getCmp('windowSelectPost').show ();
	} ,
	
	// @brief Respam
	respam: function (button, event) {
		var postData = focusModel.get ('about');
		
		// Setup loading mask
		focusWindow.setLoading (true);
		
		// Ajax request
		Ext.Ajax.request ({
			url: optionSin.getUrlServerLtw () + 'respam' ,
			// Sending server and user ID of this article
			params: { 
				serverID: focusModel.get ('server') ,
				userID: focusModel.get ('user') ,
				postID: focusModel.get ('post')
			} ,
			success: function (response) {
				Ext.Msg.show ({
					title: response.status + ' : success!' ,
					msg: "Respam was successful! +1!" ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.INFO
				});
				
				// Unset loading mask
				focusWindow.setLoading (false);
			} ,
			failure: function (error) {
				Ext.Msg.show ({
					title: error.status + ' ' + errorSin.getErrorTitle (error.status) ,
					msg: errorSin.getErrorText (error.status) ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
				
				// Unset loading mask
				focusWindow.setLoading (false);
			}
		});
	} ,
	
	// @brief Initialize vars and window layout, even geolocation
	initFocusWindow: function (win) {
		focusWindow = win;
		// Getting model associated with
		indexModel = win.down('button[tooltip="focusModelIndex"]').getText ();
		focusModel = this.getRegionsCenterArticlesStore().getRange()[indexModel];
		followersStore = this.getRegionsWestFollowersStore ();
		
		// Retrieve the owner of the post
		focusUser = focusModel.get ('user');
		
		// Retrieve user setlike value
		likeOrDislike = focusModel.get ('setlike');
		
		// Like and Dislike counters
		counterLike = focusModel.get ('like');
		counterDislike = focusModel.get ('dislike');
		
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
			var latlng = new google.maps.LatLng (focusModel.get ('glLat'), focusModel.get ('glLong'));
			googleMap.setCenter (latlng);
			googleMap.setZoom (5);
		}
		
		// If user set like, change the icon of 'I like' button
		if (likeOrDislike == 1) {
			win.down('button[tooltip="I Like"]').setIcon ('ext/resources/images/btn-icons/already-like.png');
		}
		// If user set dislike, change the icon of 'I Dislike' button
		else if (likeOrDislike == -1) {
			win.down('button[tooltip="I Dislike"]').setIcon ('ext/resources/images/btn-icons/already-dislike.png');
		}
		
		// Check if user is already logged-in: if he is, show every buttons
		// If there is server cookie
		if (Ext.util.Cookies.get ('ltwlogin') != null)
		{
			// And if there is client cookie
			if (Ext.util.Cookies.get ('SPAMlogin') != null) {
				// Hide setlike buttons because user can't set like/dislike on his own post
				if (focusUser != Ext.util.Cookies.get ('SPAMlogin')) {
					win.down('button[tooltip="I Like"]').setVisible (true);
					win.down('button[tooltip="I Dislike"]').setVisible (true);
					win.down('button[tooltip="Respam"]').setVisible (true);
				}
				
				win.down('button[tooltip="Reply"]').setVisible (true);
				
				isFollowed = false;
				
				// If there are followers
				if (followersStore.getCount () != 0) {
					// Find if user of the focus article is already followed
					followersStore.each (function (record) {
						if (record.get ('follower') == focusModel.get ('resource')) {
							isFollowed = true;
						}
					});
				}
				else {
					isFollowed = false;
				}
				
				// Hide setfollow buttons because user can't set follow/unfollow himself
				if (focusUser != Ext.util.Cookies.get ('SPAMlogin')) {
					// If user is already followed, shows the unfollow button
					if (isFollowed) {
						win.down('button[tooltip="Unfollow"]').setVisible (true);
						win.down('button[tooltip="Follow"]').setVisible (false);
					}
					// Otherwise shows the follow button
					else {
						win.down('button[tooltip="Follow"]').setVisible (true);
						win.down('button[tooltip="Unfollow"]').setVisible (false);
					}
				}
			}
		}
		// Otherwise, hide buttons
		// This option is for refresh by login/logout
		else {
			win.down('button[tooltip="I Like"]').setVisible (false);
			win.down('button[tooltip="I Dislike"]').setVisible (false);
			win.down('button[tooltip="Follow"]').setVisible (false);
			win.down('button[tooltip="Unfollow"]').setVisible (false);
			win.down('button[tooltip="Reply"]').setVisible (false);
			win.down('button[tooltip="Respam"]').setVisible (false);
		}
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

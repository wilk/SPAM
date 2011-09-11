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
			// Focus button
			'focusarticle button[tooltip="Focus"]' : {
				click : this.setFocus
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
	} ,
	
	// @brief Initialize vars and window layout, even geolocation
	initFocusWindow: function (win) {
		try {
			// Index of the appropriate model
			win.focusStore = this.getRegionsCenterArticlesStore();
			win.indexModel = win.focusStore.find ('about' , win.aboutModel);
			win.focusModel = win.focusStore.getRange()[win.indexModel];
			win.followersStore = this.getRegionsWestFollowersStore ();
		
			// Retrieve the owner of the post
			win.focusUser = win.focusModel.get ('user');
		
			// Retrieve user setlike value
			win.likeOrDislike = win.focusModel.get ('setlike');
		
			// Like and Dislike counters
			win.counterLike = win.focusModel.get ('like');
			win.counterDislike = win.focusModel.get ('dislike');
		
			// Check if counter like/dislike span tag exists
			if ((win.counterLike != -1) && (win.counterDislike != -1)) {
				// Percent of progress bar
				win.pBarValue = win.counterLike / (win.counterLike + win.counterDislike);
			
				// Update like/dislike progress bar
				win.down('progressbar').updateProgress (win.pBarValue, win.counterLike + ' like - ' + win.counterDislike + ' dislike');
			}
		
			// Check if browser can support geolocation to prevent useless operations
			if (geolocSin.isSupported ()) {
				// If location is (0.0 , 0.0), do not zoom
				if (!((win.focusModel.get ('glLat') == 0) && (win.focusModel.get ('glLong') == 0))) {
					// Set new coords
					var latlng = new google.maps.LatLng (win.focusModel.get ('glLat'), win.focusModel.get ('glLong'));
					var gMap = geolocSin.getMap ();
					gMap.setCenter (latlng);
					gMap.setZoom (5);
				}
			}
		
			// If user set like, change the icon of 'I like' button
			if (win.likeOrDislike == 1) {
				win.down('button[tooltip="I Like"]').setIcon ('ext/resources/images/btn-icons/already-like.png');
			}
			// If user set dislike, change the icon of 'I Dislike' button
			else if (win.likeOrDislike == -1) {
				win.down('button[tooltip="I Dislike"]').setIcon ('ext/resources/images/btn-icons/already-dislike.png');
			}
		
			// Check if user is already logged-in: if he is, show every buttons
			// If there is server cookie
			if (checkIfUserLogged ()) {
				// Hide setlike buttons because user can't set like/dislike on his own post
				if (win.focusUser != Ext.util.Cookies.get ('SPAMlogin')) {
					win.down('button[tooltip="I Like"]').setVisible (true);
					win.down('button[tooltip="I Dislike"]').setVisible (true);
				}
				
				win.down('button[tooltip="Respam"]').setVisible (true);
				win.down('button[tooltip="Reply"]').setVisible (true);
			
				// If there are followers
				if (win.followersStore.getCount () != 0) {
					// Find if user of the focus article is already followed
					win.followersStore.each (function (record) {
						// TODO: check if this check is correct
						if ('/' + record.get ('follower') == win.focusModel.get ('resource')) {
							win.isFollowed = true;
						}
					}, win);
				}
			
				// Hide setfollow buttons because user can't set follow/unfollow himself
				if (win.focusUser != Ext.util.Cookies.get ('SPAMlogin')) {
					// If user is already followed, shows the unfollow button
					if (win.isFollowed) {
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
		}
		catch (err) {
			Ext.Msg.show ({
				title: err.name ,
				msg: err.message ,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.ERROR
			});
		}
	} ,
	
	// @brief Setup default values
	setupDefaults: function (win) {
		// Check if browser can support geolocation to prevent useless operations
		if (geolocSin.isSupported ()) {
			// Set default coords and zoom
			var latlng = new google.maps.LatLng (0.0, 0.0);
			var gMap = geolocSin.getMap ();
			gMap.setCenter (latlng);
			gMap.setZoom (0);
		}
		
		// Reset model id of the focus
		articleSin.delFocus ();
	} ,
	
	// @brief Set Like
	setLike: function (button, event, val) {
		var win = button.up ('window');
		
		// If setlike or setdislike is already set, convert val to 1/-1 in 0
		if (((val == '+1') && (win.likeOrDislike == 1)) || ((val == -1) && (win.likeOrDislike == -1))) {
			val = 0;
		}
		
		// Setup loading mask
		win.setLoading (true);
		
		// Ajax request
		Ext.Ajax.request ({
			url: optionSin.getUrlServerLtw () + 'setlike' ,
			// Sending server, user and post ID of this article
			params: {
				serverID: win.focusModel.get ('server') ,
				userID: win.focusModel.get ('user') ,
				postID: win.focusModel.get ('post') ,
				value: encodeURIComponent (val)
			} ,
			success: function (response) {
				switch (val) {
					// Set like
					case '+1':
						button.setIcon ('ext/resources/images/btn-icons/already-like.png');
						win.counterLike++;
						// If this post was set dislike, change icon of the dislike button and update the dislike counter
						if (win.likeOrDislike == -1) {
							win.down('button[tooltip="I Dislike"]').setIcon ('ext/resources/images/btn-icons/dislike.png');
							win.counterDislike--;
						}
						break;
					// Set dislike
					case -1:
						button.setIcon ('ext/resources/images/btn-icons/already-dislike.png');
						win.counterDislike++;
						// If this post was set like, change icon of the like button and update the like counter
						if (win.likeOrDislike == 1) {
							win.down('button[tooltip="I Like"]').setIcon ('ext/resources/images/btn-icons/like.png');
							win.counterLike--;
						}
						break;
					// Set neutral
					case 0:
						win.down('button[tooltip="I Like"]').setIcon ('ext/resources/images/btn-icons/like.png');
						win.down('button[tooltip="I Dislike"]').setIcon ('ext/resources/images/btn-icons/dislike.png');
						// If this post was set like/dislike, update the appropriate counter
						if (win.likeOrDislike == 1) win.counterLike--;
						else if (win.likeOrDislike == -1) win.counterDislike--;
						break;
				}
				
				// Percent of progress bar
				win.pBarValue = win.counterLike / (win.counterLike + win.counterDislike);
			
				// Update like/dislike progress bar
				win.down('progressbar').updateProgress (win.pBarValue, win.counterLike + ' like - ' + win.counterDislike + ' dislike');
				
				// Update likeOrDislike with new value to avoid another GET of article
				win.likeOrDislike = parseInt (val);
				
				// Unset loading mask
				win.setLoading (false);
			} ,
			failure: function (error) {
				Ext.Msg.show ({
					title: error.status + ' ' + errorSin.getErrorTitle (error.status) ,
					msg: errorSin.getErrorText (error.status) ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
				
				// Unset loading mask
				win.setLoading (false);
			}
		});
	} ,
	
	// @brief Set Follow
	setFollow: function (button, event, val) {
		var win = button.up ('window');
		
		// Setup loading mask
		win.setLoading (true);
		
		// Ajax request
		Ext.Ajax.request ({
			url: optionSin.getUrlServerLtw () + 'setfollow' ,
			// Sending server and user ID of this article
			params: { 
				serverID: win.focusModel.get ('server') ,
				userID: win.focusModel.get ('user') ,
				value: val
			} ,
			success: function (response) {
				// Clean the store
				win.followersStore.removeAll ();
				
				// Update proxy url
				win.followersStore.getProxy().url = optionSin.getUrlServerLtw () + 'followers';
				
				// Reload followers store to refresh user panel
				win.followersStore.load (function (record, option, success) {
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
							win.followersStore.removeAll ();
						}
					}
					else {
						// Ascendent sort for followers
						win.followersStore.sort ('follower' , 'ASC');
					}
					
					// Refresh articles window
					articleSin.setFollowButton (win.focusModel.get ('resource'), (val == 1 ? true : false));
				}, win);
				
				// Unset loading mask
				win.setLoading (false);
			} ,
			failure: function (error) {
				Ext.Msg.show ({
					title: error.status + ' ' + errorSin.getErrorTitle (error.status) ,
					msg: errorSin.getErrorText (error.status) ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
				
				// Unset loading mask
				win.setLoading (false);
			}
		});
	} ,
	
	// @brief Set focus on this article
	setFocus: function (button, event) {
		// Retrieve his window container
		var win = button.up ('window');
		
		// Set appropriate URL
		win.focusStore.getProxy().url = optionSin.getUrlServerLtw () + 'search/10/affinity' + win.aboutModel;
	
		// Retrieve articles
		requestSearchArticles (win.focusStore, win.focusModel, win.indexModel);
	} ,
	
	// @brief Reply to a post
	reply: function (button, event) {
		var win = button.up ('window');
		// Setup reply singleton
		replySin.setToReply (true);
		replySin.setServerID (win.focusModel.get ('server'));
		replySin.setUserID (win.focusModel.get ('user'));
		replySin.setPostID (win.focusModel.get ('post'));
		
		// Show select window
		Ext.getCmp('windowSelectPost').show ();
	} ,
	
	// @brief Respam
	respam: function (button, event) {
		var win = button.up ('window');
		
		// Setup loading mask
		win.setLoading (true);
		
		// Ajax request
		Ext.Ajax.request ({
			url: optionSin.getUrlServerLtw () + 'respam' ,
			// Sending server and user ID of this article
			params: { 
				serverID: win.focusModel.get ('server') ,
				userID: win.focusModel.get ('user') ,
				postID: win.focusModel.get ('post')
			} ,
			success: function (response) {
				Ext.Msg.show ({
					title: response.status + ' : success!' ,
					msg: "Respam was successful! +1!" ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.INFO
				});
				
				// Unset loading mask
				win.setLoading (false);
			} ,
			failure: function (error) {
				Ext.Msg.show ({
					title: error.status + ' ' + errorSin.getErrorTitle (error.status) ,
					msg: errorSin.getErrorText (error.status) ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
				
				// Unset loading mask
				win.setLoading (false);
			}
		});
	}
});

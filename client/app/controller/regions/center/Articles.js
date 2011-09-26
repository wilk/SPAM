// @file 	Articles.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of articles view

Ext.define ('SC.controller.regions.center.Articles' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.center.Articles'] ,
	
	stores: ['regions.center.Articles' , 'regions.west.Followers'] ,
	models: ['regions.center.Articles' , 'regions.west.Followers'] ,
	
	// Configuration
	init: function () {
		// Variables are attached to single window
		this.control ({
			'articles' : {
				show : this.initFocusWindow ,
				destroy : this.setupDefaults
			} ,
			// I Like button
			'articles button[tooltip="I Like"]' : {
				click : function (button, event) {
					this.setLike (button, event, '+1');
				}
			} ,
			// I Dislike button
			'articles button[tooltip="I Dislike"]' : {
				click : function (button, event) {
					this.setLike (button, event, -1);
				}
			} ,
			// Follow button
			'articles button[tooltip="Follow"]' : {
				click : function (button, event) {
					this.setFollow (button, event, 1);
				}
			} ,
			// Unfollow button
			'articles button[tooltip="Unfollow"]' : {
				click : function (button, event) {
					this.setFollow (button, event, 0);
				}
			} ,
			// Focus button
			'articles button[tooltip="Focus"]' : {
				click : this.setFocus
			} ,
			// Reply button
			'articles button[tooltip="Reply"]' : {
				click : this.reply
			} ,
			// Respam button
			'articles button[tooltip="Respam"]' : {
				click : this.respam
			}
		});
	} ,
	
	// @brief Initialize vars and window layout
	initFocusWindow: function (win) {
		try {
			win.articleStore = this.getRegionsCenterArticlesStore ();
			
			// Index of the appropriate model
			win.indexModel = win.articleStore.find ('about' , win.aboutModel);
			win.articleModel = win.articleStore.getRange()[win.indexModel];
			win.followersStore = this.getRegionsWestFollowersStore ();

			// Retrieve the owner of the post
			win.articleUser = win.articleModel.get ('user');
			
			// Retrieve user setlike value
			win.likeOrDislike = win.articleModel.get ('setlike');
		
			// Like and Dislike counters
			win.counterLike = win.articleModel.get ('like');
			win.counterDislike = win.articleModel.get ('dislike');
		
			// Check if counter like/dislike span tag exists
			if ((win.counterLike != -1) && (win.counterDislike != -1)) {
				// Percent of progress bar
				win.pBarValue = win.counterLike / (win.counterLike + win.counterDislike);
			
				// Update like/dislike progress bar
				win.down('progressbar').updateProgress (win.pBarValue, win.counterLike + ' like - ' + win.counterDislike + ' dislike');
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
			if (checkIfUserLogged ()) {
		
				// Hide setlike buttons because user can't set like/dislike on his own post
				if (win.articleUser != Ext.util.Cookies.get ('SPAMlogin')) {
					win.down('button[tooltip="I Like"]').setVisible (true);
					win.down('button[tooltip="I Dislike"]').setVisible (true);
					win.down('button[tooltip="Respam"]').setVisible (true);
				}
			
				win.down('button[tooltip="Reply"]').setVisible (true);
			
				// If there are followers
				if (win.followersStore.getCount () != 0) {
					// Find if user of the focus article is already followed
					win.followersStore.each (function (record) {
						// TODO: check this check
						if ('/' + record.get ('follower') == win.articleModel.get ('resource')) {
							win.isFollowed = true;
						}
					}, win);
				}
				
				// Hide setfollow buttons because user can't set follow/unfollow himself
				if (win.articleUser != Ext.util.Cookies.get ('SPAMlogin')) {
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
	
	// @brief Remove the article ID from the article singleton
	setupDefaults: function (win) {
		articleSin.delArticleFromList (win);
	} ,
	
	// @brief Set Like
	setLike: function (button, event, val) {
		// Retrieve his window container
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
				serverID: win.articleModel.get ('server') ,
				userID: win.articleModel.get ('user') ,
				postID: win.articleModel.get ('post') ,
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
		// Retrieve his window container
		var win = button.up ('window');
		
		// Setup loading mask
		win.setLoading (true);
		
		// Ajax request
		Ext.Ajax.request ({
			url: optionSin.getUrlServerLtw () + 'setfollow' ,
			scope: win ,
			// Sending server and user ID of this article
			params: { 
				serverID: win.articleModel.get ('server') ,
				userID: win.articleModel.get ('user') ,
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
					
					// Refresh articles windows
					articleSin.setFollowButton (win.articleModel.get ('resource'), (val == 1 ? true : false));
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
	} ,
	
	// @brief Set focus on this article
	setFocus: function (button, event) {
		// Retrieve his window container
		var win = button.up ('window');
		
		// Set appropriate URL
		win.articleStore.getProxy().url = optionSin.getUrlServerLtw () + 'search/10/affinity' + win.aboutModel;
	
		// Retrieve articles
		requestSearchArticles (win.articleStore, win.articleModel, win.indexModel);
	} ,
	
	// @brief Reply to a post
	reply: function (button, event) {
		// Retrieve his window container
		var win = button.up ('window');
		
		// Setup reply singleton
		replySin.setToReply (true);
		replySin.setServerID (win.articleModel.get ('server'));
		replySin.setUserID (win.articleModel.get ('user'));
		replySin.setPostID (win.articleModel.get ('post'));
		
		// Show select window
		Ext.getCmp('windowSelectPost').show ();
	} ,
	
	// @brief Respam
	respam: function (button, event) {
		// Retrieve his window container
		var win = button.up ('window');
		
		// Setup loading mask
		win.setLoading (true);
		
		// Ajax request
		Ext.Ajax.request ({
			url: optionSin.getUrlServerLtw () + 'respam' ,
			// Sending server and user ID of this article
			params: { 
				serverID: win.articleModel.get ('server') ,
				userID: win.articleModel.get ('user') ,
				postID: win.articleModel.get ('post')
			} ,
			success: function (response) {
				// Unset loading mask
				win.setLoading (false);
				
				// Set appropriate URL with username of the user already logged-in
				win.articleStore.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + optionSin.getSearchNumber () + '/author/' + optionSin.getServerID () + '/' + optionSin.getCurrentUser ();
					
				// Retrieve articles
				requestSearchArticles (win.articleStore, null, 0);
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

// @file 	Singletons.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Set of singletons

// @brief Singleton for reply action
Ext.define ('replySin' , {
	singleton: true ,
	
	// Vars
	serverID: '' ,
	userID: '' ,
	postID: '' ,
	isToReply: false ,
	
	// Getters
	getServerID : function () {
		return this.serverID;
	} ,
	getUserID : function () {
		return this.userID;
	} ,
	getPostID : function () {
		return this.postID;
	} ,
	
	// Setters
	setServerID : function (id) {
		this.serverID = id;
	} ,
	setUserID : function (id) {
		this.userID = id;
	} ,
	setPostID : function (id) {
		this.postID = id;
	} ,
	setToReply : function (cond) {
		this.isToReply = cond;
	} ,
	
	// Return true if the post is a reply, false if not
	isReplying : function () {
		return this.isToReply;
	}
});

// @brief Singleton for error handler
Ext.define ('errorSin' , {
	singleton: true ,
	
	// Getters
	getErrorTitle: function (errorCode) {
		var title;
				
		switch (errorCode) {
			case 401:
				title = 'Unauthorized';
				break;
			case 404:
				title = 'Not Found';
				break;
			case 405:
				title = 'Method Not Allowed';
				break;
			case 406:
				title = 'Not Acceptable';
				break;
			case 500:
				title = 'Internal Server Error';
				break;
			case 501:
				title = 'Not Implemented';
				break;
			default:
				title = 'Unhandled';
				break;
		}
		
		return title;
	} ,
	getErrorText: function (errorCode) {
		var text;
		
		switch (errorCode) {
			case 401:
				text = 'The request requires user authentication.';
				break;
			case 404:
				text = 'The server has not found anything matching the Request-URI.';
				break;
			case 405:
				text = 'The method specified in the Request-Line is not allowed<br />for the resource identified by the Request-URI.';
				break;
			case 406:
				text = 'The resource identified by the request is only capable<br />of generating response entities which have content characteristics not acceptable according<br /> to the accept headers sent in the request';
				break;
			case 500:
				text = 'The server encountered an unexpected condition which<br />prevented it from fulfilling the request. ';
				break;
			case 501:
				text = 'The server does not support the functionality required to fulfill the request.';
				break;
			default:
				text = 'Unhandled error';
				break;
		}
		
		return text;
	}
});

// @brief Singleton for options
Ext.define ('optionSin' , {
	singleton: true ,
	
	// Vars
	// Server url with credentials (cross-browsing : http://ltw1102.web.cs.unibo.it/server-related/Spammers)
	urlServerLtw: '' ,
	// Server url without credentials (http://ltw1102.web.cs.unibo.it/)
	pureUrlServerLtw: '' ,
	serverID: '' ,
	currentUser: '' ,
	
	// Getters
	getUrlServerLtw : function () {
		return this.urlServerLtw;
	} ,
	getPureUrlServerLtw : function () {
		return this.pureUrlServerLtw;
	} ,
	getServerID : function () {
		return this.serverID;
	} ,
	getCurrentUser : function () {
		return this.currentUser;
	} ,
	
	// Setters
	setUrlServerLtw : function (url) {
		this.urlServerLtw = url;
	} ,
	setPureUrlServerLtw : function (url) {
		this.pureUrlServerLtw = url;
	} ,
	setServerID : function (id) {
		this.serverID = id;
	} ,
	setCurrentUser : function (id) {
		this.currentUser = id;
	} ,
	
	// Reset variables (urls and id)
	resetOption : function () {
//		urlServerLtw = 'http://ltw1102.web.cs.unibo.it/';
//		pureUrlServerLtw = 'http://ltw1102.web.cs.unibo.it';
		this.urlServerLtw = '';
		this.pureUrlServerLtw = '';
		this.serverID = 'Spammers';
	} ,
	resetCurrentUser : function () {
		this.currentUser = '';
	}
});

// @brief Singleton for geolocation
Ext.define ('geolocSin' , {
	singleton: true ,
	
	// Vars
	geoSpan: '' ,
	googleMap: null ,
	browserGeoSupportFlag: false ,
	
	// Getters
	getSpan : function () {
		return this.geoSpan;
	} ,
	getMap : function () {
		return this.googleMap;
	} ,
	
	// Setters
	setSpan : function (tag) {
		this.geoSpan = tag;
	} ,
	setMap : function (el, opt) {
		this.googleMap = new google.maps.Map (el, opt);
	} ,
	
	// Initialize geolocation if the browser supports it
	initialize : function () {
		this.browserGeoSupportFlag = (navigator.geolocation) ? true : false;
	} ,
	isSupported : function () {
		return this.browserGeoSupportFlag;
	} ,
	// Add a marker to the map
	addMarker : function (pos, owner) {
		if (pos != null) {
			var marker = new google.maps.Marker ({
				position: pos ,
				map: this.googleMap ,
				title: owner
			});
			// Attach the click event
			google.maps.event.addListener(marker, 'click', this.showCoords);
		}
	} ,
	showCoords : function (event) {
		Ext.Msg.show ({
			title: 'Coords of ' + this.title ,
			msg: 'Latitude : ' + event.latLng.lat () + '<br />Longitude : ' + event.latLng.lng () ,
			buttons: Ext.Msg.OK,
			icon: Ext.Msg.INFO
		});
	}
});

// @brief Singleton for article windows
//        It keeps a point to every article windows, even that focus one.
Ext.define ('articleSin' , {
	singleton: true ,
	
	// Vars
	articleList: new Array () ,
	// focusArticle is an array because javascript has some problems with object pointer
	focusArticle: new Array () ,
	
	// Add a new article
	addArticle: function (article) {
		this.articleList.push (article);
	} ,
	
	// Set the Focus article
	setFocus: function (focus) {
		this.focusArticle.push (focus);
	} ,
	
	// Remove focus article
	delFocus: function () {
		Ext.Array.erase (this.focusArticle, 0, this.focusArticle.length);
	} ,
	
	// Destroy every article windows, even the Focus one
	destroyAll: function () {
		// Destroy each article window and empty the array
		while (this.articleList.length > 0) {
			var win = this.articleList.pop ();
			
			if (win != null) win.destroy ();
		}
		
		// Same thing with focus window
		var focus = this.focusArticle.pop ();
		
		if (focus != null) focus.destroy ();
	} ,
	
	// Destroy passed article
	delArticleFromList: function (article) {
		var index = Ext.Array.indexOf (this.articleList, article);
		
		if (index != -1) Ext.Array.erase (this.articleList, index, 1);
	} ,
	
	// Show/Hide follow/unfollow button of every article window, even the Focus one
	// user: /serverID/userID
	// toFollow: true/false
	setFollowButton: function (user, toFollow) {
		// Article windows
		Ext.Array.each (this.articleList, function (win, index, myself) {
			if (win.articleModel.get ('resource') == user) {
				// If it's to follow, shows the unfollow button
				if (toFollow) {
					win.isFollowed = true;
					win.down('button[tooltip="Unfollow"]').setVisible (true);
					win.down('button[tooltip="Follow"]').setVisible (false);
				}
				// Otherwise shows the follow button
				else {
					win.isFollowed = false;
					win.down('button[tooltip="Follow"]').setVisible (true);
					win.down('button[tooltip="Unfollow"]').setVisible (false);
				}
			}
		}, this);
		
		// Focus window
		Ext.Array.each (this.focusArticle, function (win, index, myself) {
			if (win.focusModel.get ('resource') == user) {
				// If it's to follow, shows the unfollow button
				if (toFollow) {
					win.isFollowed = true;
					win.down('button[tooltip="Unfollow"]').setVisible (true);
					win.down('button[tooltip="Follow"]').setVisible (false);
				}
				// Otherwise shows the follow button
				else {
					win.isFollowed = false;
					win.down('button[tooltip="Follow"]').setVisible (true);
					win.down('button[tooltip="Unfollow"]').setVisible (false);
				}
			}
		}, this);
	} ,
	
	// Hides/Shows appropriate buttons
	// E.g. : user can only respam, reply and focus on his posts
	// but he can't setLike or setFollow on his posts.
	setLoginButton: function () {
		var owner = '/' + optionSin.getServerID () + '/' + optionSin.getCurrentUser ();
		
		// Articles buttons
		Ext.Array.each (this.articleList, function (win, index, myself) {
			win.down('button[tooltip="Reply"]').setVisible (true);
			win.down('button[tooltip="Respam"]').setVisible (true);
			
			// Current user can't follow or like/dislike his posts, so doesn't show
			// to him the following buttons
			if (win.articleModel.get ('resource') != owner) {
				// Follow button
				if (win.isFollowed) win.down('button[tooltip="Unfollow"]').setVisible (true);
				else win.down('button[tooltip="Follow"]').setVisible (true);
				
				// Like/Dislike button
				// If user set like, change the icon of 'I like' button
				if (win.likeOrDislike == 1) {
					win.down('button[tooltip="I Like"]').setIcon ('ext/resources/images/btn-icons/already-like.png');
				}
				// If user set dislike, change the icon of 'I Dislike' button
				else if (win.likeOrDislike == -1) {
					win.down('button[tooltip="I Dislike"]').setIcon ('ext/resources/images/btn-icons/already-dislike.png');
				}
				
				win.down('button[tooltip="I Like"]').setVisible (true);
				win.down('button[tooltip="I Dislike"]').setVisible (true);
			}
		}, this);
		
		// Focus
		// Reply/Respam
		Ext.Array.each (this.focusArticle, function (win, index, myself) {
			win.down('button[tooltip="Reply"]').setVisible (true);
			win.down('button[tooltip="Respam"]').setVisible (true);
		
			// Setlike/Setfollow
			if (win.focusModel.get ('resource') != owner) {
				// Follow button
				if (win.isFollowed) win.down('button[tooltip="Unfollow"]').setVisible (true);
				else win.down('button[tooltip="Follow"]').setVisible (true);
			
				// Like/Dislike button
				// If user set like, change the icon of 'I like' button
				if (win.likeOrDislike == 1) {
					win.down('button[tooltip="I Like"]').setIcon ('ext/resources/images/btn-icons/already-like.png');
				}
				// If user set dislike, change the icon of 'I Dislike' button
				else if (win.likeOrDislike == -1) {
					win.down('button[tooltip="I Dislike"]').setIcon ('ext/resources/images/btn-icons/already-dislike.png');
				}
			
				win.down('button[tooltip="I Like"]').setVisible (true);
				win.down('button[tooltip="I Dislike"]').setVisible (true);
			}
		}, this);
	} ,
	
	// Hides every button when user logout, leaving only the focus button
	setLogoutButton: function () {
		// Articles
		Ext.Array.each (this.articleList, function (win, index, myself) {
			win.down('button[tooltip="I Like"]').setVisible (false);
			win.down('button[tooltip="I Dislike"]').setVisible (false);
			win.down('button[tooltip="Follow"]').setVisible (false);
			win.down('button[tooltip="Unfollow"]').setVisible (false);
			win.down('button[tooltip="Reply"]').setVisible (false);
			win.down('button[tooltip="Respam"]').setVisible (false);
		}, this);
		
		// Focus
		Ext.Array.each (this.focusArticle, function (win, index, myself) {
			win.down('button[tooltip="I Like"]').setVisible (false);
			win.down('button[tooltip="I Dislike"]').setVisible (false);
			win.down('button[tooltip="Follow"]').setVisible (false);
			win.down('button[tooltip="Unfollow"]').setVisible (false);
			win.down('button[tooltip="Reply"]').setVisible (false);
			win.down('button[tooltip="Respam"]').setVisible (false);
		}, this);
	}
});

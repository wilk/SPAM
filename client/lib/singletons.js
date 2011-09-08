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
			title: 'Coords' ,
			msg: 'Latitude : ' + event.latLng.lat () + '<br />Longitude : ' + event.latLng.lng () ,
			buttons: Ext.Msg.OK,
			icon: Ext.Msg.INFO
		});
	}
});

// @brief Singleton for article windows
Ext.define ('articleSin' , {
	singleton: true ,
	
	// Vars
	storeArts: new Array () ,
	focusModelID: '' ,
	
	// Getters
	
	// Get the entire array
	getArticles: function () {
		return this.storeArts;
	} ,
	
	// Get the model ID of the article
	getArticleModelID: function (id) {
		var idToReturn = null;
		var index = this.findIndexById (id);
				
		if (index != -1) {
			idToReturn = this.storeArts[index].modelID;
		}
		
		return idToReturn;
	} ,
	
	// Get focus model ID
	getFocusModelID: function () {
		return this.focusModelID;
	} ,
	
	// Setters
	
	// Set focus model ID
	setFocusModelID: function (id) {
		this.focusModelID = id;
	} ,
	
	// Reset focus model ID
	resetFocusModelID: function () {
		this.focusModelID = '';
	} ,
	
	// Add new article
	addArticle: function (id, model) {
		this.storeArts.push ({
			ID: id ,
			modelID: model
		});
	} ,
	
	// Add a new ID of article window
//	addArticleIDs : function (id) {
//		this.storeArticleIDs.push (id);
//	} ,

	// Remove last article
	delLastArticle: function () {
		return this.storeArts.pop ();
	} ,
	
	// Remove an article from its ID
	delArticleFromID: function (id) {
		var index = this.findIndexById (id);
		
		// Remove it if is found
		if (index != -1) {
			this.storeArts.splice (index, 1);
		}
	} ,
	
	// Finds the index in the array from an ID
	findIndexById: function (id) {
		var index = -1;
		var sentinel = false;
		
		// Find index of the ID
		for (var i = 0; i < this.storeArts.length; i++) {
			if (this.storeArts[i].ID == id) {
				sentinel = true;
				break;
			}
		}
		
		if (sentinel) {
			index = i;
		}
		
		return index;
		
	} ,
	// Remove an ID of a specified article
//	remArticleFromID : function (id) {
//		var sentinel = false;
//		// Find index of the ID to remove
//		for (var i = 0; i < this.storeArticleIDs.length; i++) {
//			if (this.storeArticleIDs[i] == id) {
//				sentinel = true;
//				break;
//			}
//		}
//		// Remove it if is found
//		if (sentinel) {
//			this.storeArticleIDs.splice (i, 1, id);
//		}
//	} ,
//	remArticleIDs : function () {
//		return this.storeArticleIDs.pop ();
//	} ,
	// Return true if the array is empty, false instead
	isEmpty : function () {
//		return (this.storeArticleIDs.length < 1 ? true : false);
		return (this.storeArts.length < 1 ? true : false);
	}
});

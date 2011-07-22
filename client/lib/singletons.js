// @file 	Singletons.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Set of singletons

// @brief Singleton for reply action
// @return Unique instance
var SingletonReply = (function () {
	var istantiated;
	var serverID = '';
	var userID = '';
	var postID = '';
	var isToReply = false;
	
	function init () {
		return {
			// Getters
			getServerID : function () {
				return serverID;
			} ,
			getUserID : function () {
				return userID;
			} ,
			getPostID : function () {
				return postID;
			} ,
			
			// Setters
			setServerID : function (id) {
				serverID = id;
			} ,
			setUserID : function (id) {
				userID = id;
			} ,
			setPostID : function (id) {
				postID = id;
			} ,
			setToReply : function (cond) {
				isToReply = cond;
			} ,
			
			// Return true if the post is a reply, false if not
			isReplying : function () {
				return isToReply;
			}
		}
	}
	
	return {
		// Return the current istantiee
		getInstance : function () {
			if (!istantiated) {
				istantiated = init ();
			}
			
			return istantiated;
		}
	}
})();

// @brief Singleton for error handler
// @return Unique instance
var SingletonErrors = (function () {
	var istantiated;
	
	function init () {
		return {
			// Getters
			// Get title error
			getErrorTitle : function (errorCode) {
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
			
			// Get text error
			getErrorText : function (errorCode) {
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
						text = 'The resource identified by the request is only capable<br />of generating response entities 	which have content characteristics not acceptable according<br /> to the accept headers sent in the request';
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
		}
	}
	
	return {
		// Return the current istantiee
		getInstance : function () {
			if (!istantiated) {
				istantiated = init ();
			}
			
			return istantiated;
		}
	}
})();

// @brief Singleton for options
// @return Unique instance
var SingletonOption = (function () {
	var istantiated;
	// Server url with credentials (cross-browsing : http://ltw1102.web.cs.unibo.it/server-related/Spammers)
	var urlServerLtw = '';
	// Server url without credentials (http://ltw1102.web.cs.unibo.it/)
	var pureUrlServerLtw = '';
	var serverID = '';
	var currentUser = '';
	
	function init () {
		return {
			// Getters
			getUrlServerLtw : function () {
				return urlServerLtw;
			} ,
			getPureUrlServerLtw : function () {
				return pureUrlServerLtw;
			} ,
			getServerID : function () {
				return serverID;
			} ,
			getCurrentUser : function () {
				return currentUser;
			} ,
			
			// Setters
			setUrlServerLtw : function (url) {
				urlServerLtw = url;
			} ,
			setPureUrlServerLtw : function (url) {
				pureUrlServerLtw = url;
			} ,
			setServerID : function (id) {
				serverID = id;
			} ,
			setCurrentUser : function (id) {
				currentUser = id;
			} ,
			
			// Reset variables (urls and id)
			resetOption : function () {
//				urlServerLtw = 'http://ltw1102.web.cs.unibo.it/';
//				pureUrlServerLtw = 'http://ltw1102.web.cs.unibo.it';
				urlServerLtw = '';
				pureUrlServerLtw = '';
				serverID = 'Spammers';
			} ,
			resetCurrentUser : function () {
				currentUser = '';
			}
		}
	}
	
	return {
		// Return the current istantiee
		getInstance : function () {
			if (!istantiated) {
				istantiated = init ();
			}
			
			return istantiated;
		}
	}
})();

// @brief Singleton for geolocation
// @return Unique instance
var SingletonGeolocation = (function () {
	var istantiated;
	var geoSpan;
	var googleMap;
	var browserGeoSupportFlag;
	
	function init () {
		return {
			// Getters
			getSpan : function () {
				return geoSpan;
			} ,
			getMap : function () {
				return googleMap;
			} ,
			
			// Setters
			setSpan : function (tag) {
				geoSpan = tag;
			} ,
			setMap : function (el, opt) {
				googleMap = new google.maps.Map (el, opt);
			} ,
			
			// Initialize geolocation if the browser supports it
			initialize : function () {
				browserGeoSupportFlag = (navigator.geolocation) ? true : false;
				geoSpan = '';
			} ,
			isSupported : function () {
				return browserGeoSupportFlag;
			} ,
			// Add a marker to the map
			addMarker : function (pos, owner) {
				if (pos != null) {
					var marker = new google.maps.Marker ({
						position: pos ,
						map: googleMap ,
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
		}
	}
	
	return {
		// Return the current istantiee
		getInstance : function () {
			if (!istantiated) {
				istantiated = init ();
			}
			
			return istantiated;
		}
	}
})();

// @brief Singleton for article windows
// @return Unique instance
var SingletonArticle = (function () {
	var istantiated;
	var storeArticleIDs = new Array ();
	
	function init () {
		return {
			// Getters
			getArticleIDs : function () {
				return storeArticleIDs;
			} ,
			
			// Add a new ID of article window
			addArticleIDs : function (id) {
				storeArticleIDs.push (id);
			} ,
			// Remove an ID of a specified article
			remArticleFromID : function (id) {
				var sentinel = false;
				// Find index of the ID to remove
				for (var i = 0; i < storeArticleIDs.length; i++) {
					if (storeArticleIDs[i] == id) {
						sentinel = true;
						break;
					}
				}
				// Remove it if is found
				if (sentinel) {
					storeArticleIDs.splice (i, 1, id);
				}
			} ,
			remArticleIDs : function () {
				return storeArticleIDs.pop ();
			} ,
			// Return true if the array is empty, false instead
			isEmpty : function () {
				return (storeArticleIDs.length < 1 ? true : false);
			}
		}
	}
	
	return {
		// Return the current istantiee
		getInstance : function () {
			if (!istantiated) {
				istantiated = init ();
			}
			
			return istantiated;
		}
	}
})();

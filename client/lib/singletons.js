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
			
			// Reset variables (urls and id)
			resetOption : function () {
//				urlServerLtw = 'http://ltw1102.web.cs.unibo.it/';
//				pureUrlServerLtw = 'http://ltw1102.web.cs.unibo.it';
				urlServerLtw = '';
				pureUrlServerLtw = '';
				serverID = 'Spammers';
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

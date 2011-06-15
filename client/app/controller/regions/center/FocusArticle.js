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
	
	stores: ['regions.center.Articles'] ,
	models: ['regions.center.Articles'] ,
	
	// Configuration
	init: function () {
		var indexModel;
		var focusModel;
		
		// TODO: after render of this window, check like/dislike and follow/unfollow value of this article
		this.control ({
			// Window render
			'focusarticle' : {
				show : this.initFocusWindow
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
	// TODO: remove like and dislike (setLike 0)
	setLike: function (button, event, val) {
		var postData = focusModel.get ('about');
		
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
				// TODO: change ui of button (button.setUi (something))
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
		
		// Like and Dislike counters
		var counterLike = parseInt (findCounters (focusModel.get ('article'), 'Like'));
		var counterDislike = parseInt (findCounters (focusModel.get ('article'), 'Dislike'));
		
		// Check if counter like/dislike span tag exists
		if ((counterLike != -1) && (counterDislike != -1)) {
			// Percent of progress bar
			var pBarValue = counterLike / (counterLike + counterDislike);
			
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
	}
});

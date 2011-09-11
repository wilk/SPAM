// @file 	SendResource.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of send resource view

Ext.define ('SC.controller.SendResource' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['SendResource'] ,
	
	models: ['regions.center.Articles' , 'ComboThesaurus'] ,
	stores: ['regions.center.Articles' , 'ComboThesaurus'] ,
	
	// Configuration
	init: function () {
		var MAXCHARS;
		var artHeader;
		var artFooter;
		var winRes, txtResUrl, txtResDes, lblResCount , chkBoxGeoLoc;
		var geoLocSpan;

		// Type of resource
		var btnGhost;
		var sendResourceComboHashtag;
		
		this.control ({
			// Reset field when it's showed
			'sendresource': {
				afterrender: this.initFields ,
				show: this.resetFields
			} ,
			// Controlling txtArea of window for sending new posts
			'#txtResourceDescription': {
				// On every keypress do something
				keypress: this.checkChars
			} , 
			// Send button
			'#btnResSend': {
				click: this.sendPost
			} ,
			// Reset button
			'#btnResReset': {
				click: this.resetFields
			} ,
			// Combo Hashtag
			'#sendResourceComboHashtag': {
				select: this.getHashtag
			} ,
			// Geolocation Checkbox
			'#chkResGeoLoc': {
				click: this.getGeoPosition
			}
		});
	} ,
	
	// @brief Check if text area lenght is positive or negative (140 chars)
	//	  and update label with the right color
	checkChars : function (txtarea, e) {
			// Get the lenght
		var	numChar = txtarea.getValue().length ,
			// And the difference
			diffCount = MAXCHARS - numChar;
		
		// If it's negative, color it with red, otherwise with black
		if (diffCount < 0)
			lblResCount.setText ('<span style="color:red;">' + diffCount + '</span>' , false);
		else
			lblResCount.setText ('<span style="color:black;">' + diffCount + '</span>' , false);
		
		// Focus on hashtag combobox on '#'
		if (e.getKey () == '35') {
			sendResourceComboHashtag.focus ();
		}
	} ,
	
	// @brief Insert the appropriate hashtag into the textarea
	getHashtag : function (combo) {
		// Insert hashtag at that index
//		txtResDes.insertAtCursor (combo.getValue ());
		
		// Reset combobox
//		combo.setValue ('');
		
		// Set focus on textarea
//		txtResDes.focus ();
		
//		var len = txtResDes.getValue().length;
		
		// Position cursor at the end of the textarea
//		var doc = txtResDes.getFocusEl().id;
//		var ta = document.getElementById (doc);
//		ta.setSelectionRange (len, len);
		
		
		txtResDes.insertAtCursor (combo.getValue ());
		combo.reset ();
		
		txtResDes.getFocusEl().focus ();
		// To avoid Opera's bullshit
		var len = txtResDes.getFocusEl().length;
		
		// TODO: problem with IE and Chromium
		txtResDes.getFocusEl().setSelectionRange (len, len);
	} ,
	
	// @brief Send the article
	sendPost : function (button) {
		// Articles store
		var store = this.getRegionsCenterArticlesStore ();
		
		// Check if text area is filled and if it has at most 140 chars
		if (txtResUrl.isValid () && (txtResDes.getValue().length <= MAXCHARS)) {
		
			var 	artBody = txtResDes.getValue () ,
				artResource = '<span resource="' + btnGhost.getText () + '" src="' + txtResUrl.getValue () + '" />';
			
			// Escapes every '<'
			artBody = artBody.replace ('<' , '&lt;');
			
			artBody = htInjection (artBody , this.getComboThesaurusStore ());
			
			// XML Injection
			var article = artHeader + '\n' + artBody + '\n' + artResource + '\n';
			
			// Add geolocation
			article += geolocSin.getSpan ();
			
			// Complete article building
			article += artFooter;
			
			var ajaxUrl;
			var ajaxParams;
			
			// If it's a reply, setup url and params of the ajax request
			if (replySin.isReplying ()) {
				ajaxUrl = optionSin.getUrlServerLtw () + 'replyto';
				ajaxParams = {
					serverID : replySin.getServerID () ,
					userID : replySin.getUserID () ,
					postID : replySin.getPostID () ,
					article : article
				}
			}
			else {
				ajaxUrl = optionSin.getUrlServerLtw () + 'post';
				ajaxParams = {
					article : article
				}
			}
		
			// AJAX Request
			Ext.Ajax.request ({
				url: ajaxUrl ,
				params: ajaxParams ,
				success: function (response) {
					// On success, close window and display last 5 posts of the user
					winRes.close ();

					// Get appropriate serverID of the user logged in
					var sendServerID = Ext.getCmp('tfServerUrl').getValue ();
					
					// If it is null, set default value ('Spammers')
					if (sendServerID == null) {
						sendServerID = 'Spammers';
					}
					
					// Set appropriate URL with username of the user already logged-in
					store.getProxy().url = optionSin.getUrlServerLtw () + 'search/5/author/' + sendServerID + '/' + Ext.util.Cookies.get ('SPAMlogin');
					
					// Retrieve articles
					requestSearchArticles (store, null, 0);
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
		}
		else {
			Ext.Msg.show ({
				title: 'Error' ,
				msg: 'Fill the post fields with almost 140 chars.' ,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.ERROR
			});
		}
	} ,
	
	// @brief initialize fields and local variables
	initFields: function (win) {
		winRes = win;
		txtResUrl = winRes.down ('#txtResourceUrl');
		txtResDes = winRes.down ('#txtResourceDescription');
		lblResCount = winRes.down ('#lblResCounter');
		chkBoxGeoLoc = winRes.down ('#chkResGeoLoc');
		
		btnGhost = Ext.getCmp ('resBtnGhost');
		
		// If browser do not support geolocation, hide the checkbox
		if (geolocSin.isSupported ())
			chkBoxGeoLoc.setVisible (true);
		else
			chkBoxGeoLoc.setVisible (false);
		
		sendResourceComboHashtag = winRes.down ('#sendResourceComboHashtag');
		
		MAXCHARS = 140;
		artHeader = '<article>';
		artFooter = '</article>';
	} ,
	
	// @brief Reset fields
	resetFields: function (button) {
		txtResUrl.reset ();
		txtResDes.reset ();
		chkBoxGeoLoc.reset ();
		lblResCount.setText ('<span style="color:black;">' + MAXCHARS + '</span>' , false);
	} ,
	
	// @brief Retrieve geolocation of the user device
	getGeoPosition : function (cb) {
		if (cb.getValue () && geolocSin.isSupported ()) {
			// Mask the window
			winRes.setLoading ('Retrieving geolocation of your device ...');
			try {
				navigator.geolocation.getCurrentPosition (function (position) {
					// If geolocation was retrieved successfully, setup geolocation span
					geolocSin.setSpan ('<span id="geolocationspan" lat="' + position.coords.latitude + '" long="' + position.coords.longitude + '" />');
					winRes.setLoading (false);
				} , function () {
					// otherwise, setup with 0,0 position
					geolocSin.setSpan ('<span id="geolocationspan" long="0.0" lat="0.0" />');
					winRes.setLoading (false);
				});
			}
			catch (err) {
				Ext.Msg.show ({
					title: 'Error' ,
					msg: 'An error occurred during setup geolocation: article will be sent without geolocation.' ,
					buttons: Ext.Msg.OK ,
					icon: Ext.Msg.ERROR
				});
				
				// Reset Geolocation
				geolocSin.setSpan ('');
				winRes.setLoading (false);
			}
		}
		else {
			// Send an empty string
			sendGeoLocSpan = '';
		}
	}
});

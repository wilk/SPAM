// @file 	Send.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of view of sending new posts

Ext.define ('SC.controller.Send' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['Send'] ,
	
	models: ['regions.center.Articles' , 'ComboThesaurus'] ,
	stores: ['regions.center.Articles' , 'ComboThesaurus'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// Reset field when it's showed
			'send': {
				afterrender: this.initFields ,
				show: this.resetFields
			} ,
			// Controlling txtArea of window for sending new posts
			'#txtAreaSend': {
				// On every keypress do something
				//initialize: this.initHtmlEditor ,
				keypress: this.checkChars
			} , 
			// Send button
			'#buttonSend': {
				click: this.sendPost
			} ,
			// Reset button
			'#buttonReset': {
				click: this.resetFields
			} ,
			// Combo hashtag
			'#sendComboHashtag': {
				select: this.getHashtag ,
				keypress: function (combo, e) {
					if (e.getKey () == e.ENTER) {
						if (combo.getValue () != null)
							this.getHashtag (combo);
					}
				}
			} ,
			// Geolocation Checkbox
			'#chkSendGeoLoc': {
				change: this.getGeoPosition
			}
		});
	} ,
	
	// @brief initialize fields and local variables
	initFields: function (win) {
		this.win = win;
		this.txtSendArea = win.down ('#txtAreaSend');
		this.lblSendCount = win.down ('#sendCharCounter');
		this.chkSendBoxGeoLoc = win.down ('#chkSendGeoLoc');
		this.sendComboHashtag = win.down ('#sendComboHashtag');
		
		// If browser do not support geolocation, hide the checkbox
		if (geolocSin.isSupported ())
			this.chkSendBoxGeoLoc.setVisible (true);
		else
			this.chkSendBoxGeoLoc.setVisible (false);
		
		this.MAXCHARS = 140;
		this.artHeader = '<article>';
		this.artFooter = '</article>';
		
		this.hashtagArray = new Array ();
	} ,
	
	// @brief Reset text area of the new post
	resetFields: function (win) {
		this.txtSendArea.reset ();
		this.chkSendBoxGeoLoc.reset ();
		this.sendComboHashtag.reset ();
		
		this.lblSendCount.setText ('<span style="color:black;">' + this.MAXCHARS + '</span>' , false);
	} ,
	
	// @brief Check if text area lenght is positive or negative (140 chars)
	//	  and update label with the right color
	checkChars : function (ta, event) {
		var 	// Get the lenght
			numChar = ta.getValue().length ,
			// And the difference
			diffCount = this.MAXCHARS - numChar;
		
		// If it's negative, color it with red, otherwise with black
		if (diffCount < 0)
			this.lblSendCount.setText ('<span style="color:red;">' + diffCount + '</span>' , false);
		else
			this.lblSendCount.setText ('<span style="color:black;">' + diffCount + '</span>' , false);

		// Focus on hashtag combobox on '#'
		if (event.getKey () == '35') {
			this.sendComboHashtag.focus ();
		}
	} ,
	
	// @brief Insert the appropriate hashtag into the textarea
	getHashtag : function (combo) {
		// Insert hashtag at that index
		this.txtSendArea.insertAtCursor (combo.getValue ());
		
		// Set focus on textarea
		this.txtSendArea.focus ();
		
		var len = this.txtSendArea.getValue().length;
		
		// Position cursor at the end of the textarea
		var doc = this.txtSendArea.getFocusEl().id;
		var ta = document.getElementById (doc);
		ta.setSelectionRange (len, len);
		
		// Reset combobox
		combo.setValue ('');
	} ,
	
	// @brief Send the article
	sendPost : function (button) {
		// Articles store
		var store = this.getRegionsCenterArticlesStore ();
		
		// Check if text area is filled and if it has at most 140 chars
		if (this.txtSendArea.isValid () && (this.txtSendArea.getValue().length <= this.MAXCHARS)) {
		
			var artBody = this.txtSendArea.getValue ();
			
			// Escapes every '<'
			artBody = artBody.replace ('<' , '&lt;');
			
			// Allow transformNakedUrl to Spammers server only
			if (optionSin.getUrlServerLtw () == 'http://ltw1102.web.cs.unibo.it/') {
				this.win.setLoading (true);
				artBody = transformNakedUrl (artBody , 0, artBody.length);
				this.win.setLoading (false);
			}
			
			// XML Injection for hashtag
			artBody = htInjection (artBody , this.getComboThesaurusStore ());
			
			// XML Injection
			var article = this.artHeader + '\n' + artBody + '\n';
		
			// Setup geolocation
			article += geolocSin.getSpan ();
			
			// Complete article building
			article += this.artFooter;
			
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
				scope: this ,
				params: ajaxParams ,
				success: function (response) {
					// On success, close window and display last 5 posts of the user
					this.win.close ();
					
					// Get appropriate serverID of the user logged in
					var sendServerID = Ext.getCmp('tfServerUrl').getValue ();
					
					// If it is null, set default value ('Spammers')
					if (sendServerID == null) {
						sendServerID = 'Spammers';
					}
					
					// Set appropriate URL with username of the user already logged-in
					store.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + optionSin.getSearchNumber () + '/author/' + sendServerID + '/' + optionSin.getCurrentUser ();
					
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
	
	// @brief Retrieve geolocation of the user device
	getGeoPosition : function (cb) {
		if (cb.getValue () && geolocSin.isSupported ()) {
			// Mask the window
			this.win.setLoading ('Retrieving geolocation of your device ...');
			try {
				var sendWindow = this.win;
				navigator.geolocation.getCurrentPosition (function (position) {
					// If geolocation was retrieved successfully, setup geolocation span
					geolocSin.setSpan ('<span id="geolocationspan" lat="' + position.coords.latitude + '" long="' + position.coords.longitude + '" />');
					sendWindow.setLoading (false);
				} , function () {
					// otherwise, setup with 0,0 position
					geolocSin.setSpan ('<span id="geolocationspan" long="0.0" lat="0.0" />');
					sendWindow.setLoading (false);
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
				this.win.setLoading (false);
			}
		}
		else {
			// Send an empty string
			this.sendGeoLocSpan = '';
		}
	}
});

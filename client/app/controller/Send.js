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
		var MAXCHARS;
		var artHeader;
		var artFooter;
		var txtSendArea , lblSendCount , chkSendBoxGeoLoc;
		var sendGeoLocSpan;
		var hashtagArray = new Array ();
		var sendComboHashtag;
		
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
					// TODO: chromium doesn't handle e.getKey () in this case. WTF?
					if (e.getKey () == e.ENTER) {
						if (combo.getValue () != null)
							this.getHashtag (combo);
					}
				}
			}
		});
		
		console.log ('Controller Send started.');
	} ,
	
	// @brief Check if text area lenght is positive or negative (140 chars)
	//	  and update label with the right color
	// TODO: pasted text!!!
	// TODO: cancel/delete keys aren't captured by chrome
	checkChars : function (ta, event) {
		var 	// Get the lenght
			//numChar = txtarea.getValue().length ,
			numChar = ta.getValue().length ,
			// And the difference
			diffCount = MAXCHARS - numChar;
		
		// If it's negative, color it with red, otherwise with black
		if (diffCount < 0)
			lblSendCount.setText ('<span style="color:red;">' + diffCount + '</span>' , false);
		else
			lblSendCount.setText ('<span style="color:black;">' + diffCount + '</span>' , false);

		// Focus on hashtag combobox on '#'
		if (event.getKey () == '35') {
			sendComboHashtag.focus ();
		}
	} ,
	
	// @brief Insert the appropriate hashtag into the textarea
	getHashtag : function (combo) {
		txtSendArea.insertAtCursor (combo.getValue ());
		combo.reset ();
		
		txtSendArea.getFocusEl().focus ();
		// To avoid Opera's bullshit
		var len = txtSendArea.getFocusEl().length;
		
		// TODO: problem with IE and Chromium
		txtSendArea.getFocusEl().setSelectionRange (len, len);
	} ,
	
	// @brief Send the article
	sendPost : function (button) {
		// Articles store
		var store = this.getRegionsCenterArticlesStore ();
		
		// Check if text area is filled and if it has at most 140 chars
		if (txtSendArea.isValid () && (txtSendArea.getValue().length <= MAXCHARS)) {
		
			var 	artBody = txtSendArea.getValue () ,
				win = Ext.getCmp ('windowNewPost');
			
			// Escapes every '<'
			artBody = artBody.replace ('<' , '&lt;');
			
			// Allow transformNakedUrl to Spammers server only
			if (optionSin.getUrlServerLtw () == 'http://ltw1102.web.cs.unibo.it/') {
				win.setLoading (true);
				artBody = transformNakedUrl (artBody , 0, artBody.length);
				win.setLoading (false);
			}
			
			// XML Injection for hashtag
			artBody = htInjection (artBody , this.getComboThesaurusStore ());
			
			// XML Injection
			var article = artHeader + '\n' + artBody + '\n';
		
			// Check geolocation
			if (chkSendBoxGeoLoc.getValue () && browserGeoSupportFlag) {
				try {
					navigator.geolocation.getCurrentPosition (function (position) {
						// If geolocation was retrieved successfully, setup geolocation span
						sendGeoLocSpan = '<span id="geolocationspan" lat="' + position.coords.latitude + '" long="' + position.coords.longitude + '" />';
					} , function () {
						// TODO: better error message
						// otherwise, setup with 0,0 position
						sendGeoLocSpan = '<span id="geolocationspan" long="0" lat="0" />';
					});
				
					article += sendGeoLocSpan + '\n';
				}
				catch (err) {
					Ext.Msg.show ({
						title: 'Error' ,
						msg: 'An error occurred during setup geolocation: article will be sent without geolocation.' ,
						buttons: Ext.Msg.OK ,
						icon: Ext.Msg.ERROR
					});
				}
			}
			
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
					win.close ();
					
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
		txtSendArea = win.down ('#txtAreaSend');
		lblSendCount = win.down ('#sendCharCounter');
		chkSendBoxGeoLoc = win.down ('#chkSendGeoLoc');
		sendComboHashtag = win.down ('#sendComboHashtag');
		
		// If browser do not support geolocation, hide the checkbox
		if ((browserGeoSupportFlag))
			chkSendBoxGeoLoc.setVisible (true);
		else
			chkSendBoxGeoLoc.setVisible (false);
		
		MAXCHARS = 140;
		artHeader = '<article>';
		artFooter = '</article>';
		
		sendGeoLocSpan = '';
	} ,
	
	// @brief Reset text area of the new post
	resetFields: function (win) {
		txtSendArea.reset ();
		chkSendBoxGeoLoc.reset ();
		sendComboHashtag.reset ();
		
		lblSendCount.setText ('<span style="color:black;">' + MAXCHARS + '</span>' , false);
	}
});

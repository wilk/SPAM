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
	
	// @brief initialize fields and local variables
	initFields: function (win) {
		this.win = win;
		this.txtResUrl = win.down ('#txtResourceUrl');
		this.txtResDes = win.down ('#txtResourceDescription');
		this.lblResCount = win.down ('#lblResCounter');
		this.chkBoxGeoLoc = win.down ('#chkResGeoLoc');
		
		this.btnGhost = Ext.getCmp ('resBtnGhost');
		
		// If browser do not support geolocation, hide the checkbox
		if (geolocSin.isSupported ())
			this.chkBoxGeoLoc.setVisible (true);
		else
			this.chkBoxGeoLoc.setVisible (false);
		
		this.sendResourceComboHashtag = win.down ('#sendResourceComboHashtag');
		
		this.MAXCHARS = 140;
		this.artHeader = '<article>';
		this.artFooter = '</article>';
	} ,
	
	// @brief Reset fields
	resetFields: function (button) {
		this.txtResUrl.reset ();
		this.txtResDes.reset ();
		this.chkBoxGeoLoc.reset ();
		this.lblResCount.setText ('<span style="color:black;">' + this.MAXCHARS + '</span>' , false);
	} ,
	
	// @brief Check if text area lenght is positive or negative (140 chars)
	//	  and update label with the right color
	checkChars : function (txtarea, e) {
			// Get the lenght
		var	numChar = txtarea.getValue().length ,
			// And the difference
			diffCount = this.MAXCHARS - numChar;
		
		// If it's negative, color it with red, otherwise with black
		if (diffCount < 0)
			this.lblResCount.setText ('<span style="color:red;">' + diffCount + '</span>' , false);
		else
			this.lblResCount.setText ('<span style="color:black;">' + diffCount + '</span>' , false);
		
		// Focus on hashtag combobox on '#'
		if (e.getKey () == '35') {
			this.sendResourceComboHashtag.focus ();
		}
	} ,
	
	// @brief Send the article
	sendPost : function (button) {
		// Articles store
		var store = this.getRegionsCenterArticlesStore ();
		
		// Check if text area is filled and if it has at most 140 chars
		if (this.txtResUrl.isValid () && (this.txtResDes.getValue().length <= this.MAXCHARS)) {
		        
                        var risorsa , pattern = /youtube/gi;
                        if (this.txtResUrl.getValue ().match(pattern))
                            risorsa = this.txtResUrl.getValue ().split("&", 1);

                        else
                            risorsa = this.txtResUrl.getValue ();
                
			var 	artBody = this.txtResDes.getValue () ,
				artResource = '<span resource="' + this.btnGhost.getText () + '" src="' + risorsa + '" />';
			
			// Escapes every '<'
			artBody = artBody.replace ('<' , '&lt;');
			
			artBody = htInjection (artBody , this.getComboThesaurusStore ());
			
			// XML Injection
			var article = this.artHeader + '\n' + artBody + '\n' + artResource + '\n';
			
			// Add geolocation
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

					// Set appropriate URL with username of the user already logged-in
					store.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + optionSin.getSearchNumber () + '/author/' + optionSin.getServerID () + '/' + optionSin.getCurrentUser ();
					
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
		
		
		this.txtResDes.insertAtCursor (combo.getValue ());
		combo.reset ();
		
		this.txtResDes.getFocusEl().focus ();
		// To avoid Opera's bullshit
		var len = this.txtResDes.getFocusEl().length;
		
		// TODO: problem with IE and Chromium
		this.txtResDes.getFocusEl().setSelectionRange (len, len);
	} ,
	
	// @brief Retrieve geolocation of the user device
	getGeoPosition : function (cb) {
		if (cb.getValue () && geolocSin.isSupported ()) {
			// Mask the window
			this.win.setLoading ('Retrieving geolocation of your device ...');
			try {
				var winRes = this.win;
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
				this.win.setLoading (false);
			}
		}
		else {
			// Send an empty string
			this.sendGeoLocSpan = '';
		}
	}
});

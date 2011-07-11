// @file 	SendResource.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of send resource view

var MAXCHARS = 140;

var 	artHeader = '<article>' ,
	artFooter = '</article>';

var 	winRes, txtResUrl, txtResDes, lblResCount , chkBoxGeoLoc;

var geoLocSpan;

// Type of resource
var btnGhost;

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
			}
		});
	
		console.log ('Controller SendResource started.');
	} ,
	
	// @brief Check if text area lenght is positive or negative (140 chars)
	//	  and update label with the right color
	// TODO: pasted text!!!
	// TODO: cancel/delete keys aren't captured by chrome
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
	} ,
	
	// @brief
	sendPost : function (button) {
		// TODO: hashtag autocomplete
		
		// Articles store
		var store = this.getRegionsCenterArticlesStore ();
		
		// Check if text area is filled and if it has at most 140 chars
		if (txtResUrl.isValid () && (txtResDes.getValue().length <= MAXCHARS)) {
		
			var 	artBody = txtResDes.getValue () ,
				artResource = '<span resource="' + btnGhost.getText () + '" src="' + txtResUrl.getValue () + '" />';
			
			artBody = htInjection (artBody , this.getComboThesaurusStore ());
			
			// XML Injection
			var article = artHeader + '\n' + artBody + '\n' + artResource + '\n';
			
			// Check geolocation
			if (chkBoxGeoLoc.getValue () && browserGeoSupportFlag) {
				try {
					navigator.geolocation.getCurrentPosition (function (position) {
						// If geolocation was retrieved successfully, setup geolocation span
						geoLocSpan = '<span id="geolocationspan" lat="' + position.coords.latitude + '" long="' + position.coords.latitude + '" />';
					} , function () {
						// TODO: better error message
						// otherwise, setup with 0,0 position
						geoLocSpan = '<span id="geolocationspan" long="0" lat="0" />';
					});
				
					article += geoLocSpan + '\n';
				}
				catch (err) {
					Ext.Msg.show ({
						title: 'Error' ,
						msg: 'An error occurred during geolocation setup: article will be sent without geolocation.' ,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				}
			}
			
			// Complete article building
			article += artFooter;
		
			// AJAX Request
			Ext.Ajax.request ({
				url: urlServerLtw + 'post' ,
				params: { article: article } ,
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
					store.getProxy().url = urlServerLtw + 'search/5/author/' + sendServerID + '/' + Ext.util.Cookies.get ('SPAMlogin');
					
					// Retrieve articles
					requestSearchArticles (store, null, 0);
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
		if ((browserGeoSupportFlag))
			chkBoxGeoLoc.setVisible (false);
	} ,
	
	// @brief Reset fields
	resetFields: function (button) {
		txtResUrl.reset ();
		txtResDes.reset ();
		chkBoxGeoLoc.reset ();
		lblResCount.setText ('<span style="color:black;">' + MAXCHARS + '</span>' , false);
	}
});

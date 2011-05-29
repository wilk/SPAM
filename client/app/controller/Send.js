// @file 	Send.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of view of sending new posts

var MAXCHARS = 140;

var 	artHeader = '<article xmlns:sioc="http://rdfs.org/sioc/ns#" xmlns:ctag="http://commontag.org/ns#" xmlns:skos="http://www.w3.org/2004/02/skos/core#" typeof="sioc:Post">' ,
	artFooter = '</article>';

var txtSendArea , lblSendCount , chkBoxGeoLoc;

var geoLocSpan;

Ext.define ('SC.controller.Send' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['Send'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// Reset field when it's showed
			'send': {
				show: this.initFields
			} ,
			// Controlling txtArea of window for sending new posts
			'#txtAreaSend': {
				// On every keypress do something
				keypress: this.checkChars
			} , 
			// Send button
			'#buttonSend': {
				click: this.sendPost
			} ,
			// Reset button
			'#buttonReset': {
				click: this.resetFields
			}
		});
	
		console.log ('Controller Send started.');
	} ,
	
	// @brief Check if text area lenght is positive or negative (140 chars)
	//	  and update label with the right color
	checkChars : function (txtarea, e) {
		var 	// Get the lenght
			numChar = txtarea.getValue().length ,
			// And the difference
			diffCount = MAXCHARS - numChar;
		
		// If it's negative, color it with red, otherwise with black
		if (diffCount < 0)
			lblSendCount.setText ('<span style="color:red;">' + diffCount + '</span>' , false);
		else
			lblSendCount.setText ('<span style="color:black;">' + diffCount + '</span>' , false);
	} ,
	
	// @brief
	sendPost : function () {
		// TODO: parsing text to finding hashtag
		// TODO: hashtag autocomplete
		
		// Check if text area is filled and if it has at most 140 chars
		if (txtSendArea.isValid () && (txtSendArea.getValue().length <= MAXCHARS)) {
		
			var 	artBody = txtSendArea.getValue () ,
				// XML Injection
				article = artHeader + '\n' + artBody + '\n',
				win = Ext.getCmp ('windowNewPost');
		
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
					Ext.Msg.alert ('Error' , 'An error occurred during setup geolocation: the article will be sent without geolocation.');
				}
			}
			
			// Complete article building
			article += artFooter;
			
			// AJAX Request
			Ext.Ajax.request ({
				url: 'post' ,
				params: { article: article } ,
				success: function (response) {
					win.close ();
				} ,
				failure: function (error) {
					Ext.Msg.alert ('Error ' + error.status , error.responseText);
				}
			});
		}
		else {
			Ext.Msg.alert ('Error' , 'New post is blank or it has got to many chars (140 max).');
		}
	} ,
	
	// @brief initialize fields and local variables
	initFields: function (win) {
		txtSendArea = win.down ('#txtAreaSend');
		lblSendCount = win.down ('#sendCharCounter');
		chkBoxGeoLoc = win.down ('#chkSendGeoLoc');
		
		this.resetFields ();
	} ,
	
	// Reset text area of the new post
	resetFields: function () {
		txtSendArea.reset ();
		chkBoxGeoLoc.reset ();
		
		lblSendCount.setText ('<span style="color:black;">' + MAXCHARS + '</span>' , false);
	}
});

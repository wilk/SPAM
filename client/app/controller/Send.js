// @file 	Send.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of view of sending new posts

var MAXCHARS = 140;

var 	artHeader = '<article>' ,
	artFooter = '</article>';

var txtSendArea , lblSendCount , chkSendBoxGeoLoc;

var sendGeoLocSpan;

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
				win = Ext.getCmp ('windowNewPost');
			
			// XML Injection for hashtag
			artBody = htInjection (artBody);
			
			// XML Injection
			var article = artHeader + '\n' + artBody + '\n';
		
			// Check geolocation
			if (chkSendBoxGeoLoc.getValue () && browserGeoSupportFlag) {
				try {
					navigator.geolocation.getCurrentPosition (function (position) {
						// If geolocation was retrieved successfully, setup geolocation span
						sendGeoLocSpan = '<span id="geolocationspan" lat="' + position.coords.latitude + '" long="' + position.coords.latitude + '" />';
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
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
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
		txtSendArea = win.down ('#txtAreaSend');
		lblSendCount = win.down ('#sendCharCounter');
		chkSendBoxGeoLoc = win.down ('#chkSendGeoLoc');
		
		this.resetFields ();
	} ,
	
	// Reset text area of the new post
	resetFields: function () {
		txtSendArea.reset ();
		chkSendBoxGeoLoc.reset ();
		
		lblSendCount.setText ('<span style="color:black;">' + MAXCHARS + '</span>' , false);
	}
});

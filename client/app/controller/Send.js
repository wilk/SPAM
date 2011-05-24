// @file 	Send.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of view of sending new posts

var MAXCHARS = 140;

Ext.define ('SC.controller.Send' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['Send'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// Reset field when it's showed
			'send': {
				show: this.resetPost
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
				click: this.resetPost
			}
		});
	
		console.log ('Controller Send started.');
	} ,
	
	// @brief Check if text area lenght is positive or negative (140 chars)
	//	  and update label with the right color
	checkChars : function (txtarea, e) {
		var 	counterLabel = Ext.getCmp ('sendCharCounter') ,
			// Get the lenght
			numChar = txtarea.getValue().length ,
			// And the difference
			diffCount = MAXCHARS - numChar;
		
		// If it's negative, color it with red, otherwise with black
		if (diffCount < 0)
			counterLabel.setText ('<span style="color:red;">' + diffCount + '</span>' , false);
		else
			counterLabel.setText ('<span style="color:black;">' + diffCount + '</span>' , false);
	} ,
	
	// @brief
	sendPost : function () {
		// TODO: parsing text to finding hashtag
		// TODO: hashtag autocomplete
		var 	taSend = Ext.getCmp ('txtAreaSend');
		
		// Check if text area is filled and if it has at most 140 chars
		if (taSend.isValid () && (taSend.getValue().length <= MAXCHARS)) {
		
			var 	artHeader = '<article xmlns:sioc="http://rdfs.org/sioc/ns#" xmlns:ctag="http://commontag.org/ns#" xmlns:skos="http://www.w3.org/2004/02/skos/core#" typeof="sioc:Post">' ,
				artFooter = '</article>' ,
				artBody = Ext.getCmp('txtAreaSend').getValue () ,
				// XML Injection
				article = artHeader + artBody + artFooter ,
				win = Ext.getCmp ('windowNewPost');
		
			// AJAX Request
			Ext.Ajax.request ({
				url: 'post' ,
				params: { articolo: article } ,
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
	
	// Reset text area of the new post
	resetPost: function () {
		Ext.getCmp ('txtAreaSend').reset ();
		
		Ext.getCmp ('sendCharCounter').setText ('<span style="color:black;">' + MAXCHARS + '</span>' , false);
	}
});

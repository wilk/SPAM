// @file 	Send.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of view of sending new posts

//var txtareaSendChars = 140;

Ext.define ('SC.controller.Send' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['Send'] ,
	
	// Configuration
	init: function () {
		this.control ({
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
	
	// TODO: on keypress, increase or decrease sendCharCounter
	// HINT: use regular expression
	checkChars : function (txtarea, e) {
//		if (e.isSpecialKey () && (txtareaSendChars < 140) &&  ((e.getKey () == e.BACKSPACE) || (e.getKey () == e.DELETE)))
//			Ext.getCmp('sendCharCounter').setText (++txtareaSendChars);
////		else if (!(e.isSpecialKey ()) && !(e.isNavKeyPress))
//		else if (!(e.SpecialKey))
//			Ext.getCmp('sendCharCounter').setText (--txtareaSendChars);
//		txtareaSendChars++;
	} ,
	
	// @brief
	sendPost : function () {
		// TODO: parsing text to finding hashtag
		// TODO: hashtag autocomplete
		var taSend = Ext.getCmp ('txtAreaSend');
		
		// Check if text area is filled
		if (taSend.isValid ()) {
		
			var 	artHeader = '<article xmlns:sioc="http://rdfs.org/sioc/ns#" xmlns:ctag="http://commontag.org/ns#" xmlns:skos="http://www.w3.org/2004/02/skos/core#" typeof="sioc:Post">' ,
				artFooter = '</article>' ,
				artBody = Ext.getCmp('txtAreaSend').getValue () ,
				// XML Injection
				article = artHeader + artBody + artFooter ,
				win = Ext.getCmp ('windowNewPost');
		
			// AJAX Request
			Ext.Ajax.request ({
				url: 'post' ,
				params: [{
					'articolo': article
				}] ,
				success: function (response) {
					win.close ();
				} ,
				failure: function (error) {
					Ext.Msg.alert ('Error ' + error.status , error.responseText);
				
				}
			});
		}
		else {
			Ext.Msg.alert ('Error' , 'Fill the text area before sending new posts.');
		}
	} ,
	
	// Reset text area of the new post
	resetPost: function () {
		Ext.getCmp ('txtAreaSend').reset ();
	}
});

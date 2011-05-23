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
	
	// Models
	models: ['Post'] ,
	
	// Stores
	stores: ['Post'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// Controlling txtArea of window for sending new posts
			'#txtAreaSend': {
				// On every keypress do something
				keypress: this.checkChars
			} , 
			// Controlling send button
			'#buttonSend': {
				click: this.sendPost
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
		// TODO: injection xml code
		// TODO: AJAX request with proxy.rest
		
		var artHeader = '<article xmlns:sioc="http://rdfs.org/sioc/ns#" xmlns:ctag="http://commontag.org/ns#" xmlns:skos="http://www.w3.org/2004/02/skos/core#" typeof="sioc:Post">';
		var artFooter = '</article>';
		
		var artBody = Ext.getCmp('txtAreaSend').getValue ();
		var article = artHeader + artBody + artFooter;
		alert ('Hai scritto le seguenti minchiate: \n' + article);
		
//		var win = Ext.getCmp ('windowNewPost');
//		var winPost = Ext.getCmp ('windowPost');
//		winPost.show ();
//		win.close ();
	}
});

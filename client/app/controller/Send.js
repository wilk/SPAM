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
			// Controlling txtArea of window for sending new posts
			'#txtAreaSend': {
				// On every keypress do something
				keypress: this.checkChars
			}
		});
	
		console.log ('Controller Send started.');
	} ,
	
	// TODO: on keypress, increase or decrease sendCharCounter
	checkChars : function (txtarea, e) {
//		if (e.isSpecialKey () && (txtareaSendChars < 140) &&  ((e.getKey () == e.BACKSPACE) || (e.getKey () == e.DELETE)))
//			Ext.getCmp('sendCharCounter').setText (++txtareaSendChars);
////		else if (!(e.isSpecialKey ()) && !(e.isNavKeyPress))
//		else if (!(e.SpecialKey))
//			Ext.getCmp('sendCharCounter').setText (--txtareaSendChars);
//		txtareaSendChars++;
	}
});

// @file 	East.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of view of east region of Viewport

Ext.define ('SC.controller.East' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.East'] ,
	
	// Configuration
	init: function () {
		console.log ('Controller East started.');
	}
});

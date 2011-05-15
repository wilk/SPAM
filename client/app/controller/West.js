// @file 	West.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of view of west region of Viewport

Ext.define ('SC.controller.West' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.West'] ,
	
	// Configuration
	init: function () {
		console.log ('Controller West started.');
	}
});

// @file 	North.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of view of north region of Viewport

Ext.define ('SC.controller.North' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.North'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// If an event is raised from loginButton, it's controlled
			'#loginButton' : {
				// Click event
				click : this.userAuth
			}
		});

		console.log ('Controller North started.');
	} ,
	
	// Login handler
	userAuth : function () {
		alert ('Login button clicked');
	}
});

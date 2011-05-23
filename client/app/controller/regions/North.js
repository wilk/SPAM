// @file 	North.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of view of north region of Viewport

Ext.define ('SC.controller.regions.North' , {
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
		var txtUser = Ext.getCmp('txtUsername').getValue ();
		
		// AJAX request to login
		Ext.Ajax.request ({
			url: 'login' ,
			params: [txtUser] ,
			success: function (response) {
				Ext.Msg.alert ('Success' , 'You are now logged in! ' + response.responseText);
			} ,
			failure: function (error) {
				Ext.Msg.alert ('Error' , 'Something goes wrong.\n' + error.responseText);
			}
		});
	}
});

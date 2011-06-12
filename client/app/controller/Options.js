// @file 	Options.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of options view

Ext.define ('SC.controller.Options' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['Options'] ,
	
	// Stores
	stores: ['Servers'] ,
	
	// Models
	models: ['Server'] ,
	
	// Configuration
	init: function () {
		var txtServerUrl;
		
		this.control ({
			// Init variables
			'options' : {
				afterrender : this.initVar ,
				hide : this.updateUrl
			} ,
			// Reset URL server text field
			'#btnOptionReset' : {
				click : this.resetFields
			}
		});

		console.log ('Controller North started.');
	} ,
	
	// @brief Initialize variables
	initVar : function (win) {
		txtServerUrl = win.down ('#tfServerUrl');
		txtServerUrl.setValue ('Spammers');
	} ,
	
	// @brief Update urlServerLtw global var
	updateUrl : function () {
		if (txtServerUrl.isValid ()) {
			// Get the associated field of serverID (e.g. Spammers -> ltw1102.web.cs.unibo.it)
			var record = this.getServersStore().findRecord ('serverID' , txtServerUrl.getValue ());
			urlServerLtw = record.get ('serverURL');
		}
		else
			// If it isn't valid (blank), reset field
			this.resetFields ();
	} ,
	
	// @brief Reset fields
	resetFields : function () {
		txtServerUrl.setValue ('Spammers');
	}
});

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
		var prevServerUrl;
		
		this.control ({
			// Init variables
			'options' : {
				afterrender : this.initVar ,
				show : this.saveServerValue
			} ,
			// Reset URL server text field
			'#btnOptionReset' : {
				click : this.resetFields
			} ,
			'#btnOptionApply' : {
				click : this.updateUrl
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
	updateUrl : function (button) {
		// If user is already logged-in, throw an error
		if (checkIfUserLogged ()) {
			Ext.Msg.show ({
				title: 'Error: server not changed.',
				msg: 'Logout before change server!' ,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.ERROR
			});
			
			// Reset field with previous value
			txtServerUrl.setValue (prevServerUrl);
		}
		// Otherwise update the server url
		else {
			// Get the associated field of serverID (e.g. Spammers -> ltw1102.web.cs.unibo.it)
			var record = Ext.StoreManager.lookup('serverStore').findRecord ('serverID' , txtServerUrl.getValue ());
			urlServerLtw = record.get ('serverURL');
			
			Ext.Msg.show ({
				title: 'Success.',
				msg: 'Server URL changed successfully!' ,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.INFO
			});
		}
	} ,
	
	// @brief Reset fields
	resetFields : function (button) {
		txtServerUrl.setValue ('Spammers');
		
		// Get the associated field of serverID (e.g. Spammers -> ltw1102.web.cs.unibo.it)
		var record = Ext.StoreManager.lookup('serverStore').findRecord ('serverID' , txtServerUrl.getValue ());
		urlServerLtw = record.get ('serverURL');
		
		Ext.Msg.show ({
			title: 'Success.',
			msg: 'Server URL reset successfully!' ,
			buttons: Ext.Msg.OK,
			icon: Ext.Msg.INFO
		});
	} ,
	
	// @brief Saves the initial server url after Option shows
	saveServerValue : function (win) {
		prevServerUrl = txtServerUrl.getValue ();
	}
});

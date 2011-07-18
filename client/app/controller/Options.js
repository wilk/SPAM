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
	stores: ['Server' , 'regions.west.user.Server'] ,
	
	// Models
	models: ['Server' , 'regions.west.user.Server'] ,
	
	// Configuration
	init: function () {
		var txtServerUrl;
		var prevServerUrl;
		var originalServerStore;
		var userServerStore;
		var isUserServerStoreChanged;
		
		this.control ({
			// Init variables
			'options' : {
				afterrender : this.initVar ,
				show : this.saveServerValue ,
				hide : this.resetTab
			} ,
			// Reset URL server text field
			'#btnOptionReset' : {
				click : this.resetFields
			} ,
			'#btnOptionApply' : {
				click : this.updateUrl
			} ,
			'#adServerColumn' : {
				click : this.onAction
			} ,
			// Show add/del column
			'#serverTab' : {
				activate : this.showAddDelColumn
			}
		});

		console.log ('Controller Options started.');
	} ,
	
	// @brief Initialize variables
	initVar : function (win) {
		txtServerUrl = win.down ('#tfServerUrl');
		txtServerUrl.setValue ('Spammers');
		
		// Get original and user federated servers lists
		originalServerStore = this.getServerStore ();
		userServerStore = this.getRegionsWestUserServerStore ();
		
		isUserServerStoreChanged = false;
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
			var record = this.getServerStore().findRecord ('serverID' , txtServerUrl.getValue ());
			
			// Local requests
			if (record.get ('serverID') == 'Spammers') {
				optionSin.setUrlServerLtw (record.get ('serverURL'));
				optionSin.setPureUrlServerLtw (record.get ('serverURL'));
				optionSin.setServerID (record.get ('serverID'));
			}
			// Cross requests (http://ltw1102.web.cs.unibo.it/federated-servers/serverID/)
			else {
				optionSin.setUrlServerLtw ('http://ltw1102.web.cs.unibo.it/federated-servers/' + record.get ('serverID') + '/');
				optionSin.setPureUrlServerLtw (record.get ('serverURL'));
				optionSin.setServerID (record.get ('serverID'));
			}
			
			Ext.Msg.show ({
				title: 'Success.',
				msg: 'Server URL changed successfully!' ,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.INFO
			});
			
			// Hide the option window
			button.up('window').hide ();
		}
	} ,
	
	// @brief Reset fields
	resetFields : function (button) {
		txtServerUrl.setValue ('Spammers');
		
		// Get the associated field of serverID (e.g. Spammers -> ltw1102.web.cs.unibo.it)
		optionSin.resetOption ();
		
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
	} ,
	
	// @brief Shows the action column to add/del federated servers
	showAddDelColumn : function (tab) {
		// If user is logged in, shows, else hide
		if (checkIfUserLogged ()) {
			tab.up('window').down('#adServerColumn').setVisible (true);
		}
		else {
			tab.up('window').down('#adServerColumn').setVisible (false);
		}
	} ,
	
	// @brief Select the right button (add/del) when actioncolumn is clicked
	onAction : function (view, cell, row, col, e) {
		// Retrieve add and delete iconCls
		var m = e.getTarget().className.match (/\bicon-(\w+)\b/);
		
		// Get the associated record (model)
		var record = originalServerStore.getAt (row);
		
		// Get its index (-1 if it doesn't exists)
		var indexRec = userServerStore.find ('serverID' , record.get ('serverID'));
		
		if (m) {
			// Check the right button
			switch (m[1]) {
				// Add
				case 'add':
					// If user wants to add an existing server, return an error
					if (indexRec != -1) {
						Ext.Msg.show ({
							title: 'Error',
							msg: record.get ('serverID') + ' already exists in the user federated servers list.' ,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
					}
					else {
						// Otherwise, add the selected server to the user federated servers list
						// In this case, do not add with record because the store of the original
						// federated servers list has a further parameter (serverURL)
						userServerStore.add ({serverID : record.get ('serverID')});
						
						// And then sort the store
						userServerStore.sort ('serverID' , 'ASC');
						
						isUserServerStoreChanged = true;
					}
					break;
				// Delete
				case 'delete':
					// If user wants to delete an inexistent server, return an error
					if (indexRec == -1) {
						Ext.Msg.show ({
							title: 'Error',
							msg: record.get ('serverID') + ' doesn\'t exists in the user federated servers list.' ,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
					}
					else {
						// Otherwise, delete the selected server to the user federated servers list
						userServerStore.removeAt (indexRec);
						
						// And then sort the store
						userServerStore.sort ('serverID' , 'ASC');
						
						isUserServerStoreChanged = true;
					}
					break;
			}
		}
	} ,
	
	// @brief Set active the first tab
	resetTab : function (win) {
		win.down('tabpanel').setActiveTab (0);
		
		// If something is been added or deleted from the store of the user federated servers list, update it!
		if (isUserServerStoreChanged) {
		
			// Build the param to send to the server to update the new user federated servers list
			var serverList = '<servers>';
		
			userServerStore.each (function (record) {
				serverList += '<server serverID="' + record.get ('serverID') + '" />';
			});
		
			serverList += '</servers>';
		
			Ext.Ajax.request ({
				method: 'POST' ,
				url: optionSin.getUrlServerLtw () + 'server' ,
				params: {servers : serverList} ,
				success: function (response) {
					Ext.Msg.show ({
						title: 'Success!',
						msg: 'The new servers list is been saved correctly!' ,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.INFO
					});
				} ,
				failure: function (error) {
					Ext.Msg.show ({
						title: error.status + ' ' + errorSin.getErrorTitle (error.status) ,
						msg: errorSin.getErrorText (error.status) ,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				}
			});
			
			isUserServerStoreChanged = false;
		
		}
	}
});

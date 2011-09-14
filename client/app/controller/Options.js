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
				click : this.updateOptions
			} ,
			'#adServerColumn' : {
				click : this.onAction
			} ,
			// Show add/del column
			'#serverTab' : {
				activate : this.showAddDelColumn
			}
		});
	} ,
	
	// @brief Initialize variables
	initVar : function (win) {
		// Search and navigator numberfield
		this.searchNF = Ext.getCmp ('numberSearchDefault');
		this.navigatorNF = Ext.getCmp ('numberNavigatorDefault');
		
		this.txtServerUrl = win.down ('#tfServerUrl');
		this.txtServerUrl.setValue ('Spammers');
		
		// Get original and user federated servers lists
		this.originalServerStore = this.getServerStore ();
		this.userServerStore = this.getRegionsWestUserServerStore ();
		
		this.isUserServerStoreChanged = false;
	} ,
	
	// @brief Saves the initial server url after Option shows
	saveServerValue : function (win) {
		this.prevServerUrl = optionSin.getServerID ();
	} ,
	
	// @brief Set active the first tab
	resetTab : function (win) {
		// Reset numberfields
		this.searchNF.setValue (optionSin.getSearchNumber ());
		this.navigatorNF.setValue (optionSin.getNavigatorNumber ());

		win.down('tabpanel').setActiveTab (0);
		
		// If something is been added or deleted from the store of the user federated servers list, update it!
		if (this.isUserServerStoreChanged) {
		
			// Build the param to send to the server to update the new user federated servers list
			var serverList = '<servers>';
		
			this.userServerStore.each (function (record) {
				serverList += '<server serverID="' + record.get ('serverID') + '" />';
			});
		
			serverList += '</servers>';
		
			Ext.Ajax.request ({
				method: 'POST' ,
				url: optionSin.getUrlServerLtw () + 'servers' ,
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
			
			this.isUserServerStoreChanged = false;
		
		}
	} ,
	
	// @brief Reset fields
	resetFields : function (button) {
		this.txtServerUrl.setValue ('Spammers');
		
		// Get the associated field of serverID (e.g. Spammers -> ltw1102.web.cs.unibo.it)
		optionSin.resetOption ();
		
		Ext.Msg.show ({
			title: 'Success.',
			msg: 'Server URL reset successfully!' ,
			buttons: Ext.Msg.OK,
			icon: Ext.Msg.INFO
		});
	} ,
	
	// @brief Update options variables
	updateOptions: function (button) {
		// Update search&navigator default number
		if (this.searchNF.isValid ()) {
			optionSin.setSearchNumber (this.searchNF.getValue ());
			Ext.getCmp('numberSearch').setValue (optionSin.getSearchNumber ());
		}
		if (this.navigatorNF.isValid ()) optionSin.setNavigatorNumber (this.navigatorNF.getValue ());
		
		// If user is already logged-in, throw an error
		if (checkIfUserLogged ()) {
			Ext.Msg.show ({
				title: 'Success',
				msg: 'Options has been changed successfully but server list is not changed.<br />If you want to change the server, logout before!' ,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.INFO
			});
			
			// Reset field with previous value
			this.txtServerUrl.setValue (this.prevServerUrl);
		}
		// Otherwise update the server url
		else {
			// Get the associated field of serverID (e.g. Spammers -> ltw1102.web.cs.unibo.it)
			var record = this.getServerStore().findRecord ('serverID' , this.txtServerUrl.getValue ());
			
			// Local requests
			if (record.get ('serverID') == 'Spammers') {
				// TODO: remove when it's on golem
//				optionSin.setUrlServerLtw (record.get ('serverURL'));
//				optionSin.setPureUrlServerLtw (record.get ('serverURL'));
				optionSin.setUrlServerLtw ('');
				optionSin.setPureUrlServerLtw ('');
				optionSin.setServerID (record.get ('serverID'));
			}
			// Cross requests (http://ltw1102.web.cs.unibo.it/federated-servers/serverID/)
			else {
				optionSin.setUrlServerLtw ('http://ltw1102.web.cs.unibo.it/federated-servers/' + record.get ('serverID') + '/');
				optionSin.setPureUrlServerLtw (record.get ('serverURL'));
				optionSin.setServerID (record.get ('serverID'));
			}
			
			Ext.Msg.show ({
				title: 'Success',
				msg: 'Options has been changed successfully!' ,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.INFO
			});
		}
		
		// Hide the option window
		button.up('window').hide ();
	} ,
	
	// @brief Select the right button (add/del) when actioncolumn is clicked
	onAction : function (view, cell, row, col, e) {
		// Retrieve add and delete iconCls
		var m = e.getTarget().className.match (/\bicon-(\w+)\b/);
		
		// Get the associated record (model)
		var record = this.originalServerStore.getAt (row);
		
		// Get its index (-1 if it doesn't exists)
		var indexRec = this.userServerStore.find ('serverID' , record.get ('serverID'));
		
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
						this.userServerStore.add ({serverID : record.get ('serverID')});
						
						// And then sort the store
						this.userServerStore.sort ('serverID' , 'ASC');
						
						this.isUserServerStoreChanged = true;
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
						this.userServerStore.removeAt (indexRec);
						
						// And then sort the store
						this.userServerStore.sort ('serverID' , 'ASC');
						
						this.isUserServerStoreChanged = true;
					}
					break;
			}
		}
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
	}
});

// @file 	Search.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of search view

Ext.define ('SC.controller.regions.west.Search' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.west.Search'] ,
	
	models: ['regions.center.Articles'] ,
	stores: ['regions.center.Articles'] ,
	
	// Configuration
	init: function () {
		this.control ({
			'search' : {
				afterrender : this.initVar
			} ,
			// Combo change events
			'#comboSearch' : {
				// When user select 'Following', textfield disappear
				select : this.updateTextValue
			} ,
			// Reset
			'#resetSearch' : {
				click : this.formReset
			} ,
			// Submit
			'#submitSearch' : {
				click : this.submitSearch
			} ,
			// Textfield events
			'#textSearch' : {
				// Handle ENTER key
				keypress : function (field , event) {
					if (event.getKey () == event.ENTER)
						this.submitSearch ();
				}
			} ,
			// Checkbox events
			'#checkBoxSearch' : {
				// Enable/Disable numberfield when maximum checkbox changed
				change : function (cb, nVal, oVal) {
					if (nVal)
						Ext.getCmp('numberSearch').setDisabled (true);
					else
						Ext.getCmp('numberSearch').setDisabled (false);
				}
			}
		});
	} ,
	
	// @brief Initialize variables
	initVar : function (panel) {
		this.sPanel = panel;
		this.sCombo = panel.down ('#comboSearch');
		this.sTextfield = panel.down ('#textSearch');
		this.sNumberfield = panel.down ('#numberSearch');
		this.sCheckbox = panel.down ('#checkBoxSearch');
		this.store = this.getRegionsCenterArticlesStore ();
	} ,
	
	// @brief Update textfield value
	updateTextValue : function (combo, value) {
		// For each combo value, set the appropriate value to the textfield
		switch (combo.getValue ()) {
			case 'Author':
				this.sTextfield.emptyText = '/serverID/userID';
				this.sTextfield.reset ();
				this.sTextfield.setDisabled (false);
				break;
			case 'Following':
				this.sTextfield.setDisabled (true);
				break;
			case 'Recent':
				this.sTextfield.emptyText = 'Term to search' ,
				this.sTextfield.reset ();
				this.sTextfield.setDisabled (false);
				break;
			case 'Related':
				this.sTextfield.emptyText = 'Term of Thesaurus' ,
				this.sTextfield.reset ();
				this.sTextfield.setDisabled (false);
				break;
			case 'Fulltext':
				this.sTextfield.emptyText = 'Some to search' ,
				this.sTextfield.reset ();
				this.sTextfield.setDisabled (false);
				break;
			case 'Affinity':
				this.sTextfield.emptyText = '/serverID/userID/postID' ,
				this.sTextfield.reset ();
				this.sTextfield.setDisabled (false);
				break;
		}
	} ,
	
	// @brief Reset all search fields
	formReset : function (button) {		
		this.sCombo.reset ();
		this.sTextfield.reset ();
		this.sTextfield.setVisible (true);
		this.sNumberfield.reset ();
		this.sCheckbox.reset ();
	} ,
	
	submitSearch : function (button) {
		var limit;
		
		// Checks to set 'all' or a number to search limit
		if (this.sCheckbox.getValue ())
			limit = 'all';
		else
			limit = this.sNumberfield.getValue ();
		
		// Check if combo and number boxes are empty or not
		if (this.sCombo.isValid () && this.sNumberfield.isValid ()) {
			// Check the type of search
			switch (this.sCombo.getValue ()) {
				case 'Author' :
					if (this.sTextfield.isValid ()) {
						// Set appropriate URL
						this.store.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + limit + '/author' + this.sTextfield.getValue ();
						
						// Setup loading mask to the search panel
						this.sPanel.setLoading (true);
						
						// Retrieve articles
						requestSearchArticles (this.store, null, 0);
					}
					// If textfield is empty, return an error
					else {
						Ext.Msg.show ({
							title: 'Error' ,
							msg: 'You must specify an author (/serverID/userID)' ,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
					}
					break;
				case 'Following' :
					if (checkIfUserLogged ()) {
						// Set appropriate URL
						this.store.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + limit + '/following';
					
						// Setup loading mask to the search panel
						this.sPanel.setLoading (true);
						
						// Retrieve articles
						requestSearchArticles (this.store, null, 0);
					}
					// If user isn't logged in, return an error
					else {
						Ext.Msg.show ({
							title: 'Error' ,
							msg: 'You must login before to perform this search.' ,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
					}
					break;
				case 'Recent' :
					if (this.sTextfield.isValid ()) {
						// Set appropriate URL
						this.store.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + limit + '/recent/' + this.sTextfield.getValue ();
					
						// Setup loading mask to the search panel
						this.sPanel.setLoading (true);
						
						// Retrieve articles
						requestSearchArticles (this.store, null, 0);
					}
					// If textfield is empty, return an error
					else {
						Ext.Msg.show ({
							title: 'Error' ,
							msg: 'You must specify a term to search.' ,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
					}
					break;
				case 'Related' :
					if (this.sTextfield.isValid ()) {
						// Set appropriate URL
						this.store.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + limit + '/related/' + this.sTextfield.getValue ();
					
						// Setup loading mask to the search panel
						this.sPanel.setLoading (true);
					
						// Retrieve articles
						requestSearchArticles (this.store, null, 0);
					}
					// If textfield is empty, return an error
					else {
						Ext.Msg.show ({
							title: 'Error' ,
							msg: 'You must specify the term to search.' ,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
					}
					break;
				case 'Fulltext' :
					if (this.sTextfield.isValid ()) {
						// Set appropriate URL
						this.store.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + limit + '/fulltext/' + this.sTextfield.getValue ();
					
						// Setup loading mask to the search panel
						this.sPanel.setLoading (true);
					
						// Retrieve articles
						requestSearchArticles (this.store, null, 0);
					
					}
					// If textfield is empty, return an error
					else {
						Ext.Msg.show ({
							title: 'Error' ,
							msg: 'You must specify the term to search.' ,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
					}
					break;
				case 'Affinity' :
					if (this.sTextfield.isValid ()) {
						// Set appropriate URL
						this.store.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + limit + '/affinity' + this.sTextfield.getValue ();
					
						// Setup loading mask to the search panel
						this.sPanel.setLoading (true);
					
						// Retrieve articles
						requestSearchArticles (this.store, null, 0);
					
					}
					// If textfield is empty, return an error
					else {
						Ext.Msg.show ({
							title: 'Error' ,
							msg: 'You must specify a post (/serverID/userID/postID)' ,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
					}
					break;
				default:
					Ext.Msg.show ({
						title: 'Error' ,
						msg: 'This search method isn\'t implemented yet.' ,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
			}
		}
		else {
			Ext.Msg.show ({
				title: 'Error' ,
				msg: 'You must specify the type of search and the number of posts to retreive.' ,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.ERROR
			});
		}
	}
});

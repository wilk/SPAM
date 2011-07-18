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
		var sCombo, sTextfield, sNumberfield, sCheckbox, store;
		
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
				// Erase raw text
				focus : function (tf) {
					tf.setValue ('');
				} ,
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
	
		console.log ('Controller Search started.');
	} ,
	
	// @brief Initialize variables
	initVar : function (panel) {
		sCombo = panel.down ('#comboSearch');
		sTextfield = panel.down ('#textSearch');
		sNumberfield = panel.down ('#numberSearch');
		sCheckbox = panel.down ('#checkBoxSearch');
		store = this.getRegionsCenterArticlesStore ();
	} ,
	
	// @brief Update textfield value
	updateTextValue : function (combo, value) {
		// For each combo value, set the appropriate value to the textfield
		switch (combo.getValue ()) {
			case 'Author':
				sTextfield.setRawValue ('/serverID/userID');
				sTextfield.setVisible (true);
				break;
			case 'Following':
				sTextfield.setVisible (false);
				break;
			case 'Recent':
				sTextfield.setRawValue ('Term of Thesaurus');
				sTextfield.setVisible (true);
				break;
			case 'Related':
				sTextfield.setRawValue ('Term of Thesaurus');
				sTextfield.setVisible (true);
				break;
			case 'Fulltext':
				sTextfield.setRawValue ('Some to search');
				sTextfield.setVisible (true);
				break;
			case 'Affinity':
				sTextfield.setRawValue ('/serverID/userID/postID');
				sTextfield.setVisible (true);
				break;
		}
	} ,
	
	// @brief Reset all search fields
	formReset : function (button) {		
		sCombo.reset ();
		sTextfield.reset ();
		sTextfield.setVisible (true);
		sNumberfield.reset ();
		sCheckbox.reset ();
	} ,
	
	submitSearch : function (button) {
		var limit;
		
		// Checks to set 'all' or a number to search limit
		if (sCheckbox.getValue ())
			limit = 'all';
		else
			limit = sNumberfield.getValue ();
		
		// Check if combo and number boxes are empty or not
		if (sCombo.isValid () && sNumberfield.isValid ()) {
			// Check the type of search
			switch (sCombo.getValue ()) {
				case 'Author' :
					// Set appropriate URL
					store.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + limit + '/author' + sTextfield.getValue ();
					
					// Retrieve articles
					requestSearchArticles (store, null, 0);
					
					break;
				case 'Following' :
					// Set appropriate URL
					store.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + limit + '/following';
					
					// Retrieve articles
					requestSearchArticles (store, null, 0);
					
					break;
				case 'Recent' :
					// Set appropriate URL
					store.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + limit + '/recent/' + sTextfield.getValue ();
					
					// Retrieve articles
					requestSearchArticles (store, null, 0);
					break;
				case 'Related' :
					if (sTextfield.isValid ()) {
						// Set appropriate URL
						store.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + limit + '/related/' + sTextfield.getValue ();
					
						// Retrieve articles
						requestSearchArticles (store, null, 0);
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
					if (sTextfield.isValid ()) {
						// Set appropriate URL
						store.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + limit + '/fulltext/' + sTextfield.getValue ();
					
						// Retrieve articles
						requestSearchArticles (store, null, 0);
					
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
					if (sTextfield.isValid ()) {
						// Set appropriate URL
						store.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + limit + '/affinity' + sTextfield.getValue ();
					
						// Retrieve articles
						requestSearchArticles (store, null, 0);
					
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

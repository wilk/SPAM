// @file 	AddTerm.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of AddTerm view
Ext.define ('SC.controller.AddTerm' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['AddTerm'] ,
	stores: ['ComboThesaurus'] ,
	models: ['ComboThesaurus'] ,
			
	// Configuration
	init: function () {
		var comboBox;
		var textField;
		var winAdd;
		var storeComboThesaurus;
		
		this.control ({
			'thesaurusaddterm': {
				afterrender : this.initVar ,
				hide : this.resetFields
			} ,
			// Apply button
			'#btnAddTermApply': {
				click : this.applyFields
			} ,
			// Reset button
			'#btnAddTermReset': {
				click : this.resetFields
			} ,
			// Textfield keypress handler
			'#tfAddTerm': {
				// Handle ENTER key
				keypress : function (field , event) {
					if (event.getKey () == event.ENTER)
						this.applyFields ();
				}
			}
		});
		
		console.log ('Controller AddTerm started.');
	} ,
	
	// @brief Initialize local variables
	initVar: function (win) {
		comboBox = win.down ('#comboAddTerm');
		textField = win.down ('#tfAddTerm');
		winAdd = win;
		
		storeComboThesaurus = this.getComboThesaurusStore ();
	} ,
	
	// @brief Send 
	applyFields: function (button) {
		// Check if fields are filled
		if (comboBox.isValid () && textField.isValid ()) {
			var cValue = comboBox.getValue ();
			var tValue = textField.getValue ();
			
			//var termToCheck = storeThesaurus.getNodeById (cValue);
			var termToCheck = storeComboThesaurus.findRecord ('term' , cValue);
			
			// Check if the parent term is present into the thesaurus
			if (termToCheck != null) {
			
				// Check if the parent term is a leaf
				if (termToCheck.get ('isLeaf')) {
				
					termToCheck = storeComboThesaurus.findRecord ('term' , tValue);
					
					// Check if term is present into thesaurus
					if (termToCheck == null) {
				
						// AJAX request to send new term to add
						Ext.Ajax.request ({
							url: urlServerLtw + 'addterm' ,
							method: 'POST' ,
							params: {
								parentterm : cValue ,
								term : tValue
							} ,
							success: function (response) {
								Ext.Msg.show ({
									title: 'Term added successfully!' ,
									msg: 'The term ' + tValue + ' is been added to the Thesaurus!' ,
									buttons: Ext.Msg.OK,
									icon: Ext.Msg.INFO
								});
							
								// Hide this window
								winAdd.hide ();
							
								// Reload thesaurus panel
								Ext.getCmp('thesaurusPanel').fireEvent ('afterrender');
							} ,
							failure: function (response) {
								Ext.Msg.show ({
									title: 'Error ' + response.status ,
									msg: response.responseText ,
									buttons: Ext.Msg.OK,
									icon: Ext.Msg.ERROR
								});
							}
						});
					}
					else {
						Ext.Msg.show ({
							title: 'Error' ,
							msg: tValue + ' is already present into Thesaurus. Choose a different one.' ,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
					}
				}
				else {
					Ext.Msg.show ({
						title: 'Error' ,
						msg: cValue + ' is not a leaf. Please choose a leaf.' ,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				}
			}
			else {
				Ext.Msg.show ({
					title: 'Error' ,
					msg: cValue + ' is not present in the Thesaurus.' ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
		}
		else {
			Ext.Msg.show ({
				title: 'Error' ,
				msg: 'Fill the fields first!' ,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.ERROR
			});
		}
	} ,
	
	// @brief Reset fields
	resetFields: function (button) {
		comboBox.reset ();
		textField.reset ();
	}
});

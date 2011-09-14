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
	stores: ['ComboThesaurus' , 'Server'] ,
	models: ['ComboThesaurus' , 'Server'] ,
			
	// Configuration
	init: function () {
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
	} ,
	
	// @brief Initialize local variables
	initVar: function (win) {
		this.comboBox = win.down ('#comboAddTerm');
		this.textField = win.down ('#tfAddTerm');
		this.win = win;
		
		this.storeComboThesaurus = this.getComboThesaurusStore ();
	} ,
	
	// @brief Reset fields
	resetFields: function (button) {
		this.comboBox.reset ();
		this.textField.reset ();
	} ,
	
	// @brief Send 
	applyFields: function (button) {
		// Check if fields are filled
		if (this.comboBox.isValid () && this.textField.isValid ()) {
			var cValue = this.comboBox.getValue ();
			var tValue = this.textField.getValue ();
			
			//var termToCheck = storeThesaurus.getNodeById (cValue);
			var termToCheck = this.storeComboThesaurus.findRecord ('term' , cValue);
			
			// Check if the parent term is present into the thesaurus
			if (termToCheck != null) {
			
				// Check if term belongs to the shared thesaurus and check if it's a leaf (with magic number 3 (depth))
				if ((termToCheck.get ('ns') == 'http://vitali.web.cs.unibo.it/TechWeb11/thesaurus') && (termToCheck.get('path').split('/').length < 4)) {
					Ext.Msg.show ({
						title: 'Error' ,
						msg: cValue + ' is not a leaf. Please choose a leaf.' ,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				}
				else {				
					termToCheck = this.storeComboThesaurus.findRecord ('term' , tValue);
					
					// Check if term is present into thesaurus
					if (termToCheck == null) {
				
						// AJAX request to send new term to add
						Ext.Ajax.request ({
							url: optionSin.getUrlServerLtw () + 'addterm' ,
							method: 'POST' ,
							scope: this ,
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
								this.win.hide ();
							
								// Reload thesaurus panel
								Ext.getCmp('thesaurusPanel').fireEvent ('afterrender');
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
	}
});

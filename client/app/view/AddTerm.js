// @file 	AddTerm.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	View to add new terms to the thesaurus

Ext.define ('SC.view.AddTerm' , {
	extend: 'Ext.window.Window' ,
	alias: 'widget.thesaurusaddterm' ,
	
	// Configuration
	title: 'Add new term' ,
	id: 'windowAddTerm' ,
	height: 200 ,
	width: 400 ,
	resizable: false ,
	// On top of any content
	modal: true ,
	layout: 'anchor' ,
	closeAction: 'hide' ,
	bodyPadding: 10 ,
	
	// Body
	items: [{
		// Combo of Thesaurus
		xtype: 'combo' ,
		id: 'comboAddTerm' ,
		fieldLabel: 'Choose father of the new term ' ,
		anchor: '100%' ,
		allowBlank: false ,
		editable: true ,
		typeAhead: true ,
		displayField: 'term' ,
		labelAlign: 'top' ,
		labelWidth: 130 ,
		store: 'ComboThesaurus' ,
		queryMode: 'local'
	} , {
		// Text box to insert the term to add to the thesaurus
		xtype: 'textfield' ,
		id: 'tfAddTerm' ,
		fieldLabel: 'Insert a new term to add ' ,
		emptyText: 'Term to add' ,
		anchor: '100%' ,
		allowBlank: false ,
		labelAlign: 'top' ,
		enableKeyEvents: true
	}] ,
	
	// Docked buttons
	dockedItems: [{
		xtype: 'toolbar' ,
		dock: 'bottom' ,
		ui: 'footer' ,
		items: ['->' , {
			// Reset Button
			id: 'btnAddTermReset' ,
			text: 'Reset'
		} , {
			// Apply Button
			id: 'btnAddTermApply' ,
			text: 'Apply'
		}]
	}]
});

// @file 	Search.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Search panel

Ext.define ('SC.view.regions.west.Search' , {
	extend: 'Ext.panel.Panel' ,
	alias: 'widget.search' ,
	
	// Configuration
	title: 'Search' ,
//	autoWidth: true ,
//	width:'100%',
	collapsible: true ,
	animCollapse: true ,
	bodyPadding: 2 ,
//	anchor: '100%' ,
	layout: 'anchor' ,
	
	// Body
	items: [{
		xtype: 'combo' ,
		id: 'comboSearch' ,
		anchor: '100%' ,
		// User can only choose
		editable: false ,
		// Different types of search
		store: [
			'Author' ,
			'Following' ,
			'Recent' ,
			'Related' ,
			'Fulltext'
		] ,
//		queryMode: 'local' ,
		value: 'Fulltext' ,
		allowBlank: false
		
//		typeAhead: true
	} , {
		xtype: 'numberfield' ,
		id: 'numberSearch' ,
		value: 1 ,
		minValue: 1 ,
		allowBlank: false ,
		anchor: '100%'
	} , {
		xtype: 'textfield' ,
		id: 'textSearch' ,
		emptyText: 'Term to search' ,
		anchor: '100%' ,
		enableKeyEvents: true ,
		allowBlank: false
	}] ,
	
	// Dockbar
	dockedItems: [{
		xtype: 'toolbar' ,
		dock: 'bottom' ,
//		ui: 'footer' ,
		items: ['->' , {
			text: 'Reset' ,
			id: 'resetSearch'
		} , {
			text: 'Submit' ,
			id: 'submitSearch'
		}]
	}]
});

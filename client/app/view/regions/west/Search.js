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
	id: 'panelSearch' ,
	collapsible: true ,
	animCollapse: true ,
	bodyPadding: 2 ,
	layout: 'anchor' ,
	height: 160 ,
	
	// Body
	items: [{
		xtype: 'combo' ,
		id: 'comboSearch' ,
		anchor: '100%' ,
		// User can only choose
		editable: false ,
		// Different types of search
		store: [
			'Affinity' ,
			'Author' ,
			'Following' ,
			'Recent' ,
			'Related' ,
			'Fulltext'
		] ,
		value: 'Fulltext' ,
		allowBlank: false
	} , {
		xtype: 'numberfield' ,
		id: 'numberSearch' ,
		value: 10 ,
		minValue: 1 ,
		allowBlank: false ,
		anchor: '100%'
	} , {
		// Checkbox Maximum limit
		xtype: 'checkboxfield' ,
		boxLabel: 'Maximum limit' ,
		id: 'checkBoxSearch' ,
		padding: '0 0 2 5' ,
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
		ui: 'footer' ,
		items: ['->' , {
			// Reset
			text: 'Reset' ,
			id: 'resetSearch' ,
			icon: 'ext/resources/images/btn-icons/reset.png'
		} , {
			// Search
			text: 'Search' ,
			id: 'submitSearch' ,
			icon: 'ext/resources/images/btn-icons/search.png'
		}]
	}]
});

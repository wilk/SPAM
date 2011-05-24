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
	autoWidth: true ,
	collapsible: true ,
	animCollapse: true ,
	bodyPadding: 2 ,
	anchor: '100%' ,
	layout: 'anchor' ,
	
	// Body
	items: [{
		xtype: 'textfield' ,
		emptyText: 'search' ,
		anchor: '100%'
	}] ,
	
	// Dockbar
	dockedItems: [{
		xtype: 'toolbar' ,
		dock: 'bottom' ,
		items: [{
			text: 'Advanced' ,
			id: 'advancedButton'
		}]
	}]
});

// @file 	West.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	View of west region of Viewport

Ext.define ('SC.view.regions.West' , {
	extend: 'Ext.panel.Panel' ,
	alias: 'widget.westregion' ,
	
	// Panel views
	requires: [
		'SC.view.regions.west.User' ,
		'SC.view.regions.west.Search' ,
		'SC.view.regions.west.Thesaurus'
	] ,
	
	// Configuration
	title: 'Menu' ,
	region: 'west' ,
	minWidth: 158 ,
	maxWidth: 300 ,
	collapsible: true ,
	layout: {
		type:'vbox',
		align:'stretch'
	},
	autoScroll:true,
	split: true ,
	
	// Body
	items: [{
		xtype: 'user' 
	} , {
		xtype: 'search'
	} , {
		xtype: 'thesaurus'
	}]
});

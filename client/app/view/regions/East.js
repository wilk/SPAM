// @file 	East.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	View of east region of Viewport

Ext.define ('SC.view.regions.East' , {
	extend: 'Ext.panel.Panel' ,
	alias: 'widget.eastregion' ,
	
	// Panel views
	requires: [
		'SC.view.regions.east.RecentPost' ,
		'SC.view.regions.east.TagCloud'
	] ,
	
	// Configuration
	title: 'Menu' ,
	region: 'east' ,
	minWidth: 158 ,
	maxWidth: 300 ,
	collapsible: true ,
	split: true ,
	layout: 'anchor' ,
	
	// Body
	items: [{
		xtype: 'recentpost'
	} , {
		xtype: 'tagcloud'
	}]
});

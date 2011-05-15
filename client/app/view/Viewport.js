// @file 	Viewport.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	The Viewport

Ext.define ('SC.view.Viewport' , {
	extend: 'Ext.container.Viewport' ,
	
	// Region views
	requires: [
		'SC.view.regions.North' ,
		'SC.view.regions.West' ,
		'SC.view.regions.East' ,
		'SC.view.regions.Center' ,
	] ,
	
	// Configuration
	layout: 'border' ,
	
	// Body
	items: [{
		xtype: 'northregion'
	} , {
		xtype: 'westregion'
	} , {
		xtype: 'eastregion'
	} , {
		xtype: 'centerregion'
	}]
});

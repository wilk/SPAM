// @file 	Center.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	View of center region of Viewport

Ext.define ('SC.view.regions.Center' , {
	extend: 'Ext.container.Container' ,
	alias: 'widget.centerregion' ,
	
	// Views
	requires: ['SC.view.regions.center.Post'] ,
	
	// Configuration
	region: 'center' ,
	id: 'centReg' ,
	items: [{
		xtype: 'post'
	}]
});

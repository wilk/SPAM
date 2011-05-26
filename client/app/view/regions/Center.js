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
	requires: ['SC.view.regions.center.Post',
		'SC.view.regions.center.ServerEdit'] ,
	
	// Configuration
	region: 'center' ,
	items: [{
		xtype: 'post'
	}]
//		xtype: 'panel' ,
//		autoHeight: true ,
//		autoWidth: true ,
//		title: 'Center' ,
//		html: 'center'
//	}]
});

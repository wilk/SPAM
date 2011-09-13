// @file 	Navigator.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Navigator window

Ext.define ('SC.view.regions.center.Navigator' , {
	extend: 'Ext.window.Window' ,
	alias: 'widget.navigatorwin' ,
	
	// Configuration
	id: 'navigatorWindow' ,
	maxWidth: 100 ,
	maxHeight: 57 ,
	resizable: false ,
	closable: false ,
	constrain: true ,
	
	// Body
	items: [{
		// First
		xtype: 'button' ,
		icon: 'ext/resources/themes/images/default/grid/page-first.gif' ,
		tooltip: 'First' ,
		scale: 'medium' ,
		disabled: true
	} , {
		// Previous
		xtype: 'button' ,
		icon: 'ext/resources/themes/images/default/grid/page-prev.gif' ,
		tooltip: 'Previous' ,
		scale: 'medium' ,
		disabled: true
	} , {
		// Next
		xtype: 'button' ,
		icon: 'ext/resources/themes/images/default/grid/page-next.gif' ,
		tooltip: 'Next' ,
		scale: 'medium'
	} , {
		// Last
		xtype: 'button' ,
		icon: 'ext/resources/themes/images/default/grid/page-last.gif' ,
		tooltip: 'Last' ,
		scale: 'medium'
	}]
});

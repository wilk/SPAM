// @file 	User.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	User panel

Ext.define ('SC.view.regions.west.User' , {
	extend: 'Ext.panel.Panel' ,
	alias: 'widget.user' ,
	
	// Configuration
	id: 'userPanel' ,
	autoWidth: true ,
	collapsible: true ,
	animCollapse: true ,
	bodyPadding: 2 ,
	anchor: '100%' ,
	layout: 'anchor' ,
	hidden: true
});

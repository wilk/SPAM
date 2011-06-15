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
//	autoWidth: true ,
	collapsible: true ,
	animCollapse: true ,
	bodyPadding: 0 ,
	maxHeight:150,
//	anchor: '100%' ,
//	layout: 'anchor' ,
	hidden: true,
	items:[{
	//Grid for user's personal server
		xtype:'grid',
		id:'userGrid',
		store:'userStore',
		autoScroll:true,
		forceFit:true,
//		frame: false ,
		border: 0 ,
//		bodyPadding: 0 ,
//		anchor: '100%' ,
		columns:[{
			header: 'server name' ,
			dataIndex: 'serverID'
		}]
	}]
});

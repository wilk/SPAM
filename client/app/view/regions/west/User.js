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
	height:265,
	collapsible: true ,
	animCollapse: true ,
	bodyPadding: 0 ,
//	anchor: '100%' ,
	layout: 'accordion' ,
	hidden: true,
	items:[{
		// Grid for user's personal server
		xtype: 'grid' ,
		title: 'Server' ,
		id: 'userGrid' ,
		store: 'regions.west.user.Server' ,
		autoScroll:true,
		forceFit:true,
		border: 0 ,
		columns:[{
			header: 'Server Name' ,
			dataIndex: 'serverID'
		}]
	} , {
		title: 'Followers' ,
		xtype: 'grid' ,
		id: 'userFollowersGrid' ,
		store: 'regions.west.Followers' ,
		autoScroll: true ,
		border: 0 ,
		columns: [{
			header: 'Followers' ,
			dataIndex: 'follower'
		}]
	}]
});

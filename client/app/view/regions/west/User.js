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
	height:265,
	collapsible: true ,
	animCollapse: true ,
	bodyPadding: 0 ,
	layout: 'accordion' ,
	hidden: true ,
	
	// Body
	items:[{
		// Grid for user's personal server
		xtype: 'grid' ,
		title: 'Server' ,
		id: 'userGrid' ,
		store: 'regions.west.user.Server' ,
		autoScroll: true ,
		forceFit: true ,
		border: 0 ,
		columns: [{
			header: 'Server Name' ,
			dataIndex: 'serverID'
		}]
	} , {
		// Followers grid
		// TODO: header is hidden BUG BUG
		xtype: 'grid' ,
		title: 'Followers' ,
		id: 'userFollowersGrid' ,
		store: 'regions.west.Followers' ,
		autoScroll: true ,
		layout: 'anchor' ,
		border: 0 ,
		columns: [{
			header: 'Your Friends' ,
			dataIndex: 'follower'
		}]
	}]
});

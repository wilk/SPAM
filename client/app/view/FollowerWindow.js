// @file 	FollowerWindow.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Follower profile view

Ext.define ('SC.view.FollowerWindow' , {
	extend: 'Ext.window.Window' ,
	alias: 'widget.followerwindow' ,
	
	// Configuration
	id: 'windowFollower' ,
	height: 210 ,
	width: 350 ,
	resizable: false ,
	// On top of any content
	modal: true ,
	layout: 'anchor' ,
	bodyPadding: 10 ,
	closeAction: 'hide' ,
	
	// Body
	html: '<table><tr><td rowspan="6"><img src="ext/resources/images/profile.png" alt="profile" /></td></tr><tr><td><b>Name :</b></td><td><i id="followerUserName">name</i></td></tr><tr><td><b>Server : </b></td><td><i id="followerUserServer">server</i></td></tr><tr><td><b>Email :</b></td><td><i>Not implemented</i></td></tr><tr><td><b>Description : </b></td><td><i>Not implemented</i></td></tr></table>' ,
	
	// Docked buttons
	dockedItems: {
		xtype: 'toolbar' ,
		dock: 'bottom' ,
		ui: 'footer' ,
		items: ['->' , {
			// Unfollow button
			text: 'Unfollow' ,
			id: 'btnProfileUnfollow' ,
			icon: 'ext/resources/images/btn-icons/unfollow.gif'
		} , {
			// Search button
			text: 'Search by Athor' ,
			id: 'btnProfileSearch' ,
			icon: 'ext/resources/images/btn-icons/search.png'
		}]
	}
});

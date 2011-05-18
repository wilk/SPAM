// @file 	Post.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Widget window for reading posts

Ext.define ('SC.view.regions.center.Post' , {
	extend: 'Ext.window.Window' ,
	alias: 'widget.post' ,
	
	// Configuration
//	title: 'New post' , // Filled dinamically
	id: 'windowPost' , // Filled dinamically
	minHeight: 150 ,
	minWidth: 200 ,
	height: 250 ,
	width: 450 ,
	maximizable: true ,
	collapsible: true ,
	layout: 'anchor' ,
	bodyPadding: 10 ,
	constrain: true ,
//	html: , // Filled dinamically
	
	// Bottom buttons
	dockedItems: [{
		xtype: 'toolbar' ,
		dock: 'bottom' ,
		ui: 'footer' ,
		// Items right-justified
		items: [{
			// Button I Like
			text: 'Like' , 
			id: 'buttonILike'
		} , {
			// Button I Dislike
			text: 'Dislike' ,
			id: 'buttonIDislike'
		} , '->' , {
			// Button reply
			text: 'Reply' ,
			id: 'buttonReply'
		} , {
			// Button retweet
			text: 'Retweet' ,
			id: 'buttonRetweet'
		}]
	}]
});

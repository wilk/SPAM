// @file 	Articles.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Window template for articles

Ext.define ('SC.view.regions.center.Articles' , {
	extend: 'Ext.window.Window' ,
	alias: 'widget.articles' ,
	
	store: 'regions.center.Articles' ,
	
	// Configuration
	height: 200 ,
	width: 300 ,
	autoWidth: true ,
	autoHeight: true ,
	collapsible: true ,
	animCollapse: true ,
	bodyPadding: 2 ,
	layout: 'anchor' ,
	maximizable: true ,
	constrain: true
	
	// Bottom buttons
//	dockedItems: [{
//		xtype: 'toolbar' ,
//		dock: 'bottom' ,
//		ui: 'footer' ,
//		// Items right-justified
//		items: [{
//			// Button I Like
//			text: 'Like' 
////			id: 'btnLike'
//		} , {
//			// Button I Dislike
//			text: 'Dislike'
////			id: 'btnDislike'
//		} , '->' , {
//			// Button focus
//			text: 'Focus'
////			id: 'btnFocus'
//		} , '->' , {
//			// Button reply
//			text: 'Reply'
////			id: 'btnReply'
//		} , {
//			// Button retweet
//			text: 'Respam'
////			id: 'btnRespam'
//		}]
//	}]
});

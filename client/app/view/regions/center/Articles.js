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
	
	// Configuration
	height: 200 ,
	width: 330 ,
	autoWidth: true ,
	autoHeight: true ,
	bodyPadding: 5 ,
	layout: 'anchor' ,
	maximizable: true ,
	constrain: true ,
	autoScroll: true ,
	
	dockedItems: {
		xtype: 'toolbar' ,
		dock: 'bottom' ,
		ui: 'footer' ,
		// Only focus button
		items: [{
			// Button I Like
			cls: 'x-btn-icon' ,
			icon: 'ext/resources/images/btn-icons/like.png' ,
			tooltip: 'I Like' ,
			hidden: true
		} , {
			// Button I Dislike
			cls: 'x-btn-icon' ,
			icon: 'ext/resources/images/btn-icons/dislike.png' ,
			tooltip: 'I Dislike' ,
			hidden: true
		} , {
			// Button follow
			cls: 'x-btn-icon' ,
			icon: 'ext/resources/images/btn-icons/follow.png' ,
			tooltip: 'Follow' ,
			hidden: true
		} , {
			// Button unfollow
			cls: 'x-btn-icon' ,
			icon: 'ext/resources/images/btn-icons/unfollow.gif' ,
			tooltip: 'Unfollow' ,
			hidden: true
		} , '->' , {
			// Progress Bar like/dislike
			xtype: 'progressbar' ,
			width: 100
		} , '->' , {
			// Button focus
			cls: 'x-btn-icon' ,
			icon: 'ext/resources/images/btn-icons/focus.png' ,
			tooltip: 'Focus'
		} , {
			// Button reply
			cls: 'x-btn-icon' ,
			icon: 'ext/resources/images/btn-icons/reply.png' ,
			tooltip: 'Reply' ,
			hidden: true
		} , {
			// Button respam
			cls: 'x-btn-icon' ,
			icon: 'ext/resources/images/btn-icons/respam.png' ,
			tooltip: 'Respam' ,
			hidden: true
		}]
	}
});

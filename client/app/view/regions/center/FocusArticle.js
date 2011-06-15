// @file 	FocusArticle.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Window template for focus article

Ext.define ('SC.view.regions.center.FocusArticle' , {
	extend: 'Ext.window.Window' ,
	alias: 'widget.focusarticle' ,
	
	store: 'regions.center.Articles' ,
	
	// Configuration
	height: 300 ,
	width: 400 ,
	autoWidth: true ,
	autoHeight: true ,
	collapsible: true ,
	animCollapse: true ,
	bodyPadding: 5 ,
	layout: 'anchor' ,
	maximizable: true ,
	constrain: true ,
	autoScroll: true ,
	
	// Body
	items: [{
		// Saves model ID of the focus article
		xtype: 'button' ,
		tooltip: 'focusModelIndex' ,
		hidden: true
	}] ,
	
	// Docked Items
	dockedItems: [{
		xtype: 'toolbar' ,
		dock: 'bottom' ,
		ui: 'footer' ,
		items: [{
			// Button I Like
			cls: 'x-btn-icon' ,
			icon: 'ext/resources/images/btn-icons/like.png' ,
			tooltip: 'I Like'
		} , {
			// Button I Dislike
			cls: 'x-btn-icon' ,
			icon: 'ext/resources/images/btn-icons/dislike.png' ,
			tooltip: 'I Dislike'
		} , {
			// Button follow
			cls: 'x-btn-icon' ,
			icon: 'ext/resources/images/btn-icons/follow.png' ,
			tooltip: 'Follow'
		} , {
			// Button unfollow
			cls: 'x-btn-icon' ,
			icon: 'ext/resources/images/btn-icons/unfollow.gif' ,
			tooltip: 'Unfollow' ,
			hidden: true
		} , '->' , {
			// Progress Bar like/dislike
			xtype: 'progressbar' ,
			width: 150
		} , '->' , {
			// Button reply
			cls: 'x-btn-icon' ,
			icon: 'ext/resources/images/btn-icons/reply.png' ,
			tooltip: 'Reply'
		} , {
			// Button respam
			cls: 'x-btn-icon' ,
			icon: 'ext/resources/images/btn-icons/respam.png' ,
			tooltip: 'Respam'
		}]
	}]
});

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
	height: 350 ,
	width: 450 ,
	autoWidth: true ,
	autoHeight: true ,
	bodyPadding: 5 ,
	layout: 'anchor' ,
	maximizable: true ,
	constrain: true ,
	autoScroll: true 
});

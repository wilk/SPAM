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
	bodyPadding: 5 ,
	layout: 'anchor' ,
	maximizable: true ,
	constrain: true ,
	autoScroll: true
});

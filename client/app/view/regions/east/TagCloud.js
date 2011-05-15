// @file 	TagCloud.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Tag cloud panel

Ext.define ('SC.view.regions.east.TagCloud' , {
	extend: 'Ext.panel.Panel' ,
	alias: 'widget.tagcloud' ,
	
	// Configuration
	title: 'Tag Cloud' ,
	autoWidth: true ,
	collapsible: true ,
	animCollapse: true ,
	bodyPadding: 2 ,
	anchor: '100%' ,
	layout: 'anchor'
});

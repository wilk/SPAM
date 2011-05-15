// @file 	Thesaurus.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Thesaurus panel

Ext.define ('SC.view.regions.west.Thesaurus' , {
	extend: 'Ext.panel.Panel' ,
	alias: 'widget.thesaurus' ,
	
	// Configuration
	title: 'Thesaurus' ,
	autoWidth: true ,
	collapsible: true ,
	animCollapse: true ,
	bodyPadding: 2 ,
	anchor: '100%' ,
	layout: 'anchor'
});

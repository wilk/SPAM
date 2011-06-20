// @file 	Thesaurus.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Thesaurus panel

Ext.define ('SC.view.regions.west.Thesaurus' , {
	extend: 'Ext.tree.Panel' ,
	alias: 'widget.thesaurus' ,
	// Configuration
	title: 'Thesaurus' ,
	collapsible: true ,
	animCollapse: true ,
	bodyPadding: 2 ,
	rootVisible: true ,
	autoScroll: true ,
//	useArrows:true,
	flex:1,
	store:'Thesaurus',
	root:{
		text:'Thesaurus',
		expanded:true
	},
//	textfiled for add thesaurus term
	bbar:{
		xtype:'textfield',
		id:'addTermField',
		enableKeyEvents:true
	}
});

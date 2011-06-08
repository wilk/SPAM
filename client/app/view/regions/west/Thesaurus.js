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
	initComponent: function(){
  		this.store = Ext.data.StoreManager.lookup(this.store);
 		this.callParent(arguments);
	},
	// Configuration
	title: 'Thesaurus' ,
	autoWidth: true ,
	height: 100 ,
	collapsible: true ,
	animCollapse: true ,
	bodyPadding: 2 ,
	anchor: '100% 100%' ,
	layout: 'anchor' ,
	rootVisible: true ,
	autoScroll: true ,
	scroll:true,
	store:'Thesaurus',
	root:{
		text:'Thesaurus',
		expanded:true
	}
});

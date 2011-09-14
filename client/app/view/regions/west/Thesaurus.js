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
	id: 'thesaurusPanel' ,
	collapsible: true ,
	animCollapse: true ,
	bodyPadding: 2 ,
	rootVisible: true ,
	autoScroll: true ,
	flex: 1 ,
	store: 'regions.west.Thesaurus' ,
	root: {
		text: 'Thesaurus' ,
		expanded: true
	} ,

	// Docked button	
	dockedItems: [{
		xtype: 'toolbar' ,
		dock: 'bottom' ,
		// TODO: check the show of add new term button
		height: 25 ,
		ui: 'footer' ,
		items: ['->' , {
			// Button to add new terms to the thesaurus
			id: 'btnThesaurusAddTerm' ,
			text: 'Add new term' ,
			icon: 'ext/resources/images/btn-icons/add.png' ,
			hidden: true
		} , '->']
	}]
});

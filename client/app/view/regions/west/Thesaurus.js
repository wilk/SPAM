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
	autoWidth: true ,
	height: 100 ,
	collapsible: true ,
	animCollapse: true ,
	bodyPadding: 2 ,
	anchor: '100% 100%' ,
	layout: 'anchor' ,
	rootVisible: true ,
	scroll: true ,
	store: {
		root: {
			expanded: true ,
			text: '' ,
			user: '' ,
			status: '' ,
			children: [{
				text: 'P1' ,
				expanded: true ,
				children: {
					text:'P1' ,
					expanded: true ,
					children: {
						text: 'P111' ,
						leaf: true
					}
				}
			} , {
				text: 'P2' ,
				expanded: true ,
				children: [{
					text: 'P21' ,
					leaf: true
				} , {
					text: 'P22' ,
					leaf: true
				}]
			} , {
				text: 'P3' ,
				leaft: true
			}]
		}
	}
});

// @file 	ComboThesaurus.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Model of combo of thesaurus

Ext.define ('SC.model.ComboThesaurus' , {
	extend: 'Ext.data.Model' ,
	
	fields: [{
		name: 'term' ,
		type: 'string'
	} , {
		name: 'isLeaf' ,
		type: 'boolean'
	} , {
		// skos:inScheme
		name: 'ns' ,
		type: 'string'
	} , {
		// Path into the tree
		name: 'path' ,
		type: 'string'
	}]
});

// @file 	TheNode.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Model of thesaurus

Ext.define('SC.model.TheNode',{
	extend:'Ext.data.Model',
	
	fields:[{
			// skos:prefLabel
			name: 'text' ,
			type: 'string'
		} , {
			// skos:inScheme
			name: 'ns' ,
			type: 'string'
		}],

	proxy:{
		type: 'localstorage' ,
		id: 'localThesaurus'
	}
});

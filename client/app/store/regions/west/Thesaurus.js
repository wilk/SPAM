// @file 	Thesaurus.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Store of thesaurus

Ext.define ('SC.store.regions.west.Thesaurus' , {
	extend: 'Ext.data.TreeStore' ,
	
	proxy: {
            type: 'rest',
            url: 'thesaurus',
            extraParams: {
                isXml: true
            },
            reader: {
                type: 'xml',
//                root: 'nodes',
//                record: 'node'
            }
        },
        sorters: [{
            property: 'leaf',
            direction: 'ASC'
        },{
            property: 'text',
            direction: 'ASC'
        }],
        root: {
            text: 'Ext JS',
            id: 'src',
            expanded: true
        }
	
	autoLoad: true
});

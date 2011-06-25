// @file 	SendHashtag.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Hashtag store

Ext.define('SC.store.SendHashtag',{	
	extend:'Ext.data.TreeStore',
	model:'SC.model.SendHashtag',
	
	proxy:{
		type:'localstorage',
		id:'localThesaurus'
	}
});

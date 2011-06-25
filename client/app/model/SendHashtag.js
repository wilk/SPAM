// @file 	SendHashtag.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Hashtag model

Ext.define('SC.model.SendHashtag',{
	extend:'Ext.data.Model',
	
	fields:[{
		name: 'text'
	}],
	
	proxy:{
		type:'localstorage',
		id:'localThesaurus'
	}
});

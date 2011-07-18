// @file 	Followers.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Model of user followers

Ext.define ('SC.model.regions.west.Followers' , {
	extend: 'Ext.data.Model' ,
	
	// Fields
	fields: [{
		name: 'follower' ,
		type: 'string' ,
		mapping: '@id'
	}] ,
	
	// REST Proxy for REST requests
	proxy: {
		type: 'rest' ,
		url: optionSin.getUrlServerLtw () + 'followers' ,
		
		// To avoid url problems with other federated servers
		filterParam: null ,
		groupParam: null ,
		limitParam: null ,
		noCache: false ,
		pageParam: null ,
		simpleSortMode: false ,
		sortParam: null ,
		startParam: null ,
		
		reader: {
			type: 'xml' ,
			root: 'followers' ,
			record: 'follower'
		}
	}
});

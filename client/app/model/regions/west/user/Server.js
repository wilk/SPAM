// @file 	Server.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Model of federated servers followed by user

Ext.define ('SC.model.regions.west.user.Server', {
	extend: 'Ext.data.Model' ,
	
	fields:	[{
		name: 'serverID' ,
		mapping: '@serverID'
	}] ,
	
	proxy: {
		type: 'rest' ,
		url: urlServerLtw + 'servers' ,
		
		// To avoid url problems with other federated servers
		filterParam: null ,
		groupParam: null ,
		limitParam: null ,
		noCache: false ,
		pageParam: null ,
		simpleSortMode: false ,
		sortParam: null ,
		startParam: null ,
		
		// Read user servers list
		reader: {
			type: 'xml' ,
			root: 'servers' ,
			record: 'server'
		}
	}
});

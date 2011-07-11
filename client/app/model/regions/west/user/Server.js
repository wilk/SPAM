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
		
		// Read user servers list
		reader: {
			type: 'xml' ,
			root: 'servers' ,
			record: 'server'
		}
	}
});

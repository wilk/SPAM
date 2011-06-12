// @file 	Server.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Model of federated servers

Ext.define ('SC.model.Server', {
	extend: 'Ext.data.Model' ,
	fields:	[{
		name: 'serverID' ,
		mapping: '@serverID'
	} , {
		name: 'serverURL' ,
		mapping: '@serverURL'
	}]
});

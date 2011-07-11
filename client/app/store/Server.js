// @file 	Server.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Store of federated servers

Ext.define ('SC.store.Server' , {
	extend: 'Ext.data.Store' ,
	
	model: 'SC.model.Server' ,
	
	// Sorted ascendent by serverID
	sorters: {
		property: 'serverID' ,
		direction: 'ASC'
	} ,
	
	autoLoad: true
});

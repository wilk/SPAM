// @file 	Server.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Store of federated servers followed by user

Ext.define ('SC.store.regions.west.user.Server' , {
	extend: 'Ext.data.Store' ,
	
	model: 'SC.model.regions.west.user.Server' ,
	
	autoLoad: false
});

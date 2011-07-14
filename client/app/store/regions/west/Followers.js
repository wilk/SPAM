// @file 	Followers.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Store of user followers

Ext.define ('SC.store.regions.west.Followers' , {
	extend: 'Ext.data.Store' ,
	
	model: 'SC.model.regions.west.Followers' ,
	
	autoLoad: false
});

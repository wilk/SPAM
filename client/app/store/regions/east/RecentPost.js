// @file 	RecentPost.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Store of recent post

Ext.define ('SC.store.regions.east.RecentPost' , {
	extend: 'Ext.data.Store' ,
	
	model: 'SC.model.regions.east.RecentPost'
});

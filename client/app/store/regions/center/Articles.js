// @file 	Articles.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Store of articles

Ext.define ('SC.store.regions.center.Articles' , {
	extend: 'Ext.data.Store' ,
	
	model: 'SC.model.regions.center.Articles' ,
	
	autoLoad: true
});

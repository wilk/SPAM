// @file 	Reply.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Store of replies

Ext.define ('SC.store.Reply' , {
	extend: 'Ext.data.Store' ,
	alias: 'reply' ,
	
	model: 'Reply'
});

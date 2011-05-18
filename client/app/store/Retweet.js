// @file 	Retweet.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Store of retweets

Ext.define ('SC.store.Retweet' , {
	extend: 'Ext.data.Store' ,
	alias: 'retweet' ,
	
	model: 'Retweet'
});

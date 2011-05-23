// @file 	User.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Store of users

Ext.define ('SC.store.User' , {
	extend: 'Ext.data.Store' ,
	
	model: 'User' ,
	
	proxy: {
		type: 'rest' ,
		url: 'http://ltw1102.web.cs.unibo.it/login'
	}
});

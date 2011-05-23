// @file 	Post.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Store of posts

Ext.define ('SC.store.Post' , {
	extend: 'Ext.data.Store' ,
//	alias: 'post' ,
	
	model: 'Post' ,
	
	// REST Proxy for REST requests
	proxy: {
		type: 'rest' ,
		url: 'http://ltw1102.web.cs.unibo.it/post'
	} ,
	
	autoLoad: true
});

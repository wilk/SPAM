// @file 	User.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Model of users

Ext.define ('SC.model.User' , {
	extend: 'Ext.data.Model' ,
	alias: 'user' ,
	
	// Fields
	fields: ['id'] ,
	
	// Models that it has
	hasMany: ['Post' , 'Reply' , 'Retweet'] ,
	
	// REST Proxy for REST requests
	proxy: {
		type: 'rest' ,
		url: '/users'
	}
});

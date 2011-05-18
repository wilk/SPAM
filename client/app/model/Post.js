// @file 	Post.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Model of posts

Ext.define ('SC.model.Post' , {
	extend: 'Ext.data.Model' ,
	alias: 'post' ,
	
	// Fields
//	fields: ['id' , 'user_id'] ,
	fields: ['body'] ,
	
	// Model belongs to
	belongsTo: 'User' ,
	
	// Models that it has
	hasMany: ['Reply' , 'Retweet'] ,
	
	// REST Proxy for REST requests
	proxy: {
		type: 'rest' ,
		url: '/post'
	}
});

// @file 	Retweet.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Model of retweets

Ext.define ('SC.model.Retweet' , {
	extend: 'Ext.data.Model' ,
	alias: 'retweet' ,
	
	// Fields
	fields: ['id' , 'user_id' , 'post_id'] ,
	
	// Model belongs to
	belongsTo: 'Post' ,
	
	// REST Proxy for REST requests
	proxy: {
		type: 'rest' ,
		url: '/retweet'
	}
});

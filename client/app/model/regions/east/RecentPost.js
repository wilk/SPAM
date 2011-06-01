// @file 	RecentPost.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Model of recent post

Ext.define ('SC.model.regions.east.RecentPost' , {
	extend: 'Ext.data.Model' ,
	
	// Fields
	fields: ['post' , 'content' , 'affinity' , 'article'] ,
	
	// REST Proxy for REST requests
	proxy: {
		type: 'rest' ,
		// 10 recent posts
		url: 'search/10/recent/' ,
		reader: {
			type: 'xml' ,
			root: 'archive' ,
			record: 'post'
		}
	}
});

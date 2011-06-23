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
	fields: ['content' , {
		name: 'affinity' ,
		type: 'int'
	} , {
		name: 'article' ,
		type: 'string' 
	} , {
		name: 'resource' ,
		mapping: 'article @resource'
	} , {
		name: 'about' ,
		mapping: 'article @about'
	}] ,
	
	// REST Proxy for REST requests
	proxy: {
		type: 'rest' ,
//		url: 'search/10/recent' ,
		url: 'app/data/art4.xml' ,
		reader: {
			type: 'xml' ,
			root: 'archive' ,
			record: 'post'
		}
	}
});

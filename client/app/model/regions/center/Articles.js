// @file 	Articles.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Model of articles

Ext.define ('SC.model.regions.center.Articles' , {
	extend: 'Ext.data.Model' ,
	
	// Fields
	fields: ['content' , {
		name: 'affinity' ,
		type: 'int'
	} , {
		name: 'article'
	} , {
		name: 'about' ,
		mapping: 'article @about'
	}] ,
	
	// REST Proxy for REST requests
	proxy: {
		type: 'rest' ,
		// 10 recent posts
		url: 'app/data/art.xml' ,
		reader: {
			type: 'xml' ,
			root: 'archive' ,
			record: 'post'
		}
	}
});

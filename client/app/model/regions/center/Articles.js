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
		// Affinity
		name: 'affinity' ,
		type: 'int'
	} , {
		// Content of article
		name: 'article' ,
		type: 'string'
	} , {
		// The owner of article
		name: 'resource'
		//mapping: 'article @resource'
	} , {
		// Article ID
		name: 'about'
		//mapping: 'article @about'
	} , {
		// The owner of article (only userID)
		name: 'user' ,
		type: 'string'
	} , {
		// If setlike or dislike
		name: 'setlike' ,
		type: 'int'
	} , {
		// Like counter
		name: 'like' ,
		type: 'int'
	} , {
		// Dislike counter
		name: 'dislike' ,
		type: 'int'
	}] ,
	
	// REST Proxy for REST requests
	proxy: {
		type: 'rest' ,
		// url is set dynamically
		reader: {
			type: 'xml' ,
			root: 'archive' ,
			record: 'post'
		}
	}
});

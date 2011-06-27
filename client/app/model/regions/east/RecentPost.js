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
	fields: [{
		// Content
		name: 'content' ,
		type: 'string'
	} , {
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
	} , {
		// Article ID
		name: 'about'
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
		url: urlServerLtw + 'search/10/recent' ,
		reader: {
			type: 'xml' ,
			root: 'archive' ,
			record: 'post'
		}
	}
});

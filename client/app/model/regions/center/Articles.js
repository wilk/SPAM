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
		name: 'resource' ,
		type: 'string'
	} , {
		// Article ID
		name: 'about' ,
		type: 'string'
	} , {
		// The owner of article (only userID)
		name: 'user' ,
		type: 'string'
	} , {
		// The owner of article (only serverID)
		name: 'server' ,
		type: 'string'
	} , {
		// The ID of article (only postID)
		name: 'post' ,
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
	} , {
		// Geolocation Latitude
		name: 'glLat' ,
		type: 'double'
	} , {
		// Geolocation Longitude
		name: 'glLong' ,
		type: 'double'
	} , {
		// Time
		name: 'time' ,
		type: 'string'
	} , {
		// Type of the article (post, reply or respam)
		name: 'type' ,
		type: 'string'
	} , {
		// Resource of type (/serverID/userID/postID)
		name: 'resourceType' ,
		type: 'string'
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

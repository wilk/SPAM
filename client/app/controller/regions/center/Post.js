// @file 	Post.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of view of reading posts

Ext.define ('SC.controller.regions.center.Post' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.center.Post'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// Controlling txtArea of window for sending new posts
			'#buttonILike': {
				// Event Handler
			} , 
			// Controlling send button
			'#buttonIDislike': {
				// Event Handler
			} ,
			'#buttonReply': {
				// Event Handler
			} ,
			'#buttonRetweet': {
				// Event Handler
			}
		});
	
		console.log ('Controller Post started.');
	}
});

// @file 	Articles.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of articles view

Ext.define ('SC.controller.regions.center.Articles' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.center.Articles'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// I Like button
			'articles button[text=Like]' : {
			} ,
			// I Dislike button
			'articles button[text=Dislike]' : {
			} ,
			// Focus button
			'articles button[text=Focus]' : {
			} ,
			// Reply button
			'articles button[text=Reply]' : {
			} ,
			// Respam button
			'articles button[text=Respam]' : {
			}
		});
	
		console.log ('Controller Articles started.');
	}
});

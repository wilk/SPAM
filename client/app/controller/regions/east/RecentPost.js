// @file 	RecentPost.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	View controller of recent post of east region

Ext.define ('SC.controller.regions.east.RecentPost' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.east.RecentPost'] ,
	
	// Models
	models: ['regions.east.RecentPost'] ,
	
	// Stores
	stores: ['regions.east.RecentPost'] ,
	
	// Configuration
	init: function () {
		console.log ('Controller RecentPost started.');
	}
});

// @file 	Thesaurus.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of Thesaurus view

Ext.define ('SC.controller.regions.west.Thesaurus' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.west.Thesaurus'] ,
	stores:['Thesaurus'],
	// Configuration
	init: function () {
		var theStore=this.getThesaurusStore();
		var theProxy=theStore.getProxy();
		theStore.load();
		theProxy.on('excetion',function(response,operation){console.log(response,operation);});
		Ext.Ajax.on('requestexception',function(conn,response,operation){console.log(conn,response,operation);});
		console.log ('Controller Thesaurus started.');
	}
});

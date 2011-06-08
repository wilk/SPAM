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
	models:['TheNode'],
			
	// Configuration
	
	
	
	
	init: function () {
	
		
		var theStore, theProxy, skosNS, twebNS, myRDF;
		theStore=this.getThesaurusStore();
		theProxy=theStore.getProxy();
		skosNS="http://www.w3.org/2004/02/skos/core#"
		twebNS="http://vitali.web.cs.unibo.it/TechWeb11/thesaurus/"
		myRDF=new RDF();
		myRDF.getRDFURL('app/data/xve64.rdf',callback)
		console.log(theStore);
		
		function callback(){
			var root=theStore.getRootNode();
			var top=myRDF.Match(null,null,skosNS+"hasTopConcept",null);

			for (var i=0;i<top.length;i++){
				var sub=top[i].object;
				append(sub,root);
			};
			console.log(theStore);

		};
		
		
		function append(subject,father){

		var val=myRDF.getSingleObject(null,subject,skosNS+"prefLabel",null);
		var node=SC.model.TheNode.create({text:val});
		father.appendChild(node);
		var child=myRDF.Match(null,subject,skosNS+"narrower",null);
		if(child.length==0){
			node.data.leaf=true
		}
		for (var i=0;i<child.length;i++){
			append(child[i].object,node);
		}
	};
	
	theProxy.on('excetion',function(response,operation){console.log(response,operation);});
		Ext.Ajax.on('requestexception',function(conn,response,operation){console.log(conn,response,operation);});
		Ext.Ajax.on('requestcomplete',function(conn,response,operation){console.log(conn,response,operation);});
		console.log ('Controller Thesaurus started.');
	}
	
	
	
});

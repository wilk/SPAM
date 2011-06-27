// @file 	SendHashtag.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of Hashtag view
Ext.define ('SC.controller.SendHashtag' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['SendHashtag'] ,
	stores:['SendHashtag'],
	models:['SendHashtag'],
			
	// Configuration	
	init: function () {

		this.control ({
			'sendhashtag': {
				afterrender: this.populateTreeSendPanel
			}
		});
	} ,
	
	populateTreeSendPanel: function (panel) {
		//useful variables	
		var theStore, theProxy, skosNS, twebNS, myRDF;
	
	//get reference to tree store and his localstorage proxy	
		theStore=this.getSendHashtagStore ();
		theProxy=theStore.getProxy ();

	//set namespaces
		skosNS="http://www.w3.org/2004/02/skos/core#"
		twebNS="http://vitali.web.cs.unibo.it/TechWeb11/thesaurus/"
	
	//function and constructor from parse.js library
		myRDF=new RDF();
		myRDF.getRDFURL(urlServerLtw + 'thesaurus',callback)
	
	//callback function called when request is complete
		function callback(){
		
		//get root node to append all chileds
			var root=theStore.getRootNode();
			
		//query to retrive all "hasTopConcept" node
			var top=myRDF.Match(null,null,skosNS+"hasTopConcept",null);

		//suspend store content change events
			theStore.suspendEvents();

		//starting loop to append all "hasTopConcept" node and theirs children
			for (var i=0;i<top.length;i++){
				var sub=top[i].object;
				append(sub,root);
			};
		
		//resume store content change events
			theStore.resumeEvents();
		
		};
		



	//funcion to append a node to his father	
		function append(subject,father){

		//get prefLabel value, create a node and append it to his father
			var val=myRDF.getSingleObject(null,subject,skosNS+"prefLabel",null);
			var node=SC.model.TheNode.create({text:val});
			
		//change node internal id into the store to retrive it with findNodeById method
			node.internalId=val;
		
		
			father.appendChild(node);

		
		//query to get all node's children and recall this function to fill the tree
			var child=myRDF.Match(null,subject,skosNS+"narrower",null);
			if(child.length==0){
				node.data.leaf=true
			}
			for (var i=0;i<child.length;i++){
				append(child[i].object,node);
			}
		};
	



	//listen to requests errors
		theProxy.on('excetion',function(response,operation){console.log(response,operation);});
		Ext.Ajax.on('requestexception',function(conn,response,operation){console.log(conn,response,operation);});
		Ext.Ajax.on('requestcomplete',function(conn,response,operation){console.log(conn,response,operation);});
		console.log ('Controller Thesaurus started.');
	}
});

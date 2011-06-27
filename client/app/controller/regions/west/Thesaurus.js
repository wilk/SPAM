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

		this.control({
			'thesaurus':{
				itemdblclick:function(view,record,item,index,ev,opt){
				//when expand a node with a double click, change texfield content with the node value
						Ext.getCmp('addTermField').setValue(record.data.text+'/');
					}
			},
			'#addTermField':{
				specialkey:function(field,ev,opt){
					console.log (theStore.getNodeById (field));
				//listen to ENTER key press to send data
						if(ev.getKey()==ev.ENTER){
							//directly send becouse validating process is done by server
							this.addTerm(field)
						}
					}
			}
		});

	
	//useful variables	
		var theStore, theProxy, skosNS, twebNS, myRDF;
	
	//get reference to tree store and his localstorage proxy	
		theStore=this.getThesaurusStore();
		theProxy=theStore.getProxy();

	//set namespaces
		skosNS="http://www.w3.org/2004/02/skos/core#"
		twebNS="http://vitali.web.cs.unibo.it/TechWeb11/thesaurus"
	
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
			var node=SC.model.TheNode.create({
				text: val ,
				ns: myRDF.getSingleObject(null,subject,skosNS+"inScheme",null)
			});
			
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
	},
	
	//send new term
	addTerm:function(field){
	
	//useful variables
		var parentterm='';
		var term='';
		var slash=false;
		
	//load entire string into an array and separate terms
		var strArray=Ext.Array.toArray(field.value);
		Ext.Array.forEach(strArray,function(item){
					if(item!='/'){
						if(!slash){
							parentterm=parentterm+item;
						}
						else{
							term=term+item;
						}
					}
					else
						slash=true;
			},this);
	
	//send data
		Ext.Ajax.request({
			url:urlServerLtw + 'addterm',
			method:'post',
			
		//request body	
			params:{parentterm:parentterm,term:term},
			
			success:function(response){
			
			//take store reference and find new node parent	
				var store=Ext.StoreManager.lookup('Thesaurus');
				var parent=store.getNodeById(parentterm);
			
			//create new node and set his attribute
				var newNode=SC.model.TheNode.create({text:term});
				newNode.internalId=term;				
			
			//append new node to his father	
				parent.appendChild(newNode);
				
			//set new node and parent leaf attribute	
				parent.data.leaf=false;
				newNode.data.leaf=true;
				
			//display new item node	
				parent.expand(false);
			},
			
			failure:function(response){
			
			//display error message send by server
				Ext.Msg.show ({
				title: 'Error' ,
				msg: response.responseText ,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.ERROR
				})
			}
		});
	}
	
});

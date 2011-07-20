Ext.regController('thesaurus',{

	init:function(){
	
		this.thesaurusstore=new Ext.data.Store({
		
			model:'term',

			proxy:{
				type:'localstorage',
				id:'thesaurustore'
			}
		
		});
		
		Ext.regStore('thesaurustore', this.thesaurusstore);
		
		this.thesaurusstore.getProxy().clear();
		
		this.getThesaurus();
//		this.getFirstElements();
		

	},
	
	renderme:function(options){
	
		this.getFirstElements();
		this.previousView=options.view;
		
		this.thesauruslist=this.render({xtype:'thesaurus'});
		this.application.viewport.setActiveItem(this.thesauruslist);
	},
	
	getThesaurus:function(){
	
		// set namespaces
		skosNS = 'http://www.w3.org/2004/02/skos/core#';
		twebNS = 'http://vitali.web.cs.unibo.it/TechWeb11/thesaurus';
		rdfNS = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
		
		thesaurus=new RDF();
		thesaurus.getRDFURL('thesaurus',function(){
			Ext.emptyFn();
			
		});
	},
	
	getFirstElements:function(){
	
		this.thesaurusstore.getProxy().clear();
		this.thesaurusstore.load();
	
		var top=thesaurus.Match (null, null, skosNS + 'hasTopConcept', null);
		for(i=0;i<top.length;i++){
		
			var pref=thesaurus.getSingleObject(null,top[i].object,skosNS+'prefLabel',null);
			this.thesaurusstore.add({preflabel:pref});
		
		}
		this.thesaurusstore.sync();

	},
	
	getChildren:function(options){
	
		if (typeof options!='string'){
				
			var prefvalue=options.rec.get('preflabel');
//		console.log(prefvalue);
		}
		else
		{
			var prefvalue=options
		}
		var subjects=thesaurus.Match(null,null,skosNS+'prefLabel',prefvalue);
		
		var children=thesaurus.Match(null,subjects[0].subject,skosNS+'narrower',null);
		if(!children.length){
		//ADD TERM HERE IS NOT A BAD THING
			Ext.Msg.alert('Thesaurus','This is the last term');
			
		}
		else{
		
			this.thesaurusstore.getProxy().clear();
			this.thesaurusstore.load();
			
			for(i=0;i<children.length;i++){
		
				var item=thesaurus.getSingleObject(null,children[i].object,skosNS+'prefLabel',null);
				this.thesaurusstore.add({preflabel:item});
		
			}
			this.thesaurusstore.sync();
		}
		
		this.render(this.thesauruslist);
	
	},
	
	backOrParent:function(){
		
		var tmp=this.thesaurusstore.getAt(0).get('preflabel');
		
		var subjects=thesaurus.Match(null,null,skosNS+'prefLabel',tmp);
		
		var checktop=thesaurus.Match(null,null,skosNS+'hasTopConcept',subjects[0].subject);
		
		if(checktop.length!=0){
			this.application.viewport.setActiveItem(this.previousView);
		}
		else
		{
			var parent=thesaurus.Match(null,null,skosNS+'narrower',subjects[0].subject);
			
			var parentparent=thesaurus.Match(null,null,skosNS+'narrower',parent[0].subject);
			
			if(parentparent.length==0){
				this.getFirstElements();
			}
			else{
				
				this.getChildren(thesaurus.getSingleObject(null,parentparent[0].subject,skosNS+'prefLabel',null));
			}
		}	
		
	},
	
	getResource:function(options){
	
		var preflabel=options.substr(1);
		
		var subject=thesaurus.Match(null,null,skosNS+'prefLabel',preflabel);
		
		if(subject.length!=0){
			
			var resource=new Array();
			
			resource.push(thesaurus.Match(null,subject[0].subject,skosNS+'inScheme',null)[0].object);
			
			resource.push(subject[0].subject);
			
			return resource;

		}
	
	}

});

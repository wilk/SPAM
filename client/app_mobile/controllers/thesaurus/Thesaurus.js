Ext.regController('thesaurus',{

	init:function(){
	
//	this.addEvents('sharedthesaurus','extendedthesaurus');
	
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
		this.thesauruslist.down('textfield').setValue('');
		
		if(Ext.StoreMgr.get('loginstore').getCount()!=0){
			this.thesauruslist.down('textfield').enable(true);
			this.thesauruslist.down('#submit').enable(true);
		}
		else{
			this.thesauruslist.down('textfield').disable(true);
			this.thesauruslist.down('#submit').disable(true);
		}
		this.application.viewport.setActiveItem(this.thesauruslist);
		
		Ext.StoreMgr.get('loginstore').on('add',function(){
			
			if(this.thesauruslist){
				this.thesauruslist.fireEvent('loggedin');
			}
			
		},this);
		Ext.StoreMgr.get('loginstore').on('remove',function(){
			
			if(this.thesauruslist){
				this.thesauruslist.fireEvent('loggedout');
			}
		},this);
		
//		if(Ext.StoreMgr.get('loginstore').getCount!=0){
//			this.thesauruslist.fireEvent('loggedin');
//		}
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
//			Ext.Msg.alert('Thesaurus','This is the last term');
			if(Ext.StoreMgr.get('loginstore').getCount()!=0){
				this.addTermByPrompt(prefvalue);
			}
						
		}
		else{
		
			this.thesaurusstore.getProxy().clear();
			this.thesaurusstore.load();
			
			for(i=0;i<children.length;i++){
		
				var item=thesaurus.getSingleObject(null,children[i].object,skosNS+'prefLabel',null);
				this.thesaurusstore.add({preflabel:item});
				
				this.thesauruslist.fireEvent('parentterm',subjects[0].subject);
				this.thesauruslist.suspendEvents(false);
		
			}
			this.thesaurusstore.sync();
			this.thesauruslist.resumeEvents();
		}
		
//		this.render(this.thesauruslist);
	
	},
	
	addTermByPrompt:function(parent){
	
//		var prefvalue=options.prefvalue;
		
//		if(Ext.StoreMgr.get('loginstore').getCount()!=0){
		
			Ext.Msg.prompt('Add definition','Do you want to add a new tag',function(butt, text){
				
				if(butt!='cancel'){
					
					Ext.Ajax.request({
						
						url:'addterm',
						method:'post',
						params:{parentterm:parent,
								term:text
						},
						success:function(){
							Ext.dispatch({
								
								controller:'thesaurus',
								action:'getThesaurus'
								
							});
							
							this.thesaurusstore.add({preflabel:term});
							this.thesaurusstore.sync();
							
						}
						
					});
					
				}
			
			});	
	},
	
	addterm:function(options){
	
		var parent=options.parent;
		var term=options.term;
		if(term==''||parent==''){
			Ext.Msg.alert('Add term',"You have to tape a new term in this form: \"parent_term/new_term\"");
		}
		else{
		
			Ext.Ajax.request({
						
						url:'addterm',
						method:'post',
						params:{
								parentterm:parent,
								term:term
						},
						success:function(){
							Ext.dispatch({
								
								controller:'thesaurus',
								action:'getThesaurus'
								
							});
							
							this.thesaurusstore.add({preflabel:term});
							this.thesaurusstore.sync();
						},
						failure:function(){
							Ext.Msg.alert('Add term',"Check the field, maybe the parent term is not correct or it can't be extended");
						}
						
					});
		
		}		
	
	},
	
	backOrParent:function(){
		
		var tmp=this.thesaurusstore.getAt(0).get('preflabel');
		
		var subjects=thesaurus.Match(null,null,skosNS+'prefLabel',tmp);
		
		var checktop=thesaurus.Match(null,null,skosNS+'hasTopConcept',subjects[0].subject);
		
		if(checktop.length!=0){
			
			if(this.previousView){
				this.application.viewport.setActiveItem(this.previousView);
			}
			else{
				Ext.dispatch({
					controller:'Home',
					action:'renderHome',
//					historyUrl:'spam/home'
				})
			}
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

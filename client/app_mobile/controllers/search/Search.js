Ext.regController('search',{

	showSearchForm:function(options){
		this.postview=options.view;
		if(!this.searchform){
			this.searchform=this.render({xtype:'search'});
		}
//		console.log(this.application);
		this.application.viewport.setActiveItem(this.searchform);
		
		if(options.term&&options.type){
		
			this.searchform.down('#value').setValue(options.term);
			this.searchform.down('#type').setValue(options.type);
			this.selectchange(options);
			
		}
		else{
		
			this.searchform.down('#value').setValue('');
			this.searchform.down('#type').setValue('recent');
			this.selectchange(options);
		
		}
		
	},
	
	submitSearch:function(){
	
//console.log(		Ext.StoreMgr.get('poststore').getProxy().url);
//console.log(this.searchform.down('fieldset').getComponent('value').getValue());
	this.checkFormFields();
	Ext.dispatch({
		controller:'Home',
		action:'renderHome',
//		historyUrl:'spam/home'
	})
//Ext.StoreMgr.get('poststore').load();
	
	},
	
	selectchange:function(options){
	
		fieldset=this.searchform.down('fieldset');
		valuefield=fieldset.getComponent('value');
		
		switch(options.type){
		
			case'author':
				fieldset.setInstructions('To search by author you have to type yours terms in this way: serverID/userID');
				if(valuefield.disabled){
					valuefield.enable();
				}
				break;
			case'following':
				fieldset.setInstructions('Search recents posts of yours followed users');
				valuefield.disable();
				break;
				
			case'related':
				fieldset.setInstructions('To search releated post you have to tape an argument, better if you take it from the thesaurus');
				if(valuefield.disabled){
					valuefield.enable();
				}
				break;
			case'fulltext':
				fieldset.setInstructions('To search by a fulltext method you can tape anything');
				if(valuefield.disabled){
					valuefield.enable();
				}
				break;
			case'affinity':
				fieldset.setInstructions('To search by affinity you have to tape your choice in this way : serverID/userID/postID');
				if(valuefield.disabled){
					valuefield.enable();
				}
				break;
				
			default:
				fieldset.setInstructions('To search recents post you can leave the search field empty or type an argument of your choice');
				if(valuefield.disabled){
					valuefield.enable();
				}		
		}
	},
	
	checkFormFields:function(){
	
		form=this.searchform.down('fieldset');
		value=form.getComponent('value').getValue();
		type=form.getComponent('type').getValue();
		limit=form.getComponent('limit').getValue();
		
		poststoreProxy=Ext.StoreMgr.get('poststore').getProxy();

		switch(type){
		
			case'author':
				if(value.split('/').length!=2){
					Ext.Msg.alert('Error','you have misstaped the search argument, check and correct it to the right format');
				}
				else{
					poststoreProxy.url='search/'+limit+'/'+type+'/'+value;
					console.log(poststoreProxy.url);
				}
				break;
				
			case'affinity':
				if (value.split('/').length!=3){
					Ext.Msg.alert('Error','you have misstaped the search argument, check and correct it to the right format');
				}
				else{
					poststoreProxy.url='search/'+limit+'/'+type+'/'+value;
					console.log(poststoreProxy.url);
				}
				break;
				
			case'recent':
				if(value==''){
					poststoreProxy.url='search/'+limit+'/'+type;
					console.log(poststoreProxy.url);	
				}
				else{
					poststoreProxy.url='search/'+limit+'/'+type+'/'+value;
					console.log(poststoreProxy.url);
				}
				break;
				
			case'following':
				poststoreProxy.url='search/'+limit+'/'+type;
				break;
				
			default:
				poststoreProxy.url='search/'+limit+'/'+type+'/'+value;
		
		}
	
	},
	
	previousView:function(){
		if(this.postview){
			this.application.viewport.setActiveItem(this.postview);
		}
		else{
			Ext.dispatch({
				controller:'Home',
				action:'renderHome',
//				historyUrl:'spam/home'
			})
		}
		
	}

});

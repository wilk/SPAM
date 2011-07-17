Ext.regController('Login',{

	displayLogin:function(){
		
		this.loginview=this.render({
			xtype:'loginindex'
		});
		
		this.application.viewport.setActiveItem(this.loginview);
		
	},
	
	loginUser:function(options){
	
		var view=this.application.viewport;

		view.setLoading(true);
		
		store=Ext.StoreMgr.get('loginstore');
		if(options.loginView){
			uname=options.loginView.down('#loginTextField').getValue();
		}
		else
		{
			uname=options.name;
		}
//		console.log(store);
		
		store.each(function(rec){store.remove(rec);});
		if (uname!=''){
			
			Ext.Ajax.request({
		
				method:'post',
			
				url:'login',
			
				params:{username:uname},
			
				success:function(response, opts){
			
							store.add({username:uname});
							store.sync();

							if(options.loginView){
								Ext.dispatch({
		
									controller:'Home',
									action:'renderHome'
		
								})
							}
							view.setLoading(false);
				},
			
				faulure:function(response, opts){
				
					view.setLoading(false);
				
					alert(response);
				}
		
			});
		}
		else{
			alert('user name is required');
		}
	},
	
	anonimousUser:function(options){
	
		store=options.loginView.store;
//		uname=options.loginView.down('#loginTextField').getValue();
//		console.log(store);
		
		store.each(function(rec){store.remove(rec);});
		
		Ext.dispatch({
		
			controller:'Home',
			action:'renderHome'
		
		})
	
	},
	
	logoutUser:function(){
	
		this.application.viewport.setLoading(true);
	
		Ext.Ajax.request({
		
			method:'post',
			url:'logout',
			scope:this,
			
			success:function(){
				
				store=Ext.StoreMgr.get('loginstore');
				store.each(function(rec){
					store.remove(rec);
				});
				
				this.application.viewport.setLoading(false);
				
				this.displayLogin();
				
			},
			
			failure:function(){
			
				this.application.viewport.setLoading(false);
			
				Ext.Msg.alert(response.statusText,response.responseText);
			}
		
		});
	
	}

});

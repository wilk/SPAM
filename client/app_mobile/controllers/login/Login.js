Ext.regController('Login',{

	init:function(){
	
		this.store=new Ext.data.Store({
			model:'User'
		});
		
		Ext.regStore('loginstore',this.store);
		
		if(document.cookie.search('ltwlogin')!=-1){

			this.store.load();
		}
	},

	displayLogin:function(){
		
		if(this.store.getCount()){
		
			Ext.dispatch({
				controller:'Home',
				action:'renderHome'
			})
		
		}
		else{
		
			this.loginview=this.render({
				xtype:'loginindex'
			});
		
			this.application.viewport.setActiveItem(this.loginview);
		}
	},
	
	loginUser:function(options){
	
		var view=this.application.viewport;

		view.setLoading(true);
		
//		var store=Ext.StoreMgr.get('loginstore');
		
		if(options.loginView){
			uname=options.loginView.down('#loginTextField').getValue();
		}
		else
		{
			uname=options.name;
		}
//		console.log(store);
		
//		store.each(function(rec){store.remove(rec);});
		if (uname!=''){
			
			Ext.Ajax.request({
		
				method:'post',
			
				url:'login',
			
				params:{username:uname},
				
				scope:this,
			
				success:function(response, opts){
			
							this.store.add({username:uname});
							this.store.sync();
//console.log(document.cookie);
//var user=Ext.ModelMgr.create({username:uname},'User');
//user.save();

							if(options.loginView){
								Ext.dispatch({
		
									controller:'Home',
									action:'renderHome'
		
								})
							}
							view.setLoading(false);
				},
			
				failure:function(response, opts){
				
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
	
//		store=options.loginView.store;
//		uname=options.loginView.down('#loginTextField').getValue();
//		console.log(store);
		
//		store.each(function(rec){store.remove(rec);});
		
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
								
//				var store=Ext.StoreMgr.get('loginstore');
				
				this.store.getProxy().clear();
				this.store.load();
				
				this.application.viewport.setLoading(false);
				
				this.displayLogin();
				document.cookie='';
			},
			
			failure:function(){
			
				this.application.viewport.setLoading(false);
			
				Ext.Msg.alert(response.statusText,response.responseText);
			}
		
		});
	
	}

});

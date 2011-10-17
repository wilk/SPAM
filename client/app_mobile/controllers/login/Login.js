Ext.regController('Login',{

//initialize and register localstorage to record a user (cookie)
	init:function(){
	
		this.store=new Ext.data.Store({
			model:'User'
		});
		
		Ext.regStore('loginstore',this.store);
		
		//check cookie to restore the user session after page refresh
		if(document.cookie.search('ltwlogin')!=-1){

			this.store.load();
		}
	},

//render and activate login/logout page
	displayLogin:function(){
		
		//if user is already logged in (after refresh)
		if(this.store.getCount()){
		
			Ext.dispatch({
				controller:'Home',
				action:'renderHome',
			})
		
		}
		else{
		
			this.loginview=this.render({
				xtype:'loginindex'
			});
		
			this.application.viewport.setActiveItem(this.loginview);
		}
	},
	
//login function called from login view and login popup
	loginUser:function(options){
	
	//set loading mask
		var view=this.application.viewport;

		view.setLoading(true);

	//check if the function was called from a view or a popup
		if(options.loginView){
			uname=options.loginView.down('#loginTextField').getValue();
		}
		else
		{
			uname=options.name;
		}
		
		if (uname!=''){
			
			Ext.Ajax.request({
		
				method:'post',
			
				url:'login',
			
				params:{username:uname},
				
				scope:this,
			
				success:function(response, opts){
			
			//if user was successfully logged in, add his name to the localstorage,
			//render the home page if he has used the login view and remove the loading mask
							this.store.add({username:uname});
							this.store.sync();

							if(options.loginView){
								Ext.dispatch({
		
									controller:'Home',
									action:'renderHome',
		
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

//user without name (read only)	
	anonimousUser:function(options){
		
		Ext.dispatch({
		
			controller:'Home',
			action:'renderHome',
		
		})
	
	},
	
//logout user
	logoutUser:function(){
	
		this.application.viewport.setLoading(true);
	
		Ext.Ajax.request({
		
			method:'post',
			url:'logout',
			scope:this,
			
			success:function(){
		
		//if the user was succefully logged out remove his name frome the localstorage,
		//the loading mask and reset the cookie
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

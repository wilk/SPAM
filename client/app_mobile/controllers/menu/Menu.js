Ext.regController('menu',{

	showSettingsSheet:function(options){
//	console.log(options.view);
		this.prevView=options.view;
	
		var loginstore=Ext.StoreMgr.get('loginstore');
		
		if(loginstore.getCount()){
			var buttonText='logout';
		}
		else{
			var buttonText='login';
		}
		
		this.settings=new Ext.ActionSheet({
		
					scroll:'vertical',
		
					items:[{
					
						text:buttonText,
						scope:this,
						
						handler:function(){
						
								this.settings.hide();
								
								if(buttonText!='login'){
								
									Ext.dispatch({
										controller:'Login',
										action:'logoutUser'
									});
								}
								else
								{
									Ext.Msg.prompt('Login','Enter your username',function(butt, text){
										if(butt!='cancel'){
											Ext.dispatch({
												controller:'Login',
												action:'loginUser',
												name:text
											});
										}
									})
								}
						}
					},
					{
						text:'New post',
						itemId:'newpost',
						scope:this,
						handler:function(){
							this.settings.hide();
							
							Ext.dispatch({
							
								controller:'sendpost',
								action:'showNewPost',
								view:this.prevView,
//								historyUrl:'spam/newpost'
							
							})
						}
					},
					{
						text:'Followers',
						itemId:'followerList',
						scope:this,
						handler:function(){
							this.settings.hide();
							
							Ext.dispatch({
							
								controller:'followers',
								action:'showFollowers',
								view:this.prevView,
//								historyUrl:'spam/followers'
							
							})
						}
					},
					{
						text:'Server',
						scope:this,
						handler:function(){
							this.settings.hide();
							
							Ext.dispatch({
								controller:'Server',
								action:'renderServerList',
								view:this.prevView,
//								historyUrl:'spam/servers'
							});
						}
					},
					{
						text:'Thesaurus',
						scope:this,
						handler:function(){
							this.settings.hide();
							
							Ext.dispatch({
								controller:'thesaurus',
								action:'renderme',
								view:this.prevView,
//								historyUrl:'spam/thesaurus'
							});
						}
					},
					{
					
						text:'Map',
						scope:this,
						handler:function(){
							
							this.settings.hide();
							
							Ext.dispatch({
								
								controller:'Map',
								action:'showMap',
								view:this.prevView,
//								historyUrl:'spam/map'
								
							});
							
						}
					
					},
					{
					
						text:'Close',
						ui:'decline',
						scope:this,
						handler:function(){this.settings.hide();}
						
					}]
				});
				
				if(Ext.StoreMgr.get('loginstore').getCount()==0){
				
					this.settings.remove('newpost');
					this.settings.remove('followerList');
				
				}
				
				this.settings.show();
	}

});

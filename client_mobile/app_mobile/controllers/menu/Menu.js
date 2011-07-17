Ext.regController('menu',{

	showSettingsSheet:function(){
	
		
		if(loginstore.getCount()){
			var buttonText='logout';
		}
		else{
			var buttonText='login';
		}
		
		this.settings=new Ext.ActionSheet({
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
					},{
					
						text:'Close',
						ui:'decline',
						scope:this,
						handler:function(){this.settings.hide();}
						
					}]
				});
				this.settings.show();		
	}

});

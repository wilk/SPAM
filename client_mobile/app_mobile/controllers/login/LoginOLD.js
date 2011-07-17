Ext.regController('Login',{

	displayLogin:function(){
		
		//first login, instatiate view
		if(!this.loginview){
		
			//get a refence to a LoginIndex view and render it
			this.loginview=this.render({
				xtype:'loginindex'
			});
		
		
		
			//listen on anonimous navigation button
			this.loginview.query('#anonimousButton')[0].on('tap',function(c,e){console.log('anonimous user');});
		
			//liste on login button
			this.loginview.query('#loginButton')[0].on('tap',function(){

				//get txtfield reference
				var uname=this.loginview.query('#loginTextField')[0];
			
				var name=uname.getValue();
			
				//check field value
				if(name){
			
					//log user to server
					Ext.Ajax.request({
						url:'login',
						params:{username:name},
						scope:this,
						success:function(){
						
							//use localstorage as cookie, save username
							this.loginview.store.add({username:name});
							//ACTIVATE RECENT POST VIEW!!
//							Ext.ControllerManager.get('Post').prova(this.loginview.store.getCount());
							Ext.dispatch({
								controller:'Home',
								action:'renderHome'
							});
						},
						failure:function(){
							alert('something goes wrong on your server');
						}
					});
				}
			
				//if there is no name
				else{
					alert('username is required');
				}
			
			},this);
		
		
	
			//activate this view
			this.application.viewport.setActiveItem(this.loginview);
		}
		
		//view already created
		else{
		
			//listen on anonimous navigation button
			this.loginview.query('#anonimousButton')[0].on('tap',function(c,e){console.log('anonimous user');});
		
			//liste on login button
			this.loginview.query('#loginButton')[0].on('tap',function(){

				//get txtfield reference
				var uname=this.loginview.query('#loginTextField')[0];

				var name=uname.getValue();
			
				//check field value consistency
				if(name){
			
					//log user to server
					Ext.Ajax.request({
						url:'login',
						params:{username:name},
						success:function(){
						
							//use localstorage as cookie, save username
							this.loginview.store.add({username:name});
							
						},
						failure:function(){
							alert('something goes wrong on your server');
						}
					});
				}
			
				//if there is no name
				else{
					alert('username is required');
				}
			
			},this);
		
		
	
			//activate this view
			this.application.viewport.setActiveItem(this.loginview);
		}
	}

});

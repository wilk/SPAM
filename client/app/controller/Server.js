Ext.define('SC.controller.Server',{
	extend: 'Ext.app.Controller',
	views:['Options','regions.west.User'],
	stores:['Servers'],
	models:['Server'],
	init:function(){
		//flags and useful variables
		logged=false;
		var selMode;
				
		//instantiate preconfigured stores with unique id
		store=Ext.create('SC.store.Servers',{storeId:'serverStore'});
		userStore=Ext.create('SC.store.Servers',{storeId:'userStore'});
		
		//load records from server with an ajax request
		store.load();
		
		//listen to ajax request's exceptions, errors or successes
		storeproxy=store.getProxy();
		storeproxy.on('exception',function(){console.log('server list not available');});
		
		//on login or logout action set a flag and load correct servers list
		Ext.Ajax.on('requestcomplete',function(conn,resp,obj){
											switch(obj.url){
												case('login'):
													logged=true;
													userStore.load();
													break;
												case('logout'):
													logged=false;
													store.load();
													break;
											}
										}
		);
		
		console.log ('Controller federated server started.');		
	}
});

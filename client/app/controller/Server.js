Ext.define('SC.controller.Server',{
	extend: 'Ext.app.Controller',
	views:['Options'],
	stores:['Servers'],
	models:['Server'],
	init:function(){
		var store=this.getServersStore();
		var storeproxy=store.getProxy();
		store.load();
		storeproxy.on('exception',function(){console.log('server list not available');});
		Ext.Ajax.on('requestcomplete',function(conn,resp,obj){
											if(obj.url=='login'||obj.url=='logout'){
												store.load();
											}
										});
		this.control({
			
		});
		
		console.log ('Controller federated server started.');
	}
});

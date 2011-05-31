Ext.define('SC.controller.regions.west.Server',{
	extend: 'Ext.app.Controller',
	views:['regions.west.FederatedServer'],
	stores:['Servers'],
	models:['Server'],
	init:function(){
		this.control({
			'fedServer':{
				show:this.initServerList
			}
		});
		
		console.log ('Controller federated server started.');
	},
	initServerList:function(){
		var store=this.getServersStore();
		store.load();
		store.getProxy().on('exception',function(){
							console.log('server list not available');
						});
	}
});

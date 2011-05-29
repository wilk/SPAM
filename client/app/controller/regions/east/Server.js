Ext.define('SC.controller.regions.east.Server',{
	extend: 'Ext.app.Controller',
	views:['regions.east.FederatedServer'],
	stores:['Servers'],
	models:['Server'],
	init:function(){
		var store=this.getServersStore();
		store.load();
		store.getProxy().on('exception',function(conn,response){
							console.log('server list not available');
						});
		console.log ('Controller federated server started.');
	}
});

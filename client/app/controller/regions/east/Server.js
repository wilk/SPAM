Ext.define('SC.controller.regions.east.Server',{
	extend: 'Ext.app.Controller',
	views:['regions.east.FederatedServer'],
	stores:['Servers'],
	models:['Server'],
	init:function(){
		this.control({
			'#buttonServer':{
				click:this.buttonServerClicked
			}
		});
		console.log ('Controller federated server started.');
	},
	buttonServerClicked:function(){
//		var store=this.getServersStore();
//		store.load(function(server){
//				alert(store.getCount())});
//		store.load(function(){
//				var server=Ext.getModelServer();
//				alert(server.getId());
//			});
		var server=this.getServerModel();
		server.load(function(server){console.log(server.getCount())});
//		var ser=server.get('serverID');
//		alert(server.get('serverID'));
		//alert(store.count());
//		var server=this.getServerModel();
//		ser=server(store.getAt(0));
//		ser.get('serverID');
	}
});

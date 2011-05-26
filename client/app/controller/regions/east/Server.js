Ext.define('SC.controller.regions.east.Server',{
	extend: 'Ext.app.Controller',
	views:['regions.east.FederatedServer'],
	stores:['Servers'],
	models:['Server'],
	init:function(){
		var store=this.getServersStore();
		store.load();
//		this.control({
//			'#buttonServerEdit':{
//				click:this.buttonServerEditClicked
//			}
//		});
		console.log ('Controller federated server started.');
	}
});

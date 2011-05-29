Ext.define('SC.controller.regions.center.ServerEdit',{
	extend:'Ext.app.Controller',
	views:['regions.center.ServerEdit',
		'regions.east.FederatedServer'],
	stores:['Servers'],
	models:['Server'],
	init:function(){
		this.control({
			'#buttonServerEdit':{
				click:this.buttonServerEditClicked
			},
			'#buttonServerSave':{
				click:this.buttonServerSaveClicked
			}
		});
	},
	buttonServerEditClicked:function(){
		Ext.getCmp('serveredit').show();

	},
	buttonServerSaveClicked:function(){
		var store=this.getServersStore();
		if(Ext.isEmpty(Ext.getCmp('newserver').getValue())!=true){
			store.add({serverID:Ext.getCmp('newserver').getValue()});
			store.sync();
		}
		if(Ext.isEmpty(store.getUpdatedRecords())!=true){
			store.sync();
		}
		console.log('save servers click');
	}
});

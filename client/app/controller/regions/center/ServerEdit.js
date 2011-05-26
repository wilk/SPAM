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
			}
		});
	},
	buttonServerEditClicked:function(){
		Ext.getCmp('serveredit').show();

	}
});

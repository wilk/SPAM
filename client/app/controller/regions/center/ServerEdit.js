Ext.define('SC.controller.regions.center.ServerEdit',{
	extend:'Ext.app.Controller',
	views:['regions.center.ServerEdit',
		'regions.east.FederatedServer'],
	stores:['Servers'],
	models:['Server'],
//	refs:[{
//		ref:'edited',
//		selector:'editorgrid'
//	}],
	init:function(){
		this.control({
			'#buttonServerEdit':{
				click:this.buttonServerEditClicked
			},
			'#buttonServerSave':{
				click:this.buttonServerSaveClicked
			},
//			'button':{click:function(){console.log('editededeeded');
//						  }
//			}
		});
	},
	buttonServerEditClicked:function(){
		Ext.getCmp('serveredit').show();

	},
	buttonServerSaveClicked:function(){
		var store=this.getServersStore();
		store.sync();
		console.log('save servers click');
	}
});

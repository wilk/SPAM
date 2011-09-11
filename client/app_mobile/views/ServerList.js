mspam.views.ServerList=Ext.extend(Ext.Panel,{
	
	layout:'card',

	dockedItems:[{
		xtype:'toolbar',
		dock:'top',
		title:'Spam',
		items:[{
			text:'Back',
				ui:'back',
				handler:function(){
					Ext.dispatch({
						controller:'Server',
						action:'closeServerList'
					});
				}
				}]
	}],
	
//	items:[{
//	
//		xtype:'list',
//		itemId:'serverlist',
//		itemTpl:'{serverID}'
//	
//	}]

//	store:new Ext.data.Store({
//		autoLoad:true,
//		model:'Server',
//		listeners:{
//	//				store:{
//			load:function(){console.log(this);}
//	//				}
//		}
//	}),

//	list:new Ext.List({
//		itemTpl:'{serverID}',
//		store:this.store
//	}),

//	items:[this.list],

});
Ext.reg('serverlist',mspam.views.ServerList);

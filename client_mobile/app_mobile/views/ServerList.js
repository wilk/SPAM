mspam.views.ServerList=Ext.extend(Ext.Panel,{
	
	layout:'fit',
	
	initComponent:function(){
	
		this.dockedItems=[{
			xtype:'toolbar',
			dock:'top',
			title:'Mspam'
		}];
		
		this.store=new Ext.data.Store({
			autoLoad:true,
			model:'Server',
			listeners:{
//				store:{
					load:function(){console.log(this);}
//				}
			}
		});
		
		this.list=new Ext.List({
			itemTpl:'{serverID}',
			store:this.store
		});
		
		this.items=[this.list];
	
		mspam.views.ServerList.superclass.initComponent.apply(this, arguments);
	}
});
Ext.reg('serverlist',mspam.views.ServerList);

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
	}]

});
Ext.reg('serverlist',mspam.views.ServerList);

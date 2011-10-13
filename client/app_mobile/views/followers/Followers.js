mspam.views.Followers=Ext.extend(Ext.Panel,{

	layout:'card',
	id:'followview',

	dockedItems:[{
		xtype:'toolbar',
		dock:'top',
		title:'Followers',
		items:[{
			text:'Back',
			ui:'back',
			handler:function(){
				Ext.dispatch({
					controller:'followers',
					action:'closeFollowersList'
				});
			}
		}]

	}],

});
Ext.reg('followers',mspam.views.Followers);

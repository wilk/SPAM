mspam.views.Thesaurus=Ext.extend(Ext.Panel,{

	layout:'card',

	dockedItems:[{
		xtype:'toolbar',
		dock:'top',
		title:'Thesaurus',
		items:[{
					text:'Back',
					ui:'back',
					handler:function(){
						Ext.dispatch({
							controller:'thesaurus',
							action:'backOrParent'						
						});
					}
				},
				{
					xtype:'spacer'
				},
				{
					iconCls:'settings',
					iconMask:true,
					ui:'plain',
					handler:function(){
						Ext.dispatch({
							controller:'menu',
							action:'showSettingsSheet',
							view:this.up('thesaurus')
						})
					}
				},
				{
					iconCls:'search',
					iconMask:true,
					ui:'plain',
					handler:function(){
						Ext.dispatch({
							controller:'search',
							action:'showSearchForm',
							view:this.up('thesaurus')
						})
					}
				}
		]
	}],
	
	items:[{
	
		xtype:'list',
		itemId:'list',
		store:'thesaurustore',
		itemTpl:'{preflabel}',
		onItemDisclosure:function(rec, node, index, e){
			Ext.dispatch({
				controller:'thesaurus',
				action:'getChildren',
				rec:rec
			})
		}
	
	}]

});
Ext.reg('thesaurus',mspam.views.Thesaurus);

mspam.views.Thesaurus=Ext.extend(Ext.Panel,{

	layout:'card',

	dockedItems:[{
		xtype:'toolbar',
		dock:'top',
		title:'Mspam',
		items:[{
			text:'Back',
				ui:'back',
				handler:function(){
					Ext.dispatch({
						controller:'thesaurus',
						action:'backOrParent'						
					});
				}
				}]
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

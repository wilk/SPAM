Ext.define('SC.view.regions.center.ServerEdit',{
	extend:'Ext.window.Window',
	alias:'widget.serveredit',
	id:'serveredit',
	title:'Server list editor',
	width:300,
	layout:'fit',
	closeAction:'hide',
	autoScroll:true,
	modal:true,
	items:[{
		xtype:'grid',
		columns:[{header:'Server name',dataIndex:'serverID',editor:{
									xtype:'textfield',
									allowBlank:false
									}
		}],
		plugins:[Ext.create('Ext.grid.plugin.RowEditing')],
		store:'Servers',
		forceFit:true,
	}],
	dockedItems:[{
		xtype:'toolbar',
		dock:'bottom',
		items:[{
			xtype:'textfield',
			allowBlank:false,
			emptyText:"type here the new server's name",
			id:'newserver',
			width:240
		},'->',{
			text:'save',
			id:'buttonServerSave'
		}]
	}]
});

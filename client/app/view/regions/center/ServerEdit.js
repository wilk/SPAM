Ext.define('SC.view.regions.center.ServerEdit',{
	extend:'Ext.window.Window',
	alias:'widget.serveredit',
	id:'serveredit',
	title:'Server list editor',
	height:150,
	width:300,
	closeAction:'hide',
	autoScroll:true,
	modal:true,
	items:[{
		xtype:'grid',
		columns:[{header:'Server name',dataIndex:'serverID'}],
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
			id:'newserver'
		},'->',{
			text:'save',
			id:'buttonServerSave'
		}]
	}]
});

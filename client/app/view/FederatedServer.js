Ext.define('SC.view.regions.west.FederatedServer',{
	extend: 'Ext.grid.Panel',
	alias: 'widget.fedServer',
	id:'fedserver',
	store:'Servers',
	//CONFIG
	title:'Federated Servers',
	collapsible:true,
	animCollapse:true,
	bodyPadding:2,
	anchor:'100%',
	layout:'anchor',
	hidden:true,
	dockedItems:[
	{	dock:'bottom',
		xtype:'button',
		id:'buttonServerEdit',
		text:'edit'
	}],
	columns:[{header:'server name',dataIndex:'serverID',flex:1}]
	
});

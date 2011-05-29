Ext.define('SC.view.regions.east.FederatedServer',{
	extend: 'Ext.grid.Panel',
	alias: 'widget.fedServer',
	store:'Servers',
	//CONFIG
	title:'Federated Servers',
	collapsible:true,
	animCollapse:true,
	bodyPadding:2,
	anchor:'100%',
	layout:'anchor',
	dockedItems:[
	{	dock:'bottom',
		xtype:'button',
		id:'buttonServerEdit',
		text:'edit'
	}],
	columns:[{header:'server name',dataIndex:'serverID',flex:1}]
	
});

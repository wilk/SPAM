Ext.define('SC.view.regions.east.FederatedServer',{
	extend: 'Ext.grid.Panel',
	alias: 'widget.fedServer',
	store:'Servers',
	//model:'SC.model.Server',
	//CONFIG
	title:'Federated Servers',
//	heigh:200,
//	width:400,
	//renderTo:Ext.getBody(),
	autoWidth:true,
	autoHeigh:true,
	collapsible:true,
	animCollapse:true,
	bodyPadding:2,
	anchor:'100%',
	layout:'anchor',
	//autoRender:true,
	items:[
//	{
//		xtype:'dataview',
//		store:'Servers',
//		itemSelector:['server'],
//		tpl:'<tpl for="."><div class=serverid>{server}</div></tpl>'
//	},
	{
		xtype:'button',
		id:'buttonServerEdit',
		text:'edit'
	}],
	columns:[{header:'server name',dataIndex:'serverID',flex:1}]
	
});

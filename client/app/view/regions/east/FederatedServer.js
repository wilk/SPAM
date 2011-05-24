Ext.define('SC.view.regions.east.FederatedServer',{
	extend: 'Ext.panel.Panel',
	alias: 'widget.fedServer',
	store:'Servers',
	//CONFIG
	title:'Federated Servers',
	autoWidth:true,
	collapsible:true,
	animCollapse:true,
	bodyPadding:2,
	anchor:'100%',
	layout:'anchor',
	items:[{
		xtype:'dataview',
		store:'Servers',
		itemSelector:['server'],
		tpl:'<tpl for="."><div class=serverid>{server}</div></tpl>'
	},{
		xtype:'button',
		id:'buttonServer',
		text:'servers'
	}]
});

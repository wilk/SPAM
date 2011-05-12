// East Region
Ext.define ('SC.view.regions.East' , {
	extend: 'Ext.panel.Panel' ,
	alias: 'widget.eastregion' ,
	// Panel views
	requires: [
		'SC.view.regions.east.RecentPost' ,
		'SC.view.regions.east.TagCloud'
	] ,
	width: 150 ,
	title: 'Menu' ,
	region: 'east' ,
	collapsible: true ,
	split: true ,
	items: [{
		xtype: 'recentpost'
	} , {
		xtype: 'tagcloud'
	}]
});

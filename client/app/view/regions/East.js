Ext.define ('SC.view.regions.East' , {
	extend: 'Ext.container.Container' ,
	alias: 'widget.eastregion' ,
	requires: [
		'SC.view.regions.east.RecentPost' ,
		'SC.view.regions.east.TagCloud'
	] ,
	width: 150 ,
	items: [{
		xtype: 'recentpost'
	} , {
		xtype: 'tagcloud'
	}]
});

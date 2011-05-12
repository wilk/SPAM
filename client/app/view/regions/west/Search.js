Ext.define ('SC.view.regions.west.Search' , {
	extend: 'Ext.panel.Panel' ,
	alias: 'widget.search' ,
	title: 'Search' ,
	width: 150 ,
	autoHeight: true ,
	collapsible: true ,
	closable: true ,
	animCollapse: true ,
	items: [{
		xtype: 'textfield' ,
		value: 'Search'
	}]
});

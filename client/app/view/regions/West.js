// West Region
Ext.define ('SC.view.regions.West' , {
	extend: 'Ext.panel.Panel' ,
	alias: 'widget.westregion' ,
	// Panel views
	requires: [
		'SC.view.regions.west.User' ,
		'SC.view.regions.west.Search' ,
		'SC.view.regions.west.Thesaurus'
	] ,
	width: 150 ,
	title: 'Menu' ,
	region: 'west' ,
	collapsible: true ,
	split: true ,
	items: [{
		xtype: 'user' 
	} , {
		xtype: 'search'
	} , {
		xtype: 'thesaurus'
	}]
});

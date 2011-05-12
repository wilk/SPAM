Ext.define ('SC.view.regions.West' , {
	extend: 'Ext.container.Container' ,
	alias: 'widget.westregion' ,
	requires: [
		'SC.view.regions.west.User' ,
		'SC.view.regions.west.Search' ,
		'SC.view.regions.west.Thesaurus'
	] ,
	width: 150 ,
	resizable: true ,
	autoHeight: true ,
	border: true , 
	items: [{
		xtype: 'user' 
	} , {
		xtype: 'search'
	} , {
		xtype: 'thesaurus'
	}]
});

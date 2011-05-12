// Center Region
Ext.define ('SC.view.regions.Center' , {
	extend: 'Ext.container.Container' ,
	alias: 'widget.centerregion' ,
	region: 'center' ,
	items: [{
		xtype: 'panel' ,
		autoHeight: true ,
		autoWidth: true ,
		minHeight: 300 ,
		minWidth: 300 ,
		title: 'Center' ,
		html: 'center'
	}]
});

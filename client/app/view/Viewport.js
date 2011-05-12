// Viewport
Ext.define ('SC.view.Viewport' , {
	extend: 'Ext.container.Viewport' ,
	
	// Region views
	requires: [
		'SC.view.regions.North' ,
		'SC.view.regions.West' ,
		'SC.view.regions.East' ,
		'SC.view.regions.Center' ,
	] ,
	
	layout: 'border' ,
	
	items: [{
		xtype: 'northregion'
	} , {
		xtype: 'westregion'
	} , {
		xtype: 'eastregion'
	} , {
		xtype: 'centerregion'
	}]
});

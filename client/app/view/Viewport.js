Ext.define ('SC.view.Viewport' , {
	extend: 'Ext.container.Viewport' ,
	
	requires: [
		'SC.view.regions.North' ,
		'SC.view.regions.West' ,
		'SC.view.regions.East' ,
		'SC.view.regions.Center' ,
	] ,
	
	layout: 'border' ,
	
	items: [{
		region: 'north' ,
		xtype: 'northregion'
	} , {
		region: 'west' ,
		xtype: 'westregion'
	} , {
		region: 'east' ,
		xtype: 'eastregion'
	} , {
		region: 'center' ,
		xtype: 'centerregion'
	}]
});

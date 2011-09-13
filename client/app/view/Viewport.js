// @file 	Viewport.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	The Viewport

Ext.define ('SC.view.Viewport' , {
	extend: 'Ext.container.Viewport' ,
	
	// Region and other views
	requires: [
		'SC.view.regions.North' ,
		'SC.view.regions.West' ,
		'SC.view.regions.East' ,
		'SC.view.regions.Center' ,
		'SC.view.regions.center.Navigator' ,
		'SC.view.Send' ,
		'SC.view.SelectPost' ,
		'SC.view.SendResource' ,
		'SC.view.Options' ,
		'SC.view.AddTerm' ,
		'SC.view.FollowerWindow'
	] ,
	
	// Configuration
	layout: 'border' ,
	
	// Body
	items: [{
		xtype: 'northregion'
	} , {
		xtype: 'westregion'
	} , {
		xtype: 'eastregion'
	} , {
		xtype: 'centerregion'
	} , {
		xtype: 'navigatorwin' ,
		hidden: true
	} , {
		xtype: 'send'
	} , {
		xtype: 'selectpost'
	} , {
		xtype: 'sendresource'
	} , {
		xtype: 'options'
	} , {
		xtype: 'thesaurusaddterm'
	} , {
		xtype: 'followerwindow'
	}]
});

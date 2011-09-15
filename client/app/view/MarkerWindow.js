// @file 	MarkerWindow.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Marker view

Ext.define ('SC.view.MarkerWindow' , {
	extend: 'Ext.window.Window' ,
	alias: 'widget.markerwindow' ,
	
	// Configuration
	id: 'windowMarker' ,
	height: 150 ,
	width: 270 ,
	resizable: false ,
	// On top of any content
	modal: true ,
	layout: 'anchor' ,
	bodyPadding: 10 ,
	
	// Docked buttons
	dockedItems: {
		xtype: 'toolbar' ,
		dock: 'bottom' ,
		ui: 'footer' ,
		items: ['->' , {
			// Search button
			text: 'Search your neighbours' ,
			id: 'btnMarkerSearch' ,
			icon: 'ext/resources/images/btn-icons/search.png'
		}]
	}
});

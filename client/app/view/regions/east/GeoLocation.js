// @file 	GeoLocation.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Tag cloud panel

Ext.define ('SC.view.regions.east.GeoLocation' , {
	extend: 'Ext.panel.Panel' ,
	alias: 'widget.geolocation' ,
	
	// Configuration
	title: 'Geo Location' ,
	id: 'geoLocPanel' ,
	html: '<div id="geoloc" style="width:100%; height:100%"></div>' ,
	autoWidth: true ,
	height: '500' ,
	collapsible: true ,
	animCollapse: true ,
	bodyPadding: 2 ,
	anchor: '100%' ,
	layout: 'anchor'
});

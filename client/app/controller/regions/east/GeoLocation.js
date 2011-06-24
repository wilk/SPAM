// @file 	GeoLocation.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of GeoLocation view

Ext.define ('SC.controller.regions.east.GeoLocation' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.east.GeoLocation'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// After geolocation panel renders
			'geolocation' : {
				afterrender : this.initGeolocation
			}
		});
		console.log ('Controller GeoLocation started.');
	} ,
	
	// Initialize geolocation panel
	initGeolocation: function (geoPanel) {
		// If browser supports geolocation, setup default
		if (browserGeoSupportFlag) {
			try {
				var latlng = new google.maps.LatLng(0, 0);
				var myOptions = {
					zoom: 0,
					center: latlng,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				googleMap = new google.maps.Map(document.getElementById("geoloc"), myOptions);
			}
			// If something goes wrong, alert user
			catch (error) {
				Ext.Msg.show ({
					title: 'Error' ,
					msg: error.description ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
		}
		// Otherwise, do not show geo location panel
		else {
			geoPanel.setVisible (false);
		}
	}
});

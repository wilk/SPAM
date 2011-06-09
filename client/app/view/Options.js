// @file 	Options.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Widget window for setup options configuration

Ext.define ('SC.view.Options' , {
	extend: 'Ext.window.Window' ,
	alias: 'widget.options' ,
	
	// Configuration
	title: 'Options' ,
	id: 'windowOptions' ,
	height: 400 ,
	width: 400 ,
	resizable: false ,
	// On top of any content
	modal: true ,
	layout: 'anchor' ,
//	bodyPadding: 10 ,
	closeAction: 'hide' ,
	activeTab: 0 ,
	
	// Body
	items: [{
		// Tab panel
		xtype: 'tabpanel' ,
		anchor: '100% 100%' ,
		layout: 'anchor' ,
		items: [{
			// Tab Options
			title: 'Options' ,
			items: [{
				xtype: 'panel' ,
				// No frame nor border
				frame: false ,
				border: 0 ,
				bodyPadding: 10 ,
				anchor: '100% 100%' ,
				layout: 'anchor' ,
				items: [{
					// Server URL
					xtype: 'textfield' ,
					id: 'tfServerUrl' ,
					fieldLabel: 'Server URL ' ,
					anchor: '100% 100%' ,
					allowBlank: false ,
					value: 'http://ltw1102.web.cs.unibo.it'
				}] ,
				// Buttons
				buttons: [{
					text: 'Reset' ,
					id: 'btnOptionReset'
				}]
			}]
		} , {
			// Tab Server
			title: 'Server' ,
			items: [{
				xtype: 'grid' ,
				id: 'fedServer' ,
				store: 'Servers' ,
				frame: false ,
				border: 0 ,
				bodyPadding: 10 ,
				anchor: '100% 100%' ,
				columns: [{
					header: 'server name' ,
					dataIndex: 'serverID'
				}]
			}]
		} , {
			// Tab About Us
			title: 'About Us' ,
			bodyPadding: 10 ,
			html: '<h1>Thanks to:</h1><br />Clemente Vitale : cvitale@cs.unibo.ti<br />Riccardo Statuto : statuto@cs.unibo.it<br />Stefano Sgarlata : sgarlat@cs.unibo.it<br />Vincenzo Ferrari : ferrari@cs.unibo.it'
		} , {
			// Tab Help
			title: 'Help' ,
			bodyPadding: 10 ,
			html: 'RTFM'
		}]
	}]
});

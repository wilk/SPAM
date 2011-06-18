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
					// TODO: insert a default value (default server ID)
					xtype: 'combo' ,
					id: 'tfServerUrl' ,
					fieldLabel: 'Server URL ' ,
					anchor: '100% 100%' ,
					allowBlank: false ,
					editable: false ,
//					forceSelection: true ,
					displayField: 'serverID' ,
					labelWidth: 130 ,
					store: 'serverStore' ,
					queryMode: 'local'
//					typeAhead: true ,
				}] ,
				// Buttons
				buttons: [{
					text: 'Reset' ,
					id: 'btnOptionReset'
				}]
			}]
		} , {
			// Tab Server Grid
			title: 'Server' ,
			autoScroll:true,
			items: [{
				xtype: 'grid' ,
				forceFit:true,
				id: 'fedServer' ,
				store: 'serverStore' ,
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
			html: '<h1>Thanks to:</h1><br />Clemente Vitale : cvitale@cs.unibo.ti<br />Riccardo Statuto : statuto@cs.unibo.it<br />Stefano Sgarlata : sgarlats@cs.unibo.it<br />Vincenzo Ferrari : ferrari@cs.unibo.it'
		} , {
			// Tab Help
			title: 'Help' ,
			bodyPadding: 10 ,
			html: 'RTFM'
		}]
	}]
});

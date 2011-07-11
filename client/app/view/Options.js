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
				id: 'optionTab' ,
				// No frame nor border
				frame: false ,
				border: 0 ,
				bodyPadding: 10 ,
				anchor: '100% 100%' ,
				layout: 'anchor' ,
				items: [{
					// Server URL
					xtype: 'combo' ,
					id: 'tfServerUrl' ,
					fieldLabel: 'Server URL ' ,
					anchor: '100% 100%' ,
					allowBlank: false ,
					editable: false ,
					displayField: 'serverID' ,
					labelWidth: 130 ,
					store: 'Server' ,
					queryMode: 'local'
				}] ,
				// Buttons
				buttons: [{
					// Reset
					text: 'Reset' ,
					id: 'btnOptionReset'
				} , {
					// Apply
					text: 'Apply' ,
					id: 'btnOptionApply'
				}]
			}]
		} , {
			// Tab Server Grid
			title: 'Server' ,
			id: 'serverTab' ,
			autoScroll: true ,
			items: [{
				xtype: 'grid' ,
				forceFit:true,
				id: 'fedServer' ,
				store: 'Server' ,
				frame: false ,
				border: 0 ,
				anchor: '100% 100%' ,
				layout: 'anchor' ,
				
				columns: [{
					// Server ID
					header: 'Server Name' ,
					dataIndex: 'serverID' ,
					anchor: '80%'
				} , {
					// Column to add/del servers
					xtype: 'actioncolumn' ,
					header: 'Add/Delete' ,
					id: 'adServerColumn' ,
					anchor: '20%' ,
					align: 'center' ,
					// Visibile if the user is logged in
					hidden: true ,
					items: [{
						// Add button
						icon: 'ext/resources/images/server-grid-actions/check.ico' ,
						iconCls: 'icon-add' ,
						tooltip: 'Add this server to yours list'
					} , {
						// Del button
						icon: 'ext/resources/images/server-grid-actions/delete.ico' ,
						iconCls: 'icon-delete' ,
						tooltip: 'Delete this server from yours list'
					}]
				}]
			}]
		} , {
			// Tab About Us
			title: 'About Us' ,
			layout: 'anchor' ,
			anchor: '100% 100%' ,
			items: [{
				xtype: 'panel' ,
				layout: 'accordion' ,
				anchor: '100% 100%' ,
				defaults: {
					bodyPadding: 10
				} ,
				items: [{
					title: 'Vincenzo Ferrari' ,
					html: '<h1>email : ferrari@cs.unibo.it</h1>'
				} , {
					title: 'Riccardo Statuto' ,
					html: '<h1>email : statuto@cs.unibo.it</h1>'
				} , {
					title: 'Stefano Sgarlata' ,
					html: '<h1>email : sgarlats@cs.unibo.it</h1>'
				} , {
					title: 'Clemente Vitale' ,
					html: '<h1>email : cvitale@cs.unibo.it</h1>'
				}]
			}]
		} , {
			// Tab Help
			title: 'Help' ,
			bodyPadding: 10 ,
			html: 'RTFM'
		}]
	}]
});

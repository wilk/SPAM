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
	items: {
		// Tab panel
		xtype: 'tabpanel' ,
		anchor: '100% 100%' ,
		layout: 'anchor' ,
		items: [{
			// Tab Options
			title: 'Options' ,
			items: {
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
					anchor: '100%' ,
					allowBlank: false ,
					editable: false ,
					displayField: 'serverID' ,
					labelWidth: 150 ,
					store: 'Server' ,
					queryMode: 'local'
				} , {
					// Search Number
					xtype: 'numberfield' ,
					id: 'numberSearchDefault' ,
					fieldLabel: 'Default number search ' ,
					labelWidth: 150 ,
					value: 10 ,
					minValue: 1 ,
					allowBlank: false ,
					anchor: '100%'
				} , {
					// Search Number
					xtype: 'numberfield' ,
					id: 'numberNavigatorDefault' ,
					fieldLabel: 'Default number navigator ' ,
					labelWidth: 150 ,
					value: 10 ,
					minValue: 1 ,
					allowBlank: false ,
					anchor: '100%'
				}] ,
				// Buttons
				buttons: [{
					// Reset
					text: 'Reset' ,
					id: 'btnOptionReset' ,
					icon: 'ext/resources/images/btn-icons/reset.png'
				} , {
					// Apply
					text: 'Apply' ,
					id: 'btnOptionApply' ,
					icon: 'ext/resources/images/btn-icons/apply.png'
				}]
			}
		} , {
			// Tab Server Grid
			title: 'Server' ,
			id: 'serverTab' ,
			autoScroll: true ,
			items: {
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
						tooltip: 'Add this server to your list'
					} , {
						// Del button
						icon: 'ext/resources/images/server-grid-actions/delete.ico' ,
						iconCls: 'icon-delete' ,
						tooltip: 'Delete this server from your list'
					}]
				}]
			}
		} , {
			// Tab About Us
			title: 'About Us' ,
			layout: 'anchor' ,
			anchor: '100% 100%' ,
			items: {
				xtype: 'panel' ,
				layout: 'accordion' ,
				anchor: '100% 100%' ,
				defaults: {
					bodyPadding: 10
				} ,
				items: [{
					title: '<b>Vincenzo Ferrari</b>' ,
					html: '<table><tr><td rowspan="6" style="padding-right: 2px"><img style="border:1px solid black" src="ext/resources/images/spammers/wilk.jpg" alt="Wilk" /></td></tr><tr><td><b>Nick :</b></td><td><i>Wilk</i></td></tr><tr><td><b>Email :</b></td><td><i>ferrari@cs.unibo.it</i></td></tr><tr><td><b>Level :</b></td><td><i>Advanced Spammer</i></td></tr></table><p><b>Description :</b><br /><i>Born spammer, Wilk improved his spammersness in years and years of spamming. Now he\'s a master of the spam and if you are lucky enough to meet him you\'ll hear SPAM SPAM SPAM.</i></p>'
				} , {
					title: '<b>Riccardo Statuto</b>' ,
					html: '<table><tr><td rowspan="6" style="padding-right: 2px"><img style="border:1px solid black" src="ext/resources/images/profile.png" alt="Ricky" /></td></tr><tr><td><b>Nick :</b></td><td><i>Ricky</i></td></tr><tr><td><b>Email :</b></td><td><i>statuto@cs.unibo.it</i></td></tr><tr><td><b>Level :</b></td><td><i>Newbie Spammer</i></td></tr></table><p><b>Description :</b><br /><i>Ricky has made the server-side but he\'s still a newbie in the art of spamming.</i></p>'
				} , {
					title: '<b>Stefano Sgarlata</b>' ,
					html: '<table><tr><td rowspan="6" style="padding-right: 2px"><img style="border:1px solid black" src="ext/resources/images/profile.png" alt="Ste" /></td></tr><tr><td><b>Nick :</b></td><td><i>Ste</i></td></tr><tr><td><b>Email :</b></td><td><i>sgarlats@cs.unibo.it</i></td></tr><tr><td><b>Level :</b></td><td><i>Newbie Spammer</i></td></tr></table><p><b>Description :</b><br /><i>Ste has made the mobile with Sencha Touch but he\'s still a newbie in the art of spamming too.</i></p>'
				} , {
					title: '<b>Clemente Vitale</b>' ,
					html: '<table><tr><td rowspan="6" style="padding-right: 2px"><img style="border:1px solid black" src="ext/resources/images/profile.png" alt="Cle" /></td></tr><tr><td><b>Nick :</b></td><td><i>Cle</i></td></tr><tr><td><b>Email :</b></td><td><i>cvitale@cs.unibo.it</i></td></tr><tr><td><b>Level :</b></td><td><i>Newbie Spammer</i></td></tr></table><p><b>Description :</b><br /><i>Cle has made the server-side with Ricky but he\'s still a newbie in the art of spamming too.</i></p>'
				}]
			}
		}]
	}
});

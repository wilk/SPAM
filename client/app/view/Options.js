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
					store: 'Servers' ,
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
				},{
				
//				column that contain icons for adding and deleting server items from userServer store
					header:'Add/Delete',
					xtype:'actioncolumn',
					width:20,
					
//				settings and handler for add server action
					items:[{
						icon:'ext/resources/images/server-grid-actions/check.ico',
						tooltip:'Add this server to yours list',
						handler:function(grid,rowIndex,colIndex){
							if(Ext.util.Cookies.get('SPAMlogin')!=null){
								var rec=grid.getStore().getAt(rowIndex);
								var userSt=Ext.StoreManager.lookup('userStore');
								var record=userSt.findRecord('serverID',rec.get('serverID'));
								if(record==null){
									userSt.add(rec);
								}
								else{
									alert('server already present');
								}
							}
							else{
								alert('please login to use this function');
							}
						}
					},
					
//				settings and handler for delete server action
					{
						icon:'ext/resources/images/server-grid-actions/delete.ico',
						tooltip:'Delete this server from yours list',
						itemId:'DeleteServer',
						handler:function(grid,rowIndex,colIndex){
							if(Ext.util.Cookies.get('SPAMlogin')!=null){
								var rec=grid.getStore().getAt(rowIndex);
								var userSt=Ext.StoreManager.lookup('userStore');
								var index=userSt.find('serverID',rec.get('serverID'));
								if(index<0){
									alert('server not present');
								}
								else{
									userSt.removeAt(index);
								}
							}
							else{
								alert('please login to use this function');
							}
						}
					}]
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

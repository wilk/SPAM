Ext.define('SC.controller.Server',{
	extend: 'Ext.app.Controller',
	views:['Options','regions.west.User'],
	stores:['Servers'],
	models:['Server'],
	
	init:function(){
	
	//flags and useful variables
		logged=false;
		var selMode;
		var actionColumn={
				
	//				column that contain icons for adding and deleting server items from userServer store
			header:'Add/Delete',
			id:'action',
			xtype:'actioncolumn',
			width:20,
		
	//				settings and handler for add server action
			items:[{
				icon:'ext/resources/images/server-grid-actions/check.ico',
				tooltip:'Add this server to yours list',
				handler:function(grid,rowIndex,colIndex){
					var rec=grid.getStore().getAt(rowIndex);
					var userSt=Ext.StoreManager.lookup('userStore');
					var record=userSt.findRecord('serverID',rec.get('serverID'));
					if(record==null){
						userSt.add(rec);
//					build request body
						var serId='';
						for(var i=0;i<userStore.getCount();i++){
								serId=serId+'<server serverID="'+userStore.getAt(i).get('serverID');
								serId=serId+'"'+'/>';
//								console.log(record);
						}
						var body='<servers>'+serId+'</servers>';
						
//						send data to server
						
						Ext.Ajax.request({
							url:'servers',
							method:'POST',
							params:{servers:body}
						});
					}
					else{
						alert('server already present');
					}
				}
			},
		
	//				settings and handler for delete server action
			{
				icon:'ext/resources/images/server-grid-actions/delete.ico',
				tooltip:'Delete this server from yours list',
				itemId:'DeleteServer',
				handler:function(grid,rowIndex,colIndex){
					var rec=grid.getStore().getAt(rowIndex);
					var userSt=Ext.StoreManager.lookup('userStore');
					var index=userSt.find('serverID',rec.get('serverID'));
					if(index<0){
						alert('server not present');
					}
					else{
						userSt.removeAt(index);
//					build request body
						var serId='';
						for(var i=0;i<userStore.getCount();i++){
								serId=serId+'<server serverID="'+userStore.getAt(i).get('serverID');
								serId=serId+'"'+'/>';
//								console.log(record);
						}
						var body='<servers>'+serId+'</servers>';
//						send data to server
						
						Ext.Ajax.request({
							url:'servers',
							method:'POST',
							params:{servers:body}
						});
					}
				}
			}]
		};
				
		//instantiate preconfigured stores with unique id
		store=Ext.create('SC.store.Servers',{storeId:'serverStore'});
		userStore=Ext.create('SC.store.Servers',{storeId:'userStore'});
		
		//load records from server with an ajax request
		store.load();
		
		//listen to ajax request's exceptions, errors or successes
		storeproxy=store.getProxy();
		storeproxy.on('exception',function(){console.log('server list not available');});
		
		//on login or logout action set a flag and load correct servers list
		Ext.Ajax.on('requestcomplete',function(conn,resp,obj){
											switch(obj.url){
												case('login'):
													grid=Ext.getCmp('fedServer');
													logged=true;
													
//												add Add/delete column
													grid.headerCt.add(actionColumn);
													grid.getView().refresh();
													userStore.load();
													break;
												case('logout'):
												
//												remove Add/Delete column
													grid=Ext.getCmp('fedServer');
													grid.headerCt.remove(Ext.getCmp('action'));
													grid.getView().refresh();
													logged=false;
													store.load();
													break;
											}
										}
		,this);
		
		console.log ('Controller federated server started.');		
	}

});

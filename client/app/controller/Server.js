Ext.define('SC.controller.Server',{
	extend: 'Ext.app.Controller',
	views:['Options','regions.west.User'],
	stores:['Servers'],
	models:['Server'],
	
	init:function(){
	
	//flags and useful variables
		logged=false;
		
	//instantiate preconfigured stores with unique id
		var store=Ext.create('SC.store.Servers',{storeId:'serverStore'});
		var userStore=Ext.create('SC.store.Servers',{storeId:'userStore'});
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
	
		
		this.control({
			'viewport':{
				afterrender:function(){
					if(Ext.util.Cookies.get('SPAMlogin')!=null){
					
					//reload cached servers list
//						
						this.cookiesToServers();
						
					//reload user's servers
					
						Ext.StoreManager.lookup('userStore').load();
							
//						add Add/delete column

						grid=Ext.getCmp('fedServer');
						logged=true,
						grid.headerCt.add(actionColumn);
						grid.getView().refresh();
					}
					else{
					
						//load records from server with an ajax request
						
						store.load();
						//save servers to cookie for page refresh
						
						store.on('load',this.serversToCookies);
						
					}
				}
			}
		});
						
		
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
	},
	
	serversToCookies:function(){
	
		var store=Ext.StoreManager.lookup('serverStore');
//string delimiter
		var string='@';
	//concatenate all id and url
		store.each(function(record){
			string=string+record.get('serverID')+'@'+record.get('serverURL')+'@';
		});
	//save string to cookie	
		Ext.util.Cookies.set('storeCopy',string);
	},
	
	cookiesToServers:function(){
	//load string to an array and instantiate useful variables
		var servArray=Ext.Array.toArray(Ext.util.Cookies.get('storeCopy'));
		var id='';
		var url='';
		var count=0;
		
		Ext.Array.forEach(servArray,function(item,index,allItems){
										if(item!='@'){
											if(count%2!=0){
												//id field character
												id=id+item;
											}
											else{
												//url field character
												url=url+item;
											}
										}
										else{
											count++;
										//exclude first jolly character
											
											if(id!=''||url!=''){
										//id and url fields are ready	
												
												if(count%2!=0){
											//take the store, load a record	and reset variables
													store=Ext.StoreManager.lookup('serverStore');
													store.add({serverID:id,serverURL:url});
													id='';
													url='';
												}
											}
										}
									},this);
		
	}

});

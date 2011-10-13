Ext.regController('Server',{
	
	init:function(){
	
		this.serverstore=new Ext.data.Store({
			model:'Server',
			sorters:{
				property:'serverID',
				direction:'ASC'
			},
			getGroupString:function(record){
			
				if(Ext.StoreMgr.get('loginstore').getCount()!=0){
				
					if (record.get('enabled')){
						return 'Enabled';
					}
					else{
						return 'Disable';
					}
				}
				else{
					return 'User not logged';
				}
			}
		});
		
		Ext.regStore('serverstore',this.serverstore);
		
		this.serverstorecopy=new Ext.data.Store({
			model:'Server',
			proxy:{
				type:'localstorage',
				id:'serverstorecopy'
			}
		});
		
		Ext.regStore('serverstorecopy',this.serverstorecopy);
		
		if(Ext.StoreMgr.get('loginstore').getCount()==0){
			
			this.serverstore.load(function(records,operation,success){
				
				if(success){
				
					for(i=0;i<records.length;i++){
					
						records[i].set('enabled',0);
						Ext.StoreMgr.get('serverstorecopy').add(records[i]);
						Ext.StoreMgr.get('serverstorecopy').sync();
					}
				
				}
				else{
				
					Ext.Msg.show ({
						title: 'Servers',
						msg: 'Something goes wrong during servers loading operation' ,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
				
				}
				
			});
		
		}
		else{
			
			this.serverstorecopy.load();
			
			for(i=0;i<this.serverstorecopy.getCount();i++){
			
				this.serverstore.add(this.serverstorecopy.getAt(i));
			
			}
			
			this.compareServerStores();
		
		}
		
//		this.serverstore.on('load',function(store,record,success){
//		
//			if(Ext.StoreMgr.get('loginstore').getCount()==0){
//			
//				for(i=0;i<record.length;i++){
//					record[i].set('enabled',0);
//					this.serverstorecopy.add(record[i]);
//				}
//				this.serverstorecopy.sync();
//			}
//		
//		},this);
		
		Ext.Ajax.on('requestcomplete',function(conn, resp, opt){
			
//			console.log(conn, resp, opt);
			if(opt.url=='login'&&resp.status==200){

				this.compareServerStores();
			
			}
			if(opt.url=='logout'&&resp.status==200){
			
				this.serverstorecopy.getProxy().clear();
				
			}
			
		},this);
	
	},
	
	//action name
	renderServerList:function(options){

		this.prevView=options.view;
		
		this.list=this.render({
			xtype:'serverlist',
			items:[{
				xtype:'list',
				itemId:'list',
				store:this.serverstore,
				itemTpl:'{serverID}',
				grouped:true,
				listeners:{
					itemtap:function(view,index,item,element){
//					console.log(view,index,item,element);
						Ext.dispatch({
							
							controller:'Server',
							action:'serverAction',
							item:item
							
						})
					
					}
				}
			}]
		});
		
		this.list.setLoading(true);
		
		this.application.viewport.setActiveItem(this.list);
		
//		this.serverstore.load(function(rec,op,suc){console.log(rec);});
	},
	
	closeServerList:function(){
		
		if(Ext.StoreMgr.get('loginstore').getCount()!=0){
			this.sendServers();
		}
		
		if(this.prevView){
			this.application.viewport.setActiveItem(this.prevView);
		}
		else{
			Ext.dispatch({
				controller:'Home',
				action:'renderHome',
//				historyUrl:'spam/home'
			});
		}
		
	},
	
	compareServerStores:function(){

//		this.serverstore.each(function(rec){rec.set('enabled',0);});
	
		$.ajax({
		
			type:'get',
			dataType:'xml',
			url:Ext.StoreMgr.get('serverstore').getProxy().url,
			
			success:function(xml){
				
				$(xml).find('servers').find('server').each(function(){
				
					var findServerRecord=Ext.StoreMgr.get('serverstore').findRecord('serverID',$(this).attr('serverID'));
					
					if(findServerRecord!=null){
						findServerRecord.set('enabled',1);
					}
				
				});
				
			},
			
			error: function (xhr, type, text) {
						
				Ext.Msg.show ({
					title: type,
					msg: text ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
		
		});
	
	},
	
	serverAction:function(options){
	
		var record=this.serverstore.findRecord('serverID',options.item.textContent);
//	console.log(record);
		if(Ext.StoreMgr.get('loginstore').getCount()!=0){
		
//			var server=this.serverstore.getAt(options.index);
			var title=record.get('serverID');
			var isenabled=record.get('enabled');
			var message='';
			if(isenabled){
				message='This server is enabled, do you want to disable it?';
			}
			else{
				message='This server is disabled, do you want to enable it?';
			}
			
		
		}
		
		Ext.Msg.confirm(title,message,function(button){
//			console.log(button);
			if(button!='no'){
				
				if(isenabled){
					record.set('enabled',0);
				}
				else{
					record.set('enabled',1);
				}
//				this.list.doComponentLayout();
//				this.render(this.list);
			}
			
		},this);
	
	},
	
	sendServers:function(){
	
		this.application.viewport.setLoading(true);
	
		var opendoc='<servers>';
		var closedoc='</servers>';
		
		var opentagandattr='<server serverID=';
		var closetag='</server>';
		
		var doc=opendoc;
		
		this.serverstore.each(function(rec){
			
			if(rec.get('enabled')){
				doc=doc+opentagandattr+'"'+rec.get('serverID')+'">'+closetag;
			}
			
		},this);
		
		doc=doc+closedoc;
		
		Ext.Ajax.request({
		
			method:'post',
			url:this.serverstore.getProxy().url,
			params:{servers:doc},
			scope:this,
			success:function(response){
			
				this.application.viewport.setLoading(false);
			
			},
			failure:function(response){
			
				this.application.viewport.setLoading(false);
			
				Ext.Msg.alert(response.statusText,response.responseText);
			}
		
		});
	
	}
});

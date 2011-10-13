Ext.regController('followers',{

init:function(){

	this.followersStore=new Ext.data.Store({
			model:'Follower',
			sorters:{
				property:'follower',
				direction:'ASC'
			}
		});
	Ext.regStore('followersStore',this.followersStore);
	
	if(Ext.StoreMgr.get('loginstore').getCount()!=0){
		this.followersStore.load();
	}
	Ext.Ajax.on('requestcomplete',function(conn,res,opt){
		
		if(opt.url=='login'&&res.status==200){
			this.followersStore.load();
		}
		
	},this)
},

showFollowers:function(options){

	this.prevView=options.view;
	
	if(!this.followers){
	
		
		
		this.followers=this.render({
		
			xtype:'followers',
			items:[{
				xtype:'list',
				itemId:'followersList',
				store:this.followersStore,
				itemTpl:'{follower}',
				listeners:{
				scope:this,
					itemtap:function(v,ind,it,e){
					
							this.showItemActions($(it).text());
							
						}
				}
			}]
		
		});
	
	}
	
	this.application.viewport.setActiveItem(this.followers);
	
//	this.followers.setLoading(true);

	
//	this.followers.setLoading(false);

},

showItemActions:function(name){

	if(!this.actions){
		this.actions=this.render({xtype:'followerItemActions'});
		
	}
	this.actions.down('#titleToolbar').setTitle(name);
	this.actions.show();

},

setFollow:function(options){
	
	var tmp=options.id.split('/');
	var serverID=tmp[0];
	var userID=tmp[1];

	Ext.Ajax.request({
	
		url:'setfollow',
		params:{
			serverID:serverID,
			userID:userID,
			value:options.value
		},
		scope:this,
		success:function(){
			Ext.Msg.alert('Setfollow','your choice was registered');
			this.followersStore.load();
		},
		failure:function(res){
			Ext.Msg.alert(res.statusText,res.responseText);
		}
	
	});


},

closeFollowersList:function(){

	if(this.prevView){
		this.application.viewport.setActiveItem(this.prevView);
	}
	else{
	
		Ext.dispatch({
		
			controller:'Home',
			action:'renderHome',
//			historyUrl:'spam/home'
		
		});
	
	}

}

});

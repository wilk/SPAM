Ext.regController('PostAction',{

	init:function(){
		var postView, userId, serverId, postId;
		genLoaded=false;
	},

	showActionSheet:function(options){
	
		this.postView=options.view;
	
		this.action=this.render({xtype:'postAction'});
		
		this.application.viewport.setActiveItem(this.action);
	},
	
	destroySheet:function(options){
	
		options.view.destroy();
		genLoaded=false;
		
//		this.last=this.render(this.postView);
		this.application.viewport.setActiveItem(this.postView);
	},
	
	setLike:function(options){
	
		var value=options.value;
//		var index=Ext.ControllerManager.get('Post').getPostIndex();
//		var poststore=Ext.StoreMgr.get('poststore');
//		console.log(poststore.getAt(index));
		if(!genLoaded){
			this.getPostgenerality();
		}
		Ext.Ajax.request({
		
			method:'post',
			url:'setlike',
			
			params:{serverID:serverId,
					userID:userId,
					postID:postId,
					value:value},
			
			success:function(){
				alert('setlike');
			},
			
			failure:function(response){
				Ext.Msg.alert(response.statusText,response.responseText);
			}
		
		});
	
	},
	
	getPostgenerality:function(){
	
		if(!genLoaded){
			var index=Ext.ControllerManager.get('Post').getPostIndex();
			var poststore=Ext.StoreMgr.get('poststore');
			var post=poststore.getAt(index);
			
			var tmp=post.get('about').split("/");
			serverId=tmp[1];
			userId=tmp[2];
			postId=tmp[3];
			
			genLoaded=true;
//			console.log(serverId, userId,postId,tmp,post.get('about'));
		}
	
	},
	
	respamPost:function(){
	
		if(!genLoaded){
			this.getPostgenerality();
		}
		Ext.Ajax.request({
		
			method:'post',
			url:'respam',
			
			params:{serverID:serverId,
					userID:userId,
					postID:postId},
			
			success:function(){
				alert('post respammed');
			},
			
			failure:function(response){
			
				Ext.Msg.alert(response.statusText,response.responseText);
			}
		
		});
	
	},
	
	replayToPost:function(){
		alert('function not already implemented');
	}

});

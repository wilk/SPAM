Ext.regController('Post',{

	init:function(){
			var postIndex,postView, userId, serverId, postId, likeChoice;
//			genLoaded=false;
		},

	showPost:function(options){
	
		postIndex=options.index;
		
		this.getPostgenerality();
		
		var record=options.post;
		var article=options.article;
	
//	console.log(record);
		this.post=this.render({xtype:'post',html:record});
		
		this.post.down('#toolbarTitle').setTitle(options.user+' said');

		if (Ext.StoreMgr.get('loginstore').getCount()!=0){

			this.post.down('#postAction').setVisible(true);
		}
		else{
			this.post.down('#postAction').setVisible(false);
		}
		
		this.post.doComponentLayout();
		
		var pos=this.post;
		$(article).find('span').each(function(){
		//		console.log(article);
		//console.log($(article).find('span').attr('audio'));
				if( $(this).attr('resource')=='audio')
				{
		//			console.log(pos);
					pos.add({xtype:'audio',url:$(this).attr('src')});
				}
				if( $(this).attr('resource')=='video')
				{
					pos.add({xtype:'video',url:$(this).attr('src')});
				}
		//		if( $(this).attr('resource')=='image' )
		//		{
		//			html+='<img src="'+$(this).attr('src')+'"'+'/>';
		//		}
		//console.log(this.post);
		});
//		console.log(this.post);
		this.application.viewport.setActiveItem(this.post);
	
	},
	
	destroyView:function(options){
	
		options.view.destroy();
//		genLoaded=false;
		Ext.dispatch({
			controller:'Home',
			action:'renderHome'
		})
		
	},
	
	getPostIndex:function(){
		return postIndex;
	},
	
	showActionSheet:function(){
		if (!this.actions){
			this.actions=new Ext.ActionSheet({
				items:[
				{
					text:'I like it',
					ui:'confirm',
					itemId:'like',
					scope:this,
					handler:function(){
						this.setLike(+1);
					}
				},
				{
					text:"Reset my previous like choice",
					itemId:'neutral',
					scope:this,
					handler:function(){
						this.setLike(0);
					}
				},
				{
					text:"I don't like it",
					ui:'decline',
					itemId:'dislike',
					scope:this,
					handler:function(){
						this.setLike(-1);
					}
				},
				{
					text:'Replay',
					scope:this,
					handler:function(){
						this.replayToPost();
					}
				},
				{
					text:'Respam',
					scope:this,
					handler:function(){
						this.respamPost();
					}
				},
				{
					text:'Back',
					ui:'decline',
					scope:this,
					handler:function(){
					this.actions.hide();
//						Ext.dispatch({
//							controller:'PostAction',
//							action:'destroySheet',
//							view:this.up('postAction')
//						})
					}
				}]
			});
		}
		
		switch(likeChoice){
		
			case 0:
				this.actions.remove('neutral');
				break;
			case 1:
				this.actions.remove('like');
				break;
			case -1:
				this.actions.remove('dislike');
				break;		
		}
		
		this.actions.show();
	
	},
	
	setLike:function(value){
	
//		var value=options.value;

//		if(!genLoaded){
//			this.getPostgenerality();
//		}
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
	
//		if(!genLoaded){
//			var index=Ext.ControllerManager.get('Post').getPostIndex();
			var poststore=Ext.StoreMgr.get('poststore');
			var post=poststore.getAt(postIndex);
			
			var tmp=post.get('about').split("/");
			serverId=tmp[1];
			userId=tmp[2];
			postId=tmp[3];
			likeChoice=post.get('setlike');
			
//			genLoaded=true;
//			console.log(serverId, userId,postId,tmp,post.get('about'));
//		}
	
	},
	
	respamPost:function(){
	
//		if(!genLoaded){
//			this.getPostgenerality();
//		}
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

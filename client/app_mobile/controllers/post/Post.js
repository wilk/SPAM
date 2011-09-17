Ext.regController('Post',{

	init:function(){
			var postIndex,postView, userId, serverId, postId, likeChoice, postDate;
//			genLoaded=false;
		},

	showPost:function(options){
	
		postIndex=options.index;
		
		this.getPostgenerality();
		
		var record=options.post;
		var article=options.article;
	
//	console.log(record);
		this.post=this.render({xtype:'post',html:record});
		
//		this.post.down('#toolbarTitle').setTitle(options.user+' said');

		if (Ext.StoreMgr.get('loginstore').getCount()!=0){

			this.post.down('#postAction').setVisible(true);
		}
		else{
			this.post.down('#postAction').setVisible(false);
		}
		
		if($(article).find('span[id=geolocationspan]').length){
		
			this.post.down('#locate').show();
			console.log($(article).find('span[id=geolocationspan]').attr('lat'));
			console.log($(article).find('span[id=geolocationspan]').attr('long'));
		
		}
		
		this.post.doComponentLayout();
		
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
			postDate=post.get('date');
//			console.log(serverId, userId,postId,tmp,post.get('about'));
//		}
	
	},
	
	showPostGenerality:function(){
	
		Ext.Msg.alert('Post info','<p align="left"><b>serverId: </b>'+serverId+'<br/>'+'<b>userId: </b>'+userId+'<br />'+'<b>postId: </b>'+postId+'<br />'+'<b>date: </b>'+Date.parseDate(postDate,'c').format('d-m-Y H:i')+'</p>');
	
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
		
		Ext.dispatch({
			controller:'sendpost',
			action:'showNewPost',
			serverID:serverId,
			userID:userId,
			postID:postId,
			view:this.post
		})
	},
	
	showOnMap:function(options){
	
		var article=Ext.StoreMgr.get('poststore').getAt(postIndex).get('article');
		
		var lat=$(article).find('span[id=geolocationspan]').attr('lat');
		var lng=$(article).find('span[id=geolocationspan]').attr('long');
		
		Ext.dispatch({
			controller:'Map',
			action:'showMap',
			view:options.view,
			lat:lat,
			lng:lng
		});
		
//		Ext.dispatch({
//		
//			controller:'Map',
//			action:'centerMap',
//			lat:lat,
//			lng:lng
//		
//		});
	
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
						this.actions.hide();
					}
				},
				{
					text:"Reset my previous like choice",
					itemId:'neutral',
					scope:this,
					handler:function(){
						this.setLike(0);
						this.actions.hide();
					}
				},
				{
					text:"I don't like it",
					ui:'decline',
					itemId:'dislike',
					scope:this,
					handler:function(){
						this.setLike(-1);
						this.actions.hide();
					}
				},
				{
					text:'Replay',
					scope:this,
					handler:function(){
						this.actions.hide();
						this.replayToPost();
					}
				},
				{
					text:'Respam',
					scope:this,
					handler:function(){
						this.respamPost();
						this.actions.hide();
					}
				},
				{
				
					text:'Follow user',
					ui:'confirm',
					itemId:'followButton',
					scope:this,
					handler:function(){
						this.actions.hide();
//						var value=1;
//						if(this.actions.down('#followButton').text!='Follow user'){
//							value=0;
//						}
						Ext.dispatch({
							controller:'followers',
							action:'setFollow',
							id:serverId+'/'+userId,
							value:1				
						})
					
					}
				
				},
				{
				
					text:'Unollow user',
					ui:'decline',
					itemId:'unfollowButton',
					scope:this,
					handler:function(){
						this.actions.hide();
//						var value=1;
//						if(this.actions.down('#followButton').text!='Follow user'){
//							value=0;
//						}
						Ext.dispatch({
							controller:'followers',
							action:'setFollow',
							id:serverId+'/'+userId,
							value:0				
						})
					
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
		var tmp=serverId+'/'+userId;
		if(Ext.StoreMgr.get('followersStore').findExact('follower',tmp)!=-1){
		
//			this.actions.down('#followButton').addManagedListener(this.actions.down('#followButton'),'tap',function(){
//			
//				this.actions.hide();
//			
//				Ext.dispatch({
//					
//					controller:'followers',
//					action:'setFollow',
//					id:tmp,
//					value:0
//					
//				})
//			},this);
			this.actions.down('#followButton').hide();
			this.actions.down('#unfollowButton').show();

//			this.actions.down('#followButton').setText('Unfollow user');
//			this.actions.down('#followButton').ui='decline';		
		}
		else{
		
//			this.actions.down('#followButton').addManagedListener(this.actions.down('#followButton'),'tap',function(){
//			
//				this.actions.hide();
//			
//				Ext.dispatch({
//					
//					controller:'followers',
//					action:'setFollow',
//					id:serverId+'/'+userId,
//					value:1
//					
//				})
//			},this);
			this.actions.down('#unfollowButton').hide();
			this.actions.down('#followButton').show();
//			this.actions.down('#followButton').setText('Follow user');
//			this.actions.down('#followButton').ui='confirm';		
		}
		
		this.actions.show();
	
	}

});

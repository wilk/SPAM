Ext.regController('Post',{

	init:function(){
			var postIndex,homeView, userId, serverId, postId, likeChoice, postDate;
			
			Ext.StoreMgr.get('loginstore').on('add',function(){
			
				if(this.post && this.post.down('#postAction')){
					this.post.down('#postAction').show();
					this.post.doComponentLayout();
				}
				
			},this);
//			genLoaded=false;
		},

	showPost:function(options){
	
		postIndex=options.index;
		homeView=options.view;
		
		this.getPostgenerality();
		
		var record=options.post;
		var article=options.article;
	
//	console.log(record);
		this.post=this.render({xtype:'post',html:record});
		
//		this.post.down('#toolbarTitle').setTitle(options.user+' said');

		if (Ext.StoreMgr.get('loginstore').getCount()!=0){

			this.post.down('#postAction').show();
		}
		else{
			this.post.down('#postAction').hide();
		}
		
		if($(article).find('span[id=geolocationspan]').length){
		
			this.post.down('#locate').show();
		
		}
		
//		this.post.doComponentLayout();

		this.application.viewport.setActiveItem(this.post);
	
	},
	
	destroyView:function(options){
	
		options.view.destroy();
//		genLoaded=false;
//		Ext.dispatch({
//			controller:'Home',
//			action:'renderHome'
//		})
		this.application.viewport.setActiveItem(homeView);
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
			
			success:function(response){
				Ext.Msg.alert(response.statusText,response.responseText);
				Ext.StoreMgr.get('poststore').getAt(postIndex).set('setlike',value);
				likeChoice=value;
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

		Ext.Ajax.request({
		
			method:'post',
			url:'respam',
			
			params:{serverID:serverId,
					userID:userId,
					postID:postId},
			
			success:function(response){
				Ext.Msg.alert(response.statusText,response.responseText);
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
					}
				}]
			});
		}
		
		switch(likeChoice){
		
			case 0:
				this.actions.down('#neutral').hide();
				this.actions.down('#dislike').show();
				this.actions.down('#like').show();
				break;
			case 1:
				this.actions.down('#like').hide();
				this.actions.down('#dislike').show();
				this.actions.down('#neutral').show();
				break;
			case -1:
				this.actions.down('#dislike').hide();
				this.actions.down('#like').show();
				this.actions.down('#neutral').show();
				break;		
		}
		var tmp=serverId+'/'+userId;
		if(Ext.StoreMgr.get('followersStore').findExact('follower',tmp)!=-1){
		
			this.actions.down('#followButton').hide();
			this.actions.down('#unfollowButton').show();	
		}
		else{

			this.actions.down('#unfollowButton').hide();
			this.actions.down('#followButton').show();
		}
		
		this.actions.show();
	
	}

});

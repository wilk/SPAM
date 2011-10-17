Ext.regController('Post',{

	init:function(){
		//variables used to share post's informations and filled by getPostgenerality method
			var postIndex,homeView, userId, serverId, postId, likeChoice, postDate;
		
		//listen on user login and if the post view is active show the action button	
			Ext.StoreMgr.get('loginstore').on('add',function(){
			
				if(this.post && this.post.down('#postAction')){
					this.post.down('#postAction').show();
					this.post.doComponentLayout();
				}
				
			},this);
		},

//method to render and activate post view
	showPost:function(options){
	
	//index of the post in the poststore passed by onItemdisclosure event handler in the home view
		postIndex=options.index;
	//previous view to go beck by pressing back button
		homeView=options.view;
	
	//retrive various post's information	
		this.getPostgenerality();
	
	//parsed post	
		var record=options.post;
	//raw post
		var article=options.article;
	
	//render and activate post view
		this.post=this.render({xtype:'post',html:record});

	//check if the user is logged in and show the action button
		if (Ext.StoreMgr.get('loginstore').getCount()!=0){

			this.post.down('#postAction').show();
		}
		else{
			this.post.down('#postAction').hide();
		}
	
	//if this post has geolocation coordinates show a button in the toolbar to center a map to his position	
		if($(article).find('span[id=geolocationspan]').length){
		
			this.post.down('#locate').show();
		
		}

		this.application.viewport.setActiveItem(this.post);
	
	},

//destroy this panel and show the previousView	
	destroyView:function(options){
	
		options.view.destroy();
		this.application.viewport.setActiveItem(homeView);
	},
	
	getPostIndex:function(){
		return postIndex;
	},
	
//send the user like choice to the server
//on success display a message to inform the user and set the setlike model field
	setLike:function(value){
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
	
//retrive general post's informations using post's index in the poststore
	getPostgenerality:function(){
	
			var poststore=Ext.StoreMgr.get('poststore');
			var post=poststore.getAt(postIndex);
			
			var tmp=post.get('about').split("/");
			serverId=tmp[1];
			userId=tmp[2];
			postId=tmp[3];
			likeChoice=post.get('setlike');
			postDate=post.get('date');
	
	},
	
//display a message showing general informations like user id, server id, post id and date
	showPostGenerality:function(){
	
		Ext.Msg.alert('Post info','<p align="left"><b>serverId: </b>'+serverId+'<br/>'+'<b>userId: </b>'+userId+'<br />'+'<b>postId: </b>'+postId+'<br />'+'<b>date: </b>'+Date.parseDate(postDate,'c').format('d-m-Y H:i')+'</p>');
	
	},
	
//respam this post sending server id, user id and post id to the server
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

//show the new post view to write a replay to this post
//post's informations and a reference to this view are passed to allow the replay and/or return to this view 	
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
	
//scan the raw post to retrive geolocation coordinates and call a method to render a centered map to this coordinates
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
	
//show a series of buttons to call methods to interact with this post
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
							value:1,
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
		
	//look the user like choice to hide/show like, dislike and neutral buttons
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
		
	//check if this post's author is already in the followers list and show or hide the follow and unfollow buttons	
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

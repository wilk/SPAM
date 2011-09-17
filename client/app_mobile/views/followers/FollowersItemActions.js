mspam.views.FollowersItemActions=Ext.extend(Ext.Panel,{

	floating:true,
	modal:true,
	centered:true,
	styleHtmlContent:true,
	width:300,
	height:200,
	dockedItems:[{
		itemId:'titleToolbar',
		dock:'top',
		xtype:'toolbar',
	}],
	
//	html:'tap outside this message box to do nothing',
	
	items:[{
		
		xtype:'container',
		html:"<p align=\"center\"><b>View all user's posts</b></p>",
		items:[{
			xtype:'button',
			text:'Search posts',
			ui:'confirm',
			handler:function(){
				this.up('followerItemActions').hide();
				Ext.StoreMgr.get('poststore').getProxy().url='search/10/author/'+this.up('followerItemActions').down('#titleToolbar').title,
				Ext.dispatch({
					controller:'Home',
					action:'renderHome'
				})
			}
		}]
	},
	{
		xtype:'container',
		html:"<p align=\"center\"><b>Unfollow this user</b></p>",
		items:[{
			xtype:'button',
			text:'Unfollow user',
			ui:'decline',
//			scope:this,
			handler:function(){
//			console.log(this);
				this.up('followerItemActions').hide();
				Ext.dispatch({
				
					controller:'followers',
					action:'setFollow',
					id:this.up('followerItemActions').down('#titleToolbar').title,
					value:0
				
				})
			}
		}]
	}]

});
Ext.reg('followerItemActions',mspam.views.FollowersItemActions);

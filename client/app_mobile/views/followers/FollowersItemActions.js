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
	
	items:[{
		
		xtype:'container',
		html:"<p align=\"center\"><b>View user's posts</b></p>",
		items:[{
			xtype:'button',
			text:'Search posts',
			ui:'confirm',
			handler:function(){

				this.up('followerItemActions').hide();
				Ext.dispatch({
				controller:'search',
				action:'showSearchForm',
				view:Ext.getCmp('followview'),
				type:'author',
				term:this.up('followerItemActions').down('#titleToolbar').title
				});

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
			handler:function(){
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

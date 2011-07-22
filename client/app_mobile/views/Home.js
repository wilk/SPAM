mspam.views.Home=Ext.extend(Ext.Panel,{

	layout:'card',

//	fullscreen:true,
	initComponent:function(){
	
	
	this.dockedItems=[
//	{
//	
//		xtype:'toolbar',
//		dock:'bottom',
//		ui:'light',
//		itemId:'loginToolbar',
//		layout:{
//			pack:'center'
//		},
//		
//		items:[
//			{
//				iconCls:'user',
//				iconMask:true,
//				text:'Login',
//				ui:'plain',
//				handler:function(){
//					Ext.dispatch({
//						controller:'Login',
//						action:'displayLogin'
//					})
//				}
//			}
//		]
//	},
	{
		itemId:'titleToolbar',
		xtype:'toolbar',
		dock:'top',
		ui:'light',
		title:'Spam',
		items:[
		{
			xtype:'spacer'
		},
		{
			iconCls:'settings',
			iconMask:true,
			ui:'plain',
			handler:function(){
				Ext.dispatch({
					controller:'menu',
					action:'showSettingsSheet'
				})
			}
		},
		{
			iconCls:'search',
			iconMask:true,
			ui:'plain',
			handler:function(){
				Ext.dispatch({
					controller:'search',
					action:'showSearchForm'
				})
			}
		}]
	}];
	
//		this.fullscreen=true,
	
		this.store=new Ext.data.Store({model:'Post',storeId:'poststore'});
		
		this.list=new Ext.List({
//			itemId:'postList',
			styleHtmlContent:true,
			fullscreen:true,
			itemTpl:'{html}',
			store:this.store,
//			listener:{
//				afterrender:
//				Ext.dispatch({
//					controller:'Home',
//					action:'getSearchResponse',
//					store:this.store
//				})
////				Ext.ControllerManager.get('Home').getSearchResponse(this.store)
//			},
			onItemDisclosure:function(rec, node, index, e){
				Ext.dispatch({
					controller:'Post',
					action:'showPost',
					post:rec.data.html,
					article:rec.data.article,
					user:rec.data.user,
					index:index
				});
//				Ext.ControllerManager.get('Home').showPost(rec.data.html, rec.data.article)
			}
		});
		
		this.items=[this.list];
	
		mspam.views.Home.superclass.initComponent.apply(this,arguments);
		
	}

	
});
Ext.reg('home',mspam.views.Home);

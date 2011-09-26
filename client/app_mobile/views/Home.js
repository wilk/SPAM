mspam.views.Home=Ext.extend(Ext.Panel,{

	layout:'card',

//	fullscreen:true,
//	initComponent:function(){
	
	
	dockedItems:[
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
			iconCls:'refresh',
			iconMask:true,
			ui:'plain',
			handler:function(){
				Ext.dispatch({
					controller:'Home',
					action:'getSearchResponse'
				});
			}
		},
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
					action:'showSettingsSheet',
					view:this.up('home')
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
					action:'showSearchForm',
					view:this.up('home')
				})
			}
		}]
	}]
	
//		this.fullscreen=true,
	
//		if(!Ext.StoreMgr.get('poststore')){
//		this.store=new Ext.data.Store({model:'Post',storeId:'poststore'});
//		}
//		else{
//		
//			this.store=Ext.StoreMgr.get('poststore');
//		
//		}
//		this.list=new Ext.List({
////			itemId:'postList',
//			styleHtmlContent:true,
//			fullscreen:true,
//			itemTpl:'{html}',
//			store:this.store,
////			listener:{
////				afterrender:
////				Ext.dispatch({
////					controller:'Home',
////					action:'getSearchResponse',
////					store:this.store
////				})
//////				Ext.ControllerManager.get('Home').getSearchResponse(this.store)
////			},
//			onItemDisclosure:function(rec, node, index, e){
//				Ext.dispatch({
//					controller:'Post',
//					action:'showPost',
//					post:rec.data.html,
//					article:rec.data.article,
//					user:rec.data.user,
//					index:index
//				});
////				Ext.ControllerManager.get('Home').showPost(rec.data.html, rec.data.article)
//			}
//		});
		
//		this.items=[this.list];
//	
//		mspam.views.Home.superclass.initComponent.apply(this,arguments);
//		
//	}

	
});
Ext.reg('home',mspam.views.Home);

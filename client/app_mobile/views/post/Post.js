mspam.views.Post=Ext.extend(Ext.Panel,{

	fullscreen:true,
	styleHtmlContent:true,
	autoDestroy:false,
	layout:'card',
	initComponent:function(){
	
//	this.on('deactivate',function(){this.destroy();});
	
this.dockedItems=[{

		itemId:'toolbarTitle',
		xtype:'toolbar',
		dock:'top',
		ui:'light',
		title:'Mspam',
		items:[
		{
			text:'Back',
			ui:'back',
			handler:function(){
				Ext.dispatch({
					controller:'Post',
					action:'destroyView',
					view:this.up('post')
					
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
					view:this.up('post')
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
					view:this.up('post')
				})
			}
		}]
	},{
	
		itemId:'postAction',
		xtype:'toolbar',
		dock:'bottom',
		height:'35',
		layout:{type:'vbox',align:'stretch'},

		items:[{

			text:'actions',
			ui:'confirm',
			handler:function(){
				Ext.dispatch({
					controller:'Post',
					action:'showActionSheet'
				});
			}
		}]
	
	}];
	
		
		mspam.views.Post.superclass.initComponent.apply(this,arguments);
	}

});
Ext.reg('post',mspam.views.Post);

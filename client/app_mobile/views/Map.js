mspam.views.Map=Ext.extend(Ext.Panel,{

//	fullscreen:true,
//	layout:'fit',
	
	dockedItems:[{
		itemId:'titleToolbar',
		xtype:'toolbar',
		dock:'top',
		ui:'light',
		title:'Map',
		items:[
		{
			text:'Back',
			ui:'back',
			handler:function(){
				Ext.dispatch({
					controller:'Map',
					action:'destroyView'
					
				});
			}
		},
		{
			xtype:'spacer'
		},
		{
		
			iconCls:'locate',
			iconMask:true,
			ui:'plain',
			handler:function(){
			
				Ext.dispatch({
				
					controller:'Map',
					action:'centerMap'
				
				})
			
			}
		
		},
		{
			iconCls:'settings',
			iconMask:true,
			ui:'plain',
			handler:function(){
				Ext.dispatch({
					controller:'menu',
					action:'showSettingsSheet',
					view:this.up('Map')
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
					view:this.up('Map'),
//					historyUrl:'spam/search'
				})
			}
		}]
	}],
	
	items:[{
		
		xtype:'map',
		id:'mapid',
		useCurrentLocation:true,
//		listeners:{
//			centerchange:function(t,m,c){
//				console.log(m+'----------'+c);
//			},
//			zoomchange:function(t,m,z){
//				console.log(m+'----------'+z);
//			}
//		}
//		fullscreen:true
		
	}]

});
Ext.reg('Map',mspam.views.Map);

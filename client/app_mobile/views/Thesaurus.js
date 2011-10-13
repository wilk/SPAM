mspam.views.Thesaurus=Ext.extend(Ext.Panel,{

	layout:{
		type:'card',
//		align:'stretch',
	},
	listeners:{
	
		parentterm:function(father){
									
									var parent=father.split('/');
									parent=parent[parent.length-1];
									this.down('textfield').setValue(parent+'/');
									
								},
								
		loggedin:function(){
					console.log('loggedin');
						if(this.down('textfield').getValue()!=''){
						
							var parent=this.down('textfield').getValue()
							Ext.ControllerManager.get('thesaurus').getChildren(parent.substr(0,parent.length-1));
						
						}
						this.down('textfield').enable('true');
						this.down('#submit').enable(true);					
					},
		
		loggedout:function(){
					console.log('loggedout');
					this.down('textfield').disable(true);
					this.down('#submit').disable(true);
					
				}		
		
	
	},

	dockedItems:[{
		xtype:'toolbar',
		dock:'top',
		title:'Thesaurus',
		items:[{
					text:'Back',
					ui:'back',
					handler:function(){
						Ext.dispatch({
							controller:'thesaurus',
							action:'backOrParent'						
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
							view:this.up('thesaurus')
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
							view:this.up('thesaurus'),
						})
					}
				}
		]
	},{
	
		xtype:'toolbar',
		dock:'bottom',
		itemId:'newterm',
//		hidden:'true',
		layout:{
			type:'hbox',
			pack:'justify'
		},
		items:[{
		
			xtype:'textfield',
			disabled:true
		
		},{
			xtype:'button',
			text:'submit',
			itemId:'submit',
			ui:'confirm',
			disabled:true,
//			scope:this,
			handler:function(){
				var strs=this.up('toolbar').down('textfield').getValue().split('/');
				var parent=strs[0];
				var term=strs[1];
				Ext.dispatch({
					controller:'thesaurus',
					action:'addterm',
					parent:parent,
					term:term
				})
			}
		}]
	
	}],
	
	items:[{
	
		xtype:'list',
		itemId:'list',
		store:'thesaurustore',
		itemTpl:'{preflabel}',
		onItemDisclosure:function(rec, node, index, e){
			Ext.dispatch({
				controller:'thesaurus',
				action:'getChildren',
				rec:rec
			})
		}
	
	}]

});
Ext.reg('thesaurus',mspam.views.Thesaurus);

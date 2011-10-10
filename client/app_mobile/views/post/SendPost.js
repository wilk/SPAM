mspam.views.SendPost=Ext.extend(Ext.form.FormPanel,{
//layout:'card',
//align:'stretch',
//pack:'center',
	scroll:'vertical',

	dockedItems:[{
		xtype:'toolbar',
		itemId:'titleToolbar',
		dock:'top',
		title:'New post',
		ui:'light',
		items:[{
			
			text:'Back',
			ui:'back',
			handler:function(){
				Ext.dispatch({
					controller:'sendpost',
					action:'previousView'
				});
			}
			
		}]
	}],
	
	items:[{
		xtype:'fieldset',
		title:'Write a new post',
		itemId:'fieldset',
//		fullscreen:true,
		items:[{
			xtype:'textareafield',
			name:'newpost',
			itemId:'newpost',
			autoComplete:true
		}]
	},{
		
			xtype:'button',
			text:'submit',
			ui:'confirm',
			handler:function(){
				Ext.dispatch({
					controller:'sendpost',
					action:'getTextAreaContent'
//					text:this.up('sendpost').down('fieldset').down('newpost')
				});
			}
		
	}]
});
Ext.reg('sendpost',mspam.views.SendPost);

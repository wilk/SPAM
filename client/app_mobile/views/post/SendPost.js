mspam.views.SendPost=Ext.extend(Ext.form.FormPanel,{

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
		items:[{
			xtype:'textareafield',
			name:'newpost',
			itemId:'newpost',
		//show the android auto complete	
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
				});
			}
		
	}]
});
Ext.reg('sendpost',mspam.views.SendPost);

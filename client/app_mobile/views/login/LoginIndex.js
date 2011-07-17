mspam.views.LoginIndex=Ext.extend(Ext.form.FormPanel,{

	layout: 'vbox',
	align:'stretch',
	pack:'center',
	styleHtmlContent:true,
	
	initComponent:function(){
	
		
	
	
		this.dockedItems=[{
			xtype:'toolbar',
			dock:'top',
			title:'Mspam'			
		}];
		
		this.items=[
		
		{html:'Enter as'},
		
		{
		
			xtype:'button',
			ui:'round',
			text:'Anonimous',
			itemId:'anonimousButton',
			handler:function(){
				var view=this.up('loginindex');
				Ext.dispatch({
					controller:'Login',
					action:'anonimousUser'
//					loginView:view
				})
			}
		},
		
		{html:'Or'},
		
		{
		
			xtype:'textfield',
			required:true,
			name:'username',
			placeHolder:'username',
			itemId:'loginTextField'
			
		},{
		
			xtype:'button',
			ui:'round',
			text:'Login',
			margin:20,
			itemId:'loginButton',
			handler:function(){
				var view=this.up('loginindex');
				Ext.dispatch({
					controller:'Login',
					action:'loginUser',
					loginView:view
				})
			}
			
		}];
	
		mspam.views.LoginIndex.superclass.initComponent.apply(this, arguments);
	}
});
Ext.reg('loginindex',mspam.views.LoginIndex);

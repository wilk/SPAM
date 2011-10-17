mspam.views.Search=Ext.extend(Ext.form.FormPanel,{

	styleHtmlContent:true,
	scroll:'vertical',
	
	dockedItems:[{
		xtype:'toolbar',
		itemId:'titleToolbar',
		dock:'top',
		title:'Search',
		ui:'light',
		items:[{
			
			text:'Back',
			ui:'back',
			handler:function(){
				Ext.dispatch({
					controller:'search',
					action:'previousView'
				});
			}
			
		}]
	},
	],

	items:[{
		xtype:'fieldset',
		title:'Search terms',
		instructions:'To search recents post you can leave the search field empty or type an argument of your choice',
		items:[{
			xtype:'textfield',
			label:'Search',
			name:'value',
			itemId:'value',
			required:true
		},{
			xtype:'selectfield',
			label:'type',
			name:'type',
			itemId:'type',
			value:'recent',
			listeners:{
				'change':function(field,value){Ext.dispatch({
					controller:'search',
					action:'selectchange',
					type:value
				});}
			},
			options:[{
				text:'Author',
				value:'author',
			},{
				text:'Following',
				value:'following'
			},{
				text:'Recent',
				value:'recent'
			},{
				text:'Related',
				value:'related'
			},{
				text:'Fulltext',
				value:'fulltext'
			},{
				text:'Affinity',
				value:'affinity'
			}]
		},{
			xtype:'numberfield',
			label:'Limit',
			name:'limit',
			itemId:'limit',
			value:10,
			minValue:1
		}]
	},{
		
			xtype:'button',
			text:'submit',
			ui:'confirm',
			handler:function(){
				Ext.dispatch({
					controller:'search',
					action:'submitSearch'
				});
			}
		
	}]

});
Ext.reg('search',mspam.views.Search);

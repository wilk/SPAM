Ext.define('SC.store.Servers',{
	extend:'Ext.data.Store',
	model:'SC.model.Server',
	pageParam:'undefined',
	sorters: {
		property: 'serverID' ,
		direction: 'ASC'
	} ,
	proxy: {
		
		type: 'ajax',
		url: 'servers',
		limitParam:undefined,
		pageParam:undefined,
		startParam:undefined,
		noCache:false,
		reader:{
			type:'xml',
			root:'servers',
			record:'server'
		},
		writer:{
			type:'xml',
			documentRoot:'servers',
			record:'server'
		}
	}
});

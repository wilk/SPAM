Ext.define('SC.store.Servers',{
	extend:'Ext.data.Store',
	model:'SC.model.Server',
	proxy: {
		
		type: 'ajax',
		url: 'app/data/serverAll.xml',
		limitParam:'undefined',
		pageParam:'undefined',
		startParam:'undefined',
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

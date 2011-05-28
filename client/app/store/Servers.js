Ext.define('SC.store.Servers',{
	extend:'Ext.data.Store',
	model:'SC.model.Server',
	//autoload:true,
	proxy: {
		
		type: 'ajax',
		url: 'app/data/serverAll.xml',
//		filterParam:'undefined',
		limitParam:'undefined',
		pageParam:'undefined',
		startParam:'undefined',
//		sortParam:'undefined',
//		directionParam:'undefined',
//		groupParam:'undefined',
		noCache:false,
		//api:{read:'data/server.xml'},
		reader:{
			type:'xml',
			root:'servers',
//			record:function(){Ext.DomQuery.selectValue('server[serverID]','null')}
			record:'server'
		},
		writer:{
			type:'xml',
			documentRoot:'servers',
			record:'server'
		}
	}
});

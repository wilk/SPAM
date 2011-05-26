Ext.define('SC.store.Servers',{
	extend:'Ext.data.Store',
	model:'SC.model.Server',
	autoload:true,
	proxy: {
		type: 'ajax',
		url: 'app/data/serverAll.xml',
		//api:{read:'data/server.xml'},
		reader:{
			type:'xml',
			root:'servers',
//			record:function(){Ext.DomQuery.selectValue('server[serverID]','null')}
			record:'server'
		},
		writer:{
			type:'xml',
			root:'server',
			record:'server'
		}
	}
});

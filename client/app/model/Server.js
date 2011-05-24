Ext.define('SC.model.Server',{
	extend: 'Ext.data.Model',
	fields:	['serverID']
//	proxy: {
//		type: 'ajax',
//		url: 'app/data/server.xml',
//		//api:{read:'data/server.xml'},
//		reader:{
//			type:'xml',
//			root:'servers',
//			record:'server'
//		}
//	}
});

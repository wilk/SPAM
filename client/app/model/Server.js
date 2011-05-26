Ext.define('SC.model.Server',{
	extend: 'Ext.data.Model',
	fields:	[{name:'serverID',mapping:'@serverID'}]
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

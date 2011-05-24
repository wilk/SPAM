Ext.define('SC.store.Servers',{
	extend:'Ext.data.Store',
	model:'SC.model.Server',
	autoload:true,
	proxy: {
		type: 'ajax',
		url: 'app/data/server.xml',
		//api:{read:'data/server.xml'},
		reader:{
			type:'xml',
			root:'servers',
			record:'server'
		}
	}
});

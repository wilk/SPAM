Ext.regModel("Server",{

	//PASTED FROM DESKTOP EDITION
	fields:	[{
		name: 'serverID' ,
		mapping: '@serverID',
//		convert:function(v,r){Ext.DomQuery.select('*@serverID');}
	} ],
	
	proxy: {
		
		type: 'ajax',
		url: 'lib/serv.xml',
		reader:{
			type:'xml',
			root:'servers',
			record:'server'
		},
		writer:{
			type:'xml',
			documentRoot:'servers',
			record:'[server]'
		}
	}
});

Ext.regModel("Server",{

	//PASTED FROM DESKTOP EDITION
	fields:	[{
		name: 'serverID' ,
		mapping: '@serverID',
//		convert:function(v,r){Ext.DomQuery.select('*@serverID');}
	},
	{
		name:'serverURL',
		mapping:'@serverURL'
	},
	{
		name:'enabled'
	} ],
	
	proxy: {
		
		type: 'ajax',
		url: 'servers',
		reader:{
			type:'xml',
			root:'servers',
			record:'server'
		}
	}
});

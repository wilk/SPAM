Ext.regModel('Post',{

	fields:[
//		{name:'post'}
		{name:'affinity'},
		{name:'article'},
		{name:'resource'},
		{name:'about'},
		{name:'like'},
		{name:'dislike'},
		{name:'setlike'},
		{name:'user'},
		{name:'html'}
	],
	
	proxy:{
		
		type:'ajax',
		
		//url dinamically set
		url:'lib_mobile/art4.xml',
//		url:'search/10/recent',
		reader:{
			type:'xml',
			record:'post',
			root:'archive'
		}
	}

});

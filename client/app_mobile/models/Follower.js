Ext.regModel("Follower",{

	fields:[{
		name:'follower',
		mapping:'@id'
	}],
	
	proxy:{
	
		type:'ajax',
		url:'followers',
//url:'lib_mobile/followers.xml',
		reader:{
		
			type:'xml',
			root:'followers',
			record:'follower'
		
		}
	
	}


});

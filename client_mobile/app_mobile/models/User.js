Ext.regModel('User',{

	field:[{name:'username'}],
//	idProperty:'username',
	proxy:{
		type:'localstorage',
		id:'loginstore'
	}
});

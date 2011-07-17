Ext.regModel('User',{

	fields:[{name:'username'}],
//	idProperty:'username',
	proxy:{
		type:'localstorage',
		id:'loginstore'
	}
});

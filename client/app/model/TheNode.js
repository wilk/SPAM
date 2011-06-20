Ext.define('SC.model.TheNode',{
	extend:'Ext.data.Model',
	fields:[{name:'text'}],
	proxy:{
		type:'localstorage',
		id:'localThesaurus'
	}
});

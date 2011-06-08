Ext.define('SC.store.Thesaurus',{	
	extend:'Ext.data.TreeStore',
	model:'SC.model.TheNode',
	proxy:{
		type:'localstorage',
		id:'localThesaurus'
	}
});

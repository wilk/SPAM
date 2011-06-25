// @file 	SendHashtag.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Hashtag tree panel

Ext.define ('SC.view.SendHashtag' , {
	extend: 'Ext.tree.Panel' ,
	alias: 'widget.sendhashtag' ,
	
	// Configuration
	title: 'Hashtag' ,
	bodyPadding: 2 ,
	rootVisible: true ,
	autoScroll: true ,
	flex:1,
	maxWidth: 150 ,
	store:'SendHashtag',
	root:{
		text:'Thesaurus',
		expanded:true
	}
});

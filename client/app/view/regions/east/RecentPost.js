// @file 	RecentPost.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Recent posts panel

Ext.define ('SC.view.regions.east.RecentPost' , {
	extend: 'Ext.grid.Panel' ,
	alias: 'widget.recentpost' ,
	
	store: 'regions.east.RecentPost' ,
	
	// Configuration
	title: 'Recent Post' ,
	id: 'gridRecentArticle' ,
	height: 260 ,
	scroll: false ,
	collapsible: true ,
	animCollapse: true ,
	anchor: '100%' ,
	layout: 'anchor' ,
	
	// Body
	columns: [{
		header: 'Articles' ,
		dataIndex: 'articleText' ,
		flex: 1
	}]
});

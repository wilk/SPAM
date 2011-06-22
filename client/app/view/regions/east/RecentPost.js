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
	autoWidth: true ,
	height: 265 ,
	collapsible: true ,
	animCollapse: true ,
	bodyPadding: 2 ,
	anchor: '100%' ,
	layout: 'anchor' ,
	
	// Body
	columns: [{
		header: 'Articles' ,
		dataIndex: 'article' ,
		flex: 1
	}]
});

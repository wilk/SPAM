// @file 	app.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Main application definition

Ext.application ({
	// namespace SC
	name: 'SC' ,
	
	// Controllers list
	controllers: [
		'regions.North' ,
		'regions.West' ,
		'regions.west.Search' ,
		'regions.west.Thesaurus' ,
		'regions.west.User' ,
		'regions.East' ,
		'regions.east.RecentPost' ,
		'regions.east.GeoLocation' ,
		'regions.Center' ,
		'regions.center.Articles' ,
		'regions.center.FocusArticle' ,
		'Send' ,
		'SendResource' ,
		'SelectPost' ,
		'Options'
	]
});

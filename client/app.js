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
		'regions.Center' ,
		'regions.East' ,
		'regions.east.RecentPost',
		'Send' ,
<<<<<<< HEAD
		'regions.center.Post',
		'regions.east.Server',
		'regions.center.ServerEdit'
=======
		'SendResource' ,
		'SelectPost' ,
		'regions.center.Post'
>>>>>>> f7a2e813019e6ee336d1e8f59e536758abfa2a5b
	]
});

// @file 	North.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	View of north region of Viewport

Ext.define ('SC.view.regions.North' , {
	extend: 'Ext.container.Container' ,
	alias: 'widget.northregion' ,
	
	// Configuration
	id: 'header' ,
	height: 30 ,
	region: 'north' ,
	html: '<h1>SPAM :: Social Production of Audiovisual Microblogs</h1>' ,
	
	// Body
	items: [{
		// Login textfield
		xtype: 'textfield' ,
		id: 'txtUsername' ,
		style: {
			position: 'absolute' ,
			right: '60px' ,
			top: '5px' ,
			bottom: '5px'
		} ,
		emptyText: 'username' ,
		allowBlank: false
	} , {
		// Login button
		xtype: 'button' ,
		text: 'Login' ,
		id: 'loginButton' ,
		// Button position (right)
		style: {
			position: 'absolute' ,
			right: '10px' ,
			top: '5px' ,
			bottom: '5px'
		} ,
	}]
});

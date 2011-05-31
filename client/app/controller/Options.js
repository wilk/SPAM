// @file 	Options.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of options view

Ext.define ('SC.controller.Options' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['Options'] ,
	
	// Configuration
	init: function () {
		var txtServerUrl;
		
		this.control ({
			// Init variables
			'options' : {
				afterrender : this.initVar ,
				hide : this.updateUrl
			} ,
			// Reset URL server text field
			'#btnOptionReset' : {
				click : this.resetFields
			}
		});

		console.log ('Controller North started.');
	} ,
	
	// @brief Initialize variables
	initVar : function (win) {
		txtServerUrl = win.down ('#tfServerUrl');
	} ,
	
	// @brief Update urlServerLtw global var
	updateUrl : function () {
		if (txtServerUrl.isValid ())
			urlServerLtw = txtServerUrl.getValue ();
		else
			// If isn't valid, reset field
			this.resetFields ();
	} ,
	
	// @brief Reset fields
	resetFields : function () {
		txtServerUrl.reset ();
	}
});

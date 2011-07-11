// @file 	SelectPost.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller select post view

Ext.define ('SC.controller.SelectPost' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['SelectPost'] ,
	
	// Configuration
	init: function () {
		this.control ({
			'#btnPostText' : {
				// Show text post view and hide select window
				click : function (button) {
					button.up('window').hide ();
					Ext.getCmp ('windowNewPost').show ();
				}
			} ,
			'#btnPostVideo' : {
				click : this.resourceHandler
			} ,
			'#btnPostAudio' : {
				click : this.resourceHandler
			} ,
			'#btnPostImage' : {
				click : this.resourceHandler
			} ,
			'#btnPostLink' : {
				click : this.resourceHandler
			}
		});
		
		console.log ('Controller SelectPost started');
	} ,
	
	// @brief Setup windowSendResource with the right entry
	resourceHandler : function (button) {
		var 	winRes = Ext.getCmp ('windowSendResource')
			winSel = button.up ('window');
		
		var btnGhost = Ext.getCmp ('resBtnGhost');
		
		switch (button.getId ()) {
			case 'btnPostVideo' :
				winRes.setTitle ('New video post');
				btnGhost.setText ('video');
				break;
			case 'btnPostAudio' :
				winRes.setTitle ('New audio post');
				btnGhost.setText ('audio');
				break;
			case 'btnPostImage' :
				winRes.setTitle ('New image post');
				btnGhost.setText ('image');
				break;
			case 'btnPostLink' :
				winRes.setTitle ('New link post');
				btnGhost.setText ('link');
				break;
		}
		
		winSel.hide ();
		winRes.show ();
	}
});

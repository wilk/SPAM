// @file 	North.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of view of north region of Viewport

Ext.define ('SC.controller.regions.North' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.North' , 'regions.west.User'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// Login button
			'#loginButton' : {
				click : this.userAuth
			} ,
			// New post button
			'#newPostButton' : {
				click : this.sendNewPost
			}
		});

		console.log ('Controller North started.');
	} ,
	
	// Login handler
	userAuth : function (button) {
		var 	fieldUser = Ext.getCmp ('userField') ,
			pUser = Ext.getCmp ('userPanel') ,
			bNewPost = Ext.getCmp ('newPostButton');
		
		// Check if user wants to login
		if (fieldUser.isVisible ()) {
			
			// Check if the form is filled or not
			if (fieldUser.isValid ()) {
		
				var txtUser = fieldUser.getValue ();
		
				// AJAX request to login
				Ext.Ajax.request ({
					url: 'login' ,
					params: [{
						'username': txtUser
					}] ,
					success: function (response) {
						button.setText ('Logout');
						
						fieldUser.setVisible (false);
					
						pUser.setTitle ('User :: ' + txtUser);
						pUser.setVisible (true);
						
						bNewPost.setVisible (true);
					} ,
					failure: function (error) {
						// Error 404 handled
						if (error.status == 404)
							Ext.Msg.alert ('Error ' + error.status , error.responseText);
					}
				});
			}
			else {
				Ext.Msg.alert ('Error' , 'To login: fill the box with your username.');
			}
		}
		// Check if user wants to logout
		else {
			bNewPost.setVisible (false);
			
			fieldUser.reset ();
			fieldUser.setVisible (true);
			
			pUser.setVisible (false);
			
			button.setText ('Login');
		}
	} ,
	
	// New post handler
	sendNewPost : function () {
		var postWindow = Ext.getCmp ('windowNewPost');
		postWindow.show ();
	}
});

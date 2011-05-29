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
			// Login text field
			'#userField' : {
				// Login at enter key press
				keypress : function (field , event) {
					if (event.getKey () == event.ENTER)
						userLogin (Ext.getCmp ('loginButton'));
				}
			} ,
			// Login button
			'#loginButton' : {
				click : userLogin
			} ,
			// New post button
			'#newPostButton' : {
				click : this.sendNewPost
			}
		});

		console.log ('Controller North started.');
	} ,
	
	// New post handler
	sendNewPost : function () {
		var selectPostWindow = Ext.getCmp ('windowSelectPost');
		selectPostWindow.show ();
	}
});

// @brief Permit user login
// @param button : the login button
function userLogin (button) {
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
				params: { username: txtUser } ,
				success: function (response) {
					// If server sets his cookies
					var userCookie = Ext.util.Cookies.get ('PHPSESSID');
					
					if (userCookie != null)					
						// Client sets its
						Ext.util.Cookies.set ('SPAMlogin' , txtUser);
					
					button.setText ('Logout');
					
					fieldUser.setVisible (false);
					
					pUser.setTitle ('User :: ' + txtUser);
					pUser.setVisible (true);
					
					bNewPost.setVisible (true);
				} ,
				failure: function (error) {
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
		// AJAX request to logout
		Ext.Ajax.request ({
			method: 'POST' ,
			url: 'logout' ,
			success: function (response) {
				bNewPost.setVisible (false);
		
				fieldUser.reset ();
				fieldUser.setVisible (true);
			
				pUser.setVisible (false);
			
				button.setText ('Login');
			} ,
			failure: function (error) {
				Ext.Msg.alert ('Error ' + error.status , error.responseText);
			}
		});
	}	
}

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
			// Init login with cookie
			'northregion' : {
				afterrender : this.initLogin
			} ,
			// Login text field
			'#userField' : {
				// Login at enter key press
				keypress : function (field , event) {
					if (event.getKey () == event.ENTER)
						this.userLogin ();
				}
			} ,
			// Login button
			'#loginButton' : {
				click : this.userLogin
			} ,
			// New post button
			'#newPostButton' : {
				click : this.sendNewPost
			} ,
			'#btnClientOption' : {
				click : this.showOptions
			}
		});
	} ,
	
	// @brief Initialize variables and login
	initLogin : function (northPanel) {
		// Variables initialization
		this.fieldUser = northPanel.down ('textfield');
		this.pUser = Ext.getCmp ('userPanel');
		this.bNewPost = northPanel.down ('#newPostButton');
		this.btnLogin = northPanel.down ('#loginButton');
		
		// If there is server cookie
		if (Ext.util.Cookies.get ('ltwlogin') != null)
		{
			// And if there is client cookie
			var userCookie = Ext.util.Cookies.get ('SPAMlogin');
		
			if (userCookie != null) {
				// Set login
				this.setLoginField (userCookie);
			}
		}
	} ,
	
	// @brief Login and logout user
	userLogin : function () {
		// Check if user wants to login
		if (this.fieldUser.isVisible ()) {
			
			// Check if the form is filled or not
			if (this.fieldUser.isValid ()) {
			
				var txtUser = this.fieldUser.getValue ();
				
				// Check if user setup a username with strange symbols
				if (txtUser.search (/[\. ,-\/!?$%\^&\*;:{}=\-_`~()]/g) == -1) {

					// AJAX request to login
					Ext.Ajax.request ({
						url: optionSin.getUrlServerLtw () + 'login' ,
						scope: this ,
						method: 'POST' ,
						params: { username: txtUser } ,
						success: function (response) {
							// If server sets his cookies
							var userCookie = Ext.util.Cookies.get ('ltwlogin');
						
							// Check if server has saved ltwlogin cookie
							if (userCookie != null)	{	
								// Client sets its
								Ext.util.Cookies.set ('SPAMlogin' , txtUser);
						
								// Setup login fields
								this.btnLogin.setText ('Logout');
						
								this.fieldUser.setVisible (false);
						
								this.pUser.setTitle ('User :: ' + txtUser);
								this.pUser.setVisible (true);
	
								this.bNewPost.setVisible (true);
						
								// Request extended thesaurus
								Ext.getCmp('thesaurusPanel').fireEvent ('afterrender');
								
								// Save username of current user
								optionSin.setCurrentUser (txtUser);
							}
							else {
								Ext.Msg.show ({
									title: 'Error' ,
									msg: 'Sorry, but cookie \'ltwlogin\' isn\'t been saved. Try again.' ,
									buttons: Ext.Msg.OK,
									icon: Ext.Msg.ERROR
								});
							}
						} ,
						failure: function (error) {
							Ext.Msg.show ({
								title: error.status + ' ' + errorSin.getErrorTitle (error.status) ,
								msg: errorSin.getErrorText (error.status) ,
								buttons: Ext.Msg.OK,
								icon: Ext.Msg.ERROR
							});
						}
					});
				}
				else {
					Ext.Msg.show ({
					title: 'Error' ,
					msg: 'Username must contain only characters and numbers (a-z, A-Z, 0..9)' ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
				}
			}
			else {
				// If fields are empty, show an error message
				Ext.Msg.show ({
					title: 'Error' ,
					msg: 'Fill the username box to login.' ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
		}
		// LOGOUT
		// Check if user wants to logout
		else {
			// AJAX request to logout
			Ext.Ajax.request ({
				method: 'POST' ,
				scope: this ,
				url: optionSin.getUrlServerLtw () + 'logout' ,
				success: function () {
					// Remove ltwlogin&SPAMlogin cookies
					Ext.util.Cookies.clear ('ltwlogin');
					Ext.util.Cookies.clear ('SPAMlogin');
					
					this.btnLogin.setText ('Login');
		
					this.fieldUser.reset ();
					this.fieldUser.setVisible (true);
	
					this.pUser.setVisible (false);
		
					this.bNewPost.setVisible (false);
					
					// Refresh articles windows
					articleSin.setLogoutButton ();
					
					// Request shared thesaurus
					Ext.getCmp('thesaurusPanel').fireEvent ('afterrender');
					
					// Reset to null username of the user
					optionSin.resetCurrentUser ();
				} ,
				failure: function (error) {
					Ext.Msg.show ({
							title: error.status + ' ' + errorSin.getErrorTitle (error.status) ,
							msg: errorSin.getErrorText (error.status) ,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
				}
			});
		}
	} ,
	
	// New post handler
	sendNewPost : function (button) {
		// Reset reply singleton
		replySin.setToReply (false);
		
		var selectPostWindow = Ext.getCmp ('windowSelectPost');
		selectPostWindow.show ();
	} ,
	
	showOptions: function (button) {
		Ext.getCmp('windowOptions').show ();
	} ,
	
	// @brief Setup login field
	// @param user : username
	setLoginField: function (user) {
		this.btnLogin.setText ('Logout');

		this.fieldUser.setVisible (false);
	
		this.pUser.setTitle ('User :: ' + user);
		this.pUser.setVisible (true);
	
		this.bNewPost.setVisible (true);
	}
});

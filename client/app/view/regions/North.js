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
	height: 30 ,
	region: 'north' ,
	html: '<h1 id="headerTitle" onclick="clickTitle ();" style="font-size: 16px; color: #fff; font-weight: normal; padding: 5px 10px;">SPAM :: Social Production of Audiovisual Microblogs</h1>' ,
	style: {
		background: '#7F99BE url(ext/resources/images/layout-browser-hd-bg.gif) repeat-x center'
	} ,
	bodyPadding: '5 5 5 0' ,
	
	// Body
	items: [{
		// New Post button
		xtype: 'button' ,
		id: 'newPostButton' ,
		text: 'New Article' ,
		hidden: true ,
		style: {
			position: 'absolute' ,
			right: '125px' ,
			top: '5px' ,
			bottom: '5px'
		}
	} , {
		// Login textfield
		xtype: 'textfield' ,
		id: 'userField' ,
		style: {
			position: 'absolute' ,
			right: '120px' ,
			top: '5px' ,
			bottom: '5px'
		} ,
		emptyText: 'username' ,
		allowBlank: false ,
		enableKeyEvents: true
	} , {
		// Login button
		xtype: 'button' ,
		text: 'Login' ,
		id: 'loginButton' ,
		// Button position (right)
		style: {
			position: 'absolute' ,
			right: '70px' ,
			top: '5px' ,
			bottom: '5px'
		}
	} , {
		xtype: 'button' ,
		id: 'btnClientOption' ,
		text: 'Options' ,
		style: {
			position: 'absolute' ,
			right: '10px' ,
			top: '5px' ,
			bottom: '5px'
		}
	}]
});

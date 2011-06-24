// @file 	Send.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Widget window for sending new posts

Ext.define ('SC.view.Send' , {
	extend: 'Ext.window.Window' ,
	alias: 'widget.send' ,
	
	// Configuration
	title: 'New post' ,
	id: 'windowNewPost' ,
	minHeight: 150 ,
	minWidth: 200 ,
	height: 250 ,
	width: 450 ,
	maximizable: true ,
	// On top of any content
	modal: true ,
	bodyPadding: 10 ,
	closeAction: 'hide' ,
	// Horizontal box layout
	layout: {
		type: 'hbox' ,
		pack: 'start' ,
		align: 'stretch'
	} ,
	
	// Body
	items: [{
		// Hashtag grid
		xtype: 'grid' ,
		flex: 1 ,
		maxWidth: 150 ,
		forceFit: true ,
		store: 'Thesaurus' ,
		columns: [{
			header: 'Hashtag' ,
			dataIndex: 'text'
		}]
	} , {
		// Text area
		xtype: 'textareafield' ,
		id: 'txtAreaSend' ,
		flex: 2 ,
		emptyText: 'Type you text here ...' ,
		allowBlank: false ,
		enforceMaxLenght: true ,
		maxLenght: 140 ,
		enableKeyEvents: true
	}] ,
	// Bottom buttons
	dockedItems: [{
		xtype: 'toolbar' ,
		dock: 'bottom' ,
		ui: 'footer' ,
		// Items right-justified
		items: [{
			// Geolocation
			xtype: 'checkbox' ,
			id: 'chkSendGeoLoc' ,
			boxLabel: 'Use Geolocation'
		} , '->' , {
			// Chars counter label
			xtype: 'label' ,
			text: '140', 
			id: 'sendCharCounter' ,
			margin: '0 5 0 0'
		} , {
			// Button reset
			text: 'Reset' ,
			id: 'buttonReset'
		} , {
			// Button send
			text: 'Send' ,
			id: 'buttonSend'
		}]
	}]
});

// @file 	SendResource.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Widget window for sending new posts

Ext.define ('SC.view.SendResource' , {
	extend: 'Ext.window.Window' ,
	alias: 'widget.sendresource' ,
	
	// Configuration
	id: 'windowSendResource' ,
	minHeight: 150 ,
	minWidth: 200 ,
	height: 240 ,
	width: 450 ,
	maximizable: true ,
	// On top of any content
	modal: true ,
	layout: 'anchor' ,
	bodyPadding: 10 ,
	closeAction: 'hide' ,
	
	// Body
	items: [{
		xtype: 'textfield' ,
		id: 'txtResourceUrl' ,
		fieldLabel: 'URL ' ,
		labelAlign: 'top' ,
		emptyText: 'http://www.resource.org/' ,
		allowBlank: false ,
		// Only width anchor
		anchor: '100%' ,
		enableKeyEvents: true
	} , {
		xtype: 'textareafield' ,
		id: 'txtResourceDescription' ,
		fieldLabel: 'Description (optional) ' ,
		labelAlign: 'top' ,
		emptyText: 'Type resource description here ...' ,
		enforceMaxLenght: true ,
		maxLenght: 140 ,
		anchor: '100%' ,
		enableKeyEvents: true ,
		plugins: new InsertAtCursorTextareaPlugin ()
	} , {
		// Combo Hashtag
		xtype: 'combo' ,
		id: 'sendResourceComboHashtag' ,
		displayField: 'term' ,
		anchor: '100%' ,
		store: 'ComboThesaurus' ,
		queryMode: 'local' ,
		typeAhead: true
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
			id: 'chkResGeoLoc' ,
			boxLabel: 'Use Geolocation'
		} , '->' , {
			// Chars counter label
			xtype: 'label' ,
			text: '140', 
			id: 'lblResCounter' ,
			margin: '0 5 0 0'
		} , {
			// Button reset
			text: 'Reset' ,
			id: 'btnResReset'
		} , {
			// Button send
			text: 'Send' ,
			id: 'btnResSend'
		} , {
			// Ghost button for knowing resource type
			id: 'resBtnGhost' ,
			hidden: true
		}]
	}]
});

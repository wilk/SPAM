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
		type: 'vbox' ,
		pack: 'start' ,
		align: 'stretch'
	} ,
//	layout: 'anchor' ,
	
	// Body
	items: [
		// TODO: textarea to display the content of an article to reply
//	{
//		xtype: 'textareafield' ,
//		id: 'txtAreaReply' ,
//		flex: 1 ,
//		disable: true ,
//		hidden: true
//	} , 
	{
		// TODO: use htmleditor instead of normal textarea
		// Text area
		xtype: 'textareafield' ,
		//xtype: 'htmleditor' ,
		id: 'txtAreaSend' ,
		inputId: 'taSend' ,
		flex: 1 ,
		//anchor: '100% 70%' ,
		emptyText: 'Type you text here ...' ,
		allowBlank: false ,
		enforceMaxLenght: true ,
		maxLenght: 140 ,
		enableKeyEvents: true
	}
//	 , {
//		// TODO: it's a treestore, maybe some problems?
		// TODO: combobox for autocomplete
//		xtype: 'combo' ,
//		id: 'sendComboHashtag' ,
//		displayField: 'text' ,
////		width: 500 ,
//		flex: 1 ,
//		store: 'Thesaurus' ,
//		queryMode: 'local' ,
//		typeAhead: true ,
//		hidden: true
//	}
	] ,
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

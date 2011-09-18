// @file 	SelectPost.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Widget window for choosing types of new posts

Ext.define ('SC.view.SelectPost' , {
	extend: 'Ext.window.Window' ,
	alias: 'widget.selectpost' ,
	
	// Configuration
	title: 'Select type of new post' ,
	id: 'windowSelectPost' ,
//	height: 195 ,
	height: 230 ,
	width: 740 ,
	resizable: false ,
	// On top of any content
	modal: true ,
	layout: 'anchor' ,
	bodyPadding: 10 ,
	closeAction: 'hide' ,
	
	// Body
	items: {
		xtype: 'buttongroup' ,
		columns: 5 ,
		items: [{
			// Text
			id: 'btnPostText' ,
			cls: 'x-btn-text-icon' ,
			width: 140 ,
			height: 140 ,
			text: '.' ,
			icon: 'ext/resources/images/btn-icons/text.png' ,
			iconAlign: 'top'
		} , {
			// Video
			id: 'btnPostVideo' ,
			cls: 'x-btn-text-icon' ,
			width: 140 ,
			height: 140 ,
			text: '.' ,
			icon: 'ext/resources/images/btn-icons/video.png' ,
			iconAlign: 'top'
		} , {
			// Audio
			id: 'btnPostAudio' ,
			cls: 'x-btn-text-icon' ,
			width: 140 ,
			height: 140 ,
			text: '.' ,
			icon: 'ext/resources/images/btn-icons/audio.png' ,
			iconAlign: 'top'
		} , {
			// Image
			id: 'btnPostImage' ,
			cls: 'x-btn-text-icon' ,
			width: 140 ,
			height: 140 ,
			text: '.' ,
			icon: 'ext/resources/images/btn-icons/image.png' ,
			iconAlign: 'top'
		} , {
			// Link
			id: 'btnPostLink' ,
			cls: 'x-btn-text-icon' ,
			width: 140 ,
			height: 140 ,
			text: '.' ,
			icon: 'ext/resources/images/btn-icons/link.png' ,
			iconAlign: 'top'
		}]
	} ,
	
	// Docked buttons
	dockedItems: {
		xtype: 'toolbar' ,
		dock: 'bottom' ,
		ui: 'footer' ,
		defaults: {
			xtype: 'label' ,
			style: {
				fontSize: '2em' ,
				color: 'grey'
			}
		} ,
		items: [{
			// Text
			text: 'Text' ,
			margin: '0 0 0 27'
		} , {
			// Video
			text: 'Video' ,
			margin: '0 0 0 45'
		} , {
			// Audio
			text: 'Audio' ,
			margin: '0 0 0 35'
		} , {
			// Image
			text: 'Image' ,
			margin: '0 0 0 42'
		} , {
			// Link
			text: 'Link' ,
			margin: '0 0 0 52'
		}]
	}
});

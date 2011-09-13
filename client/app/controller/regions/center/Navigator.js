// @file 	Navigator.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of focus article view

Ext.define ('SC.controller.regions.center.Navigator' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.center.Navigator'] ,
	
	stores: ['regions.center.Articles'] ,
	models: ['regions.center.Articles'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// Window render
			'navigatorwin': {
				afterrender: this.initialize ,
				show: this.resetVars ,
				hide: this.checkValidity
			} ,
			// First
			'navigatorwin button[tooltip="First"]': {
				click: this.goFirst
			} ,
			// Previous
			'navigatorwin button[tooltip="Previous"]': {
				click: this.goPrev
			} ,
			// Next
			'navigatorwin button[tooltip="Next"]': {
				click: this.goNext
			} ,
			// Last
			'navigatorwin button[tooltip="Last"]': {
				click: this.goLast
			} ,
		});
	} ,
	
	// Initialize local vars
	initialize: function (win) {
		// Window
		this.win = win;
		
		// Buttons
		this.firstBtn = win.down('button[tooltip="First"]');
		this.prevBtn = win.down('button[tooltip="Previous"]');
		this.nextBtn = win.down('button[tooltip="Next"]');
		this.lastBtn = win.down('button[tooltip="Last"]');
		
		// Store
		this.articleStore = this.getRegionsCenterArticlesStore ();
		this.localStore = Ext.create ('Ext.data.Store' , {
			model: 'SC.model.regions.center.Articles'
		});
		
		// Range
		this.range = null;
		
		// Show on top when mouse over
		win.getEl().on ({
			mouseenter: function (event, el) {
				this.toFront ();
			} ,
			scope: win
		});
		
		this.currentPage = 0;
	} ,
	
	// Reset all local vars
	resetVars: function (win) {
		this.articleCounter = this.articleStore.getCount ();
		
		// Get the pages number
		// E.g.: 130 articles, 15 per page
		// num page = (130 / 15) + 130 - (130 / 15) * 15
		// It takes also the last one
		this.articlePages = Math.floor (this.articleCounter / optionSin.getNavigatorNumber ()) + this.articleCounter - (Math.floor (this.articleCounter / optionSin.getNavigatorNumber ()) * optionSin.getNavigatorNumber ());
		
		// Position centered on bottom
		win.setPosition ((Ext.getCmp('centReg').getWidth () / 2) - 85 , Ext.getCmp('centReg').getHeight () - 55);
		
		// Navigator [1 of 35 (pages)]
		win.setTitle ('Navigator [' + (this.currentPage + 1) + ' of ' + this.articlePages + ']');
	} ,
	
	// Check if the navigator has to hide or not
	checkValidity: function (win) {
		// Don't hide if the store counter is still high
		// Hide only if it's a new search
		if ((this.articleStore.getCount () > optionSin.getNavigatorNumber ()) 
		&& (this.articleStore == this.getRegionsCenterArticlesStore ()) 
		&& (this.articleStore.getCount () == this.articleCounter)) {
			win.show ();
		}
		else {
			// Reset all if it's a complete new different search
			this.currentPage = 0;
			this.firstBtn.disable ();
			this.prevBtn.disable ();
			this.nextBtn.enable ();
			this.lastBtn.enable ();
		}
	} ,
	
	// Go to the first N articles
	goFirst: function (button) {
		// Update current page
		this.currentPage = 0;
		
		// Update navigator buttons
		button.disable ();
		this.prevBtn.disable ();
		if (this.lastBtn.isDisabled ()) this.lastBtn.enable ();
		if (this.nextBtn.isDisabled ()) this.nextBtn.enable ();
		
		// Retrieve articles from the articlesStore
		this.range = this.articleStore.getRange (0, optionSin.getNavigatorNumber ());
		
		// And fill the new store
		this.fillStore ();
	} ,
	
	// Go to the previous N articles
	goPrev: function (button) {
		// Enable last button
		if (this.lastBtn.isDisabled ()) this.lastBtn.enable ();
		
		// Enables Next button if previous page is the last one
		if (this.currentPage == (this.articlePages - 1)) this.nextBtn.enable ();
		
		// Update current page
		this.currentPage--;
		
		// Disable Prev and First buttons if current page is the first one
		if (this.currentPage == 0) {
			button.disable ();
			this.firstBtn.disable ();
		}
		
		// Retrieve articles from the articlesStore
		this.range = this.articleStore.getRange (this.currentPage * optionSin.getNavigatorNumber (), (this.currentPage * optionSin.getNavigatorNumber ()) + optionSin.getNavigatorNumber ());
		
		// Display articles
		this.fillStore ();
	} ,
	
	// Go to the next N articles
	goNext: function (button) {
		// Enable first button
		if (this.firstBtn.isDisabled ()) this.firstBtn.enable ();
		
		// Enables Next button if previous page is the first one
		if (this.currentPage == 0) this.prevBtn.enable ();
		
		// Update current page
		this.currentPage++;
		
		// Disable Prev and Last buttons if current page is the first one
		if (this.currentPage == (this.articlePages - 1)) {
			button.disable ();
			this.lastBtn.disable ();
		}
		
		// Retrieve articles from the articlesStore
		this.range = this.articleStore.getRange (this.currentPage * optionSin.getNavigatorNumber (), (this.currentPage * optionSin.getNavigatorNumber ()) + optionSin.getNavigatorNumber ());
		
		// Display articles
		this.fillStore ();
	} ,
	
	// Go to the last N articles
	goLast: function (button) {
		// Update current page
		this.currentPage = this.articlePages - 1;
		
		// Update navigator buttons
		button.disable ();
		this.nextBtn.disable ();
		if (this.firstBtn.isDisabled ()) this.firstBtn.enable ();
		if (this.prevBtn.isDisabled ()) this.prevBtn.enable ();
		
		// Retrieve articles from the articlesStore
		this.range = this.articleStore.getRange (this.articleCounter - optionSin.getNavigatorNumber (), this.articleCounter);
		
		this.fillStore ();
	} ,
	
	// Useful local method to fill local store and display articles
	fillStore: function () {
		try {
			this.win.setLoading (true);
		
			// Clean local store
			this.localStore.removeAll ();
		
			// Fill it up with new models
			this.localStore.insert (0, this.range);
		
			// Before dispose the retrieved articles, kill the old windows
			articleSin.destroyAll ();
		
			// Display articles
			disposeArticles (this.localStore, null, 0);
		
			this.win.setLoading (false);
		}
		catch (err) {
			Ext.Msg.show ({
				title: err.name ,
				msg: err.message ,
				buttons: Ext.Msg.OK ,
				icon: Ext.Msg.ERROR
			});
			
			this.win.setLoading (false);
			Ext.getCmp('centReg').setLoading (false);
		}
	}
});

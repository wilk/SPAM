// @file 	Search.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of search view

Ext.define ('SC.controller.regions.west.Search' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.west.Search'] ,
	
	models: ['regions.center.Articles'] ,
	stores: ['regions.center.Articles'] ,
	
	// Configuration
	init: function () {
		this.control ({
			// Combo change events
			'#comboSearch' : {
				// When user select 'Following', textfield disappear
				select : function (cBox, value) {
					var tSearch = Ext.getCmp ('textSearch');
					
					if (cBox.getValue () == 'Following')
						tSearch.setVisible (false);
					else 
						tSearch.setVisible (true);
				}
			} ,
			// Reset
			'#resetSearch' : {
				click : this.formReset
			} ,
			// Submit
			'#submitSearch' : {
				click : this.submitSearch
			} ,
			// Submit by ENTER key
			'#textSearch' : {
				keypress : function (field , event) {
					if (event.getKey () == event.ENTER)
						this.submitSearch ();
				}
			}
		});
	
		console.log ('Controller Search started.');
	} ,
	
	// @brief Reset all search fields
	formReset : function () {		
		Ext.getCmp('comboSearch').reset ();
		Ext.getCmp('numberSearch').reset ();
		Ext.getCmp('textSearch').reset ();
		Ext.getCmp('textSearch').setVisible (true);
	} ,
	
	submitSearch : function (button) {
		var 	combo = Ext.getCmp ('comboSearch') ,
			number = Ext.getCmp ('numberSearch') ,
			text = Ext.getCmp ('textSearch');
		
		var store = this.getRegionsCenterArticlesStore ();
	
		// Check if combo and number boxes are empty or not
		if (combo.isValid () && number.isValid ()) {
			// Check the type of search
			switch (combo.getValue ()) {
				case 'Author' :
					// Set appropriate URL
					store.getProxy().url = 'search/' + number.getValue () + '/' + text.getValue () + '/' + combo.getValue ();
					
					// TODO: make case for every errors (401, 404, ...)
					// Load data with store request
					store.load (function (records, operation, success) {
						if (! success) {
							var err = operation.getError ();
							Ext.Msg.show ({
								title: 'Error ' + err.status ,
								msg: 'Something bad happened!' ,
								buttons: Ext.Msg.OK,
								icon: Ext.Msg.ERROR
							});
						}
					});
					break;
				case 'Following' :
					// TODO: check if user is logged or not
					Ext.Ajax.request ({
						url: 'search/' + number.getValue () + '/following' ,
						// TODO: read the response on success
						failure: function (error) {
							Ext.Msg.show ({
								title: 'Error ' + error.status ,
								msg: error.responseText ,
								buttons: Ext.Msg.OK,
								icon: Ext.Msg.ERROR
							});
						}
					});
					break;
				case 'Recent' :
					if (text.isValid ()) {
						Ext.Ajax.request ({
							url: 'search/' + number.getValue () + '/recent/' + text.getValue () ,
							// TODO: read the response on success
							failure: function (error) {
								Ext.Msg.show ({
									title: 'Error ' + error.status ,
									msg: error.responseText ,
									buttons: Ext.Msg.OK,
									icon: Ext.Msg.ERROR
								});
							}
						});
					}
					else {
						Ext.Msg.show ({
							title: 'Error ' ,
							msg: 'You must specify the term to search.' ,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
					}
					break;
				case 'Related' :
					if (text.isValid ()) {
						Ext.Ajax.request ({
							url: 'search/' + number.getValue () + '/related/' + text.getValue () ,
							// TODO: read the response on success
							failure: function (error) {
								Ext.Msg.show ({
									title: 'Error ' + error.status ,
									msg: error.responseText ,
									buttons: Ext.Msg.OK,
									icon: Ext.Msg.ERROR
								});
							}
						});
					}
					else {
						Ext.Msg.show ({
							title: 'Error' ,
							msg: 'You must specify the term to search.' ,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
					}
					break;
				case 'Fulltext' :
					if (text.isValid ()) {
						Ext.Ajax.request ({
							url: 'search/' + number.getValue () + '/fulltext/' + text.getValue () ,
							// TODO: read the response on success
							failure: function (error) {
								Ext.Msg.show ({
									title: 'Error ' + error.status ,
									msg: error.responseText ,
									buttons: Ext.Msg.OK,
									icon: Ext.Msg.ERROR
								});
							}
						});
					}
					else {
						Ext.Msg.show ({
							title: 'Error' ,
							msg: 'You must specify the term to search.' ,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
					}
					break;
	//			case 'Affinity' :
	//				break;
				default:
					Ext.Msg.show ({
						title: 'Error' ,
						msg: 'This search method isn\'t implemented yet.' ,
						buttons: Ext.Msg.OK,
						icon: Ext.Msg.ERROR
					});
			}
		}
		else {
			Ext.Msg.show ({
				title: 'Error' ,
				msg: 'You must specify the type of search and the number of posts to retreive.' ,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.ERROR
			});
		}
	}
});

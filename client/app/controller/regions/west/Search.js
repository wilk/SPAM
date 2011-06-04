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
				click : submitSearch
			} ,
			// Submit by ENTER key
			'#textSearch' : {
				keypress : function (field , event) {
					if (event.getKey () == event.ENTER)
						submitSearch ();
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
	}
});

// @brief Submit search
function submitSearch () {
	var 	combo = Ext.getCmp ('comboSearch') ,
		number = Ext.getCmp ('numberSearch') ,
		text = Ext.getCmp ('textSearch');
	
	// Check if combo and number boxes are empty or not
	if (combo.isValid () && number.isValid ()) {
		// Check the type of search
		switch (combo.getValue ()) {
//			case 'Author' :
//				Ext.Ajax.request ({
//					url: 'search/' + number.getValue () + '/' + text.getValue () + '/' + combo.getValue () + 
//				});
//				break;
			case 'Following' :
				// TODO: check if user is logged or not
				Ext.Ajax.request ({
					url: 'search/' + number.getValue () + '/following' ,
					// TODO: read the response on success
					failure: function (error) {
						Ext.Msg.alert ('Error ' + error.status , error.responseText);
					}
				});
				break;
			case 'Recent' :
				if (text.isValid ()) {
					Ext.Ajax.request ({
						url: 'search/' + number.getValue () + '/recent/' + text.getValue () ,
						// TODO: read the response on success
						failure: function (error) {
							Ext.Msg.alert ('Error ' + error.status , error.responseText);
						}
					});
				}
				else {
					Ext.Msg.alert ('Error' , 'You must specify the term to search.');
				}
				break;
			case 'Related' :
				if (text.isValid ()) {
					Ext.Ajax.request ({
						url: 'search/' + number.getValue () + '/related/' + text.getValue () ,
						// TODO: read the response on success
						failure: function (error) {
							Ext.Msg.alert ('Error ' + error.status , error.responseText);
						}
					});
				}
				else {
					Ext.Msg.alert ('Error' , 'You must specify the term to search.');
				}
				break;
			case 'Fulltext' :
				if (text.isValid ()) {
					Ext.Ajax.request ({
						url: 'search/' + number.getValue () + '/fulltext/' + text.getValue () ,
						// TODO: read the response on success
						failure: function (error) {
						Ext.Msg.alert ('Error ' + error.status , error.responseText);
						}
					});
				}
				else {
					Ext.Msg.alert ('Error' , 'You must specify the term to search.');
				}
				break;
//			case 'Affinity' :
//				break;
			default:
				Ext.Msg.alert ('Error' , 'This type of search isn\'t implemented yet.');
		}
	}
	else {
		Ext.Msg.alert ('Error' , 'You must specify the type of search and\n the number of post to retreive.');
	}
}

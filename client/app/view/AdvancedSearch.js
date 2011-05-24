// @file 	AdvancedSearch.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Advanced search window

Ext.define ('SC.view.AdvancedSearch' , {
	extend: 'Ext.window.Window' ,
	alias: 'widget.asearch' ,
	
	// Configuration
	title: 'Advanced Search' ,
	id: 'windowAdvancedSearch' ,
	minHeight: 150 ,
	minWidth: 200 ,
	height: 190 ,
	width: 420 ,
	// On top of any content
	modal: true ,
	layout: 'anchor' ,
	anchor: '100%' ,
	bodyPadding: 10 ,
	closeAction: 'hide' ,
	
	// Body
	items: [{
		xtype: 'form' ,
		layout: 'anchor' ,
		anchor: '100% 100%' ,
		items: [{
			// Tab Panel that contains every search form
			xtype: 'tabpanel' ,
			activeTab: 0 ,
			anchor: '100% 100%' ,
			bodyPadding: '10' ,
			items: [{
				// Search by author
				title: 'Author' ,
				items: [{
					// Name of the author
					xtype: 'textfield' ,
					fieldLabel: 'Author' ,
					name: 'author' ,
					allowBlank: false ,
					emptyText: 'Author'
				} , {
					// Number of posts to retreive
					xtype: 'numberfield' ,
					fieldLabel: 'Number of articles' ,
					name: 'limitAuthor' ,
					value: 1 ,
					minValue: 1
				}]
			} , {
				// Search by following
				title: 'Following' ,
				items: [{
					// Number of posts to retreive
					xtype: 'numberfield' ,
					fieldLabel: 'Number of articles' ,
					name: 'limitFollowing' ,
					value: 1 ,
					minValue: 1
				}]
			} , {
				// Search by recent
				title: 'Recent' ,
				items: [{
					// Term to search
					xtype: 'textfield' ,
					fieldLabel: 'Term' ,
					name: 'termRecent' ,
					allowBlank: false ,
					emptyText: 'Term'
				} , {
					// Number of posts to retreive
					xtype: 'numberfield' ,
					fieldLabel: 'Number of articles' ,
					name: 'limitRecent' ,
					value: 1 ,
					minValue: 1
				}]
			} , {
				// Search by related
				title: 'Related' ,
				items: [{
					// Term to search
					xtype: 'textfield' ,
					fieldLabel: 'Term' ,
					name: 'termRelated' ,
					allowBlank: false ,
					emptyText: 'Term'
				} , {
					// Number of posts to retreive
					xtype: 'numberfield' ,
					fieldLabel: 'Number of articles' ,
					name: 'limitRelated' ,
					value: 1 ,
					minValue: 1
				}]
			} , {
				// Search by fulltext
				title: 'Fulltext' ,
				items: [{
					// Term to search
					xtype: 'textfield' ,
					fieldLabel: 'Term' ,
					name: 'termFulltext' ,
					allowBlank: false ,
					emptyText: 'Term'
				} , {
					// Number of posts to retreive
					xtype: 'numberfield' ,
					fieldLabel: 'Number of articles' ,
					name: 'limitFulltext' ,
					value: 1 ,
					minValue: 1
				}]
			} , {
				// Search by affinity
				title: 'Affinity' ,
				items: [{
					// Article to search
					xtype: 'textfield' ,
					fieldLabel: 'Article' ,
					name: 'article' ,
					allowBlank: false ,
					emptyText: 'Article'
				} , {
					// Number of posts to retreive
					xtype: 'numberfield' ,
					fieldLabel: 'Number of articles' ,
					name: 'limitAffinity' ,
					value: 1 ,
					minValue: 1
				}]
			}]
		}] ,
		
		// Buttons
		buttons: [{
			// Reset fields
			text: 'Reset'
		} , {
			// Start search
			text: 'Search'
		}]
	}]
});

// @file 	Thesaurus.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Controller of Thesaurus view
Ext.define ('SC.controller.regions.west.Thesaurus' , {
	extend: 'Ext.app.Controller' ,
	
	// Views
	views: ['regions.west.Thesaurus'] ,
	stores: ['regions.west.Thesaurus' , 'ComboThesaurus' , 'regions.center.Articles'] ,
	models: ['regions.west.Thesaurus' , 'ComboThesaurus' , 'regions.center.Articles'] ,
			
	// Configuration
	init: function () {
		var skosNS, twebNS;

		this.control ({
			'thesaurus': {
				afterrender: this.loadThesaurus ,
				// Related search on a item db click
				itemdblclick: this.startRelatedTermSearch
			},
			// Add button
			'#btnThesaurusAddTerm': {
				click: function (button) {
					Ext.getCmp('windowAddTerm').show ();
				}
			}
		});
	
		console.log ('Controller Thesaurus started.');
	} ,
	
	// @brief Load the thesaurus in his tree panel
	loadThesaurus: function (panel) {
		var storeThesaurus = this.getRegionsWestThesaurusStore ();
		var storeComboThesaurus = this.getComboThesaurusStore ();
		
		// set namespaces
		skosNS = 'http://www.w3.org/2004/02/skos/core#';
		twebNS = 'http://vitali.web.cs.unibo.it/TechWeb11/thesaurus';
	
		// function and constructor from parse.js library
		myRDF = new RDF ();
		myRDF.getRDFURL (urlServerLtw + 'thesaurus', function () {
			// get root node to append all chileds
			var root = storeThesaurus.getRootNode ();
			
			// Clear previous storeThesaurus and refresh treepanel
			while (root.firstChild) {
				root.removeChild (root.firstChild);
			}
			
			// Clear previous storeComboThesaurus
			storeComboThesaurus.removeAll ();
			
			// query to retrive all "hasTopConcept" node
			var top = myRDF.Match (null, null, skosNS + 'hasTopConcept', null);
			
			// suspend store content change events
			//storeThesaurus.suspendEvents ();

			// starting loop to append all "hasTopConcept" node and theirs children
			for (var i = 0; i < top.length; i++) {
				var sub = top[i].object;
				append (sub, root);
			}
		
			// resume store content change events
			//storeThesaurus.resumeEvents ();
		});
		
		// Append subject to father
		function append (subject, father) {
			// get prefLabel value, create a node and append it to his father
			var val = myRDF.getSingleObject (null, subject, skosNS + 'prefLabel', null);
			
			var node = SC.model.regions.west.Thesaurus.create ({
				text: val ,
				ns: myRDF.getSingleObject (null, subject, skosNS + 'inScheme', null)
			});
			
			// Fill the ComboThesaurus
			storeComboThesaurus.add ({
				term : val
			});
			
			// And sort the store
			storeComboThesaurus.sort ('term' , 'ASC');
			
			// change node internal id into the store to retrive it with getNodeById method
			father.appendChild (node);
			
			// query to get all node's children and recall this function to fill the tree
			var child = myRDF.Match (null, subject, skosNS + 'narrower', null);
			
			if (child.length == 0) {
				node.data.leaf = true;
			}
			
			for (var i=0; i < child.length; i++) {
				append (child[i].object, node);
			}
		}
	} ,
	
	// @brief Starts a search related to a term just db clicked by the user
	startRelatedTermSearch: function (view, record, item, index, ev, opt) {
		var storeArticle = this.getRegionsCenterArticlesStore ();
		
		// Set appropriate URL
		storeArticle.getProxy().url = urlServerLtw + 'search/5/related/' + record.get ('text');
	
		// Retrieve articles
		requestSearchArticles (store, null, 0);
	}
});

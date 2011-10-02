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
	} ,
	
	// @brief Load the thesaurus in his tree panel
	loadThesaurus: function (panel) {
		var storeThesaurus = this.getRegionsWestThesaurusStore ();
		var storeComboThesaurus = this.getComboThesaurusStore ();
		
		// Choose which thesaurus to load (shared or extended)
		var urlThesaurus = (checkIfUserLogged () ? optionSin.getUrlServerLtw () + 'thesaurus' : 'app/data/tesauro.xml');
		
		// set namespaces
		var skosNS = 'http://www.w3.org/2004/02/skos/core#';
		var twebNS = 'http://vitali.web.cs.unibo.it/TechWeb11/thesaurus';
		var rdfNS = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
	
		// function and constructor from parse.js library
		myRDF = new RDF ();
		myRDF.getRDFURL (urlThesaurus, function () {
			// get root node to append all children
			var root = (storeThesaurus.getRootNode ()) ? storeThesaurus.getRootNode () : storeThesaurus.setRootNode ({
					text: 'Thesaurus' ,
					expanded: true
				});
			
			// Clear previous storeThesaurus and refresh treepanel
			while (root.firstChild) {
				root.removeChild (root.firstChild);
			}
			
			// Clear previous storeComboThesaurus
			storeComboThesaurus.removeAll ();
			
			// query to retrive all "hasTopConcept" node
			var top = myRDF.Match (null, null, skosNS + 'hasTopConcept', null);
			
			// starting loop to append all "hasTopConcept" node and theirs children
			for (var i = 0; i < top.length; i++) {
				var sub = top[i].object;
				append (sub, root);
			}
		});
		
		// Append subject to father
		function append (subject, father) {
			// get prefLabel value, create a node and append it to his father
			var val = myRDF.getSingleObject (null, subject, skosNS + 'prefLabel', null);
			
			var node = SC.model.regions.west.Thesaurus.create ({
				text: val
			});
			
			// change node internal id into the store to retrive it with getNodeById method
			father.appendChild (node);
			
			// query to get all node's children and recall this function to fill the tree
			var child = myRDF.Match (null, subject, skosNS + 'narrower', null);
			
			if (child.length == 0) {
				node.data.leaf = true;
			}
			
			var nsOfTerm;
			var pathOfTerm;
			
			// Bad work-around for TangoWhiskey
			if (optionSin.getServerID () == 'TangoWhiskey') {
				// Find namespace of the term
				var ns = myRDF.getSingleObject(null, subject, skosNS + 'inScheme', null).split('/');
				// tweb or ltw
				ns = ns[ns.length - 1];
				
				// tweb:/sport -> /sport
				var path = subject.split(':')[1];
				
				// Extendend
				// E.g. : http://ltw1106.web.cs.unibo.it/thesaurus
				if (ns == 'ltw') nsOfTerm = optionSin.getPureUrlServerLtw () + 'thesaurus';
				// Shared
				// http://vitali.web.cs.unibo.it/TechWeb11/thesaurus
				else nsOfTerm = twebNS;
				
				// E.g. : http://ltw1106.web.cs.unibo.it/thesaurus/sport/pallavolo/allenatore
				pathOfTerm = nsOfTerm + path;
			}
			else {
				// Namespace of the term
				nsOfTerm = myRDF.getSingleObject (null, subject, skosNS + 'inScheme', null);
				// Path of the term
				pathOfTerm = subject.slice (nsOfTerm.length, subject.length);
			}
			
			// Fill the ComboThesaurus
			storeComboThesaurus.add ({
				term : val ,
				// Setup if is it a leaf or not
				isLeaf : (child.length == 0 ? true : false) ,
				ns: nsOfTerm ,
				path: pathOfTerm
			});
			
			// And sort the store
			storeComboThesaurus.sort ('term' , 'ASC');
			
			for (var i=0; i < child.length; i++) {
				append (child[i].object, node);
			}
		}
		
		// Set addterm button visibile if user is already logged in, otherwise set hidden
		if (checkIfUserLogged ()) {
			try {
				var tPan = Ext.getCmp ('thesaurusPanel');
				tPan.collapse (Ext.Component.DIRECTION_TOP, false);
				Ext.getCmp('btnThesaurusAddTerm').setVisible (true);
				tPan.expand (false);
			}
			catch (err) {
				// Do nothing to avoid problems if the user is already login during rendering of extjs
			}
		}
		else {
			Ext.getCmp('btnThesaurusAddTerm').setVisible (false);
		}
	} ,
	
	// @brief Starts a search related to a term just db clicked by the user
	startRelatedTermSearch: function (view, record, item, index, ev, opt) {
		var storeArticle = this.getRegionsCenterArticlesStore ();
		
		// Set appropriate URL
		storeArticle.getProxy().url = optionSin.getUrlServerLtw () + 'search/' + optionSin.getSearchNumber () + '/related/' + record.get ('text');
	
		// Retrieve articles
		requestSearchArticles (storeArticle, null, 0);
	}
});

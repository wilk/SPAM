// @file 	supportFunctions.js
//
// @author 	Vincenzo Ferrari <ferrari@cs.unibo.it>
//		Riccardo Statuto <statuto@cs.unibo.it>
//		Stefano Sgarlata <sgarlat@cs.unibo.it>
//		Clemente Vitale  <cvitale@cs.unibo.it>
//
// @note	Support functions

// @brief Retrieve the articles searched
// @param store: articles store
// @param focus: model of focus article
// @param focusIndex: index focus article model
function requestSearchArticles (store, focus, focusIndex) {
	// Setup loading mask to the center region
	Ext.getCmp('centReg').setLoading (true);

	// Make an AJAX request with JQuery to read XML structure (ExtJS can't read XML with mixed content model)
	$.ajax({
		type: 'GET',
		// Uses url of the store
		url: store.getProxy().url,
		dataType: "xml",
		success: function (xml) {
			// Clean the store
			store.removeAll ();
			
			// TODO: check if xml is empty
			// Check every posts
			$(xml).find('post').each (function () {
				var numLike, numDislike;
				var ifLikeDislike = 0;
				
				// Find like and dislike counter plus setlike of the user
				$(this).find('article').find('span').each (function () {
					// Find like counter
					if ($(this).attr ('property') == 'tweb:countLike') {
						numLike = parseInt ($(this).attr ('content'));
					}
					
					// Find dislike counter
					if ($(this).attr ('property') == 'tweb:countDislike') {
						numDislike = parseInt ($(this).attr ('content'));
					}
					
					// Find setlike/setdislike of the user
					if ($(this).attr ('rev') == 'tweb:like') {
						ifLikeDislike = 1;
					}
					else if ($(this).attr ('rev') == 'tweb:dislike') {
						ifLikeDislike = -1;
					}
					
					// Find media resources (video/audio/image)
					switch ($(this).attr ('resource')) {
						case 'video':
							var srcRes = $(this).attr ('src');
//							var tagHtml = '<iframe width="425" height="349" src="'+ srcRes +'" frameborder="0" allowfullscreen></iframe>';
							var tagHtml = '<object width="425" height="349" src="'+ srcRes +'"></iframe>';
							$(this).text (tagHtml);
							break;
						case 'audio':
							var srcRes = $(this).attr ('src');
							var tagHtml = '<iframe width="200" height="100" src="'+ srcRes +'" frameborder="0" allowfullscreen></iframe>';
							$(this).text (tagHtml);
							break;
						case 'image':
							var srcRes = $(this).attr ('src');
							var tagHtml = '<img src="' + srcRes + '" />';
							$(this).text (tagHtml);
							break;
					}
				});
				
				// Add article to the store
				store.add ({
					affinity: parseInt ($(this).find('affinity').text ()) ,
					// TODO: bug with reading tags
					article: $(this).find('article').text () ,
//					article: $(this).find('article').html () ,
					resource: $(this).find('article').attr ('resource') ,
					about: $(this).find('article').attr ('about') ,
					like: numLike ,
					dislike: numDislike ,
					setlike: ifLikeDislike ,
					user: $(this).find('article').attr('resource').split('/')[2] ,
					server: $(this).find('article').attr('resource').split('/')[1]
				});
			});
			
			// Before dispose the retrieved articles, kill the old windows
			var winFocus = Ext.getCmp ('winFocusArticle');
	
			// Kills focus window
			if (winFocus != null)
				winFocus.destroy ();
	
			var win;
			var j = 0;
	
			// And then kills the other windows
			while ((win = Ext.getCmp ('articles'+j)) != null) {
				win.destroy ();
				j++;
			}
			
			// Dispose retrieved articles
			disposeArticles (store, focus, focusIndex);
		} ,
		error: function (xhr, type, text) {
			Ext.Msg.show ({
				title: type,
				msg: text ,
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.ERROR
			});
			
			// Unset loading mask to the center region
			Ext.getCmp('centReg').setLoading (false);
		}
	});
}

// @brief Check if user is already logged-in or not.
// @return True if it's logged, false if not.
function checkIfUserLogged () {
	// If there is server cookie
	if (Ext.util.Cookies.get ('ltwlogin') != null)
	{
		// And if there is client cookie
		if (Ext.util.Cookies.get ('SPAMlogin') != null) {
	
			return true;
		}
	}
	
	return false;
}

// @brief Retrieve 10 recent articles
// @param store: update the recent articles store
function retrieveRecentArticles (store) {
	// Set URL dinamically
	store.getProxy().url = urlServerLtw + 'search/10/recent';
	
	// Make an AJAX request with JQuery to read XML structure (ExtJS can't read XML with mixed content model)
	$.ajax({
		type: 'GET',
		// Uses url of the store
		url: store.getProxy().url,
		dataType: "xml",
		success: function (xml) {
			// Clean the store
			store.removeAll ();
			
			// Check every posts
			$(xml).find('post').each (function () {
				var numLike, numDislike;
				var ifLikeDislike = 0;
				
				// Find like and dislike counter plus setlike of the user
				$(this).find('article').find('span').each (function () {
					// Find like counter
					if ($(this).attr ('property') == 'tweb:countLike') {
						numLike = parseInt ($(this).attr ('content'));
					}
				
					// Find dislike counter
					if ($(this).attr ('property') == 'tweb:countDislike') {
						numDislike = parseInt ($(this).attr ('content'));
					}
				
					// Find setlike/setdislike of the user
					if ($(this).attr ('rev') == 'tweb:like') {
						ifLikeDislike = 1;
					}
					else if ($(this).attr ('rev') == 'tweb:dislike') {
						ifLikeDislike = -1;
					}
					
//					switch ($(this).attr ('resource')) {
//						case 'video':
//							$(this).replaceWith ('<iframe width="425" height="349" src="'+ $(this).attr ('src') +'" frameborder="0" allowfullscreen></iframe>');
//							break;
//						case 'audio':
//							$(this).replaceWith ('<iframe width="200" height="100" src="'+ $(this).attr ('src') +'" frameborder="0" allowfullscreen></iframe>');
//							break;
//						case 'image':
//							$(this).replaceWith ('<img src="'+ $(this).attr ('src') +'" />');
//							break;
//					}
				});
				
				// Add article to the store
				store.add ({
					affinity: parseInt ($(this).find('affinity').text ()) ,
					// TODO: bug with reading tags
					article: $(this).find('article').text () ,
//					article: $(this).find('article').html () ,
					resource: $(this).find('article').attr ('resource') ,
					about: $(this).find('article').attr ('about') ,
					like: numLike ,
					dislike: numDislike ,
					setlike: ifLikeDislike ,
					user: $(this).find('article').attr('resource').split("/")[2] ,
					server: $(this).find('article').attr('resource').split('/')[1]
				});
			});
		} ,
		error: function (xhr, type, text) {
			// TODO: yep?
//			Ext.Msg.show ({
//				title: type,
//				msg: text ,
//				buttons: Ext.Msg.OK,
//				icon: Ext.Msg.ERROR
//			});
		}
	});
}

// @brief Textarea plugin for multilines autocomplete
InsertAtCursorTextareaPlugin = function () {
	return {
		init : function (textarea) {

			textarea.insertAtCursor = function (v) {
				if (Ext.isIE) {
					this.el.focus ();
					var sel = document.selection.createRange ();
					sel.text = v;
					sel.moveEnd ('character', v.length);
					sel.moveStart ('character', v.length);
				}
				else {
					var document_id = this.getFocusEl().id;
					var text_field = document.getElementById (document_id);
					var startPos = text_field.selectionStart;
					var endPos = text_field.selectionEnd;
					text_field.value = text_field.value.substring (0, startPos) + v + text_field.value.substring (endPos, text_field.value.length);

					//this.getFocusEl().focus ();
					//this.getFocusEl().setSelectionRange (endPos + v.length, endPos + v.length);
				}
			}
		}
	}
}

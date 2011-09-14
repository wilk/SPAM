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
			
			try {
				// If there's no one post, throw a new error
				if ($(xml).find('post').length == 0) 
					throw {
						name: 'XML Parsing' ,
						message: 'Something bad happened while reading the XML. Maybe is non well-formed.'
					}
				
				// Check every posts
				$(xml).find('post').each (function () {
					var numLike, numDislike;
					var ifLikeDislike = 0;
					var geoLat = 0.0;
					var geoLong = 0.0;
					var userID = $(this).find('article').attr('resource');
					
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
						if (($(this).attr ('rev') == 'tweb:like') && ($(this).attr ('resource') == '/' + optionSin.getServerID () + '/' + optionSin.getCurrentUser ())) {
							ifLikeDislike = 1;
						}
						else if (($(this).attr ('rev') == 'tweb:dislike') && ($(this).attr ('resource') == '/' + optionSin.getServerID () + '/' + optionSin.getCurrentUser ())) {
							ifLikeDislike = -1;
						}
					
						// Find geolocation coords
						if ($(this).attr ('id') == 'geolocationspan') {
							geoLong = ($(this).attr ('long') != null ? $(this).attr ('long') : 0.0);
							geoLat = ($(this).attr ('lat') != null ? $(this).attr ('lat') : 0.0);
							if (!((geoLong == 0) && (geoLat == 0))) {
								var mapLatLng = new google.maps.LatLng (geoLat, geoLong);
								geolocSin.addMarker (mapLatLng, userID);
							}
						}
					});
					
					// Add article to the store
					store.add ({
						affinity: parseInt ($(this).find('affinity').text ()) ,
						article: tag2string ($(this).find('article')[0]) ,
						resource: $(this).find('article').attr ('resource') ,
						about: $(this).find('article').attr ('about') ,
						like: numLike ,
						dislike: numDislike ,
						setlike: ifLikeDislike ,
						user: $(this).find('article').attr('resource').split('/')[2] ,
						server: $(this).find('article').attr('resource').split('/')[1] ,
						post: $(this).find('article').attr('about').split('/')[3] ,
						glLat: geoLat ,
						glLong: geoLong
					});
				});
				
				// Before dispose the retrieved articles, kill the old windows
				articleSin.destroyAll ();

				// Unset loading mask to the Search Panel
				Ext.getCmp('panelSearch').setLoading (false);
				
				// Dispose retrieved articles
				disposeArticles (store, focus, focusIndex);
			}
			catch (err) {
				// Unset loading mask to the Search Panel
				Ext.getCmp('panelSearch').setLoading (false);
				// Unset loading mask to the center region
				Ext.getCmp('centReg').setLoading (false);
				
				Ext.Msg.show ({
					title: err.name ,
					msg: err.message ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
		} ,
		error: function (xhr, type, text) {
			if ((xhr.status == 404) && (focus != null)) {
				// Clean the store
				store.removeAll ();
				
				// Add the focus to the store
				store.add (focus);
				
				// Before dispose the retrieved articles, kill the old windows
				articleSin.destroyAll ();
			
				// Dispose retrieved articles
				disposeArticles (store, focus, focusIndex);
			}
			else {
				Ext.Msg.show ({
					title: xhr.status + ' ' + errorSin.getErrorTitle (xhr.status) ,
					msg: errorSin.getErrorText (xhr.status) ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
			
			// Unset loading mask to the center region
			Ext.getCmp('centReg').setLoading (false);
			
			// Unset loading mask to the Search Panel
			Ext.getCmp('panelSearch').setLoading (false);
		}
	});
}

// @brief Check if user is already logged-in or not.
// @return True if it's logged, false if not.
function checkIfUserLogged () {
	var ris = false;
	
	// If there is server cookie
	if (Ext.util.Cookies.get ('ltwlogin') != null)
	{
		// And if there is client cookie
		if (Ext.util.Cookies.get ('SPAMlogin') != null) {
	
			ris = true;
		}
	}
	
	return ris;
}

// @brief Retrieve 10 recent articles
// @param store: update the recent articles store
function retrieveRecentArticles (store) {
	// Make an AJAX request with JQuery to read XML structure (ExtJS can't read XML with mixed content model)
	$.ajax({
		type: 'GET',
		// Uses url of the store
		url: optionSin.getUrlServerLtw () + 'search/10/recent/' ,
		dataType: "xml",
		success: function (xml) {
			// Clean the store
			// TODO: bug with store.removeAll(). There are some problems with store.add afterwards
			if (store.getCount () > 0) {
				for (var i=0; i < store.getCount (); i++) {
					store.removeAt (i);
				}
			}
			
			// Articles are added all together at the end
			var recArtArray = new Array ();
			
			// Check every posts
			$(xml).find('post').each (function () {
				try {
				
					var numLike, numDislike;
					var ifLikeDislike = 0;
					var geoLat = 0.0;
					var geoLong = 0.0;
					var userID = $(this).find('article').attr('resource');
			
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
						if (($(this).attr ('rev') == 'tweb:like') && ($(this).attr ('resource') == '/' + optionSin.getServerID () + '/' + optionSin.getCurrentUser ())) {
							ifLikeDislike = 1;
						}
						else if (($(this).attr ('rev') == 'tweb:dislike') && ($(this).attr ('resource') == '/' + optionSin.getServerID () + '/' + optionSin.getCurrentUser ())) {
							ifLikeDislike = -1;
						}
				
						// Find geolocation coords
						if ($(this).attr ('id') == 'geolocationspan') {
							geoLong = ($(this).attr ('long') != null ? $(this).attr ('long') : 0.0);
							geoLat = ($(this).attr ('lat') != null ? $(this).attr ('lat') : 0.0);
							if (!((geoLong == 0) && (geoLat == 0))) {
								var mapLatLng = new google.maps.LatLng (geoLat, geoLong);
								geolocSin.addMarker (mapLatLng, userID);
							}
						}
				
					});
					
					// Add article to the array
					recArtArray.push (Ext.create ('SC.model.regions.east.RecentPost' , {
						affinity: parseInt ($(this).find('affinity').text ()) ,
						article: tag2string ($(this).find('article')[0]) ,
						articleText: $(this).find('article').text () ,
						resource: $(this).find('article').attr ('resource') ,
						about: $(this).find('article').attr ('about') ,
						like: numLike ,
						dislike: numDislike ,
						setlike: ifLikeDislike ,
						user: $(this).find('article').attr('resource').split("/")[2] ,
						server: $(this).find('article').attr('resource').split('/')[1] ,
						post: $(this).find('article').attr('about').split('/')[3] ,
						glLat: geoLat ,
						glLong: geoLong
					}));
			
				}
				catch (err) {
					// Let's continue the loop
				}
			});
			
			// Add articles to the store
			store.insert (0, recArtArray);
		} ,
		error: function (xhr, type, text) {
			// Do nothing
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
				}
			}
		}
	}
}

// @brief Convert a tag Element into a string
// @param tag: tag to convert
// @return Tag converted
function tag2string (tag) {
	var articleString = '';
	
	for (var i = 0; i < tag.childNodes.length; i++) {
		// TextNode
		if (tag.childNodes[i].nodeType == 3) {
			articleString += tag.childNodes[i].nodeValue;
		}
		// TagNode
		else if (tag.childNodes[i].nodeType == 1) {
			// E.g.: '<a '
			articleString += '<' + tag.childNodes[i].nodeName + ' ';
			
			// Attributes
			for (var j = 0; j < tag.childNodes[i].attributes.length; j++) {
				articleString += tag.childNodes[i].attributes[j].name + '="' + tag.childNodes[i].attributes[j].value + '" ';
			}
			
			// Check for nested tags (e.g. <i>ciao <b>mamma</b></i>)
			articleString += '>' + tag2string (tag.childNodes[i]);
			
			// Close TagNode
			articleString += '</' + tag.childNodes[i].nodeName + '>';
		}
	}
	
	return articleString;
}

// @brief Transforms naked link in resource (<span resource ...>) or in a link element (<a ...>)
// @param article: body of article
// @param startPoint: start point to read (for recursive issue)
// @param artLen: default article length
// @return The article modified
// TODO: problem with clones (http://www.img.com/img , http://www.img.com/img)
function transformNakedUrl (article, startPoint, artLen) {
	var urlArt;
	var urlArtStart = article.indexOf ('http://' , startPoint);
	
	// Check 'www' if there's no 'http'
	if (urlArtStart == -1) {
		urlArtStart = article.indexOf ('www' , startPoint);
	}
	
	// If an url was found
	if (urlArtStart != -1) {
		var urlArtEnd = article.indexOf (' ', urlArtStart + 7);
	
		// Check if article is finished
		if (urlArtEnd != -1) {
			urlArt = article.slice (urlArtStart , urlArtEnd);
		}
		// If it is, use article.length instead of urlArtEnd to avoid space problems
		else {
			urlArtEnd = artLen;
			urlArt = article.slice (urlArtStart , article.length);
		}
		
		// JQuery to make sync request
		$.ajax ({
			type: 'POST' ,
			url: 'proxy' ,
			data: {url:urlArt} ,
			// Synchronous request
			async: false ,
			success: function (data, status, xhr) {
				// Theme for audio/video/image link
				var urlVideoToReplace = article.replace (urlArt , '<span resource="video" src="'+ urlArt +'" />');
				var urlAudioToReplace = article.replace (urlArt , '<span resource="audio" src="'+ urlArt +'" />');
				var urlImageToReplace = article.replace (urlArt , '<span resource="image" src="'+ urlArt +'" />');
				
				switch (data) {
					// Video
					case 'video/ogg':
						article = urlVideoToReplace;
						break;
					case 'video/mpeg':
						article = urlVideoToReplace;
						break;
					case 'video/mp4':
						article = urlVideoToReplace;
						break;
					case 'video/quicktime':
						article = urlVideoToReplace;
						break;
					case 'video/webm':
						article = urlVideoToReplace;
						break;
					case 'video/x-ms-wmv':
						article = urlVideoToReplace;
						break;
					// Audio
					case 'audio/ogg':
						article = urlAudioToReplace;
						break;
					case 'audio/mpeg':
						article = urlAudioToReplace;
						break;
					case 'audio/mp4':
						article = urlAudioToReplace;
						break;
					case 'audio/vorbis':
						article = urlAudioToReplace;
						break;
					case 'audio/x-ms-wma':
						article = urlAudioToReplace;
						break;
					case 'audio/webm':
						article = urlAudioToReplace;
						break;
					// Image
					case 'image/gif':
						article = urlImageToReplace;
						break;
					case 'image/jpeg':
						article = urlImageToReplace;
						break;
					case 'image/png':
						article = urlImageToReplace;
						break;
					case 'image/svg':
						article = urlImageToReplace;
						break;
					case 'image/tiff':
						article = urlImageToReplace;
						break;
					// Text
					default:
						article = article.replace (urlArt , '<a href="'+ urlArt +'">' + urlArt + '</a>');
						break;
				}
				
				// Check if there are other links
				if (urlArtEnd < artLen) {
					article = transformNakedUrl (article , urlArtEnd, artLen);
				}
				else {
					return article;
				}
			} ,
			// If there are some problems (like method not implemented, treat it as a naked link)
			error: function (xhr, errorType, text) {
				article = article.replace (urlArt , '<a href="'+ urlArt +'">' + urlArt + '</a>');
				
				// Check if there are other links
				if (urlArtEnd < artLen) {
					article = transformNakedUrl (article , urlArtEnd, artLen);
				}
				else {
					return article;
				}
			}
		});
	}
	else {
		return article;
	}
	
	return article;
}

// @brief Launch a recent search when the title SPAM is clicked
// @return void
function clickTitle () {
	// TODO: use Ext.getStore (storeId); instead of creates a new one
//	var store = Ext.create ('SC.store.regions.center.Articles');
//	store.getProxy().url = optionSin.getUrlServerLtw () + 'search/10/recent/';
//	requestSearchArticles (store, null, 0);
}

// @brief Show image passed in a modal window
// @return void
function showImg (img) {
	var regCenter = Ext.getCmp ('centReg');
	var image = new Image ();
	image.src = img.src;

	var win = Ext.create ('Ext.window.Window' , {
		title: 'Image' ,
		maximizable: true ,
		modal: true ,
		bodyPadding: 10 ,
		width: Math.round (regCenter.getWidth () / 2) ,
		height: Math.round (regCenter.getHeight () / 2) ,
		autoScroll: true ,
		items: {
			xtype: 'image' ,
			src: img.src ,
			border: 3
		}
	});
	
	// If image is too large, use the center region dimensions
	if ((image.width > regCenter.getWidth ()) || (image.height > regCenter.getHeight ())) {
		// If width is lower, use it
		if (image.width <= regCenter.getWidth ()) {
			win.setWidth (image.width + 45);
			win.setHeight (regCenter.getHeight ());
		}
		// Same thing with height
		if (image.height <= regCenter.getHeight ()) {
			win.setHeight (image.height + 65);
			win.setWidth (regCenter.getWidth ());
		}
	}
	// Otherwise, use image dimension
	else {
		win.setWidth (image.width + 35);
		win.setHeight (image.height + 58);
	}

	win.show ();
}

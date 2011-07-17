Ext.regController('Home',{

	renderHome:function(){
		
		this.home=this.render({xtype:'home'});
//		console.log(this.home);
		
		loginstore=Ext.StoreMgr.get('loginstore');
//		console.log(loginstore);

		if(loginstore.getCount()!=0){

//		this.home.down('#loginToolbar').hide();
		
		this.home.down('#titleToolbar').setTitle(loginstore.getAt(0).get('username'));
		
//			this.home.remove('loginToolbar',true);	
//		this.home.doComponentLayout();
		
//		console.log(loginstore.getAt(0).get('username'));
		
		}
		
		this.application.viewport.setActiveItem(this.home);
		
		this.getSearchResponse(Ext.StoreMgr.get('poststore'));
	},
	
	getSearchResponse:function(store){
	
	var home=this.home;
	
	home.setLoading(true);
	
	var store=store;
				// Clean the store
		store.removeAll ();

		// Make an AJAX request with JQuery to read XML structure (ExtJS can't read XML with mixed content model)
		$.ajax({
			type: 'GET',
			// Uses url of the store
			url: store.getProxy().url,
			dataType: "xml",
			success: function (xml) {
				// Check every posts
				$(xml).find('post').each (function () {
					var numLike, numDislike, html='';
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
					});
				
				
					$(this).find('article').each(function(){
//					console.log($(this));
						
						html+=$(this).text();
						
						$(this).find('span').each(function(){
							if( $(this).attr('resource')=='audio' )
							{
								html+='<audio src="'+$(this).attr('src')+'"'+'controls="controls"'+'preload="none"'+'/>';
							}
							if( $(this).attr('resource')=='video' )
							{
								html+='<video src="'+$(this).attr('src')+'"'+'controls="controls"'+'preload="none"'+'/>';
							}
							if( $(this).attr('resource')=='image' )
							{
								html+='<img src="'+$(this).attr('src')+'"'+'/>';
							}
						});
						
					});
				
				
				
					// Add article to the store
					store.add ({
						affinity: parseInt ($(this).find('affinity').text ()) ,
						article: $(this).find('article') ,
						resource: $(this).find('article').attr ('resource') ,
						about: $(this).find('article').attr ('about') ,
						like: numLike ,
						dislike: numDislike ,
						setlike: ifLikeDislike ,
						user: $(this).find('article').attr('resource').split("/")[2],
						html:html
					});
					
//					console.log($(this).find('article').attr ('resource'));
					
				});
				
				home.setLoading(false);
			},	
			error: function (xhr, type, text) {
			
				this.home.setLoading(false);
				
				Ext.Msg.show ({
					title: type,
					msg: text ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
		});
	}
	
//	showPost:function(options){
//	
//	var record=options.post;
//	var article=options.article;
//	
////	console.log(record);
//		this.post=this.render({xtype:'post',html:record});
//		
//		this.post.down('#toolbarTitle').setTitle(options.user+' said');
//		
//		this.post.doComponentLayout();
//		
//		var pos=this.post;
//		$(article).find('span').each(function(){
//		//		console.log(article);
//		//console.log($(article).find('span').attr('audio'));
//				if( $(this).attr('resource')=='audio')
//				{
//		//			console.log(pos);
//					pos.add({xtype:'audio',url:$(this).attr('src')});
//				}
//				if( $(this).attr('resource')=='video')
//				{
//					pos.add({xtype:'video',url:$(this).attr('src')});
//				}
//		//		if( $(this).attr('resource')=='image' )
//		//		{
//		//			html+='<img src="'+$(this).attr('src')+'"'+'/>';
//		//		}
//		//console.log(this.post);
//		});
////		console.log(this.post);
//		this.application.viewport.setActiveItem(this.post);
//	
//	}

});

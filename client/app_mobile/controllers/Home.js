Ext.regController('Home',{

//initialize and register a store for posts and set an event listener on the user login
	init:function(){
	
		this.store=new Ext.data.Store({model:'Post',storeId:'poststore'});
		
	//event listener for check the user like preferences	
		Ext.StoreMgr.get('loginstore').addListener('add',function(){
		
			var username=Ext.StoreMgr.get('loginstore').getAt(0).get('username');
		
		//for each post check if the user has already done a like/dislike 
		//and set the setlike field of the model
			Ext.StoreMgr.get('poststore').each(function(rec){
							
				var article=rec.get('article');
				
				$(article).find('span').each(function(){
				
					if ($(this).attr ('rev') == 'tweb:like' && $(this).attr('resource').match('/Spammers/'+username+'\s*')) {
						rec.set('setlike',1);
					}
					else if ($(this).attr ('rev') == 'tweb:dislike' && $(this).attr('resource').match('/Spammers/'+username+'\s*')) {
						rec.set('setlike',-1);
					}
				
				});
			
			});
		
		});
	
	},
	
//create a list posts, add it to the home view and render the panel
	renderHome:function(){
		
	//create the home view with a list to show all posts retrived form the poststore
	//and set an "onItemDisclosure" handler to open a single post
		this.home=this.render({
			xtype:'home',
			items:[{
				xtype:'list',
				disableSelection:true,
				styleHtmlContent:true,
				fullscreen:true,
				itemTpl:'{html}',
				store:this.store,
				onItemDisclosure:function(rec, node, index, e){
					Ext.dispatch({
						controller:'Post',
						action:'showPost',
						post:rec.data.html,
						article:rec.data.article,
						user:rec.data.user,
						index:index,
						view:this.up('home')
					});
				}
			}]
		});
		
		var loginstore=Ext.StoreMgr.get('loginstore');

	//check if the user is already logged in and set the toolbar title with the default value or with the user name	
		if(loginstore.getCount()!=0){
		
			this.home.down('#titleToolbar').setTitle(loginstore.getAt(0).get('username'));
		
		}
		else{
		
			this.home.down('#titleToolbar').setTitle('Spam');
		
		}
		
	//show the view	
		this.application.viewport.setActiveItem(this.home);
	
	//call a method to retrive posts from the server	
		this.getSearchResponse(Ext.StoreMgr.get('poststore'));
		
		Ext.StoreMgr.get('poststore').fireEvent('load');
		
	//add an event handler for the user login to change the toolbar title
		Ext.StoreMgr.get('loginstore').addListener('add',function(store,recs,index){
		
			this.home.down('#titleToolbar').setTitle(store.getAt(index).get('username'));
		
		},this);
	},
	
//method to get posts form the server, parse all of them and fill the model fields
	getSearchResponse:function(store){
	
	var home=this.home;
	
	home.setLoading(true);
	
	var store=Ext.StoreMgr.get('poststore');
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
						if(Ext.StoreMgr.get('loginstore').getCount()!=0){
							var username=Ext.StoreMgr.get('loginstore').getAt(0).get('username');
							
							if ($(this).attr ('rev') == 'tweb:like' && $(this).attr('resource').match('/Spammers/'+username+'\s*')) {
								ifLikeDislike = 1;
							}
							else if ($(this).attr ('rev') == 'tweb:dislike' && $(this).attr('resource').match('/Spammers/'+username+'\s*')) {
								ifLikeDislike = -1;
							}
						}	
					});

				//parse a post to get the text and the media element and fill the html model's field
					$(this).find('article').contents().each(function(){
		
						//if this node is a span, check if it is a media node	
							if($(this).is('span')){
		
							//if this node contain an audio use an HTML5 video tag with a click event listener on an icon to play it
							//(Android browser has some issue with audio/video tag and media format)
								if($(this).attr('resource')=='audio'){
									html+='<video src="'+$(this).attr('src')+'"'+'poster="lib_mobile/play.png"'+'controls="controls"'+'preload="none" onclick="this.play();"'+'/>';
								}
							
							//if this node contain a video, add a link tag becouse android browser doesn't recognise flash
							//with this link is possible to use a native youtube phone app
								if($(this).attr('resource')=='video'){
			
									html+='<a href="'+$(this).attr('src')+'"'+'>'+'<img src="lib_mobile/video.png"/>'+'</a>';
			
								}
			
							//if this node contain an image use an img tag and resize the image
								if($(this).attr('resource')=='image'){
			
									html+='<img src="'+$(this).attr('src')+'"'+'height="20%" width:"20%"'+'/>';
			
								}
			
								html+=$(this).text();
		
							}
		
						//if this is a text node
							if(this.nodeType == 3){
		
							//get the node content	
								var tmp=$(this).text();
			
							//search for a link	
								var links=$(this).text().match(/\(?\bhttp:\/\/[-A-Za-z0-9+&@#/%?=~_()|!:,.;]*[-A-Za-z0-9+&@#/%=~_()|]/gim);
			
								if(links!=null){
			
								//for each link replace the url with the html link tag	
									for(i=0;i<links.length;i++){
			
										var indexOfLink=tmp.indexOf(links[i]);
										var first=tmp.substring(0,indexOfLink);
										var next=tmp.substring(indexOfLink+links[i].length);
					
										tmp=first+'<a href="'+links[i]+'">'+links[i]+'</a>';
			
									}
			
								}
			
								html+=tmp;
		
							}

					});				
				
					var userdesc=$(this).find('article').attr ('resource');
					userdesc=userdesc.split('/');
					// Add article to the store
					store.add ({
					//affinity field
						affinity: parseInt ($(this).find('affinity').text ()) ,
					//raw post
						article: $(this).find('article') ,
					//user id
						resource: $(this).find('article').attr ('resource') ,
					//post id
						about: $(this).find('article').attr ('about') ,
					//date
						date: $(this).find('article').attr('content'),
					//like count
						like: numLike ,
					//dislike count
						dislike: numDislike ,
					//like/dislike choice
						setlike: ifLikeDislike ,
					//author name
						user: $(this).find('article').attr('resource').split("/")[2],
					//parsed post
						html:"<p style='text-align:center;font-size:15px'><b>"+html+"</b></p>"+"<p style='color:orange'>"+"Send by "+userdesc[2]+" on "+userdesc[1]+"'s server</p>"
					});
					
				});
				
				home.setLoading(false);
			},	
			error: function (xhr, type, text) {
			
				home.setLoading(false);
				
				Ext.Msg.show ({
					title: type,
					msg: text ,
					buttons: Ext.Msg.OK,
					icon: Ext.Msg.ERROR
				});
			}
		});
	}

});

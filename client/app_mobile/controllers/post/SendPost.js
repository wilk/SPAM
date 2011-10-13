Ext.regController('sendpost',{

	init:function(){
	
		var lat, lng;
	
	},

	showNewPost:function(options){
	
		this.prevView=options.view;
		
		if(options.serverID){
		
			this.serverID=options.serverID;
			this.userID=options.userID;
			this.postID=options.postID;		
		}
	
		this.newpost=this.render({xtype:'sendpost'});
		this.application.viewport.setActiveItem(this.newpost);
		this.getGeoLocation();
	
	},
	
	getTextAreaContent:function(){

		var post=this.newpost.down('fieldset').getComponent('newpost').getValue();
		
		if(post.length==0){
			
			Ext.Msg.alert('New post',"You haven't type anything");
		}
		else{
		
			post=this.addHashtagElement(post);
			post=this.addMediaElement(post);
			if(lat){
			
			post+='<span id="geolocationspan" long="'+lng+'" lat="'+lat+'"/>';
			
			}
		}
		
			this.sendPost(post);
	
	},
	
	addHashtagElement:function(post){
	
		var preabout='<span rel="sioc:topic">#<span typeof="skos:Concept" about="';
		var postabout='" rel="skos:inScheme" resource="';
		var postinscheme='">';
		var closespans='</span></span>';
		
		var pregentag='<span rel="sioc:topic">#<span typeof="ctag:Tag" property="ctag:label">';
		
			var hashtags=post.match(/#[a-zA-Z0-9]+/gim);
		
			if(hashtags!=null){
		
				var controllerThesaurus=Ext.ControllerManager.get('thesaurus');
		
				for(i=0;i<hashtags.length;i++){
			
					var resource=controllerThesaurus.getResource(hashtags[i]);
				
					if(resource!=null){
					
						var inscheme=resource[0];
					
						var indexofabout=inscheme.length;
					
						var about=resource[1].substr(indexofabout);
					
						var replace=preabout+about+postabout+inscheme+postinscheme+hashtags[i].substr(1)+closespans;
						var indexoftag=post.indexOf(hashtags[i]);
						var first=post.substring(0,indexoftag);
						var next=post.substring(indexoftag+hashtags[i].length);
						post=first+replace+next;
						
					}
					else{
						
						var replace=pregentag+hashtags[i].substr(1)+closespans;
						var indexoftag=post.indexOf(hashtags[i]);
						var first=post.substring(0,indexoftag);
						var next=post.substring(indexoftag+hashtags[i].length);
						post=first+replace+next;
					
					}			
				}
		
			}
		
		return post;
	
	},
	
	addMediaElement:function(post){
	
		var openSpan='<span resource="';
		var closeSpan='/>';

		
			var links=post.match(/\(?\bhttp:\/\/[-A-Za-z0-9+&@#/%?=~_()|!:,.;]*[-A-Za-z0-9+&@#/%=~_()|]/gim);
			
			if(links!=null){
			
				for(i=0;i<links.length;i++){
				
					var indexOfMedia=post.indexOf(links[i]);
					var first=post.substring(0,indexOfMedia);
					var next=post.substring(indexOfMedia+links[i].length);
					
					var mime=this.getMediaMimeType(links[i]);
					var type=mime.substring(0,mime.indexOf('/'));
					
					if(type.search("image|video|audio")!=-1){
						
						post=first+openSpan+type+'" src="'+links[i]+'"'+closeSpan+next;
						
					}				
				}
				
			}
		
		return post;
	
	},
	
	getMediaMimeType:function(url){
	
		var mime=null;
	
		$.ajax({
		
			url:'proxy',
			type:'post',
			data:{url:url},
			async:false,
			scope:this,
			
			success:function(res){mime=res;},
			
			failure:function(res){
				Ext.Msg.alert(res.statusText,res.responseText);
			}
		
		});
		
		return mime;
	
	},
	
	getGeoLocation:function(){

		var geo=new Ext.util.GeoLocation({
		
			autoUpdate:false,
		
			listeners:{
				locationupdate:function(geo){
				
					lat=geo.latitude;
					lng=geo.longitude;

				},
				locationerror:function(geo, timeout, permissionDenied, locationUnavailable, message){
				
					alert('geo:'+geo+'---timeout:'+timeout+'---permission:'+permissionDenied+'---locationUnavailable:'+locationUnavailable+'---message:'+message);
					}
				
				}
			});
			geo.updateLocation();
	},
		
	sendPost:function(post){

	
		if(this.serverID){
		
			Ext.Ajax.request({
			
				url:'replyto',
				method:'post',
				params:{
						serverID:this.serverID,
						userID:this.userID,
						postID:this.postID,
						article:'<article>'+post+'</article>'
						},
			
				success:function(){
					Ext.dispatch({
						controller:'Home',
						action:'renderHome',
//						historyUrl:'spam/home'
					});
				},
			
				failure:function(response){
					Ext.Msg.alert(response.statusText,response.responseText);
				}
			
			});
			
		}
		else{
		
			Ext.Ajax.request({
			
				url:'post',
				method:'post',
				params:{article:'<article>'+post+'</article>'},
			
				success:function(){
					Ext.dispatch({
						controller:'Home',
						action:'renderHome',
//						historyUrl:'spam/home'
					});
				},
			
				failure:function(response){
					Ext.Msg.alert(response.statusText,response.responseText);
				}
			
			});
		
		}
	
		
	
	},
	
	previousView:function(){
	
		if(this.prevView){
			this.application.viewport.setActiveItem(this.prevView);
		}
		else
		Ext.dispatch({
			controller:'Home',
			action:'renderHome',
//			historyUrl:'spam/home'
		});
	
	}

});

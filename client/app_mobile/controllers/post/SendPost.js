Ext.regController('sendpost',{

	showNewPost:function(options){
	
		this.prevView=options.view;
		
		if(options.serverID){
		
			this.serverID=options.serverID;
			this.userID=options.userID;
			this.postID=options.postID;		
		}
	
		this.newpost=this.render({xtype:'sendpost'});
		this.application.viewport.setActiveItem(this.newpost);
	
	},
	
	getTextAreaContent:function(){

		var post=this.newpost.down('fieldset').getComponent('newpost').getValue();
		
		if(post.length==0){
			
			Ext.Msg.alert('New post',"You haven't type anything");
		}
		else{
		
			var preabout='<span rel="sioc:topic">#<span typeof="skosConcept" about="';
			var postabout='" rel="skos:inScheme" resource="';
			var postinscheme='">';
			var closespans='</span></span>';
			
			var pregentag='<span rel="sioc:topic">#<span typeof="ctag:Tag" property="ctag:label">';
			
			do{
		
				var hashtags=post.match("#[a-zA-Z0-9]+");
			
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
//						console.log(post);				
					}
			
				}
			}while(hashtags!=null)
		
		}
			this.sendPost(post);
	
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
						action:'renderHome'
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
						action:'renderHome'
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
			action:'renderHome'
		});
	
	}

});

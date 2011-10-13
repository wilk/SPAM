Ext.regController('Map',{

	init:function(){
	
		coords=get_position();
		this.markers=new Array();
		this.map=this.render({xtype:'Map'});
		
		Ext.StoreMgr.get('poststore').addListener('add',function(){
		
			this.setPostsMarkers();
		
		},this);
	
	},

	showMap:function(options){
		
		this.previousView=options.view;		
		
		this.application.viewport.setActiveItem(this.map);
		
		this.setMarker(coords[0],coords[1],'you');
		
		
		
		this.setPostsMarkers();	
		
		if(options.lat&&options.lng){
		
			var center=new google.maps.LatLng(options.lat,options.lng,true);
			this.map.down('map').map.setZoom(16);
			this.map.down('map').map.setCenter(center);
		
		}
		else{
		
			this.centerMap(coords[0],coords[1]);
		
		}
	},
	
	destroyView:function(){
	
		this.application.viewport.setActiveItem(this.previousView);
	
	},
	
	setMarker:function(lat,lng,title){
	
		var mark=new google.maps.Marker({title:title});
		
		var pos=new google.maps.LatLng(lat,lng,true);
		
		mark.setPosition(pos);
		mark.setMap(this.map.down('map').map);
		mark.setDraggable(true);
		this.markers.push(mark);
//		google.maps.event.addListener(mark,'click',Ext.ControllerManager.get('Map').markerTapHandler(pos,title));
		google.maps.event.addListener(mark,'click',function(){Ext.ControllerManager.get('Map').markerTapHandler(pos,title);});
		google.maps.event.addListener(mark,'drag',function(){mark.setPosition(pos);});
	},
	
	centerMap:function(lat,lng){
	
		if(lat&&lng){
			var pos=new google.maps.LatLng(lat,lng,true);
			this.map.down('map').map.panTo(pos);
			this.map.down('map').map.setZoom(16);
		}
		else{
		
			var tmp=coords;
			coords=get_position();
			if(coords){

					var pos=new google.maps.LatLng(coords[0],coords[1],true);
					this.map.down('map').map.panTo(pos);
					this.setMarker(coords[0],coords[1],'you');
					this.map.down('map').map.setZoom(16);
						
			}
			else{
				
				for(i=0;i<this.markers.length;i++){
				
					if(this.markers[i].getTitle()=='you'){
					
						this.map.down('map').map.panTo(this.markers[i].getPosition());
						this.map.down('map').map.setZoom(16);
					
					}
				
				}
				
			}
		}
	
	},
	
	setPostsMarkers:function(){
	
		for(i=0;i<this.markers.length;i++){
		
			if(this.markers[i].getTitle()!='you'){
				
				var tmp=this.markers.shift();
				tmp.setMap(null);
				google.maps.event.clearInstanceListeners(tmp);
				i--
			}
//			else{
//				i++
//			}
		
		}
	
		var posts=Ext.StoreMgr.get('poststore');
		
		posts.each(function(rec){
		
			var article=rec.get('article');
			
			var lat=$(article).find('span[lat]').attr('lat');
			var lng=$(article).find('span[long]').attr('long');
			var title=$(article).attr('about');
			
			if(lat){
			
				this.setMarker(lat,lng,title);
//				this.markers.push(new google.maps.Marker({
//			
//					title:title,
//					position:new google.maps.LatLng(lat,lng),
//					map:this.map.down('map').map
//			
//				}));
			}
		
		},this);
	
	},
	
	markerTapHandler:function(position,title){
	
		var infowin=new google.maps.InfoWindow();
		infowin.setPosition(position);
//		infoWin.on('closeclick',infowin.close());
	
		if(title=='you'){
			if(Ext.StoreMgr.get('loginstore').getCount()!=0){
			
				infowin.setContent('Hi <b>'+Ext.StoreMgr.get('loginstore').getAt(0).get('username')+'</b>, this is your current position');
				infowin.open(this.map.down('map').map);
			
			}
			else{
			
				infowin.setContent('Hi, this is you current position');
				infowin.open(this.map.down('map').map);
			}
		}
		else{
			
			var index=Ext.StoreMgr.get('poststore').findExact('about',title);
			if(index!=-1){
				
				var rec=Ext.StoreMgr.get('poststore').getAt(index);
				
				Ext.dispatch({
					controller:'Post',
					action:'showPost',
					post:rec.get('html'),
					article:rec.get('article'),
					user:rec.get('user'),
					index:index,
					view:this.map,
//					historyUrl:'spam/post'
					
				})
			}
		}
	
	}

});

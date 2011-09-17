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
		this.markers.push(mark);
	
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
	
	}

});

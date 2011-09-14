Ext.regController('Map',{

	init:function(){
	
		this.markers=new Array();
	
	},

	showMap:function(options){
		
		this.previousView=options.view;
		
		
		if(!this.map){
		
			this.map=this.render({xtype:'Map'});
		
			this.map.down('map').geo.updateLocation(function(geo){

				if(geo!=null){
					this.map.down('map').map.setZoom(14);
					this.setMarker(geo.latitude,geo.longitude,'you');
					this.map.update(geo);
					
					
				}
			
			},this);
			
			
//			this.map.addListener('activate',function(){console.log('activate');});
//			this.map.addListener('added',function(){console.log('added');});
//			this.map.addListener('afterrender',function(){console.log('afterrender');});
//			this.map.addListener('enable',function(){console.log('enable');});
//			this.map.addListener('maprender',function(){console.log('maprender');});
//			this.map.addListener('render',function(){console.log('render');});
//			this.map.addListener('show',function(){console.log('show');});
//			this.map.addListener('zoomchange',function(){console.log('zoomchange');});
			
			
			Ext.StoreMgr.get('poststore').addListener('load',function(store){
			
//				store.suspendEvents(false);
				this.setPostsMarkers();
//				store.resumeEvents();
			
			},this);	
			
		}

		this.application.viewport.setActiveItem(this.map);
		
		this.setPostsMarkers();	
		
		if(options.lat&&options.lng){
		
			this.centerMap(options.lat,options.lng);
		
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
		
			if(Ext.util.Date.getElapsed(this.map.down('map').geo.timestamp)>1200000){
			
				this.map.down('map').geo.updateLocation(function(geo){
			
					if(geo!=null){

						var pos=new google.maps.LatLng(geo.latitude,geo.longitude,true);
						this.map.down('map').map.panTo(pos);
						this.setMarker(geo.latitude,geo.longitude,'you');
						this.map.down('map').map.setZoom(16);
				
					}			
				},this);
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
			else{
				i++
			}
		
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

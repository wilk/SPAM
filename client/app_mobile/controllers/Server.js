Ext.regController('Server',{

	//action name
	prova:function(){
		
		this.serverstore=new Ext.data.Store({model:'Server'});
		Ext.regStore('serverstore',this.serverstore);
	
		this.prova=this.render({
			xtype:'serverlist',
			store:this.serverstore
		});
		
		this.application.viewport.setActiveItem(this.prova);
	},
	
	close:function(){
		this.prova.hide();
	}
});

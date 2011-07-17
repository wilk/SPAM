Ext.regController('Server',{

	//action name
	prova:function(){
		this.prova=this.render({
			xtype:'serverlist'
		});
		
		this.application.viewport.setActiveItem(this.prova);
	}
});

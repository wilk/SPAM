Ext.regApplication('mspam',{

//NAMESPACE
	name:'mspam',
//	defaultTarget:'viewport',
//use routes.js mode to call showPost method of List controller
//	defaultUrl:'Login/displayLogin',
//	useHistory:true,

//first launched function
	launch:function(){
		this.viewport=new mspam.Viewport({application:this});
		Ext.dispatch({
			controller:'Login',
			action:'displayLogin'
		});
	}
});

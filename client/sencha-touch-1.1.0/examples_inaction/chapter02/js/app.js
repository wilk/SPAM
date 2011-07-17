//for (key in localStorage) { delete localStorage[key];}
Ext.regApplication({
    name   : 'MyApp',
    launch : function() {
        new MyApp.AppPanel({
            fullscreen : true
        });
    }
});
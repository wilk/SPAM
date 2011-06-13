<?php

/**
 * Define your URI routes here.
 *
 * $route[Request Method][Uri] = array( Controller class, action method, other options, etc. )
 *
 * RESTful api support, *=any request method, GET PUT POST DELETE
 * POST 	Create
 * GET      Read
 * PUT      Update, Create
 * DELETE 	Delete
 *
 * Use lowercase for Request Method
 *
 * If you have your controller file name different from its class name, eg. home.php HomeController
 * $route['*']['/'] = array('home', 'index', 'className'=>'HomeController');
 * 
 * If you need to reverse generate URL based on route ID with DooUrlBuilder in template view, please defined the id along with the routes
 * $route['*']['/'] = array('HomeController', 'index', 'id'=>'home');
 *
 * If you need dynamic routes on root domain, such as http://facebook.com/username
 * Use the key 'root':  $route['*']['root']['/:username'] = array('UserController', 'showProfile');
 *
 * If you need to catch unlimited parameters at the end of the url, eg. http://localhost/paramA/paramB/param1/param2/param.../.../..
 * Use the key 'catchall': $route['*']['catchall']['/:first'] = array('TestController', 'showAllParams');
 * 
 * If you have placed your controllers in a sub folder, eg. /protected/admin/EditStuffController.php
 * $route['*']['/'] = array('admin/EditStuffController', 'action');
 * 
 * If you want a module to be publicly accessed (without using Doo::app()->getModule() ) , use [module name] ,   eg. /protected/module/forum/PostController.php
 * $route['*']['/'] = array('[forum]PostController', 'action');
 * 
 * If you create subfolders in a module,  eg. /protected/module/forum/post/ListController.php, the module here is forum, subfolder is post
 * $route['*']['/'] = array('[forum]post/PostController', 'action');
 *
 * Aliasing give you an option to access the action method/controller through a different URL. This is useful when you need a different url than the controller class name.
 * For instance, you have a ClientController::new() . By default, you can access via http://localhost/client/new
 * 
 * $route['autoroute_alias']['/customer'] = 'ClientController';
 * $route['autoroute_alias']['/company/client'] = 'ClientController';
 * 
 * With the definition above, it allows user to access the same controller::method with the following URLs:
 * http://localhost/company/client/new
 *
 * To define alias for a Controller inside a module, you may use an array:
 * $route['autoroute_alias']['/customer'] = array('controller'=>'ClientController', 'module'=>'example');
 * $route['autoroute_alias']['/company/client'] = array('controller'=>'ClientController', 'module'=>'example');
 *
 * Auto routes can be accessed via URL pattern: http://domain.com/controller/method
 * If you have a camel case method listAllUser(), it can be accessed via http://domain.com/controller/listAllUser or http://domain.com/controller/list-all-user
 * In any case you want to control auto route to be accessed ONLY via dashed URL (list-all-user)
 *
 * $route['autoroute_force_dash'] = true;	//setting this to false or not defining it will keep auto routes accessible with the 2 URLs.
 *
 */
$route['*']['/'] = array('MainController', 'index');
$route['*']['/error'] = array('ErrorController', 'index');


//---------- Delete if not needed ------------
//$admin = array('admin' => '1234');
//
////view the logs and profiles XML, filename = db.profile, log, trace.log, profile
//$route['*']['/debug/:filename'] = array('MainController', 'debug', 'authName' => 'DooPHP Admin', 'auth' => $admin, 'authFail' => 'Unauthorized!');
//
////show all urls in app
//$route['*']['/allurl'] = array('MainController', 'allurl', 'authName' => 'DooPHP Admin', 'auth' => $admin, 'authFail' => 'Unauthorized!');
//
////generate routes file. This replace the current routes.conf.php. Use with the sitemap tool.
//$route['post']['/gen_sitemap'] = array('MainController', 'gen_sitemap', 'authName' => 'DooPHP Admin', 'auth' => $admin, 'authFail' => 'Unauthorized!');
//
////generate routes & controllers. Use with the sitemap tool.
//$route['post']['/gen_sitemap_controller'] = array('MainController', 'gen_sitemap_controller', 'authName' => 'DooPHP Admin', 'auth' => $admin, 'authFail' => 'Unauthorized!');
//
////generate Controllers automatically
//$route['*']['/gen_site'] = array('MainController', 'gen_site', 'authName' => 'DooPHP Admin', 'auth' => $admin, 'authFail' => 'Unauthorized!');
//
////generate Models automatically
//$route['*']['/gen_model'] = array('MainController', 'gen_model', 'authName' => 'DooPHP Admin', 'auth' => $admin, 'authFail' => 'Unauthorized!');

/////////INIZIO ROUTING SPAM//////////
//Login utente
$route['post']['/login'] = array('LoginController', 'authUser');
//Path con login metodo non supportato
$route['*']['/login'] = array('ErrorController', 'notSupport');

//Logout utente
$route['post']['/logout'] = array('LoginController', 'logout');
//Path con logout metodo non supportato
$route['*']['/logout'] = array('ErrorController', 'notSupport');

//Crea nuovo post
$route['post']['/post'] = array('PostController', 'createPost');
//Ricevi post
$route['get']['/post/:serverID/:userID/:postID'] = array('PostController', 'sendPost');
//Path con post metodo non supportato
$route['*']['/post'] = array('ErrorController', 'notSupport');
//"Retweetta" un post
$route['post']['/respam'] = array('PostController', 'createRespam');
//Path con retweet metodo non supportato
$route['*']['/respam'] = array('ErrorController', 'notSupport');

//Rispondi al post
$route['post']['/replyto'] = array('PostController', 'createReply');
//Path con replyto metodo non supportato
$route['*']['/replyto'] = array('ErrorController', 'notSupport');
//Ricerca un post

$route['get']['/search/:limit/:type'] = array('SearchController', 'searchMain');
$route['get']['/search/:limit/:type/:var1'] = array('SearchController', 'searchMain');
$route['get']['/search/:limit/:type/:var1/:var2'] = array('SearchController', 'searchMain');
$route['get']['/search/:limit/:type/:var1/:var2/:var3'] = array('SearchController', 'searchMain');
//Path con search metodo non supportato
$route['*']['/search/:limit/:type'] = array('ErrorController', 'notSupport');

//Imposta setlike
$route['post']['/setlike'] = array('LikeController', 'setLike');
//Path con setlike metodo non supportato
$route['*']['/setlike'] = array('ErrorController', 'notSupport');

//Richiesta lista server federati
$route['get']['/servers'] = array('ServersController', 'sendServersList');
//Sovrascrivi lista server federati
$route['post']['/servers'] = array('ServersController', 'rewriteServersList');
//Path con servers metodo non supportato
$route['*']['/servers'] = array('ErrorController', 'notSupport');

//Setta sei seguire o meno un utente
$route['post']['/setfollow'] = array('FollowController', 'setFollow');
//Path setfollow metodo non supportato
$route['*']['/setfollow'] = array('ErrorController', 'notSupport');

//Aggiunge termine al tesauro
$route['post']['/addterm'] = array('TesauroController', 'addTerm');
//Path addterm metodo non supportato
$route['*']['/addterm'] = array('ErrorController', 'notSupport');
//Rimuove termine dal tesauro
$route['post']['/remterm'] = array('TesauroController', 'removeTerm');
//Path term metodo non supportato
$route['*']['/remterm'] = array('ErrorController', 'notSupport');
//Restituisce tesauro esteso
$route['get']['/thesaurus'] = array('TesauroController', 'sendThesaurus');
//Path thesaurus metodo non supportato
$route['*']['/thesaurus'] = array('ErrorController', 'notSupport');

//Propaga setlike
$route['post']['/propagatelike'] = array('LikeController', 'propagateLike');
//Path propagatelike metodo non supportato
$route['*']['/propagatelike'] = array('ErrorController', 'notSupport');

//Inoltra notifica di risposta ad un post
$route['post']['/hasreply'] = array('PostController', 'hasReply');
//Path hasreply metodo non supportato
$route['*']['/hasreply'] = array('ErrorController', 'notSupport');

//SEZIONE TEST
$route['post']['/extrasource'] = array('TestController', 'getHead');
$route['get']['/test'] = array('TestController', 'tester');
?>
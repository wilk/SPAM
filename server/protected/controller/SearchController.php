<?php

include_once 'protected/model/PostModel.php';
include_once 'protected/model/UserModel.php';
include_once 'protected/model/ThesModel.php';
include_once 'protected/view/PostView.php';
include_once 'protected/controller/ErrorController.php';
include_once 'protected/module/simple_html_dom.php';

class SearchController extends DooController {
    
    private $listaPost = array();

    public function beforeRun($resource, $action) {
        $role;
        session_name("ltwlogin");
        session_start();
        if (!(isset($_SESSION['user']['username']))) {
            if (ini_get("session.use_cookies")) {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]
                );
            }
            //termino la sessione
            session_destroy();
            session_name("nologin");
            session_start();
            $role = 'anonymous';
        }
        else
            $role = $_SESSION['user']['group'];

        //if not login, group = anonymous
        //$role = (isset($_SESSION['user']['group'])) ? $_SESSION['user']['group'] : 'anonymous';
        //check against the ACL rules
        if ($rs = $this->acl()->process($role, $resource, $action)) {
            //echo $role .' is not allowed for '. $resource . ' '. $action;
            return $rs;
        }
    }

    /* qui sono mazzate */
    public function searchMain() {
        if (!(isset ($this->params['limit'])) || !(isset ($this->params['type'])))
            //BAD REQUEST
            return 400;
        $limite = $this->params['limit'];
        $tipo = $this->params['type'];
        
        $search_Type = array(
            'author',
            'following', 
            'recent', 
            'related', 
            'fulltext', 
            'affinity'
        );
        
        $request;
        if (isset($_SESSION['user']['username'])){
            $this->load()->helper('DooRestClient');
            $request = new DooRestClient;
        }
        switch ($tipo) {
            case $search_Type[0]: //author
                if (!(isset ($this->params['var1'])) || !(isset ($this->params['var2'])))
                        //BAD REQUEST
                        return 400;
                $srv = $this->params['var1'];
                $usr = $this->params['var2'];
                if ($srv == 'Spammers') {//richiesta interna
                    $user = new UserModel($usr);
                    //qui faccio solo un controllo; sarebbe giusto farne due distinti
                    if ($user->ifUserExist()){
                        if ($user->checkPosts()){
                            $posts = $this->rcvFromINTServer($user, $limite);
                            if (sizeof($posts))
                                $this->displayPosts($posts);
                            else{
                                ErrorController::internalError();
                            }
                        } else
                            ErrorController::notFound("Errore: l'utente $usr non ha pubblicato messaggi.\n");
                    } else
                        ErrorController::notFound("Errore: l'utente $usr non esiste.\n");
                } else {//richiesta esterna
                    $parametri = array($limite, $tipo, $srv, $usr);
                    $metodo = 'searchserver'.implode('/', $parametri);
                    //giro direttamente la risposta sperando che il server non scazzi
                    //ps: può dare problemi interni per il fatto dello status di ritorno
                    return $this->rcvFromEXTServer($srv, $method);
                }
                break;
                
            case $search_Type[1]: //following
                if (isset($_SESSION['user']['username'])){
                    $user = new UserModel($_SESSION['user']['username']);
                    $follows = $user->getFollows();
                    $size = sizeof($follows);
                    if (!$size)
                        ErrorController::notFound('Attualmente non ci sono utenti seguiti.\n');
                    foreach ($follows as $follow){
                        $posts;
                        $howMany = round($limite/$size);
                        list($domain,$srv,$usr) = explode('/', $follow);
                        if ($srv == 'Spammers') {//richiesta interna
                            $utente = new UserModel($usr);
                            $posts = $this->rcvFromINTServer($utente, $howMany);
                        } else {//richiesta esterna
                            $parametri = array($howMany, $search_Type[0], $srv, $usr);
                            $metodo = 'searchserver'.implode('/', $parametri);
                            $XMLresult = $this->rcvFromEXTServer($srv, $method);
                            //if ($XMLresult === false)
                            $posts = $this->parseEXTContent($XMLresult, $srv);
                        }
                        $limite -= sizeof($posts);
                        $size--;
                        array_push($this->listaPost, $posts);
                    }//qui dovrei avere la mia lista di messaggi dagli utenti seguiti
                    //$this->getPostsOnly();
                    
                    //qui devo ordinare la mia lista
                    if (sizeof($this->listaPost) > $limite)
                        $this->listaPost = array_slice($this->listaPost, 0, $limite, TRUE);
                    $this->displayPosts($this->listaPost);
                } else
                    return 401;
                break;
                
            case $search_Type[2]: //recent
                $howMany;
                $servers;
                $size = 1;
                $ext = FALSE;
                $pIDs = 0;
                
                if (isset($_SESSION['user']['username'])){
                    $ext = TRUE;
                    $user = new UserModel($_SESSION['user']['username']);
                    $servers = $user->getServers();
                    $size += sizeof($servers);
                }
                $howMany = round($limite/$size) + 1;
                
                if (isset($this->params['var1'])){
                    $termine = $this->params['var1'];
                    $tesauro = new ThesModel();
                    $pathTerm = $tesauro->returnPath($termine);
                    $tesauro = new ThesModel(TRUE);
                    if ($pathTerm !== false)
                        $pIDs = $tesauro->getPostsFromThes($pathTerm, $howMany, TRUE);
                        
                    else if ($res = $tesauro->getPostsByCtag($termine, $howMany))
                        $pIDs = $res;
                }

                $post = new PostModel();
                if ($pIDs != 0)
                    $this->listaPost = $post->getPostArray($pIDs);
                    
                else {// qui ricerco senza termine
                    $this->listaPost = $post->getPostArray(NULL, $howMany);
                }
                $rimasti = $limite - count($this->listaPost);
                $size--;
                
                if ($ext && $size){//richiedo all'esterno
                    $howMany = round($rimasti/$size) + 1;
                    
                    $askServers = new SRVModel($request);
                    $a = array();
                    foreach ($servers as $value) {
                        $k['url'] = $askServers->getUrl($value);
                        $k['data'] = 0;
                        $a[] = $k;
                    }
                    $servers = $a;
                    $metodo = '/'.$tipo;
                    if (isset($this->params['var1']))
                            $metodo .= '/'.$this->params['var1'];

                    if ($this->rcvFromEXTServers($servers, $howMany, $metodo)){
                        print_r($servers); die();
                        foreach ($servers as $value) {
                            if ($value['data']){
                                //$lista = $this->parseEXTContent($value['data'], $value['url']);
                                //print_r($lista); die();
//                                foreach ($lista as $value) {
//                                    if(isset($value[]))
//                                }
                            } else {
                                //qui gestisco i server da fanculizzare
                            }
                        }
                    } else 
                        return 501;
                }

               if (sizeof($this->listaPost) > $limite)
                   array_slice ($this->listaPost, 0, $limite, TRUE);
               $this->displayPosts($this->listaPost);

               break;
                
            case $search_Type[3]: //related
                if (!(isset ($this->params['var1'])))
                        //BAD REQUEST
                        return 400;

                break;
                
            case $search_Type[4]: //fulltext
                if (!(isset ($this->params['var1'])))
                        //BAD REQUEST
                        return 400;

                break;
                
            case $search_Type[5]: //affinity
                if (!(isset ($this->params['var1'])) || 
                        !(isset ($this->params['var2'])) ||
                                !(isset ($this->params['var3'])))
                        //BAD REQUEST
                        return 400;

                break;
                
            default: //beh, altrimenti errore
                return 400; //?? giust?
                break;
        }
    }
    
    private function displayPosts($lista){
        $XMLPosts = PostView::renderMultiplePost($lista);
        $this->setContentType('xml');
        print $XMLPosts;
    }
    /*questa l'ho presa da sendPost() in PostController;
     * si potrebbero accorpare
     */
    private function rcvFromEXTServer($server, $method){
        $this->load()->helper('DooRestClient');
        $request = new DooRestClient;
        $url = SRVModel::getUrl($request, $server);
        $request->connect_to($url . $method)
                ->accept(DooRestClient::XML)
                ->get();
        if ($request->isSuccess())
            return $request->xml_result();
        else
            return false;
    }
    
    private function rcvFromEXTServers(&$servers, $limite, $metodo){
        if(count($servers)<=0) return false;

        $hArr = array();//handle array

        foreach($servers as $k=>$server){

                $url = $server['url'].'searchserver/'.$limite.$metodo;
                $h = curl_init();
                curl_setopt($h,CURLOPT_URL,$url);
                curl_setopt($h,CURLOPT_HEADER,0);
                curl_setopt($h,CURLOPT_RETURNTRANSFER,1);//return the image value

                array_push($hArr,$h);
        }

        $mh = curl_multi_init();
        foreach($hArr as $k => $h)      
            curl_multi_add_handle($mh,$h);

        $running = null;
        do{ curl_multi_exec($mh,$running);
        }while($running > 0);

        // get the result and save it in the result ARRAY
        foreach($hArr as $k => $h)
            $servers[$k]['data'] = curl_multi_getcontent($h);

        //close all the connections
        foreach($hArr as $k => $h)
                curl_multi_remove_handle($mh,$h);
        
        curl_multi_close($mh);

        return true;

    }
    
    private function parseEXTContent($toParse, $server){
        $array = array();
        $html = str_get_html($toParse->asXML());
        foreach ($html->find('article') as $articolo){
            $post = PostModel::parseArticle($articolo->outertext, $server);
            //sto bordello è solo per prelevare solo il post vero e proprio
            foreach ($post as $k => $value){
                if ($value['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'][0] == 'http://rdfs.org/sioc/ns#Post')
                    array_push($array, $post[$k]);
            }
        }
        return $array;
    }

    private function rcvFromINTServer($usr, $countPost){
        $post = new PostModel();
        $postIDs = $usr->getPosts($countPost);
        return $post->getPostArray($postIDs);
    }
    
//    private function getPostsOnly(){
//        $tmp_array = array();
//        foreach ($this->listaPost as $key => $value) {
//            //questa parte non funzionerà, l'etichetta deve essere estesa
//            if ($value['rdf:type'][] == 'sioc:Post')
//                array_push ($tmp_array, $this->listaPost[$key]);
//        }
//        $this->listaPost = $tmp_array;
//    }

    public function searchRecent($term=null) {
        
    }

}

?>
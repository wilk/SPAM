<?php

include_once 'protected/model/PostModel.php';
include_once 'protected/model/UserModel.php';
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
                    $metodo = 'searchserver/'.$limite.'/'.$tipo.'/'.$srv.'/'.$usr;
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
                            $metodo = 'searchserver/'.$howMany.$search_Type[0].$srv.'/'.$usr;
                            $XMLresult = $this->rcvFromEXTServer($srv, $method);
                            //if ($XMLresult === false)
                            $posts = $this->parseEXTContent($XMLresult, $srv);
                        }
                        $limite -= sizeof($posts);
                        $size--;
                        array_push($this->listaPost, $posts);
                    }//qui dovrei avere la mia lista di messaggi dagli utenti seguiti
                    //$this->getPostsOnly();
                    if (sizeof($this->listaPost) > $limite)
                        $this->listaPost = array_slice($this->listaPost, 0, $limite, TRUE);
                    $this->displayPosts($this->listaPost);
                } else
                    return 401;
                break;
                
            case $search_Type[2]: //recent
                if (isset($this->params['var1'])){
                    //sto cercando un termine specifico
                    $termine = $this->params['var1'];
                    $thes = new ThesModel(TRUE);
                    $pathTerm = $thes->returnPath($termine);
                    $thes->getPostsFromThes($pathTerm, $limite, TRUE);
                } else {
                    $post = new PostModel();
                    $this->listaPost = $post->getPostArray();
                    //print_r($this->listaPost);
                    //if (sizeof($this->listaPost) > $limite)
                    //    array_slice ($this->listaPost, 0, $limite, TRUE);
                    $this->displayPosts($this->listaPost);
                }
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
<?php

include_once 'protected/model/PostModel.php';
include_once 'protected/model/UserModel.php';
include_once 'protected/view/PostView.php';
include_once 'protected/module/simple_html_dom.php';

class SearchController extends DooController {

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
                if ($srv == 'Spammers') {
                    $posts = $this->rcvFromINTServer($usr, $limite);
                    $this->displayPosts($posts);
                } else {
                    //richiesta esterna
                    $metodo = 'searchserver/'.$limite.'/'.$tipo.'/'.$srv.'/'.$usr;
                    //giro direttamente la risposta sperando che il server non scazzi
                    return $this->rcvFromEXTServer($srv, $method);
                }
                break;
            case $search_Type[1]: //following
                $user = new UserModel($_SESSION['user']['username']);
                $follows = $user->getFollows();
                $size = sizeof($follows);
                if (!$size)
                    return 'Attualmente non ci sono utenti seguiti.';
                //scelgo di prendere lo stesso numero di messaggi da ogni server
                $howMany = round($limite/$size);
                foreach ($follows as $follow){
                    list($domain,$srv,$usr) = explode('/', $follow);
                    if ($srv != 'Spammers') {
                        $metodo = 'searchserver/'.$howMany.'/author'.$srv.'/'.$usr;
                        $XMLresult = $this->receiveFromServer($srv, $method);
                        //devo parserizzare l'xml che ricevo
                        $this->parseEXTContent($XMLresult, $srv);
                    } else {
                        $posts = $this->rcvFromINTServer($usr, $howMany);
                        //inserisco sti messaggi un una lista da inviare al client
                    }
                }
                break;
            case $search_Type[2]: //recent
                if (!(isset ($this->params['var1'])))
                        //BAD REQUEST
                        return 400;

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
                ->accept(DooRestClient::HTML)
                ->get();
        if ($request->isSuccess())
            return $request->xml_result();
        else
            return $request->resultCode(); //TODO perfezionare l'errore
    }
    
    private function parseEXTContent($toParse, $server){
        $array = array();
        $html = str_get_html($toParse->asXML());
        foreach ($html->find('article') as $articolo){
            array_push($array, (array) PostModel::parseArticle($articolo->outertext, $server));
        }
        return $array;
    }

    private function rcvFromINTServer($usr, $countPost){
        $user = new UserModel($usr);
        $post = new PostModel();
        $postIDs = $user->getPosts($countPost);
        return $post->getPostArray($postIDs);
    }

    public function searchRecent($term=null) {
        
    }

}

?>

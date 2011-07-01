<?php

include_once 'protected/model/PostModel.php';
include_once 'protected/model/UserModel.php';
include_once 'protected/model/SRVModel.php';
include_once 'protected/view/PostView.php';
include_once 'protected/controller/ErrorController.php';
include_once 'protected/module/simple_html_dom.php';

class PostController extends DooController {

    public $articolo;

    public function beforeRun($resource, $action) {
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
        }
//if not login, group = anonymous
        $role = (isset($_SESSION['user']['group'])) ? $_SESSION['user']['group'] : 'anonymous';
//check against the ACL rules
        if ($rs = $this->acl()->process($role, $resource, $action)) {
//echo $role .' is not allowed for '. $resource . ' '. $action;
            return $rs;
        }
    }

    /*
     * Crea un nuovo post aggiungendolo al file data/posts.rdf e aggiunge un riferimento al post
     * nel file data/users.rdf nella descrizione dell'utente.
     * Il contenuto del post può essere passato o come variabile POST o tramite variabile interna.
     */

    public function createPost($content = null) {
        /* Recupero nella variabile $content tutto quello che mi viene passato tramite POST
         */

        if ($content == null) {
            if (isset($_POST['article']))
                $mycontent = $_POST['article'];
            else
                return ErrorController::badReq("Il contenuto dell'articolo non può essere vuoto");
        }
        else
            $mycontent=$content;
        $this->articolo = new PostModel();
        if ($pID = $this->articolo->initNewPost($mycontent)) {
//            echo $pID;
//            echo $_SESSION['user']['username'];
            $utente = new UserModel($_SESSION['user']['username']);
            $utente->addPost2Usr($pID);
        }
        return 201;
    }

    public function sendPost() {
        $server = $this->params['serverID'];
        $user = $this->params['userID'];
        $post = $this->params['postID'];
        $pathPost = 'spam:/' . $server . '/' . $user . '/' . $post;
        if (isset($this->params['type'])) {
            if ($this->params['type'] == "rdf") {
//                if ($this->acceptType() == 'rdf') {
                    $this->articolo = new PostModel();
                    if ($this->articolo->postExist($pathPost)) {
                        $myPost = $this->articolo->getPost($pathPost);
                        $rdfPost = PostView::renderPostRdf($myPost);
                        $this->setContentType('rdf');
                        print $rdfPost;
                    } else
                        return ErrorController::notFound('Questo post non esiste!!');
//                }else
//                    return ErrorController::conflict();
            } else
                return ErrorController::notImpl();
        }else if (($this->acceptType()) == 'html') {
            if ($server != 'Spammers') {
                $this->load()->helper('DooRestClient');
                $request = new DooRestClient;
                $servers = new SRVModel($request);
                $url = $servers->getUrl($server);
                if ($url) {
                    $request->connect_to($url . '/postserver/' . $user . '/' . $post)
                            ->accept(DooRestClient::HTML)
                            ->get();
                    if ($request->isSuccess()) {
                        $content = $request->result();
                        $this->setContentType('html');
                        die($content);
                    } else {
                        return $request->resultCode();
                    }
                } else
                    return ErrorController::notFound("Il server richiesto non esiste!");
            }
            $myUser = null;
            if (isset($_SESSION['user']['username']))
                $myUser = $_SESSION['user']['username'];
            $this->articolo = new PostModel();
            if ($this->articolo->postExist($pathPost)) {
                $myPost = $this->articolo->getPost($pathPost);
                $htmlPost = PostView::renderPost($myPost, $myUser);
                print $htmlPost;
            }else
                return ErrorController::notFound('Questo post non esiste!!');
        } else if ($server == 'Spammers' && $this->acceptType() == 'rdf') {
            $url = $post . '/rdf';
            header('Status: 303');
            header("Location: " . $url);
        } else {
            return ErrorController::notImpl();
        }
    }

//DEPRECATED
//    public function sendPostByType() {
//        $server = $this->params['serverID'];
//        $user = $this->params['userID'];
//        $post = $this->params['postID'];
//        $type = $this->params['type'];
//        $this->articolo = new PostModel();
//        $myPost = $this->articolo->getPost('spam:/' . $server . '/' . $user . '/' . $post);
//        $rdfPost = PostView::renderPostRdf($myPost);
//        $this->setContentType('rdf');
//        print $rdfPost;
//    }

    /*
     * Copia il contenuto del post richiesto e lo salva come post ex-novo sfruttando la funzione CreatePost
     * Nel caso il post richiesto sia sul server interno controlla che esista, se invece il post è su un server esterno
     * viene inoltrata la richesta per ricevere il post.
     * Una volta creato, il post viene arricchito con sintassi rdfa per indicare che è un respam.
     */

    public function createRespam() {
        if (!(isset($_POST['serverID'])))
            return ErrorController::badReq('Il serverID deve essere specificato!!');
        if (!(isset($_POST['userID'])))
            return ErrorController::badReq('Il userID deve essere specificato!!');
        if (!(isset($_POST['postID'])))
            return ErrorController::badReq('Il postID deve essere specificato!!');
        $serverID = $_POST['serverID'];
        $userID = $_POST['userID'];
        $postID = $_POST['postID'];
        if ($serverID == "Spammers") {
            $this->articolo = new PostModel();
            $pathPost = 'spam:/' . $serverID . '/' . $userID . '/' . $postID;
            if ($this->articolo->postExist($pathPost)) {
                $myPost = $this->articolo->getPost($pathPost);
                $key = key($myPost);
                if ($pID = $this->articolo->initNewPost('<article>' . $myPost[$key]['http://rdfs.org/sioc/ns#content'][0] . '</article>')) {
                    $utente = new UserModel($_SESSION['user']['username']);
                    $utente->addPost2Usr($pID);
                }
            }else
                return ErrorController::notFound('Questo post non esiste!!');
        } else {
            $this->load()->helper('DooRestClient');
            $request = new DooRestClient;
            $servers = new SRVModel($request);
            $url = $servers->getUrl($serverID);
            if ($url) {
                $request->connect_to($url . '/postserver/' . $userID . '/' . $postID)
                        ->accept(DooRestClient::HTML)
                        ->get();
                if ($request->isSuccess()) {
                    $content = $request->result();    
                    $html= str_get_html($content);
                    foreach($html->find('span') as $span){
                        if(!isset($span->typeof) && !isset($span->rel) && !isset($span->resource))
                        $span->outertext= '';
                    }
                    $content=html_entity_decode($html->outertext, ENT_NOQUOTES, 'UTF-8');
                    $this->createPost($content);
                }else
                    return $request->resultCode();
            }else
                return ErrorController::notFound("Il server richiesto non esiste!");
        }
        $this->articolo->addRespamOf('spam:/' . $serverID . '/' . $userID . '/' . $postID);
        return 201;
    }

    /*
     * Genera un nuovo post di risposta collegato all'originale.
     * Una volta generato il post lo si arrichisce con rdfa per indicare che è una risposta all'originale.
     * Inoltra la richiesta di arricchire il post originale con rdfa per indicare che è presente una risposta.
     */

    public function createReply() {
        if (!(isset($_POST['article'])))
            return ErrorController::badReq('L\' article deve essere specificato!!');
        if (!(isset($_POST['serverID'])))
            return ErrorController::badReq('Il serverID deve essere specificato!!');
        if (!(isset($_POST['userID'])))
            return ErrorController::badReq('Il userID deve essere specificato!!');
        if (!(isset($_POST['postID'])))
            return ErrorController::badReq('Il postID deve essere specificato!!');
        $sID = $_POST['serverID'];
        $uID = $_POST['userID'];
        $pID = $_POST['postID'];
        $resource = 'spam:/' . $sID . '/' . $uID . '/' . $pID;
        if ($sID == 'Spammers') {
            if ($this->articolo->postExist($resource)) {
                $this->createPost();
                $risorsa = $this->articolo->addReplyOf($resource);
                list($tag, $s, $u, $p) = split('/', $risorsa);
                $this->articolo->addHasReply($resource);
            } else
                return ErrorController::notFound('Il post non esiste e non è possibile creare una risposta');
        }else {
            $this->createPost();
            $risorsa = $this->articolo->addReplyOf($resource);
            list($tag, $s, $u, $p) = split('/', $risorsa);
            $this->load()->helper('DooRestClient');
            $request = new DooRestClient;
            $servers = new SRVModel($request);
            $url = $servers->getUrl($sID);
            if ($url) {
                $request->connect_to($url . '/hasreply')
                        ->data(array('serverID' => $s, 'userID' => $u, 'postID' => $p, 'userID2Up' => $uID, 'postID2Up' => $pID))
                        ->post();
                if (!($request->isSuccess()))
                    return $request->resultCode();
            }
            return ErrorController::notFound('Il server non esiste');
        }
    }

    public function hasReply() {
        $this->articolo = new PostModel();
        if (!(isset($_POST['serverID'])))
            return ErrorController::badReq('Il serverID deve essere specificato!!');
        if (!(isset($_POST['userID'])))
            return ErrorController::badReq('Il userID deve essere specificato!!');
        if (!(isset($_POST['postID'])))
            return ErrorController::badReq('Il postID deve essere specificato!!');
        if (!(isset($_POST['userID2Up'])))
            return ErrorController::badReq('Il userID2Up deve essere specificato!!');
        if (!(isset($_POST['postID2Up'])))
            return ErrorController::badReq('Il postID2Up deve essere specificato!!');
        $serverID = $_POST['serverID'];
        $userID = $_POST['userID'];
        $postID = $_POST['postID'];
        $myUser = $_POST['userID2Up'];
        $myPost = $_POST['postID2Up'];
        $resource = 'spam:/Spammers/' . $myUser . '/' . $myPost;
        $pathOfReply = 'spam:/' . $serverID . '/' . $userID . '/' . $postID;
        if ($this->articolo->postExist($resource))
            $this->articolo->addHasReply($resource, $pathOfReply);
        else
            return ErrorController::notFound('Il post non esiste!');
    }

}

?>
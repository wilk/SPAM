<?php

include_once 'protected/model/PostModel.php';
include_once 'protected/model/UserModel.php';
include_once 'protected/model/SRVModel.php';
include_once 'protected/view/PostView.php';

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

    public function createPost($content = null) {
        /* Recupero nella variabile $content tutto quello che mi viene passato tramite POST
         */

        if (!$content)
            $mycontent = $_POST['article'];
        else
            $mycontent=$content;
        $this->articolo = new PostModel();
        if ($pID = $this->articolo->parseArticle($mycontent)) {
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
        if ($server != 'Spammers') {
            $this->load()->helper('DooRestClient');
            $request = new DooRestClient;
            $url = SRVModel::getUrl($request, $server);
            $request->connect_to($url . '/postserver/' . $user . '/' . $post)
                    ->accept(DooRestClient::HTML)
                    ->get();
            if ($request->isSuccess()) {
                $content = $request->result();
                $this->setContentType('html');
                print $content;
            } else {
                return $request->resultCode();
            }
        }
        $this->articolo = new PostModel();
        $myPost = $this->articolo->getPost('spam:/' . $server . '/' . $user . '/' . $post);
        $htmlPost = PostView::renderPost($myPost, $user, $post);
        print $htmlPost;
    }

    /* il respam crea un messaggio sul server quando il client gli passa
     * un <article> esattamente come accade in createPost;
     * al momento lascio cmq il suo metodo */

    public function createRespam() {
        $serverID = $_POST['serverID'];
        $userID = $_POST['userID'];
        $postID = $_POST['postID'];
        if ($serverID == "Spammers") {
            $this->articolo = new PostModel();
            $myPost = $this->articolo->getPost('spam:/' . $serverID . '/' . $userID . '/' . $postID);
            if ($pID = $this->articolo->parseArticle('<article>' . $myPost['sioc:content'][0] . '</article>')) {
                $utente = new UserModel($_SESSION['user']['username']);
                $utente->addPost2Usr($pID);
            }
        } else {
            $this->load()->helper('DooRestClient');
            $request = new DooRestClient;
            $url = SRVModel::getUrl($request, $serverID);
            $request->connect_to($url . '/postserver/' . $userID . '/' . $postID)
                    ->accept(DooRestClient::HTML)
                    ->get();
            if ($request->isSuccess()) {
                $content = $request->result();
                $this->createPost($content);
            }else
                return 404;
        }
        $this->articolo->addRespamOf('spam:/' . $serverID . '/' . $userID . '/' . $postID);
    }

    public function createReply() {
        $this->createPost();
        $sID = $_POST['serverID'];
        $uID = $_POST['userID'];
        $pID = $_POST['postID'];
        $resource = 'spam:/' . $sID . '/' . $uID . '/' . $pID;
        $risorsa = $this->articolo->addReplyOf($resource);
        list($tag, $s, $u, $p) = split('[/]', $risorsa);
        if ($sID == 'Spammers') {
            $this->articolo->addHasReply($resource);
        } else {
            $this->load()->helper('DooRestClient');
            $request = new DooRestClient;
            $url = SRVModel::getUrl($request, $sID);
            $request->connect_to($url . '/hasreply')
                    ->data(array('serverID' => $s, 'userID' => $u, 'postID' => $p, 'userID2Up' => $uID, 'postID2Up' => $pID))
                    ->post();
            if (!($request->isSuccess()))
                return 500;
        }
    }

    public function hasReply() {
        $this->articolo = new PostModel();
        $serverID = $_POST['serverID'];
        $userID = $_POST['userID'];
        $postID = $_POST['postID'];
        $myUser = $_POST['userID2Up'];
        $myPost = $_POST['postID2Up'];
        $resource = 'spam:/Spammers/' . $myUser . '/' . $myPost;
        $pathOfReply = 'spam:/' . $serverID . '/' . $userID . '/' . $postID;
        $this->articolo->addHasReply($resource, $pathOfReply);
    }

}

?>
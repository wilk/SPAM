<?php

include_once 'protected/model/PostModel.php';
include_once 'protected/model/SRVModel.php';

class LikeController extends DooController {
    /* questa si occupa di soddisfare il client */

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

    public function setLike() {
        $serverID = $_POST['serverID'];
        $userID = $_POST['userID'];
        $postID = $_POST['postID'];
        $value = $_POST['value'];
        if ($serverID == "Spammers") {
            $this->articolo = new PostModel();
            $p = 'spam:/' . $serverID . '/' . $userID . '/' . $postID;
            $this->articolo->addLike($p, $value, $_SESSION['user']['username']);
        } else {
            $this->load()->helper('DooRestClient');
            $request = new DooRestClient;
            $url = SRVModel::getUrl($request, $serverID);
            $request->connect_to($url . '/propagatelike')
                    ->data(array('serverID1' => "Spammers", 'userID1' => $_SESSION['user']['username'], 'value' => $value, 'serverID2' => $serverID, 'userID2Up' => $userID, 'postID2Up' => $postID))
                    ->post();
            if (!($request->isSuccess()))
                return 500;
        }
    }

    /* informa della preferenza il server che possiede il messaggio */

    public function propagateLike() {
        $serverID1 = $_POST['serverID1'];
        $userID1 = $_POST['userID1'];
        $userID2 = $_POST['userID2'];
        $postID2 = $_POST['postID2'];
        $value = $_POST['value'];
        $this->articolo = new PostModel();
        $p = 'spam:/Spammers' . '/' . $userID2 . '/' . $postID2;
        $this->articolo->addLike($p, $value, $userID1, $serverID1);
    }

}

?>

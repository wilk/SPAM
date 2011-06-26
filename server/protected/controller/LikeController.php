<?php

include_once 'protected/model/PostModel.php';
include_once 'protected/model/SRVModel.php';
include_once 'protected/controller/ErrorController.php';

class LikeController extends DooController {

    public $articolo;
    /*
     * Controllo dell'acl. Verifica se l'utente è loggato o meno 
     */

    public function beforeRun($resource, $action) {
        session_name("ltwlogin");
        session_start();
        if (!(isset($_SESSION['user']['username']))) {
            if (ini_get("session.use_cookies")) {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]
                );
            }
            //termino la sessione e creo quella per utente non loggato
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

    /**
     * Setta il like/unlike dell'utente
     * Se il post non si trova sul server locale, invia la richiesta al server interessato
     */
    public function setLike() {
        //Controllo che tutte le variabili post siano state inviate
        if (!(isset($_POST['serverID'])))
            return ErrorController::badReq('Il serverID deve essere specificato!!');
        if (!(isset($_POST['userID'])))
            return ErrorController::badReq('Il userID deve essere specificato!!');
        if (!(isset($_POST['postID'])))
            return ErrorController::badReq('Il postID deve essere specificato!!');
        if (!(isset($_POST['value'])))
            return ErrorController::badReq('Il value deve essere specificato!!');
        $serverID = $_POST['serverID'];
        $userID = $_POST['userID'];
        $postID = $_POST['postID'];
        $value = intval($_POST['value']);
        if ($value != 1 && $value != 0 && $value != -1)
            return ErrorController::badReq('Il value può essere:-1 || 0 || 1. Altri valori non sono ammessi!!');
        if ($serverID == "Spammers") {
            if ($_POST['userID'] != $_SESSION['user']['username']) {
                $this->articolo = new PostModel();
                $p = 'spam:/' . $serverID . '/' . $userID . '/' . $postID;
                if ($this->articolo->postExist($p))
                    $this->articolo->addLike($p, $value, $_SESSION['user']['username']);
                else {
                    return ErrorController::notFound("Il post non esiste! Controlla user e post id.");
                }
            }
            else
                ErrorController::badReq('Nono.. questo non ti è permesso!');
        } else {
            $this->load()->helper('DooRestClient');
            $request = new DooRestClient;
            $servers = new SRVModel($request);
            $url = $servers->getUrl($serverID);
            if ($url) {
                $request->connect_to($url . '/propagatelike')
                        ->data(array('serverID1' => "Spammers", 'userID1' => $_SESSION['user']['username'],
                            'value' => $value,
                            'serverID2' => $serverID, 'userID2Up' => $userID, 'postID2Up' => $postID))
                        ->post();
                if (!($request->isSuccess())) {
                    return $request->resultCode();
                }
            } else {
                return ErrorController::notFound("Il server non esiste!");
            }
        }
    }

    /**
     * Propaga il setLike generato su un server esterno
     * 
     * @return Status code
     */
    public function propagateLike() {
        if (!(isset($_POST['serverID1'])))
            return ErrorController::badReq('Il serverID1 deve essere specificato!!');
        if (!(isset($_POST['userID1'])))
            return ErrorController::badReq('Il userID1 deve essere specificato!!');
        if (!(isset($_POST['serverID2'])))
            return ErrorController::badReq('Il serverID2 deve essere specificato!!');
        if (!(isset($_POST['userID2'])))
            return ErrorController::badReq('Il userID2 deve essere specificato!!');
        if (!(isset($_POST['postID2'])))
            return ErrorController::badReq('Il postID2 deve essere specificato!!');
        if (!(isset($_POST['value'])))
            return ErrorController::badReq('Il value deve essere specificato!!');
        if ($_POST['serverID2'] != 'Spammers')
            return ErrorController::badReq('Il serverID non corrisponde. Non posso propagare il setLike!');
        $serverID1 = $_POST['serverID1'];
        $userID1 = $_POST['userID1'];
        $userID2 = $_POST['userID2'];
        $postID2 = $_POST['postID2'];
        $value = $_POST['value'];
        $this->articolo = new PostModel();
        $p = 'spam:/Spammers' . '/' . $userID2 . '/' . $postID2;
        if ($this->articolo->postExist($p))
            $this->articolo->addLike($p, $value, $userID1, $serverID1);
        else {
            return ErrorController::notFound("Il post non esiste! Controlla user e post id.");
        }
    }

}

?>
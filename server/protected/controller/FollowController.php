<?php

include_once 'protected/model/UserModel.php';
include_once 'protected/controller/ErrorController.php';
include_once 'protected/view/FollowView.php';

class FollowController extends DooController {
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

    /*
     * Aggiunge l'utente specificato nella lista degli utenti seguiti dal client.
     */

    public function setFollow() {
        //Controllo che tutte le variabili post siano state inviate
        if (!(isset($_POST['serverID'])))
            return ErrorController::badReq('Il serverID deve essere specificato!!');
        if (!(isset($_POST['userID'])))
            return ErrorController::badReq('Il userID deve essere specificato!!');
        if (!(isset($_POST['value'])))
            return ErrorController::badReq('Il value deve essere specificato!!');
        $value = intval($_POST['value']);
        if ($value != 1 && $value != 0)
            return ErrorController::badReq('Il value può essere: 0 o 1. Altri valori non sono ammessi!!');
        /* Faccio un piccolo controllo:
         * se l'utente da seguire è sul mio server, controllo se esiste. 
         */
        if ($_POST['serverID'] == 'Spammers') {
            if ($_POST['userID'] != $_SESSION['user']['username']) {
                $test = new UserModel($_POST['userID']);
                if (!$test->ifUserExist()) {
                    return ErrorController::notFound("L'utente che si vuole seguire non esiste su questo server.");
                }
            } else
                ErrorController::badReq('Non puoi seguirti ci pensa la tua ombra a farlo!');
        }
        $risorsa = 'spam:/' . $_POST['serverID'] . '/' . $_POST['userID'];
        $utente = new UserModel($_SESSION['user']['username']);
        $utente->handleFollow($risorsa, $value);
    }

    //nudo e crudo senza controlli
    public function getFollows() {

        $utente = new UserModel($_SESSION['user']['username']);
        $lista = $utente->getFollows();
        //Ho modificato facendo stampare una lista vuota invece di un 404, credo sia più appropriato
        if (sizeof($lista) == 0)
        //return ErrorController::notFound("L'utente non ha followers!");
            $lista = array();
        $this->setContentType('xml');
        print FollowView::renderFollows($lista);
    }

}

?>
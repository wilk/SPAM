<?php

include_once 'protected/model/UserModel.php';

class FollowController extends DooController {

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
        }else
            $role = $_SESSION['user']['group'];

        //if not login, group = anonymous
        //$role = (isset($_SESSION['user']['group'])) ? $_SESSION['user']['group'] : 'anonymous';
        //check against the ACL rules
        if ($rs = $this->acl()->process($role, $resource, $action)) {
            //echo $role .' is not allowed for '. $resource . ' '. $action;
            return $rs;
        }
    }

    public function setFollow() {
        if (!(isset($_POST['serverID'])) &&
                !(isset($_POST['userID'])) &&
                !(isset($_POST['value']))) {
            //mancano parametri (i.e. la richiesta è stata formulata male)
            return 406;
        } else {
            /* Faccio un piccolo controllo:
             * se l'utente da seguire è sul mio server, controllo se esiste. 
             */
            if ($_POST['serverID'] == 'Spammers') {
                $test = new UserModel($_POST['userID']);
                if (!$test->ifUserExist()) {
                    echo "Errore: l'utente che si vuole seguire non esiste su questo server.";
                    return 500;
                }
            }
            $risorsa = 'spam:/' . $_POST['serverID'] . '/' . $_POST['userID'];
            $v = intval($_POST['value']);
            //mi aspetto solo i valori 1 o 0, altrimenti i parametri non sono corretti.
            if (($v != 1) && ($v != 0))
                return 406;
            $utente = new UserModel($_SESSION['user']['username']);
            $utente->handleFollow($risorsa, $v);
        }
    }

}

?>
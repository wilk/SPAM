<?php

include_once 'protected/model/UserModel.php';
include_once 'protected/model/SRVModel.php';
include_once 'protected/controller/ErrorController.php';

class LoginController extends DooController {
    /*
     * Esegue login utente, creandolo se non esiste. 
     */

    public function authUser() {
        $this->load()->helper('DooRestClient');
        $request = new DooRestClient;
        if (!(isset($_POST['username'])))
            return ErrorController::badReq('L\' username deve essere specificato!!');
        $user=$_POST['username'];
        $user = str_replace(' ', '_', $user);
        $utente = new UserModel($user);
        if ($utente->firstTime()) {
            $utente->addUser();
            //cerco di arricchire la risorsa con i servers            
            $listaServer = SRVModel::getDefaults($request);
            $utente->setServers($listaServer);
            $this->startSession($user);
            return 201;
        } else {
            $this->startSession($user);
        }
    }

    /*
     * Avvia la sessione dell'utente loggato generando il cookie ltwlogin.
     */

    private function startSession($user) {
        session_name("nologin");
        session_start();
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
        session_name('ltwlogin');
        session_start();
        if (isset($_SESSION['user']))
            unset($_SESSION['user']);
        $_SESSION['user'] = array(
            'username' => $user,
            'group' => 'logged',
        );
    }

    /*
     * Esegue logout utente. Elimina il cookie ltwlogin e distrugge la sessione.
     */

    public function logout() {
        session_name('ltwlogin');
        session_start();
        //Elimino i dati dalla sessione
        unset($_SESSION['user']);
        //Se c'è un cookie lo elimino
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]
            );
        }
        //termino la sessione
        session_destroy();
    }

}

?>
<?php

include_once 'protected/model/UserModel.php';
include_once 'protected/model/SRVModel.php';

class LoginController extends DooController {

    public function authUser() {
        $this->load()->helper('DooRestClient');
        $request = new DooRestClient;
        $user = strtolower($_POST['username']);
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
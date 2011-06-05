<?php

include 'protected/model/UserModel.php';

class LoginController extends DooController {
    
    static private $_SERVERLIST =
        "http://vitali.web.cs.unibo.it/twiki/pub/TechWeb11/Spam/ServerFederatiGiusta.xml";
    
    public function authUser() {
        $this->load()->helper('DooRestClient');
        $request = new DooRestClient;
        $user = strtolower($_POST['username']);
        $utente = new UserModel($user);
        if ($utente->firstTime()) {
            $utente->addUser();
            //cerco di arricchire la risorsa con i servers
            $idsServer = array();
            $request->connect_to("http://vitali.web.cs.unibo.it/twiki/pub/TechWeb11/Spam/ServerFederatiGiusta.xml")->get();
            $serverList = $request->xml_result();
            foreach ($serverList->server as $myServer)
                array_push($idsServer, (string) $myServer->attributes()->serverID);
            print_r($idsServer);
            $this->startSession($user);
            return 201; } 
        else {
        $this->startSession($user);
        return 200; }
    }
//
//    private function addUser($user) {
//        $this->load()->helper('DooRestClient');
//        $request = new DooRestClient;
//        $usersList = simplexml_load_file('users.xml');
//        $usersList->addChild('user', $user);
//        @file_put_contents("users.xml", $usersList->saveXML());
//        mkdir("data/" . $user, 0777);
//        $request->connect_to("http://vitali.web.cs.unibo.it/twiki/pub/TechWeb11/Spam/server.xml")->get();
//        $serverList = $request->xml_result();
//        @file_put_contents('data/' . $user . "/servers.xml", $serverList->saveXML());
//    }
//    
    private function startSession($user) {
        session_start();
        if (isset($_SESSION['user']))
            unset($_SESSION['user']);
        //imposto un cookie per far lavorare vins
        //setcookie('nick', $user, time()+3600, "/");
        $_SESSION['user'] = array(
            'username' => $user,
            'group' => 'logged',
        );
    }

    public function logout() {
        session_start();
        //Elimino i dati dalla sessione
        unset($_SESSION['user']);
        //Se c'è un cookie lo elimino
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]
            );
        //brutalmente elimino il cookie del nick
        //setcookie('nick', '', time()-3600, "/");   
        }
        //termino la sessione
        session_destroy();
        return 200;
    }

}

?>

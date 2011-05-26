<?php

class LoginController extends DooController {

    public function authUser() {
        $user = strtolower($_POST['username']);
        if ($this->firstTime($user)) {
            $this->addUser($user);
            $this->startSession($user);
            return 201;
        } else {
            $this->startSession($user);
            return 200;
        }
    }

    private function firstTime($user) {
        $usersList = simplexml_load_file("users.xml");
        foreach ($usersList->user as $myUser) {
            if ($myUser == $user)
                return false;
        }
        return true;
    }

    private function addUser($user) {
        $this->load()->helper('DooRestClient');
        $request = new DooRestClient;
        $usersList = simplexml_load_file('users.xml');
        $usersList->addChild('user', $user);
        @file_put_contents("users.xml", $usersList->saveXML());
        mkdir("data/" . $user, 0777);
        $request->connect_to("http://vitali.web.cs.unibo.it/twiki/pub/TechWeb11/Spam/server.xml")->get();
        $serverList = $request->xml_result();
        @file_put_contents('data/' . $user . "/servers.xml", $serverList->saveXML());
    }

    private function startSession($user) {
        session_start();
        if (isset($_SESSION['user']))
            unset($_SESSION['user']);
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
        }
        //termino la sessione
        session_destroy();
        return 200;
    }

}

?>

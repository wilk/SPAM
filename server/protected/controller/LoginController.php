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
        $_SESSION['user'] = array(
            'username' => $user,
            'group' => 'logged',
        );
    }

}

?>

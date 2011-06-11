<?php

include_once 'protected/model/UserModel.php';
include_once 'protected/view/ServersView.php';

class ServersController extends DooController {

    public function beforeRun($resource, $action) {
        session_name('ltwlogin');
        session_start();

        //if not login, group = anonymous
        $role = (isset($_SESSION['user']['group'])) ? $_SESSION['user']['group'] : 'anonymous';

        //check against the ACL rules
        if ($rs = $this->acl()->process($role, $resource, $action)) {
            //echo $role .' is not allowed for '. $resource . ' '. $action;
            return $rs;
        }
    }

    public function sendServersList() {
        if (isset($_SESSION['user']['username'])) {
            $user = new UserModel($_SESSION['user']['username']);
            $xmlServer = ServersView::createXml($user->getServers());
        }
        else{
            $xmlServer=simplexml_load_file("http://vitali.web.cs.unibo.it/twiki/pub/TechWeb11/Spam/ServerFederatiGiusta.xml");
            $xmlServer= $xmlServer->asXML();
        }
        $this->setContentType('xml');
        print $xmlServer;
    }

    public function rewriteServersList() {
        ;
    }

}

?>
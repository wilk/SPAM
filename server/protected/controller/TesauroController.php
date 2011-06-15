<?php

include_once 'protected/model/ThesModel.php';

class TesauroController extends DooController {
    
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

    public function addTerm() {
        if (!(isset ($_POST['parentterm']))||!(isset ($_POST['term']))){
            echo "Sia parentterm che term devono essere specificati";
            return 400;
        }
        $parent= $_POST['parentterm'];
        $term=str_replace(" ", "_", $_POST['term']);
        if ($parent==$term){
            echo "I termini non possono essere uguali";
            return 400;
        }
        $thes = new ThesModel();
        if (!($thes->extendTesauro($parent, $term)))
            return 400;
        else return 201;
    }

    public function sendThesaurus() {
        $thes = new ThesModel();
        $tesauro = $thes->getTesauro();
        header('Content-type: application/rdf+xml');
        print $tesauro;
    }

}

?>

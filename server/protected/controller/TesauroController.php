<?php

include_once 'protected/model/ThesModel.php';
include_once 'protected/controller/ErrorController.php';

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
            return ErrorController::badReq("Sia parentterm che term devono essere specificati");
        }
        $parent= strtolower($_POST['parentterm']);
        $term=strtolower(str_replace(" ", "_", $_POST['term']));
        if ($parent==$term){
            return ErrorController::badReq("I termini non possono essere uguali");
        }
        $thes = new ThesModel();
        $parentPath = $thes->returnPath($parent);
        if ($parentPath == false)
            return ErrorController::badReq("Il parentterm non esiste nel tesauro");
        if (count(explode('/', $parentPath))<3)
                return ErrorController::badReq("Il parenterm non è una foglia del tesauro condiviso");
        $termPath = $thes->returnPath($term);
        if ($termPath!= false){
            return ErrorController::badReq("Il term esiste già! Non è possibile aggiungere termini con lo stesso label!");
        }
        if (!$thes->extendThes($parentPath, $term))
            return 500;
        else return 200;
    }

    /*
     * Ritorna il tesauro condiviso più l'esteso in formato rdf/xml
     */
    public function sendThesaurus() {
        $thes = new ThesModel();
        $tesauro = $thes->getTesauro();
        header('Content-type: application/rdf+xml');
        print $tesauro;
    }

}

?>
